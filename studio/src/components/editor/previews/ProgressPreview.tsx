import React from 'react'
import * as Chakra from '@chakra-ui/react'

interface IProps {
  component: IComponent
}

const ProgressPreview = ({
  component,
}: IProps) => {
  return (
    <Chakra.Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="0"
    >
      <Chakra.Progress
        {...component.props}
        value={65}
        width="100%"
        borderRadius="md"
      />
    </Chakra.Box>
  )
}

export default ProgressPreview