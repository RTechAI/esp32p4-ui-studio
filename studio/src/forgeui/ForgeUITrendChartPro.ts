export const FORGEUI_TREND_CHART_PRO_DEFAULT_DATA =
  [3420, 3510, 3480, 3620, 3710, 3690, 3820, 3880, 3850, 3962]

const number = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const integer = (value: unknown, fallback: number) => Math.trunc(number(value, fallback))
const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 48) =>
  typeof value === 'string' ? value.slice(0, limit) : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized}` : fallback
}

export const normalizeForgeUITrendChartPro = (props: Record<string, unknown> = {}) => {
  const historyLength = Math.max(5, Math.min(120, integer(props.historyLength, 30)))
  const configured = Array.isArray(props.initialData) ? props.initialData : FORGEUI_TREND_CHART_PRO_DEFAULT_DATA
  const data = configured.slice(-historyLength).map(value => number(value, 0))
  const current = number(props.value, data[data.length - 1] ?? 0)
  if (data.length === 0) data.push(current)
  const fixedA = number(props.fixedMin, 0)
  const fixedB = number(props.fixedMax, 5000)
  const fixedMin = Math.min(fixedA, fixedB)
  const fixedMax = Math.max(fixedA, fixedB) === fixedMin
    ? fixedMin + 1
    : Math.max(fixedA, fixedB)
  const warning = number(props.warning, 4200)
  const alarm = number(props.alarm, 4700)
  const autoScale = flag(props.autoScale, true)
  const values = [...data, current, warning, alarm]
  const dataMin = Math.min(...values)
  const dataMax = Math.max(...values)
  const margin = Math.max(1, (dataMax - dataMin) * 0.12)
  const minimum = autoScale ? dataMin - margin : fixedMin
  const maximum = autoScale ? dataMax + margin : fixedMax
  const decimals = Math.max(0, Math.min(4, integer(props.decimalPlaces, 0)))
  const unitChoice = text(props.units, 'RPM', 16)
  const units = unitChoice === 'Custom' ? text(props.customUnits, '', 12) : unitChoice
  return {
    title: text(props.title, 'Engine RPM'), value: current, formattedValue: current.toFixed(decimals),
    units, unitChoice, customUnits: text(props.customUnits, '', 12), decimalPlaces: decimals,
    historyLength, data, updateRateMs: Math.max(100, Math.min(60000, integer(props.updateRateMs, 1000))),
    autoScale, fixedMin, fixedMax, minimum, maximum, warning, alarm,
    traceColour: colour(props.traceColour, ''), warningColour: colour(props.warningColour, '#F2A900'),
    alarmColour: colour(props.alarmColour, '#E5484D'), showGrid: flag(props.showGrid, true),
    showAreaFill: flag(props.showAreaFill, true), showGlow: flag(props.showGlow, true),
    showCurrentMarker: flag(props.showCurrentMarker, true), showThresholdBands: flag(props.showThresholdBands, true),
    compactMode: flag(props.compactMode, false), generateRuntimeApi: flag(props.generateRuntimeApi, true),
    enableUserEvents: flag(props.enableUserEvents, true),
  }
}

export type ForgeUITrendChartProModel = ReturnType<typeof normalizeForgeUITrendChartPro>
