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
import {
  generateAIImageAsset,
  generateThreePositionToggleMaster,
  registerThreePositionToggleCrops,
} from '~forgeui/ai/ForgeUIAIImagePipeline'
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
  createDefaultInteractiveThreePositionToggleAsset,
  createDefaultInteractiveToggleSwitchAsset,
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
  generateThreePositionToggleMaster: jest.fn(),
  registerThreePositionToggleCrops: jest.fn(),
}))

const mockedGenerate =
  generateAIImageAsset as jest.MockedFunction<typeof generateAIImageAsset>
const mockedGenerateMaster =
  generateThreePositionToggleMaster as jest.MockedFunction<
    typeof generateThreePositionToggleMaster
  >
const mockedRegisterCrops =
  registerThreePositionToggleCrops as jest.MockedFunction<
    typeof registerThreePositionToggleCrops
  >

describe('Interactive Assets unified creation flow', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
    window.localStorage.clear()
    mockedGenerate.mockReset()
    mockedGenerateMaster.mockReset()
    mockedRegisterCrops.mockReset()
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
    expect(screen.queryByText(
      'AI Create Interactive Asset',
    )).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText(
      'Green power indicator...',
    )).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {
      name: 'Generate',
    })).not.toBeInTheDocument()
    const createToggleSet =
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      })
    fireEvent.click(createToggleSet)

    expect(onBuildToggleSet).toHaveBeenCalledTimes(1)
  })

  it('defaults new Toggles to 300x200 and preserves stored dimensions when editing', () => {
    const existingToggle = {
      ...createDefaultInteractiveToggleSwitchAsset(
        'existing-toggle',
        'Existing Toggle',
      ),
      width: 175,
      height: 90,
    }
    registerInteractiveAsset(existingToggle)

    renderPanel()
    fireEvent.click(screen.getByRole('button', {
      name: '+ New Interactive Asset',
    }))
    fireEvent.click(screen.getByRole('radio', {
      name: 'Toggle Switch',
    }))

    let dimensions = screen.getAllByRole('spinbutton')
    expect(dimensions[0]).toHaveValue('300')
    expect(dimensions[1]).toHaveValue('200')

    fireEvent.click(screen.getByRole('button', {
      name: 'Edit',
    }))
    dimensions = screen.getAllByRole('spinbutton')
    expect(dimensions[0]).toHaveValue('175')
    expect(dimensions[1]).toHaveValue('90')
  })

  it('opens the linked Toggle asset from a creator navigation request', async () => {
    registerInteractiveAsset({
      ...createDefaultInteractiveToggleSwitchAsset(
        'linked-toggle',
        'Linked Toggle',
      ),
      label: 'Linked Label',
      width: 410,
      height: 205,
    })

    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-toggle-switch-designer',
            sourceComponentId: 'toggle-component',
            interactiveAssetId: 'linked-toggle',
            requestId: 1,
          }}
        />
      </ChakraProvider>,
    )

    expect(await screen.findByText(
      'Edit Interactive Toggle Switch',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Toggle'))
      .toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Label'))
      .toBeInTheDocument()
    const dimensions = screen.getAllByRole('spinbutton')
    expect(dimensions[0]).toHaveValue('410')
    expect(dimensions[1]).toHaveValue('205')
  })

  it('opens a new Toggle draft for an unconfigured component request', async () => {
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-toggle-switch-designer',
            sourceComponentId: 'unconfigured-toggle',
            requestId: 2,
          }}
        />
      </ChakraProvider>,
    )

    expect(await screen.findByText(
      'Interactive Toggle Switch Designer',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue(
      'New Interactive Toggle Switch',
    )).toBeInTheDocument()
    expect(getAllInteractiveAssets()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', {
      name: 'Cancel',
    }))
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })

  it('opens the exact linked Button from a creator navigation request', async () => {
    registerInteractiveAsset({
      ...createDefaultInteractiveButtonAsset(
        'linked-button',
        'Linked Button',
      ),
      label: 'Linked Button Label',
      width: 210,
      height: 84,
    })

    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-button-designer',
            sourceComponentId: 'button-component',
            interactiveAssetId: 'linked-button',
            requestId: 11,
          }}
        />
      </ChakraProvider>,
    )

    expect(await screen.findByText(
      'Edit Interactive Button',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Button'))
      .toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Button Label'))
      .toBeInTheDocument()
    const dimensions = screen.getAllByRole('spinbutton')
    expect(dimensions[0]).toHaveValue('210')
    expect(dimensions[1]).toHaveValue('84')
  })

  it('opens a fresh Button draft for an unconfigured component request', async () => {
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-button-designer',
            sourceComponentId: 'blank-button',
            requestId: 12,
          }}
        />
      </ChakraProvider>,
    )

    expect(await screen.findByText(
      'Interactive Button Designer',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue(
      'New Interactive Button',
    )).toBeInTheDocument()
    expect(getAllInteractiveAssets()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', {
      name: 'Cancel',
    }))
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })

  it('opens the exact linked Light from a creator navigation request', async () => {
    registerInteractiveAsset({
      ...createDefaultInteractiveLightAsset(
        'linked-light',
        'Linked Light',
      ),
      label: 'Linked Light Label',
      width: 88,
      height: 66,
    })
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-light-designer',
            sourceComponentId: 'light-component',
            interactiveAssetId: 'linked-light',
            requestId: 21,
          }}
        />
      </ChakraProvider>,
    )
    expect(await screen.findByText(
      'Edit Interactive Light',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Light'))
      .toBeInTheDocument()
    expect(screen.getByDisplayValue('Linked Light Label'))
      .toBeInTheDocument()
  })

  it('opens a fresh Light draft for an unconfigured component request', async () => {
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target: 'interactive-light-designer',
            sourceComponentId: 'blank-light',
            requestId: 22,
          }}
        />
      </ChakraProvider>,
    )
    expect(await screen.findByText(
      'Interactive Light Designer',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue('New Interactive Light'))
      .toBeInTheDocument()
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })

  it('opens the exact Three-Position Toggle and preserves all image selectors', async () => {
    const uploaded = ['left', 'center', 'right', 'replacement']
      .map(id => ({
        id,
        name: `${id}.png`,
        type: 'image/png',
        size: 1,
        createdAt: 1,
        browserSrc: id,
        kind: 'uploaded' as const,
        exportStatus: 'lvgl_ready' as const,
        lvgl: `fg_${id}`,
        cFile: `${id}.c`,
      }))
    forgeUIAddUploadedAssets(uploaded)
    registerInteractiveAsset({
      ...createDefaultInteractiveThreePositionToggleAsset(
        'linked-three-position',
        'Linked Three Position',
      ),
      leftAssetId: 'left',
      centerAssetId: 'center',
      rightAssetId: 'right',
    })

    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target:
              'interactive-three-position-toggle-designer',
            sourceComponentId: 'three-position-component',
            interactiveAssetId: 'linked-three-position',
            requestId: 31,
          }}
        />
      </ChakraProvider>,
    )

    expect(await screen.findByText(
      'Edit Interactive Three-Position Toggle Switch',
    )).toBeInTheDocument()
    const leftSelect = screen.getByText('LEFT Image')
      .parentElement?.querySelector('select')
    const centerSelect = screen.getByText('CENTER Image')
      .parentElement?.querySelector('select')
    const rightSelect = screen.getByText('RIGHT Image')
      .parentElement?.querySelector('select')
    expect(leftSelect).toHaveValue('left')
    expect(centerSelect).toHaveValue('center')
    expect(rightSelect).toHaveValue('right')

    fireEvent.change(centerSelect!, {
      target: { value: 'replacement' },
    })
    expect(leftSelect).toHaveValue('left')
    expect(centerSelect).toHaveValue('replacement')
    expect(rightSelect).toHaveValue('right')
    fireEvent.click(screen.getByRole('button', {
      name: 'Save',
    }))
    expect(getAllInteractiveAssets()[0]).toMatchObject({
      id: 'linked-three-position',
      leftAssetId: 'left',
      centerAssetId: 'replacement',
      rightAssetId: 'right',
    })
  })

  it('opens a fresh unsaved Three-Position Toggle draft', async () => {
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target:
              'interactive-three-position-toggle-designer',
            sourceComponentId: 'blank-three-position',
            requestId: 32,
          }}
        />
      </ChakraProvider>,
    )
    expect(await screen.findByText(
      'Interactive Three-Position Toggle Switch Designer',
    )).toBeInTheDocument()
    expect(screen.getByDisplayValue(
      'New Interactive Three-Position Toggle Switch',
    )).toBeInTheDocument()
    expect(getAllInteractiveAssets()).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', {
      name: 'Cancel',
    }))
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })

  it('creates all three visual states through the Three-Position shortcut', async () => {
    forgeUIAddUploadedAssets(
      ['generated-left', 'generated-center', 'generated-right']
        .map(id => ({
          id,
          name: `${id}.png`,
          type: 'image/png',
          size: 1,
          createdAt: 1,
          browserSrc: id,
          kind: 'uploaded' as const,
          exportStatus: 'lvgl_ready' as const,
          lvgl: `fg_${id}`,
          cFile: `${id}.c`,
        })),
    )
    mockedGenerateMaster.mockResolvedValueOnce(
      'data:image/png;base64,master',
    )
    mockedRegisterCrops.mockResolvedValueOnce({
      left: { id: 'generated-left', width: 96, height: 36 },
      center: { id: 'generated-center', width: 96, height: 36 },
      right: { id: 'generated-right', width: 96, height: 36 },
    } as any)

    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target:
              'interactive-three-position-toggle-designer',
            sourceComponentId: 'blank-three-position',
            requestId: 33,
          }}
        />
      </ChakraProvider>,
    )

    const shortcut = await screen.findByRole('button', {
      name: 'Create Three-Position Toggle Set',
    })
    expect(screen.queryByRole('button', {
      name: 'Generate',
    })).not.toBeInTheDocument()
    expect(shortcut).toBeDisabled()
    expect(screen.getByText('LEFT Image')).toBeInTheDocument()
    expect(screen.getByText('CENTER Image')).toBeInTheDocument()
    expect(screen.getByText('RIGHT Image')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText(
      'Horizontal industrial selector switch with a rectangular body...',
    ), {
      target: { value: 'Brushed steel three-position selector' },
    })
    expect(shortcut).not.toBeDisabled()
    fireEvent.click(shortcut)
    await screen.findByTestId('three-position-crop-workspace')
    const masterImage = screen.getByRole('img', {
      name: 'Three-Position master state sheet',
    })
    Object.defineProperties(masterImage, {
      naturalWidth: { configurable: true, value: 900 },
      naturalHeight: { configurable: true, value: 900 },
      clientWidth: { configurable: true, value: 450 },
      clientHeight: { configurable: true, value: 450 },
    })
    fireEvent.load(masterImage)
    fireEvent.click(await screen.findByRole('button', {
      name: 'Confirm Crops',
    }))

    const selectFor = (label: string) =>
      screen.getByText(label).parentElement
        ?.querySelector('select')
    await waitFor(() => {
      expect(selectFor('LEFT Image'))
        .toHaveValue('generated-left')
      expect(selectFor('CENTER Image'))
        .toHaveValue('generated-center')
      expect(selectFor('RIGHT Image'))
        .toHaveValue('generated-right')
    })
    expect(mockedGenerateMaster).toHaveBeenCalledTimes(1)
    expect(mockedGenerateMaster).toHaveBeenCalledWith({
      prompt: 'Brushed steel three-position selector',
    })
    expect(mockedRegisterCrops).toHaveBeenCalledTimes(1)
    expect(mockedGenerate).not.toHaveBeenCalled()
    expect(getAllInteractiveAssets()).toHaveLength(0)
  })

  it('does not resolve a Three-Position edit request against another asset kind', async () => {
    registerInteractiveAsset(
      createDefaultInteractiveButtonAsset(
        'wrong-kind',
        'Wrong Kind Button',
      ),
    )
    render(
      <ChakraProvider>
        <ForgeUIInteractiveAssetPanel
          navigationRequest={{
            target:
              'interactive-three-position-toggle-designer',
            sourceComponentId: 'three-position-component',
            interactiveAssetId: 'wrong-kind',
            requestId: 33,
          }}
        />
      </ChakraProvider>,
    )
    expect(await screen.findByText(
      'Interactive Three-Position Toggle Switch Designer',
    )).toBeInTheDocument()
    expect(screen.queryByDisplayValue('Wrong Kind Button'))
      .not.toBeInTheDocument()
    expect(getAllInteractiveAssets()).toHaveLength(1)
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
