# ForgeUI Interactive Asset Framework — Developer Code Map

## Current save point

**FORGEUI_PROJECT_HEALTH_PHASE2__EXPORT_VALIDATION__REFERENCE_PROTECTION__BUTTON_LIGHT_STATUS_INDICATOR__BINARY_OUTPUT_RUNTIME__THEME__PHYSICAL_ESP32P4_PROVEN__2026-07-22**

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

The framework currently has four implemented asset types:

```text
Shared Interactive Asset Framework
├── Interactive Button
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
- physical ESP32-P4 runtime

The Physical ESP32-P4 proof section records the physically validated Button and Light behaviors. Status Indicator proves reuse of the same Binary Output Runtime through its model, Studio, Canvas, persistence, validation, preview, multi-instance, coexistence, and exporter contracts.

Interactive Button, Interactive Light and Interactive Status Indicator are separate discriminated models inside one framework. They share infrastructure. Interactive Button belongs to the Interactive Input Runtime; Interactive Light and Interactive Status Indicator belong to the Binary Output Runtime and deliberately share its runtime behavior.

## System architecture

```text
Interactive Assets panel
  │
  ├── parent-owned selectedAssetKind
  │     ├── button          → Button designer
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
```

Do not flatten Button, Light and Status Indicator into one state model. Add another member to the discriminated union when a new persisted type is implemented.

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

Do not introduce a type-specific Button, Light or Status Indicator ID generator.

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
- `getAllInteractiveAssets()`
- `updateInteractiveAssetByKind()`
- `removeInteractiveAsset()`
- `importInteractiveAssets()`
- `exportInteractiveAssets()`

Validation occurs at registry boundaries. Kind-aware access prevents a Button, Light or Status Indicator asset from resolving as another kind.

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

Button, Light and Status Indicator records are stored under the same versioned key. Do not introduce a separate persistence store for each kind.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetValidation.ts`

Owns:

- shared base validation
- Button validation
- Light validation
- Status Indicator validation
- discriminated dispatch through `validateInteractiveAsset()`

New kinds should add type-specific validation and join the existing dispatch. Validation must remain centralized at framework boundaries.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetResolver.ts`

Owns pure resolution and component-assignment helpers:

- uploaded asset lookup by ID
- Button Normal/Pressed resolution
- Light OFF/ON resolution
- Status Indicator OFF/ON resolution
- LVGL-ready checks
- kind-specific dimensions
- component property mapping
- Light initial-state fallback
- Status Indicator initial-state fallback

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
- editing existing Button assets
- Button `Use on Selected`

The UI is:

```text
+ New Interactive Asset

Asset Type
○ Button
○ Light
○ Status Indicator
```

`selectedAssetKind` is the single source of truth for:

- active designer
- draft initialization
- AI generation mode
- visible form

Editing an existing asset selects its `button`, `light`, or `statusIndicator` kind, opens the owning designer, and loads that kind's draft.

Type selection is disabled while AI generation is in progress. This prevents an asynchronous result for one kind from being mapped into another kind's draft.

The panel coordinates the designers; it does not merge their models or save logic.

#### `src/forgeui/interactive/InteractiveLightDesigner.tsx`

Owns the shared two-state Studio designer behavior used by Light and Status Indicator:

- Light draft state
- Light edit loading
- OFF and ON selection
- `initialState`
- Light preview controls
- Light Save and Delete
- Light `Use on Selected`
- Light asset-list cards
- Status Indicator draft, edit, Save, Delete, assignment, preview controls, and asset-list cards

It receives the parent-selected kind for AI generation. It does not own an independent Asset Type selector.

#### `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`

Owns shared interactive image-generation UI and orchestration:

- prompt input
- generation loading state
- two sequential state-image requests
- kind-to-generation-mode mapping
- file-prefix selection
- returning the two generated uploaded-asset IDs
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

Button, Light and Status Indicator use this same pipeline.

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
- duplicate detection
- generated asset-source validation
- grouped export diagnostics

This file owns validation only. It does not generate LVGL, firmware files, CMake, or runtime behavior.

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

Light generation modes:

- `light-off`
- `light-on`

Light mapping:

- first result → `offAssetId`
- second result → `onAssetId`

Status Indicator generation reuses the two-state OFF/ON generation modes and maps:

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
InteractiveLight  → InteractiveLightCanvasPreview
InteractiveStatusIndicator → InteractiveStatusIndicatorCanvasPreview
```

Canvas components keep only the Interactive Asset reference and component dimensions. Visual records remain in the Interactive Asset and uploaded-asset registries.

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
- kind-aware Interactive Asset lookup
- uploaded image resolution
- `LV_IMAGE_DECLARE(...)` emission
- used asset-source collection
- Button event hook collection
- shared Binary Output setter generation
- per-instance Binary Output runtime records
- public API collection
- generated runtime support
- single shared Binary Output Runtime generation

Do not create:

- a separate Interactive Button exporter
- a separate Interactive Light exporter
- a separate Interactive Status Indicator exporter
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

The frontend generates LVGL code through the single exporter and forwards code, validated asset sources, generated Button hook metadata, and public API declarations. It does not write firmware files directly.

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
- Light setter implementations and declarations

