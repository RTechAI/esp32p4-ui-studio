export const FORGEUI_STANDARD_BUTTON_DEFAULT_TEXT = 'Button text'

type StandardButtonProps = {
  buttonText?: unknown
  children?: unknown
}

export const getForgeUIStandardButtonText = (
  props: StandardButtonProps | undefined,
): string => {
  if (typeof props?.buttonText === 'string') {
    return props.buttonText
  }

  if (typeof props?.children === 'string') {
    return props.children
  }

  return FORGEUI_STANDARD_BUTTON_DEFAULT_TEXT
}
