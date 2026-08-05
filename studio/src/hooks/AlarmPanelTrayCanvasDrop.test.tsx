import React from 'react'
import { act, render } from '@testing-library/react'
import { init } from '@rematch/core'
import { Provider } from 'react-redux'
import { storeConfig } from '~core/store'
import { getForgeUIWidgetDefinition } from '~forgeui/widgets/ForgeUIWidgetRegistry'
import { useDropComponent } from './useDropComponent'

let capturedDropSpec: any
const addComponent = jest.fn()

jest.mock('react-dnd', () => ({
  useDrop: (factory: any) => {
    capturedDropSpec = factory
    return [{ isOver: false }, jest.fn()]
  },
}))

jest.mock('./useDispatch', () => () => ({
  components: { addComponent },
}))

const DropHarness = ({ viewport }: { viewport: React.RefObject<HTMLDivElement> }) => {
  useDropComponent('root', undefined, true, viewport)
  return null
}

describe('AlarmPanel production Tray to Canvas drop path', () => {
  beforeEach(() => {
    capturedDropSpec = undefined
    addComponent.mockReset()
  })

  it('accepts the exact payload, inserts defaults, and selects the persisted model', () => {
    // @ts-ignore Rematch's legacy storeConfig typing is narrower than runtime.
    const store = init(storeConfig)
    addComponent.mockImplementation(payload => store.dispatch.components.addComponent(payload))
    const viewport = { current: { getBoundingClientRect: () => ({
      left: 0, top: 0, width: 1024, height: 600,
    }) } } as React.RefObject<HTMLDivElement>

    render(<Provider store={store}><DropHarness viewport={viewport} /></Provider>)

    const definition = getForgeUIWidgetDefinition('AlarmPanel')!
    const trayPayload: ComponentItemProps = {
      id: 'AlarmPanel', type: 'AlarmPanel', label: definition.displayName,
      rootParentType: 'AlarmPanel', defaultWidth: definition.defaultWidth,
      defaultHeight: definition.defaultHeight,
    }
    expect(capturedDropSpec.accept).toContain('AlarmPanel')

    act(() => capturedDropSpec.drop(trayPayload, {
      isOver: () => true,
      getClientOffset: () => ({ x: 500, y: 300 }),
    }))

    expect(addComponent).toHaveBeenCalledTimes(1)
    const present: any = (store.getState().components as any).present
    const inserted = present.components[present.selectedId]
    expect(inserted).toMatchObject({
      type: 'AlarmPanel', parent: 'root', rootParentType: 'AlarmPanel',
      props: { positionMode: 'absolute', x: 290, y: 150, w: 420, h: 300,
        alarmCapacity: 16, maximumVisibleAlarms: 5 },
    })
    expect(present.components.root.children).toContain(inserted.id)
    expect(JSON.parse(JSON.stringify(inserted))).toEqual(inserted)
  })
})
