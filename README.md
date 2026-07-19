# 🛠️ ForgeUI Studio (`esp32p4-ui-studio`)


### The Open-Source AI-Assisted Embedded HMI Studio for ESP32-P4 that transforms natural language into production-ready LVGL applications, reusable widgets, native assets and standalone ESP-IDF projects.

### ⭐ Leave a Star!
If ForgeUI Studio helped accelerate your embedded development, saved you from proprietary ecosystem lock-in, or slashed your interface compilation times, **please leave a GitHub Star!** Stars are our open-source currency—they drive visibility, fund community development, and ensure this framework remains 100% free and subscription-free forever.

---

## ⚡ Verified Hardware Performance

Real-world runtime logs captured directly via `idf_monitor.py` on the physical **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B** system hardware platform running intensive vector widgets over full layered 1024x600 alpha-blended high-contrast textures show:

*   **Fluid Visuals**: Fixed, rock-solid **63 FPS** continuous hardware-accelerated rendering loop profiles.
*   **Minimal Processor Overhead**: Low **2.5% CPU utilization** footprint under active layout rendering passes.
*   **Sub-Millisecond Drawing Passes**: Ultra-low **2ms to 5ms draw cycle updates** across complex layered geometries.
*   **Silicon Optimization**: Deep core configuration scripts unlock the high-performance dual-core RISC-V processor straight to its high-speed **360MHz CPU frequency**.
*   **Expanded Volatile Memory**: Auto-maps a **32MB external Hex-PSRAM bank running at a 200MHz bus clock** for massive volatile canvas allocations.

---


## ✅ Native Render Parity Achieved

ForgeUI now maintains render parity across:

✓ Builder Canvas

✓ Browser Preview

✓ Generated LVGL Assets

✓ Physical ESP32-P4 Hardware

Images imported into ForgeUI are automatically processed into native device-sized assets ensuring identical rendering throughout the complete development workflow.

## 🖼️ AI Hero Asset Pipeline V2

ForgeUI Studio now supports automatic AI-generated Hero Backgrounds that are converted into native LVGL assets during import.

### Proven Workflow

```text
Natural Language Prompt
            │
            ▼
     OpenAI Image Generation
            │
            ▼
      PNG Import
            │
            ▼
 Automatic Device Preprocessing
            │
            ▼
 Center Crop
            │
            ▼
 Resize To Active Display
            │
            ▼
 Native LVGL Asset Generation
            │
            ▼
 Theme Manager
            │
            ▼
 Builder Canvas
            │
            ▼
 Browser Preview
            │
            ▼
 ESP-IDF Export
            │
            ▼
 Physical ESP32-P4
```

### Verified

✓ AI Hero Generation

✓ Automatic Image Processing

✓ Native LVGL Asset Generation

✓ Builder Rendering

✓ Browser Preview

✓ ESP32-P4 Hardware
---

## 🕹️ Interactive Button Asset Pipeline — Physical Hardware Proven

ForgeUI Studio now supports reusable image-based Interactive Buttons with independent Normal and Pressed visual states.

Buttons can be created manually from existing LVGL-ready assets or generated directly with AI.

### Proven Workflow

```text
Button Description
        │
        ▼
AI Normal State Generation
        │
        ▼
AI Pressed State Generation
        │
        ▼
Requested Width & Height
        │
        ▼
Interactive Button Preprocessor
        │
        ▼
Native-Size PNG Assets
        │
        ▼
LVGL C Asset Generation
        │
        ▼
Interactive Asset Registry
        │
        ▼
Builder Canvas
        │
        ▼
Browser Preview
        │
        ▼
Native LVGL Export
        │
        ▼
Physical ESP32-P4

---
---

## ✅ Verified End-to-End Development Workflow

ForgeUI Studio has now been physically verified from Builder to hardware using both the integrated Studio workflow and a completely detached exported project.

## 🤖 AI Studio V2 — Verified End-to-End AI Interface Generation

ForgeUI Studio now includes **ForgeUI AI Studio**, allowing developers to describe interfaces using natural language and generate validated ForgeUI layouts that can be immediately edited, exported, compiled and flashed to physical hardware.

### Proven AI Workflow

```text
Natural Language Prompt
            │
            ▼
   Layout Prompt Helper (Optional)
            │
            ▼
        OpenAI GPT
            │
            ▼
