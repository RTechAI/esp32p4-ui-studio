export type ForgeUIMenuItem = {
  id: string
  label: string
  subtitle: string
  icon: string
  targetPageId: string
  enabled: boolean
}

export type ForgeUIMenuSection = {
  id: string
  title: string
  items: ForgeUIMenuItem[]
}

export type ForgeUIMenuPage = {
  id: string
  title: string
  sections: ForgeUIMenuSection[]
}

export const DEFAULT_FORGEUI_MENU_PAGES: ForgeUIMenuPage[] = [
  { id: 'main', title: 'Settings', sections: [{ id: 'general', title: 'General', items: [
    { id: 'display', label: 'Display', subtitle: 'Brightness and appearance', icon: 'LV_SYMBOL_EYE_OPEN', targetPageId: 'display-page', enabled: true },
    { id: 'network', label: 'Network', subtitle: 'Wi-Fi configuration', icon: 'LV_SYMBOL_WIFI', targetPageId: 'network-page', enabled: true },
  ] }] },
  { id: 'display-page', title: 'Display', sections: [{ id: 'display-options', title: '', items: [
    { id: 'brightness', label: 'Brightness', subtitle: 'Adjust display level', icon: 'LV_SYMBOL_EYE_OPEN', targetPageId: '', enabled: true },
  ] }] },
  { id: 'network-page', title: 'Network', sections: [{ id: 'network-options', title: '', items: [
    { id: 'wifi', label: 'Wi-Fi', subtitle: 'Manage saved networks', icon: 'LV_SYMBOL_WIFI', targetPageId: '', enabled: true },
  ] }] },
]

const safeId = (value: unknown, fallback: string) => {
  const normalized = String(value || fallback).trim().replace(/[^A-Za-z0-9_-]+/g, '-')
  return normalized || fallback
}

export const normalizeForgeUIMenuPages = (value: unknown): ForgeUIMenuPage[] => {
  if (typeof value === 'string') {
    try { return normalizeForgeUIMenuPages(JSON.parse(value)) } catch { return DEFAULT_FORGEUI_MENU_PAGES.map(page => ({ ...page, sections: page.sections.map(section => ({ ...section, items: section.items.map(item => ({ ...item })) })) })) }
  }
  if (!Array.isArray(value) || value.length === 0) return normalizeForgeUIMenuPages(DEFAULT_FORGEUI_MENU_PAGES)
  return value.slice(0, 12).map((page, pageIndex) => ({
    id: safeId(page?.id, `page-${pageIndex + 1}`),
    title: String(page?.title ?? `Page ${pageIndex + 1}`),
    sections: (Array.isArray(page?.sections) ? page.sections : []).slice(0, 12).map((section: any, sectionIndex: number) => ({
      id: safeId(section?.id, `section-${pageIndex + 1}-${sectionIndex + 1}`),
      title: String(section?.title ?? ''),
      items: (Array.isArray(section?.items) ? section.items : []).slice(0, 24).map((item: any, itemIndex: number) => ({
        id: safeId(item?.id, `item-${pageIndex + 1}-${sectionIndex + 1}-${itemIndex + 1}`),
        label: String(item?.label ?? `Item ${itemIndex + 1}`),
        subtitle: String(item?.subtitle ?? ''),
        icon: String(item?.icon || ''),
        targetPageId: String(item?.targetPageId || ''),
        enabled: item?.enabled !== false,
      })),
    })),
  }))
}

export const resolveForgeUIMenuRootPageId = (pages: ForgeUIMenuPage[], value: unknown) =>
  pages.some(page => page.id === value) ? String(value) : pages[0]?.id || ''

export const createForgeUIMenuPage = (index: number): ForgeUIMenuPage => ({
  id: `page-${Date.now()}-${index}`,
  title: `Page ${index}`,
  sections: [{ id: `section-${Date.now()}-${index}`, title: '', items: [] }],
})

