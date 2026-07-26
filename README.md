# 🛠️ ForgeUI Studio

**ForgeUI Studio is an open-source, AI-assisted visual HMI Studio for ESP32-P4.** It combines a drag-and-drop UI builder, reusable Interactive Assets, native LVGL v9 generation, local asset processing, integrated Build & Flash tools, and standalone ESP-IDF project export.

ForgeUI supports generated interactive controls across the complete workflow: design-time configuration, Canvas editing, Browser Preview, native export, and runtime behavior on physical hardware. The Studio helps turn visual designs and natural-language ideas into editable interfaces while keeping the device output native to LVGL and ESP-IDF.

> **Build it. Prove it. Flash it. Improve it. Repeat.**

If ForgeUI helps your embedded work, consider leaving the project a GitHub star.

---

## ⚡ What ForgeUI provides

- Drag-and-drop screen design with resize and property controls
- AI-assisted layout and artwork generation
- Reusable multi-state Interactive Assets
- Canvas and Browser Preview workflows
- Local conversion of images into LVGL-ready C assets
- Native LVGL v9 UI and runtime generation
- Generated input callbacks and output setter APIs
- Integrated ESP-IDF Build & Flash workflow
- Standalone ESP-IDF project export for normal application development

### Native output without a browser runtime

ForgeUI is a development tool. It does not deploy the Studio stack to the microcontroller:

- no browser or Electron runtime on the device;
- no HTML, CSS, JavaScript, or Node.js on the device;
- generated interfaces compile as native LVGL C inside ESP-IDF.

---

## 🤖 AI Design Studio

ForgeUI AI Studio turns natural-language ideas into validated, editable ForgeUI layouts.

```text
Natural-language prompt
        ↓
Layout Prompt Helper (optional)
        ↓
AI layout generation
        ↓
Editable ForgeUI Canvas
        ↓
Browser Preview
        ↓
Native LVGL export
        ↓
ESP-IDF
        ↓
Physical ESP32-P4
```

Current AI-assisted workflows include full layouts, guided prompting, hero backgrounds, standalone artwork, semantic icons, and state artwork for Interactive Assets. Generated content enters the same component and asset pipelines as manually created content and remains editable before export.

OpenAI-assisted layout and image generation use configured API access. Uploaded-asset preprocessing and LVGL conversion run locally. After artwork is generated or uploaded, asset processing, native conversion, validation, and firmware export are local operations. Standalone exported projects have no runtime dependency on OpenAI or ForgeUI Studio.

---

# 🧩 Interactive Asset Framework

Interactive Assets are reusable controls that store the artwork for each of their visual states.

### Interactive Input Runtime

- **Interactive Button** — momentary Normal and Pressed states
- **Interactive Toggle Switch** — persistent OFF and ON states

### Three-Position Input Runtime

- **Interactive Three-Position Toggle Switch** — persistent LEFT, CENTER, and RIGHT states

### Binary Output Runtime

- **Interactive Light** — application-controlled OFF and ON states
- **Interactive Status Indicator** — application-controlled OFF and ON states

All five share Interactive Asset identity, registry, persistence, uploaded state artwork, AI generation, Canvas assignment, Browser Preview, native LVGL export, and validation.

Type-specific generated behavior remains explicit:

- Button uses Normal/Pressed artwork and `FG_On_*_Clicked(void)`.
- Toggle retains persistent OFF/ON state and calls `FG_On_*_Toggled(bool enabled)`.
- Three-Position uses LEFT/CENTER/RIGHT state and calls `FG_On_*_Changed(fg_three_way_state_t state)`.
- Light and Status Indicator are setter-controlled OFF/ON outputs.

Runtime support is shared where appropriate, while each exported component instance retains independent artwork, state, and callback or setter connection.

## Direct Creator workflows

All five Interactive Asset Canvas components provide a direct path into their matching Creator:

