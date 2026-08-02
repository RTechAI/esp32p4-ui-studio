import React from 'react'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'

import ComponentPreview from './ComponentPreview'
import { storeConfig } from '~core/store'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock

const DndProviderWithChildren = DndProvider as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
>

function renderWithRedux(
  components: React.ReactNode,
  {
    // @ts-ignore
    initialState,
    // @ts-ignore
    store = init(storeConfig),
  } = {},
) {
  return {
    ...render(
      <ChakraProvider resetCSS theme={theme}>
        <DndProviderWithChildren backend={HTML5Backend}>
          <Provider store={store}>{components}</Provider>
        </DndProviderWithChildren>
      </ChakraProvider>,
    ),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

const componentsToTest = [
  'Badge',
  'Button',
  'Icon',
  'IconButton',
  'Image',
  'Text',
  'Progress',
  'Link',
  'Spinner',
  'CloseButton',
  'Checkbox',
  'Divider',
  'Code',
  'Textarea',
  'CircularProgress',
  'Heading',
  'Highlight',
  'Tag',
  'Switch',
  'FormLabel',
  // 'Tab',
  'Input',
  'NumberInput',
  'Radio',
  'Slider',
  'Spinbox',
  //'ListItem',
  //'ListIcon',
  // 'AlertIcon',
  // 'AccordionIcon',
  'Box',
  'SimpleGrid',
  'Flex',
  // 'AccordionPanel',
  // 'AccordionItem',
  'FormControl',
  // 'Tabs',
  // 'TabList',
  // 'TabPanels',
  'List',
  'Avatar',
  'AvatarGroup',
  'Alert',
  'Stack',
  'Accordion',
  // 'AccordionButton',
  'RadioGroup',
  'Select',
  'InputGroup',
]

test.each(componentsToTest)('Component Preview for %s', componentName => {
  // const spy = jest.spyOn(global.console, 'error')
  // @ts-ignore
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    // @ts-ignore
    parentName: 'root',
    type: componentName,
    rootParentType: componentName,
    testId: 'test',
  })

  // console.log(componentName, store.getState().components.present.components);
  // @ts-ignore
  renderWithRedux(<ComponentPreview componentName="test" />, { store })
  // expect(spy).not.toHaveBeenCalled();
})

test('Canvas dispatch renders RelayPanel through the production preview path', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'RelayPanel',
    rootParentType: 'RelayPanel',
    testId: 'relay-panel',
  })
  renderWithRedux(
    <ComponentPreview componentName="relay-panel" />,
    { initialState: undefined, store },
  )
  expect(screen.getByTestId('forgeui-relay-panel')).toBeInTheDocument()
  expect(screen.getByText('Main Relays')).toBeInTheDocument()
})

test('Canvas Checkbox toggles preview state without mutating serialized state or starting drag', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Checkbox',
    rootParentType: 'Checkbox',
    testId: 'checkbox',
    props: {
      positionMode: 'absolute',
      x: 40,
      y: 50,
      w: 180,
      h: 40,
      children: '',
      isChecked: false,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="checkbox" />, { store })

  const control = screen.getByRole('checkbox')
  const preview = screen.getByTestId('standard-checkbox-preview')
  const interaction = screen.getByTestId(
    'standard-checkbox-canvas-interaction',
  )
  const moveSurface = preview.closest('[draggable="true"]')

  expect(control).not.toBeChecked()
  expect(screen.queryByText('Label checkbox')).not.toBeInTheDocument()
  expect(screen.queryByText('Checkbox')).not.toBeInTheDocument()
  expect(fireEvent.pointerDown(interaction)).toBe(true)
  fireEvent.click(interaction)
  expect(control).toBeChecked()
  expect(fireEvent.dragStart(interaction)).toBe(false)
  fireEvent.click(interaction)
  expect(control).not.toBeChecked()
  expect(moveSurface).toHaveAttribute('draggable', 'true')
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components.checkbox.props.isChecked)
    .toBe(false)
})

