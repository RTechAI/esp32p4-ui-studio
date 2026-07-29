export interface ForgeUIStandardArcValues {
  rangeStart: number
  rangeEnd: number
  minimum: number
  maximum: number
  value: number
  fraction: number
  rotation: number
  backgroundStartAngle: number
  backgroundEndAngle: number
  sweepAngle: number
  mode: ForgeUIStandardArcMode
}

export type ForgeUIStandardArcMode = 'normal' | 'reverse' | 'symmetrical'

export const FORGEUI_ARC_VIEWBOX_SIZE = 100
export const FORGEUI_ARC_RADIUS = 42
export const FORGEUI_ARC_STROKE_WIDTH = 10

const integer = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback
}

export const normalizeForgeUIArcAngle = (angle: number) => {
  const normalized = angle % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export const getForgeUIStandardArcValues = (
  props: Record<string, unknown>,
): ForgeUIStandardArcValues => {
  const rangeStart = integer(props.min, 0)
  const rangeEnd = integer(props.max, 100)
  const minimum = Math.min(rangeStart, rangeEnd)
  const maximum = Math.max(rangeStart, rangeEnd)
  const configuredValue = integer(props.value, 65)
  const value = Math.max(minimum, Math.min(maximum, configuredValue))
  const rawFraction = rangeStart === rangeEnd
    ? 0
    : (value - rangeStart) / (rangeEnd - rangeStart)
  const fraction = rawFraction === 0 ? 0 : rawFraction
  const rotation = normalizeForgeUIArcAngle(integer(props.rotation, 0))
  const backgroundStartAngle = normalizeForgeUIArcAngle(integer(
    props.bgStartAngle ?? props.backgroundStartAngle,
    135,
  ))
  const backgroundEndAngle = normalizeForgeUIArcAngle(integer(
    props.bgEndAngle ?? props.backgroundEndAngle,
    45,
  ))
  const sweepAngle = normalizeForgeUIArcAngle(
    backgroundEndAngle - backgroundStartAngle,
  )
  const rawMode = String(props.mode ?? props.arcMode ?? '').toLowerCase()
  const mode: ForgeUIStandardArcMode = rawMode === 'reverse'
    ? 'reverse'
    : rawMode === 'symmetrical' || rawMode === 'symmetric'
      ? 'symmetrical'
      : 'normal'

  return {
    rangeStart,
    rangeEnd,
    minimum,
    maximum,
    value,
    fraction,
    rotation,
    backgroundStartAngle,
    backgroundEndAngle,
    sweepAngle,
    mode,
  }
}

const circularDistance = (left: number, right: number) => {
  const distance = Math.abs(normalizeForgeUIArcAngle(left - right))
  return Math.min(distance, 360 - distance)
}

export const isForgeUIStandardArcTrackHit = (
  props: Record<string, unknown>,
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
) => {
  if (width <= 0 || height <= 0) return false

  const arc = getForgeUIStandardArcValues(props)
  const scale = Math.min(width, height) / FORGEUI_ARC_VIEWBOX_SIZE
  const radius = FORGEUI_ARC_RADIUS * scale
  const halfStroke = FORGEUI_ARC_STROKE_WIDTH * scale / 2
  const tolerance = Math.min(6, Math.max(3, Math.min(width, height) * 0.03))
  const deltaX = pointerX - width / 2
  const deltaY = pointerY - height / 2
  const distance = Math.hypot(deltaX, deltaY)

  if (
    distance < radius - halfStroke - tolerance ||
    distance > radius + halfStroke + tolerance
  ) {
    return false
  }

  const pointerAngle = normalizeForgeUIArcAngle(
    Math.atan2(deltaY, deltaX) * 180 / Math.PI,
  )
  const physicalStart = normalizeForgeUIArcAngle(
    arc.backgroundStartAngle + arc.rotation,
  )
  const relativeAngle = normalizeForgeUIArcAngle(
    pointerAngle - physicalStart,
  )
  const angleTolerance = radius > 0
    ? tolerance / radius * 180 / Math.PI
    : 0

  return relativeAngle <= arc.sweepAngle + angleTolerance ||
    relativeAngle >= 360 - angleTolerance
}

export const getForgeUIStandardArcValueFromPointer = (
  props: Record<string, unknown>,
  pointerX: number,
  pointerY: number,
  width: number,
  height: number,
) => {
  const arc = getForgeUIStandardArcValues(props)
  if (
    arc.minimum === arc.maximum ||
    width <= 0 ||
    height <= 0
  ) {
    return arc.minimum
  }

  const centerX = width / 2
  const centerY = height / 2
  const deltaX = pointerX - centerX
  const deltaY = pointerY - centerY
  if (deltaX === 0 && deltaY === 0) return arc.value

  const pointerAngle = normalizeForgeUIArcAngle(
    Math.atan2(deltaY, deltaX) * 180 / Math.PI,
  )
  const physicalStart = normalizeForgeUIArcAngle(
    arc.backgroundStartAngle + arc.rotation,
  )
  const physicalEnd = normalizeForgeUIArcAngle(
    arc.backgroundEndAngle + arc.rotation,
  )
  let progress = arc.sweepAngle === 0
    ? 0
    : normalizeForgeUIArcAngle(pointerAngle - physicalStart) / arc.sweepAngle

  if (progress > 1) {
    progress = circularDistance(pointerAngle, physicalStart) <=
      circularDistance(pointerAngle, physicalEnd)
      ? 0
      : 1
  }

  if (arc.mode === 'reverse') progress = 1 - progress
  const mapped = arc.rangeStart +
    progress * (arc.rangeEnd - arc.rangeStart)

  return Math.max(
    arc.minimum,
    Math.min(arc.maximum, Math.round(mapped)),
  )
}
