export const FORGEUI_ALARM_PANEL_SCHEMA_VERSION = 1
export const FORGEUI_ALARM_PANEL_MAX_CAPACITY = 32

export type ForgeUIAlarmState = 'normal' | 'warning' | 'alarm' | 'acknowledged' | 'cleared'
export type ForgeUIAlarmPriority = 'low' | 'medium' | 'high' | 'critical'
export type ForgeUIAlarmSortOrder = 'newest' | 'oldest' | 'priority'

export interface ForgeUIAlarmRecord {
  id: string
  message: string
  timestamp: string
  state: ForgeUIAlarmState
  priority: ForgeUIAlarmPriority
}

const number = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
}
const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '', limit = 96) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const state = (value: unknown): ForgeUIAlarmState =>
  value === 'normal' || value === 'warning' || value === 'acknowledged' || value === 'cleared'
    ? value : 'alarm'
const priority = (value: unknown): ForgeUIAlarmPriority =>
  value === 'low' || value === 'medium' || value === 'critical' ? value : 'high'

export const FORGEUI_ALARM_PANEL_DEFAULT_ALARMS: ForgeUIAlarmRecord[] = [
  { id: 'alarm-1', message: 'High discharge pressure', timestamp: '14:22:18', state: 'alarm', priority: 'critical' },
  { id: 'alarm-2', message: 'Motor temperature elevated', timestamp: '14:20:04', state: 'warning', priority: 'high' },
  { id: 'alarm-3', message: 'Filter service due', timestamp: '13:48:31', state: 'acknowledged', priority: 'medium' },
]

export const normalizeForgeUIAlarmPanel = (props: Record<string, unknown> = {}) => {
  const capacity = Math.max(1, Math.min(FORGEUI_ALARM_PANEL_MAX_CAPACITY, number(props.alarmCapacity, 16)))
  const maximumVisible = Math.max(1, Math.min(12, number(props.maximumVisibleAlarms, 5)))
  const configured = Array.isArray(props.alarms) ? props.alarms : FORGEUI_ALARM_PANEL_DEFAULT_ALARMS
  const alarms = configured.slice(0, capacity).map((entry, index) => {
    const raw = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {}
    return {
      id: text(raw.id, `alarm-${index + 1}`, 32) || `alarm-${index + 1}`,
      message: text(raw.message, `Alarm ${index + 1}`, 96) || `Alarm ${index + 1}`,
      timestamp: text(raw.timestamp, '', 24),
      state: state(raw.state),
      priority: priority(raw.priority),
    }
  })
  const sortOrder: ForgeUIAlarmSortOrder = props.sortOrder === 'oldest' || props.sortOrder === 'priority'
    ? props.sortOrder : 'newest'
  return {
    schemaVersion: FORGEUI_ALARM_PANEL_SCHEMA_VERSION as 1,
    title: text(props.title, 'Active Alarms', 64) || 'Active Alarms',
    maximumVisible,
    alarmCapacity: capacity,
    alarms,
    showTimestamp: flag(props.showTimestamp, true),
    showAcknowledgement: flag(props.showAcknowledgement, true),
    showPriority: flag(props.showPriority, true),
    showHeader: flag(props.showHeader, true),
    showFooter: flag(props.showFooter, true),
    footerText: text(props.footerText, 'Select an alarm to acknowledge', 96),
    compactMode: flag(props.compactMode, false),
    sortOrder,
    autoScroll: flag(props.autoScroll, true),
    autoClear: flag(props.autoClear, false),
    flashActiveAlarms: flag(props.flashActiveAlarms, false),
    animateTransitions: flag(props.animateTransitions, false),
    rowSpacing: Math.max(0, Math.min(16, number(props.rowSpacing, 4))),
    normalColour: colour(props.normalColour, '#22C55E'),
    warningColour: colour(props.warningColour, '#F2A900'),
    alarmColour: colour(props.alarmColour, '#E5484D'),
    acknowledgedColour: colour(props.acknowledgedColour, '#64748B'),
    clearedColour: colour(props.clearedColour, '#475569'),
    generateRuntimeApi: flag(props.generateRuntimeApi, true),
    enableUserEvents: flag(props.enableUserEvents, true),
  }
}

export type ForgeUIAlarmPanelModel = ReturnType<typeof normalizeForgeUIAlarmPanel>
