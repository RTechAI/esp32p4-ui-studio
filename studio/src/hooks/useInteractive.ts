import { useRef, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  getIsSelectedComponent,
  getIsHovered,
} from '../core/selectors/components'
import { getShowLayout, getFocusedComponent } from '../core/selectors/app'

export const useInteractive = (
  component: IComponent,
  enableVisualHelper = false,
  withoutComponentProps = false,
) => {
  const dispatch = useDispatch()
  const showLayout = useSelector(getShowLayout)
  const isComponentSelected = useSelector(getIsSelectedComponent(component.id))
  const isHovered = useSelector(getIsHovered(component.id))
  const focusInput = useSelector(getFocusedComponent(component.id))

  const [, drag] = useDrag({
    item: {
      id: component.id,
      type: component.type,
      isMoved: true,
      positionMode: component.props?.positionMode,
      x: component.props?.x,
      y: component.props?.y,
      w: component.props?.w,
      h: component.props?.h,
    },
  })

  const ref = useRef<HTMLDivElement>(null)

  let props = {
    ...(withoutComponentProps ? {} : component.props),
    onMouseOver: (event: MouseEvent) => {
      event.stopPropagation()
      dispatch.components.hover(component.id)
    },
    onMouseOut: () => {
      dispatch.components.unhover()
    },
    onClick: (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      dispatch.components.select(component.id)
    },
    onDoubleClick: (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (focusInput === false) {
        dispatch.app.toggleInputText()
      }
    },
  }

  if (showLayout && enableVisualHelper) {
    props = {
      ...props,
      border: `1px dashed #718096`,
      padding: props.p || props.padding ? props.p || props.padding : 4,
    }
  }

  if (isComponentSelected) {
  props = {
    ...props,
    boxShadow: `${
      focusInput ? '#ffc4c7' : '#22d3ee'
    } 0px 0px 0px 3px inset`,
  }
} else if (isHovered) {
  props = {
    ...props,
    boxShadow:
      '#facc15 0px 0px 0px 1px inset',
  }
}

  drag(ref)

return { props, ref, drag }
}