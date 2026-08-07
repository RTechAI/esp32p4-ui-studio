import { generateForgeUILvglCode } from './ForgeUILvglExport'

describe('ordinary widget C declaration ordering', () => {
  it('declares LED state and Switch callbacks before create with Settings Launcher disabled', () => {
    const generated = generateForgeUILvglCode({
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['status-light', 'output-toggle'],
      },
      'status-light': {
        id: 'status-light', parent: 'root', type: 'Led',
        componentName: 'Status Light', props: { on: false }, children: [],
      },
      'output-toggle': {
        id: 'output-toggle', parent: 'root', type: 'Switch',
        componentName: 'Output Toggle', props: { isChecked: false }, children: [],
      },
    } as IComponents, 'graphite', undefined, {
      includeThemeTexture: false,
      firmwareFeatures: {
        settingsLauncher: false,
      },
    }).code

    const createAt = generated.indexOf('void fg_studio_export_create(')
    const requiredBeforeCreate = [
      'static lv_obj_t * fg_status_light_led = NULL;',
      'static bool fg_status_light_led_on = false;',
      'static lv_obj_t * fg_output_toggle_switch = NULL;',
      'static bool fg_output_toggle_switch_programmatic_update = false;',
      'static void fg_output_toggle_switch_value_changed_cb(lv_event_t * event);',
    ]

    expect(createAt).toBeGreaterThan(0)
    requiredBeforeCreate.forEach(declaration => {
      const declarationAt = generated.indexOf(declaration)
      expect(declarationAt).toBeGreaterThan(0)
      expect(declarationAt).toBeLessThan(createAt)
    })
    expect(generated).toContain('void FG_Set_Status_Light(bool on)')
    expect(generated).toContain('FG_On_Output_Toggle_Changed(checked);')
  })
})
