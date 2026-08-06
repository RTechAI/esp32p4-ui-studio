import { generateForgeUILvglCode } from './ForgeUILvglExport'
const card=(id:string,props:Record<string,unknown>={}):IComponent=>({id,parent:'root',type:'DeviceSummaryCard',children:[],props:{x:20,y:30,w:240,h:145,title:'Device Summary',deviceName:'ForgeUI-P4',overallStatus:'online',uptime:'02:14:36',firmwareVersion:'v3.5.4',networkStatus:'Connected',storageStatus:'Ready',generateRuntimeApi:true,...props}})
const twoCardExport=()=>generateForgeUILvglCode({root:{id:'root',parent:'',type:'Box',children:['device-left-proof','device-right-proof'],props:{w:1024,h:600}},'device-left-proof':card('device-left-proof',{x:40,y:100}),'device-right-proof':card('device-right-proof',{x:300,y:100,title:'Workshop Node',deviceName:'Workshop Node',overallStatus:'warning',uptime:'18:42:10',firmwareVersion:'v1.2.0',networkStatus:'Offline'})} as any,'graphite',undefined,{includeThemeTexture:false})

describe('Device Summary Card LVGL export',()=>{
  it('exports stackable default/minimum geometry with safe truncation',()=>{
    const code=twoCardExport().code; expect(code).toContain('lv_obj_set_size(fg_device_left_proof_device_summary,240,145);'); expect(code).toContain('lv_label_set_long_mode(fg_device_left_proof_device_summary_device_label,LV_LABEL_LONG_DOT);')
    const minimum=generateForgeUILvglCode({root:{id:'root',parent:'',type:'Box',children:['device-minimum'],props:{w:1024,h:600}},'device-minimum':card('device-minimum',{w:220,h:128,deviceName:'Very long device name that must truncate without overlap'})} as any,'graphite',undefined,{includeThemeTexture:false}).code
    expect(minimum).toContain('lv_obj_set_size(fg_device_minimum_device_summary,220,128);'); expect(minimum).toContain('lv_obj_set_width(fg_device_minimum_device_summary_device_label,200);')
  })
  it('generates isolated rename-stable silent SDK setters and zero UserEvents',()=>{
    const components:any={root:{id:'root',parent:'',type:'Box',children:['device-left-proof','device-right-proof'],props:{w:1024,h:600}},'device-left-proof':card('device-left-proof'),'device-right-proof':card('device-right-proof',{overallStatus:'warning'})}; const out=generateForgeUILvglCode(components,'graphite',undefined,{includeThemeTexture:false})
    ;['Device_Name','Status','Uptime','Firmware_Version','Network_Status','Storage_Status'].forEach(name=>{expect(out.code).toContain(`FG_Set_Device_Left_Proof_${name}`); expect(out.code).toContain(`FG_Set_Device_Right_Proof_${name}`)})
    expect(out.code).toContain('static char fg_device_left_proof_device_summary_device[65]="ForgeUI-P4";'); expect(out.code).toContain('static char fg_device_right_proof_device_summary_device[65]="ForgeUI-P4";'); expect(out.code).toContain('value<0?0:(value>3?3:value)'); expect(out.userEventContracts.filter(e=>e.name.includes('Device'))).toEqual([])
    components['device-left-proof'].componentName='Renamed Card'; const renamed=generateForgeUILvglCode(components,'graphite',undefined,{includeThemeTexture:false}); expect(renamed.code).toContain('FG_Set_Device_Left_Proof_Device_Name'); expect(renamed.code).not.toContain('FG_Set_Renamed_Card_Device_Name')
  })
  it('routes each setter through refresh and mutates created LVGL labels',()=>{
    const code=twoCardExport().code; expect(code).toContain('fg_device_left_proof_device_summary_refresh();'); expect(code).toContain('lv_label_set_text(fg_device_left_proof_device_summary_device_label,fg_device_left_proof_device_summary_device)'); expect(code).toContain('lv_label_set_text_fmt(fg_device_left_proof_device_summary_uptime_label,"Uptime  %s"'); expect(code).toContain('lv_label_set_text_fmt(fg_device_left_proof_device_summary_storage_label,"Storage  %s"')
  })
})
