import React from 'react'
import { Progress } from '@chakra-ui/react'
import { getForgeUIStandardBarValues } from '~forgeui/ForgeUIStandardBar'
import {
  FG_PREVIEW_PALETTES,
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

export const LVGL_BAR_RADIUS = '9999px'

type StandardBarPreviewProps = IPreviewProps & {
  palette?: ForgePreviewPalette
}

const StandardBarPreview: React.FC<StandardBarPreviewProps> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const bar = getForgeUIStandardBarValues(component.props)
  const theme = resolveForgeSemanticPalette(palette)

  return (
    <Progress
      value={bar.value}
      min={bar.minimum}
      max={bar.maximum}
      width="100%"
      height="100%"
      borderRadius={LVGL_BAR_RADIUS}
      overflow="hidden"
      bg={theme.surfaceSecondary}
      border={`1px solid ${theme.surfaceBorder}`}
      sx={{
        '& > div': {
          borderRadius: LVGL_BAR_RADIUS,
          background: theme.accent,
        },
      }}
      pointerEvents="none"
      data-testid="standard-bar-preview"
    />
  )
}

export default StandardBarPreview
