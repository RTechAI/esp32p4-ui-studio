import { generateForgeUILvglCode } from './ForgeUILvglExport'

const progress = (
  id: string,
  componentName = 'Download Progress',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Progress',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 240,
    h: 24,
    value: 60,
    min: 0,
    max: 100,
    ...props,
  },
  children: [],
})

const generate = (...children: IComponent[]) =>
  generateForgeUILvglCode({
    root: {
      id: 'root',
      parent: 'root',
      type: 'Box',
      props: {},
      children: children.map(child => child.id),
    },
    ...Object.fromEntries(children.map(child => [child.id, child])),
  }, 'graphite', undefined, { includeThemeTexture: false })

describe('Standard Progress generated runtime API', () => {
  it('retains the native bar and exports an output-only value setter', () => {
    const generated = generate(progress('progress'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Download_Progress_Value(int32_t value);',
    )
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).toContain(
      'static lv_obj_t * fg_download_progress_progress = NULL;',
    )
    expect(generated.code).toContain(
      'fg_download_progress_progress = lv_bar_create(fg_application_page);',
    )
    expect(generated.code).not.toContain('FG_On_Download_Progress')
  })

  it('honors range and initial value, including negative ranges', () => {
    const { code } = generate(progress('signed', 'Signed Progress', {
      min: -50,
      max: 50,
      value: -10,
    }))

    expect(code).toContain(
      'static const int32_t fg_signed_progress_progress_minimum = -50;',
    )
    expect(code).toContain(
      'static const int32_t fg_signed_progress_progress_maximum = 50;',
    )
    expect(code).toContain(
      'static int32_t fg_signed_progress_progress_value = -10;',
    )
    expect(code).toContain(
      'lv_bar_set_range(fg_signed_progress_progress, -50, 50);',
    )
    expect(code).toContain(
      'lv_bar_set_value(fg_signed_progress_progress, -10, LV_ANIM_OFF);',
    )
  })

  it('clamps before suppressing unchanged effective values', () => {
    const { code } = generate(progress('progress'))
    const start = code.indexOf(
      'void FG_Set_Download_Progress_Value(int32_t value)',
    )
    const setter = code.slice(start, start + 850)

    expect(setter).toContain(
      'if (value < fg_download_progress_progress_minimum) value = fg_download_progress_progress_minimum;',
    )
    expect(setter).toContain(
      'if (value > fg_download_progress_progress_maximum) value = fg_download_progress_progress_maximum;',
    )
    expect(setter).toContain(
      'if (fg_download_progress_progress == NULL || fg_download_progress_progress_value == value) return;',
    )
    expect(setter).toContain(
      'lv_bar_set_value(fg_download_progress_progress, value, LV_ANIM_OFF);',
    )
    expect(setter).toContain(
      'fg_download_progress_progress_value = value;',
    )
    expect(setter).not.toContain('FG_On_')
  })

  it('clamps the serialized initial value without firing runtime behavior', () => {
    const { code } = generate(progress('progress', 'Download Progress', {
      min: 10,
      max: 20,
      value: 99,
    }))
    const creation = code.slice(code.indexOf('void fg_studio_export_create'))

    expect(creation).toContain(
      'lv_bar_set_value(fg_download_progress_progress, 20, LV_ANIM_OFF);',
    )
    expect(creation).toContain(
      'fg_download_progress_progress_value = 20;',
    )
    expect(creation).not.toContain('FG_Set_Download_Progress_Value(')
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      progress('a', 'Download Progress'),
      progress('b', 'Download Progress'),
      progress('c', 'Download-Progress'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Download_Progress_Value(int32_t value);',
      'void FG_Set_Download_Progress_2_Value(int32_t value);',
      'void FG_Set_Download_Progress_3_Value(int32_t value);',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_download_progress_2_progress = NULL;',
    )
    expect(generated.code).toContain(
      'static lv_obj_t * fg_download_progress_3_progress = NULL;',
    )
  })

  it('does not alter Standard Bar runtime generation', () => {
    const bar: IComponent = {
      ...progress('bar', 'Progress Bar', { value: 70 }),
      type: 'Bar',
    }
    const generated = generate(bar, progress('progress'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Progress_Bar(int32_t value);',
    )
    expect(generated.userEventHooks).toContain(
      'FG_On_Progress_Bar_Changed',
    )
    expect(generated.code).toContain(
      'FG_On_Progress_Bar_Changed(value);',
    )
  })
})
