import {
  calculateInteractiveButtonContainScale,
  calculateToggleContainScale,
  generateForgeUILvglCode,
} from './ForgeUILvglExport'
import {
  clearInteractiveAssetRegistry,
  createDefaultInteractiveButtonAsset,
  createDefaultInteractiveLightAsset,
  createDefaultInteractiveStatusIndicatorAsset,
  createDefaultInteractiveThreePositionToggleAsset,
  createDefaultInteractiveToggleSwitchAsset,
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

const createPngDataUrl = (
  width: number,
  height: number,
) => {
  const bytes = new Uint8Array(24)
  bytes.set([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a,
  ])
  const view = new DataView(bytes.buffer)
  view.setUint32(8, 13)
  bytes.set([0x49, 0x48, 0x44, 0x52], 12)
  view.setUint32(16, width)
  view.setUint32(20, height)
  return `data:image/png;base64,${btoa(
    String.fromCharCode(...bytes),
  )}`
}

describe('Interactive Button LVGL export compatibility', () => {
  beforeEach(() => {
    clearInteractiveAssetRegistry()
    forgeUIClearUploadedAssets()
  })

  it('exports multiple Status Indicators beside a Light through one Binary Output Runtime', () => {
    const offAsset = createUploadedAsset('shared_off')
    const onAsset = createUploadedAsset('shared_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const createIndicator = (id: string, label: string) => ({
      ...createDefaultInteractiveStatusIndicatorAsset(id),
      label,
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    })
    const wifi = createIndicator('wifi', 'WiFi Status')
    const mqtt = createIndicator('mqtt', 'MQTT Status')
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      label: 'Alarm', offAssetId: offAsset.id, onAssetId: onAsset.id,
    }
    ;[wifi, mqtt, light].forEach(registerInteractiveAsset)
    const components: IComponents = {
      root: { id: 'root', parent: 'root', type: 'Box', props: {}, children: ['wifi', 'mqtt', 'alarm'] },
      wifi: { id: 'wifi', parent: 'root', type: 'InteractiveStatusIndicator', componentName: 'WiFi_Status', props: { interactiveAssetId: wifi.id, w: 32, h: 32 }, children: [] },
      mqtt: { id: 'mqtt', parent: 'root', type: 'InteractiveStatusIndicator', componentName: 'MQTT_Status', props: { interactiveAssetId: mqtt.id, w: 32, h: 32 }, children: [] },
      alarm: { id: 'alarm', parent: 'root', type: 'InteractiveLight', componentName: 'Alarm', props: { interactiveAssetId: light.id, w: 32, h: 32 }, children: [] },
    }

    const first = generateForgeUILvglCode(components)
    const second = generateForgeUILvglCode(components)

    expect(second.code).toBe(first.code)
    expect(first.code.match(/typedef struct/g)).toHaveLength(1)
    expect(first.code.match(/static void fg_binary_output_set\(/g)).toHaveLength(1)
    expect(first.code.match(/static fg_binary_output_t fg_/g)).toHaveLength(3)
    expect(first.publicApiDeclarations).toEqual([
      'void FG_Set_Alarm(bool enabled);',
      'void FG_Set_MQTT_Status(bool enabled);',
      'void FG_Set_WiFi_Status(bool enabled);',
    ])
    expect(first.assetSources).toEqual(expect.arrayContaining([
      offAsset.cFile,
      onAsset.cFile,
    ]))
    expect(first.assetSources.filter(source => source === offAsset.cFile)).toHaveLength(1)
    expect(first.assetSources.filter(source => source === onAsset.cFile)).toHaveLength(1)
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

  it.each([
    [200, 100],
    [420, 100],
    [200, 240],
    [420, 160],
    [200, 200],
    [760, 180],
  ])(
    'exports final Interactive Button canvas geometry %sx%s',
    (width, height) => {
      const normal = {
        ...createUploadedAsset('button_geometry_normal'),
        width: 200,
        height: 100,
      }
      const pressed = {
        ...createUploadedAsset('button_geometry_pressed'),
        width: 200,
        height: 100,
      }
      forgeUIAddUploadedAssets([normal, pressed])
      const asset = {
        ...createDefaultInteractiveButtonAsset('geometry-button'),
        label: 'Geometry',
        normalAssetId: normal.id,
        pressedAssetId: pressed.id,
      }
      registerInteractiveAsset(asset)
      const result = generateForgeUILvglCode({
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
            w: String(width),
            h: String(height),
          },
          children: [],
        },
      })

      expect(result.code).toContain(
        `lv_obj_set_size(obj1, ${width}, ${height});`,
      )
    },
  )

  it('contain-fits both Button states against resized component geometry', () => {
    const normal = {
      ...createUploadedAsset('resized_normal'),
      width: 200,
      height: 100,
    }
    const pressed = {
      ...createUploadedAsset('resized_pressed'),
      width: 180,
      height: 90,
    }
    forgeUIAddUploadedAssets([normal, pressed])
    const asset = {
      ...createDefaultInteractiveButtonAsset('resized-button'),
      label: 'Resized',
      width: 160,
      height: 56,
      normalAssetId: normal.id,
      pressedAssetId: pressed.id,
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
          x: 12,
          y: 18,
          w: '420',
          h: '160',
        },
        children: [],
      },
    }

    const result = generateForgeUILvglCode(components)

    expect(result.code).toContain(
      'lv_obj_set_size(obj1, 420, 160);',
    )
    expect(result.code).toContain(
      'lv_image_set_scale(obj1_img, 410);',
    )
    expect(result.code).toContain(
      'lv_obj_center(obj1_img);',
    )
    expect(result.code).not.toContain(
      'lv_obj_set_size(obj1, 160, 56);',
    )

    const reloaded = JSON.parse(
      JSON.stringify(components),
    ) as IComponents
    expect(generateForgeUILvglCode(reloaded).code)
      .toContain('lv_obj_set_size(obj1, 420, 160);')
  })

  it('keeps legacy Button image scaling safe without image dimensions', () => {
    const normal = createUploadedAsset('legacy_normal')
    const pressed = createUploadedAsset('legacy_pressed')
    forgeUIAddUploadedAssets([normal, pressed])
    const asset = {
      ...createDefaultInteractiveButtonAsset('legacy-button'),
      normalAssetId: normal.id,
      pressedAssetId: pressed.id,
    }
    registerInteractiveAsset(asset)
    const result = generateForgeUILvglCode({
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
        props: { interactiveAssetId: asset.id },
        children: [],
      },
    })

    expect(result.code).toContain(
      'lv_obj_set_size(obj1, 120, 40);',
    )
    expect(result.code).toContain(
      'lv_image_set_scale(obj1_img, fg_interactive_button_contain_scale(&fg_upload_legacy_normal, &fg_upload_legacy_pressed, 120, 40));',
    )
  })

  it('recovers legacy Button dimensions from PNG IHDR bytes', () => {
    const normal = {
      ...createUploadedAsset('png_legacy_normal'),
      browserSrc: createPngDataUrl(200, 100),
    }
    const pressed = {
      ...createUploadedAsset('png_legacy_pressed'),
      browserSrc: createPngDataUrl(200, 100),
    }
    forgeUIAddUploadedAssets([normal, pressed])
    const asset = {
      ...createDefaultInteractiveButtonAsset('png-legacy-button'),
      normalAssetId: normal.id,
      pressedAssetId: pressed.id,
    }
    registerInteractiveAsset(asset)
    const result = generateForgeUILvglCode({
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
          w: 477,
          h: 404,
        },
        children: [],
      },
    })

    expect(result.code).toContain(
      'lv_obj_set_size(obj1, 477, 404);',
    )
    expect(result.code).toContain(
      'lv_image_set_scale(obj1_img, 611);',
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
    expect(result.code).toContain('lv_obj_t * fg_status_light_output_obj = lv_obj_create(parent);')
    expect(result.code).toContain('fg_status_light_output.image = lv_image_create(fg_status_light_output_obj);')
    expect(result.code).toContain('fg_binary_output_set(&fg_status_light_output, false);')
    expect(result.code).toContain('lv_obj_set_pos(fg_status_light_output_obj, 12, 34);')
    expect(result.code).toContain('lv_obj_set_size(fg_status_light_output_obj, 400, 300);')
    expect(result.code).toContain(
      'lv_image_set_scale(fg_status_light_output.image, fg_interactive_light_contain_scale(&fg_upload_status_off, &fg_upload_status_on, 400, 300));',
    )
    expect(result.code).toContain('lv_obj_center(fg_status_light_output.image);')
    expect(result.code).toContain('lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_CLICKABLE);')
    expect(result.code).toContain('lv_obj_clear_flag(fg_status_light_output.image, LV_OBJ_FLAG_SCROLLABLE);')
    expect(result.code).toContain('void FG_Set_Status_Light(bool enabled)')
    expect(result.code).toContain('fg_binary_output_set(&fg_status_light_output, enabled);')
    expect(result.code).toContain('.off_src = &fg_upload_status_off,')
    expect(result.code).toContain('.on_src = &fg_upload_status_on,')
    expect(result.code).not.toContain('FG_On_StatusLight')
    expect(result.code).not.toContain('lv_button_create(parent);')
  })

  it('contain-fits both Light states from registry dimensions and centres them', () => {
    const offAsset = {
      ...createUploadedAsset('scaled_light_off'),
      width: 100,
      height: 100,
    }
    const onAsset = {
      ...createUploadedAsset('scaled_light_on'),
      width: 80,
      height: 100,
    }
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('scaled-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root', parent: 'root', type: 'Box',
        props: {}, children: ['light'],
      },
      light: {
        id: 'light', parent: 'root', type: 'InteractiveLight',
        props: {
          interactiveAssetId: light.id,
          x: 50, y: 60, w: 400, h: 300,
        },
        children: [],
      },
    })

    expect(result.code).toContain(
      'lv_obj_set_pos(fg_status_light_output_obj, 50, 60);',
    )
    expect(result.code).toContain(
      'lv_obj_set_size(fg_status_light_output_obj, 400, 300);',
    )
    expect(result.code).toContain(
      'lv_image_set_scale(fg_status_light_output.image, 768);',
    )
    expect(result.code).toContain(
      'lv_obj_center(fg_status_light_output.image);',
    )
    expect(result.code.match(
      /lv_image_set_scale\(fg_status_light_output\.image/g,
    )).toHaveLength(1)
  })

  it('resolves Light dimensions from PNG IHDR before descriptor fallback', () => {
    const offAsset = {
      ...createUploadedAsset('ihdr_light_off'),
      browserSrc: createPngDataUrl(200, 100),
    }
    const onAsset = {
      ...createUploadedAsset('ihdr_light_on'),
      browserSrc: createPngDataUrl(200, 100),
    }
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const light = {
      ...createDefaultInteractiveLightAsset('ihdr-light'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(light)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root', parent: 'root', type: 'Box',
        props: {}, children: ['light'],
      },
      light: {
        id: 'light', parent: 'root', type: 'InteractiveLight',
        props: {
          interactiveAssetId: light.id,
          w: 400, h: 300,
        },
        children: [],
      },
    })

    expect(result.code).toContain(
      'lv_image_set_scale(fg_status_light_output.image, 512);',
    )
    expect(result.code).not.toContain(
      'lv_image_set_scale(fg_status_light_output.image, fg_interactive_light_contain_scale',
    )
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
    expect(first.code).toContain('fg_warning_light_output.image = lv_image_create(fg_warning_light_output_obj);')
    expect(reordered.code).toContain('fg_warning_light_2_output.image = lv_image_create(fg_warning_light_2_output_obj);')
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
    expect(firstExport.code.match(/\.image = lv_image_create\(fg_status_light(?:_2|_3)?_output_obj\);/g)).toHaveLength(3)
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
    expect(result.code).toContain('fg_alarm_active_output.image = lv_image_create(fg_alarm_active_output_obj);')
    expect(result.code).toContain('fg_pump_ready_output.image = lv_image_create(fg_pump_ready_output_obj);')
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

  it('removes native LVGL styling from Toggle parent and image objects', () => {
    const offAsset = createUploadedAsset('toggle_off')
    const onAsset = createUploadedAsset('toggle_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const toggle = {
      ...createDefaultInteractiveToggleSwitchAsset(
        'toggle',
        'Status Toggle',
      ),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(toggle)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['toggle-component'],
      },
      'toggle-component': {
        id: 'toggle-component',
        parent: 'root',
        type: 'InteractiveToggleSwitch',
        props: {
          interactiveAssetId: toggle.id,
          w: 300,
          h: 200,
        },
        children: [],
      },
    })

    expect(result.code).toContain(
      'lv_obj_remove_style_all(fg_toggle_component_toggle.button);',
    )
    expect(result.code).toContain(
      'lv_obj_set_style_bg_opa(fg_toggle_component_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);',
    )
    expect(result.code).toContain(
      'lv_obj_set_style_border_opa(fg_toggle_component_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);',
    )
    expect(result.code).toContain(
      'lv_obj_set_style_outline_opa(fg_toggle_component_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);',
    )
    expect(result.code).toContain(
      'lv_obj_set_style_shadow_opa(fg_toggle_component_toggle.button, LV_OPA_TRANSP, LV_PART_MAIN);',
    )
    expect(result.code).toContain(
      'lv_obj_set_style_pad_all(fg_toggle_component_toggle.button, 0, LV_PART_MAIN);',
    )
    expect(result.code).toContain(
      'lv_obj_remove_style_all(fg_toggle_component_toggle.image);',
    )
  })

  it('contains a native Toggle image inside its clickable bounds before centring', () => {
    const offAsset = {
      ...createUploadedAsset('toggle_scaled_off'),
      width: 402,
      height: 594,
    }
    const onAsset = {
      ...createUploadedAsset('toggle_scaled_on'),
      width: 402,
      height: 594,
    }
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const toggle = {
      ...createDefaultInteractiveToggleSwitchAsset(
        'toggle-scaled',
        'Scaled Toggle',
      ),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(toggle)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['scaled-toggle'],
      },
      'scaled-toggle': {
        id: 'scaled-toggle',
        parent: 'root',
        type: 'InteractiveToggleSwitch',
        props: {
          interactiveAssetId: toggle.id,
          w: 300,
          h: 200,
        },
        children: [],
      },
    })

    const scale = 'lv_image_set_scale(fg_scaled_toggle_toggle.image, 86);'
    const center = 'lv_obj_center(fg_scaled_toggle_toggle.image);'
    expect(result.code).toContain(
      'lv_obj_set_size(fg_scaled_toggle_toggle.button, 300, 200);',
    )
    expect(result.code).toContain(scale)
    expect(result.code.indexOf(scale)).toBeLessThan(result.code.indexOf(center))
    expect(result.code).toContain('lv_obj_add_event_cb(fg_scaled_toggle_toggle.button,')
    expect(result.code.match(/lv_image_set_scale\(fg_scaled_toggle_toggle\.image, 86\);/g)).toHaveLength(1)
  })

  it('uses descriptor dimensions as a legacy fallback when registry metadata is absent', () => {
    const offAsset = createUploadedAsset('toggle_legacy_off')
    const onAsset = createUploadedAsset('toggle_legacy_on')
    forgeUIAddUploadedAssets([offAsset, onAsset])
    const toggle = {
      ...createDefaultInteractiveToggleSwitchAsset('toggle-legacy'),
      offAssetId: offAsset.id,
      onAssetId: onAsset.id,
    }
    registerInteractiveAsset(toggle)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['legacy-toggle'],
      },
      'legacy-toggle': {
        id: 'legacy-toggle',
        parent: 'root',
        type: 'InteractiveToggleSwitch',
        props: {
          interactiveAssetId: toggle.id,
          w: 300,
          h: 200,
        },
        children: [],
      },
    })

    expect(result.code).toContain(
      'fg_interactive_toggle_contain_scale(&fg_upload_toggle_legacy_off, &fg_upload_toggle_legacy_on, 300, 200)',
    )
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

  it('exports only runtime Toggle images and ignores its retained state sheet', () => {
    const source = createUploadedAsset('source-sheet')
    const off = createUploadedAsset('runtime-off')
    const on = createUploadedAsset('runtime-on')
    forgeUIAddUploadedAssets([source, off, on])
    const toggle = {
      ...createDefaultInteractiveToggleSwitchAsset(
        'runtime-toggle',
      ),
      offAssetId: off.id,
      onAssetId: on.id,
      stateSheetSourceAssetId: source.id,
    }
    registerInteractiveAsset(toggle)

    const result = generateForgeUILvglCode({
      root: {
        id: 'root',
        parent: 'root',
        type: 'Box',
        props: {},
        children: ['toggle'],
      },
      toggle: {
        id: 'toggle',
        parent: 'root',
        type: 'InteractiveToggleSwitch',
        componentName: 'Runtime Toggle',
        props: {
          interactiveAssetId: toggle.id,
          w: 64,
          h: 36,
        },
        children: [],
      },
    } as any)

    expect(result.assetSources).toEqual(
      expect.arrayContaining([
        off.cFile,
        on.cFile,
      ]),
    )
    expect(result.assetSources).not.toContain(
      source.cFile,
    )
    expect(result.code).not.toContain(source.lvgl)
  })
})

