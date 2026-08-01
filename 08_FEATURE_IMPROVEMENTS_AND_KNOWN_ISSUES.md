# ForgeUI Feature Improvements & Known Issues

This is the living ForgeUI engineering journal. It records change, evidence and
open engineering work. It does not replace or duplicate
`04_FEATURE_STATUS.md`, which remains authoritative for the current status of
each feature and the official widget totals.

## Project Summary

| Item | Current record |
| --- | --- |
| Last updated | 2026-08-01 |
| Current Standard Widget proof total | 29 of 39 (74%), as recorded in `04_FEATURE_STATUS.md` |
| Remaining Standard widgets | 10 |
| LVGL version | 9.2.2 |
| ESP-IDF version | 5.5.4 |
| Target hardware | Waveshare ESP32-P4-WiFi6-Touch-LCD-7B, 1024 × 600 |
| Current development phase | Hardware-first Standard Widget proof and authoring/export parity closure |

Totals are copied only as a dated summary pointer. Change them in
`04_FEATURE_STATUS.md` after proof acceptance, then refresh this summary.

## Recently Improved

### 2026-08-01 — End-of-sprint Standard proof and parity closure

- **Subsystem:** Button, Heading, Box, Divider, Text, Icon and native TileView.
- **Improvement:** Button, Heading, Box and Divider completed physical proof;
  Heading gained multiline/alignment parity, Box gained authoritative child
  ownership and Browser nesting parity, Divider gained visible default vertical
  geometry, Text gained multiline wrapping/export parity, Icon gained
  source-aware 92% automatic fitting with centered native pivots, and TileView
  retained its native replacement for the former synthetic export.
- **Reason:** Hardware-first comparison exposed presentation, nesting, wrapping,
  sizing and clipping differences that automation alone could not establish.
- **Validation:** Button, Heading, Box and Divider passed ESP32-P4 proof. Text and
  Icon software regressions passed but both remain **READY FOR FINAL HARDWARE
  RE-PROOF** and are excluded from the 29-widget proven total.

### 2026-08-01 — Standard Text parity

- **Subsystem:** Inspector, shared preview renderer and native LVGL exporter.
- **Improvement:** Standard Text gained unrestricted multiline authoring,
  preserved whitespace/newlines, bounded Canvas/Browser wrapping, alignment
  parity and explicit native label geometry with `LV_LABEL_LONG_WRAP`.
- **Reason:** ESP32-P4 proof exposed a label that rendered only a short fragment
  instead of the complete wrapped value.
- **Validation:** Focused Text suites passed 18/18; a broader documentation,
  preview and export selection passed 72/72. Corrected hardware proof remains
  open, so this improvement is not a proof promotion.

### 2026-07-31 — Native TileView export and proof

- **Subsystem:** Standard TileView preview, generated runtime and UserEvents.
- **Improvement:** Replaced the simultaneous synthetic four-panel export with
  native `lv_tileview_create()` / `lv_tileview_add_tile()` paging, retained
  coordinates, a silent setter and one genuine-user callback per transition.
- **Reason:** The synthetic representation did not exercise native LVGL paging
  or match the intended hardware interaction.
- **Validation:** Horizontal and vertical navigation, coordinates `(0,0)`
  through `(1,1)`, repeated navigation and surrounding Wi-Fi, SD, TabView,
  Spinbox and List stability were physically verified on ESP32-P4.

### 2026-07-31 — Native Spinbox vertical slice

- **Subsystem:** Registry, Tray, Canvas, Inspector, Browser Preview, native
  export, Runtime SDK, UserEvents, live firmware and Standalone Export.
- **Improvement:** Added native LVGL Spinbox with signed values, decimal display,
  selected-digit editing, rollover, clamping, collision-safe instances and
  export-time feature gating.
- **Reason:** ForgeUI needed a native digit-selection control distinct from the
  free-form NumberInput architecture.
- **Validation:** Live and Standalone builds, touch editing, setters, hooks,
  multiple instances and physical ESP32-P4 behaviour passed.

### 2026-07-31 — Widget Registry authority cleanup

- **Subsystem:** Standard Widget Registry and Tray discovery.
- **Improvement:** Consolidated canonical identity, category, search metadata,
  defaults, insertion, capability flags, documentation targets and availability
  in `ForgeUIWidgetRegistry.ts`; legacy lists became projections.
- **Reason:** Parallel widget catalogues allowed metadata and insertion behaviour
  to drift.
