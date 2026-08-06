import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { FORGEUI_NETWORK_STATUS_CARD_DEFAULT_SIZE } from '~forgeui/ForgeUINetworkStatusCard'
import { FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE } from '~forgeui/ForgeUIDeviceSummaryCard'
import { FORGEUI_TANK_LEVEL_CARD_DEFAULT_SIZE } from '~forgeui/ForgeUITankLevelCard'
import { FORGEUI_BATTERY_CARD_DEFAULT_SIZE } from '~forgeui/ForgeUIBatteryCard'
import { FORGEUI_KPI_CARD_DEFAULT_SIZE } from '~forgeui/ForgeUIKpiCard'

import {
  BadgeProps,
  BoxProps,
  ButtonProps,
  IconProps,
  IconButtonProps,
  ImageProps,
  ProgressProps,
  AvatarGroupProps,
  AvatarProps,
  CheckboxProps,
  LinkProps,
  SpinnerProps,
  CloseButtonProps,
  HeadingProps,
  TagProps,
  SimpleGridProps,
  SwitchProps,
  AlertProps,
  FlexProps,
  StackProps,
  AccordionProps,
  AccordionButtonProps,
  AccordionItemProps,
  FormControlProps,
  TabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabsProps,
  InputProps,
  AspectRatioProps,
  BreadcrumbItemProps,
  EditableProps,
  NumberInputProps,
  RadioProps,
  SelectProps,
  RadioGroupProps,
  InputGroupProps,
  GridProps,
  CenterProps,
  ContainerProps,
  AvatarBadgeProps,
  CircularProgressProps,
  TextProps,
  DividerProps,
  CodeProps,
  TextareaProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AccordionPanelProps,
  FormLabelProps,
  FormErrorMessageProps,
  TabProps,
  BreadcrumbLinkProps,
  ListProps,
  HighlightProps,
  KbdProps,
  StatProps,
  StatGroupProps,
  StatHelpTextProps,
  StatLabelProps,
  StatNumberProps,
  StatArrowProps,
  SkeletonProps,
} from '@chakra-ui/react'

import iconsList from '~iconsList'
import { DEFAULT_FORGEUI_SPANS } from '~forgeui/ForgeUIClosureWidgets'
import { DEFAULT_FORGEUI_MENU_PAGES } from '~forgeui/ForgeUIMenu'

type ForgeUICanvasProps = {
  positionMode?: string
  x?: number
  y?: number
  w?: number
  h?: number
  imageScale?: number
  imageFit?: 'contain' | 'cover' | 'native'
  enableClick?: boolean
  generateRuntimeApi?: boolean
  pressedColor?: string
  pressedOpacity?: number
  visible?: boolean
}

type PropsWithForm<T> = T & ForgeUICanvasProps & { form?: T }

