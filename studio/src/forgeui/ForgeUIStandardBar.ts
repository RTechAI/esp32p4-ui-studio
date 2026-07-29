export interface ForgeUIStandardBarValues {
  minimum: number
  maximum: number
  value: number
}

const integer = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
}

export const getForgeUIStandardBarValues = (
  props: Record<string, unknown>,
): ForgeUIStandardBarValues => {
  const firstRangeValue = integer(props.min, 0)
  const secondRangeValue = integer(props.max, 100)
  const minimum = Math.min(firstRangeValue, secondRangeValue)
  const maximum = Math.max(firstRangeValue, secondRangeValue)
  const configuredValue = integer(props.value, 70)

  return {
    minimum,
    maximum,
    value: Math.max(minimum, Math.min(maximum, configuredValue)),
  }
}
