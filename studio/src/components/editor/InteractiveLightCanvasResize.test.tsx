import React from 'react'
import {
  act,
  render,
  screen,
} from '@testing-library/react'
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
  createDefaultInteractiveLightAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import ComponentPreview from './ComponentPreview'

let mockRndProps: any
jest.mock('react-rnd', () => ({
  Rnd: (props: any) => {
    mockRndProps = props
    return (
      <div className="react-draggable">
        {props.children}
        {Object.values(
          props.resizeHandleComponent || {},
        ) as React.ReactNode[]}
      </div>
    )
  },
}))

const renderLight = () => {
  // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
  const store = init(storeConfig)
  store.dispatch.components.addComponent({
    parentName: 'root',
    type: 'InteractiveLight',
    rootParentType: 'InteractiveLight',
    testId: 'light',
    props: {
      positionMode: 'absolute',
      x: 20,
      y: 30,
      w: 32,
      h: 32,
    },
  })
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
          <ComponentPreview componentName="light" />
          <ForgeUILayoutPanel />
        </Provider>
      </ProviderWithChildren>
    </ChakraProvider>,
  )
  return { store, ...rendered }
}

describe('Interactive Light shared canvas resizing', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('shows the shared eight-zone selection border', () => {
    renderLight()
    expect(screen.getAllByTestId(
      /canvas-resize-zone-/,
    )).toHaveLength(8)
    expect(mockRndProps.enableResizing).toMatchObject({
      top: true,
      right: true,
      bottom: true,
      left: true,
      topRight: true,
      bottomRight: true,
      bottomLeft: true,
      topLeft: true,
    })
    expect(mockRndProps.minWidth).toBe(10)
    expect(mockRndProps.minHeight).toBe(10)
  })

  it('assigns artwork in place and resizes geometry without toggling', () => {
    const { store, container } = renderLight()
    const geometryOwner =
      container.querySelector('.react-draggable')
    const light = {
      ...createDefaultInteractiveLightAsset('asset'),
      offAssetId: 'off',
      onAssetId: 'on',
    }
    registerInteractiveAsset(light)
    forgeUIAddUploadedAssets([
      {
        id: 'off',
        name: 'off.png',
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: 'off.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'off',
        cFile: 'off.c',
      },
      {
        id: 'on',
        name: 'on.png',
        type: 'image/png',
        size: 1,
        createdAt: 2,
        browserSrc: 'on.png',
        kind: 'uploaded',
        exportStatus: 'lvgl_ready',
        lvgl: 'on',
        cFile: 'on.c',
      },
    ])
    act(() => {
      store.dispatch.components.updateProps({
        id: 'light',
        name: 'interactiveAssetId',
        value: light.id,
      })
    })

    expect(screen.queryByTestId(
      'unconfigured-light-placeholder',
    )).not.toBeInTheDocument()
    expect(screen.getByAltText('off.png'))
      .toBeInTheDocument()
    expect(container.querySelector('.react-draggable'))
      .toBe(geometryOwner)

    const element = document.createElement('div')
    element.style.width = '64px'
    element.style.height = '48px'
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    }
    act(() => {
      mockRndProps.onResizeStart(event)
      mockRndProps.onResize(
        event,
        'bottomRight',
        element,
        {},
        { x: 20, y: 30 },
      )
    })

    const props =
      (store.getState().components as any)
        .present.components.light.props
    expect(props).toMatchObject({
      x: '20',
      y: '30',
      w: '64',
      h: '48',
      interactiveAssetId: light.id,
    })
    expect(screen.getByLabelText('Width')).toHaveValue('64')
    expect(screen.getByLabelText('Height')).toHaveValue('48')
    expect(screen.getByAltText('off.png'))
      .toBeInTheDocument()
  })
})
