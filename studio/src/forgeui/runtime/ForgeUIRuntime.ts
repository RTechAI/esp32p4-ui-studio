export type ForgeUIRuntimeMode = 'local' | 'hosted'

const mode: ForgeUIRuntimeMode =
  process.env.NEXT_PUBLIC_FORGEUI_RUNTIME_MODE === 'hosted'
    ? 'hosted'
    : 'local'

export const forgeUIRuntime = Object.freeze({
  mode,
  isHosted: mode === 'hosted',
  canBuildFlash: mode === 'local',
  canUseSerial: mode === 'local',
  canOpenLocalExplorer: mode === 'local',
  canShutdownLocalService: mode === 'local',
  canUseLocalFirmwareMutation: mode === 'local',
  canUseAI: mode === 'local',
  exportMode: mode === 'hosted' ? 'zip-download' : 'local-directory',
  serviceBaseUrl: mode === 'hosted' ? '/api/hosted' : 'http://localhost:3030',
})

export const forgeUIServiceUrl = (path: string) =>
  `${forgeUIRuntime.serviceBaseUrl}${path.startsWith('/') ? path : `/${path}`}`

export const forgeUIShouldRegisterShutdownBeacon = (
  runtime: Pick<typeof forgeUIRuntime, 'canShutdownLocalService'> = forgeUIRuntime,
) => runtime.canShutdownLocalService
