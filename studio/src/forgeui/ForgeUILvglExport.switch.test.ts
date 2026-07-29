import { generateForgeUILvglCode } from './ForgeUILvglExport'

const standardSwitch = (
  id = 'switch',
  componentName = 'Enable WiFi Switch',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Switch',
  componentName,
  props: { x: 20, y: 20, w: 64, h: 36, isChecked: false, ...props },
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

describe('Standard Switch generated developer API', () => {
  it('retains the native switch and generates checked setter and hook', () => {
    const generated = generate(standardSwitch())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Enable_Wi_Fi_Switch_Checked(bool checked);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Enable_Wi_Fi_Switch_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_enable_wi_fi_switch_switch = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_enable_wi_fi_switch_switch_programmatic_update = false;',
    )
    expect(generated.code).toContain(
      'fg_enable_wi_fi_switch_switch = lv_switch_create(fg_application_page);',
    )
  })

  it('silently compares, checks, and unchecks programmatic state', () => {
    const { code } = generate(standardSwitch())
    const start = code.indexOf(
      'void FG_Set_Enable_Wi_Fi_Switch_Checked(bool checked)',
    )
    const setter = code.slice(start, start + 900)

    expect(setter).toContain(
      'bool current_checked = lv_obj_has_state(fg_enable_wi_fi_switch_switch, LV_STATE_CHECKED);',
    )
    expect(setter).toContain('if (current_checked == checked) return;')
    expect(setter).toContain(
      'fg_enable_wi_fi_switch_switch_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_obj_add_state(fg_enable_wi_fi_switch_switch, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'lv_obj_remove_state(fg_enable_wi_fi_switch_switch, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'fg_enable_wi_fi_switch_switch_programmatic_update = false;',
    )
    expect(setter).not.toContain('FG_On_Enable_Wi_Fi_Switch_Changed(')
  })

  it('delivers only genuine native value changes to the hook', () => {
    const { code } = generate(standardSwitch())

    expect(code).toContain(
      'lv_obj_add_event_cb(fg_enable_wi_fi_switch_switch, fg_enable_wi_fi_switch_switch_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (switch_object != fg_enable_wi_fi_switch_switch || fg_enable_wi_fi_switch_switch_programmatic_update) return;',
    )
    expect(code).toContain(
      'bool checked = lv_obj_has_state(switch_object, LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'FG_On_Enable_Wi_Fi_Switch_Changed(checked);',
    )
  })

  it('applies initial checked state before registering the callback', () => {
    const { code } = generate(standardSwitch('checked', 'Power Switch', {
      isChecked: true,
    }))
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    const initial = creation.indexOf(
      'lv_obj_add_state(fg_power_switch_switch, LV_STATE_CHECKED);',
    )
    const callback = creation.indexOf(
      'lv_obj_add_event_cb(fg_power_switch_switch, fg_power_switch_switch_value_changed_cb',
    )

    expect(initial).toBeGreaterThan(-1)
    expect(callback).toBeGreaterThan(initial)
    expect(creation).not.toContain('FG_On_Power_Switch_Changed(')
  })

  it('handles duplicate and sanitized-name collisions deterministically', () => {
    const generated = generate(
      standardSwitch('a', 'Enable Switch'),
      standardSwitch('b', 'Enable Switch'),
      standardSwitch('c', 'Enable-Switch'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Enable_Switch_Checked(bool checked);',
      'void FG_Set_Enable_Switch_2_Checked(bool checked);',
      'void FG_Set_Enable_Switch_3_Checked(bool checked);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Enable_Switch_Changed',
      'FG_On_Enable_Switch_2_Changed',
      'FG_On_Enable_Switch_3_Changed',
    ]))
  })

  it('does not alter Interactive Toggle Switch generation', () => {
    const interactive: IComponent = {
      id: 'interactive',
      parent: 'root',
      type: 'InteractiveToggleSwitch',
      componentName: 'Asset Toggle',
      props: { x: 100, y: 20, w: 64, h: 36 },
      children: [],
    }
    const generated = generate(standardSwitch(), interactive)

    expect(generated.code).toContain('Missing Interactive Toggle Assets')
    expect(generated.publicApiDeclarations).not.toContain(
      'void FG_Set_Asset_Toggle_Checked(bool checked);',
    )
  })
})
