---
title: 'Open a saved Warp layout from a URL'
date: 2026-11-20
link: https://docs.warp.dev/terminal/windows/tab-configs/
---

Warp, the terminal, can save a tab layout as a TOML file and open it from a URL. Then one command opens a project's whole workspace.

On macOS, put the file in `~/.warp/tab_configs/`. Use a snake_case name such as `my_tab.toml`. This example is from Warp's docs:

```toml
name = "Editor + Server"
color = "green"

[[panes]]
id = "root"
split = "horizontal"
children = ["editor", "server"]

[[panes]]
id = "editor"
type = "terminal"
directory = "~/code/my-app"
commands = ["nvim ."]
is_focused = true

[[panes]]
id = "server"
type = "terminal"
directory = "~/code/my-app"
commands = ["npm run dev"]
```

Then open it from any script or launcher:

```bash
open "warp://tab_config/my_tab"
```

The URL uses the file name, whatever the `name` field inside says. Add `?new_window=true` to open a new window instead of a new tab.

The docs list some limits. Children of a split are always equal in size. Commands in a pane run in order, so one that never returns, such as `ssh`, blocks the rest. The URL itself runs nothing, so every command has to live in the file. Older YAML Launch Configurations are legacy but still work.

Nathan's notes include a plan to teach a project-switcher script to open side-by-side panes. That takes a tab config and one `open` line. Save one tab config per project, then have the script open each by URL.
