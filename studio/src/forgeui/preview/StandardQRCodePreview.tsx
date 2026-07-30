import React, { memo, useMemo } from 'react'
import { create as createQRCode } from 'qrcode'

import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'
import {
  FORGEUI_QR_ERROR_CORRECTION,
  getForgeUIQRCodeGeometry,
  resolveQRCodePayload,
} from '../ForgeUIStandardQRCode'

type Props = {
  component: IComponent
  palette: ForgePreviewPalette
}

const StandardQRCodePreview: React.FC<Props> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const text = resolveQRCodePayload(component.props)
  const foreground = String(component.props.qrForeground || theme.accent)
  const background = String(component.props.qrBackground || palette.surface)

  const matrix = useMemo(() => {
    if (!text) return null
    return createQRCode(text, {
      errorCorrectionLevel: FORGEUI_QR_ERROR_CORRECTION,
    }).modules
  }, [text])

  const {
    size,
    moduleSize = 1,
    moduleOffset = 0,
  } = getForgeUIQRCodeGeometry(
    component.props.w,
    component.props.h,
    matrix?.size,
  )
  const matrixSize = matrix?.size || 1
  let path = ''
  matrix?.data.forEach((dark, index) => {
    if (!dark) return
    const x = (index % matrixSize) * moduleSize + moduleOffset
    const y = Math.floor(index / matrixSize) * moduleSize + moduleOffset
    path += `M${x} ${y}h${moduleSize}v${moduleSize}h-${moduleSize}z`
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
