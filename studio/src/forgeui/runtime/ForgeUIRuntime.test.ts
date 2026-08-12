describe('ForgeUI runtime capabilities', () => {
  const loadRuntime = (value?: string) => {
    jest.resetModules()
    if (value === undefined) delete process.env.NEXT_PUBLIC_FORGEUI_RUNTIME_MODE
    else process.env.NEXT_PUBLIC_FORGEUI_RUNTIME_MODE = value
    return require('./ForgeUIRuntime').forgeUIRuntime
  }

  afterEach(() => delete process.env.NEXT_PUBLIC_FORGEUI_RUNTIME_MODE)

  it('keeps local capabilities enabled by default', () => {
    expect(loadRuntime()).toMatchObject({ mode: 'local', canBuildFlash: true, canUseSerial: true })
  })

  it('disables machine and AI capabilities in hosted mode', () => {
    expect(loadRuntime('hosted')).toMatchObject({
      mode: 'hosted', canBuildFlash: false, canUseSerial: false,
      canOpenLocalExplorer: false, canShutdownLocalService: false,
      canUseLocalFirmwareMutation: false, canUseAI: false,
      exportMode: 'zip-download', serviceBaseUrl: '/api/hosted',
    })
  })

  it('does not register an unload shutdown beacon for hosted capabilities', () => {
    const runtimeModule = require('./ForgeUIRuntime')
    expect(runtimeModule.forgeUIShouldRegisterShutdownBeacon({ canShutdownLocalService: false })).toBe(false)
    expect(runtimeModule.forgeUIShouldRegisterShutdownBeacon({ canShutdownLocalService: true })).toBe(true)
  })
})

export {}
