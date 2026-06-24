# 🛠️ SPINE: ForgeUI Studio (`esp32p4-ui-studio`)

## 📌 Current Save Point
```text
FORGEUI_ICON_LIBRARY_V1__REACT_ICON_TO_LVGL_ASSET_SCALING_P4_PROVEN__2026-06-24
```

---

# 📈 Project Status

```text
STATUS: ACTIVE | STABLE | END-TO-END PHYSICAL HARDWARE PROVEN
TARGET HARDWARE SOC: Espressif ESP32-P4 (Dual-Core RISC-V @ 360MHz Engine)
TARGET HARDWARE LCD: Waveshare ESP32-P4-WiFi6-Touch-LCD-7B (1024x600 MIPI-DSI / GT911 Touch Controller)
NATIVE CORE GRAPHICS: Light and Versatile Graphics Library (LVGL v9.2.2) + ESP-IDF v5.5.4 Toolchain
```

### Verified Hardware Pipeline Flow
```text
Visual Studio Builder ➔ Local Browser Preview ➔ Local Asset & Script Exporter ➔ 
Decoupled Native C Source ➔ ESP-IDF Ninja Compiler (-O3) ➔ Bare-Metal ESP32-P4 Flash Execution
```

---

# 🧱 Current Architecture Truth

## 🎨 Asset Pipeline (9,514 Icons Integration)
```text
Icon Browser ➔ React Icon Selection ➔ renderToStaticMarkup() ➔ SVG Vector ➔ Canvas Rasterization ➔ 
PNG Asset ➔ Asset Manager Interface ➔ LVGLImage.py ➔ Generated C Asset (ARGB8888) ➔ LVGL Export ➔ ESP32-P4 Flash
```
*   **Non-Negotiable Pipeline Rule:** Do not create a second icon export pipeline. Do not bypass the Asset Manager. Raw PNG remains the strict, non-negotiable input format for `LVGLImage.py` processing loops.
*   **Pipeline Parity:** `Icon Browser ➔ Search ➔ Visual Browser ➔ Multi-Select ➔ Selected Asset Tray ➔ Canvas Render ➔ Preview Render ➔ PNG Generation ➔ LVGLImage.py Conversion ➔ Generated C Assets ➔ ESP-IDF Build ➔ Physical Hardware Flash` are 100% verified with absolute Image Scaling Correctness.

## 🎨 Theme Pipeline (Theme Manager V2)
```text
FG_PREVIEW_PALETTES (25+ Industrial Presets) ➔ Theme Manager ➔ ForgeThemeContext ➔ Studio Builder ➔ Preview ➔ Export ➔ ESP32-P4
```
*   **Non-Negotiable Theme Rule:** `FG_PREVIEW_PALETTES` remains the only source of truth. Do not create duplicate theme systems, maps, trackers, or selectors. 
*   **Ecosystem Parity:** Theme Selection, Theme Persistence, Preview Parity, Export Parity, and Physical P4 Parity are locked down across high-contrast Texture Backgrounds and design templates.

## ⚙️ Runtime Systems & Architecture Rules
```text
Runtime Driver owns Truth ➔ Component Widget owns Display ➔ LVGL Timer owns Refresh ➔ Studio UI owns Neither
```
### 1. High-Accuracy RTC Runtime
*   **Flow:** `20_RTC ➔ Clock Widget`
*   **Ownership Layer:** RTC driver owns time truth variables. The Clock component widget owns display rendering only. The native LVGL timer handles task refresh intervals. Do not rebuild RTC loops.

### 2. Asynchronous Wi-Fi Runtime
*   **Flow:** `30_WIFI ➔ WiFi Widget`
*   **Ownership Layer:** `30_WIFI` driver owns network truth registers. The Wi-Fi widget component handles text state display mapping only. The native LVGL timer handles task refresh loops. Do not rebuild Wi-Fi loops.

---

# 🎛️ Component Manifest & Device Status

