import { forgeUIRuntime, forgeUIServiceUrl } from './runtime/ForgeUIRuntime'

export type ForgeUIUploadedAssetExportStatus =
  | 'browser_only'
  | 'pending_conversion'
  | 'lvgl_ready'

export type ForgeUIUploadedAsset = {
  id: string
  name: string
  // User-editable label. `name` remains the original filename/stable legacy
  // identity used by asset classification and disk operations.
  displayName?: string
  type: string
  size: number

  // File only exists during the current browser session.
  // It cannot be restored from localStorage.
  file?: File

  createdAt: number
  browserSrc: string
  kind: 'uploaded'
  exportStatus: ForgeUIUploadedAssetExportStatus
  lvgl: string
  cFile: string
  width?: number
  height?: number
  contentX?: number
  contentY?: number
  contentWidth?: number
  contentHeight?: number
  hostedContentBase64?: string
}

export type ForgeUIImageDimensions = {
  width: number
  height: number
}

export type ForgeUIImageContentBounds = {
  contentX: number
  contentY: number
  contentWidth: number
  contentHeight: number
}

export const forgeUIFindAlphaContentBounds = (
  rgba: Uint8ClampedArray,
  width: number,
  height: number,
): ForgeUIImageContentBounds | undefined => {
  if (width <= 0 || height <= 0 || rgba.length < width * height * 4) {
    return undefined
  }

  let left = width
  let right = -1
  let top = height
  let bottom = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rgba[(y * width + x) * 4 + 3] === 0) {
        continue
      }
      left = Math.min(left, x)
      right = Math.max(right, x)
      top = Math.min(top, y)
      bottom = Math.max(bottom, y)
    }
  }

  return right < left || bottom < top
    ? undefined
    : {
        contentX: left,
        contentY: top,
        contentWidth: right - left + 1,
        contentHeight: bottom - top + 1,
      }
}

export const forgeUIRecordRenderedImageMetadata = (
  asset: ForgeUIUploadedAsset,
  image: HTMLImageElement,
) => {
  if (image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return
  }

  let contentBounds: ForgeUIImageContentBounds | undefined
  try {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    context?.drawImage(image, 0, 0)
    const pixels = context?.getImageData(0, 0, canvas.width, canvas.height)
    contentBounds = pixels
      ? forgeUIFindAlphaContentBounds(pixels.data, canvas.width, canvas.height)
      : undefined
  } catch {
    // Cross-origin or malformed images retain safe intrinsic bounds.
  }

  forgeUIUpdateUploadedAsset(asset.id, {
    width: image.naturalWidth,
    height: image.naturalHeight,
    ...(contentBounds || {}),
  })
}

export const forgeUIParsePngDimensions = (
  bytes: Uint8Array,
): ForgeUIImageDimensions | undefined => {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  if (
    bytes.length < 24 ||
    signature.some((value, index) => bytes[index] !== value)
  ) {
    return undefined
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const ihdrLength = view.getUint32(8)
  const ihdrType = String.fromCharCode(
    bytes[12],
    bytes[13],
    bytes[14],
    bytes[15],
  )
  if (ihdrLength !== 13 || ihdrType !== 'IHDR') {
    return undefined
  }

  const width = view.getUint32(16)
  const height = view.getUint32(20)
  if (width === 0 || height === 0) {
    return undefined
  }

  return { width, height }
}

export const forgeUIResolveUploadedAssetDimensions = (
  asset: Pick<ForgeUIUploadedAsset, 'width' | 'height' | 'browserSrc'>,
): ForgeUIImageDimensions | undefined => {
  if (
    Number.isFinite(asset.width) &&
    Number.isFinite(asset.height) &&
    Number(asset.width) > 0 &&
    Number(asset.height) > 0
  ) {
    return {
      width: Number(asset.width),
      height: Number(asset.height),
    }
  }

  const match = asset.browserSrc.match(
    /^data:image\/png;base64,([A-Za-z0-9+/=\s]+)$/i,
  )
  if (!match) {
    return undefined
  }

  try {
    const decoded = atob(match[1].replace(/\s/g, ''))
    const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0))
    return forgeUIParsePngDimensions(bytes)
  } catch {
    return undefined
  }
}

const FORGEUI_UPLOADED_ASSETS_KEY = 'forgeui_uploaded_assets_v1'

const loadPersistedAssets = (): ForgeUIUploadedAsset[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(FORGEUI_UPLOADED_ASSETS_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (asset: ForgeUIUploadedAsset) =>
          asset &&
          typeof asset.id === 'string' &&
          typeof asset.lvgl === 'string',
      )
      .map((asset: ForgeUIUploadedAsset) => {
        const persistentBrowserSrc = forgeUIRuntime.isHosted ? asset.browserSrc : forgeUIServiceUrl(`/forgeui-assets/uploads/${asset.lvgl}.png`)

        return {
          ...asset,
          browserSrc:
            !asset.browserSrc || asset.browserSrc.startsWith('blob:')
              ? persistentBrowserSrc
              : asset.browserSrc,
        }
      })
  } catch (err) {
    console.error('Failed to restore ForgeUI uploaded assets:', err)

    return []
  }
}

