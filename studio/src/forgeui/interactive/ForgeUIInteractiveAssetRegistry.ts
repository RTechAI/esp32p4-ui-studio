import type {
  ForgeUIInteractiveAsset,
  ForgeUIInteractiveAssetKind,
  ForgeUIInteractiveAssetOfKind,
} from './ForgeUIInteractiveAsset'
import type { ForgeUIInteractiveButtonAsset } from './ForgeUIInteractiveButtonAsset'
import { validateInteractiveAsset } from './ForgeUIInteractiveAssetValidation'

// The registry owns the in-memory lifetime of all Interactive Asset kinds.
const assets = new Map<
  string,
  ForgeUIInteractiveAsset
>()

export const registerInteractiveAsset = (
  asset: ForgeUIInteractiveAsset,
): ForgeUIInteractiveAsset => {
  validateInteractiveAsset(asset)

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
): ForgeUIInteractiveAsset | undefined =>
  assets.get(id)

export const getInteractiveAssetByKind = <
  Kind extends ForgeUIInteractiveAssetKind,
>(
  id: string,
  kind: Kind,
): ForgeUIInteractiveAssetOfKind<Kind> | undefined => {
  const asset = assets.get(id)

  return asset?.kind === kind
    ? asset as ForgeUIInteractiveAssetOfKind<Kind>
    : undefined
}

export const getInteractiveButtonAsset = (
  id: string,
): ForgeUIInteractiveButtonAsset | undefined =>
  getInteractiveAssetByKind(id, 'button')

export const getAllInteractiveAssets = (
): ForgeUIInteractiveAsset[] =>
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

  validateInteractiveAsset(updated)

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
  (): ForgeUIInteractiveAsset[] =>
    Array.from(assets.values())

export const importInteractiveAssets = (
  imported: ForgeUIInteractiveAsset[],
): void => {
  imported.forEach(asset => {
    validateInteractiveAsset(asset)
  })

  assets.clear()

  imported.forEach(asset => {
    assets.set(asset.id, asset)
  })
}
