import {
  escapeQRCodeWifiValue,
  getQRCodePayloadWarning,
  resolveQRCodeContentType,
  resolveQRCodePayload,
} from './ForgeUIStandardQRCode'

describe('ForgeUI QR payload resolution', () => {
  it('preserves legacy raw-value projects exactly', () => {
    const props = { qrText: 'legacy://value?x=1&y=two' }
    expect(resolveQRCodeContentType(props)).toBe('custom')
    expect(resolveQRCodePayload(props)).toBe(props.qrText)
  })

  it.each([
    ['text', { qrText: 'Hello ForgeUI' }, 'Hello ForgeUI'],
    ['url', { qrUrl: 'forgeui.co.nz/path' }, 'forgeui.co.nz/path'],
    ['phone', { qrPhoneNumber: '+64 21 555 010' }, 'tel:+64 21 555 010'],
    ['custom', { qrText: 'RAW:do-not-change;%2F' }, 'RAW:do-not-change;%2F'],
  ])('resolves %s content', (contentType, fields, expected) => {
    expect(resolveQRCodePayload({ contentType, ...fields })).toBe(expected)
  })

  it.each([
    ['WPA', false, 'WIFI:T:WPA;S:Office;P:secret;H:false;;'],
    ['WEP', true, 'WIFI:T:WEP;S:Office;P:secret;H:true;;'],
    ['None', false, 'WIFI:T:nopass;S:Office;P:;H:false;;'],
  ])('resolves %s Wi-Fi content', (security, hidden, expected) => {
    expect(resolveQRCodePayload({
      contentType: 'wifi',
      qrWifiSSID: 'Office',
      qrWifiPassword: security === 'None' ? '' : 'secret',
      qrWifiSecurity: security,
      qrWifiHidden: hidden,
    })).toBe(expected)
  })

  it('escapes all Wi-Fi reserved characters', () => {
    expect(escapeQRCodeWifiValue('a\\b;c,d:e"f')).toBe(
      'a\\\\b\\;c\\,d\\:e\\"f',
    )
  })

  it('uses a mailto URI with encoded subject and message', () => {
    expect(resolveQRCodePayload({
      contentType: 'email',
      qrEmailAddress: 'hello@example.com',
      qrEmailSubject: 'Hello world',
      qrEmailMessage: 'Line one & two',
    })).toBe(
      'mailto:hello@example.com?subject=Hello+world&body=Line+one+%26+two',
    )
  })

  it('uses an SMS URI with an encoded body', () => {
    expect(resolveQRCodePayload({
      contentType: 'sms',
      qrSmsPhoneNumber: '+6421555010',
      qrSmsMessage: 'Hello & welcome',
    })).toBe('sms:+6421555010?body=Hello%20%26%20welcome')
  })

  it('returns targeted non-blocking validation warnings', () => {
    expect(getQRCodePayloadWarning({ contentType: 'custom', qrText: '' }))
      .toBe('QR payload is empty.')
    expect(getQRCodePayloadWarning({ contentType: 'wifi', qrWifiSSID: '' }))
      .toContain('SSID')
    expect(getQRCodePayloadWarning({ contentType: 'email', qrEmailAddress: '' }))
      .toContain('Email')
    expect(getQRCodePayloadWarning({ contentType: 'phone', qrPhoneNumber: '' }))
      .toContain('Phone')
  })
})
