import { init } from '@rematch/core'
import { storeConfig } from '~core/store'
describe('BatteryCard Studio lifecycle', () => { it('inserts, resizes, serializes, reloads, duplicates independently, and deletes', () => {
  // @ts-ignore legacy Rematch typing
  const store = init(storeConfig); store.dispatch.components.addComponent({ parentName:'root', type:'BatteryCard', rootParentType:'BatteryCard', testId:'battery-original' }); const present=()=>(store.getState().components as any).present
  expect(present().components['battery-original'].props).toMatchObject({w:240,h:145})
  store.dispatch.components.updateManyProps([{id:'battery-original',props:{x:70,y:50,w:420,h:260}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved)
  expect(present().components['battery-original']).toMatchObject({type:'BatteryCard',props:{x:70,y:50,w:420,h:260,percentage:76}})
  store.dispatch.components.select('battery-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; store.dispatch.components.updateProps({id:duplicateId,name:'title',value:'Backup Battery'})
  expect(present().components['battery-original'].props.title).toBe('Battery Status'); expect(present().components[duplicateId].props.title).toBe('Backup Battery')
  store.dispatch.components.deleteComponent(duplicateId); store.dispatch.components.deleteComponent('battery-original'); expect(present().components.root.children).toEqual([])
}) })
