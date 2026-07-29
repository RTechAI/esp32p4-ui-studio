import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import ArcPanel from '../components/inspector/panels/components/ArcPanel'
import { InspectorProvider } from '../contexts/inspector-context'
import { storeConfig } from '../core/store'
import { getPreviewDefaultProps } from '../utils/defaultProps'
import {
  getForgeUIStandardArcValueFromPointer,
  getForgeUIStandardArcValues,
  isForgeUIStandardArcTrackHit,
} from './ForgeUIStandardArc'
import StandardArcPreview from './preview/StandardArcPreview'
import ArcPreview from '../components/editor/previews/ArcPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

const arc = (props: Record<string, unknown> = {}): IComponent => ({
  id: 'arc',
  parent: 'root',
  type: 'Arc',
  props: { x: 12, y: 18, w: 160, h: 120, ...props },
  children: [],
})

const BrowserArc = ({ component }: { component: IComponent }) => {
  const root: IComponent = {
    id: 'root', parent: 'root', type: 'Box', props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, arc: component },
  })}</>
}

describe('Standard Arc authoring', () => {
  it('creates Arc with serialized defaults', () => {
    // @ts-ignore Rematch plugin typing is wider than this test requires.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root', type: 'Arc', rootParentType: 'Arc', testId: 'arc',
    })
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props)
      .toMatchObject({ min: 0, max: 100, value: 65 })
    expect(getPreviewDefaultProps('Arc'))
      .toEqual({ min: 0, max: 100, value: 65 })
  })

  it('normalizes integers, negative/reversed ranges, clamping, and equality', () => {
    expect(getForgeUIStandardArcValues({
      min: 50, max: -50, value: 100.9,
    })).toMatchObject({
      rangeStart: 50, rangeEnd: -50,
      minimum: -50, maximum: 50, value: 50, fraction: 0,
    })
    expect(getForgeUIStandardArcValues({
      min: -50, max: 50, value: 0,
    }).fraction).toBe(0.5)
    expect(getForgeUIStandardArcValues({
      min: 10, max: 10, value: 40,
    })).toMatchObject({
      minimum: 10, maximum: 10, value: 10, fraction: 0,
    })
    expect(getForgeUIStandardArcValues({})).toMatchObject({
      minimum: 0, maximum: 100, value: 65, fraction: 0.65,
    })
  })

  it('maps LVGL default geometry, negative and reversed ranges', () => {
    const point = (degrees: number) => ({
      x: 50 + Math.cos(degrees * Math.PI / 180) * 50,
      y: 50 + Math.sin(degrees * Math.PI / 180) * 50,
    })
    const valueAt = (
      degrees: number,
      props: Record<string, unknown> = {},
    ) => {
      const pointer = point(degrees)
      return getForgeUIStandardArcValueFromPointer(
        props, pointer.x, pointer.y, 100, 100,
      )
    }

    expect(valueAt(135)).toBe(0)
    expect(valueAt(270)).toBe(50)
    expect(valueAt(45)).toBe(100)
    expect(valueAt(180, { min: -50, max: 50 })).toBe(-33)
    expect(valueAt(135, { min: 100, max: 0 })).toBe(100)
    expect(valueAt(45, { min: 100, max: 0 })).toBe(0)
    expect(valueAt(135, { mode: 'reverse' })).toBe(100)
    expect(valueAt(45, { mode: 'reverse' })).toBe(0)
    expect(valueAt(225, { rotation: 90 })).toBe(0)
  })

  it('rounds values, clamps the dead zone, and keeps equal ranges stable', () => {
    const valueAt = (degrees: number, props: Record<string, unknown> = {}) => {
      const radians = degrees * Math.PI / 180
      return getForgeUIStandardArcValueFromPointer(
        props,
        50 + Math.cos(radians) * 50,
        50 + Math.sin(radians) * 50,
        100,
        100,
      )
    }
    expect(valueAt(203)).toBe(25)
    expect(valueAt(100)).toBe(0)
    expect(valueAt(80)).toBe(100)
    expect(valueAt(270, { min: 7, max: 7, value: 50 })).toBe(7)
    expect(getForgeUIStandardArcValueFromPointer(
      { value: 40 }, 50, 50, 100, 100,
    )).toBe(40)
  })

  it('hit-tests only the rendered Arc stroke in square and non-square bounds', () => {
    expect(isForgeUIStandardArcTrackHit({}, 50, 8, 100, 100)).toBe(true)
    expect(isForgeUIStandardArcTrackHit({}, 50, 50, 100, 100)).toBe(false)
    expect(isForgeUIStandardArcTrackHit({}, 4, 4, 100, 100)).toBe(false)
    expect(isForgeUIStandardArcTrackHit({}, 100, 8, 200, 100)).toBe(true)
    expect(isForgeUIStandardArcTrackHit({}, 10, 50, 200, 100)).toBe(false)
    expect(isForgeUIStandardArcTrackHit({}, 100, 50, 200, 100)).toBe(false)
    // The default inactive 45°..135° gap is not visibly stroked.
    expect(isForgeUIStandardArcTrackHit({}, 59, 92, 100, 100)).toBe(false)
  })

  it('edits all Arc values through the Inspector and preserves zero', () => {
    // @ts-ignore Rematch plugin typing is wider than this test requires.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root', type: 'Arc', rootParentType: 'Arc', testId: 'arc',
    })
    render(
      <ChakraProvider>
        <Provider store={store}>
          <InspectorProvider><ArcPanel /></InspectorProvider>
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByLabelText('Minimum')).toHaveValue('0')
    fireEvent.change(screen.getByLabelText('Minimum'), {
      target: { value: '-50' },
    })
    fireEvent.change(screen.getByLabelText('Maximum'), {
      target: { value: '25' },
    })
    fireEvent.change(screen.getByLabelText('Initial Value'), {
      target: { value: '0' },
    })
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props)
      .toMatchObject({ min: '-50', max: '25', value: '0' })
  })

  it('renders the normalized sweep without adding pointer interaction', () => {
    const { rerender } = render(
      <ChakraProvider>
        <StandardArcPreview component={arc({ min: 0, max: 100, value: 25 })} />
      </ChakraProvider>,
    )
    const preview = screen.getByTestId('standard-arc-preview')
    const firstSweep = screen.getByTestId('standard-arc-indicator')
      .getAttribute('stroke-dasharray')
    expect(preview).toHaveAttribute('data-arc-fraction', '0.25')
    expect(preview).toHaveStyle({ pointerEvents: 'none' })
    expect(preview).not.toHaveAttribute('onpointerdown')

    rerender(
      <ChakraProvider>
        <StandardArcPreview component={arc({ min: 100, max: 0, value: 0 })} />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('standard-arc-preview'))
      .toHaveAttribute('data-arc-fraction', '1')
    expect(screen.getByTestId('standard-arc-indicator')
      .getAttribute('stroke-dasharray')).not.toBe(firstSweep)
  })

  it('updates Redux on Canvas click and captured pointer drag', () => {
    // @ts-ignore Rematch plugin typing is wider than this test requires.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Arc',
      rootParentType: 'Arc',
      testId: 'arc',
      props: { min: 0, max: 100, value: 0, x: 12, y: 18 },
    })
    const wrapperPointerDown = jest.fn()
    const CanvasArc = () => (
      <div onPointerDown={wrapperPointerDown}>
        <ArcPreview
          // @ts-ignore State is wrapped by redux-undo.
          component={store.getState().components.present.components.arc}
        />
      </div>
    )
    const { rerender } = render(
      <ChakraProvider>
        <Provider store={store}>
          <InspectorProvider>
            <CanvasArc />
            <ArcPanel />
          </InspectorProvider>
        </Provider>
      </ChakraProvider>,
    )
    const control = screen.getByTestId('standard-arc-canvas-control')
    Object.defineProperty(control, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100, right: 200, top: 100, bottom: 200,
        width: 100, height: 100, x: 100, y: 100,
        toJSON: () => ({}),
      }),
    })
    const captured = new Set<number>()
    control.setPointerCapture = pointerId => captured.add(pointerId)
    control.hasPointerCapture = pointerId => captured.has(pointerId)
    control.releasePointerCapture = pointerId => captured.delete(pointerId)
    const pointerEvent = (type: string, clientX: number, clientY: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      Object.defineProperties(event, {
        pointerId: { value: 1 },
        clientX: { value: clientX },
        clientY: { value: clientY },
      })
      return event
    }

    fireEvent(control, pointerEvent('pointerdown', 150, 100))
    expect(captured.has(1)).toBe(true)
    expect(wrapperPointerDown).not.toHaveBeenCalled()
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props.value)
      .toBe(50)
    expect(screen.getByLabelText('Initial Value')).toHaveValue('50')

    rerender(
      <ChakraProvider>
        <Provider store={store}>
          <InspectorProvider>
            <CanvasArc />
            <ArcPanel />
          </InspectorProvider>
        </Provider>
      </ChakraProvider>,
    )
    fireEvent(control, pointerEvent('pointermove', 167, 248))
    // Pointer capture keeps the drag active outside the 100px bounds.
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props.value)
      .toBe(100)
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props)
      .toMatchObject({ x: 12, y: 18 })
    fireEvent(control, pointerEvent('pointerup', 167, 248))
    expect(captured.has(1)).toBe(false)

    const valueBeforeMovementGesture =
      // @ts-ignore State is wrapped by redux-undo.
      store.getState().components.present.components.arc.props.value
    fireEvent(control, pointerEvent('pointerdown', 150, 150))
    expect(wrapperPointerDown).toHaveBeenCalledTimes(1)
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props.value)
      .toBe(valueBeforeMovementGesture)

    fireEvent(control, pointerEvent('pointerdown', 102, 102))
    expect(wrapperPointerDown).toHaveBeenCalledTimes(2)
    // @ts-ignore State is wrapped by redux-undo.
    expect(store.getState().components.present.components.arc.props.value)
      .toBe(valueBeforeMovementGesture)
  })

  it('uses the same renderer in Browser Preview at serialized dimensions', () => {
    const component = arc({ min: -50, max: 50, value: 0 })
    render(
      <ChakraProvider>
        <ForgeThemeProvider><BrowserArc component={component} /></ForgeThemeProvider>
      </ChakraProvider>,
    )
    const preview = screen.getByTestId('standard-arc-preview')
    expect(preview).toHaveAttribute('data-arc-fraction', '0.5')
    expect(preview).toHaveStyle({ pointerEvents: 'none' })
    expect(screen.queryByTestId('standard-arc-canvas-control'))
      .not.toBeInTheDocument()
    const positioned = preview.parentElement
    expect(positioned).toHaveStyle({ width: '160px', height: '120px' })
  })

  it('preserves Arc values through JSON persistence', () => {
    const reloaded = JSON.parse(JSON.stringify(
      arc({ min: -50, max: 50, value: 0 }),
    )) as IComponent
    expect(reloaded.props).toMatchObject({ min: -50, max: 50, value: 0 })
  })
})
