import { generateForgeUILvglCode } from './ForgeUILvglExport'

describe('Standard Divider semantic export', () => {
  it('uses the resolved surface border and remains non-interactive', () => {
    const divider: IComponent = {
      id: 'divider',
      parent: 'root',
      type: 'Divider',
      componentName: 'Section Divider',
      props: { x: 20, y: 30, w: 240, h: 6, borderColor: '#22D3EE', opacity: 75 },
      children: [],
    }
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      componentName: 'Root',
      props: {},
      children: [divider.id],
    }
    const generated = generateForgeUILvglCode(
      { root, divider },
      'test_purple',
      undefined,
      { includeThemeTexture: false },
    ).code
    expect(generated).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x22D3EE), LV_PART_MAIN);',
    )
    expect(generated).toContain('lv_obj_set_pos(obj1, 20, 30);')
    expect(generated).toContain('lv_obj_set_size(obj1, 240, 6);')
    expect(generated).toContain('lv_obj_set_style_bg_opa(obj1, 191, LV_PART_MAIN);')
    expect(generated).toContain(
      'lv_obj_clear_flag(obj1, LV_OBJ_FLAG_CLICKABLE);',
    )
  })

  it('exports vertical geometry and no API or UserEvent', () => {
    const divider: IComponent = {
      id: 'divider', parent: 'root', type: 'Divider', componentName: 'Vertical Rule',
      props: { x: 410, y: 90, w: 5, h: 220, orientation: 'vertical' }, children: [],
    }
    const root: IComponent = { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['divider'] }
    const generated = generateForgeUILvglCode({ root, divider }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_set_size(obj1, 5, 220);')
    expect(generated.publicApiDeclarations).toEqual([])
    expect(generated.userEventHooks).toEqual([])
  })

  it('keeps horizontal and vertical instances independent', () => {
    const horizontal: IComponent = {
      id: 'horizontal', parent: 'root', type: 'Divider',
      props: { x: 20, y: 40, w: 300, h: 4 }, children: [],
    }
    const vertical: IComponent = {
      id: 'vertical', parent: 'root', type: 'Divider',
      props: { x: 400, y: 80, w: 8, h: 240, orientation: 'vertical' }, children: [],
    }
    const root: IComponent = {
      id: 'root', parent: 'root', type: 'Box', props: {},
      children: ['horizontal', 'vertical'],
    }
    const { code } = generateForgeUILvglCode(
      { root, horizontal, vertical }, 'graphite', undefined,
      { includeThemeTexture: false },
    )
    expect(code).toContain('lv_obj_set_size(obj1, 300, 4);')
    expect(code).toContain('lv_obj_set_size(obj2, 8, 240);')
  })
})
