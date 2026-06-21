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

ForgeUI Studio is now operating with multiple proven runtime systems on physical ESP32-P4 hardware.

Current architecture has been validated through:

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

# Runtime Status

## Theme Runtime

```text
PROVEN
```

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

---

## RTC Runtime

```text
PROVEN ON PHYSICAL ESP32-P4
```

Architecture:

```text
20_RTC
    ↓
fg_rtc_format_time()
    ↓
fg_clock_tick_cb()
    ↓
Clock Widget
```

Proven:

```text
Clock widget
RTC integration
LVGL timer refresh
24-hour HH:MM display
Blinking colon heartbeat
Minute rollover
Builder / Preview / Export / P4 alignment
```

Runtime ownership:

```text
RTC runtime owns time truth

Clock widget owns display only

LVGL timer owns refresh
```

---

## WiFi Runtime

```text
PROVEN ON PHYSICAL ESP32-P4
```

Architecture:

```text
30_WIFI
    ↓
fg_wifi_status_text()
fg_wifi_ip_text()
    ↓
fg_wifi_tick_cb()
    ↓
WiFi Widget
```

Proven:

```text
INIT
 ↓
READY
 ↓
CONNECTING
 ↓
CONNECTED
 ↓
DHCP
 ↓
IP Address Display
```

Physical proof achieved:

```text
WIFI
CONNECTED
IP: 192.168.x.x
```

Runtime ownership:

```text
30_WIFI owns WiFi truth

WiFi widget owns display only

LVGL timer owns refresh

UI does not own WiFi truth
```

---

# Current Proven Runtime Systems

```text
Theme Runtime
    ✓ Proven

RTC Runtime
    ✓ Proven

WiFi Runtime
    ✓ Proven

Audio Runtime
    ✓ Runtime Exists
    ✓ BSP Proven
    ○ Studio Binding Pending

SD Runtime
    ✓ Runtime Exists
    ○ Studio Binding Pending

IO Runtime
    Future
```

# Runtime Maturity

```text
Theme
    Production Proven

RTC
    Production Proven

WiFi
    Production Proven

Audio
    Runtime Available

SD
    Runtime Available

IO
    Planned
```

# Runtime Architecture Rule

```text
Runtime owns truth.

Widget owns display.

LVGL timer owns refresh.

UI owns neither.
```

Examples:

```text
20_RTC
    ↓
Clock Widget
    ↓
Physical ESP32-P4

30_WIFI
    ↓
WiFi Widget
    ↓
Physical ESP32-P4

40_AUDIO
    ↓
Audio Widget
    ↓
Future

50_SD
    ↓
SD Widget
    ↓
Future
```

---

## Current Proven Widget Set

## Runtime Widgets

```text
Clock
WiFi
```

Proven:

```text
20_RTC
    ↓
Clock Widget
    ↓
Physical ESP32-P4

30_WIFI
    ↓
WiFi Widget
    ↓
Physical ESP32-P4
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

LVGL Export
    ✓

Physical ESP32-P4
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
AnimImage
Keyboard
```

Status:

```text
Builder
    ✓

Preview
    ✓

LVGL Export
    ✓

Physical ESP32-P4
    ✓
```

---

## Widget Coverage Status

```text
Core Widgets
    Proven

LVGL Widgets
    Proven

Runtime Widgets
    Proven

Theme Integration
    Proven

Asset Integration
    Proven

Builder → Preview → Export → P4
    Proven
```

---

# Current Architecture Truth

```text
Asset Manager = Proven

Uploaded Image Pipeline = Proven

Theme Pipeline = Proven

Theme Drift Elimination = Proven

Build & Flash = Proven

Detached Export = Proven

RTC Runtime = Proven

Clock Widget = Proven

WiFi Runtime = Proven

WiFi Widget = Proven

AI Playground = Proven

AI Menu Integration = Proven

AI Panel = Proven

Canvas Insertion = Proven

Physical ESP32-P4 Validation = Proven
```

---

# AI Playground V1 Status

## Status

```text
PROVEN IN STUDIO
```

## What Was Proven

```text
Editor Menu
    ↓
AI Playground

AI Playground panel opens correctly.

Custom event system proven.

AI Playground can call:

dispatch.components.addComponent()

Generated Heading successfully appears on canvas.

Canvas insertion path proven.
```

## Architecture Rule

```text
AI suggests.

ForgeUI schema validates.

Builder owns layout.

Preview owns preview.

Export owns LVGL generation.

Runtime owns truth.

AI does not write firmware.

AI does not generate arbitrary code.

AI generates ForgeUI layout definitions only.
```

## Proven Flow

