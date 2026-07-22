#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_ai_light_off_1784677420538_1784677443359_cd0a7737);
LV_IMAGE_DECLARE(fg_upload_ai_light_on_1784677420538_1784677467382_7cc4b1f8);
LV_IMAGE_DECLARE(fg_upload_ai_light_off_1784677508462_1784677530750_9b68369e);
LV_IMAGE_DECLARE(fg_upload_ai_light_on_1784677508462_1784677552965_a4060f3c);

typedef struct
{
    lv_obj_t * image;
    const void * off_src;
    const void * on_src;
    bool enabled;
} fg_binary_output_t;

static void fg_binary_output_set(
    fg_binary_output_t * output,
    bool enabled
)
{
    if (!output || !output->image)
    {
        return;
    }

    output->enabled = enabled;
    lv_image_set_src(
        output->image,
        enabled ? output->on_src : output->off_src
    );
}

static fg_binary_output_t fg_status_light_output = {
    .image = NULL,
    .off_src = &fg_upload_ai_light_off_1784677420538_1784677443359_cd0a7737,
    .on_src = &fg_upload_ai_light_on_1784677420538_1784677467382_7cc4b1f8,
    .enabled = true,
};

static fg_binary_output_t fg_status_light_2_output = {
    .image = NULL,
    .off_src = &fg_upload_ai_light_off_1784677508462_1784677530750_9b68369e,
    .on_src = &fg_upload_ai_light_on_1784677508462_1784677552965_a4060f3c,
    .enabled = true,
};

void FG_Set_Status_Light(bool enabled)
{
    fg_binary_output_set(&fg_status_light_output, enabled);
}

void FG_Set_Status_Light_2(bool enabled)
{
    fg_binary_output_set(&fg_status_light_2_output, enabled);
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

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784677195962_931ea33e);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784677195962_931ea33e);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    LV_IMAGE_DECLARE(fg_upload_ai_button_normal_1784677240652_1784677263363_f19e1afc);
    LV_IMAGE_DECLARE(fg_upload_ai_button_pressed_1784677240652_1784677288928_db03b335);
    lv_obj_t * obj1 = lv_button_create(parent);
    lv_obj_set_pos(obj1, 624, 0);
    lv_obj_set_size(obj1, 400, 300);
    lv_obj_set_style_radius(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_border_width(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(obj1, 0, LV_PART_MAIN);
    lv_obj_t * obj1_img = lv_image_create(obj1);
    lv_image_set_src(obj1_img, &fg_upload_ai_button_normal_1784677240652_1784677263363_f19e1afc);
    lv_image_set_scale(obj1_img, 256);
    lv_obj_center(obj1_img);
    lv_obj_clear_flag(obj1_img, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(obj1, LV_OBJ_FLAG_SCROLLABLE);
    static fg_interactive_button_data_t obj1_data = {
        .normal_src = &fg_upload_ai_button_normal_1784677240652_1784677263363_f19e1afc,
        .pressed_src = &fg_upload_ai_button_pressed_1784677240652_1784677288928_db03b335,
        .clicked_cb = FG_On_GreenButton_Clicked,
        .event_name = "FG_On_GreenButton_Clicked",
    };
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &obj1_data);

    LV_IMAGE_DECLARE(fg_upload_ai_button_normal_1784677321403_1784677340179_f471c4db);
    LV_IMAGE_DECLARE(fg_upload_ai_button_pressed_1784677321403_1784677360790_3c1521ce);
    lv_obj_t * obj2 = lv_button_create(parent);
    lv_obj_set_pos(obj2, 617, 227);
    lv_obj_set_size(obj2, 400, 300);
    lv_obj_set_style_radius(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_border_width(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(obj2, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj2, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(obj2, 0, LV_PART_MAIN);
    lv_obj_t * obj2_img = lv_image_create(obj2);
    lv_image_set_src(obj2_img, &fg_upload_ai_button_normal_1784677321403_1784677340179_f471c4db);
    lv_image_set_scale(obj2_img, 256);
    lv_obj_center(obj2_img);
    lv_obj_clear_flag(obj2_img, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(obj2, LV_OBJ_FLAG_SCROLLABLE);
    static fg_interactive_button_data_t obj2_data = {
        .normal_src = &fg_upload_ai_button_normal_1784677321403_1784677340179_f471c4db,
        .pressed_src = &fg_upload_ai_button_pressed_1784677321403_1784677360790_3c1521ce,
        .clicked_cb = FG_On_RedButton_Clicked,
        .event_name = "FG_On_RedButton_Clicked",
    };
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &obj2_data);
    lv_obj_add_event_cb(obj2, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &obj2_data);

    fg_status_light_output.image = lv_image_create(parent);
    fg_binary_output_set(&fg_status_light_output, true);
    lv_obj_set_pos(fg_status_light_output.image, 291, 22);
    lv_obj_set_size(fg_status_light_output.image, 400, 300);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_SCROLLABLE);

    fg_status_light_2_output.image = lv_image_create(parent);
    fg_binary_output_set(&fg_status_light_2_output, true);
    lv_obj_set_pos(fg_status_light_2_output.image, 356, 295);
    lv_obj_set_size(fg_status_light_2_output.image, 400, 300);
    lv_obj_clear_flag(fg_status_light_2_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_2_output.image, LV_OBJ_FLAG_SCROLLABLE);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}