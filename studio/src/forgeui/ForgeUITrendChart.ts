export const FORGEUI_TREND_CHART_SCHEMA_VERSION = 1

export const FORGEUI_TREND_HISTORY_LENGTHS = [32, 64, 128, 256] as const
export type ForgeUITrendHistoryLength = typeof FORGEUI_TREND_HISTORY_LENGTHS[number]
export type ForgeUITrendSimulationMode =
  | 'sine'
  | 'sawtooth'
  | 'random-walk'
  | 'battery-discharge'
  | 'temperature-drift'
  | 'rpm'

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const bool = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback
const colour = (value: unknown) =>
  /^#[0-9a-fA-F]{6}$/.test(String(value || ''))
    ? String(value).toUpperCase()
    : ''

export const normalizeForgeUITrendChart = (
  props: Record<string, unknown> = {},
) => {
  let minimum = numeric(props.minimum, 0)
  let maximum = numeric(props.maximum, 100)
  if (maximum <= minimum) maximum = minimum + 100
  const warning = Math.max(
    minimum,
    Math.min(
      maximum,
      numeric(props.warningThreshold, minimum + (maximum - minimum) * 0.75),
    ),
  )
  const alarm = Math.max(
    warning,
    Math.min(
      maximum,
      numeric(props.alarmThreshold, minimum + (maximum - minimum) * 0.9),
    ),
  )
  const requestedLength = Math.round(numeric(props.historyLength, 64))
  const historyLength = FORGEUI_TREND_HISTORY_LENGTHS.reduce(
    (nearest, length) =>
      Math.abs(length - requestedLength) < Math.abs(nearest - requestedLength)
        ? length
        : nearest,
    64,
  ) as ForgeUITrendHistoryLength
  const simulationModes: ForgeUITrendSimulationMode[] = [
    'sine',
    'sawtooth',
    'random-walk',
    'battery-discharge',
    'temperature-drift',
    'rpm',
  ]
  const simulationMode = simulationModes.includes(
    props.simulationMode as ForgeUITrendSimulationMode,
  )
    ? (props.simulationMode as ForgeUITrendSimulationMode)
    : 'sine'
  const rawHistory = Array.isArray(props.history)
    ? props.history.map(value => Number(value)).filter(Number.isFinite)
    : []

  return {
    schemaVersion: FORGEUI_TREND_CHART_SCHEMA_VERSION as 1,
    title: text(props.title, 'Trend').slice(0, 64) || 'Trend',
    units: text(props.units, '').slice(0, 16),
    semanticType: text(props.semanticType, 'generic').slice(0, 32) || 'generic',
    currentValue: Math.max(
      minimum,
      Math.min(maximum, numeric(props.currentValue, 50)),
    ),
    minimum,
    maximum,
    warningThreshold: warning,
    alarmThreshold: alarm,
    historyLength,
    history: rawHistory.slice(-historyLength),
    lineColour: colour(props.lineColour),
    fill: bool(props.fill, false),
    showGrid: bool(props.showGrid, true),
    showAxes: bool(props.showAxes, true),
    showLegend: bool(props.showLegend, false),
    showLatestMarker: bool(props.showLatestMarker, true),
    showCurrentValue: bool(props.showCurrentValue, true),
    showMinMax: bool(props.showMinMax, true),
    autoScale: bool(props.autoScale, false),
    rounded: bool(props.rounded, true),
    border: bool(props.border, true),
    backgroundColour: colour(props.backgroundColour),
    padding: Math.max(0, Math.min(32, Math.round(numeric(props.padding, 12)))),
    simulationMode,
    generateRuntimeApi: bool(props.generateRuntimeApi, true),
    enableUserEvents: bool(props.enableUserEvents, true),
  }
}

export type ForgeUITrendChartModel = ReturnType<
  typeof normalizeForgeUITrendChart
>

export const createForgeUITrendSimulation = (
  model: ForgeUITrendChartModel,
  count = 32,
) => {
  const span = model.maximum - model.minimum
  let walk = model.minimum + span * 0.48
  return Array.from({ length: Math.max(2, count) }, (_, index) => {
    const t = index / Math.max(1, count - 1)
    let value: number
    switch (model.simulationMode) {
      case 'sawtooth':
        value = model.minimum + span * ((index % 12) / 11)
        break
      case 'battery-discharge':
        value = model.maximum - span * (0.12 + t * 0.68)
        break
      case 'temperature-drift':
        value =
          model.minimum +
          span * (0.48 + t * 0.08 + Math.sin(index * 0.45) * 0.035)
        break
      case 'rpm':
        value =
          model.minimum +
          span *
            (0.42 +
              Math.sin(index * 0.42) * 0.23 +
              Math.sin(index * 0.11) * 0.08)
        break
      case 'random-walk':
        walk += (((index * 9301 + 49297) % 233280) / 233280 - 0.5) * span * 0.12
        value = walk
        break
      default:
        value = model.minimum + span * (0.5 + Math.sin(index * 0.36) * 0.28)
    }
    return Math.max(model.minimum, Math.min(model.maximum, value))
  })
}
