

# 🛠️ ForgeUI Studio (esp32p4-ui-studio)

### Open-Source Visual LVGL v9 HMI Designer, ESP32-P4 UI Builder, Asset Pipeline, and Standalone ESP-IDF Code Generator

[![Framework](https://shields.io)](https://github.com)
[![LVGL Version](https://shields.io)](https://lvgl.io)
[![ESP-IDF](https://shields.io)](https://www.espressif.com)
[![Primary Target](https://shields.io)](https://www.waveshare.com)
[![Performance Proof](https://shields.io)](#-verified-hardware-performance)

**ForgeUI Studio** is an open-source visual UI designer and HMI development environment for **Espressif ESP32-P4** microcontrollers running **LVGL v9** and **ESP-IDF v5.5+**.

Built specifically for modern embedded displays, ForgeUI Studio combines a browser-based drag-and-drop editor, real-time preview engine, local LVGL image conversion pipeline, theme manager, asset manager, and automated code generation workflow into a single development platform.

Design interfaces visually, preview layouts instantly, generate production-ready LVGL C code, and deploy directly to physical ESP32-P4 hardware—or export completely standalone **ESP-IDF CMake projects** for development in **Visual Studio Code**.

## Key Features

* Visual drag-and-drop LVGL UI designer
* Native LVGL v9 code generation
* ESP32-P4 optimized export pipeline
* Standalone ESP-IDF project generation
* Browser Preview with hardware-aligned rendering
* Theme Manager with single-source theme architecture
* Local PNG → LVGL C asset conversion
* Uploaded image asset management
* One-click Build & Flash workflows
* Physical ESP32-P4 hardware validation
* 1024×600 HMI display support
* Waveshare ESP32-P4-WIFI6-Touch-LCD-7B support
* No cloud services required
* No subscription required
* Fully local development workflow

## Target Hardware

ForgeUI Studio is currently validated on:

* Espressif ESP32-P4
* Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
* 1024×600 MIPI-DSI displays
* GT911 capacitive touch controllers

## Designed For

* Industrial HMI systems
* Machine control panels
* Dashboard interfaces
* IoT control displays
* Embedded touchscreens
* ESP32-P4 product development
* LVGL application development
* Rapid HMI prototyping

ForgeUI Studio bridges the gap between modern visual UI design tools and native embedded execution, enabling developers to move from drag-and-drop design to physical ESP32-P4 hardware without manually writing LVGL layouts.


# 🛠️ ForgeUI Studio (esp32p4-ui-studio)

### The Open-Source Visual HMI Studio, Local Asset Pipeline, and Standalone Code Generator for Espressif ESP32-P4 Running Native LVGL v9.

[![Framework](https://shields.io)](https://github.com)
[![Graphics Library](https://shields.io)](https://github.com)
[![Primary Target](https://shields.io)](https://www.waveshare.com)
[![Performance Proof](https://shields.io)](#-verified-hardware-performance)

**ForgeUI Studio** is a zero-install, browser-based WYSIWYG HMI layout engine, local image converter, and standalone code generation environment built from the ground up for Espressif's high-performance **ESP32-P4** microcontrollers. 

ForgeUI bridges the gap between drag-and-drop web interfaces and high-speed bare-metal execution. Design fluid layouts, preview styled component matrices instantly, and flash code natively—or decouple entirely into standard, production-ready **ESP-IDF v5.5 CMake workspaces** for Visual Studio Code.

---

## ⚡ Verified Hardware Performance

Real-world runtime logs captured directly via `idf_monitor.py` on the physical **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B** running intensive vector widgets over full 1024x600 layered alpha-blended textures show:

*   **Fluid Visuals**: Fixed, rock-solid **63 FPS** continuous hardware rendering.
*   **Minimal Processing Footprint**: Low **2.5% CPU utilization** under active layout rendering passes.
*   **Sub-Millisecond Drawing Passes**: Ultra-low **5ms draw cycle updates** across complex layered geometries.
*   **Silicon Optimization**: Deep core configurations unlock the dual-core RISC-V processor straight to its high-performance **360MHz CPU frequency**.
*   **Expanded Throughput**: Auto-maps a **32MB external Hex-PSRAM bank running at a 200MHz bus clock** for massive volatile canvas allocations.

---

## 🚀 Core Philosophy: Zero-Bloat Native Output

ForgeUI Studio removes the friction of manual embedded layout configurations:
```text
[Eliminated Overhead]                   [Preserved Native Control]
Manual coordinate calculations    ───►  Pure Native C Code Syntax
Monolithic LVGL coding            ───►  Standard ESP-IDF Toolchain
Manual asset asset conversions     ───►  Raw Hardware Acceleration
Complex CMake script management   ───►  Zero Web Runtimes on Hardware
```
**No HTML, CSS, JavaScript, or browser runtimes ever deploy onto the microcontroller. Everything compiles down into pure embedded firmware.**

---

## 🛠️ Complete Feature Matrix

### 1. Unified Visual Canvas Workflow
*   **Active Component Panels**: Drag, drop, and configure multi-state components including vector Arcs, Charts, Calendars, Rollers, Textareas, ButtonMatrix layouts, and clean Tabviews.
*   **Dynamic Theme Manager V2**: Features 25+ built-in, low-contrast industrial presets (Industrial Carbon, Reactor Hex, Cyber Teal Pro, Quantum Flow, Neon Horizon). Supports automatic background styling behaviors using repeated tiling or fullscreen layout scales.
*   **Zero-Dependency Local Preview**: Test visual behaviors, bounding geometries, and style shifts inside the browser wrapper with zero compile-time delay.

### 2. Automated Build & Local Flashing Pipeline
*   **Inline Flash Console**: Trigger compilation, execute local toolchain checks, run background memory repairs (`REPAIR ESP-IDF MANAGED COMPONENT CACHE`), and stream real-time logging directly through browser-serial interfaces.
*   **Local Image Pipeline V1**: Zero cloud dependencies. Drag-and-drop PNG, JPG, or SVG assets directly into a local Python converter (`tools/lvgl/LVGLImage.py`). The pipeline automatically handles local thumbnail layout mapping, performs ARGB8888 conversions, generates local `.c` image array buffers, and injects clean `LV_IMAGE_DECLARE(...)` references into your build path.

---

## 📁 Decoupled Workspace Architecture

Clicking **Export** relinquishes all studio control, writing an industry-standard, fully independent ESP-IDF layout directly to your disk (`C:\ForgeUI-Exports`):

```text
esp32p4-ui-studio/
├── studio/                     # React / Next.js Browser UI Builder environment
├── tools/lvgl/LVGLImage.py     # Local ARGB8888 asset conversion engine (pypng / lz4)
└── firmware/ForgeUI-One/       # Clean Standalone ESP-IDF Export Workspace
    ├── .vscode/                # Configuration parameters for immediate IDE onboarding
    ├── partitions.csv          # High-capacity memory partition maps (8MB App, 7MB SPIFFS)
    ├── sdkconfig.defaults      # Core compiler parameters (Enforces native -O3 speed flags)
    ├── sdkconfig               # 103 KB pre-baked hardware peripheral registers
    ├── CMakeLists.txt          # Root project compiler script
    └── main/
        ├── assets/uploads/     # Converted graphic asset source buffers (.c image matrices)
        ├── 00_ForgeUI_Config.h # Universal HMI workspace constants
        ├── 01_FG_Runtime.c/.h  # Core visual task execution engines
        ├── 20_RTC.c/.h         # Local DS3231 I2C real-time clock driver layer
        ├── 30_Audio.c/.h       # Multi-media pipelines (esp-audio-player / esp-libhelix-mp3)
        ├── 30_WIFI.c/.h        # Wi-Fi network and 40MHz 4-bit SDIO co-processing systems
        ├── 40_SD.c/.h          # High-speed SD card filesystem management drivers
        └── 90_Studio_Export.c  # Compiled LVGL v9 widget rendering coordinate maps
```

---

## 💾 Optimized Flash Partition & Memory Map

Your exported code incorporates a high-capacity custom allocation scheme designed to prevent memory overflows when managing dense interface assets:

### 1. Flash Partition Allocations (`partitions.csv`)
*   **`factory app`**: **8MB** (`0x10000, 8M`) space accommodating extensive application logic.
*   **`storage` (SPIFFS)**: **7MB** (`0x810000, 7M`) block for custom interface textures and runtime configurations.

### 2. Post-Build Target footprint (`idf_size.py`)
*   **Total Compiled Image Size**: **7,444,086 bytes** (~7.4MB binary binary file, leaving stable headroom below your app partition ceiling).
*   **Flash Read-Only Data (`.rodata`)**: **6,601,308 bytes** (Pre-compiled image assets stored natively inside flash memory tables for zero-latency 0ms draw loops).
*   **Internal RAM Blocks (DIRAM)**: **169,768 bytes** (Establishes a balanced 38.12% footprint, safeguarding volatile pools for frame rendering buffers).

---

## 💻 IDE Integration & Manual Compilation Guide

Exported workspaces feature absolute zero toolchain lock-ins. You can transition your project to **Visual Studio Code** for advanced firmware modification seamlessly:

### 1. Load Workspace
Open Visual Studio Code, choose **File** > **Open Folder...**, and select your root exported workspace directory (e.g., `C:\ForgeUI-Exports\ForgeUI_Export_002`).

### 2. Auto-Resolved Registries
Your exported project automatically tracks and fetches **17 distinct hardware dependencies** through the official Espressif registry engine on initial build invocation, natively linking:
*   `lvgl/lvgl (9.2.2)`
*   `waveshare/esp32_p4_wifi6_touch_lcd_7b (1.0.2)`
*   `espressif/esp_lvgl_port (2.7.2)`
*   `espressif/esp_lcd_ek79007 (1.0.4)` & `esp_lcd_touch_gt911`

### 3. Deploy via Terminal
Set your system variables and compile directly via standard command tools or the IDE console layout:
```bash
# Explicitly align the framework toolchain to the target P4 processor architecture
idf.py set-target esp32p4

# Build, flash your binaries over serial (e.g., COM3 at 460800 baud), and open runtime logs
idf.py build flash monitor
```

---

## 🔌 High-Performance Coprocessor Offloading

To guarantee consistent **63 FPS** display output, the generated driver engine manages a dual-SoC wireless routing architecture:
*   **Visual Core Isolation**: The master **ESP32-P4** chip focuses its dual-core 360MHz compute resources entirely on rendering themes, drawing geometric widgets, and managing touch interactions.
*   **Network Stream Offloading**: The `30_WIFI` layer initializes high-speed **4-bit SDIO streams clocked at 40MHz** to offload `wpa_supplicant` loops, network connection configurations, and background handshakes onto an auxiliary **ESP32-C6 connectivity coprocessor** automatically.
