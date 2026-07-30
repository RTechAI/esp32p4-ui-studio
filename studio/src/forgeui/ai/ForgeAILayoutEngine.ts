import {
  getForgeAIComponentEntry,
} from './ForgeAIComponentCatalogue'
import type {
  ForgeAILayoutDocument,
  ForgeAILayoutItem,
} from './ForgeAIParser'

export type ForgeAILayoutQuality = {
  score: number
  overlaps: number
  offScreen: number
  inconsistentMargins: number
  headingVisible: boolean
  unreadableLargeControls: number
  excessiveEmptySpace: boolean
}

const LARGE_TYPES = new Set([
  'Chart', 'Table', 'Calendar', 'Keyboard', 'Tabview', 'Tileview',
  'Canvas', 'Textarea',
])

const INTERACTIVE_TYPES = new Set([
  'Button', 'InteractiveButton', 'InteractiveToggleSwitch',
  'InteractiveThreePositionToggleSwitch', 'IconButton', 'Input', 'Textarea',
  'Switch', 'Checkbox', 'Radio', 'NumberInput', 'Select', 'Slider', 'Roller',
  'ButtonMatrix', 'Keyboard',
])

const SPECIALIST_INTENT: Partial<Record<ComponentType, RegExp>> = {
  Keyboard: /\b(keyboard|keypad|pin entry|on-screen typing)\b/i,
  Calendar: /\b(calendar|date|schedule|appointment)\b/i,
  Msgbox: /\b(message box|msgbox|dialog|modal|confirmation)\b/i,
  Tileview: /\b(tile ?view|swipeable tiles?)\b/i,
  Tabview: /\b(tab ?view|tabs?|tabbed)\b/i,
  ButtonMatrix: /\b(button matrix|keypad|matrix of buttons)\b/i,
  Textarea: /\b(textarea|text area|multiline|notes?|long message|description field)\b/i,
  Table: /\b(table|tabular|rows?|records?|data grid|event log)\b/i,
  Canvas: /\b(canvas|drawing|custom graphics?|plot surface)\b/i,
}

const numeric = (value: unknown, fallback: number): number => {
  const result = Number(value)
  return Number.isFinite(result) ? result : fallback
}

const rect = (item: ForgeAILayoutItem) => ({
  x: numeric(item.props.x, 0),
  y: numeric(item.props.y, 0),
  w: numeric(item.props.w, 0),
  h: numeric(item.props.h, 0),
})

const overlaps = (
  first: ForgeAILayoutItem,
  second: ForgeAILayoutItem,
  spacing = 0,
): boolean => {
  const a = rect(first)
  const b = rect(second)
  return (
    a.x < b.x + b.w + spacing &&
    a.x + a.w + spacing > b.x &&
    a.y < b.y + b.h + spacing &&
    a.y + a.h + spacing > b.y
  )
}

const contains = (
  container: ForgeAILayoutItem,
  child: ForgeAILayoutItem,
): boolean => {
  const outer = rect(container)
  const inner = rect(child)
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  )
}

const allowedStructuralOverlap = (
  first: ForgeAILayoutItem,
  second: ForgeAILayoutItem,
): boolean =>
  (first.type === 'Box' && contains(first, second)) ||
  (second.type === 'Box' && contains(second, first))

const explicitPromptTypes = (prompt: string): Set<string> => {
  const requiredSection = prompt.match(
    /REQUIRED FORGEUI COMPONENTS:\s*([\s\S]*?)(?:\n[A-Z][A-Z ]+:|$)/,
  )?.[1] ?? ''
  return new Set(
    Array.from(requiredSection.matchAll(/^\s*-\s*([A-Za-z]+):/gm))
      .map(match => match[1]),
  )
}

export const selectForgeAIComponentsForPurpose = (
  items: ForgeAILayoutItem[],
  prompt: string,
): ForgeAILayoutItem[] => {
  const explicit = explicitPromptTypes(prompt)
  const hasExplicitSelection = explicit.size > 0
  let headingSeen = false
  let largeCount = 0

  return items.filter(item => {
    if (hasExplicitSelection) {
      return explicit.has(item.type)
    }
    if (item.type === 'Heading') {
      if (headingSeen) return false
      headingSeen = true
    }
    const specialistRule =
      SPECIALIST_INTENT[item.type as ComponentType]
    if (specialistRule && !specialistRule.test(prompt)) {
      return false
    }
    if (LARGE_TYPES.has(item.type)) {
      largeCount += 1
      if (largeCount > 2) return false
    }
    return true
  })
}

