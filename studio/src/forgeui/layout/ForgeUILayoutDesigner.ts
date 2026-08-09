import { getForgeAIComponentEntry } from '~forgeui/ai/ForgeAIComponentCatalogue'

export type ForgeUILayoutRegionRole =
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'main'
  | 'content'
  | 'status'
  | 'controls'
  | 'navigation'
  | 'chart'
  | 'form'
  | 'card-grid'
  | 'toolbar'
  | 'settings-grid'
  | 'process'
  | 'alarms'
  | 'metrics'
  | 'events'
  | 'information'
  | 'graphic'

export type ForgeUILayoutArrangement =
  | 'vertical'
  | 'horizontal'
  | 'grid'
  | 'kpi-cards'
  | 'button-stack'
  | 'form-rows'
  | 'even-distribution'
  | 'fit-to-region'

export type ForgeUILayoutTemplateItem = {
  type: ComponentType
  componentName?: string
  props: Record<string, unknown>
}

export type ForgeUILayoutTemplateId =
  | 'dashboard'
  | 'weather-dashboard'
  | 'industrial-hmi'
  | 'control-panel'
  | 'monitoring'
  | 'scada-overview'
  | 'mobile-portrait'

export type ForgeUILayoutTemplate = {
  id: ForgeUILayoutTemplateId
  name: string
  description: string
  useCases: string[]
  aiGuidance: string
  defaultPrompt?: string
  width: number
  height: number
  layout: ForgeUILayoutTemplateItem[]
}

export const FORGEUI_WEATHER_DASHBOARD_DEFAULT_PROMPT = `Create a premium modern weather dashboard for a 1024x600 ESP32-P4 touchscreen.

Populate the existing Weather Dashboard smart regions only.
Preserve the currently selected Theme and weather background.
Do not generate, select, clear or replace the background.

HeaderLeft:
Display location "TAURANGA".

HeaderRight:
Display date "SATURDAY 8 AUGUST".
Display time "8:20 PM".

CurrentWeather:
Display a very large dominant temperature "18°".
Display condition "CLEAR SKY".
Display "Feels like 17°".
Place the temperature on the left, condition and feels-like beneath it, and a smaller current-weather icon toward the right.

Metrics:
Create four compact weather metrics:
HUMIDITY — 72%
WIND — 11 km/h
RAIN — 10%
UV — 2

Forecast_Day1:
SUN
suitable sunny weather icon
17° / 9°

Forecast_Day2:
MON
suitable cloudy weather icon
16° / 10°

Forecast_Day3:
TUE
suitable rain weather icon
14° / 8°

Forecast_Day4:
WED
suitable sunny weather icon
17° / 7°

Forecast_Day5:
THU
suitable partly-cloudy weather icon
16° / 9°

Use only normal editable ForgeUI components such as Heading, Text and Icon.
In each forecast region keep the day at top, icon centred and high/low temperature at bottom. Keep every child completely inside its assigned Smart Region.

Use clean white typography.
Make the current temperature the dominant visual element.
Use restrained translucent dark-glass styling where required for readability.
Keep substantial portions of the weather background visible.

Do not add buttons.
Do not add navigation.
Do not add charts.
Do not add sliders or controls.
Do not create a Native Weather Component.
Do not create private LVGL objects.

Use meaningful stable component names where the current ForgeUI model supports them:
Weather_Location
Weather_Date
Weather_Time
Weather_Temperature
Weather_Condition
Weather_FeelsLike
Weather_Humidity
Weather_Wind
Weather_Rain
Weather_UV
Forecast_Day1_Name
Forecast_Day1_Icon
Forecast_Day1_Temperature
Forecast_Day2_Name
Forecast_Day2_Icon
Forecast_Day2_Temperature
Forecast_Day3_Name
Forecast_Day3_Icon
Forecast_Day3_Temperature
Forecast_Day4_Name
Forecast_Day4_Icon
Forecast_Day4_Temperature
Forecast_Day5_Name
Forecast_Day5_Icon
Forecast_Day5_Temperature

Goal:
Produce a polished editable first-pass weather application screen ready for later Runtime SDK wiring to live online weather data.`

