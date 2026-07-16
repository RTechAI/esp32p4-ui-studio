# SPINE

## Current Save Point

```text
FORGEUI_V2_3_9__FIRMWARE_SWEEP_PROVEN__FACTORY_RESET__DETERMINISTIC_FIRMWARE_PIPELINE__2026-07-16
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

FIRMWARE FACTORY RESET PROVEN

FIRMWARE SWEEP PROVEN

DETERMINISTIC BUILD PIPELINE PROVEN

CMAKE REGENERATION PROVEN

STUDIO EXPORT REGENERATION PROVEN
```

---

# Major Milestone

ForgeUI Studio now includes a complete Firmware Factory Reset and Firmware Sweep system.

Firmware is no longer incrementally accumulated.

Every firmware rebuild can now start from a known clean baseline.

---

# Proven Firmware Sweep Pipeline

```text
Firmware Sweep
        ↓
Clean Firmware Assets
        ↓
Delete ESP-IDF Build Folder
        ↓
Regenerate 90_Studio_Export.c
        ↓
Regenerate 90_Studio_Export.h
        ↓
Regenerate CMakeLists.txt
        ↓
Remove Stale LVGL Declarations
        ↓
Remove Stale Uploaded Assets
        ↓
Ready For Build & Flash
```

Status

```text
FULLY PROVEN
```

---

# Factory Reset Validation

Successfully validated:

```text
Firmware Upload Folder
✓

Upload Input Folder
✓

Uploaded Asset Registry
✓

In-Memory Asset Registry
✓

Browser Persistence
✓

Hero Background Reset
✓

Theme Reset
✓

ESP-IDF Build Folder Removal
✓

CMake Regeneration
✓

Studio Export Regeneration
✓
```

---

# Regeneration Validation

Firmware Sweep correctly restores:

```text
90_Studio_Export.c

↓

Minimal Baseline Export

↓

No Widgets

↓

No LV_IMAGE_DECLARE()

↓

No Uploaded Asset References
```

After rebuilding:

```text
Current Canvas
        ↓
Generate Export
        ↓
Generate CMake
        ↓
Only Current Assets Included
```

No historical firmware artefacts remain.

Status

```text
PROVEN
```

---

# Deterministic Firmware Architecture

```text
Canvas
      ↓
LVGL Export
      ↓
Firmware Sweep
      ↓
Fresh CMake
      ↓
Fresh Studio Export
      ↓
Build
      ↓
Flash
      ↓
Physical ESP32-P4
```

---

# Core Rule

```text
Disk is the source of truth.
```

Never trust:

```text
Cached browser assets

Stale uploaded asset registry

Old generated C files

Historical CMake entries

Orphaned LVGL declarations
```

Every firmware image is regenerated from the current project state.

---

# Next Milestone

## Runtime Widget Expansion

The firmware pipeline is now stable enough to begin expanding interactive runtime widgets.

Initial targets:

```text
Switch

↓

LED

↓

GPIO Binding

↓

Board Profiles

↓

AI Runtime Widget Generation
```

The deterministic firmware pipeline established in v2.3.9 provides the foundation for future AI-generated runtime controls and hardware-aware widgets.

-------------------------------------------------------------


# SPINE

## Current Save Point

