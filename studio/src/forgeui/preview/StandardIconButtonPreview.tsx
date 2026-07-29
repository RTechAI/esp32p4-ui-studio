import React from 'react'
import { IconButton } from '@chakra-ui/react'
import icons from '~iconsList'

type Props = {
  component: IComponent
  mode: 'canvas' | 'browser'
  surface?: string
  border?: string
  text?: string
}

const StandardIconButtonPreview = ({
  component,
  mode,
  surface,
  border,
  text,
}: Props) => {
  const [pressed, setPressed] = React.useState(false)
  const {
    icon: iconName,
    isDisabled,
    disabled,
    ...props
  } = component.props
  const Icon = icons[iconName as keyof typeof icons]
  const interactive = mode === 'browser'
  const unavailable = Boolean(isDisabled || disabled)

  React.useEffect(() => {
    setPressed(false)
  }, [component.id, unavailable])

  return (
    <IconButton
      {...props}
      aria-label={component.props['aria-label'] || 'Icon button'}
      icon={Icon ? <Icon path="" /> : undefined}
      isDisabled={unavailable}
      width="100%"
      height="100%"
      pointerEvents={interactive ? 'auto' : 'none'}
      tabIndex={interactive ? 0 : -1}
      bg={pressed ? border : surface}
      borderColor={border}
      color={text}
      data-testid={`standard-icon-button-${mode}`}
      data-pressed={pressed ? 'true' : 'false'}
      onPointerDown={event => {
        if (interactive && !unavailable) {
          setPressed(true)
          event.currentTarget.setPointerCapture?.(event.pointerId)
        }
      }}
      onPointerUp={event => {
        if (interactive) {
          setPressed(false)
          event.currentTarget.releasePointerCapture?.(event.pointerId)
        }
      }}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => {
        if (interactive) setPressed(false)
      }}
    />
  )
}

export default StandardIconButtonPreview
