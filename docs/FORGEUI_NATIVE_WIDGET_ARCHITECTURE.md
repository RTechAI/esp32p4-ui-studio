# ForgeUI Native Widget Architecture

Status: **AUTHORITATIVE — ELEVEN NATIVE COMPONENTS; NETWORK STATUS CARD HARDWARE VALIDATED** (2026-08-07).

Alarm Panel status: **PHYSICALLY RENDERED ON ESP32-P4 — EXTENDED RUNTIME PROOF
DEFERRED**.

The six physically proven Native Components are Dashboard Card, Sensor Tile,
Relay Panel, PWM Controller, Trend Chart, and Trend Chart Pro. Alarm Panel is
recorded separately as **HARDWARE VALIDATED** after fresh export, build, flash,
and correct physical rendering on ESP32-P4. Trend Chart is
the lightweight technical industrial trend; Trend Chart Pro is the separate
premium dashboard-oriented engineering trend. Both validate stable persisted
identity, duplicate isolation, semantic Runtime APIs, canonical UserEvents,
shared Browser/Live/Standalone generation, and ESP32-P4 parity.

Alarm Panel implements fixed-capacity semantic collections, deterministic
overflow rejection, distinct acknowledge/clear transitions, and isolated
persisted-ID event contracts. Its earlier certification claim was invalidated
by a missing Canvas renderer and generated LVGL row overlap; both are repaired.
Studio insertion, editing/persistence, Browser Preview, standalone export, build,
flash, and physical rendering are confirmed. Exhaustive transition, callback,
acknowledgement, and clear lifecycle proof awaits the future Proof Module. The
IO Monitor is **HARDWARE VALIDATED** after export, build, flash, and correct
physical rendering on ESP32-P4. It is intentionally read-only and generates no
touch callbacks. Battery Card is **HARDWARE VALIDATED** as a read-only semantic
monitor with seven silent APIs, persisted-ID/rename-stable identity, isolated
duplicate state, and no UserEvents. Browser/Live/generated LVGL parity, build,
flash, and physical rendering are confirmed without overstating physical
runtime interaction proof. Tank Level Card is **HARDWARE VALIDATED** with six
silent persisted-ID setters, duplicate isolation, Browser/Live/Export parity,
physical rendering, and intentionally no UserEvents. Network Status Card is
**HARDWARE VALIDATED** as a read-only monitor with six silent persisted-ID
setters, duplicate isolation, zero UserEvents, and live ESP32-P4 Wi-Fi
projection independent of the optional System Wi-Fi Manager page. The
Simulator / Proof Module, automated Runtime SDK proof harness, ESP-Hosted
startup investigation, and further export infrastructure remain deferred.

Current milestone:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

Current ForgeUI Platform milestone:
`FORGEUI_V3_5_4__ELEVEN_NATIVE_COMPONENTS__NETWORK_STATUS_HARDWARE_VALIDATED__DOCS_ALIGNED__READY_FOR_DEVICE_SUMMARY_CARD__2026-08-07`.

## Decision

A ForgeUI Native Widget is an application-level, Registry-owned component that
uses several LVGL objects internally but behaves as one authored component. It
has one project identity, one Inspector contract, one geometry boundary, one
normalized state model and one public Runtime SDK namespace. Its internal LVGL
objects are implementation details.

Native Widgets extend the existing component graph, Widget Registry, preview
dispatcher, shared LVGL generator, Runtime API/UserEvents outputs, feature
gating, asset pipelines and layout metadata. They do not introduce another
registry, renderer, exporter, event system or runtime product.

Developer-facing post-export contracts for this architecture are maintained in
the [ForgeUI Native Component Runtime Guide](../10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).

## Proven architecture milestone

Dashboard Card successfully validated the Native Component architecture on the
Waveshare ESP32-P4. The following decisions are now **PROVEN**:

- extension of the existing Widget Registry;
- versioned semantic serialization;
- shared Canvas/Browser Preview architecture;
- shared Live Studio and Standalone Export generation;
- semantic Runtime SDK generation;
- genuine-user UserEvents;
- single-component Canvas ownership;
- private internal LVGL composition;
- independent multi-instance behavior; and
- Browser/Live/Standalone/ESP32-P4 parity.

This proof establishes the architecture for subsequent Native Components. It
does not make their domain behavior automatic; each component must still pass
the full acceptance gate.

Sensor Tile subsequently validated the same architecture for typed engineering
measurements. Its ESP32-P4 proof confirms semantic serialization, shared
Browser Preview, shared Live/Standalone export, semantic Runtime SDK generation
and genuine-user UserEvents. It also proves that persisted Native Component
identity keeps public Runtime symbols stable and that UserEvents ownership
reconciliation preserves active developer logic correctly across regeneration.

