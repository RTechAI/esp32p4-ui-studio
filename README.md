# 🛠️ ForgeUI Studio

**ForgeUI Studio is an open-source, AI-assisted visual embedded HMI Studio for ESP32-P4.** It combines drag-and-drop design, natural-language layout generation, native LVGL asset conversion, reusable Interactive Assets, generated firmware APIs, and standalone ESP-IDF export.

ForgeUI converts visual designs and natural-language ideas into native LVGL C that compiles inside ESP-IDF. The Interactive Asset Framework includes momentary Button input, persistent Toggle Switch input, and the shared Light/Status Indicator Binary Output Runtime.

Current proven milestone:

```text
FORGEUI_INTERACTIVE_ASSET_FRAMEWORK_V3__INPUT_RUNTIME__BUTTON__TOGGLE_SWITCH__BINARY_OUTPUT_RUNTIME__LIGHT__STATUS_INDICATOR
```

> **Build it. Prove it. Flash it. Improve it. Repeat.**

If ForgeUI helps your embedded work, consider leaving the project a GitHub star.

---

## ⚡ Core value proposition

ForgeUI brings the interface workflow into one Studio:

- Build screens visually with drag, drop, resize, and property controls.
- Generate editable layouts from natural-language prompts.
- Generate hero artwork, standalone artwork, icons, and Interactive Asset state images.
- Convert image assets into native LVGL C resources.
- Preview interfaces in the Builder and browser before export.
- Generate Button click hooks, Toggle Switch state hooks, and Binary Output setters.
- Build and flash the integrated ESP32-P4 firmware.
- Export an independent ESP-IDF project for normal application development.

### Zero-bloat native output

ForgeUI does not deploy its Studio technology to the microcontroller:

- No browser runtime on the device
- No Electron runtime on the device
- No HTML, CSS, JavaScript, or Node.js deployed to the device
- Exported UI compiles as native LVGL C inside ESP-IDF

The visual Studio is a development tool. The ESP32-P4 runs native embedded firmware.

---

## ✅ Physical hardware proof

ForgeUI has been validated on the physical **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B** at 1024×600.

Proven paths include:

- Builder Canvas → Browser Preview → LVGL export → ESP-IDF → ESP32-P4
- AI layout generation → editable Canvas → native firmware
- generated/uploaded artwork → LVGL assets → physical display
- Interactive Button Normal/Pressed runtime behavior
- Interactive Button generated developer hook
- Interactive Light OFF/ON export and initial state
- Interactive Light generated public setter
- integrated build and flash
- detached standalone ESP-IDF project build and flash

The current firmware configuration targets ESP32-P4 with a 360 MHz CPU setting, external hex-PSRAM at 200 MHz, and a 16 MB flash layout. Display configuration uses DMA-capable internal buffers with `.buff_dma = true` and `.buff_spiram = false`.

### Interactive Button proof

- Normal artwork displayed.
- Pressed artwork displayed while touched.
- Release restored Normal artwork.
- Multiple Button instances are supported.
- The generated click callback executed.
- The generated user hook executed.

Monitor output:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light proof

- OFF and ON artwork exported.
- The saved initial state displayed physically.
- The generated setter compiled and controlled runtime state.
- The Light remained non-clickable.
- Firmware remained stable after interaction.

During physical validation, Wi-Fi reached READY, an IP address was assigned, SD reached READY, and no crash occurred after interaction.

---

## ✅ Native render parity

ForgeUI maintains a single asset path across:

- Builder Canvas
- Browser Preview
- generated LVGL assets
- physical ESP32-P4 hardware

Device-aware preprocessing converts imported and AI-generated images into assets appropriate for the active display or requested native asset dimensions. The same uploaded-asset records then participate in preview and export.

---

## 🤖 ForgeUI AI Studio

ForgeUI AI Studio turns natural-language ideas into validated, editable ForgeUI layouts.

```text
Natural-language prompt
        ↓
Layout Prompt Helper (optional)
        ↓
AI layout generation
        ↓
Validated ForgeUI layout document
        ↓
Semantic icon resolution
        ↓
Visual Builder Canvas
        ↓
Browser Preview
        ↓
Native LVGL export
        ↓
ESP-IDF
        ↓
Physical ESP32-P4
```

