import React, { useState } from 'react'
import * as Chakra from '@chakra-ui/react'

const SliderPreview: React.FC<IPreviewProps> = ({
  component,
}) => {
  const [value, setValue] = useState(50)

  return (
    <Chakra.Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="0"
    >
      <Chakra.Slider
        {...component.props}
        value={value}
        min={0}
        max={100}
        onChange={setValue}
        width="100%"
      >
        <Chakra.SliderTrack>
          <Chakra.SliderFilledTrack />
        </Chakra.SliderTrack>

        <Chakra.SliderThumb />
      </Chakra.Slider>
    </Chakra.Box>
  )
}

export default SliderPreview