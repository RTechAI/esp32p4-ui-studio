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

const DropHarness = ({
  viewport,
}: {
  viewport: React.RefObject<HTMLDivElement>
}) => {
  useDropComponent('root', undefined, true, viewport)
  return null
}

describe('RelayPanel production Tray to Canvas drop path', () => {
  beforeEach(() => {
    capturedDropSpec = undefined
    addComponent.mockReset()
  })

  it('accepts the exact RelayPanel payload and creates its persisted model', () => {
    // @ts-ignore Rematch's legacy storeConfig typing is narrower than runtime.
    const store = init(storeConfig)
    addComponent.mockImplementation(payload => {
      store.dispatch.components.addComponent(payload)
    })
    const viewport = {
      current: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 1024,
          height: 600,
        }),
      },
    } as React.RefObject<HTMLDivElement>

    render(
      <Provider store={store}>
        <DropHarness viewport={viewport} />
      </Provider>,
    )

    const definition = getForgeUIWidgetDefinition('RelayPanel')!
    const trayPayload: ComponentItemProps = {
      id: 'RelayPanel',
      type: 'RelayPanel',
      label: definition.displayName,
      rootParentType: 'RelayPanel',
      defaultWidth: definition.defaultWidth,
      defaultHeight: definition.defaultHeight,
    }
    expect(capturedDropSpec.accept).toContain('RelayPanel')

    act(() => {
      capturedDropSpec.drop(trayPayload, {
        isOver: () => true,
        getClientOffset: () => ({ x: 500, y: 300 }),
      })
    })

    expect(addComponent).toHaveBeenCalledTimes(1)
    const state: any = store.getState()
    const inserted = state.components.present.components[
      state.components.present.selectedId
    ]
    expect(inserted).toMatchObject({
      type: 'RelayPanel',
      parent: 'root',
      rootParentType: 'RelayPanel',
      props: {
        positionMode: 'absolute',
        x: 330,
        y: 120,
        w: 340,
        h: 360,
        channelCount: 4,
      },
    })
    expect(JSON.parse(JSON.stringify(inserted))).toEqual(inserted)
  })
})
