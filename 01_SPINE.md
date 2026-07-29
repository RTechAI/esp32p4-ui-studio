# Project Spine: what ForgeUI is, what is proven, current priorities, and what must not regress

## WHY 01_SPINE & 02_DEVELOPER & 03_FORGEUI_GEN -  means Codex spends less time guessing and is much less likely to:

- edit generated files directly
- duplicate an existing subsystem
- put firmware logic into the Studio
- break ownership boundaries
- revive an obsolete architecture
- touch hardware configuration that is   already proven

## Current Save Point

**FORGEUI_STANDARD_LVGL_CANVAS_TABVIEW_TILEVIEW_LINE_TEXT_HEADING_WIFI_PARITY__SHARED_PREVIEWS__SEMANTIC_THEME__LINE_ENDPOINTS__READY_FOR_P4_PROOF__2026-07-29**

## Current Proven Status..

ForgeUI has a reusable Interactive Asset Framework with five fully implemented asset types organized into three generated runtime families:

Interactive Input Runtime:

- Interactive Button
- Interactive Toggle Switch

Three-Position Input Runtime:

- Interactive Three-Position Toggle Switch

Binary Output Runtime:

- Interactive Light
- Interactive Status Indicator

All five types are proven through Studio creation, AI state-image generation, asset registration, persistence, Canvas rendering, Studio preview, Browser Preview, LVGL export and automated validation. The current physical ESP32-P4 record covers Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator. Three-Position LEFT/CENTER/RIGHT touch selection, its generated changed callback, consistent State Sheet visuals, and the corrected LVGL keyboard placement and sizing have also been proven on hardware.

The Studio presents all five types through one coherent Interactive Assets creation flow. Each runtime family owns its generated runtime while every type shares the common Interactive Asset Framework and retains type-specific asset models, designers, state mappings, preview behaviour, export behaviour and runtime behaviour.

All five Interactive Assets now have the same configured and unconfigured Inspector workflow, exact linked-asset Creator reopening, registry-driven preview refresh, shared cyan selection-border resizing with four edge and four corner hit zones, continuous Canvas clamping, and live Inspector geometry. Component geometry is authoritative after placement. Intrinsic dimensions and alpha bounds feed an explicit `Fit Bounds to Visible Artwork` action that preserves original uploads, creates linked same-size fitted state assets, and is idempotent. Canvas and Browser Preview preserve the saved component width and height and render artwork centred with contain-fit, so intrinsic artwork dimensions no longer limit component size. The shared LVGL exporter applies the same centred contain-fit rule against final component geometry.

Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator all use centred contain-fit rendering from final component geometry across Canvas, Browser Preview and generated LVGL output.

Two-state Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON assets use one stable union crop. Three-Position Toggle uses the compatible LEFT/CENTER/RIGHT union path. Registry updates invalidate stale same-ID measurements and refresh configured helpers and previews without component reselection. Canvas, Browser Preview and generated LVGL output retain parity where each workflow has been physically verified.

Project Health Phases 1 and 2 are complete. The repository has clean TypeScript and ESLint baselines, protected asset references, and client- and server-side export validation before generated firmware files are written. Focused Creator, State Sheet, crop, image-pipeline and exporter regressions provide the current automated baseline. The project is ready for continued UI polish on top of its physically proven runtime families.

ForgeUI now also includes a built-in System Interface in addition to the Interactive Asset Framework. The System Interface is proven through Studio, Browser Preview, generated LVGL and physical ESP32-P4 hardware. ForgeUI now has a fully proven System Runtime together with a fully recovered Hosted Wi-Fi and SD coexistence baseline.

Current implemented System pages:

- System Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

Navigation is proven through the complete current hierarchy:

```text
Application
→ System
→ Display
→ System
→ Wi-Fi Manager
→ System
→ Application
```

Display brightness is physically connected to the ESP32-P4 backlight through `bsp_display_brightness_set()`. Brightness changes live while the slider is moved and remains in memory during the current device session.

The Wi-Fi Manager is a physically proven reusable System Runtime feature rather than a backend demonstration. The complete workflow is proven on the ESP32-P4: Hosted Scan Networks, Refresh, live Available Networks population, SSID selection, RSSI and security display, Connected and Saved indicators, password dialog, native LVGL keyboard password entry, Connect, Disconnect, Reconnect, Forget Network and connected details. The complete Hosted scan pipeline, Browser Preview parity and generated LVGL parity are physically proven. Only minor visual polish remains.

The Storage Runtime is physically proven through lazy page creation, page reuse, SD status, capacity display, root and folder browsing, parent navigation, Previous / Next paging, Refresh, Read / Write Test, Select Item mode, Delete Empty Folder and Hosted Wi-Fi coexistence. Only Browser Preview / Canvas parity polish remains.

The Standard LVGL Runtime now provides a consistent developer-facing SDK layer for the currently reviewed exported components. Application code controls generated UI through public `FG_Set_*`, `FG_Show_*`, `FG_Hide_*`, `FG_Add_*` and `FG_Clear_*` declarations in `90_Studio_Export.h`. Genuine user interaction crosses back into application code through generated `FG_On_*` declarations and preservation-merged bodies in `95_UserEvents.h/.c`. Interactive setters use per-instance guards so programmatic updates remain silent and cannot be misreported as genuine user events.

This Standard Runtime is independent from the artwork-backed Interactive Asset runtimes, built-in System Runtime, Hosted Connectivity Runtime and Storage Runtime.

The current Standard LVGL physical validation group is fully reviewed and signed off across Canvas, Browser Preview, generated LVGL and the ESP32-P4:

- Led
- Bar
- Arc
- Chart
- Table
- Keyboard
- Calendar
- Scale
- Roller
- MsgBox
- ButtonMatrix

The next Standard parity group has completed source-level and automated repair:

- Canvas
- TabView
- TileView
- Line
- Text
- Heading
- Wi-Fi status presentation

Current status:

- Canvas and Browser Preview shared rendering: complete
- semantic theme integration: complete at source level
- generated LVGL exporter support: complete
- focused automated validation: complete
- physical ESP32-P4 sign-off: pending final Generate -> Build -> Flash confirmation

The flashed ESP32-P4 remains the authoritative final reference. This group remains outside the eleven-component physical validation milestone until that final confirmation is complete.

## Standard LVGL Semantic Theme Milestone

ForgeUI now uses one semantic theme pipeline for the physically proven Standard component group:

```text
Selected Theme
        |
        v
Semantic Theme Resolver
        |-- Canvas
        |-- Browser Preview
        `-- LVGL Export
                |
                v
        Generated Firmware
                |
                v
           ESP32-P4
