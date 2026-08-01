import React from 'react'

import iconsList from '~iconsList'
import { getForgeUIStandardIconPresentation } from '../ForgeUIStandardIcon'

export const ForgeUIIconGlyph: React.FC<{
  iconName: string
  width: number
  height: number
  color?: string
}> = ({ iconName, width, height, color = 'currentColor' }) => {
  const Icon = iconsList[iconName as keyof typeof iconsList]
  if (!Icon) return null
  const model = getForgeUIStandardIconPresentation(
    { icon: iconName, w: width, h: height },
    color,
  )
  return <Icon color={model.color} size={model.iconSize} />
}

