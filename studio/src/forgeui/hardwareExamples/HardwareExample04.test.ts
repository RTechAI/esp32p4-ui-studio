import fs from 'fs'
import path from 'path'

const firmwareMain = path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'main')
const weatherSource = fs.readFileSync(
  path.join(firmwareMain, '99_Hardware_Example_04_Weather.c'), 'utf8',
)
const weatherHeader = fs.readFileSync(
  path.join(firmwareMain, '99_Hardware_Example_04_Weather.h'), 'utf8',
)
const sdkconfigDefaults = fs.readFileSync(
  path.resolve(process.cwd(), '..', 'firmware', 'ForgeUI-One', 'sdkconfig.defaults'), 'utf8',
)
const firmwareMainSource = fs.readFileSync(path.join(firmwareMain, 'main.c'), 'utf8')
const wifiSource = fs.readFileSync(path.join(firmwareMain, '30_WIFI.c'), 'utf8')

describe('Hardware Example 04 online weather contract', () => {
  it('uses generated semantic text APIs without private LVGL access', () => {
    for (const setter of ['Temperature', 'Condition', 'Feels_Like', 'Humidity', 'Wind', 'Rain', 'Date', 'Time']) {
      expect(weatherSource).toContain(`FG_Set_Weather_${setter}_Text(`)
    }
    expect(weatherSource).not.toContain('fg_weather_temperature_label')
    expect(weatherSource).not.toContain('lv_label_set_text')
  })

  it('requests bounded current conditions and one-day solar boundaries through the existing Wi-Fi service', () => {
    expect(weatherSource).toContain('fg_wifi_get_snapshot(&wifi)')
    expect(weatherSource).toContain('current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day')
    expect(weatherSource).toContain('daily=sunrise,sunset')
    expect(weatherSource).not.toContain('hourly=')
  })

  it('keeps bounded replaceable location and snapshot models', () => {
    expect(weatherHeader).toContain('fg_weather_location_t;')
    expect(weatherHeader).toContain('fg_weather_snapshot_t;')
    expect(weatherHeader).toContain('bool fg_weather_set_location(')
    expect(weatherSource).toContain('.name = "Tauranga"')
    expect(weatherSource).toContain('.region = "Bay of Plenty"')
    expect(weatherSource).toContain('.timezone = "Pacific/Auckland"')
    expect(weatherSource).toContain('.timezone_posix = "NZST-12NZDT,M9.5.0,M4.1.0/3"')
    expect(weatherSource).toContain('#define FG_WEATHER_RESPONSE_CAPACITY 1024')
    for (const field of ['current_conditions_valid', 'apparent_temperature_c', 'relative_humidity_percent',
      'wind_speed_kmh', 'precipitation_mm', 'weather_code', 'is_day', 'sunrise_unix', 'sunset_unix']) {
      expect(weatherHeader).toContain(field)
    }
  })

  it('maps WMO conditions independently and drives local time through ESP-IDF SNTP', () => {
    for (const condition of ['CLEAR SKY', 'PARTLY CLOUDY', 'OVERCAST', 'FOG', 'DRIZZLE',
      'RAIN', 'HEAVY RAIN', 'SNOW', 'THUNDERSTORM']) {
      expect(weatherSource).toContain(`return "${condition}"`)
    }
    expect(weatherSource).toContain('#include "esp_sntp.h"')
    expect(weatherSource).toContain('esp_sntp_init();')
    expect(weatherSource).toContain('setenv("TZ", location->timezone_posix, 1)')
    expect(weatherSource).toContain('tzset();')
    expect(weatherSource).toContain('const time_t minute = now / 60;')
  })

  it('uses bounded refresh and retry intervals while retaining valid state', () => {
    expect(weatherSource).toContain('#define FG_WEATHER_REFRESH_MS (15U * 60U * 1000U)')
    expect(weatherSource).toContain('#define FG_WEATHER_RETRY_MS (60U * 1000U)')
    expect(weatherSource).toContain('Fetch failed; retaining last value')
    expect(weatherSource).not.toMatch(/s_snapshot\.valid\s*=\s*false/)
  })

  it('re-evaluates day and night presentation locally without another weather request', () => {
    expect(weatherSource).toContain('daily=sunrise,sunset&timeformat=unixtime&forecast_days=1&timezone=auto')
    expect(weatherSource).toContain('read_first_epoch(daily, "sunrise", &snapshot->sunrise_unix)')
    expect(weatherSource).toContain('read_first_epoch(daily, "sunset", &snapshot->sunset_unix)')
    expect(weatherSource).toContain('const bool local_is_day = now >= visual_snapshot.sunrise_unix && now < visual_snapshot.sunset_unix;')
    expect(weatherSource).toContain('publish_weather_visual_state(visual_snapshot.weather_code, local_is_day);')
    expect(weatherSource).toContain('if (strcmp(s_visual_background_key, key) == 0) return;')
    expect(weatherSource).toContain('Weather visual state: condition=%d day=%d background=%s')
    expect(weatherSource).toContain('FG_Set_Weather_Background_Key(key);')
    expect(weatherSource.match(/fetch_current_conditions\(/g)).toHaveLength(2)
    const background = (code: number, isDay: boolean) => {
      if (code === 0) return isDay ? 'weather.clear.day' : 'weather.clear.night'
      if (code === 1 || code === 2) return isDay ? 'weather.partly_cloudy.day' : 'weather.partly_cloudy.night'
      if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return isDay ? 'weather.rain.day' : 'weather.rain.night'
      return 'weather.overcast'
    }
    expect(background(2, true)).toBe('weather.partly_cloudy.day')
    expect(background(2, false)).toBe('weather.partly_cloudy.night')
    expect(background(61, true)).toBe('weather.rain.day')
    expect(background(61, false)).toBe('weather.rain.night')
    expect(background(3, true)).toBe(background(3, false))
  })

  it('preserves HTTPS while removing the ESP32-P4 hardware-AES DMA collision', () => {
    expect(weatherSource).toContain('.crt_bundle_attach = esp_crt_bundle_attach')
    expect(sdkconfigDefaults).toContain('# CONFIG_MBEDTLS_HARDWARE_AES is not set')
    expect(sdkconfigDefaults).toContain('CONFIG_MBEDTLS_DYNAMIC_BUFFER=y')
    expect(sdkconfigDefaults).toContain('# CONFIG_MBEDTLS_INTERNAL_MEM_ALLOC is not set')
    expect(sdkconfigDefaults).toContain('CONFIG_MBEDTLS_DEFAULT_MEM_ALLOC=y')
    expect(weatherSource).toContain('heap_caps_get_free_size(MALLOC_CAP_INTERNAL)')
    expect(weatherSource).toContain('heap_caps_get_largest_free_block(MALLOC_CAP_DMA)')
    expect(weatherSource).toContain('heap_caps_get_free_size(MALLOC_CAP_SPIRAM)')
    expect(weatherSource).toContain('uxTaskGetStackHighWaterMark(NULL)')
    expect(weatherSource).toContain('log_memory_state("before-client")')
    expect(weatherSource).toContain('log_memory_state("before-perform")')
    expect(weatherSource).toContain('log_memory_state("after-failed-cleanup")')
    expect(weatherSource).toContain('log_memory_state("before-retry")')
  })

  it('uses the Gate B streaming receive path and preserves DMA headroom without shrinking queues', () => {
    expect(sdkconfigDefaults).toContain('CONFIG_ESP_HOSTED_SDIO_TX_Q_SIZE=20')
    expect(sdkconfigDefaults).toContain('CONFIG_ESP_HOSTED_SDIO_RX_Q_SIZE=20')
    expect(sdkconfigDefaults).toContain('# CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_MAX_SIZE is not set')
    expect(sdkconfigDefaults).toContain('CONFIG_ESP_HOSTED_SDIO_OPTIMIZATION_RX_STREAMING_MODE=y')
    expect(sdkconfigDefaults).toContain('CONFIG_SPIRAM_MALLOC_ALWAYSINTERNAL=1024')
    expect(sdkconfigDefaults).toContain('CONFIG_SPIRAM_MALLOC_RESERVE_INTERNAL=32768')
    expect(weatherSource).toContain('#define FG_WEATHER_MIN_DMA_FREE 8192U')
    expect(weatherSource).toContain('#define FG_WEATHER_MIN_DMA_LARGEST 4096U')
    expect(weatherSource).toContain('weather_has_sdio_headroom()')
  })

  it('matches the Gate B persisted-config and STA-start connection order', () => {
    const readConfig = wifiSource.indexOf('esp_wifi_get_config(WIFI_IF_STA, &persisted)')
    const setConfig = wifiSource.indexOf('esp_wifi_set_config(WIFI_IF_STA, &persisted)')
    const start = wifiSource.indexOf('err = esp_wifi_start();')
    expect(readConfig).toBeGreaterThan(-1)
    expect(setConfig).toBeGreaterThan(readConfig)
    expect(start).toBeGreaterThan(setConfig)
    expect(wifiSource).toContain('id == WIFI_EVENT_STA_START')
    expect(wifiSource).toContain('startup esp_wifi_connect: %s (0x%x)')
  })

  it('logs DMA and internal capacity around the unchanged BSP display allocation', () => {
    expect(firmwareMainSource).toContain('log_display_heap("display-before")')
    expect(firmwareMainSource).toContain('bsp_display_start_with_config(&cfg)')
    expect(firmwareMainSource).toContain('log_display_heap("display-after")')
    expect(firmwareMainSource).toContain('heap_caps_get_largest_free_block(MALLOC_CAP_DMA)')
    expect(firmwareMainSource).toContain('.sw_rotate = true')
    expect(firmwareMainSource).toContain('.buff_dma = true')
  })

  it('serializes retries and distinguishes fallback time from SNTP synchronization', () => {
    expect(weatherSource).toContain('s_request_in_flight = true;')
    expect(weatherSource).toContain('s_request_in_flight = false;')
    expect(weatherSource).toContain('esp_sntp_get_sync_status() == SNTP_SYNC_STATUS_COMPLETED')
    expect(weatherSource).toContain('"fallback time available"')
  })

  it('retains DNS timing and uses the HTTPS socket directly for TLS diagnostics', () => {
    expect(weatherSource).toContain('getaddrinfo("api.open-meteo.com", "443"')
    expect(weatherSource).toContain('"DNS resolved ip=%s ms=%u"')
    expect(weatherSource).not.toContain('connect(sock,')
    expect(weatherSource).not.toContain('TCP connected port=443')
    expect(weatherSource).toContain('HTTP_EVENT_ON_CONNECTED')
    expect(weatherSource).toContain('"TLS connected ms=%u"')
    expect(weatherSource).toContain('"HTTP %d ms=%u"')
    expect(weatherSource).toContain('.crt_bundle_attach = esp_crt_bundle_attach')
    expect(sdkconfigDefaults).toContain('# CONFIG_MBEDTLS_DEBUG is not set')
    expect(sdkconfigDefaults).not.toContain('CONFIG_MBEDTLS_DEBUG_LEVEL_INFO=y')
  })

  it('does not issue Hosted AP-info RPCs from frequently polled status getters', () => {
    expect(wifiSource).toContain('const char *fg_wifi_ssid_text(void) { return g_ssid; }')
    expect(wifiSource).toContain('int fg_wifi_rssi(void) { return g_rssi; }')
    const snapshot = wifiSource.slice(wifiSource.indexOf('fg_wifi_result_t fg_wifi_get_snapshot'),
      wifiSource.indexOf('fg_wifi_result_t fg_wifi_scan_start'))
    expect(snapshot).not.toContain('refresh_station()')
    expect(wifiSource).toContain('id == IP_EVENT_STA_GOT_IP')
    expect(wifiSource).toContain('refresh_station();')
  })

})