test('Canvas Checkbox renders only its configured custom label', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Checkbox',
    rootParentType: 'Checkbox',
    testId: 'custom-checkbox',
    props: {
      children: 'Enable logging',
      isChecked: false,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(
    <ComponentPreview componentName="custom-checkbox" />,
    { initialState: undefined, store },
  )

  expect(screen.getByText('Enable logging')).toBeInTheDocument()
  expect(screen.queryByText('Label checkbox')).not.toBeInTheDocument()
})

test('Canvas Slider stays selectable and leaves drag gestures to its wrapper', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Slider',
    rootParentType: 'Slider',
    testId: 'slider',
    props: {
      positionMode: 'absolute',
      x: 100,
      y: 80,
      w: 240,
      h: 40,
      value: 35,
      min: 0,
      max: 100,
      step: 5,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="slider" />, { store })

  const preview = screen.getByTestId('standard-slider-canvas')
  const control = screen.getByTestId('standard-slider-control')
  const draggable = preview.closest('.react-draggable')
  const moveSurface = preview.closest('[draggable="true"]')

  expect(draggable).not.toBeNull()
  expect(moveSurface).toHaveAttribute('draggable', 'true')
  expect(control).toHaveClass('forgeui-canvas-control-interactive')
  expect(fireEvent.dragStart(control)).toBe(false)
  expect(fireEvent.dragStart(moveSurface as HTMLElement)).toBe(true)
  fireEvent.click(preview)
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.selectedId).toBe('slider')
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components.slider.props.value)
    .toBe(35)
})

test('Canvas Line endpoint handles edit geometry while its body remains movable', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Line',
    rootParentType: 'Line',
    testId: 'line',
    props: {
      positionMode: 'absolute',
      x: 40,
      y: 50,
      w: 100,
      h: 80,
      startX: 0,
      startY: 0,
      endX: 100,
      endY: 80,
      lineWidth: 3,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="line" />, { store })

  const preview = screen.getByTestId('standard-line-canvas-preview')
  const stroke = screen.getByTestId('standard-line-stroke')
  const startHandle = screen.getByTestId('standard-line-start-handle')
  const moveSurface = preview.closest('[draggable="true"]')

  expect(moveSurface).toHaveAttribute('draggable', 'true')
  Object.defineProperty(preview, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: 0, right: 100, top: 0, bottom: 80,
      width: 100, height: 80, x: 0, y: 0,
      toJSON: () => ({}),
    }),
  })

  const captured = new Set<number>()
  startHandle.setPointerCapture = pointerId => captured.add(pointerId)
  startHandle.hasPointerCapture = pointerId => captured.has(pointerId)
  startHandle.releasePointerCapture = pointerId => captured.delete(pointerId)
  const pointerEvent = (type: string, clientX: number, clientY: number) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      clientX: { value: clientX },
      clientY: { value: clientY },
    })
    return event
  }

  const bodyPointerDown = pointerEvent('pointerdown', 50, 40)
  fireEvent(stroke, bodyPointerDown)
  expect(bodyPointerDown.defaultPrevented).toBe(false)

  const handlePointerDown = pointerEvent('pointerdown', 0, 0)
  fireEvent(startHandle, handlePointerDown)
  expect(handlePointerDown.defaultPrevented).toBe(true)
  fireEvent(startHandle, pointerEvent('pointermove', 20, 30))
  fireEvent(startHandle, pointerEvent('pointerup', 20, 30))

  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components.line.props)
    .toMatchObject({
      x: '60',
      y: '80',
      w: '80',
      h: '50',
      startX: '0',
      startY: '0',
      endX: '80',
      endY: '50',
    })
})

