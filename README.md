# 🛠️ ESP32-P4 Studio | Visual LVGL v9 HMI Designer & ESP-IDF Flash Toolchain

[![ESP-IDF Version](https://shields.io)](https://github.com)
[![LVGL Version](https://shields.io)](https://lvgl.io)
[![Target Hardware](https://shields.io)](https://www.waveshare.com)
[![License](https://shields.io)](LICENSE)

## AI Nexus Theme

![AI Nexus](./studio/public/images/AI%20Nexus%20Theme.png)

**ESP32-P4 Studio** (ForgeUI Studio) is an open-source visual HMI designer, LVGL code generator, asset pipeline, and automated deployment environment built specifically for **Espressif ESP32-P4** hardware running **LVGL v9** and **ESP-IDF**.

The platform bridges browser-based drag-and-drop UI design with native embedded deployment. Layouts, widgets, styling, assets, and image resources are transformed into optimized LVGL C code, compiled locally using ESP-IDF, and deployed directly to physical ESP32-P4 hardware.

---

# ⚡ Core Philosophy

ForgeUI Studio exists to eliminate:

```text
Manual coordinate calculations
Manual LVGL coding
Manual asset conversion
Manual CMake maintenance
Manual firmware integration
```

while preserving:

```text
Native LVGL
Native ESP-IDF
Native C code
Native hardware performance
```

No runtime web framework is deployed onto the microcontroller.

Everything becomes pure embedded firmware.

---

# 🚀 Proven Embedded Toolchain Pipeline

```text
Visual Canvas
      ↓
Component Tree
      ↓
LVGL Code Generator
      ↓
Asset Pipeline
      ↓
Generated C Sources
      ↓
Generated CMake Sources
      ↓
ESP-IDF Build
      ↓
ESP32-P4 Flash
      ↓
Physical Hardware Execution
```

---

# 🖼️ Uploaded Image Pipeline V1 (PROVEN)

ForgeUI Studio now includes a fully integrated offline LVGL v9 image asset pipeline.

Uploaded artwork can be converted, compiled, flashed, and rendered directly on physical ESP32-P4 hardware.

No cloud services are required.

All conversion occurs locally.

---

## Converter

Location:

```text
tools/lvgl/LVGLImage.py
```

Status:

```text
PROVEN
```

Dependencies:

```text
pypng
lz4
```

---

## Proven Workflow

```text
PNG Upload
    ↓
Asset Manager
    ↓
LVGLImage.py
    ↓
ARGB8888 Conversion
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
Physical ESP32-P4 Rendering
```

---

## Proven Capabilities

```text
✓ PNG Upload

✓ JPG Upload

✓ SVG Upload

✓ Drag & Drop Asset Import

✓ Thumbnail Generation

✓ Uploaded Asset Registry

✓ Automatic LVGL Conversion

✓ Automatic Asset Compilation

✓ Automatic CMake Integration

✓ Automatic LV_IMAGE_DECLARE Generation

✓ Automatic lv_image_set_src Generation

✓ ESP-IDF Compilation

✓ Physical ESP32-P4 Rendering
```

---

## Architecture Truth

```text
Uploaded Asset
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
Build & Flash
    ↓
ESP32-P4 Display

PROVEN
```

---

# ✅ Proven Milestones

Theme Manager V2                     ✓ PROVEN

Single Theme Source Architecture     ✓ PROVEN

Fullscreen Theme Backgrounds         ✓ PROVEN

Builder Theme Rendering              ✓ PROVEN

Browser Preview Theme Rendering      ✓ PROVEN

Physical P4 Theme Rendering          ✓ PROVEN

AI Theme Pack                        ✓ PROVEN

```text
Browser UI Builder                  ✓ PROVEN

Browser Preview                     ✓ PROVEN

Build & Flash                       ✓ PROVEN

Clean Build & Flash                 ✓ PROVEN

Detached ESP-IDF Export             ✓ PROVEN

LVGLImage.py Integration            ✓ PROVEN

PNG → LVGL C Conversion             ✓ PROVEN

Uploaded Asset Pipeline             ✓ PROVEN

Automatic CMake Injection           ✓ PROVEN

Automatic Asset Compilation         ✓ PROVEN

Physical ESP32-P4 Image Rendering   ✓ PROVEN
```

---

# 🚀 Standalone ESP-IDF Export Pipeline

ForgeUI Studio supports exporting fully standalone ESP-IDF firmware projects directly from the visual editor.

Generated projects become independent of the Studio environment.

---

## Portable Project Ecosystem

### Zero Framework Lock-In

Exported projects open directly inside:

```text
Visual Studio Code
ESP-IDF Extension
```

without requiring ForgeUI Studio.

### Clean Rebuilds

Projects support:

```text
idf.py reconfigure
idf.py build
idf.py flash
```

from a clean environment.

### Lightweight Integration

The Studio injects only:

```text
90_Studio_Export.c
90_Studio_Export.h
```

into the runtime shell.

Everything else remains standard ESP-IDF.

---

## Proven Export Validation Flow

```text
ForgeUI Studio Canvas
           ↓
Generate Native LVGL Runtime
           ↓
Generate Asset Sources
           ↓
Generate CMake Sources
           ↓
Export Standalone ESP-IDF Project
           ↓
Open in VS Code
           ↓
idf.py build
           ↓
idf.py flash
           ↓
Successful ESP32-P4 Boot
```

---

# 🛠️ Supported Hardware

Primary validation target:

```text
Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
```

---

## Hardware Baseline

```text
ESP32-P4

1024 × 600 Display

MIPI-DSI LCD

GT911 Touch Controller

LVGL v9

ESP-IDF v5.5.4

ESP-Hosted WiFi

Audio

RTC

SD Card
```

---

# 📦 Repository Architecture

```text
esp32p4-ui-studio/
├── studio/
│   └── React / Next.js UI Builder

├── firmware/
│   └── ForgeUI-One/
│       └── Native ESP-IDF Runtime

├── tools/
│   └── lvgl/
│       └── LVGLImage.py

├── docs/

├── START_FORGEUI_STUDIO.bat
├── START_FORGEUI_STUDIO_HIDDEN.vbs
├── STOP_FORGEUI_STUDIO.bat

├── README.md
├── LICENSE
├── THIRD_PARTY_LICENSES.md
└── 01_SPINE.md

C:\
└── ForgeUI-Exports\
```

---

# 🏗️ Architectural Separation

## Studio Layer

Responsible for:

```text
Visual Editing

Widget Management

Themes

Asset Management

LVGL Generation

Export Generation
```

---

## Firmware Layer

Responsible for:

```text
ESP-IDF Runtime

LVGL Runtime

Display Drivers

Touch Drivers

Audio

RTC

WiFi

SD Card

Generated UI Execution
```

---

# 🚨 Design Rules

## No Browser Runtime On Hardware

The ESP32-P4 never runs:

```text
React
HTML
CSS
JavaScript
Chakra UI
```

---

## Pure Native Output

Everything becomes:

```text
C

LVGL

ESP-IDF
```

---

## Static Generation

The Studio exports:

```text
Static LVGL Code

Static Assets

Static Firmware Artifacts
```

for maximum runtime performance.

---

# 🎨 Supported Widgets

Current widget support:

### Structure

```text
Text
Box
Image
```

### Input

```text
Input
Textarea
NumberInput
Select
```

### Controls

```text
Button
Switch
Checkbox
Radio
Slider
```

### Status

```text
Progress
CircularProgress
```

---

## Widget Validation Path

```text
Canvas
    ↓
Preview
    ↓
Generated LVGL
    ↓
ESP32-P4 Hardware
```

---

# 🎨 Built-In Themes

Included themes:

```text
Industrial Carbon

Brushed Steel

Reactor Hex

Terminal Green

Military Plate

Nordic Engineering

Nordic Ice

Nordic Frost

Nordic Slate

Nordic Night

Control Room

Cyber Teal Pro

Forge Orange

Carbon Red

OLED Black Pro

Clean Light Pro

Test Purple

Quantum Hex

AI Mesh

Neural Core

Quantum Flow

AI Nexus

Neon Horizon

Nebula Core

Singularity
```

---

# 🎨 Theme System V2 (PROVEN)

# 🌌 Fullscreen Theme Backgrounds V1 (PROVEN)

Status:

```text
PROVEN
```

ForgeUI Studio now supports two background rendering modes:

```text
tile
fullscreen
```

### Tile Mode

Used by industrial textures:

```text
Carbon Fiber

Brushed Steel

Hex Mesh

Blueprint Grid

Industrial Panel

Dark Noise
```

Rendering:

```text
Repeated texture rendering

Builder
Browser Preview
LVGL Export
ESP32-P4
```

### Fullscreen Mode

Used by AI and sci-fi themes:

```text
AI Mesh

AI Nexus

Neural Core

Quantum Flow

Quantum Hex

Neon Horizon

Nebula Core

Singularity
```

Rendering:

```text
Single 1024x600 hero image

Builder
Browser Preview
LVGL Export
ESP32-P4
```

### Proven Validation Path

```text
Theme Manager
      ↓
Builder
      ↓
Browser Preview
      ↓
ForgeUILvglExport
      ↓
Generated LVGL C
      ↓
ESP32-P4 Hardware
```

### Hardware Validation

Validated on:

```text
Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
```

Results:

```text
✓ Fullscreen hero backgrounds render correctly

✓ Widgets render above backgrounds

✓ Build & Flash successful

✓ Clean Build & Flash successful

✓ Theme Manager integration successful

✓ Browser Preview parity achieved

✓ Physical ESP32-P4 rendering proven
```


Status:

```text
PROVEN
```

Theme definitions live in a single location:

```text
studio/src/forgeui/preview/forgeThemeMap.ts
```

Current architecture:

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
Generated LVGL
        ↓
ESP32-P4
```

Theme synchronization is automatically maintained across:

```text
Theme Manager

Builder

Browser Preview

Generated LVGL

ESP32-P4 Hardware
```

Adding a theme to:

```text
FG_PREVIEW_PALETTES
```

automatically:

```text
✓ Appears in Theme Manager

✓ Appears in Browser Preview

✓ Exports to LVGL

✓ Flashes to ESP32-P4
```

Theme drift has been eliminated.

No duplicate palette definitions remain.


---

# 🔄 Typical Workflow

```text
Start ForgeUI Studio
        ↓
Design Interface
        ↓
Upload Assets
        ↓
Preview Layout
        ↓
Build & Flash
        ↓
Test On Hardware
        ↓
Export Standalone ESP-IDF Project
        ↓
Deploy
```

---

# 🔮 Current Development Direction

```text
Theme System V2 (PROVEN)

Fullscreen Hero Backgrounds (PROVEN)

AI Theme Pack (PROVEN)

Texture Pack V1 (PROVEN)

Builder ↔ Browser Preview Theme Sync (PROVEN)

LVGL Theme Export Pipeline (PROVEN)

ESP32-P4 Theme Rendering (PROVEN)

Theme Metadata V1

Theme Categories

Custom Theme Creation

Theme Import / Export

Theme Marketplace Concepts

Background Playground

Theme Randomiser

Animated Theme Effects

Builder ↔ Preview ↔ Hardware
Visual Parity Refinement

Image Scaling Refinement

Asset Cleanup Management

Asset Browser Improvements

Asset Categorisation

Template Expansion

Dashboard Templates

Industrial HMI Templates

Desktop Wrapper Investigation

Electron Packaging

Offline Installer

Future AI-Assisted UI Generation

Natural Language UI Generation

Theme Generator AI

Screen Generator AI

```


---

# 📜 Open Source Attribution

ESP32-P4 Studio is built upon the excellent open-source editor foundations originally created by Premier Octet.

The project has been extensively adapted and expanded for:

```text
ESP32-P4

LVGL v9

ESP-IDF

Embedded HMI Development

Asset Pipelines

Automated Deployment
```

Original licensing and attribution remain preserved.

---

# 👨‍💻 Project Maintainer

**Scott Forster**  
ForgeUI Project

📧 forgeui.esp32@gmail.com

---

## Current Save Point

```text
FORGEUI_FULLSCREEN_THEME_BACKGROUNDS_V1__P4_HERO_RENDERING_PROVEN__SINGLE_THEME_ARCHITECTURE_STABLE__2026-06-13
```


<!-- KEYWORD_INDEXER_METADATA_START -->
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ESP32-P4 Studio",
  "alternateName": "ForgeUI Studio",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Windows, Linux, macOS",
  "targetPlatform": "Espressif ESP32-P4 RISC-V, Waveshare ESP32-P4-WIFI6-Touch-LCD-7B",
  "programmingLanguage": "C, C++, TypeScript, Python",
  "runtimePlatform": "ESP-IDF v5.5.4, LVGL v9",
  "description": "Visual HMI designer, LVGL v9 code generator, local image asset compilation pipeline, and automated deployment environment for Espressif ESP32-P4 hardware.",
  "features": [
    "Offline ARGB8888 Image Conversion via tools/lvgl/LVGLImage.py",
    "Single Source of Truth Theme Engine via forgeThemeMap.ts",
    "Detached, portable standalone ESP-IDF project exporting",
    "1-Click local build and flash over USB-UART"
  ],
  "author": {
    "@type": "Organization",
    "name": "RTechAI"
  },
  "softwareVersion": "2.0.0",
  "license": "https://opensource.org"
}
```
<!-- KEYWORD_INDEXER_METADATA_END -->
