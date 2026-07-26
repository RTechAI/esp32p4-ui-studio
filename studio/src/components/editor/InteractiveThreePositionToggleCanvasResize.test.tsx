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
    return <div style={props.style}>
      {props.children}
      {Object.values(
        props.resizeHandleComponent || {},
      ) as React.ReactNode[]}
    </div>
  },
}))

const renderControl = (selected = true) => {
  // @ts-ignore test fixture has a narrower inferred store.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveThreePositionToggleSwitch',
    rootParentType: 'InteractiveThreePositionToggleSwitch',
    testId: 'three-resize',
    props: {
      positionMode: 'absolute',
      x: 20, y: 30, w: 90, h: 60,
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
          <ComponentPreview componentName="three-resize" />
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
    'three-resize'
  ].props

describe('Three-Position shared Canvas resizing', () => {
  it('shows the cyan eight-zone border only while selected', () => {
    const selected = renderControl()
    expect(mockRndProps.style.border).toBe('1px solid #22d3ee')
    expect(screen.getAllByTestId(/canvas-resize-zone-/))
      .toHaveLength(8)
    expect(screen.queryByTestId(/resize-dot/))
      .not.toBeInTheDocument()
    selected.unmount()
    renderControl(false)
    expect(mockRndProps.enableResizing).toBe(false)
    expect(screen.queryByTestId(/canvas-resize-zone-/))
      .not.toBeInTheDocument()
  })

  it.each([
    ['right', 120, 60, 20, 30, { x: '20', y: '30', w: '120', h: '60' }],
    ['left', 110, 60, 0, 30, { x: '0', y: '30', w: '110', h: '60' }],
    ['bottom', 90, 100, 20, 30, { x: '20', y: '30', w: '90', h: '100' }],
    ['top', 90, 80, 20, 10, { x: '20', y: '10', w: '90', h: '80' }],
    ['bottomRight', 120, 90, 20, 30, { x: '20', y: '30', w: '120', h: '90' }],
  ])('updates live geometry from %s', (
    direction, width, height, x, y, expected,
  ) => {
    const { store } = renderControl()
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
  })

  it('enforces Canvas boundaries and 10x10 minimum', () => {
    const { store } = renderControl()
    resize('bottomRight', 400, 300, 20, 30)
    expect(geometry(store)).toMatchObject({
      x: '20', y: '30', w: '180', h: '120',
    })
    resize('topLeft', 2, 3, 198, 147)
    expect(Number(geometry(store).w)).toBeGreaterThanOrEqual(10)
    expect(Number(geometry(store).h)).toBeGreaterThanOrEqual(10)
  })
})
