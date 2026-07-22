import { allocateUniqueOutputApiName } from './ForgeUIGeneratedApiNames'

describe('generated output API names', () => {
  it('allocates deterministic suffixes in one shared output namespace', () => {
    const usedNames = new Set<string>()

    expect(allocateUniqueOutputApiName('Status_Light', usedNames))
      .toBe('FG_Set_Status_Light')
    expect(allocateUniqueOutputApiName('Status_Light', usedNames))
      .toBe('FG_Set_Status_Light_2')
    expect(allocateUniqueOutputApiName('Status_Light', usedNames))
      .toBe('FG_Set_Status_Light_3')
  })

  it('honours names already allocated by another output component kind', () => {
    const usedNames = new Set(['FG_Set_System_Status'])

    expect(allocateUniqueOutputApiName('System_Status', usedNames))
      .toBe('FG_Set_System_Status_2')
  })
})
