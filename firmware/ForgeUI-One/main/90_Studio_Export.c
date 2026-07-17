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
    // Background flavour: Singularity
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x05020A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x05020A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784248749145_bfe3d2c3);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784248749145_bfe3d2c3);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_label_create(parent);
    lv_label_set_text(obj1, "WiFi Setup");
    lv_obj_set_pos(obj1, 360, 90);
    lv_obj_set_style_text_color(obj1, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);

    lv_obj_t * obj2 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj2, true);
    lv_textarea_set_placeholder_text(obj2, "Input");
    lv_obj_set_pos(obj2, 360, 180);
    lv_obj_set_size(obj2, 320, 50);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj2, lv_color_hex(0xFF7A18), 0);

    lv_obj_t * obj3 = lv_textarea_create(parent);
    lv_textarea_set_one_line(obj3, true);
    lv_textarea_set_placeholder_text(obj3, "Input");
    lv_obj_set_pos(obj3, 360, 250);
    lv_obj_set_size(obj3, 320, 50);
    lv_obj_set_style_bg_color(obj3, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_border_color(obj3, lv_color_hex(0xFF7A18), 0);

    lv_obj_t * obj4 = lv_button_create(parent);
    lv_obj_set_pos(obj4, 360, 330);
    lv_obj_set_size(obj4, 140, 50);
    lv_obj_set_style_radius(obj4, 12, 0);
    lv_obj_set_style_bg_color(obj4, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj4, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj4, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj4, 2, 0);
    lv_obj_t * obj4_label = lv_label_create(obj4);
    lv_label_set_text(obj4_label, "Scan");
    lv_obj_set_style_text_color(obj4_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj4_label);

    lv_obj_t * obj5 = lv_button_create(parent);
    lv_obj_set_pos(obj5, 540, 330);
    lv_obj_set_size(obj5, 140, 50);
    lv_obj_set_style_radius(obj5, 12, 0);
    lv_obj_set_style_bg_color(obj5, lv_color_hex(0x140A1F), 0);
    lv_obj_set_style_bg_opa(obj5, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj5, lv_color_hex(0xFF7A18), 0);
    lv_obj_set_style_border_width(obj5, 2, 0);
    lv_obj_t * obj5_label = lv_label_create(obj5);
    lv_label_set_text(obj5_label, "Connect");
    lv_obj_set_style_text_color(obj5_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj5_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}