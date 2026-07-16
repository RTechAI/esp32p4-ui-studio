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
    // Background flavour: Industrial Carbon
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x121417), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784242902864_1e00aa31);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784242902864_1e00aa31);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    lv_obj_t * obj1 = lv_obj_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 1024, 600);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);

    lv_obj_t * obj2 = lv_label_create(parent);
    lv_label_set_text(obj2, "Industrial Dashboard");
    lv_obj_set_pos(obj2, 28, 18);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_32, 0);

    LV_IMAGE_DECLARE(fg_upload_fiwifi_28x28_12b97eb6);
    lv_obj_t * obj3 = lv_image_create(parent);
    lv_image_set_src(obj3, &fg_upload_fiwifi_28x28_12b97eb6);
    lv_image_set_scale(obj3, 256);
    lv_obj_set_pos(obj3, 860, 20);
    lv_obj_set_size(obj3, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_fibattery_28x28_41e8bbfe);
    lv_obj_t * obj4 = lv_image_create(parent);
    lv_image_set_src(obj4, &fg_upload_fibattery_28x28_41e8bbfe);
    lv_image_set_scale(obj4, 256);
    lv_obj_set_pos(obj4, 902, 20);
    lv_obj_set_size(obj4, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_ficlock_28x28_707f6e9b);
    lv_obj_t * obj5 = lv_image_create(parent);
    lv_image_set_src(obj5, &fg_upload_ficlock_28x28_707f6e9b);
    lv_image_set_scale(obj5, 256);
    lv_obj_set_pos(obj5, 944, 20);
    lv_obj_set_size(obj5, 28, 28);

    lv_obj_t * obj6 = lv_obj_create(parent);
    lv_obj_set_pos(obj6, 24, 84);
    lv_obj_set_size(obj6, 300, 118);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Production A");
    lv_obj_set_pos(obj7, 40, 96);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_32, 0);

    lv_obj_t * obj8 = lv_label_create(parent);
    lv_label_set_text(obj8, "Units / hr");
    lv_obj_set_pos(obj8, 40, 132);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj8, &lv_font_montserrat_24, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "1,284");
    lv_obj_set_pos(obj9, 40, 154);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_32, 0);

    lv_obj_t * obj10 = lv_obj_create(parent);
    lv_obj_set_pos(obj10, 346, 84);
    lv_obj_set_size(obj10, 300, 118);
    lv_obj_set_style_radius(obj10, 12, 0);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj10, 2, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Production B");
    lv_obj_set_pos(obj11, 362, 96);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_32, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "Units / hr");
    lv_obj_set_pos(obj12, 362, 132);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_24, 0);

    lv_obj_t * obj13 = lv_label_create(parent);
    lv_label_set_text(obj13, "1,116");
    lv_obj_set_pos(obj13, 362, 154);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj13, &lv_font_montserrat_32, 0);

    lv_obj_t * obj14 = lv_obj_create(parent);
    lv_obj_set_pos(obj14, 668, 84);
    lv_obj_set_size(obj14, 332, 118);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "Production C");
    lv_obj_set_pos(obj15, 684, 96);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_32, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "Units / hr");
    lv_obj_set_pos(obj16, 684, 132);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_24, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "987");
    lv_obj_set_pos(obj17, 684, 154);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_32, 0);

    lv_obj_t * obj18 = lv_obj_create(parent);
    lv_obj_set_pos(obj18, 24, 224);
    lv_obj_set_size(obj18, 638, 250);
    lv_obj_set_style_radius(obj18, 12, 0);
    lv_obj_set_style_bg_color(obj18, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj18, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj18, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj18, 2, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "Live Trend");
    lv_obj_set_pos(obj19, 40, 236);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_32, 0);

    lv_obj_t * obj20 = lv_chart_create(parent);
    lv_obj_set_pos(obj20, 40, 270);
    lv_obj_set_size(obj20, 606, 188);
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
    lv_obj_set_pos(obj21, 682, 224);
    lv_obj_set_size(obj21, 318, 250);
    lv_obj_set_style_radius(obj21, 12, 0);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj21, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj21, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj21, 2, 0);

    lv_obj_t * obj22 = lv_label_create(parent);
    lv_label_set_text(obj22, "Alerts");
    lv_obj_set_pos(obj22, 698, 236);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj22, &lv_font_montserrat_32, 0);

    lv_obj_t * obj23 = lv_label_create(parent);
    lv_label_set_text(obj23, "High temperature on Line 2");
    lv_obj_set_pos(obj23, 698, 274);
    lv_obj_set_style_text_color(obj23, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj23, &lv_font_montserrat_24, 0);

    lv_obj_t * obj24 = lv_label_create(parent);
    lv_label_set_text(obj24, "Maintenance due in 3 hours");
    lv_obj_set_pos(obj24, 698, 310);
    lv_obj_set_style_text_color(obj24, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj24, &lv_font_montserrat_24, 0);

    lv_obj_t * obj25 = lv_label_create(parent);
    lv_label_set_text(obj25, "Quality drift detected");
    lv_obj_set_pos(obj25, 698, 346);
    lv_obj_set_style_text_color(obj25, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj25, &lv_font_montserrat_24, 0);

    lv_obj_t * obj26 = lv_label_create(parent);
    lv_label_set_text(obj26, "Sensor latency warning");
    lv_obj_set_pos(obj26, 698, 382);
    lv_obj_set_style_text_color(obj26, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj26, &lv_font_montserrat_24, 0);

    lv_obj_t * obj27 = lv_obj_create(parent);
    lv_obj_set_pos(obj27, 24, 492);
    lv_obj_set_size(obj27, 976, 90);
    lv_obj_set_style_radius(obj27, 12, 0);
    lv_obj_set_style_bg_color(obj27, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj27, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj27, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj27, 2, 0);

    lv_obj_t * obj28 = lv_label_create(parent);
    lv_label_set_text(obj28, "Controls");
    lv_obj_set_pos(obj28, 40, 504);
    lv_obj_set_style_text_color(obj28, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj28, &lv_font_montserrat_32, 0);

    lv_obj_t * obj29 = lv_button_create(parent);
    lv_obj_set_pos(obj29, 40, 536);
    lv_obj_set_size(obj29, 150, 36);
    lv_obj_set_style_radius(obj29, 12, 0);
    lv_obj_set_style_bg_color(obj29, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj29, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj29, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj29, 2, 0);
    lv_obj_t * obj29_label = lv_label_create(obj29);
    lv_label_set_text(obj29_label, "Start Line");
    lv_obj_set_style_text_color(obj29_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj29_label);

    lv_obj_t * obj30 = lv_button_create(parent);
    lv_obj_set_pos(obj30, 206, 536);
    lv_obj_set_size(obj30, 150, 36);
    lv_obj_set_style_radius(obj30, 12, 0);
    lv_obj_set_style_bg_color(obj30, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj30, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj30, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj30, 2, 0);
    lv_obj_t * obj30_label = lv_label_create(obj30);
    lv_label_set_text(obj30_label, "Pause Line");
    lv_obj_set_style_text_color(obj30_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj30_label);

    lv_obj_t * obj31 = lv_button_create(parent);
    lv_obj_set_pos(obj31, 372, 536);
    lv_obj_set_size(obj31, 150, 36);
    lv_obj_set_style_radius(obj31, 12, 0);
    lv_obj_set_style_bg_color(obj31, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj31, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj31, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj31, 2, 0);
    lv_obj_t * obj31_label = lv_label_create(obj31);
    lv_label_set_text(obj31_label, "Reset");
    lv_obj_set_style_text_color(obj31_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj31_label);

    lv_obj_t * obj32 = lv_button_create(parent);
    lv_obj_set_pos(obj32, 538, 536);
    lv_obj_set_size(obj32, 170, 36);
    lv_obj_set_style_radius(obj32, 12, 0);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj32, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj32, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj32, 2, 0);
    lv_obj_t * obj32_label = lv_label_create(obj32);
    lv_label_set_text(obj32_label, "Emergency Stop");
    lv_obj_set_style_text_color(obj32_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj32_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}