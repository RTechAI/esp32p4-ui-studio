# 🗺️ ForgeUI Studio Engine Architecture & Index Directory (SPINE)

This document maps out the system boundaries, interface structures, and hardware abstraction layer paths for **ESP32-P4 Studio** (ForgeUI). It serves as the primary technical directory for developers, system parsers, and automated code-indexing engines.

---

## 🏗️ Structural System Blueprint

```text
       [ STUDIO VISUAL WORKSPACE ] 
                    │ (React / Next.js State Tree)
                    ▼
     [ studio/src/forgeui/preview/ ]
   Exclusive Single-Source-of-Truth Theme Map
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
[LOCAL VIEWPORT]         [CODE TRANSLATION ENGINE]
(Browser Canvas)         (studio/src/forgeui/ForgeUILvglExport.ts)
                                 │
                                 ▼
                     [tools/lvgl/LVGLImage.py]
                    Automated ARGB8888 Image Packer
                                 │
                                 ▼
                    [FIRMWARE RUNTIME SHELL]
                   (firmware/ForgeUI-One/main/)
                                 │
                                 ▼
                    [TARGET MCU RUNTIME DEVICE]
             (Physical Waveshare ESP32-P4 7B Panel)
```

---

## 🗂️ Core Index Directory & Code Registries..

| Source Pathway | Functional Responsibility Layer | Structural Targets & Assets |
| :--- | :--- | :--- |
| `studio/src/forgeui/` | Visual Workspace UI Core | Orchestrates component trees, positioning metrics, drag-and-drop actions, and active workspace themes. |
| `studio/src/forgeui/preview/` | Theme Truth Single-Source Module | Maps `FG_PREVIEW_PALETTES` directly to the workspace viewports to eliminate palette sync errors. |
| `tools/lvgl/LVGLImage.py` | Local Image Compilers & Assets Pipeline | Uses `pypng` and `lz4` to process local graphics files into raw uncompressed/compressed hardware bytes. |
| `firmware/ForgeUI-One/` | Bare-Metal ESP-IDF Microcontroller Runtime | Controls low-level MIPI-DSI, GT911 touch matrices, FreeRTOS multi-core tasks, and executes generated UI files. |
| `C:\ForgeUI-Exports\` | Detached Target Project Generation Target | Output location for fully portable, decoupled, pristine ESP-IDF code trees ready for VS Code compilation. |

---

## 🚀 Native Environment Entry Points

| Automated Script Module | Target Runtime Environment | Operational Deployment Task |
| :--- | :--- | :--- |
| `START_FORGEUI_STUDIO.bat` | Windows Shell Engine | Initializes local node runtime dependencies and provisions frontend canvas instances. |
| `START_FORGEUI_STUDIO_HIDDEN.vbs` | Windows Scripting Host | Spins up background compilation processes silently without spawning floating terminal alerts. |
| `STOP_FORGEUI_STUDIO.bat` | Windows Terminate Utilities | Purges running toolchain memory allocations and drops active background ports safely. |

---

## 🔄 Verified Compilation & Integration Lifecycles

### Dynamic Image Extraction & Asset Ingestion Path
1. **Asset Register Ingestion:** Imagery is dropped into the Studio UI Layer workspace environment.
2. **Local Processing Execution:** The dashboard runs the python transpiler utility (`tools/lvgl/LVGLImage.py`).
3. **Array Generation & Injection:** Automated builders output hardware arrays, inject custom bindings (`LV_IMAGE_DECLARE`), rewrite underlying `CMakeLists.txt` build rules, and link assets directly to `lv_image_set_src()`.
4. **Binary Target Compile:** Your local compiler builds the package natively using standard `idf.py` execution rules without using external cloud wrappers.

### Unified Single-Source Theme Propagation
1. **Module Registry Modification:** Changing active layouts triggers internal state modifications via `forgeThemeMap.ts`.
2. **Synchronized Distribution:** The data translates from the visual preview grid down to the core engine translation systems.
3. **Native Representation Array:** Code components match the visual setup perfectly, completely removing theme translation errors on your physical ESP32-P4 screen layout.
