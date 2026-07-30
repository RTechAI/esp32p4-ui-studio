import { generateForgeUILvglCode } from './ForgeUILvglExport'

const circularProgress = (
  id = 'circular',
  componentName = 'Battery Level',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'CircularProgress',
  componentName,
  props: { x: 20, y: 30, w: 120, h: 120, value: 65, min: 0, max: 100, ...props },
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

describe('Standard Circular Progress generated output runtime', () => {
  it('retains an output-only native arc with a clamped value setter', () => {
    const generated = generate(circularProgress())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Battery_Level_Value(int32_t value);',
    )
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).toContain(
      'static lv_obj_t * fg_battery_level_circular_progress = NULL;',
    )
    expect(generated.code).toContain(
      'fg_battery_level_circular_progress = lv_arc_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_obj_remove_style(fg_battery_level_circular_progress, NULL, LV_PART_KNOB);',
    )
    expect(generated.code).toContain(
      'lv_obj_clear_flag(fg_battery_level_circular_progress, LV_OBJ_FLAG_CLICKABLE);',
    )
    expect(generated.code).not.toContain(
      'lv_obj_add_event_cb(fg_battery_level_circular_progress',
    )
  })

  it('uses full-circle geometry and semantic theme arc roles', () => {
    const { code } = generate(circularProgress())
    const object = 'fg_battery_level_circular_progress'

    expect(code).toContain(`lv_arc_set_bg_angles(${object}, 0, 360);`)
    expect(code).toContain(`lv_arc_set_rotation(${object}, 270);`)
    expect(code).toContain(
      `lv_obj_set_style_arc_color(${object}, lv_color_hex(0x2A3138), LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_arc_opa(${object}, LV_OPA_COVER, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_arc_width(${object}, 10, LV_PART_MAIN);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_arc_color(${object}, lv_color_hex(0xF2A900), LV_PART_INDICATOR);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_arc_opa(${object}, LV_OPA_COVER, LV_PART_INDICATOR);`,
    )
    expect(code).toContain(
      `lv_obj_set_style_arc_width(${object}, 10, LV_PART_INDICATOR);`,
    )
  })

  it('clamps serialized and runtime values without generating hooks', () => {
    const { code } = generate(circularProgress('signed', 'Signed Circle', {
      min: -50,
      max: 50,
      value: 90,
    }))
    const setter = code.slice(
      code.indexOf('void FG_Set_Signed_Circle_Value(int32_t value)'),
      code.indexOf('void FG_Set_Signed_Circle_Value(int32_t value)') + 800,
    )

    expect(code).toContain(
      'lv_arc_set_range(fg_signed_circle_circular_progress, -50, 50);',
    )
    expect(code).toContain(
      'lv_arc_set_value(fg_signed_circle_circular_progress, 50);',
    )
    expect(setter).toContain(
      'if (value < fg_signed_circle_circular_progress_minimum) value = fg_signed_circle_circular_progress_minimum;',
    )
    expect(setter).toContain(
      'if (value > fg_signed_circle_circular_progress_maximum) value = fg_signed_circle_circular_progress_maximum;',
    )
    expect(setter).toContain(
      'lv_arc_set_value(fg_signed_circle_circular_progress, value);',
    )
    expect(code).not.toContain('FG_On_Signed_Circle')
  })
})
