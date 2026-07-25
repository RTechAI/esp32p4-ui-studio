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

  it('moves one Three-Position crop without moving the other rows', () => {
    const threePosition: ForgeUIStateSheetProject = {
      sourceWidth: 900,
      sourceHeight: 900,
      cropWidth: 500,
      cropHeight: 200,
      regions: [
        { id: 'left', label: 'LEFT', x: 100, y: 100 },
        { id: 'center', label: 'CENTER', x: 100, y: 300 },
        { id: 'right', label: 'RIGHT', x: 100, y: 500 },
      ],
    }

    const moved = moveStateSheetRegion(
      threePosition,
      'center',
      250,
      250,
    )

    expect(moved.regions.map(region => [region.x, region.y]))
      .toEqual([[100, 100], [250, 250], [100, 500]])
  })

  it('shares Three-Position dimensions while preserving independent positions', () => {
    const threePosition: ForgeUIStateSheetProject = {
      sourceWidth: 900,
      sourceHeight: 900,
      cropWidth: 500,
      cropHeight: 200,
      regions: [
        { id: 'left', label: 'LEFT', x: 100, y: 100 },
        { id: 'center', label: 'CENTER', x: 100, y: 300 },
        { id: 'right', label: 'RIGHT', x: 100, y: 500 },
      ],
    }

    const resized = resizeStateSheetRegions(
      threePosition,
      'center',
      600,
      250,
      150,
      225,
      'bottomRight',
    )

    expect(resized.cropWidth).toBe(600)
    expect(resized.cropHeight).toBe(250)
    expect(resized.regions.map(region => [region.x, region.y]))
      .toEqual([[100, 100], [100, 300], [100, 500]])
  })

  const linkedProject: ForgeUIStateSheetProject = {
    sourceWidth: 1000,
    sourceHeight: 1000,
    cropWidth: 200,
    cropHeight: 100,
    regions: [
      { id: 'left', label: 'LEFT', x: 100, y: 100 },
      { id: 'center', label: 'CENTER', x: 200, y: 300 },
      { id: 'right', label: 'RIGHT', x: 300, y: 500 },
    ],
  }

  it('anchors every right edge during a linked left resize', () => {
    const resized = resizeStateSheetRegions(
      linkedProject,
      'center',
      150,
      100,
      250,
      300,
      'left',
    )

    expect(resized.regions.map(region => region.x))
      .toEqual([150, 250, 350])
    expect(resized.regions.map(region =>
      region.x + resized.cropWidth,
    )).toEqual([300, 400, 500])
  })

  it('does not shift linked positions for right or bottom resizing', () => {
    const rightResized = resizeStateSheetRegions(
      linkedProject,
      'center',
      250,
      100,
      200,
      300,
      'right',
    )
    const bottomResized = resizeStateSheetRegions(
      linkedProject,
      'center',
      200,
      140,
      200,
      300,
      'bottom',
    )

    expect(rightResized.regions.map(region => region.x))
      .toEqual([100, 200, 300])
    expect(bottomResized.regions.map(region => region.y))
      .toEqual([100, 300, 500])
  })

  it.each([
    ['topLeft', 50, 20],
    ['topRight', 0, 20],
    ['bottomLeft', 50, 0],
    ['bottomRight', 0, 0],
  ])(
    'combines linked position deltas for the %s handle',
    (direction, expectedXShift, expectedYShift) => {
      const resized = resizeStateSheetRegions(
        linkedProject,
        'center',
        150,
        80,
        250,
        320,
        direction,
      )

      expect(resized.regions.map(region => region.x))
        .toEqual([100, 200, 300].map(
          value => value + expectedXShift,
        ))
      expect(resized.regions.map(region => region.y))
        .toEqual([100, 300, 500].map(
          value => value + expectedYShift,
        ))
    },
  )
})
