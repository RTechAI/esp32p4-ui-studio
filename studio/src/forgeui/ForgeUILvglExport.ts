import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from './ForgeUIUploadedAssetRegistry'
import { FORGEUI_IMAGE_ASSETS } from './ForgeUIAssetRegistry'
import { allocateUniqueOutputApiName } from './ForgeUIGeneratedApiNames'
import { getForgeUIStandardButtonText } from './ForgeUIStandardButton'
import { getForgeUIStandardTextValue } from './ForgeUIStandardText'
import { getForgeUIStandardHeadingText } from './ForgeUIStandardHeading'
import { getForgeUIStandardLineGeometry } from './ForgeUIStandardLine'
import {
  FORGEUI_STANDARD_CHART_DEFAULT_DATA,
  FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT,
  getForgeUIStandardChartLayout,
} from './ForgeUIStandardChart'
import {
  FORGEUI_TAB_TILE_BORDER_WIDTH,
  getForgeUITabViewGeometry,
  getForgeUITileViewGeometry,
} from './ForgeUIStandardTabTileGeometry'
import {
  getForgeUIStandardClockPresentation,
  type ForgeUIClockHourFormat,
} from './ForgeUIStandardClock'

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
  type ForgePreviewPalette,
  type ForgeThemeId,
  resolveForgeSemanticPalette,
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
  String(v)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')

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

type LedExport = {
  apiName: string
  hookName: string
  objectName: string
  stateName: string
  initialState: boolean
}

type BarRuntimeExport = {
  apiName: string
  objectName: string
  stateName: string
  minimumName: string
  maximumName: string
  minimum: number
  maximum: number
  initialValue: number
}

type BarExport = BarRuntimeExport & {
  hookName: string
}

type ProgressExport = BarRuntimeExport

type NumberInputExport = {
  apiName: string
  hookName: string
  objectName: string
  stateName: string
  programmaticUpdateName: string
  minimumName: string
  maximumName: string
  stepName: string
  eventCallbackName: string
  minimum: number
  maximum: number
  step: number
  initialValue: number
  initialText: string
}

type SelectExport = {
  apiName: string
  hookName: string
  objectName: string
  selectedIndexName: string
  programmaticUpdateName: string
  optionCountName: string
  eventCallbackName: string
  options: string[]
  initialIndex: number
  textBufferSize: number
}

type ImageExport = {
  apiName: string
  objectName: string
  sourceName: string
  asset?: any
}

type BoxExport = {
  apiName: string
  objectName: string
  visibleName: string
}

type IconButtonExport = {
  apiName: string
  hookName: string
  objectName: string
  enabledName: string
  eventCallbackName: string
  initialEnabled: boolean
}

const resolveStandardImageAsset = (component: IComponent) => {
  const src = component.props.src || component.props.browserSrc || ''
  const presetAsset = FORGEUI_IMAGE_ASSETS.find(
    (asset: any) => asset.src === src,
  )
  const uploadedAsset = forgeUIGetUploadedAssets().find((asset: any) =>
    asset.id === component.props.uploadedAssetId ||
    asset.browserSrc === src ||
    asset.browserSrc === component.props.src ||
    asset.name === component.props.assetName ||
    asset.name === component.props.alt,
  )

  return presetAsset || uploadedAsset
}

type ArcExport = {
  apiName: string
  hookName: string
  objectName: string
  stateName: string
  minimumName: string
  maximumName: string
  minimum: number
  maximum: number
  initialValue: number
  rotation?: number
  backgroundStartAngle?: number
  backgroundEndAngle?: number
  mode?: 'LV_ARC_MODE_NORMAL' | 'LV_ARC_MODE_REVERSE' | 'LV_ARC_MODE_SYMMETRICAL'
}

type ChartExport = {
  addApiName: string
  clearApiName: string
  pointAddedHookName: string
  clearedHookName: string
  objectName: string
  seriesName: string
  minimumName: string
  maximumName: string
  minimum: number
  maximum: number
  pointCount: number
  initialData: number[]
  seriesColor: string
  horizontalDivisions?: number
  verticalDivisions?: number
  updateMode?: 'LV_CHART_UPDATE_MODE_SHIFT' | 'LV_CHART_UPDATE_MODE_CIRCULAR'
}

type KeyboardExport = {
  showApiName: string
  hideApiName: string
  shownHookName: string
  hiddenHookName: string
  objectName: string
}

type CalendarExport = {
  apiName: string
  hookName: string
  objectName: string
  selectedDateName: string
  eventCallbackName: string
}

type RollerExport = {
  apiName: string
  hookName: string
  objectName: string
  selectedIndexName: string
  optionCountName: string
  transitionName: string
  eventCallbackName: string
  options: string[]
  initialIndex: number
  visibleRowCount: number
  mode: 'LV_ROLLER_MODE_NORMAL' | 'LV_ROLLER_MODE_INFINITE'
  textBufferSize: number
}

type MessageBoxExport = {
  showApiName: string
  closeApiName: string
  shownHookName: string
  closedHookName: string
  buttonHookName: string
  objectName: string
  visibleName: string
  title: string
  bodyText: string
  buttons: string[]
  buttonDataNames: string[]
}

type ButtonMatrixExport = {
  apiName: string
  hookName: string
  objectName: string
  selectedIndexName: string
  buttonCountName: string
  transitionName: string
  eventCallbackName: string
  mapTokens: string[]
  buttonLabels: string[]
  initialIndex: number
  oneCheck: boolean
  disabledButtons: number[]
}

type TabViewExport = {
  apiName: string
  hookName: string
  objectName: string
  selectedIndexName: string
  tabCountName: string
  transitionName: string
  eventCallbackName: string
  initialIndex: number
  tabCount: number
}

type TileViewExport = {
  apiName: string
  hookName: string
  objectName: string
  tilesName: string
  selectedColumnName: string
  selectedRowName: string
  columnCountName: string
  rowCountName: string
  transitionName: string
  eventCallbackName: string
  initialColumn: number
  initialRow: number
  columnCount: number
  rowCount: number
}

type ClockExport = {
  labelName: string
  timerName: string
  separatorVisibleName: string
  tickCallbackName: string
  hourFormat: ForgeUIClockHourFormat
  showSeconds: boolean
  blinkSeparator: boolean
}

type InputExport = {
  apiName: string
  hookName: string
  objectName: string
  programmaticUpdateName: string
  eventCallbackName: string
}

type SwitchExport = {
  apiName: string
  hookName: string
  objectName: string
  programmaticUpdateName: string
  eventCallbackName: string
  initialChecked: boolean
}

type RadioExport = {
  apiName: string
  hookName: string
  objectName: string
  programmaticUpdateName: string
  eventCallbackName: string
  initialSelected: boolean
}

const createRadioExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, RadioExport> => {
  const exportsByComponent = new Map<string, RadioExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Radio')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Radio',
        'Radio',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Selected`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_radio`,
        programmaticUpdateName:
          `fg_${runtimeStem}_radio_programmatic_update`,
        eventCallbackName:
          `fg_${runtimeStem}_radio_value_changed_cb`,
        initialSelected: Boolean(component.props.isChecked),
      })
    })

  return exportsByComponent
}

const createCheckedControlExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
  componentType: 'Switch' | 'Checkbox',
  fallbackName: string,
  runtimeKind: 'switch' | 'checkbox',
): Map<string, SwitchExport> => {
  const exportsByComponent = new Map<string, SwitchExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === componentType)
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        fallbackName,
        fallbackName,
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Checked`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Checked`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_${runtimeKind}`,
        programmaticUpdateName:
          `fg_${runtimeStem}_${runtimeKind}_programmatic_update`,
        eventCallbackName:
          `fg_${runtimeStem}_${runtimeKind}_value_changed_cb`,
        initialChecked: Boolean(component.props.isChecked),
      })
    })

  return exportsByComponent
}

const createInputExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, InputExport> => {
  const exportsByComponent = new Map<string, InputExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component =>
      component.type === 'Input' || component.type === 'Textarea',
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const isTextarea = component.type === 'Textarea'
      const fallbackName = isTextarea ? 'Textarea' : 'Input'
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        fallbackName,
        fallbackName,
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Text`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Text`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const runtimeStem = allocatedBase.toLowerCase()
      const runtimeKind = isTextarea ? 'textarea' : 'input'
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_${runtimeKind}`,
        programmaticUpdateName:
          `fg_${runtimeStem}_${runtimeKind}_programmatic_update`,
        eventCallbackName:
          `fg_${runtimeStem}_${runtimeKind}_value_changed_cb`,
      })
    })

  return exportsByComponent
}

const integerProp = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? Math.trunc(numeric) : fallback
}

const createClockExports = (
  components: IComponents,
): Map<string, ClockExport> => {
  const exportsByComponent = new Map<string, ClockExport>()
  const usedStems = new Set<string>()

  Object.values(components)
    .filter(component => component.type === 'Clock')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseStem = toCIdentifier(
        component.componentName || component.props.name || 'Clock',
        'Clock',
      )
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .toLowerCase()
      let stem = baseStem
      let suffix = 2
      while (usedStems.has(stem)) {
        stem = `${baseStem}_${suffix++}`
      }
      usedStems.add(stem)

      const presentation =
        getForgeUIStandardClockPresentation(component.props)
      exportsByComponent.set(component.id, {
        labelName: `fg_${stem}_label`,
        timerName: `fg_${stem}_timer`,
        separatorVisibleName: `fg_${stem}_separator_visible`,
        tickCallbackName: `fg_${stem}_tick_cb`,
        ...presentation,
      })
    })

  return exportsByComponent
}

const createTabViewExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, TabViewExport> => {
  const exportsByComponent = new Map<string, TabViewExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Tabview')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Tab_View',
        'Tab_View',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Selected`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const tabCount = 3
      const initialIndex = Math.min(
        tabCount - 1,
        Math.max(0, integerProp(component.props.selectedIndex, 0)),
      )
      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_tabview`,
        selectedIndexName: `fg_${runtimeStem}_tabview_selected_index`,
        tabCountName: `fg_${runtimeStem}_tabview_tab_count`,
        transitionName: `fg_${runtimeStem}_tabview_apply_selection`,
        eventCallbackName: `fg_${runtimeStem}_tabview_value_changed_cb`,
        initialIndex,
        tabCount,
      })
    })

  return exportsByComponent
}

const createTileViewExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, TileViewExport> => {
  const exportsByComponent = new Map<string, TileViewExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Tileview')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Tileview',
        'Tileview',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Selected`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const columnCount = 2
      const rowCount = 2
      const initialColumn = Math.min(
        columnCount - 1,
        Math.max(
          0,
          integerProp(
            component.props.selectedColumn ?? component.props.initialColumn,
            0,
          ),
        ),
      )
      const initialRow = Math.min(
        rowCount - 1,
        Math.max(
          0,
          integerProp(
            component.props.selectedRow ?? component.props.initialRow,
            0,
          ),
        ),
      )
      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_tileview`,
        tilesName: `fg_${runtimeStem}_tileview_tiles`,
        selectedColumnName: `fg_${runtimeStem}_tileview_selected_column`,
        selectedRowName: `fg_${runtimeStem}_tileview_selected_row`,
        columnCountName: `fg_${runtimeStem}_tileview_column_count`,
        rowCountName: `fg_${runtimeStem}_tileview_row_count`,
        transitionName: `fg_${runtimeStem}_tileview_apply_selection`,
        eventCallbackName: `fg_${runtimeStem}_tileview_value_changed_cb`,
        initialColumn,
        initialRow,
        columnCount,
        rowCount,
      })
    })

  return exportsByComponent
}

const createCalendarExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, CalendarExport> => {
  const exportsByComponent = new Map<string, CalendarExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Calendar')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Calendar',
        'Calendar',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Date`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Date`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Date_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Date_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_calendar`,
        selectedDateName: `fg_${runtimeStem}_calendar_selected_date`,
        eventCallbackName: `fg_${runtimeStem}_calendar_value_changed_cb`,
      })
    })

  return exportsByComponent
}

const createRollerExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, RollerExport> => {
  const exportsByComponent = new Map<string, RollerExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Roller')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Option_Roller',
        'Option_Roller',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Selected`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const configuredOptions: unknown[] = Array.isArray(component.props.options)
        ? component.props.options
        : typeof component.props.options === 'string'
          ? component.props.options.split('\n')
          : ['One', 'Two', 'Three', 'Four']
      const options: string[] = configuredOptions
        .map(option => String(option))
        .filter(option => option.length > 0)
      if (options.length === 0) options.push('One', 'Two', 'Three', 'Four')
      const initialIndex = Math.min(
        options.length - 1,
        Math.max(0, integerProp(component.props.selectedIndex, 0)),
      )
      const visibleRowCount = Math.max(
        1,
        integerProp(component.props.visibleRowCount, 3),
      )
      const configuredMode = String(component.props.mode || '').toLowerCase()
      const mode = configuredMode === 'infinite' ||
        configuredMode === 'lv_roller_mode_infinite'
        ? 'LV_ROLLER_MODE_INFINITE'
        : 'LV_ROLLER_MODE_NORMAL'
      const runtimeStem = allocatedBase.toLowerCase()
      const longestOption = options.reduce(
        (longest, option) => Math.max(
          longest,
          Array.from(option).reduce((length, character) => {
            const codePoint = character.codePointAt(0) || 0
            return length + (
              codePoint <= 0x7f ? 1 :
              codePoint <= 0x7ff ? 2 :
              codePoint <= 0xffff ? 3 : 4
            )
          }, 0),
        ),
        0,
      )

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_roller`,
        selectedIndexName: `fg_${runtimeStem}_roller_selected_index`,
        optionCountName: `fg_${runtimeStem}_roller_option_count`,
        transitionName: `fg_${runtimeStem}_roller_apply_selection`,
        eventCallbackName: `fg_${runtimeStem}_roller_value_changed_cb`,
        options,
        initialIndex,
        visibleRowCount,
        mode,
        textBufferSize: Math.max(1, longestOption + 1),
      })
    })

  return exportsByComponent
}

const createMessageBoxExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, MessageBoxExport> => {
  const exportsByComponent = new Map<string, MessageBoxExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Msgbox')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Message',
        'Message',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (
        usedApiNames.has(`FG_Show_${allocatedBase}`) ||
        usedApiNames.has(`FG_Close_${allocatedBase}`)
      ) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const showApiName = `FG_Show_${allocatedBase}`
      const closeApiName = `FG_Close_${allocatedBase}`
      usedApiNames.add(showApiName)
      usedApiNames.add(closeApiName)

      const allocateHook = (ending: string) => {
        let hookName = `FG_On_${allocatedBase}_${ending}`
        let hookSuffix = 2
        while (usedHookNames.has(hookName)) {
          hookName = `FG_On_${allocatedBase}_${hookSuffix++}_${ending}`
        }
        usedHookNames.add(hookName)
        userEventHooks.add(hookName)
        return hookName
      }
      const shownHookName = allocateHook('Shown')
      const closedHookName = allocateHook('Closed')
      const buttonHookName = allocateHook('Button_Pressed')

      const configuredButtons: unknown[] = Array.isArray(component.props.buttons)
        ? component.props.buttons
        : ['OK', 'Cancel']
      const buttons: string[] = configuredButtons
        .map(button => String(button))
        .filter(button => button.length > 0)
      if (buttons.length === 0) buttons.push('OK', 'Cancel')
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        showApiName,
        closeApiName,
        shownHookName,
        closedHookName,
        buttonHookName,
        objectName: `fg_${runtimeStem}_message_box`,
        visibleName: `fg_${runtimeStem}_message_box_visible`,
        title: String(component.props.title || 'Message'),
        bodyText: String(
          component.props.bodyText ??
          component.props.text ??
          'Example message text',
        ),
        buttons,
        buttonDataNames: buttons.map(
          (_, index) => `fg_${runtimeStem}_message_button_${index}_data`,
        ),
      })
    })

  return exportsByComponent
}

const createButtonMatrixExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, ButtonMatrixExport> => {
  const exportsByComponent = new Map<string, ButtonMatrixExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'ButtonMatrix')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Menu_Matrix',
        'Menu_Matrix',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Selected`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Button_Selected`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Button_Selected`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const configuredMap = component.props.map ??
        component.props.buttonMap ??
        component.props.buttons
      let mapTokens: string[]
      if (
        Array.isArray(configuredMap) &&
        configuredMap.some(value => Array.isArray(value))
      ) {
        mapTokens = []
        configuredMap.forEach((row, rowIndex) => {
          if (!Array.isArray(row)) return
          row.forEach(value => mapTokens.push(String(value)))
          if (rowIndex < configuredMap.length - 1) mapTokens.push('\n')
        })
      } else if (Array.isArray(configuredMap)) {
        mapTokens = configuredMap.map(value => String(value))
      } else {
        mapTokens = ['One', 'Two', 'Three', '\n', 'Four', 'Five', 'Six']
      }
      mapTokens = mapTokens.filter(token => token !== '')
      const buttonLabels = mapTokens.filter(token => token !== '\n')
      if (buttonLabels.length === 0) {
        mapTokens = ['One', 'Two', 'Three', '\n', 'Four', 'Five', 'Six']
        buttonLabels.push('One', 'Two', 'Three', 'Four', 'Five', 'Six')
      }
      const initialIndex = Math.min(
        buttonLabels.length - 1,
        Math.max(
          0,
          integerProp(
            component.props.selectedIndex ??
            component.props.checkedButton,
            1,
          ),
        ),
      )
      const oneCheck = component.props.oneCheck === true
      const disabledButtons: number[] = Array.isArray(component.props.disabledButtons)
        ? Array.from(new Set<number>(
          component.props.disabledButtons
            .map((value: unknown) => integerProp(value, -1))
            .filter((index: number) =>
              index >= 0 && index < buttonLabels.length),
        )).sort((left, right) => left - right)
        : []
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_button_matrix`,
        selectedIndexName: `fg_${runtimeStem}_button_matrix_selected_index`,
        buttonCountName: `fg_${runtimeStem}_button_matrix_button_count`,
        transitionName: `fg_${runtimeStem}_button_matrix_apply_selection`,
        eventCallbackName: `fg_${runtimeStem}_button_matrix_value_changed_cb`,
        mapTokens,
        buttonLabels,
        initialIndex,
        oneCheck,
        disabledButtons,
      })
    })

  return exportsByComponent
}

const createKeyboardExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, KeyboardExport> => {
  const exportsByComponent = new Map<string, KeyboardExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Keyboard')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Keyboard',
        'Keyboard',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (
        usedApiNames.has(`FG_Show_${allocatedBase}`) ||
        usedApiNames.has(`FG_Hide_${allocatedBase}`)
      ) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const showApiName = `FG_Show_${allocatedBase}`
      const hideApiName = `FG_Hide_${allocatedBase}`
      usedApiNames.add(showApiName)
      usedApiNames.add(hideApiName)

      let shownHookName = `FG_On_${allocatedBase}_Shown`
      suffix = 2
      while (usedHookNames.has(shownHookName)) {
        shownHookName = `FG_On_${allocatedBase}_${suffix++}_Shown`
      }
      usedHookNames.add(shownHookName)
      userEventHooks.add(shownHookName)

      let hiddenHookName = `FG_On_${allocatedBase}_Hidden`
      suffix = 2
      while (usedHookNames.has(hiddenHookName)) {
        hiddenHookName = `FG_On_${allocatedBase}_${suffix++}_Hidden`
      }
      usedHookNames.add(hiddenHookName)
      userEventHooks.add(hiddenHookName)

      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        showApiName,
        hideApiName,
        shownHookName,
        hiddenHookName,
        objectName: `fg_${runtimeStem}_keyboard`,
      })
    })

  return exportsByComponent
}

const createChartExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, ChartExport> => {
  const exportsByComponent = new Map<string, ChartExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Chart')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Data_Chart',
        'Data_Chart',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (
        usedApiNames.has(`FG_Add_${allocatedBase}_Point`) ||
        usedApiNames.has(`FG_Clear_${allocatedBase}`)
      ) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const addApiName = `FG_Add_${allocatedBase}_Point`
      const clearApiName = `FG_Clear_${allocatedBase}`
      usedApiNames.add(addApiName)
      usedApiNames.add(clearApiName)

      let pointAddedHookName = `FG_On_${allocatedBase}_Point_Added`
      suffix = 2
      while (usedHookNames.has(pointAddedHookName)) {
        pointAddedHookName = `FG_On_${allocatedBase}_${suffix++}_Point_Added`
      }
      usedHookNames.add(pointAddedHookName)
      userEventHooks.add(pointAddedHookName)

      let clearedHookName = `FG_On_${allocatedBase}_Cleared`
      suffix = 2
      while (usedHookNames.has(clearedHookName)) {
        clearedHookName = `FG_On_${allocatedBase}_${suffix++}_Cleared`
      }
      usedHookNames.add(clearedHookName)
      userEventHooks.add(clearedHookName)

      const firstRangeValue = integerProp(
        component.props.yMin ?? component.props.min,
        0,
      )
      const secondRangeValue = integerProp(
        component.props.yMax ?? component.props.max,
        100,
      )
      const minimum = Math.min(firstRangeValue, secondRangeValue)
      const maximum = Math.max(firstRangeValue, secondRangeValue)
      const pointCount = Math.max(
        1,
        integerProp(
          component.props.pointCount,
          FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT,
        ),
      )
      const configuredData = Array.isArray(component.props.initialData)
        ? component.props.initialData
        : FORGEUI_STANDARD_CHART_DEFAULT_DATA
      const initialData = configuredData
        .slice(0, pointCount)
        .map((value: unknown) =>
          Math.max(
            minimum,
            Math.min(maximum, integerProp(value, minimum)),
          ),
        )
      const runtimeStem = allocatedBase.toLowerCase()
      const rawUpdateMode = String(component.props.updateMode ?? '')
        .toLowerCase()
      const rawSeriesColor = component.props.seriesColor
      const normalizedSeriesColor =
        typeof rawSeriesColor === 'string'
          ? rawSeriesColor.replace(/^#/, '')
          : ''
      const seriesColor =
        /^[0-9a-fA-F]{6}$/.test(normalizedSeriesColor)
          ? `lv_color_hex(0x${normalizedSeriesColor.toUpperCase()})`
          : typeof rawSeriesColor === 'number' &&
            Number.isFinite(rawSeriesColor)
            ? `lv_color_hex(0x${Math.max(0, Math.min(0xFFFFFF, Math.trunc(rawSeriesColor))).toString(16).toUpperCase().padStart(6, '0')})`
            : 'lv_palette_main(LV_PALETTE_BLUE)'

      exportsByComponent.set(component.id, {
        addApiName,
        clearApiName,
        pointAddedHookName,
        clearedHookName,
        objectName: `fg_${runtimeStem}_chart`,
        seriesName: `fg_${runtimeStem}_chart_series`,
        minimumName: `fg_${runtimeStem}_chart_y_minimum`,
        maximumName: `fg_${runtimeStem}_chart_y_maximum`,
        minimum,
        maximum,
        pointCount,
        initialData,
        seriesColor,
        horizontalDivisions:
          Math.max(0, integerProp(
            component.props.horizontalDivisions ?? component.props.hdiv,
            3,
          )),
        verticalDivisions: pointCount,
        updateMode: rawUpdateMode === 'circular'
          ? 'LV_CHART_UPDATE_MODE_CIRCULAR'
          : rawUpdateMode === 'shift'
            ? 'LV_CHART_UPDATE_MODE_SHIFT'
            : undefined,
      })
    })

  return exportsByComponent
}

const createArcExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, ArcExport> => {
  const exportsByComponent = new Map<string, ArcExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Arc')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Value_Arc',
        'Value_Arc',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      const apiName = allocateUniqueOutputApiName(baseName, usedApiNames)
      const allocatedBase = apiName.replace(/^FG_Set_/, '')
      let hookName = `FG_On_${allocatedBase}_Changed`
      let suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const firstRangeValue = integerProp(component.props.min, 0)
      const secondRangeValue = integerProp(component.props.max, 100)
      const minimum = Math.min(firstRangeValue, secondRangeValue)
      const maximum = Math.max(firstRangeValue, secondRangeValue)
      const configuredValue = integerProp(component.props.value, 65)
      const initialValue = Math.max(minimum, Math.min(maximum, configuredValue))
      const runtimeStem = allocatedBase.toLowerCase()
      const rawMode = String(component.props.mode ?? component.props.arcMode ?? '')
        .toLowerCase()
      const mode = rawMode === 'reverse'
        ? 'LV_ARC_MODE_REVERSE'
        : rawMode === 'symmetrical' || rawMode === 'symmetric'
          ? 'LV_ARC_MODE_SYMMETRICAL'
          : rawMode === 'normal'
            ? 'LV_ARC_MODE_NORMAL'
            : undefined

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_arc`,
        stateName: `fg_${runtimeStem}_arc_value`,
        minimumName: `fg_${runtimeStem}_arc_minimum`,
        maximumName: `fg_${runtimeStem}_arc_maximum`,
        minimum,
        maximum,
        initialValue,
        rotation: component.props.rotation === undefined
          ? undefined
          : integerProp(component.props.rotation, 0),
        backgroundStartAngle:
          component.props.bgStartAngle === undefined &&
          component.props.backgroundStartAngle === undefined
            ? undefined
            : integerProp(
                component.props.bgStartAngle ??
                component.props.backgroundStartAngle,
                135,
              ),
        backgroundEndAngle:
          component.props.bgEndAngle === undefined &&
          component.props.backgroundEndAngle === undefined
            ? undefined
            : integerProp(
                component.props.bgEndAngle ??
                component.props.backgroundEndAngle,
                45,
              ),
        mode,
      })
    })

  return exportsByComponent
}

const createBarExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, BarExport> => {
  const exportsByComponent = new Map<string, BarExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Bar')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Progress_Bar',
        'Progress_Bar',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      const apiName = allocateUniqueOutputApiName(baseName, usedApiNames)
      const allocatedBase = apiName.replace(/^FG_Set_/, '')
      let hookName = `FG_On_${allocatedBase}_Changed`
      let suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const firstRangeValue = integerProp(component.props.min, 0)
      const secondRangeValue = integerProp(component.props.max, 100)
      const minimum = Math.min(firstRangeValue, secondRangeValue)
      const maximum = Math.max(firstRangeValue, secondRangeValue)
      const configuredValue = integerProp(component.props.value, 70)
      const initialValue = Math.max(minimum, Math.min(maximum, configuredValue))
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_bar`,
        stateName: `fg_${runtimeStem}_bar_value`,
        minimumName: `fg_${runtimeStem}_bar_minimum`,
        maximumName: `fg_${runtimeStem}_bar_maximum`,
        minimum,
        maximum,
        initialValue,
      })
    })

  return exportsByComponent
}

const createProgressExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, ProgressExport> => {
  const exportsByComponent = new Map<string, ProgressExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Progress')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Progress',
        'Progress',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Value`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Value`
      usedApiNames.add(apiName)

      const firstRangeValue = integerProp(component.props.min, 0)
      const secondRangeValue = integerProp(component.props.max, 100)
      const minimum = Math.min(firstRangeValue, secondRangeValue)
      const maximum = Math.max(firstRangeValue, secondRangeValue)
      const configuredValue = integerProp(component.props.value, 60)
      const initialValue = Math.max(minimum, Math.min(maximum, configuredValue))
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        objectName: `fg_${runtimeStem}_progress`,
        stateName: `fg_${runtimeStem}_progress_value`,
        minimumName: `fg_${runtimeStem}_progress_minimum`,
        maximumName: `fg_${runtimeStem}_progress_maximum`,
        minimum,
        maximum,
        initialValue,
      })
    })

  return exportsByComponent
}

const createNumberInputExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, NumberInputExport> => {
  const exportsByComponent = new Map<string, NumberInputExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'NumberInput')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Number_Input',
        'Number_Input',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Value`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Value`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const firstRangeValue = integerProp(component.props.min, 0)
      const secondRangeValue = integerProp(component.props.max, 100)
      const minimum = Math.min(firstRangeValue, secondRangeValue)
      const maximum = Math.max(firstRangeValue, secondRangeValue)
      const configuredValue = integerProp(component.props.value, 50)
      const initialValue = Math.max(minimum, Math.min(maximum, configuredValue))
      const step = Math.max(1, Math.abs(integerProp(component.props.step, 1)))
      const precision = Math.max(0, Math.min(
        20,
        integerProp(component.props.precision, 0),
      ))
      const numericInitialValue = Number(component.props.value)
      const clampedDisplayValue = Number.isFinite(numericInitialValue)
        ? Math.max(minimum, Math.min(maximum, numericInitialValue))
        : initialValue
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}`,
        stateName: `fg_${runtimeStem}_value`,
        programmaticUpdateName:
          `fg_${runtimeStem}_programmatic_update`,
        minimumName: `fg_${runtimeStem}_minimum`,
        maximumName: `fg_${runtimeStem}_maximum`,
        stepName: `fg_${runtimeStem}_step`,
        eventCallbackName: `fg_${runtimeStem}_value_changed_cb`,
        minimum,
        maximum,
        step,
        initialValue,
        initialText: precision > 0
          ? clampedDisplayValue.toFixed(precision)
          : String(Math.trunc(clampedDisplayValue)),
      })
    })

  return exportsByComponent
}

const createSelectExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, SelectExport> => {
  const exportsByComponent = new Map<string, SelectExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Select')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Select',
        'Select',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(
        `FG_Set_${allocatedBase}_Selected_Index`,
      )) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Selected_Index`
      usedApiNames.add(apiName)

      let hookName = `FG_On_${allocatedBase}_Changed`
      suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const configuredOptions: unknown[] = Array.isArray(
        component.props.options,
      )
        ? component.props.options
        : typeof component.props.options === 'string'
          ? component.props.options.length > 0
            ? component.props.options.split('\n')
            : []
          : ['Option 1', 'Option 2', 'Option 3']
      const options = configuredOptions.map(option => String(option))
      const legacyValue = String(component.props.value ?? '')
      const legacyOptionMatch = legacyValue.match(/^option(\d+)$/i)
      const configuredIndex = component.props.selectedIndex ??
        (legacyOptionMatch ? Number(legacyOptionMatch[1]) - 1 : 0)
      const initialIndex = options.length > 0
        ? Math.min(
            options.length - 1,
            Math.max(0, integerProp(configuredIndex, 0)),
          )
        : 0
      const longestOption = options.reduce(
        (longest, option) => Math.max(
          longest,
          Array.from(option).reduce((length, character) => {
            const codePoint = character.codePointAt(0) || 0
            return length + (
              codePoint <= 0x7f ? 1 :
              codePoint <= 0x7ff ? 2 :
              codePoint <= 0xffff ? 3 : 4
            )
          }, 0),
        ),
        0,
      )
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}`,
        selectedIndexName: `fg_${runtimeStem}_selected_index`,
        programmaticUpdateName:
          `fg_${runtimeStem}_programmatic_update`,
        optionCountName: `fg_${runtimeStem}_option_count`,
        eventCallbackName: `fg_${runtimeStem}_value_changed_cb`,
        options,
        initialIndex,
        textBufferSize: Math.max(1, longestOption + 1),
      })
    })

  return exportsByComponent
}

const createImageExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, ImageExport> => {
  const exportsByComponent = new Map<string, ImageExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Image')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Image',
        'Image',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Source`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Source`
      usedApiNames.add(apiName)
      const runtimeStem = allocatedBase.toLowerCase()
      const asset: any = resolveStandardImageAsset(component)

      exportsByComponent.set(component.id, {
        apiName,
        objectName: `fg_${runtimeStem}`,
        sourceName: `fg_${runtimeStem}_source`,
        asset: asset?.lvgl || asset?.symbolName ? asset : undefined,
      })
    })

  return exportsByComponent
}

const createBoxExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, BoxExport> => {
  const exportsByComponent = new Map<string, BoxExport>()
  const usedApiNames = new Set(existingApiNames)
  const exportedComponentIds = new Set(
    Object.values(components).flatMap(component => component.children || []),
  )

  Object.values(components)
    .filter(component =>
      component.type === 'Box' && exportedComponentIds.has(component.id),
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Box',
        'Box',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (usedApiNames.has(`FG_Set_${allocatedBase}_Visible`)) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Visible`
      usedApiNames.add(apiName)
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        objectName: `fg_${runtimeStem}`,
        visibleName: `fg_${runtimeStem}_visible`,
      })
    })

  return exportsByComponent
}

const createIconButtonExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, IconButtonExport> => {
  const exportsByComponent = new Map<string, IconButtonExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'IconButton')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'IconButton',
        'IconButton',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (
        usedApiNames.has(`FG_Set_${allocatedBase}_Enabled`) ||
        usedHookNames.has(`FG_On_${allocatedBase}_Clicked`)
      ) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const apiName = `FG_Set_${allocatedBase}_Enabled`
      const hookName = `FG_On_${allocatedBase}_Clicked`
      usedApiNames.add(apiName)
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}`,
        enabledName: `fg_${runtimeStem}_enabled`,
        eventCallbackName: `fg_${runtimeStem}_clicked_cb`,
        initialEnabled: !Boolean(
          component.props.isDisabled || component.props.disabled,
        ),
      })
    })

  return exportsByComponent
}

const createLedExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, LedExport> => {
  const exportsByComponent = new Map<string, LedExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Led')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Status_LED',
        'Status_LED',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      const apiName = allocateUniqueOutputApiName(baseName, usedApiNames)
      const allocatedBase = apiName.replace(/^FG_Set_/, '')
      let hookName = `FG_On_${allocatedBase}_Changed`
      let suffix = 2
      while (usedHookNames.has(hookName)) {
        hookName = `FG_On_${allocatedBase}_${suffix++}_Changed`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)
      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_led`,
        stateName: `fg_${runtimeStem}_led_on`,
        initialState:
          component.props.on ??
          component.props.isOn ??
          component.props.isChecked ??
          component.props.enabled ??
          true,
      })
    })

  return exportsByComponent
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
  ledExports: Map<string, LedExport>,
  barExports: Map<string, BarExport>,
  progressExports: Map<string, ProgressExport>,
  numberInputExports: Map<string, NumberInputExport>,
  selectExports: Map<string, SelectExport>,
  imageExports: Map<string, ImageExport>,
  boxExports: Map<string, BoxExport>,
  iconButtonExports: Map<string, IconButtonExport>,
  arcExports: Map<string, ArcExport>,
  chartExports: Map<string, ChartExport>,
  keyboardExports: Map<string, KeyboardExport>,
  calendarExports: Map<string, CalendarExport>,
  rollerExports: Map<string, RollerExport>,
  messageBoxExports: Map<string, MessageBoxExport>,
  buttonMatrixExports: Map<string, ButtonMatrixExport>,
  tabViewExports: Map<string, TabViewExport>,
  tileViewExports: Map<string, TileViewExport>,
  clockExports: Map<string, ClockExport>,
  inputExports: Map<string, InputExport>,
  switchExports: Map<string, SwitchExport>,
  checkboxExports: Map<string, SwitchExport>,
  radioExports: Map<string, RadioExport>,
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
        const text = esc(getForgeUIStandardTextValue(child.props))



        const color = palette.textPrimary

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
  const text = esc(getForgeUIStandardHeadingText(child.props))

  const color = palette.textPrimary

  lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_32, 0);`)
  lines.push(``)
  break
}

case 'Clock': {
  const clockExport = clockExports.get(child.id)
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.value ||
      '12:34'
  )

  const clockLabel = clockExport?.labelName || varName
  lines.push(`${clockLabel} = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(${clockLabel}, "${text}");`)
  lines.push(`lv_obj_set_pos(${clockLabel}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${clockLabel}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(${clockLabel}, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${clockLabel}, &lv_font_montserrat_32, 0);`)
  lines.push(`lv_obj_set_style_text_align(${clockLabel}, LV_TEXT_ALIGN_LEFT, 0);`)
  lines.push(``)
  break
}

