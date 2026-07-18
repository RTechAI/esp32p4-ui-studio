import { RefObject } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { rootComponents } from '~utils/editor'
import useDispatch from './useDispatch'
import builder from '~core/models/composer/builder'

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

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
      isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
    }),
    drop: (item: ComponentItemProps, monitor: DropTargetMonitor) => {
      if (!monitor.isOver()) {
        return
      }

      const clientOffset = monitor.getClientOffset()
      const viewportRect = viewportRef?.current?.getBoundingClientRect()

      if (!clientOffset || !viewportRect) {
        return
      }

      if (item.isMoved) {
        const w = Number(item.w ?? 240)
        const h = Number(item.h ?? 120)

        const x = clamp(
          Math.round(clientOffset.x - viewportRect.left - w / 2),
          0,
          Math.round(viewportRect.width - w),
        )

        const y = clamp(
          Math.round(clientOffset.y - viewportRect.top - h / 2),
          0,
          Math.round(viewportRect.height - h),
        )

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
        dispatch.components.addMetaComponent(builder[item.type](componentId))
        return
      }

      const defaultW =
  item.type === 'Led' ? 32 : 240

const defaultH =
  item.type === 'Led' ? 32 : 120

const x = clamp(
  Math.round(clientOffset.x - viewportRect.left - defaultW / 2),
  0,
  Math.round(viewportRect.width - defaultW),
)

const y = clamp(
  Math.round(clientOffset.y - viewportRect.top - defaultH / 2),
  0,
  Math.round(viewportRect.height - defaultH),
)

dispatch.components.addComponent({
  parentName: componentId,
  type: item.type,
  rootParentType: item.rootParentType,
  props: {
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
      new CustomEvent('forgeui-open-icon-browser'),
   )
        }, 0)
      }
    },
    canDrop: () => canDrop,
  })

  return { drop, isOver }
}