#include "90_Studio_Export.h"
#include "lvgl.h"

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Quantum Flow
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x07031A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x07031A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_1024x600_quantum_flow_4ffa7dbc);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_1024x600_quantum_flow_4ffa7dbc);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);

    lv_obj_t * obj1 = lv_button_create(parent);
    lv_obj_set_pos(obj1, 0, 28);
    lv_obj_set_size(obj1, 169, 58);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);
    lv_obj_t * obj1_label = lv_label_create(obj1);
    lv_label_set_text(obj1_label, "Button text");
    lv_obj_set_style_text_color(obj1_label, lv_color_hex(0xF8FAFC), 0);
    lv_obj_center(obj1_label);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "High From RtechAI ");
    lv_obj_set_pos(obj2, 233, 25);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_24, 0);

    lv_obj_t * obj3 = lv_label_create(parent);
    lv_label_set_text(obj3, "Use the SPINE for best results");
    lv_obj_set_pos(obj3, 117, 505);
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_24, 0);

    lv_obj_t * obj4 = lv_switch_create(parent);
    lv_obj_set_pos(obj4, 784, 5);
    lv_obj_set_size(obj4, 205, 75);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0x120A2A), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0xA855F7), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0xF8FAFC), LV_PART_KNOB);

    lv_obj_t * obj5 = lv_arc_create(parent);
    lv_obj_set_pos(obj5, 859, 456);
    lv_obj_set_size(obj5, 165, 111);
    lv_arc_set_range(obj5, 0, 100);
    lv_arc_set_value(obj5, 60);
    lv_obj_set_style_arc_color(obj5, lv_color_hex(0x120A2A), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj5, lv_color_hex(0xA855F7), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x07031A), LV_PART_KNOB);

    lv_obj_t * obj6 = lv_dropdown_create(parent);
    lv_dropdown_set_options(obj6, "Option 1\nOption 2\nOption 3");
    lv_obj_set_pos(obj6, 0, 258.9999694824219);
    lv_obj_set_size(obj6, 210, 92);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_text_color(obj6, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_slider_create(parent);
    lv_obj_set_pos(obj7, 481, 95);
    lv_obj_set_size(obj7, 498, 44);
    lv_slider_set_value(obj7, 50, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x120A2A), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0xA855F7), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0xF8FAFC), LV_PART_KNOB);

    LV_IMAGE_DECLARE(fg_upload_fg_icon_brightness_48px_33f5f442);
    lv_obj_t * obj8 = lv_image_create(parent);
    lv_image_set_src(obj8, &fg_upload_fg_icon_brightness_48px_33f5f442);
    lv_image_set_scale(obj8, 256);
    lv_obj_set_pos(obj8, 512, 431);
    lv_obj_set_size(obj8, 240, 120);
    lv_obj_add_flag(obj8, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj8, 120, 0);
    lv_obj_set_style_transform_pivot_y(obj8, 60, 0);
    lv_obj_set_style_transform_scale(obj8, 256, 0);
    lv_obj_set_style_transform_scale(obj8, 235, LV_STATE_PRESSED);

    lv_obj_t * obj9 = lv_checkbox_create(parent);
    lv_checkbox_set_text(obj9, "Radio");
    lv_obj_set_pos(obj9, 478, 21);
    lv_obj_set_style_radius(obj9, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF8FAFC), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj9, lv_color_hex(0xA855F7), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x120A2A), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x22D3EE), LV_PART_INDICATOR | LV_STATE_CHECKED);

    lv_obj_t * obj10 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj10, true);
    lv_textarea_set_placeholder_text(obj10, "Input");
    lv_obj_set_pos(obj10, 99.99996948242188, 375);
    lv_obj_set_size(obj10, 174, 76);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xA855F7), 0);

}