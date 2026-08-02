export const FORGEUI_PWM_CONTROLLER_SCHEMA_VERSION = 1

export type ForgeUIPwmOrientation = 'horizontal' | 'vertical'

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
const bool = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const text = (value: unknown, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const colour = (value: unknown) => /^#[0-9a-fA-F]{6}$/.test(String(value || '')) ? String(value).toUpperCase() : ''

export const normalizeForgeUIPwmController = (props: Record<string, unknown> = {}) => {
  let minimum = numeric(props.minimum, 0)
  let maximum = numeric(props.maximum, 100)
  if (maximum <= minimum) maximum = minimum + 100
  const step = Math.max(Number.EPSILON, Math.abs(numeric(props.step, 1)))
  const rawValue = Math.max(minimum, Math.min(maximum, numeric(props.value, 50)))
  const value = Math.max(minimum, Math.min(maximum,
    minimum + Math.round((rawValue - minimum) / step) * step))
  const orientation = (props.orientation === 'vertical' ? 'vertical' : 'horizontal') as ForgeUIPwmOrientation
  return {
    schemaVersion: FORGEUI_PWM_CONTROLLER_SCHEMA_VERSION as 1,
    label: text(props.label, 'PWM Output').slice(0, 64) || 'PWM Output',
    subtitle: text(props.subtitle, 'Analogue output control').slice(0, 96),
    value,
    minimum,
    maximum,
    step,
    unit: text(props.unit, '%').slice(0, 16),
    enabled: bool(props.enabled, true),
    showSlider: bool(props.showSlider, true),
    showNumericValue: bool(props.showNumericValue, true),
    showEnableControl: bool(props.showEnableControl, true),
    orientation,
    accentColour: colour(props.accentColour),
    statusText: text(props.statusText, 'Ready').slice(0, 96),
    generateRuntimeApi: bool(props.generateRuntimeApi, true),
    enableUserEvents: bool(props.enableUserEvents, true),
  }
}

export type ForgeUIPwmControllerModel = ReturnType<typeof normalizeForgeUIPwmController>
