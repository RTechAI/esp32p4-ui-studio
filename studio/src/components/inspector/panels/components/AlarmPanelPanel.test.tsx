import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { AlarmPanelPanel } from './AlarmPanelPanel'

jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue: jest.fn() }) }))
jest.mock('~hooks/usePropsSelector', () => () => undefined)

test('Alarm Panel Inspector exposes semantic property groups', () => {
  render(<ChakraProvider><AlarmPanelPanel /></ChakraProvider>)
  ;['General', 'Appearance', 'Behaviour', 'Integration', 'Maximum visible alarms', 'Alarm capacity', 'Sort order'].forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
})
