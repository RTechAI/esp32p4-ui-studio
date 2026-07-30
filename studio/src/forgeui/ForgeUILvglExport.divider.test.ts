import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { FG_PREVIEW_PALETTES, resolveForgeSemanticPalette } from './preview/forgeThemeMap'

describe('Standard Divider semantic export', () => {
  it('uses the resolved surface border and remains non-interactive', () => {
    const divider: IComponent = {
      id: 'divider',
      parent: 'root',
      type: 'Divider',
      componentName: 'Section Divider',
      props: { x: 20, y: 30, w: 240, h: 10 },
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
    const theme = resolveForgeSemanticPalette(FG_PREVIEW_PALETTES.test_purple)
    const border = `0x${theme.surfaceBorder.slice(1).toUpperCase()}`

    expect(generated).toContain(
      `lv_obj_set_style_bg_color(obj1, lv_color_hex(${border}), LV_PART_MAIN);`,
    )
    expect(generated).toContain('lv_obj_set_size(obj1, 240, 1);')
    expect(generated).toContain(
      'lv_obj_clear_flag(obj1, LV_OBJ_FLAG_CLICKABLE);',
    )
  })
})
