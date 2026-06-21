# SPINE

## Current Save Point

```text
FORGEUI_AI_PLAYGROUND_V1__MENU_PANEL_CANVAS_INSERTION_PROVEN__MULTI_COMPONENT_LAYOUT_NEXT__2026-06-21
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

## Studio Systems

```text
Asset Manager
    ✓ Proven

Theme Manager
    ✓ Proven

AI Playground
    ✓ Proven

Browser Preview
    ✓ Proven

Build & Flash
    ✓ Proven

Clean Build & Flash
    ✓ Proven

Detached Export
    ✓ Proven
```

---

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
Generated Export
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
```

Status:

```text
PROVEN
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
Browser Preview
    ↓
LVGL Export
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

Do not create duplicate theme maps.

Do not create duplicate theme selectors.
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
RTC runtime owns time truth.

Clock widget owns display only.

LVGL timer owns refresh.
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
30_WIFI owns WiFi truth.

WiFi widget owns display only.

LVGL timer owns refresh.

UI owns neither.
```

---

## Runtime Architecture Rule

```text
Runtime owns truth.

Widget owns display.

LVGL timer owns refresh.

UI owns neither.
```

---

# Current Proven Widget Status

## Runtime Widgets

```text
Clock
    ✓ Proven

WiFi
    ✓ Proven
```

---

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
Table
Calendar
Scale
Roller
Msgbox
ButtonMatrix
Canvas
Line
Tabview
Tileview
Keyboard
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

# AI Playground V1

## Status

```text
PROVEN IN STUDIO
```

## What Was Proven

```text
Editor Menu
    ↓
AI Playground

AI Playground panel opens.

Custom event system works.

AI Playground can insert components.

dispatch.components.addComponent()
    ↓
ForgeUI Store
    ↓
Canvas Render

Canvas insertion path proven.
```

---

## AI Architecture Rule

```text
AI suggests.

ForgeUI validates.

Builder owns layout.

Preview owns preview.

Export owns LVGL generation.

Runtime owns truth.

AI does not write firmware.

AI does not generate arbitrary code.

AI generates ForgeUI layout definitions only.
```

---

## Proven Flow

```text
AI Playground
    ↓
Layout Definition
    ↓
ForgeUI Component Store
    ↓
Canvas Render
```

---

# Current Next Mission

```text
FORGEUI_AI_PLAYGROUND_V1__MULTI_COMPONENT_LAYOUT_JSON_NEXT__2026-06-21
```

Goal:

```text
Generate a complete WiFi setup layout from AI Playground.

Heading
Input
Input
Button
Button

Move from:

Single Component
    ↓
Multi Component Layout
    ↓
JSON Layout Definition
```

Success criteria:

```text
AI Playground
    ↓
Layout Definition
    ↓
Multiple Components
    ↓
Canvas Render

Proven
```

---

# Future AI Roadmap

```text
V1 AI Menu
    ✓ Complete

V2 AI Panel
    ✓ Complete

V3 Canvas Insertion
    ✓ Complete

V4 Multi Component Layout
    Next

V5 JSON Layout Generation

V6 OpenAI Integration

V7 ForgeUI Schema Validation

V8 Insert To Canvas

V9 Layout Library

V10 Asset Generation

V11 ForgeUI Playbooks
```

---

# Current Hardware Target

```text
Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

Resolution:
1024x600

LVGL:
9.2.2

ESP-IDF:
5.5.x

Display:
MIPI-DSI

Touch:
GT911
```

---

# Build Truth

```text
Build & Flash
    ✓ Working

Clean Build & Flash
    ✓ Working

Detached Export
    ✓ Working

Generated LVGL
    ✓ Compiles

Generated Assets
    ✓ Compile

Generated Themes
    ✓ Compile

Physical ESP32-P4
    ✓ Proven
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

Extend proven systems.

Preserve Builder → Preview → Export → P4 architecture.
```
