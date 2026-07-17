# 🚀 ForgeUI Studio: Getting Started Guide

### AI-assisted Visual LVGL v9 Designer, AI Layout Generator, and Standalone ESP-IDF Export Framework for Espressif ESP32-P4.

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

ForgeUI Studio
        │
        ▼
Visual Builder / AI Studio
        │
        ▼
Manual Design  ─────┐
                    │
AI Prompt Helper ───┤
                    │
Natural Language ───┘
        │
        ▼
Validated ForgeUI Layout
        │
        ▼
Canvas
        │
        ▼
Live Browser Preview
        │
        ▼
Native LVGL Export
        │
        ▼
Standalone ESP-IDF Project
        │
        ▼
Visual Studio Code
        │
        ▼
ESP-IDF Build & Flash
        │
        ▼
ESP32-P4 Hardware
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
Live Browser Preview
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

### 2. Unified Native Asset Pipeline

ForgeUI Studio uses a unified local asset pipeline with separate preprocessing paths for images and semantic icons. Both pipelines remain completely offline and ultimately generate native LVGL assets for deployment.

### Image Asset Pipeline

```text
AI Hero / Uploaded Image
                │
                ▼
      Studio Asset Manager
                │
                ▼
     Image Preprocessor
                │
                ▼
 Center Crop (if required)
                │
                ▼
 Resize to Active Display
                │
                ▼
    tools/lvgl/LVGLImage.py
                │
                ▼
 Generated Static LVGL C Asset
                │
                ▼
 Project Asset Registry
                │
                ▼
 Standalone ESP-IDF Project
                │
                ▼
 Physical ESP32-P4
```

### Native Icon Pipeline

```text
Semantic Icon Request
                │
                ▼
    ForgeUI Icon Resolver
                │
                ▼
      React Icon Registry
                │
                ▼
 Native PNG Generation
                │
                ▼
 assetMode: "icon"
                │
                ▼
 Preserve Native Dimensions
                │
                ▼
    tools/lvgl/LVGLImage.py
                │
                ▼
 Generated Static LVGL C Asset
                │
                ▼
 Project Asset Registry
                │
                ▼
 LV_IMAGE_DECLARE(...)
                │
                ▼
 lv_image_set_src(...)
                │
                ▼
 Standalone ESP-IDF Project
                │
                ▼
 ESP-IDF Build & Flash
                │
                ▼
 Physical ESP32-P4
```

### Verified

- ✓ Unified local asset pipeline
- ✓ AI Hero background preprocessing
- ✓ Native-size icon generation
- ✓ Semantic icon resolution
- ✓ Device-aware image preprocessing
- ✓ LVGL C asset generation
- ✓ Browser Preview parity
- ✓ Physical ESP32-P4 validation
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
    Automated Schema Validation
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


## 🤖 ForgeUI AI Roadmap

ForgeUI AI is built as a modular architecture where every AI capability shares the same prompt engine, parser, validator, asset pipeline, and native LVGL export workflow.

### ✅ Proven AI Modules

- ✓ AI Layout Generation
- ✓ AI Layout Prompt Helper
- ✓ AI Hero Background Generation
- ✓ AI Asset Designer
- ✓ AI Artwork Generation
- ✓ Forge Asset Library
- ✓ Semantic Icon Resolution
- ✓ Native Icon Asset Generation
- ✓ Device-Aware Image Processing
- ✓ Native LVGL Asset Generation

---

### 🚧 In Development

- Theme-Aware Layout Generation
- Runtime Widget Generation
- AI Component & Layout Editing
- Board-Aware Project Generation
- GPIO & Peripheral Binding
- Dashboard & Widget Templates

---

### 🔮 Planned

- Multi-Page Applications
- Runtime Assistant
- Project Templates
- Plugin & Extension Framework
- Context-Aware AI Generation
- Smart Asset Optimisation
- Collaborative Project Workspaces

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