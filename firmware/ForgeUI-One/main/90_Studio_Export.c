#include "90_Studio_Export.h"
#include "lvgl.h"

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    lv_obj_t * obj1 = lv_label_create(parent);
    lv_label_set_text(obj1, "esp32p4-ui-studio");
    lv_obj_set_pos(obj1, 397, 158);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_24, 0);

}