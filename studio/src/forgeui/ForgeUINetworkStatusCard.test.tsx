import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { normalizeForgeUINetworkStatusCard } from './ForgeUINetworkStatusCard'
import { ForgeUINetworkStatusCardPreview } from './preview/ForgeUINetworkStatusCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component=(id:string,props:Record<string,unknown>={}):IComponent=>({id,parent:'root',type:'NetworkStatusCard',children:[],props:{w:300,h:190,...props}})
describe('Network Status Card',()=>{
  it('normalizes safe defaults, version and signal clamping',()=>{
    expect(normalizeForgeUINetworkStatusCard({signalStrength:140,networkType:'invalid',accentColour:'bad'})).toMatchObject({schemaVersion:1,networkType:'wifi',signalStrength:100,networkName:'ForgeUI-Lab',ipAddress:'192.168.1.42',accentColour:'#22C55E'})
    expect(normalizeForgeUINetworkStatusCard({signalStrength:-9}).signalStrength).toBe(0)
  })
  it('renders connected and disconnected instances independently',()=>{
    render(<ChakraProvider><><ForgeUINetworkStatusCardPreview component={component('one')} palette={FG_PREVIEW_PALETTES.graphite}/><ForgeUINetworkStatusCardPreview component={component('two',{connected:false,networkName:'Backup LAN',statusText:'Link down'})} palette={FG_PREVIEW_PALETTES.nordic_ice}/></></ChakraProvider>)
    expect(screen.getAllByTestId('forgeui-network-status-card')).toHaveLength(2); expect(screen.getByText('ForgeUI-Lab')).toBeInTheDocument(); expect(screen.getByText('Backup LAN')).toBeInTheDocument(); expect(screen.getByText('CONNECTED')).toBeInTheDocument(); expect(screen.getByText('DISCONNECTED')).toBeInTheDocument(); expect(screen.getByText('78%')).toBeInTheDocument(); expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
