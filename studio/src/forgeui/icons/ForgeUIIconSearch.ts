import { ICON_NAMES } from '~forgeui/iconsList'

export const searchForgeUIIcons = (
  query: string,
  limit = 8,
): string[] => {
  const term = query
    .trim()
    .toLowerCase()

  if (!term) {
    return ICON_NAMES.slice(0, limit)
  }

  return ICON_NAMES
    .filter(iconName =>
      iconName
        .toLowerCase()
        .includes(term),
    )
    .slice(0, limit)
}