- **Validation:** Registry completeness, unique metadata, documentation targets,
  Tray insertion, search, keyboard access, undo/redo and hydration regressions
  are recorded in the architecture validation history.

### 2026-07-31 — Runtime SDK direction and contracts

- **Subsystem:** Generated application interface.
- **Improvement:** Documented and expanded the generated semantic layer above
  private LVGL objects: silent `FG_Set_*` APIs, genuine-user `FG_On_*` hooks,
  collision-safe names, ownership boundaries and feature gating.
- **Reason:** Application code needs a stable integration surface without editing
  replaceable generated LVGL.
- **Validation:** Spinbox and TabView contracts have physical evidence; broader
  generated API and preservation suites are recorded in the code maps.

### 2026-07-31 — Standard widget proof milestones

- **Subsystem:** List, TabView, TileView, Spinbox and Button proof work.
- **Improvement:** Added or strengthened native runtime behaviour, callback
  suppression, generated-code parity and physical evidence for the current
  proof batch.
- **Reason:** Automation alone is insufficient for touch, geometry and firmware
  parity claims.
- **Validation:** Individual results are recorded in the Physical Proof Ledger
  below and remain authoritative in `04_FEATURE_STATUS.md`.

### 2026-07-30 — Documentation Centre and Runtime SDK documentation

- **Subsystem:** Public ForgeUI website and engineering references.
- **Improvement:** Replaced placeholder documentation with a searchable,
  statically exported Documentation Centre covering Studio workflow, generated
  C ownership, Runtime SDK, ESP-IDF integration and hardware validation.
- **Reason:** Public documentation needed to reflect the current native export
  architecture and its evidence boundaries.
- **Validation:** Website production build, static routes, sitemap, local search,
  internal links and documentation tests are part of the website validation
  suite.

## Resolved Issues

### 2026-08-01 — Text wrapping correction (software resolved; re-proof open)

- **Issue:** Standard Text displayed only a short fragment and failed to wrap in
  its configured bounds on ESP32-P4.
- **Root cause:** The native branch did not previously own complete label
  geometry/wrap behaviour, and preview whitespace relied on browser defaults.
  The inspected flashed artifact also assigned text before size and long mode.
- **Resolution:** Use a multiline Inspector editor and one normalized text model;
  previews use preserved whitespace and bounded wrapping; export applies actual
  width/height and `LV_LABEL_LONG_WRAP` before the complete escaped text plus
  normalized alignment/font styles.
- **Regression protection:** Inspector long-value/newline tests, JSON reload,
  shared Canvas/Browser rendering tests, all alignments, full escaped C,
  geometry/call-order assertions and explicit absence of DOT/CLIP modes.
- **Physical validation:** Not yet complete. Text remains
  **READY FOR FINAL HARDWARE RE-PROOF** until the corrected build is flashed
  and visually accepted.

### 2026-08-01 — Icon native scaling and clipping correction

- **Issue:** A 64 × 64 uploaded FiAirplay descriptor was emitted into a 48 × 48
  native image object at scale 256, clipping the centered image at its bounds.
- **Root cause:** Uploaded images retained source scale instead of deriving
  scale from the shared rendered target; exact-edge automatic fitting also left
  no allowance for transformed anti-aliased pixels.
- **Resolution:** Canvas, Browser Preview and export now share a 92% automatic
  fit of the shorter component edge when `boxSize` is unset. Native export uses
  actual descriptor dimensions, a centered pivot and `LV_IMAGE_ALIGN_CENTER`.
  Explicit `boxSize` remains exact.
- **Regression protection:** Source-size, padding, scale, pivot, alignment,
  opacity, recolour and deterministic Live/Standalone block tests.
- **Physical validation:** Correction awaits final flash and visual comparison.
  Icon remains **READY FOR FINAL HARDWARE RE-PROOF**.

### 2026-07-31 — Spinbox export coordinates

- **Issue:** Generated increment/decrement helpers could be placed off-screen or
  use malformed coordinates.
- **Root cause:** Helper geometry did not consistently derive from the actual
  Spinbox component bounds.
- **Resolution:** Derive the field and helper-button coordinates from normalized
  component geometry and keep the buttons in the component's generated layout.
- **Regression protection:** Focused Spinbox geometry/export tests and export
  preflight coverage.
- **Physical validation:** Passed in live and Standalone ESP32-P4 firmware.

### 2026-07-31 — Canvas click suppression

