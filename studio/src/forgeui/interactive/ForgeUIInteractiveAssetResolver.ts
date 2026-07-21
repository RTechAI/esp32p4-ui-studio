import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'

export type ForgeUIInteractiveButtonVisuals = {
  normalAsset?: ForgeUIUploadedAsset
  pressedAsset?: ForgeUIUploadedAsset
}

export const findUploadedAssetById = (
  uploadedAssets: ForgeUIUploadedAsset[],
  id?: string,
): ForgeUIUploadedAsset | undefined =>
  id
    ? uploadedAssets.find(asset => asset.id === id)
    : undefined

export const resolveInteractiveButtonVisuals = (
  asset: ForgeUIInteractiveButtonAsset | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
): ForgeUIInteractiveButtonVisuals => ({
  normalAsset: findUploadedAssetById(
    uploadedAssets,
    asset?.normalAssetId,
  ),
  pressedAsset: findUploadedAssetById(
    uploadedAssets,
    asset?.pressedAssetId,
  ),
})

export const isLvglReadyUploadedAsset = (
  asset: ForgeUIUploadedAsset | undefined,
): asset is ForgeUIUploadedAsset =>
  asset?.exportStatus === 'lvgl_ready' &&
  Boolean(asset.lvgl)

export const getInteractiveButtonDimensions = (
  asset: ForgeUIInteractiveButtonAsset | undefined,
  fallback: { width: number; height: number },
) => ({
  width: asset?.width || fallback.width,
  height: asset?.height || fallback.height,
})

export const getInteractiveButtonComponentProps = (
  asset: ForgeUIInteractiveButtonAsset,
) => ({
  interactiveAssetId: asset.id,
  w: String(asset.width),
  h: String(asset.height),
})
