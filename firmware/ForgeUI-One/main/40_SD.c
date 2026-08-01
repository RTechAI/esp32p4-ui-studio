// ============================================================
// ForgeUI One SD Storage System
// ============================================================
//
// File:
// 40_SD.c
//
// Created by:
// Scott Forster
//
// Contact:
// forgeui.esp32@gmail.com
//
// Purpose:
// Shared SD card and filesystem backend.
//
// Features:
// - SD card mount/init
// - SD read/write test
// - ForgeUI folder structure
// - boot marker support
// - storage reset/rebuild
// - folder listing
// - runtime status helpers
//
// Runtime Rules:
// - backend owns SD state
// - UI sends intent only
// - no LVGL ownership
// - no UI styling
// - no workflow ownership
//
// Important Hardware Truth:
//
// ESP32-P4 Hosted WiFi and SDMMC share critical hardware paths.
//
// Proven stable boot order:
//
//   WiFi first
//   -> SD second
//
// Do not mount SD before Hosted WiFi unless retested and proven again.
//
// Controlled Through:
//
//   FORGEUI_ENABLE_SD
//
// ============================================================

// ============================================================
// Includes
// ============================================================

#include "40_SD.h"

#include "esp_log.h"
#include "esp_err.h"

#include "esp_ldo_regulator.h"

#include "esp_vfs_fat.h"
#include "sdmmc_cmd.h"

#include "driver/sdmmc_host.h"

#include "bsp/esp32_p4_wifi6_touch_lcd_7b.h"

#include <dirent.h>
#include <stdio.h>
#include <string.h>
#include <strings.h>
#include <stdlib.h>
#include <ctype.h>
#include <stdbool.h>

#include <sys/stat.h>

#include <errno.h>
#include <unistd.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

static const char *TAG = "FG_SD";

#define MOUNT_POINT          "/sdcard"
#define FG_SD_TEST_PATH      "/sdcard/FGUIRW.TMP"
#define FG_SD_ROOT           "/sdcard/ForgeUI"
#define FG_SD_BOOT_MARKER    "/sdcard/ForgeUI/system/boot_marker.txt"

static esp_ldo_channel_handle_t g_sd_ldo = NULL;
static sdmmc_card_t *g_card = NULL;

static bool g_sd_ready = false;
static char g_sd_status[32] = "OFF";
static char g_sd_last_action[96] = "No SD action yet";
static char g_sd_size_text[64] = "Size: -";
static bool g_sd_operation_running = false;
static fg_sd_test_state_t g_sd_test_state = FG_SD_TEST_IDLE;
static fg_sd_format_state_t g_sd_format_state = FG_SD_FORMAT_IDLE;
static bool g_sd_allow_format_on_mount = false;
static char g_sd_last_error[96] = "";

// ============================================================
// Status helpers
// ============================================================

static void fg_sd_set_status(const char *s)
{
    snprintf(g_sd_status, sizeof(g_sd_status), "%s", s ? s : "-");
}

static void fg_sd_set_action(const char *s)
{
    snprintf(g_sd_last_action, sizeof(g_sd_last_action), "%s", s ? s : "-");
}

bool fg_sd_is_ready(void)
{
    return g_sd_ready;
}

const char *fg_sd_status_text(void)
{
    return g_sd_status;
}

const char *fg_sd_last_action_text(void)
{
    return g_sd_last_action;
}

const char *fg_sd_size_text_get(void)
{
    return g_sd_size_text;
}

// ============================================================
// Folder helpers
// ============================================================

static bool fg_sd_mkdir_one(const char *path)
{
    if (!path || path[0] == 0) return false;

    int ret = mkdir(path, 0775);

    if (ret == 0)
    {
        ESP_LOGI(TAG, "Folder created: %s", path);
        return true;
    }

    if (errno == EEXIST)
    {
        ESP_LOGI(TAG, "Folder already exists: %s", path);
        return true;
    }

    ESP_LOGE(TAG, "Folder create failed: %s errno=%d", path, errno);
    return false;
}

static bool fg_sd_delete_recursive(const char *path)
{
    DIR *dir = opendir(path);

    if (!dir)
    {
        ESP_LOGW(TAG, "Delete skip, folder not found: %s", path);
        return true;
    }

    struct dirent *entry;
    char full[256];

    while ((entry = readdir(dir)) != NULL)
    {
        if (entry->d_name[0] == '.') continue;

        snprintf(full, sizeof(full), "%s/%s", path, entry->d_name);

        struct stat st;
        if (stat(full, &st) != 0)
        {
            ESP_LOGW(TAG, "stat failed: %s errno=%d", full, errno);
            continue;
        }

        if (S_ISDIR(st.st_mode))
        {
            fg_sd_delete_recursive(full);

            if (rmdir(full) != 0)
            {
                ESP_LOGW(TAG, "rmdir failed: %s errno=%d", full, errno);
            }
            else
            {
                ESP_LOGI(TAG, "Folder deleted: %s", full);
            }
        }
        else
        {
            if (unlink(full) != 0)
            {
                ESP_LOGW(TAG, "unlink failed: %s errno=%d", full, errno);
            }
            else
            {
                ESP_LOGI(TAG, "File deleted: %s", full);
            }
        }
    }

    closedir(dir);
    return true;
}

