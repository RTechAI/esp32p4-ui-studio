# Developer Code Map: where features live, who owns each layer, and which files are authoritative

## WHY 01_SPINE & 02_DEVELOPER & 03_FORGEUI_GEN -  means Codex spends less time guessing and is much less likely to:

- edit generated files directly
- duplicate an existing subsystem
- put firmware logic into the Studio
- break ownership boundaries
- revive an obsolete architecture
- touch hardware configuration that is   already proven

## ForgeUI Runtime Architecture — Developer Code Map

## Current save point

**FORGEUI_END_OF_SPRINT__29_OF_39_STANDARD_WIDGETS_ESP32P4_PROVEN__2026-08-01**

## Current authoritative ownership summary

| Concern | Authoritative owner |
|---|---|
| Standard Widget catalogue | `studio/src/forgeui/widgets/ForgeUIWidgetRegistry.ts` |
| Legacy catalogue compatibility | `studio/src/forgeui/ForgeUIWidgetSet.ts` projection |
| Per-widget API/event/input/child/docs/gate metadata | `studio/src/forgeui/widgets/ForgeUIWidgetRegistry.ts` explicit capability table |
| Quarantined future/legacy component types | `studio/src/componentsList.ts` `futureUnregisteredWidgetTypes` |
| Board identity and capabilities | `studio/src/forgeui/boards/ForgeUIBoardRegistry.ts` and profile modules |
| Project hardware selection | `studio/src/forgeui/boards/ForgeUIProjectHardware.ts` |
| Shared native generator | `studio/src/forgeui/ForgeUILvglExport.ts` |
| Export materialization and gating | `studio/export-server.js` |
| Generated replaceable UI | `firmware/ForgeUI-One/main/90_Studio_Export.c/.h` |
| Developer UserEvents | `firmware/ForgeUI-One/main/95_UserEvents.c/.h` |
| Feature evidence | `04_FEATURE_STATUS.md` |
| Runtime SDK direction | `07_FORGEUI_RUNTIME_SDK.md` |
| Native Spinbox model | `studio/src/forgeui/ForgeUIStandardSpinbox.ts` |
| Native Spinbox preview | `studio/src/forgeui/preview/StandardSpinboxPreview.tsx` |
| Native Spinbox Inspector | `studio/src/components/inspector/panels/components/SpinboxPanel.tsx` |

The Registry supplies Tray discovery and insertion metadata. Widget-specific
models, Inspectors and shared preview renderers normalize authoring data; the
single LVGL generator consumes the same serialized component graph for live and
Standalone Export. Do not create a parallel widget catalogue, preview-only
implementation or standalone-only generator.

Registry capability metadata is an explicit projection of the generator
contract. `supportsRuntimeApi` matches `publicApiDeclarations`;
`supportsUserEvents` matches `userEventHooks`; `acceptsUserInput` describes
native or artwork-backed user input; `isInteractiveAsset` replaces the former
ambiguous asset-only `interactive` flag; and `childOwnership` distinguishes
ordinary leaves, containers and generated structured children. Known LVGL
configuration dependencies are recorded for future Registry-driven gating but
do not yet generate sdkconfig.

`componentsList.ts` is not a widget catalogue. Its quarantined
AnimImage/ImageButton/Lottie/Menu/ObjxTempl/Editable types exist only for
legacy serialized compatibility. They are removed from active root-drop,
Inspector and AI capability surfaces, and export validation rejects them
instead of allowing a placeholder to masquerade as native LVGL.

Runtime API means a generated application-to-UI function declared in
`90_Studio_Export.h`. UserEvent means a generated UI-to-application callback
declared in `95_UserEvents.h`. Setters must not echo into UserEvents. Hooks must
not fire during construction, hydration or programmatic updates.

Native Spinbox reuses this generated numeric contract but remains distinct from
NumberInput. Spinbox is an LVGL integer-backed digit editor with decimal
placement, cursor/step selection and rollover. NumberInput remains the composed
textarea/stepper numeric entry and is the correct control for free-form numeric
text entry. Both generate silent value setters and genuine-user integer changed
hooks; neither is an alias for the other.

The Spinbox vertical slice is physically proven on ESP32-P4 with ESP-IDF 5.5.4
and LVGL 9.2.2. Ownership spans the Registry and Tray, shared Canvas/Browser
preview, Inspector, `ForgeUILvglExport.ts`, generated `90_Studio_Export.*`,
preservation-merged `95_UserEvents.*`, live firmware and Standalone Export.
Export preflight validates the generated artifact before build/export, and
usage plus project feature selection gate the emitted code and dependencies.

- The Layout Designer currently exposes Dashboard through the reusable
  template-definition architecture. Other professional layout names remain
  roadmap candidates.
- Apply Layout, smart regions, semantic assignment, Auto Arrange and template-aware AI Fill resolve into ordinary persisted ForgeUI components.
- Dashboard retains its existing region structure and composition behavior inside the shared implementation.
- The Widget Tray is driven by `ForgeUIWidgetRegistry.ts`; `ForgeUIWidgetSet.ts` is a compatibility projection rather than a second catalogue.
- Standard QR Code authoring, Canvas/Browser SVG preview, LVGL export and setter-only generated runtime are implemented.
- Focused Layout Designer, Widget Tray, hydration, registry, QR preview and exporter tests are passing at the recorded scope.
- QR Code generated C and the current clean ESP-IDF build are present; a recorded successful phone scan remains pending.
- `src/forgeui/boards/ForgeUIBoardRegistry.ts` owns the production Waveshare ESP32-P4 WiFi6 Touch LCD 7B profile. Persisted project hardware drives live and standalone export after hydration.
- `ForgeUILvglExport.ts` prunes disabled System runtime; `export-server.js` generates `00_ForgeUI_Features.h` and prunes CMake sources/components plus `idf_component.yml`.
- Wi-Fi Manager/dialogs and Storage UI/worker resources are demand-created and safely destroyed on Back. Their Wi-Fi/ESP-Hosted and SD backends remain separately alive.
- Diagnostics is implemented. Repeated operator lifecycle proof and a reproducible replacement for the overwritten managed-LVGL sysmon overlay edit remain open.

## Purpose

This is the permanent ownership, integration, extension and debugging map for ForgeUI Studio, its component and layout authoring layers, Interactive Asset Framework, Standard and System runtimes, hardware backends, generated LVGL runtime and export boundary. It describes the current implementation rather than its development history.

Use this document to answer:

- Where does the subsystem live?
- Which registry or definition is authoritative?
- Which file owns each responsibility?
- Which behavior is shared and which behavior is type-specific?
- What must not be duplicated?
- Where should debugging begin?
- How should another Interactive Asset type extend the framework?
- How should another built-in System page extend the System Runtime?
- How should another widget or Layout Designer template extend the existing registries?
- Which generated responsibilities belong to LVGL runtime generation and which belong to export transport?

## Proven system status

The framework currently has five implemented asset types:

```text
Shared Interactive Asset Framework
├── Interactive Button
├── Interactive Toggle Switch
├── Interactive Three-Position Toggle Switch
├── Interactive Light
└── Interactive Status Indicator
```

The shared framework is proven through:

- Studio creation and editing
- AI state-image generation
- Interactive Asset registration
- uploaded-asset registration and persistence
- Interactive Asset persistence
- Canvas assignment and rendering
- Studio preview
- LVGL export
- ESP-IDF build
- physical ESP32-P4 runtime where recorded below

All five Interactive Assets use the completed post-placement architecture: configured and unconfigured Inspector helpers, exact linked Creator reopening, registry-driven preview refresh, shared selection-border resizing with eight edge/corner hit zones, continuous Canvas clamping, live Inspector geometry, and component-authoritative geometry after placement. Rendered states record intrinsic dimensions and alpha-content bounds. Explicit `Fit Bounds to Visible Artwork` creates linked fitted assets while preserving originals and is idempotent. Canvas previews scale continuously with contain-fit rendering, and generated LVGL uses a common safe contain scale across each control's required states.

The Physical ESP32-P4 proof section records the current Button, Toggle Switch, Three-Position Toggle, Light and Status Indicator hardware results. Three-Position LEFT/CENTER/RIGHT touch selection, generated callback output and stable runtime are proven. Status Indicator Binary Output runtime, OFF/ON rendering, resized geometry, Browser Preview parity, centred contain-fit scaling and stable generated runtime are proven. State Sheet generation, linked crop editing and keyboard LVGL parity extend the proven Studio-to-runtime pipeline.

All five controls are separate discriminated models inside one framework. They share infrastructure. Interactive Button and Interactive Toggle Switch belong to the Interactive Input Runtime, Interactive Three-Position Toggle Switch owns the Three-Position Input Runtime, and Interactive Light and Interactive Status Indicator belong to the Binary Output Runtime.

ForgeUI now also includes a built-in System Runtime.

Currently implemented System pages:

- System Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

The System Runtime is proven across:

- Studio
- Browser Preview
- generated LVGL
- physical ESP32-P4 hardware

Current proven navigation:

```text
Application
→ System
→ Display
→ System
→ Wi-Fi Manager
→ System
→ Application
```

Display brightness is physically connected to the ESP32-P4 backlight through `bsp_display_brightness_set()`.

Display / Brightness and the complete Wi-Fi Manager are physically proven. The generated Wi-Fi System page supports Hosted scan execution, immediate AP count and record retrieval, live structured SSID list population, RSSI, security, Connected and Saved badges, network selection, open-network connection, protected-network password entry through the reusable native LVGL keyboard, validation, Connect, Disconnect, Reconnect, Forget Network and connected details including IP address, gateway, station MAC, AP BSSID and backend status/error projection. Scan and Refresh use the same backend path. Repeated scans atomically replace prior results without duplicate or stale SSID rows. Browser Preview provides deterministic hardware-independent parity while generated LVGL integrates with the live ESP32-P4 backend. Only minor visual polish remains.

Storage Browser functionality is physically proven. Its current lifecycle creates the page, timer, worker, queue and mutex on demand; Back performs an acknowledged asynchronous worker shutdown before deleting UI and RTOS resources. Repeated-cycle leak validation remains an operator boundary.

## System architecture

```text
Interactive Assets panel
  │
  ├── parent-owned selectedAssetKind
  │     ├── button          → Button designer
  │     ├── toggleSwitch    → shared OFF/ON designer
  │     ├── threePositionToggle → Three-Position designer
  │     ├── light           → Light designer
  │     └── statusIndicator → Status Indicator designer
  │
  ├── shared AI generator
  │     ↓
  │   shared AI image pipeline
  │     ↓
  │   Uploaded Asset Registry
  │     ↓
  │   LVGL image conversion
  │
  └── type-specific Save
        ↓
      Interactive Asset Registry
        ↓
      Interactive Asset Persistence
        ↓
      interactiveAssetId on Canvas component
        ↓
      kind-aware Canvas preview
        ↓
      generateForgeUILvglCode()
        ↓
      generated firmware
        ↓
      physical ESP32-P4 runtime
```

All five placed Interactive Assets follow one geometry ownership path:

```text
Canvas component
  -> owns final x/y/w/h
PreviewContainer
  -> owns selection, movement, resize zones, aspect locking and boundary clamping
type-specific Canvas preview
  -> resolves current registry state and measures artwork
Creator helper
  -> owns exact reopening and explicit visible-bounds fitting
linked fitted uploaded assets
  -> preserve original uploads
ForgeUILvglExport
  -> consumes final geometry and resolved state images
generated child image
  -> receives one safe contain-fit scale across all required states
```

Preview components consume placement geometry; they do not own it.

Direct Creator ownership:

```text
Canvas component
  ->
Right-click
  ->
Open Creator
  ->
Configured -> reopen exact linked asset
Unconfigured -> new unsaved draft
  ->
Type-scoped designer
  ->
Generate State Sheet where supported
  ->
Crop workspace
  ->
Save
  ->
Assign
```

`src/forgeui/ForgeUINavigation.ts` owns the private type-scoped navigation request contract for all five Interactive Assets. `src/components/editor/PreviewContainer.tsx` owns Canvas context-menu access and passes component identity plus any linked `interactiveAssetId`. `src/components/inspector/Inspector.tsx` mounts type-specific Creator helpers for incomplete components. Navigation opens the shared AI Studio portal without creating, registering, saving or assigning an asset.

## Layout Designer Architecture

Layout Designer is a Studio authoring subsystem. It creates and manages deterministic screen structure using normal ForgeUI components. It is separate from the Interactive Asset Framework, Standard LVGL Component Runtime, System Runtime, Hosted Connectivity Runtime, Storage Runtime and generated runtime API ownership.

```text
Layout Designer
  │
  ├── Template selection
  │     └── Dashboard
  │
  ├── Deterministic template geometry
  │
  ├── Smart Region Boxes
  │     ├── Header
  │     ├── Status
  │     ├── Main
  │     ├── Controls
  │     └── Footer
  │
  ├── Region assignment
  │
  ├── Auto Arrange
  │
  ├── AI Region Composer
  │
  └── Existing ForgeUI component model
          ↓
        Canvas
          ↓
        Browser Preview
          ↓
        LVGL Export
```

The ownership split is:

```text
AI Fill
  → chooses semantic content and region

Layout Designer
  → owns deterministic structure and geometry

Existing component model
  → owns editable persisted components

ForgeUILvglExport
  → owns generated LVGL
```

### Layout Designer ownership

