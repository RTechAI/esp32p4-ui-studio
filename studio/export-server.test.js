const { TextDecoder, TextEncoder } = require('util')
const fs = require('fs')
const os = require('os')
const path = require('path')

global.TextDecoder = TextDecoder
global.TextEncoder = TextEncoder

const {
  generateStudioExportHeader,
  generateUserEventFiles,
  preserveUserEventFiles,
  validateExportPayload,
} = require('./export-server')

describe('generated public UI API headers', () => {
  it('uses the same validated setter declarations for export headers', () => {
    const header = generateStudioExportHeader([
      'void FG_Set_Status_Light(bool enabled);',
      'void FG_Set_Status_Light(bool enabled);',
      'void FG_Set_Status_LED(bool on);',
      'void unsafe(void);',
    ])

    expect(header).toContain('#include <stdbool.h>')
    expect(header).toContain('void FG_Set_Status_Light(bool enabled);')
    expect(header).toContain('void FG_Set_Status_LED(bool on);')
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

  it('generates Three-Position changed hooks with the shared enum and readable states', () => {
    const files = generateUserEventFiles(['FG_On_ModeSelector_Changed'])
    expect(files.header).toContain('FG_THREE_WAY_LEFT = -1')
    expect(files.header).toContain('void FG_On_ModeSelector_Changed(fg_three_way_state_t state);')
    expect(files.source).toContain('"LEFT"')
    expect(files.source).toContain('"CENTER"')
    expect(files.source).toContain('"RIGHT"')
  })

  it('generates LED changed hooks with boolean state', () => {
    const files = generateUserEventFiles(
      ['FG_On_Status_LED_Changed'],
      ['void FG_Set_Status_LED(bool on);'],
    )
    expect(files.header).toContain(
      'void FG_On_Status_LED_Changed(bool enabled);',
    )
    expect(files.source).toContain(
      'void FG_On_Status_LED_Changed(bool enabled)',
    )
    expect(files.source).toContain(
      '[ForgeUI User Event] Status LED changed: %s',
    )
  })

  it('generates Bar changed hooks with int32_t state', () => {
    const files = generateUserEventFiles(
      ['FG_On_Progress_Bar_Changed'],
      ['void FG_Set_Progress_Bar(int32_t value);'],
    )
    expect(files.header).toContain('#include <stdint.h>')
    expect(files.header).toContain(
      'void FG_On_Progress_Bar_Changed(int32_t value);',
    )
    expect(files.source).toContain(
      '[ForgeUI User Event] Progress Bar changed: %ld',
    )
    expect(files.source).toContain('(long)value')
  })

  it('generates Arc changed hooks with int32_t state', () => {
    const files = generateUserEventFiles(
      ['FG_On_Value_Arc_Changed'],
      ['void FG_Set_Value_Arc(int32_t value);'],
    )
    expect(files.header).toContain(
      'void FG_On_Value_Arc_Changed(int32_t value);',
    )
    expect(files.source).toContain(
      '[ForgeUI User Event] Value Arc changed: %ld',
    )
  })

  it('preserves a developer-written Arc hook body', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Value_Arc_Changed'],
      ['void FG_Set_Value_Arc(int32_t value);'],
    )
    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Value_Arc_Changed(int32_t value)\n{\n    developer_arc_action(value);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Value_Arc_Changed(int32_t value);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_arc_action(value);')
    expect(preserved.source.match(/void FG_On_Value_Arc_Changed/g))
      .toHaveLength(1)
  })

  it('generates Chart point-added and cleared hooks', () => {
    const files = generateUserEventFiles(
      ['FG_On_Data_Chart_Point_Added', 'FG_On_Data_Chart_Cleared'],
      [
        'void FG_Add_Data_Chart_Point(int32_t value);',
        'void FG_Clear_Data_Chart(void);',
      ],
    )
    expect(files.header).toContain(
      'void FG_On_Data_Chart_Point_Added(int32_t value);',
    )
    expect(files.header).toContain(
      'void FG_On_Data_Chart_Cleared(void);',
    )
    expect(files.source).toContain('Data Chart point added: %ld')
    expect(files.source).toContain('Data Chart cleared')
  })

  it('preserves developer-written Chart hook bodies', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Data_Chart_Point_Added', 'FG_On_Data_Chart_Cleared'],
      [
        'void FG_Add_Data_Chart_Point(int32_t value);',
        'void FG_Clear_Data_Chart(void);',
      ],
    )
    const source = [
      '#include "95_UserEvents.h"',
      'void FG_On_Data_Chart_Point_Added(int32_t value)',
      '{ developer_chart_sample(value); }',
      'void FG_On_Data_Chart_Cleared(void)',
      '{ developer_chart_clear(); }',
    ].join('\n')
    const preserved = preserveUserEventFiles(
      source,
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Data_Chart_Point_Added(int32_t value);\nvoid FG_On_Data_Chart_Cleared(void);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_chart_sample(value);')
    expect(preserved.source).toContain('developer_chart_clear();')
    expect(preserved.source.match(/void FG_On_Data_Chart_Point_Added/g))
      .toHaveLength(1)
    expect(preserved.source.match(/void FG_On_Data_Chart_Cleared/g))
      .toHaveLength(1)
  })

  it('generates and preserves Keyboard visibility hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Keyboard_Shown', 'FG_On_Keyboard_Hidden'],
      ['void FG_Show_Keyboard(void);', 'void FG_Hide_Keyboard(void);'],
    )
    expect(generated.header).toContain('void FG_On_Keyboard_Shown(void);')
    expect(generated.header).toContain('void FG_On_Keyboard_Hidden(void);')
    expect(generated.source).toContain('[ForgeUI User Event] Keyboard shown')
    expect(generated.source).toContain('[ForgeUI User Event] Keyboard hidden')

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Keyboard_Shown(void)\n{\n    developer_keyboard_shown();\n}\n',
      '#pragma once\nvoid FG_On_Keyboard_Shown(void);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_keyboard_shown();')
    expect(preserved.source.match(/void FG_On_Keyboard_Shown/g)).toHaveLength(1)
    expect(preserved.source).toContain('void FG_On_Keyboard_Hidden(void)')
    expect(preserved.header).toContain('void FG_On_Keyboard_Hidden(void);')
  })

  it('generates and preserves Calendar date hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Calendar_Date_Changed'],
      [
        'void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);',
      ],
    )
    expect(generated.header).toContain(
      'void FG_On_Calendar_Date_Changed(uint16_t year, uint8_t month, uint8_t day);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Calendar date changed: %04u-%02u-%02u',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Calendar_Date_Changed(uint16_t year, uint8_t month, uint8_t day)\n{\n    developer_calendar_action(year, month, day);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Calendar_Date_Changed(uint16_t year, uint8_t month, uint8_t day);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_calendar_action(year, month, day);',
    )
    expect(preserved.source.match(/void FG_On_Calendar_Date_Changed/g))
      .toHaveLength(1)
  })

  it('generates and preserves Roller selection hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Option_Roller_Changed'],
      ['void FG_Set_Option_Roller_Selected(uint32_t index);'],
    )
    expect(generated.header).toContain(
      'void FG_On_Option_Roller_Changed(uint32_t index, const char * text);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Option Roller changed: %lu - %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Option_Roller_Changed(uint32_t index, const char * text)\n{\n    developer_roller_action(index, text);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Option_Roller_Changed(uint32_t index, const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_roller_action(index, text);',
    )
    expect(preserved.source.match(/void FG_On_Option_Roller_Changed/g))
      .toHaveLength(1)
  })

  it('generates and preserves Message Box hooks', () => {
    const generated = generateUserEventFiles(
      [
        'FG_On_Message_Shown',
        'FG_On_Message_Closed',
        'FG_On_Message_Button_Pressed',
      ],
      ['void FG_Show_Message(void);', 'void FG_Close_Message(void);'],
    )
    expect(generated.header).toContain('void FG_On_Message_Shown(void);')
    expect(generated.header).toContain('void FG_On_Message_Closed(void);')
    expect(generated.header).toContain(
      'void FG_On_Message_Button_Pressed(uint32_t index, const char * text);',
    )
    expect(generated.source).toContain('[ForgeUI User Event] Message shown')
    expect(generated.source).toContain('[ForgeUI User Event] Message closed')
    expect(generated.source).toContain(
      '[ForgeUI User Event] Message button: %lu - %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Message_Button_Pressed(uint32_t index, const char * text)\n{\n    developer_message_action(index, text);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Message_Button_Pressed(uint32_t index, const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_message_action(index, text);',
    )
    expect(preserved.source.match(/void FG_On_Message_Button_Pressed/g))
      .toHaveLength(1)
    expect(preserved.source).toContain('void FG_On_Message_Shown(void)')
    expect(preserved.source).toContain('void FG_On_Message_Closed(void)')
  })

  it('generates and preserves Button Matrix selection hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Menu_Matrix_Button_Selected'],
      ['void FG_Set_Menu_Matrix_Selected(uint32_t button_index);'],
    )
    expect(generated.header).toContain(
      'void FG_On_Menu_Matrix_Button_Selected(uint32_t index, const char * text);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Menu Matrix button: %lu - %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Menu_Matrix_Button_Selected(uint32_t index, const char * text)\n{\n    developer_matrix_action(index, text);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_Menu_Matrix_Button_Selected(uint32_t index, const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_matrix_action(index, text);',
    )
    expect(preserved.source.match(
      /void FG_On_Menu_Matrix_Button_Selected/g,
    )).toHaveLength(1)
  })

  it('preserves developer hook bodies and appends a missing LED stub', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Existing_Clicked', 'FG_On_Status_LED_Changed'],
      ['void FG_Set_Status_LED(bool on);'],
    )
    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Existing_Clicked(void)\n{\n    developer_gpio_action();\n}\n',
      '#pragma once\nvoid FG_On_Existing_Clicked(void);\n',
      generated,
    )

    expect(preserved.source).toContain('developer_gpio_action();')
    expect(preserved.source.match(/void FG_On_Existing_Clicked/g)).toHaveLength(1)
    expect(preserved.source).toContain(
      'void FG_On_Status_LED_Changed(bool enabled)',
    )
    expect(preserved.header).toContain(
      'void FG_On_Status_LED_Changed(bool enabled);',
    )
    expect(preserved.header).toContain('#include <stdbool.h>')
  })

  it('merges stdint into a preserved header for a new Bar hook', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Progress_Bar_Changed'],
      ['void FG_Set_Progress_Bar(int32_t value);'],
    )
    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Progress_Bar_Changed(int32_t value)\n{\n    developer_progress_action(value);\n}\n',
      '#pragma once\n#include <stdbool.h>\nvoid FG_On_Progress_Bar_Changed(int32_t value);\n',
      generated,
    )
    expect(preserved.header).toContain('#include <stdint.h>')
    expect(preserved.header).toContain(
      'void FG_On_Progress_Bar_Changed(int32_t value);',
    )
    expect(preserved.source).toContain('developer_progress_action(value);')
    expect(preserved.source.match(/void FG_On_Progress_Bar_Changed/g))
      .toHaveLength(1)
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
