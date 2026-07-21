import type {
  ForgeUIUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import {
  createDefaultInteractiveButtonAsset,
} from './ForgeUIInteractiveButtonAsset'
import {
  getInteractiveButtonComponentProps,
  getInteractiveButtonDimensions,
  isLvglReadyUploadedAsset,
  resolveInteractiveButtonVisuals,
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
})