`ForgeUILayoutTemplate` is the current concrete definition type (the repository's implemented `LayoutDefinition` pattern). It owns `id`, `name`, `description`, `useCases`, `aiGuidance`, design `width` and `height`, and the normal-component `layout` array. `ForgeUILayoutTemplateId` is the closed union of the six implemented IDs. `forgeUILayoutTemplates` is the authoritative library and `getForgeUILayoutTemplate()` is its lookup boundary.

Layout Designer owns structural template definitions, deterministic design-space geometry, smart-region metadata, stable semantic region keys, component-to-region assignment, child ordering, padding and gap configuration, arrangement modes, Auto Arrange geometry, template-aware AI composition, geometry validation before insertion and editable output through the normal Canvas component path. Shared composition and preview logic render the selected definition; there are not six independent renderers.

Layout Designer does not own Standard widget rendering, Interactive Asset rendering, LVGL runtime state, public `FG_Set_*` APIs, `FG_On_*` hooks, `95_UserEvents`, hardware backends, generated firmware files, Wi-Fi, SD, GPIO, sensors or application logic.

### Current template contracts

```text
Dashboard
├── dashboard.header
├── dashboard.status
├── dashboard.main
├── dashboard.controls
└── dashboard.footer
```

The implemented template ID is `dashboard`.

| Template | Stable semantic region suffixes |
|---|---|
| Dashboard | `header`, `status`, `main`, `controls`, `footer` |

Every definition creates real normal ForgeUI components. Dashboard continues to create its existing five Box regions, Divider and Heading placeholder. Region Boxes remain selectable, movable and resizable. The vector preview is derived from the same selected definition and design geometry; it is not raster artwork. Applied output remains editable and follows the normal undo/redo, persistence, Canvas, Browser Preview and export paths. Boxes remain Standard Box components; no layout-only firmware object family exists.

### Region metadata map

A Region Box stores `layoutRegionKey`. An assigned component stores `layoutRegionId`. A complete key is the template ID plus one suffix from the table, for example `dashboard.main` or `scada-overview.main-mimic`. Never replace these with generated component IDs or derive firmware identifiers from them.

Region metadata covers role, label, padding, horizontal gap, vertical gap, arrangement mode, columns, rows, minimum child width, minimum child height, ordering, structural lock, semantic surface role, semantic border role, radius, border width and opacity.

Metadata is additive and old projects without it remain valid. Region references use stable semantic keys rather than generated component IDs. Region relationships are currently flat metadata, not true serialized parent-child hierarchy. Structural lock is stored but does not yet prevent direct Canvas movement or resizing.

### Auto Arrange architecture

Supported modes are Vertical Stack, Horizontal Row, Grid, KPI Cards, Button Stack, Form Rows, Even Distribution and Fit to Region.

Auto Arrange owns only `x`, `y`, `w`, `h` and absolute placement. It preserves component type, serialized props, runtime identity, hook and API naming, asset references, region assignment, project IDs and Standard runtime semantics. It calculates child geometry from region bounds, padding, gaps, child count, preferred widget sizes, minimum touch-target sizes, arrangement mode, columns and rows.

### AI Region Composer architecture

Template mode uses this response contract:

```json
{
  "template": "dashboard",
  "title": "System Health",
  "regions": {
    "header": [],
    "status": [],
    "main": [],
    "controls": [],
    "footer": []
  }
}
```

AI Fill supplies canonical component type, supported props, semantic region, content and order or importance hints where supported. The selected definition's `aiGuidance` and semantic region list guide the request. AI does not own final pixel geometry.

`ForgeAIRegionComposer.ts` validates the `template` through `getForgeUILayoutTemplate()`, validates canonical component types and region names, creates the selected definition, flattens region content into normal components, assigns stable region metadata, Auto Arranges each region, validates the result and inserts it through the normal Canvas insertion path. `FORGEUI_LAYOUT_TEMPLATE: <template-id>` is the prompt marker. Legacy free-coordinate AI layout generation remains for compatibility, but it is not the primary template path.

### Persistence and export path

```text
Dashboard Template
  ↓
Normal ForgeUI components with additive region metadata
  ↓
Project serialization
  ↓
Save / Reload
  ↓
Canvas
  ↓
Browser Preview
  ↓
ForgeUILvglExport
  ↓
Generated LVGL
```

No second persistence or export format was added. Apply and AI Fill dispatch normal component insertion/update actions, so the existing `redux-undo` component history supplies undo/redo and the persisted component document supplies project restart behavior. Region metadata travels with normal component props and the existing component document remains authoritative. Canvas and Browser Preview render those components through their existing paths. `ForgeUILvglExport.ts` consumes final persisted `x/y/w/h` plus normal semantic props; generated firmware receives normal Boxes and controls rather than a separate Layout Designer runtime.

## System Runtime

```text
System Runtime
  │
  ├── Application Container
  ├── System Launcher
  ├── Display / Brightness
  ├── Wi-Fi Manager
  ├── Storage Browser
  ├── Native LVGL Keyboard
  └── Future Pages
```

System Launcher, Display / Brightness, Diagnostics, Wi-Fi Manager, Storage Browser and the reusable native LVGL keyboard are implemented. Launcher cards are emitted from enabled generated features; Bluetooth, Sound and Device are not always-generated disabled cards.

The System Runtime is not an Interactive Asset. It is not a user project screen. It is a reusable built-in platform layer generated alongside the user's application.

Studio and Browser Preview share typed System page state, current-session brightness and navigation. Generated LVGL keeps the Application, launcher, Brightness and enabled Diagnostics owners while demand-creating Wi-Fi and Storage UI. The application and its Interactive Assets remain instantiated while a System page is visible.

## Hosted Connectivity Runtime

```text
Hosted Connectivity Runtime
├── ESP-Hosted
├── Wi-Fi Remote
├── ESP32-C6 companion
├── SDIO Slot 1 transport
└── ForgeUI Wi-Fi backend
```

Hosted Connectivity Runtime is a built-in platform service. It is separate from Interactive Assets and user project screens, is consumed by the System Runtime, and is configured partly through ESP-IDF Kconfig and partly through the non-generated firmware backend. It must not be modelled as an Interactive Asset.

The physically proven transport split is:

```text
ESP-Hosted Wi-Fi
├── SDMMC Host Slot 1
├── CLK GPIO18
├── CMD GPIO19
├── D0 GPIO14
├── D1 GPIO15
├── D2 GPIO16
├── D3 GPIO17
└── ESP32-C6 reset GPIO54

SD Storage
├── SDMMC Host Slot 0
├── CLK GPIO43
├── CMD GPIO44
├── D0 GPIO39
├── D1 GPIO40
├── D2 GPIO41
├── D3 GPIO42
└── LDO channel 4 at 2500 mV
```

Slot 0 and Slot 1 use distinct GPIOs. The previous active SPI Hosted configuration was wrong for this board and prevented the ESP32-C6 transport from becoming active.

## Storage Runtime

Storage Runtime is a built-in platform service alongside Hosted Connectivity Runtime. It is separate from Interactive Assets and user project screens.

Storage Runtime owns:

- `firmware/ForgeUI-One/main/40_SD.c`
- `firmware/ForgeUI-One/main/40_SD.h`
- SDMMC Slot 0
- FAT filesystem
- SD mount
- directory enumeration
- empty-folder detection
- bounded directory model
- Refresh
- Read / Write Test
- Delete Empty Folder backend
- storage snapshot APIs

Generated LVGL owns:

- Storage page
- lazy page construction and reuse
- page navigation
- bounded reusable row pool
- paging
- Refresh button
- Read / Write Test button
- Select Item mode
- Delete Empty Folder workflow

The ownership split is:

```text
Generated UI
→ user intent

40_SD.c
→ filesystem truth
```

Filesystem logic must not move into generated LVGL, and `40_SD.c` must never own LVGL.

## Standard LVGL Component Runtime

ForgeUI has two independent generated widget runtime systems:

- Interactive Asset Runtime generates shared runtime families for artwork-backed Interactive Assets.
- Standard LVGL Component Runtime generates retained runtime APIs appropriate to ordinary LVGL widgets.

Standard components are not Interactive Assets. They do not use the Interactive Asset registry, persistence models, designers or artwork state machinery.

The current physical Standard validation group is proven across Canvas, Browser Preview, generated LVGL and ESP32-P4:

- Led
- Bar
- Arc
- Chart
- Table
- Keyboard
- Calendar
- Scale
- Roller
- MsgBox
- ButtonMatrix

The 2026-07-30 Standard input and selection group is also physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4:

- Input
- Textarea
- Checkbox
- Switch
- Radio
- Progress
- CircularProgress
- NumberInput
- Select
- Spinbox

TabView and TileView are **PROVEN**. Image, Box and IconButton remain
runtime-complete but outside these physical validation
milestones. Their existing automated and architectural status is unchanged.
The registry audit records 44 total entries, comprising 39 Standard widgets
and five Interactive Assets; physical proof is 29/39 Standard widgets (74%)
and 10 remain. Heading, Box and Divider joined the proven set this sprint;
Text and Icon remain **READY FOR FINAL HARDWARE RE-PROOF**.

### Current next-group parity architecture

- Canvas — shared artwork-aware preview and LVGL image-child export
- TabView — shared preview, serialized selected state and explicit geometry
- TileView — shared visible `2 × 2` panel contract
- Line — editable serialized endpoints with native `lv_line_set_points()`
- Text — shared renderer using semantic `textPrimary`
- Heading — shared renderer using semantic `textPrimary`
- Wi-Fi presentation — shared multiline renderer preserving `WIFI_FAIL`

TileView is physically proven; Canvas, Line, Text, Heading and the remaining
items in this parity group retain their separately documented evidence levels.

Interactive runtime components:

- ✓ Input
- ✓ Textarea
- ✓ Switch
- ✓ Checkbox
- ✓ Radio
- ✓ NumberInput
- ✓ Select
- ✓ IconButton

Output runtime components:

- ✓ Led
- ✓ Bar
- ✓ Arc
- ✓ Chart
- ✓ Progress
- ✓ CircularProgress
- ✓ Image
- ✓ Box

Previously completed runtime components:

- ✓ Keyboard
- ✓ Calendar
- ✓ Roller
- ✓ Message Box
- ✓ Button Matrix
- ✓ TabView
- ✓ Tileview

Completed serialized presentation properties:

- ✓ Button Text
- ✓ Text Value
- ✓ Heading Text
- ✓ Clock Presentation

Presentation/API-free:

- ✓ Scale
- ✓ Line
- ✓ Icon
- ✓ Divider

Slider has shared Canvas/Browser Preview interaction, native LVGL export, and a completed collision-safe generated runtime API. Spinner is a Registry-driven presentation widget with shared preview rendering and native LVGL export; it intentionally generates no runtime API or UserEvent.

```text
Standard LVGL Component Runtime
├── Scalar / visual output
│   ├── Led
│   ├── Bar
│   ├── Arc
│   ├── Progress
│   └── CircularProgress
├── Streaming output
│   └── Chart
├── Text entry
│   ├── Input
│   ├── Textarea
│   └── NumberInput
│       ├── outer container
│       ├── numeric textarea
│       ├── increment button
│       ├── decrement button
│       └── serialized step
├── Boolean / selectable input
│   ├── Switch
│   ├── Checkbox
│   └── Radio
├── Option selection
│   ├── Roller
│   ├── Select
│   ├── ButtonMatrix
│   ├── TabView
│   └── Tileview
├── Actions
│   └── IconButton
├── Visibility services
│   ├── Keyboard
│   ├── Message Box
│   └── Box
├── Date selection
│   └── Calendar
├── Runtime image output
│   └── Image
├── Serialized presentation
│   ├── Button
│   ├── Text
│   ├── Heading
│   └── Clock
└── API-free presentation
    ├── Scale
    ├── Line
    ├── Icon
    └── Divider
```

### Generated ownership

| File | Ownership |
| --- | --- |
| `90_Studio_Export.c` | Retained LVGL objects, retained runtime state, transition helpers, LVGL callbacks and public API implementations |
| `90_Studio_Export.h` | Public API declarations |
| `95_UserEvents.h` | Generated hook declarations |
| `95_UserEvents.c` | Developer hook bodies, preservation-merged in live firmware |
| `studio/export-server.js` | Declaration merge, missing-stub merge and preservation of existing developer function bodies |

Live Studio safely regenerates required hooks while preserving matching bodies and unrelated existing hooks. Missing declarations and stubs are appended. In a standalone export, the exported `95_UserEvents.*` files become developer-owned.

`ForgeUILvglExport.ts` owns generation for the older Standard components and for Input, Textarea, Switch, Checkbox, Radio, Progress, CircularProgress, NumberInput, Select, Image, Box and IconButton. This includes Circular Progress retained output runtime; Number Input outer-container, textarea and native stepper generation; Select closed-control and popup-list styling; Switch checked-state styling; and Checkbox/Radio fallback-label normalization. Interactive components retain their object and semantic state, expose guarded setters, adapt LVGL user events and contribute developer-hook metadata. Output components retain object/state and expose setters only. Serialized or API-free presentation contributes no runtime API.

## Standard LVGL Theme Runtime

The completed Standard semantic theme path is:

```text
Theme Manager
    |
    v
Semantic Theme Resolver
    |
    v
Canvas
    |
    v
Browser Preview
    |
    v
LVGL Export
    |
    v
Generated Firmware
    |
    v
ESP32-P4
```

Canvas and Browser Preview consume the same semantic palette. `ForgeUILvglExport.ts` exports the resolved roles into equivalent LVGL styles. The ESP32-P4 follows the selected theme after Generate -> Build -> Flash. Runtime live theme switching on the P4 was not added.

The theme runtime explicitly owns the stateful styles that native LVGL would otherwise supply: Switch checked-state track/indicator/knob styling; Select closed-control, arrow, popup and selected-row styling; Circular Progress remaining/completed arc styling; and Number Input container, field, stepper, divider, pressed, focused and disabled styling. Native LVGL blue/default leakage is explicitly overridden where required.

Semantic roles:

- `surface`
- `surfaceSecondary`
- `surfaceBorder`
- `textPrimary`
- `textSecondary`
- `accent`
- `accentText`
- `disabledText`
- `selectedSurface`

Decorative colours are no longer hard-coded for the proven Standard components. Semantic status colours, including the Standard LED green, intentionally remain independent where appropriate.

### Theme ownership

| File | Ownership |
| --- | --- |
| `src/forgeui/theme/ForgeThemeContext.tsx` | Supplies the active selected-theme palette to preview consumers |
| `src/forgeui/preview/forgeThemeMap.ts` | Resolves raw theme values into semantic roles and owns deterministic fallback/contrast behavior |
| `src/forgeui/preview/forgePreviewRenderer.tsx` | Passes the active semantic palette into shared Browser Preview renderers |
| `src/components/editor/ComponentPreview.tsx` | Connects Canvas Standard previews to the active palette |
| `src/forgeui/ForgeUILvglExport.ts` | Converts the resolved semantic roles into generated LVGL colour/style calls |

Shared Standard preview renderers consume semantic roles; they do not resolve or hard-code a separate decorative theme. Canvas and Browser Preview may retain separate interaction ownership, but their component visuals resolve from the same palette.

### Led

Serialized type `Led` generates `FG_Set_Status_LED(bool)` and `FG_On_Status_LED_Changed(bool)`. It retains the LED object and boolean state, uses `lv_led_on()` / `lv_led_off()`, and suppresses duplicate transitions.

This is not Interactive Light or Interactive Status Indicator. Those remain separate setter-only Binary Output Runtime assets with no changed hook.

### Bar

`FG_Set_Progress_Bar(int32_t)` and `FG_On_Progress_Bar_Changed(int32_t)` retain the Bar object, current value and range. The runtime uses `lv_bar_set_value()`, honors custom and negative ranges, clamps before comparison and suppresses duplicate effective transitions.

### Arc

`FG_Set_Value_Arc(int32_t)` and `FG_On_Value_Arc_Changed(int32_t)` retain the Arc object, current value and range and use `lv_arc_set_value()`. The existing LVGL knob and native touch behavior are preserved; this API did not add another input callback.

### Chart

`FG_Add_Data_Chart_Point(int32_t)` and `FG_Clear_Data_Chart(void)` generate Point Added and Cleared hooks. The runtime retains the native `lv_chart` and primary-Y series, uses `lv_chart_set_next_value()` for samples and `lv_chart_set_all_value()` for reset. The current implementation is intentionally single-series.

`ForgeUIStandardChart.ts` owns normalized Chart data plus shared responsive plot and axis geometry. `StandardChartPreview.tsx` uses that geometry for Canvas and Browser Preview. The exporter retains native `lv_chart`, reserves responsive Y and bottom gutters, and generates non-clickable sibling `lv_label` objects for Y-axis values and X-axis point indexes. X labels derive only from `0..pointCount - 1`; no category, date, timestamp or other X-axis semantics are invented.

### Table

Table remains a native data/presentation component with no invented runtime API. The proven semantic styling covers the main surface, cell surface, grid/border and primary text across shared previews and generated LVGL.

### Standard Canvas ownership

`src/forgeui/preview/StandardCanvasPreview.tsx` owns shared Canvas and Browser Preview rendering, configured artwork resolution, actual serialized asset-source selection, contain scaling, centred alignment, clipping, transparency and component-bound rendering.

`src/components/editor/ComponentPreview.tsx` owns Canvas integration, active semantic-palette injection, serialized property handoff and integration with the existing selection/movement wrapper.

`src/forgeui/preview/forgePreviewRenderer.tsx` owns Browser Preview integration, active-palette injection and current component geometry/property handoff.

`src/forgeui/ForgeUILvglExport.ts` owns the clipped parent `lv_obj`, child `lv_image`, generated-symbol resolution, image scale, centred placement and asset-source collection.

Invariant: the Canvas renderer must neither invent decorative SVG artwork nor discard configured artwork and emit only an empty surface. The exporter and uploaded-asset registry remain authoritative for generated image symbols. Generated `90_Studio_Export.c` is replaceable output and is not the source of this fix.

### Standard Canvas Keyboard

`FG_Show_Keyboard()` and `FG_Hide_Keyboard()` generate Shown and Hidden hooks and retain the standalone Standard keyboard. It is exported without an owned textarea and remains unattached by default. This eager standard component is not the reusable lazy System keyboard used by System/Wi-Fi dialogs.

### Calendar

`FG_Set_Calendar_Date()` and the Date Changed hook retain the Calendar and selected date. Dates are Gregorian-validated, including leap years. Touch and programmatic updates share retained transition state.

### Roller

`FG_Set_Option_Roller_Selected()` and `FG_On_Option_Roller_Changed()` retain the Roller object, selected index and option count. Normal and infinite modes are supported, and deterministic allocation produces collision-safe names.

### Message Box

The serialized `Msgbox` is a ForgeUI custom panel, not LVGL `lv_msgbox`. `FG_Show_Message()` and `FG_Close_Message()` generate Shown, Closed and Button Pressed hooks and retain the panel and visibility state.

### Button Matrix

`FG_Set_Menu_Matrix_Selected()` and `FG_On_Menu_Matrix_Button_Selected()` retain the matrix object, selected index and row-break-aware button count. The shared transition path supports disabled buttons, one-check mode, checked buttons, duplicate suppression, and touch/programmatic parity.

Initial Button Matrix verification used a stale running Studio exporter bundle. Restarting Studio regenerated the correct retained runtime through `/export`. This was a stale running generator bundle, not an exporter architecture split.

### TabView

`src/forgeui/preview/StandardTabViewPreview.tsx` owns shared Canvas and Browser Preview rendering for the three fixed tabs, serialized initial selection, direct preview switching, selected and inactive states, 34 px tab bar, equal/remainder tab widths, square outer bounds, explicit content area, accent bottom indicator and semantic text/surface roles.

`src/forgeui/ForgeUIStandardTabTileGeometry.ts` owns shared TabView and TileView geometry calculations.

`src/forgeui/ForgeUILvglExport.ts` owns explicit internal TabView geometry, retained selected index, the transition helper, existing setter and hook, generated semantic styling and native LVGL tab-selection behavior. Programmatic selection uses `lv_tabview_set_active(..., LV_ANIM_OFF)`; `LV_EVENT_VALUE_CHANGED` handling reads `lv_tabview_get_tab_active()`. The runtime suppresses repeated effective selections and generates collision-safe identifiers.

Browser Preview does not simulate native swipe animation. TabView remains
**PROVEN** on ESP32-P4.

### Tileview

Serialized type remains `Tileview`. The current ForgeUI TileView is native
swipe paging over a fixed `2 × 2` coordinate space:

- Tile 1 = column 0, row 0
- Tile 2 = column 1, row 0
- Tile 3 = column 0, row 1
- Tile 4 = column 1, row 1

`src/forgeui/preview/StandardTileViewPreview.tsx` owns the shared Canvas/Browser
single-active-page renderer, fixed `2 × 2` coordinate model, current selected
column/row, Browser swipe/keyboard navigation, semantic styling and label
centring. Canvas remains editor-safe.

`src/forgeui/ForgeUIStandardTabTileGeometry.ts` owns 8 px padding, 6 px gaps, equal row/column sizing, child coordinates/dimensions and clipping calculations.

`src/forgeui/ForgeUILvglExport.ts` owns native `lv_tileview_create()`, four
full-size `lv_tileview_add_tile()` pages, neighbour direction constraints,
retained selected row/column, the existing public setter/hook names, silent
startup/setter behavior and genuine-user `LV_EVENT_VALUE_CHANGED` handling.

Invariant: TileView is native LVGL swipe paging over a fixed `2 × 2`
coordinate space. One full-size tile is active at a time.

Physical ESP32-P4 proof confirms silent startup, correct coordinate reporting,
horizontal and vertical navigation, one callback per effective tile change,
stable repeated navigation, and callback coordinates `(1,0)`, `(0,0)`,
`(1,1)` and `(0,1)`. Wi-Fi remained connected, SD remained ready, and TabView,
Spinbox and List continued working. TileView is **PROVEN**.

### Input

Serialized `Input` exports native `lv_textarea` in single-line mode. The semantic theme pipeline and border parity are complete and physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4. Runtime owns current text only; placeholder and editing presentation remain serialized. `FG_Set_<Name>_Text(const char * text)` uses a per-instance guard and does not invoke `FG_On_<Name>_Changed(const char * text)`. Only genuine user edits notify.

Touch focuses the native textarea. No Standard Keyboard is attached automatically. The reusable System Runtime keyboard remains separate and private to System dialogs.

### Textarea

Serialized `Textarea` exports native multiline `lv_textarea` through the same completed semantic theme and border pipeline as Input. Canvas, Browser Preview, generated LVGL and ESP32-P4 parity are physically proven. Runtime owns current multiline text only; placeholder remains serialized. Its guarded text setter is silent, while genuine `LV_EVENT_VALUE_CHANGED` edits invoke the changed hook. Touch focuses the field; no Standard Keyboard is attached automatically.

### Switch

Serialized `Switch` exports native `lv_switch` and retains checked state. Exporter-generated semantic styling explicitly owns `LV_PART_MAIN`, `LV_PART_INDICATOR`, `LV_PART_INDICATOR | LV_STATE_CHECKED` and `LV_PART_KNOB`. The checked selector intentionally overrides native LVGL blue with the active `accent`; main track, default indicator, opacity and `accentText` knob are explicit. `FG_Set_<Name>_Checked(bool checked)` remains guarded and silent, and genuine user changes invoke the existing hook. ESP32-P4 checked-state proof is complete.

### Checkbox

Serialized `Checkbox` exports native `lv_checkbox`. Default fallback wording is removed, legacy fallback wording normalizes away, and explicit custom labels remain supported. Runtime owns checked state; its guarded setter remains silent and genuine user changes invoke the existing hook. Semantic theme parity and P4 proof are complete.

### Radio

Serialized `Radio` exports a retained `lv_checkbox` styled with a circular indicator. The default `"Radio"` label is removed, so the default is indicator-only; explicit custom labels remain supported. Canvas, Browser Preview, generated LVGL and P4 parity are complete. Runtime owns independent selected state and preserves the guarded silent setter and genuine changed hook. There is no grouping or mutual-exclusion architecture.

### Progress

Serialized `Progress` is an output-only native `lv_bar`. It has no touch interaction and no developer hook. Runtime owns current value/range, and the setter-only `FG_Set_<Name>_Value(int32_t value)` clamps and suppresses repeated effective values. Canvas, Browser Preview, generated LVGL and P4 are physically proven.

### CircularProgress

Serialized `CircularProgress` is an output-only native `lv_arc`. It retains object and value and exposes `FG_Set_<Name>_Value(int32_t value)` with clamping and repeated-value suppression. It generates no developer hook. Generated geometry is a 360-degree background arc rotated 270 degrees. The remaining arc uses `surfaceSecondary`, the indicator uses `accent`, widths and opacities are explicit, the knob is removed, and `LV_OBJ_FLAG_CLICKABLE` is cleared. It cannot be dragged. Canvas, Browser Preview, generated LVGL and P4 are physically proven.

### NumberInput

Serialized `NumberInput` is a composed LVGL control. A generated outer container owns the full bounds, 1 px semantic border, radius, background, outline and shadow policy. Its children are a retained numeric `lv_textarea`, increment `lv_button` and decrement `lv_button`. The rightmost stepper area has one vertical divider, and its buttons have one horizontal divider. Canvas and Browser Preview use the same outer-frame/divider structure.

Serialized `step` is consumed by native hardware callbacks; guarded `int64_t` intermediate arithmetic clamps against serialized minimum/maximum. Button-originated changes invoke the existing changed hook, while `FG_Set_<Name>_Value(int32_t value)` remains silent. The ownership map includes the generated container object as well as textarea/button objects. Hardware steppers and full Canvas/Browser/LVGL/P4 parity are physically proven.

### Select

Serialized `Select` exports native `lv_dropdown`. Ownership covers the closed control and its popup list returned by `lv_dropdown_get_list()`. The exporter explicitly styles `LV_PART_INDICATOR` for the semantic arrow and `LV_PART_SELECTED` with checked/pressed combinations for semantic selected rows. Closed border/background/text, focus/disabled states and popup surface/border/text are explicit, preventing native blue/default leakage. The existing guarded selected-index setter and genuine changed hook remain unchanged. Canvas, Browser Preview, generated LVGL and P4 are physically proven.

### Image

Serialized `Image` is output-only. LVGL-ready instances retain native `lv_image` and the current raw source pointer. `FG_Set_<Name>_Source(const void * src)` safely ignores `NULL`, unavailable objects and unchanged sources and generates no hook. Pending assets keep their placeholder and the setter safely no-ops. No asset-ID, path lookup or runtime conversion layer was added.

### QR Code

Serialized `QRCode` is a Standard output component. Its persisted properties own encoded text/data, foreground/background semantic colors and quiet-zone presentation. `StandardQRCodePreview.tsx` uses the `qrcode` package to render real encoded SVG modules for both Canvas and Browser Preview; no raster preview or decorative fake pattern is authoritative.

`ForgeUILvglExport.ts` emits the installed LVGL 9.2.2 QR path (`lv_qrcode_create`, `lv_qrcode_set_size`, dark/light colors and `lv_qrcode_update` with an explicit byte length). The managed component does not publicly expose `lv_qrcode_set_data` or `lv_qrcode_set_quiet_zone`. The default collision-safe public API remains `FG_Set_QR_Code_Text(const char * text)`. QR Code is setter-only output: it has no genuine-user hook and adds no `95_UserEvents` callback. `firmware/ForgeUI-One/sdkconfig.defaults` permanently owns `CONFIG_LV_USE_QRCODE=y`.

### Box

Serialized `Box` remains a presentation/layout container with runtime visibility only. Non-root generated Boxes retain the native object and visibility and expose `FG_Set_<Name>_Visible(bool visible)`. Children stay attached to the retained Box. Root screen Boxes are excluded. The setter suppresses repeated state and no hook exists.

### IconButton

Serialized `IconButton` is an interactive native button. Runtime owns enabled state only and generates `FG_Set_<Name>_Enabled(bool enabled)` plus `FG_On_<Name>_Clicked(void)`. Creation and setter calls are silent, and disabled buttons do not notify. Canvas remains selectable, draggable and resizable; Browser Preview uses temporary pressed state. Icon selection remains serialized and Image exclusively owns runtime source replacement.

### Slider Canvas interaction and runtime

The shared Slider Preview distinguishes Canvas editing from Browser interaction: track/thumb interaction uses temporary preview state, surrounding Canvas gestures can move the component, and project JSON is not mutated. Native export retains the `lv_slider` and emits `FG_Set_<Name>_Value(int32_t)` plus `FG_On_<Name>_Changed(int32_t)`. Signed ranges are normalized and clamped, initialization and programmatic updates are silent, repeated values are ignored, and the hook is reserved for genuine LVGL value changes.

### Native Spinner

Spinner is owned by the Widget Registry and appears in the Feedback Tray family. `StandardSpinnerPreview.tsx` is shared by Canvas and Browser Preview. `SpinnerPanel.tsx` edits duration, arc length, foreground/background arc widths, opacity and optional colour overrides while normal component geometry owns width and height. Export uses the installed LVGL 9 `lv_spinner_create()` and `lv_spinner_set_anim_params()` APIs with semantic theme fallbacks. Spinner is presentation-only: no retained public runtime object, setter, hook, `95_UserEvents` entry, helper C source or CMake entry is generated.

### Native Spinbox

`ForgeUIWidgetRegistry.ts` owns Spinbox Tray membership and capability metadata.
The Canvas acceptance path admits the registered type; the editor drag wrapper
isolates the field and helper buttons so clicks reach the preview without
starting a component move. `ForgeUIStandardSpinbox.ts` owns normalization and
`StandardSpinboxPreview.tsx` owns the shared Canvas/Browser representation.
Canvas changes are written through the component store so the preview and
Inspector remain synchronized instead of retaining stale local values.
`SpinboxPanel.tsx` owns signed range, value, power-of-ten step, digits, decimals,
rollover, alignment and styling controls.

`ForgeUILvglExport.ts` emits the native `lv_spinbox`, correctly positioned
increment/decrement helpers, retained per-instance state, collision-safe setter
and event adapter. `export-server.js` uses the same generator for live and
Standalone outputs, preservation-merges `95_UserEvents`, applies feature
gating, and runs export preflight validation. The proven public boundary is:

```c
void FG_Set_<Name>_Value(int32_t value);
void FG_On_<Name>_Changed(int32_t value);
```

The ESP32-P4 proof confirmed signed values, decimal display, rollover, clamp,
touch increment/decrement, multiple instances, silent programmatic setters and
exactly one changed hook per effective user action in live and Standalone
firmware.

### Scale inspection

The standard `Scale` is the visual LVGL 9 `lv_scale` tick/label renderer. It owns no runtime value, so it has no setter, hook or generator changes. Value APIs belong to controls that actually own values.

### Line inspection

The standard `Line` remains presentation-only and API-free. Its serialized endpoint fields are `startX`, `startY`, `endX` and `endY`.

`src/forgeui/ForgeUIStandardLine.ts` owns endpoint defaults and resolution, backward compatibility, bounding-box normalization, endpoint crossing, horizontal/vertical one-pixel bounds and the legacy fallback from start `(0,0)` to end `(width,height)`.

`src/components/editor/previews/StandardLineCanvasPreview.tsx` owns selected Canvas endpoint handles, pointer interaction, immediate redraw, `x` / `y` rebasing, `w` / `h` recalculation, normalized relative endpoints and coexistence with the existing whole-line movement wrapper.

`src/forgeui/preview/StandardLinePreview.tsx` owns shared endpoint-aware Canvas/Browser visual rendering, semantic `surfaceBorder` and line geometry presentation.

`src/components/inspector/panels/components/LinePanel.tsx` owns Start X, Start Y, End X, End Y and Line Width.

`src/forgeui/ForgeUILvglExport.ts` owns native output:

```c
static lv_point_precise_t <name>_pts[] = {
    {startX, startY},
    {endX, endY}
};

lv_obj_t * <name> = lv_line_create(parent);
lv_line_set_points(<name>, <name>_pts, 2);
lv_obj_set_pos(<name>, x, y);
```

Line retains no runtime object or semantic state and generates no public API or hook.

### Icon inspection

The standard `Icon` is a Studio authoring convenience for choosing artwork from the built-in icon library. Export resolves that selection through the existing image-symbol pipeline and emits a normal LVGL `lv_image`; Icon is not a distinct generated runtime family.

Icon remains serialized presentation and owns no runtime state. It generates no public setter and no `95_UserEvents` hook. Runtime image replacement belongs exclusively to the standard `Image` component through `FG_Set_<Image_Name>_Source(const void * src)`. Use Image, not Icon, when application code must swap an image at runtime.

### Divider inspection

The standard `Divider` is a visual separator only. It owns no runtime state, receives no meaningful application interaction, and generates no public API or `95_UserEvents` hook. Divider is intentionally part of the API-free presentation category with Scale, Line and Icon.

Dynamic visibility belongs to layout ownership. Place the Divider inside the relevant parent `Box` and use `FG_Set_<Parent_Box_Name>_Visible(bool visible)` instead of introducing a Divider-specific setter.

### Serialized presentation ownership

#### Button Text

Property `buttonText` is owned across the Button Inspector, Canvas Preview, Browser Preview, `ForgeUILvglExport.ts` and project JSON persistence. It controls visible label content only and generates no runtime API or hook.

#### Text Value

Property `textValue` is owned across the Text Inspector, shared `StandardTextPreview.tsx`, Canvas integration, Browser Preview, `ForgeUILvglExport.ts` and project JSON persistence. It controls visible LVGL label content only, uses semantic `textPrimary`, explicitly exports `lv_obj_set_style_text_color(...)`, and generates no runtime API.

#### Heading Text

Property `headingText` is owned across the Heading Inspector, shared `StandardHeadingPreview.tsx`, Canvas integration, Browser Preview, `ForgeUILvglExport.ts` and project JSON persistence. It controls visible heading content only, uses semantic `textPrimary`, explicitly exports the resolved LVGL text colour, and generates no runtime API.

#### Standard Wi-Fi presentation

`src/forgeui/preview/StandardWifiPreview.tsx` owns the shared Canvas/Browser three-line presentation. It preserves the established runtime vocabulary:

```text
WIFI
WIFI_FAIL
IP: -
```

`src/components/editor/ComponentPreview.tsx` and `src/forgeui/preview/forgePreviewRenderer.tsx` own Canvas and Browser integration respectively. Runtime polling and `fg_wifi_status_text()` remain authoritative for firmware state mapping. The presentation renderer must not substitute `DISCONNECTED`, introduce wrapping or create a fourth clipped visual line. No new runtime API or behavior is introduced.

#### Clock Presentation

Properties `hourFormat`, `showSeconds` and `blinkSeparator` are owned across the Clock Inspector, Canvas Preview, Browser Preview and `ForgeUILvglExport.ts`. RTC/system time owns the live value; Clock presentation owns formatting only. There is no editable Clock Time, runtime time setter or developer hook.

### Major files and focused tests

- `studio/src/forgeui/ForgeUILvglExport.ts`
- `studio/src/forgeui/ForgeUIStandardTabTileGeometry.ts`
- `studio/src/forgeui/ForgeUIStandardLine.ts`
- `studio/src/forgeui/ForgeUIStandardLine.test.tsx`
- `studio/src/forgeui/preview/StandardCanvasPreview.tsx`
- `studio/src/forgeui/preview/StandardTabViewPreview.tsx`
- `studio/src/forgeui/preview/StandardTileViewPreview.tsx`
- `studio/src/forgeui/preview/StandardLinePreview.tsx`
- `studio/src/forgeui/preview/StandardTextPreview.tsx`
- `studio/src/forgeui/preview/StandardHeadingPreview.tsx`
- `studio/src/forgeui/preview/StandardWifiPreview.tsx`
- `studio/src/components/editor/previews/StandardLineCanvasPreview.tsx`
- `studio/src/components/inspector/panels/components/LinePanel.tsx`
- `studio/src/forgeui/ForgeUILvglExport.led.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.bar.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.arc.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.chart.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.keyboard.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.calendar.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.roller.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.msgbox.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.buttonmatrix.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.tabview.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.tileview.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.button.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.text.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.heading.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.clock.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.input.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.textarea.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.switch.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.checkbox.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.radio.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.progress.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.numberinput.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.select.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.image.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.box.test.ts`
- `studio/src/forgeui/ForgeUILvglExport.iconbutton.test.ts`
- `studio/src/forgeui/preview/StandardSwitchPreview.tsx`
- `studio/src/forgeui/preview/StandardCheckboxPreview.tsx`
- `studio/src/forgeui/preview/StandardRadioPreview.tsx`
- `studio/src/forgeui/preview/StandardSliderPreview.tsx`
- `studio/src/forgeui/preview/StandardNumberInputPreview.tsx`
- `studio/src/forgeui/preview/StandardSelectPreview.tsx`
- `studio/src/forgeui/preview/StandardIconButtonPreview.tsx`
- `studio/src/forgeui/ForgeUIStandardButton.ts`
- `studio/src/forgeui/ForgeUIStandardText.ts`
- `studio/src/forgeui/ForgeUIStandardHeading.ts`
- `studio/src/forgeui/ForgeUIStandardClock.ts`
- `studio/src/components/inspector/panels/components/ButtonPanel.tsx`
- `studio/src/components/inspector/panels/components/StandardTextPanel.tsx`
- `studio/src/components/inspector/panels/components/HeadingPanel.tsx`
- `studio/src/components/inspector/panels/components/ClockPanel.tsx`
- `studio/src/components/editor/previews/ButtonPreview.tsx`
- `studio/src/components/editor/previews/TextPreview.tsx`
- `studio/src/components/editor/previews/HeadingPreview.tsx`
- `studio/src/components/editor/previews/ClockPreview.tsx`
- `studio/export-server.js`
- `studio/export-server.test.js`

## Project Health Architecture

ForgeUI has two permanent project-health layers. They protect the maintainability of the Studio and the integrity of generated firmware without replacing any Interactive Asset ownership boundary documented below.

### Phase 1 — Behaviour-preserving maintenance

Phase 1 established the project baseline:

- TypeScript compiles with zero diagnostics.
- ESLint completes with zero warnings and zero errors.
- The Jest baseline is explicit and repeatable.
- Duplicate implementation and registry paths were consolidated.
- Local property contracts and Canvas default-property types were corrected.
- Obsolete debug logging and workshop artifacts were removed.

No runtime behaviour changed. Phase 1 made the existing architecture cleanly type-checkable, lintable, testable, and easier to debug.

### Phase 2 — Permanent export safety

Phase 2 adds validation and reference protection around the established Canvas, Interactive Asset, uploaded-asset, exporter, and firmware-generation paths.

#### Client Export Preflight

The client preflight owns validation of:

- Canvas component identity and dimensions
- Interactive Asset existence, kind, dimensions, and required state images
- uploaded-asset existence and LVGL readiness
- generated Button hooks and Binary Output public setter APIs
- generated Toggle hooks, Three-Position hooks, enum and runtime contracts
- duplicate component IDs, APIs, symbols, and declarations
- relative generated asset-source paths and referenced-source coverage

If client validation fails, export is cancelled before server submission. Diagnostics are grouped by the ownership area that must be repaired.

#### Server Export Validation

`export-server.js` independently owns:

- export payload validation
- generated C-source validation
- relative path validation
- generated source existence validation
- symbol and source-reference validation
- production of the validated asset-source list
- validation before any filesystem write

The server does not trust client validation. No generated firmware or CMake mutation occurs before server validation succeeds.

#### Export Pipeline

```text
Canvas
    ↓
Interactive Asset Resolution
    ↓
Client Export Preflight
    ↓
POST /export
    ↓
Server Export Validation
    ↓
Validated Asset Sources
    ↓
Generate LVGL
    ↓
Generate CMake
    ↓
ESP-IDF Build
    ↓
Flash
    ↓
ESP32-P4
```

## Core data model

### Shared fields

All Interactive Assets share these concepts:

- `schemaVersion`
- `id`
- `name`
- `kind`
- `interactionMode`
- `createdAt`
- `updatedAt`
- `width`
- `height`
- references to uploaded visual-state assets

The root discriminated union is `ForgeUIInteractiveAsset`.

Current discriminants:

```text
kind: button
interactionMode: momentary

kind: light
interactionMode: state

kind: statusIndicator
interactionMode: state

kind: toggleSwitch
interactionMode: state

kind: threePositionToggle
interactionMode: state
```

Do not flatten momentary, binary input, three-position input and binary output assets into one state model. Add another discriminated-union member only when a new persisted type is implemented.

## Source map and ownership

Paths in this section are relative to `studio/` unless stated otherwise.

### Widget Registry and Tray

#### `src/forgeui/widgets/ForgeUIWidgetRegistry.ts`

This is the authoritative Standard/Interactive widget catalogue. `ForgeUIWidgetDefinition` owns canonical `type`, display and search metadata, category, default dimensions and properties, `insertionFactory`, capability flags, optional documentation ID and availability status. `FORGEUI_WIDGET_CATEGORIES`, `forgeUIWidgetDefinitions`, `getForgeUIWidgetDefinition()` and `searchForgeUIWidgets()` are the public registry surface. Add a normal widget here instead of creating another tray list.

#### `src/forgeui/ForgeUIWidgetSet.ts`

Compatibility projection for consumers that still need the older widget-set shape. It must derive from the registry and must not become a second source of widget names, categories, defaults or insertion behavior.

#### `src/components/sidebar/Sidebar.tsx`

Owns the registry-driven tray presentation: category counts, search, Standard widget rows, the compact empty Dashboard category and persisted Interactive Asset rows. It dispatches the normal insertion action, so click and keyboard insertion participate in the same component history as drag/drop. Tray-local asset UI state is not a component serialization format.

#### `src/components/sidebar/DragItem.tsx`

Owns one accessible draggable/insertion row. Keep the insertion target and optional asset Edit action as separate interactive controls; do not nest buttons.

#### `src/hooks/useDropComponent.ts`

Owns drag/drop conversion into ordinary absolute-positioned components. Registry defaults and `insertionFactory` belong upstream in the registry; Canvas-relative drop coordinates and dispatch belong here.

#### `src/forgeui/widgets/ForgeUIWidgetRegistry.test.ts`, `src/components/sidebar/Sidebar.test.tsx` and `Sidebar.hydration.test.tsx`

Own catalogue coverage, search/category behavior, accessible insertion, undo/redo, asset action separation, narrow-tray overflow/ellipsis/sticky behavior and server/client hydration proof.

### Layout Designer

#### `src/forgeui/layout/ForgeUILayoutDesigner.ts`

Owns the six `ForgeUILayoutTemplate` definitions, deterministic template geometry, smart-region metadata, template lookup, region lookup and assignment, shared Auto Arrange modes, geometry updates and composition helpers. Add another layout by adding one definition and extending `ForgeUILayoutTemplateId`, not by creating another renderer.

#### `src/forgeui/layout/ForgeUILayoutDesigner.test.ts`

Owns focused validation for deterministic geometry, region bounds, overlap prevention, stable keys, assignment, Auto Arrange modes and metadata compatibility.

#### `src/forgeui/layout/ForgeUILayoutDesigner.preview.test.tsx`

Owns Browser Preview proof for smart-region Boxes.

#### `src/components/inspector/LayoutRegionInspector.tsx`

Owns Inspector controls for region assignment, arrangement mode, padding, columns, horizontal and vertical gaps, structural-lock metadata and Auto Arrange Region.

#### `src/components/inspector/Inspector.tsx`

Owns Layout Region Inspector mounting and integration with the selected Canvas component.

#### `src/core/models/components.ts`

Owns atomic multi-component geometry updates used by Auto Arrange while preserving existing component metadata.

#### `src/core/models/components.test.ts`

Owns focused reducer proof that Auto Arrange geometry updates preserve region metadata and component props.

#### `src/forgeui/ai/ForgeAIRegionComposer.ts`

Owns selected-template region-document validation, canonical type validation, semantic-region resolution, flattening region documents into normal ForgeUI components and region-assignment metadata.

#### `src/forgeui/ai/ForgeAIRegionComposer.test.ts`

Owns focused canonical-contract and region-composition tests.

#### `src/forgeui/ai/ForgeAIClient.ts`

Accepts both legacy layout documents and template-aware region documents.

#### `src/forgeui/ai/ForgeAIEngine.ts`

Parses `FORGEUI_LAYOUT_TEMPLATE: <template-id>`, coordinates the selected template composition and retains the existing AI generation paths.

#### `src/forgeui/ai/ForgeAIPrompts.ts`

Owns the template-aware AI response contract and one-screen semantic-region instructions.

#### `src/forgeui/ai/ForgeAIPanel.tsx`

Owns the Layout Designer selector, shared vector structural preview, Apply Layout, template-specific AI Fill request and integration with Generated Result and Canvas insertion.

#### `src/pages/api/forgeui-ai-layout.ts`

Accepts and returns validated legacy layout documents and template-aware region documents.

#### `src/components/editor/ComponentPreview.tsx`

Owns Canvas rendering integration for semantic Region Box styling.

#### `src/forgeui/preview/forgePreviewRenderer.tsx`

Owns Browser Preview rendering for semantic Region Boxes and assigned normal components.

#### `src/forgeui/ForgeUILvglExport.ts`

Continues to own LVGL export. For Layout Designer work it consumes normal components and semantic Box props; it does not own template selection, region assignment or Auto Arrange.

#### `../docs/FORGEUI_LAYOUT_DESIGNER.md`

Owns the detailed manual workflow and Layout Designer architecture reference.

### Standard QR Code

#### `src/forgeui/preview/StandardQRCodePreview.tsx`

Owns shared Canvas/Browser QR encoding and SVG module rendering. It consumes persisted QR props and semantic fallback colors; it does not own native export.

#### `src/components/inspector/panels/components/QRCodePanel.tsx`

Owns QR-specific authoring controls. Changes remain normal component-property updates and therefore use ordinary component persistence and history.

#### `src/forgeui/ForgeUILvglExport.ts`

Owns native LVGL QR construction, retained data-update behavior, collision-safe `FG_Set_<Name>_Text` declaration/implementation and output-only classification.

#### `src/forgeui/ForgeUILvglExport.qrcode.test.ts`, `src/forgeui/preview/StandardQRCodePreview.test.tsx` and `../docs/FORGEUI_QR_CODE.md`

Own focused generated-runtime assertions, preview/persistence parity and the manual QR workflow/reference. The official implementation reference is the protected LVGL 9.2.2 source at `C:\ForgeUI\Projects\References\LVGL-9.2.2`.

### Hosted configuration and firmware backend

#### `firmware/ForgeUI-One/sdkconfig.defaults`

This repository-level file owns the permanent ForgeUI firmware baseline for:

- ESP-Hosted enabled
- SDIO host interface
- SDMMC Slot 1
- 4-bit bus
- 40000 kHz
- GPIO18/19/14/15/16/17
- reset GPIO54
- active-high reset
- 1500 ms reset delay
- reset on every host boot
- restart transport on failure
- Wi-Fi Remote Hosted backend
- ESP32-C6 slave target
- PSRAM XIP disabled

`sdkconfig` is the generated effective configuration and may be ignored by Git. `sdkconfig.defaults` is the permanent source of the required golden Hosted baseline.

#### `firmware/ForgeUI-One/dependencies.lock`

This repository-level file owns the exact resolved component graph. The physically proven relevant versions are:

- ESP-IDF 5.5.4
- `esp_hosted` 2.9.7
- `esp_wifi_remote` 1.3.0
- Waveshare BSP 1.0.2

EPPP transitive components may be present while the active Wi-Fi Remote library remains Hosted.

#### `firmware/ForgeUI-One/main/30_WIFI.c` and `30_WIFI.h`

The non-generated Wi-Fi backend owns:

- `fg_wifi_state_t`
- `fg_wifi_result_t`
- `fg_wifi_security_t`
- `fg_wifi_network_t`
- `fg_wifi_snapshot_t`
- `esp_netif_init()`
- default event-loop creation
- default STA netif creation
- `esp_wifi_init()`
- STA mode and Wi-Fi start
- event handling
- scan intent submission through `fg_wifi_scan_start()`
- a dedicated FreeRTOS Wi-Fi backend task that owns Hosted scan execution
- blocking Hosted scan execution in the backend task
- immediate AP count and AP record retrieval in the same task after scan completion
- a fixed-size structured scan cache of at most `FG_WIFI_MAX_SCAN` records
- owned `fg_wifi_network_t` storage with no surviving temporary AP-record or SSID pointers
- SSID deduplication with strongest-record retention
- connected-first and RSSI-descending sorting
- atomic complete-model replacement under a critical section
- stale-result clearing before re-scan
- connection timeouts
- structured operation results and authentication/generic error projection
- open- and protected-network connection handling
- Connect, Disconnect, Reconnect and Forget intent
- current SSID, IP address, gateway, RSSI and security
- station MAC and AP BSSID
- scan-in-progress, connection and saved-network state
- one persisted ESP-IDF STA configuration
- reconnect intent and forget intent
- flash-backed credential clearing

The structured public boundary includes the exact implemented APIs:

- `fg_wifi_get_snapshot()`
- `fg_wifi_get_networks()`
- `fg_wifi_connect_network()`
- `fg_wifi_reconnect()`
- `fg_wifi_forget()`
- `fg_wifi_security_text()`

Its locked execution rule is:

```text
Generated Scan or Refresh callback
→ fg_wifi_scan_start()
→ dedicated Wi-Fi backend task
→ blocking ESP-Hosted scan
→ immediate AP count and record retrieval
→ deduplicate and sort owned network records
→ atomic model replacement

LVGL timer
→ reads completed snapshot/network model
→ updates labels and pooled row visibility
→ refreshes list layout
```

`fg_wifi_pump()` retains connection-timeout service but does not retrieve scan results. The LVGL/System projection reads completed snapshots only. The backend owns all physical Wi-Fi truth and does not own LVGL or Studio UI.

ESP-IDF supports one persisted STA configuration in the current implementation. `esp_wifi_set_config()` uses flash-backed Wi-Fi storage when a network is remembered. Physical Saved badges reflect that real configuration, and `fg_wifi_forget()` clears the persisted STA configuration. ForgeUI does not currently implement a multi-network credential database.

#### `firmware/ForgeUI-One/main/main.c`

This file owns boot order only. The proven normal sequence is:

```text
fg_wifi_init()
vTaskDelay(pdMS_TO_TICKS(2500))
fg_sd_init()
fg_sd_test()
```

Wi-Fi must initialize before SD.

#### `firmware/ForgeUI-One/main/40_SD.c`

This file owns:

- `fg_sd_init()`
- `fg_sd_test()`
- `fg_sd_get_snapshot()`
- `fg_sd_list_directory()`
- `fg_sd_delete_empty_folder()`
- directory enumeration
- filesystem operations
- SDMMC Slot 0
- FAT

It does not configure or manipulate ESP-Hosted and must never own LVGL.

### System Runtime

#### `src/forgeui/system/ForgeUISystemContext.tsx`

Owns:

- the typed `ForgeUISystemPage` model
- current System page
- current-session brightness value
- deterministic Browser Preview Wi-Fi session state
- structured preview network records with SSID, RSSI, security, Connected and Saved state
- selected and connected network state
- scan progress and a fixed deterministic RSSI sequence
- open-network connection
- protected-network password-dialog state and password validation result projection
- remember-password result projection
- deterministic authentication failure
- preview Disconnect, Reconnect and Forget behavior
- connected details including IP, gateway, station MAC and AP BSSID
- open navigation
- close navigation
- Back navigation
- `openSystemLauncher()`
- `openSystemPage()`
- `closeSystemInterface()`
- `goBackInSystemInterface()`

The context owns session state and navigation intent. Its Wi-Fi data is simulated and deterministic for Browser Preview; it never controls physical hardware. Password text, masking visibility and the local Remember checkbox are presentation state in `ForgeUIWifiPage.tsx`, while the context owns the dialog target and consumes password and remember intent. It does not render pages, mutate user project screens, register Interactive Assets or generate LVGL.

#### `src/forgeui/system/ForgeUISystemSurface.tsx`

Owns:

- full-screen System rendering
- the visible gear launcher in Studio and Browser Preview
- System Launcher layout
- Display / Brightness page layout
- enabled Wi-Fi launcher card
- Wi-Fi page shell and shared System navigation
- mounting the dedicated Wi-Fi Browser Preview page
- navigation UI
- live preview brightness rendering
- disabled future-page cards

The surface consumes the shared context. Browser Preview Wi-Fi data is simulated and deterministic. The surface does not own generated hardware navigation or become part of the user component tree.

#### `src/forgeui/system/ForgeUIWifiPage.tsx`

Owns the dedicated Browser Preview Wi-Fi presentation:

- status and connected details
- structured SSID rows with RSSI and security
- Connected and Saved badges
- selected-network presentation
- password dialog and local password masking state
- password Show / Hide
- Connect and Cancel controls
- Disconnect, Reconnect and Forget controls
- deterministic preview interaction through `ForgeUISystemContext`

This component presents and sends Browser Preview intent only. It does not own the physical backend, ESP-IDF calls, generated LVGL or persisted firmware credentials.

#### `src/forgeui/system/ForgeUIStoragePage.tsx`

Owns:

- Browser Preview Storage page
- Storage UI state
- paging
- Select Item mode
- Delete Folder workflow
- Browser Preview parity

This component presents Browser Preview state and intent only. It does not own the physical filesystem, SDMMC, generated LVGL or firmware Storage backend.

#### `src/forgeui/system/index.ts`

Owns the public System Runtime module exports.

#### `src/components/editor/Editor.tsx`

Hosts `ForgeUISystemSurface` at the Studio device boundary. It does not own System state or page implementation.

#### `src/forgeui/preview/DevicePreview.tsx`

Hosts the same `ForgeUISystemSurface` at the Browser Preview device boundary. It does not maintain a separate navigation model.

#### `src/pages/_app.tsx`

Owns the shared `ForgeUISystemProvider` boundary above Studio and Browser Preview.

### Shared Interactive Asset framework

#### `src/forgeui/interactive/ForgeUIInteractiveAsset.ts`

Owns:

- `FORGEUI_INTERACTIVE_SCHEMA_VERSION`
- `ForgeUIInteractiveAssetKind`
- `ForgeUIInteractiveInteractionMode`
- shared base fields
- the `ForgeUIInteractiveAsset` discriminated union
- kind-to-model extraction types

Extend this union when adding a persisted Interactive Asset kind.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetIds.ts`

Owns Interactive Asset ID creation through `createInteractiveAssetId()`.

Do not introduce a type-specific ID generator for any current Interactive Asset kind.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetRegistry.ts`

Owns the in-memory lifetime of every Interactive Asset kind.

Key responsibilities:

- register assets
- look up assets by ID
- perform kind-aware lookup
- list all assets
- update assets
- remove assets
- clear the registry
- import and export registry data

Important APIs include:

- `registerInteractiveAsset()`
- `getInteractiveAsset()`
- `getInteractiveAssetByKind()`
- `getInteractiveButtonAsset()`
- `getInteractiveLightAsset()`
- `getInteractiveStatusIndicatorAsset()`
- `getInteractiveToggleSwitchAsset()`
- `getInteractiveThreePositionToggleAsset()`
- `getAllInteractiveAssets()`
- `updateInteractiveAssetByKind()`
- `removeInteractiveAsset()`
- `importInteractiveAssets()`
- `exportInteractiveAssets()`

Validation occurs at registry boundaries. Kind-aware access prevents any of the five asset models from resolving as another kind.

Do not create a parallel registry for another Interactive Asset type.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetPersistence.ts`

Owns serialization and reload of the shared registry.

Storage key:

```text
forgeui_interactive_assets_v1
```

Key APIs:

- `saveInteractiveAssets()`
- `reloadInteractiveAssets()`
- `clearInteractiveAssetStorage()`

Button, Toggle Switch, Three-Position Toggle, Light and Status Indicator records are stored under the same versioned key. Do not introduce a separate persistence store for each kind.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetValidation.ts`

Owns:

- shared base validation
- Button validation
- Light validation
- Status Indicator validation
- Toggle Switch validation
- Three-Position Toggle validation
- discriminated dispatch through `validateInteractiveAsset()`

Exact type validators include `validateInteractiveToggleSwitchAsset()` and `validateInteractiveThreePositionToggleAsset()`.

New kinds should add type-specific validation and join the existing dispatch. Validation must remain centralized at framework boundaries.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetResolver.ts`

Owns pure resolution and component-assignment helpers:

- uploaded asset lookup by ID
- Button Normal/Pressed resolution
- Light OFF/ON resolution
- Status Indicator OFF/ON resolution
- Toggle Switch OFF/ON resolution
- Three-Position LEFT/CENTER/RIGHT resolution
- LVGL-ready checks
- kind-specific dimensions
- component property mapping
- Light initial-state fallback
- Status Indicator initial-state fallback
- Toggle Switch initial-state fallback
- Three-Position initial-state fallback
- dimensions and assignment mapping for all five kinds

Exact Toggle helpers include:

- `resolveInteractiveToggleSwitchVisuals()`
- `getInteractiveToggleSwitchInitialState()`
- `getInteractiveToggleSwitchDimensions()`
- `getInteractiveToggleSwitchComponentProps()`

Exact Three-Position helpers include:

- `resolveInteractiveThreePositionVisuals()`
- `getInteractiveThreePositionInitialState()`
- `getInteractiveThreePositionDimensions()`
- `getInteractiveThreePositionComponentProps()`

Canvas assignment helpers resolve:

```text
interactiveAssetId
w
h
```

Fresh unconfigured placeholders may conditionally adopt resolved asset dimensions. Deliberately resized unconfigured components preserve their geometry, as do configured components during asset replacement. Component geometry is authoritative after placement. Light uses its implemented explicit untouched-default rule to distinguish a fresh placeholder from established geometry; no unsupported dirty-state metadata is assumed. Resolvers do not mutate registries or Redux state.

#### `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`

Owns reusable state-set artwork-bounds behavior:

- validating measured intrinsic dimensions and alpha-content bounds
- validating that required measurements use compatible source dimensions
- calculating one stable union across two or more measured visual states
- mapping that union into component geometry
- generating linked cropped uploaded assets for the required states
- preserving the original uploaded assets
- recording full-content metadata on completed fitted assets when requested
- detecting already-completed fitted state idempotently

Button and Light retain their type-named compatibility APIs over this implementation. Toggle, Status Indicator and Three-Position use the compatible shared state-set operations directly. Do not rename this file merely because its implementation supports stable unions beyond two states, and do not duplicate alpha-union, crop-canvas or linked-conversion logic.

#### `src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`

Owns Button-facing Normal/Pressed names and error contracts over the shared two-state visible-bounds implementation.

#### `src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`

Owns Light-facing OFF/ON names, linked fitted-asset prefixes and error contracts over the shared two-state visible-bounds implementation.

#### `src/forgeui/interactive/index.ts`

Owns the public module surface for the Interactive Asset subsystem.

Consumers should import established framework APIs from this barrel where practical instead of reaching into internal files unnecessarily.

### Unified Studio UI

#### `src/forgeui/ForgeUINavigation.ts`

Owns the private Creator navigation dispatcher and its type-scoped request contract:

- Button Creator target
- Toggle Creator target
- Light Creator target
- Status Indicator Creator target: `interactive-status-indicator-designer`
- Three-Position Creator target
- source Canvas component ID
- optional linked Interactive Asset ID
- unique request ID
- type-scoped request isolation

`openStatusIndicatorCreator()` carries the Status Indicator source component ID and optional linked Status Indicator asset ID through the same private dispatcher used by the other Creators.

Do not replace this with public URL routing or let one Creator consume another type's edit request.

#### `src/components/editor/PreviewContainer.tsx`

Owns Canvas right-click Creator access for Button, Toggle Switch, Three-Position Toggle, Light and Status Indicator. It selects the source component, opens a portal-based context menu, dismisses it on outside click or Escape, replaces any existing Canvas Creator menu, and dispatches configured or unconfigured navigation without mutating assets. It also owns the shared selection-border resize interaction, eight edge/corner hit zones, pointer capture lifecycle, resize-versus-drag separation and continuous Canvas-boundary clamping. Status Indicator exposes `Open Status Indicator Creator`.

#### `src/components/inspector/Inspector.tsx` and Creator helpers

Inspector mounts five type-specific Creator helpers above Position Mode and the general geometry panels. Every helper remains a valid configured workflow surface. Unconfigured, incomplete and missing-link states receive onboarding, repair or recovery guidance; configured states reopen the exact linked asset and own explicit visible-bounds fitting.

`src/components/inspector/InteractiveButtonCreatorHelper.tsx` owns the live generated callback preview, inline duplicate warning, exact linked-asset reopening and Button `Fit Bounds to Visible Artwork` action.

`src/components/inspector/InteractiveLightCreatorHelper.tsx` owns configured and incomplete Light helper states, exact linked-asset reopening and Light `Fit Bounds to Visible Artwork` action.

`src/components/inspector/InteractiveToggleCreatorHelper.tsx` owns unconfigured onboarding, incomplete repair guidance, missing-link recovery, configured asset summary, exact linked Toggle reopening, initial-state and OFF/ON summary, and `Fit Bounds to Visible Artwork`.

`src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx` owns unconfigured onboarding, incomplete repair guidance, missing-link recovery, configured asset summary, exact linked Status Indicator reopening, initial-state and OFF/ON summary, `Fit Bounds to Visible Artwork`, disabled measurement guidance and already-fitted idempotent guidance.

`src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx` owns unconfigured onboarding, incomplete repair guidance, missing-link recovery, configured asset summary, exact linked asset reopening, initial-state and LEFT/CENTER/RIGHT summary, and `Fit Bounds to Visible Artwork`.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`

Owns the framework-level Studio experience:

- loading the shared Interactive Asset registry
- loading and refreshing uploaded assets
- filtering the shared asset list by `asset.kind`
- the single `+ New Interactive Asset` action
- the single Asset Type selector
- parent-owned `selectedAssetKind`
- opening the selected designer
- initializing the selected draft
- Button draft and save behavior
- Button `200 × 100` new-draft defaults
- lowest-available normalized `Button N` Label selection across registered Button assets
- coordinating the Light designer
- coordinating the Status Indicator designer
- coordinating the Toggle Switch path through the shared OFF/ON designer
- coordinating the dedicated Three-Position Toggle designer
- consuming Button, Toggle, Light, Status Indicator and Three-Position direct Creator requests
- separating configured edit requests from unconfigured new-draft requests
- type-scoped edit-request replacement
- Inspector onboarding handoff
- Canvas context-menu editing handoff
- editing existing Button assets
- Button `Use on Selected`

The UI is:

```text
+ New Interactive Asset

Asset Type
○ Button
○ Toggle Switch
○ Three-Position Toggle
○ Light
○ Status Indicator
```

`selectedAssetKind` is the single source of truth for:

- active designer
- draft initialization
- AI generation mode
- visible form

Editing an existing asset selects its `button`, `toggleSwitch`, `threePositionToggle`, `light`, or `statusIndicator` kind, opens the owning designer, and loads that kind's draft.

Type selection is disabled while AI generation is in progress. This prevents an asynchronous result for one kind from being mapped into another kind's draft.

The panel coordinates the designers; it does not merge their models or save logic.

Configured Status Indicator edit requests resolve only against `statusIndicatorAssets`; wrong-kind IDs are rejected. Unconfigured requests initialize a fresh Status Indicator draft. The request is cleared after handling, and Status Indicator requests cannot be consumed by Light or Toggle flows.

#### `src/forgeui/interactive/InteractiveLightDesigner.tsx`

Owns the shared two-state Studio designer behavior used by Light, Status Indicator and Toggle Switch:

- Light draft state
- Light edit loading
- OFF and ON selection
- `initialState`
- Light preview controls
- Light Save and Delete
- Light `Use on Selected`
- Light asset-list cards
- Status Indicator draft, edit, Save, Delete, assignment, preview controls, and asset-list cards
- Toggle Switch draft, edit, Save, Delete, assignment, preview controls, and asset-list cards

It receives the parent-selected kind for AI generation. It does not own an independent Asset Type selector. There is no separate `InteractiveToggleSwitchDesigner.tsx` in the current implementation.

It also consumes type-scoped Light, Status Indicator and Toggle Switch new/edit requests. For Status Indicator, a configured request loads the exact linked Status Indicator and an unconfigured request resets to a fresh Status Indicator draft. Request effects never call Save or assignment.

#### `src/forgeui/ai/ForgeAIPanel.tsx`

Owns the shared AI Studio portal and the standard Toggle State Sheet Builder:

- recognition of `interactive-status-indicator-designer` and selection of the Interactive tab
- combined OFF/ON source artwork
- two linked crop regions
- shared crop dimensions
- OFF/ON previews
- conversion and return of completed state IDs
- restoration of the Toggle designer after completion or cancellation

The Toggle State Sheet Builder complements direct paired generation; it does not replace the Toggle runtime or persistence model.

#### `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`

Owns:

- Three-Position Toggle draft
- manual LEFT/CENTER/RIGHT artwork selectors
- `Create Three-Position Toggle Set`
- master State Sheet and linked-crop handoff
- initial-state selection
- designer-only zone overlay
- configured asset reopening and fresh unsaved drafts
- create/edit/delete/Save behavior
- Inspector onboarding destination
- persistence coordination, asset cards and `Use on Selected`

The generic duplicate Generate path is hidden for Three-Position. Generated crop IDs update the draft only; Save and assignment remain explicit.

#### `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`

Owns shared interactive image-generation UI and orchestration:

- prompt input
- generation loading state
- paired Button and binary-state requests where applicable
- the Three-Position `three-position-set` master request
- Three-Position crop-workspace state
- unique TOP/MIDDLE/BOTTOM row-to-state remapping
- `Confirm Crops`
- returning LEFT/CENTER/RIGHT IDs only after atomic registration succeeds
- kind-to-generation-mode mapping
- file-prefix selection
- returning the generated uploaded-asset IDs
- reporting generation state to the parent

It receives `selectedAssetKind`; it does not own or render another Asset Type selector.

### Shared AI image pipeline

#### `src/forgeui/ai/StateSheetOverlay.tsx`

Owns reusable State Sheet crop geometry and interaction:

- two-region Toggle and three-region Three-Position projects
- independent region X/Y positions
- shared crop width and height
- edge and corner resize handles
- single-region movement
- linked Three-Position resize behavior
- exact source-coordinate conversion
- live crop labels

For three linked regions, RIGHT/BOTTOM resizing changes shared dimensions without shifting origins. LEFT/TOP resizing applies the same delta to every origin. Row remapping is owned by `InteractiveAssetAIGenerator.tsx`; the overlay renders the remapped labels without changing crop geometry.

#### `src/forgeui/ai/ForgeUIAIImagePipeline.ts`

Owns:

- normal generated-image requests and conversion
- Three-Position master-image generation through `three-position-set`
- crop extraction with explicit coordinates
- `canvas.toDataURL('image/png')` PNG creation
- validation and local decoding of Base64 PNG data into `image/png` Blobs
- converter communication using Base64 image payloads
- preparation and conversion of all three state assets
- atomic Uploaded Asset Registry mutation only after every conversion succeeds
- failure propagation without partial LEFT/CENTER/RIGHT registration or draft mutation
- completed crop results returned to `Confirm Crops`

All five Interactive Asset kinds use this same pipeline.

#### `src/pages/api/forgeui-ai-hero.ts`

Owns:

- the shared `/api/forgeui-ai-hero` endpoint
- allowed generation modes
- type/state-specific prompt templates
- the image API request
- the common `{ ok, image }` or `{ ok, error }` response shape

The endpoint is shared. Prompt modes and prompt templates are type-specific.

### Uploaded Asset Registry

#### `src/forgeui/ForgeUIUploadedAssetRegistry.ts`

Owns generated and manually uploaded image records used by Interactive Assets and other ForgeUI systems.

Interactive Assets store uploaded asset IDs, not image blobs or generated C source. The uploaded registry owns:

- browser image source
- LVGL symbol
- generated C asset source path
- conversion status
- uploaded-asset persistence
- intrinsic `width` and `height` metadata
- measured alpha-content bounds
- rendered-image metadata recording, including hidden inactive-state preload measurements
- deduplication of identical metadata writes
- clearing stale intrinsic and alpha-content metadata when `browserSrc` changes for the same asset ID
- PNG IHDR dimension recovery when explicit metadata is unavailable
- registry update events used by Canvas previews and Inspector helpers

`forgeUIRecordRenderedImageMetadata()` records intrinsic dimensions and alpha-content bounds from rendered images. `forgeUIResolveUploadedAssetDimensions()` resolves explicit registry metadata first and PNG IHDR data second; generated LVGL descriptor dimensions remain the exporter fallback.

Do not copy uploaded image data into an Interactive Asset record.

### Reference protection

#### `src/forgeui/ForgeUIReferenceProtection.ts`

Owns reference discovery before deletion:

- uploaded asset references
- Interactive Button Normal and Pressed references
- Interactive Light OFF and ON references
- Interactive Status Indicator OFF and ON references
- Interactive Toggle Switch OFF and ON references
- Interactive Three-Position Toggle LEFT, CENTER and RIGHT references
- active Theme references
- Canvas `interactiveAssetId` references
- deletion-cancellation diagnostics

Deletion occurs only when no active references remain. The owning panel or asset manager asks this module for references before mutating the registry, persistence, Canvas, Theme state, browser URL, or generated file. This file discovers references; it does not own the registries it protects.

### Export validation

#### `src/forgeui/ForgeUIExportValidation.ts`

Owns client export validation and diagnostic reporting:

- Canvas validation
- Interactive Asset validation
- generated API validation
- Toggle and Three-Position callback validation
- Three-Position enum and runtime-contract validation
- normalized Button callback duplicate detection grouped by generated callback
- user-facing Button conflict details and actionable Label guidance
- generated asset-source validation
- grouped export diagnostics

This file owns validation only. It does not generate LVGL, firmware files, CMake, or runtime behavior.

## Interactive Input Runtime

The Interactive Input Runtime family contains controls that originate developer events:

```text
Interactive Input Runtime
├── Interactive Button         momentary, FG_On_*_Clicked(void)
└── Interactive Toggle Switch  persistent binary, FG_On_*_Toggled(bool enabled)
```

Button and Toggle share the common Interactive Asset Framework but own different generated input runtimes because momentary press behavior and persistent binary state have different contracts.

## Interactive Button map

### Model

#### `src/forgeui/interactive/ForgeUIInteractiveButtonAsset.ts`

Owns the Button type and its defaults.

```text
kind: button
interactionMode: momentary
```

State-image references:

- `normalAssetId`
- `pressedAssetId`

Button-specific data also includes label and visual fallback state.

New Button drafts use consistent `200 × 100` dimensions. Default Labels use the lowest available normalized `Button N` callback identity across all registered Button assets; existing assets and user-entered Labels are never silently renamed.

#### `src/forgeui/interactive/ForgeUIInteractiveButtonHook.ts`

Owns Button callback normalization, generated callback names and callback previews. Creation defaults, Inspector warnings, validation and LVGL export reuse this naming contract.

### Studio behavior

- AI generates Normal and Pressed state images.
- The first result maps to `normalAssetId`.
- The second result maps to `pressedAssetId`.
- `Use on Selected` is enabled only for an `InteractiveButton` component.
- Fresh assignment may adopt asset dimensions; replacing an existing configured asset preserves component geometry.
- Component geometry becomes authoritative after placement.
- The configured Inspector displays the generated callback preview and an inline duplicate warning.
- Export validation groups every normalized collision under its generated callback instead of emitting pairwise duplicates.
- `Fit Bounds to Visible Artwork` measures Normal/Pressed alpha content and creates one stable union crop with two linked uploaded assets.
- Fitting preserves original uploads and is idempotent.
- Registry and uploaded-asset persistence restore the assignment after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveButtonPreview.tsx`

Owns presentation and pointer-driven Normal/Pressed preview behavior.

It renders resolved uploaded assets. It does not access the registry directly. Rendered image loads feed shared intrinsic-dimension and alpha-content measurement.

#### `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

Owns Canvas integration for `InteractiveButton`:

- reads the component's `interactiveAssetId`
- performs kind-aware Button lookup
- resolves Normal and Pressed uploaded assets
- resolves asset dimensions with component fallbacks
- renders `InteractiveButtonPreview`
- responds to Interactive Asset and uploaded-asset registry update events
- unmounts the unconfigured placeholder immediately after assignment
- uses component `w/h` as the authoritative placed bounds

Canvas preview shows Pressed while held and restores Normal on release.

Selection, movement and resizing are owned by the shared Canvas wrapper. Selected Buttons receive eight edge/corner resize zones, continuous Canvas clamping and live Inspector `x/y/w/h` updates; resize pointer handling does not trigger pressed or clicked preview behavior.

### Runtime behavior

The single LVGL exporter emits:

- a parent LVGL button
- a child LVGL image
- per-instance runtime data
- shared Button event handling
- a generated developer click hook
- one Normal/Pressed contain-fit scale
- centred rendering inside final component bounds

Dimension resolution uses uploaded registry metadata, then PNG IHDR recovery, then generated `lv_image_dsc_t.header.w/h`; scale 256 is used only when reliable dimensions are unavailable.

Event behavior:

```text
PRESSED    → Pressed artwork
RELEASED   → Normal artwork
PRESS_LOST → Normal artwork
CLICKED    → generated developer hook
```

Example hook:

```c
FG_On_<Name>_Clicked();
```

Runtime path:

```text
Touch
  ↓
LVGL Button
  ↓
fg_interactive_button_event_cb(...)
  ↓
FG_On_<Name>_Clicked()
  ↓
95_UserEvents.c
  ↓
Developer application logic
```

## Interactive Toggle Switch map

### Model

#### `src/forgeui/interactive/ForgeUIInteractiveToggleSwitchAsset.ts`

Owns the persistent binary input model:

```text
kind: toggleSwitch
interactionMode: state
initialState: off | on
offAssetId
onAssetId
```

The default dimensions are `64 × 36`. Toggle state is boolean at the generated callback boundary, but its persisted asset state remains the typed `off | on` model.

### Studio behavior

`InteractiveLightDesigner.tsx` owns the current shared OFF/ON authoring UI for Toggle Switch, Light and Status Indicator. For Toggle Switch it provides:

- OFF and ON artwork selection and AI generation
- create, edit, delete and Save
- initial-state selection
- persistent live OFF/ON preview
- asset-list cards
- reference-aware deletion
- `Use on Selected`
- persistence through the shared v1 store

Assignment uses `getInteractiveToggleSwitchComponentProps()` and propagates `interactiveAssetId`, width and height through normal form and Redux component updates.

The configured Inspector helper remains visible, summarizes initial state and OFF/ON references, and reopens the exact linked Toggle. Incomplete and missing-link states retain repair and recovery cards. `Fit Bounds to Visible Artwork` uses a stable OFF/ON union, registers linked fitted assets while preserving originals, and detects completed fitting idempotently. Assignment and replacement preserve established geometry according to the shared placement rules.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`

Owns the OFF/ON presentation with full-container `width: 100%`, `height: 100%` and `objectFit: contain`. Intrinsic dimensions provide measurement and aspect information; they do not cap upscaling.

#### `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`

Owns kind-aware lookup, uploaded artwork resolution, authoritative component dimensions, saved initial state and persistent mounted preview state. It subscribes to Interactive Asset and uploaded-asset registry updates, renders configured and unconfigured states mutually exclusively, measures OFF and ON artwork, and preloads the inactive state for measurement. Each Canvas or Browser Preview instance retains its local OFF/ON state until clicked again; resizing suppresses preview interaction and does not toggle state.

`ComponentPreview.tsx` opts Toggle into `resizeMode="selection-border"` and renders it through `PreviewContainer`. Normal click interaction remains unchanged. Component `w/h` drive the full-container contain-fit preview, so intrinsic dimensions do not cap enlargement.

### Runtime behavior

The exporter emits one shared Toggle Input Runtime per export:

```c
fg_toggle_input_t
fg_toggle_input_set()
fg_toggle_input_event_cb()
```

Each instance contributes independent OFF/ON symbols, current state, parent button, child image and callback pointer. Final component geometry drives the transparent parent button. The child image is centred and non-clickable, and OFF/ON share one contain-fit scale. Dimension recovery order is registry metadata, PNG IHDR, LVGL descriptor, then safe scale 256 fallback. Assigned linked fitted assets are exported normally. Initialization calls `fg_toggle_input_set(..., notify=false)`. A click inverts the current state, updates the artwork and notifies:

```c
FG_On_<Name>_Toggled(bool enabled);
```

Runtime flow:

```text
LVGL click
  ↓
fg_toggle_input_event_cb()
  ↓
fg_toggle_input_set(next_state, true)
  ├── store independent instance state
  ├── select OFF or ON artwork
  └── FG_On_<Name>_Toggled(bool enabled)
```

The shared runtime implementation is emitted once. Per-instance data and generated hooks remain unique.

## Three-Position Input Runtime

The Three-Position Input Runtime owns persistent `LEFT | CENTER | RIGHT` input state and its strongly typed developer callback. It shares framework infrastructure with every Interactive Asset but is not a boolean Toggle or setter-controlled Binary Output.

## Interactive Three-Position Toggle map

### Model

#### `src/forgeui/interactive/ForgeUIInteractiveThreePositionToggleAsset.ts`

Owns the persistent multi-state input model:

```text
kind: threePositionToggle
interactionMode: state
leftAssetId
centerAssetId
rightAssetId
initialState: left | center | right
default dimensions: 96 × 36
```

`ForgeUIInteractiveThreePositionState` is strongly typed as `left | center | right`. It is not represented by a boolean.

### Studio behavior

#### `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`

Owns:

- LEFT, CENTER and RIGHT artwork selectors
- `Create Three-Position Toggle Set`
- one master State Sheet request
- linked crop-editor handoff and crop confirmation
- row remapping before confirmation
- create, edit, delete and Save
- LEFT/CENTER/RIGHT initial-state selection
- designer-only `LEFT | CENTER | RIGHT` zone overlay
- live direct-zone preview
- configured asset reopening and fresh unconfigured drafts
- Inspector onboarding destination
- reference-aware deletion
- `Use on Selected`
- persistence through the existing v1 store

Assignment uses `getInteractiveThreePositionComponentProps()` and writes `interactiveAssetId`, width and height through the normal component update path.

The configured Inspector helper remains visible with the linked asset, initial state and LEFT/CENTER/RIGHT summary. It owns exact linked reopening, incomplete and missing-link recovery, and explicit visible-artwork fitting. Fitting uses the compatible three-state union, preserves originals, creates linked same-size fitted assets and detects the already-fitted state idempotently.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`

Owns direct horizontal three-zone selection across the full rectangular width, current-position highlighting, local preview state callbacks, optional designer-only zone guidance and the explicit `Missing <STATE> artwork` fallback. Rendering uses a full-container contain fit with identical bounds for every state and scales continuously above and below intrinsic dimensions. The visible state renders normally while hidden preload images measure inactive states. LEFT/CENTER/RIGHT record intrinsic and alpha-content metadata. It does not use `objectFit: fill`.

#### `src/forgeui/interactive/UnconfiguredThreePositionTogglePlaceholder.tsx`

Owns the responsive unconfigured selector graphic, compact icon-only mode and current-state indicator. It provides presentation only and does not create an asset.

#### `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`

Owns kind-aware asset lookup, LEFT/CENTER/RIGHT uploaded-asset resolution, authoritative component dimensions, initial-state restoration and persistent local Canvas state. It subscribes to Interactive Asset and uploaded-asset registry updates, keeps configured and unconfigured rendering mutually exclusive, supports three-state measurement/preloading, and supplies measured artwork aspect-ratio information to the shared selection-border wrapper. Resize interaction preserves local state.

`ComponentPreview.tsx` opts the control into `resizeMode="selection-border"` and wraps it in `PreviewContainer`, so absolute position, selection, dragging, resizing and `Open Three-Position Toggle Creator` context-menu access follow the shared Canvas path. `forgePreviewRenderer.tsx` inserts an absolutely positioned browser-preview node; it does not return early from the render loop. Canvas and Browser Preview therefore match the physical three-zone model.

### Runtime behavior

Generated state contract:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Shared runtime:

```c
fg_three_way_input_t
fg_three_way_input_set()
fg_three_way_input_event_cb()
```

Generated callback:

```c
FG_On_<Name>_Changed(fg_three_way_state_t state);
```

The LVGL pointer is in screen space. The event callback obtains the button's absolute coordinates and converts once:

```c
local_x = point.x - button_coords.x1;
```

Zone mapping:

```text
first third  → LEFT
middle third → CENTER
last third   → RIGHT
```

Final component geometry drives the full transparent clickable parent. The centred child image is non-clickable and non-scrollable, and the parent is non-scrollable. LEFT/CENTER/RIGHT share one contain-fit scale, resolved through registry metadata, PNG IHDR, LVGL descriptors and then the safe fallback; valid scale values may be above or below 256. Linked fitted assets export when assigned. Transparent image margins do not reduce the clickable bounds. Initialization calls the shared setter with `notify=false`; valid interaction uses `notify=true`.

One shared runtime and event callback are emitted per export. Multiple Canvas instances retain independent runtime records, artwork, state and changed callbacks.

Physical ESP32-P4 validation confirms:

- the full rectangular control divides into LEFT/CENTER/RIGHT touch zones;
- each zone selects the correct generated State Sheet artwork;
- `FG_On_ThreePositionToggle_Changed(fg_three_way_state_t state)` matches runtime state;
- the generated user hook prints readable LEFT/CENTER/RIGHT values;
- initialization applies state with `notify=false`;
- interaction remains stable.

## Interactive Light map

### Model

#### `src/forgeui/interactive/ForgeUIInteractiveLightAsset.ts`

Owns the Light type and its defaults.

```text
kind: light
interactionMode: state
initialState: off | on
```

State-image references:

- `offAssetId`
- `onAssetId`

### Studio behavior

- AI generates OFF and ON state images.
- Canvas right-click and incomplete-state Inspector onboarding open the direct Light Creator.
- Configured components reopen the exact linked Light asset; unconfigured components open a fresh unsaved draft.
- The compact configured Inspector helper remains mounted after assignment.
- The first result maps to `offAssetId`.
- The second result maps to `onAssetId`.
- `Use on Selected` is enabled only for an `InteractiveLight` component.
- Fresh placeholders conditionally adopt newly created asset dimensions; existing configured Lights preserve component geometry.
- Component geometry is authoritative after placement.
- `Fit Bounds to Visible Artwork` measures OFF/ON alpha content and creates one stable union crop with two linked uploaded assets.
- Fitting preserves original uploads and is idempotent.
- Registry and uploaded-asset persistence restore the assignment after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveLightPreview.tsx`

Owns Light presentation, optional preview controls and shared intrinsic-dimension and alpha-content measurement on image load.

#### `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

Owns Canvas integration for `InteractiveLight`:

- reads the component's `interactiveAssetId`
- performs kind-aware Light lookup
- resolves OFF and ON uploaded assets
- resolves dimensions and saved initial state
- maintains a temporary Canvas preview state
- renders `InteractiveLightPreview`
- renders `UnconfiguredLightPlaceholder` when the Light or either visual is unresolved
- responds to same-ID Interactive Asset replacement and uploaded-asset registry updates
- replaces configured and unconfigured rendering without layered previews
- uses component `w/h` as the authoritative placed bounds

`UnconfiguredLightPlaceholder.tsx` owns the responsive lamp SVG, compact icon-only mode, larger OFF/ON hints and muted-green active indicator. `PreviewContainer.tsx` supplies near-white unselected and cyan selected Creator highlighting plus shared selection-border resizing and Canvas clamping. `InteractiveLightCreatorHelper.tsx` owns both configured and incomplete Inspector cards, exact linked-asset reopening and visible-bounds fitting.

Clicking the Canvas preview toggles only local preview state. It does not mutate the saved Interactive Light and does not affect exported firmware.

### Runtime behavior

The exporter emits Light as a transparent component-sized container with a centred non-clickable LVGL image:

- initial image follows the saved `initialState`
- OFF and ON use one contain-fit scale derived from final component geometry
- state switching does not change the container position or size
- dimensions resolve through registry metadata, PNG IHDR and LVGL descriptors before the safe scale-256 fallback
- no Light click callback is registered
- no Light event hook is generated in `95_UserEvents`
- a generated public setter controls the image source

Example generated API:

```c
void FG_Set_<Name>(bool enabled);
```

Behavior:

```text
false → OFF image
true  → ON image
```

Runtime path:

```text
Developer application logic
  ↓
FG_Set_<Name>(enabled)
  ↓
90_Studio_Export.c
  ↓
lv_image_set_src(...)
  ↓
Physical indicator state
```

## Binary Output Runtime

The Binary Output Runtime is the reusable runtime family for two-state, setter-controlled Interactive Assets.

It owns the generated C runtime primitives:

```c
fg_binary_output_t
fg_binary_output_set()
```

Interactive Light introduced this runtime. Interactive Status Indicator proves that it is shared infrastructure rather than a Light-specific implementation.

The exporter generates the Binary Output Runtime implementation once per export. Each Light or Status Indicator instance contributes only:

- its own `fg_binary_output_t` runtime record
- its OFF and ON artwork references
- its saved initial state
- its deterministic `FG_Set_*` public setter

Every generated setter delegates to `fg_binary_output_set()`. Light and Status Indicator also share the same exported geometry implementation. Runtime records and setter APIs are unique per Canvas instance; the runtime structure, state-switching function and geometry implementation are not duplicated. The previous legacy Status Indicator direct-image export path no longer exists.

Runtime ownership:

```text
Binary Output Runtime (generated once)
  ├── Interactive Light instance records and setters
  └── Interactive Status Indicator instance records and setters
```

Future Binary Output Interactive Assets must create their own export descriptors and per-instance records while reusing `fg_binary_output_t` and `fg_binary_output_set()`. Do not generate another implementation of binary state switching.

## Interactive Status Indicator map

### Model

#### `src/forgeui/interactive/ForgeUIInteractiveStatusIndicatorAsset.ts`

Owns the Status Indicator type and its defaults.

```text
kind: statusIndicator
interactionMode: state
initialState: off | on
```

State-image references:

- `offAssetId`
- `onAssetId`

Semantics come from the OFF and ON artwork. The model contains no Wi-Fi, Bluetooth, MQTT, alarm, warning, running, ready, busy, or connected-specific runtime logic.

### Studio behavior

- AI generation produces matching OFF and ON artwork.
- The first result maps to `offAssetId`.
- The second result maps to `onAssetId`.
- The designer supports name, label, width, height, artwork selection, and `initialState`.
- Canvas right-click opens the direct Status Indicator Creator, and Inspector onboarding provides the same route for incomplete configuration.
- Configured components reopen the exact linked Status Indicator; unconfigured components open a fresh unsaved draft without Save, registration or assignment.
- The configured helper remains mounted above Position Mode with exact linked Creator reopening, configured summary, measurement readiness, fitting and already-fitted guidance.
- OFF and ON measure automatically, including inactive-state preload. Uploaded-registry events enable fitting live without component reselection.
- Same-ID `browserSrc` replacement invalidates stale intrinsic and alpha metadata before remeasurement.
- Visible-artwork fitting uses one stable OFF/ON union, preserves originals, creates linked fitted assets and is idempotent.
- Selected configured and unconfigured components use shared selection-border resizing, while component geometry remains authoritative.
- The unconfigured Canvas state uses a responsive binary-output SVG with compact icon-only mode and larger OFF / ON hints.
- Placeholder tone is near-white when unselected, cyan when selected, and muted green for the active indicator.
- New Status Indicators default to `120 × 72` on Canvas. `src/hooks/useDropComponent.ts` owns this initial `w` and `h`; the previous shared `32 × 32` drop size no longer applies.
- Browser Preview switches between OFF and ON with the same binary state contract as Light.
- `Use on Selected` is enabled only for an `InteractiveStatusIndicator` component.
- Assignment writes `interactiveAssetId`, width, and height.
- Registry and uploaded-asset persistence restore the Status Indicator after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`

Owns the Status Indicator OFF/ON renderer used by Browser Preview and Canvas Preview, rendered-image metadata recording and inactive-state preload support. Canvas full-container mode uses `width: 100%`, `height: 100%` and `objectFit: contain`. Artwork remains centred and scales continuously above and below intrinsic size. Intrinsic dimensions are measurement and aspect inputs, not maximum display dimensions.

#### `src/forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder.tsx`

Owns the responsive binary-output SVG. The icon uses 84% of component width and 88% of component height, switches to icon-only mode around the `120 × 72` compact threshold, has explicit minimum/maximum sizing, does not flex-shrink, and shows OFF / ON hints when space permits.

#### `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`

Owns Canvas integration for `InteractiveStatusIndicator`:

- reads the component's `interactiveAssetId`
- performs kind-aware Status Indicator lookup
- resolves OFF and ON uploaded assets
- subscribes to Interactive Asset and uploaded-asset registry updates, including same-ID source replacement
- resolves authoritative component width, height, and saved initial state
- renders `InteractiveStatusIndicatorPreview`
- owns temporary local OFF / ON preview state
- preloads and measures both visual states
- supplies measured artwork aspect ratio to the shared selection-border wrapper
- toggles that local state on Canvas click
- preserves local state while resize interaction suppresses preview clicks
- resets local state when the linked asset or saved initial state changes
- does not mutate saved `initialState`, persistence or exported firmware

This design-time click behavior does not change the runtime contract. The physical LVGL Status Indicator remains non-clickable and changes state only through its generated `FG_Set_*` API.

### Runtime behavior

The exporter emits each Status Indicator as a non-clickable LVGL image backed by its own `fg_binary_output_t` record:

- initial artwork follows the saved `initialState`
- `false` selects OFF artwork
- `true` selects ON artwork
- no click callback is registered
- no event hook is generated in `95_UserEvents`
- a deterministic public setter controls the instance
- multiple instances remain independent even when they reuse the same artwork

Example generated API:

```c
void FG_Set_<Name>(bool enabled);
```

Runtime path:

```text
Developer application logic
  ↓
FG_Set_<IndicatorName>(enabled)
  ↓
per-instance fg_binary_output_t record
  ↓
shared fg_binary_output_set()
  ↓
OFF or ON artwork
```

Interactive Status Indicator consumes the Binary Output Runtime. It does not own or generate another runtime implementation.

## Shared AI generation map

```text
InteractiveAssetAIGenerator
  ↓
ForgeUIAIImagePipeline
  ↓
POST /api/forgeui-ai-hero
  ↓
AI image creation
  ↓
Uploaded Asset Registry
  ↓
LVGL image conversion
  ↓
State IDs returned to the designer
```

Button generation modes:

- `button-normal`
- `button-pressed`

Button mapping:

- first result → `normalAssetId`
- second result → `pressedAssetId`

Toggle Switch currently uses the exact implemented binary modes:

- `light-off`
- `light-on`

Toggle mapping:

- first result → `offAssetId`
- second result → `onAssetId`

The direct Toggle Creator retains paired OFF/ON generation. `ForgeAIPanel.tsx` separately owns the Toggle State Sheet Builder: one combined OFF/ON source, two linked crop regions, conversion, and return of both state IDs to the Toggle draft.

Three-Position Toggle active generation mode:

- `three-position-set`

Three-Position mapping:

```text
one master generation
  → State Sheet
  → linked crop workspace
  → LEFT / CENTER / RIGHT crops
  → three converted uploaded assets
  → draft update
```

The old independent `three-position-left`, `three-position-center` and `three-position-right` calls are not used by the active Three-Position Creator.

The Three-Position prompt requires a horizontal rectangular selector or rocker, consistent body geometry, minimal transparent margins and a clearly visible selected position. It explicitly rejects circular status lamps.

Light generation modes:

- `light-off`
- `light-on`

Light mapping:

- first result → `offAssetId`
- second result → `onAssetId`

Status Indicator generation reuses the exact implemented two-state modes:

- `light-off`
- `light-on`

Status Indicator mapping:

- first result → `offAssetId`
- second result → `onAssetId`

The request and response pipeline is shared. Type-specific differences include:

- generation mode
- prompt template
- filename prefix
- State Sheet and crop count
- result-to-state mapping

Do not create a second AI image pipeline for another Interactive Asset kind.

## Canvas integration map

### Component registration and rendering

The relevant integration points include:

- `src/componentsList.ts`
- `src/forgeui/widgets/ForgeUIWidgetRegistry.ts`
- `src/forgeui/ForgeUIWidgetSet.ts`
- `src/components/sidebar/Sidebar.tsx`
- `src/components/sidebar/DragItem.tsx`
- `src/utils/defaultProps.tsx`
- `src/hooks/useDropComponent.ts`
- `src/components/editor/ComponentPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`

`ForgeUIWidgetRegistry.ts` is authoritative for tray-visible widget metadata, default dimensions/properties, insertion factories and capability classification. `ForgeUIWidgetSet.ts` is derived compatibility data. The Sidebar must not maintain a parallel Standard widget list.

`PreviewContainer.tsx` owns free-form absolute Canvas movement and resize behavior. Final component `x/y/w/h` remains authoritative, boundary clamping must not introduce grid snapping, and persisted fractional geometry must not be rounded merely for display convenience. Layout Designer Auto Arrange is an explicit command over assigned children; it is not an always-on Canvas constraint.

`ComponentPreview.tsx` dispatches Canvas rendering to the kind-specific preview component based on Canvas component type:

```text
InteractiveButton → InteractiveButtonCanvasPreview
InteractiveToggleSwitch → InteractiveToggleSwitchCanvasPreview
InteractiveThreePositionToggleSwitch → InteractiveThreePositionToggleCanvasPreview
InteractiveLight  → InteractiveLightCanvasPreview
InteractiveStatusIndicator → InteractiveStatusIndicatorCanvasPreview
```

Canvas components keep only the Interactive Asset reference and component dimensions. Visual records remain in the Interactive Asset and uploaded-asset registries. All five Interactive Asset components render through the shared positioned, selected, draggable and selection-border-resizable wrapper. Three-Position Toggle follows `PreviewContainer` on Canvas and an explicitly positioned insertion in Browser Preview, preventing origin jumps or early-return omissions.

`ComponentPreview.tsx` owns per-type opt-in to `resizeMode="selection-border"`, canonical measured artwork aspect ratio where available, component-authoritative dimensions and registry-driven rerender support.

`PreviewContainer.tsx` owns the thin selected cyan border, four transparent edge zones, four transparent corner zones, standard resize cursors and absence of floating resize dots. It enforces the shared `10 × 10` minimum, anchors opposite edges/corners, clamps continuously to Canvas boundaries, and persists live `x/y/w/h` through normal component property updates. Resize pointer handling suppresses component movement and preview interaction, ends cleanly outside the component, and retains selection. Type-specific previews must not reimplement resize geometry.

After placement, component geometry is authoritative. Preview components consume current component `w/h`; replacing a configured Interactive Asset does not silently restore asset dimensions.

`useDropComponent.ts` gives a newly inserted Status Indicator real `w: 120` and `h: 72` bounds before artwork is assigned. Those dimensions drive the drag placement calculation, Canvas bounds, selection and resize frame, and the responsive placeholder.

### Assignment contract

All designers use kind-specific resolver helpers to resolve:

```text
interactiveAssetId
w
h
```

Fresh unconfigured placeholder assignment may conditionally apply `w/h` from an assigned asset. Deliberately resized unconfigured components and configured components preserve current `x/y/w/h` during replacement according to the resolver rules. Assignment updates form state and Redux component props. Do not bypass the normal component property update path.

## LVGL exporter map

### Single exporter rule

#### `src/forgeui/ForgeUILvglExport.ts`

Primary function:

```ts
generateForgeUILvglCode()
```

This remains the only LVGL UI exporter.

It assumes input has passed `ForgeUIExportValidation.ts`. Validation is not an exporter responsibility and must not be mixed into generation logic. Exporter-side resolution remains defensive, but the permanent validation policy belongs to the client preflight and server boundary.

It owns:

- traversal of the Canvas component tree
- LVGL UI and runtime generation
- type-specific `InteractiveButton` generation
- type-specific `InteractiveLight` generation
- type-specific `InteractiveStatusIndicator` generation
- type-specific `InteractiveToggleSwitch` generation
- type-specific `InteractiveThreePositionToggleSwitch` generation
- kind-aware Interactive Asset lookup
- uploaded image resolution
- `LV_IMAGE_DECLARE(...)` emission
- used asset-source collection
- Button event hook collection
- Toggle bool-hook collection
- Three-Position state-hook collection
- shared Binary Output setter generation
- per-instance Binary Output runtime records
- public API collection
- standard-component retained LVGL object and state generation
- standard-component public API and transition-helper generation
- standard-component LVGL event adapters and hook metadata
- deterministic sanitized and collision-safe standard-component names
- TabView retained active-index runtime generation
- Tileview retained active coordinates and native four-page runtime generation
- Button Text serialization
- Text Value serialization
- Heading Text serialization
- Clock Presentation serialization
- per-instance Clock formatter generation and RTC field integration
- generated runtime support
- single shared Binary Output Runtime generation
- single shared Toggle Input Runtime generation
- single shared Three-Position Input Runtime generation
- Three-Position enum and direct local-zone hit testing
- unique per-instance input runtime records
- Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON, Binary Output Status Indicator OFF/ON and Three-Position LEFT/CENTER/RIGHT contain-fit scale calculation
- registry and PNG IHDR image-dimension resolution
- generated LVGL descriptor-based dimension fallback
- persistent application-container generation
- System launcher and Brightness container generation
- persistent Wi-Fi page container generation
- lazy persistent Storage container generation and page reuse
- reusable Storage row pool and projection timer
- Storage Refresh and Read / Write Test callbacks
- Storage paging and selection mode
- Delete Empty Folder callback and confirmation workflow
- Wi-Fi status card and connected-detail generation
- selectable structured network rows with security, RSSI, Connected and Saved presentation
- Scan, Refresh, Connect, Disconnect, Reconnect and Forget controls and internal callbacks
- password and forget dialogs, password textarea, Show / Hide and validation messages
- reusable native LVGL keyboard creation, attachment and callbacks
- periodic backend snapshot/network projection
- projection pause while password entry is active
- disconnected placeholder clearing
- station MAC and AP BSSID projection
- reuse of the existing application Wi-Fi service loop/timer
- generated gear launcher
- internal System page callbacks
- container visibility navigation
- generated brightness slider and percentage runtime
- clamped `FG_Set_Display_Brightness()` hardware bridge
- Waveshare `bsp_display_brightness_set()` integration

Do not create:

- a separate Interactive Button exporter
- a separate Interactive Light exporter
- a separate Interactive Status Indicator exporter
- a separate Interactive Toggle Switch exporter
- a separate Interactive Three-Position Toggle exporter
- a parallel runtime generator

New Interactive Asset export logic must extend `generateForgeUILvglCode()` and reuse its asset-source and generated-code ownership model.

### System Runtime export branch

The built-in System export path generates:

1. one persistent application container that owns the existing application widgets and Interactive Assets;
2. one System-owned gear launcher above application content;
3. one hidden System launcher container;
4. one hidden Brightness container;
5. internal click callbacks for Application, System and Brightness navigation;
6. a `10–100` Brightness slider and live percentage label;
7. a current-session brightness value;
8. the internal clamped `FG_Set_Display_Brightness()` bridge;
9. live Waveshare BSP control through `bsp_display_brightness_set()`.

Current navigation intentionally switches `LV_OBJ_FLAG_HIDDEN` between persistent containers. It does not load another LVGL screen and does not recreate the application. Interactive Assets remain alive while the System Runtime is open.

The gear launcher, Display card, Brightness slider and Back controls are built-in controls. They do not generate `FG_On_*` user callbacks and do not enter the Interactive Asset Framework. Animated page transitions are future work.

The generated System Runtime also owns one persistent Wi-Fi page container, status card, connected details, selectable structured rows, Connected and Saved presentation, security and RSSI labels, Scan, Refresh, Disconnect, Reconnect and Forget controls, confirmation and password dialogs, password textarea, Show / Hide, validation, native keyboard attachment, internal callbacks and periodic projection through the existing application Wi-Fi service loop/timer. Projection pauses while password entry is active so focused text input is not disrupted, and disconnected snapshots clear stale detail values to placeholders.

Generated UI sends intent and projects `fg_wifi_snapshot_t` and `fg_wifi_network_t`; `30_WIFI.c` remains the physical source of truth. No scan, credential, connection, reconnect or ESP-IDF backend logic belongs in the exporter. System Wi-Fi controls are internal and never generate `FG_On_*` user hooks.

The generated System Runtime also owns one lazily created persistent Storage container, page reuse, reusable row pool, paging, status projection, Refresh, Read / Write Test, Select Item mode, Delete Empty Folder callback and the periodic Storage projection timer. Generated Storage UI sends intent and projects bounded backend state; filesystem operations remain in `40_SD.c/.h`.

### Button export branch

The `InteractiveButton` branch:

1. reads `interactiveAssetId`;
2. calls kind-aware Button lookup;
3. resolves Normal and Pressed uploaded assets;
4. confirms both are LVGL-ready;
5. adds their C sources to `usedAssetSources`;
6. creates a parent button and child image;
7. creates per-instance runtime data;
8. attaches the shared event callback;
9. resolves Normal/Pressed dimensions through registry metadata or PNG IHDR;
10. applies one contain-fit scale, using the LVGL descriptor helper when Studio metadata is unavailable;
11. centres the child image inside final component bounds;
12. records the generated click hook.

### Toggle Switch export branch

Toggle export preparation and the `InteractiveToggleSwitch` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Toggle Switch lookup;
3. resolve OFF and ON uploaded assets and collect their C sources;
4. allocate a unique `FG_On_<Name>_Toggled` hook;
5. create an independent `fg_toggle_input_t` record;
6. use final persisted component geometry for the transparent parent button;
7. create and centre the non-clickable child image;
8. resolve dimensions through registry metadata, PNG IHDR, LVGL descriptors and the safe scale 256 fallback;
9. apply one common OFF/ON contain scale, including values above or below 256;
10. export linked fitted assets when those IDs are assigned;
11. apply the configured initial state with `notify=false`;
12. attach the shared `fg_toggle_input_event_cb()`.

The shared structure, setter and event callback are emitted once even when multiple Toggle instances export.

### Three-Position Toggle export branch

Three-Position export preparation and the `InteractiveThreePositionToggleSwitch` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Three-Position lookup;
3. resolve LEFT, CENTER and RIGHT assets and collect their C sources;
4. allocate a unique `FG_On_<Name>_Changed` hook;
5. create an independent `fg_three_way_input_t` record;
6. use final persisted component geometry for the full transparent clickable parent;
7. create a centred, non-clickable and non-scrollable child image;
8. resolve dimensions through registry metadata, PNG IHDR, LVGL descriptors and the safe fallback;
9. apply one common LEFT/CENTER/RIGHT contain scale, including values above or below 256;
10. export linked fitted assets when those IDs are assigned;
11. apply the configured enum state with `notify=false`;
12. attach the shared local-coordinate event callback.

The enum contract, runtime structure, setter and event callback are generated through the single exporter. `local_x = point.x - button_coords.x1` makes zone selection independent of screen placement.

### Keyboard export ownership

#### `src/forgeui/ForgeUILvglExport.ts`

The generated System Runtime owns a physically proven reusable native LVGL keyboard for System dialogs:

- native `lv_keyboard` / `lv_buttonmatrix`
- lazy creation of one reusable instance
- `lv_layer_top()` parent ownership
- `LV_OBJ_FLAG_IGNORE_LAYOUT` and `LV_OBJ_FLAG_FLOATING`
- focus/click textarea callbacks and an idempotent open helper
- `lv_keyboard_set_textarea()` attachment and detachment
- password textarea support
- lowercase, uppercase/shift, numbers, symbols, space and backspace
- Done and Hide / Cancel handling
- password-dialog repositioning while open
- explicit foreground ordering
- ForgeUI dark styling without diagnostic magenta/green colors
- final top-left alignment through `lv_obj_set_align(..., LV_ALIGN_TOP_LEFT)`
- final physical position `(0, 350)` and size `1024 × 250`
- no verbose geometry logging in the final architecture

`lv_keyboard_create()` internally bottom-aligns the object. `lv_obj_set_pos()` does not clear that alignment, so the exporter must retain the explicit `LV_ALIGN_TOP_LEFT` reset before final geometry.

Current relative widths:

```text
Row 1: all keys 4
Row 2: all keys 3
Row 3: all keys 1
Row 4: mode 2, left 2, space 12, right 2, confirm 2
```

LVGL normalizes control widths independently within each row. The keyboard is a reusable System Runtime component, not merely visual-parity work. Future System pages may reuse it where text entry is required, but no future consumer is claimed as already implemented.

#### `src/forgeui/ForgeUILvglExport.keyboard.test.ts`

Owns generated-C regression coverage for lazy creation, one reusable instance, top-layer ownership, textarea wiring, focus/click open handling, style ordering, top-left alignment, final geometry and absence of later geometry overrides.

### Light export branch

Light export preparation and the `InteractiveLight` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Light lookup;
3. resolve OFF and ON uploaded assets;
4. confirm both are LVGL-ready;
5. add their C sources to `usedAssetSources`;
6. use final persisted component `x/y/w/h` for a transparent container;
7. create a centred non-clickable child LVGL image;
8. resolve OFF/ON dimensions through registry metadata or PNG IHDR;
9. apply one shared OFF/ON contain-fit scale, using generated LVGL descriptors and then scale 256 only as fallbacks;
10. select the initial source from `initialState`;
11. generate a unique public `FG_Set_*` API;
12. switch OFF/ON source inside that setter without changing apparent placement.

No Light event hook is added.

### Status Indicator export branch

Status Indicator export preparation and the `InteractiveStatusIndicator` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Status Indicator lookup;
3. resolve OFF and ON uploaded assets;
4. confirm both are LVGL-ready;
5. add their C sources to `usedAssetSources` without duplicating reused artwork;
6. create a Binary Output export descriptor using final persisted component geometry;
7. generate a transparent component-sized container with a centred non-clickable child image backed by a per-instance runtime record;
8. resolve OFF/ON dimensions through registry metadata, PNG IHDR, LVGL descriptors and the safe scale 256 fallback;
9. apply the common Binary Output OFF/ON contain scale;
10. export linked fitted assets when those IDs are assigned;
11. select the initial source from `initialState`;
12. generate a unique public `FG_Set_*` API that calls `fg_binary_output_set()`.

No Status Indicator event hook is added. Light and Status Indicator descriptors feed the same Binary Output Runtime and setter-generation path.

### Frontend export transport

#### `src/components/Header.tsx`

Coordinates:

- Build & Flash
- Clean Build & Flash
- standalone ESP-IDF project export

For every path, Header generates the candidate export, runs the client preflight, and submits only validated output. Export must succeed before a flash begins.

It sends generated export payloads to:

- `POST /export`
- `POST /export-idf-project`

The frontend generates LVGL code through the single exporter and forwards `code`, validated `assetSources`, `userEventHooks`, and `publicApiDeclarations`. `userEventHooks` carries Interactive Input hooks and the standard-component hooks collected by the exporter. Binary Output setters and standard-component APIs travel through `publicApiDeclarations`. It does not write firmware files directly.

### Export server

#### `export-server.js`

Owns filesystem-side export work:

- validating the export payload before writes
- validating generated C sources, paths, existence, expected symbols, and code references
- returning the validated asset-source list to filesystem-side generation
- writing generated UI source and header
- merging the Studio-generated user hook layer
- appending missing hook declarations and stubs
- preserving matching developer-written function bodies and unrelated existing hooks
- merging TabView and Tileview hook declarations and missing stubs
- copying generated image sources
- creating CMake source lists
- live firmware export
- standalone ESP-IDF project export

No firmware mutation occurs before validation succeeds. The server validation boundary is independent of the client preflight.

Button Text, Text Value, Heading Text and Clock Presentation introduce no new hook declarations. TabView and Tileview hooks use the same preservation merge as the existing standard-component hooks.

The server writes:

- `90_Studio_Export.c`
- `90_Studio_Export.h`
- `95_UserEvents.c`
- `95_UserEvents.h`
- generated asset sources
- `CMakeLists.txt`

Do not describe this file as `server.js`; its current project path is `studio/export-server.js`.

### Default Theme ownership

Built-in theme assets are permanent generated firmware assets. They participate in export validation exactly like uploaded assets and are not exempt from either validation boundary.

The active Theme contributes its required generated C source to the export. Validation confirms that the source exists, follows the permitted relative-path contract, contains the expected LVGL symbol, and is referenced by generated code. Missing built-in assets are repaired at their firmware-asset ownership boundary; validation must not be weakened to allow them through.

## Generated firmware ownership

Validation is transactional at the export boundary. Failed validation preserves the previous generated firmware state:

- `90_Studio_Export.c`
- `90_Studio_Export.h`
- `95_UserEvents.c`
- `95_UserEvents.h`
- generated asset sources
- generated `CMakeLists.txt`

Only a successful export may replace these outputs. Debug validation at the client or server ownership boundary before inspecting filesystem-writing logic.

### `90_Studio_Export.c` and `90_Studio_Export.h`

These are generated and replaceable.

They contain:

- generated UI construction
- generated runtime support
- generated public UI APIs
- persistent application, System launcher and Brightness containers
- complete generated Wi-Fi System page, status card, connected details and structured network rows
- lazily created persistent Storage page and reusable row pool
- Storage callbacks, bounded projection, paging and selection
- Delete Empty Folder workflow
- internal Scan, Refresh, network-selection, Connect, Disconnect, Reconnect and Forget callbacks
- password dialog, password textarea, validation and Show / Hide callbacks
- reusable native keyboard creation, attachment and callbacks
- periodic backend snapshot/network projection
- generated gear launcher
- internal System page switching and container visibility
- Brightness slider and live percentage label
- internal `FG_Set_Display_Brightness()` hardware bridge
- Back navigation
- Button runtime callback wiring
- shared Toggle Input Runtime and per-instance records
- shared Three-Position Input Runtime, enum-dependent state and per-instance records
- shared Binary Output Runtime and per-instance records
- Light setter implementations and declarations
- standard-component retained LVGL objects and runtime state
- standard-component public API implementations and declarations
- shared transition helpers and LVGL event adapters
- TabView retained object, active index, tab count, transition helper, callback and setter
- Tileview native parent/pages, active coordinates, scroll-end change hook and silent setter
- serialized Button Text, Text Value and Heading Text label generation
- per-instance Clock Presentation labels, timers, separator state and formatter callbacks

Public APIs are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`.

The current System Runtime implementation is generated in `90_Studio_Export.c`. Its callbacks are internal runtime ownership and do not belong in `95_UserEvents.*`. Immediate container visibility switching is intentional; animated transitions are not implemented.

`90_Studio_Export.c/.h` may contain the generated Wi-Fi System page and its internal callbacks, but the actual Wi-Fi backend remains in `30_WIFI.c/.h`:

```text
Generated System Wi-Fi UI
→ reads structured backend state
→ sends intent

30_WIFI backend
→ owns physical Wi-Fi truth and ESP-IDF calls
```

Backend logic must not move into generated code. Wi-Fi System UI and its internal callbacks are unrelated to `95_UserEvents.*`.

`90_Studio_Export.c/.h` may also contain the generated Storage page, callbacks, projection, paging, selection and Delete Empty Folder workflow, but filesystem operations remain in `40_SD.c/.h`.

Do not place permanent product logic in these files.

### `95_UserEvents.c` and `95_UserEvents.h`

Studio creates these as the generated user hook layer. They are not manually created in the live firmware workflow. Live regeneration preservation-merges the required API: existing matching function bodies and developer code remain intact, while missing declarations and missing stubs are appended.

Interactive Button click hooks, Interactive Toggle Switch bool hooks, Interactive Three-Position Toggle enum-state hooks, and standard-component hooks are declared and stubbed here. Hook metadata supplies the required signatures for each standard widget contract. Current Standard hook signatures include:

```c
FG_On_<Input>_Changed(const char * text);
FG_On_<Textarea>_Changed(const char * text);
FG_On_<Switch>_Changed(bool checked);
FG_On_<Checkbox>_Changed(bool checked);
FG_On_<Radio>_Changed(bool selected);
FG_On_<NumberInput>_Changed(int32_t value);
FG_On_<Select>_Changed(uint32_t index, const char * text);
FG_On_<IconButton>_Clicked(void);
```

Programmatic setters for these interactive components are guarded and silent; hooks represent genuine user interaction. Interactive Light and Interactive Status Indicator do not generate event hooks because Binary Output assets are controlled through public setters.

Progress, Image and Box are setter-only and generate no hooks. Icon, Divider, Scale, Line, Clock, Button Text, Text and Heading also generate no hooks. In particular, there is no Clock changed hook.

`fg_three_way_state_t` and its LEFT/CENTER/RIGHT enum values are generated in `95_UserEvents.h`, which is included by generated Studio export code before the Three-Position runtime structures use that type.

### Live Studio firmware versus standalone export

| Concern | Studio-controlled live firmware | Developer-owned standalone project |
|---|---|---|
| Location | `firmware/ForgeUI-One` | Exported project under `C:\ForgeUI-Exports` |
| `90_Studio_Export.c/.h` | Generated and replaceable | Generated export output |
| `95_UserEvents.c/.h` | Safely regenerated hooks; developer bodies are preserved and missing declarations/stubs appended | Developer-owned hook/application layer after export |
| GPIO, I/O, and product logic | Do not keep permanently here | Add to `95_UserEvents.c` |
| Studio build/flash ownership | Studio may regenerate, build, and flash | Studio does not continuously update or flash it |

Studio preservation-merges `95_UserEvents.c/.h` when creating live firmware and generates them for standalone export. Ownership changes after standalone export: the exported copies become the developer's application integration layer.

### CMake integration

The export server generates the component source list and includes:

```text
90_Studio_Export.c
95_UserEvents.c
required uploaded asset .c sources
```

Do not maintain a parallel build list for Interactive Assets.

## Persistence and restart behavior

The persisted ownership map is:

| Store / key | Owns |
|---|---|
| Redux persistence `forgeui_studio_v<version>` (`NEXT_PUBLIC_VERSION`, default `1`) | the undoable component document's `present` state, including normal component props, geometry and Layout Designer region metadata |
| `forgeui_interactive_assets_v1` | all five Interactive Asset model records, initial states and uploaded state-artwork IDs |
| `forgeui_uploaded_assets_v1` | image metadata, LVGL symbols, generated source paths and restorable browser sources; transient object URLs are not persistable |
| `forgeui_ai_assets_v1` | AI Studio asset records owned by `ForgeAIPanel.tsx` |
| `forgeui_widget_tray_collapsed_v1` | tray-only category collapse preferences; never component or project data |

At Studio startup:

1. The normal component `present` state reloads through Redux persistence and remains wrapped by `redux-undo`.
2. Interactive Assets reload into the shared registry.
3. Uploaded assets restore their persistent metadata.
4. Canvas components retain `interactiveAssetId` and Layout Designer metadata in ordinary component props.
5. Kind-aware previews resolve current asset and visual records.

Toggle restart state restores `initialState`, `offAssetId` and `onAssetId`. Three-Position restart state restores `initialState`, `leftAssetId`, `centerAssetId` and `rightAssetId`. Canvas components independently restore their `interactiveAssetId`, width and height references.

When restart persistence fails, debug both stores and the Canvas component reference before changing rendering code.

## Physical ESP32-P4 proof

### Interactive Button

Physically confirmed:

- Normal artwork displayed
- Pressed artwork displayed on touch
- release restored Normal
- physical click detected
- generated callback called
- generated user hook called
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- centred contain-fit scaling matched final component geometry

Monitor output:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light

Physically confirmed:

- OFF and ON assets exported
- saved initial ON state displayed
- public setter generated
- Light remained non-clickable
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- shared OFF/ON contain-fit scaling matched final component geometry
- firmware remained stable

### Interactive Toggle Switch

Studio, persistence, preview, export, shared runtime and bool-hook generation are validated. The current single-control export has also been exercised on the physical ESP32-P4: OFF/ON artwork and touch state changes operate through the generated Toggle Input Runtime. Do not generalize this into unrecorded multi-instance or stress-test claims.

### Interactive Status Indicator

Physically confirmed:

- Binary Output runtime
- OFF and ON rendering
- resized component geometry
- Browser Preview parity
- centred contain-fit scaling
- stable generated runtime

### Interactive Three-Position Toggle Switch

Physically confirmed:

- generated LEFT/CENTER/RIGHT State Sheet artwork displayed
- full rectangular hit area divided into three zones
- LEFT third selected LEFT
- CENTER third selected CENTER
- RIGHT third selected RIGHT
- generated callback matched runtime state
- generated user hook printed readable LEFT/CENTER/RIGHT values
- configured initial state applied without notification
- runtime remained stable

### System Runtime

Physically confirmed:

- gear launcher
- System Launcher
- Display / Brightness page
- Back navigation
- live Brightness slider and percentage
- real ESP32-P4 backlight control through `bsp_display_brightness_set()`
- current-session brightness retention
- complete Wi-Fi Manager page
- real scan-list population with structured SSID rows
- live RSSI and security presentation
- Connected and Saved badges
- network selection
- protected-network password dialog
- native keyboard visibility, input and correct physical geometry
- Connect, Disconnect, Reconnect and Forget workflows
- connected details including IP, gateway, security, station MAC and AP BSSID
- approximately 63 FPS after keyboard optimisation
- Interactive Assets remain operational after leaving System

### Storage Runtime

Physically confirmed:

- Storage page creation
- lazy construction
- demand-created page/worker resources and acknowledged teardown
- SD status and capacity
- Refresh
- directory browsing
- folder navigation
- Previous / Next paging
- Read / Write Test
- Select Item mode
- Delete Empty Folder
- Hosted Wi-Fi coexistence
- repeated Storage use without crash

Delete File, Rename, Format, Mount / Unmount and recursive deletion are not claimed as implemented or physically proven.

### Hosted Wi-Fi and SD coexistence

The restored connectivity proof is:

```text
H_SDIO_DRV: Card init success, TRANSPORT_RX_ACTIVE
transport: Identified slave [esp32c6]
H_API: Transport active
FG_WIFI: STA started
FG_WIFI: MAC read err=ESP_OK
FG_WIFI: WiFi hosted init READY
RPC_WRAP: Station mode: Connected
FG_WIFI: Got IP: 192.168.0.92
FG_SD: SD mounted OK
FG_SD: SD TEST PASS
```

The observed IP address is a runtime DHCP result, not a permanent configuration value. The SDMMC coexistence path also reported:

```text
sdmmc_host_init:
SDMMC host already initialized,
skipping init flow
```

Wi-Fi and SD were physically operating simultaneously.

The same Hosted backend was physically exercised through the complete generated Wi-Fi Manager workflow: scan-list population, network selection, protected-network password entry, Connect, Disconnect, Reconnect, Forget Network and connected-detail projection. This UI proof extends the consumer of the Hosted service without changing the proven SDIO transport or SD Slot 0 coexistence architecture.

The transport also emitted this observed warning:

```text
Version mismatch:
Host [2.9.0] > Co-proc [0.0.0]
```

This is recorded as an observed warning. It is not identified as the cause of the previous transport failure, and this documentation milestone makes no ESP32-C6 firmware-update recommendation.

### System health during interaction

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- SD test passed
- Wi-Fi and SD operating simultaneously
- no crash after interaction

Physical Button, Toggle, Three-Position, Light, the scoped Status Indicator Binary Output behavior and the built-in System Runtime behavior recorded above are proven. Toggle and Three-Position resized contain-fit output is not claimed as physically checked unless separately recorded.

## Verified automated status

### Current validation

- the focused current Layout Designer, AI Region Composer, Widget Registry, Widget Tray/hydration and QR preview/export selection passes 53/53 across 8 suites
- all six template definitions and every semantic region contract are covered by the Layout Designer and AI Region Composer suites
- the broader exporter selection recorded for the QR/runtime save point passes 236/236 across 33 suites
- QR native generation, setter declaration/implementation and absence of User Event hooks are covered; physical QR scan proof remains pending
- the eleven-component Standard theme/parity regression passes 158/158
- Graphite/orange, Cyber teal and Nordic light are verified through the semantic theme pipeline
- custom palette export is verified
- Canvas, Browser Preview, generated LVGL and physical ESP32-P4 theme parity are verified for Led, Bar, Arc, Chart, Table, Keyboard, Calendar, Scale, Roller, MsgBox and ButtonMatrix
- Chart validation covers native series geometry, Y-axis labels, X-axis point-index labels, responsive gutters and non-clickable sibling labels
- TypeScript, ESP-IDF 5.5.4 / LVGL 9.2.2 firmware build, firmware flash, physical review and `git diff --check` pass for this milestone
- System Context and Surface regressions cover open, close, Back, Display navigation, live brightness state, session retention, disabled placeholders and preservation of existing application interaction
- System Context and Surface regressions also cover deterministic Wi-Fi scan, structured rows, selection, open/protected branching, password and forget workflows, connected details, Disconnect and Reconnect
- System LVGL exporter regressions cover persistent containers, internal callbacks, gear generation, visibility switching, the `10–100` slider, Waveshare BSP brightness integration and the complete Wi-Fi Manager projection contract
- Wi-Fi generator coverage includes connected-detail fields, structured row generation, password workflow and backend intent callbacks
- all five workflows have focused configured-helper, resize, measurement, fit, preview and exporter coverage where implemented
- Creator, Toggle and Three-Position State Sheet, crop interaction, row-remapping, image-pipeline, linked-crop and atomic-registration regressions pass; unchanged State Sheet suites may require the established longer timeout in combined runs
- keyboard exporter lazy-creation, reusable-instance, attachment, geometry, ordering and relative-width regressions pass
- focused LED, Bar, Arc, Chart, standard Keyboard, Calendar, Roller, Message Box, Button Matrix, TabView and Tileview runtime exporter tests pass
- focused Input, Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box and IconButton tests pass
- focused Button Text, Text Value, Heading Text and Clock Presentation serialization, preview and exporter tests pass
- TabView exporter tests pass 5/5 and Tileview exporter tests pass 7/7
- Heading focused tests pass 7/7, Clock tests pass 7/7, and the Button/Text/Heading/Clock presentation regression passes 29/29
- standard-component range, clamping, duplicate suppression, transition, touch/programmatic sharing, collision naming and no-creation-hook coverage passes where applicable
- developer hook declaration/stub merge and existing-body preservation coverage passes in `export-server.test.js`
- live `/export` and standalone `/export-idf-project` validation pass for the standard-component runtime
- Button and Light hardware-backed resize/contain behavior retains its focused automated coverage
- Toggle, Status Indicator and Three-Position configured-helper, Canvas resize, registry refresh, measurement, visible-bounds fitting, preview scaling and LVGL contain regressions pass
- shared intrinsic and alpha measurement, state-set union geometry, same-ID invalidation, metadata-write deduplication, linked crop, idempotence and legacy dimension recovery regressions pass
- TypeScript validation passes
- the complete exporter regression reached 212/212 after IconButton
- the Canvas regression suite reached 51/51
- generated API and preservation tests reached 33/33
- `export-server.js` syntax validation passes
- interactive Standard hook preservation passes through live and standalone generation coverage
- generated-output verification passes
- ESP-IDF firmware build passes for the recorded Wi-Fi Manager implementation and the standard LVGL runtime API milestone
- scoped diff checks pass
- the complete export-server suite is not claimed as passing while `fg_upload_1024x600_neural_core_67dd4ba0.c` and `fg_upload_carbon_fiber_be774fd2.c` are absent; this unrelated fixture issue does not weaken export validation

This physical validation is limited to the named eleven-component Standard group. Later runtime-complete Standard components retain automated proof but are not claimed as physically reviewed by this milestone.

## Debugging map

Start at the ownership boundary matching the symptom.

| Symptom | Begin with | Then inspect |
|---|---|---|
| Layout template preview is wrong | `ForgeUILayoutDesigner.ts` | selected `ForgeUILayoutTemplate.layout`, definition dimensions and shared preview scaling |
| Apply Layout creates wrong regions or positions | `ForgeUILayoutDesigner.ts` | selected definition lookup, shared composition and Canvas insertion |
| Region Box cannot be selected or moved | `ComponentPreview.tsx` | `PreviewContainer.tsx`, Box props and structural metadata |
| Region assignment is missing | `LayoutRegionInspector.tsx` | `layoutRegionKey`, `layoutRegionId`, available-region lookup |
| Assigned component is not included in Auto Arrange | `ForgeUILayoutDesigner.ts` | stable-key matching and selected project component list |
| Auto Arrange overlaps children | Auto Arrange mode in `ForgeUILayoutDesigner.ts` | region bounds, padding, gaps, minimum sizes and preferred dimensions |
| Auto Arrange changes component behavior | atomic geometry update in `components.ts` | ensure only `x/y/w/h` changed and props/IDs remain intact |
| Resizing a region does not reflow children | `LayoutRegionInspector.tsx` Auto Arrange action | selected-region metadata and assigned-component lookup |
| AI Fill still emits final coordinates | `ForgeAIPrompts.ts` | `ForgeAIRegionComposer.ts`, selected template-mode parsing |
| AI Fill sprays components outside regions | `ForgeAIRegionComposer.ts` | canonical region-key assignment and Auto Arrange invocation |
| AI Fill uses unsupported component types | AI component catalogue and `ForgeAIRegionComposer.ts` | canonical type validation and alias resolution |
| AI Fill chooses controls inappropriate for the selected layout | definition `aiGuidance` and purpose-aware AI filtering | explicit Prompt Builder selections and semantic region response |
| Browser Preview region styling differs from Canvas | `forgePreviewRenderer.tsx` | `ComponentPreview.tsx`, semantic Box props and theme palette |
| LVGL region styling differs from Browser Preview | `ForgeUILvglExport.ts` Box branch | semantic surface/border role resolution |
| Save/reload loses region assignment | project component serialization | additive component props and region-key stability |
| Duplicate or copied components retain invalid region references | component copy/duplicate path | stable semantic keys and region-existence validation |
| Structural lock does not block movement | current known limitation | lock metadata is stored but enforcement is not yet implemented |
| AI Fill network request fails | `ForgeAIClient.ts` | `/api/forgeui-ai-layout`, region-document response validation |
| Widget is missing, misnamed or in the wrong Tray category | `ForgeUIWidgetRegistry.ts` | definition status/category, registry search and `ForgeUIWidgetSet.ts` projection |
| Tray insertion has wrong defaults or size | widget definition `insertionFactory` | `useDropComponent.ts`, click/keyboard insertion dispatch |
| Tray has horizontal overflow or wrapped names | `components/sidebar/Sidebar.tsx` | `DragItem.tsx`, child `min-width: 0`, ellipsis and asset Edit reservation |
| Tray differs after hydration | `Sidebar.hydration.test.tsx` | client-only persisted asset loading and stable initial registry render |
| Free-form Canvas movement snaps or rounds | `PreviewContainer.tsx` | drag/resize geometry update and component reducer; Layout Auto Arrange must remain explicit |
| QR preview is blank or not scannable | `StandardQRCodePreview.tsx` | persisted text/colors/quiet zone and `qrcode` encoding result |
| Generated QR is missing or stale | `ForgeUILvglExport.ts` QR branch | `CONFIG_LV_USE_QRCODE`, generated `90_Studio_Export.*` declaration/implementation |
| QR unexpectedly creates a developer hook | QR output classification in `ForgeUILvglExport.ts` | exporter result `userEventHooks`; QR must remain setter-only |
| Unified New action or type switching is wrong | `ForgeUIInteractiveAssetPanel.tsx` | `InteractiveLightDesigner.tsx`, `InteractiveAssetAIGenerator.tsx` |
| Editing opens the wrong kind | `ForgeUIInteractiveAssetPanel.tsx` | asset `kind`, Light `onActivate` path |
| Canvas Open Creator is missing or opens the wrong designer | `PreviewContainer.tsx` | `ForgeUINavigation.ts`, component type guards, navigation target |
| Configured Creator opens a blank draft | `ForgeUINavigation.ts` request | `interactiveAssetId`, type-scoped edit request in `ForgeUIInteractiveAssetPanel.tsx` |
| Unconfigured Creator creates or saves unexpectedly | owning designer new-request effect | registry calls, Save handler, assignment handler |
| Inspector helper is missing or stale after configuration | owning `*CreatorHelper.tsx` | linked Interactive Asset, required uploaded visual IDs, Interactive Asset and uploaded-asset update events |
| Configured Toggle helper disappears | `InteractiveToggleCreatorHelper.tsx` | Inspector render condition, linked Toggle and OFF/ON resolution |
| Configured Status helper disappears | `InteractiveStatusIndicatorCreatorHelper.tsx` | Inspector render condition, linked Status Indicator and OFF/ON resolution |
| Configured Three-Position helper disappears | `InteractiveThreePositionToggleCreatorHelper.tsx` | Inspector render condition, linked asset and LEFT/CENTER/RIGHT resolution |
| Button draft/save is wrong | `ForgeUIInteractiveAssetPanel.tsx` | Button model, registry validation |
| New Button reuses `Button 1` | Button new-draft initialization in `ForgeUIInteractiveAssetPanel.tsx` | all registered Button assets, `ForgeUIInteractiveButtonHook.ts` normalization |
| Button callback preview or duplicate warning is wrong | `InteractiveButtonCreatorHelper.tsx` | `ForgeUIInteractiveButtonHook.ts`, grouped validation in `ForgeUIExportValidation.ts` |
| Duplicate Button callbacks produce repeated diagnostics | `ForgeUIExportValidation.ts` | generated callback grouping and Label normalization |
| Light draft/save is wrong | `InteractiveLightDesigner.tsx` | Light model, registry validation |
| Toggle draft/save is wrong | `InteractiveLightDesigner.tsx` | Toggle model, selected `assetKind`, registry validation |
| Toggle OFF/ON preview is wrong | `InteractiveToggleSwitchPreview.tsx` | Canvas preview, resolver, uploaded assets |
| Toggle callback is wrong or missing | `ForgeUILvglExport.ts` Toggle branch | `userEventHooks`, `export-server.js`, `95_UserEvents.*` |
| Toggle state resets unexpectedly | `InteractiveToggleSwitchCanvasPreview.tsx` | mounted local state, asset ID and initial state effect |
| Three-Position draft/save is wrong | `InteractiveThreePositionToggleDesigner.tsx` | model, registry validation, persistence |
| Three-Position LEFT/CENTER/RIGHT preview is wrong | `InteractiveThreePositionTogglePreview.tsx` | Canvas preview, resolver, uploaded assets |
| Three-Position jumps to top-left | `ComponentPreview.tsx` | `PreviewContainer`, `useDropComponent.ts`, component `x/y/w/h` |
| Three-Position Browser Preview is missing | `forgePreviewRenderer.tsx` | positioned output insertion and Canvas preview component |
| Browser Preview ignores resized component bounds | `forgePreviewRenderer.tsx` | `commonStyle`, Browser Preview wrapper, `fillContainer`, type-specific preview renderer |
| Three-Position is hard to click | `ForgeUILvglExport.ts` Three-Position branch | full parent bounds, child flags, artwork transparent margins |
| Three-Position selects the wrong zone | generated `fg_three_way_input_event_cb()` | `local_x`, button coordinates and configured width |
| Three-Position has stale artwork references | `ForgeUIInteractiveAssetResolver.ts` | Uploaded Asset Registry, persistence, reference protection |
| Three-Position enum/callback is missing | `ForgeUILvglExport.ts` | `userEventHooks`, `export-server.js`, `95_UserEvents.*` |
| Three-Position set action or crop workspace is missing | `InteractiveAssetAIGenerator.tsx` | `generateRequestId`, `three-position-set`, master-image state |
| Three-Position crop handles or linked sizing are wrong | `StateSheetOverlay.tsx` | `resizeStateSheetRegions()`, source/display coordinate scale |
| Three-Position row labels or assignments are wrong | `updateThreePositionRowMapping()` | `remapThreePositionProject()`, unique swap behavior |
| Confirm Crops fails | `registerThreePositionToggleCrops()` | PNG data URL validation, Base64 decoding, converter responses |
| Only some Three-Position assets register | `ForgeUIAIImagePipeline.ts` | prepared/completed asset arrays, registry mutation after all conversions |
| Shared Toggle Runtime is duplicated or missing | `ForgeUILvglExport.ts` | `fg_toggle_input_t` / setter / event emission guard |
| Shared Three-Position Runtime is duplicated or missing | `ForgeUILvglExport.ts` | `fg_three_way_input_t` / setter / event emission guard |
| Button Normal/Pressed preview is wrong | `InteractiveButtonPreview.tsx` | `InteractiveButtonCanvasPreview.tsx`, resolver |
| Light OFF/ON preview is wrong | `InteractiveLightPreview.tsx` | `InteractiveLightCanvasPreview.tsx`, resolver |
| Configured preview remains a placeholder after assignment | kind-specific Canvas preview update listener | Interactive Asset update event, uploaded-asset update event, same-ID registry replacement |
| Configured and placeholder previews are layered | kind-specific Canvas preview conditional rendering | resolved asset completeness and registry refresh |
| Selected resize border is missing | `ComponentPreview.tsx` | per-type `resizeMode="selection-border"` opt-in, then `PreviewContainer.tsx` selected state and hit zones |
| Resize crosses the Canvas boundary or Inspector geometry lags | `PreviewContainer.tsx` | shared clamp calculation and normal component `updateProps` path |
| Resize changes local preview state | owning type-specific Canvas preview | `PreviewContainer.tsx` resize interaction suppression and click propagation |
| Replacing artwork resets component geometry | owning designer assignment handler | fresh-placeholder condition and existing component `x/y/w/h` |
| Fit action remains disabled after artwork is visible | owning `*CreatorHelper.tsx` | registry subscription and complete intrinsic/alpha metadata in `ForgeUIUploadedAssetRegistry.ts` |
| Inactive state was never measured | owning type-specific preview | hidden preload images and rendered metadata callback |
| Same-ID replacement retains stale measurements | `ForgeUIUploadedAssetRegistry.ts` | `browserSrc` change invalidation before preview remeasurement |
| Metadata update loop | `ForgeUIUploadedAssetRegistry.ts` | identical rendered-metadata write deduplication |
| Fit Bounds produces state jitter | `ForgeUITwoStateVisibleBounds.ts` | stable required-state union and linked cropped asset IDs |
| N-state union crop is wrong | `ForgeUITwoStateVisibleBounds.ts` | compatible source dimensions, required-state measurements and union mapping |
| Fit operation creates repeated crops | owning `*CreatorHelper.tsx` | completed-state detection in `ForgeUITwoStateVisibleBounds.ts` |
| Original artwork disappears after fitting | `ForgeUITwoStateVisibleBounds.ts` | linked crop registration and Interactive Asset state-ID replacement only |
| Light preview changes saved/exported state | `InteractiveLightCanvasPreview.tsx` | local preview state and `initialState` resolution |
| Status Indicator OFF/ON Browser Preview is wrong | `InteractiveStatusIndicatorPreview.tsx` | Status Indicator model and resolver |
| Status Indicator Canvas Preview is wrong | `InteractiveStatusIndicatorCanvasPreview.tsx` | kind-aware lookup, uploaded assets, `initialState` |
| Status Indicator Creator opens Layout | `ForgeAIPanel.tsx` | Status Indicator target guard and Interactive tab selection |
| Status Indicator drops too small or has incorrect bounds | `useDropComponent.ts` | Status Indicator `defaultW` / `defaultH`, component `w/h`, PreviewContainer bounds |
| Status Indicator placeholder is constrained vertically | `InteractiveStatusIndicatorCanvasPreview.tsx` | preview wrapper minimum height and placeholder dimensions |
| Border grows but artwork remains capped at intrinsic size | owning type-specific preview | full-container width/height and `objectFit: contain`; remove intrinsic max-size constraints |
| Status Indicator preview artwork is stretched | `InteractiveStatusIndicatorPreview.tsx` | full-container width/height and centred `objectFit: contain` |
| Status Indicator click does nothing in Canvas Preview | `InteractiveStatusIndicatorCanvasPreview.tsx` | local preview state and `onPreviewClick` handler |
| Three-Position preview is stretched | `InteractiveThreePositionTogglePreview.tsx` | full-container `objectFit: contain`, never `fill` |
| Three-Position state artwork changes size between states | `InteractiveThreePositionTogglePreview.tsx` | identical rendered bounds and common measured aspect inputs |
| AI uses the wrong state modes | `InteractiveAssetAIGenerator.tsx` | parent `selectedAssetKind` |
| AI request/image conversion fails | `ForgeUIAIImagePipeline.ts` | `/api/forgeui-ai-hero`, `export-server.js` conversion route |
| Keyboard appears offset despite correct X/Y | `ForgeUILvglExport.ts` Keyboard branch | final `LV_ALIGN_TOP_LEFT`, call ordering, parent coordinates |
| Password field does not open keyboard | generated textarea callback | `lv_keyboard_set_textarea()`, top layer, focus/click events |
| Keyboard appears off-screen | keyboard alignment and geometry | `LV_ALIGN_TOP_LEFT`, `(0, 350)`, top-layer coordinates |
| Keyboard is laggy | password-dialog projection pause | repeated row/label updates, diagnostic logging |
| Keyboard outer size is correct but keys are compressed | keyboard main/item styles | padding, row/column gaps, font, button-matrix width controls |
| Keyboard special-key proportions differ from Studio | generated keyboard control map | per-row width units and `ForgeUILvglExport.keyboard.test.ts` |
| Generated image is missing after restart | `ForgeUIUploadedAssetRegistry.ts` | uploaded localStorage record and generated file path |
| Interactive Asset is missing after restart | `ForgeUIInteractiveAssetPersistence.ts` | registry import and validation |
| `Use on Selected` does nothing | owning designer/panel | selected component type, resolver component props, Redux update |
| Canvas resolves the wrong kind | kind-specific Canvas preview | `getInteractiveAssetByKind()` and the five exact kind-aware getters |
| Button export is wrong | `ForgeUILvglExport.ts` Button branch | uploaded LVGL readiness, dimension resolution, contain scale and asset-source collection |
| Light export/setter is wrong | `ForgeUILvglExport.ts` Light export map/branch | final component geometry, contain scale, centring, `initialState`, API naming and uploaded assets |
| Hardware image remains at native size | `lv_image_set_scale(...)` in generated `90_Studio_Export.c` | registry dimensions, PNG IHDR recovery, LVGL descriptor helper and final component `w/h` |
| Toggle hardware image remains at native size | `ForgeUILvglExport.ts` Toggle branch | OFF/ON common contain scale, dimension fallback order and child centring |
| Three-Position hardware image remains at native size | `ForgeUILvglExport.ts` Three-Position branch | LEFT/CENTER/RIGHT common contain scale, dimension fallback order and child centring |
| Canvas and hardware contain-fit sizes differ | `ForgeUILvglExport.ts` contain-scale calculation | both state dimensions, shared scale, child centring and component geometry |
| Status Indicator export/setter is wrong | `ForgeUILvglExport.ts` Binary Output export map/branch | Status Indicator lookup, `initialState`, API naming, uploaded assets |
| Binary Output Runtime is duplicated or missing | `ForgeUILvglExport.ts` | shared `fg_binary_output_t` / `fg_binary_output_set()` emission guard |
| Generated Setter API is wrong | `ForgeUILvglExport.ts` | deterministic output API allocation and export validation |
| Shared Binary Output Runtime switches the wrong artwork | generated `fg_binary_output_set()` inputs | per-instance runtime record and OFF/ON symbols |
| Button hook is missing | `ForgeUILvglExport.ts` | `Header.tsx`, `export-server.js`, `95_UserEvents.*` |
| LED runtime API or changed hook is missing | `ForgeUILvglExport.ts` | `export-server.js`, generated `90_Studio_Export.*`, `95_UserEvents.*` |
| Bar runtime API, range or changed hook is wrong | `ForgeUILvglExport.ts` | `export-server.js`, generated `90_Studio_Export.*`, `95_UserEvents.*` |
| Arc runtime API, range or changed hook is wrong | `ForgeUILvglExport.ts` | `export-server.js`, generated `90_Studio_Export.*`, `95_UserEvents.*` |
| Chart add/clear API or hooks are wrong | `ForgeUILvglExport.ts` | `export-server.js`, generated chart/series state, `95_UserEvents.*` |
| Chart axis labels do not align with series points | `ForgeUIStandardChart.ts` shared layout | `StandardChartPreview.tsx`, Chart export branch and generated sibling `lv_label` positions |
| Standard Keyboard Show/Hide API or hooks are wrong | `ForgeUILvglExport.ts` | `export-server.js`, retained unattached keyboard, `95_UserEvents.*` |
| Calendar setter, validation or hook is wrong | `ForgeUILvglExport.ts` | `export-server.js`, retained selected date, `95_UserEvents.*` |
| Roller selection API, text or hook is wrong | `ForgeUILvglExport.ts` | `export-server.js`, option metadata, `95_UserEvents.*` |
| Message Box visibility/button hooks are wrong | `ForgeUILvglExport.ts` | `export-server.js`, retained panel metadata, `95_UserEvents.*` |
| Button Matrix selection API or hook is wrong | `ForgeUILvglExport.ts` | `export-server.js`, map/count/disabled metadata, `95_UserEvents.*` |
| TabView selects the wrong tab | `ForgeUILvglExport.ts` Tabview branch and transition helper | retained selected index/count, `lv_tabview_set_active()`, `lv_tabview_get_tab_active()` |
| Tileview selects the wrong tile | `ForgeUILvglExport.ts` Tileview branch and `StandardTileViewPreview.tsx` | retained coordinates, native tile map, direction constraints, active-tile lookup and silent setter |
| Input setter or genuine-user hook is wrong | `ForgeUILvglExport.ts` Input export map/branch | retained text, programmatic guard, textarea event adapter, `export-server.js`, `95_UserEvents.*` |
| Input focuses but no keyboard appears | Standard Input ownership | expected behavior: native textarea focus only; no automatic Standard Keyboard attachment; System keyboard remains private |
| Textarea setter or hook is wrong | `ForgeUILvglExport.ts` Textarea export map/branch | multiline retained text, programmatic guard, placeholder ownership, `95_UserEvents.*` |
| Switch checked runtime is wrong | `ForgeUILvglExport.ts` Switch export map/branch | retained checked state, `lv_switch`, setter guard, Preview local state |
| Switch checked colour is native blue | Switch generated styles | `LV_PART_MAIN`, `LV_PART_INDICATOR | LV_STATE_CHECKED`, opacity, accent literal and regenerated `90_Studio_Export.c` |
| Checkbox checked runtime is wrong | `ForgeUILvglExport.ts` Checkbox export map/branch | retained checked state, serialized label, setter guard, `lv_checkbox` |
| Checkbox fallback label appears | Checkbox label normalization/defaults | new defaults, legacy fallback normalization, explicit custom-label preservation and generated empty label |
| Radio selected runtime is wrong | `ForgeUILvglExport.ts` Radio export map/branch | retained independent selection, circular `lv_checkbox`, no grouping model |
| Radio fallback label appears | Radio label normalization/defaults | default `"Radio"` removal, legacy normalization and explicit custom-label preservation |
| Progress setter or clamping is wrong | `ForgeUILvglExport.ts` Progress export map/branch | retained value/range, output-only setter, absence of hook |
| Circular Progress knob is visible | CircularProgress exporter branch | `LV_PART_KNOB` opacity/size removal and current regenerated C |
| Circular Progress can be dragged | CircularProgress exporter branch | `LV_OBJ_FLAG_CLICKABLE` removal and absence of changed callback/hook |
| NumberInput value runtime is wrong | `ForgeUILvglExport.ts` NumberInput export map/branch | outer container, numeric textarea, `int32_t` parsing/range/step, guard and native button callbacks |
| NumberInput outer border is missing or duplicated | NumberInput generated container/shared preview | container-owned 1 px border/radius, borderless children, outline/shadow and internal dividers |
| NumberInput steppers are missing or use the wrong step | NumberInput exporter branch | increment/decrement button creation, `LV_SYMBOL_UP/DOWN`, serialized step constant, callbacks and regenerated C |
| Select selected index or text is wrong | `ForgeUILvglExport.ts` Select export map/branch | `lv_dropdown`, serialized options/count, selected-index guard and text buffer |
| Select popup uses native blue or wrong theme | Select popup styling | `lv_dropdown_get_list()`, popup `LV_PART_MAIN`, `LV_PART_SELECTED` checked/pressed selectors and arrow `LV_PART_INDICATOR` |
| Image source runtime is wrong | `ForgeUILvglExport.ts` Image export map/branch | LVGL-ready asset resolution, retained pointer, `NULL`/pending no-op behavior |
| Box visibility runtime is wrong | `ForgeUILvglExport.ts` Box export map/branch | retained non-root object, hidden flag, child parent alias, root exclusion |
| IconButton enabled state or click hook is wrong | `ForgeUILvglExport.ts` IconButton export map/branch | retained enabled state, disabled LVGL state, `LV_EVENT_CLICKED`, hook preservation |
| Slider captures Canvas movement or mutates saved value | `StandardSliderPreview.tsx` and Slider preview call sites | explicit Canvas/Browser mode, local state, Canvas wrapper gesture ownership |
| Button Text does not export | `ForgeUIStandardButton.ts` | `ButtonPanel.tsx`, `ButtonPreview.tsx`, `forgePreviewRenderer.tsx`, Button exporter branch |
| Text Value does not export | `ForgeUIStandardText.ts` | `StandardTextPanel.tsx`, `TextPreview.tsx`, `forgePreviewRenderer.tsx`, Text exporter branch |
| Heading text is wrong | `ForgeUIStandardHeading.ts` | `HeadingPanel.tsx`, `HeadingPreview.tsx`, Heading exporter branch |
| Clock formatting is wrong | `ForgeUIStandardClock.ts` and Clock exporter generation | serialized presentation props, generated `snprintf()` format, `fg_rtc_get()` |
| Clock Preview differs from generated output | `ClockPreview.tsx` | `ForgeUIStandardClock.ts`, `forgePreviewRenderer.tsx`, Clock exporter branch |
| Multiple Clocks overwrite one another | `ForgeUILvglExport.ts` Clock allocation | per-instance label, timer, separator state and collision-safe identifiers |
| Clock separator does not blink correctly | Clock presentation resolver and generated callback | `blinkSeparator`, retained separator-visible state, one-second timer |
| Clock 12-hour formatting is wrong | Clock formatter generation | hour modulo conversion, midnight/noon handling, AM/PM suffix |
| Clock seconds formatting is wrong | Clock formatter generation | `showSeconds`, generated format string and RTC seconds field |
| Selected theme does not propagate | `ForgeThemeContext.tsx` | `forgeThemeMap.ts`, active Theme Manager palette |
| Canvas uses the wrong Standard theme | `ComponentPreview.tsx` | active palette subscription, shared Standard preview palette props |
| Browser Preview uses the wrong Standard theme | `forgePreviewRenderer.tsx` | `ForgeThemeContext.tsx`, shared Standard preview renderer |
| Generated LVGL uses the wrong theme | `ForgeUILvglExport.ts` semantic palette resolution | generated LVGL style calls and export payload palette |
| Canvas, Browser and P4 theme parity differs | `forgeThemeMap.ts` semantic roles | shared preview renderer, generated LVGL, Generate -> Build -> Flash state |
| Custom palette is lost during export | `generateForgeUILvglCode()` palette option | semantic resolver, Code Preview, live and standalone export call sites |
| Light unexpectedly has a click hook | `ForgeUILvglExport.ts` | ensure Light remains image/setter based |
| Export rejected before flash | `ForgeUIExportValidation.ts` | `Header.tsx`, `export-server.js` |
| Missing generated C source | `export-server.js` | Uploaded Asset Registry, Theme ownership |
| Asset cannot be deleted | `ForgeUIReferenceProtection.ts` | Interactive Asset Registry |
| Duplicate API failure | `ForgeUIExportValidation.ts` | `ForgeUILvglExport.ts` |
| Duplicate `LV_IMAGE_DECLARE` | `ForgeUILvglExport.ts` | export validation |
| Flash never starts | `Header.tsx` | `export-server.js` |
| Generated files are missing | `export-server.js` | export payload and generated CMake list |
| Physical state differs from Canvas | exporter branch | resolved uploaded symbols, generated C source, component dimensions |
| Gear missing on hardware | `ForgeUILvglExport.ts` System Runtime export branch | generated `system_gear` in `90_Studio_Export.c`, application container and foreground ordering |
| System page won't open | generated `fg_system_open_cb()` | gear event registration, System container pointer and hidden flags |
| Brightness slider doesn't update | generated `fg_system_brightness_changed_cb()` | slider range, `LV_EVENT_VALUE_CHANGED`, percentage label and session value |
| Back navigation fails | generated System Back callbacks | target container, `fg_system_show_page()` and hidden flags |
| Brightness changes preview but not hardware | generated `FG_Set_Display_Brightness()` | `bsp_display_brightness_set()`, Waveshare BSP include and display brightness initialization |
| Brightness changes hardware but not preview | `ForgeUISystemContext.tsx` | `ForgeUISystemSurface.tsx` slider state and brightness filter |
| System pages are recreated unexpectedly | `ForgeUILvglExport.ts` System Runtime construction | persistent container creation and visibility-only callbacks |
| Interactive Assets disappear after leaving System | generated application container | `fg_system_show_page()`, application hidden flag and absence of object recreation |
| System navigation differs between Browser Preview and LVGL | `ForgeUISystemContext.tsx` navigation contract | `ForgeUISystemSurface.tsx` and generated System callbacks in `ForgeUILvglExport.ts` |
| Storage page fails to open | `ForgeUILvglExport.ts` Storage branch | generated lazy Storage container |
| Storage Refresh fails | generated Storage Refresh callback | `fg_sd_get_snapshot()` and bounded worker request |
| Storage browsing fails | `40_SD.c` | `fg_sd_list_directory()` and bounded directory model |
| Delete Folder remains disabled | generated Storage row callback | persistent row metadata, empty-folder flag and Storage projection |
| Delete Folder crashes | generated Delete Empty Folder callback | `fg_sd_delete_empty_folder()` and selection bounds |
| Hosted slave transport fails before `esp_wifi_init()` | `sdkconfig` effective Hosted interface | `sdkconfig.defaults`, Slot 1 pins, reset GPIO54 |
| Firmware unexpectedly uses SPI Hosted | `sdkconfig.defaults` | generated `sdkconfig`, Kconfig selection |
| C6 is not identified | Hosted SDIO pins and reset | Slot 1, GPIO14–19, GPIO54, transport logs |
| Wi-Fi works but SD fails | `main.c` boot order | `40_SD.c`, Slot 0, LDO, BSP SD pins |
| SD works but Wi-Fi transport fails | Hosted interface selection | ensure SDIO Slot 1, not SPI |
| Wi-Fi page shows READY but no IP | backend event/IP state | DHCP event and periodic System refresh |
| SSID rows do not populate | `30_WIFI.c` structured scan cache | `fg_wifi_get_networks()`, generated row rebuild |
| SSID row tap does nothing | generated row callback in `ForgeUILvglExport.ts` | row flags, event bubbling, selected network state |
| Protected network does not open password dialog | generated network-row callback | security value, dialog pointer and hidden flags |
| Connected details are dark or invisible | generated explicit label styles | inherited LVGL theme text colour and opacity |
| Connected details are missing | `fg_wifi_snapshot_t` | generated label creation and projection |
| Forget does not clear saved state | `30_WIFI.c` forget path | persisted STA configuration and snapshot saved flag |
| Reconnect does nothing | `fg_wifi_reconnect()` | persisted credentials and current backend state |
| Preview and physical Wi-Fi differ | `ForgeUISystemContext.tsx` | `ForgeUIWifiPage.tsx`, generated backend projection |
| Wi-Fi list does not follow theme | `ForgeUILvglExport.ts` row styles | Browser Preview row theme values |
| Wi-Fi credentials reconnect automatically | ESP-IDF Wi-Fi flash storage | connect/forget behavior in `30_WIFI.c` |

### Creation and editing paths

- `src/forgeui/ForgeUINavigation.ts`
- `src/components/editor/PreviewContainer.tsx`
- `src/components/inspector/Inspector.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`
- `src/forgeui/ai/ForgeAIPanel.tsx`
- `src/hooks/useDropComponent.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`

### Button rendering paths

- `src/components/editor/PreviewContainer.tsx`
- `src/components/inspector/InteractiveButtonCreatorHelper.tsx`
- `src/forgeui/interactive/ForgeUIInteractiveButtonHook.ts`
- `src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Light rendering paths

- `src/components/editor/PreviewContainer.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Toggle rendering paths

- `src/components/editor/PreviewContainer.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/components/inspector/InteractiveToggleCreatorHelper.tsx`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`
- `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`

### Three-Position rendering paths

- `src/components/editor/PreviewContainer.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`
- `src/forgeui/interactive/UnconfiguredThreePositionTogglePlaceholder.tsx`
- `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`

### Status Indicator rendering paths

- `src/components/editor/PreviewContainer.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder.tsx`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`

### Binary Output Runtime paths

- `src/forgeui/ForgeUILvglExport.ts`
- generated `90_Studio_Export.c` runtime records and setters
- generated `90_Studio_Export.h` public setter declarations

### Toggle Input Runtime paths

- `src/forgeui/ForgeUILvglExport.ts`
- generated `fg_toggle_input_t`, `fg_toggle_input_set()` and `fg_toggle_input_event_cb()`
- generated `95_UserEvents.*` bool hooks

### Three-Position Input Runtime paths

- `src/forgeui/ForgeUILvglExport.ts`
- generated `fg_three_way_state_t`, `fg_three_way_input_t`, setter and local-coordinate event callback
- generated `95_UserEvents.*` enum-state hooks

### Standard LVGL Component Runtime paths

- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/theme/ForgeThemeContext.tsx`
- `src/forgeui/preview/forgeThemeMap.ts`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/ForgeUIStandardChart.ts`
- `src/forgeui/preview/StandardChartPreview.tsx`
- `src/forgeui/preview/StandardCalendarPreview.tsx`
- `src/forgeui/preview/StandardScalePreview.tsx`
- `src/forgeui/preview/StandardRollerPreview.tsx`
- `src/forgeui/preview/StandardMessageBoxPreview.tsx`
- `src/forgeui/preview/StandardButtonMatrixPreview.tsx`
- `src/components/editor/previews/BarPreview.tsx`
- `src/components/editor/previews/ArcPreview.tsx`
- `export-server.js`
- generated `90_Studio_Export.c/.h` retained objects, state, helpers and public APIs
- generated and preservation-merged `95_UserEvents.c/.h`
- focused `ForgeUILvglExport.{led,bar,arc,chart,keyboard,calendar,roller,msgbox,buttonmatrix,tabview,tileview,input,textarea,switch,checkbox,radio,progress,circularprogress,numberinput,select,image,box,iconbutton,button,text,heading,clock}.test.ts`
- `src/forgeui/ForgeUIStandardButton.ts`
- `src/forgeui/ForgeUIStandardText.ts`
- `src/forgeui/ForgeUIStandardHeading.ts`
- `src/forgeui/ForgeUIStandardClock.ts`
- standard Button, Text, Heading and Clock Inspector/Preview components
- shared Standard Switch, Checkbox, Radio, Slider, NumberInput, Select and IconButton Preview components
- `export-server.test.js`

### Layout Designer paths

- `src/forgeui/layout/ForgeUILayoutDesigner.ts`
- `src/forgeui/layout/ForgeUILayoutDesigner.test.ts`
- `src/forgeui/layout/ForgeUILayoutDesigner.preview.test.tsx`
- `src/components/inspector/LayoutRegionInspector.tsx`
- `src/components/inspector/Inspector.tsx`
- `src/core/models/components.ts`
- `src/forgeui/ai/ForgeAIRegionComposer.ts`
- `src/forgeui/ai/ForgeAIClient.ts`
- `src/forgeui/ai/ForgeAIEngine.ts`
- `src/forgeui/ai/ForgeAIPrompts.ts`
- `src/forgeui/ai/ForgeAIPanel.tsx`
- `src/pages/api/forgeui-ai-layout.ts`
- `src/components/editor/ComponentPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/ForgeUILvglExport.ts`
- `../docs/FORGEUI_LAYOUT_DESIGNER.md`

### System Runtime paths

- `src/forgeui/system/ForgeUISystemContext.tsx`
- `src/forgeui/system/ForgeUISystemSurface.tsx`
- `src/forgeui/system/ForgeUIWifiPage.tsx`
- `src/components/editor/Editor.tsx`
- `src/forgeui/preview/DevicePreview.tsx`
- `src/pages/_app.tsx`
- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.system.test.ts`
- generated `firmware/ForgeUI-One/main/90_Studio_Export.c`

### AI generation paths

- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/StateSheetOverlay.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Keyboard export paths

- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.keyboard.test.ts`
- generated `lv_keyboard` / `lv_buttonmatrix` map and style calls

### Export path

- `src/forgeui/ForgeUIExportValidation.ts`
- `src/forgeui/ForgeUILvglExport.ts`
- `src/components/Header.tsx`
- `export-server.js`

### Reference-protection path

- `src/forgeui/ForgeUIReferenceProtection.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetRegistry.ts`
- owning Asset Manager or Interactive Assets panel

## Architectural invariants

Preserve these rules:

1. `generateForgeUILvglCode()` is the only LVGL UI exporter.
2. All five Interactive Asset kinds use the shared registry and `forgeui_interactive_assets_v1` persistence layer.
3. All generated state images use the Uploaded Asset Registry.
4. AI generation uses `InteractiveAssetAIGenerator` and `ForgeUIAIImagePipeline`.
5. `selectedAssetKind` is parent-owned; the AI generator has no independent type selector.
6. Canvas assignment uses `interactiveAssetId` through normal component updates; fresh placeholders may adopt asset dimensions, while component geometry is authoritative after placement.
7. Canvas resolution is kind-aware.
8. All five kinds keep separate discriminated data models.
9. Button uses momentary click hooks, Toggle uses generated bool-state hooks, Three-Position uses a strongly typed enum callback, and Binary Output types use generated public setters.
10. Generated UI APIs live in `90_Studio_Export.h/.c`.
11. Live `95_UserEvents.*` files are Studio-generated and preservation-merged, not manually created; existing developer bodies are preserved and missing declarations/stubs are appended.
12. Standalone exported `95_UserEvents.*` files become developer-owned after export.
13. Export validation always occurs before filesystem mutation.
14. Reference protection prevents deletion of in-use assets.
15. `ForgeUILvglExport.ts` generates code only from validated inputs.
16. Built-in Theme assets participate in validation.
17. Failed validation preserves the previous generated firmware.
18. Binary Output Runtime is generated once per export and shared by every Binary Output Interactive Asset.
19. Toggle Input Runtime and Three-Position Input Runtime are each emitted once per export.
20. Per-instance state records, hooks and setter APIs remain unique.
21. Three-Position hit testing converts screen coordinates into control-local coordinates.
22. All five Interactive Asset Canvas components use the shared positioned, selected, draggable and selection-border-resizable wrapper.
23. Missing or stale uploaded-asset references block export; validation is never bypassed to work around them.
24. Direct Creator navigation carries source component identity and an optional linked asset; opening a Creator never saves or assigns.
25. Configured direct Creator requests reopen the linked asset; unconfigured requests initialize a fresh unsaved draft.
26. Active Three-Position generation uses one `three-position-set` master and three linked crop regions.
27. Three-Position uploaded assets register only after all three conversions succeed.
28. `StateSheetOverlay.tsx` owns shared crop geometry; row-to-state remapping does not mutate crop positions.
29. Keyboard map, mode and styles precede the final top-left alignment, position and size.
30. Direct Creator navigation is complete across all five Interactive Assets, and Status Indicator requests remain type-scoped.
31. New Status Indicators default to real `120 × 72` Canvas bounds.
32. Status Indicator preview rendering preserves intrinsic image aspect ratio with centred full-container contain-fit scaling.
33. Status Indicator Canvas Preview may toggle temporary local state for visual verification, but the physical LVGL runtime remains non-clickable and controlled only through `FG_Set_*`.
34. Type-specific previews do not own or reimplement resize geometry.
35. Configured helpers remain available for all five Interactive Assets.
36. Component geometry is authoritative after placement.
37. Registry updates replace stale configured or unconfigured renders without layering them.
38. Rendered state images record intrinsic dimensions and alpha-content bounds.
39. Inactive visual states may preload for measurement without becoming visible.
40. Identical rendered-metadata writes are deduplicated.
41. Replacing `browserSrc` for the same uploaded asset ID invalidates stale intrinsic and alpha metadata.
42. `Fit Bounds to Visible Artwork` is explicit and non-destructive.
43. Stable required-state unions produce same-size linked fitted assets across every required state.
44. Original uploaded assets remain registered after fitting.
45. Completed fitting is idempotent.
46. Button, Toggle, Light and Status Indicator use the shared two-state-compatible path.
47. Three-Position uses the compatible three-state/N-state union path currently proven by LEFT/CENTER/RIGHT.
48. Intrinsic dimensions determine aspect ratio and scale inputs, not maximum Canvas render size.
49. Canvas preview artwork uses centred contain-fit scaling and is not stretched.
50. Generated LVGL uses final persisted component geometry.
51. Multi-state assets use one common safe contain scale across their state images.
52. Intrinsic image dimensions resolve through registry metadata, PNG IHDR and generated LVGL descriptors before the safe fallback.
53. Canvas, Browser Preview, generated LVGL and physical output must remain visually equivalent within the recorded hardware-proof scope.
54. Browser Preview wrappers preserve final component geometry before type-specific previews perform contain-fit rendering.
55. The System Runtime is generated separately from Interactive Assets.
56. Interactive Assets remain alive while System pages are active.
57. System pages never become Interactive Assets.
58. System pages do not become user project screens.
59. Container navigation preserves application and Interactive Asset state.
60. Built-in System controls do not generate user callbacks.
61. Generated hardware and Browser Preview navigation remain equivalent.
62. Current System navigation uses persistent container visibility switching; animated transitions remain future work.
63. ESP-Hosted on this board uses SDIO Slot 1, not SPI.
64. Hosted SDIO uses GPIO14–19 and reset GPIO54.
65. SD storage remains on SDMMC Slot 0 using BSP GPIO39–44.
66. Wi-Fi initializes before SD and retains the 2500 ms delay.
67. `sdkconfig.defaults` must preserve the golden Hosted configuration.
68. The Wi-Fi Manager is a completed built-in System Runtime feature; minor SSID-row theme polish does not change its proven workflow status.
69. Browser Preview Wi-Fi remains deterministic, simulated and hardware-independent.
70. Generated LVGL projects `fg_wifi_snapshot_t` and `fg_wifi_network_t`.
71. `30_WIFI.c` remains the only owner of physical Wi-Fi truth and ESP-IDF Wi-Fi calls.
72. The generated UI must not duplicate credential, connection, scan or reconnect logic.
73. Physical firmware supports one persisted ESP-IDF STA configuration, not a multi-network credential database.
74. Hosted scan execution and immediate AP retrieval belong to the dedicated Wi-Fi backend task; `fg_wifi_pump()` does not retrieve scan results.
75. The native LVGL keyboard is created lazily and reused.
76. System password fields attach through `lv_keyboard_set_textarea()`.
77. Keyboard geometry sets `LV_ALIGN_TOP_LEFT` before absolute top-layer positioning.
78. Periodic Wi-Fi projection pauses during active password entry.
79. System Wi-Fi controls use internal runtime callbacks and never generate user hooks.
80. `95_UserEvents.c` is unrelated to Wi-Fi System UI.
81. Storage Runtime remains a built-in System Runtime and never becomes an Interactive Asset or user project screen.
82. Filesystem logic and physical SD truth remain in `40_SD.c/.h`.
83. Generated Storage LVGL owns presentation and user intent only.
84. Storage page construction remains lazy.
85. The persistent Storage page is reused after first creation.
86. The Storage worker and row pool remain bounded.
87. `fg_storage_request_t` remains compact: operation kind, one path and one name.
88. The shared Storage projection model remains compact.
89. Delete File remains disconnected from generated LVGL until separately proven.
90. Standard LVGL Component Runtime is independent from Interactive Asset Runtime and System Runtime.
91. Standard-component public APIs and retained LVGL state belong in generated `90_Studio_Export.*`.
92. Standard-component developer hooks belong in preservation-merged `95_UserEvents.*`.
93. Interactive Status Indicator remains a setter-only Binary Output Runtime asset and must not inherit the standard `Led` changed hook.
94. Scale remains API-free while it owns no runtime value.
95. TabView active tab is semantic runtime state.
96. Tileview active coordinates are semantic runtime state.
97. Button, Text and Heading own serialized visible content only; those properties do not create runtime transitions or hooks.
98. Clock owns presentation configuration only; RTC/system time owns the live value.
99. Line remains API-free while it owns no semantic runtime state.
100. Generated Clock code exposes no runtime time setter.
101. Generated Clock code exposes no user hook.
102. Interactive Standard semantic state uses a retained object/state, guarded setter, LVGL event adapter and genuine-user hook.
103. Output Standard semantic state uses a retained object/state and setter only when no genuine user transition exists.
104. Serialized presentation generates no runtime API.
105. Components with no semantic runtime state, including Icon and Divider, remain intentionally API-free.
106. Slider Canvas interaction, its silent clamped runtime setter and its
genuine-user change hook are complete and physically proven.
107. Proven Standard components consume semantic theme roles rather than hard-coded decorative colours.
108. Canvas, Browser Preview and LVGL export resolve equivalent Standard semantic roles.
109. Missing semantic theme values use the deterministic graphite fallback.
110. Semantic status colours may remain theme-independent where their status meaning requires it.
111. Selected-theme export parity does not imply runtime hot theme switching on the ESP32-P4.
112. Chart X labels remain deterministic point indexes unless a future serialized X-axis model is explicitly introduced.
113. After Generate -> Build -> Flash, the ESP32-P4 remains the authoritative final visual proof; Canvas and Browser Preview must match it.
114. The Standard Canvas Keyboard remains separate from the reusable private System Runtime keyboard.
115. Input and Textarea focus does not imply automatic Standard Keyboard attachment.
116. Restart or refresh the running Studio bundle after exporter changes and before regenerating firmware.
117. Whenever exporter code changes, inspect regenerated `90_Studio_Export.c` before Build & Flash.
118. Generated `90_Studio_Export.*` remains replaceable output and must not become the architectural source of a manual fix.
119. Layout Designer remains a Studio authoring subsystem, not a firmware runtime family.
120. Selected-template geometry is owned by ForgeUI, not by AI-generated `x/y` coordinates.
121. AI Fill chooses semantic content and region; it does not own final template geometry.
122. Smart regions are normal editable Box components.
123. Region metadata is additive to normal component props.
124. The existing component document remains the persistence source of truth.
125. Stable semantic region keys are preferred over generated component IDs.
126. Auto Arrange changes geometry only.
127. Auto Arrange preserves component props, IDs, runtime semantics, APIs, hooks and asset references.
128. Region assignment must survive save/reload.
129. Layout Designer must not introduce a second exporter.
130. Layout Designer must not introduce a second generated firmware document.
131. `ForgeUILvglExport.ts` remains the only LVGL exporter.
132. Layout Designer work must not change Standard runtime API signatures.
133. Layout Designer work must not change `95_UserEvents` signatures.
134. Dashboard is the implemented structural template. Industrial HMI, Control
Panel, Monitoring, SCADA Overview and Mobile / Portrait are roadmap candidates.
135. New layouts extend `ForgeUILayoutTemplateId` and `forgeUILayoutTemplates`; they do not add template-specific renderers or exporters.
136. Structural-lock enforcement is not yet complete.
137. Drag-to-assign is not yet implemented.
138. ESP32-P4 proof must not be claimed until Generate -> Build -> Flash -> physical review is completed.
139. `ForgeUIWidgetRegistry.ts` is the authoritative widget catalogue; tray lists and compatibility projections must derive from it.
140. Free-form Canvas movement remains unsnapped; Auto Arrange is an explicit Layout Designer operation.
141. QR Code is an output-only Standard runtime component with a public text setter and no User Event hook.
142. `CONFIG_LV_USE_QRCODE=y` is required by generated native QR output.

## Save Point History

Save points are ordered newest to oldest.

### FORGEUI_BOARD_PROFILES__EXPORT_TIME_FEATURE_GATING__LAZY_SYSTEM_TOOLS__CONNECTED_WIFI_45KB_FREE__RAM_OVERLAY__READY_FOR_FINAL_OPERATOR_VALIDATION__2026-07-31

- **Ownership:** Board registry → persisted project selection → generated feature header → shared exporter/runtime pruning. Backends remain separate from generated System Tool UI.
- **Lifecycle:** Wi-Fi Manager/dialogs and Storage page/worker resources are demand-created and safely destroyed. Diagnostics and serial RAM probes are implemented.
- **Proof boundary:** The connected Application-page probe recorded 45,795 bytes current internal free heap, 43,871 minimum-ever, a 27,648-byte largest block and 62 LVGL objects. Ten operator touchscreen cycles and QR scanning remain open. The built ELF contains the compact RAM overlay, but current managed LVGL source does not, so the edit needs a ForgeUI-owned reproducible patch.

### FORGEUI_WIDGET_REGISTRY__LAYOUT_TEMPLATE_LIBRARY__QRCODE_RUNTIME__READY_FOR_QR_HARDWARE_PROOF__2026-07-30

- **Architecture:** The Widget Tray derives from `ForgeUIWidgetRegistry.ts`; six layouts derive from `ForgeUILayoutTemplate` definitions and shared composition/preview logic; QR Code follows the existing Standard component preview, persistence and exporter boundaries.
- **Developer significance:** Extend the registries and shared render/compose paths rather than adding sidebar lists, per-layout implementations or another exporter. QR remains setter-only and hook-free.
- **Validation:** Focused registry, Widget Tray/hydration, Layout Designer/AI composer and QR preview/export tests pass at the recorded scope. QR generated-C inspection, firmware build/flash and physical scan proof remain pending.

### FORGEUI_LAYOUT_DESIGNER__DASHBOARD_SMART_REGIONS_AUTO_ARRANGE_AI_FILL__CANVAS_AND_BROWSER_PREVIEW_MANUALLY_VERIFIED__READY_FOR_EXPORT_AND_HARDWARE_PROOF__2026-07-30

- **What changed:** Added the first complete Dashboard Layout Designer vertical slice using deterministic Header, Status, Main, Controls and Footer smart regions. Added Inspector region assignment, Auto Arrange modes, template-aware AI region composition and semantic region rendering through Canvas, Browser Preview and LVGL exporter coverage.
- **Why:** Direct AI generation of low-level component coordinates produced crowded and inconsistent layouts. ForgeUI now owns structure and geometry while AI Fill supplies semantic content and region assignment.
- **Final architecture:** The Dashboard template creates real editable Box components with additive region metadata. AI returns canonical components grouped by semantic region without final pixel coordinates. ForgeUI assigns, arranges and inserts those components through the existing project model and export path.
- **Developer significance:** Debug template geometry and Auto Arrange in `ForgeUILayoutDesigner.ts`, region assignment in `LayoutRegionInspector.tsx`, AI semantic composition in `ForgeAIRegionComposer.ts`, and generated output in the existing exporter. Do not debug Dashboard geometry by patching generated `90_Studio_Export.c`.
- **Validation:** Dashboard application, region movement/resizing, assignment, Auto Arrange, AI Fill and Browser Preview were manually verified. Twenty focused tests passed. Full Studio production build, generated LVGL inspection, ESP-IDF build, flash and physical ESP32-P4 parity remain pending.

### FORGEUI_STANDARD_LVGL_PARITY__INPUT_TEXTAREA_CHECKBOX_SWITCH_RADIO_PROGRESS_CIRCULAR_PROGRESS_NUMBER_INPUT_SELECT__SEMANTIC_THEME_AND_BORDER_PARITY__ESP32P4_PROVEN__2026-07-30

- **What changed:** Completed semantic theme, border, state and geometry parity for Input, Textarea, Checkbox, Switch, Radio, Progress, CircularProgress, NumberInput and Select. Completed Number Input hardware steppers and container-owned frame, Circular Progress output-only runtime, Select popup theming, Switch checked-state styling, and fallback-label normalization.
- **Why:** Canvas, Browser Preview and generated LVGL had diverged from the flashed device. Native Chakra/LVGL defaults leaked into borders and checked/selected states, Circular Progress was incomplete, Number Input lacked its hardware stepper composition, and stale running Studio bundles generated old firmware after exporter source repairs.
- **Final architecture:** Shared semantic previews own Canvas/Browser visuals where practical. `ForgeUILvglExport.ts` owns explicit LVGL state selectors, Circular Progress retention, Number Input container/textarea/buttons, Select popup styling and normalized fallback labels. The P4 is the final visual reference, `90_Studio_Export.*` remains generated, and `95_UserEvents.*` remains preservation-merged. Standard and System keyboard ownership remains separate.
- **Developer significance:** Exporter changes require a Studio restart or refresh, regeneration and inspection of `90_Studio_Export.c` before build/flash. Native LVGL styling must be explicitly overridden at the real part/state owner when it can leak blue/default theme styling.
- **Validation:** Focused Switch, Radio, Progress, Circular Progress, Number Input and Select suites passed at the recorded totals. Final generated C consumed NumberInput step in hardware callbacks. The final whole-screen ESP32-P4 comparison proved graphite/orange theme, border and interaction parity within the named scope, with no crash after interaction.

### FORGEUI_STANDARD_LVGL_THEME_PARITY__ELEVEN_COMPONENTS__CANVAS_BROWSER_GENERATED_LVGL_ESP32P4_PROVEN__2026-07-29

- **What changed:** Added one semantic theme architecture across Canvas, Browser Preview and LVGL export for Led, Bar, Arc, Chart, Table, Keyboard, Calendar, Scale, Roller, MsgBox and ButtonMatrix; completed Chart Y-axis labels and deterministic X-axis point-index labels; and verified custom palette propagation.
- **Why:** Standard authoring, preview, generated firmware and the physical device needed to follow the same selected-theme semantics without duplicating renderers, hard-coding decorative colours or changing native LVGL runtime behavior.
- **Final architecture:** `ForgeThemeContext.tsx` supplies the selected palette, `forgeThemeMap.ts` resolves semantic roles and deterministic fallback, shared preview renderers consume those roles, and `ForgeUILvglExport.ts` emits equivalent LVGL styling. Runtime APIs, hooks, silent startup and native interaction remain unchanged; runtime P4 theme switching was not added.
- **Validation:** The eleven-component regression passes 158/158. Graphite/orange, Cyber teal, Nordic light, custom palette export, Canvas parity, Browser parity, generated LVGL parity, ESP-IDF 5.5.4 / LVGL 9.2.2 build, firmware flash, physical ESP32-P4 review, TypeScript and `git diff --check` are proven.

### FORGEUI_STANDARD_LVGL_RUNTIME_V1__DEVELOPER_API_SURFACE__INTERACTIVE_OUTPUT_PRESENTATION_CLASSIFICATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added Standard Runtime ownership, APIs, hook metadata and
  Preview parity for Input, Textarea, Switch, Checkbox, Radio, Progress,
  NumberInput, Select, Image, Box, IconButton, Slider and List; and classified
  Icon, Divider and Spinner according to their intentional presentation-only
  contracts.
- **Why:** Exported applications needed a consistent application-to-UI API and genuine UI-to-application event boundary without inventing runtime surfaces for presentation-only components.
- **Final architecture:** Interactive semantic state uses retained state, guarded silent setters and genuine-user hooks; output semantic state uses retained state and setter-only APIs; serialized presentation and components without semantic state expose no runtime API. Live and standalone exports share `ForgeUILvglExport.ts`, while live `95_UserEvents.*` remains preservation-merged and standalone copies become developer-owned.
- **Validation:** Exporter regression reached 212/212, Canvas regression reached 51/51, generated API/preservation coverage reached 33/33, focused component suites and TypeScript/syntax/diff checks passed. The unrelated missing-theme-source fixture remains recorded, and no blanket physical hardware proof is claimed.

### FORGEUI_STANDARD_LVGL_RUNTIME_APIS__TABVIEW_TILEVIEW__TEXT_COMPONENT_PROPERTIES__CLOCK_PRESENTATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added TabView active-index runtime, Tileview active-coordinate runtime, Button Text, Text Value, Heading Text and Clock Presentation; repaired per-instance retained ownership for multiple Clocks; kept Scale and Line intentionally API-free.
- **Why:** Genuine semantic selection state required supported APIs and hooks, static visible content required persisted editor properties, and Clock required configurable presentation without serializing live RTC time.
- **Final architecture:** `ForgeUILvglExport.ts` owns shared live/standalone generation for semantic runtime state, static text presentation and per-instance Clock formatting; `export-server.js` preservation-merges TabView and Tileview hooks while text and Clock presentation add none.
- **Validation:** This save point originally recorded automated evidence only. TabView and TileView subsequently completed their separately documented ESP32-P4 physical proof.

### FORGEUI_STANDARD_LVGL_RUNTIME_APIS__LED_BAR_ARC_CHART_KEYBOARD_CALENDAR_ROLLER_MESSAGE_BOX_BUTTON_MATRIX__LIVE_AND_STANDALONE_PROVEN__2026-07-29

- **What changed:** Added retained runtime APIs and preserved developer hooks for the standard Led, Bar, Arc, Chart, Keyboard, Calendar, Roller, Message Box and Button Matrix. Scale remained API-free after inspection.
- **Final architecture:** `ForgeUILvglExport.ts` generates retained objects, state, APIs, transition helpers, callbacks, hook metadata and collision-safe names; `export-server.js` safely merges the live hook layer for both export workflows.
- **Validation:** Focused runtime and preservation tests, TypeScript, live `/export`, standalone `/export-idf-project` and ESP-IDF build passed. Separate physical touch proof for every standard widget is not claimed.

## Framework extension pattern

Extend the framework by runtime family first, then by asset-specific model and artwork semantics.

### Layout Designer extension

Current implemented template library:

```text
forgeUILayoutTemplates
└── Dashboard
```

Add another layout by extending `ForgeUILayoutTemplateId` and adding one complete `ForgeUILayoutTemplate` definition with metadata, design dimensions, semantic Region Boxes and any ordinary placeholder components. Reuse `getForgeUILayoutTemplate()`, `composeForgeUILayoutTemplate()`, region assignment, Auto Arrange, AI Region Composer, the shared vector preview, normal component serialization and the existing Canvas, Browser Preview and export paths.

Do not add a template-specific renderer, persistence format, AI parser, component model, exporter, generated runtime family, public header or User Event file. Dashboard-specific compatibility helpers may remain, but new template behavior belongs in the shared definition path.

### Standard LVGL Runtime extension

```text
Interactive semantic state
  → retained runtime object/state
  → guarded setter
  → LVGL event adapter
  → genuine-user hook

Output semantic state
  → retained runtime object/state
  → setter only

Serialized presentation
  → no runtime API

No semantic state
  → intentionally API-free
```

Icon and Divider are explicit API-free examples. Icon is a Studio icon-picker convenience whose export uses the existing image-symbol path; runtime image replacement belongs to Image. Divider is visual separation only; dynamic visibility belongs to its parent Box.

### System Runtime extension

Current System services are:

```text
System Runtime
├── Launcher
├── Display / Brightness
├── Wi-Fi Manager
├── Storage Browser
├── Native LVGL Keyboard
└── Future System Pages
```

Display / Brightness, Diagnostics, Wi-Fi Manager, Storage Browser and the reusable native LVGL keyboard are implemented. Storage Runtime remains a reusable built-in platform service alongside Hosted Connectivity Runtime. Bluetooth, Sound and Device remain future concepts and are not always-generated placeholders.

Future built-in System pages should reuse:

- `ForgeUISystemContext`
- `ForgeUISystemSurface`
- dedicated page components such as `ForgeUIWifiPage` and `ForgeUIStoragePage`
- the typed `ForgeUISystemPage` model
- the shared navigation operations
- generated LVGL navigation
- persistent container visibility architecture
- internal generated System callbacks
- non-generated hardware backends
- the shared native keyboard where text entry is required

Future page identifiers currently include:

- Bluetooth
- Sound
- Device

These future pages and services are not implemented today. Adding one may extend the shared System Context, System Surface, a dedicated page component, generated persistent LVGL containers, internal callbacks, a non-generated hardware backend and the shared native keyboard where text entry is required. It must not convert the page into an Interactive Asset or user project screen.

Future System services must follow this ownership split:

```text
typed Studio/Preview state
+
shared System Surface
+
generated persistent LVGL page
+
non-generated firmware backend
```

Hardware backends must not be duplicated inside the exporter.

System Runtime extension is separate from the Interactive Asset extension pattern below.

Current runtime families:

```text
Interactive Input Runtime
  ├── Interactive Button
  └── Interactive Toggle Switch

Three-Position Input Runtime
  └── Interactive Three-Position Toggle Switch

Binary Output Runtime
  ├── Interactive Light
  └── Interactive Status Indicator
```

A future Interactive Asset type should reuse:

- Interactive Asset identity and ID generation
- discriminated union
- registry
- persistence
- validation dispatch
- AI generator and image pipeline
- direct Creator navigation and Inspector onboarding across all five current Interactive Asset types
- shared configured-helper patterns for configured, incomplete and missing-link states
- State Sheet and linked-crop infrastructure when multiple visuals come from one master
- shared selection-border resizing and Canvas-boundary clamping
- shared registry-driven preview refresh
- shared rendered intrinsic-dimension and alpha-content measurement
- `ForgeUITwoStateVisibleBounds.ts` for stable unions across the required state set
- linked cropped assets with preserved originals
- generated common contain-fit dimension-resolution and LVGL scaling
- Uploaded Asset Registry
- Canvas assignment through `interactiveAssetId`
- the single LVGL exporter
- generated-file ownership and the appropriate existing runtime family

It should add only the type-specific pieces it needs:

- model and defaults
- validation
- designer fields and save mapping
- AI modes and prompt templates
- result-to-state mapping
- preview behavior
- Canvas component/preview behavior
- branch inside `generateForgeUILvglCode()`
- an export descriptor, runtime record, generated API, or hook appropriate to its runtime family
- tests covering registry, persistence, Canvas, export, and runtime contract

Future Binary Output assets should reuse `fg_binary_output_t`, `fg_binary_output_set()`, shared runtime emission, and shared setter generation rather than generating a new runtime implementation.

Reusable Creator architecture now includes:

Status Indicator completes this direct Creator family while remaining a Binary Output asset. It does not produce a user hook or hardware touch input.

```text
Canvas or Inspector entry
  ->
shared type-scoped navigation
  ->
configured asset or unsaved draft
  ->
designer
  ->
optional master State Sheet
  ->
linked crop workflow
  ->
atomic uploaded-asset registration
  ->
explicit Save and assignment
```

Three-Position proves the general visual-state pattern:

```text
one master image
  ->
N crop regions
  ->
N uploaded assets
  ->
strongly typed runtime state
```

This is extension guidance, not a claim that additional N-state controls are implemented.

Potential future Standard Runtime concepts include Gauge, Meter, Seven Segment
Display, Numeric Display, Radio Group ownership and dynamic Select options.
These are future only. Slider, Progress, CircularProgress, Checkbox, Radio,
NumberInput and Select support must not be described as unimplemented.

Do not create a new registry, persistence system, AI pipeline, uploaded-asset store, exporter, or duplicate runtime generator for a future type. Reuse an existing runtime family whenever its state and API contract match. Create a new runtime family only when the existing momentary input, persistent binary input, persistent three-position input and binary output contracts cannot represent the control.
## 2026-08-01 documentation save-point note

The current proof ledger is **29/39 (74%)**, with **10 remaining**. Heading,
Box and Divider are newly proven; Button proof is recorded in the same sprint.
Debug Text through the shared normalized presentation and native label geometry
path, and debug Icon through descriptor dimensions, shared 92% automatic fit,
native scale/pivot and centered image bounds. Both remain **READY FOR FINAL
HARDWARE RE-PROOF**.
