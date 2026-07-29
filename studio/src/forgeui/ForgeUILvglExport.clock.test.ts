import { generateForgeUILvglCode } from './ForgeUILvglExport'

const clock = (
  id: string,
  componentName: string,
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Clock',
  componentName,
  props: { x: 10, y: 20, w: 160, h: 60, ...props },
  children: [],
})

const generate = (...clocks: IComponent[]) => {
  const components: IComponents = {
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: clocks.map(item => item.id),
    },
    ...Object.fromEntries(clocks.map(item => [item.id, item])),
  }

  return generateForgeUILvglCode(
    components,
    'graphite',
    undefined,
    { includeThemeTexture: false },
  ).code
}

describe('standard Clock LVGL export', () => {
  it('preserves default 24-hour HH:MM blinking behavior', () => {
    const code = generate(clock('clock', 'Clock'))

    expect(code).toContain('static lv_obj_t * fg_clock_label = NULL;')
    expect(code).toContain('static lv_timer_t * fg_clock_timer = NULL;')
    expect(code).toContain('static bool fg_clock_separator_visible = true;')
    expect(code).toContain(
      'snprintf(time_buf, sizeof(time_buf), "%02d%c%02d", hour, separator, minute);',
    )
    expect(code).toContain(
      "char separator = fg_clock_separator_visible ? ':' : ' ';",
    )
    expect(code).toContain('fg_clock_tick_cb(NULL);')
    expect(code).toContain(
      'fg_clock_timer = lv_timer_create(fg_clock_tick_cb, 1000, NULL);',
    )
  })

  it('generates configured 12-hour seconds without blinking', () => {
    const code = generate(clock('clock', 'Clock', {
      hourFormat: '12',
      showSeconds: true,
      blinkSeparator: false,
    }))

    expect(code).toContain('int display_hour = hour % 12;')
    expect(code).toContain(
      'const char * period = hour < 12 ? "AM" : "PM";',
    )
    expect(code).toContain(
      'snprintf(time_buf, sizeof(time_buf), "%02d%c%02d%c%02d %s", display_hour, separator, minute, separator, second, period);',
    )
    expect(code).toContain("char separator = ':';")
    expect(code).not.toContain(
      'fg_clock_separator_visible = !fg_clock_separator_visible;',
    )
  })

  it('retains and updates multiple same-named Clocks independently', () => {
    const code = generate(
      clock('alpha', 'Status Clock'),
      clock('beta', 'Status Clock', {
        hourFormat: '12',
        showSeconds: true,
      }),
    )

    expect(code).toContain(
      'static lv_obj_t * fg_status_clock_label = NULL;',
    )
    expect(code).toContain(
      'static lv_obj_t * fg_status_clock_2_label = NULL;',
    )
    expect(code).toContain(
      'fg_status_clock_timer = lv_timer_create(fg_status_clock_tick_cb, 1000, NULL);',
    )
    expect(code).toContain(
      'fg_status_clock_2_timer = lv_timer_create(fg_status_clock_2_tick_cb, 1000, NULL);',
    )
    expect(code).toContain(
      'lv_label_set_text(fg_status_clock_label, time_buf);',
    )
    expect(code).toContain(
      'lv_label_set_text(fg_status_clock_2_label, time_buf);',
    )
  })
})