```text
FORGEUI_AI_SEMANTIC_ICON_RESOLVER__PROMPT_AWARE_REGISTRY_SEARCH__AUTOMATIC_ICON_ASSET_PIPELINE__CANVAS_PREVIEW_PROVEN__2026-07-15

Project Status
ACTIVE

STABLE

AI LAYOUT PIPELINE PROVEN

AI HERO PIPELINE PROVEN

SEMANTIC ICON RESOLUTION PROVEN

AUTOMATIC ICON ASSET CREATION PROVEN

CANVAS / PREVIEW ICON PARITY PROVEN

Major Milestone

ForgeUI Studio can now resolve natural-language icon intent into real ForgeUI icon assets automatically.

The user no longer needs to know icon registry names, asset IDs, filenames, LVGL symbols or conversion details.

Example:

User Prompt

"Create a dashboard with WiFi, battery and clock icons"

ForgeUI now performs:

Natural Language Intent
        ↓
Prompt Keyword Detection
        ↓
Search Existing 9,514 Icon Registry
        ↓
Relevant Icon Candidates Added To AI Context
        ↓
GPT Generates Icon Components
        ↓
Semantic Icon Name Resolution
        ↓
React Icon Rendered To PNG
        ↓
ForgeUI Uploaded Asset
        ↓
Automatic LVGL Conversion
        ↓
Icon Widget Props Populated
        ↓
Builder Canvas
        ↓
Browser Preview

Status

FULLY PROVEN
Semantic Icon Pipeline
User Request
        ↓
ForgeAIContext
        ↓
Relevant Icon Search
        ↓
ForgeAI System Prompt
        ↓
Layout JSON
        ↓
iconName: "wifi"
        ↓
ForgeUIIconResolver
        ↓
Exact Registry Match
        ↓
FiWifi
        ↓
PNG Asset
        ↓
LVGL Ready Asset
        ↓
Icon Widget
        ↓
Canvas
        ↓
Preview

Status

PROVEN
Existing Icon Registry Reuse

ForgeUI does not maintain a second AI icon database.

The AI system reuses the existing icon registry already powering the ForgeUI Icon Browser.

React Icons Registry

Fi
Md
Ai
Fa
Bs
Io5

Total available icons:

9,514

Shared source of truth:

iconsList.ts
ICON_NAMES
ICON_COUNT

Status

PROVEN
Prompt-Aware Icon Context

ForgeAIContext now detects relevant icon concepts in the user prompt.

Current supported semantic search terms include:

wifi
battery
clock
settings
power
home
warning
alert
temperature
bluetooth
signal
volume
play
pause
stop
menu
search
user

For each detected term, ForgeUI searches the existing icon registry and attaches only a small relevant shortlist to the AI system prompt.

Example:

User Prompt

"Create a status bar with WiFi, battery and clock"

AI context receives:

wifi:
- FiWifi
- MdWifi
- IoWifi

battery:
- MdBatteryFull
- BsBattery
- IoBatteryFull

clock:
- FiClock
- MdAccessTime
- IoTime

The complete 9,514-icon registry is never sent to GPT.

Status

PROVEN
Semantic Resolver Architecture

The AI is not responsible for engineering asset details.

GPT only expresses intent:

{
  "type": "Icon",
  "props": {
    "positionMode": "absolute",
    "x": 900,
    "y": 20,
    "w": 32,
    "h": 32,
    "iconName": "wifi"
  }
}

ForgeUI resolves the implementation:

wifi
        ↓
Exact Icon Registry Name
        ↓
PNG Generation
        ↓
Uploaded Asset Registry
        ↓
LVGLImage Conversion
        ↓
uploadedAssetId
        ↓
src
        ↓
assetName
        ↓
lvgl
        ↓
cFile
        ↓
Icon Widget

Ownership rule:

AI expresses intent.

ForgeUI resolves assets.

Builder owns layout.

Export owns LVGL generation.

Status

PROVEN
Shared Icon Search Architecture

New shared helper:

src/forgeui/icons/ForgeUIIconSearch.ts

Consumers:

Icon Browser
        │
        ├──────────────┐
        │              │
        ▼              ▼
Manual Search     ForgeAIContext

This preserves one search implementation and one icon registry.

Status

PROVEN
Shared Icon Resolver

New resolver:

src/forgeui/icons/ForgeUIIconResolver.tsx

Responsibilities:

Resolve Semantic Icon Name

Reuse Existing LVGL-Ready Asset

Render React Icon To SVG

Convert SVG To PNG

Create ForgeUI Uploaded Asset

Call Existing LVGL Conversion Endpoint

Update Asset Registry

Populate Icon Widget Props

Resolved properties:

iconName
icon
uploadedAssetId
src
assetName
alt
objectFit
lvgl
cFile

Status

PROVEN
Icon Widget Contract

The existing ForgeUI Icon widget renders from:

icon

The AI contract uses:

iconName

The resolver now bridges the two:

AI iconName
        ↓
ForgeUI Resolver
        ↓
Icon widget icon prop

This preserves compatibility with the existing manual Icon Browser workflow.

Status

PROVEN
Proven End-To-End Test

Prompt:

Create a modern industrial dashboard for a 1024x600 ESP32-P4 display.

Add three separate top-right status icons:

WiFi
Battery
Clock

Result:

WiFi icon
✓

Battery icon
✓

Clock icon
✓

Separate top-level components
✓

No unsupported widget types
✓

No duplicate gear fallback
✓

Automatic asset creation
✓

Automatic LVGL conversion
✓

Canvas rendering
✓

Browser Preview rendering
✓

Status

FULLY PROVEN
Architecture Validation

The implementation follows the ForgeUI non-negotiable rules:

Preserve Builder
✓

Preserve Preview
✓

Preserve LVGL Export
✓

Do Not Duplicate Asset Pipelines
✓

AI Extends Existing ForgeUI Systems
✓

Existing Icon Registry Reused
✓

Existing Uploaded Asset Registry Reused
✓

Existing LVGL Conversion Endpoint Reused
✓
Current Architecture
Natural Language Prompt
        │
        ▼
ForgeAIContext
        │
        ├──────────────┐
        │              │
        ▼              ▼
Component Context   Icon Registry Search
        │              │
        └──────┬───────┘
               ▼
         GPT Layout JSON
               │
               ▼
       Semantic Icon Intent
               │
               ▼
       ForgeUIIconResolver
               │
               ▼
      Existing Asset Pipeline
               │
               ▼
          Builder Canvas
               │
               ▼
        Browser Preview
               │
               ▼
          LVGL Export
               │
               ▼
            ESP-IDF
               │
               ▼
          Physical ESP32-P4
Next Milestone
Physical ESP32-P4 Icon Validation

Validate the semantic icon resolver through the complete export and physical hardware pipeline.

AI Prompt
        ↓
Semantic Icon Resolution
        ↓
LVGL Ready Assets
        ↓
Standalone Export
        ↓
ESP-IDF Build
        ↓
ESP32-P4 Flash
        ↓
Physical Display

Validation targets:

WiFi icon
Battery icon
Clock icon
Correct asset declarations
Correct LVGL image sources
No missing assets
No default gear fallback
Future Extension

The same semantic resolver pattern can later support:

Image Assets

Industrial Symbols

Custom Generated Icons

Widget Templates

Hero Backgrounds

Control Templates

Runtime Widgets

Future architecture:

AI Intent
        ↓
ForgeUI Resolver
        ↓
Existing ForgeUI System
        ↓
Editable Canvas Asset
        ↓
LVGL Export
        ↓
Physical Hardware
Summary

ForgeUI Studio now supports prompt-aware semantic icon generation without sending the complete icon registry to GPT.

User says:

"Add WiFi, battery and clock"

        ↓

ForgeUI searches its existing icon ecosystem

        ↓

GPT creates semantic Icon components

        ↓

ForgeUI resolves and generates real assets

        ↓

Canvas and Preview display the correct icons

This milestone establishes the first proven semantic asset resolver inside ForgeUI and creates a reusable architecture for future AI-generated assets and widgets.


Commit name:

```text
feat(ai): add semantic icon resolver and automatic asset pipeline

