import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE, FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE, normalizeForgeUIDeviceSummaryCard } from './ForgeUIDeviceSummaryCard'
import { ForgeUIDeviceSummaryCardPreview } from './preview/ForgeUIDeviceSummaryCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'
import { renderForgePreview } from './preview/forgePreviewRenderer'

const component=(id:string,props:Record<string,unknown>={}):IComponent=>({id,parent:'root',type:'DeviceSummaryCard',children:[],props:{w:240,h:145,...props}})
describe('Device Summary Card',()=>{
  it('normalizes versioned defaults, safe status and bounded long text',()=>{
    const model=normalizeForgeUIDeviceSummaryCard({overallStatus:'invalid',deviceName:'x'.repeat(100),onlineColour:'bad'})
    expect(model).toMatchObject({schemaVersion:1,title:'Device Summary',overallStatus:'online',uptime:'02:14:36',firmwareVersion:'v3.5.4',networkStatus:'Connected',storageStatus:'Ready',onlineColour:'#22C55E'})
    expect(model.deviceName).toHaveLength(64); expect(FORGEUI_DEVICE_SUMMARY_CARD_DEFAULT_SIZE).toEqual({width:240,height:145}); expect(FORGEUI_DEVICE_SUMMARY_CARD_MIN_SIZE).toEqual({width:220,height:128})
  })
  it('renders status and all compact summary rows for isolated instances',()=>{
    render(<ChakraProvider><><ForgeUIDeviceSummaryCardPreview component={component('one')} palette={FG_PREVIEW_PALETTES.graphite}/><ForgeUIDeviceSummaryCardPreview component={component('two',{title:'Workshop Node',deviceName:'Bench-P4',overallStatus:'warning',uptime:'18:42:10',firmwareVersion:'v1.2.0',networkStatus:'Offline'})} palette={FG_PREVIEW_PALETTES.nordic_ice}/></></ChakraProvider>)
    expect(screen.getAllByTestId('forgeui-device-summary-card')).toHaveLength(2); expect(screen.getByText('Device Summary')).toBeInTheDocument(); expect(screen.getByText('Workshop Node')).toBeInTheDocument(); expect(screen.getByText('ForgeUI-P4')).toBeInTheDocument(); expect(screen.getByText('Bench-P4')).toBeInTheDocument(); expect(screen.getByText('ONLINE')).toBeInTheDocument(); expect(screen.getByText('WARNING')).toBeInTheDocument(); expect(screen.getByText('02:14:36')).toBeInTheDocument(); expect(screen.getByText('v3.5.4')).toBeInTheDocument(); expect(screen.getByText('Connected')).toBeInTheDocument(); expect(screen.getAllByText('Ready')).toHaveLength(2)
  })
  it('routes through the shared Browser/Live preview renderer',()=>{
    const child=component('live-device',{deviceName:'Live ForgeUI-P4'}); const components:any={root:{id:'root',parent:'root',type:'Box',children:[child.id],props:{w:1024,h:600}},[child.id]:child}
    const LiveHarness=()=> <>{renderForgePreview({component:components.root,components})}</>
    render(<ChakraProvider><LiveHarness/></ChakraProvider>); expect(screen.getByTestId('forgeui-device-summary-card')).toBeInTheDocument(); expect(screen.getByText('Live ForgeUI-P4')).toBeInTheDocument()
  })
})
