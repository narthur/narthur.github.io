---
title: 'Point the Docker CLI at Podman'
date: 2026-11-04
link: https://podman.io/docs/installation
---

Podman runs containers without a paid desktop app, and its VM exposes a Docker-compatible socket. That means the plain `docker` CLI can drive it, so existing scripts and Compose files keep working unchanged.

Install the pieces with Homebrew: `brew install podman docker docker-compose`. The `docker` formula is only the command-line client, with no daemon. Then create and start the VM once:

```bash
podman machine init
podman machine start
```

The one wiring step is telling the Docker CLI where the socket lives. Set `DOCKER_HOST` in your shell config. The obvious way to find the path is `podman machine inspect`, but that call is slow, and running it on every shell startup is noticeable. The socket path is stable, so write it out instead:

```bash
export DOCKER_HOST="unix://$(getconf DARWIN_USER_TEMP_DIR)podman/podman-machine-default-api.sock"
```

`getconf DARWIN_USER_TEMP_DIR` returns the real per-user temp directory even when `$TMPDIR` has been overridden, which happens inside sandboxed tools such as Claude Code. Using `$TMPDIR` there would point at the wrong place.

Check it with `docker run hello-world`. Nathan made this switch after a Colima VM went into a broken state and `docker ps` started failing with a permission error; the Podman machine ran hello-world on the first try.

Two caveats. When the VM is stopped, `docker` commands fail to connect until `podman machine start` runs. And images with no arm64 build need `--platform linux/amd64`.

If a container runtime is misbehaving, try the Podman install and the one-line `DOCKER_HOST` export before debugging further.
