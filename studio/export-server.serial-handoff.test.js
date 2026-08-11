const { EventEmitter } = require('events')
const { TextDecoder, TextEncoder } = require('util')
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder
const mockSpawned = []
jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  spawn: jest.fn(() => {
    const child = new EventEmitter()
    child.stdout = new EventEmitter(); child.stderr = new EventEmitter(); child.pid = 123
    mockSpawned.push(child)
    return child
  }),
}))

const { runScript, serialMonitor } = require('./export-server')

describe('build/flash serial handoff', () => {
  const response = () => ({ status: jest.fn().mockReturnThis(), json: jest.fn() })
  beforeEach(() => { mockSpawned.length = 0; serialMonitor.state = 'disconnected'; serialMonitor.path = null; serialMonitor.port = null; serialMonitor.error = null })

  it('releases a connected monitor before flash and reconnects after success', async () => {
    serialMonitor.state = 'connected'; serialMonitor.path = 'COM5'; serialMonitor.baud = 115200
    serialMonitor.stop = jest.fn(async () => { serialMonitor.state = 'disconnected' })
    serialMonitor.start = jest.fn(async () => { serialMonitor.state = 'connected' })
    await runScript('flash-p4.bat', response())
    expect(serialMonitor.stop).toHaveBeenCalledTimes(1)
    mockSpawned[0].emit('close', 0)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(serialMonitor.start).toHaveBeenCalledWith('COM5', 115200)
  })

  it('does not reconnect when disconnected before build', async () => {
    serialMonitor.stop = jest.fn(); serialMonitor.start = jest.fn()
    await runScript('flash-p4.bat', response())
    mockSpawned[0].emit('close', 0)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(serialMonitor.stop).not.toHaveBeenCalled()
    expect(serialMonitor.start).not.toHaveBeenCalled()
  })

  it('keeps successful flash completion while reporting reconnect failure', async () => {
    serialMonitor.state = 'connected'; serialMonitor.path = 'COM5'; serialMonitor.baud = 115200
    serialMonitor.stop = jest.fn(async () => { serialMonitor.state = 'disconnected' })
    serialMonitor.start = jest.fn(async () => { throw new Error('Port unavailable') })
    await runScript('flash-p4.bat', response())
    mockSpawned[0].emit('close', 0)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(serialMonitor.status()).toMatchObject({ state: 'error', error: expect.stringContaining('monitor reconnect failed') })
  })

  it('refuses to start flash when the monitor cannot release the port', async () => {
    serialMonitor.state = 'connected'; serialMonitor.path = 'COM5'; serialMonitor.baud = 115200
    serialMonitor.stop = jest.fn(async () => { serialMonitor.state = 'error'; serialMonitor.error = 'Unable to release COM5'; throw new Error('close failed') })
    serialMonitor.start = jest.fn()
    const res = response()
    await runScript('flash-p4.bat', res)
    expect(mockSpawned).toHaveLength(0)
    expect(res.status).toHaveBeenCalledWith(409)
  })
})
