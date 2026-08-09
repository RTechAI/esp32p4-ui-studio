export const FORGEUI_WEATHER_BACKGROUND_PACK_NAME =
  'ForgeUI Weather Background Pack' as const

export const FORGEUI_WEATHER_BACKGROUND_DEFINITIONS = [
  ['weather.hot_sunny', 'Hot Sunny', '1786177268856_5b7bc86f'],
  ['weather.windy', 'Windy', '1786177133674_eb2ae86e'],
  ['weather.first_light', 'First Light', '1786177043979_e3cad917'],
  ['weather.last_light', 'Last Light', '1786176941588_e638d1db'],
  ['weather.golden', 'Golden', '1786176819806_ba12304a'],
  ['weather.sunny', 'Sunny', '1786176736856_806e546c'],
  ['weather.partly_cloudy.night', 'Partly Cloudy Night', '1786176586614_981a4670'],
  ['weather.rain.night', 'Rain Night', '1786176442715_8a47a244'],
  ['weather.frosty', 'Frosty', '1786176334506_d9dc4c22'],
  ['weather.snow', 'Snow', '1786176207823_5b8eb6de'],
  ['weather.fog', 'Fog', '1786176018471_8897993e'],
  ['weather.thunderstorm', 'Thunderstorm', '1786175925517_846bc1d6'],
  ['weather.rain.day', 'Rain', '1786175833774_dcf82046'],
  ['weather.overcast', 'Overcast', '1786175736552_7ca78d5b'],
  ['weather.partly_cloudy.day', 'Partly Cloudy Day', '1786175636953_e2570088'],
  ['weather.clear.night', 'Clear Night', '1786175544095_ef74779f'],
  ['weather.clear.day', 'Clear Day', '1786173676218_aeb0dfd0'],
] as const

export type ForgeUIWeatherBackgroundKey =
  typeof FORGEUI_WEATHER_BACKGROUND_DEFINITIONS[number][0]

export const FORGEUI_WEATHER_RUNTIME_BACKGROUND_KEYS = [
  'weather.clear.day',
  'weather.clear.night',
  'weather.partly_cloudy.day',
  'weather.partly_cloudy.night',
  'weather.overcast',
  'weather.fog',
  'weather.rain.day',
  'weather.rain.night',
  'weather.snow',
  'weather.thunderstorm',
] as const

export const resolveForgeUIWeatherBackgroundKey = (
  weatherCode: number,
  isDay: boolean,
): ForgeUIWeatherBackgroundKey => {
  if (weatherCode === 0) return isDay ? 'weather.clear.day' : 'weather.clear.night'
  if (weatherCode === 1 || weatherCode === 2) {
    return isDay ? 'weather.partly_cloudy.day' : 'weather.partly_cloudy.night'
  }
  if (weatherCode === 3) return 'weather.overcast'
  if (weatherCode === 45 || weatherCode === 48) return 'weather.fog'
  if (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) return isDay ? 'weather.rain.day' : 'weather.rain.night'
  if (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  ) return 'weather.snow'
  if (weatherCode >= 95 && weatherCode <= 99) return 'weather.thunderstorm'
  return isDay ? 'weather.partly_cloudy.day' : 'weather.partly_cloudy.night'
}
