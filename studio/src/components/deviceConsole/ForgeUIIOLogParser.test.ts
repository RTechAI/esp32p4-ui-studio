import { hasForgeUIIOData, parseForgeUIIOLog } from './ForgeUIIOLogParser'

describe('ForgeUI read-only I/O log parser', () => {
  it('tolerates unknown and malformed text without mutation or exceptions', () => {
    const raw = 'random output\nGPIO nope HIGH\n\0 malformed'
    const original = raw.slice()
    expect(() => parseForgeUIIOLog(raw)).not.toThrow()
    expect(hasForgeUIIOData(parseForgeUIIOLog(raw))).toBe(false)
    expect(raw).toBe(original)
  })

  it('parses explicit disconnected and connected Wi-Fi/IP states', () => {
    expect(parseForgeUIIOLog('I APP_MAIN: WiFi: DISCONNECTED | IP: -').network)
      .toEqual({ wifi: 'DISCONNECTED', ip: '-' })
    expect(parseForgeUIIOLog('I APP_MAIN: WiFi status: CONNECTED | IP: 192.168.1.194').network)
      .toEqual({ wifi: 'CONNECTED', ip: '192.168.1.194' })
  })

  it('parses explicit SD states', () => {
    expect(parseForgeUIIOLog('I APP_MAIN: SD: DISABLED').storage?.sd).toBe('DISABLED')
    expect(parseForgeUIIOLog('I APP_MAIN: SD ready: READY').storage?.sd).toBe('READY')
  })

  it('keeps only the latest explicit HIGH/LOW state per GPIO', () => {
    const snapshot = parseForgeUIIOLog('GPIO 2: LOW\nGPIO2=HIGH\nGPIO 4 is LOW')
    expect(snapshot.gpio).toEqual([{ gpio: 2, state: 'HIGH' }, { gpio: 4, state: 'LOW' }])
  })

  it('parses GPS fields only when explicitly labelled', () => {
    const explicit = parseForgeUIIOLog('I FG_GPS_UI: receiving=1 nmea=1 fix=1 sats=12\nGPS lat=-37.6878 lon=176.1651')
    expect(explicit.gps).toEqual({ fix: 'FIX', satellites: 12, latitude: -37.6878, longitude: 176.1651 })
    expect(parseForgeUIIOLog('NMEA $GNGGA,coordinates,not,decoded').gps).toBeUndefined()
  })

  it('keeps latest I2C identity and bounded latest-line state', () => {
    const prefix = Array.from({ length: 4001 }, (_, index) => `GPIO 2: ${index === 0 ? 'HIGH' : 'LOW'}`).join('\n')
    const snapshot = parseForgeUIIOLog(`${prefix}\nI2C ACK address=0x50\nDS3231 attached to BSP I2C bus at 0x68`)
    expect(snapshot.gpio).toEqual([{ gpio: 2, state: 'LOW' }])
    expect(snapshot.i2c).toEqual([{ address: '0x50' }, { address: '0x68', device: 'DS3231' }])
  })

  it('parses explicit boot heap, UART, RSSI and CAN summaries', () => {
    const snapshot = parseForgeUIIOLog([
      'APP_MAIN: BOOT 01 app_main reset=3 heap=393216 min_heap=380000',
      'FG_WIFI: RSSI=-54 dBm',
      'FG_GPS: UART RX alive',
      'FG_GPS_TX: sending UBX poll',
      'CAN state=ACTIVE RX=12 TX=9',
      'CAN ID=0x18FF50E5 DATA=01 02 AF',
    ].join('\n'))
    expect(snapshot.system).toMatchObject({ runtime: 'BOOTING', resetReason: '3', freeHeapBytes: 393216 })
    expect(snapshot.network?.rssiDbm).toBe(-54)
    expect(snapshot.uart).toEqual({ rx: 'ALIVE', tx: 'ACTIVE' })
    expect(snapshot.can).toEqual({ state: 'ACTIVE', rxCount: 12, txCount: 9, latestId: '0x18FF50E5', latestData: '01 02 AF' })
  })
})
