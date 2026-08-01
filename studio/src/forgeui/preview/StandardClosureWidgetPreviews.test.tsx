import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { StandardAnimImagePreview } from './StandardClosureWidgetPreviews'
import { StandardSpanPreview } from './StandardClosureWidgetPreviews'
import { forgeUIAddUploadedAssets, forgeUIClearUploadedAssets } from '../ForgeUIUploadedAssetRegistry'

const palette = { surfaceBorder: '#334155', textSecondary: '#94A3B8' }
const renderPreview = (frameAssetIds: string[]) => render(<ChakraProvider><StandardAnimImagePreview
  component={{ props: { frameAssetIds, autoStart: false } }} palette={palette} /></ChakraProvider>)

describe('Animation Image preview parity', () => {
  afterEach(() => forgeUIClearUploadedAssets())

  it('shows the neutral outlined empty state', () => {
    const opened = jest.fn()
    window.addEventListener('forgeui-open-asset-manager', opened)
    renderPreview([])
    const message = screen.getByText('Add animation frames')
    expect(screen.getByTestId('standard-anim-image')).toHaveAttribute('data-empty', 'true')
    expect(message).toBeVisible()
    fireEvent.click(message)
    expect(opened).toHaveBeenCalledTimes(1)
    window.removeEventListener('forgeui-open-asset-manager', opened)
  })

  it('removes the placeholder as soon as a valid frame exists', () => {
    forgeUIAddUploadedAssets([{ id: 'frame', name: 'frame.png', type: 'image/png', size: 1,
      createdAt: 1, browserSrc: '/frame.png', kind: 'uploaded', exportStatus: 'lvgl_ready',
      lvgl: 'fg_frame', cFile: 'assets/fg_frame.c' }])
    renderPreview(['frame'])
    expect(screen.queryByText('Add animation frames')).not.toBeInTheDocument()
    expect(screen.getByTestId('standard-anim-image')).toHaveAttribute('data-empty', 'false')
    expect(screen.getByRole('img', { name: 'frame.png' })).toHaveStyle({ objectFit: 'contain' })
  })
})

describe('Span shared preview', () => {
  it('renders mixed styling and exposes an actionable empty state', () => {
    const opened = jest.fn()
    window.addEventListener('forgeui-add-first-span', opened)
    const { rerender } = render(<ChakraProvider><StandardSpanPreview component={{ id: 'span', props: { spans: [] } }} palette={{ ...palette, textPrimary: '#FFFFFF', accent: '#00D4FF' }} /></ChakraProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Add rich-text span' }))
    expect(opened).toHaveBeenCalledTimes(1)
    rerender(<ChakraProvider><StandardSpanPreview component={{ id: 'span', props: { spans: [
      { id: 'a', text: 'Plain ', semanticColor: 'textPrimary', fontSize: 16 },
      { id: 'b', text: 'Accent', semanticColor: 'accent', color: '#123456', fontSize: 24, underline: true },
    ] } }} palette={{ ...palette, textPrimary: '#FFFFFF', accent: '#00D4FF' }} /></ChakraProvider>)
    expect(screen.getByText(/^Plain/)).toBeVisible()
    expect(screen.getByText('Accent')).toBeVisible()
    window.removeEventListener('forgeui-add-first-span', opened)
  })
})
