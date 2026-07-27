#include "90_Studio_Export.h"
#include "lvgl.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "95_UserEvents.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;

LV_IMAGE_DECLARE(fg_upload_fitted_light_off_1785110606315_1785110606316_0c32e275);
LV_IMAGE_DECLARE(fg_upload_fitted_light_on_1785110606315_1785110606320_4801858a);
LV_IMAGE_DECLARE(fg_upload_fitted_light_off_1785111287678_1785111287679_03dccde9);
LV_IMAGE_DECLARE(fg_upload_fitted_light_on_1785111287678_1785111287684_bc83b5a3);
LV_IMAGE_DECLARE(fg_upload_toggle_off_1785113534964_99c95bb6);
LV_IMAGE_DECLARE(fg_upload_toggle_on_1785113534964_eab9fe21);
LV_IMAGE_DECLARE(fg_upload_ai_three_position_left_1785113659171_1785113659175_fc98c81f);
LV_IMAGE_DECLARE(fg_upload_ai_three_position_center_1785113659171_1785113659177_ab79ef8f);
LV_IMAGE_DECLARE(fg_upload_ai_three_position_right_1785113659171_1785113659180_8141307b);
static uint32_t fg_interactive_three_way_axis_scale(int32_t target, uint32_t source)
{
    if (target <= 0 || source == 0) return 256;
    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;
    if (rounded < 1u) return 1;
    if (rounded > 65535u) return 65535;
    return (uint32_t)rounded;
}
static uint32_t fg_interactive_three_way_contain_scale(const lv_image_dsc_t * left, const lv_image_dsc_t * center, const lv_image_dsc_t * right, int32_t width, int32_t height)
{
    if (!left || !center || !right || !left->header.w || !left->header.h || !center->header.w || !center->header.h || !right->header.w || !right->header.h) return 256;
    uint32_t scale = fg_interactive_three_way_axis_scale(width, left->header.w);
    uint32_t candidate = fg_interactive_three_way_axis_scale(height, left->header.h); if (candidate < scale) scale = candidate;
    candidate = fg_interactive_three_way_axis_scale(width, center->header.w); if (candidate < scale) scale = candidate;
    candidate = fg_interactive_three_way_axis_scale(height, center->header.h); if (candidate < scale) scale = candidate;
    candidate = fg_interactive_three_way_axis_scale(width, right->header.w); if (candidate < scale) scale = candidate;
    candidate = fg_interactive_three_way_axis_scale(height, right->header.h); if (candidate < scale) scale = candidate;
    return scale;
}

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

static fg_three_way_input_t fg_comp_MS2IJAX1JEG54_three_way = {
    .button = NULL, .image = NULL, .left_src = &fg_upload_ai_three_position_left_1785113659171_1785113659175_fc98c81f, .center_src = &fg_upload_ai_three_position_center_1785113659171_1785113659177_ab79ef8f, .right_src = &fg_upload_ai_three_position_right_1785113659171_1785113659180_8141307b,
    .state = FG_THREE_WAY_CENTER, .changed_cb = FG_On_ThreePositionToggle_Changed,
};

static uint32_t fg_interactive_toggle_axis_scale(int32_t target, uint32_t source)
{
    if (target <= 0 || source == 0) return 256;
    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;
    if (rounded < 1u) return 1;
    if (rounded > 65535u) return 65535;
    return (uint32_t)rounded;
}

static uint32_t fg_interactive_toggle_contain_scale(
    const lv_image_dsc_t * off,
    const lv_image_dsc_t * on,
    int32_t width,
    int32_t height
)
{
    if (!off || !on ||
        off->header.w == 0 || off->header.h == 0 ||
        on->header.w == 0 || on->header.h == 0) return 256;
    uint32_t scale = fg_interactive_toggle_axis_scale(width, off->header.w);
    uint32_t candidate = fg_interactive_toggle_axis_scale(height, off->header.h);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_toggle_axis_scale(width, on->header.w);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_toggle_axis_scale(height, on->header.h);
    if (candidate < scale) scale = candidate;
    return scale;
}

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

static fg_toggle_input_t fg_comp_MS2IGY0RW6TIV_toggle = {
    .button = NULL, .image = NULL,
    .off_src = &fg_upload_toggle_off_1785113534964_99c95bb6, .on_src = &fg_upload_toggle_on_1785113534964_eab9fe21,
    .enabled = false, .toggled_cb = FG_On_StatusToggleSwitch_Toggled,
};


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

static uint32_t fg_interactive_light_axis_scale(int32_t target, uint32_t source)
{
    if (target <= 0 || source == 0) return 256;
    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;
    if (rounded < 1u) return 1;
    if (rounded > 65535u) return 65535;
    return (uint32_t)rounded;
}

