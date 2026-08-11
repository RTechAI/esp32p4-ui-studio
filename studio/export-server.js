const express = require('express')
const fs = require('fs')
const path = require('path')
const { spawn, spawnSync } = require('child_process')
const { SerialPort } = require('serialport')
const { SerialMonitorService } = require('./serial-monitor-service')
const forgeUIStudioAssets = require('./forgeui-studio-assets.json')

const defaultHeroFileName =
  'fg_upload_ai_hero_1784342478518_b95a7dc0'

const defaultHeroCSource =
  `assets/defaults/${defaultHeroFileName}.c`

const defaultHeroBrowserSrc =
  `http://localhost:3030/forgeui-defaults/${defaultHeroFileName}.png`

const app = express()

let currentProcess = null
let flashLog = []
const serialMonitor = new SerialMonitorService({ SerialPort })

function addLog(line) {
  const text = String(line)
  flashLog.push(text)

  if (flashLog.length > 1000) {
    flashLog = flashLog.slice(-1000)
  }

  process.stdout.write(text)
}

async function runScript(scriptPath, res) {
  if (currentProcess) {
    return res.status(409).json({
      ok: false,
      error: 'Build/flash already running',
    })
  }

  const monitorBeforeFlash = serialMonitor.status()
  flashLog = []
  if (monitorBeforeFlash.connected) {
    try {
      await serialMonitor.stop()
    } catch (error) {
      addLog(`Unable to release ${monitorBeforeFlash.port} before flash: ${String(error.message || error)}\n`)
      return res.status(409).json({ ok: false, error: serialMonitor.status().error })
    }
  }
  addLog(`Starting: ${scriptPath}\n`)

  currentProcess = spawn('cmd.exe', ['/c', scriptPath], {
    cwd: path.resolve(__dirname, '..'),
    windowsHide: true,
  })

  currentProcess.stdout.on('data', (data) => addLog(data))
  currentProcess.stderr.on('data', (data) => addLog(data))

  currentProcess.on('close', async (code) => {
    addLog(`\nProcess exited with code ${code}\n`)
    currentProcess = null
    if (code === 0 && monitorBeforeFlash.connected) {
      try {
        await serialMonitor.start(monitorBeforeFlash.port, monitorBeforeFlash.baud)
      } catch (error) {
        serialMonitor.error = `Flash succeeded; monitor reconnect failed: ${String(error.message || error)}`
        serialMonitor.state = 'error'
      }
    }
  })

  currentProcess.on('error', (err) => {
    addLog(`\nProcess error: ${String(err)}\n`)
    currentProcess = null
  })

  res.json({ ok: true })
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(express.json({ limit: '30mb' }))

const persistentUploadsDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main/assets/uploads/_input'
)

fs.mkdirSync(persistentUploadsDir, {
  recursive: true,
})

app.use(
  '/forgeui-assets/uploads',
  express.static(persistentUploadsDir)
)

const defaultsDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main/assets/defaults'
)

app.use(
  '/forgeui-defaults',
  express.static(defaultsDir)
)

function safeSymbolName(name) {
  return String(name || 'fg_uploaded_image')
    .trim()
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'fg_uploaded_image'
}

const firmwareUploadsDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main/assets/uploads'
)

const firmwareInputDir = path.join(
  firmwareUploadsDir,
  '_input'
)

function inspectDirectory(directoryPath) {
  const totals = {
    files: 0,
    bytes: 0,
  }

  if (!fs.existsSync(directoryPath)) {
    return totals
  }

  const entries = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  })

  entries.forEach((entry) => {
    const entryPath = path.join(
      directoryPath,
      entry.name
    )

    if (entry.isDirectory()) {
      const childTotals =
        inspectDirectory(entryPath)

      totals.files += childTotals.files
      totals.bytes += childTotals.bytes
      return
    }

    if (entry.isFile()) {
      const stats = fs.statSync(entryPath)

      totals.files += 1
      totals.bytes += stats.size
    }
  })

  return totals
}

function emptyDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, {
    recursive: true,
  })

  const entries = fs.readdirSync(
    directoryPath,
    {
      withFileTypes: true,
    }
  )

  entries.forEach((entry) => {
    const entryPath = path.join(
      directoryPath,
      entry.name
    )

    fs.rmSync(entryPath, {
      recursive: true,
      force: true,
    })
  })
}