const region = (
  key: string,
  role: ForgeUILayoutRegionRole,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  arrangement: ForgeUILayoutArrangement,
  surfaceRole: 'surface' | 'surfaceSecondary' = 'surfaceSecondary',
): ForgeUILayoutTemplateItem => ({
  type: 'Box',
  props: {
    positionMode: 'absolute',
    x,
    y,
    w,
    h,
    layoutRegionKey: key,
    layoutRegionRole: role,
    layoutRegionLabel: label,
    layoutPadding: 16,
    layoutHorizontalGap: 12,
    layoutVerticalGap: 12,
    layoutArrangement: arrangement,
    layoutColumns: role === 'main' ? 1 : 2,
    layoutRows: 1,
    layoutMinChildWidth: 40,
    layoutMinChildHeight: 40,
    layoutLockedStructure: false,
    layoutSurfaceRole: surfaceRole,
    layoutBorderRole: 'surfaceBorder',
    layoutRadius: 12,
    layoutBorderWidth: 1,
    layoutOpacity: 0.92,
  },
})

export const forgeUIDashboardTemplate: ForgeUILayoutTemplate = {
  id: 'dashboard',
  name: 'Dashboard',
  description:
    'Header, status, main visualization, controls and footer regions.',
  useCases: ['Operational dashboards', 'Status and control screens'],
  aiGuidance: 'Use gauges, indicators, charts and action buttons.',
  width: 1024,
  height: 600,
  layout: [
    region(
      'dashboard.header',
      'header',
      'Header',
      24,
      24,
      976,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'dashboard.status',
      'status',
      'Status',
      24,
      104,
      240,
      400,
      'vertical',
    ),
    region(
      'dashboard.main',
      'main',
      'Main',
      280,
      104,
      480,
      400,
      'fit-to-region',
      'surface',
    ),
    region(
      'dashboard.controls',
      'controls',
      'Controls',
      776,
      104,
      224,
      400,
      'button-stack',
    ),
    region(
      'dashboard.footer',
      'footer',
      'Footer',
      24,
      520,
      976,
      56,
      'horizontal',
      'surface',
    ),
    {
      type: 'Divider',
      props: {
        positionMode: 'absolute',
        x: 24,
        y: 92,
        w: 976,
        h: 2,
        layoutStructuralFor: 'dashboard',
      },
    },
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 40,
        y: 32,
        w: 520,
        h: 48,
        textValue: 'Dashboard',
        children: 'Dashboard',
        layoutRegionId: 'dashboard.header',
        layoutOrder: 0,
      },
    },
  ],
}

const weatherRegion = (
  key: string,
  role: ForgeUILayoutRegionRole,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  arrangement: ForgeUILayoutArrangement,
  columns = 1,
): ForgeUILayoutTemplateItem => {
  const item = region(key, role, label, x, y, w, h, arrangement, 'surface')
  return {
    ...item,
    props: {
      ...item.props,
      layoutColumns: columns,
      layoutPadding: 12,
      layoutHorizontalGap: 8,
      layoutVerticalGap: 8,
      layoutOpacity: 0.32,
    },
  }
}

export const forgeUIWeatherDashboardTemplate: ForgeUILayoutTemplate = {
  id: 'weather-dashboard',
  name: 'Weather Dashboard',
  description:
    'Artwork-forward current conditions, weather metrics and five-day forecast.',
  useCases: [
    'Weather stations',
    'Home weather displays',
    'Forecast dashboards',
  ],
  aiGuidance:
    'Use Heading, Text and Icon components for location, date, time, temperature, condition, feels-like, humidity, wind, rain, UV and five daily forecasts. Keep content concise and use meaningful stable Weather_ and Forecast_Day names where component naming is supported.',
  defaultPrompt: FORGEUI_WEATHER_DASHBOARD_DEFAULT_PROMPT,
  width: 1024,
  height: 600,
  layout: [
    weatherRegion(
      'weather-dashboard.header-left',
      'header',
      'HeaderLeft',
      24,
      24,
      480,
      72,
      'horizontal',
    ),
    weatherRegion(
      'weather-dashboard.header-right',
      'header',
      'HeaderRight',
      520,
      24,
      480,
      72,
      'horizontal',
    ),
    weatherRegion(
      'weather-dashboard.current-weather',
      'main',
      'CurrentWeather',
      24,
      112,
      600,
      244,
      'vertical',
    ),
    weatherRegion(
      'weather-dashboard.metrics',
      'metrics',
      'Metrics',
      24,
      372,
      976,
      80,
      'kpi-cards',
      4,
    ),
    weatherRegion(
      'weather-dashboard.forecast-day1',
      'content',
      'Forecast_Day1',
      24,
      468,
      180,
      108,
      'vertical',
    ),
    weatherRegion(
      'weather-dashboard.forecast-day2',
      'content',
      'Forecast_Day2',
      223,
      468,
      180,
      108,
      'vertical',
    ),
    weatherRegion(
      'weather-dashboard.forecast-day3',
      'content',
      'Forecast_Day3',
      422,
      468,
      180,
      108,
      'vertical',
    ),
    weatherRegion(
      'weather-dashboard.forecast-day4',
      'content',
      'Forecast_Day4',
      621,
      468,
      180,
      108,
      'vertical',
    ),
    weatherRegion(
      'weather-dashboard.forecast-day5',
      'content',
      'Forecast_Day5',
      820,
      468,
      180,
      108,
      'vertical',
    ),
  ],
}

