const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const { spawnSync } = require('child_process')
const archiver = require('archiver')

process.env.FORGEUI_RUNTIME_MODE = 'hosted'
const { materializeStandaloneProject, safeProjectName, shouldCopyFirmwareSource } = require('./export-server')

const TEMPLATE_DIR = path.resolve(__dirname, '../firmware/ForgeUI-One')
const WORK_ROOT = path.resolve(process.env.FORGEUI_TEMP_ROOT || path.join(os.tmpdir(), 'forgeui'))
const MAX_ASSETS = 32
const MAX_ASSET_BYTES = 8 * 1024 * 1024
const MAX_ASSET_SOURCE_BYTES = 32 * 1024 * 1024
const MAX_ASSET_SOURCE_TOTAL = 64 * 1024 * 1024
let activeExports = 0
const MAX_CONCURRENT_EXPORTS = Number(process.env.FORGEUI_MAX_CONCURRENT_EXPORTS || 4)

const safeError = error => {
  const message = String(error && error.message || error || 'Hosted export failed')
  if (/validation|missing|invalid|malformed|asset|project/i.test(message)) {
    return message.split(/\r?\n/)[0].replace(/[A-Za-z]:\\[^\s]+|\/(?:[^\s/]+\/)+[^\s]+/g, '[server path]')
  }
  return 'Hosted export failed. Please check the project and try again.'
}

function createWorkspace() {
  fs.mkdirSync(WORK_ROOT, { recursive: true })
  const id = crypto.randomBytes(18).toString('hex')
  const root = path.join(WORK_ROOT, id)
  if (!path.resolve(root).startsWith(`${WORK_ROOT}${path.sep}`)) throw new Error('Invalid workspace')
  fs.mkdirSync(root, { recursive: false })
  return { id, root, template: path.join(root, 'template'), project: path.join(root, 'project') }
}

function materializeHostedAssets(assets, mainDir) {
  if (!assets) return
  if (!Array.isArray(assets) || assets.length > MAX_ASSETS) throw new Error('Invalid hosted asset collection')
  const seen = new Set()
  let totalBytes = 0
  for (const asset of assets) {
    const source = String(asset && asset.source || '').replace(/\\/g, '/')
    if (!/^assets\/uploads\/[A-Za-z0-9_]+\.c$/.test(source) || seen.has(source)) {
      throw new Error('Invalid hosted asset path')
    }
    const bytes = Buffer.from(String(asset.contentBase64 || ''), 'base64')
    totalBytes += bytes.length
    if (!bytes.length || bytes.length > MAX_ASSET_SOURCE_BYTES || totalBytes > MAX_ASSET_SOURCE_TOTAL) {
      throw new Error('Invalid hosted asset content')
    }
    const target = path.resolve(mainDir, source)
    if (!target.startsWith(`${path.resolve(mainDir)}${path.sep}`)) throw new Error('Invalid hosted asset target')
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, bytes, { flag: 'wx' })
    seen.add(source)
  }
}

function prepareHostedProject(payload) {
  const projectName = safeProjectName(payload && payload.projectName)
  if (String(payload && payload.projectName || projectName) !== projectName) throw new Error('Invalid project name')
  if (activeExports >= MAX_CONCURRENT_EXPORTS) {
    const error = new Error('Hosted export capacity reached. Please retry shortly.')
    error.statusCode = 503
    throw error
  }
  activeExports++
  const workspace = createWorkspace()
  try {
    fs.cpSync(TEMPLATE_DIR, workspace.template, { recursive: true, filter: shouldCopyFirmwareSource })
    materializeHostedAssets(payload.hostedAssets, path.join(workspace.template, 'main'))
    materializeStandaloneProject({
      payload, templateDir: workspace.template,
      sourceMainDir: path.join(workspace.template, 'main'), destinationDir: workspace.project,
    })
    return { workspace, projectName }
  } catch (error) {
    fs.rmSync(workspace.root, { recursive: true, force: true })
    activeExports--
    throw error
  }
}

function releaseHostedProject(workspace) {
  if (!workspace || workspace.released) return
  workspace.released = true
  fs.rmSync(workspace.root, { recursive: true, force: true })
  activeExports = Math.max(0, activeExports - 1)
}

function streamHostedExport(payload, res) {
  const { workspace, projectName } = prepareHostedProject(payload)
  let cleaned = false
  const cleanup = () => {
    if (cleaned) return
    cleaned = true
    releaseHostedProject(workspace)
  }
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="${projectName}.zip"`)
  res.setHeader('Cache-Control', 'no-store')
  const archive = archiver('zip', { zlib: { level: 6 } })
  archive.on('error', error => { cleanup(); if (!res.headersSent) res.statusCode = 500; res.destroy(error) })
  res.on('close', cleanup)
  res.on('finish', cleanup)
  archive.pipe(res)
  archive.directory(workspace.project, projectName)
  archive.finalize()
}

function convertHostedImage(body) {
  const symbol = String(body.symbolName || '').replace(/[^A-Za-z0-9_]/g, '_')
  if (!symbol || symbol.length > 100) throw new Error('Invalid image symbol')
  const match = String(body.base64 || '').match(/^data:image\/(?:png|jpeg);base64,([A-Za-z0-9+/=]+)$/)
  if (!match) throw new Error('Invalid image input')
  const bytes = Buffer.from(match[1], 'base64')
  if (!bytes.length || bytes.length > MAX_ASSET_BYTES) throw new Error('Image exceeds the hosted size limit')
  const workspace = createWorkspace()
  try {
    const input = path.join(workspace.root, `${symbol}.png`)
    const output = path.join(workspace.root, 'output')
    fs.mkdirSync(output)
    fs.writeFileSync(input, bytes)
    const python = process.env.FORGEUI_PYTHON || (process.platform === 'win32' ? 'python' : 'python3')
    const preprocess = spawnSync(python, [path.resolve(__dirname, '../tools/ForgeUIImagePreprocessor.py'), input,
      String(body.assetMode || 'image'), String(Number(body.width || 0)), String(Number(body.height || 0))],
      { timeout: 30000, windowsHide: true, encoding: 'utf8' })
    if (preprocess.error || preprocess.status !== 0) throw new Error('Image preprocessing failed')
    const conversion = spawnSync(python, [path.resolve(__dirname, '../tools/lvgl/LVGLImage.py'), '--ofmt', 'C', '--cf',
      'ARGB8888', '--output', output, '--name', symbol, input],
      { timeout: 30000, windowsHide: true, encoding: 'utf8' })
    const cFile = path.join(output, `${symbol}.c`)
    if (conversion.error || conversion.status !== 0 || !fs.existsSync(cFile)) throw new Error('LVGL image conversion failed')
    return { ok: true, symbolName: symbol, assetSource: `assets/uploads/${symbol}.c`,
      browserSrc: body.base64, contentBase64: fs.readFileSync(cFile).toString('base64') }
  } finally {
    fs.rmSync(workspace.root, { recursive: true, force: true })
  }
}

module.exports = { WORK_ROOT, createWorkspace, prepareHostedProject, streamHostedExport,
  convertHostedImage, safeError, materializeHostedAssets, releaseHostedProject }
