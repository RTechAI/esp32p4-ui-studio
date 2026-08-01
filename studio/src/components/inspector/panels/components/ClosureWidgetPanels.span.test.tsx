import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import { SpanPanel } from './ClosureWidgetPanels'

const mockSetValue = jest.fn()
const mockProps: Record<string, any> = {
  spans: [
    { id: 'first', text: 'First', semanticColor: 'textPrimary', color: '', fontSize: 16, underline: false },
    { id: 'second', text: 'Second', semanticColor: 'accent', color: '', fontSize: 20, underline: true },
  ],
  textAlign: 'left', overflow: 'ellipsis',
}
jest.mock('~hooks/useForm', () => ({ useForm: () => ({ componentId: 'span', setValue: mockSetValue }) }))
jest.mock('~hooks/usePropsSelector', () => ({ __esModule: true, default: (name: string) => mockProps[name] }))

describe('Span Inspector collection editor', () => {
  beforeEach(() => mockSetValue.mockClear())

  it('commits text, semantic styling and immutable collection actions', () => {
    render(<ChakraProvider><SpanPanel /></ChakraProvider>)
    fireEvent.change(screen.getByLabelText('Span 1 text'), { target: { value: 'Edited' } })
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', expect.arrayContaining([expect.objectContaining({ id: 'first', text: 'Edited' })]))
    fireEvent.change(screen.getByLabelText('Span 1 semantic colour'), { target: { value: 'healthHigh' } })
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', expect.arrayContaining([expect.objectContaining({ id: 'first', semanticColor: 'healthHigh' })]))
    fireEvent.click(screen.getAllByRole('checkbox', { name: 'Use explicit colour override' })[0])
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', expect.arrayContaining([expect.objectContaining({ id: 'first', color: '#FFFFFF' })]))
    fireEvent.click(screen.getAllByRole('button', { name: 'Move up' })[1])
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', [expect.objectContaining({ id: 'second' }), expect.objectContaining({ id: 'first' })])
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0])
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', [expect.objectContaining({ id: 'second' })])
    fireEvent.click(screen.getByRole('button', { name: 'Add span' }))
    expect(mockSetValue).toHaveBeenLastCalledWith('spans', expect.arrayContaining([expect.objectContaining({ text: 'New span' })]))
  })
})
