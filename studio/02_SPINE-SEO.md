# 🏛️ ESP32-P4 UI Studio | Architecture Spine

## 1. Project Overview & Product Core

### Core System Identity
* **Project Official Name:** ESP32-P4 UI Studio
* **Internal Framework Branding:** ForgeUI Studio
* **Monorepo Repository Name:** `esp32p4-ui-studio`
* **Theme System Status:** THEME PIPELINE V1 PROVEN ON PHYSICAL ESP32-P4 DISPLAY HARDWARE.
* **Theme Direction:** Synchronized token contract system unifying Browser Preview, native LVGL C export, and the flashed firmware runtime layer.
* **Active Architectural Save Point:** `FORGEUI_STUDIO_EXPORT_IDF_V1__STANDALONE_BUILD_FLASH_PROVEN__2026-05-28`

### Technical Project Mission
* **Definition:** Low-code visual HMI designer, WYSIWYG layout builder, and automated firmware deployment toolchain.
* **Target Hardware:** Espressif RISC-V ESP32-P4 series MCUs driving high-resolution capacitive touchscreen panels.
* **Core Technical Stack:** Dynamic React visual layout canvas ➔ Static LVGL v9 C code exporter ➔ Local ESP-IDF compilation scripts.
* **Embedded Runtime Target:** `ForgeUI-One` standalone ESP-IDF firmware application framework shell.
* **Developer User Story:** Launch Local Studio ➔ Visually Compose HMI UI ➔ Export Standalone ESP-IDF Project ➔ Build & Flash ➔ View Live Graphics Rendering on Target LCD.

### Current Product Maturity State
* ForgeUI Studio has transitioned beyond experimental proof-of-concept status.
* Core standalone ESP-IDF export architecture is now physically validated on real ESP32-P4 hardware.
* Browser Preview, LVGL export generation, standalone export packaging, and hardware flash workflows are operational end-to-end.
* Current development focus has shifted from "can it export?" toward:
  * Export fidelity optimization
  * Widget coverage expansion
  * Visual layout parity tracking
  * Asset pipeline maturity loops
  * Export UX/UI polish mechanics
  * Runtime bare-metal stabilization

### System Boundaries & Constraints
* **What It IS:** Fixed-viewport screen editors, industrial display HMIs, automation dashboards, smart kiosk interfaces, and tactile control panels.
* **What It IS NOT:** Responsive web page builders, generic CSS frameworks, React runtime executors inside firmware, or a packaged cross-platform desktop binary.
* **Current Software Distribution Model:** Browser-managed local Node.js development server. Desktop wrappers (Wails, Tauri, Electron) are deferred.

---

## 2. Monorepo Architecture & File Directory Map

### Workspace Structural Tree

```text
esp32p4-ui-studio/
├── studio/                             # Visual IDE Frontend & LVGL Code Generation Workspace (React / Next.js)
├── firmware/
│   └── ForgeUI-One/                    # Production-ready ESP-IDF Firmware Application Shell & Driver Runtime
├── exports/                            # Generated standalone ESP-IDF export projects
├── tools/                              # Automation scripts, compilation helpers, and hardware flashing utilities
├── docs/                               # Developer documentation and markdown system specs
│   └── history/                        # Version migration logs and legacy architectural records
├── START_FORGEUI_STUDIO.bat            # Windows foreground runtime service launcher
├── START_FORGEUI_STUDIO_HIDDEN.vbs     # Hidden background daemon developer initialization tool
├── STOP_FORGEUI_STUDIO.bat             # Graceful local developer workspace server shutdown utility
├── README.md                           # Main developer onboarding guide & SEO landing documentation
├── LICENSE                             # Primary open-source software license agreement
├── THIRD_PARTY_LICENSES.md             # Core upstream software dependency attributions
└── 01_SPINE.md                         # Structural Architecture Spine (This File)
```

### Strict Area Ownership & Separation Protocols
* **The Studio Subsystem (`/studio`) Owns:** Drag-and-drop workspace UI components, absolute canvas X/Y coordinate tracking, inspector parameters, preview rendering, export orchestration, and automated LVGL C generation.
* **The Firmware Subsystem (`/firmware`) Owns:** Native C compilation context, Board Support Package (BSP) definitions, hardware touch/display panel peripheral configuration drivers, audio/WiFi/runtime infrastructure, and the core LVGL life-cycle rendering loop.
* **The Tooling Subsystem (`/tools`) Owns:** Platform automation setups, cross-compilation pipeline triggers, USB flashing interfaces, and filesystem workspace bridge monitors.
* **The Export Subsystem (`/exports`) Owns:** Generated standalone ESP-IDF firmware projects intended to build independently from ForgeUI Studio after export.

