import {
  flattenForgeAIRegionComposerDocument,
  isForgeAIRegionComposerDocument,
} from './ForgeAIRegionComposer'
import { parseForgeAIResponse } from './ForgeAIParser'
import { forgeAIVisibleComponents } from './ForgeAIComponentCatalogue'

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

  it('carries Weather Dashboard semantic values and names into normal region items', () => {
    const flattened = flattenForgeAIRegionComposerDocument({
      template: 'weather-dashboard',
      regions: {
        'header-left': [{
          type: 'Heading',
          componentName: 'Weather_Location',
          props: { children: 'TAURANGA' },
        }],
        'current-weather': [{
          type: 'Text',
          componentName: 'Weather_Temperature',
          props: { textValue: '18°' },
        }],
        'forecast-day1': [{
          type: 'Icon',
          componentName: 'Forecast_Day1_Icon',
          props: { iconName: 'FiSun' },
        }],
      },
    })
    expect(flattened.layout).toEqual(expect.arrayContaining([
      expect.objectContaining({
        componentName: 'Weather_Location',
        props: expect.objectContaining({
          children: 'TAURANGA',
          layoutRegionId: 'weather-dashboard.header-left',
        }),
      }),
      expect.objectContaining({
        componentName: 'Weather_Temperature',
        props: expect.objectContaining({ textValue: '18°' }),
      }),
      expect.objectContaining({
        componentName: 'Forecast_Day1_Icon',
        props: expect.objectContaining({ iconName: 'FiSun' }),
      }),
    ]))
  })

  it('retains Weather semantic values through composer and authoritative parser normalization', () => {
    const flattened = flattenForgeAIRegionComposerDocument({
      template: 'weather-dashboard',
      regions: {
        'header-left': [{
          type: 'Heading',
          componentName: 'Weather_Location',
          props: { children: 'TAURANGA' },
        }],
        'current-weather': [
          {
            type: 'Text',
            componentName: 'Weather_Temperature',
            props: { children: '18°' },
          },
          {
            type: 'Text',
            componentName: 'Weather_Condition',
            props: { children: 'CLEAR SKY' },
          },
        ],
      },
    })
    const parsed = parseForgeAIResponse(
      JSON.stringify(flattened),
      forgeAIVisibleComponents,
    )

    expect(parsed.layout).toEqual(expect.arrayContaining([
      expect.objectContaining({
        componentName: 'Weather_Location',
        props: expect.objectContaining({ headingText: 'TAURANGA' }),
      }),
      expect.objectContaining({
        componentName: 'Weather_Temperature',
        props: expect.objectContaining({ textValue: '18°' }),
      }),
      expect.objectContaining({
        componentName: 'Weather_Condition',
        props: expect.objectContaining({ textValue: 'CLEAR SKY' }),
      }),
    ]))
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
