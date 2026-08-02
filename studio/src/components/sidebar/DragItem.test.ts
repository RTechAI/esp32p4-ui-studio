import { createDragItemPayload } from './DragItem'

test('Relay Panel drag payload uses the exact production ComponentType', () => {
  expect(createDragItemPayload({
    type: 'RelayPanel',
    rootParentType: 'RelayPanel',
    defaultWidth: 340,
    defaultHeight: 360,
  })).toEqual({
    id: 'RelayPanel',
    type: 'RelayPanel',
    isMeta: undefined,
    rootParentType: 'RelayPanel',
    defaultWidth: 340,
    defaultHeight: 360,
    insertionProps: undefined,
  })
})
