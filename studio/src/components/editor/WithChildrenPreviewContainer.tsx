import React, { FunctionComponent, ComponentClass } from 'react'
import { useInteractive } from '~hooks/useInteractive'
import { useDropComponent } from '~hooks/useDropComponent'
import ComponentPreview from '~components/editor/ComponentPreview'
import { Box } from '@chakra-ui/react'
import { Rnd } from 'react-rnd'
import { forgeuiPositionProps } from '~forgeui/ForgeUIPositionProps'
import useDispatch from '~hooks/useDispatch'

const WithChildrenPreviewContainer: React.FC<{
  component: IComponent
  type: string | FunctionComponent<any> | ComponentClass<any, any>
  enableVisualHelper?: boolean
  isBoxWrapped?: boolean
}> = ({
  component,
  type,
  enableVisualHelper = false,
  isBoxWrapped,
  ...forwardedProps
}) => {
  const { drop, isOver } = useDropComponent(component.id)
  const { props, ref } = useInteractive(component, enableVisualHelper)
  const dispatch = useDispatch()

  const childProps =
    props.positionMode === 'absolute'
      ? {
          ...props,
          ...forwardedProps,
          pos: 'relative',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
        }
      : {
          ...props,
          ...forwardedProps,
          pos: 'relative',
          ...forgeuiPositionProps(props),
        }

  const children = React.createElement(
    type,
    childProps,
    component.children.map((key: string) => (
      <ComponentPreview key={key} componentName={key} />
    )),
  )

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
        enableResizing={true}
        resizeHandleStyles={{
          bottomRight: {
            width: '20px',
            height: '20px',
            right: '-10px',
            bottom: '-10px',
            background: '#38bdf8',
            border: '2px solid white',
            zIndex: 99999,
          },
        }}
        style={{
          border: enableVisualHelper ? '1px dashed #38bdf8' : 'none',
        }}
        onResizeStop={(_, __, element, ___, position) => {
          dispatch.components.updateProps({
            id: component.id,
            name: 'w',
            value: parseInt(element.style.width, 10),
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'h',
            value: parseInt(element.style.height, 10),
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'x',
            value: position.x,
          })

          dispatch.components.updateProps({
            id: component.id,
            name: 'y',
            value: position.y,
          })
        }}
      >
        <Box
          ref={drop(ref) as unknown as React.Ref<HTMLDivElement>}
          bg={isOver ? 'teal.50' : undefined}
          position="relative"
          width="100%"
          height="100%"
        >
          {children}
        </Box>
      </Rnd>
    )
  }

  return (
    <Box
      ref={drop(ref) as unknown as React.Ref<HTMLDivElement>}
      {...forgeuiPositionProps(props)}
      bg={isOver ? 'teal.50' : undefined}
      position="relative"
    >
      {children}
    </Box>
  )
}

export default WithChildrenPreviewContainer
