import { normalizeForgeUITrendChart } from './ForgeUITrendChart'

export const FORGEUI_TREND_CHART_PRO_SCHEMA_VERSION = 1

const numeric = (value: unknown, fallback: number, minimum: number, maximum: number) => {
  const parsed = Number(value)
  return Math.max(minimum, Math.min(maximum, Number.isFinite(parsed) ? parsed : fallback))
}
const bool = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback

export type ForgeUITrendChartProFooterMode =
  | 'none'
  | 'range'
  | 'history'
  | 'range-history'

export const normalizeForgeUITrendChartPro = (
  props: Record<string, unknown> = {},
) => {
  const base = normalizeForgeUITrendChart(props)
  const footerModes: ForgeUITrendChartProFooterMode[] = [
    'none',
    'range',
    'history',
    'range-history',
  ]
  return {
    ...base,
    proSchemaVersion: FORGEUI_TREND_CHART_PRO_SCHEMA_VERSION as 1,
    rendererVariant: 'premium' as const,
    glowEnabled: bool(props.glowEnabled, true),
    glowOpacity: numeric(props.glowOpacity, 18, 0, 60),
    glowWidth: numeric(props.glowWidth, 7, 2, 16),
    gradientFillEnabled: bool(props.gradientFillEnabled, true),
    gradientOpacity: numeric(props.gradientOpacity, 14, 0, 50),
    thresholdBandsEnabled: bool(props.thresholdBandsEnabled, true),
    premiumMarkerEnabled: bool(props.premiumMarkerEnabled, true),
    markerPulseEnabled: bool(props.markerPulseEnabled, false),
    glassSurfaceEnabled: bool(props.glassSurfaceEnabled, true),
    shadowEnabled: bool(props.shadowEnabled, true),
    animationEnabled: bool(props.animationEnabled, true),
    gridOpacity: numeric(props.gridOpacity, 22, 0, 100),
    majorDivisions: Math.round(numeric(props.majorDivisions, 5, 2, 10)),
    minorDivisions: Math.round(numeric(props.minorDivisions, 0, 0, 12)),
    footerMode: footerModes.includes(props.footerMode as ForgeUITrendChartProFooterMode)
      ? (props.footerMode as ForgeUITrendChartProFooterMode)
      : 'range-history',
  }
}

export type ForgeUITrendChartProModel = ReturnType<
  typeof normalizeForgeUITrendChartPro
>