1. right-click a supported component;
2. choose **Open Creator**;
3. edit or create the required state artwork;
4. confirm through the normal save and assignment workflow.

Configured components reopen their exact linked Interactive Asset. Unconfigured components open a new unsaved draft, and Inspector onboarding points to the Creator when required artwork is missing. Opening a Creator does not automatically save or assign an asset.

Direct Creator access supports all five types:

- Button
- Toggle Switch
- Three-Position Toggle Switch
- Light
- Status Indicator

---

## 🎨 State Sheet asset generation

State Sheets generate related visual states from one master image. This keeps the housing, scale, lighting, and perspective consistent so that only the intended state changes.

### Two-state State Sheet

```text
Natural-language prompt
        ↓
Generate one OFF/ON State Sheet
        ↓
Adjust linked crop regions
        ↓
Create matching OFF and ON assets
        ↓
Save Interactive Asset
        ↓
Assign to Canvas
        ↓
Native LVGL export
        ↓
Physical ESP32-P4
```

The Toggle State Sheet Builder turns one OFF/ON master into two linked crops and then two independent OFF and ON assets. Button and Light Creators also support paired state generation.

### Three-Position State Sheet

```text
Natural-language prompt
        ↓
Create Three-Position Toggle Set
        ↓
Generate one LEFT/CENTER/RIGHT State Sheet
        ↓
Adjust three linked crop regions
        ↓
Remap rows if required
        ↓
Confirm Crops
        ↓
Create three matching state assets
        ↓
Save and assign
        ↓
Native LVGL export
        ↓
Physical ESP32-P4
```

The Three-Position crop workspace provides:

- separate LEFT, CENTER, and RIGHT crop boxes;
- shared crop dimensions with independent positioning;
- linked resizing with edge and corner handles;
- row-to-state remapping;
- identical output dimensions for all three states.

All state images are processed and registered together. Partial asset registration is prevented, and the existing draft remains unchanged if conversion fails.

---

## Interactive Status Indicator

Status Indicator now has the complete direct Creator workflow, Inspector onboarding, and a responsive binary-output placeholder. New components drop at `120 × 72`, large enough to select and resize before artwork is assigned.

Browser Preview and Canvas Preview use the same centered contain-fit renderer, preserving artwork aspect ratio rather than stretching it to the component bounds. Clicking the Canvas preview toggles a temporary local OFF/ON state for visual verification; it does not change the saved initial state, persistence, or generated firmware.

The exported Status Indicator remains non-clickable. Application code changes its state through its generated `FG_Set_*` API.

---

## Visual Designer and Preview

The Canvas provides drag-and-drop placement, selection, resizing, properties, themes, uploaded artwork, and direct Interactive Asset editing. Browser Preview and Canvas aim to match generated LVGL behavior, while acknowledging that native LVGL widgets can require explicit exporter styling and geometry corrections.

The native LVGL Keyboard exporter now owns an explicit map, relative key proportions, top-left alignment, and final size and position matching the Canvas. This geometry has been physically validated on the 1024 × 600 ESP32-P4 display.

---

# 🔌 Generated Runtime APIs

ForgeUI keeps UI generation separate from application behavior.

### Input callbacks

Generated input controls call developer-owned hooks:

```c
void FG_On_Start_Button_Clicked(void);
void FG_On_Main_Power_Toggled(bool enabled);
void FG_On_Mode_Changed(fg_three_way_state_t state);
```

The Three-Position callback receives a distinct LEFT, CENTER, or RIGHT enum state.

### Output setters

Application code controls generated output widgets through public setters:

```c
void FG_Set_Status_Light(bool enabled);
void FG_Set_WiFi_Status(bool enabled);
```

For example:

```c
FG_Set_Status_Light(true);
FG_Set_WiFi_Status(false);
```

The permanent integration rule is:

> Input controls produce generated developer callbacks. Output controls expose generated public UI functions.

