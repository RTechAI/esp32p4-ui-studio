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
