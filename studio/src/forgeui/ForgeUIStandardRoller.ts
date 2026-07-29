export const FORGEUI_STANDARD_ROLLER_DEFAULT_OPTIONS = [
  'One',
  'Two',
  'Three',
  'Four',
]
export const FORGEUI_STANDARD_ROLLER_DEFAULT_SELECTED_INDEX = 0
export const FORGEUI_STANDARD_ROLLER_DEFAULT_VISIBLE_ROWS = 3

export type ForgeUIStandardRollerMode = 'normal' | 'infinite'

export type ForgeUIStandardRollerModel = {
  options: string[]
  selectedIndex: number
  visibleRowCount: number
  mode: ForgeUIStandardRollerMode
}

const integerProp = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
}

export const getForgeUIStandardRollerModel = (
  props: Record<string, unknown>,
): ForgeUIStandardRollerModel => {
  const configuredOptions: unknown[] = Array.isArray(props.options)
    ? props.options
    : typeof props.options === 'string'
      ? props.options.split('\n')
      : FORGEUI_STANDARD_ROLLER_DEFAULT_OPTIONS
  const options = configuredOptions
    .map(option => String(option))
    .filter(option => option.length > 0)

  if (options.length === 0) {
    options.push(...FORGEUI_STANDARD_ROLLER_DEFAULT_OPTIONS)
  }

  const selectedIndex = Math.min(
    options.length - 1,
    Math.max(
      0,
      integerProp(
        props.selectedIndex,
        FORGEUI_STANDARD_ROLLER_DEFAULT_SELECTED_INDEX,
      ),
    ),
  )
  const visibleRowCount = Math.max(
    1,
    integerProp(
      props.visibleRowCount,
      FORGEUI_STANDARD_ROLLER_DEFAULT_VISIBLE_ROWS,
    ),
  )
  const configuredMode = String(props.mode || '').toLowerCase()
  const mode = configuredMode === 'infinite' ||
    configuredMode === 'lv_roller_mode_infinite'
    ? 'infinite'
    : 'normal'

  return {
    options,
    selectedIndex,
    visibleRowCount,
    mode,
  }
}
