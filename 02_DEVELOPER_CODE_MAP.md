# ForgeUI Interactive Asset Framework — Developer Code Map

## Current save point

**FORGEUI_FIVE_INTERACTIVE_ASSETS__THREE_RUNTIME_FAMILIES__PROJECT_HEALTH_PHASE2__TOGGLE_PHYSICAL_VALIDATION_PENDING__2026-07-22**

## Purpose

This is the permanent ownership, integration, and debugging map for the ForgeUI Interactive Asset Framework. It describes the current implementation rather than its development history.

Use this document to answer:

- Where does the subsystem live?
- Which file owns each responsibility?
- Which behavior is shared and which behavior is type-specific?
- What must not be duplicated?
- Where should debugging begin?
- How should another Interactive Asset type extend the framework?

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

The Physical ESP32-P4 proof section records the physically validated Button and Light behaviors. Toggle Switch and Three-Position Toggle are implementation- and host-validation complete, but their current physical ESP32-P4 validation remains pending. Status Indicator proves reuse of the same Binary Output Runtime through its model, Studio, Canvas, persistence, validation, preview, multi-instance, coexistence, and exporter contracts.

All five controls are separate discriminated models inside one framework. They share infrastructure. Interactive Button and Interactive Toggle Switch belong to the Interactive Input Runtime, Interactive Three-Position Toggle Switch owns the Three-Position Input Runtime, and Interactive Light and Interactive Status Indicator belong to the Binary Output Runtime.

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

All Canvas assignment helpers write:

```text
interactiveAssetId
w
h
```

Resolvers do not mutate registries or Redux state.

#### `src/forgeui/interactive/index.ts`

Owns the public module surface for the Interactive Asset subsystem.

Consumers should import established framework APIs from this barrel where practical instead of reaching into internal files unnecessarily.

### Unified Studio UI

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
- coordinating the Light designer
- coordinating the Status Indicator designer
- coordinating the Toggle Switch path through the shared OFF/ON designer
- coordinating the dedicated Three-Position Toggle designer
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

#### `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`

Owns Three-Position Toggle draft, LEFT/CENTER/RIGHT artwork selectors, three-image AI orchestration, initial-state selection, designer-only zone overlay, create/edit/delete/save behavior, persistence coordination, asset cards and `Use on Selected` assignment.

#### `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`

Owns shared interactive image-generation UI and orchestration:

- prompt input
- generation loading state
- two or three sequential state-image requests according to asset kind
- kind-to-generation-mode mapping
- file-prefix selection
- returning the generated uploaded-asset IDs
- reporting generation state to the parent

It receives `selectedAssetKind`; it does not own or render another Asset Type selector.

### Shared AI image pipeline

#### `src/forgeui/ai/ForgeUIAIImagePipeline.ts`

Owns the common generated-image lifecycle:

1. POST the prompt and generation mode.
2. Read the image response.
3. Fetch the returned image data.
4. create a browser `File`.
5. create and register a ForgeUI uploaded asset.
6. send it through LVGL conversion.
7. update the uploaded asset to `lvgl_ready`.
8. return the completed uploaded-asset record.

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
- duplicate detection
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

### Studio behavior

- AI generates Normal and Pressed state images.
- The first result maps to `normalAssetId`.
- The second result maps to `pressedAssetId`.
- `Use on Selected` is enabled only for an `InteractiveButton` component.
- Assignment writes `interactiveAssetId`, width, and height.
- Registry and uploaded-asset persistence restore the assignment after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveButtonPreview.tsx`

Owns presentation and pointer-driven Normal/Pressed preview behavior.

It renders resolved uploaded assets. It does not access the registry directly.

#### `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

Owns Canvas integration for `InteractiveButton`:

- reads the component's `interactiveAssetId`
- performs kind-aware Button lookup
- resolves Normal and Pressed uploaded assets
- resolves asset dimensions with component fallbacks
- renders `InteractiveButtonPreview`

Canvas preview shows Pressed while held and restores Normal on release.

### Runtime behavior

The single LVGL exporter emits:

- a parent LVGL button
- a child LVGL image
- per-instance runtime data
- shared Button event handling
- a generated developer click hook

Event behavior:

```text
PRESSED    → Pressed artwork
RELEASED   → Normal artwork
PRESS_LOST → Normal artwork
CLICKED    → generated developer hook
```

Example hook:

```c
FG_On_Button_Clicked();
```

Runtime path:

