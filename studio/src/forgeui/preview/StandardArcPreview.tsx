import React from 'react'
import { Box } from '@chakra-ui/react'
import {
  FORGEUI_ARC_RADIUS,
  FORGEUI_ARC_STROKE_WIDTH,
  getForgeUIStandardArcValues,
} from '~forgeui/ForgeUIStandardArc'
import {
  FG_PREVIEW_PALETTES,
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const ARC_RADIUS = FORGEUI_ARC_RADIUS
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS

type StandardArcPreviewProps = IPreviewProps & {
  palette?: ForgePreviewPalette
}

const StandardArcPreview: React.FC<StandardArcPreviewProps> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const arc = getForgeUIStandardArcValues(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const trackLength = arc.sweepAngle / 360 * ARC_CIRCUMFERENCE
  let indicatorStart = arc.backgroundStartAngle
  let indicatorAngle = arc.sweepAngle * arc.fraction

  if (arc.mode === 'reverse') {
    indicatorAngle = arc.sweepAngle * (1 - arc.fraction)
    indicatorStart = arc.backgroundEndAngle - indicatorAngle
  } else if (arc.mode === 'symmetrical') {
    const middle = arc.backgroundStartAngle + arc.sweepAngle / 2
    const signedAngle = (arc.fraction - 0.5) * arc.sweepAngle
    indicatorStart = signedAngle < 0 ? middle + signedAngle : middle
    indicatorAngle = Math.abs(signedAngle)
  }
  const indicatorLength = indicatorAngle / 360 * ARC_CIRCUMFERENCE

  return (
    <Box
      width="100%"
      height="100%"
      pointerEvents="none"
      data-testid="standard-arc-preview"
      data-arc-value={arc.value}
      data-arc-fraction={arc.fraction}
      data-arc-start-angle={arc.backgroundStartAngle}
      data-arc-end-angle={arc.backgroundEndAngle}
      data-arc-rotation={arc.rotation}
      data-arc-mode={arc.mode}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r={ARC_RADIUS}
          fill="none"
          stroke={theme.surfaceSecondary}
          strokeWidth={FORGEUI_ARC_STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${trackLength} ${ARC_CIRCUMFERENCE}`}
          transform={`rotate(${arc.backgroundStartAngle + arc.rotation} 50 50)`}
        />
        <circle
          cx="50"
          cy="50"
          r={ARC_RADIUS}
          fill="none"
          stroke={theme.accent}
          strokeWidth={FORGEUI_ARC_STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={`${indicatorLength} ${ARC_CIRCUMFERENCE}`}
          transform={`rotate(${indicatorStart + arc.rotation} 50 50)`}
          data-testid="standard-arc-indicator"
        />
      </svg>
    </Box>
  )
}

export default StandardArcPreview
