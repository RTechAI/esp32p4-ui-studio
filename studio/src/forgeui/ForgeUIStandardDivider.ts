type StandardDividerProps = Record<string, unknown>

const dimension = (value: unknown, fallback: number) => {
  const parsed = Number.parseFloat(String(value ?? ''))
  return Number.isFinite(parsed) ? Math.max(1, Math.round(parsed)) : fallback
}

const opacity = (value: unknown) => {
  const parsed = Number.parseFloat(String(value ?? ''))
  if (!Number.isFinite(parsed)) return 1
  return Math.max(0, Math.min(1, parsed > 1 ? parsed / 100 : parsed))
}

export const getForgeUIStandardDividerPresentation = (
  props: StandardDividerProps | undefined,
  surfaceBorder: string,
) => {
  const source = props || {}
  const vertical = source.orientation === 'vertical'
  const w = dimension(source.w, vertical ? 2 : 180)
  const h = dimension(source.h, vertical ? 180 : 2)
  const explicitColor = String(source.borderColor || source.color || '')

  return {
    orientation: vertical ? 'vertical' as const : 'horizontal' as const,
    width: w,
    height: h,
    color: /^#[0-9a-f]{6}$/i.test(explicitColor)
      ? explicitColor.toUpperCase()
      : surfaceBorder,
    opacity: opacity(source.opacity),
  }
}