const template = (
  id: ForgeUILayoutTemplateId,
  name: string,
  description: string,
  useCases: string[],
  aiGuidance: string,
  regions: ForgeUILayoutTemplateItem[],
): ForgeUILayoutTemplate => ({
  id,
  name,
  description,
  useCases,
  aiGuidance,
  width: 1024,
  height: 600,
  layout: [
    ...regions,
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 40,
        y: 32,
        w: 520,
        h: 48,
        textValue: name,
        children: name,
        layoutRegionId: `${id}.header`,
        layoutOrder: 0,
      },
    },
  ],
})

export const forgeUIIndustrialHMITemplate = template(
  'industrial-hmi',
  'Industrial HMI',
  'Navigation, machine state, process and alarm regions for automation.',
  [
    'PLC',
    'Factory',
    'Pump stations',
    'Packaging machines',
    'Industrial automation',
  ],
  'Use machine controls, status LEDs, process values, alarms and an emergency stop.',
  [
    region(
      'industrial-hmi.header',
      'header',
      'Header',
      24,
      24,
      976,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'industrial-hmi.navigation',
      'navigation',
      'Navigation',
      24,
      104,
      160,
      400,
      'button-stack',
    ),
    region(
      'industrial-hmi.machine-status',
      'status',
      'Machine Status',
      200,
      104,
      216,
      400,
      'vertical',
    ),
    region(
      'industrial-hmi.process-area',
      'process',
      'Process Area',
      432,
      104,
      352,
      400,
      'fit-to-region',
      'surface',
    ),
    region(
      'industrial-hmi.alarm-panel',
      'alarms',
      'Alarm Panel',
      800,
      104,
      200,
      400,
      'vertical',
    ),
    region(
      'industrial-hmi.footer',
      'footer',
      'Footer',
      24,
      520,
      976,
      56,
      'horizontal',
      'surface',
    ),
  ],
)

export const forgeUIControlPanelTemplate = template(
  'control-panel',
  'Control Panel',
  'Balanced controls around a central system graphic with bottom status.',
  ['HVAC', 'Generator', 'Lighting', 'Power systems'],
  'Use large controls, switches, set points, a central system graphic and status indicators.',
  [
    region(
      'control-panel.header',
      'header',
      'Header',
      24,
      24,
      976,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'control-panel.left-controls',
      'controls',
      'Left Controls',
      24,
      104,
      232,
      400,
      'button-stack',
    ),
    region(
      'control-panel.centre-graphic',
      'graphic',
      'Centre Graphic',
      272,
      104,
      480,
      400,
      'fit-to-region',
      'surface',
    ),
    region(
      'control-panel.right-controls',
      'controls',
      'Right Controls',
      768,
      104,
      232,
      400,
      'button-stack',
    ),
    region(
      'control-panel.bottom-status',
      'status',
      'Bottom Status',
      24,
      520,
      976,
      56,
      'horizontal',
      'surface',
    ),
  ],
)

