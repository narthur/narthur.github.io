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
import { chromium } from 'playwright';
import sharp from 'sharp';

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

/** Posts whose frontmatter asks for a Band. */
async function bandedPosts() {
	const out = [];
	for (const file of await readdir(POSTS)) {
		if (!file.endsWith('.md')) continue;
		const body = await readFile(join(POSTS, file), 'utf8');
		const front = body.split('---')[1] ?? '';
		const match = front.match(/^band:\s*\{\s*sketch:\s*'([^']+)',\s*seed:\s*(-?\d+)\s*\}/m);
		if (match)
			out.push({ slug: file.replace(/\.md$/, ''), sketch: match[1], seed: Number(match[2]) });
	}
	return out;
}

/**
 * Identity of a rendered Band. Determinism is what makes this a valid cache key — same Sketch,
 * same Seed, same pixels — and it is also why determinism is load-bearing rather than incidental
 * (ADR 0001). The Sketch's source is hashed, so editing it invalidates; editing only its comments
 * invalidates too and re-renders to identical bytes, which is harmless.
 */
async function fingerprint(sketch, seed) {
	const source = await readFile(`src/bands/${sketch}.ts`, 'utf8');
	const harness = await readFile('src/bands/harness.ts', 'utf8');
	return createHash('sha256')
		.update(source)
		.update(harness)
		.update(JSON.stringify({ seed, WIDTH, HEIGHT, SCALE }))
		.digest('hex')
		.slice(0, 16);
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

	const failed = await page.evaluate(() => window.__bandError);
	if (failed) throw new Error(failed);

	// The Harness sets this once the Sketch resolves. Screenshotting on a timer instead would
	// capture whatever had been drawn by then, which for a 320-step simulation is a half-grown one.
	await page.waitForFunction(() => window.__bandReady === true, null, { timeout: 120_000 });

	const dataUrl = await page.evaluate(() =>
		document.querySelector('canvas').toDataURL('image/png')
	);
	return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function main() {
	const posts = await bandedPosts();
	if (!posts.length) return console.log('bands: no posts ask for one');

	await mkdir(CACHE, { recursive: true });
	const server = await serve(DIST, 4178);
	const browser = await chromium.launch();
	const page = await browser.newPage({ deviceScaleFactor: SCALE });

	for (const post of posts) {
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
