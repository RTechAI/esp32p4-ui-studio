# Current Save Point

**FORGEUI_RUNTIME_FAMILIES__FIVE_INTERACTIVE_ASSETS__TOGGLE_AND_THREE_POSITION_PHYSICAL_VALIDATION_PENDING__2026-07-22**

## Current Proven Status

ForgeUI has a reusable Interactive Asset Framework with five fully implemented asset types organized into three generated runtime families:

Interactive Input Runtime:

- Interactive Button
- Interactive Toggle Switch

Three-Position Input Runtime:

- Interactive Three-Position Toggle Switch

Binary Output Runtime:

- Interactive Light
- Interactive Status Indicator

All five types are proven through Studio creation, AI state-image generation, asset registration, persistence, Canvas rendering, Studio preview, Browser Preview, LVGL export and automated validation. Interactive Button, Interactive Light and Interactive Status Indicator retain the established physical ESP32-P4 baseline. Physical validation of Interactive Toggle Switch and Interactive Three-Position Toggle Switch remains pending.

The Studio presents all five types through one coherent Interactive Assets creation flow. Each runtime family owns its generated runtime while every type shares the common Interactive Asset Framework and retains type-specific asset models, designers, state mappings, preview behaviour, export behaviour and runtime behaviour.

Project Health Phases 1 and 2 are complete. The repository now has clean TypeScript and ESLint baselines, a fully passing automated test suite, protected asset references, and client- and server-side export validation before generated firmware files are written. The Interactive Button and Interactive Light physical proof remains the hardware baseline underneath this health work.

## Project Health Phase 1 — Clean Baseline

Phase 1 removed accumulated development noise and established a measurable clean project baseline without changing the proven product architecture.

Completed work:

- Removed obsolete debug logging and workshop artifacts.
- Consolidated the duplicate icon registry into one ownership path.
- Corrected optional preview-icon defaults and local component property contracts.
- Added the missing ForgeUI Canvas default-property types.
- Cleared the remaining TypeScript diagnostics.
- Established a clean ESLint baseline with no warnings or errors.
- Preserved the known legacy icon export expectation as an explicitly skipped test pending separate architectural review.

Phase 1 did not redesign the Interactive Asset Framework, exporter, Canvas model, or firmware runtime. It made the existing system cleanly checkable and left the one deliberately deferred legacy behavior visible rather than hiding it.

## Project Health Phase 2 — Safe Export Boundary

Phase 2 added a fail-closed validation boundary around all three Studio export paths:

- Build & Flash live firmware export
- Standalone ESP-IDF project export
- Clean Firmware regeneration

Validation now runs before filesystem writes. A failed preflight reports grouped diagnostics and prevents partial generated-firmware mutation.

The client-side preflight validates:

- all five Interactive Asset dimensions and state artwork
- uploaded-asset existence and LVGL conversion readiness
- generated C source paths and LVGL symbols
- Canvas dimensions, duplicate component IDs, missing runtime references, and wrong asset kinds
- Button, Toggle Switch and Three-Position callback names; Binary Output setters; image symbols; and image declarations
- valid OFF / ON and LEFT / CENTER / RIGHT state references
- generated callbacks, enums, runtime structures, public setter declarations, and referenced asset-source coverage

The server independently validates the generated payload and does not trust the browser boundary. It rejects empty code, unsafe or duplicate source paths, missing generated C files, invalid or duplicate symbols, symbols absent from their source files, and asset sources not referenced by the generated code.

Deletion is also reference-aware. Uploaded assets used by any of the five Interactive Asset types or the active Theme, and Interactive Assets assigned to Canvas components, are reported and protected before registry, persistence, Canvas, theme, blob-URL, or disk mutation occurs.

The physical Build & Flash check correctly exposed active built-in theme sources that validation found missing from firmware. The exact Neural Core and Carbon Fiber generated C sources were restored, their symbols were verified, and the server regression suite now validates those real firmware assets. Validation remains strict; the missing inputs were fixed instead of bypassing the safety boundary.

