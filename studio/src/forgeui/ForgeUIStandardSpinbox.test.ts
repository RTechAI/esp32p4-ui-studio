import {
  formatForgeUIStandardSpinboxValue,
  getForgeUIStandardSpinboxModel,
  stepForgeUIStandardSpinboxValue,
} from './ForgeUIStandardSpinbox'

describe('Standard Spinbox model', () => {
  it('normalizes reversed signed ranges, value, powers of ten and format', () => {
    const model = getForgeUIStandardSpinboxModel({
      min: 100,
      max: -100,
      value: -250,
      step: 57,
      digitCount: 3,
      decimalPlaces: 2,
    })
    expect(model).toMatchObject({
      minimum: -100,
      maximum: 100,
      value: -100,
      step: 10,
      digitCount: 3,
      decimalPlaces: 2,
      separatorPosition: 1,
      cursorPosition: 1,
    })
    expect(formatForgeUIStandardSpinboxValue(model)).toBe('-1.00')
  })

  it('clamps digit capacity and safely bounds appearance', () => {
    expect(getForgeUIStandardSpinboxModel({
      min: -999999,
      max: 999999,
      digitCount: 2,
      decimalPlaces: 9,
      opacity: 500,
      padding: -5,
      textAlign: 'diagonal',
    })).toMatchObject({
      minimum: -99,
      maximum: 99,
      digitCount: 2,
      decimalPlaces: 1,
      opacity: 100,
      padding: 0,
      textAlign: 'right',
    })
  })

  it('steps, clamps and rolls over using native integer backing values', () => {
    const normal = getForgeUIStandardSpinboxModel({
      min: 0, max: 9, value: 9, rollover: false,
    })
    const rollover = { ...normal, rollover: true }
    expect(stepForgeUIStandardSpinboxValue(normal, 9, 1)).toBe(9)
    expect(stepForgeUIStandardSpinboxValue(rollover, 9, 1)).toBe(0)
    expect(stepForgeUIStandardSpinboxValue(rollover, 0, -1)).toBe(9)
    const signed = getForgeUIStandardSpinboxModel({
      min: -100, max: 100, step: 10,
    })
    expect(stepForgeUIStandardSpinboxValue(signed, -3, 1)).toBe(3)
    expect(stepForgeUIStandardSpinboxValue(signed, 3, -1)).toBe(-3)
  })
})
