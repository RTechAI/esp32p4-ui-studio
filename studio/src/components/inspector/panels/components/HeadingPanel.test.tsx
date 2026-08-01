import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import HeadingPanel from './HeadingPanel'

const updates: string[] = []
const setValueFromEvent = jest.fn(event => updates.push(event.target.value))
const values: Record<string, unknown> = {}

jest.mock('~hooks/useForm', () => ({ useForm: () => ({ setValueFromEvent }) }))
jest.mock('~hooks/usePropsSelector', () => ({
  __esModule: true,
  default: (name: string) => values[name],
}))

describe('Heading Inspector', () => {
  beforeEach(() => {
    updates.length = 0
    setValueFromEvent.mockClear()
    Object.keys(values).forEach(key => delete values[key])
  })

  it('preserves explicit newlines through the multiline dispatch path', () => {
    values.headingText = 'FORGEUI HEADING\nESP32-P4 PROOF'
    render(<ChakraProvider><HeadingPanel /></ChakraProvider>)
    const editor = screen.getByLabelText('Heading Text') as HTMLTextAreaElement
    expect(editor.tagName).toBe('TEXTAREA')
    expect(editor).not.toHaveAttribute('maxlength')
    fireEvent.change(editor, { target: { value: 'TITLE\nSECOND LINE' } })
    expect(updates).toEqual(['TITLE\nSECOND LINE'])
    expect(screen.queryByText('Truncated')).not.toBeInTheDocument()
  })
})
