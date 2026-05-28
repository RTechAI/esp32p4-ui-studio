# 🛠️ ForgeUI Studio

[![GitHub License](https://shields.io)](LICENSE)
[![ESP32-P4 Compliant](https://shields.io)](https://espressif.com)
[![LVGL Version](https://shields.io)](https://lvgl.io)
[![ESP-IDF Version](https://shields.io)](https://github.com)

An open-source **Visual UI Designer, Low-Code HMI Layout Engine, and Automated Firmware Deployment Studio** engineered specifically for the **Espressif ESP32-P4** touchscreen architecture running **LVGL v9** and **ESP-IDF**.

ForgeUI Studio bridges the gap between browser-based UI prototyping and production-grade microcontroller deployment. It eliminates manual pixel-coordinate calculations, allowing systems engineers, IoT developers, and UX designers to build responsive interfaces visually and deploy them instantly.

---

## ⚡ Key Architectural Advancement: Decoupled ESP-IDF Export

ForgeUI Studio supports exporting **fully standalone, decoupled ESP-IDF firmware projects** directly from the visual design environment. Your generated graphics layout becomes completely independent of the studio framework.

### 📦 Portable & Portable Project Ecosystem
*   **Zero Framework Lock-in:** Open exported project bundles directly inside **Visual Studio Code (VS Code)** with the official ESP-IDF extension.
*   **Clean Rebuilds:** Code artifacts compile completely independently from the original studio engine from a pristine state.
*   **Lightweight Firmware Footprint:** The studio generation pipeline injects only two pure C files (`90_Studio_Export.c` and `90_Studio_Export.h`) into the underlying runtime shell, ensuring absolute lifecycle stability.

### 🔄 Proven Runtime Export Pipeline

```text
  [ ForgeUI Studio Canvas ]
             │
             ▼
  [ Generate Native LVGL Runtime ]
             │
             ▼
  [ Export Standalone ESP-IDF Project ] ──> (Shareable/Portable Folder Structure)
             │
             ▼
  [ Open Independently in VS Code ]
             │
             ▼
  [ Run: idf.py reconfigure & build ]
             │
             ▼
  [ Flash Over USB Native Toolchain ]
             │
             ▼
  [ Successful Bare-Metal Boot on ESP32-P4 ]
```

---

## 🚀 Core Features & Technical Capabilities

*   **WYSIWYG Browser Preview Layouts:** Real-time layout rendering engine before running heavy local compiler toolchains.
*   **Preview-to-P4 Pixel Parity:** Eliminates visual layout scaling discrepancies between the web design grid and physical LCD panels.
*   **Automated C Code Generator:** Transpiles visual layout structures and interaction states into highly performant static assets.
*   **Integrated Flashing Utilities:** Single-click browser/app upload engines push compiled binaries directly through Web Serial hooks.
*   **Hardware-Aware Theme Tokens:** Syncs unified semantic styling contracts across development (`bg`, `surface`, `border`, `text`, `accent`).
*   **Immediate Touch Telemetry Execution:** Visualized interface nodes respond natively to capacitive touch signals instantly upon hardware boot.

---

## 💻 Primary Hardware Specifications & Validation

Out-of-the-box system profiles are pre-calibrated to deliver immediate compatibility with high-performance evaluation configurations:

*   **Target Microcontroller:** Espressif ESP32-P4 (High-Performance Dual-Core RISC-V SoC).
*   **Validated Development Kit:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B.
*   **Physical Panel Constraints:** 1024x600 high-resolution MIPI-DSI display with capacitive multi-touch tracking.
*   **Embedded Graphics Stack:** LVGL v9 Graphics Engine.
*   **Microcontroller SDK Baseline:** Espressif ESP-IDF v5.5.4 (or newer).

### ✅ Proven Export Validation Metrics
*   **Target MCU:** `esp32p4`
*   **SDK Core:** `ESP-IDF v5.5.4`
*   **Communication Mode:** Direct `UART` / JTAG
*   **Validation Pipeline:** `Full Clean → Rebuild → Flash`
*   **Standalone Build Verification Status:** SUCCESSFUL / VERIFIED

---

## 🎨 Mapped LVGL v9 Components & Themes

### Supported Core Layout Widgets
The layout compiler pipeline guarantees map fidelity across **Canvas ➔ Preview ➔ C Code ➔ ESP32-P4 Panel Screen**:
*   **Typography & Structure:** Text Fields, Box Containers, Image Asset Placeholders.
*   **Actionable Elements:** Interactive Buttons, Responsive Sliders, Toggle Switches, Checkboxes, Radio Selection Nodes.
*   **Data Input Components:** Textarea Blocks, NumberInput Adjusters, Dropdown Select Lists.
*   **Real-time Status Monitors:** Progress Bars, Circular Progress Loading Indicators.

### Built-in Embedded Aesthetic Profiles
The ecosystem contains 15 pre-configured UI styles matching specific application use cases:
*   *Matrix Green (System Default)*, Reactor Dark, Graphite, Nordic Blue, Military Green, Cyber Teal, Forge Orange, Nebula Purple, OLED Black, Carbon Red, Arctic Ice, Industrial Steel, Lava Core, Blueprint, and Toxic Lime.

---

## 🏢 Targeted Enterprise & HMI Use Cases

ForgeUI Studio is highly optimized to accelerate industrial development tracks:
*   **Industrial HMI Panels** & Machinery Automation Control Systems.
*   **IoT Embedded Dashboards** & Smart Home Infrastructure Display Hubs.
*   **Medical Equipment User Interfaces** & Laboratory Monitoring Panels.
*   **Interactive Digital Kiosks** & Public Vending Machine Controllers.
*   **Automotive Digital Clusters** & Fleet Telematics Prototyping.

---

## 🤝 Open Source Licensing & Credits

**ForgeUI Studio** is an advanced, hardware-adapted fork of the open-source editor engine originally developed by *Premier Octet*. 

This workspace completely refactors the core visual canvas mechanics to target embedded touchscreen layouts, low-level ESP32-P4 registers, and optimized static code generation blocks. The upstream MIT license models and author attributions are strictly maintained inside this repository.

---

### Project Maintainer
**Scott Forster** | ForgeUI Project  
📧 Email: [forgeui.esp32@gmail.com](mailto:forgeui.esp32@gmail.com)
