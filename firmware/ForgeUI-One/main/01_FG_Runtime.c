// ============================================================
// ForgeUI Studio Firmware Runtime
// ============================================================

#include "01_FG_Runtime.h"

#include "lvgl.h"
#include "90_Studio_Export.h"

#include <stdio.h>

void fg_runtime_init(void)
{
    lv_obj_t *scr = lv_screen_active();

    if (!scr) {
        return;
    }

    lv_obj_clean(scr);
    lv_obj_clear_flag(scr, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_set_style_bg_color(scr, lv_color_hex(0x000000), 0);
    lv_obj_set_style_bg_opa(scr, LV_OPA_COVER, 0);

    lv_obj_update_layout(scr);

    printf(
        "ForgeUI screen: %d x %d\n",
        (int)lv_obj_get_width(scr),
        (int)lv_obj_get_height(scr)
    );

    fg_studio_export_create(scr);
}