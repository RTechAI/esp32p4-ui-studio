import { buildGenerationPrompt } from '../../pages/api/forgeui-ai-hero'

it('specifies the fixed Three-Position top, middle and bottom row order', () => {
  const prompt = buildGenerationPrompt(
    'Industrial selector',
    'three-position-set',
  )

  expect(prompt).toContain(
    'TOP ROW (ROW 1): LEFT state active',
  )
  expect(prompt).toContain(
    'MIDDLE ROW (ROW 2): CENTER state active',
  )
  expect(prompt).toContain(
    'BOTTOM ROW (ROW 3): RIGHT state active',
  )
  expect(prompt).toContain(
    'TOP = LEFT, MIDDLE = CENTER, BOTTOM = RIGHT',
  )
  expect(prompt).toContain(
    'exactly three equal horizontal rows',
  )
  expect(prompt).toContain('no reordered states')
  expect(prompt).toContain('no extra switches, collage')
})