## Interactive Assets UI

The Interactive Assets panel exposes one creation entry point:

```text
+ New Interactive Asset
```

The panel owns the single Asset Type selection:

- Button
- Light
- Status Indicator
- Toggle Switch
- Three-Position Toggle

The parent-owned `selectedAssetKind` controls the active designer, visible type-specific form, AI generation mode, and new-draft initialization. Changing Asset Type switches the displayed designer and its fields. Asset Type switching is disabled while AI generation is in progress so asynchronous results cannot be directed into the wrong designer.

Clicking `+ New Interactive Asset` initializes the selected type's draft without creating a registry object. Registration occurs only on Save. Editing an existing asset automatically selects `asset.kind`, opens the correct designer, and loads the correct draft.

There are no parallel creation flows. Type-specific designers and models remain distinct internally; their save logic is coordinated through the shared panel and common registry rather than merged into a second framework.

## Shared Interactive Asset Framework

The shared framework owns:

- Interactive Asset identity and ID generation
- Discriminated asset kinds
- Base validation and type-specific validation dispatch
- The in-memory Interactive Asset registry
- Local persistence and reload
- Uploaded state-image references
- The shared AI image-generation pipeline
- Canvas asset and dimension resolution
- Canvas assignment through `interactiveAssetId`
- LVGL export integration

Shared asset concepts include `schemaVersion`, `id`, `name`, `kind`, `interactionMode`, `createdAt`, `updatedAt`, `width`, `height`, and uploaded asset references for visual states.

The current discriminated kinds are:

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

`ForgeUIInteractiveAsset` is the discriminated union of all five supported models. The common registry and existing v1 persistence layer store every kind. Kind-aware lookup and validation prevent an asset from being resolved as the wrong type.

Canvas components store an `interactiveAssetId`. Assignment also propagates the selected asset's width and height. On reload, the Interactive Asset registry and uploaded-asset registry restore the records required for Canvas and export resolution.

## Interactive Button

Interactive Button uses `kind: button` and `interactionMode: momentary`. Its uploaded state-image references are:

- `normalAssetId`
- `pressedAssetId`

### Studio behavior

- AI generates Normal and Pressed images.
- Generated results map to `normalAssetId` and `pressedAssetId`.
- Canvas preview displays Pressed while held and returns to Normal on release.
- The asset can be assigned to an `InteractiveButton` Canvas component.
- Assignment writes `interactiveAssetId` and propagates width and height.
- Assignment persists across Studio restart.

### LVGL runtime behavior

The exporter creates a parent LVGL button object and a child LVGL image object:

- `LV_EVENT_PRESSED` changes to the Pressed image.
- `LV_EVENT_RELEASED` and `LV_EVENT_PRESS_LOST` restore the Normal image.
- `LV_EVENT_CLICKED` calls the generated developer hook.

Generated hook example:

```c
FG_On_Button_Clicked();
```

Runtime flow:

```text
Touch
  ↓
LVGL Button
  ↓
Generated event callback
  ↓
FG_On_Button_Clicked()
  ↓
95_UserEvents.c
  ↓
Developer application logic
```

## Interactive Toggle Switch

Interactive Toggle Switch uses `kind: toggleSwitch`, `interactionMode: state`, and a saved `initialState: off | on`. Its uploaded state-image references are:

- `offAssetId`
- `onAssetId`

### Studio behavior

- The designer provides OFF and ON artwork selection.
- AI generation produces matching OFF and ON visual states through the shared image pipeline.
- The asset, artwork references and initial state persist through the existing Interactive Asset store.
- Live preview and Canvas preview retain the selected binary state until toggled again.
- Browser Preview uses the same OFF / ON artwork and interaction model.
- The asset can be assigned to an `InteractiveToggleSwitch` Canvas component.
- Use on Selected writes `interactiveAssetId` and propagates width and height.

### Toggle Input Runtime

