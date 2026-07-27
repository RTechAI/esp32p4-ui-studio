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

**FORGEUI_SYSTEM_RUNTIME__COMPLETE_WIFI_MANAGER__NATIVE_LVGL_KEYBOARD__HOSTED_CONNECTIVITY__ESP32P4_PROVEN__READY_FOR_WIFI_UI_POLISH__2026-07-27**

## Purpose

This is the permanent ownership, integration, and debugging map for the ForgeUI Interactive Asset Framework, System Runtime, Hosted Connectivity Runtime, generated LVGL runtime and export boundary. It describes the current implementation rather than its development history.

Use this document to answer:

- Where does the subsystem live?
- Which file owns each responsibility?
- Which behavior is shared and which behavior is type-specific?
- What must not be duplicated?
- Where should debugging begin?
- How should another Interactive Asset type extend the framework?
- How should another built-in System page extend the System Runtime?
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

## System Runtime

```text
System Runtime
  │
  ├── Application Container
  ├── System Launcher
  ├── Display / Brightness
  ├── Wi-Fi Manager
  ├── Native LVGL Keyboard
  └── Future Pages
```

Current future placeholders:

- Bluetooth
- Sound
- Storage
- Device
- Diagnostics

System Launcher, Display / Brightness, the complete Wi-Fi Manager and its reusable native LVGL keyboard are implemented and physically proven. The future pages are typed identifiers and disabled launcher placeholders, not completed services.

The System Runtime is not an Interactive Asset. It is not a user project screen. It is a reusable built-in platform layer generated alongside the user's application.

Studio and Browser Preview share typed System page state, current-session brightness and navigation. Generated LVGL represents the same hierarchy through persistent sibling containers. The application and its Interactive Assets remain instantiated while a System page is visible.

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

This file owns SDMMC Slot 0 SD Card and FAT filesystem operation. It does not configure or manipulate ESP-Hosted.

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
- persistent application, System launcher and Brightness containers
- complete generated Wi-Fi System page, status card, connected details and structured network rows
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

- System Context and Surface regressions cover open, close, Back, Display navigation, live brightness state, session retention, disabled placeholders and preservation of existing application interaction
- System Context and Surface regressions also cover deterministic Wi-Fi scan, structured rows, selection, open/protected branching, password and forget workflows, connected details, Disconnect and Reconnect
- System LVGL exporter regressions cover persistent containers, internal callbacks, gear generation, visibility switching, the `10–100` slider, Waveshare BSP brightness integration and the complete Wi-Fi Manager projection contract
- Wi-Fi generator coverage includes connected-detail fields, structured row generation, password workflow and backend intent callbacks
- all five workflows have focused configured-helper, resize, measurement, fit, preview and exporter coverage where implemented
- Creator, Toggle and Three-Position State Sheet, crop interaction, row-remapping, image-pipeline, linked-crop and atomic-registration regressions pass; unchanged State Sheet suites may require the established longer timeout in combined runs
- keyboard exporter lazy-creation, reusable-instance, attachment, geometry, ordering and relative-width regressions pass
- Button and Light hardware-backed resize/contain behavior retains its focused automated coverage
- Toggle, Status Indicator and Three-Position configured-helper, Canvas resize, registry refresh, measurement, visible-bounds fitting, preview scaling and LVGL contain regressions pass
- shared intrinsic and alpha measurement, state-set union geometry, same-ID invalidation, metadata-write deduplication, linked crop, idempotence and legacy dimension recovery regressions pass
- TypeScript validation passes
- generated-output verification passes
- ESP-IDF firmware build passes for the recorded Wi-Fi Manager implementation
- scoped diff checks pass
- known unrelated fixture/source absences are reported separately rather than weakening export validation

## Debugging map

Start at the ownership boundary matching the symptom.

| Symptom | Begin with | Then inspect |
|---|---|---|
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

## Framework extension pattern

Extend the framework by runtime family first, then by asset-specific model and artwork semantics.

### System Runtime extension

Current System services are:

```text
System Runtime
├── Launcher
├── Display / Brightness
├── Wi-Fi Manager
├── Native LVGL Keyboard
└── Future System Pages
```

Display / Brightness, the Wi-Fi Manager and the reusable native LVGL keyboard are complete within the recorded physical proof. Future System Pages remain placeholders.

Future built-in System pages should reuse:

- `ForgeUISystemContext`
- `ForgeUISystemSurface`
- dedicated page components such as `ForgeUIWifiPage`
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
- Storage
- Device
- Diagnostics

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

Potential future runtime families:

- Value Runtime
- Selection Runtime
- Gauge Runtime
- Numeric Display Runtime
- Progress Runtime

These are future concepts only and are not implemented.

Do not create a new registry, persistence system, AI pipeline, uploaded-asset store, exporter, or duplicate runtime generator for a future type. Reuse an existing runtime family whenever its state and API contract match. Create a new runtime family only when the existing momentary input, persistent binary input, persistent three-position input and binary output contracts cannot represent the control.