// ============================================================
// SD init
// ============================================================

bool fg_sd_init(void)
{
    ESP_LOGI(TAG, "SD init start - manual LDO + manual mount");
    fg_sd_set_status("INIT");
    fg_sd_set_action("Mounting SD");

    if (g_sd_ready && g_card)
    {
        ESP_LOGI(TAG, "SD already mounted");
        fg_sd_set_status("READY");
        fg_sd_set_action("SD already mounted");
        return true;
    }

    if (g_sd_ldo == NULL)
    {
        esp_ldo_channel_config_t ldo_cfg = {
            .chan_id = CONFIG_FORGEUI_SD_LDO_CHANNEL,
            .voltage_mv = CONFIG_FORGEUI_SD_LDO_MV
        };

        esp_err_t ldo_ret = esp_ldo_acquire_channel(&ldo_cfg, &g_sd_ldo);

        if (ldo_ret != ESP_OK)
        {
            ESP_LOGE(TAG, "SD LDO acquire failed: %s", esp_err_to_name(ldo_ret));
            fg_sd_set_status("LDO_FAIL");
            fg_sd_set_action("SD LDO failed");
            snprintf(g_sd_size_text, sizeof(g_sd_size_text), "Size: -");
            return false;
        }

        ESP_LOGI(TAG, "SD LDO forced ON: channel %d @ %dmV",
                 CONFIG_FORGEUI_SD_LDO_CHANNEL, CONFIG_FORGEUI_SD_LDO_MV);
    }

    esp_vfs_fat_sdmmc_mount_config_t mount_config = {
        .format_if_mount_failed = g_sd_allow_format_on_mount,
        .max_files = 8,
        .allocation_unit_size = 16 * 1024
    };

    sdmmc_host_t host = SDMMC_HOST_DEFAULT();
    host.slot = CONFIG_FORGEUI_SD_SLOT;
    host.max_freq_khz = CONFIG_FORGEUI_SD_FREQ_KHZ;

    sdmmc_slot_config_t slot_config = {
        .clk = CONFIG_FORGEUI_SD_CLK,
        .cmd = CONFIG_FORGEUI_SD_CMD,
        .d0 = CONFIG_FORGEUI_SD_D0,
        .d1 = CONFIG_FORGEUI_SD_D1,
        .d2 = CONFIG_FORGEUI_SD_D2,
        .d3 = CONFIG_FORGEUI_SD_D3,
        .cd = SDMMC_SLOT_NO_CD,
        .wp = SDMMC_SLOT_NO_WP,
        .width = CONFIG_FORGEUI_SD_WIDTH,
        .flags = SDMMC_SLOT_FLAG_INTERNAL_PULLUP,
    };

    ESP_LOGI(TAG,
             "Pins: SLOT=0 CLK=%d CMD=%d D0=%d D1=%d D2=%d D3=%d WIDTH=4",
             CONFIG_FORGEUI_SD_CLK,
             CONFIG_FORGEUI_SD_CMD,
             CONFIG_FORGEUI_SD_D0,
             CONFIG_FORGEUI_SD_D1,
             CONFIG_FORGEUI_SD_D2,
             CONFIG_FORGEUI_SD_D3);

    esp_err_t ret = esp_vfs_fat_sdmmc_mount(
        MOUNT_POINT,
        &host,
        &slot_config,
        &mount_config,
        &g_card
    );

    if (ret != ESP_OK)
    {
        ESP_LOGE(TAG, "SD mount failed: %s", esp_err_to_name(ret));
        g_sd_ready = false;
        fg_sd_set_status("MOUNT_FAIL");
        fg_sd_set_action("SD mount failed");
        snprintf(g_sd_size_text, sizeof(g_sd_size_text), "Size: -");
        return false;
    }

    g_sd_ready = true;
    fg_sd_set_status("READY");
    fg_sd_set_action("SD mounted OK");

    ESP_LOGI(TAG, "SD mounted OK");
    sdmmc_card_print_info(stdout, g_card);

    uint64_t size_mb = ((uint64_t)g_card->csd.capacity) *
                       g_card->csd.sector_size / (1024 * 1024);

    if (size_mb >= 1024)
    {
        uint64_t size_gb = size_mb / 1024;
        snprintf(g_sd_size_text,
                 sizeof(g_sd_size_text),
                 "Size: %llu GB",
                 (unsigned long long)size_gb);
    }
    else
    {
        snprintf(g_sd_size_text,
                 sizeof(g_sd_size_text),
                 "Size: %llu MB",
                 (unsigned long long)size_mb);
    }

    return true;
}

