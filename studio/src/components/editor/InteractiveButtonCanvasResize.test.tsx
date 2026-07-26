import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'

import { storeConfig } from '~core/store'
import ForgeUILayoutPanel from '~forgeui/ForgeUILayoutPanel'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import ComponentPreview from './ComponentPreview'
import {
  CANVAS_RESIZE_MIN_SIZE,
  clampCanvasResizeGeometry,
} from './PreviewContainer'

let mockRndProps: any

jest.mock('react-rnd', () => ({
  Rnd: (props: any) => {
    mockRndProps = props
    const handles = props.resizeHandleComponent || {}

    return (
      <div className="react-draggable">
        {props.children}
        {Object.entries(handles).map(([direction, handle]) => (
          <div key={direction}>{handle as React.ReactNode}</div>
        ))}
      </div>
    )
  },
}))

const renderButton = (
  selected = true,
  interactiveAssetId?: string,
) => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveButton',
    rootParentType: 'InteractiveButton',
    testId: 'resizable-button',
    props: {
      positionMode: 'absolute',
      x: 40,
      y: 50,
      w: 160,
      h: 80,
      interactiveAssetId,
    },
  })
  if (!selected) {
    store.dispatch.components.unselect()
  }

  const DndProviderWithChildren = DndProvider as React.ComponentType<
    React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
  >
  const rendered = render(
    <ChakraProvider resetCSS theme={theme}>
      <DndProviderWithChildren backend={HTML5Backend}>
        <Provider store={store}>
          <ComponentPreview componentName="resizable-button" />
          {selected && <ForgeUILayoutPanel />}
        </Provider>
      </DndProviderWithChildren>
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
  const element = document.createElement('div')
  element.style.width = `${width}px`
  element.style.height = `${height}px`
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
  store.getState().components.present.components[
    'resizable-button'
  ].props

describe('Interactive Button canvas resizing', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('shows all eight handles only while selected', () => {
    const { unmount } = renderButton()
    expect(screen.getAllByTestId(
      /canvas-resize-zone-/,
    )).toHaveLength(8)
    expect(mockRndProps.enableResizing).toEqual({
      top: true,
      right: true,
      bottom: true,
      left: true,
      topRight: true,
      bottomRight: true,
      bottomLeft: true,
      topLeft: true,
    })

    unmount()
    renderButton(false)
    expect(screen.queryByTestId(
      /canvas-resize-zone-/,
    )).not.toBeInTheDocument()
    expect(mockRndProps.enableResizing).toBe(false)
  })

  it('uses transparent border hit zones with standard resize cursors', () => {
    renderButton()

    const zones = screen.getAllByTestId(/canvas-resize-zone-/)
    expect(zones).toHaveLength(8)
    zones.forEach(zone => {
      expect(zone).toHaveStyle({ background: 'transparent' })
      expect(zone).not.toHaveStyle({ borderRadius: '50%' })
    })
    expect(mockRndProps.resizeHandleStyles).toMatchObject({
      left: { cursor: 'ew-resize' },
      right: { cursor: 'ew-resize' },
      top: { cursor: 'ns-resize' },
      bottom: { cursor: 'ns-resize' },
      topLeft: { cursor: 'nwse-resize' },
      bottomRight: { cursor: 'nwse-resize' },
      topRight: { cursor: 'nesw-resize' },
      bottomLeft: { cursor: 'nesw-resize' },
    })
  })

  it('resizes the right edge without changing X', () => {
    const { store } = renderButton()
    resize('right', 210, 80, 40, 50)
    expect(geometry(store)).toMatchObject({
      w: '210', h: '80', x: '40', y: '50',
    })
  })

  it('resizes the left edge while anchoring the right edge', () => {
    const { store } = renderButton()
    resize('left', 130, 80, 70, 50)
    const props = geometry(store)
    expect(props).toMatchObject({
      w: '130', h: '80', x: '70', y: '50',
    })
    expect(Number(props.x) + Number(props.w)).toBe(200)
  })

  it('resizes the bottom edge without changing Y', () => {
    const { store } = renderButton()
    resize('bottom', 160, 125, 40, 50)
    expect(geometry(store)).toMatchObject({
      w: '160', h: '125', x: '40', y: '50',
    })
  })

  it('resizes the top edge while anchoring the bottom edge', () => {
    const { store } = renderButton()
    resize('top', 160, 60, 40, 70)
    const props = geometry(store)
    expect(props).toMatchObject({
      w: '160', h: '60', x: '40', y: '70',
    })
    expect(Number(props.y) + Number(props.h)).toBe(130)
  })

  it('updates both dimensions from a corner and keeps selection', () => {
    const { store } = renderButton()
    resize('bottomRight', 220, 140, 40, 50, true)
    expect(geometry(store)).toMatchObject({
      w: '220', h: '140', x: '40', y: '50',
    })
    // @ts-ignore Store state is wrapped by redux-undo.
    expect(store.getState().components.present.selectedId)
      .toBe('resizable-button')
  })

  it.each([
    ['topLeft', 130, 65, 70, 65],
    ['topRight', 205, 65, 40, 65],
    ['bottomRight', 205, 105, 40, 50],
    ['bottomLeft', 130, 105, 70, 50],
  ])(
    'resizes both axes from the %s corner',
    (direction, width, height, x, y) => {
      const { store } = renderButton()
      resize(direction, width, height, x, y)
      expect(geometry(store)).toMatchObject({
        w: String(width),
        h: String(height),
        x: String(x),
        y: String(y),
      })
    },
  )

  it('updates Inspector geometry live during resizing', () => {
    renderButton()
    resize('bottomRight', 205, 115, 40, 50)
    expect(screen.getByLabelText('X')).toHaveValue('40')
    expect(screen.getByLabelText('Y')).toHaveValue('50')
    expect(screen.getByLabelText('Width')).toHaveValue('205')
    expect(screen.getByLabelText('Height')).toHaveValue('115')
  })

  it('uses the canvas minimum and does not press or click the preview', () => {
    const { store } = renderButton()
    const select = jest.spyOn(store.dispatch.components, 'select')
    const placeholder = screen.getByTestId(
      'unconfigured-button-placeholder',
    )

    resize('topLeft', 1, 2, 190, 128)

    expect(geometry(store)).toMatchObject({
      w: String(CANVAS_RESIZE_MIN_SIZE),
      h: String(CANVAS_RESIZE_MIN_SIZE),
    })
    expect(placeholder).toHaveAttribute('data-layout', 'compact')
    expect(select).toHaveBeenCalledTimes(1)
  })

  it.each([
    [
      'right edge',
      {
        width: 80, height: 40, x: 170, y: 20,
        direction: 'right' as const,
      },
      { w: 30, h: 40, x: 170, y: 20 },
    ],
    [
      'left edge',
      {
        width: 230, height: 40, x: -30, y: 20,
        direction: 'left' as const,
      },
      { w: 200, h: 40, x: 0, y: 20 },
    ],
    [
      'bottom edge',
      {
        width: 40, height: 90, x: 20, y: 80,
        direction: 'bottom' as const,
      },
      { w: 40, h: 20, x: 20, y: 80 },
    ],
    [
      'top edge',
      {
        width: 40, height: 130, x: 20, y: -30,
        direction: 'top' as const,
      },
      { w: 40, h: 100, x: 20, y: 0 },
    ],
    [
      'corner axes',
      {
        width: 80, height: 90, x: 170, y: 80,
        direction: 'bottomRight' as const,
      },
      { w: 30, h: 20, x: 170, y: 80 },
    ],
  ])('clamps the %s continuously inside the canvas', (_, input, expected) => {
    expect(clampCanvasResizeGeometry({
      ...input,
      canvasWidth: 200,
      canvasHeight: 100,
    })).toEqual(expected)
  })

  it.each([
    [
      'right edge',
      {
        width: 250, height: 125, x: 40, y: 0,
        direction: 'right' as const,
      },
      { w: 160, h: 80, x: 40, y: 0 },
    ],
    [
      'left edge',
      {
        width: 220, height: 110, x: -20, y: 0,
        direction: 'left' as const,
      },
      { w: 200, h: 100, x: 0, y: 0 },
    ],
    [
      'bottom edge',
      {
        width: 160, height: 80, x: 0, y: 60,
        direction: 'bottom' as const,
      },
      { w: 80, h: 40, x: 0, y: 60 },
    ],
    [
      'top edge',
      {
        width: 200, height: 100, x: 0, y: -20,
        direction: 'top' as const,
      },
      { w: 160, h: 80, x: 0, y: 0 },
    ],
    [
      'bottom-right corner',
      {
        width: 200, height: 100, x: 150, y: 75,
        direction: 'bottomRight' as const,
      },
      { w: 50, h: 25, x: 150, y: 75 },
    ],
  ])(
    'preserves aspect ratio while clamping the %s',
    (_, input, expected) => {
      expect(clampCanvasResizeGeometry({
        ...input,
        canvasWidth: 200,
        canvasHeight: 100,
        aspectRatio: 2,
      })).toEqual(expected)
    },
  )

  it('preserves normal canvas selection interaction after resizing', () => {
    const { store } = renderButton()
    resize('right', 180, 80, 40, 50, true)
    act(() => {
      store.dispatch.components.unselect()
    })

    fireEvent.click(screen.getByTestId(
      'unconfigured-button-placeholder',
    ))

    // @ts-ignore Store state is wrapped by redux-undo.
    expect(store.getState().components.present.selectedId)
      .toBe('resizable-button')
    expect(mockRndProps.disableDragging).toBe(true)
  })

  it('contain-fits configured artwork to the live canvas dimensions', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset('configured-button'),
      normalAssetId: 'normal-art',
      pressedAssetId: 'pressed-art',
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'normal-art',
        name: 'Normal art',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'normal.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'normal_art',
        cFile: 'normal_art.c',
      },
      {
        id: 'pressed-art',
        name: 'Pressed art',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'pressed.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'pressed_art',
        cFile: 'pressed_art.c',
      },
    ])

    const { store } = renderButton()
    act(() => {
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'interactiveAssetId',
        value: asset.id,
      })
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'w',
        value: '240',
      })
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'h',
        value: '130',
      })
    })

    expect(screen.getByAltText('Normal art')).toHaveStyle({
      width: '240px',
      height: '130px',
      objectFit: 'contain',
    })
  })

  it('normalizes legacy bounds to artwork aspect ratio on resize', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset('ratio-button'),
      normalAssetId: 'ratio-normal',
      pressedAssetId: 'ratio-pressed',
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'ratio-normal',
        name: 'Ratio normal',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'ratio-normal.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'ratio_normal',
        cFile: 'ratio_normal.c',
        width: 200,
        height: 100,
      },
      {
        id: 'ratio-pressed',
        name: 'Ratio pressed',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'ratio-pressed.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'ratio_pressed',
        cFile: 'ratio_pressed.c',
        width: 200,
        height: 100,
      },
    ])

    const { store } = renderButton(true, asset.id)
    act(() => {
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'h',
        value: '120',
      })
    })

    expect(geometry(store)).toMatchObject({
      w: 160,
      h: '120',
    })
    expect(mockRndProps.lockAspectRatio).toBe(2)

    resize('right', 200, 100, 40, 50)

    expect(geometry(store)).toMatchObject({
      w: '200',
      h: '100',
      x: '40',
      y: '50',
    })
    expect(screen.getByAltText('Ratio normal')).toHaveStyle({
      width: '200px',
      height: '100px',
      objectFit: 'contain',
    })
  })

  it('backfills intrinsic dimensions and enables proportional resizing', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset(
        'runtime-dimensions-button',
      ),
      normalAssetId: 'runtime-normal',
      pressedAssetId: 'runtime-pressed',
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'runtime-normal',
        name: 'Runtime normal',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'runtime-normal.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'runtime_normal',
        cFile: 'runtime_normal.c',
      },
      {
        id: 'runtime-pressed',
        name: 'Runtime pressed',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'runtime-pressed.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'runtime_pressed',
        cFile: 'runtime_pressed.c',
      },
    ])

    const { store } = renderButton(true, asset.id)
    expect(mockRndProps.lockAspectRatio).toBe(false)

    act(() => {
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'w',
        value: '200',
      })
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'h',
        value: '200',
      })
    })

    const image = screen.getByAltText('Runtime normal')
    Object.defineProperties(image, {
      naturalWidth: {
        configurable: true,
        value: 200,
      },
      naturalHeight: {
        configurable: true,
        value: 100,
      },
    })
    fireEvent.load(image)

    expect(mockRndProps.lockAspectRatio).toBe(2)
    expect(geometry(store)).toMatchObject({
      w: '200',
      h: '200',
    })

    resize('right', 240, 200, 40, 50)
    expect(geometry(store)).toMatchObject({
      w: '240',
      h: '120',
    })
  })

  it('replaces onboarding in the same selected geometry after assignment', () => {
    const { store, container } = renderButton()
    const geometryOwner =
      container.querySelector('.react-draggable')
    expect(screen.getByTestId(
      'unconfigured-button-placeholder',
    )).toBeInTheDocument()

    const asset = {
      ...createDefaultInteractiveButtonAsset(
        'assigned-in-place',
      ),
      normalAssetId: 'assigned-normal',
      pressedAssetId: 'assigned-pressed',
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'assigned-normal',
        name: 'Assigned normal',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'assigned-normal.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'assigned_normal',
        cFile: 'assigned_normal.c',
        width: 200,
        height: 100,
      },
      {
        id: 'assigned-pressed',
        name: 'Assigned pressed',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'assigned-pressed.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'assigned_pressed',
        cFile: 'assigned_pressed.c',
        width: 200,
        height: 100,
      },
    ])

    act(() => {
      store.dispatch.components.updateProps({
        id: 'resizable-button',
        name: 'interactiveAssetId',
        value: asset.id,
      })
    })

    expect(screen.queryByTestId(
      'unconfigured-button-placeholder',
    )).not.toBeInTheDocument()
    expect(screen.getByAltText('Assigned normal'))
      .toBeInTheDocument()
    expect(screen.getAllByTestId(
      /configured-button-preview/,
    )).toHaveLength(1)
    expect(container.querySelector('.react-draggable'))
      .toBe(geometryOwner)
    expect(geometry(store)).toMatchObject({
      x: 40,
      y: 50,
      w: 160,
      h: 80,
      interactiveAssetId: asset.id,
    })
    // @ts-ignore Store state is wrapped by redux-undo.
    expect(store.getState().components.present.selectedId)
      .toBe('resizable-button')
  })

  it('persists identical normalized geometry live and on stop', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset('stable-ratio-button'),
      normalAssetId: 'stable-normal',
      pressedAssetId: 'stable-pressed',
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      {
        id: 'stable-normal',
        name: 'Stable normal',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'stable-normal.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'stable_normal',
        cFile: 'stable_normal.c',
        width: 200,
        height: 100,
      },
      {
        id: 'stable-pressed',
        name: 'Stable pressed',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'stable-pressed.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'stable_pressed',
        cFile: 'stable_pressed.c',
        width: 200,
        height: 100,
      },
    ])

    const { store } = renderButton(true, asset.id)
    resize('bottomRight', 300, 170, 40, 50)
    const liveGeometry = {
      ...geometry(store),
    }
    resize('bottomRight', 300, 170, 40, 50, true)

    expect(geometry(store)).toMatchObject(liveGeometry)
    expect(Number(liveGeometry.w) / Number(liveGeometry.h))
      .toBe(2)
  })
})
