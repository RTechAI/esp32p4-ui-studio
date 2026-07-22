import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import type {
  ForgeUIInteractiveLightAsset,
  ForgeUIInteractiveLightState,
} from './ForgeUIInteractiveLightAsset'
import type {
  ForgeUIInteractiveStatusIndicatorAsset,
  ForgeUIInteractiveStatusIndicatorState,
} from './ForgeUIInteractiveStatusIndicatorAsset'
import type { ForgeUIInteractiveToggleSwitchAsset, ForgeUIInteractiveToggleSwitchState } from './ForgeUIInteractiveToggleSwitchAsset'
import type { ForgeUIInteractiveThreePositionToggleAsset, ForgeUIInteractiveThreePositionState } from './ForgeUIInteractiveThreePositionToggleAsset'

export type ForgeUIInteractiveButtonVisuals = {
  normalAsset?: ForgeUIUploadedAsset
  pressedAsset?: ForgeUIUploadedAsset
}

export type ForgeUIInteractiveLightVisuals = {
  offAsset?: ForgeUIUploadedAsset
  onAsset?: ForgeUIUploadedAsset
}

export type ForgeUIInteractiveStatusIndicatorVisuals = ForgeUIInteractiveLightVisuals
export type ForgeUIInteractiveToggleSwitchVisuals = ForgeUIInteractiveLightVisuals
export type ForgeUIInteractiveThreePositionVisuals = { leftAsset?: ForgeUIUploadedAsset; centerAsset?: ForgeUIUploadedAsset; rightAsset?: ForgeUIUploadedAsset }

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

export const resolveInteractiveLightVisuals = (
  asset: ForgeUIInteractiveLightAsset | ForgeUIInteractiveStatusIndicatorAsset | ForgeUIInteractiveToggleSwitchAsset | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
): ForgeUIInteractiveLightVisuals => ({
  offAsset: findUploadedAssetById(
    uploadedAssets,
    asset?.offAssetId,
  ),
  onAsset: findUploadedAssetById(
    uploadedAssets,
    asset?.onAssetId,
  ),
})

export const resolveInteractiveStatusIndicatorVisuals = (
  asset: ForgeUIInteractiveStatusIndicatorAsset | ForgeUIInteractiveLightAsset | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
): ForgeUIInteractiveStatusIndicatorVisuals => ({
  offAsset: findUploadedAssetById(uploadedAssets, asset?.offAssetId),
  onAsset: findUploadedAssetById(uploadedAssets, asset?.onAssetId),
})

export const resolveInteractiveToggleSwitchVisuals = (
  asset: ForgeUIInteractiveToggleSwitchAsset | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
): ForgeUIInteractiveToggleSwitchVisuals => resolveInteractiveLightVisuals(asset, uploadedAssets)

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

export const getInteractiveLightDimensions = (
  asset: ForgeUIInteractiveLightAsset | undefined,
  fallback: { width: number; height: number },
) => ({
  width: asset?.width || fallback.width,
  height: asset?.height || fallback.height,
})

export const getInteractiveLightComponentProps = (
  asset: ForgeUIInteractiveLightAsset,
) => ({
  interactiveAssetId: asset.id,
  w: String(asset.width),
  h: String(asset.height),
})

export const getInteractiveLightInitialState = (
  asset: ForgeUIInteractiveLightAsset | ForgeUIInteractiveStatusIndicatorAsset | undefined,
): ForgeUIInteractiveLightState =>
  asset?.initialState === 'on' ? 'on' : 'off'

export const getInteractiveStatusIndicatorDimensions = (
  asset: ForgeUIInteractiveStatusIndicatorAsset | undefined,
  fallback: { width: number; height: number },
) => ({
  width: asset?.width || fallback.width,
  height: asset?.height || fallback.height,
})

export const getInteractiveStatusIndicatorComponentProps = (
  asset: ForgeUIInteractiveStatusIndicatorAsset,
) => ({
  interactiveAssetId: asset.id,
  w: String(asset.width),
  h: String(asset.height),
})

export const getInteractiveStatusIndicatorInitialState = (
  asset: ForgeUIInteractiveStatusIndicatorAsset | ForgeUIInteractiveLightAsset | undefined,
): ForgeUIInteractiveStatusIndicatorState =>
  asset?.initialState === 'on' ? 'on' : 'off'

export const getInteractiveToggleSwitchDimensions = (
  asset: ForgeUIInteractiveToggleSwitchAsset | undefined,
  fallback: { width: number; height: number },
) => ({ width: asset?.width || fallback.width, height: asset?.height || fallback.height })

export const getInteractiveToggleSwitchComponentProps = (
  asset: ForgeUIInteractiveToggleSwitchAsset,
) => ({ interactiveAssetId: asset.id, w: String(asset.width), h: String(asset.height) })

export const getInteractiveToggleSwitchInitialState = (
  asset: ForgeUIInteractiveToggleSwitchAsset | undefined,
): ForgeUIInteractiveToggleSwitchState => asset?.initialState === 'on' ? 'on' : 'off'

export const resolveInteractiveThreePositionVisuals = (
  asset: ForgeUIInteractiveThreePositionToggleAsset | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
): ForgeUIInteractiveThreePositionVisuals => ({
  leftAsset: findUploadedAssetById(uploadedAssets, asset?.leftAssetId),
  centerAsset: findUploadedAssetById(uploadedAssets, asset?.centerAssetId),
  rightAsset: findUploadedAssetById(uploadedAssets, asset?.rightAssetId),
})

export const getInteractiveThreePositionDimensions = (asset: ForgeUIInteractiveThreePositionToggleAsset | undefined, fallback: { width: number; height: number }) =>
  ({ width: asset?.width || fallback.width, height: asset?.height || fallback.height })

export const getInteractiveThreePositionComponentProps = (asset: ForgeUIInteractiveThreePositionToggleAsset) =>
  ({ interactiveAssetId: asset.id, w: String(asset.width), h: String(asset.height) })

export const getInteractiveThreePositionInitialState = (asset: ForgeUIInteractiveThreePositionToggleAsset | undefined): ForgeUIInteractiveThreePositionState =>
  asset && ['left', 'center', 'right'].includes(asset.initialState) ? asset.initialState : 'center'
