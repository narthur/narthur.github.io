# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Nathan Arthur's personal website built with SvelteKit as a static site generator. Features dynamic GitHub statistics integration, project showcase, and responsive design with Tailwind CSS.

## Development Commands

### Core Development
```bash
# Install dependencies (project uses pnpm)
pnpm install

# Start development server (avoid in WARP to prevent blocking)
pnpm dev

# Build static site
pnpm build

# Preview production build locally
pnpm preview

# Type checking
pnpm check

# Watch mode type checking
pnpm check:watch
```

### Testing & Quality
```bash
# Run tests (use --run to avoid watch mode in WARP)
pnpm test

# Run Vitest directly with no-watch
pnpm vitest --run

# Lint code (ESLint + Prettier)
pnpm lint

# Format code
pnpm format
```

### GitHub Statistics Integration
```bash
# Install dependencies for GitHub stats fetching
pnpm prefetch-github

# Fetch GitHub stats (requires GITHUB_OAUTH_CLIENT_ID in .env)
pnpm fetch-github
```

## High-Level Architecture

### Static Site Generation
- **SvelteKit** with `@sveltejs/adapter-static` for GitHub Pages deployment
- **Pre-rendering** enabled via `export const prerender = true` in root layout
- **Build-time data fetching** using static JSON files rather than runtime API calls

### GitHub Integration Flow
1. **OAuth Device Flow**: `scripts/fetch-github-stats.ts` handles authentication
2. **Data Fetching**: Pulls user profile, repositories, and language statistics
3. **Static Generation**: Data stored in `data/github-stats.json` for build-time consumption
4. **Display**: `src/services/github/api.ts` processes static data for components

### Technology Stack
- **SvelteKit 5** for framework and routing
- **TypeScript** for type safety throughout
- **Tailwind CSS** with plugins for forms, typography, container queries
- **Vite** for build tooling and dev server
- **Vitest** for unit testing
- **ESLint + Prettier** for code quality

## Project Structure

### Key Directories
```
src/
├── routes/                 # SvelteKit file-based routing
│   ├── +layout.svelte     # Root layout with dark mode support
│   ├── +layout.ts         # Layout load function (prerender: true)
│   ├── +page.svelte       # Home page with project showcase
│   └── uses/              # "/uses" page route
├── components/            # Reusable Svelte components
│   ├── GithubStats.svelte # GitHub statistics display
│   ├── ProjectList.svelte # Searchable project showcase
│   └── SubscribeForm.svelte
├── services/              # Business logic layer
│   └── github/           # GitHub API integration
│       ├── api.ts        # Data processing from static JSON
│       ├── types.ts      # TypeScript interfaces
│       └── colors.ts     # Language color mapping
└── types/                 # Global type definitions
```

### Data Flow
1. **Build Time**: Static JSON (`data/github-stats.json`) consumed by services layer
2. **Component Layer**: `GithubStats.svelte` calls `fetchGithubStats()` from `services/github/api.ts`
3. **Data Processing**: API service calculates statistics and language percentages
4. **Rendering**: Components receive processed data for display

## GitHub Statistics System

### Authentication Setup
1. Create GitHub OAuth app and get client ID
2. Copy `.env-sample` to `.env` and set `GITHUB_OAUTH_CLIENT_ID`
3. Run `pnpm prefetch-github` to install required dependencies

### Data Fetching Process
```bash
# Authenticate via OAuth device flow (opens browser)
pnpm fetch-github
```

The script:
1. Initiates OAuth device flow authentication
2. Fetches user profile data for 'narthur'
3. Retrieves all public repositories (up to 100)
4. Collects language statistics for each repository
5. Saves complete dataset to `data/github-stats.json`

### Data Processing
- **Stars**: Aggregated across all repositories
- **Languages**: Byte counts summed and converted to percentages
- **Top Languages**: Shows top 5, with remainder grouped as "Other"
- **Caching**: No runtime caching needed - data is static at build time

## Development Patterns

### SvelteKit Conventions
- **File Routes**: `+page.svelte` for pages, `+layout.svelte` for layouts
- **Load Functions**: `+layout.ts` with `prerender: true` for static generation
- **Component Naming**: PascalCase for `.svelte` components

### TypeScript Guidelines
- Avoid `any` type, prefer `unknown` or specific types
- Interface definitions in `src/types/` and `src/services/*/types.ts`
- Acceptable `any` usage in test files only

### Styling Approach
- **Tailwind First**: Use utility classes directly in markup
- **Avoid @apply**: Don't use `@apply` directives in Svelte `<style>` blocks
- **CSS Fallback**: Use regular CSS in `<style>` blocks when Tailwind insufficient
- **Dark Mode**: Class-based dark mode with system preference detection

### Component Architecture
- **Reusable Components**: Stored in `src/components/`
- **Services Layer**: Business logic separated from presentation
- **Static Imports**: Import JSON data directly rather than fetch at runtime

## Build Configuration

### Static Site Generation
```javascript
// svelte.config.js
adapter: adapter() // @sveltejs/adapter-static
```

### Vite Customizations
- **File System Access**: Allows serving `./data` directory
- **YAML HMR**: Custom plugin for hot reload on YAML file changes
- **Vitest Integration**: Test configuration includes `src/**/*.{test,spec}.{js,ts}`

### Tailwind Setup
- **Content Paths**: Configured to scan `src/**/*.{html,js,svelte,ts}`
- **Plugins**: Includes forms, typography, and container queries
- **Dark Mode**: `darkMode: 'class'` for manual toggle support

## Environment Requirements

### Required Environment Variables
```bash
# .env file
GITHUB_OAUTH_CLIENT_ID=your-client-id-here
```

### Dependencies
- **Node.js**: Modern version supporting ES modules
- **pnpm**: Package manager (check for `pnpm-lock.yaml` presence)
- **GitHub OAuth App**: For statistics fetching functionality

## Deployment

### Render.com Configuration
```yaml
# render.yaml
buildCommand: pnpm run build
staticPublishPath: ./build
domains:
  - nathanarthur.com
  - www.nathanarthur.com
```

### Pre-deployment Steps
1. Ensure `data/github-stats.json` is current: `pnpm fetch-github`
2. Run full build: `pnpm build`
3. Verify static files generated in `./build/`

## Testing Strategy

### Unit Tests
- **Vitest** configuration in `vite.config.ts`
- **Demo Test**: `src/demo.spec.ts` provides testing example
- **Non-blocking**: Use `pnpm vitest --run` to avoid watch mode

### Quality Assurance
- **ESLint**: TypeScript and Svelte linting with Prettier integration
- **Type Checking**: `svelte-check` with TypeScript compiler
- **Formatting**: Prettier with Svelte and Tailwind plugins

## Common Gotchas

1. **Static Prerendering**: Must have `export const prerender = true` in root layout
2. **GitHub Data**: Run `pnpm fetch-github` before builds that need current stats
3. **Dev Server**: Avoid starting dev servers in WARP to prevent execution blocking
4. **Package Manager**: Always use `pnpm` commands, not `npm` or `yarn`
5. **Dark Mode**: Requires both `html` and `body` elements to have dark mode classes