```text
Touch
  ↓
LVGL Button
  ↓
fg_interactive_button_event_cb(...)
  ↓
FG_On_Button_Clicked()
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

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`

Owns the OFF/ON browser presentation by reusing the binary visual preview contract.

#### `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`

Owns kind-aware lookup, uploaded artwork resolution, dimensions, saved initial state and persistent mounted preview state. Each Canvas or Browser Preview instance retains its local OFF/ON state until clicked again; preview interaction does not mutate the persisted asset.

`ComponentPreview.tsx` renders it through `PreviewContainer`, preserving the shared positioned, selectable, draggable and resizable Canvas path.

### Runtime behavior

The exporter emits one shared Toggle Input Runtime per export:

```c
fg_toggle_input_t
fg_toggle_input_set()
fg_toggle_input_event_cb()
```

Each instance contributes independent OFF/ON symbols, current state, parent button, child image and callback pointer. Initialization calls `fg_toggle_input_set(..., notify=false)`. A click inverts the current state, updates the artwork and notifies:

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
- dedicated three-image AI generation
- create, edit, delete and Save
- LEFT/CENTER/RIGHT initial-state selection
- designer-only `LEFT | CENTER | RIGHT` zone overlay
- live direct-zone preview
- reference-aware deletion
- `Use on Selected`
- persistence through the existing v1 store

Assignment uses `getInteractiveThreePositionComponentProps()` and writes `interactiveAssetId`, width and height through the normal component update path.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`

Owns direct horizontal three-zone selection across the full rectangular width, local preview state callbacks, optional designer-only zone guidance and the explicit `Missing <STATE> artwork` fallback.

#### `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`

Owns kind-aware asset lookup, LEFT/CENTER/RIGHT uploaded-asset resolution, dimensions, initial-state restoration and persistent local Canvas state.

`ComponentPreview.tsx` wraps the control in `PreviewContainer`, so absolute position, selection, dragging and resizing follow the same shared path as every other Canvas component. `forgePreviewRenderer.tsx` inserts an absolutely positioned browser-preview node; it does not return early from the render loop. Canvas and Browser Preview therefore match the physical three-zone model.

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

The parent button owns the full rectangular hit area. The child image is non-clickable, and both parent and child are non-scrollable. Transparent image margins do not reduce the clickable bounds. Initialization calls the shared setter with `notify=false`; valid interaction uses `notify=true`.

One shared runtime and event callback are emitted per export. Multiple Canvas instances retain independent runtime records, artwork, state and changed callbacks. Physical ESP32-P4 validation of the current hit-area and artwork revision remains pending.

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
- The first result maps to `offAssetId`.
- The second result maps to `onAssetId`.
- `Use on Selected` is enabled only for an `InteractiveLight` component.
- Assignment writes `interactiveAssetId`, width, and height.
- Registry and uploaded-asset persistence restore the assignment after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveLightPreview.tsx`

Owns Light presentation and optional preview controls.

#### `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

Owns Canvas integration for `InteractiveLight`:

- reads the component's `interactiveAssetId`
- performs kind-aware Light lookup
- resolves OFF and ON uploaded assets
- resolves dimensions and saved initial state
- maintains a temporary Canvas preview state
- renders `InteractiveLightPreview`

Clicking the Canvas preview toggles only local preview state. It does not mutate the saved Interactive Light and does not affect exported firmware.

### Runtime behavior

The exporter emits Light as a non-clickable LVGL image:

- initial image follows the saved `initialState`
- no Light click callback is registered
- no Light event hook is generated in `95_UserEvents`
- a generated public setter controls the image source

Example generated API:

```c
void FG_Set_Status_Light(bool enabled);
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
FG_Set_Status_Light(enabled)
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

Every generated setter delegates to `fg_binary_output_set()`. Runtime records and setter APIs are unique per Canvas instance; the runtime structure and state-switching function are not duplicated.

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
- Browser Preview switches between OFF and ON with the same binary state contract as Light.
- `Use on Selected` is enabled only for an `InteractiveStatusIndicator` component.
- Assignment writes `interactiveAssetId`, width, and height.
- Registry and uploaded-asset persistence restore the Status Indicator after Studio restart.

### Preview and Canvas rendering

#### `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`

Owns Status Indicator OFF/ON browser presentation and optional designer preview controls.

#### `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`

Owns Canvas integration for `InteractiveStatusIndicator`:

- reads the component's `interactiveAssetId`
- performs kind-aware Status Indicator lookup
- resolves OFF and ON uploaded assets
- resolves width, height, and saved initial state
- renders `InteractiveStatusIndicatorPreview`
- does not add click behavior or mutate saved state

### Runtime behavior

The exporter emits each Status Indicator as a non-clickable LVGL image backed by its own `fg_binary_output_t` record:

- initial artwork follows the saved `initialState`
- `false` selects OFF artwork
- `true` selects ON artwork
- no click callback is registered
- no event hook is generated in `95_UserEvents`
- a deterministic public setter controls the instance
- multiple instances remain independent even when they reuse the same artwork

Example generated APIs:

```c
void FG_Set_WiFi_Status(bool enabled);
void FG_Set_MQTT_Status(bool enabled);
void FG_Set_Alarm(bool enabled);
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

