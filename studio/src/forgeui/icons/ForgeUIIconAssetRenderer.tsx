import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import iconsList from '~iconsList'

export const forgeUIIconNameToPngFile = async (
  iconName: string,
  requestedWidth = 64,
  requestedHeight = 64,
): Promise<File> => {
  const IconComponent = iconsList[iconName as keyof typeof iconsList]
  if (!IconComponent) throw new Error(`Unknown ForgeUI icon: ${iconName}`)

  const width = Math.max(1, Math.round(requestedWidth))
  const height = Math.max(1, Math.round(requestedHeight))
  const sourceSize = Math.min(width, height)
  const svgMarkup = renderToStaticMarkup(
    <IconComponent size={sourceSize} color="white" />,
  )
  const svgUrl = URL.createObjectURL(new Blob([svgMarkup], {
    type: 'image/svg+xml',
  }))

  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error(`Failed to render icon: ${iconName}`))
      image.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering is unavailable')

    const x = (width - sourceSize) / 2
    const y = (height - sourceSize) / 2
    context.clearRect(0, 0, width, height)
    context.drawImage(image, x, y, sourceSize, sourceSize)

    const png = await new Promise<Blob | null>(resolve => {
      canvas.toBlob(resolve, 'image/png')
    })
    if (!png) throw new Error(`Failed to create PNG for ${iconName}`)
    return new File([png], `${iconName}_${width}x${height}.png`, {
      type: 'image/png',
    })
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

