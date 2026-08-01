# Generated Export API Code Map: what generated firmware exposes, how callbacks and runtime APIs fit together, and what developers are allowed to extend.

## WHY 01_SPINE & 02_DEVELOPER & 03_FORGEUI_GEN -  means Codex spends less time guessing and is much less likely to:

- edit generated files directly
- duplicate an existing subsystem
- put firmware logic into the Studio
- break ownership boundaries
- revive an obsolete architecture
- touch hardware configuration that is   already proven

## ForgeUI Generated Export API — Permanent Code Map

## Current proven save point

**FORGEUI_END_OF_SPRINT__29_OF_39_STANDARD_WIDGETS_ESP32P4_PROVEN__2026-08-01**

This document describes the generated SDK surface currently emitted by the
shared live/Standalone generator. `90_Studio_Export.h` contains callable
Runtime APIs. `95_UserEvents.h` contains genuine-user callback declarations.
Internal `fg_*` helpers are implementation details and are not public SDK
functions. All per-component public symbols derive from the component name and
use deterministic collision suffixes.

Previous platform milestone:
`FORGEUI_BOARD_PROFILES__EXPORT_TIME_FEATURE_GATING__LAZY_SYSTEM_TOOLS__CONNECTED_WIFI_45KB_FREE__RAM_OVERLAY__READY_FOR_FINAL_OPERATOR_VALIDATION__2026-07-31`.

### Existing physically proven generated runtime

The earlier physical proof remains valid for Interactive Assets; System Runtime;
Hosted Connectivity and Storage; the eleven-component Standard group; and the
2026-07-30 Standard input and selection group. Spinbox now joins the physically
proven Standard set through live and Standalone ESP32-P4 output.

### Current generated boundary status

- Dashboard resolves through the normal-component export boundary. Industrial
  HMI, Control Panel, Monitoring, SCADA Overview and Mobile / Portrait are
  roadmap candidates only.
- Smart Region Boxes and AI-filled controls create no template-specific runtime, API, hook or transport field.
- Focused Layout Designer, AI Region Composer and semantic Box exporter coverage passes.
- Standard QR Code generation is implemented as a native LVGL 9.2.2 output component.
- The live generated `90_Studio_Export.c/.h` contains the QR object, serialized initialization and `FG_Set_QR_Code_Text(const char * text)`.
- QR contributes no `userEventHooks`, asset C source or `95_UserEvents` declaration.
- QR-focused preview/export tests pass and the current clean ESP-IDF build contains native QR output; a recorded successful physical phone scan remains pending.

## Purpose and scope

This document defines the permanent boundary between:

- ForgeUI-generated UI and runtime code; and
- developer-owned application code.

It is an architectural code map, not a milestone diary, proposal, or roadmap.

This document remains separate from `02_DEVELOPER_CODE_MAP.md`:

```text
02_DEVELOPER_CODE_MAP.md
  → Whole Studio, System Runtime and Interactive Asset subsystem map

03_ForgeUI_Generated_Export_API_Code_Map.md
  → Generated firmware API, file ownership, hook, and public-setter boundary
```

Use this map to determine:

- where generated firmware code originates;
- which layer owns API naming and metadata;
- which files Studio writes;
- which files become developer-owned after standalone export;
- how UI input reaches developer code;
- how developer code updates UI outputs;
- which responsibilities must not be duplicated.

The generated Standard Runtime provides a predictable exported-project SDK:

```text
Application code → generated UI
  public declarations in 90_Studio_Export.h
  implementations in 90_Studio_Export.c

Generated UI → developer application
  hook declarations in 95_UserEvents.h
  preservation-merged implementations in 95_UserEvents.c
```

Interactive Standard setters are guarded so application-to-UI updates cannot be misreported as genuine UI-to-application events.

## Layout Designer Generated Export Boundary

Layout Designer is a Studio authoring subsystem. Before export, it resolves into the existing ForgeUI component document.

```text
Layout Designer / AI Fill
        ↓
Normal ForgeUI components
        ↓
Final persisted x/y/w/h
        ↓
generateForgeUILvglCode()
        ↓
Existing generated LVGL output
```

Layout Designer does not create a second exporter, separate generated firmware document, new runtime family, new public API family, new `95_UserEvents` hooks or new export payload fields. It does not bypass `ForgeUIExportValidation`. Its output uses the existing Box, Divider, Heading, Text, Chart, Button and other Standard component branches.

### Template Generated Structure

The current library contains Dashboard. Its definition produces normal Box
regions and ordinary placeholder/assigned components and retains
`dashboard.header`, `dashboard.status`, `dashboard.main`,
`dashboard.controls` and `dashboard.footer`. Other named layout concepts are
roadmap candidates and must not be treated as registered definitions.

Stable region keys and assignment metadata are Studio/project metadata. They generate no C structs, enums, public APIs, hooks, runtime callbacks or additional files. After layout composition, final persisted component `x/y/w/h` is the generated geometry source of truth.

### AI Fill Generated Boundary

AI Fill supplies design-time canonical ForgeUI types, supported serialized props, semantic region assignment, content and ordering. It does not directly generate firmware.

The export boundary begins only after AI output is validated, converted to normal components, assigned to regions, Auto Arranged and inserted into the project document. The exporter therefore receives the same model whether components were manually dropped, created by a template, inserted by AI Fill or subsequently moved or resized. Generated firmware cannot know whether a component originated from AI.

## System overview

The generated export layer supports five Interactive Asset types:

```text
Interactive Input Runtime
├── Interactive Button
└── Interactive Toggle Switch

Three-Position Input Runtime
└── Interactive Three-Position Toggle Switch

Binary Output Runtime
├── Interactive Light
└── Interactive Status Indicator

System Runtime
├── Application Container
├── System Launcher
├── Display / Brightness
├── Wi-Fi Manager
├── Storage Browser
├── Native LVGL Keyboard
└── Future System Pages

Hosted Connectivity Runtime
├── ESP-Hosted
├── Wi-Fi Remote
├── ESP32-C6
└── SDIO Slot 1
```

Button is momentary input. Toggle Switch is persistent boolean input. Three-Position Toggle is persistent enum input. Light and Status Indicator are developer-controlled outputs.

## Standard LVGL Component Runtime

ForgeUI generates runtime APIs for two independent categories:

1. Interactive Asset Runtime retains its existing artwork-backed runtime families.
2. Standard LVGL Component Runtime generates retained APIs based on the semantics of ordinary LVGL widgets.

Standard LVGL components are not Interactive Assets. Their objects, state, helpers, callbacks, public APIs, hook metadata and collision-safe names are generated by `studio/src/forgeui/ForgeUILvglExport.ts`; `studio/export-server.js` materializes and preservation-merges the generated API files.

The current physically proven Standard group is verified through Canvas, Browser Preview, generated LVGL and ESP32-P4:

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

Current generated-output parity work outside the physical milestone includes:

- Standard Canvas artwork export
- TabView explicit geometry and selected-state export
- TileView native `2 × 2` swipe-page generation
- Line serialized endpoint generation
- Text semantic `textPrimary`
- Heading semantic `textPrimary`
- Standard Wi-Fi multiline status presentation

TileView within this group is now physically **PROVEN**; the other items retain
their separately documented evidence levels.

The 2026-07-30 generated-runtime group is also physically proven:

- Input
- Textarea
- Checkbox
- Switch
- Radio
- Progress
- CircularProgress
- NumberInput
- Select
- Spinbox

TabView and TileView are **PROVEN**. Image, Box and IconButton remain
runtime-complete but outside these physical validation milestones.

Previously completed runtime components:

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

Newly completed runtime components:

- ✓ Input
- ✓ Textarea
- ✓ Switch
- ✓ Checkbox
- ✓ Radio
- ✓ Progress
- ✓ CircularProgress
- ✓ NumberInput
- ✓ Select
- ✓ Image
- ✓ QRCode
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

Slider Canvas movement and temporary preview-value interaction remain isolated
from project JSON. Its native LVGL export retains the Slider and generates a
collision-safe value setter and genuine-user change hook. Spinner is
presentation-only and generates neither. List has no setter but generates one
collision-safe item-click hook carrying the zero-based row index and text.

```text
Standard LVGL Component Runtime
├── Scalar / visual output
│   ├── Led
│   ├── Bar
│   ├── Arc
│   ├── Progress
│   └── CircularProgress
├── Streaming output
│   └── Chart
├── Text entry
│   ├── Input
│   ├── Textarea
│   └── NumberInput
│       ├── outer container
│       ├── numeric textarea
│       ├── increment button
│       ├── decrement button
│       └── serialized step
├── Boolean / selectable input
│   ├── Switch
│   ├── Checkbox
│   └── Radio
├── Option selection
│   ├── Roller
│   ├── Select
│   ├── Button Matrix
│   ├── TabView
│   └── Tileview
├── Actions
│   └── IconButton
├── Visibility / dialog services
│   ├── Keyboard
│   ├── Message Box
│   └── Box
├── Date selection
│   └── Calendar
├── Runtime image output
│   └── Image
├── Encoded output
│   └── QRCode
├── Serialized presentation
│   ├── Button
│   ├── Text
│   ├── Heading
│   └── Clock
└── API-free presentation
    ├── Scale
    ├── Line
    ├── Icon
    └── Divider
```

## Generated Standard Semantic Theme Architecture

The selected theme reaches generated firmware through one semantic pipeline:

```text
Theme Manager
    |
    v
Semantic Theme Resolver
    |
    v
Canvas
    |
    v
Browser Preview
    |
    v
LVGL Export
    |
    v
Generated Firmware
    |
    v
ESP32-P4
```

Canvas, Browser Preview and generated LVGL consume equivalent semantic roles:

- `surface`
- `surfaceSecondary`
- `surfaceBorder`
- `textPrimary`
- `textSecondary`
- `accent`
- `accentText`
- `disabledText`
- `selectedSurface`

`studio/src/forgeui/theme/ForgeThemeContext.tsx` supplies the active preview palette. `studio/src/forgeui/preview/forgeThemeMap.ts` resolves semantic roles, deterministic graphite fallback and contrast-dependent values. `studio/src/forgeui/preview/forgePreviewRenderer.tsx` supplies the resolved palette to Browser Preview renderers. `studio/src/forgeui/ForgeUILvglExport.ts` owns propagation of those semantic colours into generated LVGL style calls.

Generated theme ownership explicitly covers Switch checked-state selectors, Select closed-control/arrow/popup/selected-row styling, Circular Progress remaining/completed arcs, and Number Input container/field/stepper/divider states. Native LVGL blue/default styling is overridden at the applicable part/state selectors.

Custom palettes propagate through the same path. Decorative colours are no longer hard-coded for the proven Standard group. Semantic colours such as Standard LED status green intentionally remain independent where appropriate.

Hardware theme changes require:

```text
Theme -> Generate -> Build -> Flash
```

Runtime hot theme switching on the ESP32-P4 was not added.

### Generated API direction

