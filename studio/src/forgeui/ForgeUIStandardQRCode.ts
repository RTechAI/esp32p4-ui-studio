export const FORGEUI_QR_ERROR_CORRECTION = 'M' as const

export type ForgeUIQRCodeContentType =
  | 'text'
  | 'url'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'custom'

const qrString = (value: unknown) =>
  value === undefined || value === null ? '' : String(value)

export const resolveQRCodeContentType = (
  props: Record<string, any> = {},
): ForgeUIQRCodeContentType => {
  const value = props.contentType
  return value === 'text' ||
    value === 'url' ||
    value === 'wifi' ||
    value === 'email' ||
    value === 'phone' ||
    value === 'sms' ||
    value === 'custom'
    ? value
    : 'custom'
}

export const escapeQRCodeWifiValue = (value: unknown) =>
  qrString(value).replace(/[\\;,:"]/g, match => `\\${match}`)

export const resolveQRCodePayload = (
  props: Record<string, any> = {},
): string => {
  switch (resolveQRCodeContentType(props)) {
    case 'text':
      return qrString(props.qrText)
    case 'url':
      return qrString(props.qrUrl)
    case 'wifi': {
      const security = props.qrWifiSecurity === 'WEP'
        ? 'WEP'
        : props.qrWifiSecurity === 'None'
          ? 'nopass'
          : 'WPA'
      return `WIFI:T:${security};S:${escapeQRCodeWifiValue(props.qrWifiSSID)};P:${escapeQRCodeWifiValue(props.qrWifiPassword)};H:${props.qrWifiHidden === true};;`
    }
    case 'email': {
      const address = qrString(props.qrEmailAddress)
      const query = new URLSearchParams()
      const subject = qrString(props.qrEmailSubject)
      const message = qrString(props.qrEmailMessage)
      if (subject) query.set('subject', subject)
      if (message) query.set('body', message)
      const suffix = query.toString()
      return `mailto:${address}${suffix ? `?${suffix}` : ''}`
    }
    case 'phone':
      return `tel:${qrString(props.qrPhoneNumber)}`
    case 'sms': {
      const number = qrString(props.qrSmsPhoneNumber)
      const message = qrString(props.qrSmsMessage)
      return `sms:${number}${message ? `?body=${encodeURIComponent(message)}` : ''}`
    }
    case 'custom':
    default:
      // Legacy projects only have qrText. Preserve it byte-for-byte.
      return qrString(props.qrText)
  }
}

export const getQRCodePayloadWarning = (
  props: Record<string, any> = {},
): string => {
  const type = resolveQRCodeContentType(props)
  if (type === 'wifi' && !qrString(props.qrWifiSSID)) {
    return 'Wi-Fi SSID is required for a useful payload.'
  }
  if (type === 'email' && !qrString(props.qrEmailAddress)) {
    return 'Email address is required for a useful payload.'
  }
  if (
    (type === 'phone' && !qrString(props.qrPhoneNumber)) ||
    (type === 'sms' && !qrString(props.qrSmsPhoneNumber))
  ) {
    return 'Phone number is required for a useful payload.'
  }
  return resolveQRCodePayload(props)
    ? ''
    : 'QR payload is empty.'
}

export const getForgeUIQRCodeGeometry = (
  width: unknown,
  height: unknown,
  moduleCount?: number,
) => {
  const resolvedWidth = Number(width) || 180
  const resolvedHeight = Number(height) || 180
  const size = Math.max(1, Math.min(resolvedWidth, resolvedHeight))
  const xOffset = Math.floor((resolvedWidth - size) / 2)
  const yOffset = Math.floor((resolvedHeight - size) / 2)

  if (!moduleCount) {
    return { size, xOffset, yOffset }
  }

  const moduleSize = Math.max(1, Math.floor(size / moduleCount))
  const renderedSize = moduleCount * moduleSize
  const moduleOffset = Math.floor((size - renderedSize) / 2)

  return {
    size,
    xOffset,
    yOffset,
    moduleSize,
    moduleOffset,
  }
}