Three-Position Toggle generation modes:

- `three-position-left`
- `three-position-center`
- `three-position-right`

Three-Position mapping:

- first result → `leftAssetId`
- second result → `centerAssetId`
- third result → `rightAssetId`

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

The request and response pipeline is shared. Type-specific differences are limited to:

- generation mode
- prompt template
- filename prefix
- result-to-state mapping

Do not create a second AI image pipeline for another Interactive Asset kind.

## Canvas integration map

### Component registration and rendering

The relevant integration points include:

- `src/componentsList.ts`
- `src/forgeui/ForgeUIWidgetSet.ts`
- `src/utils/defaultProps.tsx`
- `src/hooks/useDropComponent.ts`
- `src/components/editor/ComponentPreview.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`

`ComponentPreview.tsx` dispatches Canvas rendering to the kind-specific preview component based on Canvas component type:

```text
InteractiveButton → InteractiveButtonCanvasPreview
InteractiveToggleSwitch → InteractiveToggleSwitchCanvasPreview
InteractiveThreePositionToggleSwitch → InteractiveThreePositionToggleCanvasPreview
InteractiveLight  → InteractiveLightCanvasPreview
InteractiveStatusIndicator → InteractiveStatusIndicatorCanvasPreview
```

Canvas components keep only the Interactive Asset reference and component dimensions. Visual records remain in the Interactive Asset and uploaded-asset registries. Every component is rendered through the shared positioning, selection, drag and resize wrapper. Three-Position Toggle follows `PreviewContainer` on Canvas and an explicitly positioned insertion in Browser Preview, preventing origin jumps or early-return omissions.

### Assignment contract

All designers use kind-specific resolver helpers to assign:

```text
interactiveAssetId
w
h
```

Assignment updates form state and Redux component props. Do not bypass the normal component property update path.

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
- generated runtime support
- single shared Binary Output Runtime generation
- single shared Toggle Input Runtime generation
- single shared Three-Position Input Runtime generation
- Three-Position enum and direct local-zone hit testing
- unique per-instance input runtime records

Do not create:

- a separate Interactive Button exporter
- a separate Interactive Light exporter
- a separate Interactive Status Indicator exporter
- a separate Interactive Toggle Switch exporter
- a separate Interactive Three-Position Toggle exporter
- a parallel runtime generator

New Interactive Asset export logic must extend `generateForgeUILvglCode()` and reuse its asset-source and generated-code ownership model.

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
9. records the generated click hook.

### Toggle Switch export branch

Toggle export preparation and the `InteractiveToggleSwitch` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Toggle Switch lookup;
3. resolve OFF and ON uploaded assets and collect their C sources;
4. allocate a unique `FG_On_<Name>_Toggled` hook;
5. create an independent `fg_toggle_input_t` record;
6. create the full-size parent button and non-clickable child image;
7. apply the configured initial state with `notify=false`;
8. attach the shared `fg_toggle_input_event_cb()`.

The shared structure, setter and event callback are emitted once even when multiple Toggle instances export.

### Three-Position Toggle export branch

Three-Position export preparation and the `InteractiveThreePositionToggleSwitch` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Three-Position lookup;
3. resolve LEFT, CENTER and RIGHT assets and collect their C sources;
4. allocate a unique `FG_On_<Name>_Changed` hook;
5. create an independent `fg_three_way_input_t` record;
6. create the full rectangular parent button and non-clickable child image;
7. apply the configured enum state with `notify=false`;
8. attach the shared local-coordinate event callback.

The enum contract, runtime structure, setter and event callback are generated through the single exporter. `local_x = point.x - button_coords.x1` makes zone selection independent of screen placement.

### Light export branch

