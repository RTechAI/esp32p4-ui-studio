import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import {
  FORGEUI_STANDARD_CHART_DEFAULT_DATA,
  getForgeUIStandardChartLayout,
  getForgeUIStandardChartModel,
  getForgeUIStandardChartPointOffsetX,
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
      pointCount: 11,
      data: FORGEUI_STANDARD_CHART_DEFAULT_DATA,
      seriesColor: '#2196f3',
      horizontalDivisions: 3,
      verticalDivisions: 11,
    })
    expect(model.points.map(point => point.y)).toEqual([
      0.9, 0.7, 0.8, 0.5, 0.6, 0.30000000000000004, 0.4,
      0.25, 0.31999999999999995, 0.42000000000000004,
      0.5,
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

  it('derives grid-aligned Y labels for default and normalized ranges', () => {
    const defaults = getForgeUIStandardChartLayout({ w: 388, h: 120 })
    expect(defaults.yAxisLabels.map(label => label.value))
      .toEqual([100, 75, 50, 25, 0])
    expect(defaults.yAxisLabels.map(label => label.y))
      .toEqual([12, 33, 54, 75, 96])
    expect(defaults.xAxisLabels.map(label => label.value))
      .toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(defaults.xAxisLabels.map(label => label.x)).toEqual([
      44, 77, 110, 144, 177, 211, 244, 277, 311, 344, 378,
    ])
    expect(defaults.xAxisLabels.every(label => label.visible)).toBe(true)
    expect(defaults.xPointPositions)
      .toEqual(defaults.xAxisLabels.map(label => label.x))
    expect(defaults.xPointPositions).toEqual(
      getForgeUIStandardChartModel({}).points.map((_, index) =>
        defaults.plotLeft + getForgeUIStandardChartPointOffsetX(
          index,
          11,
          defaults.plotWidth,
        )),
    )
    expect(defaults.xPointPositions[0]).toBe(defaults.plotLeft)
    expect(defaults.xPointPositions[10]).toBe(defaults.plotRight)
    expect(defaults.bottomLabelGutter).toBe(22)

    const reversed = getForgeUIStandardChartLayout({
      w: 120,
      h: 60,
      yMin: 50,
      yMax: -50,
      horizontalDivisions: 3,
    })
    expect(reversed.yAxisLabels.map(label => label.value))
      .toEqual([50, 25, 0, -25, -50])
    expect(reversed.plotLeft).toBe(21)

    const nonEven = getForgeUIStandardChartLayout({
      yMin: 0,
      yMax: 10,
      horizontalDivisions: 2,
    })
    expect(nonEven.yAxisLabels.map(label => label.value))
      .toEqual([10, 7, 3, 0])
  })

  it('thins dense X labels deterministically while retaining endpoints', () => {
    const dense = getForgeUIStandardChartLayout({
      w: 120,
      h: 60,
      pointCount: 20,
    })
    const visible = dense.xAxisLabels
      .filter(label => label.visible)
      .map(label => label.value)
    expect(visible[0]).toBe(0)
    expect(visible[visible.length - 1]).toBe(19)
    expect(visible.length).toBeLessThan(20)
    dense.xAxisLabels.forEach((label, index) => {
      expect(label.x).toBe(
        dense.plotLeft + getForgeUIStandardChartPointOffsetX(
          index,
          20,
          dense.plotWidth,
        ),
      )
    })
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
      background: '#1E2328',
      border: '2px solid #F2A900',
      borderRadius: '12px',
    })
    expect(preview).toHaveAttribute('data-chart-surface', 'opaque-lvgl')
    expect(preview).toHaveAttribute('data-chart-points', '-50,0,50')
    expect(preview).toHaveAttribute('data-horizontal-divisions', '2')
    expect(preview).toHaveAttribute('data-vertical-divisions', '3')
    const grid = screen.getByTestId('standard-chart-grid')
    expect(grid.querySelectorAll('line')).toHaveLength(5)
    const verticalGrid = Array.from(grid.querySelectorAll('line'))
      .slice(2)
      .map(line => line.getAttribute('x1'))
    const labels = screen.getAllByTestId('standard-chart-x-label')
    expect(verticalGrid).toEqual(labels.map(label => label.getAttribute('x')))
    const seriesX = screen.getByTestId('standard-chart-series')
      .getAttribute('points')!
      .trim()
      .split(/\s+/)
      .map(point => point.split(',')[0])
    expect(verticalGrid).toEqual(seriesX)
    expect(grid).toHaveAttribute('stroke', '#B5B6B8')
    expect(screen.getByTestId('standard-chart-y-labels'))
      .toHaveAttribute('fill', '#B5B6B8')
    expect(screen.getAllByTestId('standard-chart-y-label')
      .map(label => label.textContent))
      .toEqual(['50', '17', '-17', '-50'])
    expect(screen.getAllByTestId('standard-chart-x-label')
      .map(label => label.textContent))
      .toEqual(['0', '1', '2'])
    expect(screen.getByTestId('standard-chart-series'))
      .toHaveAttribute('stroke', '#12AB34')
  })

  it('renders all eleven default point positions on Canvas and Browser Preview', () => {
    const component = chart({ w: 388 })
    const { rerender } = render(
      <ChakraProvider>
        <StandardChartPreview component={component} />
      </ChakraProvider>,
    )

    const expectedLabels = Array.from({ length: 11 }, (_, index) =>
      String(index))
    const canvasSeries = screen.getByTestId('standard-chart-series')
      .getAttribute('points')!
      .trim()
      .split(/\s+/)
    expect(canvasSeries).toHaveLength(11)
    expect(screen.getAllByTestId('standard-chart-x-label')
      .map(label => label.textContent))
      .toEqual(expectedLabels)

    rerender(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserChart component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const browserSeries = screen.getByTestId('standard-chart-series')
      .getAttribute('points')!
      .trim()
      .split(/\s+/)
    expect(browserSeries).toHaveLength(11)
    expect(screen.getAllByTestId('standard-chart-x-label')
      .map(label => label.textContent))
      .toEqual(expectedLabels)
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
    const canvasLabels = screen.getAllByTestId('standard-chart-y-label')
      .map(label => ({
        text: label.textContent,
        x: label.getAttribute('x'),
        y: label.getAttribute('y'),
      }))
    const canvasXLabels = screen.getAllByTestId('standard-chart-x-label')
      .map(label => ({
        text: label.textContent,
        x: label.getAttribute('x'),
        y: label.getAttribute('y'),
      }))

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
    expect(screen.getAllByTestId('standard-chart-y-label')
      .map(label => ({
        text: label.textContent,
        x: label.getAttribute('x'),
        y: label.getAttribute('y'),
      }))).toEqual(canvasLabels)
    expect(screen.getAllByTestId('standard-chart-x-label')
      .map(label => ({
        text: label.textContent,
        x: label.getAttribute('x'),
        y: label.getAttribute('y'),
      }))).toEqual(canvasXLabels)
    expect(preview.parentElement).toHaveStyle({
      width: '300px',
      height: '140px',
    })
    expect(preview).toHaveAttribute('data-chart-surface', 'opaque-lvgl')
    expect(preview).toHaveStyle({
      background: '#120824',
      border: '2px solid #D946EF',
      borderRadius: '12px',
    })
  })
})
