import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

type AIImageGenerationMode =
  | 'hero'
  | 'artwork'
  | 'button-normal'
  | 'button-pressed'
  | 'light-off'
  | 'light-on'
  | 'three-position-left'
  | 'three-position-center'
  | 'three-position-right'

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
    throw new Error(
      'An AI image prompt is required.',
    )
  }

  const generationResponse = await fetch(
  '/api/forgeui-ai-hero',
  {
    method: 'POST',
    headers: {
      'Content-Type':
        'application/json',
    },
    body: JSON.stringify({
      prompt: trimmedPrompt,
      mode: generationMode,
    }),
  },
)

  const generationPayload =
    (await generationResponse.json()) as
      AIImageResponse

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

  const generatedImage =
    generationPayload.image

  const imageResponse = await fetch(
    generatedImage,
  )

  if (!imageResponse.ok) {
    throw new Error(
      'Failed to prepare generated AI image.',
    )
  }

  const blob = await imageResponse.blob()

  const extension =
    blob.type === 'image/jpeg'
      ? 'jpg'
      : 'png'

  const safePrefix =
    createSafeFilePrefix(filePrefix) ||
    'ai_image'

  const fileName =
    `${safePrefix}_${Date.now()}.${extension}`

  const file = new File(
    [blob],
    fileName,
    {
      type:
        blob.type || 'image/png',
    },
  )

  const uploadedAsset =
    forgeUICreateUploadedAsset(
      file,
      generatedImage,
    )

  forgeUIAddUploadedAssets([
    uploadedAsset,
  ])

  if (
    uploadedAsset.exportStatus !==
    'pending_conversion'
  ) {
    return uploadedAsset
  }

  const conversionResponse = await fetch(
  'http://localhost:3030/convert-lvgl-image',
  {
    method: 'POST',
    headers: {
      'Content-Type':
        'application/json',
    },
    body: JSON.stringify({
      fileName:
        uploadedAsset.name,

      symbolName:
        uploadedAsset.lvgl,

      base64:
        uploadedAsset.browserSrc,

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

    exportStatus:
      'lvgl_ready',

    lvgl:
      conversionPayload.symbolName,

    cFile:
      conversionPayload.assetSource,

    browserSrc:
      conversionPayload.browserSrc ||
      uploadedAsset.browserSrc,
  }

  forgeUIUpdateUploadedAsset(
    uploadedAsset.id,
    {
      exportStatus:
        completedAsset.exportStatus,

      lvgl:
        completedAsset.lvgl,

      cFile:
        completedAsset.cFile,

      browserSrc:
        completedAsset.browserSrc,
    },
  )

  return completedAsset
}
