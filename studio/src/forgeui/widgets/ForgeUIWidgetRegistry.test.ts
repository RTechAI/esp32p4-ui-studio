import { forgeuiCoreWidgets } from '~forgeui/ForgeUIWidgetSet'
import {
  FORGEUI_WIDGET_CATEGORIES,
  forgeUIWidgetDefinitions,
  searchForgeUIWidgets,
} from './ForgeUIWidgetRegistry'

describe('ForgeUI Widget registry', () => {
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
  })
})
