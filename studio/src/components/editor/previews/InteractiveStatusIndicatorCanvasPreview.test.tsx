import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveStatusIndicatorAsset,
  registerInteractiveAsset,
} from '~forgeui/interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type { ForgeUIUploadedAsset } from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveStatusIndicatorCanvasPreview from './InteractiveStatusIndicatorCanvasPreview'

const image = (id: string): ForgeUIUploadedAsset => ({
  id, name: `${id}.png`, type: 'image/png', size: 1, createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`, kind: 'uploaded',
  exportStatus: 'lvgl_ready', lvgl: `fg_${id}`, cFile: `${id}.c`,
})

describe('Interactive Status Indicator Canvas preview', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('renders the saved binary state without click behaviour', () => {
    const off = image('off')
    const on = image('on')
    forgeUIAddUploadedAssets([off, on])
    const indicator = {
      ...createDefaultInteractiveStatusIndicatorAsset('ready'),
      offAssetId: off.id, onAssetId: on.id, initialState: 'on' as const,
    }
    registerInteractiveAsset(indicator)
    const component: IComponent = {
      id: 'ready', parent: 'root', type: 'InteractiveStatusIndicator',
      props: { interactiveAssetId: indicator.id, w: 32, h: 32 }, children: [],
    }
    render(<ChakraProvider><InteractiveStatusIndicatorCanvasPreview component={component} /></ChakraProvider>)
    const preview = screen.getByTestId('interactive-status-indicator-preview')
    expect(preview).toHaveAttribute('data-state', 'on')
    expect(screen.getByRole('img')).toHaveAttribute('src', on.browserSrc)
    preview.click()
    expect(preview).toHaveAttribute('data-state', 'on')
  })
})
