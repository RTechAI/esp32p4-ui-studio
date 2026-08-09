import { extractForgeAIJsonText } from './ForgeAIParser'

describe('canonical ForgeUI AI JSON extraction', () => {
  it.each([
    ['canonical JSON', '{"layout":[]}'],
    ['markdown-fenced JSON', '```json\n{"layout":[]}\n```'],
    ['harmless surrounding text', 'Here is the layout:\n{"layout":[]}\nDone.'],
  ])('extracts %s', (_label, response) => {
    expect(JSON.parse(extractForgeAIJsonText(response))).toEqual({ layout: [] })
  })

  it('rejects a response without a JSON object', () => {
    expect(() => extractForgeAIJsonText('not JSON')).toThrow(
      'AI response does not contain a JSON object',
    )
  })
})
