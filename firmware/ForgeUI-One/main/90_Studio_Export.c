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
    // Background flavour: Military Plate
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x1B2416), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x1B2416), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784024650200_db121532);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784024650200_db121532);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_obj_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 1024, 600);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "Industrial Dashboard");
    lv_obj_set_pos(obj2, 30, 20);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_32, 0);

    LV_IMAGE_DECLARE(fg_upload_fiwifi_0304f4da);
    lv_obj_t * obj3 = lv_image_create(parent);
    lv_image_set_src(obj3, &fg_upload_fiwifi_0304f4da);
    lv_image_set_scale(obj3, 256);
    lv_obj_set_pos(obj3, 850, 24);
    lv_obj_set_size(obj3, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_fibattery_6aa479a4);
    lv_obj_t * obj4 = lv_image_create(parent);
    lv_image_set_src(obj4, &fg_upload_fibattery_6aa479a4);
    lv_image_set_scale(obj4, 256);
    lv_obj_set_pos(obj4, 888, 24);
    lv_obj_set_size(obj4, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_ficlock_86e2b378);
    lv_obj_t * obj5 = lv_image_create(parent);
    lv_image_set_src(obj5, &fg_upload_ficlock_86e2b378);
    lv_image_set_scale(obj5, 256);
    lv_obj_set_pos(obj5, 926, 24);
    lv_obj_set_size(obj5, 28, 28);

    lv_obj_t * obj6 = lv_obj_create(parent);
    lv_obj_set_pos(obj6, 30, 92);
    lv_obj_set_size(obj6, 310, 110);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Units Produced");
    lv_obj_set_pos(obj7, 48, 104);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_24, 0);

    lv_obj_t * obj8 = lv_label_create(parent);
    lv_label_set_text(obj8, "12,480");
    lv_obj_set_pos(obj8, 48, 130);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj8, &lv_font_montserrat_32, 0);

    lv_obj_t * obj9 = lv_bar_create(parent);
    lv_obj_set_pos(obj9, 48, 176);
    lv_obj_set_size(obj9, 260, 16);
    lv_bar_set_range(obj9, 0, 100);
    lv_bar_set_value(obj9, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x2D3A25), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj9, lv_color_hex(0x84CC16), LV_PART_INDICATOR);

    lv_obj_t * obj10 = lv_obj_create(parent);
    lv_obj_set_pos(obj10, 357, 92);
    lv_obj_set_size(obj10, 310, 110);
    lv_obj_set_style_radius(obj10, 12, 0);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj10, 2, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Throughput");
    lv_obj_set_pos(obj11, 375, 104);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "98.6%");
    lv_obj_set_pos(obj12, 375, 130);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_32, 0);

    lv_obj_t * obj13 = lv_bar_create(parent);
    lv_obj_set_pos(obj13, 375, 176);
    lv_obj_set_size(obj13, 260, 16);
    lv_bar_set_range(obj13, 0, 100);
    lv_bar_set_value(obj13, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x2D3A25), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x84CC16), LV_PART_INDICATOR);

    lv_obj_t * obj14 = lv_obj_create(parent);
    lv_obj_set_pos(obj14, 684, 92);
    lv_obj_set_size(obj14, 310, 110);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "Machine Status");
    lv_obj_set_pos(obj15, 702, 104);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "ONLINE");
    lv_obj_set_pos(obj16, 702, 130);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_32, 0);

    lv_obj_t * obj17 = lv_led_create(parent);
    lv_obj_set_pos(obj17, 876, 136);
    lv_obj_set_size(obj17, 24, 24);
    lv_led_set_color(obj17, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj17, 255);
    lv_led_on(obj17);

    lv_obj_t * obj18 = lv_chart_create(parent);
    lv_obj_set_pos(obj18, 30, 226);
    lv_obj_set_size(obj18, 620, 250);
    lv_chart_set_type(obj18, LV_CHART_TYPE_LINE);
    lv_chart_set_point_count(obj18, 7);
    lv_chart_series_t * obj18_ser = lv_chart_add_series(obj18, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);
    lv_chart_set_next_value(obj18, obj18_ser, 10);
    lv_chart_set_next_value(obj18, obj18_ser, 30);
    lv_chart_set_next_value(obj18, obj18_ser, 20);
    lv_chart_set_next_value(obj18, obj18_ser, 50);
    lv_chart_set_next_value(obj18, obj18_ser, 40);
    lv_chart_set_next_value(obj18, obj18_ser, 70);
    lv_chart_set_next_value(obj18, obj18_ser, 60);
    lv_chart_refresh(obj18);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "Live Trend");
    lv_obj_set_pos(obj19, 48, 236);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);

    lv_obj_t * obj20 = lv_obj_create(parent);
    lv_obj_set_pos(obj20, 664, 226);
    lv_obj_set_size(obj20, 330, 250);
    lv_obj_set_style_radius(obj20, 12, 0);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj20, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj20, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj20, 2, 0);

    lv_obj_t * obj21 = lv_label_create(parent);
    lv_label_set_text(obj21, "Alerts");
    lv_obj_set_pos(obj21, 682, 236);
    lv_obj_set_style_text_color(obj21, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj21, &lv_font_montserrat_24, 0);

    lv_obj_t * obj22 = lv_obj_create(parent);
    lv_obj_set_size(obj22, 294, 176);
    lv_obj_set_pos(obj22, 682, 270);
    lv_obj_set_style_bg_color(obj22, lv_color_hex(0x2D3A25), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xF7FEE7), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj22, lv_color_hex(0x84CC16), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj22, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj22, 6, LV_PART_MAIN);
    lv_obj_clear_flag(obj22, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * obj22_title = lv_label_create(obj22);
    lv_label_set_text(obj22_title, "Message");
    lv_obj_align(obj22_title, LV_ALIGN_TOP_LEFT, 10, 8);
    lv_obj_t * obj22_text = lv_label_create(obj22);
    lv_label_set_text(obj22_text, "Example message text");
    lv_obj_set_width(obj22_text, 274);
    lv_label_set_long_mode(obj22_text, LV_LABEL_LONG_WRAP);
    lv_obj_align(obj22_text, LV_ALIGN_TOP_LEFT, 10, 30);
    lv_obj_t * obj22_ok = lv_button_create(obj22);
    lv_obj_set_size(obj22_ok, 56, 26);
    lv_obj_align(obj22_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);
    lv_obj_t * obj22_ok_lbl = lv_label_create(obj22_ok);
    lv_label_set_text(obj22_ok_lbl, "OK");
    lv_obj_center(obj22_ok_lbl);
    lv_obj_t * obj22_cancel = lv_button_create(obj22);
    lv_obj_set_size(obj22_cancel, 64, 26);
    lv_obj_align(obj22_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);
    lv_obj_t * obj22_cancel_lbl = lv_label_create(obj22_cancel);
    lv_label_set_text(obj22_cancel_lbl, "Cancel");
    lv_obj_center(obj22_cancel_lbl);

    lv_obj_t * obj23 = lv_obj_create(parent);
    lv_obj_set_pos(obj23, 30, 492);
    lv_obj_set_size(obj23, 964, 86);
    lv_obj_set_style_radius(obj23, 12, 0);
    lv_obj_set_style_bg_color(obj23, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj23, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj23, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj23, 2, 0);

    lv_obj_t * obj24 = lv_label_create(parent);
    lv_label_set_text(obj24, "Controls");
    lv_obj_set_pos(obj24, 48, 504);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj24, &lv_font_montserrat_24, 0);

    lv_obj_t * obj25 = lv_button_create(parent);
    lv_obj_set_pos(obj25, 48, 536);
    lv_obj_set_size(obj25, 150, 34);
    lv_obj_set_style_radius(obj25, 12, 0);
    lv_obj_set_style_bg_color(obj25, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj25, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj25, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj25, 2, 0);
    lv_obj_t * obj25_label = lv_label_create(obj25);
    lv_label_set_text(obj25_label, "Start Line");
    lv_obj_set_style_text_color(obj25_label, lv_color_hex(0xF7FEE7), 0);
    lv_obj_center(obj25_label);

    lv_obj_t * obj26 = lv_button_create(parent);
    lv_obj_set_pos(obj26, 212, 536);
    lv_obj_set_size(obj26, 150, 34);
    lv_obj_set_style_radius(obj26, 12, 0);
    lv_obj_set_style_bg_color(obj26, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj26, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj26, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj26, 2, 0);
    lv_obj_t * obj26_label = lv_label_create(obj26);
    lv_label_set_text(obj26_label, "Stop Line");
    lv_obj_set_style_text_color(obj26_label, lv_color_hex(0xF7FEE7), 0);
    lv_obj_center(obj26_label);

    lv_obj_t * obj27 = lv_button_create(parent);
    lv_obj_set_pos(obj27, 376, 536);
    lv_obj_set_size(obj27, 150, 34);
    lv_obj_set_style_radius(obj27, 12, 0);
    lv_obj_set_style_bg_color(obj27, lv_color_hex(0x2D3A25), 0);
    lv_obj_set_style_bg_opa(obj27, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj27, lv_color_hex(0x84CC16), 0);
    lv_obj_set_style_border_width(obj27, 2, 0);
    lv_obj_t * obj27_label = lv_label_create(obj27);
    lv_label_set_text(obj27_label, "Reset Alarms");
    lv_obj_set_style_text_color(obj27_label, lv_color_hex(0xF7FEE7), 0);
    lv_obj_center(obj27_label);

    lv_obj_t * obj28 = lv_switch_create(parent);
    lv_obj_set_pos(obj28, 708, 538);
    lv_obj_set_size(obj28, 84, 30);
    lv_obj_set_style_bg_color(obj28, lv_color_hex(0x2D3A25), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj28, lv_color_hex(0x84CC16), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj28, lv_color_hex(0xF7FEE7), LV_PART_KNOB);

    lv_obj_t * obj29 = lv_label_create(parent);
    lv_label_set_text(obj29, "Auto Mode");
    lv_obj_set_pos(obj29, 802, 540);
    lv_obj_set_style_text_color(obj29, lv_color_hex(0xF7FEE7), 0);
    lv_obj_set_style_text_font(obj29, &lv_font_montserrat_24, 0);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}