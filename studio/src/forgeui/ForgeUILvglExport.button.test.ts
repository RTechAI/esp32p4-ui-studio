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
  )
}

describe('standard Button LVGL export', () => {
  it('keeps the legacy default text for both export payload paths', () => {
    const sharedLiveAndStandaloneCode = generateButton().code
    expect(sharedLiveAndStandaloneCode).toMatch(
      /lv_label_set_text\([^,]+, "Button text"\);/,
    )
  })

  it('exports custom serialized text and escapes it safely', () => {
    expect(generateButton({ buttonText: 'Run "Now"' }).code).toMatch(
      /lv_label_set_text\([^,]+, "Run \\"Now\\""\);/,
    )
  })

  it('exports explicit semantic default, pressed, focused and disabled states', () => {
    const code = generateButton().code
    expect(code).toContain('lv_obj_set_style_bg_color(obj1, lv_color_hex(0x1E2328), 0);')
    expect(code).toMatch(/lv_obj_set_style_bg_color\(obj1, lv_color_hex\(0x[0-9A-F]+\), LV_PART_MAIN \| LV_STATE_PRESSED\);/)
    expect(code).toMatch(/lv_obj_set_style_border_color\(obj1, lv_color_hex\(0x[0-9A-F]+\), LV_PART_MAIN \| LV_STATE_FOCUSED\);/)
    expect(code).toMatch(/lv_obj_set_style_text_color\(obj1, lv_color_hex\(0x[0-9A-F]+\), LV_PART_MAIN \| LV_STATE_DISABLED\);/)
  })

  it('continues to export legacy children text when present', () => {
    expect(generateButton({ children: 'Legacy Button' }).code).toMatch(
      /lv_label_set_text\([^,]+, "Legacy Button"\);/,
    )
  })

  it('emits exactly one genuine click hook and no runtime setter', () => {
    const result = generateButton()
    expect(result.userEventHooks).toEqual([
      'FG_On_Component_Name_Is_Not_Its_Text_Clicked',
    ])
    expect(result.publicApiDeclarations).toEqual([])
    expect(result.code).toContain(
      'lv_obj_add_event_cb(obj1, fg_component_name_is_not_its_text_clicked_cb, LV_EVENT_CLICKED, NULL);',
    )
    expect(result.code.match(/FG_On_Component_Name_Is_Not_Its_Text_Clicked\(\);/g))
      .toHaveLength(1)
  })

  it('keeps multiple Button hooks collision-safe and independent', () => {
    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['a', 'b'] },
      a: { id: 'a', parent: 'root', type: 'Button', componentName: 'Action', props: {}, children: [] },
      b: { id: 'b', parent: 'root', type: 'Button', componentName: 'Action', props: {}, children: [] },
    }
    const result = generateForgeUILvglCode(components, 'graphite', undefined, {
      includeThemeTexture: false,
    })
    expect(result.userEventHooks).toEqual([
      'FG_On_Action_Clicked',
      'FG_On_Action_2_Clicked',
    ])
    expect(result.code).toContain('fg_action_clicked_cb')
    expect(result.code).toContain('fg_action_2_clicked_cb')
  })
})
