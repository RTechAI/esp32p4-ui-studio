import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { IOMonitorPanel } from './IOMonitorPanel'

jest.mock('~hooks/usePropsSelector', () => ({ __esModule: true, default: (key: string) => key === 'rows' ? [] : undefined }))
jest.mock('~hooks/useSelectedComponentProps', () => ({ useSelectedComponentProps: () => ({ rows: [] }) }))
jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue: jest.fn() }) }))

test('IO Monitor Inspector exposes semantic row controls', () => {
  render(<ChakraProvider><IOMonitorPanel /></ChakraProvider>)
  expect(screen.getByText('ForgeUI Native IO Monitor')).toBeInTheDocument()
  expect(screen.getByText('Maximum rows')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Add row' })).toBeInTheDocument()
  expect(screen.getByText('Generate Runtime SDK')).toBeInTheDocument()
  expect(screen.getByText('Generate UserEvents')).toBeInTheDocument()
})
