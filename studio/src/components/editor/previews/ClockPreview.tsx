import React from 'react'
import * as Chakra from '@chakra-ui/react'
import {
  formatForgeUIStandardClockTime,
  getForgeUIStandardClockPresentation,
} from '~forgeui/ForgeUIStandardClock'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'

const ClockPreview = ({
  component,
  justifyContent = 'flex-start',
  palette,
}: {
  component: IComponent
  justifyContent?: 'center' | 'flex-start'
  palette?: ForgePreviewPalette
}) => {
  const contextPalette = useForgePreviewPalette()
  const theme = resolveForgeSemanticPalette(palette || contextPalette)
  const [now, setNow] = React.useState(() => new Date())
  const [separatorVisible, setSeparatorVisible] = React.useState(true)
  const presentation = getForgeUIStandardClockPresentation(component.props)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
      if (presentation.blinkSeparator) {
        setSeparatorVisible(visible => !visible)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [presentation.blinkSeparator])

  return (
    <Chakra.Text
      width="100%"
      height="100%"
      display="flex"
      alignItems="flex-start"
      justifyContent={justifyContent}
      overflow="hidden"
      m="0"
      p="0"
      color={theme.accent}
      fontSize="32px"
      fontWeight="normal"
      fontFamily="Montserrat, Arial, sans-serif"
      lineHeight="1"
      letterSpacing="0"
      data-testid="standard-clock-preview"
    >
      {formatForgeUIStandardClockTime(
        now,
        presentation,
        separatorVisible,
      )}
    </Chakra.Text>
  )
}

export default ClockPreview