- **Issue:** Canvas drag/selection handling could consume Spinbox helper clicks
  and leave the preview state stale.
- **Root cause:** Wrapper pointer handling did not distinguish component
  authoring gestures from control interaction.
- **Resolution:** Corrected the Canvas interaction path while retaining normal
  selection and drag behaviour.
- **Regression protection:** Shared preview and Canvas interaction/state tests.
- **Physical validation:** Final Spinbox proof passed.

### 2026-07-31 — Synthetic TileView export

- **Issue:** TileView exported four ordinary visible child panels instead of a
  native swipeable LVGL TileView.
- **Root cause:** The initial implementation modeled appearance without native
  paging semantics.
- **Resolution:** Replaced it with native tiles, direction constraints,
  active-tile lookup and retained coordinate transitions.
- **Regression protection:** Native-constructor, tile-map, setter, callback and
  Canvas/Browser parity tests.
- **Physical validation:** Passed horizontal/vertical ESP32-P4 navigation and
  repeated stability checks.

### 2026-07-31 — List callback validation

- **Issue:** List required proof that a controlled tap emitted exactly one
  callback with the correct row identity.
- **Root cause:** Software coverage alone did not prove physical touch/event
  behaviour.
- **Resolution:** Retained native list/button ownership and collision-safe
  indexed/text hooks, then exercised rows individually.
- **Regression protection:** Exporter callback/index/text and collision tests.
- **Physical validation:** Passed; controlled taps returned matching row indices
  and labels without duplicate callbacks.

### 2026-07-31 — TabView startup suppression

- **Issue:** Initial selection and programmatic selection could be confused with
  genuine user changes.
- **Root cause:** Native value-change events needed one guarded retained-state
  transition boundary.
- **Resolution:** Startup hydration and setters remain silent; genuine effective
  touch changes update state and emit one hook.
- **Regression protection:** Initial selection, repeated selection, clamp,
  collision and callback-count tests.
- **Physical validation:** Passed for physical selection of tab indices 0, 1
  and 2.

### 2026-07-31 — SD filename compatibility

- **Issue:** SD workflows could fail when generated or copied filenames did not
  remain compatible with the bounded firmware path/name contract.
- **Root cause:** Host/export and firmware filename expectations were not fully
  aligned.
- **Resolution:** Aligned bounded filename/path handling and retained safe
  validation for storage operations.
- **Regression protection:** Export-server and storage-path validation plus
  bounded firmware checks.
- **Physical validation:** SD remained ready during the recorded widget proof
  sessions; storage operation evidence is maintained in the hardware guide.

## Known Active Issues

### P1 — Standard Text hardware re-proof

- **Subsystem:** Standard Text / generated LVGL.
- **Description:** The software parity correction is implemented, but the new
  C has not yet been clean-built, flashed and visually verified with the long
  paragraph and explicit multiline proof strings.
- **Current workaround:** Use explicit manual line breaks and generous bounds,
  but do not treat the result as proven.
- **Next action:** Inspect the regenerated live and Standalone Text blocks,
  clean-build/flash the reference ESP32-P4, and verify full wrapping and all
  alignments before changing totals.
- **Date last reviewed:** 2026-08-01.

### P1 — Standard Icon hardware re-proof

- **Subsystem:** Standard Icon / generated LVGL image sizing.
- **Description:** Source resolution and scaling now work, and the native
  clipping defect has a shared 92% automatic-fit correction, but the corrected
  Live and Standalone builds still need final visual hardware acceptance.
- **Current workaround:** Set an explicit conservative `boxSize`; do not treat
  the current software result as proven.
- **Next action:** Compare regenerated Live and Standalone Icon blocks, flash
  both and confirm all anti-aliased edges match Canvas and Browser Preview.
- **Date last reviewed:** 2026-08-01.

### P2 — Existing TypeScript diagnostics

- **Subsystem:** Studio test/preview typing.
- **Description:** Full `tsc --noEmit` currently reports the pre-existing
  CircularProgress BrowserPreview JSX return-type diagnostic and a
  `StandardListPreview` polymorphic `type` prop diagnostic. The Text path adds
  no TypeScript diagnostic.
- **Current workaround:** Run focused suites and inspect TypeScript output for
  changed-path diagnostics; do not report the repository-wide check as clean.
- **Next action:** Resolve each typing issue in its owning widget task without
  weakening compiler settings.
- **Date last reviewed:** 2026-08-01.

### P2 — Remaining Standard Widget proof backlog

