# 🚀 ForgeUI Studio | First-Time Setup & Getting Started Guide

### The Zero-Friction Visual Layout, Asset Compilation, and Toolchain Deployment Workflow for Espressif ESP32-P4 and LVGL v9.2.2.

# 🚀 Quick Start

Get ForgeUI Studio running in just a few minutes.

---

## 1. Clone the Repository

```bash
git clone <your-repository-url> esp32p4-ui-studio
cd esp32p4-ui-studio
```

---

## 2. Run the First-Time Setup

Launch:

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

The setup utility will automatically:

- ✓ Verify Node.js
- ✓ Verify npm
- ✓ Install `node_modules` (if required)
- ✓ Locate a compatible Python 3.11 installation
- ✓ Install Pillow
- ✓ Install pypng
- ✓ Install lz4
- ✓ Verify `LVGLImage.py`
- ✓ Verify the ESP-IDF installation
- ✓ Verify the OpenAI package
- ✓ Check OpenAI API configuration
- ✓ Verify the standalone export environment
- ✓ Optionally launch ForgeUI Studio

If anything is missing, ForgeUI provides guided repair instructions wherever possible.

---

## 3. Start ForgeUI Studio

Launch:

```text
START_FORGEUI_STUDIO_HIDDEN.vbs
```

ForgeUI Studio will start the local development services and automatically open:

```text
http://localhost:3000
```

---

## 4. Design, Export and Continue Development

The complete ForgeUI workflow is:

```text
ForgeUI Studio
        ↓
Visual Layout Design
        ↓
Browser Preview
        ↓
AI Layout Generation (Optional)
        ↓
LVGL Export
        ↓
Standalone ESP-IDF Project
        ↓
Visual Studio Code
        ↓
ESP-IDF Extension
        ↓
Add Custom I/O
Drivers
Application Logic
        ↓
Build
        ↓
Flash
        ↓
Physical ESP32-P4
```

ForgeUI generates a **fully standalone ESP-IDF project**. Once exported, development continues independently in Visual Studio Code using the ESP-IDF extension. You are free to add custom GPIO, I²C, SPI, UART, CAN, networking, sensors, drivers, and application logic without being locked into the ForgeUI Studio environment.

This guide walks through configuring your development environment and taking a visual drag-and-drop interface all the way through to a standalone, production-ready ESP32-P4 firmware project.
---

## 🎨 Unified ForgeUI Architecture

ForgeUI Studio is built around a single-source-of-truth architecture where visual design, themes, assets, AI generation, and code export all share the same project model.

Every stage of the workflow feeds directly into the next, eliminating duplicated configuration and ensuring browser previews accurately represent the generated firmware.

---

### 1. Theme Management System

```text
FG_PREVIEW_PALETTES
            ↓
Theme Manager
            ↓
ForgeThemeContext
            ↓
Canvas Builder
            ↓
Browser Preview
            ↓
LVGL Export
            ↓
Generated LVGL Code
            ↓
Standalone ESP-IDF Project
            ↓
Physical ESP32-P4
```

**Verified**

- Unified Theme System
- Live Browser Preview
- Automatic LVGL Code Generation
- Physical ESP32-P4 Validation

Changing a theme automatically updates:

- Theme selectors
- Browser preview
- Exported LVGL code
- Physical firmware output

---

### 2. Unified Image & Icon Asset Pipeline

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
- Unified Image & Icon Pipeline
- Physical ESP32-P4 Validation

Image widgets and React Icon widgets now share a single native LVGL asset pipeline.

---

### 3. AI Layout Generation Pipeline

```text
Natural Language Prompt
            ↓
OpenAI
            ↓
ForgeUI JSON Layout
            ↓
Schema Validation
            ↓
Component Registry
            ↓
Canvas Builder
            ↓
Browser Preview
            ↓
LVGL Export
            ↓
Standalone ESP-IDF Project
```

**Current Capabilities**