let forgeUIUploadedAssets: ForgeUIUploadedAsset[] = loadPersistedAssets()

const persistUploadedAssets = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const serialisableAssets = forgeUIUploadedAssets.map(
      ({ file, hostedContentBase64, ...asset }) => ({
        ...asset,

        browserSrc:
          asset.browserSrc.startsWith('data:') ||
          asset.browserSrc.startsWith('blob:')
            ? ''
            : asset.browserSrc,
      }),
    )

    window.localStorage.setItem(
      FORGEUI_UPLOADED_ASSETS_KEY,
      JSON.stringify(serialisableAssets),
    )
  } catch (err) {
    console.error('Failed to persist ForgeUI uploaded assets:', err)
  }
}

const notifyAssetsUpdated = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event('forgeui-assets-updated'))
}

const forgeUISafeAssetName = (name: string) =>
  String(name || 'asset')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'asset'

export function forgeUICreateUploadedAsset(
  file: File,
  browserSrc: string,
): ForgeUIUploadedAsset {
  const baseName = forgeUISafeAssetName(file.name)

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random()
          .toString(16)
          .slice(2)}`

  const symbol = `fg_upload_${baseName}_${id
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 8)}`

  const isConvertibleImage =
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/svg+xml' ||
    /\.(png|jpe?g|svg)$/i.test(file.name)

  const dimensions = forgeUIResolveUploadedAssetDimensions({
    browserSrc,
  })

  return {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    file,
    createdAt: Date.now(),
    browserSrc,
    kind: 'uploaded',

    exportStatus: isConvertibleImage ? 'pending_conversion' : 'browser_only',

    lvgl: symbol,
    cFile: `assets/uploads/${symbol}.c`,
    ...(dimensions || {}),
  }
}

export function forgeUIGetUploadedAssets() {
  return forgeUIUploadedAssets
}

export function forgeUIAddUploadedAssets(assets: ForgeUIUploadedAsset[]) {
  forgeUIUploadedAssets = [...forgeUIUploadedAssets, ...assets]

  persistUploadedAssets()
  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}

export async function forgeUIDeleteUploadedAsset(id: string) {
  const asset = forgeUIUploadedAssets.find(item => item.id === id)

  if (!asset) {
    return forgeUIUploadedAssets
  }

  try {
    if (forgeUIRuntime.isHosted) throw new Error('Hosted assets are browser-session scoped')
    await fetch(forgeUIServiceUrl('/delete-forgeui-asset'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: asset.id,
        name: asset.name,
        lvgl: asset.lvgl,
        cFile: asset.cFile,
        browserSrc: asset.browserSrc,
      }),
    })
  } catch (err) {
    console.error('Failed to delete ForgeUI asset from disk:', err)
  }

  if (asset.browserSrc?.startsWith('blob:')) {
    URL.revokeObjectURL(asset.browserSrc)
  }

  forgeUIUploadedAssets = forgeUIUploadedAssets.filter(item => item.id !== id)

  persistUploadedAssets()
  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}

export function forgeUIUpdateUploadedAsset(
  id: string,
  patch: Partial<
    Pick<
      ForgeUIUploadedAsset,
      | 'exportStatus'
      | 'lvgl'
      | 'cFile'
      | 'browserSrc'
      | 'width'
      | 'height'
      | 'contentX'
      | 'contentY'
      | 'contentWidth'
      | 'contentHeight'
      | 'displayName'
      | 'hostedContentBase64'
    >
  >,
  options: { preserveDimensions?: boolean } = {},
) {
  let changed = false
  forgeUIUploadedAssets = forgeUIUploadedAssets.map(asset => {
    if (asset.id !== id) {
      return asset
    }

    const browserSourceChanged =
      patch.browserSrc !== undefined && patch.browserSrc !== asset.browserSrc
    const next = {
      ...asset,
      ...(browserSourceChanged && !options.preserveDimensions
        ? {
            width: undefined,
            height: undefined,
            contentX: undefined,
            contentY: undefined,
            contentWidth: undefined,
            contentHeight: undefined,
          }
        : {}),
      ...patch,
    }
    const keys = new Set([...Object.keys(asset), ...Object.keys(next)]) as Set<
      keyof ForgeUIUploadedAsset
    >
    if ([...keys].every(key => asset[key] === next[key])) {
      return asset
    }

    changed = true
    return next
  })

  if (!changed) {
    return forgeUIUploadedAssets
  }

  persistUploadedAssets()
  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}

export function forgeUIClearUploadedAssets() {
  forgeUIUploadedAssets.forEach(asset => {
    if (asset.browserSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(asset.browserSrc)
    }
  })

  forgeUIUploadedAssets = []

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(FORGEUI_UPLOADED_ASSETS_KEY)
  }

  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}
