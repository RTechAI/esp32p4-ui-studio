import React from 'react'
import icons from '~iconsList'
import { IconButton } from '@chakra-ui/react'

interface Props {
  component: IComponent
}

const IconButtonPreview = ({ component }: Props) => {
  const { icon = undefined, ...props } = { ...component.props }

  if (icon && Object.keys(icons).includes(icon)) {
    const Icon = icons[icon as keyof typeof icons]

    return (
      <IconButton
        icon={<Icon path="" />}
        {...props}
        width="100%"
        height="100%"
      />
    )
  }

  return (
    <IconButton
      aria-label="Icon button"
      {...props}
      width="100%"
      height="100%"
    />
  )
}

export default IconButtonPreview
