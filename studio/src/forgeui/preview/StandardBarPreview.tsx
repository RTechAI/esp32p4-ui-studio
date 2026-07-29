import React from 'react'
import { Progress } from '@chakra-ui/react'
import { getForgeUIStandardBarValues } from '~forgeui/ForgeUIStandardBar'

export const LVGL_BAR_RADIUS = '9999px'

const StandardBarPreview: React.FC<IPreviewProps> = ({ component }) => {
  const bar = getForgeUIStandardBarValues(component.props)

  return (
    <Progress
      value={bar.value}
      min={bar.minimum}
      max={bar.maximum}
      width="100%"
      height="100%"
      borderRadius={LVGL_BAR_RADIUS}
      overflow="hidden"
      sx={{
        '& > div': {
          borderRadius: LVGL_BAR_RADIUS,
        },
      }}
      pointerEvents="none"
      data-testid="standard-bar-preview"
    />
  )
}

export default StandardBarPreview
