import { generateForgeUILvglCode } from './ForgeUILvglExport'

const tileView = (
  id = 'tiles',
  props: Record<string, unknown> = {},
  componentName = 'Tileview',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Tileview',
  componentName,
  props: { x: 20, y: 30, w: 420, h: 240, ...props },
  children: [],
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root', parent: 'root', type: 'Box', props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('Tileview generated developer API', () => {
  it('retains the existing four-tile layout and runtime state', () => {
    const generated = generate(tileView())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);',
    )
    expect(generated.userEventHooks).toContain('FG_On_Tileview_Changed')
    expect(generated.code).toContain(
      'static lv_obj_t * fg_tileview_tileview = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_tileview_tileview_tiles[2][2] = {{NULL, NULL}, {NULL, NULL}};',
    )
    expect(generated.code).toContain(
      'static uint32_t fg_tileview_tileview_selected_column = 0;',
    )
    expect(generated.code).toContain(
      'static uint32_t fg_tileview_tileview_selected_row = 0;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_tileview_tileview_column_count = 2;',
    )
    expect(generated.code).toContain(
      'static const uint32_t fg_tileview_tileview_row_count = 2;',
    )
  })

  it('exports the simultaneous two-by-two preview layout exactly', () => {
    const { code } = generate(tileView())

    expect(code).toContain(
      'fg_tileview_tileview = lv_obj_create(fg_application_page);',
    )
    expect(code).toContain('lv_obj_t * obj1_tile1 = lv_obj_create(obj1);')
    expect(code).toContain('lv_obj_t * obj1_tile4 = lv_obj_create(obj1);')
    expect(code).toContain('lv_label_set_text(obj1_lbl4, "Tile 4");')
    expect(code).toContain('lv_obj_set_pos(obj1, 20, 30);')
    expect(code).toContain('lv_obj_set_size(obj1, 420, 240);')
    expect(code).toContain('lv_obj_set_pos(obj1_tile1, 8, 8);')
    expect(code).toContain('lv_obj_set_size(obj1_tile1, 198, 108);')
    expect(code).toContain('lv_obj_set_pos(obj1_tile2, 212, 8);')
    expect(code).toContain('lv_obj_set_size(obj1_tile2, 198, 108);')
    expect(code).toContain('lv_obj_set_pos(obj1_tile3, 8, 122);')
    expect(code).toContain('lv_obj_set_size(obj1_tile3, 198, 108);')
    expect(code).toContain('lv_obj_set_pos(obj1_tile4, 212, 122);')
    expect(code).toContain('lv_obj_set_size(obj1_tile4, 198, 108);')
    expect(code).toContain(
      'lv_obj_set_style_border_width(obj1, 1, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_pad_all(obj1, 0, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_clip_corner(obj1, true, LV_PART_MAIN);',
    )
    expect(code).not.toContain('lv_tileview_')
  })

  it('maps generated coordinates explicitly', () => {
    const { code } = generate(tileView())

    expect(code).toContain(
      'fg_tileview_tileview_tiles[0][0] = obj1_tile1;',
    )
    expect(code).toContain(
      'fg_tileview_tileview_tiles[1][0] = obj1_tile2;',
    )
    expect(code).toContain(
      'fg_tileview_tileview_tiles[0][1] = obj1_tile3;',
    )
    expect(code).toContain(
      'fg_tileview_tileview_tiles[1][1] = obj1_tile4;',
    )
    expect(code).toContain(
      'lv_obj_t * selected_tile = lv_event_get_current_target(event);',
    )
  })

  it('emits semantic selected-tile styling and state updates', () => {
    const { code } = generate(tileView())

    expect(code).toContain(
      'lv_obj_set_style_radius(obj1, 10, LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1_tile1, lv_color_hex(0x2A3138), LV_PART_MAIN);',
    )
    expect(code).toContain(
      'lv_obj_set_style_bg_color(obj1_tile1, lv_color_hex(0xF2A900), LV_PART_MAIN | LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'lv_obj_add_state(fg_tileview_tileview_tiles[0][0], LV_STATE_CHECKED);',
    )
    expect(code).toContain(
      'lv_obj_clear_state(previous_tile, LV_STATE_CHECKED);',
    )
    expect(code).toContain('lv_obj_add_state(tile, LV_STATE_CHECKED);')
  })

  it('shares one guarded transition for programmatic and touch selection', () => {
    const { code } = generate(tileView())

    expect(code).toContain(
      'if (column >= fg_tileview_tileview_column_count) column = fg_tileview_tileview_column_count - 1;',
    )
    expect(code).toContain(
      'if (row >= fg_tileview_tileview_row_count) row = fg_tileview_tileview_row_count - 1;',
    )
    expect(code).toContain(
      'if (column == fg_tileview_tileview_selected_column && row == fg_tileview_tileview_selected_row) return;',
    )
    expect(code).toContain('if (tile == NULL) return;')
    expect(code).toContain('(void)update_widget;')
    expect(code).toContain(
      'fg_tileview_tileview_apply_selection(column, row, false);',
    )
    expect(code).toContain(
      'fg_tileview_tileview_apply_selection(column, row, true);',
    )
    expect(code).toContain('FG_On_Tileview_Changed(column, row);')
    expect(code).toContain(
      'lv_obj_add_event_cb(obj1_tile1, fg_tileview_tileview_value_changed_cb, LV_EVENT_CLICKED, NULL);',
    )
  })

  it('does not invoke the hook during creation', () => {
    const { code } = generate(tileView())
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Tileview_Changed(')
  })

  it('honors existing persisted initial coordinates without notifying', () => {
    const { code } = generate(tileView('configured', {
      initialColumn: 1,
      initialRow: 1,
    }))

    expect(code).not.toContain('lv_tileview_set_tile')
    expect(code).toContain(
      'fg_tileview_tileview_selected_column = 1;',
    )
    expect(code).toContain('fg_tileview_tileview_selected_row = 1;')
  })

  it('allocates collision-safe APIs, objects, mappings, and hooks', () => {
    const generated = generate(tileView('a'), tileView('b'))

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Tileview_Selected(uint32_t column, uint32_t row);',
      'void FG_Set_Tileview_2_Selected(uint32_t column, uint32_t row);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Tileview_Changed',
      'FG_On_Tileview_2_Changed',
    ]))
    expect(generated.code).toContain(
      'fg_tileview_tileview = lv_obj_create',
    )
    expect(generated.code).toContain(
      'fg_tileview_2_tileview = lv_obj_create',
    )
  })
})
