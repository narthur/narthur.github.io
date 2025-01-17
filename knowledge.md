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
- Use a simple, clean color scheme with:
  - White background
  - Dark gray (#333) for main text
  - Light gray (#666) for secondary text
  - Blue (#0066cc) for links
  - Light gray (#ddd) for borders
- Prefer subtle transitions for interactions
- Keep layout spacious and readable

## Content Guidelines
- Highlight key projects and professional profiles
- Keep descriptions concise and focused
- Maintain up-to-date links to active projects

## Build Configuration
- Site uses @sveltejs/adapter-static for static deployment
- Requires `export const prerender = true` in root +layout.ts for successful static build
- Run `pnpm build` to build the site
