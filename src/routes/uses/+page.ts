import yaml from 'js-yaml';
import raw from './uses.yaml?raw';
import { allTags, categoriesInOrder, type UsesData } from './filter';

// Parsed at build time — the page prerenders to static HTML with the list baked in,
// so /uses needs no fetch and no JS to render.
export function load() {
	const { items, meta } = yaml.load(raw) as UsesData;
	return { items, meta, categories: categoriesInOrder(items), tags: allTags(items) };
}
