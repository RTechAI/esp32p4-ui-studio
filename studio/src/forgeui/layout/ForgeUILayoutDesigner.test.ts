import {
  autoArrangeForgeUIRegion,
  composeForgeUIDashboardTemplate,
  forgeUIDashboardTemplate,
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
    x: Number(first.x), y: Number(first.y),
    w: Number(first.w), h: Number(first.h),
  }
  const b = {
    x: Number(second.x), y: Number(second.y),
    w: Number(second.w), h: Number(second.h),
  }
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

describe('ForgeUI Dashboard Layout Designer', () => {
  it('defines deterministic stable regions inside 1024x600 without overlap', () => {
    const regions = forgeUIDashboardTemplate.layout
      .filter(item => item.type === 'Box')
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
        expect(Number(item.props.x) + Number(item.props.w))
          .toBeLessThanOrEqual(definition.width)
        expect(Number(item.props.y) + Number(item.props.h))
          .toBeLessThanOrEqual(definition.height)
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
      restored.filter((item: any) =>
        !['Box', 'Divider'].includes(item.type)
      ).forEach((item: any) => {
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
      x: 100, y: 80, w: 600, h: 360,
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
    expect(layout.find(item => item.type === 'Chart')?.props)
      .toMatchObject({ layoutRegionId: 'dashboard.main' })
    expect(layout.find(item => item.type === 'Button')?.props)
      .toMatchObject({
        layoutRegionId: 'dashboard.controls',
        children: 'Start',
      })
    expect(layout.find(item => item.type === 'CircularProgress')?.props)
      .toMatchObject({
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
      x: 10, y: 20, w: 100, h: 80,
    })
    expect(legacy.props.layoutRegionKey).toBeUndefined()
    expect(autoArrangeForgeUIRegion(legacy, [])).toEqual([])
  })

  it('preserves region metadata and assignments through project JSON roundtrip', () => {
    const layout = composeForgeUIDashboardTemplate([
      { type: 'Chart', props: { seriesCount: 2 } },
    ])
    const restored = JSON.parse(JSON.stringify(layout))
    expect(restored.find((item: any) =>
      item.props.layoutRegionKey === 'dashboard.main'
    )).toBeDefined()
    expect(restored.find((item: any) =>
      item.type === 'Chart'
    ).props).toMatchObject({
      layoutRegionId: 'dashboard.main',
      seriesCount: 2,
    })
  })
})
