import { generateForgeUILvglCode } from './ForgeUILvglExport'

const generateText = (props: Record<string, unknown> = {}) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: ['text'],
    },
    text: {
      id: 'text',
      parent: 'root',
      type: 'Text',
      componentName: 'Component Name Is Not Its Text',
      props: { x: 10, y: 20, w: 160, h: 48, ...props },
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

describe('standard Text LVGL export', () => {
  it('keeps the default for the shared live and standalone export code', () => {
    expect(generateText()).toMatch(
      /lv_label_set_text\([^,]+, "Text value"\);/,
    )
  })

  it('exports custom serialized text with correct C escaping', () => {
    expect(generateText({
      textValue: 'Line 1\n"Line 2"\\done',
    })).toMatch(
      /lv_label_set_text\([^,]+, "Line 1\\n\\"Line 2\\"\\\\done"\);/,
    )
  })

  it('continues exporting legacy project text', () => {
    expect(generateText({ children: 'Legacy Text' })).toMatch(
      /lv_label_set_text\([^,]+, "Legacy Text"\);/,
    )
  })

  it('exports bounded multiline wrapping and serialized alignment', () => {
    const code = generateText({
      textValue: 'First line\nSecond line wraps',
      textAlign: 'center',
      fontSize: 23,
    })
    expect(code).toContain('lv_obj_set_size(obj1, 160, 48);')
    expect(code).toContain('lv_label_set_long_mode(obj1, LV_LABEL_LONG_WRAP);')
    expect(code).toContain(
      'lv_obj_set_style_text_align(obj1, LV_TEXT_ALIGN_CENTER, 0);',
    )
    expect(code).toContain('&lv_font_montserrat_22')
    expect(code.indexOf('lv_obj_set_size(obj1, 160, 48);'))
      .toBeLessThan(code.indexOf('lv_label_set_text(obj1,'))
    expect(code.indexOf('LV_LABEL_LONG_WRAP'))
      .toBeLessThan(code.indexOf('lv_label_set_text(obj1,'))
    const textBlock = code.slice(
      code.indexOf('lv_obj_t * obj1 = lv_label_create'),
      code.indexOf('\n\n', code.indexOf('lv_obj_t * obj1 = lv_label_create')),
    )
    expect(textBlock).not.toMatch(/LV_LABEL_LONG_(?:DOT|CLIP)/)
  })

  it.each([
    ['left', 'LV_TEXT_ALIGN_LEFT'],
    ['center', 'LV_TEXT_ALIGN_CENTER'],
    ['right', 'LV_TEXT_ALIGN_RIGHT'],
  ])('exports %s alignment without truncating the proof paragraph', (alignment, lvAlignment) => {
    const proof = 'ForgeUI Studio is a professional embedded interface designer running native LVGL 9 on the ESP32-P4.'
    const code = generateText({ textValue: proof, textAlign: alignment })
    expect(code).toContain(`lv_label_set_text(obj1, "${proof}");`)
    expect(code).toContain(`lv_obj_set_style_text_align(obj1, ${lvAlignment}, 0);`)
  })

  it('remains presentation-only with no Runtime API or UserEvent', () => {
    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['text'] },
      text: { id: 'text', parent: 'root', type: 'Text', props: { textValue: 'Static' }, children: [] },
    }
    const result = generateForgeUILvglCode(components, 'graphite', undefined, {
      includeThemeTexture: false,
    })
    expect(result.publicApiDeclarations).toEqual([])
    expect(result.userEventHooks).toEqual([])
  })
})
