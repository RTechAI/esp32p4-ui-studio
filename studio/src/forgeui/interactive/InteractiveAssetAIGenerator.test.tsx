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
  generateThreePositionToggleMaster,
  registerThreePositionToggleCrops,
} from '~forgeui/ai/ForgeUIAIImagePipeline'
import InteractiveAssetAIGenerator from './InteractiveAssetAIGenerator'

jest.mock('~forgeui/ai/ForgeUIAIImagePipeline', () => ({
  generateAIImageAsset: jest.fn(),
  generateThreePositionToggleMaster: jest.fn(),
  registerThreePositionToggleCrops: jest.fn(),
}))

const mockedGenerate =
  generateAIImageAsset as jest.MockedFunction<
    typeof generateAIImageAsset
  >
const mockedGenerateMaster =
  generateThreePositionToggleMaster as jest.MockedFunction<
    typeof generateThreePositionToggleMaster
  >
const mockedRegisterCrops =
  registerThreePositionToggleCrops as jest.MockedFunction<
    typeof registerThreePositionToggleCrops
  >

describe('shared Interactive Asset AI generator', () => {
  beforeEach(() => {
    mockedGenerate.mockReset()
    mockedGenerateMaster.mockReset()
    mockedRegisterCrops.mockReset()
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

  it('defers Three-Position cropping and registration until confirmation', async () => {
    mockedGenerate.mockReset()
    mockedGenerateMaster.mockResolvedValue(
      'data:image/png;base64,master',
    )
    mockedRegisterCrops.mockResolvedValue({
      left: { id: 'left', width: 96, height: 36 },
      center: { id: 'center', width: 96, height: 36 },
      right: { id: 'right', width: 96, height: 36 },
    } as any)
    const onGenerated = jest.fn()
    const renderGenerator = (generateRequestId: number) => (
      <ChakraProvider><InteractiveAssetAIGenerator
        selectedAssetKind="threePositionToggle"
        width={96}
        height={36}
        generateRequestId={generateRequestId}
        onGenerated={onGenerated}
        onGeneratingChange={jest.fn()}
        onUploadedAssetsChanged={jest.fn()}
      /></ChakraProvider>
    )
    const view = render(renderGenerator(0))
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', expect.stringContaining('Horizontal industrial selector'))
    expect(screen.queryByRole('button', { name: 'Generate' }))
      .not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Brushed steel control' } })
    view.rerender(renderGenerator(1))
    await screen.findByTestId('three-position-crop-workspace')
    expect(mockedGenerateMaster).toHaveBeenCalledWith({
      prompt: 'Brushed steel control',
    })
    expect(mockedRegisterCrops).not.toHaveBeenCalled()
    expect(onGenerated).not.toHaveBeenCalled()
    expect(mockedGenerate).not.toHaveBeenCalled()

    const image = screen.getByRole('img', {
      name: 'Three-Position master state sheet',
    })
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: 900 },
      naturalHeight: { configurable: true, value: 900 },
      clientWidth: { configurable: true, value: 450 },
      clientHeight: { configurable: true, value: 450 },
    })
    fireEvent.load(image)
    await screen.findByTestId('state-sheet-overlay')
    fireEvent.click(screen.getByRole('button', {
      name: 'Confirm Crops',
    }))

    await waitFor(() => expect(onGenerated)
      .toHaveBeenCalledWith('left', 'center', 'right'))
    expect(mockedRegisterCrops).toHaveBeenCalledWith(
      expect.objectContaining({
        masterImage: 'data:image/png;base64,master',
        width: 96,
        height: 36,
        project: expect.objectContaining({
          cropWidth: 900,
          cropHeight: 300,
          regions: [
            expect.objectContaining({
              label: 'LEFT',
              y: 0,
            }),
            expect.objectContaining({
              label: 'CENTER',
              y: 300,
            }),
            expect.objectContaining({
              label: 'RIGHT',
              y: 600,
            }),
          ],
        }),
      }),
    )
  })

  it('remaps unique Three-Position rows before registration', async () => {
    mockedGenerateMaster.mockResolvedValue(
      'data:image/png;base64,master',
    )
    mockedRegisterCrops.mockResolvedValue({
      left: { id: 'left' },
      center: { id: 'center' },
      right: { id: 'right' },
    } as any)
    const renderGenerator = (generateRequestId: number) => (
      <ChakraProvider><InteractiveAssetAIGenerator
        selectedAssetKind="threePositionToggle"
        width={96}
        height={36}
        generateRequestId={generateRequestId}
        onGenerated={jest.fn()}
        onGeneratingChange={jest.fn()}
        onUploadedAssetsChanged={jest.fn()}
      /></ChakraProvider>
    )
    const view = render(renderGenerator(0))
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Remappable selector' },
    })
    view.rerender(renderGenerator(1))
    await screen.findByTestId('three-position-crop-workspace')
    const image = screen.getByRole('img', {
      name: 'Three-Position master state sheet',
    })
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: 900 },
      naturalHeight: { configurable: true, value: 900 },
      clientWidth: { configurable: true, value: 450 },
      clientHeight: { configurable: true, value: 450 },
    })
    fireEvent.load(image)

    const rowOne = screen.getByRole('combobox', {
      name: 'Row 1 maps to',
    })
    const rowTwo = screen.getByRole('combobox', {
      name: 'Row 2 maps to',
    })
    const rowThree = screen.getByRole('combobox', {
      name: 'Row 3 maps to',
    })
    expect([rowOne, rowTwo, rowThree].map(
      select => (select as HTMLSelectElement).value,
    )).toEqual(['left', 'center', 'right'])

    fireEvent.change(rowOne, {
      target: { value: 'center' },
    })
    expect([rowOne, rowTwo, rowThree].map(
      select => (select as HTMLSelectElement).value,
    )).toEqual(['center', 'left', 'right'])
    expect(screen.getByTestId(
      'state-sheet-crop-left',
    )).toHaveTextContent('CENTER')
    expect(screen.getByTestId(
      'state-sheet-crop-center',
    )).toHaveTextContent('LEFT')
    expect(screen.getByTestId(
      'state-sheet-crop-right',
    )).toHaveTextContent('RIGHT')

    fireEvent.click(screen.getByRole('button', {
      name: 'Confirm Crops',
    }))
    await waitFor(() =>
      expect(mockedRegisterCrops).toHaveBeenCalled(),
    )
    const submittedProject =
      mockedRegisterCrops.mock.calls[0][0].project
    expect(submittedProject.regions.map(region => [
      region.label,
      region.y,
    ])).toEqual([
      ['LEFT', 300],
      ['CENTER', 0],
      ['RIGHT', 600],
    ])
    await waitFor(() =>
      expect(screen.queryByTestId(
        'three-position-crop-workspace',
      )).not.toBeInTheDocument(),
    )
  })

  it('cancels a Three-Position crop without registration or draft replacement', async () => {
    mockedGenerateMaster.mockResolvedValue(
      'data:image/png;base64,master',
    )
    const onGenerated = jest.fn()
    const renderGenerator = (generateRequestId: number) => (
      <ChakraProvider><InteractiveAssetAIGenerator
        selectedAssetKind="threePositionToggle"
        width={96}
        height={36}
        generateRequestId={generateRequestId}
        onGenerated={onGenerated}
        onGeneratingChange={jest.fn()}
        onUploadedAssetsChanged={jest.fn()}
      /></ChakraProvider>
    )
    const view = render(renderGenerator(0))
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Existing selector draft' },
    })
    view.rerender(renderGenerator(1))
    await screen.findByTestId('three-position-crop-workspace')
    fireEvent.click(screen.getByRole('button', {
      name: 'Cancel',
    }))

    expect(screen.queryByTestId(
      'three-position-crop-workspace',
    )).not.toBeInTheDocument()
    expect(mockedRegisterCrops).not.toHaveBeenCalled()
    expect(onGenerated).not.toHaveBeenCalled()
  })
})