Major AI workflows currently include:

- full layout generation
- guided Layout Prompt Helper
- hero background generation
- standalone artwork generation
- semantic icon resolution
- Interactive Button Normal/Pressed generation
- Interactive Light OFF/ON generation

Generated layouts remain editable before export. AI output enters the established ForgeUI component and asset pipelines rather than bypassing the Builder.

---

## 🖼️ AI hero and artwork pipeline

ForgeUI can generate or import visual artwork and promote it into reusable, LVGL-ready assets.

```text
Prompt or imported image
        ↓
Device-aware preprocessing
        ↓
Uploaded Asset Registry
        ↓
LVGL image conversion
        ↓
Theme Manager / Asset Library
        ↓
Builder and Browser Preview
        ↓
Native export
```

Hero backgrounds are center-cropped and resized for the active display. Other artwork, icons, and Interactive Asset images use their appropriate preprocessing modes instead of the full-screen hero path.

---

## 🕹️ Interactive Asset Framework — physical hardware proven

ForgeUI supports reusable visual assets with multiple runtime states.

Currently implemented:

- **Interactive Button**
- **Interactive Light**
- **Interactive Status Indicator**

The Studio presents both through one creation flow:

```text
Interactive Assets
        ↓
+ New Interactive Asset
        ↓
Choose Asset Type
        ├── Button
        └── Light
        ↓
Select or generate state artwork
        ↓
Assign to Canvas component
        ↓
Preview
        ↓
Export
        ↓
Physical ESP32-P4
```

The selected Asset Type controls the active designer, visible form, draft initialization, and AI generation mode. Editing an existing asset automatically opens the correct type.

Button, Light and Status Indicator share:

- Interactive Asset Registry
- validation
- persistence
- AI image pipeline
- Uploaded Asset Registry
- LVGL image conversion
- Canvas assignment
- LVGL export integration

Their saved models, designer fields, preview behavior, and firmware runtime behavior remain type-specific.

### Interactive Button

Interactive Button is a reusable image-based input control with:

- Normal artwork
- Pressed artwork
- manual LVGL-ready asset selection or AI generation
- preserved width and height
- Canvas state preview
- Browser Preview
- native LVGL export
- physical Pressed and released states

Runtime behavior:

```text
Normal
  ↓
Touch
  ↓
Pressed artwork
  ↓
Release or Press Lost
  ↓
Normal artwork
```

Each exported Button receives a generated developer hook, for example:

```c
void FG_On_StartPump_Clicked(void);
```

The standalone project's hook implementation belongs in:

```text
95_UserEvents.c
```

Developers do not add application logic to generated `90_Studio_Export.c`.

### Interactive Light

Interactive Light is a reusable output indicator with:

- OFF artwork
- ON artwork
- manual LVGL-ready asset selection or AI generation
- saved initial OFF/ON state
- temporary Canvas preview toggling
- native LVGL export
- physical ESP32-P4 proof

Canvas clicks toggle only the temporary Studio preview. They do not mutate the saved asset and are not exported as firmware interaction.

In firmware, Light is a non-clickable LVGL image controlled through a generated public API:

```c
FG_Set_Status_Light(true);
FG_Set_Status_Light(false);
```

- `true` selects ON artwork.
- `false` selects OFF artwork.
- Light does not generate a click hook.
- Application code decides when to call the generated setter.

### Interactive Status Indicator

Interactive Status Indicator is a reusable binary output indicator built on the shared Binary Output Runtime.

It supports:

- OFF artwork
- ON artwork
- manual LVGL-ready asset selection or AI generation
- saved initial OFF/ON state
- temporary Canvas preview toggling
- native LVGL export
- multiple independent instances
- generated public setter API

Canvas clicks toggle only the temporary Studio preview. They do not modify the saved asset and are not exported as firmware interaction.

In firmware, Status Indicator is a non-clickable LVGL image controlled through a generated public API:

```c
FG_Set_WiFi_Status(true);
FG_Set_WiFi_Status(false);
```

or

```c
FG_Set_Status_Indicator(true);
```

depending on the assigned asset name.

Status Indicator reuses the shared Binary Output Runtime introduced for Interactive Light. No additional runtime implementation is generated.

### Interactive Asset AI flow