---

## 3. Technology Stack & Target Environment Parameters

### IDE Development Stack
* **Frontend Technologies:** React, Next.js App Router, and Chakra UI component definitions.
* **Open-Source Heritage:** Forked from a mature, MIT-licensed visual editor engine originally developed by Premier Octet.
* **Extension Standard Operating Procedure:** All custom platform-specific modifications must be isolated directly inside `studio/src/forgeui/`.

### Target Hardware Specifications
* **Primary Target Evaluation Kit:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
* **Physical Graphics Viewport Size:** 1024x600 fixed pixel bounding box.
* **Low-Level UI Framework:** LVGL v9 core embedded graphics layer compiled via the official Espressif ESP32-P4 BSP.

### Local Workspace Directory Paths
* **Absolute Core Project Root:** `C:\ForgeUI\Projects\esp32p4-ui-studio`
* **Local Studio Source Path:** `studio/`
* **Local Firmware Build Path:** `firmware/ForgeUI-One/`
* **Generated Export Path:** `exports/`
* **Automation Utilities Path:** `tools/`
* **Target Serial Flashing Script:** `tools/flash-p4.bat`

### Proven ESP-IDF Export Baseline
* **ESP-IDF Extension Version:** `v5.5.4`
* **Target MCU:** `esp32p4`
* **UART/JTAG Mode:** `UART`
* **Known-Good COM Port During Validation:** `COM3`
* **Validation Method:** `Full Clean → Build → Flash`
* **OpenOCD Requirement:** NOT required for normal exported project flashing.
* **QEMU Usage:** Unused / not part of current validation path.

---

## 4. Compilation Pipelines & Runtime System Contracts

### Hardware Deployment Pipeline Flow

```text
  [ Run START_FORGEUI_STUDIO_HIDDEN.vbs ]
                     │
                     ▼
  [ Node.js Dev Server Boots + Registers File Exporter Bridge ]
                     │
                     ▼
  [ Canvas Launches Locally at http://localhost:3000 ]
                     │
                     ▼
  [ Developer Sets Absolute X/Y Canvas Constraints ]
                     │
                     ▼
  [ Action: Export ESP-IDF / Build & Flash ]
                     │
                     ▼
  [ Code Generator Translates JSON Nodes to Static LVGL C Code ]
                     │
                     ▼
  [ Export System Packages Standalone Decoupled Project Snapshot ]
                     │
                     ▼
  [ Local Toolchain Compiles and Flashes Binary to MCU over USB-C ]
```

### Target Generated Artifact Contract
* **Output Code Injections:** `90_Studio_Export.c` and `90_Studio_Export.h`.
* **Firmware Runtime Hook Location:** `ForgeUI-One/main/01_FG_Runtime.c`.
* **Execution Call Handle:** `fg_studio_export_create(scr);`.
* **Immutability Contract:** Generated C files are volatile build artifacts. Never make manual code edits inside these outputs; changes must occur directly on the visual design canvas layout.

### Standalone ESP-IDF Export Pipeline V1
* **Status:** FULLY PROVEN ON REAL ESP32-P4 HARDWARE.
* **Toolbar Action Trigger:** `Export ESP-IDF`
* **Backend Route Mapping:** `POST /export-idf-project`
* **Export Status Verification:** VALIDATED THROUGH CLEAN BUILD + FLASH + BOOT.
* **Export Folder Protection:** AUTO-INCREMENT EXPORT GUARD ACTIVE.
* **Overwrite Protection:** ENABLED.
* **Export Naming Ownership:** Backend-managed numbering and collision handling loops only.

### Export Folder Collision Protection
The backend export architecture explicitly handles folder namespace allocation to prevent destructive layout loss or folder collisions. 

```text
  [ Root Exports Directory: /exports ]
                  │
                  ├── ForgeUI_Export
                  ├── ForgeUI_Export_001
                  ├── ForgeUI_Export_002
                  └── ForgeUI_Export_003  <-- Next build tracks sequence automatically
```

### Export Pipeline Guarantees
* Exported projects are treated as immutable runtime generated snapshots.
* Existing export asset folders are never destructively overwritten.
* The React frontend workspace intentionally does not handle index numbering logic.
* The backend export engine maintains absolute state ownership of project structures.
