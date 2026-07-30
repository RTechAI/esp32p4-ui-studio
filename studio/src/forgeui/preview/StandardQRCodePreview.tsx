import React, { memo, useMemo } from 'react'
import { create as createQRCode } from 'qrcode'

import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

type Props = {
  component: IComponent
  palette: ForgePreviewPalette
}

const StandardQRCodePreview: React.FC<Props> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const text = String(component.props.qrText || 'https://forgeui.co.nz')
  const foreground = String(component.props.qrForeground || theme.accent)
  const background = String(component.props.qrBackground || palette.surface)
  const quietZone = component.props.qrQuietZone !== false

  const matrix = useMemo(() => {
    return createQRCode(text, { errorCorrectionLevel: 'M' }).modules
  }, [text])

  const margin = quietZone ? 4 : 0
  const size = matrix.size + margin * 2
  let path = ''
  matrix.data.forEach((dark, index) => {
    if (!dark) return
    const x = (index % matrix.size) + margin
    const y = Math.floor(index / matrix.size) + margin
    path += `M${x} ${y}h1v1h-1z`
  })

  return (
    <svg
      data-testid="standard-qrcode-preview"
      role="img"
      aria-label={`QR Code: ${text}`}
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      width="100%"
      height="100%"
    >
      <rect width={size} height={size} fill={background} />
      <path d={path} fill={foreground} />
    </svg>
  )
}

export default memo(StandardQRCodePreview)
