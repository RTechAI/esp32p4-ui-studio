export const FORGEUI_BATTERY_CARD_SCHEMA_VERSION = 1
export type ForgeUIBatteryHealth = 'good' | 'fair' | 'poor' | 'replace'

const num = (v: unknown, fallback: number) => Number.isFinite(Number(v)) ? Number(v) : fallback
const clamp = (v: unknown, min: number, max: number, fallback: number) => Math.max(min, Math.min(max, num(v, fallback)))
const flag = (v: unknown, fallback: boolean) => typeof v === 'boolean' ? v : fallback
const text = (v: unknown, fallback: string, limit = 64) => typeof v === 'string' ? v.trim().slice(0, limit) || fallback : fallback
const colour = (v: unknown, fallback: string) => {
  const value = typeof v === 'string' ? v.replace(/^#/, '') : ''
  return /^[0-9a-fA-F]{6}$/.test(value) ? `#${value.toUpperCase()}` : fallback
}
const health = (v: unknown): ForgeUIBatteryHealth => v === 'fair' || v === 'poor' || v === 'replace' ? v : 'good'

export const normalizeForgeUIBatteryCard = (props: Record<string, unknown> = {}) => {
  const criticalThreshold = clamp(props.criticalThreshold, 0, 100, 10)
  const lowThreshold = Math.max(criticalThreshold, clamp(props.lowThreshold, 0, 100, 20))
  return {
    schemaVersion: FORGEUI_BATTERY_CARD_SCHEMA_VERSION as 1,
    title: text(props.title, 'Battery Status'), units: text(props.units, '%', 12),
    percentage: clamp(props.percentage, 0, 100, 76), voltage: num(props.voltage, 12.6),
    current: num(props.current, -1.4), charging: flag(props.charging, false),
    health: health(props.health), remainingMinutes: Math.max(0, Math.trunc(num(props.remainingMinutes, 185))),
    temperature: num(props.temperature, 31.5), lowThreshold, criticalThreshold,
    compactMode: flag(props.compactMode, false), showPercentage: flag(props.showPercentage, true),
    showVoltage: flag(props.showVoltage, true), showCurrent: flag(props.showCurrent, true),
    showRuntime: flag(props.showRuntime, true), showTemperature: flag(props.showTemperature, true),
    showChargingIcon: flag(props.showChargingIcon, true), showHealth: flag(props.showHealth, true),
    animateCharging: flag(props.animateCharging, false),
    normalColour: colour(props.normalColour, '#22C55E'), lowColour: colour(props.lowColour, '#F2A900'),
    criticalColour: colour(props.criticalColour, '#E5484D'), chargingColour: colour(props.chargingColour, '#38BDF8'),
    generateRuntimeApi: flag(props.generateRuntimeApi, true),
  }
}

export type ForgeUIBatteryCardModel = ReturnType<typeof normalizeForgeUIBatteryCard>
