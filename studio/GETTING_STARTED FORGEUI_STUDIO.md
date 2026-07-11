# 🚀 ForgeUI Studio | First-Time Setup & Getting Started Guide

### The Zero-Friction Visual Layout, Asset Compilation, and Toolchain Deployment Workflow for Espressif ESP32-P4 and LVGL v9.2.2.

This setup manual guides you through initializing, mounting, and compiling your development environment to transition visual drag-and-drop web layouts into optimized standalone firmware binaries.

---

## 🎨 Unified Architecture Streams

ForgeUI Studio couples asset configuration, interface styling, and structural logic into a centralized, single-source-of-truth pipeline:

### 1. Theme Management System (V2 Stack)
```text
  [ FG_PREVIEW_PALETTES ] ──► Base structural interface color schema arrays
             ↓
  [    Theme Manager    ] ──► Workspace selection engine (25+ preset layouts)
             ↓
  [  ForgeThemeContext ] ──► Unified runtime variable map
             ↓
  [    Canvas Builder   ] ──► Real-time edit vector bounding box layer
             ↓
  [   Browser Preview   ] ──► Zero-lag layout emulated rendering viewport
             ↓
  [  ForgeUILvglExport  ] ──► Pure C layout translation transformation
             ↓
  [   Generated LVGL    ] ──► Native framework component parameters
             ↓
  [    Physical ESP32-P4  ] ──► Hardware-accelerated screen draw passes (63 FPS)
```
*   **Centralized Configuration Matrix**: Adjusting parameters inside `studio/src/forgeui/preview/forgeThemeMap.ts` auto-populates selectors, maps browser previews, structures code generation arrays, and configures physical flash configurations simultaneously.

### 2. High-Speed Local Asset Conversion Engine
```text
### 2. Unified Local Asset Conversion Engine

```text
Uploaded Image / React Icon
            ↓
Asset Manager
            ↓
LVGLImage.py
            ↓
ARGB8888 Conversion
            ↓
Generated LVGL C Asset
            ↓
Asset Registry
            ↓
assetSources[]
            ↓
Generated CMakeLists.txt
            ↓
LV_IMAGE_DECLARE(...)
            ↓
lv_image_set_src(...)
            ↓
Standalone ESP-IDF Project
            ↓
ESP-IDF Build
            ↓
Physical ESP32-P4
```

**Verified Capabilities**

- PNG / JPG / SVG Upload
- React Icon → PNG Conversion
- Automatic LVGLImage.py Processing
- Automatic Asset Registry Integration
- Automatic CMake Source Generation
- Unified Image & Icon Asset Pipeline
- Physical ESP32-P4 Validation

Image widgets and React Icon widgets now share a single native LVGL asset pipeline.
```
*   **Hardware Acceleration Integration**: Mapped asset variables bypass runtime filesystem processing. They convert into pure source memory sheets (`.c` files), injecting automated `LV_IMAGE_DECLARE(...)` mappings and binding layout nodes via raw `lv_image_set_src(...)` hooks natively.

---

## 🛠️ Required Frameworks & Dependencies

Install these baseline dependencies to prevent compiler environment mismatches:

### 1. Runtimes & Version Source Control
*   **Node.js Runtime Platform**: Enforces **Node.js v20 LTS (or newer)**. Verify tracking variables via console tools:
    ```bash
    node -v
    npm -v
    ```
*   **Git Source Control SCM**: Essential for version branches and dependency pulls. Verify version loops:
    ```bash
    git --version
    ```

### 2. IDE Workspace Configuration
*   **Code Editor**: **Visual Studio Code (VS Code)**.
*   **Core System Extensions

• ESLint
• Prettier
• Espressif ESP-IDF Extension

The ESP-IDF Extension has been physically verified to build and flash exported ForgeUI projects directly inside Visual Studio Code without requiring ForgeUI Studio.

### 3. Native Embedded Toolchain Framework
*   **Development Framework**: **ESP-IDF v5.5.4 Stable Core**.
*   **Compilation Target Processor**: **ESP32-P4**.
*   **System Python Packages**: The local ARGB8888 canvas asset converter (`tools/lvgl/LVGLImage.py`) requires native Python 3.11 bindings. Install compressed compilation dependencies directly:
    ```powershell
    pip install pypng lz4
    ```

