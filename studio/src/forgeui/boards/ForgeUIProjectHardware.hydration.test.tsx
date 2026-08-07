import React from 'react'
import { TextEncoder } from 'util'
import { act } from 'react-dom/test-utils'
import { hydrateRoot, Root } from 'react-dom/client'
import {
  FORGEUI_PROJECT_HARDWARE_STORAGE_KEY,
  loadForgeUIProjectHardware,
  saveForgeUIProjectHardware,
  useForgeUIProjectHardware,
} from './ForgeUIProjectHardware'

global.TextEncoder = TextEncoder as typeof global.TextEncoder
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
const { renderToString } = require('react-dom/server')

const HardwareSummary = () => {
  const { project, hydrated, refresh } = useForgeUIProjectHardware()
  const enabledCount = Object.values(project.firmwareFeatures).filter(Boolean).length
  return (
    <div>
      <span data-testid="board">{project.boardId}</span>
      <span data-testid="features">{enabledCount}</span>
      <span data-testid="hydrated">{String(hydrated)}</span>
      <button onClick={refresh}>Firmware Clean Refresh</button>
    </div>
  )
}

const persistedCoreOnly = JSON.stringify({
  boardId: 'waveshare-esp32p4-wifi6-touch-lcd-7b',
  firmwareFeatures: {
    wifi: false,
    bluetooth: false,
    audio: false,
    sdCard: false,
    usbHost: false,
    camera: false,
    settingsLauncher: false,
    wifiManager: false,
    storageBrowser: false,
    diagnostics: false,
  },
})

describe('project hardware hydration', () => {
  let root: Root | undefined

  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(async () => {
    if (root) {
      await act(async () => root?.unmount())
      root = undefined
    }
  })

  it('persists an explicitly disabled external RTC across save and load', () => {
    const saved = saveForgeUIProjectHardware({
      ...loadForgeUIProjectHardware(),
      firmwareFeatures: {
        ...loadForgeUIProjectHardware().firmwareFeatures,
        rtc: false,
      },
    })
    expect(saved.firmwareFeatures.rtc).toBe(false)
    expect(loadForgeUIProjectHardware().firmwareFeatures.rtc).toBe(false)
  })

  it('uses deterministic defaults for SSR even when browser storage exists', () => {
    window.localStorage.setItem(
      FORGEUI_PROJECT_HARDWARE_STORAGE_KEY,
      persistedCoreOnly,
    )
    const html = renderToString(<HardwareSummary />)
    expect(html).toContain('waveshare-esp32p4-wifi6-touch-lcd-7b')
    expect(html).toContain('data-testid="features">7</span>')
    expect(html).toContain('data-testid="hydrated">false</span>')
  })

  it('hydrates without mismatch and applies persistence after mount', async () => {
    const html = renderToString(<HardwareSummary />)
    document.body.innerHTML = `<div id="root">${html}</div>`
    window.localStorage.setItem(
      FORGEUI_PROJECT_HARDWARE_STORAGE_KEY,
      persistedCoreOnly,
    )
    const recoverableErrors: unknown[] = []

    await act(async () => {
      root = hydrateRoot(
        document.getElementById('root')!,
        <HardwareSummary />,
        { onRecoverableError: error => recoverableErrors.push(error) },
      )
    })

    expect(recoverableErrors).toEqual([])
    expect(document.querySelector('[data-testid="features"]'))
      .toHaveTextContent('1')
    expect(document.querySelector('[data-testid="hydrated"]'))
      .toHaveTextContent('true')
  })

  it('refreshes persisted state after Firmware Clean without remounting', async () => {
    const html = renderToString(<HardwareSummary />)
    document.body.innerHTML = `<div id="root">${html}</div>`
    await act(async () => {
      root = hydrateRoot(document.getElementById('root')!, <HardwareSummary />)
    })

    window.localStorage.setItem(
      FORGEUI_PROJECT_HARDWARE_STORAGE_KEY,
      persistedCoreOnly,
    )
    await act(async () => {
      document.querySelector<HTMLButtonElement>('button')?.click()
    })

    expect(document.querySelector('[data-testid="features"]'))
      .toHaveTextContent('1')
  })
})
