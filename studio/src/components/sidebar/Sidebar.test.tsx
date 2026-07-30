import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import Sidebar from './Sidebar'
import { storeConfig } from '~core/store'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  FORGEUI_OPEN_AI_PLAYGROUND_EVENT,
} from '~forgeui/ForgeUINavigation'

const Dnd = DndProvider as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
>

const renderTray = () => {
  const store: any = init(storeConfig as any)
  render(
    <ChakraProvider>
      <Dnd backend={HTML5Backend}>
        <Provider store={store}>
          <Sidebar />
        </Provider>
      </Dnd>
    </ChakraProvider>,
  )
  return store
}

describe('ForgeUI Widget Tray', () => {
  beforeEach(() => {
    localStorage.clear()
    forgeUIClearUploadedAssets()
    clearInteractiveAssetRegistry()
  })

  it('searches names and common LVGL terminology', () => {
    renderTray()
    const search = screen.getByRole('textbox', {
      name: 'Search widgets',
    })
    fireEvent.change(search, { target: { value: 'gauge' } })
    expect(screen.getByRole('button', {
      name: 'Insert Arc',
    })).toBeInTheDocument()
    expect(screen.getByRole('button', {
      name: 'Insert Scale',
    })).toBeInTheDocument()
    fireEvent.change(search, {
      target: { value: 'quantum flux capacitor' },
    })
    expect(screen.getByTestId('widget-tray-empty-search'))
      .toBeInTheDocument()
  })

  it('uses a constrained vertical scroller with a fixed search header', () => {
    renderTray()
    expect(screen.getByTestId('widget-tray')).toHaveStyle({
      overflow: 'hidden',
    })
    const header = screen.getByTestId('widget-tray-header')
    const scroller = screen.getByTestId('widget-tray-scroll-region')
    expect(scroller).toHaveStyle({
      overflowX: 'hidden',
      overflowY: 'auto',
    })
    expect(scroller.scrollWidth).toBeLessThanOrEqual(scroller.clientWidth)
    expect(scroller.contains(header)).toBe(false)
    screen.getAllByTestId('widget-tray-row').forEach(row => {
      expect(row).toHaveStyle({
        width: '100%',
        overflow: 'hidden',
      })
    })
    expect(screen.getByTestId('widget-dashboard-empty'))
      .toHaveTextContent('No dashboard widgets registered yet.')
  })

  it('collapses categories and inserts by click or keyboard', () => {
    const store = renderTray()
    const basic = screen.getByRole('button', { name: /Basic 10/ })
    fireEvent.click(basic)
    expect(screen.queryByRole('button', {
      name: 'Insert Button',
    })).not.toBeInTheDocument()
    fireEvent.click(basic)
    fireEvent.click(screen.getByRole('button', {
      name: 'Insert Button',
    }))
    fireEvent.keyDown(screen.getByRole('button', {
      name: 'Insert Heading',
    }), { key: 'Enter' })
    const state = store.getState().components.present
    const inserted = Object.values(state.components)
    expect(inserted.map((item: any) => item.type))
      .toEqual(expect.arrayContaining(['Button', 'Heading']))
  })

  it('participates in the normal undo and redo history', () => {
    const store = renderTray()
    fireEvent.click(screen.getByRole('button', {
      name: 'Insert Chart',
    }))
    expect(store.getState().components.present.components.root.children)
      .toHaveLength(1)
    store.dispatch(UndoActionCreators.undo())
    expect(store.getState().components.present.components.root.children)
      .toHaveLength(0)
    store.dispatch(UndoActionCreators.redo())
    expect(store.getState().components.present.components.root.children)
      .toHaveLength(1)
  })

  it('inserts artwork and preserves interactive state-sheet metadata', () => {
    forgeUIAddUploadedAssets([{
      id: 'artwork',
      name: 'Pump.png',
      type: 'image/png',
      size: 20,
      createdAt: 1,
      browserSrc: 'data:image/png;base64,AA==',
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_pump',
      cFile: 'assets/uploads/fg_pump.c',
    }])
    const interactive = createDefaultInteractiveButtonAsset(
      'start-button',
      'Start State Sheet',
    )
    registerInteractiveAsset(interactive)
    const store = renderTray()
    fireEvent.click(screen.getByRole('button', {
      name: 'Insert Pump.png',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Insert Start State Sheet',
    }))
    const components = Object.values(
      store.getState().components.present.components,
    ) as IComponent[]
    expect(components.find(item => item.type === 'Image')?.props)
      .toMatchObject({ uploadedAssetId: 'artwork' })
    expect(
      components.find(item => item.type === 'InteractiveButton')?.props,
    ).toMatchObject({ interactiveAssetId: 'start-button' })
  })

  it('truncates a long asset name while keeping Insert and Edit separate', () => {
    const longName =
      'Packaging Line Emergency Stop State Sheet With A Very Long Name'
    registerInteractiveAsset(
      createDefaultInteractiveButtonAsset('long-asset', longName),
    )
    const navigation = jest.fn()
    window.addEventListener(
      FORGEUI_OPEN_AI_PLAYGROUND_EVENT,
      navigation,
    )
    renderTray()
    const insert = screen.getByRole('button', {
      name: `Insert ${longName}`,
    })
    const label = screen.getByTitle(longName)
    expect(label).toHaveStyle({
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    })
    const edit = screen.getByRole('button', {
      name: `Edit ${longName}`,
    })
    expect(insert.contains(edit)).toBe(false)
    fireEvent.click(edit)
    expect(navigation).toHaveBeenCalledTimes(1)
    window.removeEventListener(
      FORGEUI_OPEN_AI_PLAYGROUND_EVENT,
      navigation,
    )
  })
})
