export const FORGEUI_POWER_FLOW_CARD_SCHEMA_VERSION = 1
export const FORGEUI_POWER_FLOW_CARD_DEFAULT_SIZE = { width: 240, height: 145 } as const
export const FORGEUI_POWER_FLOW_CARD_MIN_SIZE = { width: 220, height: 128 } as const

export type ForgeUIPowerFlowDirection = 'none' | 'into-centre' | 'out-from-centre'

const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 32) => typeof value === 'string' ? value.trim().slice(0, limit) || fallback : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const direction = (value: unknown, fallback: ForgeUIPowerFlowDirection): ForgeUIPowerFlowDirection =>
  value === 'into-centre' || value === 'out-from-centre' || value === 'none' ? value : fallback

export const normalizeForgeUIPowerFlowCard = (props: Record<string, unknown> = {}) => ({
  schemaVersion: FORGEUI_POWER_FLOW_CARD_SCHEMA_VERSION as 1,
  title: text(props.title, 'Power Flow', 48),
  gridVisible: flag(props.gridVisible, true),
  gridValue: text(props.gridValue, '1.2 kW', 24),
  gridFlow: direction(props.gridFlow, 'into-centre'),
  solarVisible: flag(props.solarVisible, true),
  solarValue: text(props.solarValue, '2.8 kW', 24),
  solarFlow: direction(props.solarFlow, 'into-centre'),
  batteryVisible: flag(props.batteryVisible, true),
  batteryValue: text(props.batteryValue, '0.6 kW', 24),
  batteryFlow: direction(props.batteryFlow, 'out-from-centre'),
  loadVisible: flag(props.loadVisible, true),
  loadValue: text(props.loadValue, '3.4 kW', 24),
  activeColour: colour(props.activeColour, '#22C55E'),
  inactiveColour: colour(props.inactiveColour, '#64748B'),
  generateRuntimeApi: flag(props.generateRuntimeApi, true),
})

export type ForgeUIPowerFlowCardModel = ReturnType<typeof normalizeForgeUIPowerFlowCard>
