# 13. Known-Good Save Point

## Current Save Point

```text
FORGEUI_WIDGET_BATCH2_COMPLETE__BUTTONMATRIX_CANVAS_LINE_TABVIEW_TILEVIEW__P4_PROVEN__SIDEBAR_AUDIT_NEXT__2026-06-18
```

---

# Current State

```text
Asset Manager upload works
Asset Manager delete works
Asset Manager thumbnail works

Uploaded asset registry works

browserSrc implemented
exportStatus implemented

LVGL symbol generation implemented
cFile generation implemented

Image widget uploaded asset dropdown works

Builder renders uploaded image
Browser Preview renders uploaded image

Builder sizing matches Browser Preview sizing

Build & Flash works
Clean Build & Flash works

Detached ESP-IDF Export works

Preset asset pipeline remains intact

Export server remains intact

LVGLImage.py integrated

pypng installed
lz4 installed

Official LVGL v9 image converter integrated

PNG → LVGL C conversion works

ARGB8888 conversion works

Generated .c asset creation works

Automatic assetSources generation works

Automatic CMake injection works

Automatic LV_IMAGE_DECLARE generation works

Automatic lv_image_set_src generation works

ESP-IDF compiles generated uploaded assets

Physical ESP32-P4 renders uploaded images

End-to-end uploaded image pipeline proven

Theme Manager implemented

Theme Manager integrated into Editor menu

Theme Manager is now sole theme selection UI

Header theme selector removed

Canvas theme selector removed

Duplicate theme controls removed

Theme cards implemented

Active theme badge implemented

Theme preview palettes implemented

Theme selection updates Builder

Theme selection updates Browser Preview

Theme selection updates LVGL Export

Theme selection updates Physical ESP32-P4

Theme Manager preview validated

Theme Manager hardware flash validated
```

---

# Theme Drift Elimination (2026-06-13)

## Status

PROVEN

---

## Root Cause

ForgeUI contained two separate theme systems:

### Browser Theme System

```text
FG_PREVIEW_PALETTES
```

Used by:

```text
Theme Manager
ForgeThemeContext
Builder
Browser Preview
```

### Export Theme System

```text
FG_PALETTES
```

Used by:

```text
ForgeUILvglExport.ts
Generated LVGL Code
ESP32-P4
```

The systems drifted apart.

Example:

```text
Nordic Ice rendered correctly in Browser Preview
Nordic Ice exported as Reactor Dark
ESP32-P4 flashed incorrect dark background
```

---

## Architecture Change

Removed:

```text
FG_PALETTES
```

Removed all duplicate palette definitions from:

```text
studio/src/forgeui/ForgeUILvglExport.ts
```

Export now imports:

```text
studio/src/forgeui/preview/forgeThemeMap.ts
```

and consumes:

```text
FG_PREVIEW_PALETTES
```

directly.

ButtonMatrix = Proven

Canvas = Proven

Line = Proven

Tabview = Proven

Tileview = Proven

---

## Current Theme Architecture

```text
FG_PREVIEW_PALETTES
        ↓
Theme Manager
        ↓
ForgeThemeContext
        ↓
Builder
        ↓
Browser Preview
        ↓
ForgeUILvglExport
        ↓
Generated LVGL C
        ↓
ESP32-P4
```

Single source of truth.

---

## Validation

Nordic Ice

```text
Preview = Correct
ESP32-P4 = Correct
```

Graphite

```text
Preview = Correct
ESP32-P4 = Correct
Carbon texture exported correctly
```

Test Purple

```text
Added to FG_PREVIEW_PALETTES only

Automatically appeared in Theme Manager
Automatically appeared in Browser Preview
Automatically exported through LVGL
Automatically flashed on ESP32-P4
```

Result:

```text
Theme drift eliminated.
Single-source theme architecture proven.
```
---

# Current Architecture Truth

```text
The image conversion problem is solved.

The image integration problem is solved.

The uploaded image pipeline is complete.

The theme selection problem is solved.

The theme ownership problem is solved.

Theme Manager is now the single source of truth for theme selection.

Uploaded image assets now complete a full end-to-end path from ForgeUI Studio to physical ESP32-P4 hardware.

Theme selection now completes a full end-to-end path from ForgeUI Studio to physical ESP32-P4 hardware.

Remaining work is refinement, presentation quality, texture systems, scaling controls, asset management improvements, and multi-image validation.
```

