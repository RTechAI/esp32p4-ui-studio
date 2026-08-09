import { createForgeAIContext } from './ForgeAIContext'

describe('ForgeAI weather icon context', () => {
  it('supplies differentiated valid icon choices for weather semantics', () => {
    const context = createForgeAIContext({
      userPrompt: 'sunny, cloudy, partly-cloudy and rain forecasts',
    })
    const groups = new Map(
      context.relevantIcons.map(group => [group.query, group.matches]),
    )

    expect(groups.get('sun')).toEqual(expect.arrayContaining(['FiSun']))
    expect(groups.get('cloud')).toEqual(
      expect.arrayContaining(['FiCloud']),
    )
    expect(groups.get('rain')).toEqual(
      expect.arrayContaining(['FiCloudRain']),
    )
  })
})