```text
Asset description
        ↓
Select Button or Light
        ↓
AI state-artwork generation
        ↓
Uploaded Asset Registry
        ↓
Native LVGL conversion
        ↓
Interactive Asset Designer
        ↓
Canvas
        ↓
Export
        ↓
Physical ESP32-P4
```

Button generation creates Normal and Pressed images. Light generation creates OFF and ON images. This does not imply support for unimplemented future Interactive Asset types.

---

## 🔌 Generated Developer API

ForgeUI provides two directions across the generated UI/application boundary.

### Input controls

Generated UI calls developer code:

```text
Application logic
        ↓
FG_Set_Status_Light(true)

or

FG_Set_WiFi_Status(true)
        ↓
Shared Binary Output Runtime
        ↓
Generated LVGL runtime
        ↓
ON artwork
```

### Output controls

Developer code calls generated UI APIs:

```text
Application logic
        ↓
FG_Set_Status_Light(true)
        ↓
Generated LVGL runtime
        ↓
ON artwork
```

Permanent rule:

> Input controls produce generated developer hooks. Output controls expose generated public UI functions.

### File boundary

Generated and replaceable:

- `90_Studio_Export.c`
- `90_Studio_Export.h`

Generated user-event/application boundary:

- `95_UserEvents.c`
- `95_UserEvents.h`

Studio creates the user-event files during live firmware generation and standalone export. In the Studio-controlled live firmware they are replaceable test hooks. In an exported standalone project, their copies become the developer integration layer.

Generated public Light APIs are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`. Hardware and product logic belongs in the standalone application layer, not in generated UI files.

For the permanent ownership and API map, see [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

---

## 📦 Native asset pipeline

ForgeUI's local asset pipeline supports:

- device-aware hero preprocessing
- native-size artwork and icon processing
- Interactive Button Normal/Pressed assets
- Interactive Light OFF/ON assets
- uploaded image registration and persistence
- automatic LVGL C conversion
- generated symbol and source-path tracking
- automatic asset-source integration into CMake
- Canvas and Browser Preview resolution

The local conversion workflow uses `tools/lvgl/LVGLImage.py` and the Studio export server. No image conversion runtime is deployed to the ESP32-P4.

---

## 📦 Proven development pipeline

```text
ForgeUI Studio
        ↓
Visual Builder / AI Studio
        ↓
Canvas and Browser Preview
        ↓
Native LVGL code and assets
        ↓
Integrated firmware or standalone export
        ↓
ESP-IDF 5.5.4
        ↓
Build and flash
        ↓
Physical ESP32-P4
```

Proven deployment capabilities:

- integrated export, build, flash, and monitor flow
- independent standalone ESP-IDF export
- standalone Visual Studio Code and Espressif extension workflow
- native LVGL 9 firmware
- physical ESP32-P4 validation

---

## 🛠️ Feature matrix

### Visual Builder and Design Studio

- Drag-and-drop Canvas with resize and property editing
- Broad LVGL widget catalog
- AI layout generation
- Layout Prompt Helper
- Browser Preview
- Theme Manager with 25 configured themes
- hero background support
- semantic icon browsing and resolution through the React Icons dependency
- uploaded asset management
- unified Interactive Assets panel
- Interactive Button designer
- Interactive Light designer
- AI state-artwork generation
- live state previews
- reusable asset assignment
- persistent Interactive Asset Registry
- Interactive Status Indicator designer

### AI capabilities

- full layout generation
- guided layout prompting
- hero background generation
- artwork generation
- reusable asset generation
- semantic icon resolution
- native icon generation
- Button Normal/Pressed generation
- Light OFF/ON generation
- Status Indicator OFF/ON generation

### Native asset pipeline

- device-aware image preprocessing
- native-size artwork processing
- Button Normal/Pressed assets
- Light OFF/ON assets
- Uploaded Asset Registry
- automatic LVGL C conversion
- generated source integration into CMake
- Status Indicator OFF/ON assets

### Build and deployment

- native LVGL code generation
- integrated build and flash
- inline flash console
- standalone ESP-IDF export
- generated Button hooks
- generated Light setter APIs
- generated `95_UserEvents` layer
- developer-owned standalone integration layer
- physical Button and Light validation
- generated Light setter APIs

---

## 📁 Standalone ESP-IDF export

**Export Standalone Project** creates an independent ESP-IDF workspace under `C:\ForgeUI-Exports`. The exported project can be built, flashed, version-controlled, and shared without ForgeUI Studio.

The standalone path has been verified by:

- opening the project directly in Visual Studio Code;
- building with the Espressif ESP-IDF extension;
- flashing a physical ESP32-P4;
- running independently from Studio.

Example destination:

```text
C:\ForgeUI-Exports\ForgeUI_Export_003
```

Key project structure, using files present in the current firmware baseline:

```text
ForgeUI_Export_003/
├── CMakeLists.txt
├── partitions.csv
├── sdkconfig.defaults
└── main/
    ├── assets/
    │   └── uploads/
    ├── 00_ForgeUI_Config.h
    ├── 01_FG_Runtime.c
    ├── 01_FG_Runtime.h
    ├── 20_RTC.c
    ├── 20_RTC.h
    ├── 30_Audio.c
    ├── 30_Audio.h
    ├── 30_WIFI.c
    ├── 30_WIFI.h
    ├── 40_SD.c
    ├── 40_SD.h
    ├── 40_SIDEBAR.c
    ├── 40_SIDEBAR.h
    ├── 90_Studio_Export.c
    ├── 90_Studio_Export.h
    ├── 95_UserEvents.c
    ├── 95_UserEvents.h
    ├── CMakeLists.txt
    └── main.c
