import {
  resolveForgeAIComponentType,
} from './ForgeAIComponentCatalogue'
import {
  ForgeUILayoutTemplateId,
  getForgeUILayoutTemplate,
} from '~forgeui/layout/ForgeUILayoutDesigner'

export type ForgeAIRegionComposerDocument = {
  name?: string
  description?: string
  template: ForgeUILayoutTemplateId
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
    typeof candidate.template === 'string' &&
    getForgeUILayoutTemplate(
      candidate.template as ForgeUILayoutTemplateId,
    ).id === candidate.template &&
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
  const definition = getForgeUILayoutTemplate(document.template)
  const validRegionKeys = new Set(
    definition.layout
      .filter(item => item.type === 'Box')
      .map(item => String(item.props.layoutRegionKey)),
  )
  Object.entries(document.regions).forEach(([region, items]) => {
    const regionKey = `${definition.id}.${region}`
    if (!validRegionKeys.has(regionKey) || !Array.isArray(items)) return
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
          layoutRegionId: regionKey,
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
        layoutRegionId: `${definition.id}.header`,
        layoutOrder: 0,
      },
    })
  }
  return {
    name: document.name || document.title || definition.name,
    category: 'AI Generated',
    description: document.description || '',
    layout,
  }
}