---

# Updated Uploaded Image Pipeline

Current proven flow:

```text
Uploaded Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Firmware Assets/uploads
    ↓
Asset Registry
    ↓
assetSources[]
    ↓
Generated CMake
    ↓
LV_IMAGE_DECLARE(...)
    ↓
lv_image_set_src(...)
    ↓
Build & Flash
    ↓
Physical ESP32-P4 Image Rendering
```

Status:

```text
PROVEN
```

---

# Updated Theme Pipeline

Current proven flow:

```text
Theme Manager
    ↓
ForgeThemeContext
    ↓
Builder
    ↓
Browser Preview
    ↓
generateForgeUILvglCode()
    ↓
LVGL Export
    ↓
Build & Flash
    ↓
Physical ESP32-P4 Theme Rendering
```

Status:

```text
PROVEN
```

---

# Theme System Status

Status:

```text
PROVEN
```

Capabilities:

```text
Theme Manager

Theme Cards

Theme Preview Palettes

Theme Selection

Theme Context Integration

Builder Theme Updates

Browser Preview Theme Updates

LVGL Export Theme Updates

ESP32-P4 Theme Rendering

Active Theme Indicator

Single Source Of Truth Theme Ownership
```

---

# Theme Validation Status

Status:

```text
PROVEN
```

Validated:

```text
✓ Carbon Graphite Preview

✓ Matrix Green Preview

✓ Cyber Teal Preview

✓ Matrix Green Hardware Flash

✓ Cyber Teal Hardware Flash

✓ Theme Export Pipeline Verified

✓ Theme Context Pipeline Verified

✓ Preview To Hardware Validation Completed
```

---

# Uploaded Image Pipeline Status

Status:

```text
PROVEN
```

Capabilities:

```text
PNG upload

Drag & Drop

Thumbnail Preview

Uploaded Asset Registry

Builder Rendering

Browser Preview Rendering

Builder/Preview Size Alignment

LVGLImage.py Auto Conversion

Generated LVGL C Asset Creation

Generated Asset Symbol Registration

Generated Asset Source Registration

Automatic assetSources Generation

Automatic CMake Injection

Automatic LV_IMAGE_DECLARE Generation

Automatic lv_image_set_src Generation

ESP-IDF Compilation

Build & Flash

Physical ESP32-P4 Rendering
```

---

# LVGL Image Converter Status

Status:

```text
PROVEN
```

Location:

```text
tools/lvgl/LVGLImage.py
```

Dependencies:

```text
pypng
lz4
```

Bench proof:

```text
✓ Python 3.11 verified

✓ LVGLImage.py executes successfully

✓ pypng dependency verified

✓ lz4 dependency verified

✓ PNG → LVGL C conversion verified

✓ ARGB8888 output verified

✓ Generated .c asset created successfully

✓ Automatic ForgeUI integration verified

✓ Physical ESP32-P4 rendering verified
```

Current truth:

```text
ForgeUI Studio possesses a fully integrated local/offline LVGL image conversion pipeline.

No further image converter research is required.
```

---

# Updated Tools Ownership

```text
tools/
├── lvgl/
│   └── LVGLImage.py
```

Owns:

```text
Build scripts

Flash scripts

Runtime helpers

Automation utilities

LVGL image conversion

Uploaded asset conversion

Future asset automation
```

---

# Browser Side Status

Status:

```text
PROVEN
```

Capabilities:

```text
PNG upload

JPG upload

SVG upload

Drag & Drop

Click To Browse

Thumbnail Preview

Uploaded Asset Registry

Builder Rendering

Browser Preview Rendering

Builder/Preview Size Alignment

Theme Preview Rendering

Theme Texture Rendering
```

---

# Firmware Side Status

Status:

```text
PROVEN
```

Capabilities:

```text
Generated LVGL Asset Compilation

Generated Asset Source Registration

Generated CMake Integration

LV_IMAGE_DECLARE Generation

lv_image_set_src Generation

Theme Export Integration

Theme Rendering

ESP-IDF Build Stability

Flash Stability

Uploaded Asset Rendering

Physical P4 Image Rendering
```

