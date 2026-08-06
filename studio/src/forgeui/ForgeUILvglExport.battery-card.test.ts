import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'
const battery = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'BatteryCard', children: [], props: { x: 20, y: 40, w: 460, h: 250, percentage: 76, voltage: 12.6, current: -1.4, charging: false, health: 'good', remainingMinutes: 185, temperature: 31.5, lowThreshold: 20, criticalThreshold: 10, generateRuntimeApi: true, ...props } })
const generate = (...items: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: '', type: 'Box', children: items.map(i => i.id), props: { w: 1024, h: 600 } } as IComponent, ...Object.fromEntries(items.map(i => [i.id, i])) }, 'graphite', undefined, { includeThemeTexture: false })
describe('Battery Card LVGL export', () => {
  it('emits private state, seven silent setters, and no UserEvents', () => {
    const out = generate(battery('battery-main'))
    expect(out.publicApiDeclarations).toEqual(expect.arrayContaining(['void FG_Set_Battery_Main_Percentage(float value);','void FG_Set_Battery_Main_Voltage(float value);','void FG_Set_Battery_Main_Current(float value);','void FG_Set_Battery_Main_Charging(bool enabled);','void FG_Set_Battery_Main_Health(int32_t value);','void FG_Set_Battery_Main_Runtime(int32_t value);','void FG_Set_Battery_Main_Temperature(float value);']))
    expect(out.userEventContracts.filter(e => e.name.includes('Battery'))).toEqual([])
    expect(out.code).toContain('static float fg_battery_main_battery_percentage'); expect(out.code).toContain('LV_ANIM_OFF')
    expect(out.code).toContain('fg_battery_main_battery_status_label'); expect(out.code).toContain('fg_battery_main_battery_icon_fill')
    expect(out.code).toContain('battery_icon'); expect(out.code).toContain('fg_battery_main_battery_voltage_label_tile')
    expect(out.code).toContain('lv_obj_set_style_bg_color(fg_battery_main_battery_bar, lv_color_hex(0x2A3138), LV_PART_MAIN)')
  })
  it('uses persisted IDs and isolates duplicate storage and SDK names', () => {
    const a = battery('battery-a'); a.componentName = 'Renamed'; const out = generate(a, battery('battery-b'))
    expect(out.code).toContain('FG_Set_Battery_A_Percentage'); expect(out.code).toContain('FG_Set_Battery_B_Percentage'); expect(out.code).not.toContain('FG_Set_Renamed_Percentage')
  })
  it('can dump a two-instance hardware proof payload', () => {
    if (!process.env.FORGEUI_DUMP_BATTERY_CARD_PAYLOAD) return
    const out = generate(battery('battery-left', { title: 'Main Battery', percentage: 76, x: 20 }), battery('battery-right', { title: 'Backup UPS', percentage: 18, voltage: 24.3, current: 2.1, charging: true, health: 'fair', x: 520, compactMode: true }))
    out.code = out.code.replace('fg_ram_probe_log("02 after application page creation");', 'FG_Set_Battery_Left_Percentage(64.0f); FG_Set_Battery_Left_Voltage(12.42f); FG_Set_Battery_Left_Current(-2.25f); FG_Set_Battery_Left_Charging(false); FG_Set_Battery_Left_Health(0); FG_Set_Battery_Left_Runtime(142); FG_Set_Battery_Left_Temperature(33.8f); FG_Set_Battery_Right_Percentage(27.0f); FG_Set_Battery_Right_Voltage(25.10f); FG_Set_Battery_Right_Current(3.40f); FG_Set_Battery_Right_Charging(true); FG_Set_Battery_Right_Health(1); FG_Set_Battery_Right_Runtime(88); FG_Set_Battery_Right_Temperature(29.6f); fg_ram_probe_log("02 after Battery Card SDK proof updates");')
    fs.writeFileSync(process.env.FORGEUI_DUMP_BATTERY_CARD_PAYLOAD, JSON.stringify(out))
  })
})