## 🧩 Core Primitives (`Builder` ✓ | `Preview` ✓ | `Export` ✓ | `ESP32-P4 Hardware` ✓)
```text
Button, Text, Heading, Input, Textarea, Switch, Checkbox, Radio, Slider, Progress, CircularProgress, NumberInput, Select, Image, Box, Icon, IconButton
```

## 📊 Advanced LVGL Widgets (`Builder` ✓ | `Preview` ✓ | `Export` ✓ | `ESP32-P4 Hardware` ✓)
```text
Led, Bar, Arc, Chart, Calendar, Keyboard, Scale, Table, Roller, Msgbox, ButtonMatrix, Canvas, Line, Tabview, Tileview, Keyboard, AnimImage
```

## ⏱️ Runtime Dashboard Components (`Builder` ✓ | `Preview` ✓ | `Export` ✓ | `PHYSICAL P4 PROVEN` ✓)
```text
Clock (Synchronized local RTC tracking) | WiFi (Asynchronous non-blocking network state pump)
```

---

# 🧠 AI Playground V1 Specification

```text
AI suggests ➔ ForgeUI validates ➔ Builder owns layout ➔ Preview owns preview ➔ Export owns LVGL generation
AI does not write firmware. AI does not generate React. AI does not generate raw LVGL. 
AI generates standardized ForgeUI schema layout document objects ONLY.
```

### Input Processing Architecture
```text
Template Library / LLM Suggestion ➔ Layout Document Model ➔ JSON Editor Panel ➔ 
JSON.parse() ➔ validateAiLayout() ➔ insertAiLayout() ➔ ForgeUI Store ➔ Studio Canvas
```
*   **Ecosystem Validation:** Layout Document Metadata Support, Multi-Component Layouts, Schema Parsing, and Registry Binding are verified. Invalid component schemas are rejected before insertion.
*   **🤖 OpenAI Integration Status: PAUSED** (Deferred until deployment onto dedicated home development laptop. No active OpenAI communication layer required for current ForgeUI progress targets).

---

# 🛠️ Build & Flashing Pipeline

*   **Verified Features:** `Export Project ➔ Build & Flash ➔ Clean Build & Flash ➔ Detached Export ➔ ESP-IDF Reconfigure ➔ Physical Hardware Flash`.
*   **Low-Level Memory Infrastructure:** Injects a custom `partitions.csv` matrix mapping an **8MB Factory App Partition Slot** (`0x10000, 8M`) alongside a **7MB Storage SPIFFS Partition Block** (`0x810000, 7M`) directly into the decoupled project folder configuration targets.

---

# 🎯 Active Mission Profiles

## 🏁 Current Active Mission
```text
FORGEUI_THEME_SYSTEM_V2__BACKGROUND_AND_WIDGET_POLISH__2026-06-24
```
*   **Exploration Objectives:** Theme usability, widget text readability, background texture aesthetic quality, theme identity consistency, and visual builder interface style tuning.

## 🚀 Current Next Mission
```text
FORGEUI_THEME_SHOWCASE_V1__DASHBOARD_PROOF_AND_THEME_AUDIT_NEXT
```
*   **Target Milestones:** Design representative interface dashboard layouts, evaluate all major built-in ForgeUI theme palleted presets, identify the strongest out-of-the-box default theme, and audit comprehensive widget text contrast profiles across various background mesh styles.

---

# 🛑 Global Non-Negotiable Rules
1.  **Do not rebuild RTC blocks.**
2.  **Do not rebuild Wi-Fi driver routines.**
3.  **Do not create duplicate theme engines.**
4.  **Do not create duplicate background or runtime loops.**
5.  **Do not bypass the Visual Builder canvas store.**
6.  **Do not bypass the Standalone Code Exporter pipeline.**
7.  **Do not create a second graphic asset pipeline.**
8.  **Extend proven, bare-metal hardware systems strictly.**
9.  **Preserve the immutable pipeline chain configuration maps:**
    `Builder ➔ Local Preview ➔ Standalone C/C++ Export ➔ Native ESP32-P4 Serial Flash`