---

# Current Architecture Status

```text
Asset Manager = Proven

Uploaded Image Pipeline = Proven

Browser Preview = Proven

Theme Manager = Proven

Theme Pipeline = Proven

Build & Flash = Proven

Clean Build & Flash = Proven

Detached Export = Proven

LVGLImage.py = Proven

PNG → LVGL C = Proven

Theme Export = Proven

Generated Asset Compilation = Proven

Physical ESP32-P4 Rendering = Proven
```

---

# New Proven Milestones

✓ AI / Sci-Fi theme pack imported

✓ 1024x600 PNG hero backgrounds added to Studio public textures

✓ 1024x600 PNG hero backgrounds converted to LVGL C assets

✓ Generated C assets registered in ForgeUILvglExport.ts

✓ Builder renders AI hero backgrounds

✓ Browser Preview renders AI hero backgrounds

✓ CSS URL spacing issue fixed with quoted backgroundImage URLs

✓ LVGL export supports textureMode tile/fullscreen

✓ Industrial textures continue using tiled rendering

✓ AI hero backgrounds render once at 0,0 fullscreen

✓ Build & Flash successful

✓ Physical ESP32-P4 renders fullscreen AI hero background

✓ Theme Manager → Preview → Export → P4 path proven

✓ ButtonMatrix Browser Preview implemented

✓ ButtonMatrix LVGL Export implemented

✓ Canvas Browser Preview implemented

✓ Canvas LVGL Export implemented

✓ Line Browser Preview implemented

✓ Line LVGL Export implemented

✓ Tabview Browser Preview implemented

✓ Tabview LVGL Export implemented

✓ Tileview Browser Preview implemented

✓ Tileview LVGL Export implemented

✓ Physical ESP32-P4 validation completed

✓ Sidebar audit completed

✓ Hidden OpenChakra widgets confirmed retained

✓ forgeuiCoreWidgets confirmed as sidebar source of truth

Validated on hardware:

AI Nexus / Neural-style 1024x600 hero background rendered fullscreen on ESP32-P4.
Widgets rendered above background.
Old side-by-side tiling issue fixed.

Architecture rule remains:

FG_PREVIEW_PALETTES remains the single source of truth.
No FG_PALETTES.
No duplicate theme system.
ForgeUILvglExport.ts consumes forgeThemeMap.ts.


## Uploaded Image Pipeline V1

Status:

```text
PROVEN
```

---

## Theme Manager V1

Status:

```text
PROVEN
```

Achievements:

```text
✓ Theme Manager integrated

✓ Duplicate theme selectors removed

✓ Theme Manager established as single source of truth

✓ Builder theme validation

✓ Browser preview theme validation

✓ ESP32-P4 theme validation

✓ Hardware flash validation

✓ Theme export validation
```

---

# Immediate Next Mission

```text
FORGEUI_SIDEBAR_AUDIT_V1
```

Center
    ↓
Container
    ↓
Stack
    ↓
Flex
    ↓
Grid
    ↓
SimpleGrid
    ↓
Build Canvas Validation
    ↓
Browser Preview Validation
    ↓
LVGL Export Validation
```text
Carbon Fiber Enhancements
    ↓
Brushed Steel Texture
    ↓
Blueprint Texture
    ↓
Terminal Noise Texture
    ↓
Military Plate Texture
    ↓
Theme-specific Texture Assignment
    ↓
Preview Validation
    ↓
Hardware Validation
```

---


# ForgeUI Feature Map — Where Things Live

This section exists so future chats do not need 10 file tabs pasted every time.

---

## Main Lanes

```text
Browser / Editor Lane
    ↓
Studio UI, Builder, Theme Manager, Asset Manager, Preview
```

Lives mostly in:

```text
studio/src/components/
studio/src/forgeui/
studio/src/forgeui/preview/
studio/src/forgeui/theme/
```

---

```text
Export Lane
    ↓
Turns Studio layout into LVGL C
```

Main file:

```text
studio/src/forgeui/ForgeUILvglExport.ts
```

If something works in browser but not on the ESP32-P4, check this lane first.

