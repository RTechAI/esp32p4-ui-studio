#include "90_Studio_Export.h"
#include "lvgl.h"
#include "bsp/display.h"
#include "20_RTC.h"
#include "30_WIFI.h"
#include "40_SD.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

static lv_obj_t * fg_clock_label = NULL;
static lv_obj_t * fg_wifi_label = NULL;
static lv_obj_t * fg_application_page = NULL;
static lv_obj_t * fg_system_launcher_page = NULL;
static lv_obj_t * fg_system_brightness_page = NULL;
static lv_obj_t * fg_system_brightness_label = NULL;
static lv_obj_t * fg_system_wifi_page = NULL;
static lv_obj_t * fg_system_wifi_state_label = NULL;
static lv_obj_t * fg_system_wifi_ssid_label = NULL;
static lv_obj_t * fg_system_wifi_ip_label = NULL;
static lv_obj_t * fg_system_wifi_gateway_label = NULL;
static lv_obj_t * fg_system_wifi_rssi_label = NULL;
static lv_obj_t * fg_system_wifi_security_label = NULL;
static lv_obj_t * fg_system_wifi_raw_label = NULL;
static lv_obj_t * fg_system_wifi_scan_label = NULL;
static lv_obj_t * fg_system_wifi_network_container = NULL;
static lv_obj_t * fg_system_wifi_network_empty_label = NULL;
static lv_obj_t * fg_system_wifi_network_rows[FG_WIFI_MAX_SCAN] = {0};
static lv_obj_t * fg_system_wifi_network_labels[FG_WIFI_MAX_SCAN] = {0};
static lv_obj_t * fg_system_wifi_scan_button = NULL;
static lv_obj_t * fg_system_wifi_disconnect_button = NULL;
static lv_obj_t * fg_system_wifi_reconnect_button = NULL;
static lv_obj_t * fg_system_wifi_forget_button = NULL;
static lv_obj_t * fg_system_wifi_details_card = NULL;
static lv_obj_t * fg_system_wifi_details_label = NULL;
static lv_obj_t * fg_system_wifi_password_dialog = NULL;
static lv_obj_t * fg_system_wifi_password_input = NULL;
static lv_obj_t * fg_system_wifi_password_title = NULL;
static lv_obj_t * fg_system_wifi_password_error = NULL;
static lv_obj_t * fg_system_wifi_keyboard = NULL;
static lv_obj_t * fg_system_wifi_forget_dialog = NULL;
static lv_obj_t * fg_system_storage_page = NULL;
static lv_obj_t * fg_system_storage_summary = NULL;
static lv_obj_t * fg_system_storage_path = NULL;
static lv_obj_t * fg_system_storage_list = NULL;
#define FG_STORAGE_VISIBLE_ROWS 8
#define FG_STORAGE_WORKER_STACK 4096
static lv_obj_t * fg_system_storage_rows[FG_STORAGE_VISIBLE_ROWS] = {0};
static lv_obj_t * fg_system_storage_row_labels[FG_STORAGE_VISIBLE_ROWS] = {0};
static lv_obj_t * fg_system_storage_name_dialog = NULL;
static lv_obj_t * fg_system_storage_name_input = NULL;
static lv_obj_t * fg_system_storage_name_title = NULL;
static lv_obj_t * fg_system_storage_name_error = NULL;
static lv_obj_t * fg_system_storage_empty = NULL;
static lv_obj_t * fg_system_storage_parent_button = NULL;
static lv_obj_t * fg_system_storage_rename_button = NULL;
static lv_obj_t * fg_system_storage_delete_button = NULL;
static lv_obj_t * fg_system_storage_refresh_button = NULL;
static lv_obj_t * fg_system_storage_test_button = NULL;
static lv_obj_t * fg_system_storage_delete_dialog = NULL;
static lv_obj_t * fg_system_storage_delete_text = NULL;
static lv_obj_t * fg_system_storage_format_dialog = NULL;
static lv_obj_t * fg_system_storage_format_input = NULL;
static lv_obj_t * fg_system_storage_format_error = NULL;
static lv_obj_t * fg_system_storage_previous_button = NULL;
static lv_obj_t * fg_system_storage_next_button = NULL;
static lv_obj_t * fg_system_storage_select_folder_button = NULL;
static lv_obj_t * fg_system_storage_select_folder_label = NULL;
static lv_obj_t * fg_system_storage_delete_folder_button = NULL;
static lv_obj_t * fg_system_storage_delete_folder_label = NULL;
static lv_obj_t * fg_system_storage_delete_folder_dialog = NULL;
static lv_obj_t * fg_system_storage_delete_folder_text = NULL;
static lv_obj_t * fg_system_storage_delete_folder_input = NULL;
static lv_obj_t * fg_system_storage_delete_folder_error = NULL;
typedef enum { FG_STORAGE_REQ_REFRESH, FG_STORAGE_REQ_MOUNT, FG_STORAGE_REQ_UNMOUNT, FG_STORAGE_REQ_TEST, FG_STORAGE_REQ_CREATE, FG_STORAGE_REQ_RENAME, FG_STORAGE_REQ_DELETE, FG_STORAGE_REQ_FORMAT, FG_STORAGE_REQ_DELETE_EMPTY_FOLDER } fg_storage_request_kind_t;
typedef struct { fg_storage_request_kind_t kind; char path[FG_SD_MAX_PATH]; char name[FG_SD_MAX_NAME]; } fg_storage_request_t;
typedef struct { uint32_t generation; fg_storage_request_kind_t kind; fg_sd_result_t result; fg_sd_snapshot_t snapshot; fg_sd_directory_t directory; fg_sd_delete_folder_result_t delete_folder_result; } fg_storage_result_model_t;
static QueueHandle_t fg_system_storage_queue = NULL;
static SemaphoreHandle_t fg_system_storage_mutex = NULL;
static TaskHandle_t fg_system_storage_task = NULL;
static lv_timer_t * fg_system_storage_timer = NULL;
static fg_storage_result_model_t fg_system_storage_result = {0};
static fg_storage_result_model_t fg_system_storage_projection = {0};
static uint32_t fg_system_storage_consumed_generation = 0;
static bool fg_system_storage_pending = false;
static bool fg_system_storage_available = false;
static bool fg_system_storage_initialized = false;
static char fg_system_storage_current_path[FG_SD_MAX_PATH] = "";
static size_t fg_system_storage_page_offset = 0;
static int fg_system_storage_selected = -1;
static bool fg_system_storage_select_mode = false;
typedef struct { int visible_row; size_t entry_index; bool valid; bool is_directory; bool is_empty; char name[FG_SD_MAX_NAME]; } fg_storage_row_metadata_t;
static fg_storage_row_metadata_t fg_system_storage_row_metadata[FG_STORAGE_VISIBLE_ROWS] = {0};
static bool fg_system_storage_name_is_rename = false;
static lv_obj_t * fg_system_root = NULL;
static fg_wifi_network_t fg_system_wifi_networks[FG_WIFI_MAX_SCAN];
static int fg_system_wifi_network_count = 0;
static int fg_system_wifi_selected = -1;
static bool fg_system_wifi_remember = true;
static bool fg_system_wifi_page_active = false;
static uint8_t fg_system_brightness_percent = 100;
static void fg_wifi_tick_cb(lv_timer_t *timer);
static void fg_keyboard_hide(void);
static void fg_keyboard_show_for(lv_obj_t * textarea);
static void fg_keyboard_event_cb(lv_event_t * event);
static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height);
static bool fg_system_storage_create_page(void);
static bool fg_system_storage_create_name_dialog(void);
static bool fg_system_storage_create_delete_dialog(void);
static bool fg_system_storage_create_format_dialog(void);
static bool fg_system_storage_create_delete_folder_dialog(void);
static void fg_system_storage_worker(void * arg);
static void fg_system_storage_tick_cb(lv_timer_t * timer);

static void FG_Set_Display_Brightness(uint8_t percent)
{
    if (percent < 10) percent = 10;
    if (percent > 100) percent = 100;
    fg_system_brightness_percent = percent;
    (void)bsp_display_brightness_set((int)percent);
}

static void fg_system_show_page(lv_obj_t * page)
{
    if (!page || !fg_application_page || !fg_system_launcher_page || !fg_system_brightness_page || !fg_system_wifi_page) return;
    lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_storage_page) lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_clear_flag(page, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(page);
}

static void fg_system_open_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_launcher_page);
}

static void fg_system_close_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_wifi_page_active = false;
    fg_system_show_page(fg_application_page);
}

static void fg_system_open_brightness_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_brightness_page);
}

static void fg_system_brightness_back_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_show_page(fg_system_launcher_page);
}

static void fg_system_open_wifi_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_wifi_page_active = true;
    fg_wifi_tick_cb(NULL);
    fg_system_show_page(fg_system_wifi_page);
}

static void fg_system_wifi_back_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_system_wifi_page_active = false;
    fg_system_show_page(fg_system_launcher_page);
}

static bool fg_system_storage_request(fg_storage_request_kind_t kind, const char * path, const char * name)
{
    if (fg_system_storage_pending || !fg_system_storage_page) return false;
    if (!fg_system_storage_mutex) fg_system_storage_mutex = xSemaphoreCreateMutex();
    if (!fg_system_storage_mutex) goto unavailable;
    if (!fg_system_storage_queue) fg_system_storage_queue = xQueueCreate(1, sizeof(fg_storage_request_t));
    if (!fg_system_storage_queue) goto unavailable;
    if (!fg_system_storage_task && xTaskCreate(fg_system_storage_worker, "fg_sd_worker", FG_STORAGE_WORKER_STACK, NULL, 5, &fg_system_storage_task) != pdPASS) goto unavailable;
    if (!fg_system_storage_timer) fg_system_storage_timer = lv_timer_create(fg_system_storage_tick_cb, 100, NULL);
    if (!fg_system_storage_timer) goto unavailable;
    fg_system_storage_available = true;
    fg_storage_request_t request = { .kind = kind };
    snprintf(request.path, sizeof(request.path), "%s", path ? path : "");
    snprintf(request.name, sizeof(request.name), "%s", name ? name : "");
    if (xQueueSend(fg_system_storage_queue, &request, 0) != pdTRUE) return false;
    fg_system_storage_pending = true;
    lv_label_set_text(fg_system_storage_summary, "SD operation running...");
    lv_obj_add_state(fg_system_storage_refresh_button, LV_STATE_DISABLED);
    lv_obj_add_state(fg_system_storage_test_button, LV_STATE_DISABLED);
    if (fg_system_storage_delete_folder_button) lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);
    return true;
