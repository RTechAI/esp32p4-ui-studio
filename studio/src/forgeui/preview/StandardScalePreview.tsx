import React from 'react'
import { Box } from '@chakra-ui/react'
import {
  ForgePreviewPalette,
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'
import {
  getForgeUIStandardScaleModel,
} from '~forgeui/ForgeUIStandardScale'

const VIEWBOX_WIDTH = 240
const VIEWBOX_HEIGHT = 120
const TRACK_START_X = 20
const TRACK_END_X = VIEWBOX_WIDTH - TRACK_START_X
const TRACK_Y = 18
const MINOR_TICK_LENGTH = 9
const MAJOR_TICK_LENGTH = 16
const LABEL_Y = 52

type StandardScalePreviewProps = {
  component: IComponent
  palette?: ForgePreviewPalette
}

const StandardScalePreview: React.FC<
  StandardScalePreviewProps
> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const theme = resolveForgeSemanticPalette(palette)
  const scale = getForgeUIStandardScaleModel()
  const trackWidth = TRACK_END_X - TRACK_START_X

  return (
    <Box
      width="100%"
      height="100%"
      overflow="hidden"
      pointerEvents="none"
      data-testid="standard-scale-preview"
      data-scale-surface="transparent"
      data-scale-mode={scale.mode}
      data-scale-range={`${scale.minimum}:${scale.maximum}`}
      data-scale-total-ticks={scale.totalTickCount}
      data-scale-major-every={scale.majorTickEvery}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1={TRACK_START_X}
          y1={TRACK_Y}
          x2={TRACK_END_X}
          y2={TRACK_Y}
          stroke={theme.accent}
          strokeWidth="2"
          data-testid="standard-scale-track"
        />
        {scale.ticks.map(tick => {
          const x = TRACK_START_X +
            (tick.index / (scale.totalTickCount - 1)) * trackWidth
          const tickLength = tick.major
            ? MAJOR_TICK_LENGTH
            : MINOR_TICK_LENGTH

          return (
            <g
              key={tick.index}
              data-testid={
                tick.major
                  ? 'standard-scale-major-tick'
                  : 'standard-scale-minor-tick'
              }
            >
              <line
                x1={x}
                y1={TRACK_Y}
                x2={x}
                y2={TRACK_Y + tickLength}
                stroke={theme.accent}
                strokeWidth={tick.major ? 2 : 1}
              />
              {tick.label !== null && (
                <text
                  x={x}
                  y={LABEL_Y}
                  fill={theme.textPrimary}
                  fontSize="12"
                  fontFamily="Arial, sans-serif"
                  textAnchor="middle"
                  data-testid="standard-scale-label"
                >
                  {tick.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </Box>
  )
}

export default StandardScalePreview
