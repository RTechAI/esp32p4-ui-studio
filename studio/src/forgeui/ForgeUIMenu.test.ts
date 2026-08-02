import { DEFAULT_FORGEUI_MENU_PAGES, normalizeForgeUIMenuPages, resolveForgeUIMenuRootPageId } from './ForgeUIMenu'

describe('ForgeUI Menu model', () => {
  it('normalizes a serializable navigation hierarchy with stable IDs', () => {
    const pages = normalizeForgeUIMenuPages([{ id: 'root', title: 'Root', sections: [{ id: 'section', title: 'Group', items: [
      { id: 'open', label: 'Open', subtitle: 'Child', icon: 'LV_SYMBOL_RIGHT', targetPageId: 'child', enabled: true },
    ] }] }, { id: 'child', title: 'Child', sections: [] }])
    expect(pages[0].sections[0].items[0]).toMatchObject({ id: 'open', targetPageId: 'child', enabled: true })
    expect(JSON.parse(JSON.stringify(pages))).toEqual(pages)
    expect(resolveForgeUIMenuRootPageId(pages, 'child')).toBe('child')
  })

  it('provides backwards-compatible defaults for absent or malformed data', () => {
    expect(normalizeForgeUIMenuPages(undefined)).toEqual(DEFAULT_FORGEUI_MENU_PAGES)
    expect(normalizeForgeUIMenuPages('not json')).toEqual(DEFAULT_FORGEUI_MENU_PAGES)
  })
})

