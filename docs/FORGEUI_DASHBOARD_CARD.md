# ForgeUI Dashboard Card

Status: **PROVEN** (2026-08-02).

Platform milestone:
`FORGEUI_NATIVE_COMPONENT_1__DASHBOARD_CARD_PROVEN__ESP32P4_VALIDATED__READY_FOR_SENSOR_TILE__2026-08-02`.

Dashboard Card is **ForgeUI Native Component #1**. It is an application-level
component built above the completed LVGL foundation, not an LVGL widget wrapper.
It follows [ForgeUI Native Widget Architecture](FORGEUI_NATIVE_WIDGET_ARCHITECTURE.md).
The authoritative post-export API, UserEvent, ownership and task-safety guide is
the [ForgeUI Native Component Runtime Guide](../10_FORGEUI_NATIVE_COMPONENT_RUNTIME_GUIDE.md).

## Architecture

One `DashboardCard` `IComponent` stores one versioned set of semantic props.
Its internal frame, icon, labels, status indicator and progress bar are virtual
composition parts. They are never stored as hidden project components and
cannot be selected independently.

The existing Widget Registry owns discovery and insertion. The existing Canvas
owns selection, movement, resize, copy, duplication and deletion. Focused
Canvas/Browser rendering uses the existing preview dispatchers. The shared
`ForgeUILvglExport.ts` generator emits the same native composite for Live Studio
and Standalone Export.

## Serialized semantic model

Schema version: `1`.

- title and optional native symbol;
- primary value and units;
- secondary text;
- normal, warning, critical or offline status plus status text;
- progress from 0 to 100;
- timestamp and optional explicit accent colour;
- header, footer, progress and status visibility;
- padding and click-UserEvent enablement;
- ordinary component geometry and Dashboard layout metadata.

The normalizer supplies backward-compatible defaults and clamps progress and
padding. No generated LVGL names or internal objects are serialized.

## Generated Runtime SDK

For a component named `Power Card`, export emits:

```c
void FG_Set_Power_Card_Value(const char * value);
void FG_Set_Power_Card_Units(const char * units);
void FG_Set_Power_Card_Status(const char * text, uint32_t rgb);
void FG_Set_Power_Card_Progress(int32_t value);
```

Setters project application state without invoking UserEvents. Progress clamps
to `0..100`; strings treat `NULL` as empty. Multiple instances receive
collision-safe names.

When click generation is enabled, the developer hook is:

```c
void FG_On_Power_Card_Clicked(void);
```

Only a genuine click on the Card root invokes the hook. Internal composition
objects expose no public events.

## Dashboard integration

Registry metadata identifies Dashboard Card as `forgeui-native`, family
`dashboard`, with affinities for status, metrics, main and card-grid regions.
It remains one ordinary component when arranged by Dashboard Designer or
created by a future Template Library entry.

## ESP32-P4 physical proof record

Dashboard Card rendered correctly on the Waveshare ESP32-P4 and matched Browser
Preview closely. Live Studio and Standalone Export behaved consistently.
Semantic Runtime setters and the root UserEvent operated correctly, touch
remained responsive, and the Card behaved as one Canvas-owned component.
Multiple instances remained independent. RAM remained stable, with no crash,
watchdog reset or rendering corruption.

Result: **ForgeUI Native Component #1 — Dashboard Card — PROVEN**.

## ESP32-P4 proof procedure (completed)

1. Place two Dashboard Cards with distinct names and content in a Dashboard
   layout; resize one and duplicate the other.
2. Verify Canvas selection/move/resize/copy/delete/undo behavior treats each
   Card as one object and exposes no internal objects.
3. Verify Inspector changes for every semantic property and save/reload the
   project to confirm schema-1 serialization.
4. Exercise Browser Preview at minimum and compact sizes with header/footer,
   status and progress combinations.
5. Generate Live Studio and Standalone Export. Confirm both contain readable
   private LVGL composition, four collision-safe semantic APIs per Card and
   only enabled root click hooks.
6. Build and flash the Standalone project to the Waveshare ESP32-P4.
7. Confirm both Cards render with semantic theme parity; update value, units,
   status colour/text and progress through the generated APIs.
8. Tap each Card repeatedly and confirm exactly one matching hook per tap, no
   startup callbacks and no callback from programmatic setters.
9. Repeat updates/taps for at least ten cycles while Wi-Fi and System pages
   remain operational. Record RAM, crash, watchdog and rendering stability.
10. Promote Dashboard Card to **PROVEN** only after this evidence is accepted
    and Live/Standalone parity is confirmed.

The accepted hardware observations satisfy this proof boundary. The procedure
is retained as the reproducible validation record for future regression passes.

## Deliberate Version 1 boundaries

- Values are application-projected strings; Dashboard Card owns no sensor,
  MQTT, CAN or other transport.
- The optional icon uses an LVGL native symbol in Version 1. Uploaded and Fi
  artwork are not duplicated into a Card-specific asset path.
- The Card has no editable internal children or arbitrary content slots.
- Selection is represented by the optional root click hook; no separate
  retained selected-state ABI is introduced.
