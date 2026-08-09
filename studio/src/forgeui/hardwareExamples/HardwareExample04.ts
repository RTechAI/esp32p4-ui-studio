import {
  composeForgeUILayoutTemplate,
  forgeUIWeatherDashboardTemplate,
  type ForgeUILayoutTemplateItem,
} from '../layout/ForgeUILayoutDesigner'

const weatherContent: ForgeUILayoutTemplateItem[] = [
  { type: 'Heading', componentName: 'Weather_Location', props: { headingText: 'TAURANGA', layoutRegionId: 'weather-dashboard.header-left' } },
  { type: 'Text', componentName: 'Weather_Date', props: { textValue: 'SATURDAY 8 AUGUST', layoutRegionId: 'weather-dashboard.header-right' } },
  { type: 'Text', componentName: 'Weather_Time', props: { textValue: '8:20 PM', layoutRegionId: 'weather-dashboard.header-right' } },
  { type: 'Heading', componentName: 'Weather_Temperature', props: { headingText: '18°', layoutRegionId: 'weather-dashboard.current-weather' } },
  { type: 'Text', componentName: 'Weather_Condition', props: { textValue: 'CLEAR SKY', layoutRegionId: 'weather-dashboard.current-weather' } },
  { type: 'Text', componentName: 'Weather_FeelsLike', props: { textValue: 'Feels like 17°', layoutRegionId: 'weather-dashboard.current-weather' } },
  { type: 'Icon', componentName: 'Weather_Current_Icon', props: { iconName: 'FiSun', layoutRegionId: 'weather-dashboard.current-weather' } },
  { type: 'Text', componentName: 'Weather_Humidity', props: { textValue: 'HUMIDITY 72%', layoutRegionId: 'weather-dashboard.metrics' } },
  { type: 'Text', componentName: 'Weather_Wind', props: { textValue: 'WIND 11 km/h', layoutRegionId: 'weather-dashboard.metrics' } },
  { type: 'Text', componentName: 'Weather_Rain', props: { textValue: 'RAIN 10%', layoutRegionId: 'weather-dashboard.metrics' } },
  { type: 'Text', componentName: 'Weather_UV', props: { textValue: 'UV 2', layoutRegionId: 'weather-dashboard.metrics' } },
  ...Array.from({ length: 5 }, (_, index) => {
    const day = index + 1
    const region = `weather-dashboard.forecast-day${day}`
    return [
      { type: 'Text', componentName: `Forecast_Day${day}_Name`, props: { textValue: ['SUN', 'MON', 'TUE', 'WED', 'THU'][index], layoutRegionId: region } },
      { type: 'Icon', componentName: `Forecast_Day${day}_Icon`, props: { iconName: index === 2 ? 'FiCloudRain' : 'FiSun', layoutRegionId: region } },
      { type: 'Text', componentName: `Forecast_Day${day}_Temperature`, props: { textValue: ['17° / 9°', '16° / 10°', '14° / 8°', '17° / 7°', '16° / 9°'][index], layoutRegionId: region } },
    ] as ForgeUILayoutTemplateItem[]
  }).flat(),
]

const composed = composeForgeUILayoutTemplate(
  forgeUIWeatherDashboardTemplate,
  weatherContent,
)

export const HARDWARE_EXAMPLE_04_PROJECT: IComponents = {
  root: {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    rootParentType: 'Box',
    children: composed.map((_, index) => `weather-example-${index}`),
  },
}

composed.forEach((item, index) => {
  const id = `weather-example-${index}`
  HARDWARE_EXAMPLE_04_PROJECT[id] = {
    id,
    parent: 'root',
    type: item.type,
    componentName: item.componentName,
    props: { ...item.props },
    children: [],
    rootParentType: item.type,
  }
})

export const HARDWARE_EXAMPLE_04 = {
  id: 'hardware-example-04',
  number: 4,
  name: 'Online Weather',
  board: 'Waveshare ESP32-P4-WIFI6-Touch-LCD-7B',
  status: 'PHYSICALLY PROVEN',
  project: HARDWARE_EXAMPLE_04_PROJECT,
} as const
