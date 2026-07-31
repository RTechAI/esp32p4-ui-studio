export type ForgeUISpinboxAlignment = 'left' | 'center' | 'right'

export type ForgeUIStandardSpinboxModel = {
  minimum: number
  maximum: number
  value: number
  step: number
  digitCount: number
  decimalPlaces: number
  separatorPosition: number
  rollover: boolean
  cursorPosition: number
  textAlign: ForgeUISpinboxAlignment
  padding: number
  opacity: number
  visible: boolean
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  selectedColor?: string
}

const integer = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return fallback
  return Math.max(-2147483648, Math.min(2147483647, Math.trunc(numeric)))
}

const powerOfTen = (value: unknown) => {
  const positive = Math.max(1, Math.abs(integer(value, 1)))
  return Math.pow(10, Math.floor(Math.log10(positive)))
}

export const getForgeUIStandardSpinboxModel = (
  props: Record<string, unknown> = {},
): ForgeUIStandardSpinboxModel => {
  const digitCount = Math.max(1, Math.min(10, integer(props.digitCount, 5)))
  const decimalPlaces = Math.max(
    0,
    Math.min(digitCount - 1, integer(props.decimalPlaces, 0)),
  )
  const digitLimit = digitCount >= 10
    ? 2147483647
    : Math.pow(10, digitCount) - 1
  const first = Math.max(-digitLimit, Math.min(digitLimit, integer(props.min, 0)))
  const second = Math.max(
    -digitLimit,
    Math.min(digitLimit, integer(props.max, 99999)),
  )
  const minimum = Math.min(first, second)
  const maximum = Math.max(first, second)
  const value = Math.max(minimum, Math.min(maximum, integer(props.value, 0)))
  const largestMagnitude = Math.max(1, Math.abs(minimum), Math.abs(maximum))
  const step = Math.min(largestMagnitude, powerOfTen(props.step))
  const cursorPosition = Math.max(
    0,
    Math.min(
      digitCount - 1,
      integer(props.cursorPosition, Math.round(Math.log10(step))),
    ),
  )
  const alignment = String(props.textAlign || 'right')
  const textAlign: ForgeUISpinboxAlignment =
    alignment === 'left' || alignment === 'center' ? alignment : 'right'

  return {
    minimum,
    maximum,
    value,
    step,
    digitCount,
    decimalPlaces,
    separatorPosition: decimalPlaces > 0 ? digitCount - decimalPlaces : 0,
    rollover: props.rollover === true,
    cursorPosition,
    textAlign,
    padding: Math.max(0, Math.min(48, integer(props.padding, 8))),
    opacity: Math.max(0, Math.min(100, integer(props.opacity, 100))),
    visible: props.visible !== false,
    backgroundColor: typeof props.backgroundColor === 'string' &&
      props.backgroundColor ? props.backgroundColor : undefined,
    borderColor: typeof props.borderColor === 'string' &&
      props.borderColor ? props.borderColor : undefined,
    textColor: typeof props.textColor === 'string' &&
      props.textColor ? props.textColor : undefined,
    selectedColor: typeof props.selectedColor === 'string' &&
      props.selectedColor ? props.selectedColor : undefined,
  }
}

export const formatForgeUIStandardSpinboxValue = (
  model: ForgeUIStandardSpinboxModel,
  value = model.value,
) => {
  const clamped = Math.max(model.minimum, Math.min(model.maximum, value))
  const sign = model.minimum < 0 ? (clamped < 0 ? '-' : '+') : ''
  const digits = Math.abs(clamped).toString().padStart(model.digitCount, '0')
  if (model.decimalPlaces === 0) return `${sign}${digits}`
  const split = model.digitCount - model.decimalPlaces
  return `${sign}${digits.slice(0, split)}.${digits.slice(split)}`
}

export const stepForgeUIStandardSpinboxValue = (
  model: ForgeUIStandardSpinboxModel,
  value: number,
  direction: 1 | -1,
) => {
  const next = value + direction * model.step
  if (next > model.maximum) {
    return model.rollover && value === model.maximum
      ? model.minimum
      : model.maximum
  }
  if (next < model.minimum) {
    return model.rollover && value === model.minimum
      ? model.maximum
      : model.minimum
  }
  return next
}
