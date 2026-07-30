import React from 'react'
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
  const layout = getForgeUIStandardChartLayout(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const seriesColor = component.props.seriesColor
    ? chart.seriesColor
    : theme.accent
  const segments: string[] = []
  let currentSegment: string[] = []

  chart.points.forEach((point, index) => {
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
      data-chart-surface="opaque-lvgl"
      data-chart-points={chart.data.map(value =>
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
        <g
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
          {layout.xPointPositions.map((x, index) => {
            return <line key={`v-${index}`} x1={x} y1={layout.plotTop}
              x2={x} y2={layout.plotBottom} />
          })}
        </g>
        <g
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
        </g>
        <g
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
        </g>
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
