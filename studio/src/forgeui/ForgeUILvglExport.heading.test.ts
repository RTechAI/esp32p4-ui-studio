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
    expect(code).toContain(
      'lv_obj_set_style_text_color(obj1, lv_color_hex(0xAABBCC), 0);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1, &lv_font_montserrat_32, 0);',
    )
  })

  it('exports custom serialized headings with correct C escaping', () => {
    expect(generateHeading({
      headingText: 'Main\n"Status"\\Panel',
    })).toMatch(
      /lv_label_set_text\([^,]+, "Main\\n\\"Status\\"\\\\Panel"\);/,
    )
  })

  it('continues exporting legacy heading text', () => {
    expect(generateHeading({ children: 'Legacy Heading' })).toMatch(
      /lv_label_set_text\([^,]+, "Legacy Heading"\);/,
    )
  })
})
