# 🛠️ ForgeUI Studio

An open-source **Visual UI Designer, Low-Code HMI Layout Engine, Asset Pipeline, and Automated Firmware Deployment Studio** engineered specifically for the **Espressif ESP32-P4** ecosystem running **LVGL v9** and **ESP-IDF**.

ForgeUI Studio bridges the gap between browser-based UI design and production-ready embedded deployment. It eliminates manual coordinate calculations, automates LVGL code generation, manages image assets, and deploys directly to ESP32-P4 hardware from a single workflow.

---

# ⚡ Key Architectural Advancement

ForgeUI Studio supports both:
*   Integrated browser-based Build & Flash workflows.
*   Fully standalone ESP-IDF project exports.

Visual layouts remain editable inside the Studio while generated firmware remains portable and independent.

---

# 📦 Standalone ESP-IDF Export Architecture

ForgeUI Studio can generate complete standalone ESP-IDF projects which no longer depend on the Studio after export.

## Benefits
*   Zero framework lock-in.
*   Open directly inside Visual Studio Code.
*   Native ESP-IDF workflow compatibility.
*   Portable project distribution.
*   Clean rebuild support.
*   Long-term firmware maintainability.

Only the generated UI layer is injected into the runtime shell:
```text
90_Studio_Export.c
90_Studio_Export.h
```
Everything else remains standard ESP-IDF and LVGL.

---

# 🔄 Proven Deployment Pipeline

```text
ForgeUI Studio Canvas
            ↓
Generate Native LVGL Code
            ↓
Generate LVGL Image Assets
            ↓
Generate Asset Registry
            ↓
Generate CMake Sources
            ↓
Export Standalone ESP-IDF Project
            ↓
ESP-IDF Build
            ↓
Flash ESP32-P4
            ↓
Physical Hardware Validation
```

---

# 🖼️ Uploaded Image Pipeline (PROVEN)

F# 🎨 React Icon Pipeline (PROVEN)

ForgeUI Studio now exports React Icons through the exact same asset pipeline used by Image widgets.

## Proven Workflow

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
LV_IMAGE_DECLARE(...)
    ↓
lv_image_set_src(...)
    ↓
ESP-IDF Build
    ↓
Physical ESP32-P4
```

## Proven Capabilities

* 9,514 searchable React Icons
* Multi-select Browser
* Use As Icon Widget
* PNG Generation
* Automatic LVGL Conversion
* Automatic Asset Registry Integration
* Unified Image Asset Pipeline
* Multiple Unique Icon Validation
* Physical ESP32-P4 Rendering

React Icons and Image widgets now share a single export pipeline.

Legacy `LV_SYMBOL_*` support remains available only for backwards compatibility.
```

## Proven Capabilities
*   PNG / JPG / SVG Upload
*   Drag & Drop Asset Import
*   Thumbnail Generation & Asset Registry
*   Automatic LVGL Conversion (ARGB8888)
*   Automatic Asset Compilation & CMake Integration
*   Physical ESP32-P4 Rendering

No cloud conversion services are required. All image conversion occurs locally.

---

# 🚀 Core Features

## Visual Designer
*   WYSIWYG Canvas Editing with Absolute Positioning
*   Drag & Drop Layout Construction with Resize Handles
*   Grid Alignment & Device-Aware Workspaces

## Browser Preview
*   Real-Time Preview Rendering
*   Preview-to-Hardware Validation
*   Theme Previewing & Live Layout Inspection

## LVGL Code Generation
*   Native LVGL v9 Output
*   Optimized Static Layout Generation
*   Automatic Widget Creation & Styling Generation
*   Asset Integration

## Build & Flash

* Browser Build & Flash Triggers
* Export Standalone ESP-IDF Project
* VS Code ESP-IDF Extension Support
* Detached Build & Flash Workflow
* Clean Build Support
* Live Flash Console
* Direct Local ESP-IDF Toolchain Integration

## Asset Management
*   Upload & Delete Assets
*   Asset Registry & Thumbnail Browser
*   Local LVGL Asset & Firmware Component Generation

---

# 🎨 Supported Widgets

ForgeUI Studio currently supports:

## Structure
*   Box
*   Text
*   Image

## Input
*   Input
*   Textarea
*   NumberInput
*   Select

## Controls
*   Button
*   Switch
*   Checkbox
*   Radio
*   Slider

## Status
*   Progress
*   CircularProgress

The widget pipeline is validated across:
```text
Canvas ➔ Preview ➔ Generated LVGL ➔ ESP32-P4 Hardware
```

---

# 🎨 Built-In Themes

ForgeUI Studio ships with multiple hardware-validated visual themes:
*   Reactor Dark | Graphite | Nordic Blue | Midnight Terminal
*   Industrial Steel | Military Green | Cyber Teal | Forge Orange
*   Nebula Purple | OLED Black | Matrix Green | Carbon Red
*   Arctic Ice | Blueprint | Toxic Lime

Theme tokens remain synchronized across:
```text
Builder ➔ Preview ➔ Generated LVGL ➔ Hardware
```

---

# 💻 Hardware Validation

## Primary Target
**ESP32-P4**

Validated using:
**Waveshare ESP32-P4-WIFI6-Touch-LCD-7B**

## Specifications
*   ESP32-P4 SoC
*   1024×600 MIPI-DSI LCD Display
*   Capacitive Touch Screen Controller
*   LVGL v9 Engine Integration
*   ESP-IDF v5.5.4 Toolchain

---

# ✅ Proven Milestones
* Browser UI Builder & Preview — PROVEN
* Native LVGL Code Generation — PROVEN
* Standalone ESP-IDF Project Export — PROVEN
* Independent VS Code Build — PROVEN
* ESP-IDF Extension Build & Flash — PROVEN
* Local LVGLImage.py Integration — PROVEN
* Uploaded Image Pipeline — PROVEN
* React Icon Pipeline — PROVEN
* Unified Image Asset Pipeline — PROVEN
* Automatic CMake Injection Pipeline — PROVEN
* Multiple Unique Icon Validation — PROVEN
* Physical ESP32-P4 Rendering — PROVEN

---

# 🏭 Target Use Cases

ForgeUI Studio is optimized for:
*   Industrial HMI Systems & Machine Control Panels
*   IoT Dashboards & Smart Home Controllers
*   Medical Equipment Interfaces & Kiosk Displays
*   Automation Systems & Touchscreen Appliances

---

# 🔮 Current Development Direction

Icon Asset Reuse
Duplicate Asset Prevention
Automatic Asset Cleanup
Startup Cleanup
Document Persistence
Builder ↔ Preview ↔ Hardware Parity
Template Library Expansion
Future AI-Assisted UI Generation
```

---

# 🤝 Open Source Credits

ForgeUI Studio is built upon the excellent open-source editor foundations originally created by Premier Octet.

The project has been extensively adapted and expanded for:
*   LVGL v9
*   ESP32-P4 Hardware Targets
*   Embedded HMI Development
*   ESP-IDF Integration
*   Hardware Deployment Automation

Original licensing and attribution remain preserved.

---

# 👨‍💻 Project Maintainer

**Scott Forster**  
ForgeUI Project  
📧 [forgeui.esp32@gmail.com](mailto:forgeui.esp32@gmail.com)

---

## Current Save Point
```text
FORGEUI_STANDALONE_EXPORT__INDEPENDENT_VSCODE_BUILD_AND_FLASH__MULTIPLE_ICON_PIPELINE__PHYSICAL_P4_PROVEN__2026-07-11
```

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
