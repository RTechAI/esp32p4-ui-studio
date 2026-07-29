import React from 'react'
import { Text } from '@chakra-ui/react'

import { getForgeUIStandardTextValue } from '~forgeui/ForgeUIStandardText'

const TextPreview = ({ component }: { component: IComponent }) => {
  const props = { ...component.props }
  const text = getForgeUIStandardTextValue(props)
  delete props.textValue
  delete props.children
  delete props.text
  delete props.value

  return (
    <Text
      {...props}
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
    >
      {text}
    </Text>
  )
}

export default TextPreview