Relay Panel is the third implementation of the architecture and the first
multi-control Native Component. One schema-1 component owns 1–8 stable semantic
channel records while its LVGL rows, labels and switches remain private. The
shared generator owns bounded zero-based logical state, silent Runtime setters,
and genuine-user channel/master hooks through the proven ownership reconciler.
GPIO configuration remains outside the component. ESP32-P4 physical proof
validated individual and master interaction, Wi-Fi/SD continuity and stable
runtime behavior. Confirmation prompts are deferred until one implementation can serve
both Browser Preview and generated LVGL without a parallel dialog system.

## Existing platform review

The current platform already supplies the required ownership boundaries:

- `ForgeUIWidgetRegistry.ts` owns discovery, insertion, defaults, capability
  metadata, documentation and serialized-widget feature gates.
- The established component store owns identity, parent/children relationships,
  duplication, undo/redo, persistence and project hydration.
- `forgePreviewRenderer.tsx` is the shared Browser Preview dispatch path;
  focused preview components already provide type-specific rendering.
- `ForgeUILvglExport.ts` is the single native generator used by Live Studio and
  Standalone Export. It already emits collision-safe Runtime APIs and
  UserEvents and collects asset sources.
- Export validation checks generated declarations, hooks and artifacts before
  build/export. Export-time feature gating already coordinates generated C,
  CMake sources, components and manifests.
- Board Profiles and project hardware selection already own target capability
  truth. Native Widgets should declare requirements against those capabilities.
- Canonical uploaded Image, Icon and Interactive Asset registries already own
  artwork identity, dimensions, conversion state and export sources.
- Layout Designer already uses ordinary persisted components, semantic region
  roles, arrangement metadata and template composition. AI Fill already
  produces catalogue-backed components for those regions.

These systems are sufficient. The main architectural gap is a richer contract
inside the existing Widget Registry for an application-level composite's
schema, bindings, layout affinities and hardware requirements.

## 1. Recommended Native Widget architecture

Each Native Widget should have five coordinated pieces behind one Registry
definition:

1. A versioned property schema and pure normalizer.
2. An Inspector editor for those public properties.
3. A pure composition model describing semantic parts and states.
4. A focused preview component consumed by the existing preview dispatcher.
5. A native emission handler consumed by the existing LVGL generator.

The composition model is the parity boundary. It should describe semantic
parts such as `frame`, `title`, `value`, `unit`, `status`, `trend` and
`primaryAction`, not React elements or raw C strings. Preview and export read
the same normalized model and resolve it into their respective implementation
objects.

The project persists only the public Native Widget component. Internal parts
are virtual and deterministic; they are not hidden records in `IComponents`.
This avoids unstable child IDs, polluted selection/undo state, duplicated
public APIs and migrations tied to a particular LVGL object tree.

Native Widget editability means that all intentional public content, style,
state, bindings and optional sections are editable through its Inspector.
Widgets that need user-supplied child content may additionally use the existing
`container` or `structured` child ownership contract and named slots. Internal
implementation parts remain encapsulated.

Recommended invariants:

- one authored component ID and one generated symbol stem;
- normalized defaults are identical after insertion, hydration and migration;
- internal part names are stable within a widget schema version;
- public state is semantic, never an exposed `lv_obj_t *`;
- setters are silent and idempotent;
- UserEvents represent genuine user transitions only;
- construction and hydration emit no UserEvents;
- Live Studio and Standalone Export consume identical generated output;
- assets resolve only through existing canonical registries;
- unsupported hardware requirements fail preflight with an actionable message.

## 2. Registry integration

Add Native Widgets to `ForgeUIWidgetRegistry.ts`, primarily in its existing
`Dashboard` category. Keep `ForgeUIWidgetSet.ts` as a compatibility projection.

The existing definition should eventually gain optional metadata rather than a
new definition type or registry:

```ts
platform?: {
  kind: 'native-widget'
  schemaVersion: number
  family: string
  layoutRoles: ForgeUILayoutRegionRole[]
  preferredArrangements: ForgeUILayoutArrangement[]
  templateTags: string[]
  requiredBoardCapabilities: ForgeUIBoardCapability[]
  requiredFirmwareFeatures: string[]
  assetRequirements: string[]
  runtimeContractId?: string
}
```

`capabilities` remains authoritative for Runtime API, UserEvent, user-input and
child-ownership claims. The new metadata describes platform composition and
placement; it must not duplicate those booleans. Registry tests must require a
real documentation target, explicit capabilities, schema version and valid
hardware/layout references for every Native Widget.