// ============================================================
// Test
// ============================================================

bool fg_sd_test(void)
{
    if (!g_sd_ready)
    {
        ESP_LOGE(TAG, "SD test requested but SD not ready");
        fg_sd_set_status("NOT_READY");
        fg_sd_set_action("SD not ready");
        return false;
    }

    ESP_LOGI(TAG, "SD write test: %s", FG_SD_TEST_PATH);
    fg_sd_set_action("Running SD test");

    FILE *f = fopen(FG_SD_TEST_PATH, "w");
    if (!f)
    {
        ESP_LOGE(TAG, "Failed to open file for write errno=%d", errno);
        fg_sd_set_action("SD write failed");
        return false;
    }

    fprintf(f, "ForgeUI SD OK\n");
    fclose(f);

    char line[64] = {0};

    f = fopen(FG_SD_TEST_PATH, "r");
    if (!f)
    {
        ESP_LOGE(TAG, "Failed to open file for read errno=%d", errno);
        fg_sd_set_action("SD read failed");
        return false;
    }

    fgets(line, sizeof(line), f);
    fclose(f);

    ESP_LOGI(TAG, "Read back: %s", line);

    if (strstr(line, "ForgeUI SD OK"))
    {
        unlink(FG_SD_TEST_PATH);
        ESP_LOGI(TAG, "SD TEST PASS");
        fg_sd_set_status("READY");
        fg_sd_set_action("SD test PASS");
        return true;
    }

    ESP_LOGE(TAG, "SD TEST FAIL");
    fg_sd_set_action("SD test FAIL");
    return false;
}




// ============================================================
// ForgeUI filesystem
// ============================================================

bool fg_sd_create_folders(void)
{
    if (!g_sd_ready)
    {
        fg_sd_set_status("NOT_READY");
        fg_sd_set_action("Create folders failed: SD not ready");
        return false;
    }

    bool ok = true;

    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/config");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/logs");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/users");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/preop");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/export");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/backups");
    ok &= fg_sd_mkdir_one("/sdcard/ForgeUI/system");

    if (ok)
    {
        fg_sd_set_status("READY");
        fg_sd_set_action("Folder structure ready");
        ESP_LOGI(TAG, "ForgeUI SD folder structure ready");
        return true;
    }

    fg_sd_set_action("Folder structure failed");
    ESP_LOGE(TAG, "ForgeUI SD folder structure failed");
    return false;
}

bool fg_sd_write_boot_marker(void)
{
    if (!g_sd_ready)
    {
        fg_sd_set_status("NOT_READY");
        fg_sd_set_action("Boot marker failed: SD not ready");
        return false;
    }

    if (!fg_sd_create_folders())
    {
        fg_sd_set_action("Boot marker failed: folders failed");
        return false;
    }

    FILE *f = fopen(FG_SD_BOOT_MARKER, "w");
    if (!f)
    {
        ESP_LOGE(TAG, "Boot marker write failed errno=%d", errno);
        fg_sd_set_action("Boot marker write failed");
        return false;
    }

    fprintf(f, "ForgeUI boot marker OK\n");
    fclose(f);

    fg_sd_set_status("READY");
    fg_sd_set_action("Boot marker written");
    ESP_LOGI(TAG, "Boot marker written: %s", FG_SD_BOOT_MARKER);
    return true;
}

bool fg_sd_reset_storage_blocking(void)
{
    if (!g_sd_ready)
    {
        fg_sd_set_status("NOT_READY");
        fg_sd_set_action("Reset failed: SD not ready");
        return false;
    }

    ESP_LOGW(TAG, "ForgeUI storage reset START");
    fg_sd_set_status("RESETTING");
    fg_sd_set_action("Deleting ForgeUI storage");

    fg_sd_delete_recursive(FG_SD_ROOT);

    if (rmdir(FG_SD_ROOT) != 0)
    {
        if (errno != ENOENT)
        {
            ESP_LOGW(TAG, "Root rmdir warning: %s errno=%d", FG_SD_ROOT, errno);
        }
    }
    else
    {
        ESP_LOGI(TAG, "Root folder deleted: %s", FG_SD_ROOT);
    }

    vTaskDelay(pdMS_TO_TICKS(100));

    if (!fg_sd_create_folders())
    {
        fg_sd_set_status("RESET_FAIL");
        fg_sd_set_action("Reset failed: folder rebuild failed");
        return false;
    }

    vTaskDelay(pdMS_TO_TICKS(100));

    // 🔧 Removed boot marker write (was failing on fresh FS)
    ESP_LOGW(TAG, "Boot marker skipped during reset");

    fg_sd_set_status("READY");
    fg_sd_set_action("ForgeUI file system reset SUCCESS");

    ESP_LOGW(TAG, "ForgeUI storage reset COMPLETE");
    return true;
}




