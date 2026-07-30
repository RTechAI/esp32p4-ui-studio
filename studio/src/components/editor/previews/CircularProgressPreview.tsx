import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'
import { resolveForgeSemanticPalette } from '~forgeui/preview/forgeThemeMap'

interface IProps {
  component: IComponent
}

const CircularProgressPreview = ({ component }: IProps) => {
  const theme = resolveForgeSemanticPalette(useForgePreviewPalette())
  const value = Number(component.props.value ?? 60)
  const minimum = Number(component.props.min ?? 0)
  const maximum = Number(component.props.max ?? 100)

  return (
    <Chakra.Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Chakra.CircularProgress
        value={value}
        min={minimum}
        max={maximum}
        size="100%"
        thickness="10px"
        color={theme.accent}
        trackColor={theme.surfaceSecondary}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={minimum}
        aria-valuemax={maximum}
        data-testid="standard-circular-progress"
      />
    </Chakra.Box>
  )
}

export default CircularProgressPreview
