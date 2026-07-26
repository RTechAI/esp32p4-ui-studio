export const getInteractiveButtonHookBase = (
  label: unknown,
) => {
  const cleaned = String(label || 'InteractiveButton')
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part =>
      part.charAt(0).toUpperCase() +
      part.slice(1),
    )
    .join('')
    .replace(/^[^a-zA-Z_]/, '_')

  return cleaned || 'InteractiveButton'
}

export const getInteractiveButtonHookName = (
  label: unknown,
) =>
  `FG_On_${getInteractiveButtonHookBase(label)}_Clicked`

export const getInteractiveButtonHookPreview = (
  label: unknown,
) =>
  `${getInteractiveButtonHookName(label)}(void)`

export const getNextInteractiveButtonLabel = (
  existingLabels: unknown[],
) => {
  const occupiedHooks = new Set(
    existingLabels.map(getInteractiveButtonHookName),
  )

  let number = 1
  while (
    occupiedHooks.has(
      getInteractiveButtonHookName(`Button ${number}`),
    )
  ) {
    number++
  }

  return `Button ${number}`
}
