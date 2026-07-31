import { generateForgeUILvglCode } from './ForgeUILvglExport'

const spinner = (
  id: string,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Spinner',
  componentName: `Spinner ${id}`,
  props: { x: 20, y: 30, w: 96, h: 96, ...props },
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

describe('Native LVGL Spinner export', () => {
  it('emits a genuine native Spinner with default semantic theme', () => {
    const generated = generate(spinner('default'))

    expect(generated.code).toContain(
      'lv_obj_t * obj1 = lv_spinner_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_spinner_set_anim_params(obj1, 1000, 60);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_arc_width(obj1, 8, LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_arc_width(obj1, 8, LV_PART_INDICATOR);',
    )
    expect(generated.code).not.toContain('lv_label_set_text(obj1')
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('Spinner')
    expect(generated.userEventHooks.join('\n')).not.toContain('Spinner')
  })

  it('exports duration, arc geometry, colours, opacity, and multiple instances', () => {
    const generated = generate(
      spinner('slow', {
        duration: 2400,
        arcLength: 120,
        arcWidth: 12,
        backgroundWidth: 4,
        accentColor: '#22D3EE',
        backgroundColor: '#112233',
        opacity: 50,
      }),
      spinner('fast', { x: 140, duration: 300, arcLength: 45 }),
    )

    expect(generated.code).toContain(
      'lv_spinner_set_anim_params(obj1, 2400, 120);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_arc_color(obj1, lv_color_hex(0x22D3EE), LV_PART_INDICATOR);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_arc_color(obj1, lv_color_hex(0x112233), LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_opa(obj1, 127, LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_opa(obj1, 127, LV_PART_INDICATOR);',
    )
    expect(generated.code).toContain(
      'lv_obj_t * obj2 = lv_spinner_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_spinner_set_anim_params(obj2, 300, 45);',
    )
  })

  it('emits no Spinner code or runtime when unused', () => {
    const generated = generate()

    expect(generated.code).not.toContain('lv_spinner_')
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('Spinner')
    expect(generated.userEventHooks.join('\n')).not.toContain('Spinner')
  })
})
