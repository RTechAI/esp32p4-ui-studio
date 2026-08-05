export const FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT = 11

export const FORGEUI_STANDARD_CHART_DEFAULT_DATA =
  [10, 30, 20, 50, 40, 70, 60, 75, 68, 58, 50]

export interface ForgeUIStandardChartPoint {
  index: number
  value: number | null
  x: number
  y: number | null
}

export interface ForgeUIStandardChartModel {
  title: string
  xAxisMode: 'relative-time' | 'clock-time' | 'hidden' | 'samples'
  xAxisLabel: string
  historyWindowSeconds: number
  historyEndTime: string
  yAxisLabel: string
  minimum: number
  maximum: number
  pointCount: number
  data: Array<number | null>
  points: ForgeUIStandardChartPoint[]
  seriesColor: string
  horizontalDivisions: number
  verticalDivisions: number
  showGrid: boolean
  showAxisLabels: boolean
  showThresholds: boolean
  warningThreshold: number
  alarmThreshold: number
  warningColor: string
  alarmColor: string
  updateRateMs: number
  simulateValues: boolean
  simulatedMinimum: number
  simulatedMaximum: number
}

export interface ForgeUIStandardChartAxisLabel {
  value: number
  y: number
}

export interface ForgeUIStandardChartXAxisLabel {
  value: string
  x: number
  visible: boolean
}

export interface ForgeUIStandardChartLayout {
  width: number
  height: number
  mainBorderWidth: number
  labelGutter: number
  rightPadding: number
  topPadding: number
  bottomLabelGutter: number
  plotLeft: number
  plotTop: number
  plotRight: number
  plotBottom: number
  plotWidth: number
  plotHeight: number
  xPointPositions: number[]
  yAxisLabels: ForgeUIStandardChartAxisLabel[]
  xAxisLabels: ForgeUIStandardChartXAxisLabel[]
}

const integer = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback
}

