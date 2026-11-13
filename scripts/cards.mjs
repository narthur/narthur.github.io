// Renders every post's Preview image into dist/, after `astro build` and after scripts/bands.mjs,
// since a card shows the post's Band and so needs it already written.
//
// dist/cards.json (src/pages/cards.json.ts) says which cards to make; card-render.astro draws one.
// Both are deleted afterwards, so neither ships.
//
// ponytail: no cache. Every card re-renders on every build, which measured 6.7s for 79 cards.
// Add one keyed like bands.mjs's if the post count makes that hurt.

import { readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const DIST = 'dist';
const ORIGIN = 'http://cards.local';

const cards = JSON.parse(await readFile(join(DIST, 'cards.json'), 'utf8'));
const started = Date.now();
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	// Serve dist/ straight from disk; the render page's assets are root-relative.
	await page.route(`${ORIGIN}/**`, (route) =>
		route.fulfill({ path: join(DIST, decodeURIComponent(new URL(route.request().url()).pathname)) })
	);
	for (const { path, title, kind, band } of cards) {
		const query = new URLSearchParams({ title, kind, ...(band && { band }) });
		await page.goto(`${ORIGIN}/card-render.html?${query}`);
		await page.waitForFunction(() => window.__cardReady || window.__cardError, null, {
			timeout: 30_000
		});
		const failed = await page.evaluate(() => window.__cardError);
		if (failed) throw new Error(`cards: ${path}: ${failed}`);
		await page.locator('#card').screenshot({ path: join(DIST, path) });
	}
} finally {
	await browser.close();
	await rm(join(DIST, 'card-render.html'), { force: true });
	await rm(join(DIST, 'cards.json'), { force: true });
}
console.log(`cards: ${cards.length} rendered in ${Date.now() - started}ms`);
