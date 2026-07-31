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

describe('Spinbox real Tray to Canvas drop path', () => {
  beforeEach(() => {
    capturedDropSpec = undefined
    addComponent.mockReset()
  })

  it('accepts the Tray payload and inserts a persisted 220x48 Spinbox', () => {
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

    const definition = getForgeUIWidgetDefinition('Spinbox')!
    const trayPayload: ComponentItemProps = {
      id: 'Spinbox',
      type: 'Spinbox',
      label: definition.displayName,
      rootParentType: 'Spinbox',
      defaultWidth: definition.defaultWidth,
      defaultHeight: definition.defaultHeight,
    }
    expect(capturedDropSpec.accept).toContain('Spinbox')

    act(() => {
      capturedDropSpec.drop(trayPayload, {
        isOver: () => true,
        getClientOffset: () => ({ x: 400, y: 250 }),
      })
    })

    expect(addComponent).toHaveBeenCalledTimes(1)
    const state: any = store.getState()
    const inserted = state.components.present.components[
      state.components.present.selectedId
    ]
    expect(inserted).toMatchObject({
      type: 'Spinbox',
      parent: 'root',
      rootParentType: 'Spinbox',
      props: {
        positionMode: 'absolute',
        x: 290,
        y: 226,
        w: 220,
        h: 48,
        min: 0,
        max: 99999,
        value: 0,
        step: 1,
        digitCount: 5,
        decimalPlaces: 0,
      },
    })
    const reloaded = JSON.parse(JSON.stringify(inserted))
    expect(reloaded).toEqual(inserted)
    expect(reloaded.props.w).toBe(220)
    expect(reloaded.props.h).toBe(48)
  })
})
