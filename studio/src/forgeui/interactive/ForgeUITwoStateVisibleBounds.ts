import {
  ForgeUIImageContentBounds,
  ForgeUIUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  registerAndConvertImage,
} from '~forgeui/ai/ForgeUIAIImagePipeline'

const hasContentBounds = (
  asset: ForgeUIUploadedAsset,
): asset is ForgeUIUploadedAsset & ForgeUIImageContentBounds =>
  Number.isFinite(asset.contentX) &&
  Number.isFinite(asset.contentY) &&
  Number.isFinite(asset.contentWidth) &&
  Number.isFinite(asset.contentHeight) &&
  Number(asset.contentWidth) > 0 &&
  Number(asset.contentHeight) > 0

export const getTwoStateCommonContentBounds = (
  first: ForgeUIUploadedAsset,
  second: ForgeUIUploadedAsset,
): ForgeUIImageContentBounds | undefined => {
  if (
    !hasContentBounds(first) ||
    !hasContentBounds(second) ||
    !Number.isFinite(first.width) ||
    !Number.isFinite(first.height) ||
    Number(first.width) <= 0 ||
    Number(first.height) <= 0 ||
    first.width !== second.width ||
    first.height !== second.height
  ) {
    return undefined
  }

  const left = Math.min(first.contentX, second.contentX)
  const top = Math.min(first.contentY, second.contentY)
  const right = Math.max(
    first.contentX + first.contentWidth,
    second.contentX + second.contentWidth,
  )
  const bottom = Math.max(
    first.contentY + first.contentHeight,
    second.contentY + second.contentHeight,
  )

  return {
    contentX: left,
    contentY: top,
    contentWidth: right - left,
    contentHeight: bottom - top,
  }
}

export const twoStateBoundsNeedFitting = (
  asset: ForgeUIUploadedAsset,
  bounds: ForgeUIImageContentBounds,
) =>
  bounds.contentX !== 0 ||
  bounds.contentY !== 0 ||
  bounds.contentWidth !== asset.width ||
  bounds.contentHeight !== asset.height

export const fitTwoStateGeometryToContent = ({
  componentX,
  componentY,
  componentWidth,
  componentHeight,
  sourceWidth,
  sourceHeight,
  bounds,
}: {
  componentX: number
  componentY: number
  componentWidth: number
  componentHeight: number
  sourceWidth: number
  sourceHeight: number
  bounds: ForgeUIImageContentBounds
}) => {
  const scale = Math.min(
    componentWidth / sourceWidth,
    componentHeight / sourceHeight,
  )
  const renderedWidth = sourceWidth * scale
  const renderedHeight = sourceHeight * scale

  return {
    x: componentX + (componentWidth - renderedWidth) / 2 +
      bounds.contentX * scale,
    y: componentY + (componentHeight - renderedHeight) / 2 +
      bounds.contentY * scale,
    w: bounds.contentWidth * scale,
    h: bounds.contentHeight * scale,
  }
}

const loadImage = (
  source: string,
  familyName: string,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(
      new Error(`Unable to load ${familyName} artwork for fitting.`),
    )
    image.src = source
  })

const cropToDataUrl = async (
  asset: ForgeUIUploadedAsset,
  bounds: ForgeUIImageContentBounds,
  familyName: string,
) => {
  const image = await loadImage(asset.browserSrc, familyName)
  const canvas = document.createElement('canvas')
  canvas.width = bounds.contentWidth
  canvas.height = bounds.contentHeight
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas image processing is unavailable.')
  }
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.drawImage(
    image,
    bounds.contentX,
    bounds.contentY,
    bounds.contentWidth,
    bounds.contentHeight,
    0,
    0,
    bounds.contentWidth,
    bounds.contentHeight,
  )
  return canvas.toDataURL('image/png')
}

export const cropTwoStateArtwork = async ({
  first,
  second,
  firstPrefix,
  secondPrefix,
  familyName,
  missingBoundsMessage,
  recordFullBounds = false,
}: {
  first: ForgeUIUploadedAsset
  second: ForgeUIUploadedAsset
  firstPrefix: string
  secondPrefix: string
  familyName: string
  missingBoundsMessage: string
  recordFullBounds?: boolean
}) => {
  const bounds = getTwoStateCommonContentBounds(first, second)
  if (!bounds) {
    throw new Error(missingBoundsMessage)
  }

  const [firstSource, secondSource] = await Promise.all([
    cropToDataUrl(first, bounds, familyName),
    cropToDataUrl(second, bounds, familyName),
  ])
  const stamp = Date.now()
  const [firstAsset, secondAsset] = await Promise.all([
    registerAndConvertImage({
      browserSrc: firstSource,
      filePrefix: `${firstPrefix}_${stamp}`,
      assetMode: 'interactive_button',
      width: bounds.contentWidth,
      height: bounds.contentHeight,
      recordDimensions: true,
    }),
    registerAndConvertImage({
      browserSrc: secondSource,
      filePrefix: `${secondPrefix}_${stamp}`,
      assetMode: 'interactive_button',
      width: bounds.contentWidth,
      height: bounds.contentHeight,
      recordDimensions: true,
    }),
  ])

  if (recordFullBounds) {
    for (const asset of [firstAsset, secondAsset]) {
      forgeUIUpdateUploadedAsset(asset.id, {
        contentX: 0,
        contentY: 0,
        contentWidth: bounds.contentWidth,
        contentHeight: bounds.contentHeight,
      })
    }
  }

  return { bounds, firstAsset, secondAsset }
}
