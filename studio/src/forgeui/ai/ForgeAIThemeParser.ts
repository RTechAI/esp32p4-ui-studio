import { ForgePreviewPalette } from '../preview/forgeThemeMap'
import { ForgeAIThemeDocument } from './ForgeAIThemeDocument'

const VALID_BORDER_STYLES = new Set([
  'flat',
  'industrial',
  'glow',
  'soft',
  'terminal',
])

const HEX_COLOR_PATTERN =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

const extractJsonText = (value: string): string => {
  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error('AI returned an empty response')
  }

  const withoutCodeFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  const firstBrace = withoutCodeFence.indexOf('{')
  const lastBrace = withoutCodeFence.lastIndexOf('}')

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace < firstBrace
  ) {
    throw new Error(
      'AI response does not contain a JSON object',
    )
  }

  return withoutCodeFence.slice(
    firstBrace,
    lastBrace + 1,
  )
}

const validateString = (
  value: unknown,
  fieldName: string,
): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(
      `${fieldName} must be a non-empty string`,
    )
  }

  return value.trim()
}

const validateColor = (
  value: unknown,
  fieldName: string,
): string => {
  const color = validateString(value, fieldName)

  if (!HEX_COLOR_PATTERN.test(color)) {
    throw new Error(
      `${fieldName} must be a valid hexadecimal colour`,
    )
  }

  return color
}

const validatePalette = (
  value: unknown,
): ForgePreviewPalette => {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    throw new Error(
      'AI response must contain a palette object',
    )
  }

  const palette = value as Record<string, unknown>

  const borderStyle = validateString(
    palette.borderStyle,
    'palette.borderStyle',
  )

  if (!VALID_BORDER_STYLES.has(borderStyle)) {
    throw new Error(
      `Unsupported border style: ${borderStyle}`,
    )
  }

  return {
    name: validateString(
      palette.name,
      'palette.name',
    ),

    bg: validateColor(
      palette.bg,
      'palette.bg',
    ),

    surface: validateColor(
      palette.surface,
      'palette.surface',
    ),

    surface2: validateColor(
      palette.surface2,
      'palette.surface2',
    ),

    border: validateColor(
      palette.border,
      'palette.border',
    ),

    text: validateColor(
      palette.text,
      'palette.text',
    ),

    accent: validateColor(
      palette.accent,
      'palette.accent',
    ),

    texture: validateString(
      palette.texture,
      'palette.texture',
    ) as ForgePreviewPalette['texture'],

    borderStyle:
      borderStyle as ForgePreviewPalette['borderStyle'],
  }
}

export const parseForgeAIThemeResponse = (
  rawResponse: string,
): ForgeAIThemeDocument => {
  const jsonText = extractJsonText(rawResponse)

  let parsed: unknown

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    Array.isArray(parsed)
  ) {
    throw new Error(
      'AI response must be a JSON document',
    )
  }

  const document =
    parsed as Record<string, unknown>

  return {
    name:
      typeof document.name === 'string' &&
      document.name.trim()
        ? document.name.trim()
        : 'AI Generated Theme',

    description:
      typeof document.description === 'string'
        ? document.description.trim()
        : '',

    palette: validatePalette(document.palette),
  }
}