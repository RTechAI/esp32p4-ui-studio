import { getPreviewDefaultProps } from '~utils/defaultProps'

export const FORGEUI_WIDGET_CATEGORIES = [
  'Basic',
  'Input',
  'Display',
  'Navigation',
  'Feedback',
  'Dashboard',
  'Assets',
] as const

export type ForgeUIWidgetCategory =
  typeof FORGEUI_WIDGET_CATEGORIES[number]

export type ForgeUIWidgetCapabilities = {
  supportsRuntimeApi: boolean
  supportsUserEvents: boolean
  supportsChildren: boolean
  interactive: boolean
}

export type ForgeUIWidgetDefinition = {
  type: ComponentType
  displayName: string
  category: ForgeUIWidgetCategory
  description: string
  keywords: string[]
  defaultWidth: number
  defaultHeight: number
  defaultProperties: Record<string, unknown>
  insertionFactory: (
    x: number,
    y: number,
  ) => Record<string, unknown>
  capabilities: ForgeUIWidgetCapabilities
  documentationId?: string
  status: 'available' | 'experimental' | 'disabled'
}

const displayNames: Partial<Record<ComponentType, string>> = {
  IconButton: 'Icon Button',
  NumberInput: 'Number Input',
  CircularProgress: 'Circular Progress',
  ButtonMatrix: 'Button Matrix',
  Tabview: 'TabView',
  Tileview: 'TileView',
  Msgbox: 'Message Box',
  InteractiveButton: 'Interactive Button',
  InteractiveLight: 'Interactive Light',
  InteractiveStatusIndicator: 'Interactive Status Indicator',
  InteractiveToggleSwitch: 'Interactive Toggle Switch',
  InteractiveThreePositionToggleSwitch: 'Three Position Toggle',
  Led: 'LED',
  WiFi: 'Wi-Fi Status',
  QRCode: 'QR Code',
  Textarea: 'Textarea',
}

const categories: Record<ForgeUIWidgetCategory, ComponentType[]> = {
  Basic: [
    'Text', 'Heading', 'Button', 'IconButton', 'Icon', 'Box',
    'Line', 'Divider', 'Canvas', 'Image',
  ],
  Input: [
    'Input', 'Textarea', 'NumberInput', 'Checkbox', 'Switch',
    'Slider', 'Roller', 'Radio', 'Select',
  ],
  Display: [
    'Led', 'Bar', 'Arc', 'Scale', 'Chart', 'Table', 'Clock',
    'WiFi', 'QRCode', 'Progress', 'CircularProgress',
  ],
  Navigation: ['Tabview', 'Tileview', 'ButtonMatrix'],
  Feedback: ['Msgbox', 'Keyboard', 'Calendar', 'Spinner'],
  Dashboard: [],
  Assets: [
    'InteractiveButton',
    'InteractiveLight',
    'InteractiveStatusIndicator',
    'InteractiveToggleSwitch',
    'InteractiveThreePositionToggleSwitch',
  ],
}

const categoryByType = new Map<ComponentType, ForgeUIWidgetCategory>()
Object.entries(categories).forEach(([category, types]) => {
  types.forEach(type => {
    categoryByType.set(type, category as ForgeUIWidgetCategory)
  })
})

const sizes: Partial<Record<ComponentType, [number, number]>> = {
  Led: [32, 32],
  Arc: [120, 120],
  Line: [120, 120],
  CircularProgress: [96, 92],
  Heading: [200, 48],
  Text: [80, 24],
  Clock: [90, 32],
  WiFi: [120, 60],
  Input: [160, 36],
  NumberInput: [280, 40],
  Textarea: [220, 80],
  Button: [120, 40],
  InteractiveButton: [200, 100],
  InteractiveToggleSwitch: [64, 36],
  InteractiveThreePositionToggleSwitch: [96, 36],
  InteractiveStatusIndicator: [120, 72],
  InteractiveLight: [32, 32],
  Select: [180, 36],
  Switch: [48, 28],
  Checkbox: [28, 28],
  Radio: [28, 28],
  Slider: [180, 36],
  Progress: [180, 24],
  Roller: [120, 72],
  Icon: [48, 48],
  IconButton: [48, 48],
  Divider: [180, 2],
  Box: [180, 100],
  Chart: [360, 220],
  Table: [360, 220],
  Canvas: [320, 200],
  Tabview: [360, 240],
  Tileview: [360, 240],
  Keyboard: [420, 180],
  Calendar: [320, 260],
  Msgbox: [320, 180],
  Scale: [240, 100],
  Bar: [220, 32],
  ButtonMatrix: [300, 180],
  Image: [240, 160],
  QRCode: [180, 180],
  Spinner: [96, 96],
}

