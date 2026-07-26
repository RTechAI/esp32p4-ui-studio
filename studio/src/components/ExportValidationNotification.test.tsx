import React from 'react'
import {
  render,
  screen,
} from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'

import {
  ExportValidationDialog,
  getExportValidationToastId,
  notifyExportValidationToast,
} from './ExportValidationNotification'

const createToast = () => {
  const active = new Set<string>()
  const toast = jest.fn((options: any) => {
    active.add(String(options.id))
    return options.id
  }) as any
  toast.isActive = jest.fn((id: string) =>
    active.has(String(id)),
  )
  toast.update = jest.fn()
  toast.close = jest.fn()
  toast.closeAll = jest.fn()

  return toast
}

describe('Export validation notifications', () => {
  it('emits one notification for one failed export', () => {
    const toast = createToast()

    notifyExportValidationToast(toast, 'First validation report')

    expect(toast).toHaveBeenCalledTimes(1)
    expect(toast.update).not.toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith(expect.objectContaining({
      id: getExportValidationToastId('First validation report'),
      title: 'Export validation failed.',
    }))
    expect(toast.mock.calls[0][0].description).toBeUndefined()
  })

  it('updates the active notification for the same validation report', () => {
    const toast = createToast()
    const message = 'Repeated validation report'

    notifyExportValidationToast(toast, message)
    notifyExportValidationToast(toast, message)

    expect(toast).toHaveBeenCalledTimes(1)
    expect(toast.update).toHaveBeenCalledTimes(1)
    expect(toast.update).toHaveBeenCalledWith(
      getExportValidationToastId(message),
      expect.objectContaining({
        title: 'Export validation failed.',
      }),
    )
  })

  it('keeps different validation reports as separate notifications', () => {
    const toast = createToast()

    notifyExportValidationToast(toast, 'Missing Button artwork')
    notifyExportValidationToast(toast, 'Duplicate Button callback')

    expect(toast).toHaveBeenCalledTimes(2)
    expect(toast.update).not.toHaveBeenCalled()
    expect(toast.mock.calls[0][0].id)
      .not.toBe(toast.mock.calls[1][0].id)
  })

  it('passes the full multiline report to the detailed dialog', () => {
    const message = [
      'Export Validation Failed',
      '',
      'Public API',
      'Two Interactive Buttons generate the same public callback:',
      '',
      'FG_On_StartButton_Clicked(void)',
      '',
      'Conflicting Buttons:',
      '- "Blue Start Button"',
      '- "Silver Start Button"',
      '',
      'Rename one Button’s Label.',
    ].join('\n')

    render(
      <ChakraProvider>
        <ExportValidationDialog
          message={message}
          isOpen
          onClose={jest.fn()}
        />
      </ChakraProvider>,
    )

    const details = screen.getByTestId(
      'export-validation-details',
    )
    expect(details).toHaveTextContent(
      'Two Interactive Buttons generate the same public callback:',
    )
    expect(details).toHaveTextContent(
      'FG_On_StartButton_Clicked(void)',
    )
    expect(details.querySelector('code')).toHaveTextContent(
      'FG_On_StartButton_Clicked(void)',
    )
    expect(details.querySelectorAll('li')).toHaveLength(2)
    expect(details).toHaveTextContent('Rename one Button’s Label.')
  })
})
