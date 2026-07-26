import {
  getInteractiveStatusIndicatorDropSize,
} from './useDropComponent'

describe('component drop defaults', () => {
  it('uses a visible real Canvas size for Status Indicator insertion', () => {
    expect(getInteractiveStatusIndicatorDropSize()).toEqual({
      width: 120,
      height: 72,
    })
  })
})