Public APIs are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`.

Do not place permanent product logic in these files.

### `95_UserEvents.c` and `95_UserEvents.h`

Studio creates these as the generated user hook layer. They are not manually created in the live firmware workflow.

Interactive Button hooks are declared and stubbed here. Interactive Light and Interactive Status Indicator do not generate event hooks because Binary Output assets are controlled through public setters.

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
| Interactive Asset persistence | Button, Light and Status Indicator model records and uploaded-asset IDs |
| Uploaded Asset Registry persistence | image metadata, LVGL symbols, generated source paths, browser source restoration |

At Studio startup:

1. Interactive Assets reload into the shared registry.
2. Uploaded assets restore their persistent metadata.
3. Canvas components retain `interactiveAssetId` in component props.
4. Kind-aware previews resolve current asset and visual records.

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

### System health during interaction

- Wi-Fi READY
- IP assigned
- SD READY
- no crash after interaction

Physical Button state behavior and Light initial-state behavior are proven. They are not pending phases.

## Verified automated status

### Full validation

- 17 test suites passed
- 111 tests passed
- 1 test skipped as the documented legacy icon-export baseline
- zero TypeScript diagnostics
- zero ESLint warnings or errors

### Targeted default-theme regression

- 3 test suites passed
- 26 tests passed

The targeted run covers the narrow default-theme export regression and its related exporter/server validation paths. It is not another full-project total and must not be added to the full validation figures.

## Debugging map

Start at the ownership boundary matching the symptom.

| Symptom | Begin with | Then inspect |
|---|---|---|
| Unified New action or type switching is wrong | `ForgeUIInteractiveAssetPanel.tsx` | `InteractiveLightDesigner.tsx`, `InteractiveAssetAIGenerator.tsx` |
| Editing opens the wrong kind | `ForgeUIInteractiveAssetPanel.tsx` | asset `kind`, Light `onActivate` path |
| Button draft/save is wrong | `ForgeUIInteractiveAssetPanel.tsx` | Button model, registry validation |
| Light draft/save is wrong | `InteractiveLightDesigner.tsx` | Light model, registry validation |
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
| Canvas resolves the wrong kind | kind-specific Canvas preview | `getInteractiveButtonAsset()` / `getInteractiveLightAsset()` / `getInteractiveStatusIndicatorAsset()` |
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

### Button rendering paths

- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Light rendering paths

- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Status Indicator rendering paths

- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`

### Binary Output Runtime paths

- `src/forgeui/ForgeUILvglExport.ts`
- generated `90_Studio_Export.c` runtime records and setters
- generated `90_Studio_Export.h` public setter declarations

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
2. All Interactive Asset kinds use the shared registry and persistence layer.
3. All generated state images use the Uploaded Asset Registry.
4. AI generation uses `InteractiveAssetAIGenerator` and `ForgeUIAIImagePipeline`.
5. `selectedAssetKind` is parent-owned; the AI generator has no independent type selector.
6. Canvas assignment uses `interactiveAssetId`, width, and height through normal component updates.
7. Canvas resolution is kind-aware.
8. Button, Light and Status Indicator keep separate discriminated data models.
9. Button clicks use generated hooks; Light and Status Indicator runtime state uses generated public setters.
10. Generated UI APIs live in `90_Studio_Export.h/.c`.
11. Live `95_UserEvents.*` files are Studio-generated, not manually created.
12. Standalone exported `95_UserEvents.*` files become developer-owned after export.
13. Export validation always occurs before filesystem mutation.
14. Reference protection prevents deletion of in-use assets.
15. `ForgeUILvglExport.ts` generates code only from validated inputs.
16. Built-in Theme assets participate in validation.
17. Failed validation preserves the previous generated firmware.
18. Binary Output Runtime is generated once per export and shared by every Binary Output Interactive Asset.

## Framework extension pattern

Extend the framework by runtime family first, then by asset-specific model and artwork semantics.

Current runtime families:

```text
Interactive Input Runtime
  └── Interactive Button

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

Potential Binary Output assets:

- Alarm Indicator
- Battery Indicator
- Bluetooth Indicator
- Wi-Fi Indicator
- Motor State
- Direction Indicator
- Multi-state Lamp

Potential future runtime families:

- Gauge Runtime
- Numeric Display Runtime
- Progress Runtime

These are examples only and are not implemented.

Do not create a new registry, persistence system, AI pipeline, uploaded-asset store, exporter, or duplicate runtime generator for a future type. Create a new runtime family only when the state and API contract cannot be represented by an existing family.
## Interactive Toggle Switch map

`ForgeUIInteractiveToggleSwitchAsset.ts` adds the persistent `toggleSwitch` member to the existing Interactive Asset union. Registry lookup, the versioned persistence store, uploaded-asset reference protection, and validation remain shared with all other Interactive Assets.

`InteractiveLightDesigner.tsx` is the shared OFF/ON artwork designer for Light, Status Indicator, and Toggle Switch. For Toggle Switch it provides initial state, AI generation, preview, editing, deletion protection, and **Use on Selected** assignment without a parallel authoring system.

`InteractiveToggleSwitchCanvasPreview.tsx` owns browser and Canvas behavior. Each mounted instance initializes from the asset's saved state and retains its local OFF/ON state until the next click.

`ForgeUILvglExport.ts` prepares Toggle descriptors inside the existing exporter and emits one shared `fg_toggle_input_t` / `fg_toggle_input_set()` / `fg_toggle_input_event_cb()` implementation. Each instance contributes only its image references, state record, initial state, and `FG_On_*_Toggled(bool enabled)` hook.

Interactive Input Runtime

```text
Interactive Input Runtime
├── Interactive Button         momentary, FG_On_*_Clicked(void)
└── Interactive Toggle Switch  persistent, FG_On_*_Toggled(bool enabled)
```
