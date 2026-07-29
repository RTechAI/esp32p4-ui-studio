export const FORGEUI_TABVIEW_TAB_BAR_HEIGHT = 34
export const FORGEUI_TABVIEW_TAB_COUNT = 3
export const FORGEUI_TILEVIEW_COLUMNS = 2
export const FORGEUI_TILEVIEW_ROWS = 2
export const FORGEUI_TILEVIEW_PADDING = 8
export const FORGEUI_TILEVIEW_GAP = 6
export const FORGEUI_TAB_TILE_BORDER_WIDTH = 1

const integer = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback
}

export const getForgeUITabViewGeometry = (
  props: Record<string, unknown>,
) => {
  const width = Math.max(1, integer(props.w, 420))
  const height = Math.max(1, integer(props.h, 240))
  const innerWidth = Math.max(
    0,
    width - FORGEUI_TAB_TILE_BORDER_WIDTH * 2,
  )
  const innerHeight = Math.max(
    0,
    height - FORGEUI_TAB_TILE_BORDER_WIDTH * 2,
  )
  const tabBarHeight = Math.min(
    FORGEUI_TABVIEW_TAB_BAR_HEIGHT,
    innerHeight,
  )
  const tabWidth = Math.floor(innerWidth / FORGEUI_TABVIEW_TAB_COUNT)
  const tabWidths = [
    tabWidth,
    tabWidth,
    Math.max(0, innerWidth - tabWidth * 2),
  ]

  return {
    width,
    height,
    innerWidth,
    innerHeight,
    tabBarHeight,
    tabWidths,
    contentHeight: Math.max(0, innerHeight - tabBarHeight),
  }
}

export const getForgeUITileViewGeometry = (
  props: Record<string, unknown>,
) => {
  const width = Math.max(1, integer(props.w, 420))
  const height = Math.max(1, integer(props.h, 240))
  const innerWidth = Math.max(
    0,
    width - FORGEUI_TAB_TILE_BORDER_WIDTH * 2,
  )
  const innerHeight = Math.max(
    0,
    height - FORGEUI_TAB_TILE_BORDER_WIDTH * 2,
  )
  const availableWidth = Math.max(
    0,
    innerWidth - FORGEUI_TILEVIEW_PADDING * 2 - FORGEUI_TILEVIEW_GAP,
  )
  const availableHeight = Math.max(
    0,
    innerHeight - FORGEUI_TILEVIEW_PADDING * 2 - FORGEUI_TILEVIEW_GAP,
  )
  const columnWidth = Math.floor(
    availableWidth / FORGEUI_TILEVIEW_COLUMNS,
  )
  const rowHeight = Math.floor(
    availableHeight / FORGEUI_TILEVIEW_ROWS,
  )
  const columnWidths = [
    columnWidth,
    Math.max(0, availableWidth - columnWidth),
  ]
  const rowHeights = [
    rowHeight,
    Math.max(0, availableHeight - rowHeight),
  ]
  const columnX = [
    FORGEUI_TILEVIEW_PADDING,
    FORGEUI_TILEVIEW_PADDING + columnWidths[0] + FORGEUI_TILEVIEW_GAP,
  ]
  const rowY = [
    FORGEUI_TILEVIEW_PADDING,
    FORGEUI_TILEVIEW_PADDING + rowHeights[0] + FORGEUI_TILEVIEW_GAP,
  ]

  return {
    width,
    height,
    innerWidth,
    innerHeight,
    columnWidths,
    rowHeights,
    columnX,
    rowY,
    padding: FORGEUI_TILEVIEW_PADDING,
    gap: FORGEUI_TILEVIEW_GAP,
  }
}