---

```text
Firmware Lane
    ↓
ESP-IDF / LVGL project that builds and flashes
```

Lives in:

```text
firmware/ForgeUI-One/
firmware/ForgeUI-One/main/
firmware/ForgeUI-One/main/assets/
```

If the build fails or an asset does not compile, check this lane.

---

# Feature Touch Map

## Add / edit themes

Touch:

```text
studio/src/forgeui/preview/forgeThemeMap.ts
```

Do not start by touching firmware.

---

## Add background textures

Touch:

```text
studio/public/textures/
firmware/ForgeUI-One/main/assets/themes/
studio/src/forgeui/preview/forgeThemeMap.ts
studio/src/forgeui/ForgeUILvglExport.ts
```

Known proven example:

```text
carbon_fiber.png
fg_theme_carbon_fiber.c
fg_theme_carbon_fiber
```

---

## Add Background Selector / Randomiser

Likely touch:

```text
studio/src/forgeui/theme/ForgeThemeContext.tsx
Theme Manager component
studio/src/forgeui/preview/forgeThemeMap.ts
studio/src/forgeui/ForgeUILvglExport.ts
```

Rule:

```text
Theme Manager owns the UI.
ForgeThemeContext owns selected state.
forgeThemeMap owns preview theme/background metadata.
ForgeUILvglExport owns physical ESP32-P4 output.
```

Do not create another theme selector.

---

## Add uploaded image features

Touch:

```text
studio/src/forgeui/assets/ForgeUIAssetManager.tsx
studio/src/forgeui/ForgeUIUploadedAssetRegistry.ts
studio/src/forgeui/ForgeUILvglExport.ts
tools/lvgl/LVGLImage.py
firmware/ForgeUI-One/main/assets/uploads/
```

---

## Add new widgets

Touch:

```text
studio/src/forgeui/ForgeUIWidgetSet.ts
studio/src/components/editor/ComponentPreview.tsx
studio/src/forgeui/ForgeUILvglExport.ts
```

Rule:

```text
Browser widget first.
LVGL export second.
P4 flash third.
```

---

# Current Texture System Direction

Do not re-research image conversion.

Current next work:

```text
Texture Pack V1
Background Playground
Background Selector
Randomiser
Flash Flair
```

Preferred order:

```text
1. Add more built-in texture PNGs
2. Convert them to LVGL C assets
3. Add texture entries to forgeThemeMap.ts
4. Add textureAsset entries to ForgeUILvglExport.ts
5. Validate Browser Preview
6. Clean Build & Flash
7. Validate physical ESP32-P4
8. Then expose selector/randomiser in Theme Manager
```

---

# Rule For Future Chats

Before asking Scott to paste files, first identify the lane:

```text
Browser problem?
Export problem?
Firmware problem?
Asset conversion problem?
```

Then ask only for the smallest file set from that lane.


# Future One-Wrapper Goal

Current setup:

```text
pip install pypng lz4
```

Future setup:

```text
START_FORGEUI_STUDIO.bat
    ↓
Check Node
    ↓
Check npm
    ↓
Check Python
    ↓
Check pypng
    ↓
Check lz4
    ↓
Install Missing Dependencies
    ↓
Start Export Server
    ↓
Start Studio Frontend
    ↓
Open Browser
```

Goal:

```text
User installs Node.js

User installs ESP-IDF

Everything else is handled by ForgeUI Studio.
```

---

# Source Of Truth

Current architecture truth:

```text
Asset Manager = Proven

Uploaded Image Pipeline = Proven

Theme Manager = Proven

Theme Export = Proven

Browser Preview = Proven

Build & Flash = Proven

Clean Build & Flash = Proven

Detached Export = Proven

LVGLImage.py = Proven

PNG → LVGL C = Proven

Generated Asset Compilation = Proven

Physical ESP32-P4 Rendering = Proven

Remaining Work:

Texture System V1

Image sizing parity

Multi-image validation

Asset cleanup

Asset management improvements

Custom Theme Creation

Theme Categories

Presentation quality improvements
```

Future chats should treat this as the active architecture truth.


HOW TO ADD WIDGETS # ForgeUI Studio — How To Add A New Custom Widget

Status:

