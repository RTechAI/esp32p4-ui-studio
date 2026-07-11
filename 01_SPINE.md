SPINE
Current Save Point
FORGEUI_STANDALONE_EXPORT__INDEPENDENT_VSCODE_BUILD_AND_FLASH__MULTIPLE_ICON_PIPELINE__PHYSICAL_P4_PROVEN__2026-07-11
Project Status
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, code generator, asset pipeline, theme system, and ESP-IDF workflow targeting ESP32-P4 hardware.

Core pipeline proven:

Builder
    ↓
Browser Preview
    ↓
LVGL Export
    ↓
Generated C
    ↓
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
Current Architecture Truth
Asset Pipeline
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
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4

Status:

PROVEN
React Icon Asset Pipeline
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
Base64 browserSrc
    ↓
ForgeUI Uploaded Asset
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
Standalone ESP-IDF Project
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4

Status:

FULLY PROVEN

MULTIPLE UNIQUE ICONS

PHYSICAL HARDWARE VERIFIED
Architecture Rule
React Icons are exported as LVGL image assets.

Icons use the identical export pipeline as Image widgets.

Do not create a second icon export pipeline.

Do not bypass Asset Manager.

PNG remains the LVGLImage.py input format.

Persist browserSrc.

Persist uploadedAssetId.

Persist assetName.

Blob URLs are temporary session resources only.

Base64 browserSrc is the persistent browser representation.
Icon Export Architecture
Icon Widget
    ↓
Use As Icon Widget
    ↓
React Icon
    ↓
PNG Generation
    ↓
ForgeUI Uploaded Asset
    ↓
LVGLImage.py
    ↓
Generated LVGL C Asset
    ↓
Asset Registry
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP32-P4

Status:

PROVEN

MULTIPLE UNIQUE ICONS

PHYSICAL ESP32-P4 VERIFIED

Compatibility Rule:

LV_SYMBOL support remains available only as a backwards compatibility fallback.

Primary export path is LVGL image assets.
Theme Pipeline

Single source of truth:

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

Status:

PROVEN

NO DRIFT

Rule:

FG_PREVIEW_PALETTES remains the only source of truth.
Runtime Systems
RTC Runtime
20_RTC
    ↓
Clock Widget

Status:

PROVEN ON PHYSICAL ESP32-P4

Ownership:

RTC owns truth

Clock owns display

LVGL timer owns refresh
WiFi Runtime
30_WIFI
    ↓
WiFi Widget

Status:

PROVEN ON PHYSICAL ESP32-P4

Ownership:

WiFi runtime owns truth

Widget owns display

LVGL timer owns refresh
Runtime Architecture Rule
Runtime owns truth

Widget owns display

LVGL timer owns refresh

UI owns neither
Proven Systems
Core Widgets
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

Status:

Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
LVGL Widgets
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

Status:

Builder
✓

Preview
✓

Export
✓

ESP32-P4
✓
Runtime Widgets
Clock
✓

WiFi
✓

Status:

PHYSICAL P4 PROVEN
AI Playground V1

Status:

PROVEN
Icon Library V1

Status:

FULLY PROVEN
Proven
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

Use As Icon Widget
✓

Canvas Render
✓

Preview Render
✓

Browser Persistence
✓

PNG Generation
✓

Base64 Persistence
✓

Asset Manager Integration
✓

LVGLImage.py Conversion
✓

Generated C Assets
✓

LVGL Export
✓

ESP-IDF Build
✓

Physical ESP32-P4 Flash
✓

Multiple Unique Icons
✓

Builder / Preview / Export / P4 Parity
✓

Unified Image Asset Pipeline
✓
Architecture
React Icon
    ↓
Use As Icon Widget
    ↓
PNG Generation
    ↓
ForgeUI Uploaded Asset
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
Standalone ESP-IDF Project
    ↓
ESP32-P4
Theme Manager V2

Status:

PROVEN
Build & Flash Pipeline

Status:

PROVEN
Proven
Export Project
✓

Detached Standalone Export
✓

Independent VS Code Build
✓

ESP-IDF Extension Build
✓

ESP-IDF Reconfigure
✓

Independent Build Environment
✓

Clean Build
✓

Build & Flash
✓

Independent Physical ESP32-P4 Flash
✓

Physical Hardware Flash
✓
Standalone Export Pipeline

Status:

FULLY PROVEN
Proven
ForgeUI Export
✓

Standalone ESP-IDF Project
✓

Fresh Laptop Verification
✓

VS Code Workflow
✓

ESP-IDF Extension
✓

Independent Build
✓

Independent Flash
✓

Physical ESP32-P4
✓
Architecture
ForgeUI Studio
    ↓
Export Project
    ↓
Standalone ESP-IDF Project
    ↓
VS Code
    ↓
ESP-IDF Extension
    ↓
Build
    ↓
Flash
    ↓
Physical ESP32-P4
Rules
Exported projects are completely standalone.

ForgeUI Studio is not required after export.

ESP-IDF owns build and flash.

ForgeUI owns project generation.

Every exported project must remain independently buildable.
Current Active Mission
FORGEUI_STANDALONE_EXPORT_AND_ICON_WORKFLOW_SIMPLIFICATION__2026-07-11

Current exploration:

Remove duplicate icon workflows

Automatic icon asset reuse

Duplicate asset prevention

Automatic asset cleanup

Startup cleanup

Document persistence

Session recovery

Standalone export documentation

VS Code build workflow
Current Next Mission
FORGEUI_ICON_WORKFLOW_AUTOMATION__ASSET_REUSE__DOCUMENT_RECOVERY__2026-07-12

Goal:

Complete the remaining workflow automation.

React Icon
    ↓
Asset Reuse
    ↓
Single Asset Pipeline
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
VS Code
    ↓
ESP32-P4

One click.

Zero duplicate assets.

Zero manual cleanup.

Preserve standalone exported project compatibility.
Non-Negotiable Rules
Do not rebuild RTC.

Do not rebuild WiFi.

Do not create duplicate theme systems.

Do not create duplicate runtime systems.

Do not bypass Builder.

Do not bypass Export.

Do not bypass the component store.

Do not create a second asset pipeline.

Do not create a second icon export pipeline.

React Icons must export through the Image asset pipeline.

Every exported project must remain standalone and independently buildable.

Extend proven systems.

Preserve:

Builder
    ↓
Preview
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
ESP32-P4