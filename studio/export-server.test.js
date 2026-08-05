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
  validateExportPayload,
} = require('./export-server')

describe('generated public UI API headers', () => {
  it('generates typed PWM value and enabled hooks with developer-owned hardware guidance', () => {
    const generated = generateUserEventFiles([
      'FG_On_Comp_Fan_Output_Value_Changed',
      'FG_On_Comp_Fan_Output_Enabled_Changed',
    ], [
      'void FG_Set_Comp_Fan_Output_Value(float value);',
      'void FG_Set_Comp_Fan_Output_Enabled(bool enabled);',
    ])
    expect(generated.header).toContain('void FG_On_Comp_Fan_Output_Value_Changed(float value);')
    expect(generated.header).toContain('void FG_On_Comp_Fan_Output_Enabled_Changed(bool enabled);')
    expect(generated.source).toContain('Bind semantic PWM value to developer-owned hardware here')
  })

  it('generates typed Relay Panel channel and master hooks', () => {
    const generated = generateUserEventFiles([
      'FG_On_Comp_RELAY_Channel_Changed',
      'FG_On_Comp_RELAY_Master_Changed',
    ], [
      'void FG_Set_Comp_RELAY_Channel(uint32_t channel, bool enabled);',
    ])
    expect(generated.header).toContain('void FG_On_Comp_RELAY_Channel_Changed(uint32_t channel, bool enabled);')
    expect(generated.header).toContain('void FG_On_Comp_RELAY_Master_Changed(bool enabled);')
    expect(generated.source).toContain('channel %lu: %s')
    expect(generated.source).toContain('master: %s')
    const runtimeHeader = generateStudioExportHeader([
      'void FG_Set_Comp_RELAY_Channel(uint32_t channel, bool enabled);',
      'bool FG_Get_Comp_RELAY_Channel(uint32_t channel);',
      'void FG_Set_Comp_RELAY_Channel_Enabled(uint32_t channel, bool enabled);',
      'void FG_Set_Comp_RELAY_All(bool enabled);',
      'void FG_Set_Comp_RELAY_Label(uint32_t channel, const char * label);',
      'void FG_Set_Comp_RELAY_Status(uint32_t channel, const char * text);',
      'void FG_Set_Comp_RELAY_Master(bool enabled);',
    ])
    expect(runtimeHeader).toContain('bool FG_Get_Comp_RELAY_Channel(uint32_t channel);')
    expect(runtimeHeader.match(/FG_(?:Set|Get)_Comp_RELAY_/g)).toHaveLength(7)
  })
  it('publishes the generated Fi runtime header only when the feature is present', () => {
    expect(generateStudioExportHeader([], true)).toContain('#include "96_FiRuntime.h"')
    expect(generateStudioExportHeader([], false)).not.toContain('96_FiRuntime.h')
  })

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

  it('generates and preserves Standard Button click hooks without a setter', () => {
    const hook = 'FG_On_Primary_Action_Clicked'
    const generated = generateUserEventFiles([hook], [])
    expect(generated.header).toContain(`void ${hook}(void);`)
    expect(generated.source).toContain(`void ${hook}(void)`)
    expect(generated.source).toContain(
      '[ForgeUI User Event] FG_On_Primary_Action_Clicked\\n',
    )
    expect(generateStudioExportHeader([])).not.toContain(
      'FG_Set_Primary_Action',
    )

    const preserved = preserveUserEventFiles(
      `#include "95_UserEvents.h"\n\nvoid ${hook}(void)\n{\n    developer_action();\n}\n`,
      `#pragma once\nvoid ${hook}(void);\n`,
      generated,
    )
    expect(preserved.source).toContain('developer_action();')
    expect(preserved.source.match(new RegExp(`void ${hook}`, 'g')))
      .toHaveLength(1)
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

  it('materializes and preserves Slider changed hooks for live and standalone exports', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Level_Slider_Changed'],
      ['void FG_Set_Level_Slider_Value(int32_t value);'],
    )
    expect(generated.header).toContain(
      'void FG_On_Level_Slider_Changed(int32_t value);',
    )
    expect(generated.source).toContain(
      'void FG_On_Level_Slider_Changed(int32_t value)',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Level_Slider_Changed(int32_t value)\n{\n    developer_slider_action(value);\n}\n',
      '#pragma once\nvoid FG_On_Level_Slider_Changed(int32_t value);\n',
      generated,
    )
    expect(preserved.header).toContain('#include <stdint.h>')
    expect(preserved.source).toContain('developer_slider_action(value);')
    expect(preserved.source.match(/void FG_On_Level_Slider_Changed/g))
      .toHaveLength(1)
  })

  it('exports Progress setters without generating or disturbing user hooks', () => {
    const declaration =
      'void FG_Set_Download_Progress_Value(int32_t value);'
    const header = generateStudioExportHeader([declaration])
    const generated = generateUserEventFiles([], [declaration])
    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Existing_Clicked(void)\n{\n    developer_action();\n}\n',
      '#pragma once\nvoid FG_On_Existing_Clicked(void);\n',
      generated,
    )

    expect(header).toContain('#include <stdint.h>')
    expect(header).toContain(declaration)
    expect(generated.hooks).toEqual([])
    expect(generated.source).not.toContain('FG_On_Download_Progress')
    expect(preserved.source).toContain('developer_action();')
    expect(preserved.source).not.toContain('FG_On_Download_Progress')
  })

  it('preserves complete Native Component declarations in the generated header', () => {
    const declarations = [
      'void FG_Set_System_Output_Value(const char * value);',
      'void FG_Set_System_Output_Units(const char * units);',
      'void FG_Set_System_Output_Status(const char * text, uint32_t rgb);',
      'void FG_Set_System_Output_Progress(int32_t value);',
      'void FG_Set_Temperature_Value(float value);',
      'void FG_Set_Temperature_Units(const char * units);',
      'void FG_Set_Temperature_Status(const char * text, uint32_t rgb);',
      'void FG_Set_Temperature_Trend(int32_t trend);',
      'void FG_Set_Temperature_Timestamp(const char * timestamp);',
      'void FG_Set_Temperature_Colour(uint32_t rgb);',
    ]
    const header = generateStudioExportHeader([...declarations, declarations[0]])
    declarations.forEach(declaration => expect(header).toContain(declaration))
    expect(header.match(/FG_Set_System_Output_Value/g)).toHaveLength(1)
    expect(header).toContain('#include <stdbool.h>')
    expect(header).toContain('#include <stdint.h>')
    expect(header).toContain('extern "C"')
  })

  it('generates and preserves NumberInput integer hooks', () => {
    const declaration =
      'void FG_Set_Target_Temperature_Number_Input_Value(int32_t value);'
    const hook = 'FG_On_Target_Temperature_Number_Input_Changed'
    const generated = generateUserEventFiles([hook], [declaration])

    expect(generateStudioExportHeader([declaration]))
      .toContain(declaration)
    expect(generated.header).toContain(
      `void ${hook}(int32_t value);`,
    )
    expect(generated.source).toContain(
      'Target Temperature Number Input changed: %ld',
    )

    const preserved = preserveUserEventFiles(
      `#include "95_UserEvents.h"\n\nvoid ${hook}(int32_t value)\n{\n    developer_setpoint_action(value);\n}\n`,
      `#pragma once\n#include <stdint.h>\nvoid ${hook}(int32_t value);\n`,
      generated,
    )
    expect(preserved.source).toContain(
      'developer_setpoint_action(value);',
    )
    expect(preserved.source.match(new RegExp(`void ${hook}`, 'g')))
      .toHaveLength(1)
  })

  it('generates and preserves Spinbox integer hooks for standalone export', () => {
    const generated = generateUserEventFiles(
      ['FG_On_System_Setpoint_Changed'],
      ['void FG_Set_System_Setpoint_Value(int32_t value);'],
    )
    expect(generated.header).toContain(
      'void FG_On_System_Setpoint_Changed(int32_t value);',
    )
    expect(generated.source).toContain(
      'System Setpoint changed: %ld',
    )
    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_System_Setpoint_Changed(int32_t value)\n{\n    developer_spinbox_action(value);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_System_Setpoint_Changed(int32_t value);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_spinbox_action(value);')
    expect(preserved.source.match(
      /void FG_On_System_Setpoint_Changed/g,
    )).toHaveLength(1)
  })

  it('generates and preserves Select index-and-text hooks', () => {
    const declaration =
      'void FG_Set_Mode_Select_Selected_Index(uint32_t index);'
    const hook = 'FG_On_Mode_Select_Changed'
    const generated = generateUserEventFiles([hook], [declaration])

    expect(generateStudioExportHeader([declaration]))
      .toContain(declaration)
    expect(generated.header).toContain(
      `void ${hook}(uint32_t index, const char * text);`,
    )
    expect(generated.source).toContain(
      'Mode Select changed: %lu - %s',
    )

    const preserved = preserveUserEventFiles(
      `#include "95_UserEvents.h"\n\nvoid ${hook}(uint32_t index, const char * text)\n{\n    developer_mode_action(index, text);\n}\n`,
      `#pragma once\n#include <stdint.h>\nvoid ${hook}(uint32_t index, const char * text);\n`,
      generated,
    )
    expect(preserved.source).toContain(
      'developer_mode_action(index, text);',
    )
    expect(preserved.source.match(new RegExp(`void ${hook}`, 'g')))
      .toHaveLength(1)
  })

  it('exports Image source setters without generating user hooks', () => {
    const declaration =
      'void FG_Set_Logo_Image_Source(const void * src);'
    const header = generateStudioExportHeader([declaration])
    const generated = generateUserEventFiles([], [declaration])

    expect(header).toContain(declaration)
    expect(generated.hooks).toEqual([])
    expect(generated.header).not.toContain('FG_On_Logo_Image')
    expect(generated.source).not.toContain('FG_On_Logo_Image')
  })

  it('exports Box visibility setters without generating user hooks', () => {
    const declaration =
      'void FG_Set_Status_Box_Visible(bool visible);'
    const header = generateStudioExportHeader([declaration])
    const generated = generateUserEventFiles([], [declaration])

    expect(header).toContain(declaration)
    expect(generated.hooks).toEqual([])
    expect(generated.header).not.toContain('FG_On_Status_Box')
    expect(generated.source).not.toContain('FG_On_Status_Box')
  })

  it('generates and preserves IconButton click hooks', () => {
    const declaration =
      'void FG_Set_Settings_Icon_Button_Enabled(bool enabled);'
    const hook = 'FG_On_Settings_Icon_Button_Clicked'
    const generated = generateUserEventFiles([hook], [declaration])

    expect(generateStudioExportHeader([declaration]))
      .toContain(declaration)
    expect(generated.header).toContain(`void ${hook}(void);`)
    expect(generated.source).toContain(`void ${hook}(void)`)

    const preserved = preserveUserEventFiles(
      `#include "95_UserEvents.h"\n\nvoid ${hook}(void)\n{\n    developer_settings_action();\n}\n`,
      `#pragma once\nvoid ${hook}(void);\n`,
      generated,
    )
    expect(preserved.source).toContain('developer_settings_action();')
    expect(preserved.source.match(new RegExp(`void ${hook}`, 'g')))
      .toHaveLength(1)
  })

  it('generates and preserves Input text hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Search_Input_Changed'],
      ['void FG_Set_Search_Input_Text(const char * text);'],
    )

    expect(generateStudioExportHeader(
      ['void FG_Set_Search_Input_Text(const char * text);'],
    )).toContain(
      'void FG_Set_Search_Input_Text(const char * text);',
    )
    expect(generated.header).toContain(
      'void FG_On_Search_Input_Changed(const char * text);',
    )
    expect(generated.source).toContain(
      'void FG_On_Search_Input_Changed(const char * text)',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Search Input changed: %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Search_Input_Changed(const char * text)\n{\n    developer_input_action(text);\n}\n',
      '#pragma once\nvoid FG_On_Search_Input_Changed(const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_input_action(text);')
    expect(preserved.source.match(/void FG_On_Search_Input_Changed/g))
      .toHaveLength(1)
  })

  it('generates and preserves Textarea text hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Notes_Textarea_Changed'],
      ['void FG_Set_Notes_Textarea_Text(const char * text);'],
    )

    expect(generateStudioExportHeader(
      ['void FG_Set_Notes_Textarea_Text(const char * text);'],
    )).toContain(
      'void FG_Set_Notes_Textarea_Text(const char * text);',
    )
    expect(generated.header).toContain(
      'void FG_On_Notes_Textarea_Changed(const char * text);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Notes Textarea changed: %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Notes_Textarea_Changed(const char * text)\n{\n    developer_notes_action(text);\n}\n',
      '#pragma once\nvoid FG_On_Notes_Textarea_Changed(const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_notes_action(text);')
    expect(preserved.source.match(/void FG_On_Notes_Textarea_Changed/g))
      .toHaveLength(1)
  })

  it('generates and preserves Standard Switch checked hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Enable_WiFi_Switch_Changed'],
      ['void FG_Set_Enable_WiFi_Switch_Checked(bool checked);'],
    )

    expect(generateStudioExportHeader(
      ['void FG_Set_Enable_WiFi_Switch_Checked(bool checked);'],
    )).toContain(
      'void FG_Set_Enable_WiFi_Switch_Checked(bool checked);',
    )
    expect(generated.header).toContain(
      'void FG_On_Enable_WiFi_Switch_Changed(bool checked);',
    )
    expect(generated.source).toContain(
      'void FG_On_Enable_WiFi_Switch_Changed(bool checked)',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Enable WiFi Switch changed: %s',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Enable_WiFi_Switch_Changed(bool checked)\n{\n    developer_switch_action(checked);\n}\n',
      '#pragma once\n#include <stdbool.h>\nvoid FG_On_Enable_WiFi_Switch_Changed(bool checked);\n',
      generated,
    )
    expect(preserved.source).toContain('developer_switch_action(checked);')
    expect(preserved.source.match(
      /void FG_On_Enable_WiFi_Switch_Changed/g,
    )).toHaveLength(1)
  })

  it('generates and preserves Standard Checkbox checked hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Enable_Logging_Checkbox_Changed'],
      ['void FG_Set_Enable_Logging_Checkbox_Checked(bool checked);'],
    )

    expect(generateStudioExportHeader(
      ['void FG_Set_Enable_Logging_Checkbox_Checked(bool checked);'],
    )).toContain(
      'void FG_Set_Enable_Logging_Checkbox_Checked(bool checked);',
    )
    expect(generated.header).toContain(
      'void FG_On_Enable_Logging_Checkbox_Changed(bool checked);',
    )
    expect(generated.source).toContain(
      'void FG_On_Enable_Logging_Checkbox_Changed(bool checked)',
    )
    expect(generated.source).toContain(
      'checked ? "CHECKED" : "UNCHECKED"',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Enable_Logging_Checkbox_Changed(bool checked)\n{\n    developer_checkbox_action(checked);\n}\n',
      '#pragma once\n#include <stdbool.h>\nvoid FG_On_Enable_Logging_Checkbox_Changed(bool checked);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_checkbox_action(checked);',
    )
    expect(preserved.source.match(
      /void FG_On_Enable_Logging_Checkbox_Changed/g,
    )).toHaveLength(1)
  })

  it('generates and preserves Standard Radio selected hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Automatic_Mode_Radio_Changed'],
      ['void FG_Set_Automatic_Mode_Radio_Selected(bool selected);'],
    )

    expect(generateStudioExportHeader(
      ['void FG_Set_Automatic_Mode_Radio_Selected(bool selected);'],
    )).toContain(
      'void FG_Set_Automatic_Mode_Radio_Selected(bool selected);',
    )
    expect(generated.header).toContain(
      'void FG_On_Automatic_Mode_Radio_Changed(bool selected);',
    )
    expect(generated.source).toContain(
      'selected ? "SELECTED" : "UNSELECTED"',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_Automatic_Mode_Radio_Changed(bool selected)\n{\n    developer_radio_action(selected);\n}\n',
      '#pragma once\n#include <stdbool.h>\nvoid FG_On_Automatic_Mode_Radio_Changed(bool selected);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_radio_action(selected);',
    )
    expect(preserved.source.match(
      /void FG_On_Automatic_Mode_Radio_Changed/g,
    )).toHaveLength(1)
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

  it('generates and preserves List item click hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_System_Menu_Item_Clicked'],
      [],
    )
    expect(generated.header).toContain(
      'void FG_On_System_Menu_Item_Clicked(uint32_t index, const char * text);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event]\\nSystem Menu\\nItem %lu\\n%s\\n',
    )

    const preserved = preserveUserEventFiles(
      '#include "95_UserEvents.h"\n\nvoid FG_On_System_Menu_Item_Clicked(uint32_t index, const char * text)\n{\n    developer_list_action(index, text);\n}\n',
      '#pragma once\n#include <stdint.h>\nvoid FG_On_System_Menu_Item_Clicked(uint32_t index, const char * text);\n',
      generated,
    )
    expect(preserved.source).toContain(
      'developer_list_action(index, text);',
    )
    expect(preserved.source.match(
      /void FG_On_System_Menu_Item_Clicked/g,
    )).toHaveLength(1)
  })

  it('generates and preserves TabView selection hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Main_Tabs_Changed'],
      ['void FG_Set_Main_Tabs_Selected(uint32_t tab_index);'],
    )
    expect(generated.header).toContain(
      'void FG_On_Main_Tabs_Changed(uint32_t tab_index);',
    )
    expect(generated.source).toContain(
      'void FG_On_Main_Tabs_Changed(uint32_t tab_index)',
    )

    const preserved = preserveUserEventFiles(
      generated.source.replace(
        '(unsigned long)tab_index);',
        '(unsigned long)tab_index);\n    developer_tab_action(tab_index);',
      ),
      generated.header,
      generated,
    )
    expect(preserved.source).toContain('developer_tab_action(tab_index);')
    expect(preserved.source.match(/void FG_On_Main_Tabs_Changed/g))
      .toHaveLength(1)
  })

  it('generates and preserves collision-safe Tileview selection hooks', () => {
    const generated = generateUserEventFiles(
      ['FG_On_Tileview_Changed', 'FG_On_Tileview_2_Changed'],
      [
        'void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);',
        'void FG_Set_Tileview_2_Selected(uint32_t column, uint32_t row);',
      ],
    )
    expect(generated.header).toContain(
      'void FG_On_Tileview_Changed(uint32_t column, uint32_t row);',
    )
    expect(generated.header).toContain(
      'void FG_On_Tileview_2_Changed(uint32_t column, uint32_t row);',
    )
    expect(generated.source).toContain(
      '[ForgeUI User Event] Tileview changed: column %lu, row %lu',
    )

    const preserved = preserveUserEventFiles(
      generated.source.replace(
        '(unsigned long)row);',
        '(unsigned long)row);\n    developer_tile_action(column, row);',
      ),
      generated.header,
      generated,
    )
    expect(preserved.source).toContain(
      'developer_tile_action(column, row);',
    )
    expect(preserved.source.match(/void FG_On_Tileview_Changed/g))
      .toHaveLength(1)
    expect(preserved.source.match(/void FG_On_Tileview_2_Changed/g))
      .toHaveLength(1)
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

  describe('Native Component hook ownership reconciliation', () => {
    const active = 'FG_On_Comp_ACTIVE_Clicked'
    const stale = 'FG_On_Comp_STALE_Clicked'
    const generated = () => generateUserEventFiles([active], [])
    const placeholder = hook => `void ${hook}(void)\n{\n    printf("[ForgeUI User Event] ${hook}\\n");\n}`

    it('removes obsolete untouched placeholders and their declarations', () => {
      const preserved = preserveUserEventFiles(
        `#include "95_UserEvents.h"\n#include <stdio.h>\n\n${placeholder(stale)}\n`,
        `#pragma once\nvoid ${stale}(void);\n`,
        generated(),
      )
      expect(preserved.source).not.toContain(stale)
      expect(preserved.header).not.toContain(stale)
      expect(preserved.removedPlaceholders).toEqual([stale])
      expect(preserved.source.match(new RegExp(`void ${active}`, 'g'))).toHaveLength(1)
    })

    it('removes obsolete generated Relay Panel placeholders with typed signatures', () => {
      const channel = 'FG_On_Comp_STALE_Channel_Changed'
      const master = 'FG_On_Comp_STALE_Master_Changed'
      const generatedRelay = generateUserEventFiles([channel, master], [])
      const preserved = preserveUserEventFiles(
        generatedRelay.source,
        generatedRelay.header,
        generateUserEventFiles([], []),
      )
      expect(preserved.source).not.toContain(channel)
      expect(preserved.source).not.toContain(master)
      expect(preserved.header).not.toContain(channel)
      expect(preserved.header).not.toContain(master)
      expect(preserved.removedPlaceholders).toEqual(expect.arrayContaining([channel, master]))
    })

    it('preserves an active customised body exactly once', () => {
      const custom = `void ${active}(void)\n{\n    developer_gpio_action();\n}`
      const preserved = preserveUserEventFiles(custom, `#pragma once\nvoid ${active}(void);\n`, generated())
      expect(preserved.source).toContain(custom)
      expect(preserved.source.match(new RegExp(`void ${active}`, 'g'))).toHaveLength(1)
    })

    it('quarantines obsolete customised hooks so stale APIs cannot compile', () => {
      const custom = `void ${stale}(void)\n{\n    FG_Set_Comp_STALE_Value(42);\n}`
      const preserved = preserveUserEventFiles(custom, `#pragma once\nvoid ${stale}(void);\n`, generated())
      expect(preserved.source).toContain('#if 0 /* ForgeUI orphaned legacy Native Component hook:')
      expect(preserved.source).toContain('FG_Set_Comp_STALE_Value(42);')
      expect(preserved.header).not.toContain(stale)
      expect(preserved.orphanedCustomHooks).toEqual([stale])
    })

    it('quarantines stale Dashboard Card proof hooks with descriptive identities', () => {
      const staleCard = 'FG_On_Dashboard_Card_A_Clicked'
      const currentCard = 'FG_On_Comp_CURRENT_Clicked'
      const custom = `void ${staleCard}(void)\n{\n    FG_Set_Dashboard_Card_A_Title("stale");\n}`
      const preserved = preserveUserEventFiles(
        custom,
        `#pragma once\nvoid ${staleCard}(void);\n`,
        generateUserEventFiles([currentCard], []),
      )
      expect(preserved.source).toContain('#if 0 /* ForgeUI orphaned legacy Native Component hook:')
      expect(preserved.source).toContain('FG_Set_Dashboard_Card_A_Title("stale");')
      expect(preserved.header).not.toContain(staleCard)
      expect(preserved.orphanedCustomHooks).toEqual([staleCard])
    })

    it('does not modify standard or unrelated developer hooks', () => {
      const standard = 'void FG_On_Standard_Button_Clicked(void)\n{\n    developer_action();\n}'
      const helper = 'void Application_Background_Task(void)\n{\n    service_watchdog();\n}'
      const preserved = preserveUserEventFiles(`${standard}\n\n${helper}\n`, '#pragma once\n', generated())
      expect(preserved.source).toContain(standard)
      expect(preserved.source).toContain(helper)
    })

    it('is byte-stable across repeated regeneration', () => {
      const first = preserveUserEventFiles(
        `${placeholder(stale)}\n`,
        `#pragma once\nvoid ${stale}(void);\n`,
        generated(),
      )
      const second = preserveUserEventFiles(first.source, first.header, generated())
      expect(second.source).toBe(first.source)
      expect(second.header).toBe(first.header)
    })

    it('preserves the current Sensor Tile proof on its active hook', () => {
      const firmwareMain = path.resolve(__dirname, '../firmware/ForgeUI-One/main')
      const source = fs.readFileSync(path.join(firmwareMain, '95_UserEvents.c'), 'utf8')
      const header = fs.readFileSync(path.join(firmwareMain, '95_UserEvents.h'), 'utf8')
      const current = generateUserEventFiles([
        'FG_On_Comp_MSBCEKT2_TYLLX_Clicked',
        'FG_On_Comp_MSBCEON9_ITWY7_Clicked',
      ], [])
      const first = preserveUserEventFiles(source, header, current)
      const second = preserveUserEventFiles(first.source, first.header, current)
      expect(first.source.match(/\[ForgeUI Proof\] Sensor Tile state/g)).toHaveLength(1)
      expect(first.source).toContain('void FG_On_Comp_MSBCEON9_ITWY7_Clicked(void)')
      expect(first.source).not.toContain('FG_Set_Comp_MSBBZXHGG5_BAD_')
      expect(first.source).not.toContain('FG_Set_Comp_MSBAPR9_V4_H3_A5_')
      expect(second.source).toBe(first.source)
      expect(second.header).toBe(first.header)
    })
  })
})

