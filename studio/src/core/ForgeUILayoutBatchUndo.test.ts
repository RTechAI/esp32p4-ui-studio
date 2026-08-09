import { init } from '@rematch/core'
import { ActionCreators } from 'redux-undo'

import { storeConfig } from './store'

describe('generated layout insertion undo', () => {
  it('adds and undoes a generated template as one transaction', () => {
    const store: any = init(storeConfig as any)
    const before = (store.getState().components as any).present.components.root
      .children.length

    store.dispatch.components.addComponents({
      parentName: 'root',
      items: [
        { type: 'Box', props: { layoutRegionKey: 'weather.header' } },
        { type: 'Text', props: { textValue: 'TAURANGA' } },
        { type: 'Heading', props: { headingText: '18°' } },
      ],
    })
    expect((store.getState().components as any).present.components.root.children)
      .toHaveLength(before + 3)

    store.dispatch(ActionCreators.undo() as any)
    expect((store.getState().components as any).present.components.root.children)
      .toHaveLength(before)
  })
})
