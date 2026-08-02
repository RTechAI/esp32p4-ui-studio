import { generateForgeUILvglCode } from './ForgeUILvglExport'

const panel = (id: string, capacity = 16): IComponent => ({ id, componentName: id, type: 'AlarmPanel', parent: 'root', children: [], props: { x: 10, y: 10, w: 440, h: 320, maximumAlarms: capacity, simulationMode: 'multiple', generateRuntimeApi: true, enableUserEvents: true } })
const generate = (...panels: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: panels.map(item => item.id) }, ...Object.fromEntries(panels.map(item => [item.id, item])) }, 'graphite', undefined, { includeThemeTexture: false })

describe('Alarm Panel LVGL and Runtime SDK export', () => {
  it('emits fixed records, bounded semantic APIs and alarm-id hooks', () => {
    const generated = generate(panel('Main'))
    expect(generated.code).toContain('static fg_alarm_record_t fg_main_alarm_records[16]')
    expect(generated.code).toContain('void FG_Add_Main_Alarm(const char * alarm_id, const char * title, fg_alarm_severity_t severity)')
    expect(generated.code).toContain('void FG_Acknowledge_Main_Alarm(const char * alarm_id)')
    expect(generated.code).toContain('void FG_Clear_Main_Alarm(const char * alarm_id)')
    expect(generated.code).toContain('void FG_Clear_All_Main_Alarms(void)')
    expect(generated.userEventHooks).toEqual(expect.arrayContaining(['FG_On_Main_Alarm_Selected', 'FG_On_Main_Alarm_Acknowledged', 'FG_On_Main_Alarm_Cleared']))
    const acknowledge = generated.code.slice(generated.code.indexOf('void FG_Acknowledge_Main_Alarm'), generated.code.indexOf('void FG_Clear_Main_Alarm'))
    expect(acknowledge).not.toContain('FG_On_')
    expect(generated.code).not.toContain('malloc(')
  })

  it('keeps duplicate panels and capacities independent', () => {
    const code = generate(panel('Port', 16), panel('Starboard', 32)).code
    expect(code).toContain('fg_port_alarm_records[16]')
    expect(code).toContain('fg_starboard_alarm_records[32]')
    expect(code).toContain('FG_Add_Port_Alarm')
    expect(code).toContain('FG_Add_Starboard_Alarm')
  })
})
