import {
  flattenForgeAIRegionComposerDocument,
  isForgeAIRegionComposerDocument,
} from './ForgeAIRegionComposer'

describe('ForgeAI Dashboard region composer contract', () => {
  it('parses canonical region content without pixel geometry', () => {
    const document = {
      template: 'dashboard' as const,
      title: 'CNC-5000',
      regions: {
        status: [
          {
            type: 'CircularProgress',
            props: { value: 68 },
            importance: 2,
          },
        ],
        main: [{ type: 'Chart' }],
        controls: [{ type: 'Button', props: { children: 'Start' } }],
      },
    }
    expect(isForgeAIRegionComposerDocument(document)).toBe(true)
    const flattened = flattenForgeAIRegionComposerDocument(document)
    expect(flattened.layout).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'Heading',
          props: expect.objectContaining({
            layoutRegionId: 'dashboard.header',
          }),
        }),
        expect.objectContaining({
          type: 'Chart',
          props: expect.objectContaining({
            layoutRegionId: 'dashboard.main',
          }),
        }),
        expect.objectContaining({
          type: 'Button',
          props: expect.objectContaining({
            layoutRegionId: 'dashboard.controls',
          }),
        }),
      ]),
    )
    flattened.layout.forEach(item => {
      expect(item.props.x).toBeUndefined()
      expect(item.props.y).toBeUndefined()
    })
  })

  it('rejects unknown canonical types and ignores unknown regions', () => {
    expect(() =>
      flattenForgeAIRegionComposerDocument({
        template: 'dashboard',
        regions: {
          main: [{ type: 'InventedChart' }],
        },
      }),
    ).toThrow('Unsupported region component')
    expect(
      flattenForgeAIRegionComposerDocument({
        template: 'dashboard',
        regions: {
          unknown: [{ type: 'Text' }],
        },
      }).layout,
    ).toEqual([])
  })

  it.each([
    ['weather-dashboard', 'current-weather'],
    ['industrial-hmi', 'process-area'],
    ['control-panel', 'centre-graphic'],
    ['monitoring', 'trend-graph'],
    ['scada-overview', 'main-mimic'],
    ['mobile-portrait', 'main-card'],
  ] as const)(
    'supports the %s semantic region contract',
    (template, region) => {
      const document = {
        template,
        title: 'System',
        regions: {
          [region]: [{ type: 'Chart' }],
        },
      }
      expect(isForgeAIRegionComposerDocument(document)).toBe(true)
      expect(flattenForgeAIRegionComposerDocument(document).layout).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'Chart',
            props: expect.objectContaining({
              layoutRegionId: `${template}.${region}`,
            }),
          }),
        ]),
      )
    },
  )
})
