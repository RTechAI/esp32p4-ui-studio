import React, {
  FunctionComponent,
  ComponentClass,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'
import { useInteractive } from '~hooks/useInteractive'
import {
  Box,
  Portal,
} from '@chakra-ui/react'
import { Rnd } from 'react-rnd'
import { forgeuiPositionProps } from '~forgeui/ForgeUIPositionProps'
import useDispatch from '~hooks/useDispatch'
import { getSelectedComponentId } from '~core/selectors/components'
import {
  openButtonCreator,
  openLightCreator,
  openStatusIndicatorCreator,
  openThreePositionToggleCreator,
  openToggleCreator,
} from '~forgeui/ForgeUINavigation'

export const CANVAS_RESIZE_MIN_SIZE = 10

export type CanvasResizeMode =
  | 'legacy'
  | 'selection-border'

type CanvasResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft'

const selectionBorderResizeDirections = {
  top: true,
  right: true,
  bottom: true,
  left: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
} as const

const selectionBorderResizeHandleStyles = {
  top: {
    top: '-5px',
    left: '10px',
    right: '10px',
    height: '10px',
    cursor: 'ns-resize',
  },
  right: {
    right: '-5px',
    top: '10px',
    bottom: '10px',
    width: '10px',
    cursor: 'ew-resize',
  },
  bottom: {
    bottom: '-5px',
    left: '10px',
    right: '10px',
    height: '10px',
    cursor: 'ns-resize',
  },
  left: {
    left: '-5px',
    top: '10px',
    bottom: '10px',
    width: '10px',
    cursor: 'ew-resize',
  },
  topRight: {
    top: '-6px',
    right: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'nesw-resize',
  },
  bottomRight: {
    right: '-6px',
    bottom: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'nwse-resize',
  },
  bottomLeft: {
    bottom: '-6px',
    left: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'nesw-resize',
  },
  topLeft: {
    top: '-6px',
    left: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'nwse-resize',
  },
} as const

const selectionBorderResizeHandleComponents = Object.fromEntries(
  Object.keys(selectionBorderResizeDirections).map(direction => [
    direction,
    <Box
      key={direction}
      data-testid={`canvas-resize-zone-${direction}`}
      width="100%"
      height="100%"
      style={{ background: 'transparent' }}
    />,
  ]),
)

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
) => Math.max(minimum, Math.min(value, maximum))

export const normalizeCanvasResizeGeometryToAspectRatio = ({
  width,
  height,
  x,
  y,
  direction,
  canvasWidth,
  canvasHeight,
  minWidth,
  minHeight,
  aspectRatio,
}: {
  width: number
  height: number
  x: number
  y: number
  direction: CanvasResizeDirection
  canvasWidth: number
  canvasHeight: number
  minWidth: number
  minHeight: number
  aspectRatio: number
}) => {
  const resizesHorizontally =
    direction === 'left' ||
    direction === 'right'
  const requestedWidth = resizesHorizontally
    ? width
    : height * aspectRatio
  const right =
    direction.includes('Left') ||
    direction === 'left'
    ? clamp(x + width, 0, canvasWidth)
    : undefined
  const bottom =
    direction.includes('top') ||
    direction === 'top'
    ? clamp(y + height, 0, canvasHeight)
    : undefined
  const anchoredX = right === undefined
    ? clamp(x, 0, canvasWidth)
    : 0
  const anchoredY = bottom === undefined
    ? clamp(y, 0, canvasHeight)
    : 0
  const maxWidthFromX = right === undefined
    ? canvasWidth - anchoredX
    : right
  const maxHeightFromY = bottom === undefined
    ? canvasHeight - anchoredY
    : bottom
  const minimumWidth = Math.max(
    minWidth,
    minHeight * aspectRatio,
  )
  const maximumWidth = Math.min(
    maxWidthFromX,
    maxHeightFromY * aspectRatio,
  )
  const nextWidth = clamp(
    requestedWidth,
    Math.min(minimumWidth, maximumWidth),
    maximumWidth,
  )
  const nextHeight = nextWidth / aspectRatio

  return {
    w: nextWidth,
    h: nextHeight,
    x: right === undefined
      ? anchoredX
      : right - nextWidth,
    y: bottom === undefined
      ? anchoredY
      : bottom - nextHeight,
  }
}

