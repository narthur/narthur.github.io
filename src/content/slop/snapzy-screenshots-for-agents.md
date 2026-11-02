---
title: 'Let your coding agent take its own screenshots with Snapzy'
link: https://github.com/duongductrong/Snapzy
date: 2026-11-03
---

[Snapzy](https://github.com/duongductrong/Snapzy) is an open-source screenshot and screen recording app for macOS, inspired by CleanShot X. It lives in the menu bar and covers area, window and scrolling captures, annotation, OCR, GIF and video recording, and uploads to your own S3 or Cloudflare R2 bucket. It is BSD-licensed and collects no telemetry.

The `snapzy` command is the reason to install it. It lets a script or an AI coding agent take a screenshot with no clicks and get back a file path, JSON metadata and an exit code. That means an agent can screenshot the app it just changed and check the result itself.

To set it up:

1. Install it with Homebrew. It needs macOS 13 or later.

   ```bash
   brew install --cask snapzy
   ```

2. Grant Screen Recording permission when macOS asks, then put the command on your `PATH` from Settings → Command Line → Install.
3. Try a capture:

   ```bash
   snapzy list windows --app Safari
   snapzy capture window --app Safari --max-dimension 1568 -o shot.png
   ```

The window capture works even when the window is covered. The first time an app runs `snapzy`, Snapzy asks whether to allow it, so a terminal or agent has to be approved once.

Install it, run the window capture once from your terminal, and tell your agent the command exists.
