import { generateForgeUILvglCode } from './ForgeUILvglExport'

const chart = (
  id: string,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  componentName: 'Visible name can change',
  type: 'TrendChart',
  parent: 'root',
  children: [],
  props: {
    x: 20,
    y: 30,
    w: 420,
    h: 260,
    title: 'Engine RPM',
    units: 'RPM',
    minimum: 0,
    maximum: 6000,
    warningThreshold: 4500,
    alarmThreshold: 5500,
    historyLength: 64,
    showGrid: true,
    showAxes: true,
    generateRuntimeApi: true,
    enableUserEvents: true,
    ...props,
  },
})

const generate = (...charts: IComponent[]) =>
  generateForgeUILvglCode(
    {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: charts.map(item => item.id),
      },
      ...Object.fromEntries(charts.map(item => [item.id, item])),
    },
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )

describe('Trend Chart LVGL and Runtime SDK export', () => {
  it('emits a fixed circular history, semantic APIs and threshold hooks', () => {
    const generated = generate(chart('engine-rpm'))
    expect(generated.code).toContain(
      'static int32_t fg_engine_rpm_trend_history[64] = {0};',
    )
    expect(generated.code).toContain('LV_CHART_UPDATE_MODE_CIRCULAR')
    expect(generated.code).toContain('lv_chart_set_ext_y_array')
    expect(generated.publicApiDeclarations).toEqual(
      expect.arrayContaining([
        'void FG_Add_Engine_Rpm_Point(float value);',
        'void FG_Clear_Engine_Rpm(void);',
        'void FG_Set_Engine_Rpm_Range(float minimum, float maximum);',
        'void FG_Set_Engine_Rpm_Thresholds(float warning, float alarm);',
      ]),
    )
    expect(generated.userEventHooks).toEqual(
      expect.arrayContaining([
        'FG_On_Engine_Rpm_Warning',
        'FG_On_Engine_Rpm_Alarm',
        'FG_On_Engine_Rpm_Cleared',
      ]),
    )
    const addApi = generated.code.slice(
      generated.code.indexOf('void FG_Add_Engine_Rpm_Point'),
      generated.code.indexOf('void FG_Clear_Engine_Rpm'),
    )
    expect(addApi).not.toContain('FG_On_')
  })

  it('keeps duplicate instances independent and derives identity from persisted IDs', () => {
    const generated = generate(
      chart('engine-rpm'),
      chart('battery-voltage', {
        title: 'Battery Voltage',
        units: 'V',
        minimum: 10,
        maximum: 16,
        historyLength: 128,
      }),
    )
    expect(generated.code).toContain('fg_engine_rpm_trend_history[64]')
    expect(generated.code).toContain('fg_battery_voltage_trend_history[128]')
    expect(generated.publicApiDeclarations).toContain(
      'void FG_Add_Battery_Voltage_Point(float value);',
    )
  })

  it('emits one deterministic payload for Live Studio and Standalone consumers', () => {
    expect(
      generate(
        chart('temperature-trend', {
          title: 'Temperature',
          units: 'C',
          simulationMode: 'temperature-drift',
        }),
      ),
    ).toEqual(
      generate(
        chart('temperature-trend', {
          title: 'Temperature',
          units: 'C',
          simulationMode: 'temperature-drift',
        }),
      ),
    )
  })
})
