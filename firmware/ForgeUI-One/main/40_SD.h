#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

// ============================================================
// ForgeUI One SD Storage System
// ============================================================
//
// File:
// 40_SD.h
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
// - SD mount/init
// - SD read/write test
// - ForgeUI folder structure
// - storage reset/rebuild
// - folder listing
// - runtime status helpers
//
// Runtime Model:
// - backend owns SD state
// - UI sends intent only
// - backend owns filesystem lifecycle
//
// Important Hardware Truth:
//
// Hosted WiFi and SDMMC share hardware paths.
//
// Current proven stable boot order:
//
//   WiFi first
//   -> SD second
//
// Rules:
// - backend only
// - no LVGL ownership
// - no UI styling
// - no direct UI dependencies
// - no workflow ownership
//
// ============================================================

// ============================================================
// Core
// ============================================================

// Initialise SD backend
bool fg_sd_init(void);

// Simple SD read/write validation test
bool fg_sd_test(void);

// ============================================================
// Status Helpers
// ============================================================

bool fg_sd_is_ready(void);

const char *fg_sd_status_text(void);

const char *fg_sd_last_action_text(void);

const char *fg_sd_size_text_get(void);

// ============================================================
// Storage Actions
// ============================================================

// Create ForgeUI folder structure
bool fg_sd_create_folders(void);

// Write simple boot marker file
bool fg_sd_write_boot_marker(void);

// Async reset task helper
bool fg_sd_reset_async(void);

// ============================================================
// Fast Storage Reset
// ============================================================
//
// Fast app-level reset.
//
// Deletes:
//
//   /sdcard/ForgeUI
//
// Rebuilds:
//
//   clean ForgeUI folder structure
//
// Does NOT:
// - full-format the SD card
// - remount storage
//
// ============================================================

bool fg_sd_reset_storage_blocking(void);

// ============================================================
// Folder / File View
// ============================================================

// List ForgeUI root folders/files
bool fg_sd_list_forgeui(char *out,
                        int out_len);

#define FG_SD_MOUNT_POINT "/sdcard"
#define FG_SD_MAX_ENTRIES 16
#define FG_SD_MAX_NAME 64
#define FG_SD_MAX_PATH 160

typedef enum {
    FG_SD_OK = 0,
    FG_SD_ERR_NOT_MOUNTED,
    FG_SD_ERR_BUSY,
    FG_SD_ERR_INVALID_PATH,
    FG_SD_ERR_NOT_FOUND,
    FG_SD_ERR_EXISTS,
    FG_SD_ERR_NOT_EMPTY,
    FG_SD_ERR_READ_ONLY,
    FG_SD_ERR_IO
} fg_sd_result_t;

typedef enum {
    FG_SD_TEST_IDLE = 0,
    FG_SD_TEST_RUNNING,
    FG_SD_TEST_PASSED,
    FG_SD_TEST_FAILED
} fg_sd_test_state_t;

typedef enum {
    FG_SD_FORMAT_IDLE = 0,
    FG_SD_FORMAT_PREPARING,
    FG_SD_FORMAT_FORMATTING,
    FG_SD_FORMAT_SUCCEEDED,
    FG_SD_FORMAT_FAILED
} fg_sd_format_state_t;

typedef struct {
    bool mounted;
    bool operation_running;
    uint64_t total_bytes;
    uint64_t used_bytes;
    uint64_t free_bytes;
    char card_type[24];
    char filesystem[16];
    char mount_point[24];
    char status[32];
    char last_error[96];
    fg_sd_test_state_t test_state;
    fg_sd_format_state_t format_state;
} fg_sd_snapshot_t;

typedef struct {
    char name[FG_SD_MAX_NAME];
    uint64_t size_bytes;
    bool is_directory;
    bool is_empty;
} fg_sd_entry_t;

typedef struct {
    char path[FG_SD_MAX_PATH];
    fg_sd_entry_t entries[FG_SD_MAX_ENTRIES];
    size_t count;
    bool truncated;
} fg_sd_directory_t;

#define FG_SD_MAX_DELETE_ITEMS 8

typedef struct {
    char name[FG_SD_MAX_NAME];
} fg_sd_delete_item_t;

typedef struct {
    size_t deleted_files;
    size_t deleted_folders;
    size_t skipped_non_empty_folders;
    size_t failed_entries;
    char status[96];
} fg_sd_delete_result_t;

typedef struct {
    bool deleted;
    char status[96];
} fg_sd_delete_folder_result_t;

typedef struct {
    bool deleted;
    char status[96];
} fg_sd_delete_file_result_t;

fg_sd_result_t fg_sd_get_snapshot(fg_sd_snapshot_t *out);
fg_sd_result_t fg_sd_mount(void);
fg_sd_result_t fg_sd_unmount(void);
fg_sd_result_t fg_sd_refresh(void);
fg_sd_result_t fg_sd_run_test(void);
fg_sd_result_t fg_sd_list_directory(const char *relative_path, fg_sd_directory_t *out);
fg_sd_result_t fg_sd_create_directory(const char *parent_relative_path, const char *name);
fg_sd_result_t fg_sd_delete_entry(const char *relative_path);
fg_sd_result_t fg_sd_delete_selected(const char *relative_parent,
                                     const fg_sd_delete_item_t *items,
                                     size_t item_count,
                                     fg_sd_delete_result_t *out);
fg_sd_result_t fg_sd_delete_empty_folder(const char *relative_parent,
                                         const char *folder_name,
                                         fg_sd_delete_folder_result_t *out);
fg_sd_result_t fg_sd_delete_file(const char *relative_parent,
                                 const char *file_name,
                                 fg_sd_delete_file_result_t *out);
fg_sd_result_t fg_sd_rename_entry(const char *relative_path, const char *new_name);
fg_sd_result_t fg_sd_format(void);
const char *fg_sd_result_text(fg_sd_result_t result);

#ifdef __cplusplus
}
#endif
