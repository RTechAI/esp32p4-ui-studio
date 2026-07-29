import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import {
  FORGEUI_STANDARD_CHART_DEFAULT_DATA,
  getForgeUIStandardChartModel,
} from './ForgeUIStandardChart'
import StandardChartPreview from './preview/StandardChartPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const chart = (props: Record<string, unknown> = {}): IComponent => ({
  id: 'chart',
  parent: 'root',
  type: 'Chart',
  props: { x: 14, y: 22, w: 300, h: 140, ...props },
  children: [],
})

const BrowserChart = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root', parent: 'root', type: 'Box', props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, chart: component },
  })}</>
}

describe('Standard Chart preview parity', () => {
  it('normalizes the exporter-compatible default model', () => {
    const model = getForgeUIStandardChartModel({})
    expect(model).toMatchObject({
      minimum: 0,
      maximum: 100,
      pointCount: 7,
      data: FORGEUI_STANDARD_CHART_DEFAULT_DATA,
      seriesColor: '#2196f3',
      horizontalDivisions: 3,
      verticalDivisions: 5,
    })
    expect(model.points.map(point => point.y)).toEqual([
      0.9, 0.7, 0.8, 0.5, 0.6, 0.30000000000000004, 0.4,
    ])
  })

  it('supports negative/reversed/equal ranges and preserves duplicates', () => {
    const reversed = getForgeUIStandardChartModel({
      yMin: 50,
      yMax: -50,
      initialData: [-80, 0.9, 0.9, 90],
      pointCount: 4,
    })
    expect(reversed.minimum).toBe(-50)
    expect(reversed.maximum).toBe(50)
    expect(reversed.data).toEqual([-50, 0, 0, 50])

    const equal = getForgeUIStandardChartModel({
      min: 10, max: 10, initialData: [0, 20],
    })
    expect(equal.data.slice(-2)).toEqual([10, 10])
    expect(equal.points.filter(point => point.value !== null)
      .every(point => point.y === 1)).toBe(true)
  })

  it('trims and pads data to the normalized point count', () => {
    expect(getForgeUIStandardChartModel({
      pointCount: 2, initialData: [1, 2, 3],
    }).data).toEqual([1, 2])
    expect(getForgeUIStandardChartModel({
      pointCount: 4, initialData: [10, 20],
    }).data).toEqual([null, null, 10, 20])
  })

  it('renders an opaque divided plot with serialized data and color', () => {
    render(
      <ChakraProvider>
        <StandardChartPreview component={chart({
          yMin: -50,
          yMax: 50,
          initialData: [-50, 0, 50],
          pointCount: 3,
          horizontalDivisions: 2,
          verticalDivisions: 4,
          seriesColor: '#12AB34',
        })} />
      </ChakraProvider>,
    )
    const preview = screen.getByTestId('standard-chart-preview')
    expect(preview).toHaveStyle({
      background: '#ffffff',
      border: '2px solid #b0bec5',
      borderRadius: '12px',
    })
    expect(preview).toHaveAttribute('data-chart-surface', 'opaque-lvgl')
    expect(preview).toHaveAttribute('data-chart-points', '-50,0,50')
    expect(preview).toHaveAttribute('data-horizontal-divisions', '2')
    expect(preview).toHaveAttribute('data-vertical-divisions', '4')
    const grid = screen.getByTestId('standard-chart-grid')
    expect(grid.querySelectorAll('line')).toHaveLength(6)
    expect(grid).toHaveAttribute('stroke', '#b0bec5')
    expect(screen.getByTestId('standard-chart-series'))
      .toHaveAttribute('stroke', '#12AB34')
  })

  it('uses the exact shared renderer and model in Browser Preview', () => {
    const component = chart({
      initialData: [5, 25, 75],
      pointCount: 3,
    })
    const { rerender } = render(
      <ChakraProvider>
        <StandardChartPreview component={component} />
      </ChakraProvider>,
    )
    const canvasPoints = screen.getByTestId('standard-chart-series')
      .getAttribute('points')

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserChart component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )
    const preview = screen.getByTestId('standard-chart-preview')
    expect(screen.getByTestId('standard-chart-series'))
      .toHaveAttribute('points', canvasPoints)
    expect(preview.parentElement).toHaveStyle({
      width: '300px',
      height: '140px',
    })
    expect(preview).toHaveAttribute('data-chart-surface', 'opaque-lvgl')
    expect(preview).toHaveStyle({
      background: '#ffffff',
      borderRadius: '12px',
    })
  })
})
