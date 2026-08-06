import { init } from '@rematch/core'
import { storeConfig } from '~core/store'
describe('KpiCard Studio lifecycle',()=>{it('serializes, reloads and duplicates with isolated persisted state',()=>{
  // @ts-ignore legacy Rematch typing
  const store=init(storeConfig); store.dispatch.components.addComponent({parentName:'root',type:'KpiCard',rootParentType:'KpiCard',testId:'kpi-original'}); const present=()=>(store.getState().components as any).present
  expect(present().components['kpi-original'].props).toMatchObject({w:240,h:145,title:'Efficiency',value:'87.4',status:'good'})
  store.dispatch.components.updateManyProps([{id:'kpi-original',props:{x:70,y:50,value:'42.7',unit:'°C'}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved); expect(present().components['kpi-original'].props).toMatchObject({x:70,y:50,value:'42.7',unit:'°C'})
  store.dispatch.components.select('kpi-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; expect(duplicateId).not.toBe('kpi-original'); store.dispatch.components.updateProps({id:duplicateId,name:'value',value:'12'}); expect(present().components['kpi-original'].props.value).toBe('42.7'); expect(present().components[duplicateId].props.value).toBe('12')
})})
