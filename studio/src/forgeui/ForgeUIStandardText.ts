export const FORGEUI_STANDARD_TEXT_DEFAULT_VALUE = 'Text value'

type StandardTextProps = {
  textValue?: unknown
  children?: unknown
  text?: unknown
  value?: unknown
}

export const getForgeUIStandardTextValue = (
  props: StandardTextProps | undefined,
): string => {
  const candidates = [
    props?.textValue,
    props?.children,
    props?.text,
    props?.value,
  ]
  const savedValue = candidates.find(
    candidate => typeof candidate === 'string',
  )

  return typeof savedValue === 'string'
    ? savedValue
    : FORGEUI_STANDARD_TEXT_DEFAULT_VALUE
}