describe('Interactive Button contain scale', () => {
  it('preserves aspect ratio and allows contained upscaling', () => {
    expect(calculateInteractiveButtonContainScale(
      420,
      160,
      [
        { width: 200, height: 100 },
        { width: 180, height: 90 },
      ],
    )).toBe(410)
    expect(calculateInteractiveButtonContainScale(
      200,
      200,
      [{ width: 200, height: 100 }],
    )).toBe(256)
  })

  it('uses the safest common scale and rejects invalid metadata', () => {
    expect(calculateInteractiveButtonContainScale(
      300,
      200,
      [
        { width: 150, height: 100 },
        { width: 300, height: 150 },
      ],
    )).toBe(256)
    expect(calculateInteractiveButtonContainScale(
      300,
      200,
      [{ width: undefined, height: 100 }],
    )).toBeUndefined()
  })
})

describe('Toggle contain scale', () => {
  it('preserves aspect ratio and uses a safe common scale for both states', () => {
    expect(calculateToggleContainScale(
      300,
      200,
      [
        { width: 402, height: 594 },
        { width: 402, height: 594 },
      ],
    )).toBe(86)
    expect(calculateToggleContainScale(
      300,
      200,
      [
        { width: 402, height: 594 },
        { width: 450, height: 600 },
      ],
    )).toBe(85)
  })

  it('uses scale 256 for matching sources and supports contained upscaling', () => {
    expect(calculateToggleContainScale(
      300,
      200,
      [{ width: 300, height: 200 }],
    )).toBe(256)
    expect(calculateToggleContainScale(
      300,
      200,
      [{ width: 150, height: 100 }],
    )).toBe(512)
  })
})