Light export preparation and the `InteractiveLight` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Light lookup;
3. resolve OFF and ON uploaded assets;
4. confirm both are LVGL-ready;
5. add their C sources to `usedAssetSources`;
6. generate a non-clickable LVGL image;
7. select the initial source from `initialState`;
8. generate a unique public `FG_Set_*` API;
9. switch OFF/ON source inside that setter.

No Light event hook is added.

### Status Indicator export branch

Status Indicator export preparation and the `InteractiveStatusIndicator` branch:

1. read `interactiveAssetId`;
2. perform kind-aware Status Indicator lookup;
3. resolve OFF and ON uploaded assets;
4. confirm both are LVGL-ready;
5. add their C sources to `usedAssetSources` without duplicating reused artwork;
6. create a Binary Output export descriptor;
7. generate a non-clickable LVGL image backed by a per-instance runtime record;
8. select the initial source from `initialState`;
9. generate a unique public `FG_Set_*` API that calls `fg_binary_output_set()`.

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

The frontend generates LVGL code through the single exporter and forwards `code`, validated `assetSources`, `userEventHooks`, and `publicApiDeclarations`. `userEventHooks` carries Button click hooks, Toggle bool hooks and Three-Position state hooks. Binary Output setters travel through `publicApiDeclarations`. It does not write firmware files directly.

### Export server

#### `export-server.js`

Owns filesystem-side export work:

- validating the export payload before writes
- validating generated C sources, paths, existence, expected symbols, and code references
- returning the validated asset-source list to filesystem-side generation
- writing generated UI source and header
- writing the Studio-generated user hook layer
- copying generated image sources
- creating CMake source lists
- live firmware export
- standalone ESP-IDF project export

No firmware mutation occurs before validation succeeds. The server validation boundary is independent of the client preflight.

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
- Button runtime callback wiring
- shared Toggle Input Runtime and per-instance records
- shared Three-Position Input Runtime, enum-dependent state and per-instance records
- shared Binary Output Runtime and per-instance records
- Light setter implementations and declarations

