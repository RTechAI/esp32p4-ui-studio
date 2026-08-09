import {
  autoArrangeForgeUIRegion,
  composeForgeUIDashboardTemplate,
  forgeUIDashboardTemplate,
  forgeUIWeatherDashboardTemplate,
  forgeUILayoutTemplates,
  composeForgeUILayoutTemplate,
} from './ForgeUILayoutDesigner'

const asComponent = (
  id: string,
  type: ComponentType,
  props: Record<string, unknown>,
): IComponent => ({
  id,
  parent: 'root',
  type,
  props,
  children: [],
})

const overlaps = (
  first: Record<string, unknown>,
  second: Record<string, unknown>,
) => {
  const a = {
    x: Number(first.x),
    y: Number(first.y),
    w: Number(first.w),
    h: Number(first.h),
  }
  const b = {
    x: Number(second.x),
    y: Number(second.y),
    w: Number(second.w),
    h: Number(second.h),
  }
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  )
}

describe('ForgeUI Dashboard Layout Designer', () => {
  it('provides deterministic Weather Dashboard geometry with five equal forecast regions', () => {
    expect(forgeUILayoutTemplates).toContain(forgeUIWeatherDashboardTemplate)
    expect(forgeUIWeatherDashboardTemplate).toMatchObject({
      id: 'weather-dashboard',
      name: 'Weather Dashboard',
      width: 1024,
      height: 600,
    })
    const regions = forgeUIWeatherDashboardTemplate.layout.map(
      item => item.props,
    )
    expect(regions.map(item => item.layoutRegionKey)).toEqual([
      'weather-dashboard.header-left',
      'weather-dashboard.header-right',
      'weather-dashboard.current-weather',
      'weather-dashboard.metrics',
      'weather-dashboard.forecast-day1',
      'weather-dashboard.forecast-day2',
      'weather-dashboard.forecast-day3',
      'weather-dashboard.forecast-day4',
      'weather-dashboard.forecast-day5',
    ])
    const forecast = regions.filter(item =>
      String(item.layoutRegionKey).includes('forecast-day'),
    )
    expect(forecast).toHaveLength(5)
    expect(new Set(forecast.map(item => item.w))).toEqual(new Set([180]))
    expect(new Set(forecast.map(item => item.y))).toEqual(new Set([468]))
    expect(new Set(forecast.map(item => item.h))).toEqual(new Set([108]))
  })

  it('deterministically contains Weather hero, header and five forecast compositions', () => {
    const content: any[] = [
      { type: 'Text', componentName: 'Weather_Date', props: { textValue: 'SATURDAY 8 AUGUST', layoutRegionId: 'weather-dashboard.header-right' } },
      { type: 'Text', componentName: 'Weather_Time', props: { textValue: '8:20 PM', layoutRegionId: 'weather-dashboard.header-right' } },
      { type: 'Heading', componentName: 'Weather_Temperature', props: { headingText: '18°', layoutRegionId: 'weather-dashboard.current-weather' } },
      { type: 'Text', componentName: 'Weather_Condition', props: { textValue: 'CLEAR SKY', layoutRegionId: 'weather-dashboard.current-weather' } },
      { type: 'Text', componentName: 'Weather_FeelsLike', props: { textValue: 'Feels like 17°', layoutRegionId: 'weather-dashboard.current-weather' } },
      { type: 'Icon', componentName: 'Weather_Current_Icon', props: { iconName: 'FiSun', layoutRegionId: 'weather-dashboard.current-weather' } },
      ...Array.from({ length: 5 }, (_, index) => {
        const day = index + 1
        const region = `weather-dashboard.forecast-day${day}`
        return [
          { type: 'Text', componentName: `Forecast_Day${day}_Name`, props: { textValue: ['SUN', 'MON', 'TUE', 'WED', 'THU'][index], layoutRegionId: region } },
          { type: 'Icon', componentName: `Forecast_Day${day}_Icon`, props: { iconName: index === 2 ? 'FiCloudRain' : 'FiSun', layoutRegionId: region } },
          { type: 'Text', componentName: `Forecast_Day${day}_Temperature`, props: { textValue: '17° / 9°', layoutRegionId: region } },
        ]
      }).flat(),
    ]
    const layout = composeForgeUILayoutTemplate(
      forgeUIWeatherDashboardTemplate,
      content,
    )
    const byName = (name: string) =>
      layout.find(item => item.componentName === name)!
    const byRegion = (key: string) =>
      layout.find(item => item.props.layoutRegionKey === key)!
    const isContained = (child: any, parent: any) =>
      Number(child.props.x) >= Number(parent.props.x) &&
      Number(child.props.y) >= Number(parent.props.y) &&
      Number(child.props.x) + Number(child.props.w) <=
        Number(parent.props.x) + Number(parent.props.w) &&
      Number(child.props.y) + Number(child.props.h) <=
        Number(parent.props.y) + Number(parent.props.h)

    const temperature = byName('Weather_Temperature')
    const currentIcon = byName('Weather_Current_Icon')
    expect(temperature.props).toMatchObject({
      headingText: '18°',
      fontSize: 72,
      x: 36,
      y: 124,
    })
    expect(Number(currentIcon.props.w)).toBeLessThan(
      Number(temperature.props.w),
    )
    expect(Number(currentIcon.props.x)).toBeGreaterThan(
      Number(temperature.props.x),
    )
    expect(isContained(
      temperature,
      byRegion('weather-dashboard.current-weather'),
    )).toBe(true)

    const date = byName('Weather_Date')
    const time = byName('Weather_Time')
    expect(date.props.textValue).toBe('SATURDAY 8 AUGUST')
    expect(time.props.textValue).toBe('8:20 PM')
    expect(Number(time.props.y)).toBeGreaterThan(Number(date.props.y))

    for (let day = 1; day <= 5; day += 1) {
      const region = byRegion(`weather-dashboard.forecast-day${day}`)
      const name = byName(`Forecast_Day${day}_Name`)
      const icon = byName(`Forecast_Day${day}_Icon`)
      const value = byName(`Forecast_Day${day}_Temperature`)
      expect([name, icon, value].every(item => isContained(item, region)))
        .toBe(true)
      expect(Number(name.props.y)).toBeLessThan(Number(icon.props.y))
      expect(Number(icon.props.y)).toBeLessThan(Number(value.props.y))
      expect(Number(icon.props.x) + Number(icon.props.w) / 2)
        .toBe(Number(region.props.x) + Number(region.props.w) / 2)
    }
  })

  it('defines deterministic stable regions inside 1024x600 without overlap', () => {
    const regions = forgeUIDashboardTemplate.layout.filter(
      item => item.type === 'Box',
    )
    expect(regions.map(region => region.props.layoutRegionKey)).toEqual([
      'dashboard.header',
      'dashboard.status',
      'dashboard.main',
      'dashboard.controls',
      'dashboard.footer',
    ])
    regions.forEach((region, index) => {
      expect(Number(region.props.x)).toBeGreaterThanOrEqual(0)
      expect(Number(region.props.y)).toBeGreaterThanOrEqual(0)
      expect(
        Number(region.props.x) + Number(region.props.w),
      ).toBeLessThanOrEqual(1024)
      expect(
        Number(region.props.y) + Number(region.props.h),
      ).toBeLessThanOrEqual(600)
      regions.slice(index + 1).forEach(other => {
        expect(overlaps(region.props, other.props)).toBe(false)
      })
    })
  })

  it.each(forgeUILayoutTemplates)(
    'defines non-overlapping labelled regions for $name',
    definition => {
      const regions = definition.layout.filter(item => item.type === 'Box')
      expect(regions.length).toBeGreaterThanOrEqual(5)
      regions.forEach((item, index) => {
        expect(item.props.layoutRegionKey).toMatch(
          new RegExp(`^${definition.id}\\.`),
        )
        expect(item.props.layoutRegionLabel).toEqual(expect.any(String))
        expect(Number(item.props.x) + Number(item.props.w)).toBeLessThanOrEqual(
          definition.width,
        )
        expect(Number(item.props.y) + Number(item.props.h)).toBeLessThanOrEqual(
          definition.height,
        )
        regions.slice(index + 1).forEach(other => {
          expect(overlaps(item.props, other.props)).toBe(false)
        })
      })
    },
  )

  it.each(forgeUILayoutTemplates)(
    'composes, assigns and persists $name through the shared engine',
    definition => {
      const layout = composeForgeUILayoutTemplate(definition, [
        { type: 'Heading', props: { children: 'Plant A' } },
        { type: 'Chart', props: { seriesCount: 2 } },
        { type: 'Button', props: { children: 'Start' } },
      ])
      expect(layout.filter(item => item.type === 'Box')).toHaveLength(
        definition.layout.filter(item => item.type === 'Box').length,
      )
      const restored = JSON.parse(JSON.stringify(layout))
      restored
        .filter((item: any) => !['Box', 'Divider'].includes(item.type))
        .forEach((item: any) => {
          expect(item.props.layoutRegionId).toMatch(
            new RegExp(`^${definition.id}\\.`),
          )
        })
    },
  )

  it.each([
    ['vertical', 1],
    ['horizontal', 3],
    ['grid', 2],
  ])('auto-arranges %s inside region bounds', (arrangement, columns) => {
    const region = asComponent('region', 'Box', {
      x: 100,
      y: 80,
      w: 600,
      h: 360,
      layoutRegionKey: 'dashboard.main',
      layoutArrangement: arrangement,
      layoutColumns: columns,
      layoutPadding: 20,
      layoutHorizontalGap: 12,
      layoutVerticalGap: 12,
      layoutMinChildWidth: 40,
      layoutMinChildHeight: 40,
    })
    const updates = autoArrangeForgeUIRegion(region, [
      asComponent('one', 'Button', { layoutOrder: 0 }),
      asComponent('two', 'Button', { layoutOrder: 1 }),
      asComponent('three', 'Button', { layoutOrder: 2 }),
    ])
    expect(updates).toHaveLength(3)
    updates.forEach((update, index) => {
      const props = update.props
      expect(Number(props.x)).toBeGreaterThanOrEqual(120)
      expect(Number(props.y)).toBeGreaterThanOrEqual(100)
      expect(Number(props.x) + Number(props.w)).toBeLessThanOrEqual(680)
      expect(Number(props.y) + Number(props.h)).toBeLessThanOrEqual(420)
      updates.slice(index + 1).forEach(other => {
        expect(overlaps(props, other.props)).toBe(false)
      })
    })
  })

  it('creates real canonical components, assigns regions and preserves content props', () => {
    const layout = composeForgeUIDashboardTemplate([
      { type: 'Heading', props: { children: 'CNC-5000' } },
      { type: 'Text', props: { textValue: 'Connected' } },
      { type: 'CircularProgress', props: { value: 68 } },
      { type: 'Chart', props: {} },
      { type: 'Button', props: { children: 'Start' } },
    ])
    expect(layout.filter(item => item.type === 'Box')).toHaveLength(5)
    expect(layout.find(item => item.type === 'Chart')?.props).toMatchObject({
      layoutRegionId: 'dashboard.main',
    })
    expect(layout.find(item => item.type === 'Button')?.props).toMatchObject({
      layoutRegionId: 'dashboard.controls',
      children: 'Start',
    })
    expect(
      layout.find(item => item.type === 'CircularProgress')?.props,
    ).toMatchObject({
      layoutRegionId: 'dashboard.status',
      value: 68,
    })
    layout.forEach(item => {
      expect(typeof item.type).toBe('string')
      expect(item.props.positionMode).toBe('absolute')
    })
  })

  it('keeps old Boxes valid without any region metadata', () => {
    const legacy = asComponent('legacy', 'Box', {
      x: 10,
      y: 20,
      w: 100,
      h: 80,
    })
    expect(legacy.props.layoutRegionKey).toBeUndefined()
    expect(autoArrangeForgeUIRegion(legacy, [])).toEqual([])
  })

  it('preserves region metadata and assignments through project JSON roundtrip', () => {
    const layout = composeForgeUIDashboardTemplate([
      { type: 'Chart', props: { seriesCount: 2 } },
    ])
    const restored = JSON.parse(JSON.stringify(layout))
    expect(
      restored.find(
        (item: any) => item.props.layoutRegionKey === 'dashboard.main',
      ),
    ).toBeDefined()
    expect(
      restored.find((item: any) => item.type === 'Chart').props,
    ).toMatchObject({
      layoutRegionId: 'dashboard.main',
      seriesCount: 2,
    })
  })
})
