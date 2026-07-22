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
    expect(result.code).toContain('typedef struct')
    expect(result.code).toContain('} fg_binary_output_t;')
    expect(result.code).toContain('static void fg_binary_output_set(')
    expect(result.code).toContain('fg_status_light_output.image = lv_image_create(parent);')
    expect(result.code).toContain('fg_binary_output_set(&fg_status_light_output, false);')
    expect(result.code).toContain('lv_obj_set_pos(fg_status_light_output.image, 12, 34);')
    expect(result.code).toContain('lv_obj_set_size(fg_status_light_output.image, 400, 300);')
    expect(result.code).toContain('lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_CLICKABLE);')
    expect(result.code).toContain('lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_SCROLLABLE);')
    expect(result.code).toContain('void FG_Set_Status_Light(bool enabled)')
    expect(result.code).toContain('fg_binary_output_set(&fg_status_light_output, enabled);')
    expect(result.code).toContain('.off_src = &fg_upload_status_off,')
    expect(result.code).toContain('.on_src = &fg_upload_status_on,')
    expect(result.code).not.toContain('FG_On_StatusLight')
    expect(result.code).not.toContain('lv_button_create(parent);')
  })

  it('characterizes the public Light setter and guarded OFF/ON switching contract', () => {
    const offAsset = createUploadedAsset('contract_off')
    const onAsset = createUploadedAsset('contract_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('contract-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
      initialState: 'off' as const,
    }
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['light'] },
      light: { id: 'light', parent: 'root', type: 'InteractiveLight',
        componentName: 'Contract Light',
        props: { interactiveAssetId: light.id, w: 32, h: 32 }, children: [] },
    })

    expect(result.publicApiDeclarations).toEqual([
      'void FG_Set_Contract_Light(bool enabled);',
    ])
    expect(result.userEventHooks).toEqual([])
    expect(result.code).toContain('void FG_Set_Contract_Light(bool enabled)')
    expect(result.code).toContain('if (!output || !output->image)')
    expect(result.code).toContain('output->enabled = enabled;')
    expect(result.code).toContain('enabled ? output->on_src : output->off_src')
    expect(result.code).toContain('.off_src = &fg_upload_contract_off,')
    expect(result.code).toContain('.on_src = &fg_upload_contract_on,')
    expect(result.code).toContain(
      'fg_binary_output_set(&fg_contract_light_output, enabled);',
    )
    expect(result.code).not.toContain('FG_On_Contract')
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

    expect(result.code).toContain('.enabled = true,')
    expect(result.code).toContain(
      'fg_binary_output_set(&fg_status_light_output, true);',
    )
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
    expect(first.code).toContain('fg_warning_light_output.image = lv_image_create(parent);')
    expect(reordered.code).toContain('fg_warning_light_2_output.image = lv_image_create(parent);')
    expect(first.code.match(/static void fg_binary_output_set\(/g)).toHaveLength(1)
    expect(first.code).toContain(
      'fg_binary_output_set(&fg_warning_light_output, enabled);',
    )
    expect(first.code).toContain(
      'fg_binary_output_set(&fg_warning_light_2_output, enabled);',
    )
    expect(reordered.code).not.toContain('fg_interactive_button_event_cb')
  })

  it('allocates three independent Light setters and runtimes for one reusable asset', () => {
    const offAsset = createUploadedAsset('shared_off')
    const onAsset = createUploadedAsset('shared_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('shared-light'),
      label: 'Status Light',
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(light)

    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['third', 'first', 'second'] },
      first: { id: 'first', parent: 'root', type: 'InteractiveLight',
        componentName: 'Status Light', props: { interactiveAssetId: light.id }, children: [] },
      second: { id: 'second', parent: 'root', type: 'InteractiveLight',
        componentName: 'Status Light', props: { interactiveAssetId: light.id }, children: [] },
      third: { id: 'third', parent: 'root', type: 'InteractiveLight',
        componentName: 'Status Light', props: { interactiveAssetId: light.id }, children: [] },
    }

    const firstExport = generateForgeUILvglCode(components)
    const repeatedExport = generateForgeUILvglCode(components)

    expect(firstExport.publicApiDeclarations).toEqual([
      'void FG_Set_Status_Light(bool enabled);',
      'void FG_Set_Status_Light_2(bool enabled);',
      'void FG_Set_Status_Light_3(bool enabled);',
    ])
    expect(firstExport.code).toContain('static fg_binary_output_t fg_status_light_output = {')
    expect(firstExport.code).toContain('static fg_binary_output_t fg_status_light_2_output = {')
    expect(firstExport.code).toContain('static fg_binary_output_t fg_status_light_3_output = {')
    expect(firstExport.code.match(/\.image = lv_image_create\(parent\);/g)).toHaveLength(3)
    expect(firstExport.code.match(/LV_IMAGE_DECLARE\(fg_upload_shared_off\)/g)).toHaveLength(1)
    expect(firstExport.code.match(/LV_IMAGE_DECLARE\(fg_upload_shared_on\)/g)).toHaveLength(1)
    expect(firstExport.assetSources).toEqual(expect.arrayContaining([
      offAsset.cFile,
      onAsset.cFile,
    ]))
    expect(firstExport.assetSources.filter(source => source === offAsset.cFile))
      .toHaveLength(1)
    expect(firstExport.assetSources.filter(source => source === onAsset.cFile))
      .toHaveLength(1)
    expect(repeatedExport).toEqual(firstExport)
  })

  it('derives distinct output setters from different Canvas component names', () => {
    const offAsset = createUploadedAsset('named_off')
    const onAsset = createUploadedAsset('named_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('named-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: { id: 'root', parent: 'root', type: 'Box', props: {},
        children: ['pump', 'alarm'] },
      pump: { id: 'pump', parent: 'root', type: 'InteractiveLight',
        componentName: 'Pump Ready', props: { interactiveAssetId: light.id }, children: [] },
      alarm: { id: 'alarm', parent: 'root', type: 'InteractiveLight',
        componentName: 'Alarm Active', props: { interactiveAssetId: light.id }, children: [] },
    })

    expect(result.publicApiDeclarations).toEqual([
      'void FG_Set_Alarm_Active(bool enabled);',
      'void FG_Set_Pump_Ready(bool enabled);',
    ])
    expect(result.code).toContain('fg_alarm_active_output.image = lv_image_create(parent);')
    expect(result.code).toContain('fg_pump_ready_output.image = lv_image_create(parent);')
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
    expect(result.code).toContain('.off_src = &fg_upload_shared,')
    expect(result.code).toContain('.on_src = &fg_upload_shared,')
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