test('Canvas Bar keeps track interaction separate from wrapper movement', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Bar',
    rootParentType: 'Bar',
    testId: 'bar',
    props: {
      positionMode: 'absolute',
      x: 100,
      y: 80,
      w: 240,
      h: 40,
      value: 35,
      min: 0,
      max: 100,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="bar" />, { store })

  const preview = screen.getByTestId('standard-bar-canvas-preview')
  const control = screen.getByTestId('standard-bar-canvas-control')
  const draggable = control.closest('.react-draggable')
  const moveSurface = control.closest('[draggable="true"]')

  expect(draggable).not.toBeNull()
  expect(moveSurface).toHaveAttribute('draggable', 'true')
  expect(control).toHaveClass('forgeui-canvas-control-interactive')
  expect(control).toHaveAttribute('data-bar-grab-strip', '8')
  Object.defineProperty(control, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: 0, right: 240, top: 8, bottom: 32,
      width: 240, height: 24, x: 0, y: 8,
      toJSON: () => ({}),
    }),
  })
  const captured = new Set<number>()
  control.setPointerCapture = pointerId => captured.add(pointerId)
  control.hasPointerCapture = pointerId => captured.has(pointerId)
  control.releasePointerCapture = pointerId => captured.delete(pointerId)
  const pointerEvent = (type: string) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      clientX: { value: 120 },
      clientY: { value: 20 },
    })
    return event
  }
  fireEvent(control, pointerEvent('pointerdown'))
  expect(fireEvent.dragStart(control)).toBe(false)
  fireEvent(control, pointerEvent('pointerup'))
  expect(fireEvent.dragStart(preview)).toBe(true)
  expect(fireEvent.dragStart(moveSurface as HTMLElement)).toBe(true)
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components.bar.props)
    .toMatchObject({ x: 100, y: 80, value: 50 })
})

test('Canvas Arc keeps angle interaction separate from wrapper movement', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Arc',
    rootParentType: 'Arc',
    testId: 'arc',
    props: {
      positionMode: 'absolute',
      x: 100,
      y: 80,
      w: 120,
      h: 120,
      value: 65,
      min: 0,
      max: 100,
    },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="arc" />, { store })

  const control = screen.getByTestId('standard-arc-canvas-control')
  const draggable = control.closest('.react-draggable')
  const moveSurface = control.closest('[draggable="true"]')

  expect(draggable).not.toBeNull()
  expect(moveSurface).toHaveAttribute('draggable', 'true')
  expect(control).toHaveClass('forgeui-canvas-control-interactive')
  Object.defineProperty(control, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      left: 0, right: 120, top: 0, bottom: 120,
      width: 120, height: 120, x: 0, y: 0,
      toJSON: () => ({}),
    }),
  })
  const pointerEvent = (type: string, clientX: number, clientY: number) => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      clientX: { value: clientX },
      clientY: { value: clientY },
    })
    return event
  }
  fireEvent(control, pointerEvent('pointerdown', 60, 0))
  expect(fireEvent.dragStart(control)).toBe(false)
  fireEvent(control, pointerEvent('pointerup', 60, 0))
  fireEvent(control, pointerEvent('pointerdown', 60, 60))
  expect(fireEvent.dragStart(control)).toBe(true)
  expect(fireEvent.dragStart(moveSurface as HTMLElement)).toBe(true)
})

test('Canvas Spinbox real pointer clicks persist and rerender authoritative value', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Spinbox',
    rootParentType: 'Spinbox',
    testId: 'spinbox-control',
    props: {
      positionMode: 'absolute',
      x: 100,
      y: 80,
      w: 220,
      h: 48,
      min: 0,
      max: 100,
      value: 0,
      step: 1,
    },
  })
  const updateProps = jest.spyOn(store.dispatch.components, 'updateProps')

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="spinbox-control" />, { store })

  const increment = screen.getByTestId('standard-spinbox-increment')
  expect(increment).toHaveClass('forgeui-canvas-control-interactive')
  expect(fireEvent.dragStart(increment)).toBe(false)
  fireEvent.pointerDown(increment)
  fireEvent.pointerUp(increment)
  fireEvent.click(increment)
  expect(updateProps).toHaveBeenLastCalledWith({
    id: 'spinbox-control',
    name: 'value',
    value: 1,
  })
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components['spinbox-control'].props.value)
    .toBe(1)
  expect(screen.getByTestId('standard-spinbox-canvas'))
    .toHaveAttribute('data-spinbox-value', '1')
  expect(screen.getByTestId('standard-spinbox-value')).toHaveTextContent('00001')

  const decrement = screen.getByTestId('standard-spinbox-decrement')
  fireEvent.pointerDown(decrement)
  fireEvent.pointerUp(decrement)
  fireEvent.click(decrement)
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components['spinbox-control'].props.value)
    .toBe(0)
  expect(screen.getByTestId('standard-spinbox-canvas'))
    .toHaveAttribute('data-spinbox-value', '0')
})

