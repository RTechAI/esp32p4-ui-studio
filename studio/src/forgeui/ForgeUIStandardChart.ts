export const FORGEUI_STANDARD_CHART_DEFAULT_DATA =
  [10, 30, 20, 50, 40, 70, 60]

export interface ForgeUIStandardChartPoint {
  index: number
  value: number | null
  x: number
  y: number | null
}

export interface ForgeUIStandardChartModel {
  minimum: number
  maximum: number
  pointCount: number
  data: Array<number | null>
  points: ForgeUIStandardChartPoint[]
  seriesColor: string
  horizontalDivisions: number
  verticalDivisions: number
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

export const getForgeUIStandardChartModel = (
  props: Record<string, unknown>,
): ForgeUIStandardChartModel => {
  const firstRangeValue = integer(props.yMin ?? props.min, 0)
  const secondRangeValue = integer(props.yMax ?? props.max, 100)
  const minimum = Math.min(firstRangeValue, secondRangeValue)
  const maximum = Math.max(firstRangeValue, secondRangeValue)
  const pointCount = Math.max(1, integer(props.pointCount, 7))
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
  const denominator = Math.max(1, pointCount - 1)
  const range = maximum - minimum
  const points = data.map((value, index) => ({
    index,
    value,
    x: index / denominator,
    y: value === null
      ? null
      : range === 0
        ? 1
        : 1 - (value - minimum) / range,
  }))

  return {
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
    verticalDivisions: Math.max(
      0,
      integer(props.verticalDivisions ?? props.vdiv, 5),
    ),
  }
}
