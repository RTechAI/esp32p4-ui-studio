import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIClearUploadedAssets,
  forgeUIFindAlphaContentBounds,
  forgeUIGetUploadedAssets,
  forgeUIParsePngDimensions,
  forgeUIResolveUploadedAssetDimensions,
  forgeUIUpdateUploadedAsset,
} from './ForgeUIUploadedAssetRegistry'

const pngBytes = (width: number, height: number) => {
  const bytes = new Uint8Array(24)
  bytes.set([
    0x89, 0x50, 0x4e, 0x47,
    0x0d, 0x0a, 0x1a, 0x0a,
  ])
  const view = new DataView(bytes.buffer)
  view.setUint32(8, 13)
  bytes.set([0x49, 0x48, 0x44, 0x52], 12)
  view.setUint32(16, width)
  view.setUint32(20, height)
  return bytes
}

const dataUrl = (bytes: Uint8Array) =>
  `data:image/png;base64,${btoa(
    String.fromCharCode(...bytes),
  )}`

describe('uploaded image dimension resolution', () => {
  it('persists selector-created PNG dimensions before browser URLs replace data URLs', () => {
    const source = dataUrl(pngBytes(64, 64))
    const asset = forgeUICreateUploadedAsset(
      new File([pngBytes(64, 64)], 'FiAirplay_64x64.png', { type: 'image/png' }),
      source,
    )
    expect(asset).toMatchObject({ width: 64, height: 64 })
  })

  it('persists intrinsic dimensions in reloadable registry JSON', () => {
    forgeUIClearUploadedAssets()
    forgeUIAddUploadedAssets([{
      id: 'persisted-size', name: 'proof.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: '/proof.png', kind: 'uploaded',
      exportStatus: 'lvgl_ready', lvgl: 'fg_proof', cFile: 'proof.c',
      width: 1024, height: 600,
    }])
    expect(JSON.parse(localStorage.getItem('forgeui_uploaded_assets_v1') || '[]')[0])
      .toMatchObject({ id: 'persisted-size', width: 1024, height: 600 })
    forgeUIClearUploadedAssets()
  })

  it('prefers modern registry dimensions', () => {
    expect(forgeUIResolveUploadedAssetDimensions({
      width: 320,
      height: 180,
      browserSrc: dataUrl(pngBytes(200, 100)),
    })).toEqual({
      width: 320,
      height: 180,
    })
  })

  it('reads legacy PNG IHDR dimensions without decoding the image', () => {
    expect(forgeUIParsePngDimensions(
      pngBytes(200, 100),
    )).toEqual({
      width: 200,
      height: 100,
    })
    expect(forgeUIResolveUploadedAssetDimensions({
      browserSrc: dataUrl(pngBytes(477, 404)),
    })).toEqual({
      width: 477,
      height: 404,
    })
  })

  it('rejects malformed PNG data safely', () => {
    expect(forgeUIParsePngDimensions(
      new Uint8Array([1, 2, 3]),
    )).toBeUndefined()
    expect(forgeUIResolveUploadedAssetDimensions({
      browserSrc: 'data:image/png;base64,not-valid-base64!',
    })).toBeUndefined()

    const malformed = pngBytes(200, 100)
    malformed[12] = 0x42
    expect(forgeUIParsePngDimensions(
      malformed,
    )).toBeUndefined()
  })
})

describe('uploaded image alpha-content bounds', () => {
  const pixels = (
    width: number,
    height: number,
    opaque: Array<[number, number]>,
  ) => {
    const rgba = new Uint8ClampedArray(
      width * height * 4,
    )
    opaque.forEach(([x, y]) => {
      rgba[(y * width + x) * 4 + 3] = 255
    })
    return rgba
  }

  it('reports full bounds for fully opaque artwork', () => {
    const rgba = new Uint8ClampedArray(3 * 2 * 4)
    for (let index = 3; index < rgba.length; index += 4) {
      rgba[index] = 255
    }
    expect(forgeUIFindAlphaContentBounds(
      rgba,
      3,
      2,
    )).toEqual({
      contentX: 0,
      contentY: 0,
      contentWidth: 3,
      contentHeight: 2,
    })
  })

  it('measures transparent margins inclusively', () => {
    expect(forgeUIFindAlphaContentBounds(
      pixels(5, 4, [
        [1, 1],
        [3, 2],
      ]),
      5,
      4,
    )).toEqual({
      contentX: 1,
      contentY: 1,
      contentWidth: 3,
      contentHeight: 2,
    })
  })

  it('falls back safely for empty or malformed pixels', () => {
    expect(forgeUIFindAlphaContentBounds(
      new Uint8ClampedArray(4),
      2,
      2,
    )).toBeUndefined()
    expect(forgeUIFindAlphaContentBounds(
      new Uint8ClampedArray(16),
      2,
      2,
    )).toBeUndefined()
  })
})

describe('uploaded image metadata updates', () => {
  beforeEach(() => {
    forgeUIClearUploadedAssets()
  })

  it('does not notify for an identical metadata write', () => {
    forgeUIAddUploadedAssets([{
      id: 'same',
      name: 'same.png',
      type: 'image/png',
      size: 1,
      createdAt: 1,
      browserSrc: 'old',
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_same',
      cFile: 'same.c',
      width: 10,
      height: 10,
      contentX: 1,
      contentY: 1,
      contentWidth: 8,
      contentHeight: 8,
    }])
    const listener = jest.fn()
    window.addEventListener('forgeui-assets-updated', listener)
    forgeUIUpdateUploadedAsset('same', {
      width: 10,
      height: 10,
      contentX: 1,
      contentY: 1,
      contentWidth: 8,
      contentHeight: 8,
    })
    expect(listener).not.toHaveBeenCalled()
    window.removeEventListener('forgeui-assets-updated', listener)
  })

  it('clears stale measurements for same-ID artwork replacement', () => {
    forgeUIAddUploadedAssets([{
      id: 'replaceable',
      name: 'status.png',
      type: 'image/png',
      size: 1,
      createdAt: 1,
      browserSrc: 'old',
      kind: 'uploaded',
      exportStatus: 'lvgl_ready',
      lvgl: 'fg_status',
      cFile: 'status.c',
      width: 10,
      height: 10,
      contentX: 1,
      contentY: 1,
      contentWidth: 8,
      contentHeight: 8,
    }])
    forgeUIUpdateUploadedAsset('replaceable', {
      browserSrc: 'replacement',
    })
    expect(forgeUIGetUploadedAssets()[0]).toMatchObject({
      id: 'replaceable',
      browserSrc: 'replacement',
    })
    expect(forgeUIGetUploadedAssets()[0].width).toBeUndefined()
    expect(forgeUIGetUploadedAssets()[0].contentWidth).toBeUndefined()
  })

  it('preserves dimensions when conversion only replaces the persistent URL', () => {
    forgeUIAddUploadedAssets([{
      id: 'converted', name: 'proof.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: 'data:image/png;base64,old', kind: 'uploaded',
      exportStatus: 'pending_conversion', lvgl: 'fg_proof', cFile: 'proof.c',
      width: 1024, height: 600,
    }])
    forgeUIUpdateUploadedAsset('converted', {
      browserSrc: 'http://localhost:3030/proof.png',
      exportStatus: 'lvgl_ready',
    }, { preserveDimensions: true })
    expect(forgeUIGetUploadedAssets()[0]).toMatchObject({
      width: 1024,
      height: 600,
      browserSrc: 'http://localhost:3030/proof.png',
    })
  })
})