AI discovery should become a projection of Registry metadata. The current
separate supported-type list in `ForgeAIComponentCatalogue.ts` is useful legacy
infrastructure but should not become a second Native Widget catalogue.

## 3. Serialization strategy

Persist a Native Widget as a normal `IComponent`:

```text
id, type, parent, children, props
```

Its `props` contain:

- `nativeWidgetSchemaVersion`;
- semantic content and presentation options;
- initial public state;
- optional data-binding descriptors;
- optional named-slot/layout metadata;
- ordinary `x`, `y`, `w`, `h`, theme and region properties.

Do not persist generated LVGL object names, C identifiers, resolved colours,
preview-only state or an expanded internal object tree. Transient Browser
Preview interactions stay local unless they represent an authored property.

Every widget normalizer accepts missing and older fields and returns the latest
canonical model. Migrations should be pure, ordered and idempotent:

```text
stored props -> version migrations -> normalizer -> canonical model
```

Unknown future fields should survive ordinary project round trips where the
existing persistence path permits it. Destructive project-wide rewrites are
reserved for schema changes that cannot be normalized lazily.

## 4. Export strategy

Extend `ForgeUILvglExport.ts` with a Native Widget emission boundary invoked by
the existing component traversal. A handler receives the normalized widget,
parent LVGL symbol, collision-safe component stem, palette, feature selection
and existing asset/API/event collectors. It returns code fragments and metadata
to those same collectors.

The handler may emit several private LVGL objects and callbacks, but only the
widget root participates in normal authored geometry and parent traversal.
Internal objects use deterministic private names derived from the component
stem plus semantic part names.

Feature gating follows two levels:

- serialized use gates the widget's generated code;
- declared requirements flow through existing project/board validation and
  export-time dependency pruning.

No widget may patch generated firmware after export or add a Standalone-only
source path. If a reusable C helper becomes justified, it remains a gated
ForgeUI-owned runtime module materialized by the existing export server for
both Live and Standalone output.

## 5. Runtime SDK and UserEvents strategy

Design the public contract before the internal LVGL tree. Each Native Widget
publishes the smallest application-level surface that represents its meaning.
For a Sensor Tile this might be `Set_Value`, `Set_Status` and `Set_Alarm`; it
must not expose setters for its private Label, Icon or Bar objects.

Continue emitting declarations through `publicApiDeclarations` and genuine-user
hooks through `userEventHooks`. Reuse existing collision-safe naming,
preservation merge into `95_UserEvents.*`, silent setters and export validation.

Recommended contract rules:

- use one component-derived namespace: `FG_Set_<Name>_*`,
  `FG_<Command>_<Name>_*`, `FG_On_<Name>_*`;
- prefer typed enums/structs when an atomic update avoids transient partial UI;
- keep structs small, C-compatible and declared once in generated public headers;
- separate application state from presentation configuration;
- use commands only for meaningful actions such as clear, acknowledge or add;
- never expose internal part pointers or internal callback names;
- emit APIs/hooks only when enabled by Registry instance configuration;
- document ownership, task/thread expectations and value normalization.

Data binding should initially remain generated API driven. MQTT, CAN, sensors
and similar transports must not be embedded into visual widgets. Later binding
descriptors may connect a widget to separately owned runtime services through a
common binding layer, without changing the widget's semantic API.

## 6. Browser Preview strategy

Add one focused preview component per Native Widget and route it through the
existing `renderForgePreview()` dispatch. It consumes the same pure normalized
composition model used by export.

Preview should simulate semantic state and genuine interactions, not reproduce
LVGL implementation details. It must use the existing theme context, canonical
Image/Icon/Interactive Asset resolvers and geometry boundary. Interactive
simulation remains local to Browser Preview unless the editor explicitly
changes an authored initial value.

Canvas remains an authoring surface: selection, drag and resize take priority.
Browser Preview is the interaction surface. This preserves the established
split used by structured and interactive widgets.

## 7. Dashboard Designer integration

Native Widgets are ordinary components assigned to existing layout regions by
`layoutRegionId`, `layoutOrder` and arrangement metadata. The Registry declares
compatible `layoutRoles`, preferred arrangements, minimum/recommended sizes and
optional aspect-ratio constraints. Auto Arrange reads that metadata rather than
special-casing widget type names.

Dashboard Designer must never expand a Native Widget into its LVGL parts. It
places and sizes the single component. A composite that accepts user content
may expose named slots, but those slots use the existing component graph and
child-ownership rules.

