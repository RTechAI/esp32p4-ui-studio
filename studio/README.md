# ESP32-P4 UI Studio | Visual LVGL Creator & Embedded Deployment Toolchain 🚀

**ESP32-P4 UI Studio** is an open-source, all-in-one visual HMI designer and automated deployment toolchain engineered specifically for **ESP32-P4** touchscreen hardware running **LVGL v9**. 

By adapting a mature drag-and-drop editor engine toward a hardware-aware embedded layout workflow platform, this project completely bridges web-based visual prototyping with automated native hardware flashing. The project aims to reduce the traditional complexity of embedded LVGL workflows by integrating visual editing, export generation, and firmware deployment into a single coordinated workspace.

---

## ⚡ Major Milestone: End-to-End Hardware Pipeline

The project features a fully operational, integrated hardware development workflow. It moves seamlessly from design to physical execution:

```text
Visual Editor ➔ LVGL C Export ➔ Local Export Bridge ➔ ESP-IDF Firmware Runtime ➔ ESP32-P4 Flash ➔ Live Hardware Rendering
```

This pipeline has been fully validated on real hardware following clean rebuild testing.

---

## 🛠️ Hardware Target & Tech Stack

Out of the box, the workspace environment is pre-tuned for high-speed performance on industrial-grade layouts:
* **Primary Target Hardware:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
* **Viewport Metrics:** 1024x600 fixed pixel resolution
* **Graphics Library:** LVGL v9 
* **Backend Framework:** ESP-IDF v5.5.4

---

## 📦 Project Architecture & Directory Layout

The workspace functions as a clean, self-contained monorepo split cleanly into two independent engines:

```text
esp32p4-ui-studio/
├── studio/                 # Visual Editor & UI Design Workspace (React / Next.js)
├── firmware/
│   └── ForgeUI-One/        # Pure ESP-IDF Runtime, BSP, and LVGL Application Shell
├── tools/                  # Automated build, compilation, and flashing utilities
├── START_FORGEUI_STUDIO.bat # Unified one-click developer environment launcher
├── README.md               # Workspace documentation
├── LICENSE                 # Core open-source license agreements
└── 01_SPINE.md             # Architecture spine index
```

### The Architectural Separation of Concerns
1. **The Studio Side (`/studio`)**: Owns the visual editor workspace, canvas viewport bounds clamping, absolute x/y layout state, property inspectors, and LVGL C code generation orchestration.
2. **The Firmware Side (`/firmware`)**: Owns the native ESP-IDF compilation workspace, Board Support Package (BSP) setup, display/touch peripheral drivers, and the live application shell. Generated UI files are cleanly injected as isolated build artifacts.

---

## 🚨 Crucial Architectural Rules

To maintain high stability and maintainability, the project strictly enforces these design separation protocols:
* **Do NOT** embed React or web runtimes into the embedded firmware.
* **Do NOT** turn the ESP-IDF hardware layer into a web runtime wrapper.
* **Do NOT** tightly couple active frontend Chakra UI preview components into the structural LVGL code exporter logic.
* **The Paradigm:** Studio generates static LVGL artifacts ➔ Firmware compiles and executes LVGL artifacts ➔ Hardware renders the live interface.

---

## 🎨 Current Feature Matrix & Widget Coverage

### Structural & Core Features
* Fixed-viewport layout editing with absolute coordinate positioning
* Persistent wrapper-owned interaction mechanics (movement, resizing, selection)
* Automated local Node.js export bridge and execution orchestration launcher
* Automated ESP-IDF build and flash orchestration

### Active LVGL Code Export Mapping
* **`Text`** (Labels)
* **`Box`** (Containers & layout dividers)
* **`Progress`** (Bars)
* **`Radio`** (Checkbox / toggle-style elements)
* *Note: Upstream Chakra components available in the workspace preview are actively being mapped to their corresponding native LVGL equivalents.*

---

## 🔄 Live Developer Workflow

1. Run the unified launcher script:
   ```bash
   START_FORGEUI_STUDIO.bat
   ```
2. The environment visual embedded UI designer and deployment toolchain for ESP32-P4 hardware running LVGL v9..nt automatically boots the frontend studio, initializes the local export node bridge, and opens your browser interface at `localhost:3000`.
3. Visually construct your interface on the workspace canvas using absolute coordinates.
4. Click **Export UI to Device** (*"Export UI to Device"*).
5. The pipeline automatically writes out your clean `90_Studio_Export.c` / `.h` assets, calls the ESP-IDF compiler backend, builds and flashes the target board, and pushes your layout live to the screen.

---

## ⚠️ Known Limitations & Current Roadmap

### Active Constraints
* Local script paths are currently pre-configured for Windows host environments.
* LVGL styling capabilities (fonts, custom radiuses, explicit hex color mapping) are currently undergoing normalization.
* Live workspace logs require ongoing terminal visibility for end users.

### Strategic Priorities
* Rename UI actions to explicit targets (e.g., `Export UI to Device` and `Full Clean + Flash Device`).
* Expand code generation coverage across additional native LVGL widgets and layouts.
* Add automated desktop application wrapper packages for zero-config onboarding.
* Introduce native hardware state/connection telemetry feedback monitors into the web inspector toolbar.

---

## 📜 Upstream Attribution & Open Source Licensing

**ESP32-P4 UI Studio** builds on an upstream MIT-licensed editor engine originally developed by Premier Octet. This fork expands, refactors, and pivots that engine specifically toward low-level embedded software workflows, coordinate-based screen mapping, and ESP32 execution toolchains. 

The original MIT open-source license and author attributions remain fully preserved inside this repository. For explicit dependency details, please review `LICENSE` and `THIRD_PARTY_LICENSES.md`.

---

### Developed By
**Scott Forster** | ForgeUI Project  
📧 Contact: [forgeui.esp32@gmail.com](mailto:forgeui.esp32@gmail.com)
