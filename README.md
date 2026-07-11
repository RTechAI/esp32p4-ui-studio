# 🛠️ ForgeUI Studio (`esp32p4-ui-studio`)

### The Open-Source Visual HMI Studio, Local Asset Pipeline, and Standalone Code Generator for Espressif ESP32-P4 Running Native LVGL v9 and ESP-IDF v5.5+.

---

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
---

## ✅ Verified End-to-End Development Workflow

ForgeUI Studio has now been physically verified from Builder to hardware using both the integrated Studio workflow and a completely detached exported project.

### Proven Workflow

```text
ForgeUI Studio
        ↓
Builder
        ↓
Browser Preview
        ↓
LVGL Export
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
```

Status:

- ✓ Browser Preview
- ✓ LVGL Code Generation
- ✓ Standalone Export
- ✓ Independent VS Code Build
- ✓ ESP-IDF Extension Build
- ✓ Physical ESP32-P4 Flash



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

### 1. Unified Visual Canvas Workflow
*   **Active Component Panels**: Drag, drop, scale, and visually configure multi-state components including vector Arcs, Charts, Buttons, Calendars, Rollers, Textareas, Lines, Switches, and clean Tabviews.
*   **Dynamic Theme Manager V2**: Features 25+ built-in, low-contrast industrial design presets (Industrial Carbon, Reactor Hex, Cyber Teal Pro, Quantum Flow, Neon Horizon). Supports automatic background styling behaviors using repeated tiling or full resolution layouts.
*   **Zero-Dependency Local Preview**: Test visual properties, boundary geometries, responsive alignments, and style shifts instantly inside a sandboxed browser wrapper engine with zero compile-time delay.
*   **Batch-Processing Icon Browser**: Native integration with an indexing tree of **9,514 Feather Icons** using an active staging asset cart workspace panel. Select multiple vector objects, queue them up, and inject them into your local asset pool simultaneously.

### 2. Automated Build & Local Flashing Pipeline
*   **Inline Flash Console**: Trigger compilation, execute local toolchain checks, run background memory repairs (`REPAIR ESP-IDF MANAGED COMPONENT CACHE`), and stream real-time logging records directly through local browser child processes.
*   **Local Image Converter Pipeline V1**: Zero cloud dependencies, zero external telemetry. Drag-and-drop PNG, JPG, or SVG assets directly into a local Python converter utility (`tools/lvgl/LVGLImage.py`). The pipeline handles local thumbnail layout mapping, performs precise `ARGB8888` vector-to-raster transformations, generates clean static `.c` image array buffers on disk, and injects safe `LV_IMAGE_DECLARE(...)` expressions into your build tree automatically.

---

## 📁 Decoupled Workspace Architecture

## 📁 Decoupled Workspace Architecture

Clicking **Export Standalone Project** completely decouples ForgeUI Studio from the generated firmware, producing a fully independent ESP-IDF workspace that can be built, flashed, version controlled, and shared without requiring ForgeUI Studio.

The exported project has been physically verified by:

- ✓ Opening directly in Visual Studio Code
- ✓ Building with the Espressif ESP-IDF Extension
- ✓ Flashing to a physical ESP32-P4
- ✓ Running independently of ForgeUI Studio

```text
ForgeUI Studio
        ↓
Export Standalone Project
        ↓
Independent ESP-IDF Workspace
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

Example export location:

```text
C:\ForgeUI-Exports\ForgeUI_Export
```

Project structure:

```text
esp32p4-ui-studio/
├── studio/                     # React / Next.js visual builder
├── tools/lvgl/LVGLImage.py     # Local offline LVGL asset converter
└── firmware/ForgeUI-One/       # Standalone ESP-IDF reference project
    ├── .vscode/                # VS Code workspace configuration
    ├── partitions.csv          # Flash partition layout
    ├── sdkconfig.defaults      # Default ESP-IDF configuration
    ├── sdkconfig               # Generated project configuration
    ├── CMakeLists.txt          # Root project build script
    └── main/
        ├── assets/uploads/     # Generated LVGL image assets (.c)
        ├── 00_ForgeUI_Config.h # Global project configuration
        ├── 01_FG_Runtime.c/.h  # Runtime framework
        ├── 20_RTC.c/.h         # RTC runtime
        ├── 30_Audio.c/.h       # Audio runtime
        ├── 30_WIFI.c/.h        # Wi-Fi runtime
        ├── 40_SD.c/.h          # SD card runtime
        └── 90_Studio_Export.c  # Generated LVGL user interface
```

### Standalone Export Philosophy

ForgeUI owns project generation.

ESP-IDF owns compilation and deployment.

After export, the generated project becomes a normal ESP-IDF application that can be:

- Built in Visual Studio Code
- Flashed using the ESP-IDF Extension
- Shared with other developers
- Committed to Git independently
- Maintained without ForgeUI Studio
```

---

## 💾 Optimized Flash Partition & Memory Map

