import {
  resolveForgeAIComponentType,
} from './ForgeAIComponentCatalogue'

const DASHBOARD_REGIONS = new Set([
  'header', 'status', 'main', 'controls', 'footer',
])

export type ForgeAIRegionComposerDocument = {
  name?: string
  description?: string
  template: 'dashboard'
  title?: string
  regions: Record<string, Array<{
    type: string
    props?: Record<string, unknown>
    importance?: number
    order?: number
  }>>
}

export const isForgeAIRegionComposerDocument = (
  value: unknown,
): value is ForgeAIRegionComposerDocument => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const candidate = value as Record<string, unknown>
  return (
    candidate.template === 'dashboard' &&
    Boolean(candidate.regions) &&
    typeof candidate.regions === 'object' &&
    !Array.isArray(candidate.regions)
  )
}

export const flattenForgeAIRegionComposerDocument = (
  document: ForgeAIRegionComposerDocument,
): {
  name: string
  category: string
  description: string
  layout: Array<{
    type: string
    props: Record<string, unknown>
  }>
} => {
  const layout: Array<{
    type: string
    props: Record<string, unknown>
  }> = []
  Object.entries(document.regions).forEach(([region, items]) => {
    if (!DASHBOARD_REGIONS.has(region) || !Array.isArray(items)) return
    items.forEach((item, index) => {
      const type = resolveForgeAIComponentType(item?.type || '')
      if (!type) {
        throw new Error(`Unsupported region component: ${item?.type}`)
      }
      layout.push({
        type,
        props: {
          ...(item.props || {}),
          positionMode: 'absolute',
          layoutRegionId: `dashboard.${region}`,
          layoutOrder: item.order ?? index,
          layoutImportance: item.importance ?? 0,
        },
      })
    })
  })
  if (
    document.title &&
    !layout.some(item => item.type === 'Heading')
  ) {
    layout.unshift({
      type: 'Heading',
      props: {
        children: document.title,
        textValue: document.title,
        positionMode: 'absolute',
        layoutRegionId: 'dashboard.header',
        layoutOrder: 0,
      },
    })
  }
  return {
    name: document.name || document.title || 'Dashboard',
    category: 'AI Generated',
    description: document.description || '',
    layout,
  }
}
