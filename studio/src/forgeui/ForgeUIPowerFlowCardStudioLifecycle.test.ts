import { init } from '@rematch/core'
import { storeConfig } from '~core/store'
describe('PowerFlowCard Studio lifecycle',()=>{it('serializes, reloads and duplicates with isolated persisted state',()=>{
  // @ts-ignore legacy Rematch typing
  const store=init(storeConfig); store.dispatch.components.addComponent({parentName:'root',type:'PowerFlowCard',rootParentType:'PowerFlowCard',testId:'power-original'}); const present=()=>(store.getState().components as any).present
  expect(present().components['power-original'].props).toMatchObject({w:240,h:145,title:'Power Flow',gridFlow:'into-centre',batteryFlow:'out-from-centre'})
  store.dispatch.components.updateManyProps([{id:'power-original',props:{x:70,y:50,gridValue:'2.1 kW',solarFlow:'none'}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved); expect(present().components['power-original'].props).toMatchObject({x:70,y:50,gridValue:'2.1 kW',solarFlow:'none'})
  store.dispatch.components.select('power-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; expect(duplicateId).not.toBe('power-original'); store.dispatch.components.updateProps({id:duplicateId,name:'gridValue',value:'0 W'}); expect(present().components['power-original'].props.gridValue).toBe('2.1 kW'); expect(present().components[duplicateId].props.gridValue).toBe('0 W')
})})