----------------------------------------------------------------------------


# SPINE

## Current Save Point

```text
FORGEUI_AI_STUDIO_V2_3_3__DEVICE_AWARE_HERO_IMPORT_PIPELINE__1024X600_NATIVE_ASSETS__CANVAS_PREVIEW_P4_PARITY__2026-07-13
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI LAYOUT PIPELINE PROVEN

AI HERO PIPELINE PROVEN

DEVICE-AWARE HERO IMPORT PROVEN

CANVAS / PREVIEW / ESP32-P4 PARITY PROVEN
```

---

# Major Milestone

ForgeUI Studio now performs automatic device-aware preprocessing for AI-generated and uploaded Hero Backgrounds.

Images are no longer converted at their original resolution.

During import, ForgeUI now:

```text
Detects Image Size
        ↓
Center Crops
        ↓
Resizes To Active Device Resolution
        ↓
Generates Native LVGL Asset
        ↓
Builder
        ↓
Browser Preview
        ↓
ESP32-P4
```

This eliminates the rendering mismatch previously caused by oversized assets and ensures identical rendering across the complete ForgeUI pipeline.

Status

```text
FULLY PROVEN
```

---

# Native Hero Asset Pipeline

```text
Natural Language Prompt
        ↓
OpenAI Image Generation
        ↓
PNG Upload
        ↓
ForgeUI Image Preprocessor
        ↓
Center Crop
        ↓
1024×600 Native PNG
        ↓
LVGLImage.py
        ↓
Native LVGL C Asset
        ↓
Theme Manager
        ↓
Builder Canvas
        ↓
Browser Preview
        ↓
ESP-IDF Export
        ↓
Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# Platform Validation

The following pipeline has now been physically validated.

```text
Canvas
      ✓

