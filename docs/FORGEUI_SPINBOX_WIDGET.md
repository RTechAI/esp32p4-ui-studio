# ForgeUI Standard Spinbox

Status: **PROVEN — ESP32-P4 PHYSICALLY VALIDATED**

Proven pipeline:

```text
Registry → Tray → Canvas → Inspector → Browser Preview → LVGL Export
→ Runtime SDK → UserEvents → ESP32-P4 → Standalone Export
```

ForgeUI Spinbox is the native LVGL 9 `lv_spinbox` digit editor. It is distinct
from ForgeUI NumberInput:

| Spinbox | NumberInput |
|---|---|
| Native `lv_spinbox_create` | Composed textarea and step buttons |
| Integer backing value with display decimal placement | Text/precision-oriented numeric entry |
| Selected editable digit and power-of-ten step | General fixed-step input |
| Native rollover and digit cursor | No native Spinbox rollover/cursor model |

## Supported properties

- signed minimum, maximum and initial integer backing value;
- power-of-ten step;
- 1–10 digits;
- decimal places (0 through digit count minus one);
- rollover;
- selected digit/cursor position derived from the power-of-ten step;
- left, centre or right text alignment;
- padding, opacity and visibility;
- semantic theme colours with background, border, text and selected-digit
  overrides;
- normal ForgeUI position and size.

Serialized reversed ranges are normalized. Values are clamped to the normalized
range and digit capacity. Steps are normalized down to a safe power of ten.
Decimal places never exceed the digit count. Prefix and suffix were evaluated
but are not exposed: installed LVGL 9.2.2 has no native Spinbox prefix/suffix
API, and ForgeUI does not fake them by rewriting native text.

## Decimal representation

Decimals are presentation over the native integer backing value. With five
digits and two decimal places, backing value `1234` displays as `012.34`.
Runtime APIs and UserEvents carry `1234`, not a floating-point value.

## Canvas and Browser Preview

Canvas increment/decrement controls update the serialized backing value through
the normal component store. Pointer and drag starts from the field or arrow
controls are isolated from the editor move gesture; movement and resizing
remain available outside those interactive controls.

Browser Preview uses the same normalized model. Its buttons increment and
decrement by the configured step, including signed ranges and rollover.
Clicking the value field focuses the Spinbox. Arrow Up/Down work while it has
focus and prevent page scrolling.

Spinbox is a native selected-digit editor, not a free-text number input.
ForgeUI therefore does not provide direct text replacement. Native LVGL
keyboard/encoder interaction operates on the selected digit; use NumberInput
when arbitrary typed numeric text is required.

## Native export

Export creates:

```c
lv_obj_t * spinbox = lv_spinbox_create(parent);
lv_spinbox_set_digit_format(spinbox, digit_count, separator_position);
lv_spinbox_set_range(spinbox, minimum, maximum);
lv_spinbox_set_value(spinbox, initial_value);
lv_spinbox_set_rollover(spinbox, rollover);
lv_spinbox_set_cursor_pos(spinbox, cursor_position);
lv_spinbox_set_step(spinbox, step);
```

Two native LVGL buttons provide touch increment/decrement and call
`lv_spinbox_increment`/`lv_spinbox_decrement`. The field explicitly remains
clickable/click-focusable, and both buttons remain clickable and are moved to
the foreground after construction. Native `LV_EVENT_VALUE_CHANGED` drives the
user hook for keyboard/encoder edits; the retained-value guard prevents a
helper-button action from producing a duplicate hook. Multiple instances
retain independent collision-safe objects, state and callbacks.

## Runtime SDK contract

For a component named `Basic Spinbox`:

```c
void FG_Set_Basic_Spinbox_Value(int32_t value);
void FG_On_Basic_Spinbox_Changed(int32_t value);
```

The setter clamps, guards missing objects, ignores repeated effective values
and remains silent. The hook receives the native integer backing value only
after a genuine effective user change. Construction, hydration, startup and
setter calls do not invoke it. No getter or separate increment/decrement public
command is generated.

## Feature gating

Spinbox construction/runtime code is emitted only for serialized Spinbox
instances. It adds no widget-specific C source, component dependency or CMake
entry. Clean ESP-IDF defaults explicitly enable LVGL Spinbox and its required
Textarea dependency.

## ESP32-P4 validation layout

Use a 1024×600 Application page with FPS and RAM overlays.

| Component name | Label | Position | Properties |
|---|---|---:|---|
| `Basic Spinbox` | Basic 0–100 | 80, 110 | min 0, max 100, value 50, step 1, digits 3 |
| `Signed Spinbox` | Signed -100–100 | 300, 110 | min -100, max 100, value -25, step 10, digits 3 |
| `Decimal Spinbox` | Decimal (backing integer) | 520, 110 | min 0, max 99999, value 1234, step 10, digits 5, decimals 2 |
| `Rollover Spinbox` | Rollover 0–9 | 740, 110 | min 0, max 9, value 9, step 1, digits 1, rollover on |

Generated APIs:

```c
FG_Set_Basic_Spinbox_Value(...)
FG_Set_Signed_Spinbox_Value(...)
FG_Set_Decimal_Spinbox_Value(...)
FG_Set_Rollover_Spinbox_Value(...)
```

Expected hooks:

```c
FG_On_Basic_Spinbox_Changed(...)
FG_On_Signed_Spinbox_Changed(...)
FG_On_Decimal_Spinbox_Changed(...)
FG_On_Rollover_Spinbox_Changed(...)
```

Observed serial pattern:

```text
[ForgeUI User Event] Basic Spinbox changed: 51
[ForgeUI User Event] Signed Spinbox changed: -15
[ForgeUI User Event] Decimal Spinbox changed: 1244
[ForgeUI User Event] Rollover Spinbox changed: 0
```

## Final physical validation record

Hardware and toolchain:

- ESP32-P4;
- LVGL 9.2.2;
- ESP-IDF 5.5.4.

The completed proof verified:

- drag/drop from the registry-driven Widget Tray;
- Canvas rendering and increment/decrement controls;
- Inspector synchronization;
- Browser Preview parity;
- native LVGL export and Standalone Export parity;
- ESP32-P4 touch increment and decrement;
- signed values and decimal formatting;
- rollover and clamp behavior;
- exactly one `FG_On_<Name>_Changed()` callback per effective user action;
- silent programmatic setters and silent startup;
- multiple independent instances;
- export-time feature gating;
- collision-safe generated callbacks;
- Runtime API generation.

The proof resolved the complete issue chain:

- the Tray-to-Canvas acceptance list omitted Spinbox;
- the Canvas drag wrapper consumed helper-button clicks;
- Canvas preview state could retain a stale value instead of following the
  serialized component store;
- a stale generated firmware artifact obscured current generator behavior;
- malformed helper-button coordinates placed arrows off-screen;
- live/Standalone parity checks did not expose artifact drift early enough;
- export preflight validation was added to reject invalid generated output.

The final generated public contract is:

```c
void FG_Set_<Name>_Value(int32_t value);
void FG_On_<Name>_Changed(int32_t value);
```

The Widget Registry contains 39 Standard widgets. Following the subsequent
TileView promotion means 26/39 (67%) are physically proven and 13 remain. TabView
retains its **PROVEN** status.