```

Canvas and Browser Preview follow the selected theme. Generated LVGL consumes the same semantic theme resolution, and the ESP32-P4 follows the selected theme after Generate -> Build -> Flash. Runtime live theme switching on the device was not added.

The Standard semantic palette is:

- `surface`
- `surfaceSecondary`
- `surfaceBorder`
- `textPrimary`
- `textSecondary`
- `accent`
- `accentText`
- `disabledText`
- `selectedSurface`

Standard components consume these semantic roles instead of hard-coded decorative colours. Primary text is independent from accent, accent text is chosen by contrast, and missing values resolve through the deterministic graphite fallback. Custom palettes export correctly.

Selected-theme changes propagate through:

- Canvas
- Browser Preview
- Code Preview
- live firmware generation
- Build & Flash
- Clean Build & Flash
- standalone ESP-IDF export

## Standard LVGL Component Runtime APIs

ForgeUI's standard LVGL components generate developer APIs only when the component owns meaningful runtime state or actions.

Completed runtime APIs:

- ✓ LED
- ✓ Bar
- ✓ Arc
- ✓ Chart
- ✓ Keyboard
- ✓ Calendar
- ✓ Roller
- ✓ Message Box
- ✓ Button Matrix
- ✓ TabView
- ✓ Tileview
- ✓ Input
- ✓ Textarea
- ✓ Switch
- ✓ Checkbox
- ✓ Radio
- ✓ Progress
- ✓ NumberInput
- ✓ Select
- ✓ Image
- ✓ Box
- ✓ IconButton

Inspected and intentionally API-free:

- ✓ Scale
- ✓ Line
- ✓ Icon
- ✓ Divider

Completed serialized presentation properties:

- ✓ Button Text
- ✓ Text Value
- ✓ Heading Text
- ✓ Clock Presentation

Slider Canvas interaction is repaired and complete, but no Slider runtime setter or developer hook is claimed by this save point.

Ownership and generation rules:

- `90_Studio_Export.h` declares public `FG_*` APIs.
- `90_Studio_Export.c` retains private LVGL objects and runtime state and implements the APIs, transition helpers and LVGL event adapters.
- `95_UserEvents.h` declares generated developer hooks.
- `95_UserEvents.c` is merged in live firmware: matching developer-written function bodies are preserved and only missing declarations or stubs are appended. Existing hooks are not deleted.
- In a standalone exported project, `95_UserEvents.*` becomes developer-owned application code.
- Live `/export` and standalone `/export-idf-project` both use `studio/export-server.js` and the shared `studio/src/forgeui/ForgeUILvglExport.ts` generator.
- Generated firmware is evidence and build input, never the source of the fix; these files must not be manually patched.
- Component instances are sorted deterministically, C identifiers are sanitized, and collisions receive deterministic suffixes such as `_2`.

Interactive controls:

- expose a public setter or control API and a genuine user-event hook;
- create silently;
- keep programmatic setter calls silent;
- use per-instance guards to suppress setter-generated LVGL events;
- invoke hooks only for genuine user interaction.

Output-only controls:

- expose a public setter;
- generate no developer hook when no genuine user transition exists.

Presentation-only controls:

- expose no public runtime API;
- generate no developer hook.

Interactive Asset hook ownership remains separate.

### Standard Component API Summary

| Serialized type | Public API | Developer hook | Runtime semantics |
| --- | --- | --- | --- |
| `Led` | `FG_Set_<Name>(bool on)` | `FG_On_<Name>_Changed(bool enabled)` | Retained boolean output |
| `Bar` | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Clamped scalar output |
| `Arc` | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Clamped scalar output |
| `Chart` | `FG_Add_<Name>_Point(int32_t value)`, `FG_Clear_<Name>(void)` | `FG_On_<Name>_Point_Added(int32_t value)`, `FG_On_<Name>_Cleared(void)` | Single-series streaming output |
| `Keyboard` | `FG_Show_<Name>(void)`, `FG_Hide_<Name>(void)` | `FG_On_<Name>_Shown(void)`, `FG_On_<Name>_Hidden(void)` | Visibility service |
| `Calendar` | `FG_Set_<Name>_Date(uint16_t year, uint8_t month, uint8_t day)` | `FG_On_<Name>_Date_Changed(uint16_t year, uint8_t month, uint8_t day)` | Date selection |
| `Roller` | `FG_Set_<Name>_Selected(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` | Option selection |
| `Msgbox` | `FG_Show_<Name>(void)`, `FG_Close_<Name>(void)` | shown, closed and button-pressed hooks | Temporary dialog visibility and button actions |
| `ButtonMatrix` | `FG_Set_<Name>_Selected(uint32_t button_index)` | `FG_On_<Name>_Button_Selected(uint32_t index, const char * text)` | Button selection |
| `Tabview` | `FG_Set_<Name>_Selected(uint32_t tab_index)` | `FG_On_<Name>_Changed(uint32_t tab_index)` | Retained active-tab selection |
| `Tileview` | `FG_Set_<Name>_Selected(uint32_t column, uint32_t row)` | `FG_On_<Name>_Changed(uint32_t column, uint32_t row)` | Retained active-tile coordinate |
| `Input` | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` | Interactive current single-line text; setter is silent |
| `Textarea` | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` | Interactive current multiline text; setter is silent |
| `Switch` | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` | Native LVGL checked state |
| `Checkbox` | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` | Native LVGL checked state; label remains serialized |
| `Radio` | `FG_Set_<Name>_Selected(bool selected)` | `FG_On_<Name>_Changed(bool selected)` | Independent circular `lv_checkbox`; no grouping model |
| `Progress` | `FG_Set_<Name>_Value(int32_t value)` | None | Output-only clamped progress value |
| `NumberInput` | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` | Guarded `int32_t` boundary over current textarea-based LVGL |
| `Select` | `FG_Set_<Name>_Selected_Index(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` | Guarded native `lv_dropdown`; serialized option list |
| `Image` | `FG_Set_<Name>_Source(const void * src)` | None | Output-only raw LVGL source pointer |
| `Box` | `FG_Set_<Name>_Visible(bool visible)` | None | Layout container with runtime visibility only; root Box excluded |
| `IconButton` | `FG_Set_<Name>_Enabled(bool enabled)` | `FG_On_<Name>_Clicked(void)` | Interactive native button; serialized icon |
| `Scale` | None | None | Visual scale/tick renderer; owns no value |
| `Line` | None | None | Static two-point visual line; owns no semantic runtime state |
| `Icon` | None | None | Studio icon-picker convenience exported as a normal `lv_image`; serialized presentation only |
| `Divider` | None | None | Presentation-only visual separator; owns no runtime state |
| `Clock` | None | None | RTC-owned live time with serialized presentation configuration |
| `Button` | None added by Button Text | None added by Button Text | Static standard LVGL button with serialized visible label text |
| `Text` | None | None | Static LVGL label with serialized text content |
| `Heading` | None | None | Static LVGL heading label with serialized heading content |
| `Slider` | Not yet completed | Not yet completed | Canvas/Browser interaction repaired; runtime API remains future work |

### LED

The basic LED is serialized as `Led`, distinct from Interactive Light and Interactive Status Indicator. It retains its `lv_obj_t *` and boolean state, defaults to initially ON, and uses `lv_led_on()` / `lv_led_off()`. `FG_Set_<Name>(bool on)` returns when the requested state is already current and calls `FG_On_<Name>_Changed(bool enabled)` only after a real transition. Creation initializes state without firing the hook.

### Bar

The basic Bar is serialized as `Bar`. It retains its `lv_obj_t *`, current integer value and configured minimum and maximum. Defaults are range `0..100` and initial value `70`; persisted range and value properties are honored, including negative ranges. The setter clamps before comparison, suppresses repeated effective values, calls `lv_bar_set_value(..., LV_ANIM_OFF)`, updates retained state and then calls the changed hook. Creation does not notify.

### Arc

The basic Arc is serialized as `Arc`. Defaults are range `0..100`, initial value `65`, normal mode, LVGL default background angles, and the existing enabled knob/native clickability. Persisted range, value, rotation, background angles and mode are honored, including negative ranges. Its setter clamps before comparison, calls `lv_arc_set_value()`, updates retained state and notifies only on a real programmatic transition. No new input event was added; existing native touch behavior and appearance are preserved.

### Chart

The Chart is serialized as `Chart` and remains a line chart with one primary-Y series. Defaults are seven points, Y range `0..100`, SHIFT update mode, `LV_PALETTE_BLUE`, and startup data `10, 30, 20, 50, 40, 70, 60`. Its chart and series pointers are retained. Persisted point count, range, division lines, update mode, series color and initial data are honored when present.

`FG_Add_<Name>_Point()` clamps each sample and calls `lv_chart_set_next_value()`. Identical consecutive values remain valid samples and each accepted sample fires the point-added hook. `FG_Clear_<Name>()` resets the series points to `LV_CHART_POINT_NONE`, refreshes the chart and fires the cleared hook. Startup data is created directly and does not fire hooks. This milestone intentionally supports the current single-series architecture only.

### Standard Keyboard

The standard `Keyboard` component is eagerly created with a private one-line textarea. Both pointers are retained and the component is initially visible. Show reattaches the textarea, clears hidden state and moves the keyboard to the foreground; Hide detaches the textarea and hides the keyboard. Repeated visibility requests are suppressed and creation does not notify. Only Show and Hide are public: LVGL objects, modes, textarea attachment and key injection remain private.

This standard Canvas Keyboard is separate from the built-in System/Wi-Fi native keyboard, whose lazy top-layer architecture is unchanged.

### Calendar

The Calendar is serialized as `Calendar`. Current hardcoded defaults are today's date `2026-06-18`, the shown month June 2026, and no initial selected or highlighted date. The selected date is retained separately from today. The generated setter validates Gregorian dates including leap years, suppresses identical selections, updates the shown date and highlighted selection, and then calls the hook. Touch selection already uses `LV_EVENT_VALUE_CHANGED` and `lv_calendar_get_pressed_date()`; touch and programmatic changes share retained state without duplicate notifications. Creation does not fire a hook. No Calendar Inspector controls were introduced.

### Roller

The Roller is serialized as `Roller`. Defaults are options `One`, `Two`, `Three`, `Four`, selected index `0`, three visible rows, normal mode and `LV_ANIM_OFF`. Persisted options, selection, visible row count and normal/infinite mode are honored. The object, selected index and option count are retained. Programmatic and `LV_EVENT_VALUE_CHANGED` touch paths share one transition helper, clamp to the final valid option, suppress repeats and pass selected text through a generated UTF-8-sized buffer valid for the duration of the callback. Creation does not notify.

### Message Box

The Message Box is serialized as `Msgbox`. It is a custom ForgeUI panel built from ordinary LVGL objects, not `lv_msgbox`. Defaults are title `Message`, body `Example message text`, buttons `OK`, `Cancel`, initially visible, and non-modal as a child of the application container. Persisted title, body and button arrays are honored.

The panel object and visibility are retained. Show/Close use shared visibility handling, suppress repeats, and Show moves the panel to the foreground. Button click callbacks use stable generated metadata to report index and text. Buttons do not automatically close the panel because that was not its existing behavior. Creation does not fire shown, closed or button hooks.

### Button Matrix

The Button Matrix is serialized as `ButtonMatrix`. Its default map is `One Two Three` / `Four Five Six`; row breaks do not count as buttons. The default selected index is `1` (`Two`), one-check is disabled, and there are no initially checked or disabled buttons. Persisted maps, selected index, checked state, one-check mode and disabled-button indexes are honored. Selected and checked remain distinct LVGL concepts.

The matrix object, button count and current selection are retained. Programmatic and `LV_EVENT_VALUE_CHANGED` touch paths share one transition helper. It clamps to a valid button, rejects disabled buttons, suppresses repeats, updates retained state before the LVGL selected-button call to prevent duplicate events, and passes text from the persistent generated map. Creation does not notify.

The first live Button Matrix inspection used a stale running Studio exporter bundle: it produced an old `90_Studio_Export.*` result while `95_UserEvents.*` reflected the newer hooks. Restarting Studio and regenerating through `/export` corrected all four files. This was stale running Studio/dev-server code, not a split between the live and standalone generators.

### Standard Canvas

Standard Canvas is a bounded LVGL container and may contain configured serialized artwork. The generic renderer must neither invent decorative SVG artwork nor discard configured artwork and render only an empty surface. Artwork resolves through the existing serialized fields and uploaded-asset registry, and Canvas and Browser Preview use the same artwork-aware renderer.

Artwork preserves contain scaling, centred alignment, clipping, transparency and serialized `x` / `y` / `w` / `h`. Generated LVGL emits a clipped Canvas parent with a centred child `lv_image`, the configured generated image symbol and the saved scale. The exporter and asset registry remain the source of truth. Physical proof of the restored image remains pending final regeneration and flash.

### TabView

TabView is serialized as `Tabview`. Three fixed tabs remain: `Tab 1`, `Tab 2` and `Tab 3`. Tab labels and tab count are not Inspector-configurable. Active selection defaults to index `0`, and persisted `selectedIndex` is honored.

Canvas and Browser Preview use a shared renderer. Preview selection initializes from serialized state and direct preview tab switching is supported. Current geometry uses a 34 px tab bar, equal/remainder tab widths, square outer bounds and explicit content/page sizing. Selected styling uses a muted accent or selected-surface treatment, an accent bottom indicator and semantic text colours. Browser Preview does not simulate native swipe animation.

Active tab is genuine semantic retained runtime state. Touch and programmatic selection share the existing transition helper, API and hook ownership. The public setter clamps indexes above the final tab, suppresses repeated effective selections, updates retained state before LVGL and calls `lv_tabview_set_active(..., LV_ANIM_OFF)`. Touch parity uses `LV_EVENT_VALUE_CHANGED` and reads `lv_tabview_get_tab_active()`. Creation is silent, and the hook fires exactly once after a real transition. Same-named components receive deterministic `_2` suffixes. Physical proof remains pending.

Generated example:

```c
void FG_Set_Main_Tabs_Selected(uint32_t tab_index);
void FG_On_Main_Tabs_Changed(uint32_t tab_index);
```

### Tileview

Tileview is serialized as `Tileview`. The current ForgeUI contract is a simultaneous visible `2 × 2` panel:

- Tile 1 = column 0, row 0
- Tile 2 = column 1, row 0
- Tile 3 = column 0, row 1
- Tile 4 = column 1, row 1

Shared geometry uses 8 px padding, 6 px gaps, equal two-column/two-row layout and clipped child bounds. Canvas and Browser Preview use the same renderer. Generated LVGL uses a bounded parent with four visible child tile objects; the active tile receives `LV_STATE_CHECKED`.

Initial selection is column `0`, row `0`; persisted `selectedColumn` / `selectedRow` or `initialColumn` / `initialRow` values are honored. Active column and row remain genuine retained runtime state, and the existing setter and hook names remain unchanged. Invalid coordinates clamp safely, unavailable objects and missing mapped tiles are rejected, repeated effective selections are suppressed, and creation remains silent.

Tileview consumes the semantic roles `surface`, `surfaceSecondary`, `surfaceBorder`, `textPrimary`, `accent`, `accentText` and `selectedSurface`. Swipe paging is not part of the current TileView contract. Labels, grid size and navigation directions remain non-configurable. Physical proof remains pending.

Generated example:

```c
void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
```

Arbitrary layouts, sparse coordinates, custom directions, custom labels and Inspector grid configuration were not introduced.

### Input

`Input` exports a native LVGL textarea configured for the existing single-line input behavior. Runtime owns only current text. `FG_Set_<Name>_Text(const char * text)` updates it programmatically without invoking `FG_On_<Name>_Changed(const char * text)`; the hook represents genuine user edits only. Creation is silent, and a per-instance programmatic-update guard suppresses setter-generated events. Placeholder, password mode, accepted characters, maximum length and presentation remain serialized. Canvas and Browser Preview preserve their established interaction ownership, and generated names are deterministic and collision-safe.

### Textarea

`Textarea` exports the existing native multiline LVGL textarea. Runtime owns current multiline text only; placeholder remains independent serialized presentation. Its text setter is guarded and silent, while genuine `LV_EVENT_VALUE_CHANGED` edits invoke the changed hook. Creation does not notify. Canvas, Browser Preview and generated LVGL preserve the current multiline behavior and collision-safe instance naming.

### Switch

`Switch` exports native `lv_switch`, retains the object and checked state, and generates `FG_Set_<Name>_Checked(bool checked)` plus `FG_On_<Name>_Changed(bool checked)`. Creation and programmatic updates are silent. The per-instance guard prevents LVGL events raised by the setter from reaching the genuine-user hook. Canvas and Browser Preview use temporary local state without mutating project JSON.

### Checkbox

`Checkbox` exports native `lv_checkbox`, retains checked state, and uses the same guarded checked-state architecture as Switch. The serialized label remains Studio-owned. `FG_Set_<Name>_Checked()` is silent; genuine user changes invoke the hook. Creation is silent, Preview behavior remains local, and duplicate names are collision-safe.

### Radio

`Radio` currently exports a retained `lv_checkbox` styled with a circular indicator. `FG_Set_<Name>_Selected(bool selected)` and the selected-state hook use guarded per-instance state. Radios are independently selectable: no Radio Group or mutual-exclusion architecture exists, so multiple Radios may remain selected. Creation and setters are silent; genuine user changes notify. Canvas and Browser Preview use temporary local selection.

### Progress

`Progress` is output-only. It retains the native bar object, current value and serialized range and exposes `FG_Set_<Name>_Value(int32_t value)`. The setter clamps to the configured range and suppresses repeated effective values. It generates no developer hook because Progress has no genuine user transition. Canvas, Browser Preview and LVGL appearance remain unchanged.

### NumberInput

`NumberInput` keeps the existing textarea-based generated LVGL implementation while presenting an `int32_t` runtime boundary. It retains the object, current integer value, range and step. `FG_Set_<Name>_Value(int32_t value)` clamps and is guarded; genuine user edits invoke the integer changed hook. Creation and setter calls are silent. Canvas and Browser Preview use temporary local interaction state. No native device-side increment/decrement buttons or Spinbox architecture were invented.

### Select

`Select` exports native `lv_dropdown`, retains selected index and serialized option count, and exposes `FG_Set_<Name>_Selected_Index(uint32_t index)`. The guarded setter clamps safely and remains silent; genuine selection invokes `FG_On_<Name>_Changed(uint32_t index, const char * text)`. Options remain serialized Studio configuration. No runtime add, remove or replace option-list API exists. Preview interaction is temporary and naming is collision-safe.

### Image

`Image` is output-only. LVGL-ready instances retain native `lv_image` and current source pointer and expose `FG_Set_<Name>_Source(const void * src)`. `NULL`, unavailable objects and unchanged pointers are safe no-ops. Pending or unconverted assets preserve their existing placeholder and their setter safely no-ops. The API accepts raw LVGL source pointers only: it does not introduce asset-ID, filesystem-path or runtime conversion lookup. Image conversion and asset generation remain unchanged, and no hook exists.

### Box

`Box` remains the presentation/layout container and owns runtime visibility only. Non-root generated Boxes retain their native object and visibility state and expose `FG_Set_<Name>_Visible(bool visible)`. The setter suppresses unchanged state and uses the native hidden flag. Root screen Boxes are excluded, children remain attached to the retained Box, and no hook exists. Geometry, style, layout and scrolling remain serialized.

### IconButton

`IconButton` is an interactive native button, distinct from presentation-only Icon. It retains the button and enabled state, exposes `FG_Set_<Name>_Enabled(bool enabled)`, and invokes `FG_On_<Name>_Clicked(void)` only for genuine enabled clicks. Creation and setter calls are silent; disabled IconButtons do not fire hooks. Canvas remains selectable, draggable and resizable, while Browser Preview supplies temporary pressed feedback without project mutation. Icon selection remains serialized and no runtime icon replacement API exists; Image exclusively owns source swapping.

### Slider Canvas interaction

Slider Canvas behavior was repaired without changing generated LVGL or claiming a completed runtime API. Track/thumb interaction changes temporary preview value, surrounding Canvas interaction can move the component, and project JSON is not mutated. Browser Preview remains interactive with temporary local state. A Slider setter and genuine-user hook remain a separate future runtime pass.

### Scale

Scale is the LVGL 9 `lv_scale` widget and is currently only a visual ruler/tick renderer. Its hardcoded export is range `0..100`, 11 total ticks, a major tick every 2 ticks, horizontal-bottom mode and labels below the scale. It owns no current value, receives no value event, retains no runtime object after creation, and generates no API or hook. No runtime API was added because a setter would invent semantics unsupported by LVGL. Runtime value APIs belong on value-owning controls such as Slider, Arc or Meter.

### Line

Line is serialized as `Line`, remains presentation-only and API-free, and continues to export native LVGL `lv_line`. Its persisted endpoint properties are `startX`, `startY`, `endX` and `endY`, relative to the Line origin.

Selected Canvas Lines expose draggable start/end handles. Endpoint dragging redraws immediately, rebases `x` / `y`, recalculates `w` / `h` and preserves relative endpoint coordinates. The existing wrapper continues to own whole-component movement. The Inspector exposes the four endpoint coordinates and Line Width. Canvas and Browser Preview share the endpoint-aware renderer.

Generated LVGL emits the stored endpoints through `lv_line_set_points()`. Legacy projects without endpoint properties resolve to start `(0,0)` and end `(width,height)`. Horizontal, vertical, 45-degree, crossed and arbitrary-angle lines are supported. Shift snapping is not implemented. Line consumes semantic `surfaceBorder`. Physical proof remains pending.

### Icon runtime decision

The standard `Icon` component is a Studio-only authoring convenience that provides the built-in icon picker. At export it becomes a normal LVGL `lv_image` backed by the existing generated image symbol; it does not form a separate runtime component family.

Icon owns no runtime state and intentionally generates neither a public setter nor a developer hook. Adding `FG_Set_<Icon_Name>_Source(...)` would duplicate the Standard Image runtime without adding capability. Developers who require runtime image changes must use the standard `Image` component and its `FG_Set_<Image_Name>_Source(const void * src)` API. Icon should not be used for runtime image swapping.

### Divider runtime decision

The standard `Divider` is a presentation-only visual separator. It owns no runtime state and intentionally generates neither a public API nor a developer hook.

Application code should control the visibility of the layout region containing a Divider rather than treating the Divider as an independent runtime component. When dynamic appearance or disappearance is required, place it in an appropriate parent `Box` and call `FG_Set_<Parent_Box_Name>_Visible(bool visible)`.

### Standard Text Presentation

Button, Text and Heading now have real serialized visible-text properties. These are editor and export presentation properties, not runtime state APIs.

#### Button Text

- Property: `buttonText`
- Default: `"Button text"`
- Inspector field: Button Text
- Canvas Preview, Browser Preview, live `/export` and standalone `/export-idf-project` use the saved value.
- Project JSON persists the value, while component naming remains independent from displayed text.
- Legacy projects recover existing child text before falling back to `"Button text"`.
- Generated C strings are escaped safely.
- No runtime API or `95_UserEvents` hook was added.

#### Text Value

- Property: `textValue`
- Default: `"Text value"`
- Inspector field: Text Value
- Canvas Preview and Browser Preview use the shared Standard Text renderer; live and standalone export use the saved value.
- Empty text is valid, and component naming remains independent from displayed text.
- Legacy `children`, `text` and `value` fields are supported.
- The default semantic role is `textPrimary`; legacy literal white does not override the active semantic theme by default.
- Generated LVGL explicitly applies the resolved colour with `lv_obj_set_style_text_color(...)`.
- Serialized content, `x` / `y` / `w` / `h`, font size, alignment and wrapping are preserved.
- Browser Preview polish uses top-left alignment and the current serialized/default size without preview-only centring.
- Non-default custom-theme tests prove `textPrimary` reaches Canvas, Browser Preview and exporter output.
- Shared C escaping handles backslashes, quotes, newlines, carriage returns and tabs.
- No runtime API or `95_UserEvents` hook was added.
- Physical theme confirmation remains pending final flash.

#### Heading Text

- Property: `headingText`
- Default: `"Heading title"`
- Inspector field: Heading Text
- Canvas Preview and Browser Preview use the shared Standard Heading renderer; live and standalone export use the saved value.
- Component naming remains independent from displayed text.
- Legacy `children`, `text` and `value` fields are supported.
- The default semantic role is `textPrimary`; legacy literal white does not override the active semantic theme by default.
- Generated LVGL explicitly applies the resolved text colour.
- Serialized content, `x` / `y` / `w` / `h`, size, weight and alignment are preserved.
- Browser Preview polish uses top-left alignment, stronger visual hierarchy and no preview-only centring.
- Non-default custom-theme tests prove `textPrimary` reaches Canvas, Browser Preview and exporter output.
- Safe C-string escaping remains shared.
- No runtime API or `95_UserEvents` hook was added.
- Physical theme confirmation remains pending final flash.

### Standard Wi-Fi Status Presentation

Standard Wi-Fi remains presentation driven by the existing runtime polling and status mappings. No new Wi-Fi behaviour or runtime API was introduced. The established failed/disconnected display format is:

```text
WIFI
WIFI_FAIL
IP: -
```

Canvas and Browser Preview use the same three-line text structure inside the serialized component bounds. The restored structure prevents status wrapping and clipping while retaining semantic theme colours. Runtime ownership remains with `fg_wifi_status_text()` and the existing polling path. Physical confirmation remains pending final regeneration and flash.

### Clock Presentation

Clock is serialized as `Clock` and differs from ordinary serialized text. Its presentation properties are:

```ts
hourFormat: '24' | '12'
showSeconds: boolean
blinkSeparator: boolean
```

Defaults are 24-hour format, seconds hidden and separator blinking enabled. Displayed time remains runtime state: there is no editable Clock Time field. Persisted `children: "12:34"` is only a legacy preview/startup placeholder.

The live value comes exclusively from the RTC/system-time runtime, and generated code reads time fields through `fg_rtc_get()`. Canvas Preview and Browser Preview use live browser time and respect all three presentation properties. Live and standalone export share the same settings and support `HH:MM`, `HH:MM:SS`, `hh:MM AM/PM` and `hh:MM:SS AM/PM`. Blinking affects separator characters only; separators remain visible when blinking is disabled.

Each generated Clock retains its own `lv_obj_t *` label, `lv_timer_t *` timer, separator-visible state and update callback. Duplicate names receive deterministic `_2` identifiers, so multiple Clocks can use different formats simultaneously. Immediate startup update and the one-second timer update are retained.

No timezone feature, RTC setter, `FG_Set_Clock_Time` API or `FG_On_Clock_Changed` hook was added.

### Validation Record

- The eleven-component Standard theme/parity regression reached 158/158.
- Graphite/orange, Cyber teal and Nordic light were verified across the shared semantic theme pipeline.
- Custom palette export was verified.
- Theme parity was physically reviewed through Canvas, Browser Preview, generated LVGL and ESP32-P4.
- Parity/export tests, three-theme verification, TypeScript, ESP-IDF 5.5.4, LVGL 9.2.2, firmware build, firmware flash, physical ESP32-P4 review and `git diff --check` passed for the eleven-component group.
- Focused Input, Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box and IconButton suites passed.
- The complete exporter regression reached 212/212 after IconButton.
- The Canvas regression suite reached 51/51 in the later Standard Runtime passes.
- Generated API and `95_UserEvents` preservation tests reached 33/33 after IconButton.
- Live and standalone hook generation and developer-body preservation tests passed for the new interactive components.
- TypeScript validation, `export-server.js` syntax and `git diff --check` passed.
- Earlier Standard Runtime milestones also validated live `/export`, standalone `/export-idf-project` and ESP-IDF 5.5.4 builds. Generated firmware was not manually patched.
- Existing developer-written hook bodies remain preserved while only missing declarations and stubs are appended.
- The full export-server suite can still report one unrelated fixture failure when `fg_upload_1024x600_neural_core_67dd4ba0.c` and `fg_upload_carbon_fiber_be774fd2.c` are already absent. The full suite is not claimed as passing in that state, and the export safety boundary remains intact.
- Physical proof is limited to the explicitly named eleven-component group; no physical claim is made here for later Standard controls.

## Built-in System Interface

### Architecture

The System Interface is a reusable built-in platform layer. It is intentionally separate from:

- Interactive Assets
- user project screens
- generated user callbacks

It is generated alongside the user's application without becoming part of the project component tree or the Interactive Asset registry. System-owned controls use internal navigation and hardware callbacks rather than generating `FG_On_*` user hooks.

Studio and Browser Preview share a typed System page and session-state model through:

```text
ForgeUISystemPage
├── launcher
├── brightness
├── wifi
├── bluetooth
├── sound
├── storage
├── device
└── diagnostics
```

Launcher, Brightness, the complete Wi-Fi Manager and Storage Browser are implemented and physically proven. The shared System Runtime owns Browser Preview parity for the Wi-Fi workflow and Storage parity polish, while the generated LVGL runtime owns the physical pages, password dialog, reusable native keyboard, network interaction, connected details and Storage workflow. The Hosted backend supplies live scan results through the complete Hosted scan pipeline into the generated LVGL interface, together with connection, RSSI, security, gateway and saved-network data, without changing the separation between System Runtime and Hosted Connectivity Runtime. The Storage backend supplies bounded SD status, directory and operation results without changing the separation between System Runtime and Storage Runtime. Only Browser Preview / Canvas parity polish remains for Storage. Bluetooth, Sound, Device and Diagnostics remain visible future page identifiers and disabled launcher placeholders, and their system functions are not implemented.

The shared provider owns the active System page, open and back navigation, current-session brightness and the Browser Preview Wi-Fi workflow state. The shared surface renders the same built-in interface over the Studio Canvas and Browser Preview while keeping normal project components separate.

### LVGL runtime

Generated LVGL creates:

- one persistent application container
- one System launcher container
- one Brightness container
- one Wi-Fi Manager container
- one persistent Storage container, created lazily and reused
- one reusable top-layer native LVGL keyboard, created lazily when a System dialog requires text entry

The current hardware-safe navigation implementation uses immediate container visibility switching. It does not recreate screens, project widgets or Interactive Assets. Existing Interactive Assets remain instantiated and retain their state while the System Interface is open, then continue working after return to the application.

The generated gear launcher and System controls use internal LVGL event callbacks. The Brightness slider listens for live value changes, clamps the value to `10–100`, updates its percentage label and calls the Waveshare BSP through the generated internal `FG_Set_Display_Brightness()` wrapper and `bsp_display_brightness_set()`. Brightness is session-only and is not persisted.

The generated Wi-Fi Manager owns its System page, scan list, selection state, password and forget dialogs, connected details and internal Wi-Fi callbacks. The Hosted backend remains the source of live network and connection data and supplies live AP results through the complete Hosted scan pipeline into the generated LVGL interface. The generated native `lv_keyboard` is created lazily on the LVGL top layer, retained as one reusable instance, attached through `lv_keyboard_set_textarea()`, and detached and hidden after Done or Cancel. It supports password entry, show/hide password, correct physical geometry, ForgeUI styling and Browser Preview parity without introducing generated user hooks. This reusable architecture is intended for future Device settings, MQTT, Ethernet, Bluetooth, API keys, Device naming, Login and other System dialogs; those future uses are not claimed as implemented or physically proven.

The generated Storage Runtime owns one lazily created persistent Storage container, page reuse, an eight-row reusable pool, paging, Storage navigation, status projection, Refresh, Read / Write Test, Select Item mode and the Delete Empty Folder workflow. The Storage backend remains in `40_SD.c/.h`; generated LVGL owns presentation and user intent only.

## Storage Runtime

The physically proven Storage Runtime uses:

- SDMMC Slot 0
- lazy page construction
- deferred worker
- bounded request model
- bounded eight-row pool
- page reuse
- Refresh
- Read / Write Test
- directory browsing
- folder navigation
- Select Item mode
- Delete Empty Folder
- no recursive deletion
- no full format
- no multi-select
- no rename
- no mount / unmount

File deletion, recursive deletion, full format, multi-select, rename, New Folder and mount / unmount remain future work and are not claimed as implemented or physically proven.

## Hosted Wi-Fi Recovery

The original ForgeUI-P4 Hosted Wi-Fi architecture has been recovered and physically proven:

```text
ESP32-P4
    │
Hosted SDIO
    │
SDMMC Slot 1
GPIO18/19
GPIO14-17
Reset GPIO54
    │
ESP32-C6
    │
Wi-Fi Remote
    │
ESP-IDF Wi-Fi API
```

The previous SPI Hosted configuration was incorrect for this hardware and prevented the Hosted transport from establishing. Restoring the SDIO Host Interface on SDMMC Slot 1 restored the intended transport.

The recovered Hosted backend now drives the complete built-in Wi-Fi Manager UI, including hosted scanning, AP retrieval, live network list population, selection, connection workflow, live RSSI, security, gateway, saved-network state and connected details. This extends the proven use of the existing Hosted service without changing its transport architecture, SDIO ownership or startup baseline.

## SD Coexistence

The physically proven coexistence architecture is:

```text
Hosted Wi-Fi
→ SDMMC Slot 1

SD Card
→ SDMMC Slot 0
```

The SD Card continues to use the BSP SD pins on GPIO39–44, 4-bit SDMMC, manual LDO control and the FAT filesystem. No SD runtime changes were required.

## Proven Boot Order

The physically proven startup sequence is:

```text
NVS
Display
UI
RTC
fg_wifi_init()
2500 ms delay
fg_sd_init()
fg_sd_test()
```

This ordering remains the stable baseline.

## Hosted Configuration Baseline

The recovered Hosted baseline is:

- SDIO Host Interface
- SDMMC Slot 1
- 4-bit
- 40000 kHz
- GPIO18
- GPIO19
- GPIO14
- GPIO15
- GPIO16
- GPIO17
- Reset GPIO54
- active-high reset
- 1500 ms reset delay
- reset every boot
- restart transport on failure

The associated platform baseline is:

- PSRAM XIP disabled
- ESP-IDF 5.5.4
- esp_hosted 2.9.7
- esp_wifi_remote 1.3.0
- Waveshare BSP 1.0.2

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

## Direct Creator Workflow

Interactive Button, Interactive Toggle Switch, Interactive Three-Position Toggle Switch, Interactive Light and Interactive Status Indicator all share a direct Creator workflow in addition to the Interactive Assets panel.

- Canvas right-click exposes the type-specific `Open Creator` action.
- Configured components reopen the exact asset referenced by `interactiveAssetId`.
- Unconfigured components open a fresh unsaved draft.
- Opening a Creator never automatically creates, registers, saves or assigns an asset.
- A private ForgeUI navigation dispatcher carries type-scoped requests into the shared AI Studio portal.
- Button, Toggle, Light, Status Indicator and Three-Position edit requests remain separate so one Creator cannot consume another type's request. Wrong-kind asset IDs are rejected.
- The portal replaces the current Creator view rather than stacking duplicate creation surfaces.
- Outside-click and Escape dismiss the Canvas context menu.
- Inspector onboarding cards provide the same direct route when required state visuals are missing.
- Navigation requests are cleared after consumption so stale requests cannot reopen another workflow.
- `ForgeAIPanel` recognizes every direct Creator target and opens the Interactive tab rather than leaving the shared portal in Layout.

Current navigation targets include:

```text
interactive-button-designer
interactive-toggle-switch-designer
interactive-light-designer
interactive-status-indicator-designer
interactive-three-position-toggle-designer
```

For Interactive Status Indicator specifically, Canvas right-click exposes `Open Status Indicator Creator`. Configured components reopen the exact Status Indicator referenced by `interactiveAssetId`; unconfigured components open a fresh unsaved Status Indicator draft. Opening that draft does not create, register, save or assign an asset.

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
- Shared selection-border resizing with eight edge and corner zones
- Shared continuous Canvas boundary clamping and live Inspector geometry updates
- Shared intrinsic-dimension and alpha-bound measurement
- Stable union resolution for the four two-state sets: Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON
- The compatible three-state LEFT/CENTER/RIGHT union path for Three-Position Toggle
- Shared linked crop generation with preserved original uploads
- Same-size fitted state crops, inactive-state preload and duplicate-write suppression
- Same-ID artwork replacement invalidation so stale measurement readiness is cleared
- Shared legacy image-dimension recovery
- Shared Browser Preview wrappers that preserve final component geometry
- Shared contain-fit LVGL scaling through registry, PNG IHDR and LVGL descriptor dimensions
- Registry-driven configured and unconfigured preview refresh
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

Canvas components store an `interactiveAssetId`. Fresh placeholders may adopt newly created asset dimensions during assignment; existing configured components preserve their geometry. After placement, component geometry is authoritative for Canvas, Browser Preview and LVGL export. On reload, the Interactive Asset registry and uploaded-asset registry restore the records required for Canvas and export resolution.

Visible-artwork fitting is a reusable N-state union operation over the states supplied by an implemented asset type. It does not imply that arbitrary future controls are implemented. Measurement updates are deduplicated, uploaded-asset registry changes rerender previews and Inspector helpers without reselection, and generated LVGL images use centred contain-fit scaling against final component geometry.

## Interactive Button

Interactive Button uses `kind: button` and `interactionMode: momentary`. Its uploaded state-image references are:

- `normalAssetId`
- `pressedAssetId`

### Studio behavior

- AI generates Normal and Pressed images.
- Generated results map to `normalAssetId` and `pressedAssetId`.
- New drafts use consistent `200 × 100` creation dimensions and the lowest available normalized Label sequence: `Button 1`, `Button 2`, `Button 3`, and onward.
- Duplicate public callback validation is grouped by generated callback, retains component IDs as secondary diagnostics, and identifies every conflicting Button.
- The Inspector displays the live generated callback and an inline duplicate warning while the controlling Label conflicts.
- Canvas preview displays Pressed while held and returns to Normal on release.
- The asset can be assigned to an `InteractiveButton` Canvas component.
- Assignment writes `interactiveAssetId`; component geometry remains authoritative after placement and is preserved during asset replacement.
- Assignment persists across Studio restart.
- Selected Buttons use the shared selection border with eight edge and corner resize zones, continuous Canvas clamping and live Inspector geometry updates.
- Interactive Asset registry updates replace configured and unconfigured previews immediately; assignment unmounts the placeholder instead of layering previews.
- `Fit Bounds to Visible Artwork` measures transparent padding, creates one stable Normal/Pressed union crop, links new cropped assets and preserves the original uploads.
- Visible-bounds fitting is idempotent.
- Legacy artwork dimensions recover through registry metadata, PNG IHDR and generated LVGL descriptors.

### LVGL runtime behavior

The exporter creates a parent LVGL button object and a child LVGL image object:

- `LV_EVENT_PRESSED` changes to the Pressed image.
- `LV_EVENT_RELEASED` and `LV_EVENT_PRESS_LOST` restore the Normal image.
- `LV_EVENT_CLICKED` calls the generated developer hook.
- The child image uses a shared Normal/Pressed contain-fit scale derived from final component geometry and remains centred.

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
- Direct Creator access is available from Canvas and Inspector onboarding.
- Configured components reopen the exact linked Toggle asset; unconfigured components start a fresh draft.
- The direct designer can generate a paired OFF/ON set through the shared image pipeline.
- The Toggle State Sheet Builder can instead create one combined OFF/ON source, crop two linked regions and return both visuals to the Toggle draft.
- Creator and State Sheet results update the draft only; Save and `Use on Selected` remain explicit.
- The asset, artwork references and initial state persist through the existing Interactive Asset store.
- Live preview and Canvas preview retain the selected binary state until toggled again.
- Browser Preview uses the same OFF / ON artwork and interaction model.
- The asset can be assigned to an `InteractiveToggleSwitch` Canvas component.
- Use on Selected writes `interactiveAssetId` and propagates width and height.
- The Inspector keeps a compact configured helper above Position Mode, reopens the exact linked Toggle asset, and provides explicit visible-artwork fitting and recovery guidance.
- OFF and ON intrinsic dimensions and alpha bounds are recorded through the uploaded-asset registry; registry changes refresh the helper without reselection.
- `Fit Bounds to Visible Artwork` creates one stable OFF/ON union crop, preserves the originals, links same-size fitted assets and is idempotent.
- Selected configured and unconfigured Toggles use the shared cyan selection border with four edge and four corner resize zones, continuous Canvas clamping and live Inspector geometry.
- Component geometry remains authoritative; Canvas preview artwork scales continuously with centred contain-fit behavior and generated LVGL uses the same final component bounds.

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

- The designer retains manual LEFT, CENTER and RIGHT artwork selectors and the selectable initial state.
- `Create Three-Position Toggle Set` replaces the generic Generate action for this asset type.
- One `three-position-set` request produces a master State Sheet with exactly three horizontal state rows.
- LEFT, CENTER and RIGHT crops become three separate uploaded asset IDs.
- The generated set updates the draft only; it does not automatically save, register the Interactive Asset or assign it to Canvas.
- Direct Creator access is available from Canvas and Inspector onboarding.
- Configured components reopen the exact linked asset; unconfigured components open a fresh draft.
- The responsive unconfigured placeholder scales with the component and switches to compact icon-only presentation at small sizes.
- Initial state is selectable as LEFT, CENTER or RIGHT.
- Live preview responds across the entire rectangular width.
- A designer-only `LEFT | CENTER | RIGHT` overlay makes the three touch zones visible without modifying exported artwork.
- Canvas and Browser Preview divide the configured bounds into direct left, center and right thirds.
- Use on Selected writes `interactiveAssetId` and propagates width and height.
- Artwork references and initial state persist through the existing Interactive Asset store.
- The Inspector keeps a compact configured helper above Position Mode, reopens the exact linked Three-Position asset, and provides explicit visible-artwork fitting and recovery guidance.
- LEFT, CENTER and RIGHT intrinsic dimensions and alpha bounds are recorded through the uploaded-asset registry; registry updates rerender the helper without reselection.
- Visible-artwork fitting builds one compatible three-state union crop, preserves all originals, links same-size fitted state assets and is idempotent.
- Selected configured and unconfigured components use the shared cyan selection border with four edge and four corner resize zones, continuous Canvas clamping and live Inspector geometry.
- Component geometry is authoritative; Canvas preview and generated LVGL keep LEFT/CENTER/RIGHT artwork centred and continuously contain-fit inside the final bounds.

Live generation flow:

```text
Prompt
  -> Create Three-Position Toggle Set
  -> one master State Sheet
  -> crop workspace
  -> LEFT / CENTER / RIGHT linked crop regions
  -> optional row remapping
  -> Confirm Crops
  -> preprocessing and LVGL conversion
  -> atomic uploaded-asset registration
  -> update draft
  -> Save
  -> assign to Canvas
```

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

### Studio behavior

- Canvas right-click and Inspector onboarding open the direct Light Creator through `interactive-light-designer`.
- Configured components reopen the exact linked Light asset; unconfigured components receive a fresh unsaved draft.
- The configured Inspector helper remains visible after assignment and `Open Light Creator` reopens the exact linked asset.
- The responsive empty state uses a lamp/indicator SVG with compact icon-only presentation at small dimensions.
- Larger empty states show OFF and ON hints.
- The unselected placeholder is near-white, the selected component is cyan, and the active indicator uses muted green.
- Inspector onboarding guidance appears when the Interactive Asset or either uploaded visual is missing; configured Lights retain a compact helper above geometry fields.
- Save and assignment remain explicit; opening the Creator does not mutate the registry or Canvas.
- Fresh placeholders adopt newly created asset dimensions; existing configured Lights preserve their geometry.
- Selected Lights use the shared selection border, continuous Canvas clamping and live Inspector geometry updates.
- Component geometry is authoritative after placement, and configured or unconfigured preview state refreshes with same-ID registry updates.
- `Fit Bounds to Visible Artwork` measures OFF/ON alpha bounds, creates one stable union crop, links both cropped assets and preserves the original uploads.
- Visible-bounds fitting is idempotent and keeps OFF/ON state changes inside stable component bounds.

## Binary Output Runtime

Interactive Light and Interactive Status Indicator now share one generated Binary Output Runtime.

The generated runtime owns:

- `fg_binary_output_t`
- `fg_binary_output_set()`

Both Interactive Asset types generate independent runtime records while reusing the same implementation.

Interactive Light and Interactive Status Indicator use the exact same exported geometry path: a transparent component-sized LVGL container and a centred child image in the shared runtime record. OFF and ON use one contain-fit scale derived from final component geometry, supporting both upscaling and downscaling while preserving aspect ratio. Dimension resolution follows uploaded-asset registry metadata, PNG IHDR data and generated `lv_image_dsc_t` descriptors, with scale 256 used only when no reliable dimensions remain. The previous legacy Status Indicator direct-image export path has been removed. This design-time geometry and fitting parity does not change the Binary Output direction: both controls remain non-clickable and application-controlled through `FG_Set_*`.

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

The Interactive Status Indicator remains setter-only and does not generate user hooks; this is separate from the standard `Led` component and its changed hook.

Application code controls state entirely through the generated public API.

### Studio behavior

- AI generates OFF and ON images.
- Generated results map to `offAssetId` and `onAssetId`.
- Direct Canvas right-click exposes `Open Status Indicator Creator`.
- Configured components reopen their exact linked Status Indicator asset; unconfigured components open a fresh unsaved draft.
- Inspector onboarding provides the same Creator route when no Status Indicator asset is assigned; incomplete or missing references retain repair and recovery guidance.
- Configured components retain a compact Inspector helper above Position Mode with the linked asset name, initial state, OFF/ON summary, exact Creator reopening and `Fit Bounds to Visible Artwork`.
- An unconfigured component uses a responsive binary-output SVG placeholder: compact controls use icon-only mode, while larger controls show OFF / ON hints.
- Placeholder styling follows the Interactive Asset family with near-white unselected artwork, cyan selected artwork and a muted-green active indicator.
- New Status Indicators drop at `120 × 72`, replacing the previous shared `32 × 32` drop default so the component is immediately visible and selectable before artwork is assigned.
- OFF and ON intrinsic dimensions and alpha bounds are recorded automatically through the uploaded-asset registry; registry updates rerender the helper without reselection and same-ID replacement clears stale readiness.
- `Fit Bounds to Visible Artwork` builds one stable OFF/ON union crop, preserves original uploads, creates linked same-size fitted assets and reports an already-fitted idempotent state.
- Selected configured and unconfigured Status Indicators use the shared cyan selection border with four edge and four corner hit zones, continuous Canvas clamping and live Inspector geometry.
- Browser Preview and Canvas Preview use the same centered contain-fit renderer, with final component width and height controlling continuous artwork scaling rather than imposing intrinsic dimensions as a maximum.
- Intrinsic artwork aspect ratio is preserved: square artwork remains square and non-square artwork is not stretched to fill width and height independently.
- Browser Preview wrappers use the saved component bounds, making Browser Preview geometry equivalent to Canvas geometry.
- Canvas click toggles a temporary preview state.
- Preview toggling is local visual verification only; it does not mutate the saved initial state, persistence or exported firmware.
- The asset can be assigned to an `InteractiveStatusIndicator` Canvas component.
- Assignment writes `interactiveAssetId` and propagates width and height.
- Assignment persists across Studio restart.
- Resizing preserves selection and component identity and does not toggle the temporary Canvas OFF/ON state; ordinary Canvas clicks continue to toggle only the local design-time preview.

### LVGL runtime behavior

Interactive Status Indicator exports through the same Binary Output geometry path as Interactive Light. A transparent container owns the final component position and size, while a centred child image uses one OFF/ON contain-fit scale that supports both upscaling and downscaling without stretching. Component geometry remains authoritative across Canvas Preview, Browser Preview and generated LVGL output. Its initial source uses the saved `initialState`.

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

- direct paired generation uses `light-off` and `light-on`
- the Toggle State Sheet Builder uses one combined OFF/ON source artwork

Three-Position generation modes:

- active Creator request: `three-position-set`
- one master generated image
- three LEFT/CENTER/RIGHT crops derived from that master

The older `three-position-left`, `three-position-center` and `three-position-right` requests remain accepted by the lower-level API for compatibility, but the active Three-Position Creator no longer uses three independent generation calls.

Light generation modes:

- `light-off`
- `light-on`

Status Indicator generation modes:

- `light-off`
- `light-on`

The type-specific differences are prompt mode, prompt template, filename prefix, State Sheet handling, and result-to-state mapping. The selected parent asset kind determines the active workflow.

```text
Button paired generation: first → normalAssetId, second → pressedAssetId
Toggle direct paired generation: first → offAssetId, second → onAssetId
Toggle State Sheet Builder: one OFF/ON source → two linked crops → offAssetId / onAssetId
Three Position: one LEFT/CENTER/RIGHT master → three linked crops → leftAssetId / centerAssetId / rightAssetId
Light: first → offAssetId, second → onAssetId
Status Indicator: first → offAssetId, second → onAssetId
```

## State Sheet Generation and Crop Architecture

The standard Toggle State Sheet Builder and Three-Position Creator reuse `StateSheetOverlay` while retaining workflow-specific state counts.

Standard Toggle uses one combined OFF/ON source with two independently positioned crop regions and a shared crop width and height. The resulting OFF and ON assets return to the Toggle draft.

Three-Position uses one master image and three crop rectangles:

- LEFT, CENTER and RIGHT retain independent X/Y positions.
- Crop width and height are shared across all three regions.
- Moving one region moves only that region.
- Resizing any region resizes all three, ensuring identical confirmed output dimensions.
- Gaps between AI-generated rows can be excluded by positioning the rectangles explicitly.
- Every region exposes edge and corner handles.
- Confirmation uses the exact crop coordinates rather than inferred row boundaries.

Synchronized Three-Position resizing follows these rules:

- RIGHT or BOTTOM resizing changes the shared dimensions without shifting region origins.
- LEFT or TOP resizing applies the same position delta to every region.
- Corner resizing combines the corresponding horizontal and vertical rules.
- Each region otherwise retains its independent base position.

Default row assignment is `TOP → LEFT`, `MIDDLE → CENTER`, `BOTTOM → RIGHT`. If AI returns states in another order, row-to-state remapping is available before confirmation. Mappings remain unique: changing one row swaps the displaced state, overlay labels update immediately, and remapping changes state assignment without changing crop geometry.

### Image-pipeline safeguards

State Sheet crops use `canvas.toDataURL('image/png')`, ensuring preprocessing receives real PNG Base64 rather than blob-URL text. Three-Position confirmation validates `data:image/png;base64` input and decodes it locally into `image/png` Blobs instead of calling `fetch()` on a data URL; converter requests continue to carry the Base64 data URL.

Three-Position registration is atomic. All three crops are prepared and converted before the Uploaded Asset Registry is mutated. A conversion failure therefore cannot partially register LEFT/CENTER/RIGHT assets, existing draft IDs remain unchanged, and the draft updates only after all three conversions succeed.

## File Ownership

### Generated and replaceable UI output

- `90_Studio_Export.c`
- `90_Studio_Export.h`

Studio regenerates these files. Generated public UI APIs, including Interactive Light setters, are declared in `90_Studio_Export.h` and implemented in `90_Studio_Export.c`. Permanent developer application logic must not be placed in them.

### User event hook layer

- `95_UserEvents.c`
- `95_UserEvents.h`

Studio creates these files for live Studio firmware and standalone export. In live firmware, the exporter merges the required declarations and stubs: matching developer-written function bodies are preserved, missing hooks are appended, and unrelated existing hooks are not deleted. After a standalone project is exported, its copies become the developer-owned hook and application-logic layer. Developers add GPIO, I/O, hardware actions and product behavior to the standalone project's `95_UserEvents.c` while preserving generated hook names.

Interactive Button click hooks, Interactive Toggle Switch toggled hooks and Interactive Three-Position Toggle changed hooks cross into this layer. Interactive Light and Interactive Status Indicator remain setter-only Binary Output Runtime controls and do not create `95_UserEvents` hooks. Separately, interactive Standard LVGL controls use generated hooks for genuine user interaction. Their programmatic setters are guarded and silent; setter-generated LVGL events do not cross into developer code.

Examples include:

```c
void FG_On_Tab_View_Changed(uint32_t tab_index);
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
void FG_On_Search_Input_Changed(const char * text);
void FG_On_Notes_Textarea_Changed(const char * text);
void FG_On_Enable_WiFi_Switch_Changed(bool checked);
void FG_On_Enable_Logging_Checkbox_Changed(bool checked);
void FG_On_Automatic_Mode_Radio_Changed(bool selected);
void FG_On_Target_Number_Input_Changed(int32_t value);
void FG_On_Mode_Select_Changed(uint32_t index, const char * text);
void FG_On_Settings_Icon_Button_Clicked(void);
```

Progress, Image and Box are setter-only outputs and add no hooks. Icon, Divider, Scale, Line, Clock, Button Text, Text and Heading are presentation/API-free and also add no `95_UserEvents` declarations. Live `95_UserEvents.c` bodies remain preserved, missing stubs are appended, and existing hooks are not deleted merely because their component is absent from the current Canvas. Standalone copies become developer-owned.

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

### Direct Creator and navigation

- `src/forgeui/ForgeUINavigation.ts`
- `src/components/editor/PreviewContainer.tsx`
- `src/components/inspector/Inspector.tsx`
- `src/components/inspector/InteractiveButtonCreatorHelper.tsx`
- `src/components/inspector/InteractiveToggleCreatorHelper.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`
- `src/forgeui/ai/ForgeAIPanel.tsx` — recognizes direct Creator targets, including Status Indicator, and selects the Interactive tab
- `src/hooks/useDropComponent.ts` — owns the `120 × 72` default Status Indicator Canvas size

### Button

- `src/forgeui/interactive/ForgeUIInteractiveButtonAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveButtonHook.ts`
- `src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveButtonPreview.tsx`
- `src/components/editor/previews/InteractiveButtonCanvasPreview.tsx`

### Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveToggleSwitchAsset.ts`
- `src/forgeui/interactive/InteractiveToggleSwitchPreview.tsx`
- `src/components/editor/previews/InteractiveToggleSwitchCanvasPreview.tsx`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx` — shared binary-artwork designer with type-scoped Toggle, Light and Status Indicator drafts
- `src/forgeui/ai/ForgeAIPanel.tsx` — owns the Toggle State Sheet Builder and returns completed OFF/ON state IDs to the Toggle designer

The current implementation does not introduce a separate `InteractiveToggleSwitchDesigner.tsx`. Toggle retains its own direct navigation target, draft requests, State Sheet handoff, asset model, preview and generated Toggle Input Runtime while reusing the binary-artwork designer.

### Three-Position Toggle Switch

- `src/forgeui/interactive/ForgeUIInteractiveThreePositionToggleAsset.ts`
- `src/forgeui/interactive/InteractiveThreePositionTogglePreview.tsx`
- `src/forgeui/interactive/InteractiveThreePositionToggleDesigner.tsx`
- `src/forgeui/interactive/UnconfiguredThreePositionTogglePlaceholder.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/components/editor/previews/InteractiveThreePositionToggleCanvasPreview.tsx`

### Light

- `src/forgeui/interactive/ForgeUIInteractiveLightAsset.ts`
- `src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`
- `src/forgeui/interactive/InteractiveLightDesigner.tsx`
- `src/forgeui/interactive/InteractiveLightPreview.tsx`
- `src/forgeui/interactive/UnconfiguredLightPlaceholder.tsx`
- `src/components/editor/previews/InteractiveLightCanvasPreview.tsx`

### Shared visible bounds and Canvas geometry

- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`
- `src/forgeui/interactive/ForgeUITwoStateVisibleBounds.test.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.ts`
- `src/forgeui/ForgeUIUploadedAssetRegistry.test.ts`
- `src/components/editor/PreviewContainer.tsx`
- `src/components/editor/ComponentPreview.tsx`
- `src/components/editor/ComponentPreview.test.tsx`
- `src/components/editor/InteractiveToggleSwitchCanvasResize.test.tsx`
- `src/components/editor/InteractiveStatusIndicatorCanvasResize.test.tsx`
- `src/components/editor/InteractiveThreePositionToggleCanvasResize.test.tsx`

### Status Indicator

- `src/forgeui/interactive/ForgeUIInteractiveStatusIndicatorAsset.ts`
- `src/forgeui/interactive/UnconfiguredStatusIndicatorPlaceholder.tsx`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.tsx`
- `src/forgeui/interactive/InteractiveStatusIndicatorPreview.test.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.tsx`
- `src/components/editor/previews/InteractiveStatusIndicatorCanvasPreview.test.tsx`

### Configured Inspector helpers

- `src/components/inspector/InteractiveButtonCreatorHelper.tsx`
- `src/components/inspector/InteractiveToggleCreatorHelper.tsx`
- `src/components/inspector/InteractiveLightCreatorHelper.tsx`
- `src/components/inspector/InteractiveStatusIndicatorCreatorHelper.tsx`
- `src/components/inspector/InteractiveThreePositionToggleCreatorHelper.tsx`

### Shared UI and AI

- `src/forgeui/interactive/ForgeUIInteractiveAssetPanel.tsx`
- `src/forgeui/interactive/InteractiveAssetAIGenerator.tsx`
- `src/forgeui/ai/StateSheetOverlay.tsx`
- `src/forgeui/ai/ForgeUIAIImagePipeline.ts`
- `src/pages/api/forgeui-ai-hero.ts`

### Built-in System Interface

- `src/forgeui/system/`
- `src/forgeui/system/ForgeUISystemContext.tsx` — typed page navigation, current-session brightness and Browser Preview Wi-Fi workflow state
- `src/forgeui/system/ForgeUISystemSurface.tsx` — shared Studio Canvas and Browser Preview System surface
- `src/forgeui/system/ForgeUIWifiPage.tsx` — complete Browser Preview Wi-Fi Manager surface, password workflow and connected details
- `src/forgeui/system/ForgeUISystemSurface.test.tsx`
- `src/forgeui/system/index.ts`
- `src/pages/_app.tsx` — owns the shared System provider boundary
- `src/components/editor/Editor.tsx` — hosts the System surface at the Studio device boundary
- `src/forgeui/preview/DevicePreview.tsx` — hosts the same System surface at the Browser Preview device boundary

### Exporter

- `src/forgeui/ForgeUILvglExport.ts`
- `src/forgeui/ForgeUILvglExport.system.test.ts`
- `src/forgeui/ForgeUILvglExport.led.test.ts`
- `src/forgeui/ForgeUILvglExport.bar.test.ts`
- `src/forgeui/ForgeUILvglExport.arc.test.ts`
- `src/forgeui/ForgeUILvglExport.chart.test.ts`
- `src/forgeui/ForgeUILvglExport.keyboard.test.ts`
- `src/forgeui/ForgeUILvglExport.calendar.test.ts`
- `src/forgeui/ForgeUILvglExport.roller.test.ts`
- `src/forgeui/ForgeUILvglExport.msgbox.test.ts`
- `src/forgeui/ForgeUILvglExport.buttonmatrix.test.ts`
- `src/forgeui/ForgeUILvglExport.tabview.test.ts`
- `src/forgeui/ForgeUILvglExport.tileview.test.ts`
- `src/forgeui/ForgeUILvglExport.button.test.ts`
- `src/forgeui/ForgeUILvglExport.text.test.ts`
- `src/forgeui/ForgeUILvglExport.heading.test.ts`
- `src/forgeui/ForgeUILvglExport.clock.test.ts`
- `src/forgeui/ForgeUILvglExport.input.test.ts`
- `src/forgeui/ForgeUILvglExport.textarea.test.ts`
- `src/forgeui/ForgeUILvglExport.switch.test.ts`
- `src/forgeui/ForgeUILvglExport.checkbox.test.ts`
- `src/forgeui/ForgeUILvglExport.radio.test.ts`
- `src/forgeui/ForgeUILvglExport.progress.test.ts`
- `src/forgeui/ForgeUILvglExport.numberinput.test.ts`
- `src/forgeui/ForgeUILvglExport.select.test.ts`
- `src/forgeui/ForgeUILvglExport.image.test.ts`
- `src/forgeui/ForgeUILvglExport.box.test.ts`
- `src/forgeui/ForgeUILvglExport.iconbutton.test.ts`
- `src/forgeui/preview/StandardSwitchPreview.tsx`
- `src/forgeui/preview/StandardCheckboxPreview.tsx`
- `src/forgeui/preview/StandardRadioPreview.tsx`
- `src/forgeui/preview/StandardSliderPreview.tsx`
- `src/forgeui/preview/StandardNumberInputPreview.tsx`
- `src/forgeui/preview/StandardSelectPreview.tsx`
- `src/forgeui/preview/StandardIconButtonPreview.tsx`
- `src/forgeui/ForgeUIStandardButton.ts`
- `src/forgeui/ForgeUIStandardText.ts`
- `src/forgeui/ForgeUIStandardHeading.ts`
- `src/forgeui/ForgeUIStandardClock.ts`
- `src/components/inspector/panels/components/ButtonPanel.tsx`
- `src/components/inspector/panels/components/StandardTextPanel.tsx`
- `src/components/inspector/panels/components/HeadingPanel.tsx`
- `src/components/inspector/panels/components/ClockPanel.tsx`
- `src/components/editor/previews/ButtonPreview.tsx`
- `src/components/editor/previews/TextPreview.tsx`
- `src/components/editor/previews/HeadingPreview.tsx`
- `src/components/editor/previews/ClockPreview.tsx`
- `export-server.js`
- `export-server.test.js`

The exporter owns shared generated runtime implementations, retained per-instance objects and state, public APIs, transition helpers, LVGL event adapters, generated hook declarations/stubs, deterministic collision-safe names, and built-in System containers and callbacks. Both live `/export` and standalone `/export-idf-project` use this generator through `export-server.js`. `90_Studio_Export.*` remains generated and replaceable; live-firmware `95_UserEvents.*` is preservation-merged, while standalone-export copies become developer-owned. The System Interface does not add generated user-event hooks.

### Standard semantic theme and shared previews

- `src/forgeui/preview/forgeThemeMap.ts`
- `src/forgeui/theme/ForgeThemeContext.tsx`
- `src/forgeui/preview/forgePreviewRenderer.tsx`
- `src/forgeui/preview/StandardChartPreview.tsx`
- `src/forgeui/preview/StandardCalendarPreview.tsx`
- `src/forgeui/preview/StandardScalePreview.tsx`
- `src/forgeui/preview/StandardRollerPreview.tsx`
- `src/forgeui/preview/StandardMessageBoxPreview.tsx`
- `src/forgeui/preview/StandardButtonMatrixPreview.tsx`
- `src/components/editor/previews/BarPreview.tsx`
- `src/components/editor/previews/ArcPreview.tsx`

### Generated firmware

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`

## Physical ESP32-P4 Proof

### Standard LVGL eleven-component theme parity

The following Standard components are physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4.

#### LED

- Runtime setter, hook and silent startup are verified.
- Semantic green is intentionally retained as a status colour independent of decorative theme colours.

#### Bar

- Canvas interaction, Browser Preview, generated LVGL, ESP32-P4, runtime setter and hook are verified.
- Negative and reversed ranges are verified.
- Track uses `surfaceSecondary`, border uses `surfaceBorder`, and indicator uses `accent`.

#### Arc

- Canvas, Browser Preview, generated LVGL, ESP32-P4, runtime setter, hook and silent startup are verified.
- Background arc uses `surfaceSecondary`, indicator uses `accent`, and knob uses `accentText`.

#### Chart

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The native single-series `lv_chart` remains responsible for point count, runtime streaming and runtime clear.
- Parity includes themed surface, border and divisions; responsive gutters; Y-axis labels; X-axis point indexes; non-clickable sibling `lv_label` axis labels; and selected-theme text colours.
- Default Y labels are `100`, `75`, `50`, `25`, `0`.
- Default X labels are `0`, `1`, `2`, `3`, `4`, `5`, `6`.
- Runtime APIs and hooks are unchanged, and startup remains silent.

#### Table

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Surface, cells, grid and primary text are theme-driven.
- No Table runtime API is claimed or invented.

#### Keyboard

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Keyboard surface, keys, borders, pressed and disabled keys, and text are theme-driven.
- Show/Hide APIs and their existing hooks are preserved.

#### Calendar

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The fixed model remains June 2026, Sunday-first, 42 date cells, six weeks, spill dates and today outline.
- Surface, border, `textPrimary`, `textSecondary` and `accent` are theme-driven.

#### Scale

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The model remains horizontal-bottom, `0..100`, 11 ticks, labels and no surrounding panel.
- Ticks use `accent`; labels use `textPrimary`.
- Scale remains API-free.

#### Roller

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The opaque surface, border, normal text, selected row and selected text are theme-driven.
- Selection behavior is unchanged.

#### Message Box

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- The current architecture remains a custom ForgeUI panel with title, body and buttons; it does not use `lv_msgbox_create`.
- Surface, border, text and outlined buttons are theme-driven.
- Show, Close and button hooks are preserved.

#### Button Matrix

- Canvas, Browser Preview, generated LVGL and ESP32-P4 are verified.
- Surface, button surface, border, text, selected state and disabled state are theme-driven.
- Runtime behavior is unchanged.

### Interactive Button

- Normal image displayed physically.
- Pressed image displayed on touch.
- Released state restored the Normal image.
- Physical click was detected and the generated hook was called.
- Resized and visible-bounds-fitted geometry matched Canvas and Browser Preview through generated contain-fit scaling.
- Legacy artwork dimension recovery and centred Normal/Pressed scaling were validated on ESP32-P4.
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
- Resized and visible-bounds-fitted Light geometry matched Canvas and Browser Preview through shared OFF/ON contain-fit scaling.
- Registry, PNG IHDR and LVGL descriptor dimension resolution preserve stable centred generated geometry.
- Firmware remained stable.

### Interactive Toggle Switch

- Studio, persistence, Canvas, Browser Preview, generated Toggle Input Runtime and automated export validation are complete.
- The current Toggle Switch export has been exercised on the physical ESP32-P4.
- OFF/ON state artwork and touch state changes operate through the generated Toggle Input Runtime.
- Resized contain-fit output is not claimed as physically checked unless separately recorded.
- No claim beyond the recorded single-control OFF/ON touch workflow is made here.

### Interactive Three-Position Toggle Switch

- Generated LEFT, CENTER and RIGHT images displayed physically with consistent State Sheet styling.
- The full rectangular control was divided into three touch zones.
- LEFT, CENTER and RIGHT changed correctly on touch.
- The generated `FG_On_ThreePositionToggle_Changed` callback matched the runtime state.
- The user-event hook printed readable LEFT, CENTER and RIGHT values.
- Initial state was applied with notification disabled.
- Runtime remained stable.
- Resized contain-fit output is not claimed as physically checked unless separately recorded.

### Interactive Status Indicator

- Binary OFF/ON output and the generated `FG_Set_*` control path are physically proven within the recorded scope.
- Resized component geometry matches Browser Preview on the physical ESP32-P4.
- Centred contain-fit scaling and correct OFF/ON rendering are physically proven.
- The shared generated Binary Output runtime remained stable through the geometry parity check.

### System Interface

- The generated gear launcher is visible, touch-friendly and physically proven.
- Application-to-System navigation operates through internal LVGL callbacks.
- The System launcher and Display / Brightness page render correctly at `1024 × 600`.
- The live Brightness slider updates its percentage while dragging.
- Brightness physically controls the ESP32-P4 display backlight through `bsp_display_brightness_set()`.
- Brightness remains selected while navigating during the current device session.
- Back navigation returns from Display to System and from System to the existing application.
- Existing Interactive Assets remain alive while System is open and continue working after leaving System.

### Wi-Fi Manager

- The complete generated Wi-Fi Manager workflow is physically proven on the ESP32-P4.
- Scan Networks and Refresh populate and update the live Available Networks list from the Hosted backend.
- Live SSID population, SSID selection, RSSI, security and Connected and Saved markers are physically proven.
- Secured-network selection opens the generated password dialog and attaches the reusable native LVGL keyboard to the password textarea.
- Password entry, show/hide password, Done and Cancel operate with the correct physical geometry and top-layer ownership.
- Connect, Disconnect, Reconnect and Forget Network are physically proven through the complete UI workflow.
- Connected details display the active SSID, IP address, gateway, RSSI and signal quality, security, station MAC, AP BSSID and current status.
- Repeated Hosted scans replace prior results without duplicate rows or stale SSIDs.
- Studio and Browser Preview reproduce the same navigation, password, connection and connected-details workflow without taking ownership away from the generated LVGL System Runtime.
- Existing Interactive Assets and System navigation remain alive and stable throughout Wi-Fi interaction.
- Minor visual polish remains.

### Storage Browser

- The lazily created Storage page opens and is reused without boot or navigation regression.
- SD status and capacity display are physically proven.
- Root browsing, folder browsing and parent navigation are physically proven.
- Previous / Next paging is physically proven.
- Refresh and Read / Write Test are physically proven.
- Select Item mode selects one directory without changing normal folder navigation.
- Delete Empty Folder is physically proven through the lazy confirmation workflow.
- Hosted Wi-Fi remains alive during Storage use.
- Repeated Storage opening, browsing, Refresh and operation use do not regress the System Runtime.
- File deletion, rename, formatting, mount / unmount and recursive deletion are not claimed as implemented or physically proven.

### Hosted Wi-Fi and SD coexistence

Today's physical ESP32-P4 validation recovered the original Hosted Wi-Fi architecture and proved simultaneous Hosted connectivity and SD operation.

Hosted transport reported:

```text
transport: Identified slave [esp32c6]
H_API: Transport active
FG_WIFI: STA started
FG_WIFI: WiFi hosted init READY
```

The runtime validation proved:

- MAC address read
- automatic reconnect
- DHCP address obtained
- Wi-Fi Connected
- SD mounted successfully
- SD write/read test passed
- Wi-Fi and SD operating simultaneously

The observed coexistence message:

```text
sdmmc_host_init:
SDMMC host already initialized,
skipping init flow
```

confirms the intended use of SDMMC Slot 1 for Hosted Wi-Fi alongside SDMMC Slot 0 for the SD Card.

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- SD write/read test passed
- Hosted Wi-Fi and SD operating simultaneously
- No crash after interaction

## Native LVGL Keyboard Runtime and Visual Parity

The generated System Runtime owns one reusable native `lv_keyboard`, which is an `lv_buttonmatrix` subclass. It is created lazily on the LVGL top layer, attached to the active password textarea through `lv_keyboard_set_textarea()`, reused after its first creation and hidden and detached after Done or Cancel. The password workflow, show/hide behavior, Done, Cancel, physical geometry, ForgeUI styling and Browser Preview parity are physically proven. Two LVGL defaults caused the original hardware mismatch:

- the active theme supplied DPI-dependent padding, gaps, radius, font, shadow and outline;
- `lv_keyboard_create()` internally bottom-aligned the object, while `lv_obj_set_pos()` changed X/Y without clearing that alignment.

The exporter now configures the map, textarea, mode and explicit keyboard styles before final geometry. It clears unwanted theme-dependent padding, shadow and outline behavior, assigns the intended font and gaps, calls `lv_obj_set_align(..., LV_ALIGN_TOP_LEFT)`, and only then applies final position and size. No later generated call overrides the geometry.

The refined button-matrix width map is:

```text
Row 1: 4  4  4  4  4  4  4  4  4  4  4  4
Row 2: 3  3  3  3  3  3  3  3  3  3  3
Row 3: 1  1  1  1  1  1  1  1  1  1  1  1
Row 4: mode 2, left arrow 2, space 12, right arrow 2, confirm 2
```

LVGL normalizes width units independently within each row. The physical result now occupies the intended large keyboard area, aligns its textarea and keyboard, fills the available rectangle with four key rows, and matches the proven System password workflow represented in Browser Preview.

The keyboard runtime is reusable architecture for future Device settings, MQTT, Ethernet, Bluetooth, API keys, Device naming, Login and other System dialogs. Those consumers remain future work and are not claimed as implemented or physically proven.

## Verified Automated Status

- Built-in System regressions cover launcher opening and closing, Display and Wi-Fi navigation, Back navigation, live brightness state, current-session retention, Wi-Fi scan and connection preview workflows, password and forget dialogs, connected details, disabled placeholder behavior and preservation of existing application interaction.
- LVGL System exporter regressions cover the persistent application container, internal gear callback, System, Brightness and Wi-Fi containers, disabled cards, immediate visibility navigation, live `10–100` slider behavior, Waveshare BSP brightness integration and generated ownership of the Hosted-backed Wi-Fi Manager workflow.
- Focused configured-helper, direct Creator, registry measurement, shared selection-border resize, visible-bounds, Canvas preview, Browser Preview, persistence and exporter regressions pass across the five Interactive Assets.
- Browser Preview wrapper geometry and Interactive Browser Preview parity regressions cover saved component bounds, positioning and centred contain-fit rendering.
- Binary Output regressions cover the shared exporter path, Status Indicator LVGL scaling, component-sized container generation and centred child-image generation.
- Toggle State Sheet and Three-Position State Sheet, linked-crop, row-remapping and atomic-registration regressions pass; the State Sheet suite may require its longer timeout.
- Keyboard exporter lazy-creation, reusable-instance, textarea attachment, top-layer ownership, geometry, ordering, style and relative-width regressions pass.
- Shared union geometry, intrinsic and alpha-bound metadata, linked crop, same-ID invalidation, duplicate-write suppression and idempotent fitting regressions pass.
- TypeScript validation passes with `tsc --noEmit`.
- Focused `ForgeUILvglExport.{led,bar,arc,chart,keyboard,calendar,roller,msgbox,buttonmatrix,tabview,tileview}.test.ts` suites pass for retained runtime APIs, transition semantics, deterministic collision handling and hook preservation.
- Focused Button Text, Text Value, Heading Text and Clock Presentation suites pass across serialization, previews and shared export generation.
- TabView tests pass 5/5, Tileview tests pass 7/7, Heading tests pass 7/7, Clock tests pass 7/7, and the Button/Text/Heading/Clock presentation regression passes 29/29.
- Focused `export-server.test.js` coverage passes for generated hooks and preservation-merging of developer-owned bodies. The full suite is not claimed as passing when unrelated Neural Core and Carbon Fiber generated theme sources are absent.
- Live `/export`, standalone `/export-idf-project`, and ESP-IDF 5.5.4 build validation pass for the standard LVGL runtime API milestone.
- Scoped diff validation passes for the current implementation work.
- Client/server export validation and reference-protection coverage remain in place for all five Interactive Asset types.
- A known unrelated server fixture/source absence can fail the built-in theme-source preflight when the expected Neural Core or Carbon Fiber generated C files are not present; this does not weaken the validation boundary.

## Architectural Significance and Extension Pattern

### Standard LVGL semantic theme architecture

ForgeUI Standard LVGL components now share one semantic theme architecture. Future Standard components should:

- consume semantic theme roles;
- share Canvas and Browser rendering where practical;
- emit equivalent LVGL styling;
- preserve native LVGL interaction;
- avoid hard-coded decorative colours;
- retain the deterministic fallback;
- keep semantic status colours independent where appropriate.

This architecture provides authoring, preview and generated-firmware parity without adding runtime device theme switching.

ForgeUI now contains these reusable platform layers and services:

```text
Studio
├── AI
├── Canvas
└── Browser Preview

System Runtime
├── System Launcher
├── Display
├── Wi-Fi Manager
├── Storage Browser
├── Native LVGL Keyboard
└── Future System pages

Interactive Asset Runtime
├── Interactive Inputs
├── Three-Position Inputs
└── Binary Outputs

Standard LVGL Component Runtime
├── Scalar / visual output
│   ├── Led
│   ├── Bar
│   ├── Arc
│   └── Progress
├── Streaming output
│   └── Chart
├── Text entry
│   ├── Input
│   ├── Textarea
│   └── NumberInput
├── Boolean / selectable input
│   ├── Switch
│   ├── Checkbox
│   └── Radio
├── Option selection
│   ├── Roller
│   ├── Select
│   ├── ButtonMatrix
│   ├── Tabview
│   └── Tileview
├── Actions
│   └── IconButton
├── Visibility / dialog services
│   ├── Keyboard
│   ├── Msgbox
│   └── Box
├── Date selection
│   └── Calendar
├── Runtime image output
│   └── Image
├── Serialized text/time presentation
│   ├── Button
│   ├── Text
│   ├── Heading
│   └── Clock
└── API-free visuals
    ├── Scale
    ├── Line
    ├── Icon
    └── Divider

Interactive state receives a guarded setter plus a genuine-user hook. Output state receives a setter only. Serialized presentation receives no runtime API, and components with no semantic state remain intentionally API-free. TabView owns an active index and Tileview owns active coordinates. Clock presents RTC-owned state. Button, Text and Heading own serialized content. Scale, Line, Icon and Divider remain API-free.

Slider Canvas interaction is complete, but Slider runtime API is not part of this completed contract. Its setter/hook remains a future pass unless implemented separately.

Hosted Connectivity Runtime
├── ESP-Hosted
├── Wi-Fi Remote
├── ESP32-C6
└── SDIO Slot 1

Storage Runtime
├── SDMMC Slot 0
├── Lazy Storage page
├── Deferred worker
├── Bounded request and row models
└── Safe directory operations

Generated Firmware
├── LVGL
├── ESP-IDF
├── User Events
└── Hardware Integration
```

The System Interface is not an Interactive Asset. It is a reusable platform service generated alongside the user's application. It does not enter the Interactive Asset registry, does not become a user project screen and does not generate user callbacks.

Hosted Connectivity Runtime and Storage Runtime are reusable platform services independent of Interactive Assets. Hosted Connectivity owns ESP-Hosted, Wi-Fi Remote, the ESP32-C6 and SDIO Slot 1 and provides a complete reusable Hosted Wi-Fi service consumed by the built-in Wi-Fi Manager, including hosted scanning, AP retrieval and connection workflow; Storage Runtime owns the SD Card on SDMMC Slot 0 and provides a reusable built-in Storage Browser service alongside Wi-Fi.

This separation lets built-in Wi-Fi and Storage, together with future Bluetooth, Sound, Device and Diagnostics services, reuse the typed System page, shared navigation and generated container framework without affecting project screens or changing existing Interactive Asset runtime contracts. The System Launcher, Display / Brightness, complete Wi-Fi Manager, Storage Browser and reusable native LVGL keyboard are implemented and physically proven. The Hosted backend drives the generated Wi-Fi Manager through the complete Hosted scan pipeline, while the Storage backend drives the lazy generated Storage Browser through bounded status, browsing, Refresh, Read / Write Test and Delete Empty Folder operations. Browser Preview retains the System hierarchy; only Storage Browser Preview / Canvas parity polish remains.

Interactive Button established the first **Interactive Input Runtime** within the Interactive Asset Framework.

Interactive Toggle Switch extended that family with persistent binary input state, a shared Toggle Input Runtime and per-instance changed callbacks.

Interactive Three-Position Toggle Switch established the **Three-Position Input Runtime**, proving that the framework can support strongly typed persistent multi-position state, direct geometric selection and a generated enum without modelling the control as a boolean.

Interactive Light introduced the shared **Binary Output Runtime**, proving that generated output controls could expose a simple developer API while sharing a common runtime implementation.

Interactive Status Indicator validated that the Binary Output Runtime is reusable. It extends the framework without introducing a second runtime implementation, demonstrating that additional binary output assets can be added by reusing the existing runtime while providing their own asset model, designer, preview behaviour, export handling and generated public API. Status Indicator also completes the shared direct Creator workflow across all five Interactive Assets while remaining a non-clickable physical binary output controlled through `FG_Set_*`, not an input control.

ForgeUI now extends by adding reusable runtime families rather than accumulating isolated widget implementations. Each family owns the generated C runtime appropriate to its state and interaction model. All families share Interactive Asset identity, registry, persistence, uploaded assets, AI generation, Canvas assignment, preview, export integration, validation and generated-file ownership.

ForgeUI also has reusable creation architecture, with direct Creator coverage now complete across all five Interactive Assets:

- direct Creator navigation from Canvas context menus and Inspector onboarding;
- exact configured-asset reopening and clean unconfigured drafts;
- explicit Save and assignment boundaries;
- master State Sheet generation;
- shared linked-crop editing;
- atomic conversion and uploaded-asset registration;
- type-scoped Creator requests inside the shared portal.

All five Interactive Assets now share reusable post-placement geometry architecture:

- configured Inspector and direct Creator workflows;
- one shared selection-border resize capability with eight edge and corner zones;
- continuous Canvas-boundary clamping with live Inspector updates;
- component-authoritative geometry after placement;
- registry-driven configured and unconfigured preview replacement;
- one stable two-state visible-bounds union for Button, Toggle, Light and Status Indicator, plus the compatible three-state union path for Three-Position Toggle;
- preserved original uploads and idempotent fitted assets;
- intrinsic and alpha-bound measurement with same-ID invalidation and deduplicated registry writes;
- saved component geometry across Canvas and Browser Preview;
- centred contain-fit rendering across Canvas, Browser Preview and generated LVGL output;
- final component-authoritative LVGL export geometry.

This keeps artwork ownership on reusable Interactive Assets while component placement, size and export geometry remain owned by each Canvas component. Runtime semantics remain type-specific: Button and Toggle retain their input callbacks, Three-Position retains its enum and thirds-based selection, and Light and Status Indicator retain non-clickable `FG_Set_*` output control.

The Three-Position workflow proves an extensible N-state creation pattern:

```text
one master image
  -> N linked crop regions
  -> N uploaded visual assets
  -> strongly typed runtime state
```

This architecture can support future multi-state selectors without implying that those controls are implemented today.

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

Potential future Standard Runtime concepts include:

- Slider runtime setter and genuine-user hook
- Gauge
- Meter
- Seven Segment Display
- Numeric Display
- Radio Group and mutual-exclusion ownership
- dynamic Select option model
- native Spinbox/stepper runtime

These remain future concepts only. Existing Radio and Checkbox runtimes are implemented independently, NumberInput remains textarea-based, and Select options remain serialized.

# Save Point History

Save points are ordered newest to oldest. Detailed subsystem engineering is maintained in the Developer Code Maps.

## FORGEUI_STANDARD_LVGL_CANVAS_TABVIEW_TILEVIEW_LINE_TEXT_HEADING_WIFI_PARITY__SHARED_PREVIEWS__SEMANTIC_THEME__LINE_ENDPOINTS__READY_FOR_P4_PROOF__2026-07-29

- **What changed:** Standard Canvas, TabView, TileView, Text, Heading, Line and Wi-Fi now use shared Canvas / Browser Preview renderers where practical. Canvas decorative placeholder artwork was removed and configured artwork support was restored through the existing serialized asset path. TabView was aligned with generated/native LVGL geometry, selection and styling. TileView preview and generated LVGL were aligned around the simultaneous visible `2 × 2` ForgeUI contract. Standard Line gained persisted editable endpoints. Text and Heading consume semantic `textPrimary`, while Line consumes semantic `surfaceBorder`. Wi-Fi restored the established `WIFI` / `WIFI_FAIL` / `IP: -` vocabulary without wrapping or clipping. Browser Preview visual polish aligned Button, Text, Heading, Clock and Wi-Fi without changing serialized geometry or runtime behaviour.
- **Why it changed:** Duplicated preview implementations had drifted from generated LVGL; Canvas discarded configured artwork; TabView and TileView preview selection did not follow serialized startup state; TileView generated selection did not synchronize checked visual state; Text and Heading allowed legacy literal-colour paths to bypass the semantic theme; Line was fixed to `(0,0) -> (width,height)` and used a legacy border-colour path; Wi-Fi wording, wrapping and clipping regressed; and Browser Preview typography and alignment had drifted from generated LVGL/P4 presentation.
- **Final architecture:** Canvas and Browser Preview share Standard renderers where practical, while generated LVGL remains the firmware implementation. Canvas artwork resolves through serialized uploaded assets and exports as a clipped parent plus centred child `lv_image`. TabView retains native active-index semantics and existing API/hook ownership. TileView retains active column/row semantics and the simultaneous visible `2 × 2` panel contract. Line remains presentation-only and API-free while storing `startX`, `startY`, `endX` and `endY`. Text and Heading use `textPrimary`; Line uses `surfaceBorder`. Wi-Fi text remains owned by existing runtime polling and `fg_wifi_status_text()`. Generated firmware remains replaceable output and is not the source of fixes.
- **Proven result:** Focused geometry, preview, semantic-theme, Wi-Fi and exporter regressions passed. Horizontal, vertical, 45-degree and arbitrary-angle Line exports passed, together with legacy compatibility and endpoint rebasing. Text, Heading and Line passed non-default custom-theme proof. Wi-Fi coverage confirmed `WIFI_FAIL`, `IP: -` and no wrapping. TypeScript and `git diff --check` passed. Runtime APIs, hooks, persistence, Inspector behaviour and interaction contracts remain unchanged. Physical ESP32-P4 sign-off remains pending for this group; final Generate -> Build -> Flash -> visual comparison is required before promotion to physically proven status.

## FORGEUI_STANDARD_LVGL_THEME_PARITY__ELEVEN_COMPONENTS__CANVAS_BROWSER_GENERATED_LVGL_ESP32P4_PROVEN__2026-07-29

- **What changed:** Unified the semantic theme engine across Canvas, Browser Preview and LVGL export for Led, Bar, Arc, Chart, Table, Keyboard, Calendar, Scale, Roller, MsgBox and ButtonMatrix; completed Chart Y-axis numeric labels and X-axis point-index labels; and verified custom palette export.
- **Why it changed:** The selected Studio theme needed to remain authoritative through authoring, preview, generation and the flashed device, while Standard controls retained their native LVGL interaction and existing developer contracts.
- **Final architecture:** Selected themes resolve into shared semantic roles consumed by Canvas, Browser Preview, Code Preview and generated LVGL. Generated firmware reproduces that styling after Generate -> Build -> Flash. Deterministic graphite fallback remains available, status colours may remain semantically independent, and runtime hot theme switching is intentionally absent.
- **Proven result:** Canvas parity, Browser Preview parity, generated LVGL parity and physical ESP32-P4 parity are complete for the eleven named components across Graphite/orange, Cyber teal and Nordic light. Chart axes, custom palette export, runtime APIs, hooks and silent startup are preserved. Focused regressions reached 158/158, TypeScript and `git diff --check` passed, and ESP-IDF 5.5.4 / LVGL 9.2.2 firmware was generated, built, flashed and physically reviewed.

## FORGEUI_STANDARD_LVGL_RUNTIME_V1__DEVELOPER_API_SURFACE__INTERACTIVE_OUTPUT_PRESENTATION_CLASSIFICATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added Standard Runtime APIs and Preview parity for Input, Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box and IconButton; repaired the Slider Canvas movement/value-interaction conflict without adding Slider runtime APIs; classified Icon and Divider as intentionally API-free presentation; preserved Button, Text, Heading and Clock as serialized presentation; and expanded deterministic collision handling, live/standalone generation and user-hook preservation coverage.
- **Why it changed:** Exported projects needed a consistent developer-facing SDK for application-to-UI control and genuine UI-to-application events. Components needed runtime APIs only where meaningful state exists, presentation conveniences required explicit API-free decisions, and Canvas interactive controls required preview interaction without breaking movement or mutating project JSON.
- **Final architecture:** Interactive controls use retained objects/state, guarded silent setters and genuine-user hooks. Output controls expose setters only. Presentation-only components expose no runtime API. `90_Studio_Export.*` remains generated; live `95_UserEvents.*` remains preservation-merged and standalone copies become developer-owned. Canvas and Browser Preview share component previews where required, while generated LVGL retains component-specific native semantics.
- **Proven result:** The complete exporter regression reached 212/212, Canvas regression reached 51/51, generated API/preservation tests reached 33/33, focused component suites passed, and TypeScript, syntax and diff checks passed. One unrelated full export-server fixture failure remains possible when the two recorded default-theme C assets are missing. No blanket physical ESP32-P4 proof is claimed for the newly completed Standard Runtime set.

## FORGEUI_STANDARD_LVGL_RUNTIME_APIS__TABVIEW_TILEVIEW__TEXT_COMPONENT_PROPERTIES__CLOCK_PRESENTATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added TabView active-index runtime, Tileview active-coordinate runtime, Button Text, Text Value, Heading Text and Clock Presentation configuration; fixed independent retained ownership for multiple Clocks; retained Scale and Line as intentionally API-free.
- **Why it changed:** Standard components required meaningful developer control only where genuine semantic state exists, visible text placeholders needed real persisted editor properties, Clock needed configurable presentation without serializing runtime time, and multiple Clocks required independent retained state.
- **Final architecture:** Semantic state receives retained runtime APIs and hooks; static visible content receives serialized Inspector, Preview and export properties; runtime time remains RTC-owned; API-free visuals remain API-free; all live and standalone generation uses the shared exporter; and `95_UserEvents` remains preservation-merged.
- **Proven result:** Focused exporter, preview, persistence and preservation tests passed, together with TypeScript, export-server syntax and diff checks. Generated Clock firmware was inspected. This save point does not claim new physical ESP32-P4 proof for TabView, Tileview, text properties or Clock Presentation.

## FORGEUI_STANDARD_LVGL_RUNTIME_APIS__LED_BAR_ARC_CHART_KEYBOARD_CALENDAR_ROLLER_MESSAGE_BOX_BUTTON_MATRIX__LIVE_AND_STANDALONE_PROVEN__2026-07-29

- **What changed:** Added retained runtime objects/state, public `90_Studio_Export` APIs and preservation-merged `95_UserEvents` hooks for the standard LED, Bar, Arc, Chart, Keyboard, Calendar, Roller, Message Box and Button Matrix; Scale was inspected and deliberately remained API-free.
- **Why it changed:** Standard LVGL Canvas components rendered correctly but lacked a consistent, supported developer control surface in real generated firmware.
- **Final architecture:** The shared LVGL exporter generates deterministic per-instance APIs, private runtime state, transition helpers and hooks for both live `/export` and standalone `/export-idf-project`; live hook files preserve matching developer bodies and append only missing generated hooks.
- **Proven result:** Focused component and server preservation tests, TypeScript validation, both export paths and ESP-IDF 5.5.4 firmware builds passed. Generated firmware was not manually patched. Keyboard hardware interaction and blanket physical touch validation are not claimed by this save point.

## FORGEUI_SYSTEM_RUNTIME__LAZY_SD_STORAGE_BROWSER__SAFE_RUNTIME__DELETE_EMPTY_FOLDER__ESP32P4_PROVEN__READY_FOR_CANVAS_PREVIEW_PARITY__2026-07-28

- **What changed:** Added the lazy Storage Runtime, SD browser, paging, Refresh, Read / Write Test, Select Item mode and Delete Empty Folder; removed the unstable recursive delete and full-format workflow.
- **Why it changed:** The large eager Storage runtime caused boot instability, so Storage was redesigned around lazy construction and bounded runtime structures.
- **Final architecture:** A lazy System Runtime page uses a deferred worker, small request model, eight reusable rows and safe backend ownership while Hosted Wi-Fi remains unchanged.
- **Proven result:** Stable ESP32-P4 boot and Storage Runtime, SD browsing, folder navigation, Refresh, Read / Write Test and empty-folder deletion are physically proven with Hosted Wi-Fi and SD coexistence.

## FORGEUI_SYSTEM_RUNTIME__COMPLETE_WIFI_MANAGER__NATIVE_LVGL_KEYBOARD__HOSTED_CONNECTIVITY__ESP32P4_PROVEN__READY_FOR_WIFI_UI_POLISH__2026-07-27

- **What changed:** Completed the Hosted scan pipeline, repaired Hosted scan result transfer, added live Available Networks population, made Refresh perform a real Hosted scan, established a stable reusable Wi-Fi Manager runtime and physically validated it on the ESP32-P4.
- **Why it changed:** Native asynchronous assumptions were unsuitable for the Hosted transport.
- **Final architecture:** A dedicated Hosted scan pipeline owns scanning and AP retrieval, atomically replaces the runtime network model, and leaves LVGL presentation-only.
- **Proven result:** The physical ESP32-P4 shows live nearby SSIDs, RSSI, security, Connected and Saved state, the complete connection workflow and repeated scan replacement without stale entries.

## FORGEUI_WIFI_MANAGER__NATIVE_LVGL_KEYBOARD__BROWSER_PREVIEW_PARITY__PHYSICAL_ESP32P4_PROVEN__2026-07-27

- **What changed:** Completed the built-in Wi-Fi Manager across Browser Preview and generated LVGL, including Scan Networks, Refresh, SSID selection, live RSSI, Connected and Saved state display, password and forget dialogs, Connect, Disconnect, Reconnect, Forget Network and connected details; added a lazily created reusable native LVGL keyboard with top-layer ownership, textarea attachment, password entry, show/hide, Done and Cancel; and completed the associated runtime performance optimisation.
- **Why it changed:** The physically operational Hosted backend needed a complete reusable System Runtime workflow with responsive interaction, correct embedded text entry and Browser Preview parity rather than remaining a backend demonstration.
- **Final architecture:** The generated System Runtime owns the Wi-Fi Manager page, dialogs, connected details and one reusable native LVGL keyboard, while the existing Hosted Connectivity Runtime continues to own ESP-Hosted, Wi-Fi Remote, the ESP32-C6 and SDIO Slot 1. Shared typed System state supplies Browser Preview parity without moving Wi-Fi behavior into Interactive Assets or generated user callbacks.
- **Proven result:** The complete Wi-Fi interaction workflow, native keyboard geometry and behavior, Hosted-backed live data, connected details, Browser Preview parity and performance-optimised physical UI were validated on the ESP32-P4. Minor visual polish remains.

## FORGEUI_SYSTEM_INTERFACE__HOSTED_WIFI_SD_RECOVERY__SDIO_SLOT1_RESTORED__PHYSICAL_ESP32P4_PROVEN__2026-07-27

- **What changed:** Recovered the original ForgeUI-P4 Hosted Wi-Fi architecture by restoring the ESP32-P4-to-ESP32-C6 ESP-Hosted SDIO transport on SDMMC Slot 1, documented the unchanged SD Card runtime on SDMMC Slot 0, and recorded the physically proven boot order and configuration baseline.
- **Why it changed:** The previous SPI Hosted configuration did not match this hardware and prevented the Hosted transport from establishing.
- **Final architecture:** Hosted Wi-Fi uses the SDIO Host Interface, 4-bit SDMMC Slot 1 and its dedicated GPIO/reset baseline; the SD Card continues unchanged on BSP GPIO39–44 using 4-bit SDMMC Slot 0, manual LDO control and FAT. The System Runtime exposes the operational Wi-Fi backend independently of Interactive Assets.
- **Proven result:** ESP32-C6 identification, active Hosted transport, station startup, MAC read, automatic reconnect, DHCP and Wi-Fi connection were physically validated together with successful SD mount and write/read testing. Wi-Fi and SD operated simultaneously. The complete Hosted scan and Wi-Fi Manager workflow was proven at the later System Runtime save point above.

## FORGEUI_SYSTEM_INTERFACE__LVGL_RUNTIME__DISPLAY_BRIGHTNESS__ESP32P4_PROVEN__2026-07-27

- **What changed:** Introduced the built-in System Interface across Studio, Browser Preview and generated LVGL; implemented the System Launcher and Display / Brightness page; connected live brightness to the physical ESP32-P4 backlight.
- **Why it changed:** Device-level platform functions needed a reusable home that remains separate from user project screens, Interactive Assets and generated user callbacks.
- **Final architecture:** Shared typed System state drives Studio and Browser Preview, while generated LVGL keeps persistent application, System launcher and Brightness containers and navigates through immediate visibility switching. The Brightness slider calls `bsp_display_brightness_set()` through an internal clamped wrapper.
- **Proven result:** Studio, Browser Preview, LVGL and physical ESP32-P4 parity are achieved for the current System hierarchy; live backlight control and return navigation are proven, existing Interactive Assets remain alive, and the framework is ready for future Wi-Fi, Bluetooth, Audio, Storage, Device and Diagnostics pages without claiming those services are implemented.

## FORGEUI_INTERACTIVE_ASSETS__COMPLETE_WORKFLOW_PARITY__SHARED_VISIBLE_BOUNDS__CONTAIN_FIT_SCALING__READY_FOR_FEATURE_REVIEW__2026-07-27

- **What changed:** Completed Browser Preview geometry parity and shared contain-fit rendering, removed the legacy Status Indicator LVGL export path, and moved both Binary Output types onto one exported geometry implementation. Interactive Status Indicator now matches Canvas, Browser Preview and ESP32-P4.
- **Why it changed:** Eliminate the remaining visual inconsistencies between Studio previews and generated firmware.
- **Final architecture:** All five Interactive Assets now share one post-placement geometry model across Canvas, Browser Preview and generated LVGL while preserving their existing runtime behaviour.
- **Proven result:** Geometry parity is confirmed on the physical ESP32-P4, automated regressions are expanded, and the existing runtime families remain unchanged.

## FORGEUI_ALL_FIVE_INTERACTIVE_ASSETS__CONFIGURED_INSPECTOR_PARITY__SHARED_SELECTION_BORDER_RESIZE__VISIBLE_ARTWORK_FITTING__LVGL_CONTAIN_SCALING__ESP32P4_PROVEN__2026-07-27

- **What changed:** Completed configured Inspector, exact Creator reopening, shared selection-border resize, registry-driven preview refresh, visible-artwork fitting, continuous preview scaling, and generated contain-fit scaling across Toggle Switch, Status Indicator, and Three-Position Toggle, completing parity with Button and Light.
- **Why it changed:** Every Interactive Asset needed the same predictable post-placement workflow and Canvas-to-hardware geometry model without changing its established runtime contract.
- **Final architecture:** Two-state assets reuse shared stable union fitting, Three-Position uses the compatible three-state union path, Canvas components own final geometry, and the single LVGL exporter emits centred common-scale child images while each runtime family retains its existing state, callback, and setter semantics.
- **Proven result:** All five Interactive Assets now share one polished Studio workflow; existing input/output runtime behaviour remains intact, automated regressions pass, and current physical ESP32-P4 checks remain stable within the recorded scope.

## FORGEUI_INTERACTIVE_BUTTON_AND_LIGHT__WORKFLOW_POLISH__SHARED_VISIBLE_BOUNDS__CANVAS_RESIZE__LVGL_PARITY__ESP32P4_VALIDATED__2026-07-26

- **What changed:** Completed Button and Light creation, Inspector, registry-refresh, shared selection-border resize and visible-artwork fitting polish; added stable two-state union crops, linked fitted assets, legacy dimension recovery and centred contain-fit LVGL scaling.
- **Why it changed:** Reusable artwork needed predictable new-asset workflow, actionable callback diagnostics, geometry-preserving assignment, direct Canvas resizing, immediate preview replacement and physical output that matched Canvas and Browser Preview.
- **Final architecture:** Interactive Assets retain artwork and state ownership while placed components own geometry; Button and Light reuse shared resize, clamping, alpha measurement, two-state visible-bounds and linked-crop infrastructure, and export resolves image dimensions through registry metadata, PNG IHDR and LVGL descriptors.
- **Proven result:** Button and Light resizing, fitting, state changes and generated scaling match Canvas, Browser Preview and the physical ESP32-P4 while original uploads, persistence, public APIs and existing runtime behaviour remain intact.

## FORGEUI_ALL_FIVE_DIRECT_CREATORS__THREE_POSITION_STATE_SHEET__LINKED_CROPS__STATUS_INDICATOR_POLISH__KEYBOARD_PARITY__ESP32P4_PROVEN__2026-07-26

- **What changed:** Completed direct Creator coverage with Interactive Light, Three-Position and Status Indicator; added the Status Indicator responsive placeholder, `120 × 72` default drop size, corrected Interactive-tab navigation, aspect-ratio-preserving contain-fit preview and temporary local OFF / ON Canvas preview toggle; also added `Create Three-Position Toggle Set`, one-master State Sheet generation, linked crops, atomic registration, and corrected LVGL keyboard geometry.
- **Why it changed:** Visual controls needed safe component-to-Creator editing, immediately usable Canvas bounds, undistorted preview artwork, consistent multi-state generation, reliable crop conversion, and closer Studio-to-P4 keyboard parity.
- **Final architecture:** All five Interactive Assets open type-scoped drafts from Canvas and Inspector; Status Indicator requests are consumed in the Interactive tab and retain the shared Binary Output Runtime, while one Three-Position master feeds linked LEFT/CENTER/RIGHT crops before atomic registry mutation.
- **Proven result:** Status Indicator now has complete Creator-family and polished local preview behavior without changing its non-clickable physical output contract; Three-Position artwork, touch zones, callback states and the corrected keyboard remain proven on ESP32-P4.

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
