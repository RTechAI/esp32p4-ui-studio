import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { FORGEUI_NETWORK_STATUS_CARD_DEFAULT_SIZE, FORGEUI_NETWORK_STATUS_CARD_MIN_SIZE, normalizeForgeUINetworkStatusCard } from './ForgeUINetworkStatusCard'
import { ForgeUINetworkStatusCardPreview } from './preview/ForgeUINetworkStatusCardPreview'
import { FG_PREVIEW_PALETTES } from './preview/forgeThemeMap'

const component=(id:string,props:Record<string,unknown>={}):IComponent=>({id,parent:'root',type:'NetworkStatusCard',children:[],props:{w:240,h:145,...props}})
describe('Network Status Card',()=>{
  it('uses stackable Dashboard-family default and minimum geometry',()=>{
    expect(FORGEUI_NETWORK_STATUS_CARD_DEFAULT_SIZE).toEqual({width:240,height:145})
    expect(FORGEUI_NETWORK_STATUS_CARD_MIN_SIZE).toEqual({width:220,height:128})
  })
  it('normalizes safe defaults, version and signal clamping',()=>{
    expect(normalizeForgeUINetworkStatusCard({signalStrength:140,networkType:'invalid',accentColour:'bad'})).toMatchObject({schemaVersion:1,networkType:'wifi',signalStrength:100,networkName:'ForgeUI-Lab',ipAddress:'192.168.1.42',accentColour:'#22C55E'})
    expect(normalizeForgeUINetworkStatusCard({signalStrength:-9}).signalStrength).toBe(0)
  })
  it('renders connected and disconnected instances independently',()=>{
    render(<ChakraProvider><><ForgeUINetworkStatusCardPreview component={component('one')} palette={FG_PREVIEW_PALETTES.graphite}/><ForgeUINetworkStatusCardPreview component={component('two',{connected:false,networkName:'Backup LAN',statusText:'Link down'})} palette={FG_PREVIEW_PALETTES.nordic_ice}/></></ChakraProvider>)
    expect(screen.getAllByTestId('forgeui-network-status-card')).toHaveLength(2); expect(screen.getAllByText('Network Status')).toHaveLength(2); expect(screen.getAllByLabelText('Wi-Fi icon')).toHaveLength(2); expect(screen.getByText('ForgeUI-Lab')).toBeInTheDocument(); expect(screen.getByText('IP 192.168.1.42')).toBeInTheDocument(); expect(screen.getAllByText('forgeui-p4')).toHaveLength(2); expect(screen.getByText('Backup LAN')).toBeInTheDocument(); expect(screen.getByText('CONNECTED')).toBeInTheDocument(); expect(screen.getByText('DISCONNECTED')).toBeInTheDocument(); expect(screen.getByText('Online')).toBeInTheDocument(); expect(screen.getByText('Link down')).toBeInTheDocument(); expect(screen.getByText('78%')).toBeInTheDocument(); expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
