import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { renderForgePreview } from './preview/forgePreviewRenderer'

jest.mock('~forgeui/theme/ForgeThemeContext', () => ({
  useForgePreviewPalette: () => ({
    name: 'Test',
    bg: '#020617',
    text: '#ffffff',
    border: '#334155',
    surface: '#111827',
    surface2: '#1f2937',
    accent: '#38bdf8',
    texture: 'none',
    borderStyle: 'flat',
  }),
}))

const renderInput = (props: Record<string, unknown>) => {
  const component: IComponent = {
    id: 'input',
    parent: 'root',
    type: 'Input',
    componentName: 'Operator Input',
    props: { x: 10, y: 10, w: 220, h: 44, ...props },
    children: [],
  }
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: ['input'],
  }

  render(
    <ChakraProvider>
      {renderForgePreview({
        component: root,
        components: { root, input: component },
      })}
    </ChakraProvider>,
  )
}

describe('Standard Input Browser Preview', () => {
  it('renders serialized runtime text and placeholder independently', () => {
    renderInput({ value: 'Scott', placeholder: 'Operator name' })

    expect(screen.getByDisplayValue('Scott')).toHaveAttribute(
      'placeholder',
      'Operator name',
    )
  })

  it('does not derive displayed text from the component name', () => {
    renderInput({ placeholder: 'Operator name' })

    expect(screen.getByPlaceholderText('Operator name')).toHaveValue('')
    expect(screen.queryByDisplayValue('Operator Input')).not.toBeInTheDocument()
  })
})
