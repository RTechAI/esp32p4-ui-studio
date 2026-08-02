import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { StandardMenuPreview } from './StandardMenuPreview'

const component = { props: { rootPageId: 'root', pages: [
  { id: 'root', title: 'Settings', sections: [{ id: 'main', title: 'General', items: [
    { id: 'display', label: 'Display', subtitle: 'Brightness', icon: 'LV_SYMBOL_EYE_OPEN', targetPageId: 'display-page', enabled: true },
    { id: 'disabled', label: 'Locked', subtitle: '', icon: '', targetPageId: '', enabled: false },
  ] }] },
  { id: 'display-page', title: 'Display', sections: [{ id: 'options', title: '', items: [] }] },
] } }

describe('Standard Menu preview', () => {
  it('renders pages, sections, icons, subtitles and disabled items', () => {
    render(<ChakraProvider><StandardMenuPreview component={component} /></ChakraProvider>)
    expect(screen.getByTestId('standard-menu')).toBeVisible()
    expect(screen.getByText('General')).toBeVisible()
    expect(screen.getByText('Brightness')).toBeVisible()
    expect(screen.getByRole('button', { name: /Locked/ })).toBeDisabled()
  })

  it('navigates to child pages and back in browser mode', () => {
    render(<ChakraProvider><StandardMenuPreview component={component} mode="browser" /></ChakraProvider>)
    fireEvent.click(screen.getByRole('button', { name: /Display Brightness/ }))
    expect(screen.getByText('Display')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Menu back' }))
    expect(screen.getByText('Settings')).toBeVisible()
  })
})

