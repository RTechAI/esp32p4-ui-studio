const PREFIX = 'fg_interactive'

export const createInteractiveAssetId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
  ) {
    return `${PREFIX}_${crypto.randomUUID()}`
  }

  return `${PREFIX}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`
}