Your exported code incorporates a high-capacity custom allocation scheme designed to prevent memory overflows when managing dense layout interface assets:

### 1. Flash Partition Allocations (`partitions.csv`)
*   **`factory` (8 MB / `0x10000, 8M`)**: Massive linear code space window allocated exclusively for user runtime firmware logic, application states, and UI layouts.
*   **`storage` (7 MB / `0x810000, 7M`)**: High-capacity dedicated local SPIFFS partition block ensuring static background structures and image file array matrices remain safe from software layer collisions.

### 2. Low-Level Silicon Optimization Settings
*   **Direct 2D-DMA Tunneling**: The display refresh configuration parameters (`bsp_display_cfg_t`) lock pixel allocation pathways directly to active DMA engines (`.buff_dma = true`) while enforcing direct internal RAM layout tracking (`.buff_spiram = false`). This completely eliminates frame rendering transmission latency over slower external memory lanes.
*   **Thread-Safe Graphics Handshaking**: Visual initialization calls inside `main.c` are fully encapsulated within native Espressif display locks (`bsp_display_lock(0)`), ensuring your graphic components populate safely without blocking host operating system kernel tasks.

---

## 🏁 Building a Standalone Export

Open the exported project in Visual Studio Code.

Configure the ESP-IDF Extension once.

Then simply:

```bash
idf.py reconfigure
idf.py build
idf.py flash
```

or

```bash
idf.py build flash monitor
```

This workflow has been physically verified on a second development laptop using only:

- Visual Studio Code
- Espressif ESP-IDF Extension
- Standalone ForgeUI Export

ForgeUI Studio is not required after export.
   ```


## React Icon Asset Pipeline

## React Icon Asset Pipeline

React Icons are now exported through the exact same asset pipeline as Image widgets.

```text
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
```

### Verified

- ✓ 9,514 searchable React Icons
- ✓ Multi-select Browser
- ✓ Use As Icon Widget
- ✓ PNG Generation
- ✓ Asset Manager Integration
- ✓ LVGLImage.py Conversion
- ✓ Generated C Assets
- ✓ Unified Image Asset Pipeline
- ✓ Multiple Unique Icons
- ✓ Physical ESP32-P4 Verified

React Icons no longer require a dedicated export path. Image widgets and Icon widgets share a single LVGL image asset pipeline.

---

## 🤝 Contributing

We welcome community contributions, optimization patches, and new widget layouts! Please review our `CONTRIBUTING.md` before submitting pull requests.

## 📝 License
ForgeUI Studio is released under the **MIT License**. Check out `LICENSE` for further operational guidelines.

---

### 🌐 Technical SEO Tag Index Matrix
*`open source ESP32-P4 visual UI designer studio`, `free alternative to subscription embedded HMI software tools`, `LVGL v9 code generation engine layout parser`, `Waveshare ESP32-P4-WIFI6-Touch-LCD-7B board configurations`, `ESP-IDF custom partitions.csv layout configuration matrix`, `low latency ARGB8888 image file conversion script python ecosystem`, `bare-metal RISC-V graphics pipeline optimizations`.*

## 🔍 Targeted Search Index & Comparative Reference

This framework is engineered specifically for hardware engineers and embedded software developers migrating away from restrictive graphical ecosystem platforms. If your production pipeline requires any of the following technical capabilities, ForgeUI Studio is built for your workflow:

### 1. High-Performance Display Architecture
*   **Hardware Keywords**: `ESP32-P4 MIPI-DSI LCD driver initialization`, `Waveshare 7-inch ESP32-P4 touch controller configuration`, `GT911 capacitive touch SPI/I2C mapping`, `RISC-V dual-core 360MHz microcontroller graphics`.
*   **Optimizations**: `ESP32-P4 internal 2D-DMA framebuffer tuning`, `bsp_display_lock thread safety loops`, `LVGL v9 parallel rendering hardware benchmarks`.

### 2. Standalone Code Generation & Exporters
*   **Keywords**: `Free alternative to subscription embedded UI builders`, `Zero-lock-in LVGL code generator`, `Convert React visual canvas to native C strings`, `Export standalone ESP-IDF CMake project repository`.
*   **Low-Level Deployment**: `Custom partitions.csv for 16MB flash configurations`, `8MB factory app slot allocation`, `7MB local storage SPIFFS partition matrix setup`.

### 3. Local Offline Asset Compilation Pipelines
*   **Keywords**: `Local PNG to LVGL C array asset conversion tool`, `Offline SVG to ARGB8888 bitmap rasterizer`, `tools/lvgl/LVGLImage.py Espressif python script execution`, `Automatic CMakeLists.txt idf_component_register injection`.

### 4. Modular Peripheral Separations
*   **Keywords**: `Asynchronous non-blocking Wi-Fi service pump loops`, `I2C DS3231 real-time clock firmware integration`, `High-speed SD/MMC mass storage filesystem managers for ESP32-P4`.
