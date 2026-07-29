import React from 'react'
import * as Chakra from '@chakra-ui/react'
import {
  formatForgeUIStandardClockTime,
  getForgeUIStandardClockPresentation,
} from '~forgeui/ForgeUIStandardClock'

const ClockPreview = ({
  component,
  justifyContent = 'center',
}: {
  component: IComponent
  justifyContent?: 'center' | 'flex-start'
}) => {
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
      alignItems="center"
      justifyContent={justifyContent}
      color={component.props.color || '#00d4ff'}
      fontSize={`${component.props.fontSize || 32}px`}
      fontWeight="bold"
      fontFamily="monospace"
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
