const { TextDecoder, TextEncoder } = require('util')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

const {
  generateStudioExportHeader,
  generateUserEventFiles,
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
})
