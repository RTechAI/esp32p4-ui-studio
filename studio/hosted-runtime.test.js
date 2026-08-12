const fs = require('fs')
const os = require('os')
const path = require('path')
const { PassThrough } = require('stream')
const { execFileSync } = require('child_process')
const { TextDecoder, TextEncoder } = require('util')
global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder
global.setImmediate = global.setImmediate || ((callback, ...args) => setTimeout(callback, 0, ...args))

process.env.FORGEUI_RUNTIME_MODE = 'hosted'
process.env.FORGEUI_TEMP_ROOT = path.join(__dirname, '.hosted-test-tmp')
const { prepareHostedProject, streamHostedExport, materializeHostedAssets, releaseHostedProject } = require('./hosted-runtime')
const { materializeStandaloneProject } = require('./export-server')

const payload = name => ({
  projectName: name,
  code: '#include "90_Studio_Export.h"\nvoid fg_studio_export_create(lv_obj_t *parent) { (void)parent; }\n',
  assetSources: [], userEventHooks: [], userEventContracts: [], publicApiDeclarations: [],
})

const remove = target => fs.rmSync(target, { recursive: true, force: true })
afterAll(() => remove(process.env.FORGEUI_TEMP_ROOT))

describe('shared standalone materializer', () => {
  it('preserves local destination materialization', () => {
    fs.mkdirSync(process.env.FORGEUI_TEMP_ROOT, { recursive: true })
    const root = fs.mkdtempSync(path.join(process.env.FORGEUI_TEMP_ROOT, 'local-export-'))
    const target = path.join(root, 'ForgeUI_Export')
    try {
      materializeStandaloneProject({ payload: payload('ForgeUI_Export'), destinationDir: target })
      expect(fs.existsSync(path.join(target, 'main', '90_Studio_Export.c'))).toBe(true)
      expect(fs.existsSync(path.join(target, 'main', '95_UserEvents.c'))).toBe(true)
      expect(fs.existsSync(path.join(target, 'sdkconfig.defaults'))).toBe(true)
    } finally { remove(root) }
  })
})

describe('hosted isolation and security', () => {
  it('isolates identical concurrent project names', async () => {
    const results = await Promise.all([Promise.resolve().then(() => prepareHostedProject(payload('Same_Name'))),
      Promise.resolve().then(() => prepareHostedProject(payload('Same_Name')))])
    try {
      expect(results[0].workspace.root).not.toBe(results[1].workspace.root)
      expect(fs.readFileSync(path.join(results[0].workspace.project, 'main', '90_Studio_Export.c'), 'utf8'))
        .toBe(fs.readFileSync(path.join(results[1].workspace.project, 'main', '90_Studio_Export.c'), 'utf8'))
    } finally { results.forEach(result => releaseHostedProject(result.workspace)) }
  })

  it.each(['../escape', 'C:\\escape', '/absolute'])('rejects unsafe project name %s', name => {
    expect(() => prepareHostedProject(payload(name))).toThrow('Invalid project name')
  })

  it('rejects malformed and oversized asset paths/content', () => {
    fs.mkdirSync(process.env.FORGEUI_TEMP_ROOT, { recursive: true })
    const root = fs.mkdtempSync(path.join(process.env.FORGEUI_TEMP_ROOT, 'assets-'))
    try {
      expect(() => materializeHostedAssets([{ source: '../bad.c', contentBase64: 'YQ==' }], root)).toThrow()
      expect(() => materializeHostedAssets([{ source: 'C:\\bad.c', contentBase64: 'YQ==' }], root)).toThrow()
      expect(() => materializeHostedAssets([{ source: 'assets/uploads/good.c', contentBase64: '' }], root)).toThrow()
    } finally { remove(root) }
  })

  it.each([1, 2])('exports %i isolated uploaded asset source(s)', count => {
    const assets = Array.from({ length: count }, (_, index) => ({
      source: `assets/uploads/fg_hosted_${index}.c`,
      contentBase64: Buffer.from(`const int fg_hosted_${index} = ${index};\n`).toString('base64'),
    }))
    const projectPayload = payload(`Assets_${count}`)
    projectPayload.assetSources = assets.map(asset => asset.source)
    projectPayload.hostedAssets = assets
    projectPayload.code += assets.map((_, index) => `extern const int fg_hosted_${index};\n`).join('')
    const result = prepareHostedProject(projectPayload)
    try {
      assets.forEach(asset => expect(fs.readFileSync(path.join(result.workspace.project, 'main', asset.source), 'utf8')).toContain('const int'))
    } finally { releaseHostedProject(result.workspace) }
  })

  it('streams a valid ZIP with safe headers and cleans its workspace', async () => {
    const response = new PassThrough()
    response.headers = {}
    response.setHeader = (name, value) => { response.headers[name] = value }
    const chunks = []
    response.on('data', chunk => chunks.push(chunk))
    await new Promise((resolve, reject) => {
      response.on('finish', resolve); response.on('error', reject)
      streamHostedExport(payload('Hosted_Proof'), response)
    })
    expect(response.headers['Content-Type']).toBe('application/zip')
    expect(response.headers['Content-Disposition']).toContain('Hosted_Proof.zip')
    const zip = path.join(process.env.FORGEUI_TEMP_ROOT, `forgeui-${Date.now()}.zip`)
    try {
      fs.writeFileSync(zip, Buffer.concat(chunks))
      const listing = execFileSync('tar', ['-tf', zip], { encoding: 'utf8' })
      expect(listing).toContain('Hosted_Proof/main/90_Studio_Export.c')
      expect(listing).toContain('Hosted_Proof/FORGEUI_DEVELOPER_GUIDE.md')
      expect(fs.readdirSync(process.env.FORGEUI_TEMP_ROOT)).toEqual([path.basename(zip)])
    } finally { fs.rmSync(zip, { force: true }) }
  }, 60000)
})

describe('hosted route surface', () => {
  it('contains only hosted health, conversion and export routes', () => {
    const routeDir = path.join(__dirname, 'src/pages/api/hosted')
    expect(fs.readdirSync(routeDir).sort()).toEqual(['convert-image.ts', 'export.ts', 'health.ts'])
    expect(fs.readdirSync(routeDir).join(' ')).not.toMatch(/flash|serial|shutdown|restart|explorer|clean/)
    const { app } = require('./export-server')
    expect(app.router.stack.filter(layer => layer.route)).toHaveLength(0)
  })
})
