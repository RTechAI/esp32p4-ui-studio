export const FORGEUI_DEVICE_SUMMARY_CARD_SCHEMA_VERSION = 1
export const FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE = { width: 240, height: 145 } as const
export const FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE = { width: 220, height: 128 } as const
export type ForgeUIDeviceSummaryStatus = 'offline' | 'online' | 'warning' | 'error'

const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 64) => typeof value === 'string' ? value.trim().slice(0, limit) || fallback : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const status = (value: unknown): ForgeUIDeviceSummaryStatus => value === 'offline' || value === 'warning' || value === 'error' ? value : 'online'

export const normalizeForgeUIDeviceSummaryCard = (props: Record<string, unknown> = {}) => ({
  schemaVersion: FORGEUI_DEVICE_SUMMARY_CARD_SCHEMA_VERSION as 1,
  title: text(props.title, 'Device Summary'),
  deviceName: text(props.deviceName, 'ForgeUI-P4'),
  overallStatus: status(props.overallStatus),
  uptime: text(props.uptime, '02:14:36', 32),
  firmwareVersion: text(props.firmwareVersion, 'v3.5.4', 48),
  networkStatus: text(props.networkStatus, 'Connected', 48),
  storageStatus: text(props.storageStatus, 'Ready', 48),
  onlineColour: colour(props.onlineColour, '#22C55E'),
  warningColour: colour(props.warningColour, '#F2A900'),
  errorColour: colour(props.errorColour, '#E5484D'),
  offlineColour: colour(props.offlineColour, '#6B7280'),
  generateRuntimeApi: flag(props.generateRuntimeApi, true),
})

export type ForgeUIDeviceSummaryCardModel = ReturnType<typeof normalizeForgeUIDeviceSummaryCard>
