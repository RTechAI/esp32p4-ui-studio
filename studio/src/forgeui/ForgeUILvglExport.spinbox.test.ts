import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'
import path from 'path'

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

  it('emits two visible, clickable foreground helpers with matching callbacks', () => {
    const { code } = generate(spinbox('main', 'Setpoint', {
      x: '110',
      y: '163',
      w: '220',
      h: '48',
    }))
    const buttonCreates = code.match(
      /lv_obj_t \* fg_setpoint_spinbox_(?:increment|decrement)_button = lv_button_create\(fg_application_page\);/g,
    )
    expect(buttonCreates).toHaveLength(2)
    expect(code).toContain(
      'lv_obj_add_flag(fg_setpoint_spinbox_increment_button, LV_OBJ_FLAG_CLICKABLE);',
    )
    expect(code).toContain(
      'lv_obj_add_flag(fg_setpoint_spinbox_decrement_button, LV_OBJ_FLAG_CLICKABLE);',
    )
    expect(code).toContain(
      'lv_obj_move_foreground(fg_setpoint_spinbox_increment_button);',
    )
    expect(code).toContain(
      'lv_obj_move_foreground(fg_setpoint_spinbox_decrement_button);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_setpoint_spinbox_increment_button, fg_setpoint_spinbox_increment_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(fg_setpoint_spinbox_decrement_button, fg_setpoint_spinbox_decrement_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(code).toContain('lv_spinbox_increment(fg_setpoint_spinbox);')
    expect(code).toContain('lv_spinbox_decrement(fg_setpoint_spinbox);')
  })

  it('keeps the documented 220x48 helper geometry inside component bounds', () => {
    const { code } = generate(spinbox('main', 'Setpoint', {
      x: '110',
      y: '163',
      w: '220',
      h: '48',
    }))
    const geometry = (direction: 'increment' | 'decrement') => {
      const match = code.match(new RegExp(
        `lv_obj_set_pos\\(fg_setpoint_spinbox_${direction}_button, (\\d+), (\\d+)\\);\\s+`
        + `lv_obj_set_size\\(fg_setpoint_spinbox_${direction}_button, (\\d+), (\\d+)\\);`,
      ))
      expect(match).not.toBeNull()
      return match!.slice(1).map(Number)
    }
    const increment = geometry('increment')
    const decrement = geometry('decrement')

    expect(code).toContain('lv_obj_set_pos(fg_setpoint_spinbox, 110, 163);')
    expect(code).toContain('lv_obj_set_size(fg_setpoint_spinbox, 172, 48);')
    expect(increment).toEqual([282, 163, 48, 24])
    expect(decrement).toEqual([282, 187, 48, 24])
    for (const [x, y, width, height] of [increment, decrement]) {
      expect(width).toBeGreaterThan(0)
      expect(height).toBeGreaterThan(0)
      expect(x).toBeGreaterThanOrEqual(110)
      expect(y).toBeGreaterThanOrEqual(163)
      expect(x + width).toBeLessThanOrEqual(110 + 220)
      expect(y + height).toBeLessThanOrEqual(163 + 48)
    }
  })

  it('keeps the actual live firmware C in parity with the exporter fixture', () => {
    const liveCode = fs.readFileSync(path.resolve(
      process.cwd(),
      '../firmware/ForgeUI-One/main/90_Studio_Export.c',
    ), 'utf8')
    const { code: fixtureCode } = generate(spinbox('main', 'Spinbox', {
      x: '110',
      y: '163',
      w: '220',
      h: '48',
      value: 5,
    }))

    const geometry = (
      code: string,
      object: string,
    ): [number, number, number, number] => {
      const match = code.match(new RegExp(
        `lv_obj_set_pos\\(${object}, (\\d+), (\\d+)\\);\\s+`
        + `lv_obj_set_size\\(${object}, (\\d+), (\\d+)\\);`,
      ))
      expect(match).not.toBeNull()
      return match!.slice(1).map(Number) as [number, number, number, number]
    }
    const liveObject = 'fg_spinbox_spinbox'
    const fixtureObject = 'fg_spinbox_spinbox'
    const liveField = geometry(liveCode, liveObject)
    const fixtureField = geometry(fixtureCode, fixtureObject)
    const liveIncrement = geometry(liveCode, `${liveObject}_increment_button`)
    const liveDecrement = geometry(liveCode, `${liveObject}_decrement_button`)
    const fixtureIncrement = geometry(
      fixtureCode,
      `${fixtureObject}_increment_button`,
    )
    const fixtureDecrement = geometry(
      fixtureCode,
      `${fixtureObject}_decrement_button`,
    )

    expect(liveField).toEqual(fixtureField)
    expect(liveIncrement).toEqual(fixtureIncrement)
    expect(liveDecrement).toEqual(fixtureDecrement)
    expect(liveField).toEqual([110, 163, 172, 48])
    expect(liveIncrement).toEqual([282, 163, 48, 24])
    expect(liveDecrement).toEqual([282, 187, 48, 24])
    expect(liveField[2] + liveIncrement[2]).toBe(220)

    for (const [x, y, width, height] of [liveIncrement, liveDecrement]) {
      expect(width).toBeGreaterThan(0)
      expect(height).toBeGreaterThan(0)
      expect(x).toBeGreaterThanOrEqual(110)
      expect(y).toBeGreaterThanOrEqual(163)
      expect(x + width).toBeLessThanOrEqual(330)
      expect(y + height).toBeLessThanOrEqual(211)
    }

    for (const direction of ['increment', 'decrement']) {
      const button = `${liveObject}_${direction}_button`
      expect(liveCode).toContain(
        `lv_obj_t * ${button} = lv_button_create(fg_application_page);`,
      )
      expect(liveCode).toContain(
        `lv_obj_add_flag(${button}, LV_OBJ_FLAG_CLICKABLE);`,
      )
      expect(liveCode).toContain(`lv_obj_move_foreground(${button});`)
      expect(liveCode).toContain(
        `lv_obj_set_style_bg_opa(${button}, LV_OPA_COVER, LV_PART_MAIN);`,
      )
      expect(liveCode).toContain(
        `lv_obj_set_style_border_opa(${button}, LV_OPA_COVER, LV_PART_MAIN);`,
      )
      expect(liveCode).toContain(
        `lv_obj_set_style_text_color(${button}, lv_color_hex(0xF5F5F5), LV_PART_MAIN);`,
      )
      expect(liveCode).toContain(
        `lv_obj_add_event_cb(${button}, ${liveObject}_${direction}_cb, LV_EVENT_CLICKED, NULL);`,
      )
      expect(liveCode).toContain(
        `lv_spinbox_${direction}(${liveObject});`,
      )
    }

    const spinboxCreatedAt = liveCode.indexOf(
      `${liveObject} = lv_spinbox_create(fg_application_page);`,
    )
    const incrementCreatedAt = liveCode.indexOf(
      `lv_obj_t * ${liveObject}_increment_button = lv_button_create`,
    )
    const decrementCreatedAt = liveCode.indexOf(
      `lv_obj_t * ${liveObject}_decrement_button = lv_button_create`,
    )
    const helpersForegroundedAt = liveCode.indexOf(
      `lv_obj_move_foreground(${liveObject}_increment_button);`,
    )
    expect(spinboxCreatedAt).toBeLessThan(incrementCreatedAt)
    expect(incrementCreatedAt).toBeLessThan(decrementCreatedAt)
    expect(decrementCreatedAt).toBeLessThan(helpersForegroundedAt)
    expect(liveCode).toContain(
      'if (fg_spinbox_spinbox_value == value) return;',
    )
    expect(liveCode.match(/FG_On_Spinbox_Changed\(value\);/g)).toHaveLength(1)
  })
})
