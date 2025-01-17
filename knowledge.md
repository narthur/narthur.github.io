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
  - White background
  - Dark gray (#333) for main text
  - Light gray (#666) for secondary text
  - Blue (#0066cc) for links
  - Light gray (#ddd) for borders
  Dark mode:
  - Dark gray (#1a1a1a) background
  - White for main text
  - Light gray (#999) for secondary text
  - Light blue (#66b3ff) for links
  - Subtle dark gray (#333) for borders and separators
  - Slightly lighter gray (#444) for hover states
  - Defaults to system preference
  - Syncs with system preference changes
  - Uses inline script in app.html to prevent flash of wrong theme
- Prefer subtle transitions for interactions
- Keep layout spacious and readable
- Always set explicit width and height on icons to prevent layout shift

## Content Guidelines
- Highlight key projects and professional profiles
- Keep descriptions concise and focused
- Maintain up-to-date links to active projects

## Build Configuration
- Site uses @sveltejs/adapter-static for static deployment
- Requires `export const prerender = true` in root +layout.ts for successful static build
- Run `pnpm build` to build the site
