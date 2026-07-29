import React, { useCallback, useRef } from 'react'
import * as Chakra from '@chakra-ui/react'
import { getForgeUIStandardBarValues } from '~forgeui/ForgeUIStandardBar'
import StandardBarPreview from '~forgeui/preview/StandardBarPreview'
import useDispatch from '~hooks/useDispatch'

export const getStandardBarCanvasGrabStrip = (height: unknown) => {
  const parsedHeight = Number(height)
  const renderedHeight = Number.isFinite(parsedHeight)
    ? Math.max(0, parsedHeight)
    : 24
  const desiredStrip = Math.min(
    8,
    Math.max(2, Math.round(renderedHeight * 0.2)),
  )

  return Math.min(
    desiredStrip,
    Math.max(0, (renderedHeight - 1) / 2),
  )
}

const BarPreview: React.FC<IPreviewProps> = ({ component }) => {
  const dispatch = useDispatch()
  const bar = getForgeUIStandardBarValues(component.props)
  const activePointerId = useRef<number | null>(null)
  const grabStrip = getStandardBarCanvasGrabStrip(component.props.h)

  const updateValueFromPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect()
      if (bounds.width <= 0) return

      const ratio = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      )
      const value = Math.round(
        bar.minimum + ratio * (bar.maximum - bar.minimum),
      )

      if (value !== bar.value) {
        dispatch.components.updateProps({
          id: component.id,
          name: 'value',
          value,
        })
      }
    },
    [
      bar.maximum,
      bar.minimum,
      bar.value,
      component.id,
      dispatch.components,
    ],
  )

  return (
    <Chakra.Box
      width="100%"
      height="100%"
      position="relative"
      data-testid="standard-bar-canvas-preview"
    >
      <StandardBarPreview component={component} />
      <Chakra.Box
        position="absolute"
        left="0"
        right="0"
        top={`${grabStrip}px`}
        bottom={`${grabStrip}px`}
        className="forgeui-canvas-control-interactive"
        cursor="ew-resize"
        style={{ touchAction: 'none' }}
        data-testid="standard-bar-canvas-control"
        data-bar-grab-strip={grabStrip}
        onDragStart={event => {
          if (activePointerId.current !== null) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        onPointerDown={event => {
          event.preventDefault()
          event.stopPropagation()
          activePointerId.current = event.pointerId
          dispatch.components.select(component.id)
          event.currentTarget.setPointerCapture?.(event.pointerId)
          updateValueFromPointer(event)
        }}
        onPointerMove={event => {
          if (
            activePointerId.current === event.pointerId &&
            event.currentTarget.hasPointerCapture?.(event.pointerId)
          ) {
            event.preventDefault()
            event.stopPropagation()
            updateValueFromPointer(event)
          }
        }}
        onPointerUp={event => {
          if (activePointerId.current === event.pointerId) {
            event.preventDefault()
            event.stopPropagation()
            event.currentTarget.releasePointerCapture?.(event.pointerId)
            activePointerId.current = null
          }
        }}
        onPointerCancel={event => {
          if (activePointerId.current === event.pointerId) {
            event.stopPropagation()
            event.currentTarget.releasePointerCapture?.(event.pointerId)
            activePointerId.current = null
          }
        }}
      />
    </Chakra.Box>
  )
}

export default BarPreview
