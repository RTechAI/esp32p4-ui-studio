export const FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_TITLE = 'Message'
export const FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_BODY =
  'Example message text'
export const FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_BUTTONS = [
  'OK',
  'Cancel',
]

export type ForgeUIStandardMessageBoxModel = {
  title: string
  bodyText: string
  buttons: string[]
}

export const getForgeUIStandardMessageBoxModel = (
  props: Record<string, unknown>,
): ForgeUIStandardMessageBoxModel => {
  const configuredButtons: unknown[] = Array.isArray(props.buttons)
    ? props.buttons
    : FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_BUTTONS
  const buttons = configuredButtons
    .map(button => String(button))
    .filter(button => button.length > 0)

  if (buttons.length === 0) {
    buttons.push(...FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_BUTTONS)
  }

  return {
    title: String(
      props.title || FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_TITLE,
    ),
    bodyText: String(
      props.bodyText ??
      props.text ??
      FORGEUI_STANDARD_MESSAGE_BOX_DEFAULT_BODY,
    ),
    buttons,
  }
}
