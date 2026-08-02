import { migratePersistedComponentState, normalizePersistedComponentIdentities } from '../core/componentIdentity'
import { duplicateComponent } from '../utils/recursive'
import { generateForgeUILvglCode } from './ForgeUILvglExport'
import fs from 'fs'
import path from 'path'

const nativeProject = (): IComponents => ({
  root: { id: 'root', type: 'Box', parent: 'root', children: ['comp-card-stable', 'comp-sensor-stable'], props: {} },
  'comp-card-stable': {
    id: 'comp-card-stable', componentName: 'Mutable Card Name', type: 'DashboardCard', parent: 'root', children: [],
    props: { x: 10, y: 20, w: 300, h: 190, enableClick: true },
  },
  'comp-sensor-stable': {
    id: 'comp-sensor-stable', componentName: 'Mutable Sensor Name', type: 'SensorTile', parent: 'root', children: [],
    props: { x: 20, y: 230, w: 260, h: 180, value: 23.7, rangeMin: 0, rangeMax: 100, enableClick: true },
  },
})

const contract = (components: IComponents) => {
  const generated = generateForgeUILvglCode(components, 'graphite', undefined, { includeThemeTexture: false })
  return {
    declarations: generated.publicApiDeclarations.filter(value => value.includes('Comp_Card_Stable') || value.includes('Comp_Sensor_Stable')),
    hooks: generated.userEventHooks.filter(value => value.includes('Comp_Card_Stable') || value.includes('Comp_Sensor_Stable')),
    privateSymbols: Array.from(new Set(Array.from(
      generated.code.matchAll(/fg_comp_(?:card|sensor)_stable_[a-z0-9_]+/g),
      match => match[0],
    ))).sort(),
  }
}

describe('ForgeUI Native Component persisted public identity', () => {
  it('is identical across repeated Live and Standalone generation and JSON save/reload', () => {
    const project = nativeProject()
    const first = contract(project)
    expect(contract(project)).toEqual(first)
    expect(contract(JSON.parse(JSON.stringify(project)))).toEqual(first)
  })

  it.each([
    ['movement', { x: 700, y: 80 }],
    ['resize', { w: 410, h: 220 }],
    ['style', { accentColor: '#FF00AA', padding: 22 }],
    ['value and threshold', { value: 91.2, warningHigh: 75, criticalHigh: 88 }],
    ['visibility and layout', { showProgress: false, layoutRegionId: 'dashboard.main' }],
  ])('does not change symbols after %s changes', (_label, changes) => {
    const project = nativeProject()
    const before = contract(project)
    project['comp-sensor-stable'].props = { ...project['comp-sensor-stable'].props, ...changes }
    expect(contract(project)).toEqual(before)
  })

  it('does not change symbols when a mutable component name changes', () => {
    const project = nativeProject()
    const before = contract(project)
    project['comp-card-stable'].componentName = 'Renamed Presentation'
    project['comp-sensor-stable'].componentName = 'Another Display Name'
    expect(contract(project)).toEqual(before)
  })

  it('gives a duplicate a distinct persisted identity that remains stable', () => {
    const project = nativeProject()
    project['comp-sensor-stable'].componentName = 'Sensor1'
    const { newId, clonedComponents } = duplicateComponent(project['comp-sensor-stable'], project)
    expect(newId).not.toBe('comp-sensor-stable')
    const duplicated = { ...project, ...clonedComponents }
    duplicated.root = { ...project.root, children: [...project.root.children, newId] }
    const first = contract(duplicated)
    expect(contract(JSON.parse(JSON.stringify(duplicated)))).toEqual(first)
  })

  it('uses a new identity after deletion and recreation', () => {
    const original = nativeProject()
    const recreated = nativeProject()
    delete recreated['comp-sensor-stable']
    recreated.root.children = ['comp-card-stable', 'comp-sensor-recreated']
    recreated['comp-sensor-recreated'] = { ...original['comp-sensor-stable'], id: 'comp-sensor-recreated' }
    expect(contract(recreated)).not.toEqual(contract(original))
  })

  it('repairs a legacy missing embedded ID once from its persisted map identity', async () => {
    const project = nativeProject()
    delete (project['comp-sensor-stable'] as Partial<IComponent>).id
    const normalized = normalizePersistedComponentIdentities(project)
    expect(normalized['comp-sensor-stable'].id).toBe('comp-sensor-stable')
    expect(normalizePersistedComponentIdentities(normalized)).toBe(normalized)

    const persisted = await migratePersistedComponentState({ present: { components: project, selectedId: 'root' } })
    expect(persisted.present.components['comp-sensor-stable'].id).toBe('comp-sensor-stable')
  })

  it('keeps Firmware Maintenance independent from persisted Canvas state', () => {
    const headerSource = fs.readFileSync(path.resolve(__dirname, '../components/Header.tsx'), 'utf8')
    const maintenance = headerSource.slice(
      headerSource.indexOf("fetch(\n                    'http://localhost:3030/clean-firmware-sweep'"),
      headerSource.indexOf("title:\n                      'Firmware Maintenance Complete'"),
    )
    expect(maintenance).not.toContain('dispatch.components.reset()')
  })

  it('flushes project persistence before either firmware clean path', () => {
    const headerSource = fs.readFileSync(path.resolve(__dirname, '../components/Header.tsx'), 'utf8')
    const simpleClean = headerSource.slice(
      headerSource.indexOf("await flushProjectPersistence('clean-firmware')"),
      headerSource.indexOf("title: 'Firmware cleaned'"),
    )
    const maintenance = headerSource.slice(
      headerSource.indexOf("await flushProjectPersistence('firmware-maintenance')"),
      headerSource.indexOf("title:\n                      'Firmware Maintenance Complete'"),
    )
    expect(simpleClean.indexOf('flushProjectPersistence')).toBeLessThan(
      simpleClean.indexOf('clean-firmware-uploads'),
    )
    expect(maintenance.indexOf('flushProjectPersistence')).toBeLessThan(
      maintenance.indexOf('clean-firmware-sweep'),
    )
    expect(simpleClean).not.toMatch(/components\.(reset|addComponent)/)
    expect(maintenance).not.toMatch(/components\.(reset|addComponent)/)
  })

  it('does not change the established component-name contract for standard widgets', () => {
    const button: IComponent = {
      id: 'comp-standard-button', componentName: 'Standard Action', type: 'Button',
      parent: 'root', children: [], props: { buttonText: 'Go', enableClick: true },
    }
    const generated = generateForgeUILvglCode({
      root: { id: 'root', type: 'Box', parent: 'root', children: [button.id], props: {} },
      [button.id]: button,
    }, 'graphite', undefined, { includeThemeTexture: false })
    expect(generated.userEventHooks).toContain('FG_On_Standard_Action_Clicked')
  })
})
