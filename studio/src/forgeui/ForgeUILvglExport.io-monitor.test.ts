import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

const ioMonitor = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, parent: 'root', type: 'IOMonitor', children: [], props: {
    x: 20, y: 20, w: 420, h: 300, maximumRows: 8, generateRuntimeApi: true,
    enableUserEvents: true, rows: [
      { id: 'di', ioType: 'digital-input', channel: 'DI1', displayName: 'Door', value: 0, state: false, units: '', colour: '#22C55E', showValue: false, showState: true, visible: true },
      { id: 'ai', ioType: 'analog-input', channel: 'AI1', displayName: 'Pressure', value: 4.62, state: true, units: 'bar', colour: '#F2A900', showValue: true, showState: true, visible: true },
    ], ...props,
  },
})
const generate = (...children: IComponent[]) => generateForgeUILvglCode({
  root: { id: 'root', parent: '', type: 'Root', props: {}, children: children.map(child => child.id) } as unknown as IComponent,
  ...Object.fromEntries(children.map(child => [child.id, child])),
}, 'graphite', undefined, { includeThemeTexture: false })

describe('IO Monitor LVGL export', () => {
  it('emits private fixed storage, semantic setters, and selection only', () => {
    const output = generate(ioMonitor('io-monitor-main'))
    expect(output.publicApiDeclarations).toEqual(expect.arrayContaining([
      'bool FG_Set_Io_Monitor_Main_DigitalInput(const char * channel, bool state);',
      'bool FG_Set_Io_Monitor_Main_DigitalOutput(const char * channel, bool state);',
      'bool FG_Set_Io_Monitor_Main_AnalogInput(const char * channel, float value);',
      'bool FG_Set_Io_Monitor_Main_AnalogOutput(const char * channel, float value);',
    ]))
    expect(output.userEventContracts).toContainEqual({ name: 'FG_On_Io_Monitor_Main_Row_Selected', parameters: 'const char * channel, FG_IO_Type io_type' })
    expect(output.userEventHooks).not.toContain('FG_On_Io_Monitor_Main_State_Changed')
    expect(output.code).toContain('static float fg_io_monitor_main_io_values[2]')
    expect(output.code).toContain('strcmp(fg_io_monitor_main_io_channels[i], channel) == 0')
    expect(output.code).not.toContain('malloc(')
  })

  it('uses persisted IDs and isolates duplicate instances', () => {
    const first = ioMonitor('io-a'); first.componentName = 'Renamed Monitor'
    const output = generate(first, ioMonitor('io-b'))
    expect(output.code).toContain('FG_Set_Io_A_DigitalInput')
    expect(output.code).toContain('FG_Set_Io_B_DigitalInput')
    expect(output.code).not.toContain('FG_Set_Renamed_Monitor_DigitalInput')
    expect(output.code).toContain('fg_io_a_io_values')
    expect(output.code).toContain('fg_io_b_io_values')
  })

  it('can dump a two-instance hardware proof payload', () => {
    if (!process.env.FORGEUI_DUMP_IO_MONITOR_PAYLOAD) return
    const output = generate(
      ioMonitor('io-monitor-left', { x: 20, y: 70, w: 480, h: 500, title: 'Controller Inputs', rows: [
        { id: 'di1', ioType: 'digital-input', channel: 'DI1', displayName: 'Emergency Stop', state: false, colour: '#E5484D', showState: true, visible: true },
        { id: 'di2', ioType: 'digital-input', channel: 'DI2', displayName: 'Door Switch', state: true, colour: '#22C55E', showState: true, visible: true },
        { id: 'ai1', ioType: 'analog-input', channel: 'AI1', displayName: 'Pressure', value: 4.62, state: true, units: 'bar', colour: '#F2A900', showValue: true, showState: true, visible: true },
        { id: 'ai2', ioType: 'analog-input', channel: 'AI2', displayName: 'Temperature', value: 28.4, state: true, units: 'C', colour: '#38BDF8', showValue: true, showState: true, visible: true },
      ] }),
      ioMonitor('io-monitor-right', { x: 520, y: 70, w: 480, h: 500, title: 'Controller Outputs', compactMode: true, rows: [
        { id: 'do1', ioType: 'digital-output', channel: 'DO1', displayName: 'Pump', state: true, colour: '#22C55E', showState: true, visible: true },
        { id: 'do2', ioType: 'digital-output', channel: 'DO2', displayName: 'Valve', state: false, colour: '#38BDF8', showState: true, visible: true },
        { id: 'ao1', ioType: 'analog-output', channel: 'AO1', displayName: 'Fan Demand', value: 68, state: true, units: '%', colour: '#A78BFA', showValue: true, showState: true, visible: true },
        { id: 'ao2', ioType: 'analog-output', channel: 'AO2', displayName: 'Valve Demand', value: 42, state: true, units: '%', colour: '#F2A900', showValue: true, showState: true, visible: true },
      ] }),
    )
    // The removable proof export is copied from the live firmware template,
    // whose developer-owned UserEvents may retain earlier Alarm callbacks.
    // Keep their public parameter types available without adding Alarm UI.
    output.publicApiDeclarations.unshift(
      'typedef enum { FG_ALARM_PRIORITY_LOW = 0, FG_ALARM_PRIORITY_MEDIUM = 1, FG_ALARM_PRIORITY_HIGH = 2, FG_ALARM_PRIORITY_CRITICAL = 3 } FG_Alarm_Priority;',
      'typedef enum { FG_ALARM_STATE_NORMAL = 0, FG_ALARM_STATE_WARNING = 1, FG_ALARM_STATE_ALARM = 2, FG_ALARM_STATE_ACKNOWLEDGED = 3, FG_ALARM_STATE_CLEARED = 4 } FG_Alarm_State;',
    )
    fs.writeFileSync(process.env.FORGEUI_DUMP_IO_MONITOR_PAYLOAD, JSON.stringify(output))
  })
})
