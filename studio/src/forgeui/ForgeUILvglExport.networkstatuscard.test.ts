import { generateForgeUILvglCode } from './ForgeUILvglExport'
const card = (id: string): IComponent => ({ id, componentName: id, type: 'NetworkStatusCard', parent: 'root', children: [], props: { x: 10, y: 10, w: 380, h: 300, simulationMode: 'wifi-connected', generateRuntimeApi: true, enableUserEvents: true } })
const generate = (...cards: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: cards.map(card => card.id) }, ...Object.fromEntries(cards.map(card => [card.id, card])) }, 'graphite', undefined, { includeThemeTexture: false })
describe('Network Status Card export', () => {
  it('emits enum, silent APIs and UserEvents', () => {
    const output = generate(card('Main'))
    expect(output.publicApiDeclarations).toEqual(expect.arrayContaining(['void FG_Set_Main_Network_State(fg_network_state_t state);','void FG_Set_Main_Network_SSID(const char * ssid);','void FG_Set_Main_Network_MQTT(bool connected);']))
    expect(output.code).toContain('FG_NETWORK_STATE_AUTHENTICATION_FAILED')
    expect(output.userEventHooks).toEqual(expect.arrayContaining(['FG_On_Main_Network_Selected','FG_On_Main_Network_Reconnect_Requested','FG_On_Main_Network_Details_Requested']))
    expect(output.code.slice(output.code.indexOf('void FG_Set_Main_Network_State'), output.code.indexOf('void FG_Set_Main_Network_SSID'))).not.toContain('FG_On_')
  })
  it('isolates duplicates', () => { const code = generate(card('Main'), card('Backup')).code; expect(code).toContain('fg_main_network_data'); expect(code).toContain('fg_backup_network_data') })
})
