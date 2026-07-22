# Current Save Point

**FFORGEUI_BINARY_OUTPUT_RUNTIME__INTERACTIVE_STATUS_INDICATOR__INTERACTIVE_ASSET_FRAMEWORK_V2__PHYSICAL_ESP32P4_PROVEN__2026-07-22**

## Current Proven Status

ForgeUI has a reusable Interactive Asset Framework with three fully implemented asset types:

- Interactive Button
- Interactive Light
- Interactive Status Indicator

Both types are proven through Studio creation, AI state-image generation, asset registration, persistence, Canvas rendering, Studio preview, LVGL export, ESP-IDF build, and physical ESP32-P4 runtime.

The Studio presents both types through one coherent Interactive Assets creation flow. Button, Light and Status Indicator share the Interactive Asset Framework while retaining type-specific asset models, designers, preview behaviour, export behaviour and runtime behaviour.  while retaining type-specific asset models, designers, state mappings, Canvas behavior, export behavior, and runtime behavior.

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

- Interactive Button and Interactive Light dimensions and state images
- uploaded-asset existence and LVGL conversion readiness
- generated C source paths and LVGL symbols
- Canvas dimensions, duplicate component IDs, missing references, and wrong asset kinds
- duplicate Button hooks, Light setters, image symbols, and image declarations
- generated hooks, public setter declarations, and referenced asset-source coverage

The server independently validates the generated payload and does not trust the browser boundary. It rejects empty code, unsafe or duplicate source paths, missing generated C files, invalid or duplicate symbols, symbols absent from their source files, and asset sources not referenced by the generated code.

Deletion is also reference-aware. Uploaded assets used by Buttons, Lights, or the active Theme, and Interactive Assets assigned to Canvas components, are reported and protected before registry, persistence, Canvas, theme, blob-URL, or disk mutation occurs.

The physical Build & Flash check correctly exposed active built-in theme sources that validation found missing from firmware. The exact Neural Core and Carbon Fiber generated C sources were restored, their symbols were verified, and the server regression suite now validates those real firmware assets. Validation remains strict; the missing inputs were fixed instead of bypassing the safety boundary.

## Interactive Assets UI

The Interactive Assets panel exposes one creation entry point:

```text
+ New Interactive Asset
```

The panel owns the single Asset Type selection:

- Button
- Light

The parent-owned `selectedAssetKind` controls the active designer, visible type-specific form, AI generation mode, and new-draft initialization. Changing Asset Type switches the displayed designer and its fields. Asset Type switching is disabled while AI generation is in progress so asynchronous results cannot be directed into the wrong designer.

Clicking `+ New Interactive Asset` initializes the selected type's draft without creating a registry object. Registration occurs only on Save. Editing an existing asset automatically selects `asset.kind`, opens the correct designer, and loads the correct draft.

There are no separate New Button and New Light creation flows. The Button and Light designers remain separate internally; their models and save logic are not merged.

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
```

`ForgeUIInteractiveAsset` is the discriminated union of supported models. The common registry and persistence layer store both kinds. Kind-aware lookup and validation prevent an asset from being resolved as the wrong type.

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
- The asset can be assigned to an `InteractiveLight` Canvas component.
- Assignment writes `interactiveAssetId` and propagates width and height.
- Assignment persists across Studio restart.

### LVGL runtime behavior

Interactive Light exports as a non-clickable LVGL image. Its initial source uses the saved `initialState`.

- It has no Button-style event callback.
- It generates no Light hook in `95_UserEvents`.
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

Button and Light use the same request, response, upload, and LVGL conversion pipeline:

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

Light generation modes:

- `light-off`
- `light-on`

The type-specific differences are prompt mode, prompt template, filename prefix, and result-to-state mapping. The selected parent asset kind determines the modes used by the shared generator.

```text
Button: first → normalAssetId, second → pressedAssetId
Light:  first → offAssetId,     second → onAssetId
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

Interactive Button click hooks cross into this layer. Interactive Light setters remain generated public UI APIs in `90_Studio_Export.h/.c` and do not create Light hooks in `95_UserEvents`.

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

### Light

- `src/forgeui/interactive/ForgeUIInteractiveLightAsset.ts`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Shared UI and AI

- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Exporter

- `src/forgeui/ForgeUILvglExport.ts`
- `export-server.js`

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

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- No crash after interaction

## Verified Automated Status

-19 test suites passed.
- 123 tests passed.
1 documented legacy test skipped.test is skipped.
- TypeScript completed with zero diagnostics using `tsc --noEmit`.
- ESLint completed with no warnings or errors.
- `export-server.js` syntax check passed.
- Export validation and reference-protection suites passed.
- The built-in Neural Core and Carbon Fiber firmware sources passed real server-side source and symbol validation.

The former `InteractiveLightCanvasPreview.test.tsx` TypeScript baseline error is resolved. The only non-passing test status is the intentional legacy icon-export skip documented during Phase 1.

## Architectural Significance and Extension Pattern

Interactive Button established the first **Interactive Input Runtime** within the Interactive Asset Framework.

Interactive Light introduced the shared **Binary Output Runtime**, proving that generated output controls could expose a simple developer API while sharing a common runtime implementation.

Interactive Status Indicator validated that the Binary Output Runtime is reusable. It extends the framework without introducing a second runtime implementation, demonstrating that additional binary output assets can be added by reusing the existing runtime while providing their own asset model, designer, preview behaviour, export handling and generated public API.

ForgeUI now consists of reusable Interactive Asset runtime families rather than isolated widget implementations.

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
└── Interactive Button

Binary Output Runtime
├── Interactive Light
└── Interactive Status Indicator
```

Potential future Interactive Asset types include:

### Interactive Input Runtime

- Toggle Switch
- Rotary Switch
- Slider
- Keypad

### Binary Output Runtime

- Alarm Indicator
- Battery Indicator
- Bluetooth Indicator
- Wi-Fi Indicator
- Motor State
- Direction Indicator
- Multi-state Lamp

### Future Runtime Families

- Gauge
- Seven-segment Display
- Progress Indicator
- Numeric Display

These are extension examples only and are not currently implemented.

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
