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

---

# ==============================================================================
# 🖼️ STANDARD CANVAS
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Shared renderer
- Configured artwork resolution
- Generated LVGL
- Uploaded asset-source integration
- Automated regression coverage

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Presentation-only bounded container.
- Owns no semantic runtime state.
- Configured artwork is exported through a child LVGL image.
- No runtime setter is currently required.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No genuine runtime user event.

---

## 📝 Notes

- Canvas and Browser Preview use one shared artwork-aware renderer.
- Decorative placeholder SVG artwork is not invented by the generic renderer.
- Configured artwork resolves through the uploaded-asset registry.
- Artwork preserves centred contain fit, clipping, transparency and serialized `x` / `y` / `w` / `h`.
- Generated LVGL uses a clipped parent and centred child `lv_image`.
- Generated image symbols and source files remain exporter-owned.
- `90_Studio_Export.c` must not be manually patched.

### Current Limitation

- Final current-project Generate -> Build -> Flash -> ESP32-P4 artwork confirmation remains pending.

---

# ==============================================================================
# 🗂️ STANDARD TABVIEW
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Shared renderer
- Generated LVGL
- Runtime API
- 95_UserEvents
- Silent Startup
- Automated geometry and exporter regressions

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Tab_View_Selected(uint32_t tab_index);
```

### Behaviour

- Selects one of the three fixed tabs.
- Clamps indexes above the final tab.
- Suppresses repeated effective selections.
- Uses the retained selected index.
- Startup does not invoke the runtime API or hook.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Tab_View_Changed(uint32_t tab_index);
```

### Behaviour

- Fired after a genuine effective tab change.
- Programmatic setter updates remain silent.
- Never fired during startup.

---

## 📝 Notes

- Three fixed tabs remain: Tab 1, Tab 2 and Tab 3.
- Serialized `selectedIndex` initializes the preview and generated runtime.
- Canvas and Browser Preview use one shared renderer.
- Geometry uses a 34 px tab bar, equal/remainder tab widths and explicit content sizing.
- Selected styling uses semantic surfaces, text and accent bottom indicator.
- Browser Preview does not simulate native swipe animation.

### Current Limitation

- Final Generate -> Build -> Flash -> ESP32-P4 geometry, selection and touch confirmation remains pending.

---

# ==============================================================================
# 🧩 STANDARD TILEVIEW
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Shared renderer
- Generated LVGL
- Runtime API
- 95_UserEvents
- Silent Startup
- Automated geometry and exporter regressions

---

## ⚙ Runtime API (90_Studio_Export)

```c
void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);
```

### Behaviour

