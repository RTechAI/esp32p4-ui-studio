import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'
import path from 'path'

const components: IComponents = {
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: ['application_label'],
  },
  application_label: {
    id: 'application_label',
    parent: 'root',
    type: 'Text',
    props: {
      children: 'Application',
      x: 40,
      y: 40,
      w: 200,
      h: 50,
    },
    children: [],
  },
}

describe('built-in System LVGL export', () => {
  const generated =
    generateForgeUILvglCode(components, 'reactor_dark')

  if (process.env.FORGEUI_DUMP_SYSTEM_C) {
    fs.writeFileSync(process.env.FORGEUI_DUMP_SYSTEM_C, generated.code)
  }

  it('keeps application widgets in one persistent container', () => {
    expect(generated.code).toContain(
      'fg_application_page = lv_obj_create(parent);',
    )
    expect(generated.code).toContain(
      'lv_label_create(fg_application_page);',
    )
    expect(generated.code).not.toContain(
      'lv_screen_load',
    )
  })

  it('creates a system-owned gear and internal navigation callbacks', () => {
    expect(generated.code).toContain(
      'LV_SYMBOL_SETTINGS, 922, 18, 84, 84',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_text_font(system_gear_label, &lv_font_montserrat_48, 0);',
    )
    expect(generated.code).toContain(
      'fg_system_open_cb, LV_EVENT_CLICKED, NULL',
    )
    expect(generated.code).toContain(
      'fg_system_close_cb, LV_EVENT_CLICKED, NULL',
    )
    expect(generated.userEventHooks).toEqual([])
  })

  it('creates Display, Wi-Fi and Storage as interactive launcher cards', () => {
    expect(generated.code).toContain(
      'fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL',
    )
    ;[
      'Bluetooth',
      'Sound',
      'Device',
      'Diagnostics',
    ].forEach(label => {
      expect(generated.code).toContain(
        `${label}\\nComing Later`,
      )
    })
    expect(
      generated.code.match(
        /fg_system_open_brightness_cb, LV_EVENT_CLICKED/g,
      ),
    ).toHaveLength(1)
    expect(generated.code).toContain(
      'fg_system_open_wifi_cb, LV_EVENT_CLICKED, NULL',
    )
    expect(generated.code).not.toContain(
      'Wi-Fi\\nComing Later',
    )
    expect(generated.code).toContain(
      'fg_system_open_storage_cb, LV_EVENT_CLICKED, NULL',
    )
    expect(generated.code).not.toContain('Storage\\nComing Later')
  })

  it('keeps Storage page contents out of the active boot path', () => {
    const boot = generated.code.slice(
      generated.code.indexOf('void fg_studio_export_create'),
    )
    const disabledLegacy = boot.slice(
      boot.indexOf('#if 0'),
      boot.indexOf('#endif') + '#endif'.length,
    )
    expect(disabledLegacy).toContain('fg_system_storage_page = lv_obj_create(parent);')
    expect(boot.replace(disabledLegacy, '')).not.toContain(
      'fg_system_storage_page = lv_obj_create(parent);',
    )
    expect(generated.code).toContain('#include "40_SD.h"')
    expect(generated.code).toContain('fg_sd_get_snapshot(&next.snapshot)')
    expect(generated.code).toContain('fg_sd_list_directory(request.path, &next.directory)')
    expect(generated.code).not.toContain('opendir(')
    expect(generated.code).not.toContain('esp_vfs_fat')
  })

  it('constructs Storage lazily once and reuses it', () => {
    expect(generated.code).toContain(
      'if (!fg_system_storage_initialized && !fg_system_storage_create_page()) return;',
    )
    expect(generated.code).toContain(
      'if (fg_system_storage_initialized) return fg_system_storage_page != NULL;',
    )
    expect(generated.code).toContain(
      'fg_system_storage_initialized = true;',
    )
  })

  it('starts bounded worker infrastructure only from a real request', () => {
    expect(generated.code).toContain('xQueueCreate(1, sizeof(fg_storage_request_t))')
    expect(generated.code).toContain(
      'xTaskCreate(fg_system_storage_worker, "fg_sd_worker", FG_STORAGE_WORKER_STACK',
    )
    expect(generated.code).toContain('fg_system_storage_tick_cb')
    const requestStart = generated.code.indexOf(
      'static bool fg_system_storage_request',
    )
    const request = generated.code.slice(
      requestStart,
      generated.code.indexOf(
        'static void fg_system_storage_worker',
        requestStart,
      ),
    )
    expect(request).toContain('xSemaphoreCreateMutex()')
    expect(request).toContain('xQueueCreate(1, sizeof(fg_storage_request_t))')
    expect(request).toContain('lv_timer_create(fg_system_storage_tick_cb, 100, NULL)')
  })

  it('projects bounded directory results through eight reusable paged rows', () => {
    expect(generated.code).toContain('#define FG_STORAGE_VISIBLE_ROWS 8')
    expect(generated.code).toContain(
      'fg_system_storage_rows[FG_STORAGE_VISIBLE_ROWS]',
    )
    expect(generated.code).toContain(
      'fg_system_storage_page_offset + FG_STORAGE_VISIBLE_ROWS',
    )
    expect(generated.code).toContain('fg_system_storage_previous_cb')
    expect(generated.code).toContain('fg_system_storage_next_cb')
    expect(generated.code).toContain(
      'fg_system_storage_page_offset + i < model.directory.count',
    )
    expect(generated.code).toContain(
      'model.snapshot.mounted && model.directory.count == 0',
    )
  })

  it('restores the proven Storage page without selection controls', () => {
    const lazyStart = generated.code.indexOf(
      'static bool fg_system_storage_create_page(void)\n{',
    )
    const lazyPage = generated.code.slice(
      lazyStart,
      generated.code.indexOf('void fg_studio_export_create'),
    )
    ;['Select All', 'Clear Selection', 'Delete Selected', 'New Folder', 'Rename', '"Delete"', 'Format SD Card', '"Mount"', '"Unmount"'].forEach(label =>
      expect(lazyPage).not.toContain(label))
    expect(lazyPage).not.toContain('lv_textarea_create(fg_system_storage_page)')
    expect(lazyPage).toContain('Run R/W Test')
    expect(lazyPage).toContain('FG_STORAGE_VISIBLE_ROWS')
  })

  it('keeps multi-select state and callbacks out of the recovery runtime', () => {
    expect(generated.code).not.toContain('fg_system_storage_selected_entries')
    expect(generated.code).not.toContain('FG_STORAGE_REQ_DELETE_SELECTED')
    expect(generated.code).not.toContain('fg_system_storage_delete_all_cb')
    expect(generated.code).not.toContain('fg_system_storage_create_delete_all_dialog')
  })

  it('uses one click path with explicit folder-selection mode', () => {
    expect(generated.code).toContain(
      'case FG_STORAGE_REQ_DELETE_EMPTY_FOLDER: next.result = fg_sd_delete_empty_folder(request.path, request.name',
    )
    expect(generated.code).not.toContain('FG_STORAGE_REQ_DELETE_FILE')
    expect(generated.code).not.toContain('fg_sd_delete_file(')
    expect(generated.code).not.toContain('fg_sd_delete_file_result_t')
    expect(generated.code).not.toContain('LV_EVENT_LONG_PRESSED')
    expect(generated.code).not.toContain('LV_EVENT_LONG_PRESSED_REPEAT')
    expect(generated.code).toContain('LV_EVENT_CLICKED, &fg_system_storage_row_metadata[i]')
    expect(generated.code).toContain('if (fg_system_storage_select_mode) {')
    expect(generated.code).toContain('if (!metadata->is_directory) return;')
    expect(generated.code).toContain('if (metadata->is_directory && metadata->is_empty) lv_obj_clear_state(fg_system_storage_delete_folder_button')
    expect(generated.code).toContain('strcmp(lv_textarea_get_text(fg_system_storage_delete_folder_input), "DELETE")')
    expect(generated.code).toContain('This folder must be empty.')
  })

  it('rejects hidden and stale rows and returns after exactly one mode branch', () => {
    const start = generated.code.indexOf('static void fg_system_storage_row_cb(lv_event_t * event)\n{')
    const end = generated.code.indexOf('static void fg_system_storage_select_folder_cb', start)
    const callback = generated.code.slice(start, end)
    expect(callback).toContain('!metadata->valid || row < 0 || row >= FG_STORAGE_VISIBLE_ROWS')
    expect(callback).toContain('lv_obj_has_flag(fg_system_storage_rows[row], LV_OBJ_FLAG_HIDDEN)')
    expect(callback).toContain('index != fg_system_storage_page_offset + (size_t)row')
    expect(callback).toContain('index >= fg_system_storage_projection.directory.count')
    expect(callback).toContain('if (fg_system_storage_select_mode) {')
    expect(callback).toContain(
      'lv_obj_clear_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);\n        return;',
    )
    expect(callback.match(/fg_system_storage_request\(FG_STORAGE_REQ_REFRESH/g)).toHaveLength(1)
    expect(callback.match(/lv_event_get_code\(event\)/g)).toHaveLength(1)
  })

  it('projects bounded eligibility into stable eight-row metadata', () => {
    expect(generated.code).toContain(
      'typedef struct { int visible_row; size_t entry_index; bool valid; bool is_directory; bool is_empty; char name[FG_SD_MAX_NAME]; } fg_storage_row_metadata_t;',
    )
    expect(generated.code).toContain(
      'static fg_storage_row_metadata_t fg_system_storage_row_metadata[FG_STORAGE_VISIBLE_ROWS]',
    )
    expect(generated.code).toContain(
      'fg_system_storage_row_metadata[i].is_empty = entry->is_empty;',
    )
    expect(generated.code).toContain(
      'fg_system_storage_row_metadata[i].entry_index = fg_system_storage_page_offset + i;',
    )
    expect(generated.code).not.toContain('delete_file_result')
  })

  it('clears selection mode before refresh and navigation', () => {
    expect(generated.code).toContain(
      'fg_system_storage_refresh_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_storage_leave_select_mode();',
    )
    expect(generated.code).toContain(
      'fg_system_storage_page_offset = 0; fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH',
    )
    expect(generated.code).toContain('"Cancel Selection"')
    expect(generated.code).toContain(
      'fg_system_storage_consumed_generation--; fg_system_storage_tick_cb(NULL);',
    )
    expect(generated.code).toContain(
      'fg_system_storage_leave_select_mode();\n    if (model.result == FG_SD_OK',
    )
  })

  it('keeps the first-open worker request at the proven small size', () => {
    expect(generated.code).toContain(
      'typedef struct { fg_storage_request_kind_t kind; char path[FG_SD_MAX_PATH]; char name[FG_SD_MAX_NAME]; } fg_storage_request_t;',
    )
    expect(generated.code).not.toContain('fg_sd_delete_item_t items[')
    expect(generated.code).not.toContain('fg_sd_delete_result_t delete_result')
  })

  it('initializes every Refresh request field and keeps queue/worker types identical', () => {
    expect(generated.code).toContain('fg_storage_request_t request = { .kind = kind };')
    expect(generated.code).toContain(
      'snprintf(request.path, sizeof(request.path), "%s", path ? path : "");',
    )
    expect(generated.code).toContain(
      'snprintf(request.name, sizeof(request.name), "%s", name ? name : "");',
    )
    expect(generated.code).toContain('xQueueCreate(1, sizeof(fg_storage_request_t))')
    expect(generated.code).toContain('LV_UNUSED(arg); fg_storage_request_t request;')
    expect(generated.code).toContain(
      'xQueueReceive(fg_system_storage_queue, &request, portMAX_DELAY)',
    )
  })

  it('keeps Refresh independent of the request name and valid after selection cancellation', () => {
    const workerStart = generated.code.indexOf('static void fg_system_storage_worker(void * arg)\n{')
    const workerEnd = generated.code.indexOf('static void fg_system_storage_clear_selection', workerStart)
    const worker = generated.code.slice(workerStart, workerEnd)
    expect(worker).toContain('default: next.result = fg_sd_refresh(); break;')
    expect(worker).not.toContain('fg_sd_refresh(request.name')
    expect(generated.code).toContain(
      'fg_system_storage_refresh_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_storage_leave_select_mode();',
    )
    expect(generated.code).toContain(
      'if (fg_system_storage_select_mode) { fg_system_storage_leave_select_mode(); return; }',
    )
  })

  it('keeps the delete confirmation dialog lazy', () => {
    const lazyPage = generated.code.slice(
      generated.code.indexOf('static bool fg_system_storage_create_page(void)\n{'),
      generated.code.indexOf('unavailable:', generated.code.indexOf('static bool fg_system_storage_create_page(void)\n{')),
    )
    expect(lazyPage).not.toContain('fg_system_storage_create_delete_folder_dialog()')
    expect(lazyPage).not.toContain('fg_system_storage_delete_folder_dialog = lv_obj_create')
  })

  it('implements bounded non-recursive deletion with root and busy safety', () => {
    const backend = fs.readFileSync(
      path.resolve(__dirname, '../../../firmware/ForgeUI-One/main/40_SD.c'),
      'utf8',
    )
    expect(backend).toContain('fg_sd_delete_selected')
    expect(backend).toContain('item_count > FG_SD_MAX_DELETE_ITEMS')
    expect(backend).toContain('if (rmdir(target) == 0)')
    expect(backend).toContain('if (unlink(target) == 0)')
    expect(backend).toContain('skipped_non_empty_folders')
    expect(backend).toContain('g_sd_operation_running = false')
    expect(backend).not.toContain('fg_sd_delete_tree_contents')
  })

  it('implements empty-folder deletion with rmdir only', () => {
    const backend = fs.readFileSync(
      path.resolve(__dirname, '../../../firmware/ForgeUI-One/main/40_SD.c'),
      'utf8',
    )
    const start = backend.indexOf('fg_sd_result_t fg_sd_delete_empty_folder')
    const end = backend.indexOf('fg_sd_result_t fg_sd_delete_file', start)
    const operation = backend.slice(start, end)
    expect(operation).toContain('S_ISDIR(st.st_mode)')
    expect(operation).toContain('Folder is not empty.')
    expect(operation).toContain('rmdir(target)')
    expect(operation).not.toContain('unlink(')
    expect(operation).not.toContain('fg_sd_format')
    expect(operation).not.toContain('fg_sd_mount')
    expect(operation.match(/fg_sd_delete_empty_folder\(/g)).toHaveLength(1)
  })

  it('implements bounded regular-file deletion with one unlink and no directory operations', () => {
    const backend = fs.readFileSync(
      path.resolve(__dirname, '../../../firmware/ForgeUI-One/main/40_SD.c'),
      'utf8',
    )
    const start = backend.indexOf('fg_sd_result_t fg_sd_delete_file')
    const end = backend.indexOf('fg_sd_result_t fg_sd_rename_entry', start)
    const operation = backend.slice(start, end)
    expect(operation).toContain('fg_sd_valid_name(file_name)')
    expect(operation).toContain('fg_sd_make_path(relative_parent')
    expect(operation).toContain('S_ISREG(st.st_mode)')
    expect(operation.match(/unlink\(target\)/g)).toHaveLength(1)
    expect(operation).not.toContain('rmdir(')
    expect(operation).not.toContain('fg_sd_format')
    expect(operation).not.toContain('fg_sd_mount')
    expect(operation).not.toContain('fg_sd_unmount')
    expect(operation.match(/fg_sd_delete_file\(/g)).toHaveLength(1)
    expect(operation).toContain('g_sd_operation_running = true')
    expect(operation).toContain('g_sd_operation_running = false')
  })

  it('preserves Back navigation on lazy allocation failure', () => {
    expect(generated.code).toContain(
      'Storage Unavailable\\nUse Back to return to System',
    )
    expect(generated.code).toContain(
      'lv_obj_add_event_cb(back, fg_system_storage_back_cb',
    )
  })

  it('exports the persistent Wi-Fi page and internal navigation', () => {
    expect(generated.code).toContain(
      'fg_system_wifi_page = lv_obj_create(parent);',
    )
    expect(generated.code).toContain(
      'lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);',
    )
    expect(generated.code).toContain(
      'fg_system_wifi_back_cb, LV_EVENT_CLICKED, NULL',
    )
    expect(generated.code).toContain(
      'fg_system_show_page(fg_system_wifi_page);',
    )
  })

  it('wires the complete Wi-Fi intent surface', () => {
    expect(generated.code).toContain('fg_wifi_scan_start();')
    expect(generated.code).toContain('fg_wifi_disconnect();')
    expect(generated.code).toContain('fg_wifi_connect_network(')
    expect(generated.code).toContain('fg_wifi_forget();')
    expect(generated.code).toContain('fg_wifi_reconnect();')
    expect(generated.code).toContain('fg_system_wifi_password_dialog')
    expect(generated.code).toContain('fg_system_wifi_network_rows')
    expect(generated.code).toContain('No Wi-Fi networks found')
    expect(generated.code).toContain(
      'lv_obj_update_layout(fg_system_wifi_network_container);',
    )
  })

  it('styles every Wi-Fi network row state from the exported palette', () => {
    ;[
      'lv_color_hex(0x162436), 0',
      'lv_color_hex(0x42E8FF), LV_STATE_PRESSED',
      'lv_color_hex(0x42E8FF), LV_STATE_FOCUSED',
      'lv_color_hex(0x42E8FF), LV_STATE_FOCUS_KEY',
      'lv_color_hex(0x42E8FF), LV_STATE_CHECKED',
      'lv_color_hex(0x162436), LV_STATE_DISABLED',
      'LV_OPA_40, LV_STATE_DISABLED',
    ].forEach(style => expect(generated.code).toContain(style))
    expect(generated.code).toContain(
      'lv_obj_add_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED)',
    )
    expect(generated.code).not.toContain(
      'lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(0x0000FF)',
    )
  })

  it('opens a shared native keyboard only when the password field is focused', () => {
    expect(generated.code).toContain(
      'fg_system_wifi_keyboard = lv_keyboard_create(parent);',
    )
    expect(generated.code).toContain(
      'lv_keyboard_set_textarea(fg_system_wifi_keyboard, textarea);',
    )
    expect(generated.code).toContain(
      'fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL',
    )
    expect(generated.code).toContain(
      'lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);',
    )
    expect(generated.code).toContain(
      'code == LV_EVENT_READY || code == LV_EVENT_CANCEL',
    )
  })

  it('validates protected-network passwords before calling the backend', () => {
    const validation = generated.code.indexOf(
      'if (password_length < 8 || password_length > 63)',
    )
    const connect = generated.code.indexOf(
      'fg_wifi_result_t result = fg_wifi_connect_network',
    )
    expect(validation).toBeGreaterThan(-1)
    expect(connect).toBeGreaterThan(validation)
    expect(generated.code).toContain(
      'Password must be 8 to 63 characters',
    )
  })

  it('refreshes System Wi-Fi independently of an application widget', () => {
    expect(generated.code).toContain('fg_wifi_get_snapshot(&snapshot)')
    expect(generated.code).toContain('fg_wifi_get_networks(')
    expect(generated.code).toContain(
      'if (fg_wifi_label) {',
    )
    expect(generated.code).not.toContain(
      'if (!fg_wifi_label)',
    )
    expect(generated.code.match(/lv_timer_create\(fg_wifi_tick_cb, 1000, NULL\)/g))
      .toHaveLength(1)
    expect(generated.code).toContain(
      'if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;',
    )
    expect(generated.code).toContain(
      'if (!fg_wifi_scan_in_progress()) (void)fg_wifi_scan_start();',
    )
  })

  it('uses one asynchronous hosted scan task and atomically replaces results', () => {
    const runtime = fs.readFileSync(
      path.resolve(__dirname, '../../../firmware/ForgeUI-One/main/30_WIFI.c'),
      'utf8',
    )
    expect(runtime).toContain(
      'esp_err_t err = esp_wifi_scan_start(&config, true);',
    )
    expect(runtime).toContain(
      'xTaskCreate(hosted_scan_task, "fg_wifi_scan", 4096, NULL, 5, NULL)',
    )
    expect(runtime).toContain(
      'memcpy(g_networks, collected, sizeof(g_networks));',
    )
    expect(runtime).toContain('g_network_count = collected_count;')
    expect(runtime).toContain('memset(g_networks, 0, sizeof(g_networks));')
    expect(runtime).toContain('g_network_count = 0;')
    expect(runtime).toContain('taskENTER_CRITICAL(&g_network_lock);')
    expect(runtime).not.toContain('g_scan_done_pending')
  })

  it('projects complete physical connected details from the backend snapshot', () => {
    ;[
      'snapshot.ssid',
      'snapshot.ip',
      'snapshot.gateway',
      'snapshot.rssi',
      'fg_wifi_signal_quality(snapshot.rssi)',
      'fg_wifi_security_text(snapshot.security)',
      'fg_wifi_status_text()',
      'snapshot.station_mac[0]',
      'snapshot.ap_bssid[0]',
    ].forEach(field => expect(generated.code).toContain(field))
    expect(generated.code).toContain('"Current network     %s"')
    expect(generated.code).toContain('"IP address          %s"')
    expect(generated.code).toContain('"Gateway             %s"')
    expect(generated.code).toContain('"Signal              %d dBm - %s"')
    expect(generated.code).toContain('"Security            %s"')
    expect(generated.code).toContain('"Status              %s%s%s"')
    expect(generated.code).toContain('"Station MAC  %s\\nAP BSSID     %s"')
  })

  it('pauses physical Wi-Fi projection while the password dialog is open', () => {
    const pause = generated.code.indexOf(
      '!lv_obj_has_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN)) return;',
    )
    const snapshot = generated.code.indexOf(
      'fg_wifi_get_snapshot(&snapshot)',
    )
    expect(pause).toBeGreaterThan(-1)
    expect(pause).toBeLessThan(snapshot)
  })

  it('keeps built-in Wi-Fi out of User Events', () => {
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).not.toContain(
      'FG_UserEvent_System_Wifi',
    )
  })

  it('exports a live 10-100 brightness slider through the board API', () => {
    expect(generated.code).toContain(
      'lv_slider_set_range(brightness_slider, 10, 100);',
    )
    expect(generated.code).toContain(
      'LV_EVENT_VALUE_CHANGED',
    )
    expect(generated.code).toContain(
      'bsp_display_brightness_set((int)percent)',
    )
    expect(generated.code).toContain(
      'if (percent < 10) percent = 10;',
    )
    expect(generated.publicApiDeclarations).toEqual([])
  })

  it('retains one static brightness value for the device session', () => {
    expect(generated.code).toContain(
      'static uint8_t fg_system_brightness_percent = 100;',
    )
    expect(generated.code).toContain(
      'lv_slider_set_value(brightness_slider, fg_system_brightness_percent, LV_ANIM_OFF);',
    )
  })
})

if (process.env.FORGEUI_REGENERATE_FIRMWARE === '1') {
  test('regenerates the firmware Studio export from the generator', () => {
    const emptyProject: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: [],
      },
    }
    const output = generateForgeUILvglCode(
      emptyProject,
      'graphite',
      undefined,
      { includeThemeTexture: false },
    ).code
    fs.writeFileSync(
      path.resolve(__dirname, '../../../firmware/ForgeUI-One/main/90_Studio_Export.c'),
      output,
      'utf8',
    )
  })
}
