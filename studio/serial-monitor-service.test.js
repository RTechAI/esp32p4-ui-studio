const { EventEmitter } = require('events')
const { SerialMonitorService } = require('./serial-monitor-service')

class FakePort extends EventEmitter {
  static instances = []
  static async list() { return [{ path: 'COM5', manufacturer: 'Espressif' }] }
  constructor(options) { super(); this.options = options; this.isOpen = false; FakePort.instances.push(this) }
  open(callback) { this.isOpen = true; callback(this.openError || null) }
  close(callback) { if (this.closeError) return callback(this.closeError); this.isOpen = false; this.emit('close'); callback() }
}

describe('SerialMonitorService', () => {
  beforeEach(() => { FakePort.instances = [] })

  it('lists ports, starts once, captures raw output, and releases the port', async () => {
    const service = new SerialMonitorService({ SerialPort: FakePort })
    await expect(service.list()).resolves.toEqual([{ path: 'COM5', manufacturer: 'Espressif' }])
    await service.start('COM5', 115200)
    await service.start('COM5', 115200)
    expect(FakePort.instances).toHaveLength(1)
    FakePort.instances[0].emit('data', Buffer.from('ESP-ROM\r\nI (26) boot'))
    expect(service.snapshot().log).toBe('ESP-ROM\r\nI (26) boot')
    await service.stop()
    expect(FakePort.instances[0].isOpen).toBe(false)
    expect(service.status().state).toBe('disconnected')
  })

  it('bounds retained output and clears it', async () => {
    const service = new SerialMonitorService({ SerialPort: FakePort, maxLogChars: 10 })
    await service.start('COM5')
    FakePort.instances[0].emit('data', '123456789012345')
    expect(service.snapshot().log).toBe('6789012345')
    service.clear()
    expect(service.snapshot().log).toBe('')
  })

  it('surfaces open and disconnect errors without crashing', async () => {
    class FailingPort extends FakePort { open(callback) { callback(new Error('Access denied')) } }
    const service = new SerialMonitorService({ SerialPort: FailingPort })
    await expect(service.start('COM5')).rejects.toThrow('Access denied')
    expect(service.status()).toMatchObject({ state: 'error', error: 'Access denied' })
    const healthy = new SerialMonitorService({ SerialPort: FakePort })
    await healthy.start('COM5')
    FakePort.instances[FakePort.instances.length - 1].emit('error', new Error('Device disconnected'))
    expect(healthy.status()).toMatchObject({ state: 'error', error: 'Device disconnected' })
    const blocked = new SerialMonitorService({ SerialPort: FakePort })
    await blocked.start('COM6')
    blocked.port.closeError = new Error('Access denied while closing')
    await expect(blocked.stop()).rejects.toThrow('Access denied while closing')
    expect(blocked.status()).toMatchObject({ state: 'error', error: expect.stringContaining('Unable to release COM6') })
  })
})
