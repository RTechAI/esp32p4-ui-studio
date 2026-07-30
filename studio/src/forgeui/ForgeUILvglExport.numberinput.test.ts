import { generateForgeUILvglCode } from './ForgeUILvglExport'

const numberInput = (
  id: string,
  componentName = 'Target Temperature Number Input',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'NumberInput',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 280,
    h: 40,
    value: 50,
    min: 0,
    max: 100,
    step: 5,
    precision: 0,
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

describe('Standard NumberInput generated runtime API', () => {
  it('retains the existing textarea and generates setter and hook metadata', () => {
    const generated = generate(numberInput('number'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Target_Temperature_Number_Input_Value(int32_t value);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Target_Temperature_Number_Input_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_target_temperature_number_input = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_target_temperature_number_input_programmatic_update = false;',
    )
    expect(generated.code).toContain(
      'fg_target_temperature_number_input = lv_textarea_create(fg_target_temperature_number_input_container);',
    )
    expect(generated.code).not.toContain('lv_spinbox_create')
  })

  it('retains serialized range, step, and decimal startup text', () => {
    const { code } = generate(numberInput('signed', 'Signed Number Input', {
      value: '-12.50',
      min: -50,
      max: 50,
      step: 5,
      precision: 2,
    }))

    expect(code).toContain(
      'static const int32_t fg_signed_number_input_minimum = -50;',
    )
    expect(code).toContain(
      'static const int32_t fg_signed_number_input_maximum = 50;',
    )
    expect(code).toContain(
      'static const int32_t fg_signed_number_input_step = 5;',
    )
    expect(code).toContain(
      'lv_textarea_set_text(fg_signed_number_input, "-12.50");',
    )
  })

  it('clamps, reads the actual textarea value, and guards setter events', () => {
    const { code } = generate(numberInput('number'))
    const start = code.indexOf(
      'void FG_Set_Target_Temperature_Number_Input_Value(int32_t value)',
    )
    const setter = code.slice(start, start + 1400)

    expect(setter).toContain(
      'if (value < fg_target_temperature_number_input_minimum) value = fg_target_temperature_number_input_minimum;',
    )
    expect(setter).toContain(
      'if (value > fg_target_temperature_number_input_maximum) value = fg_target_temperature_number_input_maximum;',
    )
    expect(setter).toContain(
      'fg_number_input_parse_value(lv_textarea_get_text(fg_target_temperature_number_input), &current_value)',
    )
    expect(setter).toContain('current_value == value) return;')
    expect(setter).toContain(
      'fg_target_temperature_number_input_programmatic_update = true;',
    )
    expect(setter).toContain(
      'lv_textarea_set_text(fg_target_temperature_number_input, value_text);',
    )
    expect(setter).toContain(
      'fg_target_temperature_number_input_programmatic_update = false;',
    )
    expect(setter).not.toContain(
      'FG_On_Target_Temperature_Number_Input_Changed(',
    )
  })

  it('invokes the hook only from genuine native value changes', () => {
    const { code } = generate(numberInput('number'))
    const callbackName =
      'fg_target_temperature_number_input_value_changed_cb'
    const start = code.indexOf(`static void ${callbackName}`)
    const callback = code.slice(start, start + 1700)

    expect(callback).toContain(
      'if (number_input != fg_target_temperature_number_input || fg_target_temperature_number_input_programmatic_update) return;',
    )
    expect(callback).toContain(
      'fg_number_input_parse_value(lv_textarea_get_text(number_input), &value)',
    )
    expect(callback).toContain(
      'if (fg_target_temperature_number_input_value == value) return;',
    )
    expect(callback).toContain(
      'FG_On_Target_Temperature_Number_Input_Changed(value);',
    )
    expect(code).toContain(
      `lv_obj_add_event_cb(fg_target_temperature_number_input, ${callbackName}, LV_EVENT_VALUE_CHANGED, NULL);`,
    )
  })

  it('generates themed increment and decrement controls that consume serialized step', () => {
    const { code } = generate(numberInput('number'))
    const object = 'fg_target_temperature_number_input'

    expect(code).toContain(
      `lv_obj_t * ${object}_increment_button = lv_button_create(${object}_container);`,
    )
    expect(code).toContain(
      `lv_obj_t * ${object}_decrement_button = lv_button_create(${object}_container);`,
    )
    expect(code).toContain(
      `lv_label_set_text(${object}_increment_button_icon, LV_SYMBOL_UP);`,
    )
    expect(code).toContain(
      `lv_label_set_text(${object}_decrement_button_icon, LV_SYMBOL_DOWN);`,
    )
    expect(code).toContain(
      'int64_t next = (int64_t)value + (int64_t)fg_target_temperature_number_input_step;',
    )
    expect(code).toContain(
      'int64_t next = (int64_t)value - (int64_t)fg_target_temperature_number_input_step;',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_target_temperature_number_input_increment_button, fg_target_temperature_number_input_increment_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_target_temperature_number_input_decrement_button, fg_target_temperature_number_input_decrement_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(fg_target_temperature_number_input_increment_button, lv_color_hex(0x2A3138), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(fg_target_temperature_number_input_decrement_button, lv_color_hex(0x121417), LV_PART_MAIN | LV_STATE_PRESSED);',
    )
  })

  it('initializes silently before registering the native event', () => {
    const { code } = generate(numberInput('number'))
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    const initial = creation.indexOf(
      'lv_textarea_set_text(fg_target_temperature_number_input, "50");',
    )
    const registration = creation.indexOf(
      'lv_obj_add_event_cb(fg_target_temperature_number_input',
    )

    expect(initial).toBeGreaterThanOrEqual(0)
    expect(registration).toBeGreaterThan(initial)
    expect(creation.slice(initial, registration)).not.toContain(
      'FG_On_Target_Temperature_Number_Input_Changed',
    )
  })

  it('clamps initial display and keeps value independent from component naming', () => {
    const { code } = generate(numberInput('renamed', 'Renamed Control', {
      value: 150,
      min: 0,
      max: 100,
    }))

    expect(code).toContain(
      'lv_textarea_set_text(fg_renamed_control, "100");',
    )
    expect(code).not.toContain(
      'lv_textarea_set_text(fg_renamed_control, "Renamed Control");',
    )
  })

  it('preserves disabled state without changing the component identity', () => {
    const { code } = generate(numberInput('disabled', 'Disabled Number', {
      isDisabled: true,
    }))

    expect(code).toContain(
      'fg_disabled_number = lv_textarea_create(fg_disabled_number_container);',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_disabled_number, LV_STATE_DISABLED);',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_disabled_number_increment_button, LV_STATE_DISABLED);',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_disabled_number_decrement_button, LV_STATE_DISABLED);',
    )
  })

  it('explicitly owns semantic colours and native textarea parts and states', () => {
    const { code } = generate(numberInput('number'))
    const object = 'fg_target_temperature_number_input'

    expect(code).toContain(
      `lv_obj_set_style_bg_color(${object}, lv_color_hex(0x1E2328), LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_color(${object}, lv_color_hex(0xF2A900), LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_text_color(${object}, lv_color_hex(0xF5F5F5), LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_color(${object}, lv_color_hex(0xF2A900), LV_PART_CURSOR);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_color(${object}, lv_color_hex(0xF2A900), LV_PART_SELECTED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_text_color(${object}, lv_color_hex(0x121417), LV_PART_SELECTED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_color(${object}, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_FOCUSED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_color(${object}, lv_color_hex(0x1E2328), LV_PART_MAIN | LV_STATE_PRESSED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_color(${object}, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_PRESSED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_color(${object}, lv_color_hex(0x2A3138), LV_PART_MAIN | LV_STATE_DISABLED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_text_color(${object}, lv_color_hex(0x7F8284), LV_PART_MAIN | LV_STATE_DISABLED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_opa(${object}, LV_OPA_COVER, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_opa(${object}, LV_OPA_COVER, LV_PART_CURSOR);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_bg_opa(${object}, LV_OPA_COVER, LV_PART_SELECTED);`,
    )
  })

  it('owns one outer frame while preserving only internal stepper dividers', () => {
    const { code } = generate(numberInput('number'))
    const object = 'fg_target_temperature_number_input'
    const increment = `${object}_increment_button`
    const decrement = `${object}_decrement_button`
    const container = `${object}_container`

    expect(code).toContain(
      `lv_obj_t * ${container} = lv_obj_create(fg_application_page);`,
    )
    expect(code).toContain(
      `lv_obj_set_pos(${container}, 20, 30);`,
    )
    expect(code).toContain(
      `lv_obj_set_size(${container}, 280, 40);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_color(${container}, lv_color_hex(0xF2A900), LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_width(${container}, 1, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_radius(${container}, 6, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_outline_width(${container}, 0, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_shadow_width(${container}, 0, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_clear_flag(${container}, LV_OBJ_FLAG_SCROLLABLE | LV_OBJ_FLAG_CLICKABLE);`,
    )
    expect(code).toContain(
      `lv_obj_set_pos(${object}, 1, 1);`,
    )
    expect(code).toContain(
      `lv_obj_set_size(${object}, (280) - 2, (40) - 2);`,
    )

    expect(code).toContain(
      `lv_obj_set_style_border_width(${object}, 0, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_width(${object}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_width(${object}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_width(${object}, 0, LV_PART_MAIN | LV_STATE_PRESSED);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_width(${object}, 0, LV_PART_MAIN | LV_STATE_DISABLED);`,
    )
    expect(code).not.toMatch(
      new RegExp(`lv_obj_set_style_border_width\\(${object}, [1-9]`),
    )
    expect(code).toContain(
      `lv_obj_set_style_border_side(${increment}, LV_BORDER_SIDE_LEFT | LV_BORDER_SIDE_BOTTOM, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_border_side(${decrement}, LV_BORDER_SIDE_LEFT, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_outline_width(${increment}, 0, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_shadow_width(${decrement}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`,
    )
    expect(code).toContain(
      `lv_obj_add_event_cb(${increment}, fg_target_temperature_number_input_increment_cb, LV_EVENT_CLICKED, NULL);`,
    )
    expect(code).toContain(
      `lv_obj_add_event_cb(${decrement}, fg_target_temperature_number_input_decrement_cb, LV_EVENT_CLICKED, NULL);`,
    )
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      numberInput('a', 'Setpoint Number Input'),
      numberInput('b', 'Setpoint Number Input'),
      numberInput('c', 'Setpoint-Number Input'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Setpoint_Number_Input_Value(int32_t value);',
      'void FG_Set_Setpoint_Number_Input_2_Value(int32_t value);',
      'void FG_Set_Setpoint_Number_Input_3_Value(int32_t value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Setpoint_Number_Input_Changed',
      'FG_On_Setpoint_Number_Input_2_Changed',
      'FG_On_Setpoint_Number_Input_3_Changed',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_setpoint_number_input_2 = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_setpoint_number_input_3_programmatic_update = false;',
    )
  })

  it('does not change neighboring Standard Runtime API families', () => {
    const input: IComponent = {
      ...numberInput('input', 'Search Input'),
      type: 'Input',
    }
    const progress: IComponent = {
      ...numberInput('progress', 'Download Progress'),
      type: 'Progress',
    }
    const generated = generate(input, progress, numberInput('number'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Search_Input_Text(const char * text);',
      'void FG_Set_Download_Progress_Value(int32_t value);',
      'void FG_Set_Target_Temperature_Number_Input_Value(int32_t value);',
    ]))
    expect(generated.userEventHooks).not.toContain(
      'FG_On_Download_Progress_Changed',
    )
  })
})
