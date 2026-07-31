import {
  getInteractiveButtonDropSize,
  getInteractiveLightDropSize,
  getInteractiveStatusIndicatorDropSize,
  getFreeformDropPosition,
  getFreeformMovedPosition,
} from './useDropComponent'
import { menuItems } from '~componentsList'
import { forgeuiCoreWidgets } from '~forgeui/ForgeUIWidgetSet'
import { rootComponents } from '~utils/editor'

describe('component drop defaults', () => {
  it('accepts every authoritative Registry widget at the root Canvas', () => {
    expect(rootComponents).toEqual(
      expect.arrayContaining(forgeuiCoreWidgets),
    )
  })

  it('preserves the exact drag delta without centering or rounding', () => {
    expect(getFreeformMovedPosition({
      x: 101.25,
      y: 82.75,
      deltaX: 3.5,
      deltaY: -1.25,
      width: 80,
      height: 24,
      viewportWidth: 1024,
      viewportHeight: 600,
    })).toEqual({
      x: 104.75,
      y: 81.5,
    })
  })

  it('places new widgets without quantising their coordinates', () => {
    expect(getFreeformDropPosition({
      pointerX: 311.75,
      pointerY: 206.25,
      width: 80,
      height: 24,
      viewportWidth: 1024,
      viewportHeight: 600,
    })).toEqual({
      x: 271.75,
      y: 194.25,
    })
  })

  it('clamps movement at canvas bounds without quantising the free axis', () => {
    expect(getFreeformMovedPosition({
      x: 900.25,
      y: 82.75,
      deltaX: 80.5,
      deltaY: 0.125,
      width: 80,
      height: 24,
      viewportWidth: 1024,
      viewportHeight: 600,
    })).toEqual({
      x: 944,
      y: 82.875,
    })
  })

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
