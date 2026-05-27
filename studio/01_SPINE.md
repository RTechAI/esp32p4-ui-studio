# ESP32-P4 UI Studio Spine

## 1. Project Overview

### Core Identity
* **Project Name:** ESP32-P4 UI Studio
* **Internal Branding:** ForgeUI Studio
* **Repository Name:** `esp32p4-ui-studio`
* ** Current Status:** ALIVE / STUDIO-TO-HARDWARE PIPELINE PROVEN / DEV MODE RUNTIME ACTIVE
* ** Active Save Point:** `FORGEUI_STUDIO_WEB_FLASH_CONSOLE_V1_STABLE__BACKGROUND_FLAVOURS_NEXT__2026-05-26`

### Project Goal
* **Definition:** Visual embedded UI designer and deployment toolchain.
* **Target Hardware:** ESP32-P4 chips and Waveshare displays.
* **Core Stack:** LVGL code generation and ESP-IDF firmware runtime templates.
* **End-User Vision:** Launch Studio -> Design UI -> Press Flash -> Hardware Updates.

### Project Boundaries
* **What It IS:** Fixed-device interfaces, industrial touchscreens, HMIs, and kiosk dashboards.
* **What It IS NOT:** Generic website builders, responsive web editors, or React on embedded hardware.

---

## 2. Monorepo Architecture & Layout

### Workspace Structure

```text
esp32p4-ui-studio/
├── studio/                             # Visual editor / Studio frontend
├── firmware/
│   └── ForgeUI-One/                    # ESP-IDF firmware runtime
├── tools/                              # Flash/build/helper tooling
├── docs/                               # Project documentation
│   └── history/                        # Archived notes and migrations
├── START_FORGEUI_STUDIO.bat            # Legacy visible launcher
├── START_FORGEUI_STUDIO_HIDDEN.vbs     # Current hidden dev launcher
├── STOP_FORGEUI_STUDIO.bat             # Runtime cleanup helper
├── README.md                           # Main documentation
├── LICENSE                             # Project license
├── THIRD_PARTY_LICENSES.md             # Upstream licenses
└── 01_SPINE.md                         # Architecture spine
```


### Area Ownership Rules
* **Studio Owns:** Visual editor, drag-and-drop workflow, viewport rendering, and LVGL export orchestration.
* **Firmware (ForgeUI-One) Owns:** ESP-IDF runtime, Board Support Package (BSP), display/touch drivers, and LVGL lifecycle execution.
* **Tooling Owns:** Helper scripts, build orchestration, flash workflows, and automation helpers.

---

## 3. Technology Stack & Environment

### Studio Stack
* **Framework:** React, Next.js, and Chakra UI.
* **Upstream Core:** heritage from an upstream MIT-licensed editor engine originally developed by Premier Octet.
* **Development Rule:** Build custom functionality isolated within `studio/src/forgeui/`.

### Hardware Target
* **Primary Device:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B.
* **Hardware Viewport:** 1024x600 resolution.
* **Graphics Engine:** LVGL running on ESP-IDF via the ESP32-P4 BSP.

### Local Environment Paths
* **Root Workspace:** `C:\ForgeUI\Projects\esp32p4-ui-studio`
* **Studio Directory:** `studio/`
* **Firmware Directory:** `firmware/ForgeUI-One/`
* **Tools Directory:** `tools/`
* **Known Flashing Script:** `tools/flash-p4.bat`

---

## 4. Pipeline & Runtime Contracts

### Proven Hardware Pipeline
1. Run `START_FORGEUI_STUDIO.bat` to launch the local stack.
2. Studio and Export bridge spin up; user opens `localhost:3000`.
3. User triggers **Export UI to Device** inside the web interface.
4. Studio generates native LVGL C code and writes it directly to the firmware directory.
5. ESP-IDF build system compiles the project and flashes the ESP32-P4 hardware automatically.

### Generated Artifact Contract
* **Output Files:** `90_Studio_Export.c` and `90_Studio_Export.h`.
* **Runtime Insertion Point:** `ForgeUI-One/main/01_FG_Runtime.c`.
* **Execution Call:** `fg_studio_export_create(scr);`.
* **Status:** Treat generated files purely as replaceable artifacts. Never hand-edit them.

### Runtime Ownership Truth

Studio owns:
- layout
- colours
- themes
- widgets
- generated LVGL code

ForgeUI-One owns:
- ESP-IDF boot
- BSP display/touch startup
- LVGL lifecycle
- generated export execution
- optional backend hardware services

The firmware runtime no longer owns pages, headers,
themes, icon sets, or app UI layout.
---

## 5. Strict Development Rules

* **Rule 1 (No React in Firmware):** Studio generates static code; the firmware only executes raw C/LVGL.
* **Rule 2 (Strict Code Separation):** Keep Studio, Runtime, and Tooling layers completely distinct.
* **Rule 3 (Licensing Preservation):** Retain all upstream attribution and MIT license headers.
* **Rule 4 (No Engine Rewrites):** Avoid massive structural modifications to the core editor.
* **Rule 5 (Device Config Single Source):** Use `studio/src/forgeui/ForgeUIDeviceConfig.ts` for all viewport, grid, and hardware definitions.

---

## 6. Current Limitations & Roadmap

### Known Limitations
* Early-stage export engine with incomplete LVGL component coverage.
* Ongoing inspector code cleanup and legacy upstream visual remnants.
* Imperfect ESP-IDF extension integration inside monorepo mode.

### Near-Term Roadmap
* Polish the README, themes, and inspector UI.
* Clean up the export code pipeline and flash automation.
* Create visual screenshot and GIF user documentation.

### Mid-Term Roadmap
* Expand the LVGL widget coverage and add ForgeUI-native components.
* Implement a true coordinate-based pixel layout editor mode.
* Introduce support for multi-screen and multi-page UI flows.

### Long-Term Roadmap
* Zero-configuration, one-click hardware deployment directly from the UI.
* Support for multiple target display profiles and hardware boards.
* Establish a modular, reusable ecosystem for embedded UI components.
