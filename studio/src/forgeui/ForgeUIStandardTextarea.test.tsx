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

const renderTextarea = (props: Record<string, unknown>) => {
  const textarea: IComponent = {
    id: 'textarea',
    parent: 'root',
    type: 'Textarea',
    componentName: 'Renamed Component',
    props: { x: 10, y: 10, w: 300, h: 140, ...props },
    children: [],
  }
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: ['textarea'],
  }
  render(
    <ChakraProvider>
      {renderForgePreview({
        component: root,
        components: { root, textarea },
      })}
    </ChakraProvider>,
  )
}

describe('Standard Textarea Browser Preview', () => {
  it('renders serialized value and placeholder independently', () => {
    renderTextarea({
      value: 'Line one\nLine two',
      placeholder: 'Maintenance notes',
    })

    expect(screen.getByPlaceholderText('Maintenance notes'))
      .toHaveValue('Line one\nLine two')
  })

  it('does not derive displayed text from the component name', () => {
    renderTextarea({ placeholder: 'Maintenance notes' })

    expect(screen.getByPlaceholderText('Maintenance notes')).toHaveValue('')
    expect(screen.queryByDisplayValue('Renamed Component'))
      .not.toBeInTheDocument()
  })
})
