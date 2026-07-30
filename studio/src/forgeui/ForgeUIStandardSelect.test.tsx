import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { fireEvent, render, screen } from '@testing-library/react'
import StandardSelectPreview from './preview/StandardSelectPreview'

describe('Standard Select preview interaction modes', () => {
  it.each(['canvas', 'browser'] as const)(
    '%s uses one bordered semantic renderer without a duplicate focus ring',
    mode => {
      render(
        <ChakraProvider>
          <StandardSelectPreview
            mode={mode}
            options={['Automatic', 'Manual']}
          />
        </ChakraProvider>,
      )

      const select = screen.getByRole('combobox')
      const frame = screen.getByTestId('standard-select-frame')
      expect(select).toHaveAttribute('data-field-background-role', 'surface')
      expect(select).toHaveAttribute('data-shared-select-renderer', 'true')
      expect(frame).toHaveAttribute('data-border-role', 'surfaceBorder')
      expect(frame).toHaveAttribute('data-focus-border-role', 'accent')
      expect(frame).toHaveStyle({
        border: '1px solid #F2A900',
        borderRadius: '8px',
        boxShadow: 'none',
        outline: 'none',
      })
      expect(select).toHaveAttribute('data-text-role', 'textPrimary')
      expect(select).toHaveAttribute('data-arrow-role', 'textPrimary')
      expect(select).toHaveAttribute(
        'data-pressed-background-role',
        'selectedSurface',
      )
      expect(select).toHaveAttribute('data-option-background-role', 'surface')
      expect(select).toHaveAttribute(
        'data-selected-option-background-role',
        'selectedSurface',
      )
    },
  )

  it('Canvas displays serialized options and initial selection', () => {
    render(
      <ChakraProvider>
        <StandardSelectPreview
          mode="canvas"
          options={['Automatic', 'Manual', 'Service']}
          selectedIndex={1}
        />
      </ChakraProvider>,
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('1')
    expect(screen.getByRole('option', { name: 'Manual' })).toBeInTheDocument()
  })

  it('Canvas selection remains local and establishes the drag boundary', () => {
    const serialized = {
      options: ['Automatic', 'Manual', 'Service'],
      selectedIndex: 0,
    }
    render(
      <ChakraProvider>
        <StandardSelectPreview mode="canvas" {...serialized} />
      </ChakraProvider>,
    )
    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: '2' } })
    expect(select).toHaveValue('2')
    expect(serialized.selectedIndex).toBe(0)
    expect(select).toHaveClass('forgeui-canvas-control-interactive')
    expect(fireEvent.dragStart(select)).toBe(false)
  })

  it('Browser selection remains local and supports duplicate text', () => {
    const serialized = {
      options: ['Same', 'Same', 'Different'],
      selectedIndex: 0,
    }
    render(
      <ChakraProvider>
        <StandardSelectPreview mode="browser" {...serialized} />
      </ChakraProvider>,
    )
    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: '1' } })
    expect(select).toHaveValue('1')
    expect(serialized.selectedIndex).toBe(0)
    expect(screen.getAllByRole('option', { name: 'Same' })).toHaveLength(2)
  })

  it('resets local selection when serialized options or index changes', () => {
    const view = render(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          options={['One', 'Two', 'Three']}
          selectedIndex={0}
        />
      </ChakraProvider>,
    )
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '2' } })
    expect(select).toHaveValue('2')

    view.rerender(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          options={['Alpha', 'Beta']}
          selectedIndex={1}
        />
      </ChakraProvider>,
    )
    expect(select).toHaveValue('1')
    expect(screen.getByRole('option', { name: 'Beta' })).toBeInTheDocument()
  })

  it('clamps invalid indexes and handles single and empty lists', () => {
    const view = render(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          options={['Only']}
          selectedIndex={99}
        />
      </ChakraProvider>,
    )
    expect(screen.getByRole('combobox')).toHaveValue('0')

    view.rerender(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          options={[]}
          selectedIndex={99}
        />
      </ChakraProvider>,
    )
    expect((screen.getByRole('combobox') as HTMLSelectElement).selectedIndex)
      .toBe(-1)
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('preserves disabled state and long option text', () => {
    const longOption = 'A very long deterministic option label'
    render(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          options={[longOption]}
          selectedIndex={0}
          isDisabled
        />
      </ChakraProvider>,
    )

    expect(screen.getByRole('combobox')).toBeDisabled()
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'data-field-background-role',
      'surfaceSecondary',
    )
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'data-text-role',
      'disabledText',
    )
    expect(screen.getByRole('option', { name: longOption }))
      .toBeInTheDocument()
  })

  it('uses the legacy three-option fallback and legacy option value', () => {
    render(
      <ChakraProvider>
        <StandardSelectPreview
          mode="browser"
          legacyValue="option2"
        />
      </ChakraProvider>,
    )

    expect(screen.getByRole('combobox')).toHaveValue('1')
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })
})
