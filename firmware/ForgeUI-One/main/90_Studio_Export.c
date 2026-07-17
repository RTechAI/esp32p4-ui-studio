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
    lv_obj_set_pos(obj2, 32, 18);
    lv_obj_set_style_text_color(obj2, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj2, &lv_font_montserrat_32, 0);

    LV_IMAGE_DECLARE(fg_upload_fiwifi_28x28_12b97eb6);
    lv_obj_t * obj3 = lv_image_create(parent);
    lv_image_set_src(obj3, &fg_upload_fiwifi_28x28_12b97eb6);
    lv_image_set_scale(obj3, 256);
    lv_obj_set_pos(obj3, 848, 20);
    lv_obj_set_size(obj3, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_fibattery_28x28_41e8bbfe);
    lv_obj_t * obj4 = lv_image_create(parent);
    lv_image_set_src(obj4, &fg_upload_fibattery_28x28_41e8bbfe);
    lv_image_set_scale(obj4, 256);
    lv_obj_set_pos(obj4, 890, 20);
    lv_obj_set_size(obj4, 28, 28);

    LV_IMAGE_DECLARE(fg_upload_ficlock_28x28_707f6e9b);
    lv_obj_t * obj5 = lv_image_create(parent);
    lv_image_set_src(obj5, &fg_upload_ficlock_28x28_707f6e9b);
    lv_image_set_scale(obj5, 256);
    lv_obj_set_pos(obj5, 932, 20);
    lv_obj_set_size(obj5, 28, 28);

    lv_obj_t * obj6 = lv_obj_create(parent);
    lv_obj_set_pos(obj6, 23.999984741210938, 84);
    lv_obj_set_size(obj6, 300, 120);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Production Summary 1");
    lv_obj_set_pos(obj7, 40, 96);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_24, 0);

    lv_obj_t * obj8 = lv_label_create(parent);
    lv_label_set_text(obj8, "1,248");
    lv_obj_set_pos(obj8, 40, 126);
    lv_obj_set_style_text_color(obj8, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj8, &lv_font_montserrat_32, 0);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Units Produced");
    lv_obj_set_pos(obj9, 40, 170);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_obj_create(parent);
    lv_obj_set_pos(obj10, 349.00001525878906, 84);
    lv_obj_set_size(obj10, 299, 121);
    lv_obj_set_style_radius(obj10, 12, 0);
    lv_obj_set_style_bg_color(obj10, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj10, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj10, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj10, 2, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Production Summary 2");
    lv_obj_set_pos(obj11, 364, 96);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "96.4%");
    lv_obj_set_pos(obj12, 364, 126);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_32, 0);

    lv_obj_t * obj13 = lv_label_create(parent);
    lv_label_set_text(obj13, "Line Efficiency");
    lv_obj_set_pos(obj13, 364, 170);
    lv_obj_set_style_text_color(obj13, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj13, &lv_font_montserrat_24, 0);

    lv_obj_t * obj14 = lv_obj_create(parent);
    lv_obj_set_pos(obj14, 672.0000152587891, 84);
    lv_obj_set_size(obj14, 300, 122);
    lv_obj_set_style_radius(obj14, 12, 0);
    lv_obj_set_style_bg_color(obj14, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj14, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj14, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj14, 2, 0);

    lv_obj_t * obj15 = lv_label_create(parent);
    lv_label_set_text(obj15, "Production Summary 3");
    lv_obj_set_pos(obj15, 688, 96);
    lv_obj_set_style_text_color(obj15, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj15, &lv_font_montserrat_24, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "08:42");
    lv_obj_set_pos(obj16, 688, 126);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_32, 0);

    lv_obj_t * obj17 = lv_label_create(parent);
    lv_label_set_text(obj17, "Next Maintenance");
    lv_obj_set_pos(obj17, 688, 170);
    lv_obj_set_style_text_color(obj17, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj17, &lv_font_montserrat_24, 0);

    lv_obj_t * obj18 = lv_chart_create(parent);
    lv_obj_set_pos(obj18, 24, 216);
    lv_obj_set_size(obj18, 612, 240);
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
    lv_obj_set_pos(obj19, 40, 228);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);

    lv_obj_t * obj20 = lv_obj_create(parent);
    lv_obj_set_pos(obj20, 656, 216);
    lv_obj_set_size(obj20, 344, 240);
    lv_obj_set_style_radius(obj20, 12, 0);
    lv_obj_set_style_bg_color(obj20, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj20, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj20, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj20, 2, 0);

    lv_obj_t * obj21 = lv_label_create(parent);
    lv_label_set_text(obj21, "Alerts");
    lv_obj_set_pos(obj21, 672, 228);
    lv_obj_set_style_text_color(obj21, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj21, &lv_font_montserrat_24, 0);

    lv_obj_t * obj22 = lv_led_create(parent);
    lv_obj_set_pos(obj22, 674, 266);
    lv_obj_set_size(obj22, 24, 24);
    lv_led_set_color(obj22, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj22, 255);
    lv_led_on(obj22);

    lv_obj_t * obj23 = lv_label_create(parent);
    lv_label_set_text(obj23, "Temperature sensor warning");
    lv_obj_set_pos(obj23, 700, 260);
    lv_obj_set_style_text_color(obj23, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj23, &lv_font_montserrat_24, 0);

    lv_obj_t * obj24 = lv_led_create(parent);
    lv_obj_set_pos(obj24, 674, 302);
    lv_obj_set_size(obj24, 24, 24);
    lv_led_set_color(obj24, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj24, 255);
    lv_led_on(obj24);

    lv_obj_t * obj25 = lv_label_create(parent);
    lv_label_set_text(obj25, "Conveyor speed deviation");
    lv_obj_set_pos(obj25, 700, 296);
    lv_obj_set_style_text_color(obj25, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj25, &lv_font_montserrat_24, 0);

    lv_obj_t * obj26 = lv_led_create(parent);
    lv_obj_set_pos(obj26, 674, 338);
    lv_obj_set_size(obj26, 24, 24);
    lv_led_set_color(obj26, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj26, 255);
    lv_led_on(obj26);

    lv_obj_t * obj27 = lv_label_create(parent);
    lv_label_set_text(obj27, "Routine inspection due");
    lv_obj_set_pos(obj27, 700, 332);
    lv_obj_set_style_text_color(obj27, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj27, &lv_font_montserrat_24, 0);

    lv_obj_t * obj28 = lv_button_create(parent);
    lv_obj_set_pos(obj28, 672, 382);
    lv_obj_set_size(obj28, 140, 44);
    lv_obj_set_style_radius(obj28, 12, 0);
    lv_obj_set_style_bg_color(obj28, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj28, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj28, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj28, 2, 0);
    lv_obj_t * obj28_label = lv_label_create(obj28);
    lv_label_set_text(obj28_label, "Acknowledge");
    lv_obj_set_style_text_color(obj28_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj28_label);

    lv_obj_t * obj29 = lv_button_create(parent);
    lv_obj_set_pos(obj29, 826, 382);
    lv_obj_set_size(obj29, 158, 44);
    lv_obj_set_style_radius(obj29, 12, 0);
    lv_obj_set_style_bg_color(obj29, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj29, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj29, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj29, 2, 0);
    lv_obj_t * obj29_label = lv_label_create(obj29);
    lv_label_set_text(obj29_label, "View Details");
    lv_obj_set_style_text_color(obj29_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj29_label);

    lv_obj_t * obj30 = lv_obj_create(parent);
    lv_obj_set_pos(obj30, 24, 472);
    lv_obj_set_size(obj30, 976, 104);
    lv_obj_set_style_radius(obj30, 12, 0);
    lv_obj_set_style_bg_color(obj30, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj30, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj30, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj30, 2, 0);

    lv_obj_t * obj31 = lv_label_create(parent);
    lv_label_set_text(obj31, "Controls");
    lv_obj_set_pos(obj31, 40, 484);
    lv_obj_set_style_text_color(obj31, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj31, &lv_font_montserrat_24, 0);

    lv_obj_t * obj32 = lv_button_create(parent);
    lv_obj_set_pos(obj32, 40, 520);
    lv_obj_set_size(obj32, 140, 42);
    lv_obj_set_style_radius(obj32, 12, 0);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj32, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj32, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj32, 2, 0);
    lv_obj_t * obj32_label = lv_label_create(obj32);
    lv_label_set_text(obj32_label, "Start Line");
    lv_obj_set_style_text_color(obj32_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj32_label);

    lv_obj_t * obj33 = lv_button_create(parent);
    lv_obj_set_pos(obj33, 194, 520);
    lv_obj_set_size(obj33, 140, 42);
    lv_obj_set_style_radius(obj33, 12, 0);
    lv_obj_set_style_bg_color(obj33, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj33, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj33, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj33, 2, 0);
    lv_obj_t * obj33_label = lv_label_create(obj33);
    lv_label_set_text(obj33_label, "Pause");
    lv_obj_set_style_text_color(obj33_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj33_label);

    lv_obj_t * obj34 = lv_button_create(parent);
    lv_obj_set_pos(obj34, 348, 520);
    lv_obj_set_size(obj34, 160, 42);
    lv_obj_set_style_radius(obj34, 12, 0);
    lv_obj_set_style_bg_color(obj34, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj34, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj34, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj34, 2, 0);
    lv_obj_t * obj34_label = lv_label_create(obj34);
    lv_label_set_text(obj34_label, "Reset Counter");
    lv_obj_set_style_text_color(obj34_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj34_label);

    lv_obj_t * obj35 = lv_button_create(parent);
    lv_obj_set_pos(obj35, 522, 520);
    lv_obj_set_size(obj35, 160, 42);
    lv_obj_set_style_radius(obj35, 12, 0);
    lv_obj_set_style_bg_color(obj35, lv_color_hex(0x1E2328), 0);
    lv_obj_set_style_bg_opa(obj35, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj35, lv_color_hex(0xF2A900), 0);
    lv_obj_set_style_border_width(obj35, 2, 0);
    lv_obj_t * obj35_label = lv_label_create(obj35);
    lv_label_set_text(obj35_label, "Emergency Stop");
    lv_obj_set_style_text_color(obj35_label, lv_color_hex(0xF5F5F5), 0);
    lv_obj_center(obj35_label);

    lv_obj_t * obj36 = lv_switch_create(parent);
    lv_obj_set_pos(obj36, 716, 520);
    lv_obj_set_size(obj36, 84, 42);
    lv_obj_set_style_bg_color(obj36, lv_color_hex(0x1E2328), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj36, lv_color_hex(0xF2A900), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj36, lv_color_hex(0xF5F5F5), LV_PART_KNOB);

    lv_obj_t * obj37 = lv_label_create(parent);
    lv_label_set_text(obj37, "Auto Mode");
    lv_obj_set_pos(obj37, 814, 527);
    lv_obj_set_style_text_color(obj37, lv_color_hex(0xF5F5F5), 0);
    lv_obj_set_style_text_font(obj37, &lv_font_montserrat_24, 0);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}