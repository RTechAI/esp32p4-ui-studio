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

const generate = (components: IComponents) =>
  generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )

describe('Chart generated developer API', () => {
  it('retains the default line chart, series, and startup shape', () => {
    const generated = generate(rootWith(chart('data-chart', { w: 388 })))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Add_Data_Chart_Point(int32_t value);',
      'void FG_Clear_Data_Chart(void);',
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
      'lv_chart_set_point_count(fg_data_chart_chart, 11);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_div_line_count(fg_data_chart_chart, 3, 11);',
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
    ;[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(value => {
      expect(generated.code).toContain(
        `lv_obj_t * obj1_x_label_${value} = lv_label_create(fg_application_page);`,
      )
      expect(generated.code).toContain(
        `lv_label_set_text(obj1_x_label_${value}, "${value}");`,
      )
      expect(generated.code).toContain(
        `lv_obj_clear_flag(obj1_x_label_${value}, LV_OBJ_FLAG_CLICKABLE);`,
      )
    })
    expect(generated.code).toContain(
      'lv_obj_set_pos(obj1_x_label_0, 114 + 36, 161 + 99);',
    )
    expect(generated.code).toContain(
      'lv_obj_set_pos(obj1_x_label_10, 114 + 368, 161 + 99);',
    )
    ;[
      36, 69, 102, 136, 169, 203, 236, 269, 303, 336, 368,
    ].forEach((position, index) => {
      expect(generated.code).toContain(
        `lv_obj_set_pos(obj1_x_label_${index}, 114 + ${position}, 161 + 99);`,
      )
    })
    ;[10, 30, 20, 50, 40, 70, 60, 75, 68, 58, 50].forEach(value => {
      expect(generated.code).toContain(
        `lv_chart_set_next_value(fg_data_chart_chart, fg_data_chart_chart_series, ${value});`,
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
      'lv_chart_set_next_value(fg_data_chart_chart, fg_data_chart_chart_series, value);',
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
    }, 'ConfiguredChart')))
    expect(generated.code).toContain(
      'lv_chart_set_div_line_count(fg_configured_chart_chart, 4, 11);',
    )
    expect(generated.code).toContain(
      'lv_chart_set_update_mode(fg_configured_chart_chart, LV_CHART_UPDATE_MODE_CIRCULAR);',
    )
    expect(generated.code).toContain(
      'lv_chart_add_series(fg_configured_chart_chart, lv_color_hex(0x12AB34), LV_CHART_AXIS_PRIMARY_Y);',
    )
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
      'void FG_Add_Data_Chart_Point(int32_t value);',
      'void FG_Clear_Data_Chart(void);',
      'void FG_Add_Data_Chart_2_Point(int32_t value);',
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
        x: '114',
        y: '161',
        w: 240,
        h: 120,
      }),
    ))
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_CHART_PAYLOAD,
      JSON.stringify(generated),
    )
  })
})
