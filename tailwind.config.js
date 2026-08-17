/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			// ponytail: dark-only site, so these are the whole palette — no light variants.
			colors: {
				bg: '#0a0c10',
				ink: '#e8e9ec',
				mute: '#8a919e',
				faint: '#5c6470',
				rule: '#1c212a',
				accent: '#d9a05b'
			},
			fontFamily: {
				sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
				mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
			}
		}
	}
};
