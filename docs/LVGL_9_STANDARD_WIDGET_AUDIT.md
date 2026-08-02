# Final LVGL 9 Standard Widget Audit

Audit date: 2026-08-01; final Menu proof aligned 2026-08-02
Firmware baseline: LVGL 9.2.2
Primary source: [official LVGL 9.2 widget index](https://docs.lvgl.io/9.2/widgets/index.html)
Forward-looking source: [current LVGL widget index](https://docs.lvgl.io/master/widgets/index.html)

Current milestone:
`FORGEUI_LVGL9_COMPLETE__44_OF_44_PRACTICAL_WIDGETS_PROVEN__ESP32P4_VALIDATED__DOCUMENTATION_COMPLETE__READY_FOR_NATIVE_FORGEUI_PLATFORM__2026-08-02`.

## Conclusion

**The practical LVGL 9.2 phase is complete.**

ForgeUI now has **44 practical LVGL 9.2 widgets/components physically proven
on ESP32-P4**. Three closure classes completed Batch 1, Window completed Batch
2 and Menu completed the final hardware proof:

- Animation Image (`lv_animimg`) — **PROVEN**
- Image Button (`lv_imagebutton`) — **PROVEN**
- Lottie (`lv_lottie`) — **INTENTIONALLY EXCLUDED** from the practical embedded
  baseline because it requires the ThorVG/vector/C++ path and a dedicated
  ARGB8888 render buffer
- Menu (`lv_menu`) — **PROVEN**
- Span (`lv_span`) — **PROVEN**
- Window (`lv_win`) — **PROVEN**

No practical LVGL widgets remain. Lottie remains intentionally excluded.

## Complete LVGL 9.2 matrix

| Official LVGL 9.2 widget | ForgeUI status | Notes |
| --- | --- | --- |
| Base object (`lv_obj`) | ✅ PROVEN | Represented by Box/container generation. |
| Arc (`lv_arc`) | ✅ PROVEN | Registered as Arc. |
| Animation Image (`lv_animimg`) | ✅ PROVEN | Asset Manager authoring, ordered canonical frames, zero-frame parity, native animation and Live/Standalone ESP32-P4 parity passed. |
| Bar (`lv_bar`) | ✅ PROVEN | Registered as Bar; Progress is an additional composed semantic variant. |
| Button (`lv_button`) | ✅ PROVEN | Registered as Button; Icon Button is an additional ForgeUI presentation. |
| Button Matrix (`lv_buttonmatrix`) | ✅ PROVEN | Registered as Button Matrix. |
| Calendar (`lv_calendar`) | ✅ PROVEN | Registered as Calendar. |
| Chart (`lv_chart`) | ✅ PROVEN | Registered as Chart. |
| Canvas (`lv_canvas`) | ✅ PROVEN | Registered as Canvas. |
| Checkbox (`lv_checkbox`) | ✅ PROVEN | Registered as Checkbox; Radio is an additional styled checkbox semantic. |
| Drop-down list (`lv_dropdown`) | ✅ PROVEN | Registered as Select. |
| Image (`lv_image`) | ✅ PROVEN | Registered as Image; Icon reuses the canonical image/symbol pipeline. |
| Image Button (`lv_imagebutton`) | ✅ PROVEN | Native released/pressed/disabled sources, enabled API, click hook and Live/Standalone ESP32-P4 parity passed. Distinct from Icon Button. |
| Keyboard (`lv_keyboard`) | ✅ PROVEN | Registered as Keyboard. |
| Label (`lv_label`) | ✅ PROVEN | Represented by Text and Heading. |
| LED (`lv_led`) | ✅ PROVEN | Registered as LED. |
| Line (`lv_line`) | ✅ PROVEN | Registered as Line. |
| List (`lv_list`) | ✅ PROVEN | Registered as List. |
| Lottie (`lv_lottie`) | ⚪ INTENTIONALLY EXCLUDED | Official widget, but outside the practical 9.2.2 baseline because of ThorVG/vector/C++ and framebuffer costs. Reassess only with an explicit animated-vector feature decision. |
| Menu (`lv_menu`) | ✅ PROVEN | Two independent native instances, child-page/Back navigation, repeated cycles and stable system/Wi-Fi/RAM behavior physically validated on ESP32-P4. |
| Message Box (`lv_msgbox`) | ✅ PROVEN | Registered as Message Box. |
| Roller (`lv_roller`) | ✅ PROVEN | Registered as Roller. |
| Scale (`lv_scale`) | ✅ PROVEN | Registered as Scale. |
| Slider (`lv_slider`) | ✅ PROVEN | Registered as Slider. |
| Span (`lv_span`) | ✅ PROVEN | Ordered native spangroup text, semantic/explicit colours, font sizing, underline, alignment and Live/Standalone ESP32-P4 parity passed. |
| Spinbox (`lv_spinbox`) | ✅ PROVEN | Registered as Spinbox. |
| Spinner (`lv_spinner`) | ✅ PROVEN | Registered as Spinner. |
| Switch (`lv_switch`) | ✅ PROVEN | Registered as Switch. |
| Table (`lv_table`) | ✅ PROVEN | Registered as Table. |
| Tabview (`lv_tabview`) | ✅ PROVEN | Registered as TabView. |
| Text area (`lv_textarea`) | ✅ PROVEN | Registered as Textarea; Input is an additional one-line semantic. |
| Tile view (`lv_tileview`) | ✅ PROVEN | Registered as TileView. |
| Window (`lv_win`) | ✅ PROVEN | Registry-backed structured container; two native instances, headers and independent close controls physically validated on ESP32-P4. |

## Widgets added to current LVGL after the 9.2 baseline

These do not change closure criteria for firmware pinned to LVGL 9.2.2.

| Current LVGL widget | ForgeUI status | Decision |
| --- | --- | --- |
| 3D Texture (`lv_3dtexture`) | ⚪ INTENTIONALLY EXCLUDED | Requires a 3D-capable draw unit/OpenGLES and is not present in LVGL 9.2.2. |
| Arc Label (`lv_arclabel`) | 🔵 PLANNED AFTER LVGL UPGRADE | Useful for gauges, but unavailable on the installed 9.2.2 baseline. |
| GIF (`lv_gif`) | ⚪ INTENTIONALLY EXCLUDED FOR 9.2.2 | Current widget uses an external decoder and significant framebuffer memory; evaluate only with an LVGL upgrade and animated-media budget. |
| Pinyin IME | ⚪ INTENTIONALLY EXCLUDED | IME subsystem, excluded by audit scope and not a general Canvas widget requirement. |

## Missing-widget result

No practical LVGL 9.2 widgets remain. Lottie's dependency and memory cost
remain outside this completed program and require a separate opt-in media
architecture decision.

## Window and Menu result

Both `lv_win` and `lv_menu` are explicitly listed by the official LVGL 9.2
documentation. Window and Menu are complete and physically proven, covering
the structured-container and native navigation boundaries.

The practical LVGL 9.2 chapter is closed. ForgeUI now moves to ForgeUI Platform
development, beginning with ForgeUI-native Widgets.
