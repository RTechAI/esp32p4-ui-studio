export const FORGEUI_IO_MONITOR_SCHEMA_VERSION = 1
export const FORGEUI_IO_CHANNEL_COUNTS = [4, 8, 16, 24, 32] as const
export type ForgeUIIOState = 'off' | 'on' | 'active' | 'inactive' | 'fault' | 'disabled' | 'unknown'
export type ForgeUIIOChannelType = 'digital-input' | 'digital-output' | 'relay' | 'sensor' | 'limit-switch' | 'door' | 'pump' | 'valve' | 'motor' | 'fan' | 'solenoid' | 'alarm' | 'fault' | 'generic'
export type ForgeUIIODisplayMode = 'compact-grid' | 'detailed-grid' | 'list'
export type ForgeUIIOChannel = { id: string; label: string; type: ForgeUIIOChannelType; state: ForgeUIIOState; description: string; group: string; timestamp: string; value: string; visible: boolean; readOnly: boolean }

const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '', maximum = 64) => (typeof value === 'string' ? value.trim() : fallback).slice(0, maximum)
const member = <T extends string>(value: unknown, values: readonly T[], fallback: T) => values.includes(value as T) ? value as T : fallback

export const normalizeForgeUIIOMonitor = (props: Record<string, unknown> = {}) => {
  const requested = Number(props.channelCount) || 8
  const channelCount = FORGEUI_IO_CHANNEL_COUNTS.reduce((best, item) => Math.abs(item - requested) < Math.abs(best - requested) ? item : best, 8)
  const types: ForgeUIIOChannelType[] = ['digital-input','digital-output','relay','sensor','limit-switch','door','pump','valve','motor','fan','solenoid','alarm','fault','generic']
  const states: ForgeUIIOState[] = ['off','on','active','inactive','fault','disabled','unknown']
  const rawChannels = Array.isArray(props.channels) ? props.channels : []
  const channels = Array.from({ length: channelCount }, (_, index) => {
    const raw: any = rawChannels[index] || {}
    return { id: text(raw.id, `IO_${index + 1}`, 32), label: text(raw.label, `Channel ${index + 1}`, 48), type: member(raw.type, types, index % 2 ? 'digital-output' : 'digital-input'), state: member(raw.state, states, 'off'), description: text(raw.description, '', 96), group: text(raw.group, '', 32), timestamp: text(raw.timestamp, '', 24), value: text(raw.value, '', 24), visible: bool(raw.visible, true), readOnly: bool(raw.readOnly, index % 2 === 0) }
  }) as ForgeUIIOChannel[]
  return {
    schemaVersion: FORGEUI_IO_MONITOR_SCHEMA_VERSION as 1,
    title: text(props.title, 'Main I/O', 64) || 'Main I/O',
    displayMode: member(props.displayMode, ['compact-grid','detailed-grid','list'] as const, 'detailed-grid'), channelCount, channels,
    indicatorSize: Math.max(6, Math.min(32, Math.round(Number(props.indicatorSize) || 12))),
    showLabels: bool(props.showLabels, true), showStateText: bool(props.showStateText, true), showValues: bool(props.showValues, true), showTimestamps: bool(props.showTimestamps, false),
    rounded: bool(props.rounded, true), shadow: bool(props.shadow, true), glassStyle: bool(props.glassStyle, false),
    includeInputs: bool(props.includeInputs, true), includeOutputs: bool(props.includeOutputs, true), includeFaults: bool(props.includeFaults, true), includeDisabled: bool(props.includeDisabled, true),
    simulationMode: member(props.simulationMode, ['idle','random-inputs','relay-activity','machine-running','fault-state','startup-sequence'] as const, 'machine-running'),
    offColour: text(props.offColour, '#64748B', 7), onColour: text(props.onColour, '#22C55E', 7), activeColour: text(props.activeColour, '#06B6D4', 7), inactiveColour: text(props.inactiveColour, '#64748B', 7), faultColour: text(props.faultColour, '#EF4444', 7), disabledColour: text(props.disabledColour, '#475569', 7), unknownColour: text(props.unknownColour, '#A78BFA', 7),
    generateRuntimeApi: bool(props.generateRuntimeApi, true), enableUserEvents: bool(props.enableUserEvents, true),
  }
}

export type ForgeUIIOMonitorModel = ReturnType<typeof normalizeForgeUIIOMonitor>

export const simulateForgeUIIOChannels = (model: ForgeUIIOMonitorModel): ForgeUIIOChannel[] => model.channels.map((channel, index) => {
  let state: ForgeUIIOState = 'off'
  if (model.simulationMode === 'random-inputs') state = ((index * 17 + 3) % 5) < 2 ? 'on' : 'off'
  if (model.simulationMode === 'relay-activity') state = channel.type === 'digital-output' || channel.type === 'relay' ? (index % 3 ? 'on' : 'off') : 'inactive'
  if (model.simulationMode === 'machine-running') state = index === model.channelCount - 1 ? 'inactive' : index % 3 === 0 ? 'active' : 'on'
  if (model.simulationMode === 'fault-state') state = index === 2 ? 'fault' : index % 2 ? 'on' : 'off'
  if (model.simulationMode === 'startup-sequence') state = index < Math.ceil(model.channelCount / 2) ? 'active' : 'inactive'
  return { ...channel, state, timestamp: `14:32:${String(index * 3).padStart(2, '0')}` }
})