Multiple Interactive Toggle Switch instances share one generated Toggle Input Runtime:

- `fg_toggle_input_t`
- `fg_toggle_input_set()`

Each Canvas instance owns independent runtime data, artwork references, saved state and a unique developer callback. Initialization applies the configured state with notification disabled. An LVGL click inverts the current state, the shared setter stores it, selects the correct artwork, updates the child image and calls the generated hook.

Generated callback example:

```c
void FG_On_StatusToggleSwitch_Toggled(bool enabled);
```

Runtime flow:

```text
Touch
  ↓
LVGL Toggle parent button
  ↓
Shared Toggle Input Runtime
  ↓
fg_toggle_input_set(enabled, true)
  ↓
OFF / ON artwork update
  ↓
FG_On_<Name>_Toggled(bool enabled)
  ↓
95_UserEvents.c
```

## Interactive Three-Position Toggle Switch

Interactive Three-Position Toggle Switch uses `kind: threePositionToggle`, `interactionMode: state`, and the strongly typed saved state `left | center | right`. Its uploaded artwork references are:

- `leftAssetId`
- `centerAssetId`
- `rightAssetId`

### Studio behavior

- The designer provides LEFT, CENTER and RIGHT artwork selection.
- Dedicated AI modes generate a consistent horizontal selector or rocker for all three positions.
- Initial state is selectable as LEFT, CENTER or RIGHT.
- Live preview responds across the entire rectangular width.
- A designer-only `LEFT | CENTER | RIGHT` overlay makes the three touch zones visible without modifying exported artwork.
- Canvas and Browser Preview divide the configured bounds into direct left, center and right thirds.
- Use on Selected writes `interactiveAssetId` and propagates width and height.
- Artwork references and initial state persist through the existing Interactive Asset store.

### Three-Position Input Runtime

Multiple instances share one generated Three-Position Input Runtime while retaining independent state, artwork and callbacks.

Generated enum:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Generated runtime and helper:

```c
fg_three_way_input_t
fg_three_way_input_set()
```

Generated callback example:

```c
void FG_On_ThreePositionToggle_Changed(
    fg_three_way_state_t state
);
```

The LVGL event callback converts the absolute pointer coordinate into local control space, rejects points outside the configured rectangle and maps `local_x` to the left, center or right third. The parent button owns the full clickable rectangle; its child image is non-clickable. The shared setter validates and stores the requested enum, selects the matching artwork, updates the LVGL image and optionally notifies the per-instance developer callback. Initialization uses `notify=false`.

Runtime flow:

```text
Touch within full rectangular bounds
  ↓
Absolute pointer X converted to local_x
  ↓
LEFT / CENTER / RIGHT third selected
  ↓
fg_three_way_input_set(state, true)
  ↓
Matching artwork update
  ↓
FG_On_<Name>_Changed(fg_three_way_state_t state)
  ↓
95_UserEvents.c
```

## Interactive Light

Interactive Light uses `kind: light`, `interactionMode: state`, and a saved `initialState: off | on`. Its uploaded state-image references are:

- `offAssetId`
- `onAssetId`

## Binary Output Runtime

Interactive Light and Interactive Status Indicator now share one generated Binary Output Runtime.

The generated runtime owns:

- `fg_binary_output_t`
- `fg_binary_output_set()`

Both Interactive Asset types generate independent runtime records while reusing the same implementation.

Developer-facing APIs follow the same pattern:

```c
FG_Set_Status_Light(bool enabled);

FG_Set_WiFi_Status(bool enabled);
```

Runtime flow:

```text
Developer application
        ↓
FG_Set_<Name>(bool enabled)
        ↓
Shared Binary Output Runtime
        ↓
Generated LVGL runtime
        ↓
OFF / ON artwork
        ↓
Physical ESP32-P4 display
```

This establishes the Binary Output Runtime as a reusable runtime family rather than an implementation owned by Interactive Light.
---

## Interactive Status Indicator

