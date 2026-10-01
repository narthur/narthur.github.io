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
