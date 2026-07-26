import {
  getInteractiveButtonDropSize,
  getInteractiveLightDropSize,
  getInteractiveStatusIndicatorDropSize,
} from './useDropComponent'
import { menuItems } from '~componentsList'
import { forgeuiCoreWidgets } from '~forgeui/ForgeUIWidgetSet'

describe('component drop defaults', () => {
  it('uses the shared 200x100 Interactive Button default', () => {
    expect(getInteractiveButtonDropSize()).toEqual({
      width: 200,
      height: 100,
    })
  })

  it('exposes Interactive Light in the palette with a 32x32 drop', () => {
    expect(forgeuiCoreWidgets)
      .toContain('InteractiveLight')
    expect(menuItems.InteractiveLight).toBeDefined()
    expect(getInteractiveLightDropSize()).toEqual({
      width: 32,
      height: 32,
    })
  })

  it('uses a visible real Canvas size for Status Indicator insertion', () => {
    expect(getInteractiveStatusIndicatorDropSize()).toEqual({
      width: 120,
      height: 72,
    })
  })
})