Interactive Status Indicator extends the Binary Output Runtime without introducing a second runtime implementation.

It supports:

- OFF artwork
- ON artwork
- saved initial state
- Browser Preview
- Canvas Preview
- AI state-image generation
- native LVGL export
- generated public setter
- multiple independent instances

Status Indicator does not generate user hooks.

Application code controls state entirely through the generated public API.

### Studio behavior

- AI generates OFF and ON images.
- Generated results map to `offAssetId` and `onAssetId`.
- Canvas click toggles a temporary preview state.
- Preview toggling does not mutate the saved asset or affect exported firmware.
- The asset can be assigned to an `InteractiveStatusIndicator` Canvas component.
- Assignment writes `interactiveAssetId` and propagates width and height.
- Assignment persists across Studio restart.

### LVGL runtime behavior

Interactive Status Indicator exports as a non-clickable LVGL image. Its initial source uses the saved `initialState`.

- It has no Button-style event callback.
- It generates no Status Indicator hook in `95_UserEvents`.
- Runtime state is controlled through a generated public setter.

Generated API example:

```c
void FG_Set_Status_Light(bool enabled);
```

Setter behavior:

```text
false → OFF image
true  → ON image
```

Runtime flow:

```text
Developer application logic
  ↓
FG_Set_Status_Light(enabled)
  ↓
Generated 90_Studio_Export.c
  ↓
LVGL image source changes
  ↓
Physical indicator state changes
```

## Shared AI Generation Path

All five Interactive Asset types use the same request, response, upload, registration and LVGL conversion pipeline:

```text
Interactive Asset Designer
  ↓
InteractiveAssetAIGenerator
  ↓
ForgeUIAIImagePipeline
  ↓
POST /api/forgeui-ai-hero
  ↓
AI image generation
  ↓
Uploaded Asset Registry
  ↓
LVGL image conversion
  ↓
Asset state IDs returned to designer
```

Button generation modes:

- `button-normal`
- `button-pressed`

Toggle generation modes:

- `toggle-off`
- `toggle-on`

Three-Position generation modes:

- `three-position-left`
- `three-position-center`
- `three-position-right`

Light generation modes:

- `light-off`
- `light-on`

Status Indicator generation modes:

- `status-off`
- `status-on`

The type-specific differences are prompt mode, prompt template, filename prefix, and result-to-state mapping. The selected parent asset kind determines the modes used by the shared generator.

```text
Button: first → normalAssetId, second → pressedAssetId
Toggle: first → offAssetId, second → onAssetId
Three Position: first → leftAssetId, second → centerAssetId, third → rightAssetId
Light: first → offAssetId, second → onAssetId
Status Indicator: first → offAssetId, second → onAssetId
```

## File Ownership

### Generated and replaceable UI output

- `90_Studio_Export.c`
- `90_Studio_Export.h`

Studio regenerates these files. Generated public UI APIs, including Interactive Light setters, are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`. Permanent developer application logic must not be placed in them.

### User event hook layer

- `95_UserEvents.c`
- `95_UserEvents.h`

Studio currently creates and writes these files when it generates live Studio firmware and when it creates a standalone export. In live Studio firmware they contain regenerated test hooks. After a standalone project is exported, its copies become the developer-owned hook and application-logic layer. Developers add GPIO, I/O, hardware actions, and product behavior to the standalone project's `95_UserEvents.c` while preserving generated hook names.

Interactive Button click hooks, Interactive Toggle Switch toggled hooks and Interactive Three-Position Toggle changed hooks cross into this layer. Binary Output Runtime setters remain generated public UI APIs in `90_Studio_Export.h/.c` and do not create Light or Status Indicator hooks in `95_UserEvents`.

## Major Files

Paths under `src/` are relative to `studio/`.

### Interactive framework

- `src/forgeui/interactive/ForgeUIInteractiveAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetIds.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetRegistry.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetPersistence.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetValidation.ts`
- `src/forgeui/interactive/ForgeUIInteractiveAssetResolver.ts`
- `src/forgeui/interactive/index.ts`

### Button

- `src/forgeui/interactive/ForgeUIInteractiveButtonAsset.ts`
- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveToggleSwitchAsset.ts`
- `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`
- `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx` — current shared OFF / ON designer used by Toggle Switch, Light and Status Indicator

