import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from './ForgeUIUploadedAssetRegistry'
import { FORGEUI_IMAGE_ASSETS } from './ForgeUIAssetRegistry'
import { allocateUniqueOutputApiName } from './ForgeUIGeneratedApiNames'

import {
  getInteractiveButtonAsset,
  getInteractiveLightAsset,
  getInteractiveLightInitialState,
  getInteractiveStatusIndicatorAsset,
  getInteractiveStatusIndicatorInitialState,
  getInteractiveToggleSwitchAsset,
  getInteractiveToggleSwitchInitialState,
  isLvglReadyUploadedAsset,
  resolveInteractiveButtonVisuals,
  resolveInteractiveLightVisuals,
  resolveInteractiveStatusIndicatorVisuals,
  resolveInteractiveToggleSwitchVisuals,
  getInteractiveThreePositionToggleAsset,
  getInteractiveThreePositionInitialState,
  resolveInteractiveThreePositionVisuals,
} from './interactive'
import {
  getInteractiveButtonHookBase,
} from './interactive/ForgeUIInteractiveButtonHook'

import {
  FG_PREVIEW_PALETTES,
  type ForgeThemeId,
} from './preview/forgeThemeMap'

const toLvHex = (
  value: string,
  fallback = '0x000000',
) => {
  if (!value) return fallback

  return `0x${String(value)
    .replace('#', '')
    .toUpperCase()}`
}

const FG_TEXTURE_ASSETS: Record<
  string,
  {
    symbol: string
    source: string
  }
> = {
  carbon_fiber: {
    symbol: 'fg_upload_carbon_fiber_be774fd2',
    source: 'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
  },

  brushed_steel: {
    symbol: 'fg_upload_brushed_steel_bc48e90c',
    source: 'assets/uploads/fg_upload_brushed_steel_bc48e90c.c',
  },

  hex_mesh: {
    symbol: 'fg_upload_hex_mesh_e46ed0b5',
    source: 'assets/uploads/fg_upload_hex_mesh_e46ed0b5.c',
  },

  dark_noise: {
    symbol: 'fg_upload_dark_noise_08fcab09',
    source: 'assets/uploads/fg_upload_dark_noise_08fcab09.c',
  },

  industrial_panel: {
    symbol: 'fg_upload_industrial_panel_8775311d',
    source: 'assets/uploads/fg_upload_industrial_panel_8775311d.c',
  },

  blueprint_grid: {
    symbol: 'fg_upload_blueprint_grid_71595117',
    source: 'assets/uploads/fg_upload_blueprint_grid_71595117.c',
  },
  ai_mesh: {
    symbol: 'fg_upload_1024x600_ai_mesh_9f3f1b39',
    source: 'assets/uploads/fg_upload_1024x600_ai_mesh_9f3f1b39.c',
  },

  ai_nexus: {
    symbol: 'fg_upload_1024x600_ai_nexus_88b196e9',
    source: 'assets/uploads/fg_upload_1024x600_ai_nexus_88b196e9.c',
  },

  creation: {
    symbol: 'fg_upload_1024x600_creation_786cf05c',
    source: 'assets/uploads/fg_upload_1024x600_creation_786cf05c.c',
  },

  nebula_core: {
    symbol: 'fg_upload_1024x600_nebula_core_0ddf52d1',
    source: 'assets/uploads/fg_upload_1024x600_nebula_core_0ddf52d1.c',
  },

  neon_horizon: {
    symbol: 'fg_upload_1024x600_neon_horizon_6dae04db',
    source: 'assets/uploads/fg_upload_1024x600_neon_horizon_6dae04db.c',
  },

  neural_core: {
    symbol: 'fg_upload_1024x600_neural_core_67dd4ba0',
    source: 'assets/uploads/fg_upload_1024x600_neural_core_67dd4ba0.c',
  },

  quantum_flow: {
    symbol: 'fg_upload_1024x600_quantum_flow_4ffa7dbc',
    source: 'assets/uploads/fg_upload_1024x600_quantum_flow_4ffa7dbc.c',
  },

  quantum_hex: {
    symbol: 'fg_upload_1024x600_quantum_hex_98c7da6c',
    source: 'assets/uploads/fg_upload_1024x600_quantum_hex_98c7da6c.c',
  },

}

const FG_ICON_LVGL_SYMBOLS: Record<string, string> = {
  FiWifi: 'LV_SYMBOL_WIFI',
  FiSettings: 'LV_SYMBOL_SETTINGS',
  FiPower: 'LV_SYMBOL_POWER',
  FiHome: 'LV_SYMBOL_HOME',
  FiMenu: 'LV_SYMBOL_LIST',
  FiSearch: 'LV_SYMBOL_SEARCH',
  FiBattery: 'LV_SYMBOL_BATTERY_FULL',
  FiBluetooth: 'LV_SYMBOL_BLUETOOTH',

  FiCheck: 'LV_SYMBOL_OK',
  FiX: 'LV_SYMBOL_CLOSE',
  FiAlertTriangle: 'LV_SYMBOL_WARNING',
  FiTrash2: 'LV_SYMBOL_TRASH',
  FiDownload: 'LV_SYMBOL_DOWNLOAD',
  FiUpload: 'LV_SYMBOL_UPLOAD',
}

const lv = (v: any, d: any = 0) =>
  v !== undefined && v !== null && v !== '' ? v : d

const esc = (v: string = '') =>
  String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

const toCIdentifier = (
  value: string,
  fallback = 'InteractiveButton',
) => {
  const cleaned = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part =>
      part.charAt(0).toUpperCase() +
      part.slice(1),
    )
    .join('')
    .replace(/^[^a-zA-Z_]/, '_')

  return cleaned || fallback
}

const createUniqueHookName = (
  baseName: string,
  usedHookNames: Set<string>,
) => {
  let hookName = `FG_On_${baseName}_Clicked`
  let suffix = 2

  while (usedHookNames.has(hookName)) {
    hookName =
      `FG_On_${baseName}_${suffix}_Clicked`

    suffix++
  }

  usedHookNames.add(hookName)

  return hookName
}

const createUniqueToggleHookName = (baseName: string, usedHookNames: Set<string>) => {
  let hookName = `FG_On_${baseName}_Toggled`
  let suffix = 2
  while (usedHookNames.has(hookName)) hookName = `FG_On_${baseName}_${suffix++}_Toggled`
  usedHookNames.add(hookName)
  return hookName
}

type ToggleInputExport = {
  hookName: string
  runtimeName: string
  offSymbol?: string
  onSymbol?: string
  initialState: 'off' | 'on'
  ready: boolean
  imageScale?: number | string
}

export const calculateToggleContainScale = (
  componentWidth: number,
  componentHeight: number,
  images: Array<{
    width?: number
    height?: number
  }>,
): number | undefined => {
  if (
    !Number.isFinite(componentWidth) ||
    !Number.isFinite(componentHeight) ||
    componentWidth <= 0 ||
    componentHeight <= 0 ||
    images.length === 0 ||
    images.some(image =>
      !Number.isFinite(image.width) ||
      !Number.isFinite(image.height) ||
      Number(image.width) <= 0 ||
      Number(image.height) <= 0,
    )
  ) {
    return undefined
  }

  const ratio = Math.min(
    ...images.flatMap(image => [
      componentWidth / Number(image.width),
      componentHeight / Number(image.height),
    ]),
  )

  return Math.max(
    1,
    Math.min(65535, Math.round(ratio * 256)),
  )
}

export const calculateInteractiveButtonContainScale = (
  componentWidth: number,
  componentHeight: number,
  images: Array<{
    width?: number
    height?: number
  }>,
): number | undefined => {
  if (
    !Number.isFinite(componentWidth) ||
    !Number.isFinite(componentHeight) ||
    componentWidth <= 0 ||
    componentHeight <= 0 ||
    images.length === 0 ||
    images.some(image =>
      !Number.isFinite(image.width) ||
      !Number.isFinite(image.height) ||
      Number(image.width) <= 0 ||
      Number(image.height) <= 0,
    )
  ) {
    return undefined
  }

  const ratio = Math.min(
    ...images.flatMap(image => [
      componentWidth / Number(image.width),
      componentHeight / Number(image.height),
    ]),
  )

  return Math.max(
    1,
    Math.min(65535, Math.round(ratio * 256)),
  )
}

const createToggleInputExports = (
  components: IComponents,
  usedAssetSources: Set<string>,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
): Map<string, ToggleInputExport> => {
  const result = new Map<string, ToggleInputExport>()
  const uploadedAssets = forgeUIGetUploadedAssets()
  Object.values(components)
    .filter(component => component.type === 'InteractiveToggleSwitch')
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const asset = component.props.interactiveAssetId
        ? getInteractiveToggleSwitchAsset(component.props.interactiveAssetId)
        : undefined
      const base = toCIdentifier(component.componentName || asset?.label || asset?.name || component.id, 'InteractiveToggleSwitch')
      const hookName = createUniqueToggleHookName(base, usedHookNames)
      userEventHooks.add(hookName)
      const { offAsset, onAsset } = resolveInteractiveToggleSwitchVisuals(asset, uploadedAssets)
      const ready = isLvglReadyUploadedAsset(offAsset) && isLvglReadyUploadedAsset(onAsset)
      const resolvedScale = ready
        ? calculateToggleContainScale(
          Number(component.props.w),
          Number(component.props.h),
          [offAsset, onAsset],
        )
        : undefined
      const componentWidth = Number(lv(component.props.w, 64))
      const componentHeight = Number(lv(component.props.h, 36))
      if (ready) {
        if (offAsset.cFile) usedAssetSources.add(offAsset.cFile)
        if (onAsset.cFile) usedAssetSources.add(onAsset.cFile)
      }
      result.set(component.id, {
        hookName,
        runtimeName: `fg_${component.id.replace(/[^A-Za-z0-9_]/g, '_')}_toggle`,
        offSymbol: ready ? offAsset?.lvgl : undefined,
        onSymbol: ready ? onAsset?.lvgl : undefined,
        initialState: getInteractiveToggleSwitchInitialState(asset),
        ready,
        imageScale: ready
          ? resolvedScale ??
            `fg_interactive_toggle_contain_scale(&${offAsset?.lvgl}, &${onAsset?.lvgl}, ${componentWidth}, ${componentHeight})`
          : undefined,
      })
    })
  return result
}

