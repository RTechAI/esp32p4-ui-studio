import {
  forgeAIComponentCatalogue,
  ForgeAIComponentCatalogueEntry,
} from './ForgeAIComponentCatalogue'

export type ForgeAIPromptBuilderAsset = {
  id: string
  name: string
  kind: string
  exportReady: boolean
}

export type ForgeAIPromptBuilderGroup = {
  label: string
  types: ComponentType[]
}

export const forgeAIPromptBuilderGroups: ForgeAIPromptBuilderGroup[] = [
  { label: 'Text', types: ['Text', 'Heading'] },
  { label: 'Inputs', types: ['Input', 'Textarea', 'NumberInput', 'Keyboard'] },
  {
    label: 'Selection Controls',
    types: [
      'Button',
      'IconButton',
      'Switch',
      'Checkbox',
      'Radio',
      'Select',
      'Slider',
      'Spinbox',
      'Roller',
      'ButtonMatrix',
    ],
  },
  {
    label: 'Indicators',
    types: [
      'Clock',
      'WiFi',
      'Progress',
      'CircularProgress',
      'Led',
      'Bar',
      'Arc',
      'Scale',
    ],
  },
  { label: 'Charts', types: ['Chart'] },
  {
    label: 'ForgeUI Native',
    types: ['DashboardCard', 'SensorTile', 'RelayPanel', 'TrendChart', 'TrendChartPro', 'AlarmPanel', 'IOMonitor'],
  },
  { label: 'Containers', types: ['Box', 'Canvas', 'Line', 'Divider'] },
  { label: 'Navigation', types: ['Tabview', 'Tileview'] },
  { label: 'Tables', types: ['Table', 'Calendar', 'Msgbox'] },
  { label: 'Runtime Components', types: ['Image', 'AnimImage', 'Icon'] },
  {
    label: 'Interactive Assets',
    types: [
      'InteractiveButton',
      'InteractiveLight',
      'InteractiveStatusIndicator',
      'InteractiveToggleSwitch',
      'InteractiveThreePositionToggleSwitch',
    ],
  },
]

const kindForRequirement: Record<string, string> = {
  'uploaded-image': 'uploaded-image',
  'interactive-button': 'button',
  'interactive-light': 'light',
  'interactive-status-indicator': 'statusIndicator',
  'interactive-toggle': 'toggleSwitch',
  'interactive-three-position-toggle': 'threePositionToggle',
}

export const findForgeAIPromptBuilderAsset = (
  entry: ForgeAIComponentCatalogueEntry,
  assets: ForgeAIPromptBuilderAsset[],
): ForgeAIPromptBuilderAsset | undefined => {
  if (entry.assetRequirement === 'none' || entry.assetRequirement === 'icon') {
    return undefined
  }
  return assets.find(
    asset =>
      asset.kind === kindForRequirement[entry.assetRequirement] &&
      asset.exportReady,
  )
}

export const canSelectForgeAIPromptBuilderComponent = (
  entry: ForgeAIComponentCatalogueEntry,
  assets: ForgeAIPromptBuilderAsset[],
): boolean =>
  entry.assetRequirement === 'none' ||
  entry.assetRequirement === 'icon' ||
  Boolean(findForgeAIPromptBuilderAsset(entry, assets))

const componentInstruction = (
  entry: ForgeAIComponentCatalogueEntry,
  assets: ForgeAIPromptBuilderAsset[],
): string => {
  const asset = findForgeAIPromptBuilderAsset(entry, assets)
  const assetInstruction = asset
    ? ` Use ${
        entry.assetRequirement === 'uploaded-image'
          ? 'uploadedAssetId'
          : 'interactiveAssetId'
      } "${asset.id}" (${asset.name}); do not substitute or invent an ID.`
    : entry.assetRequirement === 'icon'
    ? entry.type === 'IconButton'
      ? ' Use a power action iconName from the exact RELEVANT VALID ICONS.'
      : ' Use a settings status iconName from the exact RELEVANT VALID ICONS.'
    : ''
  return `- ${entry.type}: one sensible instance. ${entry.description}${assetInstruction}`
}

export type BuildForgeAIPromptOptions = {
  dashboardType: string
  heading: string
  theme: string
  panelCount: string
  touchFriendly: boolean
  selectedTypes: ComponentType[]
  assets: ForgeAIPromptBuilderAsset[]
  kitchenSink?: boolean
}

export const buildForgeAIPromptBuilderPrompt = ({
  dashboardType,
  heading,
  theme,
  panelCount,
  touchFriendly,
  selectedTypes,
  assets,
  kitchenSink = false,
}: BuildForgeAIPromptOptions): string => {
  const selected = new Set(selectedTypes)
  const entries = forgeAIComponentCatalogue.filter(entry =>
    selected.has(entry.type),
  )
  const unavailable = entries.filter(
    entry => !canSelectForgeAIPromptBuilderComponent(entry, assets),
  )
  if (unavailable.length > 0) {
    throw new Error(
      `Missing export-ready project assets for: ${unavailable
        .map(entry => entry.type)
        .join(', ')}`,
    )
  }

  const componentSection =
    entries.length > 0
      ? entries.map(entry => componentInstruction(entry, assets)).join('\n')
      : '- No specific component types selected; choose only from the authoritative catalogue.'

  return `Create a modern ${dashboardType} for a 1024x600 ESP32-P4 display.

Screen heading: ${heading}
Visual direction: ${theme}
Summary regions: ${panelCount}
${touchFriendly ? 'Use practical touch-friendly sizing and spacing.' : ''}

REQUIRED FORGEUI COMPONENTS:
${componentSection}

COMPONENT RULES:
- Use each selected canonical component type exactly once.
- Do not omit a selected type or replace it with a visually similar type.
- Do not add unsupported component types.
- Keep every component fully inside the screen and avoid overlap.
- Use semantic ForgeUI theme roles through normal component properties.
- ${
    kitchenSink
      ? 'This is a component coverage test, not a usable interface. Arrange all selected components in a compact validation layout without treating it as a normal design example.'
      : 'Arrange the selected components in a coherent dashboard layout.'
  }
- Asset-backed components must use only the exact project asset IDs stated above.
- Never fabricate asset IDs.

Return valid ForgeUI JSON only.`
}

export const getForgeAIKitchenSinkSelection = (
  assets: ForgeAIPromptBuilderAsset[],
): {
  selectedTypes: ComponentType[]
  unavailableTypes: ComponentType[]
} => ({
  selectedTypes: forgeAIComponentCatalogue
    .filter(entry => canSelectForgeAIPromptBuilderComponent(entry, assets))
    .map(entry => entry.type),
  unavailableTypes: forgeAIComponentCatalogue
    .filter(entry => !canSelectForgeAIPromptBuilderComponent(entry, assets))
    .map(entry => entry.type),
})
