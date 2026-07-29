import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import BarPreview, {
  getStandardBarCanvasGrabStrip,
} from '../components/editor/previews/BarPreview'
import BarPanel from '../components/inspector/panels/components/BarPanel'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'
import { getPreviewDefaultProps } from '../utils/defaultProps'
import { getForgeUIStandardBarValues } from './ForgeUIStandardBar'
import StandardBarPreview, {
  LVGL_BAR_RADIUS,
} from './preview/StandardBarPreview'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { storeConfig } from '../core/store'
import { InspectorProvider } from '../contexts/inspector-context'

const bar = (props: Record<string, unknown>): IComponent => ({
  id: 'bar',
  parent: 'root',
  type: 'Bar',
  componentName: 'Progress Bar',
  props: { x: 10, y: 20, w: 240, h: 24, ...props },
  children: [],
})

const BrowserBar = ({
  root,
  component,
}: {
  root: IComponent
  component: IComponent
}) => (
  <>{renderForgePreview({
    component: root,
    components: { root, bar: component },
  })}</>
)

describe('Standard Bar authoring parity', () => {
  it('creates Bars with serialized authoring defaults', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Bar',
      rootParentType: 'Bar',
      testId: 'bar',
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props)
      .toMatchObject({ min: 0, max: 100, value: 70 })
    expect(getPreviewDefaultProps('Bar'))
      .toEqual({ min: 0, max: 100, value: 70 })
  })

  it('normalizes the range and clamps the initial value like the exporter', () => {
    expect(getForgeUIStandardBarValues({
      min: 50,
      max: -50,
      value: 90,
    })).toEqual({ minimum: -50, maximum: 50, value: 50 })
  })

  it('edits all three serialized properties through the Inspector', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Bar',
      rootParentType: 'Bar',
      testId: 'bar',
    })

    render(
      <ChakraProvider>
        <Provider store={store}>
          <InspectorProvider>
            <BarPanel />
          </InspectorProvider>
        </Provider>
      </ChakraProvider>,
    )

    fireEvent.change(screen.getByLabelText('Minimum'), {
      target: { value: '-25' },
    })
    fireEvent.change(screen.getByLabelText('Maximum'), {
      target: { value: '125' },
    })
    fireEvent.change(screen.getByLabelText('Initial Value'), {
      target: { value: '45' },
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props)
      .toMatchObject({ min: '-25', max: '125', value: '45' })
  })

  it('Canvas Preview displays the serialized value and normalized range', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Bar',
      rootParentType: 'Bar',
      testId: 'bar',
      props: { min: -50, max: 50, value: 35 },
    })

    render(
      <ChakraProvider>
        <Provider store={store}>
          <BarPreview
            // @ts-ignore State is wrapped by redux-undo in the configured store.
            component={store.getState().components.present.components.bar}
          />
        </Provider>
      </ChakraProvider>,
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '35')
    expect(progressbar).toHaveAttribute('aria-valuemin', '-50')
    expect(progressbar).toHaveAttribute('aria-valuemax', '50')
    expect(progressbar.parentElement).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
      overflow: 'hidden',
    })
    expect(progressbar).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
    })
  })

  it.each([
    { value: 0, expectedWidth: '0%' },
    { value: 50, expectedWidth: '50%' },
    { value: 100, expectedWidth: '100%' },
  ])('renders rounded, clipped fill safely at $value', ({
    value,
    expectedWidth,
  }) => {
    render(
      <ChakraProvider>
        <StandardBarPreview
          component={bar({ min: 0, max: 100, value })}
        />
      </ChakraProvider>,
    )

    const indicator = screen.getByRole('progressbar')
    const track = indicator.parentElement
    expect(track).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
      overflow: 'hidden',
    })
    expect(indicator).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
      width: expectedWidth,
    })
  })

  it('updates the serialized value from Canvas clicks and horizontal drags', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Bar',
      rootParentType: 'Bar',
      testId: 'bar',
      props: { min: -50, max: 50, value: 0 },
    })

    const CanvasBar = () => (
      <BarPreview
        // @ts-ignore State is wrapped by redux-undo in the configured store.
        component={store.getState().components.present.components.bar}
      />
    )
    const { rerender } = render(
      <ChakraProvider>
        <Provider store={store}>
          <CanvasBar />
        </Provider>
      </ChakraProvider>,
    )
    const control = screen.getByTestId('standard-bar-canvas-control')
    Object.defineProperty(control, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 100,
        right: 300,
        top: 0,
        bottom: 20,
        width: 200,
        height: 20,
        x: 100,
        y: 0,
        toJSON: () => ({}),
      }),
    })
    const captured = new Set<number>()
    control.setPointerCapture = pointerId => captured.add(pointerId)
    control.hasPointerCapture = pointerId => captured.has(pointerId)
    control.releasePointerCapture = pointerId => captured.delete(pointerId)
    const pointerEvent = (
      type: string,
      pointerId: number,
      clientX: number,
    ) => {
      const event = new Event(type, { bubbles: true, cancelable: true })
      Object.defineProperties(event, {
        pointerId: { value: pointerId },
        clientX: { value: clientX },
      })
      return event
    }
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    const initialProps = store.getState().components.present.components.bar.props

    expect(fireEvent(control, pointerEvent('pointerdown', 1, 150)))
      .toBe(false)
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props.value)
      .toBe(-25)
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props.x)
      .toBe(initialProps.x)
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props.y)
      .toBe(initialProps.y)

    rerender(
      <ChakraProvider>
        <Provider store={store}>
          <CanvasBar />
        </Provider>
      </ChakraProvider>,
    )
    fireEvent(control, pointerEvent('pointermove', 1, 350))
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props.value)
      .toBe(50)
    fireEvent(control, pointerEvent('pointerup', 1, 350))
  })

  it('leaves the top and bottom grab strips available for movement', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Bar',
      rootParentType: 'Bar',
      testId: 'bar',
      props: {
        positionMode: 'absolute',
        x: 12,
        y: 34,
        w: 240,
        h: 40,
        min: 0,
        max: 100,
        value: 35,
      },
    })

    render(
      <ChakraProvider>
        <Provider store={store}>
          <BarPreview
            // @ts-ignore State is wrapped by redux-undo in the configured store.
            component={store.getState().components.present.components.bar}
          />
        </Provider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-bar-canvas-preview')
    const movementEvent = new Event('pointerdown', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperties(movementEvent, {
      pointerId: { value: 2 },
      clientX: { value: 20 },
      clientY: { value: 1 },
    })

    expect(fireEvent(preview, movementEvent)).toBe(true)
    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.bar.props)
      .toMatchObject({ x: 12, y: 34, value: 35 })
  })

  it('keeps a usable value band for short and tall Bars', () => {
    expect(getStandardBarCanvasGrabStrip(10)).toBe(2)
    expect(10 - 2 * getStandardBarCanvasGrabStrip(10)).toBe(6)
    expect(getStandardBarCanvasGrabStrip(40)).toBe(8)
    expect(40 - 2 * getStandardBarCanvasGrabStrip(40)).toBe(24)
    expect(getStandardBarCanvasGrabStrip(100)).toBe(8)
  })

  it('Browser Preview displays the same serialized value and range', () => {
    const component = bar({ min: -20, max: 80, value: 45 })
    const root: IComponent = {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: [component.id],
    }

    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserBar root={root} component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '45')
    expect(progressbar).toHaveAttribute('aria-valuemin', '-20')
    expect(progressbar).toHaveAttribute('aria-valuemax', '80')
    expect(progressbar.parentElement).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
      overflow: 'hidden',
    })
    expect(progressbar).toHaveStyle({
      borderRadius: LVGL_BAR_RADIUS,
    })
  })

  it('preserves the authored properties through a project JSON round trip', () => {
    const component = bar({ min: -10, max: 120, value: 75 })
    const reloaded = JSON.parse(JSON.stringify(component)) as IComponent

    expect(reloaded.props).toMatchObject({
      min: -10,
      max: 120,
      value: 75,
    })
  })
})
