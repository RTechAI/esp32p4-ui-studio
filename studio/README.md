# 🛠️ ESP32-P4 Studio | Visual LVGL v9 HMI Designer & ESP-IDF Flash Toolchain

[![ESP-IDF Version](https://shields.io)](https://github.com)
[![LVGL Version](https://shields.io)](https://lvgl.io)
[![Target Hardware](https://shields.io)](https://www.waveshare.com)
[![License](https://shields.io)](LICENSE)

**ESP32-P4 Studio** (ForgeUI Studio) is an open-source, low-code visual HMI designer and automated deployment toolchain built specifically for **Espressif ESP32-P4** microcontrollers running **LVGL v9** and **ESP-IDF**.

This platform bridges web-based drag-and-drop UI prototyping with low-level embedded hardware deployment. It transforms absolute visual layouts directly into optimized native C code, automates the local ESP-IDF compilation pipeline, and flashes production-ready firmware to your touch screen development board in a single click.

---

## ⚡ Key Features & Embedded Toolchain Pipeline

Eliminate manual UI coordinate positioning and slow compilation loops. ESP32-P4 Studio automates the entire embedded graphics workflow locally:

```text
  [ Drag-and-Drop Visual Studio Layout Canvas ]
                       │
                       ▼
  [ React Transpiler Parses UI State JSON Tree ]
                       │
                       ▼
  [ Emits Pure Static: 90_Studio_Export.c / .h ]
                       │
                       ▼
  [ Injects Files Automatically into Runtime Shell ]
                       │
                       ▼
  [ Local Compiler Script Triggers Unified Binary Build ]
                       │
                       ▼
  [ Native 60 FPS Interface Boots Natively on Screen ]
```

* **Direct Hardware Flashing:** Flash compiled UI binaries straight to the ESP32 chip using built-in scripting utilities over Web Serial / USB-UART.
* **WYSIWYG HMI Creator:** Visual canvas configured for high-performance industrial layouts and responsive tactile testing.
* **Shared Theme Engine:** Synchronized color profiles across the browser design workspace, interactive previews, and physical LCD panels.

---

## 🚀 Standalone ESP-IDF Export Pipeline V1

ForgeUI Studio supports exporting **fully standalone, decoupled ESP-IDF firmware projects** directly from the visual editor environment. Your generated graphics layout becomes completely independent of the studio framework.

### 📦 Portable Project Ecosystem
* **Zero Framework Lock-in:** Open exported project bundles directly inside **Visual Studio Code (VS Code)** with the official ESP-IDF extension.
* **Clean Rebuilds:** Code artifacts compile completely independently from the original studio engine from a pristine state.
* **Lightweight Firmware Footprint:** The studio generation pipeline injects only two pure C files (`90_Studio_Export.c` and `90_Studio_Export.h`) into the underlying runtime shell, ensuring absolute lifecycle stability.

### 🔄 Proven Export Validation Flow

```text
  [ ForgeUI Studio Canvas ]
             │
             ▼
  [ Generate Native LVGL Runtime ]
             │
             ▼
  [ Export Standalone ESP-IDF Project ] ──> (Shareable/Portable Folder Structure)
             │
             ▼
  [ Open Independently in VS Code ]
             │
             ▼
  [ Run: idf.py reconfigure & build ]
             │
             ▼
  [ Flash Over USB Native Toolchain ]
             │
             ▼
  [ Successful Bare-Metal Boot on ESP32-P4 ]
```

### Export Architecture Separation
ForgeUI Studio intentionally separates visual editor logic, browser preview rendering, and export orchestration from low-level layer constraints including: **BSP ownership, LVGL runtime lifecycle, ESP-IDF infrastructure,** and **display/touch/audio runtime systems.**

---

## 🛠️ Supported Hardware Targets & Tech Stack

The workspace environment is pre-tuned out-of-the-box for high-resolution graphics and intensive touch interface processing:

* **Primary Hardware Target:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B (High-performance RISC-V SoC).
* **Display Configuration:** 1024x600 fixed pixel resolution viewport bounds clamping.
* **Embedded Graphics Library:** LVGL v9 Core Component Framework.
* **Backend Framework:** Espressif ESP-IDF v5.5.4 Dev Environment.
* **Validated Export Baseline:** ESP-IDF v5.5.4 / UART flashing / standalone exported rebuilds fully verified.

---

## 📦 Project Architecture & Directory Structure

The repository is built as a self-contained monorepo separating the web workspace from the native firmware application shell:

```text
esp32p4-ui-studio/
├── studio/                             # Frontend UI Builder Canvas & LVGL Code Generator (React / Next.js)
├── firmware/
│   └── ForgeUI-One/                    # Native ESP-IDF Runtime, BSP, Display/Touch Drivers, & LVGL Runtime Shell
├── exports/                            # Generated Standalone ESP-IDF Firmware Export Projects
├── tools/                              # Automated ESP-IDF Compilation, Build, Flashing, & Utility Scripts
├── docs/                               # Project Documentation, Architecture Notes, and Historical Save Records
├── START_FORGEUI_STUDIO.bat            # Windows Foreground Runtime Launcher
├── START_FORGEUI_STUDIO_HIDDEN.vbs     # Hidden Background Developer Startup Script
├── STOP_FORGEUI_STUDIO.bat             # Graceful Development Environment Shutdown Utility
├── README.md                           # Repository Documentation & SEO Landing Page
├── LICENSE                             # Primary Open-Source License
├── THIRD_PARTY_LICENSES.md             # Upstream Attribution & Dependency Licensing
└── 01_SPINE.md                         # Core Architecture Spine & System Truth Document
```

### Architectural Separation of Concerns
1. **The Studio App (`/studio`)**: Manages absolute X/Y coordinates, custom component state, layout nesting, and automated asset generation exports.
2. **The Firmware Layer (`/firmware`)**: Runs bare-metal C configurations, hardware peripheral drivers, display/touch screen controllers, and integrates output files as isolated build artifacts.

---

## 🚨 Architectural Constraints & Design Rules

To ensure performance stability on resource-constrained microcontrollers, the project enforces strict structural separation:
* **No Web Runtimes on Chip:** HTML/CSS, React, or browser wrappers do not run on the ESP32-P4 processor.
* **Pure Static Output:** The React editor compiles layouts down to pure, hardware-native static LVGL C artifacts (`.c` / `.h`).
* **Zero Component Coupling:** Frontend React components (Chakra UI) remain completely isolated from the static code exporter scripts.

---

## 🎨 Supported LVGL Widgets & Theme Packs

### Preview-to-Hardware Widget Parity Matrix
The following UI controls map directly from the **Design Workspace ➔ Browser Preview ➔ Transpiled C Code ➔ Live ESP32-P4 LCD Screen**:

* **Basic Controls:** Text, Button, Box, Image (Placeholder)
* **Input Elements:** Input fields, Textarea blocks, NumberInput fields, Select drop-downs
* **Toggles & Selectors:** Switch, Checkbox, Radio buttons, Sliders
* **Status Monitors:** Progress Bars, Circular Progress loops

### Built-in Color Themes
The project includes 15 ready-to-use aesthetic UI palettes sharing common tokens (`bg`, `surface`, `border`, `text`, `accent`):
* *Matrix Green (Default)*, Reactor Dark, Graphite, Nordic Blue, Military Green, Cyber Teal, Forge Orange, Nebula Purple, OLED Black, Carbon Red, Arctic Ice, Industrial Steel, Lava Core, Blueprint, and Toxic Lime.

---

## 🔄 Live Developer Workflow Guide

Follow these steps to build and flash a user interface to your ESP32-P4 controller:

1. **Initialize the Local Server:** Run the background utility script from your root directory:
   ```bash
   START_FORGEUI_STUDIO_HIDDEN.vbs
   ```
2. **Access the Interface:** Open `http://localhost:3000` in your web browser.
3. **Design Your HMI:** Drag, drop, scale, and position your interactive layout components inside the 1024x600 layout grid.
4. **Compile & Deploy UI:** Click **Build & Flash** or **Clean Build & Flash** in the top navigation panel.
5. **Hardware Execution:** The local Node.js export bridge exports `90_Studio_Export.c` / `.h` assets, invokes the ESP-IDF backend compiler, and uploads the firmware binary directly over your USB-C interface.

---

## ⚠️ Limitations & Project Roadmap

### Ongoing Developments
* **Cross-Platform Scripts:** Current automation paths (`.bat` / `.vbs`) are built for Windows; Linux and macOS support profiles are in progress.
* **Font & Styling Normalization:** Upgrading deep styling parameters, custom corner radiuses, and explicit HEX color overrides.
* **Telemetry Interfaces:** Integrating real-time hardware status logs and connection monitors directly into the web layout inspector toolbar.

---

## 📜 Open Source Attribution & Licensing

**ESP32-P4 Studio** is an advanced, hardware-adapted fork of the open-source editor engine originally developed by *Premier Octet*. This project refactors and extends that platform specifically for embedded systems development, coordinate screen mapping, and automated Espressif flashing toolchains.

The original MIT open-source license and author attributions are fully preserved in this repository. See `LICENSE` and `THIRD_PARTY_LICENSES.md` for complete text records.

---
**Core Platform Architect:** Scott Forster | ForgeUI Project  
**Source Repository Infrastructure:** [GitHub Portal](https://github.com)