test.each([
  ['decimal backing value', {
    min: 0, max: 99999, value: 125, step: 1, decimalPlaces: 2,
  }, 'increment', 126],
  ['signed decrement', {
    min: -9, max: 9, value: 0, step: 1,
  }, 'decrement', -1],
  ['rollover', {
    min: 0, max: 9, value: 9, step: 1, rollover: true,
  }, 'increment', 0],
  ['non-rollover clamp', {
    min: 0, max: 9, value: 9, step: 1, rollover: false,
  }, 'increment', 9],
] as const)(
  'Canvas Spinbox handles %s through the real component store',
  (_, spinboxProps, direction, expected) => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Spinbox',
      rootParentType: 'Spinbox',
      testId: 'spinbox-boundary',
      props: {
        positionMode: 'absolute',
        x: 100,
        y: 80,
        w: 220,
        h: 48,
        ...spinboxProps,
      },
    })

    // @ts-ignore Test helper preserves its historical loosely typed options shape.
    renderWithRedux(<ComponentPreview componentName="spinbox-boundary" />, { store })
    const control = screen.getByTestId(
      direction === 'increment'
        ? 'standard-spinbox-increment'
        : 'standard-spinbox-decrement',
    )
    fireEvent.pointerDown(control)
    fireEvent.pointerUp(control)
    fireEvent.click(control)

    // @ts-ignore Store state is wrapped by redux-undo in production and tests.
    expect(store.getState().components.present.components['spinbox-boundary'].props.value)
      .toBe(expected)
    expect(screen.getByTestId('standard-spinbox-canvas'))
      .toHaveAttribute('data-spinbox-value', String(expected))
  },
)

test('Three-Position Toggle uses the shared positioned, selectable preview container', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveThreePositionToggleSwitch',
    rootParentType: 'InteractiveThreePositionToggleSwitch',
    testId: 'three-way',
    props: { positionMode: 'absolute', x: 137, y: 89, w: 96, h: 36 },
  })

  // @ts-ignore Test helper preserves its historical loosely typed options shape.
  renderWithRedux(<ComponentPreview componentName="three-way" />, { store })

  const preview = screen.getByTestId('three-position-preview')
  const positionedContainer = preview.closest('.react-draggable') as HTMLElement
  expect(positionedContainer).not.toBeNull()
  expect(positionedContainer).toHaveStyle({
    width: '96px',
    height: '36px',
  })
  // @ts-ignore Store state is wrapped by redux-undo in production and tests.
  expect(store.getState().components.present.components['three-way'].props).toMatchObject({
    positionMode: 'absolute', x: 137, y: 89, w: 96, h: 36,
  })
})