```text
PROVEN
```

Validated using:

```text
Led
Bar
Arc
```

Date:

```text
2026-06-14
```

---

# Purpose

This process is used when adding a new ForgeUI widget that is not part of the original OpenChakra component set.

Examples:

```text
Led
Bar
Arc
Meter
Chart
Table
Tabview
WiFiPanel
ClockPanel
```

---

# Architecture Overview

A widget must be registered in multiple locations.

If one step is missed the widget may:

```text
Appear in toolbox but not drag

Drag but not render

Render but crash inspector

Render but fail export

Export but fail LVGL compilation
```

---

# Step 1 — Add Component Type

File:

```text
studio/src/types.d.ts
```

Locate:

```ts
type ComponentType =
```

Add:

```ts
| 'Led'
| 'Bar'
| 'Arc'
```

Example:

```ts
| 'Badge'
| 'Bar'
| 'Box'
```

---

# Step 2 — Add To Toolbox Menu

File:

```text
menuItems.ts
```

Add:

```ts
Led: {},
Bar: {},
Arc: {},
```

Example:

```ts
Progress: {},
Led: {},
Bar: {},
Arc: {},
Spinner: {},
```

---

# Step 3 — Add To Components List

File:

```text
menuItems.ts
```

Locate:

```ts
componentsList
```

Add:

```ts
'Led',
'Bar',
'Arc',
```

---

# Step 4 — Add To Root Components

File:

```text
studio/src/utils/editor.ts
```

Locate:

```ts
export const COMPONENTS
```

Add:

```ts
'Led',
'Bar',
'Arc',
```

Example:

```ts
'Progress',
'Bar',
'Arc',
'Led',
'Radio',
```

Reason:

```text
Widgets may appear in the sidebar but cannot be dropped onto the canvas unless they are registered in COMPONENTS.
```

---

# Step 5 — Prevent Inspector Crash

File:

```text
studio/src/utils/defaultProps.tsx
```

Original:

```ts
const chakraDefaultProps = Chakra[type].defaultProps
```

Replace with:

```ts
const chakraDefaultProps =
  Chakra[type]?.defaultProps || {}
```

Final:

```ts
export const getDefaultFormProps = (
  type: ComponentType
) => {
  const chakraDefaultProps =
    Chakra[type]?.defaultProps || {}

  return {
    ...chakraDefaultProps,
    ...DEFAULT_PROPS[type]?.form,
  }
}
```

Reason:

```text
Custom ForgeUI widgets do not exist inside Chakra.
Without optional chaining Studio crashes when the inspector opens.
```

---

# Step 6 — Add Default Props

File:

```text
studio/src/utils/defaultProps.tsx
```

Add:

```ts
Led: {},

Bar: {
  value: 70,
},

Arc: {
  value: 65,
},
```

Optional but recommended.

---

# Step 7 — Add Preview Renderer

File:

```text
studio/src/components/editor/ComponentPreview.tsx
```

Add:

```ts
case 'Led'
case 'Bar'
case 'Arc'
```

Provide simple visual previews.

Example:

```text
Led = green glowing circle

Bar = progress bar

Arc = circular ring
```

Goal:

```text
Visual representation only.
```

---

# Step 8 — Validate Browser Preview

Expected:

```text
Widget appears in toolbox

Widget drags onto canvas

Widget renders

Widget can be resized

Widget can be selected

Inspector opens

No runtime errors
```

Status:

```text
PROVEN
```

For:

```text
Led
Bar
Arc
```

---

# Step 9 — Add LVGL Export

File:

```text
studio/src/forgeui/ForgeUILvglExport.ts
```

Add export handlers.

Examples:

LED:

```c
lv_obj_t *led =
    lv_led_create(parent);

lv_obj_set_size(
    led,
    w,
    h
);

lv_obj_set_pos(
    led,
    x,
    y
);

lv_led_on(led);
```

BAR:

```c
lv_obj_t *bar =
    lv_bar_create(parent);

lv_obj_set_size(
    bar,
    w,
    h
);

lv_obj_set_pos(
    bar,
    x,
    y
);

lv_bar_set_value(
    bar,
    70,
    LV_ANIM_OFF
);
```

ARC:

