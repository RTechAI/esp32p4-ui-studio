import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render,screen } from '@testing-library/react'
import { NetworkStatusCardPanel } from './NetworkStatusCardPanel'
jest.mock('~hooks/useForm',()=>({useForm:()=>({setValue:jest.fn()})})); jest.mock('~hooks/usePropsSelector',()=>({__esModule:true,default:()=>undefined}))
jest.mock('~hooks/useSelectedComponentProps',()=>({useSelectedComponentProps:()=>({})}))
test('Network Status Card Inspector exposes semantic monitoring controls and no UserEvents',()=>{render(<ChakraProvider><NetworkStatusCardPanel/></ChakraProvider>); expect(screen.getByText('ForgeUI Native Network Status Card')).toBeInTheDocument(); expect(screen.getByText('SSID / network name')).toBeInTheDocument(); expect(screen.getByText('Signal strength (%)')).toBeInTheDocument(); expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument(); expect(screen.queryByText(/UserEvents/)).not.toBeInTheDocument()})
