import {
  buildForgeAIPromptBuilderPrompt,
  forgeAIPromptBuilderGroups,
  getForgeAIKitchenSinkSelection,
} from './ForgeAIPromptBuilder'
import {
  forgeAIComponentCatalogue,
  forgeAIVisibleComponents,
} from './ForgeAIComponentCatalogue'

const assets = [
  { id: 'image-1', name: 'Panel image', kind: 'uploaded-image', exportReady: true },
  { id: 'button-1', name: 'Start', kind: 'button', exportReady: true },
  { id: 'light-1', name: 'Lamp', kind: 'light', exportReady: true },
  { id: 'status-1', name: 'Status', kind: 'statusIndicator', exportReady: true },
  { id: 'toggle-1', name: 'Power', kind: 'toggleSwitch', exportReady: true },
  { id: 'three-1', name: 'Mode', kind: 'threePositionToggle', exportReady: true },
]

describe('ForgeAI Prompt Builder', () => {
  it('offers every AI-supported component exactly once and no unsupported types', () => {
    const grouped = forgeAIPromptBuilderGroups.flatMap(group => group.types)
    expect(grouped).toHaveLength(forgeAIVisibleComponents.length)
    expect(new Set(grouped)).toEqual(new Set(forgeAIVisibleComponents))
  })

  it('builds an All Components Test prompt naming every canonical type', () => {
    const selection = getForgeAIKitchenSinkSelection(assets)
    expect(selection.unavailableTypes).toEqual([])
    const prompt = buildForgeAIPromptBuilderPrompt({
      dashboardType: 'component coverage dashboard',
      heading: 'All Components Test',
      theme: 'active ForgeUI semantic theme',
      panelCount: 'Categorized compact sections',
      touchFriendly: true,
      selectedTypes: selection.selectedTypes,
      assets,
      kitchenSink: true,
    })
    forgeAIComponentCatalogue.forEach(entry => {
      expect(prompt).toContain(`- ${entry.type}:`)
    })
    expect(prompt).toContain('component coverage test')
    expect(prompt).toContain('interactiveAssetId "button-1"')
    expect(prompt).toContain('uploadedAssetId "image-1"')
  })

  it('disables asset-backed types without fabricating IDs', () => {
    const selection = getForgeAIKitchenSinkSelection([])
    expect(selection.unavailableTypes).toEqual(expect.arrayContaining([
      'Image', 'AnimImage', 'InteractiveButton', 'InteractiveLight',
    ]))
    expect(selection.selectedTypes).toContain('NumberInput')
    expect(() => buildForgeAIPromptBuilderPrompt({
      dashboardType: 'dashboard',
      heading: 'Test',
      theme: 'semantic theme',
      panelCount: 'One',
      touchFriendly: true,
      selectedTypes: ['InteractiveButton'],
      assets: [],
    })).toThrow('Missing export-ready project assets')
  })
})
