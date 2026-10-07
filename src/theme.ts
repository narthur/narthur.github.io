/**
 * The accent the site is themed to, and the single source of `--accent`.
 *
 * `Layout.astro` declares the custom property from this, and so does the Band render target — which
 * has no Layout by design. That matters: a Sketch reading `--accent` off a bare page resolves it to
 * nothing and falls back to a literal, so after a re-theme every Band would keep shipping in the
 * old colour with no error to notice it by. Reading the token has to actually read something.
 *
 * Tailwind's `accent` token is `var(--accent)` (see tailwind.config.js), so it follows either way.
 * `docs/branding.md` treats the accent as a parameter rather than an asset: it has been re-chosen
 * more than once, and the dev-only AccentPicker exists to try candidates against real pages.
 */
export const ACCENT = '#8ded51';

/**
 * The page background a Band is always drawn on.
 *
 * Here rather than inlined because a vector Band paints it into the SVG itself, so that the file
 * stands alone when opened to judge it — which means the literal would otherwise live in a shipped
 * asset as well as in the stylesheet, with nothing tying the two together.
 */
export const BACKGROUND = '#0a0c10';

/**
 * Splits a `#rrggbb` string into its three channels.
 *
 * Here because both constants above get parsed this way and by two different callers — a Sketch
 * mixing toward the accent, and the preview flattening onto the background — so the parsing
 * belongs next to the values rather than copied beside each use.
 *
 * Six digits only, and unguarded: a three-digit shorthand or an `rgb()` string parses as nonsense
 * rather than throwing. That holds today because every colour reaching this is one of the
 * constants above or the `.value` of a native `<input type="color">`, which is a seven-character
 * lowercase hex string. Secondary sources agree the spec's sanitisation algorithm requires that;
 * the primary text was not read, so treat it as the reason the narrow parse is safe rather than a
 * guarantee it always will be. MDN notes newer browsers accept other CSS colour syntaxes in the
 * *attribute* — if one of those ever reaches `.value`, this grows a branch.
 */
export function hexToRgb(hex: string): [number, number, number] {
	return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}
