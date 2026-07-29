import { generateForgeUILvglCode } from './ForgeUILvglExport'

const generateButton = (props: Record<string, unknown> = {}) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: ['button'],
    },
    button: {
      id: 'button',
      parent: 'root',
      type: 'Button',
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

describe('standard Button LVGL export', () => {
  it('keeps the legacy default text for both export payload paths', () => {
    const sharedLiveAndStandaloneCode = generateButton()
    expect(sharedLiveAndStandaloneCode).toMatch(
      /lv_label_set_text\([^,]+, "Button text"\);/,
    )
  })

  it('exports custom serialized text and escapes it safely', () => {
    expect(generateButton({ buttonText: 'Run "Now"' })).toMatch(
      /lv_label_set_text\([^,]+, "Run \\"Now\\""\);/,
    )
  })

  it('continues to export legacy children text when present', () => {
    expect(generateButton({ children: 'Legacy Button' })).toMatch(
      /lv_label_set_text\([^,]+, "Legacy Button"\);/,
    )
  })
})