export const clampCanvasResizeGeometry = ({
  width,
  height,
  x,
  y,
  direction,
  canvasWidth,
  canvasHeight,
  minWidth = CANVAS_RESIZE_MIN_SIZE,
  minHeight = CANVAS_RESIZE_MIN_SIZE,
  aspectRatio,
}: {
  width: number
  height: number
  x: number
  y: number
  direction: CanvasResizeDirection
  canvasWidth: number
  canvasHeight: number
  minWidth?: number
  minHeight?: number
  aspectRatio?: number
}) => {
  const preservesAspectRatio =
    Number.isFinite(aspectRatio) &&
    Number(aspectRatio) > 0

  if (preservesAspectRatio) {
    return normalizeCanvasResizeGeometryToAspectRatio({
      width,
      height,
      x,
      y,
      direction,
      canvasWidth,
      canvasHeight,
      minWidth,
      minHeight,
      aspectRatio: Number(aspectRatio),
    })
  }

  let nextX = x
  let nextY = y
  let nextWidth = width
  let nextHeight = height

  if (direction.includes('Left') || direction === 'left') {
    const right = clamp(x + width, minWidth, canvasWidth)
    nextX = clamp(x, 0, right - minWidth)
    nextWidth = right - nextX
  } else {
    nextX = clamp(x, 0, canvasWidth - minWidth)
    nextWidth = clamp(width, minWidth, canvasWidth - nextX)
  }

  if (direction.includes('top') || direction === 'top') {
    const bottom = clamp(y + height, minHeight, canvasHeight)
    nextY = clamp(y, 0, bottom - minHeight)
    nextHeight = bottom - nextY
  } else {
    nextY = clamp(y, 0, canvasHeight - minHeight)
    nextHeight = clamp(height, minHeight, canvasHeight - nextY)
  }

  return {
    w: nextWidth,
    h: nextHeight,
    x: nextX,
    y: nextY,
  }
}

const PreviewContainer: React.FC<{
  component: IComponent
  type?: string | FunctionComponent<any> | ComponentClass<any, any>
  children?: React.ReactNode
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
  resizeMode?: CanvasResizeMode
  resizeMinWidth?: number
  resizeMinHeight?: number
  resizeAspectRatio?: number
}> = ({
  component,
  type,
  children: customChildren,
  enableVisualHelper,
  isBoxWrapped,
  resizeMode = 'legacy',
  resizeMinWidth = CANVAS_RESIZE_MIN_SIZE,
  resizeMinHeight = CANVAS_RESIZE_MIN_SIZE,
  resizeAspectRatio,
  ...forwardedProps
}) => {
  const { props, ref } = useInteractive(component, enableVisualHelper)
  const dispatch = useDispatch()
  const selectedComponentId = useSelector(
  getSelectedComponentId,
)
  const [contextMenuPosition, setContextMenuPosition] =
    useState<{ x: number; y: number } | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!contextMenuPosition) {
      return
    }

    const dismissOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current?.contains(
          event.target as Node,
        )
      ) {
        return
      }
      setContextMenuPosition(null)
    }
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenuPosition(null)
      }
    }

    document.addEventListener(
      'mousedown',
      dismissOutside,
      true,
    )
    document.addEventListener(
      'keydown',
      dismissOnEscape,
    )
    return () => {
      document.removeEventListener(
        'mousedown',
        dismissOutside,
        true,
      )
      document.removeEventListener(
        'keydown',
        dismissOnEscape,
      )
    }
  }, [contextMenuPosition])

