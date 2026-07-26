import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveToggleSwitchPreview from './InteractiveToggleSwitchPreview'

const configuredAsset: ForgeUIUploadedAsset = {
  id: 'configured',
  name: 'configured.png',
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: 'data:image/png;base64,configured',
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: 'fg_configured',
  cFile: 'configured.c',
}

describe('Interactive Toggle Switch empty state', () => {
  beforeEach(() => {
    forgeUIClearUploadedAssets()
  })

  it('shows the full creator hint at 300x200', () => {
    render(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          width={300}
          height={200}
          state="off"
        />
      </ChakraProvider>,
    )

    const icon = screen.getByTestId('unconfigured-toggle-icon')
    expect(icon).toHaveAttribute('viewBox', '0 0 56 40')
    expect(icon).toHaveAttribute('width', '196')
    expect(icon).toHaveAttribute('height', '140')
    expect(icon).toHaveStyle({
      width: '196px',
      height: '140px',
      minWidth: '196px',
      minHeight: '140px',
      maxWidth: 'none',
      maxHeight: 'none',
      flexShrink: '0',
    })
    expect(icon.querySelector('circle[fill="#78B98C"]'))
      .not.toBeNull()
    expect(icon.querySelector('path[stroke="#67E8F9"]'))
      .not.toBeNull()
    expect(screen.getByText('L Preview')).toBeInTheDocument()
    expect(screen.getByText('R Creator')).toBeInTheDocument()
  })

  it('uses an icon-only layout below the compact breakpoint', () => {
    render(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          width={64}
          height={36}
          state="off"
        />
      </ChakraProvider>,
    )

    expect(screen.getByTestId('unconfigured-toggle-icon'))
      .toBeInTheDocument()
    expect(screen.getByTestId('unconfigured-toggle-icon'))
      .toHaveAttribute('width', '54')
    expect(screen.getByTestId('unconfigured-toggle-icon'))
      .toHaveAttribute('height', '32')
    expect(screen.getByTestId('unconfigured-toggle-icon'))
      .toHaveStyle({
        width: '54px',
        height: '32px',
        minWidth: '54px',
        minHeight: '32px',
        flexShrink: '0',
      })
    expect(screen.getByTestId('unconfigured-toggle-placeholder'))
      .toHaveAttribute('data-layout', 'compact')
    expect(screen.queryByText('L Preview')).not.toBeInTheDocument()
    expect(screen.queryByText('R Creator')).not.toBeInTheDocument()
  })

  it('scales a 100x50 compact icon from the component bounds', () => {
    render(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          width={100}
          height={50}
          state="off"
        />
      </ChakraProvider>,
    )

    const icon = screen.getByTestId('unconfigured-toggle-icon')
    expect(icon).toHaveAttribute('width', '84')
    expect(icon).toHaveAttribute('height', '45')
    expect(screen.getByTestId('unconfigured-toggle-placeholder'))
      .toHaveAttribute('data-layout', 'compact')
    expect(screen.queryByText('L Preview')).not.toBeInTheDocument()
  })

  it('preserves preview clicks and configured artwork', () => {
    const onPreviewClick = jest.fn()
    const view = render(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          width={300}
          height={200}
          state="off"
          onPreviewClick={onPreviewClick}
        />
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByTestId(
      'unconfigured-toggle-placeholder',
    ))
    expect(onPreviewClick).toHaveBeenCalledTimes(1)

    view.rerender(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          offAsset={configuredAsset}
          width={300}
          height={200}
          state="off"
        />
      </ChakraProvider>,
    )
    expect(screen.getByAltText('configured.png')).toBeInTheDocument()
    expect(screen.queryByTestId(
      'unconfigured-toggle-placeholder',
    )).not.toBeInTheDocument()
  })

  it('preloads and measures both configured states once', () => {
    const off = { ...configuredAsset, id: 'off', name: 'off.png' }
    const on = { ...configuredAsset, id: 'on', name: 'on.png' }
    forgeUIAddUploadedAssets([off, on])
    const pixels = new Uint8ClampedArray(2 * 2 * 4)
    for (let index = 3; index < pixels.length; index += 4) {
      pixels[index] = 255
    }
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({
        drawImage: jest.fn(),
        getImageData: jest.fn(() => ({ data: pixels })),
      } as unknown as CanvasRenderingContext2D)
    const updates = jest.fn()
    window.addEventListener('forgeui-assets-updated', updates)
    const { container } = render(
      <ChakraProvider>
        <InteractiveToggleSwitchPreview
          offAsset={off}
          onAsset={on}
          width={200}
          height={100}
          state="off"
          fillContainer
        />
      </ChakraProvider>,
    )
    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(2)
    images.forEach(element => {
      Object.defineProperty(element, 'naturalWidth', {
        configurable: true, value: 2,
      })
      Object.defineProperty(element, 'naturalHeight', {
        configurable: true, value: 2,
      })
      fireEvent.load(element)
    })
    expect(forgeUIGetUploadedAssets()).toEqual([
      expect.objectContaining({
        id: 'off', width: 2, height: 2,
        contentX: 0, contentY: 0,
        contentWidth: 2, contentHeight: 2,
      }),
      expect.objectContaining({
        id: 'on', width: 2, height: 2,
        contentX: 0, contentY: 0,
        contentWidth: 2, contentHeight: 2,
      }),
    ])
    expect(updates).toHaveBeenCalledTimes(2)
    images.forEach(element => fireEvent.load(element))
    expect(updates).toHaveBeenCalledTimes(2)
    window.removeEventListener('forgeui-assets-updated', updates)
    jest.restoreAllMocks()
  })
})
