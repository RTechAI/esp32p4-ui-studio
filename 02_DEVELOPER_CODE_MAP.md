# ForgeUI Interactive Asset Framework — Developer Code Map

## Current save point

**FORGEUI_INTERACTIVE_ASSET_FRAMEWORK_V1__BUTTON_AND_LIGHT__UNIFIED_UI_FLOW__PHYSICAL_ESP32P4_PROVEN**

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

The framework currently has two implemented asset types:

```text
Shared Interactive Asset Framework
├── Interactive Button
└── Interactive Light
```

Both types are proven through:

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

Interactive Button and Interactive Light are separate discriminated models inside one framework. They share infrastructure, but they do not share type-specific state, save logic, Canvas behavior, exporter branches, or runtime behavior.

## System architecture

```text
Interactive Assets panel
  │
  ├── parent-owned selectedAssetKind
  │     ├── button → Button designer
  │     └── light  → Light designer
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
```

Do not flatten Button and Light into one state model. Add another member to the discriminated union when a new persisted type is implemented.

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

Do not introduce a type-specific Button or Light ID generator.

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
- `getAllInteractiveAssets()`
- `updateInteractiveAssetByKind()`
- `removeInteractiveAsset()`
- `importInteractiveAssets()`
- `exportInteractiveAssets()`

Validation occurs at registry boundaries. Kind-aware access prevents a Button asset from resolving as a Light and vice versa.

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

Both Button and Light records are stored under the same versioned key. Do not introduce a separate persistence store for each kind.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetValidation.ts`

Owns:

- shared base validation
- Button validation
- Light validation
- discriminated dispatch through `validateInteractiveAsset()`

New kinds should add type-specific validation and join the existing dispatch. Validation must remain centralized at framework boundaries.

#### `src/forgeui/interactive/ForgeUIInteractiveAssetResolver.ts`

Owns pure resolution and component-assignment helpers:

- uploaded asset lookup by ID
- Button Normal/Pressed resolution
- Light OFF/ON resolution
- LVGL-ready checks
- kind-specific dimensions
- component property mapping
- Light initial-state fallback

Both Canvas assignment helpers write:

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
- editing existing Button assets
- Button `Use on Selected`

The UI is:

```text
+ New Interactive Asset

Asset Type
○ Button
○ Light
```

`selectedAssetKind` is the single source of truth for:

- active designer
- draft initialization
- AI generation mode
- visible form

Editing an existing Button selects `button`, opens the Button designer, and loads the Button draft. Editing an existing Light selects `light`, opens the Light designer, and loads the Light draft.

Type selection is disabled while AI generation is in progress. This prevents an asynchronous Button result from being mapped into a Light draft or the reverse.

The panel coordinates the designers; it does not merge their models or save logic.

#### `src/forgeui/interactive/InteractiveLightDesigner.tsx`

Owns Light-specific Studio behavior:

- Light draft state
- Light edit loading
- OFF and ON selection
- `initialState`
- Light preview controls
- Light Save and Delete
- Light `Use on Selected`
- Light asset-list cards

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

Both Button and Light use this same pipeline.

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
```

Canvas components keep only the Interactive Asset reference and component dimensions. Visual records remain in the Interactive Asset and uploaded-asset registries.

### Assignment contract

Both designers use kind-specific resolver helpers to assign:

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

It owns:

- traversal of the Canvas component tree
- type-specific `InteractiveButton` generation
- type-specific `InteractiveLight` generation
- kind-aware Interactive Asset lookup
- uploaded image resolution
- `LV_IMAGE_DECLARE(...)` emission
- used asset-source collection
- Button event hook collection
- Light public setter generation
- generated runtime support

Do not create:

- a separate Interactive Button exporter
- a separate Interactive Light exporter
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

### Frontend export transport

#### `src/components/Header.tsx`

Owns Studio export actions and sends the generated export payload to:

- `POST /export`
- `POST /export-idf-project`

The frontend generates the LVGL code through the single exporter and forwards code, asset sources, and generated Button hook metadata. It does not write firmware files directly.

### Export server

#### `export-server.js`

Owns filesystem-side export work:

