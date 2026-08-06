import { init } from '@rematch/core'
import { storeConfig } from '~core/store'
describe('NetworkStatusCard Studio lifecycle',()=>{it('serializes, reloads, duplicates with a unique persisted ID, and isolates state',()=>{
  // @ts-ignore legacy Rematch typing
  const store=init(storeConfig); store.dispatch.components.addComponent({parentName:'root',type:'NetworkStatusCard',rootParentType:'NetworkStatusCard',testId:'network-original'}); const present=()=>(store.getState().components as any).present
  store.dispatch.components.updateManyProps([{id:'network-original',props:{x:70,y:50,w:420,h:220}}]); const saved=JSON.parse(JSON.stringify(present().components)); store.dispatch.components.reset(saved)
  expect(present().components['network-original']).toMatchObject({type:'NetworkStatusCard',props:{x:70,y:50,w:420,h:220,networkName:'ForgeUI-Lab',signalStrength:78}})
  store.dispatch.components.select('network-original'); store.dispatch.components.duplicate(); const duplicateId=present().components.root.children[1]; expect(duplicateId).not.toBe('network-original'); store.dispatch.components.updateProps({id:duplicateId,name:'networkName',value:'Backup LAN'})
  expect(present().components['network-original'].props.networkName).toBe('ForgeUI-Lab'); expect(present().components[duplicateId].props.networkName).toBe('Backup LAN')
})})
