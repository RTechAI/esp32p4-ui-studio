const LEGACY_CHECKBOX_PLACEHOLDER = 'Label checkbox'

export const getForgeUIStandardCheckboxText = (
  props: Record<string, unknown>,
) => {
  const value = props.children ?? props.text ?? props.label ?? ''
  if (value === LEGACY_CHECKBOX_PLACEHOLDER) return ''
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : ''
}
