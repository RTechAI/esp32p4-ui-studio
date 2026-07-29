import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const messageBox = (
  id = 'message',
  props: Record<string, unknown> = {},
  componentName = 'Message',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Msgbox',
  componentName,
  props: { x: 20, y: 20, w: 280, h: 160, ...props },
  children: [],
})

const generate = (...children: IComponent[]) => {
  const components: IComponents = {
    root: {
      id: 'root', parent: 'root', type: 'Box', props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }
  return generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  )
}

describe('Message Box generated developer API', () => {
  it('retains the eager visible panel and preserves defaults', () => {
    const generated = generate(messageBox())

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Show_Message(void);',
      'void FG_Close_Message(void);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Message_Shown',
      'FG_On_Message_Closed',
      'FG_On_Message_Button_Pressed',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_message_message_box = NULL;',
    )
    expect(generated.code).toContain(
      'static bool fg_message_message_box_visible = true;',
    )
    expect(generated.code).toContain(
      'lv_label_set_text(obj1_title, "Message");',
    )
    expect(generated.code).toContain(
      'lv_label_set_text(obj1_text, "Example message text");',
    )
    expect(generated.code).toContain(
      'lv_label_set_text(obj1_button_0_label, "OK");',
    )
    expect(generated.code).toContain(
      'lv_label_set_text(obj1_button_1_label, "Cancel");',
    )
  })

  it('emits the approved root, typography and outlined button styles', () => {
    const { code } = generate(messageBox())

    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1, LV_OPA_COVER, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1, 1, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_radius(obj1, 8, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_shadow_width(obj1, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_outline_width(obj1, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1, 8, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1_title, &lv_font_montserrat_16, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_text_font(obj1_text, &lv_font_montserrat_14, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_align(obj1_title, LV_ALIGN_TOP_LEFT, 0, 0);',
    )
    expect(code).toContain(
      'lv_obj_align(obj1_text, LV_ALIGN_TOP_LEFT, 0, 38);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_opa(obj1_button_0, LV_OPA_TRANSP, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1_button_0, 1, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_radius(obj1_button_0, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_shadow_width(obj1_button_0, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_outline_width(obj1_button_0, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1_button_0, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_align(obj1_button_0, LV_ALIGN_BOTTOM_RIGHT, -70, 0);',
    )
    expect(code).toContain(
      'lv_obj_align(obj1_button_1, LV_ALIGN_BOTTOM_RIGHT, 0, 0);',
    )
  })

  it('uses one guarded Show and Close visibility helper', () => {
    const { code } = generate(messageBox())

    expect(code).toContain(
      'if (message_box == NULL || current_visibility == NULL || *current_visibility == visible) return false;',
    )
    expect(code).toContain(
      'lv_obj_clear_flag(message_box, LV_OBJ_FLAG_HIDDEN);',
    )
    expect(code).toContain('lv_obj_move_foreground(message_box);')
    expect(code).toContain(
      'lv_obj_add_flag(message_box, LV_OBJ_FLAG_HIDDEN);',
    )
    expect(code).toContain(
      'fg_message_box_set_visible(fg_message_message_box, &fg_message_message_box_visible, true)',
    )
    expect(code).toContain(
      'fg_message_box_set_visible(fg_message_message_box, &fg_message_message_box_visible, false)',
    )
    expect(code).toContain('FG_On_Message_Shown();')
    expect(code).toContain('FG_On_Message_Closed();')
  })

  it('reports button index and stable configured text without closing', () => {
    const { code } = generate(messageBox())

    expect(code).toContain(
      'static const fg_message_button_event_data_t fg_message_message_button_0_data = { 0, "OK", FG_On_Message_Button_Pressed };',
    )
    expect(code).toContain(
      'static const fg_message_button_event_data_t fg_message_message_button_1_data = { 1, "Cancel", FG_On_Message_Button_Pressed };',
    )
    expect(code).toContain(
      'lv_obj_add_event_cb(obj1_button_0, fg_message_button_clicked_cb, LV_EVENT_CLICKED',
    )
    expect(code).toContain('data->hook(data->index, data->text);')

    const callback = code.slice(
      code.indexOf('static void fg_message_button_clicked_cb'),
      code.indexOf('void FG_Show_Message'),
    )
    expect(callback).not.toContain('FG_Close_Message')
    expect(callback).not.toContain('LV_OBJ_FLAG_HIDDEN')
  })

  it('honors persisted title, body, and button order', () => {
    const { code } = generate(messageBox('configured', {
      title: 'Warning',
      bodyText: 'Temperature high',
      buttons: ['Retry', 'Ignore', 'Cancel'],
    }))

    expect(code).toContain('lv_label_set_text(obj1_title, "Warning");')
    expect(code).toContain(
      'lv_label_set_text(obj1_text, "Temperature high");',
    )
    expect(code).toContain(
      'fg_message_message_button_0_data = { 0, "Retry"',
    )
    expect(code).toContain(
      'fg_message_message_button_1_data = { 1, "Ignore"',
    )
    expect(code).toContain(
      'fg_message_message_button_2_data = { 2, "Cancel"',
    )
  })

  it('does not invoke hooks during eager creation', () => {
    const { code } = generate(messageBox())
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))

    expect(creation).not.toContain('FG_On_Message_Shown(')
    expect(creation).not.toContain('FG_On_Message_Closed(')
    expect(creation).not.toContain('FG_On_Message_Button_Pressed(')
  })

  it('allocates collision-safe APIs, objects, and hooks', () => {
    const generated = generate(
      messageBox('a'),
      messageBox('b'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Show_Message(void);',
      'void FG_Close_Message(void);',
      'void FG_Show_Message_2(void);',
      'void FG_Close_Message_2(void);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Message_Button_Pressed',
      'FG_On_Message_2_Button_Pressed',
    ]))
    expect(generated.code).toContain('fg_message_message_box = lv_obj_create')
    expect(generated.code).toContain('fg_message_2_message_box = lv_obj_create')
  })

  it('can dump the live endpoint validation payload', () => {
    if (!process.env.FORGEUI_DUMP_MSGBOX_PAYLOAD) return
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_MSGBOX_PAYLOAD,
      JSON.stringify(generate(messageBox())),
    )
  })
})
