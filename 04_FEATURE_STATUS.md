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
- LVGL light-theme parity.
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

- Dark ForgeUI theme.
- Filled cells.
- Orange grid.
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
- Light LVGL theme.
- Semi-transparent panel.
- Opaque keys.
- Show/Hide APIs preserved.
- Wi-Fi and Storage keyboards remain independent.
- Hardware proven.