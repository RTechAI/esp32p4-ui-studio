import React from 'react'
import {
  act,
  render,
  screen,
} from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'

import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  registerInteractiveAsset,
  updateInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
} from '~forgeui/ForgeUINavigation'
import InteractiveButtonCanvasPreview from './InteractiveButtonCanvasPreview'

const component = (
  interactiveAssetId?: string,
): IComponent => ({
  id: 'button',
  parent: 'root',
  type: 'InteractiveButton',
  props: {
    interactiveAssetId,
    x: 10,
    y: 20,
    w: 200,
    h: 100,
  },
  children: [],
})

const image = (id: string) => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: `${id}.png`,
  kind: 'uploaded' as const,
  exportStatus: 'lvgl_ready' as const,
  lvgl: id,
  cFile: `${id}.c`,
  width: 200,
  height: 100,
})

describe('Interactive Button canvas resolution', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('renders exactly one mutually exclusive configured state', () => {
    const normal = image('normal')
    const pressed = image('pressed')
    const asset = {
      ...createDefaultInteractiveButtonAsset('asset'),
      normalAssetId: normal.id,
      pressedAssetId: pressed.id,
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([normal, pressed])

    render(
      <ChakraProvider>
        <InteractiveButtonCanvasPreview
          component={component(asset.id)}
        />
      </ChakraProvider>,
    )

    expect(screen.getAllByTestId(
      'configured-button-preview',
    )).toHaveLength(1)
    expect(screen.queryByTestId(
      'unconfigured-button-preview',
    )).not.toBeInTheDocument()
    expect(screen.queryByTestId(
      'unconfigured-button-placeholder',
    )).not.toBeInTheDocument()
  })

  it('falls back to one placeholder for missing or cleared assets', () => {
    const { rerender } = render(
      <ChakraProvider>
        <InteractiveButtonCanvasPreview
          component={component('missing')}
        />
      </ChakraProvider>,
    )
    expect(screen.getAllByTestId(
      'unconfigured-button-preview',
    )).toHaveLength(1)

    rerender(
      <ChakraProvider>
        <InteractiveButtonCanvasPreview
          component={component()}
        />
      </ChakraProvider>,
    )
    expect(screen.getAllByTestId(
      'unconfigured-button-preview',
    )).toHaveLength(1)
    expect(screen.queryByTestId(
      'configured-button-preview',
    )).not.toBeInTheDocument()
  })

  it('reacts to same-id artwork replacement without layering previews', () => {
    const normal = image('normal')
    const pressed = image('pressed')
    const replacement = image('replacement')
    const asset = {
      ...createDefaultInteractiveButtonAsset('asset'),
      normalAssetId: normal.id,
      pressedAssetId: pressed.id,
    }
    registerInteractiveAsset(asset)
    forgeUIAddUploadedAssets([
      normal,
      pressed,
      replacement,
    ])
    render(
      <ChakraProvider>
        <InteractiveButtonCanvasPreview
          component={component(asset.id)}
        />
      </ChakraProvider>,
    )

    act(() => {
      updateInteractiveAsset(asset.id, {
        normalAssetId: replacement.id,
      })
      window.dispatchEvent(new Event(
        FORGEUI_INTERACTIVE_ASSETS_UPDATED_EVENT,
      ))
    })

    expect(screen.getByAltText(replacement.name))
      .toBeInTheDocument()
    expect(screen.queryByAltText(normal.name))
      .not.toBeInTheDocument()
    expect(screen.getAllByTestId(
      'configured-button-preview',
    )).toHaveLength(1)
    expect(screen.queryByTestId(
      'unconfigured-button-preview',
    )).not.toBeInTheDocument()
  })
})
