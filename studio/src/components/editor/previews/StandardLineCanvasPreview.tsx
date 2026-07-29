import React, { useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'

import useDispatch from '~hooks/useDispatch'
import { getSelectedComponentId } from '~core/selectors/components'
import {
  getForgeUIStandardLineGeometry,
  updateForgeUIStandardLineEndpoint,
} from '~forgeui/ForgeUIStandardLine'
import StandardLinePreview from '~forgeui/preview/StandardLinePreview'
import type { ForgePreviewPalette } from '~forgeui/preview/forgeThemeMap'

const StandardLineCanvasPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const dispatch = useDispatch()
  const selectedId = useSelector(getSelectedComponentId)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const geometry = getForgeUIStandardLineGeometry(component.props)
  const selected = selectedId === component.id

  const updateEndpoint = (
    endpoint: 'start' | 'end',
    event: React.PointerEvent,
  ) => {
    const bounds = rootRef.current?.getBoundingClientRect()
    if (!bounds) return
    const next = updateForgeUIStandardLineEndpoint(
      component.props,
      endpoint,
      {
        x: geometry.x + event.clientX - bounds.left,
        y: geometry.y + event.clientY - bounds.top,
      },
    )
    Object.entries(next).forEach(([name, value]) => {
      dispatch.components.updateProps({
        id: component.id,
        name,
        value: String(Math.round(value)),
      })
    })
  }

  const handle = (
    endpoint: 'start' | 'end',
    x: number,
    y: number,
  ) => (
    <Box
      position="absolute"
      left={`${x}px`}
      top={`${y}px`}
      width="12px"
      height="12px"
      transform="translate(-50%, -50%)"
      border="2px solid #FFFFFF"
      borderRadius="999px"
      bg={palette.accent}
      boxShadow="0 0 0 1px rgba(0,0,0,0.65)"
      cursor="crosshair"
      zIndex={2}
      style={{ touchAction: 'none' }}
      data-testid={`standard-line-${endpoint}-handle`}
      onPointerDown={event => {
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)
        updateEndpoint(endpoint, event)
      }}
      onPointerMove={event => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        event.preventDefault()
        event.stopPropagation()
        updateEndpoint(endpoint, event)
      }}
      onPointerUp={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId)
        }
        event.preventDefault()
        event.stopPropagation()
      }}
    />
  )

  return (
    <Box
      ref={rootRef}
      position="relative"
      width="100%"
      height="100%"
      overflow="visible"
      data-testid="standard-line-canvas-preview"
    >
      <StandardLinePreview component={component} palette={palette} />
      {selected && (
        <>
          {handle('start', geometry.startX, geometry.startY)}
          {handle('end', geometry.endX, geometry.endY)}
        </>
      )}
    </Box>
  )
}

export default StandardLineCanvasPreview
