import { FORGEUI_IMAGE_ASSETS } from './ForgeUIAssetRegistry'
import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from './ForgeUIUploadedAssetRegistry'

export type ForgeUIStandardImageFit = 'contain' | 'cover' | 'native'

export type ForgeUIStandardImagePresentation = {
  src: string
  fit: ForgeUIStandardImageFit
  sourceWidth?: number
  sourceHeight?: number
  componentWidth: number
  componentHeight: number
  lvglScale: number
  targetWidth?: number
  targetHeight?: number
  opacity: number
  visible: boolean
}

const positiveNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

export const normalizeForgeUIStandardImageFit = (
  value: unknown,
): ForgeUIStandardImageFit =>
  value === 'cover' || value === 'native' ? value : 'contain'

export const resolveForgeUIStandardImageAsset = (component: IComponent) => {
  const src = String(component.props.src || component.props.browserSrc || '')
  const uploadedAssets = forgeUIGetUploadedAssets()
  const selected = uploadedAssets.find(asset =>
    asset.id === component.props.uploadedAssetId,
  )
  const preset = FORGEUI_IMAGE_ASSETS.find(asset => asset.src === src)
  const matched = uploadedAssets.find(asset =>
    asset.browserSrc === src ||
    asset.name === component.props.assetName ||
    asset.name === component.props.alt,
  )
  return selected || preset || matched
}

export const getForgeUIStandardImagePresentation = (
  component: IComponent,
): ForgeUIStandardImagePresentation => {
  const asset = resolveForgeUIStandardImageAsset(component)
  const assetRecord: any = asset
  const dimensions = assetRecord
    ? forgeUIResolveUploadedAssetDimensions({
        width: assetRecord.width,
        height: assetRecord.height,
        browserSrc: assetRecord.browserSrc || assetRecord.src || '',
      })
    : undefined
  const sourceWidth = dimensions?.width ||
    positiveNumber(component.props.sourceWidth)
  const sourceHeight = dimensions?.height ||
    positiveNumber(component.props.sourceHeight)
  const componentWidth = positiveNumber(component.props.w) || 240
  const componentHeight = positiveNumber(component.props.h) || 160
  const fit = normalizeForgeUIStandardImageFit(
    component.props.imageFit || component.props.objectFit,
  )
  const legacyScale = positiveNumber(component.props.imageScale) || 256
  const scaleFactor = sourceWidth && sourceHeight
    ? fit === 'contain'
      ? Math.min(componentWidth / sourceWidth, componentHeight / sourceHeight)
      : fit === 'cover'
        ? Math.max(componentWidth / sourceWidth, componentHeight / sourceHeight)
        : 1
    : legacyScale / 256
  const lvglScale = Math.max(1, Math.round(scaleFactor * 256))
  const parsedOpacity = Number(component.props.opacity ?? 1)

  return {
    src: String(component.props.src || assetRecord?.browserSrc || assetRecord?.src || ''),
    fit,
    sourceWidth,
    sourceHeight,
    componentWidth,
    componentHeight,
    lvglScale,
    targetWidth: sourceWidth
      ? Math.round(sourceWidth * lvglScale / 256)
      : undefined,
    targetHeight: sourceHeight
      ? Math.round(sourceHeight * lvglScale / 256)
      : undefined,
    opacity: Number.isFinite(parsedOpacity)
      ? Math.max(0, Math.min(1, parsedOpacity))
      : 1,
    visible: component.props.visible !== false,
  }
}
