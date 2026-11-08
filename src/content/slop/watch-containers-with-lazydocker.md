---
title: 'Watch your containers with lazydocker'
date: 2026-11-10
link: https://github.com/jesseduffield/lazydocker
---

lazydocker is a terminal UI for Docker and docker-compose. Run `lazydocker` and one screen shows every container and service, its state, its logs and its resource graphs.

It replaces a familiar debugging loop. A service misbehaves, so you run `docker compose ps`, then `docker compose restart`, then `ps` again to find it died on startup. The logs you wanted are buried in a stream mixed with every other service. Following one service's logs ends whenever that service dies, so you rerun the command after each restart. lazydocker puts the list, the logs and the actions in one window, one keypress each.

From that window you can read logs per container or service, attach to a container, and restart, remove or rebuild it. You can also inspect an image's layers and prune whatever is eating disk.

Install it with Homebrew:

```sh
brew install lazydocker
```

The README lists Docker 29.0.0 or newer as a requirement, so check `docker version` if it won't start. Logs default to the last hour, so a quiet container can look empty. The README says to change that through `commandTemplates` in the config.

Next time a compose stack acts up, open lazydocker in a spare terminal pane before reaching for `docker compose logs`.
