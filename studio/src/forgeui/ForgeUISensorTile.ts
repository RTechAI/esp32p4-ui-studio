export const FORGEUI_SENSOR_TILE_SCHEMA_VERSION = 1

export type ForgeUISensorType = 'temperature' | 'pressure' | 'humidity' |
  'voltage' | 'current' | 'power' | 'energy' | 'rpm' | 'frequency' | 'generic'
export type ForgeUISensorStatus = 'normal' | 'warning' | 'critical' | 'offline'
export type ForgeUISensorTrend = 'rising' | 'falling' | 'stable'

const sensorDefaults: Record<ForgeUISensorType, { title: string; units: string; icon: string; value: number }> = {
  temperature: { title: 'Temperature', units: '°C', icon: 'LV_SYMBOL_CHARGE', value: 23.7 },
  pressure: { title: 'Pressure', units: 'bar', icon: 'LV_SYMBOL_UPLOAD', value: 1.42 },
  humidity: { title: 'Humidity', units: '%', icon: 'LV_SYMBOL_TINT', value: 68 },
  voltage: { title: 'Voltage', units: 'V', icon: 'LV_SYMBOL_BATTERY_FULL', value: 48.1 },
  current: { title: 'Current', units: 'A', icon: 'LV_SYMBOL_CHARGE', value: 12.8 },
  power: { title: 'Power', units: 'kW', icon: 'LV_SYMBOL_CHARGE', value: 2.4 },
  energy: { title: 'Energy', units: 'kWh', icon: 'LV_SYMBOL_CHARGE', value: 18.6 },
  rpm: { title: 'Speed', units: 'RPM', icon: 'LV_SYMBOL_REFRESH', value: 1450 },
  frequency: { title: 'Frequency', units: 'Hz', icon: 'LV_SYMBOL_AUDIO', value: 50 },
  generic: { title: 'Sensor', units: '', icon: 'LV_SYMBOL_BULLET', value: 0 },
}

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const string = (value: unknown, fallback: string) => typeof value === 'string' ? value : fallback

export type ForgeUISensorTileModel = ReturnType<typeof normalizeForgeUISensorTile>

export const normalizeForgeUISensorTile = (props: Record<string, unknown> = {}) => {
  const sensorType = (Object.keys(sensorDefaults).includes(String(props.sensorType))
    ? props.sensorType : 'temperature') as ForgeUISensorType
  const defaults = sensorDefaults[sensorType]
  const rangeMin = numeric(props.rangeMin, 0)
  const rangeMax = Math.max(rangeMin + 0.0001, numeric(props.rangeMax, 100))
  const value = numeric(props.value, defaults.value)
  const warningLow = numeric(props.warningLow, rangeMin + (rangeMax - rangeMin) * 0.2)
  const warningHigh = numeric(props.warningHigh, rangeMin + (rangeMax - rangeMin) * 0.8)
  const criticalLow = numeric(props.criticalLow, rangeMin + (rangeMax - rangeMin) * 0.1)
  const criticalHigh = numeric(props.criticalHigh, rangeMin + (rangeMax - rangeMin) * 0.9)
  const explicitStatus = ['normal', 'warning', 'critical', 'offline'].includes(String(props.status))
    ? props.status as ForgeUISensorStatus : 'normal'
  const autoColour = bool(props.autoColour, true)
  const status: ForgeUISensorStatus = !autoColour || explicitStatus === 'offline'
    ? explicitStatus
    : value <= criticalLow || value >= criticalHigh ? 'critical'
      : value <= warningLow || value >= warningHigh ? 'warning' : 'normal'
  return {
    schemaVersion: FORGEUI_SENSOR_TILE_SCHEMA_VERSION as 1,
    sensorType,
    title: string(props.title, defaults.title),
    icon: string(props.icon, defaults.icon),
    value,
    decimals: Math.max(0, Math.min(4, Math.round(numeric(props.decimals, sensorType === 'rpm' ? 0 : 1)))),
    units: string(props.units, defaults.units),
    status,
    statusText: string(props.statusText, status.charAt(0).toUpperCase() + status.slice(1)),
    trend: (['rising', 'falling', 'stable'].includes(String(props.trend)) ? props.trend : 'stable') as ForgeUISensorTrend,
    timestamp: string(props.timestamp, 'Updated now'),
    accentColor: /^#[0-9a-fA-F]{6}$/.test(String(props.accentColor || '')) ? String(props.accentColor) : '',
    showTrend: bool(props.showTrend, true),
    showProgress: bool(props.showProgress, true),
    showTimestamp: bool(props.showTimestamp, true),
    padding: Math.max(0, Math.min(48, numeric(props.padding, 16))),
    rangeMin, rangeMax, warningLow, warningHigh, criticalLow, criticalHigh,
    autoColour,
    enableClick: bool(props.enableClick, true),
    progress: Math.max(0, Math.min(100, ((value - rangeMin) / (rangeMax - rangeMin)) * 100)),
  }
}

export const getForgeUISensorTrendLabel = (trend: ForgeUISensorTrend) =>
  trend === 'rising' ? '▲ Rising' : trend === 'falling' ? '▼ Falling' : '▬ Stable'
