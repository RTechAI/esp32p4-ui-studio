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
  componentName?: string,
): IComponent => ({
  id,
  parent: 'root',
  type,
  componentName,
  props: { x: 10, y: 10, w: 240, h: 120 },
  children: [],
})

const children = [
  standard('led', 'Led', 'Status LED'),
  standard('bar', 'Bar', 'Progress Bar'),
  standard('arc', 'Arc', 'Value Arc'),
  standard('chart', 'Chart', 'Data Chart'),
  standard('table', 'Table'),
  standard('keyboard', 'Keyboard', 'Keyboard'),
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
  { includeThemeTexture: false, palette },
).code

describe('previously proven Standard LVGL theme export', () => {
  it.each([
    'graphite',
    'cyber_teal',
    'nordic_ice',
  ] as ForgeThemeId[])(
    'emits the %s semantic roles for all cosmetic parts',
    themeId => {
      const theme = resolveForgeSemanticPalette(
        FG_PREVIEW_PALETTES[themeId],
      )
      const code = generate(themeId)

      expect(code).toContain(
        'lv_led_set_color(fg_status_led_led, lv_palette_main(LV_PALETTE_GREEN));',
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(fg_progress_bar_bar, lv_color_hex(${lvHex(theme.surfaceSecondary)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_bg_color(fg_progress_bar_bar, lv_color_hex(${lvHex(theme.accent)}), LV_PART_INDICATOR);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_arc_color(fg_value_arc_arc, lv_color_hex(${lvHex(theme.surfaceSecondary)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_arc_color(fg_value_arc_arc, lv_color_hex(${lvHex(theme.accent)}), LV_PART_INDICATOR);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(fg_data_chart_chart, lv_color_hex(${lvHex(theme.surface)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_line_color(fg_data_chart_chart, lv_color_hex(${lvHex(theme.textSecondary)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_chart_add_series(fg_data_chart_chart, lv_color_hex(${lvHex(theme.accent)}), LV_CHART_AXIS_PRIMARY_Y);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj5, lv_color_hex(${lvHex(theme.surfaceSecondary)}), LV_PART_ITEMS);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj5, lv_color_hex(${lvHex(theme.textPrimary)}), LV_PART_ITEMS);`,
      )

      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj6, lv_color_hex(${lvHex(theme.surface)}), LV_PART_MAIN);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_bg_color(obj6, lv_color_hex(${lvHex(theme.surfaceSecondary)}), LV_PART_ITEMS);`,
      )
      expect(code).toContain(
        `lv_obj_set_style_text_color(obj6, lv_color_hex(${lvHex(theme.disabledText)}), LV_PART_ITEMS | LV_STATE_DISABLED);`,
      )
    },
  )

  it('exports a resolved custom palette rather than reducing it to themeId', () => {
    const custom: ForgePreviewPalette = {
      name: 'Custom six',
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

    expect(customCode).toContain(
      'lv_obj_set_style_bg_color(fg_progress_bar_bar, lv_color_hex(0x303030), LV_PART_MAIN);',
    )
    expect(customCode).toContain(
      'lv_obj_set_style_arc_color(fg_value_arc_arc, lv_color_hex(0xC05020), LV_PART_INDICATOR);',
    )
    expect(customCode).toContain(
      'lv_obj_set_style_bg_color(fg_data_chart_chart, lv_color_hex(0x202020), LV_PART_MAIN);',
    )
    expect(customCode).toContain(
      'lv_obj_set_style_border_color(obj6, lv_color_hex(0x40A0C0), LV_PART_MAIN);',
    )
  })
})