Browser Preview
      ✓

Generated LVGL Asset
      ✓

Standalone Export
      ✓

ESP-IDF Build
      ✓

ESP32-P4 Flash
      ✓

Physical Display
      ✓
```

Result

```text
Canvas

≈

Browser Preview

≈

Physical Hardware
```

---

# Architecture Discovery

Root cause identified:

```text
LVGL was never the issue.

ESP32-P4 was never the issue.

Browser Preview was never the issue.
```

The issue was that imported Hero images were converted using their original dimensions.

Example

```text
Original

1536 × 1024

↓

LVGL Native Asset

1536 × 1024

↓

1024 × 600 Display

↓

Clipping
```

Now

```text
Original Image

↓

Automatic Crop

↓

Automatic Resize

↓

1024 × 600 Native Asset

↓

LVGL

↓

Perfect Display Fit
```

---

# Native LVGL Asset Verification

Generated assets now correctly produce:

```c
.w = 1024
.h = 600
.stride = 4096
```

Status

```text
PROVEN
```

---

# ForgeUI Architecture

```text
Layout AI
        │
        ├──────────────┐
        │              │
        ▼              ▼
Layout JSON     Hero Generation
        │              │
        ▼              ▼
Canvas      Image Preprocessor
        │              │
        ▼              ▼
Builder Canvas
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

---

# Next Milestone

## Device Profiles

Generalise the image preprocessor so imported assets automatically target the currently selected ForgeUI device.

```text
Active Device
        ↓
Read Resolution
        ↓
Automatic Crop
        ↓
Automatic Resize
        ↓
Native LVGL Asset
```

This will allow ForgeUI to support multiple display resolutions using the same import pipeline.

---

# Summary

ForgeUI now has a complete AI-assisted visual asset workflow from natural language through to native embedded hardware.

```text
Prompt
      ↓
AI Hero
      ↓
Automatic Device Preprocessing
      ↓
Native LVGL Asset
      ↓
Builder
      ↓
Browser Preview
      ↓
LVGL Export
      ↓
ESP-IDF
      ↓
Physical ESP32-P4
```

This milestone establishes **render parity** across the Builder Canvas, Browser Preview and physical ESP32-P4 hardware, providing a single, reliable visual pipeline for future ForgeUI development.
---------------------------------------------------------
# SPINE

## Current Save Point

```text
FORGEUI_AI_STUDIO_V2_3_0__AI_HERO_ASSET_PIPELINE__BUILDER_THEME_PREVIEW_UNIFIED__LVGL_READY__2026-07-13
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI HERO PIPELINE PROVEN

LVGL ASSET PIPELINE PROVEN
```

---

# Major Milestone

ForgeUI Studio now supports a complete AI Hero Background workflow integrated directly into the Studio.

