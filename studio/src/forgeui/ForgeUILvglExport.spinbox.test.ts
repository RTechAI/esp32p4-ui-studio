import { generateForgeUILvglCode } from './ForgeUILvglExport'

const spinbox = (
  id: string,
  componentName = 'Native Spinbox',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Spinbox',
  componentName,
  props: { x: 20, y: 30, w: 220, h: 48, ...props },
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

describe('Native LVGL Spinbox export', () => {
  it('emits native configuration, touch buttons, runtime setter and user hook', () => {
    const generated = generate(spinbox('main', 'System Setpoint', {
      min: -100,
      max: 100,
      value: -25,
      step: 10,
      digitCount: 3,
      decimalPlaces: 1,
      cursorPosition: 1,
      rollover: true,
      textAlign: 'center',
    }))
    expect(generated.code).toContain(
      'fg_system_setpoint_spinbox = lv_spinbox_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_digit_format(fg_system_setpoint_spinbox, 3, 2);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_range(fg_system_setpoint_spinbox, -100, 100);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_value(fg_system_setpoint_spinbox, -25);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_rollover(fg_system_setpoint_spinbox, true);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_cursor_pos(fg_system_setpoint_spinbox, 1);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_set_step(fg_system_setpoint_spinbox, 10);',
    )
    expect(generated.code).toContain(
      'lv_obj_add_flag(fg_system_setpoint_spinbox, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);',
    )
    expect(generated.code).toContain(
      'lv_obj_add_flag(fg_system_setpoint_spinbox_increment_button, LV_OBJ_FLAG_CLICKABLE);',
    )
    expect(generated.code).toContain(
      'lv_obj_move_foreground(fg_system_setpoint_spinbox_increment_button);',
    )
    expect(generated.code).toContain(
      'lv_obj_add_event_cb(fg_system_setpoint_spinbox, fg_system_setpoint_spinbox_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_increment(fg_system_setpoint_spinbox);',
    )
    expect(generated.code).toContain(
      'lv_spinbox_decrement(fg_system_setpoint_spinbox);',
    )
    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_System_Setpoint_Value(int32_t value);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_System_Setpoint_Changed',
    )
  })

  it('clamps silently, suppresses repeats and invokes hooks only from user sync', () => {
    const generated = generate(spinbox('main', 'Setpoint'))
    const setter = generated.code.slice(
      generated.code.indexOf('void FG_Set_Setpoint_Value'),
    )
    expect(setter).toContain('if (value < fg_setpoint_spinbox_minimum)')
    expect(setter).toContain('if (value > fg_setpoint_spinbox_maximum)')
    expect(setter).toContain(
      'if (fg_setpoint_spinbox == NULL || fg_setpoint_spinbox_value == value) return;',
    )
    expect(setter).toContain('fg_setpoint_spinbox_programmatic_update = true;')
    expect(setter).not.toContain('FG_On_Setpoint_Changed(value);')
    expect(generated.code).toContain('FG_On_Setpoint_Changed(value);')
    expect(generated.code.indexOf('lv_spinbox_set_value(fg_setpoint_spinbox, 0);'))
      .toBeLessThan(generated.code.indexOf(
        'lv_obj_add_event_cb(fg_setpoint_spinbox, fg_setpoint_spinbox_changed_cb',
      ))
  })

  it('supports multiple instances and duplicate names collision-safely', () => {
    const generated = generate(
      spinbox('a', 'Setpoint'),
      spinbox('b', 'Setpoint', { value: 10 }),
    )
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Setpoint_Value(int32_t value);',
      'void FG_Set_Setpoint_2_Value(int32_t value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Setpoint_Changed',
      'FG_On_Setpoint_2_Changed',
    ]))
    expect(generated.code.match(/lv_spinbox_create/g)).toHaveLength(2)
  })

  it('is naturally feature-gated when unused and does not alter NumberInput', () => {
    const generated = generate()
    expect(generated.code).not.toContain('lv_spinbox_')
    expect(generated.publicApiDeclarations).toEqual([])
    expect(generated.userEventHooks).toEqual([])
  })
})
