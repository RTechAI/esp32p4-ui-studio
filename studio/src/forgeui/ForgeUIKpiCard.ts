export const FORGEUI_KPI_CARD_SCHEMA_VERSION = 1
export const FORGEUI_KPI_CARD_DEFAULT_SIZE = { width: 240, height: 145 } as const
export const FORGEUI_KPI_CARD_MIN_SIZE = { width: 220, height: 128 } as const

export type ForgeUIKpiStatus = 'neutral' | 'good' | 'warning' | 'critical'
export type ForgeUIKpiTrendState = 'flat' | 'up' | 'down'

const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 64) => typeof value === 'string' ? value.trim().slice(0, limit) || fallback : fallback
const optionalText = (value: unknown, fallback: string, limit = 64) => typeof value === 'string' ? value.trim().slice(0, limit) : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const status = (value: unknown): ForgeUIKpiStatus => value === 'good' || value === 'warning' || value === 'critical' ? value : 'neutral'
const trend = (value: unknown): ForgeUIKpiTrendState => value === 'up' || value === 'down' ? value : 'flat'

export const normalizeForgeUIKpiCard = (props: Record<string, unknown> = {}) => ({
  schemaVersion: FORGEUI_KPI_CARD_SCHEMA_VERSION as 1,
  title: text(props.title, 'Efficiency'),
  value: text(props.value, '87.4', 48),
  unit: optionalText(props.unit, '%', 24),
  secondaryText: optionalText(props.secondaryText, 'Target 90%', 64),
  trendText: optionalText(props.trendText, '+2.1%', 48),
  trendState: trend(props.trendState ?? 'up'),
  status: status(props.status ?? 'good'),
  targetText: optionalText(props.targetText, '', 64),
  showSecondary: flag(props.showSecondary, true),
  showTrend: flag(props.showTrend, true),
  showTarget: flag(props.showTarget, false),
  neutralColour: colour(props.neutralColour, '#94A3B8'),
  goodColour: colour(props.goodColour, '#22C55E'),
  warningColour: colour(props.warningColour, '#F2A900'),
  criticalColour: colour(props.criticalColour, '#E5484D'),
  generateRuntimeApi: flag(props.generateRuntimeApi, true),
})

export type ForgeUIKpiCardModel = ReturnType<typeof normalizeForgeUIKpiCard>
