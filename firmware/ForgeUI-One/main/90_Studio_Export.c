#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include <stdbool.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

static void fg_clock_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    static bool show_colon = true;

    char time_buf[16];
    fg_rtc_format_time(time_buf, sizeof(time_buf));

    if (!show_colon)
    {
        time_buf[2] = ' ';
    }

    show_colon = !show_colon;

    if (fg_clock_label)
    {
        lv_label_set_text(fg_clock_label, time_buf);
    }
}

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

    fg_wifi_label = lv_label_create(parent);
    lv_label_set_text(fg_wifi_label, "WIFI\nDISCONNECTED\nIP: -");
    lv_obj_set_pos(fg_wifi_label, 39, 41);
    lv_obj_set_size(fg_wifi_label, 240, 120);
    lv_obj_set_style_text_color(fg_wifi_label, lv_color_hex(0x00D4FF), 0);
    lv_obj_set_style_text_font(fg_wifi_label, &lv_font_montserrat_20, 0);
    lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_WRAP);

    fg_clock_label = lv_label_create(parent);
    lv_label_set_text(fg_clock_label, "12:34");
    lv_obj_set_pos(fg_clock_label, 12.999969482421875, 540);
    lv_obj_set_size(fg_clock_label, 105, 54);
    lv_obj_set_style_text_color(fg_clock_label, lv_color_hex(0x00D4FF), 0);
    lv_obj_set_style_text_font(fg_clock_label, &lv_font_montserrat_32, 0);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);
}