The current implementation does not introduce a separate `InteractiveToggleSwitchDesigner.tsx`; Toggle Switch follows the shared binary artwork designer path while retaining its own asset model, preview and generated Toggle Input Runtime.

### Three-Position Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveThreePositionToggleAsset.ts`
- `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`
- `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`
- `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`

### Light

- `src/forgeui/interactive/ForgeUIInteractiveLightAsset.ts`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Status Indicator

- `src/forgeui/interactive/ForgeUIInteractiveStatusIndicatorAsset.ts`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`

### Shared UI and AI

- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Exporter

- `src/forgeui/ForgeUILvglExport.ts`
- `export-server.js`

The exporter owns the shared generated runtime implementations and unique per-instance records. `90_Studio_Export.*` remains generated and replaceable; live-firmware `95_UserEvents.*` may be regenerated, while standalone-export copies become developer-owned.

### Generated firmware

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`

## Physical ESP32-P4 Proof

### Interactive Button

- Normal image displayed physically.
- Pressed image displayed on touch.
- Released state restored the Normal image.
- Physical click was detected and the generated hook was called.
- Monitor output confirmed:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light

- ON and OFF state artwork exported.
- The saved initial ON state displayed physically.
- The public setter was generated.
- The Light remained non-clickable.
- Firmware remained stable.

### Interactive Toggle Switch

- Studio, persistence, Canvas, Browser Preview, generated Toggle Input Runtime and automated export validation are complete.
- Physical ESP32-P4 validation is pending.
- No physical proof is claimed for touch interaction or generated toggle callbacks.

### Interactive Three-Position Toggle Switch

- Studio, persistence, direct three-zone Canvas and Browser Preview, generated Three-Position Input Runtime and automated export validation are complete.
- Absolute pointer coordinates are converted to local control coordinates before LEFT / CENTER / RIGHT zone selection.
- Physical ESP32-P4 validation is pending after the hit-area and selector-artwork refresh.
- No physical proof is claimed for the corrected touch zones or generated changed callback.

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- No crash after interaction

## Verified Automated Status

- 23 Jest test suites passed.
- 137 tests passed.
- 1 documented legacy test is intentionally skipped.
- TypeScript completed with zero diagnostics using `tsc --noEmit`.
- ESLint completed with no warnings or errors.
- `export-server.js` syntax check passed.
- Client and server export validation passed.
- Diff validation passed.
- Export validation and reference-protection suites passed for all five Interactive Asset types.
- The built-in Neural Core and Carbon Fiber firmware sources passed real server-side source and symbol validation.

The former `InteractiveLightCanvasPreview.test.tsx` TypeScript baseline error is resolved. The only non-passing test status is the intentional legacy icon-export skip documented during Phase 1.

## Architectural Significance and Extension Pattern

Interactive Button established the first **Interactive Input Runtime** within the Interactive Asset Framework.

Interactive Toggle Switch extended that family with persistent binary input state, a shared Toggle Input Runtime and per-instance changed callbacks.

Interactive Three-Position Toggle Switch established the **Three-Position Input Runtime**, proving that the framework can support strongly typed persistent multi-position state, direct geometric selection and a generated enum without modelling the control as a boolean.

Interactive Light introduced the shared **Binary Output Runtime**, proving that generated output controls could expose a simple developer API while sharing a common runtime implementation.

Interactive Status Indicator validated that the Binary Output Runtime is reusable. It extends the framework without introducing a second runtime implementation, demonstrating that additional binary output assets can be added by reusing the existing runtime while providing their own asset model, designer, preview behaviour, export handling and generated public API.