export const forgeUIMonitoringTemplate = template(
  'monitoring',
  'Monitoring',
  'Trend-led telemetry view with metrics and alarm history.',
  ['Temperature', 'Pressure', 'Flow', 'Energy', 'Remote telemetry'],
  'Use a large trend chart, compact statistics, telemetry values and a concise alarm list.',
  [
    region(
      'monitoring.header',
      'header',
      'Header',
      24,
      24,
      976,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'monitoring.trend-graph',
      'chart',
      'Large Trend Graph',
      24,
      104,
      704,
      296,
      'fit-to-region',
      'surface',
    ),
    region(
      'monitoring.metrics-strip',
      'metrics',
      'Metrics Strip',
      24,
      416,
      704,
      88,
      'kpi-cards',
    ),
    region(
      'monitoring.alarm-list',
      'alarms',
      'Alarm List',
      744,
      104,
      256,
      400,
      'vertical',
    ),
    region(
      'monitoring.footer',
      'footer',
      'Footer',
      24,
      520,
      976,
      56,
      'horizontal',
      'surface',
    ),
  ],
)

export const forgeUISCADAOverviewTemplate = template(
  'scada-overview',
  'SCADA Overview',
  'Plant overview with navigation, mimic, information and event regions.',
  ['Plant overview screens'],
  'Use process graphics, navigation, live plant information, alarms and recent events.',
  [
    region(
      'scada-overview.header',
      'header',
      'Header',
      24,
      24,
      976,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'scada-overview.left-navigation',
      'navigation',
      'Left Navigation',
      24,
      104,
      176,
      344,
      'button-stack',
    ),
    region(
      'scada-overview.main-mimic',
      'process',
      'Main Mimic',
      216,
      104,
      536,
      344,
      'fit-to-region',
      'surface',
    ),
    region(
      'scada-overview.right-information',
      'information',
      'Right Information',
      768,
      104,
      232,
      344,
      'vertical',
    ),
    region(
      'scada-overview.bottom-events',
      'events',
      'Bottom Events',
      24,
      464,
      976,
      112,
      'horizontal',
      'surface',
    ),
  ],
)

export const forgeUIMobilePortraitTemplate = template(
  'mobile-portrait',
  'Mobile / Portrait',
  'Touch-first stacked cards for compact and portrait-oriented devices.',
  ['ESP32-S3', 'Portable devices', 'Portrait displays', 'Touch panels'],
  'Use large touch controls, compact cards, concise values and minimal navigation.',
  [
    region(
      'mobile-portrait.header',
      'header',
      'Header',
      292,
      24,
      440,
      64,
      'horizontal',
      'surface',
    ),
    region(
      'mobile-portrait.main-card',
      'main',
      'Main Card',
      292,
      104,
      440,
      184,
      'fit-to-region',
      'surface',
    ),
    region(
      'mobile-portrait.secondary-card',
      'content',
      'Secondary Card',
      292,
      304,
      440,
      104,
      'grid',
    ),
    region(
      'mobile-portrait.controls',
      'controls',
      'Controls',
      292,
      424,
      440,
      80,
      'horizontal',
    ),
    region(
      'mobile-portrait.footer',
      'footer',
      'Footer',
      292,
      520,
      440,
      56,
      'horizontal',
      'surface',
    ),
  ],
)

export const forgeUILayoutTemplates: ForgeUILayoutTemplate[] = [
  forgeUIDashboardTemplate,
  forgeUIWeatherDashboardTemplate,
  forgeUIIndustrialHMITemplate,
  forgeUIControlPanelTemplate,
  forgeUIMonitoringTemplate,
  forgeUISCADAOverviewTemplate,
  forgeUIMobilePortraitTemplate,
]

export const getForgeUILayoutTemplate = (
  id: ForgeUILayoutTemplateId,
): ForgeUILayoutTemplate =>
  forgeUILayoutTemplates.find(candidate => candidate.id === id) ||
  forgeUIDashboardTemplate

export const getForgeUILayoutRegions = (
  components: IComponents,
): IComponent[] =>
  Object.values(components).filter(
    component =>
      component.type === 'Box' &&
      typeof component.props.layoutRegionKey === 'string',
  )

