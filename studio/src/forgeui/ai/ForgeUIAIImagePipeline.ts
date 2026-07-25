import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIStateSheetProject,
} from './StateSheetOverlay'

export type AIImageGenerationMode =
  | 'hero'
  | 'artwork'
  | 'button-normal'
  | 'button-pressed'
  | 'light-off'
  | 'light-on'
  | 'three-position-left'
  | 'three-position-center'
  | 'three-position-right'
  | 'three-position-set'

type GenerateAIImageAssetOptions = {
  prompt: string
  filePrefix: string
  generationMode: AIImageGenerationMode
  assetMode:
    | 'hero'
    | 'artwork'
    | 'image'
    | 'icon'
    | 'interactive_button'
  width?: number
  height?: number
}

type AIImageResponse = {
  ok?: boolean
  image?: string
  error?: string
}

type LVGLConversionResponse = {
  ok?: boolean
  symbolName?: string
  assetSource?: string
  browserSrc?: string
  error?: string
}

const createSafeFilePrefix = (
  value: string,
) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const requestGeneratedImage = async (
  prompt: string,
  generationMode: AIImageGenerationMode,
) => {
  const generationResponse = await fetch(
    '/api/forgeui-ai-hero',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        mode: generationMode,
      }),
    },
  )

  const generationPayload =
    (await generationResponse.json()) as AIImageResponse

  if (
    !generationResponse.ok ||
    !generationPayload.ok ||
    !generationPayload.image
  ) {
    throw new Error(
      generationPayload.error ||
        'AI image generation failed.',
    )
  }

  return generationPayload.image
}

const registerAndConvertImage = async ({
  browserSrc,
  filePrefix,
  assetMode,
  width,
  height,
  recordDimensions = false,
}: Omit<
  GenerateAIImageAssetOptions,
  'prompt' | 'generationMode'
> & {
  browserSrc: string
  recordDimensions?: boolean
}): Promise<ForgeUIUploadedAsset> => {
  const imageResponse = await fetch(browserSrc)

  if (!imageResponse.ok) {
    throw new Error(
      'Failed to prepare generated AI image.',
    )
  }

  const blob = await imageResponse.blob()
  const extension =
    blob.type === 'image/jpeg' ? 'jpg' : 'png'
  const safePrefix =
    createSafeFilePrefix(filePrefix) || 'ai_image'
  const file = new File(
    [blob],
    `${safePrefix}_${Date.now()}.${extension}`,
    { type: blob.type || 'image/png' },
  )
  const uploadedAsset =
    forgeUICreateUploadedAsset(file, browserSrc)

  forgeUIAddUploadedAssets([uploadedAsset])

  if (
    uploadedAsset.exportStatus !== 'pending_conversion'
  ) {
    return uploadedAsset
  }

  const conversionResponse = await fetch(
    'http://localhost:3030/convert-lvgl-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: uploadedAsset.name,
        symbolName: uploadedAsset.lvgl,
        base64: uploadedAsset.browserSrc,
        assetMode,
        width,
        height,
      }),
    },
  )
  const conversionPayload =
    (await conversionResponse.json()) as
      LVGLConversionResponse

  if (
    !conversionResponse.ok ||
    !conversionPayload.ok ||
    !conversionPayload.symbolName ||
    !conversionPayload.assetSource
  ) {
    throw new Error(
      conversionPayload.error ||
        'LVGL conversion failed.',
    )
  }

  const completedAsset: ForgeUIUploadedAsset = {
    ...uploadedAsset,
    exportStatus: 'lvgl_ready',
    lvgl: conversionPayload.symbolName,
    cFile: conversionPayload.assetSource,
    browserSrc:
      conversionPayload.browserSrc ||
      uploadedAsset.browserSrc,
    ...(recordDimensions ? { width, height } : {}),
  }

  forgeUIUpdateUploadedAsset(uploadedAsset.id, {
    exportStatus: completedAsset.exportStatus,
    lvgl: completedAsset.lvgl,
    cFile: completedAsset.cFile,
    browserSrc: completedAsset.browserSrc,
    ...(recordDimensions ? { width, height } : {}),
  })

  return completedAsset
}

const decodePngDataUrl = (browserSrc: string) => {
  const match = /^data:image\/png;base64,([a-zA-Z0-9+/=]+)$/
    .exec(browserSrc)

  if (!match) {
    throw new Error(
      'Three-Position crop is not valid PNG data.',
    )
  }

  let binary: string
  try {
    binary = atob(match[1])
  } catch {
    throw new Error(
      'Three-Position crop contains invalid PNG encoding.',
    )
  }

  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new Blob([bytes], { type: 'image/png' })
}

