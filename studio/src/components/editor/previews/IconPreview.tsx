import React from 'react'
import { useDropComponent } from '~hooks/useDropComponent'
import icons from '~iconsList'
import { Box } from '@chakra-ui/react'

interface Props {
  component: IComponent
}

const IconPreview = ({ component }: Props) => {
  const { isOver } = useDropComponent(component.id)

  const { color, boxSize, icon, ...props } = component.props || {}

  if (!icon || !Object.keys(icons).includes(icon)) {
    return null
  }

  const Icon = icons[icon as keyof typeof icons]

  const iconSize =
    typeof boxSize === 'number'
      ? boxSize
      : parseInt(String(boxSize || '48'), 10) || 48

  return (
    <Box
      {...props}
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={isOver ? 'teal.50' : props.bg}
    >
      <Icon
        color={color || '#ffffff'}
        size={iconSize}
      />
    </Box>
  )
}

export default IconPreview