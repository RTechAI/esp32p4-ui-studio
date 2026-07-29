import { generateForgeUILvglCode } from './ForgeUILvglExport'

const checkbox = (
  id = 'checkbox',
  componentName = 'Enable Logging Checkbox',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Checkbox',
  componentName,
  props: {
    x: 20,
    y: 20,
    w: 240,
    h: 40,
    children: 'Enable logging',
    isChecked: false,
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

describe('Standard Checkbox generated developer API', () => {
  it('retains the native checkbox and exports a checked setter and hook', () => {
    const generated = generate(checkbox())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Enable_Logging_Checkbox_Checked(bool checked);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Enable_Logging_Checkbox_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_enable_logging_checkbox_checkbox = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_enable_logging_checkbox_checkbox_programmatic_update = false;',
    )
    expect(generated.code).toContain(
      'fg_enable_logging_checkbox_checkbox = lv_checkbox_create(fg_application_page);',
    )
  })

  it('preserves serialized label ownership and existing styles', () => {
    const { code } = generate(checkbox('label', 'Renamed Component', {
      children: 'Record diagnostics',
    }))

    expect(code).toContain(
      'lv_checkbox_set_text(fg_renamed_component_checkbox, "Record diagnostics");',
    )
    expect(code).not.toContain(
      'lv_checkbox_set_text(fg_renamed_component_checkbox, "Renamed Component");',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(fg_renamed_component_checkbox, lv_color_hex',
    )
  })

  it('silently compares, checks, and unchecks programmatic state', () => {
    const { code } = generate(checkbox())
    const start = code.indexOf(
      'void FG_Set_Enable_Logging_Checkbox_Checked(bool checked)',
    )
    const setter = code.slice(start, start + 950)

    expect(setter).toContain(
      'bool current_checked = lv_obj_has_state(fg_enable_logging_checkbox_checkbox, LV_STATE_CHECKED);',
    )
    expect(setter).toContain('if (current_checked == checked) return;')
    expect(setter).toContain(
      'fg_enable_logging_checkbox_checkbox_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_obj_add_state(fg_enable_logging_checkbox_checkbox, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'lv_obj_remove_state(fg_enable_logging_checkbox_checkbox, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'fg_enable_logging_checkbox_checkbox_programmatic_update = false;',
    )
    expect(setter).not.toContain(
      'FG_On_Enable_Logging_Checkbox_Changed(',
    )
  })

  it('calls the hook only for genuine native value changes', () => {
    const { code } = generate(checkbox())

    expect(code).toContain(
      'lv_obj_add_event_cb(fg_enable_logging_checkbox_checkbox, fg_enable_logging_checkbox_checkbox_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (checkbox_object != fg_enable_logging_checkbox_checkbox || fg_enable_logging_checkbox_checkbox_programmatic_update) return;',
    )
    expect(code).toContain(
      'bool checked = lv_obj_has_state(checkbox_object, LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'FG_On_Enable_Logging_Checkbox_Changed(checked);',
    )
  })

  it('applies initial state silently before event registration', () => {
    const { code } = generate(checkbox('checked', 'Option Checkbox', {
      isChecked: true,
    }))
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    const initial = creation.indexOf(
      'lv_obj_add_state(fg_option_checkbox_checkbox, LV_STATE_CHECKED);',
    )
    const callback = creation.indexOf(
      'lv_obj_add_event_cb(fg_option_checkbox_checkbox, fg_option_checkbox_checkbox_value_changed_cb',
    )

    expect(initial).toBeGreaterThan(-1)
    expect(callback).toBeGreaterThan(initial)
    expect(creation).not.toContain('FG_On_Option_Checkbox_Changed(')
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      checkbox('a', 'Option Checkbox'),
      checkbox('b', 'Option Checkbox'),
      checkbox('c', 'Option-Checkbox'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Option_Checkbox_Checked(bool checked);',
      'void FG_Set_Option_Checkbox_2_Checked(bool checked);',
      'void FG_Set_Option_Checkbox_3_Checked(bool checked);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Option_Checkbox_Changed',
      'FG_On_Option_Checkbox_2_Changed',
      'FG_On_Option_Checkbox_3_Changed',
    ]))
  })

  it('does not generate Checkbox APIs for Switch or Radio', () => {
    const standardSwitch: IComponent = {
      ...checkbox('switch', 'Power Switch'),
      type: 'Switch',
    }
    const radio: IComponent = {
      ...checkbox('radio', 'Mode Radio'),
      type: 'Radio',
    }
    const generated = generate(checkbox(), standardSwitch, radio)

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Power_Switch_Checked(bool checked);',
    )
    expect(generated.publicApiDeclarations).not.toContain(
      'void FG_Set_Mode_Radio_Checked(bool checked);',
    )
  })
})
