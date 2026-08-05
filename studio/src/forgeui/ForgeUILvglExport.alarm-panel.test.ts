import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

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
