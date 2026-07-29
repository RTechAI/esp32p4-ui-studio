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
- Standard LVGL Component Runtime APIs
- Canvas and Browser Preview workflows
- Reusable built-in System Runtime with a physically proven Wi-Fi Manager
- Local conversion of images into LVGL-ready C assets
- Native LVGL v9 UI and runtime generation
- Generated input callbacks, output setters, and semantic runtime APIs for supported standard LVGL widgets
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

OpenAI-assisted layout and image generation use configured OpenAI services. Studio editing, uploaded-image preprocessing, LVGL conversion, validation, export, ESP-IDF build and flashing run locally. Standalone exported ESP-IDF projects have no ForgeUI subscription, licensing, runtime phone-home, OpenAI, or ForgeUI Studio requirement.

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

All five share AI state-artwork generation, Interactive Asset registry and persistence, direct Creator workflows, Canvas assignment, configured Inspector workflows, Browser Preview, visible-artwork fitting, Canvas resizing, centred contain-fit rendering, native LVGL export, generated developer APIs, and physical ESP32-P4 validation within the recorded scope.

Type-specific generated behavior remains explicit:

```text
Button         → FG_On_*_Clicked(void)
Toggle         → FG_On_*_Toggled(bool enabled)
Three-Position → FG_On_*_Changed(fg_three_way_state_t state)
Light/Status   → FG_Set_*(bool enabled)
```

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

The Canvas provides drag-and-drop placement, selection, resizing, properties, themes, uploaded artwork, and direct Interactive Asset editing. Browser Preview and Canvas aim to match generated LVGL behavior, while acknowledging that native LVGL widgets can require explicit exporter styling and geometry corrections. Browser Preview now mirrors the Wi-Fi Manager, password workflow and connected details through deterministic hardware-independent network simulation.

The generated System Runtime owns one reusable native LVGL keyboard for password entry. It is created lazily on the LVGL top layer, attaches to the active password textarea, supports Show / Hide, Done and Cancel, and retains physically validated geometry and touch interaction on the 1024 × 600 ESP32-P4 display.

---

## ⚙️ Built-in System Interface

ForgeUI also generates a built-in System Interface as platform infrastructure alongside the user application:

- System Launcher
- Display / Brightness
- Wi-Fi Manager

The application and System pages use persistent generated containers with internal navigation, so Interactive Assets remain alive while the System Interface is open. Display brightness changes live through `bsp_display_brightness_set()` and remains selected for the current device session.

The Wi-Fi Manager is physically proven across Browser Preview, generated LVGL and the ESP32-P4. It provides Scan Networks, Refresh, a structured selectable network list, RSSI, security, Connected and Saved badges, an integrated password dialog and reusable native LVGL keyboard, Show / Hide password, Connect, Disconnect, Reconnect, Forget Network and connected details including gateway, station MAC and AP BSSID.

The generated page owns presentation, connected-detail projection and UI intent. The separate Hosted backend remains the source of physical Wi-Fi truth and continues to own scanning implementation, credentials, reconnect policy, DHCP, ESP-IDF and transport integration.

The built-in System Interface is separate from reusable multi-page authoring for user projects, which remains future work.

## 📡 Hosted Wi-Fi and SD runtime

The current Waveshare hardware uses two physically proven SDMMC paths:

```text
Hosted Wi-Fi
→ ESP32-C6
→ ESP-Hosted
→ SDIO Slot 1
→ GPIO14–19
→ Reset GPIO54

SD Storage
→ SDMMC Slot 0
→ GPIO39–44
```

Physical validation on the Waveshare ESP32-P4-WiFi6-Touch-LCD-7B confirmed an active ESP-Hosted transport, ESP32-C6 identification, automatic Wi-Fi reconnect, DHCP address acquisition, successful SD mount and write/read testing, and simultaneous Wi-Fi and SD operation. The proven Hosted backend now drives the complete generated Wi-Fi Manager without changing this transport architecture.

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

`90_Studio_Export.c/.h` contain generated, replaceable UI and runtime code. Live Studio regeneration preserves matching developer-written hook bodies and adds missing declarations or stubs. After standalone export, `95_UserEvents.c/.h` become the developer-owned application integration layer. Developer GPIO, I/O, hardware actions and product behaviour belong in that standalone integration layer or other developer-owned application modules—not in generated `90_Studio_Export.c/.h`, and not necessarily directly in `main.c`.

For the detailed ownership contract, see [03_ForgeUI_Generated_Export_API_Code_Map.md](03_ForgeUI_Generated_Export_API_Code_Map.md).

---

## Standard LVGL Component Runtime

ForgeUI now generates retained runtime APIs for supported standard LVGL widgets when the widget has meaningful state or actions to expose. Generated code retains the required LVGL objects and state, applies safe transition rules, and connects semantic developer hooks where appropriate.

This runtime is separate from both reusable Interactive Assets and the built-in System Runtime:

```text
Standard LVGL Component Runtime
├── Led
├── Bar
├── Arc
├── Chart
├── Keyboard
├── Calendar
├── Roller
└── Button Matrix
```

The APIs reflect each widget rather than forcing every component into a generic value model. Examples include setting LED, Bar and Arc values, adding or clearing Chart points, showing or hiding the standard Canvas Keyboard, selecting Calendar dates, and selecting Roller or Button Matrix options.

Runtime APIs and hooks are generated consistently through both the integrated Build & Flash workflow and standalone ESP-IDF export. Presentation-only components remain API-free when they own no meaningful runtime state. Scale is a visual tick-and-label renderer, Line is decorative geometry, Icon is a Studio authoring convenience for the built-in icon picker, and Divider is visual separation only.

