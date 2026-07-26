import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  fitInteractiveButtonGeometryToContent,
  getInteractiveButtonCommonContentBounds,
} from './ForgeUIInteractiveButtonVisibleBounds'

const asset = (
  id: string,
  bounds: {
    contentX: number
    contentY: number
    contentWidth: number
    contentHeight: number
  },
): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: `${id}.png`,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: id,
  cFile: `${id}.c`,
  width: 200,
  height: 100,
  ...bounds,
})

describe('Interactive Button visible bounds', () => {
  it('uses one stable union box for Normal and Pressed', () => {
    expect(getInteractiveButtonCommonContentBounds(
      asset('normal', {
        contentX: 30,
        contentY: 20,
        contentWidth: 141,
        contentHeight: 61,
      }),
      asset('pressed', {
        contentX: 38,
        contentY: 23,
        contentWidth: 124,
        contentHeight: 54,
      }),
    )).toEqual({
      contentX: 30,
      contentY: 20,
      contentWidth: 141,
      contentHeight: 61,
    })
  })

  it('rejects unavailable or mismatched source geometry', () => {
    const normal = asset('normal', {
      contentX: 30,
      contentY: 20,
      contentWidth: 141,
      contentHeight: 61,
    })
    expect(getInteractiveButtonCommonContentBounds(
      normal,
      {
        ...asset('pressed', {
          contentX: 0,
          contentY: 0,
          contentWidth: 50,
          contentHeight: 50,
        }),
        width: 100,
      },
    )).toBeUndefined()
    expect(getInteractiveButtonCommonContentBounds(
      normal,
      {
        ...normal,
        contentWidth: undefined,
      },
    )).toBeUndefined()
  })

  it('fits component geometry to the visible common crop', () => {
    expect(fitInteractiveButtonGeometryToContent({
      componentX: 10,
      componentY: 20,
      componentWidth: 200,
      componentHeight: 100,
      sourceWidth: 200,
      sourceHeight: 100,
      bounds: {
        contentX: 30,
        contentY: 20,
        contentWidth: 141,
        contentHeight: 61,
      },
    })).toEqual({
      x: 40,
      y: 40,
      w: 141,
      h: 61,
    })
  })
})
