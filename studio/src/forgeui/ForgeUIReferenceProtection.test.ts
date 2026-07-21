import {
  findInteractiveAssetReferences,
  findUploadedAssetReferences,
} from './ForgeUIReferenceProtection'

describe('ForgeUI reference protection', () => {
  it('prevents deletion of referenced uploaded and Interactive Assets', () => {
    const button = { id: 'button', name: 'Start', kind: 'button',
      normalAssetId: 'image', pressedAssetId: 'other' }
    expect(findUploadedAssetReferences('image', [button] as any)).toEqual([
      { type: 'Button', name: 'Start' },
    ])
    expect(findInteractiveAssetReferences('button', {
      start: { id: 'start', componentName: 'Start', props: { interactiveAssetId: 'button' } },
    } as any)).toEqual([{ type: 'Canvas', name: 'Start' }])
  })

  it('discovers Light and active Theme uploaded-asset references without mutation', () => {
    const light = { id: 'light', name: 'WiFi', kind: 'light',
      offAssetId: 'image', onAssetId: 'other' }
    const before = JSON.stringify(light)
    const references = findUploadedAssetReferences('image', [light] as any, 'image')
    const mutations = {
      registry: jest.fn(),
      persistence: jest.fn(),
      canvas: jest.fn(),
      theme: jest.fn(),
      revokeBlobUrl: jest.fn(),
      disk: jest.fn(),
    }
    if (references.length === 0) {
      Object.values(mutations).forEach(mutation => mutation())
    }

    expect(references).toEqual([
      { type: 'Light', name: 'WiFi' },
      { type: 'Theme', name: 'Current theme' },
    ])
    Object.values(mutations).forEach(mutation => {
      expect(mutation).not.toHaveBeenCalled()
    })
    expect(JSON.stringify(light)).toBe(before)
  })

  it('blocks an assigned Interactive Light before any deletion mutation', () => {
    const components = {
      light: { id: 'light-component', componentName: 'WiFi Status',
        props: { interactiveAssetId: 'interactive-light' } },
    }
    const before = JSON.stringify(components)
    const references = findInteractiveAssetReferences(
      'interactive-light', components as any,
    )
    const mutations = {
      registry: jest.fn(),
      persistence: jest.fn(),
      canvas: jest.fn(),
      theme: jest.fn(),
      revokeBlobUrl: jest.fn(),
      disk: jest.fn(),
    }
    if (references.length === 0) {
      Object.values(mutations).forEach(mutation => mutation())
    }

    expect(references).toEqual([
      { type: 'Canvas', name: 'WiFi Status' },
    ])
    Object.values(mutations).forEach(mutation => {
      expect(mutation).not.toHaveBeenCalled()
    })
    expect(JSON.stringify(components)).toBe(before)
  })
})
