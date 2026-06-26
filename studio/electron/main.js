const { app, BrowserWindow } = require('electron')
const { spawn, exec } = require('child_process')
const path = require('path')
const net = require('net')

let mainWindow = null
const childProcesses = []

function startProcess(command, args, name, cwd = process.cwd()) {
  const child = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'inherit',
  })

  childProcesses.push({ child, name })

  child.on('exit', code => {
    console.log(`${name} exited with code ${code}`)
  })

  return child
}

function waitForPort(port, host = '127.0.0.1', timeoutMs = 30000) {
  const startTime = Date.now()

  return new Promise((resolve, reject) => {
    function tryConnect() {
      const socket = new net.Socket()
      socket.setTimeout(1000)

      socket.once('connect', () => {
        socket.destroy()
        resolve()
      })

      socket.once('timeout', () => {
        socket.destroy()
        retry()
      })

      socket.once('error', () => {
        socket.destroy()
        retry()
      })

      socket.connect(port, host)
    }

    function retry() {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timed out waiting for port ${port}`))
        return
      }

      setTimeout(tryConnect, 500)
    }

    tryConnect()
  })
}

function stopForgeUIProcesses() {
  console.log('Stopping ForgeUI child processes...')

  for (const item of childProcesses) {
    if (item.child && !item.child.killed) {
      console.log(`Stopping ${item.name}...`)
      item.child.kill('SIGTERM')
    }
  }

  exec('taskkill /F /IM node.exe /T', () => {})
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'ForgeUI Studio',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  mainWindow.loadURL('http://localhost:3000')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function startForgeUIDesktop() {
 const appPath = app.isPackaged
  ? app.getAppPath()
  : path.join(__dirname, '..')

  console.log('Current working directory:', process.cwd())
  console.log('Application path:', appPath)

  const exportServerPath = path.join(appPath, 'export-server.js')

  console.log('Export server path:', exportServerPath)

  startProcess('node', [exportServerPath], 'Export Server')
  startProcess('npm', ['run', 'dev'], 'Next.js', appPath)

  console.log('Waiting for ForgeUI services...')

  await waitForPort(3030)
  await waitForPort(3000)

  console.log('ForgeUI services ready.')
  createWindow()
}

app.whenReady().then(startForgeUIDesktop)

app.on('before-quit', () => {
  stopForgeUIProcesses()
})

app.on('window-all-closed', () => {
  stopForgeUIProcesses()
  app.quit()
})