- **Subsystem:** Proven Widget Pipeline.
- **Description:** The authoritative ledger records 10 Standard widgets still
  outside full physical proof. QR Code has software coverage but still needs
  recorded phone scans; Text is awaiting corrected visual re-proof.
- **Current workaround:** Use the per-widget status and evidence boundaries in
  `04_FEATURE_STATUS.md`; never infer hardware proof from automation.
- **Next action:** Complete one isolated widget proof at a time through live and
  Standalone generated-C comparison, ESP-IDF build, flash and physical review.
- **Date last reviewed:** 2026-08-01.

## Physical Proof Ledger

This is a compact evidence journal, not the full status catalogue.

| Widget | Studio | Standalone | ESP32-P4 | Documentation | Status |
| --- | --- | --- | --- | --- | --- |
| Spinbox | Passed | Passed | Passed | Complete | **PROVEN** |
| TabView | Passed | Passed | Passed | Complete | **PROVEN** |
| List | Passed | Passed | Passed | Complete | **PROVEN** |
| TileView | Passed | Passed | Passed | Complete | **PROVEN** |
| Button | Passed | Passed | Passed | Recorded | **PROVEN** |
| Heading | Passed | Passed | Passed | Complete | **PROVEN** |
| Box | Passed | Passed | Passed | Complete | **PROVEN** |
| Divider | Passed | Passed | Passed | Complete | **PROVEN** |
| Text | Software passed | Software parity path shared | Corrected build not yet accepted | Re-proof procedure recorded | **READY FOR FINAL HARDWARE RE-PROOF** |
| Icon | Software passed | Deterministic shared generator | Corrected build not yet accepted | Re-proof procedure recorded | **READY FOR FINAL HARDWARE RE-PROOF** |

## Validation History

Only completed, recorded runs belong in this section.

| Date | Validation | Recorded result |
| --- | --- | --- |
| 2026-08-01 | Focused Standard Text tests | 3 suites, 18/18 tests passed |
| 2026-08-01 | Broader Text/theme/export regression selection | 6 suites, 72/72 tests passed |
| 2026-08-01 | Icon sizing/clipping focused validation | 6 suites, 157/157 tests passed; focused ESLint, export-server syntax and diff check passed |
| 2026-08-01 | Button, Heading, Box and Divider hardware proof | Live/Standalone and ESP32-P4 physical evidence accepted |
| 2026-08-01 | Studio TypeScript | Failed on two existing unrelated diagnostics: CircularProgress test JSX return type and StandardListPreview polymorphic `type` prop |
| 2026-08-01 | Website TypeScript | Passed `npm run typecheck` |
| 2026-08-01 | Website ESLint | Passed `npm run lint` |
| 2026-08-01 | Website production build and static export | Passed; 49 static pages generated, including `/docs/feature-improvements`, `/docs/fi-runtime` and the authoritative Fi Runtime source page |
| 2026-08-01 | Website tests | 70/70 passed, including Documentation Centre routes, sitemap, navigation, internal-link and local-search validation |
| 2026-07-31 | Spinbox focused and integration validation | Passed through Registry, previews, exporter, Runtime SDK, UserEvents, live and Standalone output |
| 2026-07-31 | TileView physical validation | Native paging, coordinates, silent setter/startup, callbacks and stability passed |
| 2026-07-31 | List physical validation | Matching index/text and one callback per controlled tap passed |
| 2026-07-31 | TabView physical validation | Indices 0, 1 and 2, silent startup/setter and genuine-user callbacks passed |
| 2026-07-31 | ESP-IDF firmware | ESP-IDF 5.5.4 / LVGL 9.2.2 live and Standalone builds recorded as passed for the proof batch |
| 2026-07-31 | Hardware proof | Spinbox, List, TabView and TileView evidence recorded on the Waveshare ESP32-P4 target |
| 2026-07-30 | Website Documentation Centre | Production static build, route/link/search/document tests recorded as passed |

Failures remain visible rather than being rewritten as historical passes.

## Current Sprint

- **Current objective:** Archive the 29/39 end-of-sprint save point, then close
  the pending Text and Icon final hardware re-proofs without premature promotion.
- **Current proof batch:** Button, Heading, Box and Divider completed; Text and
  Icon are corrected in software and queued for final Live/Standalone flash.
- **Recently completed widgets:** Button, Heading, Box and Divider physical
  proof; native TileView, Spinbox, List and TabView milestones remain current.
