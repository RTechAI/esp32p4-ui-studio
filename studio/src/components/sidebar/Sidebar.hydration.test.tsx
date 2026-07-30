import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { act } from 'react-dom/test-utils'
import { hydrateRoot } from 'react-dom/client'
import { screen } from '@testing-library/react'
import { TextEncoder } from 'util'

Object.assign(global, { TextEncoder })
const { renderToString } = require('react-dom/server')

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
  forgeUIWidgetDefinitions,
} from '~forgeui/widgets/ForgeUIWidgetRegistry'

const Dnd = DndProvider as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
>

const Tray = ({ store }: { store: any }) => (
  <ChakraProvider>
    <Dnd backend={HTML5Backend}>
      <Provider store={store}>
        <Sidebar />
      </Provider>
    </Dnd>
  </ChakraProvider>
)

const hydrationFailure = (
  value: unknown,
) => /hydration|did not match|server-rendered html|expected server html|validatedomnesting/i
  .test(String(value))

const renderServer = (element: React.ReactElement) => {
  const originalError = console.error
  console.error = (...args: unknown[]) => {
    if (!/useLayoutEffect does nothing on the server/i.test(
      String(args[0]),
    )) {
      originalError(...args)
    }
  }
  try {
    return renderToString(element)
  } finally {
    console.error = originalError
  }
}

describe('Widget Tray hydration', () => {
  beforeEach(() => {
    localStorage.clear()
    forgeUIClearUploadedAssets()
    clearInteractiveAssetRegistry()
  })

  it('keeps server and first-client markup deterministic, then loads assets', async () => {
    localStorage.setItem(
      'forgeui_widget_tray_collapsed_v1',
      JSON.stringify({ Basic: true }),
    )
    forgeUIAddUploadedAssets([{
      id: 'persisted-art',
      name: 'Persisted Pump.png',
      type: 'image/png',
      size: 2,
      createdAt: 1,
      browserSrc: 'data:image/png;base64,AA==',
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_persisted_pump',
      cFile: 'assets/uploads/fg_persisted_pump.c',
    }])
    registerInteractiveAsset(
      createDefaultInteractiveButtonAsset(
        'persisted-state-sheet',
        'Persisted State Sheet',
      ),
    )

    const serverMarkup = renderServer(
      <Tray store={init(storeConfig as any)} />,
    )
    expect(serverMarkup).not.toContain('Persisted Pump.png')
    expect(serverMarkup).not.toContain('Persisted State Sheet')
    expect(serverMarkup).toContain('Insert Button')

    const container = document.createElement('div')
    container.innerHTML = serverMarkup
    document.body.appendChild(container)
    const errors: unknown[] = []
    const originalError = console.error
    console.error = (...args: unknown[]) => {
      errors.push(...args)
    }
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(
          container,
          <Tray store={init(storeConfig as any)} />,
        )
      })
      expect(errors.filter(hydrationFailure)).toEqual([])
      expect(await screen.findByRole('button', {
        name: 'Insert Persisted Pump.png',
      })).toBeInTheDocument()
      expect(await screen.findByRole('button', {
        name: 'Insert Persisted State Sheet',
      })).toBeInTheDocument()
      expect(screen.queryByRole('button', {
        name: 'Insert Button',
      })).not.toBeInTheDocument()
      expect(screen.getByRole('button', {
        name: /Assets 7/,
      })).toBeInTheDocument()
      expect(container.querySelector('[role="button"] button')).toBeNull()
    } finally {
      console.error = originalError
      await act(async () => root?.unmount())
      container.remove()
    }
  })

  it('keeps registry order and contents immutable across SSR renders', () => {
    const before = forgeUIWidgetDefinitions.map(item => item.type)
    const first = renderServer(
      <Tray store={init(storeConfig as any)} />,
    )
    const second = renderServer(
      <Tray store={init(storeConfig as any)} />,
    )
    expect(second).toBe(first)
    expect(forgeUIWidgetDefinitions.map(item => item.type)).toEqual(before)
  })
})
