import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveStatusIndicatorAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveStatusIndicatorCreatorHelper from './InteractiveStatusIndicatorCreatorHelper'

const component = (assetId?: string): IComponent => ({
  id: 'indicator', parent: 'root', type: 'InteractiveStatusIndicator',
  props: assetId ? { interactiveAssetId: assetId } : {}, children: [],
})
const image = (id: string) => ({
  id, name: id, type: 'image/png', size: 1, createdAt: 1,
  browserSrc: id, kind: 'uploaded' as const,
  exportStatus: 'lvgl_ready' as const, lvgl: `fg_${id}`, cFile: `${id}.c`,
})

describe('Interactive Status Indicator creator helper', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('appears for no asset and opens a fresh creator request', () => {
    const listener = jest.fn()
    window.addEventListener('forgeui-open-ai-playground', listener)
    render(<ChakraProvider><InteractiveStatusIndicatorCreatorHelper component={component()} /></ChakraProvider>)
    fireEvent.click(screen.getByRole('button', {
      name: 'Open Status Indicator Creator',
    }))
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      target: 'interactive-status-indicator-designer',
      sourceComponentId: 'indicator',
    })
    expect((listener.mock.calls[0][0] as CustomEvent).detail)
      .not.toHaveProperty('interactiveAssetId')
    window.removeEventListener('forgeui-open-ai-playground', listener)
  })

  it.each([
    ['missing OFF', undefined, 'on'],
    ['missing ON', 'off', undefined],
  ])('appears for %s visual', (_, offAssetId, onAssetId) => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveStatusIndicatorAsset('linked'),
      offAssetId, onAssetId,
    })
    render(<ChakraProvider><InteractiveStatusIndicatorCreatorHelper component={component('linked')} /></ChakraProvider>)
    expect(screen.getByTestId('status-indicator-creator-helper'))
      .toBeInTheDocument()
  })

  it('hides when both uploaded visuals resolve', () => {
    forgeUIAddUploadedAssets([image('off'), image('on')])
    registerInteractiveAsset({
      ...createDefaultInteractiveStatusIndicatorAsset('linked'),
      offAssetId: 'off', onAssetId: 'on',
    })
    render(<ChakraProvider><InteractiveStatusIndicatorCreatorHelper component={component('linked')} /></ChakraProvider>)
    expect(screen.queryByTestId('status-indicator-creator-helper'))
      .not.toBeInTheDocument()
  })
})
