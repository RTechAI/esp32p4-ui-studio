#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
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

static void fg_wifi_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    if (!fg_wifi_label)
    {
        return;
    }

    fg_wifi_pump();

    char wifi_buf[128];
    snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\n%s\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());
    lv_label_set_text(fg_wifi_label, wifi_buf);
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

    lv_obj_t * obj1 = lv_led_create(parent);
    lv_obj_set_pos(obj1, 711, 38);
    lv_obj_set_size(obj1, 48, 48);
    lv_led_set_color(obj1, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj1, 255);
    lv_led_on(obj1);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, LV_SYMBOL_WIFI);
    lv_obj_set_pos(obj2, 56, 19);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_48, 0);

    lv_obj_t * obj3 = lv_label_create(parent);
    lv_label_set_text(obj3, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj3, 114, 438);
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_48, 0);

    lv_obj_t * obj4 = lv_label_create(parent);
    lv_label_set_text(obj4, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj4, 715, 439);
    lv_obj_set_style_text_color(obj4, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj4, &lv_font_montserrat_48, 0);

    lv_obj_t * obj5 = lv_label_create(parent);
    lv_label_set_text(obj5, LV_SYMBOL_SETTINGS);
    lv_obj_set_pos(obj5, 385, 20);
    lv_obj_set_style_text_color(obj5, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj5, &lv_font_montserrat_48, 0);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}