Live Studio `95_UserEvents.c/.h` files may be regenerated. In a standalone export, those files become the developer-owned integration layer for input behavior, while application code calls output setters declared by the generated UI header. Hardware and business logic do not belong in `90_Studio_Export.c`.

For the detailed ownership contract, see [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

---

## 🖼️ Native asset pipeline

ForgeUI processes artwork locally for the active display or requested native asset dimensions.

```text
Prompt or imported image
        ↓
Device-aware preprocessing
        ↓
Uploaded Asset Library
        ↓
Local LVGL image conversion
        ↓
Canvas and Browser Preview
        ↓
Native firmware export
```

The pipeline supports hero backgrounds, standalone artwork, icons, and Interactive Asset state images. Preprocessing and LVGL conversion are local once an image is generated or uploaded. Generated C assets and their build registrations are included automatically in exported firmware; no image-conversion runtime is deployed to the ESP32-P4.

---

## ✅ Physical hardware proof

ForgeUI is developed and validated on the **Waveshare ESP32-P4-WiFi6-Touch-LCD-7B** at **1024×600**.

Proven paths include:

- Canvas → Browser Preview → LVGL export → ESP-IDF → physical ESP32-P4
- AI-generated layouts and artwork through editable Canvas workflows
- Interactive Button Normal/Pressed behavior and generated callback
- Interactive Toggle Switch OFF/ON touch behavior
- Interactive Three-Position LEFT/CENTER/RIGHT artwork, touch zones, and callback
- Interactive Light and Status Indicator output-state export
- generated public output setters
- full-size LVGL Keyboard alignment, four-row layout, special keys, and Studio parity
- integrated Build & Flash
- detached standalone ESP-IDF project build and flash

Physical Three-Position testing confirmed that all three touch zones selected the matching state, the generated callback reported the correct readable value, initialization did not produce an unwanted notification, and repeated interaction remained stable.

The current reference firmware targets ESP32-P4 with ESP-IDF 5.5.4, a 360 MHz CPU setting, external hex-PSRAM at 200 MHz, and a 16 MB flash layout.

---

## 📦 Build, flash, and deployment

ForgeUI supports two deployment models.

### Integrated development

The Studio exports the current Canvas and assets into its reference firmware workspace, then builds and flashes the connected ESP32-P4 through the configured ESP-IDF toolchain.

### Standalone ESP-IDF export

**Export Standalone Project** creates an independent ESP-IDF workspace under:

```text
C:\ForgeUI-Exports
```

The exported project can be opened directly in Visual Studio Code, built with the Espressif extension or standard ESP-IDF tools, flashed, version-controlled, and shared without ForgeUI Studio.

Generated UI and runtime files remain replaceable. The standalone user-event files become the application integration layer for callbacks, while generated output APIs can be called from normal application code.

The application boundary includes:

```text
main/90_Studio_Export.c   generated UI and runtime implementation
main/90_Studio_Export.h   generated public output APIs
main/95_UserEvents.c      developer-owned standalone callback implementations
main/95_UserEvents.h      developer-owned standalone callback declarations
```

---

## Export validation and asset safety

ForgeUI validates exports before replacing generated firmware:

- client preflight checks Canvas components, Interactive Assets, required state artwork, and LVGL-ready assets;
- independent server validation runs before filesystem mutation;
- duplicate component IDs, public APIs, image symbols, and declarations are rejected;
- generated source and required asset files are validated;
- reference-aware deletion protects assets still used by the Canvas or other records;
- a failed export preserves the previous generated firmware.

---

## 🛠️ Feature matrix

### Visual design

- drag-and-drop Canvas
- component resizing and property editing
- broad LVGL widget catalog
- Browser Preview
- Theme Manager
- hero backgrounds and uploaded artwork
- semantic icon browsing

### AI-assisted workflows

- layout generation and guided prompting
- hero and standalone artwork generation
- interactive state-artwork generation
- Toggle OFF/ON State Sheets
- Three-Position LEFT/CENTER/RIGHT State Sheets
- linked crop editing and state remapping

### Interactive Assets

- five Interactive Asset types across three runtime families
- persistent reusable asset library
- direct Creators for all five Canvas component types
- Inspector onboarding for missing visuals
- Toggle State Sheet Builder
- Three-Position Toggle Set generation
- linked crop workspace with atomic conversion and registration
- independent exported runtime instances

### Native export

- LVGL v9 source generation
- locally converted image assets
- generated input callbacks
- generated output setters
- generated Keyboard map, styling, alignment, and relative key widths
- client preflight and independent server validation
- reference-aware asset deletion
- integrated Build & Flash
- standalone ESP-IDF ownership boundary

---

## 🗂️ Repository structure

```text
esp32p4-ui-studio/
├── studio/                       # React / Next.js visual and AI Studio
├── firmware/ForgeUI-One/         # ESP-IDF reference and live firmware workspace
├── tools/lvgl/LVGLImage.py       # Local LVGL image conversion tool
├── docs/                         # Supporting and historical documentation
├── 01_SPINE.md                   # Current architecture spine
├── 02_DEVELOPER_CODE_MAP.md      # Studio subsystem map
├── 03_ForgeUI_Generated_Export_API_Code_Map.md
└── README.md
```

Detailed subsystem ownership and debugging information belongs in the code maps:

- [02_DEVELOPER_CODE_MAP.md](02_DEVELOPER_CODE_MAP.md)
- [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md)

---

## ✅ Project milestones

Current proven milestones include:

- visual Builder, Canvas, themes, and Browser Preview
- AI layout, hero, artwork, and semantic icon workflows
- local device-aware LVGL asset conversion
- five implemented Interactive Asset types
- all-five direct Creator workflows
- reusable Toggle and Three-Position State Sheet workflows
- linked crop editing and atomic state-asset registration
- Interactive Button, Toggle Switch, Three-Position Toggle Switch, Light, and Status Indicator runtime paths
- generated `95_UserEvents` hook layer for Button, Toggle, and Three-Position inputs
- shared Binary Output Runtime and generated `FG_Set_*` Light/Status APIs
- Three-Position State Sheet generation and linked crops
- native LVGL Keyboard placement, sizing, and key proportions at 1024 × 600
- client/server export validation before generated-file replacement
- integrated ESP-IDF Build & Flash
- independent standalone ESP-IDF export
- physical ESP32-P4 validation of the current runtime paths

ForgeUI remains under active development and is ready for continued UI polish, broader testing, and community contribution.

---

## Future direction

These are future concepts, not descriptions of implemented runtime support:

- additional generated runtime families;
- value controls, gauges, and numeric displays;
- multi-page applications;
- GPIO and peripheral binding;
- broader board and display profiles;
- reusable project templates;
- plugin architecture.

---

## Open-source credits

ForgeUI Studio is open source to make native embedded HMI tooling more accessible to engineers, students, makers, and companies. The project aims to reduce repetitive interface work without hiding or replacing the generated LVGL and ESP-IDF application model.

Contributions, testing, ideas, and feedback are welcome.

ForgeUI builds on open-source projects including LVGL, ESP-IDF, React, Next.js, Chakra UI, and their dependencies. Their respective licenses and attribution requirements remain with those projects.

---

## ForgeUI philosophy

Build it.

Prove it.

Flash it.

Improve it.

Repeat.

---

## About the Creator

Hi, I'm **Scott Forster** from New Zealand, creator of **ForgeUI Studio**.

ForgeUI began as a personal project with a simple goal: make embedded HMI development faster, more approachable, and more enjoyable. Major features are developed against physical hardware and treated as proven only after they have been exported, compiled, flashed, and exercised on an ESP32-P4.

ForgeUI is developed with modern AI-assisted engineering practices. I define the product vision, architecture, hardware validation, and engineering direction, while tools including **ChatGPT** and **Codex** assist with implementation, testing, refactoring, documentation, and design reviews.

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
