# Phase 1 Export

Status: IMPLEMENTED

`POST /api/hosted/export` accepts the existing validated generator payload plus referenced hosted asset C sources. The server validates names and paths, materializes the standalone project with the same function used by local export, and streams `<project>.zip`.

`POST /api/hosted/convert-image` preprocesses an image and returns its LVGL C source to browser session state. No permanent hosted project or asset storage is created.
