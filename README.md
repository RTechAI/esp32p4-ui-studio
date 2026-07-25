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

Interactive Assets can be created, saved, assigned to Canvas components, and reopened for editing. The Canvas, Browser Preview, and generated LVGL runtime resolve the same saved asset references.

Generated firmware provides callbacks for input controls and public setters for output controls. Runtime support is shared where appropriate, while each exported component instance retains its own artwork, state, and callback or setter connection.

## Direct Creator workflows

Supported Canvas components provide a direct path into their matching Creator:

1. right-click a supported component;
2. choose **Open Creator**;
3. edit or create the required state artwork;
4. confirm through the normal save and assignment workflow.

Configured components reopen their exact linked Interactive Asset. Unconfigured components open a new unsaved draft, and Inspector onboarding points to the Creator when required artwork is missing. Opening a Creator does not automatically save or assign an asset.

Direct Creator shortcuts currently support:

- Button
- Toggle Switch
- Three-Position Toggle Switch
- Light

Status Indicator remains available through the Interactive Assets workflow, but does not currently use the same direct Canvas shortcut.

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

The two-state workflow is available through the Toggle State Sheet Builder. Button and Light Creators also support their current paired state-generation workflows.

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

# 🔌 Generated Runtime APIs

ForgeUI keeps UI generation separate from application behavior.

### Input callbacks

Generated input controls call developer-owned hooks:

```c
/* Interactive Button */
void FG_On_<Name>_Clicked(void);

/* Interactive Toggle Switch */
void FG_On_<Name>_Toggled(bool enabled);

/* Interactive Three-Position Toggle */
void FG_On_<Name>_Changed(fg_three_way_state_t state);
```

The Three-Position callback receives a distinct LEFT, CENTER, or RIGHT enum state.

### Output setters

Application code controls generated output widgets through public setters:

```c
/* Interactive Light or Status Indicator */
void FG_Set_<Name>(bool enabled);
```

For example:

```c
FG_Set_Status_Light(true);
FG_Set_WiFi_Status(false);
```

The permanent integration rule is:

> Input controls produce generated developer callbacks. Output controls expose generated public UI functions.

In a standalone export, developers implement input behavior in the generated user-event layer and call output setters from their application code. Hardware and business logic do not belong in the generated UI implementation.

For the detailed ownership contract, see [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

---

## 🖼️ Local native asset pipeline

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

The pipeline supports hero backgrounds, standalone artwork, icons, and Interactive Asset state images. Generated C assets and their build registrations are included automatically in the exported firmware. No image-conversion runtime is deployed to the ESP32-P4.

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

---

## 🛠️ Current capabilities

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

- Button
- Toggle Switch
- Three-Position Toggle Switch
- Light
- Status Indicator
- persistent reusable asset library
- direct Creator workflows for supported Canvas components
- independent exported runtime instances

### Native export

- LVGL v9 source generation
- locally converted image assets
- generated input callbacks
- generated output setters
- generated Keyboard map, styling, alignment, and relative key widths
- integrated Build & Flash
- standalone ESP-IDF export

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
- direct Creator entry from supported Canvas components
- reusable Toggle and Three-Position State Sheet workflows
- linked crop editing and atomic state-asset registration
- generated Button, Toggle, and Three-Position callbacks
- shared Binary Output Runtime and generated Light/Status setters
- LVGL Keyboard parity at 1024×600
- integrated ESP-IDF Build & Flash
- independent standalone ESP-IDF export
- physical ESP32-P4 validation of the current runtime paths

ForgeUI remains under active development and is ready for continued UI polish, broader testing, and community contribution.

---

## Open-source positioning

ForgeUI Studio is open source to make native embedded HMI tooling more accessible to engineers, students, makers, and companies. The project aims to reduce repetitive interface work without hiding or replacing the generated LVGL and ESP-IDF application model.

Contributions, testing, ideas, and feedback are welcome.

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
