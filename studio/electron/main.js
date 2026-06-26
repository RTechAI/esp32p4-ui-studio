const { app, BrowserWindow } = require('electron')
const { spawn, exec } = require('child_process')

let mainWindow = null
const childProcesses = []

function startProcess(command, args, name) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    shell: true,
    stdio: 'inherit',
  })

  childProcesses.push({ child, name })

  child.on('exit', code => {
    console.log(`${name} exited with code ${code}`)
  })

  return child
}

function killChildProcesses() {
  console.log('Stopping ForgeUI child processes...')

  for (const item of childProcesses) {
    if (item.child && !item.child.killed) {
      console.log(`Stopping ${item.name}...`)
      item.child.kill()
    }
  }

  // Windows cleanup safety net
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

app.whenReady().then(() => {
  startProcess('node', ['export-server.js'], 'Export Server')
  startProcess('npm', ['run', 'dev'], 'Next.js')

  setTimeout(() => {
    createWindow()
  }, 4000)
})

app.on('before-quit', () => {
  killChildProcesses()
})

app.on('window-all-closed', () => {
  killChildProcesses()
  app.quit()
})