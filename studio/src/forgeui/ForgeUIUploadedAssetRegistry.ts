export type ForgeUIUploadedAssetExportStatus =
  | 'browser_only'
  | 'pending_conversion'
  | 'lvgl_ready'

export type ForgeUIUploadedAsset = {
  id: string
  name: string
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
}

const FORGEUI_UPLOADED_ASSETS_KEY =
  'forgeui_uploaded_assets_v1'

const loadPersistedAssets = (): ForgeUIUploadedAsset[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(
      FORGEUI_UPLOADED_ASSETS_KEY,
    )

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
        const persistentBrowserSrc =
          `http://localhost:3030/forgeui-assets/uploads/${asset.lvgl}.png`

        return {
          ...asset,
          browserSrc:
            !asset.browserSrc ||
            asset.browserSrc.startsWith('blob:')
              ? persistentBrowserSrc
              : asset.browserSrc,
        }
      })
  } catch (err) {
    console.error(
      'Failed to restore ForgeUI uploaded assets:',
      err,
    )

    return []
  }
}

let forgeUIUploadedAssets: ForgeUIUploadedAsset[] =
  loadPersistedAssets()

const persistUploadedAssets = () => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const serialisableAssets =
      forgeUIUploadedAssets.map(({ file, ...asset }) => ({
        ...asset,

        browserSrc:
          asset.browserSrc.startsWith('data:') ||
          asset.browserSrc.startsWith('blob:')
            ? ''
            : asset.browserSrc,
      }))

    window.localStorage.setItem(
      FORGEUI_UPLOADED_ASSETS_KEY,
      JSON.stringify(serialisableAssets),
    )
  } catch (err) {
    console.error(
      'Failed to persist ForgeUI uploaded assets:',
      err,
    )
  }
}

const notifyAssetsUpdated = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new Event('forgeui-assets-updated'),
  )
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
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
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

  return {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    file,
    createdAt: Date.now(),
    browserSrc,
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

  persistUploadedAssets()
  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}

export async function forgeUIDeleteUploadedAsset(
  id: string,
) {
  const asset = forgeUIUploadedAssets.find(
    item => item.id === id,
  )

  if (!asset) {
    return forgeUIUploadedAssets
  }

  try {
    await fetch(
      'http://localhost:3030/delete-forgeui-asset',
      {
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
      },
    )
  } catch (err) {
    console.error(
      'Failed to delete ForgeUI asset from disk:',
      err,
    )
  }

  if (asset.browserSrc?.startsWith('blob:')) {
    URL.revokeObjectURL(asset.browserSrc)
  }

  forgeUIUploadedAssets =
    forgeUIUploadedAssets.filter(
      item => item.id !== id,
    )

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
    >
  >,
) {
  forgeUIUploadedAssets =
    forgeUIUploadedAssets.map(asset =>
      asset.id === id
        ? {
            ...asset,
            ...patch,
          }
        : asset,
    )

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
    window.localStorage.removeItem(
      FORGEUI_UPLOADED_ASSETS_KEY,
    )
  }

  notifyAssetsUpdated()

  return forgeUIUploadedAssets
}
