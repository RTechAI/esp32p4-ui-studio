const { TextDecoder, TextEncoder } = require('util')
const fs = require('fs')
const os = require('os')
const path = require('path')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

const {
  generateStudioExportHeader,
  generateUserEventFiles,
  validateExportPayload,
} = require('./export-server')

describe('generated public UI API headers', () => {
  it('uses the same validated setter declarations for export headers', () => {
    const header = generateStudioExportHeader([
      'void FG_Set_Status_Light(bool enabled);',
      'void FG_Set_Status_Light(bool enabled);',
      'void unsafe(void);',
    ])

    expect(header).toContain('#include <stdbool.h>')
    expect(header).toContain('void FG_Set_Status_Light(bool enabled);')
    expect(header.match(/FG_Set_Status_Light/g)).toHaveLength(1)
    expect(header).not.toContain('unsafe')
  })

  it('does not place Light setters in UserEvents files', () => {
    const files = generateUserEventFiles([
      'FG_On_Start_Clicked',
      'FG_Set_Status_Light',
    ])

    expect(files.hooks).toEqual(['FG_On_Start_Clicked'])
    expect(files.header).not.toContain('FG_Set_Status_Light')
    expect(files.source).not.toContain('FG_Set_Status_Light')
  })

  it('generates persistent Toggle Switch hooks with the new boolean state', () => {
    const files = generateUserEventFiles(['FG_On_Main_Power_Toggled'])
    expect(files.hooks).toEqual(['FG_On_Main_Power_Toggled'])
    expect(files.header).toContain('#include <stdbool.h>')
    expect(files.header).toContain('void FG_On_Main_Power_Toggled(bool enabled);')
    expect(files.source).toContain('void FG_On_Main_Power_Toggled(bool enabled)')
  })
})

describe('server export preflight', () => {
  it('rejects invalid assetSources before export writes', () => {
    expect(() => validateExportPayload({ code: 'valid', assetSources: ['../bad.c'] }))
      .toThrow('Export Validation Failed')
  })

  it('rejects missing generated C files', () => {
    expect(() => validateExportPayload({
      code: 'fg_upload_missing',
      assetSources: ['assets/uploads/fg_upload_missing.c'],
    })).toThrow('Generated C file missing')
  })

  it('accepts an existing generated C source in a temporary main directory', () => {
    const temporaryMain = fs.mkdtempSync(
      path.join(os.tmpdir(), 'forgeui-export-validation-'),
    )
    const relativeSource = 'assets/uploads/fg_valid_test.c'
    const sourcePath = path.join(temporaryMain, relativeSource)

    try {
      fs.mkdirSync(path.dirname(sourcePath), { recursive: true })
      fs.writeFileSync(
        sourcePath,
        'const int fg_valid_test = 1;\n',
        'utf8',
      )

      expect(validateExportPayload({
        code: 'LV_IMAGE_DECLARE(fg_valid_test);',
        assetSources: [relativeSource],
      }, { mainDir: temporaryMain })).toEqual({
        code: 'LV_IMAGE_DECLARE(fg_valid_test);',
        assetSources: [relativeSource],
      })
    } finally {
      fs.rmSync(temporaryMain, { recursive: true, force: true })
    }
  })

  it('accepts the built-in default-theme asset sources from firmware', () => {
    const assetSources = [
      'assets/uploads/fg_upload_1024x600_neural_core_67dd4ba0.c',
      'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
    ]
    const code = assetSources
      .map(source => `LV_IMAGE_DECLARE(${path.basename(source, '.c')});`)
      .join('\n')

    expect(validateExportPayload({ code, assetSources })).toEqual({
      code,
      assetSources,
    })
  })
})
