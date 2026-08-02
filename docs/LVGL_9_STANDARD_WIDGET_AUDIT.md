# Final LVGL 9 Standard Widget Audit

Audit date: 2026-08-01; Batch 2 Window proof aligned 2026-08-02
Firmware baseline: LVGL 9.2.2
Primary source: [official LVGL 9.2 widget index](https://docs.lvgl.io/9.2/widgets/index.html)
Forward-looking source: [current LVGL widget index](https://docs.lvgl.io/master/widgets/index.html)

## Conclusion

**Option B — the official LVGL phase is not yet closed.**

ForgeUI now has **43 practical LVGL 9.2 widgets/components physically proven
on ESP32-P4**. Three closure classes completed Batch 1 and Window completed Batch 2:

- Animation Image (`lv_animimg`) — **PROVEN**
- Image Button (`lv_imagebutton`) — **PROVEN**
- Lottie (`lv_lottie`) — **INTENTIONALLY EXCLUDED** from the practical embedded
  baseline because it requires the ThorVG/vector/C++ path and a dedicated
  ARGB8888 render buffer
- Menu (`lv_menu`) — **IMPLEMENTED — READY FOR PHYSICAL PROOF**
- Span (`lv_span`) — **PROVEN**
- Window (`lv_win`) — **PROVEN**

Menu is implemented and is the only practical closure proof remaining.
Lottie remains intentionally excluded.

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
| Menu (`lv_menu`) | 🟡 IMPLEMENTED — READY FOR PHYSICAL PROOF | Registry-backed native pages, sections, item containers, load-page links and back history pass focused software validation. |
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

## Missing-widget effort and order

| Order | Widget | Estimated effort | Reason |
| --- | --- | --- | --- |
| 1 | Menu physical proof | Medium | Validate native multi-page navigation, back history, disabled items and multi-instance independence on ESP32-P4. |

Lottie is not recommended for this closure sprint. Its dependency and memory
cost should be handled as a separate opt-in media architecture decision.

## Window and Menu decision

Both `lv_win` and `lv_menu` are explicitly listed by the official LVGL 9.2
documentation. Window is complete and physically proven, establishing the
smaller structured-container boundary. Menu now implements deeper page and
navigation ownership and awaits hardware proof before practical coverage closes.

After Menu is physically proven—and Lottie remains
explicitly excluded—the project can close
the practical LVGL 9.2 chapter and move fully to ForgeUI-native widgets.
