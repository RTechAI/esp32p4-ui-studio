import { init } from '@rematch/core'
import { storeConfig } from '~core/store'

describe('RelayPanel Studio lifecycle', () => {
  it('survives serialization and supports independent duplication and deletion', () => {
    // @ts-ignore Rematch's legacy storeConfig typing is narrower than runtime.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'RelayPanel',
      rootParentType: 'RelayPanel',
      testId: 'relay-original',
    })
    const present = () => (store.getState().components as any).present
    const saved = JSON.parse(JSON.stringify(
      present().components,
    ))
    store.dispatch.components.reset(saved)
    expect(present().components['relay-original'])
      .toMatchObject({ type: 'RelayPanel', props: { channelCount: 4 } })

    store.dispatch.components.select('relay-original')
    store.dispatch.components.duplicate()
    const duplicatedState: any = present()
    expect(duplicatedState.components.root.children).toHaveLength(2)
    const duplicateId = duplicatedState.components.root.children[1]
    store.dispatch.components.updateProps({
      id: duplicateId,
      name: 'title',
      value: 'Independent copy',
    })
    expect(present().components['relay-original']
      .props.title).toBe('Main Relays')
    expect(present().components[duplicateId]
      .props.title).toBe('Independent copy')

    store.dispatch.components.deleteComponent(duplicateId)
    expect(present().components.root.children)
      .toEqual(['relay-original'])
    expect(present().components[duplicateId])
      .toBeUndefined()
  })
})