unavailable:
    fg_system_storage_available = false;
    if (fg_system_storage_summary) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\nBack remains available");
    return false;
}
static void fg_system_storage_worker(void * arg)
{
    LV_UNUSED(arg); fg_storage_request_t request;
    for (;;) {
        if (xQueueReceive(fg_system_storage_queue, &request, portMAX_DELAY) != pdTRUE) continue;
        fg_storage_result_model_t next = { .kind = request.kind, .result = FG_SD_OK };
        switch (request.kind) {
            case FG_STORAGE_REQ_MOUNT: next.result = fg_sd_mount(); break;
            case FG_STORAGE_REQ_UNMOUNT: next.result = fg_sd_unmount(); break;
            case FG_STORAGE_REQ_TEST: next.result = fg_sd_run_test(); break;
            case FG_STORAGE_REQ_CREATE: next.result = fg_sd_create_directory(request.path, request.name); break;
            case FG_STORAGE_REQ_RENAME: next.result = fg_sd_rename_entry(request.path, request.name); break;
            case FG_STORAGE_REQ_DELETE: next.result = fg_sd_delete_entry(request.path); break;
            case FG_STORAGE_REQ_FORMAT: next.result = fg_sd_format(); break;
            case FG_STORAGE_REQ_DELETE_EMPTY_FOLDER: next.result = fg_sd_delete_empty_folder(request.path, request.name, &next.delete_folder_result); break;
            default: next.result = fg_sd_refresh(); break;
        }
        (void)fg_sd_get_snapshot(&next.snapshot);
        if (next.snapshot.mounted) {
            fg_sd_result_t list_result = fg_sd_list_directory(request.path, &next.directory);
            if (list_result != FG_SD_OK) (void)fg_sd_list_directory("", &next.directory);
        }
        xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY);
        next.generation = fg_system_storage_result.generation + 1;
        fg_system_storage_result = next;
        xSemaphoreGive(fg_system_storage_mutex);
    }
}
static void fg_system_storage_clear_selection(void)
{
    fg_system_storage_selected = -1;
    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) lv_obj_clear_state(fg_system_storage_rows[i], LV_STATE_CHECKED);
    if (fg_system_storage_rename_button) lv_obj_add_state(fg_system_storage_rename_button, LV_STATE_DISABLED);
    if (fg_system_storage_delete_button) lv_obj_add_state(fg_system_storage_delete_button, LV_STATE_DISABLED);
    if (fg_system_storage_delete_folder_button) lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);
    if (fg_system_storage_delete_folder_label) lv_label_set_text(fg_system_storage_delete_folder_label, "Delete Folder");
}
static void fg_system_storage_leave_select_mode(void)
{
    fg_system_storage_select_mode = false; fg_system_storage_clear_selection();
    if (fg_system_storage_select_folder_label) lv_label_set_text(fg_system_storage_select_folder_label, "Select Item");
}
static void fg_system_storage_tick_cb(lv_timer_t * timer)
{
    LV_UNUSED(timer); if (!fg_system_storage_mutex) return;
    xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); fg_system_storage_projection = fg_system_storage_result; xSemaphoreGive(fg_system_storage_mutex);
    fg_storage_result_model_t * model_ptr = &fg_system_storage_projection;
    #define model (*model_ptr)
    if (model.generation == fg_system_storage_consumed_generation) return;
    fg_system_storage_consumed_generation = model.generation; fg_system_storage_pending = false;
    lv_obj_clear_state(fg_system_storage_refresh_button, LV_STATE_DISABLED);
    if (model.snapshot.mounted) lv_obj_clear_state(fg_system_storage_test_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_test_button, LV_STATE_DISABLED);
    snprintf(fg_system_storage_current_path, sizeof(fg_system_storage_current_path), "%s", model.directory.path[0] == '/' ? model.directory.path + 1 : model.directory.path);
    lv_label_set_text_fmt(fg_system_storage_summary, "%s | %s | %s\nTotal %llu MB  Used %llu MB  Free %llu MB\n%s",
        model.snapshot.mounted ? "Mounted" : "Not Mounted", model.snapshot.card_type, model.snapshot.filesystem,
        (unsigned long long)(model.snapshot.total_bytes / 1048576), (unsigned long long)(model.snapshot.used_bytes / 1048576),
        (unsigned long long)(model.snapshot.free_bytes / 1048576), model.result == FG_SD_OK ? model.snapshot.status : fg_sd_result_text(model.result));
    lv_label_set_text_fmt(fg_system_storage_path, "/sdcard%s%s", fg_system_storage_current_path[0] ? "/" : "", fg_system_storage_current_path);
    if (fg_system_storage_page_offset >= model.directory.count) fg_system_storage_page_offset = 0;
    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) { fg_system_storage_row_metadata[i].valid = false; lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN); }
    for (size_t i = 0; i < FG_STORAGE_VISIBLE_ROWS && fg_system_storage_page_offset + i < model.directory.count; ++i) {
        fg_sd_entry_t * entry = &model.directory.entries[fg_system_storage_page_offset + i];
        fg_system_storage_row_metadata[i].visible_row = (int)i; fg_system_storage_row_metadata[i].entry_index = fg_system_storage_page_offset + i; fg_system_storage_row_metadata[i].valid = true; fg_system_storage_row_metadata[i].is_directory = entry->is_directory; fg_system_storage_row_metadata[i].is_empty = entry->is_empty; snprintf(fg_system_storage_row_metadata[i].name, sizeof(fg_system_storage_row_metadata[i].name), "%s", entry->name);
        lv_label_set_text_fmt(fg_system_storage_row_labels[i], "%s  %.63s    %s", entry->is_directory ? LV_SYMBOL_DIRECTORY : LV_SYMBOL_FILE, entry->name, entry->is_directory ? "Folder" : "File");
        lv_obj_clear_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);
    }
    if (fg_system_storage_page_offset == 0) lv_obj_add_state(fg_system_storage_previous_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_storage_previous_button, LV_STATE_DISABLED);
    if (fg_system_storage_page_offset + FG_STORAGE_VISIBLE_ROWS >= model.directory.count) lv_obj_add_state(fg_system_storage_next_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_storage_next_button, LV_STATE_DISABLED);
    if (model.snapshot.mounted && model.directory.count == 0) lv_obj_clear_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN); else lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_storage_current_path[0]) lv_obj_clear_state(fg_system_storage_parent_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);
    fg_system_storage_leave_select_mode();
    if (model.result == FG_SD_OK && (model.kind == FG_STORAGE_REQ_CREATE || model.kind == FG_STORAGE_REQ_RENAME)) { fg_keyboard_hide(); if (fg_system_storage_name_dialog) lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, model.kind == FG_STORAGE_REQ_CREATE ? "Folder created" : "Entry renamed"); }
    else if (model.result != FG_SD_OK && (model.kind == FG_STORAGE_REQ_CREATE || model.kind == FG_STORAGE_REQ_RENAME) && fg_system_storage_name_error) lv_label_set_text(fg_system_storage_name_error, fg_sd_result_text(model.result));
    if (model.kind == FG_STORAGE_REQ_DELETE && model.result == FG_SD_OK) { if (fg_system_storage_delete_dialog) lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Entry deleted"); }
    if (model.kind == FG_STORAGE_REQ_FORMAT && fg_system_storage_format_error) { lv_label_set_text(fg_system_storage_format_error, model.result == FG_SD_OK ? "Format complete; card remounted" : fg_sd_result_text(model.result)); if (model.result == FG_SD_OK) { fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Format complete; empty root ready"); } }
    if (model.kind == FG_STORAGE_REQ_DELETE_EMPTY_FOLDER) { if (model.result == FG_SD_OK) { fg_keyboard_hide(); if (fg_system_storage_delete_folder_dialog) lv_obj_add_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Folder deleted"); } else if (fg_system_storage_delete_folder_error) lv_label_set_text(fg_system_storage_delete_folder_error, model.result == FG_SD_ERR_NOT_EMPTY ? "Folder is not empty." : fg_sd_result_text(model.result)); }
    #undef model
}
static void fg_system_open_storage_cb(lv_event_t * event) { LV_UNUSED(event); if (!fg_system_storage_initialized && !fg_system_storage_create_page()) return; fg_system_show_page(fg_system_storage_page); if (!fg_system_storage_summary || !fg_system_storage_refresh_button || !fg_system_storage_test_button) return; (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }
static void fg_system_storage_back_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_show_page(fg_system_launcher_page); }
static void fg_system_storage_refresh_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }
static void fg_system_storage_mount_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_pending) return; fg_system_storage_current_path[0] = 0; fg_system_storage_page_offset = 0; fg_system_storage_clear_selection(); (void)fg_system_storage_request(FG_STORAGE_REQ_MOUNT, "", NULL); }
static void fg_system_storage_unmount_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_pending) return; fg_system_storage_page_offset = 0; fg_system_storage_clear_selection(); (void)fg_system_storage_request(FG_STORAGE_REQ_UNMOUNT, "", NULL); }
static void fg_system_storage_test_cb(lv_event_t * event) { LV_UNUSED(event); (void)fg_system_storage_request(FG_STORAGE_REQ_TEST, fg_system_storage_current_path, NULL); }
static void fg_system_storage_parent_cb(lv_event_t * event) { LV_UNUSED(event); char * slash = strrchr(fg_system_storage_current_path, '/'); if (slash) *slash = 0; else fg_system_storage_current_path[0] = 0; fg_system_storage_page_offset = 0; fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }
static void fg_system_storage_previous_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_page_offset >= FG_STORAGE_VISIBLE_ROWS) fg_system_storage_page_offset -= FG_STORAGE_VISIBLE_ROWS; else fg_system_storage_page_offset = 0; fg_system_storage_consumed_generation--; fg_system_storage_tick_cb(NULL); }
static void fg_system_storage_next_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_page_offset + FG_STORAGE_VISIBLE_ROWS < fg_system_storage_projection.directory.count) fg_system_storage_page_offset += FG_STORAGE_VISIBLE_ROWS; fg_system_storage_consumed_generation--; fg_system_storage_tick_cb(NULL); }
static void fg_system_storage_row_cb(lv_event_t * event)
{
    if (lv_event_get_code(event) != LV_EVENT_CLICKED) return;
    const fg_storage_row_metadata_t * metadata = (const fg_storage_row_metadata_t *)lv_event_get_user_data(event); if (!metadata) return;
    int row = metadata->visible_row; if (!metadata->valid || row < 0 || row >= FG_STORAGE_VISIBLE_ROWS || fg_system_storage_pending || lv_obj_has_flag(fg_system_storage_rows[row], LV_OBJ_FLAG_HIDDEN)) return;
    size_t index = metadata->entry_index; if (index != fg_system_storage_page_offset + (size_t)row || index >= fg_system_storage_projection.directory.count) return;
    if (fg_system_storage_select_mode) {
        fg_system_storage_clear_selection(); fg_system_storage_selected = (int)index; lv_obj_add_state(fg_system_storage_rows[row], LV_STATE_CHECKED);
        if (fg_system_storage_delete_folder_label) lv_label_set_text(fg_system_storage_delete_folder_label, "Delete Folder");
        if (metadata->is_directory && metadata->is_empty) lv_obj_clear_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);
        return;
    }
    if (!metadata->is_directory) return;
    {
        size_t used = strlen(fg_system_storage_current_path); snprintf(fg_system_storage_current_path + used, sizeof(fg_system_storage_current_path) - used, "%s%s", used ? "/" : "", metadata->name);
        fg_system_storage_page_offset = 0; fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); return;
    }
}
static void fg_system_storage_select_folder_cb(lv_event_t * event)
{
    LV_UNUSED(event); if (fg_system_storage_select_mode) { fg_system_storage_leave_select_mode(); return; }
    fg_system_storage_clear_selection(); fg_system_storage_select_mode = true;
    if (fg_system_storage_select_folder_label) lv_label_set_text(fg_system_storage_select_folder_label, "Cancel Selection");
}
static void fg_system_storage_new_folder_cb(lv_event_t * event)
{
    LV_UNUSED(event); if (!fg_system_storage_create_name_dialog()) return; fg_system_storage_name_is_rename = false; lv_label_set_text(fg_system_storage_name_title, "Create Folder"); lv_label_set_text(fg_system_storage_name_error, ""); lv_textarea_set_text(fg_system_storage_name_input, "");
    lv_obj_clear_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_keyboard_show_for(fg_system_storage_name_input);
}
static void fg_system_storage_rename_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_name_dialog()) return; fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if ((size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); fg_system_storage_name_is_rename = true; lv_label_set_text(fg_system_storage_name_title, "Rename"); lv_label_set_text(fg_system_storage_name_error, ""); lv_textarea_set_text(fg_system_storage_name_input, entry.name); lv_obj_clear_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_name_input); }
static bool fg_system_storage_valid_name(const char * name) { if (!name || !name[0] || !strcmp(name, ".") || !strcmp(name, "..")) return false; bool visible = false; for (const unsigned char * p = (const unsigned char *)name; *p; ++p) { if (*p < 32 || strchr("<>:\"/\\|?*", *p)) return false; if (*p != ' ' && *p != '\t') visible = true; } return visible; }
static void fg_system_storage_name_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_name_error, ""); }
static void fg_system_storage_name_commit_cb(lv_event_t * event) { LV_UNUSED(event); const char * name = lv_textarea_get_text(fg_system_storage_name_input); if (!fg_system_storage_valid_name(name)) { lv_label_set_text(fg_system_storage_name_error, "Enter a safe non-empty name"); return; } if (!fg_system_storage_name_is_rename) { (void)fg_system_storage_request(FG_STORAGE_REQ_CREATE, fg_system_storage_current_path, name); return; } fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); char path[FG_SD_MAX_PATH]; snprintf(path, sizeof(path), "%s%s%s", fg_system_storage_current_path, fg_system_storage_current_path[0] ? "/" : "", entry.name); (void)fg_system_storage_request(FG_STORAGE_REQ_RENAME, path, name); }
static void fg_system_storage_delete_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_delete_dialog()) return; fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if ((size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); lv_label_set_text_fmt(fg_system_storage_delete_text, "Permanently delete %s '%s'?\nNon-empty folders are protected.", entry.is_directory ? "folder" : "file", entry.name); lv_obj_clear_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); }
static void fg_system_storage_delete_cancel_cb(lv_event_t * event) { LV_UNUSED(event); lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); }
static void fg_system_storage_delete_confirm_cb(lv_event_t * event) { LV_UNUSED(event); fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); char path[FG_SD_MAX_PATH]; snprintf(path, sizeof(path), "%s%s%s", fg_system_storage_current_path, fg_system_storage_current_path[0] ? "/" : "", entry.name); (void)fg_system_storage_request(FG_STORAGE_REQ_DELETE, path, NULL); }
static void fg_system_storage_format_cb(lv_event_t * event) { LV_UNUSED(event); if (!fg_system_storage_create_format_dialog()) return; lv_label_set_text(fg_system_storage_format_error, "SD Card /sdcard: all files will be erased. Type FORMAT."); lv_textarea_set_text(fg_system_storage_format_input, ""); lv_obj_clear_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_format_input); }
static void fg_system_storage_format_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); }
static void fg_system_storage_format_confirm_cb(lv_event_t * event) { LV_UNUSED(event); if (strcmp(lv_textarea_get_text(fg_system_storage_format_input), "FORMAT")) { lv_label_set_text(fg_system_storage_format_error, "Type FORMAT exactly"); return; } lv_label_set_text(fg_system_storage_format_error, "Preparing to format..."); fg_system_storage_current_path[0] = 0; (void)fg_system_storage_request(FG_STORAGE_REQ_FORMAT, "", NULL); }
static void fg_system_storage_delete_folder_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_delete_folder_dialog()) return; fg_sd_entry_t * entry = &fg_system_storage_projection.directory.entries[fg_system_storage_selected]; if (!entry->is_directory || !entry->is_empty) return; lv_label_set_text_fmt(fg_system_storage_delete_folder_text, "Delete folder:\n%s\n\nThis folder must be empty.", entry->name); lv_label_set_text(fg_system_storage_delete_folder_error, "Type DELETE exactly to continue."); lv_textarea_set_text(fg_system_storage_delete_folder_input, ""); lv_obj_clear_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_delete_folder_input); }
static void fg_system_storage_delete_folder_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); if (fg_system_storage_delete_folder_dialog) lv_obj_add_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); }
static void fg_system_storage_delete_folder_confirm_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_projection.directory.count) return; if (strcmp(lv_textarea_get_text(fg_system_storage_delete_folder_input), "DELETE")) { lv_label_set_text(fg_system_storage_delete_folder_error, "Type DELETE exactly"); return; } fg_sd_entry_t * entry = &fg_system_storage_projection.directory.entries[fg_system_storage_selected]; if (!entry->is_directory || !entry->is_empty) { lv_label_set_text(fg_system_storage_delete_folder_error, "Folder is not empty."); return; } lv_label_set_text(fg_system_storage_delete_folder_error, "Deleting folder..."); (void)fg_system_storage_request(FG_STORAGE_REQ_DELETE_EMPTY_FOLDER, fg_system_storage_current_path, entry->name); }