// ============================================================
// Async reset for UI button
// ============================================================

static void fg_sd_reset_task(void *arg)
{
    (void)arg;

    ESP_LOGW(TAG, "ForgeUI storage reset task START");

    bool ok = fg_sd_reset_storage_blocking();

    if (ok)
    {
        fg_sd_set_status("READY");
        fg_sd_set_action("ForgeUI file system reset SUCCESS");
        ESP_LOGW(TAG, "ForgeUI storage reset SUCCESS");
    }
    else
    {
        fg_sd_set_status("RESET_FAIL");
        fg_sd_set_action("ForgeUI file system reset FAILED");
        ESP_LOGE(TAG, "ForgeUI storage reset FAILED");
    }

    vTaskDelete(NULL);
}

bool fg_sd_reset_async(void)
{
    if (!g_sd_ready)
    {
        fg_sd_set_status("NOT_READY");
        fg_sd_set_action("Reset failed: SD not ready");
        return false;
    }

    ESP_LOGW(TAG, "ForgeUI storage reset async requested");

    xTaskCreate(
        fg_sd_reset_task,
        "sd_reset",
        8192,
        NULL,
        5,
        NULL
    );

    return true;
}

// ============================================================
// List ForgeUI folder
// ============================================================

bool fg_sd_list_forgeui(char *out, int out_len)
{
    if (!out || out_len <= 0) return false;

    snprintf(out, out_len, "ForgeUI folder:\n");

    if (!g_sd_ready)
    {
        strncat(out, "SD not ready", out_len - strlen(out) - 1);
        fg_sd_set_action("List failed: SD not ready");
        return false;
    }

    DIR *dir = opendir(FG_SD_ROOT);

    if (!dir)
    {
        strncat(out,
                "Missing /ForgeUI\nPress Create Folders",
                out_len - strlen(out) - 1);
        fg_sd_set_action("ForgeUI folder missing");
        return false;
    }

    struct dirent *entry;
    int count = 0;

    while ((entry = readdir(dir)) != NULL)
    {
        if (entry->d_name[0] == '.') continue;

        strncat(out, "- ", out_len - strlen(out) - 1);
        strncat(out, entry->d_name, out_len - strlen(out) - 1);
        strncat(out, "\n", out_len - strlen(out) - 1);
        count++;
    }

    closedir(dir);

    if (count == 0)
    {
        strncat(out, "(empty)", out_len - strlen(out) - 1);
    }

    fg_sd_set_action("Folder list updated");
    return true;
}

static fg_sd_result_t fg_sd_fail(fg_sd_result_t result, const char *text)
{
    snprintf(g_sd_last_error, sizeof(g_sd_last_error), "%s", text ? text : "SD operation failed");
    fg_sd_set_action(g_sd_last_error);
    return result;
}

static bool fg_sd_valid_name(const char *name)
{
    if (!name || !name[0] || !strcmp(name, ".") || !strcmp(name, "..") ||
        strlen(name) >= FG_SD_MAX_NAME) return false;
    bool has_visible = false;
    for (const unsigned char *p = (const unsigned char *)name; *p; ++p) {
        if (*p < 32 || strchr("<>:\"/\\|?*", *p)) return false;
        if (!isspace(*p)) has_visible = true;
    }
    return has_visible;
}

static bool fg_sd_make_path(const char *relative, char *out, size_t out_size)
{
    if (!relative || !out || relative[0] == '/' || relative[0] == '\\' ||
        strstr(relative, "..") || strchr(relative, '\\')) return false;
    int written = relative[0]
        ? snprintf(out, out_size, "%s/%s", MOUNT_POINT, relative)
        : snprintf(out, out_size, "%s", MOUNT_POINT);
    return written > 0 && (size_t)written < out_size;
}