app.post(
  '/clean-firmware-uploads',
  (req, res) => {
    try {
      if (currentProcess) {
        return res.status(409).json({
          ok: false,
          success: false,
          error:
            'Cannot clean generated firmware files while build or flash is running',
        })
      }

      const mainDir = path.resolve(
        __dirname,
        '../firmware/ForgeUI-One/main'
      )

      const cTarget = path.join(
        mainDir,
        '90_Studio_Export.c'
      )

      const hTarget = path.join(
        mainDir,
        '90_Studio_Export.h'
      )

      const cmakeTarget = path.join(
        mainDir,
        'CMakeLists.txt'
      )

      const cleanHeader =
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

      const cleanSource =
`#include "90_Studio_Export.h"

void fg_studio_export_create(lv_obj_t *parent)
{
    (void)parent;
}
`

      const cleanCMake =
`idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "20_RTC.c"
        "30_Audio.c"
        "30_WIFI.c"
        "40_SD.c"
        "50_DIAGNOSTICS.c"
        "90_Studio_Export.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_app_format
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
        spi_flash
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

      fs.writeFileSync(
        cTarget,
        cleanSource,
        'utf8'
      )

      fs.writeFileSync(
        hTarget,
        cleanHeader,
        'utf8'
      )

      fs.writeFileSync(
        cmakeTarget,
        cleanCMake,
        'utf8'
      )

      console.log(
        'Generated firmware files cleaned:',
        {
          cTarget,
          hTarget,
          cmakeTarget,
        }
      )

      return res.json({
        ok: true,
        success: true,

        filesRemoved: 0,
        bytesRecovered: 0,

        cmakeRebuilt: true,
        studioExportRebuilt: true,
        buildDeleted: false,
        assetsDeleted: false,

        paths: {
          cmakeTarget,
          cTarget,
          hTarget,
        },
      })
    } catch (err) {
      console.error(
        'Generated firmware cleanup failed:',
        err
      )

      return res.status(500).json({
        ok: false,
        success: false,
        error: String(err),
      })
    }
  }
)

app.post(
  '/clean-firmware-sweep',
  (req, res) => {
    try {
      if (currentProcess) {
        return res.status(409).json({
          ok: false,
          success: false,
          error:
            'Cannot reset firmware while build or flash is running',
        })
      }

      const firmwareRoot = path.resolve(
        __dirname,
        '../firmware/ForgeUI-One'
      )

      const mainDir = path.join(
        firmwareRoot,
        'main'
      )

      const buildDir = path.join(
        firmwareRoot,
        'build'
      )

      const assetsDir = path.join(
        mainDir,
        'assets'
      )

      const iconsDir = path.join(
        assetsDir,
        'icons'
      )

      const themesDir = path.join(
        assetsDir,
        'themes'
      )

      const uploadsDir = path.join(
        assetsDir,
        'uploads'
      )

      const inputDir = path.join(
        uploadsDir,
        '_input'
      )

      const cTarget = path.join(
       mainDir,
     '90_Studio_Export.c'
      )

      const hTarget = path.join(
      mainDir,
      '90_Studio_Export.h'
      )

      const userEventsCTarget = path.join(
       mainDir,
       '95_UserEvents.c'
      )

      const userEventsHTarget = path.join(
       mainDir,
       '95_UserEvents.h'
      )

      const cmakeTarget = path.join(
        mainDir,
        'CMakeLists.txt'
      )

      const iconsBefore =
        inspectDirectory(iconsDir)

      const themesBefore =
        inspectDirectory(themesDir)

      const uploadsBefore =
        inspectDirectory(uploadsDir)

      emptyDirectory(iconsDir)
      emptyDirectory(themesDir)

      // uploads is the authoritative source root for both user-converted assets
      // and committed permanent packs (for example Weather RGB565). Generated
      // firmware/build outputs may be reset, but source assets must survive.

      fs.mkdirSync(iconsDir, {
        recursive: true,
      })

      fs.mkdirSync(themesDir, {
        recursive: true,
      })

      fs.mkdirSync(uploadsDir, {
        recursive: true,
      })

      fs.mkdirSync(inputDir, {
        recursive: true,
      })

      const buildExisted =
        fs.existsSync(buildDir)

      fs.rmSync(buildDir, {
        recursive: true,
        force: true,
      })

      const cleanHeader =
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

      const cleanSource =
`#include "90_Studio_Export.h"

void fg_studio_export_create(lv_obj_t *parent)
{
    (void)parent;
}
`

      const cleanCMake =
`idf_component_register(
    SRCS
        "main.c"
        "01_FG_Runtime.c"
        "20_RTC.c"
        "30_Audio.c"
        "30_WIFI.c"
        "40_SD.c"
        "50_DIAGNOSTICS.c"
        "90_Studio_Export.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_app_format
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
        spi_flash
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

      fs.writeFileSync(
        cTarget,
        cleanSource,
        'utf8'
      )

      fs.writeFileSync(
        hTarget,
        cleanHeader,
        'utf8'
      )

      fs.writeFileSync(
        cmakeTarget,
        cleanCMake,
        'utf8'
      )

      const filesRemoved =
        iconsBefore.files +
        themesBefore.files

      const bytesRecovered =
        iconsBefore.bytes +
        themesBefore.bytes

      console.log(
        'Firmware destructive reset complete:',
        {
          filesRemoved,
          bytesRecovered,
          iconsRemoved:
            iconsBefore.files,
          themesRemoved:
            themesBefore.files,
          uploadsRemoved:
            0,
          buildDeleted:
            buildExisted,
        }
      )

      return res.json({
      ok: true,
       success: true,

       defaultHero: {
       id: defaultHeroFileName,
       name: `${defaultHeroFileName}.png`,
       browserSrc: defaultHeroBrowserSrc,
       lvgl: defaultHeroFileName,
       cFile: defaultHeroCSource,
      },

         filesRemoved,
           bytesRecovered,

         foldersCleaned: {
          icons: iconsBefore.files,
          themes: themesBefore.files,
          uploads: 0,
          uploadsPreserved: uploadsBefore.files,
        },

        buildDeleted:
          buildExisted,

        cmakeRebuilt: true,
        studioExportRebuilt: true,
        staleDeclarationsRemoved: true,
        staleAssetSourcesRemoved: true,

        paths: {
          iconsDir,
          themesDir,
          uploadsDir,
          inputDir,
          buildDir,
          cmakeTarget,
          cTarget,
          hTarget,
        },
      })
    } catch (err) {
      console.error(
        'Firmware destructive reset failed:',
        err
      )

      return res.status(500).json({
        ok: false,
        success: false,
        error: String(err),
      })
    }
  }
)

app.post('/convert-lvgl-image', (req, res) => {
  try {
    const fileName = req.body.fileName || 'uploaded.png'
    const symbolName = safeSymbolName(req.body.symbolName)
    const base64 = req.body.base64
    const assetMode =
  req.body.assetMode || 'image'
  const width =
  Number(req.body.width || 0)

const height =
  Number(req.body.height || 0)
  const sourceAssetId = String(req.body.sourceAssetId || '')
  const sourceName = String(req.body.sourceName || fileName)
  const sourceBrowserSrc = String(req.body.sourceBrowserSrc || '')
  console.log('=== CONVERT REQUEST ===')
  console.log('fileName :', fileName)
  console.log('assetMode:', assetMode)
  console.log('symbol   :', symbolName)
  console.log('source id:', sourceAssetId || '(not supplied)')
  console.log('source   :', sourceName)
  console.log('browser  :', sourceBrowserSrc || '(not supplied)')
  console.log('target   :', `${width}x${height}`)

    if (!base64) {
      return res.status(400).json({
        ok: false,
        error: 'Missing base64',
      })
    }

    const pythonPath =
      'C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\python.exe'

    const converterPath = path.resolve(
      __dirname,
      '../tools/lvgl/LVGLImage.py'
    )

    const preprocessorPath = path.resolve(
      __dirname,
      '../tools/ForgeUIImagePreprocessor.py'
    )

    const tempInputDir = path.resolve(
      __dirname,
      '../firmware/ForgeUI-One/main/assets/uploads/_input'
    )

    const outputDir = path.resolve(
      __dirname,
      '../firmware/ForgeUI-One/main/assets/uploads'
    )

    fs.mkdirSync(tempInputDir, { recursive: true })
    fs.mkdirSync(outputDir, { recursive: true })

    const inputPath = path.join(
      tempInputDir,
      `${symbolName}.png`
    )

    const base64Text = String(base64)
    const isDataUrl = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(base64Text)
    const cleanBase64 = base64Text.replace(
      /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
      ''
    )

    if (!isDataUrl) {
      return res.status(400).json({
        ok: false,
        error: `Image input encoding failed for ${sourceName}`,
        detail: 'Expected a data:image/...;base64 URL, but received a browser path or unsupported value.',
        stage: 'input-decode',
        sourceAssetId,
        sourceBrowserSrc,
      })
    }

    const inputBytes = Buffer.from(cleanBase64, 'base64')

    fs.writeFileSync(
      inputPath,
      inputBytes
    )

    const pngSignature = inputBytes.length >= 24 &&
      inputBytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    const sourceWidth = pngSignature ? inputBytes.readUInt32BE(16) : 0
    const sourceHeight = pngSignature ? inputBytes.readUInt32BE(20) : 0
    console.log('resolved input:', inputPath)
    console.log('input exists  :', fs.existsSync(inputPath))
    console.log('input bytes   :', inputBytes.length)
    console.log('input format  :', pngSignature ? 'PNG' : 'non-PNG')
    console.log('source size   :', `${sourceWidth}x${sourceHeight}`)
    console.log('output path   :', outputDir)

    console.log('Preprocessor:', preprocessorPath)
    console.log('Preprocess input:', inputPath)
    console.log('Preprocess args:', JSON.stringify([
      preprocessorPath, inputPath, assetMode, String(width), String(height),
    ]))

    const preprocess = spawn(
  pythonPath,
  [
    preprocessorPath,
    inputPath,
    assetMode,
    String(width),
    String(height),
  ],
      {
        cwd: path.resolve(__dirname, '../tools'),
        windowsHide: true,
      }
    )

    let preprocessLog = ''
    let responseSent = false

    preprocess.stdout.on('data', (data) => {
      preprocessLog += data.toString()
    })

    preprocess.stderr.on('data', (data) => {
      preprocessLog += data.toString()
    })

    preprocess.on('error', (err) => {
      if (responseSent) return
      responseSent = true

      console.error('Image preprocessor error:', err)

      return res.status(500).json({
        ok: false,
        error: 'Failed to start image preprocessor',
        detail: String(err),
        preprocessorPath,
      })
    })

    preprocess.on('close', (preprocessCode) => {
      console.log('Image preprocessor exited:', preprocessCode)
      console.log(preprocessLog)

      if (responseSent) return

      if (preprocessCode !== 0) {
        responseSent = true

        return res.status(500).json({
          ok: false,
        error: `Image preprocessing failed for ${sourceName}`,
        detail: `Stage preprocess exited ${preprocessCode}; input=${inputPath}; source=${sourceWidth}x${sourceHeight} PNG; target=${width}x${height}`,
        stage: 'preprocess',
          code: preprocessCode,
          log: preprocessLog,
          preprocessorPath,
          inputPath,
        })
      }

      console.log('LVGL converter:', converterPath)
      console.log('LVGL input:', inputPath)
      console.log('LVGL output:', outputDir)

      const child = spawn(
        pythonPath,
        [
          converterPath,
          '--ofmt',
          'C',
          '--cf',
          'ARGB8888',
          '--output',
          outputDir,
          '--name',
          symbolName,
          inputPath,
        ],
        {
          cwd: path.resolve(__dirname, '../tools/lvgl'),
          windowsHide: true,
        }
      )

      let log = ''

      child.stdout.on('data', (data) => {
        log += data.toString()
      })

      child.stderr.on('data', (data) => {
        log += data.toString()
      })

      child.on('error', (err) => {
        if (responseSent) return
        responseSent = true

        console.error('LVGL converter spawn error:', err)

        return res.status(500).json({
          ok: false,
          error: 'Failed to start Python/LVGLImage.py',
          detail: String(err),
          converterPath,
          inputPath,
          outputDir,
        })
      })

      child.on('close', (code) => {
        console.log('LVGL converter exited:', code)
        console.log(log)

        if (responseSent) return

        if (code !== 0) {
          responseSent = true

          return res.status(500).json({
            ok: false,
            error: 'LVGL image conversion failed',
            code,
            log,
            converterPath,
            inputPath,
            outputDir,
          })
        }

        const cFile = path.join(
          outputDir,
          `${symbolName}.c`
        )

        const assetSource =
          `assets/uploads/${symbolName}.c`

        if (!fs.existsSync(cFile)) {
          responseSent = true

          return res.status(500).json({
            ok: false,
            error:
              'LVGL converter finished but .c file was not created',
            cFile,
            log,
          })
        }

        responseSent = true

        const browserSrc =
  `http://localhost:3030/forgeui-assets/uploads/${symbolName}.png`

return res.json({
  ok: true,
  symbolName,
  browserSrc,
  inputPath,
  outputDir,
  cFile,
  assetSource,
  preprocessLog,
  log,
})
      })
    })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

function generateDeveloperGuide(userEventHooks) {

    const hooks = Array.from(
        new Set(
            (Array.isArray(userEventHooks)
                ? userEventHooks
                : [])
            .map(h => String(h).trim())
            .filter(Boolean)
        )
    )

    const hookTable =
        hooks.length
            ? hooks.map(h => {
                const toggled = h.endsWith('_Toggled')
                const listItem = h.endsWith('_Item_Clicked')
                return `| ${h.replace(/^FG_On_|_(Clicked|Toggled|Item_Clicked)$/g, '')} | ${toggled ? 'Toggle' : listItem ? 'List item click' : 'Click'} | \`${h}(${toggled ? 'bool enabled' : listItem ? 'uint32_t index, const char * text' : ''})\` |`
              }).join('\n')
            : '| None | - | - |'

    const hookList =
        hooks.length
            ? hooks.map(h => `- \`${h}(${h.endsWith('_Toggled') ? 'bool enabled' : ''})\``).join('\n')
            : '- None'

    return `# ForgeUI Developer Guide

This project was generated by ForgeUI Studio.

---

# Project Ownership After Export

ForgeUI Studio live project
-> generated and flashed internally for testing

Manual standalone export
-> created under C:\\ForgeUI-Exports
-> independent ESP-IDF project
-> developer owns 95_UserEvents.c/.h
-> developer adds GPIO and application logic
-> build and flash independently from VS Code/ESP-IDF

| File | Live Studio firmware | Standalone exported project |
|------|----------------------|-----------------------------|
| 90_Studio_Export.c/.h | Generated | Generated |
| 95_UserEvents.c/.h | Regenerated test hooks | Developer-owned application logic |
| Application I/O code | Do not keep permanently here | Add here |

---

# Edit This File

Developer code belongs in:

\`\`\`
main/95_UserEvents.c
\`\`\`

Do not modify:

\`\`\`
main/90_Studio_Export.c
main/90_Studio_Export.h
\`\`\`

---

# Generated Event Hooks

${hookList}

---

| Component | Event | Hook |
|-----------|-------|------|
${hookTable}

---

# Runtime Flow

Touch
 ↓
LVGL
 ↓
90_Studio_Export.c
 ↓
Generated Hook
 ↓
95_UserEvents.c
 ↓
Developer Code

---

# AI Instructions

If using ChatGPT or another AI assistant:

- Never edit 90_Studio_Export.c
- Never edit 90_Studio_Export.h
- Place all application logic inside 95_UserEvents.c
- Preserve generated hook names.
- Treat 90_Studio_Export.h as the current Runtime SDK source of truth.
- Active customised hooks are preservation-merged across regeneration.
- Untouched obsolete Native Component placeholders are removed automatically.
- Customised obsolete Native Component hooks are retained in a labelled,
  non-compiling legacy block until a developer deliberately resolves them.
`
}

function normalizePublicApiDeclarations(declarations) {
  return Array.from(
    new Set(
      (Array.isArray(declarations) ? declarations : [])
        .map((declaration) => String(declaration || '').trim())
        .filter((declaration) =>
          (
            /^void FG_Set_[A-Za-z0-9_]+\((?:bool (?:enabled|on|checked|visible)|int32_t value)\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(float value\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(const char \* (?:title|value|units|description|timestamp|footer)\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(const char \* key\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(const char \* text, uint32_t rgb\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(uint32_t rgb\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+\(int32_t trend\);$/.test(declaration) ||
            /^typedef enum \{ FG_ALARM_PRIORITY_LOW = 0, FG_ALARM_PRIORITY_MEDIUM = 1, FG_ALARM_PRIORITY_HIGH = 2, FG_ALARM_PRIORITY_CRITICAL = 3 \} FG_Alarm_Priority;$/.test(declaration) ||
            /^typedef enum \{ FG_ALARM_STATE_NORMAL = 0, FG_ALARM_STATE_WARNING = 1, FG_ALARM_STATE_ALARM = 2, FG_ALARM_STATE_ACKNOWLEDGED = 3, FG_ALARM_STATE_CLEARED = 4 \} FG_Alarm_State;$/.test(declaration) ||
            /^typedef enum \{ FG_IO_DIGITAL_INPUT = 0, FG_IO_DIGITAL_OUTPUT = 1, FG_IO_ANALOG_INPUT = 2, FG_IO_ANALOG_OUTPUT = 3 \} FG_IO_Type;$/.test(declaration) ||
            /^bool FG_Set_[A-Za-z0-9_]+_(?:DigitalInput|DigitalOutput)\(const char \* channel, bool state\);$/.test(declaration) ||
            /^bool FG_Set_[A-Za-z0-9_]+_(?:AnalogInput|AnalogOutput)\(const char \* channel, float value\);$/.test(declaration) ||
            /^bool FG_(?:Add_[A-Za-z0-9_]+_Alarm\(int32_t alarm_id, const char \* message, const char \* timestamp, FG_Alarm_Priority priority, FG_Alarm_State state\)|Acknowledge_[A-Za-z0-9_]+_Alarm\(int32_t alarm_id\)|Clear_[A-Za-z0-9_]+_Alarm\(int32_t alarm_id\)|Select_[A-Za-z0-9_]+_Alarm\(int32_t alarm_id\));$/.test(declaration) ||
            /^void FG_Clear_All_[A-Za-z0-9_]+\(void\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Channel\(uint32_t channel, bool enabled\);$/.test(declaration) ||
            /^bool FG_Get_[A-Za-z0-9_]+_Channel\(uint32_t channel\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Channel_Enabled\(uint32_t channel, bool enabled\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_(?:Label|Status)\(uint32_t channel, const char \* (?:label|text)\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Text\(const char \* text\);$/.test(declaration) ||
            /^void FG_Add_[A-Za-z0-9_]+_Point\(int32_t value\);$/.test(declaration) ||
            /^void FG_Clear_[A-Za-z0-9_]+\(void\);$/.test(declaration) ||
            /^void FG_(?:Show|Hide|Close)_[A-Za-z0-9_]+\(void\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Date\(uint16_t year, uint8_t month, uint8_t day\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Selected\(uint32_t (?:index|button_index|tab_index)\);$/.test(declaration) ||
            /^void FG_Set_[A-Za-z0-9_]+_Selected\(uint32_t column, uint32_t row\);$/.test(declaration)
            || /^void FG_Set_[A-Za-z0-9_]+_Selected\(bool selected\);$/.test(declaration)
            || /^void FG_Set_[A-Za-z0-9_]+_Selected_Index\(uint32_t index\);$/.test(declaration)
            || /^void FG_Set_[A-Za-z0-9_]+_Source\(const void \* src\);$/.test(declaration)
          )
        )
    )
  )
}

const CANONICAL_ASSET_MANIFEST = Object.freeze({
  'assets/icons/fg_icon_settings_fi_48px.c': {
    kind: 'copy',
    input: path.resolve(
      __dirname,
      './public/assets/icons/48x48 ForgeUI Reactor Set/fg_icon_settings_fi_48px.c',
    ),
  },
  ...Object.fromEntries(
    Object.values(forgeUIStudioAssets.textures).map(asset => [
      asset.source,
      {
        kind: 'image',
        input: path.resolve(__dirname, asset.input),
        symbol: asset.symbol,
        assetMode: asset.assetMode || 'image',
      },
    ]),
  ),
})

function generateCanonicalImageAsset(asset, target) {
  const pythonPath =
    'C:\\Espressif\\python_env\\idf5.5_py3.11_env\\Scripts\\python.exe'
  const preprocessorPath = path.resolve(
    __dirname,
    '../tools/ForgeUIImagePreprocessor.py',
  )
  const converterPath = path.resolve(__dirname, '../tools/lvgl/LVGLImage.py')
  const inputDir = path.join(path.dirname(target), '_input')
  const input = path.join(inputDir, `${asset.symbol}.png`)

  fs.mkdirSync(inputDir, { recursive: true })
  fs.copyFileSync(asset.input, input)

  const preprocess = spawnSync(
    pythonPath,
    [preprocessorPath, input, asset.assetMode || 'image', '0', '0'],
    { cwd: path.resolve(__dirname, '../tools'), windowsHide: true, encoding: 'utf8' },
  )
  if (preprocess.error || preprocess.status !== 0) {
    throw new Error(
      `Studio asset preprocessing failed for ${asset.symbol}:\n` +
      String(preprocess.error || preprocess.stderr || preprocess.stdout),
    )
  }

  const conversion = spawnSync(
    pythonPath,
    [
      converterPath,
      '--ofmt', 'C',
      '--cf', 'ARGB8888',
      '--output', path.dirname(target),
      '--name', asset.symbol,
      input,
    ],
    { cwd: path.resolve(__dirname, '../tools/lvgl'), windowsHide: true, encoding: 'utf8' },
  )
  if (conversion.error || conversion.status !== 0 || !fs.existsSync(target)) {
    throw new Error(
      `Studio asset conversion failed for ${asset.symbol}:\n` +
      String(conversion.error || conversion.stderr || conversion.stdout),
    )
  }
}

app.post('/forgeui-asset-source-exists', (req, res) => {
  try {
    const mainDir = path.resolve(__dirname, '../firmware/ForgeUI-One/main')
    const normalized = String(req.body?.assetSource || '').replace(/\\/g, '/')
    if (
      path.posix.isAbsolute(normalized) ||
      /^[A-Za-z]:/.test(normalized) ||
      normalized.split('/').includes('..') ||
      !normalized.endsWith('.c')
    ) return res.status(400).json({ ok: false, exists: false })
    const source = path.resolve(mainDir, normalized)
    if (!source.startsWith(`${mainDir}${path.sep}`)) {
      return res.status(400).json({ ok: false, exists: false })
    }
    return res.json({
      ok: true,
      exists: fs.existsSync(source) && fs.statSync(source).isFile(),
    })
  } catch (error) {
    return res.status(500).json({ ok: false, exists: false, error: String(error) })
  }
})

function materializeCanonicalAssetSources(assetSources, options = {}) {
  const mainDir = path.resolve(
    options.mainDir || path.resolve(__dirname, '../firmware/ForgeUI-One/main'),
  )
  const emitted = []

  Array.from(new Set(assetSources || [])).forEach(rawSource => {
    const normalized = String(rawSource).replace(/\\/g, '/')
    const canonicalAsset = CANONICAL_ASSET_MANIFEST[normalized]
    if (!canonicalAsset) return

    if (!fs.existsSync(canonicalAsset.input) || !fs.statSync(canonicalAsset.input).isFile()) {
      throw new Error(`Canonical asset source missing:\n${canonicalAsset.input}`)
    }

    const target = path.resolve(mainDir, normalized)
    if (!target.startsWith(`${mainDir}${path.sep}`)) {
      throw new Error(`Canonical asset target escapes firmware main:\n${normalized}`)
    }

    if (fs.existsSync(target) && fs.statSync(target).isFile()) return

    fs.mkdirSync(path.dirname(target), { recursive: true })
    if (canonicalAsset.kind === 'copy') {
      fs.copyFileSync(canonicalAsset.input, target)
    } else {
      const materializeImage = options.materializeImage || generateCanonicalImageAsset
      materializeImage(canonicalAsset, target)
    }
    emitted.push(normalized)
  })

  return emitted
}

function copyAssetSourcesToProject(assetSources, sourceMainDir, targetMainDir) {
  const sourceRoot = path.resolve(sourceMainDir)
  const targetRoot = path.resolve(targetMainDir)

  ;(assetSources || []).forEach(rawSource => {
    const normalized = String(rawSource).replace(/\\/g, '/')
    const source = path.resolve(sourceRoot, normalized)
    const target = path.resolve(targetRoot, normalized)

    if (
      !source.startsWith(`${sourceRoot}${path.sep}`) ||
      !target.startsWith(`${targetRoot}${path.sep}`)
    ) {
      throw new Error(`Asset source escapes project main:\n${normalized}`)
    }
    if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
      throw new Error(`Referenced asset missing:\n${source}`)
    }

    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(source, target)
  })
}

function appendAssetSourcesToCMake(cmakeSources, assetSources) {
  const normalizeSource = source => path.posix.normalize(
    String(source).replace(/^"(.*)"$/, '$1').replace(/\\/g, '/'),
  )
  const emittedSources = new Set(
    (cmakeSources || []).map(normalizeSource),
  )

  ;(assetSources || []).forEach(source => {
    const normalized = normalizeSource(source)
    if (emittedSources.has(normalized)) return
    emittedSources.add(normalized)
    cmakeSources.push(`"${normalized}"`)
  })
  return cmakeSources
}

const DEFAULT_PROJECT_HARDWARE = Object.freeze({
  boardId: 'waveshare-esp32p4-wifi6-touch-lcd-7b',
  firmwareFeatures: Object.freeze({
    wifi: true, bluetooth: false, audio: false, sdCard: true, rtc: true,
    usbHost: false, camera: false, settingsLauncher: true,
    wifiManager: true, storageBrowser: true, diagnostics: true,
  }),
  wifiHosted: Object.freeze({
    transport: 'sdio', slot: 1, width: 4, frequencyKHz: 40000,
    clk: 18, cmd: 19, d0: 14, d1: 15, d2: 16, d3: 17,
    reset: 54, resetDelayMs: 1500, txQueueSize: 20, rxQueueSize: 20,
  }),
  sd: Object.freeze({
    host: 'sdmmc', slot: 0, width: 4, frequencyKHz: 40000,
    clk: 43, cmd: 44, d0: 39, d1: 40, d2: 41, d3: 42,
    ldoChannel: 4, ldoVoltageMv: 2500,
  }),
})

const integerSetting = (value, fallback, name, min = 0, max = 100000) => {
  const resolved = value === undefined ? fallback : value
  if (!Number.isInteger(resolved) || resolved < min || resolved > max) {
    throw new Error(`Invalid project hardware setting ${name}: ${resolved}`)
  }
  return resolved
}

function normalizeWifiHosted(value = {}) {
  const defaults = DEFAULT_PROJECT_HARDWARE.wifiHosted
  const transport = value.transport === undefined ? defaults.transport : value.transport
  if (transport !== 'sdio' && transport !== 'spi') {
    throw new Error(`Invalid ESP-Hosted transport: ${transport}`)
  }
  const common = {
    transport,
    frequencyKHz: integerSetting(value.frequencyKHz, defaults.frequencyKHz, 'wifiHosted.frequencyKHz', 1),
    reset: integerSetting(value.reset, defaults.reset, 'wifiHosted.reset'),
    resetDelayMs: integerSetting(value.resetDelayMs, defaults.resetDelayMs, 'wifiHosted.resetDelayMs'),
    txQueueSize: integerSetting(value.txQueueSize, defaults.txQueueSize, 'wifiHosted.txQueueSize', 1),
    rxQueueSize: integerSetting(value.rxQueueSize, defaults.rxQueueSize, 'wifiHosted.rxQueueSize', 1),
  }
  if (transport === 'sdio') return {
    ...common,
    slot: integerSetting(value.slot, defaults.slot, 'wifiHosted.slot', 0, 1),
    width: integerSetting(value.width, defaults.width, 'wifiHosted.width', 1, 4),
    clk: integerSetting(value.clk, defaults.clk, 'wifiHosted.clk'),
    cmd: integerSetting(value.cmd, defaults.cmd, 'wifiHosted.cmd'),
    d0: integerSetting(value.d0, defaults.d0, 'wifiHosted.d0'),
    d1: integerSetting(value.d1, defaults.d1, 'wifiHosted.d1'),
    d2: integerSetting(value.d2, defaults.d2, 'wifiHosted.d2'),
    d3: integerSetting(value.d3, defaults.d3, 'wifiHosted.d3'),
  }
  const spiDefaults = { mode: 3, controller: 1, clk: 9, mosi: 8, miso: 10, cs: 7, handshake: 6, dataReady: 11, reset: 12 }
  return {
    ...common,
    reset: integerSetting(value.reset, spiDefaults.reset, 'wifiHosted.reset'),
    mode: integerSetting(value.mode, spiDefaults.mode, 'wifiHosted.mode', 0, 3),
    controller: integerSetting(value.controller, spiDefaults.controller, 'wifiHosted.controller', 0, 2),
    clk: integerSetting(value.clk, spiDefaults.clk, 'wifiHosted.clk'),
    mosi: integerSetting(value.mosi, spiDefaults.mosi, 'wifiHosted.mosi'),
    miso: integerSetting(value.miso, spiDefaults.miso, 'wifiHosted.miso'),
    cs: integerSetting(value.cs, spiDefaults.cs, 'wifiHosted.cs'),
    handshake: integerSetting(value.handshake, spiDefaults.handshake, 'wifiHosted.handshake'),
    dataReady: integerSetting(value.dataReady, spiDefaults.dataReady, 'wifiHosted.dataReady'),
  }
}

function normalizeSd(value = {}) {
  const d = DEFAULT_PROJECT_HARDWARE.sd
  const host = value.host === undefined ? d.host : value.host
  if (host !== 'sdmmc') throw new Error(`Invalid SD host: ${host}`)
  return {
    host,
    slot: integerSetting(value.slot, d.slot, 'sd.slot', 0, 1),
    width: integerSetting(value.width, d.width, 'sd.width', 1, 4),
    frequencyKHz: integerSetting(value.frequencyKHz, d.frequencyKHz, 'sd.frequencyKHz', 1),
    clk: integerSetting(value.clk, d.clk, 'sd.clk'), cmd: integerSetting(value.cmd, d.cmd, 'sd.cmd'),
    d0: integerSetting(value.d0, d.d0, 'sd.d0'), d1: integerSetting(value.d1, d.d1, 'sd.d1'),
    d2: integerSetting(value.d2, d.d2, 'sd.d2'), d3: integerSetting(value.d3, d.d3, 'sd.d3'),
    ldoChannel: integerSetting(value.ldoChannel, d.ldoChannel, 'sd.ldoChannel', 0, 4),
    ldoVoltageMv: integerSetting(value.ldoVoltageMv, d.ldoVoltageMv, 'sd.ldoVoltageMv', 500, 5000),
  }
}

function normalizeProjectHardware(project) {
  const supplied = project && typeof project === 'object' ? project : {}
  if (
    supplied.boardId &&
    supplied.boardId !== DEFAULT_PROJECT_HARDWARE.boardId
  ) {
    throw new Error(`Unsupported board profile: ${supplied.boardId}`)
  }
  const features = {
    ...DEFAULT_PROJECT_HARDWARE.firmwareFeatures,
    ...(
      supplied.firmwareFeatures && typeof supplied.firmwareFeatures === 'object'
        ? supplied.firmwareFeatures
        : {}
    ),
  }
  Object.keys(features).forEach(key => { features[key] = features[key] === true })
  features.bluetooth = false
  if (!features.wifi) features.wifiManager = false
  if (!features.sdCard) features.storageBrowser = false
  if (!features.settingsLauncher) {
    features.wifiManager = false
    features.storageBrowser = false
    features.diagnostics = false
  }
  return {
    boardId: DEFAULT_PROJECT_HARDWARE.boardId,
    firmwareFeatures: features,
    wifiHosted: normalizeWifiHosted(supplied.wifiHosted),
    sd: normalizeSd(supplied.sd),
  }
}

function generateSdkconfigDefaults(project, baseline = '') {
  const p = normalizeProjectHardware(project)
  const keep = String(baseline).split(/\r?\n/).filter(line =>
    line !== '# Generated from ForgeUI project hardware profile.' &&
    !/^CONFIG_ESP_HOSTED_/.test(line) &&
    !/^# CONFIG_ESP_HOSTED_/.test(line) &&
    !/^CONFIG_ESP_(SPI|SDIO)_(HOST_INTERFACE|PRIV_|MODE|CONTROLLER|GPIO|CLK_FREQ|TX_Q_SIZE|RX_Q_SIZE)/.test(line) &&
    !/^# CONFIG_ESP_(SPI|SDIO)_HOST_INTERFACE/.test(line) &&
    !/^CONFIG_ESP_WIFI_REMOTE_/.test(line) &&
    !/^CONFIG_SLAVE_IDF_TARGET_/.test(line) &&
    !/^CONFIG_FORGEUI_SD_/.test(line)
  )
  const lines = [...keep, '', '# Generated from ForgeUI project hardware profile.']
  if (p.firmwareFeatures.wifi) {
    const w = p.wifiHosted
    lines.push('CONFIG_ESP_HOSTED_ENABLED=y', 'CONFIG_ESP_HOSTED_IDF_SLAVE_TARGET="esp32c6"')
    if (w.transport === 'sdio') {
      lines.push('CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y', '# CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE is not set',
        `CONFIG_ESP_HOSTED_SDIO_${w.width}_BIT_BUS=y`,
        `CONFIG_ESP_HOSTED_SDIO_CLOCK_FREQ_KHZ=${w.frequencyKHz}`,
        `CONFIG_ESP_HOSTED_SDIO_PIN_CLK=${w.clk}`,
        `CONFIG_ESP_HOSTED_SDIO_PIN_CMD=${w.cmd}`,
        `CONFIG_ESP_HOSTED_SDIO_PIN_D0=${w.d0}`,
        `CONFIG_ESP_HOSTED_SDIO_PRIV_PIN_D1_4BIT_BUS=${w.d1}`,
        `CONFIG_ESP_HOSTED_SDIO_PIN_D2=${w.d2}`,
        `CONFIG_ESP_HOSTED_SDIO_PIN_D3=${w.d3}`,
        `CONFIG_ESP_HOSTED_SDIO_GPIO_RESET_SLAVE=${w.reset}`,
        `CONFIG_ESP_HOSTED_SDIO_TX_Q_SIZE=${w.txQueueSize}`, `CONFIG_ESP_HOSTED_SDIO_RX_Q_SIZE=${w.rxQueueSize}`,
        '# CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_NONE is not set',
        '# CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_MAX_SIZE is not set',
        'CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_STREAMING_MODE=y')
    } else {
      lines.push('CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y', '# CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE is not set',
        `CONFIG_ESP_HOSTED_SPI_PRIV_MODE_${w.mode}_ESP32XX=y`, `CONFIG_ESP_HOSTED_SPI_MODE=${w.mode}`,
        `CONFIG_ESP_HOSTED_SPI_CONTROLLER=${w.controller}`, `CONFIG_ESP_HOSTED_SPI_GPIO_CLK=${w.clk}`,
        `CONFIG_ESP_HOSTED_SPI_GPIO_MOSI=${w.mosi}`, `CONFIG_ESP_HOSTED_SPI_GPIO_MISO=${w.miso}`,
        `CONFIG_ESP_HOSTED_SPI_GPIO_CS=${w.cs}`, `CONFIG_ESP_HOSTED_SPI_GPIO_HANDSHAKE=${w.handshake}`,
        `CONFIG_ESP_HOSTED_SPI_GPIO_DATA_READY=${w.dataReady}`, `CONFIG_ESP_HOSTED_SPI_GPIO_RESET_SLAVE=${w.reset}`,
        `CONFIG_ESP_HOSTED_SPI_CLK_FREQ=${Math.round(w.frequencyKHz / 1000)}`,
        `CONFIG_ESP_HOSTED_SPI_TX_Q_SIZE=${w.txQueueSize}`, `CONFIG_ESP_HOSTED_SPI_RX_Q_SIZE=${w.rxQueueSize}`)
    }
    lines.push('CONFIG_ESP_WIFI_REMOTE_ENABLED=y', 'CONFIG_ESP_WIFI_REMOTE_LIBRARY_HOSTED=y', 'CONFIG_SLAVE_IDF_TARGET_ESP32C6=y')
  } else {
    lines.push('# CONFIG_ESP_HOSTED_ENABLED is not set', '# CONFIG_ESP_WIFI_REMOTE_ENABLED is not set')
  }
  const s = p.sd
  lines.push(p.firmwareFeatures.sdCard ? 'CONFIG_FORGEUI_SD_ENABLED=y' : '# CONFIG_FORGEUI_SD_ENABLED is not set',
    `CONFIG_FORGEUI_SD_SLOT=${s.slot}`, `CONFIG_FORGEUI_SD_WIDTH=${s.width}`,
    `CONFIG_FORGEUI_SD_FREQ_KHZ=${s.frequencyKHz}`, `CONFIG_FORGEUI_SD_CLK=${s.clk}`,
    `CONFIG_FORGEUI_SD_CMD=${s.cmd}`, `CONFIG_FORGEUI_SD_D0=${s.d0}`, `CONFIG_FORGEUI_SD_D1=${s.d1}`,
    `CONFIG_FORGEUI_SD_D2=${s.d2}`, `CONFIG_FORGEUI_SD_D3=${s.d3}`,
    `CONFIG_FORGEUI_SD_LDO_CHANNEL=${s.ldoChannel}`, `CONFIG_FORGEUI_SD_LDO_MV=${s.ldoVoltageMv}`)
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

function validateHardwareArtifacts(project, defaults, featureHeader, boardId) {
  const p = normalizeProjectHardware(project)
  const errors = []
  if (boardId !== p.boardId) errors.push(`board profile ${boardId} != ${p.boardId}`)
  const expectedTransport = p.wifiHosted.transport === 'sdio' ? 'CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y' : 'CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y'
  if (p.firmwareFeatures.wifi && !defaults.includes(expectedTransport)) errors.push(`selected Wi-Fi transport ${p.wifiHosted.transport} missing from sdkconfig.defaults`)
  if (featureHeader.includes(`#define FG_FEATURE_WIFI ${p.firmwareFeatures.wifi ? 0 : 1}`)) errors.push('Wi-Fi feature header disagrees with project profile')
  if (featureHeader.includes(`#define FG_FEATURE_SD_CARD ${p.firmwareFeatures.sdCard ? 0 : 1}`)) errors.push('SD feature header disagrees with project profile')
  if (featureHeader.includes(`#define FG_FEATURE_RTC ${p.firmwareFeatures.rtc ? 0 : 1}`)) errors.push('RTC feature header disagrees with project profile')
  const expectedHardwareLines = generateSdkconfigDefaults(p).split('\n').filter(line =>
    /^(CONFIG_ESP_HOSTED_|# CONFIG_ESP_HOSTED_|CONFIG_ESP_WIFI_REMOTE_|# CONFIG_ESP_WIFI_REMOTE_|CONFIG_SLAVE_IDF_TARGET_|CONFIG_FORGEUI_SD_)/.test(line)
  )
  expectedHardwareLines.forEach(line => {
    if (!defaults.split(/\r?\n/).includes(line)) errors.push(`sdkconfig.defaults missing ${line}`)
  })
  const oppositeTransport = p.wifiHosted.transport === 'sdio'
    ? 'CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y'
    : 'CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y'
  if (p.firmwareFeatures.wifi && defaults.includes(oppositeTransport)) {
    errors.push(`sdkconfig.defaults also enables conflicting ${oppositeTransport}`)
  }
  if (errors.length) throw new Error(`Project hardware export mismatch: ${errors.join('; ')}`)
  return true
}

function shouldCopyFirmwareSource(src) {
  const blocked = new Set(['build', '.vscode', '.vs', 'managed_components', 'sdkconfig'])
  return !blocked.has(path.basename(src).toLowerCase())
}

function generateFeatureHeader(project) {
  const features = normalizeProjectHardware(project).firmwareFeatures
  const flag = key => features[key] ? 1 : 0
  return `#pragma once

/* Generated by ForgeUI Studio. Do not edit. */
#define FG_FEATURE_WIFI ${flag('wifi')}
#define FG_FEATURE_BLUETOOTH ${flag('bluetooth')}
#define FG_FEATURE_AUDIO ${flag('audio')}
#define FG_FEATURE_SD_CARD ${flag('sdCard')}
#define FG_FEATURE_RTC ${flag('rtc')}
#define FG_FEATURE_USB_HOST ${flag('usbHost')}
#define FG_FEATURE_CAMERA ${flag('camera')}
#define FG_FEATURE_SETTINGS ${flag('settingsLauncher')}
#define FG_FEATURE_WIFI_MANAGER ${flag('wifiManager')}
#define FG_FEATURE_STORAGE_BROWSER ${flag('storageBrowser')}
#define FG_FEATURE_DIAGNOSTICS ${flag('diagnostics')}
`
}

function generateIdfComponentManifest(project) {
  const features = normalizeProjectHardware(project).firmwareFeatures
  const wifiDependencies = features.wifi
    ? `

  espressif/esp_wifi_remote:
    version: "0.14.*"

  espressif/esp_hosted:
    version: "1.4.*"`
    : ''
  return `dependencies:

  lvgl/lvgl:
    version: 9.2.*
    public: true${wifiDependencies}
`
}

function resolveFirmwareBuild(project) {
  const normalized = normalizeProjectHardware(project)
  const f = normalized.firmwareFeatures
  const sources = [
    '"main.c"', '"01_FG_Runtime.c"', '"05_FG_RAM_Probe.c"', '"20_RTC.c"',
  ]
  if (f.audio) sources.push('"30_Audio.c"')
  if (f.wifi) sources.push('"30_WIFI.c"')
  if (f.sdCard) sources.push('"40_SD.c"')
  if (f.diagnostics) sources.push('"50_DIAGNOSTICS.c"')
  sources.push('"90_Studio_Export.c"', '"95_UserEvents.c"')

  const components = ['nvs_flash', 'driver', 'esp_event', 'esp_app_format']
  if (f.wifi) {
    components.push('esp_netif', 'esp_wifi', 'esp_wifi_remote', 'esp_hosted')
  }
  if (f.sdCard) components.push('fatfs', 'sdmmc')
  if (f.diagnostics) components.push('spi_flash')
  components.push('waveshare__esp32_p4_wifi6_touch_lcd_7b')
  return { ...normalized, sources, components }
}

function appendHardwareExample01Source(
  sources,
  mainDir,
  publicApiDeclarations = [],
  userEventHooks = [],
) {
  const sourceName = '96_Hardware_Example_01.c'
  const requiredDeclarations = new Set([
    'void FG_Set_Indicator1(bool on);',
    'void FG_Set_Indicator2(bool on);',
  ])
  const requiredHooks = new Set([
    'FG_On_LED1_Toggle_Changed',
    'FG_On_LED2_Toggle_Changed',
  ])
  const hasContracts = [...requiredDeclarations].every(contract =>
    publicApiDeclarations.includes(contract)
  ) && [...requiredHooks].every(hook => userEventHooks.includes(hook))
  const sourceEntry = `"${sourceName}"`
  if (
    hasContracts &&
    fs.existsSync(path.join(mainDir, sourceName)) &&
    !sources.includes(sourceEntry)
  ) sources.push(sourceEntry)
  return sources
}

function appendHardwareExample02Source(sources, mainDir, publicApiDeclarations = [], userEventHooks = []) {
  const sourceName = '97_Hardware_Example_02_Discovery.c'
  const declarations = ['FG_Set_FRAM_Status_Text', 'FG_Set_FRAM_Address_Text',
    'FG_Set_FRAM_Value_Text', 'FG_Set_FRAM_Verify_Text']
  const hooks = ['FG_On_WRITE_TEST_Clicked', 'FG_On_READ_TEST_Clicked']
  const enabled = declarations.every(name => publicApiDeclarations.some(value => value.includes(name)))
    && hooks.every(name => userEventHooks.includes(name))
  const entry = `"${sourceName}"`
  if (enabled && fs.existsSync(path.join(mainDir, sourceName)) && !sources.includes(entry)) sources.push(entry)
  return sources
}

function appendHardwareExample03Source(sources, mainDir, publicApiDeclarations = []) {
  const sourceName = '98_Hardware_Example_03_Probe.c'
  const declarations = ['FG_Set_NFC_Device_Text', 'FG_Set_NFC_Interface_Text',
    'FG_Set_NFC_Card_Text', 'FG_Set_NFC_UID_Text', 'FG_Set_NFC_Read_Count_Text']
  const enabled = declarations.every(name =>
    publicApiDeclarations.some(value => value.includes(name)))
  const entry = `"${sourceName}"`
  if (enabled && fs.existsSync(path.join(mainDir, sourceName)) && !sources.includes(entry)) sources.push(entry)
  return sources
}

function appendHardwareExample04Source(sources, mainDir, publicApiDeclarations = []) {
  const sourceName = '99_Hardware_Example_04_Weather.c'
  const enabled = publicApiDeclarations.includes(
    'void FG_Set_Weather_Temperature_Text(const char * text);'
  )
  const entry = `"${sourceName}"`
  if (enabled && fs.existsSync(path.join(mainDir, sourceName)) && !sources.includes(entry)) {
    sources.push(entry)
  }
  return sources
}

function appendHardwareExample05Source(sources, mainDir, publicApiDeclarations = []) {
  const sourceName = '99_Hardware_Example_05_GPS.c'
  const declarations = ['FG_Set_GPS_UART_Text', 'FG_Set_GPS_NMEA_Text',
    'FG_Set_GPS_Fix_Text', 'FG_Set_GPS_Satellites_Text',
    'FG_Set_GPS_Latitude_Text', 'FG_Set_GPS_Longitude_Text',
    'FG_Set_GPS_Altitude_Text', 'FG_Set_GPS_Speed_Text',
    'FG_Set_GPS_UTC_Text', 'FG_Set_GPS_HDOP_Text']
  const enabled = declarations.every(name =>
    publicApiDeclarations.some(value => value.includes(name)))
  const entry = `"${sourceName}"`
  if (enabled && fs.existsSync(path.join(mainDir, sourceName)) && !sources.includes(entry)) {
    sources.push(entry)
  }
  return sources
}

function selectedHardwareExample(publicApiDeclarations = [], userEventHooks = []) {
  const has01 = ['void FG_Set_Indicator1(bool on);', 'void FG_Set_Indicator2(bool on);']
    .every(value => publicApiDeclarations.includes(value))
    && ['FG_On_LED1_Toggle_Changed', 'FG_On_LED2_Toggle_Changed']
      .every(value => userEventHooks.includes(value))
  const has02 = ['FG_Set_FRAM_Status_Text', 'FG_Set_FRAM_Address_Text',
    'FG_Set_FRAM_Value_Text', 'FG_Set_FRAM_Verify_Text']
    .every(name => publicApiDeclarations.some(value => value.includes(name)))
    && ['FG_On_WRITE_TEST_Clicked', 'FG_On_READ_TEST_Clicked']
      .every(value => userEventHooks.includes(value))
  const has03 = ['FG_Set_NFC_Device_Text', 'FG_Set_NFC_Interface_Text',
    'FG_Set_NFC_Card_Text', 'FG_Set_NFC_UID_Text', 'FG_Set_NFC_Read_Count_Text']
    .every(name => publicApiDeclarations.some(value => value.includes(name)))
  const has04 = publicApiDeclarations.includes(
    'void FG_Set_Weather_Temperature_Text(const char * text);'
  )
  const has05 = ['FG_Set_GPS_UART_Text', 'FG_Set_GPS_NMEA_Text',
    'FG_Set_GPS_Fix_Text', 'FG_Set_GPS_Satellites_Text',
    'FG_Set_GPS_Latitude_Text', 'FG_Set_GPS_Longitude_Text',
    'FG_Set_GPS_Altitude_Text', 'FG_Set_GPS_Speed_Text',
    'FG_Set_GPS_UTC_Text', 'FG_Set_GPS_HDOP_Text']
    .every(name => publicApiDeclarations.some(value => value.includes(name)))
  if ([has01, has02, has03, has04, has05].filter(Boolean).length > 1) {
    throw new Error('Hardware Examples are exclusive; project contains cumulative example contracts')
  }
  return has01 ? 1 : has02 ? 2 : has03 ? 3 : has04 ? 4 : has05 ? 5 : 0
}

function generateHardwareExampleHeader(publicApiDeclarations = [], userEventHooks = []) {
  const selected = selectedHardwareExample(publicApiDeclarations, userEventHooks)
  return `#pragma once

/* Generated by ForgeUI Studio. Exactly one Hardware Example may be active. */
#define FG_HARDWARE_EXAMPLE_SELECTED ${selected}
#define FG_HARDWARE_EXAMPLE_01_ENABLED ${selected === 1 ? 1 : 0}
#define FG_HARDWARE_EXAMPLE_02_ENABLED ${selected === 2 ? 1 : 0}
#define FG_HARDWARE_EXAMPLE_03_ENABLED ${selected === 3 ? 1 : 0}
#define FG_HARDWARE_EXAMPLE_04_ENABLED ${selected === 4 ? 1 : 0}
#define FG_HARDWARE_EXAMPLE_05_ENABLED ${selected === 5 ? 1 : 0}
`
}

function applyHardwareExampleBuildRequirements(firmwareBuild, selected) {
  if (selected !== 4) return firmwareBuild
  for (const component of ['esp_http_client', 'json', 'mbedtls']) {
    if (!firmwareBuild.components.includes(component)) {
      firmwareBuild.components.push(component)
    }
  }
  return firmwareBuild
}

function validateSpinboxHelperGeometry(code, diagnostics) {
  const spinboxPattern =
    /([A-Za-z_][A-Za-z0-9_]*)\s*=\s*lv_spinbox_create\(([A-Za-z_][A-Za-z0-9_]*)\);/g
  const geometry = object => {
    const escaped = object.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const match = code.match(new RegExp(
      `lv_obj_set_pos\\(${escaped},\\s*(-?\\d+),\\s*(-?\\d+)\\);\\s*`
      + `lv_obj_set_size\\(${escaped},\\s*(\\d+),\\s*(\\d+)\\);`
    ))
    return match ? match.slice(1).map(Number) : null
  }

  for (const match of code.matchAll(spinboxPattern)) {
    const object = match[1]
    const parent = match[2]
    const field = geometry(object)
    const increment = `${object}_increment_button`
    const decrement = `${object}_decrement_button`
    const upper = geometry(increment)
    const lower = geometry(decrement)

    for (const [direction, button, buttonGeometry] of [
      ['increment', increment, upper],
      ['decrement', decrement, lower],
    ]) {
      if (!code.includes(`lv_obj_t * ${button} = lv_button_create(${parent});`)) {
        diagnostics.push(`${object} ${direction} helper is missing or has the wrong parent`)
      }
      if (!buttonGeometry || buttonGeometry[2] <= 0 || buttonGeometry[3] <= 0) {
        diagnostics.push(`${object} ${direction} helper has missing or zero geometry`)
      }
      if (!code.includes(`lv_obj_add_flag(${button}, LV_OBJ_FLAG_CLICKABLE);`)) {
        diagnostics.push(`${object} ${direction} helper is not explicitly clickable`)
      }
      if (!code.includes(`lv_obj_move_foreground(${button});`)) {
        diagnostics.push(`${object} ${direction} helper is not moved to foreground`)
      }
      const callback = code.match(new RegExp(
        `lv_obj_add_event_cb\\(${button},\\s*([A-Za-z_][A-Za-z0-9_]*),\\s*LV_EVENT_CLICKED,\\s*NULL\\);`
      ))
      const callbackBody = callback && code.match(new RegExp(
        `static void\\s+${callback[1]}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}`
      ))
      if (
        !callbackBody ||
        !callbackBody[1].includes(`lv_spinbox_${direction}(${object});`)
      ) {
        diagnostics.push(`${object} ${direction} helper callback targets the wrong Spinbox`)
      }
    }

    if (!field || !upper || !lower) continue
    const [fieldX, fieldY, fieldWidth, fieldHeight] = field
    const [upperX, upperY, buttonWidth, upperHeight] = upper
    const [lowerX, lowerY, lowerWidth, lowerHeight] = lower
    if (
      upperX !== fieldX + fieldWidth ||
      lowerX !== upperX ||
      upperY !== fieldY ||
      lowerY !== upperY + upperHeight ||
      lowerWidth !== buttonWidth ||
      upperHeight + lowerHeight !== fieldHeight
    ) {
      diagnostics.push(`${object} helper geometry lies outside its component bounds`)
    }
  }
}

function validateExportPayload(payload, options = {}) {
  const code = typeof payload.code === 'string' ? payload.code : ''
  const rawSources = Array.isArray(payload.assetSources)
    ? payload.assetSources
    : []
  const diagnostics = []
  const seenSources = new Set()
  const seenSymbols = new Set()
  const mainDir = path.resolve(
    options.mainDir || path.resolve(__dirname, '../firmware/ForgeUI-One/main')
  )
  const assetSources = []

  materializeCanonicalAssetSources(rawSources, { mainDir })

  if (!code.trim()) diagnostics.push('Generated C code is empty')
  validateSpinboxHelperGeometry(code, diagnostics)

  rawSources.forEach(rawSource => {
    const source = String(rawSource)
    const normalized = source.replace(/\\/g, '/')
    if (
      source !== normalized ||
      path.posix.isAbsolute(normalized) ||
      /^[A-Za-z]:/.test(normalized) ||
      normalized.split('/').includes('..') ||
      !normalized.endsWith('.c')
    ) {
      diagnostics.push(`Invalid asset source: ${source}`)
      return
    }
    if (seenSources.has(normalized)) {
      diagnostics.push(`Duplicate asset source: ${normalized}`)
      return
    }
    seenSources.add(normalized)

    const sourcePath = path.resolve(mainDir, normalized)
    if (!sourcePath.startsWith(`${mainDir}${path.sep}`)) {
      diagnostics.push(`Asset source escapes firmware main: ${normalized}`)
      return
    }
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      diagnostics.push(`Generated C file missing: ${normalized}`)
      return
    }

    const symbol = path.basename(normalized, '.c')
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(symbol)) {
      diagnostics.push(`Invalid generated symbol: ${symbol}`)
      return
    }
    if (seenSymbols.has(symbol)) {
      diagnostics.push(`Duplicate generated symbol: ${symbol}`)
      return
    }
    seenSymbols.add(symbol)

    const sourceText = fs.readFileSync(sourcePath, 'utf8')
    if (!sourceText.includes(symbol)) {
      diagnostics.push(`Symbol ${symbol} is missing from ${normalized}`)
    }
    if (!code.includes(symbol)) {
      diagnostics.push(`Asset source is not referenced by generated code: ${normalized}`)
    }
    assetSources.push(normalized)
  })

  if (diagnostics.length > 0) {
    const error = new Error(
      ['Export Validation Failed', 'Asset Sources', ...diagnostics].join('\n')
    )
    error.diagnostics = diagnostics
    throw error
  }
  return { code, assetSources }
}

function generateStudioExportHeader(publicApiDeclarations, hasFiRuntime = false) {
  const declarations = normalizePublicApiDeclarations(
    publicApiDeclarations
  )

  return `#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>
${hasFiRuntime ? '#include "96_FiRuntime.h"' : ''}

#ifdef __cplusplus
extern "C" {
#endif

void fg_studio_export_create(lv_obj_t *parent);
${declarations.join('\n')}

#ifdef __cplusplus
}
#endif
`
}

function generateUserEventFiles(userEventHooks, publicApiDeclarations = [], userEventContracts = []) {
  const explicitContracts = new Map(
    (Array.isArray(userEventContracts) ? userEventContracts : [])
      .filter(contract => contract &&
        /^FG_On_[A-Za-z0-9_]+$/.test(String(contract.name || '')) &&
        /^(?:void|float value|int32_t alarm_id|int32_t alarm_id, FG_Alarm_Priority priority|const char \* channel, FG_IO_Type io_type)$/.test(String(contract.parameters || '')))
      .map(contract => [String(contract.name), String(contract.parameters)])
  )
  const booleanChanged = new Set()
  const checkedChanged = new Set()
  const checkboxCheckedChanged = new Set()
  const radioSelectedChanged = new Set()
  const integerChanged = new Set()
  const floatChanged = new Set()
  const integerPointAdded = new Set()
  const cleared = new Set()
  const shown = new Set()
  const hidden = new Set()
  const closed = new Set()
  const dateChanged = new Set()
  const rollerChanged = new Set()
  const tabViewChanged = new Set()
  const tileViewChanged = new Set()
  const selectChanged = new Set()
  const textChanged = new Set()
  normalizePublicApiDeclarations(publicApiDeclarations)
    .forEach((declaration) => {
      const addMatch = declaration.match(
        /^void FG_Add_([A-Za-z0-9_]+)_Point\(int32_t value\);$/
      )
      if (addMatch) {
        integerPointAdded.add(`FG_On_${addMatch[1]}_Point_Added`)
        return
      }
      const clearMatch = declaration.match(
        /^void FG_Clear_([A-Za-z0-9_]+)\(void\);$/
      )
      if (clearMatch) {
        cleared.add(`FG_On_${clearMatch[1]}_Cleared`)
        return
      }
      const visibilityMatch = declaration.match(
        /^void FG_(Show|Hide|Close)_([A-Za-z0-9_]+)\(void\);$/
      )
      if (visibilityMatch) {
        const ending = visibilityMatch[1] === 'Show'
          ? 'Shown'
          : visibilityMatch[1] === 'Close' ? 'Closed' : 'Hidden'
        const hook = `FG_On_${visibilityMatch[2]}_${ending}`
        ;(visibilityMatch[1] === 'Show'
          ? shown
          : visibilityMatch[1] === 'Close' ? closed : hidden).add(hook)
        return
      }
      const dateMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Date\(uint16_t year, uint8_t month, uint8_t day\);$/
      )
      if (dateMatch) {
        dateChanged.add(`FG_On_${dateMatch[1]}_Date_Changed`)
        return
      }
      const rollerMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Selected\(uint32_t (?:index|button_index)\);$/
      )
      if (rollerMatch) {
        rollerChanged.add(`FG_On_${rollerMatch[1]}_Changed`)
        return
      }
      const selectMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Selected_Index\(uint32_t index\);$/
      )
      if (selectMatch) {
        selectChanged.add(`FG_On_${selectMatch[1]}_Changed`)
        return
      }
      const radioMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Selected\(bool selected\);$/
      )
      if (radioMatch) {
        radioSelectedChanged.add(`FG_On_${radioMatch[1]}_Changed`)
        return
      }
      const tabViewMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Selected\(uint32_t tab_index\);$/
      )
      if (tabViewMatch) {
        tabViewChanged.add(`FG_On_${tabViewMatch[1]}_Changed`)
        return
      }
      const tileViewMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Selected\(uint32_t column, uint32_t row\);$/
      )
      if (tileViewMatch) {
        tileViewChanged.add(`FG_On_${tileViewMatch[1]}_Changed`)
        return
      }
      const textMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Text\(const char \* text\);$/
      )
      if (textMatch) {
        textChanged.add(`FG_On_${textMatch[1]}_Changed`)
        return
      }
      const checkedMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Checked\(bool checked\);$/
      )
      if (checkedMatch) {
        const hook = `FG_On_${checkedMatch[1]}_Changed`
        if (/(?:^|_)Checkbox(?:_|$)/.test(checkedMatch[1])) {
          checkboxCheckedChanged.add(hook)
        } else {
          checkedChanged.add(hook)
        }
        return
      }
      const valueMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Value\(int32_t value\);$/
      )
      if (valueMatch) {
        integerChanged.add(`FG_On_${valueMatch[1]}_Changed`)
        return
      }
      const floatValueMatch = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)_Value\(float value\);$/
      )
      if (floatValueMatch) {
        floatChanged.add(`FG_On_${floatValueMatch[1]}_Value_Changed`)
        return
      }
      const match = declaration.match(
        /^void FG_Set_([A-Za-z0-9_]+)\((bool|int32_t) /
      )
      if (!match) return
      const hook = `FG_On_${match[1]}_Changed`
      if (match[2] === 'int32_t') integerChanged.add(hook)
      else booleanChanged.add(hook)
    })
  const uniqueHooks = Array.from(
    new Set(
      (Array.isArray(userEventHooks)
        ? userEventHooks
        : []
      )
        .map((hook) => String(hook || '').trim())
        .filter((hook) => /^FG_On_[A-Za-z0-9_]+$/.test(hook))
    )
  )
  const relayChannelChanged = new Set(uniqueHooks.filter(hook =>
    /_Channel_Changed$/.test(hook)
  ))
  const relayMasterChanged = new Set(uniqueHooks.filter(hook =>
    /_Master_Changed$/.test(hook)
  ))

  

  const declarations = uniqueHooks
    .map((hook) => explicitContracts.has(hook)
      ? `void ${hook}(${explicitContracts.get(hook)});`
      : relayChannelChanged.has(hook)
      ? `void ${hook}(uint32_t channel, bool enabled);`
      : relayMasterChanged.has(hook)
        ? `void ${hook}(bool enabled);`
      : floatChanged.has(hook)
        ? `void ${hook}(float value);`
      : integerChanged.has(hook) || integerPointAdded.has(hook)
      ? `void ${hook}(int32_t value);`
      : cleared.has(hook)
        ? `void ${hook}(void);`
      : shown.has(hook) || hidden.has(hook) || closed.has(hook)
        ? `void ${hook}(void);`
      : hook.endsWith('_Button_Pressed')
        ? `void ${hook}(uint32_t index, const char * text);`
      : hook.endsWith('_Button_Selected')
        ? `void ${hook}(uint32_t index, const char * text);`
      : hook.endsWith('_Item_Clicked')
        ? `void ${hook}(uint32_t index, const char * text);`
      : dateChanged.has(hook)
        ? `void ${hook}(uint16_t year, uint8_t month, uint8_t day);`
      : tabViewChanged.has(hook)
        ? `void ${hook}(uint32_t tab_index);`
      : tileViewChanged.has(hook)
        ? `void ${hook}(uint32_t column, uint32_t row);`
      : selectChanged.has(hook)
        ? `void ${hook}(uint32_t index, const char * text);`
      : textChanged.has(hook)
        ? `void ${hook}(const char * text);`
      : rollerChanged.has(hook)
        ? `void ${hook}(uint32_t index, const char * text);`
      : checkedChanged.has(hook) || checkboxCheckedChanged.has(hook)
        ? `void ${hook}(bool checked);`
      : radioSelectedChanged.has(hook)
        ? `void ${hook}(bool selected);`
      : hook.endsWith('_Toggled') || booleanChanged.has(hook)
      ? `void ${hook}(bool enabled);`
      : hook.endsWith('_Changed') ? `void ${hook}(fg_three_way_state_t state);` : `void ${hook}(void);`)
    .join('\n')

  const explicitDefinition = (hook, parameters) => {
    if (parameters === 'void') return `void ${hook}(void)\n{\n}`
    const unused = parameters.split(',').map(parameter => {
      const match = parameter.trim().match(/([A-Za-z_][A-Za-z0-9_]*)$/)
      return match ? `    (void)${match[1]};` : ''
    }).filter(Boolean).join('\n')
    return `void ${hook}(${parameters})\n{\n${unused}\n}`
  }
  const definitions = uniqueHooks
    .map((hook) => explicitContracts.has(hook)
      ? explicitDefinition(hook, explicitContracts.get(hook))
      : relayChannelChanged.has(hook)
      ? `void ${hook}(uint32_t channel, bool enabled)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Channel_Changed$/g, '').replace(/_/g, ' ')} channel %lu: %s\\n",
           (unsigned long)channel,
           enabled ? "ON" : "OFF");
}`
      : relayMasterChanged.has(hook)
        ? `void ${hook}(bool enabled)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Master_Changed$/g, '').replace(/_/g, ' ')} master: %s\\n",
           enabled ? "ON" : "OFF");
}`
      : floatChanged.has(hook)
        ? `void ${hook}(float value)
{
    /* Bind semantic PWM value to developer-owned hardware here. */
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Value_Changed$/g, '').replace(/_/g, ' ')} value: %.3f\\n", (double)value);
}`
      : integerPointAdded.has(hook)
      ? `void ${hook}(int32_t value)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Point_Added$/g, '').replace(/_/g, ' ')} point added: %ld\\n",
           (long)value);
}`
      : cleared.has(hook)
        ? `void ${hook}(void)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Cleared$/g, '').replace(/_/g, ' ')} cleared\\n");
}`
      : shown.has(hook) || hidden.has(hook) || closed.has(hook)
        ? `void ${hook}(void)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_(?:Shown|Hidden|Closed)$/g, '').replace(/_/g, ' ')} ${shown.has(hook) ? 'shown' : closed.has(hook) ? 'closed' : 'hidden'}\\n");
}`
      : hook.endsWith('_Button_Pressed')
        ? `void ${hook}(uint32_t index, const char * text)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Button_Pressed$/g, '').replace(/_/g, ' ')} button: %lu - %s\\n",
        (unsigned long)index,
        text ? text : "");
}`
      : hook.endsWith('_Button_Selected')
        ? `void ${hook}(uint32_t index, const char * text)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Button_Selected$/g, '').replace(/_/g, ' ')} button: %lu - %s\\n",
        (unsigned long)index,
        text ? text : "");
}`
      : hook.endsWith('_Item_Clicked')
        ? `void ${hook}(uint32_t index, const char * text)
{
    printf(
        "[ForgeUI User Event]\\n${hook.replace(/^FG_On_|_Item_Clicked$/g, '').replace(/_/g, ' ')}\\nItem %lu\\n%s\\n",
        (unsigned long)index,
        text ? text : "");
}`
      : dateChanged.has(hook)
        ? `void ${hook}(uint16_t year, uint8_t month, uint8_t day)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Date_Changed$/g, '').replace(/_/g, ' ')} date changed: %04u-%02u-%02u\\n",
        year,
        month,
        day);
}`
      : tabViewChanged.has(hook)
        ? `void ${hook}(uint32_t tab_index)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %lu\\n",
        (unsigned long)tab_index);
}`
      : tileViewChanged.has(hook)
        ? `void ${hook}(uint32_t column, uint32_t row)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: column %lu, row %lu\\n",
        (unsigned long)column,
        (unsigned long)row);
}`
      : selectChanged.has(hook)
        ? `void ${hook}(uint32_t index, const char * text)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %lu - %s\\n",
           (unsigned long)index,
           text ? text : "");
}`
      : textChanged.has(hook)
        ? `void ${hook}(const char * text)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %s\\n",
           text ? text : "");
}`
      : rollerChanged.has(hook)
        ? `void ${hook}(uint32_t index, const char * text)
{
    printf(
        "[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %lu - %s\\n",
        (unsigned long)index,
        text ? text : "");
}`
      : integerChanged.has(hook)
      ? `void ${hook}(int32_t value)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %ld\\n",
           (long)value);
}`
      : checkboxCheckedChanged.has(hook)
      ? `void ${hook}(bool checked)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %s\\n",
           checked ? "CHECKED" : "UNCHECKED");
}`
      : radioSelectedChanged.has(hook)
      ? `void ${hook}(bool selected)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %s\\n",
           selected ? "SELECTED" : "UNSELECTED");
}`
      : checkedChanged.has(hook)
      ? `void ${hook}(bool checked)
{
    printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %s\\n",
           checked ? "ON" : "OFF");
}`
      : hook.endsWith('_Toggled') || booleanChanged.has(hook)
      ? `void ${hook}(bool enabled)
{
    ${booleanChanged.has(hook)
      ? `printf("[ForgeUI User Event] ${hook.replace(/^FG_On_|_Changed$/g, '').replace(/_/g, ' ')} changed: %s\\n",
           enabled ? "ON" : "OFF");`
      : `printf("[ForgeUI User Event] ${hook}: %s\\n", enabled ? "ON" : "OFF");`}
}`
      : hook.endsWith('_Changed') ? `void ${hook}(fg_three_way_state_t state)
{
    const char * text = state == FG_THREE_WAY_LEFT ? "LEFT" : state == FG_THREE_WAY_RIGHT ? "RIGHT" : "CENTER";
    printf("[ForgeUI User Event] ${hook}: %s\\n", text);
}` : `void ${hook}(void)
{
    printf("[ForgeUI User Event] ${hook}\\n");
}`
    )
    .join('\n\n')

  const header =
`/*
 * ForgeUI User Event Hooks
 *
 * LIVE STUDIO FIRMWARE:
 * This file may be regenerated by ForgeUI Studio for physical testing.
 *
 * STANDALONE EXPORT:
 * After manual export to C:\\ForgeUI-Exports, the exported copy is
 * developer-owned. Add GPIO, I/O and application logic there.
 */

#pragma once

#include "90_Studio_Export.h"
#include <stdbool.h>
#include <stdint.h>

typedef enum
{
    FG_THREE_WAY_LEFT = -1,
    FG_THREE_WAY_CENTER = 0,
    FG_THREE_WAY_RIGHT = 1
} fg_three_way_state_t;

#ifdef __cplusplus
extern "C" {
#endif

${declarations}

#ifdef __cplusplus
}
#endif
`

  const source =
`/*
 * ForgeUI User Event Hooks
 *
 * LIVE STUDIO FIRMWARE:
 * This file may be regenerated by ForgeUI Studio while designing,
 * building and flashing the internal ESP32-P4 test firmware.
 *
 * STANDALONE EXPORT:
 * After manually exporting a project to C:\\ForgeUI-Exports,
 * the exported copy becomes developer-owned.
 *
 * Add GPIO, I/O, hardware actions and application behaviour to
 * the exported project's 95_UserEvents.c file.
 *
 * Do not place permanent product logic in the live Studio firmware copy.
 */

#include "95_UserEvents.h"
#include <stdio.h>

${definitions}
`

  return {
    header,
    source,
    hooks: uniqueHooks,
    contracts: explicitContracts,
  }
}

const ORPHANED_NATIVE_HOOK_MARKER = 'ForgeUI orphaned legacy Native Component hook'

function findVoidHookDefinitions(source) {
  const definitions = []
  const signature = /\bvoid\s+(FG_On_[A-Za-z0-9_]+)\s*\(([^;{}]*)\)\s*\{/g
  let match
  while ((match = signature.exec(source))) {
    let depth = 1
    let cursor = signature.lastIndex
    let stringQuote = ''
    let escaped = false
    for (; cursor < source.length && depth > 0; cursor += 1) {
      const character = source[cursor]
      if (stringQuote) {
        if (escaped) escaped = false
        else if (character === '\\') escaped = true
        else if (character === stringQuote) stringQuote = ''
        continue
      }
      if (character === '"' || character === "'") stringQuote = character
      else if (character === '{') depth += 1
      else if (character === '}') depth -= 1
    }
    if (depth === 0) {
      definitions.push({
        hook: match[1],
        parameters: match[2],
        start: match.index,
        end: cursor,
        text: source.slice(match.index, cursor),
        body: source.slice(signature.lastIndex, cursor - 1),
      })
      signature.lastIndex = cursor
    }
  }
  return definitions
}

function isGeneratedNativePlaceholder(definition) {
  const expected = `printf("[ForgeUI User Event] ${definition.hook}\\n");`
  const body = definition.body.trim()
  if (body === expected) return true
  const unusedParameters = String(definition.parameters || '')
    .split(',')
    .map(parameter => {
      const match = parameter.trim().match(/([A-Za-z_][A-Za-z0-9_]*)$/)
      return match ? `    (void)${match[1]};` : ''
    })
    .filter(Boolean)
    .join('\n')
  if (unusedParameters && body === unusedParameters.trim()) return true
  const label = definition.hook
    .replace(/^FG_On_|_(?:Channel|Master)_Changed$/g, '')
    .replace(/_/g, ' ')
  if (definition.hook.endsWith('_Channel_Changed')) {
    return body === `printf("[ForgeUI User Event] ${label} channel %lu: %s\\n",
           (unsigned long)channel,
           enabled ? "ON" : "OFF");`
  }
  if (definition.hook.endsWith('_Master_Changed')) {
    return body === `printf("[ForgeUI User Event] ${label} master: %s\\n",
           enabled ? "ON" : "OFF");`
  }
  return false
}

function reconcileNativeComponentHooks(source, header, generated) {
  const active = new Set(generated.hooks)
  const canonicalDefinitions = new Map(
    findVoidHookDefinitions(generated.source).map(definition => [definition.hook, definition]),
  )
  // Older reconciliation put removed developer callbacks behind #if 0. They
  // are still stale component APIs in a compilable UserEvents file, so discard
  // those historical recovery blocks before applying the canonical contract.
  const orphanPattern = new RegExp(
    `#if 0 /\\* ${ORPHANED_NATIVE_HOOK_MARKER}:[^*]*\\*/[\\s\\S]*?#endif`,
    'g',
  )
  source = source.replace(orphanPattern, '')

  const edits = []
  const removedPlaceholders = []
  const removedCustomHooks = []
  findVoidHookDefinitions(source).forEach(definition => {
    if (!active.has(definition.hook)) {
      edits.push({ start: definition.start, end: definition.end, replacement: '' })
      ;(isGeneratedNativePlaceholder(definition)
        ? removedPlaceholders
        : removedCustomHooks).push(definition.hook)
      return
    }

    const canonical = canonicalDefinitions.get(definition.hook)
    if (!canonical) return
    const oldNames = String(definition.parameters || '') === 'void' ? [] :
      String(definition.parameters || '').split(',').map(parameter =>
        (parameter.trim().match(/([A-Za-z_][A-Za-z0-9_]*)$/) || [])[1]
      ).filter(Boolean)
    const newNames = new Set(String(canonical.parameters || '') === 'void' ? [] :
      String(canonical.parameters || '').split(',').map(parameter =>
        (parameter.trim().match(/([A-Za-z_][A-Za-z0-9_]*)$/) || [])[1]
      ).filter(Boolean))
    const bodyIsCompatible = oldNames.every(name =>
      newNames.has(name) || !new RegExp(`\\b${name}\\b`).test(definition.body)
    )
    const replacement = bodyIsCompatible
      ? `void ${definition.hook}(${canonical.parameters})\n{${definition.body}}`
      : canonical.text
    edits.push({ start: definition.start, end: definition.end, replacement })
  })

  edits.sort((left, right) => right.start - left.start).forEach(edit => {
    source = source.slice(0, edit.start) + edit.replacement + source.slice(edit.end)
  })
  source = source.replace(/\n{3,}/g, '\n\n')

  // The header is wholly generator-owned: it is the canonical contract for
  // this project, never a preservation merge of historical declarations.
  header = generated.header

  return {
    source,
    header,
    removedPlaceholders,
    removedCustomHooks,
    orphanedCustomHooks: [],
  }
}

function preserveUserEventFiles(existingSource, existingHeader, generated) {
  let source = String(existingSource || '').trim()
    ? String(existingSource).replace(/\s*$/, '\n')
    : generated.source
  let header = String(existingHeader || '').trim()
    ? String(existingHeader)
    : generated.header

  const reconciliation = reconcileNativeComponentHooks(
    source,
    header,
    generated,
  )
  source = reconciliation.source
  header = reconciliation.header
  if (reconciliation.removedCustomHooks.length) console.warn(
    'Removed obsolete UserEvents callbacks with no current canonical owner:',
    reconciliation.removedCustomHooks,
  )

  const ensureHeaderInclude = (directive) => {
    if (!generated.header.includes(directive)) return
    let retained = false
    header = header.split(/\r?\n/).filter(line => {
      if (line.trim() !== directive) return true
      if (retained) return false
      retained = true
      return true
    }).join('\n')
    if (retained) return
    const pragmaEnd = header.indexOf('\n', header.indexOf('#pragma once'))
    header = pragmaEnd >= 0
      ? `${header.slice(0, pragmaEnd + 1)}\n${directive}\n${header.slice(pragmaEnd + 1)}`
      : `${directive}\n${header}`
  }

  ;['#include "90_Studio_Export.h"', '#include <stdbool.h>', '#include <stdint.h>']
    .forEach(ensureHeaderInclude)

  const userHeaderDirective = '#include "95_UserEvents.h"'
  const userHeaderPattern = /^[ \t]*#include[ \t]+"95_UserEvents\.h"[ \t]*(?:\r?\n)?/gm
  source = source.replace(userHeaderPattern, '')
  const firstInclude = source.search(/^[ \t]*#include\b/m)
  source = firstInclude >= 0
    ? `${source.slice(0, firstInclude)}${userHeaderDirective}\n${source.slice(firstInclude)}`
    : `${userHeaderDirective}\n${source}`

  generated.contracts.forEach((parameters, hook) => {
    const escapedHook = hook.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    source = source.replace(
      new RegExp(`(\\bvoid\\s+${escapedHook}\\s*\\()[^;{}]*(\\)\\s*\\{)`),
      `$1${parameters}$2`,
    )
    header = header.replace(
      new RegExp(`(\\bvoid\\s+${escapedHook}\\s*\\()[^;{}]*(\\)\\s*;)`),
      `$1${parameters}$2`,
    )
  })

  generated.hooks.forEach((hook) => {
    const definitionPattern = new RegExp(
      `\\bvoid\\s+${hook}\\s*\\([^;]*\\)\\s*\\{`
    )
    if (!definitionPattern.test(source)) {
      const definition = generated.source.match(
        new RegExp(`void\\s+${hook}\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*?\\n\\}`)
      )
      if (definition) source = `${source.trimEnd()}\n\n${definition[0]}\n`
    }

    const declarationPattern = new RegExp(
      `\\bvoid\\s+${hook}\\s*\\([^;]*\\)\\s*;`
    )
    if (!declarationPattern.test(header)) {
      const declaration = generated.header.match(
        new RegExp(`void\\s+${hook}\\s*\\([^;]*\\);`)
      )
      if (declaration) {
        const insertion = `\n${declaration[0]}\n`
        const footer = header.lastIndexOf('#ifdef __cplusplus')
        header = footer >= 0
          ? `${header.slice(0, footer).trimEnd()}${insertion}\n${header.slice(footer)}`
          : `${header.trimEnd()}${insertion}`
      }
    }
  })

  let runtimeHeaderSeen = false
  header = header.split(/\r?\n/).filter(line => {
    if (!/^[ \t]*#include[ \t]+"90_Studio_Export\.h"[ \t]*$/.test(line)) return true
    if (runtimeHeaderSeen) return false
    runtimeHeaderSeen = true
    return true
  }).join('\n')

  return {
    ...generated,
    source,
    header,
    removedPlaceholders: reconciliation.removedPlaceholders,
    removedCustomHooks: reconciliation.removedCustomHooks,
    orphanedCustomHooks: reconciliation.orphanedCustomHooks,
  }
}

app.post('/export', (req, res) => {
  try {
    const validated = validateExportPayload(req.body || {})
const firmwareBuild = resolveFirmwareBuild(req.body.projectHardware)
    const code = validated.code
const assetSources = validated.assetSources.filter(source =>
  firmwareBuild.firmwareFeatures.settingsLauncher ||
  source !== 'assets/icons/fg_icon_settings_fi_48px.c'
)
const userEventHooks =
  req.body.userEventHooks || []
const userEventContracts = req.body.userEventContracts || []
const publicApiDeclarations = normalizePublicApiDeclarations(
  req.body.publicApiDeclarations
)
const fiRuntimeSource = typeof req.body.fiRuntimeSource === 'string' ? req.body.fiRuntimeSource : ''
const fiRuntimeHeader = typeof req.body.fiRuntimeHeader === 'string' ? req.body.fiRuntimeHeader : ''
const hasFiRuntime = fiRuntimeSource.trim().length > 0 && fiRuntimeHeader.trim().length > 0

const userEvents =
  generateUserEventFiles(userEventHooks, publicApiDeclarations, userEventContracts)

  const developerGuide =
  generateDeveloperGuide(userEvents.hooks)

    const header = generateStudioExportHeader(
      publicApiDeclarations,
      hasFiRuntime
    )
   
const mainDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main'
)
    const cTarget = path.join(mainDir, '90_Studio_Export.c')
    const hTarget = path.join(mainDir, '90_Studio_Export.h')
    const userEventsCTarget =
  path.join(mainDir, '95_UserEvents.c')

const userEventsHTarget =
  path.join(mainDir, '95_UserEvents.h')
const fiRuntimeCTarget = path.join(mainDir, '96_FiRuntime.c')
const fiRuntimeHTarget = path.join(mainDir, '96_FiRuntime.h')

const developerGuideTarget =
  path.join(
    path.resolve(
      __dirname,
      '../firmware/ForgeUI-One'
    ),
    'FORGEUI_DEVELOPER_GUIDE.md'
  )
const featureHeaderTarget = path.join(mainDir, '00_ForgeUI_Features.h')
const hardwareExampleHeaderTarget = path.join(mainDir, '00_ForgeUI_Hardware_Example.h')
const componentManifestTarget = path.join(mainDir, 'idf_component.yml')
const sdkconfigDefaultsTarget = path.resolve(mainDir, '..', 'sdkconfig.defaults')

const cmakeSources = [
  ...firmwareBuild.sources,
  `"${defaultHeroCSource}"`,
]
selectedHardwareExample(publicApiDeclarations, userEventHooks)
if (hasFiRuntime) cmakeSources.push('"96_FiRuntime.c"')
appendHardwareExample01Source(
  cmakeSources,
  mainDir,
  publicApiDeclarations,
  userEventHooks,
)
appendHardwareExample02Source(cmakeSources, mainDir, publicApiDeclarations, userEventHooks)
appendHardwareExample03Source(cmakeSources, mainDir, publicApiDeclarations)
appendHardwareExample04Source(cmakeSources, mainDir, publicApiDeclarations)
appendHardwareExample05Source(cmakeSources, mainDir, publicApiDeclarations)
applyHardwareExampleBuildRequirements(
  firmwareBuild,
  selectedHardwareExample(publicApiDeclarations, userEventHooks),
)

appendAssetSourcesToCMake(cmakeSources, assetSources)

const generatedCMake =
`idf_component_register(
    SRCS
        ${cmakeSources.join('\n        ')}

    INCLUDE_DIRS
        "."

    REQUIRES
        ${firmwareBuild.components.join('\n        ')}

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

    fs.writeFileSync(cTarget, code, 'utf8')
fs.writeFileSync(hTarget, header, 'utf8')
if (hasFiRuntime) {
  fs.writeFileSync(fiRuntimeCTarget, fiRuntimeSource, 'utf8')
  fs.writeFileSync(fiRuntimeHTarget, fiRuntimeHeader, 'utf8')
} else {
  fs.rmSync(fiRuntimeCTarget, { force: true })
  fs.rmSync(fiRuntimeHTarget, { force: true })
}
fs.writeFileSync(featureHeaderTarget, generateFeatureHeader(firmwareBuild), 'utf8')
fs.writeFileSync(hardwareExampleHeaderTarget, generateHardwareExampleHeader(publicApiDeclarations, userEventHooks), 'utf8')
fs.writeFileSync(componentManifestTarget, generateIdfComponentManifest(firmwareBuild), 'utf8')
const generatedSdkconfigDefaults = generateSdkconfigDefaults(
  firmwareBuild,
  fs.existsSync(sdkconfigDefaultsTarget) ? fs.readFileSync(sdkconfigDefaultsTarget, 'utf8') : '',
)
validateHardwareArtifacts(
  firmwareBuild,
  generatedSdkconfigDefaults,
  generateFeatureHeader(firmwareBuild),
  firmwareBuild.boardId,
)
fs.writeFileSync(sdkconfigDefaultsTarget, generatedSdkconfigDefaults, 'utf8')
// sdkconfig is an IDF build artifact. Removing it ensures the next Live build
// consumes the same freshly generated profile defaults as Standalone.
fs.rmSync(path.resolve(mainDir, '..', 'sdkconfig'), { force: true })

const preservedUserEvents = preserveUserEventFiles(
  fs.existsSync(userEventsCTarget) ? fs.readFileSync(userEventsCTarget, 'utf8') : '',
  fs.existsSync(userEventsHTarget) ? fs.readFileSync(userEventsHTarget, 'utf8') : '',
  userEvents
)

fs.writeFileSync(
  userEventsCTarget,
  preservedUserEvents.source,
  'utf8'
)

fs.writeFileSync(
  userEventsHTarget,
  preservedUserEvents.header,
  'utf8'
)

fs.writeFileSync(
  developerGuideTarget,
  developerGuide,
  'utf8'
)

const cmakeTarget = path.join(
  mainDir,
  'CMakeLists.txt'
)

fs.writeFileSync(
  cmakeTarget,
  generatedCMake,
  'utf8'
)

console.log('Generated LIVE CMake:', cmakeTarget)

console.log('Exported C to:', cTarget)
console.log('Exported H to:', hTarget)
console.log(
  'Exported User Events C to:',
  userEventsCTarget
)
console.log(
  'Exported User Events H to:',
  userEventsHTarget
)

console.log(
  'Exported Developer Guide to:',
  developerGuideTarget
)

   res.json({
  ok: true,
  cTarget,
  hTarget,
  userEventsCTarget,
  userEventsHTarget,
  userEventHooks: userEvents.hooks,
})
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/export-idf-project', (req, res) => {
  try {
    const validated = validateExportPayload(req.body || {})
const firmwareBuild = resolveFirmwareBuild(req.body.projectHardware)
    const code = validated.code
const assetSources = validated.assetSources.filter(source =>
  firmwareBuild.firmwareFeatures.settingsLauncher ||
  source !== 'assets/icons/fg_icon_settings_fi_48px.c'
)

const userEventHooks =
  req.body.userEventHooks || []
const userEventContracts = req.body.userEventContracts || []
const publicApiDeclarations = normalizePublicApiDeclarations(
  req.body.publicApiDeclarations
)
const fiRuntimeSource = typeof req.body.fiRuntimeSource === 'string' ? req.body.fiRuntimeSource : ''
const fiRuntimeHeader = typeof req.body.fiRuntimeHeader === 'string' ? req.body.fiRuntimeHeader : ''
const hasFiRuntime = fiRuntimeSource.trim().length > 0 && fiRuntimeHeader.trim().length > 0

const userEvents =
  generateUserEventFiles(userEventHooks, publicApiDeclarations, userEventContracts)

const developerGuide =
  generateDeveloperGuide(userEvents.hooks)

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

const exportsRoot = 'C:\\ForgeUI-Exports'

const exportDir = getUniqueExportDir(
  exportsRoot,
  projectName
)

fs.mkdirSync(exportsRoot, {
  recursive: true,
})

fs.cpSync(sourceDir, exportDir, {
  recursive: true,
  force: false,
  errorOnExist: true,

  filter: shouldCopyFirmwareSource,
})

const exportUploadsDir = path.join(
  exportDir,
  'main/assets/uploads'
)

fs.rmSync(exportUploadsDir, {
  recursive: true,
  force: true,
})

fs.mkdirSync(exportUploadsDir, {
  recursive: true,
})

copyAssetSourcesToProject(
  assetSources,
  path.resolve(sourceDir, 'main'),
  path.resolve(exportDir, 'main'),
)

    const header = generateStudioExportHeader(
      publicApiDeclarations,
      hasFiRuntime
    )

   const cTarget = path.join(
  exportDir,
  'main',
  '90_Studio_Export.c'
)

const hTarget = path.join(
  exportDir,
  'main',
  '90_Studio_Export.h'
)
const fiRuntimeCTarget = path.join(exportDir, 'main', '96_FiRuntime.c')
const fiRuntimeHTarget = path.join(exportDir, 'main', '96_FiRuntime.h')

const userEventsCTarget = path.join(
  exportDir,
  'main',
  '95_UserEvents.c'
)

const userEventsHTarget = path.join(
  exportDir,
  'main',
  '95_UserEvents.h'
)

const developerGuideTarget = path.join(
  exportDir,
  'FORGEUI_DEVELOPER_GUIDE.md'
)
const featureHeaderTarget = path.join(
  exportDir, 'main', '00_ForgeUI_Features.h'
)
const hardwareExampleHeaderTarget = path.join(
  exportDir, 'main', '00_ForgeUI_Hardware_Example.h'
)
const componentManifestTarget = path.join(
  exportDir, 'main', 'idf_component.yml'
)
const sdkconfigDefaultsTarget = path.join(exportDir, 'sdkconfig.defaults')

const cmakeSources = [
  ...firmwareBuild.sources,
  `"${defaultHeroCSource}"`,
]
selectedHardwareExample(publicApiDeclarations, userEventHooks)
if (hasFiRuntime) cmakeSources.push('"96_FiRuntime.c"')
appendHardwareExample01Source(
  cmakeSources,
  path.join(exportDir, 'main'),
  publicApiDeclarations,
  userEventHooks,
)
appendHardwareExample02Source(cmakeSources, path.join(exportDir, 'main'), publicApiDeclarations, userEventHooks)
appendHardwareExample03Source(cmakeSources, path.join(exportDir, 'main'), publicApiDeclarations)
appendHardwareExample04Source(cmakeSources, path.join(exportDir, 'main'), publicApiDeclarations)
appendHardwareExample05Source(cmakeSources, path.join(exportDir, 'main'), publicApiDeclarations)
applyHardwareExampleBuildRequirements(
  firmwareBuild,
  selectedHardwareExample(publicApiDeclarations, userEventHooks),
)

appendAssetSourcesToCMake(cmakeSources, assetSources)

const generatedCMake =
`idf_component_register(
    SRCS
        ${cmakeSources.join('\n        ')}

    INCLUDE_DIRS
        "."

    REQUIRES
        ${firmwareBuild.components.join('\n        ')}

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

fs.writeFileSync(
  cTarget,
  code,
  'utf8'
)

fs.writeFileSync(
  hTarget,
  header,
  'utf8'
)
if (hasFiRuntime) {
  fs.writeFileSync(fiRuntimeCTarget, fiRuntimeSource, 'utf8')
  fs.writeFileSync(fiRuntimeHTarget, fiRuntimeHeader, 'utf8')
} else {
  fs.rmSync(fiRuntimeCTarget, { force: true })
  fs.rmSync(fiRuntimeHTarget, { force: true })
}

fs.writeFileSync(
  featureHeaderTarget,
  generateFeatureHeader(firmwareBuild),
  'utf8'
)
fs.writeFileSync(
  hardwareExampleHeaderTarget,
  generateHardwareExampleHeader(publicApiDeclarations, userEventHooks),
  'utf8'
)
fs.writeFileSync(
  componentManifestTarget,
  generateIdfComponentManifest(firmwareBuild),
  'utf8'
)
const generatedSdkconfigDefaults = generateSdkconfigDefaults(
  firmwareBuild,
  fs.existsSync(sdkconfigDefaultsTarget) ? fs.readFileSync(sdkconfigDefaultsTarget, 'utf8') : '',
)
validateHardwareArtifacts(
  firmwareBuild,
  generatedSdkconfigDefaults,
  generateFeatureHeader(firmwareBuild),
  firmwareBuild.boardId,
)
fs.writeFileSync(sdkconfigDefaultsTarget, generatedSdkconfigDefaults, 'utf8')

const preservedStandaloneUserEvents = preserveUserEventFiles(
  fs.existsSync(userEventsCTarget) ? fs.readFileSync(userEventsCTarget, 'utf8') : '',
  fs.existsSync(userEventsHTarget) ? fs.readFileSync(userEventsHTarget, 'utf8') : '',
  userEvents,
)

fs.writeFileSync(
  userEventsCTarget,
  preservedStandaloneUserEvents.source,
  'utf8'
)

fs.writeFileSync(
  userEventsHTarget,
  preservedStandaloneUserEvents.header,
  'utf8'
)

fs.writeFileSync(
  developerGuideTarget,
  developerGuide,
  'utf8'
)

const cmakeTarget = path.join(
  exportDir,
  'main',
  'CMakeLists.txt'
)

fs.writeFileSync(
  cmakeTarget,
  generatedCMake,
  'utf8'
)

console.log(
  'Generated CMake:',
  cmakeTarget
)

console.log(
  'ESP-IDF project exported to:',
  exportDir
)

console.log(
  'Exported Developer Guide to:',
  developerGuideTarget
)

res.json({
  ok: true,
  exportDir,
  developerGuideTarget,
  userEventsCTarget,
  userEventsHTarget,
  userEventHooks: userEvents.hooks,
})
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/open-exports', (req, res) => {
  try {
    const exportsRoot = 'C:\\ForgeUI-Exports'

    fs.mkdirSync(exportsRoot, {
      recursive: true,
    })

    spawn(
      'powershell.exe',
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        `Start-Process explorer.exe "${exportsRoot}"`,
      ],
      {
        windowsHide: true,
      }
    )

    res.json({
      ok: true,
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/flash', async (req, res) => {
  const flashScript = path.resolve(__dirname, '../tools/flash-p4.bat')
  await runScript(flashScript, res)
})

app.post('/clean-flash', async (req, res) => {
  const flashScript = path.resolve(__dirname, '../tools/clean-flash-p4.bat')
  await runScript(flashScript, res)
})

app.get('/serial/ports', async (req, res) => {
  try { res.json({ ok: true, ports: await serialMonitor.list() }) }
  catch (error) { res.status(500).json({ ok: false, error: String(error.message || error), ports: [] }) }
})

app.post('/serial/start', async (req, res) => {
  try { res.json({ ok: true, ...(await serialMonitor.start(req.body.port, req.body.baud)) }) }
  catch (error) { res.status(409).json({ ok: false, ...serialMonitor.status(), error: String(error.message || error) }) }
})

app.post('/serial/stop', async (req, res) => {
  try { res.json({ ok: true, ...(await serialMonitor.stop()) }) }
  catch (error) { res.status(500).json({ ok: false, error: String(error.message || error) }) }
})

app.post('/serial/clear', (req, res) => { serialMonitor.clear(); res.json({ ok: true }) })
app.get('/serial/status', (req, res) => res.json({ ok: true, ...serialMonitor.status() }))
app.get('/serial/log', (req, res) => res.json({ ok: true, ...serialMonitor.snapshot() }))

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

app.post('/restart-forgeui', (req, res) => {
  try {
    const launcher = path.resolve(
      __dirname,
      '../START_FORGEUI_STUDIO_HIDDEN.vbs'
    )

    console.log('Restarting ForgeUI Studio...')

    spawn('wscript.exe', [launcher], {
      detached: true,
      windowsHide: true,
      stdio: 'ignore',
    }).unref()

    res.json({ ok: true })

    setTimeout(() => {
      process.exit(0)
    }, 1000)
  } catch (err) {
    console.error(err)

    res.status(500).json({
      ok: false,
      error: String(err),
    })
  }
})

app.post('/shutdown', async (req, res) => {
  console.log('Shutdown requested from browser')

  await serialMonitor.stop()

  res.json({ ok: true })

  setTimeout(() => {
    process.exit(0)
  }, 500)
})

if (require.main === module) {
  const port = Number(process.env.FORGEUI_EXPORT_PORT || 3030)
  app.listen(port, () => {
    console.log(`ForgeUI export server alive on :${port}`)
  })
}

module.exports = {
  app,
  generateStudioExportHeader,
  generateUserEventFiles,
  preserveUserEventFiles,
  normalizePublicApiDeclarations,
  materializeCanonicalAssetSources,
  copyAssetSourcesToProject,
  appendAssetSourcesToCMake,
  normalizeProjectHardware,
  generateFeatureHeader,
  generateSdkconfigDefaults,
  validateHardwareArtifacts,
  shouldCopyFirmwareSource,
  generateIdfComponentManifest,
  resolveFirmwareBuild,
  appendHardwareExample01Source,
  appendHardwareExample02Source,
  appendHardwareExample03Source,
  appendHardwareExample04Source,
  appendHardwareExample05Source,
  selectedHardwareExample,
  generateHardwareExampleHeader,
  applyHardwareExampleBuildRequirements,
  validateExportPayload,
  runScript,
  serialMonitor,
}