The generated artwork is no longer a temporary preview.

AI artwork is now a reusable ForgeUI asset.

---

# Proven AI Hero Pipeline

```text
Natural Language Prompt
        ↓
OpenAI Image Generation
        ↓
Live Browser Preview
        ↓
Save To Asset Manager
        ↓
Automatic LVGL Conversion
        ↓
LVGL Ready Asset
        ↓
Theme Manager
        ↓
Builder Canvas
```

Status

```text
PROVEN
```

---

# Unified Theme Architecture

ForgeThemeContext now provides a single source of truth for:

```text
Theme Palette
Texture
Hero Background
```

Consumers

```text
Browser Preview
Builder Canvas
Theme Manager
```

All now use the same active Hero Background.

Status

```text
PROVEN
```

---

# Asset Pipeline

AI Generated Image

```text
Prompt
      ↓
OpenAI
      ↓
PNG Base64
      ↓
ForgeUI Uploaded Asset Registry
      ↓
Asset Manager
      ↓
Auto LVGL Converter
      ↓
Generated C Asset
      ↓
LVGL Ready
```

Status

```text
PROVEN
```

---

# Theme Manager

Theme Manager now supports:

```text
ForgeUI Theme Palettes

+

AI / Uploaded Background Library
```

Capabilities

```text
Select Hero Background
Live Browser Preview
Live Builder Canvas
Persistent Project Asset
```

Status

```text
PROVEN
```

---

# Builder Canvas

Builder now shares the same Hero Background rendering path as Browser Preview.

Rendering priority

```text
Hero Background
        ↓
Theme Texture
        ↓
Solid Theme Background
```

Status

```text
PROVEN
```

---

# Current AI Capabilities

## Layout AI

```text
Prompt
      ↓
GPT
      ↓
ForgeUI Layout JSON
      ↓
Validation
      ↓
Canvas
      ↓
Browser Preview
      ↓
LVGL Export
      ↓
ESP32-P4
```

Status

```text
PROVEN
```

---

## Theme AI

```text
Prompt
      ↓
OpenAI Image Generation
      ↓
Hero Background
      ↓
Asset Manager
      ↓
Automatic LVGL Conversion
      ↓
Theme Manager
      ↓
Builder Canvas
      ↓
Browser Preview
```

Status

```text
PROVEN
```

---

# Current Architecture

```text
Prompt
      │
      ├──────────────┐
      │              │
      ▼              ▼
 Layout AI      Theme AI
      │              │
      ▼              ▼
 Layout JSON     Hero Image
      │              │
      ▼              ▼
 Canvas      Uploaded Assets
      │              │
      └──────┬───────┘
             ▼
      Builder Canvas
             ▼
      Browser Preview
             ▼
      LVGL Export
             ▼
      ESP32-P4
```

---

# Next Milestone

## AI Project Generation

Goal

```text
Describe Application
        ↓
Generate Theme
        ↓
Generate Hero
        ↓
Generate Layout
        ↓
Generate Assets
        ↓
Populate Builder
        ↓
LVGL Export
        ↓
Flash ESP32-P4
```

---

# Future Vision

```text
One Prompt

↓

Complete Embedded HMI

↓

Editable Inside ForgeUI

↓

One Click Export

↓

ESP32-P4 Hardware
```

This completes the transition from an AI-assisted editor to an AI-native embedded HMI development environment.

----------------------------------------------------------------------

# SPINE

# Current Save Point

```text
FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI LAYOUT PIPELINE PROVEN

AI HERO BACKGROUND PIPELINE PROVEN

AI STUDIO V2.2 PROVEN
```

---

# ForgeUI Overview

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted interface generator, asset pipeline, theme system, code generator and ESP-IDF workflow targeting ESP32-P4 hardware.

The platform now supports AI-generated layouts and AI-generated HMI hero backgrounds.

---

# Core ForgeUI Pipeline

```text
Visual Builder
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
Generated C
        │
        ▼
Standalone ESP-IDF Project
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# AI Layout Pipeline

```text
Natural Language Prompt
        │
        ▼