| Component | Generated public API | Hook in `95_UserEvents.h` |
| --- | --- | --- |
| Led | `FG_Set_<Name>(bool on)` | `FG_On_<Name>_Changed(bool enabled)` |
| Bar | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` |
| Arc | `FG_Set_<Name>(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` |
| Chart | `FG_Add_<Name>_Point(int32_t value)`, `FG_Clear_<Name>(void)` | `FG_On_<Name>_Point_Added(int32_t value)`, `FG_On_<Name>_Cleared(void)` |
| Keyboard | `FG_Show_<Name>(void)`, `FG_Hide_<Name>(void)` | `FG_On_<Name>_Shown(void)`, `FG_On_<Name>_Hidden(void)` |
| Calendar | `FG_Set_<Name>_Date(uint16_t year, uint8_t month, uint8_t day)` | `FG_On_<Name>_Date_Changed(uint16_t year, uint8_t month, uint8_t day)` |
| Roller | `FG_Set_<Name>_Selected(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` |
| Message Box | `FG_Show_<Name>(void)`, `FG_Close_<Name>(void)` | Shown, Closed and Button Pressed hooks |
| Button Matrix | `FG_Set_<Name>_Selected(uint32_t button_index)` | `FG_On_<Name>_Button_Selected(uint32_t index, const char * text)` |
| TabView | `FG_Set_<Name>_Selected(uint32_t tab_index)` | `FG_On_<Name>_Changed(uint32_t tab_index)` |
| Tileview | `FG_Set_<Name>_Selected(uint32_t column, uint32_t row)` | `FG_On_<Name>_Changed(uint32_t column, uint32_t row)` |
| Input | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` |
| Textarea | `FG_Set_<Name>_Text(const char * text)` | `FG_On_<Name>_Changed(const char * text)` |
| Switch | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` |
| Checkbox | `FG_Set_<Name>_Checked(bool checked)` | `FG_On_<Name>_Changed(bool checked)` |
| Radio | `FG_Set_<Name>_Selected(bool selected)` | `FG_On_<Name>_Changed(bool selected)` |
| Progress | `FG_Set_<Name>_Value(int32_t value)` | None |
| CircularProgress | `FG_Set_<Name>_Value(int32_t value)` | None |
| NumberInput | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` |
| Select | `FG_Set_<Name>_Selected_Index(uint32_t index)` | `FG_On_<Name>_Changed(uint32_t index, const char * text)` |
| Image | `FG_Set_<Name>_Source(const void * src)` | None |
| QRCode | `FG_Set_<Name>_Text(const char * text)` | None |
| Box | `FG_Set_<Name>_Visible(bool visible)` | None |
| IconButton | `FG_Set_<Name>_Enabled(bool enabled)` | `FG_On_<Name>_Clicked(void)` |
| Canvas | None; serialized container/artwork presentation only | None |
| Button | None; owns serialized Button Text only | None |
| Text | None; owns serialized Text Value only | None |
| Heading | None; owns serialized Heading Text only | None |
| Standard Wi-Fi presentation | None; existing generated polling/status projection | None |
| Clock | None; owns presentation configuration only | None |
| Scale | None | None |
| Line | None | None |
| Icon | Optional `FG_Set_<Name>_Visible`, `Opacity`, `Color` in `96_FiRuntime.h` | Optional `FG_On_<Name>_Clicked(void)` |
| Divider | None; presentation-only visual separator | None |
| Slider | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` |
| Spinbox | `FG_Set_<Name>_Value(int32_t value)` | `FG_On_<Name>_Changed(int32_t value)` |
| Spinner | None; presentation-only native animation | None |
| List | None | `FG_On_<Name>_Item_Clicked(uint32_t index, const char * text)` |

In this table, CircularProgress is a retained output-only arc. NumberInput is the composed generated numeric textarea plus hardware increment/decrement buttons using serialized step; its existing API and hook names are unchanged.

### Permanent Standard Runtime classification

Interactive semantic state retains the native or composed LVGL object and runtime state, exposes a public control API, guards programmatic updates where LVGL may emit events, adapts genuine LVGL user events, and contributes generated hook metadata. Creation and setter calls are silent. Input, Textarea, Switch, Checkbox, Radio, NumberInput, Select and IconButton follow this boundary.

Output semantic state retains its LVGL object and runtime state and exposes a setter without a developer hook. Progress, CircularProgress, Image, QRCode and Box follow this boundary.

A Layout Designer Region Box remains a Standard Box. Its structural purpose adds no runtime semantics. When it qualifies as a retained non-root Box, its only public contract is `FG_Set_<Region_Box_Name>_Visible(bool visible)`. Region assignment, padding, gaps, arrangement mode, Auto Arrange, layout lock, region role and region key generate no APIs.

Serialized presentation normally generates LVGL presentation only and no runtime
API or hook. Components without semantic runtime state are intentionally
API-free. Divider, Scale and Line are examples. Standard Icon is the explicit
exception: its optional generated presentation state lives in `96_FiRuntime`,
and its optional click hook lives in 95.

### Chart generated output

Chart retains native `lv_chart`, its primary-Y series, runtime streaming and clear behavior. Shared responsive geometry reserves the Y-label and bottom gutters while keeping point positions aligned with native LVGL content geometry.

Generated Chart output adds non-clickable sibling `lv_label` objects for:

- Y-axis numeric labels derived from the normalized range and horizontal divisions;
- X-axis point-index labels derived from `0..pointCount - 1`.

Labels use selected-theme `textSecondary`. Responsive density preserves deterministic endpoints when every X index cannot fit. No category names, dates, timestamps or other X-axis semantics are invented. Existing Chart APIs, hooks and silent startup remain unchanged.

### Standard API direction model

Application code calls public functions declared in `90_Studio_Export.h`:

```c
FG_Set_Search_Input_Text("abc");
FG_Set_Enable_Switch_Checked(true);
FG_Set_Download_Progress_Value(75);
FG_Set_Mode_Select_Selected_Index(2);
FG_Set_Logo_Image_Source(&fg_icon_about_48px);
FG_Set_Status_Box_Visible(false);
FG_Set_Settings_Icon_Button_Enabled(false);
```

Generated LVGL calls developer hooks declared in `95_UserEvents.h` and implemented in `95_UserEvents.c`:

```c
FG_On_Search_Input_Changed(const char * text);
FG_On_Enable_Switch_Changed(bool checked);
FG_On_Enable_Logging_Checkbox_Changed(bool checked);
FG_On_Automatic_Mode_Radio_Changed(bool selected);
FG_On_Target_Temperature_Number_Input_Changed(int32_t value);
FG_On_Mode_Select_Changed(uint32_t index, const char * text);
FG_On_Settings_Icon_Button_Clicked(void);
```

An interactive setter must not call its matching genuine-user hook. Per-instance guards prevent application-to-UI updates from being reported as UI-to-application interaction.

### Icon generated boundary

The standard `Icon` exists to provide Studio's built-in icon picker. During export, its selected artwork resolves through the existing image-symbol pipeline and is emitted as a normal LVGL `lv_image`. It has no retained runtime ownership, public setter or developer callback and does not define a separate runtime component family.

Runtime image changes are handled exclusively by the Standard Image runtime:

```c
void FG_Set_<Image_Name>_Source(const void * src);
```

Developers must use an `Image` component when application code needs to swap image sources. A duplicate `FG_Set_<Icon_Name>_Source(...)` API is intentionally not generated.

### Divider generated boundary

Divider owns no runtime state and generates neither a declaration in `90_Studio_Export.h` nor a hook in `95_UserEvents.h`. It remains serialized presentation used only for visual separation.

If a Divider must appear or disappear dynamically, application code should control the containing layout through:

```c
void FG_Set_<Parent_Box_Name>_Visible(bool visible);
```

A Divider-specific visibility API is intentionally not generated.

### Standard Canvas generated boundary

Standard Canvas is serialized presentation and generates no public runtime API or developer hook.

`studio/src/forgeui/ForgeUILvglExport.ts` owns:

- bounded parent `lv_obj`;
- serialized `x` / `y` / `w` / `h`;
- clipping to parent bounds;
- configured uploaded-asset resolution;
- generated `LV_IMAGE_DECLARE(...)`;
- required asset-source collection;
- child `lv_image`;
- saved image scale;
- centred alignment;
- transparency preservation.

The generated structure is conceptually:

```c
lv_obj_t * canvas = lv_obj_create(parent);
lv_obj_set_pos(canvas, x, y);
lv_obj_set_size(canvas, width, height);
lv_obj_add_flag(canvas, LV_OBJ_FLAG_CLIP_CHILDREN);

lv_obj_t * image = lv_image_create(canvas);
lv_image_set_src(image, &generated_symbol);
lv_image_set_scale(image, image_scale);
lv_obj_center(image);
```

The exporter and uploaded-asset registry remain authoritative for generated symbols and required asset sources. `90_Studio_Export.c` is generated, replaceable output and must not be manually treated as the source of the fix.

### Standard Canvas Keyboard

The standard Canvas Keyboard is eager and retains its keyboard without creating an owned textarea. It remains unattached by default and is not the lazy reusable System keyboard.

### Button Matrix

Button Matrix retains its object, selected index and row-break-aware button count. Programmatic selection and `LV_EVENT_VALUE_CHANGED` share one transition helper. Disabled buttons are protected, one-check and checked state are preserved as distinct from selection, duplicate transitions are suppressed, and names are collision-safe.

The first Button Matrix inspection used a stale running Studio exporter bundle. Restarting Studio regenerated the correct retained runtime. This was stale running generator code, not a split between live and standalone generator architecture.

### TabView

TabView retains its native LVGL object, selected index and tab count. Export owns explicit internal geometry matching the shared preview: a 34 px tab bar, equal/remainder tab widths, square outer bounds and explicit content sizing. Serialized initial selection is applied silently. Touch and programmatic changes use one transition helper. Programmatic updates call `lv_tabview_set_active(..., LV_ANIM_OFF)` and `LV_EVENT_VALUE_CHANGED` handling reads `lv_tabview_get_tab_active()`. Generated identifiers are collision-safe, semantic styles are emitted explicitly, and the existing API/hook boundary is unchanged.

### Tileview

Tileview is generated as native LVGL 9.2.2 `lv_tileview` with four full-size
pages in the fixed `2 × 2` ForgeUI coordinate contract. Runtime retains the
selected row and column. `FG_Set_<Name>_Selected()` changes the native active
tile silently; genuine swipe completion invokes the existing changed hook.
Startup remains silent and generated identifiers are collision-safe.

Native creation uses `lv_tileview_create()` and `lv_tileview_add_tile()`.
Programmatic selection uses `lv_tileview_set_tile()`, while genuine-user
changes resolve the active page through `lv_tileview_get_tile_active()`.

Physical ESP32-P4 proof confirms silent startup, horizontal and vertical
navigation, correct coordinates including `(1,0)`, `(0,0)`, `(1,1)` and
`(0,1)`, one callback per effective tile change, and stable repeated
navigation. Wi-Fi remained connected, SD remained ready, and TabView, Spinbox
and List continued working. TileView is **PROVEN**.

### Input generated boundary

Generated LVGL retains native single-line `lv_textarea` and current text. Placeholder remains serialized. Silent `FG_Set_<Name>_Text(const char * text)` treats `NULL` as empty, suppresses unchanged values and uses a per-instance guard. Initial text is assigned before callback registration; only genuine `LV_EVENT_VALUE_CHANGED` invokes the edit hook. Semantic theme and border parity are physically proven across Canvas, Browser Preview, generated LVGL and ESP32-P4.

Touch focuses the textarea only. Generated runtime does not automatically attach a keyboard. Standard Canvas Keyboard and the private reusable System Runtime keyboard remain separate generated architectures.

### Textarea generated boundary

Textarea retains native multiline `lv_textarea` and current runtime text. Placeholder and multiline configuration remain separate serialized properties. It uses the same silent guarded setter and genuine-user hook model as Input. Theme/border parity and Canvas/Browser/LVGL/P4 proof are complete. Touch focuses the textarea without automatic keyboard attachment.

### Switch generated boundary

Switch retains native `lv_switch` and checked state. Generated styling explicitly owns `LV_PART_MAIN`, `LV_PART_INDICATOR`, `LV_PART_INDICATOR | LV_STATE_CHECKED` and `LV_PART_KNOB`. The checked selector intentionally overrides LVGL default blue with the semantic accent. The checked setter applies `LV_STATE_CHECKED` under a programmatic guard; creation/setter calls remain silent and only user changes invoke the hook. P4 proof is complete.

### Checkbox generated boundary

Checkbox retains native `lv_checkbox`. Default fallback wording is removed and legacy fallback wording normalizes away; explicit custom labels remain serialized and supported. Checked-state runtime, setter and hook ownership are otherwise unchanged. Semantic theme parity and P4 proof are complete.

### Radio generated boundary

LVGL has no dedicated Radio widget in this generated path. Radio retains an `lv_checkbox` styled with a circular indicator and maps selected state to `LV_STATE_CHECKED`. The default `"Radio"` label is removed: generated runtime emits an empty checkbox label unless an explicit custom label exists. The default is indicator-only, custom labels remain supported, and physical parity is proven. Selected setter/hook and independent-selection ownership remain unchanged.

### Progress generated boundary

Progress retains output-only native `lv_bar`, current value and configured range. Its setter-only Value API clamps and suppresses repeated effective values. It has no interaction and contributes no hook. P4 proof is complete.

### CircularProgress generated boundary

CircularProgress retains an output-only native `lv_arc` object and value. `FG_Set_<Name>_Value(int32_t value)` clamps and suppresses repeated values; no hook is generated. Generated geometry uses a 360-degree background arc rotated 270 degrees, `surfaceSecondary` remaining arc, `accent` indicator, explicit widths/opacities, no visible knob and no `LV_OBJ_FLAG_CLICKABLE`. It cannot be dragged and is physically proven.

### NumberInput generated boundary

Generated NumberInput is composed from an outer border-owning container, retained numeric textarea child, increment button and decrement button. The generated outer frame owns the full bounds; a vertical divider separates the field/stepper area and a horizontal divider separates the two buttons.

Runtime retains value, range and serialized/shared step constant. Native increment/decrement callbacks use `int64_t` intermediate arithmetic, clamp to minimum/maximum and invoke the existing hook after genuine button changes. The guarded Value setter remains silent. Hardware steppers and full P4 proof are complete.

### Select generated boundary

Select retains native `lv_dropdown`, selected index and serialized option count. Generated ownership includes the themed closed control and popup list returned by `lv_dropdown_get_list()`. Semantic border and arrow styling explicitly cover `LV_PART_INDICATOR`; popup/selected rows explicitly cover `LV_PART_SELECTED` and checked/pressed combinations, preventing native blue/default leakage. The setter remains clamped/guarded and genuine callbacks retain their generated text buffer. Physical proof is complete.

### Image generated boundary

LVGL-ready Image instances retain native `lv_image` and current source pointer. The output-only API accepts raw `const void *`, safely ignores `NULL` and unchanged pointers, and generates no hook. Pending/unconverted assets keep their placeholder and safely no-op. No asset-ID, path or URL runtime lookup exists.

### QR Code generated boundary

`QRCode` retains a native LVGL 9.2.2 `lv_qrcode` object. Serialized generation calls the public API provided by the installed managed component: `lv_qrcode_create`, `lv_qrcode_set_size`, `lv_qrcode_set_dark_color`, `lv_qrcode_set_light_color` and `lv_qrcode_update` with an explicit byte length. That header does not expose `lv_qrcode_set_data` or `lv_qrcode_set_quiet_zone`.

The output-only API is:

```c
void FG_Set_<Name>_Text(const char * text);
```

The setter normalizes `NULL` to an empty string and updates the retained object through `lv_qrcode_update(obj, data, strlen(data))`. QR Code produces no genuine-user transition, `userEventHooks` entry or `95_UserEvents` declaration/stub. Its modules are native LVGL output, not an uploaded image, so QR contributes no `assetSources` entry. `firmware/ForgeUI-One/sdkconfig.defaults` owns the required `CONFIG_LV_USE_QRCODE=y`.

### Box generated boundary

Non-root Box instances retain `lv_obj_t *` and visibility only. The setter adds or clears `LV_OBJ_FLAG_HIDDEN`, suppresses repeated state and generates no hook. Children remain attached to the retained object. Root screen Boxes are excluded.

A Layout Designer smart-region Box remains a Standard Box and preserves the existing `void FG_Set_<Name>_Visible(bool visible);` contract. It may carry additive Studio metadata such as `layoutRegionKey`, role, label, padding, gap, arrangement, semantic surface role, semantic border role, radius, border width and opacity.

Arrangement metadata is consumed during authoring, and Auto Arrange resolves assigned child geometry before export. Generated LVGL receives final Box and child geometry; firmware does not perform Auto Arrange or search for `layoutRegionId`. Region metadata creates no additional API, root exclusion remains unchanged, and children continue through normal traversal. Semantic Region Box styling uses existing theme roles rather than hard-coded Dashboard colours.

The structural role does not create APIs for region assignment, padding, gap, arrangement mode, Auto Arrange, layout lock, region role or region key.

### IconButton generated boundary

IconButton retains native button and enabled state. The setter applies `LV_STATE_DISABLED` silently. `LV_EVENT_CLICKED` invokes the void hook only while enabled. Icon selection remains serialized; no runtime icon-source setter exists.

### Slider generated boundary

Canvas track/thumb interaction changes temporary preview value, surrounding component interaction supports movement, Browser Preview remains interactive, and project JSON remains unchanged. Native export retains the Slider. `FG_Set_<Name>_Value(int32_t value)` normalizes the serialized range, clamps signed inputs, ignores repeats and guards the LVGL update so it cannot notify application code. The LVGL callback updates retained state and invokes `FG_On_<Name>_Changed(int32_t value)` only for a changed user value. Initial value assignment precedes callback registration, so startup is silent.

### Spinner generated boundary

Spinner exports native `lv_spinner_create(parent)` plus `lv_spinner_set_anim_params(widget, duration_ms, arc_length_degrees)`. Geometry, main/indicator arc widths, semantic or explicit colours and opacity are applied directly to the native object. It creates no public declaration, hook, runtime helper source or CMake entry. The branch is naturally export-time gated because it is emitted only while traversing a serialized Spinner.

### Spinbox generated boundary

Spinbox exports native `lv_spinbox_create` with normalized range, integer
backing value, power-of-ten step, digit/decimal format, rollover, cursor and
semantic styling. Native helper buttons call `lv_spinbox_increment` and
`lv_spinbox_decrement` for touch operation and use validated coordinates that
keep both arrows on-screen. Its collision-safe
`FG_Set_<Name>_Value(int32_t)` setter clamps and remains silent.
`FG_On_<Name>_Changed(int32_t)` receives the integer backing value only after a
genuine effective native key or helper-button change. It generates no getter,
increment/decrement command, widget-specific source or CMake entry.

The branch is usage-gated by serialized Spinbox presence and participates in
project export-time feature gating. Live Studio firmware and
`/export-idf-project` consume the same generator; export preflight rejects stale
or malformed output before it can be treated as the build artifact.
`90_Studio_Export.c/.h` owns replaceable construction, state, setter and event
adapter code. `95_UserEvents.c/.h` owns the preservation-merged developer hook.
Duplicate component names receive deterministic suffixes before both APIs are
emitted.

Physical validation on ESP32-P4 with ESP-IDF 5.5.4 and LVGL 9.2.2 confirms
increment, decrement, signed backing values, decimal formatting, rollover,
clamp, multiple instances and live/Standalone parity. Exactly one
`FG_On_<Name>_Changed()` is emitted per effective user action; initial creation,
repeated/no-op transitions and programmatic setters remain silent.

Native LVGL Spinbox is a selected-digit editor. It is not a free-form numeric
text-entry control; use NumberInput for that interaction model.

The final registry audit records 44 entries: 39 Standard widgets and five
Interactive Assets. With TileView promoted and TabView retaining its existing
**PROVEN** status, Standard physical proof is 29/39 (74%), leaving 10 widgets
for individual promotion.

### List generated boundary

List exports native `lv_list_create`, optional `lv_list_add_text` and one
`lv_list_add_button` per normalized item. It has no public setter. Each button
registers one shared `LV_EVENT_CLICKED` callback with immutable per-row
`{index, text, hook}` data. The callback invokes
`FG_On_<Name>_Item_Clicked(uint32_t index, const char * text)` only after a
genuine click. Construction is silent. Duplicate component names receive
`_2`, `_3` and later suffixes before `_Item_Clicked`.

Physical ESP32-P4 proof on LVGL 9.2.2 and ESP-IDF 5.5.4 observed one callback
for each single touch of Overview, Settings and Diagnostics, carrying indices
0, 1 and 2 with the matching generated text. Repeated taps remained stable;
TabView and Spinbox continued operating; Wi-Fi remained connected; SD remained
ready; runtime remained stable; and connected-stage internal RAM was
approximately 39 KB free. Live and standalone exports both compile from
identical generated List C/H. **LIST — PROVEN ON ESP32-P4**.

### Scale

Scale is visual only. It owns no runtime value, retained runtime state, setter or hook, so no generator change is appropriate.

### Line

Line generates native LVGL `lv_line` from serialized `startX`, `startY`, `endX` and `endY` values:

```c
static lv_point_precise_t <name>_pts[] = {
    {startX, startY},
    {endX, endY}
};

lv_obj_t * <name> = lv_line_create(parent);
lv_line_set_points(<name>, <name>_pts, 2);
lv_obj_set_pos(<name>, x, y);
```

Legacy components without endpoint properties resolve to start `(0,0)` and end `(width,height)`. Line colour uses semantic `surfaceBorder`. Line owns no runtime semantics, public API or hook; omission of an API remains intentional.

### Generated presentation ownership

- **Button Text:** generated firmware calls `lv_label_set_text(button_label, ...)`. There is no runtime transition, API or hook.
- **Text Value:** generated firmware calls `lv_label_set_text(label, ...)` and explicitly applies semantic `textPrimary` through `lv_obj_set_style_text_color(...)`. Legacy literal white does not override the semantic default. There is no runtime transition, API or hook.
- **Heading Text:** generated firmware calls `lv_label_set_text(heading, ...)` and explicitly applies semantic `textPrimary` through `lv_obj_set_style_text_color(...)`. Legacy literal white does not override the semantic default. There is no runtime transition, API or hook.
- **Clock Presentation:** generated firmware owns `hourFormat`, `showSeconds`, `blinkSeparator`, per-instance presentation state, RTC lookup and formatter generation. It does not own or serialize displayed time.

### Standard Wi-Fi presentation generated boundary

Standard Wi-Fi presentation remains owned by existing generated polling and `fg_wifi_status_text()` mapping. It generates no new public setter or developer hook. Canvas, Browser Preview and generated output preserve the established three-line structure:

```text
WIFI
WIFI_FAIL
IP: -
```

Generated output must not substitute `DISCONNECTED`, enable wrapping that creates an additional clipped line, or move Wi-Fi behavior into preview code. Runtime state mapping, silent startup and existing ownership remain unchanged.

### Clock generated runtime ownership

Each Clock owns presentation configuration, a generated formatter, RTC lookup, separator blinking and per-instance label/timer/separator state. Displayed time is never serialized and Clock Time is never editable. RTC/system time remains authoritative. Generated firmware exposes neither `FG_Set_Clock_Time` nor `FG_On_Clock_Changed`.

Interactive Status Indicator remains a setter-only Binary Output Runtime asset with no event hook. It is distinct from the standard `Led` widget.

System Runtime is generated platform code. Its current implementation uses persistent Application, System Launcher, Display / Brightness and Wi-Fi Manager containers, one lazily created persistent Storage Browser container and one lazily created reusable native LVGL keyboard. Hosted Connectivity Runtime is platform infrastructure, not an Interactive Asset runtime.

```text
Application
→ System
→ Brightness
→ System
→ Application
```

Navigation currently switches container visibility. It does not recreate the application or its Interactive Assets. Interactive Assets remain alive while System pages are active.

For all five placed Interactive Asset component branches, persisted Canvas `x/y/w/h` is the generated geometry source of truth. State-image controls use that final geometry for the parent object or transparent container and centre a non-clickable child image inside it. Every required state shares one safe contain-fit scale; state switching changes only the source, not geometry. Dimension resolution uses uploaded-asset registry metadata, PNG IHDR dimensions and generated LVGL descriptors, with scale 256 only as the final safe fallback and valid scales above or below 256. Linked fitted assets are consumed automatically when their IDs replace the original state references. Browser Preview wrappers preserve persisted component geometry, and type-specific preview renderers perform contain-fit rendering inside those bounds. Browser Preview therefore follows the same component-authoritative geometry model as Canvas and generated LVGL.

Interactive Asset API direction remains unchanged:

```text
Button         -> FG_On_*_Clicked(void)
Toggle         -> FG_On_*_Toggled(bool enabled)
Three-Position -> FG_On_*_Changed(fg_three_way_state_t state)
Light/Status   -> FG_Set_*(bool enabled)
```

```text
ForgeUI Canvas
        │
        ▼
generateForgeUILvglCode()
        │
        ▼
Generated LVGL Source
Generated Button, Toggle and Three-Position hook metadata
Generated Binary Output public API metadata
Generated Asset Source List
        │
        ▼
Client Export Preflight
        │
        ▼
POST /export
        │
        ▼
Server Export Validation
        │
        ▼
Validated Asset Sources
        │
        ▼
Export Server
        │
        ▼
Generated Firmware Files
        │
        ▼
ESP-IDF Build
        │
        ▼
ESP32-P4
```

The generated output-control path is:

```text
Developer application logic
        ↓
Generated FG_Set_* public APIs
        ↓
Shared Binary Output Runtime
        ↓
Generated LVGL Runtime
        ↓
ESP32-P4 Display
```

Interactive Light and Interactive Status Indicator both use this path. The output runtime is no longer a Light-only implementation.

The generated input-control path is:

```text
UI interaction
        ↓
Generated LVGL runtime
        ↓
Generated FG_On_* hook
        ↓
95_UserEvents.c
        ↓
Developer application logic
```

The generated System Runtime path is:

```text
Application
        ↓
Gear Launcher
        ↓
System Runtime
        ↓
Display / Brightness
        ↓
FG_Set_Display_Brightness()
        ↓
bsp_display_brightness_set()
        ↓
ESP32-P4 Backlight
```

The generated Wi-Fi path within the same System Runtime is:

```text
Wi-Fi Manager presentation and UI intent
        ↓
structured snapshot/network projection
        ↓
30_WIFI backend
        ↓
ESP-IDF
        ↓
ESP-Hosted
        ↓
ESP32-C6
```

System Runtime is generated. It does not generate developer callbacks and is not an Interactive Asset. `FG_Set_Display_Brightness()` is an internal generated hardware bridge, not a public User Events API.

Current generated System pages are:

- Application
- System Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

The generated Wi-Fi Manager owns LVGL presentation, a structured selectable network list, Connected and Saved badges, password and forget dialogs, a password textarea, Show / Hide, native keyboard attachment, Connect, Disconnect, Reconnect, Forget, connected details, status, RSSI, gateway, security, station MAC, AP BSSID and periodic backend snapshot projection. Scan and Refresh both invoke the same `fg_wifi_scan_start()` backend path and initiate scan intent only. Generated LVGL never performs Hosted scanning itself; it projects completed backend models, rebuilds SSID row presentation from completed network data, and owns row visibility and layout only. It does not own `esp_wifi_init()`, scanning implementation, credentials, reconnect policy, DHCP, Hosted transport or ESP-IDF APIs; those remain `30_WIFI` backend responsibilities.

The generated Storage Browser owns demand-created UI, timer, worker, queue, mutex, reusable row pool, paging and internal callbacks. Back requests an asynchronous worker shutdown; generated code deletes resources only after acknowledgement. `40_SD.c` separately owns filesystem/backend state.

## Hosted Connectivity Runtime

The generated-to-platform boundary is:

```text
Generated LVGL Wi-Fi Manager
        ↓
internal generated callbacks
        ↓
30_WIFI backend
        ↓
ESP-IDF Wi-Fi
        ↓
ESP-Hosted
        ↓
ESP32-C6
```

Generated code renders state. The non-generated firmware backend owns transport and physical Wi-Fi truth. Hosted scanning executes inside that backend through a blocking Hosted scan. AP count and AP records are retrieved immediately afterward in the same backend task, copied into owned runtime storage, deduplicated by SSID with strongest-record retention, sorted by Connected state and RSSI, and atomically installed as one completed model before LVGL projection. Hosted Connectivity Runtime is generated platform infrastructure and must not enter any Interactive Asset runtime family.

## Storage Runtime Boundary

The generated-to-platform boundary is:

```text
Generated Storage Runtime
        ↓
40_SD backend
        ↓
SDMMC Slot 0
        ↓
FAT filesystem
```

Generated code owns:

- page navigation
- projection
- row rendering
- selection
- paging
- callbacks

The backend owns:

- filesystem
- directory enumeration
- empty-folder detection
- deletion
- Read / Write Test
- SD state

Generated LVGL owns presentation and user intent only. Filesystem truth and operations remain in `40_SD.c/.h`.

The reusable asset-generation path feeding those runtime families is:

```text
ForgeUI Canvas
        |
        v
Open Creator
        |
        v
Designer
        |
        v
State Sheet generation
        |
        v
Linked crop workspace
        |
        v
Atomic uploaded-asset registration
        |
        v
Export
        |
        v
Generated runtime
        |
        v
ESP32-P4
```

Direct Creator entry points now cover all five Interactive Assets: Button, Toggle Switch, Three-Position Toggle Switch, Light and Status Indicator. Their private navigation targets are:

```text
interactive-button-designer
interactive-toggle-switch-designer
interactive-three-position-toggle-designer
interactive-light-designer
interactive-status-indicator-designer
```

These entry points select the current Canvas component and its linked Interactive Asset. The Creator and State Sheet pipeline prepares or edits the Interactive Asset and uploaded state images consumed by export; it does not replace or redefine the generated runtime-family contracts. In particular, Status Indicator Creator navigation does not change the generated Binary Output API direction or `FG_Set_*` contract.

`Fit Bounds to Visible Artwork` is an explicit design-time asset operation for Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON, Status Indicator OFF/ON and Three-Position LEFT/CENTER/RIGHT. It measures state artwork before export, calculates one stable union across the required states, creates same-size linked cropped uploaded assets, preserves original uploads, updates the existing Interactive Asset state IDs and remains idempotent. Export consumes whichever uploaded asset IDs the Interactive Asset currently references. Export does not perform alpha cropping, and fitting adds no firmware API or transport metadata.

## Export Validation Ownership

Export validation is a permanent two-boundary responsibility. It validates the exporter result before materialization without moving runtime generation out of the exporter.

### Client Validation

#### `studio/src/forgeui/ForgeUIExportValidation.ts`

Owns:

- Canvas validation
- Interactive Asset validation
- dimension validation
- duplicate component-ID detection
- uploaded-asset and LVGL-readiness validation
- generated Button, Toggle and Three-Position hook presence and naming validation
- generated Binary Output setter API validation
- Normal/Pressed, Toggle OFF/ON, Three-Position LEFT/CENTER/RIGHT and Binary Output OFF/ON uploaded-state validation
- generated asset-source validation
- structured, ownership-grouped diagnostics

It validates. It does not generate LVGL, firmware, hooks, setters, CMake, or runtime behavior.

The client currently validates expected hook names against `userEventHooks`, setter declarations against `publicApiDeclarations`, kind/state references, image readiness and duplicate generated identifiers. Generated enum and runtime-structure text is covered by exporter regression tests; it is not a separate client diagnostic category, so this map does not attribute unimplemented declaration parsing to the preflight.

Client validation runs after candidate source and metadata generation and before the request is sent to the export server. A failure cancels export before server submission.

### Server Validation

#### `studio/export-server.js`

In addition to materialization, the server owns:

- payload validation
- generated C-source validation
- physical generated-source existence checks
- relative path validation
- expected-symbol and generated-code reference checks
- construction of the validated asset-source list
- validation before filesystem mutation

The server does not trust client validation. No generated firmware files are written before server validation succeeds.

## Permanent input and output API model

ForgeUI controls cross the generated/developer boundary in one of two directions, with three distinct input signatures.

### Input controls: generated UI calls developer code

Input controls originate in the UI runtime and notify application code through generated developer hooks.

Input contracts:

```c
/* Momentary input: Interactive Button */
void FG_On_<Name>_Clicked(void);

/* Persistent binary input: Interactive Toggle Switch */
void FG_On_<Name>_Toggled(bool enabled);

/* Persistent three-state input: Interactive Three-Position Toggle */
void FG_On_<Name>_Changed(fg_three_way_state_t state);
```

Generated Three-Position state type:

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

Input flow:

```text
Interactive Button
        ↓
LVGL CLICKED event
        ↓
Generated runtime callback
        ↓
FG_On_Button_Clicked()
        ↓
95_UserEvents.c
        ↓
Developer application logic
```

### Output controls: developer code calls generated UI

Output controls expose public functions implemented by generated UI code. Application code calls those functions to change LVGL objects.

Proven example:

```text
Developer application logic
        ↓
FG_Set_Status_Light(true)
        ↓
Shared Binary Output Runtime
        ↓
LVGL image source changes
        ↓
Physical Light displays ON state
```

```c
FG_Set_Status_Light(true);
FG_Set_WiFi_Status(true);
```

Both public APIs are implemented in generated UI code and delegate to the same generated Binary Output Runtime.

### Permanent rule

> Inputs produce generated developer hooks. Outputs expose generated public UI functions.

Input hooks may be void click hooks, bool state hooks or strongly typed enum state hooks. Outputs continue to expose `void FG_Set_<Name>(bool enabled);`.

Do not implement output controls as fake click hooks. Do not put input-event application logic inside generated UI code.

Standard selection and presentation direction:

```text
TabView touch
  ↓
generated retained runtime
  ↓
FG_On_Tab_View_Changed()

Tileview touch
  ↓
generated retained runtime
  ↓
FG_On_Tileview_Changed()

Button / Text / Heading Inspector
  ↓
serialized presentation property
  ↓
generated LVGL text
  ↓
no runtime transition

RTC
  ↓
generated Clock formatter
  ↓
generated LVGL label
  ↓
no developer callback or hook
```

### System Runtime: generated platform code remains internal

The generated System Runtime owns:

- `FG_Set_Display_Brightness()`
- System page switching
- container visibility state
- gear launcher behavior
- Brightness slider behavior
- current-session brightness value
- System Runtime page state
- Wi-Fi Manager LVGL presentation, structured network rows and badges
- password and forget dialogs, native keyboard and connected details
- Scan and Refresh callbacks that invoke the same backend scan-intent path
- selection, Connect, Disconnect, Reconnect and Forget callbacks
- periodic structured backend snapshot/network projection
- completed-model row visibility and list-layout projection
- projection pause while password entry is active
- internal Wi-Fi System navigation
- lazy Storage page/worker creation and acknowledged teardown
- reusable Storage row pool, paging and row rendering
- Storage status projection
- Storage Refresh and Read / Write Test callbacks
- Select Item mode
- Delete Empty Folder workflow and callbacks

These responsibilities remain internal to generated `90_Studio_Export.c`. They are not added to `userEventHooks`, do not create declarations or stubs in `95_UserEvents.*`, and are not part of the public developer callback API.

The generated System Runtime does not own Hosted scan execution, AP retrieval, credentials, reconnect policy, transport, DHCP or ESP-IDF calls. Those responsibilities belong to `30_WIFI.c`. Generated LVGL projects completed backend snapshots and network models only.

### Generated Wi-Fi API boundary

No Wi-Fi User Event hooks are generated. No Wi-Fi public setter APIs are generated. The Wi-Fi System Runtime remains internally generated.

The generated page owns presentation, password dialog, reusable keyboard, network rows, row visibility and layout, connected details, completed-model backend projection and UI intent. Scan and Refresh both call `fg_wifi_scan_start()`. It consumes completed `fg_wifi_snapshot_t` and `fg_wifi_network_t` models from `30_WIFI`; it never becomes the source of physical Wi-Fi truth or performs Hosted scanning. Scanning implementation, AP retrieval, persisted credentials, reconnect policy, transport, DHCP and ESP-IDF remain backend-owned. Physical firmware currently supports one persisted ESP-IDF STA configuration, not a multi-network credential database. `95_UserEvents.c` remains unrelated to the Wi-Fi System UI.

## Hosted configuration boundary

Generated firmware assumes the proven Hosted configuration supplied by `firmware/ForgeUI-One/sdkconfig.defaults`:

- ESP-Hosted enabled
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
- reset delay 1500 ms
- restart on failure
- Wi-Fi Remote Hosted backend
- ESP32-C6 target

Generated firmware never hardcodes these values. They come from ESP-IDF configuration.

## LVGL code generator

### Primary file

```text
studio/src/forgeui/ForgeUILvglExport.ts
```

### Primary function

```ts
generateForgeUILvglCode()
```

This is the only LVGL UI exporter.

Runtime generation assumes that its candidate result will pass the dedicated client and server validation boundaries before materialization. Validation policy is not mixed into runtime generation.

### Owns

- LVGL object generation
- widget creation
- image declarations
- uploaded asset-source collection
- shared runtime structures
- shared runtime callbacks
- shared Binary Output Runtime
- generated Binary Output runtime records
- Interactive Button export
- Interactive Light export
- Interactive Status Indicator export
- Interactive Toggle Switch export
- Interactive Three-Position Toggle export
- shared Toggle Input Runtime and per-instance records
- shared Three-Position Input Runtime and per-instance records
- reusable native System keyboard generation, lazy creation and `lv_keyboard_set_textarea()` attachment
- Keyboard top-layer ownership, top-left alignment, explicit styles, callbacks and final physical geometry
- export of uploaded assets produced by Toggle and Three-Position State Sheet workflows
- current direct Creator integration through the component and uploaded-asset model
- final persisted component geometry for all five Interactive Asset branches
- component-sized transparent parent or container generation where applicable
- centred non-clickable child image generation
- shared two-state contain-fit scaling for Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON through the common Binary Output path
- shared three-state contain-fit scaling for Three-Position LEFT/CENTER/RIGHT
- uploaded-asset registry dimension metadata consumption
- PNG IHDR dimension recovery
- generated LVGL descriptor-based dimension fallback
- safe scale-256 fallback and scale values above or below 256
- linked cropped state-asset consumption
- Toggle and Three-Position hook naming and metadata
- input callback-name uniqueness across all hook families
- shared Binary Output Runtime generation
- shared Binary Output setter generation
- per-instance Binary Output runtime record generation
- Button hook generation and metadata
- generated public output APIs and declaration metadata
- calls from generated runtime code into developer hooks
- uniqueness of generated hook and setter names
- standard-component retained LVGL objects
- standard-component retained runtime state
- standard-component transition helpers
- standard-component generated event callbacks
- standard-component public APIs and hook metadata
- native QR Code object construction, serialized colors/quiet zone/data and setter-only text updates
- deterministic sanitized collision-safe standard-component names
- TabView retained runtime generation
- Tileview retained coordinates and native four-page generation
- Button Text generation
- Text Value generation
- Heading Text generation
- Clock Presentation and formatter generation
- Clock RTC field integration and per-instance presentation state
- persistent application container generation
- System launcher container generation
- Brightness container generation
- complete Wi-Fi Manager container, status, connected details and structured selectable rows
- lazy Storage page/worker creation and acknowledged teardown
- reusable Storage rows, paging and projection
- Storage Refresh and Read / Write Test callbacks
- Storage Select Item mode
- Delete Empty Folder callback and workflow
- Connected and Saved presentation
- password and forget dialogs, password textarea, Show / Hide and validation
- internal Scan, Refresh, selection, Connect, Disconnect, Reconnect and Forget callbacks
- native keyboard callbacks and password attachment
- periodic structured backend projection
- projection pause while password entry is active
- generated gear launcher
- generated Back navigation
- container visibility switching
- generated Brightness slider and percentage label
- current-session System brightness state
- internal `FG_Set_Display_Brightness()` bridge
- `bsp_display_brightness_set()` hardware integration

### Does not own

- writing files to disk
- ESP-IDF project copying
- CMake file writing
- customer hardware behavior
- developer application logic
- GPIO, sensors, motors, relays, networking policy, or business logic

Interactive Light introduced the Binary Output Runtime. Interactive Status Indicator reuses it through the same export descriptor, exported geometry, runtime-record, and setter-generation path. Both use a transparent component-sized container, centred child image and common contain-fit scaling. The previous Status Indicator legacy direct-image export path no longer exists.

The exporter emits Three-Position runtime code that uses `fg_three_way_state_t`; the enum itself is materialized by the user-event header generator in `95_UserEvents.h`.

Do not create a separate Button, Toggle, Three-Position, Light or Status Indicator exporter, or a parallel runtime generator.

The same exporter owns the built-in System Runtime. It creates the Application, System Launcher, Display / Brightness and Wi-Fi Manager containers once, lazily creates and reuses the persistent Storage Browser container, then generates internal callbacks that switch `LV_OBJ_FLAG_HIDDEN`. It lazily creates one reusable top-layer native keyboard when password entry requires it. Interactive Assets remain instantiated inside the application container. System controls do not contribute developer hook metadata. Generated Wi-Fi code projects structured backend state and sends UI intent; it does not implement scanning, credentials, DHCP, reconnect policy, ESP-IDF calls or Hosted transport. Generated Storage code owns page presentation, rows, paging, selection, callbacks and projection; it does not own filesystem operations, which remain in `40_SD.c/.h`.

## Component export traversal

Before export, Layout Designer has already resolved template structure and Auto Arrange geometry. The exporter walks the resulting ForgeUI component tree and selects the correct component branch. Its traversal owns:

- child traversal
- unique internal LVGL object names
- component position and size
- component-type dispatch
- asset-source collection
- recursive export of nested children
- semantic style generation
- object-name allocation
- runtime API and hook collection

It does not choose the Dashboard template, assign components to regions, compute Auto Arrange layouts, interpret AI region documents or modify region geometry at firmware runtime. Stable region keys are not developer-facing generated identifiers.

After placement, component geometry is authoritative. All five Interactive Asset branches use traversed component `x/y/w/h`; reusable Interactive Asset dimensions do not replace persisted component geometry during generation. Linked fitted state assets resolve through the normal kind-specific asset lookup when their IDs are current. The same persisted geometry feeds Browser Preview, live firmware and standalone export.

Current internal object names such as `obj1`, `obj2`, and `obj3` are implementation details. They are suitable for generated LVGL variables but are not the stable developer API.

Developer-facing hook and setter names are derived separately and made unique within an export.

For Keyboard, traversal geometry remains the source of truth. The branch emits map and mode configuration before explicit styles and final top-left position/size so native `lv_keyboard` defaults cannot replace the Canvas geometry.

## Generated export result contract

`generateForgeUILvglCode()` returns:

- generated LVGL `code`;
- `assetSources: string[]` containing generated C source paths required by the UI;
- `userEventHooks: string[]` containing sanitized unique Interactive Asset and standard-component hook metadata;
- `publicApiDeclarations` for Binary Output setters and standard-component public APIs.

These four properties are the complete current contract. Hook families share generalized metadata rather than introducing per-widget transport fields. Binary Output and standard-component declarations use `publicApiDeclarations: string[]`.

Layout Designer adds no `layoutRegions`, `layoutMetadata`, `template`, `autoArrange` or `aiDocument` field. Any layout metadata needed by Studio remains in project serialization and is resolved before generated firmware materialization.

The complete Standard Runtime reuses this contract. `userEventHooks` carries hook metadata for Input, Textarea, Switch, Checkbox, Radio, NumberInput, Select and IconButton. `publicApiDeclarations` carries declarations for Input, Textarea, Switch, Checkbox, Radio, Progress, CircularProgress, NumberInput, Select, Image, QRCode, Box, IconButton and the previously completed Standard runtime APIs. No transport field or generated-header system was added.

Scaling helpers, retained objects/state, transition helpers and resolved numeric scales live inside generated `code`. Linked fitted C sources appear in `assetSources` when fitting has replaced the Interactive Asset's state references. Intrinsic dimensions, alpha metadata, union bounds and crop coordinates do not become export payload fields. Hook metadata remains in `userEventHooks`, and generated public declarations remain in `publicApiDeclarations`.

The UI export actions in `studio/src/components/Header.tsx` send these same four values to both export endpoints:

- `POST /export`
- `POST /export-idf-project`

Header forwards the validated Standard Runtime hook and declaration metadata unchanged. It does not invent APIs. The frontend owns code generation, metadata collection, client preflight, and transport. It does not write firmware files directly. Validation occurs before materialization.

## Generated Asset Source Contract

Every generated asset source included in an export must have:

- a valid relative path under the firmware source boundary;
- an existing generated C file;
- the expected LVGL symbol in that source;
- one unique source and symbol registration;
- successful validation before CMake generation.

Built-in Theme assets participate in this same contract. They are permanent generated firmware assets, not validation-exempt resources.

## State Sheet generation and export architecture

State Sheets are reusable generation workflows that produce the independent uploaded assets required by existing runtime families.

### Toggle State Sheet

The Toggle State Sheet Builder uses one master image containing OFF and ON artwork. Two linked crop regions retain a shared crop size while allowing independent positions. Confirming the crops extracts the two state images and registers OFF and ON together.

### Three-Position State Sheet

The Three-Position Creator uses this current path:

```text
Create Three-Position Toggle Set
        |
        v
One master State Sheet request
        |
        v
Linked crop workspace
        |
        v
LEFT / CENTER / RIGHT crops
        |
        v
Atomic uploaded-asset registration
        |
        v
Generated Three-Position runtime
```

The three crop regions share dimensions. Their positions remain independently adjustable, and row remapping can swap which cropped row becomes LEFT, CENTER, or RIGHT without generating another master. This replaces any earlier implication that Three-Position artwork is created by three independent image-generation requests.

`studio/src/forgeui/ai/InteractiveAssetAIGenerator.tsx` owns the Creator/Designer state, the single Three-Position set request, crop confirmation, and state-row assignment. `studio/src/forgeui/ai/StateSheetOverlay.tsx` owns the linked crop-region geometry and resize behavior. Direct Canvas entry is routed by `ForgeUINavigation.ts` and `PreviewContainer.tsx`; those files select context but do not generate firmware.

### AI image pipeline ownership

`studio/src/forgeui/ai/ForgeUIAIImagePipeline.ts` owns crop extraction and registration:

1. receive the single generated master;
2. represent crop results as PNG data URLs;
3. decode the Base64 PNG payloads into files for conversion;
4. convert all requested state crops;
5. register the completed uploaded assets in one atomic batch;
6. update the Interactive Asset draft only after the batch succeeds.

`Confirm Crops` is the commit boundary. The active crop-registration path does not depend on temporary blob URLs; PNG data URLs survive the crop-to-conversion handoff. A partial conversion must not partially register a state set.

State Sheet generation belongs to asset preparation. Export still resolves the resulting uploaded assets through the normal generated asset-source contract.

## Interactive Button input API

### Export branch

The `InteractiveButton` exporter branch owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Button asset by kind;
3. resolving Normal and Pressed uploaded assets;
4. using the preflight-validated Normal and Pressed image metadata;
5. adding required asset C files;
6. declaring LVGL images;
7. using final persisted component geometry for the parent LVGL button;
8. creating the child LVGL image;
9. resolving both state dimensions through registry metadata or PNG IHDR;
10. calculating one safe Normal/Pressed contain scale;
11. emitting the descriptor-based contain-scale helper call when Studio dimensions are unavailable;
12. centring the scaled child image;
13. creating per-button runtime data;
14. attaching the shared Button event callback;
15. collecting the unique generated click hook.

Button runtime generation assumes validated image assets. It does not perform late export validation while emitting runtime code.

The Button contain-fit helper evaluates both Normal and Pressed descriptor widths and heights against final component `w/h`. Both states use the same scale, so press transitions do not change placement. Reliable Studio dimensions produce a numeric scale; generated `lv_image_dsc_t.header.w/h` supplies the legacy runtime fallback, and invalid descriptors return scale 256.

### Proven runtime data

```c
typedef struct
{
    const void * normal_src;
    const void * pressed_src;
    void (*clicked_cb)(void);
    const char * event_name;
} fg_interactive_button_data_t;
```

Each exported Button instance carries:

- its Normal image source;
- its Pressed image source;
- its generated developer callback pointer;
- its generated event name for runtime diagnostics.

This is implemented behavior, not a proposed extension.

### Shared Button callback

```c
static void fg_interactive_button_event_cb(lv_event_t *event)
```

One shared callback serves every exported Interactive Button. Per-instance runtime data supplies the correct images and developer hook.

Behavior:

```text
LV_EVENT_PRESSED
  → select Pressed image

LV_EVENT_RELEASED or LV_EVENT_PRESS_LOST
  → restore Normal image

LV_EVENT_CLICKED
  → print the generated event name
  → call clicked_cb when non-null
```

Do not generate one LVGL callback implementation per Button.

### Instance wiring

Each ready Button instance initializes data equivalent to:

```c
static fg_interactive_button_data_t obj1_data = {
    .normal_src = &normal_symbol,
    .pressed_src = &pressed_symbol,
    .clicked_cb = FG_On_Button_Clicked,
    .event_name = "FG_On_Button_Clicked",
};
```

It registers the shared callback for:

- `LV_EVENT_PRESSED`
- `LV_EVENT_RELEASED`
- `LV_EVENT_PRESS_LOST`
- `LV_EVENT_CLICKED`

The visual-state runtime and click-hook runtime are parts of the same generated Button implementation.

When visible-artwork fitting has been applied, `normalAssetId` and `pressedAssetId` resolve to the linked stable-union crops. Export collects those cropped C sources; it does not modify or export through the superseded original references unless another active asset still uses them.

### Button hook naming

Each exported Interactive Button receives one unique hook using the `FG_On_*_Clicked` contract.

Examples:

```c
void FG_On_StartPump_Clicked(void);
void FG_On_StopPump_Clicked(void);
void FG_On_ResetAlarm_Clicked(void);
```

The exporter prevents duplicate hook names by adding a suffix when necessary. Generated C identifiers are sanitized; developer code must use the exact emitted hook name.

### Button hook metadata path

```text
InteractiveButton component
        ↓
unique FG_On_*_Clicked name
        ↓
userEventHooks returned by generateForgeUILvglCode()
        ↓
Header export payload
        ↓
export-server.js
        ↓
generateUserEventFiles()
        ↓
95_UserEvents.h declaration
95_UserEvents.c implementation stub
```

## Interactive Toggle Switch input API

### Export branch

The `InteractiveToggleSwitch` export path:

1. resolves the Toggle Switch by kind;
2. resolves OFF and ON uploaded assets;
3. collects the currently linked or original required generated C sources;
4. uses final persisted component position and size;
5. creates a full-size transparent parent LVGL button;
6. creates a centred non-clickable child image;
7. calculates one common OFF/ON contain scale;
8. recovers dimensions through registry metadata, PNG IHDR, `lv_image_dsc_t.header.w/h`, then safe scale 256;
9. creates an independent `fg_toggle_input_t` record;
10. initializes from the saved state through `fg_toggle_input_set(..., notify=false)`;
11. attaches `fg_toggle_input_event_cb()`;
12. generates a unique `FG_On_*_Toggled` name and adds it to `userEventHooks`.

State changes replace the child image source without changing position, scale or parent geometry. The `fg_toggle_input_t`, `fg_toggle_input_set()`, `fg_toggle_input_event_cb()` and `void FG_On_<Name>_Toggled(bool enabled);` contracts are unchanged.

### Shared Toggle Input Runtime

Actual generated structure:

```c
typedef struct {
    lv_obj_t * button;
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
    void (*toggled_cb)(bool);
} fg_toggle_input_t;
```

Shared helpers:

```c
fg_toggle_input_set()
fg_toggle_input_event_cb()
```

Behavior:

```text
LV_EVENT_CLICKED
  → invert enabled
  → store independent instance state
  → update OFF/ON artwork
  → invoke toggled_cb(new bool state)
```

The structure, setter and event callback are emitted once. Each Toggle instance owns its button, image, sources, state and callback pointer.

### Generated Toggle hook

```c
void FG_On_Main_Power_Toggled(bool enabled);
```

`generateUserEventFiles()` produces a live stub that prints `ON` or `OFF`. Initialization uses `notify=false`, so loading the configured initial state does not call developer code.

## Interactive Three-Position Toggle input API

### Generation workflow and unchanged runtime contract

Three-Position artwork now comes from one master State Sheet request and three confirmed crops. Export still receives three independent uploaded assets, one each for LEFT, CENTER, and RIGHT. The public enum, generated callback, per-instance runtime record, and touch behavior are unchanged; only the generation workflow changed.

### Generated public enum

`fg_three_way_state_t` is generated in `95_UserEvents.h`, not `90_Studio_Export.h`. Generated `90_Studio_Export.c` includes `95_UserEvents.h` before using the type in runtime records and callback pointers, and developer implementations include the same header.

```c
typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;
```

### Export branch

The `InteractiveThreePositionToggleSwitch` export path:

1. resolves the asset by kind;
2. resolves LEFT, CENTER and RIGHT uploaded assets;
3. collects all currently linked or original required C sources;
4. generates a unique `FG_On_*_Changed` name and adds it to `userEventHooks`;
5. uses final persisted component position and size for the full transparent rectangular parent button;
6. creates a centred non-clickable child image;
7. resolves dimensions through registry metadata, PNG IHDR, LVGL descriptors and the safe scale-256 fallback;
8. applies one common LEFT/CENTER/RIGHT contain scale, including values above or below 256;
9. creates an independent `fg_three_way_input_t` record;
10. initializes the saved enum state with `notify=false`;
11. attaches the one shared `fg_three_way_input_event_cb()`.

### Shared Three-Position Input Runtime

Actual generated structure:

```c
typedef struct {
    lv_obj_t * button;
    lv_obj_t * image;
    const void * left_src;
    const void * center_src;
    const void * right_src;
    fg_three_way_state_t state;
    void (*changed_cb)(fg_three_way_state_t state);
} fg_three_way_input_t;
```

`fg_three_way_input_set()` validates state, stores it, selects the correct source, updates the image and optionally calls `changed_cb`. Initialization passes `notify=false`.

`fg_three_way_input_event_cb()` converts the absolute pointer coordinate into button-local space:

```c
local_x = point.x - button_coords.x1;
```

```text
first third  → FG_THREE_WAY_LEFT
middle third → FG_THREE_WAY_CENTER
last third   → FG_THREE_WAY_RIGHT
```

The parent button owns the full rectangular hit area. The child image is non-clickable, and parent and child are non-scrollable. Transparent artwork does not shrink the interaction bounds.

### Generated Three-Position hook

```c
void FG_On_ModeSelector_Changed(fg_three_way_state_t state);
```

The generated live stub maps enum values to readable `LEFT`, `CENTER` and `RIGHT` output. One shared runtime is emitted; per-instance state, artwork and callback pointers remain independent.

## Interactive Light output API

### Export preparation and branch

Interactive Light export owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Light asset by kind;
3. resolving OFF and ON uploaded assets;
4. using the preflight-validated OFF and ON image metadata;
5. adding required asset C files;
6. creating a transparent container from final persisted component geometry;
7. creating a centred non-clickable child LVGL image;
8. resolving both state dimensions through registry metadata or PNG IHDR;
9. calculating one safe OFF/ON contain scale;
10. emitting the descriptor-based contain-scale helper call when Studio dimensions are unavailable;
11. selecting its initial source from saved `initialState`;
12. creating a unique public setter name;
13. emitting the setter implementation;
14. returning its declaration as public API metadata.

Light runtime generation likewise assumes validated image assets and API metadata. It does not perform late export validation while emitting runtime code.

### Runtime object behavior

Interactive Light is an output indicator, not an input control.

- It is emitted as an LVGL image.
- The image is centred inside a transparent component-sized container.
- Final container position and size come from persisted component `x/y/w/h`.
- OFF and ON use one common contain scale.
- State switching changes only the image source, not scale, centre or container geometry.
- The object remains non-clickable.
- It has no Button-style event callback.
- It produces no hook in `95_UserEvents`.
- Its initial OFF/ON image follows the saved `initialState`.

The Light contain-fit helper evaluates both OFF and ON descriptor dimensions against final component geometry. Dimension ownership follows the same chain as Button:

```text
Uploaded Asset Registry metadata
  → PNG IHDR dimensions
  → generated lv_image_dsc_t.header.w/h
  → safe scale 256
```

When visible-artwork fitting has been applied, Light resolution and `assetSources` use the linked stable-union OFF/ON crops. Original uploads remain unchanged and are exported only when still actively referenced elsewhere.

### Proven public setter

Example declaration:

```c
void FG_Set_Status_Light(bool enabled);
```

The generated implementation delegates to the Light instance's Binary Output runtime record:

```c
void FG_Set_Status_Light(bool enabled)
{
    fg_binary_output_set(&fg_status_light_output, enabled);
}
```

Contract:

```text
false → OFF artwork
true  → ON artwork
```

Setter names use `FG_Set_*`. Duplicate API names receive a numeric suffix.

### Binary Output public declaration metadata path

```text
InteractiveLight or InteractiveStatusIndicator component
        ↓
unique FG_Set_* name
        ↓
setter implementation in generated LVGL code
        ↓
publicApiDeclarations returned by generateForgeUILvglCode()
        ↓
Header export payload
        ↓
export-server.js
        ↓
generateStudioExportHeader()
        ↓
declaration in 90_Studio_Export.h
```

The export server validates declarations against the supported setter signature before writing them:

```c
void FG_Set_<Name>(bool enabled);
```

## Binary Output Runtime

The generated Binary Output Runtime is the permanent implementation family for two-state output assets.

It is unrelated to Toggle Input even though both cross an API boundary with a boolean:

```text
Toggle Switch: UI changes state → developer hook receives bool
Binary Output: developer calls setter → UI changes state
```

Generated runtime structure:

```c
typedef struct
{
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
} fg_binary_output_t;
```

Generated state-change function:

```c
static void fg_binary_output_set(
    fg_binary_output_t * output,
    bool enabled
)
{
    if (!output || !output->image)
    {
        return;
    }

    output->enabled = enabled;
    lv_image_set_src(
        output->image,
        enabled ? output->on_src : output->off_src
    );
}
```

This structure and function are generated once per export. Interactive Light introduced them; Interactive Status Indicator reuses them unchanged.

The Binary Output API contract is unchanged by contain scaling. `fg_binary_output_set()` continues to switch only `image` source. Light and Status Indicator object creation use final component geometry, a transparent component-sized container, a centred child image and one shared OFF/ON scale before the runtime record is used.

Every exported Binary Output instance creates its own `fg_binary_output_t` record containing its LVGL image, OFF source, ON source, and saved state. Multiple records remain independent even when instances reuse the same artwork.

Every generated Binary Output setter calls `fg_binary_output_set()` with its own record. Future Binary Output assets must reuse this implementation rather than emit another binary state structure or switching function.

## Native LVGL Keyboard generated runtime ownership

The generated System Runtime owns one physically proven reusable native `lv_keyboard`, whose internal key surface is LVGL's native `lv_buttonmatrix`. It is created lazily when a System password field requires text entry, retained as one reusable instance and reattached through `lv_keyboard_set_textarea()`.

The exporter owns this runtime contract:

1. create the password textarea with password masking enabled;
2. open from textarea focus or click through an idempotent helper;
3. lazily create one `lv_keyboard` parented to `lv_layer_top()`;
4. apply `LV_OBJ_FLAG_IGNORE_LAYOUT` and `LV_OBJ_FLAG_FLOATING`;
5. associate the active textarea through `lv_keyboard_set_textarea()`;
6. select `LV_KEYBOARD_MODE_TEXT_LOWER`, retaining native lowercase, uppercase/shift, number, symbol, space, Backspace and Done behavior;
7. apply explicit ForgeUI main/item styles;
8. replace the native default alignment with `LV_ALIGN_TOP_LEFT`;
9. apply physical top-layer position `(0, 350)` and size `1024 × 250`;
10. move the keyboard to the foreground and reposition the password dialog while entry is active;
11. detach and hide the keyboard on Done or Cancel.

No diagnostic colors, geometry-debug styling or verbose runtime logging belong to this final architecture.

The control-width map uses LVGL's numeric buttonmatrix width units combined with control flags. Normal alpha widths and special-key widths are normalized row by row; Space remains deliberately wider, while mode, Backspace, Enter, arrows and confirm retain only the relative width required by the Studio layout. These are proportional controls, not screen-resolution compensation.

Current row width units are:

```text
row 1: 1#/alpha/Backspace = 4
row 2: ABC/alpha/Enter     = 3
row 3: symbol/alpha keys   = 1
row 4: keyboard/left       = 2, Space = 12, right/confirm = 2
```

Keyboard export therefore owns:

- lazy creation and one reusable instance;
- `lv_layer_top()` ownership;
- `lv_keyboard_set_textarea()` attachment;
- password input, Done and Cancel interaction;
- password Show / Hide through the surrounding generated dialog;
- `LV_ALIGN_TOP_LEFT` correction for the native `lv_keyboard` default alignment;
- four-row map order;
- relative buttonmatrix width map;
- explicit main and item padding;
- explicit row and column gaps;
- explicit item font and line spacing;
- theme-preserving border, color and radius styles;
- map/mode/style/alignment/geometry call ordering;
- physically proven top-layer geometry and touch interaction;
- reusable System-dialog architecture without claiming future pages already consume it.

## Interactive Status Indicator output API

### Export preparation and branch

Interactive Status Indicator export owns:

1. reading `interactiveAssetId`;
2. resolving the Interactive Status Indicator asset by kind;
3. resolving OFF and ON uploaded artwork;
4. using the preflight-validated OFF and ON image metadata;
5. adding required asset C files without duplicating reused artwork sources;
6. creating a Binary Output export descriptor from final persisted component geometry;
7. creating a transparent component-sized container and centred non-clickable child image;
8. resolving dimensions through registry metadata, PNG IHDR, LVGL descriptors and safe scale 256;
9. applying the common Binary Output OFF/ON contain scale;
10. selecting its initial source from saved `initialState`;
11. creating a unique `fg_binary_output_t` runtime record;
12. creating a deterministic public setter name;
13. emitting a setter that delegates to `fg_binary_output_set()`;
14. returning its declaration as public API metadata.

The exporter consumes the final saved OFF/ON asset references and component geometry only. It does not export Creator navigation, Inspector onboarding, local Canvas preview click behavior or temporary design-time state. It emits one centred non-clickable child image, one independent `fg_binary_output_t` record and one generated `FG_Set_*` API per Status Indicator.

### Design-time preview versus generated runtime

- Canvas right-click can open the exact linked Status Indicator Creator.
- An unconfigured component opens a fresh unsaved draft.
- A new Status Indicator defaults to `120 × 72` on Canvas.
- Canvas and Browser Preview share centered contain-fit rendering that preserves intrinsic artwork aspect ratio.
- Canvas click may toggle a temporary local OFF / ON preview state for visual verification.
- Local preview toggling does not mutate saved `initialState`, persistence or generated firmware.
- The exported Status Indicator remains non-clickable, emits no user hook and changes runtime state only through `FG_Set_<Name>(bool enabled)`.

### Runtime behavior

- OFF artwork is stored in `off_src`.
- ON artwork is stored in `on_src`.
- the saved initial state initializes the instance independently.
- `false` selects OFF and `true` selects ON.
- multiple Status Indicator and Light records can coexist.
- no click callback is registered.
- no event hook or metadata is generated for `95_UserEvents.c/.h`.

Example generated record and setter:

```c
static fg_binary_output_t fg_wifi_status_output = {
    .image = NULL,
    .off_src = &wifi_status_off,
    .on_src = &wifi_status_on,
    .enabled = false,
};

void FG_Set_WiFi_Status(bool enabled)
{
    fg_binary_output_set(&fg_wifi_status_output, enabled);
}
```

Interactive Status Indicator contributes its setter declaration through `publicApiDeclarations`, exactly like Interactive Light. Only its per-instance record, artwork references, initial state, and setter name are unique; the Binary Output Runtime implementation remains shared.

## Generated UI files

### Layout Designer output in `90_Studio_Export.c`

A screen created from any implemented Layout Designer definition appears as ordinary generated LVGL objects: region `lv_obj` Boxes, Divider/Line presentation, Heading/Text labels, Charts, status indicators, Progress or Circular Progress, Buttons and other assigned controls.

`90_Studio_Export.c` contains no Layout Designer engine. It must not contain template selection, AI prompting, region-assignment logic, Auto Arrange calculations, Studio Inspector metadata or region drag/resize behavior. These are resolved before generation.

`90_Studio_Export.h` receives no Layout Designer declarations beyond APIs already generated by the contained normal components. `95_UserEvents.*` receives no Layout Designer hook family; it receives only hooks generated by actual contained interactive controls.

Example:

```text
Dashboard Controls region
  ├── Start Button
  ├── Stop Button
  └── Reset Button

Generated boundary:

Region Box
  → normal generated lv_obj
  → optional existing FG_Set_<Region>_Visible()

Buttons
  → normal generated LVGL buttons
  → existing behavior or hooks according to component type
```

The region creates no Start, Stop or Reset semantics. The contained controls own their existing runtime contracts.

### `90_Studio_Export.c`

Owns generated implementation:

- LVGL object creation
- generated component instances
- generated runtime structures
- shared runtime callbacks
- Button callback wiring
- Button parent geometry, shared Normal/Pressed contain scale and centred child image
- calls into Button user hooks
- shared Toggle Input Runtime, per-instance records and bool-hook calls
- shared Three-Position Input Runtime, per-instance records and enum-hook calls
- shared Binary Output Runtime and per-instance records
- reusable native keyboard instance, top-layer ownership, callbacks, textarea attachment and explicit styles
- final keyboard top-left alignment and physically proven `(0, 350)`, `1024 × 250` geometry
- Binary Output OFF/ON runtime image references
- Light component-sized container, shared OFF/ON contain scale and centred child image
- generated Button, Toggle, Three-Position and Binary Output LVGL descriptor fallback helpers
- Light public setter implementations
- Interactive Status Indicator public setter implementations
- Standard LVGL Component Runtime retained objects and state
- standard-component transition helpers and generated event callbacks
- standard-component public API implementations and calls into generated hooks
- TabView retained runtime, setter and touch callback
- Tileview native parent/pages, retained coordinates, silent setter and swipe callback
- retained Input and Textarea objects, current text and programmatic guards
- retained Switch, Checkbox and Radio objects and checked/selected state
- retained Progress value and range
- retained NumberInput textarea, value, range and step metadata
- retained Select dropdown, selected index and option count
- retained Image object and source pointer
- retained native QR Code object, serialized data/colors/quiet zone and text setter
- retained Box object and visibility
- retained IconButton object and enabled state
- generated Standard setters, LVGL event adapters and calls into genuine-user hooks
- serialized Button text generation
- serialized Text label generation
- serialized Heading label generation
- Clock Presentation defaults, RTC lookup, formatter, separator blinking and per-instance state
- generated System Runtime
- persistent Application, System Launcher, Display / Brightness and Wi-Fi Manager containers
- lazily created persistent Storage page
- Storage callbacks and row projection
- Storage paging and Select Item mode
- Delete Empty Folder UI workflow
- generated status, structured network rows, badges and connected details
- password and forget dialogs, password validation and Show / Hide
- internal Scan, Refresh, selection, Connect, Disconnect, Reconnect and Forget callbacks
- native keyboard callbacks and periodic structured backend projection
- generated gear launcher
- generated Back navigation and container visibility switching
- generated Brightness slider, percentage label and current-session value
- internal `FG_Set_Display_Brightness()` brightness control
- Waveshare backlight call through `bsp_display_brightness_set()`
- `fg_studio_export_create(...)`

These System additions are generated automatically with the application. They are replaceable runtime integration, not developer-owned product logic.

It must not contain customer product behavior or permanent application logic. The generated backlight bridge is built-in ForgeUI platform integration and remains internal. Wi-Fi credentials, scanning implementation, DHCP, reconnect policy, ESP-IDF calls and transport startup remain owned by `30_WIFI.c` and must not be generated. Storage filesystem operations remain owned by `40_SD.c/.h`.

### `90_Studio_Export.h`

Owns generated public declarations:

- `fg_studio_export_create(lv_obj_t *parent)`
- generated Binary Output `FG_Set_*` APIs for Light and Status Indicator
- generated Standard LVGL Component Runtime public APIs
- generated QR Code `FG_Set_<Name>_Text(const char * text)` declarations
- generated TabView and Tileview public setter declarations
- required public includes and C/C++ linkage guards

It does not contain user implementations.

The completed declarations include the new Text, Checked, Selected, Selected_Index, Value, Source, Visible and Enabled setter families. Required public types include `bool`, `int32_t`, `uint32_t`, `const char *` and `const void *`.

Divider, Scale, Line, Clock, Button Text, Text and Heading generate no runtime
declarations in `90_Studio_Export.h`. Runtime-enabled Icon instances generate
their declarations/implementations in `96_FiRuntime.h/.c`; 90 includes the 96
public header when present. The header includes the required LVGL, boolean and
fixed-width integer types, but does not own `fg_three_way_state_t`; that enum is
generated in `95_UserEvents.h`. Other public APIs remain implemented in generated
`90_Studio_Export.c`.

### Regeneration rule

`90_Studio_Export.c` and `90_Studio_Export.h` are generated and replaceable whenever Studio exports.

Never place developer application logic in them.

## Export Safety Boundary

Failed client or server validation preserves the previous generated state:

- `90_Studio_Export.c`
- `90_Studio_Export.h`
- `95_UserEvents.c`
- `95_UserEvents.h`
- generated asset sources
- generated `CMakeLists.txt`

These files remain unchanged until a successful export replaces them. Preservation on failed validation is part of the generated export API contract, not merely an implementation convenience.

## Default Theme Validation

Built-in generated Theme assets participate in validation exactly like uploaded assets. A missing built-in generated C file correctly stops export before firmware mutation.

The physical Build & Flash regression exposed missing Neural Core and Carbon Fiber sources. It was resolved by restoring the legitimate generated firmware assets and verifying their expected LVGL symbols. Validation was strengthened and retained; it was not bypassed or weakened.

## Generated user hook layer

### `95_UserEvents.h`

Studio generates declarations for all collected Interactive Asset and standard-component hooks and the Three-Position enum type:

```c
#pragma once

#include <stdbool.h>
#include <stdint.h>

typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;

#ifdef __cplusplus
extern "C" {
#endif

void FG_On_Start_Clicked(void);
void FG_On_Main_Power_Toggled(bool enabled);
void FG_On_ModeSelector_Changed(fg_three_way_state_t state);
void FG_On_Tab_View_Changed(uint32_t tab_index);
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
void FG_On_Search_Input_Changed(const char * text);
void FG_On_Notes_Textarea_Changed(const char * text);
void FG_On_Enable_Wi_Fi_Switch_Changed(bool checked);
void FG_On_Enable_Logging_Checkbox_Changed(bool checked);
void FG_On_Automatic_Mode_Radio_Changed(bool selected);
void FG_On_Target_Temperature_Number_Input_Changed(int32_t value);
void FG_On_Mode_Select_Changed(uint32_t index, const char * text);
void FG_On_Settings_Icon_Button_Clicked(void);

#ifdef __cplusplus
}
#endif
```

The generated UI includes this header when an Interactive Asset or standard component requires hooks.

### `95_UserEvents.c`

Studio preservation-merges Button, Toggle, Three-Position and standard-component hook implementations for the current live export. Existing matching developer implementations survive regeneration; missing declarations and missing stubs are appended. Stable server tests cover signatures, readable state output and body preservation. Representative stubs are:

```c
#include "95_UserEvents.h"
#include <stdio.h>

void FG_On_Button_Clicked(void)
{
    printf("[ForgeUI User Event] FG_On_Button_Clicked\n");
}

void FG_On_Main_Power_Toggled(bool enabled)
{
    printf("[ForgeUI User Event] FG_On_Main_Power_Toggled: %s\n", enabled ? "ON" : "OFF");
}

void FG_On_ModeSelector_Changed(fg_three_way_state_t state)
{
    const char * text = state == FG_THREE_WAY_LEFT ? "LEFT" : state == FG_THREE_WAY_RIGHT ? "RIGHT" : "CENTER";
    printf("[ForgeUI User Event] FG_On_ModeSelector_Changed: %s\n", text);
}
```

Interactive Light and Interactive Status Indicator do not add anything to these files. No Binary Output asset generates a hook in `95_UserEvents.c/.h`.

Default Input and Textarea stubs print text safely; Switch prints ON/OFF; Checkbox prints CHECKED/UNCHECKED; Radio prints SELECTED/UNSELECTED; NumberInput prints its integer value; Select prints index and text; and IconButton prints a click event. Matching developer bodies survive, missing declarations and stubs are appended, and unrelated hooks are not deleted.

Progress, Image, Box, Icon, Divider, Scale, Line, Clock, Button Text, Text and Heading add no hooks. There is no `FG_On_Clock_Changed`.

## Header Ownership

### `studio/src/components/Header.tsx`

Coordinates:

- Build & Flash
- Clean Build & Flash
- standalone ESP-IDF project export
- client preflight before export submission
- transport of validated exporter metadata
- transport of `userEventHooks` for Button, Toggle Switch, and Three-Position Toggle hooks
- transport of standard-component hook metadata
- transport of Binary Output and standard-component public API metadata

The exact exporter fields transported are `code`, `assetSources`, `userEventHooks`, and `publicApiDeclarations`. Hook and public-API metadata carry the exact signatures established by the exporter.

Header coordinates export and starts flashing only after export succeeds. It does not validate generated firmware files itself, invent hooks or setters, materialize files, or define runtime behavior.

Header does not transport Layout Designer templates or AI region documents to the firmware export server. It transports only the unchanged exporter result.

## Export server

### Primary file

```text
studio/export-server.js
```

### Owns

- receiving and validating generated code and API metadata
- validating payloads, paths, generated C sources, physical source existence, symbols, and source references
- producing the validated asset-source list
- normalizing supported public declarations
- merging supported public declarations
- merging all supported user-hook declarations and missing implementations
- preserving existing matching developer hook bodies and unrelated hooks
- generating `90_Studio_Export.h`
- generating `95_UserEvents.c/.h`
- writing generated files
- copying required image assets
- generating CMake source lists
- live firmware export
- standalone ESP-IDF project export
- project packaging and maintenance operations

### Does not own

- LVGL component generation
- Button, Toggle Switch, Three-Position Toggle, Light, or Status Indicator runtime behavior
- hook-name or runtime-API invention
- hook signature invention beyond materializing exporter metadata
- Light setter-name selection
- application logic
- customer hardware behavior

The server recognizes and materializes validated `const char *` text hooks, boolean checked/selected hooks, `int32_t` value hooks, `uint32_t` index-plus-text hooks and void click hooks. It normalizes Source, Visible, Enabled, Checked, Selected, Selected_Index, Text and Value setter declarations. It adds required includes and the Three-Position enum when needed.

The exporter decides API and hook names and signatures. The server validates, normalizes, preservation-merges and writes that metadata. It never invents runtime or widget behavior.

`export-server.js` does not interpret Dashboard templates, smart regions or Auto Arrange metadata. It validates and materializes already-generated LVGL through the unchanged four-field contract.

## Live firmware export

### Endpoint

```text
POST /export
```

The endpoint receives the exact payload fields `code`, `assetSources`, `userEventHooks`, and `publicApiDeclarations`. They carry generated C source, required assets, Interactive Asset and standard-component hooks, and Binary Output and standard-component public declarations.

It generates and writes:

- `firmware/ForgeUI-One/main/90_Studio_Export.c`
- `firmware/ForgeUI-One/main/90_Studio_Export.h`
- `firmware/ForgeUI-One/main/95_UserEvents.c`
- `firmware/ForgeUI-One/main/95_UserEvents.h`
- `firmware/ForgeUI-One/main/CMakeLists.txt`
- required generated image assets

The live `95_UserEvents.c/.h` files are safely regeneration-merged. Matching developer-written hook bodies and unrelated hooks are preserved; missing declarations and stubs are appended.

## Standalone ESP-IDF export

### Endpoint

```text
POST /export-idf-project
```

The endpoint creates an independent project under:

```text
C:\ForgeUI-Exports
```

The generated project contains:

```text
main/
├── 90_Studio_Export.c
├── 90_Studio_Export.h
├── 96_FiRuntime.c        # only when a Standard Icon runtime API is enabled
├── 96_FiRuntime.h        # only when a Standard Icon runtime API is enabled
├── 95_UserEvents.c
├── 95_UserEvents.h
├── required generated assets
└── CMakeLists.txt
```

Studio creates all four API-layer files at export time. Once the standalone project exists, its `95_UserEvents.c/.h` copies become the developer-owned integration layer for Interactive Asset and standard-component callbacks. Developer code calls Binary Output and standard-component APIs declared by `90_Studio_Export.h`. ForgeUI Studio does not continuously regenerate, build, flash, or synchronize that exported project.

Standalone developers call generated UI APIs through `90_Studio_Export.h` and implement genuine-event reactions in `95_UserEvents.c`:

```c
#include "90_Studio_Export.h"
#include "95_UserEvents.h"

void FG_On_Mode_Select_Changed(uint32_t index, const char * text)
{
    machine_set_mode(index);
}

void app_update_ui(void)
{
    FG_Set_Download_Progress_Value(75);
    FG_Set_Status_Box_Visible(true);
}
```

This application logic must not be placed in live generated `90_Studio_Export.c`.

## File ownership boundary

| File or concern | Live ForgeUI-One firmware | Standalone exported project |
|---|---|---|
| `90_Studio_Export.c` | Studio-generated and replaceable | Generated UI implementation |
| `90_Studio_Export.h` | Studio-generated and replaceable | Generated public API declarations and feature-gated Fi runtime include |
| `96_FiRuntime.c/.h` | Studio-generated and replaceable | Standard Fi Icon retained presentation state and public setters |
| `95_UserEvents.c/.h` | Studio-generated and preservation-merged; existing bodies survive and missing declarations/stubs are appended | Developer-owned application/hook layer after export |
| Generated image `.c` files | Studio-managed | Exported project assets |
| `CMakeLists.txt` | Generated by export server | Generated project build registration |
| GPIO, I/O, hardware actions | Do not keep permanently here | Add in developer-owned application layer |
| Product/business logic | Do not keep permanently here | Developer-owned |

### Ownership rules

1. Studio owns the live firmware workspace and may regenerate its generated UI and hook files.
2. Studio creates the standalone project's initial hook files.
3. After export, the developer owns the standalone project and its `95_UserEvents.c/.h` application layer.
4. Generated public UI functions remain declared/implemented in 90, except the
   dedicated Standard Fi Icon presentation contract in 96; 90 includes its
   public header when emitted.
5. Developer code includes `90_Studio_Export.h` to call generated UI control APIs.
6. Generated UI code includes `95_UserEvents.h` to call genuine-user hooks implemented in the standalone `95_UserEvents.c`.
7. Permanent product logic must not be stored in the live Studio firmware copy.

Do not claim that live `95_UserEvents.c/.h` files are manually created or disposable. Live regeneration preserves matching developer hook bodies and appends missing generated declarations and stubs. Standalone copies become fully developer-owned after export.

## CMake integration

The export server generates the component source list and includes:

```text
main.c
01_FG_Runtime.c
20_RTC.c
30_Audio.c
30_WIFI.c
40_SD.c
90_Studio_Export.c
95_UserEvents.c
required generated asset sources
```

Only server-validated asset sources are admitted to the generated CMake list. Both the generated UI runtime and generated/developer hook layer are compiled into the ESP-IDF application.

Do not create a separate CMake pipeline for Interactive Assets or public APIs.

## Application boundary

ForgeUI owns:

- UI structure
- LVGL widget creation
- visual runtime behavior
- generated input callback entry points
- generated public output functions
- API naming and uniqueness
- export metadata
- generated firmware files

Developer code owns:

- GPIO
- sensors
- Wi-Fi application behavior
- MQTT and BLE application behavior
- motors and relays
- business logic
- device-specific actions
- decisions about when to call generated output APIs

Example standalone application integration:

```c
#include "90_Studio_Export.h"
#include "95_UserEvents.h"

void FG_On_StartPump_Clicked(void)
{
    pump_start();
    FG_Set_Running_Light(true);
}

void FG_On_Main_Power_Toggled(bool enabled)
{
    power_set_enabled(enabled);
    FG_Set_Power_Status(enabled);
}

void FG_On_ModeSelector_Changed(fg_three_way_state_t state)
{
    machine_set_mode(state);
}
```

ForgeUI owns the callback signatures and `FG_Set_*` APIs. The developer owns the example hardware functions and the decisions that connect input events to output state.

## Proven physical ESP32-P4 behavior

The validated pipeline successfully exports Hero artwork, the Industrial Carbon Theme, Interactive Button, Interactive Light, and Interactive Status Indicator together. Their layout and artwork align across the Canvas, Browser Preview, and physical ESP32-P4 output.

The generated firmware retains the complete exported UI and no longer falls back to an empty `fg_studio_export_create()`. Button runtime, the shared Binary Output Runtime, generated hooks, public setters, per-instance runtime records, asset sources, generated headers, and generated CMake participate in the same successful export.

### Standard LVGL eleven-component path

Physically verified across Canvas, Browser Preview, generated LVGL and ESP32-P4:

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

The generated output uses the selected semantic palette for component surfaces, secondary surfaces, borders, primary and secondary text, accents, contrast-selected accent text, disabled text and selected surfaces. Standard LED status green remains semantically independent. Chart retains native `lv_chart` and adds responsive non-clickable sibling labels for Y values and X point indexes.

The later 2026-07-30 input and selection runtime group is separately physically proven below; no proof is implied for other runtime-complete controls.

### Interactive Button input path

Physically confirmed:

- Normal artwork displayed
- Pressed artwork displayed on touch
- release restored Normal artwork
- physical click detected
- generated shared callback executed
- generated user hook executed
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- generated contain-fit scaling used final persisted component geometry

Monitor output:

```text
[ForgeUI] FG_On_Button_Clicked clicked
[ForgeUI User Event] FG_On_Button_Clicked
```

### Interactive Light output path

Physically confirmed:

- OFF and ON image assets exported
- saved initial ON state displayed
- `FG_Set_*` public setter generated
- Light remained non-clickable
- resized and visible-bounds-fitted artwork matched Canvas and Browser Preview
- common OFF/ON contain scaling used final persisted component geometry
- firmware remained stable

### Interactive Toggle Switch input path

Physically confirmed for the exercised control:

- OFF and ON artwork displayed through touch state changes
- persistent boolean runtime selected the correct artwork
- generated Toggle interaction remained stable

This proof does not claim unperformed multi-instance or stress coverage.

### Interactive Status Indicator output path

Physically confirmed:

- Binary Output runtime
- generated `FG_Set_*` control path
- shared Binary Output runtime
- shared Binary Output exported geometry
- component-sized transparent container
- centred child image
- contain-fit scaling
- Browser Preview parity
- resized component geometry
- stable runtime behaviour

Design-time local preview clicking is intentionally not exported and is not physical input behavior.

### Interactive Three-Position Toggle input path

Physically confirmed:

- one generated LEFT/CENTER/RIGHT artwork set exported as three independent assets
- the full rectangular control was divided into three working touch zones
- each zone selected the correct LEFT, CENTER, or RIGHT runtime state
- the generated `FG_On_*_Changed(fg_three_way_state_t state)` callback reported the matching readable state
- initialization did not spuriously notify application code
- repeated interaction remained stable without a crash

The proof validates the current component instance and generated runtime. It does not imply unperformed multi-instance stress coverage.

### System Runtime path

Physically confirmed:

- generated gear launcher
- generated System launcher
- generated Brightness page
- generated Back navigation
- generated Brightness slider and live percentage
- real ESP32-P4 brightness control through `bsp_display_brightness_set()`
- current-session brightness retention
- generated Wi-Fi Manager
- Scan and Refresh through the same Hosted backend path
- live Hosted scan results and a populated Available Networks list
- live RSSI and security
- Connected and Saved markers
- repeated Scan and Refresh replacing previous results
- no duplicate or stale SSID rows observed
- password dialog, password masking and Show / Hide
- reusable native keyboard visibility, password entry, Done and Cancel
- correct top-layer keyboard geometry and touch interaction
- Connect, Disconnect, Reconnect and Forget workflows
- complete connection workflow physically proven
- connected details including gateway, station MAC and AP BSSID
- deterministic Browser Preview parity
- approximately 63 FPS after keyboard optimisation
- Interactive Assets remain alive and operational while System Runtime pages are active and after return to the application
- only minor UI polish remains

### Storage Runtime path

Physically confirmed:

- lazy Storage page creation
- acknowledged worker shutdown and resource deletion
- Refresh
- directory browsing
- folder navigation
- Previous / Next paging
- Read / Write Test
- Select Item mode
- Delete Empty Folder
- Hosted Wi-Fi coexistence
- repeated Storage use without crash

Delete File, Rename, Format, Mount / Unmount and recursive deletion are not claimed as implemented or physically proven.

### Hosted Wi-Fi and SD coexistence path

The recovered physical proof includes:

```text
transport: Identified slave [esp32c6]
H_API: Transport active
FG_WIFI: STA started
FG_WIFI: WiFi hosted init READY
Station mode: Connected
Got IP
SD mounted OK
SD TEST PASS
```

The physical ESP32-P4 run proved Hosted transport, the complete generated Wi-Fi Manager workflow, SD coexistence, System Runtime and Interactive Asset Runtime operating simultaneously.

### System health

- Wi-Fi READY
- Wi-Fi connected
- IP assigned
- SD READY
- SD TEST PASS
- Hosted Wi-Fi and SD operating simultaneously
- no crash after interaction

The Button, exercised Toggle Switch, Three-Position input-hook path, shared Light/Status Indicator Binary Output setter path and generated System Runtime are implemented and physically proven within the scopes stated above. Keyboard geometry, alignment, row fill and functional special keys are also proven on the 1024x600 ESP32-P4 display.

### Standard LVGL Input and Selection Runtime — 2026-07-30

Generated runtime is physically proven for Input, Textarea, Checkbox, Switch, Radio, Progress, Circular Progress, Number Input and Select.

The final whole-screen Canvas ↔ P4 comparison proved graphite/orange semantic theme and border parity within this group. Number Input generated hardware steppers operated using serialized step and clamping. Switch used the amber checked state instead of LVGL blue. Circular Progress remained output-only with no knob or dragging, and Progress remained output-only and noninteractive. Input/Textarea focus did not automatically attach a keyboard.

## Automated Validation

### Current validation boundary

- the current combined exporter, Layout Designer/AI composer and export-server selection passes 295/296 tests across 35/36 suites;
- all 33 `ForgeUILvglExport` suites pass, including QR Code generation and the unchanged four-field result contract;
- the one failing export-server preflight fixture is the already-recorded pair of missing default-theme C sources, not a QR, Layout Designer, API or hook failure;
- live generated-file inspection confirms QR construction/data update in `90_Studio_Export.c`, its Text setter declaration in `90_Studio_Export.h`, no QR declaration in `95_UserEvents.*`, `CONFIG_LV_USE_QRCODE=y`, and CMake registration of `90_Studio_Export.c` plus `95_UserEvents.c`;
- the eleven-component Standard theme/parity regression passes 158/158;
- Graphite/orange, Cyber teal and Nordic light are verified;
- custom palette export is verified;
- theme parity is verified through Canvas, Browser Preview, generated LVGL and physical ESP32-P4 for the eleven named Standard components;
- Chart regression coverage includes native chart geometry, responsive gutters, Y-axis labels, X-axis point indexes and non-clickable sibling labels;
- TypeScript, ESP-IDF 5.5.4 / LVGL 9.2.2 build, firmware flash and `git diff --check` pass for this milestone;

- System Runtime exporter regressions cover persistent containers, gear generation, internal page callbacks, visibility switching, the `10–100` Brightness slider, hardware bridge and complete Wi-Fi Manager generation;
- Storage Runtime exporter and preview regressions cover lazy page creation, persistent reuse, reusable rows, paging, Select Item mode and the Delete Empty Folder workflow;
- Wi-Fi generator regressions cover structured network rows, connected-detail fields, password dialog, open/protected connection branching and internal intent callbacks;
- Studio and Browser Preview System regressions cover navigation, live brightness, deterministic Wi-Fi parity, password and forget workflows, session retention, disabled placeholders and preservation of application interaction;
- focused LVGL exporter regressions pass;
- Keyboard exporter lazy-creation, reusable-instance, textarea attachment, geometry, call-order and control-width regressions pass;
- State Sheet and crop-pipeline tests pass;
- Three-Position generated runtime regressions pass;
- Button final-geometry, registry-dimension, PNG IHDR, LVGL descriptor fallback and linked-crop export regressions pass;
- Light final-geometry, common OFF/ON scale, centring, initial-state and linked-crop export regressions pass;
- Toggle, Status Indicator and Three-Position final-geometry, common state-scale, centring, fallback and linked fitted-asset export regressions pass;
- Canvas, Browser Preview, live/standalone generator and persistence regressions preserve geometry ownership;
- focused Led, Bar, Arc, Chart, standard Keyboard, Calendar, Roller, Message Box, Button Matrix, TabView and Tileview runtime tests pass;
- focused Input, Textarea, Switch, Checkbox, Radio, Progress, NumberInput, Select, Image, Box and IconButton tests pass;
- Switch focused exporter suite passed 7 tests; Radio suites passed 13; Progress suites passed 9; Circular Progress suites passed 5; Number Input reached 19 focused tests during stepper implementation, with 12 exporter outer-container and 8 shared-preview tests; Select focused suites passed 19;
- an initially unused generated NumberInput step constant caused an ESP-IDF build failure before native steppers existed; the implemented stepper callbacks now consume that constant and generated runtime builds cleanly;
- stale running Studio bundles required restart/refresh before regeneration produced the repaired exporter output;
- focused Button Text, Text Value, Heading Text and Clock Presentation serialization, preview and exporter tests pass;
- standard-component transition, clamping, collision-safe naming and hook-generation coverage passes;
- developer hook preservation and missing declaration/stub merge coverage passes;
- the complete LVGL exporter suite reached 212/212 after IconButton;
- the Canvas component regression suite reached 51/51;
- generated API and preservation tests reached 33/33;
- live and standalone generation/preservation coverage passes for the new hooks;
- TypeScript validation passes;
- live `/export` and standalone `/export-idf-project` validation pass for the standard runtime milestone;
- generated-output verification passes;
- ESP-IDF firmware build passes for the recorded Wi-Fi Manager implementation and standard runtime milestone;
- `export-server.js` syntax validation passes;
- scoped diff validation for this subsystem passes.

The complete export-server suite is not claimed as passing while `fg_upload_1024x600_neural_core_67dd4ba0.c` and `fg_upload_carbon_fiber_be774fd2.c` are absent. That unrelated default-theme fixture issue is reported without weakening the validation boundary.

This physical record includes the named eleven-component Standard group and the 2026-07-30 Standard input and selection runtime group. No broader physical claim is inferred.

## Debug map

| Problem | Start here | Then inspect |
|---|---|---|
| Layout looks correct in Canvas but generated Boxes are missing | `ForgeUILvglExport.ts` Box traversal | final project component list and Box parent/root classification |
| Layout child is missing from generated output | component export traversal | project insertion result, component type and parent/child representation |
| Region Box style differs from Browser Preview | Box branch in `ForgeUILvglExport.ts` | semantic surface/border roles, radius, opacity and preview palette |
| Region Box receives an unexpected hook | Box export metadata | ensure Box remains setter-only visibility with no `userEventHooks` entry |
| Layout Designer adds an unexpected header declaration | `publicApiDeclarations` | confirm only contained normal components contribute APIs |
| Auto Arrange runs on the P4 or appears in generated C | incorrect architecture | Auto Arrange must finish before `generateForgeUILvglCode()` |
| Generated firmware references `layoutRegionId` | incorrect exporter coupling | remove runtime interpretation of Studio-only region metadata |
| AI response shape reaches export server | `Header.tsx` transport | AI must resolve into normal project components before export |
| Layout geometry is wrong in generated C | final serialized component `x/y/w/h` | Layout Designer geometry and project insertion, not generated-file patching |
| Generated layout is manually fixed in `90_Studio_Export.c` | wrong ownership boundary | repair Layout Designer/project/exporter source and regenerate |
| Generated LVGL object is wrong | `ForgeUILvglExport.ts` component branch | resolved component props and Interactive Asset |
| Button hook is absent from export result | `ForgeUILvglExport.ts` Button branch | `userEventHooks` set and hook naming |
| Button hook name is wrong or duplicated | hook-name helpers in `ForgeUILvglExport.ts` | component name, asset label/name, uniqueness set |
| Button visual state is wrong | `fg_interactive_button_event_cb` generation | per-instance Normal/Pressed sources |
| Button export ignores resized geometry | `ForgeUILvglExport.ts` Button branch | persisted component `w/h`, parent size and child image centring |
| Button hardware artwork remains at native size | generated `lv_image_set_scale(...)` | Normal/Pressed contain scale and dimension fallback path |
| Button CLICKED does not reach hook | Button event registration | `.clicked_cb`, `95_UserEvents.h/.c` |
| Led setter or changed hook is missing | `ForgeUILvglExport.ts` Led runtime | `export-server.js`, `95_UserEvents.*` |
| Bar setter, range or changed hook is wrong | `ForgeUILvglExport.ts` Bar runtime | `export-server.js`, `95_UserEvents.*` |
| Arc setter, range or changed hook is wrong | `ForgeUILvglExport.ts` Arc runtime | `export-server.js`, `95_UserEvents.*` |
| Chart add/clear APIs or hooks are wrong | `ForgeUILvglExport.ts` Chart runtime | `export-server.js`, retained chart/series, `95_UserEvents.*` |
| Chart axis labels or gutters are wrong | `ForgeUIStandardChart.ts` shared layout | `StandardChartPreview.tsx`, generated sibling label positions and Chart padding |
| Standard Keyboard Show/Hide hooks are wrong | `ForgeUILvglExport.ts` Keyboard runtime | `export-server.js`, retained unattached keyboard, `95_UserEvents.*` |
| Calendar date setter or hook is wrong | `ForgeUILvglExport.ts` Calendar runtime | `export-server.js`, retained date, `95_UserEvents.*` |
| Roller selection or text hook is wrong | `ForgeUILvglExport.ts` Roller runtime | `export-server.js`, option metadata, `95_UserEvents.*` |
| Message Box visibility or button hook is wrong | `ForgeUILvglExport.ts` Msgbox runtime | `export-server.js`, panel metadata, `95_UserEvents.*` |
| Button Matrix selection or hook is wrong | `ForgeUILvglExport.ts` ButtonMatrix runtime | `export-server.js`, button map/count, `95_UserEvents.*` |
| TabView selection is wrong | `ForgeUILvglExport.ts` Tabview runtime | retained index/count, shared transition helper, `lv_tabview_set_active()` and `lv_tabview_get_tab_active()` |
| Tileview coordinate is wrong | `ForgeUILvglExport.ts` Tileview branch and shared preview | retained row/column, native tile map, neighbour directions and active-tile lookup |
| Input setter does not update text | `ForgeUILvglExport.ts` Input runtime | retained `lv_textarea`, `NULL` handling, unchanged comparison and focused Input exporter test |
| Input hook fires from setter | Input programmatic guard in `ForgeUILvglExport.ts` | callback registration order, `LV_EVENT_VALUE_CHANGED`, generated `90_Studio_Export.c` |
| Textarea placeholder and value are confused | Textarea exporter branch | serialized placeholder, retained current text and focused Textarea test |
| Switch setter or hook is wrong | Switch export map/branch | `LV_STATE_CHECKED`, guard, `LV_EVENT_VALUE_CHANGED`, `95_UserEvents.*` |
| Checkbox label or checked state is wrong | Checkbox exporter branch | serialized label, native `lv_checkbox`, checked guard |
| Radio is expected to be mutually exclusive | Radio exporter branch | independent retained `lv_checkbox` instances; no group registry exists |
| Progress hook is incorrectly generated | Progress export metadata | setter-only `publicApiDeclarations`, absence from `userEventHooks` |
| QR declaration is missing from `90_Studio_Export.h` | QR entry in `publicApiDeclarations` | Header payload and `normalizePublicApiDeclarations()` Text-signature acceptance |
| QR renders incorrectly in generated C | `ForgeUILvglExport.ts` QR branch | serialized size/colors/quiet zone/data and native `lv_qrcode_set_*` calls |
| QR setter exists but firmware QR support is absent | `firmware/ForgeUI-One/sdkconfig.defaults` | confirm `CONFIG_LV_USE_QRCODE=y` and rebuild |
| QR unexpectedly creates a hook or asset source | QR output classification | it must contribute only generated code plus a public declaration |
| NumberInput clamp or parser is wrong | NumberInput exporter branch | textarea text parsing, `int32_t` range/step and programmatic guard |
| Select index or callback text is wrong | Select exporter branch | option count, clamp, `lv_dropdown_get_selected_str()` and callback buffer |
| Image source setter safely no-ops | Image exporter branch | LVGL-ready resolution, `NULL`/unchanged pointer checks and pending placeholder |
| Box visibility setter is wrong | Box exporter branch | retained non-root object, `LV_OBJ_FLAG_HIDDEN`, child attachment |
| IconButton disabled click still fires | IconButton exporter branch | enabled state, `LV_STATE_DISABLED`, `LV_EVENT_CLICKED` adapter |
| Slider Canvas interaction is mistaken for runtime behavior | `StandardSliderPreview.tsx` | Canvas/Browser mode and unchanged generated LVGL |
| New hook is missing from `95_UserEvents` | `userEventHooks` from `ForgeUILvglExport.ts` | Header payload, `export-server.js`, preservation merge |
| New public declaration is missing from `90_Studio_Export.h` | `publicApiDeclarations` from `ForgeUILvglExport.ts` | Header payload and `normalizePublicApiDeclarations()` |
| Export server rejects a supported new signature | `export-server.js` normalizers/materializers | component exporter test and `export-server.test.js` |
| Duplicate or collision suffix is wrong | deterministic allocation in `ForgeUILvglExport.ts` | API, hook, retained-object and guard names |
| Button Text is missing | `ForgeUIStandardButton.ts` | Button Inspector/Preview and Button exporter branch |
| Text Value is missing | `ForgeUIStandardText.ts` | Text Inspector/Preview and Text exporter branch |
| Heading text is wrong | `ForgeUIStandardHeading.ts` | Heading Inspector/Preview and Heading exporter branch |
| Clock formatting is wrong | `ForgeUIStandardClock.ts` and generated Clock formatter | presentation properties, generated format and `fg_rtc_get()` |
| Clock Preview mismatches export | `ClockPreview.tsx` | shared Clock presentation helper and Browser Preview renderer |
| Clock separator blinking is wrong | generated per-instance Clock callback | `blinkSeparator`, separator-visible state and one-second timer |
| Clock 12-hour formatting is wrong | generated Clock formatter | modulo conversion, midnight/noon and AM/PM |
| Clock seconds formatting is wrong | generated Clock formatter | `showSeconds` and RTC seconds field |
| Multiple Clocks overwrite one another | Clock allocation in `ForgeUILvglExport.ts` | per-instance label, timer, separator state and collision-safe identifiers |
| Toggle hook is absent | Toggle branch in `ForgeUILvglExport.ts` | `userEventHooks`, sanitized `_Toggled` name, and `generateUserEventFiles()` |
| Toggle callback receives the wrong bool | generated `fg_toggle_input_event_cb()` | inversion order, `fg_toggle_input_set()`, and `.toggled_cb` |
| Toggle visual state does not persist | per-instance `fg_toggle_input_t` record | saved `initialState` and OFF/ON sources |
| Toggle runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | single `fg_toggle_input_t` / `fg_toggle_input_set()` generation guard |
| Three-Position hook is absent | Three-Position branch in `ForgeUILvglExport.ts` | `userEventHooks`, sanitized `_Changed` name, and `generateUserEventFiles()` |
| `fg_three_way_state_t` is missing | `generateUserEventFiles()` | `_Changed` hook detection and generated `95_UserEvents.h` |
| Wrong Three-Position zone is selected | generated `fg_three_way_input_event_cb()` | thirds calculation and component width |
| Three-Position coordinates are wrong away from x=0 | `fg_three_way_input_event_cb()` | `point.x - button_coords.x1` local conversion and bounds check |
| Child image intercepts touch | Three-Position object creation | child clickable flag and parent full-bounds clickability |
| Three-Position State Sheet is missing or stale | `InteractiveAssetAIGenerator.tsx` three-position-set flow | master request, crop workspace and linked asset ID |
| LEFT/CENTER/RIGHT crops map to the wrong states | State Sheet row mapping | unique row assignments and crop-to-state draft update |
| Three-Position runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | single `fg_three_way_input_t` / `fg_three_way_input_set()` generation guard |
| Generated LEFT/CENTER/RIGHT stub is wrong | `generateUserEventFiles()` | `_Changed` signature branch and readable-state expression |
| Light setter is missing from C source | Light export preparation in `ForgeUILvglExport.ts` | LVGL readiness and unique API name |
| Light declaration is missing from header | `publicApiDeclarations` export result | Header payload and `generateStudioExportHeader()` |
| Light starts in wrong state | Light export branch | saved `initialState` and initial image symbol |
| Light is clickable or generates a hook | Light export branch | remove Button-style callback/hook behavior |
| Light export ignores resized geometry | `ForgeUILvglExport.ts` Light branch | persisted component `x/y/w/h`, transparent container and centred child image |
| OFF/ON state change alters visible size or position | generated Light contain-scale call | common state-pair scale, identical centring and linked crop dimensions |
| Numeric contain scale is wrong | contain-scale calculation in `ForgeUILvglExport.ts` | final component dimensions and both state-image dimensions |
| Legacy image emits the wrong scale | `forgeUIResolveUploadedAssetDimensions()` | registry metadata, PNG IHDR bytes, generated LVGL descriptor helper, safe 256 fallback |
| PNG IHDR fallback is not used | `ForgeUIUploadedAssetRegistry.ts` | data-URL decoding and `forgeUIParsePngDimensions()` |
| LVGL descriptor fallback is missing | generated Button or Light contain-scale helper | both `lv_image_dsc_t.header.w/h` values and scale-256 guard |
| Fitted artwork exports original state symbols | kind-specific Interactive Asset state IDs | linked cropped uploaded assets, resolver and `assetSources` |
| Visible-artwork fitting changes original uploads | `ForgeUITwoStateVisibleBounds.ts` | linked crop registration and state-reference replacement |
| Configured preview remains stale after asset replacement | kind-specific Canvas preview | Interactive Asset registry event and uploaded-asset registry refresh; this occurs before generated export |
| Status Indicator setter is missing | Binary Output export preparation in `ForgeUILvglExport.ts` | kind-aware lookup, LVGL readiness, and unique API name |
| Status Indicator starts in wrong state | Status Indicator export branch | saved `initialState` and per-instance runtime record |
| Status Indicator looks stretched in Canvas or Browser Preview | `InteractiveStatusIndicatorPreview.tsx` | intrinsic image dimensions and centered contain-fit styles; this is outside generated firmware ownership |
| Browser Preview ignores resized component bounds | `forgePreviewRenderer.tsx` | `commonStyle`, Browser Preview wrapper, `fillContainer`, type-specific preview renderer and centred contain-fit rendering |
| Status Indicator Canvas click does nothing | `InteractiveStatusIndicatorCanvasPreview.tsx` | temporary local preview state; do not debug generated `FG_Set_*` for this design-time issue |
| Status Indicator is clickable on hardware | `ForgeUILvglExport.ts` Status Indicator branch | verify no event callback or clickable flag was emitted |
| Status Indicator setter does not change state | generated `fg_binary_output_t` record and `FG_Set_*` | saved OFF/ON symbols and setter-to-runtime-record mapping |
| Binary Output instances affect each other | generated runtime records | setter-to-record mapping and unique runtime names |
| Binary Output Runtime is duplicated | runtime emission in `ForgeUILvglExport.ts` | shared `fg_binary_output_t` and `fg_binary_output_set()` generation |
| Export rejected before files are written | `ForgeUIExportValidation.ts` | `export-server.js` |
| Missing generated C source | `export-server.js` | Uploaded Asset Registry |
| Invalid generated asset source | `ForgeUIExportValidation.ts` | exporter asset collection |
| Stale uploaded state asset blocks export | `ForgeUIExportValidation.ts` asset-kind/state checks | Uploaded Asset Registry and generated source existence |
| Duplicate generated API | `ForgeUIExportValidation.ts` | `ForgeUILvglExport.ts` |
| Duplicate `LV_IMAGE_DECLARE` | `ForgeUILvglExport.ts` | export validation |
| Theme asset validation failure | `export-server.js` | built-in Theme assets |
| Selected theme does not reach generated LVGL | `ForgeUILvglExport.ts` semantic palette resolution | `ForgeThemeContext.tsx`, `forgeThemeMap.ts`, export payload palette |
| Canvas and Browser theme output differ | `forgePreviewRenderer.tsx` | `ComponentPreview.tsx`, shared Standard preview palette props |
| Custom palette falls back unexpectedly | `forgeThemeMap.ts` | `generateForgeUILvglCode()` palette option and live/standalone export call sites |
| P4 still shows the previous theme | generated LVGL style calls | confirm Theme -> Generate -> Build -> Flash completed |
| Direct Open Creator action targets the wrong asset | `ForgeUINavigation.ts` | `PreviewContainer.tsx`, component ID and linked Interactive Asset ID |
| Confirm Crops does not complete | `InteractiveAssetAIGenerator.tsx` | crop validity, PNG data URLs and `ForgeUIAIImagePipeline.ts` |
| Only part of a state set is registered | `ForgeUIAIImagePipeline.ts` | conversion completion before `forgeUIAddUploadedAssets()` atomic batch |
| Toggle linked crops drift in size | Toggle State Sheet crop workspace | shared crop dimensions and linked resize rules |
| Keyboard is centered or offset at runtime | `ForgeUILvglExport.ts` Keyboard branch | `LV_ALIGN_TOP_LEFT` after map/mode and final `lv_obj_set_pos()` ordering |
| Password dialog does not open | generated network-row callback | selected network security, dialog pointer and hidden flags |
| Password textarea does not attach keyboard | generated focus/click callback | `lv_keyboard_set_textarea()`, reusable keyboard pointer and top layer |
| Keyboard appears off-screen | generated keyboard geometry | `LV_ALIGN_TOP_LEFT`, `(0, 350)`, `lv_layer_top()` coordinates |
| Wi-Fi projection makes password entry laggy | password-dialog projection pause | repeated label/row updates and obsolete diagnostic logging |
| Keyboard outer size falls back to native geometry | Keyboard final setup ordering | final `lv_obj_set_size()` and absence of later alignment/size calls |
| Keyboard special keys have wrong proportions | Keyboard buttonmatrix control array | numeric width units, control flags and row totals |
| Keyboard theme padding changes key fill | Keyboard `LV_PART_MAIN` / `LV_PART_ITEMS` styles | explicit pad, gaps, border, font and style ordering |
| API metadata is absent from request | `Header.tsx` | `/export` and `/export-idf-project` payloads |
| Input hook metadata is missing from payload | `Header.tsx` | exact `userEventHooks` field from `generateForgeUILvglCode()` |
| Server rejects a valid hook signature | `generateUserEventFiles()` suffix handling | `_Clicked`, `_Toggled`, `_Changed` validation and endpoint payload |
| Generated header is wrong | `generateStudioExportHeader()` | `normalizePublicApiDeclarations()` |
| Hook files are missing | `generateUserEventFiles()` | received `userEventHooks` and export endpoint |
| Live files are unexpectedly replaced | live ownership policy | `/export` writes generated live output |
| Standalone project lacks APIs | `/export-idf-project` | copied/written files and public metadata |
| CMake cannot find hooks or assets | generated `CMakeLists.txt` | export server source collection |
| Linker reports missing Button callback | `95_UserEvents.h/.c` | exact generated hook name |
| Linker reports missing Binary Output setter | `90_Studio_Export.h/.c` | exact Light or Status Indicator setter declaration/definition |
| Physical behavior differs from export | generated C and symbols | LVGL object wiring and copied asset sources |
| Canvas, Browser Preview, live and standalone sizes differ | persisted component geometry and `generateForgeUILvglCode()` | shared generator result, contain-fit scale, centring and selected linked state assets |
| Gear missing | `ForgeUILvglExport.ts` System Runtime generation | generated `system_gear`, application container and foreground ordering |
| System Runtime is not generated | `generateForgeUILvglCode()` output | System container construction in generated `90_Studio_Export.c` |
| System page does not open | generated `fg_system_open_cb()` | gear event registration, System container pointer and hidden flags |
| Brightness slider is missing | generated Brightness container construction | `lv_slider_create`, range and object visibility |
| Brightness updates preview only | generated `FG_Set_Display_Brightness()` | `bsp_display_brightness_set()`, BSP include and initialized display brightness |
| Brightness updates hardware only | `ForgeUISystemContext.tsx` and `ForgeUISystemSurface.tsx` | preview slider state, label and brightness filter |
| System navigation fails | generated `fg_system_show_page()` and Back callbacks | target container and `LV_OBJ_FLAG_HIDDEN` changes |
| Application disappears after closing System | generated application container | close callback, application hidden flag and foreground ordering |
| Container visibility switching is incorrect | generated System callbacks | all persistent container pointers and hide/show order |
| Storage page is missing | `ForgeUILvglExport.ts` Storage generation | generated lazy Storage container |
| Storage Refresh fails | generated Storage Refresh callback | `fg_sd_get_snapshot()` and bounded request path |
| Storage browsing fails | generated Storage projection | `fg_sd_list_directory()` |
| Delete Folder remains disabled | generated Storage row callback | Storage projection, persistent row metadata and empty-folder flag |
| Delete Folder fails | generated Delete Empty Folder callback | `fg_sd_delete_empty_folder()` |
| Hosted transport fails | `sdkconfig.defaults` | Hosted SDIO configuration |
| Scan works but Refresh does not | generated Scan callback and generated Refresh callback | both invoke `fg_wifi_scan_start()` |
| Rows remain blank after scan | backend completed network model and generated LVGL projection | row visibility assignment and list rebuild |
| Structured network rows do not populate | generated backend projection | `30_WIFI` structured cache and `fg_wifi_get_networks()` |
| Connected details are missing or unreadable | generated detail labels and explicit styles | `fg_wifi_snapshot_t`, text color and opacity |
| Reconnect does nothing | generated reconnect callback | `fg_wifi_reconnect()` and persisted STA configuration |
| Forget leaves Saved state visible | generated forget callback | `fg_wifi_forget()`, snapshot saved flag and row projection |
| Wi-Fi rows ignore active theme | generated row styles | Browser Preview palette-derived row values |
| Browser Preview and physical Wi-Fi differ | deterministic preview state | `ForgeUIWifiPage.tsx` and generated snapshot projection |

## File responsibility summary

### Layout Designer generated boundary

- `studio/src/forgeui/layout/ForgeUILayoutDesigner.ts` resolves template and child geometry before export.
- `studio/src/forgeui/ai/ForgeAIRegionComposer.ts` converts AI semantic regions into normal components before export.
- `studio/src/forgeui/ForgeUILvglExport.ts` consumes the final normal component document.
- `studio/src/components/Header.tsx` transports only the unchanged exporter result.
- `studio/export-server.js` validates and materializes only the unchanged generated-output contract.
- `90_Studio_Export.*` contains normal generated components and their existing APIs.
- `95_UserEvents.*` contains hooks only for actual interactive components, never for Layout Designer itself.

Detailed Studio ownership remains in `02_DEVELOPER_CODE_MAP.md`.

### `studio/src/forgeui/ForgeUILvglExport.ts`

Owns generated LVGL source, all five Interactive Asset branches, shared Button/Toggle/Three-Position/Binary Output runtimes, and the complete Standard LVGL Runtime generation. Standard ownership includes semantic theme propagation; Circular Progress retained runtime; Number Input container, textarea, stepper buttons and callbacks; Select closed/popup styling; Switch checked-state styling; Checkbox/Radio fallback-label normalization; native Chart plus responsive sibling axes; native QR Code creation and setter-only data updates; other retained objects/state; setters; LVGL event adapters; hook metadata; and collision-safe names. It also owns Button/Text/Heading serialized presentation, per-instance Clock formatting, the built-in System Runtime and all existing exporter metadata. It never writes files directly or owns Hosted transport, physical Wi-Fi truth or Storage filesystem operations.

### Standard semantic theme source files

- `studio/src/forgeui/theme/ForgeThemeContext.tsx` supplies the active preview palette.
- `studio/src/forgeui/preview/forgeThemeMap.ts` owns semantic role resolution, contrast selection and deterministic graphite fallback.
- `studio/src/forgeui/preview/forgePreviewRenderer.tsx` passes the palette to Browser Preview Standard renderers.
- `studio/src/components/editor/ComponentPreview.tsx` passes the active palette to Canvas Standard renderers.
- `studio/src/forgeui/ForgeUIStandardChart.ts` owns shared Chart geometry and deterministic axis models.
- `studio/src/forgeui/preview/StandardChartPreview.tsx` renders the shared Canvas/Browser Chart surface and axes.

### `studio/src/forgeui/ForgeUIUploadedAssetRegistry.ts`

Owns uploaded image records, intrinsic dimension metadata, alpha-content metadata, PNG IHDR parsing and the registry-first dimension resolution used before generated LVGL descriptor fallback.

### `studio/src/forgeui/interactive/ForgeUITwoStateVisibleBounds.ts`

Owns non-destructive stable state-set alpha unions, compatible source-dimension validation, component-geometry mapping and linked crop generation used by Button, Toggle, Light, Status Indicator and Three-Position before export. Its filename and Button/Light compatibility APIs remain unchanged.

### `studio/src/forgeui/interactive/ForgeUIInteractiveButtonVisibleBounds.ts`

Owns the Button-facing Normal/Pressed wrapper over shared visible-bounds fitting.

### `studio/src/forgeui/interactive/ForgeUIInteractiveLightVisibleBounds.ts`

Owns the Light-facing OFF/ON wrapper and linked fitted-asset naming over shared visible-bounds fitting.

### `studio/src/components/Header.tsx`

Coordinates Build & Flash, Clean Build & Flash, standalone export, client preflight, and unchanged transport of `code`, `assetSources`, `userEventHooks`, and `publicApiDeclarations` to both export endpoints. Never invents runtime APIs or validates materialized firmware files.

### `studio/export-server.js`

Owns validation of accepted metadata; recognition and materialization of the supported new text, boolean, integer, index/text and click hooks and Text/Value/Checked/Selected/Selected_Index/Source/Visible/Enabled declarations; preservation merge; generated headers; disk writes; assets; CMake; and project packaging. The exporter decides names and signatures. The server never invents widget behavior.

### `90_Studio_Export.c`

Owns generated UI plus Interactive Asset, Standard LVGL Component and System Runtime implementations. Standard ownership includes retained Input/Textarea objects and guards; explicit Switch checked styling; Checkbox/Radio state and normalized labels; Progress range/value; Circular Progress retained object/value and output arc; Number Input outer container, textarea, increment/decrement buttons, shared step constant and callbacks; Select dropdown/index/count and popup styling; remaining retained objects/state; generated setters; LVGL event adapters; and calls into genuine-user hooks. Never contains developer product logic.

### `90_Studio_Export.h`

Owns `fg_studio_export_create(...)`, every Binary Output setter and every completed Standard Runtime public declaration, including QR Code Text setters, with required public types including `bool`, `int32_t`, `uint32_t`, `const char *` and `const void *`. It contains no API for Icon, Divider, Scale, Line, Clock, Button Text, Text or Heading. The Three-Position enum is owned by `95_UserEvents.h`. Never contains user implementations.

### `95_UserEvents.c`

In live firmware, owns preservation-merged Interactive Asset and Standard hook implementations, including Input, Textarea, Checkbox, Switch, Radio, NumberInput, Select and IconButton hook families. Existing matching bodies survive, missing stubs are appended and unrelated hooks remain. Output-only Progress and CircularProgress intentionally add no hook. Other setter-only and presentation/API-free components add none. In standalone export, this becomes developer-owned callback/application code.

### `95_UserEvents.h`

In live firmware, owns the generated Three-Position enum and preservation-merged Interactive Asset and Standard hook declarations, including text, checked/selected, integer, index/text and click signatures. Missing declarations are appended. It declares no Progress, CircularProgress, Image, Box, Icon, Divider, Scale, Line, Clock, Button Text, Text or Heading hook. In standalone export, it forms the developer-owned hook interface.

### `CMakeLists.txt`

Owns compilation source registration and is generated by the export server.

## Architectural invariants

Preserve these rules:

1. `generateForgeUILvglCode()` remains the only LVGL UI exporter.
2. Interactive Button uses a void `FG_On_*_Clicked(void)` hook.
3. Interactive Toggle Switch uses a persistent `FG_On_*_Toggled(bool enabled)` hook.
4. Interactive Three-Position Toggle uses `FG_On_*_Changed(fg_three_way_state_t state)` and local component coordinates for touch selection.
5. Binary Output Interactive Assets generate public `FG_Set_*` UI functions and no event hooks; interactive Standard setters never directly invoke their genuine-user hooks.
6. Button, Toggle, and Three-Position calls live in `90_Studio_Export.c`; their enum/declarations/stubs live in `95_UserEvents.c/.h`.
7. All Binary Output setters are declared and implemented entirely in `90_Studio_Export.h/.c`.
8. `Header.tsx` transports exporter metadata but does not create APIs.
9. `export-server.js` writes files but does not define widget behavior.
10. Live `95_UserEvents.c/.h` files are Studio-generated and preservation-merged; matching developer bodies survive and missing declarations/stubs are appended.
11. Standalone `95_UserEvents.c/.h` files become developer-owned after export.
12. Customer hardware and business logic never belongs in generated UI files.
13. Client validation occurs before export submission.
14. Server validation occurs before filesystem mutation.
15. Only validated asset sources are written to CMake.
16. Built-in Theme assets participate in validation.
17. Generated runtime assumes validated inputs.
18. Failed validation preserves the previous generated firmware.
19. The Binary Output Runtime is generated once per export.
20. Every Binary Output Interactive Asset reuses the shared runtime implementation.
21. Future Binary Output assets extend the existing runtime rather than generating new runtime implementations.
22. Toggle Input Runtime is generated once per export.
23. Three-Position Input Runtime is generated once per export.
24. Per-instance runtime state remains independent in every runtime family.
25. Generated enum types are visible wherever hook declarations and developer implementations require them.
26. Header and export server transport or materialize metadata but never invent runtime APIs.
27. Hook generation preserves exact sanitized unique names across all hook families.
28. Missing or stale state assets fail validation before filesystem mutation.
29. Three-Position generation uses one master State Sheet request, but export and runtime retain three independent LEFT/CENTER/RIGHT uploaded assets.
30. Confirm Crops registers a complete converted state set atomically; partial state-set registration is not a valid current path.
31. State Sheet row remapping changes crop-to-state assignment without changing the generated runtime API.
32. Keyboard map/mode configuration precedes explicit style, `LV_ALIGN_TOP_LEFT`, final position and final size.
33. Keyboard dimensions come from the Canvas component; no global or resolution-specific scaling is introduced.
34. Creator navigation selects component/asset context, while the exporter remains the sole owner of generated LVGL and runtime behavior.
35. Direct Creator access across all five Interactive Assets does not change generated API direction.
36. Status Indicator Canvas Preview may toggle local state for visual verification, but temporary preview state is never exported.
37. Generated Status Indicator LVGL remains non-clickable and Binary Output state remains developer-controlled through `FG_Set_*`.
38. Component geometry becomes authoritative after placement; reusable Interactive Asset dimensions do not overwrite persisted component geometry during export.
39. Generated LVGL position and size for all five Interactive Asset branches always use persisted component `x/y/w/h`.
40. Interactive Asset families that export two-state contained artwork reuse the common contain-fit scaling model rather than inventing independent geometry rules.
41. Legacy image dimensions resolve in this order: uploaded-asset registry metadata, PNG IHDR, generated LVGL descriptor dimensions, then safe scale 256.
42. Button Normal/Pressed, Toggle OFF/ON, Light OFF/ON and Status Indicator OFF/ON each use one common state-pair scale and centred child-image placement; Three-Position LEFT/CENTER/RIGHT uses one common three-state scale.
43. Canvas, Browser Preview, live firmware and standalone export must remain visually equivalent for the same persisted component geometry and state assets.
44. Visible-artwork fitting exports linked cropped state assets and never modifies the original uploaded images.
45. Browser Preview wrappers preserve persisted component geometry before type-specific contain-fit rendering.
46. System Runtime is generated separately from Interactive Assets.
47. System Runtime generates no User Event callbacks.
48. Interactive Assets remain alive while System Runtime pages are active.
49. System Runtime currently uses generated persistent-container visibility switching.
50. Closing System restores the existing application container without recreating it.
51. Future animation must preserve generated runtime ownership, application state and Interactive Asset lifetime.
52. Hosted Wi-Fi transport uses SDIO Slot 1.
53. SD storage uses SDMMC Slot 0.
54. The complete Wi-Fi Manager is generated System Runtime presentation and intent code.
55. Generated LVGL projects structured backend snapshots and network records; it never owns physical Wi-Fi truth.
56. `30_WIFI` owns scanning, credentials, reconnect policy, DHCP and ESP-IDF interaction.
57. Physical firmware supports one persisted ESP-IDF STA configuration, not a multi-network database.
58. Browser Preview Wi-Fi remains deterministic and hardware-independent.
59. The native LVGL keyboard is created lazily as one reusable top-layer instance.
60. System password fields attach through `lv_keyboard_set_textarea()`, and keyboard geometry uses `LV_ALIGN_TOP_LEFT` before absolute positioning.
61. Periodic Wi-Fi projection pauses while password entry is active.
62. No Wi-Fi User Event callbacks or public setter APIs are generated.
63. `95_UserEvents.c` remains unrelated to Wi-Fi System UI.
64. `sdkconfig.defaults` owns the permanent Hosted configuration.
65. Generated firmware assumes, but does not define, Hosted transport configuration.
66. Scan and Refresh must always use the same backend scan path.
67. Generated LVGL owns Wi-Fi presentation only.
68. Hosted Connectivity Runtime owns physical scan execution and AP retrieval.
69. Completed backend models are projected into LVGL.
70. Generated code must never duplicate Hosted scan logic.
71. Storage Runtime is generated System Runtime and never becomes an Interactive Asset or public developer API.
72. Storage filesystem logic remains in `40_SD.c/.h`.
73. Generated Storage code owns presentation and user intent only.
74. Storage page and worker construction remain lazy; teardown waits for worker acknowledgement before deleting resources.
75. The Storage worker and reusable row pool remain bounded.
76. The Storage request model remains compact: operation kind, one path and one name.
77. The shared Storage projection model remains compact.
78. Delete File remains disconnected from generated LVGL until physically proven.
79. Standard LVGL Component Runtime remains independent from Interactive Asset Runtime and System Runtime.
80. Standard runtime objects, state, helpers, callbacks and API implementations belong in `90_Studio_Export.c`.
81. Standard public declarations belong in `90_Studio_Export.h`; semantic hooks belong in preservation-merged `95_UserEvents.*`.
82. Interactive Status Indicator remains a setter-only Binary Output Runtime asset with no event hook.
83. Scale remains API-free while it owns no runtime value.
84. TabView owns semantic selected-index runtime state.
85. Tileview owns semantic coordinate runtime state.
86. Button, Text and Heading own serialized visible content only.
87. Clock owns presentation configuration only; RTC/system time owns displayed time.
88. Line remains intentionally API-free.
89. Generated Clock exposes no runtime setter.
90. Generated Clock exposes no user hook.
91. Per-instance guards suppress setter-generated LVGL events for interactive Standard controls.
92. Creation and initial serialized assignment remain silent.
93. Standard runtime ownership is limited to meaningful semantic state.
94. Output-only Standard components generate setters without hooks.
95. Presentation-only Standard components remain API-free.
96. Radio has no mutual-exclusion grouping model.
97. NumberInput is a composed generated control whose outer container owns the frame and whose textarea plus increment/decrement buttons consume serialized step.
98. Select options remain serialized and have no runtime editing API.
99. Image accepts LVGL source pointers, not asset IDs, paths or URLs.
100. Box owns runtime visibility only.
101. IconButton icon selection remains serialized.
102. Slider runtime is complete and uses the standard silent-setter/genuine-user-hook contract.
103. Deterministic collision suffixes cover new APIs, hooks, retained objects and guards.
104. The exporter result remains exactly `code`, `assetSources`, `userEventHooks` and `publicApiDeclarations`.
105. No second generated-header or hook-generator architecture exists.
106. Proven Standard components consume semantic theme roles instead of hard-coded decorative colours.
107. Canvas, Browser Preview and generated LVGL resolve equivalent Standard semantic roles.
108. Missing semantic values use the deterministic graphite fallback.
109. Standard status colours may remain semantically independent where appropriate.
110. Hardware theme changes require Theme -> Generate -> Build -> Flash; runtime hot switching is not implemented.
111. Chart axis labels remain non-clickable siblings and do not alter native `lv_chart` runtime behavior.
112. Chart X labels remain deterministic point indexes unless a future serialized X-axis model is explicitly added.
113. The flashed ESP32-P4 remains the final generated-runtime proof; Canvas and Browser Preview are expected to match generated LVGL.
114. Exporter changes are verified through Generate, inspection of regenerated `90_Studio_Export.c`, Build, Flash and physical comparison.
115. The Standard Canvas Keyboard and private reusable System Runtime keyboard remain independent generated architectures.
116. Restart or refresh the running Studio bundle after exporter changes and before regeneration.
117. Layout Designer resolves into normal ForgeUI components before export.
118. Layout Designer is not a generated firmware runtime family.
119. Layout template mode creates no new public API family.
120. Layout template mode creates no new User Event hook family.
121. Smart Region Boxes remain Standard Box components.
122. Region structure does not change the existing Box visibility API contract.
123. Auto Arrange runs before export and never at firmware runtime.
124. Generated firmware does not interpret `layoutRegionId`.
125. Stable region keys are Studio/project metadata, not generated developer identifiers.
126. AI Fill output is converted to the normal component document before export.
127. Generated firmware cannot distinguish manual components from AI-filled components.
128. The exporter result remains exactly `code`, `assetSources`, `userEventHooks` and `publicApiDeclarations`.
129. Header and export server do not transport or interpret AI region documents.
130. Layout Designer must not introduce a parallel exporter.
131. Layout Designer must not introduce another generated-header or hook architecture.
132. Existing contained components retain their normal APIs and hooks.
133. Final persisted `x/y/w/h` remains the generated geometry source of truth.
134. Layout Region Box styling uses semantic theme roles.
135. Layout Designer hardware proof must not be claimed until Generate -> inspect C -> Build -> Flash -> physical comparison is complete.
136. QRCode owns native encoded output and a Text setter only; it generates no hook or asset source.
137. QR generated firmware requires `CONFIG_LV_USE_QRCODE=y`.

## Save Point History

### FORGEUI_BOARD_PROFILES__EXPORT_TIME_FEATURE_GATING__LAZY_SYSTEM_TOOLS__CONNECTED_WIFI_45KB_FREE__RAM_OVERLAY__READY_FOR_FINAL_OPERATOR_VALIDATION__2026-07-31

- `ForgeUILvglExport.ts` consumes the persisted Board Profile feature set and removes disabled includes, models, callbacks, pages, timers and assets. `export-server.js` writes `00_ForgeUI_Features.h` and applies the same profile to live and standalone CMake/source/component-manifest output.
- `FG_FEATURE_WIFI` and `FG_FEATURE_SD_CARD` gate backend-facing generation; `FG_FEATURE_WIFI_MANAGER`, `FG_FEATURE_STORAGE_BROWSER`, `FG_FEATURE_DIAGNOSTICS` and `FG_FEATURE_SETTINGS` gate their generated UI/runtime owners.
- Wi-Fi Manager/dialogs and Storage UI/worker resources are lazy. Diagnostics is implemented. The compact RAM overlay in the built ELF is not reproducible from the current managed-component source and remains a durability issue.

### FORGEUI_WIDGET_REGISTRY__LAYOUT_TEMPLATE_LIBRARY__QRCODE_RUNTIME__READY_FOR_QR_HARDWARE_PROOF__2026-07-30

- **Generated architecture:** The implemented Dashboard definition resolves to
  ordinary components and the unchanged four-field exporter result. QR Code
  generates native LVGL QR construction plus a setter-only
  declaration/implementation in `90_Studio_Export.*`; it adds no hook,
  UserEvent stub, asset source or transport field.
- **Validation:** Focused Layout Designer/AI composition and QR exporter tests pass. Live generated `90_Studio_Export.c/.h` inspection confirms `lv_qrcode_set_*` initialization and `FG_Set_QR_Code_Text`. QR ESP-IDF build, flash and physical scan proof remain pending.

### FORGEUI_LAYOUT_DESIGNER__DASHBOARD_SMART_REGIONS_AUTO_ARRANGE_AI_FILL__CANVAS_AND_BROWSER_PREVIEW_MANUALLY_VERIFIED__READY_FOR_EXPORT_AND_HARDWARE_PROOF__2026-07-30

- **What changed:** Added the first Dashboard Layout Designer vertical slice using normal Box regions, region assignment, Auto Arrange and AI Fill. Layout Designer output remains ordinary ForgeUI components before entering the generated export pipeline.
- **Why:** Direct AI-owned pixel coordinates produced crowded layouts. ForgeUI now resolves template geometry and component placement before export while preserving the generated firmware API boundary.
- **Generated architecture:** `generateForgeUILvglCode()` still receives the normal component model and returns only `code`, `assetSources`, `userEventHooks` and `publicApiDeclarations`. Smart regions create no runtime family, public APIs, hooks or new transport fields. Region Boxes use the existing Box branch and semantic theme styling.
- **Validation:** Canvas and Browser Preview were manually verified, including AI Fill Dashboard. Focused Layout Designer and Box exporter tests passed. Full generated-C inspection, production build, ESP-IDF build, flash and physical ESP32-P4 parity remain pending.

### FORGEUI_STANDARD_LVGL_PARITY__INPUT_TEXTAREA_CHECKBOX_SWITCH_RADIO_PROGRESS_CIRCULAR_PROGRESS_NUMBER_INPUT_SELECT__SEMANTIC_THEME_AND_BORDER_PARITY__ESP32P4_PROVEN__2026-07-30

- **What changed:** Completed generated semantic-theme, border, state and geometry parity for Input, Textarea, Checkbox, Switch, Radio, Progress, CircularProgress, NumberInput and Select. Added the completed Number Input hardware runtime, Circular Progress output runtime, Select popup runtime, Switch checked-state runtime and fallback-label normalization.
- **Why:** Generated LVGL had diverged from Canvas/Browser Preview, native theme defaults leaked into checked/selected states, Number Input lacked device-side steppers, Circular Progress was incomplete, and stale Studio bundles could regenerate old C after exporter source changes.
- **Generated architecture:** `ForgeUILvglExport.ts` generates explicit semantic LVGL selectors, retained Circular Progress state, composed Number Input container/textarea/buttons/callbacks, Select popup styling and checked/fallback normalization. `90_Studio_Export.*` owns the generated implementations/APIs; interactive hooks remain preservation-merged in `95_UserEvents.*`; Progress and CircularProgress remain hook-free.
- **Validation:** Focused component/exporter suites passed, the NumberInput step constant is actively consumed, generated runtime builds cleanly, and final whole-screen ESP32-P4 comparison proved theme, border and interaction parity within the named scope.

### FORGEUI_STANDARD_LVGL_THEME_PARITY__ELEVEN_COMPONENTS__CANVAS_BROWSER_GENERATED_LVGL_ESP32P4_PROVEN__2026-07-29

- **What changed:** Added semantic theme propagation through Canvas, Browser Preview and generated LVGL for Led, Bar, Arc, Chart, Table, Keyboard, Calendar, Scale, Roller, MsgBox and ButtonMatrix; completed generated Chart Y-axis values and X-axis point-index labels; and verified custom palette export.
- **Why:** Generated firmware needed to preserve the selected Studio theme and preview appearance without hard-coded decorative colours, duplicated rendering architecture or changes to native runtime APIs and hooks.
- **Final generated architecture:** `ForgeThemeContext.tsx` supplies the selected palette, `forgeThemeMap.ts` resolves semantic roles and deterministic fallback, preview renderers consume those roles, and `ForgeUILvglExport.ts` emits equivalent LVGL styles. Chart retains native `lv_chart` plus responsive, non-clickable sibling `lv_label` axes. P4 theme changes remain Generate -> Build -> Flash.
- **Validation:** The eleven-component regression passes 158/158. Graphite/orange, Cyber teal, Nordic light, custom palette export, Canvas parity, Browser parity, generated LVGL parity, TypeScript, ESP-IDF 5.5.4 / LVGL 9.2.2 build, firmware flash, physical ESP32-P4 review and `git diff --check` are proven.

### FORGEUI_STANDARD_LVGL_RUNTIME_V1__DEVELOPER_API_SURFACE__INTERACTIVE_OUTPUT_PRESENTATION_CLASSIFICATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added generated APIs and hooks for Input, Textarea, Switch,
  Checkbox, Radio, NumberInput, Select, IconButton, Slider and List;
  setter-only APIs for Progress, Image and Box; classified Icon, Divider and
  Spinner according to their API-free contracts; preserved
  Button/Text/Heading/Clock presentation ownership; and extended
  collision-safe naming and hook preservation.
- **Final architecture:** Interactive state uses a guarded setter plus genuine-user hook; output state uses a setter only; serialized presentation has no runtime API; and components with no semantic state remain API-free. `90_Studio_Export.*` remains generated, while live `95_UserEvents.*` remains preservation-merged and standalone copies become developer-owned.
- **Validation:** Exporter reached 212/212, Canvas reached 51/51, generated API/preservation reached 33/33, focused component suites and TypeScript/syntax/diff checks passed. One unrelated full export-server fixture failure may remain due to the two missing default-theme assets. No blanket physical hardware proof is claimed.

### FORGEUI_STANDARD_LVGL_RUNTIME_APIS__TABVIEW_TILEVIEW__TEXT_COMPONENT_PROPERTIES__CLOCK_PRESENTATION__ARCHITECTURE_COMPLETE__2026-07-29

- **What changed:** Added TabView active-index runtime, Tileview active-coordinate runtime, Button Text, Text Value, Heading Text and Clock Presentation; recorded Line and Scale as intentionally API-free; and repaired per-instance Clock presentation ownership.
- **Final architecture:** Semantic standard-widget state receives retained APIs and hooks, serialized visible content generates LVGL presentation without runtime transitions, and Clock formats RTC-owned time without a Clock setter or changed hook.
- **Validation:** This save point originally recorded automated evidence only. TabView and TileView subsequently completed their separately documented ESP32-P4 physical proof.

## Extension rule

### Layout Designer template extension

Dashboard is implemented. Industrial HMI, Control Panel, Monitoring, SCADA
Overview and Mobile / Portrait are roadmap candidates. Any additional
definition must resolve into the same normal component model before export. It
must not create another exporter, generated runtime, transport field,
template-specific generated header or template-specific UserEvent file.

### Future System Runtime pages

Current implemented pages:

- Application
- Launcher
- Display / Brightness
- Wi-Fi Manager
- Storage Browser
- Native LVGL Keyboard

Future pages:

- Bluetooth
- Sound
- Device

Storage Browser is part of the reusable generated System Runtime and is the reference architecture for demand creation, bounded backend projection and acknowledged worker teardown. Future pages may reuse typed navigation, structured cards, backend projection and the shared native keyboard where text entry is required. They do not become Interactive Assets, generate User Event callbacks or public APIs.

Each future System page follows:

```text
Generated LVGL Page
+
Internal callbacks
+
Firmware backend
```

These future pages are not implemented today. No future hardware or public API is defined by this extension rule.

Current proven runtime families:

```text
Interactive Input Runtime
  ├── Interactive Button
  └── Interactive Toggle Switch

Three-Position Input Runtime
  └── Interactive Three-Position Toggle Switch

Binary Output Runtime
  ├── Interactive Light
  └── Interactive Status Indicator

Standard LVGL Component Runtime
  ├── Scalar / visual output: Led, Bar, Arc, Progress, CircularProgress
  ├── Streaming output: Chart
  ├── Text entry: Input, Textarea, NumberInput
  ├── Boolean / selectable input: Switch, Checkbox, Radio
  ├── Option selection: Roller, Select, Button Matrix, TabView, Tileview
  ├── Actions: IconButton
  ├── Visibility / dialog services: Keyboard, Message Box, Box
  ├── Date selection: Calendar
  ├── Runtime image output: Image
  ├── Encoded output: QRCode
  ├── Serialized presentation: Button, Text, Heading, Clock
  └── API-free presentation: Scale, Line, Icon, Divider

System Runtime
  ├── Application
  ├── Launcher
  ├── Display / Brightness
  ├── Wi-Fi Manager
  ├── Storage Browser
  ├── Native LVGL Keyboard
  └── Future System Pages

Hosted Connectivity Runtime
  ├── ESP-Hosted
  ├── Wi-Fi Remote
  ├── ESP32-C6
  └── SDIO Slot 1
```

Future Standard APIs follow:

```text
Interactive semantic state → public control API → retained state → genuine-user hook
Output semantic state      → public setter only
Serialized presentation   → no runtime API
No semantic state         → intentionally API-free
```

Genuine future concepts include Radio Group, dynamic Select options, Gauge, Meter, Seven Segment and Numeric Display. Implemented Slider, Radio, Checkbox, NumberInput, Select, Progress, CircularProgress, Image and QRCode must not be described as future runtimes.

Future controls must extend the existing exporter, export-result metadata, Header transport, export-server materialization, generated files, and ownership model. They must not introduce a parallel exporter, a second hook generator, a second generated-header system, or a separate firmware API layer.

Any compatible two-state artwork family must reuse the established geometry path: component-authoritative bounds, registry metadata, PNG IHDR recovery, LVGL descriptor fallback, one safe contain scale and centred image placement. If it supports visible-artwork fitting, it must create linked cropped assets through the shared two-state visible-bounds framework and preserve original uploads.

Generated export also supports reusable generation workflows:

```text
Reusable generation workflow
  Master image
    -> linked crop regions
    -> state-to-row remapping
    -> atomic uploaded-asset registration
    -> existing runtime-family export
```

Toggle uses the pattern for two states and Three-Position uses it for three. The architectural extension point is an N-state generation workflow: one master, N linked crop regions, an explicit unique state mapping, and one atomic registration boundary. This describes how a future state set should feed an existing or deliberately extended runtime contract; it does not claim that additional widgets or runtime families are implemented.

## Permanent architecture statement

The built-in System Runtime is part of the interface ForgeUI generates. It extends generated platform behavior alongside the application without changing the developer callback boundary or becoming an Interactive Asset. Its generated Wi-Fi page renders and controls the separate Hosted Connectivity Runtime through internal callbacks and the non-generated `30_WIFI` backend; generated code never owns the Hosted transport. Its generated Storage Browser renders and controls the separate Storage Runtime through internal callbacks and the non-generated `40_SD` backend; generated code never owns filesystem operations.

> ForgeUI generates the interface. ForgeUI exposes the interface. The developer supplies the application.

Programmatic UI updates and genuine user interaction remain separate API directions.

Maintain this document only when the generated API or ownership boundary changes.

## Standard List interaction contract

Standard List owns no setter and no retained selection runtime API. Each
exported List contributes one collision-safe semantic hook to
`userEventHooks`:

```c
void FG_On_<List_Name>_Item_Clicked(
    uint32_t index,
    const char * text);
```

`ForgeUILvglExport.ts` creates immutable per-row event data containing the
zero-based index, generated label text and that List's hook. Each native
`lv_list_add_button` registers the shared `fg_list_item_clicked_cb` exactly
once for `LV_EVENT_CLICKED`. The shared callback forwards the event data to the
developer hook. Construction, hydration and startup do not call it.

Duplicate component names use the standard collision suffix before
`_Item_Clicked`, for example
`FG_On_System_Menu_Item_Clicked` and
`FG_On_System_Menu_2_Item_Clicked`.

Both live generation and standalone export carry the hook through the existing
`userEventHooks` payload. `generateUserEventFiles()` emits and
preservation-merges the matching declaration and implementation in
`95_UserEvents.h/.c`; no new payload field or public declaration in
`90_Studio_Export.h` is introduced.
## 2026-08-01 generated-export proof boundary

Standard physical proof is **29/39 (74%)**, leaving **10**. Button, Heading,
Box and Divider are proven. Text export now applies complete multiline content,
geometry, wrap mode and alignment consistently. Icon export now derives
source-aware scale from the shared 92% automatic target and emits centered
pivots/alignment. Text and Icon remain **READY FOR FINAL HARDWARE RE-PROOF**;
their corrected generated paths are not physical-proof promotions.
## Fi Icon Runtime contract — 2026-08-01

The complete canonical pipeline and 90/95/96 ownership explanation is maintained
in [`09_FORGEUI_FI_RUNTIME_GUIDE.md`](09_FORGEUI_FI_RUNTIME_GUIDE.md); this code
map remains authoritative for generated signatures and file locations.

For each used Standard Icon whose `generateRuntimeApi` is enabled, Studio emits
`FG_Set_<ComponentName>_Visible(bool)`, `Opacity(uint8_t)` and `Color(uint32_t)`
in `96_FiRuntime.h`, with implementation and retained pre-init state in
`96_FiRuntime.c`. `90_Studio_Export.c` binds the actual `lv_image` or `lv_label`.
When `enableClick` is true, 90 attaches one `LV_EVENT_CLICKED` callback and 95
declares/preserves `FG_On_<ComponentName>_Clicked(void)`. The setters are silent.
Names are deterministic and collision-safe; the selected Fi asset does not name
the API. Runtime-disabled instances emit no setters, click-disabled instances
emit no hook, and an unused 96 layer is omitted from files, headers and CMake.

Current status: **SOFTWARE COMPLETE / PARTIALLY PHYSICALLY PROVEN**. Physical
ESP32-P4 evidence proves the 90 → 95 path: the three separate generated hooks
`FG_On_Comp_MS9QE1N7GA5O3_Clicked`,
`FG_On_Comp_MS9Q2MXPEJP7D_Clicked` and
`FG_On_Comp_MS9Q42SGCB4EB_Clicked` each fired exactly once per deliberate tap,
with no startup callback. SD remained ready; Wi-Fi failure during the run was
unrelated. The 90 → 96 path remains **PENDING HARDWARE PROOF**. None of the
`Visible`, `Opacity` or `Color` setters, retained pre-bind state, repeated-setter
suppression, click-disabled non-interaction, independent presentation instances,
or Live/Standalone parity is claimed as physically proven.
