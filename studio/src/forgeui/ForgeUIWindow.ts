export type ForgeUIWindowAction = {
  id: string
  icon: string
  enabled: boolean
}

export const normalizeWindowActions = (value: unknown): ForgeUIWindowAction[] => {
  if (!Array.isArray(value)) return []
  return value.slice(0, 4).map((item, index) => ({
    id: String(item?.id || `action-${index + 1}`),
    icon: String(item?.icon || 'LV_SYMBOL_SETTINGS'),
    enabled: item?.enabled !== false,
  }))
}

export const windowScrollbarMode = (value: unknown) =>
  ['off', 'on', 'active', 'auto'].includes(String(value)) ? String(value) : 'auto'

