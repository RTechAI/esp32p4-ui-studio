import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import {
  getForgeUIStandardChartLayout,
  getForgeUIStandardChartModel,
} from '~forgeui/ForgeUIStandardChart'
import {
  FG_PREVIEW_PALETTES,
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const LVGL_LARGE_RADIUS = '12px'

type StandardChartPreviewProps = IPreviewProps & {
  palette?: ForgePreviewPalette
}

const StandardChartPreview: React.FC<StandardChartPreviewProps> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const chart = getForgeUIStandardChartModel(component.props)
  const [simulatedData, setSimulatedData] = useState<Array<number | null> | null>(null)
  useEffect(() => {
    setSimulatedData(null)
    if (!chart.simulateValues) return
    let seed = component.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const timer = setInterval(() => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const low = Math.min(chart.simulatedMinimum, chart.simulatedMaximum)
      const high = Math.max(chart.simulatedMinimum, chart.simulatedMaximum)
      const next = Math.round(low + (seed / 0xFFFFFFFF) * (high - low))
      setSimulatedData(previous => [...(previous || chart.data).slice(1), next])
    }, chart.updateRateMs)
    return () => clearInterval(timer)
  }, [component.id, chart.simulateValues, chart.updateRateMs,
    chart.simulatedMinimum, chart.simulatedMaximum, chart.pointCount])
  const displayedChart = simulatedData
    ? getForgeUIStandardChartModel({ ...component.props, initialData: simulatedData })
    : chart
  const layout = getForgeUIStandardChartLayout(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const seriesColor = component.props.seriesColor
    ? chart.seriesColor
    : theme.accent
  const segments: string[] = []
  let currentSegment: string[] = []

  displayedChart.points.forEach((point, index) => {
    if (point.y === null) {
      if (currentSegment.length > 0) segments.push(currentSegment.join(' '))
      currentSegment = []
      return
    }
    currentSegment.push(
      `${layout.xPointPositions[index]},${layout.plotTop + point.y * layout.plotHeight}`,
    )
  })
  if (currentSegment.length > 0) segments.push(currentSegment.join(' '))

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      bg={theme.surface}
      border={`2px solid ${theme.surfaceBorder}`}
      borderRadius={LVGL_LARGE_RADIUS}
      pointerEvents="none"
      data-testid="standard-chart-preview"
      data-component="trend-chart"
      data-chart-surface="opaque-lvgl"
      data-chart-points={displayedChart.data.map(value =>
        value === null ? 'none' : value).join(',')}
      data-horizontal-divisions={chart.horizontalDivisions}
      data-vertical-divisions={chart.verticalDivisions}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`standard-chart-clip-${component.id}`}>
            <rect
              x={layout.plotLeft}
              y={layout.plotTop}
              width={layout.plotWidth}
              height={layout.plotHeight}
            />
          </clipPath>
        </defs>
        {chart.title && <text x={layout.plotLeft} y="17" fill={theme.textPrimary}
          fontSize="13" fontWeight="600" data-testid="trend-chart-title">{chart.title}</text>}
        {chart.showGrid && <g
          stroke={theme.textSecondary}
          strokeWidth="1"
          data-testid="standard-chart-grid"
        >
          {Array.from({ length: chart.horizontalDivisions }, (_, index) => {
            const y = layout.plotTop +
              ((index + 1) / (chart.horizontalDivisions + 1)) *
              layout.plotHeight
            return <line key={`h-${index}`} x1={layout.plotLeft} y1={y}
              x2={layout.plotRight} y2={y} />
          })}
          {(layout.xAxisLabels.length > 0
            ? layout.xAxisLabels.map(label => label.x)
            : Array.from({ length: chart.verticalDivisions }, (_, index) =>
              layout.plotLeft + layout.plotWidth * index /
              Math.max(1, chart.verticalDivisions - 1))).map((x, index) => {
            return <line key={`v-${index}`} x1={x} y1={layout.plotTop}
              x2={x} y2={layout.plotBottom} />
          })}
        </g>}
        {chart.showThresholds && [
          { key: 'warning', value: chart.warningThreshold, color: chart.warningColor },
          { key: 'alarm', value: chart.alarmThreshold, color: chart.alarmColor },
        ].map(item => {
          const range = chart.maximum - chart.minimum
          const y = layout.plotBottom - (range === 0 ? 0 :
            (item.value - chart.minimum) / range * layout.plotHeight)
          return <line key={item.key} x1={layout.plotLeft} x2={layout.plotRight}
            y1={y} y2={y} stroke={item.color} strokeWidth="1"
            strokeDasharray="4 3" data-testid={`trend-chart-${item.key}-threshold`} />
        })}
        {chart.showAxisLabels && <g
          fill={theme.textSecondary}
          fontSize={Math.max(8, Math.min(11, layout.labelGutter * 0.28))}
          textAnchor="end"
          dominantBaseline="middle"
          data-testid="standard-chart-y-labels"
        >
          {layout.yAxisLabels.map((label, index) => (
            <text
              key={index}
              x={layout.plotLeft - 4}
              y={label.y}
              data-testid="standard-chart-y-label"
            >
              {label.value}
            </text>
          ))}
        </g>}
        {chart.showAxisLabels && <g
          fill={theme.textSecondary}
          fontSize={Math.max(8, Math.min(11, layout.labelGutter * 0.28))}
          textAnchor="middle"
          dominantBaseline="hanging"
          data-testid="standard-chart-x-labels"
        >
          {layout.xAxisLabels
            .filter(label => label.visible)
            .map(label => (
              <text
                key={label.value}
                x={label.x}
                y={layout.plotBottom + 3}
                data-testid="standard-chart-x-label"
              >
                {label.value}
              </text>
            ))}
        </g>}
        {chart.yAxisLabel && <text x="9" y={(layout.plotTop + layout.plotBottom) / 2}
          fill={theme.textSecondary} fontSize="9" textAnchor="middle"
          transform={`rotate(-90 9 ${(layout.plotTop + layout.plotBottom) / 2})`}>{chart.yAxisLabel}</text>}
        {chart.xAxisLabel && <text x={(layout.plotLeft + layout.plotRight) / 2}
          y={layout.height - 4} fill={theme.textSecondary} fontSize="9"
          textAnchor="middle">{chart.xAxisLabel}</text>}
        <g clipPath={`url(#standard-chart-clip-${component.id})`}>
          {segments.map((points, index) => (
            <polyline
              key={index}
              fill="none"
              stroke={seriesColor}
              strokeWidth="2"
              strokeLinejoin="round"
              points={points}
              data-testid="standard-chart-series"
            />
          ))}
        </g>
      </svg>
    </Box>
  )
}

export default StandardChartPreview
