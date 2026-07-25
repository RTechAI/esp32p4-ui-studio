import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import StateSheetOverlay, {
  ForgeUIStateSheetProject,
} from './StateSheetOverlay'

const mockRndProps: any[] = []

jest.mock('react-rnd', () => ({
  Rnd: (props: any) => {
    mockRndProps.push(props)
    const directions = Object.entries(
      props.enableResizing || {},
    )
      .filter(([, enabled]) => enabled)
      .map(([direction]) => direction)

    return (
      <div
        data-testid={props['data-testid'] || 'mock-rnd'}
        data-drag-disabled={String(
          props.disableDragging === true,
        )}
      >
        {props.children}
        {directions.map(direction => (
          <button
            key={direction}
            data-testid={`${props['data-testid']}-resize-${direction}`}
            className={props.resizeHandleClasses?.[direction]}
            onClick={() => props.onResize?.(
              {},
              direction,
              { offsetWidth: 300, offsetHeight: 360 },
              {},
              { x: 20, y: 30 },
            )}
          />
        ))}
        <button
          data-testid={`${props['data-testid']}-drag`}
          onClick={() =>
            props.onDrag?.({}, { x: 40, y: 50 })
          }
        />
      </div>
    )
  },
}))

const imageElement = {
  clientWidth: 600,
  clientHeight: 600,
} as HTMLImageElement

const threePositionProject: ForgeUIStateSheetProject = {
  sourceWidth: 600,
  sourceHeight: 600,
  cropWidth: 400,
  cropHeight: 150,
  regions: [
    { id: 'left', label: 'LEFT', x: 100, y: 50 },
    { id: 'center', label: 'CENTER', x: 100, y: 200 },
    { id: 'right', label: 'RIGHT', x: 100, y: 350 },
  ],
}

describe('StateSheetOverlay rendered interaction', () => {
  beforeEach(() => {
    mockRndProps.length = 0
  })

  it('renders three draggable Three-Position boxes with synchronized handles', async () => {
    render(
      <ChakraProvider>
        <StateSheetOverlay
          imageElement={imageElement}
          project={threePositionProject}
          onChange={jest.fn()}
        />
      </ChakraProvider>,
    )

    await screen.findByTestId('state-sheet-crop-left')
    expect(screen.getByTestId(
      'state-sheet-crop-center',
    )).toBeInTheDocument()
    expect(screen.getByTestId(
      'state-sheet-crop-right',
    )).toBeInTheDocument()
    expect(mockRndProps).toHaveLength(3)
    expect(mockRndProps[0].disableDragging).toBe(false)
    expect(Object.values(mockRndProps[0].enableResizing))
      .toEqual(Array(8).fill(true))
    ;[
      'top',
      'right',
      'bottom',
      'left',
      'topRight',
      'bottomRight',
      'bottomLeft',
      'topLeft',
    ].forEach(direction => {
      expect(screen.getByTestId(
        `state-sheet-crop-left-resize-${direction}`,
      )).toBeInTheDocument()
      expect(mockRndProps[0].resizeHandleStyles[direction])
        .toEqual(expect.objectContaining({
          zIndex: expect.any(Number),
        }))
    })
  })

  it('shares resized dimensions and moves CENTER independently', async () => {
    const onChange = jest.fn()
    render(
      <ChakraProvider>
        <StateSheetOverlay
          imageElement={imageElement}
          project={threePositionProject}
          onChange={onChange}
        />
      </ChakraProvider>,
    )
    await screen.findByTestId('state-sheet-crop-center')

    fireEvent.click(screen.getByTestId(
      'state-sheet-crop-center-resize-bottomRight',
    ))
    const resized = onChange.mock.calls[0][0]
    expect(resized.cropWidth).toBe(300)
    expect(resized.cropHeight).toBe(360)
    expect(resized.regions.map(
      (region: { x: number; y: number }) =>
        [region.x, region.y],
    )).toEqual([[100, 50], [100, 200], [100, 240]])

    fireEvent.click(screen.getByTestId(
      'state-sheet-crop-center-drag',
    ))
    const moved = onChange.mock.calls[1][0]
    expect(moved.regions.map(
      (region: { x: number; y: number }) =>
        [region.x, region.y],
    )).toEqual([[100, 50], [40, 50], [100, 350]])
  })

  it('applies a left-edge width delta to every linked crop box', async () => {
    const onChange = jest.fn()
    render(
      <ChakraProvider>
        <StateSheetOverlay
          imageElement={imageElement}
          project={threePositionProject}
          onChange={onChange}
        />
      </ChakraProvider>,
    )
    await screen.findByTestId('state-sheet-crop-center')

    fireEvent.click(screen.getByTestId(
      'state-sheet-crop-center-resize-left',
    ))
    const resized = onChange.mock.calls[0][0]

    expect(resized.cropWidth).toBe(300)
    expect(resized.regions.map(
      (region: { x: number }) => region.x,
    )).toEqual([200, 200, 200])
    expect(resized.regions.map(
      (region: { x: number }) =>
        region.x + resized.cropWidth,
    )).toEqual([500, 500, 500])
  })

  it('leaves standard OFF and ON regions as separate draggable frames', async () => {
    const binaryProject: ForgeUIStateSheetProject = {
      sourceWidth: 600,
      sourceHeight: 300,
      cropWidth: 200,
      cropHeight: 200,
      regions: [
        { id: 'off', label: 'OFF', x: 20, y: 50 },
        { id: 'on', label: 'ON', x: 380, y: 50 },
      ],
    }

    render(
      <ChakraProvider>
        <StateSheetOverlay
          imageElement={{
            clientWidth: 600,
            clientHeight: 300,
          } as HTMLImageElement}
          project={binaryProject}
          onChange={jest.fn()}
        />
      </ChakraProvider>,
    )

    await waitFor(() => expect(mockRndProps).toHaveLength(2))
    expect(screen.getByText('OFF')).toBeInTheDocument()
    expect(screen.getByText('ON')).toBeInTheDocument()
    expect(screen.getByTestId(
      'state-sheet-crop-off',
    )).toBeInTheDocument()
  })
})
