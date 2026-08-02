import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { normalizeForgeUIRelayPanel, serializeForgeUIRelayPanel } from './ForgeUIRelayPanel'
import { ForgeUIRelayPanelPreview } from './preview/ForgeUIRelayPanelPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { getForgeUIWidgetDefinition } from './widgets/ForgeUIWidgetRegistry'
import { generateForgeUILvglCode } from './ForgeUILvglExport'

const panel = (id: string, props: Record<string, unknown> = {}): IComponent => ({
  id, type: 'RelayPanel', parent: 'root', children: [],
  props: { x: 20, y: 30, w: 340, h: 360, ...props },
})

describe('ForgeUI Relay Panel', () => {
  it('normalizes 1..8 semantic channels and stable unique channel IDs', () => {
    const model = normalizeForgeUIRelayPanel({ channelCount: 10, channels: [
      { id: 'pump', label: 'Pump' }, { id: 'pump', label: 'Valve' },
    ] })
    expect(model.channelCount).toBe(8)
    expect(model.channels).toHaveLength(8)
    expect(model.channels[0].id).toBe('pump')
    expect(model.channels[1].id).toBe('pump-2')
    expect(new Set(model.channels.map(channel => channel.id)).size).toBe(8)
    expect(serializeForgeUIRelayPanel(model).channels).toEqual(model.channels)
  })

  it('registers in the existing Registry as Native Component #3', () => {
    expect(getForgeUIWidgetDefinition('RelayPanel')).toMatchObject({
      displayName: 'Relay Panel', category: 'Dashboard', origin: 'forgeui-native', nativeWidgetSchemaVersion: 1,
      platform: { kind: 'native-widget', family: 'controls' },
      capabilities: { supportsRuntimeApi: true, supportsUserEvents: true, childOwnership: 'none' },
      documentationId: 'docs/FORGEUI_RELAY_PANEL.md',
    })
  })

  it('renders one interactive preview and keeps disabled channels inert', () => {
    render(<ChakraProvider><ForgeUIRelayPanelPreview component={panel('relay-preview', {
      title: 'Main Relays', channelCount: 2, channels: [
        { id: 'pump', label: 'Pump', state: false, enabled: true },
        { id: 'valve', label: 'Valve', state: false, enabled: false },
      ],
    })} palette={FG_PREVIEW_PALETTES.graphite} /></ChakraProvider>)
    expect(screen.getByTestId('forgeui-relay-panel')).toHaveTextContent('Main Relays')
    expect(screen.getByTestId('forgeui-relay-panel')).toHaveTextContent('Pump')
    const switches = screen.getAllByRole('checkbox')
    fireEvent.click(switches[0])
    expect(switches[0]).toBeChecked()
    expect(switches[1]).toBeDisabled()
  })

  it('exports private LVGL composition, zero-based APIs and genuine-user hooks', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['relay-stable'], props: {} },
      'relay-stable': panel('relay-stable', { channelCount: 2, showMasterControl: true }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('fg_relay_stable_relay_channels[2]')
    expect(generated.code).toContain('channel >= 2u')
    expect(generated.code).toContain('fg_relay_stable_relay_programmatic')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Relay_Stable_Channel(uint32_t channel, bool enabled);',
      'bool FG_Get_Relay_Stable_Channel(uint32_t channel);',
      'void FG_Set_Relay_Stable_Channel_Enabled(uint32_t channel, bool enabled);',
      'void FG_Set_Relay_Stable_All(bool enabled);',
      'void FG_Set_Relay_Stable_Label(uint32_t channel, const char * label);',
      'void FG_Set_Relay_Stable_Status(uint32_t channel, const char * text);',
      'void FG_Set_Relay_Stable_Master(bool enabled);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Relay_Stable_Channel_Changed', 'FG_On_Relay_Stable_Master_Changed',
    ]))
    generated.publicApiDeclarations.forEach(declaration =>
      expect(generated.code).toContain(declaration.replace(/;$/, ''))
    )
  })

  it('keeps multiple Relay Panels collision-safe and independent', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['relay-a', 'relay-b'], props: {} },
      'relay-a': panel('relay-a', { channelCount: 2 }),
      'relay-b': panel('relay-b', { channelCount: 3 }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.code).toContain('fg_relay_a_relay_state[2]')
    expect(generated.code).toContain('fg_relay_b_relay_state[3]')
    expect(generated.publicApiDeclarations).toEqual(expect.arrayContaining([
      'void FG_Set_Relay_A_Channel(uint32_t channel, bool enabled);',
      'void FG_Set_Relay_B_Channel(uint32_t channel, bool enabled);',
    ]))
    expect(generated.userEventHooks).toEqual(expect.arrayContaining([
      'FG_On_Relay_A_Channel_Changed', 'FG_On_Relay_B_Channel_Changed',
    ]))
  })

  it('omits semantic APIs and hooks when their generation settings are disabled', () => {
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: ['relay'], props: {} },
      relay: panel('relay', { generateRuntimeApi: false, enableUserEvents: false }),
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.publicApiDeclarations.join('\n')).not.toContain('FG_Set_Relay_')
    expect(generated.userEventHooks.join('\n')).not.toContain('FG_On_Relay_')
  })
})
