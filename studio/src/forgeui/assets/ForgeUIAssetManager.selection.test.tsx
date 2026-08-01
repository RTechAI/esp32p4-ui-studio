import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ForgeUIAssetManager } from './ForgeUIAssetManager'
import { forgeUIAddUploadedAssets, forgeUIClearUploadedAssets } from '../ForgeUIUploadedAssetRegistry'

jest.mock('../theme/ForgeThemeContext', () => ({ useForgeTheme: () => ({ heroBackground: '' }) }))
jest.mock('../interactive', () => ({ getAllInteractiveAssets: () => [] }))

describe('Asset Manager frame selection mode', () => {
  afterEach(() => {
    cleanup()
    forgeUIClearUploadedAssets()
  })

  it('selects multiple existing assets through the canonical manager', () => {
    forgeUIAddUploadedAssets(['one', 'two'].map((id, createdAt) => ({ id, name: `${id}.png`,
      type: 'image/png', size: 1, createdAt, browserSrc: `/${id}.png`, kind: 'uploaded' as const,
      exportStatus: 'lvgl_ready' as const, lvgl: `fg_${id}`, cFile: `assets/fg_${id}.c` })))
    const onSelectAssets = jest.fn()
    render(<ChakraProvider><ForgeUIAssetManager onClose={jest.fn()} onSelectAssets={onSelectAssets}
      selectionRequest={{ componentId: 'anim', propertyName: 'frameAssetIds', multiple: true,
        selectedAssetIds: ['one'], title: 'Select Animation Frames' }} /></ChakraProvider>)
    expect(screen.getByRole('checkbox', { name: 'Select one.png' })).toBeChecked()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Select two.png' }))
    fireEvent.click(screen.getByRole('button', { name: 'Use Selected Frames' }))
    expect(onSelectAssets).toHaveBeenCalledWith(['one', 'two'])
  })
})
