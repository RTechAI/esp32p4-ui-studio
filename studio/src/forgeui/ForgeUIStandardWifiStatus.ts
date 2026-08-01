export type ForgeUIWifiStatusState =
  | 'disabled' | 'starting' | 'connecting' | 'connected'
  | 'internet' | 'failed'

export type ForgeUIWifiStatusDisplayMode =
  | 'icon-text' | 'icon-only' | 'text-only'

export type ForgeUIWifiStatusPresentation = {
  displayMode: ForgeUIWifiStatusDisplayMode
  showSignalStrength: boolean
  previewState: ForgeUIWifiStatusState
}

export const FORGEUI_STANDARD_WIFI_STATUS_DEFAULT_PRESENTATION:
ForgeUIWifiStatusPresentation = {
  displayMode: 'icon-text',
  showSignalStrength: false,
  previewState: 'failed',
}

const states = new Set<ForgeUIWifiStatusState>([
  'disabled', 'starting', 'connecting', 'connected', 'internet', 'failed',
])

export const getForgeUIStandardWifiStatusPresentation = (
  props: Record<string, unknown> | undefined,
): ForgeUIWifiStatusPresentation => ({
  displayMode:
    props?.displayMode === 'icon-only' || props?.displayMode === 'text-only'
      ? props.displayMode
      : 'icon-text',
  showSignalStrength: props?.showSignalStrength === true,
  previewState: states.has(props?.previewState as ForgeUIWifiStatusState)
    ? props?.previewState as ForgeUIWifiStatusState
    : 'failed',
})

export const getForgeUIWifiStatusText = (state: ForgeUIWifiStatusState) => ({
  disabled: 'Disabled',
  starting: 'Starting',
  connecting: 'Connecting',
  connected: 'Connected',
  internet: 'Internet Available',
  failed: 'Failed',
})[state]

export const formatForgeUIWifiStatus = (
  presentation: ForgeUIWifiStatusPresentation,
  rssi = -62,
) => {
  const icon = 'Wi-Fi'
  const text = getForgeUIWifiStatusText(presentation.previewState)
  const status = presentation.displayMode === 'icon-only'
    ? icon
    : presentation.displayMode === 'text-only'
      ? text
      : `${icon} ${text}`
  return presentation.showSignalStrength &&
    presentation.previewState !== 'disabled' &&
    presentation.previewState !== 'failed'
    ? `${status}  ${rssi} dBm`
    : status
}
