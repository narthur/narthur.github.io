# Nathan Arthur's Personal Website

## Purpose
Personal website showcasing Nathan Arthur's work as a full-stack web developer focused on productivity tools.

## Technical Stack
- SvelteKit for frontend framework
- Static site deployment

## Design Guidelines
- Use Instrument Sans for headings (weights: 400, 500, 700)
- Keep it minimal and clean
- Focus on usability and quick access to projects
- Maintain professional appearance
- Ensure responsive design for all screen sizes
- Color schemes:
  Light mode:
  - Subtle gradient background from gray-50 to gray-100
  - White cards with layered shadows for depth
  - Dark gray (#333) for main text
  - Light gray (#666) for secondary text
  - Blue (#0066cc) for links
  - Light gray (#ddd) for borders
  Dark mode:
  - Subtle gradient background from gray-900 to a darker blue-gray
  - White for main text
  - Light gray (#999) for secondary text
  - Light blue (#66b3ff) for links
  - Subtle dark gray (#333) for borders and separators
  - Slightly lighter gray (#444) for hover states
  - Defaults to system preference
  - Syncs with system preference changes
  - Uses inline script in app.html to prevent flash of wrong theme and check localStorage
  - Must toggle dark mode class on both html and body elements
  - Requires darkMode: 'class' in Tailwind config
  - Persists preference in localStorage
  - Falls back to system preference if no stored value
- Prefer subtle transitions for interactions
- Keep layout spacious and readable
- Always set explicit width and height on icons to prevent layout shift
- Use display: inline-block on icons to ensure width/height are respected

## Content Guidelines
- Highlight key projects and professional profiles
- Keep descriptions concise and focused
- Maintain up-to-date links to active projects
- Add keyboard shortcuts for common actions (e.g., '/' for search)

- Highlight key projects and professional profiles
- Keep descriptions concise and focused
- Maintain up-to-date links to active projects

## Technical Stack
- SvelteKit for frontend framework
- Static site deployment
- Tailwind CSS for styling  - GitHub API integration:
    - Data fetched at build time via script
    - Uses OAuth device flow for authentication
    - Run `pnpm fetch-github` to update stats
    - Stats stored in data/github-stats.json
    - No runtime API calls or caching needed
    - Run `pnpm prefetch-github` to install dependencies
  - Don't use @apply in Svelte style blocks
  - Use Tailwind classes directly in markup
  - Use regular CSS in style blocks when needed

## Services
- GitHub API in services/github/
  - api.ts: Core API interaction and caching
  - types.ts: TypeScript interfaces
  - colors.ts: Language color utilities
  - Don't use @apply in Svelte style blocks
  - Use Tailwind classes directly in markup
  - Use regular CSS in style blocks when needed

## Build Configuration
- Site uses @sveltejs/adapter-static for static deployment
- Requires `export const prerender = true` in root +layout.ts for successful static build
- Run `pnpm build` to build the site
