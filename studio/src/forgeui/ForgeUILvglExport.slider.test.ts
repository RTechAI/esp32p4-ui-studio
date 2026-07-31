import { generateForgeUILvglCode } from './ForgeUILvglExport'

const slider = (
  id: string,
  props: Record<string, unknown> = {},
  componentName = 'Level Slider',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Slider',
  componentName,
  props: { x: 20, y: 30, w: 220, h: 36, ...props },
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

describe('Standard Slider generated runtime', () => {
  it('emits a retained native Slider, silent setter, and genuine-user hook', () => {
    const generated = generate(slider('level'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Level_Slider_Value(int32_t value);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Level_Slider_Changed',
    )
    expect(generated.code).toContain(
      'fg_level_slider_slider = lv_slider_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_slider_set_range(fg_level_slider_slider, 0, 100);',
    )
    expect(generated.code).toContain(
      'lv_slider_set_value(fg_level_slider_slider, 50, LV_ANIM_OFF);',
    )
    expect(generated.code).toContain(
      'lv_obj_add_event_cb(fg_level_slider_slider, fg_level_slider_slider_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
  })

  it('clamps negative ranges and normalizes reversed serialized ranges', () => {
    const negative = generate(slider(
      'negative',
      { min: -50, max: 50, value: -80 },
      'Signed Slider',
    ))
    const reversed = generate(slider(
      'reversed',
      { min: 100, max: -100, value: 40 },
      'Reversed Slider',
    ))

    expect(negative.code).toContain(
      'lv_slider_set_range(fg_signed_slider_slider, -50, 50);',
    )
    expect(negative.code).toContain(
      'lv_slider_set_value(fg_signed_slider_slider, -50, LV_ANIM_OFF);',
    )
    expect(reversed.code).toContain(
      'lv_slider_set_range(fg_reversed_slider_slider, -100, 100);',
    )
    expect(reversed.code).toContain(
      'lv_slider_set_value(fg_reversed_slider_slider, 40, LV_ANIM_OFF);',
    )
  })

  it('suppresses startup, repeated, and programmatic events', () => {
    const { code } = generate(slider('level'))
    const setterStart = code.indexOf(
      'void FG_Set_Level_Slider_Value(int32_t value)',
    )
    const setter = code.slice(setterStart, setterStart + 850)
    const callbackStart = code.indexOf(
      'static void fg_level_slider_slider_value_changed_cb(lv_event_t * event)',
    )
    const callback = code.slice(callbackStart, callbackStart + 650)

    expect(setter).toContain(
      'if (fg_level_slider_slider == NULL || fg_level_slider_slider_value == value) return;',
    )
    expect(setter).toContain(
      'fg_level_slider_slider_programmatic_update = true;',
    )
    expect(setter).toContain(
      'fg_level_slider_slider_programmatic_update = false;',
    )
    expect(setter).not.toContain('FG_On_Level_Slider_Changed(value);')
    expect(callback).toContain(
      'if (slider != fg_level_slider_slider || fg_level_slider_slider_programmatic_update) return;',
    )
    expect(callback).toContain(
      'if (fg_level_slider_slider_value == value) return;',
    )
    expect(callback).toContain('FG_On_Level_Slider_Changed(value);')
    expect(code.indexOf('lv_slider_set_value(fg_level_slider_slider, 50'))
      .toBeLessThan(code.indexOf(
        'lv_obj_add_event_cb(fg_level_slider_slider',
      ))
  })

  it('allocates collision-safe independent runtimes', () => {
    const generated = generate(
      slider('one', {}, 'Level Slider'),
      slider('two', { value: 75 }, 'Level Slider'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Level_Slider_Value(int32_t value);',
      'void FG_Set_Level_Slider_2_Value(int32_t value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Level_Slider_Changed',
      'FG_On_Level_Slider_2_Changed',
    ]))
  })
})
