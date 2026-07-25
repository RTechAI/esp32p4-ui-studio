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
import InteractiveButtonPreview from './InteractiveButtonPreview'

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

describe('Interactive Button preview compatibility', () => {
  it('renders a compact pointer-transparent empty-state icon', () => {
    render(
      <ChakraProvider>
        <InteractiveButtonPreview
          width={120}
          height={48}
        />
      </ChakraProvider>,
    )

    const icon = screen.getByTestId('unconfigured-button-icon')
    expect(icon).toHaveAttribute('width', '101')
    expect(icon).toHaveAttribute('height', '41')
    expect(icon).toHaveStyle({
      pointerEvents: 'none',
      flexShrink: '0',
    })
    expect(screen.getByTestId('unconfigured-button-placeholder'))
      .toHaveAttribute('data-layout', 'compact')
    expect(screen.queryByText(/Select both Normal/))
      .not.toBeInTheDocument()
  })

  it('adds compact hints only when the Button has room', () => {
    render(
      <ChakraProvider>
        <InteractiveButtonPreview
          width={240}
          height={100}
        />
      </ChakraProvider>,
    )
    expect(screen.getByText('Normal')).toBeInTheDocument()
    expect(screen.getByText('Pressed')).toBeInTheDocument()
  })

  it('still previews Normal and Pressed states through pointer input', () => {
    const normalAsset = createAsset('normal')
    const pressedAsset = createAsset('pressed')

    render(
      <ChakraProvider>
        <InteractiveButtonPreview
          normalAsset={normalAsset}
          pressedAsset={pressedAsset}
          width={120}
          height={48}
        />
      </ChakraProvider>,
    )

    const normalImage = screen.getByAltText(normalAsset.name)
    fireEvent.mouseDown(normalImage)
    expect(screen.getByAltText(pressedAsset.name)).toBeInTheDocument()
    fireEvent.mouseUp(screen.getByAltText(pressedAsset.name))
    expect(screen.getByAltText(normalAsset.name)).toBeInTheDocument()
  })
})
