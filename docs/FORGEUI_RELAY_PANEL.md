# ForgeUI Relay Panel

Status: **PROVEN — ESP32-P4 VALIDATED** (2026-08-02).

Platform milestone:
Historical proof checkpoint: Relay Panel proven on ESP32-P4 on 2026-08-02; current library status is in `FORGEUI_NATIVE_COMPONENTS.md`.

Concise development handover save point:
That checkpoint is retained as evidence, not as the current roadmap.

Relay Panel is **ForgeUI Native Component #3**. It represents one logical bank
of 1–8 relays, contactors, solenoids, pumps, lights, fans, valves or general
digital outputs. It remains one serialized, selectable Canvas component. Its
LVGL container, channel rows, labels, status labels and switches are private.

## Semantic model

Schema version `1` stores panel title/subtitle/icon, stable channel IDs, labels,
logical state, enabled state and optional status text. It also stores optional
master control, channel numbering, compact/standard layout, active/inactive/
disabled colours, footer, padding, gap and API/UserEvent generation settings.

Normalization clamps channel count to `1..8`, makes missing or duplicate IDs
unique, resizes the channel array deterministically, validates colours and
enums, and clamps layout spacing. Internal LVGL object names are never project
state. Channel IDs survive reorder and save/reload because they belong to the
semantic channel records.

## Runtime SDK

Channel indexing is **zero-based**. Every generated function validates
`channel < channelCount`; invalid indices are ignored and getters return
`false`.

```c
void FG_Set_<Component>_Channel(uint32_t channel, bool enabled);
bool FG_Get_<Component>_Channel(uint32_t channel);
void FG_Set_<Component>_Channel_Enabled(uint32_t channel, bool enabled);
void FG_Set_<Component>_All(bool enabled);
void FG_Set_<Component>_Label(uint32_t channel, const char * label);
void FG_Set_<Component>_Status(uint32_t channel, const char * text);
void FG_Set_<Component>_Master(bool enabled);
```

The generated Runtime owns reliable per-channel logical state, so the getter
returns that state. Programmatic setters use an update guard and never emit
UserEvents. `All` and `Master` affect enabled channels only. Invalid channel
indices are safely rejected. Hardware GPIO ownership remains outside the
component; developers bind application-owned hardware in `95_UserEvents.c`.

## Genuine-user hooks

```c
void FG_On_<Component>_Channel_Changed(uint32_t channel, bool enabled);
void FG_On_<Component>_Master_Changed(bool enabled);
```

Hooks are emitted only for genuine user interaction: individual channel taps
emit the channel callback and master interaction emits the master callback.
Programmatic Runtime SDK calls remain silent. Disabled channels remain inert
where configured, and internal LVGL switches remain private.
The shared UserEvents ownership reconciler recognizes both hooks, preserves
active customised bodies, removes obsolete placeholders and quarantines stale
custom hooks safely.

## Confirmation-mode V1 boundary

The semantic schema reserves `disabled`, `confirm-off` and `confirm-all`.
Authoring and runtime behavior remain **disabled in V1** because ForgeUI does
not yet have one confirmation primitive shared by Browser Preview and generated
LVGL. A browser-only prompt would violate parity. No incomplete dialog framework
was introduced.

## ESP32-P4 proof record

The active proof component was `Comp_MSBHEOFNU0_CVL`. Generated hooks were:

```c
void FG_On_Comp_MSBHEOFNU0_CVL_Channel_Changed(uint32_t channel, bool enabled);
void FG_On_Comp_MSBHEOFNU0_CVL_Master_Changed(bool enabled);
```

Physical testing confirmed channel `0`, `1`, `2` and `3` ON interactions,
followed by master ON, master OFF and master ON. Channel indexing was observed
as zero-based. Throughout testing Wi-Fi remained connected at `192.168.0.90`,
SD remained ready, and there was no crash, watchdog, reset or visible runtime
failure.

Relay Panel V1 is physically proven as one serialized, versioned Native
Component with 1–8 stable-ID logical channels, one selectable/resizable Canvas
object, private LVGL composition, Browser Preview behavior, shared Live Studio
and Standalone generation, bounded Runtime access, reliable generated channel
state, silent setters, genuine-user channel/master events, individual/master
control, configured disabled-channel protection, collision-safe multi-instance
generation and UserEvents reconciliation.

## Hardware boundary and V1 limitations

Relay Panel owns logical UI state only. It does not own GPIO or relay drivers,
board-pin mapping, polarity configuration, or I2C/SPI relay expanders. V1 has
no command-versus-feedback model, auxiliary-contact feedback, or fault/health
model. Hardware I/O feedback is a future Relay Panel V2 direction.

Confirmation modes remain reserved/deferred until Browser Preview and generated
LVGL can maintain parity.

## Implementation history

Earlier on 2026-08-02 Relay Panel reached **IMPLEMENTED — READY FOR ESP32-P4
PHYSICAL PROOF** after its architecture and implementation work. During that
integration, the tray/Canvas dispatcher defect and invalid
`lv_font_montserrat_10` export defect were found and corrected. This dated
pre-proof state is retained as history and is superseded by the accepted
ESP32-P4 proof above.

## Roadmap

1. Dashboard Card — **PROVEN**
2. Sensor Tile — **PROVEN**
3. Relay Panel — **PROVEN**
4. PWM Controller — **NEXT**
5. System Health
6. Network Widget
7. Storage Widget
8. Gauge Cluster
9. Energy Monitor

PWM Controller and Components #5–#13 subsequently completed implementation through the same Native Component pipeline.
