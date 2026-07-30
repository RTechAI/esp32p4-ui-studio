import { generateForgeUILvglCode } from './ForgeUILvglExport'

const select = (
  id: string,
  componentName = 'Mode Select',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Select',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 220,
    h: 40,
    options: ['Automatic', 'Manual', 'Service'],
    selectedIndex: 1,
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

describe('Standard Select generated runtime API', () => {
  it('retains the native dropdown and generates setter and hook metadata', () => {
    const generated = generate(select('select'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Mode_Select_Selected_Index(uint32_t index);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Mode_Select_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_mode_select = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_mode_select_programmatic_update = false;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_mode_select_option_count = 3;',
    )
    expect(generated.code).toContain(
      'fg_mode_select = lv_dropdown_create(fg_application_page);',
    )
    expect(generated.code).not.toContain('lv_roller_create')
  })

  it('exports the serialized options and silently initializes selection', () => {
    const { code } = generate(select('select'))
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    const options = creation.indexOf(
      'lv_dropdown_set_options(fg_mode_select, "Automatic\\nManual\\nService");',
    )
    const initial = creation.indexOf(
      'lv_dropdown_set_selected(fg_mode_select, 1);',
    )
    const registration = creation.indexOf(
      'lv_obj_add_event_cb(fg_mode_select',
    )

    expect(options).toBeGreaterThanOrEqual(0)
    expect(initial).toBeGreaterThan(options)
    expect(registration).toBeGreaterThan(initial)
    expect(creation.slice(initial, registration))
      .not.toContain('FG_On_Mode_Select_Changed')
  })

  it('explicitly themes the closed field, arrow, interaction states, and popup list', () => {
    const { code } = generate(select('select'))

    expect(code).toContain(
      'lv_obj_set_style_border_width(fg_mode_select, 1, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_radius(fg_mode_select, 8, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_outline_width(fg_mode_select, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(fg_mode_select, lv_color_hex(0xF5F5F5), LV_PART_INDICATOR);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(fg_mode_select, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(fg_mode_select, lv_color_hex(0x2A3138), LV_PART_MAIN | LV_STATE_DISABLED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_opa(fg_mode_select, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);',
    )
    expect(code).toContain(
      'lv_obj_t * fg_mode_select_list = lv_dropdown_get_list(fg_mode_select);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_color(fg_mode_select_list, lv_color_hex(0xF2A900), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(fg_mode_select_list, lv_color_hex(0xF2A900), LV_PART_SELECTED | LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(fg_mode_select_list, lv_color_hex(0x121417), LV_PART_SELECTED | LV_STATE_CHECKED);',
    )
    expect(code).not.toMatch(/lv_color_hex\(0x(?:2196F3|1976D2|0000FF)\)/)
  })

  it('clamps, compares native state, and guards programmatic updates', () => {
    const { code } = generate(select('select'))
    const start = code.indexOf(
      'void FG_Set_Mode_Select_Selected_Index(uint32_t index)',
    )
    const setter = code.slice(start, start + 1000)

    expect(setter).toContain(
      'if (fg_mode_select == NULL || fg_mode_select_option_count == 0) return;',
    )
    expect(setter).toContain(
      'if (index >= fg_mode_select_option_count) index = fg_mode_select_option_count - 1;',
    )
    expect(setter).toContain(
      'if (lv_dropdown_get_selected(fg_mode_select) == index)',
    )
    expect(setter).toContain(
      'fg_mode_select_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_dropdown_set_selected(fg_mode_select, index);',
    )
    expect(setter).toContain(
      'fg_mode_select_programmatic_update = false;',
    )
    expect(setter).not.toContain('FG_On_Mode_Select_Changed(')
  })

  it('reports genuine native index and selected text exactly once', () => {
    const { code } = generate(select('select'))
    const start = code.indexOf(
      'static void fg_mode_select_value_changed_cb',
    )
    const callback = code.slice(start, start + 1100)

    expect(callback).toContain(
      'if (select != fg_mode_select || fg_mode_select_programmatic_update || fg_mode_select_option_count == 0) return;',
    )
    expect(callback).toContain(
      'uint32_t index = lv_dropdown_get_selected(select);',
    )
    expect(callback).toContain(
      'index == fg_mode_select_selected_index) return;',
    )
    expect(callback).toContain(
      'lv_dropdown_get_selected_str(select, selected_text, sizeof(selected_text));',
    )
    expect(callback).toContain(
      'FG_On_Mode_Select_Changed(index, selected_text);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_mode_select, fg_mode_select_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
  })

  it('handles empty, single, and invalid-index configurations safely', () => {
    const empty = generate(select('empty', 'Empty Select', {
      options: [],
      selectedIndex: 99,
    }))
    expect(empty.code).toContain(
      'static const uint32_t fg_empty_select_option_count = 0;',
    )
    expect(empty.code).toContain(
      'lv_dropdown_set_options(fg_empty_select, "");',
    )
    const emptyCreation = empty.code.slice(
      empty.code.indexOf('void fg_studio_export_create'),
    )
    expect(emptyCreation).not.toContain(
      'lv_dropdown_set_selected(fg_empty_select',
    )

    const single = generate(select('single', 'Single Select', {
      options: ['Only'],
      selectedIndex: 99,
    }))
    expect(single.code).toContain(
      'lv_dropdown_set_selected(fg_single_select, 0);',
    )
  })

  it('preserves duplicate and long option text with a safe callback buffer', () => {
    const longOption = 'A very long deterministic option label'
    const { code } = generate(select('select', 'Mode Select', {
      options: ['Same', 'Same', longOption],
      selectedIndex: 2,
    }))

    expect(code).toContain(
      `lv_dropdown_set_options(fg_mode_select, "Same\\nSame\\n${longOption}");`,
    )
    expect(code).toContain(
      `char selected_text[${longOption.length + 1}];`,
    )
  })

  it('keeps value independent from component renaming and preserves disabled state', () => {
    const { code } = generate(select('renamed', 'Renamed Control', {
      options: ['Alpha', 'Beta'],
      selectedIndex: 1,
      isDisabled: true,
    }))

    expect(code).toContain(
      'lv_dropdown_set_selected(fg_renamed_control, 1);',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_renamed_control, LV_STATE_DISABLED);',
    )
    expect(code).not.toContain(
      'lv_dropdown_set_options(fg_renamed_control, "Renamed Control");',
    )
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      select('a', 'Mode Select'),
      select('b', 'Mode Select'),
      select('c', 'Mode-Select'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Mode_Select_Selected_Index(uint32_t index);',
      'void FG_Set_Mode_Select_2_Selected_Index(uint32_t index);',
      'void FG_Set_Mode_Select_3_Selected_Index(uint32_t index);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Mode_Select_Changed',
      'FG_On_Mode_Select_2_Changed',
      'FG_On_Mode_Select_3_Changed',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_mode_select_2 = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_mode_select_3_programmatic_update = false;',
    )
  })

  it('leaves Roller, Button Matrix, and NumberInput API families intact', () => {
    const roller: IComponent = {
      ...select('roller', 'Option Roller'),
      type: 'Roller',
    }
    const matrix: IComponent = {
      ...select('matrix', 'Menu Matrix'),
      type: 'ButtonMatrix',
    }
    const number: IComponent = {
      ...select('number', 'Setpoint Number Input', { value: 50 }),
      type: 'NumberInput',
    }
    const generated = generate(
      roller,
      matrix,
      number,
      select('select'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Option_Roller_Selected(uint32_t index);',
      'void FG_Set_Menu_Matrix_Selected(uint32_t button_index);',
      'void FG_Set_Setpoint_Number_Input_Value(int32_t value);',
      'void FG_Set_Mode_Select_Selected_Index(uint32_t index);',
    ]))
  })
})
