#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_toggle_off_1784854272909_84eab303);
LV_IMAGE_DECLARE(fg_upload_toggle_on_1784854272909_de3b60e3);
typedef struct { lv_obj_t * button; lv_obj_t * image; const void * off_src; const void * on_src; bool enabled; void (*toggled_cb)(bool); } fg_toggle_input_t;
static void fg_toggle_input_set(fg_toggle_input_t * toggle, bool enabled, bool notify)
{
    if (!toggle) return;
    toggle->enabled = enabled;
    if (toggle->image) lv_image_set_src(toggle->image, enabled ? toggle->on_src : toggle->off_src);
    if (notify && toggle->toggled_cb) toggle->toggled_cb(enabled);
}
static void fg_toggle_input_event_cb(lv_event_t * event)
{
    fg_toggle_input_t * toggle = (fg_toggle_input_t *)lv_event_get_user_data(event);
    if (toggle) fg_toggle_input_set(toggle, !toggle->enabled, true);
}

static fg_toggle_input_t fg_comp_MRY83G0VXI5EA_toggle = {
    .button = NULL, .image = NULL,
    .off_src = &fg_upload_toggle_off_1784854272909_84eab303, .on_src = &fg_upload_toggle_on_1784854272909_de3b60e3,
    .enabled = false, .toggled_cb = FG_On_StatusToggleSwitch_Toggled,
};

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

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    fg_comp_MRY83G0VXI5EA_toggle.button = lv_button_create(parent);
    lv_obj_remove_style_all(fg_comp_MRY83G0VXI5EA_toggle.button);
    lv_obj_set_pos(fg_comp_MRY83G0VXI5EA_toggle.button, 650, 44);
    lv_obj_set_size(fg_comp_MRY83G0VXI5EA_toggle.button, 300, 200);
    lv_obj_set_style_bg_opa(fg_comp_MRY83G0VXI5EA_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_opa(fg_comp_MRY83G0VXI5EA_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_outline_opa(fg_comp_MRY83G0VXI5EA_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_opa(fg_comp_MRY83G0VXI5EA_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_comp_MRY83G0VXI5EA_toggle.button, 0, LV_PART_MAIN);
    fg_comp_MRY83G0VXI5EA_toggle.image = lv_image_create(fg_comp_MRY83G0VXI5EA_toggle.button);
    lv_obj_remove_style_all(fg_comp_MRY83G0VXI5EA_toggle.image);
    lv_obj_set_style_bg_opa(fg_comp_MRY83G0VXI5EA_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_opa(fg_comp_MRY83G0VXI5EA_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_outline_opa(fg_comp_MRY83G0VXI5EA_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_opa(fg_comp_MRY83G0VXI5EA_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_comp_MRY83G0VXI5EA_toggle.image, 0, LV_PART_MAIN);
    lv_obj_clear_flag(fg_comp_MRY83G0VXI5EA_toggle.image, LV_OBJ_FLAG_CLICKABLE);
    lv_image_set_scale(fg_comp_MRY83G0VXI5EA_toggle.image, 120);
    lv_obj_center(fg_comp_MRY83G0VXI5EA_toggle.image);
    fg_toggle_input_set(&fg_comp_MRY83G0VXI5EA_toggle, false, false);
    lv_obj_add_event_cb(fg_comp_MRY83G0VXI5EA_toggle.button, fg_toggle_input_event_cb, LV_EVENT_CLICKED, &fg_comp_MRY83G0VXI5EA_toggle);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}