Public APIs are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`.

Do not place permanent product logic in these files.

### `95_UserEvents.c` and `95_UserEvents.h`

Studio creates these as the generated user hook layer. They are not manually created in the live firmware workflow.

Interactive Button click hooks, Interactive Toggle Switch bool hooks and Interactive Three-Position Toggle enum-state hooks are declared and stubbed here. The server recognizes the `Clicked`, `Toggled` and `Changed` hook suffixes and generates the corresponding signatures. Interactive Light and Interactive Status Indicator do not generate event hooks because Binary Output assets are controlled through public setters.

`fg_three_way_state_t` and its LEFT/CENTER/RIGHT enum values are generated in `95_UserEvents.h`, which is included by generated Studio export code before the Three-Position runtime structures use that type.

### Live Studio firmware versus standalone export

| Concern | Studio-controlled live firmware | Developer-owned standalone project |
|---|---|---|
| Location | `firmware/ForgeUI-One` | Exported project under `C:\ForgeUI-Exports` |
| `90_Studio_Export.c/.h` | Generated and replaceable | Generated export output |
| `95_UserEvents.c/.h` | Studio-generated test hooks; may be regenerated | Developer-owned hook/application layer after export |
| GPIO, I/O, and product logic | Do not keep permanently here | Add to `95_UserEvents.c` |
| Studio build/flash ownership | Studio may regenerate, build, and flash | Studio does not continuously update or flash it |

Studio writes `95_UserEvents.c/.h` when creating both live firmware output and a standalone export. Ownership changes after standalone export: the exported copies become the developer's application integration layer.

### CMake integration

The export server generates the component source list and includes:

```text
90_Studio_Export.c
95_UserEvents.c
required uploaded asset .c sources
```

Do not maintain a parallel build list for Interactive Assets.

## Persistence and restart behavior

Two coordinated stores participate:

| Store | Owns |
|---|---|
| Interactive Asset persistence | all five model records, initial states and uploaded state-artwork IDs |
| Uploaded Asset Registry persistence | image metadata, LVGL symbols, generated source paths, browser source restoration |

At Studio startup:

1. Interactive Assets reload into the shared registry.
2. Uploaded assets restore their persistent metadata.
3. Canvas components retain `interactiveAssetId` in component props.
4. Kind-aware previews resolve current asset and visual records.

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
- firmware remained stable

### Interactive Toggle Switch

Studio, persistence, preview, export, shared runtime and bool-hook generation are host-validated. Current physical ESP32-P4 proof is not recorded here and remains pending.

Expected physical proof includes initial OFF/ON artwork, touch toggling, generated bool callback and readable serial ON/OFF output.

### Interactive Status Indicator

Model, Studio, Canvas, persistence, validation, preview, multi-instance coexistence and shared Binary Output Runtime contracts are automated-test proven. This map does not contain a distinct recorded physical Status Indicator flash result, so no additional hardware proof is claimed.

### Interactive Three-Position Toggle Switch

Studio, persistence, preview, direct local-zone calculation, export and independent-instance contracts are host-validated. Physical ESP32-P4 proof remains pending until the current flash and touch test is completed.

Expected physical proof:

- boot in the configured initial state
- LEFT third selects LEFT
- CENTER third selects CENTER
- RIGHT third selects RIGHT
- serial output reports the correct enum state
- independent instances do not interfere

### System health during interaction

- Wi-Fi READY
- IP assigned
- SD READY
- no crash after interaction

Physical Button state behavior and Light initial-state behavior are proven. They are not pending phases.

## Verified automated status

### Full validation

- 23 Jest suites passed
- 137 tests passed
- 1 intentional legacy icon-export test skipped
- TypeScript passed with zero diagnostics
- ESLint passed with no warnings or errors
- `export-server.js` syntax validation passed
- `git diff --check` validation passed

## Debugging map

Start at the ownership boundary matching the symptom.

| Symptom | Begin with | Then inspect |
|---|---|---|
| Unified New action or type switching is wrong | `ForgeUIInteractiveAssetPanel.tsx` | `InteractiveLightDesigner.tsx`, `InteractiveAssetAIGenerator.tsx` |
| Editing opens the wrong kind | `ForgeUIInteractiveAssetPanel.tsx` | asset `kind`, Light `onActivate` path |
| Button draft/save is wrong | `ForgeUIInteractiveAssetPanel.tsx` | Button model, registry validation |
| Light draft/save is wrong | `InteractiveLightDesigner.tsx` | Light model, registry validation |
| Toggle draft/save is wrong | `InteractiveLightDesigner.tsx` | Toggle model, selected `assetKind`, registry validation |
| Toggle OFF/ON preview is wrong | `InteractiveToggleSwitchPreview.tsx` | Canvas preview, resolver, uploaded assets |
| Toggle callback is wrong or missing | `ForgeUILvglExport.ts` Toggle branch | `userEventHooks`, `export-server.js`, `95_UserEvents.*` |
| Toggle state resets unexpectedly | `InteractiveToggleSwitchCanvasPreview.tsx` | mounted local state, asset ID and initial state effect |
| Three-Position draft/save is wrong | `InteractiveThreePositionToggleDesigner.tsx` | model, registry validation, persistence |
| Three-Position LEFT/CENTER/RIGHT preview is wrong | `InteractiveThreePositionTogglePreview.tsx` | Canvas preview, resolver, uploaded assets |
| Three-Position jumps to top-left | `ComponentPreview.tsx` | `PreviewContainer`, `useDropComponent.ts`, component `x/y/w/h` |
| Three-Position Browser Preview is missing | `forgePreviewRenderer.tsx` | positioned output insertion and Canvas preview component |
| Three-Position is hard to click | `ForgeUILvglExport.ts` Three-Position branch | full parent bounds, child flags, artwork transparent margins |
| Three-Position selects the wrong zone | generated `fg_three_way_input_event_cb()` | `local_x`, button coordinates and configured width |
| Three-Position has stale artwork references | `ForgeUIInteractiveAssetResolver.ts` | Uploaded Asset Registry, persistence, reference protection |
| Three-Position enum/callback is missing | `ForgeUILvglExport.ts` | `userEventHooks`, `export-server.js`, `95_UserEvents.*` |
| Shared Toggle Runtime is duplicated or missing | `ForgeUILvglExport.ts` | `fg_toggle_input_t` / setter / event emission guard |
| Shared Three-Position Runtime is duplicated or missing | `ForgeUILvglExport.ts` | `fg_three_way_input_t` / setter / event emission guard |
| Button Normal/Pressed preview is wrong | `InteractiveButtonPreview.tsx` | `InteractiveButtonCanvasPreview.tsx`, resolver |
| Light OFF/ON preview is wrong | `InteractiveLightPreview.tsx` | `InteractiveLightCanvasPreview.tsx`, resolver |
| Light preview changes saved/exported state | `InteractiveLightCanvasPreview.tsx` | local preview state and `initialState` resolution |
| Status Indicator OFF/ON Browser Preview is wrong | `InteractiveStatusIndicatorPreview.tsx` | Status Indicator model and resolver |
| Status Indicator Canvas Preview is wrong | `InteractiveStatusIndicatorCanvasPreview.tsx` | kind-aware lookup, uploaded assets, `initialState` |
| AI uses the wrong state modes | `InteractiveAssetAIGenerator.tsx` | parent `selectedAssetKind` |
| AI request/image conversion fails | `ForgeUIAIImagePipeline.ts` | `/api/forgeui-ai-hero`, `export-server.js` conversion route |
| Generated image is missing after restart | `ForgeUIUploadedAssetRegistry.ts` | uploaded localStorage record and generated file path |
| Interactive Asset is missing after restart | `ForgeUIInteractiveAssetPersistence.ts` | registry import and validation |
| `Use on Selected` does nothing | owning designer/panel | selected component type, resolver component props, Redux update |
| Canvas resolves the wrong kind | kind-specific Canvas preview | `getInteractiveAssetByKind()` and the five exact kind-aware getters |
| Button export is wrong | `ForgeUILvglExport.ts` Button branch | uploaded LVGL readiness and asset-source collection |
| Light export/setter is wrong | `ForgeUILvglExport.ts` Light export map/branch | `initialState`, API naming, uploaded assets |
| Status Indicator export/setter is wrong | `ForgeUILvglExport.ts` Binary Output export map/branch | Status Indicator lookup, `initialState`, API naming, uploaded assets |
| Binary Output Runtime is duplicated or missing | `ForgeUILvglExport.ts` | shared `fg_binary_output_t` / `fg_binary_output_set()` emission guard |
| Generated Setter API is wrong | `ForgeUILvglExport.ts` | deterministic output API allocation and export validation |
| Shared Binary Output Runtime switches the wrong artwork | generated `fg_binary_output_set()` inputs | per-instance runtime record and OFF/ON symbols |
| Button hook is missing | `ForgeUILvglExport.ts` | `Header.tsx`, `export-server.js`, `95_UserEvents.*` |
| Light unexpectedly has a click hook | `ForgeUILvglExport.ts` | ensure Light remains image/setter based |
| Export rejected before flash | `ForgeUIExportValidation.ts` | `Header.tsx`, `export-server.js` |
| Missing generated C source | `export-server.js` | Uploaded Asset Registry, Theme ownership |
| Asset cannot be deleted | `ForgeUIReferenceProtection.ts` | Interactive Asset Registry |
| Duplicate API failure | `ForgeUIExportValidation.ts` | `ForgeUILvglExport.ts` |
| Duplicate `LV_IMAGE_DECLARE` | `ForgeUILvglExport.ts` | export validation |
| Flash never starts | `Header.tsx` | `export-server.js` |
| Generated files are missing | `export-server.js` | export payload and generated CMake list |
| Physical state differs from Canvas | exporter branch | resolved uploaded symbols, generated C source, component dimensions |

### Creation and editing paths

- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`

