import React, { useCallback, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import useDispatch from '~hooks/useDispatch'
import {
  getForgeUIStandardArcValueFromPointer,
  getForgeUIStandardArcValues,
  isForgeUIStandardArcTrackHit,
} from '~forgeui/ForgeUIStandardArc'
import StandardArcPreview from '~forgeui/preview/StandardArcPreview'
import { ForgePreviewPalette } from '~forgeui/preview/forgeThemeMap'

const ArcPreview: React.FC<IPreviewProps & {
  palette?: ForgePreviewPalette
}> = ({ component, palette }) => {
  const dispatch = useDispatch()
  const arc = getForgeUIStandardArcValues(component.props)
  const activePointerId = useRef<number | null>(null)

  const updateValueFromPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect()
      const value = getForgeUIStandardArcValueFromPointer(
        component.props,
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        bounds.width,
        bounds.height,
      )

      if (value !== arc.value) {
        dispatch.components.updateProps({
          id: component.id,
          name: 'value',
          value,
        })
      }
    },
    [arc.value, component.id, component.props, dispatch.components],
  )

  return (
    <Box
      width="100%"
      height="100%"
      className="forgeui-canvas-control-interactive"
      cursor="crosshair"
      style={{ touchAction: 'none' }}
      data-testid="standard-arc-canvas-control"
      onDragStart={event => {
        if (activePointerId.current !== null) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      onPointerDown={event => {
        const bounds = event.currentTarget.getBoundingClientRect()
        if (!isForgeUIStandardArcTrackHit(
          component.props,
          event.clientX - bounds.left,
          event.clientY - bounds.top,
          bounds.width,
          bounds.height,
        )) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        activePointerId.current = event.pointerId
        dispatch.components.select(component.id)
        event.currentTarget.setPointerCapture?.(event.pointerId)
        updateValueFromPointer(event)
      }}
      onPointerMove={event => {
        if (activePointerId.current === event.pointerId) {
          event.preventDefault()
          event.stopPropagation()
          updateValueFromPointer(event)
        }
      }}
      onPointerUp={event => {
        if (activePointerId.current !== event.pointerId) return
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.releasePointerCapture?.(event.pointerId)
        activePointerId.current = null
      }}
      onPointerCancel={event => {
        if (activePointerId.current !== event.pointerId) return
        event.stopPropagation()
        event.currentTarget.releasePointerCapture?.(event.pointerId)
        activePointerId.current = null
      }}
    >
      <StandardArcPreview component={component} palette={palette} />
    </Box>
  )
}

export default ArcPreview
