export const FORGEUI_STANDARD_HEADING_DEFAULT_TEXT = 'Heading title'

type StandardHeadingProps = {
  headingText?: unknown
  children?: unknown
  text?: unknown
  value?: unknown
  fontSize?: unknown
  size?: unknown
  textAlign?: unknown
  align?: unknown
}

export type ForgeUIHeadingAlignment = 'left' | 'center' | 'right'

const supportedSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48]
const namedSizes: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 36,
  '2xl': 48,
}

const nearestSupportedSize = (value: number) =>
  supportedSizes.reduce((nearest, size) =>
    Math.abs(size - value) < Math.abs(nearest - value) ? size : nearest,
  supportedSizes[0])

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

export const getForgeUIStandardHeadingPresentation = (
  props: StandardHeadingProps | undefined,
) => {
  const requestedSize = Number(
    props?.fontSize ?? namedSizes[String(props?.size || '')] ?? 32,
  )
  const alignment = String(props?.textAlign || props?.align || 'left')
  const textAlign: ForgeUIHeadingAlignment = alignment === 'center'
    ? 'center'
    : alignment === 'right' || alignment === 'end'
      ? 'right'
      : 'left'

  return {
    text: getForgeUIStandardHeadingText(props),
    fontSize: nearestSupportedSize(
      Number.isFinite(requestedSize) ? requestedSize : 32,
    ),
    fontWeight: 'normal' as const,
    textAlign,
  }
}
