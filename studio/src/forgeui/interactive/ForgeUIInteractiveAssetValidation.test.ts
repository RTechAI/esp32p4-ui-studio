import {
  validateInteractiveAsset,
  validateInteractiveLightAsset,
} from './ForgeUIInteractiveAssetValidation'
import {
  createDefaultInteractiveLightAsset,
} from './ForgeUIInteractiveLightAsset'

describe('Interactive Light validation', () => {
  const createLight = () =>
    createDefaultInteractiveLightAsset('light')

  it.each(['off', 'on'] as const)(
    'accepts the %s initial state',
    initialState => {
      expect(() =>
        validateInteractiveAsset({
          ...createLight(),
          initialState,
        }),
      ).not.toThrow()
    },
  )

  it('rejects the wrong kind', () => {
    expect(() =>
      validateInteractiveLightAsset({
        ...createLight(),
        kind: 'button',
      }),
    ).toThrow('Interactive asset kind must be light')
  })

  it('rejects the wrong interaction mode', () => {
    expect(() =>
      validateInteractiveLightAsset({
        ...createLight(),
        interactionMode: 'momentary',
      }),
    ).toThrow('Light interaction mode must be state')
  })

  it.each([
    ['width', 0],
    ['height', -1],
  ])('rejects invalid %s', (property, value) => {
    expect(() =>
      validateInteractiveLightAsset({
        ...createLight(),
        [property]: value,
      }),
    ).toThrow()
  })

  it('rejects an invalid initial state', () => {
    expect(() =>
      validateInteractiveLightAsset({
        ...createLight(),
        initialState: 'unknown',
      }),
    ).toThrow('Light initialState must be off or on')
  })
})
