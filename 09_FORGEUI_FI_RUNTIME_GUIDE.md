# ForgeUI Fi Runtime Guide

Last updated: 2026-08-01  
Status: **SOFTWARE COMPLETE / READY FOR ESP32-P4 PROOF**

## Purpose

Every Standard Fi Icon can now become a generated runtime object. A normal icon
remains display-only by default, can expose generated presentation controls, and
can optionally become clickable. Application code uses generated `FG_Set_*`
functions and `FG_On_*` hooks; normal use requires no raw LVGL.

The selected Fi icon controls appearance. The Studio component name controls the
public API identity. Changing `FiAirplay` to another supported Fi asset therefore
does not rename an API derived from `Living Room AirPlay`.

## Architecture

### `90_Studio_Export.c/.h`

- Generated and replaceable native LVGL.
- Creates and owns each `lv_image` or supported symbol-backed `lv_label`.
- Applies serialized geometry, canonical sizing and initial presentation.
- Binds runtime-enabled objects to 96.
- Adds `CLICKABLE`, `CLICK_FOCUSABLE`, pressed styling and one
  `LV_EVENT_CLICKED` callback only when click is enabled.

### `95_UserEvents.c/.h`

- Owns developer input behavior.
- Declares and stubs optional Fi Icon click hooks.
- Preservation-merges matching developer implementations in Live Studio.
- Becomes developer-owned with the rest of a Standalone Export.
- Never owns Fi presentation setters.

### `96_FiRuntime.c/.h`

- Generated and replaceable presentation layer.
- Owns retained visibility, opacity and color state independently per instance.
- Binds the retained state to the native object created by 90.
- Abstracts image recolor from symbol-label text color.
- Is omitted, including its CMake entry and public include, when no used Icon
  instance enables runtime presentation.

Permanent application logic belongs in 95 or ordinary developer modules, never
in regenerated 90 or 96 files.

## Canonical Icon Pipeline

```text
Icon Browser
    ↓
Canonical Renderer
    ↓
Persisted Asset
    ↓
Canvas
    ↓
Browser Preview
    ↓
Native Export
    ↓
96 Runtime
```

This is one pipeline, not a collection of icon-specific implementations. It has:

- one renderer and normalized Icon model;
- one 92% automatic-fit sizing rule, with exact explicit `boxSize` override;
- one source-dimension and transparent-padding model;
- one source-aware native scaling and centring calculation;
- one asset-selection and persisted-identity path;
- one generated export consumed by Live Studio and Standalone Export.

Only icons used by the project emit assets and runtime code. Unsupported icons
without a canonical asset fail export rather than receiving an unrelated
placeholder.

## Generated APIs

For each runtime-enabled Standard Icon:

```c
void FG_Set_<Name>_Visible(bool visible);
void FG_Set_<Name>_Opacity(uint8_t opacity);
void FG_Set_<Name>_Color(uint32_t rgb);
```

When click is enabled:

```c
void FG_On_<Name>_Clicked(void);
```

Names come from the Studio component name after established C-identifier
sanitization. Duplicate or sanitization-colliding names receive deterministic
`_2`, `_3` suffixes. The selected Fi asset name never replaces a deliberately
assigned component name.

## Runtime Behavior

- Setters are silent and never invoke 95.
- Calls made before object creation update retained state and apply on binding.
- Null object pointers are guarded.
- Repeated effective values are suppressed.
- `uint8_t` defines the 0–255 opacity range.
- Color accepts `0xRRGGBB` and masks unrelated high bits.
- Image-backed icons use LVGL image recolor with cover opacity.
- Supported LVGL-symbol-backed icons use label text color.
- Visibility, opacity and color state remain independent across instances.
- Click callbacks fire once per deliberate `LV_EVENT_CLICKED`, never at startup
  or because a presentation setter ran.

## Inspector

The Standard Icon Inspector exposes:

- **Generate runtime API:** on by default, including hydration of older projects.
- **Enable tap/click:** off by default so ordinary icons remain display-only.
- **Pressed color** and **Pressed opacity:** shown only when click is enabled.
- Existing selected icon, color, opacity, visibility, geometry and explicit or
  automatic sizing controls remain authoritative.

Canvas and Browser Preview share the normalized model. A click-enabled preview
shows pressed appearance, emits one preview event, and suppresses the icon press
from starting an accidental Canvas drag. Established resize and selection
boundaries remain available.

## Examples

### Plant WiFi

Selected icon: `FiWifi`  
Component name: `Plant WiFi`  
Runtime API: on  
Click: off

```c
FG_Set_Plant_WiFi_Visible(true);
FG_Set_Plant_WiFi_Opacity(220);
FG_Set_Plant_WiFi_Color(0x42C9D7);
```

No `FG_On_Plant_WiFi_Clicked` hook is emitted.

### Living Room AirPlay

Selected icon: `FiAirplay`  
Component name: `Living Room AirPlay`  
Runtime API: on  
Click: on

```c
FG_Set_Living_Room_AirPlay_Visible(true);
FG_Set_Living_Room_AirPlay_Opacity(220);
FG_Set_Living_Room_AirPlay_Color(0xF2A900);
```

Developer-owned behavior belongs in 95:

```c
void FG_On_Living_Room_AirPlay_Clicked(void)
{
    // Queue or invoke application behavior.
}
```

The three setters and retained state belong to generated 96. Object construction,
binding and the event adapter belong to generated 90.

### Settings Shortcut

Selected icon: `FiSettings`  
Component name: `Settings Shortcut`  
Runtime API: off  
Click: on

```c
void FG_On_Settings_Shortcut_Clicked(void)
{
    // Open an application settings flow.
}
```

This click-only instance uses 90 and 95 but emits no presentation setters for
itself. If no other icon enables runtime presentation, 96 is omitted entirely.

## Live and Standalone Ownership

Live Studio regeneration replaces 90 and 96, while matching 95 hook bodies are
preservation-merged. Standalone Export receives the identical generated C blocks
and source registration; after export, that project becomes developer-owned
under the normal ForgeUI rules.

## Future Semantic Runtime Direction

Future widgets may layer semantic state above the existing generic 96 foundation:

```c
FG_Set_Plant_WiFi_State(...);
FG_Set_Battery_Level(...);
FG_Set_Cloud_State(...);
FG_Set_Bluetooth_Connected(...);
```

These are direction examples, not implemented contracts. Future semantic APIs
must retain collision-safe component naming, silent programmatic updates,
per-instance state, Registry capability authority, feature gating and the same
90/95/96 ownership boundary. They must not create icon-specific parallel
renderers or require raw LVGL for ordinary application integration.

## Proof Status

The architecture and focused software validation are complete. Fi Runtime is not
physically proven until image-backed and symbol-backed instances, pre/post-init
setters, click cardinality, collision independence and Live/Standalone parity are
observed on the ESP32-P4. Icon remains **READY FOR FINAL HARDWARE RE-PROOF** and
the Standard Widget proof total remains **29/39 (74%)**, with **10 remaining**.
