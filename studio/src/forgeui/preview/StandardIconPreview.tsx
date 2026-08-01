import React, { useState } from 'react'
import { Box, Image } from '@chakra-ui/react'
import icons from '~iconsList'

import { getForgeUIStandardIconPresentation } from '../ForgeUIStandardIcon'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

const StandardIconPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const model = getForgeUIStandardIconPresentation(
    component.props,
    theme.textPrimary,
  )
  const Icon = icons[model.icon as keyof typeof icons]
  const [pressed, setPressed] = useState(false)
  const renderedColor = pressed ? model.pressedColor : model.color
  const renderedOpacity = pressed ? model.pressedOpacity : model.opacity
  const interactive = model.clickEnabled

  const stopEditorGesture = (event: React.PointerEvent) => {
    if (!interactive) return
    event.stopPropagation()
    setPressed(true)
  }

  const stopEditorMouseGesture = (event: React.MouseEvent) => {
    if (!interactive) return
    event.stopPropagation()
    setPressed(true)
  }

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      visibility={model.visible ? 'visible' : 'hidden'}
      opacity={renderedOpacity}
      data-testid="standard-icon-preview"
      data-click-enabled={interactive ? 'true' : 'false'}
      data-pressed={pressed ? 'true' : 'false'}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      cursor={interactive ? 'pointer' : undefined}
      onPointerDown={stopEditorGesture}
      onMouseDown={stopEditorMouseGesture}
      onPointerUp={event => {
        if (!interactive) return
        event.stopPropagation()
        setPressed(false)
      }}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={event => {
        if (!interactive) return
        event.stopPropagation()
        window.dispatchEvent(new CustomEvent('forgeui-preview-user-event', {
          detail: {
            componentId: component.id,
            componentName: component.componentName || component.id,
            event: 'Clicked',
          },
        }))
      }}
    >
      {model.src
        ? <Image src={model.src} alt="" boxSize={`${model.iconSize}px`} objectFit="contain" />
        : Icon
          ? <Icon color={renderedColor} size={model.iconSize} />
          : null}
    </Box>
  )
}

export default StandardIconPreview
