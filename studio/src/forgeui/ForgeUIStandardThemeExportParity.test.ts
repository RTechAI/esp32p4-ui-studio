import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  FG_PREVIEW_PALETTES,
  ForgePreviewPalette,
  ForgeThemeId,
  resolveForgeSemanticPalette,
} from './preview/forgeThemeMap'

const standard = (
  id: string,
  type: ComponentType,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type,
  props: { x: 10, y: 10, w: 240, h: 120, ...props },
  children: [],
})

const children = [
  standard('roller', 'Roller'),
  standard('message', 'Msgbox'),
  standard('calendar', 'Calendar'),
  standard('scale', 'Scale'),
  standard('matrix', 'ButtonMatrix'),
]

const components: IComponents = {
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: children.map(child => child.id),
  },
  ...Object.fromEntries(children.map(child => [child.id, child])),
}

const lvHex = (value: string) =>
  `0x${value.replace('#', '').toUpperCase()}`

const generate = (
  themeId: ForgeThemeId,
  palette?: ForgePreviewPalette,
) => generateForgeUILvglCode(
  components,
  themeId,
  undefined,
  {
    includeThemeTexture: false,
    palette,
  },
).code

describe('Standard selected-theme LVGL export parity', () => {
  it.each([
    'graphite',
    'cyber_teal',
    'nordic_ice',
  ] as ForgeThemeId[])(
    'maps the %s semantic palette into all five native controls',
    themeId => {
      const palette = FG_PREVIEW_PALETTES[themeId]
      const theme = resolveForgeSemanticPalette(palette)
      const code = generate(themeId)

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj1, lv_color_hex(${lvHex(theme.surface)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj1, lv_color_hex(${lvHex(theme.textSecondary)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_border_color(obj1, lv_color_hex(${lvHex(theme.surfaceBorder)}), LV_PART_MAIN);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj2, lv_color_hex(${lvHex(theme.surface)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj2_title, lv_color_hex(${lvHex(theme.textPrimary)}), LV_PART_MAIN);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj3, lv_color_hex(${lvHex(theme.surface)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj3, lv_color_hex(${lvHex(theme.textSecondary)}), LV_PART_ITEMS | LV_STATE_DISABLED);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_border_color(obj3, lv_color_hex(${lvHex(theme.accent)}), LV_PART_ITEMS | LV_STATE_CHECKED);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_line_color(obj4, lv_color_hex(${lvHex(theme.accent)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj4, lv_color_hex(${lvHex(theme.textPrimary)}), LV_PART_INDICATOR);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj5, lv_color_hex(${lvHex(theme.selectedSurface)}), LV_PART_ITEMS | LV_STATE_CHECKED);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj5, lv_color_hex(${lvHex(theme.accentText)}), LV_PART_ITEMS | LV_STATE_CHECKED);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj5, lv_color_hex(${lvHex(theme.disabledText)}), LV_PART_ITEMS | LV_STATE_DISABLED);`,
      )
    },
  )

  it('uses a resolved custom palette instead of the preset theme id', () => {
    const custom: ForgePreviewPalette = {
      name: 'Custom export',
      bg: '#101010',
      surface: '#202020',
      surface2: '#303030',
      border: '#40A0C0',
      text: '#F0E0D0',
      accent: '#C05020',
      texture: 'none',
      borderStyle: 'flat',
    }
    const customCode = generate('graphite', custom)
    const graphiteCode = generate('graphite')

    expect(customCode).toContain(
      'lv_obj_set_style_bg_color(obj1, lv_color_hex(0x202020), LV_PART_MAIN);',
    )
    expect(customCode).toContain(
      'lv_obj_set_style_line_color(obj4, lv_color_hex(0xC05020), LV_PART_MAIN);',
    )
    expect(customCode).not.toEqual(graphiteCode)
  })
})
