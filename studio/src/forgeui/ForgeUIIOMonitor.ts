export const FORGEUI_IO_MONITOR_SCHEMA_VERSION = 1
export const FORGEUI_IO_MONITOR_MAX_ROWS = 32

export type ForgeUIIOType = 'digital-input' | 'digital-output' | 'analog-input' | 'analog-output'

export interface ForgeUIIORow {
  id: string
  ioType: ForgeUIIOType
  channel: string
  displayName: string
  value: number
  state: boolean
  units: string
  colour: string
  showValue: boolean
  showState: boolean
  visible: boolean
}

const number = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const integer = (value: unknown, fallback: number) => Math.trunc(number(value, fallback))
const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '', limit = 64) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const ioType = (value: unknown): ForgeUIIOType =>
  value === 'digital-output' || value === 'analog-input' || value === 'analog-output'
    ? value : 'digital-input'

export const FORGEUI_IO_MONITOR_DEFAULT_ROWS: ForgeUIIORow[] = [
  { id: 'io-1', ioType: 'digital-input', channel: 'DI1', displayName: 'Emergency Stop', value: 0, state: false, units: '', colour: '#22C55E', showValue: false, showState: true, visible: true },
  { id: 'io-2', ioType: 'digital-output', channel: 'DO1', displayName: 'Pump', value: 1, state: true, units: '', colour: '#38BDF8', showValue: false, showState: true, visible: true },
  { id: 'io-3', ioType: 'analog-input', channel: 'AI1', displayName: 'Pressure', value: 4.62, state: true, units: 'bar', colour: '#F2A900', showValue: true, showState: true, visible: true },
  { id: 'io-4', ioType: 'analog-output', channel: 'AO1', displayName: 'Valve Demand', value: 68, state: true, units: '%', colour: '#A78BFA', showValue: true, showState: true, visible: true },
]

export const normalizeForgeUIIOMonitor = (props: Record<string, unknown> = {}) => {
  const maximumRows = Math.max(1, Math.min(FORGEUI_IO_MONITOR_MAX_ROWS, integer(props.maximumRows, 8)))
  const configured = Array.isArray(props.rows) ? props.rows : FORGEUI_IO_MONITOR_DEFAULT_ROWS
  const rows = configured.slice(0, maximumRows).map((entry, index) => {
    const raw = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {}
    const type = ioType(raw.ioType)
    const digital = type === 'digital-input' || type === 'digital-output'
    return {
      id: text(raw.id, `io-${index + 1}`, 32) || `io-${index + 1}`,
      ioType: type,
      channel: text(raw.channel, `${digital ? 'DI' : 'AI'}${index + 1}`, 24) || `${digital ? 'DI' : 'AI'}${index + 1}`,
      displayName: text(raw.displayName, `I/O ${index + 1}`, 64) || `I/O ${index + 1}`,
      value: number(raw.value, digital ? 0 : 0),
      state: flag(raw.state, false),
      units: text(raw.units, '', 16),
      colour: colour(raw.colour, '#38BDF8'),
      showValue: flag(raw.showValue, !digital),
      showState: flag(raw.showState, true),
      visible: flag(raw.visible, true),
    }
  })
  return {
    schemaVersion: FORGEUI_IO_MONITOR_SCHEMA_VERSION as 1,
    title: text(props.title, 'IO Monitor', 64) || 'IO Monitor',
    maximumRows,
    compactMode: flag(props.compactMode, false),
    rows,
    generateRuntimeApi: flag(props.generateRuntimeApi, true),
    enableUserEvents: flag(props.enableUserEvents, true),
  }
}

export type ForgeUIIOMonitorModel = ReturnType<typeof normalizeForgeUIIOMonitor>
