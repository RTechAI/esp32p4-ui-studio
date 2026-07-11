# SPINE

## Current Save Point

```text
FORGEUI_ICON_ASSET_WORKFLOW__SOURCE_ICON_AUTO_REMOVE__ONE_CLICK_STARTUP__2026-07-11
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN
```

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, code generator, asset pipeline, theme system, and ESP-IDF workflow targeting ESP32-P4 hardware.

Core pipeline proven:

```text
Builder
    ↓
Browser Preview
    ↓
LVGL Export
    ↓
Generated C
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
```

---

# Current Architecture Truth

## Asset Pipeline

```text
Uploaded Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Asset Registry
    ↓
LVGL Export
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
```

Status:

```text
PROVEN
```

### React Icon Asset Pipeline

```text
React Icon
    ↓
renderToStaticMarkup()
    ↓
SVG
    ↓
Canvas Conversion
    ↓
PNG
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated .c Asset
    ↓
ESP32-P4
```

Status:

```text
PROVEN
```

Rule:

```text
Do not create a second icon export pipeline.

Do not bypass Asset Manager.

PNG remains the LVGLImage.py input format.
```

---

## Theme Pipeline

Single source of truth:

```text
FG_PREVIEW_PALETTES
    ↓
Theme Manager
    ↓
ForgeThemeContext
    ↓
Builder
    ↓
Preview
    ↓
Export
    ↓
ESP32-P4
```

Status:

```text
PROVEN

NO DRIFT
```

Rule:

```text
FG_PREVIEW_PALETTES remains the only source of truth.
```

---

## Runtime Systems

### RTC Runtime

```text
20_RTC
    ↓
Clock Widget
```

Status:

```text
PROVEN ON PHYSICAL ESP32-P4
```

Ownership:

```text
RTC owns truth

Clock owns display

LVGL timer owns refresh
```

---

### WiFi Runtime

```text
30_WIFI
    ↓
WiFi Widget
```

Status:

```text
PROVEN ON PHYSICAL ESP32-P4
```

Ownership:

```text
WiFi runtime owns truth

Widget owns display

LVGL timer owns refresh
```

---

## Runtime Architecture Rule

```text
Runtime owns truth

Widget owns display

LVGL timer owns refresh

UI owns neither
```

---

# Proven Systems

## Core Widgets

```text
Button
Text
Heading
Input
Textarea
Switch
Checkbox
Radio
Slider
Progress
CircularProgress
NumberInput
Select
Image
Box
Icon
IconButton
```

Status:

```text
Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
```

---

## LVGL Widgets

```text
Led
Bar
Arc
Chart
Calendar
Keyboard
Scale
Table
Roller
Msgbox
ButtonMatrix
Canvas
Line
Tabview
Tileview
AnimImage
```

Status:

```text
Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
```

---

## Runtime Widgets

```text
Clock
✓

WiFi
✓
```

Status:

```text
PHYSICAL P4 PROVEN
```

---

# AI Playground V1

Status:

```text
PROVEN
```

### Proven

```text
Template Library
✓

Document Model
✓

JSON Editor
✓

JSON.parse()
✓

Schema Validation
✓

Registry Binding
✓

Canvas Insertion
✓

Multi Component Layout
✓

Metadata Support
✓
```

### Architecture

```text
Template Library
    ↓
Layout Document
    ↓
JSON Editor
    ↓
JSON.parse()
    ↓
validateAiLayout()
    ↓
insertAiLayout()
    ↓
ForgeUI Store
    ↓
Canvas
```

### Rules

```text
AI suggests

ForgeUI validates

Builder owns layout

Preview owns preview

Export owns LVGL generation

Runtime owns truth

AI generates ForgeUI layouts only
```

### OpenAI Status

```text
PAUSED
```

Reason:

```text
Deferred until dedicated home development laptop.

No OpenAI integration required for current ForgeUI progress.
```

---

# Icon Library V1

Status:

```text
PROVEN
```

### Proven

```text
9514 React Icons
✓

Search
✓

Visual Browser
✓

Multi Select
✓

Selected Asset Tray
✓

Add Selected To Assets
✓

Canvas Render
✓

Preview Render
✓

PNG Generation
✓

Asset Manager Integration
✓

LVGLImage.py Conversion
✓

Generated C Assets
✓

ESP-IDF Build
✓

Physical ESP32-P4 Flash
✓

Builder / Preview / P4 Parity
✓

Image Scaling Correct
✓
```

Automatic Source Icon Removal
✓

One Click Asset Conversion
✓

One Click Studio Startup
✓

Automatic Previous Node Cleanup
✓

### Architecture

Icon Widget
    ↓
Browse Icons
    ↓
React Icon
    ↓
PNG Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated C Asset
    ↓
Source Icon Removed
    ↓
LVGL Export
    ↓
ESP32-P4
```

---

# Theme Manager V2

Status:

```text
PROVEN
```

### Proven

```text
Theme Selection
✓

Theme Persistence
✓

Preview Parity
✓

Export Parity
✓

Physical P4 Parity
✓

Texture Backgrounds
✓

FG_PREVIEW_PALETTES Binding
✓
```

---

# Build & Flash Pipeline

Status:

```text
PROVEN
```

### Proven

```text
Export Project
✓

Build & Flash
✓

Clean Build & Flash
✓

Detached Export
✓

ESP-IDF Reconfigure
✓

Physical Hardware Flash
✓
```

---

# Current Active Mission

```text
FORGEUI_DOCUMENT_RECOVERY_AND_STARTUP_CLEANUP__2026-07-11
```

Current exploration:

```text
Studio startup cleanup

Document persistence

Asset recovery

Browser blob restoration

Session recovery
```

---

# Current Next Mission

```text
FORGEUI_DOCUMENT_RECOVERY_AND_STARTUP_CLEANUP_NEXT
```

Goal:

```text
Investigate Studio persistence.

Locate localStorage / persistence.

Prevent orphaned browser assets.

Either:

Start with a clean document

or

Restore valid sessions only.
```

---

# Non-Negotiable Rules

```text
Do not rebuild RTC.

Do not rebuild WiFi.

Do not create duplicate theme systems.

Do not create duplicate runtime systems.

Do not bypass Builder.

Do not bypass Export.

Do not bypass the component store.

Do not create a second asset pipeline.

Extend proven systems.

Preserve:

Builder
    ↓
Preview
    ↓
Export
    ↓
ESP32-P4
```
