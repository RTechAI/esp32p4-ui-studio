# ForgeUI Studio Architecture: ESP32-P4 UI Developer Save Point & Milestone Log

## 📌 Architectural Save Point Meta-Tag
```text
FORGEUI_HEADING_WIDGET_COMPLETE__PREVIEW_EXPORT_P4_FONT_PIPELINE_PROVEN__NEXT_SIDEBAR_AUDIT__2026-06-19
```

---

## 🛠️ Project Definition (Repository SEO Summary)

**ForgeUI Studio** is an open-source visual Human-Machine Interface (**HMI**) designer, graphical **LVGL v9** code generator, embedded asset pipeline, theme manager, and automated **ESP-IDF flash workflow** custom-built for high-performance **ESP32-P4 microcontrollers**.

It bridges browser-based drag-and-drop UI design with native embedded **LVGL C export** and physical ESP32-P4 silicon validation.

### Core Hardware & Software Target Specs
* **Hardware Evaluation Board:** Waveshare ESP32-P4-WIFI6-Touch-LCD-7B
* **Display Interface:** High-speed MIPI-DSI LCD Panel
* **Touch Controller Component:** GT911 Capacitive Touch
* **Native Framebuffer Resolution:** 1024x600 pixels
* **Graphics Framework:** LVGL v9.2.2 Engine
* **Development SDK:** Espressif ESP-IDF v5.5.x

---

## 🎯 System Status: PROVEN

ForgeUI Studio has successfully achieved compilation and flashing over physical ESP32-P4 silicon. The end-to-end HMI pipeline validates fully from browser to display panel:

```text
ForgeUI Studio Builder (React)
    ↓ [Browser Canvas Preview]
LVGL C Code Generation (TypeScript Export)
    ↓ [ESP-IDF Compilation & GCC Toolchain]
Firmware Binary Flashing
    ↓ [MIPI-DSI / GT911 Touch Layer]
Physical ESP32-P4 System Rendering
```

---

## 💎 Feature Milestone: Heading Widget & Font Pipeline

The `Heading` widget is fully operational and verified. It successfully bridges web-rendered CSS text sizing layouts into embedded C fonts.

### Heading Font Pipeline Technical Architecture
A font size discrepancy naturally exists between browser rendering contexts and embedded hardware:
* **Browser Canvas CSS:** `font-size: 32px`
* **Embedded LVGL Context:** `lv_font_montserrat_32`

To guarantee compiling integrity without breaking runtime assets, the underlying Montserrat font pipeline must match.

### Required `sdkconfig` & `sdkconfig.defaults` Configuration
The following parameters are hard-coded into `firmware/ForgeUI-One/` to expose larger typography scales:
```ini
CONFIG_LV_FONT_MONTSERRAT_28=y
CONFIG_LV_FONT_MONTSERRAT_30=y
CONFIG_LV_FONT_MONTSERRAT_32=y
CONFIG_LV_FONT_MONTSERRAT_36=y
CONFIG_LV_FONT_MONTSERRAT_40=y
CONFIG_LV_FONT_MONTSERRAT_48=y
```

### Verified Pipeline Features
* **Heading Widget UI:** Rendered on Sidebar and canvas layout.
* **Code Export:** Translates elements into compliant `lv_label` blocks.
* **Firmware Validation:** Successfully builds, flashes, and displays on the 7-inch hardware target.

---

## 📦 Verified HMI Widget Ecosystem

### Core Layout & Form UI Components
`Button` | `Text` | `Heading` | `Input` | `Textarea` | `Switch` | `Checkbox` | `Radio` | `Slider` | `Progress` | `CircularProgress` | `NumberInput` | `Select` | `Image` | `Box`

### Embedded LVGL Graphic Objects
`Led` | `Bar` | `Arc` | `Chart` | `Table` | `Calendar` | `Scale` | `Roller` | `Msgbox` | `ButtonMatrix` | `Canvas` | `Line` | `Tabview` | `Tileview`

---

## 🎨 Theme & Asset Pipelines (Single Source of Truth)

### Unified Theme Architecture
To prevent structural variations or visual runtime drift, all visual styles flow down strictly in a unidirectional manner:

```text
FG_PREVIEW_PALETTES (forgeThemeMap.ts)
        ↓
Theme Manager System
        ↓
ForgeThemeContext Hook
        ↓
Visual Builder UI / Browser Preview
        ↓
ForgeUILvglExport.ts Engine
        ↓
Generated UI C Code
        ↓
ESP32-P4 Display Panel
```

> ⚠️ **Critical Pipeline Constraint:** Never replicate `FG_PALETTES`. Do not generate auxiliary theme selectors. Keep browser environments and firmware theme layers completely unified.

### Image Asset Compilation Process
```text
Uploaded Image UI Asset
    ↓ [Studio Asset Manager UI]
LVGLImage.py Script Engine
    ↓ [C-Array Binary Generation]
firmware/ForgeUI-One/main/assets/uploads/
    ↓ [CMake Injection & Asset Registry Mapping]
LV_IMAGE_DECLARE(...) Macromapping
    ↓ [lv_image_set_src Execution]
ESP32-P4 Flash Output
```

---

## 🗺️ Engineering Directory Touch-Map

When extending or updating features within the project structure, locate codebases according to this file mapping:

### 🌟 Theme Modifiers
* **Scope:** Theme dictionaries and color maps.
* **Target File:** `studio/src/forgeui/preview/forgeThemeMap.ts`

### 🌟 Custom Widget Registrations
* **Scope:** Defining UI components, editing canvas preview, and creating LVGL code exporters.
* **Target Files:**
  * `studio/src/forgeui/ForgeUIWidgetSet.ts`
  * `studio/src/components/editor/ComponentPreview.tsx`
  * `studio/src/forgeui/ForgeUILvglExport.ts`

### 🌟 Embedded Typography Scales
* **Scope:** Modifying sdkconfig profiles.
* **Target Files:**
  * `firmware/ForgeUI-One/sdkconfig`
  * `firmware/ForgeUI-One/sdkconfig.defaults`

### 🌟 Image Assets & Layout Pipelines
* **Scope:** Modifying runtime image upload schemas or custom asset generation.
* **Target Files:**
  * `studio/src/forgeui/assets/ForgeUIAssetManager.tsx`
  * `studio/src/forgeui/ForgeUIUploadedAssetRegistry.ts`
  * `tools/lvgl/LVGLImage.py`

---

## 🔍 Sidebar Component Audit Strategy
* **Current Mission Identifier:** `FORGEUI_SIDEBAR_AUDIT_CONTINUE`
* **Objective:** Streamline the HMI sidebar workspace. Safely remove legacy web layout elements (inherited from OpenChakra) that do not directly translate to optimized MCU or micro-controller memory limits.
* **Component Classification Values:** `KEEP` (Embedded Core UI asset) | `ALIVE` (Active Preview component)