```text
AI Playground
    ↓
Layout Definition
    ↓
dispatch.components.addComponent()
    ↓
ForgeUI Component Store
    ↓
Canvas Render
```

## Current Next Step

```text
Generate multi-component WiFi layout:

Heading
Input
Input
Button
Button

Then transition to JSON-driven layouts.

Later:

OpenAI API
    ↓
ForgeUI Layout JSON
    ↓
Validation
    ↓
Canvas Insertion
```

```
```


# Current Next Mission

```text
FORGEUI_AI_PLAYGROUND_V1__MULTI_COMPONENT_LAYOUT_JSON_NEXT__2026-06-21
```

Goal:

```text
Create first user-facing WiFi setup entry point.

Do not rebuild WiFi.

Do not touch BSPs.

Do not create another WiFi framework.

Use existing proven 30_WIFI runtime.
```

Future roadmap:

```text
V1 Static Widget
    COMPLETE

V2 Runtime Status Binding
    COMPLETE

V3 Connected + IP Proof
    COMPLETE

V4 WiFi Setup Entry Point
    NEXT

V5 WiFi Drawer

V6 Network Scan

V7 Password Entry

V8 Keyboard Integration

V9 Save Credentials

V10 NVS Persistence

V11 Auto Connect
```

# Heading Font Pipeline Fix

# Heading Font Pipeline Validation

## Status

```text
PROVEN ON PHYSICAL ESP32-P4
```

---

## Original Blocker

```text
Heading export used:

lv_font_montserrat_32

Browser Preview rendered correctly.

Generated LVGL export rendered correctly.

Physical ESP32-P4 could not safely validate the Heading widget because the required LVGL font sizes were not enabled in the active ESP-IDF configuration.
```

---

## Root Cause

```text
ForgeUI Studio export and runtime were aligned.

LVGL font resources were not.

The generated export referenced font sizes that were unavailable in the active firmware build.
```

---

## Fix Applied

Enabled larger Montserrat font sizes in:

```text
firmware/ForgeUI-One/sdkconfig

firmware/ForgeUI-One/sdkconfig.defaults
```

Required font configuration:

```text
CONFIG_LV_FONT_MONTSERRAT_28=y
CONFIG_LV_FONT_MONTSERRAT_30=y
CONFIG_LV_FONT_MONTSERRAT_32=y
CONFIG_LV_FONT_MONTSERRAT_36=y
CONFIG_LV_FONT_MONTSERRAT_40=y
CONFIG_LV_FONT_MONTSERRAT_48=y
```

---

## Validation Flow

```text
Studio
    ↓
Builder
    ↓
Browser Preview
    ↓
LVGL Export
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
```

---

## Result

```text
Heading rendered successfully on physical ESP32-P4.
```

Proven:

```text
Heading Widget
    ✓ Proven

LVGL Font Pipeline
    ✓ Proven

Builder → Preview → Export → P4
    ✓ Proven
```

---

## Architecture Truth

```text
Widgets may reference LVGL fonts.

Firmware must provide matching LVGL font resources.

Preview and Export are only considered proven once validated on physical hardware.
```

---

## Future Benefit

The following font sizes are now available to future widgets:

```text
28
30
32
36
40
48
```

This supports:

```text
Heading Widget

Clock Widget

WiFi Widget

Future Dashboard Widgets

Future Status Widgets
```

without requiring further LVGL font configuration work.

```
```

---

# Heading Architecture Truth

```text
Browser font-size and LVGL font size are not pixel-identical.

CSS font-size: 32px
    is not visually identical to
lv_font_montserrat_32

This is acceptable.

The important proof is that the Heading widget exports, compiles, flashes, and renders correctly on hardware.
```
# RTC Runtime Architecture Status

# Clock Widget V5 Status

## Status

PROVEN ON PHYSICAL ESP32-P4

## What Was Proven

Clock widget appears in ForgeUI Studio sidebar

Clock widget can be placed on Builder canvas

Clock widget renders on Builder canvas

Clock widget updates live in Builder

Clock widget renders in Browser Preview

Clock widget exports to generated LVGL C

Generated LVGL compiles successfully

ESP-IDF Build & Flash succeeds

Physical ESP32-P4 renders Clock widget correctly

RTC runtime integration proven

LVGL timer refresh proven

Builder / Preview / Export / P4 alignment proven

Blinking colon heartbeat proven

24-hour HH:MM display format proven

Minute rollover observed on hardware

## Runtime Architecture

20_RTC.c
    ↓
fg_rtc_format_time()
    ↓
fg_clock_tick_cb()
    ↓
lv_label_set_text()
    ↓
Clock Widget

