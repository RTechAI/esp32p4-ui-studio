# ForgeUI One

Hardware-proven LVGL v9 runtime baseline for ESP32-P4 hardware.

ForgeUI One provides a clean, modular, reusable embedded UI foundation for developers building real ESP32-P4 touchscreen products using LVGL and ESP-IDF.

Current validated target hardware:

- Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

---

# Overview

ForgeUI One removes much of the painful low-level ESP32-P4 bring-up stage by already integrating:

- EK79007 MIPI-DSI display support
- GT911 capacitive touch support
- ESP-Hosted WiFi
- ESP32-C6 remote WiFi transport
- optional per-project DS3231 RTC integration with software/NVS fallback
- SD card support
- LVGL v9 runtime
- modular UI architecture
- keyboard overlays
- configurable feature system
- clean ownership boundaries
- reusable runtime structure

The goal is simple:

```text
boot fast
stay stable
stay readable
provide a reusable embedded foundation
```

---

# Design Philosophy

ForgeUI One intentionally avoids demo-driven runtime architecture and instead focuses on:

- stable hardware bring-up
- clean module ownership
- reusable embedded UI patterns
- safe LVGL runtime rules
- maintainable firmware architecture
- readable project structure
- real-world ESP32-P4 integration

ForgeUI One favors:

- clarity
- stability
- maintainability
- reusable architecture
- hardware-proven workflows
- readable embedded structure

---

# Core Architecture Rules

- `main.c` owns boot order only
- backends own system truth
- UI renders state only
- no unsafe async LVGL calls
- modular compile-time feature control
- no hidden subsystem ownership
- no demo-driven runtime coupling
- safe backend/UI separation

These rules exist to maintain long-term runtime stability and prevent hidden ownership conflicts between UI and hardware systems.

---

# Current Proven Features

Current proven ForgeUI One baseline includes:

- display operational
- touch operational
- LVGL v9 operational
- hosted WiFi operational
- WiFi scan/connect/disconnect
- RTC persistence
- physically proven optional DS3231 RTC integration at I2C `0x68`, with software/NVS fallback
- audio subsystem support
- SD card support
- keyboard overlay system
- modular UI foundation
- theme foundation
- status drawer architecture
- single-page UI baseline
- modular multi-page UI baseline

---

# Runtime Role Inside ESP32-P4 UI Studio

ForgeUI One now operates as the firmware/runtime layer inside the larger:

```text
ESP32-P4 UI Studio
```

toolchain ecosystem.

Architecturally:

```text
Studio
→ generates LVGL artifacts

ForgeUI One
→ compiles and executes LVGL artifacts

ESP32-P4 hardware
→ renders the live interface
```

ForgeUI One intentionally owns:

- ESP-IDF project structure
- LVGL runtime lifecycle
- BSP integration
- display/touch/audio setup
- runtime application shell
- generated UI insertion points

The visual editor and deployment tooling remain intentionally separated from the embedded runtime.

---

# Target Use Cases

ForgeUI One is designed as a clean starting point for:

- embedded products
- ESP32-P4 experimentation
- LVGL projects
- touchscreen appliances
- dashboards
- games
- kiosk systems
- hardware prototypes
- commercial firmware platforms
- product development platforms
- embedded HMI systems

---

# Software Stack

Built using:

- ESP-IDF v5.5.x
- LVGL v9
- ESP-Hosted
- esp_wifi_remote
- Waveshare BSP ecosystem
- Espressif managed components

---

# Hardware Support

Current proven hardware support includes:

- ESP32-P4
- ESP32-C6 Hosted WiFi
- EK79007 display controller
- GT911 touch controller
- optional DS3231 RTC (enabled or disabled per project hardware profile)
- SD card support
- audio subsystem support

Configure External RTC at **ForgeUI Studio → Board: ESP32-P4 7B → Configure Hardware → Hardware Configuration → Optional Hardware → External RTC**. `firmwareFeatures.rtc` is the authoritative persisted setting for Live Studio and Standalone Export and is not a runtime System-menu option. Enabled mode retains DS3231 and fallback support. Disabled mode generates `FG_FEATURE_RTC 0`, performs no DS3231 hardware access and continues with software/NVS time. Legacy projects missing the setting normalize to enabled.

---

# Project Structure

Current runtime structure:

```text
ForgeUI-One/
├── main/
├── managed_components/
├── CMakeLists.txt
├── sdkconfig
└── README.md
```

Important runtime files include:

```text
main/01_FG_HMI.c
main/02_UI_Home.c
main/14_UI_Header.c
main/90_Studio_Export.c
main/90_Studio_Export.h
```

---

# ESP32-P4 UI Studio Integration

ForgeUI One supports direct export integration from:

```text
ESP32-P4 UI Studio
```

Generated UI files are automatically injected into:

```text
main/90_Studio_Export.c
main/90_Studio_Export.h
```

The runtime then compiles and renders the generated LVGL interface directly on hardware.

This workflow has now been physically validated on real ESP32-P4 hardware.

---

# Quick Start

Set target:

```bash
idf.py set-target esp32p4
```

Build:

```bash
idf.py build
```

Flash:

```bash
idf.py flash monitor
```

---

# Current Status

Status:

```text
ALIVE / ACTIVE DEVELOPMENT
```

Current milestone:

```text
Studio → Runtime → Hardware deployment pipeline proven
```

ForgeUI One now acts as the embedded execution layer for generated LVGL interfaces coming from the ESP32-P4 UI Studio workflow.

---

# License

ForgeUI One includes components and dependencies licensed under their respective open-source licenses.

Key integrated technologies include:

- ESP-IDF
- LVGL
- Waveshare BSP components

Please review:

- LICENSE
- THIRD_PARTY_LICENSES.md

---

# Developed By

Scott Forster  
ForgeUI Project

📧 Contact:
forgeui.esp32@gmail.com

---

Powered by ForgeUI.
