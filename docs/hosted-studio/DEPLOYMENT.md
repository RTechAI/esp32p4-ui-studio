# Deployment

Status: IMPLEMENTED

The root Dockerfile builds Next.js and installs Node, Python 3, Pillow, pypng, and lz4. It includes the immutable firmware template and conversion tools, runs as the unprivileged `node` user, and uses `/tmp/forgeui` for workspaces.

Required public configuration: `FORGEUI_RUNTIME_MODE=hosted` and `NEXT_PUBLIC_FORGEUI_RUNTIME_MODE=hosted`. `FORGEUI_PYTHON` defaults to `python3` on Linux. TLS/reverse proxy, domain routing, monitoring, external rate limiting, and VPS rollout remain PLANNED.