type ThreeWayInputExport = { hookName: string; runtimeName: string; leftSymbol?: string; centerSymbol?: string; rightSymbol?: string; initialState: 'left'|'center'|'right'; ready: boolean; imageScale?: number | string }
const createThreeWayInputExports = (components: IComponents, usedAssetSources: Set<string>, usedHookNames: Set<string>, userEventHooks: Set<string>) => {
  const result = new Map<string, ThreeWayInputExport>(); const uploaded = forgeUIGetUploadedAssets()
  Object.values(components).filter(c => c.type === 'InteractiveThreePositionToggleSwitch').sort((a,b)=>a.id.localeCompare(b.id)).forEach(component => {
    const asset = component.props.interactiveAssetId ? getInteractiveThreePositionToggleAsset(component.props.interactiveAssetId) : undefined
    const base = toCIdentifier(component.componentName || asset?.label || asset?.name || component.id, 'ThreePositionToggle')
    let hookName = `FG_On_${base}_Changed`; let suffix=2; while(usedHookNames.has(hookName)) hookName=`FG_On_${base}_${suffix++}_Changed`; usedHookNames.add(hookName); userEventHooks.add(hookName)
    const {leftAsset,centerAsset,rightAsset}=resolveInteractiveThreePositionVisuals(asset,uploaded); const ready=[leftAsset,centerAsset,rightAsset].every(isLvglReadyUploadedAsset)
    const width=Number(lv(component.props.w,96)); const height=Number(lv(component.props.h,36))
    const dimensions=[leftAsset,centerAsset,rightAsset].map(item=>item?forgeUIResolveUploadedAssetDimensions(item)||{}:{})
    const resolvedScale=ready?calculateToggleContainScale(width,height,dimensions):undefined
    if(ready) [leftAsset,centerAsset,rightAsset].forEach(a=>{if(a?.cFile)usedAssetSources.add(a.cFile)})
    result.set(component.id,{hookName,runtimeName:`fg_${component.id.replace(/[^A-Za-z0-9_]/g,'_')}_three_way`,leftSymbol:ready?leftAsset?.lvgl:undefined,centerSymbol:ready?centerAsset?.lvgl:undefined,rightSymbol:ready?rightAsset?.lvgl:undefined,initialState:getInteractiveThreePositionInitialState(asset),ready,imageScale:ready?resolvedScale??`fg_interactive_three_way_contain_scale(&${leftAsset?.lvgl}, &${centerAsset?.lvgl}, &${rightAsset?.lvgl}, ${width}, ${height})`:undefined})
  }); return result
}

type BinaryOutputExport = {
  apiName: string
  runtimeName: string
  offSymbol?: string
  onSymbol?: string
  initialState: 'off' | 'on'
  ready: boolean
  imageScale?: number | string
}

const createBinaryOutputExports = (
  components: IComponents,
  usedAssetSources: Set<string>,
): Map<string, BinaryOutputExport> => {
  const exportsByComponent = new Map<string, BinaryOutputExport>()
  const usedApiNames = new Set<string>()
  const uploadedAssets = forgeUIGetUploadedAssets()

  Object.values(components)
    .filter(component =>
      component.type === 'InteractiveLight' ||
      component.type === 'InteractiveStatusIndicator',
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const isStatusIndicator = component.type === 'InteractiveStatusIndicator'
      const asset = component.props.interactiveAssetId
        ? isStatusIndicator
          ? getInteractiveStatusIndicatorAsset(component.props.interactiveAssetId)
          : getInteractiveLightAsset(component.props.interactiveAssetId)
        : undefined
      const baseName = toCIdentifier(
        component.componentName ||
        asset?.label ||
        asset?.name ||
        component.id,
        isStatusIndicator ? 'InteractiveStatusIndicator' : 'InteractiveLight',
      )
        .replace(/WiFi/g, 'Wizfi')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/Wizfi/g, 'WiFi')

      const apiName = allocateUniqueOutputApiName(
        baseName,
        usedApiNames,
      )

      const runtimeStem = apiName
        .replace(/^FG_Set_/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
      const { offAsset, onAsset } = isStatusIndicator
        ? resolveInteractiveStatusIndicatorVisuals(asset, uploadedAssets)
        : resolveInteractiveLightVisuals(asset, uploadedAssets)
      const ready =
        isLvglReadyUploadedAsset(offAsset) &&
        isLvglReadyUploadedAsset(onAsset) &&
        Boolean(offAsset?.lvgl) &&
        Boolean(onAsset?.lvgl)
      const componentWidth = Number(lv(component.props.w, 120))
      const componentHeight = Number(lv(component.props.h, 40))
      const offDimensions = offAsset
        ? forgeUIResolveUploadedAssetDimensions(offAsset)
        : undefined
      const onDimensions = onAsset
        ? forgeUIResolveUploadedAssetDimensions(onAsset)
        : undefined
      const resolvedScale =
        ready
          ? calculateInteractiveButtonContainScale(
              componentWidth,
              componentHeight,
              [offDimensions || {}, onDimensions || {}],
            )
          : undefined

      if (ready) {
        if (offAsset.cFile) usedAssetSources.add(offAsset.cFile)
        if (onAsset.cFile) usedAssetSources.add(onAsset.cFile)
      }

      exportsByComponent.set(component.id, {
        apiName,
        runtimeName: `fg_${runtimeStem}_output`,
        offSymbol: ready ? offAsset?.lvgl : undefined,
        onSymbol: ready ? onAsset?.lvgl : undefined,
        initialState: isStatusIndicator
          ? getInteractiveStatusIndicatorInitialState(asset)
          : getInteractiveLightInitialState(asset),
        ready,
        imageScale:
          ready
            ? resolvedScale ??
              `fg_interactive_light_contain_scale(&${offAsset?.lvgl}, &${onAsset?.lvgl}, ${componentWidth}, ${componentHeight})`
            : undefined,
      })
    })

  return exportsByComponent
}

const buildLvglBlock = (
  component: IComponent,
  components: IComponents,
  parentVar: string,
  lines: string[],
  counter: { value: number },
    palette: any,
  usedAssetSources: Set<string>,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  binaryOutputExports: Map<string, BinaryOutputExport>,
  toggleInputExports: Map<string, ToggleInputExport>,
  threeWayInputExports: Map<string, ThreeWayInputExport>,
) => {
  ;(component.children || []).forEach((key: string) => {
    const child = components[key]
    if (!child) return

    counter.value++
    const varName = `obj${counter.value}`

    const x = lv(child.props.x, 0)
    const y = lv(child.props.y, 0)
    const w = lv(child.props.w, 120)
    const h = lv(child.props.h, 40)

    switch (child.type) {
      case 'Text': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.value ||
            'Text'
        )



        const color = child.props.color
          ? `0x${String(child.props.color).replace('#', '')}`
          : palette.text

        const fontSize = lv(child.props.fontSize, 24)

        lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
        lines.push(`lv_label_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
        lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${fontSize}, 0);`)
        lines.push(``)
        break
      }

      case 'Heading': {
  const text = esc(
    child.props.children ||
    child.props.text ||
    child.props.value ||
    'Heading'
  )

    const color = child.props.color
    ? `0x${String(child.props.color).replace('#', '')}`
    : palette.text

  lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_32, 0);`)
  lines.push(``)
  break
}

case 'Clock': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.value ||
      '12:34'
  )

  lines.push(`fg_clock_label = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(fg_clock_label, "${text}");`)
  lines.push(`lv_obj_set_pos(fg_clock_label, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(fg_clock_label, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(fg_clock_label, lv_color_hex(0x00D4FF), 0);`)
  lines.push(`lv_obj_set_style_text_font(fg_clock_label, &lv_font_montserrat_32, 0);`)
  lines.push(``)
  break
}

case 'WiFi': {
  lines.push(`fg_wifi_label = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(fg_wifi_label, "WIFI\\nDISCONNECTED\\nIP: -");`)
  lines.push(`lv_obj_set_pos(fg_wifi_label, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(fg_wifi_label, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(fg_wifi_label, lv_color_hex(0x00D4FF), 0);`)
  lines.push(`lv_obj_set_style_text_font(fg_wifi_label, &lv_font_montserrat_20, 0);`)
  lines.push(`lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_WRAP);`)
  lines.push(``)
  break
}
      
            case 'Button': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.label ||
            'Button'
        )

        lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

        lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
        lines.push(`lv_label_set_text(${varName}_label, "${text}");`)
        lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_center(${varName}_label);`)
        lines.push(``)
        break
      }

case 'InteractiveButton': {
  const interactiveAssetId =
    child.props.interactiveAssetId

  const interactiveAsset =
    interactiveAssetId
      ? getInteractiveButtonAsset(
          interactiveAssetId,
        )
      : undefined
        const buttonBaseName =
    getInteractiveButtonHookBase(
      interactiveAsset?.label ||
      child.props.label ||
      child.props.name ||
      varName,
    )

  const clickedHookName =
    createUniqueHookName(
      buttonBaseName,
      usedHookNames,
    )

  userEventHooks.add(clickedHookName)

  const uploadedAssets =
    forgeUIGetUploadedAssets()

  const {
    normalAsset,
    pressedAsset,
  } = resolveInteractiveButtonVisuals(
    interactiveAsset,
    uploadedAssets,
  )

  const normalReady =
    isLvglReadyUploadedAsset(normalAsset)

  const pressedReady =
    isLvglReadyUploadedAsset(pressedAsset)

  if (
    normalReady &&
    pressedReady
  ) {
    const normalSymbol =
      normalAsset.lvgl

    const pressedSymbol =
      pressedAsset.lvgl
    const normalDimensions =
      forgeUIResolveUploadedAssetDimensions(
        normalAsset,
      )
    const pressedDimensions =
      forgeUIResolveUploadedAssetDimensions(
        pressedAsset,
      )
    const resolvedImageScale =
      calculateInteractiveButtonContainScale(
        Number(w),
        Number(h),
        [
          normalDimensions || {},
          pressedDimensions || {},
        ],
      )
    const imageScale =
      resolvedImageScale ??
      `fg_interactive_button_contain_scale(&${normalSymbol}, &${pressedSymbol}, ${w}, ${h})`

    if (normalAsset.cFile) {
      usedAssetSources.add(
        normalAsset.cFile,
      )
    }

    if (pressedAsset.cFile) {
      usedAssetSources.add(
        pressedAsset.cFile,
      )
    }

    lines.push(
      `LV_IMAGE_DECLARE(${normalSymbol});`,
    )

    if (
      pressedSymbol !== normalSymbol
    ) {
      lines.push(
        `LV_IMAGE_DECLARE(${pressedSymbol});`,
      )
    }

    lines.push(
      `lv_obj_t * ${varName} = lv_button_create(${parentVar});`,
    )

    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )

    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )

    lines.push(
      `lv_obj_set_style_radius(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_border_width(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
  `lv_obj_t * ${varName}_img = lv_image_create(${varName});`,
)

lines.push(
  `lv_image_set_src(${varName}_img, &${normalSymbol});`,
)

lines.push(
   `lv_image_set_scale(${varName}_img, ${imageScale});`,
)

lines.push(
  `lv_obj_center(${varName}_img);`,
)

lines.push(
  `lv_obj_clear_flag(${varName}_img, LV_OBJ_FLAG_CLICKABLE);`,
)

lines.push(
  `lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`,
)

lines.push(
  `static fg_interactive_button_data_t ${varName}_data = {`,
)

lines.push(
  `    .normal_src = &${normalSymbol},`,
)

lines.push(
  `    .pressed_src = &${pressedSymbol},`,
)

lines.push(
  `    .clicked_cb = ${clickedHookName},`,
)

lines.push(
  `    .event_name = "${clickedHookName}",`,
)

lines.push(
  `};`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &${varName}_data);`,
)

} else {
  const label = esc(
    interactiveAsset?.label ||
      'Interactive Button',
  )
    lines.push(
      `lv_obj_t * ${varName} = lv_button_create(${parentVar});`,
    )

    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )

    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )

    lines.push(
      `lv_obj_set_style_radius(${varName}, 12, 0);`,
    )

    lines.push(
      `lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_border_width(${varName}, 2, 0);`,
    )

    lines.push(
      `lv_obj_t * ${varName}_label = lv_label_create(${varName});`,
    )

    lines.push(
      `lv_label_set_text(${varName}_label, "${label}\\nMissing Interactive Assets");`,
    )

    lines.push(
      `lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`,
    )

    lines.push(
      `lv_obj_center(${varName}_label);`,
    )
  }

  lines.push(``)
  break
}

