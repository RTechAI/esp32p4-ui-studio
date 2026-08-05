import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { getPreviewDefaultProps } from '../utils/defaultProps'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { normalizeForgeUITrendChartPro } from './ForgeUITrendChartPro'
import { ForgeUITrendChartProPreview } from './preview/ForgeUITrendChartProPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const pro = (id: string, name = 'EngineRPM', props: Record<string, unknown> = {}): IComponent => ({
  id, componentName: name, type: 'TrendChartPro', parent: 'root', children: [],
  props: { ...getPreviewDefaultProps('TrendChartPro'), ...props },
})
const project = (...children: IComponent[]): IComponents => ({
  root: { id: 'root', type: 'Box', parent: 'root', props: {}, children: children.map(child => child.id) },
  ...Object.fromEntries(children.map(child => [child.id, child])),
})
const BrowserPro = ({ component }: { component: IComponent }) => {
  const components = project(component)
  return <>{renderForgePreview({ component: components.root, components })}</>
}

describe('ForgeUI Native Trend Chart Pro', () => {
  it('is a separate premium native component and leaves Trend Chart registered', () => {
    expect(getForgeUIWidgetDefinition('TrendChartPro')).toMatchObject({
      displayName: 'Trend Chart Pro', category: 'Dashboard', origin: 'forgeui-native',
      nativeWidgetSchemaVersion: 1, defaultWidth: 360, defaultHeight: 220,
    })
    expect(getForgeUIWidgetDefinition('Chart')).toMatchObject({
      displayName: 'Trend Chart', origin: 'forgeui-native',
    })
  })

  it('normalizes units, bounds, scaling, history and lightweight limits', () => {
    expect(normalizeForgeUITrendChartPro({
      units: 'Custom', customUnits: 'Nm', decimalPlaces: 9, historyLength: 999,
      updateRateMs: 10, autoScale: false, fixedMin: 5000, fixedMax: 0,
    })).toMatchObject({
      units: 'Nm', decimalPlaces: 4, historyLength: 120, updateRateMs: 100,
      autoScale: false, minimum: 0, maximum: 5000,
    })
  })

  it('renders the premium header, trace, glow/fill controls and marker', () => {
    render(<ChakraProvider><ForgeUITrendChartProPreview component={pro('pro')} palette={FG_PREVIEW_PALETTES.graphite}/></ChakraProvider>)
    expect(screen.getByTestId('forgeui-trend-chart-pro')).toHaveTextContent('Engine RPM')
    expect(screen.getByTestId('trend-chart-pro-value')).toHaveTextContent('3962')
    expect(screen.getByTestId('trend-chart-pro-trace')).toHaveAttribute('stroke-linecap', 'round')
    expect(screen.getByTestId('trend-chart-pro-grid').querySelectorAll('line')).toHaveLength(6)
    expect(screen.getByTestId('trend-chart-pro-marker')).toBeInTheDocument()
  })

  it('uses the same premium renderer in Browser Preview', () => {
    const component = pro('browser-pro')
    render(<ChakraProvider><ForgeThemeProvider><BrowserPro component={component}/></ForgeThemeProvider></ChakraProvider>)
    expect(screen.getByTestId('forgeui-trend-chart-pro')).toBeInTheDocument()
    expect(screen.getByTestId('trend-chart-pro-trace')).toBeInTheDocument()
  })

  it('generates semantic SDK, private LVGL state and transition callbacks', () => {
    const generated = generateForgeUILvglCode(project(pro('engine-rpm')), 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Add_Engine_Rpm_Point(float value);',
      'void FG_Clear_Engine_Rpm(void);',
      'void FG_Set_Engine_Rpm_Units(const char * units);',
      'void FG_Set_Engine_Rpm_Warning(float value);',
      'void FG_Set_Engine_Rpm_Alarm(float value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Engine_Rpm_Warning', 'FG_On_Engine_Rpm_Alarm', 'FG_On_Engine_Rpm_Recovered',
    ]))
    expect(generated.code).toContain('fg_engine_rpm_chart = lv_chart_create')
    expect(generated.code).toContain('snprintf(value_text, sizeof(value_text)')
    expect(generated.code).toContain('if (next_state != fg_engine_rpm_chart_threshold_state)')
    expect(generated.code).not.toContain('extern lv_obj_t * fg_engine_rpm_chart')
  })

  it('keeps multiple instances collision-safe and bounded', () => {
    const generated = generateForgeUILvglCode(project(
      pro('one', 'ProcessTrend'), pro('two', 'ProcessTrend'),
    ), 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Add_One_Point(float value);',
      'void FG_Add_Two_Point(float value);',
    ]))
    expect((generated.code.match(/lv_chart_create\(/g) || [])).toHaveLength(2)
  })

  it('keeps the SDK identity stable when the presentation name changes', () => {
    const first = generateForgeUILvglCode(project(pro('stable-pro', 'Engine RPM')), 'graphite', undefined, { includeThemeTexture: false })
    const renamed = generateForgeUILvglCode(project(pro('stable-pro', 'Renamed Trend')), 'graphite', undefined, { includeThemeTexture: false })
    expect(renamed.publicApiDeclarations).toEqual(first.publicApiDeclarations)
    expect(renamed.userEventHooks).toEqual(first.userEventHooks)
  })
})
