# 🛠️ ForgeUI Studio 

An open-source **AI-assisted embedded application generation platform** for **ESP32-P4**, combining visual design, semantic runtime APIs, native LVGL v9 generation and standalone ESP-IDF deployment in one engineering workflow.

**Visual UI Designer, Low-Code HMI Layout Engine, Offline Asset Pipeline, and Automated Firmware Deployment Studio** engineered explicitly for the high-performance **Espressif ESP32-P4** SoC running native **LVGL v9** and **ESP-IDF**.

ForgeUI Studio bridges the gap between high-level browser-based design and production-ready embedded applications. It can produce AI-generated interfaces, reusable runtime widgets, generated platform services, semantic LVGL APIs, Browser Preview, independent ESP-IDF projects and physically validated ESP32-P4 firmware.

ForgeUI is organized into five separate platform layers with clear ownership:

* **AI Studio** — Creates editable layouts, artwork, hero backgrounds and reusable assets.
* **Interactive Asset Framework** — Owns artwork-backed controls and their reusable runtime families.
* **Standard LVGL Component Runtime** — Generates semantic APIs and genuine user-event hooks for supported native widgets.
* **Built-in System Runtime** — Generates reusable device services independently from user project screens.
* **Native ESP-IDF Export Pipeline** — Materializes native LVGL, assets, public APIs, developer hooks and standalone projects.

---

# 🤖 AI Design Studio

ForgeUI Studio includes integrated AI workflows for layouts, artwork, hero backgrounds and reusable Interactive Assets:

✓ AI Layout Designer — Generate complete embedded interfaces.

✓ AI Asset Designer — Generate reusable ForgeUI widgets and industrial artwork.

✓ AI Hero Designer — Generate production-ready themed backgrounds with automatic LVGL conversion.

Interactive Asset generation also supports related State Sheets and linked crop workflows so multi-state artwork remains consistent and editable.

Every generated asset remains fully editable before being exported as native LVGL code for deployment to physical ESP32-P4 hardware.

---

# ⚡ Key Architectural Advancement

* **Guided AI Layout Builder:** Generate structured prompts using the built-in Layout Prompt Helper before sending requests to GPT.

ForgeUI Studio supports two distinct execution paths within a single workflow:
*   **Integrated Web-Serial Pipeline:** Cloud-free, browser-triggered build compilation and direct flashing over local serial ports (`COMx`).
*   **Decoupled Project Exporter:** Instant generation of pristine, completely independent ESP-IDF application structures.

Visual elements remain editable inside the drag-and-drop studio, while the resulting firmware repository is highly portable, completely isolated, and structured for long-term maintainability.

---

# 📦 Standalone ESP-IDF Export Architecture

Clicking **Export Standalone Project** produces a production-grade workspace directory that is 100% disconnected from the studio toolchain. 

## Structural Advantages
*   **Zero Proprietary Lock-In:** No subscription gates, no license validation checks, and no background phone-home telemetry.
*   **IDE Interoperability:** Drop the generated workspace directly into **Visual Studio Code** or native command terminals.
*   **Native Toolchain Compliance:** Automatically matches Espressif's rigorous workspace design guidelines and standard `CMakeLists.txt` component registrations.
*   **Pristine Logic Isolation:** Generated UI and developer integration have explicit ownership:
    ```text
    main/90_Studio_Export.c
    main/90_Studio_Export.h
    main/95_UserEvents.c
    main/95_UserEvents.h
    ```
    `90_Studio_Export.*` owns generated UI, retained runtime state and public APIs. In a standalone project, `95_UserEvents.*` becomes the developer-owned hook and application-integration layer.

```text
Generated UI
      ↓
Developer application code
```

This boundary lets product engineers extend application behavior without placing permanent logic inside replaceable generated UI files. Layout iterations regenerate the UI layer without overwriting developer-owned application logic.

---

# 🔄 Proven AI Workflows

### AI Layout Generation

```text
Natural Language Prompt
          │
          ▼
AI Layout Prompt Helper
          │
          ▼
OpenAI GPT
          │
          ▼
Validated ForgeUI Layout
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
Standalone ESP-IDF
          │
          ▼
Build & Flash
          │
          ▼
Physical ESP32-P4
```

### AI Hero & Artwork Generation

```text
Natural Language Prompt
          │
          ▼
OpenAI Image Generation
          │
          ▼
ForgeUI Asset Import
          │
          ▼
Device-Aware Image Processing
          │
          ▼
Native LVGL Asset Generation
          │
          ▼
Theme Manager / Asset Library
          │
          ▼
Builder & Preview
          │
          ▼
ESP-IDF Export
          │
          ▼
Physical ESP32-P4
```

