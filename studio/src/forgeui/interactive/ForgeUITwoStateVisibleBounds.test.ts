import {
  getCommonContentBounds,
  fitTwoStateGeometryToContent,
  getTwoStateCommonContentBounds,
  twoStateBoundsNeedFitting,
} from './ForgeUITwoStateVisibleBounds'
import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

const image = (
  id: string,
  bounds: {
    contentX: number
    contentY: number
    contentWidth: number
    contentHeight: number
  },
): ForgeUIUploadedAsset => ({
  id,
  name: id,
  type: 'image/png',
  size: 1,
  createdAt: 1,
  browserSrc: id,
  kind: 'uploaded',
  exportStatus: 'lvgl_ready',
  lvgl: id,
  cFile: `${id}.c`,
  width: 200,
  height: 100,
  ...bounds,
})

describe('shared two-state visible bounds', () => {
  it('uses a stable union crop for both states', () => {
    const first = image('off', {
      contentX: 20,
      contentY: 15,
      contentWidth: 120,
      contentHeight: 60,
    })
    const second = image('on', {
      contentX: 10,
      contentY: 20,
      contentWidth: 160,
      contentHeight: 70,
    })

    expect(getTwoStateCommonContentBounds(first, second))
      .toEqual({
        contentX: 10,
        contentY: 15,
        contentWidth: 160,
        contentHeight: 75,
      })
  })

  it('preserves visible position while shrinking geometry', () => {
    expect(fitTwoStateGeometryToContent({
      componentX: 100,
      componentY: 50,
      componentWidth: 200,
      componentHeight: 100,
      sourceWidth: 200,
      sourceHeight: 100,
      bounds: {
        contentX: 20,
        contentY: 10,
        contentWidth: 160,
        contentHeight: 80,
      },
    })).toEqual({
      x: 120,
      y: 60,
      w: 160,
      h: 80,
    })
  })

  it('does not offer another fit for full-image bounds', () => {
    const full = image('fitted', {
      contentX: 0,
      contentY: 0,
      contentWidth: 200,
      contentHeight: 100,
    })
    expect(twoStateBoundsNeedFitting(
      full,
      getTwoStateCommonContentBounds(full, full)!,
    )).toBe(false)
  })

  it('builds one stable union across three measured states', () => {
    expect(getCommonContentBounds([
      image('left', {
        contentX: 20, contentY: 10,
        contentWidth: 100, contentHeight: 70,
      }),
      image('center', {
        contentX: 10, contentY: 20,
        contentWidth: 160, contentHeight: 60,
      }),
      image('right', {
        contentX: 30, contentY: 5,
        contentWidth: 150, contentHeight: 90,
      }),
    ])).toEqual({
      contentX: 10,
      contentY: 5,
      contentWidth: 170,
      contentHeight: 90,
    })
  })
})