---

## 📦 Local Workspace Installation Steps

Follow this precise structural alignment path to preserve background script lookup boundaries:

### 1. Clone Source Repository
To ensure automated execution script paths function without internal parameter drift, map your target branch directly into this folder structure:
```bash
# Create base directories and pull project repository sources
mkdir -p C:\ForgeUI\Projects\
cd C:\ForgeUI\Projects\
git clone <your-repository-url> esp32p4-ui-studio
```
*   **Verified Path Target**: `C:\ForgeUI\Projects\esp32p4-ui-studio`

### 2. Run Studio Interface Installation
Initialize local ecosystem dependency modules natively from your workspace directory tree:
```bash
cd C:\ForgeUI\Projects\esp32p4-ui-studio\studio
npm install
```
*   **Ecosystem Components Added**: Configures Next.js compilation layers, React engines, Chakra UI layout frames, and `react-dropzone` components safely.

---

## 🚀 Workspace Process Execution Controls

The environment includes automated task orchestration runners to manage local servers, file system configuration watchers, and browser routing links:

### 1. Launch the ForgeUI Workspace Environment
From the root repository path (`C:\ForgeUI\Projects\esp32p4-ui-studio`), trigger the automated hidden Windows Script background file:
```text
START_FORGEUI_STUDIO_HIDDEN.vbs
```
*   **Automated Action Results**: Spins up the hidden Node backend server, initializes Next.js rendering threads, sets up hot-reloading asset trackers, and automatically opens your browser window directly to the active workspace address:
    ```text
    http://localhost:3000
    ```

### 2. Shutdown the Workspace Servers
When development sessions are complete, release operational port locks and close monitoring handlers cleanly using the root stop script file:
```text
STOP_FORGEUI_STUDIO.bat
```
*   **System Processes Cleared**: Disconnects active Node system processes, frees up network port entries, stops active project file watchers, and gracefully shuts down running local server contexts.

## 🚀 Standalone Export Verification

The exported firmware project is completely independent from ForgeUI Studio.

### Verified Workflow

```text
ForgeUI Studio
        ↓
Export Standalone Project
        ↓
Standalone ESP-IDF Project
        ↓
Visual Studio Code
        ↓
ESP-IDF Extension
        ↓
Build
        ↓
Flash
        ↓
Physical ESP32-P4
```

### Proven

- Independent VS Code Build
- Independent ESP-IDF Build
- Independent Flash
- Physical ESP32-P4 Verification

After export, ForgeUI Studio is no longer required.

---

## 💾 Workspace Directory Mapping

