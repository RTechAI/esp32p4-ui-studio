import type { ForgeUIInteractiveAsset } from './ForgeUIInteractiveAsset'

import {
  exportInteractiveAssets,
  importInteractiveAssets,
} from './ForgeUIInteractiveAssetRegistry'

export const FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY =
  'forgeui_interactive_assets_v1'

export const saveInteractiveAssets =
  (): void => {
    try {
      const assets =
        exportInteractiveAssets()

      localStorage.setItem(
        FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY,
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
        localStorage.getItem(
          FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY,
        )

      if (!json) {
        return
      }

      const assets =
        JSON.parse(
          json,
        ) as ForgeUIInteractiveAsset[]

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
      FORGEUI_INTERACTIVE_ASSETS_STORAGE_KEY,
    )
  }
