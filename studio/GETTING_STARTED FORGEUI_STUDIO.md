# 📦 ForgeUI Studio | Onboarding & Getting Started Guide

## Visual LVGL v9 HMI Designer Platform

Welcome to **ForgeUI Studio**, an integrated visual development environment (IDE) and low-code human-machine interface (HMI) layout engine engineered specifically for **Espressif ESP32-P4** microcontrollers running **LVGL v9** and **ESP-IDF**.

This guide covers local workspace deployment, software dependencies, directory layouts, and execution routines.

---

## ⚡ System Architecture & Pipeline Dataflow

ForgeUI Studio bridges high-level web prototyping with bare-metal micro-controller execution loops.

```text
  [ Drag-and-Drop Visual Studio Layout Canvas ]
                       │
                       ▼
  [ React Transpiler Parses UI State JSON Tree ]
                       │
                       ▼
  [ Emits Pure Static: 90_Studio_Export.c / .h ]
                       │
                       ▼
  [ Injects Files Automatically into /firmware/ForgeUI-One Shell ]
                       │
                       ▼
  [ Links ESP-IDF Hardware Drivers, OPI PSRAM Registers, & MIPI-DSI BSP ]
                       │
                       ▼
  [ Local Compiler Script Triggers Unified Binary Upload Loop ]
                       │
                       ▼
  [ Native 60 FPS Interface Boots Natively on Physical Target Screen ]
```

---

## 🛠️ System Prerequisites & Host Environment Setup

Ensure your development computer houses the following hardware configurations and software packages before deploying the toolchain workspace:

