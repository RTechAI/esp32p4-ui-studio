import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveStatusIndicatorPreview from './InteractiveStatusIndicatorPreview'

const image: ForgeUIUploadedAsset = {
  id: 'status-art',
  name: 'status-art.png',
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: 'data:image/png;base64,status',
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: 'fg_status_art',
  cFile: 'status_art.c',
}

describe('Interactive Status Indicator preview image fit', () => {
  beforeEach(() => {
    forgeUIClearUploadedAssets()
  })

  it.each([
    [200, 200],
    [240, 100],
    [100, 240],
  ])('contains intrinsic artwork within %i x %i bounds', (width, height) => {
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorPreview
          offAsset={image}
          width={width}
          height={height}
          state="off"
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId(
      'status-indicator-image-bounds',
    )).toHaveStyle({
      width: `${width}px`,
      height: `${height}px`,
      overflow: 'hidden',
    })
    expect(screen.getByRole('img')).toHaveStyle({
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
    })
  })

  it('fills Canvas bounds continuously without an intrinsic-size cap', () => {
    render(
      <ChakraProvider>
        <InteractiveStatusIndicatorPreview
          offAsset={image}
          width={232}
          height={343}
          state="off"
          fillContainer
        />
      </ChakraProvider>,
    )
    expect(screen.getByTestId(
      'interactive-status-indicator-preview',
    )).toHaveStyle({
      width: '100%',
      height: '100%',
    })
    expect(screen.getByTestId(
      'status-indicator-image-bounds',
    )).toHaveStyle({
      width: '100%',
      height: '100%',
    })
    expect(screen.getByRole('img')).toHaveStyle({
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
    })
  })

  it('records intrinsic and alpha bounds for both OFF and ON artwork once', () => {
    const off = { ...image, id: 'off', name: 'off.png' }
    const on = { ...image, id: 'on', name: 'on.png' }
    forgeUIAddUploadedAssets([off, on])
    const updates = jest.fn()
    window.addEventListener('forgeui-assets-updated', updates)
    const getImageData = jest.fn()
      .mockReturnValueOnce({
        data: new Uint8ClampedArray([
          0, 0, 0, 0, 0, 0, 0, 255,
          0, 0, 0, 0, 0, 0, 0, 0,
        ]),
      })
      .mockReturnValueOnce({
        data: new Uint8ClampedArray([
          0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 255, 0, 0, 0, 255,
        ]),
      })
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue({
        drawImage: jest.fn(),
        getImageData,
      } as unknown as CanvasRenderingContext2D)
    const { container } = render(
      <ChakraProvider>
        <InteractiveStatusIndicatorPreview
          offAsset={off}
          onAsset={on}
          width={32}
          height={32}
          state="off"
        />
      </ChakraProvider>,
    )
    const images = container.querySelectorAll('img')
    images.forEach(element => {
      Object.defineProperty(element, 'naturalWidth', {
        configurable: true,
        value: 2,
      })
      Object.defineProperty(element, 'naturalHeight', {
        configurable: true,
        value: 2,
      })
      fireEvent.load(element)
    })

    expect(forgeUIGetUploadedAssets()).toEqual([
      expect.objectContaining({
        id: 'off',
        width: 2,
        height: 2,
        contentX: 1,
        contentY: 0,
        contentWidth: 1,
        contentHeight: 1,
      }),
      expect.objectContaining({
        id: 'on',
        width: 2,
        height: 2,
        contentX: 0,
        contentY: 1,
        contentWidth: 2,
        contentHeight: 1,
      }),
    ])
    expect(updates).toHaveBeenCalledTimes(2)

    images.forEach(element => fireEvent.load(element))
    expect(updates).toHaveBeenCalledTimes(2)
    window.removeEventListener('forgeui-assets-updated', updates)
    jest.restoreAllMocks()
  })
})