GPT-5
        │
        ▼
ForgeUI Layout Document
        │
        ▼
JSON Validation
        │
        ▼
Component Validation
        │
        ▼
Canvas
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

Status

```text
FULLY PROVEN
```

---

# AI Hero Background Pipeline

NEW

```text
Natural Language Prompt
        │
        ▼
GPT Image
        │
        ▼
Hero Background API
        │
        ▼
Base64 Image
        │
        ▼
ForgeThemeContext
        │
        ▼
Browser Preview
```

Status

```text
FULLY PROVEN
```

---

# AI Studio V2

ForgeUI now contains a dedicated AI workspace.

```text
ForgeUI AI Studio

Layout
Theme
Assets
Images
Icons
Runtime
```

Current Status

```text
LAYOUT ENGINE PROVEN

HERO BACKGROUND ENGINE PROVEN

MODULAR AI ARCHITECTURE PROVEN
```

---

# AI Engine Architecture

```text
ForgeAIPanel
        │
        ▼
ForgeAIEngine
        │
        ├──────────────┐
        │              │
        ▼              ▼
Layout Engine     Hero Engine
        │              │
        └──────┬───────┘
               ▼
        ForgeAIClient
               │
               ▼
     OpenAI APIs
               │
               ▼
 Layout Documents / Images
               │
               ▼
      Validation & Parsing
               │
               ▼
            ForgeUI
```

Status

```text
MODULAR

PROVEN

EXTENSIBLE
```

---

# Hero Background Engine

Completed

```text
✓ Theme Workspace

✓ Hero Prompt Editor

✓ OpenAI Image Generation

✓ Hero API

✓ Base64 Image Pipeline

✓ ForgeThemeContext Integration

✓ Live Browser Preview

✓ Runtime Theme Switching
```

Status

```text
PROVEN
```

---

# Theme System

```text
FG_PREVIEW_PALETTES
        │
        ▼
ForgeThemeContext
        │
        ├──────────────┐
        │              │
Preset Theme    AI Hero Background
        │              │
        └──────┬───────┘
               ▼
         Browser Preview
```

Status

```text
LIVE
```

---

# Browser Preview

Browser Preview now supports

```text
Preset Theme

or

AI Generated Hero Background
```

AI Hero Backgrounds automatically override preset textures.

Status

```text
PROVEN
```

---

# New API Endpoints

```text
/api/forgeui-ai-layout

/api/forgeui-ai-hero
```

Both endpoints operational.

---

# Proven AI Features

## Layout AI

```text
Natural Language
✓

GPT Generation
✓

ForgeUI JSON
✓

Validation
✓

Canvas
✓

Browser Preview
✓

LVGL Export
✓

ESP-IDF
✓

Physical Hardware
✓
```

---

## Hero AI

```text
Natural Language
✓

OpenAI Image
✓

Hero Generation
✓

Theme Context
✓

Live Preview
✓
```

---

# Current Architecture

```text
Manual Builder
        │
        ├─────────────┐
        │             │
        ▼             ▼
Visual UI      AI Layout Generation
        │             │
        ├─────────────┤
        ▼             ▼
 AI Hero Generation
        │
        ▼
 Browser Preview
        │
        ▼
 LVGL Export
        │
        ▼
 ESP-IDF
        │
        ▼
 ESP32-P4
```

---

# Current Limitation

AI Hero Backgrounds currently exist as live preview assets only.

Not yet integrated into

```text
Asset Manager

Builder Background

LVGL Export

Standalone Export

ESP32-P4 Project Assets
```

---

# Next Milestone

## AI Hero Asset Pipeline

```text
Generate Hero
        │
        ▼
Preview
        │
        ▼
Save To Asset Manager
        │
        ▼
Builder Background
        │
        ▼
LVGL Export
        │
        ▼
Standalone Export
        │
        ▼
ESP32-P4
```

Goal

