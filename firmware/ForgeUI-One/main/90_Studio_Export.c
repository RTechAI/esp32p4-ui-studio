#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_ai_three_position_left_1784689428419_1784689454322_1b692875);
LV_IMAGE_DECLARE(fg_upload_ai_three_position_center_1784689428419_1784689477386_c5861a00);
LV_IMAGE_DECLARE(fg_upload_ai_three_position_right_1784689428419_1784689500237_d9a2724c);
typedef struct { lv_obj_t * button; lv_obj_t * image; const void * left_src; const void * center_src; const void * right_src; fg_three_way_state_t state; void (*changed_cb)(fg_three_way_state_t state); } fg_three_way_input_t;
static void fg_three_way_input_set(fg_three_way_input_t * input, fg_three_way_state_t state, bool notify)
{
    if (!input || (state != FG_THREE_WAY_LEFT && state != FG_THREE_WAY_CENTER && state != FG_THREE_WAY_RIGHT)) return;
    input->state = state;
    const void * src = state == FG_THREE_WAY_LEFT ? input->left_src : state == FG_THREE_WAY_RIGHT ? input->right_src : input->center_src;
    if (input->image) lv_image_set_src(input->image, src);
    if (notify && input->changed_cb) input->changed_cb(state);
}
static void fg_three_way_input_event_cb(lv_event_t * event)
{
    fg_three_way_input_t * input = (fg_three_way_input_t *)lv_event_get_user_data(event);
    lv_obj_t * button = lv_event_get_target(event);
    lv_indev_t * indev = lv_indev_active();
    if (!input || !button || !indev) return;

    lv_point_t point;
    lv_area_t button_coords;
    lv_indev_get_point(indev, &point);
    lv_obj_get_coords(button, &button_coords);

    int32_t width = lv_area_get_width(&button_coords);
    int32_t local_x = point.x - button_coords.x1;
    if (width <= 0 || local_x < 0 || local_x >= width) return;

    fg_three_way_state_t state = local_x < width / 3
        ? FG_THREE_WAY_LEFT
        : local_x < (width * 2) / 3
            ? FG_THREE_WAY_CENTER
            : FG_THREE_WAY_RIGHT;
    fg_three_way_input_set(input, state, true);
}

static fg_three_way_input_t fg_comp_MRVI1YXPF3EFG_three_way = {
    .button = NULL, .image = NULL, .left_src = &fg_upload_ai_three_position_left_1784689428419_1784689454322_1b692875, .center_src = &fg_upload_ai_three_position_center_1784689428419_1784689477386_c5861a00, .right_src = &fg_upload_ai_three_position_right_1784689428419_1784689500237_d9a2724c,
    .state = FG_THREE_WAY_CENTER, .changed_cb = FG_On_ThreePositionToggle_Changed,
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
    // Background flavour: Military Plate
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x1B2416), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x1B2416), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784689344022_395df2ca);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784689344022_395df2ca);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    fg_comp_MRVI1YXPF3EFG_three_way.button = lv_button_create(parent);
    lv_obj_set_pos(fg_comp_MRVI1YXPF3EFG_three_way.button, 237, 131);
    lv_obj_set_size(fg_comp_MRVI1YXPF3EFG_three_way.button, 400, 200);
    lv_obj_add_flag(fg_comp_MRVI1YXPF3EFG_three_way.button, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_comp_MRVI1YXPF3EFG_three_way.button, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_comp_MRVI1YXPF3EFG_three_way.button, 0, 0);
    fg_comp_MRVI1YXPF3EFG_three_way.image = lv_image_create(fg_comp_MRVI1YXPF3EFG_three_way.button);
    lv_obj_clear_flag(fg_comp_MRVI1YXPF3EFG_three_way.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_comp_MRVI1YXPF3EFG_three_way.image, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_center(fg_comp_MRVI1YXPF3EFG_three_way.image);
    fg_three_way_input_set(&fg_comp_MRVI1YXPF3EFG_three_way, FG_THREE_WAY_CENTER, false);
    lv_obj_add_event_cb(fg_comp_MRVI1YXPF3EFG_three_way.button, fg_three_way_input_event_cb, LV_EVENT_CLICKED, &fg_comp_MRVI1YXPF3EFG_three_way);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}