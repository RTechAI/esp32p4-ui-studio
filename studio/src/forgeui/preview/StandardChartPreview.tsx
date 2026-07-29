import React from 'react'
import { Box } from '@chakra-ui/react'
import { getForgeUIStandardChartModel } from '~forgeui/ForgeUIStandardChart'

const VIEWBOX_WIDTH = 240
const VIEWBOX_HEIGHT = 120
const PADDING = 10
const PLOT_WIDTH = VIEWBOX_WIDTH - PADDING * 2
const PLOT_HEIGHT = VIEWBOX_HEIGHT - PADDING * 2
const LVGL_LIGHT_CARD = '#ffffff'
const LVGL_LIGHT_GREY = '#b0bec5'
const LVGL_LARGE_RADIUS = '12px'

const StandardChartPreview: React.FC<IPreviewProps> = ({ component }) => {
  const chart = getForgeUIStandardChartModel(component.props)
  const segments: string[] = []
  let currentSegment: string[] = []

  chart.points.forEach(point => {
    if (point.y === null) {
      if (currentSegment.length > 0) segments.push(currentSegment.join(' '))
      currentSegment = []
      return
    }
    currentSegment.push(
      `${PADDING + point.x * PLOT_WIDTH},${PADDING + point.y * PLOT_HEIGHT}`,
    )
  })
  if (currentSegment.length > 0) segments.push(currentSegment.join(' '))

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      bg={LVGL_LIGHT_CARD}
      border={`2px solid ${LVGL_LIGHT_GREY}`}
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
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={`standard-chart-clip-${component.id}`}>
            <rect
              x={PADDING}
              y={PADDING}
              width={PLOT_WIDTH}
              height={PLOT_HEIGHT}
            />
          </clipPath>
        </defs>
        <g
          stroke={LVGL_LIGHT_GREY}
          strokeWidth="1"
          data-testid="standard-chart-grid"
        >
          {Array.from({ length: chart.horizontalDivisions }, (_, index) => {
            const y = PADDING +
              ((index + 1) / (chart.horizontalDivisions + 1)) * PLOT_HEIGHT
            return <line key={`h-${index}`} x1={PADDING} y1={y}
              x2={PADDING + PLOT_WIDTH} y2={y} />
          })}
          {Array.from({ length: chart.verticalDivisions }, (_, index) => {
            const x = PADDING +
              ((index + 1) / (chart.verticalDivisions + 1)) * PLOT_WIDTH
            return <line key={`v-${index}`} x1={x} y1={PADDING}
              x2={x} y2={PADDING + PLOT_HEIGHT} />
          })}
        </g>
        <g clipPath={`url(#standard-chart-clip-${component.id})`}>
          {segments.map((points, index) => (
            <polyline
              key={index}
              fill="none"
              stroke={chart.seriesColor}
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
