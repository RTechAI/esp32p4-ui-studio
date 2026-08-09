import { requestForgeAILayout } from './ForgeAIClient'

describe('ForgeAI client response envelope', () => {
  afterEach(() => jest.restoreAllMocks())

  it('passes a Weather region document to the authoritative engine validators', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        document: {
          template: 'weather-dashboard',
          regions: { 'current-weather': [] },
        },
      }),
    })) as jest.Mock

    await expect(requestForgeAILayout({ prompt: 'weather', systemPrompt: 'rules' }))
      .resolves.toEqual({
        document: {
          template: 'weather-dashboard',
          regions: { 'current-weather': [] },
        },
      })
  })

  it('returns a concise reason for a genuinely invalid root envelope', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    global.fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, document: [] }),
    })) as jest.Mock

    await expect(requestForgeAILayout({ prompt: 'weather', systemPrompt: 'rules' }))
      .rejects.toThrow(
        'ForgeUI AI returned an invalid document envelope: invalid root object',
      )
  })
})