const char *fg_sd_result_text(fg_sd_result_t result)
{
    switch (result) {
        case FG_SD_OK: return "OK";
        case FG_SD_ERR_NOT_MOUNTED: return "SD card is not mounted";
        case FG_SD_ERR_BUSY: return "SD operation is running";
        case FG_SD_ERR_INVALID_PATH: return "Invalid SD path or name";
        case FG_SD_ERR_NOT_FOUND: return "Entry no longer exists";
        case FG_SD_ERR_EXISTS: return "Destination already exists";
        case FG_SD_ERR_NOT_EMPTY: return "Directory is not empty";
        case FG_SD_ERR_READ_ONLY: return "Entry is read-only";
        default: return "SD filesystem I/O error";
    }
}

fg_sd_result_t fg_sd_get_snapshot(fg_sd_snapshot_t *out)
{
    if (!out) return FG_SD_ERR_INVALID_PATH;
    memset(out, 0, sizeof(*out));
    out->mounted = g_sd_ready;
    out->operation_running = g_sd_operation_running;
    out->test_state = g_sd_test_state;
    out->format_state = g_sd_format_state;
    snprintf(out->mount_point, sizeof(out->mount_point), "%s", MOUNT_POINT);
    snprintf(out->filesystem, sizeof(out->filesystem), "%s", g_sd_ready ? "FAT" : "-");
    snprintf(out->status, sizeof(out->status), "%s", g_sd_status);
    snprintf(out->last_error, sizeof(out->last_error), "%s", g_sd_last_error);
    if (g_card) {
        out->total_bytes = (uint64_t)g_card->csd.capacity * g_card->csd.sector_size;
        snprintf(out->card_type, sizeof(out->card_type), "%s",
                 g_card->is_mmc ? "MMC" :
                 (out->total_bytes > (uint64_t)2 * 1024 * 1024 * 1024 ? "SDHC/SDXC" : "SDSC"));
    } else snprintf(out->card_type, sizeof(out->card_type), "-");
    if (g_sd_ready) {
        uint64_t total_bytes = 0;
        uint64_t free_bytes = 0;
        if (esp_vfs_fat_info(MOUNT_POINT, &total_bytes, &free_bytes) == ESP_OK) {
            out->free_bytes = (uint64_t)free_bytes;
            if (!out->total_bytes) out->total_bytes = (uint64_t)total_bytes;
            out->used_bytes = out->total_bytes > out->free_bytes
                ? out->total_bytes - out->free_bytes : 0;
        }
    }
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_mount(void)
{
    if (g_sd_operation_running) return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));
    g_sd_last_error[0] = 0;
    return fg_sd_init() ? FG_SD_OK : fg_sd_fail(FG_SD_ERR_IO, fg_sd_last_action_text());
}