Validated ForgeUI Layout Document
            │
            ▼
Semantic Icon Resolution
            │
            ▼
Visual Builder Canvas
            │
            ▼
Live Browser Preview
            │
            ▼
Native LVGL Code Generation
            │
            ▼
Standalone ESP-IDF Project
            │
            ▼
Visual Studio Code
            │
            ▼
ESP-IDF Build
            │
            ▼
Physical ESP32-P4 Hardware
```

### Verified

- ✓ AI Layout Prompt Helper
- ✓ Live GPT integration
- ✓ Structured ForgeUI layout generation
- ✓ Automatic JSON validation
- ✓ Component validation
- ✓ Semantic icon resolution
- ✓ Native icon asset generation
- ✓ One-click Canvas insertion
- ✓ Live Browser Preview
- ✓ Native LVGL code generation
- ✓ Standalone ESP-IDF project generation
- ✓ Physical ESP32-P4 deployment

ForgeUI Studio transforms natural-language interface ideas into fully native LVGL applications while preserving a pure ESP-IDF workflow. Every generated layout remains fully editable before export, giving developers complete control over the final firmware.

---

## 📦 Proven Development Pipeline

```text
ForgeUI Studio
        │
        ▼
Visual Builder / AI Playground
        │
        ▼
Canvas & Live Browser Preview
        │
        ▼
Native LVGL Code Generation
        │
        ▼
Standalone ESP-IDF Export
        │
        ▼
Visual Studio Code
        │
        ▼
ESP-IDF Build System
        │
        ▼
Ninja Toolchain
        │
        ▼
