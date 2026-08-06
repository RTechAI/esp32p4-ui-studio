import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { KpiCardPanel } from './KpiCardPanel'
jest.mock('~hooks/useForm',()=>({useForm:()=>({setValue:jest.fn()})})); jest.mock('~hooks/usePropsSelector',()=>()=>undefined)
test('KPI Card Inspector exposes semantic monitoring controls and no UserEvents',()=>{render(<ChakraProvider><KpiCardPanel/></ChakraProvider>); expect(screen.getByText('ForgeUI Native KPI Card')).toBeInTheDocument(); expect(screen.getByText('Primary value')).toBeInTheDocument(); expect(screen.getByText('Trend state')).toBeInTheDocument(); expect(screen.getByText('Semantic status')).toBeInTheDocument(); expect(screen.getByText('Target / reference')).toBeInTheDocument(); expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument(); expect(screen.queryByText(/UserEvents/)).not.toBeInTheDocument()})
