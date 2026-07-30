import { generateForgeUILvglCode } from './ForgeUILvglExport'

const radio = (
  id = 'radio',
  componentName = 'Automatic Mode Radio',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Radio',
  componentName,
  props: {
    x: 20,
    y: 20,
    w: 220,
    h: 40,
    children: 'Automatic mode',
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

describe('Standard Radio generated developer API', () => {
  it('retains a circular native selectable object and exports Radio APIs', () => {
    const generated = generate(radio())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Automatic_Mode_Radio_Selected(bool selected);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Automatic_Mode_Radio_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_automatic_mode_radio_radio = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_automatic_mode_radio_radio_programmatic_update = false;',
    )
    expect(generated.code).toContain(
      'fg_automatic_mode_radio_radio = lv_checkbox_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_radius(fg_automatic_mode_radio_radio, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);',
    )
  })

  it('keeps label text serialized and independent from component naming', () => {
    const { code } = generate(radio('label', 'Renamed Component', {
      children: 'Manual mode',
    }))

    expect(code).toContain(
      'lv_checkbox_set_text(fg_renamed_component_radio, "Manual mode");',
    )
    expect(code).not.toContain(
      'lv_checkbox_set_text(fg_renamed_component_radio, "Renamed Component");',
    )
  })

  it('emits no default or legacy Radio label', () => {
    const { code } = generate(radio('unlabelled', 'Radio', {
      children: 'Radio',
    }))

    expect(code).toContain(
      'lv_checkbox_set_text(fg_radio_radio, "");',
    )
    expect(code).not.toContain(
      'lv_checkbox_set_text(fg_radio_radio, "Radio");',
    )
  })

  it('silently compares, selects, and unselects programmatic state', () => {
    const { code } = generate(radio())
    const start = code.indexOf(
      'void FG_Set_Automatic_Mode_Radio_Selected(bool selected)',
    )
    const setter = code.slice(start, start + 950)

    expect(setter).toContain(
      'bool current_selected = lv_obj_has_state(fg_automatic_mode_radio_radio, LV_STATE_CHECKED);',
    )
    expect(setter).toContain('if (current_selected == selected) return;')
    expect(setter).toContain(
      'fg_automatic_mode_radio_radio_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_obj_add_state(fg_automatic_mode_radio_radio, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'lv_obj_remove_state(fg_automatic_mode_radio_radio, LV_STATE_CHECKED);',
    )
    expect(setter).toContain(
      'fg_automatic_mode_radio_radio_programmatic_update = false;',
    )
    expect(setter).not.toContain(
      'FG_On_Automatic_Mode_Radio_Changed(',
    )
  })

  it('calls the hook only for genuine native value changes', () => {
    const { code } = generate(radio())

    expect(code).toContain(
      'lv_obj_add_event_cb(fg_automatic_mode_radio_radio, fg_automatic_mode_radio_radio_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (radio_object != fg_automatic_mode_radio_radio || fg_automatic_mode_radio_radio_programmatic_update) return;',
    )
    expect(code).toContain(
      'bool selected = lv_obj_has_state(radio_object, LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'FG_On_Automatic_Mode_Radio_Changed(selected);',
    )
  })

  it('applies the initial state before callback registration without grouping', () => {
    const { code } = generate(
      radio('automatic', 'Automatic Radio', { isChecked: true }),
      radio('manual', 'Manual Radio', { isChecked: true }),
    )
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))

    expect(creation).toContain(
      'lv_obj_add_state(fg_automatic_radio_radio, LV_STATE_CHECKED);',
    )
    expect(creation).toContain(
      'lv_obj_add_state(fg_manual_radio_radio, LV_STATE_CHECKED);',
    )
    expect(creation).not.toContain('radio_group')
    expect(creation).not.toContain('FG_On_Automatic_Radio_Changed(')
    expect(creation).not.toContain('FG_On_Manual_Radio_Changed(')
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      radio('a', 'Mode Radio'),
      radio('b', 'Mode Radio'),
      radio('c', 'Mode-Radio'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Mode_Radio_Selected(bool selected);',
      'void FG_Set_Mode_Radio_2_Selected(bool selected);',
      'void FG_Set_Mode_Radio_3_Selected(bool selected);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Mode_Radio_Changed',
      'FG_On_Mode_Radio_2_Changed',
      'FG_On_Mode_Radio_3_Changed',
    ]))
  })

  it('leaves Checkbox and Switch API families distinct', () => {
    const checkbox: IComponent = {
      ...radio('checkbox', 'Option Checkbox'),
      type: 'Checkbox',
    }
    const standardSwitch: IComponent = {
      ...radio('switch', 'Power Switch'),
      type: 'Switch',
    }
    const generated = generate(radio(), checkbox, standardSwitch)

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Automatic_Mode_Radio_Selected(bool selected);',
      'void FG_Set_Option_Checkbox_Checked(bool checked);',
      'void FG_Set_Power_Switch_Checked(bool checked);',
    ]))
  })
})