const numberProp = (value: unknown, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export type ForgeUILayoutGeometryUpdate = {
  id: string
  props: Record<string, number | string>
}

export const autoArrangeForgeUIRegion = (
  regionComponent: IComponent,
  assignedComponents: IComponent[],
): ForgeUILayoutGeometryUpdate[] => {
  const regionProps = regionComponent.props
  const ordered = [...assignedComponents].sort(
    (first, second) =>
      numberProp(first.props.layoutOrder, 0) -
      numberProp(second.props.layoutOrder, 0),
  )
  if (ordered.length === 0) return []

  const x = numberProp(regionProps.x, 0)
  const y = numberProp(regionProps.y, 0)
  const w = numberProp(regionProps.w, 0)
  const h = numberProp(regionProps.h, 0)
  const padding = numberProp(regionProps.layoutPadding, 16)
  const horizontalGap = numberProp(regionProps.layoutHorizontalGap, 12)
  const verticalGap = numberProp(regionProps.layoutVerticalGap, 12)
  const mode = String(
    regionProps.layoutArrangement || 'vertical',
  ) as ForgeUILayoutArrangement
  const contentX = x + padding
  const contentY = y + padding
  const contentW = Math.max(1, w - padding * 2)
  const contentH = Math.max(1, h - padding * 2)
  const minimumWidth = numberProp(regionProps.layoutMinChildWidth, 40)
  const minimumHeight = numberProp(regionProps.layoutMinChildHeight, 40)

  const gridLike = ['grid', 'kpi-cards', 'fit-to-region'].includes(mode)
  const horizontal = ['horizontal', 'even-distribution'].includes(mode)
  const columns = gridLike
    ? Math.max(
        1,
        Math.min(
          ordered.length,
          Math.round(numberProp(regionProps.layoutColumns, 2)),
        ),
      )
    : horizontal
    ? ordered.length
    : 1
  const rows = Math.ceil(ordered.length / columns)
  const cellW = Math.max(
    minimumWidth,
    (contentW - horizontalGap * (columns - 1)) / columns,
  )
  const cellH = Math.max(
    minimumHeight,
    (contentH - verticalGap * (rows - 1)) / rows,
  )

  return ordered.map((component, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const preferred = getForgeAIComponentEntry(component.type)?.defaultSize ?? {
      w: cellW,
      h: cellH,
    }
    const square = ['Arc', 'CircularProgress', 'Led'].includes(component.type)
    const fullWidth = [
      'Input',
      'Textarea',
      'NumberInput',
      'Select',
      'Progress',
      'Slider',
      'Bar',
      'Scale',
    ].includes(component.type)
    let childW =
      gridLike || horizontal || fullWidth
        ? cellW
        : Math.min(cellW, Math.max(minimumWidth, preferred.w))
    let childH =
      gridLike || mode === 'fit-to-region'
        ? cellH
        : Math.min(cellH, Math.max(minimumHeight, preferred.h))
    if (square) {
      const side = Math.min(childW, childH)
      childW = side
      childH = side
    }
    return {
      id: component.id,
      props: {
        positionMode: 'absolute',
        x: Math.round(contentX + column * (cellW + horizontalGap)),
        y: Math.round(contentY + row * (cellH + verticalGap)),
        w: Math.round(Math.min(childW, contentW)),
        h: Math.round(Math.min(childH, contentH)),
      },
    }
  })
}

export const autoArrangeForgeUILayoutByRegion = (
  components: IComponents,
): ForgeUILayoutGeometryUpdate[] =>
  getForgeUILayoutRegions(components).flatMap(regionComponent => {
    const regionKey = regionComponent.props.layoutRegionKey
    const assigned = Object.values(components).filter(
      component =>
        component.id !== regionComponent.id &&
        component.props.layoutRegionId === regionKey,
    )
    return autoArrangeForgeUIRegion(regionComponent, assigned)
  })

const weatherTemplateInternalUpdates = (
  definition: ForgeUILayoutTemplate,
  items: ForgeUILayoutTemplateItem[],
): Map<number, Record<string, unknown>> => {
  const updates = new Map<number, Record<string, unknown>>()
  if (definition.id !== 'weather-dashboard') return updates

  const regionProps = (suffix: string) =>
    definition.layout.find(
      item => item.props.layoutRegionKey === `weather-dashboard.${suffix}`,
    )?.props
  const assigned = (suffix: string) =>
    items.map((item, index) => ({ item, index })).filter(
      entry =>
        entry.item.type !== 'Box' &&
        entry.item.props.layoutRegionId === `weather-dashboard.${suffix}`,
    )
  const place = (
    index: number,
    x: number,
    y: number,
    w: number,
    h: number,
    extra: Record<string, unknown> = {},
  ) => updates.set(index, {
    positionMode: 'absolute',
    x: Math.round(x),
    y: Math.round(y),
    w: Math.max(1, Math.round(w)),
    h: Math.max(1, Math.round(h)),
    ...extra,
  })
  const placeHorizontal = (
    entries: Array<{ index: number }>,
    x: number,
    y: number,
    w: number,
    h: number,
    gap = 4,
    extra: Record<string, unknown> = {},
  ) => {
    if (entries.length === 0) return
    const cellW = (w - gap * (entries.length - 1)) / entries.length
    entries.forEach((entry, position) =>
      place(entry.index, x + position * (cellW + gap), y, cellW, h, extra),
    )
  }

  const current = regionProps('current-weather')
  if (current) {
    const entries = assigned('current-weather')
    const temperature = entries.find(entry =>
      String(entry.item.componentName || '').includes('Temperature'),
    ) || entries.find(entry => entry.item.type === 'Heading')
    const icon = entries.find(entry => entry.item.type === 'Icon')
    const supporting = entries.filter(
      entry => entry !== temperature && entry !== icon,
    )
    const x = Number(current.x) + 12
    const y = Number(current.y) + 12
    const innerW = Number(current.w) - 24
    const innerH = Number(current.h) - 24
    const leftW = Math.round(innerW * 0.64)
    if (temperature) {
      place(temperature.index, x, y, leftW, 112, {
        fontSize: 72,
        textAlign: 'left',
      })
    }
    if (supporting.length > 0) {
      const supportingH = innerH - 120
      const rowH = (supportingH - 4 * (supporting.length - 1)) /
        supporting.length
      supporting.forEach((entry, position) =>
        place(
          entry.index,
          x,
          y + 120 + position * (rowH + 4),
          leftW,
          rowH,
          { textAlign: 'left' },
        ),
      )
    }
    if (icon) {
      const iconSize = Math.min(136, innerH - 36)
      place(
        icon.index,
        x + innerW - iconSize - 12,
        y + Math.round((innerH - iconSize) / 2),
        iconSize,
        iconSize,
      )
    }
  }

  const headerRight = regionProps('header-right')
  if (headerRight) {
    const entries = assigned('header-right')
    const date = entries.find(entry =>
      String(entry.item.componentName || '').includes('Date'),
    ) || entries[0]
    const time = entries.find(entry =>
      String(entry.item.componentName || '').includes('Time'),
    ) || entries.find(entry => entry !== date)
    const x = Number(headerRight.x) + 12
    const y = Number(headerRight.y) + 8
    const w = Number(headerRight.w) - 24
    if (date) place(date.index, x, y, w, 25, { textAlign: 'right' })
    if (time) place(time.index, x, y + 27, w, 25, { textAlign: 'right' })
  }

  for (let day = 1; day <= 5; day += 1) {
    const suffix = `forecast-day${day}`
    const forecast = regionProps(suffix)
    if (!forecast) continue
    const entries = assigned(suffix)
    const icons = entries.filter(entry => entry.item.type === 'Icon')
    const names = entries.filter(entry =>
      String(entry.item.componentName || '').endsWith('_Name'),
    )
    const temperatures = entries.filter(entry =>
      String(entry.item.componentName || '').includes('Temperature'),
    )
    const claimed = new Set([
      ...icons.map(entry => entry.index),
      ...names.map(entry => entry.index),
      ...temperatures.map(entry => entry.index),
    ])
    const remaining = entries.filter(entry => !claimed.has(entry.index))
    if (names.length === 0 && remaining.length > 0) names.push(remaining.shift()!)
    temperatures.push(...remaining)

    const x = Number(forecast.x) + 12
    const y = Number(forecast.y) + 8
    const w = Number(forecast.w) - 24
    placeHorizontal(names, x, y, w, 20, 4, { textAlign: 'center' })
    const iconSize = 40
    placeHorizontal(
      icons,
      x + Math.max(0, (w - iconSize * icons.length - 4 * Math.max(0, icons.length - 1)) / 2),
      y + 22,
      Math.min(w, iconSize * icons.length + 4 * Math.max(0, icons.length - 1)),
      40,
      4,
    )
    placeHorizontal(
      temperatures,
      x,
      y + 64,
      w,
      24,
      4,
      { textAlign: 'center' },
    )
  }

  return updates
}

const regionForType = (
  definition: ForgeUILayoutTemplate,
  type: string,
): string => {
  const regions = definition.layout.filter(item => item.type === 'Box')
  const byRole = (...roles: ForgeUILayoutRegionRole[]) =>
    regions.find(item =>
      roles.includes(item.props.layoutRegionRole as ForgeUILayoutRegionRole),
    )?.props.layoutRegionKey as string | undefined
  const fallback = () =>
    byRole(
      'main',
      'process',
      'graphic',
      'content',
      'status',
      'metrics',
      'information',
      'alarms',
      'events',
      'navigation',
      'footer',
    ) || String(regions[0]?.props.layoutRegionKey)
  if (['Heading', 'Clock', 'WiFi'].includes(type)) {
    return byRole('header') || `${definition.id}.header`
  }
  if (
    [
      'Button',
      'IconButton',
      'Switch',
      'Checkbox',
      'Radio',
      'InteractiveButton',
      'InteractiveToggleSwitch',
      'InteractiveThreePositionToggleSwitch',
    ].includes(type)
  )
    return byRole('controls', 'navigation') || fallback()
  if (['Chart'].includes(type)) {
    return (
      byRole('chart', 'main', 'process', 'graphic', 'content') || fallback()
    )
  }
  if (
    [
      'Text',
      'Led',
      'Progress',
      'CircularProgress',
      'Bar',
      'Arc',
      'Scale',
      'InteractiveLight',
      'InteractiveStatusIndicator',
    ].includes(type)
  ) {
    return byRole('status', 'metrics', 'information', 'main') || fallback()
  }
  return fallback()
}

export const composeForgeUILayoutTemplate = (
  definition: ForgeUILayoutTemplate,
  content: ForgeUILayoutTemplateItem[],
): ForgeUILayoutTemplateItem[] => {
  const composedTemplate = definition.layout.map(item => ({
    ...item,
    props: { ...item.props },
  }))
  const generatedHeading = content.find(item => item.type === 'Heading')
  const templateHeading = composedTemplate.find(item => item.type === 'Heading')
  if (generatedHeading && templateHeading) {
    const structuralHeadingProps = templateHeading.props
    templateHeading.props = {
      ...templateHeading.props,
      ...generatedHeading.props,
      positionMode: 'absolute',
      x: structuralHeadingProps.x,
      y: structuralHeadingProps.y,
      w: structuralHeadingProps.w,
      h: structuralHeadingProps.h,
      layoutRegionId: structuralHeadingProps.layoutRegionId,
      layoutOrder: 0,
    }
  }
  const generatedContent = content
    .filter(item =>
      !(item.type === 'Heading' && templateHeading) &&
      !['Box', 'Divider', 'Line'].includes(item.type),
    )
    .map((item, index) => ({
      ...item,
      props: {
        ...item.props,
        layoutRegionId:
          item.props.layoutRegionId || regionForType(definition, item.type),
        layoutOrder: item.props.layoutOrder ?? index + 1,
      },
    }))
  const combined = [...composedTemplate, ...generatedContent]
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: combined.map((_, index) => `layout-${index}`),
    },
  }
  combined.forEach((item, index) => {
    components[`layout-${index}`] = {
      id: `layout-${index}`,
      parent: 'root',
      type: item.type,
      props: { ...item.props },
      children: [],
    }
  })
  const updates = new Map(
    autoArrangeForgeUILayoutByRegion(components).map(update => [
      update.id,
      update.props,
    ]),
  )
  const weatherUpdates = weatherTemplateInternalUpdates(definition, combined)
  return combined.map((item, index) => ({
    ...item,
    props: {
      ...item.props,
      ...(updates.get(`layout-${index}`) || {}),
      ...(weatherUpdates.get(index) || {}),
    },
  }))
}

export const composeForgeUIDashboardTemplate = (
  content: ForgeUILayoutTemplateItem[],
): ForgeUILayoutTemplateItem[] =>
  composeForgeUILayoutTemplate(forgeUIDashboardTemplate, content)
