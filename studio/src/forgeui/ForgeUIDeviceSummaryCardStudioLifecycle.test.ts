import { init } from '@rematch/core'
import { storeConfig } from '~core/store'
describe('DeviceSummaryCard Studio lifecycle',()=>{it('serializes, reloads and duplicates with isolated persisted state',()=>{
  // @ts-ignore legacy Rematch typing
  const store=init(storeConfig); store.dispatch.components.addComponent({parentName:'root',type:'DeviceSummaryCard',rootParentType:'DeviceSummaryCard',testId:'device-original'}); const present=()=>(store.getState().components as any).present
  expect(present().components['device-original'].props).toMatchObject({w:240,h:145,deviceName:'ForgeUI-P4',overallStatus:'online'})
  store.dispatch.components.updateManyProps([{id:'device-original',props:{x:70,y:50,firmwareVersion:'v9.1.0'}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved)
  expect(present().components['device-original'].props).toMatchObject({x:70,y:50,firmwareVersion:'v9.1.0'})
  store.dispatch.components.select('device-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; expect(duplicateId).not.toBe('device-original'); store.dispatch.components.updateProps({id:duplicateId,name:'deviceName',value:'Workshop Node'})
  expect(present().components['device-original'].props.deviceName).toBe('ForgeUI-P4'); expect(present().components[duplicateId].props.deviceName).toBe('Workshop Node')
})})
