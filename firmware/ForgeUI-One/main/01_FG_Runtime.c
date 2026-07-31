// ============================================================
// ForgeUI Studio Firmware Runtime
// ============================================================

#include "01_FG_Runtime.h"

#include "lvgl.h"
#include "90_Studio_Export.h"
#include "05_FG_RAM_Probe.h"
#include "esp_log.h"

#include <stdio.h>

void fg_runtime_init(void)
{
    ESP_LOGI("FG_BOOT", "BOOT 05 LVGL runtime begin");
    lv_obj_t *scr = lv_screen_active();

    if (!scr) {
        ESP_LOGE("FG_BOOT", "BOOT FAIL no active LVGL screen");
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

    ESP_LOGI("FG_BOOT", "BOOT 06 export begin");
    fg_ram_probe_log("01 before fg_studio_export_create");
    fg_studio_export_create(scr);
    ESP_LOGI("FG_BOOT", "BOOT 19 export end");
}