The first Dashboard family should validate placement in `status`, `metrics`,
`controls`, `chart`, `main` and `card-grid` roles using existing region logic.

## 8. Template Library integration

Templates should reference Registry widget types plus public props, not private
composition details. Extend template items only with optional intent metadata
such as required capability, preferred family or semantic role. Resolution
selects an available Registry widget and creates an ordinary component.

Template compatibility should be checked against:

- widget availability/status;
- board capabilities and enabled firmware features;
- asset requirements;
- target geometry and layout role;
- widget schema version.

Templates remain declarative project starters. Applying a template produces
editable components; it does not retain a hidden dependency on the template.
AI-assisted composition should use the same Registry projection and template
constraints, then pass results through existing normalization and layout
composition.

## 9. Migration strategy

Do not convert the completed Standard LVGL widgets. They remain stable
foundation primitives and valid project components.

Adopt three migration paths:

1. **Native Widget schema migration:** versioned prop normalization within the
   same type.
2. **Opt-in composition:** offer an explicit editor command to wrap or replace
   a compatible group of existing widgets with a Native Widget; never perform
   this silently.
3. **Detach to primitives, later:** only if a real user workflow requires it,
   materialize a Native Widget into ordinary Standard components as a one-way
   editable conversion. This is not required for Phase 1.

Legacy projects without Native Widgets require no migration. Unknown or
unsupported Native Widget versions must fail validation clearly rather than
exporting a partial substitute.

## 10. Native Component ledger and next planned component

The current ledger preserves the six fully proven components, records Alarm
Panel in its intermediate hardware-validation state, and keeps future work
separate:

1. **Dashboard Card** — **PROVEN**.
2. **Sensor Tile** — **PROVEN**; typed engineering
   value/unit/status/trend/timestamp/colour updates without owning a sensor
   transport, with stable Runtime SDK and UserEvents identity across regeneration.
3. **Relay Panel** — **PROVEN**; proves multi-control genuine UserEvents, silent state
   projection and safe initialization.
4. **PWM Controller** — **PROVEN**.
5. **Trend Chart** — **PROVEN**.
6. **Trend Chart Pro** — **PROVEN**.
7. **Alarm Panel** — **HARDWARE VALIDATED**; exported, flashed, and physically
   rendered on ESP32-P4, with extended runtime interaction proof deferred.
8. **IO Monitor** — **HARDWARE VALIDATED**; read-only live digital and analogue
   I/O visibility, semantic silent setters, and physical ESP32-P4 rendering.

9. **Battery Card** — **HARDWARE VALIDATED**; semantic battery telemetry, seven
   silent setters, no UserEvents, parity-complete generated rendering, and
   confirmed ESP32-P4 physical rendering.

10. **Tank Level Card** — **HARDWARE VALIDATED**; display-only tank telemetry,
    six silent persisted-ID setters, rename stability, duplicate isolation, no
    UserEvents, Browser/Live/Export parity, and confirmed ESP32-P4 rendering.

11. **Network Status Card** — **HARDWARE VALIDATED**; read-only connectivity
    telemetry, six silent persisted-ID setters, rename stability, duplicate
    isolation, no UserEvents, Studio/Browser/Live/LVGL parity, and live ESP32-P4
    Wi-Fi projection without opening the System Wi-Fi Manager.

Native monitoring projections execute independently of optional System UI page
visibility. Generated runtimes order this work as backend pump, snapshot,
Native Component projection, optional System UI page gate, then System UI
projection. Monitoring cards therefore cannot accidentally depend on an
optional manager page being open.

Possible later specialized cards include Device Summary Card, KPI Card, and Power Flow Card. Their ordering
is not certified by this ledger.

Weather, Camera, MQTT, CAN, Industrial, Marine and other domain families should
follow only after common binding and service boundaries are proven. Their
transports and product policy must remain outside visual widget ownership.

## Acceptance gate for every Native Widget

A Native Widget is complete only when its Registry entry, schema normalization,
Inspector, Canvas behavior, Browser Preview, shared Live/Standalone generation,
Runtime SDK/UserEvents contract, feature gating, asset handling, export
validation, documentation, automated coverage and applicable ESP32-P4 physical
proof agree. The Proven Widget Pipeline remains the delivery discipline; its
target is now application-level behavior rather than another LVGL class.

## Architectural conclusion

LVGL is ForgeUI's mature rendering and interaction substrate. ForgeUI Native
Widgets are stable application-level contracts over that substrate. Their
public identity is semantic and durable; their internal LVGL composition is
private and replaceable. This separation lets ForgeUI evolve its developer
experience, dashboards, templates, AI tooling and Runtime SDK for years without
forking the proven platform architecture.