### AI Asset Designer

```text
Natural Language Prompt
          │
          ▼
OpenAI Generation
          │
          ▼
Live Asset Preview
          │
          ▼
Save to Forge Asset Library
          │
          ▼
Insert into Canvas
          │
          ▼
Native LVGL Export
          │
          ▼
Physical ESP32-P4
```

# 🎨 Unified Asset Pipelines (PROVEN)

ForgeUI Studio handles all graphic assets entirely inside a local offline environment. No external APIs or cloud subscription transformation services are ever utilized.

### 1. Uploaded Image Asset Pipeline
*   **Proven Formats:** PNG, JPG, and SVG asset matrices.
*   **Offline Transformations:** Local dragging and dropping automatically invokes a native Python helper utility (`tools/lvgl/LVGLImage.py`).
*   **Low-Level Output:** Translates raw shapes into highly optimized `ARGB8888` rasterized pixel data, outputs clean static `.c` data arrays directly onto disk, and appends corresponding `LV_IMAGE_DECLARE(...)` mappings to the build profile.

### 2. React Icon Conversion Pipeline
ForgeUI Studio exports vector React Icons through the exact same asset engine used by high-contrast graphic layouts, eliminating the dependency friction of rendering heavy character sets.

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
Native-size PNG
        │
        ▼
LVGLImage.py
        │
        ▼