const keywords: Partial<Record<ComponentType, string[]>> = {
  Arc: ['gauge', 'dial', 'meter', 'lv_arc'],
  Scale: ['gauge', 'ticks', 'meter', 'lv_scale'],
  Input: ['text box', 'field', 'entry', 'lv_textarea'],
  Textarea: ['text box', 'multiline', 'entry', 'lv_textarea'],
  Tabview: ['tabs', 'tab view', 'lv_tabview'],
  Tileview: ['tiles', 'pages', 'swipe', 'lv_tileview'],
  ButtonMatrix: ['button grid', 'keypad', 'lv_buttonmatrix'],
  Led: ['indicator', 'status light', 'lamp', 'lv_led'],
  Bar: ['progress', 'meter', 'lv_bar'],
  Chart: ['graph', 'trend', 'plot', 'telemetry', 'lv_chart'],
  Msgbox: ['dialog', 'alert', 'message box', 'lv_msgbox'],
  Roller: ['wheel', 'picker', 'lv_roller'],
  NumberInput: ['numeric', 'spinbox', 'number field', 'lv_spinbox'],
  CircularProgress: ['gauge', 'progress ring', 'meter'],
  WiFi: ['network', 'wireless', 'connection'],
  QRCode: ['qr', 'qrcode', 'scan', 'barcode', 'url', 'wifi', 'pairing', 'device'],
  Spinner: ['loading', 'activity', 'busy', 'lv_spinner'],
}

const eventTypes = new Set<ComponentType>([
  'Button', 'IconButton', 'Input', 'Textarea', 'NumberInput',
  'Checkbox', 'Switch', 'Slider', 'Roller', 'Radio', 'Select',
  'ButtonMatrix', 'Keyboard', 'Calendar', 'Tabview', 'Tileview',
  'InteractiveButton', 'InteractiveLight',
  'InteractiveStatusIndicator', 'InteractiveToggleSwitch',
  'InteractiveThreePositionToggleSwitch',
])

const interactiveTypes = new Set<ComponentType>([
  'InteractiveButton', 'InteractiveLight',
  'InteractiveStatusIndicator', 'InteractiveToggleSwitch',
  'InteractiveThreePositionToggleSwitch',
])

const childTypes = new Set<ComponentType>([
  'Box', 'Canvas', 'Tabview', 'Tileview',
])

const describe = (
  type: ComponentType,
  name: string,
  category: ForgeUIWidgetCategory,
) => {
  const special: Partial<Record<ComponentType, string>> = {
    Arc: 'Circular gauge or rotary value display.',
    Scale: 'Tick-mark scale for gauges and measured values.',
    Chart: 'Trend and telemetry data visualization.',
    Box: 'General-purpose visual container.',
    Canvas: 'Drawable LVGL canvas surface.',
    InteractiveButton: 'Reusable state-sheet driven button.',
  }
  return special[type] || `${name} ${category.toLowerCase()} widget.`
}

export const forgeUIWidgetDefinitions: ForgeUIWidgetDefinition[] =
  (Object.values(categories).flat() as ComponentType[]).map(type => {
    const category = categoryByType.get(type)
    if (!category) {
      throw new Error(`Widget category is missing for ${type}`)
    }
    const displayName = displayNames[type] || type
    const [defaultWidth, defaultHeight] = sizes[type] || [240, 120]
    const defaults = getPreviewDefaultProps(type)
    const defaultProperties = defaults
      ? Object.fromEntries(
          Object.entries(defaults).filter(([key]) => key !== 'form'),
        )
      : {}
    return {
      type,
      displayName,
      category,
      description: describe(type, displayName, category),
      keywords: [
        type,
        displayName,
        category,
        ...(keywords[type] || []),
      ],
      defaultWidth,
      defaultHeight,
      defaultProperties,
      insertionFactory: (x, y) => ({
        positionMode: 'absolute',
        x,
        y,
        w: defaultWidth,
        h: defaultHeight,
      }),
      capabilities: {
        supportsRuntimeApi: type !== 'Spinner',
        supportsUserEvents: eventTypes.has(type),
        supportsChildren: childTypes.has(type),
        interactive: interactiveTypes.has(type),
      },
      documentationId: `widget-${type.toLowerCase()}`,
      status: 'available',
    }
  })

const definitionsByType = new Map(
  forgeUIWidgetDefinitions.map(definition => [
    definition.type,
    definition,
  ]),
)

export const getForgeUIWidgetDefinition = (
  type: ComponentType,
): ForgeUIWidgetDefinition | undefined =>
  definitionsByType.get(type)

export const searchForgeUIWidgets = (
  query: string,
): ForgeUIWidgetDefinition[] => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return forgeUIWidgetDefinitions
  return forgeUIWidgetDefinitions.filter(definition =>
    [
      definition.displayName,
      definition.category,
      definition.description,
      ...definition.keywords,
    ].some(value => value.toLowerCase().includes(normalized)),
  )
}
