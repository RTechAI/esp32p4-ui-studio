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
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveStatusIndicatorAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import ComponentPreview from './ComponentPreview'

let mockRndProps: any
jest.mock('react-rnd', () => ({
  Rnd: (props: any) => {
    mockRndProps = props
    return (
      <div className="react-draggable" style={props.style}>
        {props.children}
        {Object.values(
          props.resizeHandleComponent || {},
        ) as React.ReactNode[]}
      </div>
    )
  },
}))

const renderStatus = ({
  selected = true,
  configured = false,
}: {
  selected?: boolean
  configured?: boolean
} = {}) => {
  clearInteractiveAssetRegistry()
  forgeUIClearUploadedAssets()
  const asset = {
    ...createDefaultInteractiveStatusIndicatorAsset('status-asset'),
    width: 32,
    height: 32,
    offAssetId: 'off',
    onAssetId: 'on',
  }
  if (configured) {
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'off', name: 'off.png', type: 'image/png',
        size: 1, createdAt: 1, browserSrc: 'off.png',
        kind: 'uploaded' as const, exportStatus: 'lvgl_ready' as const,
        lvgl: 'off', cFile: 'off.c',
      },
      {
        id: 'on', name: 'on.png', type: 'image/png',
        size: 1, createdAt: 2, browserSrc: 'on.png',
        kind: 'uploaded' as const, exportStatus: 'lvgl_ready' as const,
        lvgl: 'on', cFile: 'on.c',
      },
    ])
  }

  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveStatusIndicator',
    rootParentType: 'InteractiveStatusIndicator',
    testId: 'status',
    props: {
      positionMode: 'absolute',
      x: 20,
      y: 30,
      w: 80,
      h: 60,
      interactiveAssetId: configured ? asset.id : undefined,
    },
  })
  if (!selected) {
    store.dispatch.components.unselect()
  }
  const ProviderWithChildren =
    DndProvider as React.ComponentType<
      React.PropsWithChildren<
        React.ComponentProps<typeof DndProvider>
      >
    >
  const rendered = render(
    <ChakraProvider resetCSS theme={theme}>
      <ProviderWithChildren backend={HTML5Backend}>
        <Provider store={store}>
          <ComponentPreview componentName="status" />
          {selected && <ForgeUILayoutPanel />}
        </Provider>
      </ProviderWithChildren>
    </ChakraProvider>,
  )
  return { store, ...rendered }
}

const resize = (
  direction: string,
  width: number,
  height: number,
  x: number,
  y: number,
  stop = false,
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
    const callback = stop
      ? mockRndProps.onResizeStop
      : mockRndProps.onResize
    callback(event, direction, element, {}, { x, y })
  })
}

const geometry = (store: any) =>
  store.getState().components.present.components.status.props

describe('Interactive Status Indicator shared canvas resizing', () => {
  it.each([false, true])(
    'shows the shared cyan eight-zone border when configured=%s',
    configured => {
      renderStatus({ configured })
      expect(mockRndProps.style.border).toBe('1px solid #22d3ee')
      expect(screen.getAllByTestId(/canvas-resize-zone-/))
        .toHaveLength(8)
      expect(screen.getAllByTestId(
        /canvas-resize-zone-(top|right|bottom|left)$/,
      )).toHaveLength(4)
      expect(screen.getAllByTestId(
        /canvas-resize-zone-(topRight|bottomRight|bottomLeft|topLeft)$/,
      )).toHaveLength(4)
      expect(mockRndProps.minWidth).toBe(10)
      expect(mockRndProps.minHeight).toBe(10)
      expect(screen.queryByTestId(/resize-dot/))
        .not.toBeInTheDocument()
    },
  )

  it('exposes no resize border or zones while unselected', () => {
    renderStatus({ selected: false })
    expect(mockRndProps.style.border).toBe('none')
    expect(mockRndProps.enableResizing).toBe(false)
    expect(screen.queryByTestId(/canvas-resize-zone-/))
      .not.toBeInTheDocument()
  })

  it.each([
    ['right', 120, 60, 20, 30, { x: '20', y: '30', w: '120', h: '60' }],
    ['left', 100, 60, 0, 30, { x: '0', y: '30', w: '100', h: '60' }],
    ['bottom', 80, 100, 20, 30, { x: '20', y: '30', w: '80', h: '100' }],
    ['top', 80, 80, 20, 10, { x: '20', y: '10', w: '80', h: '80' }],
    ['bottomRight', 110, 90, 20, 30, { x: '20', y: '30', w: '110', h: '90' }],
  ])('updates anchored geometry from the %s zone', (
    direction, width, height, x, y, expected,
  ) => {
    const { store } = renderStatus()
    resize(direction as string, width as number, height as number,
      x as number, y as number)
    expect(geometry(store)).toMatchObject(expected)
    expect(screen.getByLabelText('Width'))
      .toHaveValue(expected.w)
    expect(screen.getByLabelText('Height'))
      .toHaveValue(expected.h)
  })

  it('enforces Canvas boundaries and the shared minimum size', () => {
    const { store } = renderStatus()
    resize('bottomRight', 400, 300, 20, 30)
    expect(geometry(store)).toMatchObject({
      x: '20', y: '30', w: '180', h: '120',
    })
    resize('topLeft', 2, 3, 198, 147)
    expect(Number(geometry(store).w)).toBeGreaterThanOrEqual(10)
    expect(Number(geometry(store).h)).toBeGreaterThanOrEqual(10)
    expect(Number(geometry(store).x)).toBeGreaterThanOrEqual(0)
    expect(Number(geometry(store).y)).toBeGreaterThanOrEqual(0)
  })

  it('keeps selection and local OFF/ON state stable through resize', () => {
    const { store } = renderStatus({ configured: true })
    expect(screen.getByTestId('interactive-status-indicator-preview'))
      .toHaveAttribute('data-state', 'off')
    resize('right', 100, 60, 20, 30, true)
    expect(screen.getByTestId('interactive-status-indicator-preview'))
      .toHaveAttribute('data-state', 'off')
    expect(
      (store.getState().components as any).present.selectedId,
    ).toBe('status')
  })

  it('renders configured artwork inside authoritative component geometry', () => {
    renderStatus({ configured: true })
    expect(screen.getByTestId('status-indicator-image-bounds'))
      .toHaveStyle({
        width: '100%',
        height: '100%',
      })
  })

  it('preserves measured fitted artwork aspect ratio while resizing', () => {
    const { store } = renderStatus({ configured: true })
    act(() => {
      forgeUIUpdateUploadedAsset('off', {
        width: 80,
        height: 40,
        contentX: 0,
        contentY: 0,
        contentWidth: 80,
        contentHeight: 40,
      })
      forgeUIUpdateUploadedAsset('on', {
        width: 80,
        height: 40,
        contentX: 0,
        contentY: 0,
        contentWidth: 80,
        contentHeight: 40,
      })
    })
    expect(mockRndProps.lockAspectRatio).toBe(2)
    resize('right', 120, 60, 20, 30)
    expect(geometry(store)).toMatchObject({
      w: '120',
      h: '60',
    })
  })
})
