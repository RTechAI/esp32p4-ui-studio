import { forgeuiNativeSelectGlobalStyles } from './ForgeUIControlStyle'

describe('ForgeUI native dropdown theme contract', () => {
  it('defines readable dark popup, hover, selection, disabled and focus states', () => {
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select, select']).toEqual(
      expect.objectContaining({ colorScheme: 'dark' }),
    )
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select option, select option']).toEqual(
      expect.objectContaining({ backgroundColor: '#0f172a !important', color: '#f8fafc !important' }),
    )
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select option:hover, select option:hover']).toEqual(
      expect.objectContaining({ backgroundColor: '#1e293b !important', color: '#ffffff !important' }),
    )
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select option:checked, select option:checked']).toEqual(
      expect.objectContaining({ backgroundColor: '#0f766e !important', color: '#ffffff !important' }),
    )
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select option:disabled, select option:disabled']).toEqual(
      expect.objectContaining({ color: '#64748b !important' }),
    )
    expect(forgeuiNativeSelectGlobalStyles['.chakra-select:focus-visible, select:focus-visible']).toEqual(
      expect.objectContaining({ borderColor: '#38bdf8 !important' }),
    )
  })
})