const normalizeSize = (
  item: ForgeAILayoutItem,
  screenWidth: number,
  screenHeight: number,
): ForgeAILayoutItem => {
  const preferred =
    getForgeAIComponentEntry(item.type as ComponentType)?.defaultSize ??
    { w: 120, h: 60 }
  const large = LARGE_TYPES.has(item.type)
  const minimumWidth = large
    ? Math.min(screenWidth * 0.34, Math.max(280, preferred.w))
    : INTERACTIVE_TYPES.has(item.type)
      ? Math.max(40, Math.min(preferred.w, 120))
      : Math.min(preferred.w, 80)
  const minimumHeight = large
    ? Math.min(screenHeight * 0.25, Math.max(120, preferred.h))
    : INTERACTIVE_TYPES.has(item.type)
      ? Math.max(40, Math.min(preferred.h, 48))
      : Math.min(preferred.h, 40)
  const w = Math.min(
    screenWidth,
    Math.max(minimumWidth, numeric(item.props.w, preferred.w)),
  )
  const h = Math.min(
    screenHeight,
    Math.max(minimumHeight, numeric(item.props.h, preferred.h)),
  )
  const x = Math.max(
    0,
    Math.min(numeric(item.props.x, 0), screenWidth - w),
  )
  const y = Math.max(
    0,
    Math.min(numeric(item.props.y, 0), screenHeight - h),
  )
  return {
    ...item,
    props: {
      ...item.props,
      positionMode: 'absolute',
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
    },
  }
}

const findNearestValidPosition = (
  item: ForgeAILayoutItem,
  placed: ForgeAILayoutItem[],
  screenWidth: number,
  screenHeight: number,
  margin: number,
  spacing: number,
): ForgeAILayoutItem => {
  const original = rect(item)
  const valid = (candidate: ForgeAILayoutItem) => {
    const bounds = rect(candidate)
    if (
      bounds.x < margin ||
      bounds.y < margin ||
      bounds.x + bounds.w > screenWidth - margin ||
      bounds.y + bounds.h > screenHeight - margin
    ) return false
    return !placed.some(other =>
      overlaps(candidate, other, spacing) &&
      !allowedStructuralOverlap(candidate, other)
    )
  }
  if (valid(item)) return item

  const step = Math.max(8, spacing)
  const maxRadius = Math.max(screenWidth, screenHeight)
  for (let radius = step; radius <= maxRadius; radius += step) {
    const candidates = [
      [original.x + radius, original.y],
      [original.x, original.y + radius],
      [original.x - radius, original.y],
      [original.x, original.y - radius],
      [original.x + radius, original.y + radius],
      [original.x - radius, original.y + radius],
    ]
    for (const [x, y] of candidates) {
      const candidate = {
        ...item,
        props: {
          ...item.props,
          x: Math.round(Math.max(margin, Math.min(x, screenWidth - margin - original.w))),
          y: Math.round(Math.max(margin, Math.min(y, screenHeight - margin - original.h))),
        },
      }
      if (valid(candidate)) return candidate
    }
  }
  return item
}

const boxesBelowContent = (
  items: ForgeAILayoutItem[],
): ForgeAILayoutItem[] => {
  const boxes = items.filter(item => item.type === 'Box')
  const others = items.filter(item => item.type !== 'Box')
  return [...boxes, ...others]
}

const repairGeometry = (
  items: ForgeAILayoutItem[],
  screenWidth: number,
  screenHeight: number,
  margin: number,
  spacing: number,
): ForgeAILayoutItem[] => {
  const ordered = boxesBelowContent(items)
  const placed: ForgeAILayoutItem[] = []
  ordered.forEach(source => {
    const normalized = normalizeSize(source, screenWidth, screenHeight)
    placed.push(findNearestValidPosition(
      normalized,
      placed,
      screenWidth,
      screenHeight,
      margin,
      spacing,
    ))
  })
  return placed
}