static void fg_system_wifi_scan_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (fg_wifi_scan_in_progress()) return;
    fg_wifi_scan_start();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_disconnect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_wifi_disconnect();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_reconnect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    (void)fg_wifi_reconnect();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_refresh_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (!fg_wifi_scan_in_progress()) (void)fg_wifi_scan_start();
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_password_cancel_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    fg_keyboard_hide();
    if (fg_system_wifi_password_input) lv_textarea_set_text(fg_system_wifi_password_input, "");
    if (fg_system_wifi_password_error) lv_label_set_text(fg_system_wifi_password_error, "");
    if (fg_system_wifi_password_dialog) lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_wifi_tick_cb(NULL);
}

static void fg_keyboard_hide(void)
{
    if (!fg_system_wifi_keyboard) return;
    lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);
    lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    if (fg_system_wifi_password_dialog) {
        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);
    }
}

static void fg_keyboard_show_for(lv_obj_t * textarea)
{
    if (!textarea) return;
    if (fg_system_wifi_keyboard &&
        !lv_obj_has_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN) &&
        lv_keyboard_get_textarea(fg_system_wifi_keyboard) == textarea) return;
    // Replaces eager screen-child creation: fg_system_wifi_keyboard = lv_keyboard_create(parent);
    if (!fg_system_wifi_keyboard) {
        fg_system_wifi_keyboard = lv_keyboard_create(lv_layer_top());
        lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);
        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_IGNORE_LAYOUT | LV_OBJ_FLAG_FLOATING);
        lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);
        lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);
        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_MAIN);
        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(0x374151), LV_PART_MAIN);
        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_MAIN);
        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(0x9CA3AF), LV_PART_MAIN);
        lv_obj_set_style_radius(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_MAIN);
        lv_obj_set_style_pad_all(fg_system_wifi_keyboard, 8, LV_PART_MAIN);
        lv_obj_set_style_pad_row(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_pad_column(fg_system_wifi_keyboard, 6, LV_PART_MAIN);
        lv_obj_set_style_text_font(fg_system_wifi_keyboard, &lv_font_montserrat_18, LV_PART_ITEMS);
        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_ITEMS);
        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(0x4B5563), LV_PART_ITEMS);
        lv_obj_set_style_text_color(fg_system_wifi_keyboard, lv_color_hex(0xF3F4F6), LV_PART_ITEMS);
        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_ITEMS);
        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(0x9CA3AF), LV_PART_ITEMS);
        lv_obj_set_style_radius(fg_system_wifi_keyboard, 4, LV_PART_ITEMS);
        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_ITEMS);
        lv_obj_add_event_cb(fg_system_wifi_keyboard, fg_keyboard_event_cb, LV_EVENT_ALL, NULL);
        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    }
    if (lv_keyboard_get_textarea(fg_system_wifi_keyboard) != textarea) {
        lv_keyboard_set_textarea(fg_system_wifi_keyboard, textarea);
    }
    lv_keyboard_set_mode(fg_system_wifi_keyboard, LV_KEYBOARD_MODE_TEXT_LOWER);
    if (textarea == fg_system_wifi_password_input) {
        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 18);
    }
    lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);
    lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);
    lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);
    lv_obj_clear_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(fg_system_wifi_keyboard);
}

static void fg_keyboard_event_cb(lv_event_t * event)
{
    lv_event_code_t code = lv_event_get_code(event);
    if (code == LV_EVENT_READY || code == LV_EVENT_CANCEL) {
        fg_keyboard_hide();
    }
}

static void fg_keyboard_open_cb(lv_event_t * event)
{
    lv_obj_t * textarea = lv_event_get_target(event);
    fg_keyboard_show_for(textarea);
}

