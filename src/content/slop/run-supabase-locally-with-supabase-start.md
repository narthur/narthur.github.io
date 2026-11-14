---
title: 'Run Supabase locally with supabase start'
date: 2026-11-17
link: https://github.com/srizzon/git-city
---

Git City, an app that turns GitHub profiles into a 3D pixel-art skyline, documents how to run its Supabase backend locally. It needs no Supabase account and no OAuth app.

Install a container runtime (Colima is a free Docker alternative on macOS) and the Supabase CLI, then run:

```bash
supabase start          # first run pulls images; prints your local URL + keys
supabase status         # re-print the URL and keys at any time
```

`supabase start` brings up Postgres, Auth, Storage and Studio, and applies every migration from scratch. Put the printed URL and keys in the app's `.env.local` and it reads from the local database.

Two more commands manage the stack:

```bash
supabase db reset       # re-apply all migrations on a clean database
supabase stop           # shut the stack down (data is preserved)
```

Studio, the database browser, runs at http://127.0.0.1:54323.

Next time a project wants hosted keys before it will run, try `supabase start` first.
