/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,ts}'],
	theme: {
		extend: {
			// ponytail: dark-only site, so these are the whole palette — no light variants.
			// Text tokens clear WCAG AA (4.5:1) against `bg`: ink 16.1:1, mute 6.2:1,
			// faint 4.8:1, accent 13.4:1. `rule` is decorative hairlines only — never text.
			// `accent` reads --accent, defined in Layout.astro, so it can be themed in one place.
			// `warn` is the only fixed hue besides the greys: an amber that stays distinct from
			// any accent the site is themed to. 10.3:1 on `bg`.
			colors: {
				bg: '#0a0c10',
				ink: '#e8e9ec',
				mute: '#8a919e',
				faint: '#767e8b',
				rule: '#1c212a',
				accent: 'var(--accent)',
				warn: '#e6b455'
			},
			fontFamily: {
				sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
			}
		}
	}
};
