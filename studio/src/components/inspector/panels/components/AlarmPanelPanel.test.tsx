import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { AlarmPanelPanel } from './AlarmPanelPanel'

const setValue = jest.fn()
jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValue }) }))
jest.mock('~hooks/usePropsSelector', () => () => undefined)
jest.mock('~hooks/useSelectedComponentProps', () => ({ useSelectedComponentProps: () => ({}) }))

test('Alarm Panel Inspector exposes semantic property groups', () => {
  render(<ChakraProvider><AlarmPanelPanel /></ChakraProvider>)
  ;['General', 'Alarms', 'Appearance', 'Behaviour', 'Integration', 'Maximum visible alarms', 'Alarm capacity', 'Sort order'].forEach(label => expect(screen.getByText(label)).toBeInTheDocument())
  expect(screen.getByLabelText('Alarm 1 message')).toHaveValue('High discharge pressure')
  fireEvent.change(screen.getByLabelText('Alarm 1 message'), { target: { value: 'Edited pressure alarm' } })
  expect(setValue).toHaveBeenCalledWith('alarms', expect.arrayContaining([
    expect.objectContaining({ id: 'alarm-1', message: 'Edited pressure alarm' }),
  ]))
  fireEvent.click(screen.getByRole('button', { name: 'Add alarm' }))
  expect(setValue).toHaveBeenCalledWith('alarms', expect.arrayContaining([
    expect.objectContaining({ id: 'alarm-4', message: 'Alarm 4' }),
  ]))
})
