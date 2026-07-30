import {
  getForgeAIComponentEntry,
  resolveForgeAIComponentType,
} from './ForgeAIComponentCatalogue'

export type ForgeAILayoutItem = {
  type: string
  props: Record<string, unknown>
}

export type ForgeAILayoutDocument = {
  name: string
  category: string
  description: string
  layout: ForgeAILayoutItem[]
}

export type ForgeAIParserAsset = {
  id: string
  kind: string
  exportReady: boolean
}

const clampNumber = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number => {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return fallback
  }

  return Math.min(max, Math.max(min, numericValue))
}

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

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error('AI response does not contain a JSON object')
  }

  return withoutCodeFence.slice(firstBrace, lastBrace + 1)
}

const validateLayoutItem = (
  item: unknown,
  index: number,
  supportedComponents: Set<string>,
  screenWidth: number,
  screenHeight: number,
  availableAssets: ForgeAIParserAsset[],
): ForgeAILayoutItem => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new Error(`layout[${index}] must be an object`)
  }

  const candidate = item as Record<string, unknown>

  if (typeof candidate.type !== 'string' || !candidate.type.trim()) {
    throw new Error(`layout[${index}].type must be a non-empty string`)
  }

  const resolvedType = resolveForgeAIComponentType(candidate.type)

  if (!resolvedType || !supportedComponents.has(resolvedType)) {
    throw new Error(`Unsupported component: ${candidate.type}`)
  }

  if (
    !candidate.props ||
    typeof candidate.props !== 'object' ||
    Array.isArray(candidate.props)
  ) {
    throw new Error(`layout[${index}].props must be an object`)
  }

  const catalogueEntry = getForgeAIComponentEntry(resolvedType)
  const normalizedProps: Record<string, unknown> = {
    ...(catalogueEntry?.defaultProps ?? {}),
    ...(candidate.props as Record<string, unknown>),
    positionMode: 'absolute',
  }

  if (['NumberInput', 'Progress', 'CircularProgress', 'Slider', 'Bar', 'Arc'].includes(resolvedType)) {
    const min = Number.isFinite(Number(normalizedProps.min))
      ? Number(normalizedProps.min)
      : 0
    const maxCandidate = Number.isFinite(Number(normalizedProps.max))
      ? Number(normalizedProps.max)
      : 100
    const max = Math.max(min, maxCandidate)
    normalizedProps.min = min
    normalizedProps.max = max
    normalizedProps.value = clampNumber(normalizedProps.value, min, max, min)
    if (resolvedType === 'NumberInput') {
      normalizedProps.step = Math.max(1, Number(normalizedProps.step) || 1)
    }
  }

  if (resolvedType === 'Select') {
    const options = Array.isArray(normalizedProps.options)
      ? normalizedProps.options.filter(option => typeof option === 'string')
      : []
    normalizedProps.options = options
    normalizedProps.selectedIndex = Math.round(clampNumber(
      normalizedProps.selectedIndex,
      0,
      Math.max(0, options.length - 1),
      0,
    ))
  }

  if (catalogueEntry && !['none', 'icon'].includes(catalogueEntry.assetRequirement)) {
    const property = catalogueEntry.assetRequirement === 'uploaded-image'
      ? 'uploadedAssetId'
      : 'interactiveAssetId'
    const expectedKinds: Record<string, string> = {
      'uploaded-image': 'uploaded-image',
      'interactive-button': 'button',
      'interactive-light': 'light',
      'interactive-status-indicator': 'statusIndicator',
      'interactive-toggle': 'toggleSwitch',
      'interactive-three-position-toggle': 'threePositionToggle',
    }
    const id = normalizedProps[property]
    const asset = availableAssets.find(candidate =>
      candidate.id === id &&
      candidate.kind === expectedKinds[catalogueEntry.assetRequirement] &&
      candidate.exportReady
    )
    if (!asset) {
      throw new Error(
        `${resolvedType} requires an exact export-ready ${catalogueEntry.assetRequirement} asset ID`,
      )
    }
  }

  const x = clampNumber(normalizedProps.x, 0, screenWidth, 0)
  const y = clampNumber(normalizedProps.y, 0, screenHeight, 0)
  const w = clampNumber(normalizedProps.w, 24, screenWidth, Math.min(240, screenWidth))
  const h = clampNumber(normalizedProps.h, 24, screenHeight, Math.min(120, screenHeight))

  const safeWidth = Math.max(24, Math.min(screenWidth - x, w))
  const safeHeight = Math.max(24, Math.min(screenHeight - y, h))

  return {
    type: resolvedType,
    props: {
      ...normalizedProps,
      x,
      y,
      w: safeWidth,
      h: safeHeight,
    },
  }
}

export const parseForgeAIResponse = (
  rawResponse: string,
  supportedComponentNames: string[],
  screenWidth = 1024,
  screenHeight = 600,
  availableAssets: ForgeAIParserAsset[] = [],
): ForgeAILayoutDocument => {
  const jsonText = extractJsonText(rawResponse)

  let parsed: unknown

  try {
    parsed = JSON.parse(jsonText)
  } catch {
    throw new Error('AI returned invalid JSON')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('AI response must be a JSON document')
  }

  const document = parsed as Record<string, unknown>

  if (!Array.isArray(document.layout)) {
    throw new Error('AI response must contain a layout array')
  }

  const supportedComponents = new Set(supportedComponentNames)

  const layout = document.layout.map((item, index) =>
    validateLayoutItem(
      item,
      index,
      supportedComponents,
      screenWidth,
      screenHeight,
      availableAssets,
    )
  )

  return {
    name:
      typeof document.name === 'string' && document.name.trim()
        ? document.name
        : 'AI Generated Screen',

    category:
      typeof document.category === 'string' && document.category.trim()
        ? document.category
        : 'AI Generated',

    description:
      typeof document.description === 'string'
        ? document.description
        : '',

    layout,
  }
}
