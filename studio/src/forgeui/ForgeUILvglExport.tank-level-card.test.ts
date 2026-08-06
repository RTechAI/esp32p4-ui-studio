import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

const tank = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'TankLevelCard', children: [], props: { x: 20, y: 40, w: 460, h: 250, level: 68, currentVolume: 680, capacity: 1000, units: 'L', lowLevel: 20, highLevel: 90, criticalLevel: 5, generateRuntimeApi: true, ...props } })
const generate = (...items: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: '', type: 'Box', children: items.map(item => item.id), props: { w: 1024, h: 600 } } as IComponent, ...Object.fromEntries(items.map(item => [item.id, item])) }, 'graphite', undefined, { includeThemeTexture: false })

describe('Tank Level Card LVGL export', () => {
  it('emits private state, six silent setters, status rendering, and no UserEvents', () => {
    const out = generate(tank('tank-main'))
    expect(out.publicApiDeclarations).toEqual(expect.arrayContaining(['void FG_Set_Tank_Main_Level(float percent);','void FG_Set_Tank_Main_Volume(float value);','void FG_Set_Tank_Main_Capacity(float value);','void FG_Set_Tank_Main_Units(const char * units);','void FG_Set_Tank_Main_LowLevel(float value);','void FG_Set_Tank_Main_HighLevel(float value);']))
    expect(out.userEventContracts.filter(event => event.name.includes('Tank'))).toEqual([])
    expect(out.code).toContain('static float fg_tank_main_tank_level')
    expect(out.code).toContain('"OVERFLOW"')
    expect(out.code).toContain('fg_tank_main_tank_fill')
    expect(out.code).toContain('lv_bar_set_value(fg_tank_main_tank_fill, (int32_t)bounded, LV_ANIM_ON)')
  })

  it('uses persisted IDs and isolates duplicate storage and SDK names', () => {
    const first = tank('tank-a'); first.componentName = 'Renamed'
    const out = generate(first, tank('tank-b'))
    expect(out.code).toContain('FG_Set_Tank_A_Level'); expect(out.code).toContain('FG_Set_Tank_B_Level'); expect(out.code).not.toContain('FG_Set_Renamed_Level')
  })

  it('can dump a two-instance hardware proof payload', () => {
    if (!process.env.FORGEUI_DUMP_TANK_LEVEL_CARD_PAYLOAD) return
    const out = generate(
      tank('tank-left', { title: 'Process Water', x: 20, y: 70, w: 470, h: 470, level: 68, currentVolume: 680, capacity: 1000, units: 'L' }),
      tank('tank-right', { title: 'Fuel Reserve', x: 530, y: 70, w: 470, h: 470, level: 18, currentVolume: 216, capacity: 1200, units: 'L', compactMode: true, tankShape: 'silo' }),
    )
    out.code = out.code.replace('fg_ram_probe_log("02 after application page creation");', 'FG_Set_Tank_Left_Level(74.0f); FG_Set_Tank_Left_Volume(740.0f); FG_Set_Tank_Left_Capacity(1000.0f); FG_Set_Tank_Left_Units("L"); FG_Set_Tank_Left_LowLevel(20.0f); FG_Set_Tank_Left_HighLevel(90.0f); FG_Set_Tank_Right_Level(12.0f); FG_Set_Tank_Right_Volume(144.0f); FG_Set_Tank_Right_Capacity(1200.0f); FG_Set_Tank_Right_Units("L"); FG_Set_Tank_Right_LowLevel(18.0f); FG_Set_Tank_Right_HighLevel(92.0f); fg_ram_probe_log("02 after Tank Level Card SDK proof updates");')
    fs.writeFileSync(process.env.FORGEUI_DUMP_TANK_LEVEL_CARD_PAYLOAD, JSON.stringify(out))
  })
})