```

`90_Studio_Export.c/.h` contains generated UI, runtime support, and public APIs. `95_UserEvents.c/.h` is created by Studio and becomes the developer integration layer in the standalone project. Do not put hardware or product logic in `90_Studio_Export.c`.

---

## 🧹 Firmware maintenance

The Studio exposes three distinct operations. Their names do not imply identical cleanup scope.

### Clean Firmware

`Clean Firmware` calls the targeted generated-file reset endpoint. It:

- rewrites `main/CMakeLists.txt` to a clean baseline;
- rewrites `90_Studio_Export.c` and `90_Studio_Export.h` to minimal baseline files;
- does not delete the ESP-IDF build directory;
- does not delete generated icon, theme, or upload directories;
- does not delete `95_UserEvents.c/.h`.

### Firmware Maintenance

`Firmware Maintenance` is the destructive generated-workspace sweep. It:

- empties generated firmware icon, theme, and upload directories;
- removes cached upload input files;
- removes the ESP-IDF `build` directory;
- resets `main/CMakeLists.txt`;
- resets `90_Studio_Export.c/.h`;
- clears the Studio Canvas and uploaded-asset registry;
- resets active theme state and restores the default hero;
- leaves `95_UserEvents.c/.h` in place.

The UI warns that generated assets and the build cache are removed and instructs the user to restart Studio afterward.

### Clean Build & Flash

The current `Clean Build & Flash` action:

1. exports the current Canvas and generated API metadata to the live firmware;
2. invokes the configured ESP-IDF 5.5.4 build/flash script;
3. runs `idf.py build flash`.

The current script does not explicitly delete the build directory or invoke `idf.py fullclean`. Use `Firmware Maintenance` when a destructive build-cache and generated-asset sweep is required.

---

## 💾 Current firmware configuration

Repository-backed configuration includes:

- ESP-IDF 5.5.4 defaults
- ESP32-P4 target
- 360 MHz CPU setting
- 16 MB flash setting
- external hex-PSRAM enabled at 200 MHz
- PSRAM XIP disabled for the hosted Wi-Fi build
- DMA-capable internal display buffers

Current `partitions.csv`:

| Partition | Type | Size |
|---|---|---:|
| `nvs` | NVS data | `0x6000` |
| `phy_init` | PHY data | `0x1000` |
| `factory` | Factory application | 14 MB |
| `storage` | SPIFFS data | 1 MB |

These values replace older README figures that no longer matched the repository.

---

## 🗂️ Repository structure

```text
esp32p4-ui-studio/
├── studio/                       # React / Next.js visual and AI Studio
├── firmware/ForgeUI-One/         # ESP-IDF reference and live firmware workspace
├── tools/lvgl/LVGLImage.py       # Local LVGL image conversion tool
├── docs/                         # Supporting and historical documentation
├── 01_SPINE.md                   # Current architecture spine
├── 02_DEVELOPER_CODE_MAP.md      # Studio and Interactive Asset subsystem map
├── 03_ForgeUI_Generated_Export_API_Code_Map.md
└── README.md
```

Detailed subsystem ownership and debugging information belongs in the code maps, not in this README:

- [02_DEVELOPER_CODE_MAP.md](02_DEVELOPER_CODE_MAP.md)
- [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md)

---

## ✅ Current development status

ForgeUI Studio has proven:....

- ✓ Visual Builder and Canvas
- ✓ AI layout generation
- ✓ Layout Prompt Helper
- ✓ AI hero background generation
- ✓ AI artwork generation
- ✓ reusable asset library
- ✓ semantic icon pipeline
- ✓ native icon asset generation
- ✓ device-aware asset pipeline
- ✓ automatic image preprocessing
- ✓ native LVGL asset generation
- ✓ Theme Manager integration
- ✓ Interactive Asset Framework
- ✓ unified Interactive Asset creation flow
- ✓ Interactive Button
- ✓ Interactive Light
- ✓ AI Button state generation
- ✓ AI Light state generation
- ✓ Interactive Asset persistence
- ✓ Canvas state preview
- ✓ Browser Preview parity
- ✓ generated Button user hooks
- ✓ generated Light setter APIs
- ✓ generated `95_UserEvents` layer
- ✓ native LVGL export
- ✓ standalone developer-owned ESP-IDF project
- ✓ independent Visual Studio Code build
- ✓ integrated build and flash
- ✓ physical Button pressed/released validation
- ✓ physical Light ON/OFF validation
- ✓ physical ESP32-P4 deployment
- ✓ Interactive Status Indicator
- ✓ Binary Output Runtime
- ✓ generated Status Indicator setter APIs
- ✓ shared Binary Output Runtime

---

## ForgeUI philosophy

Build it.

Prove it.

Flash it.

Improve it.

Repeat.

---

# About the Creator

Hi, I'm **Scott Forster** from New Zealand, creator of **ForgeUI Studio**.

ForgeUI began as a personal project with a simple goal: make professional embedded HMI development faster, more approachable and more enjoyable. I wanted a tool that could take an idea—from a rough sketch or a natural-language prompt—all the way through to a working interface running on real ESP32-P4 hardware.

Today, ForgeUI Studio combines visual design, AI-assisted layout generation, native LVGL code generation, reusable Interactive Assets and standalone ESP-IDF export into a single development workflow. Every major feature is developed against physical hardware, with new capabilities only considered complete once they have been built, exported, compiled, flashed and verified on an ESP32-P4.

My development philosophy remains simple:

> **Build it. Prove it. Flash it. Improve it.**

ForgeUI is developed using modern AI-assisted engineering practices. I define the product vision, architecture, hardware validation and engineering direction, while AI coding tools—including **ChatGPT** and **Codex**—assist with implementation, refactoring, testing, documentation and design reviews. Every change is reviewed and validated before becoming part of the project.

The goal is not simply to build another UI designer, but to create an open, native-first embedded development platform that removes repetitive engineering work while preserving complete control of the generated firmware.

ForgeUI Studio is open source because I believe powerful embedded development tools should be accessible to everyone. I hope it helps engineers, students, makers and companies build better products more quickly, and I welcome ideas, feedback and contributions from the community.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
## Interactive Runtime Families

ForgeUI Interactive Assets use the shared registry, uploaded-image library, persistence key, AI image pipeline, Canvas assignment, validation, and LVGL export pipeline.

- **Interactive Input Runtime**
  - Interactive Button is momentary and generates `FG_On_*_Clicked(void)`.
  - Interactive Toggle Switch is persistent. It displays saved OFF/ON artwork, toggles on each Canvas or LVGL click, and generates `FG_On_*_Toggled(bool enabled)` with the new state.
- **Binary Output Runtime**
  - Interactive Light and Interactive Status Indicator are non-clickable, setter-controlled outputs using `FG_Set_*(bool enabled)`.

Toggle Switch instances have independent runtime state while sharing one generated `fg_toggle_input_t` implementation. Generated declarations and implementations remain in `90_Studio_Export.c/.h` and `95_UserEvents.c/.h`; no additional generated API files are used.
