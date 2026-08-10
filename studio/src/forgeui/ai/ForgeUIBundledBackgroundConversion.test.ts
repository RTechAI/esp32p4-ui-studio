import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
  forgeUIUpdateUploadedAsset,
} from '../ForgeUIUploadedAssetRegistry'
import { registerAndConvertImage } from './ForgeUIAIImagePipeline'

jest.mock('../ForgeUIUploadedAssetRegistry', () => ({
  forgeUIAddUploadedAssets: jest.fn(),
  forgeUICreateUploadedAsset: jest.fn(),
  forgeUIUpdateUploadedAsset: jest.fn(),
}))

describe('bundled background conversion payload', () => {
  it('sends fetched PNG bytes rather than the browser preview path', async () => {
    const sourceBlob = new Blob(['real-png-bytes'], { type: 'image/png' })
    ;(forgeUICreateUploadedAsset as jest.Mock).mockReturnValue({
      id: 'blue-edge', name: 'blue-edge.png', type: 'image/png', size: 14,
      createdAt: 1, browserSrc: '/assets/backgrounds/blue-edge.png',
      kind: 'uploaded', exportStatus: 'pending_conversion',
      lvgl: 'fg_blue_edge', cFile: 'assets/uploads/fg_blue_edge.c',
    })
    const fetchMock = jest.fn(async (
      input: RequestInfo | URL,
      _init?: RequestInit,
    ) => {
      if (input === '/assets/backgrounds/blue-edge.png') {
        return { ok: true, blob: async () => sourceBlob } as Response
      }
      return {
        ok: true,
        json: async () => ({
          ok: true, symbolName: 'fg_blue_edge',
          assetSource: 'assets/uploads/fg_blue_edge.c',
        }),
      } as Response
    })
    const originalFetch = global.fetch
    global.fetch = fetchMock as typeof fetch
    try {
      await registerAndConvertImage({
        browserSrc: '/assets/backgrounds/blue-edge.png',
        filePrefix: 'background_blue_edge', assetMode: 'hero',
        width: 1024, height: 600, recordDimensions: true,
      })
      const conversion = fetchMock.mock.calls[1]
      const payload = JSON.parse((conversion[1] as RequestInit).body as string)
      expect(payload.base64).toMatch(/^data:image\/png;base64,/)
      expect(payload.base64).not.toContain('/assets/backgrounds/blue-edge.png')
      expect(payload.sourceBrowserSrc).toBe('/assets/backgrounds/blue-edge.png')
      expect(payload.sourceAssetId).toBe('background_blue_edge')
      expect(forgeUIAddUploadedAssets).toHaveBeenCalled()
      expect(forgeUIUpdateUploadedAsset).toHaveBeenCalledWith(
        'blue-edge', expect.objectContaining({ exportStatus: 'lvgl_ready' }),
      )
    } finally {
      global.fetch = originalFetch
    }
  })
})
