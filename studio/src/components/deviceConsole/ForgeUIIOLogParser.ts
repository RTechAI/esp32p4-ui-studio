export type ForgeUIIOSnapshot = {
  system?: { runtime?: string; resetReason?: string; freeHeapBytes?: number; minimumHeapBytes?: number }
  network?: { wifi?: string; ip?: string; rssiDbm?: number }
  storage?: { sd?: string }
  gpio: Array<{ gpio: number; state: 'HIGH' | 'LOW' }>
  gps?: { fix?: string; latitude?: number; longitude?: number; satellites?: number }
  i2c: Array<{ address: string; device?: string }>
  can?: { state?: string; rxCount?: number; txCount?: number; latestId?: string; latestData?: string }
  uart?: { rx?: string; tx?: string }
}

const MAX_PARSE_LINES = 4000
const value = (text: string) => text.trim().replace(/[|,;]+$/, '').trim()
const hex = (text: string) => `0x${text.slice(2).toUpperCase()}`

export const hasForgeUIIOData = (snapshot: ForgeUIIOSnapshot) => Boolean(
  snapshot.system || snapshot.network || snapshot.storage || snapshot.gps ||
  snapshot.can || snapshot.uart || snapshot.gpio.length || snapshot.i2c.length,
)

export const parseForgeUIIOLog = (rawLog: string): ForgeUIIOSnapshot => {
  const snapshot: ForgeUIIOSnapshot = { gpio: [], i2c: [] }
  const gpio = new Map<number, 'HIGH' | 'LOW'>()
  const i2c = new Map<string, { address: string; device?: string }>()
  try {
    const lines = String(rawLog || '').split(/\r?\n/).slice(-MAX_PARSE_LINES)
    for (const line of lines) {
      let match: RegExpMatchArray | null
      if (/\bBOOT\s+\d+\b|FORGEUI ONE BOOT/i.test(line)) {
        snapshot.system = { ...snapshot.system, runtime: 'BOOTING' }
      }
      match = line.match(/\breset=(\d+)\s+heap=(\d+)\s+min_heap=(\d+)/i)
      if (match) snapshot.system = { ...snapshot.system, resetReason: match[1], freeHeapBytes: Number(match[2]), minimumHeapBytes: Number(match[3]) }
      match = line.match(/\binternal=(\d+)(?:\/\d+)?/i)
      if (match) snapshot.system = { ...snapshot.system, freeHeapBytes: Number(match[1]) }

      match = line.match(/\bWiFi(?:\s+status)?\s*:\s*([^|\r\n]+)(?:\|\s*IP\s*:\s*([^|\r\n]+))?/i)
      if (match) {
        const wifi = value(match[1]).toUpperCase()
        snapshot.network = { ...snapshot.network, wifi }
        if (match[2]) snapshot.network.ip = value(match[2])
      }
      match = line.match(/\bRSSI\s*[:=]\s*(-?\d+)\s*(?:dBm)?/i)
      if (match) snapshot.network = { ...snapshot.network, rssiDbm: Number(match[1]) }

      match = line.match(/\bSD(?:\s+ready)?\s*:\s*(READY|DISABLED|FAIL(?:ED)?|ERROR)\b/i) || line.match(/\bSD\s+(READY|DISABLED)\b/i)
      if (match) snapshot.storage = { sd: match[1].toUpperCase().replace('FAILED', 'FAIL') }

      match = line.match(/\bGPIO\s*(\d+)\s*(?:[:=]|IS\s+)?\s*(HIGH|LOW)\b/i)
      if (match) gpio.set(Number(match[1]), match[2].toUpperCase() as 'HIGH' | 'LOW')

      match = line.match(/\bFG_GPS_UI\b.*\bfix=(\d+)\b.*\bsats=(\d+)\b/i)
      if (match) snapshot.gps = { ...snapshot.gps, fix: Number(match[1]) ? 'FIX' : 'NO FIX', satellites: Number(match[2]) }
      match = line.match(/\bGPS\b.*\b(?:latitude|lat)\s*[:=]\s*(-?\d+(?:\.\d+)?)\b.*\b(?:longitude|lon)\s*[:=]\s*(-?\d+(?:\.\d+)?)/i)
      if (match) snapshot.gps = { ...snapshot.gps, latitude: Number(match[1]), longitude: Number(match[2]) }
      match = line.match(/\bGPS\b.*\bfix\s*[:=]\s*(NO FIX|2D FIX|3D FIX|FIXED|ACQUIRED|LOST)\b/i)
      if (match) snapshot.gps = { ...snapshot.gps, fix: value(match[1]).toUpperCase() }

      match = line.match(/\bI2C ACK address=(0x[0-9a-f]{2})\b/i)
      if (match) i2c.set(hex(match[1]), { address: hex(match[1]) })
      match = line.match(/\b([A-Za-z][A-Za-z0-9_-]*) attached to .*I2C.* at (0x[0-9a-f]{2})\b/i)
      if (match) i2c.set(hex(match[2]), { address: hex(match[2]), device: match[1] })

      if (/\bUART RX alive\b/i.test(line)) snapshot.uart = { ...snapshot.uart, rx: 'ALIVE' }
      if (/\b(?:UART|FG_GPS_TX)\b.*\b(?:TX|sending)\b/i.test(line)) snapshot.uart = { ...snapshot.uart, tx: 'ACTIVE' }

      match = line.match(/\bCAN\b.*\bstate\s*[:=]\s*(ACTIVE|ERROR|BUS-OFF|STOPPED)\b/i)
      if (match) snapshot.can = { ...snapshot.can, state: match[1].toUpperCase() }
      match = line.match(/\bCAN\b.*\bRX\s*[:=]\s*(\d+)\b.*\bTX\s*[:=]\s*(\d+)\b/i)
      if (match) snapshot.can = { ...snapshot.can, rxCount: Number(match[1]), txCount: Number(match[2]) }
      match = line.match(/\bCAN\b.*\bID\s*[:=]\s*(0x[0-9a-f]+)\b.*\bDATA\s*[:=]\s*([0-9a-f ]+)\b/i)
      if (match) snapshot.can = { ...snapshot.can, latestId: hex(match[1]), latestData: value(match[2]).toUpperCase() }
    }
  } catch {
    return { gpio: [], i2c: [] }
  }
  snapshot.gpio = [...gpio].sort(([a], [b]) => a - b).map(([number, state]) => ({ gpio: number, state }))
  snapshot.i2c = [...i2c.values()].sort((a, b) => a.address.localeCompare(b.address))
  return snapshot
}
