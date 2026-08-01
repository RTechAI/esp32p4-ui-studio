import { forgeuiCoreWidgets } from '~forgeui/ForgeUIWidgetSet'
import {
  FORGEUI_WIDGET_CATEGORIES,
  forgeUIWidgetDefinitions,
  getForgeUIWidgetInstanceCapabilities,
  searchForgeUIWidgets,
} from './ForgeUIWidgetRegistry'

describe('ForgeUI Widget registry', () => {
  it('resolves Standard Icon runtime and optional event capabilities per instance', () => {
    expect(getForgeUIWidgetInstanceCapabilities('Icon', {})).toMatchObject({
      runtimeApiEnabled: true,
      userEventsEnabled: false,
      acceptsUserInput: false,
    })
    expect(getForgeUIWidgetInstanceCapabilities('Icon', {
      generateRuntimeApi: false,
      enableClick: true,
    })).toMatchObject({
      runtimeApiEnabled: false,
      userEventsEnabled: true,
    })
  })

  it('registers every supported tray widget exactly once with valid metadata', () => {
    expect(forgeUIWidgetDefinitions.map(item => item.type).sort())
      .toEqual([...forgeuiCoreWidgets].sort())
    expect(new Set(
      forgeUIWidgetDefinitions.map(item => item.type),
    ).size).toBe(forgeUIWidgetDefinitions.length)
    forgeUIWidgetDefinitions.forEach(definition => {
      expect(definition.displayName).toEqual(expect.any(String))
      expect(definition.displayName.length).toBeGreaterThan(0)
      expect(FORGEUI_WIDGET_CATEGORIES).toContain(definition.category)
      expect(definition.defaultWidth).toBeGreaterThan(0)
      expect(definition.defaultHeight).toBeGreaterThan(0)
      expect(typeof definition.insertionFactory).toBe('function')
      expect(definition.documentationId).toMatch(/\.md$/)
      expect(definition.capabilities).toEqual(expect.objectContaining({
        supportsRuntimeApi: expect.any(Boolean),
        supportsUserEvents: expect.any(Boolean),
        supportsChildren: expect.any(Boolean),
        acceptsUserInput: expect.any(Boolean),
        isInteractiveAsset: expect.any(Boolean),
        childOwnership: expect.stringMatching(/^(none|container|structured)$/),
        featureGate: expect.objectContaining({
          mode: expect.stringMatching(/^(serialized-widget|registered-asset)$/),
          lvglConfigDependencies: expect.any(Array),
        }),
      }))
      expect(definition.insertionFactory(12.5, 20.25)).toMatchObject({
        positionMode: 'absolute',
        x: 12.5,
        y: 20.25,
        w: definition.defaultWidth,
        h: definition.defaultHeight,
      })
    })
  })

  it.each([
    ['Button', 'Button'],
    ['gauge', 'Arc'],
    ['gauge', 'Scale'],
    ['text box', 'Input'],
    ['tabs', 'Tabview'],
    ['lv_chart', 'Chart'],
    ['pairing', 'QRCode'],
    ['qrcode', 'QRCode'],
    ['loading', 'Spinner'],
    ['lv_spinner', 'Spinner'],
    ['lv_spinbox', 'Spinbox'],
    ['lv_list', 'List'],
  ])('finds %s using registered terminology', (query, type) => {
    expect(searchForgeUIWidgets(query).map(item => item.type))
      .toContain(type)
  })

  it('returns an empty collection when nothing matches', () => {
    expect(searchForgeUIWidgets('quantum flux capacitor')).toEqual([])
  })

  it('registers QR Code with its insertion and persistence defaults', () => {
    const qr = forgeUIWidgetDefinitions.find(item => item.type === 'QRCode')
    expect(qr).toMatchObject({
      displayName: 'QR Code',
      category: 'Display',
      defaultWidth: 180,
      defaultHeight: 180,
      defaultProperties: {
        qrText: 'https://forgeui.co.nz',
      },
    })
    expect(JSON.parse(JSON.stringify(qr?.defaultProperties))).toEqual(
      qr?.defaultProperties,
    )
  })

  it('registers Spinner as presentation-only native feedback', () => {
    const spinner = forgeUIWidgetDefinitions.find(
      item => item.type === 'Spinner',
    )
    expect(spinner).toMatchObject({
      category: 'Feedback',
      defaultWidth: 96,
      defaultHeight: 96,
      capabilities: {
        supportsRuntimeApi: false,
        supportsUserEvents: false,
      },
      defaultProperties: {
        duration: 1000,
        arcLength: 60,
        arcWidth: 8,
        backgroundWidth: 8,
        opacity: 100,
      },
    })
  })

  it('registers List as a native, serialized navigation widget', () => {
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'List'))
      .toMatchObject({
        category: 'Navigation',
        defaultWidth: 260,
        defaultHeight: 220,
        capabilities: {
          supportsRuntimeApi: false,
          supportsUserEvents: true,
          supportsChildren: false,
        },
        defaultProperties: {
          title: 'Menu',
          items: 'Overview\nSettings\nDiagnostics',
          itemHeight: 44,
        },
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'Tileview'))
      .toMatchObject({
        documentationId: 'docs/FORGEUI_TILEVIEW_WIDGET.md',
        capabilities: {
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: ['CONFIG_LV_USE_TILEVIEW'],
          },
        },
      })
  })

  it('registers Spinbox as native interactive numeric input', () => {
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'Spinbox'))
      .toMatchObject({
        category: 'Input',
        defaultWidth: 220,
        defaultHeight: 48,
        capabilities: {
          supportsRuntimeApi: true,
          supportsUserEvents: true,
          supportsChildren: false,
          acceptsUserInput: true,
          isInteractiveAsset: false,
        },
        defaultProperties: {
          min: 0,
          max: 99999,
          value: 0,
          digitCount: 5,
          decimalPlaces: 0,
        },
      })
  })

  it.each([
    ['Text', false, false, false],
    ['Heading', false, false, false],
    ['Button', false, false, true],
      ['Icon', true, true, false],
    ['Divider', false, false, false],
    ['Scale', false, false, false],
    ['Clock', false, false, false],
    ['Canvas', false, false, false],
    ['Slider', true, true, true],
    ['Switch', true, true, true],
    ['Select', true, true, true],
    ['List', false, true, true],
    ['InteractiveLight', true, false, false],
    ['InteractiveStatusIndicator', true, false, false],
  ])(
    'aligns %s capabilities with generated APIs and hooks',
    (type, runtime, events, input) => {
      expect(forgeUIWidgetDefinitions.find(item => item.type === type))
        .toMatchObject({
          capabilities: {
            supportsRuntimeApi: runtime,
            supportsUserEvents: events,
            acceptsUserInput: input,
          },
        })
    },
  )

  it('records real documentation targets and known LVGL dependencies', () => {
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'Image'))
      .toMatchObject({
        capabilities: {
          supportsRuntimeApi: true,
          supportsUserEvents: false,
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: ['CONFIG_LV_USE_IMAGE'],
          },
        },
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'Line'))
      .toMatchObject({
        capabilities: {
          supportsRuntimeApi: false,
          supportsUserEvents: false,
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: ['CONFIG_LV_USE_LINE'],
          },
        },
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'List'))
      .toMatchObject({
        documentationId: 'docs/FORGEUI_LIST_WIDGET.md',
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'Spinbox'))
      .toMatchObject({
        documentationId: 'docs/FORGEUI_SPINBOX_WIDGET.md',
        capabilities: {
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: [
              'CONFIG_LV_USE_SPINBOX',
              'CONFIG_LV_USE_TEXTAREA',
            ],
          },
        },
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'QRCode'))
      .toMatchObject({
        documentationId: 'docs/FORGEUI_QR_CODE.md',
        capabilities: {
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: ['CONFIG_LV_USE_QRCODE'],
          },
        },
      })
    expect(forgeUIWidgetDefinitions.find(item => item.type === 'List'))
      .toMatchObject({
        capabilities: {
          featureGate: {
            mode: 'serialized-widget',
            lvglConfigDependencies: ['CONFIG_LV_USE_LIST'],
          },
        },
      })
  })
})
