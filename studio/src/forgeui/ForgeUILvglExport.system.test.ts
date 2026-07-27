import { generateForgeUILvglCode } from './ForgeUILvglExport'

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

  it('creates only Display as an interactive launcher card', () => {
    expect(generated.code).toContain(
      'fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL',
    )
    ;[
      'Wi-Fi',
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
