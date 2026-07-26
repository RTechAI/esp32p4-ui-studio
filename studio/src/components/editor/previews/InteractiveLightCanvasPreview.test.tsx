import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  act,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createDefaultInteractiveLightAsset,
  registerInteractiveAsset,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveLightCanvasPreview from './InteractiveLightCanvasPreview'
import * as persistence from '~forgeui/interactive/ForgeUIInteractiveAssetPersistence'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'

jest.mock(
  '~forgeui/interactive/ForgeUIInteractiveAssetPersistence',
  () => ({
    ...(jest.requireActual(
      '~forgeui/interactive/ForgeUIInteractiveAssetPersistence',
    ) as object),
    saveInteractiveAssets: jest.fn(),
  }),
)

const createAsset = (id: string): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`,
  cFile: `${id}.c`,
})

const component = (
  id: string,
  interactiveAssetId: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'InteractiveLight',
  props: { interactiveAssetId, w: '32', h: '32' },
  children: [],
})

describe('Interactive Light Canvas preview', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
    ;(persistence.saveInteractiveAssets as jest.Mock).mockClear()
  })

  it('renders independent OFF and ON instances', () => {
    const offAsset = createAsset('off')
    const onAsset = createAsset('on')
    forgeUIAddUploadedAssets([offAsset, onAsset])

    const offLight = {
      ...createDefaultInteractiveLightAsset('off-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
      initialState: 'off' as const,
    }
    const onLight = {
      ...createDefaultInteractiveLightAsset('on-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
      initialState: 'on' as const,
    }
    registerInteractiveAsset(offLight)
    registerInteractiveAsset(onLight)

    render(
      <ChakraProvider>
        <InteractiveLightCanvasPreview component={component('one', offLight.id)} />
        <InteractiveLightCanvasPreview component={component('two', onLight.id)} />
      </ChakraProvider>,
    )

    expect(screen.getByAltText(offAsset.name)).toBeInTheDocument()
    expect(screen.getByAltText(onAsset.name)).toBeInTheDocument()
  })

  it('rejects a Button asset ID through kind-aware lookup', () => {
    const button = createDefaultInteractiveButtonAsset('button')
    registerInteractiveAsset(button)

    render(
      <ChakraProvider>
        <InteractiveLightCanvasPreview component={component('light', button.id)} />
      </ChakraProvider>,
    )

    expect(screen.getByTestId(
      'unconfigured-light-placeholder',
    )).toBeInTheDocument()
  })

  it('requires both visuals and replaces same-id artwork without layering', () => {
    const offAsset = createAsset('off')
    const onAsset = createAsset('on')
    const replacement = createAsset('replacement')
    forgeUIAddUploadedAssets([
      offAsset,
      onAsset,
      replacement,
    ])
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      offAssetId: offAsset.id,
    }
    registerInteractiveAsset(light)
    render(
      <ChakraProvider>
        <InteractiveLightCanvasPreview
          component={component('light-component', light.id)}
        />
      </ChakraProvider>,
    )
    expect(screen.getAllByTestId(
      'unconfigured-light-placeholder',
    )).toHaveLength(1)
    expect(screen.queryByAltText(offAsset.name))
      .not.toBeInTheDocument()

    act(() => {
      updateInteractiveAssetByKind(
        light.id,
        'light',
        { onAssetId: onAsset.id },
      )
      window.dispatchEvent(new Event(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      ))
    })
    expect(screen.queryByTestId(
      'unconfigured-light-placeholder',
    )).not.toBeInTheDocument()
    expect(screen.getByAltText(offAsset.name))
      .toBeInTheDocument()

    act(() => {
      updateInteractiveAssetByKind(
        light.id,
        'light',
        { offAssetId: replacement.id },
      )
      window.dispatchEvent(new Event(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      ))
    })
    expect(screen.getByAltText(replacement.name))
      .toBeInTheDocument()
    expect(screen.queryByAltText(offAsset.name))
      .not.toBeInTheDocument()
    expect(screen.getAllByTestId(
      'interactive-light-preview',
    )).toHaveLength(1)
  })

  it.each([
    ['off', 'off.png', 'on.png'],
    ['on', 'on.png', 'off.png'],
  ] as const)(
    'toggles locally from initial %s and returns on the second click',
    (initialState, initialImage, toggledImage) => {
      const offAsset = createAsset('off')
      const onAsset = createAsset('on')
      forgeUIAddUploadedAssets([offAsset, onAsset])
      const light = {
        ...createDefaultInteractiveLightAsset('light'),
        offAssetId: offAsset.id,
        onAssetId: onAsset.id,
        initialState,
      }
      registerInteractiveAsset(light)
      const selectionClick = jest.fn()

      render(
        <ChakraProvider>
          <div onClick={selectionClick}>
            <InteractiveLightCanvasPreview
              component={component('light-component', light.id)}
            />
          </div>
        </ChakraProvider>,
      )

      const preview = screen.getByTestId('interactive-light-preview')
      expect(screen.getByAltText(initialImage)).toBeInTheDocument()

      fireEvent.click(preview)
      expect(screen.getByAltText(toggledImage)).toBeInTheDocument()
      expect(selectionClick).toHaveBeenCalledTimes(1)

      fireEvent.click(preview)
      expect(screen.getByAltText(initialImage)).toBeInTheDocument()
      expect(light.initialState).toBe(initialState)
      expect(persistence.saveInteractiveAssets).not.toHaveBeenCalled()
    },
  )
})
