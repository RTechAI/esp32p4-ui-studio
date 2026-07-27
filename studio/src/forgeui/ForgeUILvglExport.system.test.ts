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

  it('creates Display and Wi-Fi as interactive launcher cards', () => {
    expect(generated.code).toContain(
      'fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL',
    )
    ;[
      'Bluetooth',
      'Sound',
      'Storage',
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
      'lv_keyboard_set_textarea(fg_system_wifi_keyboard, fg_system_wifi_password_input);',
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
