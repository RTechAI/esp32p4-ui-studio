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
  createDefaultInteractiveLightAsset,
  getInteractiveLightAsset,
  registerInteractiveAsset,
  updateInteractiveAssetByKind,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveLightCreatorHelper from './InteractiveLightCreatorHelper'

const mockUpdateProps = jest.fn()
const mockFitInteractiveLightArtwork = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({
  components: { updateProps: mockUpdateProps },
}))
jest.mock('~forgeui/interactive', () => ({
  ...jest.requireActual<object>('~forgeui/interactive'),
  fitInteractiveLightArtwork: (
    ...args: unknown[]
  ) => mockFitInteractiveLightArtwork(...args),
}))

const component = (
  id: string,
  interactiveAssetId?: string,
): IComponent => ({
  id,
  parent: 'root',
  type: 'InteractiveLight',
  props: { interactiveAssetId },
  children: [],
})

const image = (
  id: string,
  bounds?: {
    contentX: number
    contentY: number
    contentWidth: number
    contentHeight: number
  },
): ForgeUIUploadedAsset => ({
  id,
  name: id,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: id,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_${id}`,
  cFile: `${id}.c`,
  width: 100,
  height: 100,
  ...bounds,
})

describe('Interactive Light Inspector creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
    mockUpdateProps.mockClear()
    mockFitInteractiveLightArtwork.mockReset()
  })

  it('shows onboarding for an unconfigured Light', () => {
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Light not configured'))
      .toBeInTheDocument()
    expect(screen.getByText(/requires both OFF and ON visuals/))
      .toBeInTheDocument()
    expect(screen.getByRole('button', {
      name: 'Open Light Creator',
    })).toBeInTheDocument()
  })

  it('shows recovery guidance for a missing linked asset', () => {
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'light-asset')}
        />
      </ChakraProvider>,
    )
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Light Creator',
    }))
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).toMatchObject({
      target: 'interactive-light-designer',
      sourceComponentId: 'light',
    })
    expect(
      (listener.mock.calls[0][0] as CustomEvent)
        .detail.interactiveAssetId,
    ).toBeUndefined()
    expect(screen.getByText(/linked Light asset is unavailable/))
      .toBeInTheDocument()
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it('keeps a configured helper with exact-asset navigation', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    const light = {
      ...createDefaultInteractiveLightAsset('complete-light'),
      name: 'Green Status Light',
      offAssetId: 'off',
      onAssetId: 'on',
      initialState: 'on' as const,
    }
    registerInteractiveAsset(light)
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'complete-light')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('light-creator-helper'))
      .toBeInTheDocument()
    expect(screen.getByText('Interactive Light'))
      .toBeInTheDocument()
    expect(screen.getByText('Green Status Light'))
      .toBeInTheDocument()
    expect(screen.getByText(/Initial state: ON/))
      .toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Light Creator',
    }))
    expect(
      (listener.mock.calls[0][0] as CustomEvent).detail,
    ).toMatchObject({
      target: 'interactive-light-designer',
      sourceComponentId: 'light',
      interactiveAssetId: light.id,
    })
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it('keeps incomplete resolved assets in repair mode', () => {
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('incomplete'),
      offAssetId: 'missing-off',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'incomplete')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Light not configured'))
      .toBeInTheDocument()
    expect(screen.getByText(/requires both OFF and ON visuals/))
      .toBeInTheDocument()
  })

  it('updates configured content for same-id asset replacement', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('replaceable'),
      name: 'Original Light',
      offAssetId: 'off',
      onAssetId: 'on',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'replaceable')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Original Light'))
      .toBeInTheDocument()

    act(() => {
      updateInteractiveAssetByKind(
        'replaceable',
        'light',
        { name: 'Replacement Light' },
      )
      window.dispatchEvent(new Event(
        'forgeui-interactive-assets-updated',
      ))
    })
    expect(screen.getByText('Replacement Light'))
      .toBeInTheDocument()
    expect(screen.queryByText('Original Light'))
      .not.toBeInTheDocument()
  })

  it('disables fitting until both states have measured bounds', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('measure-light'),
      offAssetId: 'off',
      onAssetId: 'on',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'measure-light')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeDisabled()
    expect(screen.getByText(/measure its artwork/))
      .toBeInTheDocument()
  })

  it('enables fitting for a measured stable OFF/ON union', () => {
    forgeUIAddUploadedAssets([
      image('off', {
        contentX: 10,
        contentY: 20,
        contentWidth: 60,
        contentHeight: 50,
      }),
      image('on', {
        contentX: 15,
        contentY: 10,
        contentWidth: 70,
        contentHeight: 60,
      }),
    ])
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('fit-light'),
      offAssetId: 'off',
      onAssetId: 'on',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'fit-light')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeEnabled()
  })

  it('recognises already fitted artwork and remains idempotent', () => {
    const fullBounds = {
      contentX: 0,
      contentY: 0,
      contentWidth: 100,
      contentHeight: 100,
    }
    forgeUIAddUploadedAssets([
      image('off', fullBounds),
      image('on', fullBounds),
    ])
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset('fitted-light'),
      offAssetId: 'off',
      onAssetId: 'on',
    })
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper
          component={component('light', 'fitted-light')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeDisabled()
    expect(screen.getByText(/already fit visible artwork/))
      .toBeInTheDocument()
  })

  it('links both cropped states and fits the same component geometry', async () => {
    const bounds = {
      contentX: 10,
      contentY: 20,
      contentWidth: 80,
      contentHeight: 60,
    }
    const off = image('off', bounds)
    const on = image('on', bounds)
    const fittedOff = image('fitted-off', {
      contentX: 0,
      contentY: 0,
      contentWidth: 100,
      contentHeight: 100,
    })
    const fittedOn = image('fitted-on', {
      contentX: 0,
      contentY: 0,
      contentWidth: 100,
      contentHeight: 100,
    })
    forgeUIAddUploadedAssets([off, on, fittedOff, fittedOn])
    const light = {
      ...createDefaultInteractiveLightAsset('action-light'),
      offAssetId: off.id,
      onAssetId: on.id,
      initialState: 'on' as const,
    }
    registerInteractiveAsset(light)
    mockFitInteractiveLightArtwork.mockResolvedValue({
      bounds,
      offAsset: fittedOff,
      onAsset: fittedOn,
    })
    const selected = {
      ...component('light', light.id),
      props: {
        interactiveAssetId: light.id,
        x: '100',
        y: '50',
        w: '100',
        h: '100',
      },
    }
    render(
      <ChakraProvider>
        <InteractiveLightCreatorHelper component={selected} />
      </ChakraProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {
        name: 'Fit Bounds to Visible Artwork',
      }))
    })

    expect(getInteractiveLightAsset(light.id)).toMatchObject({
      offAssetId: fittedOff.id,
      onAssetId: fittedOn.id,
      initialState: 'on',
    })
    expect(forgeUIGetUploadedAssets().map(asset => asset.id))
      .toEqual(expect.arrayContaining([
        off.id,
        on.id,
        fittedOff.id,
        fittedOn.id,
      ]))
    expect(mockUpdateProps).toHaveBeenCalledTimes(4)
    expect(mockUpdateProps).toHaveBeenCalledWith({
      id: selected.id,
      name: 'w',
      value: '80',
    })
    expect(mockUpdateProps).toHaveBeenCalledWith({
      id: selected.id,
      name: 'h',
      value: '60',
    })
  })
})
