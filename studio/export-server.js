const express = require('express')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const app = express()

let currentProcess = null
let flashLog = []

function addLog(line) {
  const text = String(line)
  flashLog.push(text)

  if (flashLog.length > 1000) {
    flashLog = flashLog.slice(-1000)
  }

  process.stdout.write(text)
}

function runScript(scriptPath, res) {
  if (currentProcess) {
    return res.status(409).json({
      ok: false,
      error: 'Build/flash already running',
    })
  }

  flashLog = []
  addLog(`Starting: ${scriptPath}\n`)

  currentProcess = spawn('cmd.exe', ['/c', scriptPath], {
    cwd: path.resolve(__dirname, '..'),
    windowsHide: true,
  })

  currentProcess.stdout.on('data', (data) => addLog(data))
  currentProcess.stderr.on('data', (data) => addLog(data))

  currentProcess.on('close', (code) => {
    addLog(`\nProcess exited with code ${code}\n`)
    currentProcess = null
  })

  currentProcess.on('error', (err) => {
    addLog(`\nProcess error: ${String(err)}\n`)
    currentProcess = null
  })

  res.json({ ok: true })
}

app.use(express.json({ limit: '5mb' }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.post('/export', (req, res) => {
  try {
    const code = req.body.code || ''
    const header =
`#pragma once

#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);

#ifdef __cplusplus
}
#endif
`

    const mainDir = path.resolve(
      __dirname,
      '../firmware/ForgeUI-One/main'
    )

    const cTarget = path.join(mainDir, '90_Studio_Export.c')
    const hTarget = path.join(mainDir, '90_Studio_Export.h')

    fs.writeFileSync(cTarget, code, 'utf8')
    fs.writeFileSync(hTarget, header, 'utf8')

    console.log('Exported C to:', cTarget)
    console.log('Exported H to:', hTarget)

    res.json({
      ok: true,
      cTarget,
      hTarget,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.post('/export-idf-project', (req, res) => {
  try {
    const code = req.body.code || ''
    function safeProjectName(name) {
  return String(name || 'ForgeUI_Export')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'ForgeUI_Export'
}

function getUniqueExportDir(exportsRoot, baseName) {
  let exportDir = path.join(exportsRoot, baseName)

  if (!fs.existsSync(exportDir)) {
    return exportDir
  }

  let index = 1

  while (true) {
    const nextName = `${baseName}_${String(index).padStart(3, '0')}`
    exportDir = path.join(exportsRoot, nextName)

    if (!fs.existsSync(exportDir)) {
      return exportDir
    }

    index++
  }
}

const projectName = safeProjectName(req.body.projectName)

    const sourceDir = path.resolve(
      __dirname,
      '../firmware/ForgeUI-One'
    )

    const exportsRoot = path.resolve(
      __dirname,
      '../exports'
    )

    const exportDir = getUniqueExportDir(exportsRoot, projectName)

    fs.mkdirSync(exportsRoot, { recursive: true })

    fs.cpSync(sourceDir, exportDir, {
  recursive: true,
  force: false,
  errorOnExist: true,

  filter: (src) => {
    const name = path.basename(src).toLowerCase()

    const blocked = [
      'build',
      '.vscode',
      '.vs',
      'managed_components',
    ]

    return !blocked.includes(name)
  },
})

    const header =
`#pragma once

#include "lvgl.h"

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);

#ifdef __cplusplus
}
#endif
`

    const cTarget = path.join(exportDir, 'main', '90_Studio_Export.c')
    const hTarget = path.join(exportDir, 'main', '90_Studio_Export.h')

    fs.writeFileSync(cTarget, code, 'utf8')
    fs.writeFileSync(hTarget, header, 'utf8')

    console.log('ESP-IDF project exported to:', exportDir)

    res.json({
      ok: true,
      exportDir,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/flash', (req, res) => {
  const flashScript = path.resolve(__dirname, '../tools/flash-p4.bat')
  runScript(flashScript, res)
})

app.post('/clean-flash', (req, res) => {
  const flashScript = path.resolve(__dirname, '../tools/clean-flash-p4.bat')
  runScript(flashScript, res)
})

app.post('/flash-stop', (req, res) => {
  if (!currentProcess) {
    return res.json({ ok: true, stopped: false })
  }

  addLog('\nStopping build/flash process...\n')

  spawn('taskkill', ['/pid', String(currentProcess.pid), '/T', '/F'], {
    windowsHide: true,
  })

  currentProcess = null

  res.json({ ok: true, stopped: true })
})

app.get('/flash-log', (req, res) => {
  res.json({
    ok: true,
    running: Boolean(currentProcess),
    log: flashLog.join(''),
  })
})

app.post('/shutdown', (req, res) => {
  console.log('Shutdown requested from browser')

  res.json({ ok: true })

  setTimeout(() => {
    process.exit(0)
  }, 500)
})

app.listen(3030, () => {
  console.log('ForgeUI export server alive on :3030')
})