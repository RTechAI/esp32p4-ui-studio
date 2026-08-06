import { init } from '@rematch/core'
import { storeConfig } from '~core/store'

describe('IOMonitor Studio lifecycle', () => {
  it('inserts, resizes, serializes, reloads, duplicates independently, and deletes', () => {
    // @ts-ignore Rematch's legacy storeConfig typing is narrower than runtime.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({ parentName: 'root', type: 'IOMonitor', rootParentType: 'IOMonitor', testId: 'io-original' })
    const present = () => (store.getState().components as any).present
    store.dispatch.components.updateManyProps([{ id: 'io-original', props: { x: 70, y: 50, w: 520, h: 360 } }])
    const saved = JSON.parse(JSON.stringify(present().components))
    store.dispatch.components.reset(saved)
    expect(present().components['io-original']).toMatchObject({ type: 'IOMonitor', props: { x: 70, y: 50, w: 520, h: 360, maximumRows: 8 } })
    store.dispatch.components.select('io-original')
    store.dispatch.components.duplicate()
    const duplicateId = present().components.root.children[1]
    store.dispatch.components.updateProps({ id: duplicateId, name: 'title', value: 'Independent IO' })
    expect(present().components['io-original'].props.title).toBe('IO Monitor')
    expect(present().components[duplicateId].props.title).toBe('Independent IO')
    store.dispatch.components.deleteComponent(duplicateId)
    store.dispatch.components.deleteComponent('io-original')
    expect(present().components.root.children).toEqual([])
  })
})