UI does not own time truth.

RTC runtime owns time truth.

Clock widget owns display only.

LVGL timer owns refresh.
---

# Heading Widget Result

```text
Heading = COMPLETE
Preview = COMPLETE
LVGL Export = COMPLETE
Font Pipeline = COMPLETE
ESP32-P4 Hardware Proof = COMPLETE
```

---

# Current Proven Widget Set

## Original / Core Widgets

```text
Button = Proven
Text = Proven
Heading = Proven
Input = Proven
Textarea = Proven
Switch = Proven
Checkbox = Proven
Radio = Proven
Slider = Proven
Progress = Proven
CircularProgress = Proven
NumberInput = Proven
Select = Proven
Image = Proven
Box = Proven
```

---

## LVGL / Embedded Widgets

```text
Led = Proven
Bar = Proven
Arc = Proven
Chart = Proven
Table = Proven
Calendar = Proven
Scale = Proven
Roller = Proven
Msgbox = Proven
ButtonMatrix = Proven
Canvas = Proven
Line = Proven
Tabview = Proven
Tileview = Proven
```

---

# Theme Architecture Status

## Status

```text
PROVEN
NO DRIFT
```

## Single Source Of Truth

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

---

## Theme Drift Rule

```text
Do not recreate FG_PALETTES.

Do not add duplicate theme maps.

Do not create another theme selector.

Do not split Browser Preview themes from Export themes.

FG_PREVIEW_PALETTES remains the only source of truth.
```

---

# Current Architecture Truth

```text
Asset Manager = Proven

Uploaded Image Pipeline = Proven

Browser Preview = Proven

Theme Manager = Proven

Theme Pipeline = Proven

Theme Drift Elimination = Proven

Build & Flash = Proven

Clean Build & Flash = Proven

Detached Export = Proven

LVGLImage.py = Proven

PNG → LVGL C = Proven

Generated Asset Compilation = Proven

Physical ESP32-P4 Rendering = Proven

Heading Font Pipeline = Proven

Heading Widget = Proven

RTC Runtime = Proven

Clock Widget = Proven

Clock RTC Integration = Proven

LVGL Timer Refresh = Proven

Builder/Preview/P4 Clock Alignment = Proven

Blinking Colon Heartbeat = Proven
```

---

# SEO / Public Project Description

```text
ForgeUI Studio is an open-source visual LVGL v9 HMI designer, code generator, asset pipeline, theme manager, and ESP-IDF flash workflow for ESP32-P4 displays.

It bridges browser-based drag-and-drop UI design with embedded LVGL C export and physical ESP32-P4 hardware validation.

The project targets Waveshare ESP32-P4 7-inch 1024x600 HMI hardware and supports visual layout, preview, generated firmware, uploaded image conversion, theme export, and one-click build/flash workflows.
```

---

# Current Proven Hardware Target

```text
Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

Resolution:
1024x600

LVGL:
v9.2.2

ESP-IDF:
v5.5.x

Display path:
MIPI-DSI LCD

Touch:
GT911
```

---

# Current Build / Flash Truth

```text
Build & Flash works

Clean Build & Flash works

Detached ESP-IDF Export works

ESP-IDF project compiles generated LVGL

Generated assets compile

Generated themes compile

Uploaded images compile

Heading fonts compile

Physical ESP32-P4 renders exported Studio layouts
```

---

# Uploaded Image Pipeline

## Status

```text
PROVEN
```

## Flow

```text
Uploaded Asset
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Firmware assets/uploads
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
Physical ESP32-P4 Rendering
```

---

# Theme Pipeline

## Status

```text
PROVEN
NO DRIFT
```

## Flow

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

---

# Browser Side Status

```text
PROVEN
```

Capabilities:

```text
Drag and drop layout

Fixed 1024x600 device canvas

Builder mode

Browser Preview

Theme Manager

Theme cards

Theme previews

Uploaded image thumbnails

Uploaded image rendering

Custom ForgeUI widgets

LVGL-focused widget sidebar

Heading widget rendering

AI / sci-fi backgrounds

Fullscreen hero backgrounds

Texture backgrounds

Clock widget rendering

24-hour HH:MM clock preview

Clock heartbeat preview
```

---

# Firmware Side Status

```text
PROVEN
```

Capabilities:

```text
Generated LVGL layout compilation

Generated widget export

Generated theme export

Generated asset source registration

Generated CMake injection

LV_IMAGE_DECLARE generation

lv_image_set_src generation

Montserrat font pipeline

Uploaded image rendering

Theme background rendering

ESP-IDF Build & Flash

Physical ESP32-P4 validation

RTC runtime integration

Clock widget export

LVGL timer generation

Clock heartbeat generation

HH:MM runtime formatting
```

