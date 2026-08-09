import components, { ComponentsState, INITIAL_COMPONENTS } from './components'
import { onboarding } from '~templates/onboarding'
import produce from 'immer'

const STATE: ComponentsState = {
  components: {
    'button-testid': {
      children: [],
      id: 'button-testid',
      parent: 'root',
      props: { children: 'Button text', variant: 'solid', size: 'md' },
      rootParentType: 'Button',
      type: 'Button',
    },
    root: {
      children: ['button-testid'],
      id: 'root',
      parent: 'root',
      props: {},
      type: 'Box',
    },
  },
  selectedId: 'button-testid',
}

describe('Components model', () => {
  it('should reset the state', async () => {
    const state: ComponentsState = {
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    }

    const nextState = components.reducers.reset(state)
    expect(nextState).toEqual(state)
  })

  it('should load a demo', async () => {
    const state: ComponentsState = {
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    }

    const nextState = components.reducers.loadDemo(state, 'onboarding')
    expect(nextState).toEqual({
      components: onboarding,
      selectedId: 'comp-root',
    })
  })

  it('should reset props', async () => {
    return produce(STATE, (draftState: ComponentsState) => {
      draftState.components['button-testid'].props = {
        children: 'Button text',
        variant: 'ghost',
      }

      const nextState = components.reducers.resetProps(
        draftState,
        'button-testid',
      )

      expect(nextState.components['button-testid'].props).toEqual({
        children: 'Button text',
        variant: 'solid',
        size: 'md',
      })
    })
  })

  it('should update props', async () => {
    const nextState = components.reducers.updateProps(STATE, {
      id: 'button-testid',
      name: 'colorScheme',
      value: 'teal.300',
    })

    expect(nextState.components['button-testid'].props).toEqual({
      children: 'Button text',
      colorScheme: 'teal.300',
      variant: 'solid',
      size: 'md',
    })
  })

  it('updates Auto Arrange geometry atomically without removing region metadata', () => {
    const state: ComponentsState = {
      ...STATE,
      components: {
        ...STATE.components,
        'button-testid': {
          ...STATE.components['button-testid'],
          props: {
            ...STATE.components['button-testid'].props,
            layoutRegionId: 'dashboard.controls',
          },
        },
      },
    }
    const nextState = components.reducers.updateManyProps(state, [{
      id: 'button-testid',
      props: { x: 800, y: 140, w: 160, h: 48 },
    }])
    expect(nextState.components['button-testid'].props).toMatchObject({
      layoutRegionId: 'dashboard.controls',
      x: 800,
      y: 140,
      w: 160,
      h: 48,
    })
  })

  it('should add a new component', async () => {
    const state: ComponentsState = {
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    }

    const nextState = components.reducers.addComponent(state, {
      parentName: 'root',
      type: 'Button',
      testId: 'button-testid',
    })

    expect(nextState).toEqual(STATE)
  })

  it('preserves a normal AI-provided component name during insertion', () => {
    const nextState = components.reducers.addComponent({
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    }, {
      parentName: 'root',
      type: 'Text',
      testId: 'weather-location',
      componentName: 'Weather_Location',
      props: { textValue: 'TAURANGA' },
    })
    expect(nextState.components['weather-location']).toMatchObject({
      componentName: 'Weather_Location',
      props: { textValue: 'TAURANGA' },
    })
  })

  it('inserts a complete generated layout atomically', () => {
    const nextState = components.reducers.addComponents({
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    }, {
      parentName: 'root',
      items: [
        { type: 'Box', props: { layoutRegionKey: 'weather.header' } },
        {
          type: 'Text',
          componentName: 'Weather_Location',
          props: { textValue: 'TAURANGA' },
        },
      ],
    })
    expect(nextState.components.root.children).toHaveLength(2)
    expect(Object.values(nextState.components)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          componentName: 'Weather_Location',
          props: expect.objectContaining({ textValue: 'TAURANGA' }),
        }),
      ]),
    )
  })

  it('should delete a simple component', async () => {
    const nextState = components.reducers.deleteComponent(
      STATE,
      'button-testid',
    )

    expect(nextState).toEqual({
      components: INITIAL_COMPONENTS,
      selectedId: 'root',
    })
  })

  it('should move a component', async () => {
    return produce(STATE, (draftState: ComponentsState) => {
      draftState.components['box-testid'] = {
        children: [],
        id: 'box-testid',
        parent: 'root',
        props: {},
        rootParentType: 'Box',
        type: 'Box',
      }

      expect(draftState.components['root'].children).toContain('button-testid')

      const nextState = components.reducers.moveComponent(draftState, {
        parentId: 'box-testid',
        componentId: 'button-testid',
      })

      expect(nextState.components['box-testid'].children).toContain(
        'button-testid',
      )

      expect(nextState.components['root'].children).not.toContain(
        'button-testid',
      )
    })
  })

  it('should move a selected component', async () => {
    return produce(STATE, (draftState: ComponentsState) => {
      draftState.components['box-testid'] = {
        children: [],
        id: 'box-testid',
        parent: 'root',
        props: {},
        rootParentType: 'Box',
        type: 'Box',
      }

      draftState.selectedId = 'root'
      draftState.components['root'].children.push('box-testid')

      expect(draftState.components['root'].children).toEqual([
        'button-testid',
        'box-testid',
      ])

      const nextState = components.reducers.moveSelectedComponentChildren(
        draftState,
        {
          fromIndex: 0,
          toIndex: 1,
        },
      )

      expect(nextState.components['root'].children).toEqual([
        'box-testid',
        'button-testid',
      ])
    })
  })

  it('should select a component', async () => {
    expect(STATE.selectedId).toEqual('button-testid')
    const nextState = components.reducers.select(STATE, 'root')
    expect(nextState.selectedId).toEqual('root')
  })

  it('should unselect a component', async () => {
    expect(STATE.selectedId).toEqual('button-testid')
    const nextState = components.reducers.unselect(STATE)
    expect(nextState.selectedId).toEqual('root')
  })
})
