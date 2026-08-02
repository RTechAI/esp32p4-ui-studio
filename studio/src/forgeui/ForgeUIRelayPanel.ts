export const FORGEUI_RELAY_PANEL_SCHEMA_VERSION = 1

export type ForgeUIRelayLayoutMode = 'standard' | 'compact'
export type ForgeUIRelayConfirmationMode = 'disabled' | 'confirm-off' | 'confirm-all'

export type ForgeUIRelayChannel = {
  id: string
  label: string
  state: boolean
  enabled: boolean
  statusText: string
}

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const bool = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value.trim() : fallback
const colour = (value: unknown, fallback: string) =>
  /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? String(value).toUpperCase() : fallback

const defaultChannel = (index: number): ForgeUIRelayChannel => ({
  id: `relay-${index + 1}`,
  label: `Relay ${index + 1}`,
  state: false,
  enabled: true,
  statusText: '',
})

export const normalizeForgeUIRelayPanel = (props: Record<string, unknown> = {}) => {
  const channelCount = Math.max(1, Math.min(8, Math.round(numeric(props.channelCount, 4))))
  const input = Array.isArray(props.channels) ? props.channels : []
  const usedIds = new Set<string>()
  const channels = Array.from({ length: channelCount }, (_, index) => {
    const raw = input[index] && typeof input[index] === 'object'
      ? input[index] as Record<string, unknown> : {}
    const fallback = defaultChannel(index)
    let id = text(raw.id, fallback.id).replace(/[^A-Za-z0-9_-]/g, '-') || fallback.id
    const base = id
    let suffix = 2
    while (usedIds.has(id)) id = `${base}-${suffix++}`
    usedIds.add(id)
    return {
      id,
      label: text(raw.label, fallback.label).slice(0, 48) || fallback.label,
      state: bool(raw.state, fallback.state),
      enabled: bool(raw.enabled, fallback.enabled),
      statusText: text(raw.statusText, '').slice(0, 48),
    }
  })
  const confirmationMode = (['disabled', 'confirm-off', 'confirm-all'].includes(String(props.confirmationMode))
    ? props.confirmationMode : 'disabled') as ForgeUIRelayConfirmationMode
  const layoutMode = (['standard', 'compact'].includes(String(props.layoutMode))
    ? props.layoutMode : 'standard') as ForgeUIRelayLayoutMode
  return {
    schemaVersion: FORGEUI_RELAY_PANEL_SCHEMA_VERSION as 1,
    title: text(props.title, 'Main Relays').slice(0, 64),
    subtitle: text(props.subtitle, 'Digital output control').slice(0, 96),
    icon: /^LV_SYMBOL_[A-Z0-9_]+$/.test(String(props.icon || '')) ? String(props.icon) : 'LV_SYMBOL_POWER',
    channelCount,
    channels,
    showMasterControl: bool(props.showMasterControl, true),
    masterState: bool(props.masterState, channels.filter(channel => channel.enabled).every(channel => channel.state)),
    confirmationMode,
    showChannelNumbers: bool(props.showChannelNumbers, true),
    layoutMode,
    activeColour: colour(props.activeColour, '#22C55E'),
    inactiveColour: colour(props.inactiveColour, '#475569'),
    disabledColour: colour(props.disabledColour, '#64748B'),
    showFooter: bool(props.showFooter, true),
    footerText: text(props.footerText, 'Ready').slice(0, 96),
    padding: Math.max(0, Math.min(32, Math.round(numeric(props.padding, 14)))),
    gap: Math.max(0, Math.min(24, Math.round(numeric(props.gap, 8)))),
    generateRuntimeApi: bool(props.generateRuntimeApi, true),
    enableUserEvents: bool(props.enableUserEvents, true),
  }
}

export type ForgeUIRelayPanelModel = ReturnType<typeof normalizeForgeUIRelayPanel>

export const serializeForgeUIRelayPanel = (model: ForgeUIRelayPanelModel) => ({
  nativeWidgetSchemaVersion: model.schemaVersion,
  title: model.title,
  subtitle: model.subtitle,
  icon: model.icon,
  channelCount: model.channelCount,
  channels: model.channels.map(channel => ({ ...channel })),
  showMasterControl: model.showMasterControl,
  masterState: model.masterState,
  confirmationMode: model.confirmationMode,
  showChannelNumbers: model.showChannelNumbers,
  layoutMode: model.layoutMode,
  activeColour: model.activeColour,
  inactiveColour: model.inactiveColour,
  disabledColour: model.disabledColour,
  showFooter: model.showFooter,
  footerText: model.footerText,
  padding: model.padding,
  gap: model.gap,
  generateRuntimeApi: model.generateRuntimeApi,
  enableUserEvents: model.enableUserEvents,
})
