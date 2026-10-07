// Renders every post's Band into dist/, after `astro build`.
//
// Why a browser is in this pipeline at all is ADR 0001. The short version: a Sketch is p5, p5
// wants a DOM, and running it in the reader's browser cost ~1.4s of main thread on a page meant
// for a 30-second skim.
//
// Order matters. This runs AFTER the build, writing into dist/, because the page it renders is
// itself a build output. Running before the build would mean generating into public/ and copying,
// which puts the images in the repo for no reason.

import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import { load } from 'js-yaml';
import { chromium } from 'playwright';
import sharp from 'sharp';
// `.ts`, and loaded by path: Node 22 strips types natively, but its resolver does not follow the
// extensionless specifiers TypeScript allows. These erase to nothing a bundler is needed for.
import { toSvg } from '../src/bands/vector.ts';
import { ACCENT } from '../src/theme.ts';

const DIST = 'dist';
const POSTS = 'src/content/posts';
const CACHE = 'node_modules/.cache/bands';

// A Band is ONE image, and it tiles.
//
// The field wraps in x (see trails.ts), so the full-width render is a seamless loop: repeat-x
// covers any viewport, however wide, with no seam and no second asset. That removes the problem
// srcset has here — a full-bleed fixed-height band has a viewport-dependent aspect ratio, so
// `w`-descriptor candidates are not the same image at different sizes, and object-fit would crop
// vertically, discarding the reflection edges at top and bottom that give the Band its shape.
//
// Served at 1x. The 2x asset is 661KB against 103KB, for a dim decorative strip above the fold on
// a site built for a 30-second skim. Quality is not a lever worth pulling: the content is noise,
// and dropping quality from 80 to 40 saves 7%.
const WIDTH = 3440;
const HEIGHT = 240;

// Rendered at 2x and resized down, so the 1x asset is supersampled rather than aliased.
const SCALE = 2;

/**
 * Posts whose frontmatter asks for a Band.
 *
 * Parsed as YAML, not matched with a regex. A regex here is a second, weaker copy of the contract
 * `src/content.config.ts` already states: it would silently skip a post that reordered the keys or
 * used double quotes, and the page would still emit a background-image pointing at an asset this
 * never rendered. A missing Band would reach the reader as a 404 with nothing in the build log.
 */
async function bandedPosts() {
	const out = [];
	for (const file of await readdir(POSTS)) {
		if (!file.endsWith('.md')) continue;
		// The BOM is stripped because `^---$` would not match a first line carrying one, so the split
		// would hand the post *body* to the YAML parser — which either throws on prose or returns a
		// string with no `band` on it, skipping the post in silence. Exactly the failure this parses
		// rather than regex-matches to avoid, one character upstream of the parse.
		const raw = await readFile(join(POSTS, file), 'utf8');
		const text = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
		const front = text.split(/^---$/m)[1];
		if (!front) continue;
		const { band } = load(front) ?? {};
		if (!band) continue;
		if (typeof band.sketch !== 'string' || !Number.isInteger(band.seed)) {
			throw new Error(
				`${file}: band needs a string sketch and an integer seed, got ${JSON.stringify(band)}`
			);
		}
		out.push({ slug: file.replace(/\.md$/, ''), sketch: band.sketch, seed: band.seed });
	}
	return out;
}

/**
 * Identity of a rendered Band: everything that can legitimately change the pixels.
 *
 * Determinism is what makes this a valid key — same Sketch, same Seed, same output — and ADR 0001
 * says so explicitly, which is the standard this has to meet. So the hash covers the Sketch, the
 * Harness, the render page being screenshotted, and the pinned p5 build, not just the first two:
 * p5's random() and noise() have changed across releases, so a version bump that did not bust the
 * cache would silently keep serving an image the current code would no longer produce.
 *
 * The registry is in there for the same reason. The Sketch is hashed by path, but the path is
 * derived from a name the registry resolves, so pointing `trails` at a different module would
 * change every pixel without changing any file this otherwise reads.
 *
 * Editing only a comment in any of these re-renders to identical bytes, which is harmless.
 */
async function fingerprint(sketch, seed) {
	const parts = await Promise.all(
		[
			`src/bands/${sketch}.ts`,
			'src/bands/index.ts',
			'src/bands/harness.ts',
			'src/bands/cdn.ts',
			'src/theme.ts',
			'src/pages/band-render.astro'
		].map((f) => readFile(f, 'utf8'))
	);
	const hash = createHash('sha256');
	for (const part of parts) hash.update(part);
	return hash.update(JSON.stringify({ seed, WIDTH, HEIGHT, SCALE })).digest('hex').slice(0, 16);
}