fg_sd_result_t fg_sd_unmount(void)
{
    if (g_sd_operation_running) return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));
    if (!g_sd_ready || !g_card) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    esp_vfs_fat_sdcard_unmount(MOUNT_POINT, g_card);
    g_card = NULL;
    g_sd_ready = false;
    fg_sd_set_status("UNMOUNTED");
    fg_sd_set_action("SD unmounted");
    g_sd_last_error[0] = 0;
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_refresh(void)
{
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    g_sd_last_error[0] = 0;
    fg_sd_set_action("SD status refreshed");
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_run_test(void)
{
    if (g_sd_operation_running) return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    g_sd_operation_running = true;
    g_sd_test_state = FG_SD_TEST_RUNNING;
    bool ok = fg_sd_test();
    g_sd_test_state = ok ? FG_SD_TEST_PASSED : FG_SD_TEST_FAILED;
    g_sd_operation_running = false;
    if (ok) { g_sd_last_error[0] = 0; return FG_SD_OK; }
    return fg_sd_fail(FG_SD_ERR_IO, fg_sd_last_action_text());
}

static int fg_sd_entry_compare(const void *a, const void *b)
{
    const fg_sd_entry_t *left = a, *right = b;
    if (left->is_directory != right->is_directory) return left->is_directory ? -1 : 1;
    return strcasecmp(left->name, right->name);
}

fg_sd_result_t fg_sd_list_directory(const char *relative_path, fg_sd_directory_t *out)
{
    char full[FG_SD_MAX_PATH];
    if (!out || !fg_sd_make_path(relative_path, full, sizeof(full)))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    DIR *dir = opendir(full);
    if (!dir) return fg_sd_fail(errno == ENOENT ? FG_SD_ERR_NOT_FOUND : FG_SD_ERR_IO,
                                errno == ENOENT ? fg_sd_result_text(FG_SD_ERR_NOT_FOUND) : fg_sd_result_text(FG_SD_ERR_IO));
    memset(out, 0, sizeof(*out));
    snprintf(out->path, sizeof(out->path), "/%s", relative_path);
    struct dirent *item;
    while ((item = readdir(dir)) != NULL) {
        if (!strcmp(item->d_name, ".") || !strcmp(item->d_name, "..")) continue;
        if (out->count == FG_SD_MAX_ENTRIES) { out->truncated = true; continue; }
        fg_sd_entry_t *entry = &out->entries[out->count];
        snprintf(entry->name, sizeof(entry->name), "%s", item->d_name);
        char child[FG_SD_MAX_PATH];
        struct stat st;
        int n = snprintf(child, sizeof(child), "%s/%s", full, item->d_name);
        if (n <= 0 || (size_t)n >= sizeof(child) || stat(child, &st) != 0) continue;
        entry->is_directory = S_ISDIR(st.st_mode);
        entry->size_bytes = entry->is_directory ? 0 : (uint64_t)st.st_size;
        entry->is_empty = false;
        if (entry->is_directory) {
            DIR *child_dir = opendir(child);
            if (child_dir) {
                entry->is_empty = true;
                struct dirent *child_item;
                while ((child_item = readdir(child_dir)) != NULL) {
                    if (strcmp(child_item->d_name, ".") && strcmp(child_item->d_name, "..")) {
                        entry->is_empty = false;
                        break;
                    }
                }
                closedir(child_dir);
            }
        }
        out->count++;
    }
    closedir(dir);
    qsort(out->entries, out->count, sizeof(out->entries[0]), fg_sd_entry_compare);
    g_sd_last_error[0] = 0;
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_create_directory(const char *parent, const char *name)
{
    char base[FG_SD_MAX_PATH], full[FG_SD_MAX_PATH];
    if (!fg_sd_valid_name(name) || !fg_sd_make_path(parent, base, sizeof(base)))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    int n = snprintf(full, sizeof(full), "%s/%s", base, name);
    if (n <= 0 || (size_t)n >= sizeof(full)) return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    struct stat st;
    if (stat(full, &st) == 0) return fg_sd_fail(FG_SD_ERR_EXISTS, fg_sd_result_text(FG_SD_ERR_EXISTS));
    if (mkdir(full, 0775) != 0) return fg_sd_fail(errno == EROFS ? FG_SD_ERR_READ_ONLY : FG_SD_ERR_IO,
                                                  errno == EROFS ? fg_sd_result_text(FG_SD_ERR_READ_ONLY) : fg_sd_result_text(FG_SD_ERR_IO));
    g_sd_last_error[0] = 0; return FG_SD_OK;
}

fg_sd_result_t fg_sd_delete_entry(const char *relative)
{
    char full[FG_SD_MAX_PATH];
    if (!relative || !relative[0] || !fg_sd_make_path(relative, full, sizeof(full)))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    struct stat st;
    if (stat(full, &st) != 0) return fg_sd_fail(FG_SD_ERR_NOT_FOUND, fg_sd_result_text(FG_SD_ERR_NOT_FOUND));
    int rc = S_ISDIR(st.st_mode) ? rmdir(full) : unlink(full);
    if (rc != 0) {
        fg_sd_result_t result = (errno == ENOTEMPTY || errno == EEXIST) ? FG_SD_ERR_NOT_EMPTY :
                                errno == EROFS ? FG_SD_ERR_READ_ONLY : FG_SD_ERR_IO;
        return fg_sd_fail(result, fg_sd_result_text(result));
    }
    g_sd_last_error[0] = 0; return FG_SD_OK;
}

fg_sd_result_t fg_sd_delete_selected(const char *relative_parent,
                                     const fg_sd_delete_item_t *items,
                                     size_t item_count,
                                     fg_sd_delete_result_t *out)
{
    char parent[FG_SD_MAX_PATH];
    if (out) memset(out, 0, sizeof(*out));
    if (!out || !items || item_count == 0 || item_count > FG_SD_MAX_DELETE_ITEMS ||
        !relative_parent || relative_parent[0] == '/' || relative_parent[0] == '\\' ||
        strstr(relative_parent, "..") || strchr(relative_parent, '\\') ||
        !fg_sd_make_path(relative_parent, parent, sizeof(parent))) {
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    }
    if (!g_sd_ready)
        return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    if (g_sd_operation_running)
        return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));

    g_sd_operation_running = true;
    g_sd_last_error[0] = 0;
    for (size_t i = 0; i < item_count; ++i) {
        const char *name = items[i].name;
        if (!fg_sd_valid_name(name) || strstr(name, "..") || strchr(name, '/') || strchr(name, '\\')) {
            out->failed_entries++;
            continue;
        }

        char target[FG_SD_MAX_PATH];
        int written = snprintf(target, sizeof(target), "%s/%s", parent, name);
        if (written <= 0 || (size_t)written >= sizeof(target) ||
            !strcmp(target, MOUNT_POINT)) {
            out->failed_entries++;
            continue;
        }

        struct stat st;
        if (stat(target, &st) != 0) {
            out->failed_entries++;
        } else if (S_ISDIR(st.st_mode)) {
            if (rmdir(target) == 0) out->deleted_folders++;
            else if (errno == ENOTEMPTY || errno == EEXIST) out->skipped_non_empty_folders++;
            else out->failed_entries++;
        } else {
            if (unlink(target) == 0) out->deleted_files++;
            else out->failed_entries++;
        }
        vTaskDelay(1);
    }
    g_sd_operation_running = false;

    snprintf(out->status, sizeof(out->status),
             "%u files, %u folders deleted; %u non-empty skipped; %u failed",
             (unsigned)out->deleted_files, (unsigned)out->deleted_folders,
             (unsigned)out->skipped_non_empty_folders, (unsigned)out->failed_entries);
    fg_sd_set_action(out->status);
    if (out->failed_entries) return fg_sd_fail(FG_SD_ERR_IO, out->status);
    if (out->skipped_non_empty_folders) return fg_sd_fail(FG_SD_ERR_NOT_EMPTY, out->status);
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_delete_empty_folder(const char *relative_parent,
                                         const char *folder_name,
                                         fg_sd_delete_folder_result_t *out)
{
    char parent[FG_SD_MAX_PATH];
    char target[FG_SD_MAX_PATH];
    if (out) memset(out, 0, sizeof(*out));
    if (!out || !relative_parent || !fg_sd_valid_name(folder_name) ||
        strstr(folder_name, "..") || strchr(folder_name, '/') || strchr(folder_name, '\\') ||
        !fg_sd_make_path(relative_parent, parent, sizeof(parent))) {
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    }
    if (!g_sd_ready)
        return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    if (g_sd_operation_running)
        return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));

    int written = snprintf(target, sizeof(target), "%s/%s", parent, folder_name);
    if (written <= 0 || (size_t)written >= sizeof(target) || !strcmp(target, MOUNT_POINT))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));

    struct stat st;
    if (stat(target, &st) != 0)
        return fg_sd_fail(FG_SD_ERR_NOT_FOUND, fg_sd_result_text(FG_SD_ERR_NOT_FOUND));
    if (!S_ISDIR(st.st_mode))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, "Target is not a folder");

    DIR *dir = opendir(target);
    if (!dir) return fg_sd_fail(FG_SD_ERR_IO, fg_sd_result_text(FG_SD_ERR_IO));
    bool empty = true;
    struct dirent *item;
    while ((item = readdir(dir)) != NULL) {
        if (strcmp(item->d_name, ".") && strcmp(item->d_name, "..")) {
            empty = false;
            break;
        }
    }
    closedir(dir);
    if (!empty) {
        snprintf(out->status, sizeof(out->status), "Folder is not empty.");
        return fg_sd_fail(FG_SD_ERR_NOT_EMPTY, out->status);
    }

    g_sd_operation_running = true;
    int result = rmdir(target);
    g_sd_operation_running = false;
    if (result != 0) {
        snprintf(out->status, sizeof(out->status), "%s",
                 errno == ENOTEMPTY ? "Folder is not empty." : fg_sd_result_text(FG_SD_ERR_IO));
        return fg_sd_fail(errno == ENOTEMPTY ? FG_SD_ERR_NOT_EMPTY : FG_SD_ERR_IO, out->status);
    }
    out->deleted = true;
    snprintf(out->status, sizeof(out->status), "Folder deleted");
    fg_sd_set_action(out->status);
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_delete_file(const char *relative_parent,
                                 const char *file_name,
                                 fg_sd_delete_file_result_t *out)
{
    char parent[FG_SD_MAX_PATH];
    char target[FG_SD_MAX_PATH];
    if (out) memset(out, 0, sizeof(*out));
    if (!out || !relative_parent || !fg_sd_valid_name(file_name) ||
        strstr(file_name, "..") || strchr(file_name, '/') || strchr(file_name, '\\') ||
        !fg_sd_make_path(relative_parent, parent, sizeof(parent))) {
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    }
    if (!g_sd_ready)
        return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    if (g_sd_operation_running)
        return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));

    int written = snprintf(target, sizeof(target), "%s/%s", parent, file_name);
    if (written <= 0 || (size_t)written >= sizeof(target) || !strcmp(target, MOUNT_POINT))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));

    g_sd_operation_running = true;
    fg_sd_result_t result = FG_SD_OK;
    struct stat st;
    if (stat(target, &st) != 0) {
        result = FG_SD_ERR_NOT_FOUND;
    } else if (!S_ISREG(st.st_mode)) {
        result = FG_SD_ERR_INVALID_PATH;
    } else if (unlink(target) != 0) {
        result = errno == EROFS ? FG_SD_ERR_READ_ONLY : FG_SD_ERR_IO;
    } else {
        out->deleted = true;
        snprintf(out->status, sizeof(out->status), "File deleted");
    }
    g_sd_operation_running = false;

    if (result != FG_SD_OK) {
        const char *text = result == FG_SD_ERR_INVALID_PATH
            ? "Target is not a file"
            : fg_sd_result_text(result);
        snprintf(out->status, sizeof(out->status), "%s", text);
        return fg_sd_fail(result, out->status);
    }
    g_sd_last_error[0] = 0;
    fg_sd_set_action(out->status);
    return FG_SD_OK;
}

