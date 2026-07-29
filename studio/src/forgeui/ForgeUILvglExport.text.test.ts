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
})
