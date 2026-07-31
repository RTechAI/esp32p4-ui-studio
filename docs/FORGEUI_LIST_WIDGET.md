# ForgeUI Standard List

ForgeUI List is a Registry-owned Standard widget backed by native LVGL 9
`lv_list`. It is not the legacy Chakra child-container implementation.

## Properties

- `title`: optional section heading.
- `items`: newline-delimited button labels (blank lines are ignored).
- `itemHeight`: button height, clamped to 24–120 pixels.

The shared List model normalizes these values for Canvas, Browser Preview and
LVGL export, so serialized and hydrated projects render consistently.

## Generated LVGL

Export creates the container with `lv_list_create`, an optional
`lv_list_add_text` heading and one `lv_list_add_button` per item. Semantic theme
surface, border, text, selected-surface and accent-text colours are applied.
List code is generated only when a List instance is present.

List has no setter or retained selection API. Every native list button does,
however, generate one genuine-user click callback:

```c
void FG_On_<List_Name>_Item_Clicked(
    uint32_t index,
    const char * text);
```

For a widget named `System Menu`:

```c
void FG_On_System_Menu_Item_Clicked(
    uint32_t index,
    const char * text)
{
    printf("System Menu\nItem %lu\n%s\n",
           (unsigned long)index,
           text ? text : "");
}
```

Indexes are zero-based and text points to the corresponding generated item
label. Each `lv_list_add_button` receives one `LV_EVENT_CLICKED` handler.
Construction and startup do not call the hook. Duplicate widget names receive
ForgeUI's normal `_2`, `_3` collision-safe suffixes.

## Proof status

**LIST — PROVEN ON ESP32-P4.** The completed authoritative pipeline is:

```text
Official LVGL Reference
→ Widget Registry
→ Widget Tray
→ Canvas
→ Inspector
→ Browser Preview
→ Native LVGL Export
→ 95_UserEvents
→ Live Studio firmware
→ Standalone Export
→ ESP32-P4 physical proof
→ Documentation
→ PROVEN
```

Serialization defaults, semantic theme integration, authoritative
`CONFIG_LV_USE_LIST` gating and focused automated tests are also complete.

Physical validation used the Waveshare ESP32-P4-WIFI6-Touch-LCD-7B with
ESP-IDF 5.5.4 and LVGL 9.2.2. Startup was silent. Controlled taps emitted item
`0` / `Overview`, item `1` / `Settings` and item `2` / `Diagnostics`, with
exactly one callback per tap. Repeated row taps remained stable. TabView and
Spinbox continued operating afterward, Wi-Fi remained connected, SD remained
ready and the runtime remained stable. Connected-stage internal RAM was
approximately 39 KB free. Live and standalone projects both build from the
same generated List C/H contract.

Proof also exposed and resolved two parity/architecture gaps: Browser Preview
rows now behave as buttons while Canvas rows remain editor-safe, and List
exports now include `95_UserEvents.h` before initializing callback metadata.
