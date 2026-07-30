import { generateForgeUILvglCode } from './ForgeUILvglExport'

const iconButton = (
  id: string,
  componentName = 'Settings Icon Button',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'IconButton',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 56,
    h: 56,
    icon: 'FiSettings',
    ...props,
  },
  children: [],
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('Standard IconButton generated runtime API', () => {
  it('retains the native button and enabled state', () => {
    const generated = generate(iconButton('settings'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Settings_Icon_Button_Enabled(bool enabled);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Settings_Icon_Button_Clicked',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_settings_icon_button = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_settings_icon_button_enabled = true;',
    )
    expect(generated.code).toContain(
      'fg_settings_icon_button = lv_button_create(fg_application_page);',
    )
  })

  it('suppresses unavailable and unchanged setter calls', () => {
    const { code } = generate(iconButton('settings'))
    const start = code.indexOf(
      'void FG_Set_Settings_Icon_Button_Enabled(bool enabled)',
    )
    const setter = code.slice(start, start + 650)

    expect(setter).toContain(
      'if (fg_settings_icon_button == NULL || fg_settings_icon_button_enabled == enabled) return;',
    )
    expect(setter).toContain(
      'fg_settings_icon_button_enabled = enabled;',
    )
    expect(setter).toContain(
      'lv_obj_clear_state(fg_settings_icon_button, LV_STATE_DISABLED);',
    )
    expect(setter).toContain(
      'lv_obj_add_state(fg_settings_icon_button, LV_STATE_DISABLED);',
    )
    expect(setter).not.toContain(
      'FG_On_Settings_Icon_Button_Clicked();',
    )
  })

  it('fires the hook only from the genuine LVGL click callback', () => {
    const { code } = generate(iconButton('settings'))
    const callbackStart = code.indexOf(
      'static void fg_settings_icon_button_clicked_cb(lv_event_t * event)',
    )
    const callback = code.slice(callbackStart, callbackStart + 400)

    expect(callback).toContain(
      'if (fg_settings_icon_button == NULL || !fg_settings_icon_button_enabled) return;',
    )
    expect(callback).toContain(
      'FG_On_Settings_Icon_Button_Clicked();',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_settings_icon_button, fg_settings_icon_button_clicked_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(code.indexOf('FG_On_Settings_Icon_Button_Clicked();'))
      .toBeLessThan(code.indexOf(
        'void FG_Set_Settings_Icon_Button_Enabled(bool enabled)',
      ))
  })

  it('preserves disabled initialization and uses the canonical Settings asset', () => {
    const { code, assetSources } = generate(iconButton('settings', 'Settings Icon Button', {
      isDisabled: true,
    }))

    expect(code).toContain(
      'static bool fg_settings_icon_button_enabled = false;',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_settings_icon_button, LV_STATE_DISABLED);',
    )
    expect(code).toContain(
      'lv_image_set_src(obj1_icon, &fg_icon_settings_fi_48px);',
    )
    expect(code).toContain('lv_image_set_scale(obj1_icon, 85);')
    expect(code).not.toContain('LV_SYMBOL_SETTINGS')
    expect(assetSources).toContain('assets/icons/fg_icon_settings_fi_48px.c')
    expect(code).toContain('lv_obj_set_pos(fg_settings_icon_button, 20, 30);')
    expect(code).toContain('lv_obj_set_size(fg_settings_icon_button, 56, 56);')
  })

  it('allocates deterministic collision-safe APIs and hooks', () => {
    const generated = generate(
      iconButton('a', 'Settings Icon Button'),
      iconButton('b', 'Settings Icon Button'),
      iconButton('c', 'Settings-Icon Button'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Settings_Icon_Button_Enabled(bool enabled);',
      'void FG_Set_Settings_Icon_Button_2_Enabled(bool enabled);',
      'void FG_Set_Settings_Icon_Button_3_Enabled(bool enabled);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Settings_Icon_Button_Clicked',
      'FG_On_Settings_Icon_Button_2_Clicked',
      'FG_On_Settings_Icon_Button_3_Clicked',
    ]))
  })

  it('does not create an Icon source API', () => {
    const generated = generate(iconButton('settings'))

    expect(generated.publicApiDeclarations.join('\n'))
      .not.toContain('Icon_Button_Source')
    expect(generated.code).not.toContain(
      'FG_Set_Settings_Icon_Button_Source',
    )
  })

  it('keeps unrelated icons on their existing LVGL symbol path', () => {
    const { code } = generate(iconButton(
      'wifi',
      'WiFi Icon Button',
      { icon: 'FiWifi' },
    ))

    expect(code).toContain('lv_label_set_text(obj1_label, LV_SYMBOL_WIFI);')
    expect(code).not.toContain('lv_image_set_src(obj1_icon, &fg_icon_settings_fi_48px);')
    expect(code).not.toContain('LV_SYMBOL_SETTINGS')
  })
})
