import { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'
import { validateInteractiveButtonAsset } from './ForgeUIInteractiveAssetValidation'

const assets = new Map<
  string,
  ForgeUIInteractiveButtonAsset
>()

export const registerInteractiveAsset = (
  asset: ForgeUIInteractiveButtonAsset,
): ForgeUIInteractiveButtonAsset => {
  validateInteractiveButtonAsset(asset)

  if (assets.has(asset.id)) {
    throw new Error(
      `Interactive asset already exists: ${asset.id}`,
    )
  }

  assets.set(asset.id, asset)

  return asset
}

export const getInteractiveAsset = (
  id: string,
): ForgeUIInteractiveButtonAsset | undefined =>
  assets.get(id)

export const getAllInteractiveAssets = (
): ForgeUIInteractiveButtonAsset[] =>
  Array.from(assets.values())

export const updateInteractiveAsset = (
  id: string,
  updates: Partial<
    Omit<
      ForgeUIInteractiveButtonAsset,
      'id' | 'schemaVersion' | 'kind'
    >
  >,
): ForgeUIInteractiveButtonAsset => {
  const current = assets.get(id)

  if (!current) {
    throw new Error(
      `Interactive asset not found: ${id}`,
    )
  }

  const updated: ForgeUIInteractiveButtonAsset = {
    ...current,
    ...updates,
    id: current.id,
    schemaVersion: current.schemaVersion,
    kind: current.kind,
    updatedAt: new Date().toISOString(),
  }

  validateInteractiveButtonAsset(updated)

  assets.set(id, updated)

  return updated
}

export const removeInteractiveAsset = (
  id: string,
): boolean =>
  assets.delete(id)

export const clearInteractiveAssetRegistry = (): void => {
  assets.clear()
}

/* ============================================================
 * Phase 2
 * Registry Import / Export
 * ============================================================ */

export const exportInteractiveAssets =
  (): ForgeUIInteractiveButtonAsset[] =>
    Array.from(assets.values())

export const importInteractiveAssets = (
  imported: ForgeUIInteractiveButtonAsset[],
): void => {
  assets.clear()

  imported.forEach(asset => {
    validateInteractiveButtonAsset(asset)
    assets.set(asset.id, asset)
  })
}