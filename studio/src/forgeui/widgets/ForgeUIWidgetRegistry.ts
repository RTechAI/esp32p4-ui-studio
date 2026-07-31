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
  acceptsUserInput: boolean
  isInteractiveAsset: boolean
  childOwnership: 'none' | 'container' | 'structured'
  featureGate: {
    mode: 'serialized-widget' | 'registered-asset'
    lvglConfigDependencies: string[]
  }
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
    'Slider', 'Spinbox', 'Roller', 'Radio', 'Select',
  ],
  Display: [
    'Led', 'Bar', 'Arc', 'Scale', 'Chart', 'Table', 'Clock',
    'WiFi', 'QRCode', 'Progress', 'CircularProgress',
  ],
  Navigation: ['List', 'Tabview', 'Tileview', 'ButtonMatrix'],
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
  Spinbox: [220, 48],
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
  List: [260, 220],
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
  List: ['menu', 'items', 'navigation', 'lv_list'],
  Led: ['indicator', 'status light', 'lamp', 'lv_led'],
  Bar: ['progress', 'meter', 'lv_bar'],
  Chart: ['graph', 'trend', 'plot', 'telemetry', 'lv_chart'],
  Msgbox: ['dialog', 'alert', 'message box', 'lv_msgbox'],
  Roller: ['wheel', 'picker', 'lv_roller'],
  NumberInput: ['numeric', 'number field', 'composed number input'],
  Spinbox: ['numeric', 'digit editor', 'native spin box', 'lv_spinbox'],
  CircularProgress: ['gauge', 'progress ring', 'meter'],
  WiFi: ['network', 'wireless', 'connection'],
  QRCode: ['qr', 'qrcode', 'scan', 'barcode', 'url', 'wifi', 'pairing', 'device'],
  Spinner: ['loading', 'activity', 'busy', 'lv_spinner'],
}

type CapabilityDefinition = Omit<
  ForgeUIWidgetCapabilities,
  'supportsChildren' | 'featureGate'
> & {
  featureGate?: ForgeUIWidgetCapabilities['featureGate']
}

const capability = (
  supportsRuntimeApi: boolean,
  supportsUserEvents: boolean,
  acceptsUserInput: boolean,
  childOwnership: ForgeUIWidgetCapabilities['childOwnership'] = 'none',
  isInteractiveAsset = false,
  featureGate?: ForgeUIWidgetCapabilities['featureGate'],
): CapabilityDefinition => ({
  supportsRuntimeApi,
  supportsUserEvents,
  acceptsUserInput,
  isInteractiveAsset,
  childOwnership,
  ...(featureGate ? { featureGate } : {}),
})

// This table mirrors the publicApiDeclarations and userEventHooks emitted by
// ForgeUILvglExport.ts. Keep every registered type explicit: capability
// metadata must never be inferred from a broad exclusion rule.
const capabilitiesByType: Partial<
  Record<ComponentType, CapabilityDefinition>
> = {
  Text: capability(false, false, false),
  Heading: capability(false, false, false),
  Button: capability(false, false, true),
  IconButton: capability(true, true, true),
  Icon: capability(false, false, false),
  Box: capability(true, false, false, 'container'),
  Line: capability(false, false, false),
  Divider: capability(false, false, false),
  Canvas: capability(false, false, false, 'container'),
  Image: capability(true, false, false),

  Input: capability(true, true, true),
  Textarea: capability(true, true, true),
  NumberInput: capability(true, true, true),
  Checkbox: capability(true, true, true),
  Switch: capability(true, true, true),
  Slider: capability(true, true, true),
  Spinbox: capability(
    true,
    true,
    true,
    'none',
    false,
    {
      mode: 'serialized-widget',
      lvglConfigDependencies: [
        'CONFIG_LV_USE_SPINBOX',
        'CONFIG_LV_USE_TEXTAREA',
      ],
    },
  ),
  Roller: capability(true, true, true),
  Radio: capability(true, true, true),
  Select: capability(true, true, true),

  Led: capability(true, true, false),
  Bar: capability(true, true, false),
  Arc: capability(true, true, true),
  Scale: capability(false, false, false),
  Chart: capability(true, true, false),
  Table: capability(false, false, true),
  Clock: capability(false, false, false),
  WiFi: capability(false, false, false),
  QRCode: capability(
    true,
    false,
    false,
    'none',
    false,
    {
      mode: 'serialized-widget',
      lvglConfigDependencies: ['CONFIG_LV_USE_QRCODE'],
    },
  ),
  Progress: capability(true, false, false),
  CircularProgress: capability(true, false, false),

  List: capability(
    false,
    true,
    true,
    'none',
    false,
    {
      mode: 'serialized-widget',
      lvglConfigDependencies: ['CONFIG_LV_USE_LIST'],
    },
  ),
  Tabview: capability(true, true, true, 'structured'),
  Tileview: capability(
    true, true, true, 'structured', false,
    {
      mode: 'serialized-widget',
      lvglConfigDependencies: ['CONFIG_LV_USE_TILEVIEW'],
    },
  ),
  ButtonMatrix: capability(true, true, true),

  Msgbox: capability(true, true, true),
  Keyboard: capability(true, true, true),
  Calendar: capability(true, true, true),
  Spinner: capability(false, false, false),

  InteractiveButton: capability(
    false, true, true, 'none', true,
    { mode: 'registered-asset', lvglConfigDependencies: [] },
  ),
  InteractiveLight: capability(
    true, false, false, 'none', true,
    { mode: 'registered-asset', lvglConfigDependencies: [] },
  ),
  InteractiveStatusIndicator: capability(
    true, false, false, 'none', true,
    { mode: 'registered-asset', lvglConfigDependencies: [] },
  ),
  InteractiveToggleSwitch: capability(
    true, true, true, 'none', true,
    { mode: 'registered-asset', lvglConfigDependencies: [] },
  ),
  InteractiveThreePositionToggleSwitch: capability(
    false, true, true, 'none', true,
    { mode: 'registered-asset', lvglConfigDependencies: [] },
  ),
}

const documentationByType: Partial<Record<ComponentType, string>> = {
  List: 'docs/FORGEUI_LIST_WIDGET.md',
  Tileview: 'docs/FORGEUI_TILEVIEW_WIDGET.md',
  Spinbox: 'docs/FORGEUI_SPINBOX_WIDGET.md',
  QRCode: 'docs/FORGEUI_QR_CODE.md',
}

const defaultFeatureGate: ForgeUIWidgetCapabilities['featureGate'] = {
  mode: 'serialized-widget',
  lvglConfigDependencies: [],
}

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
    const registeredCapabilities = capabilitiesByType[type]
    if (!registeredCapabilities) {
      throw new Error(`Widget capabilities are missing for ${type}`)
    }
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
        ...registeredCapabilities,
        supportsChildren:
          registeredCapabilities.childOwnership !== 'none',
        featureGate:
          registeredCapabilities.featureGate || defaultFeatureGate,
      },
      documentationId:
        documentationByType[type] || '04_FEATURE_STATUS.md',
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
