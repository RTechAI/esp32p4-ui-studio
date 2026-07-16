#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include <stdbool.h>
#include <stdio.h>

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
    // Background flavour: OLED Black Pro
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x000000), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x000000), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_dark_noise_08fcab09);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_dark_noise_08fcab09);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_t * bg_texture_1 = lv_image_create(parent);
    lv_image_set_src(bg_texture_1, &fg_upload_dark_noise_08fcab09);
    lv_obj_set_pos(bg_texture_1, 512, 0);
    lv_obj_t * bg_texture_2 = lv_image_create(parent);
    lv_image_set_src(bg_texture_2, &fg_upload_dark_noise_08fcab09);
    lv_obj_set_pos(bg_texture_2, 0, 512);
    lv_obj_t * bg_texture_3 = lv_image_create(parent);
    lv_image_set_src(bg_texture_3, &fg_upload_dark_noise_08fcab09);
    lv_obj_set_pos(bg_texture_3, 512, 512);
    lv_obj_move_background(bg_texture_0);
    lv_obj_move_background(bg_texture_1);
    lv_obj_move_background(bg_texture_2);
    lv_obj_move_background(bg_texture_3);

    lv_obj_t * obj1 = lv_bar_create(parent);
    lv_obj_set_pos(obj1, 104, 66);
    lv_obj_set_size(obj1, 240, 120);
    lv_bar_set_range(obj1, 0, 100);
    lv_bar_set_value(obj1, 70, LV_ANIM_OFF);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}