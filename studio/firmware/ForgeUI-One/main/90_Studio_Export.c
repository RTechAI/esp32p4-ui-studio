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

    lv_obj_t * obj1 = lv_button_create(parent);
    lv_obj_set_pos(obj1, 164, 47);
    lv_obj_set_size(obj1, 240, 120);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);
    lv_obj_t * obj1_label = lv_label_create(obj1);
    lv_label_set_text(obj1_label, "Button text");
    lv_obj_set_style_text_color(obj1_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj1_label);

    LV_IMAGE_DECLARE(fg_icon_about_48px);
    lv_obj_t * obj2 = lv_image_create(parent);
    lv_image_set_src(obj2, &fg_icon_about_48px);
    lv_obj_set_pos(obj2, 572, 151);
    lv_obj_set_size(obj2, 240, 120);

}