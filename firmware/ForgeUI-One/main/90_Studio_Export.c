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

    LV_IMAGE_DECLARE(fg_upload_test1_261ea643);
    lv_obj_t * obj1 = lv_image_create(parent);
    lv_image_set_src(obj1, &fg_upload_test1_261ea643);
    lv_image_set_scale(obj1, 256);
    lv_obj_set_pos(obj1, 105, 15);
    lv_obj_set_size(obj1, 240, 120);
    lv_obj_add_flag(obj1, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj1, 120, 0);
    lv_obj_set_style_transform_pivot_y(obj1, 60, 0);
    lv_obj_set_style_transform_scale(obj1, 256, 0);
    lv_obj_set_style_transform_scale(obj1, 235, LV_STATE_PRESSED);

    LV_IMAGE_DECLARE(fg_upload_fg_icon_brightness_48px_e16b9a51);
    lv_obj_t * obj2 = lv_image_create(parent);
    lv_image_set_src(obj2, &fg_upload_fg_icon_brightness_48px_e16b9a51);
    lv_image_set_scale(obj2, 256);
    lv_obj_set_pos(obj2, 740, 426);
    lv_obj_set_size(obj2, 240, 120);
    lv_obj_add_flag(obj2, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_style_transform_pivot_x(obj2, 120, 0);
    lv_obj_set_style_transform_pivot_y(obj2, 60, 0);
    lv_obj_set_style_transform_scale(obj2, 256, 0);
    lv_obj_set_style_transform_scale(obj2, 235, LV_STATE_PRESSED);

}