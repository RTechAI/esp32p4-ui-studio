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
    // Background flavour: Neon Horizon
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x0B1020), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x0B1020), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784024653132_b800e885);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784024653132_b800e885);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_obj_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 1024, 600);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "Industrial Dashboard");
    lv_obj_set_pos(obj2, 32, 18);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_32, 0);

    LV_IMAGE_DECLARE(fg_upload_fiwifi_0304f4da);
    lv_obj_t * obj3 = lv_image_create(parent);
    lv_image_set_src(obj3, &fg_upload_fiwifi_0304f4da);
    lv_image_set_scale(obj3, 256);
    lv_obj_set_pos(obj3, 860, 20);
    lv_obj_set_size(obj3, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_fibattery_6aa479a4);
    lv_obj_t * obj4 = lv_image_create(parent);
    lv_image_set_src(obj4, &fg_upload_fibattery_6aa479a4);
    lv_image_set_scale(obj4, 256);
    lv_obj_set_pos(obj4, 900, 20);
    lv_obj_set_size(obj4, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_ficlock_86e2b378);
    lv_obj_t * obj5 = lv_image_create(parent);
    lv_image_set_src(obj5, &fg_upload_ficlock_86e2b378);
    lv_image_set_scale(obj5, 256);
    lv_obj_set_pos(obj5, 940, 20);
    lv_obj_set_size(obj5, 28, 28);

    lv_obj_t * obj6 = lv_obj_create(parent);
    lv_obj_set_pos(obj6, 24, 80);
    lv_obj_set_size(obj6, 310, 104);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Units Today");
    lv_obj_set_pos(obj7, 44, 92);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_24, 0);

    lv_obj_t * obj8 = lv_label_create(parent);
    lv_label_set_text(obj8, "12,480");
    lv_obj_set_pos(obj8, 44, 120);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj8, &lv_font_montserrat_32, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "+6.2% vs yesterday");
    lv_obj_set_pos(obj9, 44, 160);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_obj_create(parent);
    lv_obj_set_pos(obj10, 352, 80);
    lv_obj_set_size(obj10, 310, 104);
    lv_obj_set_style_radius(obj10, 12, 0);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj10, 2, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Uptime");
    lv_obj_set_pos(obj11, 372, 92);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "99.4%");
    lv_obj_set_pos(obj12, 372, 120);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_32, 0);

    lv_obj_t * obj13 = lv_label_create(parent);
    lv_label_set_text(obj13, "Stable across all lines");
    lv_obj_set_pos(obj13, 372, 160);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj13, &lv_font_montserrat_24, 0);

    lv_obj_t * obj14 = lv_obj_create(parent);
    lv_obj_set_pos(obj14, 680, 80);
    lv_obj_set_size(obj14, 310, 104);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "Active Machines");
    lv_obj_set_pos(obj15, 700, 92);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "28");
    lv_obj_set_pos(obj16, 700, 120);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_32, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "2 in maintenance");
    lv_obj_set_pos(obj17, 700, 160);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_obj_create(parent);
    lv_obj_set_pos(obj18, 24, 202);
    lv_obj_set_size(obj18, 628, 236);
    lv_obj_set_style_radius(obj18, 12, 0);
    lv_obj_set_style_bg_color(obj18, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj18, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj18, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj18, 2, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "Live Trend");
    lv_obj_set_pos(obj19, 44, 214);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_32, 0);

    lv_obj_t * obj20 = lv_chart_create(parent);
    lv_obj_set_pos(obj20, 44, 250);
    lv_obj_set_size(obj20, 588, 170);
    lv_chart_set_type(obj20, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(obj20, 7);
    lv_chart_series_t * obj20_ser = lv_chart_add_series(obj20, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);
    lv_chart_set_next_value(obj20, obj20_ser, 10);
    lv_chart_set_next_value(obj20, obj20_ser, 30);
    lv_chart_set_next_value(obj20, obj20_ser, 20);
    lv_chart_set_next_value(obj20, obj20_ser, 50);
    lv_chart_set_next_value(obj20, obj20_ser, 40);
    lv_chart_set_next_value(obj20, obj20_ser, 70);
    lv_chart_set_next_value(obj20, obj20_ser, 60);
    lv_chart_refresh(obj20);

    lv_obj_t * obj21 = lv_obj_create(parent);
    lv_obj_set_pos(obj21, 668, 202);
    lv_obj_set_size(obj21, 332, 236);
    lv_obj_set_style_radius(obj21, 12, 0);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj21, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj21, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj21, 2, 0);

    lv_obj_t * obj22 = lv_label_create(parent);
    lv_label_set_text(obj22, "Alerts");
    lv_obj_set_pos(obj22, 688, 214);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj22, &lv_font_montserrat_32, 0);

    lv_obj_t * obj23 = lv_led_create(parent);
    lv_obj_set_pos(obj23, 690, 256);
    lv_obj_set_size(obj23, 16, 16);
    lv_led_set_color(obj23, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj23, 255);
    lv_led_on(obj23);

    lv_obj_t * obj24 = lv_label_create(parent);
    lv_label_set_text(obj24, "Line 3 temperature rising");
    lv_obj_set_pos(obj24, 716, 250);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj24, &lv_font_montserrat_24, 0);

    lv_obj_t * obj25 = lv_led_create(parent);
    lv_obj_set_pos(obj25, 690, 294);
    lv_obj_set_size(obj25, 16, 16);
    lv_led_set_color(obj25, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj25, 255);
    lv_led_on(obj25);

    lv_obj_t * obj26 = lv_label_create(parent);
    lv_label_set_text(obj26, "Packager vibration above threshold");
    lv_obj_set_pos(obj26, 716, 288);
    lv_obj_set_style_text_color(obj26, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj26, &lv_font_montserrat_24, 0);

    lv_obj_t * obj27 = lv_led_create(parent);
    lv_obj_set_pos(obj27, 690, 332);
    lv_obj_set_size(obj27, 16, 16);
    lv_led_set_color(obj27, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj27, 255);
    lv_led_on(obj27);

    lv_obj_t * obj28 = lv_label_create(parent);
    lv_label_set_text(obj28, "Scheduled filter replacement due");
    lv_obj_set_pos(obj28, 716, 326);
    lv_obj_set_style_text_color(obj28, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj28, &lv_font_montserrat_24, 0);

    lv_obj_t * obj29 = lv_obj_create(parent);
    lv_obj_set_size(obj29, 284, 54);
    lv_obj_set_pos(obj29, 690, 366);
    lv_obj_set_style_bg_color(obj29, lv_color_hex(0x131A2E), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj29, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj29, lv_color_hex(0xFF4FD8), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj29, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj29, 6, LV_PART_MAIN);
    lv_obj_clear_flag(obj29, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * obj29_title = lv_label_create(obj29);
    lv_label_set_text(obj29_title, "Message");
    lv_obj_align(obj29_title, LV_ALIGN_TOP_LEFT, 10, 8);
    lv_obj_t * obj29_text = lv_label_create(obj29);
    lv_label_set_text(obj29_text, "Example message text");
    lv_obj_set_width(obj29_text, 264);
    lv_label_set_long_mode(obj29_text, LV_LABEL_LONG_WRAP);
    lv_obj_align(obj29_text, LV_ALIGN_TOP_LEFT, 10, 30);
    lv_obj_t * obj29_ok = lv_button_create(obj29);
    lv_obj_set_size(obj29_ok, 56, 26);
    lv_obj_align(obj29_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);
    lv_obj_t * obj29_ok_lbl = lv_label_create(obj29_ok);
    lv_label_set_text(obj29_ok_lbl, "OK");
    lv_obj_center(obj29_ok_lbl);
    lv_obj_t * obj29_cancel = lv_button_create(obj29);
    lv_obj_set_size(obj29_cancel, 64, 26);
    lv_obj_align(obj29_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);
    lv_obj_t * obj29_cancel_lbl = lv_label_create(obj29_cancel);
    lv_label_set_text(obj29_cancel_lbl, "Cancel");
    lv_obj_center(obj29_cancel_lbl);

    lv_obj_t * obj30 = lv_obj_create(parent);
    lv_obj_set_pos(obj30, 24, 452);
    lv_obj_set_size(obj30, 628, 122);
    lv_obj_set_style_radius(obj30, 12, 0);
    lv_obj_set_style_bg_color(obj30, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj30, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj30, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj30, 2, 0);

    lv_obj_t * obj31 = lv_label_create(parent);
    lv_label_set_text(obj31, "Controls");
    lv_obj_set_pos(obj31, 44, 464);
    lv_obj_set_style_text_color(obj31, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj31, &lv_font_montserrat_32, 0);

    lv_obj_t * obj32 = lv_switch_create(parent);
    lv_obj_set_pos(obj32, 44, 506);
    lv_obj_set_size(obj32, 120, 44);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0x131A2E), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0xFF4FD8), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0xFFFFFF), LV_PART_KNOB);

    lv_obj_t * obj33 = lv_label_create(parent);
    lv_label_set_text(obj33, "Main Conveyor");
    lv_obj_set_pos(obj33, 178, 514);
    lv_obj_set_style_text_color(obj33, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj33, &lv_font_montserrat_24, 0);

    lv_obj_t * obj34 = lv_button_create(parent);
    lv_obj_set_pos(obj34, 372, 500);
    lv_obj_set_size(obj34, 118, 48);
    lv_obj_set_style_radius(obj34, 12, 0);
    lv_obj_set_style_bg_color(obj34, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj34, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj34, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj34, 2, 0);
    lv_obj_t * obj34_label = lv_label_create(obj34);
    lv_label_set_text(obj34_label, "Reset");
    lv_obj_set_style_text_color(obj34_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj34_label);

    lv_obj_t * obj35 = lv_button_create(parent);
    lv_obj_set_pos(obj35, 500, 500);
    lv_obj_set_size(obj35, 132, 48);
    lv_obj_set_style_radius(obj35, 12, 0);
    lv_obj_set_style_bg_color(obj35, lv_color_hex(0x131A2E), 0);
    lv_obj_set_style_bg_opa(obj35, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj35, lv_color_hex(0xFF4FD8), 0);
    lv_obj_set_style_border_width(obj35, 2, 0);
    lv_obj_t * obj35_label = lv_label_create(obj35);
    lv_label_set_text(obj35_label, "Maintenance");
    lv_obj_set_style_text_color(obj35_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj35_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}