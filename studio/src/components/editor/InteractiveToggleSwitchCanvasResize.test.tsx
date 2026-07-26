import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { storeConfig } from '~core/store'
import ForgeUILayoutPanel from '~forgeui/ForgeUILayoutPanel'
import ComponentPreview from './ComponentPreview'

let mockRndProps: any
jest.mock('react-rnd', () => ({
  Rnd: (props: any) => {
    mockRndProps = props
    return (
      <div style={props.style}>
        {props.children}
        {Object.values(
          props.resizeHandleComponent || {},
        ) as React.ReactNode[]}
      </div>
    )
  },
}))

const renderToggle = (selected = true) => {
  // @ts-ignore test store inference is wider than this fixture.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveToggleSwitch',
    rootParentType: 'InteractiveToggleSwitch',
    testId: 'toggle-resize',
    props: {
      positionMode: 'absolute',
      x: 20, y: 30, w: 80, h: 60,
    },
  })
  if (!selected) store.dispatch.components.unselect()
  const Dnd = DndProvider as React.ComponentType<
    React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
  >
  const view = render(
    <ChakraProvider resetCSS theme={theme}>
      <Dnd backend={HTML5Backend}>
        <Provider store={store}>
          <ComponentPreview componentName="toggle-resize" />
          {selected && <ForgeUILayoutPanel />}
        </Provider>
      </Dnd>
    </ChakraProvider>,
  )
  return { store, ...view }
}

const resize = (
  direction: string,
  width: number,
  height: number,
  x: number,
  y: number,
) => {
  const parent = document.createElement('div')
  Object.defineProperty(parent, 'getBoundingClientRect', {
    value: () => ({
      width: 200, height: 150,
      x: 0, y: 0, top: 0, left: 0,
      right: 200, bottom: 150,
      toJSON: () => undefined,
    }),
  })
  const element = document.createElement('div')
  element.style.width = `${width}px`
  element.style.height = `${height}px`
  parent.appendChild(element)
  const event = {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  }
  act(() => {
    mockRndProps.onResizeStart(event)
    mockRndProps.onResize(
      event, direction, element, {}, { x, y },
    )
  })
}

const geometry = (store: any) =>
  store.getState().components.present.components[
    'toggle-resize'
  ].props

describe('Interactive Toggle shared Canvas resizing', () => {
  it('shows the cyan eight-zone selection border without dots', () => {
    renderToggle()
    expect(mockRndProps.style.border).toBe('1px solid #22d3ee')
    expect(screen.getAllByTestId(/canvas-resize-zone-/))
      .toHaveLength(8)
    expect(mockRndProps.minWidth).toBe(10)
    expect(mockRndProps.minHeight).toBe(10)
    expect(screen.queryByTestId(/resize-dot/))
      .not.toBeInTheDocument()
  })

  it('hides all resize controls while unselected', () => {
    renderToggle(false)
    expect(mockRndProps.enableResizing).toBe(false)
    expect(mockRndProps.style.border).toBe('none')
    expect(screen.queryByTestId(/canvas-resize-zone-/))
      .not.toBeInTheDocument()
  })

  it.each([
    ['right', 120, 60, 20, 30, { x: '20', y: '30', w: '120', h: '60' }],
    ['left', 100, 60, 0, 30, { x: '0', y: '30', w: '100', h: '60' }],
    ['bottom', 80, 100, 20, 30, { x: '20', y: '30', w: '80', h: '100' }],
    ['top', 80, 80, 20, 10, { x: '20', y: '10', w: '80', h: '80' }],
    ['bottomRight', 110, 90, 20, 30, { x: '20', y: '30', w: '110', h: '90' }],
  ])('updates live geometry from %s', (
    direction, width, height, x, y, expected,
  ) => {
    const { store } = renderToggle()
    resize(
      direction as string,
      width as number,
      height as number,
      x as number,
      y as number,
    )
    expect(geometry(store)).toMatchObject(expected)
    expect(screen.getByLabelText('Width'))
      .toHaveValue(expected.w)
    expect(screen.getByLabelText('Height'))
      .toHaveValue(expected.h)
  })

  it('enforces Canvas bounds and minimum size', () => {
    const { store } = renderToggle()
    resize('bottomRight', 400, 300, 20, 30)
    expect(geometry(store)).toMatchObject({
      x: '20', y: '30', w: '180', h: '120',
    })
    resize('topLeft', 2, 3, 198, 147)
    expect(Number(geometry(store).w)).toBeGreaterThanOrEqual(10)
    expect(Number(geometry(store).h)).toBeGreaterThanOrEqual(10)
  })
})
