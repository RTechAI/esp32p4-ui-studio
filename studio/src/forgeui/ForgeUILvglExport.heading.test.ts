import { generateForgeUILvglCode } from './ForgeUILvglExport'

const generateHeading = (props: Record<string, unknown> = {}) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: ['heading'],
    },
    heading: {
      id: 'heading',
      parent: 'root',
      type: 'Heading',
      componentName: 'Component Name Is Not Its Heading',
      props: {
        x: 17,
        y: 29,
        w: 260,
        h: 64,
        color: '#AABBCC',
        ...props,
      },
      children: [],
    },
  }

  return generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  ).code
}

describe('standard Heading LVGL export', () => {
  it('keeps the current default in shared live and standalone code', () => {
    const code = generateHeading()
    expect(code).toMatch(
      /lv_label_set_text\([^,]+, "Heading title"\);/,
    )
    expect(code).toContain('lv_obj_set_pos(obj1, 17, 29);')
    expect(code).toContain('lv_obj_set_size(obj1, 260, 64);')
    expect(code).toContain('lv_label_set_long_mode(obj1, LV_LABEL_LONG_WRAP);')
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0xF5F5F5), 0);',
    )
    expect(code).not.toContain('lv_color_hex(0xAABBCC)')
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);',
    )
  })

  it('exports custom serialized headings with correct C escaping', () => {
    const code = generateHeading({
      headingText: 'Main\n"Status"\\Panel',
      size: '2xl',
      textAlign: 'right',
    })
    expect(code).toMatch(
      /lv_label_set_text\([^,]+, "Main\\n\\"Status\\"\\\\Panel"\);/,
    )
    expect(code).toContain('&lv_font_montserrat_48')
    expect(code).toContain('LV_TEXT_ALIGN_RIGHT')
    const start = code.indexOf('lv_obj_t * obj1 = lv_label_create')
    const headingBlock = code.slice(start, code.indexOf('\n\n', start))
    expect(headingBlock).not.toMatch(/LV_LABEL_LONG_(?:DOT|CLIP)/)
  })

  it('continues exporting legacy heading text', () => {
    expect(generateHeading({ children: 'Legacy Heading' })).toMatch(
      /lv_label_set_text\([^,]+, "Legacy Heading"\);/,
    )
  })

  it('remains API-free, event-free, and independent across instances', () => {
    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['a', 'b'] },
      a: { id: 'a', parent: 'root', type: 'Heading', props: { headingText: 'First' }, children: [] },
      b: { id: 'b', parent: 'root', type: 'Heading', props: { headingText: 'Second' }, children: [] },
    }
    const generated = generateForgeUILvglCode(components, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_label_set_text(obj1, "First");')
    expect(generated.code).toContain('lv_label_set_text(obj2, "Second");')
    expect(generated.publicApiDeclarations).toEqual([])
    expect(generated.userEventHooks).toEqual([])
  })
})