ForgeUI now extends by adding reusable runtime families rather than accumulating isolated widget implementations. Each family owns the generated C runtime appropriate to its state and interaction model. All families share Interactive Asset identity, registry, persistence, uploaded assets, AI generation, Canvas assignment, preview, export integration, validation and generated-file ownership.

Future Interactive Asset types should extend the discriminated asset union and provide their own:

- asset model
- validation
- designer fields
- preview behaviour
- Canvas behaviour
- AI state mapping
- export handling
- runtime behaviour

while reusing the shared framework infrastructure for:

- Interactive Asset identity
- registry
- persistence
- uploaded asset management
- AI image generation pipeline
- Canvas assignment
- LVGL export integration
- framework-level UI coordination

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

Potential future runtime families include:

### Value Runtime

- Slider
- Gauge
- Progress Bar
- Numeric Display

### Selection Runtime

- Radio Button
- Checkbox
- Rotary Selector

### Displays

- Seven Segment
- Text Display
- Meter

These remain future concepts only. They are not implemented or physically proven today.

# Save Point History

Save points are ordered newest to oldest. Detailed subsystem engineering is maintained in the Developer Code Maps.

## FORGEUI_INTERACTIVE_ASSET_FRAMEWORK_V1__BUTTON_AND_LIGHT__UNIFIED_UI_FLOW__PHYSICAL_ESP32P4_PROVEN

- **What changed:** Unified Interactive Button and Interactive Light creation under one framework-level UI flow while preserving separate type-specific models and behavior.
- **Why it changed:** The second Interactive Asset type needed to prove the architecture was reusable and the Studio needed one coherent creation entry point.
- **Final architecture:** Shared identity, registry, persistence, AI generation, Canvas assignment, and export infrastructure coordinate discriminated Button and Light implementations.
- **Proven result:** Both types passed Studio, export, ESP-IDF, and physical ESP32-P4 runtime validation, including Button touch hooks and the non-clickable Light public setter.

## FORGEUI_V2_4_1__AI_ARTWORK_NATIVE_PIPELINE__MULTI_MODE_IMAGE_PREPROCESSOR__PHYSICAL_ESP32P4_PROVEN__2026-07-17

- **What changed:** Added independent preprocessing modes for hero backgrounds, artwork, icons, normal images and Interactive Button assets.
- **Why it changed:** Artwork and icons were incorrectly passing through the full-screen hero crop-and-resize path.
- **Final architecture:** All image sources share the upload and LVGL conversion pipeline, with `assetMode` selecting the appropriate Python preprocessing branch.
- **Proven result:** Native artwork and hero behavior were physically validated on ESP32-P4 with Canvas and Preview parity.

## FORGEUI_THEME_MANAGER_POLISH_PROVEN__INDUSTRIAL_DASHBOARD_LAYOUT_PROVEN__ADVANCED_WIDGETS_NEXT__2026-07-17

- **What changed:** Polished Theme Manager asset presentation and validated an industrial dashboard layout.
- **Why it changed:** Hero backgrounds and compact uploaded icons required different presentation rules.
- **Final architecture:** Theme palettes, hero backgrounds and uploaded LVGL icon assets remain distinct asset classes inside the extracted Theme Manager.
- **Proven result:** Large hero previews, compact centered icon cards and the industrial dashboard layout were proven.

## FORGEUI_THEME_MANAGER_REFACTOR__HERO_ICON_ASSET_SEPARATION__HEADER_EXTRACTION__POLISH_AND_TEST_NEXT__2026-07-17

- **What changed:** Extracted Theme Manager from `Header.tsx` and separated hero and icon asset handling.
- **Why it changed:** Header-owned theme UI had become too large and applied hero-oriented rendering to unrelated assets.
- **Final architecture:** `ForgeUIThemeManager.tsx` owns theme-management UI while Header opens and coordinates it.
- **Proven result:** Extraction and asset classification worked without changing shared theme state.

