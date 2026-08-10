import { FORGEUI_BACKGROUND_ASSETS } from '../ForgeUIAssetRegistry'
import type { ForgeUIUploadedAsset } from '../ForgeUIUploadedAssetRegistry'

const normalizedUrlPath = (value: string) => {
  try {
    return new URL(value, 'http://forgeui.local').pathname
  } catch {
    return value.split(/[?#]/, 1)[0]
  }
}

export const resolveForgeUISelectedBackgroundAsset = (
  selectedBackground: string | null | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
) => {
  if (!selectedBackground) return undefined

  const selectedPath = normalizedUrlPath(selectedBackground)
  const selectedStem = selectedPath.split('/').pop()?.replace(/\.png$/i, '')
  const direct = uploadedAssets.find(asset =>
    asset.browserSrc === selectedBackground ||
    normalizedUrlPath(asset.browserSrc) === selectedPath ||
    asset.lvgl === selectedStem,
  )
  if (direct?.exportStatus === 'lvgl_ready') return direct

  const bundled = FORGEUI_BACKGROUND_ASSETS.find(asset =>
    asset.src === selectedBackground || normalizedUrlPath(asset.src) === selectedPath,
  )
  if (!bundled) return undefined

  const prefix = `background_${bundled.id}`
    .replace(/[^a-z0-9]+/gi, '_')
    .toLowerCase()
  return uploadedAssets.find(asset =>
    asset.exportStatus === 'lvgl_ready' &&
    asset.name.toLowerCase().startsWith(prefix),
  )
}

export const prepareForgeUISelectedBackgroundAsset = async (
  selectedBackground: string | null | undefined,
  uploadedAssets: ForgeUIUploadedAsset[],
  convert: (options: {
    browserSrc: string
    filePrefix: string
    assetMode: 'hero'
    width: number
    height: number
    recordDimensions: true
  }) => Promise<ForgeUIUploadedAsset>,
) => {
  const ready = resolveForgeUISelectedBackgroundAsset(
    selectedBackground, uploadedAssets,
  )
  if (ready || !selectedBackground) return ready

  const selectedPath = normalizedUrlPath(selectedBackground)
  const bundled = FORGEUI_BACKGROUND_ASSETS.find(asset =>
    asset.src === selectedBackground || normalizedUrlPath(asset.src) === selectedPath,
  )
  if (!bundled) return undefined

  const filePrefix = `background_${bundled.id}`
    .replace(/[^a-z0-9]+/gi, '_')
    .toLowerCase()
  return convert({
    browserSrc: bundled.src,
    filePrefix,
    assetMode: 'hero',
    width: bundled.width,
    height: bundled.height,
    recordDimensions: true,
  })
}