```text
AI Hero Backgrounds become permanent ForgeUI assets.
```

---

# Long-Term AI Vision

```text
Prompt
        │
        ▼
Hero Background AI
        │
        ▼
Layout AI
        │
        ▼
Theme AI
        │
        ▼
Asset AI
        │
        ▼
Icon AI
        │
        ▼
Complete ForgeUI Project
```

---

# Save History

```text
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13
```

---

# Summary

ForgeUI has now proven **two independent AI pipelines**.

```text
Natural Language
        │
        ├──────────────┐
        ▼              ▼
 Layout AI      Hero Background AI
        │              │
        └──────┬───────┘
               ▼
          Browser Preview
               ▼
           LVGL Export
               ▼
            ESP-IDF
               ▼
        Physical ESP32-P4
```

ForgeUI has now evolved beyond an AI-assisted layout designer into an AI-assisted embedded HMI design platform capable of generating both interface layouts and professional hero artwork directly from natural language prompts.


----------------------------------------------------------------------------------------

# SPINE

# Current Save Point

```text
FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12
```

---

# Project Status

```text
ACTIVE

STABLE

PHYSICAL HARDWARE PROVEN

AI LAYOUT PIPELINE PROVEN

AI STUDIO V2 PROVEN
```

---

# ForgeUI Overview

ForgeUI Studio is an open-source visual LVGL v9 HMI designer, AI-assisted interface generator, asset pipeline, theme system, code generator, and ESP-IDF workflow targeting ESP32-P4 hardware.

The platform now supports end-to-end AI-assisted interface generation from natural language through to physical embedded hardware.

---

# Core ForgeUI Pipeline

```text
Visual Builder
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
Generated C
        │
        ▼
Standalone ESP-IDF Project
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
```

Status:

```text
PROVEN
```

---

# AI Layout Pipeline

```text
Natural Language Prompt
        │
        ▼
GPT-5
        │
        ▼
ForgeUI Layout Document
        │
        ▼
JSON Validation
        │
        ▼
Component Validation
        │
        ▼
Canvas
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
Generated C
        │
        ▼
ESP-IDF Build
        │
        ▼
Physical ESP32-P4
```

Status:

```text
FULLY PROVEN
```

---

# AI Studio V2

ForgeUI now contains a dedicated AI workspace.

```text
ForgeUI AI Studio

Layout
Theme
Assets
Images
Icons
Runtime
```

Current Status

```text
LAYOUT ENGINE PROVEN

THEME ENGINE FOUNDATION COMPLETE

MODULAR AI ARCHITECTURE PROVEN
```

---

# AI Engine Architecture

```text
ForgeAIPanel
        │
        ▼
ForgeAIEngine
        │
        ├──────────────┐
        │              │
        ▼              ▼
Layout Engine     Theme Engine
        │              │
        └──────┬───────┘
               ▼
        ForgeAIClient
               │
               ▼
     OpenAI Responses API
               │
               ▼
      Structured Documents
               │
               ▼
      Validation & Parsing
               │
               ▼
            ForgeUI
```

Status

```text
MODULAR

PROVEN

EXTENSIBLE
```

---

# Proven AI Layout Workflow

```text
Describe Screen
        │
        ▼
Generate Layout
        │
        ▼
Validated ForgeUI Document
        │
        ▼
Review
        │
        ▼
Insert Into Canvas
        │
        ▼
Builder
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# AI Studio V2 Workspace

Proven

- Modern AI Workspace
- GPT Prompt Editor
- Live OpenAI Integration
- Template Library
- Structured ForgeUI Documents
- JSON Validation
- Component Validation
- Canvas Insertion
- Browser Preview
- LVGL Export
- ESP-IDF Build
- Physical ESP32-P4 Deployment

Status

```text
PROVEN
```

---

# Theme System

Single source of truth

```text
FG_PREVIEW_PALETTES
        │
        ▼
ForgeThemeContext
        │
        ├─────────────┐
        │             │