static void fg_system_wifi_password_show_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (!fg_system_wifi_password_input) return;
    bool hidden = lv_textarea_get_password_mode(fg_system_wifi_password_input);
    lv_textarea_set_password_mode(fg_system_wifi_password_input, !hidden);
}

static void fg_system_wifi_remember_cb(lv_event_t * event)
{
    lv_obj_t * button = lv_event_get_target(event);
    fg_system_wifi_remember = !fg_system_wifi_remember;
    lv_obj_t * label = lv_obj_get_child(button, 0);
    if (label) lv_label_set_text(label, fg_system_wifi_remember ? LV_SYMBOL_OK " Remember password" : "Remember password");
}

static void fg_system_wifi_password_connect_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    if (fg_system_wifi_selected < 0 || fg_system_wifi_selected >= fg_system_wifi_network_count) return;
    const char * password = lv_textarea_get_text(fg_system_wifi_password_input);
    size_t password_length = strlen(password);
    if (password_length < 8 || password_length > 63) {
        lv_label_set_text(fg_system_wifi_password_error, "Password must be 8 to 63 characters");
        return;
    }
    fg_wifi_result_t result = fg_wifi_connect_network(&fg_system_wifi_networks[fg_system_wifi_selected], password, fg_system_wifi_remember);
    if (result != FG_WIFI_OP_ACCEPTED && result != FG_WIFI_OP_OK) {
        lv_label_set_text(fg_system_wifi_password_error, "Unable to start connection");
        return;
    }
    fg_keyboard_hide();
    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_network_cb(lv_event_t * event)
{
    int index = (int)(intptr_t)lv_event_get_user_data(event);
    if (index < 0 || index >= fg_system_wifi_network_count) return;
    fg_system_wifi_selected = index;
    fg_wifi_network_t * network = &fg_system_wifi_networks[index];
    if (network->connected) { fg_wifi_tick_cb(NULL); return; }
    if (network->security == FG_WIFI_SECURITY_OPEN) {
        (void)fg_wifi_connect_network(network, NULL, fg_system_wifi_remember);
    } else {
        lv_textarea_set_text(fg_system_wifi_password_input, "");
        lv_textarea_set_password_mode(fg_system_wifi_password_input, true);
        lv_label_set_text_fmt(fg_system_wifi_password_title, "Connect to %s", network->ssid);
        lv_label_set_text(fg_system_wifi_password_error, "");
        lv_obj_clear_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);
        lv_obj_move_foreground(fg_system_wifi_password_dialog);
    }
    fg_wifi_tick_cb(NULL);
}

static void fg_system_wifi_forget_request_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    lv_obj_clear_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(fg_system_wifi_forget_dialog);
}

static void fg_system_wifi_forget_cancel_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
}

static void fg_system_wifi_forget_confirm_cb(lv_event_t * event)
{
    LV_UNUSED(event);
    (void)fg_wifi_forget();
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_wifi_tick_cb(NULL);
}

static void fg_system_brightness_changed_cb(lv_event_t * event)
{
    lv_obj_t * slider = lv_event_get_target(event);
    if (!slider) return;
    uint8_t percent = (uint8_t)lv_slider_get_value(slider);
    FG_Set_Display_Brightness(percent);
    if (fg_system_brightness_label) {
        lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);
    }
}

static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height)
{
    lv_obj_t * button = lv_button_create(parent);
    if (!button) return NULL;
    lv_obj_set_pos(button, x, y);
    lv_obj_set_size(button, width, height);
    lv_obj_set_style_radius(button, 12, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x374151), 0);
    lv_obj_set_style_border_color(button, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_border_width(button, 2, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x9CA3AF), LV_STATE_PRESSED);
    lv_obj_set_style_border_color(button, lv_color_hex(0x9CA3AF), LV_STATE_PRESSED);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x4B5563), LV_STATE_FOCUSED);
    lv_obj_set_style_border_color(button, lv_color_hex(0x9CA3AF), LV_STATE_FOCUSED);
    lv_obj_set_style_bg_color(button, lv_color_hex(0x4B5563), LV_STATE_DISABLED);
    lv_obj_set_style_border_color(button, lv_color_hex(0x9CA3AF), LV_STATE_DISABLED);
    lv_obj_set_style_opa(button, LV_OPA_40, LV_STATE_DISABLED);
    lv_obj_t * label = lv_label_create(button);
    if (!label) { lv_obj_delete(button); return NULL; }
    lv_label_set_text(label, text);
    lv_obj_set_style_text_color(label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(label);
    return button;
}

static bool fg_system_storage_create_name_dialog(void)
{
    if (fg_system_storage_name_dialog) return true;
    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false;
    lv_obj_set_size(dialog, 520, 260); lv_obj_center(dialog);
    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog); lv_obj_t * error = lv_label_create(dialog);
    if (!title || !input || !error) { lv_obj_delete(dialog); return false; }
    fg_system_storage_name_title = title; fg_system_storage_name_input = input; fg_system_storage_name_error = error;
    lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8); lv_obj_set_size(input, 450, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 45); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, FG_SD_MAX_NAME - 1); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    lv_obj_set_width(error, 450); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 110); lv_obj_set_style_text_color(error, lv_color_hex(0x9CA3AF), 0);
    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 165, 210, 52); lv_obj_t * save = fg_system_create_button(dialog, "Save", 255, 165, 210, 52);
    if (!cancel || !save) { lv_obj_delete(dialog); fg_system_storage_name_title = NULL; fg_system_storage_name_input = NULL; fg_system_storage_name_error = NULL; return false; }
    lv_obj_add_event_cb(cancel, fg_system_storage_name_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(save, fg_system_storage_name_commit_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_name_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;
}

static bool fg_system_storage_create_delete_dialog(void)
{
    if (fg_system_storage_delete_dialog) return true;
    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 560, 240); lv_obj_center(dialog);
    lv_obj_t * text = lv_label_create(dialog); if (!text) { lv_obj_delete(dialog); return false; } fg_system_storage_delete_text = text; lv_obj_set_width(text, 490); lv_obj_align(text, LV_ALIGN_TOP_MID, 0, 24);
    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 145, 230, 56); lv_obj_t * confirm = fg_system_create_button(dialog, "Confirm Delete", 280, 145, 230, 56);
    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_delete_text = NULL; return false; }
    lv_obj_add_event_cb(cancel, fg_system_storage_delete_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_delete_confirm_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_delete_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;
}

static bool fg_system_storage_create_format_dialog(void)
{
    if (fg_system_storage_format_dialog) return true;
    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 590, 310); lv_obj_center(dialog);
    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * error = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog);
    if (!title || !error || !input) { lv_obj_delete(dialog); return false; }
    lv_label_set_text(title, "FORMAT SD CARD"); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8); fg_system_storage_format_error = error; lv_obj_set_width(error, 520); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 44); lv_obj_set_style_text_color(error, lv_color_hex(0x9CA3AF), 0);
    fg_system_storage_format_input = input; lv_obj_set_size(input, 500, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 112); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, 6); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 35, 215, 240, 55); lv_obj_t * confirm = fg_system_create_button(dialog, "Erase and Format", 295, 215, 240, 55);
    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_format_error = NULL; fg_system_storage_format_input = NULL; return false; }
    lv_obj_add_event_cb(cancel, fg_system_storage_format_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_format_confirm_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_format_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;
}

static bool fg_system_storage_create_delete_folder_dialog(void)
{
    if (fg_system_storage_delete_folder_dialog) return true;
    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 560, 330); lv_obj_center(dialog);
    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * text = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog); lv_obj_t * error = lv_label_create(dialog);
    if (!title || !text || !input || !error) { lv_obj_delete(dialog); return false; }
    lv_label_set_text(title, "DELETE EMPTY FOLDER"); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8);
    fg_system_storage_delete_folder_text = text; lv_obj_set_width(text, 490); lv_obj_align(text, LV_ALIGN_TOP_MID, 0, 43); lv_obj_set_style_text_align(text, LV_TEXT_ALIGN_CENTER, 0);
    fg_system_storage_delete_folder_input = input; lv_obj_set_size(input, 480, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 125); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, 6); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    fg_system_storage_delete_folder_error = error; lv_obj_set_width(error, 500); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 190); lv_obj_set_style_text_color(error, lv_color_hex(0x9CA3AF), 0);
    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 240, 235, 56); lv_obj_t * confirm = fg_system_create_button(dialog, "Delete Folder", 285, 240, 235, 56);
    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_delete_folder_text = NULL; fg_system_storage_delete_folder_input = NULL; fg_system_storage_delete_folder_error = NULL; return false; }
    lv_obj_add_event_cb(cancel, fg_system_storage_delete_folder_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_delete_folder_confirm_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_delete_folder_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;
}

