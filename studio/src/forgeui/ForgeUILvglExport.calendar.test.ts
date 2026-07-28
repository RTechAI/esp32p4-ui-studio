import fs from 'fs'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const calendar = (
  id = 'calendar',
  componentName = 'Calendar',
): IComponent => ({
  id,
  parent: 'root',
  type: 'Calendar',
  componentName,
  props: { positionMode: 'absolute', x: 20, y: 20, w: 300, h: 280 },
  children: [],
})

const generate = (...children: IComponent[]) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
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

describe('Calendar generated developer API', () => {
  it('retains the object and selected date while preserving creation defaults', () => {
    const generated = generate(calendar())

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Calendar_Date_Changed',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_calendar_calendar = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_calendar_date_t fg_calendar_calendar_selected_date = {0};',
    )
    expect(generated.code).toContain(
      'lv_calendar_set_today_date(obj1, 2026, 6, 18);',
    )
    expect(generated.code).toContain(
      'lv_calendar_set_showed_date(obj1, 2026, 6);',
    )
  })

  it('validates dates and suppresses repeated selections', () => {
    const { code } = generate(calendar())

    expect(code).toContain(
      'if (year == 0 || month < 1 || month > 12 || day < 1) return false;',
    )
    expect(code).toContain(
      'if (month == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) maximum_day = 29;',
    )
    expect(code).toContain(
      'if (selected_date->year == year && selected_date->month == month && selected_date->day == day) return false;',
    )
    expect(code).toContain(
      'lv_calendar_set_highlighted_dates(calendar, selected_date, 1);',
    )
    expect(code).toContain(
      'FG_On_Calendar_Date_Changed(year, month, day);',
    )
  })

  it('routes touch selection through the same retained-state helper', () => {
    const { code } = generate(calendar())

    expect(code).toContain(
      'lv_obj_add_event_cb(obj1, fg_calendar_calendar_value_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);',
    )
    expect(code).toContain(
      'if (lv_calendar_get_pressed_date(calendar, &date) != LV_RESULT_OK) return;',
    )
    expect(code).toContain(
      'fg_calendar_apply_date(calendar, &fg_calendar_calendar_selected_date, date.year, date.month, date.day)',
    )
    expect(code).toContain(
      'FG_On_Calendar_Date_Changed((uint16_t)date.year, (uint8_t)date.month, (uint8_t)date.day);',
    )

    const creation = code.slice(code.indexOf('void fg_studio_export_create'))
    expect(creation).not.toContain('FG_On_Calendar_Date_Changed(')
  })

  it('allocates collision-safe APIs and retained objects', () => {
    const generated = generate(
      calendar('a', 'Calendar'),
      calendar('b', 'Calendar'),
    )
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Calendar_Date(uint16_t year, uint8_t month, uint8_t day);',
      'void FG_Set_Calendar_2_Date(uint16_t year, uint8_t month, uint8_t day);',
    ]))
    expect(generated.code).toContain('fg_calendar_calendar = lv_calendar_create')
    expect(generated.code).toContain('fg_calendar_2_calendar = lv_calendar_create')
  })

  it('can dump the live endpoint validation payload', () => {
    if (!process.env.FORGEUI_DUMP_CALENDAR_PAYLOAD) return
    fs.writeFileSync(
      process.env.FORGEUI_DUMP_CALENDAR_PAYLOAD,
      JSON.stringify(generate(calendar())),
    )
  })
})
