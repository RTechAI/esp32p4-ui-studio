import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'

import StandardTextPanel from './StandardTextPanel'

const receivedValues: string[] = []
const setValueFromEvent = jest.fn(event => {
  receivedValues.push(event.target.value)
})
const values: Record<string, unknown> = {}

jest.mock('~hooks/useForm', () => ({
  useForm: () => ({ setValueFromEvent }),
}))

jest.mock('~hooks/usePropsSelector', () => ({
  __esModule: true,
  default: (name: string) => values[name],
}))

describe('Standard Text Inspector', () => {
  beforeEach(() => {
    setValueFromEvent.mockClear()
    receivedValues.length = 0
    Object.keys(values).forEach(key => delete values[key])
  })

  it('uses an unrestricted multiline editor and forwards whitespace verbatim', () => {
    const value = 'ForgeUI Text\n  Long wrapping validation\nESP32-P4 physical proof  '
    values.textValue = value
    render(<ChakraProvider><StandardTextPanel /></ChakraProvider>)

    const editor = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(editor.tagName).toBe('TEXTAREA')
    expect(editor).not.toHaveAttribute('maxlength')
    expect(editor.value).toBe(value)

    const updated = `${value}\n${'long text '.repeat(100)}`
    fireEvent.change(editor, { target: { name: 'textValue', value: updated } })
    expect(setValueFromEvent).toHaveBeenCalledTimes(1)
    expect(receivedValues).toEqual([updated])
  })
})