## FORGEUI_V2_3_12__AI_LAYOUT_PROMPT_HELPER_V1__VISUAL_PROMPT_BUILDER__GUIDED_LAYOUT_GENERATION__2026-07-17

- **What changed:** Added a visual prompt helper with dashboard, heading, section and status-icon controls.
- **Why it changed:** Users needed a guided way to form reliable layout prompts without memorizing prompt structure.
- **Final architecture:** The helper composes text for the existing AI layout pipeline rather than introducing another generator.
- **Proven result:** Guided prompts generated layouts through the established parser, validator and Canvas insertion path.

## FORGEUI_V2_3_11__AI_ICON_NATIVE_SIZE_PIPELINE__ICON_PREPROCESSOR_MODE_SPLIT__ESP32P4_PHYSICAL_VALIDATION__2026-07-17

- **What changed:** Added icon-specific preprocessing that preserves native image dimensions.
- **Why it changed:** Icons were being expanded by the hero preprocessor, producing incorrect white-square assets on hardware.
- **Final architecture:** Icons use the shared asset pipeline with `icon` mode; hero preprocessing remains unchanged.
- **Proven result:** Wi-Fi, battery and clock icons matched across Canvas, Preview and physical ESP32-P4.

## FORGEUI_V2_3_10__FIRMWARE_MAINTENANCE__STUDIO_POLISH__THEME_MANAGER_REFRESH__FLASH_CONSOLE_UX__2026-07-16

- **What changed:** Completed the two-level maintenance workflow and refined Theme Manager and flash-console UX.
- **Why it changed:** Fast generated-source repair and full workspace cleanup serve different recovery needs.
- **Final architecture:** Clean Firmware resets generated source metadata; Firmware Maintenance performs the broader generated-workspace sweep.
- **Proven result:** Both maintenance paths, refreshed theme state and embedded flash feedback were validated.

## FORGEUI_V2_3_10__FIRMWARE_MAINTENANCE__CLEAN_GENERATED_FIRMWARE__WORKSPACE_MAINTENANCE__2026-07-16

- **What changed:** Split firmware maintenance into targeted generated-file repair and full generated-workspace cleanup.
- **Why it changed:** A single destructive reset was unnecessary for routine CMake or Studio-export drift.
- **Final architecture:** The lightweight path rebuilds `CMakeLists.txt` and `90_Studio_Export.*`; the full path also clears generated assets, upload cache and build output.
- **Proven result:** The maintenance menu reliably restored clean generated baselines at both levels.

## FORGEUI_V2_3_9__FIRMWARE_SWEEP_PROVEN__FACTORY_RESET__DETERMINISTIC_FIRMWARE_PIPELINE__2026-07-16

- **What changed:** Added deterministic firmware sweep and factory-reset behavior.
- **Why it changed:** Stale generated assets, declarations, CMake sources and build artifacts could survive between projects.
- **Final architecture:** One controlled sweep clears generated firmware state, recreates baseline files and lets the normal exporter regenerate the active project.
- **Proven result:** Factory reset, regeneration, clean build and physical firmware validation succeeded.

## FORGEUI_AI_SEMANTIC_ICON_RESOLVER__PROMPT_AWARE_REGISTRY_SEARCH__AUTOMATIC_ICON_ASSET_PIPELINE__CANVAS_PREVIEW_PROVEN__2026-07-15

- **What changed:** Added semantic resolution from natural-language icon intent to ForgeUI icon assets.
- **Why it changed:** AI users should not need registry names, filenames, asset IDs or LVGL symbols.
- **Final architecture:** Prompt intent is resolved through registry search and the existing upload/conversion pipeline before components enter the Canvas.
- **Proven result:** Wi-Fi, battery and clock requests produced real assets with Canvas and Preview parity.

## FORGEUI_AI_STUDIO_V2_3_3__DEVICE_AWARE_HERO_IMPORT_PIPELINE__1024X600_NATIVE_ASSETS__CANVAS_PREVIEW_P4_PARITY__2026-07-13

