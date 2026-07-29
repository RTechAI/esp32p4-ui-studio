import { generateForgeUILvglCode } from './ForgeUILvglExport'

const component = (
  id: string,
  type: ComponentType,
  props: Record<string, unknown>,
): IComponent => ({
  id,
  parent: 'root',
  type,
  componentName: id,
  props,
  children: [],
})

describe('generated Standard screen visual parity', () => {
  it('preserves geometry while emitting semantic native typography', () => {
    const children = [
      component('button', 'Button', {
        x: 396, y: 34, w: 120, h: 40, buttonText: 'Button text',
      }),
      component('text', 'Text', {
        x: 431, y: 147, w: 120, h: 40, textValue: 'Text value',
      }),
      component('heading', 'Heading', {
        x: 405, y: 258, w: 180, h: 40, headingText: 'Heading title',
      }),
      component('clock', 'Clock', {
        x: 482, y: 375, w: 90, h: 32, value: '12:34',
      }),
      component('wifi', 'WiFi', {
        x: 726, y: 87, w: 120, h: 60,
      }),
    ]
    const { code } = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: children.map(child => child.id),
      },
      ...Object.fromEntries(children.map(child => [child.id, child])),
    }, 'cyber_teal', undefined, { includeThemeTexture: false })

    expect(code).toContain('lv_obj_set_pos(obj1, 396, 34);')
    expect(code).toContain('lv_obj_set_size(obj1, 120, 40);')
    expect(code).toContain('lv_obj_set_style_radius(obj1, 12, 0);')
    expect(code).toContain(
      'lv_obj_set_style_border_color(obj1, lv_color_hex(0x14B8A6), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1_label, &lv_font_montserrat_14, 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj2, lv_color_hex(0xCCFBF1), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj2, &lv_font_montserrat_24, 0);',
    )
    expect(code).toContain('lv_obj_set_pos(obj3, 405, 258);')
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj3, &lv_font_montserrat_32, 0);',
    )
    expect(code).toContain('lv_obj_set_pos(fg_clock_label, 482, 375);')
    expect(code).toContain(
      'lv_obj_set_style_text_color(fg_clock_label, lv_color_hex(0x14B8A6), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_align(fg_clock_label, LV_TEXT_ALIGN_LEFT, 0);',
    )
    expect(code).toContain('lv_obj_set_pos(fg_wifi_label, 726, 87);')
    expect(code).toContain(
      'lv_obj_set_style_text_color(fg_wifi_label, lv_color_hex(0x14B8A6), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(fg_wifi_label, &lv_font_montserrat_20, 0);',
    )
  })
})
