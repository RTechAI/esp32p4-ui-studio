import {
  formatForgeUIWifiStatus,
  getForgeUIStandardWifiStatusPresentation,
  getForgeUIWifiStatusText,
} from './ForgeUIStandardWifiStatus'

describe('standard Wi-Fi Status presentation', () => {
  it.each([
    ['disabled', 'Disabled'], ['starting', 'Starting'],
    ['connecting', 'Connecting'], ['connected', 'Connected'],
    ['internet', 'Internet Available'], ['failed', 'Failed'],
  ] as const)('maps %s to %s', (state, text) => {
    expect(getForgeUIWifiStatusText(state)).toBe(text)
  })

  it('supports icon/text modes and future-ready signal presentation', () => {
    expect(formatForgeUIWifiStatus(getForgeUIStandardWifiStatusPresentation({
      displayMode: 'icon-only', previewState: 'connected',
    }))).toBe('Wi-Fi')
    expect(formatForgeUIWifiStatus(getForgeUIStandardWifiStatusPresentation({
      displayMode: 'text-only', previewState: 'internet', showSignalStrength: true,
    }), -48)).toBe('Internet Available  -48 dBm')
  })
})