ESP32-P4 Hardware
```

### Build Status

- ✓ Visual Builder and Canvas
- ✓ AI Layout Generation
- ✓ Layout Prompt Helper
- ✓ Semantic Icon Pipeline
- ✓ Browser Preview
- ✓ Native LVGL Code Generation
- ✓ Standalone ESP-IDF Export
- ✓ Independent Visual Studio Code Build
- ✓ ESP-IDF v5.5 Compatibility
- ✓ Physical ESP32-P4 Flash Validation

---

# 🧹 Firmware Maintenance

ForgeUI Studio now includes built-in firmware maintenance tools to keep generated projects clean during rapid AI iteration.

### Clean Firmware

Regenerates the generated project while preserving user assets.

Rebuilds:

- `main/CMakeLists.txt`
- `90_Studio_Export.c`
- `90_Studio_Export.h`

Preserves:

- Uploaded assets
- AI-generated themes
- Generated icons

---

### Clean Build & Flash

Performs a complete firmware cleanup before rebuilding.

Actions:

- Removes temporary build files
- Clears ESP-IDF build output
- Regenerates CMake
- Regenerates Studio export files
- Performs a clean rebuild
- Flashes the physical ESP32-P4

This eliminates stale generated files, historical assets and cached build artefacts, ensuring every deployment is produced from a clean project state.
## 🚀 Core Philosophy: Zero-Bloat Native Output

ForgeUI Studio completely removes the engineering overhead of setting up modern embedded display architectures:

```text
[Eliminated Workspace Overhead]         [Preserved Native Low-Level Control]
Manual coordinate calculations    ───►  Pure Native C Code Syntax Structures
Monolithic UI programming         ───►  Standard ESP-IDF Toolchain Optimization
Manual graphic file formatting    ───►  Raw 2D-DMA Hardware Acceleration Loops
Complex CMake script management   ───►  Zero Web Runtimes Ever Deployed to Flash
```

**No HTML, CSS, JavaScript, Node.js, or browser runtimes ever deploy onto the microcontroller. Everything compiles down into pure embedded firmware.**

---

## 🛠️ Complete Feature Matrix

### 1. Visual Builder & Design Studio

* **Visual Canvas** — Drag, drop, resize and configure LVGL components including Buttons, Text, Images, Charts, Arcs, Bars, Scales, LEDs, Calendars, Rollers, Switches and many more.

* **AI Layout Designer** — Generate complete embedded HMI layouts from natural language using the integrated ForgeUI AI Playground.

* **AI Layout Prompt Helper** — Guided prompt builder for creating structured industrial dashboards and embedded interfaces.

* **AI Asset Designer** — Generate reusable ForgeUI widgets and standalone industrial artwork using AI.

* **Forge Asset Library** — Save, organise, reuse and insert AI-generated widgets and artwork across projects.

* **Dynamic Theme Manager V2** — Includes 25+ built-in industrial themes with persistent hero backgrounds and custom asset support.

* **Semantic Icon Browser** — Search and use over 9,500 React Icons. AI-generated icon requests are automatically resolved into native LVGL-ready assets.

* **Live Browser Preview** — Instantly preview layouts, widgets, themes and assets before exporting or flashing hardware.

---

### 2. Native Asset Pipeline

* **Device-Aware Image Processing** — Automatically preprocesses imported artwork and AI-generated images for the active display resolution.

* **Native LVGL Asset Generation** — Converts PNG, JPG and SVG assets into optimized LVGL image resources using the local `LVGLImage.py` pipeline.

* **Automatic Asset Registry** — Manages uploaded images, icons, AI artwork and generated assets with automatic LVGL conversion and project integration.

* **Theme & Hero Pipeline** — AI-generated hero backgrounds integrate directly into the Theme Manager, Builder Canvas and Browser Preview.

---

### 3. Build & Deployment

* **One-Click Build & Flash** — Build, deploy and monitor firmware directly from ForgeUI Studio.

* **Clean Build & Flash** — Regenerates project files, refreshes CMake, performs a clean ESP-IDF build and flashes the physical device.

* **Inline Flash Console** — Streams live build output, firmware logs and deployment status directly inside the Studio.

* **Standalone ESP-IDF Export** — Generate fully independent ESP-IDF projects that build directly in Visual Studio Code without requiring ForgeUI Studio.

* **Native ESP32-P4 Workflow** — Zero cloud runtime, zero embedded web technologies. Every interface compiles into pure native LVGL C running on physical ESP32-P4 hardware.

### AI Capabilities

- AI Layout Generation
- AI Layout Prompt Helper
- AI Hero Background Generation
- AI Asset Designer
- AI Artwork Generation
- Forge Asset Library
- Reusable Widget Library
- Semantic Icon Resolution
- Native Icon Asset Generation
- Device-Aware Image Processing
- Native LVGL Asset Generation
- Theme Manager Integration
- Asset Manager Integration

---

### Proven Pipeline
AI Artwork / Hero Prompt
            │
            ▼
    OpenAI Image Generation
            │
            ▼
     ForgeUI Asset Import
            │
            ▼
Automatic Device Preprocessing
            │
            ▼
  Native 1024×600 Processing
            │
            ▼
      LVGLImage.py
            │
            ▼
   Generated LVGL C Asset
            │
            ▼
 ForgeUI Asset Registry
            │
            ▼
 Theme Manager / Asset Library
            │
            ▼
     Builder Canvas
            │
            ▼
    Live Browser Preview
            │
            ▼
 Native LVGL Code Export
            │
            ▼
 Standalone ESP-IDF Project
            │
            ▼
      Build & Flash
            │
            ▼
 Physical ESP32-P4

## 📁 Decoupled Workspace Architecture

Clicking **Export Standalone Project** completely decouples ForgeUI Studio from the generated firmware, producing a fully independent ESP-IDF workspace that can be built, flashed, version controlled, and shared without requiring ForgeUI Studio.

The exported project has been physically verified by:
*   ✓ Opening directly in Visual Studio Code
*   ✓ Building with the Espressif ESP-IDF Extension
*   ✓ Flashing to a physical ESP32-P4
*   ✓ Running independently of ForgeUI Studio

```text
ForgeUI Studio
        │
        ▼
   Export Standalone Project
        │
        ▼
 Independent ESP-IDF Workspace
        │
        ▼
   Visual Studio Code Workspace
        │
        ▼
   Official ESP-IDF Extension Build
        │
        ▼
   Ninja Toolchain Binary Flash
        │
        ▼
 Physical ESP32-P4 Hardware Run
