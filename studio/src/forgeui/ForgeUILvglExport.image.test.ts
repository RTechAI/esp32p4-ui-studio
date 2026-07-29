import { generateForgeUILvglCode } from './ForgeUILvglExport'

const READY_SRC =
  '/assets/icons/48x48 ForgeUI Reactor Set/about-48px.svg'

const image = (
  id: string,
  componentName = 'Logo Image',
  props: Record<string, unknown> = {},
): IComponent => ({
  id,
  parent: 'root',
  type: 'Image',
  componentName,
  props: {
    x: 20,
    y: 30,
    w: 160,
    h: 120,
    src: READY_SRC,
    imageScale: 256,
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

describe('Standard Image generated runtime API', () => {
  it('retains the native image and current generated symbol source', () => {
    const generated = generate(image('image'))

    expect(generated.publicApiDeclarations).toContain(
      'void FG_Set_Logo_Image_Source(const void * src);',
    )
    expect(generated.userEventHooks).toEqual([])
    expect(generated.code).toContain(
      'static lv_obj_t * fg_logo_image = NULL;',
    )
    expect(generated.code).toContain(
      'static const void * fg_logo_image_source = NULL;',
    )
    expect(generated.code).toContain(
      'LV_IMAGE_DECLARE(fg_icon_about_48px);',
    )
    expect(generated.code).toContain(
      'fg_logo_image = lv_image_create(fg_application_page);',
    )
    expect(generated.code).toContain(
      'lv_image_set_src(fg_logo_image, &fg_icon_about_48px);',
    )
    expect(generated.code).toContain(
      'fg_logo_image_source = &fg_icon_about_48px;',
    )
  })

  it('safely suppresses unavailable, NULL, and unchanged sources', () => {
    const { code } = generate(image('image'))
    const start = code.indexOf(
      'void FG_Set_Logo_Image_Source(const void * src)',
    )
    const setter = code.slice(start, start + 500)

    expect(setter).toContain(
      'if (fg_logo_image == NULL || src == NULL || fg_logo_image_source == src) return;',
    )
    expect(setter).toContain(
      'lv_image_set_src(fg_logo_image, src);',
    )
    expect(setter).toContain(
      'fg_logo_image_source = src;',
    )
    expect(setter).not.toContain('FG_On_')
  })

  it('preserves the unresolved-asset placeholder and safe no-op API', () => {
    const { code, publicApiDeclarations, userEventHooks } = generate(
      image('pending', 'Pending Image', {
        src: '/uploads/not-converted.png',
        alt: 'Pending Logo',
      }),
    )

    expect(publicApiDeclarations).toContain(
      'void FG_Set_Pending_Image_Source(const void * src);',
    )
    expect(userEventHooks).toEqual([])
    expect(code).toContain(
      'static lv_obj_t * fg_pending_image = NULL;',
    )
    expect(code).toContain(
      'lv_label_set_text(obj1_label, "Pending Logo\\nPending LVGL Export");',
    )
    expect(code).not.toContain(
      'fg_pending_image = lv_image_create',
    )
  })

  it('preserves geometry, scale, and existing image styling', () => {
    const { code } = generate(image('image', 'Logo Image', {
      x: 45,
      y: 55,
      w: 200,
      h: 140,
      imageScale: 192,
    }))

    expect(code).toContain('lv_image_set_scale(fg_logo_image, 192);')
    expect(code).toContain('lv_obj_set_pos(fg_logo_image, 45, 55);')
    expect(code).toContain('lv_obj_set_size(fg_logo_image, 200, 140);')
    expect(code).toContain(
      'lv_obj_set_style_transform_pivot_x(fg_logo_image, 100, 0);',
    )
  })

  it('allocates duplicate and sanitized collisions deterministically', () => {
    const generated = generate(
      image('a', 'Logo Image'),
      image('b', 'Logo Image'),
      image('c', 'Logo-Image'),
    )

    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Logo_Image_Source(const void * src);',
      'void FG_Set_Logo_Image_2_Source(const void * src);',
      'void FG_Set_Logo_Image_3_Source(const void * src);',
    ]))
    expect(generated.code).toContain(
      'static lv_obj_t * fg_logo_image_2 = NULL;',
    )
    expect(generated.code).toContain(
      'static const void * fg_logo_image_3_source = NULL;',
    )
    expect(generated.code.match(
      /LV_IMAGE_DECLARE\(fg_icon_about_48px\)/g,
    )).toHaveLength(1)
  })

  it('does not generate a developer callback', () => {
    const generated = generate(image('image'))

    expect(generated.code).not.toContain('FG_On_Logo_Image_Changed')
    expect(generated.userEventHooks).not.toContain(
      'FG_On_Logo_Image_Changed',
    )
  })
})