test('Toggle context menu selects the component and requests its creator', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveToggleSwitch',
    rootParentType: 'InteractiveToggleSwitch',
    testId: 'toggle-menu',
    props: {
      positionMode: 'absolute',
      interactiveAssetId: 'linked-toggle',
    },
  })
  store.dispatch.components.unselect()
  const navigationListener = jest.fn()
  window.addEventListener(
    'forgeui-open-ai-playground',
    navigationListener,
  )

  renderWithRedux(
    <ComponentPreview componentName="toggle-menu" />,
    { store, initialState: undefined },
  )
  expect(document.querySelector(
    '[data-toggle-placeholder-tone="neutral"]',
  )).not.toBeNull()
  fireEvent.contextMenu(
    screen.getByTestId('interactive-light-preview'),
    { clientX: 40, clientY: 50 },
  )

  expect(screen.getByRole('menuitem', {
    name: 'Open Toggle Creator',
  })).toBeInTheDocument()
  expect(document.querySelector(
    '[data-toggle-placeholder-tone="selected"]',
  )).not.toBeNull()
  expect(
    screen
      .getByRole('menuitem', {
        name: 'Open Toggle Creator',
      })
      .closest('.chakra-portal'),
  ).not.toBeNull()
  // @ts-ignore Store state is wrapped by redux-undo.
  expect(store.getState().components.present.selectedId)
    .toBe('toggle-menu')

  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Toggle Creator',
  }))
  expect(navigationListener).toHaveBeenCalledTimes(1)
  expect(
    (navigationListener.mock.calls[0][0] as CustomEvent).detail,
  ).toMatchObject({
    target: 'interactive-toggle-switch-designer',
    sourceComponentId: 'toggle-menu',
    interactiveAssetId: 'linked-toggle',
  })
  window.removeEventListener(
    'forgeui-open-ai-playground',
    navigationListener,
  )
})

test('unrelated canvas components do not show the Toggle creator action', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'Button',
    rootParentType: 'Button',
    testId: 'plain-button',
  })

  renderWithRedux(
    <ComponentPreview componentName="plain-button" />,
    { store, initialState: undefined },
  )
  fireEvent.contextMenu(screen.getByRole('button'))
  expect(screen.queryByText('Open Toggle Creator'))
    .not.toBeInTheDocument()
})

test('Toggle context menu dismisses outside, on Escape, and after navigation', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveToggleSwitch',
    rootParentType: 'InteractiveToggleSwitch',
    testId: 'dismiss-toggle',
    props: { positionMode: 'absolute' },
  })
  const listener = jest.fn()
  window.addEventListener(
    'forgeui-open-ai-playground',
    listener,
  )
  renderWithRedux(
    <ComponentPreview componentName="dismiss-toggle" />,
    { store, initialState: undefined },
  )
  const preview = screen.getByTestId('interactive-light-preview')

  fireEvent.contextMenu(preview, { clientX: 20, clientY: 30 })
  expect(screen.getByRole('menu')).toBeInTheDocument()
  fireEvent.mouseDown(document.body)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()

  fireEvent.contextMenu(preview, { clientX: 25, clientY: 35 })
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()

  fireEvent.contextMenu(preview, { clientX: 30, clientY: 40 })
  fireEvent.mouseDown(screen.getByRole('menuitem', {
    name: 'Open Toggle Creator',
  }))
  expect(screen.getByRole('menu')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Toggle Creator',
  }))
  expect(listener).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  window.removeEventListener(
    'forgeui-open-ai-playground',
    listener,
  )
})

test('right-clicking a second Toggle replaces the first context menu', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveToggleSwitch',
    rootParentType: 'InteractiveToggleSwitch',
    testId: 'first-toggle-menu',
    props: { positionMode: 'absolute' },
  })
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveToggleSwitch',
    rootParentType: 'InteractiveToggleSwitch',
    testId: 'second-toggle-menu',
    props: { positionMode: 'absolute' },
  })
  renderWithRedux(
    <>
      <ComponentPreview componentName="first-toggle-menu" />
      <ComponentPreview componentName="second-toggle-menu" />
    </>,
    { store, initialState: undefined },
  )
  const previews = screen.getAllByTestId('interactive-light-preview')

  fireEvent.contextMenu(previews[0], {
    clientX: 20,
    clientY: 30,
  })
  expect(screen.getByRole('menu')).toHaveAttribute(
    'data-context-component-id',
    'first-toggle-menu',
  )

  fireEvent.mouseDown(previews[1], { button: 2 })
  fireEvent.contextMenu(previews[1], {
    clientX: 80,
    clientY: 90,
  })
  expect(screen.getAllByRole('menu')).toHaveLength(1)
  expect(screen.getByRole('menu')).toHaveAttribute(
    'data-context-component-id',
    'second-toggle-menu',
  )
})

