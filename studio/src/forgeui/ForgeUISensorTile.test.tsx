import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { getForgeUISensorTrendLabel, normalizeForgeUISensorTile } from './ForgeUISensorTile'
import { ForgeUISensorTilePreview } from './preview/ForgeUISensorTilePreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import { getPreviewDefaultProps } from '../utils/defaultProps'

const tile = (id: string, name: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName: name, type: 'SensorTile', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 260, h: 180, ...props },
})

describe('ForgeUI Sensor Tile', () => {
  it('uses compact defaults without changing explicitly saved legacy geometry', () => {
    expect(getPreviewDefaultProps('SensorTile')).toMatchObject({
      w: 240, h: 145, padding: 12, title: 'Temperature', value: 23.7,
      units: '°C', statusText: 'Normal', trend: 'stable', timestamp: 'Now',
    })
    expect(tile('legacy', 'Legacy', { w: 260, h: 180 }).props).toMatchObject({ w: 260, h: 180 })
  })

  it('normalizes sensor defaults, engineering ranges and automatic severity', () => {
    expect(normalizeForgeUISensorTile({ sensorType: 'rpm' })).toMatchObject({ title: 'Speed', units: 'RPM', decimals: 0 })
    expect(normalizeForgeUISensorTile({ value: 95, criticalHigh: 90, autoColour: true }).status).toBe('critical')
    expect(normalizeForgeUISensorTile({ value: 50, rangeMin: 0, rangeMax: 100 }).progress).toBe(50)
    expect(getForgeUISensorTrendLabel('falling')).toContain('Falling')
  })

  it('registers as ForgeUI Native Component #2 in the sensor family', () => {
    expect(getForgeUIWidgetDefinition('SensorTile')).toMatchObject({
      displayName: 'Sensor Tile', category: 'Dashboard', origin: 'forgeui-native', nativeWidgetSchemaVersion: 1,
      platform: { kind: 'native-widget', family: 'sensors' },
      capabilities: { supportsRuntimeApi: true, supportsUserEvents: true, childOwnership: 'none' },
      documentationId: 'docs/FORGEUI_SENSOR_TILE.md',
    })
  })

  it('renders one semantic engineering preview', () => {
    render(<ChakraProvider><ForgeUISensorTilePreview component={tile('t', 'Pressure', {
      sensorType: 'pressure', title: 'Line Pressure', value: 1.42, decimals: 2, units: 'bar', trend: 'rising',
    })} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    const preview = screen.getByTestId('forgeui-sensor-tile')
    expect(preview).toHaveTextContent('Line Pressure')
    expect(preview).toHaveTextContent('1.42')
    expect(preview).toHaveTextContent('bar')
    expect(preview).toHaveTextContent('Rising')
    expect(preview).toHaveStyle({ borderRadius: '8px', padding: '12px' })
  })

  it('collapses hidden sections and gives an empty icon no text or spacing node', () => {
    render(<ChakraProvider><ForgeUISensorTilePreview component={tile('t', 'Compact', {
      icon: '', showTrend: false, showProgress: false, showTimestamp: false,
    })} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.queryByLabelText('Sensor tile icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Stable')).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByText('Now')).not.toBeInTheDocument()
  })

  it('exports composite LVGL, semantic APIs and independent collision-safe instances', () => {
    const first = tile('a', 'Engine RPM', { sensorType: 'rpm', value: 1450, enableClick: true })
    const second = tile('b', 'Engine RPM', { sensorType: 'rpm', value: 1520, enableClick: true })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['a', 'b'], props: {} }, a: first, b: second,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('fg_a_sensor_tile_value')
    expect(generated.code).toContain('lv_bar_create(fg_a_sensor_tile)')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_A_Value(float value);',
      'void FG_Set_A_Units(const char * units);',
      'void FG_Set_A_Status(const char * text, uint32_t rgb);',
      'void FG_Set_A_Trend(int32_t trend);',
      'void FG_Set_A_Timestamp(const char * timestamp);',
      'void FG_Set_A_Colour(uint32_t rgb);',
      'void FG_Set_B_Value(float value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_A_Clicked', 'FG_On_B_Clicked',
    ]))
    generated.publicApiDeclarations.forEach(declaration => {
      expect(generated.code).toContain(declaration.replace(/;$/, ''))
    })
    expect(generated.code).toContain('lv_obj_set_size(fg_a_sensor_tile, 260, 180);')
  })

  it('exports compact geometry and collapses optional rows without icon placeholders', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['t'], props: {} },
      t: tile('t', 'Compact Sensor', {
        w: 240, h: 145, padding: 12, icon: '', showTrend: false,
        showProgress: true, showTimestamp: true,
      }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('lv_obj_set_size(fg_t_sensor_tile, 240, 145);')
    expect(generated.code).toContain('lv_obj_set_style_radius(fg_t_sensor_tile, 8, LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_style_pad_all(fg_t_sensor_tile, 12, LV_PART_MAIN);')
    expect(generated.code).toContain('lv_obj_set_size(fg_t_sensor_tile_status_indicator, 6, 6);')
    expect(generated.code).toContain('lv_obj_set_size(fg_t_sensor_tile_progress, 216, 6);')
    expect(generated.code).not.toContain('fg_t_sensor_tile_icon = lv_label_create')
    expect(generated.code).not.toContain('fg_t_sensor_tile_trend = lv_label_create')
    expect(generated.publicApiDeclarations).toHaveLength(6)
    expect(generated.userEventHooks).toContain('FG_On_T_Clicked')
  })

  it('emits valid centralized C float literals for integral, decimal and negative ranges', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['t'], props: {} },
      t: tile('t', 'Temperature', {
        rangeMin: -10, rangeMax: 100, warningLow: 0.125,
        warningHigh: 80, criticalLow: 10, criticalHigh: 90,
      }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('value - -10.0f')
    expect(generated.code).toContain('100.0f - -10.0f')
    expect(generated.code).toContain('value <= 0.125f')
    expect(generated.code).not.toMatch(/(?<![.\d])(?:0|10|80|90|100)f\b/)
  })

  it('omits all six APIs when Runtime API generation is disabled', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['t'], props: {} },
      t: tile('t', 'Private Sensor', { generateRuntimeApi: false }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('FG_Set_T_')
    expect(generated.code).not.toContain('void FG_Set_T_')
  })
})
