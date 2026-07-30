import {
  getForgeAIComponentEntry,
} from '~forgeui/ai/ForgeAIComponentCatalogue'

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
  props: Record<string, unknown>
}

export type ForgeUILayoutTemplate = {
  id: 'dashboard'
  name: string
  description: string
  width: number
  height: number
  layout: ForgeUILayoutTemplateItem[]
}

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
    x, y, w, h,
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
  description: 'Header, status, main visualization, controls and footer regions.',
  width: 1024,
  height: 600,
  layout: [
    region('dashboard.header', 'header', 'Header', 24, 24, 976, 64, 'horizontal', 'surface'),
    region('dashboard.status', 'status', 'Status', 24, 104, 240, 400, 'vertical'),
    region('dashboard.main', 'main', 'Main', 280, 104, 480, 400, 'fit-to-region', 'surface'),
    region('dashboard.controls', 'controls', 'Controls', 776, 104, 224, 400, 'button-stack'),
    region('dashboard.footer', 'footer', 'Footer', 24, 520, 976, 56, 'horizontal', 'surface'),
    {
      type: 'Divider',
      props: {
        positionMode: 'absolute',
        x: 24, y: 92, w: 976, h: 2,
        layoutStructuralFor: 'dashboard',
      },
    },
    {
      type: 'Heading',
      props: {
        positionMode: 'absolute',
        x: 40, y: 32, w: 520, h: 48,
        textValue: 'Dashboard',
        children: 'Dashboard',
        layoutRegionId: 'dashboard.header',
        layoutOrder: 0,
      },
    },
  ],
}

export const forgeUILayoutTemplates: ForgeUILayoutTemplate[] = [
  forgeUIDashboardTemplate,
]

export const getForgeUILayoutRegions = (
  components: IComponents,
): IComponent[] => Object.values(components)
  .filter(component =>
    component.type === 'Box' &&
    typeof component.props.layoutRegionKey === 'string'
  )

const numberProp = (
  value: unknown,
  fallback: number,
): number => {
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
  const ordered = [...assignedComponents].sort((first, second) =>
    numberProp(first.props.layoutOrder, 0) -
    numberProp(second.props.layoutOrder, 0)
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

  const gridLike = [
    'grid', 'kpi-cards', 'fit-to-region',
  ].includes(mode)
  const horizontal = [
    'horizontal', 'even-distribution',
  ].includes(mode)
  const columns = gridLike
    ? Math.max(1, Math.min(
        ordered.length,
        Math.round(numberProp(regionProps.layoutColumns, 2)),
      ))
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
    const preferred =
      getForgeAIComponentEntry(component.type)?.defaultSize ??
      { w: cellW, h: cellH }
    const square = [
      'Arc', 'CircularProgress', 'Led',
    ].includes(component.type)
    const fullWidth = [
      'Input', 'Textarea', 'NumberInput', 'Select', 'Progress',
      'Slider', 'Bar', 'Scale',
    ].includes(component.type)
    let childW = gridLike || horizontal || fullWidth
      ? cellW
      : Math.min(cellW, Math.max(minimumWidth, preferred.w))
    let childH = gridLike || mode === 'fit-to-region'
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
    const assigned = Object.values(components).filter(component =>
      component.id !== regionComponent.id &&
      component.props.layoutRegionId === regionKey
    )
    return autoArrangeForgeUIRegion(regionComponent, assigned)
  })

const dashboardRegionForType = (type: string): string => {
  if (['Heading', 'Clock', 'WiFi'].includes(type)) return 'dashboard.header'
  if ([
    'Button', 'IconButton', 'Switch', 'Checkbox', 'Radio',
    'InteractiveButton', 'InteractiveToggleSwitch',
    'InteractiveThreePositionToggleSwitch',
  ].includes(type)) return 'dashboard.controls'
  if ([
    'Text', 'Led', 'Progress', 'CircularProgress', 'Bar', 'Arc',
    'Scale', 'InteractiveLight', 'InteractiveStatusIndicator',
  ].includes(type)) return 'dashboard.status'
  return 'dashboard.main'
}

export const composeForgeUIDashboardTemplate = (
  content: ForgeUILayoutTemplateItem[],
): ForgeUILayoutTemplateItem[] => {
  const template = forgeUIDashboardTemplate.layout.map(item => ({
    ...item,
    props: { ...item.props },
  }))
  const generatedHeading = content.find(item => item.type === 'Heading')
  const templateHeading = template.find(item => item.type === 'Heading')
  if (generatedHeading && templateHeading) {
    templateHeading.props = {
      ...templateHeading.props,
      ...generatedHeading.props,
      positionMode: 'absolute',
      x: 40, y: 32, w: 520, h: 48,
      layoutRegionId: 'dashboard.header',
      layoutOrder: 0,
    }
  }
  const generatedContent = content
    .filter(item =>
      !['Heading', 'Box', 'Divider', 'Line'].includes(item.type)
    )
    .map((item, index) => ({
      ...item,
      props: {
        ...item.props,
        layoutRegionId:
          item.props.layoutRegionId ||
          dashboardRegionForType(item.type),
        layoutOrder: item.props.layoutOrder ?? index + 1,
      },
    }))
  const combined = [...template, ...generatedContent]
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
    autoArrangeForgeUILayoutByRegion(components)
      .map(update => [update.id, update.props]),
  )
  return combined.map((item, index) => ({
    ...item,
    props: {
      ...item.props,
      ...(updates.get(`layout-${index}`) || {}),
    },
  }))
}