test('Button context menu selects and opens only the Button creator', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveButton',
    rootParentType: 'InteractiveButton',
    testId: 'button-menu',
    props: {
      positionMode: 'absolute',
      interactiveAssetId: 'linked-button',
    },
  })
  store.dispatch.components.unselect()
  const listener = jest.fn()
  window.addEventListener(
    'forgeui-open-ai-playground',
    listener,
  )
  renderWithRedux(
    <ComponentPreview componentName="button-menu" />,
    { store, initialState: undefined },
  )

  fireEvent.contextMenu(
    screen.getByTestId('unconfigured-button-placeholder'),
    { clientX: 44, clientY: 55 },
  )
  expect(screen.getByRole('menuitem', {
    name: 'Open Button Creator',
  })).toBeInTheDocument()
  expect(screen.queryByText('Open Toggle Creator'))
    .not.toBeInTheDocument()
  // @ts-ignore Store state is wrapped by redux-undo.
  expect(store.getState().components.present.selectedId)
    .toBe('button-menu')

  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Button Creator',
  }))
  expect(
    (listener.mock.calls[0][0] as CustomEvent).detail,
  ).toMatchObject({
    target: 'interactive-button-designer',
    sourceComponentId: 'button-menu',
    interactiveAssetId: 'linked-button',
  })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  window.removeEventListener(
    'forgeui-open-ai-playground',
    listener,
  )
})

test('Button creator menu keeps shared outside-click and Escape dismissal', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveButton',
    rootParentType: 'InteractiveButton',
    testId: 'button-dismiss-menu',
    props: { positionMode: 'absolute' },
  })
  renderWithRedux(
    <ComponentPreview componentName="button-dismiss-menu" />,
    { store, initialState: undefined },
  )
  const placeholder = screen.getByTestId(
    'unconfigured-button-placeholder',
  )
  fireEvent.contextMenu(placeholder)
  fireEvent.mouseDown(document.body)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()

  fireEvent.contextMenu(placeholder)
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('Light context menu selects and opens only the Light creator', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveLight',
    rootParentType: 'InteractiveLight',
    testId: 'light-menu',
    props: {
      positionMode: 'absolute',
      interactiveAssetId: 'linked-light',
    },
  })
  store.dispatch.components.unselect()
  const listener = jest.fn()
  window.addEventListener('forgeui-open-ai-playground', listener)
  renderWithRedux(
    <ComponentPreview componentName="light-menu" />,
    { store, initialState: undefined },
  )

  fireEvent.contextMenu(
    screen.getByTestId('unconfigured-light-placeholder'),
  )
  expect(screen.getByRole('menuitem', {
    name: 'Open Light Creator',
  })).toBeInTheDocument()
  expect(screen.queryByText('Open Button Creator'))
    .not.toBeInTheDocument()
  // @ts-ignore Store state is wrapped by redux-undo.
  expect(store.getState().components.present.selectedId)
    .toBe('light-menu')
  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Light Creator',
  }))
  expect(
    (listener.mock.calls[0][0] as CustomEvent).detail,
  ).toMatchObject({
    target: 'interactive-light-designer',
    sourceComponentId: 'light-menu',
    interactiveAssetId: 'linked-light',
  })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  window.removeEventListener('forgeui-open-ai-playground', listener)
})

test('Light creator menu reuses outside-click and Escape dismissal', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveLight',
    rootParentType: 'InteractiveLight',
    testId: 'light-dismiss-menu',
    props: { positionMode: 'absolute' },
  })
  renderWithRedux(
    <ComponentPreview componentName="light-dismiss-menu" />,
    { store, initialState: undefined },
  )
  const placeholder = screen.getByTestId(
    'unconfigured-light-placeholder',
  )
  fireEvent.contextMenu(placeholder)
  fireEvent.mouseDown(document.body)
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  fireEvent.contextMenu(placeholder)
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})

