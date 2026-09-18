import yaml from 'js-yaml';
import raw from './work.yaml?raw';
import type { Span } from './chart';

export interface Named extends Span {
	name: string;
}

export interface Project extends Named {
	url?: string;
	meta: string;
	description: string;
	shots?: { file: string; alt: string }[];
}

export const { projects, stack } = yaml.load(raw) as { projects: Project[]; stack: Named[] };
