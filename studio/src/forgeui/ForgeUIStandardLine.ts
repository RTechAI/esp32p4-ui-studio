export type ForgeUIStandardLinePoint = {
  x: number
  y: number
}

export type ForgeUIStandardLineGeometry = {
  x: number
  y: number
  w: number
  h: number
  startX: number
  startY: number
  endX: number
  endY: number
}

const numberOr = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const getForgeUIStandardLineGeometry = (
  props: Record<string, unknown>,
): ForgeUIStandardLineGeometry => {
  const x = numberOr(props.x, 0)
  const y = numberOr(props.y, 0)
  const legacyWidth = Math.max(1, numberOr(props.w, 120))
  const legacyHeight = Math.max(1, numberOr(props.h, 120))

  return {
    x,
    y,
    w: legacyWidth,
    h: legacyHeight,
    startX: numberOr(props.startX, 0),
    startY: numberOr(props.startY, 0),
    endX: numberOr(props.endX, legacyWidth),
    endY: numberOr(props.endY, legacyHeight),
  }
}

export const fitForgeUIStandardLineEndpoints = ({
  start,
  end,
}: {
  start: ForgeUIStandardLinePoint
  end: ForgeUIStandardLinePoint
}): Omit<ForgeUIStandardLineGeometry, 'x' | 'y'> & {
  offsetX: number
  offsetY: number
} => {
  const offsetX = Math.min(start.x, end.x)
  const offsetY = Math.min(start.y, end.y)
  const maximumX = Math.max(start.x, end.x)
  const maximumY = Math.max(start.y, end.y)

  return {
    offsetX,
    offsetY,
    w: Math.max(1, maximumX - offsetX),
    h: Math.max(1, maximumY - offsetY),
    startX: start.x - offsetX,
    startY: start.y - offsetY,
    endX: end.x - offsetX,
    endY: end.y - offsetY,
  }
}

export const updateForgeUIStandardLineEndpoint = (
  props: Record<string, unknown>,
  endpoint: 'start' | 'end',
  point: ForgeUIStandardLinePoint,
): ForgeUIStandardLineGeometry => {
  const current = getForgeUIStandardLineGeometry(props)
  const start = endpoint === 'start'
    ? point
    : { x: current.x + current.startX, y: current.y + current.startY }
  const end = endpoint === 'end'
    ? point
    : { x: current.x + current.endX, y: current.y + current.endY }
  const fitted = fitForgeUIStandardLineEndpoints({ start, end })

  return {
    x: fitted.offsetX,
    y: fitted.offsetY,
    w: fitted.w,
    h: fitted.h,
    startX: fitted.startX,
    startY: fitted.startY,
    endX: fitted.endX,
    endY: fitted.endY,
  }
}
