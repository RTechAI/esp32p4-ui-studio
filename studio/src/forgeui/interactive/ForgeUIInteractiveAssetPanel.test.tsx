import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import ForgeUIInteractiveAssetPanel from './ForgeUIInteractiveAssetPanel'
import { generateAIImageAsset } from '~forgeui/ai/ForgeUIAIImagePipeline'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createDefaultInteractiveLightAsset,
  getAllInteractiveAssets,
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
    forgeUIClearUploadedAssets()
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

  it('requests a Toggle Set only from the Toggle Switch designer', () => {
    const onBuildToggleSet = jest.fn()

    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          onBuildToggleSet={onBuildToggleSet}
        />
      </ChakraProvider>,
    )

    expect(
      screen.queryByRole('button', {
        name: 'Create Toggle Set',
      }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    fireEvent.click(screen.getByRole('radio', {
      name: 'Toggle Switch',
    }))
    const createToggleSet =
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      })
    fireEvent.click(createToggleSet)

    expect(onBuildToggleSet).toHaveBeenCalledTimes(1)
  })

  it('preserves the Toggle draft and consumes completed state asset IDs', async () => {
    const onConsumed = jest.fn()
    const createImage = (
      id: string,
    ): ForgeUIUploadedAsset => ({
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

    const view = render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel />
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    fireEvent.click(screen.getByRole('radio', {
      name: 'Toggle Switch',
    }))
    await screen.findByText(
      'Interactive Toggle Switch Designer',
    )
    fireEvent.change(
      screen.getByDisplayValue(
        'New Interactive Toggle Switch',
      ),
      {
        target: { value: 'Preserved Toggle Draft' },
      },
    )
    fireEvent.change(
      screen.getByDisplayValue(
        'Status Toggle Switch',
      ),
      {
        target: { value: 'Preserved Label' },
      },
    )
    const dimensions =
      screen.getAllByRole('spinbutton')
    fireEvent.change(dimensions[0], {
      target: { value: '222' },
    })
    fireEvent.change(dimensions[1], {
      target: { value: '111' },
    })

    act(() => {
      forgeUIAddUploadedAssets([
        createImage('existing-off'),
        createImage('existing-on'),
        createImage('state-off'),
        createImage('state-on'),
      ])
    })

    const offSelect = screen
      .getByText('OFF Image')
      .parentElement?.querySelector('select') as
      | HTMLSelectElement
      | undefined
    const onSelect = screen
      .getByText('ON Image')
      .parentElement?.querySelector('select') as
      | HTMLSelectElement
      | undefined
    const initialStateSelect = screen
      .getByText('Initial State')
      .parentElement?.querySelector('select') as
      | HTMLSelectElement
      | undefined

    fireEvent.change(offSelect!, {
      target: { value: 'existing-off' },
    })
    fireEvent.change(onSelect!, {
      target: { value: 'existing-on' },
    })
    expect(screen.getByRole('button', {
      name: 'Replace Toggle Set',
    })).toBeInTheDocument()
    fireEvent.change(initialStateSelect!, {
      target: { value: 'on' },
    })

    fireEvent.click(screen.getByRole('radio', {
      name: 'Button',
    }))
    expect(
      screen.queryByText(
        'Interactive Toggle Switch Designer',
      ),
    ).not.toBeInTheDocument()

    view.rerender(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          toggleStateSheetResult={{
            offAssetId: 'state-off',
            onAssetId: 'state-on',
            stateSheetSourceAssetId:
              'state-source',
          }}
          onToggleStateSheetResultConsumed={
            onConsumed
          }
          toggleDesignerRestoreVersion={1}
        />
      </ChakraProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText(
        'Interactive Toggle Switch Designer',
      )).toBeInTheDocument()
      expect(
        screen.getByDisplayValue(
          'Preserved Toggle Draft',
        ),
      ).toHaveValue('Preserved Toggle Draft')
      expect(
        screen.getByDisplayValue('Preserved Label'),
      ).toHaveValue('Preserved Label')
      const restoredDimensions =
        screen.getAllByRole('spinbutton')
      expect(restoredDimensions[0]).toHaveValue('222')
      expect(restoredDimensions[1]).toHaveValue('111')
      expect(
        screen
          .getByText('OFF Image')
          .parentElement?.querySelector('select'),
      ).toHaveValue('state-off')
      expect(
        screen
          .getByText('ON Image')
          .parentElement?.querySelector('select'),
      ).toHaveValue('state-on')
      expect(
        screen
          .getByText('Initial State')
          .parentElement?.querySelector('select'),
      ).toHaveValue('on')
      expect(screen.getByRole('button', {
        name: 'Rebuild Toggle Set',
      })).toBeInTheDocument()
    })
    expect(onConsumed).toHaveBeenCalled()
    expect(getAllInteractiveAssets()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', {
      name: 'Save Toggle Switch',
    }))
    expect(getAllInteractiveAssets()).toHaveLength(1)
    expect(
      getAllInteractiveAssets()[0],
    ).toMatchObject({
      kind: 'toggleSwitch',
      offAssetId: 'state-off',
      onAssetId: 'state-on',
      stateSheetSourceAssetId: 'state-source',
    })
    fireEvent.click(screen.getByRole('button', {
      name: 'Edit',
    }))
    expect(screen.getByRole('button', {
      name: 'Rebuild Toggle Set',
    })).toBeInTheDocument()
    expect(screen.getByDisplayValue(
      'Preserved Toggle Draft',
    )).toBeInTheDocument()
  })

  it('restores a cancelled Toggle draft without changing its fields or selections', async () => {
    const createImage = (
      id: string,
    ): ForgeUIUploadedAsset => ({
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
    const view = render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel />
      </ChakraProvider>,
    )

    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    fireEvent.click(screen.getByRole('radio', {
      name: 'Toggle Switch',
    }))
    await screen.findByText(
      'Interactive Toggle Switch Designer',
    )
    fireEvent.change(
      screen.getByDisplayValue(
        'New Interactive Toggle Switch',
      ),
      {
        target: { value: 'Cancelled Toggle Draft' },
      },
    )
    act(() => {
      forgeUIAddUploadedAssets([
        createImage('cancel-off'),
        createImage('cancel-on'),
      ])
    })
    fireEvent.change(
      screen
        .getByText('OFF Image')
        .parentElement?.querySelector('select')!,
      { target: { value: 'cancel-off' } },
    )
    fireEvent.change(
      screen
        .getByText('ON Image')
        .parentElement?.querySelector('select')!,
      { target: { value: 'cancel-on' } },
    )

    fireEvent.click(screen.getByRole('radio', {
      name: 'Light',
    }))
    view.rerender(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          toggleDesignerRestoreVersion={1}
        />
      </ChakraProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText(
        'Interactive Toggle Switch Designer',
      )).toBeInTheDocument()
      expect(screen.getByDisplayValue(
        'Cancelled Toggle Draft',
      )).toBeInTheDocument()
      expect(
        screen
          .getByText('OFF Image')
          .parentElement?.querySelector('select'),
      ).toHaveValue('cancel-off')
      expect(
        screen
          .getByText('ON Image')
          .parentElement?.querySelector('select'),
      ).toHaveValue('cancel-on')
    })
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })
})