At export, Icon becomes a normal LVGL image backed by the existing generated image symbol. It has no runtime setter or developer hook. Applications that need runtime image swapping should use the Standard Image component and `FG_Set_<Image_Name>_Source(const void * src)`; ForgeUI intentionally does not duplicate that capability as an Icon API.

Divider also has no runtime setter or developer hook. If a Divider must appear or disappear dynamically, place it inside the relevant parent Box and use `FG_Set_<Parent_Box_Name>_Visible(bool visible)` so visibility remains owned by the layout container.

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
- direct Creator workflow across all five Interactive Assets
- shared Canvas resize and visible-artwork fitting
- Canvas, Browser Preview, and generated LVGL contain-fit parity
- built-in System Launcher and Display / Brightness page
- physical backlight control through `bsp_display_brightness_set()`
- complete Wi-Fi Manager with Scan, Refresh, structured network rows, network selection, RSSI and security
- Connected and Saved badges
- protected-network password dialog and reusable native LVGL keyboard
- password entry, Show / Hide, Done and Cancel
- Connect, Disconnect, Reconnect and Forget Network workflows
- connected details including gateway, station MAC and AP BSSID
- deterministic Browser Preview parity for the Wi-Fi workflow
- Hosted Wi-Fi over SDIO Slot 1
- SD Card storage over SDMMC Slot 0
- simultaneous Wi-Fi and SD operation
- reusable top-layer native LVGL keyboard alignment, four-row layout, special keys, touch interaction, and Studio parity
- integrated Build & Flash
- detached standalone ESP-IDF project build and flash

Physical Three-Position testing confirmed that all three touch zones selected the matching state, the generated callback reported the correct readable value, initialization did not produce an unwanted notification, and repeated interaction remained stable.

The current proven hardware and software baseline is:

- Waveshare ESP32-P4-WiFi6-Touch-LCD-7B
- ESP32-P4
- ESP32-C6 Wi-Fi companion
- ESP-IDF 5.5.4
- LVGL 9.2.2
- 1024 × 600 MIPI-DSI display
- GT911 touch
- 32 MB external PSRAM
- ESP-Hosted 2.9.7
- Wi-Fi Remote 1.3.0
- Hosted SDIO Slot 1
- SD storage on SDMMC Slot 0

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
main/90_Studio_Export.c   generated and replaceable UI/runtime implementation
main/90_Studio_Export.h   generated and replaceable UI/runtime declarations
main/95_UserEvents.c      developer-owned standalone application integration
main/95_UserEvents.h      developer-owned standalone integration declarations
```

Developer GPIO, peripheral I/O, hardware actions and permanent product behaviour belong in the standalone project’s developer-owned integration layer and supporting application modules. They should not be placed in replaceable generated UI files.

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
- deterministic Wi-Fi Manager, password-workflow, and connected-detail preview parity
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
- runtime state preserved while the reusable built-in System Runtime is open

### Native export

- LVGL v9 source generation
- locally converted image assets
- generated input callbacks
- generated output setters
- retained semantic runtime APIs for supported standard LVGL widgets
- complete generated Wi-Fi Manager and structured backend projection
- generated connected details, selectable network rows, badges, password and forget dialogs
- reusable native LVGL keyboard with generated attachment and callbacks
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

Current architecture save point:

`FORGEUI_STANDARD_LVGL_RUNTIME_APIS__LED_BAR_ARC_CHART_KEYBOARD_CALENDAR_ROLLER_MESSAGE_BOX_BUTTON_MATRIX__LIVE_AND_STANDALONE_PROVEN__2026-07-29`

Current proven milestones include:

- visual Builder, Canvas, themes, and Browser Preview
- AI layout, hero, artwork, and semantic icon workflows
- local device-aware LVGL asset conversion
- five implemented Interactive Asset types
- all-five direct Creator workflows
- shared Canvas resizing and visible-artwork fitting across all five
- Canvas, Browser Preview, and LVGL centred contain-fit parity
- reusable Toggle and Three-Position State Sheet workflows
- linked crop editing and atomic state-asset registration
- Interactive Button, Toggle Switch, Three-Position Toggle Switch, Light, and Status Indicator runtime paths
- generated `95_UserEvents` hook layer for Button, Toggle, and Three-Position inputs
- shared Binary Output Runtime and generated `FG_Set_*` Light/Status APIs
- Standard LVGL Component Runtime APIs for Led, Bar, Arc, Chart, Keyboard, Calendar, Roller, Message Box, and Button Matrix
- built-in System Launcher and Display / Brightness
- physical display backlight control
- reusable built-in System Runtime
- complete built-in Wi-Fi Manager with structured network rows, password workflow, Connect, Disconnect, Reconnect and Forget Network
- connected Wi-Fi details including RSSI, gateway, security, station MAC and AP BSSID
- deterministic Browser Preview parity for the Wi-Fi Manager
- Hosted Wi-Fi over SDIO Slot 1
- SD Card operation over SDMMC Slot 0
- simultaneous Hosted Wi-Fi and SD operation
- Three-Position State Sheet generation and linked crops
- reusable native LVGL keyboard, password attachment, top-layer ownership and physical interaction at 1024 × 600
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
- reusable user-project multi-screen authoring; the built-in System Interface already uses persistent generated pages;
- additional built-in System pages including Bluetooth and Device settings;
- MQTT, OTA and Ethernet platform integrations;
- continued visual theme polish for generated System surfaces;
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
