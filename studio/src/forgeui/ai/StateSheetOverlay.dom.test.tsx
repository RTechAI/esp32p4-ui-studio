import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react'

import StateSheetOverlay from './StateSheetOverlay'

it('mounts three live Three-Position boxes with visible react-rnd handles', async () => {
  const { container } = render(
    <ChakraProvider>
      <StateSheetOverlay
        imageElement={{
          clientWidth: 600,
          clientHeight: 600,
        } as HTMLImageElement}
        project={{
          sourceWidth: 600,
          sourceHeight: 600,
          cropWidth: 400,
          cropHeight: 150,
          regions: [
            { id: 'left', label: 'LEFT', x: 100, y: 50 },
            {
              id: 'center',
              label: 'CENTER',
              x: 100,
              y: 200,
            },
            {
              id: 'right',
              label: 'RIGHT',
              x: 100,
              y: 350,
            },
          ],
        }}
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
  const directions = [
    'top',
    'right',
    'bottom',
    'left',
    'top-right',
    'bottom-right',
    'bottom-left',
    'top-left',
  ]
  const handles = ['left', 'center', 'right'].flatMap(
    region => directions.map(direction =>
      container.querySelector(
        `.state-sheet-resize-handle-${region}-${direction}`,
      ),
    ),
  )

  await waitFor(() =>
    handles.forEach(handle =>
      expect(handle).toBeInTheDocument(),
    ),
  )
  handles.forEach(handle => {
    const element = handle as HTMLElement
    expect(element.style.zIndex).not.toBe('')
    expect(
      element.style.width || element.style.height,
    ).not.toBe('')
  })
})
