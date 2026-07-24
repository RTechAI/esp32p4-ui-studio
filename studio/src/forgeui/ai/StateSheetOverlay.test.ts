import {
  ForgeUIStateSheetProject,
  getContainedImageBounds,
  moveStateSheetRegion,
  resizeStateSheetRegions,
} from './StateSheetOverlay'

const project: ForgeUIStateSheetProject = {
  sourceWidth: 1000,
  sourceHeight: 500,
  cropWidth: 300,
  cropHeight: 300,
  regions: [
    { id: 'off', label: 'OFF', x: 50, y: 100 },
    { id: 'on', label: 'ON', x: 650, y: 100 },
  ],
}

describe('StateSheetOverlay geometry', () => {
  it('locates a contained source image inside letterboxing', () => {
    expect(
      getContainedImageBounds(600, 600, 1000, 500),
    ).toEqual({
      left: 0,
      top: 150,
      width: 600,
      height: 300,
    })
  })

  it('moves one region independently in source pixels', () => {
    const moved = moveStateSheetRegion(
      project,
      'off',
      175,
      25,
    )

    expect(moved.regions).toEqual([
      { id: 'off', label: 'OFF', x: 175, y: 25 },
      { id: 'on', label: 'ON', x: 650, y: 100 },
    ])
  })

  it('shares resized dimensions and clamps every region', () => {
    const resized = resizeStateSheetRegions(
      project,
      'off',
      450,
      400,
      20,
      50,
    )

    expect(resized.cropWidth).toBe(450)
    expect(resized.cropHeight).toBe(400)
    expect(resized.regions).toEqual([
      { id: 'off', label: 'OFF', x: 20, y: 50 },
      { id: 'on', label: 'ON', x: 550, y: 100 },
    ])
  })
})
