import { generateForgeUILvglCode } from './ForgeUILvglExport'

const icon = (
  id: string,
  componentName: string,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Icon',
  componentName,
  props: { x: 10, y: 20, w: 96, h: 80, icon: 'FiSettings', ...props },
  children: [],
})

const generate = (...children: IComponent[]) => generateForgeUILvglCode({
  root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: children.map(child => child.id) },
  ...Object.fromEntries(children.map(child => [child.id, child])),
}, 'graphite', undefined, { includeThemeTexture: false })

describe('Fi Icon Runtime generation', () => {
  it('hydrates old icons to runtime ON and click OFF', () => {
    const generated = generate(icon('airplay', 'Living Room AirPlay'))
    expect(generated.fiRuntimeHeader).toContain('void FG_Set_Living_Room_AirPlay_Visible(bool visible);')
    expect(generated.fiRuntimeHeader).toContain('void FG_Set_Living_Room_AirPlay_Opacity(uint8_t opacity);')
    expect(generated.fiRuntimeHeader).toContain('void FG_Set_Living_Room_AirPlay_Color(uint32_t rgb);')
    expect(generated.code).toContain('#include "96_FiRuntime.h"')
    expect(generated.code).toContain('fg_fi_bind_living_room_airplay(obj1, true);')
    expect(generated.code).toContain('lv_obj_clear_flag(obj1, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);')
    expect(generated.userEventHooks).toEqual([])
  })

  it('generates silent, retained, null-safe and repeated-value-suppressing setters', () => {
    const { fiRuntimeSource } = generate(icon('wifi', 'Plant WiFi', { icon: 'FiWifi' }))
    expect(fiRuntimeSource).toContain('if (fg_fi_plant_wifi_visible == visible) return;')
    expect(fiRuntimeSource).toContain('if (fg_fi_plant_wifi_object == NULL) return;')
    expect(fiRuntimeSource).toContain('rgb &= 0xFFFFFFu;')
    expect(fiRuntimeSource).toContain('lv_obj_set_style_text_color')
    expect(fiRuntimeSource).toContain('lv_obj_set_style_image_recolor')
    expect(fiRuntimeSource).not.toContain('FG_On_')
    expect(fiRuntimeSource).not.toContain('printf')
  })

  it('adds one click callback, pressed appearance and preservation hook only when enabled', () => {
    const generated = generate(icon('settings', 'Settings Shortcut', {
      generateRuntimeApi: false,
      enableClick: true,
      pressedColor: '#FF8800',
      pressedOpacity: 60,
    }))
    expect(generated.fiRuntimeSource).toBe('')
    expect(generated.code).not.toContain('#include "96_FiRuntime.h"')
    expect(generated.code).toContain('#include "95_UserEvents.h"')
    expect(generated.code).toContain('LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE')
    expect(generated.code).toContain('lv_color_hex(0xFF8800), LV_STATE_PRESSED')
    expect(generated.code).toContain('lv_obj_set_style_opa(obj1, 153, LV_STATE_PRESSED)')
    expect(generated.code.match(/FG_On_Settings_Shortcut_Clicked\(\);/g)).toHaveLength(1)
    expect(generated.userEventHooks).toEqual(['FG_On_Settings_Shortcut_Clicked'])
  })

  it('uses deterministic component-name collision suffixes independent of icon identity', () => {
    const generated = generate(
      icon('a', 'Plant WiFi', { icon: 'FiWifi' }),
      icon('b', 'Plant-WiFi', { icon: 'FiSettings' }),
      icon('c', 'Plant WiFi', { enableClick: true }),
    )
    expect(generated.fiRuntimeHeader).toContain('FG_Set_Plant_WiFi_Visible')
    expect(generated.fiRuntimeHeader).toContain('FG_Set_Plant_WiFi_2_Visible')
    expect(generated.fiRuntimeHeader).toContain('FG_Set_Plant_WiFi_3_Visible')
    expect(generated.userEventHooks).toEqual(['FG_On_Plant_WiFi_3_Clicked'])
  })

  it('gates all runtime and event output when both instance features are disabled', () => {
    const generated = generate(icon('plain', 'Plain Icon', {
      generateRuntimeApi: false,
      enableClick: false,
    }))
    expect(generated.fiRuntimeHeader).toBe('')
    expect(generated.fiRuntimeSource).toBe('')
    expect(generated.code).not.toContain('96_FiRuntime')
    expect(generated.code).not.toContain('95_UserEvents')
    expect(generated.userEventHooks).toEqual([])
  })

  it('is deterministic for Live and Standalone consumers', () => {
    const proof = icon('proof', 'Living Room AirPlay', { enableClick: true })
    expect(generate(proof)).toEqual(generate(proof))
  })
})
