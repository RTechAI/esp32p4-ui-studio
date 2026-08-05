import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const rootWith = (...children: IComponent[]): IComponents => ({
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: children.map(child => child.id),
  },
  ...Object.fromEntries(children.map(child => [child.id, child])),
})

const chart = (
  id: string,
  props: Record<string, unknown> = {},
  componentName?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'Chart',
  componentName,
  props: { x: 114, y: 161, w: 240, h: 120, ...props },
  children: [],
})

const trendChartPro = (
  id: string,
  props: Record<string, unknown> = {},
  componentName?: string,
): IComponent => ({
  id, parent: 'root', type: 'TrendChartPro', componentName,
  props: { x: 40, y: 40, w: 340, h: 360, generateRuntimeApi: true, enableUserEvents: true, ...props },
  children: [],
})

const generate = (components: IComponents) =>
  generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )

describe('Chart generated developer API', () => {
  it.each([
    ['Trend Chart', chart('partial', { pointCount: 6, initialData: [12, 24, 36] }, 'Partial'), 'fg_partial_chart', 3],
  ])('clears unused history and writes only valid samples for %s', (_label, component, stem, offset) => {
    const generated = generate(rootWith(component))
    expect(generated.code).toContain(
      `lv_chart_set_all_value(${stem}, ${stem}_series, LV_CHART_POINT_NONE);`,
    )
    expect(generated.code).toContain(
      `lv_chart_set_value_by_id(${stem}, ${stem}_series, ${offset}, 12`,
    )
    expect(generated.code).not.toContain(
      `lv_chart_set_next_value(${stem}, ${stem}_series, 12`,
    )
  })
  it('spreads Trend Chart Pro startup data over its full hardware history', () => {
    const generated = generate(rootWith(trendChartPro('partial-pro', {
      historyLength: 6,
      initialData: [120, 240, 360],
    })))
    ;[120, 168, 216, 264, 312, 360].forEach((value, index) => {
      expect(generated.code).toContain(
        `lv_chart_set_value_by_id(fg_partial_pro_chart, fg_partial_pro_chart_series, ${index}, ${value});`,
      )
    })
  })
  it.each([
    ['one Pro instance', [trendChartPro('comp-MSFYEVIQ1-XV42', {}, 'Renamed Pro')]],
    ['two Pro instances', [trendChartPro('comp-A'), trendChartPro('comp-B')]],
    ['standard and Pro together', [chart('standard', {}, 'Standard Trend'), trendChartPro('comp-Pro')]],
  ])('exports canonical callback contracts for %s', (_label, children) => {
    const generated = generate(rootWith(...children))
    const proIds = children.filter(child => child.type === 'TrendChartPro').map(child =>
      child.id.replace(/[^a-zA-Z0-9_]+/g, ' ').split(/\s+/).filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2'),
    )
    proIds.forEach(stem => {
      expect(generated.userEventContracts).toEqual(expect.arrayContaining([
        { name: `FG_On_${stem}_Point_Added`, parameters: 'float value' },
        { name: `FG_On_${stem}_Warning`, parameters: 'void' },
        { name: `FG_On_${stem}_Alarm`, parameters: 'void' },
        { name: `FG_On_${stem}_Recovered`, parameters: 'void' },
      ]))
      expect(generated.code).toContain(`FG_On_${stem}_Point_Added(value);`)
    })
    if (children.some(child => child.type === 'Chart')) {
      expect(generated.publicApiDeclarations).toContain('void FG_Add_Standard_Trend_Point(float value);')
      expect(generated.userEventHooks).toContain('FG_On_Standard_Trend_Cleared')
    }
  })
  it('retains the default line chart, series, and startup shape', () => {
    const generated = generate(rootWith(chart('data-chart', { w: 388 })))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Add_Data_Chart_Point(float value);',
      'void FG_Clear_Data_Chart(void);',
      'void FG_Set_Data_Chart_WarningThreshold(float value);',
      'void FG_Set_Data_Chart_AlarmThreshold(float value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Data_Chart_Point_Added',
      'FG_On_Data_Chart_Cleared',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_data_chart_chart = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_chart_series_t * fg_data_chart_chart_series = NULL;',
    )
    expect(generated.code).toContain(
      'lv_chart_set_type(fg_data_chart_chart, LV_CHART_TYPE_LINE);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_size(fg_data_chart_chart, 0, 0, LV_PART_INDICATOR);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_point_count(fg_data_chart_chart, 11);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_div_line_count(fg_data_chart_chart, 3, 5);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_pad_left(fg_data_chart_chart, 42, LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_pad_right(fg_data_chart_chart, 8, LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_pad_top(fg_data_chart_chart, 10, LV_PART_MAIN);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_style_pad_bottom(fg_data_chart_chart, 22, LV_PART_MAIN);',
    )
    ;[100, 75, 50, 25, 0].forEach((value, index) => {
      expect(generated.code).toContain(
        `lv_obj_t * obj1_y_label_${index} = lv_label_create(fg_application_page);`,
      )
      expect(generated.code).toContain(
        `lv_label_set_text(obj1_y_label_${index}, "${value}");`,
      )
      expect(generated.code).toContain(
        `lv_obj_clear_flag(obj1_y_label_${index}, LV_OBJ_FLAG_CLICKABLE);`,
      )
    })
    expect(generated.code).toContain(
      'lv_obj_set_style_text_color(obj1_y_label_0, lv_color_hex(0xB5B6B8), LV_PART_MAIN);',
    )
    ;['-60s', '-45s', '-30s', '-15s', 'Now'].forEach((value, index) => {
      expect(generated.code).toContain(
        `lv_obj_t * obj1_x_label_${index} = lv_label_create(fg_application_page);`,
      )
      expect(generated.code).toContain(
        `lv_label_set_text(obj1_x_label_${index}, "${value}");`,
      )
      expect(generated.code).toContain(
        `lv_obj_clear_flag(obj1_x_label_${index}, LV_OBJ_FLAG_CLICKABLE);`,
      )
    })
    expect(generated.code).not.toContain('obj1_x_label_5')
    expect(generated.code).toContain(
      'lv_chart_set_all_value(fg_data_chart_chart, fg_data_chart_chart_series, LV_CHART_POINT_NONE);',
    )
    ;[10, 30, 20, 50, 40, 70, 60, 75, 68, 58, 50].forEach((value, index) => {
      expect(generated.code).toContain(
        `lv_chart_set_value_by_id(fg_data_chart_chart, fg_data_chart_chart_series, ${index}, ${value});`,
      )
    })
  })

  it('adds every sample, including identical consecutive values', () => {
    const generated = generate(rootWith(chart('samples')))
    const setter = generated.code.slice(
      generated.code.indexOf('void FG_Add_Data_Chart_Point'),
      generated.code.indexOf('void FG_Clear_Data_Chart'),
    )

    expect(setter).toContain(
      'lv_chart_set_next_value(fg_data_chart_chart, fg_data_chart_chart_series, (int32_t)value);',
    )
    expect(setter).toContain('FG_On_Data_Chart_Point_Added(value);')
    expect(setter).not.toContain('== value')
  })

  it('clamps samples and supports a negative Y range', () => {
    const generated = generate(rootWith(chart('signed', {
      yMin: -100,
      yMax: 100,
      initialData: [-100, -50, 0, 50, 100],
      pointCount: 5,
    }, 'SignedChart')))

    expect(generated.code).toContain(
      'lv_chart_set_range(fg_signed_chart_chart, LV_CHART_AXIS_PRIMARY_Y, -100, 100);',
    )
    expect(generated.code).toContain(
      'if (value < fg_signed_chart_chart_y_minimum) value = fg_signed_chart_chart_y_minimum;',
    )
    expect(generated.code).toContain(
      'if (value > fg_signed_chart_chart_y_maximum) value = fg_signed_chart_chart_y_maximum;',
    )
  })

  it('clears with LVGL 9 series reset and fires only the runtime hook', () => {
    const generated = generate(rootWith(chart('clearable')))
    const clear = generated.code.slice(
      generated.code.indexOf('void FG_Clear_Data_Chart'),
      generated.code.indexOf('static void FG_Set_Display_Brightness'),
    )
    expect(clear).toContain(
      'lv_chart_set_all_value(fg_data_chart_chart, fg_data_chart_chart_series, LV_CHART_POINT_NONE);',
    )
    expect(clear).toContain('FG_On_Data_Chart_Cleared();')

    const creation = generated.code.slice(
      generated.code.indexOf('fg_data_chart_chart = lv_chart_create'),
    )
    expect(creation).not.toContain('FG_On_Data_Chart_Point_Added')
    expect(creation).not.toContain('FG_On_Data_Chart_Cleared')
  })

  it('honors persisted divisions and update mode', () => {
    const generated = generate(rootWith(chart('configured', {
      horizontalDivisions: 4,
      verticalDivisions: 6,
      updateMode: 'circular',
      seriesColor: '#12AB34',
      warningThreshold: 72,
      alarmThreshold: 88,
      warningColor: '#F2A900',
      alarmColor: '#E5484D',
    }, 'ConfiguredChart')))
    expect(generated.code).toContain(
      'lv_chart_set_div_line_count(fg_configured_chart_chart, 4, 5);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_update_mode(fg_configured_chart_chart, LV_CHART_UPDATE_MODE_CIRCULAR);',
    )
    expect(generated.code).toContain(
      'lv_chart_add_series(fg_configured_chart_chart, lv_color_hex(0x12AB34), LV_CHART_AXIS_PRIMARY_Y);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_all_value(fg_configured_chart_chart, fg_configured_chart_chart_warning_series, 72);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_all_value(fg_configured_chart_chart, fg_configured_chart_chart_alarm_series, 88);',
    )
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Configured_Chart_WarningThreshold(float value);',
      'void FG_Set_Configured_Chart_AlarmThreshold(float value);',
    ]))
    expect(generated.code.indexOf('fg_configured_chart_chart_warning_series = lv_chart_add_series'))
      .toBeLessThan(generated.code.indexOf('fg_configured_chart_chart_series = lv_chart_add_series'))
  })

  it('can disable the semantic Runtime SDK without leaking private chart symbols', () => {
    const generated = generate(rootWith(chart('static', {
      generateRuntimeApi: false,
    }, 'StaticTrend')))
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('Static_Trend')
    expect(generated.code).toContain('lv_chart_create(fg_application_page)')
  })

  it('generates nearest-integer labels from normalized ranges and divisions', () => {
    const generated = generate(rootWith(chart('labels', {
      yMin: 50,
      yMax: -50,
      horizontalDivisions: 2,
    })))

    ;['50', '17', '-17', '-50'].forEach((value, index) => {
      expect(generated.code).toContain(
        `lv_label_set_text(obj1_y_label_${index}, "${value}");`,
      )
    })
    expect(generated.code).not.toContain(
      'lv_label_set_text(obj1_y_label_4,',
    )
  })

  it('allocates separate collision-safe APIs, objects, series, and hooks', () => {
    const generated = generate(rootWith(
      chart('a', {}, 'DataChart'),
      chart('b', {}, 'DataChart'),
    ))
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Add_Data_Chart_Point(float value);',
      'void FG_Clear_Data_Chart(void);',
      'void FG_Add_Data_Chart_2_Point(float value);',
      'void FG_Clear_Data_Chart_2(void);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Data_Chart_Point_Added',
      'FG_On_Data_Chart_Cleared',
      'FG_On_Data_Chart_2_Point_Added',
      'FG_On_Data_Chart_2_Cleared',
    ]))
    expect(generated.code).toContain('fg_data_chart_chart = lv_chart_create')
    expect(generated.code).toContain('fg_data_chart_2_chart = lv_chart_create')
  })

  it('can dump the exact persisted project for endpoint validation', () => {
    if (!process.env.FORGEUI_DUMP_CHART_PAYLOAD) return
    const generated = generate(rootWith(
      {
        id: 'comp-MS54VF7PP1FCD', parent: 'root', type: 'Led',
        props: { positionMode: 'absolute', x: 585, y: 167, w: 32, h: 32 },
        children: [],
      },
      {
        id: 'comp-MS55EHNT4YJCW', parent: 'root', type: 'Bar',
        props: { positionMode: 'absolute', x: '486', y: '117', w: '240', h: '43' },
        children: [],
      },
      {
        id: 'comp-MS55RH11ZZV74', parent: 'root', type: 'Arc',
        props: { positionMode: 'absolute', x: '40', y: '3', w: 120, h: 120 },
        children: [],
      },
      chart('comp-MS563F9M1YGRA', {
        positionMode: 'absolute',
        x: 40,
        y: 120,
        w: 420,
        h: 260,
      }),
      trendChartPro('comp-MSFYEVIQ1-XV42', { x: 540, y: 80, w: 420, h: 320 }),
    ))
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_CHART_PAYLOAD,
      JSON.stringify(generated),
    )
  })
})
