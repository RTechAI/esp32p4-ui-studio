import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { getForgeUISensorTrendLabel, normalizeForgeUISensorTile } from './ForgeUISensorTile'
import { ForgeUISensorTilePreview } from './preview/ForgeUISensorTilePreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const tile = (id: string, name: string, props: Record<string, unknown> = {}): IComponent => ({
  id, componentName: name, type: 'SensorTile', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 260, h: 180, ...props },
})

describe('ForgeUI Sensor Tile', () => {
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
  })

  it('exports composite LVGL, semantic APIs and independent collision-safe instances', () => {
    const first = tile('a', 'Engine RPM', { sensorType: 'rpm', value: 1450, enableClick: true })
    const second = tile('b', 'Engine RPM', { sensorType: 'rpm', value: 1520, enableClick: true })
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['a', 'b'], props: {} }, a: first, b: second,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('fg_engine_rpm_sensor_tile_value')
    expect(generated.code).toContain('lv_bar_create(fg_engine_rpm_sensor_tile)')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Engine_RPM_Value(float value);',
      'void FG_Set_Engine_RPM_Units(const char * units);',
      'void FG_Set_Engine_RPM_Status(const char * text, uint32_t rgb);',
      'void FG_Set_Engine_RPM_Trend(int32_t trend);',
      'void FG_Set_Engine_RPM_Timestamp(const char * timestamp);',
      'void FG_Set_Engine_RPM_Colour(uint32_t rgb);',
      'void FG_Set_Engine_RPM_2_Value(float value);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Engine_RPM_Clicked', 'FG_On_Engine_RPM_2_Clicked',
    ]))
  })
})