```

**Example Export Destination Target:**
```text
C:\ForgeUI-Exports\ForgeUI_Export_003
```

**Project Structural Workspace Directory Tree:**
```text
esp32p4-ui-studio/
├── studio/                     # React / Next.js visual builder workspace
├── tools/lvgl/LVGLImage.py     # Local offline raw LVGL asset asset converter
└── firmware/ForgeUI-One/       # Standalone ESP-IDF reference deployment target
    ├── .vscode/                # Pre-configured editor workspace files
    ├── partitions.csv          # Linear flash partition memory layouts
    ├── sdkconfig.defaults      # Default optimization settings and frequency parameters
    ├── sdkconfig               # Actively generated target compilation properties
    ├── CMakeLists.txt          # Top-level project build declaration file
    └── main/
        ├── assets/uploads/     # Auto-converted target image data structs (.c)
        ├── 00_ForgeUI_Config.h # Global canvas pin constraints and geometric definitions
        ├── 01_FG_Runtime.c/.h  # Threaded interface redraw hooks and execution timers
        ├── 20_RTC.c/.h         # Native I2C real-time system clock drivers (DS3231)
        ├── 30_Audio.c/.h       # Asynchronous MP3 / WAV hardware decoding runtimes
        ├── 30_WIFI.c/.h        # Hosted SDIO Wi-Fi wireless co-processor management (ESP32-C6)
        ├── 40_SD.c/.h          # FATFS system memory interface drivers
        └── 90_Studio_Export.c  # Clean native generated LVGL 9 application source code
```

### Standalone Export Philosophy
ForgeUI Studio maintains absolute ownership over visual project generation layouts, while ESP-IDF maintains total ownership over low-level code compilation and hardware deployment. 

Following export, the directory acts as an independent application. Developers are completely free to track progress inside isolated Git repositories and integrate backend modifications without vendor lock-in.

---

## 💾 Optimized Flash Partition & Memory Map

Your exported code incorporates a high-capacity custom allocation scheme designed to prevent memory overflows when managing dense layout interface assets:

### 1. Flash Partition Allocations (`partitions.csv`)
*   **`factory` (8 MB / `0x10000, 8M`)**: Massive linear code space window allocated exclusively for user runtime firmware logic, application states, and UI layouts.
*   **`storage` (7 MB / `0x810000, 7M`)**: High-capacity dedicated local SPIFFS partition block ensuring static background structures and image file array matrices remain safe from software layer collisions.

### 2. Low-Level Silicon Optimization Settings
*   **Direct 2D-DMA Tunneling**: The display refresh configuration parameters (`bsp_display_cfg_t`) lock pixel allocation pathways directly to active DMA engines (`.buff_dma = true`) while enforcing direct internal RAM layout tracking (`.buff_spiram = false`). This completely eliminates frame rendering transmission latency over slower external memory lanes.
*   **Thread-Safe Graphics Handshaking**: Visual initialization calls inside `main.c` are fully encapsulated within native Espressif display locks (`bsp_display_lock(0)`), ensuring your graphic compositions update with complete structural integrity across multi-core task switches.

## ForgeUI Philosophy
Build it.

Prove it.

Flash it.

Improve it.

Repeat.

## Current Development Status

ForgeUI Studio has now proven:

✓ Visual Builder

✓ AI Layout Generation

✓ AI Layout Prompt Helper

✓ AI Hero Background Generation

✓ AI Asset Designer

✓ AI Artwork Generation

✓ Forge Asset Library

✓ Reusable Widget Library

✓ Semantic Icon Pipeline

✓ Native Icon Asset Generation

✓ Device-Aware Asset Pipeline

✓ Automatic Image Preprocessing

✓ Native LVGL Asset Generation

✓ Theme Manager Integration

✓ Browser Preview

✓ Native LVGL Export

✓ Standalone ESP-IDF Export

✓ Independent Visual Studio Code Build

✓ One-Click Build & Flash

✓ Physical ESP32-P4 Validation

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining visual design, AI-powered generation, LVGL, and ESP-IDF into a single workflow.

ForgeUI Studio is developed in collaboration with ChatGPT, which serves as a coding assistant, architectural sounding board and rapid prototyping partner. While I define the vision, validate the hardware and direct the engineering, ChatGPT helps accelerate implementation, refactoring and documentation., which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**