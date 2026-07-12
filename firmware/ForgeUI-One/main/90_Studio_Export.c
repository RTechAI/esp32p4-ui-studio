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

    lv_obj_t * obj1 = lv_obj_create(parent);
    lv_obj_set_pos(obj1, 0, 0);
    lv_obj_set_size(obj1, 1024, 600);
    lv_obj_set_style_radius(obj1, 12, 0);
    lv_obj_set_style_bg_color(obj1, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj1, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj1, 2, 0);

    lv_obj_t * obj2 = lv_obj_create(parent);
    lv_obj_set_pos(obj2, 16, 12);
    lv_obj_set_size(obj2, 992, 52);
    lv_obj_set_style_radius(obj2, 12, 0);
    lv_obj_set_style_bg_color(obj2, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj2, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj2, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj2, 2, 0);

    lv_obj_t * obj3 = lv_label_create(parent);
    lv_label_set_text(obj3, "Reactor ID: NRX-7A");
    lv_obj_set_pos(obj3, 28, 23);
    lv_obj_set_style_text_color(obj3, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj3, &lv_font_montserrat_32, 0);

    lv_obj_t * obj4 = lv_label_create(parent);
    lv_label_set_text(obj4, "Current Power Output: 892 MW");
    lv_obj_set_pos(obj4, 310, 22);
    lv_obj_set_style_text_color(obj4, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj4, &lv_font_montserrat_24, 0);

    lv_obj_t * obj5 = lv_label_create(parent);
    lv_label_set_text(obj5, "Date/Time: 2026-07-12 14:32");
    lv_obj_set_pos(obj5, 760, 22);
    lv_obj_set_style_text_color(obj5, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj5, &lv_font_montserrat_24, 0);

    lv_obj_t * obj6 = lv_obj_create(parent);
    lv_obj_set_pos(obj6, 16, 74);
    lv_obj_set_size(obj6, 380, 248);
    lv_obj_set_style_radius(obj6, 12, 0);
    lv_obj_set_style_bg_color(obj6, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj6, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj6, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj6, 2, 0);

    lv_obj_t * obj7 = lv_label_create(parent);
    lv_label_set_text(obj7, "Reactor Core Status");
    lv_obj_set_pos(obj7, 30, 86);
    lv_obj_set_style_text_color(obj7, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj7, &lv_font_montserrat_32, 0);

    lv_obj_t * obj8 = lv_arc_create(parent);
    lv_obj_set_pos(obj8, 34, 126);
    lv_obj_set_size(obj8, 150, 150);
    lv_arc_set_range(obj8, 0, 100);
    lv_arc_set_value(obj8, 60);
    lv_obj_set_style_arc_color(obj8, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj8, lv_color_hex(0xD946EF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj8, lv_color_hex(0x05030A), LV_PART_KNOB);

    lv_obj_t * obj9 = lv_label_create(parent);
    lv_label_set_text(obj9, "Core Status: STABLE");
    lv_obj_set_pos(obj9, 200, 126);
    lv_obj_set_style_text_color(obj9, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj9, &lv_font_montserrat_24, 0);

    lv_obj_t * obj10 = lv_label_create(parent);
    lv_label_set_text(obj10, "Reactivity: NOMINAL");
    lv_obj_set_pos(obj10, 200, 156);
    lv_obj_set_style_text_color(obj10, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj10, &lv_font_montserrat_24, 0);

    lv_obj_t * obj11 = lv_label_create(parent);
    lv_label_set_text(obj11, "Control Rods: INSERTED");
    lv_obj_set_pos(obj11, 200, 186);
    lv_obj_set_style_text_color(obj11, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj11, &lv_font_montserrat_24, 0);

    lv_obj_t * obj12 = lv_label_create(parent);
    lv_label_set_text(obj12, "Containment: SEALED");
    lv_obj_set_pos(obj12, 200, 216);
    lv_obj_set_style_text_color(obj12, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj12, &lv_font_montserrat_24, 0);

    lv_obj_t * obj13 = lv_bar_create(parent);
    lv_obj_set_pos(obj13, 200, 252);
    lv_obj_set_size(obj13, 160, 18);
    lv_bar_set_range(obj13, 0, 100);
    lv_bar_set_value(obj13, 60, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_color(obj13, lv_color_hex(0xD946EF), LV_PART_INDICATOR);

    lv_obj_t * obj14 = lv_label_create(parent);
    lv_label_set_text(obj14, "Core Load: 78%");
    lv_obj_set_pos(obj14, 200, 274);
    lv_obj_set_style_text_color(obj14, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj14, &lv_font_montserrat_24, 0);

    lv_obj_t * obj15 = lv_obj_create(parent);
    lv_obj_set_pos(obj15, 408, 74);
    lv_obj_set_size(obj15, 248, 248);
    lv_obj_set_style_radius(obj15, 12, 0);
    lv_obj_set_style_bg_color(obj15, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj15, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj15, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj15, 2, 0);

    lv_obj_t * obj16 = lv_label_create(parent);
    lv_label_set_text(obj16, "Reactor Power");
    lv_obj_set_pos(obj16, 424, 86);
    lv_obj_set_style_text_color(obj16, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj16, &lv_font_montserrat_32, 0);

    lv_obj_t * obj17 = lv_arc_create(parent);
    lv_obj_set_pos(obj17, 430, 124);
    lv_obj_set_size(obj17, 150, 150);
    lv_arc_set_range(obj17, 0, 100);
    lv_arc_set_value(obj17, 60);
    lv_obj_set_style_arc_color(obj17, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_arc_color(obj17, lv_color_hex(0xD946EF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(obj17, lv_color_hex(0x05030A), LV_PART_KNOB);

    lv_obj_t * obj18 = lv_label_create(parent);
    lv_label_set_text(obj18, "0%");
    lv_obj_set_pos(obj18, 596, 128);
    lv_obj_set_style_text_color(obj18, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj18, &lv_font_montserrat_24, 0);

    lv_obj_t * obj19 = lv_label_create(parent);
    lv_label_set_text(obj19, "50%");
    lv_obj_set_pos(obj19, 596, 176);
    lv_obj_set_style_text_color(obj19, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj19, &lv_font_montserrat_24, 0);

    lv_obj_t * obj20 = lv_label_create(parent);
    lv_label_set_text(obj20, "100%");
    lv_obj_set_pos(obj20, 596, 226);
    lv_obj_set_style_text_color(obj20, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj20, &lv_font_montserrat_24, 0);

    lv_obj_t * obj21 = lv_obj_create(parent);
    lv_obj_set_pos(obj21, 668, 74);
    lv_obj_set_size(obj21, 340, 248);
    lv_obj_set_style_radius(obj21, 12, 0);
    lv_obj_set_style_bg_color(obj21, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj21, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj21, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj21, 2, 0);

    lv_obj_t * obj22 = lv_label_create(parent);
    lv_label_set_text(obj22, "System Meters");
    lv_obj_set_pos(obj22, 684, 86);
    lv_obj_set_style_text_color(obj22, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj22, &lv_font_montserrat_32, 0);

    lv_obj_t * obj23 = lv_label_create(parent);
    lv_label_set_text(obj23, "Core Temperature");
    lv_obj_set_pos(obj23, 686, 128);
    lv_obj_set_style_text_color(obj23, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj23, &lv_font_montserrat_24, 0);

    lv_obj_t * obj24 = lv_arc_create(parent);
    lv_obj_set_pos(obj24, 682, 154);
    lv_obj_set_size(obj24, 98, 98);
    lv_arc_set_range(obj24, 0, 100);
    lv_arc_set_value(obj24, 65);

    lv_obj_t * obj25 = lv_label_create(parent);
    lv_label_set_text(obj25, "615°C");
    lv_obj_set_pos(obj25, 700, 188);
    lv_obj_set_style_text_color(obj25, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj25, &lv_font_montserrat_24, 0);

    lv_obj_t * obj26 = lv_label_create(parent);
    lv_label_set_text(obj26, "Coolant Pressure");
    lv_obj_set_pos(obj26, 800, 128);
    lv_obj_set_style_text_color(obj26, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj26, &lv_font_montserrat_24, 0);

    lv_obj_t * obj27 = lv_arc_create(parent);
    lv_obj_set_pos(obj27, 796, 154);
    lv_obj_set_size(obj27, 98, 98);
    lv_arc_set_range(obj27, 0, 100);
    lv_arc_set_value(obj27, 65);

    lv_obj_t * obj28 = lv_label_create(parent);
    lv_label_set_text(obj28, "15.8 MPa");
    lv_obj_set_pos(obj28, 812, 188);
    lv_obj_set_style_text_color(obj28, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj28, &lv_font_montserrat_24, 0);

    lv_obj_t * obj29 = lv_label_create(parent);
    lv_label_set_text(obj29, "Turbine RPM");
    lv_obj_set_pos(obj29, 912, 128);
    lv_obj_set_style_text_color(obj29, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj29, &lv_font_montserrat_24, 0);

    lv_obj_t * obj30 = lv_arc_create(parent);
    lv_obj_set_pos(obj30, 900, 154);
    lv_obj_set_size(obj30, 98, 98);
    lv_arc_set_range(obj30, 0, 100);
    lv_arc_set_value(obj30, 65);

    lv_obj_t * obj31 = lv_label_create(parent);
    lv_label_set_text(obj31, "3120 RPM");
    lv_obj_set_pos(obj31, 914, 188);
    lv_obj_set_style_text_color(obj31, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj31, &lv_font_montserrat_24, 0);

    lv_obj_t * obj32 = lv_obj_create(parent);
    lv_obj_set_pos(obj32, 16, 334);
    lv_obj_set_size(obj32, 248, 164);
    lv_obj_set_style_radius(obj32, 12, 0);
    lv_obj_set_style_bg_color(obj32, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj32, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj32, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj32, 2, 0);

    lv_obj_t * obj33 = lv_label_create(parent);
    lv_label_set_text(obj33, "Radiation Warning");
    lv_obj_set_pos(obj33, 30, 346);
    lv_obj_set_style_text_color(obj33, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj33, &lv_font_montserrat_32, 0);

    lv_obj_t * obj34 = lv_obj_create(parent);
    lv_obj_set_size(obj34, 210, 84);
    lv_obj_set_pos(obj34, 28, 380);
    lv_obj_set_style_bg_color(obj34, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_text_color(obj34, lv_color_hex(0xFFFFFF), LV_PART_MAIN);
    lv_obj_set_style_border_color(obj34, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj34, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj34, 6, LV_PART_MAIN);
    lv_obj_clear_flag(obj34, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * obj34_title = lv_label_create(obj34);
    lv_label_set_text(obj34_title, "Message");
    lv_obj_align(obj34_title, LV_ALIGN_TOP_LEFT, 10, 8);
    lv_obj_t * obj34_text = lv_label_create(obj34);
    lv_label_set_text(obj34_text, "Example message text");
    lv_obj_set_width(obj34_text, 190);
    lv_label_set_long_mode(obj34_text, LV_LABEL_LONG_WRAP);
    lv_obj_align(obj34_text, LV_ALIGN_TOP_LEFT, 10, 30);
    lv_obj_t * obj34_ok = lv_button_create(obj34);
    lv_obj_set_size(obj34_ok, 56, 26);
    lv_obj_align(obj34_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);
    lv_obj_t * obj34_ok_lbl = lv_label_create(obj34_ok);
    lv_label_set_text(obj34_ok_lbl, "OK");
    lv_obj_center(obj34_ok_lbl);
    lv_obj_t * obj34_cancel = lv_button_create(obj34);
    lv_obj_set_size(obj34_cancel, 64, 26);
    lv_obj_align(obj34_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);
    lv_obj_t * obj34_cancel_lbl = lv_label_create(obj34_cancel);
    lv_label_set_text(obj34_cancel_lbl, "Cancel");
    lv_obj_center(obj34_cancel_lbl);

    lv_obj_t * obj35 = lv_label_create(parent);
    lv_label_set_text(obj35, "Alert Level: LOW");
    lv_obj_set_pos(obj35, 46, 392);
    lv_obj_set_style_text_color(obj35, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj35, &lv_font_montserrat_24, 0);

    lv_obj_t * obj36 = lv_label_create(parent);
    lv_label_set_text(obj36, "Shielding: ACTIVE");
    lv_obj_set_pos(obj36, 46, 418);
    lv_obj_set_style_text_color(obj36, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj36, &lv_font_montserrat_24, 0);

    lv_obj_t * obj37 = lv_label_create(parent);
    lv_label_set_text(obj37, "Area Dose: 0.8 mSv/h");
    lv_obj_set_pos(obj37, 46, 444);
    lv_obj_set_style_text_color(obj37, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj37, &lv_font_montserrat_24, 0);

    lv_obj_t * obj38 = lv_obj_create(parent);
    lv_obj_set_pos(obj38, 276, 334);
    lv_obj_set_size(obj38, 238, 164);
    lv_obj_set_style_radius(obj38, 12, 0);
    lv_obj_set_style_bg_color(obj38, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj38, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj38, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj38, 2, 0);

    lv_obj_t * obj39 = lv_label_create(parent);
    lv_label_set_text(obj39, "Coolant Pumps");
    lv_obj_set_pos(obj39, 290, 346);
    lv_obj_set_style_text_color(obj39, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj39, &lv_font_montserrat_32, 0);

    lv_obj_t * obj40 = lv_led_create(parent);
    lv_obj_set_pos(obj40, 302, 386);
    lv_obj_set_size(obj40, 18, 18);
    lv_led_set_color(obj40, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj40, 255);
    lv_led_on(obj40);

    lv_obj_t * obj41 = lv_label_create(parent);
    lv_label_set_text(obj41, "Pump A: RUN");
    lv_obj_set_pos(obj41, 328, 382);
    lv_obj_set_style_text_color(obj41, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj41, &lv_font_montserrat_24, 0);

    lv_obj_t * obj42 = lv_led_create(parent);
    lv_obj_set_pos(obj42, 302, 416);
    lv_obj_set_size(obj42, 18, 18);
    lv_led_set_color(obj42, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj42, 255);
    lv_led_on(obj42);

    lv_obj_t * obj43 = lv_label_create(parent);
    lv_label_set_text(obj43, "Pump B: RUN");
    lv_obj_set_pos(obj43, 328, 412);
    lv_obj_set_style_text_color(obj43, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj43, &lv_font_montserrat_24, 0);

    lv_obj_t * obj44 = lv_led_create(parent);
    lv_obj_set_pos(obj44, 302, 446);
    lv_obj_set_size(obj44, 18, 18);
    lv_led_set_color(obj44, lv_palette_main(LV_PALETTE_GREEN));
    lv_led_set_brightness(obj44, 255);
    lv_led_on(obj44);

    lv_obj_t * obj45 = lv_label_create(parent);
    lv_label_set_text(obj45, "Pump C: STANDBY");
    lv_obj_set_pos(obj45, 328, 442);
    lv_obj_set_style_text_color(obj45, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj45, &lv_font_montserrat_24, 0);

    lv_obj_t * obj46 = lv_obj_create(parent);
    lv_obj_set_pos(obj46, 526, 334);
    lv_obj_set_size(obj46, 254, 164);
    lv_obj_set_style_radius(obj46, 12, 0);
    lv_obj_set_style_bg_color(obj46, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj46, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj46, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj46, 2, 0);

    lv_obj_t * obj47 = lv_label_create(parent);
    lv_label_set_text(obj47, "Emergency Shutdown");
    lv_obj_set_pos(obj47, 540, 346);
    lv_obj_set_style_text_color(obj47, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj47, &lv_font_montserrat_32, 0);

    lv_obj_t * obj48 = lv_button_create(parent);
    lv_obj_set_pos(obj48, 542, 384);
    lv_obj_set_size(obj48, 104, 34);
    lv_obj_set_style_radius(obj48, 12, 0);
    lv_obj_set_style_bg_color(obj48, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj48, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj48, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj48, 2, 0);
    lv_obj_t * obj48_label = lv_label_create(obj48);
    lv_label_set_text(obj48_label, "SCRAM 1");
    lv_obj_set_style_text_color(obj48_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj48_label);

    lv_obj_t * obj49 = lv_button_create(parent);
    lv_obj_set_pos(obj49, 656, 384);
    lv_obj_set_size(obj49, 104, 34);
    lv_obj_set_style_radius(obj49, 12, 0);
    lv_obj_set_style_bg_color(obj49, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj49, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj49, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj49, 2, 0);
    lv_obj_t * obj49_label = lv_label_create(obj49);
    lv_label_set_text(obj49_label, "SCRAM 2");
    lv_obj_set_style_text_color(obj49_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj49_label);

    lv_obj_t * obj50 = lv_button_create(parent);
    lv_obj_set_pos(obj50, 542, 428);
    lv_obj_set_size(obj50, 104, 34);
    lv_obj_set_style_radius(obj50, 12, 0);
    lv_obj_set_style_bg_color(obj50, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj50, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj50, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj50, 2, 0);
    lv_obj_t * obj50_label = lv_label_create(obj50);
    lv_label_set_text(obj50_label, "SCRAM 3");
    lv_obj_set_style_text_color(obj50_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj50_label);

    lv_obj_t * obj51 = lv_button_create(parent);
    lv_obj_set_pos(obj51, 656, 428);
    lv_obj_set_size(obj51, 104, 34);
    lv_obj_set_style_radius(obj51, 12, 0);
    lv_obj_set_style_bg_color(obj51, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj51, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj51, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj51, 2, 0);
    lv_obj_t * obj51_label = lv_label_create(obj51);
    lv_label_set_text(obj51_label, "SCRAM 4");
    lv_obj_set_style_text_color(obj51_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj51_label);

    lv_obj_t * obj52 = lv_obj_create(parent);
    lv_obj_set_pos(obj52, 790, 334);
    lv_obj_set_size(obj52, 218, 164);
    lv_obj_set_style_radius(obj52, 12, 0);
    lv_obj_set_style_bg_color(obj52, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj52, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj52, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj52, 2, 0);

    lv_obj_t * obj53 = lv_label_create(parent);
    lv_label_set_text(obj53, "Reactor Schematic");
    lv_obj_set_pos(obj53, 804, 346);
    lv_obj_set_style_text_color(obj53, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj53, &lv_font_montserrat_32, 0);

    lv_obj_t * obj54 = lv_obj_create(parent);
    lv_obj_set_pos(obj54, 804, 380);
    lv_obj_set_size(obj54, 190, 104);
    lv_obj_set_style_bg_color(obj54, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj54, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_border_color(obj54, lv_color_hex(0xD946EF), LV_PART_MAIN);
    lv_obj_set_style_border_width(obj54, 2, LV_PART_MAIN);
    lv_obj_set_style_radius(obj54, 8, LV_PART_MAIN);

    lv_obj_t * obj55 = lv_label_create(parent);
    lv_label_set_text(obj55, "Active schematic placeholder");
    lv_obj_set_pos(obj55, 828, 420);
    lv_obj_set_style_text_color(obj55, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj55, &lv_font_montserrat_24, 0);

    lv_obj_t * obj56 = lv_obj_create(parent);
    lv_obj_set_pos(obj56, 16, 508);
    lv_obj_set_size(obj56, 672, 76);
    lv_obj_set_style_radius(obj56, 12, 0);
    lv_obj_set_style_bg_color(obj56, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj56, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj56, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj56, 2, 0);

    lv_obj_t * obj57 = lv_label_create(parent);
    lv_label_set_text(obj57, "Alarm / Event Log");
    lv_obj_set_pos(obj57, 30, 518);
    lv_obj_set_style_text_color(obj57, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj57, &lv_font_montserrat_32, 0);

    lv_obj_t * obj58 = lv_table_create(parent);
    lv_obj_set_pos(obj58, 28, 544);
    lv_obj_set_size(obj58, 640, 30);
    lv_table_set_cell_value(obj58, 0, 0, "A1");
    lv_table_set_cell_value(obj58, 0, 1, "B1");
    lv_table_set_cell_value(obj58, 1, 0, "A2");
    lv_table_set_cell_value(obj58, 1, 1, "B2");
    lv_obj_set_style_bg_color(obj58, lv_color_hex(0x120824), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj58, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_text_color(obj58, lv_color_hex(0xFFFFFF), LV_PART_ITEMS);
    lv_obj_set_style_border_color(obj58, lv_color_hex(0xD946EF), LV_PART_ITEMS);
    lv_obj_set_style_border_width(obj58, 1, LV_PART_ITEMS);
    lv_obj_set_style_bg_color(obj58, lv_color_hex(0x1E1035), LV_PART_ITEMS);
    lv_obj_set_style_bg_opa(obj58, LV_OPA_COVER, LV_PART_ITEMS);

    lv_obj_t * obj59 = lv_obj_create(parent);
    lv_obj_set_pos(obj59, 700, 508);
    lv_obj_set_size(obj59, 308, 76);
    lv_obj_set_style_radius(obj59, 12, 0);
    lv_obj_set_style_bg_color(obj59, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj59, LV_OPA_80, 0);
    lv_obj_set_style_border_color(obj59, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj59, 2, 0);

    lv_obj_t * obj60 = lv_label_create(parent);
    lv_label_set_text(obj60, "Navigation");
    lv_obj_set_pos(obj60, 716, 518);
    lv_obj_set_style_text_color(obj60, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_text_font(obj60, &lv_font_montserrat_32, 0);

    lv_obj_t * obj61 = lv_button_create(parent);
    lv_obj_set_pos(obj61, 716, 544);
    lv_obj_set_size(obj61, 68, 28);
    lv_obj_set_style_radius(obj61, 12, 0);
    lv_obj_set_style_bg_color(obj61, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj61, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj61, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj61, 2, 0);
    lv_obj_t * obj61_label = lv_label_create(obj61);
    lv_label_set_text(obj61_label, "Overview");
    lv_obj_set_style_text_color(obj61_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj61_label);

    lv_obj_t * obj62 = lv_button_create(parent);
    lv_obj_set_pos(obj62, 790, 544);
    lv_obj_set_size(obj62, 52, 28);
    lv_obj_set_style_radius(obj62, 12, 0);
    lv_obj_set_style_bg_color(obj62, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj62, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj62, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj62, 2, 0);
    lv_obj_t * obj62_label = lv_label_create(obj62);
    lv_label_set_text(obj62_label, "Reactor");
    lv_obj_set_style_text_color(obj62_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj62_label);

    lv_obj_t * obj63 = lv_button_create(parent);
    lv_obj_set_pos(obj63, 848, 544);
    lv_obj_set_size(obj63, 52, 28);
    lv_obj_set_style_radius(obj63, 12, 0);
    lv_obj_set_style_bg_color(obj63, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj63, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj63, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj63, 2, 0);
    lv_obj_t * obj63_label = lv_label_create(obj63);
    lv_label_set_text(obj63_label, "Cooling");
    lv_obj_set_style_text_color(obj63_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj63_label);

    lv_obj_t * obj64 = lv_button_create(parent);
    lv_obj_set_pos(obj64, 906, 544);
    lv_obj_set_size(obj64, 52, 28);
    lv_obj_set_style_radius(obj64, 12, 0);
    lv_obj_set_style_bg_color(obj64, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj64, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj64, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj64, 2, 0);
    lv_obj_t * obj64_label = lv_label_create(obj64);
    lv_label_set_text(obj64_label, "Turbine");
    lv_obj_set_style_text_color(obj64_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj64_label);

    lv_obj_t * obj65 = lv_button_create(parent);
    lv_obj_set_pos(obj65, 716, 578);
    lv_obj_set_size(obj65, 52, 18);
    lv_obj_set_style_radius(obj65, 12, 0);
    lv_obj_set_style_bg_color(obj65, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj65, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj65, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj65, 2, 0);
    lv_obj_t * obj65_label = lv_label_create(obj65);
    lv_label_set_text(obj65_label, "Safety");
    lv_obj_set_style_text_color(obj65_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj65_label);

    lv_obj_t * obj66 = lv_button_create(parent);
    lv_obj_set_pos(obj66, 774, 578);
    lv_obj_set_size(obj66, 76, 18);
    lv_obj_set_style_radius(obj66, 12, 0);
    lv_obj_set_style_bg_color(obj66, lv_color_hex(0x120824), 0);
    lv_obj_set_style_bg_opa(obj66, LV_OPA_COVER, 0);
    lv_obj_set_style_border_color(obj66, lv_color_hex(0xD946EF), 0);
    lv_obj_set_style_border_width(obj66, 2, 0);
    lv_obj_t * obj66_label = lv_label_create(obj66);
    lv_label_set_text(obj66_label, "Diagnostics");
    lv_obj_set_style_text_color(obj66_label, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(obj66_label);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}