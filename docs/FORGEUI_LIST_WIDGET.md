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

Registry, Tray, Inspector, Canvas, Browser Preview, serialization defaults,
native LVGL export, theme integration, standalone export and focused automated
tests are implemented. Physical rendering is verified. One final ESP32-P4
proof of the generated item callback is required before marking List PROVEN.
