import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { PowerFlowCardPanel } from './PowerFlowCardPanel'
jest.mock('~hooks/useForm',()=>({useForm:()=>({setValue:jest.fn()})})); jest.mock('~hooks/usePropsSelector',()=>()=>undefined)
jest.mock('~hooks/useSelectedComponentProps',()=>({useSelectedComponentProps:()=>({})}))
test('Power Flow Card Inspector exposes bounded semantic controls and zero UserEvents',()=>{render(<ChakraProvider><PowerFlowCardPanel/></ChakraProvider>); expect(screen.getByText('ForgeUI Native Power Flow Card')).toBeInTheDocument(); expect(screen.getByText('Grid flow')).toBeInTheDocument(); expect(screen.getByText('Solar flow')).toBeInTheDocument(); expect(screen.getByText('Battery flow')).toBeInTheDocument(); expect(screen.getByText('Load value')).toBeInTheDocument(); expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument(); expect(screen.queryByText(/UserEvents/)).not.toBeInTheDocument(); expect(screen.queryByText(/Node X/)).not.toBeInTheDocument()})