Preset Theme   Custom AI Theme
        │             │
        └──────┬──────┘
               ▼
           Preview
               ▼
           Builder
               ▼
            Export
               ▼
         ESP32-P4
```

Completed

```text
✓ ForgePreviewPalette

✓ ForgeThemeContext

✓ Custom Palette Support

✓ Theme Document

✓ Theme Parser

✓ Theme Prompt Builder

✓ Theme Engine

✓ Shared AI Client
```

Current Status

```text
BACKEND COMPLETE

UI INTEGRATION NEXT
```

---

# Current Architecture

```text
Manual Design
        │
        ├──────────────┐
        │              │
        ▼              ▼
Visual Editor    AI Layout Generation
        │              │
        └──────┬───────┘
               ▼
        ForgeUI Document
               ▼
          Validation
               ▼
            Canvas
               ▼
      Browser Preview
               ▼
        LVGL Export
               ▼
        Generated C
               ▼
       ESP-IDF Build
               ▼
       Physical ESP32-P4
```

Status

```text
PROVEN
```

---

# Proven Features

## Visual Builder

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

## AI Layout Generation

```text
Natural Language
✓

GPT Generation
✓

ForgeUI JSON
✓

Validation
✓

Canvas
✓

Preview
✓

LVGL Export
✓

ESP-IDF
✓

Physical Hardware
✓
```

---

## Theme System

```text
Preset Themes
✓

Live Theme Switching
✓

Shared Theme Context
✓

AI Theme Foundation
✓
```

---

## Asset Pipeline

```text
Uploaded Assets
✓

React Icons
✓

Unified Image Pipeline
✓

LVGLImage.py
✓

Generated C Assets
✓

ESP32-P4
✓
```

---

## Runtime Widgets

```text
RTC
✓

WiFi
✓
```

Ownership Rule

```text
Runtime owns truth.

Widget owns display.

LVGL timer owns refresh.
```

---

# Current Mission

## AI Theme Engine

```text
Prompt
        │
        ▼
GPT
        │
        ▼
Validated Theme Document
        │
        ▼
setCustomPalette()
        │
        ▼
Entire Studio Repaints Live
```

Status

```text
NEXT
```

---

# Long-Term AI Vision

```text
Prompt
        │
        ▼
Layout AI
        │
        ▼
Theme AI
        │
        ▼
Image AI
        │
        ▼
Asset AI
        │
        ▼
Icon AI
        │
        ▼
Runtime Assistant
        │
        ▼
Complete ForgeUI Project
```

---

# Current Save History

```text
FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

↓

FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12
```

---

# Non-Negotiable Rules

- Preserve Builder.
- Preserve Preview.
- Preserve LVGL Export.
- Preserve Standalone Export.
- Preserve ESP-IDF compatibility.
- Preserve Physical Hardware parity.
- Do not duplicate asset pipelines.
- Do not duplicate theme systems.
- Do not duplicate runtime systems.
- AI must extend ForgeUI systems, never bypass them.
- All generated layouts must pass validation before insertion.
- Exported projects must remain completely standalone.

---

# Next Milestone

```text
ForgeUI AI Theme Engine

Prompt
        │
        ▼
GPT
        │
        ▼
Forge Theme Document
        │
        ▼
Theme Validation
        │
        ▼
setCustomPalette()
        │
        ▼
Entire Studio Repaints
        │
        ▼
Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP32-P4
```

---

# Summary

ForgeUI has now proven an end-to-end AI-assisted embedded UI workflow.

```text
Natural Language
        │
        ▼
GPT
        │
        ▼
Validated ForgeUI Layout
        │
        ▼
Visual Editing
        │
        ▼
Browser Preview
        │
        ▼
LVGL Export
        │
        ▼
ESP-IDF
        │
        ▼
Physical ESP32-P4
```

This milestone marks the transition of ForgeUI from a visual LVGL editor into an AI-assisted embedded interface design platform.

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining visual design, AI-powered generation, LVGL, and ESP-IDF into a single workflow.

ForgeUI is built in collaboration with ChatGPT, which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**