test('Three-Position Toggle context menu opens its type-scoped creator', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveThreePositionToggleSwitch',
    rootParentType: 'InteractiveThreePositionToggleSwitch',
    testId: 'three-position-menu',
    props: {
      positionMode: 'absolute',
      interactiveAssetId: 'linked-three-position',
    },
  })
  store.dispatch.components.unselect()
  const listener = jest.fn()
  window.addEventListener('forgeui-open-ai-playground', listener)
  renderWithRedux(
    <ComponentPreview componentName="three-position-menu" />,
    { store, initialState: undefined },
  )

  fireEvent.contextMenu(
    screen.getByTestId(
      'unconfigured-three-position-placeholder',
    ),
  )
  expect(screen.getByRole('menuitem', {
    name: 'Open Three-Position Toggle Creator',
  })).toBeInTheDocument()
  expect(screen.queryByText('Open Toggle Creator'))
    .not.toBeInTheDocument()
  // @ts-ignore Store state is wrapped by redux-undo.
  expect(store.getState().components.present.selectedId)
    .toBe('three-position-menu')
  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Three-Position Toggle Creator',
  }))
  expect(
    (listener.mock.calls[0][0] as CustomEvent).detail,
  ).toMatchObject({
    target: 'interactive-three-position-toggle-designer',
    sourceComponentId: 'three-position-menu',
    interactiveAssetId: 'linked-three-position',
  })
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  window.removeEventListener('forgeui-open-ai-playground', listener)
})

test('Status Indicator context menu opens only its linked creator', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveStatusIndicator',
    rootParentType: 'InteractiveStatusIndicator',
    testId: 'status-menu',
    props: {
      positionMode: 'absolute',
      interactiveAssetId: 'linked-status',
    },
  })
  const listener = jest.fn()
  window.addEventListener('forgeui-open-ai-playground', listener)
  renderWithRedux(
    <ComponentPreview componentName="status-menu" />,
    { store, initialState: undefined },
  )
  fireEvent.contextMenu(screen.getByTestId(
    'unconfigured-status-indicator-placeholder',
  ))
  expect(screen.getByRole('menuitem', {
    name: 'Open Status Indicator Creator',
  })).toBeInTheDocument()
  expect(screen.queryByText('Open Light Creator')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('menuitem', {
    name: 'Open Status Indicator Creator',
  }))
  expect((listener.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
    target: 'interactive-status-indicator-designer',
    sourceComponentId: 'status-menu',
    interactiveAssetId: 'linked-status',
  })
  window.removeEventListener('forgeui-open-ai-playground', listener)
})

test('a newly dropped Status Indicator uses its full placeholder and selection bounds', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveStatusIndicator',
    rootParentType: 'InteractiveStatusIndicator',
    testId: 'new-status-size',
    props: {
      positionMode: 'absolute',
      x: 40,
      y: 50,
      w: 120,
      h: 72,
    },
  })
  renderWithRedux(
    <ComponentPreview componentName="new-status-size" />,
    { store, initialState: undefined },
  )
  const placeholder = screen.getByTestId(
    'unconfigured-status-indicator-placeholder',
  )
  expect(placeholder).toHaveAttribute('data-layout', 'full')
  expect(screen.getByTestId(
    'unconfigured-status-indicator-icon',
  )).toHaveAttribute('width', '101')
  const bounds = placeholder.closest(
    '.react-draggable',
  ) as HTMLElement
  expect(bounds).toHaveStyle({
    width: '120px',
    height: '72px',
  })
})

test('unrelated Interactive Assets do not get the Status Indicator action', () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveLight',
    rootParentType: 'InteractiveLight',
    testId: 'not-status',
    props: { positionMode: 'absolute' },
  })
  renderWithRedux(
    <ComponentPreview componentName="not-status" />,
    { store, initialState: undefined },
  )
  fireEvent.contextMenu(screen.getByTestId('unconfigured-light-placeholder'))
  expect(screen.queryByText('Open Status Indicator Creator'))
    .not.toBeInTheDocument()
})
