import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'

const tank = (id: string, props: Record<string, unknown> = {}): IComponent => ({ id, parent: 'root', type: 'TankLevelCard', children: [], props: { x: 20, y: 40, w: 240, h: 145, level: 68, currentVolume: 680, capacity: 1000, units: 'L', lowLevel: 20, highLevel: 90, criticalLevel: 5, generateRuntimeApi: true, ...props } })
const generate = (...items: IComponent[]) => generateForgeUILvglCode({ root: { id: 'root', parent: '', type: 'Box', children: items.map(item => item.id), props: { w: 1024, h: 600 } } as IComponent, ...Object.fromEntries(items.map(item => [item.id, item])) }, 'graphite', undefined, { includeThemeTexture: false })

describe('Tank Level Card LVGL export', () => {
  it('exports stackable default/minimum geometry and bounded vertical fill',()=>{
    const normal=generate(tank('tank-default')).code; expect(normal).toContain('lv_obj_set_size(fg_tank_default_tank, 240, 145);'); expect(normal).toContain('lv_obj_set_size(fg_tank_default_tank_vessel, 48, 104);'); expect(normal).toContain('lv_obj_set_size(fg_tank_default_tank_fill, LV_PCT(100), LV_PCT(100));')
    const minimum=generate(tank('tank-minimum',{w:220,h:128})).code; expect(minimum).toContain('lv_obj_set_size(fg_tank_minimum_tank, 220, 128);'); expect(minimum).toContain('lv_obj_set_size(fg_tank_minimum_tank_vessel, 48, 87);'); expect(minimum).toContain('lv_label_set_long_mode(fg_tank_minimum_tank_volume_label, LV_LABEL_LONG_DOT);')
  })

  it('preserves exact 0, 1, 50, 99 and 100 percent fill inputs',()=>{
    const out=generate(...[0,1,50,99,100].map(level=>tank(`tank-${level}`,{level,currentVolume:level*10}))); [0,1,50,99,100].forEach(level=>{const stem=`fg_tank${level}_tank`; expect(out.code).toContain(`static float ${stem}_level = ${level.toFixed(1)}f;`); expect(out.code).toContain(`lv_bar_set_value(${stem}_fill, (int32_t)bounded, LV_ANIM_ON)`)}); expect(out.code).toContain('float bounded = fg_tank100_tank_level < 0.0f ? 0.0f : (fg_tank100_tank_level > 100.0f ? 100.0f : fg_tank100_tank_level);')
  })
  it('emits private state, six silent setters, status rendering, and no UserEvents', () => {
    const out = generate(tank('tank-main'))
    expect(out.publicApiDeclarations).toEqual(expect.arrayContaining(['void FG_Set_Tank_Main_Level(float percent);','void FG_Set_Tank_Main_Volume(float value);','void FG_Set_Tank_Main_Capacity(float value);','void FG_Set_Tank_Main_Units(const char * units);','void FG_Set_Tank_Main_LowLevel(float value);','void FG_Set_Tank_Main_HighLevel(float value);']))
    expect(out.userEventContracts.filter(event => event.name.includes('Tank'))).toEqual([])
    expect(out.code).toContain('static float fg_tank_main_tank_level')
    expect(out.code).toContain('"OVERFLOW"')
    expect(out.code).toContain('fg_tank_main_tank_fill')
    expect(out.code).toContain('lv_bar_set_value(fg_tank_main_tank_fill, (int32_t)bounded, LV_ANIM_ON)')
    ;['Level','Volume','Capacity','Units','LowLevel','HighLevel'].forEach(name=>expect(out.code).toMatch(new RegExp(`void FG_Set_Tank_Main_${name}\\([^}]+fg_tank_main_tank_refresh\\(\\); \\}`)))
  })

  it('uses persisted IDs and isolates duplicate storage and SDK names', () => {
    const first = tank('tank-a'); first.componentName = 'Renamed'
    const out = generate(first, tank('tank-b'))
    expect(out.code).toContain('FG_Set_Tank_A_Level'); expect(out.code).toContain('FG_Set_Tank_B_Level'); expect(out.code).not.toContain('FG_Set_Renamed_Level')
  })

  it('can dump a three-instance compact hardware proof payload', () => {
    if (!process.env.FORGEUI_DUMP_TANK_LEVEL_CARD_PAYLOAD) return
    const out = generate(
      tank('tank-a', { title: 'Tank A', x: 40, y: 100, level: 18, currentVolume: 180, capacity: 1000, units: 'L' }),
      tank('tank-b', { title: 'Tank B', x: 300, y: 100, level: 52, currentVolume: 520, capacity: 1000, units: 'L', tankShape: 'rectangular' }),
      tank('tank-c', { title: 'Tank C', x: 560, y: 100, level: 87, currentVolume: 870, capacity: 1000, units: 'L', tankShape: 'silo' }),
    )
    fs.writeFileSync(process.env.FORGEUI_DUMP_TANK_LEVEL_CARD_PAYLOAD, JSON.stringify(out))
  })
})
