export const FORGEUI_ALARM_PANEL_SCHEMA_VERSION = 1
export const FORGEUI_ALARM_CAPACITIES = [16, 32, 64] as const
export type ForgeUIAlarmSeverity = 'information' | 'notice' | 'warning' | 'alarm' | 'critical'
export type ForgeUIAlarmDisplayMode = 'compact' | 'list' | 'banner'
export type ForgeUIAlarmOrdering = 'newest-first' | 'oldest-first' | 'severity-first' | 'timestamp-first'

export type ForgeUIAlarmRecord = {
  id: string; title: string; description: string; severity: ForgeUIAlarmSeverity
  active: boolean; acknowledged: boolean; timestamp: string; source: string; category: string
}

const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '', maximum = 64) =>
  (typeof value === 'string' ? value.trim() : fallback).slice(0, maximum)
const enumValue = <T extends string>(value: unknown, values: readonly T[], fallback: T) =>
  values.includes(value as T) ? value as T : fallback

export const normalizeForgeUIAlarmPanel = (props: Record<string, unknown> = {}) => {
  const requested = Number(props.maximumAlarms) || 16
  const maximumAlarms = FORGEUI_ALARM_CAPACITIES.reduce((best, item) =>
    Math.abs(item - requested) < Math.abs(best - requested) ? item : best, 16)
  const severities: ForgeUIAlarmSeverity[] = ['information', 'notice', 'warning', 'alarm', 'critical']
  const alarms = (Array.isArray(props.alarms) ? props.alarms : []).map((raw: any, index) => ({
    id: text(raw?.id, `ALARM_${index + 1}`, 32),
    title: text(raw?.title, 'System alarm', 64),
    description: text(raw?.description, '', 128),
    severity: enumValue(raw?.severity, severities, 'warning'),
    active: bool(raw?.active, true), acknowledged: bool(raw?.acknowledged, false),
    timestamp: text(raw?.timestamp, '--:--:--', 24), source: text(raw?.source, '', 32),
    category: text(raw?.category, '', 32),
  })).slice(0, maximumAlarms) as ForgeUIAlarmRecord[]
  return {
    schemaVersion: FORGEUI_ALARM_PANEL_SCHEMA_VERSION as 1,
    title: text(props.title, 'Active Alarms', 64) || 'Active Alarms',
    displayMode: enumValue(props.displayMode, ['compact', 'list', 'banner'] as const, 'list'),
    maximumAlarms, ordering: enumValue(props.ordering, ['newest-first', 'oldest-first', 'severity-first', 'timestamp-first'] as const, 'newest-first'),
    autoScroll: bool(props.autoScroll, true), showTimestamps: bool(props.showTimestamps, true),
    showSeverityIcons: bool(props.showSeverityIcons, true), showDescriptions: bool(props.showDescriptions, true),
    showAcknowledgement: bool(props.showAcknowledgement, true), rounded: bool(props.rounded, true),
    shadow: bool(props.shadow, true), glassStyle: bool(props.glassStyle, false),
    includeInformation: bool(props.includeInformation, true), includeNotice: bool(props.includeNotice, true),
    includeWarning: bool(props.includeWarning, true), includeAlarm: bool(props.includeAlarm, true),
    includeCritical: bool(props.includeCritical, true), simulationMode: enumValue(props.simulationMode, ['normal', 'warning', 'critical', 'multiple', 'alarm-storm', 'cleared'] as const, 'multiple'),
    informationColour: text(props.informationColour, '#3B82F6', 7), noticeColour: text(props.noticeColour, '#06B6D4', 7),
    warningColour: text(props.warningColour, '#F59E0B', 7), alarmColour: text(props.alarmColour, '#E97316', 7),
    criticalColour: text(props.criticalColour, '#EF4444', 7), alarms,
    generateRuntimeApi: bool(props.generateRuntimeApi, true), enableUserEvents: bool(props.enableUserEvents, true),
  }
}

export type ForgeUIAlarmPanelModel = ReturnType<typeof normalizeForgeUIAlarmPanel>

export const createForgeUIAlarmSimulation = (mode: string): ForgeUIAlarmRecord[] => {
  const base = [
    { id: 'ENGINE_TEMP', title: 'Engine Temperature High', description: 'Coolant temperature exceeds configured range', severity: 'critical', timestamp: '14:32:18' },
    { id: 'DC_BUS_LOW', title: 'DC Bus Voltage Low', description: 'Input voltage below warning threshold', severity: 'warning', timestamp: '14:31:42' },
    { id: 'NETWORK', title: 'Telemetry Link Restored', description: 'Remote telemetry connection available', severity: 'notice', timestamp: '14:29:03' },
  ].map(item => ({ ...item, severity: item.severity as ForgeUIAlarmSeverity, active: true, acknowledged: false, source: 'System', category: 'Telemetry' }))
  if (mode === 'normal') return []
  if (mode === 'warning') return [base[1]]
  if (mode === 'critical') return [base[0]]
  if (mode === 'cleared') return [{ ...base[1], active: false, acknowledged: true }]
  if (mode === 'alarm-storm') return Array.from({ length: 12 }, (_, i) => ({ ...base[i % 3], id: `ALARM_${i + 1}`, timestamp: `14:3${i % 10}:${String(i * 4).padStart(2, '0')}` }))
  return base
}
