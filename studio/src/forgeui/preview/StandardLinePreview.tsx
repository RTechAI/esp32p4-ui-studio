import React from 'react'

import { getForgeUIStandardLineGeometry } from '../ForgeUIStandardLine'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const StandardLinePreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const geometry = getForgeUIStandardLineGeometry(component.props)
  const parsedOpacity = Number(component.props.opacity ?? 1)
  const opacity = Number.isFinite(parsedOpacity)
    ? Math.max(0, Math.min(1, parsedOpacity))
    : 1

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${geometry.w} ${geometry.h}`}
      preserveAspectRatio="none"
      overflow="hidden"
      data-testid="standard-line-preview"
    >
      <line
        x1={geometry.startX}
        y1={geometry.startY}
        x2={geometry.endX}
        y2={geometry.endY}
        stroke={component.props.borderColor || theme.surfaceBorder}
        opacity={opacity}
        visibility={component.props.visible === false ? 'hidden' : 'visible'}
        strokeWidth={component.props.lineWidth || 3}
        data-testid="standard-line-stroke"
      />
    </svg>
  )
}

export default StandardLinePreview