```c
lv_obj_t *arc =
    lv_arc_create(parent);

lv_obj_set_size(
    arc,
    w,
    h
);

lv_obj_set_pos(
    arc,
    x,
    y
);
```

---

# Step 10 — Hardware Validation

Build:

```text
Clean Build & Flash
```

Validate:

```text
Studio
    ↓
Preview
    ↓
Export
    ↓
ESP32-P4
```

Expected:

```text
Widget renders on physical hardware.
```

---

# Proven Milestone

Save Point:

```text
FORGEUI_CUSTOM_WIDGETS_V1__LED_BAR_ARC_PREVIEW_PROVEN__LVGL_EXPORT_NEXT__2026-06-14
```

Validated:

```text
✓ ComponentType registration

✓ Toolbox registration

✓ Components list registration

✓ Root component registration

✓ Inspector compatibility fix

✓ Browser rendering

✓ Drag & drop

✓ Selection

✓ Resize

✓ Custom ForgeUI widget architecture proven



# Save Point — LVGL Widget Library V1

```text
FORGEUI_LVGL_WIDGET_LIBRARY_V1__FULL_REGISTRATION_PREVIEW_AND_CLEAN_SIDEBAR_PROVEN__EXPORT_NEXT__2026-06-14
```

## Status

```text
PROVEN
```

## What Was Achieved

```text
LVGL widget catalog added to ForgeUI Studio.
Custom non-Chakra widget path proven.
LVGL widgets can now appear in the toolbox.
LVGL widgets can now drag onto the canvas.
LVGL widgets can now render as browser preview placeholders.
ForgeUI sidebar cleaned so only ForgeUI Core widgets are visible.
Legacy OpenChakra clutter hidden from the normal toolbox view.
```

## Widgets Registered

```text
Led
Bar
Arc
Chart
Table
Keyboard
Calendar
Scale
Roller
Msgbox
ButtonMatrix
Canvas
Line
Tabview
Tileview
ImageButton
AnimImage
Lottie
Spinner
```

## Files Touched

```text
studio/src/types.d.ts
studio/src/componentsList.ts
studio/src/utils/editor.ts
studio/src/utils/defaultProps.tsx
studio/src/components/editor/ComponentPreview.tsx
studio/src/forgeui/ForgeUIWidgetSet.ts
studio/src/components/sidebar/Menu.tsx
```

## Key Fixes

```text
ComponentType updated with LVGL widget names.

menuItems updated so LVGL widgets exist in toolbox registry.

componentsList updated so LVGL widgets are searchable/listable.

COMPONENTS/rootComponents updated so LVGL widgets are accepted by drag/drop.

getDefaultFormProps updated with Chakra[type]?.defaultProps || {} so custom ForgeUI/LVGL widgets do not crash the inspector.

ComponentPreview updated with real previews for Led, Bar, Arc.

ComponentPreview updated with placeholder previews for the wider LVGL widget set.

forgeuiCoreWidgets updated to put useful LVGL/HMI widgets at the top.

Sidebar Menu updated to show only forgeuiCoreWidgets, hiding inherited OpenChakra clutter.
```

## Proven Validation

```text
Led preview renders.
Bar preview renders.
Arc preview renders.
Chart placeholder renders.
Lottie placeholder renders.
Keyboard placeholder renders.

Widgets drag onto canvas.
Widgets select correctly.
Widgets resize correctly.
Sidebar now only shows ForgeUI Core / LVGL-focused widgets.
```

## Architecture Truth

```text
ForgeUI Studio is no longer only a Chakra/OpenChakra editor.

ForgeUI Studio can now host custom ForgeUI/LVGL widgets.

Current implementation provides browser-side registration and preview.

Next work is LVGL export generation for the new widgets.
```

## Next Mission

```text
FORGEUI_LVGL_WIDGET_EXPORT_V1__LED_BAR_ARC_FLASH_PROOF_NEXT
```

## Next Work

```text
Add LVGL export cases in:

studio/src/forgeui/ForgeUILvglExport.ts

Start with:

Led  -> lv_led_create
Bar  -> lv_bar_create
Arc  -> lv_arc_create

Then Clean Build & Flash to validate on physical ESP32-P4.
```

```
