import {
  clearInteractiveAssetRegistry,
  getInteractiveButtonAsset,
  getInteractiveLightAsset,
  registerInteractiveAsset,
} from './ForgeUIInteractiveAssetRegistry'
import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import {
  createDefaultInteractiveLightAsset,
} from './ForgeUIInteractiveLightAsset'
import {
  FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY,
  reloadInteractiveAssets,
  saveInteractiveAssets,
} from './ForgeUIInteractiveAssetPersistence'

describe('Interactive Asset persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    clearInteractiveAssetRegistry()
  })

  it('keeps the v1 storage key and restores existing projects', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset(
        'fg_interactive_persisted',
      ),
      normalAssetId: 'normal-id',
      pressedAssetId: 'pressed-id',
    }

    registerInteractiveAsset(asset)
    saveInteractiveAssets()

    expect(FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY).toBe(
      'forgeui_interactive_assets_v1',
    )

    clearInteractiveAssetRegistry()
    reloadInteractiveAssets()

    expect(getInteractiveButtonAsset(asset.id)).toEqual(asset)
  })

  it('round-trips Button and Light assets through the existing v1 key', () => {
    const button = createDefaultInteractiveButtonAsset('button')
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      offAssetId: 'off-id',
      onAssetId: 'on-id',
      initialState: 'on' as const,
    }

    registerInteractiveAsset(button)
    registerInteractiveAsset(light)
    saveInteractiveAssets()

    clearInteractiveAssetRegistry()
    reloadInteractiveAssets()

    expect(getInteractiveButtonAsset(button.id)).toEqual(button)
    expect(getInteractiveLightAsset(light.id)).toEqual(light)
  })
})
