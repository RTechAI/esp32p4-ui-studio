import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveStatusIndicatorAsset,
  getInteractiveStatusIndicatorAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
  forgeUIUpdateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveStatusIndicatorCreatorHelper from './InteractiveStatusIndicatorCreatorHelper'

const mockUpdateProps = jest.fn()
const mockFitInteractiveLightArtwork = jest.fn()
jest.mock('~hooks/useDispatch', () => () => ({
  components: { updateProps: mockUpdateProps },
}))
jest.mock('~forgeui/interactive', () => ({
  ...jest.requireActual<object>('~forgeui/interactive'),
  fitInteractiveLightArtwork: (...args: unknown[]) =>
    mockFitInteractiveLightArtwork(...args),
}))

const component = (assetId?: string): IComponent => ({
  id: 'indicator',
  parent: 'root',
  type: 'InteractiveStatusIndicator',
  props: {
    interactiveAssetId: assetId,
    x: '100',
    y: '50',
    w: '100',
    h: '100',
  },
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

const completeAsset = (id = 'linked') => ({
  ...createDefaultInteractiveStatusIndicatorAsset(id),
  name: 'Machine Ready',
  offAssetId: 'off',
  onAssetId: 'on',
  initialState: 'on' as const,
})

describe('Interactive Status Indicator creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
    mockUpdateProps.mockClear()
    mockFitInteractiveLightArtwork.mockReset()
  })

  it('shows onboarding for an unconfigured Status Indicator', () => {
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper component={component()} />
      </ChakraProvider>,
    )
    expect(screen.getByTestId('status-indicator-creator-helper'))
      .toBeInTheDocument()
    expect(screen.getByText('Status Indicator not configured'))
      .toBeInTheDocument()
    expect(screen.getByText(/requires both OFF and ON visuals/))
      .toBeInTheDocument()
  })

  it.each([
    ['missing OFF', undefined, 'on'],
    ['missing ON', 'off', undefined],
  ])('shows repair guidance for %s visual', (_, offAssetId, onAssetId) => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveStatusIndicatorAsset('linked'),
      offAssetId,
      onAssetId,
    })
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Status Indicator not configured'))
      .toBeInTheDocument()
    expect(screen.getByText(/requires both OFF and ON visuals/))
      .toBeInTheDocument()
  })

  it('shows recovery guidance for a missing linked asset', () => {
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('missing')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText(/linked Status Indicator asset is unavailable/))
      .toBeInTheDocument()
  })

  it('keeps the configured helper and reopens the exact linked asset', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    const asset = completeAsset()
    registerInteractiveAsset(asset)
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component(asset.id)}
        />
      </ChakraProvider>,
    )

    expect(screen.getByText('Interactive Status Indicator'))
      .toBeInTheDocument()
    expect(screen.getByText('Machine Ready')).toBeInTheDocument()
    expect(screen.getByText(/Initial state: ON.*OFF\/ON artwork linked/))
      .toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Status Indicator Creator',
    }))
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      target: 'interactive-status-indicator-designer',
      sourceComponentId: 'indicator',
      interactiveAssetId: asset.id,
    })
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it('opens onboarding without creating or assigning a draft', () => {
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper component={component()} />
      </ChakraProvider>,
    )
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Status Indicator Creator',
    }))
    expect((listener.mock.calls[0][0] as CustomEvent).detail)
      .not.toHaveProperty('interactiveAssetId')
    expect(getInteractiveStatusIndicatorAsset('indicator')).toBeUndefined()
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it('disables fitting until both states have measured bounds', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset(completeAsset())
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeDisabled()
    expect(screen.getByText(/measure its artwork/)).toBeInTheDocument()
  })

  it('enables fitting after stable OFF/ON union measurement', () => {
    forgeUIAddUploadedAssets([
      image('off', {
        contentX: 10, contentY: 20,
        contentWidth: 60, contentHeight: 50,
      }),
      image('on', {
        contentX: 15, contentY: 10,
        contentWidth: 70, contentHeight: 60,
      }),
    ])
    registerInteractiveAsset(completeAsset())
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeEnabled()
  })

  it('rerenders and enables fitting as both registry measurements arrive', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset(completeAsset())
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )
    const fit = screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })
    expect(fit).toBeDisabled()

    act(() => {
      forgeUIUpdateUploadedAsset('off', {
        contentX: 10, contentY: 10,
        contentWidth: 80, contentHeight: 80,
      })
    })
    expect(fit).toBeDisabled()

    act(() => {
      forgeUIUpdateUploadedAsset('on', {
        contentX: 5, contentY: 5,
        contentWidth: 90, contentHeight: 90,
      })
    })
    expect(fit).toBeEnabled()
  })

  it('links stable cropped states, preserves originals, and fits the same component', async () => {
    const bounds = {
      contentX: 10, contentY: 20,
      contentWidth: 80, contentHeight: 60,
    }
    const off = image('off', bounds)
    const on = image('on', bounds)
    const fittedOff = image('fitted-off', {
      contentX: 0, contentY: 0,
      contentWidth: 80, contentHeight: 60,
    })
    const fittedOn = image('fitted-on', {
      contentX: 0, contentY: 0,
      contentWidth: 80, contentHeight: 60,
    })
    forgeUIAddUploadedAssets([off, on, fittedOff, fittedOn])
    registerInteractiveAsset(completeAsset())
    mockFitInteractiveLightArtwork.mockResolvedValue({
      bounds,
      offAsset: fittedOff,
      onAsset: fittedOn,
    })
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )

    await act(async () => {
      fireEvent.click(screen.getByRole('button', {
        name: 'Fit Bounds to Visible Artwork',
      }))
    })

    expect(mockFitInteractiveLightArtwork).toHaveBeenCalledWith(off, on)
    expect(getInteractiveStatusIndicatorAsset('linked')).toMatchObject({
      offAssetId: fittedOff.id,
      onAssetId: fittedOn.id,
      initialState: 'on',
    })
    expect(forgeUIGetUploadedAssets().map(asset => asset.id))
      .toEqual(expect.arrayContaining([
        off.id, on.id, fittedOff.id, fittedOn.id,
      ]))
    expect(mockUpdateProps).toHaveBeenCalledTimes(4)
    expect(mockUpdateProps).toHaveBeenCalledWith({
      id: 'indicator',
      name: 'w',
      value: '80',
    })
    expect(mockUpdateProps).toHaveBeenCalledWith({
      id: 'indicator',
      name: 'h',
      value: '60',
    })
  })

  it('recognises an already fitted pair and remains idempotent', () => {
    const fullBounds = {
      contentX: 0, contentY: 0,
      contentWidth: 100, contentHeight: 100,
    }
    forgeUIAddUploadedAssets([
      image('off', fullBounds),
      image('on', fullBounds),
    ])
    registerInteractiveAsset(completeAsset())
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorCreatorHelper
          component={component('linked')}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('button', {
      name: 'Fit Bounds to Visible Artwork',
    })).toBeDisabled()
    expect(screen.getByText(/already fit visible artwork/))
      .toBeInTheDocument()
    expect(mockFitInteractiveLightArtwork).not.toHaveBeenCalled()
  })
})
