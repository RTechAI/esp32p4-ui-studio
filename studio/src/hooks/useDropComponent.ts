import { RefObject } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { rootComponents } from '~utils/editor'
import useDispatch from './useDispatch'
import builder from '~core/models/composer/builder'

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

const isLed = item.type === 'Led'
const isArc = item.type === 'Arc'
const isLine = item.type === 'Line'
const isText = item.type === 'Text'
const isHeading = item.type === 'Heading'
const isClock = item.type === 'Clock'
const isWifi = item.type === 'WiFi'
const isInput = item.type === 'Input'
const isNumberInput = item.type === 'NumberInput'
const isTextarea = item.type === 'Textarea'
const isSwitch = item.type === 'Switch'
const isCheckbox = item.type === 'Checkbox'
const isRadio = item.type === 'Radio'
const isSlider = item.type === 'Slider'
const isProgress = item.type === 'Progress'
const isCircularProgress =
  item.type === 'CircularProgress'
const isButton = item.type === 'Button'
const isInteractiveButton =
  item.type === 'InteractiveButton'
const isInteractiveLight =
  item.type === 'InteractiveLight'
const isInteractiveStatusIndicator =
  item.type === 'InteractiveStatusIndicator'
const isInteractiveToggleSwitch = item.type === 'InteractiveToggleSwitch'
const isInteractiveThreePositionToggleSwitch = item.type === 'InteractiveThreePositionToggleSwitch'
const isSelect = item.type === 'Select'
const isIcon = item.type === 'Icon'
const isIconButton = item.type === 'IconButton'
const isDivider = item.type === 'Divider'
const isBox = item.type === 'Box'
const isRoller = item.type === 'Roller'

const defaultW = isLed
  ? 32
  : isArc || isLine
    ? 120
    : isCircularProgress
      ? 96
      : isHeading
        ? 200
        : isText
          ? 80
          : isClock
            ? 90
            : isWifi
              ? 120
              : isInput
                ? 160
                : isNumberInput
                  ? 280
                  : isTextarea
                    ? 220
                    : isButton
                      ? 120
                      : isInteractiveButton
                        ? getInteractiveButtonDropSize().width
                        : isInteractiveToggleSwitch
                          ? 64
                        : isInteractiveThreePositionToggleSwitch
                          ? 96
                        : isInteractiveStatusIndicator
                          ? getInteractiveStatusIndicatorDropSize().width
                        : isInteractiveLight
                          ? getInteractiveLightDropSize().width
                        : isSelect
                          ? 180
                          : isSwitch
                            ? 48
                            : isCheckbox
                              ? 28
                              : isRadio
                                ? 28
                                : isSlider
                                  ? 180
                                  : isProgress
                                    ? 180
                                    : isRoller
                                      ? 120
                                      : isIcon || isIconButton
                                        ? 48
                                        : isDivider
                                          ? 180
                                          : isBox
                                            ? 180
                                            : 240

const defaultH = isLed
  ? 32
  : isArc || isLine
    ? 120
    : isCircularProgress
      ? 92
      : isHeading
        ? 48
        : isText
          ? 24
          : isClock
            ? 32
            : isWifi
              ? 60
              : isInput
                ? 36
                : isNumberInput
                  ? 40
                  : isTextarea
                    ? 80
                    : isButton
                      ? 40
                      : isInteractiveButton
                        ? getInteractiveButtonDropSize().height
                        : isInteractiveToggleSwitch
                          ? 36
                        : isInteractiveThreePositionToggleSwitch
                          ? 36
                        : isInteractiveStatusIndicator
                          ? getInteractiveStatusIndicatorDropSize().height
                        : isInteractiveLight
                          ? getInteractiveLightDropSize().height
                        : isSelect
                          ? 36
                          : isSwitch
                            ? 28
                            : isCheckbox
                              ? 28
                              : isRadio
                                ? 28
                                : isSlider
                                  ? 36
                                  : isProgress
                                    ? 24
                                    : isRoller
                                      ? 72
                                      : isIcon || isIconButton
                                        ? 48
                                        : isDivider
                                          ? 2
                                          : isBox
                                            ? 100
                                            : 120

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
