export const FORGEUI_DASHBOARD_CARD_SCHEMA_VERSION = 1

export type ForgeUIDashboardCardStatus =
  | 'normal'
  | 'warning'
  | 'critical'
  | 'offline'

export type ForgeUIDashboardCardModel = {
  schemaVersion: 1
  title: string
  icon: string
  value: string
  units: string
  secondaryText: string
  status: ForgeUIDashboardCardStatus
  statusText: string
  progress: number
  timestamp: string
  accentColor: string
  padding: number
  showHeader: boolean
  showFooter: boolean
  showProgress: boolean
  showStatus: boolean
  enableClick: boolean
}

const text = (value: unknown, fallback: string) =>
  typeof value === 'string' ? value : fallback

const bool = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback

const number = (value: unknown, fallback: number, min: number, max: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed)
    ? Math.max(min, Math.min(max, parsed))
    : fallback
}

const colour = (value: unknown) =>
  /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? String(value) : ''

export const normalizeForgeUIDashboardCard = (
  props: Record<string, unknown> = {},
): ForgeUIDashboardCardModel => {
  const status: ForgeUIDashboardCardStatus =
    ['normal', 'warning', 'critical', 'offline'].includes(String(props.status))
      ? props.status as ForgeUIDashboardCardStatus
      : 'normal'
  return {
    schemaVersion: FORGEUI_DASHBOARD_CARD_SCHEMA_VERSION,
    title: text(props.title, 'System Output'),
    icon: text(props.icon, ''),
    value: text(props.value, '72'),
    units: text(props.units, '%'),
    secondaryText: text(props.secondaryText, 'Operating level'),
    status,
    statusText: text(props.statusText, 'Normal'),
    progress: number(props.progress, 72, 0, 100),
    timestamp: text(props.timestamp, 'Now'),
    accentColor: colour(props.accentColor),
    padding: number(props.padding, 12, 0, 48),
    showHeader: bool(props.showHeader, true),
    showFooter: bool(props.showFooter, true),
    showProgress: bool(props.showProgress, true),
    showStatus: bool(props.showStatus, true),
    enableClick: bool(props.enableClick, true),
  }
}
