const express = require('express')
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const defaultHeroFileName =
  'fg_upload_ai_hero_1784342478518_b95a7dc0'

const defaultHeroCSource =
  `assets/defaults/${defaultHeroFileName}.c`

const defaultHeroBrowserSrc =
  `http://localhost:3030/forgeui-defaults/${defaultHeroFileName}.png`

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
      emptyDirectory(uploadsDir)

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
        themesBefore.files +
        uploadsBefore.files

      const bytesRecovered =
        iconsBefore.bytes +
        themesBefore.bytes +
        uploadsBefore.bytes

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
            uploadsBefore.files,
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
          uploads: uploadsBefore.files,
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
  console.log('=== CONVERT REQUEST ===')
  console.log('fileName :', fileName)
  console.log('assetMode:', assetMode)
  console.log('symbol   :', symbolName)

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

    const cleanBase64 = String(base64).replace(
      /^data:image\/\w+;base64,/,
      ''
    )

    fs.writeFileSync(
      inputPath,
      Buffer.from(cleanBase64, 'base64')
    )

    console.log('Preprocessor:', preprocessorPath)
    console.log('Preprocess input:', inputPath)

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
          error: 'Image preprocessing failed',
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
                return `| ${h.replace(/^FG_On_|_(Clicked|Toggled)$/g, '')} | ${toggled ? 'Toggle' : 'Click'} | \`${h}(${toggled ? 'bool enabled' : ''})\` |`
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
  'assets/icons/fg_icon_settings_fi_48px.c': path.resolve(
    __dirname,
    './public/assets/icons/48x48 ForgeUI Reactor Set/fg_icon_settings_fi_48px.c',
  ),
})