- Selects one tile in the visible `2 × 2` panel.
- Clamps coordinates to the generated grid.
- Suppresses repeated effective selections.
- Synchronizes the selected child with `LV_STATE_CHECKED`.
- Startup remains silent.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Tileview_Changed(uint32_t column, uint32_t row);
```

### Behaviour

- Fired after a genuine effective tile selection.
- Programmatic setter updates remain silent.
- Never fired during startup.

---

## 📝 Notes

- Current ForgeUI contract is four simultaneously visible tiles.
- Tile coordinates are `(0,0)`, `(1,0)`, `(0,1)` and `(1,1)`.
- Shared geometry uses 8 px padding, 6 px gaps and equal rows/columns.
- Canvas and Browser Preview use the same renderer.
- Generated LVGL uses a bounded parent and four visible child objects.
- Native one-page-at-a-time swipe paging is not part of this contract.

### Current Limitation

- Final Generate -> Build -> Flash -> ESP32-P4 layout, click and checked-state confirmation remains pending.

---

# ==============================================================================
# 📐 STANDARD LINE
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Shared renderer
- Generated LVGL
- Backward compatibility
- Automated endpoint, geometry and exporter regressions

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Presentation-only native `lv_line`.
- Owns no semantic runtime state.
- Stored endpoints determine generated geometry.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No genuine runtime user event.

---

## 📝 Notes

- Serialized endpoints are `startX`, `startY`, `endX` and `endY`.
- Coordinates are relative to the Line origin.
- Selected Canvas Lines expose draggable endpoint handles.
- Endpoint dragging redraws immediately and rebases `x` / `y` and `w` / `h`.
- Existing wrapper retains whole-component movement.
- Browser Preview uses the shared endpoint-aware renderer.
- Generated LVGL uses native `lv_line_create()` and `lv_line_set_points()`.
- Legacy projects resolve from `(0,0)` to `(width,height)`.
- Horizontal, vertical, 45-degree, crossed and arbitrary-angle exports are covered.
- Semantic colour role is `surfaceBorder`.

### Current Limitation

- Shift-angle snapping is not implemented.
- Browser Preview remains display-only.
- Final Generate -> Build -> Flash -> ESP32-P4 endpoint geometry confirmation remains pending.

---

# ==============================================================================
# 📝 STANDARD TEXT
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Shared renderer
- Generated LVGL
- Semantic theme propagation
- Automated preview and exporter regressions

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Serialized presentation only.
- Visible content remains owned by `textValue`.
- No runtime text setter is generated.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No genuine runtime user event.

---

## 📝 Notes

- Canvas and Browser Preview use the shared Standard Text renderer.
- Default semantic role is `textPrimary`.
- Legacy literal white does not override the semantic default.
- Generated LVGL explicitly applies `lv_obj_set_style_text_color(...)`.
- Serialized content, geometry, font size, alignment and wrapping are preserved.
- Top-left alignment matches the generated presentation.
- Custom non-white theme proof reaches Canvas, Browser Preview and exporter output.

### Current Limitation

- Final Generate -> Build -> Flash -> ESP32-P4 semantic colour confirmation remains pending.

---

# ==============================================================================
# 🔠 STANDARD HEADING
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Inspector
- Shared renderer
- Generated LVGL
- Semantic theme propagation
- Automated preview and exporter regressions

---

## ⚙ Runtime API (90_Studio_Export)

**None generated**

### Behaviour

- Serialized presentation only.
- Visible content remains owned by `headingText`.
- No runtime heading setter is generated.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Presentation-only component.
- No genuine runtime user event.

---

## 📝 Notes

- Canvas and Browser Preview use the shared Standard Heading renderer.
- Default semantic role is `textPrimary`.
- Legacy literal white does not override the semantic default.
- Generated LVGL explicitly applies the resolved text colour.
- Serialized content, geometry, size, weight and alignment are preserved.
- Top-left alignment and hierarchy match the generated presentation.
- Custom non-white theme proof reaches Canvas, Browser Preview and exporter output.

### Current Limitation

- Final Generate -> Build -> Flash -> ESP32-P4 semantic colour confirmation remains pending.

---

# ==============================================================================
# 📶 STANDARD WI-FI PRESENTATION
# ==============================================================================

## Status

**🟡 READY FOR P4 PROOF**

---

## ✔ Verified

- Canvas authoring
- Browser Preview
- Project Persistence
- Shared renderer
- Generated LVGL
- Established runtime status mapping
- Automated wrapping and generated-output regressions

---

## ⚙ Runtime API (90_Studio_Export)

**None newly generated**

### Behaviour

- Presentation remains driven by existing runtime polling and status mapping.
- No new Wi-Fi setter or behavior was introduced.

---

## 🧩 Developer Hook (95_UserEvents)

**None generated**

### Behaviour

- Wi-Fi status projection is generated platform presentation.
- It does not create a developer user-event boundary.

---

## 📝 Notes

- Canvas and Browser Preview use the same three-line structure.
- Established failed/disconnected presentation remains:

```text
WIFI
WIFI_FAIL
IP: -
```

- `DISCONNECTED` is not substituted for `WIFI_FAIL`.
- Lines remain independently legible inside serialized bounds.
- Wrapping must not create an additional clipped line.
- Runtime polling and `fg_wifi_status_text()` retain state-mapping ownership.
- Semantic theme colours remain unchanged.

### Current Limitation

- Final Generate -> Build -> Flash -> ESP32-P4 wording and clipping confirmation remains pending.