Native LVGL Asset
```

*   **Icon Metrics:** 9,514 indexed vector shapes, multi-select queuing cart panel, automated asset validation, and direct structural rendering down to physical silicon.
*   *Note: Legacy `LV_SYMBOL_*` options remain preserved purely for backward-compatibility limits.*

---

# 🚀 Core Feature Matrix

### Visual Designer Workspace

### AI Studio

* **Guided AI Layout Prompt Helper** — Build structured prompts for embedded HMIs and industrial dashboards.

* **GPT Layout Generation** — Generate complete ForgeUI layouts from natural language.

* **AI Hero Background Generation** — Create production-ready themed backgrounds with automatic device-aware preprocessing.

* **AI Asset Designer** — Generate reusable ForgeUI widgets, controls and industrial artwork.

* **Interactive Asset Generation** — Generate multi-state controls through State Sheets, linked crop editing and native asset conversion.

* **Forge Asset Library** — Save, organise and reuse AI-generated assets across projects.

* **Semantic Icon Resolution** — Automatically resolve AI-generated icon requests into native LVGL-ready assets.

* **Native Icon Asset Generation** — Convert React Icons into optimized LVGL image resources.

* **Editable Generated Layouts** — Every AI-generated layout remains fully editable inside the visual designer before export.

* **Native LVGL Export** — Generate clean native LVGL v9 code ready for ESP-IDF deployment.

* **WYSIWYG Layout Canvas** — Real-time drag-and-drop editing with absolute positioning and pixel-perfect layout control.

* **Device-Aware Workspace** — Canvas dimensions automatically match the selected hardware display profile for accurate design-time rendering.

---

### Live Browser Preview

* **Real-Time Preview** — Instantly validate layouts, themes, AI-generated assets and runtime widgets before exporting or flashing hardware.

* **Render Parity** — Browser Preview, generated LVGL code and physical ESP32-P4 hardware share the same rendering pipeline for consistent visual results.

* **System Runtime Parity** — Browser Preview mirrors Interactive Assets, the System Runtime, Wi-Fi Manager and Storage Browser through the same architecture represented by generated LVGL.

* **Final Parity Polish** — Only final visual parity polish remains between Browser Preview, Canvas and the physical ESP32-P4.

---

### Native Code Generation

* **Native LVGL v9 Output** — Generates structured, readable LVGL C code using modern APIs and best-practice object creation patterns.

* **Retained Runtime State** — Generates the private component objects and semantic state required by supported runtime widgets.

* **Public Runtime APIs** — Exposes application-to-UI control through generated `FG_Set_*`, `FG_Show_*`, `FG_Hide_*`, `FG_Add_*` and `FG_Clear_*` functions.

* **Developer Hook Layer** — Exposes genuine UI-to-application events through generated `FG_On_*` hooks while keeping guarded programmatic updates silent where appropriate.

* **Production-Ready Projects** — Export standalone ESP-IDF workspaces ready to build, version control and extend without ForgeUI Studio.

---

### Standard LVGL Component Runtime

ForgeUI now exports more than static layouts. Supported Standard LVGL components receive semantic retained runtime APIs that match the state or action they genuinely own, while generated UI code remains strictly separated from developer-owned application logic. Generated projects expose public APIs such as `FG_Set_<Component>()` and developer hooks such as `FG_On_<Component>()` where user interaction exists.

The current reviewed Standard Runtime includes:

* LED, Bar, Arc and Progress
* Chart
* Keyboard, Calendar and Message Box
* Roller, Select, Button Matrix, TabView and Tileview
* Input, Textarea and NumberInput
* Switch, Checkbox and Radio
* Image and Box
* IconButton

Presentation-only components remain intentionally API-free when they own no meaningful runtime state. Icon, Divider, Scale and Line generate no runtime setter or developer hook. Runtime image replacement belongs to Image rather than Icon, and dynamic Divider visibility belongs to its parent Box.

---

### Interactive Asset Framework

Interactive Assets remain completely separate from the Standard Runtime. The five current families are Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator. They combine reusable state artwork with shared runtime families, while Standard LVGL widgets generate component-specific semantic APIs. All five use direct Creator workflows and retain Canvas, Browser Preview, generated LVGL and physical ESP32-P4 parity within the recorded validation scope.

---

### Built-in System Runtime

ForgeUI now includes a reusable generated System Runtime providing:

* System Launcher
* Display / Brightness
* Wi-Fi Manager
* Storage Browser
* Native LVGL Keyboard

These are generated platform services rather than user project screens. Browser Preview and generated LVGL share the same System architecture while it remains separate from both Interactive Assets and the Standard LVGL Component Runtime.

The System Runtime owns one reusable native LVGL keyboard and includes a physically proven lazy Storage Browser supporting:

* SD status
* directory browsing
* folder navigation
* paging
* Refresh
* Read / Write Test
* Select Item mode
* Delete Empty Folder

The physically proven Hosted Connectivity Runtime uses ESP-Hosted with the ESP32-C6 over SDIO Slot 1, while SD Storage operates simultaneously on SDMMC Slot 0. The generated Wi-Fi Manager and Storage Browser consume those backends without taking ownership of transport or filesystem operations.

---

### Toolchain Automation

* **One-Click Build & Flash** — Build, flash and monitor firmware directly from ForgeUI Studio.

* **Firmware Maintenance Tools** — Clean generated assets, regenerate project files, refresh CMake and perform clean ESP-IDF builds.

* **Integrated Flash Console** — Stream live build output, compiler diagnostics and runtime logs directly inside the Studio.

---

# 🧩 Validated Widget Registry
The system features strict validation checking layers mapping elements securely along the following data path:
```text
Studio Canvas ➔ Browser Preview ➔ Generated C Layout ➔ Hardware Silicon
```

### Supported Component Objects
*   **Structural Layouts:** Flex Boxes, Text Labels, High-Contrast Images.
*   **User Inputs:** Fields, Structured Textareas, Multi-state Selection Lists.
*   **Functional Controls:** Push Buttons, Toggle Switches, Checkboxes, Radio Sets, Variable Sliders.
*   **Dynamic Status Displays:** Linear Progress Tracks, Circular Vector Arcs.

---

# 🎨 Hardware-Validated Theme Engine
Theme properties utilize specialized color weight tokens that synchronize perfectly from the visual editor straight into physical memory configurations. Built-in presets include:
*   **Industrial Panels:** *Industrial Carbon, Reactor Hex, Cyber Teal Pro, Forge Orange, Military Steel.*
*   **High-Contrast Operations:** *Midnight Terminal, OLED Black, Nordic Blue, Quantum Flow, Toxic Lime.*
*   **Futuristic Conceptions:** *Neon Horizon, Nebula Purple, Matrix Green, Blueprint Slate, Carbon Red.*

---

# 💻 Hardware Target Specifications

*   **Primary System SoC Target:** Espressif ESP32-P4 (High-Performance dual-core RISC-V clocking up to 360MHz).
*   **Verified Development Platform:** Waveshare ESP32-P4-WiFi6-Touch-LCD-7B.
*   **Integrated Touch Hardware Controllers:** GT911 capacitive touch mapping registers.
*   **Display Interface Link:** Multi-lane MIPI-DSI high-definition panel (1024×600 pixel tracking resolution).
*   **Volatile Memory Architecture:** 32MB External Hex-PSRAM device running on a 200MHz bus clock.
*   **Target Core Software Environment:** ESP-IDF v5.4 / v5.5 Toolchain + LVGL v9.2.2 Engine.

---

# ✅ Proven Project Milestones
*   ✓ WYSIWYG Browser UI Builder Canvas — **PROVEN**
*   ✓ Native LVGL v9 Code Generation — **PROVEN**
*   ✓ Standalone ESP-IDF Project Export — **PROVEN**
*   ✓ Independent External VS Code Compilation — **PROVEN**
*   ✓ Native Ninja Build & Flash Utilities — **PROVEN**
*   ✓ Local Python `LVGLImage.py` Asset Transformation — **PROVEN**
*   ✓ Local Local Upload Image Asset Pipeline — **PROVEN**
*   ✓ Server-Side Next.js Secure OpenAI Routings — **PROVEN**
*   ✓ React Icon SVG-to-Raster Conversion Engine — **PROVEN**
*   ✓ Multiple Unique Icon Component Validation Loops — **PROVEN**
*   ✓ High-Resolution Physical ESP32-P4 Execution — **PROVEN** (**63 FPS @ 2.5% CPU**)
* ✓ AI Layout Prompt Helper — PROVEN
* ✓ Semantic Icon Pipeline — PROVEN
* ✓ Native Icon Asset Pipeline — PROVEN
* ✓ Browser Preview / ESP32-P4 Parity — PROVEN
* ✓ Firmware Maintenance Tools — PROVEN
* ✓ Complete Interactive Asset Framework and Direct Creator Workflows — PROVEN
* ✓ Generated System Runtime with Launcher and Display / Brightness — PROVEN
* ✓ Complete Wi-Fi Manager and Browser Preview Parity — PROVEN
* ✓ Reusable Native LVGL Keyboard — PROVEN
* ✓ ESP-Hosted Wi-Fi over ESP32-C6 SDIO Slot 1 — PROVEN
* ✓ Simultaneous Hosted Wi-Fi and SDMMC Slot 0 Storage — PROVEN
* ✓ Storage Browser System Runtime — PROVEN
* ✓ Lazy Storage Runtime Architecture — PROVEN
* ✓ SD Browser, Paging & Refresh — PROVEN
* ✓ Read / Write Test — PROVEN
* ✓ Select Item Mode — PROVEN
* ✓ Delete Empty Folder — PROVEN

---

# 🏭 Target Use Cases
*   **Industrial Controls:** Heavy machinery monitoring consoles, crane dashboards, and tactile field equipment.
*   **IoT & Automation Display Hubs:** Luxury smart home control docks and high-speed energy analytics tracking portals.
*   **Commercial Appliances:** High-resolution digital medical equipment panels and point-of-sale kiosk interfaces.

---

# 🔮 Next-Phase Development Goals

### AI & Design Studio

* **AI Component Editing** — Modify existing layouts and widgets using natural language without regenerating the entire interface.

* **Context-Aware AI Generation** — Enable selective updates that preserve existing layouts, assets and project structure.

* **Dashboard & Widget Templates** — Expand the built-in library of industrial dashboards, reusable widgets and application templates.

---

### Runtime & Hardware Integration

* **Board Profile System** — Support multiple ESP32-P4 development boards with device-aware display, touch and peripheral configurations.

* **Runtime Widget Generation** — AI-assisted creation of reusable runtime widgets including gauges, indicators, charts and industrial controls.

* **GPIO & Peripheral Binding** — Bind switches, LEDs, relays, sensors and other hardware peripherals directly to generated UI components.

* **Multi-Page Applications** — Native support for multi-screen projects with navigation, shared assets and page management.

---

### Build & Project Management

* **Smart Asset Management** — Automatic duplicate detection, unused asset cleanup and project footprint optimisation.

* **Plugin & Extension Framework** — Support custom components, exporters and project generators.

* **Enhanced Code Generation** — Expand native LVGL generation with additional widgets, runtime behaviours and reusable component libraries.

* **Project Templates** — One-click generation of complete starter applications for industrial, IoT and commercial HMI projects.
---

# 🤝 Open Source Credits
ForgeUI Studio is built upon the visual design workspace structures originally engineered by Premier Octet. 

The original codebase has been extensively customized, expanded, and optimized for:
*   Native LVGL v9 API targets and core formatting modifications.
*   ESP32-P4 deep silicon and MIPI-DSI display configurations.
*   Automated local file compilation and direct Web-Serial deployment tracking.
*   All original open-source attributions and licensing remain preserved on disk.

---

# 👨‍💻 Project Maintainer

**Scott Forster**  

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining AI Studio, reusable Interactive Assets, a generated Standard LVGL Component Runtime, a built-in System Runtime with Wi-Fi and Storage tools, Browser Preview, native LVGL v9 generation, ESP-IDF export and physically validated ESP32-P4 workflows into a single engineering environment.

Today ForgeUI generates both reusable Interactive Asset runtimes and semantic runtime APIs for supported standard LVGL widgets, allowing developers to work visually while still producing clean, native LVGL applications with clear ownership boundaries between generated UI and application code.

ForgeUI is built in collaboration with ChatGPT, which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
