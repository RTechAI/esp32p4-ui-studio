# 04_FEATURE_STATUS.md

## 2026-07-31 platform alignment

Current platform save point: `FORGEUI_BOARD_PROFILES__EXPORT_TIME_FEATURE_GATING__LAZY_SYSTEM_TOOLS__CONNECTED_WIFI_45KB_FREE__RAM_OVERLAY__READY_FOR_FINAL_OPERATOR_VALIDATION__2026-07-31`.

- Board/profile ownership is registry-driven; the supported production profile is Waveshare ESP32-P4 WiFi6 Touch LCD 7B.
- Persisted project features hydrate after mount and generate `00_ForgeUI_Features.h`.
- Disabled System features are pruned from generated C, assets, CMake sources/components and `idf_component.yml`; they are not merely hidden.
- Diagnostics is implemented. Wi-Fi Manager and Storage UI/worker resources are created lazily and destroyed safely while their backends remain separately alive.
- Connected Application-page evidence records 45,795 bytes current internal free heap, a 27,648-byte largest block and 62 LVGL objects. Ten-cycle operator validation remains pending.
- QR Code Studio/export/runtime generation is complete; a recorded successful physical phone scan remains pending.
- Slider now has its collision-safe, clamped and silent generated value setter plus genuine-user change hook. Focused preview/export tests pass; physical Slider proof remains pending. Status: **READY FOR ESP32-P4 PROOF**.
- Native Spinner is Registry/Tray/Inspector/Canvas/Browser/export complete. It uses `lv_spinner`, semantic theme fallbacks and export-time usage gating, with no runtime API or UserEvent. Focused tests pass; physical animation/RAM/FPS proof remains pending. Status: **SPINNER READY FOR ESP32-P4 PROOF**.
- The built firmware contains the compact FPS/RAM overlay, but current managed LVGL source does not reproduce it. Status: implemented in the flashed artifact, durability repair required.

This document records implementation and proof status only.

- Use `01_SPINE.md` for architecture, milestones and product direction.
- Use `02_DEVELOPER_CODE_MAP.md` for Studio ownership and debugging paths.
- Use `03_ForgeUI_Generated_Export_API_Code_Map.md` for generated firmware APIs, hooks and export boundaries.
- Use `04_FEATURE_STATUS.md` for concise feature-by-feature proof status.

Detailed ownership maps are not duplicated here.

## Slider and Spinner ESP32-P4 proof procedure

Use a `1024 × 600` project with FPS and RAM overlays enabled. Place four `96 × 96` Spinners on the Application page:

| Label | Position | Spinner properties |
| --- | --- | --- |
| Default | `x=100, y=180` | defaults |
| Slow | `x=300, y=180` | duration `2400 ms`, arc length `120°` |
| Fast | `x=500, y=180` | duration `300 ms`, arc length `45°` |
| Themed | `x=700, y=180` | duration `1000 ms`, arc length `90°`, arc width `12`, background width `4`, accent `#22D3EE`, background `#112233`, opacity `75%` |

Add one Slider with range `-100..100`, initial value `0`, and a unique component name. Generate the live firmware, inspect `90_Studio_Export.c/.h` and `95_UserEvents.c/.h`, then build and flash the Waveshare ESP32-P4 profile. Confirm clean startup with no Slider hook and no Spinner callback; drag the Slider through both signs and confirm one hook per effective user value; call its setter with in-range, repeated, below-minimum and above-maximum values and confirm clamping without hooks. Observe all four native Spinner animations for at least ten minutes, navigate away and back ten times, and confirm geometry, colours, stable FPS/RAM recovery, no monotonic heap loss, no touch interception and no callbacks. Repeat a standalone export and compare its generated application/widget/API/hook sections with the live export.

# ==============================================================================
# 💡 STANDARD LED
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Status_LED(bool on);
```

### Behaviour

- Changes the runtime LED state.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Status_LED_Changed(bool enabled);
```

### Behaviour

- Fired after an effective runtime state change.
- Never fired during startup.

---

## 📝 Notes

- Full Canvas ↔ Browser ↔ Generated LVGL ↔ ESP32-P4 parity.
- Semantic green status colour intentionally remains independent from decorative theme colours.
- Hardware proven.

---

# ==============================================================================
# ⌨️ STANDARD INPUT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Text(const char * text);
```

### Behaviour

- Setter updates text silently.
- Duplicate effective values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(const char * text);
```

### Behaviour

- Fired for genuine user edits only.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native single-line `lv_textarea`.
- Semantic theme and border parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Touch focuses the field only; no keyboard is attached automatically.
- Hardware proven.

---

