import {
  clearInteractiveAssetRegistry,
  exportInteractiveAssets,
  getInteractiveButtonAsset,
  getInteractiveLightAsset,
  importInteractiveAssets,
  registerInteractiveAsset,
  updateInteractiveAsset,
  updateInteractiveAssetByKind,
} from './ForgeUIInteractiveAssetRegistry'
import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import {
  createDefaultInteractiveLightAsset,
} from './ForgeUIInteractiveLightAsset'

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

  it('stores, looks up, updates, and exports mixed asset kinds', () => {
    const button = createDefaultInteractiveButtonAsset('button')
    const light = createDefaultInteractiveLightAsset('light')

    registerInteractiveAsset(button)
    registerInteractiveAsset(light)

    const updatedLight = updateInteractiveAssetByKind(
      light.id,
      'light',
      { initialState: 'on' },
    )

    expect(getInteractiveButtonAsset(button.id)).toEqual(button)
    expect(getInteractiveLightAsset(light.id)).toEqual(updatedLight)
    expect(getInteractiveButtonAsset(light.id)).toBeUndefined()
    expect(exportInteractiveAssets()).toEqual([button, updatedLight])
  })

  it('rejects duplicate imported IDs before changing registry state', () => {
    const existing = createDefaultInteractiveButtonAsset('existing')
    const duplicateButton = createDefaultInteractiveButtonAsset('duplicate')
    const duplicateLight = {
      ...createDefaultInteractiveLightAsset('duplicate'),
      id: duplicateButton.id,
    }

    registerInteractiveAsset(existing)

    expect(() =>
      importInteractiveAssets([duplicateButton, duplicateLight]),
    ).toThrow('Duplicate Interactive asset ID: duplicate')

    expect(exportInteractiveAssets()).toEqual([existing])
  })
})
