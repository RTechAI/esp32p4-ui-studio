import {
  getInteractiveButtonHookPreview,
  getNextInteractiveButtonLabel,
} from './ForgeUIInteractiveButtonHook'

describe('Interactive Button default Label selection', () => {
  it('starts at Button 1 with no existing Labels', () => {
    expect(getNextInteractiveButtonLabel([])).toBe('Button 1')
  })

  it('uses the next available positive number', () => {
    expect(getNextInteractiveButtonLabel([
      'Button 1',
    ])).toBe('Button 2')
  })

  it('fills the lowest available gap', () => {
    expect(getNextInteractiveButtonLabel([
      'Button 1',
      'Button 2',
      'Button 4',
    ])).toBe('Button 3')
  })

  it('treats normalized callback collisions as occupied', () => {
    expect(getNextInteractiveButtonLabel([
      'Button 1',
      'Button-2',
    ])).toBe('Button 3')
  })

  it('preserves generated callback naming', () => {
    expect(getInteractiveButtonHookPreview('Button 3'))
      .toBe('FG_On_Button3_Clicked(void)')
  })
})
