export const FORGEUI_STANDARD_SCALE_MINIMUM = 0
export const FORGEUI_STANDARD_SCALE_MAXIMUM = 100
export const FORGEUI_STANDARD_SCALE_TOTAL_TICKS = 11
export const FORGEUI_STANDARD_SCALE_MAJOR_TICK_EVERY = 2
export const FORGEUI_STANDARD_SCALE_MODE = 'horizontal-bottom'

export type ForgeUIStandardScaleTick = {
  index: number
  value: number
  major: boolean
  label: string | null
}

export type ForgeUIStandardScaleModel = {
  minimum: number
  maximum: number
  totalTickCount: number
  majorTickEvery: number
  mode: typeof FORGEUI_STANDARD_SCALE_MODE
  ticks: ForgeUIStandardScaleTick[]
}

/**
 * Mirrors the fixed settings emitted by the Standard Scale exporter.
 * Scale-specific authoring props do not currently exist, so accepting
 * component props here would create preview/export drift.
 */
export const getForgeUIStandardScaleModel =
  (): ForgeUIStandardScaleModel => {
    const span =
      FORGEUI_STANDARD_SCALE_MAXIMUM -
      FORGEUI_STANDARD_SCALE_MINIMUM

    const ticks = Array.from(
      { length: FORGEUI_STANDARD_SCALE_TOTAL_TICKS },
      (_, index): ForgeUIStandardScaleTick => {
        const major =
          index % FORGEUI_STANDARD_SCALE_MAJOR_TICK_EVERY === 0
        const value = Math.round(
          FORGEUI_STANDARD_SCALE_MINIMUM +
          (span * index) /
            (FORGEUI_STANDARD_SCALE_TOTAL_TICKS - 1),
        )

        return {
          index,
          value,
          major,
          label: major ? String(value) : null,
        }
      },
    )

    return {
      minimum: FORGEUI_STANDARD_SCALE_MINIMUM,
      maximum: FORGEUI_STANDARD_SCALE_MAXIMUM,
      totalTickCount: FORGEUI_STANDARD_SCALE_TOTAL_TICKS,
      majorTickEvery: FORGEUI_STANDARD_SCALE_MAJOR_TICK_EVERY,
      mode: FORGEUI_STANDARD_SCALE_MODE,
      ticks,
    }
  }
