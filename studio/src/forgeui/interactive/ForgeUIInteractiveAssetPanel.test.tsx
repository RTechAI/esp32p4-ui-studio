import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ForgeUIInteractiveAssetPanel from './ForgeUIInteractiveAssetPanel'
import { generateAIImageAsset } from '~forgeui/ai/ForgeUIAIImagePipeline'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createDefaultInteractiveLightAsset,
  registerInteractiveAsset,
} from './index'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => undefined),
}))

jest.mock('~hooks/useForm', () => ({
  useForm: () => ({ setValue: jest.fn() }),
}))

jest.mock('~hooks/useDispatch', () => ({
  __esModule: true,
  default: () => ({
    components: { updateProps: jest.fn() },
  }),
}))

jest.mock('~forgeui/ai/ForgeUIAIImagePipeline', () => ({
  generateAIImageAsset: jest.fn(),
}))

const mockedGenerate =
  generateAIImageAsset as jest.MockedFunction<typeof generateAIImageAsset>

describe('Interactive Assets unified creation flow', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    window.localStorage.clear()
    mockedGenerate.mockReset()
  })

  const renderPanel = () => render(
    <ChakraProvider>
      <ForgeUIInteractiveAssetPanel />
    </ChakraProvider>,
  )

  it('uses one entry point and switches the displayed designer by Asset Type', () => {
    renderPanel()

    expect(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    })).toBeInTheDocument()
    expect(screen.queryByText('+ New Interactive Light')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    expect(screen.getByText('Interactive Button Designer')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))
    expect(screen.getByText('Interactive Light Designer')).toBeInTheDocument()
    expect(screen.queryByText('Interactive Button Designer')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Button' }))
    expect(screen.getByText('Interactive Button Designer')).toBeInTheDocument()
  })

  it('automatically selects the kind of an existing asset being edited', () => {
    registerInteractiveAsset(
      createDefaultInteractiveLightAsset('existing-light', 'Existing Light'),
    )
    registerInteractiveAsset(
      createDefaultInteractiveButtonAsset('existing-button', 'Existing Button'),
    )

    renderPanel()

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    fireEvent.click(editButtons[0])
    expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked()
    expect(screen.getByText('Edit Interactive Light')).toBeInTheDocument()

    fireEvent.click(editButtons[1])
    expect(screen.getByRole('radio', { name: 'Button' })).toBeChecked()
    expect(screen.getByText('Edit Interactive Button')).toBeInTheDocument()
  })

  it('locks Asset Type while AI generation is in progress', async () => {
    let resolveFirst: (asset: any) => void = () => undefined
    mockedGenerate
      .mockImplementationOnce(() => new Promise(resolve => {
        resolveFirst = resolve
      }))
      .mockResolvedValueOnce({ id: 'pressed' } as any)

    renderPanel()
    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    fireEvent.change(screen.getByPlaceholderText(
      'Blue Start button with soft glow...',
    ), {
      target: { value: 'Blue start button' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    await waitFor(() =>
      expect(screen.getByRole('radio', { name: 'Light' })).toBeDisabled(),
    )

    resolveFirst({ id: 'normal' })
    await waitFor(() =>
      expect(screen.getByRole('radio', { name: 'Light' })).not.toBeDisabled(),
    )
    expect(screen.getByRole('radio', { name: 'Button' })).toBeChecked()
  })
})