- **Next planned widgets:** No new widget begins before this save point is
  archived and the remaining proof pipeline is explicitly resumed.

## Engineering Notes

### Registry authority

`ForgeUIWidgetRegistry.ts` is the authoritative Standard Widget catalogue. Tray
data and compatibility sets derive from it. New parallel lists are prohibited.

### Proven Widget Pipeline

Proof follows Official LVGL Reference → Registry → Tray → Canvas → Inspector →
Browser Preview → native export → Runtime SDK where applicable → UserEvents for
genuine interaction → live firmware → Standalone Export → ESP32-P4 →
documentation. Automation readiness is not physical proof.

### Runtime SDK philosophy

The Runtime SDK is generated with each interface. It is a semantic boundary
above private LVGL, not a universal binary library. Setters project state
silently; hooks report genuine user actions; presentation-only widgets remain
API-free unless their Registry contract says otherwise.

### Live versus Standalone ownership

Both workflows consume the same native LVGL generator and preflight. Live
firmware is Studio-managed. A Standalone project becomes developer-owned, with
product behaviour kept in `95_UserEvents` or ordinary application modules rather
than replaceable `90_Studio_Export` files.

### Feature gating

Board Profiles, Widget Registry capabilities and serialized usage determine
generated features, sources and dependencies. Unused runtime families should
not be included by broad type exclusions or hard-coded board checks.

### Hardware-first validation

Canvas and Browser Preview are authoring evidence; generated C is export
evidence; a successful build is firmware evidence; photographed and observed
ESP32-P4 behaviour is physical proof. The journal preserves these boundaries.
### 2026-08-01 — Generic Fi Icon Runtime

Authoritative architecture:
[`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md). This journal
records the milestone and outstanding proof rather than duplicating the guide.

- **Subsystem:** Standard Icon, Runtime SDK, UserEvents and export server.
- **Improvement:** Added per-instance, component-name-based `Visible`, `Opacity`
  and `Color` APIs in generated `96_FiRuntime.c/.h`, plus default-off optional
  click hooks in 95 for image-backed and supported symbol-backed icons.
- **Reason:** A selected Fi asset needed to become a reusable runtime object
  without coupling public APIs to catalogue identity or emitting unused code.
- **Validation:** Focused generator, naming, Registry, canonical icon, selector,
  preview and export-server tests passed. ESP32-P4 evidence now proves only the
  90 → 95 click path, so overall status is
  **SOFTWARE COMPLETE / PARTIALLY PHYSICALLY PROVEN**.

### P1 — Fi Icon Runtime physical proof

- **Priority:** P1
- **Subsystem:** Standard Icon runtime presentation and optional input.
- **Description:** Software contracts are complete. Click cardinality and three
  collision-safe click-hook instances are physically proven through 90 → 95.
  The 90 → 96 presentation path and remaining acceptance checks still require
  ESP32-P4 observation.
- **Current workaround:** Claim physical proof only for Fi Icon click hooks; do
  not claim the presentation setters, Icon, or full Fi Runtime as proven.
- **Next action:** Complete color, opacity, hide/show, repeated silent-setter,
  click-disabled, independent presentation-instance and Standalone-parity proof,
  including pre-bind retained state, using the guide's ESP32-P4 procedure.
- **Date last reviewed:** 2026-08-01

### 2026-08-01 — Fi Icon Runtime validation

| Validation | Recorded result |
| --- | --- |
| Focused runtime/Registry/icon/selector/preview/export-server | 7 suites, 104/104 tests passed |
| Focused ESLint | Passed with no findings |
| Export-server syntax | Passed (`node --check`) |
| TypeScript | Feature code clean; two existing unrelated diagnostics remain in CircularProgress test JSX and StandardListPreview polymorphic props |
| Full regression | 148/152 suites passed; 1046 passed, 1 skipped, 11 existing unrelated failures in component fixture naming, Spinbox live-fixture parity, AI Prompt Builder catalogue and Layout Designer preview positioning |
| Production build | Reached lint/type validation; blocked by existing unrelated lint errors in Spinbox/Spinner tests and ForgeAIPanel state-sheet test mocks |
| ESP-IDF 5.5.4 Live build | Toolchain configured and compilation started; blocked in existing `esp_hosted` configuration by `Unknown Slave Target`, before ForgeUI application compilation |
| Standalone feature build | Not established; no external proof export was created after the Live configuration blocker |
| Diff whitespace | Passed (`git diff --check`) |
