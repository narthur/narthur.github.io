import { afterEach, describe, expect, it, vi } from 'vitest';
import { mountBand } from './harness.ts';

// A fake p5 that hands back its setup instead of running it, so a test can call render() in the
// window before setup — the one place the dev picker can lose a reseed.
function mountDeferred() {
	let p: Record<string, unknown> = {};
	vi.stubGlobal('document', { documentElement: { clientWidth: 100 } });
	vi.stubGlobal('window', {
		p5: class {
			constructor(cb: (p: unknown) => void) {
				p = {
					createCanvas: () => ({ parent() {} }),
					noLoop() {},
					resizeCanvas() {},
					pixelDensity: () => 1,
					drawingContext: { setTransform() {} },
					clear() {},
					randomSeed() {},
					noiseSeed() {}
				};
				cb(p);
			}
		}
	});
	const seeds: number[] = [];
	const band = mountBand(async () => {}, {
		host: {} as HTMLElement,
		height: 10,
		seed: 1,
		onRender: (s) => seeds.push(s)
	});
	const setup = async () => {
		(p.setup as () => void)();
		await new Promise((r) => setTimeout(r));
	};
	return { band, seeds, setup };
}

describe('mountBand before setup', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('keeps a queued reseed when a seedless render follows it', async () => {
		const { band, seeds, setup } = mountDeferred();
		band.render(5);
		band.render();
		await setup();
		expect(seeds).toEqual([5]);
	});

	it('lets a later seed replace a queued one', async () => {
		const { band, seeds, setup } = mountDeferred();
		band.render(5);
		band.render(7);
		await setup();
		expect(seeds).toEqual([7]);
	});

	it('draws the mount seed when only seedless renders came first', async () => {
		const { band, seeds, setup } = mountDeferred();
		band.render();
		await setup();
		expect(seeds).toEqual([1]);
	});
});
