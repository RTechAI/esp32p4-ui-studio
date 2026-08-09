# ForgeUI One

Lightweight LVGL v9 starter framework and ESP-IDF runtime baseline for ESP32-P4 hardware.

ForgeUI One provides a clean, hardware-proven embedded UI starting point for developers building touchscreen projects using **ESP-IDF** and **LVGL v9**.

Current validated target hardware:

* Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

Hardware Example 04 — Online Weather is **PROVEN / CLOSED** on that stock board and stock C6 through the real Studio Build & Flash path. Its ten runtime Weather backgrounds and required generated Fi icons follow the normal dependency-driven asset/export lifecycle.

---

# Overview

ForgeUI One is intentionally designed as a minimal, stable, reusable ESP32-P4 runtime foundation.

The goal is simple:

```text
boot fast
stay clean
stay readable
provide a stable starting point
```

ForgeUI One intentionally strips away large demo complexity and focuses on:

* clean startup
* stable display bring-up
* touch integration
* LVGL v9 runtime stability
* simple UI structure
* reusable architecture
* fast experimentation
* readable project layout
* hardware-proven runtime behavior

---

# Current Features

Current ForgeUI One runtime baseline includes:

* LVGL v9 runtime
* display operational
* touch operational
* single-page UI shell
* clean starter home screen
* modular source structure
* ESP-IDF integration
* Waveshare BSP integration
* generated UI insertion path
* Studio export compatibility
* hardware-tested runtime pipeline

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

* ESP-IDF project structure
* LVGL runtime lifecycle
* BSP integration
* display/touch/audio setup
* runtime application shell
* generated UI insertion points

The visual editor and export pipeline are intentionally separated from the firmware runtime.

---

# Design Philosophy

ForgeUI One favors:

* simplicity
* readability
* maintainability
* rapid experimentation
* fast hardware bring-up
* clean foundations
* modular runtime ownership

ForgeUI One intentionally avoids:

* bloated demo systems
* tangled runtime ownership
* unnecessary abstraction layers
* hidden framework behavior
* oversized UI architectures

---

# Target Use Cases

ForgeUI One is intended for:

* new ESP32-P4 projects
* LVGL learning
* touchscreen experiments
* kiosk concepts
* embedded product ideas
* UI prototypes
* games
* proof-of-concept firmware
* hardware testing
* rapid prototyping
* generated Studio runtime targets

---

# Hardware Support

Current proven hardware support:

* ESP32-P4
* EK79007 display
* GT911 touch
* Waveshare ESP32-P4-WIFI6-Touch-LCD-7B

---

# Software Stack

Built using:

* ESP-IDF v5.5.x
* LVGL v9
* Waveshare BSP ecosystem
* Espressif managed components

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

* ESP-IDF
* LVGL
* Waveshare BSP components

Please review:

* LICENSE
* THIRD_PARTY_LICENSES.md

---

# Developed By

Scott Forster
ForgeUI Project

📧 Contact:
[forgeui.esp32@gmail.com](mailto:forgeui.esp32@gmail.com)
