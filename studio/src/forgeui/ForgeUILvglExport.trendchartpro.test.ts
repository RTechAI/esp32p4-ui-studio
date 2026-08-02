import { generateForgeUILvglCode } from './ForgeUILvglExport'

const component = (id: string): IComponent => ({
  id,
  type: 'TrendChartPro',
  componentName: id,
  props: {
    title: 'Engine RPM', units: 'RPM', minimum: 0, maximum: 6000,
    warningThreshold: 4500, alarmThreshold: 5500, historyLength: 64,
    currentValue: 1825, glowEnabled: true, glassSurfaceEnabled: true,
    shadowEnabled: true, footerMode: 'range-history',
    generateRuntimeApi: true, enableUserEvents: true,
    x: 20, y: 20, w: 440, h: 280,
  },
} as IComponent)

describe('Trend Chart Pro LVGL export', () => {
  const generate = (...charts: IComponent[]) => generateForgeUILvglCode({
    root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: charts.map(chart => chart.id) },
    ...Object.fromEntries(charts.map(chart => [chart.id, { ...chart, parent: 'root', children: [] }])),
  } as IComponents, 'graphite', undefined, { includeThemeTexture: false })

  it('uses the shared fixed-buffer runtime and premium LVGL styles', () => {
    const output = generate(component('Engine_Rpm'))
    expect(output.code).toContain('static int32_t fg_engine_rpm_trend_history[64]')
    expect(output.code).toContain('FG_Add_Engine_Rpm_Point(float value)')
    expect(output.code).toContain('FG_Clear_Engine_Rpm(void)')
    expect(output.code).toContain('lv_obj_set_style_bg_grad_color')
    expect(output.code).toContain('lv_obj_set_style_shadow_width')
    expect(output.code).not.toContain('malloc(')
  })

  it('keeps duplicate Pro instances independent', () => {
    const output = generate(component('A'), component('B')).code
    expect(output).toContain('FG_Add_A_Point')
    expect(output).toContain('FG_Add_B_Point')
    expect(output).toContain('fg_a_trend_history')
    expect(output).toContain('fg_b_trend_history')
  })
})
