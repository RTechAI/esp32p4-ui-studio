import React from 'react'
import * as Chakra from '@chakra-ui/react'

const ClockPreview = () => {
  const [time, setTime] = React.useState('')

  React.useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Chakra.Text
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="#00d4ff"
      fontSize="32px"
      fontWeight="bold"
      fontFamily="monospace"
    >
      {time}
    </Chakra.Text>
  )
}

export default ClockPreview