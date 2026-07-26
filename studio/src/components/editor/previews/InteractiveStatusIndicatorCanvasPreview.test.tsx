import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveStatusIndicatorAsset,
  getInteractiveStatusIndicatorAsset,
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

  it('toggles a local preview without changing the saved initial state', () => {
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
    fireEvent.click(preview)
    expect(preview).toHaveAttribute('data-state', 'off')
    expect(screen.getByRole('img')).toHaveAttribute('src', off.browserSrc)
    expect(indicator.initialState).toBe('on')
    expect(
      getInteractiveStatusIndicatorAsset(indicator.id)?.initialState,
    ).toBe('on')
  })

  it.each([
    [32, 32, 'compact'],
    [160, 96, 'full'],
  ])('uses the responsive binary placeholder at %i x %i', (w, h, layout) => {
    const component: IComponent = {
      id: 'blank', parent: 'root', type: 'InteractiveStatusIndicator',
      props: { w, h }, children: [],
    }
    render(<ChakraProvider><InteractiveStatusIndicatorCanvasPreview component={component} /></ChakraProvider>)
    const placeholder = screen.getByTestId(
      'unconfigured-status-indicator-placeholder',
    )
    expect(placeholder).toHaveAttribute('data-layout', layout)
    const icon = screen.getByTestId(
      'unconfigured-status-indicator-icon',
    )
    expect(icon).toHaveAttribute(
      'width',
      String(Math.round(w * 0.84)),
    )
    expect(icon).toHaveAttribute(
      'height',
      String(Math.round(h * 0.88)),
    )
    expect(icon).toHaveStyle({
      minWidth: `${Math.round(w * 0.84)}px`,
      minHeight: `${Math.round(h * 0.88)}px`,
      maxWidth: 'none',
      maxHeight: 'none',
      flexShrink: '0',
    })
    if (layout === 'compact') {
      expect(screen.queryByText('OFF')).not.toBeInTheDocument()
      expect(screen.queryByText('ON')).not.toBeInTheDocument()
    } else {
      expect(screen.getByText('OFF')).toBeInTheDocument()
      expect(screen.getByText('ON')).toBeInTheDocument()
      expect(screen.getByText('BINARY OUTPUT')).toBeInTheDocument()
    }
  })

  it('caps the new-component drag preview wrapper to its responsive height', () => {
    const component: IComponent = {
      id: 'drag-preview',
      parent: 'root',
      type: 'InteractiveStatusIndicator',
      props: { w: 32, h: 32 },
      children: [],
    }
    render(<ChakraProvider><InteractiveStatusIndicatorCanvasPreview component={component} /></ChakraProvider>)
    expect(screen.getByTestId(
      'interactive-status-indicator-preview',
    )).toHaveAttribute('data-minimum-height', '32')
    expect(screen.getByTestId(
      'unconfigured-status-indicator-icon',
    )).toHaveAttribute('width', '27')
    expect(screen.getByTestId(
      'unconfigured-status-indicator-icon',
    )).toHaveAttribute('height', '28')
  })
})
