#include "90_Studio_Export.h"
#include "lvgl.h"

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Neural Core
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x05030A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x05030A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_1024x600_neural_core_67dd4ba0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_1024x600_neural_core_67dd4ba0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);

    lv_obj_t * obj1 = lv_led_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 48, 48);
    lv_led_set_color(obj1, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj1, 255);
    lv_led_on(obj1);

    lv_obj_t * obj2 = lv_bar_create(parent);
    lv_obj_set_pos(obj2, 100, 10);
    lv_obj_set_size(obj2, 166, 18);
    lv_bar_set_range(obj2, 0, 100);
    lv_bar_set_value(obj2, 70, LV_ANIM_OFF);

    lv_obj_t * obj3 = lv_arc_create(parent);
    lv_obj_set_pos(obj3, 3, 78);
    lv_obj_set_size(obj3, 99, 100);
    lv_arc_set_range(obj3, 0, 100);
    lv_arc_set_value(obj3, 65);

    lv_obj_t * obj4 = lv_chart_create(parent);
    lv_obj_set_pos(obj4, 0, 179);
    lv_obj_set_size(obj4, 116, 83);
    lv_chart_set_type(obj4, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(obj4, 7);
    lv_chart_series_t * obj4_ser = lv_chart_add_series(obj4, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);
    lv_chart_set_next_value(obj4, obj4_ser, 10);
    lv_chart_set_next_value(obj4, obj4_ser, 30);
    lv_chart_set_next_value(obj4, obj4_ser, 20);
    lv_chart_set_next_value(obj4, obj4_ser, 50);
    lv_chart_set_next_value(obj4, obj4_ser, 40);
    lv_chart_set_next_value(obj4, obj4_ser, 70);
    lv_chart_set_next_value(obj4, obj4_ser, 60);
    lv_chart_refresh(obj4);

    lv_obj_t * obj5 = lv_table_create(parent);
    lv_obj_set_pos(obj5, 0, 260);
    lv_obj_set_size(obj5, 156, 88);
    lv_table_set_cell_value(obj5, 0, 0, "A1");
    lv_table_set_cell_value(obj5, 0, 1, "B1");
    lv_table_set_cell_value(obj5, 1, 0, "A2");
    lv_table_set_cell_value(obj5, 1, 1, "B2");
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj5, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(obj5, lv_color_hex(0xFFFFFF), LV_PART_ITEMS);
    lv_obj_set_style_border_color(obj5, lv_color_hex(0xD946EF), LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj5, 1, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x1E1035), LV_PART_ITEMS);
    lv_obj_set_style_bg_opa(obj5, LV_OPA_COVER, LV_PART_ITEMS);

    lv_obj_t * obj6 = lv_calendar_create(parent);
    lv_obj_set_pos(obj6, 0, 342);
    lv_obj_set_size(obj6, 237, 155);
    lv_calendar_set_today_date(obj6, 2026, 6, 18);
    lv_calendar_set_showed_date(obj6, 2026, 6);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj6, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj6, 2, LV_PART_MAIN);

    lv_obj_t * obj7 = lv_scale_create(parent);
    lv_obj_set_pos(obj7, 552, 316);
    lv_obj_set_size(obj7, 232, 60);
    lv_scale_set_mode(obj7, LV_SCALE_MODE_HORIZONTAL_BOTTOM);
    lv_scale_set_range(obj7, 0, 100);
    lv_scale_set_total_tick_count(obj7, 11);
    lv_scale_set_major_tick_every(obj7, 2);

    lv_obj_t * obj8 = lv_roller_create(parent);
    lv_roller_set_options(obj8, "One\nTwo\nThree\nFour", LV_ROLLER_MODE_NORMAL);
    lv_roller_set_visible_row_count(obj8, 3);
    lv_obj_set_pos(obj8, 122, 50);
    lv_obj_set_size(obj8, 262, 82);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0xD946EF), LV_PART_SELECTED);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0x05030A), LV_PART_SELECTED);

    lv_obj_t * obj9 = lv_obj_create(parent);
    lv_obj_set_size(obj9, 240, 120);
    lv_obj_set_pos(obj9, 141, 141);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj9, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj9, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj9, 6, LV_PART_MAIN);
    lv_obj_clear_flag(obj9, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * obj9_title = lv_label_create(obj9);
    lv_label_set_text(obj9_title, "Message");
    lv_obj_align(obj9_title, LV_ALIGN_TOP_LEFT, 10, 8);
    lv_obj_t * obj9_text = lv_label_create(obj9);
    lv_label_set_text(obj9_text, "Example message text");
    lv_obj_set_width(obj9_text, 220);
    lv_label_set_long_mode(obj9_text, LV_LABEL_LONG_WRAP);
    lv_obj_align(obj9_text, LV_ALIGN_TOP_LEFT, 10, 30);
    lv_obj_t * obj9_ok = lv_button_create(obj9);
    lv_obj_set_size(obj9_ok, 56, 26);
    lv_obj_align(obj9_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);
    lv_obj_t * obj9_ok_lbl = lv_label_create(obj9_ok);
    lv_label_set_text(obj9_ok_lbl, "OK");
    lv_obj_center(obj9_ok_lbl);
    lv_obj_t * obj9_cancel = lv_button_create(obj9);
    lv_obj_set_size(obj9_cancel, 64, 26);
    lv_obj_align(obj9_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);
    lv_obj_t * obj9_cancel_lbl = lv_label_create(obj9_cancel);
    lv_label_set_text(obj9_cancel_lbl, "Cancel");
    lv_obj_center(obj9_cancel_lbl);

    static const char * obj10_map[] = {"One", "Two", "Three", "\n", "Four", "Five", "Six", ""};
    lv_obj_t * obj10 = lv_buttonmatrix_create(parent);
    lv_buttonmatrix_set_map(obj10, obj10_map);
    lv_obj_set_pos(obj10, 410, 28);
    lv_obj_set_size(obj10, 232, 104);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj10, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj10, 8, LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x1E1035), LV_PART_ITEMS);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xFFFFFF), LV_PART_ITEMS);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xD946EF), LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj10, 1, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0xD946EF), LV_PART_ITEMS | LV_STATE_CHECKED);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0x05030A), LV_PART_ITEMS | LV_STATE_CHECKED);
    lv_buttonmatrix_set_selected_button(obj10, 1);

    lv_obj_t * obj11 = lv_obj_create(parent);
    lv_obj_set_pos(obj11, 416, 122);
    lv_obj_set_size(obj11, 181, 88);
    lv_obj_set_style_bg_color(obj11, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj11, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj11, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj11, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj11, 8, LV_PART_MAIN);

    static lv_point_precise_t obj12_pts[] = {
      {0, 0},
      {225, 50}
    };
    lv_obj_t * obj12 = lv_line_create(parent);
    lv_line_set_points(obj12, obj12_pts, 2);
    lv_obj_set_pos(obj12, 715, 9);
    lv_obj_set_style_line_color(obj12, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_line_width(obj12, 3, LV_PART_MAIN);

    lv_obj_t * obj13 = lv_tabview_create(parent);
    lv_obj_set_pos(obj13, 755, 64);
    lv_obj_set_size(obj13, 240, 120);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj13, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj13, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj13, 2, LV_PART_MAIN);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_t * obj13_tab1 = lv_tabview_add_tab(obj13, "Tab 1");
    lv_obj_t * obj13_tab2 = lv_tabview_add_tab(obj13, "Tab 2");
    lv_obj_t * obj13_tab3 = lv_tabview_add_tab(obj13, "Tab 3");
    lv_obj_set_style_bg_color(obj13_tab1, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj13_tab2, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj13_tab3, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_t * obj13_lbl1 = lv_label_create(obj13_tab1);
    lv_label_set_text(obj13_lbl1, "Tab 1 content");
    lv_obj_set_style_text_color(obj13_lbl1, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj13_lbl1);
    lv_obj_t * obj13_lbl2 = lv_label_create(obj13_tab2);
    lv_label_set_text(obj13_lbl2, "Tab 2 content");
    lv_obj_set_style_text_color(obj13_lbl2, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj13_lbl2);
    lv_obj_t * obj13_lbl3 = lv_label_create(obj13_tab3);
    lv_label_set_text(obj13_lbl3, "Tab 3 content");
    lv_obj_set_style_text_color(obj13_lbl3, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj13_lbl3);

    lv_obj_t * obj14 = lv_tileview_create(parent);
    lv_obj_set_pos(obj14, 784, 201);
    lv_obj_set_size(obj14, 240, 120);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj14, 2, LV_PART_MAIN);
    lv_obj_t * obj14_tile1 = lv_tileview_add_tile(obj14, 0, 0, LV_DIR_ALL);
    lv_obj_t * obj14_tile2 = lv_tileview_add_tile(obj14, 1, 0, LV_DIR_ALL);
    lv_obj_t * obj14_tile3 = lv_tileview_add_tile(obj14, 0, 1, LV_DIR_ALL);
    lv_obj_t * obj14_tile4 = lv_tileview_add_tile(obj14, 1, 1, LV_DIR_ALL);
    lv_obj_set_style_bg_color(obj14_tile1, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj14_tile1, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_clear_flag(obj14_tile1, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_bg_color(obj14_tile2, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj14_tile2, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_clear_flag(obj14_tile2, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_bg_color(obj14_tile3, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj14_tile3, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_clear_flag(obj14_tile3, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_bg_color(obj14_tile4, lv_color_hex(0x1E1035), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj14_tile4, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_clear_flag(obj14_tile4, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_t * obj14_lbl1 = lv_label_create(obj14_tile1);
    lv_label_set_text(obj14_lbl1, "Tile 1");
    lv_obj_set_style_text_color(obj14_lbl1, lv_color_hex(0x05030A), LV_PART_MAIN);
    lv_obj_center(obj14_lbl1);
    lv_obj_t * obj14_lbl2 = lv_label_create(obj14_tile2);
    lv_label_set_text(obj14_lbl2, "Tile 2");
    lv_obj_set_style_text_color(obj14_lbl2, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj14_lbl2);
    lv_obj_t * obj14_lbl3 = lv_label_create(obj14_tile3);
    lv_label_set_text(obj14_lbl3, "Tile 3");
    lv_obj_set_style_text_color(obj14_lbl3, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj14_lbl3);
    lv_obj_t * obj14_lbl4 = lv_label_create(obj14_tile4);
    lv_label_set_text(obj14_lbl4, "Tile 4");
    lv_obj_set_style_text_color(obj14_lbl4, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_center(obj14_lbl4);

    lv_obj_t * obj15 = lv_button_create(parent);
    lv_obj_set_pos(obj15, 784, 335);
    lv_obj_set_size(obj15, 240, 120);
    lv_obj_set_style_radius(obj15, 12, 0);
    lv_obj_set_style_bg_color(obj15, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj15, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj15, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj15, 2, 0);
    lv_obj_t * obj15_label = lv_label_create(obj15);
    lv_label_set_text(obj15_label, "Button text");
    lv_obj_set_style_text_color(obj15_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj15_label);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "Text value");
    lv_obj_set_pos(obj16, 608, 132);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_24, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "Heading title");
    lv_obj_set_pos(obj17, 493, 213);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_32, 0);

    lv_obj_t * obj18 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj18, true);
    lv_textarea_set_placeholder_text(obj18, "Input");
    lv_obj_set_pos(obj18, 232, 288);
    lv_obj_set_size(obj18, 170, 74);
    lv_obj_set_style_bg_color(obj18, lv_color_hex(0x120824), 0);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj18, lv_color_hex(0xD946EF), 0);

    lv_obj_t * obj19 = lv_textarea_create(parent);
    lv_textarea_set_placeholder_text(obj19, "Textarea");
    lv_obj_set_pos(obj19, 209, 362);
    lv_obj_set_size(obj19, 158, 57);
    lv_obj_set_style_bg_color(obj19, lv_color_hex(0x120824), 0);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj19, lv_color_hex(0xD946EF), 0);

    lv_obj_t * obj20 = lv_switch_create(parent);
    lv_obj_set_pos(obj20, 0, 508);
    lv_obj_set_size(obj20, 159, 74);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0xD946EF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0xFFFFFF), LV_PART_KNOB);

    lv_obj_t * obj21 = lv_bar_create(parent);
    lv_obj_set_pos(obj21, 243, 447);
    lv_obj_set_size(obj21, 216, 84);
    lv_bar_set_range(obj21, 0, 100);
    lv_bar_set_value(obj21, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0xD946EF), LV_PART_INDICATOR);

    lv_obj_t * obj22 = lv_arc_create(parent);
    lv_obj_set_pos(obj22, 411, 331);
    lv_obj_set_size(obj22, 240, 120);
    lv_arc_set_range(obj22, 0, 100);
    lv_arc_set_value(obj22, 60);
    lv_obj_set_style_arc_color(obj22, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj22, lv_color_hex(0xD946EF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj22, lv_color_hex(0x05030A), LV_PART_KNOB);

    lv_obj_t * obj23 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj23, true);
    lv_textarea_set_text(obj23, "123");
    lv_obj_set_pos(obj23, 246, 497);
    lv_obj_set_size(obj23, 200, 99);
    lv_obj_set_style_bg_color(obj23, lv_color_hex(0x120824), 0);
    lv_obj_set_style_text_color(obj23, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj23, lv_color_hex(0xD946EF), 0);

    lv_obj_t * obj24 = lv_dropdown_create(parent);
    lv_dropdown_set_options(obj24, "Option 1\nOption 2\nOption 3");
    lv_obj_set_pos(obj24, 486, 453);
    lv_obj_set_size(obj24, 240, 120);
    lv_obj_set_style_bg_color(obj24, lv_color_hex(0x120824), 0);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj24, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj24, 2, 0);

    lv_obj_t * obj25 = lv_button_create(parent);
    lv_obj_set_style_radius(obj25, 12, 0);
    lv_obj_set_style_bg_color(obj25, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj25, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj25, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj25, 2, 0);
    lv_obj_t * obj25_label = lv_label_create(obj25);
    lv_label_set_text(obj25_label, "fg_icon_brightness_48px.png\nPending LVGL Export");
    lv_obj_set_style_text_color(obj25_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_align(obj25_label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(obj25_label);
    lv_obj_set_pos(obj25, 821, 501);
    lv_obj_set_size(obj25, 203, 95);
    lv_obj_add_flag(obj25, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj25, 101, 0);
    lv_obj_set_style_transform_pivot_y(obj25, 47, 0);
    lv_obj_set_style_transform_scale(obj25, 256, 0);
    lv_obj_set_style_transform_scale(obj25, 235, LV_STATE_PRESSED);

    lv_obj_t * obj26 = lv_obj_create(parent);
    lv_obj_set_pos(obj26, 650, 333);
    lv_obj_set_size(obj26, 136, 85);
    lv_obj_set_style_radius(obj26, 12, 0);
    lv_obj_set_style_bg_color(obj26, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj26, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj26, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj26, 2, 0);

    lv_obj_t * obj27 = lv_button_create(parent);
    lv_obj_set_pos(obj27, 712, 452);
    lv_obj_set_size(obj27, 145, 63);
    lv_obj_set_style_radius(obj27, 12, 0);
    lv_obj_set_style_bg_color(obj27, lv_color_hex(0x120824), 0);
    lv_obj_set_style_border_color(obj27, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj27, 2, 0);
    lv_obj_t * obj27_label = lv_label_create(obj27);
    lv_label_set_text(obj27_label, LV_SYMBOL_OK);
    lv_obj_center(obj27_label);

}