### 1. Host Operating System & Engine Core
*   **Operating System Requirement:** Windows 10 / 11 Desktop PC Environment.
*   **Javascript Engine Core:** [Node.js v20 LTS (or newer)](https://nodejs.org).
*   **Post-Installation Engine Verification Checklist:**
    Open your terminal shell and query active version maps to verify paths:
    ```bash
    node -v
    npm -v
    ```

### 2. Version Control & Recommended IDE Stack
*   **Version Control Protocol:** [Git SCM Software Suite](https://git-scm.com) for system branch sync loops and framework tracking.
*   **Primary Development IDE:** [Visual Studio Code](https://visualstudio.com).
*   **Essential VS Code Extensions:**
    *   `Prettier - Code formatter` & `ESLint` (Maintains layout component parity profiles).
    *   `Espressif ESP-IDF Extension` (Provides low-level serial trace telemetry tools).

### 3. Silicon Target Platform & Compiler Framework
*   **Target Development Board Kit:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B *(Defaults to locked 1024×600 viewport canvas space)*.
*   **Microcontroller SDK Target:** [Espressif ESP-IDF Toolchain Core v5.5.4+](https://espressif.com).

---

## 📦 Workspace Installation & Environment Cloning

### Step 1: Clone the Project Repository Tree
Open your target command terminal environment and run the workspace retrieval block:

```bash
git clone https://github.com
```

> ⚠️ **CRITICAL DIRECTORY MAPPING RULE:** To guarantee background compiler execution hooks and path parameters resolve perfectly, you must clone the workspace into this precise root partition folder track: `C:\ForgeUI\Projects\esp32p4-ui-studio`

### Step 2: Bootstrap the UI Studio Node Modules
Navigate directly into the canvas rendering interface subdirectory path and trigger the package compilation sequence:

```bash
cd studio
npm install
```
*This resolves front-end dependencies, Chakra UI libraries, and parsing elements. Run cycles can take several minutes on your initial execution pass.*

---

## 🔄 Live Toolchain Execution & Background Daemon Control

ForgeUI Studio runs automated processes in the background to handle data synchronization across the runtime shell instantly.

### 🏁 1. Booting the Interactive Visual Canvas
To fire up the visual design system, locate the workspace root folder and run this automation script file:

```text
START_FORGEUI_STUDIO_HIDDEN.vbs
```

**What this script handles automatically:**
1. Spins up the background React web host loop.
2. Registers file-system change listeners for instant canvas-to-C code synchronization.
3. Spawns your operating system's default internet browser panel locked to the interface console:
   ```text
   http://localhost:3000
   ```

### 🛑 2. Graceful Workspace Environment Teardown
> ⚠️ **CRITICAL DEVELOPER PROCESS RULE:** Do not simply close your browser window when you finish an interface editing session! This leaves background Node threads running, blocking connection port definitions. Do not re-run the initialization script while processes remain alive.

To clear active workspace processes cleanly, return to your project root folder directory and trigger this utility:

```text
STOP_FORGEUI_STUDIO.bat
```
*This completely removes active `node.exe` engine allocations, clears local server sockets, and purges the file-watching loops securely.*

---

## 📂 Repository Architecture & File Hierarchy

```text
esp32p4-ui-studio/
├── studio/                             # Visual IDE Frontend, Browser Canvas Grid, & LVGL C Code Generator
├── firmware/
│   └── ForgeUI-One/                    # ESP-IDF Embedded Firmware Template Shell (Drivers, BSP, UI Inject Points)
├── exports/                            # Out-of-the-box Independent, Standalone Decoupled ESP-IDF Project Snapshots
├── tools/                              # Automated Compile, Clean, Flash, and Project Packaging Utilities
├── docs/                               # Internal Platform Documentation, Architecture Rules, & Technical Specs
│   └── history/                        # Historical Database Save Points and Migration Trace Profiles
├── START_FORGEUI_STUDIO.bat            # Standard Interactive Foreground UI Terminal Script
├── START_FORGEUI_STUDIO_HIDDEN.vbs     # Optimized Background Daemon Service & Export Bridge Initialization Hook
├── STOP_FORGEUI_STUDIO.bat             # Graceful Developer Thread Cleanup and Process Purge Utility
├── README.md                           # Public Component Overview & Developer Presentation Manifesto
├── LICENSE                             # Primary Open Source Software License Manifesto
├── THIRD_PARTY_LICENSES.md             # Upstream Framework Dependencies & Licensing Profiles
└── 01_SPINE.md                         # Core Architecture Spine and System Truth Reference
```

---

## 🚀 Validated Feature Status Matrix

The following operational pipelines are verified functional across physical hardware validation checks:

*   **Canvas Grid Lock Constraints:** Enforces hard boundary checking locked to the target Waveshare 1024×600 canvas framework.
*   **Coordinate Generation Execution:** Precision absolute X/Y coordinate placement data arrays map correctly to hardware pixel matrices.
*   **Instant Pipeline Code Sync:** Real-time visual panel additions trigger direct file updates on the target disk space.
*   **Decoupled Standalone Exports:** Independent export projects extract cleanly, passing isolated `Full Clean → Rebuild → Flash` passes inside VS Code.
*   **File-Write Crash Interventions:** Built-in collision defenses isolate project save points, blocking unexpected system overwrite cycles.
*   **Hardware Baseline Verification:** Verified loop functionality across: **Web Canvas Layout ➔ Live Preview Simulation ➔ Pure C Asset Export ➔ Flash Command Execution ➔ Physical Display Execution**.

---

## 📜 Upstream Software Licensing and Open Source Attribution

ForgeUI Studio is developed as a heavily customized, embedded hardware-focused fork of the open-source user interface parser engine originally designed by **Premier Octet** (OpenChakra ecosystem).

This platform thoroughly redesigns, overhauls, and extends the visual canvas layout logic to handle static embedded low-level C component arrays, peripheral device control registers, and memory tracking pipelines mapped explicitly to **LVGL v9** and the **ESP32-P4** architecture. All upstream MIT license parameters, copyright flags, and framework credits are preserved within this workspace.

---
**Core Platform Architect:** Scott Forster | ForgeUI Project  
**Repository Access Portal:** [GitHub Repository Interface](https://github.com)
