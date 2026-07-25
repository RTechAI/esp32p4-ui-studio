import {
  forgeUIAddUploadedAssets,
  forgeUICreateUploadedAsset,
} from '~forgeui/ForgeUIUploadedAssetRegistry'
import {
  generateThreePositionToggleSet,
} from './ForgeUIAIImagePipeline'

jest.mock('~forgeui/ForgeUIUploadedAssetRegistry', () => ({
  forgeUIAddUploadedAssets: jest.fn(),
  forgeUICreateUploadedAsset: jest.fn(),
  forgeUIUpdateUploadedAsset: jest.fn(),
}))

const mockedCreate =
  forgeUICreateUploadedAsset as jest.MockedFunction<
    typeof forgeUICreateUploadedAsset
  >
const mockedAdd =
  forgeUIAddUploadedAssets as jest.MockedFunction<
    typeof forgeUIAddUploadedAssets
  >

describe('shared Toggle set generation', () => {
  const originalImage = global.Image
  const originalFetch = global.fetch
  const originalCreateElement = document.createElement.bind(
    document,
  )

  afterEach(() => {
    global.Image = originalImage
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it('derives three equal state crops from one generated master', async () => {
    const drawImage = jest.fn()
    global.Image = class {
      naturalWidth = 1536
      naturalHeight = 1024
      onload?: () => void
      onerror?: () => void

      set src(_value: string) {
        this.onload?.()
      }
    } as any
    jest.spyOn(document, 'createElement')
      .mockImplementation((tagName: string) => {
        if (tagName !== 'canvas') {
          return originalCreateElement(tagName)
        }
        return {
          width: 0,
          height: 0,
          getContext: () => ({ drawImage }),
          toDataURL: () =>
            'data:image/png;base64,Y3JvcA==',
          toBlob: (callback: (blob: Blob) => void) =>
            callback(new Blob(['crop'], {
              type: 'image/png',
            })),
        } as any
      })

    const fetchMock = jest.fn(
      async (
        input: RequestInfo | URL,
        _init?: RequestInit,
      ) => {
        if (input === '/api/forgeui-ai-hero') {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              image: 'data:image/png;base64,master',
            }),
          } as Response
        }
        if (
          input ===
          'http://localhost:3030/convert-lvgl-image'
        ) {
          return {
            ok: true,
            json: async () => ({
              ok: true,
              symbolName: 'fg_state',
              assetSource: 'state.c',
            }),
          } as Response
        }
        return {
          ok: true,
          blob: async () => new Blob(['crop'], {
            type: 'image/png',
          }),
        } as Response
      },
    )
    global.fetch = fetchMock as typeof fetch

    let assetIndex = 0
    mockedCreate.mockImplementation(
      (file, browserSrc) => ({
        id: ['left', 'center', 'right'][assetIndex++],
        name: file.name,
        type: file.type,
        size: file.size,
        createdAt: 1,
        browserSrc,
        kind: 'uploaded',
        exportStatus: 'pending_conversion',
        lvgl: 'fg_pending',
        cFile: '',
      }),
    )

    const result = await generateThreePositionToggleSet({
      prompt: 'Premium industrial selector',
      width: 300,
      height: 200,
    })

    const generationCalls = fetchMock.mock.calls.filter(
      ([input]) => input === '/api/forgeui-ai-hero',
    )
    expect(generationCalls).toHaveLength(1)
    expect(JSON.parse(
      (generationCalls[0][1] as RequestInit).body as string,
    )).toMatchObject({
      mode: 'three-position-set',
    })
    expect(drawImage.mock.calls.map(call =>
      call.slice(1, 5),
    )).toEqual([
      [0, 0, 1536, 341],
      [0, 341, 1536, 341],
      [0, 682, 1536, 341],
    ])
    const conversionCalls = fetchMock.mock.calls.filter(
      ([input]) =>
        input ===
        'http://localhost:3030/convert-lvgl-image',
    )
    expect(conversionCalls).toHaveLength(3)
    expect(fetchMock.mock.calls.some(
      ([input]) =>
        typeof input === 'string' &&
        input.startsWith('data:image/'),
    )).toBe(false)
    conversionCalls.forEach(([, init]) => {
      expect(JSON.parse(
        (init as RequestInit).body as string,
      )).toMatchObject({
        base64: expect.stringMatching(
          /^data:image\/png;base64,/,
        ),
        assetMode: 'interactive_button',
        width: 300,
        height: 200,
      })
    })
    expect([
      result.left.id,
      result.center.id,
      result.right.id,
    ]).toEqual(['left', 'center', 'right'])
    expect([
      result.left.width,
      result.center.width,
      result.right.width,
    ]).toEqual([300, 300, 300])
    expect([
      result.left.height,
      result.center.height,
      result.right.height,
    ]).toEqual([200, 200, 200])
    expect(mockedAdd).toHaveBeenCalledTimes(1)
    expect(mockedAdd.mock.calls[0][0]).toHaveLength(3)
    mockedCreate.mock.calls.forEach(([file, browserSrc]) => {
      expect(file.type).toBe('image/png')
      expect(file.size).toBe(4)
      expect(browserSrc).toBe(
        'data:image/png;base64,Y3JvcA==',
      )
    })

    mockedAdd.mockClear()
    assetIndex = 0
    let conversionAttempt = 0
    fetchMock.mockImplementation(async input => {
      if (input === '/api/forgeui-ai-hero') {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            image: 'data:image/png;base64,master',
          }),
        } as Response
      }
      if (
        input ===
        'http://localhost:3030/convert-lvgl-image'
      ) {
        conversionAttempt += 1
        if (conversionAttempt === 2) {
          throw new TypeError('Failed to fetch')
        }
        return {
          ok: true,
          json: async () => ({
            ok: true,
            symbolName: 'fg_state',
            assetSource: 'state.c',
          }),
        } as Response
      }
      throw new Error(`Unexpected request: ${String(input)}`)
    })

    await expect(generateThreePositionToggleSet({
      prompt: 'Premium industrial selector',
      width: 300,
      height: 200,
    })).rejects.toThrow(
      'Unable to reach the ForgeUI image converter at http://localhost:3030/convert-lvgl-image: Failed to fetch',
    )
    expect(mockedAdd).not.toHaveBeenCalled()
  })
})