fg_sd_result_t fg_sd_rename_entry(const char *relative, const char *new_name)
{
    char source[FG_SD_MAX_PATH], destination[FG_SD_MAX_PATH], parent[FG_SD_MAX_PATH];
    if (!relative || !relative[0] || !fg_sd_valid_name(new_name) ||
        !fg_sd_make_path(relative, source, sizeof(source)))
        return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    snprintf(parent, sizeof(parent), "%s", source);
    char *slash = strrchr(parent, '/');
    if (!slash) return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    *slash = 0;
    int n = snprintf(destination, sizeof(destination), "%s/%s", parent, new_name);
    if (n <= 0 || (size_t)n >= sizeof(destination)) return fg_sd_fail(FG_SD_ERR_INVALID_PATH, fg_sd_result_text(FG_SD_ERR_INVALID_PATH));
    if (!g_sd_ready) return fg_sd_fail(FG_SD_ERR_NOT_MOUNTED, fg_sd_result_text(FG_SD_ERR_NOT_MOUNTED));
    struct stat st;
    if (stat(source, &st) != 0) return fg_sd_fail(FG_SD_ERR_NOT_FOUND, fg_sd_result_text(FG_SD_ERR_NOT_FOUND));
    if (stat(destination, &st) == 0) return fg_sd_fail(FG_SD_ERR_EXISTS, fg_sd_result_text(FG_SD_ERR_EXISTS));
    if (rename(source, destination) != 0) return fg_sd_fail(errno == EROFS ? FG_SD_ERR_READ_ONLY : FG_SD_ERR_IO,
                                                            errno == EROFS ? fg_sd_result_text(FG_SD_ERR_READ_ONLY) : fg_sd_result_text(FG_SD_ERR_IO));
    g_sd_last_error[0] = 0; return FG_SD_OK;
}