const composeCoverageGrid = (
  items: ForgeAILayoutItem[],
  screenWidth: number,
  screenHeight: number,
): ForgeAILayoutItem[] => {
  const margin = 12
  const gutter = 12
  const heading = items.find(item => item.type === 'Heading')
  const body = items.filter(item => item !== heading)
  const columns = Math.min(
    7,
    Math.max(1, Math.ceil(Math.sqrt(body.length * 1.6))),
  )
  const rows = Math.max(1, Math.ceil(body.length / columns))
  const headingHeight = heading ? 40 : 0
  const bodyTop = margin + headingHeight + (heading ? gutter : 0)
  const cellWidth =
    (screenWidth - margin * 2 - gutter * (columns - 1)) / columns
  const cellHeight =
    (screenHeight - bodyTop - margin - gutter * (rows - 1)) / rows
  const result: ForgeAILayoutItem[] = []

  if (heading) {
    result.push({
      ...heading,
      props: {
        ...heading.props,
        positionMode: 'absolute',
        x: margin,
        y: margin,
        w: screenWidth - margin * 2,
        h: headingHeight,
      },
    })
  }
  body.forEach((item, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    result.push({
      ...item,
      props: {
        ...item.props,
        positionMode: 'absolute',
        x: Math.round(margin + column * (cellWidth + gutter)),
        y: Math.round(bodyTop + row * (cellHeight + gutter)),
        w: Math.max(24, Math.round(cellWidth)),
        h: Math.max(24, Math.round(cellHeight)),
      },
    })
  })
  return result
}

export const scoreForgeAILayout = (
  items: ForgeAILayoutItem[],
  screenWidth: number,
  screenHeight: number,
  margin = 16,
  spacing = 6,
): ForgeAILayoutQuality => {
  let overlapCount = 0
  let offScreen = 0
  let inconsistentMargins = 0
  let unreadableLargeControls = 0
  let occupiedArea = 0

  items.forEach((item, index) => {
    const bounds = rect(item)
    occupiedArea += Math.max(0, bounds.w * bounds.h)
    if (
      bounds.x < 0 ||
      bounds.y < 0 ||
      bounds.x + bounds.w > screenWidth ||
      bounds.y + bounds.h > screenHeight
    ) offScreen += 1
    if (
      bounds.x < margin ||
      bounds.y < margin ||
      screenWidth - bounds.x - bounds.w < margin ||
      screenHeight - bounds.y - bounds.h < margin
    ) inconsistentMargins += 1
    if (
      LARGE_TYPES.has(item.type) &&
      (bounds.w < screenWidth * 0.3 || bounds.h < screenHeight * 0.2)
    ) unreadableLargeControls += 1
    for (let other = index + 1; other < items.length; other += 1) {
      if (
        overlaps(item, items[other], spacing) &&
        !allowedStructuralOverlap(item, items[other])
      ) overlapCount += 1
    }
  })

  const heading = items.find(item => item.type === 'Heading')
  const headingVisible = !heading || (
    rect(heading).y < screenHeight * 0.25 &&
    rect(heading).w >= screenWidth * 0.35
  )
  const excessiveEmptySpace =
    items.length >= 5 &&
    occupiedArea / (screenWidth * screenHeight) < 0.16
  return {
    score: Math.max(
      0,
      100 -
        overlapCount * 25 -
        offScreen * 25 -
        inconsistentMargins * 2 -
        unreadableLargeControls * 10 -
        (headingVisible ? 0 : 15) -
        (excessiveEmptySpace ? 8 : 0),
    ),
    overlaps: overlapCount,
    offScreen,
    inconsistentMargins,
    headingVisible,
    unreadableLargeControls,
    excessiveEmptySpace,
  }
}

export const composeForgeAILayout = (
  document: ForgeAILayoutDocument,
  screenWidth: number,
  screenHeight: number,
  prompt = '',
): ForgeAILayoutDocument => {
  const selected = selectForgeAIComponentsForPurpose(
    document.layout,
    prompt,
  )
  if (/\bcomponent coverage test\b/i.test(prompt)) {
    return {
      ...document,
      layout: composeCoverageGrid(
        boxesBelowContent(selected),
        screenWidth,
        screenHeight,
      ),
    }
  }
  const firstPass = repairGeometry(
    selected,
    screenWidth,
    screenHeight,
    16,
    12,
  )
  const quality = scoreForgeAILayout(
    firstPass,
    screenWidth,
    screenHeight,
  )
  const layout = quality.score >= 75
    ? firstPass
    : repairGeometry(selected, screenWidth, screenHeight, 12, 8)

  return {
    ...document,
    layout,
  }
}
