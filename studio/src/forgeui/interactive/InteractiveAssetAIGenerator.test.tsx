import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import {
  generateAIImageAsset,
} from '~forgeui/ai/ForgeUIAIImagePipeline'
import InteractiveAssetAIGenerator from './InteractiveAssetAIGenerator'

jest.mock('~forgeui/ai/ForgeUIAIImagePipeline', () => ({
  generateAIImageAsset: jest.fn(),
}))

const mockedGenerate =
  generateAIImageAsset as jest.MockedFunction<
    typeof generateAIImageAsset
  >

describe('shared Interactive Asset AI generator', () => {
  beforeEach(() => {
    mockedGenerate.mockReset()
    mockedGenerate
      .mockResolvedValueOnce({ id: 'first' } as any)
      .mockResolvedValueOnce({ id: 'second' } as any)
  })

  it.each([
    ['button', 'button-normal', 'button-pressed'],
    ['light', 'light-off', 'light-on'],
  ] as const)(
    'generates both %s visual states',
    async (assetType, firstMode, secondMode) => {
      const onGenerated = jest.fn()
      const onUploadedAssetsChanged = jest.fn()

      render(
        <ChakraProvider>
          <InteractiveAssetAIGenerator
            selectedAssetKind={assetType}
            width={32}
            height={32}
            onGenerated={onGenerated}
            onGeneratingChange={jest.fn()}
            onUploadedAssetsChanged={onUploadedAssetsChanged}
          />
        </ChakraProvider>,
      )

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Green power indicator' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

      await waitFor(() => expect(onGenerated).toHaveBeenCalledWith(
        'first',
        'second',
      ))

      expect(mockedGenerate).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ generationMode: firstMode }),
      )
      expect(mockedGenerate).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ generationMode: secondMode }),
      )
      expect(onUploadedAssetsChanged).toHaveBeenCalledTimes(1)
    },
  )

  it('reports generation state so the owning editor can lock type changes', async () => {
    const onGeneratingChange = jest.fn()

    render(
      <ChakraProvider>
        <InteractiveAssetAIGenerator
          selectedAssetKind="button"
          width={120}
          height={48}
          onGenerated={jest.fn()}
          onGeneratingChange={onGeneratingChange}
          onUploadedAssetsChanged={jest.fn()}
        />
      </ChakraProvider>,
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Blue start button' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    expect(onGeneratingChange).toHaveBeenCalledWith(true)
    await waitFor(() =>
      expect(onGeneratingChange).toHaveBeenLastCalledWith(false),
    )
  })

  it('uses dedicated selector modes for all three positions', async () => {
    mockedGenerate.mockReset()
    mockedGenerate
      .mockResolvedValueOnce({ id: 'left' } as any)
      .mockResolvedValueOnce({ id: 'center' } as any)
      .mockResolvedValueOnce({ id: 'right' } as any)
    const onGenerated = jest.fn()
    render(<ChakraProvider><InteractiveAssetAIGenerator
      selectedAssetKind="threePositionToggle"
      width={96}
      height={36}
      onGenerated={onGenerated}
      onGeneratingChange={jest.fn()}
      onUploadedAssetsChanged={jest.fn()}
    /></ChakraProvider>)
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', expect.stringContaining('Horizontal industrial selector'))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Brushed steel control' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))
    await waitFor(() => expect(onGenerated).toHaveBeenCalledWith('left', 'center', 'right'))
    expect(mockedGenerate.mock.calls.map(call => call[0].generationMode)).toEqual([
      'three-position-left', 'three-position-center', 'three-position-right',
    ])
    mockedGenerate.mock.calls.forEach(call => expect(call[0]).toEqual(expect.objectContaining({ width: 96, height: 36 })))
  })
})
