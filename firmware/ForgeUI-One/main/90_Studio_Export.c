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
    // Background flavour: Quantum Flow
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x07031A), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x07031A), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784193636968_16413f50);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784193636968_16413f50);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_led_create(parent);
    lv_obj_set_pos(obj1, 28, 44);
    lv_obj_set_size(obj1, 48, 48);
    lv_led_set_color(obj1, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj1, 255);
    lv_led_on(obj1);

    lv_obj_t * obj2 = lv_obj_create(parent);
    lv_obj_set_pos(obj2, 0, 0);
    lv_obj_set_size(obj2, 1024, 600);
    lv_obj_set_style_radius(obj2, 12, 0);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj2, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj2, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj2, 2, 0);

    lv_obj_t * obj3 = lv_label_create(parent);
    lv_label_set_text(obj3, "Industrial Dashboard");
    lv_obj_set_pos(obj3, 32, 18);
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_32, 0);

    LV_IMAGE_DECLARE(fg_upload_fiwifi_de8e53dd);
    lv_obj_t * obj4 = lv_image_create(parent);
    lv_image_set_src(obj4, &fg_upload_fiwifi_de8e53dd);
    lv_image_set_scale(obj4, 256);
    lv_obj_set_pos(obj4, 854, 20);
    lv_obj_set_size(obj4, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_fibattery_eaf8a4b7);
    lv_obj_t * obj5 = lv_image_create(parent);
    lv_image_set_src(obj5, &fg_upload_fibattery_eaf8a4b7);
    lv_image_set_scale(obj5, 256);
    lv_obj_set_pos(obj5, 900, 20);
    lv_obj_set_size(obj5, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_ficlock_c355ab93);
    lv_obj_t * obj6 = lv_image_create(parent);
    lv_image_set_src(obj6, &fg_upload_ficlock_c355ab93);
    lv_image_set_scale(obj6, 256);
    lv_obj_set_pos(obj6, 946, 20);
    lv_obj_set_size(obj6, 28, 28);

    lv_obj_t * obj7 = lv_obj_create(parent);
    lv_obj_set_pos(obj7, 32, 84);
    lv_obj_set_size(obj7, 960, 106);
    lv_obj_set_style_radius(obj7, 12, 0);
    lv_obj_set_style_bg_color(obj7, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj7, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj7, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj7, 2, 0);

    lv_obj_t * obj8 = lv_obj_create(parent);
    lv_obj_set_pos(obj8, 44, 96);
    lv_obj_set_size(obj8, 300, 82);
    lv_obj_set_style_radius(obj8, 12, 0);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj8, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj8, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj8, 2, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Output Today");
    lv_obj_set_pos(obj9, 64, 106);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_label_create(parent);
    lv_label_set_text(obj10, "12,480");
    lv_obj_set_pos(obj10, 64, 130);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj10, &lv_font_montserrat_32, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "units");
    lv_obj_set_pos(obj11, 236, 140);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_obj_create(parent);
    lv_obj_set_pos(obj12, 362, 96);
    lv_obj_set_size(obj12, 300, 82);
    lv_obj_set_style_radius(obj12, 12, 0);
    lv_obj_set_style_bg_color(obj12, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj12, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj12, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj12, 2, 0);

    lv_obj_t * obj13 = lv_label_create(parent);
    lv_label_set_text(obj13, "Efficiency");
    lv_obj_set_pos(obj13, 382, 106);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj13, &lv_font_montserrat_24, 0);

    lv_obj_t * obj14 = lv_label_create(parent);
    lv_label_set_text(obj14, "94.2%");
    lv_obj_set_pos(obj14, 382, 130);
    lv_obj_set_style_text_color(obj14, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj14, &lv_font_montserrat_32, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "OEE");
    lv_obj_set_pos(obj15, 546, 140);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_obj_create(parent);
    lv_obj_set_pos(obj16, 680, 96);
    lv_obj_set_size(obj16, 300, 82);
    lv_obj_set_style_radius(obj16, 12, 0);
    lv_obj_set_style_bg_color(obj16, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj16, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj16, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj16, 2, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "Runtime");
    lv_obj_set_pos(obj17, 700, 106);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_label_create(parent);
    lv_label_set_text(obj18, "08:46");
    lv_obj_set_pos(obj18, 700, 130);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj18, &lv_font_montserrat_32, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "active");
    lv_obj_set_pos(obj19, 860, 140);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);

    lv_obj_t * obj20 = lv_obj_create(parent);
    lv_obj_set_pos(obj20, 32, 206);
    lv_obj_set_size(obj20, 640, 362);
    lv_obj_set_style_radius(obj20, 12, 0);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj20, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj20, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj20, 2, 0);

    lv_obj_t * obj21 = lv_label_create(parent);
    lv_label_set_text(obj21, "Live Trend");
    lv_obj_set_pos(obj21, 52, 220);
    lv_obj_set_style_text_color(obj21, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj21, &lv_font_montserrat_32, 0);

    lv_obj_t * obj22 = lv_chart_create(parent);
    lv_obj_set_pos(obj22, 52, 264);
    lv_obj_set_size(obj22, 600, 286);
    lv_chart_set_type(obj22, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(obj22, 7);
    lv_chart_series_t * obj22_ser = lv_chart_add_series(obj22, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);
    lv_chart_set_next_value(obj22, obj22_ser, 10);
    lv_chart_set_next_value(obj22, obj22_ser, 30);
    lv_chart_set_next_value(obj22, obj22_ser, 20);
    lv_chart_set_next_value(obj22, obj22_ser, 50);
    lv_chart_set_next_value(obj22, obj22_ser, 40);
    lv_chart_set_next_value(obj22, obj22_ser, 70);
    lv_chart_set_next_value(obj22, obj22_ser, 60);
    lv_chart_refresh(obj22);

    lv_obj_t * obj23 = lv_obj_create(parent);
    lv_obj_set_pos(obj23, 690, 206);
    lv_obj_set_size(obj23, 302, 172);
    lv_obj_set_style_radius(obj23, 12, 0);
    lv_obj_set_style_bg_color(obj23, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj23, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj23, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj23, 2, 0);

    lv_obj_t * obj24 = lv_label_create(parent);
    lv_label_set_text(obj24, "Alerts");
    lv_obj_set_pos(obj24, 710, 220);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj24, &lv_font_montserrat_32, 0);

    lv_obj_t * obj25 = lv_obj_create(parent);
    lv_obj_set_size(obj25, 262, 104);
    lv_obj_set_pos(obj25, 708, 264);
    lv_obj_set_style_bg_color(obj25, lv_color_hex(0x120A2A), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj25, lv_color_hex(0xF8FAFC), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj25, lv_color_hex(0xA855F7), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj25, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj25, 6, LV_PART_MAIN);
    lv_obj_clear_flag(obj25, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * obj25_title = lv_label_create(obj25);
    lv_label_set_text(obj25_title, "Message");
    lv_obj_align(obj25_title, LV_ALIGN_TOP_LEFT, 10, 8);
    lv_obj_t * obj25_text = lv_label_create(obj25);
    lv_label_set_text(obj25_text, "Example message text");
    lv_obj_set_width(obj25_text, 242);
    lv_label_set_long_mode(obj25_text, LV_LABEL_LONG_WRAP);
    lv_obj_align(obj25_text, LV_ALIGN_TOP_LEFT, 10, 30);
    lv_obj_t * obj25_ok = lv_button_create(obj25);
    lv_obj_set_size(obj25_ok, 56, 26);
    lv_obj_align(obj25_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);
    lv_obj_t * obj25_ok_lbl = lv_label_create(obj25_ok);
    lv_label_set_text(obj25_ok_lbl, "OK");
    lv_obj_center(obj25_ok_lbl);
    lv_obj_t * obj25_cancel = lv_button_create(obj25);
    lv_obj_set_size(obj25_cancel, 64, 26);
    lv_obj_align(obj25_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);
    lv_obj_t * obj25_cancel_lbl = lv_label_create(obj25_cancel);
    lv_label_set_text(obj25_cancel_lbl, "Cancel");
    lv_obj_center(obj25_cancel_lbl);

    lv_obj_t * obj26 = lv_obj_create(parent);
    lv_obj_set_pos(obj26, 690, 390);
    lv_obj_set_size(obj26, 302, 178);
    lv_obj_set_style_radius(obj26, 12, 0);
    lv_obj_set_style_bg_color(obj26, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj26, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj26, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj26, 2, 0);

    lv_obj_t * obj27 = lv_label_create(parent);
    lv_label_set_text(obj27, "Controls");
    lv_obj_set_pos(obj27, 710, 404);
    lv_obj_set_style_text_color(obj27, lv_color_hex(0xF8FAFC), 0);
    lv_obj_set_style_text_font(obj27, &lv_font_montserrat_32, 0);

    lv_obj_t * obj28 = lv_button_create(parent);
    lv_obj_set_pos(obj28, 710, 450);
    lv_obj_set_size(obj28, 122, 46);
    lv_obj_set_style_radius(obj28, 12, 0);
    lv_obj_set_style_bg_color(obj28, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj28, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj28, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj28, 2, 0);
    lv_obj_t * obj28_label = lv_label_create(obj28);
    lv_label_set_text(obj28_label, "Start Line");
    lv_obj_set_style_text_color(obj28_label, lv_color_hex(0xF8FAFC), 0);
    lv_obj_center(obj28_label);

    lv_obj_t * obj29 = lv_button_create(parent);
    lv_obj_set_pos(obj29, 844, 450);
    lv_obj_set_size(obj29, 122, 46);
    lv_obj_set_style_radius(obj29, 12, 0);
    lv_obj_set_style_bg_color(obj29, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj29, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj29, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj29, 2, 0);
    lv_obj_t * obj29_label = lv_label_create(obj29);
    lv_label_set_text(obj29_label, "Pause");
    lv_obj_set_style_text_color(obj29_label, lv_color_hex(0xF8FAFC), 0);
    lv_obj_center(obj29_label);

    lv_obj_t * obj30 = lv_button_create(parent);
    lv_obj_set_pos(obj30, 710, 506);
    lv_obj_set_size(obj30, 122, 46);
    lv_obj_set_style_radius(obj30, 12, 0);
    lv_obj_set_style_bg_color(obj30, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj30, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj30, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj30, 2, 0);
    lv_obj_t * obj30_label = lv_label_create(obj30);
    lv_label_set_text(obj30_label, "Reset");
    lv_obj_set_style_text_color(obj30_label, lv_color_hex(0xF8FAFC), 0);
    lv_obj_center(obj30_label);

    lv_obj_t * obj31 = lv_button_create(parent);
    lv_obj_set_pos(obj31, 844, 506);
    lv_obj_set_size(obj31, 122, 46);
    lv_obj_set_style_radius(obj31, 12, 0);
    lv_obj_set_style_bg_color(obj31, lv_color_hex(0x120A2A), 0);
    lv_obj_set_style_bg_opa(obj31, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj31, lv_color_hex(0xA855F7), 0);
    lv_obj_set_style_border_width(obj31, 2, 0);
    lv_obj_t * obj31_label = lv_label_create(obj31);
    lv_label_set_text(obj31_label, "Maintenance");
    lv_obj_set_style_text_color(obj31_label, lv_color_hex(0xF8FAFC), 0);
    lv_obj_center(obj31_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}