type PreviewDefaultProps = {
  Badge?: PropsWithForm<BadgeProps>
  Box?: PropsWithForm<BoxProps>
  Button?: PropsWithForm<ButtonProps> & { buttonText?: string }
  Icon?: PropsWithForm<IconProps> & { icon: keyof typeof iconsList }
  IconButton?: PropsWithForm<IconButtonProps>
  Image?: PropsWithForm<ImageProps>
  Text?: PropsWithForm<TextProps> & { textValue?: string }
  Span?: PropsWithForm<BoxProps> & { spans?: any[]; textAlign?: string; overflow?: string }
  AnimImage?: PropsWithForm<BoxProps> & { frameAssetIds?: string[]; frameDuration?: number; loop?: boolean; autoStart?: boolean }
  ImageButton?: PropsWithForm<BoxProps> & { releasedAssetId?: string; pressedAssetId?: string; disabledAssetId?: string; isDisabled?: boolean }
  Progress?: PropsWithForm<ProgressProps>
  Bar?: PropsWithForm<ProgressProps>
  Arc?: PropsWithForm<ProgressProps>
  Chart?: PropsWithForm<BoxProps> & Record<string, any>
  TrendChartPro?: PropsWithForm<BoxProps> & Record<string, any>
  AlarmPanel?: PropsWithForm<BoxProps> & Record<string, any>
  IOMonitor?: PropsWithForm<BoxProps> & Record<string, any>
  BatteryCard?: PropsWithForm<BoxProps> & Record<string, any>
  TankLevelCard?: PropsWithForm<BoxProps> & Record<string, any>
  NetworkStatusCard?: PropsWithForm<BoxProps> & Record<string, any>
  DeviceSummaryCard?: PropsWithForm<BoxProps> & Record<string, any>
  KpiCard?: PropsWithForm<BoxProps> & Record<string, any>
  AvatarBadge?: PropsWithForm<AvatarBadgeProps>
  AvatarGroup?: PropsWithForm<Omit<AvatarGroupProps, 'children'>>
  Avatar?: PropsWithForm<AvatarProps>
  Checkbox?: PropsWithForm<CheckboxProps>
  Link?: PropsWithForm<LinkProps>
  Spinner?: PropsWithForm<SpinnerProps>
  CloseButton?: PropsWithForm<CloseButtonProps>
  Divider?: PropsWithForm<DividerProps>
  Code?: PropsWithForm<CodeProps>
  Textarea?: PropsWithForm<TextareaProps>
  CircularProgress?: PropsWithForm<CircularProgressProps>
  Heading?: PropsWithForm<HeadingProps> & { headingText?: string }
  Clock?: PropsWithForm<TextProps> & {
    hourFormat?: '24' | '12'
    showSeconds?: boolean
    blinkSeparator?: boolean
  }
  WiFi?: PropsWithForm<TextProps> & {
    displayMode?: 'icon-text' | 'icon-only' | 'text-only'
    showSignalStrength?: boolean
    previewState?: 'disabled' | 'starting' | 'connecting' | 'connected' | 'internet' | 'failed'
  }
  QRCode?: PropsWithForm<BoxProps> & {
    contentType?: 'text' | 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'custom'
    qrText?: string
    qrUrl?: string
    qrWifiSSID?: string
    qrWifiPassword?: string
    qrWifiSecurity?: 'WPA' | 'WEP' | 'None'
    qrWifiHidden?: boolean
    qrEmailAddress?: string
    qrEmailSubject?: string
    qrEmailMessage?: string
    qrPhoneNumber?: string
    qrSmsPhoneNumber?: string
    qrSmsMessage?: string
    qrForeground?: string
    qrBackground?: string
  }
  Highlight?: PropsWithForm<HighlightProps>
  Tag?: PropsWithForm<TagProps>
  SimpleGrid?: PropsWithForm<SimpleGridProps>
  Switch?: PropsWithForm<SwitchProps>
  Alert?: PropsWithForm<AlertProps>
  AlertIcon?: PropsWithForm<AlertIconProps>
  AlertTitle?: PropsWithForm<AlertTitleProps>
  AlertDescription?: PropsWithForm<AlertDescriptionProps>
  Flex?: PropsWithForm<FlexProps>
  Stack?: PropsWithForm<StackProps>
  Accordion?: PropsWithForm<Omit<AccordionProps, 'children'>>
  AccordionButton?: PropsWithForm<AccordionButtonProps>
  AccordionItem?: PropsWithForm<Omit<AccordionItemProps, 'children'>>
  Stat?: PropsWithForm<Omit<StatProps, 'children'>>
  StatGroup?: PropsWithForm<Omit<StatGroupProps, 'children'>>
  StatLabel?: PropsWithForm<StatLabelProps>
  StatNumber?: PropsWithForm<StatNumberProps>
  StatHelpText?: PropsWithForm<StatHelpTextProps>
  StatArrow?: PropsWithForm<StatArrowProps>
  AccordionPanel?: PropsWithForm<AccordionPanelProps>
  AccordionIcon?: PropsWithForm<IconProps>
  FormControl?: PropsWithForm<FormControlProps>
  FormLabel?: PropsWithForm<FormLabelProps>
  FormHelperText?: PropsWithForm<TextProps>
  FormErrorMessage?: PropsWithForm<FormErrorMessageProps>
  Grid?: PropsWithForm<GridProps>
  TabList?: PropsWithForm<TabListProps>
  TabPanel?: PropsWithForm<TabPanelProps>
  TabPanels?: PropsWithForm<TabPanelsProps>
  Tab?: PropsWithForm<TabProps>
  Tabs?: PropsWithForm<TabsProps>
  Select?: PropsWithForm<SelectProps & { children: JSX.Element }>
  Input?: PropsWithForm<InputProps>
  InputGroup?: PropsWithForm<InputGroupProps>
  InputLeftAddon?: PropsWithForm<any>
  InputRightAddon?: PropsWithForm<any>
  InputLeftElement?: PropsWithForm<any>
  InputRightElement?: PropsWithForm<any>
  AspectRatio?: PropsWithForm<AspectRatioProps>
  Breadcrumb?: PropsWithForm<BreadcrumbItemProps>
  BreadcrumbItem?: PropsWithForm<BreadcrumbItemProps>
  BreadcrumbLink?: PropsWithForm<BreadcrumbLinkProps>
  Editable?: PropsWithForm<EditableProps>
  Menu?: PropsWithForm<any>
  NumberInput?: PropsWithForm<NumberInputProps>
  Spinbox?: PropsWithForm<any>
  Radio?: PropsWithForm<RadioProps>
  RadioGroup?: PropsWithForm<RadioGroupProps>
  List?: PropsWithForm<ListProps> & {
    title?: string
    items?: string
    itemHeight?: number
  }
  ListIcon?: PropsWithForm<IconProps>
  ListItem?: PropsWithForm<any>
  Center?: PropsWithForm<CenterProps>
  Container?: PropsWithForm<ContainerProps>
  Kbd?: PropsWithForm<KbdProps>
  Skeleton?: PropsWithForm<SkeletonProps>
  SkeletonCircle?: PropsWithForm<SkeletonProps>
  SkeletonText?: PropsWithForm<SkeletonProps>
}

