import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('./shots/**/*.{jpg,png,webp}', {
	eager: true
});

/** A screenshot under src/work/shots, by its path there; a missing one fails the build. */
export function shot(file: string) {
	const found = files[`./shots/${file}`];
	if (!found) throw new Error(`No screenshot at src/work/shots/${file}`);
	return found.default;
}
