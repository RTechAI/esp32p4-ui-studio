export type ForgeUIUploadedAssetExportStatus =
  | 'browser_only'
  | 'pending_conversion'
  | 'lvgl_ready'

export type ForgeUIUploadedAsset = {
  id: string
  name: string
  type: string
  size: number
  file: File
  createdAt: number

  // Browser-side preview source only.
  // This cannot be flashed directly to ESP32-P4.
  browserSrc: string

  // Upload pipeline identity.
  kind: 'uploaded'

  // Current export state.
  // PNG assets start as pending_conversion.
  // JPG/SVG remain browser_only until conversion support is added.
  exportStatus: ForgeUIUploadedAssetExportStatus

  // Future LVGL export identity.
  // These are reserved now so the rest of Studio can scaffold around them.
  lvgl: string
  cFile: string
}

let forgeUIUploadedAssets: ForgeUIUploadedAsset[] = []

const forgeUISafeAssetName = (name: string) =>
  String(name || 'asset')
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'asset'

export function forgeUICreateUploadedAsset(file: File): ForgeUIUploadedAsset {
  const baseName = forgeUISafeAssetName(file.name)

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`

  const symbol = `fg_upload_${baseName}_${id
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 8)}`

  const isConvertibleImage =
  file.type === 'image/png' ||
  file.type === 'image/jpeg' ||
  file.type === 'image/svg+xml' ||
  /\.(png|jpe?g|svg)$/i.test(file.name)

  return {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    file,
    createdAt: Date.now(),

    browserSrc: URL.createObjectURL(file),

    kind: 'uploaded',

    exportStatus: isConvertibleImage
  ? 'pending_conversion'
  : 'browser_only',

    lvgl: symbol,

    cFile: `assets/uploads/${symbol}.c`,
  }
}

export function forgeUIGetUploadedAssets() {
  return forgeUIUploadedAssets
}

export function forgeUIAddUploadedAssets(
  assets: ForgeUIUploadedAsset[],
) {
  forgeUIUploadedAssets = [
    ...forgeUIUploadedAssets,
    ...assets,
  ]

  return forgeUIUploadedAssets
}

export function forgeUIDeleteUploadedAsset(id: string) {
  const asset = forgeUIUploadedAssets.find(a => a.id === id)

  if (asset?.browserSrc) {
    URL.revokeObjectURL(asset.browserSrc)
  }

  forgeUIUploadedAssets = forgeUIUploadedAssets.filter(
    asset => asset.id !== id,
  )

  return forgeUIUploadedAssets
}

export function forgeUIUpdateUploadedAsset(
  id: string,
  patch: Partial<Pick<ForgeUIUploadedAsset, 'exportStatus' | 'lvgl' | 'cFile'>>,
) {
  forgeUIUploadedAssets = forgeUIUploadedAssets.map((asset) =>
    asset.id === id
      ? {
          ...asset,
          ...patch,
        }
      : asset,
  )

  return forgeUIUploadedAssets
}