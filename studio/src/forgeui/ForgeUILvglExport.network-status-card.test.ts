import { generateForgeUILvglCode } from './ForgeUILvglExport'
const card=(id:string,props:Record<string,unknown>={}):IComponent=>({id,parent:'root',type:'NetworkStatusCard',children:[],props:{x:20,y:30,w:300,h:190,connected:true,networkName:'ForgeUI-Lab',ipAddress:'192.168.1.42',signalStrength:78,statusText:'Online',generateRuntimeApi:true,...props}})
const multiCardExport=()=>{
  const components:any={root:{id:'root',parent:'',type:'Box',children:['network-left-proof','network-right-proof'],props:{w:1024,h:600}},'network-left-proof':card('network-left-proof',{x:40,y:100,w:440,h:240,title:'Current Wi-Fi',connected:false,networkName:'--',ipAddress:'--',signalStrength:0,statusText:'Offline'}),'network-right-proof':card('network-right-proof',{x:544,y:100,w:440,h:240,title:'Backup Network',networkType:'ethernet',connected:false,networkName:'Service LAN',ipAddress:'--',signalStrength:0,statusText:'Cable disconnected'})}
  const out=generateForgeUILvglCode(components,'graphite',undefined,{includeThemeTexture:false})
  return out
}
describe('Network Status Card LVGL export',()=>{
  it('generates isolated persisted-ID APIs, clamping, disconnected output, and zero UserEvents',()=>{
    const components:any={root:{id:'root',parent:'',type:'Box',children:['network-left-uuid','network-right-uuid'],props:{w:1024,h:600}},'network-left-uuid':card('network-left-uuid'),'network-right-uuid':card('network-right-uuid',{connected:false,networkName:'Backup'})}
    const out=generateForgeUILvglCode(components,'graphite',undefined,{includeThemeTexture:false})
    expect(out.code).toContain('FG_Set_Network_Left_Uuid_Connected'); expect(out.code).toContain('FG_Set_Network_Right_Uuid_Connected'); expect(out.code).toContain('percent<0?0:(percent>100?100:percent)'); expect(out.code).toContain('static bool fg_network_right_uuid_network_connected=false'); expect(out.userEventContracts.filter(e=>e.name.includes('Network'))).toEqual([]); expect(out.publicApiDeclarations).toContain('void FG_Set_Network_Left_Uuid_Signal_Strength(int32_t percent);')
    components['network-left-uuid'].componentName='Renamed'; const renamed=generateForgeUILvglCode(components,'graphite',undefined,{includeThemeTexture:false}); expect(renamed.code).toContain('FG_Set_Network_Left_Uuid_Connected'); expect(renamed.code).not.toContain('FG_Set_Renamed_Connected')
  })
  it('routes every Runtime SDK setter through a refresh that mutates the created LVGL objects',()=>{
    const code=generateForgeUILvglCode({root:{id:'root',parent:'',type:'Box',children:['network-left-uuid'],props:{w:1024,h:600}},'network-left-uuid':card('network-left-uuid')} as any,'graphite',undefined,{includeThemeTexture:false}).code
    const setterNames=['Connected','Network_Name','IP_Address','Signal_Strength','Status_Text','Network_Type']
    setterNames.forEach(name=>expect(code).toMatch(new RegExp(`void FG_Set_Network_Left_Uuid_${name}\\([^}]+fg_network_left_uuid_network_refresh\\(\\); \\}`)))
    expect(code).toContain('if(fg_network_left_uuid_network_state_label) { lv_label_set_text(fg_network_left_uuid_network_state_label')
    expect(code).toContain('lv_obj_set_style_text_color(fg_network_left_uuid_network_state_label')
    expect(code).toContain('if(fg_network_left_uuid_network_name_label) lv_label_set_text_fmt(fg_network_left_uuid_network_name_label')
    expect(code).toContain('if(fg_network_left_uuid_network_ip_label) lv_label_set_text_fmt(fg_network_left_uuid_network_ip_label')
    expect(code).toContain('if(fg_network_left_uuid_network_status_label) { lv_label_set_text_fmt(fg_network_left_uuid_network_status_label')
    expect(code).toContain('if(fg_network_left_uuid_network_bar) { lv_bar_set_value(fg_network_left_uuid_network_bar')
    expect(code).toContain('lv_obj_set_style_bg_color(fg_network_left_uuid_network_bar')
    expect(code).toContain('fg_network_left_uuid_network_state_label=lv_label_create(fg_network_left_uuid_network)')
    expect(code).toContain('fg_network_left_uuid_network_bar=lv_bar_create(fg_network_left_uuid_network)')
  })
  it('live projection uses the existing Wi-Fi snapshot and never reapplies fake demo state',()=>{
    const code=multiCardExport().code; expect(code).toContain('fg_wifi_get_snapshot(&network_card_snapshot)'); expect(code).toContain('network_card_snapshot.ssid'); expect(code).toContain('network_card_snapshot.ip'); expect(code).toContain('network_card_snapshot.rssi'); expect(code).toContain('FG_Set_Network_Left_Proof_Connected(network_card_connected)'); expect(code).not.toContain('FG_Set_Network_Left_Proof_Connected(true)'); expect(code).not.toContain('FG_Set_Network_Left_Proof_IP_Address("192.168.1.42")'); expect(code).toContain('static bool fg_network_left_proof_network_connected=false'); expect(code).toContain('static char fg_network_left_proof_network_ip[46]="--"')
  })
  it('projects every card before the Wi-Fi Manager activity gate with isolated persisted-ID APIs',()=>{
    const code=multiCardExport().code; const gate=code.indexOf('if (!fg_system_wifi_page || !fg_system_wifi_page_active) return;'); const left=code.indexOf('FG_Set_Network_Left_Proof_Connected(network_card_connected);'); const right=code.indexOf('FG_Set_Network_Right_Proof_Connected(network_card_connected);'); expect(left).toBeGreaterThan(-1); expect(right).toBeGreaterThan(-1); expect(left).toBeLessThan(gate); expect(right).toBeLessThan(gate); expect(code.match(/fg_wifi_get_snapshot\(&network_card_snapshot\)/g)).toHaveLength(1); expect(code).toContain('FG_Set_Network_Left_Proof_Network_Name("--");'); expect(code).toContain('FG_Set_Network_Left_Proof_IP_Address("--");'); expect(code).toContain('FG_Set_Network_Left_Proof_Signal_Strength(0);'); expect(code).toContain('FG_Set_Network_Left_Proof_Status_Text("Offline");'); expect(code).toContain('FG_Set_Network_Left_Proof_Status_Text("Online");'); expect(code).toContain('network_card_signal = (network_card_snapshot.rssi + 100) * 2;'); expect(code).toContain('if (network_card_signal < 0) network_card_signal = 0;'); expect(code).toContain('if (network_card_signal > 100) network_card_signal = 100;')
  })
})