describe('server export preflight', () => {
  const settingsSource = 'assets/icons/fg_icon_settings_fi_48px.c'
  const settingsSymbol = 'fg_icon_settings_fi_48px'
  const validSpinboxGeometry = `
static void fg_increment(lv_event_t * event)
{
    lv_spinbox_increment(fg_spinbox);
}
static void fg_decrement(lv_event_t * event)
{
    lv_spinbox_decrement(fg_spinbox);
}
lv_obj_t * fg_spinbox = lv_spinbox_create(fg_parent);
lv_obj_set_pos(fg_spinbox, 10, 20);
lv_obj_set_size(fg_spinbox, 200, 80);
lv_obj_t * fg_spinbox_increment_button = lv_button_create(fg_parent);
lv_obj_set_pos(fg_spinbox_increment_button, 210, 20);
lv_obj_set_size(fg_spinbox_increment_button, 40, 40);
lv_obj_add_flag(fg_spinbox_increment_button, LV_OBJ_FLAG_CLICKABLE);
lv_obj_move_foreground(fg_spinbox_increment_button);
lv_obj_add_event_cb(fg_spinbox_increment_button, fg_increment, LV_EVENT_CLICKED, NULL);
lv_obj_t * fg_spinbox_decrement_button = lv_button_create(fg_parent);
lv_obj_set_pos(fg_spinbox_decrement_button, 210, 60);
lv_obj_set_size(fg_spinbox_decrement_button, 40, 40);
lv_obj_add_flag(fg_spinbox_decrement_button, LV_OBJ_FLAG_CLICKABLE);
lv_obj_move_foreground(fg_spinbox_decrement_button);
lv_obj_add_event_cb(fg_spinbox_decrement_button, fg_decrement, LV_EVENT_CLICKED, NULL);
`

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

  it('accepts valid Spinbox helper geometry independently of the live artifact', () => {
    expect(validateExportPayload({
      code: validSpinboxGeometry,
      assetSources: [],
    }).code).toBe(validSpinboxGeometry)
  })

  it('rejects malformed live Spinbox helper geometry before either export', () => {
    const code = validSpinboxGeometry.replace(
      'lv_obj_set_pos(fg_spinbox_increment_button, 210, 20);',
      'lv_obj_set_pos(fg_spinbox_increment_button, 110172, 20);',
    )
    expect(() => validateExportPayload({ code, assetSources: [] }))
      .toThrow('helper geometry lies outside its component bounds')
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

  it('materializes and validates the canonical Settings asset before export', () => {
    const temporaryMain = fs.mkdtempSync(
      path.join(os.tmpdir(), 'forgeui-settings-live-'),
    )

    try {
      expect(materializeCanonicalAssetSources(
        [settingsSource],
        { mainDir: temporaryMain },
      )).toEqual([settingsSource])

      const emitted = path.join(temporaryMain, settingsSource)
      expect(fs.existsSync(emitted)).toBe(true)
      expect(fs.readFileSync(emitted, 'utf8')).toContain(
        `const lv_image_dsc_t ${settingsSymbol}`,
      )

      expect(validateExportPayload({
        code: `LV_IMAGE_DECLARE(${settingsSymbol});`,
        assetSources: [settingsSource],
      }, { mainDir: temporaryMain })).toEqual({
        code: `LV_IMAGE_DECLARE(${settingsSymbol});`,
        assetSources: [settingsSource],
      })
    } finally {
      fs.rmSync(temporaryMain, { recursive: true, force: true })
    }
  })

  it('copies the canonical Settings dependency into standalone project paths', () => {
    const sourceMain = fs.mkdtempSync(
      path.join(os.tmpdir(), 'forgeui-settings-source-'),
    )
    const targetMain = fs.mkdtempSync(
      path.join(os.tmpdir(), 'forgeui-settings-export-'),
    )

    try {
      materializeCanonicalAssetSources(
        [settingsSource],
        { mainDir: sourceMain },
      )
      copyAssetSourcesToProject(
        [settingsSource],
        sourceMain,
        targetMain,
      )

      const copied = path.join(targetMain, settingsSource)
      expect(fs.existsSync(copied)).toBe(true)
      expect(fs.readFileSync(copied, 'utf8')).toContain(settingsSymbol)
    } finally {
      fs.rmSync(sourceMain, { recursive: true, force: true })
      fs.rmSync(targetMain, { recursive: true, force: true })
    }
  })

  it('registers the exact canonical Settings filename in generated CMake', () => {
    expect(appendAssetSourcesToCMake(
      ['"90_Studio_Export.c"'],
      [settingsSource, `assets\\icons\\..\\icons\\${path.basename(settingsSource)}`],
    )).toEqual([
      '"90_Studio_Export.c"',
      `"${settingsSource}"`,
    ])
  })

  it('emits a source once when seed and discovered paths normalize identically', () => {
    const heroSource =
      'assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c'
    expect(appendAssetSourcesToCMake(
      [`"${heroSource}"`],
      [
        `assets\\defaults\\${path.basename(heroSource)}`,
        `assets/defaults/./${path.basename(heroSource)}`,
      ],
    )).toEqual([`"${heroSource}"`])
  })

  it('accepts the built-in default-theme asset sources from firmware', () => {
    const assetSources = [
      'assets/defaults/fg_upload_ai_hero_1784342478518_b95a7dc0.c',
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

describe('board profile firmware resolution', () => {
  it('exports the selected SDIO project hardware configuration', () => {
    const project = normalizeProjectHardware({
      wifiHosted: {
        transport: 'sdio', slot: 1, width: 4, frequencyKHz: 40000,
        clk: 18, cmd: 19, d0: 14, d1: 15, d2: 16, d3: 17,
        reset: 54, resetDelayMs: 1500, txQueueSize: 20, rxQueueSize: 20,
      },
    })
    const defaults = generateSdkconfigDefaults(project)
    expect(defaults).toContain('CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y')
    expect(defaults).toContain('CONFIG_ESP_HOSTED_PRIV_SDIO_PIN_CLK_SLOT_1=18')
    expect(defaults).toContain('CONFIG_ESP_HOSTED_SDIO_GPIO_RESET_SLAVE=54')
    expect(defaults).not.toContain('CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y')
  })

  it('preserves a deliberate SPI project configuration', () => {
    const defaults = generateSdkconfigDefaults({
      wifiHosted: {
        transport: 'spi', mode: 3, controller: 1, frequencyKHz: 40000,
        clk: 9, mosi: 8, miso: 10, cs: 7, handshake: 6,
        dataReady: 11, reset: 12, resetDelayMs: 1500,
        txQueueSize: 20, rxQueueSize: 20,
      },
    })
    expect(defaults).toContain('CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y')
    expect(defaults).toContain('CONFIG_ESP_HOSTED_SPI_GPIO_HANDSHAKE=6')
    expect(defaults).not.toContain('CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y')
  })

  it('does not package a stale live sdkconfig', () => {
    expect(shouldCopyFirmwareSource('C:/firmware/sdkconfig')).toBe(false)
    expect(shouldCopyFirmwareSource('C:/firmware/sdkconfig.defaults')).toBe(true)
  })

  it('rejects profile/default/header/board mismatches', () => {
    const project = normalizeProjectHardware()
    const defaults = generateSdkconfigDefaults(project)
    const header = generateFeatureHeader(project)
    expect(() => validateHardwareArtifacts(
      project,
      defaults.replace('CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y', 'CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y'),
      header,
      project.boardId,
    )).toThrow(/selected Wi-Fi transport sdio/)
    expect(() => validateHardwareArtifacts(project, defaults, header, 'wrong-board'))
      .toThrow(/board profile/)
  })

  it('uses the same normalized hardware profile for Live and Standalone generation', () => {
    const persisted = normalizeProjectHardware({ sd: { frequencyKHz: 20000 } })
    expect(generateSdkconfigDefaults(persisted)).toBe(generateSdkconfigDefaults(persisted))
    expect(generateFeatureHeader(persisted)).toBe(generateFeatureHeader(persisted))
  })

  it('materializes profile defaults idempotently without retaining stale transport state', () => {
    const project = normalizeProjectHardware()
    const once = generateSdkconfigDefaults(project)
    const twice = generateSdkconfigDefaults(project, once)
    expect(twice).toBe(once)
    expect(twice.match(/Generated from ForgeUI project hardware profile\./g)).toHaveLength(1)
    expect(twice).toContain('CONFIG_SLAVE_IDF_TARGET_ESP32C6=y')
    expect(twice).toContain('CONFIG_ESP_HOSTED_SDIO_HOST_INTERFACE=y')
    expect(twice).not.toContain('CONFIG_ESP_HOSTED_SPI_HOST_INTERFACE=y')
  })

  it('preserves historical features for legacy export payloads', () => {
    expect(normalizeProjectHardware()).toEqual(expect.objectContaining({
      boardId: 'waveshare-esp32p4-wifi6-touch-lcd-7b',
      firmwareFeatures: expect.objectContaining({
        wifi: true,
        sdCard: true,
        settingsLauncher: true,
        diagnostics: true,
      }),
    }))
  })

  it('corrects dependencies and emits one authoritative feature header', () => {
    const project = normalizeProjectHardware({
      firmwareFeatures: {
        wifi: false,
        wifiManager: true,
        sdCard: false,
        storageBrowser: true,
        settingsLauncher: false,
      },
    })
    expect(project.firmwareFeatures).toEqual(expect.objectContaining({
      wifi: false,
      wifiManager: false,
      sdCard: false,
      storageBrowser: false,
      settingsLauncher: false,
      diagnostics: false,
    }))
    const header = generateFeatureHeader(project)
    expect(header).toContain('#define FG_FEATURE_WIFI 0')
    expect(header).toContain('#define FG_FEATURE_SETTINGS 0')
  })

  it('removes optional sources and dependencies for a core-only build', () => {
    const build = resolveFirmwareBuild({
      firmwareFeatures: {
        wifi: false, audio: false, sdCard: false,
        settingsLauncher: false, diagnostics: false,
      },
    })
    expect(build.sources).not.toEqual(expect.arrayContaining([
      '"30_Audio.c"', '"30_WIFI.c"', '"40_SD.c"', '"50_DIAGNOSTICS.c"',
    ]))
    expect(build.components).not.toEqual(expect.arrayContaining([
      'esp_wifi', 'esp_hosted', 'fatfs', 'sdmmc', 'spi_flash',
    ]))
  })

  it('keeps CMake consistent with the Settings plus Diagnostics profile', () => {
    const build = resolveFirmwareBuild({
      firmwareFeatures: {
        wifi: false,
        sdCard: false,
        settingsLauncher: true,
        wifiManager: false,
        storageBrowser: false,
        diagnostics: true,
      },
    })
    expect(build.sources).toEqual(expect.arrayContaining([
      '"50_DIAGNOSTICS.c"',
      '"90_Studio_Export.c"',
    ]))
    expect(build.sources).not.toEqual(expect.arrayContaining([
      '"30_WIFI.c"',
      '"40_SD.c"',
    ]))
    expect(build.components).toContain('spi_flash')
    expect(build.components).not.toEqual(expect.arrayContaining([
      'esp_wifi',
      'esp_hosted',
      'fatfs',
      'sdmmc',
    ]))
  })

  it('gates hosted Wi-Fi dependencies in the component manifest', () => {
    const disabled = generateIdfComponentManifest({
      firmwareFeatures: { wifi: false },
    })
    expect(disabled).toContain('lvgl/lvgl')
    expect(disabled).not.toContain('esp_wifi_remote')
    expect(disabled).not.toContain('esp_hosted')

    const enabled = generateIdfComponentManifest({
      firmwareFeatures: { wifi: true },
    })
    expect(enabled).toContain('esp_wifi_remote')
    expect(enabled).toContain('esp_hosted')
  })

})
