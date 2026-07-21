import {
  generateForgeUILvglCode,
} from './ForgeUILvglExport'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createDefaultInteractiveLightAsset,
  registerInteractiveAsset,
} from './interactive'
import {
  forgeUIAddUploadedAssets,
  forgeUIClearUploadedAssets,
} from './ForgeUIUploadedAssetRegistry'
import type {
  ForgeUIUploadedAsset,
} from './ForgeUIUploadedAssetRegistry'

const createUploadedAsset = (
  id: string,
): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 100,
  createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: `fg_upload_${id}`,
  cFile: `assets/uploads/fg_upload_${id}.c`,
})

describe('Interactive Button LVGL export compatibility', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('preserves generated callback names and fallback wiring', () => {
    const asset = {
      ...createDefaultInteractiveButtonAsset(
        'fg_interactive_start',
      ),
      label: 'Start',
    }

    registerInteractiveAsset(asset)

    const components: IComponents = {
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['button'],
      },
      button: {
        id: 'button',
        parent: 'root',
        type: 'InteractiveButton',
        props: {
          interactiveAssetId: asset.id,
          x: 10,
          y: 20,
          w: 120,
          h: 48,
        },
        children: [],
      },
    }

    const result = generateForgeUILvglCode(components)

    expect(result.userEventHooks).toEqual([
      'FG_On_Start_Clicked',
    ])
    expect(result.code).toContain(
      'lv_label_set_text(obj1_label, "Start\\nMissing Interactive Assets");',
    )
    expect(result.code).toContain(
      '#include "95_UserEvents.h"',
    )
  })

  it('exports a direct, non-clickable Light and public setter', () => {
    const offAsset = createUploadedAsset('status_off')
    const onAsset = createUploadedAsset('status_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])

    const light = {
      ...createDefaultInteractiveLightAsset('status-light'),
      label: 'Status Light',
      width: 400,
      height: 300,
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
      initialState: 'off' as const,
    }
    registerInteractiveAsset(light)

    const components: IComponents = {
      root: {
        id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['light'],
      },
      light: {
        id: 'light', parent: 'root', type: 'InteractiveLight',
        componentName: 'StatusLight',
        props: {
          interactiveAssetId: light.id,
          x: 12, y: 34, w: 400, h: 300,
        },
        children: [],
      },
    }

    const result = generateForgeUILvglCode(components)

    expect(result.assetSources).toEqual(expect.arrayContaining([
      offAsset.cFile,
      onAsset.cFile,
    ]))
    expect(result.publicApiDeclarations).toEqual([
      'void FG_Set_Status_Light(bool enabled);',
    ])
    expect(result.userEventHooks).toEqual([])
    expect(result.code).toContain('LV_IMAGE_DECLARE(fg_upload_status_off);')
    expect(result.code).toContain('LV_IMAGE_DECLARE(fg_upload_status_on);')
    expect(result.code).toContain('fg_status_light_image = lv_image_create(parent);')
    expect(result.code).toContain('lv_image_set_src(fg_status_light_image, &fg_upload_status_off);')
    expect(result.code).toContain('lv_obj_set_pos(fg_status_light_image, 12, 34);')
    expect(result.code).toContain('lv_obj_set_size(fg_status_light_image, 400, 300);')
    expect(result.code).toContain('lv_obj_clear_flag(fg_status_light_image, LV_OBJ_FLAG_CLICKABLE);')
    expect(result.code).toContain('void FG_Set_Status_Light(bool enabled)')
    expect(result.code).toContain('if (!fg_status_light_image)')
    expect(result.code).toContain('? &fg_upload_status_on')
    expect(result.code).toContain(': &fg_upload_status_off')
    expect(result.code).not.toContain('FG_On_StatusLight')
    expect(result.code).not.toContain('lv_button_create(parent);')
  })

  it('uses ON as the configured initial Light source', () => {
    const offAsset = createUploadedAsset('off')
    const onAsset = createUploadedAsset('on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
      initialState: 'on' as const,
    }
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['a'] },
      a: { id: 'a', parent: 'root', type: 'InteractiveLight', props: { interactiveAssetId: light.id }, children: [] },
    })

    expect(result.code).toContain('lv_image_set_src(fg_status_light_image, &fg_upload_on);')
  })

  it('allocates duplicate Light APIs deterministically across Canvas reorder', () => {
    const offAsset = createUploadedAsset('off')
    const onAsset = createUploadedAsset('on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      label: 'Warning Light',
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(light)

    const makeComponents = (children: string[]): IComponents => ({
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children },
      alpha: { id: 'alpha', parent: 'root', type: 'InteractiveLight', props: { interactiveAssetId: light.id }, children: [] },
      beta: { id: 'beta', parent: 'root', type: 'InteractiveLight', props: { interactiveAssetId: light.id }, children: [] },
    })

    const first = generateForgeUILvglCode(makeComponents(['alpha', 'beta']))
    const reordered = generateForgeUILvglCode(makeComponents(['beta', 'alpha']))

    expect(first.publicApiDeclarations).toEqual([
      'void FG_Set_Warning_Light(bool enabled);',
      'void FG_Set_Warning_Light_2(bool enabled);',
    ])
    expect(reordered.publicApiDeclarations).toEqual(first.publicApiDeclarations)
    expect(first.code).toContain('fg_warning_light_image = lv_image_create(parent);')
    expect(reordered.code).toContain('fg_warning_light_2_image = lv_image_create(parent);')
    expect(reordered.code).not.toContain('fg_interactive_button_event_cb')
  })

  it('keeps Button hooks intact in a mixed Button and Light export', () => {
    const offAsset = createUploadedAsset('off')
    const onAsset = createUploadedAsset('on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const button = {
      ...createDefaultInteractiveButtonAsset('button'),
      label: 'Start',
    }
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(button)
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['button-component', 'light-component'] },
      'button-component': { id: 'button-component', parent: 'root', type: 'InteractiveButton', props: { interactiveAssetId: button.id }, children: [] },
      'light-component': { id: 'light-component', parent: 'root', type: 'InteractiveLight', props: { interactiveAssetId: light.id }, children: [] },
    })

    expect(result.userEventHooks).toEqual(['FG_On_Start_Clicked'])
    expect(result.publicApiDeclarations).toEqual([
      'void FG_Set_Status_Light(bool enabled);',
    ])
    expect(result.code).toContain('fg_interactive_button_event_cb')
  })

  it('deduplicates a shared declaration without removing image uses', () => {
    const shared = createUploadedAsset('shared')
    forgeUIAddUploadedAssets([shared])
    const button = {
      ...createDefaultInteractiveButtonAsset('button'),
      label: 'Shared',
      normalAssetId: shared.id,
      pressedAssetId: shared.id,
    }
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      offAssetId: shared.id,
      onAssetId: shared.id,
    }
    registerInteractiveAsset(button)
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: { id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['button', 'light', 'icon'] },
      button: { id: 'button', parent: 'root', type: 'InteractiveButton',
        props: { interactiveAssetId: button.id, w: 120, h: 48 }, children: [] },
      light: { id: 'light', parent: 'root', type: 'InteractiveLight',
        componentName: 'SharedLight',
        props: { interactiveAssetId: light.id, w: 32, h: 32 }, children: [] },
      icon: { id: 'icon', parent: 'root', type: 'Icon',
        props: { uploadedAssetId: shared.id, w: 32, h: 32 }, children: [] },
    }, 'graphite', shared)

    expect(result.code.match(
      /LV_IMAGE_DECLARE\(fg_upload_shared\)/g,
    )).toHaveLength(1)
    expect(result.code).toContain(
      'lv_image_set_src(obj1_img, &fg_upload_shared);',
    )
    expect(result.code).toContain(
      '.normal_src = &fg_upload_shared,',
    )
    expect(result.code).toContain(
      '.pressed_src = &fg_upload_shared,',
    )
    expect(result.code).toContain(
      'lv_image_set_src(fg_shared_light_image, &fg_upload_shared);',
    )
    expect(result.code).toContain(
      'lv_image_set_src(obj3, &fg_upload_shared);',
    )
    expect(result.code).toContain(
      'lv_image_set_src(bg_texture_0, &fg_upload_shared);',
    )
    expect(result.code).toContain(
      'lv_obj_add_event_cb(obj1, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &obj1_data);',
    )
    expect(result.assetSources).toEqual([shared.cFile])
  })
})
