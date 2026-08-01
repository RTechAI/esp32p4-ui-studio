import { getVerticalDividerDropGeometry } from './DividerPanel'

describe('Divider vertical insertion usability', () => {
  it('turns only the untouched horizontal drop geometry vertical', () => {
    expect(getVerticalDividerDropGeometry(180, 2)).toEqual({ w: 2, h: 180 })
    expect(getVerticalDividerDropGeometry(240, 2)).toBeNull()
    expect(getVerticalDividerDropGeometry(2, 100)).toBeNull()
  })
})