static bool fg_system_storage_create_page(void)
{
    if (fg_system_storage_initialized) return fg_system_storage_page != NULL;
    fg_system_storage_page = lv_obj_create(fg_system_root);
    if (!fg_system_storage_page) return false;
    lv_obj_set_size(fg_system_storage_page, 1024, 600);
    lv_obj_set_style_bg_color(fg_system_storage_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_system_storage_page, LV_OPA_COVER, 0);
    lv_obj_set_style_border_width(fg_system_storage_page, 0, 0);
    lv_obj_clear_flag(fg_system_storage_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_t * back = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Back", 20, 14, 128, 54);
    if (!back) goto unavailable;
    lv_obj_add_event_cb(back, fg_system_storage_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * title = lv_label_create(fg_system_storage_page);
    if (!title) goto unavailable;
    lv_label_set_text(title, "SD Card"); lv_obj_set_style_text_color(title, lv_color_hex(0xF3F4F6), 0); lv_obj_set_style_text_font(title, &lv_font_montserrat_32, 0); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 24);
    fg_system_storage_summary = lv_label_create(fg_system_storage_page);
    if (!fg_system_storage_summary) goto unavailable;
    lv_obj_set_pos(fg_system_storage_summary, 28, 96); lv_obj_set_width(fg_system_storage_summary, 350); lv_obj_set_style_text_color(fg_system_storage_summary, lv_color_hex(0xF3F4F6), 0);
    lv_label_set_text(fg_system_storage_summary, "Storage starting...");
    fg_system_storage_refresh_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_REFRESH " Refresh", 28, 220, 165, 50);
    if (!fg_system_storage_refresh_button) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_refresh_button, fg_system_storage_refresh_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_test_button = fg_system_create_button(fg_system_storage_page, "Run R/W Test", 210, 220, 165, 50);
    if (!fg_system_storage_test_button) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_test_button, fg_system_storage_test_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_select_folder_button = fg_system_create_button(fg_system_storage_page, "Select Item", 28, 292, 165, 52);
    if (!fg_system_storage_select_folder_button) goto unavailable;
    fg_system_storage_select_folder_label = lv_obj_get_child(fg_system_storage_select_folder_button, 0);
    if (!fg_system_storage_select_folder_label) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_select_folder_button, fg_system_storage_select_folder_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_delete_folder_button = fg_system_create_button(fg_system_storage_page, "Delete Folder", 210, 292, 165, 52);
    if (!fg_system_storage_delete_folder_button) goto unavailable;
    fg_system_storage_delete_folder_label = lv_obj_get_child(fg_system_storage_delete_folder_button, 0);
    if (!fg_system_storage_delete_folder_label) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_delete_folder_button, fg_system_storage_delete_folder_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);
    fg_system_storage_parent_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_UP " Parent", 410, 78, 135, 48);
    if (!fg_system_storage_parent_button) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_parent_button, fg_system_storage_parent_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);
    fg_system_storage_path = lv_label_create(fg_system_storage_page);
    if (!fg_system_storage_path) goto unavailable;
    lv_label_set_text(fg_system_storage_path, "/sdcard"); lv_obj_set_pos(fg_system_storage_path, 565, 92); lv_obj_set_style_text_color(fg_system_storage_path, lv_color_hex(0x9CA3AF), 0);
    fg_system_storage_list = lv_obj_create(fg_system_storage_page);
    if (!fg_system_storage_list) goto unavailable;
    lv_obj_set_pos(fg_system_storage_list, 400, 135); lv_obj_set_size(fg_system_storage_list, 600, 390); lv_obj_set_flex_flow(fg_system_storage_list, LV_FLEX_FLOW_COLUMN); lv_obj_set_style_pad_all(fg_system_storage_list, 6, 0); lv_obj_set_style_pad_gap(fg_system_storage_list, 5, 0);
    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) {
        fg_system_storage_rows[i] = lv_button_create(fg_system_storage_list);
        if (!fg_system_storage_rows[i]) goto unavailable;
        lv_obj_set_size(fg_system_storage_rows[i], LV_PCT(100), 40); lv_obj_set_flex_grow(fg_system_storage_rows[i], 0);
        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(0x4B5563), LV_STATE_DEFAULT); lv_obj_set_style_border_color(fg_system_storage_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_DEFAULT);
        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_CHECKED); lv_obj_set_style_text_color(fg_system_storage_rows[i], lv_color_hex(0x1F2937), LV_STATE_CHECKED);
        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_PRESSED); lv_obj_set_style_border_color(fg_system_storage_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_FOCUSED); lv_obj_set_style_opa(fg_system_storage_rows[i], LV_OPA_40, LV_STATE_DISABLED);
        fg_system_storage_row_metadata[i].visible_row = i; fg_system_storage_row_metadata[i].valid = false;
        lv_obj_add_event_cb(fg_system_storage_rows[i], fg_system_storage_row_cb, LV_EVENT_CLICKED, &fg_system_storage_row_metadata[i]);
        fg_system_storage_row_labels[i] = lv_label_create(fg_system_storage_rows[i]);
        if (!fg_system_storage_row_labels[i]) goto unavailable;
        lv_obj_align(fg_system_storage_row_labels[i], LV_ALIGN_LEFT_MID, 4, 0); lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);
    }
    fg_system_storage_empty = lv_label_create(fg_system_storage_list);
    if (!fg_system_storage_empty) goto unavailable;
    lv_label_set_text(fg_system_storage_empty, "This folder is empty"); lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_FLOATING | LV_OBJ_FLAG_HIDDEN); lv_obj_center(fg_system_storage_empty);
    fg_system_storage_previous_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Previous", 410, 536, 170, 48);
    if (!fg_system_storage_previous_button) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_previous_button, fg_system_storage_previous_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_previous_button, LV_STATE_DISABLED);
    fg_system_storage_next_button = fg_system_create_button(fg_system_storage_page, "Next " LV_SYMBOL_RIGHT, 810, 536, 170, 48);
    if (!fg_system_storage_next_button) goto unavailable;
    lv_obj_add_event_cb(fg_system_storage_next_button, fg_system_storage_next_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_next_button, LV_STATE_DISABLED);
    fg_system_storage_initialized = true;
    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);
    return true;
unavailable:
    fg_system_storage_initialized = true; fg_system_storage_available = false;
    if (fg_system_storage_summary) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\nUse Back to return to System");
    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);
    return true;
}

static void fg_system_create_disabled_card(lv_obj_t * parent, const char * text, int32_t x, int32_t y)
{
    lv_obj_t * card = lv_obj_create(parent);
    lv_obj_set_pos(card, x, y);
    lv_obj_set_size(card, 220, 180);
    lv_obj_clear_flag(card, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(card, 12, 0);
    lv_obj_set_style_bg_color(card, lv_color_hex(0x374151), 0);
    lv_obj_set_style_bg_opa(card, LV_OPA_50, 0);
    lv_obj_set_style_border_color(card, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_border_width(card, 1, 0);
    lv_obj_t * label = lv_label_create(card);
    lv_label_set_text(label, text);
    lv_obj_set_style_text_color(label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(label, LV_OPA_60, 0);
    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(label);
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

static const char * fg_wifi_signal_quality(int rssi)
{
    if (rssi >= -55) return "Excellent";
    if (rssi >= -67) return "Good";
    if (rssi >= -75) return "Fair";
    return "Weak";
}

static void fg_wifi_tick_cb(lv_timer_t *timer)
{
    LV_UNUSED(timer);

    fg_wifi_pump();

    if (fg_system_wifi_password_dialog &&
        !lv_obj_has_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN)) return;

    if (fg_wifi_label) {
        char wifi_buf[128];
        snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\n%s\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());
        lv_label_set_text(fg_wifi_label, wifi_buf);
    }

    if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;
    fg_wifi_snapshot_t snapshot;
    if (fg_wifi_get_snapshot(&snapshot) != FG_WIFI_OP_OK) return;
    const char * state_text = "Wi-Fi Off";
    switch (snapshot.state) {
        case FG_WIFI_STATE_INIT: state_text = "Turning On"; break;
        case FG_WIFI_STATE_READY: state_text = "Ready"; break;
        case FG_WIFI_STATE_CONNECTING: state_text = "Connecting"; break;
        case FG_WIFI_STATE_CONNECTED: state_text = "Connected"; break;
        case FG_WIFI_STATE_DISCONNECTING: state_text = "Disconnecting"; break;
        case FG_WIFI_STATE_DISCONNECTED: state_text = "Disconnected"; break;
        case FG_WIFI_STATE_SCANNING: state_text = "Scanning"; break;
        case FG_WIFI_STATE_ERROR: state_text = "Failed"; break;
        default: break;
    }
    if (fg_system_wifi_state_label) lv_label_set_text(fg_system_wifi_state_label, state_text);
    const char * empty = "--";
    // Browser parity fields formerly combined as "Current network     %s", "IP address          %s", and "Gateway             %s".
    if (fg_system_wifi_ssid_label) lv_label_set_text(fg_system_wifi_ssid_label, snapshot.connected && snapshot.ssid[0] ? snapshot.ssid : empty);
    if (fg_system_wifi_ip_label) lv_label_set_text(fg_system_wifi_ip_label, snapshot.connected && snapshot.ip[0] ? snapshot.ip : empty);
    if (fg_system_wifi_gateway_label) lv_label_set_text(fg_system_wifi_gateway_label, snapshot.connected && snapshot.gateway[0] ? snapshot.gateway : empty);
    if (fg_system_wifi_rssi_label) {
        // Browser parity format: "Signal              %d dBm - %s".
        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_rssi_label, "%d dBm - %s", snapshot.rssi, fg_wifi_signal_quality(snapshot.rssi));
        else lv_label_set_text(fg_system_wifi_rssi_label, empty);
    }
    // Browser parity formats: "Security            %s" and "Status              %s%s%s".
    if (fg_system_wifi_security_label) lv_label_set_text(fg_system_wifi_security_label, snapshot.connected ? fg_wifi_security_text(snapshot.security) : empty);
    if (fg_system_wifi_raw_label) lv_label_set_text_fmt(fg_system_wifi_raw_label, "%s%s%s", fg_wifi_status_text(), snapshot.error_reason[0] ? " - " : "", snapshot.error_reason);
    if (fg_system_wifi_details_label) {
        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %02X:%02X:%02X:%02X:%02X:%02X\nAP BSSID     %02X:%02X:%02X:%02X:%02X:%02X", snapshot.station_mac[0], snapshot.station_mac[1], snapshot.station_mac[2], snapshot.station_mac[3], snapshot.station_mac[4], snapshot.station_mac[5], snapshot.ap_bssid[0], snapshot.ap_bssid[1], snapshot.ap_bssid[2], snapshot.ap_bssid[3], snapshot.ap_bssid[4], snapshot.ap_bssid[5]);
        else lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %s\nAP BSSID     %s", empty, empty);
    }
    if (fg_system_wifi_scan_label) lv_label_set_text(fg_system_wifi_scan_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "Available Networks");
    if (snapshot.scan_in_progress) lv_obj_add_state(fg_system_wifi_scan_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_wifi_scan_button, LV_STATE_DISABLED);
    if (snapshot.connected || snapshot.state == FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED);
    if (snapshot.ready && snapshot.state != FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED);
    if (snapshot.saved) lv_obj_clear_state(fg_system_wifi_forget_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_forget_button, LV_STATE_DISABLED);
    fg_system_wifi_network_count = fg_wifi_get_networks(fg_system_wifi_networks, FG_WIFI_MAX_SCAN);
    if (fg_system_wifi_network_empty_label) {
        lv_label_set_text(fg_system_wifi_network_empty_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "No Wi-Fi networks found");
        if (fg_system_wifi_network_count == 0) lv_obj_clear_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);
        else lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);
    }
    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {
        if (i >= fg_system_wifi_network_count) { lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN); continue; }
        fg_wifi_network_t * network = &fg_system_wifi_networks[i];
        lv_obj_clear_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);
        lv_label_set_text_fmt(fg_system_wifi_network_labels[i], "%s%s  %s  %d dBm%s%s", network->security == FG_WIFI_SECURITY_OPEN ? "" : LV_SYMBOL_CHARGE " ", network->ssid, fg_wifi_security_text(network->security), network->rssi, network->connected ? "  [Connected]" : "", network->saved ? "  [Saved]" : "");
        if (i == fg_system_wifi_selected) lv_obj_add_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);
        else lv_obj_clear_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);
    }
    lv_obj_update_layout(fg_system_wifi_network_container);
}

