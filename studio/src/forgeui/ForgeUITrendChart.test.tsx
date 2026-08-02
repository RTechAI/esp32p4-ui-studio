import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'

import {
  createForgeUITrendSimulation,
  normalizeForgeUITrendChart,
} from './ForgeUITrendChart'
import { ForgeUITrendChartPreview } from './preview/ForgeUITrendChartPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'

describe('ForgeUI Native Trend Chart', () => {
  it('normalizes ranges, thresholds, supported fixed histories and generic semantics', () => {
    expect(
      normalizeForgeUITrendChart({
        minimum: 10,
        maximum: 5,
        warningThreshold: 999,
        alarmThreshold: -5,
        historyLength: 110,
        history: [1, 'bad', 2],
      }),
    ).toMatchObject({
      semanticType: 'generic',
      minimum: 10,
      maximum: 110,
      warningThreshold: 110,
      alarmThreshold: 110,
      historyLength: 128,
      history: [1, 2],
    })
  })

  it('produces deterministic bounded simulations for every preview mode', () => {
    const modes = [
      'sine',
      'sawtooth',
      'random-walk',
      'battery-discharge',
      'temperature-drift',
      'rpm',
    ]
    modes.forEach(simulationMode => {
      const model = normalizeForgeUITrendChart({
        minimum: 0,
        maximum: 100,
        simulationMode,
      })
      const first = createForgeUITrendSimulation(model, 32)
      expect(first).toEqual(createForgeUITrendSimulation(model, 32))
      expect(first).toHaveLength(32)
      expect(first.every(value => value >= 0 && value <= 100)).toBe(true)
    })
  })

  it('registers as Native Component #5 and renders the semantic preview', () => {
    expect(getForgeUIWidgetDefinition('TrendChart')).toMatchObject({
      displayName: 'Trend Chart',
      category: 'Dashboard',
      origin: 'forgeui-native',
      nativeWidgetSchemaVersion: 1,
      defaultWidth: 420,
      defaultHeight: 260,
    })
    render(
      <ChakraProvider>
        <ForgeUITrendChartPreview
          component={{
            id: 'rpm-trend',
            componentName: 'RPM',
            type: 'TrendChart',
            parent: 'root',
            children: [],
            props: { title: 'Engine RPM', units: 'RPM', simulationMode: 'rpm' },
          }}
          palette={FG_PREVIEW_PALETTES.graphite}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('forgeui-trend-chart')).toBeInTheDocument()
    expect(screen.getByText('Engine RPM')).toBeInTheDocument()
    expect(
      screen.getByLabelText('Engine RPM simulated trend'),
    ).toBeInTheDocument()
  })
})
