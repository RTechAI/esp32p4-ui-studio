export const FORGEUI_STANDARD_LIST_DEFAULT_ITEMS = [
  'Overview',
  'Settings',
  'Diagnostics',
]

export type ForgeUIStandardListModel = {
  title: string
  items: string[]
  itemHeight: number
}

const cleanLines = (value: unknown): string[] => {
  const source = Array.isArray(value)
    ? value.map(item => String(item))
    : String(value || '').split(/\r?\n/)
  return source.map(item => item.trim()).filter(Boolean).slice(0, 64)
}

export const getForgeUIStandardListModel = (
  props: Record<string, unknown> = {},
): ForgeUIStandardListModel => {
  const items = cleanLines(props.items)
  const numericHeight = Number(props.itemHeight)
  return {
    title: String(props.title || '').trim(),
    items: items.length ? items : FORGEUI_STANDARD_LIST_DEFAULT_ITEMS,
    itemHeight: Math.max(
      24,
      Math.min(
        120,
        Number.isFinite(numericHeight) ? Math.round(numericHeight) : 44,
      ),
    ),
  }
}
