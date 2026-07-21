import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import InteractiveLightPreview from './InteractiveLightPreview'

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

describe('Interactive Light preview', () => {
  const offAsset = createAsset('off')
  const onAsset = createAsset('on')

  it.each([
    ['off', offAsset.name],
    ['on', onAsset.name],
  ] as const)('renders the %s state', (state, imageName) => {
    render(
      <ChakraProvider>
        <InteractiveLightPreview
          offAsset={offAsset}
          onAsset={onAsset}
          width={32}
          height={32}
          state={state}
        />
      </ChakraProvider>,
    )

    expect(screen.getByAltText(imageName)).toBeInTheDocument()
  })

  it('does not toggle when the Canvas image is clicked', () => {
    render(
      <ChakraProvider>
        <InteractiveLightPreview
          offAsset={offAsset}
          onAsset={onAsset}
          width={32}
          height={32}
          state="off"
        />
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByAltText(offAsset.name))
    expect(screen.getByTestId('interactive-light-preview')).toHaveAttribute(
      'data-state',
      'off',
    )
  })

  it('renders a safe missing-state fallback', () => {
    render(
      <ChakraProvider>
        <InteractiveLightPreview
          width={32}
          height={32}
          state="on"
        />
      </ChakraProvider>,
    )

    expect(screen.getByText('Missing ON visual')).toBeInTheDocument()
  })
})
