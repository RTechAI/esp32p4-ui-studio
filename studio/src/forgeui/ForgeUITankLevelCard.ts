export const FORGEUI_TANK_LEVEL_CARD_SCHEMA_VERSION = 1
export type ForgeUITankShape = 'cylindrical' | 'rectangular' | 'silo'

const num = (value: unknown, fallback: number) => Number.isFinite(Number(value)) ? Number(value) : fallback
const clamp = (value: unknown, min: number, max: number, fallback: number) => Math.max(min, Math.min(max, num(value, fallback)))
const flag = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback: string, limit = 64) => typeof value === 'string' ? value.trim().slice(0, limit) || fallback : fallback
const colour = (value: unknown, fallback: string) => {
  const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized.toUpperCase()}` : fallback
}
const shape = (value: unknown): ForgeUITankShape => value === 'rectangular' || value === 'silo' ? value : 'cylindrical'

export const normalizeForgeUITankLevelCard = (props: Record<string, unknown> = {}) => {
  const criticalLevel = clamp(props.criticalLevel, 0, 100, 5)
  const lowLevel = Math.max(criticalLevel, clamp(props.lowLevel, 0, 100, 20))
  const highLevel = Math.max(lowLevel, clamp(props.highLevel, 0, 100, 90))
  const capacity = Math.max(0, num(props.capacity, 1000))
  return {
    schemaVersion: FORGEUI_TANK_LEVEL_CARD_SCHEMA_VERSION as 1,
    title: text(props.title, 'Tank Level'), units: text(props.units, 'L', 12),
    compactMode: flag(props.compactMode, false), level: clamp(props.level, 0, 120, 68),
    capacity, currentVolume: Math.max(0, num(props.currentVolume, 680)),
    showPercentage: flag(props.showPercentage, true), showVolume: flag(props.showVolume, true),
    tankShape: shape(props.tankShape), lowLevel, highLevel, criticalLevel,
    fillColour: colour(props.fillColour, '#38BDF8'), tankOutline: colour(props.tankOutline, '#94A3B8'),
    lowColour: colour(props.lowColour, '#F2A900'), highColour: colour(props.highColour, '#A78BFA'),
    criticalColour: colour(props.criticalColour, '#E5484D'), overflowColour: colour(props.overflowColour, '#EF4444'),
    animateFill: flag(props.animateFill, true), showLabels: flag(props.showLabels, true),
    generateRuntimeApi: flag(props.generateRuntimeApi, true),
  }
}

export type ForgeUITankLevelCardModel = ReturnType<typeof normalizeForgeUITankLevelCard>
