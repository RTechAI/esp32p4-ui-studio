import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import {
  createDefaultInteractiveLightAsset,
} from './ForgeUIInteractiveLightAsset'
import {
  getInteractiveButtonComponentProps,
  getInteractiveButtonDimensions,
  isLvglReadyUploadedAsset,
  resolveInteractiveButtonVisuals,
  getInteractiveLightComponentProps,
  getInteractiveLightDimensions,
  getInteractiveLightInitialState,
  resolveInteractiveLightVisuals,
} from './ForgeUIInteractiveAssetResolver'

const createUploadedAsset = (
  id: string,
  exportStatus: ForgeUIUploadedAsset['exportStatus'],
): ForgeUIUploadedAsset => ({
  id,
  name: `${id}.png`,
  type: 'image/png',
  size: 100,
  createdAt: 1,
  browserSrc: `data:image/png;base64,${id}`,
  kind: 'uploaded',
  exportStatus,
  lvgl: `fg_upload_${id}`,
  cFile: `assets/uploads/fg_upload_${id}.c`,
})

describe('Interactive Asset resolution', () => {
  const normalAsset = createUploadedAsset(
    'normal',
    'lvgl_ready',
  )
  const pressedAsset = createUploadedAsset(
    'pressed',
    'lvgl_ready',
  )

  const button = {
    ...createDefaultInteractiveButtonAsset('button'),
    width: 120,
    height: 48,
    normalAssetId: normalAsset.id,
    pressedAssetId: pressedAsset.id,
  }

  it('resolves both button visuals from the uploaded registry', () => {
    expect(
      resolveInteractiveButtonVisuals(
        button,
        [normalAsset, pressedAsset],
      ),
    ).toEqual({ normalAsset, pressedAsset })
  })

  it('preserves component assignment prop names and string values', () => {
    expect(getInteractiveButtonComponentProps(button)).toEqual({
      interactiveAssetId: 'button',
      w: '120',
      h: '48',
    })
  })

  it('uses asset dimensions before component fallbacks', () => {
    expect(
      getInteractiveButtonDimensions(button, {
        width: 80,
        height: 32,
      }),
    ).toEqual({ width: 120, height: 48 })
  })

  it('identifies only LVGL-ready uploaded assets', () => {
    expect(isLvglReadyUploadedAsset(normalAsset)).toBe(true)
    expect(
      isLvglReadyUploadedAsset(
        createUploadedAsset('pending', 'pending_conversion'),
      ),
    ).toBe(false)
  })

  it('resolves Light visuals, dimensions, assignment, and initial state', () => {
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      width: 32,
      height: 32,
      offAssetId: normalAsset.id,
      onAssetId: pressedAsset.id,
      initialState: 'on' as const,
    }

    expect(
      resolveInteractiveLightVisuals(
        light,
        [normalAsset, pressedAsset],
      ),
    ).toEqual({
      offAsset: normalAsset,
      onAsset: pressedAsset,
    })
    expect(getInteractiveLightDimensions(light, {
      width: 10,
      height: 10,
    })).toEqual({ width: 32, height: 32 })
    expect(getInteractiveLightComponentProps(light)).toEqual({
      interactiveAssetId: 'light',
      w: '32',
      h: '32',
    })
    expect(getInteractiveLightInitialState(light)).toBe('on')
  })

  it('handles missing Light visuals and defaults invalid state to off', () => {
    const light = {
      ...createDefaultInteractiveLightAsset('light'),
      initialState: 'invalid' as any,
    }

    expect(resolveInteractiveLightVisuals(light, [])).toEqual({
      offAsset: undefined,
      onAsset: undefined,
    })
    expect(getInteractiveLightInitialState(light)).toBe('off')
  })
})
