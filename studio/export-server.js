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
        "90_Studio_Export.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
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
        "90_Studio_Export.c"

    INCLUDE_DIRS
        "."

    REQUIRES
        nvs_flash
        driver
        esp_event
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
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

app.post('/export', (req, res) => {
  try {
    const code = req.body.code || ''
    const assetSources = req.body.assetSources || []

    const iconSourceDir = path.resolve(
  __dirname,
  './public/assets/icons/48x48 ForgeUI Reactor Set'
)

const iconTargetDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main/assets/icons'
)

fs.mkdirSync(iconTargetDir, { recursive: true })

assetSources.forEach((src) => {
  const fileName = path.basename(src)

  const sourceFile = path.join(
    iconSourceDir,
    fileName
  )

  const targetFile = path.join(
    iconTargetDir,
    fileName
  )

  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, targetFile)
    console.log('Copied asset:', fileName)
  } else {
    console.log('Missing asset:', sourceFile)
  }
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
   
const mainDir = path.resolve(
  __dirname,
  '../firmware/ForgeUI-One/main'
)
    const cTarget = path.join(mainDir, '90_Studio_Export.c')
    const hTarget = path.join(mainDir, '90_Studio_Export.h')

    const cmakeSources = [
  '"main.c"',
  '"01_FG_Runtime.c"',
  '"20_RTC.c"',
  '"30_Audio.c"',
  '"30_WIFI.c"',
  '"40_SD.c"',
  '"90_Studio_Export.c"',
]

assetSources.forEach((src) => {
  cmakeSources.push(`"${src}"`)
})

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
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

    fs.writeFileSync(cTarget, code, 'utf8')
    fs.writeFileSync(hTarget, header, 'utf8')
    const cmakeTarget = path.join(mainDir, 'CMakeLists.txt')
fs.writeFileSync(cmakeTarget, generatedCMake, 'utf8')
console.log('Generated LIVE CMake:', cmakeTarget)

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
    const assetSources = req.body.assetSources || []

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

assetSources.forEach((src) => {
  const normalizedSrc = String(src)
    .replace(/\\/g, '/')
    .replace(/^main\//, '')
    .replace(/^\/+/, '')

  if (!normalizedSrc.startsWith('assets/uploads/')) {
    return
  }

  const sourceAsset = path.resolve(
    sourceDir,
    'main',
    normalizedSrc
  )

  const targetAsset = path.resolve(
    exportDir,
    'main',
    normalizedSrc
  )

  if (!fs.existsSync(sourceAsset)) {
    throw new Error(
      `Referenced uploaded asset missing:\n${sourceAsset}`
    )
  }

  fs.mkdirSync(path.dirname(targetAsset), {
    recursive: true,
  })

  fs.copyFileSync(sourceAsset, targetAsset)

  console.log(
    'Copied uploaded asset:',
    normalizedSrc
  )
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

const cmakeSources = [
  '"main.c"',
  '"01_FG_Runtime.c"',
  '"20_RTC.c"',
  '"30_Audio.c"',
  '"30_WIFI.c"',
  '"40_SD.c"',
  '"90_Studio_Export.c"',
]

assetSources.forEach((src) => {
  cmakeSources.push(`"${src}"`)
})

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
        esp_netif
        esp_wifi
        esp_wifi_remote
        esp_hosted
        fatfs
        sdmmc
        waveshare__esp32_p4_wifi6_touch_lcd_7b

    PRIV_REQUIRES
        bsp_extra
)

target_compile_definitions(\${COMPONENT_LIB} PRIVATE
    LV_LVGL_H_INCLUDE_SIMPLE
)`

    fs.writeFileSync(cTarget, code, 'utf8')
    fs.writeFileSync(hTarget, header, 'utf8')

    const cmakeTarget = path.join(exportDir, 'main', 'CMakeLists.txt')

fs.writeFileSync(
  cmakeTarget,
  generatedCMake,
  'utf8'
)

console.log('Generated CMake:', cmakeTarget)

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

app.post('/open-exports', (req, res) => {
  try {
    const exportsRoot = 'C:\\ForgeUI-Exports'

    fs.mkdirSync(exportsRoot, { recursive: true })

    spawn('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      `Start-Process explorer.exe "${exportsRoot}"`
    ], {
      windowsHide: true,
    })

    res.json({ ok: true })
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

app.listen(3030, () => {
  console.log('ForgeUI export server alive on :3030')
})