- writing generated UI source and header
- writing the Studio-generated user hook layer
- copying generated image sources
- creating CMake source lists
- live firmware export
- standalone ESP-IDF project export

The server writes:

- `90_Studio_Export.c`
- `90_Studio_Export.h`
- `95_UserEvents.c`
- `95_UserEvents.h`
- generated asset sources
- `CMakeLists.txt`

Do not describe this file as `server.js`; its current project path is `studio/export-server.js`.

## Generated firmware ownership

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

Interactive Button hooks are declared and stubbed here. Interactive Light does not generate an event hook because Light is controlled through its public setter.

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
| Interactive Asset persistence | Button/Light model records and uploaded-asset IDs |
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

Unified UI verification completed with:

- 11 test suites passed
- 41 tests passed
- 6 focused UI and shared-generator tests passed
- `export-server.js` syntax check passed
- no implementation diagnostics in the changed files

One pre-existing TypeScript error remains in:

```text
src/components/editor/previews/InteractiveLightCanvasPreview.test.tsx
```

That diagnostic was not caused by the unified UI change.

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
| AI uses the wrong state modes | `InteractiveAssetAIGenerator.tsx` | parent `selectedAssetKind` |
| AI request/image conversion fails | `ForgeUIAIImagePipeline.ts` | `/api/forgeui-ai-hero`, `export-server.js` conversion route |
| Generated image is missing after restart | `ForgeUIUploadedAssetRegistry.ts` | uploaded localStorage record and generated file path |
| Interactive Asset is missing after restart | `ForgeUIInteractiveAssetPersistence.ts` | registry import and validation |
| `Use on Selected` does nothing | owning designer/panel | selected component type, resolver component props, Redux update |
| Canvas resolves the wrong kind | kind-specific Canvas preview | `getInteractiveButtonAsset()` / `getInteractiveLightAsset()` |
| Button export is wrong | `ForgeUILvglExport.ts` Button branch | uploaded LVGL readiness and asset-source collection |
| Light export/setter is wrong | `ForgeUILvglExport.ts` Light export map/branch | `initialState`, API naming, uploaded assets |
| Button hook is missing | `ForgeUILvglExport.ts` | `Header.tsx`, `export-server.js`, `95_UserEvents.*` |
| Light unexpectedly has a click hook | `ForgeUILvglExport.ts` | ensure Light remains image/setter based |
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

### AI generation paths

- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Export path

- `src/forgeui/ForgeUILvglExport.ts`
- `src/components/Header.tsx`
- `export-server.js`

## Architectural invariants

Preserve these rules:

1. `generateForgeUILvglCode()` is the only LVGL UI exporter.
2. All Interactive Asset kinds use the shared registry and persistence layer.
3. All generated state images use the Uploaded Asset Registry.
4. AI generation uses `InteractiveAssetAIGenerator` and `ForgeUIAIImagePipeline`.
5. `selectedAssetKind` is parent-owned; the AI generator has no independent type selector.
6. Canvas assignment uses `interactiveAssetId`, width, and height through normal component updates.
7. Canvas resolution is kind-aware.
8. Button and Light keep separate data models and runtime behavior.
9. Button clicks use generated hooks; Light runtime state uses a generated public setter.
10. Generated UI APIs live in `90_Studio_Export.h/.c`.
11. Live `95_UserEvents.*` files are Studio-generated, not manually created.
12. Standalone exported `95_UserEvents.*` files become developer-owned after export.

## Framework extension pattern

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
- generated-file and runtime ownership model

It should add only the type-specific pieces it needs:

- model and defaults
- validation
- designer fields and save mapping
- AI modes and prompt templates
- result-to-state mapping
- preview behavior
- Canvas component/preview behavior
- branch inside `generateForgeUILvglCode()`
- generated runtime API or hook behavior appropriate to the type
- tests covering registry, persistence, Canvas, export, and runtime contract

Possible future examples:

- Toggle Switch
- Alarm Indicator
- Battery Indicator
- Wi-Fi Indicator
- Motor State
- Gauge
- Seven Segment Display

These are examples only and are not implemented.

Do not create a new registry, persistence system, AI pipeline, uploaded-asset store, exporter, or runtime generator for a future type.