# ==============================================================================
# 📝 STANDARD TEXTAREA
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Text(const char * text);
```

### Behaviour

- Setter updates multiline text silently.
- Duplicate effective values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(const char * text);
```

### Behaviour

- Fired for genuine user edits only.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native multiline `lv_textarea`.
- Semantic theme and border parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Touch focuses the field only; no keyboard is attached automatically.
- Hardware proven.

---

# ==============================================================================
# ☑️ STANDARD CHECKBOX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Checked(bool checked);
```

### Behaviour

- Setter changes checked state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool checked);
```

### Behaviour

- Fired after a genuine checked-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Default fallback wording removed.
- Legacy fallback wording normalizes to empty.
- Explicit custom labels remain supported.
- Semantic theme and checked-state parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔀 STANDARD SWITCH
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Checked(bool checked);
```

### Behaviour

- Setter changes checked state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool checked);
```

### Behaviour

- Fired after a genuine checked-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Checked state uses the active amber semantic accent.
- Explicit generated styling overrides native LVGL blue.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔘 STANDARD RADIO
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Selected(bool selected);
```

### Behaviour

- Setter changes independent selected state silently.
- Duplicate states are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(bool selected);
```

### Behaviour

- Fired after a genuine selected-state change.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Default `"Radio"` text removed.
- Default rendering is indicator-only.
- Explicit custom labels remain supported.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 📶 STANDARD PROGRESS
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Output-only setter clamps to the configured range.
- Duplicate effective values are ignored.
- Native `lv_bar` is non-draggable.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Progress has no genuine user transition.
- No changed hook is generated.

---

## 📝 Notes

- Output-only native `lv_bar`.
- Setter-only runtime.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# ⭕ STANDARD CIRCULAR PROGRESS
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Output-only setter clamps to the configured range.
- Duplicate effective values are ignored.
- No touch dragging or interaction.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Circular Progress has no genuine user transition.
- No changed hook is generated.

---

## 📝 Notes

- Native `lv_arc`.
- Full 360° background arc with 270° rotation.
- `surfaceSecondary` remaining track and `accent` indicator.
- Knob removed and clickability disabled.
- Semantic theme parity.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔢 STANDARD NUMBER INPUT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Value(int32_t value);
```

### Behaviour

- Setter clamps to minimum and maximum silently.
- Hardware increment/decrement buttons consume serialized step.
- Button changes invoke the developer hook.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(int32_t value);
```

### Behaviour

- Fired after genuine text edits or hardware stepper changes.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Outer container owns the complete semantic border.
- Numeric textarea plus hardware increment and decrement buttons.
- Vertical field/stepper divider and horizontal button divider.
- Step support and minimum/maximum clamping.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔽 STANDARD SELECT
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_<Name>_Selected_Index(uint32_t index);
```

### Behaviour

- Setter clamps to the available options silently.
- Duplicate effective selections are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_<Name>_Changed(uint32_t index, const char * text);
```

### Behaviour

- Fired after a genuine selection change.
- Supplies selected index and text.
- Never fired by the setter or during startup.

---

## 📝 Notes

- Native `lv_dropdown`.
- Closed control and popup list are semantically themed.
- Semantic outer border and dropdown arrow.
- Native blue selected-row styling is overridden.
- Canvas ↔ Browser Preview ↔ Generated LVGL ↔ ESP32-P4 parity.
- Hardware proven.

---

# ==============================================================================
# 📊 STANDARD BAR
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Progress_Bar(int32_t value);
```

### Behaviour

- Values are clamped.
- Supports negative and reversed ranges.
- Duplicate values are ignored.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Progress_Bar_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas click and drag authoring.
- Rounded LVGL parity.
- Canvas movement preserved.
- Semantic theme: track uses `surfaceSecondary`, border uses `surfaceBorder`, indicator uses `accent`.
- Hardware proven.

---

# ==============================================================================
# 🌀 STANDARD ARC
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Value_Arc(int32_t value);
```

### Behaviour

- Values are clamped.
- Supports negative, reversed and equal ranges.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Value_Arc_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas stroke adjustment.
- Transparent centre remains available for movement.
- Browser Preview parity.
- Semantic theme: background arc uses `surfaceSecondary`, indicator uses `accent`, knob uses `accentText`.
- Hardware proven.

### Current Limitation

- Rotation, background angles and mode are exporter-supported but not yet editable in the Inspector.

---

# ==============================================================================
# 📈 STANDARD CHART
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Add_Data_Chart_Point(int32_t value);
void FG_Clear_Data_Chart(void);
```

### Behaviour

- Runtime values are clamped.
- Points are appended to the current series.
- Clear removes the entire series.
- Startup population does not invoke runtime APIs.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Data_Chart_Point_Added(int32_t value);
void FG_On_Data_Chart_Cleared(void);
```

