import { init } from '@rematch/core'
import { storeConfig } from '~core/store'

describe('TankLevelCard Studio lifecycle', () => { it('inserts, resizes, serializes, reloads, duplicates independently, and deletes', () => {
  // @ts-ignore legacy Rematch typing
  const store = init(storeConfig); store.dispatch.components.addComponent({ parentName:'root', type:'TankLevelCard', rootParentType:'TankLevelCard', testId:'tank-original' }); const present=()=>(store.getState().components as any).present
  store.dispatch.components.updateManyProps([{id:'tank-original',props:{x:70,y:50,w:440,h:270}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved)
  expect(present().components['tank-original']).toMatchObject({type:'TankLevelCard',props:{x:70,y:50,w:440,h:270,level:68}})
  store.dispatch.components.select('tank-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; store.dispatch.components.updateProps({id:duplicateId,name:'title',value:'Fuel Vessel'})
  expect(present().components['tank-original'].props.title).toBe('Tank Level'); expect(present().components[duplicateId].props.title).toBe('Fuel Vessel')
  store.dispatch.components.deleteComponent(duplicateId); store.dispatch.components.deleteComponent('tank-original'); expect(present().components.root.children).toEqual([])
}) })
