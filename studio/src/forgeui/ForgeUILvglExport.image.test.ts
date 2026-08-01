import { generateForgeUILvglCode } from './ForgeUILvglExport'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from './ForgeUIUploadedAssetRegistry'

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
  afterEach(() => {
    forgeUIClearUploadedAssets()
  })

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

  it('treats the selected uploaded asset ID as the canonical source', () => {
    forgeUIAddUploadedAssets([{
      id: 'selected-upload',
      name: 'selected.png',
      type: 'image/png',
      size: 1,
      createdAt: 1,
      browserSrc: READY_SRC,
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_upload_selected',
      cFile: 'assets/uploads/fg_upload_selected.c',
    }])

    const generated = generate(image('image', 'Selected Image', {
      uploadedAssetId: 'selected-upload',
    }))

    expect(generated.code).toContain('LV_IMAGE_DECLARE(fg_upload_selected);')
    expect(generated.code).toContain(
      'lv_image_set_src(fg_selected_image, &fg_upload_selected);',
    )
    expect(generated.assetSources).toContain(
      'assets/uploads/fg_upload_selected.c',
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
    // The existing pointer-only API cannot infer dimensions for a new source.
    expect(setter).not.toContain('lv_image_set_scale')
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

  it('preserves geometry and derives contain scale from source dimensions', () => {
    const { code } = generate(image('image', 'Logo Image', {
      x: 45,
      y: 55,
      w: 200,
      h: 140,
      imageFit: 'contain',
    }))

    expect(code).toContain('lv_image_set_scale(fg_logo_image, 747);')
    expect(code).toContain('lv_obj_set_pos(fg_logo_image, 45, 55);')
    expect(code).toContain('lv_obj_set_size(fg_logo_image, 200, 140);')
    expect(code).toContain('lv_image_set_inner_align(fg_logo_image, LV_IMAGE_ALIGN_CENTER);')
    expect(code).toContain('lv_obj_set_style_opa(fg_logo_image, 255, 0);')
    expect(code).toContain('lv_obj_clear_flag(fg_logo_image, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);')
    const imageStart = code.indexOf('fg_logo_image = lv_image_create')
    const imageBlock = code.slice(imageStart, imageStart + 900)
    expect(imageBlock).not.toContain('LV_STATE_PRESSED')
  })

  it('exports the same calculated fit target used by previews', () => {
    forgeUIAddUploadedAssets([{
      id: 'fit-source', name: 'fit.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: '/fit.png', kind: 'uploaded',
      exportStatus: 'lvgl_ready', lvgl: 'fg_fit', cFile: 'fit.c',
      width: 640, height: 360,
    }])
    const contain = image('contain', 'Contain', {
      uploadedAssetId: 'fit-source', src: '/fit.png',
      w: 240, h: 160, imageFit: 'contain',
    })
    const cover = image('cover', 'Cover', {
      uploadedAssetId: 'fit-source', src: '/fit.png',
      w: 240, h: 160, imageFit: 'cover',
    })
    const native = image('native', 'Native', {
      uploadedAssetId: 'fit-source', src: '/fit.png',
      w: 240, h: 160, imageFit: 'native',
    })
    const { code } = generate(contain, cover, native)
    expect(code).toContain('lv_image_set_scale(fg_contain, 96);')
    expect(code).toContain('lv_image_set_scale(fg_cover, 114);')
    expect(code).toContain('lv_image_set_scale(fg_native, 256);')
    expect(code.match(/LV_IMAGE_ALIGN_CENTER/g)).toHaveLength(3)
  })

  it('fits the 1024x600 proof descriptor inside 240x160 at scale 60', () => {
    forgeUIAddUploadedAssets([{
      id: 'proof-source', name: 'proof.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: '/proof.png', kind: 'uploaded',
      exportStatus: 'lvgl_ready', lvgl: 'fg_proof', cFile: 'proof.c',
      width: 1024, height: 600,
    }])
    const { code } = generate(image('proof', 'Image', {
      uploadedAssetId: 'proof-source', src: '/proof.png',
      w: 240, h: 160, imageFit: 'contain',
    }))
    expect(code).toContain('lv_image_set_scale(fg_image, 60);')
    expect(code).toContain('lv_image_set_inner_align(fg_image, LV_IMAGE_ALIGN_CENTER);')
    expect(code).toContain('lv_obj_set_size(fg_image, 240, 160);')
    expect(code).toContain(
      'serialized source=unsetxunset, fit=contain, legacy_scale=256; resolved source=1024x600, bounds=240x160, fit=contain, target=240x141, calculated_scale=60, emitted_scale=60',
    )
  })

  it('exports opacity and visibility without inventing interaction', () => {
    const { code } = generate(image('image', 'Logo Image', {
      opacity: 0.25,
      visible: false,
    }))

    expect(code).toContain('lv_obj_set_style_opa(fg_logo_image, 64, 0);')
    expect(code).toContain('lv_obj_add_flag(fg_logo_image, LV_OBJ_FLAG_HIDDEN);')
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

  it('emits one deterministic payload for Live and Standalone consumers', () => {
    const component = image('image', 'Proof Image', {
      opacity: 0.75,
      imageScale: 384,
    })

    expect(generate(component)).toEqual(generate(component))
  })
})
