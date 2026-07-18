import { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'

import {
  exportInteractiveAssets,
  importInteractiveAssets,
} from './ForgeUIInteractiveAssetRegistry'

const STORAGE_KEY =
  'forgeui_interactive_assets_v1'

export const saveInteractiveAssets =
  (): void => {
    try {
      const assets =
        exportInteractiveAssets()

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(assets),
      )
    } catch (err) {
      console.error(
        'Failed to save Interactive Assets',
        err,
      )
    }
  }

export const reloadInteractiveAssets =
  (): void => {
    try {
      const json =
        localStorage.getItem(STORAGE_KEY)

      if (!json) {
        return
      }

      const assets =
        JSON.parse(
          json,
        ) as ForgeUIInteractiveButtonAsset[]

      importInteractiveAssets(
        assets,
      )
    } catch (err) {
      console.error(
        'Failed to reload Interactive Assets',
        err,
      )
    }
  }

export const clearInteractiveAssetStorage =
  (): void => {
    localStorage.removeItem(
      STORAGE_KEY,
    )
  }