const seriesColor = (value: unknown) => {
  if (typeof value === 'string') {
    const normalized = value.replace(/^#/, '')
    if (/^[0-9a-fA-F]{6}$/.test(normalized)) return `#${normalized}`
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `#${Math.max(0, Math.min(0xFFFFFF, Math.trunc(value)))
      .toString(16).padStart(6, '0')}`
  }
  return '#2196f3'
}

const text = (value: unknown, fallback: string) =>
  typeof value === 'string' ? value.slice(0, 80) : fallback
const flag = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback

const xAxisMode = (value: unknown): ForgeUIStandardChartModel['xAxisMode'] =>
  value === 'clock-time' || value === 'hidden' || value === 'samples'
    ? value
    : 'relative-time'

const clockLabel = (endTime: string, secondsBeforeEnd: number) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(endTime)
  if (!match) return endTime
  const totalMinutes = Number(match[1]) * 60 + Number(match[2]) -
    Math.round(secondsBeforeEnd / 60)
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`
}

export const getForgeUIStandardChartNormalizedX = (
  index: number,
  pointCount: number,
) => pointCount <= 1 ? 0 : index / (pointCount - 1)

/**
 * Mirrors LVGL 9.2's line-chart and vertical-division X calculation:
 * `(content_width * index) / (count - 1)` using integer division.
 */
export const getForgeUIStandardChartPointOffsetX = (
  index: number,
  pointCount: number,
  contentWidth: number,
) => pointCount <= 1
  ? 0
  : Math.trunc(contentWidth * index / (pointCount - 1))

export const getForgeUIStandardChartModel = (
  props: Record<string, unknown>,
): ForgeUIStandardChartModel => {
  const firstRangeValue = integer(props.yMin ?? props.min, 0)
  const secondRangeValue = integer(props.yMax ?? props.max, 100)
  const minimum = Math.min(firstRangeValue, secondRangeValue)
  const maximum = Math.max(firstRangeValue, secondRangeValue)
  const pointCount = Math.max(
    1,
    integer(props.pointCount, FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT),
  )
  const configuredData = Array.isArray(props.initialData)
    ? props.initialData
    : FORGEUI_STANDARD_CHART_DEFAULT_DATA
  const normalizedData = configuredData
    .slice(0, pointCount)
    .map(value => Math.max(
      minimum,
      Math.min(maximum, integer(value, minimum)),
    ))
  const data: Array<number | null> = [
    ...Array(Math.max(0, pointCount - normalizedData.length)).fill(null),
    ...normalizedData,
  ]
  const range = maximum - minimum
  const clamp = (value: unknown, fallback: number) => Math.max(
    minimum, Math.min(maximum, integer(value, fallback)),
  )
  const points = data.map((value, index) => ({
    index,
    value,
    x: getForgeUIStandardChartNormalizedX(index, pointCount),
    y: value === null
      ? null
      : range === 0
        ? 1
        : 1 - (value - minimum) / range,
  }))
  const resolvedXAxisMode = xAxisMode(props.xAxisMode)
  const configuredXAxisLabel = text(props.xAxisLabel, '')
  const resolvedXAxisLabel = resolvedXAxisMode === 'samples'
    ? configuredXAxisLabel || 'Samples'
    : configuredXAxisLabel.trim().toLowerCase() === 'samples'
      ? ''
      : configuredXAxisLabel

  return {
    title: text(props.title, ''),
    xAxisMode: resolvedXAxisMode,
    xAxisLabel: resolvedXAxisLabel,
    historyWindowSeconds: Math.max(1, Math.min(86400,
      integer(props.historyWindowSeconds, 60))),
    historyEndTime: text(props.historyEndTime, '14:22'),
    yAxisLabel: text(props.yAxisLabel, ''),
    minimum,
    maximum,
    pointCount,
    data,
    points,
    seriesColor: seriesColor(props.seriesColor),
    horizontalDivisions: Math.max(
      0,
      integer(props.horizontalDivisions ?? props.hdiv, 3),
    ),
    verticalDivisions: resolvedXAxisMode === 'clock-time' ? 3 :
      resolvedXAxisMode === 'samples' ? pointCount : 5,
    showGrid: flag(props.showGrid, true),
    showAxisLabels: flag(props.showAxisLabels, true),
    showThresholds: flag(props.showThresholds, true),
    warningThreshold: clamp(props.warningThreshold, 70),
    alarmThreshold: clamp(props.alarmThreshold, 85),
    warningColor: seriesColor(props.warningColor ?? '#F2A900'),
    alarmColor: seriesColor(props.alarmColor ?? '#E5484D'),
    updateRateMs: Math.max(100, Math.min(60000, integer(props.updateRateMs, 1000))),
    simulateValues: flag(props.simulateValues, false),
    simulatedMinimum: clamp(props.simulatedMinimum, minimum),
    simulatedMaximum: clamp(props.simulatedMaximum, maximum),
  }
}

export const getForgeUIStandardChartLayout = (
  props: Record<string, unknown>,
): ForgeUIStandardChartLayout => {
  const chart = getForgeUIStandardChartModel(props)
  const width = Math.max(1, integer(props.w, 240))
  const height = Math.max(1, integer(props.h, 120))
  const mainBorderWidth = 2
  const labelGutter = Math.max(
    18,
    Math.min(42, Math.round(width * 0.16)),
  )
  const rightPadding = Math.min(
    8,
    Math.max(0, width - mainBorderWidth * 2 - labelGutter - 1),
  )
  const topPadding = Math.min(
    chart.title ? 26 : 10,
    Math.max(0, Math.floor((height - mainBorderWidth * 2 - 1) / 2)),
  )
  const bottomLabelGutter = Math.min(
    chart.xAxisLabel ? 34 : 24,
    Math.max(
      16,
      Math.round(height * 0.18),
    ),
  )
  const plotLeft = Math.min(
    mainBorderWidth + labelGutter,
    Math.max(0, width - 1),
  )
  const plotRight = Math.max(
    plotLeft + 1,
    width - mainBorderWidth - rightPadding,
  )
  const plotTop = Math.min(
    mainBorderWidth + topPadding,
    Math.max(0, height - 1),
  )
  const plotBottom = Math.max(
    plotTop + 1,
    height - mainBorderWidth - bottomLabelGutter,
  )
  const plotWidth = Math.max(1, plotRight - plotLeft)
  const plotHeight = Math.max(1, plotBottom - plotTop)
  const intervals = chart.horizontalDivisions + 1
  const range = chart.maximum - chart.minimum
  const yAxisLabels = Array.from(
    { length: intervals + 1 },
    (_, index) => ({
      value: Math.round(
        chart.maximum - range * index / intervals,
      ),
      y: plotTop + plotHeight * index / intervals,
    }),
  )
  const pointSpacing = chart.pointCount > 1
    ? plotWidth / (chart.pointCount - 1)
    : plotWidth
  const widestIndexCharacters = String(chart.pointCount - 1).length
  const minimumLabelSpacing = Math.max(
    14,
    widestIndexCharacters * 7 + 6,
  )
  const labelStride = Math.max(
    1,
    Math.ceil(minimumLabelSpacing / Math.max(1, pointSpacing)),
  )
  const xPointPositions = Array.from(
    { length: chart.pointCount },
    (_, index) => plotLeft + getForgeUIStandardChartPointOffsetX(
      index,
      chart.pointCount,
      plotWidth,
    ),
  )
  const operatorLabelCount = chart.xAxisMode === 'clock-time' ? 3 : 5
  const xAxisLabels: ForgeUIStandardChartXAxisLabel[] = chart.xAxisMode === 'hidden'
    ? []
    : chart.xAxisMode === 'samples'
      ? Array.from({ length: chart.pointCount }, (_, index) => ({
          value: String(index),
          x: xPointPositions[index],
          visible: index === 0 || index === chart.pointCount - 1 ||
            index % labelStride === 0,
        }))
      : Array.from({ length: operatorLabelCount }, (_, index) => {
          const fraction = index / (operatorLabelCount - 1)
          const secondsBeforeEnd = chart.historyWindowSeconds * (1 - fraction)
          return {
            value: chart.xAxisMode === 'clock-time'
              ? clockLabel(chart.historyEndTime, secondsBeforeEnd)
              : index === operatorLabelCount - 1
                ? 'Now'
                : `-${Math.round(secondsBeforeEnd)}s`,
            x: plotLeft + Math.trunc(plotWidth * fraction),
            visible: true,
          }
        })

  return {
    width,
    height,
    mainBorderWidth,
    labelGutter,
    rightPadding,
    topPadding,
    bottomLabelGutter,
    plotLeft,
    plotTop,
    plotRight,
    plotBottom,
    plotWidth,
    plotHeight,
    xPointPositions,
    yAxisLabels,
    xAxisLabels,
  }
}
