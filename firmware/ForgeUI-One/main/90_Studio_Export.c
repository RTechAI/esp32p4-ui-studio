#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_ai_light_off_1784622942204_1784622973939_5812ab17);
LV_IMAGE_DECLARE(fg_upload_ai_light_on_1784622942204_1784623002094_a6681a57);
static lv_obj_t * fg_status_light_image = NULL;

void FG_Set_Status_Light(bool enabled)
{
    if (!fg_status_light_image)
    {
        return;
    }

    lv_image_set_src(
        fg_status_light_image,
        enabled
            ? &fg_upload_ai_light_on_1784622942204_1784623002094_a6681a57
            : &fg_upload_ai_light_off_1784622942204_1784622973939_5812ab17
    );
}

typedef struct
{
    const void * normal_src;
    const void * pressed_src;
    void (*clicked_cb)(void);
    const char * event_name;
} fg_interactive_button_data_t;

static void fg_interactive_button_event_cb(lv_event_t *event)
{
    lv_event_code_t code = lv_event_get_code(event);
    lv_obj_t * button = lv_event_get_target(event);

    fg_interactive_button_data_t * data =
        (fg_interactive_button_data_t *)lv_event_get_user_data(event);

    if (!button || !data)
    {
        return;
    }

    lv_obj_t * image = lv_obj_get_child(button, 0);

    if (!image)
    {
        return;
    }

    if (code == LV_EVENT_PRESSED)
    {
        lv_image_set_src(image, data->pressed_src);
    }
    else if (
        code == LV_EVENT_RELEASED ||
        code == LV_EVENT_PRESS_LOST
    )
    {
        lv_image_set_src(image, data->normal_src);
    }
    else if (code == LV_EVENT_CLICKED)
    {
        printf("[ForgeUI] %s clicked\n", data->event_name);

        if (data->clicked_cb)
        {
            data->clicked_cb();
        }
    }
}

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

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784534316385_6390cae0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784534316385_6390cae0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    fg_status_light_image = lv_image_create(parent);
    lv_image_set_src(fg_status_light_image, &fg_upload_ai_light_on_1784622942204_1784623002094_a6681a57);
    lv_obj_set_pos(fg_status_light_image, 408, 5);
    lv_obj_set_size(fg_status_light_image, 400, 300);
    lv_obj_clear_flag(fg_status_light_image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_image, LV_OBJ_FLAG_SCROLLABLE);

    LV_IMAGE_DECLARE(fg_upload_ai_button_normal_1784618978195_1784618998837_9a9d4c98);
    LV_IMAGE_DECLARE(fg_upload_ai_button_pressed_1784618978195_1784619035670_b407a0a0);
    lv_obj_t * obj2 = lv_button_create(parent);
    lv_obj_set_pos(obj2, 77, 14);
    lv_obj_set_size(obj2, 400, 300);
    lv_obj_set_style_radius(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_border_width(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj2, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(obj2, 0, LV_PART_MAIN);
    lv_obj_t * obj2_img = lv_image_create(obj2);
    lv_image_set_src(obj2_img, &fg_upload_ai_button_normal_1784618978195_1784618998837_9a9d4c98);
    lv_image_set_scale(obj2_img, 256);
    lv_obj_center(obj2_img);
    lv_obj_clear_flag(obj2_img, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(obj2, LV_OBJ_FLAG_SCROLLABLE);
    static fg_interactive_button_data_t obj2_data = {
        .normal_src = &fg_upload_ai_button_normal_1784618978195_1784618998837_9a9d4c98,
        .pressed_src = &fg_upload_ai_button_pressed_1784618978195_1784619035670_b407a0a0,
        .clicked_cb = FG_On_Button_Clicked,
        .event_name = "FG_On_Button_Clicked",
    };
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &obj2_data);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}