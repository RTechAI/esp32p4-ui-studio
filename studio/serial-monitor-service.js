const DEFAULT_BAUD = 115200
const DEFAULT_MAX_LOG_CHARS = 256 * 1024

class SerialMonitorService {
  constructor({ SerialPort, maxLogChars = DEFAULT_MAX_LOG_CHARS }) {
    this.SerialPort = SerialPort
    this.maxLogChars = maxLogChars
    this.port = null
    this.path = null
    this.baud = DEFAULT_BAUD
    this.log = ''
    this.state = 'disconnected'
    this.error = null
  }

  async list() {
    return this.SerialPort.list()
  }

  append(chunk) {
    this.log += Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk)
    if (this.log.length > this.maxLogChars) this.log = this.log.slice(-this.maxLogChars)
  }

  status() {
    return { state: this.state, connected: this.state === 'connected', port: this.path, baud: this.baud, error: this.error }
  }

  snapshot() {
    return { ...this.status(), log: this.log }
  }

  clear() {
    this.log = ''
  }

  async start(path, baud = DEFAULT_BAUD) {
    if (!path || typeof path !== 'string') throw new Error('A serial port is required')
    const parsedBaud = Number(baud)
    if (!Number.isInteger(parsedBaud) || parsedBaud <= 0) throw new Error('A valid baud rate is required')
    if (this.port && this.state === 'connected' && this.path === path && this.baud === parsedBaud) return this.status()
    await this.stop()
    this.path = path
    this.baud = parsedBaud
    this.error = null
    this.state = 'connecting'
    const port = new this.SerialPort({ path, baudRate: parsedBaud, autoOpen: false })
    this.port = port
    port.on('data', chunk => this.append(chunk))
    port.on('error', error => {
      this.error = String(error.message || error)
      this.state = 'error'
    })
    port.on('close', () => {
      if (this.port === port) this.port = null
      if (this.state !== 'error') this.state = 'disconnected'
    })
    await new Promise((resolve, reject) => port.open(error => error ? reject(error) : resolve()))
      .catch(error => {
        this.port = null
        this.state = 'error'
        this.error = String(error.message || error)
        throw error
      })
    this.state = 'connected'
    return this.status()
  }

  async stop() {
    const port = this.port
    if (!port) {
      this.state = 'disconnected'
      this.error = null
      return this.status()
    }
    await new Promise((resolve, reject) => {
      if (!port.isOpen) return resolve()
      port.close(error => error ? reject(error) : resolve())
    }).catch(error => {
      this.state = 'error'
      this.error = `Unable to release ${this.path}: ${String(error.message || error)}`
      throw error
    })
    this.state = 'disconnected'
    this.error = null
    return this.status()
  }
}

module.exports = { SerialMonitorService, DEFAULT_BAUD, DEFAULT_MAX_LOG_CHARS }
