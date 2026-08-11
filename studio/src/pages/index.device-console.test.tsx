import React from 'react'
import { ChakraProvider, Button } from '@chakra-ui/react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useDeviceConsole } from '~contexts/device-console-context'
import App from './index'

jest.mock('~hooks/useShortcuts', () => () => undefined)
jest.mock('~components/Metadata', () => () => null)
jest.mock('react-dnd', () => ({ DndProvider: ({ children }: any) => children }))
jest.mock('react-dnd-html5-backend', () => ({ HTML5Backend: {} }))
jest.mock('~components/sidebar/Sidebar', () => () => <aside>Widgets</aside>)
jest.mock('~components/editor/Editor', () => () => <div data-testid="design-canvas" data-width="1024" data-height="600">Canvas</div>)
jest.mock('~components/inspector/Inspector', () => () => <aside>Inspector</aside>)
jest.mock('~components/errorBoundaries/EditorErrorBoundary', () => ({ children }: any) => children)
jest.mock('~components/Header', () => () => {
  const state = useDeviceConsole()
  return <Button onClick={() => state.openBuild('Build output')}>Build &amp; Flash</Button>
})

describe('Studio device console placement', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => ({ log: 'Build output', running: true }) }) as jest.Mock
  })

  it('renders the dock outside the design workspace without mutating design dimensions', () => {
    render(<ChakraProvider><App /></ChakraProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Build & Flash' }))
    const workspace = screen.getByTestId('studio-workspace')
    const dock = screen.getByTestId('device-console-dock')
    const canvas = screen.getByTestId('design-canvas')
    const sidebarColumn = screen.getByTestId('studio-sidebar-column')
    const canvasColumn = screen.getByTestId('studio-canvas-column')
    const inspectorColumn = screen.getByTestId('studio-inspector-column')
    expect(workspace).not.toContainElement(dock)
    expect(workspace).toContainElement(sidebarColumn)
    expect(workspace).toContainElement(canvasColumn)
    expect(workspace).toContainElement(inspectorColumn)
    expect(workspace).toHaveStyle({ height: '100%', minHeight: '0px', overflow: 'hidden' })
    ;[sidebarColumn, canvasColumn, inspectorColumn].forEach(column => {
      expect(column).toHaveStyle({ height: '100%', minHeight: '0px' })
    })
    expect(sidebarColumn).toHaveStyle({ overflow: 'hidden' })
    expect(canvasColumn).toHaveStyle({ overflow: 'hidden' })
    expect(inspectorColumn).toHaveStyle({ overflowY: 'auto' })
    expect(canvas).toHaveAttribute('data-width', '1024')
    expect(canvas).toHaveAttribute('data-height', '600')

    const dispatchPointer = (target: EventTarget, type: string, clientY: number) => {
      const event = new Event(type, { bubbles: true })
      Object.defineProperty(event, 'clientY', { value: clientY })
      target.dispatchEvent(event)
    }
    act(() => {
      dispatchPointer(screen.getByRole('separator', { name: 'Resize device console' }), 'pointerdown', 500)
      dispatchPointer(window, 'pointermove', 400)
      dispatchPointer(window, 'pointerup', 400)
    })
    expect(dock).toHaveStyle({ height: '340px' })
    expect(canvas).toHaveAttribute('data-width', '1024')
    expect(canvas).toHaveAttribute('data-height', '600')

    fireEvent.click(screen.getByRole('button', { name: 'Collapse' }))
    expect(screen.queryByTestId('device-console-dock')).not.toBeInTheDocument()
    expect(screen.getByTestId('studio-workspace')).toBeInTheDocument()
  })
})
