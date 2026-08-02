# ForgeUI Menu Widget

Status: **IMPLEMENTED — READY FOR PHYSICAL PROOF** (2026-08-02).

Menu is ForgeUI's final practical LVGL 9.2 implementation candidate. It is not
PROVEN until the ESP32-P4 checklist below passes. Lottie remains intentionally
excluded from practical closure.

## Architecture

Menu is a Registry-backed `structured` navigation widget. Its normal component
record serializes a stable page → section → item tree; item target-page IDs form
navigation links. No List, parallel hierarchy, renderer, exporter, runtime or
event system is introduced.

The Inspector authors pages, sections, labels, subtitles, native symbol names,
target pages, enabled states, root page, header mode, root back control and a
focused appearance set. Missing or legacy properties normalize to a usable
three-page Settings example, preserving backward-compatible project loading.

Canvas renders the selected root page without accepting navigation clicks so
editing remains safe. Browser Preview supports child-page navigation and back
history. The shared Live/Standalone generator emits native LVGL 9.2 Menu APIs:

```c
lv_menu_create(...)
lv_menu_page_create(...)
lv_menu_section_create(...)
lv_menu_cont_create(...)
lv_menu_separator_create(...)
lv_menu_set_load_page_event(...)
lv_menu_set_page(...)
```

LVGL owns page storage, navigation history, current-page state and back
behavior. Multiple Menu instances use independent generated page/item symbols.

## Runtime and UserEvents

No public Runtime SDK API or `95_UserEvents` hook is emitted in this first
implementation. Native item links and back navigation already provide the
essential navigation framework. Public page-selection and application event
contracts are deliberately deferred until hardware proof establishes the
native interaction boundary and concrete application requirements exist.

## Recommended ESP32-P4 proof layout

Use two side-by-side Menus on the 1024×600 display:

- left, 460×520: `Settings` root with `Display` and `Network` child pages,
  section heading, icons, subtitles, one disabled leaf item, top-fixed header;
- right, 460×520: independent `Diagnostics` root and `System` child page,
  bottom-fixed header and root back control enabled.

## Physical proof checklist

1. Save and reload the project; confirm both serialized page trees remain.
2. Check Canvas and Browser Preview. In Browser, open every child page and use
   Back to return to its correct parent.
3. Export Live Studio and Standalone projects without editing generated C.
4. Confirm both exports contain native Menu/page/section/container constructors,
   `lv_menu_set_load_page_event`, distinct `objN_page_N` symbols and the correct
   initial root page.
5. Build and flash the Standalone export to the Waveshare ESP32-P4 1024×600.
6. Confirm both Menus, headers, section titles, labels, subtitles and icons
   render without corruption.
7. Navigate Settings → Display → Back and Settings → Network → Back. Confirm
   history is correct and the disabled item does not navigate.
8. Exercise the second Menu independently and confirm it does not change the
   first Menu's page or history.
9. Repeat navigation at least ten times, then confirm no crash, reboot,
   watchdog, stuck page or obvious rendering corruption.
10. Power-cycle once and repeat one forward/back cycle in each Menu.
11. Record the export commit, build result, serial log and photographs before
   promoting Menu to PROVEN or declaring practical LVGL closure complete.

## Deliberate limitations

- Sidebar mode, arbitrary child widgets inside pages and programmatic page APIs
  are deferred.
- Item icons accept native `LV_SYMBOL_*` names; the full asset/icon picker is
  not duplicated here.
- Browser Preview represents native structure faithfully but does not recreate
  every LVGL transition animation.
- Menu is not yet physically proven.

