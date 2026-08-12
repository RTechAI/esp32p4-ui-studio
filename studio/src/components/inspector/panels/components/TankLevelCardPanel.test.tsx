import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { TankLevelCardPanel } from './TankLevelCardPanel'

jest.mock('~hooks/useForm',()=>({useForm:()=>({setValue:jest.fn()})}))
jest.mock('~hooks/usePropsSelector',()=>({__esModule:true,default:()=>undefined}))
jest.mock('~hooks/useSelectedComponentProps',()=>({useSelectedComponentProps:()=>({})}))

test('Tank Level Card Inspector exposes implemented monitoring controls only', () => {
  render(<ChakraProvider><TankLevelCardPanel /></ChakraProvider>)
  expect(screen.getByText('ForgeUI Native Tank Level Card')).toBeInTheDocument()
  expect(screen.getByText('Current volume')).toBeInTheDocument()
  expect(screen.getByText('High level')).toBeInTheDocument()
  expect(screen.getByText('Tank shape')).toBeInTheDocument()
  expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument()
  expect(screen.queryByText(/UserEvents/)).not.toBeInTheDocument()
})