- **What changed:** Added device-aware hero preprocessing for generated and uploaded backgrounds.
- **Why it changed:** Original-size images did not reliably match the active 1024x600 display.
- **Final architecture:** Hero images are center-cropped to the device aspect ratio, resized, persisted and converted into native LVGL assets.
- **Proven result:** Canvas, Preview and physical ESP32-P4 displayed the same 1024x600 hero composition.

## FORGEUI_AI_STUDIO_V2_3_0__AI_HERO_ASSET_PIPELINE__BUILDER_THEME_PREVIEW_UNIFIED__LVGL_READY__2026-07-13

- **What changed:** Promoted AI hero output from temporary preview data to reusable ForgeUI assets.
- **Why it changed:** Generated artwork needed to persist, participate in themes and export to firmware.
- **Final architecture:** AI hero generation feeds the uploaded-asset registry, Theme Manager, Canvas, Preview and LVGL export through one asset record.
- **Proven result:** The selected hero persisted and exported as an LVGL-ready firmware asset.

## FORGEUI_AI_STUDIO_V2_2__LIVE_GPT_LAYOUT_AND_AI_HERO_BACKGROUND_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-13

- **What changed:** Added live AI hero-background generation alongside the proven AI layout workflow.
- **Why it changed:** ForgeUI needed both structural UI generation and visual background generation.
- **Final architecture:** Layout AI produces validated component documents while Hero AI produces images; both converge on the existing builder and export systems.
- **Proven result:** AI layouts and hero backgrounds reached the browser workflow and physical ESP32-P4.

## FORGEUI_AI_STUDIO_V2__MODERN_WORKSPACE__LIVE_GPT_LAYOUT_PIPELINE__PHYSICAL_ESP32P4_PROVEN__2026-07-12

- **What changed:** Introduced the AI Studio workspace for live natural-language layout generation.
- **Why it changed:** The earlier AI engine required a usable Studio surface for prompting, review and Canvas insertion.
- **Final architecture:** AI requests return a validated layout document that is resolved and inserted through normal component actions.
- **Proven result:** Prompt-generated layouts rendered in Builder, Preview and exported firmware on ESP32-P4.

## FORGEUI_AI_ENGINE_V2__LIVE_GPT_TO_PHYSICAL_ESP32P4_PIPELINE_PROVEN__2026-07-12

- **What changed:** Established the first end-to-end GPT layout pipeline.
- **Why it changed:** Natural-language generation needed to reuse ForgeUI components rather than bypass the builder.
- **Final architecture:** Prompt, API, parser, validation, component insertion, LVGL export, ESP-IDF and physical runtime form one pipeline.
- **Proven result:** A live GPT-generated interface was built, flashed and displayed on ESP32-P4.

# About the Creator

Hi, I'm **Scott Forster** from New Zealand.

ForgeUI Studio began as a personal project to make embedded HMI development easier, faster and more enjoyable. As someone who enjoys solving real engineering problems, I wanted a tool that could take an idea from a simple prompt all the way through to a working interface running on physical ESP32 hardware.

Every feature in ForgeUI is developed with a simple philosophy:

> **Build it. Prove it. Flash it. Improve it.**

The project has grown into an open-source AI-assisted embedded UI platform combining visual design, AI-powered generation, LVGL and ESP-IDF into a single workflow.

ForgeUI is built in collaboration with ChatGPT, which has been an invaluable coding assistant, sounding board and development partner throughout the project. While I design the architecture, test the hardware and drive the vision, ChatGPT has helped accelerate development by assisting with implementation, refactoring and documentation.

This project is shared with the community in the hope that it makes embedded development more accessible and inspires others to build amazing products.

I welcome feedback, ideas and contributions from developers around the world.

---

**Scott Forster**  
Creator & Lead Developer — ForgeUI Studio

📧 **forgeui.esp32@gmail.com**