function materializeCanonicalAssetSources(assetSources, options = {}) {
  const mainDir = path.resolve(
    options.mainDir || path.resolve(__dirname, '../firmware/ForgeUI-One/main'),
  )
  const emitted = []

  Array.from(new Set(assetSources || [])).forEach(rawSource => {
    const normalized = String(rawSource).replace(/\\/g, '/')
    const canonicalSource = CANONICAL_ASSET_MANIFEST[normalized]
    if (!canonicalSource) return

    if (!fs.existsSync(canonicalSource) || !fs.statSync(canonicalSource).isFile()) {
      throw new Error(`Canonical asset source missing:\n${canonicalSource}`)
    }

    const target = path.resolve(mainDir, normalized)
    if (!target.startsWith(`${mainDir}${path.sep}`)) {
      throw new Error(`Canonical asset target escapes firmware main:\n${normalized}`)
    }

    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(canonicalSource, target)
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
  ;(assetSources || []).forEach(source => {
    cmakeSources.push(`"${String(source).replace(/\\/g, '/')}"`)
  })
  return cmakeSources
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

function generateStudioExportHeader(publicApiDeclarations) {
  const declarations = normalizePublicApiDeclarations(
    publicApiDeclarations
  )

  return `#pragma once

#include "lvgl.h"
#include <stdbool.h>
#include <stdint.h>

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

function generateUserEventFiles(userEventHooks, publicApiDeclarations = []) {
  const booleanChanged = new Set()
  const checkedChanged = new Set()
  const checkboxCheckedChanged = new Set()
  const radioSelectedChanged = new Set()
  const integerChanged = new Set()
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
        .filter((hook) =>
          /^FG_On_[A-Za-z0-9_]+_(Clicked|Toggled|Changed|Point_Added|Cleared|Shown|Hidden|Closed|Button_Pressed|Button_Selected)$/.test(hook)
        )
    )
  )

  

  const declarations = uniqueHooks
    .map((hook) => integerChanged.has(hook) || integerPointAdded.has(hook)
      ? `void ${hook}(int32_t value);`
      : cleared.has(hook)
        ? `void ${hook}(void);`
      : shown.has(hook) || hidden.has(hook) || closed.has(hook)
        ? `void ${hook}(void);`
      : hook.endsWith('_Button_Pressed')
        ? `void ${hook}(uint32_t index, const char * text);`
      : hook.endsWith('_Button_Selected')
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

  const definitions = uniqueHooks
    .map((hook) => integerPointAdded.has(hook)
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
  }
}

function preserveUserEventFiles(existingSource, existingHeader, generated) {
  let source = String(existingSource || '').trim()
    ? String(existingSource).replace(/\s*$/, '\n')
    : generated.source
  let header = String(existingHeader || '').trim()
    ? String(existingHeader)
    : generated.header

  ;['stdbool.h', 'stdint.h'].forEach((include) => {
    const directive = `#include <${include}>`
    if (
      generated.header.includes(directive) &&
      !header.includes(directive)
    ) {
      const pragmaEnd = header.indexOf('\n', header.indexOf('#pragma once'))
      header = pragmaEnd >= 0
        ? `${header.slice(0, pragmaEnd + 1)}\n${directive}${header.slice(pragmaEnd + 1)}`
        : `${directive}\n${header}`
    }
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

  return { ...generated, source, header }
}

app.post('/export', (req, res) => {
  try {
    const validated = validateExportPayload(req.body || {})
    const code = validated.code
const assetSources = validated.assetSources
const userEventHooks =
  req.body.userEventHooks || []
const publicApiDeclarations = normalizePublicApiDeclarations(
  req.body.publicApiDeclarations
)

const userEvents =
  generateUserEventFiles(userEventHooks, publicApiDeclarations)

  const developerGuide =
  generateDeveloperGuide(userEvents.hooks)

    const header = generateStudioExportHeader(
      publicApiDeclarations
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

  const developerGuideTarget =
  path.join(
    path.resolve(
      __dirname,
      '../firmware/ForgeUI-One'
    ),
    'FORGEUI_DEVELOPER_GUIDE.md'
  )

    const cmakeSources = [
  '"main.c"',
  '"01_FG_Runtime.c"',
  '"20_RTC.c"',
  '"30_Audio.c"',
  '"30_WIFI.c"',
  '"40_SD.c"',
  '"50_DIAGNOSTICS.c"',
  '"90_Studio_Export.c"',
  '"95_UserEvents.c"',
  `"${defaultHeroCSource}"`,
]

appendAssetSourcesToCMake(cmakeSources, assetSources)

const generatedCMake =
`idf_component_register(
    SRCS
        ${cmakeSources.join('\n        ')}

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

    fs.writeFileSync(cTarget, code, 'utf8')
fs.writeFileSync(hTarget, header, 'utf8')

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
    const code = validated.code
const assetSources = validated.assetSources

const userEventHooks =
  req.body.userEventHooks || []
const publicApiDeclarations = normalizePublicApiDeclarations(
  req.body.publicApiDeclarations
)

const userEvents =
  generateUserEventFiles(userEventHooks, publicApiDeclarations)

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
      publicApiDeclarations
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

const cmakeSources = [
  '"main.c"',
  '"01_FG_Runtime.c"',
  '"20_RTC.c"',
  '"30_Audio.c"',
  '"30_WIFI.c"',
  '"40_SD.c"',
  '"50_DIAGNOSTICS.c"',
  '"90_Studio_Export.c"',
  '"95_UserEvents.c"',
  `"${defaultHeroCSource}"`,
]

appendAssetSourcesToCMake(cmakeSources, assetSources)

const generatedCMake =
`idf_component_register(
    SRCS
        ${cmakeSources.join('\n        ')}

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
  code,
  'utf8'
)

fs.writeFileSync(
  hTarget,
  header,
  'utf8'
)

fs.writeFileSync(
  userEventsCTarget,
  userEvents.source,
  'utf8'
)

fs.writeFileSync(
  userEventsHTarget,
  userEvents.header,
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

app.post('/shutdown', (req, res) => {
  console.log('Shutdown requested from browser')

  res.json({ ok: true })

  setTimeout(() => {
    process.exit(0)
  }, 500)
})

if (require.main === module) {
  app.listen(3030, () => {
    console.log('ForgeUI export server alive on :3030')
  })
}

module.exports = {
  generateStudioExportHeader,
  generateUserEventFiles,
  preserveUserEventFiles,
  normalizePublicApiDeclarations,
  materializeCanonicalAssetSources,
  copyAssetSourcesToProject,
  appendAssetSourcesToCMake,
  validateExportPayload,
}
