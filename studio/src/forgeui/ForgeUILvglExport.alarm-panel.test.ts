import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

const enumCount = (text: string, name: string) =>
  (text.match(new RegExp(`\\btypedef enum \\{[^}]+\\} ${name};`, 'g')) || []).length

const alarmPanel = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, parent: 'root', type: 'AlarmPanel', children: [], props: {
    x: 20, y: 20, w: 420, h: 300, alarmCapacity: 4, maximumVisibleAlarms: 3,
    title: 'Active Alarms', showTimestamp: true, showPriority: true,
    showAcknowledgement: true, sortOrder: 'priority', generateRuntimeApi: true,
    enableUserEvents: true, alarms: [], ...props,
  },
})
const generate = (...children: IComponent[]) => generateForgeUILvglCode({
  root: { id: 'root', parent: '', type: 'Root', props: {}, children: children.map(child => child.id) } as unknown as IComponent,
  ...Object.fromEntries(children.map(child => [child.id, child])),
}, 'graphite', undefined, { includeThemeTexture: false })

describe('Alarm Panel LVGL export', () => {
  it('generates bounded persisted-ID APIs and canonical callback contracts', () => {
    const output = generate(alarmPanel('comp-Alarm-A'))
    expect(output.publicApiDeclarations).toEqual(expect.arrayContaining([
      'bool FG_Add_Comp_Alarm_A_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
      'bool FG_Acknowledge_Comp_Alarm_A_Alarm(int32_t alarm_id);',
      'bool FG_Clear_Comp_Alarm_A_Alarm(int32_t alarm_id);',
      'void FG_Clear_All_Comp_Alarm_A(void);',
      'void FG_Set_Comp_Alarm_A_Enabled(bool enabled);',
    ]))
    expect(output.userEventContracts).toEqual(expect.arrayContaining([
      { name: 'FG_On_Comp_Alarm_A_Alarm_Added', parameters: 'int32_t alarm_id, FG_Alarm_Priority priority' },
      { name: 'FG_On_Comp_Alarm_A_Alarm_Acknowledged', parameters: 'int32_t alarm_id' },
      { name: 'FG_On_Comp_Alarm_A_Alarm_Cleared', parameters: 'int32_t alarm_id' },
      { name: 'FG_On_Comp_Alarm_A_Alarm_Selected', parameters: 'int32_t alarm_id' },
    ]))
    expect(output.code).toContain('static int32_t fg_comp_alarm_a_alarm_ids[4] = {0};')
    expect(output.code).toContain('if (slot < 0) return false;')
    expect(output.code).toContain('fg_comp_alarm_a_alarm_count_label')
    expect(output.code).toContain('fg_comp_alarm_a_alarm_row_state_labels')
    expect(output.code).toContain('fg_comp_alarm_a_alarm_row_priority_labels')
    expect(output.code).toContain('fg_comp_alarm_a_alarm_row_ack_labels')
    expect(output.code).toContain('LV_BORDER_SIDE_LEFT')
    expect(output.code).toContain('lv_obj_set_style_pad_all(fg_comp_alarm_a_alarm_rows[0], 0, 0)')
    expect(output.code).toContain('lv_obj_set_style_text_align(fg_comp_alarm_a_alarm_row_priority_labels[0], LV_TEXT_ALIGN_RIGHT, 0)')
  })

  it('isolates duplicate instances and remains rename-stable', () => {
    const first = alarmPanel('persisted-a'); first.componentName = 'Renamed Display'
    const output = generate(first, alarmPanel('persisted-b', { compactMode: true, showTimestamp: false }))
    expect(output.code).toContain('FG_Add_Persisted_A_Alarm')
    expect(output.code).toContain('FG_Add_Persisted_B_Alarm')
    expect(output.code).not.toContain('FG_Add_Renamed_Display_Alarm')
    expect(output.code).toContain('fg_persisted_a_alarm_messages[4][97]')
    expect(output.code).toContain('fg_persisted_b_alarm_messages[4][97]')
  })

  it('emits shared Alarm Panel enum contracts exactly once for one panel', () => {
    const output = generate(alarmPanel('alarm-one'))
    const declarations = output.publicApiDeclarations.join('\n')
    expect(enumCount(declarations, 'FG_Alarm_Priority')).toBe(1)
    expect(enumCount(declarations, 'FG_Alarm_State')).toBe(1)
    expect(declarations).toContain(
      'typedef enum { FG_ALARM_PRIORITY_LOW = 0, FG_ALARM_PRIORITY_MEDIUM = 1, FG_ALARM_PRIORITY_HIGH = 2, FG_ALARM_PRIORITY_CRITICAL = 3 } FG_Alarm_Priority;',
    )
    expect(output.code).not.toContain('typedef enum { FG_ALARM_PRIORITY')
  })

  it('keeps shared Alarm Panel enum contracts single for two panels', () => {
    const output = generate(alarmPanel('alarm-left'), alarmPanel('alarm-right'))
    const declarations = output.publicApiDeclarations.join('\n')
    expect(enumCount(declarations, 'FG_Alarm_Priority')).toBe(1)
    expect(enumCount(declarations, 'FG_Alarm_State')).toBe(1)
    expect(output.publicApiDeclarations).toEqual(expect.arrayContaining([
      'bool FG_Add_Alarm_Left_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
      'bool FG_Add_Alarm_Right_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
    ]))
    expect(output.userEventContracts).toEqual(expect.arrayContaining([
      { name: 'FG_On_Alarm_Left_Alarm_Added', parameters: 'int32_t alarm_id, FG_Alarm_Priority priority' },
      { name: 'FG_On_Alarm_Right_Alarm_Added', parameters: 'int32_t alarm_id, FG_Alarm_Priority priority' },
    ]))
  })

  it('keeps multiple renamed Alarm Panels signature-compatible', () => {
    const first = alarmPanel('plant alarms')
    first.componentName = 'Renamed Critical List'
    const second = alarmPanel('remote-alarm-bank')
    second.componentName = 'Another Display Name'
    const output = generate(first, second)
    const declarations = output.publicApiDeclarations.join('\n')
    expect(enumCount(declarations, 'FG_Alarm_Priority')).toBe(1)
    expect(output.publicApiDeclarations).toEqual(expect.arrayContaining([
      'bool FG_Add_Plant_Alarms_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
      'bool FG_Add_Remote_Alarm_Bank_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
    ]))
    expect(output.code).not.toContain('FG_Add_Renamed_Critical_List_Alarm')
    expect(output.code).not.toContain('FG_Add_Another_Display_Name_Alarm')
  })

  it('keeps Alarm Panel contracts with other Native Components without duplicate typedefs', () => {
    const sensorTile = {
      id: 'temperature-tile', parent: 'root', type: 'SensorTile', children: [], props: {
        x: 460, y: 20, w: 220, h: 140, generateRuntimeApi: true,
        enableUserEvents: true, title: 'Temperature', value: 23.5, units: 'C',
      },
    } as unknown as IComponent
    const output = generate(alarmPanel('mixed-alarm'), sensorTile)
    const declarations = output.publicApiDeclarations.join('\n')
    expect(enumCount(declarations, 'FG_Alarm_Priority')).toBe(1)
    expect(declarations).toContain(
      'bool FG_Add_Mixed_Alarm_Alarm(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);',
    )
    expect(output.code).toContain('FG_Set_Temperature_Tile_Value')
    expect(output.userEventContracts).toContainEqual({
      name: 'FG_On_Mixed_Alarm_Alarm_Added',
      parameters: 'int32_t alarm_id, FG_Alarm_Priority priority',
    })
  })

  it('gates optional presentation and supports auto-clear without heap allocation', () => {
    const output = generate(alarmPanel('compact', { compactMode: true, showTimestamp: false,
      showPriority: false, showAcknowledgement: false, autoClear: true }))
    expect(output.code).not.toContain('malloc(')
    expect(output.code).not.toContain('free(')
    expect(output.code).toContain('fg_compact_alarm_occupied[i] = false; fg_compact_alarm_count--;')
    expect(output.code).toContain('&lv_font_montserrat_10')
  })

  it('can dump a two-instance physical proof payload', () => {
    if (!process.env.FORGEUI_DUMP_ALARM_PAYLOAD) return
    const output = generate(alarmPanel('alarm-standard', { alarmCapacity: 8,
      maximumVisibleAlarms: 5, x: 20, y: 70, w: 480, h: 500, alarms: [
        { id: 'pressure', message: 'High discharge pressure', timestamp: '14:22:18', state: 'alarm', priority: 'critical' },
        { id: 'temperature', message: 'Motor temperature elevated', timestamp: '14:20:04', state: 'warning', priority: 'high' },
        { id: 'service', message: 'Filter service due', timestamp: '13:48:31', state: 'acknowledged', priority: 'medium' },
      ] }),
    alarmPanel('alarm-compact', { alarmCapacity: 4, maximumVisibleAlarms: 4,
      compactMode: true, showTimestamp: false, x: 520, y: 70, w: 480, h: 360, alarms: [
        { id: 'network', message: 'Network link unavailable', timestamp: '14:23:02', state: 'alarm', priority: 'critical' },
        { id: 'flow', message: 'Flow below target', timestamp: '14:21:16', state: 'warning', priority: 'medium' },
      ] }))
    fs.writeFileSync(process.env.FORGEUI_DUMP_ALARM_PAYLOAD, JSON.stringify(output))
  })
})
