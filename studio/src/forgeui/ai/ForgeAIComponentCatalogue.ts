import { componentsList } from '~componentsList'
import { getPreviewDefaultProps } from '~utils/defaultProps'

export type ForgeAIAssetRequirement =
  | 'none'
  | 'icon'
  | 'uploaded-image'
  | 'interactive-button'
  | 'interactive-light'
  | 'interactive-status-indicator'
  | 'interactive-toggle'
  | 'interactive-three-position-toggle'

export type ForgeAIComponentCatalogueEntry = {
  type: ComponentType
  category: 'content' | 'control' | 'display' | 'layout' | 'media' | 'navigation'
  description: string
  aliases: string[]
  defaultProps: Record<string, unknown>
  defaultSize: { w: number; h: number }
  supportedProps: string[]
  assetRequirement: ForgeAIAssetRequirement
  canvasPreview: true
  browserPreview: true
  lvglExport: true
}

const SUPPORTED_TYPES = [
  'Text', 'Heading', 'Clock', 'WiFi', 'Button', 'InteractiveButton',
  'InteractiveLight', 'InteractiveStatusIndicator', 'InteractiveToggleSwitch',
  'InteractiveThreePositionToggleSwitch', 'IconButton', 'Icon', 'Input',
  'Textarea', 'Switch', 'Checkbox', 'Radio', 'NumberInput', 'Spinbox', 'Select', 'Image',
  'Slider', 'Progress', 'CircularProgress', 'Led', 'Bar', 'Arc', 'Roller',
  'Canvas', 'Line', 'Tabview', 'Tileview', 'AnimImage', 'ButtonMatrix',
  'Msgbox', 'Table', 'Scale', 'Keyboard', 'Divider', 'Calendar', 'Chart', 'Box',
] as const

type SupportedType = typeof SUPPORTED_TYPES[number]

const CONTROL_TYPES = new Set<SupportedType>([
  'Button', 'InteractiveButton', 'InteractiveToggleSwitch',
  'InteractiveThreePositionToggleSwitch', 'IconButton', 'Input', 'Textarea',
  'Switch', 'Checkbox', 'Radio', 'NumberInput', 'Spinbox', 'Select', 'Slider', 'Roller',
  'ButtonMatrix', 'Keyboard',
])

const MEDIA_TYPES = new Set<SupportedType>(['Image', 'AnimImage', 'Icon'])
const NAVIGATION_TYPES = new Set<SupportedType>(['Tabview', 'Tileview'])
const LAYOUT_TYPES = new Set<SupportedType>(['Box', 'Divider', 'Line', 'Canvas'])
const CONTENT_TYPES = new Set<SupportedType>(['Text', 'Heading'])

const descriptions: Partial<Record<SupportedType, string>> = {
  NumberInput: 'Editable numeric field with increment and decrement controls.',
  CircularProgress: 'Output-only circular value display.',
  Progress: 'Output-only linear progress display.',
  Radio: 'Single radio indicator; use application state for grouping.',
  Select: 'Dropdown selection control.',
  Switch: 'Two-state toggle control.',
  Box: 'Visual container. AI layout documents currently remain flat.',
  InteractiveButton: 'Project Interactive button asset instance.',
  InteractiveLight: 'Project Interactive light asset instance.',
  InteractiveStatusIndicator: 'Project Interactive status asset instance.',
  InteractiveToggleSwitch: 'Project Interactive two-state switch asset instance.',
  InteractiveThreePositionToggleSwitch: 'Project Interactive three-position switch asset instance.',
}

const aliases: Partial<Record<SupportedType, string[]>> = {
  Text: ['label'],
  Heading: ['title'],
  NumberInput: ['number input', 'numeric input', 'stepper'],
  CircularProgress: ['circular progress', 'radial progress'],
  Progress: ['progress bar'],
  Switch: ['toggle'],
  Select: ['dropdown', 'combo box'],
  Textarea: ['text area'],
  ButtonMatrix: ['button matrix'],
  Msgbox: ['message box'],
  Tabview: ['tab view'],
  Tileview: ['tile view'],
  InteractiveStatusIndicator: ['interactive status indicator'],
  InteractiveToggleSwitch: ['interactive toggle switch'],
  InteractiveThreePositionToggleSwitch: ['interactive three position toggle'],
}

const sizes: Partial<Record<SupportedType, { w: number; h: number }>> = {
  Text: { w: 180, h: 40 },
  Heading: { w: 320, h: 56 },
  Button: { w: 140, h: 48 },
  Input: { w: 240, h: 48 },
  Textarea: { w: 280, h: 100 },
  NumberInput: { w: 180, h: 56 },
  Select: { w: 220, h: 48 },
  Switch: { w: 64, h: 36 },
  Checkbox: { w: 32, h: 32 },
  Radio: { w: 32, h: 32 },
  Slider: { w: 240, h: 32 },
  Spinbox: { w: 220, h: 48 },
  Progress: { w: 240, h: 24 },
  CircularProgress: { w: 120, h: 120 },
  Divider: { w: 240, h: 2 },
}