// ForgeUI LVGL Export Proof V1
// Generated from ForgeUI Studio

void fg_studio_export_create(lv_obj_t *parent)
{
    fg_system_root = parent;
    // Background flavour: Brushed Steel
    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);
    lv_obj_set_style_bg_color(parent, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);

    fg_application_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_application_page, 0, 0);
    lv_obj_set_size(fg_application_page, 1024, 600);
    lv_obj_clear_flag(fg_application_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_application_page, 0, 0);
    lv_obj_set_style_border_width(fg_application_page, 0, 0);
    lv_obj_set_style_radius(fg_application_page, 0, 0);
    lv_obj_set_style_bg_color(fg_application_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_application_page, LV_OPA_COVER, 0);

    LV_IMAGE_DECLARE(fg_upload_ai_hero_1785206260441_e3931145);
    lv_obj_t * bg_texture_0 = lv_image_create(fg_application_page);
    lv_image_set_src(bg_texture_0, &fg_upload_ai_hero_1785206260441_e3931145);
    lv_obj_set_pos(bg_texture_0, 0, 0);
    lv_obj_set_size(bg_texture_0, 1024, 600);
    lv_obj_move_background(bg_texture_0);


    lv_obj_t * system_gear = fg_system_create_button(fg_application_page, LV_SYMBOL_SETTINGS, 922, 18, 84, 84);
    lv_obj_t * system_gear_label = lv_obj_get_child(system_gear, 0);
    lv_obj_set_style_text_font(system_gear_label, &lv_font_montserrat_48, 0);
    lv_obj_add_event_cb(system_gear, fg_system_open_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_move_foreground(system_gear);

    fg_system_launcher_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_launcher_page, 0, 0);
    lv_obj_set_size(fg_system_launcher_page, 1024, 600);
    lv_obj_clear_flag(fg_system_launcher_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_radius(fg_system_launcher_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_launcher_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_system_launcher_page, LV_OPA_COVER, 0);

    lv_obj_t * system_back = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(system_back, fg_system_close_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * system_title = lv_label_create(fg_system_launcher_page);
    lv_label_set_text(system_title, "System");
    lv_obj_set_style_text_color(system_title, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_font(system_title, &lv_font_montserrat_32, 0);
    lv_obj_align(system_title, LV_ALIGN_TOP_MID, 0, 25);

    lv_obj_t * display_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_EYE_OPEN "\nDisplay", 42, 102, 220, 180);
    lv_obj_add_event_cb(display_card, fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * wifi_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_WIFI "\nWi-Fi", 282, 102, 220, 180);
    lv_obj_add_event_cb(wifi_card, fg_system_open_wifi_cb, LV_EVENT_CLICKED, NULL);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_BLUETOOTH "\nBluetooth\nComing Later", 522, 102);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_VOLUME_MAX "\nSound\nComing Later", 762, 102);
    lv_obj_t * storage_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_SD_CARD "\nStorage", 42, 302, 220, 180);
    lv_obj_add_event_cb(storage_card, fg_system_open_storage_cb, LV_EVENT_CLICKED, NULL);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_HOME "\nDevice\nComing Later", 282, 302);
    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_WARNING "\nDiagnostics\nComing Later", 522, 302);
    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);