- AI Layout Generation
- JSON Schema Validation
- Supported Component Verification
- Direct Canvas Insertion
- Native LVGL Export

AI-generated layouts become first-class ForgeUI layouts and follow the same export pipeline as manually created interfaces.

---

### 4. Standalone Export Architecture

```text
ForgeUI Studio
            ↓
Visual UI Design
            ↓
Browser Preview
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

**Verified**

- Independent Project Export
- Independent VS Code Development
- Independent ESP-IDF Build
- Independent Flash
- Physical ESP32-P4 Validation

ForgeUI generates a complete standalone ESP-IDF project.

After export, developers are free to continue development outside ForgeUI Studio by adding custom GPIO, I²C, SPI, UART, CAN, networking, sensors, drivers, middleware, and application logic.

ForgeUI is a visual designer and code generator—not a locked development ecosystem.

---

### 5. First-Time Setup & Environment Validation

```text
Clone Repository
            ↓
FIRST_TIME_FORGEUI_SETUP.bat
            ↓
Verify Node.js
            ↓
Install node_modules
            ↓
Locate Python
            ↓
Install Pillow / pypng / lz4
            ↓
Verify LVGLImage.py
            ↓
Verify ESP-IDF
            ↓
Verify OpenAI
            ↓
Launch ForgeUI Studio
```

The integrated setup utility automatically prepares a new development environment, validates project dependencies, and provides guided repair for common installation issues before launching ForgeUI Studio.

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

The setup utility will automatically:

- Verify **Node.js**
- Verify **npm**
- Install **node_modules** (if missing)
- Locate a compatible **Python 3.11** installation
- Install required Python packages:
  - Pillow
  - pypng
  - lz4
- Verify the **LVGLImage.py** asset conversion engine
- Verify **ESP-IDF 5.5.x** installation
- Verify OpenAI package installation
- Check OpenAI API configuration
- Optionally launch ForgeUI Studio

---

### 1. Runtime Requirements

#### Node.js

ForgeUI requires **Node.js v20 LTS (or newer)**.

Verify your installation:

```bash
node -v
npm -v
```

If `node_modules` is missing, **FIRST_TIME_FORGEUI_SETUP.bat** will automatically install the required project packages.

#### Git

Git is required for cloning and updating the ForgeUI repository.

Verify:

```bash
git --version
```

---

### 2. Development Environment

Recommended IDE:

- Visual Studio Code

Recommended Extensions:

- ESLint
- Prettier
- Espressif ESP-IDF Extension

The ESP-IDF extension has been physically verified to build and flash standalone ForgeUI exports directly from Visual Studio Code without requiring ForgeUI Studio.

---

### 3. ESP-IDF Standalone Development

ForgeUI exports a completely independent ESP-IDF project.

Required:

- ESP-IDF v5.5.x
- ESP32-P4 Toolchain
- ESP-IDF VS Code Extension (recommended)

After exporting a project you may continue development independently:

```text
ForgeUI Studio
        ↓
Export Standalone ESP-IDF Project
        ↓
Visual Studio Code
        ↓
ESP-IDF Extension
        ↓
Add Custom I/O
GPIO
I2C
SPI
UART
CAN
Networking
Application Logic
        ↓
Build
        ↓
Flash
        ↓
Physical ESP32-P4
```

ForgeUI does **not** lock your project into the Studio environment.

---

### 4. LVGL Image Conversion

ForgeUI uses a local offline image conversion pipeline.

The first-time setup automatically verifies:

- Python 3.11
- Pillow
- pypng
- lz4
- `tools/lvgl/LVGLImage.py`

This pipeline converts uploaded images and React Icons into native LVGL C assets ready for standalone ESP-IDF builds.

---

### 5. OpenAI Integration

AI-assisted layout generation requires:

- OpenAI npm package
- An OpenAI API key

Create:

```text
studio/.env.local
```

Example:

```text
OPENAI_API_KEY=your_api_key_here
```

The first-time setup verifies both the OpenAI package installation and API key configuration.

---


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