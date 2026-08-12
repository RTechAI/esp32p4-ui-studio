import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { DeviceSummaryCardPanel } from './DeviceSummaryCardPanel'

jest.mock('~hooks/useForm',()=>({useForm:()=>({setValue:jest.fn()})}))
jest.mock('~hooks/usePropsSelector',()=>()=>undefined)
jest.mock('~hooks/useSelectedComponentProps',()=>({useSelectedComponentProps:()=>({})}))

test('Device Summary Card Inspector exposes semantic monitoring controls and no UserEvents',()=>{render(<ChakraProvider><DeviceSummaryCardPanel/></ChakraProvider>); expect(screen.getByText('ForgeUI Native Device Summary Card')).toBeInTheDocument(); expect(screen.getByText('Device name')).toBeInTheDocument(); expect(screen.getByText('Overall status')).toBeInTheDocument(); expect(screen.getByText('Firmware / version')).toBeInTheDocument(); expect(screen.getByText('Network status')).toBeInTheDocument(); expect(screen.getByText('Storage status')).toBeInTheDocument(); expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument(); expect(screen.queryByText(/UserEvents/)).not.toBeInTheDocument()})
