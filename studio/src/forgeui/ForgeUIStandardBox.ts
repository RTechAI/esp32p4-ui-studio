type StandardBoxProps = Record<string, unknown>

const number = (value: unknown, fallback: number) => {
  const parsed = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) ? parsed : fallback
}

const hex = (value: unknown, fallback: string) =>
  /^#[0-9a-f]{6}$/i.test(String(value || ''))
    ? String(value).toUpperCase()
    : fallback

const opacity = (value: unknown, fallback: number) => {
  const parsed = number(value, fallback)
  return Math.max(0, Math.min(1, parsed > 1 ? parsed / 100 : parsed))
}

export const getForgeUIStandardBoxPresentation = (
  props: StandardBoxProps | undefined,
  palette: { surface: string; surfaceSecondary: string; surfaceBorder: string },
) => {
  const source = props || {}
  const semanticSurface = source.layoutSurfaceRole === 'surfaceSecondary'
    ? palette.surfaceSecondary
    : palette.surface

  return {
    backgroundColor: hex(
      source.backgroundColor ?? source.bg,
      semanticSurface,
    ),
    backgroundOpacity: opacity(
      source.backgroundOpacity ?? source.layoutOpacity ?? source.opacity,
      0.8,
    ),
    borderColor: hex(source.borderColor, palette.surfaceBorder),
    borderWidth: Math.max(0, Math.round(number(
      source.layoutBorderWidth ?? source.borderWidth,
      2,
    ))),
    borderRadius: Math.max(0, Math.round(number(
      source.layoutRadius ?? source.borderRadius,
      12,
    ))),
    borderOpacity: opacity(source.borderOpacity, 1),
    visible: source.visible !== false && source.isVisible !== false,
  }
}