export const DEFAULT_PROPS: PreviewDefaultProps = {
  AlertDescription: {
    children: 'Alert description',
  },
  AlertTitle: {
    children: 'Alert title',
    mr: 1,
    fontWeight: 'bold',
  },
  AvatarBadge: {
    bg: 'green.500',
    boxSize: '1.25rem',
    borderColor: 'white',
  },
  AvatarGroup: {
    spacing: -3,
    max: 3,
    size: 'md',
    form: {
      display: 'flex',
    },
  },
  Badge: {
    children: 'Badge name',
    variant: 'subtle',
  },
  Breadcrumb: {
    form: {
      separator: '/',
    },
  },
  BreadcrumbLink: {
    children: 'Lorem Ipsum',
  },
  Button: {
    buttonText: 'Button text',
    variant: 'solid',
    size: 'md',
  },
  Checkbox: {
    children: '',
    isReadOnly: true,
    isChecked: false,
  },
  CircularProgress: {
    size: '48px',
    value: 60,
    min: 0,
    max: 100,
  },
  CloseButton: {
    size: 'md',
  },
  Code: {
    children: 'Code value',
  },
  Divider: { borderColor: 'blackAlpha.500' },
  Flex: {
    form: {
      display: 'flex',
    },
  },
  FormLabel: { children: 'Label' },
  FormHelperText: {
    children: 'Helper message',
  },
  FormErrorMessage: {
    children: 'Error message',
  },
  Grid: {
    templateColumns: 'repeat(5, 1fr)',
    gap: 6,
    form: {
      display: 'grid',
    },
  },
  Heading: {
    headingText: 'Heading title',
  },
  Clock: {
     children: '12:34',
     hourFormat: '24',
     showSeconds: false,
     blinkSeparator: true,
     positionMode: 'absolute',
     x: 40,
     y: 40,
     w: 160,
     h: 60,
},
WiFi: {
    displayMode: 'icon-text',
    showSignalStrength: false,
    previewState: 'failed',
    positionMode: 'absolute',
    x: 40,
    y: 120,
    w: 220,
    h: 90,
  },
  Highlight: {
    children: 'Heading title',
    query: 'title',
  },
    Icon: {
      icon: 'FiSettings',
      enableClick: false,
      generateRuntimeApi: true,
      pressedColor: '',
      pressedOpacity: 75,
    },
  IconButton: {
    'aria-label': 'icon',
    // @ts-ignore
    icon: 'FiSettings',
    size: 'md',
    isDisabled: false,
  },
  Image: {
  height: '100px',
  width: '100px',
  imageScale: 256,
  imageFit: 'contain',
  objectFit: 'contain',
  opacity: 1,
  visible: true,
  },
  Span: {
    spans: DEFAULT_FORGEUI_SPANS.map(span => ({ ...span })),
    textAlign: 'left', overflow: 'ellipsis', positionMode: 'absolute', x: 40, y: 40, w: 280, h: 90,
  },
  AnimImage: { frameAssetIds: [], frameDuration: 250, loop: true, autoStart: true, generateRuntimeApi: true, positionMode: 'absolute', x: 40, y: 40, w: 160, h: 160 },
  ImageButton: { releasedAssetId: '', pressedAssetId: '', disabledAssetId: '', isDisabled: false, generateRuntimeApi: true, enableClick: true, positionMode: 'absolute', x: 40, y: 40, w: 96, h: 64 },
  Window: {
    title: 'Window', titleAlign: 'left', titleIcon: 'FiLayout', showIcon: true,
    headerHeight: 48, headerBackground: '#172033', headerTextColor: '#F8FAFC', headerPadding: 12,
    showCloseButton: true, actionButtons: [], buttonSize: 32, buttonSpacing: 6,
    contentBackground: '#0F172A', contentPadding: 8, scrollingEnabled: true,
    scrollbarMode: 'auto', childClipping: true, borderWidth: 1,
    borderColor: '#334155', cornerRadius: 10, visible: true, opacity: 1,
    positionMode: 'absolute', x: 40, y: 40, w: 420, h: 300,
  },
  Menu: {
    pages: DEFAULT_FORGEUI_MENU_PAGES.map(page => ({ ...page, sections: page.sections.map(section => ({ ...section, items: section.items.map(item => ({ ...item })) })) })),
    rootPageId: 'main', headerMode: 'top-fixed', rootBackButton: false,
    background: '#0F172A', headerBackground: '#172033', selectedBackground: '#164E63',
    textColor: '#F8FAFC', secondaryTextColor: '#94A3B8', padding: 4,
    borderWidth: 1, borderColor: '#334155', cornerRadius: 10,
    positionMode: 'absolute', x: 40, y: 40, w: 420, h: 420,
  },
  DashboardCard: {
    nativeWidgetSchemaVersion: 1,
      title: 'System Output', icon: '', value: '72', units: '%',
      secondaryText: 'Operating level', status: 'normal', statusText: 'Normal',
      progress: 72, timestamp: 'Now', accentColor: '', padding: 12,
    showHeader: true, showFooter: true, showProgress: true, showStatus: true,
    generateRuntimeApi: true, enableClick: true,
      positionMode: 'absolute', x: 40, y: 40, w: 240, h: 145,
  },
  SensorTile: {
    nativeWidgetSchemaVersion: 1, sensorType: 'temperature', title: 'Temperature',
    icon: 'LV_SYMBOL_CHARGE', value: 23.7, decimals: 1, units: '°C', status: 'normal',
    statusText: 'Normal', trend: 'stable', timestamp: 'Now', accentColor: '',
    showTrend: true, showProgress: true, showTimestamp: true, padding: 12,
    rangeMin: 0, rangeMax: 100, warningLow: 20, warningHigh: 80,
    criticalLow: 10, criticalHigh: 90, autoColour: true,
    generateRuntimeApi: true, enableClick: true,
    positionMode: 'absolute', x: 40, y: 40, w: 240, h: 145,
  },
  RelayPanel: {
    nativeWidgetSchemaVersion: 1, title: 'Main Relays', subtitle: 'Digital output control',
    icon: 'LV_SYMBOL_POWER', channelCount: 4,
    channels: [1, 2, 3, 4].map(index => ({ id: `relay-${index}`, label: `Relay ${index}`, state: false, enabled: true, statusText: '' })),
    showMasterControl: true, masterState: false, confirmationMode: 'disabled',
    showChannelNumbers: true, layoutMode: 'standard', activeColour: '#22C55E',
    inactiveColour: '#475569', disabledColour: '#64748B', showFooter: true,
    footerText: 'Ready', padding: 14, gap: 8, generateRuntimeApi: true,
    enableUserEvents: true, positionMode: 'absolute', x: 40, y: 40, w: 340, h: 360,
  },
  PwmController: {
    nativeWidgetSchemaVersion: 1, label: 'PWM Output', subtitle: 'Analogue output control',
    value: 50, minimum: 0, maximum: 100, step: 1, unit: '%', enabled: true,
    showSlider: true, showNumericValue: true, showEnableControl: true,
    orientation: 'horizontal', accentColour: '', statusText: 'Ready',
    generateRuntimeApi: true, enableUserEvents: true,
    positionMode: 'absolute', x: 40, y: 40, w: 240, h: 145,
  },
  TrendChartPro: {
    nativeWidgetSchemaVersion: 1, title: 'Engine RPM', value: 3962,
    units: 'RPM', customUnits: '', decimalPlaces: 0,
    historyLength: 30, initialData: [3420, 3510, 3480, 3620, 3710, 3690, 3820, 3880, 3850, 3962],
    updateRateMs: 1000, autoScale: true, fixedMin: 0, fixedMax: 5000,
    warning: 4200, alarm: 4700, traceColour: '', warningColour: '#F2A900',
    alarmColour: '#E5484D', showGrid: true, showAreaFill: true,
    showGlow: true, showCurrentMarker: true, showThresholdBands: true,
    compactMode: false, generateRuntimeApi: true, enableUserEvents: true,
    positionMode: 'absolute', x: 40, y: 40, w: 360, h: 220,
  },
  AlarmPanel: {
    nativeWidgetSchemaVersion: 1, title: 'Active Alarms', maximumVisibleAlarms: 5,
    showTimestamp: true, showAcknowledgement: true, showPriority: true,
    showHeader: true, showFooter: true, footerText: 'Select an alarm to acknowledge',
    compactMode: false, alarmCapacity: 16, sortOrder: 'newest', autoScroll: true,
    autoClear: false, flashActiveAlarms: false, animateTransitions: false, rowSpacing: 4,
    normalColour: '#22C55E', warningColour: '#F2A900', alarmColour: '#E5484D',
    acknowledgedColour: '#64748B', clearedColour: '#475569',
    alarms: [
      { id: 'alarm-1', message: 'High discharge pressure', timestamp: '14:22:18', state: 'alarm', priority: 'critical' },
      { id: 'alarm-2', message: 'Motor temperature elevated', timestamp: '14:20:04', state: 'warning', priority: 'high' },
      { id: 'alarm-3', message: 'Filter service due', timestamp: '13:48:31', state: 'acknowledged', priority: 'medium' },
    ], generateRuntimeApi: true, enableUserEvents: true,
    positionMode: 'absolute', x: 40, y: 40, w: 420, h: 300,
  },
  IOMonitor: {
    nativeWidgetSchemaVersion: 1, title: 'IO Monitor', maximumRows: 8, compactMode: false,
    rows: [
      { id: 'io-1', ioType: 'digital-input', channel: 'DI1', displayName: 'Emergency Stop', value: 0, state: false, units: '', colour: '#22C55E', showValue: false, showState: true, visible: true },
      { id: 'io-2', ioType: 'digital-output', channel: 'DO1', displayName: 'Pump', value: 1, state: true, units: '', colour: '#38BDF8', showValue: false, showState: true, visible: true },
      { id: 'io-3', ioType: 'analog-input', channel: 'AI1', displayName: 'Pressure', value: 4.62, state: true, units: 'bar', colour: '#F2A900', showValue: true, showState: true, visible: true },
      { id: 'io-4', ioType: 'analog-output', channel: 'AO1', displayName: 'Valve Demand', value: 68, state: true, units: '%', colour: '#A78BFA', showValue: true, showState: true, visible: true },
    ], generateRuntimeApi: true, enableUserEvents: true,
    positionMode: 'absolute', x: 40, y: 40, w: 420, h: 300,
  },
  BatteryCard: {
    nativeWidgetSchemaVersion: 1, title: 'Battery Status', units: '%', percentage: 76,
    voltage: 12.6, current: -1.4, charging: false, health: 'good', remainingMinutes: 185,
    temperature: 31.5, lowThreshold: 20, criticalThreshold: 10, compactMode: false,
    showPercentage: true, showVoltage: true, showCurrent: true, showRuntime: true,
    showTemperature: true, showChargingIcon: true, showHealth: true, animateCharging: false,
    normalColour: '#22C55E', lowColour: '#F2A900', criticalColour: '#E5484D', chargingColour: '#38BDF8',
    generateRuntimeApi: true, positionMode: 'absolute', x: 40, y: 40,
    w: FORGEUI_BATTERY_CARD_DEFAULT_SIZE.width, h: FORGEUI_BATTERY_CARD_DEFAULT_SIZE.height,
  },
  TankLevelCard: {
    nativeWidgetSchemaVersion: 1, title: 'Tank Level', units: 'L', compactMode: false,
    level: 68, capacity: 1000, currentVolume: 680, showPercentage: true, showVolume: true,
    tankShape: 'cylindrical', lowLevel: 20, highLevel: 90, criticalLevel: 5,
    fillColour: '#38BDF8', tankOutline: '#94A3B8', lowColour: '#F2A900',
    highColour: '#A78BFA', criticalColour: '#E5484D', overflowColour: '#EF4444',
    animateFill: true, showLabels: true, generateRuntimeApi: true,
    positionMode: 'absolute', x: 40, y: 40,
    w: FORGEUI_TANK_LEVEL_CARD_DEFAULT_SIZE.width, h: FORGEUI_TANK_LEVEL_CARD_DEFAULT_SIZE.height,
  },
  NetworkStatusCard: {
    nativeWidgetSchemaVersion: 1, title: 'Network Status', networkType: 'wifi', connected: true,
    networkName: 'ForgeUI-Lab', ipAddress: '192.168.1.42', signalStrength: 78,
    hostname: 'forgeui-p4', statusText: 'Online', accentColour: '#22C55E',
    disconnectedColour: '#E5484D', compactMode: false, generateRuntimeApi: true,
    positionMode: 'absolute', x: 40, y: 40,
    w: FORGEUI_NETWORK_STATUS_CARD_DEFAULT_SIZE.width,
    h: FORGEUI_NETWORK_STATUS_CARD_DEFAULT_SIZE.height,
  },
  DeviceSummaryCard: {
    title: 'Device Summary', deviceName: 'ForgeUI-P4', overallStatus: 'online',
    uptime: '02:14:36', firmwareVersion: 'v3.5.4', networkStatus: 'Connected', storageStatus: 'Ready',
    onlineColour: '#22C55E', warningColour: '#F2A900', errorColour: '#E5484D', offlineColour: '#6B7280',
    generateRuntimeApi: true, positionMode: 'absolute', x: 40, y: 40,
    w: FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE.width, h: FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE.height,
  },
  KpiCard: {
    nativeWidgetSchemaVersion: 1, title: 'Efficiency', value: '87.4', unit: '%',
    secondaryText: 'Target 90%', trendText: '+2.1%', trendState: 'up', status: 'good', targetText: '',
    showSecondary: true, showTrend: true, showTarget: false,
    neutralColour: '#94A3B8', goodColour: '#22C55E', warningColour: '#F2A900', criticalColour: '#E5484D',
    generateRuntimeApi: true, positionMode: 'absolute', x: 40, y: 40,
    w: FORGEUI_KPI_CARD_DEFAULT_SIZE.width, h: FORGEUI_KPI_CARD_DEFAULT_SIZE.height,
  },
  QRCode: {
    contentType: 'custom',
    qrText: 'https://forgeui.co.nz',
    qrUrl: 'https://forgeui.co.nz',
    qrWifiSSID: '',
    qrWifiPassword: '',
    qrWifiSecurity: 'WPA',
    qrWifiHidden: false,
    qrEmailAddress: '',
    qrEmailSubject: '',
    qrEmailMessage: '',
    qrPhoneNumber: '',
    qrSmsPhoneNumber: '',
    qrSmsMessage: '',
    qrForeground: '',
    qrBackground: '',
    positionMode: 'absolute',
    x: 40,
    y: 40,
    w: 180,
    h: 180,
  },
  Line: {
    positionMode: 'absolute',
    x: 40,
    y: 40,
    w: 120,
    h: 120,
    startX: 0,
    startY: 0,
    endX: 120,
    endY: 120,
    lineWidth: 3,
    borderColor: '',
    opacity: 1,
    visible: true,
  },
  InputLeftAddon: { children: 'left' },
  InputRightAddon: {
    children: 'right',
  },
  Link: { children: 'Link text' },
  List: {
    title: 'Menu',
    items: 'Overview\nSettings\nDiagnostics',
    itemHeight: 44,
  },
  ListItem: { children: 'list' },
  Kbd: { children: 'shift' },
  NumberInput: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    precision: 0,
  },
  Progress: {
    value: 60,
    min: 0,
    max: 100,
  },
  Slider: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    isDisabled: false,
  },
  Spinbox: {
    value: 0,
    min: 0,
    max: 99999,
    step: 1,
    digitCount: 5,
    decimalPlaces: 0,
    rollover: false,
    textAlign: 'right',
    padding: 8,
    opacity: 100,
    visible: true,
  },
  Spinner: {
    duration: 1000,
    arcLength: 60,
    arcWidth: 8,
    backgroundWidth: 8,
    accentColor: '',
    backgroundColor: '',
    opacity: 100,
  } as any,
  Bar: {
    min: 0,
    max: 100,
    value: 70,
  },
  Arc: {
    min: 0,
    max: 100,
    value: 65,
  },
  Chart: {
    w: 360,
    h: 220,
    title: 'Process Trend',
    xAxisMode: 'relative-time',
    xAxisLabel: '',
    historyWindowSeconds: 60,
    historyEndTime: '14:22',
    yAxisLabel: 'Value',
    yMin: 0,
    yMax: 100,
    pointCount: 24,
    initialData: [42, 45, 44, 48, 52, 55, 53, 58, 61, 59, 63, 66],
    seriesColor: '',
    warningColor: '#F2A900',
    alarmColor: '#E5484D',
    showGrid: true,
    showAxisLabels: true,
    showThresholds: true,
    warningThreshold: 70,
    alarmThreshold: 85,
    horizontalDivisions: 3,
    updateRateMs: 1000,
    simulateValues: false,
    simulatedMinimum: 35,
    simulatedMaximum: 75,
    updateMode: 'shift',
    generateRuntimeApi: true,
  },
  Radio: { children: '' },
  Select: {
    // @ts-ignore
    icon: 'ChevronDownIcon',
    variant: 'outline',
    size: 'md',
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedIndex: 0,
    // @ts-ignore
    form: {
      children: (
        <>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </>
      ),
    },
  },
  SimpleGrid: {
    columns: 2,
    spacingX: 1,
    spacingY: 1,
  },
  Stack: {
    spacing: 2,
    form: {
      display: 'flex',
    },
  },
  Stat: {},
  StatLabel: { children: 'Stat label' },
  StatNumber: { children: '45' },
  StatArrow: { type: 'increase' },
  StatHelpText: {
    display: 'flex',
    alignItems: 'center',
  },
  StatGroup: {},
  Skeleton: {
    height: 50,

    form: {
      fadeDuration: 0.4,
      speed: 0.8,
    },
  },
  SkeletonCircle: {
    form: {
      fadeDuration: 0.4,
      speed: 0.8,
    },
  },
  SkeletonText: {
    form: {
      fadeDuration: 0.4,
      speed: 0.8,
    },
  },
  Switch: {
    isChecked: false,
  },
  Tab: { children: 'Tab' },
  Tabs: { children: '', size: 'md' },
  Tileview: { initialColumn: 0, initialRow: 0 },
  TabPanel: { children: 'Tab' },
  Tag: {
    children: 'Tag name',
  },
  Text: { textValue: 'Text value' },
}

export const getPreviewDefaultProps = (type: ComponentType) =>
  DEFAULT_PROPS[type as keyof PreviewDefaultProps]

export const getDefaultFormProps = (type: ComponentType) => {
  // @ts-ignore
  const chakraDefaultProps = Chakra[type]?.defaultProps || {}

  // @ts-ignore
  return {
    ...chakraDefaultProps,
    ...getPreviewDefaultProps(type)?.form,
  }
}