### Behaviour

- Fired when a runtime point is added.
- Fired when the chart is cleared.
- Never fired during startup.

---

## 📝 Notes

- Shared Canvas and Browser renderer.
- Native `lv_chart` retained.
- Responsive plot geometry and gutters.
- Y-axis labels: `100`, `75`, `50`, `25`, `0`.
- X-axis point-index labels: `0`, `1`, `2`, `3`, `4`, `5`, `6`.
- Axis labels are non-clickable sibling `lv_label` objects.
- X labels derive from point indexes; no category, date or timestamp semantics are invented.
- Selected-theme surface, border, divisions and secondary label text.
- Hardware proven.

### Current Limitation

- Chart Inspector controls are not yet available.

---

# ==============================================================================
# 🗂️ STANDARD TABLE
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- ESP32-P4 Hardware

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Static LVGL table component.
- Exported cell values match Studio.
- No runtime API currently required.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Static display component.
- No runtime events.

---

## 📝 Notes

- Selected semantic theme surface.
- Consistent `surfaceSecondary` cell fill.
- `surfaceBorder` grid and outer bounds.
- `textPrimary` cell text.
- Rounded clipped frame.
- Canvas, Browser and P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🧱 FORGEUI LAYOUT DESIGNER
# ==============================================================================

## Current Template

**Dashboard — Reference Implementation**

## Status

**🟡 CANVAS AND BROWSER PREVIEW MANUALLY VERIFIED — GENERATED OUTPUT AND HARDWARE PROOF PENDING**

---

## ✔ Verified

- Deterministic Dashboard template
- Header smart region
- Status smart region
- Main smart region
- Controls smart region
- Footer smart region
- Real editable Box components
- One Divider
- One Heading placeholder
- Manual region selection
- Manual region movement
- Manual region resizing
- Stable Inspector-based region assignment
- Auto Arrange
- AI Fill Dashboard
- Canonical component validation
- Canvas rendering
- Browser Preview rendering
- Existing project component model
- Existing save/reload architecture
- Focused Box exporter coverage
- 20 focused Layout Designer tests

---

## 🧩 Architecture

```text
Natural-language prompt
        ↓
Layout Designer
        ↓
Dashboard Template
        ↓
AI Fill
        ↓
Normal ForgeUI Components
        ↓
Canvas
        ↓
Browser Preview
        ↓
LVGL Export
```

AI Fill selects canonical supported content and semantic regions. ForgeUI Layout Designer owns template structure and final geometry. Smart Regions are normal editable Box components. Auto Arrange computes final child `x/y/w/h`. The existing component document remains authoritative, and the existing LVGL exporter receives normal ForgeUI components.

Layout Designer does not introduce a new runtime family, public API family, User Event hook family, generated firmware document or export payload field. It resolves into normal ForgeUI components before export.

---

## ⚙ Generated Runtime API

**No Layout Designer-specific API generated**

Region Boxes remain Standard Box components. Non-root Boxes may retain the existing visibility setter where applicable. Contained controls retain their normal component-specific APIs and hooks. Layout Designer itself generates no `FG_Set_*` or `FG_On_*` contract.

```text
Dashboard Controls region
  ├── Start Button
  ├── Pause Button
  └── Reset Button

Region Box
  → normal generated LVGL object
  → optional existing Box visibility API

Contained controls
  → retain their existing generated runtime contracts
```

---

## 🗂 Current Template Status

✅ Dashboard

### Future Template Candidates

- ⬜ Settings
- ⬜ Login
- ⬜ Form
- ⬜ Machine Status
- ⬜ Sidebar
- ⬜ Split View
- ⬜ Card Grid
- ⬜ Control Panel

These are planned template extensions. They are not implemented or proven in the current save point. Dashboard is the only completed structural template.

---

## Not Yet Proven

- Full Studio production build
- Additional live OpenAI network testing beyond the manually observed AI Fill workflow
- Current generated `90_Studio_Export.c` inspection
- Generated LVGL project inspection
- Dashboard → Generate → Build → Flash parity
- ESP-IDF firmware build for the Layout Designer dashboard
- ESP32-P4 flash
- Physical Canvas ↔ Browser Preview ↔ generated LVGL ↔ ESP32-P4 parity
- Settings, Login, Form, Machine Status or other structural templates

---

## 📝 Notes