const convertPreparedImage = async ({
  uploadedAsset,
  assetMode,
  width,
  height,
  recordDimensions = false,
}: {
  uploadedAsset: ForgeUIUploadedAsset
  assetMode: GenerateAIImageAssetOptions['assetMode']
  width?: number
  height?: number
  recordDimensions?: boolean
}): Promise<ForgeUIUploadedAsset> => {
  if (
    uploadedAsset.exportStatus !== 'pending_conversion'
  ) {
    return uploadedAsset
  }

  const conversionUrl =
    'http://localhost:3030/convert-lvgl-image'
  let conversionResponse: Response

  try {
    conversionResponse = await fetch(conversionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: uploadedAsset.name,
        symbolName: uploadedAsset.lvgl,
        base64: uploadedAsset.browserSrc,
        assetMode,
        width,
        height,
      }),
    })
  } catch (error) {
    throw new Error(
      `Unable to reach the ForgeUI image converter at ${conversionUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  let conversionPayload: LVGLConversionResponse
  try {
    conversionPayload =
      (await conversionResponse.json()) as
        LVGLConversionResponse
  } catch {
    throw new Error(
      `ForgeUI image converter returned an invalid response (${conversionResponse.status}).`,
    )
  }

  if (
    !conversionResponse.ok ||
    !conversionPayload.ok ||
    !conversionPayload.symbolName ||
    !conversionPayload.assetSource
  ) {
    throw new Error(
      conversionPayload.error ||
        `LVGL conversion failed (${conversionResponse.status}).`,
    )
  }

  return {
    ...uploadedAsset,
    exportStatus: 'lvgl_ready',
    lvgl: conversionPayload.symbolName,
    cFile: conversionPayload.assetSource,
    browserSrc:
      conversionPayload.browserSrc ||
      uploadedAsset.browserSrc,
    ...(recordDimensions ? { width, height } : {}),
  }
}

export const generateAIImageAsset = async ({
  prompt,
  filePrefix,
  generationMode,
  assetMode,
  width,
  height,
}: GenerateAIImageAssetOptions): Promise<
  ForgeUIUploadedAsset
> => {
  const trimmedPrompt = prompt.trim()

  if (!trimmedPrompt) {
    throw new Error('An AI image prompt is required.')
  }

  const generatedImage = await requestGeneratedImage(
    trimmedPrompt,
    generationMode,
  )

  return registerAndConvertImage({
    browserSrc: generatedImage,
    filePrefix,
    assetMode,
    width,
    height,
  })
}

const loadGeneratedImage = (
  browserSrc: string,
) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(
      'Failed to load the generated Toggle set.',
    ))
    image.src = browserSrc
  })

const cropStateRegion = async (
  image: HTMLImageElement,
  x: number,
  y: number,
  cropWidth: number,
  cropHeight: number,
) => {
  const canvas = document.createElement('canvas')
  canvas.width = cropWidth
  canvas.height = cropHeight
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error(
      'Toggle set cropping is unavailable.',
    )
  }

  context.drawImage(
    image,
    x,
    y,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  )

  const browserSrc = canvas.toDataURL('image/png')

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error(
          'Failed to crop the generated Toggle set.',
        ))
        return
      }
      resolve(browserSrc)
    }, 'image/png')
  })
}

export type ThreePositionToggleSetResult = {
  left: ForgeUIUploadedAsset
  center: ForgeUIUploadedAsset
  right: ForgeUIUploadedAsset
}

export const generateThreePositionToggleMaster =
  async ({
    prompt,
  }: {
    prompt: string
  }): Promise<string> => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      throw new Error('An AI image prompt is required.')
    }

    return requestGeneratedImage(
      trimmedPrompt,
      'three-position-set',
    )
  }

export const registerThreePositionToggleCrops =
  async ({
    masterImage,
    project,
    width,
    height,
  }: {
    masterImage: string
    project: ForgeUIStateSheetProject
    width: number
    height: number
  }): Promise<ThreePositionToggleSetResult> => {
    const image = await loadGeneratedImage(masterImage)
    const crops = await Promise.all(
      project.regions.map(region =>
        cropStateRegion(
          image,
          region.x,
          region.y,
          project.cropWidth,
          project.cropHeight,
        ),
      ),
    )
    const timestamp = Date.now()
    const labels = ['left', 'center', 'right'] as const
    const preparedAssets = crops.map((browserSrc, index) => {
      const blob = decodePngDataUrl(browserSrc)
      const file = new File(
        [blob],
        `ai_three_position_${labels[index]}_${timestamp}_${Date.now()}.png`,
        { type: 'image/png' },
      )

      return forgeUICreateUploadedAsset(file, browserSrc)
    })
    const completedAssets: ForgeUIUploadedAsset[] = []

    for (const uploadedAsset of preparedAssets) {
      completedAssets.push(await convertPreparedImage({
        uploadedAsset,
        assetMode: 'interactive_button',
        width,
        height,
        recordDimensions: true,
      }))
    }

    forgeUIAddUploadedAssets(completedAssets)
    const [left, center, right] = completedAssets

    return { left, center, right }
  }

export const generateThreePositionToggleSet =
  async ({
    prompt,
    width,
    height,
  }: {
    prompt: string
    width: number
    height: number
  }): Promise<ThreePositionToggleSetResult> => {
    const masterImage =
      await generateThreePositionToggleMaster({ prompt })
    const image = await loadGeneratedImage(masterImage)
    const cropHeight = Math.floor(image.naturalHeight / 3)

    return registerThreePositionToggleCrops({
      masterImage,
      project: {
        sourceWidth: image.naturalWidth,
        sourceHeight: image.naturalHeight,
        cropWidth: image.naturalWidth,
        cropHeight,
        regions: [
          { id: 'left', label: 'LEFT', x: 0, y: 0 },
          {
            id: 'center',
            label: 'CENTER',
            x: 0,
            y: cropHeight,
          },
          {
            id: 'right',
            label: 'RIGHT',
            x: 0,
            y: cropHeight * 2,
          },
        ],
      },
      width,
      height,
    })
  }
