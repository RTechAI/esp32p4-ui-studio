# Architecture

Status: IMPLEMENTED

The React/Next editor, Redux state, preview, validation, and LVGL generator are shared. `ForgeUIRuntime` selects local (default) or hosted capabilities.

- LOCAL: browser → local export bridge → live firmware/export directory/hardware tools.
- HOSTED: browser → same-origin Next API → opaque OS-temp workspace → shared standalone materializer → streamed ZIP → cleanup.

The canonical `firmware/ForgeUI-One` tree is copied as an immutable template input. Hosted asset sources are written only into the request workspace copy.
