import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import type {
  ForgeUIUploadedAsset,
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
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    })
  })
})
