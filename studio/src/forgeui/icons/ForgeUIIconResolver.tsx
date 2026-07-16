import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import iconsList, {
  ICON_NAMES,
} from '~forgeui/iconsList'

import {
  searchForgeUIIcons,
} from './ForgeUIIconSearch'


import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

export type ForgeUIResolvedIcon = {
  iconName: string
  uploadedAssetId: string
  src: string
  assetName: string
  lvgl: string
  cFile: string
}

const iconNameToPngFile = async (
  iconName: string,
): Promise<File> => {
  const IconComponent =
    iconsList[
      iconName as keyof typeof iconsList
    ]

  if (!IconComponent) {
    throw new Error(
      `Unknown ForgeUI icon: ${iconName}`,
    )
  }

  const svgMarkup = renderToStaticMarkup(
    <IconComponent
      size={64}
      color="white"
    />,
  )

  const svgBlob = new Blob(
    [svgMarkup],
    {
      type: 'image/svg+xml',
    },
  )

  const svgUrl =
    URL.createObjectURL(svgBlob)

  try {
    const image = new Image()

    await new Promise<void>(
      (resolve, reject) => {
        image.onload = () => resolve()
        image.onerror = () =>
          reject(
            new Error(
              `Failed to render icon: ${iconName}`,
            ),
          )

        image.src = svgUrl
      },
    )

    const canvas =
      document.createElement('canvas')

    canvas.width = 64
    canvas.height = 64

    const ctx =
      canvas.getContext('2d')

    if (!ctx) {
      throw new Error(
        'Canvas rendering is unavailable',
      )
    }

    ctx.clearRect(0, 0, 64, 64)
    ctx.drawImage(image, 0, 0, 64, 64)

    const pngBlob =
      await new Promise<Blob | null>(
        resolve => {
          canvas.toBlob(
            resolve,
            'image/png',
          )
        },
      )

    if (!pngBlob) {
      throw new Error(
        `Failed to create PNG for ${iconName}`,
      )
    }

    return new File(
      [pngBlob],
      `${iconName}.png`,
      {
        type: 'image/png',
      },
    )
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
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

const findExistingIconAsset = (
  iconName: string,
): ForgeUIResolvedIcon | null => {
  const expectedName =
    `${iconName}.png`.toLowerCase()

  const asset =
    forgeUIGetUploadedAssets().find(
      item =>
        item.name.toLowerCase() ===
          expectedName &&
        item.exportStatus ===
          'lvgl_ready',
    )

  if (!asset) {
    return null
  }

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

const resolveIconRegistryName = (
  requestedName: string,
): string => {
  if (ICON_NAMES.includes(requestedName)) {
    return requestedName
  }

  const matches = searchForgeUIIcons(
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
): Promise<ForgeUIResolvedIcon> => {
  const iconName =
    resolveIconRegistryName(
      requestedName,
    )

  const existing =
    findExistingIconAsset(iconName)

  if (existing) {
    return existing
  }

  const file =
    await iconNameToPngFile(iconName)

  const browserSrc =
    await fileToBase64(file)

  const asset =
    forgeUICreateUploadedAsset(
      file,
      browserSrc,
    )

  forgeUIAddUploadedAssets([asset])

  const response = await fetch(
  'http://localhost:3030/convert-lvgl-image',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: asset.name,
      symbolName: asset.lvgl,
      base64: asset.browserSrc,

      // NEW
      assetMode: 'icon',
    }),
  },
)

  const data = await response.json()

  if (!response.ok || !data.ok) {
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
      exportStatus: 'lvgl_ready',
      cFile,
      lvgl,
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
          typeof item?.props?.iconName !==
            'string'
        ) {
          return item
        }

        const resolved =
          await resolveForgeUIIcon(
            item.props.iconName,
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