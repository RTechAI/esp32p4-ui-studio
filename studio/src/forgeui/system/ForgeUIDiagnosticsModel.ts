import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'

export type DiagnosticValue = number | null
export type DiagnosticHealth = 'normal' | 'high' | 'critical' | 'unavailable'

export type ForgeUIDiagnosticsModel = {
  internalRam: { free: DiagnosticValue; total: DiagnosticValue; minimumFree: DiagnosticValue }
  psram: { free: DiagnosticValue; total: DiagnosticValue; minimumFree: DiagnosticValue }
  flash: {
    used: DiagnosticValue; free: DiagnosticValue; total: DiagnosticValue
    applicationSize: DiagnosticValue; spiffsUsed: DiagnosticValue; spiffsFree: DiagnosticValue
  }
  performance: {
    fps: DiagnosticValue; lvglTickRate: DiagnosticValue; uiUpdateTimeUs: DiagnosticValue
    cpuFrequencyMhz: DiagnosticValue; uptimeSeconds: DiagnosticValue; buildVersion: string | null
  }
  lvgl: {
    version: string | null; framebufferCount: DiagnosticValue; resolution: string | null
    theme: string | null; currentScreen: string | null; objectCount: DiagnosticValue
  }
  wifi: { connected: boolean | null; ssid: string | null; rssi: DiagnosticValue; ip: string | null }
  sd: {
    mounted: boolean | null; capacity: DiagnosticValue; freeSpace: DiagnosticValue
    files: DiagnosticValue
  }
}

export const createUnavailableDiagnosticsModel = (): ForgeUIDiagnosticsModel => ({
  internalRam: { free: null, total: null, minimumFree: null },
  psram: { free: null, total: null, minimumFree: null },
  flash: {
    used: null, free: null, total: null, applicationSize: null,
    spiffsUsed: null, spiffsFree: null,
  },
  performance: {
    fps: null, lvglTickRate: null, uiUpdateTimeUs: null,
    cpuFrequencyMhz: null, uptimeSeconds: null, buildVersion: null,
  },
  lvgl: {
    version: null, framebufferCount: null, resolution: null,
    theme: null, currentScreen: 'Diagnostics', objectCount: null,
  },
  wifi: { connected: null, ssid: null, rssi: null, ip: null },
  sd: { mounted: null, capacity: null, freeSpace: null, files: null },
})

export const diagnosticHealth = (free: DiagnosticValue, total: DiagnosticValue): DiagnosticHealth => {
  if (free == null || total == null || total <= 0) return 'unavailable'
  const usedRatio = 1 - free / total
  if (usedRatio >= 0.9) return 'critical'
  if (usedRatio >= 0.75) return 'high'
  return 'normal'
}

export const diagnosticHealthColour = (
  health: DiagnosticHealth,
  palette: ForgePreviewPalette,
) => {
  const semantic = resolveForgeSemanticPalette(palette)
  return ({
    normal: semantic.healthNormal,
    high: semantic.healthHigh,
    critical: semantic.healthCritical,
    unavailable: semantic.surfaceSecondary,
  })[health]
}

export const formatDiagnosticBytes = (value: DiagnosticValue) => {
  if (value == null) return 'Not Available'
  const units = ['B', 'KB', 'MB', 'GB']
  let scaled = value
  let unit = 0
  while (scaled >= 1024 && unit < units.length - 1) {
    scaled /= 1024
    unit += 1
  }
  return `${scaled >= 10 || unit === 0 ? scaled.toFixed(0) : scaled.toFixed(1)} ${units[unit]}`
}
