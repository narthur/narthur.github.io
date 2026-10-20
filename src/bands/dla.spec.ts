import { describe, expect, it } from 'vitest';
import { PARAMS, geometry, grow } from './dla';
import { rng } from './vector';

/**
 * What a wrong DLA still draws is a plausible tangle, so these assert the aggregation's own rules:
 * every particle stuck to one already there, the cluster stayed off the ceiling, and a Seed is a
 * picture rather than a roll of the dice.
 */
describe('grow', () => {
	const { GW, GH } = PARAMS;
	const nodes = grow(GW, GH, rng(1));

	it('attaches every particle to an earlier neighbour, across the x seam too', () => {
		for (const [i, n] of nodes.entries()) {
			if (n.parent < 0) {
				expect(n.y).toBe(0);
				continue;
			}
			const p = nodes[n.parent];
			expect(n.parent).toBeLessThan(i);
			expect(n.tree).toBe(p.tree);
			const dx = Math.abs(n.x - p.x);
			expect(Math.min(dx, GW - dx)).toBeLessThanOrEqual(1);
			expect(Math.abs(n.y - p.y)).toBeLessThanOrEqual(1);
		}
	});

	it('stops below the ceiling, where walkers would creep along the top edge', () => {
		// CAP 1 is unreachable, so only the ceiling check ends this run. Checked by removing it: the
		// run then jams near the top and never finishes, so the regression shows as a hang, not a red.
		const tall = grow(GW, GH, rng(1), { ...PARAMS, CAP: 1 });
		expect(Math.max(...tall.map((n) => n.y))).toBeLessThan(GH - 3);
		expect(tall.length).toBeLessThan(PARAMS.MAX);
	});

	it('is a pure function of the seed', () => {
		const svg = (seed: number) =>
			JSON.stringify(geometry({ width: 3440, height: 240, seed, accent: '#8ded51' }));
		expect(svg(3)).toBe(svg(3));
		expect(svg(3)).not.toBe(svg(4));
	});
});
