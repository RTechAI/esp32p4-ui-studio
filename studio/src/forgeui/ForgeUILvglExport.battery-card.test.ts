import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'
const battery = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'BatteryCard', children: [], props: { x: 20, y: 40, w: 240, h: 145, percentage: 76, voltage: 12.6, current: -1.4, charging: false, health: 'good', remainingMinutes: 185, temperature: 31.5, lowThreshold: 20, criticalThreshold: 10, generateRuntimeApi: true, ...props } })
const generate = (...items: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: '', type: 'Box', children: items.map(i => i.id), props: { w: 1024, h: 600 } } as IComponent, ...Object.fromEntries(items.map(i => [i.id, i])) }, 'graphite', undefined, { includeThemeTexture: false })
describe('Battery Card LVGL export', () => {
  it('exports stackable default and minimum geometry without clipping metrics', () => {
    const normal = generate(battery('battery-default')).code
    expect(normal).toContain('lv_obj_set_size(fg_battery_default_battery, 240, 145);')
    expect(normal).toContain('lv_obj_set_size(fg_battery_default_battery_bar, 220, 6);')
    expect(normal).toContain('lv_obj_set_size(fg_battery_default_battery_voltage_label_tile, 70, 24);')
    const minimum = generate(battery('battery-minimum', { w: 220, h: 128 })).code
    expect(minimum).toContain('lv_obj_set_size(fg_battery_minimum_battery, 220, 128);')
    expect(minimum).toContain('lv_obj_set_pos(fg_battery_minimum_battery_temperature_label_tile, 10, 94);')
    expect(minimum).toContain('lv_label_set_long_mode(fg_battery_minimum_battery_voltage_label, LV_LABEL_LONG_DOT);')
  })
  it('preserves exact 0, 1, 50, 99 and 100 percent inputs and bounded icon fill', () => {
    const out = generate(...[0, 1, 50, 99, 100].map(level => battery(`battery-${level}`, { percentage: level })))
    ;[0, 1, 50, 99, 100].forEach(level => expect(out.code).toContain(`static float fg_battery${level}_battery_percentage = ${level.toFixed(1)}f;`))
    expect(out.code).toContain('int32_t fill_w = (int32_t)(18.0f * fg_battery100_battery_percentage / 100.0f);')
    expect(out.code).toContain('if (fill_w < 0) fill_w = 0; if (fill_w > 18) fill_w = 18;')
    expect(out.code).toContain('lv_bar_set_value(fg_battery100_battery_bar, (int32_t)fg_battery100_battery_percentage, LV_ANIM_OFF);')
    expect(out.code).toContain('fg_battery100_battery_percentage = value < 0.0f ? 0.0f : (value > 100.0f ? 100.0f : value);')
  })
  it('emits private state, seven silent setters, and no UserEvents', () => {
    const out = generate(battery('battery-main'))
    expect(out.publicApiDeclarations).toEqual(expect.arrayContaining(['void FG_Set_Battery_Main_Percentage(float value);','void FG_Set_Battery_Main_Voltage(float value);','void FG_Set_Battery_Main_Current(float value);','void FG_Set_Battery_Main_Charging(bool enabled);','void FG_Set_Battery_Main_Health(int32_t value);','void FG_Set_Battery_Main_Runtime(int32_t value);','void FG_Set_Battery_Main_Temperature(float value);']))
    expect(out.userEventContracts.filter(e => e.name.includes('Battery'))).toEqual([])
    expect(out.code).toContain('static float fg_battery_main_battery_percentage'); expect(out.code).toContain('LV_ANIM_OFF')
    expect(out.code).toContain('fg_battery_main_battery_status_label'); expect(out.code).toContain('fg_battery_main_battery_icon_fill')
    expect(out.code).toContain('battery_icon'); expect(out.code).toContain('fg_battery_main_battery_voltage_label_tile')
    expect(out.code).toContain('lv_obj_set_style_bg_color(fg_battery_main_battery_bar, lv_color_hex(0x2A3138), LV_PART_MAIN)')
    ;['Percentage','Voltage','Current','Charging','Health','Runtime','Temperature'].forEach(name => expect(out.code).toMatch(new RegExp(`void FG_Set_Battery_Main_${name}\\([^}]+fg_battery_main_battery_refresh\\(\\); \\}`)))
  })
  it('uses persisted IDs and isolates duplicate storage and SDK names', () => {
    const a = battery('battery-a'); a.componentName = 'Renamed'; const out = generate(a, battery('battery-b'))
    expect(out.code).toContain('FG_Set_Battery_A_Percentage'); expect(out.code).toContain('FG_Set_Battery_B_Percentage'); expect(out.code).not.toContain('FG_Set_Renamed_Percentage')
  })
  it('can dump a three-instance compact hardware proof payload', () => {
    if (!process.env.FORGEUI_DUMP_BATTERY_CARD_PAYLOAD) return
    const out = generate(
      battery('battery-a', { title: 'Battery A', x: 40, y: 100, percentage: 18, current: -1.8, charging: false }),
      battery('battery-b', { title: 'Battery B', x: 300, y: 100, percentage: 52, current: -0.8, charging: false }),
      battery('battery-c', { title: 'Battery C', x: 560, y: 100, percentage: 87, current: 2.4, charging: true }),
    )
    fs.writeFileSync(process.env.FORGEUI_DUMP_BATTERY_CARD_PAYLOAD, JSON.stringify(out))
  })
})