- Dashboard regions remain movable and resizable after application.
- Region assignment currently occurs through Inspector.
- Drag-to-assign is not implemented.
- Structural-lock metadata exists but direct Canvas enforcement is not yet complete.
- Legacy free-coordinate AI generation remains available for compatibility.
- Dashboard template mode uses Studio-owned region geometry rather than AI-owned pixel coordinates.
- Generated firmware cannot distinguish between manually placed and AI-filled components.

---

# ==============================================================================
# ⌨️ STANDARD KEYBOARD
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Show_Keyboard(void);
void FG_Hide_Keyboard(void);
```

### Behaviour

- Shows the standalone keyboard.
- Hides the keyboard.
- Standalone keyboard is not automatically attached to a textarea.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Keyboard_Shown(void);
void FG_On_Keyboard_Hidden(void);
```

### Behaviour

- Fired when the keyboard is shown.
- Fired when the keyboard is hidden.
- Never fired during startup.

---

## 📝 Notes

- Standalone textarea removed.
- Selected semantic theme surface, keys, borders, states and text.
- Semi-transparent panel.
- Opaque keys.
- Show/Hide APIs preserved.
- Wi-Fi and Storage keyboards remain independent.
- Hardware proven.

---

# ==============================================================================
# 📅 STANDARD CALENDAR
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);
```

### Behaviour

- Validates Gregorian dates, including leap years.
- Suppresses repeated effective selections.
- Updates the shown and selected date.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Calendar_Date_Changed(uint16_t year, uint8_t month, uint8_t day);
```

### Behaviour

- Fired after an effective date change.
- Touch and runtime updates use the same retained date.
- Never fired during startup.

---

## 📝 Notes

- Fixed proof model: June 2026.
- Sunday-first, 42 date cells and six visible weeks.
- Spill dates and today outline preserved.
- Selected semantic theme surface, border, primary/secondary text and accent.
- Hardware proven.

---

# ==============================================================================
# 📏 STANDARD SCALE
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- ESP32-P4 Hardware

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Static native LVGL scale.
- Owns no current runtime value.
- No runtime API is required.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No runtime events.

---

## 📝 Notes

- Horizontal-bottom layout.
- Range `0..100`.
- 11 ticks with six numeric labels.
- No surrounding panel.
- Ticks use `accent`; labels use `textPrimary`.
- Hardware proven.

---

# ==============================================================================
# 🎛️ STANDARD ROLLER
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Option_Roller_Selected(uint32_t index);
```

### Behaviour

- Clamps selection to the available options.
- Suppresses repeated effective selections.
- Preserves native Roller scrolling and snapping.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Option_Roller_Changed(uint32_t index, const char * text);
```

### Behaviour

- Fired after an effective selection change.
- Supplies the selected index and option text.
- Never fired during startup.

---

## 📝 Notes

- Canvas and Browser share the same renderer.
- Opaque selected-theme surface.
- Border, normal text and selected text use semantic theme roles.
- Visible row count and native behavior preserved.
- Hardware proven.

---

# ==============================================================================
# 💬 STANDARD MSGBOX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime APIs
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime APIs (90_Studio_Export)

```c
void FG_Show_Message(void);
void FG_Close_Message(void);
```

### Behaviour

- Shows and foregrounds the Message Box.
- Closes the Message Box.
- Duplicate visibility changes are ignored.
- Startup does not invoke the runtime APIs.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Message_Shown(void);
void FG_On_Message_Closed(void);
void FG_On_Message_Button_Pressed(uint32_t index, const char * text);
```

### Behaviour

- Shown and Closed hooks follow effective visibility changes.
- Button hook supplies the selected button index and text.
- Never fired during startup.

---

## 📝 Notes

- Custom ForgeUI panel; does not use `lv_msgbox_create`.
- Title, body and outlined buttons preserved.
- Selected semantic theme surface, border and text.
- Canvas, Browser and P4 parity.
- Hardware proven.

---

# ==============================================================================
# 🔢 STANDARD BUTTONMATRIX
# ==============================================================================

## Status

**✅ PROVEN**

---

## ✔ Verified

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware
- Silent Startup

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Menu_Matrix_Selected(uint32_t button_index);
```

### Behaviour

- Clamps selection to the available buttons.
- Rejects disabled buttons.
- Suppresses repeated effective selections.
- Startup does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Menu_Matrix_Button_Selected(uint32_t index, const char * text);
```

### Behaviour

- Fired after an effective button selection.
- Supplies the selected button index and text.
- Never fired during startup.

---

## 📝 Notes

- Row breaks do not count as buttons.
- Selected and checked states remain distinct.
- Selected semantic theme surface, buttons, borders, text, selected and disabled states.
- Canvas, Browser and P4 parity.
- Hardware proven.
