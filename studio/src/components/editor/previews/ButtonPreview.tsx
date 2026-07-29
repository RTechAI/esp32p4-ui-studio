import React from 'react'
import { Button } from '@chakra-ui/react'
import icons from '~iconsList'
import { getForgeUIStandardButtonText } from '~forgeui/ForgeUIStandardButton'

interface Props {
  component: IComponent
}

const ButtonPreview = ({ component }: Props) => {
  const props = { ...component.props }
  const text = getForgeUIStandardButtonText(props)
  delete props.buttonText
  delete props.children

  if (props.leftIcon) {
    if (Object.keys(icons).includes(props.leftIcon)) {
      const Icon = icons[props.leftIcon as keyof typeof icons]
      props.leftIcon = <Icon />
    } else {
      props.leftIcon = undefined
    }
  }

  if (props.rightIcon) {
    if (Object.keys(icons).includes(props.rightIcon)) {
      const Icon = icons[props.rightIcon as keyof typeof icons]
      props.rightIcon = <Icon />
    } else {
      props.rightIcon = undefined
    }
  }

  return (
    <Button
      {...props}
      width="100%"
      height="100%"
    >
      {text}
    </Button>
  )
}

export default ButtonPreview
