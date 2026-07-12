# 🚀 ForgeUI Studio: Getting Started Guide

### Visual LVGL v9 Designer, AI Layout Generator, and Standalone ESP-IDF Export Framework for Espressif ESP32-P4.

Design visually, generate native LVGL code, export a standalone ESP-IDF project, and continue development independently in Visual Studio Code.

---

## 🚀 Quick Start

Get ForgeUI Studio running in just a few minutes.

### 1. Clone the Repository

```bash
git clone <your-repository-url> esp32p4-ui-studio
cd esp32p4-ui-studio
```

### 2. Run ForgeUI Setup

Launch the automated environment script from your terminal or file explorer:

```text
FIRST_TIME_FORGEUI_SETUP.bat
```

This utility prepares, validates, and repairs the ForgeUI development environment. It will automatically:

*   **✓ Verify Node.js & npm Status:** Checks version compatibility bounds.
*   **✓ Install Project Dependencies:** Installs `node_modules` blocks if missing or corrupted.
*   **✓ Discover ESP-IDF Python Environment:** Locates a compatible Python 3.11 virtual environment instance.
*   **✓ Setup Image Compilation Dependencies:** Automatically updates local Python libraries (`Pillow`, `pypng`, `lz4`).
*   **✓ Validate Local Asset Tools:** Verifies operational parameters for the native `LVGLImage.py` tool.
*   **✓ Check Core Software Frameworks:** Verifies ESP-IDF 5.5.x and the local OpenAI package configuration.
*   **✓ Validate Standalone Export Tree:** Verifies workspace template targets prior to code generation routines.

*If anything is missing, ForgeUI halts and provides explicit, guided repair instructions to resolve the installation issues.*

### 3. Start ForgeUI Studio

For everyday development iterations, bypass background terminal boilerplate friction by launching:

```text
START_FORGEUI_STUDIO_HIDDEN.vbs
```

ForgeUI Studio starts the local development services silently in the background and automatically opens:

```text
http://localhost:3000
```

### 4. Design, Export, and Continue Development

The complete ForgeUI workflow is structured as follows:

```text
ForgeUI Studio / AI Playground
              │
              ▼
    Visual Layout Design Canvas
              │
              ▼
    Zero-Compile Browser Preview
              │
              ▼
    AI Layout Generation (Optional)
              │
              ▼
    Highly-Optimized LVGL 9 Export
              │
              ▼
  Independent Standalone ESP-IDF Project
              │
              ▼
     Visual Studio Code (IDE Workspace)
              │
              ▼
     Official Espressif ESP-IDF Extension
              │
              ▼
    [Add Custom I/O, Drivers, & App Logic]
    (GPIO, I2C, SPI, UART, CAN, Networking)
              │
              ▼
     Native Cross-Compiler Cross-Build
              │
              ▼
     Hardware Flash & Binary Verification
              │
              ▼
    Physical Waveshare ESP32-P4 Target SoC
```

ForgeUI Studio generates a **fully standalone ESP-IDF project**. Once exported, development continues entirely independently in Visual Studio Code using the official ESP-IDF extension. You are free to add custom GPIO, I²C, SPI, UART, CAN, networking, sensors, drivers, and application logic without being locked into the ForgeUI Studio environment.

---

## 🎨 Unified ForgeUI Architecture

ForgeUI Studio is built around a single-source-of-truth architecture where visual design, themes, assets, AI generation, and code export all share the same structural project model. Every stage of the workflow feeds directly into the next, eliminating duplicated configuration and ensuring browser previews accurately represent the generated firmware.

### 1. Theme Management System

Changing a visual theme automatically updates theme selectors, the local browser preview canvas, exported C code blocks, and physical firmware output variables simultaneously:

```text
FG_PREVIEW_PALETTES
        │
        ▼
Theme Manager Workspace
        │
        ▼
ForgeThemeContext Global State
        │
        ▼
Canvas Builder Engine
        │
        ▼
Zero-Delay Browser Preview
        │
        ▼
Highly-Optimized LVGL Export
        │
        ▼
Generated Native C Source Code (.c/.h)
        │
        ▼
Standalone ESP-IDF Project Structure
        │
        ▼
Physical ESP32-P4 Target Hardware
```

