export const normalizeForgeUIStandardRadioLabel = (value: unknown) => {
  const text = typeof value === 'string' ? value : ''
  return text === 'Radio' ? '' : text
}

export const getForgeUIStandardRadioText = (
  props: Record<string, unknown>,
) => normalizeForgeUIStandardRadioLabel(
  props.children || props.text || props.label || '',
)
