import { RefObject } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { rootComponents } from '~utils/editor'
import useDispatch from './useDispatch'
import builder from '~core/models/composer/builder'
import {
  getForgeUIWidgetDefinition,
} from '~forgeui/widgets/ForgeUIWidgetRegistry'

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

export const getFreeformMovedPosition = ({
  x,
  y,
  deltaX,
  deltaY,
  width,
  height,
  viewportWidth,
  viewportHeight,
}: {
  x: number
  y: number
  deltaX: number
  deltaY: number
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
}) => ({
  x: clamp(x + deltaX, 0, viewportWidth - width),
  y: clamp(y + deltaY, 0, viewportHeight - height),
})

export const getFreeformDropPosition = ({
  pointerX,
  pointerY,
  width,
  height,
  viewportWidth,
  viewportHeight,
}: {
  pointerX: number
  pointerY: number
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
}) => ({
  x: clamp(pointerX - width / 2, 0, viewportWidth - width),
  y: clamp(pointerY - height / 2, 0, viewportHeight - height),
})

export const INTERACTIVE_STATUS_INDICATOR_DROP_SIZE = {
  width: 120,
  height: 72,
} as const

export const getInteractiveStatusIndicatorDropSize = () =>
  INTERACTIVE_STATUS_INDICATOR_DROP_SIZE

export const getInteractiveButtonDropSize = () => ({
  width: 200,
  height: 100,
})

export const getInteractiveLightDropSize = () => ({
  width: 32,
  height: 32,
})

export const useDropComponent = (
  componentId: string,
  accept: (ComponentType | MetaComponentType)[] = rootComponents,
  canDrop: boolean = true,
  viewportRef?: RefObject<HTMLDivElement | null>,
) => {
  const dispatch = useDispatch()

  const [{ isOver }, drop] = useDrop({
    accept,

    collect: monitor => ({
      isOver:
        monitor.isOver({ shallow: true }) &&
        monitor.canDrop(),
    }),

    drop: (
      item: ComponentItemProps,
      monitor: DropTargetMonitor,
    ) => {
      if (!monitor.isOver()) {
        return
      }

      const clientOffset =
        monitor.getClientOffset()

      const viewportRect =
        viewportRef?.current?.getBoundingClientRect()

      if (!clientOffset || !viewportRect) {
        return
      }

      if (item.isMoved) {
        const w = Number(item.w ?? 240)
        const h = Number(item.h ?? 120)
        const delta = monitor.getDifferenceFromInitialOffset()

        if (!delta) {
          return
        }

        const { x, y } = getFreeformMovedPosition({
          x: Number(item.x ?? 0),
          y: Number(item.y ?? 0),
          deltaX: delta.x,
          deltaY: delta.y,
          width: w,
          height: h,
          viewportWidth: viewportRect.width,
          viewportHeight: viewportRect.height,
        })

        dispatch.components.updateProps({
          id: item.id,
          name: 'x',
          value: String(x),
        })

        dispatch.components.updateProps({
          id: item.id,
          name: 'y',
          value: String(y),
        })

        return
      }

      if (item.isMeta) {
        dispatch.components.addMetaComponent(
          builder[item.type](componentId),
        )

        return
      }

      const definition = getForgeUIWidgetDefinition(item.type)
      const defaultW = Number(
        item.defaultWidth ?? definition?.defaultWidth ?? 240,
      )
      const defaultH = Number(
        item.defaultHeight ?? definition?.defaultHeight ?? 120,
      )

      const { x, y } = getFreeformDropPosition({
        pointerX: clientOffset.x - viewportRect.left,
        pointerY: clientOffset.y - viewportRect.top,
        width: defaultW,
        height: defaultH,
        viewportWidth: viewportRect.width,
        viewportHeight: viewportRect.height,
      })

      dispatch.components.addComponent({
        parentName: componentId,
        type: item.type,
        rootParentType: item.rootParentType,
        props: {
          ...(definition?.insertionFactory(x, y) || {
            positionMode: 'absolute',
            x, y, w: defaultW, h: defaultH,
          }),
          ...(item.insertionProps || {}),
          positionMode: 'absolute',
          x,
          y,
          w: defaultW,
          h: defaultH,
        },
      })

      if (item.type === 'Icon') {
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent(
              'forgeui-open-icon-browser',
            ),
          )
        }, 0)
      }
    },

    canDrop: () => canDrop,
  })

  return {
    drop,
    isOver,
  }
}
