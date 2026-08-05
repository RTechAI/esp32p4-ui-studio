import { init } from '@rematch/core'
import { storeConfig } from '~core/store'

describe('AlarmPanel Studio lifecycle', () => {
  it('resizes, saves, reloads, duplicates independently, and deletes', () => {
    // @ts-ignore Rematch's legacy storeConfig typing is narrower than runtime.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root', type: 'AlarmPanel', rootParentType: 'AlarmPanel',
      testId: 'alarm-original',
    })
    const present = () => (store.getState().components as any).present
    expect(present().selectedId).toBe('alarm-original')

    store.dispatch.components.updateManyProps([{
      id: 'alarm-original', props: { x: 80, y: 60, w: 560, h: 340 },
    }])
    const saved = JSON.parse(JSON.stringify(present().components))
    store.dispatch.components.reset(saved)
    expect(present().components['alarm-original']).toMatchObject({
      type: 'AlarmPanel', props: { x: 80, y: 60, w: 560, h: 340,
        alarmCapacity: 16, maximumVisibleAlarms: 5 },
    })

    store.dispatch.components.select('alarm-original')
    store.dispatch.components.duplicate()
    const duplicateId = present().components.root.children[1]
    expect(duplicateId).not.toBe('alarm-original')
    store.dispatch.components.updateProps({
      id: duplicateId, name: 'title', value: 'Independent alarms',
    })
    expect(present().components['alarm-original'].props.title).toBe('Active Alarms')
    expect(present().components[duplicateId].props.title).toBe('Independent alarms')

    store.dispatch.components.deleteComponent(duplicateId)
    expect(present().components.root.children).toEqual(['alarm-original'])
    store.dispatch.components.deleteComponent('alarm-original')
    expect(present().components.root.children).toEqual([])
  })
})