### 2. Unified Image & Icon Asset Pipeline

Image widgets and React Icon widgets share a single native, cloud-free local asset pipeline. React Icons are automatically rasterized via a native transformation layer prior to parsing:

```text
Uploaded Image / React Icon Asset
                │
                ▼
      Studio Asset Manager UI Panel
                │
                ▼
    tools/lvgl/LVGLImage.py Script Engine
                │
                ▼
    ARGB8888 Color Matrix Conversion
                │
                ▼
   Generated Static LVGL C Asset (.c)
                │
                ▼
  Dynamic Project Asset Registry Index
                │
                ▼
    Local 'assetSources[]' Build Tree
                │
                ▼
    Automated CMakeLists.txt Injection
                │
                ▼
       LV_IMAGE_DECLARE(...) Macro
                │
                ▼
      lv_image_set_src(...) Assignment
                │
                ▼
     Standalone ESP-IDF Project Target
                │
                ▼
   ESP-IDF Native Ninja Toolchain Build
                │
                ▼
     Physical ESP32-P4 Silicon Output
```

### 3. AI Layout Generation Pipeline

AI-generated layouts do not use slow middleware interpretative scripts; they map instantly into standard layout models as first-class ForgeUI layouts, following the exact same pipeline as manually created interfaces:

```text
Natural Language System Text Prompt
                │
                ▼
   Server-Proxied OpenAI Responses API
                │
                ▼
   ForgeUI Structured JSON Specification
                │
                ▼
    Automated Schema Schema Validation
                │
                ▼
    Embedded Component Rule Verification
                │
                ▼
        Canvas Builder Viewport
                │
                ▼
    Zero-Delay Browser HMI Preview
                │
                ▼
       Highly-Optimized LVGL Export
                │
                ▼
   Exported Standalone ESP-IDF Project
```

### 4. Standalone Export Architecture

ForgeUI owns the visual layout generation, while ESP-IDF maintains total ownership over low-level code compilation and hardware deployment. After export, developers are free to maintain code outside of ForgeUI Studio entirely:

```text
ForgeUI Studio Designer UI
            │
            ▼
 Visual UI Design & Asset Insertion
            │
            ▼
 Zero-Delay Sandboxed Browser Preview
            │
            ▼
 Highly-Optimized Native LVGL Export
            │
            ▼
  Decoupled Standalone ESP-IDF Project
            │
            ▼
      Visual Studio Code Workspace
            │
            ▼
 Official Espressif ESP-IDF Extension
            │
            ▼
 Native Cross-Compiler Code Build
            │
            ▼
 Target Binary Hardware Flash Writing
            │
            ▼
  Physical ESP32-P4 Panel Verification
```

---

## 💻 System Workspace & Runtime Prerequisites

Ensure your host machine satisfies the following hardware and software parameters prior to launching your first automated environment build:

### 1. Runtime Requirements

#### Node.js
ForgeUI requires **Node.js v20 LTS (or newer)** along with standard **npm**. Verify your system installation versions:

```bash
node -v
npm -v
```

*Note: If `node_modules` are missing or corrupted, `FIRST_TIME_FORGEUI_SETUP.bat` will automatically fetch and recover the required project packages locally.*

#### Git
Git is required to parse repository updates and track core code modifications. Verify your configuration:

```bash
git --version
```

### 2. Recommended Production IDE Toolchain
To experience the maximum fluidity of the decoupled workspace architecture, configure your system environment around the following setup:

*   **Recommended IDE:** Visual Studio Code
*   **Recommended Workspace Extensions:** `ESLint`, `Prettier`, and the official **Espressif ESP-IDF Extension**.

*Note: The official Espressif VS Code Extension has been physically verified to build, partition, link, and flash standalone ForgeUI project exports directly from your editor without requiring ForgeUI Studio running in the background.*
