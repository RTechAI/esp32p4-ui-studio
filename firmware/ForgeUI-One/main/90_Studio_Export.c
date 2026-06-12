#include "90_Studio_Export.h"
#include "lvgl.h"

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Carbon Graphite
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_theme_carbon_fiber);
    lv_obj_t * bg_texture = lv_image_create(parent);
    lv_image_set_src(bg_texture, &fg_theme_carbon_fiber);
    lv_obj_set_pos(bg_texture, 0, 0);

    lv_obj_t * obj1 = lv_slider_create(parent);
    lv_obj_set_pos(obj1, 126, 24);
    lv_obj_set_size(obj1, 178, 103);
    lv_slider_set_value(obj1, 50, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0xF2A900), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0xF5F5F5), LV_PART_KNOB);

}