---

# Feature Touch Map

## Add / Edit Themes

Touch:

```text
studio/src/forgeui/preview/forgeThemeMap.ts
```

Rule:

```text
Themes start in forgeThemeMap.ts.

Do not duplicate theme definitions in ForgeUILvglExport.ts.
```

---

## Add / Edit Widgets

Touch:

```text
studio/src/forgeui/ForgeUIWidgetSet.ts
studio/src/components/editor/ComponentPreview.tsx
studio/src/forgeui/ForgeUILvglExport.ts
```

Rule:

```text
Browser widget first.
Browser Preview second.
LVGL Export third.
P4 flash fourth.
```

---

## Add / Edit LVGL Font Sizes

Touch:

```text
firmware/ForgeUI-One/sdkconfig
firmware/ForgeUI-One/sdkconfig.defaults
```

Then run:

```text
ESP-IDF Reconfigure
Clean Build & Flash
```

Rule:

```text
If LVGL export references a font, that font must be enabled in sdkconfig and sdkconfig.defaults.
```

---

## Add Uploaded Image Features

Touch:

```text
studio/src/forgeui/assets/ForgeUIAssetManager.tsx
studio/src/forgeui/ForgeUIUploadedAssetRegistry.ts
studio/src/forgeui/ForgeUILvglExport.ts
tools/lvgl/LVGLImage.py
firmware/ForgeUI-One/main/assets/uploads/
```

---

## Add Background Textures

Touch:

```text
studio/public/textures/
firmware/ForgeUI-One/main/assets/themes/
studio/src/forgeui/preview/forgeThemeMap.ts
studio/src/forgeui/ForgeUILvglExport.ts
```

---

# WiFi Runtime Binding V2

## Current Mission

```text
FORGEUI_SIDEBAR_AUDIT_CONTINUE
```

## Goal

Prove AI-generated layouts can create multiple ForgeUI components.

Do not touch export.

Do not touch LVGL.

Do not touch firmware.

Use existing addComponent() path.

Move from single Heading insertion
to multi-component layout insertion.

---

# Sidebar Audit Rule

Each widget should become one of:

```text
KEEP
    Useful embedded LVGL/HMI widget

ALIVE
    Browser Preview + LVGL Export + P4 proof exists

PARK
    Potential future value but not needed now

REMOVE / HIDE
    Web-only clutter or duplicate of a better LVGL widget
```

---

# Current Keep List

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
```

---

# Current Audit Targets

```text
Icon
IconButton
Divider
```

Likely outcome:

```text
Icon       → Park or map to Image
IconButton → Park or map to Button + Image
Divider    → Park or map to Line
```

Reason:

```text
These are inherited OpenChakra-style web widgets.

They may be redundant because ForgeUI already has Image, Button, and Line widgets with better embedded LVGL value.
```

---

# Next Work Order

```text
1. Audit Icon

2. Audit IconButton

3. Audit Divider

4. Decide KEEP / PARK / REMOVE

5. Update forgeuiCoreWidgets

6. Validate sidebar remains clean

7. Validate Builder drag/drop

8. Validate Browser Preview

9. Validate LVGL Export if kept

10. Validate ESP32-P4 only for widgets that remain embedded-useful
```

---

# Do Not Drift Rules

```text
Do not re-open solved image conversion research.

Do not create a second theme source.

Do not create a second theme selector.

Do not split Preview from Export theme ownership.

Do not add widgets only because OpenChakra had them.

Do not keep web-only widgets unless they have real embedded HMI value.

Do not ask for large file dumps first.

Identify the lane first:
Browser / Export / Firmware / Asset / Theme.
Then request the smallest required file.
```

---

# Current Immediate Next Mission

```text
FORGEUI_WIFI_RUNTIME_BINDING_V2__30_WIFI_STATUS_IP_TIMER__2026-06-20
```

## Start Here

```text
Icon
    ↓
IconButton
    ↓
Divider
```

Decision target:

```text
Park or remove if redundant.

Only keep if they produce useful LVGL output on ESP32-P4.
```

---

# Save Point Summary

```text
FORGEUI_HEADING_WIDGET_COMPLETE__PREVIEW_EXPORT_P4_FONT_PIPELINE_PROVEN__NEXT_SIDEBAR_AUDIT__2026-06-19
```

## Meaning

```text
Heading widget is complete.

Preview/export/font/hardware path is proven.

Montserrat larger font pipeline is now enabled.

Physical ESP32-P4 renders Heading correctly.

ForgeUI continues with sidebar audit next.

No architecture drift allowed.
```