### Button rendering paths

- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Light rendering paths

- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Toggle rendering paths

- `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`
- `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`

### Three-Position rendering paths

- `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`
- `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`
- `src/components/editor/PreviewContainer.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`

### Status Indicator rendering paths

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

### AI generation paths

- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

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
6. Canvas assignment uses `interactiveAssetId`, width, and height through normal component updates.
7. Canvas resolution is kind-aware.
8. All five kinds keep separate discriminated data models.
9. Button uses momentary click hooks, Toggle uses generated bool-state hooks, Three-Position uses a strongly typed enum callback, and Binary Output types use generated public setters.
10. Generated UI APIs live in `90_Studio_Export.h/.c`.
11. Live `95_UserEvents.*` files are Studio-generated, not manually created.
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
22. Every Canvas component uses the shared positioned, selectable, draggable and resizable wrapper.
23. Missing or stale uploaded-asset references block export; validation is never bypassed to work around them.

## Framework extension pattern

Extend the framework by runtime family first, then by asset-specific model and artwork semantics.

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

Potential future runtime families:

- Value Runtime
- Selection Runtime
- Gauge Runtime
- Numeric Display Runtime
- Progress Runtime

These are future concepts only and are not implemented.

Do not create a new registry, persistence system, AI pipeline, uploaded-asset store, exporter, or duplicate runtime generator for a future type. Reuse an existing runtime family whenever its state and API contract match. Create a new runtime family only when the existing momentary input, persistent binary input, persistent three-position input and binary output contracts cannot represent the control.
