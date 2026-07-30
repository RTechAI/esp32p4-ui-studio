import {
  composeForgeAILayout,
  scoreForgeAILayout,
  selectForgeAIComponentsForPurpose,
} from './ForgeAILayoutEngine'
import {
  buildForgeAIAllAssetsCoverageFixture,
} from './ForgeAIAllAssetsCoverage'
import type {
  ForgeAILayoutDocument,
  ForgeAILayoutItem,
} from './ForgeAIParser'

const documentFor = (
  layout: ForgeAILayoutItem[],
): ForgeAILayoutDocument => ({
  name: 'Layout',
  category: 'Test',
  description: '',
  layout,
})

const item = (
  type: string,
  props: Record<string, unknown> = {},
): ForgeAILayoutItem => ({
  type,
  props: { x: 24, y: 24, w: 120, h: 48, ...props },
})

describe('ForgeAI purpose-aware geometry repair', () => {
  it('preserves valid AI composition instead of replacing it with a grid', () => {
    const input = documentFor([
      item('Heading', { x: 30, y: 24, w: 500, h: 56 }),
      item('Chart', { x: 350, y: 110, w: 620, h: 300 }),
      item('Button', { x: 40, y: 500, w: 140, h: 50 }),
    ])
    const result = composeForgeAILayout(
      input,
      1024,
      600,
      'Create an industrial dashboard with a chart and start button',
    )
    expect(result.layout.map(entry => entry.props)).toEqual(
      input.layout.map(entry => ({
        ...entry.props,
        positionMode: 'absolute',
      })),
    )
  })

  it('repairs only colliding or off-screen geometry', () => {
    const input = documentFor([
      item('Heading', { x: 30, y: 24, w: 500, h: 56 }),
      item('Input', { x: 40, y: 120, w: 260, h: 48 }),
      item('Button', { x: 40, y: 120, w: 140, h: 48 }),
      item('Progress', { x: 950, y: 580, w: 240, h: 24 }),
    ])
    const result = composeForgeAILayout(
      input,
      1024,
      600,
      'Create a form with input, button and progress',
    )
    expect(result.layout[0].props).toMatchObject({ x: 30, y: 24 })
    expect(scoreForgeAILayout(result.layout, 1024, 600)).toMatchObject({
      overlaps: 0,
      offScreen: 0,
    })
  })

  it('keeps structural Boxes below contained controls without treating containment as collision', () => {
    const result = composeForgeAILayout(documentFor([
      item('Button', { x: 80, y: 160, w: 140, h: 48 }),
      item('Box', { x: 40, y: 100, w: 300, h: 180 }),
      item('Text', { x: 70, y: 120, w: 180, h: 32 }),
    ]), 1024, 600, 'Create a control panel with a Box, Text and Button')
    expect(result.layout.map(entry => entry.type)).toEqual([
      'Box', 'Button', 'Text',
    ])
    expect(scoreForgeAILayout(result.layout, 1024, 600).overlaps).toBe(0)
  })

  it('removes unrelated specialist widgets from a normal industrial dashboard', () => {
    const selected = selectForgeAIComponentsForPurpose([
      item('Heading'), item('Text'), item('Box'), item('Divider'),
      item('Led'), item('Chart'), item('Progress'), item('CircularProgress'),
      item('Button'), item('Keyboard'), item('Calendar'), item('Msgbox'),
      item('Tileview'), item('Tabview'), item('ButtonMatrix'), item('Textarea'),
    ], 'Create an industrial machine dashboard with status, trends and start and stop controls')
    const types = selected.map(entry => entry.type)
    expect(types).toEqual(expect.arrayContaining([
      'Heading', 'Text', 'Box', 'Divider', 'Led', 'Chart', 'Progress',
      'CircularProgress', 'Button',
    ]))
    expect(types).not.toEqual(expect.arrayContaining([
      'Keyboard', 'Calendar', 'Msgbox', 'Tileview', 'Tabview',
      'ButtonMatrix', 'Textarea',
    ]))
  })

  it.each([
    {
      prompt: 'Create a settings screen with input, select, switch, checkbox and save button',
      allowed: ['Heading', 'Box', 'Text', 'Input', 'Select', 'Switch', 'Checkbox', 'Button', 'Divider'],
      rejected: ['Keyboard', 'Calendar', 'Tabview'],
    },
    {
      prompt: 'Create a login screen with username, password, remember me and login button',
      allowed: ['Heading', 'Text', 'Box', 'Input', 'Button', 'Checkbox'],
      rejected: ['Calendar', 'Msgbox', 'Tileview'],
    },
    {
      prompt: 'Create a WiFi setup screen with network selection, password input, connect button and status',
      allowed: ['Heading', 'Text', 'Box', 'Select', 'Input', 'Button', 'WiFi'],
      rejected: ['Calendar', 'Tabview', 'ButtonMatrix'],
    },
  ])('keeps a sensible $prompt component family', ({ prompt, allowed, rejected }) => {
    const candidates = [...allowed, ...rejected].map(type => item(type))
    const types = selectForgeAIComponentsForPurpose(candidates, prompt)
      .map(entry => entry.type)
    expect(types).toEqual(expect.arrayContaining(allowed))
    expect(types).not.toEqual(expect.arrayContaining(rejected))
  })

  it('preserves explicit All Components Test coverage in its isolated dense layout', () => {
    const allItems = buildForgeAIAllAssetsCoverageFixture()
      .flatMap(document => document.layout)
    const required = allItems
      .map(entry => `- ${entry.type}: one instance`)
      .join('\n')
    const result = composeForgeAILayout(
      documentFor(allItems),
      1024,
      600,
      `REQUIRED FORGEUI COMPONENTS:\n${required}\n\nCOMPONENT RULES:\nThis is a component coverage test.`,
    )
    expect(result.layout).toHaveLength(allItems.length)
    expect(new Set(result.layout.map(entry => entry.type))).toEqual(
      new Set(allItems.map(entry => entry.type)),
    )
    expect(scoreForgeAILayout(result.layout, 1024, 600)).toMatchObject({
      overlaps: 0,
      offScreen: 0,
    })
  })
})