case 'WiFi': {
  lines.push(`fg_wifi_label = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(fg_wifi_label, "WIFI\\nWIFI_FAIL\\nIP: -");`)
  lines.push(`lv_obj_set_pos(fg_wifi_label, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(fg_wifi_label, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(fg_wifi_label, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`lv_obj_set_style_text_font(fg_wifi_label, &lv_font_montserrat_20, 0);`)
  lines.push(`lv_obj_set_style_text_align(fg_wifi_label, LV_TEXT_ALIGN_LEFT, 0);`)
  lines.push(`lv_obj_set_style_text_line_space(fg_wifi_label, -2, 0);`)
  lines.push(`lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_CLIP);`)
  lines.push(``)
  break
}
      
            case 'Button': {
        const text = esc(getForgeUIStandardButtonText(child.props))

        lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

        lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
        lines.push(`lv_label_set_text(${varName}_label, "${text}");`)
        lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.textPrimary}), 0);`)
        lines.push(`lv_obj_set_style_text_font(${varName}_label, &lv_font_montserrat_14, 0);`)
        lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`)
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
  const iconButtonExport = iconButtonExports.get(child.id)
  const buttonObject = iconButtonExport?.objectName || varName
  lines.push(iconButtonExport
    ? `${buttonObject} = lv_button_create(${parentVar});`
    : `lv_obj_t * ${buttonObject} = lv_button_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${buttonObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${buttonObject}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_radius(${buttonObject}, 12, 0);`)
  lines.push(`lv_obj_set_style_bg_color(${buttonObject}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${buttonObject}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${buttonObject}, 2, 0);`)

  lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${buttonObject});`)
  lines.push(`lv_label_set_text(${varName}_label, LV_SYMBOL_OK);`)
  lines.push(`lv_obj_center(${varName}_label);`)
  if (iconButtonExport) {
    lines.push(`${iconButtonExport.enabledName} = ${iconButtonExport.initialEnabled ? 'true' : 'false'};`)
    if (!iconButtonExport.initialEnabled) {
      lines.push(`lv_obj_add_state(${buttonObject}, LV_STATE_DISABLED);`)
    }
    lines.push(`lv_obj_add_event_cb(${buttonObject}, ${iconButtonExport.eventCallbackName}, LV_EVENT_CLICKED, NULL);`)
  }

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
        const inputExport = inputExports.get(child.id)
        const placeholder = esc(child.props.placeholder || 'Input')
        const initialText = esc(String(child.props.value || ''))

        if (!inputExport) break
        lines.push(`${inputExport.objectName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${inputExport.objectName}, true);`)
        lines.push(`lv_textarea_set_placeholder_text(${inputExport.objectName}, "${placeholder}");`)
        if (initialText) {
          lines.push(`lv_textarea_set_text(${inputExport.objectName}, "${initialText}");`)
        }
        lines.push(`lv_obj_set_pos(${inputExport.objectName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${inputExport.objectName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${inputExport.objectName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${inputExport.objectName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${inputExport.objectName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_add_event_cb(${inputExport.objectName}, ${inputExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
        lines.push(``)
        break
      }

      case 'Textarea': {
        const textareaExport = inputExports.get(child.id)
        const placeholder = esc(child.props.placeholder || 'Textarea')
        const initialText = esc(String(child.props.value || ''))

        if (!textareaExport) break
        lines.push(`${textareaExport.objectName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_placeholder_text(${textareaExport.objectName}, "${placeholder}");`)
        if (initialText) {
          lines.push(`lv_textarea_set_text(${textareaExport.objectName}, "${initialText}");`)
        }
        lines.push(`lv_obj_set_pos(${textareaExport.objectName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${textareaExport.objectName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${textareaExport.objectName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${textareaExport.objectName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${textareaExport.objectName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_add_event_cb(${textareaExport.objectName}, ${textareaExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
        lines.push(``)
        break
      }
      
      case 'Switch': {
  const switchExport = switchExports.get(child.id)
  if (!switchExport) break

  lines.push(`${switchExport.objectName} = lv_switch_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${switchExport.objectName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${switchExport.objectName}, ${w}, ${h});`)

  if (switchExport.initialChecked) {
    lines.push(`lv_obj_add_state(${switchExport.objectName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(`lv_obj_add_event_cb(${switchExport.objectName}, ${switchExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  lines.push(``)
  break
}

      case 'Checkbox': {
  const checkboxExport = checkboxExports.get(child.id)
  if (!checkboxExport) break
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Checkbox'
  )

  lines.push(`${checkboxExport.objectName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${checkboxExport.objectName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${checkboxExport.objectName}, ${x}, ${y});`)

  if (checkboxExport.initialChecked) {
    lines.push(`lv_obj_add_state(${checkboxExport.objectName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${checkboxExport.objectName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${checkboxExport.objectName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${checkboxExport.objectName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${checkboxExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${checkboxExport.objectName}, lv_color_hex(${palette.text}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_add_event_cb(${checkboxExport.objectName}, ${checkboxExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  lines.push(``)
  break
}

      case 'Radio': {
  const radioExport = radioExports.get(child.id)
  if (!radioExport) break
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Radio'
  )

  lines.push(`${radioExport.objectName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${radioExport.objectName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${radioExport.objectName}, ${x}, ${y});`)

  if (radioExport.initialSelected) {
    lines.push(`lv_obj_add_state(${radioExport.objectName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${radioExport.objectName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${radioExport.objectName}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_border_color(${radioExport.objectName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${radioExport.objectName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${radioExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${radioExport.objectName}, lv_color_hex(${palette.text}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_add_event_cb(${radioExport.objectName}, ${radioExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  lines.push(``)
  break
}

  
        
      case 'NumberInput': {
        const numberInputExport = numberInputExports.get(child.id)
        const numberInputObject = numberInputExport?.objectName || varName
        const initialText = esc(
          numberInputExport?.initialText ??
          String(child.props.value ?? 50),
        )

        lines.push(`${numberInputObject} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${numberInputObject}, true);`)
        lines.push(`lv_textarea_set_text(${numberInputObject}, "${initialText}");`)
        lines.push(`lv_obj_set_pos(${numberInputObject}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${numberInputObject}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${numberInputObject}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputObject}, lv_color_hex(${palette.border}), 0);`)
        if (child.props.isDisabled) {
          lines.push(`lv_obj_add_state(${numberInputObject}, LV_STATE_DISABLED);`)
        }
        if (numberInputExport) {
          lines.push(`${numberInputExport.stateName} = ${numberInputExport.initialValue};`)
          lines.push(`lv_obj_add_event_cb(${numberInputObject}, ${numberInputExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
        }
        lines.push(``)
        break
      }

      case 'Select': {
        const selectExport = selectExports.get(child.id)
        const selectObject = selectExport?.objectName || varName
        const optionLiteral = selectExport
          ? selectExport.options.map(option => esc(option)).join('\\n')
          : 'Option 1\\nOption 2\\nOption 3'
        lines.push(`${selectObject} = lv_dropdown_create(${parentVar});`)
        lines.push(`lv_dropdown_set_options(${selectObject}, "${optionLiteral}");`)
        if (selectExport && selectExport.options.length > 0) {
          lines.push(`lv_dropdown_set_selected(${selectObject}, ${selectExport.initialIndex});`)
          lines.push(`${selectExport.selectedIndexName} = ${selectExport.initialIndex};`)
        }
        lines.push(`lv_obj_set_pos(${selectObject}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${selectObject}, ${w}, ${h});`)

        lines.push(`lv_obj_set_style_bg_color(${selectObject}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${selectObject}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${selectObject}, 2, 0);`)
        if (child.props.isDisabled) {
          lines.push(`lv_obj_add_state(${selectObject}, LV_STATE_DISABLED);`)
        }
        if (selectExport) {
          lines.push(`lv_obj_add_event_cb(${selectObject}, ${selectExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
        }

        lines.push(``)
        break
      }

case 'Image': {
  const imageExport = imageExports.get(child.id)
  const asset: any = imageExport?.asset ||
    resolveStandardImageAsset(child)
  const imageObject = imageExport?.objectName || varName
  const renderObject = asset?.lvgl || asset?.symbolName
    ? imageObject
    : varName

  if (asset?.lvgl || asset?.symbolName) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(child.props.imageScale || 256)

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`${imageObject} = lv_image_create(${parentVar});`)
    lines.push(`lv_image_set_src(${imageObject}, &${symbol});`)
    if (imageExport) {
      lines.push(`${imageExport.sourceName} = &${symbol};`)
    }
    lines.push(`lv_image_set_scale(${imageObject}, ${imageScale});`)
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

  lines.push(`lv_obj_set_pos(${renderObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${renderObject}, ${w}, ${h});`)

  lines.push(`lv_obj_add_flag(${renderObject}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_transform_pivot_x(${renderObject}, ${Math.floor(w / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_pivot_y(${renderObject}, ${Math.floor(h / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${renderObject}, 256, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${renderObject}, 235, LV_STATE_PRESSED);`)

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
  const progressExport = progressExports.get(child.id)
  const progressObject = progressExport?.objectName || varName
  const minimum = progressExport?.minimum ?? 0
  const maximum = progressExport?.maximum ?? 100
  const initialValue = progressExport?.initialValue ?? 60
  lines.push(`${progressObject} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${progressObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${progressObject}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${progressObject}, ${minimum}, ${maximum});`)
  lines.push(`lv_bar_set_value(${progressObject}, ${initialValue}, LV_ANIM_OFF);`)
  if (progressExport) {
    lines.push(`${progressExport.stateName} = ${initialValue};`)
  }
  lines.push(`lv_obj_set_style_bg_color(${progressObject}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${progressObject}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
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
  const ledExport = ledExports.get(child.id)

  const ledObject = ledExport?.objectName || varName
  lines.push(`${ledObject} = lv_led_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${ledObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${ledObject}, ${size}, ${size});`)
  lines.push(`lv_led_set_color(${ledObject}, lv_palette_main(LV_PALETTE_GREEN));`)
  lines.push(`lv_led_set_brightness(${ledObject}, 255);`)
  if (ledExport?.initialState === false) {
    lines.push(`lv_led_off(${ledObject});`)
  } else {
    lines.push(`lv_led_on(${ledObject});`)
  }
  if (ledExport) {
    lines.push(`${ledExport.stateName} = ${ledExport.initialState ? 'true' : 'false'};`)
  }
  lines.push(``)
  break
}

case 'Bar': {
  const barExport = barExports.get(child.id)
  const barObject = barExport?.objectName || varName
  const minimum = barExport?.minimum ?? 0
  const maximum = barExport?.maximum ?? 100
  const initialValue = barExport?.initialValue ?? 70
  lines.push(`${barObject} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${barObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${barObject}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${barObject}, ${minimum}, ${maximum});`)
  lines.push(`lv_bar_set_value(${barObject}, ${initialValue}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${barObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${barObject}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${barObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${barObject}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${barObject}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${barObject}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_opa(${barObject}, LV_OPA_COVER, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_radius(${barObject}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);`)
  if (barExport) {
    lines.push(`${barExport.stateName} = ${initialValue};`)
  }
  lines.push(``)
  break
}

case 'Arc': {
  const arcExport = arcExports.get(child.id)
  const arcObject = arcExport?.objectName || varName
  const minimum = arcExport?.minimum ?? 0
  const maximum = arcExport?.maximum ?? 100
  const initialValue = arcExport?.initialValue ?? 65
  lines.push(`${arcObject} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${arcObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${arcObject}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${arcObject}, ${minimum}, ${maximum});`)
  if (arcExport?.rotation !== undefined) {
    lines.push(`lv_arc_set_rotation(${arcObject}, ${arcExport.rotation});`)
  }
  if (
    arcExport?.backgroundStartAngle !== undefined &&
    arcExport.backgroundEndAngle !== undefined
  ) {
    lines.push(`lv_arc_set_bg_angles(${arcObject}, ${arcExport.backgroundStartAngle}, ${arcExport.backgroundEndAngle});`)
  }
  if (arcExport?.mode) {
    lines.push(`lv_arc_set_mode(${arcObject}, ${arcExport.mode});`)
  }
  lines.push(`lv_arc_set_value(${arcObject}, ${initialValue});`)
  lines.push(`lv_obj_set_style_arc_color(${arcObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${arcObject}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${arcObject}, lv_color_hex(${palette.accentText}), LV_PART_KNOB);`)
  if (arcExport) {
    lines.push(`${arcExport.stateName} = ${initialValue};`)
  }
  lines.push(``)
  break
}

case 'Roller': {
  const rollerExport = rollerExports.get(child.id)
  const rollerObject = rollerExport?.objectName || varName
  const optionLiteral = rollerExport
    ? rollerExport.options.map(option => esc(option)).join('\\n')
    : 'One\\nTwo\\nThree\\nFour'
  const rollerMode = rollerExport?.mode || 'LV_ROLLER_MODE_NORMAL'
  const visibleRowCount = rollerExport?.visibleRowCount ?? 3
  const initialIndex = rollerExport?.initialIndex ?? 0
  lines.push(`${rollerObject} = lv_roller_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${rollerObject};`)
  lines.push(`lv_roller_set_options(${varName}, "${optionLiteral}", ${rollerMode});`)
  lines.push(`lv_roller_set_visible_row_count(${varName}, ${visibleRowCount});`)
  lines.push(`lv_roller_set_selected(${varName}, ${initialIndex}, LV_ANIM_OFF);`)
  if (rollerExport) {
    lines.push(`${rollerExport.selectedIndexName} = ${initialIndex};`)
    lines.push(`lv_obj_add_event_cb(${varName}, ${rollerExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_16, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_align(${varName}, LV_TEXT_ALIGN_CENTER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_line_space(${varName}, 5, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 0, LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_16, LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_text_align(${varName}, LV_TEXT_ALIGN_CENTER, LV_PART_SELECTED);`)
  lines.push(``)
  break
}

case 'Canvas': {
  const asset: any = resolveStandardImageAsset(child)
  const hasImage = Boolean(asset?.lvgl || asset?.symbolName)
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, ${hasImage ? 'LV_OPA_TRANSP' : 'LV_OPA_COVER'}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${hasImage ? 0 : 2}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
  if (hasImage) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource
    if (cFile) usedAssetSources.add(cFile)
    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`lv_obj_t * ${varName}_image = lv_image_create(${varName});`)
    lines.push(`lv_image_set_src(${varName}_image, &${symbol});`)
    lines.push(`lv_image_set_scale(${varName}_image, ${Number(child.props.imageScale || 256)});`)
    lines.push(`lv_obj_center(${varName}_image);`)
  }

  lines.push(``)
  break
}

case 'Line': {
  const lineGeometry = getForgeUIStandardLineGeometry(child.props)
  lines.push(`static lv_point_precise_t ${varName}_pts[] = {`)
  lines.push(`  {${lineGeometry.startX}, ${lineGeometry.startY}},`)
  lines.push(`  {${lineGeometry.endX}, ${lineGeometry.endY}}`)
  lines.push(`};`)

  lines.push(`lv_obj_t * ${varName} = lv_line_create(${parentVar});`)
  lines.push(`lv_line_set_points(${varName}, ${varName}_pts, 2);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_width(${varName}, ${lv(child.props.lineWidth, 3)}, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Tabview': {
  const tabViewExport = tabViewExports.get(child.id)
  const tabViewObject = tabViewExport?.objectName || varName
  const tabGeometry = getForgeUITabViewGeometry(child.props)
  lines.push(`${tabViewObject} = lv_tabview_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${tabViewObject};`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${FORGEUI_TAB_TILE_BORDER_WIDTH}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_row(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_tabview_set_tab_bar_position(${varName}, LV_DIR_TOP);`)
  lines.push(`lv_tabview_set_tab_bar_size(${varName}, ${tabGeometry.tabBarHeight});`)
  lines.push(`lv_obj_t * ${varName}_tab_bar = lv_tabview_get_tab_bar(${varName});`)
  lines.push(`lv_obj_t * ${varName}_content = lv_tabview_get_content(${varName});`)
  lines.push(`lv_obj_set_size(${varName}_tab_bar, ${tabGeometry.innerWidth}, ${tabGeometry.tabBarHeight});`)
  lines.push(`lv_obj_set_flex_grow(${varName}_tab_bar, 0);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}_tab_bar, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_row(${varName}_tab_bar, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}_tab_bar, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}_tab_bar, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}_tab_bar, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_tab_bar, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}_tab_bar, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_size(${varName}_content, ${tabGeometry.innerWidth}, ${tabGeometry.contentHeight});`)
  lines.push(`lv_obj_set_flex_grow(${varName}_content, 0);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}_content, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_row(${varName}_content, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}_content, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}_content, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}_content, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_content, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}_content, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_scrollbar_mode(${varName}_content, LV_SCROLLBAR_MODE_OFF);`)

  lines.push(`lv_obj_t * ${varName}_tab1 = lv_tabview_add_tab(${varName}, "Tab 1");`)
  lines.push(`lv_obj_t * ${varName}_tab2 = lv_tabview_add_tab(${varName}, "Tab 2");`)
  lines.push(`lv_obj_t * ${varName}_tab3 = lv_tabview_add_tab(${varName}, "Tab 3");`)
  ;[1, 2, 3].forEach((tabNumber, index) => {
    lines.push(`lv_obj_t * ${varName}_tab_button_${tabNumber} = lv_obj_get_child(${varName}_tab_bar, ${index});`)
    lines.push(`lv_obj_set_flex_grow(${varName}_tab_button_${tabNumber}, 0);`)
    lines.push(`lv_obj_set_size(${varName}_tab_button_${tabNumber}, ${tabGeometry.tabWidths[index]}, ${tabGeometry.tabBarHeight});`)
    lines.push(`lv_obj_set_style_pad_all(${varName}_tab_button_${tabNumber}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${varName}_tab_button_${tabNumber}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tab_button_${tabNumber}, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_tab_button_${tabNumber}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}_tab_button_${tabNumber}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tab_button_${tabNumber}, LV_OPA_20, LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_tab_button_${tabNumber}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_border_color(${varName}_tab_button_${tabNumber}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_border_width(${varName}_tab_button_${tabNumber}, 3, LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_border_side(${varName}_tab_button_${tabNumber}, LV_BORDER_SIDE_BOTTOM, LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_t * ${varName}_tab_button_label_${tabNumber} = lv_obj_get_child(${varName}_tab_button_${tabNumber}, 0);`)
    lines.push(`lv_obj_center(${varName}_tab_button_label_${tabNumber});`)
    lines.push(`lv_obj_set_size(${varName}_tab${tabNumber}, ${tabGeometry.innerWidth}, ${tabGeometry.contentHeight});`)
    lines.push(`lv_obj_set_style_pad_all(${varName}_tab${tabNumber}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${varName}_tab${tabNumber}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${varName}_tab${tabNumber}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}_tab${tabNumber}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tab${tabNumber}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_tab${tabNumber}, LV_OBJ_FLAG_SCROLLABLE);`)
  })
  if (tabViewExport) {
    lines.push(`lv_tabview_set_active(${varName}, ${tabViewExport.initialIndex}, LV_ANIM_OFF);`)
    lines.push(`${tabViewExport.selectedIndexName} = ${tabViewExport.initialIndex};`)
    lines.push(`lv_obj_add_event_cb(${varName}, ${tabViewExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tab1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tab 1 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl1, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
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
  const tileViewExport = tileViewExports.get(child.id)
  const tileViewObject = tileViewExport?.objectName || varName
  const tileGeometry = getForgeUITileViewGeometry(child.props)
  lines.push(`${tileViewObject} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${tileViewObject};`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${FORGEUI_TAB_TILE_BORDER_WIDTH}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 10, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)

  ;[
    { number: 1, column: 0, row: 0 },
    { number: 2, column: 1, row: 0 },
    { number: 3, column: 0, row: 1 },
    { number: 4, column: 1, row: 1 },
  ].forEach(({ number, column, row }) => {
    lines.push(`lv_obj_t * ${varName}_tile${number} = lv_obj_create(${varName});`)
    lines.push(`lv_obj_set_pos(${varName}_tile${number}, ${tileGeometry.columnX[column]}, ${tileGeometry.rowY[row]});`)
    lines.push(`lv_obj_set_size(${varName}_tile${number}, ${tileGeometry.columnWidths[column]}, ${tileGeometry.rowHeights[row]});`)
    lines.push(`lv_obj_set_style_pad_all(${varName}_tile${number}, 0, LV_PART_MAIN);`)
  })
  if (tileViewExport) {
    lines.push(`${tileViewExport.tilesName}[0][0] = ${varName}_tile1;`)
    lines.push(`${tileViewExport.tilesName}[1][0] = ${varName}_tile2;`)
    lines.push(`${tileViewExport.tilesName}[0][1] = ${varName}_tile3;`)
    lines.push(`${tileViewExport.tilesName}[1][1] = ${varName}_tile4;`)
  }

  ;[1, 2, 3, 4].forEach((n) => {
    lines.push(`lv_obj_set_style_bg_color(${varName}_tile${n}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tile${n}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_tile${n}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_color(${varName}_tile${n}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${varName}_tile${n}, 1, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${varName}_tile${n}, 10, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}_tile${n}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tile${n}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_tile${n}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_clear_flag(${varName}_tile${n}, LV_OBJ_FLAG_SCROLLABLE);`)
    if (tileViewExport) {
      lines.push(`lv_obj_add_event_cb(${varName}_tile${n}, ${tileViewExport.eventCallbackName}, LV_EVENT_CLICKED, NULL);`)
    }
  })

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tile1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tile 1");`)
  lines.push(`lv_obj_clear_flag(${varName}_lbl1, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_center(${varName}_lbl1);`)

  lines.push(`lv_obj_t * ${varName}_lbl2 = lv_label_create(${varName}_tile2);`)
  lines.push(`lv_label_set_text(${varName}_lbl2, "Tile 2");`)
  lines.push(`lv_obj_clear_flag(${varName}_lbl2, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_center(${varName}_lbl2);`)

  lines.push(`lv_obj_t * ${varName}_lbl3 = lv_label_create(${varName}_tile3);`)
  lines.push(`lv_label_set_text(${varName}_lbl3, "Tile 3");`)
  lines.push(`lv_obj_clear_flag(${varName}_lbl3, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_center(${varName}_lbl3);`)

  lines.push(`lv_obj_t * ${varName}_lbl4 = lv_label_create(${varName}_tile4);`)
  lines.push(`lv_label_set_text(${varName}_lbl4, "Tile 4");`)
  lines.push(`lv_obj_clear_flag(${varName}_lbl4, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_center(${varName}_lbl4);`)

  if (tileViewExport) {
    lines.push(`${tileViewExport.selectedColumnName} = ${tileViewExport.initialColumn};`)
    lines.push(`${tileViewExport.selectedRowName} = ${tileViewExport.initialRow};`)
    lines.push(`lv_obj_add_state(${tileViewExport.tilesName}[${tileViewExport.initialColumn}][${tileViewExport.initialRow}], LV_STATE_CHECKED);`)
  }

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
  const matrixExport = buttonMatrixExports.get(child.id)
  const matrixObject = matrixExport?.objectName || varName
  const matrixMap = matrixExport?.mapTokens ||
    ['One', 'Two', 'Three', '\n', 'Four', 'Five', 'Six']
  const mapLiteral = matrixMap
    .map(token => token === '\n' ? '"\\n"' : `"${esc(token)}"`)
    .concat('""')
    .join(', ')
  lines.push(`static const char * ${varName}_map[] = {${mapLiteral}};`)

  lines.push(`${matrixObject} = lv_buttonmatrix_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${matrixObject};`)
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
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.selectedSurface}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.accentText}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.disabledText}), LV_PART_ITEMS | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_opa(${varName}, LV_OPA_50, LV_PART_ITEMS | LV_STATE_DISABLED);`)

  const initialIndex = matrixExport?.initialIndex ?? 1
  lines.push(`lv_buttonmatrix_set_selected_button(${varName}, ${initialIndex});`)
  if (matrixExport) {
    if (matrixExport.oneCheck) {
      lines.push(`lv_buttonmatrix_set_button_ctrl_all(${varName}, LV_BUTTONMATRIX_CTRL_CHECKABLE);`)
      lines.push(`lv_buttonmatrix_set_one_checked(${varName}, true);`)
      lines.push(`lv_buttonmatrix_set_button_ctrl(${varName}, ${initialIndex}, LV_BUTTONMATRIX_CTRL_CHECKED);`)
    }
    matrixExport.disabledButtons.forEach(index => {
      lines.push(`lv_buttonmatrix_set_button_ctrl(${varName}, ${index}, LV_BUTTONMATRIX_CTRL_DISABLED);`)
    })
    lines.push(`${matrixExport.selectedIndexName} = ${initialIndex};`)
    lines.push(`lv_obj_add_event_cb(${varName}, ${matrixExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }

  lines.push(``)
  break
}

case 'Msgbox': {
  const messageExport = messageBoxExports.get(child.id)
  const messageObject = messageExport?.objectName || varName
  const messageTitle = messageExport?.title || 'Message'
  const messageBody = messageExport?.bodyText || 'Example message text'
  const messageButtons = messageExport?.buttons || ['OK', 'Cancel']
  lines.push(`${messageObject} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${messageObject};`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_outline_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)

  lines.push(``)

  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_title, "${esc(messageTitle)}");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_font(${varName}_title, &lv_font_montserrat_16, LV_PART_MAIN);`)
  lines.push(`lv_obj_align(${varName}_title, LV_ALIGN_TOP_LEFT, 0, 0);`)

  lines.push(`lv_obj_t * ${varName}_text = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_text, "${esc(messageBody)}");`)
  lines.push(`lv_obj_set_width(${varName}_text, ${Math.max(80, w - 16)});`)
  lines.push(`lv_label_set_long_mode(${varName}_text, LV_LABEL_LONG_WRAP);`)
  lines.push(`lv_obj_set_style_text_color(${varName}_text, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_font(${varName}_text, &lv_font_montserrat_14, LV_PART_MAIN);`)
  lines.push(`lv_obj_align(${varName}_text, LV_ALIGN_TOP_LEFT, 0, 38);`)

  messageButtons.forEach((buttonText, buttonIndex) => {
    const buttonName = `${varName}_button_${buttonIndex}`
    const isDefaultPair = messageButtons.length === 2 &&
      messageButtons[0] === 'OK' && messageButtons[1] === 'Cancel'
    const buttonWidth = isDefaultPair && buttonIndex === 0 ? 56 : 64
    const rightOffset = isDefaultPair
      ? buttonIndex === 0 ? -70 : 0
      : -((messageButtons.length - buttonIndex - 1) * 70)
    lines.push(`lv_obj_t * ${buttonName} = lv_button_create(${varName});`)
    lines.push(`lv_obj_set_size(${buttonName}, ${buttonWidth}, 30);`)
    lines.push(`lv_obj_align(${buttonName}, LV_ALIGN_BOTTOM_RIGHT, ${rightOffset}, 0);`)
    lines.push(`lv_obj_set_style_bg_color(${buttonName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${buttonName}, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_color(${buttonName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${buttonName}, 1, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${buttonName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_shadow_width(${buttonName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_outline_width(${buttonName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_pad_all(${buttonName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${buttonName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${buttonName}, &lv_font_montserrat_16, LV_PART_MAIN);`)
    lines.push(`lv_obj_t * ${buttonName}_label = lv_label_create(${buttonName});`)
    lines.push(`lv_label_set_text(${buttonName}_label, "${esc(buttonText)}");`)
    lines.push(`lv_obj_set_style_text_color(${buttonName}_label, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${buttonName}_label, &lv_font_montserrat_16, LV_PART_MAIN);`)
    lines.push(`lv_obj_center(${buttonName}_label);`)
    if (messageExport) {
      lines.push(`lv_obj_add_event_cb(${buttonName}, fg_message_button_clicked_cb, LV_EVENT_CLICKED, (void *)&${messageExport.buttonDataNames[buttonIndex]});`)
    }
  })
  if (messageExport) {
    lines.push(`${messageExport.visibleName} = true;`)
  }

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
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 8, LV_PART_ITEMS);`)

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
  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'Keyboard': {
  const keyboardExport = keyboardExports.get(child.id)
  const keyboardObject = keyboardExport?.objectName || varName
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

  lines.push(`${keyboardObject} = lv_keyboard_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${keyboardObject};`)
  lines.push(`lv_keyboard_set_map(${varName}, LV_KEYBOARD_MODE_TEXT_LOWER, ${varName}_map, ${varName}_ctrl);`)
  lines.push(`lv_keyboard_set_textarea(${varName}, NULL);`)
  lines.push(`lv_keyboard_set_mode(${varName}, LV_KEYBOARD_MODE_TEXT_LOWER);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_row(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_outline_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_70, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 6, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_outline_width(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.selectedSurface}), LV_PART_ITEMS | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.accentText}), LV_PART_ITEMS | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_ITEMS | LV_STATE_FOCUSED);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_ITEMS | LV_STATE_FOCUSED);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_ITEMS | LV_STATE_FOCUS_KEY);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_ITEMS | LV_STATE_FOCUS_KEY);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_ITEMS | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.disabledText}), LV_PART_ITEMS | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_opa(${varName}, LV_OPA_60, LV_PART_ITEMS | LV_STATE_DISABLED);`)
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
  const calendarExport = calendarExports.get(child.id)
  const calendarObject = calendarExport?.objectName || varName
  lines.push(`${calendarObject} = lv_calendar_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${calendarObject};`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_calendar_set_today_date(${varName}, 2026, 6, 18);`)
  lines.push(`lv_calendar_set_showed_date(${varName}, 2026, 6);`)
  if (calendarExport) {
    lines.push(`lv_obj_add_event_cb(${varName}, ${calendarExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textSecondary}), LV_PART_ITEMS | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_ITEMS | LV_STATE_FOCUSED);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_ITEMS | LV_STATE_FOCUSED);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.selectedSurface}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_40, LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_ITEMS | LV_STATE_CHECKED);`)

  lines.push(``)
  break
}

case 'Chart': {
  const chartExport = chartExports.get(child.id)
  const chartObject = chartExport?.objectName || varName
  const chartSeries = chartExport?.seriesName || `${varName}_ser`
  const chartLayout = getForgeUIStandardChartLayout(child.props)
  const pointCount = chartExport?.pointCount ??
    FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT
  const initialData = chartExport?.initialData ??
    FORGEUI_STANDARD_CHART_DEFAULT_DATA
  lines.push(`${chartObject} = lv_chart_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${chartObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${chartObject}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${chartObject}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${chartObject}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${chartObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${chartObject}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${chartObject}, 12, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_color(${chartObject}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_left(${chartObject}, ${chartLayout.labelGutter}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_right(${chartObject}, ${chartLayout.rightPadding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_top(${chartObject}, ${chartLayout.topPadding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_bottom(${chartObject}, ${chartLayout.bottomLabelGutter}, LV_PART_MAIN);`)
  lines.push(`lv_chart_set_type(${chartObject}, LV_CHART_TYPE_LINE);`)
  lines.push(`lv_chart_set_point_count(${chartObject}, ${pointCount});`)
  if (chartExport) {
    lines.push(`lv_chart_set_range(${chartObject}, LV_CHART_AXIS_PRIMARY_Y, ${chartExport.minimum}, ${chartExport.maximum});`)
    if (
      chartExport.horizontalDivisions !== undefined &&
      chartExport.verticalDivisions !== undefined
    ) {
      lines.push(`lv_chart_set_div_line_count(${chartObject}, ${chartExport.horizontalDivisions}, ${chartExport.verticalDivisions});`)
    }
    if (chartExport.updateMode) {
      lines.push(`lv_chart_set_update_mode(${chartObject}, ${chartExport.updateMode});`)
    }
  }
  lines.push(
    `${chartSeries} = lv_chart_add_series(${chartObject}, ${chartExport?.seriesColor || 'lv_palette_main(LV_PALETTE_BLUE)'}, LV_CHART_AXIS_PRIMARY_Y);`
  )
  initialData.forEach(value => {
    lines.push(`lv_chart_set_next_value(${chartObject}, ${chartSeries}, ${value});`)
  })
  lines.push(`lv_chart_refresh(${chartObject});`)
  chartLayout.yAxisLabels.forEach((label, index) => {
    const labelObject = `${varName}_y_label_${index}`
    lines.push(`lv_obj_t * ${labelObject} = lv_label_create(${parentVar});`)
    lines.push(`lv_label_set_text(${labelObject}, "${label.value}");`)
    lines.push(`lv_obj_set_pos(${labelObject}, ${x} + 2, ${y} + ${Math.round(label.y - 7)});`)
    lines.push(`lv_obj_set_size(${labelObject}, ${Math.max(12, chartLayout.plotLeft - 6)}, 14);`)
    lines.push(`lv_obj_set_style_text_color(${labelObject}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${labelObject}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_align(${labelObject}, LV_TEXT_ALIGN_RIGHT, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${labelObject}, LV_OBJ_FLAG_CLICKABLE);`)
  })
  chartLayout.xAxisLabels
    .filter(label => label.visible)
    .forEach(label => {
      const labelObject = `${varName}_x_label_${label.value}`
      const labelWidth = Math.max(
        16,
        Math.min(36, (String(label.value).length + 1) * 7),
      )
      lines.push(`lv_obj_t * ${labelObject} = lv_label_create(${parentVar});`)
      lines.push(`lv_label_set_text(${labelObject}, "${label.value}");`)
      lines.push(`lv_obj_set_pos(${labelObject}, ${x} + ${Math.round(label.x - labelWidth / 2)}, ${y} + ${Math.round(chartLayout.plotBottom + 3)});`)
      lines.push(`lv_obj_set_size(${labelObject}, ${labelWidth}, 14);`)
      lines.push(`lv_obj_set_style_text_color(${labelObject}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
      lines.push(`lv_obj_set_style_text_font(${labelObject}, &lv_font_montserrat_12, LV_PART_MAIN);`)
      lines.push(`lv_obj_set_style_text_align(${labelObject}, LV_TEXT_ALIGN_CENTER, LV_PART_MAIN);`)
      lines.push(`lv_obj_clear_flag(${labelObject}, LV_OBJ_FLAG_CLICKABLE);`)
    })
  lines.push(``)
  break
}


      case 'Box':
        {
          const boxExport = boxExports.get(child.id)
          const boxObject = boxExport?.objectName || varName
          lines.push(boxExport
            ? `${boxObject} = lv_obj_create(${parentVar});`
            : `lv_obj_t * ${boxObject} = lv_obj_create(${parentVar});`)
          if (boxExport) {
            lines.push(`lv_obj_t * ${varName} = ${boxObject};`)
            lines.push(`${boxExport.visibleName} = true;`)
          }
          lines.push(`lv_obj_set_pos(${boxObject}, ${x}, ${y});`)
          lines.push(`lv_obj_set_size(${boxObject}, ${w}, ${h});`)
          lines.push(`lv_obj_set_style_radius(${boxObject}, 12, 0);`)
          lines.push(`lv_obj_set_style_bg_color(${boxObject}, lv_color_hex(${palette.surface}), 0);`)
          lines.push(`lv_obj_set_style_bg_opa(${boxObject}, LV_OPA_80, 0);`)
          lines.push(`lv_obj_set_style_border_color(${boxObject}, lv_color_hex(${palette.border}), 0);`)
          lines.push(`lv_obj_set_style_border_width(${boxObject}, 2, 0);`)
        }
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
        ledExports,
        barExports,
        progressExports,
        numberInputExports,
        selectExports,
        imageExports,
        boxExports,
        iconButtonExports,
        arcExports,
        chartExports,
        keyboardExports,
        calendarExports,
        rollerExports,
        messageBoxExports,
        buttonMatrixExports,
        tabViewExports,
        tileViewExports,
        clockExports,
        inputExports,
        switchExports,
        checkboxExports,
        radioExports,
      )
    }
  })
}

export const generateForgeUILvglCode = (
  components: IComponents,
  themeId: string = 'graphite',
  heroBackground?: any,
  options?: {
    includeThemeTexture?: boolean
    palette?: ForgePreviewPalette
  },
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
  const ledExports = createLedExports(
    components,
    usedHookNames,
    userEventHooks,
    Array.from(binaryOutputExports.values()).map(output => output.apiName),
  )
  const barExports = createBarExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(output => output.apiName),
      ...Array.from(ledExports.values()).map(output => output.apiName),
    ],
  )
  const arcExports = createArcExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(output => output.apiName),
      ...Array.from(ledExports.values()).map(output => output.apiName),
      ...Array.from(barExports.values()).map(output => output.apiName),
    ],
  )
  const chartExports = createChartExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(output => output.apiName),
      ...Array.from(ledExports.values()).map(output => output.apiName),
      ...Array.from(barExports.values()).map(output => output.apiName),
      ...Array.from(arcExports.values()).map(output => output.apiName),
    ],
  )
  const keyboardExports = createKeyboardExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(output => output.apiName),
      ...Array.from(ledExports.values()).map(output => output.apiName),
      ...Array.from(barExports.values()).map(output => output.apiName),
      ...Array.from(arcExports.values()).map(output => output.apiName),
      ...Array.from(chartExports.values()).flatMap(output => [
        output.addApiName,
        output.clearApiName,
      ]),
    ],
  )
  const calendarExports = createCalendarExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
    ],
  )
  const rollerExports = createRollerExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
    ],
  )
  const messageBoxExports = createMessageBoxExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
    ],
  )
  const buttonMatrixExports = createButtonMatrixExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
    ],
  )
  const tabViewExports = createTabViewExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
    ],
  )
  const tileViewExports = createTileViewExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
    ],
  )
  const inputExports = createInputExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
    ],
  )
  const switchExports = createCheckedControlExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
    ],
    'Switch',
    'Switch',
    'switch',
  )
  const checkboxExports = createCheckedControlExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
    ],
    'Checkbox',
    'Checkbox',
    'checkbox',
  )
  const radioExports = createRadioExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
    ],
  )
  const progressExports = createProgressExports(
    components,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
    ],
  )
  const numberInputExports = createNumberInputExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
    ],
  )
  const selectExports = createSelectExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
    ],
  )
  const imageExports = createImageExports(
    components,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
      ...Array.from(selectExports.values()).map(value => value.apiName),
    ],
  )
  const boxExports = createBoxExports(
    components,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
      ...Array.from(selectExports.values()).map(value => value.apiName),
      ...Array.from(imageExports.values()).map(value => value.apiName),
    ],
  )
  const iconButtonExports = createIconButtonExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(chartExports.values()).flatMap(value => [
        value.addApiName,
        value.clearApiName,
      ]),
      ...Array.from(keyboardExports.values()).flatMap(value => [
        value.showApiName,
        value.hideApiName,
      ]),
      ...Array.from(calendarExports.values()).map(value => value.apiName),
      ...Array.from(rollerExports.values()).map(value => value.apiName),
      ...Array.from(messageBoxExports.values()).flatMap(value => [
        value.showApiName,
        value.closeApiName,
      ]),
      ...Array.from(buttonMatrixExports.values()).map(value => value.apiName),
      ...Array.from(tabViewExports.values()).map(value => value.apiName),
      ...Array.from(tileViewExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
      ...Array.from(selectExports.values()).map(value => value.apiName),
      ...Array.from(imageExports.values()).map(value => value.apiName),
      ...Array.from(boxExports.values()).map(value => value.apiName),
    ],
  )
  const clockExports = createClockExports(components)

  const previewPalette =
  options?.palette ||
  FG_PREVIEW_PALETTES[themeId as ForgeThemeId] ||
  FG_PREVIEW_PALETTES.graphite
  const semanticPalette =
    resolveForgeSemanticPalette(previewPalette)

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
  surfaceBorder: toLvHex(semanticPalette.surfaceBorder),
  surfaceSecondary: toLvHex(semanticPalette.surfaceSecondary),
  textPrimary: toLvHex(semanticPalette.textPrimary),
  textSecondary: toLvHex(semanticPalette.textSecondary),
  accentText: toLvHex(semanticPalette.accentText),
  disabledText: toLvHex(semanticPalette.disabledText),
  selectedSurface: toLvHex(semanticPalette.selectedSurface),

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
  (options?.includeThemeTexture === false ? undefined : palette.textureAsset)

const backgroundMode =
  heroAsset
    ? 'fullscreen'
    : palette.textureMode

  lines.push(`#include "90_Studio_Export.h"`)
  lines.push(`#include "lvgl.h"`)
  lines.push(`#include "bsp/display.h"`)
  lines.push(`#include "20_RTC.h"`)
  lines.push(`#include "30_WIFI.h"`)
  lines.push(`#include "40_SD.h"`)
  lines.push(`#include "freertos/FreeRTOS.h"`)
  lines.push(`#include "freertos/queue.h"`)
  lines.push(`#include "freertos/semphr.h"`)
  lines.push(`#include "freertos/task.h"`)
  if (hasInteractiveButtons || toggleInputExports.size > 0 || threeWayInputExports.size > 0 || ledExports.size > 0 || barExports.size > 0 || arcExports.size > 0 || chartExports.size > 0 || keyboardExports.size > 0 || calendarExports.size > 0 || rollerExports.size > 0 || messageBoxExports.size > 0 || buttonMatrixExports.size > 0 || tabViewExports.size > 0 || tileViewExports.size > 0 || inputExports.size > 0 || switchExports.size > 0 || checkboxExports.size > 0 || radioExports.size > 0 || numberInputExports.size > 0 || selectExports.size > 0 || iconButtonExports.size > 0) {
    lines.push(`#include "95_UserEvents.h"`)
  }
  lines.push(`#include <stdbool.h>`)
  lines.push(`#include <stdint.h>`)
  lines.push(`#include <limits.h>`)
  lines.push(`#include <stdio.h>`)
  lines.push(`#include <stdlib.h>`)
  lines.push(`#include <string.h>`)
  lines.push(``)
  clockExports.forEach(clockExport => {
    lines.push(`static lv_obj_t * ${clockExport.labelName} = NULL;`)
    lines.push(`static lv_timer_t * ${clockExport.timerName} = NULL;`)
    lines.push(`static bool ${clockExport.separatorVisibleName} = true;`)
  })
  lines.push(`static lv_obj_t * fg_wifi_label = NULL;`)
  lines.push(`static lv_obj_t * fg_application_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_launcher_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_brightness_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_brightness_label = NULL;`)
  ledExports.forEach(ledExport => {
    lines.push(`static lv_obj_t * ${ledExport.objectName} = NULL;`)
    lines.push(`static bool ${ledExport.stateName} = ${ledExport.initialState ? 'true' : 'false'};`)
  })
  barExports.forEach(barExport => {
    lines.push(`static lv_obj_t * ${barExport.objectName} = NULL;`)
    lines.push(`static int32_t ${barExport.stateName} = ${barExport.initialValue};`)
    lines.push(`static const int32_t ${barExport.minimumName} = ${barExport.minimum};`)
    lines.push(`static const int32_t ${barExport.maximumName} = ${barExport.maximum};`)
  })
  progressExports.forEach(progressExport => {
    lines.push(`static lv_obj_t * ${progressExport.objectName} = NULL;`)
    lines.push(`static int32_t ${progressExport.stateName} = ${progressExport.initialValue};`)
    lines.push(`static const int32_t ${progressExport.minimumName} = ${progressExport.minimum};`)
    lines.push(`static const int32_t ${progressExport.maximumName} = ${progressExport.maximum};`)
  })
  numberInputExports.forEach(numberInputExport => {
    lines.push(`static lv_obj_t * ${numberInputExport.objectName} = NULL;`)
    lines.push(`static int32_t ${numberInputExport.stateName} = ${numberInputExport.initialValue};`)
    lines.push(`static bool ${numberInputExport.programmaticUpdateName} = false;`)
    lines.push(`static const int32_t ${numberInputExport.minimumName} = ${numberInputExport.minimum};`)
    lines.push(`static const int32_t ${numberInputExport.maximumName} = ${numberInputExport.maximum};`)
    lines.push(`static const int32_t ${numberInputExport.stepName} = ${numberInputExport.step};`)
  })
  selectExports.forEach(selectExport => {
    lines.push(`static lv_obj_t * ${selectExport.objectName} = NULL;`)
    lines.push(`static uint32_t ${selectExport.selectedIndexName} = ${selectExport.initialIndex};`)
    lines.push(`static bool ${selectExport.programmaticUpdateName} = false;`)
    lines.push(`static const uint32_t ${selectExport.optionCountName} = ${selectExport.options.length};`)
  })
  imageExports.forEach(imageExport => {
    lines.push(`static lv_obj_t * ${imageExport.objectName} = NULL;`)
    lines.push(`static const void * ${imageExport.sourceName} = NULL;`)
  })
  boxExports.forEach(boxExport => {
    lines.push(`static lv_obj_t * ${boxExport.objectName} = NULL;`)
    lines.push(`static bool ${boxExport.visibleName} = true;`)
  })
  iconButtonExports.forEach(iconButtonExport => {
    lines.push(`static lv_obj_t * ${iconButtonExport.objectName} = NULL;`)
    lines.push(`static bool ${iconButtonExport.enabledName} = ${iconButtonExport.initialEnabled ? 'true' : 'false'};`)
  })
  arcExports.forEach(arcExport => {
    lines.push(`static lv_obj_t * ${arcExport.objectName} = NULL;`)
    lines.push(`static int32_t ${arcExport.stateName} = ${arcExport.initialValue};`)
    lines.push(`static const int32_t ${arcExport.minimumName} = ${arcExport.minimum};`)
    lines.push(`static const int32_t ${arcExport.maximumName} = ${arcExport.maximum};`)
  })
  chartExports.forEach(chartExport => {
    lines.push(`static lv_obj_t * ${chartExport.objectName} = NULL;`)
    lines.push(`static lv_chart_series_t * ${chartExport.seriesName} = NULL;`)
    lines.push(`static const int32_t ${chartExport.minimumName} = ${chartExport.minimum};`)
    lines.push(`static const int32_t ${chartExport.maximumName} = ${chartExport.maximum};`)
  })
  keyboardExports.forEach(keyboardExport => {
    lines.push(`static lv_obj_t * ${keyboardExport.objectName} = NULL;`)
  })
  calendarExports.forEach(calendarExport => {
    lines.push(`static lv_obj_t * ${calendarExport.objectName} = NULL;`)
    lines.push(`static lv_calendar_date_t ${calendarExport.selectedDateName} = {0};`)
  })
  rollerExports.forEach(rollerExport => {
    lines.push(`static lv_obj_t * ${rollerExport.objectName} = NULL;`)
    lines.push(`static uint32_t ${rollerExport.selectedIndexName} = ${rollerExport.initialIndex};`)
    lines.push(`static const uint32_t ${rollerExport.optionCountName} = ${rollerExport.options.length};`)
  })
  if (messageBoxExports.size > 0) {
    lines.push(`typedef void (*fg_message_button_hook_t)(uint32_t index, const char * text);`)
    lines.push(`typedef struct { uint32_t index; const char * text; fg_message_button_hook_t hook; } fg_message_button_event_data_t;`)
  }
  messageBoxExports.forEach(messageExport => {
    lines.push(`static lv_obj_t * ${messageExport.objectName} = NULL;`)
    lines.push(`static bool ${messageExport.visibleName} = true;`)
    messageExport.buttons.forEach((buttonText, buttonIndex) => {
      lines.push(`static const fg_message_button_event_data_t ${messageExport.buttonDataNames[buttonIndex]} = { ${buttonIndex}, "${esc(buttonText)}", ${messageExport.buttonHookName} };`)
    })
  })
  buttonMatrixExports.forEach(matrixExport => {
    lines.push(`static lv_obj_t * ${matrixExport.objectName} = NULL;`)
    lines.push(`static uint32_t ${matrixExport.selectedIndexName} = ${matrixExport.initialIndex};`)
    lines.push(`static const uint32_t ${matrixExport.buttonCountName} = ${matrixExport.buttonLabels.length};`)
  })
  tabViewExports.forEach(tabViewExport => {
    lines.push(`static lv_obj_t * ${tabViewExport.objectName} = NULL;`)
    lines.push(`static uint32_t ${tabViewExport.selectedIndexName} = ${tabViewExport.initialIndex};`)
    lines.push(`static const uint32_t ${tabViewExport.tabCountName} = ${tabViewExport.tabCount};`)
  })
  tileViewExports.forEach(tileViewExport => {
    lines.push(`static lv_obj_t * ${tileViewExport.objectName} = NULL;`)
    lines.push(`static lv_obj_t * ${tileViewExport.tilesName}[${tileViewExport.columnCount}][${tileViewExport.rowCount}] = {{NULL, NULL}, {NULL, NULL}};`)
    lines.push(`static uint32_t ${tileViewExport.selectedColumnName} = ${tileViewExport.initialColumn};`)
    lines.push(`static uint32_t ${tileViewExport.selectedRowName} = ${tileViewExport.initialRow};`)
    lines.push(`static const uint32_t ${tileViewExport.columnCountName} = ${tileViewExport.columnCount};`)
    lines.push(`static const uint32_t ${tileViewExport.rowCountName} = ${tileViewExport.rowCount};`)
  })
  inputExports.forEach(inputExport => {
    lines.push(`static lv_obj_t * ${inputExport.objectName} = NULL;`)
    lines.push(`static bool ${inputExport.programmaticUpdateName} = false;`)
  })
  switchExports.forEach(switchExport => {
    lines.push(`static lv_obj_t * ${switchExport.objectName} = NULL;`)
    lines.push(`static bool ${switchExport.programmaticUpdateName} = false;`)
  })
  checkboxExports.forEach(checkboxExport => {
    lines.push(`static lv_obj_t * ${checkboxExport.objectName} = NULL;`)
    lines.push(`static bool ${checkboxExport.programmaticUpdateName} = false;`)
  })
  radioExports.forEach(radioExport => {
    lines.push(`static lv_obj_t * ${radioExport.objectName} = NULL;`)
    lines.push(`static bool ${radioExport.programmaticUpdateName} = false;`)
  })
  lines.push(`static lv_obj_t * fg_system_wifi_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_state_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_ssid_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_ip_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_gateway_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_rssi_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_security_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_raw_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_scan_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_network_container = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_network_empty_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_network_rows[FG_WIFI_MAX_SCAN] = {0};`)
  lines.push(`static lv_obj_t * fg_system_wifi_network_labels[FG_WIFI_MAX_SCAN] = {0};`)
  lines.push(`static lv_obj_t * fg_system_wifi_scan_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_disconnect_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_reconnect_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_forget_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_details_card = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_details_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_password_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_password_input = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_password_title = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_password_error = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_keyboard = NULL;`)
  lines.push(`static lv_obj_t * fg_system_wifi_forget_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_summary = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_path = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_list = NULL;`)
  lines.push(`#define FG_STORAGE_VISIBLE_ROWS 8`)
  lines.push(`#define FG_STORAGE_WORKER_STACK 4096`)
  lines.push(`static lv_obj_t * fg_system_storage_rows[FG_STORAGE_VISIBLE_ROWS] = {0};`)
  lines.push(`static lv_obj_t * fg_system_storage_row_labels[FG_STORAGE_VISIBLE_ROWS] = {0};`)
  lines.push(`static lv_obj_t * fg_system_storage_name_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_name_input = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_name_title = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_name_error = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_empty = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_parent_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_rename_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_refresh_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_test_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_text = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_format_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_format_input = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_format_error = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_previous_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_next_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_select_folder_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_select_folder_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_button = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_dialog = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_text = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_input = NULL;`)
  lines.push(`static lv_obj_t * fg_system_storage_delete_folder_error = NULL;`)
  lines.push(`typedef enum { FG_STORAGE_REQ_REFRESH, FG_STORAGE_REQ_MOUNT, FG_STORAGE_REQ_UNMOUNT, FG_STORAGE_REQ_TEST, FG_STORAGE_REQ_CREATE, FG_STORAGE_REQ_RENAME, FG_STORAGE_REQ_DELETE, FG_STORAGE_REQ_FORMAT, FG_STORAGE_REQ_DELETE_EMPTY_FOLDER } fg_storage_request_kind_t;`)
  lines.push(`typedef struct { fg_storage_request_kind_t kind; char path[FG_SD_MAX_PATH]; char name[FG_SD_MAX_NAME]; } fg_storage_request_t;`)
  lines.push(`typedef struct { uint32_t generation; fg_storage_request_kind_t kind; fg_sd_result_t result; fg_sd_snapshot_t snapshot; fg_sd_directory_t directory; fg_sd_delete_folder_result_t delete_folder_result; } fg_storage_result_model_t;`)
  lines.push(`static QueueHandle_t fg_system_storage_queue = NULL;`)
  lines.push(`static SemaphoreHandle_t fg_system_storage_mutex = NULL;`)
  lines.push(`static TaskHandle_t fg_system_storage_task = NULL;`)
  lines.push(`static lv_timer_t * fg_system_storage_timer = NULL;`)
  lines.push(`static fg_storage_result_model_t fg_system_storage_result = {0};`)
  lines.push(`static fg_storage_result_model_t fg_system_storage_projection = {0};`)
  lines.push(`static uint32_t fg_system_storage_consumed_generation = 0;`)
  lines.push(`static bool fg_system_storage_pending = false;`)
  lines.push(`static bool fg_system_storage_available = false;`)
  lines.push(`static bool fg_system_storage_initialized = false;`)
  lines.push(`static char fg_system_storage_current_path[FG_SD_MAX_PATH] = "";`)
  lines.push(`static size_t fg_system_storage_page_offset = 0;`)
  lines.push(`static int fg_system_storage_selected = -1;`)
  lines.push(`static bool fg_system_storage_select_mode = false;`)
  lines.push(`typedef struct { int visible_row; size_t entry_index; bool valid; bool is_directory; bool is_empty; char name[FG_SD_MAX_NAME]; } fg_storage_row_metadata_t;`)
  lines.push(`static fg_storage_row_metadata_t fg_system_storage_row_metadata[FG_STORAGE_VISIBLE_ROWS] = {0};`)
  lines.push(`static bool fg_system_storage_name_is_rename = false;`)
  lines.push(`static lv_obj_t * fg_system_root = NULL;`)
  lines.push(`static fg_wifi_network_t fg_system_wifi_networks[FG_WIFI_MAX_SCAN];`)
  lines.push(`static int fg_system_wifi_network_count = 0;`)
  lines.push(`static int fg_system_wifi_selected = -1;`)
  lines.push(`static bool fg_system_wifi_remember = true;`)
  lines.push(`static bool fg_system_wifi_page_active = false;`)
  lines.push(`static uint8_t fg_system_brightness_percent = 100;`)
  lines.push(`static void fg_wifi_tick_cb(lv_timer_t *timer);`)
  lines.push(`static void fg_keyboard_hide(void);`)
  lines.push(`static void fg_keyboard_show_for(lv_obj_t * textarea);`)
  lines.push(`static void fg_keyboard_event_cb(lv_event_t * event);`)
  lines.push(`static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height);`)
  lines.push(`static bool fg_system_storage_create_page(void);`)
  lines.push(`static bool fg_system_storage_create_name_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_delete_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_format_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_delete_folder_dialog(void);`)
  lines.push(`static void fg_system_storage_worker(void * arg);`)
  lines.push(`static void fg_system_storage_tick_cb(lv_timer_t * timer);`)
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

  ledExports.forEach(ledExport => {
    lines.push(`void ${ledExport.apiName}(bool on)`)
    lines.push(`{`)
    lines.push(`    if (${ledExport.objectName} == NULL || ${ledExport.stateName} == on) return;`)
    lines.push(`    ${ledExport.stateName} = on;`)
    lines.push(`    if (on) lv_led_on(${ledExport.objectName}); else lv_led_off(${ledExport.objectName});`)
    lines.push(`    ${ledExport.hookName}(on);`)
    lines.push(`}`)
    lines.push(``)
  })

  boxExports.forEach(boxExport => {
    lines.push(`void ${boxExport.apiName}(bool visible)`)
    lines.push(`{`)
    lines.push(`    if (${boxExport.objectName} == NULL || ${boxExport.visibleName} == visible) return;`)
    lines.push(`    if (visible) lv_obj_clear_flag(${boxExport.objectName}, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`    else lv_obj_add_flag(${boxExport.objectName}, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`    ${boxExport.visibleName} = visible;`)
    lines.push(`}`)
    lines.push(``)
  })

  imageExports.forEach(imageExport => {
    lines.push(`void ${imageExport.apiName}(const void * src)`)
    lines.push(`{`)
    lines.push(`    if (${imageExport.objectName} == NULL || src == NULL || ${imageExport.sourceName} == src) return;`)
    lines.push(`    lv_image_set_src(${imageExport.objectName}, src);`)
    lines.push(`    ${imageExport.sourceName} = src;`)
    lines.push(`}`)
    lines.push(``)
  })

  iconButtonExports.forEach(iconButtonExport => {
    lines.push(`static void ${iconButtonExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    if (${iconButtonExport.objectName} == NULL || !${iconButtonExport.enabledName}) return;`)
    lines.push(`    ${iconButtonExport.hookName}();`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${iconButtonExport.apiName}(bool enabled)`)
    lines.push(`{`)
    lines.push(`    if (${iconButtonExport.objectName} == NULL || ${iconButtonExport.enabledName} == enabled) return;`)
    lines.push(`    ${iconButtonExport.enabledName} = enabled;`)
    lines.push(`    if (enabled) lv_obj_clear_state(${iconButtonExport.objectName}, LV_STATE_DISABLED);`)
    lines.push(`    else lv_obj_add_state(${iconButtonExport.objectName}, LV_STATE_DISABLED);`)
    lines.push(`}`)
    lines.push(``)
  })

  selectExports.forEach(selectExport => {
    lines.push(`static void ${selectExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * select = lv_event_get_current_target(event);`)
    lines.push(`    if (select != ${selectExport.objectName} || ${selectExport.programmaticUpdateName} || ${selectExport.optionCountName} == 0) return;`)
    lines.push(`    uint32_t index = lv_dropdown_get_selected(select);`)
    lines.push(`    if (index >= ${selectExport.optionCountName} || index == ${selectExport.selectedIndexName}) return;`)
    lines.push(`    ${selectExport.selectedIndexName} = index;`)
    lines.push(`    char selected_text[${selectExport.textBufferSize}];`)
    lines.push(`    lv_dropdown_get_selected_str(select, selected_text, sizeof(selected_text));`)
    lines.push(`    ${selectExport.hookName}(index, selected_text);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${selectExport.apiName}(uint32_t index)`)
    lines.push(`{`)
    lines.push(`    if (${selectExport.objectName} == NULL || ${selectExport.optionCountName} == 0) return;`)
    lines.push(`    if (index >= ${selectExport.optionCountName}) index = ${selectExport.optionCountName} - 1;`)
    lines.push(`    if (lv_dropdown_get_selected(${selectExport.objectName}) == index) {`)
    lines.push(`        ${selectExport.selectedIndexName} = index;`)
    lines.push(`        return;`)
    lines.push(`    }`)
    lines.push(`    ${selectExport.programmaticUpdateName} = true;`)
    lines.push(`    ${selectExport.selectedIndexName} = index;`)
    lines.push(`    lv_dropdown_set_selected(${selectExport.objectName}, index);`)
    lines.push(`    ${selectExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  if (numberInputExports.size > 0) {
    lines.push(`static bool fg_number_input_parse_value(const char * text, int32_t * value)`)
    lines.push(`{`)
    lines.push(`    if (text == NULL || value == NULL) return false;`)
    lines.push(`    char * end = NULL;`)
    lines.push(`    long parsed = strtol(text, &end, 10);`)
    lines.push(`    if (end == text) return false;`)
    lines.push(`    while (*end == ' ' || *end == '\\t' || *end == '\\r' || *end == '\\n') end++;`)
    lines.push(`    if (*end != '\\0' || parsed < INT32_MIN || parsed > INT32_MAX) return false;`)
    lines.push(`    *value = (int32_t)parsed;`)
    lines.push(`    return true;`)
    lines.push(`}`)
    lines.push(``)
  }

  numberInputExports.forEach(numberInputExport => {
    lines.push(`static void ${numberInputExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * number_input = lv_event_get_current_target(event);`)
    lines.push(`    if (number_input != ${numberInputExport.objectName} || ${numberInputExport.programmaticUpdateName}) return;`)
    lines.push(`    int32_t value = 0;`)
    lines.push(`    if (!fg_number_input_parse_value(lv_textarea_get_text(number_input), &value)) return;`)
    lines.push(`    int32_t requested_value = value;`)
    lines.push(`    if (value < ${numberInputExport.minimumName}) value = ${numberInputExport.minimumName};`)
    lines.push(`    if (value > ${numberInputExport.maximumName}) value = ${numberInputExport.maximumName};`)
    lines.push(`    if (requested_value != value) {`)
    lines.push(`        char value_text[16];`)
    lines.push(`        snprintf(value_text, sizeof(value_text), "%ld", (long)value);`)
    lines.push(`        ${numberInputExport.programmaticUpdateName} = true;`)
    lines.push(`        lv_textarea_set_text(number_input, value_text);`)
    lines.push(`        ${numberInputExport.programmaticUpdateName} = false;`)
    lines.push(`    }`)
    lines.push(`    if (${numberInputExport.stateName} == value) return;`)
    lines.push(`    ${numberInputExport.stateName} = value;`)
    lines.push(`    ${numberInputExport.hookName}(value);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${numberInputExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${numberInputExport.minimumName}) value = ${numberInputExport.minimumName};`)
    lines.push(`    if (value > ${numberInputExport.maximumName}) value = ${numberInputExport.maximumName};`)
    lines.push(`    if (${numberInputExport.objectName} == NULL) return;`)
    lines.push(`    int32_t current_value = 0;`)
    lines.push(`    if (fg_number_input_parse_value(lv_textarea_get_text(${numberInputExport.objectName}), &current_value) && current_value == value) return;`)
    lines.push(`    char value_text[16];`)
    lines.push(`    snprintf(value_text, sizeof(value_text), "%ld", (long)value);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = true;`)
    lines.push(`    ${numberInputExport.stateName} = value;`)
    lines.push(`    lv_textarea_set_text(${numberInputExport.objectName}, value_text);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  barExports.forEach(barExport => {
    lines.push(`void ${barExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${barExport.minimumName}) value = ${barExport.minimumName};`)
    lines.push(`    if (value > ${barExport.maximumName}) value = ${barExport.maximumName};`)
    lines.push(`    if (${barExport.objectName} == NULL || ${barExport.stateName} == value) return;`)
    lines.push(`    lv_bar_set_value(${barExport.objectName}, value, LV_ANIM_OFF);`)
    lines.push(`    ${barExport.stateName} = value;`)
    lines.push(`    ${barExport.hookName}(value);`)
    lines.push(`}`)
    lines.push(``)
  })

  progressExports.forEach(progressExport => {
    lines.push(`void ${progressExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${progressExport.minimumName}) value = ${progressExport.minimumName};`)
    lines.push(`    if (value > ${progressExport.maximumName}) value = ${progressExport.maximumName};`)
    lines.push(`    if (${progressExport.objectName} == NULL || ${progressExport.stateName} == value) return;`)
    lines.push(`    lv_bar_set_value(${progressExport.objectName}, value, LV_ANIM_OFF);`)
    lines.push(`    ${progressExport.stateName} = value;`)
    lines.push(`}`)
    lines.push(``)
  })

  arcExports.forEach(arcExport => {
    lines.push(`void ${arcExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${arcExport.minimumName}) value = ${arcExport.minimumName};`)
    lines.push(`    if (value > ${arcExport.maximumName}) value = ${arcExport.maximumName};`)
    lines.push(`    if (${arcExport.objectName} == NULL || ${arcExport.stateName} == value) return;`)
    lines.push(`    lv_arc_set_value(${arcExport.objectName}, value);`)
    lines.push(`    ${arcExport.stateName} = value;`)
    lines.push(`    ${arcExport.hookName}(value);`)
    lines.push(`}`)
    lines.push(``)
  })

  inputExports.forEach(inputExport => {
    lines.push(`static void ${inputExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * input = lv_event_get_current_target(event);`)
    lines.push(`    if (input != ${inputExport.objectName} || ${inputExport.programmaticUpdateName}) return;`)
    lines.push(`    ${inputExport.hookName}(lv_textarea_get_text(input));`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${inputExport.apiName}(const char * text)`)
    lines.push(`{`)
    lines.push(`    if (${inputExport.objectName} == NULL) return;`)
    lines.push(`    if (text == NULL) text = "";`)
    lines.push(`    if (strcmp(lv_textarea_get_text(${inputExport.objectName}), text) == 0) return;`)
    lines.push(`    ${inputExport.programmaticUpdateName} = true;`)
    lines.push(`    lv_textarea_set_text(${inputExport.objectName}, text);`)
    lines.push(`    ${inputExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  ;[...switchExports.values(), ...checkboxExports.values()].forEach(checkedExport => {
    const eventObjectName = checkedExport.objectName.endsWith('_switch')
      ? 'switch_object'
      : 'checkbox_object'
    lines.push(`static void ${checkedExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * ${eventObjectName} = lv_event_get_current_target(event);`)
    lines.push(`    if (${eventObjectName} != ${checkedExport.objectName} || ${checkedExport.programmaticUpdateName}) return;`)
    lines.push(`    bool checked = lv_obj_has_state(${eventObjectName}, LV_STATE_CHECKED);`)
    lines.push(`    ${checkedExport.hookName}(checked);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${checkedExport.apiName}(bool checked)`)
    lines.push(`{`)
    lines.push(`    if (${checkedExport.objectName} == NULL) return;`)
    lines.push(`    bool current_checked = lv_obj_has_state(${checkedExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    if (current_checked == checked) return;`)
    lines.push(`    ${checkedExport.programmaticUpdateName} = true;`)
    lines.push(`    if (checked) {`)
    lines.push(`        lv_obj_add_state(${checkedExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    } else {`)
    lines.push(`        lv_obj_remove_state(${checkedExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    }`)
    lines.push(`    ${checkedExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  radioExports.forEach(radioExport => {
    lines.push(`static void ${radioExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * radio_object = lv_event_get_current_target(event);`)
    lines.push(`    if (radio_object != ${radioExport.objectName} || ${radioExport.programmaticUpdateName}) return;`)
    lines.push(`    bool selected = lv_obj_has_state(radio_object, LV_STATE_CHECKED);`)
    lines.push(`    ${radioExport.hookName}(selected);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${radioExport.apiName}(bool selected)`)
    lines.push(`{`)
    lines.push(`    if (${radioExport.objectName} == NULL) return;`)
    lines.push(`    bool current_selected = lv_obj_has_state(${radioExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    if (current_selected == selected) return;`)
    lines.push(`    ${radioExport.programmaticUpdateName} = true;`)
    lines.push(`    if (selected) {`)
    lines.push(`        lv_obj_add_state(${radioExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    } else {`)
    lines.push(`        lv_obj_remove_state(${radioExport.objectName}, LV_STATE_CHECKED);`)
    lines.push(`    }`)
    lines.push(`    ${radioExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  chartExports.forEach(chartExport => {
    lines.push(`void ${chartExport.addApiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (${chartExport.objectName} == NULL || ${chartExport.seriesName} == NULL) return;`)
    lines.push(`    if (value < ${chartExport.minimumName}) value = ${chartExport.minimumName};`)
    lines.push(`    if (value > ${chartExport.maximumName}) value = ${chartExport.maximumName};`)
    lines.push(`    lv_chart_set_next_value(${chartExport.objectName}, ${chartExport.seriesName}, value);`)
    lines.push(`    ${chartExport.pointAddedHookName}(value);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${chartExport.clearApiName}(void)`)
    lines.push(`{`)
    lines.push(`    if (${chartExport.objectName} == NULL || ${chartExport.seriesName} == NULL) return;`)
    lines.push(`    lv_chart_set_all_value(${chartExport.objectName}, ${chartExport.seriesName}, LV_CHART_POINT_NONE);`)
    lines.push(`    ${chartExport.clearedHookName}();`)
    lines.push(`}`)
    lines.push(``)
  })

  if (keyboardExports.size > 0) {
    lines.push(`static bool fg_component_keyboard_set_visible(lv_obj_t * keyboard, bool visible)`)
    lines.push(`{`)
    lines.push(`    if (keyboard == NULL) return false;`)
    lines.push(`    bool hidden = lv_obj_has_flag(keyboard, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`    if (visible) {`)
    lines.push(`        if (!hidden) return false;`)
    lines.push(`        lv_obj_clear_flag(keyboard, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`        lv_obj_move_foreground(keyboard);`)
    lines.push(`        return true;`)
    lines.push(`    }`)
    lines.push(`    if (hidden) return false;`)
    lines.push(`    lv_keyboard_set_textarea(keyboard, NULL);`)
    lines.push(`    lv_obj_add_flag(keyboard, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`    return true;`)
    lines.push(`}`)
    lines.push(``)
  }

  keyboardExports.forEach(keyboardExport => {
    lines.push(`void ${keyboardExport.showApiName}(void)`)
    lines.push(`{`)
    lines.push(`    if (fg_component_keyboard_set_visible(${keyboardExport.objectName}, true)) {`)
    lines.push(`        ${keyboardExport.shownHookName}();`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${keyboardExport.hideApiName}(void)`)
    lines.push(`{`)
    lines.push(`    if (fg_component_keyboard_set_visible(${keyboardExport.objectName}, false)) {`)
    lines.push(`        ${keyboardExport.hiddenHookName}();`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
  })

  if (calendarExports.size > 0) {
    lines.push(`static bool fg_calendar_date_is_valid(uint16_t year, uint8_t month, uint8_t day)`)
    lines.push(`{`)
    lines.push(`    if (year == 0 || month < 1 || month > 12 || day < 1) return false;`)
    lines.push(`    static const uint8_t days_per_month[] = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };`)
    lines.push(`    uint8_t maximum_day = days_per_month[month - 1];`)
    lines.push(`    if (month == 2 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)) maximum_day = 29;`)
    lines.push(`    return day <= maximum_day;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static bool fg_calendar_apply_date(lv_obj_t * calendar, lv_calendar_date_t * selected_date, uint16_t year, uint8_t month, uint8_t day)`)
    lines.push(`{`)
    lines.push(`    if (calendar == NULL || !fg_calendar_date_is_valid(year, month, day)) return false;`)
    lines.push(`    if (selected_date->year == year && selected_date->month == month && selected_date->day == day) return false;`)
    lines.push(`    selected_date->year = year;`)
    lines.push(`    selected_date->month = month;`)
    lines.push(`    selected_date->day = day;`)
    lines.push(`    lv_calendar_set_showed_date(calendar, year, month);`)
    lines.push(`    lv_calendar_set_highlighted_dates(calendar, selected_date, 1);`)
    lines.push(`    return true;`)
    lines.push(`}`)
    lines.push(``)
  }

  calendarExports.forEach(calendarExport => {
    lines.push(`static void ${calendarExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_calendar_date_t date;`)
    lines.push(`    lv_obj_t * calendar = lv_event_get_current_target(event);`)
    lines.push(`    if (lv_calendar_get_pressed_date(calendar, &date) != LV_RESULT_OK) return;`)
    lines.push(`    if (fg_calendar_apply_date(calendar, &${calendarExport.selectedDateName}, date.year, date.month, date.day)) {`)
    lines.push(`        ${calendarExport.hookName}((uint16_t)date.year, (uint8_t)date.month, (uint8_t)date.day);`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${calendarExport.apiName}(uint16_t year, uint8_t month, uint8_t day)`)
    lines.push(`{`)
    lines.push(`    if (fg_calendar_apply_date(${calendarExport.objectName}, &${calendarExport.selectedDateName}, year, month, day)) {`)
    lines.push(`        ${calendarExport.hookName}(year, month, day);`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
  })

  rollerExports.forEach(rollerExport => {
    lines.push(`static void ${rollerExport.transitionName}(uint32_t index, bool update_widget)`)
    lines.push(`{`)
    lines.push(`    if (${rollerExport.objectName} == NULL || ${rollerExport.optionCountName} == 0) return;`)
    lines.push(`    if (index >= ${rollerExport.optionCountName}) index = ${rollerExport.optionCountName} - 1;`)
    lines.push(`    if (index == ${rollerExport.selectedIndexName}) return;`)
    lines.push(`    ${rollerExport.selectedIndexName} = index;`)
    lines.push(`    if (update_widget) lv_roller_set_selected(${rollerExport.objectName}, index, LV_ANIM_OFF);`)
    lines.push(`    char selected_text[${rollerExport.textBufferSize}];`)
    lines.push(`    lv_roller_get_selected_str(${rollerExport.objectName}, selected_text, sizeof(selected_text));`)
    lines.push(`    ${rollerExport.hookName}(index, selected_text);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${rollerExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * roller = lv_event_get_current_target(event);`)
    lines.push(`    if (roller != ${rollerExport.objectName}) return;`)
    lines.push(`    ${rollerExport.transitionName}(lv_roller_get_selected(roller), false);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${rollerExport.apiName}(uint32_t index)`)
    lines.push(`{`)
    lines.push(`    ${rollerExport.transitionName}(index, true);`)
    lines.push(`}`)
    lines.push(``)
  })

  if (messageBoxExports.size > 0) {
    lines.push(`static bool fg_message_box_set_visible(lv_obj_t * message_box, bool * current_visibility, bool visible)`)
    lines.push(`{`)
    lines.push(`    if (message_box == NULL || current_visibility == NULL || *current_visibility == visible) return false;`)
    lines.push(`    *current_visibility = visible;`)
    lines.push(`    if (visible) {`)
    lines.push(`        lv_obj_clear_flag(message_box, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`        lv_obj_move_foreground(message_box);`)
    lines.push(`    } else {`)
    lines.push(`        lv_obj_add_flag(message_box, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`    }`)
    lines.push(`    return true;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void fg_message_button_clicked_cb(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    const fg_message_button_event_data_t * data = lv_event_get_user_data(event);`)
    lines.push(`    if (data == NULL || data->hook == NULL) return;`)
    lines.push(`    data->hook(data->index, data->text);`)
    lines.push(`}`)
    lines.push(``)
  }
  messageBoxExports.forEach(messageExport => {
    lines.push(`void ${messageExport.showApiName}(void)`)
    lines.push(`{`)
    lines.push(`    if (fg_message_box_set_visible(${messageExport.objectName}, &${messageExport.visibleName}, true)) {`)
    lines.push(`        ${messageExport.shownHookName}();`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${messageExport.closeApiName}(void)`)
    lines.push(`{`)
    lines.push(`    if (fg_message_box_set_visible(${messageExport.objectName}, &${messageExport.visibleName}, false)) {`)
    lines.push(`        ${messageExport.closedHookName}();`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
  })

  buttonMatrixExports.forEach(matrixExport => {
    lines.push(`static void ${matrixExport.transitionName}(uint32_t button_index, bool update_widget)`)
    lines.push(`{`)
    lines.push(`    if (${matrixExport.objectName} == NULL || ${matrixExport.buttonCountName} == 0) return;`)
    lines.push(`    if (button_index >= ${matrixExport.buttonCountName}) button_index = ${matrixExport.buttonCountName} - 1;`)
    lines.push(`    if (lv_buttonmatrix_has_button_ctrl(${matrixExport.objectName}, button_index, LV_BUTTONMATRIX_CTRL_DISABLED)) return;`)
    lines.push(`    if (button_index == ${matrixExport.selectedIndexName}) return;`)
    lines.push(`    ${matrixExport.selectedIndexName} = button_index;`)
    lines.push(`    if (update_widget) {`)
    lines.push(`        lv_buttonmatrix_set_selected_button(${matrixExport.objectName}, button_index);`)
    if (matrixExport.oneCheck) {
      lines.push(`        lv_buttonmatrix_clear_button_ctrl_all(${matrixExport.objectName}, LV_BUTTONMATRIX_CTRL_CHECKED);`)
      lines.push(`        lv_buttonmatrix_set_button_ctrl(${matrixExport.objectName}, button_index, LV_BUTTONMATRIX_CTRL_CHECKED);`)
    }
    lines.push(`    }`)
    lines.push(`    const char * text = lv_buttonmatrix_get_button_text(${matrixExport.objectName}, button_index);`)
    lines.push(`    ${matrixExport.hookName}(button_index, text);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${matrixExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * matrix = lv_event_get_current_target(event);`)
    lines.push(`    if (matrix != ${matrixExport.objectName}) return;`)
    lines.push(`    ${matrixExport.transitionName}(lv_buttonmatrix_get_selected_button(matrix), false);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${matrixExport.apiName}(uint32_t button_index)`)
    lines.push(`{`)
    lines.push(`    ${matrixExport.transitionName}(button_index, true);`)
    lines.push(`}`)
    lines.push(``)
  })

  tabViewExports.forEach(tabViewExport => {
    lines.push(`static void ${tabViewExport.transitionName}(uint32_t tab_index, bool update_widget)`)
    lines.push(`{`)
    lines.push(`    if (${tabViewExport.objectName} == NULL || ${tabViewExport.tabCountName} == 0) return;`)
    lines.push(`    if (tab_index >= ${tabViewExport.tabCountName}) tab_index = ${tabViewExport.tabCountName} - 1;`)
    lines.push(`    if (tab_index == ${tabViewExport.selectedIndexName}) return;`)
    lines.push(`    ${tabViewExport.selectedIndexName} = tab_index;`)
    lines.push(`    if (update_widget) lv_tabview_set_active(${tabViewExport.objectName}, tab_index, LV_ANIM_OFF);`)
    lines.push(`    ${tabViewExport.hookName}(tab_index);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${tabViewExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * tabview = lv_event_get_current_target(event);`)
    lines.push(`    if (tabview != ${tabViewExport.objectName}) return;`)
    lines.push(`    ${tabViewExport.transitionName}(lv_tabview_get_tab_active(tabview), false);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tabViewExport.apiName}(uint32_t tab_index)`)
    lines.push(`{`)
    lines.push(`    ${tabViewExport.transitionName}(tab_index, true);`)
    lines.push(`}`)
    lines.push(``)
  })

  tileViewExports.forEach(tileViewExport => {
    lines.push(`static void ${tileViewExport.transitionName}(uint32_t column, uint32_t row, bool update_widget)`)
    lines.push(`{`)
    lines.push(`    (void)update_widget;`)
    lines.push(`    if (${tileViewExport.objectName} == NULL || ${tileViewExport.columnCountName} == 0 || ${tileViewExport.rowCountName} == 0) return;`)
    lines.push(`    if (column >= ${tileViewExport.columnCountName}) column = ${tileViewExport.columnCountName} - 1;`)
    lines.push(`    if (row >= ${tileViewExport.rowCountName}) row = ${tileViewExport.rowCountName} - 1;`)
    lines.push(`    if (column == ${tileViewExport.selectedColumnName} && row == ${tileViewExport.selectedRowName}) return;`)
    lines.push(`    lv_obj_t * tile = ${tileViewExport.tilesName}[column][row];`)
    lines.push(`    if (tile == NULL) return;`)
    lines.push(`    lv_obj_t * previous_tile = ${tileViewExport.tilesName}[${tileViewExport.selectedColumnName}][${tileViewExport.selectedRowName}];`)
    lines.push(`    if (previous_tile != NULL) lv_obj_clear_state(previous_tile, LV_STATE_CHECKED);`)
    lines.push(`    ${tileViewExport.selectedColumnName} = column;`)
    lines.push(`    ${tileViewExport.selectedRowName} = row;`)
    lines.push(`    lv_obj_add_state(tile, LV_STATE_CHECKED);`)
    lines.push(`    ${tileViewExport.hookName}(column, row);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${tileViewExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * selected_tile = lv_event_get_current_target(event);`)
    lines.push(`    if (selected_tile == NULL) return;`)
    lines.push(`    for (uint32_t column = 0; column < ${tileViewExport.columnCountName}; ++column) {`)
    lines.push(`        for (uint32_t row = 0; row < ${tileViewExport.rowCountName}; ++row) {`)
    lines.push(`            if (${tileViewExport.tilesName}[column][row] == selected_tile) {`)
    lines.push(`                ${tileViewExport.transitionName}(column, row, false);`)
    lines.push(`                return;`)
    lines.push(`            }`)
    lines.push(`        }`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tileViewExport.apiName}(uint32_t column, uint32_t row)`)
    lines.push(`{`)
    lines.push(`    ${tileViewExport.transitionName}(column, row, true);`)
    lines.push(`}`)
    lines.push(``)
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
  lines.push(`    if (!page || !fg_application_page || !fg_system_launcher_page || !fg_system_brightness_page || !fg_system_wifi_page) return;`)
  lines.push(`    lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_storage_page) lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);`)
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
  lines.push(`    fg_system_wifi_page_active = false;`)
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
  lines.push(`static void fg_system_open_wifi_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_wifi_page_active = true;`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`    fg_system_show_page(fg_system_wifi_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_back_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_wifi_page_active = false;`)
  lines.push(`    fg_system_show_page(fg_system_launcher_page);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_request(fg_storage_request_kind_t kind, const char * path, const char * name)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_pending || !fg_system_storage_page) return false;`)
  lines.push(`    if (!fg_system_storage_mutex) fg_system_storage_mutex = xSemaphoreCreateMutex();`)
  lines.push(`    if (!fg_system_storage_mutex) goto unavailable;`)
  lines.push(`    if (!fg_system_storage_queue) fg_system_storage_queue = xQueueCreate(1, sizeof(fg_storage_request_t));`)
  lines.push(`    if (!fg_system_storage_queue) goto unavailable;`)
  lines.push(`    if (!fg_system_storage_task && xTaskCreate(fg_system_storage_worker, "fg_sd_worker", FG_STORAGE_WORKER_STACK, NULL, 5, &fg_system_storage_task) != pdPASS) goto unavailable;`)
  lines.push(`    if (!fg_system_storage_timer) fg_system_storage_timer = lv_timer_create(fg_system_storage_tick_cb, 100, NULL);`)
  lines.push(`    if (!fg_system_storage_timer) goto unavailable;`)
  lines.push(`    fg_system_storage_available = true;`)
  lines.push(`    fg_storage_request_t request = { .kind = kind };`)
  lines.push(`    snprintf(request.path, sizeof(request.path), "%s", path ? path : "");`)
  lines.push(`    snprintf(request.name, sizeof(request.name), "%s", name ? name : "");`)
  lines.push(`    if (xQueueSend(fg_system_storage_queue, &request, 0) != pdTRUE) return false;`)
  lines.push(`    fg_system_storage_pending = true;`)
  lines.push(`    lv_label_set_text(fg_system_storage_summary, "SD operation running...");`)
  lines.push(`    lv_obj_add_state(fg_system_storage_refresh_button, LV_STATE_DISABLED);`)
  lines.push(`    lv_obj_add_state(fg_system_storage_test_button, LV_STATE_DISABLED);`)
  lines.push(`    if (fg_system_storage_delete_folder_button) lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);`)
  lines.push(`    return true;`)
  lines.push(`unavailable:`)
  lines.push(`    fg_system_storage_available = false;`)
  lines.push(`    if (fg_system_storage_summary) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\\nBack remains available");`)
  lines.push(`    return false;`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_worker(void * arg)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(arg); fg_storage_request_t request;`)
  lines.push(`    for (;;) {`)
  lines.push(`        if (xQueueReceive(fg_system_storage_queue, &request, portMAX_DELAY) != pdTRUE) continue;`)
  lines.push(`        fg_storage_result_model_t next = { .kind = request.kind, .result = FG_SD_OK };`)
  lines.push(`        switch (request.kind) {`)
  lines.push(`            case FG_STORAGE_REQ_MOUNT: next.result = fg_sd_mount(); break;`)
  lines.push(`            case FG_STORAGE_REQ_UNMOUNT: next.result = fg_sd_unmount(); break;`)
  lines.push(`            case FG_STORAGE_REQ_TEST: next.result = fg_sd_run_test(); break;`)
  lines.push(`            case FG_STORAGE_REQ_CREATE: next.result = fg_sd_create_directory(request.path, request.name); break;`)
  lines.push(`            case FG_STORAGE_REQ_RENAME: next.result = fg_sd_rename_entry(request.path, request.name); break;`)
  lines.push(`            case FG_STORAGE_REQ_DELETE: next.result = fg_sd_delete_entry(request.path); break;`)
  lines.push(`            case FG_STORAGE_REQ_FORMAT: next.result = fg_sd_format(); break;`)
  lines.push(`            case FG_STORAGE_REQ_DELETE_EMPTY_FOLDER: next.result = fg_sd_delete_empty_folder(request.path, request.name, &next.delete_folder_result); break;`)
  lines.push(`            default: next.result = fg_sd_refresh(); break;`)
  lines.push(`        }`)
  lines.push(`        (void)fg_sd_get_snapshot(&next.snapshot);`)
  lines.push(`        if (next.snapshot.mounted) {`)
  lines.push(`            fg_sd_result_t list_result = fg_sd_list_directory(request.path, &next.directory);`)
  lines.push(`            if (list_result != FG_SD_OK) (void)fg_sd_list_directory("", &next.directory);`)
  lines.push(`        }`)
  lines.push(`        xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY);`)
  lines.push(`        next.generation = fg_system_storage_result.generation + 1;`)
  lines.push(`        fg_system_storage_result = next;`)
  lines.push(`        xSemaphoreGive(fg_system_storage_mutex);`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_clear_selection(void)`)
  lines.push(`{`)
  lines.push(`    fg_system_storage_selected = -1;`)
  lines.push(`    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) lv_obj_clear_state(fg_system_storage_rows[i], LV_STATE_CHECKED);`)
  lines.push(`    if (fg_system_storage_rename_button) lv_obj_add_state(fg_system_storage_rename_button, LV_STATE_DISABLED);`)
  lines.push(`    if (fg_system_storage_delete_button) lv_obj_add_state(fg_system_storage_delete_button, LV_STATE_DISABLED);`)
  lines.push(`    if (fg_system_storage_delete_folder_button) lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);`)
  lines.push(`    if (fg_system_storage_delete_folder_label) lv_label_set_text(fg_system_storage_delete_folder_label, "Delete Folder");`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_leave_select_mode(void)`)
  lines.push(`{`)
  lines.push(`    fg_system_storage_select_mode = false; fg_system_storage_clear_selection();`)
  lines.push(`    if (fg_system_storage_select_folder_label) lv_label_set_text(fg_system_storage_select_folder_label, "Select Item");`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_tick_cb(lv_timer_t * timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer); if (!fg_system_storage_mutex) return;`)
  lines.push(`    xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); fg_system_storage_projection = fg_system_storage_result; xSemaphoreGive(fg_system_storage_mutex);`)
  lines.push(`    fg_storage_result_model_t * model_ptr = &fg_system_storage_projection;`)
  lines.push(`    #define model (*model_ptr)`)
  lines.push(`    if (model.generation == fg_system_storage_consumed_generation) return;`)
  lines.push(`    fg_system_storage_consumed_generation = model.generation; fg_system_storage_pending = false;`)
  lines.push(`    lv_obj_clear_state(fg_system_storage_refresh_button, LV_STATE_DISABLED);`)
  lines.push(`    if (model.snapshot.mounted) lv_obj_clear_state(fg_system_storage_test_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_test_button, LV_STATE_DISABLED);`)
  lines.push(`    snprintf(fg_system_storage_current_path, sizeof(fg_system_storage_current_path), "%s", model.directory.path[0] == '/' ? model.directory.path + 1 : model.directory.path);`)
  lines.push(`    lv_label_set_text_fmt(fg_system_storage_summary, "%s | %s | %s\\nTotal %llu MB  Used %llu MB  Free %llu MB\\n%s",`)
  lines.push(`        model.snapshot.mounted ? "Mounted" : "Not Mounted", model.snapshot.card_type, model.snapshot.filesystem,`)
  lines.push(`        (unsigned long long)(model.snapshot.total_bytes / 1048576), (unsigned long long)(model.snapshot.used_bytes / 1048576),`)
  lines.push(`        (unsigned long long)(model.snapshot.free_bytes / 1048576), model.result == FG_SD_OK ? model.snapshot.status : fg_sd_result_text(model.result));`)
  lines.push(`    lv_label_set_text_fmt(fg_system_storage_path, "/sdcard%s%s", fg_system_storage_current_path[0] ? "/" : "", fg_system_storage_current_path);`)
  lines.push(`    if (fg_system_storage_page_offset >= model.directory.count) fg_system_storage_page_offset = 0;`)
  lines.push(`    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) { fg_system_storage_row_metadata[i].valid = false; lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN); }`)
  lines.push(`    for (size_t i = 0; i < FG_STORAGE_VISIBLE_ROWS && fg_system_storage_page_offset + i < model.directory.count; ++i) {`)
  lines.push(`        fg_sd_entry_t * entry = &model.directory.entries[fg_system_storage_page_offset + i];`)
  lines.push(`        fg_system_storage_row_metadata[i].visible_row = (int)i; fg_system_storage_row_metadata[i].entry_index = fg_system_storage_page_offset + i; fg_system_storage_row_metadata[i].valid = true; fg_system_storage_row_metadata[i].is_directory = entry->is_directory; fg_system_storage_row_metadata[i].is_empty = entry->is_empty; snprintf(fg_system_storage_row_metadata[i].name, sizeof(fg_system_storage_row_metadata[i].name), "%s", entry->name);`)
  lines.push(`        lv_label_set_text_fmt(fg_system_storage_row_labels[i], "%s  %.63s    %s", entry->is_directory ? LV_SYMBOL_DIRECTORY : LV_SYMBOL_FILE, entry->name, entry->is_directory ? "Folder" : "File");`)
  lines.push(`        lv_obj_clear_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    }`)
  lines.push(`    if (fg_system_storage_page_offset == 0) lv_obj_add_state(fg_system_storage_previous_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_storage_previous_button, LV_STATE_DISABLED);`)
  lines.push(`    if (fg_system_storage_page_offset + FG_STORAGE_VISIBLE_ROWS >= model.directory.count) lv_obj_add_state(fg_system_storage_next_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_storage_next_button, LV_STATE_DISABLED);`)
  lines.push(`    if (model.snapshot.mounted && model.directory.count == 0) lv_obj_clear_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN); else lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_storage_current_path[0]) lv_obj_clear_state(fg_system_storage_parent_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_storage_leave_select_mode();`)
  lines.push(`    if (model.result == FG_SD_OK && (model.kind == FG_STORAGE_REQ_CREATE || model.kind == FG_STORAGE_REQ_RENAME)) { fg_keyboard_hide(); if (fg_system_storage_name_dialog) lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, model.kind == FG_STORAGE_REQ_CREATE ? "Folder created" : "Entry renamed"); }`)
  lines.push(`    else if (model.result != FG_SD_OK && (model.kind == FG_STORAGE_REQ_CREATE || model.kind == FG_STORAGE_REQ_RENAME) && fg_system_storage_name_error) lv_label_set_text(fg_system_storage_name_error, fg_sd_result_text(model.result));`)
  lines.push(`    if (model.kind == FG_STORAGE_REQ_DELETE && model.result == FG_SD_OK) { if (fg_system_storage_delete_dialog) lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Entry deleted"); }`)
  lines.push(`    if (model.kind == FG_STORAGE_REQ_FORMAT && fg_system_storage_format_error) { lv_label_set_text(fg_system_storage_format_error, model.result == FG_SD_OK ? "Format complete; card remounted" : fg_sd_result_text(model.result)); if (model.result == FG_SD_OK) { fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Format complete; empty root ready"); } }`)
  lines.push(`    if (model.kind == FG_STORAGE_REQ_DELETE_EMPTY_FOLDER) { if (model.result == FG_SD_OK) { fg_keyboard_hide(); if (fg_system_storage_delete_folder_dialog) lv_obj_add_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_summary, "Folder deleted"); } else if (fg_system_storage_delete_folder_error) lv_label_set_text(fg_system_storage_delete_folder_error, model.result == FG_SD_ERR_NOT_EMPTY ? "Folder is not empty." : fg_sd_result_text(model.result)); }`)
  lines.push(`    #undef model`)
  lines.push(`}`)
  lines.push(`static void fg_system_open_storage_cb(lv_event_t * event) { LV_UNUSED(event); if (!fg_system_storage_initialized && !fg_system_storage_create_page()) return; fg_system_show_page(fg_system_storage_page); if (!fg_system_storage_summary || !fg_system_storage_refresh_button || !fg_system_storage_test_button) return; (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }`)
  lines.push(`static void fg_system_storage_back_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_show_page(fg_system_launcher_page); }`)
  lines.push(`static void fg_system_storage_refresh_cb(lv_event_t * event) { LV_UNUSED(event); fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }`)
  lines.push(`static void fg_system_storage_mount_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_pending) return; fg_system_storage_current_path[0] = 0; fg_system_storage_page_offset = 0; fg_system_storage_clear_selection(); (void)fg_system_storage_request(FG_STORAGE_REQ_MOUNT, "", NULL); }`)
  lines.push(`static void fg_system_storage_unmount_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_pending) return; fg_system_storage_page_offset = 0; fg_system_storage_clear_selection(); (void)fg_system_storage_request(FG_STORAGE_REQ_UNMOUNT, "", NULL); }`)
  lines.push(`static void fg_system_storage_test_cb(lv_event_t * event) { LV_UNUSED(event); (void)fg_system_storage_request(FG_STORAGE_REQ_TEST, fg_system_storage_current_path, NULL); }`)
  lines.push(`static void fg_system_storage_parent_cb(lv_event_t * event) { LV_UNUSED(event); char * slash = strrchr(fg_system_storage_current_path, '/'); if (slash) *slash = 0; else fg_system_storage_current_path[0] = 0; fg_system_storage_page_offset = 0; fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); }`)
  lines.push(`static void fg_system_storage_previous_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_page_offset >= FG_STORAGE_VISIBLE_ROWS) fg_system_storage_page_offset -= FG_STORAGE_VISIBLE_ROWS; else fg_system_storage_page_offset = 0; fg_system_storage_consumed_generation--; fg_system_storage_tick_cb(NULL); }`)
  lines.push(`static void fg_system_storage_next_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_page_offset + FG_STORAGE_VISIBLE_ROWS < fg_system_storage_projection.directory.count) fg_system_storage_page_offset += FG_STORAGE_VISIBLE_ROWS; fg_system_storage_consumed_generation--; fg_system_storage_tick_cb(NULL); }`)
  lines.push(`static void fg_system_storage_row_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    if (lv_event_get_code(event) != LV_EVENT_CLICKED) return;`)
  lines.push(`    const fg_storage_row_metadata_t * metadata = (const fg_storage_row_metadata_t *)lv_event_get_user_data(event); if (!metadata) return;`)
  lines.push(`    int row = metadata->visible_row; if (!metadata->valid || row < 0 || row >= FG_STORAGE_VISIBLE_ROWS || fg_system_storage_pending || lv_obj_has_flag(fg_system_storage_rows[row], LV_OBJ_FLAG_HIDDEN)) return;`)
  lines.push(`    size_t index = metadata->entry_index; if (index != fg_system_storage_page_offset + (size_t)row || index >= fg_system_storage_projection.directory.count) return;`)
  lines.push(`    if (fg_system_storage_select_mode) {`)
  lines.push(`        fg_system_storage_clear_selection(); fg_system_storage_selected = (int)index; lv_obj_add_state(fg_system_storage_rows[row], LV_STATE_CHECKED);`)
  lines.push(`        if (fg_system_storage_delete_folder_label) lv_label_set_text(fg_system_storage_delete_folder_label, "Delete Folder");`)
  lines.push(`        if (metadata->is_directory && metadata->is_empty) lv_obj_clear_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(`    if (!metadata->is_directory) return;`)
  lines.push(`    {`)
  lines.push(`        size_t used = strlen(fg_system_storage_current_path); snprintf(fg_system_storage_current_path + used, sizeof(fg_system_storage_current_path) - used, "%s%s", used ? "/" : "", metadata->name);`)
  lines.push(`        fg_system_storage_page_offset = 0; fg_system_storage_leave_select_mode(); (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); return;`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_select_folder_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event); if (fg_system_storage_select_mode) { fg_system_storage_leave_select_mode(); return; }`)
  lines.push(`    fg_system_storage_clear_selection(); fg_system_storage_select_mode = true;`)
  lines.push(`    if (fg_system_storage_select_folder_label) lv_label_set_text(fg_system_storage_select_folder_label, "Cancel Selection");`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_new_folder_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event); if (!fg_system_storage_create_name_dialog()) return; fg_system_storage_name_is_rename = false; lv_label_set_text(fg_system_storage_name_title, "Create Folder"); lv_label_set_text(fg_system_storage_name_error, ""); lv_textarea_set_text(fg_system_storage_name_input, "");`)
  lines.push(`    lv_obj_clear_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    fg_keyboard_show_for(fg_system_storage_name_input);`)
  lines.push(`}`)
  lines.push(`static void fg_system_storage_rename_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_name_dialog()) return; fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if ((size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); fg_system_storage_name_is_rename = true; lv_label_set_text(fg_system_storage_name_title, "Rename"); lv_label_set_text(fg_system_storage_name_error, ""); lv_textarea_set_text(fg_system_storage_name_input, entry.name); lv_obj_clear_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_name_input); }`)
  lines.push(`static bool fg_system_storage_valid_name(const char * name) { if (!name || !name[0] || !strcmp(name, ".") || !strcmp(name, "..")) return false; bool visible = false; for (const unsigned char * p = (const unsigned char *)name; *p; ++p) { if (*p < 32 || strchr("<>:\\\"/\\\\|?*", *p)) return false; if (*p != ' ' && *p != '\\t') visible = true; } return visible; }`)
  lines.push(`static void fg_system_storage_name_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN); lv_label_set_text(fg_system_storage_name_error, ""); }`)
  lines.push(`static void fg_system_storage_name_commit_cb(lv_event_t * event) { LV_UNUSED(event); const char * name = lv_textarea_get_text(fg_system_storage_name_input); if (!fg_system_storage_valid_name(name)) { lv_label_set_text(fg_system_storage_name_error, "Enter a safe non-empty name"); return; } if (!fg_system_storage_name_is_rename) { (void)fg_system_storage_request(FG_STORAGE_REQ_CREATE, fg_system_storage_current_path, name); return; } fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); char path[FG_SD_MAX_PATH]; snprintf(path, sizeof(path), "%s%s%s", fg_system_storage_current_path, fg_system_storage_current_path[0] ? "/" : "", entry.name); (void)fg_system_storage_request(FG_STORAGE_REQ_RENAME, path, name); }`)
  lines.push(`static void fg_system_storage_delete_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_delete_dialog()) return; fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if ((size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); lv_label_set_text_fmt(fg_system_storage_delete_text, "Permanently delete %s '%s'?\\nNon-empty folders are protected.", entry.is_directory ? "folder" : "file", entry.name); lv_obj_clear_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); }`)
  lines.push(`static void fg_system_storage_delete_cancel_cb(lv_event_t * event) { LV_UNUSED(event); lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN); }`)
  lines.push(`static void fg_system_storage_delete_confirm_cb(lv_event_t * event) { LV_UNUSED(event); fg_sd_entry_t entry; xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_result.directory.count) { xSemaphoreGive(fg_system_storage_mutex); return; } entry = fg_system_storage_result.directory.entries[fg_system_storage_selected]; xSemaphoreGive(fg_system_storage_mutex); char path[FG_SD_MAX_PATH]; snprintf(path, sizeof(path), "%s%s%s", fg_system_storage_current_path, fg_system_storage_current_path[0] ? "/" : "", entry.name); (void)fg_system_storage_request(FG_STORAGE_REQ_DELETE, path, NULL); }`)
  lines.push(`static void fg_system_storage_format_cb(lv_event_t * event) { LV_UNUSED(event); if (!fg_system_storage_create_format_dialog()) return; lv_label_set_text(fg_system_storage_format_error, "SD Card /sdcard: all files will be erased. Type FORMAT."); lv_textarea_set_text(fg_system_storage_format_input, ""); lv_obj_clear_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_format_input); }`)
  lines.push(`static void fg_system_storage_format_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN); }`)
  lines.push(`static void fg_system_storage_format_confirm_cb(lv_event_t * event) { LV_UNUSED(event); if (strcmp(lv_textarea_get_text(fg_system_storage_format_input), "FORMAT")) { lv_label_set_text(fg_system_storage_format_error, "Type FORMAT exactly"); return; } lv_label_set_text(fg_system_storage_format_error, "Preparing to format..."); fg_system_storage_current_path[0] = 0; (void)fg_system_storage_request(FG_STORAGE_REQ_FORMAT, "", NULL); }`)
  lines.push(`static void fg_system_storage_delete_folder_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || !fg_system_storage_create_delete_folder_dialog()) return; fg_sd_entry_t * entry = &fg_system_storage_projection.directory.entries[fg_system_storage_selected]; if (!entry->is_directory || !entry->is_empty) return; lv_label_set_text_fmt(fg_system_storage_delete_folder_text, "Delete folder:\\n%s\\n\\nThis folder must be empty.", entry->name); lv_label_set_text(fg_system_storage_delete_folder_error, "Type DELETE exactly to continue."); lv_textarea_set_text(fg_system_storage_delete_folder_input, ""); lv_obj_clear_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); fg_keyboard_show_for(fg_system_storage_delete_folder_input); }`)
  lines.push(`static void fg_system_storage_delete_folder_cancel_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); if (fg_system_storage_delete_folder_dialog) lv_obj_add_flag(fg_system_storage_delete_folder_dialog, LV_OBJ_FLAG_HIDDEN); }`)
  lines.push(`static void fg_system_storage_delete_folder_confirm_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_selected < 0 || (size_t)fg_system_storage_selected >= fg_system_storage_projection.directory.count) return; if (strcmp(lv_textarea_get_text(fg_system_storage_delete_folder_input), "DELETE")) { lv_label_set_text(fg_system_storage_delete_folder_error, "Type DELETE exactly"); return; } fg_sd_entry_t * entry = &fg_system_storage_projection.directory.entries[fg_system_storage_selected]; if (!entry->is_directory || !entry->is_empty) { lv_label_set_text(fg_system_storage_delete_folder_error, "Folder is not empty."); return; } lv_label_set_text(fg_system_storage_delete_folder_error, "Deleting folder..."); (void)fg_system_storage_request(FG_STORAGE_REQ_DELETE_EMPTY_FOLDER, fg_system_storage_current_path, entry->name); }`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_scan_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    if (fg_wifi_scan_in_progress()) return;`)
  lines.push(`    fg_wifi_scan_start();`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_disconnect_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_wifi_disconnect();`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_reconnect_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    (void)fg_wifi_reconnect();`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_refresh_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    if (!fg_wifi_scan_in_progress()) (void)fg_wifi_scan_start();`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_password_cancel_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_keyboard_hide();`)
  lines.push(`    if (fg_system_wifi_password_input) lv_textarea_set_text(fg_system_wifi_password_input, "");`)
  lines.push(`    if (fg_system_wifi_password_error) lv_label_set_text(fg_system_wifi_password_error, "");`)
  lines.push(`    if (fg_system_wifi_password_dialog) lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_keyboard_hide(void)`)
  lines.push(`{`)
  lines.push(`    if (!fg_system_wifi_keyboard) return;`)
  lines.push(`    lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);`)
  lines.push(`    lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_wifi_password_dialog) {`)
  lines.push(`        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);`)
  lines.push(`        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_keyboard_show_for(lv_obj_t * textarea)`)
  lines.push(`{`)
  lines.push(`    if (!textarea) return;`)
  lines.push(`    if (fg_system_wifi_keyboard &&`)
  lines.push(`        !lv_obj_has_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN) &&`)
  lines.push(`        lv_keyboard_get_textarea(fg_system_wifi_keyboard) == textarea) return;`)
  lines.push(`    // Replaces eager screen-child creation: fg_system_wifi_keyboard = lv_keyboard_create(parent);`)
  lines.push(`    if (!fg_system_wifi_keyboard) {`)
  lines.push(`        fg_system_wifi_keyboard = lv_keyboard_create(lv_layer_top());`)
  lines.push(`        lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);`)
  lines.push(`        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_IGNORE_LAYOUT | LV_OBJ_FLAG_FLOATING);`)
  lines.push(`        lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);`)
  lines.push(`        lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);`)
  lines.push(`        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(${palette.accent}), LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_radius(fg_system_wifi_keyboard, 6, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_pad_all(fg_system_wifi_keyboard, 8, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_pad_row(fg_system_wifi_keyboard, 6, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_pad_column(fg_system_wifi_keyboard, 6, LV_PART_MAIN);`)
  lines.push(`        lv_obj_set_style_text_font(fg_system_wifi_keyboard, &lv_font_montserrat_18, LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_bg_opa(fg_system_wifi_keyboard, LV_OPA_COVER, LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_keyboard, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_keyboard, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_keyboard, 1, LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_keyboard, lv_color_hex(${palette.border}), LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_radius(fg_system_wifi_keyboard, 4, LV_PART_ITEMS);`)
  lines.push(`        lv_obj_set_style_shadow_width(fg_system_wifi_keyboard, 0, LV_PART_ITEMS);`)
  lines.push(`        lv_obj_add_event_cb(fg_system_wifi_keyboard, fg_keyboard_event_cb, LV_EVENT_ALL, NULL);`)
  lines.push(`        lv_obj_add_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    }`)
  lines.push(`    if (lv_keyboard_get_textarea(fg_system_wifi_keyboard) != textarea) {`)
  lines.push(`        lv_keyboard_set_textarea(fg_system_wifi_keyboard, textarea);`)
  lines.push(`    }`)
  lines.push(`    lv_keyboard_set_mode(fg_system_wifi_keyboard, LV_KEYBOARD_MODE_TEXT_LOWER);`)
  lines.push(`    if (textarea == fg_system_wifi_password_input) {`)
  lines.push(`        lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);`)
  lines.push(`        lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 18);`)
  lines.push(`    }`)
  lines.push(`    lv_obj_set_align(fg_system_wifi_keyboard, LV_ALIGN_TOP_LEFT);`)
  lines.push(`    lv_obj_set_pos(fg_system_wifi_keyboard, 0, 350);`)
  lines.push(`    lv_obj_set_size(fg_system_wifi_keyboard, 1024, 250);`)
  lines.push(`    lv_obj_clear_flag(fg_system_wifi_keyboard, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_move_foreground(fg_system_wifi_keyboard);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_keyboard_event_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    lv_event_code_t code = lv_event_get_code(event);`)
  lines.push(`    if (code == LV_EVENT_READY || code == LV_EVENT_CANCEL) {`)
  lines.push(`        fg_keyboard_hide();`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_keyboard_open_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * textarea = lv_event_get_target(event);`)
  lines.push(`    fg_keyboard_show_for(textarea);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_password_show_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    if (!fg_system_wifi_password_input) return;`)
  lines.push(`    bool hidden = lv_textarea_get_password_mode(fg_system_wifi_password_input);`)
  lines.push(`    lv_textarea_set_password_mode(fg_system_wifi_password_input, !hidden);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_remember_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * button = lv_event_get_target(event);`)
  lines.push(`    fg_system_wifi_remember = !fg_system_wifi_remember;`)
  lines.push(`    lv_obj_t * label = lv_obj_get_child(button, 0);`)
  lines.push(`    if (label) lv_label_set_text(label, fg_system_wifi_remember ? LV_SYMBOL_OK " Remember password" : "Remember password");`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_password_connect_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    if (fg_system_wifi_selected < 0 || fg_system_wifi_selected >= fg_system_wifi_network_count) return;`)
  lines.push(`    const char * password = lv_textarea_get_text(fg_system_wifi_password_input);`)
  lines.push(`    size_t password_length = strlen(password);`)
  lines.push(`    if (password_length < 8 || password_length > 63) {`)
  lines.push(`        lv_label_set_text(fg_system_wifi_password_error, "Password must be 8 to 63 characters");`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(`    fg_wifi_result_t result = fg_wifi_connect_network(&fg_system_wifi_networks[fg_system_wifi_selected], password, fg_system_wifi_remember);`)
  lines.push(`    if (result != FG_WIFI_OP_ACCEPTED && result != FG_WIFI_OP_OK) {`)
  lines.push(`        lv_label_set_text(fg_system_wifi_password_error, "Unable to start connection");`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(`    fg_keyboard_hide();`)
  lines.push(`    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_network_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    int index = (int)(intptr_t)lv_event_get_user_data(event);`)
  lines.push(`    if (index < 0 || index >= fg_system_wifi_network_count) return;`)
  lines.push(`    fg_system_wifi_selected = index;`)
  lines.push(`    fg_wifi_network_t * network = &fg_system_wifi_networks[index];`)
  lines.push(`    if (network->connected) { fg_wifi_tick_cb(NULL); return; }`)
  lines.push(`    if (network->security == FG_WIFI_SECURITY_OPEN) {`)
  lines.push(`        (void)fg_wifi_connect_network(network, NULL, fg_system_wifi_remember);`)
  lines.push(`    } else {`)
  lines.push(`        lv_textarea_set_text(fg_system_wifi_password_input, "");`)
  lines.push(`        lv_textarea_set_password_mode(fg_system_wifi_password_input, true);`)
  lines.push(`        lv_label_set_text_fmt(fg_system_wifi_password_title, "Connect to %s", network->ssid);`)
  lines.push(`        lv_label_set_text(fg_system_wifi_password_error, "");`)
  lines.push(`        lv_obj_clear_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`        lv_obj_move_foreground(fg_system_wifi_password_dialog);`)
  lines.push(`    }`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_forget_request_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    lv_obj_clear_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    lv_obj_move_foreground(fg_system_wifi_forget_dialog);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_forget_cancel_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_forget_confirm_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    (void)fg_wifi_forget();`)
  lines.push(`    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
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
  lines.push(`    if (!button) return NULL;`)
  lines.push(`    lv_obj_set_pos(button, x, y);`)
  lines.push(`    lv_obj_set_size(button, width, height);`)
  lines.push(`    lv_obj_set_style_radius(button, 12, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(button, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`    lv_obj_set_style_border_color(button, lv_color_hex(${palette.border}), 0);`)
  lines.push(`    lv_obj_set_style_border_width(button, 2, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(button, lv_color_hex(${palette.accent}), LV_STATE_PRESSED);`)
  lines.push(`    lv_obj_set_style_border_color(button, lv_color_hex(${palette.accent}), LV_STATE_PRESSED);`)
  lines.push(`    lv_obj_set_style_bg_color(button, lv_color_hex(${palette.surface2}), LV_STATE_FOCUSED);`)
  lines.push(`    lv_obj_set_style_border_color(button, lv_color_hex(${palette.accent}), LV_STATE_FOCUSED);`)
  lines.push(`    lv_obj_set_style_bg_color(button, lv_color_hex(${palette.surface2}), LV_STATE_DISABLED);`)
  lines.push(`    lv_obj_set_style_border_color(button, lv_color_hex(${palette.border}), LV_STATE_DISABLED);`)
  lines.push(`    lv_obj_set_style_opa(button, LV_OPA_40, LV_STATE_DISABLED);`)
  lines.push(`    lv_obj_t * label = lv_label_create(button);`)
  lines.push(`    if (!label) { lv_obj_delete(button); return NULL; }`)
  lines.push(`    lv_label_set_text(label, text);`)
  lines.push(`    lv_obj_set_style_text_color(label, lv_color_hex(${palette.text}), 0);`)
  lines.push(`    lv_obj_set_style_text_align(label, LV_TEXT_ALIGN_CENTER, 0);`)
  lines.push(`    lv_obj_center(label);`)
  lines.push(`    return button;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_name_dialog(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_name_dialog) return true;`)
  lines.push(`    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false;`)
  lines.push(`    lv_obj_set_size(dialog, 520, 260); lv_obj_center(dialog);`)
  lines.push(`    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog); lv_obj_t * error = lv_label_create(dialog);`)
  lines.push(`    if (!title || !input || !error) { lv_obj_delete(dialog); return false; }`)
  lines.push(`    fg_system_storage_name_title = title; fg_system_storage_name_input = input; fg_system_storage_name_error = error;`)
  lines.push(`    lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8); lv_obj_set_size(input, 450, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 45); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, FG_SD_MAX_NAME - 1); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
  lines.push(`    lv_obj_set_width(error, 450); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 110); lv_obj_set_style_text_color(error, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 165, 210, 52); lv_obj_t * save = fg_system_create_button(dialog, "Save", 255, 165, 210, 52);`)
  lines.push(`    if (!cancel || !save) { lv_obj_delete(dialog); fg_system_storage_name_title = NULL; fg_system_storage_name_input = NULL; fg_system_storage_name_error = NULL; return false; }`)
  lines.push(`    lv_obj_add_event_cb(cancel, fg_system_storage_name_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(save, fg_system_storage_name_commit_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_name_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_delete_dialog(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_delete_dialog) return true;`)
  lines.push(`    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 560, 240); lv_obj_center(dialog);`)
  lines.push(`    lv_obj_t * text = lv_label_create(dialog); if (!text) { lv_obj_delete(dialog); return false; } fg_system_storage_delete_text = text; lv_obj_set_width(text, 490); lv_obj_align(text, LV_ALIGN_TOP_MID, 0, 24);`)
  lines.push(`    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 145, 230, 56); lv_obj_t * confirm = fg_system_create_button(dialog, "Confirm Delete", 280, 145, 230, 56);`)
  lines.push(`    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_delete_text = NULL; return false; }`)
  lines.push(`    lv_obj_add_event_cb(cancel, fg_system_storage_delete_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_delete_confirm_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_delete_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_format_dialog(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_format_dialog) return true;`)
  lines.push(`    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 590, 310); lv_obj_center(dialog);`)
  lines.push(`    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * error = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog);`)
  lines.push(`    if (!title || !error || !input) { lv_obj_delete(dialog); return false; }`)
  lines.push(`    lv_label_set_text(title, "FORMAT SD CARD"); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8); fg_system_storage_format_error = error; lv_obj_set_width(error, 520); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 44); lv_obj_set_style_text_color(error, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`    fg_system_storage_format_input = input; lv_obj_set_size(input, 500, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 112); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, 6); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
  lines.push(`    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 35, 215, 240, 55); lv_obj_t * confirm = fg_system_create_button(dialog, "Erase and Format", 295, 215, 240, 55);`)
  lines.push(`    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_format_error = NULL; fg_system_storage_format_input = NULL; return false; }`)
  lines.push(`    lv_obj_add_event_cb(cancel, fg_system_storage_format_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_format_confirm_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_format_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_delete_folder_dialog(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_delete_folder_dialog) return true;`)
  lines.push(`    lv_obj_t * dialog = lv_obj_create(fg_system_root); if (!dialog) return false; lv_obj_set_size(dialog, 560, 330); lv_obj_center(dialog);`)
  lines.push(`    lv_obj_t * title = lv_label_create(dialog); lv_obj_t * text = lv_label_create(dialog); lv_obj_t * input = lv_textarea_create(dialog); lv_obj_t * error = lv_label_create(dialog);`)
  lines.push(`    if (!title || !text || !input || !error) { lv_obj_delete(dialog); return false; }`)
  lines.push(`    lv_label_set_text(title, "DELETE EMPTY FOLDER"); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 8);`)
  lines.push(`    fg_system_storage_delete_folder_text = text; lv_obj_set_width(text, 490); lv_obj_align(text, LV_ALIGN_TOP_MID, 0, 43); lv_obj_set_style_text_align(text, LV_TEXT_ALIGN_CENTER, 0);`)
  lines.push(`    fg_system_storage_delete_folder_input = input; lv_obj_set_size(input, 480, 58); lv_obj_align(input, LV_ALIGN_TOP_MID, 0, 125); lv_textarea_set_one_line(input, true); lv_textarea_set_max_length(input, 6); lv_obj_add_event_cb(input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
  lines.push(`    fg_system_storage_delete_folder_error = error; lv_obj_set_width(error, 500); lv_obj_align(error, LV_ALIGN_TOP_MID, 0, 190); lv_obj_set_style_text_color(error, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`    lv_obj_t * cancel = fg_system_create_button(dialog, "Cancel", 30, 240, 235, 56); lv_obj_t * confirm = fg_system_create_button(dialog, "Delete Folder", 285, 240, 235, 56);`)
  lines.push(`    if (!cancel || !confirm) { lv_obj_delete(dialog); fg_system_storage_delete_folder_text = NULL; fg_system_storage_delete_folder_input = NULL; fg_system_storage_delete_folder_error = NULL; return false; }`)
  lines.push(`    lv_obj_add_event_cb(cancel, fg_system_storage_delete_folder_cancel_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_event_cb(confirm, fg_system_storage_delete_folder_confirm_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_delete_folder_dialog = dialog; lv_obj_add_flag(dialog, LV_OBJ_FLAG_HIDDEN); return true;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_page(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_initialized) return fg_system_storage_page != NULL;`)
  lines.push(`    fg_system_storage_page = lv_obj_create(fg_system_root);`)
  lines.push(`    if (!fg_system_storage_page) return false;`)
  lines.push(`    lv_obj_set_size(fg_system_storage_page, 1024, 600);`)
  lines.push(`    lv_obj_set_style_bg_color(fg_system_storage_page, lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(fg_system_storage_page, LV_OPA_COVER, 0);`)
  lines.push(`    lv_obj_set_style_border_width(fg_system_storage_page, 0, 0);`)
  lines.push(`    lv_obj_clear_flag(fg_system_storage_page, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`    lv_obj_t * back = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Back", 20, 14, 128, 54);`)
  lines.push(`    if (!back) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(back, fg_system_storage_back_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    lv_obj_t * title = lv_label_create(fg_system_storage_page);`)
  lines.push(`    if (!title) goto unavailable;`)
  lines.push(`    lv_label_set_text(title, "SD Card"); lv_obj_set_style_text_color(title, lv_color_hex(${palette.text}), 0); lv_obj_set_style_text_font(title, &lv_font_montserrat_32, 0); lv_obj_align(title, LV_ALIGN_TOP_MID, 0, 24);`)
  lines.push(`    fg_system_storage_summary = lv_label_create(fg_system_storage_page);`)
  lines.push(`    if (!fg_system_storage_summary) goto unavailable;`)
  lines.push(`    lv_obj_set_pos(fg_system_storage_summary, 28, 96); lv_obj_set_width(fg_system_storage_summary, 350); lv_obj_set_style_text_color(fg_system_storage_summary, lv_color_hex(${palette.text}), 0);`)
  lines.push(`    lv_label_set_text(fg_system_storage_summary, "Storage starting...");`)
  lines.push(`    fg_system_storage_refresh_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_REFRESH " Refresh", 28, 220, 165, 50);`)
  lines.push(`    if (!fg_system_storage_refresh_button) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_refresh_button, fg_system_storage_refresh_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_test_button = fg_system_create_button(fg_system_storage_page, "Run R/W Test", 210, 220, 165, 50);`)
  lines.push(`    if (!fg_system_storage_test_button) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_test_button, fg_system_storage_test_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_select_folder_button = fg_system_create_button(fg_system_storage_page, "Select Item", 28, 292, 165, 52);`)
  lines.push(`    if (!fg_system_storage_select_folder_button) goto unavailable;`)
  lines.push(`    fg_system_storage_select_folder_label = lv_obj_get_child(fg_system_storage_select_folder_button, 0);`)
  lines.push(`    if (!fg_system_storage_select_folder_label) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_select_folder_button, fg_system_storage_select_folder_cb, LV_EVENT_CLICKED, NULL);`)
  lines.push(`    fg_system_storage_delete_folder_button = fg_system_create_button(fg_system_storage_page, "Delete Folder", 210, 292, 165, 52);`)
  lines.push(`    if (!fg_system_storage_delete_folder_button) goto unavailable;`)
  lines.push(`    fg_system_storage_delete_folder_label = lv_obj_get_child(fg_system_storage_delete_folder_button, 0);`)
  lines.push(`    if (!fg_system_storage_delete_folder_label) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_delete_folder_button, fg_system_storage_delete_folder_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_delete_folder_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_storage_parent_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_UP " Parent", 410, 78, 135, 48);`)
  lines.push(`    if (!fg_system_storage_parent_button) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_parent_button, fg_system_storage_parent_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_storage_path = lv_label_create(fg_system_storage_page);`)
  lines.push(`    if (!fg_system_storage_path) goto unavailable;`)
  lines.push(`    lv_label_set_text(fg_system_storage_path, "/sdcard"); lv_obj_set_pos(fg_system_storage_path, 565, 92); lv_obj_set_style_text_color(fg_system_storage_path, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`    fg_system_storage_list = lv_obj_create(fg_system_storage_page);`)
  lines.push(`    if (!fg_system_storage_list) goto unavailable;`)
  lines.push(`    lv_obj_set_pos(fg_system_storage_list, 400, 135); lv_obj_set_size(fg_system_storage_list, 600, 390); lv_obj_set_flex_flow(fg_system_storage_list, LV_FLEX_FLOW_COLUMN); lv_obj_set_style_pad_all(fg_system_storage_list, 6, 0); lv_obj_set_style_pad_gap(fg_system_storage_list, 5, 0);`)
  lines.push(`    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) {`)
  lines.push(`        fg_system_storage_rows[i] = lv_button_create(fg_system_storage_list);`)
  lines.push(`        if (!fg_system_storage_rows[i]) goto unavailable;`)
  lines.push(`        lv_obj_set_size(fg_system_storage_rows[i], LV_PCT(100), 40); lv_obj_set_flex_grow(fg_system_storage_rows[i], 0);`)
  lines.push(`        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(${palette.surface2}), LV_STATE_DEFAULT); lv_obj_set_style_border_color(fg_system_storage_rows[i], lv_color_hex(${palette.border}), LV_STATE_DEFAULT);`)
  lines.push(`        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(${palette.accent}), LV_STATE_CHECKED); lv_obj_set_style_text_color(fg_system_storage_rows[i], lv_color_hex(${palette.bg}), LV_STATE_CHECKED);`)
  lines.push(`        lv_obj_set_style_bg_color(fg_system_storage_rows[i], lv_color_hex(${palette.accent}), LV_STATE_PRESSED); lv_obj_set_style_border_color(fg_system_storage_rows[i], lv_color_hex(${palette.accent}), LV_STATE_FOCUSED); lv_obj_set_style_opa(fg_system_storage_rows[i], LV_OPA_40, LV_STATE_DISABLED);`)
  lines.push(`        fg_system_storage_row_metadata[i].visible_row = i; fg_system_storage_row_metadata[i].valid = false;`)
  lines.push(`        lv_obj_add_event_cb(fg_system_storage_rows[i], fg_system_storage_row_cb, LV_EVENT_CLICKED, &fg_system_storage_row_metadata[i]);`)
  lines.push(`        fg_system_storage_row_labels[i] = lv_label_create(fg_system_storage_rows[i]);`)
  lines.push(`        if (!fg_system_storage_row_labels[i]) goto unavailable;`)
  lines.push(`        lv_obj_align(fg_system_storage_row_labels[i], LV_ALIGN_LEFT_MID, 4, 0); lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    }`)
  lines.push(`    fg_system_storage_empty = lv_label_create(fg_system_storage_list);`)
  lines.push(`    if (!fg_system_storage_empty) goto unavailable;`)
  lines.push(`    lv_label_set_text(fg_system_storage_empty, "This folder is empty"); lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_FLOATING | LV_OBJ_FLAG_HIDDEN); lv_obj_center(fg_system_storage_empty);`)
  lines.push(`    fg_system_storage_previous_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Previous", 410, 536, 170, 48);`)
  lines.push(`    if (!fg_system_storage_previous_button) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_previous_button, fg_system_storage_previous_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_previous_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_storage_next_button = fg_system_create_button(fg_system_storage_page, "Next " LV_SYMBOL_RIGHT, 810, 536, 170, 48);`)
  lines.push(`    if (!fg_system_storage_next_button) goto unavailable;`)
  lines.push(`    lv_obj_add_event_cb(fg_system_storage_next_button, fg_system_storage_next_cb, LV_EVENT_CLICKED, NULL); lv_obj_add_state(fg_system_storage_next_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_storage_initialized = true;`)
  lines.push(`    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    return true;`)
  lines.push(`unavailable:`)
  lines.push(`    fg_system_storage_initialized = true; fg_system_storage_available = false;`)
  lines.push(`    if (fg_system_storage_summary) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\\nUse Back to return to System");`)
  lines.push(`    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    return true;`)
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

  clockExports.forEach(clockExport => {
    const format = clockExport.hourFormat === '12'
      ? clockExport.showSeconds
        ? '%02d%c%02d%c%02d %s'
        : '%02d%c%02d %s'
      : clockExport.showSeconds
        ? '%02d%c%02d%c%02d'
        : '%02d%c%02d'
    const argumentsList = clockExport.hourFormat === '12'
      ? clockExport.showSeconds
        ? 'display_hour, separator, minute, separator, second, period'
        : 'display_hour, separator, minute, period'
      : clockExport.showSeconds
        ? 'hour, separator, minute, separator, second'
        : 'hour, separator, minute'

    lines.push(`static void ${clockExport.tickCallbackName}(lv_timer_t * timer)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(timer);`)
    lines.push(`    if (${clockExport.labelName} == NULL) return;`)
    lines.push(``)
    lines.push(`    int hour, minute, second;`)
    lines.push(`    fg_rtc_get(NULL, NULL, NULL, &hour, &minute, &second);`)
    lines.push(`    char separator = ${clockExport.blinkSeparator ? `${clockExport.separatorVisibleName} ? ':' : ' '` : `':'`};`)
    if (clockExport.hourFormat === '12') {
      lines.push(`    int display_hour = hour % 12;`)
      lines.push(`    if (display_hour == 0) display_hour = 12;`)
      lines.push(`    const char * period = hour < 12 ? "AM" : "PM";`)
    }
    lines.push(`    char time_buf[24];`)
    lines.push(`    snprintf(time_buf, sizeof(time_buf), "${format}", ${argumentsList});`)
    if (clockExport.blinkSeparator) {
      lines.push(`    ${clockExport.separatorVisibleName} = !${clockExport.separatorVisibleName};`)
    }
    lines.push(`    lv_label_set_text(${clockExport.labelName}, time_buf);`)
    lines.push(`}`)
    lines.push(``)
  })

  lines.push(`static const char * fg_wifi_signal_quality(int rssi)`)
  lines.push(`{`)
  lines.push(`    if (rssi >= -55) return "Excellent";`)
  lines.push(`    if (rssi >= -67) return "Good";`)
  lines.push(`    if (rssi >= -75) return "Fair";`)
  lines.push(`    return "Weak";`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_wifi_tick_cb(lv_timer_t *timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer);`)
  lines.push(``)
  lines.push(`    fg_wifi_pump();`)
  lines.push(``)
  lines.push(`    if (fg_system_wifi_password_dialog &&`)
  lines.push(`        !lv_obj_has_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN)) return;`)
  lines.push(``)
  lines.push(`    if (fg_wifi_label) {`)
  lines.push(`        char wifi_buf[128];`)
  lines.push(`        snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\\n%s\\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());`)
  lines.push(`        lv_label_set_text(fg_wifi_label, wifi_buf);`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;`)
  lines.push(`    fg_wifi_snapshot_t snapshot;`)
  lines.push(`    if (fg_wifi_get_snapshot(&snapshot) != FG_WIFI_OP_OK) return;`)
  lines.push(`    const char * state_text = "Wi-Fi Off";`)
  lines.push(`    switch (snapshot.state) {`)
  lines.push(`        case FG_WIFI_STATE_INIT: state_text = "Turning On"; break;`)
  lines.push(`        case FG_WIFI_STATE_READY: state_text = "Ready"; break;`)
  lines.push(`        case FG_WIFI_STATE_CONNECTING: state_text = "Connecting"; break;`)
  lines.push(`        case FG_WIFI_STATE_CONNECTED: state_text = "Connected"; break;`)
  lines.push(`        case FG_WIFI_STATE_DISCONNECTING: state_text = "Disconnecting"; break;`)
  lines.push(`        case FG_WIFI_STATE_DISCONNECTED: state_text = "Disconnected"; break;`)
  lines.push(`        case FG_WIFI_STATE_SCANNING: state_text = "Scanning"; break;`)
  lines.push(`        case FG_WIFI_STATE_ERROR: state_text = "Failed"; break;`)
  lines.push(`        default: break;`)
  lines.push(`    }`)
  lines.push(`    if (fg_system_wifi_state_label) lv_label_set_text(fg_system_wifi_state_label, state_text);`)
  lines.push(`    const char * empty = "--";`)
  lines.push(`    // Browser parity fields formerly combined as "Current network     %s", "IP address          %s", and "Gateway             %s".`)
  lines.push(`    if (fg_system_wifi_ssid_label) lv_label_set_text(fg_system_wifi_ssid_label, snapshot.connected && snapshot.ssid[0] ? snapshot.ssid : empty);`)
  lines.push(`    if (fg_system_wifi_ip_label) lv_label_set_text(fg_system_wifi_ip_label, snapshot.connected && snapshot.ip[0] ? snapshot.ip : empty);`)
  lines.push(`    if (fg_system_wifi_gateway_label) lv_label_set_text(fg_system_wifi_gateway_label, snapshot.connected && snapshot.gateway[0] ? snapshot.gateway : empty);`)
  lines.push(`    if (fg_system_wifi_rssi_label) {`)
  lines.push(`        // Browser parity format: "Signal              %d dBm - %s".`)
  lines.push(`        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_rssi_label, "%d dBm - %s", snapshot.rssi, fg_wifi_signal_quality(snapshot.rssi));`)
  lines.push(`        else lv_label_set_text(fg_system_wifi_rssi_label, empty);`)
  lines.push(`    }`)
  lines.push(`    // Browser parity formats: "Security            %s" and "Status              %s%s%s".`)
  lines.push(`    if (fg_system_wifi_security_label) lv_label_set_text(fg_system_wifi_security_label, snapshot.connected ? fg_wifi_security_text(snapshot.security) : empty);`)
  lines.push(`    if (fg_system_wifi_raw_label) lv_label_set_text_fmt(fg_system_wifi_raw_label, "%s%s%s", fg_wifi_status_text(), snapshot.error_reason[0] ? " - " : "", snapshot.error_reason);`)
  lines.push(`    if (fg_system_wifi_details_label) {`)
  lines.push(`        if (snapshot.connected) lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %02X:%02X:%02X:%02X:%02X:%02X\\nAP BSSID     %02X:%02X:%02X:%02X:%02X:%02X", snapshot.station_mac[0], snapshot.station_mac[1], snapshot.station_mac[2], snapshot.station_mac[3], snapshot.station_mac[4], snapshot.station_mac[5], snapshot.ap_bssid[0], snapshot.ap_bssid[1], snapshot.ap_bssid[2], snapshot.ap_bssid[3], snapshot.ap_bssid[4], snapshot.ap_bssid[5]);`)
  lines.push(`        else lv_label_set_text_fmt(fg_system_wifi_details_label, "Station MAC  %s\\nAP BSSID     %s", empty, empty);`)
  lines.push(`    }`)
  lines.push(`    if (fg_system_wifi_scan_label) lv_label_set_text(fg_system_wifi_scan_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "Available Networks");`)
  lines.push(`    if (snapshot.scan_in_progress) lv_obj_add_state(fg_system_wifi_scan_button, LV_STATE_DISABLED); else lv_obj_clear_state(fg_system_wifi_scan_button, LV_STATE_DISABLED);`)
  lines.push(`    if (snapshot.connected || snapshot.state == FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_disconnect_button, LV_STATE_DISABLED);`)
  lines.push(`    if (snapshot.ready && snapshot.state != FG_WIFI_STATE_CONNECTING) lv_obj_clear_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_reconnect_button, LV_STATE_DISABLED);`)
  lines.push(`    if (snapshot.saved) lv_obj_clear_state(fg_system_wifi_forget_button, LV_STATE_DISABLED); else lv_obj_add_state(fg_system_wifi_forget_button, LV_STATE_DISABLED);`)
  lines.push(`    fg_system_wifi_network_count = fg_wifi_get_networks(fg_system_wifi_networks, FG_WIFI_MAX_SCAN);`)
  lines.push(`    if (fg_system_wifi_network_empty_label) {`)
  lines.push(`        lv_label_set_text(fg_system_wifi_network_empty_label, snapshot.scan_in_progress ? "Scanning for nearby networks..." : "No Wi-Fi networks found");`)
  lines.push(`        if (fg_system_wifi_network_count == 0) lv_obj_clear_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`        else lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    }`)
  lines.push(`    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {`)
  lines.push(`        if (i >= fg_system_wifi_network_count) { lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN); continue; }`)
  lines.push(`        fg_wifi_network_t * network = &fg_system_wifi_networks[i];`)
  lines.push(`        lv_obj_clear_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`        lv_label_set_text_fmt(fg_system_wifi_network_labels[i], "%s%s  %s  %d dBm%s%s", network->security == FG_WIFI_SECURITY_OPEN ? "" : LV_SYMBOL_CHARGE " ", network->ssid, fg_wifi_security_text(network->security), network->rssi, network->connected ? "  [Connected]" : "", network->saved ? "  [Saved]" : "");`)
  lines.push(`        if (i == fg_system_wifi_selected) lv_obj_add_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);`)
  lines.push(`        else lv_obj_clear_state(fg_system_wifi_network_rows[i], LV_STATE_CHECKED);`)
  lines.push(`    }`)
  lines.push(`    lv_obj_update_layout(fg_system_wifi_network_container);`)
  lines.push(`}`)
  lines.push(``)

  lines.push(`// ForgeUI LVGL Export Proof V1`)
  lines.push(`// Generated from ForgeUI Studio`)
  lines.push(``)
lines.push(`void fg_studio_export_create(lv_obj_t *parent)`)
lines.push(`{`)
lines.push(`    fg_system_root = parent;`)
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
        ledExports,
        barExports,
        progressExports,
        numberInputExports,
        selectExports,
        imageExports,
        boxExports,
        iconButtonExports,
        arcExports,
        chartExports,
        keyboardExports,
        calendarExports,
        rollerExports,
        messageBoxExports,
        buttonMatrixExports,
        tabViewExports,
        tileViewExports,
        clockExports,
        inputExports,
        switchExports,
        checkboxExports,
        radioExports,
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
lines.push(`    lv_obj_t * wifi_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_WIFI "\\nWi-Fi", 282, 102, 220, 180);`)
lines.push(`    lv_obj_add_event_cb(wifi_card, fg_system_open_wifi_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_BLUETOOTH "\\nBluetooth\\nComing Later", 522, 102);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_VOLUME_MAX "\\nSound\\nComing Later", 762, 102);`)
lines.push(`    lv_obj_t * storage_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_SD_CARD "\\nStorage", 42, 302, 220, 180);`)
lines.push(`    lv_obj_add_event_cb(storage_card, fg_system_open_storage_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_HOME "\\nDevice\\nComing Later", 282, 302);`)
lines.push(`    fg_system_create_disabled_card(fg_system_launcher_page, LV_SYMBOL_WARNING "\\nDiagnostics\\nComing Later", 522, 302);`)
lines.push(`    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`#if 0 /* Legacy eager Storage construction retained only as migration reference. */`)
lines.push(`    fg_system_storage_page = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_storage_page, 1024, 600);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_storage_page, lv_color_hex(${palette.bg}), 0);`)
lines.push(`    lv_obj_set_style_bg_opa(fg_system_storage_page, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_storage_page, 0, 0);`)
lines.push(`    lv_obj_clear_flag(fg_system_storage_page, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_t * storage_back = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_LEFT " Back", 20, 14, 128, 54);`)
lines.push(`    lv_obj_add_event_cb(storage_back, fg_system_storage_back_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * storage_title = lv_label_create(fg_system_storage_page);`)
lines.push(`    lv_label_set_text(storage_title, "SD Card");`)
lines.push(`    lv_obj_set_style_text_color(storage_title, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_font(storage_title, &lv_font_montserrat_32, 0);`)
lines.push(`    lv_obj_align(storage_title, LV_ALIGN_TOP_MID, 0, 24);`)
lines.push(`    fg_system_storage_summary = lv_label_create(fg_system_storage_page);`)
lines.push(`    lv_obj_set_pos(fg_system_storage_summary, 28, 88);`)
lines.push(`    lv_obj_set_width(fg_system_storage_summary, 350);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_storage_summary, lv_color_hex(${palette.text}), 0);`)
lines.push(`    fg_system_storage_refresh_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_REFRESH " Refresh", 28, 205, 165, 50);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_refresh_button, fg_system_storage_refresh_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_mount_button = fg_system_create_button(fg_system_storage_page, "Mount", 210, 205, 165, 50);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_mount_button, fg_system_storage_mount_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_unmount_button = fg_system_create_button(fg_system_storage_page, "Unmount", 28, 270, 165, 50);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_unmount_button, fg_system_storage_unmount_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_test_button = fg_system_create_button(fg_system_storage_page, "Run R/W Test", 210, 270, 165, 50);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_test_button, fg_system_storage_test_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_format_button = fg_system_create_button(fg_system_storage_page, "Format SD Card", 28, 335, 347, 50);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_format_button, fg_system_storage_format_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_path = lv_label_create(fg_system_storage_page);`)
lines.push(`    lv_label_set_text(fg_system_storage_path, "/");`)
lines.push(`    lv_obj_set_pos(fg_system_storage_path, 410, 92);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_storage_path, lv_color_hex(${palette.accent}), 0);`)
lines.push(`    fg_system_storage_parent_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_UP " Parent", 410, 78, 135, 48);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_parent_button, fg_system_storage_parent_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_state(fg_system_storage_parent_button, LV_STATE_DISABLED);`)
lines.push(`    fg_system_storage_new_button = fg_system_create_button(fg_system_storage_page, LV_SYMBOL_PLUS " New Folder", 800, 78, 190, 48);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_new_button, fg_system_storage_new_folder_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_storage_list = lv_obj_create(fg_system_storage_page);`)
lines.push(`    lv_obj_set_pos(fg_system_storage_list, 400, 135); lv_obj_set_size(fg_system_storage_list, 600, 390);`)
lines.push(`    lv_obj_set_flex_flow(fg_system_storage_list, LV_FLEX_FLOW_COLUMN); lv_obj_set_style_pad_all(fg_system_storage_list, 6, 0); lv_obj_set_style_pad_gap(fg_system_storage_list, 5, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_storage_list, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(fg_system_storage_list, lv_color_hex(${palette.border}), 0);`)
lines.push(`    static lv_style_t storage_row_default_style, storage_row_active_style, storage_row_disabled_style;`)
lines.push(`    static bool storage_row_styles_ready = false;`)
lines.push(`    if (!storage_row_styles_ready) {`)
lines.push(`        lv_style_init(&storage_row_default_style); lv_style_set_bg_color(&storage_row_default_style, lv_color_hex(${palette.surface2})); lv_style_set_border_color(&storage_row_default_style, lv_color_hex(${palette.border})); lv_style_set_text_color(&storage_row_default_style, lv_color_hex(${palette.text}));`)
lines.push(`        lv_style_init(&storage_row_active_style); lv_style_set_bg_color(&storage_row_active_style, lv_color_hex(${palette.accent})); lv_style_set_text_color(&storage_row_active_style, lv_color_hex(${palette.bg}));`)
lines.push(`        lv_style_init(&storage_row_disabled_style); lv_style_set_bg_color(&storage_row_disabled_style, lv_color_hex(${palette.surface2})); lv_style_set_text_color(&storage_row_disabled_style, lv_color_hex(${palette.text})); lv_style_set_opa(&storage_row_disabled_style, LV_OPA_40);`)
lines.push(`        storage_row_styles_ready = true;`)
lines.push(`    }`)
lines.push(`    for (int i = 0; i < FG_SD_MAX_ENTRIES; ++i) {`)
lines.push(`        fg_system_storage_rows[i] = lv_button_create(fg_system_storage_list);`)
lines.push(`        lv_obj_set_size(fg_system_storage_rows[i], LV_PCT(100), 46); lv_obj_set_flex_grow(fg_system_storage_rows[i], 0);`)
lines.push(`        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_default_style, LV_STATE_DEFAULT);`)
lines.push(`        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_active_style, LV_STATE_PRESSED | LV_STATE_CHECKED);`)
lines.push(`        lv_obj_add_style(fg_system_storage_rows[i], &storage_row_disabled_style, LV_STATE_DISABLED);`)
lines.push(`        lv_obj_add_event_cb(fg_system_storage_rows[i], fg_system_storage_row_cb, LV_EVENT_CLICKED, (void *)(intptr_t)i);`)
lines.push(`        fg_system_storage_row_labels[i] = lv_label_create(fg_system_storage_rows[i]);`)
lines.push(`        lv_obj_align(fg_system_storage_row_labels[i], LV_ALIGN_LEFT_MID, 4, 0);`)
lines.push(`        lv_obj_add_flag(fg_system_storage_rows[i], LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    }`)
lines.push(`    fg_system_storage_empty = lv_label_create(fg_system_storage_list);`)
lines.push(`    lv_label_set_text(fg_system_storage_empty, "This folder is empty");`)
lines.push(`    lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_FLOATING); lv_obj_center(fg_system_storage_empty);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_storage_empty, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_add_flag(fg_system_storage_empty, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    fg_system_storage_rename_button = fg_system_create_button(fg_system_storage_page, "Rename", 410, 536, 150, 48);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_rename_button, fg_system_storage_rename_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_state(fg_system_storage_rename_button, LV_STATE_DISABLED);`)
lines.push(`    fg_system_storage_delete_button = fg_system_create_button(fg_system_storage_page, "Delete", 575, 536, 150, 48);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_delete_button, fg_system_storage_delete_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_state(fg_system_storage_delete_button, LV_STATE_DISABLED);`)
lines.push(`    fg_system_storage_name_dialog = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_storage_name_dialog, 520, 260);`)
lines.push(`    lv_obj_center(fg_system_storage_name_dialog);`)
lines.push(`    fg_system_storage_name_title = lv_label_create(fg_system_storage_name_dialog);`)
lines.push(`    lv_obj_align(fg_system_storage_name_title, LV_ALIGN_TOP_MID, 0, 8);`)
lines.push(`    fg_system_storage_name_input = lv_textarea_create(fg_system_storage_name_dialog);`)
lines.push(`    lv_obj_set_size(fg_system_storage_name_input, 450, 58);`)
lines.push(`    lv_obj_align(fg_system_storage_name_input, LV_ALIGN_TOP_MID, 0, 45);`)
lines.push(`    lv_textarea_set_one_line(fg_system_storage_name_input, true);`)
lines.push(`    lv_textarea_set_max_length(fg_system_storage_name_input, FG_SD_MAX_NAME - 1);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_name_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
lines.push(`    fg_system_storage_name_error = lv_label_create(fg_system_storage_name_dialog);`)
lines.push(`    lv_obj_set_width(fg_system_storage_name_error, 450); lv_obj_align(fg_system_storage_name_error, LV_ALIGN_TOP_MID, 0, 110);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_storage_name_error, lv_color_hex(0xEF4444), 0);`)
lines.push(`    lv_obj_t * storage_name_cancel = fg_system_create_button(fg_system_storage_name_dialog, "Cancel", 30, 165, 210, 52);`)
lines.push(`    lv_obj_add_event_cb(storage_name_cancel, fg_system_storage_name_cancel_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * storage_name_save = fg_system_create_button(fg_system_storage_name_dialog, "Save", 255, 165, 210, 52);`)
lines.push(`    lv_obj_add_event_cb(storage_name_save, fg_system_storage_name_commit_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_storage_name_dialog, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    fg_system_storage_delete_dialog = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_storage_delete_dialog, 540, 230); lv_obj_center(fg_system_storage_delete_dialog);`)
lines.push(`    fg_system_storage_delete_text = lv_label_create(fg_system_storage_delete_dialog); lv_obj_set_width(fg_system_storage_delete_text, 470); lv_obj_align(fg_system_storage_delete_text, LV_ALIGN_TOP_MID, 0, 25);`)
lines.push(`    lv_obj_t * storage_delete_cancel = fg_system_create_button(fg_system_storage_delete_dialog, "Cancel", 30, 135, 220, 56);`)
lines.push(`    lv_obj_add_event_cb(storage_delete_cancel, fg_system_storage_delete_cancel_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * storage_delete_confirm = fg_system_create_button(fg_system_storage_delete_dialog, "Confirm Delete", 270, 135, 220, 56);`)
lines.push(`    lv_obj_add_event_cb(storage_delete_confirm, fg_system_storage_delete_confirm_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_storage_delete_dialog, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    fg_system_storage_format_dialog = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_storage_format_dialog, 570, 300); lv_obj_center(fg_system_storage_format_dialog);`)
lines.push(`    lv_obj_t * format_title = lv_label_create(fg_system_storage_format_dialog); lv_label_set_text(format_title, "FORMAT SD CARD"); lv_obj_align(format_title, LV_ALIGN_TOP_MID, 0, 8);`)
lines.push(`    fg_system_storage_format_error = lv_label_create(fg_system_storage_format_dialog); lv_obj_set_width(fg_system_storage_format_error, 500); lv_obj_align(fg_system_storage_format_error, LV_ALIGN_TOP_MID, 0, 45);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_storage_format_error, lv_color_hex(0xEF4444), 0);`)
lines.push(`    fg_system_storage_format_input = lv_textarea_create(fg_system_storage_format_dialog); lv_obj_set_size(fg_system_storage_format_input, 480, 58); lv_obj_align(fg_system_storage_format_input, LV_ALIGN_TOP_MID, 0, 105);`)
lines.push(`    lv_textarea_set_one_line(fg_system_storage_format_input, true); lv_textarea_set_max_length(fg_system_storage_format_input, 6);`)
lines.push(`    lv_obj_add_event_cb(fg_system_storage_format_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
lines.push(`    lv_obj_t * format_cancel = fg_system_create_button(fg_system_storage_format_dialog, "Cancel", 35, 205, 225, 55);`)
lines.push(`    lv_obj_add_event_cb(format_cancel, fg_system_storage_format_cancel_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * format_confirm = fg_system_create_button(fg_system_storage_format_dialog, "Erase and Format", 275, 205, 225, 55);`)
lines.push(`    lv_obj_add_event_cb(format_confirm, fg_system_storage_format_confirm_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_storage_format_dialog, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    if (!fg_system_storage_mutex) fg_system_storage_mutex = xSemaphoreCreateMutex();`)
lines.push(`    if (!fg_system_storage_queue) fg_system_storage_queue = xQueueCreate(1, sizeof(fg_storage_request_t));`)
lines.push(`    if (fg_system_storage_mutex && fg_system_storage_queue && !fg_system_storage_task) (void)xTaskCreate(fg_system_storage_worker, "fg_sd_worker", 8192, NULL, 5, &fg_system_storage_task);`)
lines.push(`    if (fg_system_storage_task && !fg_system_storage_timer) fg_system_storage_timer = lv_timer_create(fg_system_storage_tick_cb, 100, NULL);`)
lines.push(`    fg_system_storage_available = fg_system_storage_mutex && fg_system_storage_queue && fg_system_storage_task && fg_system_storage_timer;`)
lines.push(`    if (!fg_system_storage_available) lv_label_set_text(fg_system_storage_summary, "Storage Unavailable\\nSystem runtime remains operational");`)
lines.push(`    lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`#endif`)
lines.push(`    fg_system_wifi_page = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_page, 0, 0);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_page, 1024, 600);`)
lines.push(`    lv_obj_clear_flag(fg_system_wifi_page, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_wifi_page, 0, 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_wifi_page, 0, 0);`)
lines.push(`    lv_obj_set_style_radius(fg_system_wifi_page, 0, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_wifi_page, lv_color_hex(${palette.bg}), 0);`)
lines.push(`    lv_obj_set_style_bg_opa(fg_system_wifi_page, LV_OPA_COVER, 0);`)
lines.push(``)
lines.push(`    lv_obj_t * wifi_back = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_LEFT "  Back", 22, 14, 132, 58);`)
lines.push(`    lv_obj_add_event_cb(wifi_back, fg_system_wifi_back_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * wifi_title = lv_label_create(fg_system_wifi_page);`)
lines.push(`    lv_label_set_text(wifi_title, LV_SYMBOL_WIFI "  Wi-Fi");`)
lines.push(`    lv_obj_set_style_text_color(wifi_title, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_title, &lv_font_montserrat_32, 0);`)
lines.push(`    lv_obj_align(wifi_title, LV_ALIGN_TOP_MID, 0, 25);`)
lines.push(`    lv_obj_t * wifi_refresh = fg_system_create_button(fg_system_wifi_page, LV_SYMBOL_REFRESH "  Refresh", 822, 14, 174, 58);`)
lines.push(`    lv_obj_add_event_cb(wifi_refresh, fg_system_wifi_refresh_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(``)
lines.push(`    lv_obj_t * wifi_status_panel = lv_obj_create(fg_system_wifi_page);`)
lines.push(`    lv_obj_set_pos(wifi_status_panel, 28, 96);`)
lines.push(`    lv_obj_set_size(wifi_status_panel, 440, 248);`)
lines.push(`    lv_obj_clear_flag(wifi_status_panel, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_radius(wifi_status_panel, 12, 0);`)
lines.push(`    lv_obj_set_style_bg_color(wifi_status_panel, lv_color_hex(${palette.surface}), 0);`)
lines.push(`    lv_obj_set_style_border_color(wifi_status_panel, lv_color_hex(${palette.border}), 0);`)
lines.push(`    lv_obj_set_style_border_width(wifi_status_panel, 1, 0);`)
lines.push(`    fg_system_wifi_state_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(fg_system_wifi_state_label, "Off");`)
lines.push(`    lv_obj_t * wifi_connection_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_connection_caption, "CONNECTION STATUS");`)
lines.push(`    lv_obj_set_pos(wifi_connection_caption, 14, 8);`)
lines.push(`    lv_obj_set_style_text_color(wifi_connection_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_connection_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_connection_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_state_label, 14, 26);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_state_label, lv_color_hex(${palette.accent}), 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_state_label, &lv_font_montserrat_28, 0);`)
lines.push(`    lv_obj_t * wifi_ssid_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_ssid_caption, "Current Network");`)
lines.push(`    lv_obj_set_pos(wifi_ssid_caption, 14, 68);`)
lines.push(`    lv_obj_set_style_text_color(wifi_ssid_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_ssid_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_ssid_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_ssid_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_ssid_label, 14, 86);`)
lines.push(`    lv_obj_set_width(fg_system_wifi_ssid_label, 190);`)
lines.push(`    lv_label_set_long_mode(fg_system_wifi_ssid_label, LV_LABEL_LONG_DOT);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_ssid_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_ssid_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_ssid_label, &lv_font_montserrat_16, 0);`)
lines.push(`    lv_obj_t * wifi_ip_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_ip_caption, "IP Address");`)
lines.push(`    lv_obj_set_pos(wifi_ip_caption, 220, 68);`)
lines.push(`    lv_obj_set_style_text_color(wifi_ip_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_ip_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_ip_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_ip_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_ip_label, 220, 86);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_ip_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_ip_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_ip_label, &lv_font_montserrat_16, 0);`)
lines.push(`    lv_obj_t * wifi_gateway_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_gateway_caption, "Gateway");`)
lines.push(`    lv_obj_set_pos(wifi_gateway_caption, 14, 126);`)
lines.push(`    lv_obj_set_style_text_color(wifi_gateway_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_gateway_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_gateway_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_gateway_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_gateway_label, 14, 144);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_gateway_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_gateway_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_gateway_label, &lv_font_montserrat_16, 0);`)
lines.push(`    lv_obj_t * wifi_signal_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_signal_caption, "Signal");`)
lines.push(`    lv_obj_set_pos(wifi_signal_caption, 220, 126);`)
lines.push(`    lv_obj_set_style_text_color(wifi_signal_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_signal_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_signal_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_rssi_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_rssi_label, 220, 144);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_rssi_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_rssi_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_rssi_label, &lv_font_montserrat_16, 0);`)
lines.push(`    lv_obj_t * wifi_security_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_security_caption, "Security");`)
lines.push(`    lv_obj_set_pos(wifi_security_caption, 14, 184);`)
lines.push(`    lv_obj_set_style_text_color(wifi_security_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_security_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_security_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_security_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_security_label, 14, 202);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_security_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_security_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_security_label, &lv_font_montserrat_16, 0);`)
lines.push(`    lv_obj_t * wifi_status_caption = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_label_set_text(wifi_status_caption, "Status");`)
lines.push(`    lv_obj_set_pos(wifi_status_caption, 220, 184);`)
lines.push(`    lv_obj_set_style_text_color(wifi_status_caption, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_status_caption, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_status_caption, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_raw_label = lv_label_create(wifi_status_panel);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_raw_label, 220, 202);`)
lines.push(`    lv_obj_set_width(fg_system_wifi_raw_label, 190);`)
lines.push(`    lv_label_set_long_mode(fg_system_wifi_raw_label, LV_LABEL_LONG_DOT);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_raw_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_raw_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_raw_label, &lv_font_montserrat_16, 0);`)
lines.push(``)
lines.push(`    fg_system_wifi_scan_button = fg_system_create_button(fg_system_wifi_page, "Scan", 28, 360, 96, 44);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_scan_button, fg_system_wifi_scan_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_wifi_disconnect_button = fg_system_create_button(fg_system_wifi_page, "Disconnect", 136, 360, 96, 44);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_disconnect_button, fg_system_wifi_disconnect_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_wifi_reconnect_button = fg_system_create_button(fg_system_wifi_page, "Reconnect", 244, 360, 96, 44);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_reconnect_button, fg_system_wifi_reconnect_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_wifi_forget_button = fg_system_create_button(fg_system_wifi_page, "Forget", 352, 360, 96, 44);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_forget_button, fg_system_wifi_forget_request_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(``)
lines.push(`    fg_system_wifi_details_card = lv_obj_create(fg_system_wifi_page);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_details_card, 28, 420);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_details_card, 440, 144);`)
lines.push(`    lv_obj_clear_flag(fg_system_wifi_details_card, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_radius(fg_system_wifi_details_card, 12, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_wifi_details_card, lv_color_hex(${palette.surface}), 0);`)
lines.push(`    lv_obj_set_style_border_color(fg_system_wifi_details_card, lv_color_hex(${palette.border}), 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_wifi_details_card, 1, 0);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_wifi_details_card, 0, 0);`)
lines.push(`    lv_obj_t * wifi_details_title = lv_label_create(fg_system_wifi_details_card);`)
lines.push(`    lv_label_set_text(wifi_details_title, "Connected Network");`)
lines.push(`    lv_obj_set_pos(wifi_details_title, 16, 12);`)
lines.push(`    lv_obj_set_style_text_color(wifi_details_title, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_details_title, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_details_title, &lv_font_montserrat_16, 0);`)
lines.push(`    fg_system_wifi_details_label = lv_label_create(fg_system_wifi_details_card);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_details_label, 16, 46);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_details_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_details_label, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_details_label, &lv_font_montserrat_14, 0);`)
lines.push(``)
lines.push(`    fg_system_wifi_scan_label = lv_label_create(fg_system_wifi_page);`)
lines.push(`    lv_label_set_text(fg_system_wifi_scan_label, "Available Networks");`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_scan_label, 500, 100);`)
lines.push(`    lv_obj_set_style_text_font(fg_system_wifi_scan_label, &lv_font_montserrat_20, 0);`)
lines.push(`    lv_obj_t * wifi_scan_hint = lv_label_create(fg_system_wifi_page);`)
lines.push(`    lv_label_set_text(wifi_scan_hint, "Select a network to connect");`)
lines.push(`    lv_obj_set_pos(wifi_scan_hint, 500, 124);`)
lines.push(`    lv_obj_set_style_text_color(wifi_scan_hint, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(wifi_scan_hint, LV_OPA_60, 0);`)
lines.push(`    lv_obj_set_style_text_font(wifi_scan_hint, &lv_font_montserrat_12, 0);`)
lines.push(`    fg_system_wifi_network_container = lv_obj_create(fg_system_wifi_page);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_network_container, 490, 148);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_network_container, 506, 404);`)
lines.push(`    lv_obj_set_style_radius(fg_system_wifi_network_container, 12, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_wifi_network_container, lv_color_hex(${palette.surface}), 0);`)
lines.push(`    lv_obj_set_style_border_color(fg_system_wifi_network_container, lv_color_hex(${palette.border}), 0);`)
lines.push(`    lv_obj_set_style_border_width(fg_system_wifi_network_container, 1, 0);`)
lines.push(`    lv_obj_set_flex_flow(fg_system_wifi_network_container, LV_FLEX_FLOW_COLUMN);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_wifi_network_container, 10, 0);`)
lines.push(`    lv_obj_set_style_pad_gap(fg_system_wifi_network_container, 8, 0);`)
lines.push(`    fg_system_wifi_network_empty_label = lv_label_create(fg_system_wifi_network_container);`)
lines.push(`    lv_label_set_text(fg_system_wifi_network_empty_label, "No Wi-Fi networks found");`)
lines.push(`    lv_obj_add_flag(fg_system_wifi_network_empty_label, LV_OBJ_FLAG_FLOATING);`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_network_empty_label, lv_color_hex(${palette.text}), 0);`)
lines.push(`    lv_obj_set_style_text_opa(fg_system_wifi_network_empty_label, LV_OPA_70, 0);`)
lines.push(`    lv_obj_set_style_text_align(fg_system_wifi_network_empty_label, LV_TEXT_ALIGN_CENTER, 0);`)
lines.push(`    lv_obj_center(fg_system_wifi_network_empty_label);`)
lines.push(`    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {`)
lines.push(`        fg_system_wifi_network_rows[i] = lv_button_create(fg_system_wifi_network_container);`)
lines.push(`        lv_obj_set_size(fg_system_wifi_network_rows[i], LV_PCT(100), 50);`)
lines.push(`        lv_obj_set_style_radius(fg_system_wifi_network_rows[i], 9, 0);`)
lines.push(`        lv_obj_set_style_pad_hor(fg_system_wifi_network_rows[i], 12, 0);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.surface2}), 0);`)
lines.push(`        lv_obj_set_style_bg_opa(fg_system_wifi_network_rows[i], LV_OPA_COVER, 0);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.border}), 0);`)
lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 1, 0);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.text}), 0);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_PRESSED);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_PRESSED);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.bg}), LV_STATE_PRESSED);`)
lines.push(`        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_80, LV_STATE_PRESSED);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.surface}), LV_STATE_FOCUSED);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_FOCUSED);`)
lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUSED);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.text}), LV_STATE_FOCUSED);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.surface}), LV_STATE_FOCUS_KEY);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_FOCUS_KEY);`)
lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 2, LV_STATE_FOCUS_KEY);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.text}), LV_STATE_FOCUS_KEY);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_CHECKED);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.accent}), LV_STATE_CHECKED);`)
lines.push(`        lv_obj_set_style_border_width(fg_system_wifi_network_rows[i], 3, LV_STATE_CHECKED);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.bg}), LV_STATE_CHECKED);`)
lines.push(`        lv_obj_set_style_bg_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.surface2}), LV_STATE_DISABLED);`)
lines.push(`        lv_obj_set_style_border_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.border}), LV_STATE_DISABLED);`)
lines.push(`        lv_obj_set_style_text_color(fg_system_wifi_network_rows[i], lv_color_hex(${palette.text}), LV_STATE_DISABLED);`)
lines.push(`        lv_obj_set_style_opa(fg_system_wifi_network_rows[i], LV_OPA_40, LV_STATE_DISABLED);`)
lines.push(`        lv_obj_add_event_cb(fg_system_wifi_network_rows[i], fg_system_wifi_network_cb, LV_EVENT_CLICKED, (void *)(intptr_t)i);`)
lines.push(`        fg_system_wifi_network_labels[i] = lv_label_create(fg_system_wifi_network_rows[i]);`)
lines.push(`        lv_obj_align(fg_system_wifi_network_labels[i], LV_ALIGN_LEFT_MID, 0, 0);`)
lines.push(`        lv_obj_set_width(fg_system_wifi_network_labels[i], 458);`)
lines.push(`        lv_label_set_long_mode(fg_system_wifi_network_labels[i], LV_LABEL_LONG_DOT);`)
lines.push(`        lv_obj_add_flag(fg_system_wifi_network_rows[i], LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    }`)
lines.push(`    lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`    fg_system_wifi_password_dialog = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_password_dialog, 560, 330);`)
lines.push(`    lv_obj_set_align(fg_system_wifi_password_dialog, LV_ALIGN_TOP_LEFT);`)
lines.push(`    lv_obj_set_pos(fg_system_wifi_password_dialog, 232, 135);`)
lines.push(`    fg_system_wifi_password_title = lv_label_create(fg_system_wifi_password_dialog);`)
lines.push(`    lv_label_set_text(fg_system_wifi_password_title, "Enter Wi-Fi Password");`)
lines.push(`    lv_obj_align(fg_system_wifi_password_title, LV_ALIGN_TOP_MID, 0, 12);`)
lines.push(`    fg_system_wifi_password_input = lv_textarea_create(fg_system_wifi_password_dialog);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_password_input, 470, 60);`)
lines.push(`    lv_obj_align(fg_system_wifi_password_input, LV_ALIGN_TOP_MID, 0, 65);`)
lines.push(`    lv_textarea_set_one_line(fg_system_wifi_password_input, true);`)
lines.push(`    lv_textarea_set_password_mode(fg_system_wifi_password_input, true);`)
lines.push(`    lv_textarea_set_max_length(fg_system_wifi_password_input, 63);`)
lines.push(`    lv_textarea_set_placeholder_text(fg_system_wifi_password_input, "8 to 63 characters");`)
lines.push(`    lv_obj_add_flag(fg_system_wifi_password_input, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_FOCUSED, NULL);`)
lines.push(`    lv_obj_add_event_cb(fg_system_wifi_password_input, fg_keyboard_open_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    fg_system_wifi_password_error = lv_label_create(fg_system_wifi_password_dialog);`)
lines.push(`    lv_label_set_text(fg_system_wifi_password_error, "");`)
lines.push(`    lv_obj_set_style_text_color(fg_system_wifi_password_error, lv_color_hex(0xEF4444), 0);`)
lines.push(`    lv_obj_align(fg_system_wifi_password_error, LV_ALIGN_TOP_MID, 0, 128);`)
lines.push(`    lv_obj_t * password_show = fg_system_create_button(fg_system_wifi_password_dialog, "Show / Hide", 36, 145, 150, 50);`)
lines.push(`    lv_obj_add_event_cb(password_show, fg_system_wifi_password_show_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * password_remember = fg_system_create_button(fg_system_wifi_password_dialog, LV_SYMBOL_OK " Remember password", 196, 145, 310, 50);`)
lines.push(`    lv_obj_add_event_cb(password_remember, fg_system_wifi_remember_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * password_cancel = fg_system_create_button(fg_system_wifi_password_dialog, "Cancel", 36, 220, 220, 58);`)
lines.push(`    lv_obj_add_event_cb(password_cancel, fg_system_wifi_password_cancel_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * password_connect = fg_system_create_button(fg_system_wifi_password_dialog, "Connect", 276, 220, 230, 58);`)
lines.push(`    lv_obj_add_event_cb(password_connect, fg_system_wifi_password_connect_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN);`)
lines.push(``)
lines.push(`    fg_system_wifi_forget_dialog = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_wifi_forget_dialog, 540, 240);`)
lines.push(`    lv_obj_center(fg_system_wifi_forget_dialog);`)
lines.push(`    lv_obj_t * forget_text = lv_label_create(fg_system_wifi_forget_dialog);`)
lines.push(`    lv_label_set_text(forget_text, "Forget saved Wi-Fi credentials?\\nA password will be required to reconnect.");`)
lines.push(`    lv_obj_align(forget_text, LV_ALIGN_TOP_MID, 0, 25);`)
lines.push(`    lv_obj_t * forget_cancel = fg_system_create_button(fg_system_wifi_forget_dialog, "Cancel", 30, 135, 220, 58);`)
lines.push(`    lv_obj_add_event_cb(forget_cancel, fg_system_wifi_forget_cancel_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * forget_confirm = fg_system_create_button(fg_system_wifi_forget_dialog, "Forget Network", 270, 135, 230, 58);`)
lines.push(`    lv_obj_add_event_cb(forget_confirm, fg_system_wifi_forget_confirm_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_wifi_forget_dialog, LV_OBJ_FLAG_HIDDEN);`)
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
clockExports.forEach(clockExport => {
  lines.push(`    ${clockExport.tickCallbackName}(NULL);`)
  lines.push(`    ${clockExport.timerName} = lv_timer_create(${clockExport.tickCallbackName}, 1000, NULL);`)
})
if (clockExports.size > 0) lines.push(``)
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
      ).concat(Array.from(ledExports.values()).map(
        ledExport => `void ${ledExport.apiName}(bool on);`,
      )).concat(Array.from(barExports.values()).map(
        barExport => `void ${barExport.apiName}(int32_t value);`,
      )).concat(Array.from(progressExports.values()).map(
        progressExport => `void ${progressExport.apiName}(int32_t value);`,
      )).concat(Array.from(numberInputExports.values()).map(
        numberInputExport => `void ${numberInputExport.apiName}(int32_t value);`,
      )).concat(Array.from(selectExports.values()).map(
        selectExport => `void ${selectExport.apiName}(uint32_t index);`,
      )).concat(Array.from(imageExports.values()).map(
        imageExport => `void ${imageExport.apiName}(const void * src);`,
      )).concat(Array.from(boxExports.values()).map(
        boxExport => `void ${boxExport.apiName}(bool visible);`,
      )).concat(Array.from(iconButtonExports.values()).map(
        iconButtonExport => `void ${iconButtonExport.apiName}(bool enabled);`,
      )).concat(Array.from(arcExports.values()).map(
        arcExport => `void ${arcExport.apiName}(int32_t value);`,
      )).concat(Array.from(chartExports.values()).flatMap(
        chartExport => [
          `void ${chartExport.addApiName}(int32_t value);`,
          `void ${chartExport.clearApiName}(void);`,
        ],
      )).concat(Array.from(keyboardExports.values()).flatMap(
        keyboardExport => [
          `void ${keyboardExport.showApiName}(void);`,
          `void ${keyboardExport.hideApiName}(void);`,
        ],
      )).concat(Array.from(calendarExports.values()).map(
        calendarExport =>
          `void ${calendarExport.apiName}(uint16_t year, uint8_t month, uint8_t day);`,
      )).concat(Array.from(rollerExports.values()).map(
        rollerExport =>
          `void ${rollerExport.apiName}(uint32_t index);`,
      )).concat(Array.from(messageBoxExports.values()).flatMap(
        messageExport => [
          `void ${messageExport.showApiName}(void);`,
          `void ${messageExport.closeApiName}(void);`,
        ],
      )).concat(Array.from(buttonMatrixExports.values()).map(
        matrixExport =>
          `void ${matrixExport.apiName}(uint32_t button_index);`,
      )).concat(Array.from(tabViewExports.values()).map(
        tabViewExport =>
          `void ${tabViewExport.apiName}(uint32_t tab_index);`,
      )).concat(Array.from(tileViewExports.values()).map(
        tileViewExport =>
          `void ${tileViewExport.apiName}(uint32_t column, uint32_t row);`,
      )).concat(Array.from(inputExports.values()).map(
        inputExport =>
          `void ${inputExport.apiName}(const char * text);`,
      )).concat(Array.from(switchExports.values()).map(
        switchExport =>
          `void ${switchExport.apiName}(bool checked);`,
      )).concat(Array.from(checkboxExports.values()).map(
        checkboxExport =>
          `void ${checkboxExport.apiName}(bool checked);`,
      )).concat(Array.from(radioExports.values()).map(
        radioExport =>
          `void ${radioExport.apiName}(bool selected);`,
      )),
  }
}