static uint32_t fg_interactive_light_contain_scale(
    const lv_image_dsc_t * off,
    const lv_image_dsc_t * on,
    int32_t width,
    int32_t height
)
{
    if (!off || !on ||
        off->header.w == 0 || off->header.h == 0 ||
        on->header.w == 0 || on->header.h == 0) return 256;
    uint32_t scale = fg_interactive_light_axis_scale(width, off->header.w);
    uint32_t candidate = fg_interactive_light_axis_scale(height, off->header.h);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_light_axis_scale(width, on->header.w);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_light_axis_scale(height, on->header.h);
    if (candidate < scale) scale = candidate;
    return scale;
}

static fg_binary_output_t fg_status_light_output = {
    .image = NULL,
    .off_src = &fg_upload_fitted_light_off_1785110606315_1785110606316_0c32e275,
    .on_src = &fg_upload_fitted_light_on_1785110606315_1785110606320_4801858a,
    .enabled = false,
};

static fg_binary_output_t fg_status_status_indicator_output = {
    .image = NULL,
    .off_src = &fg_upload_fitted_light_off_1785111287678_1785111287679_03dccde9,
    .on_src = &fg_upload_fitted_light_on_1785111287678_1785111287684_bc83b5a3,
    .enabled = false,
};

void FG_Set_Status_Light(bool enabled)
{
    fg_binary_output_set(&fg_status_light_output, enabled);
}

void FG_Set_Status_Status_Indicator(bool enabled)
{
    fg_binary_output_set(&fg_status_status_indicator_output, enabled);
}

static uint32_t fg_interactive_button_axis_scale(int32_t target, uint32_t source)
{
    if (target <= 0 || source == 0) return 256;
    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;
    if (rounded < 1u) return 1;
    if (rounded > 65535u) return 65535;
    return (uint32_t)rounded;
}

