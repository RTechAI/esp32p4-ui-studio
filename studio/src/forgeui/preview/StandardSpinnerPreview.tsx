import React from 'react'
import { Box } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { useForgePreviewPalette } from '../theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const finiteInteger = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
) => {
  const numeric = Number(value)
  return Math.max(
    minimum,
    Math.min(maximum, Number.isFinite(numeric) ? Math.round(numeric) : fallback),
  )
}

const StandardSpinnerPreview = ({
  duration,
  arcLength,
  arcWidth,
  backgroundWidth,
  accentColor,
  backgroundColor,
  opacity,
}: {
  duration?: unknown
  arcLength?: unknown
  arcWidth?: unknown
  backgroundWidth?: unknown
  accentColor?: string
  backgroundColor?: string
  opacity?: unknown
}) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const resolvedDuration = finiteInteger(duration, 1000, 1, 60000)
  const resolvedArcLength = finiteInteger(arcLength, 60, 1, 359)
  const resolvedArcWidth = finiteInteger(arcWidth, 8, 1, 128)
  const resolvedBackgroundWidth =
    finiteInteger(backgroundWidth, 8, 0, 128)
  const resolvedOpacity = finiteInteger(opacity, 100, 0, 100) / 100
  const gap = Math.max(1, 360 - resolvedArcLength)

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pointerEvents="none"
      data-testid="standard-spinner-preview"
      data-duration={resolvedDuration}
      data-arc-length={resolvedArcLength}
    >
      <Box
        width="100%"
        height="100%"
        maxWidth="100%"
        maxHeight="100%"
        borderRadius="50%"
        opacity={resolvedOpacity}
        border={`${resolvedBackgroundWidth}px solid ${
          backgroundColor || theme.surfaceSecondary
        }`}
        borderTop={`${resolvedArcWidth}px solid ${
          accentColor || theme.accent
        }`}
        borderRight={`${resolvedArcWidth}px solid ${
          gap < 180
            ? accentColor || theme.accent
            : backgroundColor || theme.surfaceSecondary
        }`}
        animation={`${rotate} ${resolvedDuration}ms linear infinite`}
        sx={{ '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }}
      />
    </Box>
  )
}

export default StandardSpinnerPreview
