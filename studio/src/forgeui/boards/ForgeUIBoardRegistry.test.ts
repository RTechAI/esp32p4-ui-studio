import {
  createForgeUIBoardRegistry,
  DEFAULT_FORGEUI_BOARD_ID,
  getBoardProfile,
  normalizeProjectFeatures,
  normalizeProjectHardware,
} from './ForgeUIBoardRegistry'
import { waveshareEsp32P4Wifi6Touch7B } from './profiles/waveshareEsp32P4Wifi6Touch7B'

describe('ForgeUI board registry', () => {
  it('registers the production Waveshare P4 profile', () => {
    expect(getBoardProfile(DEFAULT_FORGEUI_BOARD_ID)).toEqual(
      expect.objectContaining({
        shortName: 'ESP32-P4 7B',
        target: 'esp32p4',
        display: { width: 1024, height: 600, colorDepth: 16 },
      }),
    )
  })

  it('lists fixture profiles without changing selector consumers', () => {
    const fixture = {
      ...waveshareEsp32P4Wifi6Touch7B,
      id: 'fixture-board',
      displayName: 'Fixture Board',
      shortName: 'Fixture',
      status: 'experimental' as const,
    }
    const fixtureRegistry = createForgeUIBoardRegistry([
      waveshareEsp32P4Wifi6Touch7B,
      fixture,
    ])
    expect(fixtureRegistry.getAvailableBoardProfiles().map(item => item.id))
      .toEqual([DEFAULT_FORGEUI_BOARD_ID, 'fixture-board'])
    expect(fixtureRegistry.getBoardProfile('fixture-board')?.shortName)
      .toBe('Fixture')
  })

  it('migrates legacy projects to historical defaults', () => {
    expect(normalizeProjectHardware()).toEqual({
      boardId: DEFAULT_FORGEUI_BOARD_ID,
      firmwareFeatures: waveshareEsp32P4Wifi6Touch7B.defaultFeatures,
      wifiHosted: waveshareEsp32P4Wifi6Touch7B.defaultWifiHosted,
      sd: waveshareEsp32P4Wifi6Touch7B.defaultSd,
    })
  })

  it('normalizes a missing RTC field to the backward-compatible board default', () => {
    const legacy = normalizeProjectHardware({
      firmwareFeatures: { wifi: false } as any,
    })
    expect(legacy.firmwareFeatures.rtc).toBe(true)
  })

  it('preserves an explicitly disabled external RTC', () => {
    const project = normalizeProjectHardware({
      firmwareFeatures: { rtc: false } as any,
    })
    expect(project.firmwareFeatures.rtc).toBe(false)
    expect(normalizeProjectHardware(project)).toEqual(project)
  })

  it('normalizes unsupported capabilities and feature dependencies', () => {
    expect(normalizeProjectFeatures(DEFAULT_FORGEUI_BOARD_ID, {
      bluetooth: true,
      wifi: false,
      wifiManager: true,
      sdCard: false,
      storageBrowser: true,
    })).toEqual(expect.objectContaining({
      bluetooth: false,
      wifi: false,
      wifiManager: false,
      sdCard: false,
      storageBrowser: false,
    }))
  })
})