fg_sd_result_t fg_sd_format(void)
{
    if (g_sd_operation_running)
        return fg_sd_fail(FG_SD_ERR_BUSY, fg_sd_result_text(FG_SD_ERR_BUSY));
    g_sd_operation_running = true;
    g_sd_format_state = FG_SD_FORMAT_PREPARING;
    g_sd_last_error[0] = 0;

    esp_err_t result = ESP_FAIL;
    if (g_sd_ready && g_card) {
        g_sd_format_state = FG_SD_FORMAT_FORMATTING;
        result = esp_vfs_fat_sdcard_format(MOUNT_POINT, g_card);
    } else {
        /*
         * Explicit blank/corrupt-card recovery. fg_sd_init() keeps the proven
         * Slot 0, GPIO, width, frequency and LDO configuration; this flag is
         * true only for this deliberate format request.
         */
        g_sd_allow_format_on_mount = true;
        g_sd_format_state = FG_SD_FORMAT_FORMATTING;
        g_sd_operation_running = false; /* fg_sd_init owns the mount attempt */
        bool mounted = fg_sd_init();
        g_sd_operation_running = true;
        g_sd_allow_format_on_mount = false;
        result = mounted ? ESP_OK : ESP_FAIL;
    }

    if (result == ESP_OK) {
        g_sd_ready = g_card != NULL;
        g_sd_format_state = FG_SD_FORMAT_SUCCEEDED;
        g_sd_operation_running = false;
        fg_sd_set_status("READY");
        fg_sd_set_action("SD format complete");
        g_sd_last_error[0] = 0;
        return FG_SD_OK;
    }

    g_sd_format_state = FG_SD_FORMAT_FAILED;
    g_sd_operation_running = false;
    return fg_sd_fail(result == ESP_ERR_INVALID_STATE ? FG_SD_ERR_NOT_MOUNTED : FG_SD_ERR_IO,
                      esp_err_to_name(result));
}