static uint32_t fg_interactive_button_contain_scale(
    const lv_image_dsc_t * normal,
    const lv_image_dsc_t * pressed,
    int32_t width,
    int32_t height
)
{
    if (!normal || !pressed ||
        normal->header.w == 0 || normal->header.h == 0 ||
        pressed->header.w == 0 || pressed->header.h == 0) return 256;
    uint32_t scale = fg_interactive_button_axis_scale(width, normal->header.w);
    uint32_t candidate = fg_interactive_button_axis_scale(height, normal->header.h);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_button_axis_scale(width, pressed->header.w);
    if (candidate < scale) scale = candidate;
    candidate = fg_interactive_button_axis_scale(height, pressed->header.h);
    if (candidate < scale) scale = candidate;
    return scale;
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

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_t * bg_texture_0 = lv_image_create(parent);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1784342478518_b95a7dc0);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);

    LV_IMAGE_DECLARE(fg_upload_trimmed_button_normal_1785110636353_1785110636354_a3fc58a1);
    LV_IMAGE_DECLARE(fg_upload_trimmed_button_pressed_1785110636353_1785110636358_b8783690);
    lv_obj_t * obj1 = lv_button_create(parent);
    lv_obj_set_pos(obj1, 626, 59);
    lv_obj_set_size(obj1, 249.15625, 119);
    lv_obj_set_style_radius(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_border_width(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(obj1, 0, LV_PART_MAIN);
    lv_obj_set_style_bg_opa(obj1, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_width(obj1, 0, LV_PART_MAIN);
    lv_obj_t * obj1_img = lv_image_create(obj1);
    lv_image_set_src(obj1_img, &fg_upload_trimmed_button_normal_1785110636353_1785110636354_a3fc58a1);
    lv_image_set_scale(obj1_img, 476);
    lv_obj_center(obj1_img);
    lv_obj_clear_flag(obj1_img, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(obj1, LV_OBJ_FLAG_SCROLLABLE);
    static fg_interactive_button_data_t obj1_data = {
        .normal_src = &fg_upload_trimmed_button_normal_1785110636353_1785110636354_a3fc58a1,
        .pressed_src = &fg_upload_trimmed_button_pressed_1785110636353_1785110636358_b8783690,
        .clicked_cb = FG_On_Button1_Clicked,
        .event_name = "FG_On_Button1_Clicked",
    };
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &obj1_data);
    lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &obj1_data);

    lv_obj_t * fg_status_light_output_obj = lv_obj_create(parent);
    lv_obj_set_pos(fg_status_light_output_obj, 518, 156);
    lv_obj_set_size(fg_status_light_output_obj, 355, 247);
    lv_obj_set_style_bg_opa(fg_status_light_output_obj, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_status_light_output_obj, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_status_light_output_obj, 0, LV_PART_MAIN);
    fg_status_light_output.image = lv_image_create(fg_status_light_output_obj);
    fg_binary_output_set(&fg_status_light_output, false);
    lv_image_set_scale(fg_status_light_output.image, 363);
    lv_obj_center(fg_status_light_output.image);
    lv_obj_clear_flag(fg_status_light_output_obj, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_output_obj, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t * fg_status_status_indicator_output_obj = lv_obj_create(parent);
    lv_obj_set_pos(fg_status_status_indicator_output_obj, 200, 36);
    lv_obj_set_size(fg_status_status_indicator_output_obj, 255, 408);
    lv_obj_set_style_bg_opa(fg_status_status_indicator_output_obj, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_width(fg_status_status_indicator_output_obj, 0, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_status_status_indicator_output_obj, 0, LV_PART_MAIN);
    fg_status_status_indicator_output.image = lv_image_create(fg_status_status_indicator_output_obj);
    fg_binary_output_set(&fg_status_status_indicator_output, false);
    lv_image_set_scale(fg_status_status_indicator_output.image, 622);
    lv_obj_center(fg_status_status_indicator_output.image);
    lv_obj_clear_flag(fg_status_status_indicator_output_obj, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_status_indicator_output_obj, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_clear_flag(fg_status_status_indicator_output.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_status_status_indicator_output.image, LV_OBJ_FLAG_SCROLLABLE);

    fg_comp_MS2IGY0RW6TIV_toggle.button = lv_button_create(parent);
    lv_obj_remove_style_all(fg_comp_MS2IGY0RW6TIV_toggle.button);
    lv_obj_set_pos(fg_comp_MS2IGY0RW6TIV_toggle.button, 0, 14);
    lv_obj_set_size(fg_comp_MS2IGY0RW6TIV_toggle.button, 182, 267.47757255936676);
    lv_obj_set_style_bg_opa(fg_comp_MS2IGY0RW6TIV_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_opa(fg_comp_MS2IGY0RW6TIV_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_outline_opa(fg_comp_MS2IGY0RW6TIV_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_opa(fg_comp_MS2IGY0RW6TIV_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_comp_MS2IGY0RW6TIV_toggle.button, 0, LV_PART_MAIN);
    fg_comp_MS2IGY0RW6TIV_toggle.image = lv_image_create(fg_comp_MS2IGY0RW6TIV_toggle.button);
    lv_obj_remove_style_all(fg_comp_MS2IGY0RW6TIV_toggle.image);
    lv_obj_set_style_bg_opa(fg_comp_MS2IGY0RW6TIV_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_opa(fg_comp_MS2IGY0RW6TIV_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_outline_opa(fg_comp_MS2IGY0RW6TIV_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_shadow_opa(fg_comp_MS2IGY0RW6TIV_toggle.image, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_pad_all(fg_comp_MS2IGY0RW6TIV_toggle.image, 0, LV_PART_MAIN);
    lv_obj_clear_flag(fg_comp_MS2IGY0RW6TIV_toggle.image, LV_OBJ_FLAG_CLICKABLE);
    lv_image_set_scale(fg_comp_MS2IGY0RW6TIV_toggle.image, 123);
    lv_obj_center(fg_comp_MS2IGY0RW6TIV_toggle.image);
    fg_toggle_input_set(&fg_comp_MS2IGY0RW6TIV_toggle, false, false);
    lv_obj_add_event_cb(fg_comp_MS2IGY0RW6TIV_toggle.button, fg_toggle_input_event_cb, LV_EVENT_CLICKED, &fg_comp_MS2IGY0RW6TIV_toggle);

    fg_comp_MS2IJAX1JEG54_three_way.button = lv_button_create(parent);
    lv_obj_remove_style_all(fg_comp_MS2IJAX1JEG54_three_way.button);
    lv_obj_set_pos(fg_comp_MS2IJAX1JEG54_three_way.button, 280, 395);
    lv_obj_set_size(fg_comp_MS2IJAX1JEG54_three_way.button, 272, 136);
    lv_obj_set_style_bg_opa(fg_comp_MS2IJAX1JEG54_three_way.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_set_style_border_opa(fg_comp_MS2IJAX1JEG54_three_way.button, LV_OPA_TRANSP, LV_PART_MAIN);
    lv_obj_add_flag(fg_comp_MS2IJAX1JEG54_three_way.button, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_comp_MS2IJAX1JEG54_three_way.button, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_comp_MS2IJAX1JEG54_three_way.button, 0, 0);
    fg_comp_MS2IJAX1JEG54_three_way.image = lv_image_create(fg_comp_MS2IJAX1JEG54_three_way.button);
    lv_obj_remove_style_all(fg_comp_MS2IJAX1JEG54_three_way.image);
    lv_obj_clear_flag(fg_comp_MS2IJAX1JEG54_three_way.image, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_clear_flag(fg_comp_MS2IJAX1JEG54_three_way.image, LV_OBJ_FLAG_SCROLLABLE);
    lv_image_set_scale(fg_comp_MS2IJAX1JEG54_three_way.image, 174);
    lv_obj_center(fg_comp_MS2IJAX1JEG54_three_way.image);
    fg_three_way_input_set(&fg_comp_MS2IJAX1JEG54_three_way, FG_THREE_WAY_CENTER, false);
    lv_obj_add_event_cb(fg_comp_MS2IJAX1JEG54_three_way.button, fg_three_way_input_event_cb, LV_EVENT_CLICKED, &fg_comp_MS2IJAX1JEG54_three_way);


    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}