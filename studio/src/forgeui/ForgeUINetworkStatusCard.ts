export const FORGEUI_NETWORK_STATUS_CARD_SCHEMA_VERSION = 1

export type ForgeUINetworkInterface = 'wifi' | 'ethernet' | 'mqtt' | 'cloud' | 'local-api' | 'internet' | 'vpn' | 'cellular'
export type ForgeUINetworkState = 'unknown' | 'offline' | 'connecting' | 'online' | 'degraded' | 'reconnecting' | 'authentication-failed' | 'fault'
export type ForgeUINetworkDisplayMode = 'compact' | 'detailed' | 'dashboard'

const numberValue = (value: unknown, fallback: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) => {
  const parsed = Number(value)
  return Math.max(min, Math.min(max, Number.isFinite(parsed) ? parsed : fallback))
}
const booleanValue = (value: unknown, fallback: boolean) => typeof value === 'boolean' ? value : fallback
const textValue = (value: unknown, fallback = '', max = 64) => (typeof value === 'string' ? value.trim() : fallback).slice(0, max)
const choice = <T extends string>(value: unknown, values: readonly T[], fallback: T) => values.includes(value as T) ? value as T : fallback

export const normalizeForgeUINetworkStatusCard = (props: Record<string, unknown> = {}) => ({
  schemaVersion: 1 as 1,
  title: textValue(props.title, 'Main Network', 64) || 'Main Network',
  interfaceType: choice(props.interfaceType, ['wifi', 'ethernet', 'mqtt', 'cloud', 'local-api', 'internet', 'vpn', 'cellular'] as const, 'wifi'),
  state: choice(props.state, ['unknown', 'offline', 'connecting', 'online', 'degraded', 'reconnecting', 'authentication-failed', 'fault'] as const, 'online'),
  displayMode: choice(props.displayMode, ['compact', 'detailed', 'dashboard'] as const, 'detailed'),
  ssid: textValue(props.ssid, 'Workshop WiFi', 64), ipAddress: textValue(props.ipAddress, '192.168.1.42', 47),
  subnet: textValue(props.subnet, '255.255.255.0', 47), gateway: textValue(props.gateway, '192.168.1.1', 47),
  macAddress: textValue(props.macAddress, '02:00:00:00:00:01', 20), rssi: numberValue(props.rssi, -58, -127, 0),
  latency: numberValue(props.latency, 24, 0, 60000), packetLoss: numberValue(props.packetLoss, 0, 0, 100),
  uptime: numberValue(props.uptime, 86400, 0), reconnectCount: numberValue(props.reconnectCount, 0, 0),
  cloudConnected: booleanValue(props.cloudConnected, true), mqttConnected: booleanValue(props.mqttConnected, true),
  internetAvailable: booleanValue(props.internetAvailable, true), localApiAvailable: booleanValue(props.localApiAvailable, true),
  statusText: textValue(props.statusText, 'Connected', 64), showSignal: booleanValue(props.showSignal, true),
  showIp: booleanValue(props.showIp, true), showGateway: booleanValue(props.showGateway, true), showLatency: booleanValue(props.showLatency, true),
  showUptime: booleanValue(props.showUptime, true), showCloud: booleanValue(props.showCloud, true), showMqtt: booleanValue(props.showMqtt, true),
  showInterface: booleanValue(props.showInterface, true), showStatus: booleanValue(props.showStatus, true),
  iconStyle: choice(props.iconStyle, ['interface', 'status'] as const, 'interface'), signalStyle: choice(props.signalStyle, ['bars', 'text'] as const, 'bars'),
  rounded: booleanValue(props.rounded, true), shadow: booleanValue(props.shadow, true), glassStyle: booleanValue(props.glassStyle, false),
  simulationMode: choice(props.simulationMode, ['wifi-connected', 'ethernet-connected', 'weak-signal', 'offline', 'reconnecting', 'cloud-offline', 'mqtt-offline', 'authentication-failed'] as const, 'wifi-connected'),
  generateRuntimeApi: booleanValue(props.generateRuntimeApi, true), enableUserEvents: booleanValue(props.enableUserEvents, true),
})

export type ForgeUINetworkStatusCardModel = ReturnType<typeof normalizeForgeUINetworkStatusCard>

export const simulateForgeUINetworkStatus = (model: ForgeUINetworkStatusCardModel): ForgeUINetworkStatusCardModel => {
  const scenarios: Record<string, Partial<ForgeUINetworkStatusCardModel>> = {
    'wifi-connected': { interfaceType: 'wifi', state: 'online', rssi: -58, latency: 24, statusText: 'Connected' },
    'ethernet-connected': { interfaceType: 'ethernet', state: 'online', rssi: 0, latency: 4, statusText: 'Ethernet connected' },
    'weak-signal': { interfaceType: 'wifi', state: 'degraded', rssi: -88, latency: 180, statusText: 'Weak signal' },
    offline: { state: 'offline', cloudConnected: false, mqttConnected: false, internetAvailable: false, statusText: 'Offline' },
    reconnecting: { state: 'reconnecting', reconnectCount: 3, cloudConnected: false, mqttConnected: false, statusText: 'Reconnecting' },
    'cloud-offline': { state: 'degraded', cloudConnected: false, statusText: 'Cloud unavailable' },
    'mqtt-offline': { state: 'degraded', mqttConnected: false, statusText: 'MQTT unavailable' },
    'authentication-failed': { state: 'authentication-failed', cloudConnected: false, mqttConnected: false, internetAvailable: false, statusText: 'Authentication failed' },
  }
  return { ...model, ...(scenarios[model.simulationMode] || {}) }
}

export const networkSignalQuality = (rssi: number) => rssi === 0 ? 4 : rssi >= -55 ? 4 : rssi >= -67 ? 3 : rssi >= -75 ? 2 : rssi >= -85 ? 1 : 0
