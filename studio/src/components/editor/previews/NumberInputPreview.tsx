import { forgeuiInputStyle } from '~forgeui/ForgeUIControlStyle'
import React, { useState } from 'react'
import * as Chakra from '@chakra-ui/react'

interface IProps {
  component: IComponent
}

const NumberInputPreview = ({
  component,
}: IProps) => {
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
      <Chakra.NumberInput
        width="100%"
        value={value}
        min={0}
        max={100}
        onChange={(_, nextValue) =>
          setValue(nextValue || 0)
        }
        {...forgeuiInputStyle}
      >
        <Chakra.NumberInputField
          {...forgeuiInputStyle}
        />

        <Chakra.NumberInputStepper>
          <Chakra.NumberIncrementStepper />
          <Chakra.NumberDecrementStepper />
        </Chakra.NumberInputStepper>
      </Chakra.NumberInput>
    </Chakra.Box>
  )
}

export default NumberInputPreview