# ForgeUI Standard TileView

Status: **PROVEN ON ESP32-P4**.

ForgeUI TileView uses the native LVGL 9.2.2 TileView APIs. It retains the
existing fixed `2 × 2` coordinate model and labels (`Tile 1` through
`Tile 4`). One full-size page is active at a time.

## Audited pipeline

- Widget Registry and registry-driven Widget Tray
- Canvas with editor-safe single-page rendering
- Inspector initial-column and initial-row controls
- Browser Preview swipe and arrow-key navigation
- native `lv_tileview_create()` / `lv_tileview_add_tile()` export
- Runtime SDK setter and collision-safe `95_UserEvents` hook
- `CONFIG_LV_USE_TILEVIEW` registry metadata and ESP-IDF default
- shared live Studio and Standalone export generator
- standalone preservation merge for developer-owned hook bodies

## Runtime contract

```c
void FG_Set_<Name>_Selected(uint32_t column, uint32_t row);
void FG_On_<Name>_Changed(uint32_t column, uint32_t row);
```

Names derive from the Studio component name and are made collision-safe by the
generator. Coordinates clamp to the fixed `0..1` column and row ranges. The
setter is silent, startup is silent, and only a genuine user tile transition
invokes the changed hook.

## LVGL 9.2.2 mapping

The exporter creates four native pages with direction masks limited to actual
neighbours. It initializes the serialized coordinate with
`lv_tileview_set_tile_by_index(..., LV_ANIM_OFF)`, changes programmatic state
with `lv_tileview_set_tile(..., LV_ANIM_OFF)`, and resolves physical swipe
completion from `LV_EVENT_VALUE_CHANGED` plus
`lv_tileview_get_tile_active()`.

## Physical proof

ESP32-P4 hardware evidence confirms silent startup, correct fixed `2 × 2`
coordinate reporting, horizontal and vertical navigation, one callback per
effective tile change, and stable repeated navigation. Observed coordinates
included `(1,0)`, `(0,0)`, `(1,1)` and `(0,1)`. Wi-Fi remained connected, SD
remained ready, and TabView, Spinbox and List continued working afterward.
