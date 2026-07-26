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

const PreviewContainer: React.FC<{
  component: IComponent
  type?: string | FunctionComponent<any> | ComponentClass<any, any>
  children?: React.ReactNode
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
}> = ({
  component,
  type,
  children: customChildren,
  enableVisualHelper,
  isBoxWrapped,
  ...forwardedProps
}) => {
  const { props, ref } = useInteractive(component, enableVisualHelper)
  const dispatch = useDispatch()
  const selectedComponentId = useSelector(
  getSelectedComponentId,
)
  const [contextMenuPosition, setContextMenuPosition] =
    useState<{ x: number; y: number } | null>(null)
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
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
       style={{
  border: 'none',
  boxShadow: 'none',
  boxSizing: 'border-box',
}}
        onResizeStop={(_, __, element, ___, position) => {
          dispatch.components.updateProps({
            id: component.id,
            name: 'w',
            value: String(
            parseInt(element.style.width, 10),
        ),
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'h',
            value: String(
            parseInt(element.style.height, 10),
          ),
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'x',
            value: String(position.x),
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'y',
            value: String(position.y),
          })
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