const isSelected =
  selectedComponentId === component.id
const usesSelectionBorderResize =
  resizeMode === 'selection-border'
const canUseSelectionBorderResize =
  usesSelectionBorderResize &&
  isSelected
const hasCreatorMenu =
  component.type === 'InteractiveToggleSwitch' ||
  component.type === 'InteractiveButton' ||
  component.type === 'InteractiveLight' ||
  component.type === 'InteractiveStatusIndicator' ||
  component.type === 'InteractiveThreePositionToggleSwitch'
const creatorPlaceholderColor =
  hasCreatorMenu
    ? isSelected
      ? '#67E8F9'
      : 'rgba(248, 250, 252, 0.9)'
    : undefined

  const childProps =
    props.positionMode === 'absolute'
      ? {
          ...props,
          ...forwardedProps,
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
        }
      : {
          ...props,
          ...forwardedProps,
          ...forgeuiPositionProps(props),
        }

  const children = customChildren ? (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="stretch"
      justifyContent="stretch"
    >
      {customChildren}
    </Box>
  ) : type ? (
    React.createElement(type, childProps)
  ) : null

  const openContextMenu = (
    event: React.MouseEvent,
  ) => {
    if (!hasCreatorMenu) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    dispatch.components.select(component.id)
    setContextMenuPosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  const contextMenu = contextMenuPosition ? (
    <Portal>
      <Box
        ref={contextMenuRef}
        role="menu"
        data-context-component-id={component.id}
        position="fixed"
        left={`${contextMenuPosition.x}px`}
        top={`${contextMenuPosition.y}px`}
        zIndex={1400}
        bg="gray.700"
        borderWidth="1px"
        borderColor="gray.500"
        borderRadius="md"
        boxShadow="lg"
        p={1}
      >
        <Box
          as="button"
          role="menuitem"
          px={3}
          py={2}
          color="white"
          fontSize="sm"
          borderRadius="sm"
          _hover={{ bg: 'gray.600' }}
          onClick={() => {
            setContextMenuPosition(null)
            const openCreator =
              component.type === 'InteractiveButton'
                ? openButtonCreator
                : component.type === 'InteractiveLight'
                  ? openLightCreator
                  : component.type === 'InteractiveStatusIndicator'
                    ? openStatusIndicatorCreator
                  : component.type ===
                    'InteractiveThreePositionToggleSwitch'
                    ? openThreePositionToggleCreator
                : openToggleCreator
            openCreator(
              component.id,
              component.props.interactiveAssetId,
            )
          }}
        >
          {component.type === 'InteractiveButton'
            ? 'Open Button Creator'
              : component.type === 'InteractiveLight'
                ? 'Open Light Creator'
                : component.type === 'InteractiveStatusIndicator'
                  ? 'Open Status Indicator Creator'
              : component.type ===
                'InteractiveThreePositionToggleSwitch'
                ? 'Open Three-Position Toggle Creator'
            : 'Open Toggle Creator'}
        </Box>
      </Box>
    </Portal>
  ) : null

  if (props.positionMode === 'absolute') {
    const updateGeometry = (
      element: HTMLElement,
      position: { x: number; y: number },
      direction: CanvasResizeDirection,
    ) => {
      const parsedWidth = parseInt(element.style.width, 10)
      const parsedHeight = parseInt(element.style.height, 10)
      let geometry = {
        w: parsedWidth,
        h: parsedHeight,
        x: position.x,
        y: position.y,
      }

      if (usesSelectionBorderResize) {
        const canvas =
          element.parentElement?.getBoundingClientRect()
        const canvasWidth =
          canvas?.width ||
          element.parentElement?.clientWidth
        const canvasHeight =
          canvas?.height ||
          element.parentElement?.clientHeight

        geometry = clampCanvasResizeGeometry({
          width: geometry.w,
          height: geometry.h,
          x: geometry.x,
          y: geometry.y,
          direction,
          canvasWidth:
            canvasWidth && canvasWidth > 0
              ? canvasWidth
              : Number.MAX_SAFE_INTEGER,
          canvasHeight:
            canvasHeight && canvasHeight > 0
              ? canvasHeight
              : Number.MAX_SAFE_INTEGER,
          minWidth: resizeMinWidth,
          minHeight: resizeMinHeight,
          aspectRatio: resizeAspectRatio,
        })
      }

      Object.entries(geometry).forEach(([name, value]) => {
        dispatch.components.updateProps({
          id: component.id,
          name,
          value: String(value),
        })
      })
    }

    return (
      <Rnd
        size={{
          width: Number(props.w ?? 240),
          height: Number(props.h ?? 120),
        }}
        position={{
          x: Number(props.x ?? 40),
          y: Number(props.y ?? 40),
        }}
        bounds="parent"
        disableDragging={true}
        enableResizing={
          usesSelectionBorderResize
            ? canUseSelectionBorderResize
              ? selectionBorderResizeDirections
              : false
            : {
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: false,
                bottomRight: false,
                bottomLeft: false,
                topLeft: false,
              }
        }
        minWidth={
          usesSelectionBorderResize
            ? resizeMinWidth
            : undefined
        }
        minHeight={
          usesSelectionBorderResize
            ? resizeMinHeight
            : undefined
        }
        lockAspectRatio={
          usesSelectionBorderResize &&
          resizeAspectRatio
            ? resizeAspectRatio
            : false
        }
        resizeHandleStyles={
          canUseSelectionBorderResize
            ? selectionBorderResizeHandleStyles
            : undefined
        }
        resizeHandleComponent={
          canUseSelectionBorderResize
            ? selectionBorderResizeHandleComponents
            : undefined
        }
       style={{
  border: canUseSelectionBorderResize
    ? '1px solid #22d3ee'
    : 'none',
  boxShadow: 'none',
  boxSizing: 'border-box',
}}
        onResizeStart={event => {
          if (usesSelectionBorderResize) {
            event.preventDefault()
            event.stopPropagation()
            setIsResizing(true)
            dispatch.components.select(component.id)
          }
        }}
        onResize={(_, __, element, ___, position) => {
          if (usesSelectionBorderResize) {
            updateGeometry(
              element,
              position,
              __ as CanvasResizeDirection,
            )
          }
        }}
        onResizeStop={(_, __, element, ___, position) => {
          updateGeometry(
            element,
            position,
            __ as CanvasResizeDirection,
          )
          if (usesSelectionBorderResize) {
            setIsResizing(false)
          }
        }}
      >
        <Box
  ref={ref}
  position="relative"
  width="100%"
  height="100%"
  overflow="visible"
  color={creatorPlaceholderColor}
  data-toggle-placeholder-tone={
    hasCreatorMenu
      ? isSelected ? 'selected' : 'neutral'
      : undefined
  }
  onClick={props.onClick}
  onDoubleClick={props.onDoubleClick}
  onMouseOver={props.onMouseOver}
  onMouseOut={props.onMouseOut}
  onContextMenu={openContextMenu}
  pointerEvents={isResizing ? 'none' : undefined}
>
  {children}
  {contextMenu}
</Box>
      </Rnd>
    )
  }

  return (
  <Box
    ref={ref}
    position="relative"
    width="100%"
    height="100%"
    overflow="visible"
    color={creatorPlaceholderColor}
    data-toggle-placeholder-tone={
      hasCreatorMenu
        ? isSelected ? 'selected' : 'neutral'
        : undefined
    }
    onClick={props.onClick}
    onDoubleClick={props.onDoubleClick}
    onMouseOver={props.onMouseOver}
    onMouseOut={props.onMouseOut}
    onContextMenu={openContextMenu}
  >
    {children}
    {contextMenu}
  </Box>
)
}

export default PreviewContainer
