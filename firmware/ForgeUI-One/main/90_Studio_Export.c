#include "90_Studio_Export.h"
#include "lvgl.h"

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    // Background flavour: Nordic Ice
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0xEAF4FA), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0xEAF4FA), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    lv_obj_t * obj1 = lv_slider_create(parent);
    lv_obj_set_pos(obj1, 70.99996948242188, 35);
    lv_obj_set_size(obj1, 370, 118);
    lv_slider_set_value(obj1, 50, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x7DD3FC), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x0F172A), LV_PART_KNOB);

    lv_obj_t * obj2 = lv_arc_create(parent);
    lv_obj_set_pos(obj2, 421, 441);
    lv_obj_set_size(obj2, 369, 134);
    lv_arc_set_range(obj2, 0, 100);
    lv_arc_set_value(obj2, 60);
    lv_obj_set_style_arc_color(obj2, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj2, lv_color_hex(0x7DD3FC), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0xEAF4FA), LV_PART_KNOB);

}