#if 0 /* Legacy eager Storage construction retained only as migration reference. */
    fg_system_storage_page = lv_obj_create(parent);
    lv_obj_set_size(fg_system_storage_page, 1024, 600);
    lv_obj_set_style_bg_color(fg_system_storage_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_system_storage_page, LV_OPA_COVER, 0);
    lv_obj_set_style_border_width(fg_system_storage_page, 0, 0);
    lv_obj_clear_flag(fg_system_storage_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_t * storage_back = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Back", 20, 14, 128, 54);
    lv_obj_add_event_cb(storage_back, fg_system_storage_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * storage_title = lv_label_create(fg_system_storage_page);
    lv_label_set_text(storage_title, "SD Card");
    lv_obj_set_style_text_color(storage_title, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_font(storage_title, &lv_font_montserrat_32, 0);
    lv_obj_align(storage_title, LV_ALIGN_TOP_MID, 0, 24);
    fg_system_storage_summary = lv_label_create(fg_system_storage_page);
    lv_obj_set_pos(fg_system_storage_summary, 28, 88);
    lv_obj_set_width(fg_system_storage_summary, 350);
    lv_obj_set_style_text_color(fg_system_storage_summary, lv_color_hex(0xF3F4F6), 0);
    fg_system_storage_refresh_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_REFRESH " Refresh", 28, 205, 165, 50);
    lv_obj_add_event_cb(fg_system_storage_refresh_button, fg_system_storage_refresh_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_mount_button = fg_system_create_button(fg_system_storage_page, "Mount", 210, 205, 165, 50);
    lv_obj_add_event_cb(fg_system_storage_mount_button, fg_system_storage_mount_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_unmount_button = fg_system_create_button(fg_system_storage_page, "Unmount", 28, 270, 165, 50);
    lv_obj_add_event_cb(fg_system_storage_unmount_button, fg_system_storage_unmount_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_test_button = fg_system_create_button(fg_system_storage_page, "Run R/W Test", 210, 270, 165, 50);
    lv_obj_add_event_cb(fg_system_storage_test_button, fg_system_storage_test_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_format_button = fg_system_create_button(fg_system_storage_page, "Format SD Card", 28, 335, 347, 50);
    lv_obj_add_event_cb(fg_system_storage_format_button, fg_system_storage_format_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_path = lv_label_create(fg_system_storage_page);
    lv_label_set_text(fg_system_storage_path, "/");
    lv_obj_set_pos(fg_system_storage_path, 410, 92);
    lv_obj_set_style_text_color(fg_system_storage_path, lv_color_hex(0x9CA3AF), 0);
    fg_system_storage_parent_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_UP " Parent", 410, 78, 135, 48);
    lv_obj_add_event_cb(fg_system_storage_parent_button, fg_system_storage_parent_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);
    fg_system_storage_new_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_PLUS " New Folder", 800, 78, 190, 48);
    lv_obj_add_event_cb(fg_system_storage_new_button, fg_system_storage_new_folder_cb, LV_EVENT_CLICKED, NULL);
    fg_system_storage_list = lv_obj_create(fg_system_storage_page);
    lv_obj_set_pos(fg_system_storage_list, 400, 135); lv_obj_set_size(fg_system_storage_list, 600, 390);
    lv_obj_set_flex_flow(fg_system_storage_list, LV_FLEX_FLOW_COLUMN); lv_obj_set_style_pad_all(fg_system_storage_list, 6, 0); lv_obj_set_style_pad_gap(fg_system_storage_list, 5, 0);
    lv_obj_set_style_bg_color(fg_system_storage_list, lv_color_hex(0x374151), 0); lv_obj_set_style_border_color(fg_system_storage_list, lv_color_hex(0x9CA3AF), 0);
    static lv_style_t storage_row_default_style, storage_row_active_style, storage_row_disabled_style;
    static bool storage_row_styles_ready = false;
    if (!storage_row_styles_ready) {
        lv_style_init(&storage_row_default_style); lv_style_set_bg_color(&storage_row_default_style, lv_color_hex(0x4B5563)); lv_style_set_border_color(&storage_row_default_style, lv_color_hex(0x9CA3AF)); lv_style_set_text_color(&storage_row_default_style, lv_color_hex(0xF3F4F6));
        lv_style_init(&storage_row_active_style); lv_style_set_bg_color(&storage_row_active_style, lv_color_hex(0x9CA3AF)); lv_style_set_text_color(&storage_row_active_style, lv_color_hex(0x1F2937));
        lv_style_init(&storage_row_disabled_style); lv_style_set_bg_color(&storage_row_disabled_style, lv_color_hex(0x4B5563)); lv_style_set_text_color(&storage_row_disabled_style, lv_color_hex(0xF3F4F6)); lv_style_set_opa(&storage_row_disabled_style, LV_OPA_40);
        storage_row_styles_ready = true;
    }
    for (int i = 0; i < FG_SD_MAX_ENTRIES; ++i) {
        fg_system_storage_rows[i] = lv_button_create(fg_system_storage_list);
        lv_obj_set_size(fg_system_storage_rows[i], LV_PCT(100), 46); lv_obj_set_flex_grow(fg_system_storage_rows[i], 0);
        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_default_style, LV_STATE_DEFAULT);
        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_active_style, LV_STATE_PRESSED | LV_STATE_CHECKED);
        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_disabled_style, LV_STATE_DISABLED);
        lv_obj_add_event_cb(fg_system_storage_rows[i], fg_system_storage_row_cb, LV_EVENT_CLICKED, (void *)(intptr_t)i);
        fg_system_storage_row_labels[i] = lv_label_create(fg_system_storage_rows[i]);
        lv_obj_align(fg_system_storage_row_labels[i], LV_ALIGN_LEFT_MID, 4, 0);
        lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);
    }
    fg_system_storage_empty = lv_label_create(fg_system_storage_list);
    lv_label_set_text(fg_system_storage_empty, "This folder is empty");
    lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_FLOATING); lv_obj_center(fg_system_storage_empty);
    lv_obj_set_style_text_color(fg_system_storage_empty, lv_color_hex(0xF3F4F6), 0);
    lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN);
    fg_system_storage_rename_button = fg_system_create_button(fg_system_storage_page, "Rename", 410, 536, 150, 48);
    lv_obj_add_event_cb(fg_system_storage_rename_button, fg_system_storage_rename_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_state(fg_system_storage_rename_button, LV_STATE_DISABLED);
    fg_system_storage_delete_button = fg_system_create_button(fg_system_storage_page, "Delete", 575, 536, 150, 48);
    lv_obj_add_event_cb(fg_system_storage_delete_button, fg_system_storage_delete_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_state(fg_system_storage_delete_button, LV_STATE_DISABLED);
    fg_system_storage_name_dialog = lv_obj_create(parent);
    lv_obj_set_size(fg_system_storage_name_dialog, 520, 260);
    lv_obj_center(fg_system_storage_name_dialog);
    fg_system_storage_name_title = lv_label_create(fg_system_storage_name_dialog);
    lv_obj_align(fg_system_storage_name_title, LV_ALIGN_TOP_MID, 0, 8);
    fg_system_storage_name_input = lv_textarea_create(fg_system_storage_name_dialog);
    lv_obj_set_size(fg_system_storage_name_input, 450, 58);
    lv_obj_align(fg_system_storage_name_input, LV_ALIGN_TOP_MID, 0, 45);
    lv_textarea_set_one_line(fg_system_storage_name_input, true);
    lv_textarea_set_max_length(fg_system_storage_name_input, FG_SD_MAX_NAME - 1);
    lv_obj_add_event_cb(fg_system_storage_name_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    fg_system_storage_name_error = lv_label_create(fg_system_storage_name_dialog);
    lv_obj_set_width(fg_system_storage_name_error, 450); lv_obj_align(fg_system_storage_name_error, LV_ALIGN_TOP_MID, 0, 110);
    lv_obj_set_style_text_color(fg_system_storage_name_error, lv_color_hex(0xEF4444), 0);
    lv_obj_t * storage_name_cancel = fg_system_create_button(fg_system_storage_name_dialog, "Cancel", 30, 165, 210, 52);
    lv_obj_add_event_cb(storage_name_cancel, fg_system_storage_name_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * storage_name_save = fg_system_create_button(fg_system_storage_name_dialog, "Save", 255, 165, 210, 52);
    lv_obj_add_event_cb(storage_name_save, fg_system_storage_name_commit_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_system_storage_delete_dialog = lv_obj_create(parent);
    lv_obj_set_size(fg_system_storage_delete_dialog, 540, 230); lv_obj_center(fg_system_storage_delete_dialog);
    fg_system_storage_delete_text = lv_label_create(fg_system_storage_delete_dialog); lv_obj_set_width(fg_system_storage_delete_text, 470); lv_obj_align(fg_system_storage_delete_text, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * storage_delete_cancel = fg_system_create_button(fg_system_storage_delete_dialog, "Cancel", 30, 135, 220, 56);
    lv_obj_add_event_cb(storage_delete_cancel, fg_system_storage_delete_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * storage_delete_confirm = fg_system_create_button(fg_system_storage_delete_dialog, "Confirm Delete", 270, 135, 220, 56);
    lv_obj_add_event_cb(storage_delete_confirm, fg_system_storage_delete_confirm_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN);
    fg_system_storage_format_dialog = lv_obj_create(parent);
    lv_obj_set_size(fg_system_storage_format_dialog, 570, 300); lv_obj_center(fg_system_storage_format_dialog);
    lv_obj_t * format_title = lv_label_create(fg_system_storage_format_dialog); lv_label_set_text(format_title, "FORMAT SD CARD"); lv_obj_align(format_title, LV_ALIGN_TOP_MID, 0, 8);
    fg_system_storage_format_error = lv_label_create(fg_system_storage_format_dialog); lv_obj_set_width(fg_system_storage_format_error, 500); lv_obj_align(fg_system_storage_format_error, LV_ALIGN_TOP_MID, 0, 45);
    lv_obj_set_style_text_color(fg_system_storage_format_error, lv_color_hex(0xEF4444), 0);
    fg_system_storage_format_input = lv_textarea_create(fg_system_storage_format_dialog); lv_obj_set_size(fg_system_storage_format_input, 480, 58); lv_obj_align(fg_system_storage_format_input, LV_ALIGN_TOP_MID, 0, 105);
    lv_textarea_set_one_line(fg_system_storage_format_input, true); lv_textarea_set_max_length(fg_system_storage_format_input, 6);
    lv_obj_add_event_cb(fg_system_storage_format_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    lv_obj_t * format_cancel = fg_system_create_button(fg_system_storage_format_dialog, "Cancel", 35, 205, 225, 55);
    lv_obj_add_event_cb(format_cancel, fg_system_storage_format_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * format_confirm = fg_system_create_button(fg_system_storage_format_dialog, "Erase and Format", 275, 205, 225, 55);
    lv_obj_add_event_cb(format_confirm, fg_system_storage_format_confirm_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN);
    if (!fg_system_storage_mutex) fg_system_storage_mutex = xSemaphoreCreateMutex();
    if (!fg_system_storage_queue) fg_system_storage_queue = xQueueCreate(1, sizeof(fg_storage_request_t));
    if (fg_system_storage_mutex && fg_system_storage_queue && !fg_system_storage_task) (void)xTaskCreate(fg_system_storage_worker, "fg_sd_worker", 8192, NULL, 5, &fg_system_storage_task);
    if (fg_system_storage_task && !fg_system_storage_timer) fg_system_storage_timer = lv_timer_create(fg_system_storage_tick_cb, 100, NULL);
    fg_system_storage_available = fg_system_storage_mutex && fg_system_storage_queue && fg_system_storage_task && fg_system_storage_timer;
    if (!fg_system_storage_available) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\nSystem runtime remains operational");
    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);

#endif
    fg_system_wifi_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_wifi_page, 0, 0);
    lv_obj_set_size(fg_system_wifi_page, 1024, 600);
    lv_obj_clear_flag(fg_system_wifi_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_radius(fg_system_wifi_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_system_wifi_page, LV_OPA_COVER, 0);

    lv_obj_t * wifi_back = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(wifi_back, fg_system_wifi_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * wifi_title = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(wifi_title, LV_SYMBOL_WIFI "  Wi-Fi");
    lv_obj_set_style_text_color(wifi_title, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_font(wifi_title, &lv_font_montserrat_32, 0);
    lv_obj_align(wifi_title, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * wifi_refresh = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_REFRESH "  Refresh", 822, 14, 174, 58);
    lv_obj_add_event_cb(wifi_refresh, fg_system_wifi_refresh_cb, LV_EVENT_CLICKED, NULL);

    lv_obj_t * wifi_status_panel = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(wifi_status_panel, 28, 96);
    lv_obj_set_size(wifi_status_panel, 440, 248);
    lv_obj_clear_flag(wifi_status_panel, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(wifi_status_panel, 12, 0);
    lv_obj_set_style_bg_color(wifi_status_panel, lv_color_hex(0x374151), 0);
    lv_obj_set_style_border_color(wifi_status_panel, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_border_width(wifi_status_panel, 1, 0);
    fg_system_wifi_state_label = lv_label_create(wifi_status_panel);
    lv_label_set_text(fg_system_wifi_state_label, "Off");
    lv_obj_set_pos(fg_system_wifi_state_label, 14, 10);
    lv_obj_set_style_text_color(fg_system_wifi_state_label, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_text_font(fg_system_wifi_state_label, &lv_font_montserrat_28, 0);
    lv_obj_t * wifi_ssid_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_ssid_caption, "Current Network");
    lv_obj_set_pos(wifi_ssid_caption, 14, 54);
    lv_obj_set_style_text_color(wifi_ssid_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_ssid_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_ssid_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_ssid_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ssid_label, 14, 74);
    lv_obj_set_width(fg_system_wifi_ssid_label, 190);
    lv_label_set_long_mode(fg_system_wifi_ssid_label, LV_LABEL_LONG_DOT);
    lv_obj_set_style_text_color(fg_system_wifi_ssid_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_ssid_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_ssid_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_ip_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_ip_caption, "IP Address");
    lv_obj_set_pos(wifi_ip_caption, 220, 54);
    lv_obj_set_style_text_color(wifi_ip_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_ip_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_ip_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_ip_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_ip_label, 220, 74);
    lv_obj_set_style_text_color(fg_system_wifi_ip_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_ip_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_ip_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_gateway_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_gateway_caption, "Gateway");
    lv_obj_set_pos(wifi_gateway_caption, 14, 116);
    lv_obj_set_style_text_color(wifi_gateway_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_gateway_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_gateway_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_gateway_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_gateway_label, 14, 136);
    lv_obj_set_style_text_color(fg_system_wifi_gateway_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_gateway_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_gateway_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_signal_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_signal_caption, "Signal");
    lv_obj_set_pos(wifi_signal_caption, 220, 116);
    lv_obj_set_style_text_color(wifi_signal_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_signal_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_signal_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_rssi_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_rssi_label, 220, 136);
    lv_obj_set_style_text_color(fg_system_wifi_rssi_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_rssi_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_rssi_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_security_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_security_caption, "Security");
    lv_obj_set_pos(wifi_security_caption, 14, 178);
    lv_obj_set_style_text_color(wifi_security_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_security_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_security_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_security_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_security_label, 14, 198);
    lv_obj_set_style_text_color(fg_system_wifi_security_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_security_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_security_label, &lv_font_montserrat_16, 0);
    lv_obj_t * wifi_status_caption = lv_label_create(wifi_status_panel);
    lv_label_set_text(wifi_status_caption, "Status");
    lv_obj_set_pos(wifi_status_caption, 220, 178);
    lv_obj_set_style_text_color(wifi_status_caption, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_status_caption, LV_OPA_60, 0);
    lv_obj_set_style_text_font(wifi_status_caption, &lv_font_montserrat_12, 0);
    fg_system_wifi_raw_label = lv_label_create(wifi_status_panel);
    lv_obj_set_pos(fg_system_wifi_raw_label, 220, 198);
    lv_obj_set_width(fg_system_wifi_raw_label, 190);
    lv_label_set_long_mode(fg_system_wifi_raw_label, LV_LABEL_LONG_DOT);
    lv_obj_set_style_text_color(fg_system_wifi_raw_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_raw_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_raw_label, &lv_font_montserrat_16, 0);

    fg_system_wifi_scan_button = fg_system_create_button(fg_system_wifi_page, "Scan", 28, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_scan_button, fg_system_wifi_scan_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_disconnect_button = fg_system_create_button(fg_system_wifi_page, "Disconnect", 136, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_disconnect_button, fg_system_wifi_disconnect_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_reconnect_button = fg_system_create_button(fg_system_wifi_page, "Reconnect", 244, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_reconnect_button, fg_system_wifi_reconnect_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_forget_button = fg_system_create_button(fg_system_wifi_page, "Forget", 352, 360, 96, 44);
    lv_obj_add_event_cb(fg_system_wifi_forget_button, fg_system_wifi_forget_request_cb, LV_EVENT_CLICKED, NULL);

    fg_system_wifi_details_card = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(fg_system_wifi_details_card, 28, 420);
    lv_obj_set_size(fg_system_wifi_details_card, 440, 144);
    lv_obj_clear_flag(fg_system_wifi_details_card, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_radius(fg_system_wifi_details_card, 12, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_details_card, lv_color_hex(0x374151), 0);
    lv_obj_set_style_border_color(fg_system_wifi_details_card, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_border_width(fg_system_wifi_details_card, 1, 0);
    lv_obj_t * wifi_details_title = lv_label_create(fg_system_wifi_details_card);
    lv_label_set_text(wifi_details_title, "Connected Network");
    lv_obj_set_pos(wifi_details_title, 14, 10);
    lv_obj_set_style_text_color(wifi_details_title, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(wifi_details_title, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(wifi_details_title, &lv_font_montserrat_16, 0);
    fg_system_wifi_details_label = lv_label_create(fg_system_wifi_details_card);
    lv_obj_set_pos(fg_system_wifi_details_label, 14, 44);
    lv_obj_set_style_text_color(fg_system_wifi_details_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_details_label, LV_OPA_COVER, 0);
    lv_obj_set_style_text_font(fg_system_wifi_details_label, &lv_font_montserrat_14, 0);

    fg_system_wifi_scan_label = lv_label_create(fg_system_wifi_page);
    lv_label_set_text(fg_system_wifi_scan_label, "Available Networks");
    lv_obj_set_pos(fg_system_wifi_scan_label, 500, 100);
    lv_obj_set_style_text_font(fg_system_wifi_scan_label, &lv_font_montserrat_20, 0);
    fg_system_wifi_network_container = lv_obj_create(fg_system_wifi_page);
    lv_obj_set_pos(fg_system_wifi_network_container, 490, 136);
    lv_obj_set_size(fg_system_wifi_network_container, 506, 416);
    lv_obj_set_style_radius(fg_system_wifi_network_container, 12, 0);
    lv_obj_set_style_bg_color(fg_system_wifi_network_container, lv_color_hex(0x374151), 0);
    lv_obj_set_style_border_color(fg_system_wifi_network_container, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_border_width(fg_system_wifi_network_container, 1, 0);
    lv_obj_set_flex_flow(fg_system_wifi_network_container, LV_FLEX_FLOW_COLUMN);
    lv_obj_set_style_pad_all(fg_system_wifi_network_container, 8, 0);
    lv_obj_set_style_pad_gap(fg_system_wifi_network_container, 6, 0);
    fg_system_wifi_network_empty_label = lv_label_create(fg_system_wifi_network_container);
    lv_label_set_text(fg_system_wifi_network_empty_label, "No Wi-Fi networks found");
    lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_FLOATING);
    lv_obj_set_style_text_color(fg_system_wifi_network_empty_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_opa(fg_system_wifi_network_empty_label, LV_OPA_70, 0);
    lv_obj_set_style_text_align(fg_system_wifi_network_empty_label, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_center(fg_system_wifi_network_empty_label);
    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {
        fg_system_wifi_network_rows[i] = lv_button_create(fg_system_wifi_network_container);
        lv_obj_set_size(fg_system_wifi_network_rows[i], LV_PCT(100), 48);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x4B5563), 0);
        lv_obj_set_style_bg_opa(fg_system_wifi_network_rows[i], LV_OPA_COVER, 0);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), 0);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 1, 0);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF3F4F6), 0);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_PRESSED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_PRESSED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0x1F2937), LV_STATE_PRESSED);
        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_80, LV_STATE_PRESSED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x374151), LV_STATE_FOCUSED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_FOCUSED);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUSED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF3F4F6), LV_STATE_FOCUSED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x374151), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUS_KEY);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF3F4F6), LV_STATE_FOCUS_KEY);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_CHECKED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_CHECKED);
        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 3, LV_STATE_CHECKED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0x1F2937), LV_STATE_CHECKED);
        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x4B5563), LV_STATE_DISABLED);
        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(0x9CA3AF), LV_STATE_DISABLED);
        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(0xF3F4F6), LV_STATE_DISABLED);
        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_40, LV_STATE_DISABLED);
        lv_obj_add_event_cb(fg_system_wifi_network_rows[i], fg_system_wifi_network_cb, LV_EVENT_CLICKED, (void *)(intptr_t)i);
        fg_system_wifi_network_labels[i] = lv_label_create(fg_system_wifi_network_rows[i]);
        lv_obj_center(fg_system_wifi_network_labels[i]);
        lv_obj_set_width(fg_system_wifi_network_labels[i], 450);
        lv_label_set_long_mode(fg_system_wifi_network_labels[i], LV_LABEL_LONG_DOT);
        lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);
    }
    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);

    fg_system_wifi_password_dialog = lv_obj_create(parent);
    lv_obj_set_size(fg_system_wifi_password_dialog, 560, 330);
    lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);
    lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);
    fg_system_wifi_password_title = lv_label_create(fg_system_wifi_password_dialog);
    lv_label_set_text(fg_system_wifi_password_title, "Enter Wi-Fi Password");
    lv_obj_align(fg_system_wifi_password_title, LV_ALIGN_TOP_MID, 0, 12);
    fg_system_wifi_password_input = lv_textarea_create(fg_system_wifi_password_dialog);
    lv_obj_set_size(fg_system_wifi_password_input, 470, 60);
    lv_obj_align(fg_system_wifi_password_input, LV_ALIGN_TOP_MID, 0, 65);
    lv_textarea_set_one_line(fg_system_wifi_password_input, true);
    lv_textarea_set_password_mode(fg_system_wifi_password_input, true);
    lv_textarea_set_max_length(fg_system_wifi_password_input, 63);
    lv_textarea_set_placeholder_text(fg_system_wifi_password_input, "8 to 63 characters");
    lv_obj_add_flag(fg_system_wifi_password_input, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);
    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);
    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_CLICKED, NULL);
    fg_system_wifi_password_error = lv_label_create(fg_system_wifi_password_dialog);
    lv_label_set_text(fg_system_wifi_password_error, "");
    lv_obj_set_style_text_color(fg_system_wifi_password_error, lv_color_hex(0xEF4444), 0);
    lv_obj_align(fg_system_wifi_password_error, LV_ALIGN_TOP_MID, 0, 128);
    lv_obj_t * password_show = fg_system_create_button(fg_system_wifi_password_dialog, "Show / Hide", 36, 145, 150, 50);
    lv_obj_add_event_cb(password_show, fg_system_wifi_password_show_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_remember = fg_system_create_button(fg_system_wifi_password_dialog, LV_SYMBOL_OK " Remember password", 196, 145, 310, 50);
    lv_obj_add_event_cb(password_remember, fg_system_wifi_remember_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_cancel = fg_system_create_button(fg_system_wifi_password_dialog, "Cancel", 36, 220, 220, 58);
    lv_obj_add_event_cb(password_cancel, fg_system_wifi_password_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * password_connect = fg_system_create_button(fg_system_wifi_password_dialog, "Connect", 276, 220, 230, 58);
    lv_obj_add_event_cb(password_connect, fg_system_wifi_password_connect_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);

    fg_system_wifi_forget_dialog = lv_obj_create(parent);
    lv_obj_set_size(fg_system_wifi_forget_dialog, 540, 240);
    lv_obj_center(fg_system_wifi_forget_dialog);
    lv_obj_t * forget_text = lv_label_create(fg_system_wifi_forget_dialog);
    lv_label_set_text(forget_text, "Forget saved Wi-Fi credentials?\nA password will be required to reconnect.");
    lv_obj_align(forget_text, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * forget_cancel = fg_system_create_button(fg_system_wifi_forget_dialog, "Cancel", 30, 135, 220, 58);
    lv_obj_add_event_cb(forget_cancel, fg_system_wifi_forget_cancel_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * forget_confirm = fg_system_create_button(fg_system_wifi_forget_dialog, "Forget Network", 270, 135, 230, 58);
    lv_obj_add_event_cb(forget_confirm, fg_system_wifi_forget_confirm_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);

    fg_system_brightness_page = lv_obj_create(parent);
    lv_obj_set_pos(fg_system_brightness_page, 0, 0);
    lv_obj_set_size(fg_system_brightness_page, 1024, 600);
    lv_obj_clear_flag(fg_system_brightness_page, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_border_width(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_radius(fg_system_brightness_page, 0, 0);
    lv_obj_set_style_bg_color(fg_system_brightness_page, lv_color_hex(0x1F2937), 0);
    lv_obj_set_style_bg_opa(fg_system_brightness_page, LV_OPA_COVER, 0);

    lv_obj_t * brightness_back = fg_system_create_button(fg_system_brightness_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);
    lv_obj_add_event_cb(brightness_back, fg_system_brightness_back_cb, LV_EVENT_CLICKED, NULL);
    lv_obj_t * brightness_title = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_title, "Brightness");
    lv_obj_set_style_text_color(brightness_title, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_font(brightness_title, &lv_font_montserrat_32, 0);
    lv_obj_align(brightness_title, LV_ALIGN_TOP_MID, 0, 25);
    lv_obj_t * brightness_icon = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_icon, LV_SYMBOL_EYE_OPEN);
    lv_obj_set_style_text_color(brightness_icon, lv_color_hex(0x9CA3AF), 0);
    lv_obj_set_style_text_font(brightness_icon, &lv_font_montserrat_48, 0);
    lv_obj_align(brightness_icon, LV_ALIGN_TOP_MID, 0, 130);
    fg_system_brightness_label = lv_label_create(fg_system_brightness_page);
    lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);
    lv_obj_set_style_text_color(fg_system_brightness_label, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_style_text_font(fg_system_brightness_label, &lv_font_montserrat_48, 0);
    lv_obj_align(fg_system_brightness_label, LV_ALIGN_TOP_MID, 0, 210);
    lv_obj_t * brightness_slider = lv_slider_create(fg_system_brightness_page);
    lv_obj_set_size(brightness_slider, 720, 32);
    lv_obj_align(brightness_slider, LV_ALIGN_TOP_MID, 0, 340);
    lv_slider_set_range(brightness_slider, 10, 100);
    lv_slider_set_value(brightness_slider, fg_system_brightness_percent, LV_ANIM_OFF);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0x4B5563), LV_PART_MAIN);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0x9CA3AF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(0xF3F4F6), LV_PART_KNOB);
    lv_obj_set_style_pad_all(brightness_slider, 12, LV_PART_KNOB);
    lv_obj_add_event_cb(brightness_slider, fg_system_brightness_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);
    lv_obj_t * brightness_min = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_min, "10%");
    lv_obj_set_style_text_color(brightness_min, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_pos(brightness_min, 140, 390);
    lv_obj_t * brightness_max = lv_label_create(fg_system_brightness_page);
    lv_label_set_text(brightness_max, "100%");
    lv_obj_set_style_text_color(brightness_max, lv_color_hex(0xF3F4F6), 0);
    lv_obj_set_pos(brightness_max, 828, 390);
    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);

    fg_clock_tick_cb(NULL);
    lv_timer_create(fg_clock_tick_cb, 1000, NULL);

    fg_wifi_tick_cb(NULL);
    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);
}