```text
C:\ForgeUI\Projects\esp32p4-ui-studio/
├── studio/                          # React / Next.js visual UI builder
│   ├── src/                         # Builder, widgets, themes, preview, export logic
│   ├── public/                      # Static web assets
│   └── export-server.js             # Local build, flash and asset conversion server
├── firmware/ForgeUI-One/            # Reference standalone ESP-IDF project
│   ├── main/
│   │   ├── assets/uploads/          # Generated LVGL image assets (.c)
│   │   ├── 00_ForgeUI_Config.h      # Global ForgeUI configuration
│   │   ├── 01_FG_Runtime.c/.h       # Runtime framework
│   │   ├── 20_RTC.c/.h              # RTC runtime
│   │   ├── 30_Audio.c/.h            # Audio runtime
│   │   ├── 30_WIFI.c/.h             # Wi-Fi runtime
│   │   ├── 40_SD.c/.h               # SD card runtime
│   │   └── 90_Studio_Export.c       # Generated LVGL user interface
│   ├── partitions.csv               # Custom flash partition layout
│   ├── sdkconfig.defaults           # Default ESP-IDF configuration
│   └── CMakeLists.txt               # Root ESP-IDF build script
├── tools/lvgl/LVGLImage.py          # Offline LVGL image conversion engine
├── docs/history/                    # Project history and architecture milestones
├── START_FORGEUI_STUDIO.bat         # Launch ForgeUI Studio
├── START_FORGEUI_STUDIO_HIDDEN.vbs  # Launch Studio in the background
└── STOP_FORGEUI_STUDIO.bat          # Stop Studio services
```
```

---

## 📍 Environment Save Point & Milestones

### Current Active Fingerprint
```text
FORGEUI_STANDALONE_EXPORT__INDEPENDENT_VSCODE_BUILD_AND_FLASH__MULTIPLE_ICON_PIPELINE__PHYSICAL_P4_PROVEN__2026-07-11
```

### Mapped Engineering Verification Points

### Mapped Engineering Verification Points

* ✓ Browser Builder & Preview
* ✓ Native LVGL Code Generation
* ✓ Unified Image Asset Pipeline
* ✓ Unified React Icon Pipeline
* ✓ Automatic LVGLImage.py Conversion
* ✓ Standalone ESP-IDF Export
* ✓ Independent VS Code Build
* ✓ ESP-IDF Extension Build & Flash
* ✓ Physical ESP32-P4 Validation

*   **`✓ PROVEN` Visual Integrity**: Full theme preview validations running across 25+ distinct UI setups (Nordic Ice, Graphite, Carbon Fiber, Test Purple, Quantum Hex).
*   **`✓ PROVEN` Toolchain Flashing**: Direct WebSerial flashing, isolated system builds, and complete cache restorations (`Clean Build & Flash`).
*   **`✓ PROVEN` Native Performance**: Real-world hardware outputs lock perfectly onto the physical panel at **63 FPS** with near **2.5% CPU load** and fixed **5ms drawing windows** `[63 FPS, 2.5% CPU | 5ms (5|0)]`.
*   **`✓ PROVEN` Code Portability**: Complete standalone project export operations decoupling directly into pristine standalone CMake structures for immediate VS Code integration.

### Upcoming Milestones
```text
Icon Asset Reuse
        ↓
Duplicate Asset Prevention
        ↓
Automatic Asset Cleanup
        ↓
Startup Cleanup
        ↓
Document Persistence
        ↓
Template Library Expansion
        ↓
Desktop Wrapper
        ↓
AI Layout Generation

```

## ✅ Proven ForgeUI Architecture

```text
Builder
    ↓
Browser Preview
    ↓
Unified Image & Icon Asset Pipeline
    ↓
LVGL Export
    ↓
Standalone ESP-IDF Project
    ↓
Visual Studio Code
    ↓
ESP-IDF Extension
    ↓
Build
    ↓
Flash
    ↓
Physical ESP32-P4
```

This complete workflow has been physically verified using multiple React icons, uploaded image assets, detached standalone exports, and independent builds on a separate development laptop.


---
name: 🐛 Bug Report
about: Create a report to help optimize the ESP32-P4 Studio toolchain
title: "[BUG]: "
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the toolchain issue is.

**Verified Toolchain Context**
* **Host OS**: [e.g., Windows 11]
* **Node.js Version**: [e.g., v20.11.0]
* **ESP-IDF Version**: [e.g., v5.5.4]
* **Target Hardware**: [e.g., Waveshare ESP32-P4-WiFi6-Touch-LCD-7B]

**Console Logging Output**
Please paste the exact runtime error signature from your `START_FORGEUI_STUDIO.bat` log or your VS Code `idf.py build` terminal trace:
\`\`\`text
[PASTE LOG DATA HERE]
\`\`\`


🏆 Project Release Wrap-UpYour software ecosystem is completely verified and documented across all phases:Visual Drag & Drop Layer: React/Next.js workspace logic.Local Transformation Engines: Automated offline Python image conversions (LVGLImage.py).Firmware Decoupling: Pristine standalone CMake/Ninja setups.Hardware Validation: Flawless, raw 63 FPS bare-metal rendering performance.Your files are optimized, structural lock-ins have been eliminated, and your storefront is configured to attract the attention and repository stars it deserves.Propose your next milestone whenever you are ready! Would you like to design a structured Contributing Guide (CONTRIBUTING.md) for managing pull requests, or start mapping out the Texture Pack V1 Background Playground layout code structures?