describe('Three-Position contain scale export', () => {
  it('uses one upscaling-capable scale and preserves thirds runtime mapping', () => {
    const left = { ...createUploadedAsset('three_left'), width: 100, height: 50 }
    const center = { ...createUploadedAsset('three_center'), width: 100, height: 50 }
    const right = { ...createUploadedAsset('three_right'), width: 100, height: 50 }
    forgeUIAddUploadedAssets([left, center, right])
    const asset = {
      ...createDefaultInteractiveThreePositionToggleAsset('three'),
      leftAssetId: left.id,
      centerAssetId: center.id,
      rightAssetId: right.id,
    }
    registerInteractiveAsset(asset)
    const result = generateForgeUILvglCode({
      root: {
        id: 'root', parent: 'root', type: 'Box',
        props: {}, children: ['three-component'],
      },
      'three-component': {
        id: 'three-component',
        parent: 'root',
        type: 'InteractiveThreePositionToggleSwitch',
        props: {
          interactiveAssetId: asset.id,
          x: 10, y: 20, w: 300, h: 150,
        },
        children: [],
      },
    })
    expect(result.code).toContain(
      'lv_obj_set_size(fg_three_component_three_way.button, 300, 150);',
    )
    expect(result.code).toContain(
      'lv_image_set_scale(fg_three_component_three_way.image, 768);',
    )
    expect(result.code.match(
      /lv_image_set_scale\(fg_three_component_three_way\.image, 768\);/g,
    )).toHaveLength(1)
    expect(result.code).toContain(
      'int32_t local_x = point.x - button_coords.x1;',
    )
    expect(result.code).toContain(
      'local_x < (width * 2) / 3',
    )
  })
})
