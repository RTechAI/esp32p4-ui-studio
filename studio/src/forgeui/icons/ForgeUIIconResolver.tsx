import { ICON_NAMES } from '~iconsList'

import {
  searchForgeUIIcons,
} from './ForgeUIIconSearch'

import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import { forgeUIIconNameToPngFile } from './ForgeUIIconAssetRenderer'
import { forgeUIRuntime, forgeUIServiceUrl } from '~forgeui/runtime/ForgeUIRuntime'

export type ForgeUIResolvedIcon = {
  iconName: string
  icon: string
  uploadedAssetId: string
  src: string
  assetName: string
  alt: string
  objectFit: 'contain'
  lvgl: string
  cFile: string
}

const fileToBase64 = (
  file: File,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () =>
      resolve(
        String(reader.result || ''),
      )

    reader.onerror = () =>
      reject(
        new Error(
          `Failed to read ${file.name}`,
        ),
      )

    reader.readAsDataURL(file)
  })

const iconAssetSourceExists = async (assetSource: string): Promise<boolean> => {
  try {
    if (forgeUIRuntime.isHosted) return false
    const response = await fetch(forgeUIServiceUrl('/forgeui-asset-source-exists'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetSource }),
    })
    const result = await response.json()
    return response.ok && result?.ok === true && result?.exists === true
  } catch {
    return false
  }
}

const findExistingIconAsset = async (
  iconName: string,
  width: number,
  height: number,
): Promise<ForgeUIResolvedIcon | null> => {
  const expectedName =
    `${iconName}_${width}x${height}.png`
      .toLowerCase()

  const candidates =
    forgeUIGetUploadedAssets().filter(
      item =>
        item.name.toLowerCase() ===
          expectedName &&
        item.exportStatus ===
          'lvgl_ready',
    )

  for (const asset of candidates) {
    if (!(await iconAssetSourceExists(asset.cFile))) continue
    return {
      iconName,
      icon: iconName,
      uploadedAssetId: asset.id,
      src: asset.browserSrc,
      assetName: asset.name,
      alt: asset.name,
      objectFit: 'contain',
      lvgl: asset.lvgl,
      cFile: asset.cFile,
    }
  }
  return null
}

const resolveIconRegistryName = (
  requestedName: string,
): string => {
  if (
    ICON_NAMES.includes(requestedName)
  ) {
    return requestedName
  }

  const matches =
    searchForgeUIIcons(
      requestedName,
      1,
    )

  if (matches.length === 0) {
    throw new Error(
      `Unknown ForgeUI icon: ${requestedName}`,
    )
  }

  return matches[0]
}

export const resolveForgeUIIcon = async (
  requestedName: string,
  requestedWidth = 32,
  requestedHeight = 32,
): Promise<ForgeUIResolvedIcon> => {
  const iconName =
    resolveIconRegistryName(
      requestedName,
    )

  const width = Math.max(
    1,
    Math.round(requestedWidth),
  )

  const height = Math.max(
    1,
    Math.round(requestedHeight),
  )

  const existing =
    await findExistingIconAsset(
      iconName,
      width,
      height,
    )

  if (existing) {
    return existing
  }

  const file =
    await forgeUIIconNameToPngFile(
      iconName,
      width,
      height,
    )

  const browserSrc =
    await fileToBase64(file)

  const asset =
    forgeUICreateUploadedAsset(
      file,
      browserSrc,
    )

  forgeUIAddUploadedAssets([
    asset,
  ])

  const response = await fetch(
    forgeUIServiceUrl(forgeUIRuntime.isHosted ? '/convert-image' : '/convert-lvgl-image'),
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        fileName: asset.name,
        symbolName: asset.lvgl,
        base64: asset.browserSrc,
        assetMode: 'icon',
      }),
    },
  )

  const data =
    await response.json()

  if (
    !response.ok ||
    !data.ok
  ) {
    throw new Error(
      data?.error ||
        `LVGL conversion failed for ${iconName}`,
    )
  }

  const cFile =
    data.assetSource ||
    asset.cFile

  const lvgl =
    data.symbolName ||
    asset.lvgl

  forgeUIUpdateUploadedAsset(
    asset.id,
    {
      exportStatus:
        'lvgl_ready',
      cFile,
      lvgl,
      hostedContentBase64: data.contentBase64,
    },
  )

  return {
    iconName,
    icon: iconName,
    uploadedAssetId: asset.id,
    src: asset.browserSrc,
    assetName: asset.name,
    alt: asset.name,
    objectFit: 'contain',
    lvgl,
    cFile,
  }
}

export const resolveForgeUIIconLayoutItems =
  async (
    items: any[],
  ): Promise<any[]> => {
    return Promise.all(
      items.map(async item => {
        if (
          item?.type !== 'Icon' ||
          typeof item?.props
            ?.iconName !== 'string'
        ) {
          return item
        }

        const resolved =
          await resolveForgeUIIcon(
            item.props.iconName,
            Number(
              item.props.w,
            ) || 32,
            Number(
              item.props.h,
            ) || 32,
          )

        return {
          ...item,
          props: {
            ...item.props,
            ...resolved,
          },
        }
      }),
    )
  }

export const resolveForgeUIIconProject = async (
  components: IComponents,
): Promise<IComponents> => {
  const entries = Object.entries(components)
  const resolutions = new Map<string, Promise<ForgeUIResolvedIcon>>()
  const resolved = await Promise.all(entries.map(async ([id, component]) => {
    if (
      component.type !== 'Icon' ||
      typeof component.props?.iconName !== 'string'
    ) return [id, component] as const

    const width = Number(component.props.w) || 32
    const height = Number(component.props.h) || 32
    const key = `${component.props.iconName}:${width}x${height}`
    if (!resolutions.has(key)) {
      resolutions.set(key, resolveForgeUIIcon(
        component.props.iconName,
        width,
        height,
      ))
    }
    const icon = await resolutions.get(key)!
    return [id, {
      ...component,
      props: { ...component.props, ...icon },
    }] as const
  }))
  return Object.fromEntries(resolved) as IComponents
}
