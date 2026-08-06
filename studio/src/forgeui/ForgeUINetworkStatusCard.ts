export const FORGEUI_NETWORK_STATUS_CARD_SCHEMA_VERSION = 1
export type ForgeUINetworkType = 'wifi' | 'ethernet' | 'cellular' | 'other'

const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 64) => typeof value === 'string' ? value.trim().slice(0, limit) || fallback : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const networkType = (value: unknown): ForgeUINetworkType => value === 'ethernet' || value === 'cellular' || value === 'other' ? value : 'wifi'

export const normalizeForgeUINetworkStatusCard = (props: Record<string, unknown> = {}) => ({
  schemaVersion: FORGEUI_NETWORK_STATUS_CARD_SCHEMA_VERSION as 1,
  title: text(props.title, 'Network Status'),
  networkType: networkType(props.networkType),
  connected: flag(props.connected, true),
  networkName: text(props.networkName, 'ForgeUI-Lab', 64),
  ipAddress: text(props.ipAddress, '192.168.1.42', 45),
  signalStrength: Math.max(0, Math.min(100, Number.isFinite(Number(props.signalStrength)) ? Number(props.signalStrength) : 78)),
  hostname: text(props.hostname, 'forgeui-p4', 64),
  statusText: text(props.statusText, 'Online', 96),
  accentColour: colour(props.accentColour, '#22C55E'),
  disconnectedColour: colour(props.disconnectedColour, '#E5484D'),
  compactMode: flag(props.compactMode, false),
  generateRuntimeApi: flag(props.generateRuntimeApi, true),
})

export type ForgeUINetworkStatusCardModel = ReturnType<typeof normalizeForgeUINetworkStatusCard>
