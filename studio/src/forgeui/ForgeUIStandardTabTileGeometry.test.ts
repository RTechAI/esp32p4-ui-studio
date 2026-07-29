import {
  getForgeUITabViewGeometry,
  getForgeUITileViewGeometry,
} from './ForgeUIStandardTabTileGeometry'

describe('Standard TabView and TileView geometry', () => {
  it('uses a 34px full-width tab bar and the remaining inner height', () => {
    expect(getForgeUITabViewGeometry({ w: 420, h: 240 })).toEqual({
      width: 420,
      height: 240,
      innerWidth: 418,
      innerHeight: 238,
      tabBarHeight: 34,
      tabWidths: [139, 139, 140],
      contentHeight: 204,
    })
  })

  it('assigns odd remainder pixels without exceeding TabView bounds', () => {
    const geometry = getForgeUITabViewGeometry({ w: 421, h: 241 })

    expect(geometry.tabWidths).toEqual([139, 139, 141])
    expect(geometry.tabWidths.reduce((sum, width) => sum + width, 0))
      .toBe(geometry.innerWidth)
    expect(geometry.tabBarHeight + geometry.contentHeight)
      .toBe(geometry.innerHeight)
  })

  it('matches the preview two-by-two TileView grid exactly', () => {
    expect(getForgeUITileViewGeometry({ w: 420, h: 240 })).toEqual({
      width: 420,
      height: 240,
      innerWidth: 418,
      innerHeight: 238,
      columnWidths: [198, 198],
      rowHeights: [108, 108],
      columnX: [8, 212],
      rowY: [8, 122],
      padding: 8,
      gap: 6,
    })
  })

  it('keeps resized TileView cells inside the serialized bounds', () => {
    const geometry = getForgeUITileViewGeometry({ w: 421, h: 241 })

    expect(geometry.columnWidths).toEqual([198, 199])
    expect(geometry.rowHeights).toEqual([108, 109])
    expect(
      geometry.columnX[1] + geometry.columnWidths[1] + geometry.padding,
    ).toBe(geometry.innerWidth)
    expect(
      geometry.rowY[1] + geometry.rowHeights[1] + geometry.padding,
    ).toBe(geometry.innerHeight)
  })
})