/** Serves dist/ so the render target can be loaded over http rather than file://. */
function serve(root, port) {
	const types = {
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.css': 'text/css',
		'.json': 'application/json',
		'.webp': 'image/webp',
		'.png': 'image/png',
		'.svg': 'image/svg+xml'
	};
	const server = createServer(async (req, res) => {
		try {
			let path = join(root, decodeURIComponent(req.url.split('?')[0]));
			if (existsSync(path) && (await stat(path)).isDirectory()) path = join(path, 'index.html');
			if (!existsSync(path) && existsSync(`${path}.html`)) path = `${path}.html`;
			const body = await readFile(path);
			res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
			res.end(body);
		} catch {
			res.writeHead(404).end('not found');
		}
	});
	return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

/** Runs one Sketch at full width and returns the raw PNG the canvas produced. */
async function capture(page, { sketch, seed }) {
	const url = `http://127.0.0.1:4178/band-render?sketch=${sketch}&seed=${seed}&w=${WIDTH}&h=${HEIGHT}`;
	await page.goto(url, { waitUntil: 'load' });

	// The Harness sets `__bandReady` once the Sketch resolves, and `__bandError` if it throws.
	// Screenshotting on a timer instead would capture whatever had been drawn by then, which for a
	// 320-step simulation is a half-grown one. Waiting on either means a Sketch that throws fails in
	// the second it takes rather than burning the full timeout to say nothing useful.
	await page.waitForFunction(() => window.__bandReady === true || window.__bandError, null, {
		timeout: 120_000
	});

	const failed = await page.evaluate(() => window.__bandError);
	if (failed) throw new Error(`${sketch}/${seed}: ${failed}`);

	const dataUrl = await page.evaluate(() =>
		document.querySelector('canvas').toDataURL('image/png')
	);
	return Buffer.from(dataUrl.split(',')[1], 'base64');
}

/**
 * Writes a vector Band: run the Sketch in this process, serialise, done.
 *
 * No browser, no screenshot, no resize, no encode — and no cache either. The whole thing is about
 * a second of arithmetic, where a raster Band is a Chromium launch, so a cache entry would cost
 * more to maintain than it saves.
 */
async function renderVector(post, sketch) {
	const started = Date.now();
	const svg = toSvg(sketch({ width: WIDTH, height: HEIGHT, seed: post.seed, accent: ACCENT }));
	await mkdir(join(DIST, 'writing', post.slug), { recursive: true });
	await writeFile(join(DIST, 'writing', post.slug, 'band.svg'), svg);
	console.log(
		`bands: ${post.slug} (${post.sketch}/${post.seed}) ${Date.now() - started}ms ` +
			`svg ${(svg.length / 1024).toFixed(0)}KB`
	);
}

async function main() {
	const posts = await bandedPosts();
	if (!posts.length) return console.log('bands: no posts ask for one');

	// Vector Bands first, and separately: they need none of the apparatus below, so a site whose
	// Sketches are all vector never launches Chromium at all.
	const { vectors } = await import('../src/bands/index.ts');
	const raster = [];
	for (const post of posts) {
		const vector = vectors[post.sketch];
		if (vector) await renderVector(post, vector);
		else raster.push(post);
	}
	if (!raster.length) return;

	await mkdir(CACHE, { recursive: true });
	const server = await serve(DIST, 4178);
	const browser = await chromium.launch();
	const page = await browser.newPage({ deviceScaleFactor: SCALE });

	for (const post of raster) {
		const id = await fingerprint(post.sketch, post.seed);
		const cached = join(CACHE, `${id}.png`);
		let png;

		if (existsSync(cached)) {
			png = await readFile(cached);
			console.log(`bands: ${post.slug} (${post.sketch}/${post.seed}) cached`);
		} else {
			const started = Date.now();
			png = await capture(page, post);
			await writeFile(cached, png);
			console.log(`bands: ${post.slug} (${post.sketch}/${post.seed}) ${Date.now() - started}ms`);
		}

		await mkdir(join(DIST, 'writing', post.slug), { recursive: true });
		await sharp(png)
			.resize({ width: WIDTH, height: HEIGHT })
			// The Band always sits on the page background, so an alpha channel is bytes spent on a
			// transparency nothing uses.
			.flatten({ background: '#0a0c10' })
			.webp({ quality: 70, effort: 6 })
			.toFile(join(DIST, 'writing', post.slug, 'band.webp'));
	}

	await browser.close();
	server.close();

	// The render target is scaffolding, not a page. It ships otherwise.
	await rm(join(DIST, 'band-render'), { recursive: true, force: true });
	await rm(join(DIST, 'band-render.html'), { force: true });
}

await main();
