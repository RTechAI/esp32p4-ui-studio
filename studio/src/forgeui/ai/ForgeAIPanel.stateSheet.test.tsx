import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ForgeAIPanel from './ForgeAIPanel'
import { generateForgeAILayout } from './ForgeAIEngine'
import {
  composeForgeUILayoutTemplate,
  forgeUIWeatherDashboardTemplate,
} from '~forgeui/layout/ForgeUILayoutDesigner'
import {
  forgeUIClearUploadedAssets,
  forgeUIGetUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const mockSetHeroBackground = jest.fn()

jest.mock('./ForgeAIEngine', () => ({
  generateForgeAILayout: jest.fn(),
}))

const mockGenerateForgeAILayout = generateForgeAILayout as jest.Mock

jest.mock('~forgeui/theme/ForgeThemeContext', () => ({
  useForgeTheme: () => ({
    heroBackground: '/weather-background.png',
    setHeroBackground: mockSetHeroBackground,
  }),
}))

jest.mock('./StateSheetOverlay', () => ({
  __esModule: true,
  default: ({ project }: any) => (
    <div data-testid="state-sheet-overlay">
      {project.regions.map((region: any) => (
        <span key={region.id}>{region.label} selector</span>
      ))}
    </div>
  ),
}))

jest.mock('~forgeui/interactive/ForgeUIInteractiveAssetPanel', () => ({
  __esModule: true,
  default: function MockInteractiveAssetPanel({
    onBuildToggleSet,
    toggleStateSheetResult,
    onToggleStateSheetResultConsumed,
    navigationRequest,
  }: {
    onBuildToggleSet?: (stateSheetSourceAssetId?: string) => void
    toggleStateSheetResult?: {
      offAssetId: string
      onAssetId: string
      stateSheetSourceAssetId: string
    } | null
    onToggleStateSheetResultConsumed?: () => void
    navigationRequest?: {
      sourceComponentId: string
      interactiveAssetId?: string
    } | null
  }) {
    const [draftName, setDraftName] = React.useState('Preserved Toggle Draft')
    const [offAssetId, setOffAssetId] = React.useState('')
    const [onAssetId, setOnAssetId] = React.useState('')
    const [
      stateSheetSourceAssetId,
      setStateSheetSourceAssetId,
    ] = React.useState('')

    React.useEffect(() => {
      if (!toggleStateSheetResult) return
      setOffAssetId(toggleStateSheetResult.offAssetId)
      setOnAssetId(toggleStateSheetResult.onAssetId)
      setStateSheetSourceAssetId(toggleStateSheetResult.stateSheetSourceAssetId)
      onToggleStateSheetResultConsumed?.()
    }, [onToggleStateSheetResultConsumed, toggleStateSheetResult])

    return (
      <div>
        <label>
          Toggle name
          <input
            value={draftName}
            onChange={event => setDraftName(event.target.value)}
          />
        </label>
        <button
          onClick={() =>
            onBuildToggleSet?.(stateSheetSourceAssetId || undefined)
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
        <output aria-label="OFF asset">{offAssetId}</output>
        <output aria-label="ON asset">{onAssetId}</output>
        <output aria-label="State sheet source asset">
          {stateSheetSourceAssetId}
        </output>
        <output aria-label="Navigation source component">
          {navigationRequest?.sourceComponentId}
        </output>
        <output aria-label="Navigation interactive asset">
          {navigationRequest?.interactiveAssetId}
        </output>
      </div>
    )
  },
}))

describe('ForgeAIPanel Toggle State Sheet entry', () => {
  beforeEach(() => {
    mockSetHeroBackground.mockClear()
    mockGenerateForgeAILayout.mockReset()
    mockGenerateForgeAILayout.mockResolvedValue({
      name: 'Weather Dashboard',
      description: 'Generated weather screen',
      layout: composeForgeUILayoutTemplate(
        forgeUIWeatherDashboardTemplate,
        [{
          type: 'Heading',
          componentName: 'Weather_Temperature',
          props: {
            headingText: '18°',
            layoutRegionId: 'weather-dashboard.current-weather',
          },
        }],
      ),
    })
    window.localStorage.clear()
    forgeUIClearUploadedAssets()
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    } as any)
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,crop')
    jest
      .spyOn(HTMLCanvasElement.prototype, 'toBlob')
      .mockImplementation(callback => {
        callback(
          new Blob(['crop'], {
            type: 'image/png',
          }),
        )
      })
    let artworkGeneration = 0
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('convert-lvgl-image')) {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            symbolName: 'fg_toggle_crop',
            assetSource: 'toggle_crop.c',
          }),
        } as Response
      }

      if (String(input).startsWith('data:image/')) {
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
          image: `data:image/png;base64,state-sheet-${artworkGeneration}`,
        }),
      } as Response
    }) as jest.Mock
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  const renderPanel = (insertAiLayout = jest.fn()) =>
    render(
      <ChakraProvider>
        <ForgeAIPanel onClose={jest.fn()} insertAiLayout={insertAiLayout} />
      </ChakraProvider>,
    )

  const loadArtworkImage = (image: HTMLElement) => {
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

  it('isolates All Components Test from normal quick templates', () => {
    renderPanel()

    expect(screen.getByText('Selection Controls')).toBeInTheDocument()
    expect(screen.getByText('Interactive Assets')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'NumberInput',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'InteractiveButton',
      }),
    ).toBeDisabled()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'All Components Test',
      }),
    )

    const prompt = screen.getByPlaceholderText(
      /Create a modern industrial dashboard/,
    ) as HTMLTextAreaElement
    expect(prompt.value).toContain('component coverage test')
    expect(prompt.value).toContain('- NumberInput:')
    expect(prompt.value).toContain('- CircularProgress:')
    expect(prompt.value).not.toContain('- InteractiveButton:')
    expect(prompt.value).toContain('Never fabricate asset IDs')
    expect(
      screen.getByText(
        'Validation only. Requests every AI-supported component on one 1024×600 screen. The result will be dense and is not intended to be a usable interface.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'All Components Test',
      }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Dashboard',
      }),
    )
    expect(
      screen.getByRole('button', {
        name: 'All Components Test',
      }),
    ).toHaveAttribute('aria-pressed', 'false')
    expect(prompt.value).toBe('')
  })

  it('generates deterministic templates without a default prompt in one action', async () => {
    const insertAiLayout = jest.fn()
    renderPanel(insertAiLayout)

    expect(screen.getByTestId('layout-designer-preview')).toHaveTextContent(
      'HeaderStatusMainControlsFooter',
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Generate Dashboard',
      }),
    )
    await waitFor(() => expect(insertAiLayout).toHaveBeenCalledTimes(1))
    const applied = insertAiLayout.mock.calls[0][0]
    expect(applied.filter((item: any) => item.type === 'Box')).toHaveLength(5)
    expect(applied.map((item: any) => item.props.layoutRegionKey)).toEqual(
      expect.arrayContaining([
        'dashboard.header',
        'dashboard.status',
        'dashboard.main',
        'dashboard.controls',
        'dashboard.footer',
      ]),
    )

    expect(mockGenerateForgeAILayout).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Apply Dashboard' }))
      .not.toBeInTheDocument()
  })

  it.each([
    ['Industrial HMI', 'NavigationMachine StatusProcess AreaAlarm Panel'],
    ['Control Panel', 'Left ControlsCentre GraphicRight Controls'],
    ['Monitoring', 'Large Trend GraphMetrics StripAlarm List'],
    [
      'SCADA Overview',
      'Left NavigationMain MimicRight InformationBottom Events',
    ],
    ['Mobile / Portrait', 'Main CardSecondary CardControls'],
  ])('keeps built-in deterministic template generation compatible for %s', async (name, labels) => {
    const insertAiLayout = jest.fn()
    renderPanel(insertAiLayout)
    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: {
        value: name
          .toLowerCase()
          .replace(' / ', '-')
          .replace(/ /g, '-'),
      },
    })
    expect(screen.getByTestId('layout-designer-preview')).toHaveTextContent(
      labels,
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: `Generate ${name}`,
      }),
    )
    await waitFor(() => expect(insertAiLayout).toHaveBeenCalledTimes(1))
    expect(mockGenerateForgeAILayout).not.toHaveBeenCalled()
  })

  it('runs the complete Weather template pipeline and inserts automatically', async () => {
    const insertAiLayout = jest.fn().mockResolvedValue(true)
    renderPanel(insertAiLayout)
    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: { value: 'weather-dashboard' },
    })
    const prompt = screen.getByRole('textbox', {
      name: 'Layout Designer prompt',
    }) as HTMLTextAreaElement
    fireEvent.change(prompt, {
      target: { value: 'My edited weather brief with TAURANGA and 18°' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Generate Weather Dashboard',
      }),
    )
    await waitFor(() => expect(insertAiLayout).toHaveBeenCalledTimes(1))
    const request = mockGenerateForgeAILayout.mock.calls[0][0]
    expect(request.prompt).toContain('My edited weather brief')
    expect(request.prompt).toContain(
      'FORGEUI_LAYOUT_TEMPLATE: weather-dashboard',
    )
    const inserted = insertAiLayout.mock.calls[0][0]
    expect(inserted.some((item: any) =>
      item.props.layoutRegionKey === 'weather-dashboard.current-weather',
    )).toBe(true)
    expect(inserted).toEqual(expect.arrayContaining([
      expect.objectContaining({
        componentName: 'Weather_Temperature',
        props: expect.objectContaining({ headingText: '18°' }),
      }),
    ]))
    expect(screen.getByRole('status')).toHaveTextContent(
      'Weather Dashboard generated and inserted on canvas.',
    )
    expect(screen.queryByRole('button', {
      name: 'AI Fill Weather Dashboard',
    })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Insert Into Canvas' }))
      .toBeDisabled()
    expect(mockSetHeroBackground).not.toHaveBeenCalled()
  })

  it('passes a representative Weather region response through the real unified parsing pipeline', async () => {
    const actualEngine = jest.requireActual('./ForgeAIEngine') as typeof import('./ForgeAIEngine')
    mockGenerateForgeAILayout.mockImplementation(
      actualEngine.generateForgeAILayout,
    )
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        document: {
          name: 'Weather Dashboard',
          template: 'weather-dashboard',
          regions: {
            'header-left': [{
              type: 'Heading',
              componentName: 'Weather_Location',
              props: { children: 'TAURANGA' },
            }],
            'header-right': [
              { type: 'Text', componentName: 'Weather_Date', props: { children: 'SATURDAY 8 AUGUST' } },
              { type: 'Text', componentName: 'Weather_Time', props: { children: '8:20 PM' } },
            ],
            'current-weather': [{
              type: 'Heading',
              componentName: 'Weather_Temperature',
              props: { children: '18°' },
            }],
            'forecast-day1': [
              { type: 'Text', componentName: 'Forecast_Day1_Name', props: { children: 'SUN' } },
              { type: 'Icon', componentName: 'Forecast_Day1_Icon', props: { iconName: 'FiSun' } },
              { type: 'Text', componentName: 'Forecast_Day1_Temperature', props: { children: '17° / 9°' } },
            ],
          },
        },
      }),
    })) as jest.Mock
    const insertAiLayout = jest.fn().mockResolvedValue(true)
    renderPanel(insertAiLayout)
    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: { value: 'weather-dashboard' },
    })
    fireEvent.click(screen.getByRole('button', {
      name: 'Generate Weather Dashboard',
    }))

    await waitFor(() => expect(insertAiLayout).toHaveBeenCalledTimes(1))
    const inserted = insertAiLayout.mock.calls[0][0]
    expect(inserted).toEqual(expect.arrayContaining([
      expect.objectContaining({
        componentName: 'Weather_Location',
        props: expect.objectContaining({ headingText: 'TAURANGA' }),
      }),
      expect.objectContaining({
        componentName: 'Weather_Temperature',
        props: expect.objectContaining({
          headingText: '18°',
          layoutRegionId: 'weather-dashboard.current-weather',
        }),
      }),
      expect.objectContaining({
        componentName: 'Forecast_Day1_Temperature',
        props: expect.objectContaining({ textValue: '17° / 9°' }),
      }),
    ]))
  })

  it('reports a malformed real Weather response without canvas mutation', async () => {
    const actualEngine = jest.requireActual('./ForgeAIEngine') as typeof import('./ForgeAIEngine')
    mockGenerateForgeAILayout.mockImplementation(
      actualEngine.generateForgeAILayout,
    )
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        document: { template: 'weather-dashboard' },
      }),
    })) as jest.Mock
    const insertAiLayout = jest.fn()
    renderPanel(insertAiLayout)
    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: { value: 'weather-dashboard' },
    })
    fireEvent.click(screen.getByRole('button', {
      name: 'Generate Weather Dashboard',
    }))

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(
      'AI response must contain a layout array',
    ))
    expect(insertAiLayout).not.toHaveBeenCalled()
  })

  it('exposes and preserves the editable template-owned Weather prompt independently of free-form AI', () => {
    renderPanel(jest.fn())
    const freeFormPrompt = screen.getByPlaceholderText(
      /Create a modern industrial dashboard/,
    ) as HTMLTextAreaElement
    expect(freeFormPrompt.value).toBe('')

    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: { value: 'weather-dashboard' },
    })
    const prompt = screen.getByRole('textbox', {
      name: 'Layout Designer prompt',
    }) as HTMLTextAreaElement
    expect(prompt.value).toContain('TAURANGA')
    expect(prompt.value).toContain('SATURDAY 8 AUGUST')
    expect(prompt.value).toContain('18')
    expect(prompt.value).not.toContain('FiSun')

    fireEvent.change(prompt, {
      target: { value: 'My edited weather brief' },
    })
    expect(prompt.value).toBe('My edited weather brief')
    expect(freeFormPrompt.value).toBe('')
    expect(mockSetHeroBackground).not.toHaveBeenCalled()
  })

  it('locks concurrent Weather generation and leaves the canvas untouched on failure', async () => {
    let rejectGeneration!: (error: Error) => void
    mockGenerateForgeAILayout.mockReturnValue(new Promise((_, reject) => {
      rejectGeneration = reject
    }))
    const insertAiLayout = jest.fn()
    renderPanel(insertAiLayout)
    fireEvent.change(screen.getByDisplayValue('Dashboard'), {
      target: { value: 'weather-dashboard' },
    })
    const generate = screen.getByRole('button', {
      name: 'Generate Weather Dashboard',
    })
    fireEvent.click(generate)
    fireEvent.click(generate)
    expect(generate).toBeDisabled()
    expect(mockGenerateForgeAILayout).toHaveBeenCalledTimes(1)

    rejectGeneration(new Error('AI unavailable'))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('AI unavailable'),
    )
    expect(insertAiLayout).not.toHaveBeenCalled()
  })

  it('keeps free-form Create a layout generation independent', async () => {
    const insertAiLayout = jest.fn()
    renderPanel(insertAiLayout)
    const prompt = screen.getByPlaceholderText(
      /Create a modern industrial dashboard/,
    ) as HTMLTextAreaElement
    fireEvent.change(prompt, {
      target: { value: 'Create a completely free-form marine screen' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Layout' }))

    await waitFor(() => expect(mockGenerateForgeAILayout).toHaveBeenCalled())
    expect(mockGenerateForgeAILayout.mock.calls[0][0].prompt)
      .toBe('Create a completely free-form marine screen')
    expect(insertAiLayout).not.toHaveBeenCalled()
  })

  it('opens the Interactive tab and forwards a Toggle creator request', async () => {
    render(
      <ChakraProvider>
        <ForgeAIPanel
          onClose={jest.fn()}
          insertAiLayout={jest.fn()}
          navigationRequest={{
            target: 'interactive-toggle-switch-designer',
            sourceComponentId: 'canvas-toggle',
            interactiveAssetId: 'saved-toggle',
            requestId: 7,
          }}
        />
      </ChakraProvider>,
    )

    await waitFor(() =>
      expect(screen.getByTestId('forge-ai-tabs')).toHaveAttribute(
        'data-active-tab-index',
        '3',
      ),
    )
    expect(
      screen.getByLabelText('Navigation source component'),
    ).toHaveTextContent('canvas-toggle')
    expect(
      screen.getByLabelText('Navigation interactive asset'),
    ).toHaveTextContent('saved-toggle')
  })

  it('opens the Interactive tab for a Status Indicator creator request', async () => {
    render(
      <ChakraProvider>
        <ForgeAIPanel
          onClose={jest.fn()}
          insertAiLayout={jest.fn()}
          navigationRequest={{
            target: 'interactive-status-indicator-designer',
            sourceComponentId: 'canvas-status',
            requestId: 8,
          }}
        />
      </ChakraProvider>,
    )
    await waitFor(() =>
      expect(screen.getByTestId('forge-ai-tabs')).toHaveAttribute(
        'data-active-tab-index',
        '3',
      ),
    )
    expect(
      screen.getByLabelText('Navigation source component'),
    ).toHaveTextContent('canvas-status')
  })

  const generateArtwork = async () => {
    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Assets',
      }),
    )
    fireEvent.change(
      screen.getByPlaceholderText(/Create a compact industrial battery/),
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

    const image = await screen.findByAltText('AI generated artwork')
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
    const draft = screen.getByLabelText('Toggle name')
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
    loadArtworkImage(screen.getByAltText('AI generated artwork'))

    await waitFor(() => {
      expect(screen.getByTestId('state-sheet-overlay')).toBeInTheDocument()
    })
    expect(screen.getByTestId('forge-ai-tabs')).toHaveAttribute(
      'data-active-tab-index',
      '3',
    )
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
    expect(screen.getByText('OFF selector')).toBeInTheDocument()
    expect(screen.getByText('ON selector')).toBeInTheDocument()
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
    expect(screen.queryByText('AI Asset Designer')).not.toBeInTheDocument()
    expect(screen.queryByText('My Forge Assets')).not.toBeInTheDocument()
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
    expect(screen.getByLabelText('Toggle name')).toHaveValue(
      'Unsaved Pump Toggle',
    )
    expect(screen.getByLabelText('Toggle name')).toBeVisible()
  })

  it('creates both assets and reveals the same unsaved draft without changing tabs', async () => {
    renderPanel()
    await generateArtwork()
    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    )
    const draft = screen.getByLabelText('Toggle name')
    fireEvent.change(draft, {
      target: { value: 'Created Pump Toggle' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    )
    loadArtworkImage(screen.getByAltText('AI generated artwork'))

    await screen.findByTestId('state-sheet-overlay')
    expect(screen.getByTestId('forge-ai-tabs')).toHaveAttribute(
      'data-active-tab-index',
      '3',
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('toggle-state-sheet-workspace'),
      ).not.toBeInTheDocument()
      expect(screen.getByLabelText('OFF asset')).not.toHaveTextContent(/^$/)
      expect(screen.getByLabelText('ON asset')).not.toHaveTextContent(/^$/)
      expect(
        screen.getByLabelText('State sheet source asset'),
      ).not.toHaveTextContent(/^$/)
    })
    expect(screen.getByTestId('forge-ai-tabs')).toHaveAttribute(
      'data-active-tab-index',
      '3',
    )
    expect(screen.getByLabelText('Toggle name')).toHaveValue(
      'Created Pump Toggle',
    )
    expect(screen.getByLabelText('Toggle name')).toBeVisible()
    const sourceAssetId = screen.getByLabelText('State sheet source asset')
      .textContent
    expect(
      forgeUIGetUploadedAssets().some(asset => asset.id === sourceAssetId),
    ).toBe(true)

    const firstOffAssetId = screen.getByLabelText('OFF asset').textContent
    const firstOnAssetId = screen.getByLabelText('ON asset').textContent

    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Assets',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: /Create AI Artwork/,
      }),
    )
    await waitFor(() => {
      expect(screen.getByAltText('AI generated artwork')).toHaveAttribute(
        'src',
        'data:image/png;base64,state-sheet-2',
      )
    })
    loadArtworkImage(screen.getByAltText('AI generated artwork'))

    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Rebuild Toggle Set',
      }),
    )

    const retainedSourceImage = screen.getByAltText('AI generated artwork')
    expect(retainedSourceImage).toHaveAttribute(
      'src',
      'data:image/png;base64,state-sheet-1',
    )
    loadArtworkImage(retainedSourceImage)
    expect(await screen.findByTestId('state-sheet-overlay')).toBeInTheDocument()
    expect(screen.queryByText('AI artwork required')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText('State sheet source asset'),
      ).toHaveTextContent(sourceAssetId || '')
      expect(screen.getByLabelText('OFF asset')).not.toHaveTextContent(
        firstOffAssetId || '',
      )
      expect(screen.getByLabelText('ON asset')).not.toHaveTextContent(
        firstOnAssetId || '',
      )
    })
    expect(screen.getByLabelText('Toggle name')).toHaveValue(
      'Created Pump Toggle',
    )
  })

  it('opens a focused source step for a legacy Toggle and continues into cropping', async () => {
    renderPanel()
    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    )
    const draft = screen.getByLabelText('Toggle name')
    fireEvent.change(draft, {
      target: { value: 'Legacy Pump Toggle' },
    })
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Load legacy Toggle',
      }),
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Replace Toggle Set',
      }),
    )
    expect(
      screen.getByTestId('toggle-state-sheet-workspace'),
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
      screen.queryByText('Toggle source artwork required'),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancel',
      }),
    )
    expect(draft).toBeVisible()
    expect(draft).toHaveValue('Legacy Pump Toggle')
    expect(screen.getByLabelText('OFF asset')).toHaveTextContent('legacy-off')
    expect(screen.getByLabelText('ON asset')).toHaveTextContent('legacy-on')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Replace Toggle Set',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Generate Source Artwork',
      }),
    )
    const generatedSource = await screen.findByAltText('AI generated artwork')
    loadArtworkImage(generatedSource)
    expect(await screen.findByTestId('state-sheet-overlay')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create Toggle Set',
      }),
    )
    await waitFor(() => {
      expect(
        screen.getByLabelText('State sheet source asset'),
      ).not.toHaveTextContent(/^$/)
      expect(screen.getByLabelText('OFF asset')).not.toHaveTextContent(
        'legacy-off',
      )
      expect(screen.getByLabelText('ON asset')).not.toHaveTextContent(
        'legacy-on',
      )
    })
    expect(draft).toBeVisible()
    expect(draft).toHaveValue('Legacy Pump Toggle')
  })

  it('uses current artwork immediately when replacing a legacy Toggle', async () => {
    renderPanel()
    await generateArtwork()
    fireEvent.click(
      screen.getByRole('tab', {
        name: 'Interactive',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Load legacy Toggle',
      }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Replace Toggle Set',
      }),
    )
    loadArtworkImage(screen.getByAltText('AI generated artwork'))

    expect(await screen.findByTestId('state-sheet-overlay')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: 'Generate Source Artwork',
      }),
    ).not.toBeInTheDocument()
  })
})