const assetRequirement = (type: SupportedType): ForgeAIAssetRequirement => {
  if (type === 'Icon' || type === 'IconButton') return 'icon'
  if (type === 'Image' || type === 'AnimImage') return 'uploaded-image'
  if (type === 'InteractiveButton') return 'interactive-button'
  if (type === 'InteractiveLight') return 'interactive-light'
  if (type === 'InteractiveStatusIndicator') return 'interactive-status-indicator'
  if (type === 'InteractiveToggleSwitch') return 'interactive-toggle'
  if (type === 'InteractiveThreePositionToggleSwitch') {
    return 'interactive-three-position-toggle'
  }
  return 'none'
}

const category = (
  type: SupportedType,
): ForgeAIComponentCatalogueEntry['category'] => {
  if (CONTROL_TYPES.has(type)) return 'control'
  if (MEDIA_TYPES.has(type)) return 'media'
  if (NAVIGATION_TYPES.has(type)) return 'navigation'
  if (LAYOUT_TYPES.has(type)) return 'layout'
  if (CONTENT_TYPES.has(type)) return 'content'
  return 'display'
}

const propsFor = (type: SupportedType): Record<string, unknown> => {
  const defaults = getPreviewDefaultProps(type as ComponentType)
  return defaults && typeof defaults === 'object' ? defaults : {}
}

export const forgeAIComponentCatalogue: ForgeAIComponentCatalogueEntry[] =
  SUPPORTED_TYPES.map(type => {
    const defaultProps = propsFor(type)
    return {
      type: type as ComponentType,
      category: category(type),
      description: descriptions[type] ?? `${type} Standard LVGL component.`,
      aliases: aliases[type] ?? [],
      defaultProps,
      defaultSize: sizes[type] ?? { w: 120, h: 60 },
      supportedProps: Array.from(new Set([
        ...Object.keys(defaultProps),
        'positionMode', 'x', 'y', 'w', 'h',
      ])),
      assetRequirement: assetRequirement(type),
      canvasPreview: true,
      browserPreview: true,
      lvglExport: true,
    }
  })

const exclusionReason = (type: ComponentType): string => {
  if (type === 'Lottie' || type === 'Spinner') {
    return 'Browser preview exists, but there is no generated LVGL exporter path.'
  }
  if (type === 'Menu' || type === 'ObjxTempl' || type === 'Editable') {
    return 'Palette placeholder or incomplete component without complete preview/export parity.'
  }
  return 'Chakra/composite editor component without a dedicated Standard LVGL exporter contract.'
}

const supportedSet = new Set<ComponentType>(
  forgeAIComponentCatalogue.map(entry => entry.type),
)

export const forgeAIIntentionalExclusions = componentsList
  .filter(type => !supportedSet.has(type))
  .map(type => ({ type, reason: exclusionReason(type) }))

export const forgeAIVisibleComponents = forgeAIComponentCatalogue.map(
  entry => entry.type,
)

const normalizeName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '')

const aliasesByName = new Map<string, ComponentType>()
forgeAIComponentCatalogue.forEach(entry => {
  [entry.type, ...entry.aliases].forEach(value => {
    aliasesByName.set(normalizeName(value), entry.type)
  })
})

export const resolveForgeAIComponentType = (
  value: string,
): ComponentType | undefined => aliasesByName.get(normalizeName(value))

export const getForgeAIComponentEntry = (
  type: ComponentType,
): ForgeAIComponentCatalogueEntry | undefined =>
  forgeAIComponentCatalogue.find(entry => entry.type === type)

export const validateForgeAIComponentCatalogue = (): string[] => {
  const errors: string[] = []
  const palette = new Set(componentsList)
  const accounted = new Set<ComponentType>()
  const names = new Map<string, ComponentType>()

  forgeAIComponentCatalogue.forEach(entry => {
    if (!palette.has(entry.type)) errors.push(`${entry.type} is not in the Studio palette`)
    if (accounted.has(entry.type)) errors.push(`${entry.type} is duplicated`)
    accounted.add(entry.type)
    ;[entry.type, ...entry.aliases].forEach(name => {
      const normalized = normalizeName(name)
      const owner = names.get(normalized)
      if (owner && owner !== entry.type) {
        errors.push(`Alias "${name}" is ambiguous between ${owner} and ${entry.type}`)
      }
      names.set(normalized, entry.type)
    })
  })

  forgeAIIntentionalExclusions.forEach(exclusion => {
    if (!exclusion.reason) errors.push(`${exclusion.type} has no exclusion reason`)
    accounted.add(exclusion.type)
  })
  componentsList.forEach(type => {
    if (!accounted.has(type)) errors.push(`${type} is not accounted for`)
  })
  return errors
}

export const forgeAIPromptCatalogue = forgeAIComponentCatalogue.map(entry => ({
  type: entry.type,
  aliases: entry.aliases,
  description: entry.description,
  defaultProps: entry.defaultProps,
  defaultSize: entry.defaultSize,
  supportedProps: entry.supportedProps,
  assetRequirement: entry.assetRequirement,
}))
