import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ForgeUIPersistenceGate } from './ForgeUIPersistenceGate'

const storeWithPersistor = (bootstrapped = false) => {
  let state = {
    components: { _persist: { rehydrated: bootstrapped } },
  }
  const listeners = new Set<() => void>()
  const store: any = {
    getState: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispatch: () => undefined,
  }
  return {
    store,
    bootstrap: () => {
      state = {
        components: { _persist: { rehydrated: true } },
      }
      listeners.forEach(listener => listener())
    },
  }
}

describe('ForgeUI persistence hydration gate', () => {
  it('does not expose the Canvas until persisted state is rehydrated', () => {
    const fixture = storeWithPersistor(false)
    render(
      <Provider store={fixture.store}>
        <ForgeUIPersistenceGate><div>Canvas ready</div></ForgeUIPersistenceGate>
      </Provider>,
    )
    expect(screen.queryByText('Canvas ready')).not.toBeInTheDocument()
    act(() => fixture.bootstrap())
    expect(screen.getByText('Canvas ready')).toBeInTheDocument()
  })

  it('renders immediately once persistence is already bootstrapped', () => {
    const fixture = storeWithPersistor(true)
    render(
      <Provider store={fixture.store}>
        <ForgeUIPersistenceGate><div>Canvas ready</div></ForgeUIPersistenceGate>
      </Provider>,
    )
    expect(screen.getByText('Canvas ready')).toBeInTheDocument()
  })

  it('does not fail open when the persistor side-channel is absent', () => {
    const fixture = storeWithPersistor(false)
    render(
      <Provider store={fixture.store}>
        <ForgeUIPersistenceGate><div>Canvas ready</div></ForgeUIPersistenceGate>
      </Provider>,
    )
    expect(screen.queryByText('Canvas ready')).not.toBeInTheDocument()
  })
})
