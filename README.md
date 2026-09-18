# nathanarthur.com

Source for [nathanarthur.com](https://nathanarthur.com/): a small static site
built with [Astro](https://astro.build/) and Tailwind CSS, deployed to
Cloudflare Workers static assets.

## Development

Requires Node >= 22.19 (`.tool-versions` pins a version for asdf) and pnpm.

```bash
pnpm install
pnpm dev       # dev server
pnpm build     # static build into ./dist
pnpm check     # astro check
pnpm lint      # prettier --check + eslint
pnpm test      # vitest
```

## Deployment

Pushes to `master` deploy via `.github/workflows/deploy.yml`, which builds the
site and publishes `dist/` with Wrangler.

## More

- `knowledge.md`: design and content rules, and the file layout
- `WARP.md`: architecture notes and common gotchas
