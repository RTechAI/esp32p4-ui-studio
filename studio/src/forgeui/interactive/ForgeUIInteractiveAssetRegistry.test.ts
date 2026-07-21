import {
  clearInteractiveAssetRegistry,
  exportInteractiveAssets,
  getInteractiveButtonAsset,
  importInteractiveAssets,
  registerInteractiveAsset,
  updateInteractiveAsset,
} from './ForgeUIInteractiveAssetRegistry'
import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'

describe('Interactive Asset registry', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
  })

  it('preserves the existing button schema and update API', () => {
    const asset = createDefaultInteractiveButtonAsset(
      'fg_interactive_test',
      'Test Button',
    )

    registerInteractiveAsset(asset)
    const updated = updateInteractiveAsset(asset.id, {
      label: 'Start',
      normalAssetId: 'normal-id',
      pressedAssetId: 'pressed-id',
    })

    expect(getInteractiveButtonAsset(asset.id)).toEqual(updated)
    expect(updated).toMatchObject({
      schemaVersion: 1,
      kind: 'button',
      interactionMode: 'momentary',
      label: 'Start',
      normalAssetId: 'normal-id',
      pressedAssetId: 'pressed-id',
    })
  })

  it('does not clear valid registry state when an import is invalid', () => {
    const existing = createDefaultInteractiveButtonAsset(
      'fg_interactive_existing',
    )

    registerInteractiveAsset(existing)

    expect(() =>
      importInteractiveAssets([
        {
          ...existing,
          id: '',
        },
      ]),
    ).toThrow('Interactive asset ID is required')

    expect(exportInteractiveAssets()).toEqual([existing])
  })
})
