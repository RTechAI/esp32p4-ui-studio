import {
  forgeUIGetUploadedAssets,
  forgeUIResolveUploadedAssetDimensions,
} from './ForgeUIUploadedAssetRegistry'
import {
  FORGEUI_IMAGE_ASSETS,
  FORGEUI_WEATHER_BACKGROUND_PACK,
  type ForgeUIBackgroundAsset,
} from './ForgeUIAssetRegistry'
import { FORGEUI_WEATHER_RUNTIME_BACKGROUND_KEYS } from './weather/ForgeUIWeatherBackgrounds'
import { allocateUniqueOutputApiName } from './ForgeUIGeneratedApiNames'
import { getForgeUIStandardButtonText } from './ForgeUIStandardButton'
import { getForgeUIStandardCheckboxText } from './ForgeUIStandardCheckbox'
import { getForgeUIStandardRadioText } from './ForgeUIStandardRadio'
import { getForgeUIStandardTextValue } from './ForgeUIStandardText'
import { getForgeUIStandardHeadingPresentation } from './ForgeUIStandardHeading'
import { getForgeUIStandardBoxPresentation } from './ForgeUIStandardBox'
import { getForgeUIStandardDividerPresentation } from './ForgeUIStandardDivider'
import {
  getForgeUIStandardIconPresentation,
  getForgeUIStandardIconSourceDimensions,
} from './ForgeUIStandardIcon'
import { getForgeUIStandardLineGeometry } from './ForgeUIStandardLine'
import {
  getForgeUIStandardImagePresentation,
  resolveForgeUIStandardImageAsset,
} from './ForgeUIStandardImage'
import {
  FORGEUI_STANDARD_CHART_DEFAULT_DATA,
  FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT,
  getForgeUIStandardChartLayout,
  getForgeUIStandardChartModel,
} from './ForgeUIStandardChart'
import {
  FORGEUI_TAB_TILE_BORDER_WIDTH,
  getForgeUITabViewGeometry,
} from './ForgeUIStandardTabTileGeometry'
import {
  getForgeUIStandardClockPresentation,
  type ForgeUIClockHourFormat,
} from './ForgeUIStandardClock'
import {
  getForgeUIStandardWifiStatusPresentation,
  type ForgeUIWifiStatusDisplayMode,
} from './ForgeUIStandardWifiStatus'
import {
  getForgeUIQRCodeGeometry,
  resolveQRCodePayload,
} from './ForgeUIStandardQRCode'
import { getForgeUIStandardListModel } from './ForgeUIStandardList'
import { normalizeForgeUISpans, normalizeFrameAssetIds } from './ForgeUIClosureWidgets'
import { normalizeWindowActions, windowScrollbarMode } from './ForgeUIWindow'
import { normalizeForgeUIMenuPages, resolveForgeUIMenuRootPageId } from './ForgeUIMenu'
import { normalizeForgeUIDashboardCard } from './ForgeUIDashboardCard'
import { getForgeUISensorTrendLabel, normalizeForgeUISensorTile } from './ForgeUISensorTile'
import { normalizeForgeUIRelayPanel } from './ForgeUIRelayPanel'
import { normalizeForgeUIPwmController } from './ForgeUIPwmController'
import { normalizeForgeUITrendChartPro } from './ForgeUITrendChartPro'
import { normalizeForgeUIAlarmPanel } from './ForgeUIAlarmPanel'
import { normalizeForgeUIIOMonitor } from './ForgeUIIOMonitor'
import { normalizeForgeUIBatteryCard } from './ForgeUIBatteryCard'
import { normalizeForgeUITankLevelCard } from './ForgeUITankLevelCard'
import { normalizeForgeUINetworkStatusCard } from './ForgeUINetworkStatusCard'
import { normalizeForgeUIDeviceSummaryCard } from './ForgeUIDeviceSummaryCard'
import { normalizeForgeUIKpiCard } from './ForgeUIKpiCard'
import { normalizeForgeUIPowerFlowCard } from './ForgeUIPowerFlowCard'
import {
  getForgeUIStandardSpinboxModel,
  type ForgeUIStandardSpinboxModel,
} from './ForgeUIStandardSpinbox'
import type { ForgeUIFirmwareFeatures } from './boards/ForgeUIBoardProfile'

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
import forgeUIStudioAssets from '../../forgeui-studio-assets.json'

const toLvHex = (
  value: string,
  fallback = '0x000000',
) => {
  if (!value) return fallback

  return `0x${String(value)
    .replace('#', '')
    .toUpperCase()}`
}

const FG_TEXTURE_ASSETS: Record<string, { symbol: string; source: string }> =
  forgeUIStudioAssets.textures

const FG_ICON_LVGL_SYMBOLS: Record<string, string> = {
  FiWifi: 'LV_SYMBOL_WIFI',
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

// Escape text that is embedded inside a printf-style C format string. C
// string escaping remains owned by esc(); this helper only makes every user
// percent character literal so units can never introduce a conversion.
const escPrintfLiteral = (value: string = '') => esc(value).replace(/%/g, '%%')

// C rejects integer spellings with a floating suffix (for example 50f).
// Always include a decimal point for whole-number finite values.
const cFloatLiteral = (value: number) =>
  `${Number.isInteger(value) ? `${value}.0` : value}f`
    .replace(/\t/g, '\\t')

const supportedMontserratSizes = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48]

const resolveMontserratSize = (value: unknown, fallback: number) => {
  const requested = Number(value)
  if (!Number.isFinite(requested)) return fallback
  return supportedMontserratSizes.reduce((nearest, size) =>
    Math.abs(size - requested) < Math.abs(nearest - requested) ? size : nearest,
  supportedMontserratSizes[0])
}

const toCFloatLiteral = (value: number): string => {
  if (!Number.isFinite(value)) return '0.0f'
  if (Object.is(value, -0) || value === 0) return '0.0f'
  if (Number.isInteger(value)) return `${value.toFixed(1)}f`

  const fixed = value.toFixed(9).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, '$1')
  return `${fixed.includes('.') ? fixed : `${fixed}.0`}f`
}

const resolveLvTextAlign = (value: unknown) => {
  if (value === 'center') return 'LV_TEXT_ALIGN_CENTER'
  if (value === 'right' || value === 'end') return 'LV_TEXT_ALIGN_RIGHT'
  return 'LV_TEXT_ALIGN_LEFT'
}

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

type ButtonExport = {
  hookName: string
  eventCallbackName: string
}

type DashboardCardExport = {
  stem: string
  rootName: string
  titleName: string
  valueName: string
  unitsName: string
  descriptionName: string
  statusName: string
  statusIndicatorName: string
  progressName: string
  footerName: string
  titleApiName: string
  valueApiName: string
  unitsApiName: string
  descriptionApiName: string
  statusApiName: string
  progressApiName: string
  footerApiName: string
  colourApiName: string
  hookName?: string
  callbackName?: string
  runtimeEnabled: boolean
}

const createDashboardCardExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
): Map<string, DashboardCardExport> => {
  const result = new Map<string, DashboardCardExport>()
  const usedStems = new Set<string>()
  Object.values(components)
    .filter(component => component.type === 'DashboardCard')
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const base = toCIdentifier(component.id, 'Dashboard_Card')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base
      let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const model = normalizeForgeUIDashboardCard(component.props)
      const hookName = model.enableClick
        ? createUniqueHookName(stem, usedHookNames)
        : undefined
      if (hookName) userEventHooks.add(hookName)
      const runtimeStem = stem.toLowerCase()
      result.set(component.id, {
        stem,
        rootName: `fg_${runtimeStem}_dashboard_card`,
        titleName: `fg_${runtimeStem}_dashboard_card_title`,
        valueName: `fg_${runtimeStem}_dashboard_card_value`,
        unitsName: `fg_${runtimeStem}_dashboard_card_units`,
        descriptionName: `fg_${runtimeStem}_dashboard_card_description`,
        statusName: `fg_${runtimeStem}_dashboard_card_status`,
        statusIndicatorName: `fg_${runtimeStem}_dashboard_card_status_indicator`,
        progressName: `fg_${runtimeStem}_dashboard_card_progress`,
        footerName: `fg_${runtimeStem}_dashboard_card_footer`,
        titleApiName: `FG_Set_${stem}_Title`,
        valueApiName: `FG_Set_${stem}_Value`,
        unitsApiName: `FG_Set_${stem}_Units`,
        descriptionApiName: `FG_Set_${stem}_Description`,
        statusApiName: `FG_Set_${stem}_Status`,
        progressApiName: `FG_Set_${stem}_Progress`,
        footerApiName: `FG_Set_${stem}_Footer`,
        colourApiName: `FG_Set_${stem}_Colour`,
        hookName,
        callbackName: hookName ? `fg_${runtimeStem}_dashboard_card_clicked_cb` : undefined,
        runtimeEnabled: component.props.generateRuntimeApi !== false,
      })
    })
  return result
}

type SensorTileExport = {
  stem: string; rootName: string; iconName: string; valueName: string; unitsName: string;
  statusName: string; statusIndicatorName: string; trendName: string;
  timestampName: string; progressName: string;
  valueApiName: string; unitsApiName: string; statusApiName: string;
  trendApiName: string; timestampApiName: string; colourApiName: string;
  hookName?: string; callbackName?: string;
  decimals: number; rangeMin: number; rangeMax: number; warningLow: number;
  warningHigh: number; criticalLow: number; criticalHigh: number; autoColour: boolean;
  runtimeEnabled: boolean;
}

const createSensorTileExports = (
  components: IComponents, usedHookNames: Set<string>, userEventHooks: Set<string>,
): Map<string, SensorTileExport> => {
  const result = new Map<string, SensorTileExport>()
  const usedStems = new Set<string>()
  Object.values(components).filter(component => component.type === 'SensorTile')
    .sort((a, b) => a.id.localeCompare(b.id)).forEach(component => {
      const base = toCIdentifier(component.id, 'Sensor_Tile').replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base; let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeStem = stem.toLowerCase()
      const model = normalizeForgeUISensorTile(component.props)
      const hookName = model.enableClick ? createUniqueHookName(stem, usedHookNames) : undefined
      if (hookName) userEventHooks.add(hookName)
      result.set(component.id, {
        stem, rootName: `fg_${runtimeStem}_sensor_tile`, iconName: `fg_${runtimeStem}_sensor_tile_icon`, valueName: `fg_${runtimeStem}_sensor_tile_value`,
        unitsName: `fg_${runtimeStem}_sensor_tile_units`, statusName: `fg_${runtimeStem}_sensor_tile_status`,
        statusIndicatorName: `fg_${runtimeStem}_sensor_tile_status_indicator`, trendName: `fg_${runtimeStem}_sensor_tile_trend`,
        timestampName: `fg_${runtimeStem}_sensor_tile_timestamp`, progressName: `fg_${runtimeStem}_sensor_tile_progress`,
        valueApiName: `FG_Set_${stem}_Value`, unitsApiName: `FG_Set_${stem}_Units`, statusApiName: `FG_Set_${stem}_Status`,
        trendApiName: `FG_Set_${stem}_Trend`, timestampApiName: `FG_Set_${stem}_Timestamp`, colourApiName: `FG_Set_${stem}_Colour`,
        hookName, callbackName: hookName ? `fg_${runtimeStem}_sensor_tile_clicked_cb` : undefined,
        decimals: model.decimals, rangeMin: model.rangeMin, rangeMax: model.rangeMax,
        warningLow: model.warningLow, warningHigh: model.warningHigh,
        criticalLow: model.criticalLow, criticalHigh: model.criticalHigh, autoColour: model.autoColour,
        runtimeEnabled: component.props.generateRuntimeApi !== false,
      })
    })
  return result
}

type RelayPanelExport = {
  stem: string
  runtimeStem: string
  rootName: string
  channelCount: number
  channelObjectsName: string
  labelObjectsName: string
  statusObjectsName: string
  stateName: string
  enabledName: string
  programmaticName: string
  channelHookName?: string
  masterHookName?: string
  channelCallbackName?: string
  masterCallbackName?: string
  masterObjectName: string
  runtimeEnabled: boolean
  setChannelApiName: string
  getChannelApiName: string
  setChannelEnabledApiName: string
  setAllApiName: string
  setLabelApiName: string
  setStatusApiName: string
  setMasterApiName: string
}

const createRelayPanelExports = (
  components: IComponents, usedHookNames: Set<string>, userEventHooks: Set<string>,
): Map<string, RelayPanelExport> => {
  const result = new Map<string, RelayPanelExport>()
  const usedStems = new Set<string>()
  Object.values(components).filter(component => component.type === 'RelayPanel')
    .sort((a, b) => a.id.localeCompare(b.id)).forEach(component => {
      const base = toCIdentifier(component.id, 'Relay_Panel').replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base; let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeStem = stem.toLowerCase()
      const model = normalizeForgeUIRelayPanel(component.props)
      const uniqueHook = (baseHook: string) => {
        let hook = baseHook
        let collision = 2
        while (usedHookNames.has(hook)) hook = `${baseHook}_${collision++}`
        usedHookNames.add(hook)
        userEventHooks.add(hook)
        return hook
      }
      const channelHookName = model.enableUserEvents
        ? uniqueHook(`FG_On_${stem}_Channel_Changed`) : undefined
      const masterHookName = model.enableUserEvents && model.showMasterControl
        ? uniqueHook(`FG_On_${stem}_Master_Changed`) : undefined
      result.set(component.id, {
        stem, runtimeStem, rootName: `fg_${runtimeStem}_relay_panel`, channelCount: model.channelCount,
        channelObjectsName: `fg_${runtimeStem}_relay_channels`, labelObjectsName: `fg_${runtimeStem}_relay_labels`,
        statusObjectsName: `fg_${runtimeStem}_relay_status`, stateName: `fg_${runtimeStem}_relay_state`,
        enabledName: `fg_${runtimeStem}_relay_enabled`, programmaticName: `fg_${runtimeStem}_relay_programmatic`,
        channelHookName, masterHookName, channelCallbackName: channelHookName ? `fg_${runtimeStem}_relay_channel_changed_cb` : undefined,
        masterCallbackName: masterHookName ? `fg_${runtimeStem}_relay_master_changed_cb` : undefined,
        masterObjectName: `fg_${runtimeStem}_relay_master`, runtimeEnabled: model.generateRuntimeApi,
        setChannelApiName: `FG_Set_${stem}_Channel`, getChannelApiName: `FG_Get_${stem}_Channel`,
        setChannelEnabledApiName: `FG_Set_${stem}_Channel_Enabled`, setAllApiName: `FG_Set_${stem}_All`,
        setLabelApiName: `FG_Set_${stem}_Label`, setStatusApiName: `FG_Set_${stem}_Status`,
        setMasterApiName: `FG_Set_${stem}_Master`,
      })
    })
  return result
}

type PwmControllerExport = {
  stem: string; runtimeStem: string; rootName: string; sliderName: string; valueLabelName: string
  enableName: string; stateName: string; enabledName: string; programmaticName: string
  scale: number; minimum: number; maximum: number; step: number; runtimeEnabled: boolean
  unit: string
  initialValue: number; initialEnabled: boolean
  valueHookName?: string; enabledHookName?: string; valueCallbackName?: string; enabledCallbackName?: string
  setValueApiName: string; getValueApiName: string; setEnabledApiName: string; getEnabledApiName: string
}

const createPwmControllerExports = (
  components: IComponents, usedHookNames: Set<string>, userEventHooks: Set<string>,
): Map<string, PwmControllerExport> => {
  const result = new Map<string, PwmControllerExport>()
  const usedStems = new Set<string>()
  Object.values(components).filter(component => component.type === 'PwmController')
    .sort((a, b) => a.id.localeCompare(b.id)).forEach(component => {
      const base = toCIdentifier(component.id, 'Pwm_Controller').replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base; let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeStem = stem.toLowerCase()
      const model = normalizeForgeUIPwmController(component.props)
      const decimals = Math.min(6, Math.max(0, ...[model.minimum, model.maximum, model.step, model.value].map(value => {
        const part = String(value).split('.')[1]; return part ? part.length : 0
      })))
      const scale = Math.pow(10, decimals)
      const uniqueHook = (name: string) => { let hook = name; let collision = 2; while (usedHookNames.has(hook)) hook = `${name}_${collision++}`; usedHookNames.add(hook); userEventHooks.add(hook); return hook }
      const valueHookName = model.enableUserEvents ? uniqueHook(`FG_On_${stem}_Value_Changed`) : undefined
      const enabledHookName = model.enableUserEvents ? uniqueHook(`FG_On_${stem}_Enabled_Changed`) : undefined
      result.set(component.id, {
        stem, runtimeStem, rootName: `fg_${runtimeStem}_pwm`, sliderName: `fg_${runtimeStem}_pwm_slider`,
        valueLabelName: `fg_${runtimeStem}_pwm_value_label`, enableName: `fg_${runtimeStem}_pwm_enable`,
        stateName: `fg_${runtimeStem}_pwm_value`, enabledName: `fg_${runtimeStem}_pwm_enabled`,
        programmaticName: `fg_${runtimeStem}_pwm_programmatic`, scale, minimum: model.minimum, maximum: model.maximum, step: model.step,
        runtimeEnabled: model.generateRuntimeApi, unit: model.unit, initialValue: model.value, initialEnabled: model.enabled,
        valueHookName, enabledHookName,
        valueCallbackName: valueHookName ? `fg_${runtimeStem}_pwm_value_changed_cb` : undefined,
        enabledCallbackName: enabledHookName ? `fg_${runtimeStem}_pwm_enabled_changed_cb` : undefined,
        setValueApiName: `FG_Set_${stem}_Value`, getValueApiName: `FG_Get_${stem}_Value`,
        setEnabledApiName: `FG_Set_${stem}_Enabled`, getEnabledApiName: `FG_Get_${stem}_Enabled`,
      })
    })
  return result
}

type AlarmPanelExport = {
  model: ReturnType<typeof normalizeForgeUIAlarmPanel>
  stem: string; runtimeStem: string; rootName: string; capacity: number; visibleRows: number
  runtimeEnabled: boolean; eventsEnabled: boolean; enabledName: string; countName: string
  idsName: string; occupiedName: string; messagesName: string; timestampsName: string
  statesName: string; prioritiesName: string; rowNames: string; rowLabelNames: string
  rowStateLabelNames: string; rowPriorityLabelNames: string; rowAckLabelNames: string; countLabelName: string
  refreshName: string; selectedRowName: string; selectCallbackName?: string
  addApiName: string; acknowledgeApiName: string; clearApiName: string
  clearAllApiName: string; setEnabledApiName: string; selectApiName: string
  addedHookName?: string; acknowledgedHookName?: string; clearedHookName?: string; selectedHookName?: string
}

const createAlarmPanelExports = (
  components: IComponents, usedHookNames: Set<string>, userEventHooks: Set<string>,
): Map<string, AlarmPanelExport> => {
  const result = new Map<string, AlarmPanelExport>()
  const usedStems = new Set<string>()
  Object.values(components).filter(component => component.type === 'AlarmPanel')
    .sort((a, b) => a.id.localeCompare(b.id)).forEach(component => {
      const base = toCIdentifier(component.id, 'Alarm_Panel').replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base; let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeStem = stem.toLowerCase()
      const model = normalizeForgeUIAlarmPanel(component.props)
      const uniqueHook = (suffixName: string) => {
        const baseHook = `FG_On_${stem}_${suffixName}`
        let hook = baseHook; let collision = 2
        while (usedHookNames.has(hook)) hook = `${baseHook}_${collision++}`
        usedHookNames.add(hook); userEventHooks.add(hook); return hook
      }
      const events = model.enableUserEvents
      result.set(component.id, {
        model, stem, runtimeStem, capacity: model.alarmCapacity, visibleRows: model.maximumVisible,
        runtimeEnabled: model.generateRuntimeApi, eventsEnabled: events,
        rootName: `fg_${runtimeStem}_alarm_panel`, enabledName: `fg_${runtimeStem}_alarm_enabled`,
        countName: `fg_${runtimeStem}_alarm_count`, idsName: `fg_${runtimeStem}_alarm_ids`,
        occupiedName: `fg_${runtimeStem}_alarm_occupied`, messagesName: `fg_${runtimeStem}_alarm_messages`,
        timestampsName: `fg_${runtimeStem}_alarm_timestamps`, statesName: `fg_${runtimeStem}_alarm_states`,
        prioritiesName: `fg_${runtimeStem}_alarm_priorities`, rowNames: `fg_${runtimeStem}_alarm_rows`,
        rowLabelNames: `fg_${runtimeStem}_alarm_row_labels`, rowStateLabelNames: `fg_${runtimeStem}_alarm_row_state_labels`,
        rowPriorityLabelNames: `fg_${runtimeStem}_alarm_row_priority_labels`, rowAckLabelNames: `fg_${runtimeStem}_alarm_row_ack_labels`,
        countLabelName: `fg_${runtimeStem}_alarm_count_label`, refreshName: `fg_${runtimeStem}_alarm_refresh`,
        selectedRowName: `fg_${runtimeStem}_alarm_selected_rows`,
        selectCallbackName: events ? `fg_${runtimeStem}_alarm_selected_cb` : undefined,
        addApiName: `FG_Add_${stem}_Alarm`, acknowledgeApiName: `FG_Acknowledge_${stem}_Alarm`,
        clearApiName: `FG_Clear_${stem}_Alarm`, clearAllApiName: `FG_Clear_All_${stem}`,
        setEnabledApiName: `FG_Set_${stem}_Enabled`, selectApiName: `FG_Select_${stem}_Alarm`,
        addedHookName: events ? uniqueHook('Alarm_Added') : undefined,
        acknowledgedHookName: events ? uniqueHook('Alarm_Acknowledged') : undefined,
        clearedHookName: events ? uniqueHook('Alarm_Cleared') : undefined,
        selectedHookName: events ? uniqueHook('Alarm_Selected') : undefined,
      })
    })
  return result
}

type IOMonitorExport = {
  model: ReturnType<typeof normalizeForgeUIIOMonitor>
  stem: string; runtimeStem: string; rootName: string; rowCount: number
  rowNames: string; channelLabels: string; nameLabels: string; valueLabels: string; stateLabels: string
  channelsName: string; typesName: string; valuesName: string; statesName: string
  refreshName: string; selectCallbackName?: string; selectedHookName?: string
  runtimeEnabled: boolean; eventsEnabled: boolean
  setDigitalInputApiName: string; setDigitalOutputApiName: string
  setAnalogInputApiName: string; setAnalogOutputApiName: string
}

const createIOMonitorExports = (
  components: IComponents, usedHookNames: Set<string>, userEventHooks: Set<string>,
): Map<string, IOMonitorExport> => {
  const result = new Map<string, IOMonitorExport>()
  const usedStems = new Set<string>()
  Object.values(components).filter(component => component.type === 'IOMonitor')
    .sort((a, b) => a.id.localeCompare(b.id)).forEach(component => {
      const base = toCIdentifier(component.id, 'IO_Monitor').replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let stem = base; let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeStem = stem.toLowerCase()
      const model = normalizeForgeUIIOMonitor(component.props)
      let selectedHookName: string | undefined
      if (model.enableUserEvents) {
        const baseHook = `FG_On_${stem}_Row_Selected`
        selectedHookName = baseHook; let collision = 2
        while (usedHookNames.has(selectedHookName)) selectedHookName = `${baseHook}_${collision++}`
        usedHookNames.add(selectedHookName); userEventHooks.add(selectedHookName)
      }
      result.set(component.id, {
        model, stem, runtimeStem, rowCount: Math.max(1, model.rows.length),
        rootName: `fg_${runtimeStem}_io_monitor`, rowNames: `fg_${runtimeStem}_io_rows`,
        channelLabels: `fg_${runtimeStem}_io_channel_labels`, nameLabels: `fg_${runtimeStem}_io_name_labels`,
        valueLabels: `fg_${runtimeStem}_io_value_labels`, stateLabels: `fg_${runtimeStem}_io_state_labels`,
        channelsName: `fg_${runtimeStem}_io_channels`, typesName: `fg_${runtimeStem}_io_types`,
        valuesName: `fg_${runtimeStem}_io_values`, statesName: `fg_${runtimeStem}_io_states`,
        refreshName: `fg_${runtimeStem}_io_refresh`,
        selectCallbackName: selectedHookName ? `fg_${runtimeStem}_io_selected_cb` : undefined,
        selectedHookName, runtimeEnabled: model.generateRuntimeApi, eventsEnabled: model.enableUserEvents,
        setDigitalInputApiName: `FG_Set_${stem}_DigitalInput`, setDigitalOutputApiName: `FG_Set_${stem}_DigitalOutput`,
        setAnalogInputApiName: `FG_Set_${stem}_AnalogInput`, setAnalogOutputApiName: `FG_Set_${stem}_AnalogOutput`,
      })
    })
  return result
}

type BatteryCardExport = {
  model: ReturnType<typeof normalizeForgeUIBatteryCard>; stem: string; runtimeStem: string
  rootName: string; percentageLabel: string; statusLabel: string; iconFillName: string
  voltageLabel: string; currentLabel: string; runtimeLabel: string; temperatureLabel: string
  healthLabel: string; barName: string
  percentageName: string; voltageName: string; currentName: string; chargingName: string
  runtimeName: string; temperatureName: string; healthName: string; refreshName: string
  runtimeEnabled: boolean
}

const createBatteryCardExports = (components: IComponents): Map<string, BatteryCardExport> => {
  const result = new Map<string, BatteryCardExport>(); const used = new Set<string>()
  Object.values(components).filter(component => component.type === 'BatteryCard').sort((a,b) => a.id.localeCompare(b.id)).forEach(component => {
    const base = toCIdentifier(component.id, 'Battery_Card').replace(/([a-z0-9])([A-Z])/g, '$1_$2'); let stem = base; let suffix = 2
    while (used.has(stem)) stem = `${base}_${suffix++}`; used.add(stem)
    const runtimeStem = stem.toLowerCase(); const model = normalizeForgeUIBatteryCard(component.props); const p = `fg_${runtimeStem}_battery`
    result.set(component.id, { model, stem, runtimeStem, rootName: p, percentageLabel: `${p}_percentage_label`, statusLabel: `${p}_status_label`, iconFillName: `${p}_icon_fill`, voltageLabel: `${p}_voltage_label`, currentLabel: `${p}_current_label`, runtimeLabel: `${p}_runtime_label`, temperatureLabel: `${p}_temperature_label`, healthLabel: `${p}_health_label`, barName: `${p}_bar`, percentageName: `${p}_percentage`, voltageName: `${p}_voltage`, currentName: `${p}_current`, chargingName: `${p}_charging`, runtimeName: `${p}_runtime`, temperatureName: `${p}_temperature`, healthName: `${p}_health`, refreshName: `${p}_refresh`, runtimeEnabled: model.generateRuntimeApi })
  }); return result
}

type TankLevelCardExport = {
  model: ReturnType<typeof normalizeForgeUITankLevelCard>; stem: string
  rootName: string; tankName: string; fillName: string; percentageLabel: string
  volumeLabel: string; statusLabel: string; lowLabel: string; highLabel: string; criticalLabel: string
  levelName: string; volumeName: string; capacityName: string; unitsName: string
  lowName: string; highName: string; refreshName: string; runtimeEnabled: boolean
}

const createTankLevelCardExports = (components: IComponents): Map<string, TankLevelCardExport> => {
  const result = new Map<string, TankLevelCardExport>(); const used = new Set<string>()
  Object.values(components).filter(component => component.type === 'TankLevelCard').sort((a,b) => a.id.localeCompare(b.id)).forEach(component => {
    const base = toCIdentifier(component.id, 'Tank_Level_Card').replace(/([a-z0-9])([A-Z])/g, '$1_$2'); let stem = base; let suffix = 2
    while (used.has(stem)) stem = `${base}_${suffix++}`; used.add(stem)
    const p = `fg_${stem.toLowerCase()}_tank`; const model = normalizeForgeUITankLevelCard(component.props)
    result.set(component.id, { model, stem, rootName: p, tankName: `${p}_vessel`, fillName: `${p}_fill`, percentageLabel: `${p}_percentage_label`, volumeLabel: `${p}_volume_label`, statusLabel: `${p}_status_label`, lowLabel: `${p}_low_label`, highLabel: `${p}_high_label`, criticalLabel: `${p}_critical_label`, levelName: `${p}_level`, volumeName: `${p}_volume`, capacityName: `${p}_capacity`, unitsName: `${p}_units`, lowName: `${p}_low`, highName: `${p}_high`, refreshName: `${p}_refresh`, runtimeEnabled: model.generateRuntimeApi })
  }); return result
}

type NetworkStatusCardExport = {
  model: ReturnType<typeof normalizeForgeUINetworkStatusCard>; stem: string; rootName: string
  stateLabel: string; nameLabel: string; ipLabel: string; hostnameLabel: string; statusLabel: string; barName: string
  connectedName: string; networkName: string; ipName: string; signalName: string; statusName: string; typeName: string
  refreshName: string; runtimeEnabled: boolean
}
const createNetworkStatusCardExports = (components: IComponents): Map<string, NetworkStatusCardExport> => {
  const result = new Map<string, NetworkStatusCardExport>(); const used = new Set<string>()
  Object.values(components).filter(c => c.type === 'NetworkStatusCard').sort((a,b)=>a.id.localeCompare(b.id)).forEach(c => {
    const base=toCIdentifier(c.id,'Network_Status_Card').replace(/([a-z0-9])([A-Z])/g,'$1_$2'); let stem=base; let suffix=2
    while(used.has(stem)) stem=`${base}_${suffix++}`; used.add(stem); const p=`fg_${stem.toLowerCase()}_network`; const model=normalizeForgeUINetworkStatusCard(c.props)
    result.set(c.id,{model,stem,rootName:p,stateLabel:`${p}_state_label`,nameLabel:`${p}_name_label`,ipLabel:`${p}_ip_label`,hostnameLabel:`${p}_hostname_label`,statusLabel:`${p}_status_label`,barName:`${p}_bar`,connectedName:`${p}_connected`,networkName:`${p}_name`,ipName:`${p}_ip`,signalName:`${p}_signal`,statusName:`${p}_status`,typeName:`${p}_type`,refreshName:`${p}_refresh`,runtimeEnabled:model.generateRuntimeApi})
  }); return result
}

type DeviceSummaryCardExport = {
  model: ReturnType<typeof normalizeForgeUIDeviceSummaryCard>; stem: string; rootName: string
  stateLabel: string; deviceLabel: string; uptimeLabel: string; firmwareLabel: string; networkLabel: string; storageLabel: string
  statusName: string; deviceName: string; uptimeName: string; firmwareName: string; networkName: string; storageName: string
  refreshName: string; runtimeEnabled: boolean
}
const createDeviceSummaryCardExports = (components: IComponents): Map<string, DeviceSummaryCardExport> => {
  const result=new Map<string,DeviceSummaryCardExport>(); const used=new Set<string>()
  Object.values(components).filter(c=>c.type==='DeviceSummaryCard').sort((a,b)=>a.id.localeCompare(b.id)).forEach(c=>{
    const base=toCIdentifier(c.id,'Device_Summary_Card').replace(/([a-z0-9])([A-Z])/g,'$1_$2'); let stem=base; let suffix=2
    while(used.has(stem)) stem=`${base}_${suffix++}`; used.add(stem); const p=`fg_${stem.toLowerCase()}_device_summary`; const model=normalizeForgeUIDeviceSummaryCard(c.props)
    result.set(c.id,{model,stem,rootName:p,stateLabel:`${p}_state_label`,deviceLabel:`${p}_device_label`,uptimeLabel:`${p}_uptime_label`,firmwareLabel:`${p}_firmware_label`,networkLabel:`${p}_network_label`,storageLabel:`${p}_storage_label`,statusName:`${p}_status`,deviceName:`${p}_device`,uptimeName:`${p}_uptime`,firmwareName:`${p}_firmware`,networkName:`${p}_network`,storageName:`${p}_storage`,refreshName:`${p}_refresh`,runtimeEnabled:model.generateRuntimeApi})
  }); return result
}

type KpiCardExport = {
  model: ReturnType<typeof normalizeForgeUIKpiCard>; stem: string; rootName: string
  stateLabel: string; valueLabel: string; unitLabel: string; secondaryLabel: string; trendLabel: string; targetLabel: string; accentName: string
  valueName: string; unitName: string; secondaryName: string; trendTextName: string; trendStateName: string; statusName: string; targetName: string
  refreshName: string; runtimeEnabled: boolean
}
const createKpiCardExports = (components: IComponents): Map<string, KpiCardExport> => {
  const result=new Map<string,KpiCardExport>(); const used=new Set<string>()
  Object.values(components).filter(c=>c.type==='KpiCard').sort((a,b)=>a.id.localeCompare(b.id)).forEach(c=>{
    const base=toCIdentifier(c.id,'Kpi_Card').replace(/([a-z0-9])([A-Z])/g,'$1_$2'); let stem=base; let suffix=2
    while(used.has(stem)) stem=`${base}_${suffix++}`; used.add(stem); const p=`fg_${stem.toLowerCase()}_kpi`; const model=normalizeForgeUIKpiCard(c.props)
    result.set(c.id,{model,stem,rootName:p,stateLabel:`${p}_state_label`,valueLabel:`${p}_value_label`,unitLabel:`${p}_unit_label`,secondaryLabel:`${p}_secondary_label`,trendLabel:`${p}_trend_label`,targetLabel:`${p}_target_label`,accentName:`${p}_accent`,valueName:`${p}_value`,unitName:`${p}_unit`,secondaryName:`${p}_secondary`,trendTextName:`${p}_trend_text`,trendStateName:`${p}_trend_state`,statusName:`${p}_status`,targetName:`${p}_target`,refreshName:`${p}_refresh`,runtimeEnabled:model.generateRuntimeApi})
  }); return result
}

type PowerFlowCardExport = {
  model: ReturnType<typeof normalizeForgeUIPowerFlowCard>; stem: string; rootName: string
  gridLabel: string; solarLabel: string; batteryLabel: string; loadLabel: string
  gridFlowLabel: string; solarFlowLabel: string; batteryFlowLabel: string
  gridLine: string; solarLine: string; batteryLine: string
  gridValue: string; solarValue: string; batteryValue: string; loadValue: string
  gridFlow: string; solarFlow: string; batteryFlow: string; refreshName: string; runtimeEnabled: boolean
}
const createPowerFlowCardExports = (components: IComponents): Map<string, PowerFlowCardExport> => {
  const result=new Map<string,PowerFlowCardExport>(); const used=new Set<string>()
  Object.values(components).filter(c=>c.type==='PowerFlowCard').sort((a,b)=>a.id.localeCompare(b.id)).forEach(c=>{
    const base=toCIdentifier(c.id,'Power_Flow_Card').replace(/([a-z0-9])([A-Z])/g,'$1_$2'); let stem=base; let suffix=2
    while(used.has(stem)) stem=`${base}_${suffix++}`; used.add(stem); const p=`fg_${stem.toLowerCase()}_power_flow`; const model=normalizeForgeUIPowerFlowCard(c.props)
    result.set(c.id,{model,stem,rootName:p,gridLabel:`${p}_grid_label`,solarLabel:`${p}_solar_label`,batteryLabel:`${p}_battery_label`,loadLabel:`${p}_load_label`,gridFlowLabel:`${p}_grid_flow_label`,solarFlowLabel:`${p}_solar_flow_label`,batteryFlowLabel:`${p}_battery_flow_label`,gridLine:`${p}_grid_line`,solarLine:`${p}_solar_line`,batteryLine:`${p}_battery_line`,gridValue:`${p}_grid_value`,solarValue:`${p}_solar_value`,batteryValue:`${p}_battery_value`,loadValue:`${p}_load_value`,gridFlow:`${p}_grid_flow`,solarFlow:`${p}_solar_flow`,batteryFlow:`${p}_battery_flow`,refreshName:`${p}_refresh`,runtimeEnabled:model.generateRuntimeApi})
  }); return result
}

type FiIconExport = {
  stem: string
  runtimeStem: string
  runtimeEnabled: boolean
  clickEnabled: boolean
  hookName?: string
  eventCallbackName?: string
  props: Record<string, unknown>
}

const createFiIconExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
): Map<string, FiIconExport> => {
  const result = new Map<string, FiIconExport>()
  const usedStems = new Set<string>()
  Object.values(components)
    .filter(component => component.type === 'Icon')
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const tokens = String(component.componentName || component.id || 'Icon')
        .trim()
        .split(/[^a-zA-Z0-9]+/)
        .filter(Boolean)
      const base = (tokens.length ? tokens : ['Icon'])
        .map(token => token.charAt(0).toUpperCase() + token.slice(1))
        .join('_')
        .replace(/^[^a-zA-Z_]/, '_')
      let stem = base
      let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      const runtimeEnabled = component.props.generateRuntimeApi !== false
      const clickEnabled = component.props.enableClick === true
      const hookName = clickEnabled
        ? createUniqueHookName(stem, usedHookNames)
        : undefined
      const callbackStem = hookName
        ? hookName.replace(/^FG_On_/, '').replace(/_Clicked$/, '').toLowerCase()
        : stem.toLowerCase()
      if (hookName) userEventHooks.add(hookName)
      result.set(component.id, {
        stem,
        runtimeStem: stem.toLowerCase(),
        runtimeEnabled,
        clickEnabled,
        hookName,
        eventCallbackName: clickEnabled
          ? `fg_${callbackStem}_clicked_cb`
          : undefined,
        props: component.props,
      })
    })
  return result
}

const createButtonExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
): Map<string, ButtonExport> => {
  const result = new Map<string, ButtonExport>()
  Object.values(components)
    .filter(component => component.type === 'Button')
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName || component.id,
        'Button',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      const hookName = createUniqueHookName(baseName, usedHookNames)
      const runtimeStem = hookName
        .replace(/^FG_On_/, '')
        .replace(/_Clicked$/, '')
        .toLowerCase()
      userEventHooks.add(hookName)
      result.set(component.id, {
        hookName,
        eventCallbackName: `fg_${runtimeStem}_clicked_cb`,
      })
    })
  return result
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
type CircularProgressExport = BarRuntimeExport

type SliderExport = BarRuntimeExport & {
  hookName: string
  programmaticUpdateName: string
  eventCallbackName: string
}

type SpinboxExport = SliderExport & {
  model: ForgeUIStandardSpinboxModel
  incrementCallbackName: string
  decrementCallbackName: string
}

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
  incrementCallbackName: string
  decrementCallbackName: string
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

type QRCodeExport = { apiName: string; objectName: string }

type LabelTextExport = { apiName: string; objectName: string }

const createLabelTextExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, LabelTextExport> => {
  const result = new Map<string, LabelTextExport>()
  const used = new Set(existingApiNames)
  Object.values(components)
    .filter(component =>
      (component.type === 'Text' || component.type === 'Heading') &&
      typeof component.componentName === 'string' &&
      component.componentName.trim().length > 0,
    )
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const base = toCIdentifier(component.componentName!, 'Label')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let name = base
      let suffix = 2
      while (used.has(`FG_Set_${name}_Text`)) name = `${base}_${suffix++}`
      const apiName = `FG_Set_${name}_Text`
      used.add(apiName)
      result.set(component.id, {
        apiName,
        objectName: `fg_${name.toLowerCase()}_label`,
      })
    })
  return result
}

const createQRCodeExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, QRCodeExport> => {
  const result = new Map<string, QRCodeExport>()
  const used = new Set(existingApiNames)
  Object.values(components)
    .filter(component => component.type === 'QRCode')
    .sort((a, b) => a.id.localeCompare(b.id))
    .forEach(component => {
      const base = toCIdentifier(
        component.componentName || component.props.name || 'QR_Code',
        'QR_Code',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let name = base
      let suffix = 2
      while (used.has(`FG_Set_${name}_Text`)) name = `${base}_${suffix++}`
      const apiName = `FG_Set_${name}_Text`
      used.add(apiName)
      result.set(component.id, {
        apiName,
        objectName: `fg_${name.toLowerCase()}_qrcode`,
      })
    })
  return result
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
  warningApiName: string
  alarmApiName: string
  pointAddedHookName: string
  clearedHookName: string
  objectName: string
  seriesName: string
  warningSeriesName: string
  alarmSeriesName: string
  minimumName: string
  maximumName: string
  minimum: number
  maximum: number
  warningThreshold: number
  alarmThreshold: number
  warningColor: string
  alarmColor: string
  pointCount: number
  initialData: number[]
  seriesColor: string
  horizontalDivisions?: number
  verticalDivisions?: number
  updateMode?: 'LV_CHART_UPDATE_MODE_SHIFT' | 'LV_CHART_UPDATE_MODE_CIRCULAR'
  isPro?: boolean
  unitsApiName?: string
  unitsLabelName?: string
  valueLabelName?: string
  decimalPlaces?: number
  markerName?: string
  warningHookName?: string
  alarmHookName?: string
  recoveredHookName?: string
  thresholdStateName?: string
  warningStateName?: string
  alarmStateName?: string
  enableUserEvents?: boolean
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

type ListExport = {
  hookName: string
  itemDataNames: string[]
  items: string[]
}

const createListExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
): Map<string, ListExport> => {
  const exportsByComponent = new Map<string, ListExport>()

  Object.values(components)
    .filter(component => component.type === 'List')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'List',
        'List',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let hookName = `FG_On_${allocatedBase}_Item_Clicked`
      let suffix = 2
      while (usedHookNames.has(hookName)) {
        allocatedBase = `${baseName}_${suffix++}`
        hookName = `FG_On_${allocatedBase}_Item_Clicked`
      }
      usedHookNames.add(hookName)
      userEventHooks.add(hookName)

      const items = getForgeUIStandardListModel(component.props).items
      const runtimeStem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        hookName,
        items,
        itemDataNames: items.map(
          (_, index) => `fg_${runtimeStem}_list_item_${index}_data`,
        ),
      })
    })

  return exportsByComponent
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

type WifiStatusExport = {
  labelName: string
  displayMode: ForgeUIWifiStatusDisplayMode
  showSignalStrength: boolean
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

const createWifiStatusExports = (
  components: IComponents,
): Map<string, WifiStatusExport> => {
  const result = new Map<string, WifiStatusExport>()
  const usedStems = new Set<string>()
  Object.values(components)
    .filter(component => component.type === 'WiFi')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const base = toCIdentifier(
        component.componentName || component.props.name || 'WiFi_Status',
        'WiFi_Status',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
      let stem = base
      let suffix = 2
      while (usedStems.has(stem)) stem = `${base}_${suffix++}`
      usedStems.add(stem)
      result.set(component.id, {
        labelName: `fg_${stem}_label`,
        ...getForgeUIStandardWifiStatusPresentation(component.props),
      })
    })
  return result
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
    .filter(component => (component.type === 'Chart' || component.type === 'TrendChartPro') && component.props.generateRuntimeApi !== false)
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const pro = component.type === 'TrendChartPro'
      const proModel = pro ? normalizeForgeUITrendChartPro(component.props) : undefined
      const baseName = toCIdentifier(
        pro ? component.id : component.componentName ||
        component.props.name || component.props.label || 'Data_Chart',
        pro ? 'Trend_Chart_Pro' : 'Data_Chart',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      let allocatedBase = baseName
      let suffix = 2
      while (
        usedApiNames.has(`FG_Add_${allocatedBase}_Point`) ||
        usedApiNames.has(`FG_Clear_${allocatedBase}`) ||
        usedApiNames.has(`FG_Set_${allocatedBase}_${pro ? 'Warning' : 'WarningThreshold'}`) ||
        usedApiNames.has(`FG_Set_${allocatedBase}_${pro ? 'Alarm' : 'AlarmThreshold'}`) ||
        (pro && usedApiNames.has(`FG_Set_${allocatedBase}_Units`))
      ) {
        allocatedBase = `${baseName}_${suffix++}`
      }
      const addApiName = `FG_Add_${allocatedBase}_Point`
      const clearApiName = `FG_Clear_${allocatedBase}`
      const warningApiName = `FG_Set_${allocatedBase}_${pro ? 'Warning' : 'WarningThreshold'}`
      const alarmApiName = `FG_Set_${allocatedBase}_${pro ? 'Alarm' : 'AlarmThreshold'}`
      usedApiNames.add(addApiName)
      usedApiNames.add(clearApiName)
      usedApiNames.add(warningApiName)
      usedApiNames.add(alarmApiName)
      const unitsApiName = pro ? `FG_Set_${allocatedBase}_Units` : undefined
      if (unitsApiName) usedApiNames.add(unitsApiName)

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
      const thresholdHook = (suffixName: string) => `FG_On_${allocatedBase}_${suffixName}`
      const warningHookName = pro ? thresholdHook('Warning') : undefined
      const alarmHookName = pro ? thresholdHook('Alarm') : undefined
      const recoveredHookName = pro ? thresholdHook('Recovered') : undefined
      if (proModel?.enableUserEvents) {
        ;[warningHookName, alarmHookName, recoveredHookName].forEach(name => {
          if (name) { usedHookNames.add(name); userEventHooks.add(name) }
        })
      }

      const firstRangeValue = integerProp(
        component.props.yMin ?? component.props.min,
        0,
      )
      const secondRangeValue = integerProp(
        component.props.yMax ?? component.props.max,
        100,
      )
      const minimum = proModel ? Math.floor(proModel.minimum) : Math.min(firstRangeValue, secondRangeValue)
      const maximum = proModel ? Math.ceil(proModel.maximum) : Math.max(firstRangeValue, secondRangeValue)
      const pointCount = proModel?.historyLength ?? Math.max(
        1,
        integerProp(
          component.props.pointCount,
          FORGEUI_STANDARD_CHART_DEFAULT_POINT_COUNT,
        ),
      )
      const configuredData = proModel?.data ?? (Array.isArray(component.props.initialData)
        ? component.props.initialData
        : FORGEUI_STANDARD_CHART_DEFAULT_DATA)
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
      const rawSeriesColor = proModel?.traceColour || component.props.seriesColor
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
            : ''
      const thresholdColor = (value: unknown, fallback: string) => {
        const normalized = typeof value === 'string' ? value.replace(/^#/, '') : ''
        return /^[0-9a-fA-F]{6}$/.test(normalized)
          ? `lv_color_hex(0x${normalized.toUpperCase()})`
          : `lv_color_hex(0x${fallback})`
      }

      exportsByComponent.set(component.id, {
        addApiName,
        clearApiName,
        warningApiName,
        alarmApiName,
        isPro: pro,
        unitsApiName,
        unitsLabelName: pro ? `fg_${runtimeStem}_chart_units` : undefined,
        valueLabelName: pro ? `fg_${runtimeStem}_chart_value` : undefined,
        decimalPlaces: proModel?.decimalPlaces,
        markerName: pro ? `fg_${runtimeStem}_chart_marker` : undefined,
        warningHookName, alarmHookName, recoveredHookName,
        thresholdStateName: pro ? `fg_${runtimeStem}_chart_threshold_state` : undefined,
        warningStateName: pro ? `fg_${runtimeStem}_chart_warning` : undefined,
        alarmStateName: pro ? `fg_${runtimeStem}_chart_alarm` : undefined,
        enableUserEvents: proModel?.enableUserEvents,
        pointAddedHookName,
        clearedHookName,
        objectName: `fg_${runtimeStem}_chart`,
        seriesName: `fg_${runtimeStem}_chart_series`,
        warningSeriesName: `fg_${runtimeStem}_chart_warning_series`,
        alarmSeriesName: `fg_${runtimeStem}_chart_alarm_series`,
        minimumName: `fg_${runtimeStem}_chart_y_minimum`,
        maximumName: `fg_${runtimeStem}_chart_y_maximum`,
        minimum,
        maximum,
        warningThreshold: Math.max(minimum, Math.min(maximum, integerProp(proModel?.warning ?? component.props.warningThreshold, 70))),
        alarmThreshold: Math.max(minimum, Math.min(maximum, integerProp(proModel?.alarm ?? component.props.alarmThreshold, 85))),
        warningColor: thresholdColor(proModel?.warningColour ?? component.props.warningColor, 'F2A900'),
        alarmColor: thresholdColor(proModel?.alarmColour ?? component.props.alarmColor, 'E5484D'),
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

const createSliderExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, SliderExport> => {
  const exportsByComponent = new Map<string, SliderExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Slider')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Slider',
        'Slider',
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
      const runtimeStem = allocatedBase.toLowerCase()

      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${runtimeStem}_slider`,
        stateName: `fg_${runtimeStem}_slider_value`,
        programmaticUpdateName:
          `fg_${runtimeStem}_slider_programmatic_update`,
        minimumName: `fg_${runtimeStem}_slider_minimum`,
        maximumName: `fg_${runtimeStem}_slider_maximum`,
        eventCallbackName:
          `fg_${runtimeStem}_slider_value_changed_cb`,
        minimum,
        maximum,
        initialValue,
      })
    })

  return exportsByComponent
}

const createSpinboxExports = (
  components: IComponents,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
  existingApiNames: Iterable<string>,
): Map<string, SpinboxExport> => {
  const exportsByComponent = new Map<string, SpinboxExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'Spinbox')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Spinbox',
        'Spinbox',
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

      const model = getForgeUIStandardSpinboxModel(component.props)
      const stem = allocatedBase.toLowerCase()
      exportsByComponent.set(component.id, {
        apiName,
        hookName,
        objectName: `fg_${stem}_spinbox`,
        stateName: `fg_${stem}_spinbox_value`,
        programmaticUpdateName: `fg_${stem}_spinbox_programmatic_update`,
        minimumName: `fg_${stem}_spinbox_minimum`,
        maximumName: `fg_${stem}_spinbox_maximum`,
        eventCallbackName: `fg_${stem}_spinbox_changed_cb`,
        incrementCallbackName: `fg_${stem}_spinbox_increment_cb`,
        decrementCallbackName: `fg_${stem}_spinbox_decrement_cb`,
        minimum: model.minimum,
        maximum: model.maximum,
        initialValue: model.value,
        model,
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

const createCircularProgressExports = (
  components: IComponents,
  existingApiNames: Iterable<string>,
): Map<string, CircularProgressExport> => {
  const exportsByComponent = new Map<string, CircularProgressExport>()
  const usedApiNames = new Set(existingApiNames)

  Object.values(components)
    .filter(component => component.type === 'CircularProgress')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        'Circular Progress',
        'Circular Progress',
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
        objectName: `fg_${runtimeStem}_circular_progress`,
        stateName: `fg_${runtimeStem}_circular_progress_value`,
        minimumName: `fg_${runtimeStem}_circular_progress_minimum`,
        maximumName: `fg_${runtimeStem}_circular_progress_maximum`,
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
        incrementCallbackName: `fg_${runtimeStem}_increment_cb`,
        decrementCallbackName: `fg_${runtimeStem}_decrement_cb`,
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
      const asset: any = resolveForgeUIStandardImageAsset(component)

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
    .filter(component => component.type === 'IconButton' || component.type === 'ImageButton')
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const baseName = toCIdentifier(
        component.componentName ||
        component.props.name ||
        component.props.label ||
        component.type,
        component.type,
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
  sliderExports: Map<string, SliderExport>,
  spinboxExports: Map<string, SpinboxExport>,
  progressExports: Map<string, ProgressExport>,
  circularProgressExports: Map<string, CircularProgressExport>,
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
  listExports: Map<string, ListExport>,
  tabViewExports: Map<string, TabViewExport>,
  tileViewExports: Map<string, TileViewExport>,
  clockExports: Map<string, ClockExport>,
  wifiStatusExports: Map<string, WifiStatusExport>,
  labelTextExports: Map<string, LabelTextExport>,
  inputExports: Map<string, InputExport>,
  switchExports: Map<string, SwitchExport>,
  checkboxExports: Map<string, SwitchExport>,
  radioExports: Map<string, RadioExport>,
  qrCodeExports: Map<string, QRCodeExport>,
  buttonExports: Map<string, ButtonExport>,
  fiIconExports: Map<string, FiIconExport>,
  dashboardCardExports: Map<string, DashboardCardExport>,
  sensorTileExports: Map<string, SensorTileExport>,
  relayPanelExports: Map<string, RelayPanelExport>,
  pwmControllerExports: Map<string, PwmControllerExport>,
  alarmPanelExports: Map<string, AlarmPanelExport>,
  ioMonitorExports: Map<string, IOMonitorExport>,
  batteryCardExports: Map<string, BatteryCardExport>,
  tankLevelCardExports: Map<string, TankLevelCardExport>,
  networkStatusCardExports: Map<string, NetworkStatusCardExport>,
  deviceSummaryCardExports: Map<string, DeviceSummaryCardExport>,
  kpiCardExports: Map<string, KpiCardExport>,
  powerFlowCardExports: Map<string, PowerFlowCardExport>,
) => {
  ;(component.children || []).forEach((key: string) => {
    const child = components[key]
    if (!child) return

    counter.value++
    const varName = `obj${counter.value}`
    let childParentVar = varName

    const x = lv(child.props.x, 0)
    const y = lv(child.props.y, 0)
    const w = lv(child.props.w, 120)
    const h = lv(child.props.h, 40)

    switch (child.type) {
      case 'Text': {
        const labelExport = labelTextExports.get(child.id)
        const labelObject = labelExport?.objectName || varName
        const text = esc(getForgeUIStandardTextValue(child.props))
        const color = palette.textPrimary
        const fontSize = resolveMontserratSize(child.props.fontSize, 24)
        const textAlign = resolveLvTextAlign(
          child.props.textAlign || child.props.align,
        )

        lines.push(labelExport
          ? `${labelObject} = lv_label_create(${parentVar});`
          : `lv_obj_t * ${labelObject} = lv_label_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${labelObject}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${labelObject}, ${w}, ${h});`)
        lines.push(`lv_label_set_long_mode(${labelObject}, LV_LABEL_LONG_WRAP);`)
        lines.push(`lv_label_set_text(${labelObject}, "${text}");`)
        lines.push(`lv_obj_set_style_text_color(${labelObject}, lv_color_hex(${color}), 0);`)
        lines.push(`lv_obj_set_style_text_font(${labelObject}, &lv_font_montserrat_${fontSize}, 0);`)
        lines.push(`lv_obj_set_style_text_align(${labelObject}, ${textAlign}, 0);`)
        lines.push(``)
        break
      }

      case 'Heading': {
  const labelExport = labelTextExports.get(child.id)
  const labelObject = labelExport?.objectName || varName
  const heading = getForgeUIStandardHeadingPresentation(child.props)
  const text = esc(heading.text)
  const color = palette.textPrimary
  const textAlign = resolveLvTextAlign(heading.textAlign)

  lines.push(labelExport
    ? `${labelObject} = lv_label_create(${parentVar});`
    : `lv_obj_t * ${labelObject} = lv_label_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${labelObject}, ${x}, ${y});`)
  lines.push(`lv_label_set_long_mode(${labelObject}, LV_LABEL_LONG_WRAP);`)
  lines.push(`lv_obj_set_size(${labelObject}, ${w}, ${h});`)
  lines.push(`lv_label_set_text(${labelObject}, "${text}");`)
  lines.push(`lv_obj_set_style_text_color(${labelObject}, lv_color_hex(${color}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${labelObject}, &lv_font_montserrat_${heading.fontSize}, 0);`)
  lines.push(`lv_obj_set_style_text_align(${labelObject}, ${textAlign}, 0);`)
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
  const wifi = wifiStatusExports.get(child.id)
  const label = wifi?.labelName || varName
  const container = `${label}_container`
  lines.push(`lv_obj_t * ${container} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${container}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${container}, ${w}, ${h});`)
  lines.push(`lv_obj_clear_flag(${container}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_set_style_pad_all(${container}, 0, 0);`)
  lines.push(`lv_obj_set_style_border_width(${container}, 0, 0);`)
  lines.push(`lv_obj_set_style_bg_opa(${container}, LV_OPA_TRANSP, 0);`)
  lines.push(`${label} = lv_label_create(${container});`)
  lines.push(`lv_label_set_text(${label}, "Failed");`)
  lines.push(`lv_obj_set_size(${label}, ${w}, LV_SIZE_CONTENT);`)
  lines.push(`lv_obj_set_style_text_color(${label}, lv_color_hex(${palette.accent}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${label}, &lv_font_montserrat_20, 0);`)
  lines.push(`lv_obj_set_style_text_align(${label}, LV_TEXT_ALIGN_LEFT, 0);`)
  lines.push(`lv_label_set_long_mode(${label}, LV_LABEL_LONG_CLIP);`)
  lines.push(`lv_obj_align(${label}, LV_ALIGN_LEFT_MID, 0, 0);`)
  lines.push(``)
  break
}
      
            case 'Button': {
        const text = esc(getForgeUIStandardButtonText(child.props))
        const buttonExport = buttonExports.get(child.id)

        lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)

        lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
        lines.push(`lv_label_set_text(${varName}_label, "${text}");`)
        lines.push(`lv_obj_set_style_text_font(${varName}_label, &lv_font_montserrat_14, 0);`)
        lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`)
        lines.push(`lv_obj_center(${varName}_label);`)
        if (buttonExport) {
          lines.push(`lv_obj_add_event_cb(${varName}, ${buttonExport.eventCallbackName}, LV_EVENT_CLICKED, NULL);`)
        }
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
  lines.push(`lv_obj_set_style_border_color(${buttonObject}, lv_color_hex(${palette.surfaceBorder}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${buttonObject}, 2, 0);`)
  lines.push(`lv_obj_set_style_bg_color(${buttonObject}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_border_color(${buttonObject}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
  lines.push(`lv_obj_set_style_bg_color(${buttonObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_text_color(${buttonObject}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${buttonObject}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_text_color(${buttonObject}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)

  const iconName = child.props.icon || 'FiSettings'
  if (iconName === 'FiSettings') {
    usedAssetSources.add('assets/icons/fg_icon_settings_fi_48px.c')
    lines.push(`LV_IMAGE_DECLARE(fg_icon_settings_fi_48px);`)
    lines.push(`lv_obj_t * ${varName}_icon = lv_image_create(${buttonObject});`)
    lines.push(`lv_image_set_src(${varName}_icon, &fg_icon_settings_fi_48px);`)
    lines.push(`lv_image_set_scale(${varName}_icon, 85);`)
    lines.push(`lv_obj_set_style_image_recolor(${varName}_icon, lv_color_hex(${palette.textPrimary}), 0);`)
    lines.push(`lv_obj_set_style_image_recolor_opa(${varName}_icon, LV_OPA_COVER, 0);`)
    lines.push(`lv_obj_set_style_image_recolor(${varName}_icon, lv_color_hex(${palette.accentText}), LV_STATE_PRESSED);`)
    lines.push(`lv_obj_set_style_image_recolor(${varName}_icon, lv_color_hex(${palette.disabledText}), LV_STATE_DISABLED);`)
    lines.push(`lv_obj_center(${varName}_icon);`)
  } else {
    const iconSymbol = FG_ICON_LVGL_SYMBOLS[iconName] || 'LV_SYMBOL_OK'
    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${buttonObject});`)
    lines.push(`lv_label_set_text(${varName}_label, ${iconSymbol});`)
    lines.push(`lv_obj_center(${varName}_label);`)
  }
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

  const fiIconExport = fiIconExports.get(child.id)

  const iconModel = getForgeUIStandardIconPresentation(
    child.props,
    `#${palette.textPrimary.slice(2)}`,
  )
  const src = iconModel.src
  const iconOpacity = Math.round(iconModel.opacity * 255)
  const iconColor = `0x${iconModel.color.slice(1)}`

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

    const uploadedDimensions =
      forgeUIResolveUploadedAssetDimensions(uploadedAsset) ||
      getForgeUIStandardIconSourceDimensions(uploadedAsset, iconModel.icon)
    const uploadedSourceSize = uploadedDimensions
      ? Math.max(uploadedDimensions.width, uploadedDimensions.height)
      : undefined
    const imageScale = uploadedSourceSize
      ? Math.round(iconModel.iconSize * 256 / uploadedSourceSize)
      : Number(child.props.imageScale || 256)

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
    if (uploadedDimensions) {
      lines.push(
        `lv_image_set_pivot(${varName}, ${Math.floor(uploadedDimensions.width / 2)}, ${Math.floor(uploadedDimensions.height / 2)});`,
      )
    }
    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )
    lines.push(`lv_image_set_inner_align(${varName}, LV_IMAGE_ALIGN_CENTER);`)
    lines.push(`lv_obj_set_style_image_recolor(${varName}, lv_color_hex(${iconColor}), 0);`)
    lines.push(`lv_obj_set_style_image_recolor_opa(${varName}, LV_OPA_COVER, 0);`)
    lines.push(`lv_obj_set_style_opa(${varName}, ${iconOpacity}, 0);`)
    if (!iconModel.visible) lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_HIDDEN);`)
  } else {
    const icon = iconModel.icon
    const color = iconColor
    const iconSize = iconModel.iconSize

    if (icon === 'FiSettings') {
      usedAssetSources.add('assets/icons/fg_icon_settings_fi_48px.c')
      const numericIconSize = Number(iconSize)
      const imageScale = Math.round(numericIconSize * 256 / 48)
      lines.push(`LV_IMAGE_DECLARE(fg_icon_settings_fi_48px);`)
      lines.push(`lv_obj_t * ${varName} = lv_image_create(${parentVar});`)
      lines.push(`lv_image_set_src(${varName}, &fg_icon_settings_fi_48px);`)
      lines.push(`lv_image_set_scale(${varName}, ${imageScale});`)
      lines.push(`lv_image_set_pivot(${varName}, 24, 24);`)
      lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
      lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
      lines.push(`lv_image_set_inner_align(${varName}, LV_IMAGE_ALIGN_CENTER);`)
      lines.push(`lv_obj_set_style_image_recolor(${varName}, lv_color_hex(${color}), 0);`)
      lines.push(`lv_obj_set_style_image_recolor_opa(${varName}, LV_OPA_COVER, 0);`)
      lines.push(`lv_obj_set_style_opa(${varName}, ${iconOpacity}, 0);`)
      if (!iconModel.visible) lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_HIDDEN);`)
    } else {
      const symbol = FG_ICON_LVGL_SYMBOLS[icon]
      if (!symbol) {
        throw new Error(
          `Icon ${icon} requires a converted LVGL asset; refusing placeholder export.`,
        )
      }
      lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
      lines.push(`lv_label_set_text(${varName}, ${symbol});`)
      lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
      lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
      lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
      lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${resolveMontserratSize(iconSize, 48)}, 0);`)
      lines.push(`lv_obj_set_style_text_align(${varName}, LV_TEXT_ALIGN_CENTER, 0);`)
      lines.push(`lv_obj_set_style_opa(${varName}, ${iconOpacity}, 0);`)
      if (!iconModel.visible) lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_HIDDEN);`)
    }
  }

  const imageBacked = Boolean(
    (uploadedAsset?.exportStatus === 'lvgl_ready' && uploadedAsset?.lvgl) ||
    iconModel.icon === 'FiSettings',
  )
  if (fiIconExport?.runtimeEnabled) {
    lines.push(`fg_fi_bind_${fiIconExport.runtimeStem}(${varName}, ${imageBacked ? 'true' : 'false'});`)
  }
  if (fiIconExport?.clickEnabled && fiIconExport.eventCallbackName) {
    const pressedColor = `0x${iconModel.pressedColor.slice(1)}`
    lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);`)
    lines.push(`lv_obj_set_style_opa(${varName}, ${Math.round(iconModel.pressedOpacity * 255)}, LV_STATE_PRESSED);`)
    lines.push(imageBacked
      ? `lv_obj_set_style_image_recolor(${varName}, lv_color_hex(${pressedColor}), LV_STATE_PRESSED);`
      : `lv_obj_set_style_text_color(${varName}, lv_color_hex(${pressedColor}), LV_STATE_PRESSED);`)
    if (imageBacked) lines.push(`lv_obj_set_style_image_recolor_opa(${varName}, LV_OPA_COVER, LV_STATE_PRESSED);`)
    lines.push(`lv_obj_add_event_cb(${varName}, ${fiIconExport.eventCallbackName}, LV_EVENT_CLICKED, NULL);`)
  } else {
    lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);`)
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
        lines.push(`lv_obj_set_style_bg_opa(${inputExport.objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${inputExport.objectName}, lv_color_hex(${palette.textPrimary}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${inputExport.objectName}, lv_color_hex(${palette.surfaceBorder}), 0);`)
        lines.push(`lv_obj_set_style_border_opa(${inputExport.objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${inputExport.objectName}, 1, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${inputExport.objectName}, 6, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${inputExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${inputExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_left(${inputExport.objectName}, 16, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_right(${inputExport.objectName}, 16, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_top(${inputExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_bottom(${inputExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${inputExport.objectName}, LV_OPA_TRANSP, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_border_width(${inputExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_outline_width(${inputExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_shadow_width(${inputExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_text_color(${inputExport.objectName}, lv_color_hex(${palette.textSecondary}), LV_PART_TEXTAREA_PLACEHOLDER);`)
        lines.push(`lv_obj_set_style_border_color(${inputExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_border_width(${inputExport.objectName}, 1, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_outline_width(${inputExport.objectName}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_shadow_width(${inputExport.objectName}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_text_color(${inputExport.objectName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
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
        lines.push(`lv_obj_set_style_bg_opa(${textareaExport.objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${textareaExport.objectName}, lv_color_hex(${palette.textPrimary}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${textareaExport.objectName}, lv_color_hex(${palette.surfaceBorder}), 0);`)
        lines.push(`lv_obj_set_style_border_opa(${textareaExport.objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${textareaExport.objectName}, 1, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${textareaExport.objectName}, 6, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${textareaExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${textareaExport.objectName}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_left(${textareaExport.objectName}, 16, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_right(${textareaExport.objectName}, 16, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_top(${textareaExport.objectName}, 8, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_bottom(${textareaExport.objectName}, 8, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${textareaExport.objectName}, LV_OPA_TRANSP, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_border_width(${textareaExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_outline_width(${textareaExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_shadow_width(${textareaExport.objectName}, 0, LV_PART_SCROLLBAR);`)
        lines.push(`lv_obj_set_style_text_color(${textareaExport.objectName}, lv_color_hex(${palette.textSecondary}), LV_PART_TEXTAREA_PLACEHOLDER);`)
        lines.push(`lv_obj_set_style_border_color(${textareaExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_border_width(${textareaExport.objectName}, 1, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_outline_width(${textareaExport.objectName}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_shadow_width(${textareaExport.objectName}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_text_color(${textareaExport.objectName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
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

  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${switchExport.objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_opa(${switchExport.objectName}, LV_OPA_TRANSP, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_bg_opa(${switchExport.objectName}, LV_OPA_COVER, LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_bg_color(${switchExport.objectName}, lv_color_hex(${palette.accentText}), LV_PART_KNOB);`)
  lines.push(`lv_obj_set_style_bg_opa(${switchExport.objectName}, LV_OPA_COVER, LV_PART_KNOB);`)
  lines.push(`lv_obj_add_event_cb(${switchExport.objectName}, ${switchExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  lines.push(``)
  break
}

      case 'Checkbox': {
  const checkboxExport = checkboxExports.get(child.id)
  if (!checkboxExport) break
  const text = esc(getForgeUIStandardCheckboxText(child.props))

  lines.push(`${checkboxExport.objectName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${checkboxExport.objectName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${checkboxExport.objectName}, ${x}, ${y});`)

  if (checkboxExport.initialChecked) {
    lines.push(`lv_obj_add_state(${checkboxExport.objectName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${checkboxExport.objectName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${checkboxExport.objectName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_pad_column(${checkboxExport.objectName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${checkboxExport.objectName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_border_width(${checkboxExport.objectName}, 2, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_radius(${checkboxExport.objectName}, 4, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${checkboxExport.objectName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_opa(${checkboxExport.objectName}, LV_OPA_COVER, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${checkboxExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_border_color(${checkboxExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${checkboxExport.objectName}, lv_color_hex(${palette.accentText}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_bg_color(${checkboxExport.objectName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_INDICATOR | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_border_color(${checkboxExport.objectName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_INDICATOR | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_add_event_cb(${checkboxExport.objectName}, ${checkboxExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  lines.push(``)
  break
}

      case 'Radio': {
  const radioExport = radioExports.get(child.id)
  if (!radioExport) break
  const text = esc(getForgeUIStandardRadioText(child.props))

  lines.push(`${radioExport.objectName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${radioExport.objectName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${radioExport.objectName}, ${x}, ${y});`)

  if (radioExport.initialSelected) {
    lines.push(`lv_obj_add_state(${radioExport.objectName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${radioExport.objectName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${radioExport.objectName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
  lines.push(`lv_obj_set_style_radius(${radioExport.objectName}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_border_color(${radioExport.objectName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${radioExport.objectName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${radioExport.objectName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${radioExport.objectName}, lv_color_hex(${palette.accentText}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
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
        const numberInputContainer = `${numberInputObject}_container`

        lines.push(`lv_obj_t * ${numberInputContainer} = lv_obj_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${numberInputContainer}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${numberInputContainer}, ${w}, ${h});`)
        lines.push(`lv_obj_clear_flag(${numberInputContainer}, LV_OBJ_FLAG_SCROLLABLE | LV_OBJ_FLAG_CLICKABLE);`)
        lines.push(`lv_obj_set_style_pad_all(${numberInputContainer}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputContainer}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputContainer}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputContainer}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_opa(${numberInputContainer}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputContainer}, 1, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${numberInputContainer}, 6, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${numberInputContainer}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${numberInputContainer}, 0, LV_PART_MAIN);`)
        lines.push(`${numberInputObject} = lv_textarea_create(${numberInputContainer});`)
        lines.push(`lv_textarea_set_one_line(${numberInputObject}, true);`)
        lines.push(`lv_textarea_set_text(${numberInputObject}, "${initialText}");`)
        lines.push(`lv_obj_set_pos(${numberInputObject}, 1, 1);`)
        lines.push(`lv_obj_set_size(${numberInputObject}, (${w}) - 2, (${h}) - 2);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${numberInputObject}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputObject}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${numberInputObject}, 6, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${numberInputObject}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${numberInputObject}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_right(${numberInputObject}, 38, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.accent}), LV_PART_CURSOR);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_CURSOR);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.selectedSurface}), LV_PART_SELECTED);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_SELECTED);`)
        lines.push(`lv_obj_set_style_text_color(${numberInputObject}, lv_color_hex(${palette.accentText}), LV_PART_SELECTED);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.surface}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${numberInputObject}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputObject}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_outline_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_shadow_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
        lines.push(`lv_obj_set_style_outline_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
        lines.push(`lv_obj_set_style_shadow_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
        lines.push(`lv_obj_set_style_bg_color(${numberInputObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_bg_opa(${numberInputObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_text_color(${numberInputObject}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_border_color(${numberInputObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_border_width(${numberInputObject}, 0, LV_PART_MAIN | LV_STATE_DISABLED);`)
        if (child.props.isDisabled) {
          lines.push(`lv_obj_add_state(${numberInputObject}, LV_STATE_DISABLED);`)
        }
        if (numberInputExport) {
          lines.push(`${numberInputExport.stateName} = ${numberInputExport.initialValue};`)
          lines.push(`lv_obj_add_event_cb(${numberInputObject}, ${numberInputExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
          const incrementButton = `${numberInputObject}_increment_button`
          const decrementButton = `${numberInputObject}_decrement_button`
          const incrementIcon = `${incrementButton}_icon`
          const decrementIcon = `${decrementButton}_icon`
          lines.push(`lv_obj_t * ${incrementButton} = lv_button_create(${numberInputContainer});`)
          lines.push(`lv_obj_set_pos(${incrementButton}, (${w}) - 33, 1);`)
          lines.push(`lv_obj_set_size(${incrementButton}, 32, ((${h}) - 2) / 2);`)
          lines.push(`lv_obj_set_style_bg_color(${incrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_bg_opa(${incrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_color(${incrementButton}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_width(${incrementButton}, 1, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_side(${incrementButton}, LV_BORDER_SIDE_LEFT | LV_BORDER_SIDE_BOTTOM, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_radius(${incrementButton}, 4, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_pad_all(${incrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_outline_width(${incrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_shadow_width(${incrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_text_color(${incrementButton}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_bg_color(${incrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_border_color(${incrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_text_color(${incrementButton}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_border_color(${incrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_outline_width(${incrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_shadow_width(${incrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_outline_width(${incrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
          lines.push(`lv_obj_set_style_shadow_width(${incrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
          lines.push(`lv_obj_set_style_bg_color(${incrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_set_style_bg_opa(${incrementButton}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_set_style_text_color(${incrementButton}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_t * ${incrementIcon} = lv_label_create(${incrementButton});`)
          lines.push(`lv_label_set_text(${incrementIcon}, LV_SYMBOL_UP);`)
          lines.push(`lv_obj_center(${incrementIcon});`)
          lines.push(`lv_obj_add_event_cb(${incrementButton}, ${numberInputExport.incrementCallbackName}, LV_EVENT_CLICKED, NULL);`)
          lines.push(`lv_obj_t * ${decrementButton} = lv_button_create(${numberInputContainer});`)
          lines.push(`lv_obj_set_pos(${decrementButton}, (${w}) - 33, 1 + (((${h}) - 2) / 2));`)
          lines.push(`lv_obj_set_size(${decrementButton}, 32, ((${h}) - 2) - (((${h}) - 2) / 2));`)
          lines.push(`lv_obj_set_style_bg_color(${decrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_bg_opa(${decrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_color(${decrementButton}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_width(${decrementButton}, 1, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_border_side(${decrementButton}, LV_BORDER_SIDE_LEFT, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_radius(${decrementButton}, 4, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_pad_all(${decrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_outline_width(${decrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_shadow_width(${decrementButton}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_text_color(${decrementButton}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_bg_color(${decrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_border_color(${decrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_text_color(${decrementButton}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
          lines.push(`lv_obj_set_style_border_color(${decrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_outline_width(${decrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_shadow_width(${decrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
          lines.push(`lv_obj_set_style_outline_width(${decrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
          lines.push(`lv_obj_set_style_shadow_width(${decrementButton}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
          lines.push(`lv_obj_set_style_bg_color(${decrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_set_style_bg_opa(${decrementButton}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_set_style_text_color(${decrementButton}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
          lines.push(`lv_obj_t * ${decrementIcon} = lv_label_create(${decrementButton});`)
          lines.push(`lv_label_set_text(${decrementIcon}, LV_SYMBOL_DOWN);`)
          lines.push(`lv_obj_center(${decrementIcon});`)
          lines.push(`lv_obj_add_event_cb(${decrementButton}, ${numberInputExport.decrementCallbackName}, LV_EVENT_CLICKED, NULL);`)
          if (child.props.isDisabled) {
            lines.push(`lv_obj_add_state(${incrementButton}, LV_STATE_DISABLED);`)
            lines.push(`lv_obj_add_state(${decrementButton}, LV_STATE_DISABLED);`)
          }
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

        lines.push(`lv_obj_set_style_bg_color(${selectObject}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${selectObject}, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.textPrimary}), LV_PART_INDICATOR);`)
        lines.push(`lv_obj_set_style_border_color(${selectObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${selectObject}, 1, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${selectObject}, 8, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${selectObject}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${selectObject}, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_color(${selectObject}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_border_color(${selectObject}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
        lines.push(`lv_obj_set_style_outline_width(${selectObject}, 0, LV_PART_MAIN | LV_STATE_FOCUSED);`)
        lines.push(`lv_obj_set_style_outline_width(${selectObject}, 0, LV_PART_MAIN | LV_STATE_FOCUS_KEY);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_bg_opa(${selectObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.accentText}), LV_PART_INDICATOR | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_bg_opa(${selectObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.accentText}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_bg_opa(${selectObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_opa(${selectObject}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}, lv_color_hex(${palette.disabledText}), LV_PART_INDICATOR | LV_STATE_DISABLED);`)
        lines.push(`lv_obj_t * ${selectObject}_list = lv_dropdown_get_list(${selectObject});`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}_list, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_opa(${selectObject}_list, LV_OPA_COVER, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_color(${selectObject}_list, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${selectObject}_list, 1, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_radius(${selectObject}_list, 8, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}_list, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_outline_width(${selectObject}_list, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_shadow_width(${selectObject}_list, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}_list, lv_color_hex(${palette.selectedSurface}), LV_PART_SELECTED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}_list, lv_color_hex(${palette.accentText}), LV_PART_SELECTED);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}_list, lv_color_hex(${palette.selectedSurface}), LV_PART_SELECTED | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}_list, lv_color_hex(${palette.accentText}), LV_PART_SELECTED | LV_STATE_CHECKED);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}_list, lv_color_hex(${palette.selectedSurface}), LV_PART_SELECTED | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}_list, lv_color_hex(${palette.accentText}), LV_PART_SELECTED | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_bg_color(${selectObject}_list, lv_color_hex(${palette.selectedSurface}), LV_PART_SELECTED | LV_STATE_CHECKED | LV_STATE_PRESSED);`)
        lines.push(`lv_obj_set_style_text_color(${selectObject}_list, lv_color_hex(${palette.accentText}), LV_PART_SELECTED | LV_STATE_CHECKED | LV_STATE_PRESSED);`)
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
  const imageModel = getForgeUIStandardImagePresentation(child)
  const imageExport = imageExports.get(child.id)
  const asset: any = imageExport?.asset ||
    resolveForgeUIStandardImageAsset(child)
  const imageObject = imageExport?.objectName || varName
  const renderObject = asset?.lvgl || asset?.symbolName
    ? imageObject
    : varName

  lines.push(`/* ForgeUI Image export: serialized source=${child.props.sourceWidth ?? 'unset'}x${child.props.sourceHeight ?? 'unset'}, fit=${child.props.imageFit ?? child.props.objectFit ?? 'unset'}, legacy_scale=${child.props.imageScale ?? 'unset'}; resolved source=${imageModel.sourceWidth ?? 'unknown'}x${imageModel.sourceHeight ?? 'unknown'}, bounds=${imageModel.componentWidth}x${imageModel.componentHeight}, fit=${imageModel.fit}, target=${imageModel.targetWidth ?? 'unknown'}x${imageModel.targetHeight ?? 'unknown'}, calculated_scale=${imageModel.lvglScale}, emitted_scale=${imageModel.lvglScale} */`)

  if (asset?.lvgl || asset?.symbolName) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`${imageObject} = lv_image_create(${parentVar});`)
    lines.push(`lv_image_set_src(${imageObject}, &${symbol});`)
    if (imageExport) {
      lines.push(`${imageExport.sourceName} = &${symbol};`)
    }
    lines.push(`lv_image_set_scale(${imageObject}, ${imageModel.lvglScale});`)
    lines.push(`lv_image_set_inner_align(${imageObject}, LV_IMAGE_ALIGN_CENTER);`)
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

  lines.push(`lv_obj_set_style_opa(${renderObject}, ${Math.round(imageModel.opacity * 255)}, 0);`)
  if (!imageModel.visible) {
    lines.push(`lv_obj_add_flag(${renderObject}, LV_OBJ_FLAG_HIDDEN);`)
  }
  lines.push(`lv_obj_clear_flag(${renderObject}, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);`)

  lines.push(``)
  break
}
    
case 'Slider': {
  const sliderExport = sliderExports.get(child.id)
  const sliderObject = sliderExport?.objectName || varName
  const minimum = sliderExport?.minimum ??
    Math.min(integerProp(child.props.min, 0), integerProp(child.props.max, 100))
  const maximum = sliderExport?.maximum ??
    Math.max(integerProp(child.props.min, 0), integerProp(child.props.max, 100))
  const initialValue = sliderExport?.initialValue ??
    Math.max(minimum, Math.min(maximum, integerProp(child.props.value, 50)))
  lines.push(`${sliderObject} = lv_slider_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${sliderObject};`)
  lines.push(`lv_obj_set_pos(${sliderObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${sliderObject}, ${w}, ${h});`)
  lines.push(`lv_slider_set_range(${sliderObject}, ${minimum}, ${maximum});`)
  lines.push(`lv_slider_set_value(${sliderObject}, ${initialValue}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${sliderObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${sliderObject}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${sliderObject}, lv_color_hex(${palette.accentText}), LV_PART_KNOB);`)
  if (sliderExport) {
    lines.push(`${sliderExport.stateName} = ${initialValue};`)
    lines.push(`lv_obj_add_event_cb(${sliderObject}, ${sliderExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }
  lines.push(``)
  break
}

case 'Span': {
  const spans = normalizeForgeUISpans(child.props.spans)
  lines.push(`lv_obj_t * ${varName} = lv_spangroup_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, 0);`)
  const align = child.props.textAlign === 'center' ? 'LV_TEXT_ALIGN_CENTER' : child.props.textAlign === 'right' ? 'LV_TEXT_ALIGN_RIGHT' : 'LV_TEXT_ALIGN_LEFT'
  lines.push(`lv_spangroup_set_align(${varName}, ${align});`)
  lines.push(`lv_spangroup_set_overflow(${varName}, ${child.props.overflow === 'clip' || child.props.overflow === 'visible' ? 'LV_SPAN_OVERFLOW_CLIP' : 'LV_SPAN_OVERFLOW_ELLIPSIS'});`)
  spans.forEach((span, index) => {
    const role = span.semanticColor && palette[span.semanticColor] ? palette[span.semanticColor] : palette.text
    const color = span.color ? `0x${span.color.replace('#', '')}` : role
    const fontSize = resolveMontserratSize(span.fontSize, 16)
    lines.push(`lv_span_t * ${varName}_span_${index} = lv_spangroup_new_span(${varName});`)
    lines.push(`lv_span_set_text(${varName}_span_${index}, "${esc(span.text)}");`)
    lines.push(`lv_style_set_text_color(lv_span_get_style(${varName}_span_${index}), lv_color_hex(${color}));`)
    lines.push(`lv_style_set_text_font(lv_span_get_style(${varName}_span_${index}), &lv_font_montserrat_${fontSize});`)
    if (span.underline) lines.push(`lv_style_set_text_decor(lv_span_get_style(${varName}_span_${index}), LV_TEXT_DECOR_UNDERLINE);`)
  })
  lines.push(``)
  break
}

case 'ImageButton': {
  const imageButtonExport = iconButtonExports.get(child.id)
  const objectName = imageButtonExport?.objectName || varName
  const assets = forgeUIGetUploadedAssets()
  const released: any = assets.find(asset => asset.id === child.props.releasedAssetId)
  const pressed: any = assets.find(asset => asset.id === child.props.pressedAssetId) || released
  const disabled: any = assets.find(asset => asset.id === child.props.disabledAssetId) || released
  lines.push(imageButtonExport ? `${objectName} = lv_imagebutton_create(${parentVar});` : `lv_obj_t * ${objectName} = lv_imagebutton_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${objectName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${objectName}, ${w}, ${h});`)
  ;[[released, 'LV_IMAGEBUTTON_STATE_RELEASED'], [pressed, 'LV_IMAGEBUTTON_STATE_PRESSED'], [disabled, 'LV_IMAGEBUTTON_STATE_DISABLED']].forEach(([asset, state]) => {
    if (!asset?.lvgl) return
    if (asset.cFile) usedAssetSources.add(asset.cFile)
    lines.push(`LV_IMAGE_DECLARE(${asset.lvgl});`)
    lines.push(`lv_imagebutton_set_src(${objectName}, ${state}, NULL, &${asset.lvgl}, NULL);`)
  })
  lines.push(`lv_obj_set_style_image_opa(${objectName}, LV_OPA_COVER, LV_PART_MAIN);`)
  if (child.props.isDisabled) lines.push(`lv_obj_add_state(${objectName}, LV_STATE_DISABLED);`)
  if (imageButtonExport) {
    lines.push(`${imageButtonExport.enabledName} = ${imageButtonExport.initialEnabled ? 'true' : 'false'};`)
    lines.push(`lv_obj_add_event_cb(${objectName}, ${imageButtonExport.eventCallbackName}, LV_EVENT_CLICKED, NULL);`)
  }
  lines.push(``)
  break
}

case 'Window': {
  const p = child.props || {}
  const headerHeight = Math.max(28, integerProp(p.headerHeight, 48))
  const buttonSize = Math.max(20, integerProp(p.buttonSize, 32))
  const contentPadding = Math.max(0, integerProp(p.contentPadding, 8))
  const color = (value: unknown, fallback: string) =>
    `0x${String(value || fallback).replace('#', '').slice(0, 6)}`
  lines.push(`lv_obj_t * ${varName} = lv_win_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  if (p.visible === false) lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`lv_obj_set_style_opa(${varName}, ${Math.round(Math.max(0, Math.min(1, Number(p.opacity ?? 1))) * 255)}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, ${Math.max(0, integerProp(p.cornerRadius, 10))}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${Math.max(0, integerProp(p.borderWidth, 1))}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${color(p.borderColor, '#334155')}), LV_PART_MAIN);`)
  lines.push(`lv_obj_t * ${varName}_header = lv_win_get_header(${varName});`)
  lines.push(`lv_obj_set_height(${varName}_header, ${headerHeight});`)
  lines.push(`lv_obj_set_style_pad_hor(${varName}_header, ${Math.max(0, integerProp(p.headerPadding, 12))}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_column(${varName}_header, ${Math.max(0, integerProp(p.buttonSpacing, 6))}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_header, lv_color_hex(${color(p.headerBackground, '#172033')}), LV_PART_MAIN);`)
  if (p.showIcon !== false) {
    lines.push(`lv_obj_t * ${varName}_icon = lv_label_create(${varName}_header);`)
    lines.push(`lv_label_set_text(${varName}_icon, LV_SYMBOL_IMAGE);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_icon, lv_color_hex(${color(p.headerTextColor, '#F8FAFC')}), LV_PART_MAIN);`)
  }
  lines.push(`lv_obj_t * ${varName}_title = lv_win_add_title(${varName}, "${esc(String(p.title || 'Window'))}");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${color(p.headerTextColor, '#F8FAFC')}), LV_PART_MAIN);`)
  const titleAlign = p.titleAlign === 'center' ? 'LV_TEXT_ALIGN_CENTER' : p.titleAlign === 'right' ? 'LV_TEXT_ALIGN_RIGHT' : 'LV_TEXT_ALIGN_LEFT'
  lines.push(`lv_obj_set_style_text_align(${varName}_title, ${titleAlign}, LV_PART_MAIN);`)
  normalizeWindowActions(p.actionButtons).forEach((action, index) => {
    lines.push(`lv_obj_t * ${varName}_action_${index} = lv_win_add_button(${varName}, NULL, ${buttonSize});`)
    lines.push(`lv_obj_t * ${varName}_action_${index}_label = lv_label_create(${varName}_action_${index});`)
    lines.push(`lv_label_set_text(${varName}_action_${index}_label, ${/^LV_SYMBOL_[A-Z0-9_]+$/.test(action.icon) ? action.icon : 'LV_SYMBOL_SETTINGS'});`)
    lines.push(`lv_obj_center(${varName}_action_${index}_label);`)
    if (!action.enabled) lines.push(`lv_obj_add_state(${varName}_action_${index}, LV_STATE_DISABLED);`)
  })
  if (p.showCloseButton !== false) {
    lines.push(`lv_obj_t * ${varName}_close = lv_win_add_button(${varName}, NULL, ${buttonSize});`)
    lines.push(`lv_obj_t * ${varName}_close_label = lv_label_create(${varName}_close);`)
    lines.push(`lv_label_set_text(${varName}_close_label, LV_SYMBOL_CLOSE);`)
    lines.push(`lv_obj_center(${varName}_close_label);`)
    lines.push(`lv_obj_add_event_cb(${varName}_close, fg_window_close_cb, LV_EVENT_CLICKED, ${varName});`)
  }
  lines.push(`lv_obj_t * ${varName}_content = lv_win_get_content(${varName});`)
  lines.push(`lv_obj_set_style_pad_all(${varName}_content, ${contentPadding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_content, lv_color_hex(${color(p.contentBackground, '#0F172A')}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_scrollbar_mode(${varName}_content, LV_SCROLLBAR_MODE_${windowScrollbarMode(p.scrollbarMode).toUpperCase()});`)
  if (p.scrollingEnabled === false) lines.push(`lv_obj_clear_flag(${varName}_content, LV_OBJ_FLAG_SCROLLABLE);`)
  if (p.childClipping === false) lines.push(`lv_obj_add_flag(${varName}_content, LV_OBJ_FLAG_OVERFLOW_VISIBLE);`)
  childParentVar = `${varName}_content`
  lines.push(``)
  break
}

case 'Menu': {
  const p = child.props || {}
  const pages = normalizeForgeUIMenuPages(p.pages)
  const rootPageId = resolveForgeUIMenuRootPageId(pages, p.rootPageId)
  const color = (value: unknown, fallback: string) =>
    `0x${String(value || fallback).replace('#', '').slice(0, 6)}`
  const headerMode = p.headerMode === 'top-unfixed' ? 'LV_MENU_HEADER_TOP_UNFIXED'
    : p.headerMode === 'bottom-fixed' ? 'LV_MENU_HEADER_BOTTOM_FIXED' : 'LV_MENU_HEADER_TOP_FIXED'
  lines.push(`lv_obj_t * ${varName} = lv_menu_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_menu_set_mode_header(${varName}, ${headerMode});`)
  lines.push(`lv_menu_set_mode_root_back_button(${varName}, ${p.rootBackButton ? 'LV_MENU_ROOT_BACK_BUTTON_ENABLED' : 'LV_MENU_ROOT_BACK_BUTTON_DISABLED'});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${color(p.background, '#0F172A')}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${color(p.borderColor, '#334155')}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${Math.max(0, integerProp(p.borderWidth, 1))}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, ${Math.max(0, integerProp(p.cornerRadius, 10))}, LV_PART_MAIN);`)
  pages.forEach((page, pageIndex) => {
    lines.push(`lv_obj_t * ${varName}_page_${pageIndex} = lv_menu_page_create(${varName}, "${esc(page.title)}");`)
    lines.push(`lv_obj_set_style_bg_color(${varName}_page_${pageIndex}, lv_color_hex(${color(p.background, '#0F172A')}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_pad_all(${varName}_page_${pageIndex}, ${Math.max(0, integerProp(p.padding, 4))}, LV_PART_MAIN);`)
  })
  pages.forEach((page, pageIndex) => {
    page.sections.forEach((section, sectionIndex) => {
      const sectionName = `${varName}_page_${pageIndex}_section_${sectionIndex}`
      lines.push(`lv_obj_t * ${sectionName} = lv_menu_section_create(${varName}_page_${pageIndex});`)
      if (section.title) {
        lines.push(`lv_obj_t * ${sectionName}_title = lv_label_create(${sectionName});`)
        lines.push(`lv_label_set_text(${sectionName}_title, "${esc(section.title)}");`)
        lines.push(`lv_obj_set_style_text_color(${sectionName}_title, lv_color_hex(${color(p.secondaryTextColor, '#94A3B8')}), LV_PART_MAIN);`)
      }
      section.items.forEach((item, itemIndex) => {
        const itemName = `${sectionName}_item_${itemIndex}`
        lines.push(`lv_obj_t * ${itemName} = lv_menu_cont_create(${sectionName});`)
        lines.push(`lv_obj_set_flex_flow(${itemName}, LV_FLEX_FLOW_ROW);`)
        lines.push(`lv_obj_set_style_pad_all(${itemName}, 8, LV_PART_MAIN);`)
        if (item.icon) {
          lines.push(`lv_obj_t * ${itemName}_icon = lv_label_create(${itemName});`)
          lines.push(`lv_label_set_text(${itemName}_icon, ${/^LV_SYMBOL_[A-Z0-9_]+$/.test(item.icon) ? item.icon : 'LV_SYMBOL_BULLET'});`)
          lines.push(`lv_obj_set_style_text_color(${itemName}_icon, lv_color_hex(${color(p.textColor, '#F8FAFC')}), LV_PART_MAIN);`)
        }
        lines.push(`lv_obj_t * ${itemName}_text = lv_obj_create(${itemName});`)
        lines.push(`lv_obj_set_size(${itemName}_text, LV_PCT(100), LV_SIZE_CONTENT);`)
        lines.push(`lv_obj_set_flex_grow(${itemName}_text, 1);`)
        lines.push(`lv_obj_set_flex_flow(${itemName}_text, LV_FLEX_FLOW_COLUMN);`)
        lines.push(`lv_obj_set_style_bg_opa(${itemName}_text, LV_OPA_TRANSP, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_border_width(${itemName}_text, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_set_style_pad_all(${itemName}_text, 0, LV_PART_MAIN);`)
        lines.push(`lv_obj_t * ${itemName}_label = lv_label_create(${itemName}_text);`)
        lines.push(`lv_label_set_text(${itemName}_label, "${esc(item.label)}");`)
        lines.push(`lv_obj_set_style_text_color(${itemName}_label, lv_color_hex(${color(p.textColor, '#F8FAFC')}), LV_PART_MAIN);`)
        if (item.subtitle) {
          lines.push(`lv_obj_t * ${itemName}_subtitle = lv_label_create(${itemName}_text);`)
          lines.push(`lv_label_set_text(${itemName}_subtitle, "${esc(item.subtitle)}");`)
          lines.push(`lv_obj_set_style_text_color(${itemName}_subtitle, lv_color_hex(${color(p.secondaryTextColor, '#94A3B8')}), LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_text_font(${itemName}_subtitle, &lv_font_montserrat_12, LV_PART_MAIN);`)
        }
        const targetIndex = pages.findIndex(target => target.id === item.targetPageId)
        if (targetIndex >= 0) {
          lines.push(`lv_obj_t * ${itemName}_arrow = lv_label_create(${itemName});`)
          lines.push(`lv_label_set_text(${itemName}_arrow, LV_SYMBOL_RIGHT);`)
          lines.push(`lv_menu_set_load_page_event(${varName}, ${itemName}, ${varName}_page_${targetIndex});`)
        }
        if (!item.enabled) lines.push(`lv_obj_add_state(${itemName}, LV_STATE_DISABLED);`)
      })
      if (sectionIndex < page.sections.length - 1) lines.push(`lv_menu_separator_create(${varName}_page_${pageIndex});`)
    })
  })
  const rootIndex = Math.max(0, pages.findIndex(page => page.id === rootPageId))
  lines.push(`lv_menu_set_page(${varName}, ${varName}_page_${rootIndex});`)
  lines.push(`lv_obj_t * ${varName}_header = lv_menu_get_main_header(${varName});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_header, lv_color_hex(${color(p.headerBackground, '#172033')}), LV_PART_MAIN);`)
  lines.push(``)
  break
}

case 'DashboardCard': {
  const model = normalizeForgeUIDashboardCard(child.props)
  const card = dashboardCardExports.get(child.id)
  if (!card) break
  const accent = model.accentColor
    ? `0x${model.accentColor.slice(1)}`
    : palette.accent
  const statusColor = model.status === 'critical' ? palette.healthCritical
    : model.status === 'warning' ? palette.healthHigh
      : model.status === 'offline' ? palette.disabledText : palette.healthNormal
  const symbol = /^LV_SYMBOL_[A-Z0-9_]+$/.test(model.icon) ? model.icon : ''
  const cardWidth = integerProp(w, 240)
  lines.push(`${card.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${card.rootName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${card.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${card.rootName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${card.rootName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${card.rootName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${card.rootName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${card.rootName}, ${model.padding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${card.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  if (model.enableClick && card.callbackName) {
    lines.push(`lv_obj_add_flag(${card.rootName}, LV_OBJ_FLAG_CLICKABLE);`)
    lines.push(`lv_obj_add_event_cb(${card.rootName}, ${card.callbackName}, LV_EVENT_CLICKED, NULL);`)
  } else {
    lines.push(`lv_obj_clear_flag(${card.rootName}, LV_OBJ_FLAG_CLICKABLE);`)
  }
  let cursorY = model.padding
  if (model.showHeader) {
    if (symbol) {
      lines.push(`lv_obj_t * ${varName}_icon = lv_label_create(${card.rootName});`)
      lines.push(`lv_label_set_text(${varName}_icon, ${symbol});`)
      lines.push(`lv_obj_set_pos(${varName}_icon, ${model.padding}, ${cursorY});`)
      lines.push(`lv_obj_set_style_text_color(${varName}_icon, lv_color_hex(${accent}), LV_PART_MAIN);`)
    }
    lines.push(`${card.titleName} = lv_label_create(${card.rootName});`)
    lines.push(`lv_label_set_text(${card.titleName}, "${esc(model.title)}");`)
    lines.push(`lv_obj_set_pos(${card.titleName}, ${model.padding + (symbol ? 20 : 0)}, ${cursorY});`)
    lines.push(`lv_obj_set_width(${card.titleName}, ${Math.max(20, cardWidth - model.padding * 2 - (symbol ? 20 : 0) - (model.showStatus ? 78 : 0))});`)
    lines.push(`lv_label_set_long_mode(${card.titleName}, LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_color(${card.titleName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${card.titleName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    if (model.showStatus) {
      lines.push(`${card.statusIndicatorName} = lv_obj_create(${card.rootName});`)
      lines.push(`lv_obj_set_size(${card.statusIndicatorName}, 6, 6);`)
      lines.push(`lv_obj_align(${card.statusIndicatorName}, LV_ALIGN_TOP_RIGHT, -${model.padding + 68}, ${cursorY + 5});`)
      lines.push(`lv_obj_set_style_radius(${card.statusIndicatorName}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
      lines.push(`lv_obj_set_style_bg_color(${card.statusIndicatorName}, lv_color_hex(${statusColor}), LV_PART_MAIN);`)
      lines.push(`lv_obj_set_style_border_width(${card.statusIndicatorName}, 0, LV_PART_MAIN);`)
      lines.push(`${card.statusName} = lv_label_create(${card.rootName});`)
      lines.push(`lv_label_set_text(${card.statusName}, "${esc(model.statusText)}");`)
      lines.push(`lv_obj_align(${card.statusName}, LV_ALIGN_TOP_RIGHT, -${model.padding}, ${cursorY});`)
      lines.push(`lv_obj_set_style_text_color(${card.statusName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
      lines.push(`lv_obj_set_style_text_font(${card.statusName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    }
    cursorY += 26
  }
  lines.push(`${card.valueName} = lv_label_create(${card.rootName});`)
  lines.push(`lv_label_set_text(${card.valueName}, "${esc(model.value)}");`)
  lines.push(`lv_obj_set_pos(${card.valueName}, ${model.padding}, ${cursorY});`)
  lines.push(`lv_obj_set_style_text_font(${card.valueName}, &lv_font_montserrat_28, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${card.valueName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`${card.unitsName} = lv_label_create(${card.rootName});`)
  lines.push(`lv_label_set_text(${card.unitsName}, "${esc(model.units)}");`)
  lines.push(`lv_obj_align_to(${card.unitsName}, ${card.valueName}, LV_ALIGN_OUT_RIGHT_BOTTOM, 6, -2);`)
  lines.push(`lv_obj_set_style_text_color(${card.unitsName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  cursorY += 38
  if (model.secondaryText) {
    lines.push(`${card.descriptionName} = lv_label_create(${card.rootName});`)
    lines.push(`lv_label_set_text(${card.descriptionName}, "${esc(model.secondaryText)}");`)
    lines.push(`lv_obj_set_pos(${card.descriptionName}, ${model.padding}, ${cursorY});`)
    lines.push(`lv_obj_set_width(${card.descriptionName}, ${Math.max(20, cardWidth - model.padding * 2)});`)
    lines.push(`lv_label_set_long_mode(${card.descriptionName}, LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_color(${card.descriptionName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${card.descriptionName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    cursorY += 21
  }
  if (model.showProgress) {
    lines.push(`${card.progressName} = lv_bar_create(${card.rootName});`)
    lines.push(`lv_obj_set_pos(${card.progressName}, ${model.padding}, ${cursorY});`)
    lines.push(`lv_obj_set_size(${card.progressName}, ${Math.max(20, cardWidth - model.padding * 2)}, 6);`)
    lines.push(`lv_bar_set_range(${card.progressName}, 0, 100);`)
    lines.push(`lv_bar_set_value(${card.progressName}, ${Math.round(model.progress)}, LV_ANIM_OFF);`)
    lines.push(`lv_obj_set_style_bg_color(${card.progressName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${card.progressName}, lv_color_hex(${accent}), LV_PART_INDICATOR);`)
  }
  if (model.showFooter) {
    lines.push(`${card.footerName} = lv_label_create(${card.rootName});`)
    lines.push(`lv_label_set_text(${card.footerName}, "${esc(model.timestamp)}");`)
    lines.push(`lv_obj_align(${card.footerName}, LV_ALIGN_BOTTOM_LEFT, ${model.padding}, -${model.padding});`)
    lines.push(`lv_obj_set_style_text_color(${card.footerName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${card.footerName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
  }
  lines.push(``)
  break
}

case 'SensorTile': {
  const model = normalizeForgeUISensorTile(child.props)
  const tile = sensorTileExports.get(child.id)
  if (!tile) break
  const statusColor = model.status === 'critical' ? palette.healthCritical : model.status === 'warning'
    ? palette.healthHigh : model.status === 'offline' ? palette.disabledText : palette.healthNormal
  const accent = model.accentColor ? `0x${model.accentColor.slice(1)}` : model.autoColour ? statusColor : palette.accent
  const symbol = /^LV_SYMBOL_[A-Z0-9_]+$/.test(model.icon) ? model.icon : ''
  const tileWidth = integerProp(w, 240)
  const headerY = model.padding
  const valueY = headerY + 22
  let contentY = valueY + 34
  lines.push(`${tile.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${tile.rootName};`)
  lines.push(`lv_obj_set_pos(${tile.rootName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${tile.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${tile.rootName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${tile.rootName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${tile.rootName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${tile.rootName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${tile.rootName}, ${model.padding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${tile.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  if (model.enableClick && tile.callbackName) {
    lines.push(`lv_obj_add_flag(${tile.rootName}, LV_OBJ_FLAG_CLICKABLE);`)
    lines.push(`lv_obj_add_event_cb(${tile.rootName}, ${tile.callbackName}, LV_EVENT_CLICKED, NULL);`)
  } else lines.push(`lv_obj_clear_flag(${tile.rootName}, LV_OBJ_FLAG_CLICKABLE);`)
  if (symbol) {
    lines.push(`${tile.iconName} = lv_label_create(${tile.rootName});`)
    lines.push(`lv_label_set_text(${tile.iconName}, ${symbol});`)
    lines.push(`lv_obj_set_pos(${tile.iconName}, ${model.padding}, ${headerY});`)
    lines.push(`lv_obj_set_style_text_font(${tile.iconName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${tile.iconName}, lv_color_hex(${accent}), LV_PART_MAIN);`)
  }
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${tile.rootName});`)
  lines.push(`lv_label_set_text(${varName}_title, "${esc(model.title)}");`)
  lines.push(`lv_obj_set_pos(${varName}_title, ${model.padding + (symbol ? 18 : 0)}, ${headerY});`)
  lines.push(`lv_obj_set_width(${varName}_title, ${Math.max(20, tileWidth - model.padding * 2 - (symbol ? 18 : 0) - 78)});`)
  lines.push(`lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT);`)
  lines.push(`lv_obj_set_style_text_font(${varName}_title, &lv_font_montserrat_12, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`${tile.statusIndicatorName} = lv_obj_create(${tile.rootName});`)
  lines.push(`lv_obj_set_size(${tile.statusIndicatorName}, 6, 6);`)
  lines.push(`lv_obj_align(${tile.statusIndicatorName}, LV_ALIGN_TOP_RIGHT, -${model.padding + 62}, ${headerY + 4});`)
  lines.push(`lv_obj_set_style_radius(${tile.statusIndicatorName}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${tile.statusIndicatorName}, lv_color_hex(${statusColor}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${tile.statusIndicatorName}, 0, LV_PART_MAIN);`)
  lines.push(`${tile.statusName} = lv_label_create(${tile.rootName});`)
  lines.push(`lv_label_set_text(${tile.statusName}, "${esc(model.statusText)}");`)
  lines.push(`lv_obj_align(${tile.statusName}, LV_ALIGN_TOP_RIGHT, -${model.padding}, ${headerY});`)
  lines.push(`lv_obj_set_style_text_font(${tile.statusName}, &lv_font_montserrat_10, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${tile.statusName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  lines.push(`${tile.valueName} = lv_label_create(${tile.rootName});`)
  lines.push(`lv_label_set_text_fmt(${tile.valueName}, "%.*f", ${model.decimals}, (double)${model.value});`)
  lines.push(`lv_obj_set_pos(${tile.valueName}, ${model.padding}, ${valueY});`)
  lines.push(`lv_obj_set_style_text_font(${tile.valueName}, &lv_font_montserrat_28, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${tile.valueName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`${tile.unitsName} = lv_label_create(${tile.rootName});`)
  lines.push(`lv_label_set_text(${tile.unitsName}, "${esc(model.units)}");`)
  lines.push(`lv_obj_align_to(${tile.unitsName}, ${tile.valueName}, LV_ALIGN_OUT_RIGHT_BOTTOM, 5, -2);`)
  lines.push(`lv_obj_set_style_text_font(${tile.unitsName}, &lv_font_montserrat_14, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${tile.unitsName}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  if (model.showTrend) {
    lines.push(`${tile.trendName} = lv_label_create(${tile.rootName});`)
    lines.push(`lv_label_set_text(${tile.trendName}, "${esc(getForgeUISensorTrendLabel(model.trend))}");`)
    lines.push(`lv_obj_set_pos(${tile.trendName}, ${model.padding}, ${contentY});`)
    lines.push(`lv_obj_set_style_text_font(${tile.trendName}, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${tile.trendName}, lv_color_hex(${accent}), LV_PART_MAIN);`)
    contentY += 20
  }
  if (model.showProgress) {
    lines.push(`${tile.progressName} = lv_bar_create(${tile.rootName});`)
    lines.push(`lv_obj_set_pos(${tile.progressName}, ${model.padding}, ${contentY});`)
    lines.push(`lv_obj_set_size(${tile.progressName}, ${Math.max(20, tileWidth - model.padding * 2)}, 6);`)
    lines.push(`lv_bar_set_range(${tile.progressName}, 0, 100);`)
    lines.push(`lv_bar_set_value(${tile.progressName}, ${Math.round(model.progress)}, LV_ANIM_OFF);`)
    lines.push(`lv_obj_set_style_bg_color(${tile.progressName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${tile.progressName}, lv_color_hex(${accent}), LV_PART_INDICATOR);`)
    contentY += 12
  }
  if (model.showTimestamp) {
    lines.push(`${tile.timestampName} = lv_label_create(${tile.rootName});`)
    lines.push(`lv_label_set_text(${tile.timestampName}, "${esc(model.timestamp)}");`)
    lines.push(`lv_obj_set_pos(${tile.timestampName}, ${model.padding}, ${contentY});`)
    lines.push(`lv_obj_set_style_text_font(${tile.timestampName}, &lv_font_montserrat_10, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${tile.timestampName}, lv_color_hex(${palette.disabledText}), LV_PART_MAIN);`)
  }
  lines.push(``)
  break
}

case 'RelayPanel': {
  const model = normalizeForgeUIRelayPanel(child.props)
  const panel = relayPanelExports.get(child.id)
  if (!panel) break
  const panelWidth = Math.max(160, integerProp(w, 340))
  const symbol = /^LV_SYMBOL_[A-Z0-9_]+$/.test(model.icon) ? model.icon : 'LV_SYMBOL_POWER'
  const active = toLvHex(model.activeColour)
  const inactive = toLvHex(model.inactiveColour)
  const disabled = toLvHex(model.disabledColour)
  lines.push(`${panel.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${panel.rootName};`)
  lines.push(`lv_obj_set_pos(${panel.rootName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${panel.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${panel.rootName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${panel.rootName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${panel.rootName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${panel.rootName}, 12, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${panel.rootName}, ${model.padding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${panel.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_icon = lv_label_create(${panel.rootName});`)
  lines.push(`lv_label_set_text(${varName}_icon, ${symbol});`)
  lines.push(`lv_obj_set_pos(${varName}_icon, ${model.padding}, ${model.padding});`)
  lines.push(`lv_obj_set_style_text_color(${varName}_icon, lv_color_hex(${active}), LV_PART_MAIN);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${panel.rootName});`)
  lines.push(`lv_label_set_text(${varName}_title, "${esc(model.title)}");`)
  lines.push(`lv_obj_set_pos(${varName}_title, ${model.padding + 26}, ${model.padding});`)
  lines.push(`lv_obj_set_width(${varName}_title, ${Math.max(40, panelWidth - model.padding * 2 - 100)});`)
  lines.push(`lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT);`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  if (model.subtitle) {
    lines.push(`lv_obj_t * ${varName}_subtitle = lv_label_create(${panel.rootName});`)
    lines.push(`lv_label_set_text(${varName}_subtitle, "${esc(model.subtitle)}");`)
    lines.push(`lv_obj_set_pos(${varName}_subtitle, ${model.padding + 26}, ${model.padding + 20});`)
    lines.push(`lv_obj_set_width(${varName}_subtitle, ${Math.max(40, panelWidth - model.padding * 2 - 100)});`)
    lines.push(`lv_label_set_long_mode(${varName}_subtitle, LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_font(${varName}_subtitle, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_subtitle, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  }
  if (model.showMasterControl) {
    lines.push(`${panel.masterObjectName} = lv_switch_create(${panel.rootName});`)
    lines.push(`lv_obj_align(${panel.masterObjectName}, LV_ALIGN_TOP_RIGHT, -${model.padding}, ${model.padding});`)
    if (model.masterState) lines.push(`lv_obj_add_state(${panel.masterObjectName}, LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_color(${panel.masterObjectName}, lv_color_hex(${inactive}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${panel.masterObjectName}, lv_color_hex(${active}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
    if (panel.masterCallbackName) lines.push(`lv_obj_add_event_cb(${panel.masterObjectName}, ${panel.masterCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }
  const columns = model.layoutMode === 'compact' ? 2 : 1
  const usableWidth = panelWidth - model.padding * 2
  const rowWidth = Math.max(100, Math.floor((usableWidth - (columns - 1) * model.gap) / columns))
  const rowHeight = model.layoutMode === 'compact' ? 48 : 52
  model.channels.forEach((channel, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const rowName = `${varName}_relay_row_${index}`
    const rowX = model.padding + column * (rowWidth + model.gap)
    const rowY = model.padding + 52 + row * (rowHeight + model.gap)
    lines.push(`lv_obj_t * ${rowName} = lv_obj_create(${panel.rootName});`)
    lines.push(`lv_obj_set_pos(${rowName}, ${rowX}, ${rowY});`)
    lines.push(`lv_obj_set_size(${rowName}, ${rowWidth}, ${rowHeight});`)
    lines.push(`lv_obj_set_style_bg_color(${rowName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${rowName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${rowName}, 8, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${rowName}, LV_OBJ_FLAG_SCROLLABLE);`)
    lines.push(`${panel.labelObjectsName}[${index}] = lv_label_create(${rowName});`)
    lines.push(`lv_label_set_text(${panel.labelObjectsName}[${index}], "${esc(model.showChannelNumbers ? `${index + 1}. ${channel.label}` : channel.label)}");`)
    lines.push(`lv_obj_set_pos(${panel.labelObjectsName}[${index}], 8, 6);`)
    lines.push(`lv_obj_set_width(${panel.labelObjectsName}[${index}], ${Math.max(20, rowWidth - 72)});`)
    lines.push(`lv_label_set_long_mode(${panel.labelObjectsName}[${index}], LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_font(${panel.labelObjectsName}[${index}], &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${panel.labelObjectsName}[${index}], lv_color_hex(${channel.enabled ? palette.textPrimary : disabled}), LV_PART_MAIN);`)
    lines.push(`${panel.statusObjectsName}[${index}] = lv_label_create(${rowName});`)
    lines.push(`lv_label_set_text(${panel.statusObjectsName}[${index}], "${esc(channel.statusText)}");`)
    lines.push(`lv_obj_set_pos(${panel.statusObjectsName}[${index}], 8, 25);`)
    lines.push(`lv_obj_set_width(${panel.statusObjectsName}[${index}], ${Math.max(20, rowWidth - 72)});`)
    lines.push(`lv_label_set_long_mode(${panel.statusObjectsName}[${index}], LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_font(${panel.statusObjectsName}[${index}], &lv_font_montserrat_10, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${panel.statusObjectsName}[${index}], lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`${panel.channelObjectsName}[${index}] = lv_switch_create(${rowName});`)
    lines.push(`lv_obj_align(${panel.channelObjectsName}[${index}], LV_ALIGN_RIGHT_MID, -7, 0);`)
    lines.push(`${panel.stateName}[${index}] = ${channel.state ? 'true' : 'false'};`)
    lines.push(`${panel.enabledName}[${index}] = ${channel.enabled ? 'true' : 'false'};`)
    if (channel.state) lines.push(`lv_obj_add_state(${panel.channelObjectsName}[${index}], LV_STATE_CHECKED);`)
    if (!channel.enabled) lines.push(`lv_obj_add_state(${panel.channelObjectsName}[${index}], LV_STATE_DISABLED);`)
    lines.push(`lv_obj_set_style_bg_color(${panel.channelObjectsName}[${index}], lv_color_hex(${channel.enabled ? inactive : disabled}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${panel.channelObjectsName}[${index}], lv_color_hex(${active}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
    if (panel.channelCallbackName) lines.push(`lv_obj_add_event_cb(${panel.channelObjectsName}[${index}], ${panel.channelCallbackName}, LV_EVENT_VALUE_CHANGED, (void *)(uintptr_t)${index});`)
  })
  if (model.showFooter) {
    lines.push(`lv_obj_t * ${varName}_footer = lv_label_create(${panel.rootName});`)
    lines.push(`lv_label_set_text(${varName}_footer, "${esc(model.footerText)}");`)
    lines.push(`lv_obj_align(${varName}_footer, LV_ALIGN_BOTTOM_LEFT, ${model.padding}, -${model.padding});`)
    lines.push(`lv_obj_set_style_text_font(${varName}_footer, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_footer, lv_color_hex(${palette.disabledText}), LV_PART_MAIN);`)
  }
  lines.push(``)
  break
}

case 'PwmController': {
  const model = normalizeForgeUIPwmController(child.props)
  const pwm = pwmControllerExports.get(child.id)
  if (!pwm) break
  const accent = model.accentColour ? toLvHex(model.accentColour) : palette.accent
  const controlActive = toLvHex('#22C55E')
  const controlInactive = toLvHex('#475569')
  const scaled = (value: number) => Math.round(value * pwm.scale)
  lines.push(`${pwm.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${pwm.rootName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${pwm.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${pwm.rootName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${pwm.rootName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${pwm.rootName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${pwm.rootName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${pwm.rootName}, 12, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${pwm.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${pwm.stateName} = ${cFloatLiteral(model.value)};`)
  lines.push(`${pwm.enabledName} = ${model.enabled ? 'true' : 'false'};`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${pwm.rootName});`)
  lines.push(`lv_label_set_text(${varName}_title, "${esc(model.label)}");`)
  lines.push(`lv_obj_set_pos(${varName}_title, 0, 0);`)
  lines.push(`lv_obj_set_width(${varName}_title, ${Math.max(40, Number(w) - 82 || 158)});`)
  lines.push(`lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT);`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  if (model.subtitle) {
    lines.push(`lv_obj_t * ${varName}_subtitle = lv_label_create(${pwm.rootName});`)
    lines.push(`lv_label_set_text(${varName}_subtitle, "${esc(model.subtitle)}");`)
    lines.push(`lv_obj_set_pos(${varName}_subtitle, 0, 19);`)
    lines.push(`lv_obj_set_width(${varName}_subtitle, ${Math.max(40, Number(w) - 82 || 158)});`)
    lines.push(`lv_label_set_long_mode(${varName}_subtitle, LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_font(${varName}_subtitle, &lv_font_montserrat_12, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_subtitle, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  }
  if (model.showNumericValue) {
    lines.push(`${pwm.valueLabelName} = lv_label_create(${pwm.rootName});`)
    lines.push(`lv_label_set_text_fmt(${pwm.valueLabelName}, "%.6g ${escPrintfLiteral(model.unit)}", (double)${cFloatLiteral(model.value)});`)
    lines.push(`lv_obj_align(${pwm.valueLabelName}, LV_ALIGN_TOP_MID, 0, 35);`)
    lines.push(`lv_obj_set_style_text_font(${pwm.valueLabelName}, &lv_font_montserrat_24, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${pwm.valueLabelName}, lv_color_hex(${accent}), LV_PART_MAIN);`)
  }
  if (model.showSlider) {
    lines.push(`${pwm.sliderName} = lv_slider_create(${pwm.rootName});`)
    lines.push(`lv_slider_set_range(${pwm.sliderName}, ${scaled(model.minimum)}, ${scaled(model.maximum)});`)
    lines.push(`lv_slider_set_value(${pwm.sliderName}, ${scaled(model.value)}, LV_ANIM_OFF);`)
    if (model.orientation === 'vertical') lines.push(`lv_obj_set_size(${pwm.sliderName}, 18, ${Math.max(40, Number(h) - 88 || 57)}); lv_obj_align(${pwm.sliderName}, LV_ALIGN_CENTER, 0, 10);`)
    else lines.push(`lv_obj_set_size(${pwm.sliderName}, ${Math.max(80, Number(w) - 24 || 216)}, 18); lv_obj_align(${pwm.sliderName}, LV_ALIGN_CENTER, 0, 24);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.sliderName}, lv_color_hex(${controlInactive}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.sliderName}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${pwm.sliderName}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.sliderName}, lv_color_hex(${controlActive}), LV_PART_INDICATOR);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.sliderName}, LV_OPA_COVER, LV_PART_INDICATOR);`)
    lines.push(`lv_obj_set_style_radius(${pwm.sliderName}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.sliderName}, lv_color_hex(${palette.textPrimary}), LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.sliderName}, LV_OPA_COVER, LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_border_width(${pwm.sliderName}, 0, LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_radius(${pwm.sliderName}, LV_RADIUS_CIRCLE, LV_PART_KNOB);`)
    if (!model.enabled) lines.push(`lv_obj_add_state(${pwm.sliderName}, LV_STATE_DISABLED);`)
    if (pwm.valueCallbackName) lines.push(`lv_obj_add_event_cb(${pwm.sliderName}, ${pwm.valueCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }
  if (model.showEnableControl) {
    lines.push(`${pwm.enableName} = lv_switch_create(${pwm.rootName});`)
    lines.push(`lv_obj_set_size(${pwm.enableName}, 40, 22);`)
    lines.push(`lv_obj_align(${pwm.enableName}, LV_ALIGN_TOP_RIGHT, 0, 0);`)
    if (model.enabled) lines.push(`lv_obj_add_state(${pwm.enableName}, LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.enableName}, lv_color_hex(${controlInactive}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.enableName}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${pwm.enableName}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${pwm.enableName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.enableName}, lv_color_hex(${controlActive}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.enableName}, LV_OPA_COVER, LV_PART_INDICATOR | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_radius(${pwm.enableName}, LV_RADIUS_CIRCLE, LV_PART_INDICATOR | LV_STATE_CHECKED);`)
    lines.push(`lv_obj_set_style_bg_color(${pwm.enableName}, lv_color_hex(${palette.textPrimary}), LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_bg_opa(${pwm.enableName}, LV_OPA_COVER, LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_border_width(${pwm.enableName}, 0, LV_PART_KNOB);`)
    lines.push(`lv_obj_set_style_radius(${pwm.enableName}, LV_RADIUS_CIRCLE, LV_PART_KNOB);`)
    if (pwm.enabledCallbackName) lines.push(`lv_obj_add_event_cb(${pwm.enableName}, ${pwm.enabledCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }
  if (model.statusText) {
    lines.push(`lv_obj_t * ${varName}_footer = lv_label_create(${pwm.rootName}); lv_label_set_text(${varName}_footer, "${esc(model.statusText)}");`)
    lines.push(`lv_obj_set_width(${varName}_footer, ${Math.max(40, Math.floor((Number(w) || 240) / 2) - 18)});`)
    lines.push(`lv_label_set_long_mode(${varName}_footer, LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_align(${varName}_footer, LV_ALIGN_BOTTOM_LEFT, 0, 0); lv_obj_set_style_text_font(${varName}_footer, &lv_font_montserrat_12, LV_PART_MAIN);`)
  }
  lines.push(`lv_obj_t * ${varName}_range = lv_label_create(${pwm.rootName});`)
  lines.push(`lv_label_set_text_fmt(${varName}_range, "%.6g-%.6g ${escPrintfLiteral(model.unit)}", (double)${cFloatLiteral(model.minimum)}, (double)${cFloatLiteral(model.maximum)});`)
  lines.push(`lv_obj_align(${varName}_range, LV_ALIGN_BOTTOM_RIGHT, 0, 0);`)
  lines.push(`lv_obj_set_style_text_font(${varName}_range, &lv_font_montserrat_12, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}_range, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  lines.push(``)
  break
}

case 'AlarmPanel': {
  const model = normalizeForgeUIAlarmPanel(child.props)
  const alarm = alarmPanelExports.get(child.id)
  if (!alarm) break
  const headerHeight = model.showHeader ? (model.compactMode ? 32 : 42) : 4
  const footerHeight = model.showFooter ? 24 : 4
  const availableRowHeight = Math.floor((Number(h) - headerHeight - footerHeight - model.rowSpacing * Math.max(0, alarm.visibleRows - 1)) / alarm.visibleRows)
  const rowHeight = Math.max(model.compactMode ? 28 : 36, Math.min(model.compactMode ? 32 : 43, availableRowHeight))
  const rowWidth = Math.max(20, Number(w) - 16)
  const messageWidth = Math.max(40, rowWidth - (model.showAcknowledgement ? 152 : 110))
  lines.push(`${alarm.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${alarm.rootName}, ${x}, ${y}); lv_obj_set_size(${alarm.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${alarm.rootName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${alarm.rootName}, lv_color_hex(${palette.surfaceBorder}), 0); lv_obj_set_style_border_width(${alarm.rootName}, 1, 0); lv_obj_set_style_radius(${alarm.rootName}, 10, 0); lv_obj_set_style_pad_all(${alarm.rootName}, 0, 0);`)
  lines.push(`lv_obj_clear_flag(${alarm.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  if (model.showHeader) {
    lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${alarm.rootName}); lv_label_set_text(${varName}_title, "${esc(model.title)}"); lv_obj_set_pos(${varName}_title, 12, ${model.compactMode ? 7 : 11});`)
    lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), 0);`)
    lines.push(`${alarm.countLabelName} = lv_label_create(${alarm.rootName}); lv_obj_align(${alarm.countLabelName}, LV_ALIGN_TOP_RIGHT, -12, ${model.compactMode ? 5 : 8}); lv_obj_set_style_text_color(${alarm.countLabelName}, lv_color_hex(0xE5484D), 0); lv_obj_set_style_bg_color(${alarm.countLabelName}, lv_color_hex(0xFDE2E2), 0); lv_obj_set_style_bg_opa(${alarm.countLabelName}, LV_OPA_COVER, 0); lv_obj_set_style_pad_hor(${alarm.countLabelName}, 5, 0); lv_obj_set_style_pad_ver(${alarm.countLabelName}, 2, 0); lv_obj_set_style_radius(${alarm.countLabelName}, 3, 0);`)
  }
  for (let index = 0; index < alarm.visibleRows; index++) {
    lines.push(`${alarm.rowNames}[${index}] = lv_button_create(${alarm.rootName});`)
    lines.push(`lv_obj_set_pos(${alarm.rowNames}[${index}], 8, ${headerHeight + index * (rowHeight + model.rowSpacing)}); lv_obj_set_size(${alarm.rowNames}[${index}], ${rowWidth}, ${rowHeight});`)
    lines.push(`lv_obj_set_style_bg_color(${alarm.rowNames}[${index}], lv_color_hex(${palette.surfaceSecondary}), 0); lv_obj_set_style_border_width(${alarm.rowNames}[${index}], 0, 0); lv_obj_set_style_radius(${alarm.rowNames}[${index}], 5, 0); lv_obj_set_style_pad_all(${alarm.rowNames}[${index}], 0, 0); lv_obj_clear_flag(${alarm.rowNames}[${index}], LV_OBJ_FLAG_SCROLLABLE);`)
    lines.push(`${alarm.rowLabelNames}[${index}] = lv_label_create(${alarm.rowNames}[${index}]); lv_obj_set_pos(${alarm.rowLabelNames}[${index}], 10, ${model.compactMode ? 3 : 4}); lv_obj_set_width(${alarm.rowLabelNames}[${index}], ${messageWidth}); lv_label_set_long_mode(${alarm.rowLabelNames}[${index}], LV_LABEL_LONG_DOT);`)
    lines.push(`lv_obj_set_style_text_font(${alarm.rowLabelNames}[${index}], &lv_font_montserrat_${model.compactMode ? 10 : 12}, 0);`)
    lines.push(`${alarm.rowStateLabelNames}[${index}] = lv_label_create(${alarm.rowNames}[${index}]); lv_obj_set_pos(${alarm.rowStateLabelNames}[${index}], 10, ${model.compactMode ? 16 : rowHeight - 16}); lv_obj_set_width(${alarm.rowStateLabelNames}[${index}], ${messageWidth}); lv_label_set_long_mode(${alarm.rowStateLabelNames}[${index}], LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${alarm.rowStateLabelNames}[${index}], &lv_font_montserrat_10, 0); lv_obj_set_style_text_color(${alarm.rowStateLabelNames}[${index}], lv_color_hex(${palette.textSecondary}), 0);`)
    lines.push(`${alarm.rowPriorityLabelNames}[${index}] = lv_label_create(${alarm.rowNames}[${index}]); lv_obj_set_pos(${alarm.rowPriorityLabelNames}[${index}], ${rowWidth - (model.showAcknowledgement ? 112 : 72)}, ${Math.max(2, Math.floor((rowHeight - 12) / 2))}); lv_obj_set_width(${alarm.rowPriorityLabelNames}[${index}], ${model.showAcknowledgement ? 66 : 62}); lv_obj_set_style_text_align(${alarm.rowPriorityLabelNames}[${index}], LV_TEXT_ALIGN_RIGHT, 0); lv_obj_set_style_text_font(${alarm.rowPriorityLabelNames}[${index}], &lv_font_montserrat_10, 0);`)
    lines.push(`${alarm.rowAckLabelNames}[${index}] = lv_label_create(${alarm.rowNames}[${index}]); lv_label_set_text(${alarm.rowAckLabelNames}[${index}], "ACK"); lv_obj_set_pos(${alarm.rowAckLabelNames}[${index}], ${rowWidth - 40}, ${Math.max(1, Math.floor((rowHeight - 18) / 2))}); lv_obj_set_style_text_font(${alarm.rowAckLabelNames}[${index}], &lv_font_montserrat_10, 0); lv_obj_set_style_border_width(${alarm.rowAckLabelNames}[${index}], 1, 0); lv_obj_set_style_border_color(${alarm.rowAckLabelNames}[${index}], lv_color_hex(0xF2A900), 0); lv_obj_set_style_radius(${alarm.rowAckLabelNames}[${index}], 4, 0); lv_obj_set_style_pad_hor(${alarm.rowAckLabelNames}[${index}], 4, 0); lv_obj_set_style_pad_ver(${alarm.rowAckLabelNames}[${index}], 1, 0);`)
    if (alarm.selectCallbackName) lines.push(`lv_obj_add_event_cb(${alarm.rowNames}[${index}], ${alarm.selectCallbackName}, LV_EVENT_CLICKED, (void *)(uintptr_t)${index});`)
  }
  if (model.showFooter) lines.push(`lv_obj_t * ${varName}_footer = lv_label_create(${alarm.rootName}); lv_label_set_text(${varName}_footer, "${esc(model.footerText)}"); lv_obj_align(${varName}_footer, LV_ALIGN_BOTTOM_LEFT, 12, -5); lv_obj_set_style_text_font(${varName}_footer, &lv_font_montserrat_10, 0); lv_obj_set_style_text_color(${varName}_footer, lv_color_hex(${palette.textSecondary}), 0);`)
  model.alarms.forEach((entry, index) => {
    lines.push(`${alarm.occupiedName}[${index}] = true; ${alarm.idsName}[${index}] = ${index + 1}; ${alarm.statesName}[${index}] = FG_ALARM_STATE_${entry.state.toUpperCase()}; ${alarm.prioritiesName}[${index}] = FG_ALARM_PRIORITY_${entry.priority.toUpperCase()};`)
    lines.push(`snprintf(${alarm.messagesName}[${index}], sizeof(${alarm.messagesName}[${index}]), "%s", "${escPrintfLiteral(entry.message)}"); snprintf(${alarm.timestampsName}[${index}], sizeof(${alarm.timestampsName}[${index}]), "%s", "${escPrintfLiteral(entry.timestamp)}");`)
  })
  lines.push(`${alarm.countName} = ${model.alarms.length}; ${alarm.refreshName}();`)
  lines.push(``)
  break
}

case 'IOMonitor': {
  const io = ioMonitorExports.get(child.id)
  if (!io) break
  const model = io.model
  const visibleRows = Math.max(1, model.rows.filter(row => row.visible).length)
  const headerHeight = model.compactMode ? 32 : 42
  const rowHeight = Math.max(model.compactMode ? 25 : 30, Math.min(model.compactMode ? 30 : 38, Math.floor((Number(h) - headerHeight - 10) / visibleRows)))
  const rowWidth = Math.max(80, Number(w) - 16)
  lines.push(`${io.rootName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${io.rootName}, ${x}, ${y}); lv_obj_set_size(${io.rootName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${io.rootName}, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(${io.rootName}, lv_color_hex(${palette.surfaceBorder}), 0); lv_obj_set_style_border_width(${io.rootName}, 1, 0); lv_obj_set_style_radius(${io.rootName}, 10, 0); lv_obj_set_style_pad_all(${io.rootName}, 0, 0); lv_obj_clear_flag(${io.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${io.rootName}); lv_label_set_text(${varName}_title, "${esc(model.title)}"); lv_obj_set_pos(${varName}_title, 12, ${model.compactMode ? 7 : 11}); lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), 0);`)
  model.rows.forEach((row, index) => {
    const rowY = headerHeight + model.rows.slice(0, index).filter(entry => entry.visible).length * (rowHeight + (model.compactMode ? 3 : 5))
    lines.push(`${io.rowNames}[${index}] = lv_button_create(${io.rootName}); lv_obj_set_pos(${io.rowNames}[${index}], 8, ${rowY}); lv_obj_set_size(${io.rowNames}[${index}], ${rowWidth}, ${rowHeight});`)
    lines.push(`lv_obj_set_style_bg_color(${io.rowNames}[${index}], lv_color_hex(${palette.surfaceSecondary}), 0); lv_obj_set_style_border_color(${io.rowNames}[${index}], lv_color_hex(0x${toLvHex(row.colour).slice(2)}), 0); lv_obj_set_style_border_width(${io.rowNames}[${index}], 3, 0); lv_obj_set_style_border_side(${io.rowNames}[${index}], LV_BORDER_SIDE_LEFT, 0); lv_obj_set_style_radius(${io.rowNames}[${index}], 5, 0); lv_obj_set_style_pad_all(${io.rowNames}[${index}], 0, 0);`)
    lines.push(`${io.channelLabels}[${index}] = lv_label_create(${io.rowNames}[${index}]); lv_obj_set_pos(${io.channelLabels}[${index}], 8, ${Math.max(2, Math.floor((rowHeight - 14) / 2))}); lv_obj_set_width(${io.channelLabels}[${index}], 48); lv_label_set_long_mode(${io.channelLabels}[${index}], LV_LABEL_LONG_DOT);`)
    lines.push(`${io.nameLabels}[${index}] = lv_label_create(${io.rowNames}[${index}]); lv_obj_set_pos(${io.nameLabels}[${index}], 62, ${Math.max(2, Math.floor((rowHeight - 14) / 2))}); lv_obj_set_width(${io.nameLabels}[${index}], ${Math.max(40, rowWidth - 200)}); lv_label_set_long_mode(${io.nameLabels}[${index}], LV_LABEL_LONG_DOT);`)
    lines.push(`${io.valueLabels}[${index}] = lv_label_create(${io.rowNames}[${index}]); lv_obj_set_pos(${io.valueLabels}[${index}], ${Math.max(110, rowWidth - 128)}, ${Math.max(2, Math.floor((rowHeight - 14) / 2))}); lv_obj_set_width(${io.valueLabels}[${index}], 76); lv_obj_set_style_text_align(${io.valueLabels}[${index}], LV_TEXT_ALIGN_RIGHT, 0);`)
    lines.push(`${io.stateLabels}[${index}] = lv_label_create(${io.rowNames}[${index}]); lv_obj_set_pos(${io.stateLabels}[${index}], ${Math.max(190, rowWidth - 44)}, ${Math.max(2, Math.floor((rowHeight - 14) / 2))}); lv_obj_set_width(${io.stateLabels}[${index}], 36); lv_obj_set_style_text_align(${io.stateLabels}[${index}], LV_TEXT_ALIGN_RIGHT, 0);`)
    if (!row.visible) lines.push(`lv_obj_add_flag(${io.rowNames}[${index}], LV_OBJ_FLAG_HIDDEN);`)
    if (io.selectCallbackName) lines.push(`lv_obj_add_event_cb(${io.rowNames}[${index}], ${io.selectCallbackName}, LV_EVENT_CLICKED, (void *)(uintptr_t)${index});`)
  })
  lines.push(`${io.refreshName}();`)
  lines.push(``)
  break
}

case 'BatteryCard': {
  const battery = batteryCardExports.get(child.id); if (!battery) break
  const model = battery.model; const pad = model.compactMode ? 8 : 10
  const cardWidth = Math.max(1, Number(w))
  const cardHeight = Math.max(1, Number(h))
  const headerRightWidth = 104
  const headerRightX = Math.max(pad, cardWidth - pad - 92)
  const titleWidth = Math.max(24, cardWidth - pad * 2 - headerRightWidth - 8)
  const percentY = model.compactMode ? 27 : 29
  const barY = model.compactMode ? 53 : 57
  const metricGap = 4
  const metricY = model.compactMode || cardHeight <= 128 ? 68 : 72
  const metricHeight = model.compactMode ? 23 : 24
  const metricWidth = Math.max(58, Math.floor((cardWidth - pad * 2 - metricGap * 2) / 3))
  const metricRows = [
    [battery.voltageLabel, 0, model.showVoltage],
    [battery.currentLabel, 1, model.showCurrent],
    [battery.runtimeLabel, 2, model.showRuntime],
    [battery.temperatureLabel, 0, model.showTemperature],
    [battery.healthLabel, 1, model.showHealth],
  ] as const
  lines.push(`${battery.rootName} = lv_obj_create(${parentVar}); lv_obj_set_pos(${battery.rootName}, ${x}, ${y}); lv_obj_set_size(${battery.rootName}, ${w}, ${h}); lv_obj_set_style_bg_color(${battery.rootName}, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(${battery.rootName}, lv_color_hex(${palette.surfaceBorder}), 0); lv_obj_set_style_border_width(${battery.rootName}, 1, 0); lv_obj_set_style_radius(${battery.rootName}, 8, 0); lv_obj_set_style_pad_all(${battery.rootName}, 0, 0); lv_obj_clear_flag(${battery.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${battery.rootName}); lv_label_set_text(${varName}_title, "${esc(model.title)}"); lv_obj_set_pos(${varName}_title, ${pad}, ${pad}); lv_obj_set_width(${varName}_title, ${titleWidth}); lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT); lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), 0); lv_obj_set_style_text_font(${varName}_title, &lv_font_montserrat_12, 0);`)
  lines.push(`lv_obj_t * ${varName}_battery_icon = lv_obj_create(${battery.rootName}); lv_obj_set_pos(${varName}_battery_icon, ${headerRightX}, ${pad + 1}); lv_obj_set_size(${varName}_battery_icon, 24, 12); lv_obj_set_style_bg_opa(${varName}_battery_icon, LV_OPA_TRANSP, 0); lv_obj_set_style_border_color(${varName}_battery_icon, lv_color_hex(${palette.textSecondary}), 0); lv_obj_set_style_border_width(${varName}_battery_icon, 1, 0); lv_obj_set_style_radius(${varName}_battery_icon, 3, 0); lv_obj_set_style_pad_all(${varName}_battery_icon, 0, 0); lv_obj_clear_flag(${varName}_battery_icon, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${battery.iconFillName} = lv_obj_create(${varName}_battery_icon); lv_obj_set_pos(${battery.iconFillName}, 2, 2); lv_obj_set_size(${battery.iconFillName}, 18, 6); lv_obj_set_style_border_width(${battery.iconFillName}, 0, 0); lv_obj_set_style_radius(${battery.iconFillName}, 2, 0); lv_obj_clear_flag(${battery.iconFillName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_battery_cap = lv_obj_create(${battery.rootName}); lv_obj_set_pos(${varName}_battery_cap, ${headerRightX + 26}, ${pad + 4}); lv_obj_set_size(${varName}_battery_cap, 3, 6); lv_obj_set_style_bg_color(${varName}_battery_cap, lv_color_hex(${palette.textSecondary}), 0); lv_obj_set_style_border_width(${varName}_battery_cap, 0, 0); lv_obj_set_style_radius(${varName}_battery_cap, 2, 0); lv_obj_clear_flag(${varName}_battery_cap, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${battery.statusLabel} = lv_label_create(${battery.rootName}); lv_obj_set_pos(${battery.statusLabel}, ${headerRightX + 34}, ${pad + 1}); lv_obj_set_width(${battery.statusLabel}, 58); lv_label_set_long_mode(${battery.statusLabel}, LV_LABEL_LONG_DOT); lv_obj_set_style_text_align(${battery.statusLabel}, LV_TEXT_ALIGN_RIGHT, 0); lv_obj_set_style_text_font(${battery.statusLabel}, &lv_font_montserrat_10, 0);`)
  if (model.showPercentage) lines.push(`${battery.percentageLabel} = lv_label_create(${battery.rootName}); lv_obj_set_pos(${battery.percentageLabel}, ${pad}, ${percentY}); lv_obj_set_style_text_font(${battery.percentageLabel}, &lv_font_montserrat_${model.compactMode ? 22 : 24}, 0);`)
  lines.push(`${battery.barName} = lv_bar_create(${battery.rootName}); lv_obj_set_pos(${battery.barName}, ${pad}, ${barY}); lv_obj_set_size(${battery.barName}, ${Math.max(80, cardWidth-pad*2)}, 6); lv_bar_set_range(${battery.barName}, 0, 100); lv_obj_set_style_bg_color(${battery.barName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN); lv_obj_set_style_radius(${battery.barName}, 3, LV_PART_MAIN); lv_obj_set_style_radius(${battery.barName}, 3, LV_PART_INDICATOR);`)
  metricRows.forEach(([name,index,visible], i) => {
    if (!visible) return
    const tileName = `${name}_tile`
    lines.push(`lv_obj_t * ${tileName} = lv_obj_create(${battery.rootName}); lv_obj_set_pos(${tileName}, ${pad + Number(index)*(metricWidth + metricGap)}, ${Math.min(cardHeight - metricHeight - pad, metricY + (i >= 3 ? metricHeight + metricGap : 0))}); lv_obj_set_size(${tileName}, ${metricWidth}, ${metricHeight}); lv_obj_set_style_bg_color(${tileName}, lv_color_hex(${palette.surfaceSecondary}), 0); lv_obj_set_style_border_width(${tileName}, 0, 0); lv_obj_set_style_radius(${tileName}, 4, 0); lv_obj_set_style_pad_all(${tileName}, 0, 0); lv_obj_clear_flag(${tileName}, LV_OBJ_FLAG_SCROLLABLE);`)
    lines.push(`${name} = lv_label_create(${tileName}); lv_obj_set_pos(${name}, 4, 2); lv_obj_set_width(${name}, ${metricWidth-8}); lv_label_set_long_mode(${name}, LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${name}, &lv_font_montserrat_10, 0); lv_obj_set_style_text_color(${name}, lv_color_hex(${palette.textPrimary}), 0);`)
  })
  lines.push(`${battery.refreshName}();`); lines.push(``); break
}

case 'TankLevelCard': {
  const tank = tankLevelCardExports.get(child.id); if (!tank) break
  const model = tank.model; const pad = model.compactMode ? 8 : 10
  const cardWidth = Math.max(1, Number(w)); const cardHeight = Math.max(1, Number(h))
  const vesselY = model.compactMode ? 29 : 31; const vesselWidth = model.compactMode ? 42 : 48; const vesselHeight = Math.max(72, cardHeight - vesselY - pad)
  const contentX = pad + vesselWidth + (model.compactMode ? 8 : 10); const contentWidth = Math.max(80, cardWidth - contentX - pad)
  const radius = model.tankShape === 'rectangular' ? 4 : model.tankShape === 'silo' ? 14 : 20
  lines.push(`${tank.rootName} = lv_obj_create(${parentVar}); lv_obj_set_pos(${tank.rootName}, ${x}, ${y}); lv_obj_set_size(${tank.rootName}, ${w}, ${h}); lv_obj_set_style_bg_color(${tank.rootName}, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(${tank.rootName}, lv_color_hex(${palette.surfaceBorder}), 0); lv_obj_set_style_border_width(${tank.rootName}, 1, 0); lv_obj_set_style_radius(${tank.rootName}, 8, 0); lv_obj_set_style_pad_all(${tank.rootName}, 0, 0); lv_obj_clear_flag(${tank.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${tank.rootName}); lv_label_set_text(${varName}_title, "${esc(model.title)}"); lv_obj_set_pos(${varName}_title, ${pad}, ${pad}); lv_obj_set_width(${varName}_title, ${Math.max(40, cardWidth - 100)}); lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT); lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), 0); lv_obj_set_style_text_font(${varName}_title, &lv_font_montserrat_12, 0);`)
  lines.push(`${tank.statusLabel} = lv_label_create(${tank.rootName}); lv_obj_set_pos(${tank.statusLabel}, ${Math.max(pad, cardWidth - 84)}, ${pad + 1}); lv_obj_set_width(${tank.statusLabel}, 74); lv_obj_set_style_text_align(${tank.statusLabel}, LV_TEXT_ALIGN_RIGHT, 0); lv_obj_set_style_text_font(${tank.statusLabel}, &lv_font_montserrat_10, 0);`)
  lines.push(`${tank.tankName} = lv_obj_create(${tank.rootName}); lv_obj_set_pos(${tank.tankName}, ${pad}, ${vesselY}); lv_obj_set_size(${tank.tankName}, ${vesselWidth}, ${vesselHeight}); lv_obj_set_style_bg_color(${tank.tankName}, lv_color_hex(${palette.surfaceSecondary}), 0); lv_obj_set_style_border_color(${tank.tankName}, lv_color_hex(0x${model.tankOutline.slice(1)}), 0); lv_obj_set_style_border_width(${tank.tankName}, 2, 0); lv_obj_set_style_radius(${tank.tankName}, ${radius}, 0); lv_obj_set_style_pad_all(${tank.tankName}, 2, 0); lv_obj_clear_flag(${tank.tankName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${tank.fillName} = lv_bar_create(${tank.tankName}); lv_obj_set_size(${tank.fillName}, LV_PCT(100), LV_PCT(100)); lv_obj_center(${tank.fillName}); lv_bar_set_range(${tank.fillName}, 0, 100); lv_obj_set_style_bg_opa(${tank.fillName}, LV_OPA_TRANSP, LV_PART_MAIN); lv_obj_set_style_border_width(${tank.fillName}, 0, LV_PART_MAIN); lv_obj_set_style_radius(${tank.fillName}, ${Math.min(radius, 12)}, LV_PART_INDICATOR);`)
  if (model.showPercentage) lines.push(`${tank.percentageLabel} = lv_label_create(${tank.rootName}); lv_obj_set_pos(${tank.percentageLabel}, ${contentX}, ${model.compactMode ? 31 : 33}); lv_obj_set_style_text_font(${tank.percentageLabel}, &lv_font_montserrat_${model.compactMode ? 22 : 24}, 0);`)
  if (model.showVolume) lines.push(`${tank.volumeLabel} = lv_label_create(${tank.rootName}); lv_obj_set_pos(${tank.volumeLabel}, ${contentX}, ${model.compactMode ? 57 : 61}); lv_obj_set_width(${tank.volumeLabel}, ${contentWidth}); lv_label_set_long_mode(${tank.volumeLabel}, LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${tank.volumeLabel}, &lv_font_montserrat_10, 0); lv_obj_set_style_text_color(${tank.volumeLabel}, lv_color_hex(${palette.textPrimary}), 0);`)
  if (model.showLabels) {
    const labelY = cardHeight - pad - 25; const labelWidth = Math.max(42, Math.floor((contentWidth - 6) / 3))
    ;[[tank.lowLabel,'LOW'],[tank.highLabel,'HIGH'],[tank.criticalLabel,'CRIT']].forEach(([name,label], index) => lines.push(`${name} = lv_label_create(${tank.rootName}); lv_obj_set_pos(${name}, ${contentX + index*(labelWidth+3)}, ${labelY}); lv_obj_set_width(${name}, ${labelWidth}); lv_obj_set_style_text_font(${name}, &lv_font_montserrat_10, 0); lv_obj_set_style_text_color(${name}, lv_color_hex(${palette.textSecondary}), 0); lv_label_set_text(${name}, "${label}");`))
  }
  lines.push(`${tank.refreshName}();`); lines.push(``); break
}

case 'NetworkStatusCard': {
  const card=networkStatusCardExports.get(child.id); if(!card) break; const m=card.model; const pad=m.compactMode?8:10; const cw=Math.max(1,Number(w)); const ch=Math.max(1,Number(h)); const colour=m.connected?m.accentColour:m.disconnectedColour
  lines.push(`${card.rootName} = lv_obj_create(${parentVar}); lv_obj_set_pos(${card.rootName}, ${x}, ${y}); lv_obj_set_size(${card.rootName}, ${w}, ${h}); lv_obj_set_style_bg_color(${card.rootName}, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(${card.rootName}, lv_color_hex(${palette.surfaceBorder}), 0); lv_obj_set_style_border_width(${card.rootName}, 1, 0); lv_obj_set_style_radius(${card.rootName}, 8, 0); lv_obj_set_style_pad_all(${card.rootName}, 0, 0); lv_obj_clear_flag(${card.rootName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${card.rootName}); lv_label_set_text(${varName}_title, "${esc(m.title)}"); lv_obj_set_pos(${varName}_title, ${pad}, ${pad}); lv_obj_set_width(${varName}_title, ${Math.max(44,cw-116)}); lv_label_set_long_mode(${varName}_title, LV_LABEL_LONG_DOT); lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), 0); lv_obj_set_style_text_font(${varName}_title, &lv_font_montserrat_12, 0);`)
  lines.push(`${card.stateLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.stateLabel},${Math.max(pad,cw-100)},${pad+1}); lv_obj_set_width(${card.stateLabel},90); lv_obj_set_style_text_align(${card.stateLabel},LV_TEXT_ALIGN_RIGHT,0); lv_obj_set_style_text_font(${card.stateLabel},&lv_font_montserrat_10,0);`)
  const iconSize=m.compactMode?40:46, contentX=pad+iconSize+8, mainY=m.compactMode?30:32
  lines.push(`lv_obj_t * ${varName}_icon=lv_label_create(${card.rootName}); lv_label_set_text(${varName}_icon,${m.networkType==='wifi'?'LV_SYMBOL_WIFI':'"'+(m.networkType==='ethernet'?'ETH':m.networkType==='cellular'?'CELL':'NET')+'"'}); lv_obj_set_pos(${varName}_icon,${pad},${mainY}); lv_obj_set_size(${varName}_icon,${iconSize},${iconSize}); lv_obj_set_style_bg_opa(${varName}_icon,LV_OPA_COVER,0); lv_obj_set_style_bg_color(${varName}_icon,lv_color_hex(${palette.surfaceSecondary}),0); lv_obj_set_style_radius(${varName}_icon,8,0); lv_obj_set_style_text_align(${varName}_icon,LV_TEXT_ALIGN_CENTER,0); lv_obj_set_style_text_color(${varName}_icon,lv_color_hex(0x${colour.slice(1)}),0); lv_obj_set_style_pad_top(${varName}_icon,${m.compactMode?13:16},0);`)
  lines.push(`${card.nameLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.nameLabel},${contentX},${mainY}); lv_obj_set_width(${card.nameLabel},${Math.max(60,cw-contentX-pad)}); lv_label_set_long_mode(${card.nameLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.nameLabel},&lv_font_montserrat_${m.compactMode?12:14},0); lv_obj_set_style_text_color(${card.nameLabel},lv_color_hex(${palette.textPrimary}),0);`)
  lines.push(`${card.ipLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.ipLabel},${contentX},${mainY+19}); lv_obj_set_width(${card.ipLabel},${Math.max(60,cw-contentX-pad)}); lv_label_set_long_mode(${card.ipLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_color(${card.ipLabel},lv_color_hex(${palette.textSecondary}),0); lv_obj_set_style_text_font(${card.ipLabel},&lv_font_montserrat_10,0);`)
  lines.push(`${card.hostnameLabel}=lv_label_create(${card.rootName}); lv_label_set_text(${card.hostnameLabel},"${esc(m.hostname)}"); lv_obj_set_pos(${card.hostnameLabel},${contentX},${mainY+34}); lv_obj_set_width(${card.hostnameLabel},${Math.max(60,cw-contentX-pad)}); lv_label_set_long_mode(${card.hostnameLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_color(${card.hostnameLabel},lv_color_hex(${palette.textSecondary}),0); lv_obj_set_style_text_font(${card.hostnameLabel},&lv_font_montserrat_10,0);`)
  const barY=Math.max(mainY+iconSize+20,ch-pad-6)
  lines.push(`${card.statusLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.statusLabel},${pad},${barY-15}); lv_obj_set_width(${card.statusLabel},${cw-pad*2}); lv_label_set_long_mode(${card.statusLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.statusLabel},&lv_font_montserrat_10,0);`)
  lines.push(`${card.barName}=lv_bar_create(${card.rootName}); lv_obj_set_pos(${card.barName},${pad},${barY}); lv_obj_set_size(${card.barName},${Math.max(80,cw-pad*2)},5); lv_bar_set_range(${card.barName},0,100); lv_obj_set_style_bg_color(${card.barName},lv_color_hex(${palette.surfaceSecondary}),LV_PART_MAIN); lv_obj_set_style_radius(${card.barName},3,LV_PART_MAIN); lv_obj_set_style_radius(${card.barName},3,LV_PART_INDICATOR);`)
  lines.push(`${card.refreshName}();`); lines.push(``); break
}

case 'DeviceSummaryCard': {
  const card=deviceSummaryCardExports.get(child.id); if(!card) break; const m=card.model; const pad=10; const cw=Math.max(1,Number(w)); const statusIndex={offline:0,online:1,warning:2,error:3}[m.overallStatus]; const colours=[m.offlineColour,m.onlineColour,m.warningColour,m.errorColour]; const colour=colours[statusIndex]
  lines.push(`${card.rootName}=lv_obj_create(${parentVar}); lv_obj_set_pos(${card.rootName},${x},${y}); lv_obj_set_size(${card.rootName},${w},${h}); lv_obj_clear_flag(${card.rootName},LV_OBJ_FLAG_SCROLLABLE); lv_obj_set_style_pad_all(${card.rootName},0,0); lv_obj_set_style_radius(${card.rootName},8,0); lv_obj_set_style_bg_color(${card.rootName},lv_color_hex(${palette.surface}),0); lv_obj_set_style_border_color(${card.rootName},lv_color_hex(${palette.surfaceBorder}),0); lv_obj_set_style_border_width(${card.rootName},1,0);`)
  lines.push(`lv_obj_t * ${varName}_title=lv_label_create(${card.rootName}); lv_label_set_text(${varName}_title,"${esc(m.title)}"); lv_obj_set_pos(${varName}_title,${pad},${pad}); lv_obj_set_width(${varName}_title,${Math.max(44,cw-116)}); lv_label_set_long_mode(${varName}_title,LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${varName}_title,&lv_font_montserrat_12,0); lv_obj_set_style_text_color(${varName}_title,lv_color_hex(${palette.textPrimary}),0);`)
  lines.push(`${card.stateLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.stateLabel},${Math.max(pad,cw-100)},${pad+1}); lv_obj_set_width(${card.stateLabel},90); lv_obj_set_style_text_align(${card.stateLabel},LV_TEXT_ALIGN_RIGHT,0); lv_obj_set_style_text_font(${card.stateLabel},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${card.stateLabel},lv_color_hex(0x${colour.slice(1)}),0);`)
  lines.push(`${card.deviceLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.deviceLabel},${pad},29); lv_obj_set_width(${card.deviceLabel},${cw-pad*2}); lv_label_set_long_mode(${card.deviceLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.deviceLabel},&lv_font_montserrat_14,0); lv_obj_set_style_text_color(${card.deviceLabel},lv_color_hex(${palette.textPrimary}),0);`)
  const rows:[[string,string,string],...Array<[string,string,string]>]=[['Uptime',card.uptimeLabel,m.uptime],['Firmware',card.firmwareLabel,m.firmwareVersion],['Network',card.networkLabel,m.networkStatus],['Storage',card.storageLabel,m.storageStatus]]
  rows.forEach(([label,labelName,value],index)=>lines.push(`${labelName}=lv_label_create(${card.rootName}); lv_label_set_text(${labelName},"${esc(label)}  ${esc(value)}"); lv_obj_set_pos(${labelName},${pad},${53+index*17}); lv_obj_set_width(${labelName},${cw-pad*2}); lv_label_set_long_mode(${labelName},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${labelName},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${labelName},lv_color_hex(${palette.textSecondary}),0);`))
  lines.push(`${card.refreshName}();`); lines.push(``); break
}

case 'KpiCard': {
  const card=kpiCardExports.get(child.id); if(!card) break; const m=card.model; const pad=10; const cw=Math.max(1,Number(w)); const ch=Math.max(1,Number(h)); const statusIndex={neutral:0,good:1,warning:2,critical:3}[m.status]; const colours=[m.neutralColour,m.goodColour,m.warningColour,m.criticalColour]; const accent=colours[statusIndex]
  lines.push(`${card.rootName}=lv_obj_create(${parentVar}); lv_obj_set_pos(${card.rootName},${x},${y}); lv_obj_set_size(${card.rootName},${w},${h}); lv_obj_clear_flag(${card.rootName},LV_OBJ_FLAG_SCROLLABLE); lv_obj_set_style_pad_all(${card.rootName},0,0); lv_obj_set_style_radius(${card.rootName},8,0); lv_obj_set_style_bg_color(${card.rootName},lv_color_hex(${palette.surface}),0); lv_obj_set_style_border_color(${card.rootName},lv_color_hex(${palette.surfaceBorder}),0); lv_obj_set_style_border_width(${card.rootName},1,0);`)
  lines.push(`lv_obj_t * ${varName}_title=lv_label_create(${card.rootName}); lv_label_set_text(${varName}_title,"${esc(m.title)}"); lv_obj_set_pos(${varName}_title,${pad},${pad}); lv_obj_set_width(${varName}_title,${Math.max(44,cw-116)}); lv_label_set_long_mode(${varName}_title,LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${varName}_title,&lv_font_montserrat_12,0); lv_obj_set_style_text_color(${varName}_title,lv_color_hex(${palette.textPrimary}),0);`)
  lines.push(`${card.stateLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.stateLabel},${Math.max(pad,cw-100)},${pad+1}); lv_obj_set_width(${card.stateLabel},90); lv_obj_set_style_text_align(${card.stateLabel},LV_TEXT_ALIGN_RIGHT,0); lv_obj_set_style_text_font(${card.stateLabel},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${card.stateLabel},lv_color_hex(0x${accent.slice(1)}),0);`)
  lines.push(`${card.valueLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.valueLabel},${pad},31); lv_obj_set_width(${card.valueLabel},${Math.max(80,cw-76)}); lv_label_set_long_mode(${card.valueLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.valueLabel},&lv_font_montserrat_24,0); lv_obj_set_style_text_color(${card.valueLabel},lv_color_hex(0x${accent.slice(1)}),0);`)
  lines.push(`${card.unitLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.unitLabel},${Math.max(pad,cw-64)},42); lv_obj_set_width(${card.unitLabel},54); lv_label_set_long_mode(${card.unitLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_align(${card.unitLabel},LV_TEXT_ALIGN_RIGHT,0); lv_obj_set_style_text_font(${card.unitLabel},&lv_font_montserrat_12,0); lv_obj_set_style_text_color(${card.unitLabel},lv_color_hex(${palette.textSecondary}),0);`)
  lines.push(`${card.secondaryLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.secondaryLabel},${pad},66); lv_obj_set_width(${card.secondaryLabel},${cw-pad*2}); lv_label_set_long_mode(${card.secondaryLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.secondaryLabel},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${card.secondaryLabel},lv_color_hex(${palette.textSecondary}),0);${m.showSecondary?'':' lv_obj_add_flag('+card.secondaryLabel+',LV_OBJ_FLAG_HIDDEN);'}`)
  lines.push(`${card.trendLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.trendLabel},${pad},${Math.max(88,ch-35)}); lv_obj_set_width(${card.trendLabel},${Math.max(60,Math.floor((cw-pad*2)/2))}); lv_label_set_long_mode(${card.trendLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${card.trendLabel},&lv_font_montserrat_10,0);${m.showTrend?'':' lv_obj_add_flag('+card.trendLabel+',LV_OBJ_FLAG_HIDDEN);'}`)
  lines.push(`${card.targetLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.targetLabel},${Math.floor(cw/2)},${Math.max(88,ch-35)}); lv_obj_set_width(${card.targetLabel},${Math.max(60,Math.floor(cw/2)-pad)}); lv_label_set_long_mode(${card.targetLabel},LV_LABEL_LONG_DOT); lv_obj_set_style_text_align(${card.targetLabel},LV_TEXT_ALIGN_RIGHT,0); lv_obj_set_style_text_font(${card.targetLabel},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${card.targetLabel},lv_color_hex(${palette.textSecondary}),0);${m.showTarget?'':' lv_obj_add_flag('+card.targetLabel+',LV_OBJ_FLAG_HIDDEN);'}`)
  lines.push(`${card.accentName}=lv_obj_create(${card.rootName}); lv_obj_set_pos(${card.accentName},${pad},${ch-8}); lv_obj_set_size(${card.accentName},${Math.max(80,cw-pad*2)},4); lv_obj_set_style_border_width(${card.accentName},0,0); lv_obj_set_style_radius(${card.accentName},2,0); lv_obj_clear_flag(${card.accentName},LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${card.refreshName}();`); lines.push(``); break
}

case 'PowerFlowCard': {
  const card=powerFlowCardExports.get(child.id); if(!card) break; const m=card.model; const cw=Math.max(220,Number(w)); const ch=Math.max(128,Number(h)); const nodeW=62; const nodeH=31; const centreX=Math.floor((cw-nodeW)/2); const loadY=Math.floor((ch-nodeH)/2)+5; const solarY=22; const batteryY=ch-nodeH-7; const gridX=8; const gridY=loadY; const arrowX=Math.floor((gridX+nodeW+centreX)/2)-6
  lines.push(`${card.rootName}=lv_obj_create(${parentVar}); lv_obj_set_pos(${card.rootName},${x},${y}); lv_obj_set_size(${card.rootName},${w},${h}); lv_obj_clear_flag(${card.rootName},LV_OBJ_FLAG_SCROLLABLE); lv_obj_set_style_pad_all(${card.rootName},0,0); lv_obj_set_style_radius(${card.rootName},8,0); lv_obj_set_style_bg_color(${card.rootName},lv_color_hex(${palette.surface}),0); lv_obj_set_style_border_color(${card.rootName},lv_color_hex(${palette.surfaceBorder}),0); lv_obj_set_style_border_width(${card.rootName},1,0);`)
  lines.push(`lv_obj_t * ${varName}_title=lv_label_create(${card.rootName}); lv_label_set_text(${varName}_title,"${esc(m.title)}"); lv_obj_set_pos(${varName}_title,9,6); lv_obj_set_width(${varName}_title,${cw-18}); lv_label_set_long_mode(${varName}_title,LV_LABEL_LONG_DOT); lv_obj_set_style_text_font(${varName}_title,&lv_font_montserrat_12,0); lv_obj_set_style_text_color(${varName}_title,lv_color_hex(${palette.textPrimary}),0);`)
  const makeNode=(label:string,name:string,value:string,nx:number,ny:number,visible:boolean)=>lines.push(`${label}=lv_label_create(${card.rootName}); lv_label_set_text_fmt(${label},"${name}\\n%s",${value}); lv_obj_set_pos(${label},${nx},${ny}); lv_obj_set_size(${label},${nodeW},${nodeH}); lv_label_set_long_mode(${label},LV_LABEL_LONG_DOT); lv_obj_set_style_text_align(${label},LV_TEXT_ALIGN_CENTER,0); lv_obj_set_style_text_font(${label},&lv_font_montserrat_10,0); lv_obj_set_style_text_color(${label},lv_color_hex(${palette.textPrimary}),0); lv_obj_set_style_bg_color(${label},lv_color_hex(${palette.surfaceSecondary}),0); lv_obj_set_style_bg_opa(${label},LV_OPA_COVER,0); lv_obj_set_style_border_color(${label},lv_color_hex(${palette.surfaceBorder}),0); lv_obj_set_style_border_width(${label},1,0); lv_obj_set_style_radius(${label},5,0);${visible?'':` lv_obj_add_flag(${label},LV_OBJ_FLAG_HIDDEN);`}`)
  makeNode(card.gridLabel,'GRID',card.gridValue,gridX,gridY,m.gridVisible); makeNode(card.solarLabel,'SOLAR',card.solarValue,centreX,solarY,m.solarVisible); makeNode(card.loadLabel,'LOAD',card.loadValue,centreX,loadY,m.loadVisible); makeNode(card.batteryLabel,'BATTERY',card.batteryValue,centreX,batteryY,m.batteryVisible)
  lines.push(`${card.gridLine}=lv_obj_create(${card.rootName}); lv_obj_set_pos(${card.gridLine},${gridX+nodeW},${loadY+14}); lv_obj_set_size(${card.gridLine},${Math.max(8,centreX-gridX-nodeW)},3); lv_obj_set_style_border_width(${card.gridLine},0,0); lv_obj_clear_flag(${card.gridLine},LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${card.solarLine}=lv_obj_create(${card.rootName}); lv_obj_set_pos(${card.solarLine},${centreX+30},${solarY+nodeH}); lv_obj_set_size(${card.solarLine},3,${Math.max(6,loadY-solarY-nodeH)}); lv_obj_set_style_border_width(${card.solarLine},0,0); lv_obj_clear_flag(${card.solarLine},LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${card.batteryLine}=lv_obj_create(${card.rootName}); lv_obj_set_pos(${card.batteryLine},${centreX+30},${loadY+nodeH}); lv_obj_set_size(${card.batteryLine},3,${Math.max(6,batteryY-loadY-nodeH)}); lv_obj_set_style_border_width(${card.batteryLine},0,0); lv_obj_clear_flag(${card.batteryLine},LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`${card.gridFlowLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.gridFlowLabel},${arrowX},${loadY+7}); lv_obj_set_width(${card.gridFlowLabel},16); lv_obj_set_style_text_align(${card.gridFlowLabel},LV_TEXT_ALIGN_CENTER,0);`)
  lines.push(`${card.solarFlowLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.solarFlowLabel},${centreX+22},${solarY+nodeH-4}); lv_obj_set_width(${card.solarFlowLabel},20); lv_obj_set_style_text_align(${card.solarFlowLabel},LV_TEXT_ALIGN_CENTER,0);`)
  lines.push(`${card.batteryFlowLabel}=lv_label_create(${card.rootName}); lv_obj_set_pos(${card.batteryFlowLabel},${centreX+22},${loadY+nodeH-4}); lv_obj_set_width(${card.batteryFlowLabel},20); lv_obj_set_style_text_align(${card.batteryFlowLabel},LV_TEXT_ALIGN_CENTER,0);`)
  lines.push(`${card.refreshName}();`); lines.push(``); break
}

case 'Spinbox': {
  const spinboxExport = spinboxExports.get(child.id)
  if (!spinboxExport) break
  const model = spinboxExport.model
  const spinbox = spinboxExport.objectName
  // Component geometry is commonly serialized as strings. Normalize before
  // doing helper-button arithmetic so `110 + 172` cannot become `110172`.
  const spinboxX = integerProp(x, 0)
  const spinboxY = integerProp(y, 0)
  const spinboxWidth = Math.max(2, integerProp(w, 220))
  const spinboxHeight = Math.max(2, integerProp(h, 48))
  const buttonWidth = Math.max(
    1,
    Math.min(spinboxWidth - 1, Math.max(28, Math.min(48, Math.floor(spinboxWidth / 4)))),
  )
  const fieldWidth = Math.max(1, spinboxWidth - buttonWidth)
  const incrementHeight = Math.max(1, Math.floor(spinboxHeight / 2))
  const decrementHeight = Math.max(1, spinboxHeight - incrementHeight)
  const buttonX = spinboxX + fieldWidth
  const decrementY = spinboxY + incrementHeight
  const background = model.backgroundColor
    ? toLvHex(model.backgroundColor)
    : palette.surface
  const border = model.borderColor
    ? toLvHex(model.borderColor)
    : palette.surfaceBorder
  const text = model.textColor
    ? toLvHex(model.textColor)
    : palette.textPrimary
  const selected = model.selectedColor
    ? toLvHex(model.selectedColor)
    : palette.selectedSurface
  const align = model.textAlign === 'left'
    ? 'LV_TEXT_ALIGN_LEFT'
    : model.textAlign === 'center'
      ? 'LV_TEXT_ALIGN_CENTER'
      : 'LV_TEXT_ALIGN_RIGHT'
  const opacity = Math.round(model.opacity * 2.55)
  const incrementButton = `${spinbox}_increment_button`
  const decrementButton = `${spinbox}_decrement_button`

  lines.push(`${spinbox} = lv_spinbox_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${spinbox}, ${spinboxX}, ${spinboxY});`)
  lines.push(`lv_obj_set_size(${spinbox}, ${fieldWidth}, ${spinboxHeight});`)
  lines.push(`lv_obj_add_flag(${spinbox}, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_CLICK_FOCUSABLE);`)
  lines.push(`lv_spinbox_set_digit_format(${spinbox}, ${model.digitCount}, ${model.separatorPosition});`)
  lines.push(`lv_spinbox_set_range(${spinbox}, ${model.minimum}, ${model.maximum});`)
  lines.push(`lv_spinbox_set_value(${spinbox}, ${model.value});`)
  lines.push(`lv_spinbox_set_rollover(${spinbox}, ${model.rollover ? 'true' : 'false'});`)
  lines.push(`lv_spinbox_set_cursor_pos(${spinbox}, ${model.cursorPosition});`)
  lines.push(`lv_spinbox_set_step(${spinbox}, ${model.step});`)
  lines.push(`lv_obj_set_style_bg_color(${spinbox}, lv_color_hex(${background}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${spinbox}, ${opacity}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${spinbox}, lv_color_hex(${border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${spinbox}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${spinbox}, lv_color_hex(${text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_align(${spinbox}, ${align}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${spinbox}, ${model.padding}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${spinbox}, lv_color_hex(${selected}), LV_PART_CURSOR);`)
  lines.push(`lv_obj_set_style_bg_opa(${spinbox}, LV_OPA_COVER, LV_PART_CURSOR);`)
  lines.push(`lv_obj_set_style_text_color(${spinbox}, lv_color_hex(${palette.accentText}), LV_PART_CURSOR);`)
  lines.push(`lv_obj_add_event_cb(${spinbox}, ${spinboxExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)

  lines.push(`lv_obj_t * ${incrementButton} = lv_button_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${incrementButton}, ${buttonX}, ${spinboxY});`)
  lines.push(`lv_obj_set_size(${incrementButton}, ${buttonWidth}, ${incrementHeight});`)
  lines.push(`lv_obj_add_flag(${incrementButton}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_bg_color(${incrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${incrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${incrementButton}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${incrementButton}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_opa(${incrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${incrementButton}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${incrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_bg_opa(${incrementButton}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_text_color(${incrementButton}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_t * ${incrementButton}_label = lv_label_create(${incrementButton});`)
  lines.push(`lv_label_set_text(${incrementButton}_label, LV_SYMBOL_UP);`)
  lines.push(`lv_obj_center(${incrementButton}_label);`)
  lines.push(`lv_obj_add_event_cb(${incrementButton}, ${spinboxExport.incrementCallbackName}, LV_EVENT_CLICKED, NULL);`)

  lines.push(`lv_obj_t * ${decrementButton} = lv_button_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${decrementButton}, ${buttonX}, ${decrementY});`)
  lines.push(`lv_obj_set_size(${decrementButton}, ${buttonWidth}, ${decrementHeight});`)
  lines.push(`lv_obj_add_flag(${decrementButton}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_bg_color(${decrementButton}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${decrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${decrementButton}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${decrementButton}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_opa(${decrementButton}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${decrementButton}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${decrementButton}, lv_color_hex(${palette.accent}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_bg_opa(${decrementButton}, LV_OPA_COVER, LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_set_style_text_color(${decrementButton}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
  lines.push(`lv_obj_t * ${decrementButton}_label = lv_label_create(${decrementButton});`)
  lines.push(`lv_label_set_text(${decrementButton}_label, LV_SYMBOL_DOWN);`)
  lines.push(`lv_obj_center(${decrementButton}_label);`)
  lines.push(`lv_obj_add_event_cb(${decrementButton}, ${spinboxExport.decrementCallbackName}, LV_EVENT_CLICKED, NULL);`)
  lines.push(`lv_obj_move_foreground(${incrementButton});`)
  lines.push(`lv_obj_move_foreground(${decrementButton});`)
  if (!model.visible) {
    lines.push(`lv_obj_add_flag(${spinbox}, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`lv_obj_add_flag(${incrementButton}, LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`lv_obj_add_flag(${decrementButton}, LV_OBJ_FLAG_HIDDEN);`)
  }
  lines.push(`${spinboxExport.stateName} = ${model.value};`)
  lines.push(``)
  break
}

case 'Spinner': {
  const duration = Math.max(1, integerProp(child.props.duration, 1000))
  const arcLength = Math.max(
    1,
    Math.min(359, integerProp(child.props.arcLength, 60)),
  )
  const arcWidth = Math.max(1, integerProp(child.props.arcWidth, 8))
  const backgroundWidth = Math.max(
    0,
    integerProp(child.props.backgroundWidth, 8),
  )
  const opacity = Math.max(
    0,
    Math.min(255, Math.round(integerProp(child.props.opacity, 100) * 2.55)),
  )
  const accentColor = child.props.accentColor
    ? toLvHex(String(child.props.accentColor))
    : palette.accent
  const backgroundColor = child.props.backgroundColor
    ? toLvHex(String(child.props.backgroundColor))
    : palette.surfaceSecondary
  lines.push(`lv_obj_t * ${varName} = lv_spinner_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_spinner_set_anim_params(${varName}, ${duration}, ${arcLength});`)
  lines.push(`lv_obj_set_style_arc_width(${varName}, ${backgroundWidth}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_width(${varName}, ${arcWidth}, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${backgroundColor}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${accentColor}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_opa(${varName}, ${opacity}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_opa(${varName}, ${opacity}, LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'List': {
  const model = getForgeUIStandardListModel(child.props)
  const listExport = listExports.get(child.id)
  lines.push(`lv_obj_t * ${varName} = lv_list_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  if (model.title) {
    lines.push(`lv_obj_t * ${varName}_title = lv_list_add_text(${varName}, "${esc(model.title)}");`)
    lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}_title, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  }
  model.items.forEach((item, itemIndex) => {
    const buttonName = `${varName}_item_${itemIndex}`
    lines.push(`lv_obj_t * ${buttonName} = lv_list_add_button(${varName}, NULL, "${esc(item)}");`)
    lines.push(`lv_obj_set_height(${buttonName}, ${model.itemHeight});`)
    lines.push(`lv_obj_set_style_bg_color(${buttonName}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${buttonName}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_color(${buttonName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${buttonName}, 1, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${buttonName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${buttonName}, lv_color_hex(${palette.selectedSurface}), LV_PART_MAIN | LV_STATE_PRESSED);`)
    lines.push(`lv_obj_set_style_text_color(${buttonName}, lv_color_hex(${palette.accentText}), LV_PART_MAIN | LV_STATE_PRESSED);`)
    if (listExport) {
      lines.push(`lv_obj_add_event_cb(${buttonName}, fg_list_item_clicked_cb, LV_EVENT_CLICKED, (void *)&${listExport.itemDataNames[itemIndex]});`)
    }
  })
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
  lines.push(`lv_obj_set_style_bg_color(${progressObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${progressObject}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'CircularProgress': {
  const circularProgressExport = circularProgressExports.get(child.id)
  if (!circularProgressExport) break
  const circularProgressObject = circularProgressExport.objectName
  lines.push(`${circularProgressObject} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${circularProgressObject}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${circularProgressObject}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${circularProgressObject}, ${circularProgressExport.minimum}, ${circularProgressExport.maximum});`)
  lines.push(`lv_arc_set_bg_angles(${circularProgressObject}, 0, 360);`)
  lines.push(`lv_arc_set_rotation(${circularProgressObject}, 270);`)
  lines.push(`lv_arc_set_value(${circularProgressObject}, ${circularProgressExport.initialValue});`)
  lines.push(`${circularProgressExport.stateName} = ${circularProgressExport.initialValue};`)
  lines.push(`lv_obj_remove_style(${circularProgressObject}, NULL, LV_PART_KNOB);`)
  lines.push(`lv_obj_clear_flag(${circularProgressObject}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_arc_color(${circularProgressObject}, lv_color_hex(${palette.surfaceSecondary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_opa(${circularProgressObject}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_width(${circularProgressObject}, 10, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${circularProgressObject}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_arc_opa(${circularProgressObject}, LV_OPA_COVER, LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_arc_width(${circularProgressObject}, 10, LV_PART_INDICATOR);`)
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
  const asset: any = resolveForgeUIStandardImageAsset(child)
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

  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${toLvHex(child.props.borderColor, palette.surfaceBorder)}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_width(${varName}, ${lv(child.props.lineWidth, 3)}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_opa(${varName}, ${Math.round(Math.max(0, Math.min(1, Number(child.props.opacity ?? 1))) * 255)}, LV_PART_MAIN);`)
  if (child.props.visible === false) {
    lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_HIDDEN);`)
  }

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
  lines.push(`${tileViewObject} = lv_tileview_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${tileViewObject};`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, ${FORGEUI_TAB_TILE_BORDER_WIDTH}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 10, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_clip_corner(${varName}, true, LV_PART_MAIN);`)

  ;[
    { number: 1, column: 0, row: 0, direction: 'LV_DIR_RIGHT | LV_DIR_BOTTOM' },
    { number: 2, column: 1, row: 0, direction: 'LV_DIR_LEFT | LV_DIR_BOTTOM' },
    { number: 3, column: 0, row: 1, direction: 'LV_DIR_RIGHT | LV_DIR_TOP' },
    { number: 4, column: 1, row: 1, direction: 'LV_DIR_LEFT | LV_DIR_TOP' },
  ].forEach(({ number, column, row, direction }) => {
    lines.push(`lv_obj_t * ${varName}_tile${number} = lv_tileview_add_tile(${varName}, ${column}, ${row}, ${direction});`)
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
    lines.push(`lv_obj_clear_flag(${varName}_tile${n}, LV_OBJ_FLAG_SCROLLABLE);`)
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
    lines.push(`lv_tileview_set_tile_by_index(${varName}, ${tileViewExport.initialColumn}, ${tileViewExport.initialRow}, LV_ANIM_OFF);`)
    lines.push(`lv_obj_add_event_cb(${varName}, ${tileViewExport.eventCallbackName}, LV_EVENT_VALUE_CHANGED, NULL);`)
  }

  lines.push(``)
  break
}

case 'AnimImage': {
  const frameIds = normalizeFrameAssetIds(child.props.frameAssetIds)
  const frames: any[] = frameIds.map(id => forgeUIGetUploadedAssets().find(asset => asset.id === id)).filter(asset => asset?.lvgl)
  frames.forEach(asset => { if (asset.cFile) usedAssetSources.add(asset.cFile); lines.push(`LV_IMAGE_DECLARE(${asset.lvgl});`) })
  if (frames.length === 0) {
    lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
    lines.push(`lv_label_set_text(${varName}_label, "Add animation frames");`)
    lines.push(`lv_obj_set_width(${varName}_label, ${Math.max(1, w - 16)});`)
    lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_text_font(${varName}_label, &lv_font_montserrat_14, LV_PART_MAIN);`)
    lines.push(`lv_obj_center(${varName}_label);`)
  } else {
    lines.push(`static const void * ${varName}_frames[] = { ${frames.map(asset => `&${asset.lvgl}`).join(', ')} };`)
    lines.push(`lv_obj_t * ${varName} = lv_animimg_create(${parentVar});`)
    lines.push(`lv_animimg_set_src(${varName}, ${varName}_frames, ${frames.length});`)
    lines.push(`lv_animimg_set_duration(${varName}, ${Math.max(40, Number(child.props.frameDuration) || 250) * frames.length});`)
    lines.push(`lv_animimg_set_repeat_count(${varName}, ${child.props.loop === false ? '0' : 'LV_ANIM_REPEAT_INFINITE'});`)
    if (child.props.autoStart !== false) lines.push(`lv_animimg_start(${varName});`)
    lines.push(`lv_image_set_inner_align(${varName}, LV_IMAGE_ALIGN_CENTER);`)
  }
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
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

case 'QRCode': {
  const qrExport = qrCodeExports.get(child.id)
  const qrObject = qrExport?.objectName || varName
  const qrGeometry = getForgeUIQRCodeGeometry(w, h)
  const qrSize = qrGeometry.size
  const parsedQrX = Number(x)
  const parsedQrY = Number(y)
  const qrX = Number.isFinite(parsedQrX) ? parsedQrX : 0
  const qrY = Number.isFinite(parsedQrY) ? parsedQrY : 0
  const qrText = esc(resolveQRCodePayload(child.props))
  const foreground = child.props.qrForeground
    ? toLvHex(String(child.props.qrForeground))
    : palette.accent
  const background = child.props.qrBackground
    ? toLvHex(String(child.props.qrBackground))
    : palette.surface
  lines.push(`${qrObject} = lv_qrcode_create(${parentVar});`)
  lines.push(`lv_obj_t * ${varName} = ${qrObject};`)
  lines.push(`lv_obj_set_pos(${varName}, ${qrX + qrGeometry.xOffset}, ${qrY + qrGeometry.yOffset});`)
  lines.push(`lv_qrcode_set_size(${varName}, ${qrSize});`)
  lines.push(`lv_qrcode_set_dark_color(${varName}, lv_color_hex(${foreground}));`)
  lines.push(`lv_qrcode_set_light_color(${varName}, lv_color_hex(${background}));`)
  lines.push(`lv_qrcode_update(${varName}, "${qrText}", strlen("${qrText}"));`)
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

case 'Divider': {
  const divider = getForgeUIStandardDividerPresentation(
    child.props,
    `#${palette.surfaceBorder.slice(2)}`,
  )
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${divider.width}, ${divider.height});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(0x${divider.color.slice(1)}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, ${Math.round(divider.opacity * 255)}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_CLICKABLE);`)
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
  const chartModel = getForgeUIStandardChartModel(child.props)
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
  // LVGL enables a point marker for every series by default.  That turns the
  // warning/alarm helpers into rows of dots on-device, while the Studio
  // preview deliberately renders clean traces.
  lines.push(`lv_obj_set_style_size(${chartObject}, 0, 0, LV_PART_INDICATOR);`)
  lines.push(`lv_chart_set_point_count(${chartObject}, ${pointCount});`)
  if (chartExport) {
    lines.push(`lv_chart_set_range(${chartObject}, LV_CHART_AXIS_PRIMARY_Y, ${chartExport.minimum}, ${chartExport.maximum});`)
    if (
      chartExport.horizontalDivisions !== undefined &&
      chartExport.verticalDivisions !== undefined
    ) {
      lines.push(`lv_chart_set_div_line_count(${chartObject}, ${chartModel.showGrid ? chartExport.horizontalDivisions : 0}, ${chartModel.showGrid ? chartModel.verticalDivisions : 0});`)
    }
    if (chartExport.updateMode) {
      lines.push(`lv_chart_set_update_mode(${chartObject}, ${chartExport.updateMode});`)
    }
  }
  // Threshold helpers belong behind the data trace.  LVGL paints series in
  // creation order, so create these before the foreground data series.
  if (chartExport) {
    lines.push(`${chartExport.warningSeriesName} = lv_chart_add_series(${chartObject}, ${chartExport.warningColor}, LV_CHART_AXIS_PRIMARY_Y);`)
    lines.push(`${chartExport.alarmSeriesName} = lv_chart_add_series(${chartObject}, ${chartExport.alarmColor}, LV_CHART_AXIS_PRIMARY_Y);`)
    lines.push(`lv_chart_set_all_value(${chartObject}, ${chartExport.warningSeriesName}, ${chartExport.warningThreshold});`)
    lines.push(`lv_chart_set_all_value(${chartObject}, ${chartExport.alarmSeriesName}, ${chartExport.alarmThreshold});`)
  }
  lines.push(
    `${chartSeries} = lv_chart_add_series(${chartObject}, ${chartExport?.seriesColor || `lv_color_hex(${palette.accent})`}, LV_CHART_AXIS_PRIMARY_Y);`
  )
  lines.push(`lv_chart_set_all_value(${chartObject}, ${chartSeries}, LV_CHART_POINT_NONE);`)
  const initialPointOffset = Math.max(0, pointCount - initialData.length)
  initialData.forEach((value, index) => {
    lines.push(`lv_chart_set_value_by_id(${chartObject}, ${chartSeries}, ${initialPointOffset + index}, ${value});`)
  })
  lines.push(`lv_chart_refresh(${chartObject});`)
  if (chartModel.title) {
    lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${parentVar});`)
    lines.push(`lv_label_set_text(${varName}_title, "${esc(chartModel.title)}");`)
    lines.push(`lv_obj_set_pos(${varName}_title, ${x} + ${chartLayout.plotLeft}, ${y} + 4);`)
    lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_title, LV_OBJ_FLAG_CLICKABLE);`)
  }
  if (chartModel.xAxisLabel) {
    lines.push(`lv_obj_t * ${varName}_x_axis_title = lv_label_create(${parentVar});`)
    lines.push(`lv_label_set_text(${varName}_x_axis_title, "${esc(chartModel.xAxisLabel)}");`)
    lines.push(`lv_obj_set_pos(${varName}_x_axis_title, ${x} + ${Math.round((chartLayout.plotLeft + chartLayout.plotRight) / 2) - 20}, ${y} + ${chartLayout.height - 14});`)
    lines.push(`lv_obj_set_style_text_color(${varName}_x_axis_title, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_x_axis_title, LV_OBJ_FLAG_CLICKABLE);`)
  }
  if (chartModel.yAxisLabel) {
    lines.push(`lv_obj_t * ${varName}_y_axis_title = lv_label_create(${parentVar});`)
    lines.push(`lv_label_set_text(${varName}_y_axis_title, "${esc(chartModel.yAxisLabel)}");`)
    lines.push(`lv_obj_set_pos(${varName}_y_axis_title, ${x} + 3, ${y} + ${Math.round((chartLayout.plotTop + chartLayout.plotBottom) / 2) - 7});`)
    lines.push(`lv_obj_set_style_text_color(${varName}_y_axis_title, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_y_axis_title, LV_OBJ_FLAG_CLICKABLE);`)
  }
  ;(chartModel.showAxisLabels ? chartLayout.yAxisLabels : []).forEach((label, index) => {
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
  ;(chartModel.showAxisLabels ? chartLayout.xAxisLabels : [])
    .filter(label => label.visible)
    .forEach((label, index) => {
      const labelObject = `${varName}_x_label_${index}`
      const labelWidth = Math.max(
        16,
        Math.min(36, (String(label.value).length + 1) * 7),
      )
      lines.push(`lv_obj_t * ${labelObject} = lv_label_create(${parentVar});`)
      lines.push(`lv_label_set_text(${labelObject}, "${esc(label.value)}");`)
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

case 'TrendChartPro': {
  const model = normalizeForgeUITrendChartPro(child.props)
  const pro = chartExports.get(child.id)
  const chartObject = pro?.objectName || `${varName}_chart`
  const series = pro?.seriesName || `${varName}_series`
  const headerHeight = model.compactMode ? 42 : 58
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 10, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)
  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_title, "${esc(model.title)}");`)
  lines.push(`lv_obj_set_pos(${varName}_title, 12, ${model.compactMode ? 7 : 10});`)
  lines.push(`lv_obj_set_style_text_color(${varName}_title, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  const valueObject = pro?.valueLabelName || `${varName}_value`
  lines.push(`${pro ? '' : 'lv_obj_t * '}${valueObject} = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${valueObject}, "${esc(model.formattedValue)}");`)
  lines.push(`lv_obj_align(${valueObject}, LV_ALIGN_TOP_RIGHT, -${model.units ? 52 : 12}, ${model.compactMode ? 5 : 8});`)
  lines.push(`lv_obj_set_style_text_color(${valueObject}, lv_color_hex(${palette.textPrimary}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_font(${valueObject}, &lv_font_montserrat_${model.compactMode ? 20 : 28}, LV_PART_MAIN);`)
  const unitsObject = pro?.unitsLabelName || `${varName}_units`
  lines.push(`${pro ? '' : 'lv_obj_t * '}${unitsObject} = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${unitsObject}, "${esc(model.units)}");`)
  lines.push(`lv_obj_align(${unitsObject}, LV_ALIGN_TOP_RIGHT, -10, ${model.compactMode ? 10 : 16});`)
  lines.push(`lv_obj_set_style_text_color(${unitsObject}, lv_color_hex(${palette.textSecondary}), LV_PART_MAIN);`)
  lines.push(`${chartObject} = lv_chart_create(${varName});`)
  lines.push(`lv_obj_set_pos(${chartObject}, 12, ${headerHeight});`)
  lines.push(`lv_obj_set_size(${chartObject}, ${Math.max(1, w - 24)}, ${Math.max(1, h - headerHeight - 12)});`)
  lines.push(`lv_obj_set_style_bg_opa(${chartObject}, LV_OPA_TRANSP, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${chartObject}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_pad_all(${chartObject}, 0, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_color(${chartObject}, lv_color_hex(${palette.surfaceBorder}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_opa(${chartObject}, ${model.showGrid ? 'LV_OPA_60' : 'LV_OPA_TRANSP'}, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_width(${chartObject}, ${model.showGlow ? 3 : 2}, LV_PART_ITEMS);`)
  lines.push(`lv_chart_set_type(${chartObject}, LV_CHART_TYPE_LINE);`)
  lines.push(`lv_obj_set_style_size(${chartObject}, 0, 0, LV_PART_INDICATOR);`)
  lines.push(`lv_chart_set_point_count(${chartObject}, ${model.historyLength});`)
  lines.push(`lv_chart_set_range(${chartObject}, LV_CHART_AXIS_PRIMARY_Y, ${Math.floor(model.minimum)}, ${Math.ceil(model.maximum)});`)
  lines.push(`lv_chart_set_div_line_count(${chartObject}, ${model.showGrid ? 3 : 0}, ${model.showGrid ? 3 : 0});`)
  if (pro) {
    lines.push(`${pro.warningSeriesName} = lv_chart_add_series(${chartObject}, ${model.showThresholdBands ? pro.warningColor : `lv_color_hex(${palette.surface})`}, LV_CHART_AXIS_PRIMARY_Y);`)
    lines.push(`${pro.alarmSeriesName} = lv_chart_add_series(${chartObject}, ${model.showThresholdBands ? pro.alarmColor : `lv_color_hex(${palette.surface})`}, LV_CHART_AXIS_PRIMARY_Y);`)
    lines.push(`lv_chart_set_all_value(${chartObject}, ${pro.warningSeriesName}, ${pro.warningThreshold});`)
    lines.push(`lv_chart_set_all_value(${chartObject}, ${pro.alarmSeriesName}, ${pro.alarmThreshold});`)
  }
  lines.push(`${series} = lv_chart_add_series(${chartObject}, ${pro?.seriesColor || `lv_color_hex(${palette.accent})`}, LV_CHART_AXIS_PRIMARY_Y);`)
  lines.push(`lv_chart_set_all_value(${chartObject}, ${series}, LV_CHART_POINT_NONE);`)
  // Studio lays the configured startup samples across the complete plot. Keep
  // the configured runtime history length, but interpolate its initial buffer
  // so the first hardware frame has the same X positions and trace shape.
  const initialProData = Array.from({ length: model.historyLength }, (_, index) => {
    if (model.data.length <= 1) return model.data[0] ?? model.value
    const sourcePosition = index * (model.data.length - 1) /
      Math.max(1, model.historyLength - 1)
    const leftIndex = Math.floor(sourcePosition)
    const rightIndex = Math.min(model.data.length - 1, leftIndex + 1)
    const fraction = sourcePosition - leftIndex
    return model.data[leftIndex] +
      (model.data[rightIndex] - model.data[leftIndex]) * fraction
  })
  initialProData.forEach((value, index) => lines.push(`lv_chart_set_value_by_id(${chartObject}, ${series}, ${index}, ${Math.round(value)});`))
  if (model.showCurrentMarker) {
    const markerY = Math.round((1 - (model.value - model.minimum) / Math.max(1, model.maximum - model.minimum)) * Math.max(1, h - headerHeight - 12))
    const markerObject = pro?.markerName || `${varName}_marker`
    lines.push(`${pro ? '' : 'lv_obj_t * '}${markerObject} = lv_obj_create(${chartObject});`)
    lines.push(`lv_obj_set_size(${markerObject}, 8, 8);`)
    lines.push(`lv_obj_set_pos(${markerObject}, ${Math.max(0, w - 32)}, ${markerY - 4});`)
    lines.push(`lv_obj_set_style_radius(${markerObject}, LV_RADIUS_CIRCLE, LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_color(${markerObject}, ${pro?.seriesColor || `lv_color_hex(${palette.accent})`}, LV_PART_MAIN);`)
  }
  lines.push(`lv_chart_refresh(${chartObject});`)
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
          }
          lines.push(`lv_obj_set_pos(${boxObject}, ${x}, ${y});`)
          lines.push(`lv_obj_set_size(${boxObject}, ${w}, ${h});`)
          const box = getForgeUIStandardBoxPresentation(child.props, {
            surface: `#${palette.surface.slice(2)}`,
            surfaceSecondary: `#${palette.surfaceSecondary.slice(2)}`,
            surfaceBorder: `#${palette.surfaceBorder.slice(2)}`,
          })
          if (boxExport) lines.push(`${boxExport.visibleName} = ${box.visible ? 'true' : 'false'};`)
          if (!box.visible) lines.push(`lv_obj_add_flag(${boxObject}, LV_OBJ_FLAG_HIDDEN);`)
          lines.push(`lv_obj_clear_flag(${boxObject}, LV_OBJ_FLAG_SCROLLABLE);`)
          lines.push(`lv_obj_set_scrollbar_mode(${boxObject}, LV_SCROLLBAR_MODE_OFF);`)
          lines.push(`lv_obj_set_style_pad_all(${boxObject}, 0, LV_PART_MAIN);`)
          lines.push(`lv_obj_set_style_radius(${boxObject}, ${box.borderRadius}, 0);`)
          lines.push(`lv_obj_set_style_bg_color(${boxObject}, lv_color_hex(0x${box.backgroundColor.slice(1)}), 0);`)
          lines.push(`lv_obj_set_style_bg_opa(${boxObject}, ${Math.round(box.backgroundOpacity * 255)}, 0);`)
          lines.push(`lv_obj_set_style_border_color(${boxObject}, lv_color_hex(0x${box.borderColor.slice(1)}), 0);`)
          lines.push(`lv_obj_set_style_border_width(${boxObject}, ${box.borderWidth}, 0);`)
          lines.push(`lv_obj_set_style_border_opa(${boxObject}, ${Math.round(box.borderOpacity * 255)}, 0);`)
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
        childParentVar,
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
        sliderExports,
        spinboxExports,
        progressExports,
        circularProgressExports,
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
        listExports,
        tabViewExports,
        tileViewExports,
        clockExports,
        wifiStatusExports,
        labelTextExports,
        inputExports,
        switchExports,
        checkboxExports,
        radioExports,
        qrCodeExports,
        buttonExports,
        fiIconExports,
        dashboardCardExports,
        sensorTileExports,
        relayPanelExports,
        pwmControllerExports,
        alarmPanelExports,
        ioMonitorExports,
        batteryCardExports,
        tankLevelCardExports,
        networkStatusCardExports,
        deviceSummaryCardExports,
        kpiCardExports,
        powerFlowCardExports,
      )
    }
  })
}

const FG_DEFAULT_FIRMWARE_FEATURES: ForgeUIFirmwareFeatures = {
  wifi: true,
  bluetooth: false,
  audio: false,
  sdCard: true,
  rtc: true,
  usbHost: false,
  camera: false,
  settingsLauncher: true,
  wifiManager: true,
  storageBrowser: true,
  diagnostics: true,
}

const removeGeneratedRange = (
  source: string,
  startMarker: string,
  endMarker: string,
) => {
  const start = source.indexOf(startMarker)
  if (start < 0) return source
  const end = source.indexOf(endMarker, start)
  return end < 0 ? source : source.slice(0, start) + source.slice(end)
}

const removeTopLevelGeneratedFunctions = (
  source: string,
  shouldRemove: (name: string) => boolean,
) => {
  const pattern =
    /^(?:static\s+)?[A-Za-z_][A-Za-z0-9_\s\*]*\s+([A-Za-z_][A-Za-z0-9_]*)\s*\([^;]*\)\s*\{/gm
  const ranges: Array<[number, number]> = []
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source))) {
    if (!shouldRemove(match[1])) continue
    const braceStart = source.indexOf('{', match.index)
    let depth = 0
    let cursor = braceStart
    for (; cursor < source.length; cursor++) {
      if (source[cursor] === '{') depth++
      if (source[cursor] === '}') {
        depth--
        if (depth === 0) {
          cursor++
          while (source[cursor] === '\r' || source[cursor] === '\n') cursor++
          ranges.push([match.index, cursor])
          break
        }
      }
    }
  }
  return ranges.reverse().reduce(
    (result, [start, end]) => result.slice(0, start) + result.slice(end),
    source,
  )
}

export const gateForgeUIGeneratedSystemCode = (
  source: string,
  requested?: Partial<ForgeUIFirmwareFeatures>,
) => {
  const features = { ...FG_DEFAULT_FIRMWARE_FEATURES, ...(requested || {}) }
  if (!features.wifi) features.wifiManager = false
  if (!features.sdCard) features.storageBrowser = false
  if (!features.settingsLauncher) {
    features.wifiManager = false
    features.storageBrowser = false
    features.diagnostics = false
  }

  let code = source
  const removeFunctions: Array<(name: string) => boolean> = []

  if (!features.wifi) {
    code = code.replace('#include "30_WIFI.h"\n', '')
  }
  if (!features.sdCard) {
    code = code.replace('#include "40_SD.h"\n', '')
  }
  if (!features.diagnostics) {
    code = code.replace('#include "50_DIAGNOSTICS.h"\n', '')
  }

  if (!features.wifiManager) {
    removeFunctions.push(name =>
      name.startsWith('fg_system_wifi_') ||
      name.startsWith('fg_wifi_') ||
      name.startsWith('fg_keyboard_'),
    )
    code = removeGeneratedRange(
      code,
      '    fg_system_wifi_page = lv_obj_create(parent);',
      '    fg_system_brightness_page = lv_obj_create(parent);',
    )
    code = removeGeneratedRange(
      code,
      'static void fg_wifi_tick_cb(lv_timer_t *timer)\n{',
      '// ForgeUI LVGL Export Proof V1',
    )
    code = code
      .replace(/^.*wifi_card.*\r?\n/gm, '')
      .replace(/^.*fg_wifi_tick_cb.*\r?\n/gm, '')
  }

  if (!features.storageBrowser) {
    removeFunctions.push(name =>
      name.startsWith('fg_system_storage_') ||
      name.startsWith('fg_storage_'),
    )
    code = code
      .replace(/^.*storage_card.*\r?\n/gm, '')
  }

  if (!features.diagnostics) {
    removeFunctions.push(name =>
      name.startsWith('fg_system_diagnostics_') ||
      name.startsWith('fg_diagnostics_') ||
      name === 'fg_system_open_diagnostics_cb',
    )
    code = removeGeneratedRange(
      code,
      '    fg_system_diagnostics_page = lv_obj_create(parent);',
      '#if 0 /* Legacy eager Storage construction retained only as migration reference. */',
    )
    code = code
      .replace(/^.*diagnostics_card.*\r?\n/gm, '')
  }

  if (!features.storageBrowser) {
    code = code.replace(
      /#if 0 \/\* Legacy eager Storage construction retained only as migration reference\. \*\/[\s\S]*?#endif\r?\n/,
      '',
    )
  }

  if (!features.settingsLauncher) {
    removeFunctions.push(name =>
      name.startsWith('fg_system_') ||
      name.startsWith('fg_wifi_') ||
      name.startsWith('fg_keyboard_') ||
      name.startsWith('fg_storage_') ||
      name.startsWith('fg_diagnostics_'),
    )
    code = removeTopLevelGeneratedFunctions(
      code,
      name => removeFunctions.some(predicate => predicate(name)),
    )
    const systemTokens = [
      'fg_system_',
      'fg_wifi_',
      'FG_WIFI_',
      'fg_storage_',
      'FG_STORAGE_',
      'fg_diagnostics_',
      'LV_SYMBOL_BLUETOOTH',
      'LV_SYMBOL_VOLUME_MAX',
      'LV_SYMBOL_HOME "\\nDevice',
    ]
    code = code.split(/\r?\n/).filter(
      line => !systemTokens.some(token => line.includes(token)),
    ).join('\n')
    const gearStart = code.lastIndexOf(
      '    LV_IMAGE_DECLARE(fg_icon_settings_fi_48px);',
    )
    const functionEnd = code.lastIndexOf('\n}')
    if (gearStart >= 0 && functionEnd > gearStart) {
      code = code.slice(0, gearStart) + code.slice(functionEnd)
    }
    code = code.replace('    fg_system_root = parent;\n', '')
  } else {
    code = removeTopLevelGeneratedFunctions(
      code,
      name => removeFunctions.some(predicate => predicate(name)),
    )
    const disabledTokens: string[] = []
    if (!features.wifiManager) {
      disabledTokens.push('fg_system_wifi', 'fg_wifi_', 'FG_WIFI_')
    }
    if (!features.storageBrowser) {
      disabledTokens.push('fg_system_storage', 'fg_storage_', 'FG_STORAGE_')
    }
    if (!features.diagnostics) {
      disabledTokens.push('fg_system_diagnostics', 'fg_diagnostics_')
    }
    if (requested && !features.bluetooth) disabledTokens.push('LV_SYMBOL_BLUETOOTH')
    if (requested && !features.audio) disabledTokens.push('LV_SYMBOL_VOLUME_MAX')
    if (requested && !features.usbHost && !features.camera) {
      disabledTokens.push('LV_SYMBOL_HOME "\\nDevice')
    }
    code = code.split(/\r?\n/).filter(
      line => !disabledTokens.some(token => line.includes(token)),
    ).join('\n')
  }

  return {
    code,
    features,
    usesSettingsAsset: features.settingsLauncher,
  }
}

const generateFiRuntimeFiles = (
  fiIconExports: Map<string, FiIconExport>,
  textPrimary: string,
) => {
  const enabled = Array.from(fiIconExports.values()).filter(icon => icon.runtimeEnabled)
  if (enabled.length === 0) return { header: '', source: '' }

  const header = [
    `#ifndef FORGEUI_FI_RUNTIME_H`,
    `#define FORGEUI_FI_RUNTIME_H`,
    ``,
    `#include <stdbool.h>`,
    `#include <stdint.h>`,
    `#include "lvgl.h"`,
    ``,
    `#ifdef __cplusplus`,
    `extern "C" {`,
    `#endif`,
    ``,
    ...enabled.flatMap(icon => [
      `void FG_Set_${icon.stem}_Visible(bool visible);`,
      `void FG_Set_${icon.stem}_Opacity(uint8_t opacity);`,
      `void FG_Set_${icon.stem}_Color(uint32_t rgb);`,
      `void fg_fi_bind_${icon.runtimeStem}(lv_obj_t * object, bool image_backed);`,
      ``,
    ]),
    `#ifdef __cplusplus`,
    `}`,
    `#endif`,
    ``,
    `#endif`,
    ``,
  ].join('\n')

  const source = [
    `#include "96_FiRuntime.h"`,
    ``,
    ...enabled.flatMap(icon => {
      const model = getForgeUIStandardIconPresentation(icon.props, textPrimary)
      const color = `0x${model.color.slice(1)}`
      const opacity = Math.round(model.opacity * 255)
      return [
        `static lv_obj_t * fg_fi_${icon.runtimeStem}_object = NULL;`,
        `static bool fg_fi_${icon.runtimeStem}_image_backed = false;`,
        `static bool fg_fi_${icon.runtimeStem}_visible = ${model.visible ? 'true' : 'false'};`,
        `static uint8_t fg_fi_${icon.runtimeStem}_opacity = ${opacity};`,
        `static uint32_t fg_fi_${icon.runtimeStem}_color = ${color};`,
        ``,
        `static void fg_fi_apply_${icon.runtimeStem}(void)`,
        `{`,
        `    lv_obj_t * object = fg_fi_${icon.runtimeStem}_object;`,
        `    if (object == NULL) return;`,
        `    if (fg_fi_${icon.runtimeStem}_visible) lv_obj_clear_flag(object, LV_OBJ_FLAG_HIDDEN);`,
        `    else lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);`,
        `    lv_obj_set_style_opa(object, fg_fi_${icon.runtimeStem}_opacity, 0);`,
        `    if (fg_fi_${icon.runtimeStem}_image_backed) {`,
        `        lv_obj_set_style_image_recolor(object, lv_color_hex(fg_fi_${icon.runtimeStem}_color), 0);`,
        `        lv_obj_set_style_image_recolor_opa(object, LV_OPA_COVER, 0);`,
        `    } else {`,
        `        lv_obj_set_style_text_color(object, lv_color_hex(fg_fi_${icon.runtimeStem}_color), 0);`,
        `    }`,
        `}`,
        ``,
        `void fg_fi_bind_${icon.runtimeStem}(lv_obj_t * object, bool image_backed)`,
        `{`,
        `    fg_fi_${icon.runtimeStem}_object = object;`,
        `    fg_fi_${icon.runtimeStem}_image_backed = image_backed;`,
        `    fg_fi_apply_${icon.runtimeStem}();`,
        `}`,
        ``,
        `void FG_Set_${icon.stem}_Visible(bool visible)`,
        `{`,
        `    if (fg_fi_${icon.runtimeStem}_visible == visible) return;`,
        `    fg_fi_${icon.runtimeStem}_visible = visible;`,
        `    if (fg_fi_${icon.runtimeStem}_object == NULL) return;`,
        `    if (visible) lv_obj_clear_flag(fg_fi_${icon.runtimeStem}_object, LV_OBJ_FLAG_HIDDEN);`,
        `    else lv_obj_add_flag(fg_fi_${icon.runtimeStem}_object, LV_OBJ_FLAG_HIDDEN);`,
        `}`,
        ``,
        `void FG_Set_${icon.stem}_Opacity(uint8_t opacity)`,
        `{`,
        `    if (fg_fi_${icon.runtimeStem}_opacity == opacity) return;`,
        `    fg_fi_${icon.runtimeStem}_opacity = opacity;`,
        `    if (fg_fi_${icon.runtimeStem}_object == NULL) return;`,
        `    lv_obj_set_style_opa(fg_fi_${icon.runtimeStem}_object, opacity, 0);`,
        `}`,
        ``,
        `void FG_Set_${icon.stem}_Color(uint32_t rgb)`,
        `{`,
        `    rgb &= 0xFFFFFFu;`,
        `    if (fg_fi_${icon.runtimeStem}_color == rgb) return;`,
        `    fg_fi_${icon.runtimeStem}_color = rgb;`,
        `    if (fg_fi_${icon.runtimeStem}_object == NULL) return;`,
        `    if (fg_fi_${icon.runtimeStem}_image_backed) {`,
        `        lv_obj_set_style_image_recolor(fg_fi_${icon.runtimeStem}_object, lv_color_hex(rgb), 0);`,
        `        lv_obj_set_style_image_recolor_opa(fg_fi_${icon.runtimeStem}_object, LV_OPA_COVER, 0);`,
        `    } else {`,
        `        lv_obj_set_style_text_color(fg_fi_${icon.runtimeStem}_object, lv_color_hex(rgb), 0);`,
        `    }`,
        `}`,
        ``,
      ]
    }),
  ].join('\n')
  return { header, source }
}

export const generateForgeUILvglCode = (
  components: IComponents,
  themeId: string = 'graphite',
  heroBackground?: any,
  options?: {
    includeThemeTexture?: boolean
    palette?: ForgePreviewPalette
    firmwareFeatures?: Partial<ForgeUIFirmwareFeatures>
  },
) => {
  const nativeIdentityDiagnostics = Object.entries(components)
    .filter(([, component]) => component.type === 'DashboardCard' || component.type === 'SensorTile' || component.type === 'RelayPanel' || component.type === 'PwmController' || component.type === 'AlarmPanel' || component.type === 'IOMonitor')
    .map(([persistedId, component]) => {
      if (!component.id || component.id !== persistedId) {
        throw new Error(
          `Native Component persisted identity mismatch: key=${persistedId}, id=${component.id || '<missing>'}, type=${component.type}`,
        )
      }
      const symbol = toCIdentifier(component.id, component.type)
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      return {
        persistedId,
        componentId: component.id,
        type: component.type,
        componentName: component.componentName || '',
        generatedSymbolBase: symbol,
        source: 'ForgeUILvglExport/IComponent.id',
      }
    })
  if (process.env.NODE_ENV !== 'test' && nativeIdentityDiagnostics.length > 0) {
    console.info('[ForgeUI Native Identity] export input', nativeIdentityDiagnostics)
  }

   const lines: string[] = []
  const usedAssetSources = new Set<string>()
  const usedHookNames = new Set<string>()
  const userEventHooks = new Set<string>()
  const buttonExports = createButtonExports(
    components,
    usedHookNames,
    userEventHooks,
  )
  const dashboardCardExports = createDashboardCardExports(
    components,
    usedHookNames,
    userEventHooks,
  )
  const sensorTileExports = createSensorTileExports(components, usedHookNames, userEventHooks)
  const relayPanelExports = createRelayPanelExports(components, usedHookNames, userEventHooks)
  const pwmControllerExports = createPwmControllerExports(components, usedHookNames, userEventHooks)
  const alarmPanelExports = createAlarmPanelExports(components, usedHookNames, userEventHooks)
  const ioMonitorExports = createIOMonitorExports(components, usedHookNames, userEventHooks)
  const batteryCardExports = createBatteryCardExports(components)
  const tankLevelCardExports = createTankLevelCardExports(components)
  const networkStatusCardExports = createNetworkStatusCardExports(components)
  const deviceSummaryCardExports = createDeviceSummaryCardExports(components)
  const kpiCardExports = createKpiCardExports(components)
  const powerFlowCardExports = createPowerFlowCardExports(components)
  const fiIconExports = createFiIconExports(
    components,
    usedHookNames,
    userEventHooks,
  )
  const listExports = createListExports(
    components,
    usedHookNames,
    userEventHooks,
  )
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
  const qrCodeExports = createQRCodeExports(
    components,
    Array.from(inputExports.values()).map(value => value.apiName),
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
  const circularProgressExports = createCircularProgressExports(
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
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
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
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
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
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
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
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
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
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
    ],
  )
  const sliderExports = createSliderExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
      ...Array.from(selectExports.values()).map(value => value.apiName),
      ...Array.from(imageExports.values()).map(value => value.apiName),
      ...Array.from(boxExports.values()).map(value => value.apiName),
      ...Array.from(iconButtonExports.values()).map(value => value.apiName),
      ...Array.from(inputExports.values()).map(value => value.apiName),
      ...Array.from(switchExports.values()).map(value => value.apiName),
      ...Array.from(checkboxExports.values()).map(value => value.apiName),
      ...Array.from(radioExports.values()).map(value => value.apiName),
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
      ...Array.from(qrCodeExports.values()).map(value => value.apiName),
    ],
  )
  const spinboxExports = createSpinboxExports(
    components,
    usedHookNames,
    userEventHooks,
    [
      ...Array.from(binaryOutputExports.values()).map(value => value.apiName),
      ...Array.from(ledExports.values()).map(value => value.apiName),
      ...Array.from(barExports.values()).map(value => value.apiName),
      ...Array.from(arcExports.values()).map(value => value.apiName),
      ...Array.from(progressExports.values()).map(value => value.apiName),
      ...Array.from(circularProgressExports.values()).map(value => value.apiName),
      ...Array.from(numberInputExports.values()).map(value => value.apiName),
      ...Array.from(selectExports.values()).map(value => value.apiName),
      ...Array.from(sliderExports.values()).map(value => value.apiName),
    ],
  )
  const clockExports = createClockExports(components)
  const wifiStatusExports = createWifiStatusExports(components)
  const labelTextExports = createLabelTextExports(components, [
    ...Array.from(inputExports.values()).map(value => value.apiName),
    ...Array.from(qrCodeExports.values()).map(value => value.apiName),
  ])

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
  healthNormal: toLvHex(semanticPalette.healthNormal),
  healthHigh: toLvHex(semanticPalette.healthHigh),
  healthCritical: toLvHex(semanticPalette.healthCritical),

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

const isWeather04Project = Object.values(components).some(
  (component: any) => component?.componentName === 'Weather_Temperature',
)
const weatherRuntimeAssets = isWeather04Project
  ? FORGEUI_WEATHER_RUNTIME_BACKGROUND_KEYS.map(key =>
      FORGEUI_WEATHER_BACKGROUND_PACK.find(asset => asset.semanticKey === key),
    ).filter((asset): asset is ForgeUIBackgroundAsset => Boolean(asset))
  : []

const weatherDefaultAsset = weatherRuntimeAssets.find(
  asset => asset.semanticKey === 'weather.clear.day',
)

// Weather 04 must start from its runtime pack, not retain an unrelated/manual
// Studio hero as an eleventh firmware dependency.
const backgroundAsset =
  (isWeather04Project && weatherDefaultAsset?.lvgl && weatherDefaultAsset.cFile
    ? { symbol: weatherDefaultAsset.lvgl, source: weatherDefaultAsset.cFile }
    : undefined) ||
  heroAsset ||
  (options?.includeThemeTexture === false ? undefined : palette.textureAsset)

const backgroundMode = heroAsset || weatherDefaultAsset
  ? 'fullscreen'
  : palette.textureMode

  lines.push(`#include "90_Studio_Export.h"`)
  lines.push(`#include "00_ForgeUI_Features.h"`)
  lines.push(`#include "05_FG_RAM_Probe.h"`)
  lines.push(`#include "lvgl.h"`)
  lines.push(`#include "bsp/display.h"`)
  lines.push(`#include "20_RTC.h"`)
  lines.push(`#include "30_WIFI.h"`)
  lines.push(`#include "40_SD.h"`)
  lines.push(`#include "50_DIAGNOSTICS.h"`)
  lines.push(`#include "freertos/FreeRTOS.h"`)
  lines.push(`#include "freertos/queue.h"`)
  lines.push(`#include "freertos/semphr.h"`)
  lines.push(`#include "freertos/task.h"`)
  lines.push(`#include "esp_timer.h"`)
  if (hasInteractiveButtons || dashboardCardExports.size > 0 || sensorTileExports.size > 0 || relayPanelExports.size > 0 || pwmControllerExports.size > 0 || alarmPanelExports.size > 0 || ioMonitorExports.size > 0 || batteryCardExports.size > 0 || tankLevelCardExports.size > 0 || networkStatusCardExports.size > 0 || deviceSummaryCardExports.size > 0 || kpiCardExports.size > 0 || powerFlowCardExports.size > 0 || listExports.size > 0 || toggleInputExports.size > 0 || threeWayInputExports.size > 0 || ledExports.size > 0 || barExports.size > 0 || arcExports.size > 0 || chartExports.size > 0 || keyboardExports.size > 0 || calendarExports.size > 0 || rollerExports.size > 0 || messageBoxExports.size > 0 || buttonMatrixExports.size > 0 || tabViewExports.size > 0 || tileViewExports.size > 0 || inputExports.size > 0 || switchExports.size > 0 || checkboxExports.size > 0 || radioExports.size > 0 || numberInputExports.size > 0 || selectExports.size > 0 || iconButtonExports.size > 0 || sliderExports.size > 0 || spinboxExports.size > 0 || Array.from(fiIconExports.values()).some(icon => icon.clickEnabled)) {
    lines.push(`#include "95_UserEvents.h"`)
  }
  if (Array.from(fiIconExports.values()).some(icon => icon.runtimeEnabled)) {
    lines.push(`#include "96_FiRuntime.h"`)
  }
  lines.push(`#include <stdbool.h>`)
  lines.push(`#include <stdint.h>`)
  lines.push(`#include <limits.h>`)
  lines.push(`#include <stdio.h>`)
  lines.push(`#include <stdlib.h>`)
  lines.push(`#include <string.h>`)
  lines.push(`#include <math.h>`)
  lines.push(``)
  const declaredBackgroundSymbols = new Set<string>()
  const declareBackgroundSymbol = (symbol?: string) => {
    if (!symbol || declaredBackgroundSymbols.has(symbol)) return
    declaredBackgroundSymbols.add(symbol)
    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
  }
  declareBackgroundSymbol(backgroundAsset?.symbol)
  weatherRuntimeAssets.forEach(asset => declareBackgroundSymbol(asset.lvgl))
  if (isWeather04Project) {
    lines.push(`static lv_obj_t * fg_weather_background_image = NULL;`)
    lines.push(`static const char * fg_weather_background_key = NULL;`)
    lines.push(``)
  }
  clockExports.forEach(clockExport => {
    lines.push(`static lv_obj_t * ${clockExport.labelName} = NULL;`)
    lines.push(`static lv_timer_t * ${clockExport.timerName} = NULL;`)
    lines.push(`static bool ${clockExport.separatorVisibleName} = true;`)
  })
  wifiStatusExports.forEach(wifi => {
    lines.push(`static lv_obj_t * ${wifi.labelName} = NULL;`)
  })
  labelTextExports.forEach(labelExport => {
    lines.push(`static lv_obj_t * ${labelExport.objectName} = NULL;`)
  })
  dashboardCardExports.forEach(card => {
    lines.push(`static lv_obj_t * ${card.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.titleName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.valueName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.unitsName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.descriptionName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.statusName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.statusIndicatorName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.progressName} = NULL;`)
    lines.push(`static lv_obj_t * ${card.footerName} = NULL;`)
  })
  sensorTileExports.forEach(tile => {
    lines.push(`static lv_obj_t * ${tile.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.iconName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.valueName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.unitsName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.statusName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.statusIndicatorName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.trendName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.timestampName} = NULL;`)
    lines.push(`static lv_obj_t * ${tile.progressName} = NULL;`)
  })
  relayPanelExports.forEach(panel => {
    lines.push(`static lv_obj_t * ${panel.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${panel.channelObjectsName}[${panel.channelCount}] = {0};`)
    lines.push(`static lv_obj_t * ${panel.labelObjectsName}[${panel.channelCount}] = {0};`)
    lines.push(`static lv_obj_t * ${panel.statusObjectsName}[${panel.channelCount}] = {0};`)
    lines.push(`static bool ${panel.stateName}[${panel.channelCount}] = {0};`)
    lines.push(`static bool ${panel.enabledName}[${panel.channelCount}] = {0};`)
    lines.push(`static bool ${panel.programmaticName} = false;`)
    lines.push(`static lv_obj_t * ${panel.masterObjectName} = NULL;`)
  })
  alarmPanelExports.forEach(alarm => {
    lines.push(`static lv_obj_t * ${alarm.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${alarm.rowNames}[${alarm.visibleRows}] = {0}; static lv_obj_t * ${alarm.rowLabelNames}[${alarm.visibleRows}] = {0};`)
    lines.push(`static lv_obj_t * ${alarm.rowStateLabelNames}[${alarm.visibleRows}] = {0}; static lv_obj_t * ${alarm.rowPriorityLabelNames}[${alarm.visibleRows}] = {0}; static lv_obj_t * ${alarm.rowAckLabelNames}[${alarm.visibleRows}] = {0};`)
    lines.push(`static lv_obj_t * ${alarm.countLabelName} = NULL;`)
    lines.push(`static int32_t ${alarm.selectedRowName}[${alarm.visibleRows}] = {0};`)
    lines.push(`static int32_t ${alarm.idsName}[${alarm.capacity}] = {0}; static bool ${alarm.occupiedName}[${alarm.capacity}] = {0};`)
    lines.push(`static char ${alarm.messagesName}[${alarm.capacity}][97] = {{0}}; static char ${alarm.timestampsName}[${alarm.capacity}][25] = {{0}};`)
    lines.push(`static FG_Alarm_State ${alarm.statesName}[${alarm.capacity}] = {0}; static FG_Alarm_Priority ${alarm.prioritiesName}[${alarm.capacity}] = {0};`)
    lines.push(`static uint32_t ${alarm.countName} = 0; static bool ${alarm.enabledName} = true;`)
  })
  ioMonitorExports.forEach(io => {
    const typeValue = (type: string) => `FG_IO_${type.replace('-', '_').toUpperCase()}`
    lines.push(`static lv_obj_t * ${io.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${io.rowNames}[${io.rowCount}] = {0}; static lv_obj_t * ${io.channelLabels}[${io.rowCount}] = {0}; static lv_obj_t * ${io.nameLabels}[${io.rowCount}] = {0};`)
    lines.push(`static lv_obj_t * ${io.valueLabels}[${io.rowCount}] = {0}; static lv_obj_t * ${io.stateLabels}[${io.rowCount}] = {0};`)
    lines.push(`static const char * ${io.channelsName}[${io.rowCount}] = {${io.model.rows.length ? io.model.rows.map(row => `"${esc(row.channel)}"`).join(', ') : 'NULL'}};`)
    lines.push(`static FG_IO_Type ${io.typesName}[${io.rowCount}] = {${io.model.rows.length ? io.model.rows.map(row => typeValue(row.ioType)).join(', ') : 'FG_IO_DIGITAL_INPUT'}};`)
    lines.push(`static float ${io.valuesName}[${io.rowCount}] = {${io.model.rows.length ? io.model.rows.map(row => cFloatLiteral(row.value)).join(', ') : '0.0f'}};`)
    lines.push(`static bool ${io.statesName}[${io.rowCount}] = {${io.model.rows.length ? io.model.rows.map(row => row.state ? 'true' : 'false').join(', ') : 'false'}};`)
  })
  ioMonitorExports.forEach(io => {
    lines.push(`static void ${io.refreshName}(void)`)
    lines.push(`{`)
    io.model.rows.forEach((row, index) => {
      lines.push(`    if (${io.channelLabels}[${index}]) lv_label_set_text(${io.channelLabels}[${index}], ${io.channelsName}[${index}]);`)
      lines.push(`    if (${io.nameLabels}[${index}]) lv_label_set_text(${io.nameLabels}[${index}], "${esc(row.displayName)}");`)
      if (row.showValue) lines.push(`    if (${io.valueLabels}[${index}]) { lv_label_set_text_fmt(${io.valueLabels}[${index}], "%.3g%s%s", (double)${io.valuesName}[${index}], "${row.units ? ' ' : ''}", "${escPrintfLiteral(row.units)}"); lv_obj_remove_flag(${io.valueLabels}[${index}], LV_OBJ_FLAG_HIDDEN); }`)
      else lines.push(`    if (${io.valueLabels}[${index}]) lv_obj_add_flag(${io.valueLabels}[${index}], LV_OBJ_FLAG_HIDDEN);`)
      if (row.showState) lines.push(`    if (${io.stateLabels}[${index}]) { lv_label_set_text(${io.stateLabels}[${index}], ${io.statesName}[${index}] ? "ON" : "OFF"); lv_obj_set_style_text_color(${io.stateLabels}[${index}], lv_color_hex(${io.statesName}[${index}] ? 0x${toLvHex(row.colour).slice(2)} : ${palette.textSecondary}), 0); lv_obj_remove_flag(${io.stateLabels}[${index}], LV_OBJ_FLAG_HIDDEN); }`)
      else lines.push(`    if (${io.stateLabels}[${index}]) lv_obj_add_flag(${io.stateLabels}[${index}], LV_OBJ_FLAG_HIDDEN);`)
    })
    lines.push(`}`); lines.push(``)
    if (io.selectCallbackName && io.selectedHookName) {
      lines.push(`static void ${io.selectCallbackName}(lv_event_t * event) { uint32_t row = (uint32_t)(uintptr_t)lv_event_get_user_data(event); if (row < ${io.model.rows.length}u) ${io.selectedHookName}(${io.channelsName}[row], ${io.typesName}[row]); }`)
      lines.push(``)
    }
    if (io.runtimeEnabled) {
      const setter = (name: string, type: string, analog: boolean) => {
        const valueArg = analog ? 'float value' : 'bool state'
        const assign = analog ? `${io.valuesName}[i] = value;` : `${io.statesName}[i] = state; ${io.valuesName}[i] = state ? 1.0f : 0.0f;`
        lines.push(`bool ${name}(const char * channel, ${valueArg}) { if (!channel) return false; for (uint32_t i = 0; i < ${io.model.rows.length}u; ++i) if (${io.typesName}[i] == ${type} && strcmp(${io.channelsName}[i], channel) == 0) { ${assign} ${io.refreshName}(); return true; } return false; }`)
      }
      setter(io.setDigitalInputApiName, 'FG_IO_DIGITAL_INPUT', false)
      setter(io.setDigitalOutputApiName, 'FG_IO_DIGITAL_OUTPUT', false)
      setter(io.setAnalogInputApiName, 'FG_IO_ANALOG_INPUT', true)
      setter(io.setAnalogOutputApiName, 'FG_IO_ANALOG_OUTPUT', true)
      lines.push(``)
    }
  })
  batteryCardExports.forEach(b => {
    lines.push(`static lv_obj_t * ${b.rootName} = NULL; static lv_obj_t * ${b.percentageLabel} = NULL; static lv_obj_t * ${b.statusLabel} = NULL; static lv_obj_t * ${b.iconFillName} = NULL; static lv_obj_t * ${b.voltageLabel} = NULL; static lv_obj_t * ${b.currentLabel} = NULL; static lv_obj_t * ${b.runtimeLabel} = NULL; static lv_obj_t * ${b.temperatureLabel} = NULL; static lv_obj_t * ${b.healthLabel} = NULL; static lv_obj_t * ${b.barName} = NULL;`)
    lines.push(`static float ${b.percentageName} = ${cFloatLiteral(b.model.percentage)}; static float ${b.voltageName} = ${cFloatLiteral(b.model.voltage)}; static float ${b.currentName} = ${cFloatLiteral(b.model.current)}; static bool ${b.chargingName} = ${b.model.charging ? 'true' : 'false'}; static int32_t ${b.runtimeName} = ${b.model.remainingMinutes}; static float ${b.temperatureName} = ${cFloatLiteral(b.model.temperature)}; static int32_t ${b.healthName} = ${['good','fair','poor','replace'].indexOf(b.model.health)};`)
    lines.push(`static void ${b.refreshName}(void) { uint32_t colour = ${b.chargingName} ? 0x${b.model.chargingColour.slice(1)} : (${b.percentageName} <= ${cFloatLiteral(b.model.criticalThreshold)} ? 0x${b.model.criticalColour.slice(1)} : (${b.percentageName} <= ${cFloatLiteral(b.model.lowThreshold)} ? 0x${b.model.lowColour.slice(1)} : 0x${b.model.normalColour.slice(1)})); static const char * names[] = {"GOOD","FAIR","POOR","REPLACE"}; if (${b.percentageLabel}) { lv_label_set_text_fmt(${b.percentageLabel}, "%.1f ${escPrintfLiteral(b.model.units)}", (double)${b.percentageName}); lv_obj_set_style_text_color(${b.percentageLabel}, lv_color_hex(colour), 0); } if (${b.statusLabel}) { lv_label_set_text(${b.statusLabel}, ${b.model.showChargingIcon ? `${b.chargingName} ? "CHARGING" : names[${b.healthName}]` : `names[${b.healthName}]`}); lv_obj_set_style_text_color(${b.statusLabel}, lv_color_hex(colour), 0); } if (${b.iconFillName}) { int32_t fill_w = (int32_t)(18.0f * ${b.percentageName} / 100.0f); if (fill_w < 0) fill_w = 0; if (fill_w > 18) fill_w = 18; lv_obj_set_width(${b.iconFillName}, fill_w); lv_obj_set_style_bg_color(${b.iconFillName}, lv_color_hex(colour), 0); } if (${b.barName}) { lv_bar_set_value(${b.barName}, (int32_t)${b.percentageName}, LV_ANIM_OFF); lv_obj_set_style_bg_color(${b.barName}, lv_color_hex(colour), LV_PART_INDICATOR); } if (${b.voltageLabel}) lv_label_set_text_fmt(${b.voltageLabel}, "VOLTAGE\\n%.2f V", (double)${b.voltageName}); if (${b.currentLabel}) lv_label_set_text_fmt(${b.currentLabel}, "CURRENT\\n%.2f A", (double)${b.currentName}); if (${b.runtimeLabel}) lv_label_set_text_fmt(${b.runtimeLabel}, "RUNTIME\\n%ldh %ldm", (long)(${b.runtimeName}/60), (long)(${b.runtimeName}%60)); if (${b.temperatureLabel}) lv_label_set_text_fmt(${b.temperatureLabel}, "TEMP\\n%.1f C", (double)${b.temperatureName}); if (${b.healthLabel}) lv_label_set_text_fmt(${b.healthLabel}, "HEALTH\\n%s", names[${b.healthName}]); }`)
    if (b.runtimeEnabled) {
      lines.push(`void FG_Set_${b.stem}_Percentage(float value) { ${b.percentageName} = value < 0.0f ? 0.0f : (value > 100.0f ? 100.0f : value); ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Voltage(float value) { ${b.voltageName} = value; ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Current(float value) { ${b.currentName} = value; ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Charging(bool enabled) { ${b.chargingName} = enabled; ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Health(int32_t value) { ${b.healthName} = value < 0 ? 0 : (value > 3 ? 3 : value); ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Runtime(int32_t value) { ${b.runtimeName} = value < 0 ? 0 : value; ${b.refreshName}(); }`)
      lines.push(`void FG_Set_${b.stem}_Temperature(float value) { ${b.temperatureName} = value; ${b.refreshName}(); }`)
    }
  })
  tankLevelCardExports.forEach(t => {
    lines.push(`static lv_obj_t * ${t.rootName} = NULL; static lv_obj_t * ${t.tankName} = NULL; static lv_obj_t * ${t.fillName} = NULL; static lv_obj_t * ${t.percentageLabel} = NULL; static lv_obj_t * ${t.volumeLabel} = NULL; static lv_obj_t * ${t.statusLabel} = NULL; static lv_obj_t * ${t.lowLabel} = NULL; static lv_obj_t * ${t.highLabel} = NULL; static lv_obj_t * ${t.criticalLabel} = NULL;`)
    lines.push(`static float ${t.levelName} = ${cFloatLiteral(t.model.level)}; static float ${t.volumeName} = ${cFloatLiteral(t.model.currentVolume)}; static float ${t.capacityName} = ${cFloatLiteral(t.model.capacity)}; static char ${t.unitsName}[13] = "${esc(t.model.units)}"; static float ${t.lowName} = ${cFloatLiteral(t.model.lowLevel)}; static float ${t.highName} = ${cFloatLiteral(t.model.highLevel)};`)
    lines.push(`static void ${t.refreshName}(void) { bool overflow = ${t.levelName} > 100.0f || (${t.capacityName} > 0.0f && ${t.volumeName} > ${t.capacityName}); bool empty = ${t.levelName} <= ${cFloatLiteral(t.model.criticalLevel)}; uint32_t colour = overflow ? 0x${t.model.overflowColour.slice(1)} : (empty ? 0x${t.model.criticalColour.slice(1)} : (${t.levelName} <= ${t.lowName} ? 0x${t.model.lowColour.slice(1)} : (${t.levelName} >= ${t.highName} ? 0x${t.model.highColour.slice(1)} : 0x${t.model.fillColour.slice(1)}))); const char * status = overflow ? "OVERFLOW" : (empty ? "EMPTY" : (${t.levelName} <= ${t.lowName} ? "LOW" : (${t.levelName} >= ${t.highName} ? "HIGH" : "NORMAL"))); float bounded = ${t.levelName} < 0.0f ? 0.0f : (${t.levelName} > 100.0f ? 100.0f : ${t.levelName}); if (${t.percentageLabel}) { lv_label_set_text_fmt(${t.percentageLabel}, "%.1f%%", (double)${t.levelName}); lv_obj_set_style_text_color(${t.percentageLabel}, lv_color_hex(colour), 0); } if (${t.volumeLabel}) lv_label_set_text_fmt(${t.volumeLabel}, "%.1f / %.1f %s", (double)${t.volumeName}, (double)${t.capacityName}, ${t.unitsName}); if (${t.statusLabel}) { lv_label_set_text(${t.statusLabel}, status); lv_obj_set_style_text_color(${t.statusLabel}, lv_color_hex(colour), 0); } if (${t.fillName}) { lv_bar_set_value(${t.fillName}, (int32_t)bounded, ${t.model.animateFill ? 'LV_ANIM_ON' : 'LV_ANIM_OFF'}); lv_obj_set_style_bg_color(${t.fillName}, lv_color_hex(colour), LV_PART_INDICATOR); } if (${t.lowLabel}) lv_label_set_text_fmt(${t.lowLabel}, "LOW\\n%.0f%%", (double)${t.lowName}); if (${t.highLabel}) lv_label_set_text_fmt(${t.highLabel}, "HIGH\\n%.0f%%", (double)${t.highName}); if (${t.criticalLabel}) lv_label_set_text(${t.criticalLabel}, "CRIT\\n${Number(t.model.criticalLevel.toFixed(0))}%"); }`)
    if (t.runtimeEnabled) {
      lines.push(`void FG_Set_${t.stem}_Level(float percent) { ${t.levelName} = percent < 0.0f ? 0.0f : (percent > 120.0f ? 120.0f : percent); ${t.refreshName}(); }`)
      lines.push(`void FG_Set_${t.stem}_Volume(float value) { ${t.volumeName} = value < 0.0f ? 0.0f : value; ${t.refreshName}(); }`)
      lines.push(`void FG_Set_${t.stem}_Capacity(float value) { ${t.capacityName} = value < 0.0f ? 0.0f : value; ${t.refreshName}(); }`)
      lines.push(`void FG_Set_${t.stem}_Units(const char * units) { if (!units) units = ""; snprintf(${t.unitsName}, sizeof(${t.unitsName}), "%s", units); ${t.refreshName}(); }`)
      lines.push(`void FG_Set_${t.stem}_LowLevel(float value) { ${t.lowName} = value < 0.0f ? 0.0f : (value > 100.0f ? 100.0f : value); if (${t.highName} < ${t.lowName}) ${t.highName} = ${t.lowName}; ${t.refreshName}(); }`)
      lines.push(`void FG_Set_${t.stem}_HighLevel(float value) { ${t.highName} = value < ${t.lowName} ? ${t.lowName} : (value > 100.0f ? 100.0f : value); ${t.refreshName}(); }`)
    }
  })
  networkStatusCardExports.forEach(n => {
    const typeIndex={wifi:0,ethernet:1,cellular:2,other:3}[n.model.networkType]
    lines.push(`static lv_obj_t * ${n.rootName}=NULL; static lv_obj_t * ${n.stateLabel}=NULL; static lv_obj_t * ${n.nameLabel}=NULL; static lv_obj_t * ${n.ipLabel}=NULL; static lv_obj_t * ${n.hostnameLabel}=NULL; static lv_obj_t * ${n.statusLabel}=NULL; static lv_obj_t * ${n.barName}=NULL;`)
    lines.push(`static bool ${n.connectedName}=${n.model.connected?'true':'false'}; static int32_t ${n.signalName}=${Math.round(n.model.signalStrength)}; static int32_t ${n.typeName}=${typeIndex}; static char ${n.networkName}[65]="${esc(n.model.networkName)}"; static char ${n.ipName}[46]="${esc(n.model.ipAddress)}"; static char ${n.statusName}[97]="${esc(n.model.statusText)}";`)
    lines.push(`static void ${n.refreshName}(void) { uint32_t colour=${n.connectedName}?0x${n.model.accentColour.slice(1)}:0x${n.model.disconnectedColour.slice(1)}; static const char * types[]={"Wi-Fi","Ethernet","Cellular","Network"}; if(${n.stateLabel}) { lv_label_set_text(${n.stateLabel},${n.connectedName}?"CONNECTED":"DISCONNECTED"); lv_obj_set_style_text_color(${n.stateLabel},lv_color_hex(colour),0); } if(${n.nameLabel}) lv_label_set_text_fmt(${n.nameLabel},"%s  %s",types[${n.typeName}],${n.networkName}); if(${n.ipLabel}) lv_label_set_text_fmt(${n.ipLabel},"IP %s",${n.connectedName}?${n.ipName}:"--"); if(${n.statusLabel}) { lv_label_set_text_fmt(${n.statusLabel},"%s  %ld%%",${n.statusName},(long)(${n.connectedName}?${n.signalName}:0)); lv_obj_set_style_text_color(${n.statusLabel},lv_color_hex(colour),0); } if(${n.barName}) { lv_bar_set_value(${n.barName},${n.connectedName}?${n.signalName}:0,LV_ANIM_OFF); lv_obj_set_style_bg_color(${n.barName},lv_color_hex(colour),LV_PART_INDICATOR); } }`)
    if(n.runtimeEnabled) {
      lines.push(`void FG_Set_${n.stem}_Connected(bool connected) { ${n.connectedName}=connected; ${n.refreshName}(); }`)
      lines.push(`void FG_Set_${n.stem}_Network_Name(const char * name) { if(!name) name=""; snprintf(${n.networkName},sizeof(${n.networkName}),"%s",name); ${n.refreshName}(); }`)
      lines.push(`void FG_Set_${n.stem}_IP_Address(const char * ip) { if(!ip) ip=""; snprintf(${n.ipName},sizeof(${n.ipName}),"%s",ip); ${n.refreshName}(); }`)
      lines.push(`void FG_Set_${n.stem}_Signal_Strength(int32_t percent) { ${n.signalName}=percent<0?0:(percent>100?100:percent); ${n.refreshName}(); }`)
      lines.push(`void FG_Set_${n.stem}_Status_Text(const char * value) { if(!value) value=""; snprintf(${n.statusName},sizeof(${n.statusName}),"%s",value); ${n.refreshName}(); }`)
      lines.push(`void FG_Set_${n.stem}_Network_Type(int32_t value) { ${n.typeName}=value<0?0:(value>3?3:value); ${n.refreshName}(); }`)
    }
  })
  deviceSummaryCardExports.forEach(d => {
    const statusIndex={offline:0,online:1,warning:2,error:3}[d.model.overallStatus]
    lines.push(`static lv_obj_t * ${d.rootName}=NULL; static lv_obj_t * ${d.stateLabel}=NULL; static lv_obj_t * ${d.deviceLabel}=NULL; static lv_obj_t * ${d.uptimeLabel}=NULL; static lv_obj_t * ${d.firmwareLabel}=NULL; static lv_obj_t * ${d.networkLabel}=NULL; static lv_obj_t * ${d.storageLabel}=NULL;`)
    lines.push(`static int32_t ${d.statusName}=${statusIndex}; static char ${d.deviceName}[65]="${esc(d.model.deviceName)}"; static char ${d.uptimeName}[33]="${esc(d.model.uptime)}"; static char ${d.firmwareName}[49]="${esc(d.model.firmwareVersion)}"; static char ${d.networkName}[49]="${esc(d.model.networkStatus)}"; static char ${d.storageName}[49]="${esc(d.model.storageStatus)}";`)
    lines.push(`static void ${d.refreshName}(void) { static const char * states[]={"OFFLINE","ONLINE","WARNING","ERROR"}; static const uint32_t colours[]={0x${d.model.offlineColour.slice(1)},0x${d.model.onlineColour.slice(1)},0x${d.model.warningColour.slice(1)},0x${d.model.errorColour.slice(1)}}; if(${d.stateLabel}) { lv_label_set_text(${d.stateLabel},states[${d.statusName}]); lv_obj_set_style_text_color(${d.stateLabel},lv_color_hex(colours[${d.statusName}]),0); } if(${d.deviceLabel}) lv_label_set_text(${d.deviceLabel},${d.deviceName}); if(${d.uptimeLabel}) lv_label_set_text_fmt(${d.uptimeLabel},"Uptime  %s",${d.uptimeName}); if(${d.firmwareLabel}) lv_label_set_text_fmt(${d.firmwareLabel},"Firmware  %s",${d.firmwareName}); if(${d.networkLabel}) lv_label_set_text_fmt(${d.networkLabel},"Network  %s",${d.networkName}); if(${d.storageLabel}) lv_label_set_text_fmt(${d.storageLabel},"Storage  %s",${d.storageName}); }`)
    if(d.runtimeEnabled) {
      lines.push(`void FG_Set_${d.stem}_Device_Name(const char * name) { if(!name) name=""; snprintf(${d.deviceName},sizeof(${d.deviceName}),"%s",name); ${d.refreshName}(); }`)
      lines.push(`void FG_Set_${d.stem}_Status(int32_t value) { ${d.statusName}=value<0?0:(value>3?3:value); ${d.refreshName}(); }`)
      lines.push(`void FG_Set_${d.stem}_Uptime(const char * value) { if(!value) value=""; snprintf(${d.uptimeName},sizeof(${d.uptimeName}),"%s",value); ${d.refreshName}(); }`)
      lines.push(`void FG_Set_${d.stem}_Firmware_Version(const char * value) { if(!value) value=""; snprintf(${d.firmwareName},sizeof(${d.firmwareName}),"%s",value); ${d.refreshName}(); }`)
      lines.push(`void FG_Set_${d.stem}_Network_Status(const char * value) { if(!value) value=""; snprintf(${d.networkName},sizeof(${d.networkName}),"%s",value); ${d.refreshName}(); }`)
      lines.push(`void FG_Set_${d.stem}_Storage_Status(const char * value) { if(!value) value=""; snprintf(${d.storageName},sizeof(${d.storageName}),"%s",value); ${d.refreshName}(); }`)
    }
  })
  kpiCardExports.forEach(k => {
    const statusIndex={neutral:0,good:1,warning:2,critical:3}[k.model.status]; const trendIndex={flat:0,up:1,down:2}[k.model.trendState]
    lines.push(`static lv_obj_t * ${k.rootName}=NULL; static lv_obj_t * ${k.stateLabel}=NULL; static lv_obj_t * ${k.valueLabel}=NULL; static lv_obj_t * ${k.unitLabel}=NULL; static lv_obj_t * ${k.secondaryLabel}=NULL; static lv_obj_t * ${k.trendLabel}=NULL; static lv_obj_t * ${k.targetLabel}=NULL; static lv_obj_t * ${k.accentName}=NULL;`)
    lines.push(`static int32_t ${k.statusName}=${statusIndex}; static int32_t ${k.trendStateName}=${trendIndex}; static char ${k.valueName}[49]="${esc(k.model.value)}"; static char ${k.unitName}[25]="${esc(k.model.unit)}"; static char ${k.secondaryName}[65]="${esc(k.model.secondaryText)}"; static char ${k.trendTextName}[49]="${esc(k.model.trendText)}"; static char ${k.targetName}[65]="${esc(k.model.targetText)}";`)
    lines.push(`static void ${k.refreshName}(void) { static const char * states[]={"NEUTRAL","GOOD","WARNING","CRITICAL"}; static const char * trends[]={"FLAT","UP","DOWN"}; static const uint32_t colours[]={0x${k.model.neutralColour.slice(1)},0x${k.model.goodColour.slice(1)},0x${k.model.warningColour.slice(1)},0x${k.model.criticalColour.slice(1)}}; uint32_t colour=colours[${k.statusName}]; if(${k.stateLabel}) { lv_label_set_text(${k.stateLabel},states[${k.statusName}]); lv_obj_set_style_text_color(${k.stateLabel},lv_color_hex(colour),0); } if(${k.valueLabel}) { lv_label_set_text(${k.valueLabel},${k.valueName}); lv_obj_set_style_text_color(${k.valueLabel},lv_color_hex(colour),0); } if(${k.unitLabel}) lv_label_set_text(${k.unitLabel},${k.unitName}); if(${k.secondaryLabel}) lv_label_set_text(${k.secondaryLabel},${k.secondaryName}); if(${k.trendLabel}) { lv_label_set_text_fmt(${k.trendLabel},"%s  %s",trends[${k.trendStateName}],${k.trendTextName}); lv_obj_set_style_text_color(${k.trendLabel},lv_color_hex(colour),0); } if(${k.targetLabel}) lv_label_set_text(${k.targetLabel},${k.targetName}); if(${k.accentName}) lv_obj_set_style_bg_color(${k.accentName},lv_color_hex(colour),0); }`)
    if(k.runtimeEnabled) {
      lines.push(`void FG_Set_${k.stem}_Value(const char * value) { if(!value) value=""; snprintf(${k.valueName},sizeof(${k.valueName}),"%s",value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Unit(const char * value) { if(!value) value=""; snprintf(${k.unitName},sizeof(${k.unitName}),"%s",value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Secondary_Text(const char * value) { if(!value) value=""; snprintf(${k.secondaryName},sizeof(${k.secondaryName}),"%s",value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Trend_Text(const char * value) { if(!value) value=""; snprintf(${k.trendTextName},sizeof(${k.trendTextName}),"%s",value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Trend_State(int32_t value) { ${k.trendStateName}=value<0?0:(value>2?2:value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Status(int32_t value) { ${k.statusName}=value<0?0:(value>3?3:value); ${k.refreshName}(); }`)
      lines.push(`void FG_Set_${k.stem}_Target_Text(const char * value) { if(!value) value=""; snprintf(${k.targetName},sizeof(${k.targetName}),"%s",value); ${k.refreshName}(); }`)
    }
  })
  powerFlowCardExports.forEach(p => {
    const flowIndex=(value:string)=>value==='into-centre'?1:value==='out-from-centre'?2:0
    lines.push(`static lv_obj_t * ${p.rootName}=NULL; static lv_obj_t * ${p.gridLabel}=NULL; static lv_obj_t * ${p.solarLabel}=NULL; static lv_obj_t * ${p.batteryLabel}=NULL; static lv_obj_t * ${p.loadLabel}=NULL; static lv_obj_t * ${p.gridFlowLabel}=NULL; static lv_obj_t * ${p.solarFlowLabel}=NULL; static lv_obj_t * ${p.batteryFlowLabel}=NULL; static lv_obj_t * ${p.gridLine}=NULL; static lv_obj_t * ${p.solarLine}=NULL; static lv_obj_t * ${p.batteryLine}=NULL;`)
    lines.push(`static char ${p.gridValue}[25]="${esc(p.model.gridValue)}"; static char ${p.solarValue}[25]="${esc(p.model.solarValue)}"; static char ${p.batteryValue}[25]="${esc(p.model.batteryValue)}"; static char ${p.loadValue}[25]="${esc(p.model.loadValue)}"; static int32_t ${p.gridFlow}=${flowIndex(p.model.gridFlow)}; static int32_t ${p.solarFlow}=${flowIndex(p.model.solarFlow)}; static int32_t ${p.batteryFlow}=${flowIndex(p.model.batteryFlow)};`)
    lines.push(`static void ${p.refreshName}(void) { static const char * horizontal[]={"-",LV_SYMBOL_RIGHT,LV_SYMBOL_LEFT}; static const char * vertical[]={"-",LV_SYMBOL_DOWN,LV_SYMBOL_UP}; const uint32_t active=0x${p.model.activeColour.slice(1)}; const uint32_t inactive=0x${p.model.inactiveColour.slice(1)}; if(${p.gridLabel}) lv_label_set_text_fmt(${p.gridLabel},"GRID\\n%s",${p.gridValue}); if(${p.solarLabel}) lv_label_set_text_fmt(${p.solarLabel},"SOLAR\\n%s",${p.solarValue}); if(${p.batteryLabel}) lv_label_set_text_fmt(${p.batteryLabel},"BATTERY\\n%s",${p.batteryValue}); if(${p.loadLabel}) lv_label_set_text_fmt(${p.loadLabel},"LOAD\\n%s",${p.loadValue}); if(${p.gridFlowLabel}) { lv_label_set_text(${p.gridFlowLabel},horizontal[${p.gridFlow}]); lv_obj_set_style_text_color(${p.gridFlowLabel},lv_color_hex(${p.gridFlow}?active:inactive),0); } if(${p.solarFlowLabel}) { lv_label_set_text(${p.solarFlowLabel},vertical[${p.solarFlow}]); lv_obj_set_style_text_color(${p.solarFlowLabel},lv_color_hex(${p.solarFlow}?active:inactive),0); } if(${p.batteryFlowLabel}) { lv_label_set_text(${p.batteryFlowLabel},vertical[${p.batteryFlow}]); lv_obj_set_style_text_color(${p.batteryFlowLabel},lv_color_hex(${p.batteryFlow}?active:inactive),0); } if(${p.gridLine}) lv_obj_set_style_bg_color(${p.gridLine},lv_color_hex(${p.gridFlow}?active:inactive),0); if(${p.solarLine}) lv_obj_set_style_bg_color(${p.solarLine},lv_color_hex(${p.solarFlow}?active:inactive),0); if(${p.batteryLine}) lv_obj_set_style_bg_color(${p.batteryLine},lv_color_hex(${p.batteryFlow}?active:inactive),0); }`)
    if(p.runtimeEnabled) {
      lines.push(`void FG_Set_${p.stem}_Grid_Value(const char * value) { if(!value) value=""; snprintf(${p.gridValue},sizeof(${p.gridValue}),"%s",value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Grid_Flow(int32_t value) { ${p.gridFlow}=value<0?0:(value>2?2:value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Solar_Value(const char * value) { if(!value) value=""; snprintf(${p.solarValue},sizeof(${p.solarValue}),"%s",value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Solar_Flow(int32_t value) { ${p.solarFlow}=value<0?0:(value>2?2:value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Battery_Value(const char * value) { if(!value) value=""; snprintf(${p.batteryValue},sizeof(${p.batteryValue}),"%s",value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Battery_Flow(int32_t value) { ${p.batteryFlow}=value<0?0:(value>2?2:value); ${p.refreshName}(); }`)
      lines.push(`void FG_Set_${p.stem}_Load_Value(const char * value) { if(!value) value=""; snprintf(${p.loadValue},sizeof(${p.loadValue}),"%s",value); ${p.refreshName}(); }`)
    }
  })
  alarmPanelExports.forEach(alarm => {
    const model = alarm.model
    const stateColour = (state: string) => toLvHex(state === 'warning' ? model.warningColour : state === 'acknowledged' ? model.acknowledgedColour : state === 'cleared' ? model.clearedColour : state === 'normal' ? model.normalColour : model.alarmColour)
    lines.push(`static void ${alarm.refreshName}(void)`)
    lines.push(`{`)
    lines.push(`    if (${alarm.countLabelName}) lv_label_set_text_fmt(${alarm.countLabelName}, "%lu", (unsigned long)${alarm.countName});`)
    lines.push(`    bool used[${alarm.capacity}] = {0};`)
    lines.push(`    for (uint32_t row = 0; row < ${alarm.visibleRows}u; ++row) {`)
    lines.push(`        int32_t selected = -1;`)
    if (model.sortOrder === 'priority') {
      lines.push(`        for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) if (${alarm.occupiedName}[i] && !used[i] && (selected < 0 || ${alarm.prioritiesName}[i] > ${alarm.prioritiesName}[selected])) selected = (int32_t)i;`)
    } else if (model.sortOrder === 'oldest') {
      lines.push(`        for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) if (${alarm.occupiedName}[i] && !used[i]) { selected = (int32_t)i; break; }`)
    } else {
      lines.push(`        for (int32_t i = ${alarm.capacity - 1}; i >= 0; --i) if (${alarm.occupiedName}[i] && !used[i]) { selected = i; break; }`)
    }
    lines.push(`        ${alarm.selectedRowName}[row] = selected;`)
    lines.push(`        if (selected < 0) { if (${alarm.rowNames}[row]) lv_obj_add_flag(${alarm.rowNames}[row], LV_OBJ_FLAG_HIDDEN); continue; }`)
    lines.push(`        used[selected] = true; if (${alarm.rowNames}[row]) lv_obj_remove_flag(${alarm.rowNames}[row], LV_OBJ_FLAG_HIDDEN);`)
    lines.push(`        if (${alarm.rowLabelNames}[row]) lv_label_set_text(${alarm.rowLabelNames}[row], ${alarm.messagesName}[selected]);`)
    lines.push(`        if (${alarm.rowStateLabelNames}[row]) lv_label_set_text_fmt(${alarm.rowStateLabelNames}[row], "${model.showTimestamp ? '%s  %s' : '%s'}", ${alarm.statesName}[selected] == FG_ALARM_STATE_ACKNOWLEDGED ? "ACKNOWLEDGED" : (${alarm.statesName}[selected] == FG_ALARM_STATE_CLEARED ? "CLEARED" : (${alarm.statesName}[selected] == FG_ALARM_STATE_WARNING ? "WARNING" : (${alarm.statesName}[selected] == FG_ALARM_STATE_NORMAL ? "NORMAL" : "ALARM")))${model.showTimestamp ? `, ${alarm.timestampsName}[selected]` : ''});`)
    lines.push(`        if (${alarm.rowPriorityLabelNames}[row]) { lv_label_set_text(${alarm.rowPriorityLabelNames}[row], ${model.showPriority ? `${alarm.prioritiesName}[selected] == FG_ALARM_PRIORITY_CRITICAL ? "CRITICAL" : (${alarm.prioritiesName}[selected] == FG_ALARM_PRIORITY_HIGH ? "HIGH" : (${alarm.prioritiesName}[selected] == FG_ALARM_PRIORITY_MEDIUM ? "MEDIUM" : "LOW"))` : '""'}); ${model.showPriority ? `lv_obj_remove_flag(${alarm.rowPriorityLabelNames}[row], LV_OBJ_FLAG_HIDDEN);` : `lv_obj_add_flag(${alarm.rowPriorityLabelNames}[row], LV_OBJ_FLAG_HIDDEN);`} }`)
    lines.push(`        if (${alarm.rowAckLabelNames}[row]) { if (${model.showAcknowledgement ? 'true' : 'false'} && ${alarm.statesName}[selected] != FG_ALARM_STATE_ACKNOWLEDGED && ${alarm.statesName}[selected] != FG_ALARM_STATE_CLEARED) lv_obj_remove_flag(${alarm.rowAckLabelNames}[row], LV_OBJ_FLAG_HIDDEN); else lv_obj_add_flag(${alarm.rowAckLabelNames}[row], LV_OBJ_FLAG_HIDDEN); }`)
    lines.push(`        uint32_t colour = ${alarm.statesName}[selected] == FG_ALARM_STATE_WARNING ? 0x${stateColour('warning').slice(2)} : (${alarm.statesName}[selected] == FG_ALARM_STATE_ACKNOWLEDGED ? 0x${stateColour('acknowledged').slice(2)} : (${alarm.statesName}[selected] == FG_ALARM_STATE_CLEARED ? 0x${stateColour('cleared').slice(2)} : (${alarm.statesName}[selected] == FG_ALARM_STATE_NORMAL ? 0x${stateColour('normal').slice(2)} : 0x${stateColour('alarm').slice(2)})));`)
    lines.push(`        if (${alarm.rowNames}[row]) lv_obj_set_style_border_color(${alarm.rowNames}[row], lv_color_hex(colour), 0);`)
    lines.push(`        if (${alarm.rowNames}[row]) lv_obj_set_style_border_width(${alarm.rowNames}[row], 3, 0);`)
    lines.push(`        if (${alarm.rowNames}[row]) lv_obj_set_style_border_side(${alarm.rowNames}[row], LV_BORDER_SIDE_LEFT, 0);`)
    lines.push(`    }`)
    lines.push(`}`); lines.push(``)
    if (alarm.selectCallbackName && alarm.selectedHookName) {
      lines.push(`static void ${alarm.selectCallbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    if (!${alarm.enabledName}) return;`)
      lines.push(`    uint32_t row = (uint32_t)(uintptr_t)lv_event_get_user_data(event);`)
      lines.push(`    if (row >= ${alarm.visibleRows}u) return;`)
      lines.push(`    int32_t slot = ${alarm.selectedRowName}[row];`)
      lines.push(`    if (slot < 0) return;`)
      lines.push(`    int32_t alarm_id = ${alarm.idsName}[slot]; ${alarm.selectedHookName}(alarm_id);`)
      if (model.showAcknowledgement && alarm.acknowledgedHookName) lines.push(`    if (${alarm.statesName}[slot] != FG_ALARM_STATE_ACKNOWLEDGED && ${alarm.statesName}[slot] != FG_ALARM_STATE_CLEARED) { ${alarm.statesName}[slot] = FG_ALARM_STATE_ACKNOWLEDGED; ${alarm.refreshName}(); ${alarm.acknowledgedHookName}(alarm_id); }`)
      lines.push(`}`); lines.push(``)
    }
    if (!alarm.runtimeEnabled) return
    lines.push(`bool ${alarm.addApiName}(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state)`)
    lines.push(`{`)
    lines.push(`    if (!${alarm.enabledName} || !message) return false;`)
    lines.push(`    int32_t slot = -1;`)
    lines.push(`    for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) {`)
    lines.push(`        if (${alarm.occupiedName}[i] && ${alarm.idsName}[i] == alarm_id) { slot = (int32_t)i; break; }`)
    lines.push(`        if (slot < 0 && !${alarm.occupiedName}[i]) slot = (int32_t)i;`)
    lines.push(`    }`)
    lines.push(`    if (slot < 0) return false;`)
    lines.push(`    bool added = !${alarm.occupiedName}[slot]; ${alarm.occupiedName}[slot] = true; ${alarm.idsName}[slot] = alarm_id; ${alarm.prioritiesName}[slot] = priority; ${alarm.statesName}[slot] = state; snprintf(${alarm.messagesName}[slot], sizeof(${alarm.messagesName}[slot]), "%s", message); snprintf(${alarm.timestampsName}[slot], sizeof(${alarm.timestampsName}[slot]), "%s", timestamp ? timestamp : ""); if (added) ${alarm.countName}++; ${alarm.refreshName}();`)
    if (alarm.addedHookName) lines.push(`    if (added) ${alarm.addedHookName}(alarm_id, priority);`)
    lines.push(`    return true;`); lines.push(`}`); lines.push(``)
    lines.push(`bool ${alarm.acknowledgeApiName}(int32_t alarm_id) { for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) if (${alarm.occupiedName}[i] && ${alarm.idsName}[i] == alarm_id && ${alarm.statesName}[i] != FG_ALARM_STATE_CLEARED) { if (${alarm.statesName}[i] == FG_ALARM_STATE_ACKNOWLEDGED) return true; ${alarm.statesName}[i] = FG_ALARM_STATE_ACKNOWLEDGED; ${alarm.refreshName}();${alarm.acknowledgedHookName ? ` ${alarm.acknowledgedHookName}(alarm_id);` : ''} return true; } return false; }`)
    lines.push(`bool ${alarm.clearApiName}(int32_t alarm_id) { for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) if (${alarm.occupiedName}[i] && ${alarm.idsName}[i] == alarm_id) { ${alarm.statesName}[i] = FG_ALARM_STATE_CLEARED;${model.autoClear ? ` ${alarm.occupiedName}[i] = false; ${alarm.countName}--;` : ''} ${alarm.refreshName}();${alarm.clearedHookName ? ` ${alarm.clearedHookName}(alarm_id);` : ''} return true; } return false; }`)
    lines.push(`void ${alarm.clearAllApiName}(void) { for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) { ${alarm.occupiedName}[i] = false; ${alarm.statesName}[i] = FG_ALARM_STATE_CLEARED; } ${alarm.countName} = 0; ${alarm.refreshName}(); }`)
    lines.push(`void ${alarm.setEnabledApiName}(bool enabled) { ${alarm.enabledName} = enabled; if (${alarm.rootName}) { if (enabled) lv_obj_remove_state(${alarm.rootName}, LV_STATE_DISABLED); else lv_obj_add_state(${alarm.rootName}, LV_STATE_DISABLED); } }`)
    lines.push(`bool ${alarm.selectApiName}(int32_t alarm_id) { for (uint32_t i = 0; i < ${alarm.capacity}u; ++i) if (${alarm.occupiedName}[i] && ${alarm.idsName}[i] == alarm_id) {${alarm.selectedHookName ? ` ${alarm.selectedHookName}(alarm_id);` : ''} return true; } return false; }`)
    lines.push(``)
  })

  pwmControllerExports.forEach(pwm => {
    lines.push(`static lv_obj_t * ${pwm.rootName} = NULL;`)
    lines.push(`static lv_obj_t * ${pwm.sliderName} = NULL;`)
    lines.push(`static lv_obj_t * ${pwm.valueLabelName} = NULL;`)
    lines.push(`static lv_obj_t * ${pwm.enableName} = NULL;`)
    lines.push(`static float ${pwm.stateName} = ${cFloatLiteral(pwm.initialValue)};`)
    lines.push(`static bool ${pwm.enabledName} = ${pwm.initialEnabled ? 'true' : 'false'};`)
    lines.push(`static bool ${pwm.programmaticName} = false;`)
  })
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
  sliderExports.forEach(sliderExport => {
    lines.push(`static lv_obj_t * ${sliderExport.objectName} = NULL;`)
    lines.push(`static int32_t ${sliderExport.stateName} = ${sliderExport.initialValue};`)
    lines.push(`static bool ${sliderExport.programmaticUpdateName} = false;`)
    lines.push(`static const int32_t ${sliderExport.minimumName} = ${sliderExport.minimum};`)
    lines.push(`static const int32_t ${sliderExport.maximumName} = ${sliderExport.maximum};`)
  })
  spinboxExports.forEach(spinboxExport => {
    lines.push(`static lv_obj_t * ${spinboxExport.objectName} = NULL;`)
    lines.push(`static int32_t ${spinboxExport.stateName} = ${spinboxExport.initialValue};`)
    lines.push(`static bool ${spinboxExport.programmaticUpdateName} = false;`)
    lines.push(`static const int32_t ${spinboxExport.minimumName} = ${spinboxExport.minimum};`)
    lines.push(`static const int32_t ${spinboxExport.maximumName} = ${spinboxExport.maximum};`)
  })
  progressExports.forEach(progressExport => {
    lines.push(`static lv_obj_t * ${progressExport.objectName} = NULL;`)
    lines.push(`static int32_t ${progressExport.stateName} = ${progressExport.initialValue};`)
    lines.push(`static const int32_t ${progressExport.minimumName} = ${progressExport.minimum};`)
    lines.push(`static const int32_t ${progressExport.maximumName} = ${progressExport.maximum};`)
  })
  circularProgressExports.forEach(circularProgressExport => {
    lines.push(`static lv_obj_t * ${circularProgressExport.objectName} = NULL;`)
    lines.push(`static int32_t ${circularProgressExport.stateName} = ${circularProgressExport.initialValue};`)
    lines.push(`static const int32_t ${circularProgressExport.minimumName} = ${circularProgressExport.minimum};`)
    lines.push(`static const int32_t ${circularProgressExport.maximumName} = ${circularProgressExport.maximum};`)
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

  fiIconExports.forEach(fiIconExport => {
    if (!fiIconExport.clickEnabled || !fiIconExport.eventCallbackName || !fiIconExport.hookName) return
    lines.push(`static void ${fiIconExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    if (lv_event_get_code(event) != LV_EVENT_CLICKED) return;`)
    lines.push(`    ${fiIconExport.hookName}();`)
    lines.push(`}`)
    lines.push(``)
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
    lines.push(`static lv_chart_series_t * ${chartExport.warningSeriesName} = NULL;`)
    lines.push(`static lv_chart_series_t * ${chartExport.alarmSeriesName} = NULL;`)
    lines.push(`static const int32_t ${chartExport.minimumName} = ${chartExport.minimum};`)
    lines.push(`static const int32_t ${chartExport.maximumName} = ${chartExport.maximum};`)
    if (chartExport.isPro && chartExport.unitsLabelName && chartExport.thresholdStateName) {
      lines.push(`static lv_obj_t * ${chartExport.unitsLabelName} = NULL;`)
      lines.push(`static lv_obj_t * ${chartExport.valueLabelName} = NULL;`)
      lines.push(`static lv_obj_t * ${chartExport.markerName} = NULL;`)
      lines.push(`static int8_t ${chartExport.thresholdStateName} = 0;`)
      lines.push(`static float ${chartExport.warningStateName} = ${chartExport.warningThreshold}.0f;`)
      lines.push(`static float ${chartExport.alarmStateName} = ${chartExport.alarmThreshold}.0f;`)
    }
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
  if (listExports.size > 0) {
    lines.push(`typedef void (*fg_list_item_hook_t)(uint32_t index, const char * text);`)
    lines.push(`typedef struct { uint32_t index; const char * text; fg_list_item_hook_t hook; } fg_list_item_event_data_t;`)
  }
  listExports.forEach(listExport => {
    listExport.items.forEach((itemText, itemIndex) => {
      lines.push(`static const fg_list_item_event_data_t ${listExport.itemDataNames[itemIndex]} = { ${itemIndex}, "${esc(itemText)}", ${listExport.hookName} };`)
    })
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

  labelTextExports.forEach(labelExport => {
    lines.push(`void ${labelExport.apiName}(const char * text)`)
    lines.push(`{`)
    lines.push(`    if (${labelExport.objectName} == NULL) return;`)
    lines.push(`    if (text == NULL) text = "";`)
    lines.push(`    lv_label_set_text(${labelExport.objectName}, text);`)
    lines.push(`}`)
    lines.push(``)
  })
  qrCodeExports.forEach(qrExport => {
    lines.push(`static lv_obj_t * ${qrExport.objectName} = NULL;`)
  })
  switchExports.forEach(switchExport => {
    lines.push(`static lv_obj_t * ${switchExport.objectName} = NULL;`)
    lines.push(`static bool ${switchExport.programmaticUpdateName} = false;`)
    lines.push(`static void ${switchExport.eventCallbackName}(lv_event_t * event);`)
  })
  checkboxExports.forEach(checkboxExport => {
    lines.push(`static lv_obj_t * ${checkboxExport.objectName} = NULL;`)
    lines.push(`static bool ${checkboxExport.programmaticUpdateName} = false;`)
    lines.push(`static void ${checkboxExport.eventCallbackName}(lv_event_t * event);`)
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
  lines.push(`static lv_obj_t * fg_system_diagnostics_page = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_internal_bar = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_psram_bar = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_internal_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_psram_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_flash_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_performance_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_lvgl_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_wifi_label = NULL;`)
  lines.push(`static lv_obj_t * fg_system_diagnostics_sd_label = NULL;`)
  lines.push(`static lv_timer_t * fg_system_diagnostics_timer = NULL;`)
  lines.push(`static bool fg_system_diagnostics_page_active = false;`)
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
  lines.push(`typedef enum { FG_STORAGE_REQ_REFRESH, FG_STORAGE_REQ_MOUNT, FG_STORAGE_REQ_UNMOUNT, FG_STORAGE_REQ_TEST, FG_STORAGE_REQ_CREATE, FG_STORAGE_REQ_RENAME, FG_STORAGE_REQ_DELETE, FG_STORAGE_REQ_FORMAT, FG_STORAGE_REQ_DELETE_EMPTY_FOLDER, FG_STORAGE_REQ_SHUTDOWN } fg_storage_request_kind_t;`)
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
  lines.push(`static bool fg_system_storage_teardown_requested = false;`)
  lines.push(`static bool fg_system_storage_shutdown_sent = false;`)
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
  lines.push(`static lv_timer_t * fg_system_wifi_timer = NULL;`)
  lines.push(`static bool fg_system_wifi_connected_probe_logged = false;`)
  lines.push(`static uint8_t fg_system_brightness_percent = 100;`)
  lines.push(`static void fg_wifi_tick_cb(lv_timer_t *timer);`)
  lines.push(`static bool fg_system_wifi_create_page(void);`)
  lines.push(`static bool fg_system_wifi_create_password_dialog(void);`)
  lines.push(`static bool fg_system_wifi_create_forget_dialog(void);`)
  lines.push(`static void fg_system_wifi_destroy_ui(void);`)
  lines.push(`static void fg_keyboard_hide(void);`)
  lines.push(`static void fg_keyboard_show_for(lv_obj_t * textarea);`)
  lines.push(`static void fg_keyboard_event_cb(lv_event_t * event);`)
  lines.push(`static lv_obj_t * fg_system_create_button(lv_obj_t * parent, const char * text, int32_t x, int32_t y, int32_t width, int32_t height);`)
  lines.push(`static bool fg_system_storage_create_page(void);`)
  lines.push(`static bool fg_system_storage_create_name_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_delete_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_format_dialog(void);`)
  lines.push(`static bool fg_system_storage_create_delete_folder_dialog(void);`)
  lines.push(`static void fg_system_storage_request_teardown(void);`)
  lines.push(`static void fg_system_storage_finish_teardown(void);`)
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
    lines.push(`static void ${numberInputExport.incrementCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    if (${numberInputExport.objectName} == NULL) return;`)
    lines.push(`    int32_t value = ${numberInputExport.stateName};`)
    lines.push(`    (void)fg_number_input_parse_value(lv_textarea_get_text(${numberInputExport.objectName}), &value);`)
    lines.push(`    int64_t next = (int64_t)value + (int64_t)${numberInputExport.stepName};`)
    lines.push(`    if (next > ${numberInputExport.maximumName}) next = ${numberInputExport.maximumName};`)
    lines.push(`    if (next < ${numberInputExport.minimumName}) next = ${numberInputExport.minimumName};`)
    lines.push(`    if (value == (int32_t)next) return;`)
    lines.push(`    char value_text[16];`)
    lines.push(`    snprintf(value_text, sizeof(value_text), "%ld", (long)next);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = true;`)
    lines.push(`    ${numberInputExport.stateName} = (int32_t)next;`)
    lines.push(`    lv_textarea_set_text(${numberInputExport.objectName}, value_text);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = false;`)
    lines.push(`    ${numberInputExport.hookName}((int32_t)next);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${numberInputExport.decrementCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    if (${numberInputExport.objectName} == NULL) return;`)
    lines.push(`    int32_t value = ${numberInputExport.stateName};`)
    lines.push(`    (void)fg_number_input_parse_value(lv_textarea_get_text(${numberInputExport.objectName}), &value);`)
    lines.push(`    int64_t next = (int64_t)value - (int64_t)${numberInputExport.stepName};`)
    lines.push(`    if (next > ${numberInputExport.maximumName}) next = ${numberInputExport.maximumName};`)
    lines.push(`    if (next < ${numberInputExport.minimumName}) next = ${numberInputExport.minimumName};`)
    lines.push(`    if (value == (int32_t)next) return;`)
    lines.push(`    char value_text[16];`)
    lines.push(`    snprintf(value_text, sizeof(value_text), "%ld", (long)next);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = true;`)
    lines.push(`    ${numberInputExport.stateName} = (int32_t)next;`)
    lines.push(`    lv_textarea_set_text(${numberInputExport.objectName}, value_text);`)
    lines.push(`    ${numberInputExport.programmaticUpdateName} = false;`)
    lines.push(`    ${numberInputExport.hookName}((int32_t)next);`)
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

  sliderExports.forEach(sliderExport => {
    lines.push(`static void ${sliderExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * slider = lv_event_get_current_target(event);`)
    lines.push(`    if (slider != ${sliderExport.objectName} || ${sliderExport.programmaticUpdateName}) return;`)
    lines.push(`    int32_t value = lv_slider_get_value(slider);`)
    lines.push(`    if (${sliderExport.stateName} == value) return;`)
    lines.push(`    ${sliderExport.stateName} = value;`)
    lines.push(`    ${sliderExport.hookName}(value);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${sliderExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${sliderExport.minimumName}) value = ${sliderExport.minimumName};`)
    lines.push(`    if (value > ${sliderExport.maximumName}) value = ${sliderExport.maximumName};`)
    lines.push(`    if (${sliderExport.objectName} == NULL || ${sliderExport.stateName} == value) return;`)
    lines.push(`    ${sliderExport.programmaticUpdateName} = true;`)
    lines.push(`    lv_slider_set_value(${sliderExport.objectName}, value, LV_ANIM_OFF);`)
    lines.push(`    ${sliderExport.stateName} = value;`)
    lines.push(`    ${sliderExport.programmaticUpdateName} = false;`)
    lines.push(`}`)
    lines.push(``)
  })

  dashboardCardExports.forEach(card => {
    if (card.hookName && card.callbackName) {
      lines.push(`static void ${card.callbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    if (lv_event_get_current_target(event) == ${card.rootName}) ${card.hookName}();`)
      lines.push(`}`)
      lines.push(``)
    }
    if (!card.runtimeEnabled) return
    lines.push(`void ${card.titleApiName}(const char * title)`)
    lines.push(`{`)
    lines.push(`    if (${card.titleName}) lv_label_set_text(${card.titleName}, title ? title : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.valueApiName}(const char * value)`)
    lines.push(`{`)
    lines.push(`    if (${card.valueName} == NULL) return;`)
    lines.push(`    lv_label_set_text(${card.valueName}, value ? value : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.descriptionApiName}(const char * description)`)
    lines.push(`{`)
    lines.push(`    if (${card.descriptionName}) lv_label_set_text(${card.descriptionName}, description ? description : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.unitsApiName}(const char * units)`)
    lines.push(`{`)
    lines.push(`    if (${card.unitsName} == NULL) return;`)
    lines.push(`    lv_label_set_text(${card.unitsName}, units ? units : "");`)
    lines.push(`    lv_obj_align_to(${card.unitsName}, ${card.valueName}, LV_ALIGN_OUT_RIGHT_BOTTOM, 6, -2);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.statusApiName}(const char * text, uint32_t rgb)`)
    lines.push(`{`)
    lines.push(`    if (${card.statusName}) lv_label_set_text(${card.statusName}, text ? text : "");`)
    lines.push(`    if (${card.statusIndicatorName}) lv_obj_set_style_bg_color(${card.statusIndicatorName}, lv_color_hex(rgb & 0xFFFFFFu), LV_PART_MAIN);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.progressApiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < 0) value = 0;`)
    lines.push(`    if (value > 100) value = 100;`)
    lines.push(`    if (${card.progressName}) lv_bar_set_value(${card.progressName}, value, LV_ANIM_OFF);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.footerApiName}(const char * footer)`)
    lines.push(`{`)
    lines.push(`    if (${card.footerName}) lv_label_set_text(${card.footerName}, footer ? footer : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${card.colourApiName}(uint32_t rgb)`)
    lines.push(`{`)
    lines.push(`    rgb &= 0xFFFFFFu;`)
    lines.push(`    if (${card.progressName}) lv_obj_set_style_bg_color(${card.progressName}, lv_color_hex(rgb), LV_PART_INDICATOR);`)
    lines.push(`}`)
    lines.push(``)
  })

  sensorTileExports.forEach(tile => {
    if (tile.hookName && tile.callbackName) {
      lines.push(`static void ${tile.callbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    if (lv_event_get_current_target(event) == ${tile.rootName}) ${tile.hookName}();`)
      lines.push(`}`)
      lines.push(``)
    }
    if (!tile.runtimeEnabled) return
    lines.push(`void ${tile.colourApiName}(uint32_t rgb)`)
    lines.push(`{`)
    lines.push(`    rgb &= 0xFFFFFFu;`)
    lines.push(`    if (${tile.iconName}) lv_obj_set_style_text_color(${tile.iconName}, lv_color_hex(rgb), LV_PART_MAIN);`)
    lines.push(`    if (${tile.trendName}) lv_obj_set_style_text_color(${tile.trendName}, lv_color_hex(rgb), LV_PART_MAIN);`)
    lines.push(`    if (${tile.progressName}) lv_obj_set_style_bg_color(${tile.progressName}, lv_color_hex(rgb), LV_PART_INDICATOR);`)
    lines.push(`    if (${tile.statusIndicatorName}) lv_obj_set_style_bg_color(${tile.statusIndicatorName}, lv_color_hex(rgb), LV_PART_MAIN);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tile.valueApiName}(float value)`)
    lines.push(`{`)
    lines.push(`    if (${tile.valueName}) lv_label_set_text_fmt(${tile.valueName}, "%.*f", ${tile.decimals}, (double)value);`)
    lines.push(`    int32_t progress = (int32_t)(((value - ${toCFloatLiteral(tile.rangeMin)}) * 100.0f) / (${toCFloatLiteral(tile.rangeMax)} - ${toCFloatLiteral(tile.rangeMin)}));`)
    lines.push(`    if (progress < 0) progress = 0;`)
    lines.push(`    if (progress > 100) progress = 100;`)
    lines.push(`    if (${tile.progressName}) lv_bar_set_value(${tile.progressName}, progress, LV_ANIM_OFF);`)
    if (tile.autoColour) {
      lines.push(`    uint32_t rgb = 0x22C55Eu;`)
      lines.push(`    if (value <= ${toCFloatLiteral(tile.criticalLow)} || value >= ${toCFloatLiteral(tile.criticalHigh)}) rgb = 0xEF4444u;`)
      lines.push(`    else if (value <= ${toCFloatLiteral(tile.warningLow)} || value >= ${toCFloatLiteral(tile.warningHigh)}) rgb = 0xF59E0Bu;`)
      lines.push(`    ${tile.colourApiName}(rgb);`)
    }
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tile.unitsApiName}(const char * units)`)
    lines.push(`{`)
    lines.push(`    if (${tile.unitsName}) lv_label_set_text(${tile.unitsName}, units ? units : "");`)
    lines.push(`    if (${tile.unitsName} && ${tile.valueName}) lv_obj_align_to(${tile.unitsName}, ${tile.valueName}, LV_ALIGN_OUT_RIGHT_BOTTOM, 6, -2);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tile.statusApiName}(const char * text, uint32_t rgb)`)
    lines.push(`{`)
    lines.push(`    if (${tile.statusName}) lv_label_set_text(${tile.statusName}, text ? text : "");`)
    lines.push(`    if (${tile.statusIndicatorName}) lv_obj_set_style_bg_color(${tile.statusIndicatorName}, lv_color_hex(rgb & 0xFFFFFFu), LV_PART_MAIN);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tile.trendApiName}(int32_t trend)`)
    lines.push(`{`)
    lines.push(`    if (${tile.trendName} == NULL) return;`)
    lines.push(`    lv_label_set_text(${tile.trendName}, trend > 0 ? "^ Rising" : trend < 0 ? "v Falling" : "- Stable");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tile.timestampApiName}(const char * timestamp)`)
    lines.push(`{`)
    lines.push(`    if (${tile.timestampName}) lv_label_set_text(${tile.timestampName}, timestamp ? timestamp : "");`)
    lines.push(`}`)
    lines.push(``)
  })

  relayPanelExports.forEach(panel => {
    if (panel.channelHookName && panel.channelCallbackName) {
      lines.push(`static void ${panel.channelCallbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    if (${panel.programmaticName}) return;`)
      lines.push(`    uint32_t channel = (uint32_t)(uintptr_t)lv_event_get_user_data(event);`)
      lines.push(`    if (channel >= ${panel.channelCount}u || !${panel.enabledName}[channel]) return;`)
      lines.push(`    bool enabled = lv_obj_has_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
      lines.push(`    if (${panel.stateName}[channel] == enabled) return;`)
      lines.push(`    ${panel.stateName}[channel] = enabled;`)
      lines.push(`    ${panel.channelHookName}(channel, enabled);`)
      lines.push(`}`)
      lines.push(``)
    }
    if (panel.masterHookName && panel.masterCallbackName) {
      lines.push(`static void ${panel.masterCallbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    if (${panel.programmaticName} || lv_event_get_current_target(event) != ${panel.masterObjectName}) return;`)
      lines.push(`    bool enabled = lv_obj_has_state(${panel.masterObjectName}, LV_STATE_CHECKED);`)
      lines.push(`    ${panel.programmaticName} = true;`)
      lines.push(`    for (uint32_t channel = 0; channel < ${panel.channelCount}u; ++channel) {`)
      lines.push(`        if (!${panel.enabledName}[channel] || ${panel.channelObjectsName}[channel] == NULL) continue;`)
      lines.push(`        if (enabled) lv_obj_add_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
      lines.push(`        else lv_obj_remove_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
      lines.push(`        ${panel.stateName}[channel] = enabled;`)
      lines.push(`    }`)
      lines.push(`    ${panel.programmaticName} = false;`)
      lines.push(`    ${panel.masterHookName}(enabled);`)
      lines.push(`}`)
      lines.push(``)
    }
    if (!panel.runtimeEnabled) return
    lines.push(`void ${panel.setChannelApiName}(uint32_t channel, bool enabled)`)
    lines.push(`{`)
    lines.push(`    if (channel >= ${panel.channelCount}u || ${panel.channelObjectsName}[channel] == NULL) return;`)
    lines.push(`    ${panel.programmaticName} = true;`)
    lines.push(`    if (enabled) lv_obj_add_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
    lines.push(`    else lv_obj_remove_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
    lines.push(`    ${panel.stateName}[channel] = enabled;`)
    lines.push(`    ${panel.programmaticName} = false;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`bool ${panel.getChannelApiName}(uint32_t channel)`)
    lines.push(`{`)
    lines.push(`    return channel < ${panel.channelCount}u && ${panel.stateName}[channel];`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${panel.setChannelEnabledApiName}(uint32_t channel, bool enabled)`)
    lines.push(`{`)
    lines.push(`    if (channel >= ${panel.channelCount}u || ${panel.channelObjectsName}[channel] == NULL) return;`)
    lines.push(`    ${panel.enabledName}[channel] = enabled;`)
    lines.push(`    if (enabled) lv_obj_remove_state(${panel.channelObjectsName}[channel], LV_STATE_DISABLED);`)
    lines.push(`    else lv_obj_add_state(${panel.channelObjectsName}[channel], LV_STATE_DISABLED);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${panel.setAllApiName}(bool enabled)`)
    lines.push(`{`)
    lines.push(`    ${panel.programmaticName} = true;`)
    lines.push(`    for (uint32_t channel = 0; channel < ${panel.channelCount}u; ++channel) {`)
    lines.push(`        if (!${panel.enabledName}[channel] || ${panel.channelObjectsName}[channel] == NULL) continue;`)
    lines.push(`        if (enabled) lv_obj_add_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
    lines.push(`        else lv_obj_remove_state(${panel.channelObjectsName}[channel], LV_STATE_CHECKED);`)
    lines.push(`        ${panel.stateName}[channel] = enabled;`)
    lines.push(`    }`)
    lines.push(`    if (${panel.masterObjectName}) {`)
    lines.push(`        if (enabled) lv_obj_add_state(${panel.masterObjectName}, LV_STATE_CHECKED);`)
    lines.push(`        else lv_obj_remove_state(${panel.masterObjectName}, LV_STATE_CHECKED);`)
    lines.push(`    }`)
    lines.push(`    ${panel.programmaticName} = false;`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${panel.setLabelApiName}(uint32_t channel, const char * label)`)
    lines.push(`{`)
    lines.push(`    if (channel < ${panel.channelCount}u && ${panel.labelObjectsName}[channel]) lv_label_set_text(${panel.labelObjectsName}[channel], label ? label : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${panel.setStatusApiName}(uint32_t channel, const char * text)`)
    lines.push(`{`)
    lines.push(`    if (channel < ${panel.channelCount}u && ${panel.statusObjectsName}[channel]) lv_label_set_text(${panel.statusObjectsName}[channel], text ? text : "");`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${panel.setMasterApiName}(bool enabled)`)
    lines.push(`{`)
    lines.push(`    ${panel.setAllApiName}(enabled);`)
    lines.push(`}`)
    lines.push(``)
  })

  pwmControllerExports.forEach(pwm => {
    const scale = cFloatLiteral(pwm.scale)
    if (pwm.valueHookName && pwm.valueCallbackName) {
      lines.push(`static void ${pwm.valueCallbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    LV_UNUSED(event); if (${pwm.programmaticName} || ${pwm.sliderName} == NULL) return;`)
      lines.push(`    float value = (float)lv_slider_get_value(${pwm.sliderName}) / ${scale};`)
      lines.push(`    value = roundf((value - ${cFloatLiteral(pwm.minimum)}) / ${cFloatLiteral(pwm.step)}) * ${cFloatLiteral(pwm.step)} + ${cFloatLiteral(pwm.minimum)};`)
      lines.push(`    if (value < ${cFloatLiteral(pwm.minimum)})`)
      lines.push(`    {`)
      lines.push(`        value = ${cFloatLiteral(pwm.minimum)};`)
      lines.push(`    }`)
      lines.push(`    if (value > ${cFloatLiteral(pwm.maximum)})`)
      lines.push(`    {`)
      lines.push(`        value = ${cFloatLiteral(pwm.maximum)};`)
      lines.push(`    }`)
      lines.push(`    ${pwm.stateName} = value;`)
      lines.push(`    if (${pwm.valueLabelName}) lv_label_set_text_fmt(${pwm.valueLabelName}, "%.6g ${escPrintfLiteral(pwm.unit)}", (double)value);`)
      lines.push(`    ${pwm.valueHookName}(value);`)
      lines.push(`}`); lines.push(``)
    }
    if (pwm.enabledHookName && pwm.enabledCallbackName) {
      lines.push(`static void ${pwm.enabledCallbackName}(lv_event_t * event)`)
      lines.push(`{`)
      lines.push(`    LV_UNUSED(event); if (${pwm.programmaticName} || ${pwm.enableName} == NULL) return;`)
      lines.push(`    ${pwm.enabledName} = lv_obj_has_state(${pwm.enableName}, LV_STATE_CHECKED);`)
      lines.push(`    if (${pwm.sliderName}) { if (${pwm.enabledName}) lv_obj_remove_state(${pwm.sliderName}, LV_STATE_DISABLED); else lv_obj_add_state(${pwm.sliderName}, LV_STATE_DISABLED); }`)
      lines.push(`    ${pwm.enabledHookName}(${pwm.enabledName});`)
      lines.push(`}`); lines.push(``)
    }
    if (!pwm.runtimeEnabled) return
    lines.push(`void ${pwm.setValueApiName}(float value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${cFloatLiteral(pwm.minimum)})`)
    lines.push(`    {`)
    lines.push(`        value = ${cFloatLiteral(pwm.minimum)};`)
    lines.push(`    }`)
    lines.push(`    if (value > ${cFloatLiteral(pwm.maximum)})`)
    lines.push(`    {`)
    lines.push(`        value = ${cFloatLiteral(pwm.maximum)};`)
    lines.push(`    }`)
    lines.push(`    value = roundf((value - ${cFloatLiteral(pwm.minimum)}) / ${cFloatLiteral(pwm.step)}) * ${cFloatLiteral(pwm.step)} + ${cFloatLiteral(pwm.minimum)};`)
    lines.push(`    ${pwm.programmaticName} = true;`)
    lines.push(`    ${pwm.stateName} = value;`)
    lines.push(`    if (${pwm.sliderName}) lv_slider_set_value(${pwm.sliderName}, (int32_t)lroundf(value * ${scale}), LV_ANIM_OFF);`)
    lines.push(`    if (${pwm.valueLabelName}) lv_label_set_text_fmt(${pwm.valueLabelName}, "%.6g ${escPrintfLiteral(pwm.unit)}", (double)value);`)
    lines.push(`    ${pwm.programmaticName} = false;`)
    lines.push(`}`); lines.push(``)
    lines.push(`float ${pwm.getValueApiName}(void) { return ${pwm.stateName}; }`); lines.push(``)
    lines.push(`void ${pwm.setEnabledApiName}(bool enabled)`)
    lines.push(`{`)
    lines.push(`    ${pwm.programmaticName} = true; ${pwm.enabledName} = enabled;`)
    lines.push(`    if (${pwm.enableName}) { if (enabled) lv_obj_add_state(${pwm.enableName}, LV_STATE_CHECKED); else lv_obj_remove_state(${pwm.enableName}, LV_STATE_CHECKED); }`)
    lines.push(`    if (${pwm.sliderName}) { if (enabled) lv_obj_remove_state(${pwm.sliderName}, LV_STATE_DISABLED); else lv_obj_add_state(${pwm.sliderName}, LV_STATE_DISABLED); }`)
    lines.push(`    ${pwm.programmaticName} = false;`)
    lines.push(`}`); lines.push(``)
    lines.push(`bool ${pwm.getEnabledApiName}(void) { return ${pwm.enabledName}; }`); lines.push(``)
  })

  spinboxExports.forEach(spinboxExport => {
    const syncName = `${spinboxExport.objectName}_sync_user_value`
    lines.push(`static void ${syncName}(void)`)
    lines.push(`{`)
    lines.push(`    if (${spinboxExport.objectName} == NULL || ${spinboxExport.programmaticUpdateName}) return;`)
    lines.push(`    int32_t value = lv_spinbox_get_value(${spinboxExport.objectName});`)
    lines.push(`    if (${spinboxExport.stateName} == value) return;`)
    lines.push(`    ${spinboxExport.stateName} = value;`)
    lines.push(`    ${spinboxExport.hookName}(value);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${spinboxExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    ${syncName}();`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${spinboxExport.incrementCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    if (${spinboxExport.objectName} == NULL) return;`)
    lines.push(`    lv_spinbox_increment(${spinboxExport.objectName});`)
    lines.push(`    ${syncName}();`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${spinboxExport.decrementCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    if (${spinboxExport.objectName} == NULL) return;`)
    lines.push(`    lv_spinbox_decrement(${spinboxExport.objectName});`)
    lines.push(`    ${syncName}();`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${spinboxExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${spinboxExport.minimumName}) value = ${spinboxExport.minimumName};`)
    lines.push(`    if (value > ${spinboxExport.maximumName}) value = ${spinboxExport.maximumName};`)
    lines.push(`    if (${spinboxExport.objectName} == NULL || ${spinboxExport.stateName} == value) return;`)
    lines.push(`    ${spinboxExport.programmaticUpdateName} = true;`)
    lines.push(`    lv_spinbox_set_value(${spinboxExport.objectName}, value);`)
    lines.push(`    ${spinboxExport.stateName} = value;`)
    lines.push(`    ${spinboxExport.programmaticUpdateName} = false;`)
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

  circularProgressExports.forEach(circularProgressExport => {
    lines.push(`void ${circularProgressExport.apiName}(int32_t value)`)
    lines.push(`{`)
    lines.push(`    if (value < ${circularProgressExport.minimumName}) value = ${circularProgressExport.minimumName};`)
    lines.push(`    if (value > ${circularProgressExport.maximumName}) value = ${circularProgressExport.maximumName};`)
    lines.push(`    if (${circularProgressExport.objectName} == NULL || ${circularProgressExport.stateName} == value) return;`)
    lines.push(`    lv_arc_set_value(${circularProgressExport.objectName}, value);`)
    lines.push(`    ${circularProgressExport.stateName} = value;`)
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

  qrCodeExports.forEach(qrExport => {
    lines.push(`void ${qrExport.apiName}(const char * text)`)
    lines.push(`{`)
    lines.push(`    if (${qrExport.objectName} == NULL) return;`)
    lines.push(`    const char * qr_text = text == NULL ? "" : text;`)
    lines.push(`    lv_qrcode_update(${qrExport.objectName}, qr_text, strlen(qr_text));`)
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
    lines.push(`void ${chartExport.addApiName}(float value)`)
    lines.push(`{`)
    lines.push(`    if (${chartExport.objectName} == NULL || ${chartExport.seriesName} == NULL) return;`)
    lines.push(`    if (value < ${chartExport.minimumName}) value = ${chartExport.minimumName};`)
    lines.push(`    if (value > ${chartExport.maximumName}) value = ${chartExport.maximumName};`)
    lines.push(`    lv_chart_set_next_value(${chartExport.objectName}, ${chartExport.seriesName}, (int32_t)value);`)
    lines.push(`    lv_chart_refresh(${chartExport.objectName});`)
    if (chartExport.isPro && chartExport.valueLabelName) {
      lines.push(`    char value_text[32];`)
      lines.push(`    snprintf(value_text, sizeof(value_text), "%.*f", ${chartExport.decimalPlaces ?? 0}, (double)value);`)
      lines.push(`    if (${chartExport.valueLabelName}) lv_label_set_text(${chartExport.valueLabelName}, value_text);`)
      if (chartExport.markerName) {
        lines.push(`    if (${chartExport.markerName}) {`)
        lines.push(`        int32_t marker_y = lv_obj_get_content_height(${chartExport.objectName}) - (int32_t)((value - ${chartExport.minimumName}) * lv_obj_get_content_height(${chartExport.objectName}) / (${chartExport.maximumName} - ${chartExport.minimumName}));`)
        lines.push(`        lv_obj_set_pos(${chartExport.markerName}, lv_obj_get_content_width(${chartExport.objectName}) - 8, marker_y - 4);`)
        lines.push(`    }`)
      }
    }
    if (chartExport.isPro && chartExport.thresholdStateName) {
      lines.push(`    int8_t next_state = value >= ${chartExport.alarmStateName} ? 2 : (value >= ${chartExport.warningStateName} ? 1 : 0);`)
      if (chartExport.enableUserEvents) {
        lines.push(`    if (next_state != ${chartExport.thresholdStateName}) {`)
        if (chartExport.warningHookName) lines.push(`        if (next_state == 1) ${chartExport.warningHookName}();`)
        if (chartExport.alarmHookName) lines.push(`        else if (next_state == 2) ${chartExport.alarmHookName}();`)
        if (chartExport.recoveredHookName) lines.push(`        else ${chartExport.recoveredHookName}();`)
        lines.push(`    }`)
      }
      lines.push(`    ${chartExport.thresholdStateName} = next_state;`)
    }
    lines.push(`    ${chartExport.pointAddedHookName}(value);`)
    lines.push(`}`)
    lines.push(``)
    if (chartExport.isPro && chartExport.unitsApiName && chartExport.unitsLabelName) {
      lines.push(`void ${chartExport.unitsApiName}(const char * units)`)
      lines.push(`{`)
      lines.push(`    if (${chartExport.unitsLabelName}) lv_label_set_text(${chartExport.unitsLabelName}, units ? units : "");`)
      lines.push(`}`)
      lines.push(``)
    }
    lines.push(`void ${chartExport.warningApiName}(float value)`)
    lines.push(`{`)
    lines.push(`    if (${chartExport.objectName} == NULL || ${chartExport.warningSeriesName} == NULL) return;`)
    lines.push(`    if (value < ${chartExport.minimumName}) value = ${chartExport.minimumName};`)
    lines.push(`    if (value > ${chartExport.maximumName}) value = ${chartExport.maximumName};`)
    lines.push(`    lv_chart_set_all_value(${chartExport.objectName}, ${chartExport.warningSeriesName}, (int32_t)value);`)
    if (chartExport.warningStateName) lines.push(`    ${chartExport.warningStateName} = value;`)
    lines.push(`    lv_chart_refresh(${chartExport.objectName});`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${chartExport.alarmApiName}(float value)`)
    lines.push(`{`)
    lines.push(`    if (${chartExport.objectName} == NULL || ${chartExport.alarmSeriesName} == NULL) return;`)
    lines.push(`    if (value < ${chartExport.minimumName}) value = ${chartExport.minimumName};`)
    lines.push(`    if (value > ${chartExport.maximumName}) value = ${chartExport.maximumName};`)
    lines.push(`    lv_chart_set_all_value(${chartExport.objectName}, ${chartExport.alarmSeriesName}, (int32_t)value);`)
    if (chartExport.alarmStateName) lines.push(`    ${chartExport.alarmStateName} = value;`)
    lines.push(`    lv_chart_refresh(${chartExport.objectName});`)
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

  lines.push(`static void fg_window_close_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    lv_obj_t * window = (lv_obj_t *)lv_event_get_user_data(event);`)
  lines.push(`    if (window) lv_obj_add_flag(window, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`}`)
  lines.push(``)

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

  if (listExports.size > 0) {
    lines.push(`static void fg_list_item_clicked_cb(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    const fg_list_item_event_data_t * data = lv_event_get_user_data(event);`)
    lines.push(`    if (data == NULL || data->hook == NULL) return;`)
    lines.push(`    data->hook(data->index, data->text);`)
    lines.push(`}`)
    lines.push(``)
  }

  buttonExports.forEach(buttonExport => {
    lines.push(`static void ${buttonExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    LV_UNUSED(event);`)
    lines.push(`    ${buttonExport.hookName}();`)
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
    lines.push(`static void ${tileViewExport.transitionName}(uint32_t column, uint32_t row, bool from_user)`)
    lines.push(`{`)
    lines.push(`    if (${tileViewExport.objectName} == NULL || ${tileViewExport.columnCountName} == 0 || ${tileViewExport.rowCountName} == 0) return;`)
    lines.push(`    if (column >= ${tileViewExport.columnCountName}) column = ${tileViewExport.columnCountName} - 1;`)
    lines.push(`    if (row >= ${tileViewExport.rowCountName}) row = ${tileViewExport.rowCountName} - 1;`)
    lines.push(`    if (column == ${tileViewExport.selectedColumnName} && row == ${tileViewExport.selectedRowName}) return;`)
    lines.push(`    lv_obj_t * tile = ${tileViewExport.tilesName}[column][row];`)
    lines.push(`    if (tile == NULL) return;`)
    lines.push(`    ${tileViewExport.selectedColumnName} = column;`)
    lines.push(`    ${tileViewExport.selectedRowName} = row;`)
    lines.push(`    if (!from_user) lv_tileview_set_tile(${tileViewExport.objectName}, tile, LV_ANIM_OFF);`)
    lines.push(`    if (from_user) ${tileViewExport.hookName}(column, row);`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`static void ${tileViewExport.eventCallbackName}(lv_event_t * event)`)
    lines.push(`{`)
    lines.push(`    lv_obj_t * tileview = lv_event_get_current_target(event);`)
    lines.push(`    if (tileview != ${tileViewExport.objectName}) return;`)
    lines.push(`    lv_obj_t * selected_tile = lv_tileview_get_tile_active(tileview);`)
    lines.push(`    if (selected_tile == NULL) return;`)
    lines.push(`    for (uint32_t column = 0; column < ${tileViewExport.columnCountName}; ++column) {`)
    lines.push(`        for (uint32_t row = 0; row < ${tileViewExport.rowCountName}; ++row) {`)
    lines.push(`            if (${tileViewExport.tilesName}[column][row] == selected_tile) {`)
    lines.push(`                ${tileViewExport.transitionName}(column, row, true);`)
    lines.push(`                return;`)
    lines.push(`            }`)
    lines.push(`        }`)
    lines.push(`    }`)
    lines.push(`}`)
    lines.push(``)
    lines.push(`void ${tileViewExport.apiName}(uint32_t column, uint32_t row)`)
    lines.push(`{`)
    lines.push(`    ${tileViewExport.transitionName}(column, row, false);`)
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
  lines.push(`    if (!page || !fg_application_page) return;`)
  lines.push(`    if (fg_application_page) lv_obj_add_flag(fg_application_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_launcher_page) lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_brightness_page) lv_obj_add_flag(fg_system_brightness_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_wifi_page) lv_obj_add_flag(fg_system_wifi_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_storage_page) lv_obj_add_flag(fg_system_storage_page, LV_OBJ_FLAG_HIDDEN);`)
  lines.push(`    if (fg_system_diagnostics_page) lv_obj_add_flag(fg_system_diagnostics_page, LV_OBJ_FLAG_HIDDEN);`)
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
  lines.push(`    fg_system_diagnostics_page_active = false;`)
  lines.push(`    fg_system_show_page(fg_application_page);`)
  lines.push(`    fg_ram_probe_log("13 after returning to the application page");`)
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
  lines.push(`    if (!fg_system_wifi_create_page()) return;`)
  lines.push(`    fg_system_wifi_page_active = true;`)
  lines.push(`    fg_wifi_tick_cb(NULL);`)
  lines.push(`    fg_system_show_page(fg_system_wifi_page);`)
  lines.push(`    fg_ram_probe_log("12 after opening the Manager");`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_wifi_back_cb(lv_event_t * event)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(event);`)
  lines.push(`    fg_system_wifi_page_active = false;`)
  lines.push(`    fg_system_show_page(fg_system_launcher_page);`)
  lines.push(`    fg_system_wifi_destroy_ui();`)
  lines.push(`    fg_ram_probe_log("14 after closing the Manager");`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_request(fg_storage_request_kind_t kind, const char * path, const char * name)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_teardown_requested || fg_system_storage_pending || !fg_system_storage_page) return false;`)
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
  lines.push(`        if (request.kind == FG_STORAGE_REQ_SHUTDOWN) break;`)
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
  lines.push(`    fg_system_storage_task = NULL;`)
  lines.push(`    vTaskDelete(NULL);`)
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
  lines.push(`    if (fg_system_storage_teardown_requested) { fg_system_storage_request_teardown(); return; }`)
  lines.push(`    LV_UNUSED(timer); if (!fg_system_storage_mutex) return;`)
  lines.push(`    xSemaphoreTake(fg_system_storage_mutex, portMAX_DELAY); fg_system_storage_projection = fg_system_storage_result; xSemaphoreGive(fg_system_storage_mutex);`)
  lines.push(`    fg_storage_result_model_t * model_ptr = &fg_system_storage_projection;`)
  lines.push(`    #define model (*model_ptr)`)
  lines.push(`    if (model.generation == fg_system_storage_consumed_generation) return;`)
  lines.push(`    fg_system_storage_consumed_generation = model.generation; fg_system_storage_pending = false;`)
  lines.push(`    if (fg_system_storage_teardown_requested) { fg_system_storage_request_teardown(); return; }`)
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
  lines.push(`static void fg_system_open_storage_cb(lv_event_t * event) { LV_UNUSED(event); if (fg_system_storage_teardown_requested) return; if (!fg_system_storage_initialized && !fg_system_storage_create_page()) return; fg_system_show_page(fg_system_storage_page); if (!fg_system_storage_summary || !fg_system_storage_refresh_button || !fg_system_storage_test_button) return; (void)fg_system_storage_request(FG_STORAGE_REQ_REFRESH, fg_system_storage_current_path, NULL); fg_ram_probe_log("15 after opening Storage Browser"); }`)
  lines.push(`static void fg_system_storage_back_cb(lv_event_t * event) { LV_UNUSED(event); fg_keyboard_hide(); fg_system_show_page(fg_system_launcher_page); fg_system_storage_teardown_requested = true; fg_system_storage_request_teardown(); }`)
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
  lines.push(`        if (!fg_system_wifi_create_password_dialog()) return;`)
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
  lines.push(`    if (!fg_system_wifi_create_forget_dialog()) return;`)
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
  lines.push(`static const char * fg_diagnostics_bytes(uint64_t value, char * buffer, size_t length)`)
  lines.push(`{`)
  lines.push(`    static const char * units[] = {"B", "KB", "MB", "GB"};`)
  lines.push(`    double scaled = (double)value; unsigned unit = 0;`)
  lines.push(`    while (scaled >= 1024.0 && unit < 3) { scaled /= 1024.0; ++unit; }`)
  lines.push(`    snprintf(buffer, length, scaled >= 10.0 || unit == 0 ? "%.0f %s" : "%.1f %s", scaled, units[unit]);`)
  lines.push(`    return buffer;`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_diagnostics_update_bar(lv_obj_t * bar, size_t free_bytes, size_t total_bytes)`)
  lines.push(`{`)
  lines.push(`    if (!bar) return;`)
  lines.push(`    int32_t used = total_bytes > 0 ? (int32_t)(100U - ((uint64_t)free_bytes * 100U / total_bytes)) : 0;`)
  lines.push(`    lv_bar_set_value(bar, used, LV_ANIM_OFF);`)
  lines.push(`    uint32_t colour = used >= 90 ? ${palette.healthCritical} : (used >= 75 ? ${palette.healthHigh} : ${palette.healthNormal});`)
  lines.push(`    lv_obj_set_style_bg_color(bar, lv_color_hex(colour), LV_PART_INDICATOR);`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_diagnostics_tick_cb(lv_timer_t * timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer); if (!fg_system_diagnostics_page_active) return;`)
  lines.push(`    int64_t started = esp_timer_get_time(); fg_diagnostics_snapshot_t model; char a[24], b[24], c[24], d[24], e[24], f[24];`)
  lines.push(`    fg_diagnostics_get_snapshot(&model);`)
  lines.push(`    fg_diagnostics_update_bar(fg_system_diagnostics_internal_bar, model.internal_free, model.internal_total);`)
  lines.push(`    fg_diagnostics_update_bar(fg_system_diagnostics_psram_bar, model.psram_free, model.psram_total);`)
  lines.push(`    lv_label_set_text_fmt(fg_system_diagnostics_internal_label, "Free  %s\\nTotal  %s\\nMinimum Ever Free  %s", fg_diagnostics_bytes(model.internal_free, a, sizeof(a)), fg_diagnostics_bytes(model.internal_total, b, sizeof(b)), fg_diagnostics_bytes(model.internal_minimum_free, c, sizeof(c)));`)
  lines.push(`    lv_label_set_text_fmt(fg_system_diagnostics_psram_label, "Free  %s\\nTotal  %s\\nMinimum Ever Free  %s", fg_diagnostics_bytes(model.psram_free, a, sizeof(a)), fg_diagnostics_bytes(model.psram_total, b, sizeof(b)), fg_diagnostics_bytes(model.psram_minimum_free, c, sizeof(c)));`)
  lines.push(`    if (model.flash_available) lv_label_set_text_fmt(fg_system_diagnostics_flash_label, "Used  %s\\nFree  %s\\nTotal  %s\\nApplication Size  %s\\nSPIFFS Used  %s\\nSPIFFS Free  %s", model.flash_usage_available ? fg_diagnostics_bytes(model.flash_used, a, sizeof(a)) : "Not Available", model.flash_usage_available ? fg_diagnostics_bytes(model.flash_free, b, sizeof(b)) : "Not Available", fg_diagnostics_bytes(model.flash_total, c, sizeof(c)), model.application_size_available ? fg_diagnostics_bytes(model.application_size, d, sizeof(d)) : "Not Available", model.spiffs_available ? fg_diagnostics_bytes(model.spiffs_used, e, sizeof(e)) : "Not Available", model.spiffs_available ? fg_diagnostics_bytes(model.spiffs_free, f, sizeof(f)) : "Not Available"); else lv_label_set_text(fg_system_diagnostics_flash_label, "Used  Not Available\\nFree  Not Available\\nTotal  Not Available\\nApplication Size  Not Available\\nSPIFFS Used  Not Available\\nSPIFFS Free  Not Available");`)
  lines.push(`    if (model.fps_available) snprintf(a, sizeof(a), "%u", (unsigned)model.fps);`)
  lines.push(`    lv_label_set_text_fmt(fg_system_diagnostics_performance_label, "FPS  %s\\nLVGL Tick Rate  %u Hz\\nUI Update Time  %u us\\nCPU Frequency  %u MHz\\nSystem Uptime  %llu s\\nBuild Version  %s", model.fps_available ? a : "Not Available", (unsigned)model.lvgl_tick_rate_hz, (unsigned)model.ui_update_time_us, (unsigned)model.cpu_frequency_mhz, (unsigned long long)model.uptime_seconds, model.build_version);`)
  lines.push(`    if (model.framebuffer_count_available) snprintf(a, sizeof(a), "%u", (unsigned)model.framebuffer_count);`)
  lines.push(`    if (model.lvgl_display_available) lv_label_set_text_fmt(fg_system_diagnostics_lvgl_label, "LVGL Version  %s\\nFramebuffer Count  %s\\nResolution  %u x %u\\nTheme  ${esc(themeId)}\\nCurrent Screen  Diagnostics\\nObject Count  %u", model.lvgl_version, model.framebuffer_count_available ? a : "Not Available", (unsigned)model.horizontal_resolution, (unsigned)model.vertical_resolution, (unsigned)model.object_count); else lv_label_set_text(fg_system_diagnostics_lvgl_label, "LVGL  Not Available");`)
  lines.push(`    lv_label_set_text_fmt(fg_system_diagnostics_wifi_label, "Connected  %s\\nSSID  %s\\nRSSI  %d dBm\\nIP Address  %s", model.wifi_connected ? "Yes" : "No", model.wifi_ssid[0] ? model.wifi_ssid : "Not Available", model.wifi_rssi, model.wifi_ip[0] ? model.wifi_ip : "Not Available");`)
  lines.push(`    if (model.sd_available) { if (model.sd_files_available) snprintf(c, sizeof(c), "%u", (unsigned)model.sd_files); lv_label_set_text_fmt(fg_system_diagnostics_sd_label, "Mounted  %s\\nCapacity  %s\\nFree Space  %s\\nFiles  %s", model.sd_mounted ? "Yes" : "No", fg_diagnostics_bytes(model.sd_capacity, a, sizeof(a)), fg_diagnostics_bytes(model.sd_free, b, sizeof(b)), model.sd_files_available ? c : "Not Available"); } else lv_label_set_text(fg_system_diagnostics_sd_label, "Mounted  Not Available\\nCapacity  Not Available\\nFree Space  Not Available\\nFiles  Not Available");`)
  lines.push(`    fg_diagnostics_record_ui_update_us((uint32_t)(esp_timer_get_time() - started));`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_open_diagnostics_cb(lv_event_t * event)`)
  lines.push(`{ LV_UNUSED(event); fg_system_diagnostics_page_active = true; fg_system_diagnostics_tick_cb(NULL); fg_system_show_page(fg_system_diagnostics_page); }`)
  lines.push(`static void fg_system_diagnostics_back_cb(lv_event_t * event)`)
  lines.push(`{ LV_UNUSED(event); fg_system_diagnostics_page_active = false; fg_system_show_page(fg_system_launcher_page); }`)
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
  lines.push(`static void fg_system_storage_request_teardown(void)`)
  lines.push(`{`)
  lines.push(`    if (!fg_system_storage_teardown_requested || fg_system_storage_pending) return;`)
  lines.push(`    if (fg_system_storage_task) {`)
  lines.push(`        if (fg_system_storage_shutdown_sent) return;`)
  lines.push(`        if (!fg_system_storage_queue) return;`)
  lines.push(`        fg_storage_request_t request = { .kind = FG_STORAGE_REQ_SHUTDOWN };`)
  lines.push(`        if (xQueueSend(fg_system_storage_queue, &request, 0) == pdTRUE) fg_system_storage_shutdown_sent = true;`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(`    fg_system_storage_finish_teardown();`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static void fg_system_storage_finish_teardown(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_task) return;`)
  lines.push(`    fg_keyboard_hide();`)
  lines.push(`    if (fg_system_wifi_keyboard) lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);`)
  lines.push(`    if (fg_system_storage_name_dialog) lv_obj_delete(fg_system_storage_name_dialog);`)
  lines.push(`    fg_system_storage_name_dialog = NULL; fg_system_storage_name_input = NULL; fg_system_storage_name_title = NULL; fg_system_storage_name_error = NULL;`)
  lines.push(`    if (fg_system_storage_delete_dialog) lv_obj_delete(fg_system_storage_delete_dialog);`)
  lines.push(`    fg_system_storage_delete_dialog = NULL; fg_system_storage_delete_text = NULL;`)
  lines.push(`    if (fg_system_storage_format_dialog) lv_obj_delete(fg_system_storage_format_dialog);`)
  lines.push(`    fg_system_storage_format_dialog = NULL; fg_system_storage_format_input = NULL; fg_system_storage_format_error = NULL;`)
  lines.push(`    if (fg_system_storage_delete_folder_dialog) lv_obj_delete(fg_system_storage_delete_folder_dialog);`)
  lines.push(`    fg_system_storage_delete_folder_dialog = NULL; fg_system_storage_delete_folder_text = NULL; fg_system_storage_delete_folder_input = NULL; fg_system_storage_delete_folder_error = NULL;`)
  lines.push(`    if (fg_system_storage_page) lv_obj_delete(fg_system_storage_page);`)
  lines.push(`    fg_system_storage_page = NULL; fg_system_storage_summary = NULL; fg_system_storage_path = NULL; fg_system_storage_list = NULL; fg_system_storage_empty = NULL;`)
  lines.push(`    fg_system_storage_parent_button = NULL; fg_system_storage_rename_button = NULL; fg_system_storage_delete_button = NULL; fg_system_storage_refresh_button = NULL; fg_system_storage_test_button = NULL;`)
  lines.push(`    fg_system_storage_previous_button = NULL; fg_system_storage_next_button = NULL; fg_system_storage_select_folder_button = NULL; fg_system_storage_select_folder_label = NULL; fg_system_storage_delete_folder_button = NULL; fg_system_storage_delete_folder_label = NULL;`)
  lines.push(`    for (int i = 0; i < FG_STORAGE_VISIBLE_ROWS; ++i) { fg_system_storage_rows[i] = NULL; fg_system_storage_row_labels[i] = NULL; fg_system_storage_row_metadata[i].valid = false; }`)
  lines.push(`    if (fg_system_storage_queue) { vQueueDelete(fg_system_storage_queue); fg_system_storage_queue = NULL; }`)
  lines.push(`    if (fg_system_storage_mutex) { vSemaphoreDelete(fg_system_storage_mutex); fg_system_storage_mutex = NULL; }`)
  lines.push(`    lv_timer_t * timer = fg_system_storage_timer; fg_system_storage_timer = NULL;`)
  lines.push(`    fg_system_storage_pending = false; fg_system_storage_available = false; fg_system_storage_initialized = false; fg_system_storage_teardown_requested = false; fg_system_storage_shutdown_sent = false;`)
  lines.push(`    fg_system_storage_page_offset = 0; fg_system_storage_selected = -1; fg_system_storage_select_mode = false;`)
  lines.push(`    if (timer) lv_timer_delete(timer);`)
  lines.push(`    fg_ram_probe_log("16 after closing Storage Browser");`)
  lines.push(`}`)
  lines.push(``)
  lines.push(`static bool fg_system_storage_create_page(void)`)
  lines.push(`{`)
  lines.push(`    if (fg_system_storage_initialized) return fg_system_storage_page != NULL;`)
  lines.push(`    fg_system_storage_teardown_requested = false; fg_system_storage_shutdown_sent = false;`)
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
  lines.push(`    if (!fg_system_wifi_connected_probe_logged && fg_wifi_is_connected()) { fg_system_wifi_connected_probe_logged = true; fg_ram_probe_log("17 connected on application page"); }`)
  lines.push(``)
  const runtimeNetworkStatusCards = Array.from(networkStatusCardExports.values()).filter(card => card.runtimeEnabled)
  if (runtimeNetworkStatusCards.length > 0) {
    lines.push(`    fg_wifi_snapshot_t network_card_snapshot;`)
    lines.push(`    bool network_card_snapshot_ready = fg_wifi_get_snapshot(&network_card_snapshot) == FG_WIFI_OP_OK;`)
    lines.push(`    bool network_card_connected = network_card_snapshot_ready && network_card_snapshot.connected;`)
    lines.push(`    int32_t network_card_signal = 0;`)
    lines.push(`    if (network_card_connected) {`)
    lines.push(`        network_card_signal = (network_card_snapshot.rssi + 100) * 2;`)
    lines.push(`        if (network_card_signal < 0) network_card_signal = 0;`)
    lines.push(`        if (network_card_signal > 100) network_card_signal = 100;`)
    lines.push(`    }`)
    runtimeNetworkStatusCards.forEach(card => {
      lines.push(`    FG_Set_${card.stem}_Network_Type(0);`)
      lines.push(`    FG_Set_${card.stem}_Connected(network_card_connected);`)
      lines.push(`    if (network_card_connected) {`)
      lines.push(`        FG_Set_${card.stem}_Network_Name(network_card_snapshot.ssid[0] ? network_card_snapshot.ssid : "--");`)
      lines.push(`        FG_Set_${card.stem}_IP_Address(network_card_snapshot.ip[0] ? network_card_snapshot.ip : "--");`)
      lines.push(`        FG_Set_${card.stem}_Signal_Strength(network_card_signal);`)
      lines.push(`        FG_Set_${card.stem}_Status_Text("Online");`)
      lines.push(`    } else {`)
      lines.push(`        FG_Set_${card.stem}_Network_Name("--");`)
      lines.push(`        FG_Set_${card.stem}_IP_Address("--");`)
      lines.push(`        FG_Set_${card.stem}_Signal_Strength(0);`)
      lines.push(`        FG_Set_${card.stem}_Status_Text("Offline");`)
      lines.push(`    }`)
    })
    lines.push(``)
  }
  lines.push(`    if (fg_system_wifi_password_dialog &&`)
  lines.push(`        !lv_obj_has_flag(fg_system_wifi_password_dialog, LV_OBJ_FLAG_HIDDEN)) return;`)
  lines.push(``)
  if (wifiStatusExports.size > 0) {
    lines.push(`    fg_wifi_snapshot_t widget_snapshot;`)
    lines.push(`    bool widget_snapshot_ready = fg_wifi_get_snapshot(&widget_snapshot) == FG_WIFI_OP_OK;`)
    lines.push(`    const char * widget_status = "Disabled";`)
    lines.push(`    if (widget_snapshot_ready) {`)
    lines.push(`        const char * backend_status = fg_wifi_status_text();`)
    lines.push(`        if (backend_status && (strcmp(backend_status, "INTERNET") == 0 || strcmp(backend_status, "INTERNET_AVAILABLE") == 0)) widget_status = "Internet Available";`)
    lines.push(`        else {`)
    lines.push(`        switch (widget_snapshot.state) {`)
    lines.push(`            case FG_WIFI_STATE_INIT: widget_status = "Starting"; break;`)
    lines.push(`            case FG_WIFI_STATE_READY:`)
    lines.push(`            case FG_WIFI_STATE_DISCONNECTING:`)
    lines.push(`            case FG_WIFI_STATE_DISCONNECTED:`)
    lines.push(`            case FG_WIFI_STATE_SCANNING: widget_status = "Starting"; break;`)
    lines.push(`            case FG_WIFI_STATE_CONNECTING: widget_status = "Connecting"; break;`)
    lines.push(`            case FG_WIFI_STATE_CONNECTED: widget_status = "Connected"; break;`)
    lines.push(`            case FG_WIFI_STATE_ERROR: widget_status = "Failed"; break;`)
    lines.push(`            default: widget_status = "Disabled"; break;`)
    lines.push(`        }`)
    lines.push(`        }`)
    lines.push(`    }`)
    wifiStatusExports.forEach(wifi => {
      lines.push(`    if (${wifi.labelName}) {`)
      lines.push(`        char widget_buf[96];`)
      const format = wifi.displayMode === 'icon-only'
        ? `LV_SYMBOL_WIFI`
        : wifi.displayMode === 'text-only'
          ? `widget_status`
          : `NULL`
      if (format === 'NULL') {
        lines.push(`        snprintf(widget_buf, sizeof(widget_buf), LV_SYMBOL_WIFI " %s", widget_status);`)
      } else {
        lines.push(`        snprintf(widget_buf, sizeof(widget_buf), "%s", ${format});`)
      }
      if (wifi.showSignalStrength) {
        lines.push(`        if (widget_snapshot_ready && widget_snapshot.connected) {`)
        lines.push(`            size_t used = strlen(widget_buf);`)
        lines.push(`            snprintf(widget_buf + used, sizeof(widget_buf) - used, "  %d dBm", widget_snapshot.rssi);`)
        lines.push(`        }`)
      }
      lines.push(`        lv_label_set_text(${wifi.labelName}, widget_buf);`)
      lines.push(`    }`)
    })
  }
  lines.push(``)
  lines.push(`    if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;`)
  if (runtimeNetworkStatusCards.length > 0) {
    lines.push(`    if (!network_card_snapshot_ready) return;`)
    lines.push(`    fg_wifi_snapshot_t snapshot = network_card_snapshot;`)
  } else {
    lines.push(`    fg_wifi_snapshot_t snapshot;`)
    lines.push(`    if (fg_wifi_get_snapshot(&snapshot) != FG_WIFI_OP_OK) return;`)
  }
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

  if (isWeather04Project) {
    weatherRuntimeAssets.forEach(asset => {
      if (asset.cFile) usedAssetSources.add(asset.cFile)
    })
    lines.push(`void FG_Set_Weather_Background_Key(const char * key)`)
    lines.push(`{`)
    lines.push(`    if (!key || !fg_weather_background_image) return;`)
    lines.push(`    if (fg_weather_background_key && strcmp(fg_weather_background_key, key) == 0) return;`)
    lines.push(`    const void * source = NULL;`)
    weatherRuntimeAssets.forEach((asset, index) => {
      lines.push(`    ${index === 0 ? 'if' : 'else if'} (strcmp(key, "${asset.semanticKey}") == 0) source = &${asset.lvgl};`)
    })
    lines.push(`    if (!source) return;`)
    lines.push(`    lv_image_set_src(fg_weather_background_image, source);`)
    lines.push(`    fg_weather_background_key = key;`)
    lines.push(`}`)
    lines.push(``)
  }

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

  if (backgroundMode === 'fullscreen') {
    lines.push(`    ${isWeather04Project ? 'fg_weather_background_image' : 'lv_obj_t * bg_texture_0'} = lv_image_create(fg_application_page);`)
    const backgroundObject = isWeather04Project ? 'fg_weather_background_image' : 'bg_texture_0'
    lines.push(`    lv_image_set_src(${backgroundObject}, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(${backgroundObject}, 0, 0);`)
    lines.push(`    lv_obj_set_size(${backgroundObject}, 1024, 600);`)
    lines.push(`    lv_obj_move_background(${backgroundObject});`)
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
        sliderExports,
        spinboxExports,
        progressExports,
        circularProgressExports,
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
        listExports,
        tabViewExports,
        tileViewExports,
        clockExports,
        wifiStatusExports,
        labelTextExports,
        inputExports,
        switchExports,
        checkboxExports,
        radioExports,
        qrCodeExports,
        buttonExports,
        fiIconExports,
        dashboardCardExports,
        sensorTileExports,
        relayPanelExports,
        pwmControllerExports,
        alarmPanelExports,
        ioMonitorExports,
        batteryCardExports,
        tankLevelCardExports,
        networkStatusCardExports,
        deviceSummaryCardExports,
        kpiCardExports,
        powerFlowCardExports,
      )
  }

body.forEach(line => {
  lines.push(line ? `    ${line}` : ``)
})

lines.push(``)
lines.push(`    fg_ram_probe_log("02 after application page creation");`)
usedAssetSources.add('assets/icons/fg_icon_settings_fi_48px.c')
lines.push(`    LV_IMAGE_DECLARE(fg_icon_settings_fi_48px);`)
lines.push(`    lv_obj_t * system_gear = fg_system_create_button(fg_application_page, "", 948, 18, 58, 58);`)
lines.push(`    lv_obj_set_style_radius(system_gear, LV_RADIUS_CIRCLE, 0);`)
lines.push(`    lv_obj_t * system_gear_label = lv_obj_get_child(system_gear, 0);`)
lines.push(`    lv_obj_add_flag(system_gear_label, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    lv_obj_t * system_gear_icon = lv_image_create(system_gear);`)
lines.push(`    lv_image_set_src(system_gear_icon, &fg_icon_settings_fi_48px);`)
lines.push(`    lv_image_set_scale(system_gear_icon, 149);`)
lines.push(`    lv_obj_set_style_image_recolor(system_gear_icon, lv_color_hex(${palette.accent}), 0);`)
lines.push(`    lv_obj_set_style_image_recolor_opa(system_gear_icon, LV_OPA_COVER, 0);`)
lines.push(`    lv_obj_center(system_gear_icon);`)
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
lines.push(`    lv_obj_t * diagnostics_card = fg_system_create_button(fg_system_launcher_page, LV_SYMBOL_WARNING "\\nDiagnostics", 522, 302, 220, 180);`)
lines.push(`    lv_obj_add_event_cb(diagnostics_card, fg_system_open_diagnostics_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_launcher_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    fg_ram_probe_log("03 after Settings launcher creation");`)
lines.push(``)
lines.push(`    fg_system_diagnostics_page = lv_obj_create(parent);`)
lines.push(`    lv_obj_set_size(fg_system_diagnostics_page, 1024, 600); lv_obj_clear_flag(fg_system_diagnostics_page, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`    lv_obj_set_style_pad_all(fg_system_diagnostics_page, 0, 0); lv_obj_set_style_border_width(fg_system_diagnostics_page, 0, 0);`)
lines.push(`    lv_obj_set_style_bg_color(fg_system_diagnostics_page, lv_color_hex(${palette.bg}), 0);`)
lines.push(`    lv_obj_t * diagnostics_back = fg_system_create_button(fg_system_diagnostics_page, LV_SYMBOL_LEFT " Back", 20, 14, 132, 54);`)
lines.push(`    lv_obj_add_event_cb(diagnostics_back, fg_system_diagnostics_back_cb, LV_EVENT_CLICKED, NULL);`)
lines.push(`    lv_obj_t * diagnostics_title = lv_label_create(fg_system_diagnostics_page); lv_label_set_text(diagnostics_title, "System Diagnostics");`)
lines.push(`    lv_obj_set_style_text_color(diagnostics_title, lv_color_hex(${palette.text}), 0); lv_obj_set_style_text_font(diagnostics_title, &lv_font_montserrat_32, 0); lv_obj_align(diagnostics_title, LV_ALIGN_TOP_MID, 0, 24);`)
lines.push(`    lv_obj_t * diagnostics_live = lv_label_create(fg_system_diagnostics_page); lv_label_set_text(diagnostics_live, "LIVE - 1 s"); lv_obj_set_pos(diagnostics_live, 910, 34); lv_obj_set_style_text_color(diagnostics_live, lv_color_hex(${palette.accent}), 0);`)
lines.push(`    lv_obj_t * diagnostics_content = lv_obj_create(fg_system_diagnostics_page); lv_obj_set_pos(diagnostics_content, 20, 82); lv_obj_set_size(diagnostics_content, 984, 500);`)
lines.push(`    lv_obj_set_style_bg_opa(diagnostics_content, LV_OPA_TRANSP, 0); lv_obj_set_style_border_width(diagnostics_content, 0, 0); lv_obj_set_style_pad_all(diagnostics_content, 0, 0);`)
lines.push(`    lv_obj_set_scroll_dir(diagnostics_content, LV_DIR_VER);`)
lines.push(`    const char * diagnostics_headings[7] = {"Internal RAM", "PSRAM", "Flash Storage", "Performance", "LVGL Information", "Wi-Fi Status", "SD Card"};`)
lines.push(`    const int32_t diagnostics_x[7] = {0, 492, 0, 492, 0, 492, 0}; const int32_t diagnostics_y[7] = {0, 0, 160, 160, 430, 430, 700}; const int32_t diagnostics_h[7] = {145, 145, 255, 255, 255, 255, 190};`)
lines.push(`    lv_obj_t * diagnostics_values[7] = {0};`)
lines.push(`    for (int index = 0; index < 7; ++index) {`)
lines.push(`        lv_obj_t * card = lv_obj_create(diagnostics_content); lv_obj_set_pos(card, diagnostics_x[index], diagnostics_y[index]); lv_obj_set_size(card, 472, diagnostics_h[index]); lv_obj_clear_flag(card, LV_OBJ_FLAG_SCROLLABLE);`)
lines.push(`        lv_obj_set_style_radius(card, 14, 0); lv_obj_set_style_bg_color(card, lv_color_hex(${palette.surface}), 0); lv_obj_set_style_border_color(card, lv_color_hex(${palette.surfaceBorder}), 0);`)
lines.push(`        lv_obj_t * heading = lv_label_create(card); lv_label_set_text(heading, diagnostics_headings[index]); lv_obj_set_pos(heading, 12, 8); lv_obj_set_style_text_font(heading, &lv_font_montserrat_20, 0); lv_obj_set_style_text_color(heading, lv_color_hex(${palette.text}), 0);`)
lines.push(`        diagnostics_values[index] = lv_label_create(card); lv_label_set_text(diagnostics_values[index], "Not Available"); lv_obj_set_pos(diagnostics_values[index], 12, index < 2 ? 68 : 42); lv_obj_set_width(diagnostics_values[index], 438); lv_obj_set_style_text_color(diagnostics_values[index], lv_color_hex(${palette.textSecondary}), 0);`)
lines.push(`        if (index < 2) { lv_obj_t * bar = lv_bar_create(card); lv_obj_set_pos(bar, 12, 40); lv_obj_set_size(bar, 438, 18); lv_bar_set_range(bar, 0, 100); lv_obj_set_style_bg_color(bar, lv_color_hex(${palette.surface2}), LV_PART_MAIN); if (index == 0) fg_system_diagnostics_internal_bar = bar; else fg_system_diagnostics_psram_bar = bar; }`)
lines.push(`    }`)
lines.push(`    fg_system_diagnostics_internal_label = diagnostics_values[0]; fg_system_diagnostics_psram_label = diagnostics_values[1]; fg_system_diagnostics_flash_label = diagnostics_values[2]; fg_system_diagnostics_performance_label = diagnostics_values[3];`)
lines.push(`    fg_system_diagnostics_lvgl_label = diagnostics_values[4]; fg_system_diagnostics_wifi_label = diagnostics_values[5]; fg_system_diagnostics_sd_label = diagnostics_values[6];`)
lines.push(`    fg_diagnostics_init(); fg_system_diagnostics_timer = lv_timer_create(fg_system_diagnostics_tick_cb, 1000, NULL);`)
lines.push(`    lv_obj_add_flag(fg_system_diagnostics_page, LV_OBJ_FLAG_HIDDEN);`)
lines.push(`    fg_ram_probe_log("05 after Diagnostics page creation");`)
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
  lines.push(`#if !FG_FEATURE_DIAGNOSTICS`)
  lines.push(`    lv_sysmon_hide_performance(NULL);`)
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
lines.push(`    fg_ram_probe_log("07 after Wi-Fi Manager page creation");`)
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
lines.push(`    fg_ram_probe_log("08 after Wi-Fi password dialog creation");`)
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
lines.push(`    fg_ram_probe_log("09 after Wi-Fi forget dialog creation");`)
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
lines.push(`    fg_ram_probe_log("04 after Brightness page creation");`)
lines.push(``)
clockExports.forEach(clockExport => {
  lines.push(`    ${clockExport.tickCallbackName}(NULL);`)
  lines.push(`    ${clockExport.timerName} = lv_timer_create(${clockExport.tickCallbackName}, 1000, NULL);`)
})
if (clockExports.size > 0) lines.push(``)
lines.push(`    fg_wifi_tick_cb(NULL);`)
lines.push(`    if (!fg_system_wifi_timer) fg_system_wifi_timer = lv_timer_create(fg_wifi_tick_cb, 1000, NULL);`)
lines.push(`    fg_ram_probe_log("10 after Wi-Fi timer creation");`)

lines.push(`}`)

  const takeGeneratedBlock = (
    startLine: string,
    endBeforeLine: string,
  ) => {
    const start = lines.indexOf(startLine)
    const end = lines.indexOf(endBeforeLine, start)
    if (start < 0 || end < 0 || end <= start) {
      throw new Error(`Unable to extract generated lifecycle block: ${startLine}`)
    }
    return lines.splice(start, end - start)
  }
  const wifiLifecycleBlock = takeGeneratedBlock(
    `    fg_system_wifi_page = lv_obj_create(parent);`,
    `    fg_system_brightness_page = lv_obj_create(parent);`,
  )
  const passwordStart = wifiLifecycleBlock.indexOf(
    `    fg_system_wifi_password_dialog = lv_obj_create(parent);`,
  )
  const forgetStart = wifiLifecycleBlock.indexOf(
    `    fg_system_wifi_forget_dialog = lv_obj_create(parent);`,
  )
  if (passwordStart < 0 || forgetStart <= passwordStart) {
    throw new Error('Unable to split generated Wi-Fi lifecycle blocks')
  }
  const wifiPageBlock = wifiLifecycleBlock.slice(0, passwordStart)
  const wifiPasswordBlock = wifiLifecycleBlock.slice(
    passwordStart,
    forgetStart,
  )
  const wifiForgetBlock = wifiLifecycleBlock.slice(forgetStart)
  const lifecycleInsertion = lines.indexOf(
    `// ForgeUI LVGL Export Proof V1`,
  )
  if (lifecycleInsertion < 0) {
    throw new Error('Unable to insert generated Wi-Fi lifecycle helpers')
  }
  const lifecycleRoot = (line: string) =>
    line.replace(/\bparent\b/g, 'fg_system_root')
  lines.splice(lifecycleInsertion, 0,
    `static bool fg_system_wifi_create_page(void)`,
    `{`,
    `    if (fg_system_wifi_page) return true;`,
    `    if (!fg_system_root) return false;`,
    ...wifiPageBlock.map(lifecycleRoot),
    `    return fg_system_wifi_page != NULL;`,
    `}`,
    ``,
    `static bool fg_system_wifi_create_password_dialog(void)`,
    `{`,
    `    if (fg_system_wifi_password_dialog) return true;`,
    `    if (!fg_system_root) return false;`,
    ...wifiPasswordBlock.map(lifecycleRoot),
    `    return fg_system_wifi_password_dialog != NULL;`,
    `}`,
    ``,
    `static bool fg_system_wifi_create_forget_dialog(void)`,
    `{`,
    `    if (fg_system_wifi_forget_dialog) return true;`,
    `    if (!fg_system_root) return false;`,
    ...wifiForgetBlock.map(lifecycleRoot),
    `    return fg_system_wifi_forget_dialog != NULL;`,
    `}`,
    ``,
    `static void fg_system_wifi_destroy_ui(void)`,
    `{`,
    `    fg_keyboard_hide();`,
    `    if (fg_system_wifi_keyboard) lv_keyboard_set_textarea(fg_system_wifi_keyboard, NULL);`,
    `    if (fg_system_wifi_password_dialog) lv_obj_delete(fg_system_wifi_password_dialog);`,
    `    fg_system_wifi_password_dialog = NULL;`,
    `    fg_system_wifi_password_input = NULL;`,
    `    fg_system_wifi_password_title = NULL;`,
    `    fg_system_wifi_password_error = NULL;`,
    `    if (fg_system_wifi_forget_dialog) lv_obj_delete(fg_system_wifi_forget_dialog);`,
    `    fg_system_wifi_forget_dialog = NULL;`,
    `    if (fg_system_wifi_page) lv_obj_delete(fg_system_wifi_page);`,
    `    fg_system_wifi_page = NULL;`,
    `    fg_system_wifi_state_label = NULL;`,
    `    fg_system_wifi_ssid_label = NULL;`,
    `    fg_system_wifi_ip_label = NULL;`,
    `    fg_system_wifi_gateway_label = NULL;`,
    `    fg_system_wifi_rssi_label = NULL;`,
    `    fg_system_wifi_security_label = NULL;`,
    `    fg_system_wifi_raw_label = NULL;`,
    `    fg_system_wifi_scan_label = NULL;`,
    `    fg_system_wifi_network_container = NULL;`,
    `    fg_system_wifi_network_empty_label = NULL;`,
    `    fg_system_wifi_scan_button = NULL;`,
    `    fg_system_wifi_disconnect_button = NULL;`,
    `    fg_system_wifi_reconnect_button = NULL;`,
    `    fg_system_wifi_forget_button = NULL;`,
    `    fg_system_wifi_details_card = NULL;`,
    `    fg_system_wifi_details_label = NULL;`,
    `    for (int i = 0; i < FG_WIFI_MAX_SCAN; ++i) {`,
    `        fg_system_wifi_network_rows[i] = NULL;`,
    `        fg_system_wifi_network_labels[i] = NULL;`,
    `    }`,
    `    fg_system_wifi_network_count = 0;`,
    `    fg_system_wifi_selected = -1;`,
    `}`,
    ``,
  )

  const declaredImages = new Set<string>()
  const ungatedCode = lines.filter(line => {
    const declaration = line.match(
      /LV_IMAGE_DECLARE\(([A-Za-z_][A-Za-z0-9_]*)\)/,
    )
    if (!declaration) return true
    if (declaredImages.has(declaration[1])) return false
    declaredImages.add(declaration[1])
    return true
  }).join('\n')
  const gated = gateForgeUIGeneratedSystemCode(
    ungatedCode,
    options?.firmwareFeatures,
  )
  if (!gated.usesSettingsAsset) {
    usedAssetSources.delete('assets/icons/fg_icon_settings_fi_48px.c')
  }
  const normalizedAssetSources = new Map<string, string>()
  usedAssetSources.forEach(source => {
    const normalized = source.replace(/\\/g, '/').replace(/\/+/g, '/')
    const segments = normalized.split('/')
    const canonicalSegments: string[] = []
    segments.forEach(segment => {
      if (!segment || segment === '.') return
      if (segment === '..' && canonicalSegments.length > 0) {
        canonicalSegments.pop()
        return
      }
      canonicalSegments.push(segment)
    })
    const canonical = canonicalSegments.join('/')
    if (!normalizedAssetSources.has(canonical)) {
      normalizedAssetSources.set(canonical, canonical)
    }
  })

  const fiRuntime = generateFiRuntimeFiles(
    fiIconExports,
    `#${palette.textPrimary.slice(2)}`,
  )

    return {
    code: gated.code,
    fiRuntimeHeader: fiRuntime.header,
    fiRuntimeSource: fiRuntime.source,
    assetSources: Array.from(normalizedAssetSources.values()),
    userEventHooks: Array.from(userEventHooks),
    userEventContracts: Array.from(chartExports.values()).flatMap(chartExport => [
      { name: chartExport.pointAddedHookName, parameters: 'float value' },
      { name: chartExport.clearedHookName, parameters: 'void' },
      ...(chartExport.enableUserEvents ? [
        { name: chartExport.warningHookName!, parameters: 'void' },
        { name: chartExport.alarmHookName!, parameters: 'void' },
        { name: chartExport.recoveredHookName!, parameters: 'void' },
      ] : []),
    ]).concat(Array.from(alarmPanelExports.values()).filter(alarm => alarm.eventsEnabled).flatMap(alarm => [
      { name: alarm.addedHookName!, parameters: 'int32_t alarm_id, FG_Alarm_Priority priority' },
      { name: alarm.acknowledgedHookName!, parameters: 'int32_t alarm_id' },
      { name: alarm.clearedHookName!, parameters: 'int32_t alarm_id' },
      { name: alarm.selectedHookName!, parameters: 'int32_t alarm_id' },
    ])).concat(Array.from(ioMonitorExports.values()).filter(io => io.eventsEnabled).map(io => ({
      name: io.selectedHookName!, parameters: 'const char * channel, FG_IO_Type io_type',
    }))),
    publicApiDeclarations: Array.from(binaryOutputExports.values())
      .filter(lightExport => lightExport.ready)
      .map(lightExport =>
        `void ${lightExport.apiName}(bool enabled);`,
      ).concat(Array.from(ledExports.values()).map(
        ledExport => `void ${ledExport.apiName}(bool on);`,
      )).concat(Array.from(dashboardCardExports.values()).filter(card => card.runtimeEnabled).flatMap(card => [
        `void ${card.titleApiName}(const char * title);`,
        `void ${card.valueApiName}(const char * value);`,
        `void ${card.unitsApiName}(const char * units);`,
        `void ${card.descriptionApiName}(const char * description);`,
        `void ${card.statusApiName}(const char * text, uint32_t rgb);`,
        `void ${card.progressApiName}(int32_t value);`,
        `void ${card.footerApiName}(const char * footer);`,
        `void ${card.colourApiName}(uint32_t rgb);`,
      ])).concat(Array.from(sensorTileExports.values()).filter(tile => tile.runtimeEnabled).flatMap(tile => [
        `void ${tile.valueApiName}(float value);`,
        `void ${tile.unitsApiName}(const char * units);`,
        `void ${tile.statusApiName}(const char * text, uint32_t rgb);`,
        `void ${tile.trendApiName}(int32_t trend);`,
        `void ${tile.timestampApiName}(const char * timestamp);`,
        `void ${tile.colourApiName}(uint32_t rgb);`,
      ])).concat(Array.from(relayPanelExports.values()).filter(panel => panel.runtimeEnabled).flatMap(panel => [
        `void ${panel.setChannelApiName}(uint32_t channel, bool enabled);`,
        `bool ${panel.getChannelApiName}(uint32_t channel);`,
        `void ${panel.setChannelEnabledApiName}(uint32_t channel, bool enabled);`,
        `void ${panel.setAllApiName}(bool enabled);`,
        `void ${panel.setLabelApiName}(uint32_t channel, const char * label);`,
        `void ${panel.setStatusApiName}(uint32_t channel, const char * text);`,
        `void ${panel.setMasterApiName}(bool enabled);`,
      ])).concat(Array.from(pwmControllerExports.values()).filter(pwm => pwm.runtimeEnabled).flatMap(pwm => [
        `void ${pwm.setValueApiName}(float value);`,
        `float ${pwm.getValueApiName}(void);`,
        `void ${pwm.setEnabledApiName}(bool enabled);`,
        `bool ${pwm.getEnabledApiName}(void);`,
      ])).concat(alarmPanelExports.size > 0 ? [
        'typedef enum { FG_ALARM_PRIORITY_LOW = 0, FG_ALARM_PRIORITY_MEDIUM = 1, FG_ALARM_PRIORITY_HIGH = 2, FG_ALARM_PRIORITY_CRITICAL = 3 } FG_Alarm_Priority;',
        'typedef enum { FG_ALARM_STATE_NORMAL = 0, FG_ALARM_STATE_WARNING = 1, FG_ALARM_STATE_ALARM = 2, FG_ALARM_STATE_ACKNOWLEDGED = 3, FG_ALARM_STATE_CLEARED = 4 } FG_Alarm_State;',
      ] : []).concat(Array.from(alarmPanelExports.values()).filter(alarm => alarm.runtimeEnabled).flatMap(alarm => [
        `bool ${alarm.addApiName}(int32_t alarm_id, const char * message, const char * timestamp, FG_Alarm_Priority priority, FG_Alarm_State state);`,
        `bool ${alarm.acknowledgeApiName}(int32_t alarm_id);`,
        `bool ${alarm.clearApiName}(int32_t alarm_id);`,
        `void ${alarm.clearAllApiName}(void);`,
        `void ${alarm.setEnabledApiName}(bool enabled);`,
        `bool ${alarm.selectApiName}(int32_t alarm_id);`,
      ])).concat(ioMonitorExports.size > 0 ? [
        'typedef enum { FG_IO_DIGITAL_INPUT = 0, FG_IO_DIGITAL_OUTPUT = 1, FG_IO_ANALOG_INPUT = 2, FG_IO_ANALOG_OUTPUT = 3 } FG_IO_Type;',
      ] : []).concat(Array.from(ioMonitorExports.values()).filter(io => io.runtimeEnabled).flatMap(io => [
        `bool ${io.setDigitalInputApiName}(const char * channel, bool state);`,
        `bool ${io.setDigitalOutputApiName}(const char * channel, bool state);`,
        `bool ${io.setAnalogInputApiName}(const char * channel, float value);`,
        `bool ${io.setAnalogOutputApiName}(const char * channel, float value);`,
      ])).concat(Array.from(batteryCardExports.values()).filter(b => b.runtimeEnabled).flatMap(b => [
        `void FG_Set_${b.stem}_Percentage(float value);`, `void FG_Set_${b.stem}_Voltage(float value);`, `void FG_Set_${b.stem}_Current(float value);`,
        `void FG_Set_${b.stem}_Charging(bool enabled);`, `void FG_Set_${b.stem}_Health(int32_t value);`,
        `void FG_Set_${b.stem}_Runtime(int32_t value);`, `void FG_Set_${b.stem}_Temperature(float value);`,
      ])).concat(Array.from(tankLevelCardExports.values()).filter(t => t.runtimeEnabled).flatMap(t => [
        `void FG_Set_${t.stem}_Level(float percent);`, `void FG_Set_${t.stem}_Volume(float value);`,
        `void FG_Set_${t.stem}_Capacity(float value);`, `void FG_Set_${t.stem}_Units(const char * units);`,
        `void FG_Set_${t.stem}_LowLevel(float value);`, `void FG_Set_${t.stem}_HighLevel(float value);`,
      ])).concat(Array.from(networkStatusCardExports.values()).filter(n=>n.runtimeEnabled).flatMap(n=>[
        `void FG_Set_${n.stem}_Connected(bool connected);`, `void FG_Set_${n.stem}_Network_Name(const char * name);`,
        `void FG_Set_${n.stem}_IP_Address(const char * ip);`, `void FG_Set_${n.stem}_Signal_Strength(int32_t percent);`,
        `void FG_Set_${n.stem}_Status_Text(const char * value);`, `void FG_Set_${n.stem}_Network_Type(int32_t value);`,
      ])).concat(Array.from(deviceSummaryCardExports.values()).filter(d=>d.runtimeEnabled).flatMap(d=>[
        `void FG_Set_${d.stem}_Device_Name(const char * name);`, `void FG_Set_${d.stem}_Status(int32_t value);`,
        `void FG_Set_${d.stem}_Uptime(const char * value);`, `void FG_Set_${d.stem}_Firmware_Version(const char * value);`,
        `void FG_Set_${d.stem}_Network_Status(const char * value);`, `void FG_Set_${d.stem}_Storage_Status(const char * value);`,
      ])).concat(Array.from(kpiCardExports.values()).filter(k=>k.runtimeEnabled).flatMap(k=>[
        `void FG_Set_${k.stem}_Value(const char * value);`, `void FG_Set_${k.stem}_Unit(const char * value);`,
        `void FG_Set_${k.stem}_Secondary_Text(const char * value);`, `void FG_Set_${k.stem}_Trend_Text(const char * value);`,
        `void FG_Set_${k.stem}_Trend_State(int32_t value);`, `void FG_Set_${k.stem}_Status(int32_t value);`,
        `void FG_Set_${k.stem}_Target_Text(const char * value);`,
      ])).concat(Array.from(powerFlowCardExports.values()).filter(p=>p.runtimeEnabled).flatMap(p=>[
        `void FG_Set_${p.stem}_Grid_Value(const char * value);`, `void FG_Set_${p.stem}_Grid_Flow(int32_t value);`,
        `void FG_Set_${p.stem}_Solar_Value(const char * value);`, `void FG_Set_${p.stem}_Solar_Flow(int32_t value);`,
        `void FG_Set_${p.stem}_Battery_Value(const char * value);`, `void FG_Set_${p.stem}_Battery_Flow(int32_t value);`,
        `void FG_Set_${p.stem}_Load_Value(const char * value);`,
      ])).concat(Array.from(barExports.values()).map(
        barExport => `void ${barExport.apiName}(int32_t value);`,
      )).concat(Array.from(progressExports.values()).map(
        progressExport => `void ${progressExport.apiName}(int32_t value);`,
      )).concat(Array.from(circularProgressExports.values()).map(
        circularProgressExport =>
          `void ${circularProgressExport.apiName}(int32_t value);`,
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
      )).concat(Array.from(sliderExports.values()).map(
        sliderExport => `void ${sliderExport.apiName}(int32_t value);`,
      )).concat(Array.from(spinboxExports.values()).map(
        spinboxExport => `void ${spinboxExport.apiName}(int32_t value);`,
      )).concat(Array.from(chartExports.values()).flatMap(
        chartExport => [
          `void ${chartExport.addApiName}(float value);`,
          `void ${chartExport.clearApiName}(void);`,
          `void ${chartExport.warningApiName}(float value);`,
          `void ${chartExport.alarmApiName}(float value);`,
          ...(chartExport.unitsApiName ? [`void ${chartExport.unitsApiName}(const char * units);`] : []),
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
      )).concat(Array.from(labelTextExports.values()).map(
        labelExport =>
          `void ${labelExport.apiName}(const char * text);`,
      )).concat(Array.from(qrCodeExports.values()).map(
        qrExport =>
          `void ${qrExport.apiName}(const char * text);`,
      )).concat(Array.from(switchExports.values()).map(
        switchExport =>
          `void ${switchExport.apiName}(bool checked);`,
      )).concat(Array.from(checkboxExports.values()).map(
        checkboxExport =>
          `void ${checkboxExport.apiName}(bool checked);`,
      )).concat(Array.from(radioExports.values()).map(
        radioExport =>
          `void ${radioExport.apiName}(bool selected);`,
      )).concat(isWeather04Project ? [
        'void FG_Set_Weather_Background_Key(const char * key);',
      ] : []),
  }
}
