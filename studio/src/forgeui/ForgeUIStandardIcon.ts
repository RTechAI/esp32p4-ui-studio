type StandardIconProps = Record<string, unknown>

export const FORGEUI_STANDARD_ICON_AUTO_FIT = 0.92
export const FORGEUI_ICON_SELECTOR_SOURCE_SIZE = 64

export const getForgeUIStandardIconSourceDimensions = (
  asset: { width?: number; height?: number; name?: string },
  iconName: string,
) => {
  if (Number(asset.width) > 0 && Number(asset.height) > 0) {
    return { width: Number(asset.width), height: Number(asset.height) }
  }
  const namedSize = String(asset.name || '').match(/_(\d+)x(\d+)\.png$/i)
  if (namedSize) {
    return { width: Number(namedSize[1]), height: Number(namedSize[2]) }
  }
  if (String(asset.name || '').toLowerCase() === `${iconName}.png`.toLowerCase()) {
    return {
      width: FORGEUI_ICON_SELECTOR_SOURCE_SIZE,
      height: FORGEUI_ICON_SELECTOR_SOURCE_SIZE,
    }
  }
  return undefined
}

const size = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) ? Math.max(1, Math.round(parsed)) : 48
}

const componentSize = (source: StandardIconProps) => {
  const width = size(source.w)
  const height = size(source.h)
  return Math.max(
    1,
    Math.round(Math.min(width, height) * FORGEUI_STANDARD_ICON_AUTO_FIT),
  )
}

const opacity = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? ''))
  if (!Number.isFinite(parsed)) return 1
  return Math.max(0, Math.min(1, parsed > 1 ? parsed / 100 : parsed))
}

export const getForgeUIStandardIconPresentation = (
  props: StandardIconProps | undefined,
  textPrimary: string,
) => {
  const source = props || {}
  const explicitColor = String(source.color || '')
  return {
    icon: String(source.icon || 'FiSettings'),
    src: String(source.src || source.browserSrc || ''),
    // Automatic fitting keeps a small symmetric inset so transformed and
    // anti-aliased edge pixels remain inside LVGL's image object bounds.
    iconSize: source.boxSize == null || source.boxSize === ''
      ? componentSize(source)
      : size(source.boxSize),
    color: /^#[0-9a-f]{6}$/i.test(explicitColor)
      ? explicitColor.toUpperCase()
      : textPrimary,
    opacity: opacity(source.opacity),
    visible: source.visible !== false && source.isVisible !== false,
  }
}
