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
  'Radio',
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
