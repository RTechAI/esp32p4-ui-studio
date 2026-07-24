import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import ForgeAIPanel from './ForgeAIPanel'
import {
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

jest.mock(
  '~forgeui/theme/ForgeThemeContext',
  () => ({
    useForgeTheme: () => ({
      heroBackground: '',
      setHeroBackground: jest.fn(),
    }),
  }),
)

jest.mock('./StateSheetOverlay', () => ({
  __esModule: true,
  default: ({ project }: any) => (
    <div data-testid="state-sheet-overlay">
      {project.regions.map((region: any) => (
        <span key={region.id}>
          {region.label} selector
        </span>
      ))}
    </div>
  ),
}))

jest.mock(
  '~forgeui/interactive/ForgeUIInteractiveAssetPanel',
  () => ({
    __esModule: true,
    default: ({
      onBuildToggleSet,
      toggleStateSheetResult,
      onToggleStateSheetResultConsumed,
    }: {
      onBuildToggleSet?: (
        stateSheetSourceAssetId?: string,
      ) => void
      toggleStateSheetResult?: {
        offAssetId: string
        onAssetId: string
        stateSheetSourceAssetId: string
      } | null
      onToggleStateSheetResultConsumed?: () => void
    }) => {
      const [draftName, setDraftName] =
        React.useState('Preserved Toggle Draft')
      const [offAssetId, setOffAssetId] =
        React.useState('')
      const [onAssetId, setOnAssetId] =
        React.useState('')
      const [
        stateSheetSourceAssetId,
        setStateSheetSourceAssetId,
      ] = React.useState('')

      React.useEffect(() => {
        if (!toggleStateSheetResult) return
        setOffAssetId(
          toggleStateSheetResult.offAssetId,
        )
        setOnAssetId(
          toggleStateSheetResult.onAssetId,
        )
        setStateSheetSourceAssetId(
          toggleStateSheetResult
            .stateSheetSourceAssetId,
        )
        onToggleStateSheetResultConsumed?.()
      }, [
        onToggleStateSheetResultConsumed,
        toggleStateSheetResult,
      ])

      return (
        <div>
          <label>
            Toggle name
            <input
              value={draftName}
              onChange={event =>
                setDraftName(event.target.value)
              }
            />
          </label>
          <button
            onClick={() =>
              onBuildToggleSet?.(
                stateSheetSourceAssetId ||
                  undefined,
              )
            }
          >
            {offAssetId && onAssetId
              ? stateSheetSourceAssetId
                ? 'Rebuild Toggle Set'
                : 'Replace Toggle Set'
              : 'Create Toggle Set'}
          </button>
          <button
            onClick={() => {
              setOffAssetId('legacy-off')
              setOnAssetId('legacy-on')
              setStateSheetSourceAssetId('')
            }}
          >
            Load legacy Toggle
          </button>
          <output aria-label="OFF asset">
            {offAssetId}
          </output>
          <output aria-label="ON asset">
            {onAssetId}
          </output>
          <output aria-label="State sheet source asset">
            {stateSheetSourceAssetId}
          </output>
        </div>
      )
    },
  }),
)

describe('ForgeAIPanel Toggle State Sheet entry', () => {
  beforeEach(() => {
    window.localStorage.clear()
    forgeUIClearUploadedAssets()
    jest
      .spyOn(
        HTMLCanvasElement.prototype,
        'getContext',
      )
      .mockReturnValue({
        clearRect: jest.fn(),
        drawImage: jest.fn(),
      } as any)
    jest
      .spyOn(
        HTMLCanvasElement.prototype,
        'toDataURL',
      )
      .mockReturnValue(
        'data:image/png;base64,crop',
      )
    jest
      .spyOn(
        HTMLCanvasElement.prototype,
        'toBlob',
      )
      .mockImplementation(callback => {
        callback(
          new Blob(['crop'], {
            type: 'image/png',
          }),
        )
      })
    let artworkGeneration = 0
    global.fetch = jest.fn(
      async (input: RequestInfo | URL) => {
        if (
          String(input).includes(
            'convert-lvgl-image',
          )
        ) {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              symbolName: 'fg_toggle_crop',
              assetSource: 'toggle_crop.c',
            }),
          } as Response
        }

        if (
          String(input).startsWith('data:image/')
        ) {
          return {
            ok: true,
            blob: async () =>
              new Blob(['source'], {
                type: 'image/png',
              }),
          } as Response
        }

        artworkGeneration += 1
        return {
          ok: true,
          json: async () => ({
            ok: true,
            image:
              `data:image/png;base64,state-sheet-${artworkGeneration}`,
          }),
        } as Response
      },
    ) as jest.Mock
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderPanel = () =>
    render(
      <ChakraProvider>
        <ForgeAIPanel
          onClose={jest.fn()}
          insertAiLayout={jest.fn()}
        />
      </ChakraProvider>,
    )

  const loadArtworkImage = (
    image: HTMLElement,
  ) => {
    Object.defineProperties(image, {
      complete: {
        configurable: true,
        value: true,
      },
      naturalWidth: {
        configurable: true,
        value: 1000,
      },
      naturalHeight: {
        configurable: true,
        value: 500,
      },
    })
    fireEvent.load(image)
  }

  const generateArtwork = async () => {
    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Assets',
      }),
    )
    fireEvent.change(
      screen.getByPlaceholderText(
        /Create a compact industrial battery/,
      ),
      {
        target: {
          value: 'Create a two-state switch sheet',
        },
      },
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: /Create AI Artwork/,
      }),
    )

    const image = await screen.findByAltText(
      'AI generated artwork',
    )
    loadArtworkImage(image)
  }

  it('enters editing over the existing artwork and restores the draft on Cancel', async () => {
    renderPanel()
    await generateArtwork()

    expect(
      screen.getByRole('button', {
        name: 'Save To Artwork Library',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Insert Artwork',
      }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    )
    const draft = screen.getByLabelText(
      'Toggle name',
    )
    fireEvent.change(draft, {
      target: { value: 'Unsaved Pump Toggle' },
    })
    expect(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    ).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    )
    loadArtworkImage(
      screen.getByAltText(
        'AI generated artwork',
      ),
    )

    await waitFor(() => {
      expect(
        screen.getByTestId('state-sheet-overlay'),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByTestId('forge-ai-tabs'),
    ).toHaveAttribute('data-active-tab-index', '3')
    expect(
      screen.getByRole('heading', {
        name: 'Toggle State Sheet Builder',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('tab', {
        name: 'Assets',
      }),
    ).not.toBeInTheDocument()
    expect(draft).not.toBeVisible()
    expect(
      screen.getByText('OFF selector'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('ON selector'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Save To Artwork Library',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Insert Artwork',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('AI Asset Designer'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('My Forge Assets'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Show Advanced JSON',
      }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    )

    expect(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    ).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByLabelText('Toggle name'),
    ).toHaveValue('Unsaved Pump Toggle')
    expect(
      screen.getByLabelText('Toggle name'),
    ).toBeVisible()
  })

  it('creates both assets and reveals the same unsaved draft without changing tabs', async () => {
    renderPanel()
    await generateArtwork()
    fireEvent.click(screen.getByRole('tab', {
      name: 'Interactive',
    }))
    const draft = screen.getByLabelText(
      'Toggle name',
    )
    fireEvent.change(draft, {
      target: { value: 'Created Pump Toggle' },
    })
    fireEvent.click(screen.getByRole('button', {
      name: 'Create Toggle Set',
    }))
    loadArtworkImage(screen.getByAltText(
      'AI generated artwork',
    ))

    await screen.findByTestId(
      'state-sheet-overlay',
    )
    expect(
      screen.getByTestId('forge-ai-tabs'),
    ).toHaveAttribute('data-active-tab-index', '3')
    fireEvent.click(screen.getByRole('button', {
      name: 'Create Toggle Set',
    }))

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          'toggle-state-sheet-workspace',
        ),
      ).not.toBeInTheDocument()
      expect(
        screen.getByLabelText('OFF asset'),
      ).not.toHaveTextContent(/^$/)
      expect(
        screen.getByLabelText('ON asset'),
      ).not.toHaveTextContent(/^$/)
      expect(
        screen.getByLabelText(
          'State sheet source asset',
        ),
      ).not.toHaveTextContent(/^$/)
    })
    expect(
      screen.getByTestId('forge-ai-tabs'),
    ).toHaveAttribute('data-active-tab-index', '3')
    expect(
      screen.getByLabelText('Toggle name'),
    ).toHaveValue('Created Pump Toggle')
    expect(
      screen.getByLabelText('Toggle name'),
    ).toBeVisible()
    const sourceAssetId =
      screen.getByLabelText(
        'State sheet source asset',
      ).textContent
    expect(
      forgeUIGetUploadedAssets().some(
        asset => asset.id === sourceAssetId,
      ),
    ).toBe(true)

    const firstOffAssetId =
      screen.getByLabelText(
        'OFF asset',
      ).textContent
    const firstOnAssetId =
      screen.getByLabelText(
        'ON asset',
      ).textContent

    fireEvent.click(screen.getByRole('tab', {
      name: 'Assets',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: /Create AI Artwork/,
    }))
    await waitFor(() => {
      expect(
        screen.getByAltText(
          'AI generated artwork',
        ),
      ).toHaveAttribute(
        'src',
        'data:image/png;base64,state-sheet-2',
      )
    })
    loadArtworkImage(screen.getByAltText(
      'AI generated artwork',
    ))

    fireEvent.click(screen.getByRole('tab', {
      name: 'Interactive',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Rebuild Toggle Set',
    }))

    const retainedSourceImage =
      screen.getByAltText(
        'AI generated artwork',
      )
    expect(retainedSourceImage).toHaveAttribute(
      'src',
      'data:image/png;base64,state-sheet-1',
    )
    loadArtworkImage(retainedSourceImage)
    expect(
      await screen.findByTestId(
        'state-sheet-overlay',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('AI artwork required'),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {
      name: 'Create Toggle Set',
    }))
    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'State sheet source asset',
        ),
      ).toHaveTextContent(sourceAssetId || '')
      expect(
        screen.getByLabelText('OFF asset'),
      ).not.toHaveTextContent(
        firstOffAssetId || '',
      )
      expect(
        screen.getByLabelText('ON asset'),
      ).not.toHaveTextContent(
        firstOnAssetId || '',
      )
    })
    expect(
      screen.getByLabelText('Toggle name'),
    ).toHaveValue('Created Pump Toggle')
  })

  it('opens a focused source step for a legacy Toggle and continues into cropping', async () => {
    renderPanel()
    fireEvent.click(screen.getByRole('tab', {
      name: 'Interactive',
    }))
    const draft = screen.getByLabelText(
      'Toggle name',
    )
    fireEvent.change(draft, {
      target: { value: 'Legacy Pump Toggle' },
    })
    fireEvent.click(screen.getByRole('button', {
      name: 'Load legacy Toggle',
    }))

    fireEvent.click(screen.getByRole('button', {
      name: 'Replace Toggle Set',
    }))
    expect(
      screen.getByTestId(
        'toggle-state-sheet-workspace',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Create a two-state source artwork',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Generate Source Artwork',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        'Toggle source artwork required',
      ),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {
      name: 'Cancel',
    }))
    expect(draft).toBeVisible()
    expect(draft).toHaveValue('Legacy Pump Toggle')
    expect(
      screen.getByLabelText('OFF asset'),
    ).toHaveTextContent('legacy-off')
    expect(
      screen.getByLabelText('ON asset'),
    ).toHaveTextContent('legacy-on')

    fireEvent.click(screen.getByRole('button', {
      name: 'Replace Toggle Set',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Generate Source Artwork',
    }))
    const generatedSource =
      await screen.findByAltText(
        'AI generated artwork',
      )
    loadArtworkImage(generatedSource)
    expect(
      await screen.findByTestId(
        'state-sheet-overlay',
      ),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', {
      name: 'Create Toggle Set',
    }))
    await waitFor(() => {
      expect(
        screen.getByLabelText(
          'State sheet source asset',
        ),
      ).not.toHaveTextContent(/^$/)
      expect(
        screen.getByLabelText('OFF asset'),
      ).not.toHaveTextContent('legacy-off')
      expect(
        screen.getByLabelText('ON asset'),
      ).not.toHaveTextContent('legacy-on')
    })
    expect(draft).toBeVisible()
    expect(draft).toHaveValue('Legacy Pump Toggle')
  })

  it('uses current artwork immediately when replacing a legacy Toggle', async () => {
    renderPanel()
    await generateArtwork()
    fireEvent.click(screen.getByRole('tab', {
      name: 'Interactive',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Load legacy Toggle',
    }))
    fireEvent.click(screen.getByRole('button', {
      name: 'Replace Toggle Set',
    }))
    loadArtworkImage(screen.getByAltText(
      'AI generated artwork',
    ))

    expect(
      await screen.findByTestId(
        'state-sheet-overlay',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Generate Source Artwork',
      }),
    ).not.toBeInTheDocument()
  })
})
