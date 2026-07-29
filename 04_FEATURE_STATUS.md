# FORGEUI CORE

Only components personally reviewed and proven across the applicable workflow are listed here.

Validation includes, where applicable:

- Canvas
- Browser Preview
- Project Persistence
- Generated LVGL
- Runtime API
- 95_UserEvents
- ESP32-P4 Hardware

Components remain absent from this document until they are personally signed off.

---

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

- Changes the LED runtime state.
- Duplicate states are ignored.
- Startup initialization does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Status_LED_Changed(bool enabled);
```

### Behaviour

- Fired after an effective runtime state change.
- Never fired during startup.
- Intended for application logic.

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
- Supports negative ranges.
- Supports reversed ranges.
- Duplicate effective values are ignored.
- Startup initialization does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Progress_Bar_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.
- Intended for application logic.

---

## 📌 Current Proven Configuration

```text
Minimum : 0
Maximum : 100
Value   : 42
```

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas click authoring.
- Direct Canvas drag authoring.
- Pointer capture outside bounds.
- Rounded LVGL light-theme parity.
- Canvas movement preserved.
- Full hardware parity verified.

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
- Supports negative ranges.
- Supports reversed ranges.
- Supports equal ranges.
- Startup initialization does not invoke the runtime API.

---

## 🧩 Developer Hook (95_UserEvents)

```c
void FG_On_Value_Arc_Changed(int32_t value);
```

### Behaviour

- Fired after an effective runtime value change.
- Never fired during startup.
- Intended for application logic.

---

## 📌 Current Proven Configuration

```text
Minimum : 0
Maximum : 100
Value   : 74
```

---

## 📝 Notes

- Inspector supports Minimum, Maximum and Initial Value.
- Direct Canvas stroke adjustment.
- Transparent centre moves the component.
- Pointer capture outside bounds.
- Rotation-aware value mapping.
- Browser Preview parity.
- Full hardware parity verified.

---

## ⚠ Known Limitation

- Rotation, background angles and mode are supported by serialization/export but are not yet editable in the Inspector.

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
- Runtime API
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

- Runtime values are clamped to the configured Y range.
- Points are appended to the current series.
- Clear removes the current series.
- Startup population does not invoke runtime APIs.

---

## 🧩 Developer Hooks (95_UserEvents)

```c
void FG_On_Data_Chart_Point_Added(int32_t value);
void FG_On_Data_Chart_Cleared(void);
```

### Behaviour

- Fired when runtime code adds a point.
- Fired when the chart is cleared.
- Neither hook is fired during startup initialization.

---

## 📝 Notes

- Shared Canvas and Browser renderer.
- LVGL light-theme visual parity.
- White rounded surface.
- Grey border and grid.
- Blue series.
- Full ESP32-P4 parity verified.

---

## ⚠ Known Limitation

- Chart Inspector controls are not yet implemented.