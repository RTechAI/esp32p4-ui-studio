import React from 'react'
import { Text } from '@chakra-ui/react'

import { getForgeUIStandardHeadingText } from '~forgeui/ForgeUIStandardHeading'

const HeadingPreview = ({ component }: { component: IComponent }) => {
  const props = { ...component.props }
  const heading = getForgeUIStandardHeadingText(props)
  delete props.headingText
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
      fontSize="32px"
      fontWeight="bold"
    >
      {heading}
    </Text>
  )
}

export default HeadingPreview
