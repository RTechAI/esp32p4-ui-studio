import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { normalizeForgeUITrendChartPro } from './ForgeUITrendChartPro'
import { ForgeUITrendChartPreview } from './preview/ForgeUITrendChartPreview'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

describe('ForgeUI Trend Chart Pro', () => {
  it('adds conservative presentation defaults without changing semantic normalization', () => {
    const model = normalizeForgeUITrendChartPro({ minimum: 0, maximum: 6000 })
    expect(model).toMatchObject({
      minimum: 0,
      maximum: 6000,
      glowEnabled: true,
      markerPulseEnabled: false,
      animationEnabled: true,
      footerMode: 'range-history',
    })
  })

  it('is an independently registered ForgeUI Native component', () => {
    expect(getForgeUIWidgetDefinition('TrendChartPro')).toMatchObject({
      displayName: 'Trend Chart Pro',
      origin: 'forgeui-native',
      defaultWidth: 440,
      capabilities: { supportsRuntimeApi: true, supportsUserEvents: true },
    })
    expect(getForgeUIWidgetDefinition('TrendChart')?.displayName).toBe('Trend Chart')
  })

  it('renders premium marker and history footer deterministically', () => {
    render(<ChakraProvider>
      <ForgeUITrendChartPreview
        component={{ id: 'Engine_Rpm', type: 'TrendChartPro', props: { history: [10, 20, 30], minimum: 0, maximum: 100 } } as IComponent}
        palette={FG_PREVIEW_PALETTES.graphite}
      />,
    </ChakraProvider>)
    expect(screen.getByTestId('forgeui-trend-chart-latest-marker')).toBeInTheDocument()
    expect(screen.getByText('64 samples')).toBeInTheDocument()
  })
})
