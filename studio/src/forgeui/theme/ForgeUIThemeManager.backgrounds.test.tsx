import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ForgeUIThemeManager from './ForgeUIThemeManager'
import { FORGEUI_BACKGROUND_ASSETS } from '../ForgeUIAssetRegistry'
import { useForgeTheme } from './ForgeThemeContext'
import { registerAndConvertImage } from '../ai/ForgeUIAIImagePipeline'

jest.mock('./ForgeThemeContext', () => ({
  useForgeTheme: jest.fn(),
}))

jest.mock('../ForgeUIUploadedAssetRegistry', () => ({
  forgeUIGetUploadedAssets: () => [],
}))

jest.mock('../ai/ForgeUIAIImagePipeline', () => ({
  registerAndConvertImage: jest.fn(),
}))

const mockUseForgeTheme = useForgeTheme as jest.Mock
const mockRegisterAndConvertImage = registerAndConvertImage as jest.Mock
const mockSetHeroBackground = jest.fn()

describe('ForgeUI Theme Manager background gallery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseForgeTheme.mockReturnValue({
      themeId: 'graphite',
      heroBackground: null,
      setThemeId: jest.fn(),
      setHeroBackground: mockSetHeroBackground,
    })
    mockRegisterAndConvertImage.mockResolvedValue({
      browserSrc: '/converted-background.png',
    })
  })

  it('shows the complete registry and filters it by category', () => {
    render(
      <ChakraProvider>
        <ForgeUIThemeManager
          onClose={jest.fn()}
          onInsertImageAsset={jest.fn()}
        />
      </ChakraProvider>,
    )

    expect(
      screen.getAllByRole('img', { name: /dashboard background$/i }),
    ).toHaveLength(FORGEUI_BACKGROUND_ASSETS.length)

    fireEvent.click(screen.getByRole('button', { name: 'Light' }))

    expect(screen.getByText('Soft White Matte')).toBeInTheDocument()
    expect(screen.queryByText('Graphite Black')).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('img', { name: /dashboard background$/i }),
    ).toHaveLength(5)
  })

  it('prepares only the selected bundled asset through the existing image pipeline', async () => {
    render(
      <ChakraProvider>
        <ForgeUIThemeManager
          onClose={jest.fn()}
          onInsertImageAsset={jest.fn()}
        />
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByText('Graphite Black'))

    await waitFor(() => {
      expect(mockRegisterAndConvertImage).toHaveBeenCalledWith(
        expect.objectContaining({
          browserSrc:
            '/assets/backgrounds/forgeui-v2/dark-graphite-black-radial.png',
          assetMode: 'hero',
          width: 1024,
          height: 600,
          recordDimensions: true,
        }),
      )
      expect(mockSetHeroBackground).toHaveBeenCalledWith(
        '/converted-background.png',
      )
    })
    expect(mockRegisterAndConvertImage).toHaveBeenCalledTimes(1)
  })
})
