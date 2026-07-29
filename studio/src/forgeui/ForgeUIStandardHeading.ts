export const FORGEUI_STANDARD_HEADING_DEFAULT_TEXT = 'Heading title'

type StandardHeadingProps = {
  headingText?: unknown
  children?: unknown
  text?: unknown
  value?: unknown
}

export const getForgeUIStandardHeadingText = (
  props: StandardHeadingProps | undefined,
): string => {
  const candidates = [
    props?.headingText,
    props?.children,
    props?.text,
    props?.value,
  ]
  const savedText = candidates.find(
    candidate => typeof candidate === 'string',
  )

  return typeof savedText === 'string'
    ? savedText
    : FORGEUI_STANDARD_HEADING_DEFAULT_TEXT
}