case 'InteractiveLight':
case 'InteractiveStatusIndicator': {
  const lightExport = binaryOutputExports.get(child.id)
  const lightWidth = Number(w)
  const lightHeight = Number(h)
  const safeLightWidth =
    Number.isFinite(lightWidth) && lightWidth > 0
      ? lightWidth
      : 32
  const safeLightHeight =
    Number.isFinite(lightHeight) && lightHeight > 0
      ? lightHeight
      : 32

  if (
    lightExport?.ready &&
    lightExport.offSymbol &&
    lightExport.onSymbol
  ) {
    lines.push(
      `lv_obj_t * ${lightExport.runtimeName}_obj = lv_obj_create(${parentVar});`,
    )
    lines.push(
      `lv_obj_set_pos(${lightExport.runtimeName}_obj, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_size(${lightExport.runtimeName}_obj, ${safeLightWidth}, ${safeLightHeight});`,
    )
    lines.push(
      `lv_obj_set_style_bg_opa(${lightExport.runtimeName}_obj, LV_OPA_TRANSP, LV_PART_MAIN);`,
    )
    lines.push(
      `lv_obj_set_style_border_width(${lightExport.runtimeName}_obj, 0, LV_PART_MAIN);`,
    )
    lines.push(
      `lv_obj_set_style_pad_all(${lightExport.runtimeName}_obj, 0, LV_PART_MAIN);`,
    )
    lines.push(
      `${lightExport.runtimeName}.image = lv_image_create(${lightExport.runtimeName}_obj);`,
    )
    lines.push(
      `fg_binary_output_set(&${lightExport.runtimeName}, ${lightExport.initialState === 'on' ? 'true' : 'false'});`,
    )
    lines.push(
      `lv_image_set_scale(${lightExport.runtimeName}.image, ${lightExport.imageScale});`,
    )
    lines.push(
      `lv_obj_center(${lightExport.runtimeName}.image);`,
    )
    lines.push(
      `lv_obj_clear_flag(${lightExport.runtimeName}_obj, LV_OBJ_FLAG_CLICKABLE);`,
    )
    lines.push(
      `lv_obj_clear_flag(${lightExport.runtimeName}_obj, LV_OBJ_FLAG_SCROLLABLE);`,
    )
    lines.push(
      `lv_obj_clear_flag(${lightExport.runtimeName}.image, LV_OBJ_FLAG_CLICKABLE);`,
    )
    lines.push(
      `lv_obj_clear_flag(${lightExport.runtimeName}.image, LV_OBJ_FLAG_SCROLLABLE);`,
    )
  } else {
    lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
    lines.push(
      `lv_label_set_text(${varName}, "Missing Interactive Binary Output Assets");`,
    )
    lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
    lines.push(`lv_obj_set_size(${varName}, ${safeLightWidth}, ${safeLightHeight});`)
    lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_CLICKABLE);`)
    lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
  }

  lines.push(``)
  break
}

case 'InteractiveToggleSwitch': {
  const toggle = toggleInputExports.get(child.id)
  if (toggle?.ready && toggle.offSymbol && toggle.onSymbol) {
    lines.push(`${toggle.runtimeName}.button = lv_button_create(${parentVar});`)
    lines.push(`lv_obj_remove_style_all(${toggle.runtimeName}.button);`)
    lines.push(`lv_obj_set_pos(${toggle.runtimeName}.button, ${x}, ${y});`)
    lines.push(`lv_obj_set_size(${toggle.runtimeName}.button, ${w}, ${h});`)
    lines.push(`lv_obj_set_style_bg_opa(${toggle.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_opa(${toggle.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_outline_opa(${toggle.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_shadow_opa(${toggle.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_pad_all(${toggle.runtimeName}.button, 0, LV_PART_MAIN);`)
    lines.push(`${toggle.runtimeName}.image = lv_image_create(${toggle.runtimeName}.button);`)
    lines.push(`lv_obj_remove_style_all(${toggle.runtimeName}.image);`)
    lines.push(`lv_obj_set_style_bg_opa(${toggle.runtimeName}.image, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_opa(${toggle.runtimeName}.image, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_outline_opa(${toggle.runtimeName}.image, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_shadow_opa(${toggle.runtimeName}.image, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_pad_all(${toggle.runtimeName}.image, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${toggle.runtimeName}.image, LV_OBJ_FLAG_CLICKABLE);`)
    if (toggle.imageScale !== undefined) {
      lines.push(`lv_image_set_scale(${toggle.runtimeName}.image, ${toggle.imageScale});`)
    }
    lines.push(`lv_obj_center(${toggle.runtimeName}.image);`)
    lines.push(`fg_toggle_input_set(&${toggle.runtimeName}, ${toggle.initialState === 'on' ? 'true' : 'false'}, false);`)
    lines.push(`lv_obj_add_event_cb(${toggle.runtimeName}.button, fg_toggle_input_event_cb, LV_EVENT_CLICKED, &${toggle.runtimeName});`)
  } else {
    lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
    lines.push(`lv_label_set_text(${varName}, "Missing Interactive Toggle Assets");`)
    lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
    lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  }
  lines.push(``)
  break
}

case 'InteractiveThreePositionToggleSwitch': {
  const input = threeWayInputExports.get(child.id)
  if (input?.ready && input.leftSymbol && input.centerSymbol && input.rightSymbol) {
    lines.push(`${input.runtimeName}.button = lv_button_create(${parentVar});`)
    lines.push(`lv_obj_remove_style_all(${input.runtimeName}.button);`)
    lines.push(`lv_obj_set_pos(${input.runtimeName}.button, ${x}, ${y});`)
    lines.push(`lv_obj_set_size(${input.runtimeName}.button, ${w}, ${h});`)
    lines.push(`lv_obj_set_style_bg_opa(${input.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_opa(${input.runtimeName}.button, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_add_flag(${input.runtimeName}.button, LV_OBJ_FLAG_CLICKABLE);`)
    lines.push(`lv_obj_clear_flag(${input.runtimeName}.button, LV_OBJ_FLAG_SCROLLABLE);`)
    lines.push(`lv_obj_set_style_pad_all(${input.runtimeName}.button, 0, 0);`)
    lines.push(`${input.runtimeName}.image = lv_image_create(${input.runtimeName}.button);`)
    lines.push(`lv_obj_remove_style_all(${input.runtimeName}.image);`)
    lines.push(`lv_obj_clear_flag(${input.runtimeName}.image, LV_OBJ_FLAG_CLICKABLE);`)
    lines.push(`lv_obj_clear_flag(${input.runtimeName}.image, LV_OBJ_FLAG_SCROLLABLE);`)
    if (input.imageScale !== undefined) {
      lines.push(`lv_image_set_scale(${input.runtimeName}.image, ${input.imageScale});`)
    }
    lines.push(`lv_obj_center(${input.runtimeName}.image);`)
    lines.push(`fg_three_way_input_set(&${input.runtimeName}, ${input.initialState === 'left' ? 'FG_THREE_WAY_LEFT' : input.initialState === 'right' ? 'FG_THREE_WAY_RIGHT' : 'FG_THREE_WAY_CENTER'}, false);`)
    lines.push(`lv_obj_add_event_cb(${input.runtimeName}.button, fg_three_way_input_event_cb, LV_EVENT_CLICKED, &${input.runtimeName});`)
  } else { lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`); lines.push(`lv_label_set_text(${varName}, "Missing Three-Position Toggle Assets");`); lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`); lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`) }
  lines.push(``); break
}

      case 'IconButton': {
  lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

  lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_label, LV_SYMBOL_OK);`)
  lines.push(`lv_obj_center(${varName}_label);`)

  lines.push(``)
  break
}

case 'Icon': {

  const src =
    child.props.src ||
    child.props.browserSrc ||
    ''

  const uploadedAssets = forgeUIGetUploadedAssets()

  const uploadedAsset = uploadedAssets.find(
    (asset: any) =>
      asset.id === child.props.uploadedAssetId ||
      asset.browserSrc === src ||
      asset.name === child.props.assetName,
  )
  if (
    uploadedAsset?.exportStatus === 'lvgl_ready' &&
    uploadedAsset?.lvgl
  ) {
    const symbol = uploadedAsset.lvgl
    const cFile = uploadedAsset.cFile

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(
      child.props.imageScale || 256,
    )

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(
      `lv_obj_t * ${varName} = lv_image_create(${parentVar});`,
    )
    lines.push(
      `lv_image_set_src(${varName}, &${symbol});`,
    )
    lines.push(
      `lv_image_set_scale(${varName}, ${imageScale});`,
    )
    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )
  } else {
    const icon =
      child.props.icon ||
      'FiSettings'

    const symbol =
      FG_ICON_LVGL_SYMBOLS[icon] ||
      'LV_SYMBOL_SETTINGS'

    const color = child.props.color
      ? `0x${String(child.props.color).replace('#', '')}`
      : palette.text

    const iconSize = lv(
      child.props.boxSize,
      48,
    )

    lines.push(
      `lv_obj_t * ${varName} = lv_label_create(${parentVar});`,
    )
    lines.push(
      `lv_label_set_text(${varName}, ${symbol});`,
    )
    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`,
    )
    lines.push(
      `lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${iconSize}, 0);`,
    )
  }

  lines.push(``)
  break
}

            case 'Input': {
        const text = esc(child.props.placeholder || child.props.value || 'Input')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Textarea': {
        const text = esc(child.props.placeholder || child.props.value || 'Textarea')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }
      
      case 'Switch': {
  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_switch_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

      case 'Checkbox': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Checkbox'
  )

  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(``)
  break
}

  
        
      case 'NumberInput': {
        const text = esc(String(child.props.value || '123'))

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Select': {
  lines.push(`lv_obj_t * ${varName} = lv_dropdown_create(${parentVar});`)
  lines.push(`lv_dropdown_set_options(${varName}, "Option 1\\nOption 2\\nOption 3");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

  lines.push(``)
  break
}

case 'Image': {
  const src = child.props.src || ''
  const uploadedAssets = forgeUIGetUploadedAssets()

  const presetAsset = FORGEUI_IMAGE_ASSETS.find(
    (a: any) => a.src === src
  )

  const uploadedAsset = uploadedAssets.find((a: any) =>
  a.id === child.props.uploadedAssetId ||
  a.browserSrc === src ||
  a.browserSrc === child.props.src ||
  a.name === child.props.assetName ||
  a.name === child.props.alt
)

  const asset: any = presetAsset || uploadedAsset

  if (asset?.lvgl || asset?.symbolName) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(child.props.imageScale || 256)

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`lv_obj_t * ${varName} = lv_image_create(${parentVar});`)
    lines.push(`lv_image_set_src(${varName}, &${symbol});`)
    lines.push(`lv_image_set_scale(${varName}, ${imageScale});`)
  } else {
    const uploadName = esc(
      child.props.alt ||
      child.props.assetName ||
      'Uploaded Asset'
    )

    lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
    lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
    lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
    lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
    lines.push(`lv_label_set_text(${varName}_label, "${uploadName}\\nPending LVGL Export");`)
    lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
    lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`)
    lines.push(`lv_obj_center(${varName}_label);`)
  }

  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_transform_pivot_x(${varName}, ${Math.floor(w / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_pivot_y(${varName}, ${Math.floor(h / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 256, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 235, LV_STATE_PRESSED);`)

  lines.push(``)
  break
}
    
case 'Slider': {
  lines.push(`lv_obj_t * ${varName} = lv_slider_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_slider_set_value(${varName}, ${lv(child.props.value, 50)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

case 'Progress': {
  lines.push(`lv_obj_t * ${varName} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${varName}, 0, 100);`)
  lines.push(`lv_bar_set_value(${varName}, ${lv(child.props.value, 65)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'CircularProgress': {
  lines.push(`lv_obj_t * ${varName} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${varName}, 0, 100);`)
  lines.push(`lv_arc_set_value(${varName}, ${lv(child.props.value, 65)});`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

case 'Led': {
  const size = Math.min(Number(w), Number(h), 48)

  lines.push(`lv_obj_t * ${varName} = lv_led_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${size}, ${size});`)
  lines.push(`lv_led_set_color(${varName}, lv_palette_main(LV_PALETTE_GREEN));`)
  lines.push(`lv_led_set_brightness(${varName}, 255);`)
  lines.push(`lv_led_on(${varName});`)
  lines.push(``)
  break
}

case 'Bar': {
  lines.push(`lv_obj_t * ${varName} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${varName}, 0, 100);`)
  lines.push(`lv_bar_set_value(${varName}, 70, LV_ANIM_OFF);`)
  lines.push(``)
  break
}

case 'Arc': {
  lines.push(`lv_obj_t * ${varName} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${varName}, 0, 100);`)
  lines.push(`lv_arc_set_value(${varName}, 65);`)
  lines.push(``)
  break
}

case 'Roller': {
  lines.push(`lv_obj_t * ${varName} = lv_roller_create(${parentVar});`)
  lines.push(`lv_roller_set_options(${varName}, "One\\nTwo\\nThree\\nFour", LV_ROLLER_MODE_NORMAL);`)
  lines.push(`lv_roller_set_visible_row_count(${varName}, 3);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_SELECTED);`)
  lines.push(``)
  break
}

case 'Canvas': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Line': {
  lines.push(`static lv_point_precise_t ${varName}_pts[] = {`)
  lines.push(`  {0, 0},`)
  lines.push(`  {${w}, ${h}}`)
  lines.push(`};`)

  lines.push(`lv_obj_t * ${varName} = lv_line_create(${parentVar});`)
  lines.push(`lv_line_set_points(${varName}, ${varName}_pts, 2);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_width(${varName}, 3, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Tabview': {
  lines.push(`lv_obj_t * ${varName} = lv_tabview_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_tab1 = lv_tabview_add_tab(${varName}, "Tab 1");`)
  lines.push(`lv_obj_t * ${varName}_tab2 = lv_tabview_add_tab(${varName}, "Tab 2");`)
  lines.push(`lv_obj_t * ${varName}_tab3 = lv_tabview_add_tab(${varName}, "Tab 3");`)

  lines.push(`lv_obj_set_style_bg_color(${varName}_tab1, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_tab2, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_tab3, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tab1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tab 1 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl1, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl1);`)

  lines.push(`lv_obj_t * ${varName}_lbl2 = lv_label_create(${varName}_tab2);`)
  lines.push(`lv_label_set_text(${varName}_lbl2, "Tab 2 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl2, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl2);`)

  lines.push(`lv_obj_t * ${varName}_lbl3 = lv_label_create(${varName}_tab3);`)
  lines.push(`lv_label_set_text(${varName}_lbl3, "Tab 3 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl3, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl3);`)

  lines.push(``)
  break
}

case 'Tileview': {
  lines.push(`lv_obj_t * ${varName} = lv_tileview_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_tile1 = lv_tileview_add_tile(${varName}, 0, 0, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile2 = lv_tileview_add_tile(${varName}, 1, 0, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile3 = lv_tileview_add_tile(${varName}, 0, 1, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile4 = lv_tileview_add_tile(${varName}, 1, 1, LV_DIR_ALL);`)

  ;[1, 2, 3, 4].forEach((n) => {
    lines.push(`lv_obj_set_style_bg_color(${varName}_tile${n}, lv_color_hex(${n === 1 ? palette.border : palette.surface2}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tile${n}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_tile${n}, LV_OBJ_FLAG_SCROLLABLE);`)
  })

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tile1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tile 1");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl1, lv_color_hex(${palette.bg}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl1);`)

  lines.push(`lv_obj_t * ${varName}_lbl2 = lv_label_create(${varName}_tile2);`)
  lines.push(`lv_label_set_text(${varName}_lbl2, "Tile 2");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl2, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl2);`)

  lines.push(`lv_obj_t * ${varName}_lbl3 = lv_label_create(${varName}_tile3);`)
  lines.push(`lv_label_set_text(${varName}_lbl3, "Tile 3");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl3, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl3);`)

  lines.push(`lv_obj_t * ${varName}_lbl4 = lv_label_create(${varName}_tile4);`)
  lines.push(`lv_label_set_text(${varName}_lbl4, "Tile 4");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl4, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl4);`)

  lines.push(``)
  break
}

case 'AnimImage': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_label, "AnimImage");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_label);`)

  lines.push(``)
  break
}


case 'ButtonMatrix': {
  lines.push(`static const char * ${varName}_map[] = {"One", "Two", "Three", "\\n", "Four", "Five", "Six", ""};`)

  lines.push(`lv_obj_t * ${varName} = lv_buttonmatrix_create(${parentVar});`)
  lines.push(`lv_buttonmatrix_set_map(${varName}, ${varName}_map);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_ITEMS | LV_STATE_CHECKED);`)

  lines.push(`lv_buttonmatrix_set_selected_button(${varName}, 1);`)

  lines.push(``)
  break
}

case 'Msgbox': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)

  lines.push(``)

  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_title, "Message");`)
  lines.push(`lv_obj_align(${varName}_title, LV_ALIGN_TOP_LEFT, 10, 8);`)

  lines.push(`lv_obj_t * ${varName}_text = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_text, "Example message text");`)
  lines.push(`lv_obj_set_width(${varName}_text, ${Math.max(80, w - 20)});`)
  lines.push(`lv_label_set_long_mode(${varName}_text, LV_LABEL_LONG_WRAP);`)
  lines.push(`lv_obj_align(${varName}_text, LV_ALIGN_TOP_LEFT, 10, 30);`)

  lines.push(`lv_obj_t * ${varName}_ok = lv_button_create(${varName});`)
  lines.push(`lv_obj_set_size(${varName}_ok, 56, 26);`)
  lines.push(`lv_obj_align(${varName}_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);`)

  lines.push(`lv_obj_t * ${varName}_ok_lbl = lv_label_create(${varName}_ok);`)
  lines.push(`lv_label_set_text(${varName}_ok_lbl, "OK");`)
  lines.push(`lv_obj_center(${varName}_ok_lbl);`)

  lines.push(`lv_obj_t * ${varName}_cancel = lv_button_create(${varName});`)
  lines.push(`lv_obj_set_size(${varName}_cancel, 64, 26);`)
  lines.push(`lv_obj_align(${varName}_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);`)

  lines.push(`lv_obj_t * ${varName}_cancel_lbl = lv_label_create(${varName}_cancel);`)
  lines.push(`lv_label_set_text(${varName}_cancel_lbl, "Cancel");`)
  lines.push(`lv_obj_center(${varName}_cancel_lbl);`)

  lines.push(``)
  break
}

case 'Table': {
  lines.push(`lv_obj_t * ${varName} = lv_table_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_table_set_cell_value(${varName}, 0, 0, "A1");`)
  lines.push(`lv_table_set_cell_value(${varName}, 0, 1, "B1");`)
  lines.push(`lv_table_set_cell_value(${varName}, 1, 0, "A2");`)
  lines.push(`lv_table_set_cell_value(${varName}, 1, 1, "B2");`)

  // Theme styling
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_ITEMS);`)

  lines.push(``)
  break
}

case 'Scale': {
  lines.push(`lv_obj_t * ${varName} = lv_scale_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_scale_set_mode(${varName}, LV_SCALE_MODE_HORIZONTAL_BOTTOM);`)
  lines.push(`lv_scale_set_range(${varName}, 0, 100);`)
  lines.push(`lv_scale_set_total_tick_count(${varName}, 11);`)
  lines.push(`lv_scale_set_major_tick_every(${varName}, 2);`)
  lines.push(``)
  break
}

case 'Keyboard': {
  lines.push(`// ForgeUI Keyboard component ${esc(child.id)} -> ${varName}`)
  lines.push(`static const char * const ${varName}_map[] = {`)
  lines.push(`    "1#", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", LV_SYMBOL_BACKSPACE, "\\n",`)
  lines.push(`    "ABC", "a", "s", "d", "f", "g", "h", "j", "k", "l", LV_SYMBOL_NEW_LINE, "\\n",`)
  lines.push(`    "_", "-", "z", "x", "c", "v", "b", "n", "m", ".", ",", ":", "\\n",`)
  lines.push(`    LV_SYMBOL_KEYBOARD, LV_SYMBOL_LEFT, " ", LV_SYMBOL_RIGHT, LV_SYMBOL_OK, ""`)
  lines.push(`};`)
  lines.push(`static const lv_buttonmatrix_ctrl_t ${varName}_ctrl[] = {`)
  lines.push(`    LV_KEYBOARD_CTRL_BUTTON_FLAGS | 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, LV_BUTTONMATRIX_CTRL_CHECKED | 4,`)
  lines.push(`    LV_KEYBOARD_CTRL_BUTTON_FLAGS | 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, LV_BUTTONMATRIX_CTRL_CHECKED | 3,`)
  lines.push(`    LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, 1, 1, 1, 1, 1, 1, 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1, LV_BUTTONMATRIX_CTRL_CHECKED | 1,`)
  lines.push(`    LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2, LV_BUTTONMATRIX_CTRL_CHECKED | 2, 12, LV_BUTTONMATRIX_CTRL_CHECKED | 2, LV_KEYBOARD_CTRL_BUTTON_FLAGS | 2`)
  lines.push(`};`)

  lines.push(`lv_obj_t * ${varName}_ta = lv_textarea_create(${parentVar});`)
  lines.push(`lv_textarea_set_one_line(${varName}_ta, true);`)
  lines.push(`lv_textarea_set_placeholder_text(${varName}_ta, "Keyboard input");`)
  lines.push(`lv_obj_set_pos(${varName}_ta, ${x}, ${Math.max(0, Number(y) - 55)});`)
  lines.push(`lv_obj_set_size(${varName}_ta, ${w}, 45);`)

  lines.push(`lv_obj_t * ${varName} = lv_keyboard_create(${parentVar});`)
  lines.push(`lv_keyboard_set_map(${varName}, LV_KEYBOARD_MODE_TEXT_LOWER, ${varName}_map, ${varName}_ctrl);`)
  lines.push(`lv_keyboard_set_textarea(${varName}, ${varName}_ta);`)
  lines.push(`lv_keyboard_set_mode(${varName}, LV_KEYBOARD_MODE_TEXT_LOWER);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_row(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_outline_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 6, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_outline_width(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_12, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_line_space(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_align(${varName}, LV_ALIGN_TOP_LEFT);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_update_layout(lv_screen_active());`)
  lines.push(`lv_area_t ${varName}_coords;`)
  lines.push(`lv_obj_get_coords(${varName}, &${varName}_coords);`)
  lines.push(`printf("[ForgeUI][Keyboard ${esc(child.id)}] obj=${varName} parent=%p local=(%ld,%ld) size=%ldx%ld content=%ldx%ld abs=(%ld,%ld)-(%ld,%ld) parent=%ldx%ld virtual_buttonmatrix=%ldx%ld children=%lu\\n",`)
  lines.push(`    (void *)${parentVar}, (long)lv_obj_get_x(${varName}), (long)lv_obj_get_y(${varName}),`)
  lines.push(`    (long)lv_obj_get_width(${varName}), (long)lv_obj_get_height(${varName}),`)
  lines.push(`    (long)lv_obj_get_content_width(${varName}), (long)lv_obj_get_content_height(${varName}),`)
  lines.push(`    (long)${varName}_coords.x1, (long)${varName}_coords.y1, (long)${varName}_coords.x2, (long)${varName}_coords.y2,`)
  lines.push(`    (long)lv_obj_get_width(${parentVar}), (long)lv_obj_get_height(${parentVar}),`)
  lines.push(`    (long)lv_obj_get_width(${varName}), (long)lv_obj_get_height(${varName}),`)
  lines.push(`    (unsigned long)lv_obj_get_child_count(${varName}));`)

  lines.push(``)
  break
}

case 'Calendar': {
  lines.push(`lv_obj_t * ${varName} = lv_calendar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_calendar_set_today_date(${varName}, 2026, 6, 18);`)
  lines.push(`lv_calendar_set_showed_date(${varName}, 2026, 6);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Chart': {
  lines.push(`lv_obj_t * ${varName} = lv_chart_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_chart_set_type(${varName}, LV_CHART_TYPE_LINE);`)
  lines.push(`lv_chart_set_point_count(${varName}, 7);`)

  lines.push(
    `lv_chart_series_t * ${varName}_ser = lv_chart_add_series(${varName}, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);`
  )

  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 10);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 30);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 20);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 50);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 40);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 70);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 60);`)

  lines.push(`lv_chart_refresh(${varName});`)
  lines.push(``)
  break
}


      case 'Box':
        lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_80, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)
        lines.push(``)
        break

        default:
        break
    }
    

        if (child.children?.length) {
            buildLvglBlock(
        child,
        components,
        varName,
        lines,
        counter,
        palette,
        usedAssetSources,
        usedHookNames,
        userEventHooks,
        binaryOutputExports,
        toggleInputExports,
        threeWayInputExports,
      )
    }
  })
}

export const generateForgeUILvglCode = (
  components: IComponents,
  themeId: string = 'graphite',
  heroBackground?: any,
) => {
   const lines: string[] = []
  const usedAssetSources = new Set<string>()
  const usedHookNames = new Set<string>()
  const userEventHooks = new Set<string>()
  const hasInteractiveButtons = Object.values(components).some(
    component => component.type === 'InteractiveButton',
  )
  const hasBinaryOutputs = Object.values(components).some(
    component =>
      component.type === 'InteractiveLight' ||
      component.type === 'InteractiveStatusIndicator',
  )
  const binaryOutputExports = createBinaryOutputExports(
    components,
    usedAssetSources,
  )
  const toggleInputExports = createToggleInputExports(
    components, usedAssetSources, usedHookNames, userEventHooks,
  )
  const threeWayInputExports = createThreeWayInputExports(components, usedAssetSources, usedHookNames, userEventHooks)

  const previewPalette =
  FG_PREVIEW_PALETTES[themeId as ForgeThemeId] ||
  FG_PREVIEW_PALETTES.graphite

const fullscreenTextures = new Set([
  'ai_mesh',
  'ai_nexus',
  'creation',
  'nebula_core',
  'neon_horizon',
  'neural_core',
  'quantum_flow',
  'quantum_hex',
])

const textureId = previewPalette.texture

const palette = {
  ...previewPalette,

  bg: toLvHex(previewPalette.bg),
  surface: toLvHex(previewPalette.surface),
  surface2: toLvHex(previewPalette.surface2),

  border: toLvHex(previewPalette.border),

  text: toLvHex(previewPalette.text),

  accent: toLvHex(previewPalette.accent),

  textureAsset:
    textureId !== 'none'
      ? FG_TEXTURE_ASSETS[textureId]
      : undefined,

  textureMode: fullscreenTextures.has(textureId)
    ? 'fullscreen'
    : 'tile',
}

const heroAsset =
  heroBackground?.exportStatus === 'lvgl_ready' &&
  heroBackground?.lvgl &&
  heroBackground?.cFile
    ? {
        symbol: heroBackground.lvgl,
        source: heroBackground.cFile,
      }
    : undefined

// Export priority:
// 1. Selected AI/uploaded Hero
// 2. Theme texture
// 3. Solid theme colour
const backgroundAsset =
  heroAsset ||
  palette.textureAsset

const backgroundMode =
  heroAsset
    ? 'fullscreen'
    : palette.textureMode

  lines.push(`#include "90_Studio_Export.h"`)
  lines.push(`#include "lvgl.h"`)
  lines.push(`#include "bsp/display.h"`)
  lines.push(`#include "20_RTC.h"`)
  lines.push(`#include "30_WIFI.h"`)
  if (hasInteractiveButtons || toggleInputExports.size > 0 || threeWayInputExports.size > 0) {
    lines.push(`#include "95_UserEvents.h"`)
  }
  lines.push(`#include <stdbool.h>`)
  lines.push(`#include <stdint.h>`)
  lines.push(`#include <stdio.h>`)
  lines.push(``)
  lines.push(`static lv_obj_t * fg_clock_label = NULL;`)
  lines.push(`static lv_obj_t * fg_wifi_label = NULL;`)
  lines.push(`static lv_obj_t * fg_application_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_launcher_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_brightness_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_brightness_label = NULL;`)
  lines.push(`static uint8_t fg_system_brightness_percent = 100;`)
  lines.push(``)

  const declaredLightSymbols = new Set<string>()

  binaryOutputExports.forEach(lightExport => {
    if (
      !lightExport.ready ||
      !lightExport.offSymbol ||
      !lightExport.onSymbol
    ) {
      return
    }

    ;[lightExport.offSymbol, lightExport.onSymbol].forEach(symbol => {
      if (!declaredLightSymbols.has(symbol)) {
        lines.push(`LV_IMAGE_DECLARE(${symbol});`)
        declaredLightSymbols.add(symbol)
      }
    })
  })

  lines.push(`static void FG_Set_Display_Brightness(uint8_t percent)`)
  lines.push(`{`)
  lines.push(`    if (percent < 10) percent = 10;`)
  lines.push(`    if (percent > 100) percent = 100;`)
  lines.push(`    fg_system_brightness_percent = percent;`)
  lines.push(`    (void)bsp_display_brightness_set((int)percent);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_show_page(lv_obj_t * page)`)
  lines.push(`{`)
  lines.push(`    if (!fg_application_page || !fg_system_launcher_page || !fg_system_brightness_page) return;`)
  lines.push(`    lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_clear_flag(page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_move_foreground(page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_open_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_show_page(fg_system_launcher_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_close_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_show_page(fg_application_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_open_brightness_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_show_page(fg_system_brightness_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_brightness_back_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_show_page(fg_system_launcher_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_brightness_changed_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * slider = lv_event_get_target(event);`)
  lines.push(`    if (!slider) return;`)
  lines.push(`    uint8_t percent = (uint8_t)lv_slider_get_value(slider);`)
  lines.push(`    FG_Set_Display_Brightness(percent);`)
  lines.push(`    if (fg_system_brightness_label) {`)
  lines.push(`        lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * button = lv_button_create(parent);`)
  lines.push(`    lv_obj_set_pos(button, x, y);`)
  lines.push(`    lv_obj_set_size(button, width, height);`)
  lines.push(`    lv_obj_set_style_radius(button, 12, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(button, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`    lv_obj_set_style_border_color(button, lv_color_hex(${palette.border}), 0);`)
  lines.push(`    lv_obj_set_style_border_width(button, 2, 0);`)
  lines.push(`    lv_obj_t * label = lv_label_create(button);`)
  lines.push(`    lv_label_set_text(label, text);`)
  lines.push(`    lv_obj_set_style_text_color(label, lv_color_hex(${palette.text}), 0);`)
  lines.push(`    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);`)
  lines.push(`    lv_obj_center(label);`)
  lines.push(`    return button;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_create_disabled_card(lv_obj_t * parent, const char * text, int32_t x, int32_t y)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * card = lv_obj_create(parent);`)
  lines.push(`    lv_obj_set_pos(card, x, y);`)
  lines.push(`    lv_obj_set_size(card, 220, 180);`)
  lines.push(`    lv_obj_clear_flag(card, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`    lv_obj_set_style_radius(card, 12, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(card, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(card, LV_OPA_50, 0);`)
  lines.push(`    lv_obj_set_style_border_color(card, lv_color_hex(${palette.border}), 0);`)
  lines.push(`    lv_obj_set_style_border_width(card, 1, 0);`)
  lines.push(`    lv_obj_t * label = lv_label_create(card);`)
  lines.push(`    lv_label_set_text(label, text);`)
  lines.push(`    lv_obj_set_style_text_color(label, lv_color_hex(${palette.text}), 0);`)
  lines.push(`    lv_obj_set_style_text_opa(label, LV_OPA_60, 0);`)
  lines.push(`    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);`)
  lines.push(`    lv_obj_center(label);`)
  lines.push(`}`)
  lines.push(``)

  const declaredToggleSymbols = new Set<string>()
  toggleInputExports.forEach(toggle => {
    if (!toggle.ready || !toggle.offSymbol || !toggle.onSymbol) return
    ;[toggle.offSymbol, toggle.onSymbol].forEach(symbol => {
      if (!declaredToggleSymbols.has(symbol)) {
        lines.push(`LV_IMAGE_DECLARE(${symbol});`)
        declaredToggleSymbols.add(symbol)
      }
    })
  })
  const declaredThreeWaySymbols = new Set<string>()
  threeWayInputExports.forEach(input => { if (!input.ready) return; [input.leftSymbol,input.centerSymbol,input.rightSymbol].forEach(symbol=>{if(symbol&&!declaredThreeWaySymbols.has(symbol)){lines.push(`LV_IMAGE_DECLARE(${symbol});`);declaredThreeWaySymbols.add(symbol)}}) })
  if (declaredThreeWaySymbols.size) {
    lines.push(`static uint32_t fg_interactive_three_way_axis_scale(int32_t target, uint32_t source)`)
    lines.push(`{`)
    lines.push(`    if (target <= 0 || source == 0) return 256;`)
    lines.push(`    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;`)
    lines.push(`    if (rounded < 1u) return 1;`)
    lines.push(`    if (rounded > 65535u) return 65535;`)
    lines.push(`    return (uint32_t)rounded;`)
    lines.push(`}`)
    lines.push(`static uint32_t fg_interactive_three_way_contain_scale(const lv_image_dsc_t * left, const lv_image_dsc_t * center, const lv_image_dsc_t * right, int32_t width, int32_t height)`)
    lines.push(`{`)
    lines.push(`    if (!left || !center || !right || !left->header.w || !left->header.h || !center->header.w || !center->header.h || !right->header.w || !right->header.h) return 256;`)
    lines.push(`    uint32_t scale = fg_interactive_three_way_axis_scale(width, left->header.w);`)
    lines.push(`    uint32_t candidate = fg_interactive_three_way_axis_scale(height, left->header.h); if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_three_way_axis_scale(width, center->header.w); if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_three_way_axis_scale(height, center->header.h); if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_three_way_axis_scale(width, right->header.w); if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_three_way_axis_scale(height, right->header.h); if (candidate < scale) scale = candidate;`)
    lines.push(`    return scale;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`typedef struct { lv_obj_t * button; lv_obj_t * image; const void * left_src; const void * center_src; const void * right_src; fg_three_way_state_t state; void (*changed_cb)(fg_three_way_state_t state); } fg_three_way_input_t;`)
    lines.push(`static void fg_three_way_input_set(fg_three_way_input_t * input, fg_three_way_state_t state, bool notify)`)
    lines.push(`{`); lines.push(`    if (!input || (state != FG_THREE_WAY_LEFT && state != FG_THREE_WAY_CENTER && state != FG_THREE_WAY_RIGHT)) return;`); lines.push(`    input->state = state;`); lines.push(`    const void * src = state == FG_THREE_WAY_LEFT ? input->left_src : state == FG_THREE_WAY_RIGHT ? input->right_src : input->center_src;`); lines.push(`    if (input->image) lv_image_set_src(input->image, src);`); lines.push(`    if (notify && input->changed_cb) input->changed_cb(state);`); lines.push(`}`)
    lines.push(`static void fg_three_way_input_event_cb(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    fg_three_way_input_t * input = (fg_three_way_input_t *)lv_event_get_user_data(event);`)
    lines.push(`    lv_obj_t * button = lv_event_get_target(event);`)
    lines.push(`    lv_indev_t * indev = lv_indev_active();`)
    lines.push(`    if (!input || !button || !indev) return;`)
    lines.push(``)
    lines.push(`    lv_point_t point;`)
    lines.push(`    lv_area_t button_coords;`)
    lines.push(`    lv_indev_get_point(indev, &point);`)
    lines.push(`    lv_obj_get_coords(button, &button_coords);`)
    lines.push(``)
    lines.push(`    int32_t width = lv_area_get_width(&button_coords);`)
    lines.push(`    int32_t local_x = point.x - button_coords.x1;`)
    lines.push(`    if (width <= 0 || local_x < 0 || local_x >= width) return;`)
    lines.push(``)
    lines.push(`    fg_three_way_state_t state = local_x < width / 3`)
    lines.push(`        ? FG_THREE_WAY_LEFT`)
    lines.push(`        : local_x < (width * 2) / 3`)
    lines.push(`            ? FG_THREE_WAY_CENTER`)
    lines.push(`            : FG_THREE_WAY_RIGHT;`)
    lines.push(`    fg_three_way_input_set(input, state, true);`)
    lines.push(`}`)
    lines.push(``)
  }
  threeWayInputExports.forEach(input=>{if(!input.ready||!input.leftSymbol||!input.centerSymbol||!input.rightSymbol)return;lines.push(`static fg_three_way_input_t ${input.runtimeName} = {`);lines.push(`    .button = NULL, .image = NULL, .left_src = &${input.leftSymbol}, .center_src = &${input.centerSymbol}, .right_src = &${input.rightSymbol},`);lines.push(`    .state = ${input.initialState==='left'?'FG_THREE_WAY_LEFT':input.initialState==='right'?'FG_THREE_WAY_RIGHT':'FG_THREE_WAY_CENTER'}, .changed_cb = ${input.hookName},`);lines.push(`};`);lines.push(``)})
  if (declaredToggleSymbols.size > 0) {
    lines.push(`static uint32_t fg_interactive_toggle_axis_scale(int32_t target, uint32_t source)`)
    lines.push(`{`)
    lines.push(`    if (target <= 0 || source == 0) return 256;`)
    lines.push(`    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;`)
    lines.push(`    if (rounded < 1u) return 1;`)
    lines.push(`    if (rounded > 65535u) return 65535;`)
    lines.push(`    return (uint32_t)rounded;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static uint32_t fg_interactive_toggle_contain_scale(`)
    lines.push(`    const lv_image_dsc_t * off,`)
    lines.push(`    const lv_image_dsc_t * on,`)
    lines.push(`    int32_t width,`)
    lines.push(`    int32_t height`)
    lines.push(`)`)
    lines.push(`{`)
    lines.push(`    if (!off || !on ||`)
    lines.push(`        off->header.w == 0 || off->header.h == 0 ||`)
    lines.push(`        on->header.w == 0 || on->header.h == 0) return 256;`)
    lines.push(`    uint32_t scale = fg_interactive_toggle_axis_scale(width, off->header.w);`)
    lines.push(`    uint32_t candidate = fg_interactive_toggle_axis_scale(height, off->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_toggle_axis_scale(width, on->header.w);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_toggle_axis_scale(height, on->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    return scale;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`typedef struct { lv_obj_t * button; lv_obj_t * image; const void * off_src; const void * on_src; bool enabled; void (*toggled_cb)(bool); } fg_toggle_input_t;`)
    lines.push(`static void fg_toggle_input_set(fg_toggle_input_t * toggle, bool enabled, bool notify)`)
    lines.push(`{`)
    lines.push(`    if (!toggle) return;`)
    lines.push(`    toggle->enabled = enabled;`)
    lines.push(`    if (toggle->image) lv_image_set_src(toggle->image, enabled ? toggle->on_src : toggle->off_src);`)
    lines.push(`    if (notify && toggle->toggled_cb) toggle->toggled_cb(enabled);`)
    lines.push(`}`)
    lines.push(`static void fg_toggle_input_event_cb(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    fg_toggle_input_t * toggle = (fg_toggle_input_t *)lv_event_get_user_data(event);`)
    lines.push(`    if (toggle) fg_toggle_input_set(toggle, !toggle->enabled, true);`)
    lines.push(`}`)
    lines.push(``)
  }
  toggleInputExports.forEach(toggle => {
    if (!toggle.ready || !toggle.offSymbol || !toggle.onSymbol) return
    lines.push(`static fg_toggle_input_t ${toggle.runtimeName} = {`)
    lines.push(`    .button = NULL, .image = NULL,`)
    lines.push(`    .off_src = &${toggle.offSymbol}, .on_src = &${toggle.onSymbol},`)
    lines.push(`    .enabled = ${toggle.initialState === 'on' ? 'true' : 'false'}, .toggled_cb = ${toggle.hookName},`)
    lines.push(`};`)
    lines.push(``)
  })

  if (declaredLightSymbols.size > 0) {
    lines.push(``)
    lines.push(`typedef struct`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * image;`)
    lines.push(`    const void * off_src;`)
    lines.push(`    const void * on_src;`)
    lines.push(`    bool enabled;`)
    lines.push(`} fg_binary_output_t;`)
    lines.push(``)
    lines.push(`static void fg_binary_output_set(`)
    lines.push(`    fg_binary_output_t * output,`)
    lines.push(`    bool enabled`)
    lines.push(`)`)
    lines.push(`{`)
    lines.push(`    if (!output || !output->image)`)
    lines.push(`    {`)
    lines.push(`        return;`)
    lines.push(`    }`)
    lines.push(``)
    lines.push(`    output->enabled = enabled;`)
    lines.push(`    lv_image_set_src(`)
    lines.push(`        output->image,`)
    lines.push(`        enabled ? output->on_src : output->off_src`)
    lines.push(`    );`)
    lines.push(`}`)
    lines.push(``)
  }
  if (hasBinaryOutputs) {
    lines.push(`static uint32_t fg_interactive_light_axis_scale(int32_t target, uint32_t source)`)
    lines.push(`{`)
    lines.push(`    if (target <= 0 || source == 0) return 256;`)
    lines.push(`    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;`)
    lines.push(`    if (rounded < 1u) return 1;`)
    lines.push(`    if (rounded > 65535u) return 65535;`)
    lines.push(`    return (uint32_t)rounded;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static uint32_t fg_interactive_light_contain_scale(`)
    lines.push(`    const lv_image_dsc_t * off,`)
    lines.push(`    const lv_image_dsc_t * on,`)
    lines.push(`    int32_t width,`)
    lines.push(`    int32_t height`)
    lines.push(`)`)
    lines.push(`{`)
    lines.push(`    if (!off || !on ||`)
    lines.push(`        off->header.w == 0 || off->header.h == 0 ||`)
    lines.push(`        on->header.w == 0 || on->header.h == 0) return 256;`)
    lines.push(`    uint32_t scale = fg_interactive_light_axis_scale(width, off->header.w);`)
    lines.push(`    uint32_t candidate = fg_interactive_light_axis_scale(height, off->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_light_axis_scale(width, on->header.w);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_light_axis_scale(height, on->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    return scale;`)
    lines.push(`}`)
    lines.push(``)
  }

  binaryOutputExports.forEach(lightExport => {
    if (
      !lightExport.ready ||
      !lightExport.offSymbol ||
      !lightExport.onSymbol
    ) {
      return
    }

    lines.push(`static fg_binary_output_t ${lightExport.runtimeName} = {`)
    lines.push(`    .image = NULL,`)
    lines.push(`    .off_src = &${lightExport.offSymbol},`)
    lines.push(`    .on_src = &${lightExport.onSymbol},`)
    lines.push(`    .enabled = ${lightExport.initialState === 'on' ? 'true' : 'false'},`)
    lines.push(`};`)
    lines.push(``)
  })

  binaryOutputExports.forEach(lightExport => {
    if (
      !lightExport.ready ||
      !lightExport.offSymbol ||
      !lightExport.onSymbol
    ) {
      return
    }

    lines.push(`void ${lightExport.apiName}(bool enabled)`)
    lines.push(`{`)
    lines.push(`    fg_binary_output_set(&${lightExport.runtimeName}, enabled);`)
    lines.push(`}`)
    lines.push(``)
  })
  if (hasInteractiveButtons) {
    lines.push(`static uint32_t fg_interactive_button_axis_scale(int32_t target, uint32_t source)`)
    lines.push(`{`)
    lines.push(`    if (target <= 0 || source == 0) return 256;`)
    lines.push(`    uint64_t rounded = ((uint64_t)target * 256u + source / 2u) / source;`)
    lines.push(`    if (rounded < 1u) return 1;`)
    lines.push(`    if (rounded > 65535u) return 65535;`)
    lines.push(`    return (uint32_t)rounded;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static uint32_t fg_interactive_button_contain_scale(`)
    lines.push(`    const lv_image_dsc_t * normal,`)
    lines.push(`    const lv_image_dsc_t * pressed,`)
    lines.push(`    int32_t width,`)
    lines.push(`    int32_t height`)
    lines.push(`)`)
    lines.push(`{`)
    lines.push(`    if (!normal || !pressed ||`)
    lines.push(`        normal->header.w == 0 || normal->header.h == 0 ||`)
    lines.push(`        pressed->header.w == 0 || pressed->header.h == 0) return 256;`)
    lines.push(`    uint32_t scale = fg_interactive_button_axis_scale(width, normal->header.w);`)
    lines.push(`    uint32_t candidate = fg_interactive_button_axis_scale(height, normal->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_button_axis_scale(width, pressed->header.w);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    candidate = fg_interactive_button_axis_scale(height, pressed->header.h);`)
    lines.push(`    if (candidate < scale) scale = candidate;`)
    lines.push(`    return scale;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`typedef struct`)
  lines.push(`{`)
  lines.push(`    const void * normal_src;`)
  lines.push(`    const void * pressed_src;`)
  lines.push(`    void (*clicked_cb)(void);`)
  lines.push(`    const char * event_name;`)
  lines.push(`} fg_interactive_button_data_t;`)
  lines.push(``)

  lines.push(`static void fg_interactive_button_event_cb(lv_event_t *event)`)
  lines.push(`{`)
  lines.push(`    lv_event_code_t code = lv_event_get_code(event);`)
  lines.push(`    lv_obj_t * button = lv_event_get_target(event);`)
  lines.push(``)
  lines.push(`    fg_interactive_button_data_t * data =`)
  lines.push(`        (fg_interactive_button_data_t *)lv_event_get_user_data(event);`)
  lines.push(``)
  lines.push(`    if (!button || !data)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    lv_obj_t * image = lv_obj_get_child(button, 0);`)
  lines.push(``)
  lines.push(`    if (!image)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    if (code == LV_EVENT_PRESSED)`)
  lines.push(`    {`)
  lines.push(`        lv_image_set_src(image, data->pressed_src);`)
  lines.push(`    }`)
 lines.push(`    else if (`)
lines.push(`        code == LV_EVENT_RELEASED ||`)
lines.push(`        code == LV_EVENT_PRESS_LOST`)
lines.push(`    )`)
lines.push(`    {`)
lines.push(`        lv_image_set_src(image, data->normal_src);`)
lines.push(`    }`)
lines.push(`    else if (code == LV_EVENT_CLICKED)`)
lines.push(`    {`)
lines.push(`        printf("[ForgeUI] %s clicked\\n", data->event_name);`)
lines.push(``)
lines.push(`        if (data->clicked_cb)`)
lines.push(`        {`)
lines.push(`            data->clicked_cb();`)
lines.push(`        }`)
lines.push(`    }`)
lines.push(`}`)
  lines.push(``)
  }

  lines.push(`static void fg_clock_tick_cb(lv_timer_t *timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer);`)
  lines.push(``)
  lines.push(`    static bool show_colon = true;`)
  lines.push(``)
  lines.push(`    char time_buf[16];`)
  lines.push(`    fg_rtc_format_time(time_buf, sizeof(time_buf));`)
  lines.push(``)
  lines.push(`    if (!show_colon)`)
  lines.push(`    {`)
  lines.push(`        time_buf[2] = ' ';`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    show_colon = !show_colon;`)
  lines.push(``)
  lines.push(`    if (fg_clock_label)`)
  lines.push(`    {`)
  lines.push(`        lv_label_set_text(fg_clock_label, time_buf);`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(``)

  lines.push(`static void fg_wifi_tick_cb(lv_timer_t *timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer);`)
  lines.push(``)
  lines.push(`    if (!fg_wifi_label)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    fg_wifi_pump();`)
  lines.push(``)
  lines.push(`    char wifi_buf[128];`)
  lines.push(`    snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\\n%s\\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());`)
  lines.push(`    lv_label_set_text(fg_wifi_label, wifi_buf);`)
  lines.push(`}`)
  lines.push(``)

  lines.push(`// ForgeUI LVGL Export Proof V1`)
  lines.push(`// Generated from ForgeUI Studio`)
  lines.push(``)
  lines.push(`void fg_studio_export_create(lv_obj_t *parent)`)
  lines.push(`{`)
  lines.push(`    // Background flavour: ${palette.name}`)
  lines.push(`    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(parent, lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);`)
  lines.push(``)
  lines.push(`    fg_application_page = lv_obj_create(parent);`)
  lines.push(`    lv_obj_set_pos(fg_application_page, 0, 0);`)
  lines.push(`    lv_obj_set_size(fg_application_page, 1024, 600);`)
  lines.push(`    lv_obj_clear_flag(fg_application_page, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`    lv_obj_set_style_pad_all(fg_application_page, 0, 0);`)
  lines.push(`    lv_obj_set_style_border_width(fg_application_page, 0, 0);`)
  lines.push(`    lv_obj_set_style_radius(fg_application_page, 0, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(fg_application_page, lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(fg_application_page, LV_OPA_COVER, 0);`)
  lines.push(``)

  if (
  backgroundAsset?.source &&
  backgroundAsset?.symbol
) {
  usedAssetSources.add(backgroundAsset.source)

  lines.push(`    LV_IMAGE_DECLARE(${backgroundAsset.symbol});`)

  if (backgroundMode === 'fullscreen') {
    lines.push(`    lv_obj_t * bg_texture_0 = lv_image_create(fg_application_page);`)
    lines.push(`    lv_image_set_src(bg_texture_0, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_0, 0, 0);`)
    lines.push(`    lv_obj_set_size(bg_texture_0, 1024, 600);`)
    lines.push(`    lv_obj_move_background(bg_texture_0);`)
  } else {
    lines.push(`    lv_obj_t * bg_texture_0 = lv_image_create(fg_application_page);`)
    lines.push(`    lv_image_set_src(bg_texture_0, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_0, 0, 0);`)

    lines.push(`    lv_obj_t * bg_texture_1 = lv_image_create(fg_application_page);`)
    lines.push(`    lv_image_set_src(bg_texture_1, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_1, 512, 0);`)

    lines.push(`    lv_obj_t * bg_texture_2 = lv_image_create(fg_application_page);`)
    lines.push(`    lv_image_set_src(bg_texture_2, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_2, 0, 512);`)

    lines.push(`    lv_obj_t * bg_texture_3 = lv_image_create(fg_application_page);`)
    lines.push(`    lv_image_set_src(bg_texture_3, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_3, 512, 512);`)

    lines.push(`    lv_obj_move_background(bg_texture_0);`)
    lines.push(`    lv_obj_move_background(bg_texture_1);`)
    lines.push(`    lv_obj_move_background(bg_texture_2);`)
    lines.push(`    lv_obj_move_background(bg_texture_3);`)
  }

  lines.push(``)
}

  const body: string[] = []

  const root =
    components.root ||
    Object.values(components).find((c: any) => c.parent === c.id) ||
    Object.values(components)[0]

  if (root) {
        buildLvglBlock(
      root,
      components,
      'fg_application_page',
      body,
      { value: 0 },
      palette,
      usedAssetSources,
      usedHookNames,
        userEventHooks,
        binaryOutputExports,
        toggleInputExports,
        threeWayInputExports,
      )
  }

body.forEach(line => {
  lines.push(line ? `    ${line}` : ``)
})

lines.push(``)
lines.push(`    lv_obj_t * system_gear = fg_system_create_button(fg_application_page, LV_SYMBOL_SETTINGS, 922, 18, 84, 84);`)
lines.push(`    lv_obj_t * system_gear_label = lv_obj_get_child(system_gear, 0);`)
lines.push(`    lv_obj_set_style_text_font(system_gear_label, &lv_font_montserrat_48, 0);`)
lines.push(`    lv_obj_add_event_cb(system_gear, fg_system_open_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_move_foreground(system_gear);`)
lines.push(``)
lines.push(`    fg_system_launcher_page = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_pos(fg_system_launcher_page, 0, 0);`)
lines.push(`    lv_obj_set_size(fg_system_launcher_page, 1024, 600);`)
lines.push(`    lv_obj_clear_flag(fg_system_launcher_page, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_launcher_page, 0, 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_launcher_page, 0, 0);`)
lines.push(`    lv_obj_set_style_radius(fg_system_launcher_page, 0, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_launcher_page, lv_color_hex(${palette.bg}), 0);`)
lines.push(`    lv_obj_set_style_bg_opa(fg_system_launcher_page, LV_OPA_COVER, 0);`)
lines.push(``)
lines.push(`    lv_obj_t * system_back = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);`)
lines.push(`    lv_obj_add_event_cb(system_back, fg_system_close_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * system_title = lv_label_create(fg_system_launcher_page);`)
lines.push(`    lv_label_set_text(system_title, "System");`)
lines.push(`    lv_obj_set_style_text_color(system_title, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_font(system_title, &lv_font_montserrat_32, 0);`)
lines.push(`    lv_obj_align(system_title, LV_ALIGN_TOP_MID, 0, 25);`)
lines.push(``)
lines.push(`    lv_obj_t * display_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_EYE_OPEN "\\nDisplay", 42, 102, 220, 180);`)
lines.push(`    lv_obj_add_event_cb(display_card, fg_system_open_brightness_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_WIFI "\\nWi-Fi\\nComing Later", 282, 102);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_BLUETOOTH "\\nBluetooth\\nComing Later", 522, 102);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_VOLUME_MAX "\\nSound\\nComing Later", 762, 102);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_SD_CARD "\\nStorage\\nComing Later", 42, 302);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_HOME "\\nDevice\\nComing Later", 282, 302);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_WARNING "\\nDiagnostics\\nComing Later", 522, 302);`)
lines.push(`    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`    fg_system_brightness_page = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_pos(fg_system_brightness_page, 0, 0);`)
lines.push(`    lv_obj_set_size(fg_system_brightness_page, 1024, 600);`)
lines.push(`    lv_obj_clear_flag(fg_system_brightness_page, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_brightness_page, 0, 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_brightness_page, 0, 0);`)
lines.push(`    lv_obj_set_style_radius(fg_system_brightness_page, 0, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_brightness_page, lv_color_hex(${palette.bg}), 0);`)
lines.push(`    lv_obj_set_style_bg_opa(fg_system_brightness_page, LV_OPA_COVER, 0);`)
lines.push(``)
lines.push(`    lv_obj_t * brightness_back = fg_system_create_button(fg_system_brightness_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);`)
lines.push(`    lv_obj_add_event_cb(brightness_back, fg_system_brightness_back_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * brightness_title = lv_label_create(fg_system_brightness_page);`)
lines.push(`    lv_label_set_text(brightness_title, "Brightness");`)
lines.push(`    lv_obj_set_style_text_color(brightness_title, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_font(brightness_title, &lv_font_montserrat_32, 0);`)
lines.push(`    lv_obj_align(brightness_title, LV_ALIGN_TOP_MID, 0, 25);`)
lines.push(`    lv_obj_t * brightness_icon = lv_label_create(fg_system_brightness_page);`)
lines.push(`    lv_label_set_text(brightness_icon, LV_SYMBOL_EYE_OPEN);`)
lines.push(`    lv_obj_set_style_text_color(brightness_icon, lv_color_hex(${palette.accent}), 0);`)
lines.push(`    lv_obj_set_style_text_font(brightness_icon, &lv_font_montserrat_48, 0);`)
lines.push(`    lv_obj_align(brightness_icon, LV_ALIGN_TOP_MID, 0, 130);`)
lines.push(`    fg_system_brightness_label = lv_label_create(fg_system_brightness_page);`)
lines.push(`    lv_label_set_text_fmt(fg_system_brightness_label, "%u%%", (unsigned)fg_system_brightness_percent);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_brightness_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_brightness_label, &lv_font_montserrat_48, 0);`)
lines.push(`    lv_obj_align(fg_system_brightness_label, LV_ALIGN_TOP_MID, 0, 210);`)
lines.push(`    lv_obj_t * brightness_slider = lv_slider_create(fg_system_brightness_page);`)
lines.push(`    lv_obj_set_size(brightness_slider, 720, 32);`)
lines.push(`    lv_obj_align(brightness_slider, LV_ALIGN_TOP_MID, 0, 340);`)
lines.push(`    lv_slider_set_range(brightness_slider, 10, 100);`)
lines.push(`    lv_slider_set_value(brightness_slider, fg_system_brightness_percent, LV_ANIM_OFF);`)
lines.push(`    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)
lines.push(`    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
lines.push(`    lv_obj_set_style_bg_color(brightness_slider, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
lines.push(`    lv_obj_set_style_pad_all(brightness_slider, 12, LV_PART_KNOB);`)
lines.push(`    lv_obj_add_event_cb(brightness_slider, fg_system_brightness_changed_cb, LV_EVENT_VALUE_CHANGED, NULL);`)
lines.push(`    lv_obj_t * brightness_min = lv_label_create(fg_system_brightness_page);`)
lines.push(`    lv_label_set_text(brightness_min, "10%");`)
lines.push(`    lv_obj_set_style_text_color(brightness_min, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_pos(brightness_min, 140, 390);`)
lines.push(`    lv_obj_t * brightness_max = lv_label_create(fg_system_brightness_page);`)
lines.push(`    lv_label_set_text(brightness_max, "100%");`)
lines.push(`    lv_obj_set_style_text_color(brightness_max, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_pos(brightness_max, 828, 390);`)
lines.push(`    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`    fg_clock_tick_cb(NULL);`)
lines.push(`    lv_timer_create(fg_clock_tick_cb, 1000, NULL);`)
lines.push(``)
lines.push(`    fg_wifi_tick_cb(NULL);`)
lines.push(`    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);`)

lines.push(`}`)

  const declaredImages = new Set<string>()
  const code = lines.filter(line => {
    const declaration = line.match(
      /LV_IMAGE_DECLARE\(([A-Za-z_][A-Za-z0-9_]*)\)/,
    )
    if (!declaration) return true
    if (declaredImages.has(declaration[1])) return false
    declaredImages.add(declaration[1])
    return true
  }).join('\n')

    return {
    code,
    assetSources: Array.from(usedAssetSources),
    userEventHooks: Array.from(userEventHooks),
    publicApiDeclarations: Array.from(binaryOutputExports.values())
      .filter(lightExport => lightExport.ready)
      .map(lightExport =>
        `void ${lightExport.apiName}(bool enabled);`,
      ),
  }
}
