export type ForgeUIClockHourFormat = '24' | '12'

export type ForgeUIClockPresentation = {
  hourFormat: ForgeUIClockHourFormat
  showSeconds: boolean
  blinkSeparator: boolean
}

export const FORGEUI_STANDARD_CLOCK_DEFAULT_PRESENTATION:
ForgeUIClockPresentation = {
  hourFormat: '24',
  showSeconds: false,
  blinkSeparator: true,
}

export const getForgeUIStandardClockPresentation = (
  props: Record<string, unknown> | undefined,
): ForgeUIClockPresentation => ({
  hourFormat: props?.hourFormat === '12' ? '12' : '24',
  showSeconds: typeof props?.showSeconds === 'boolean'
    ? props.showSeconds
    : false,
  blinkSeparator: typeof props?.blinkSeparator === 'boolean'
    ? props.blinkSeparator
    : true,
})

export const formatForgeUIStandardClockTime = (
  date: Date,
  presentation: ForgeUIClockPresentation,
  separatorVisible = true,
): string => {
  const separator =
    presentation.blinkSeparator && !separatorVisible ? ' ' : ':'
  const hour24 = date.getHours()
  const hour =
    presentation.hourFormat === '12'
      ? hour24 % 12 || 12
      : hour24
  const seconds = presentation.showSeconds
    ? `${separator}${String(date.getSeconds()).padStart(2, '0')}`
    : ''
  const period =
    presentation.hourFormat === '12'
      ? hour24 < 12 ? ' AM' : ' PM'
      : ''

  return `${String(hour).padStart(2, '0')}${separator}` +
    `${String(date.getMinutes()).padStart(2, '0')}${seconds}${period}`
}
