import { getForgeUIStandardIconPresentation } from './ForgeUIStandardIcon'

describe('Standard Icon presentation parity', () => {
  it('fits an unset icon size to the shortest component edge', () => {
    expect(getForgeUIStandardIconPresentation(
      { icon: 'FiSettings', w: 96, h: 80 },
      '#F5F5F5',
    )).toMatchObject({
      icon: 'FiSettings',
      iconSize: 74,
      color: '#F5F5F5',
    })
  })

  it('leaves non-zero automatic padding on every component edge', () => {
    const model = getForgeUIStandardIconPresentation(
      { icon: 'FiSettings', w: 96, h: 80 },
      '#F5F5F5',
    )
    expect((96 - model.iconSize) / 2).toBeGreaterThan(0)
    expect((80 - model.iconSize) / 2).toBeGreaterThan(0)
  })

  it('preserves an explicit rendered size for preview and export consumers', () => {
    expect(getForgeUIStandardIconPresentation(
      { icon: 'FiSettings', w: 96, h: 80, boxSize: 64 },
      '#F5F5F5',
    ).iconSize).toBe(64)
  })
})
