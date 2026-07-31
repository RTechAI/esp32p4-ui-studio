import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'

import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const coordinate = (value: unknown) => Number(value) >= 1 ? 1 : 0

const StandardTileViewPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
  mode?: 'canvas' | 'browser'
}> = ({ component, palette, mode = 'browser' }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const serializedColumn = coordinate(component.props.initialColumn)
  const serializedRow = coordinate(component.props.initialRow)
  const [selection, setSelection] = useState({
    column: serializedColumn,
    row: serializedRow,
  })
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setSelection({
      column: serializedColumn,
      row: serializedRow,
    })
  }, [serializedColumn, serializedRow])

  const tiles = [
    { label: 'Tile 1', column: 0, row: 0 },
    { label: 'Tile 2', column: 1, row: 0 },
    { label: 'Tile 3', column: 0, row: 1 },
    { label: 'Tile 4', column: 1, row: 1 },
  ]
  const selectNeighbor = (deltaColumn: number, deltaRow: number) => {
    setSelection(current => ({
      column: Math.max(0, Math.min(1, current.column + deltaColumn)),
      row: Math.max(0, Math.min(1, current.row + deltaRow)),
    }))
  }

  return (
    <Box
      width="100%"
      height="100%"
      position="relative"
      overflow="hidden"
      bg={theme.surface}
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="10px"
      role={mode === 'browser' ? 'application' : undefined}
      tabIndex={mode === 'browser' ? 0 : undefined}
      onPointerDown={mode === 'browser' ? event => {
        pointerStart.current = { x: event.clientX, y: event.clientY }
      } : undefined}
      onPointerUp={mode === 'browser' ? event => {
        const start = pointerStart.current
        pointerStart.current = null
        if (!start) return
        const dx = event.clientX - start.x
        const dy = event.clientY - start.y
        if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return
        if (Math.abs(dx) >= Math.abs(dy)) selectNeighbor(dx < 0 ? 1 : -1, 0)
        else selectNeighbor(0, dy < 0 ? 1 : -1)
      } : undefined}
      onKeyDown={mode === 'browser' ? event => {
        if (event.key === 'ArrowLeft') selectNeighbor(-1, 0)
        if (event.key === 'ArrowRight') selectNeighbor(1, 0)
        if (event.key === 'ArrowUp') selectNeighbor(0, -1)
        if (event.key === 'ArrowDown') selectNeighbor(0, 1)
      } : undefined}
      data-testid="standard-tileview-preview"
    >
      {tiles.map(({ label, column, row }, index) => {
        const selected =
          selection.column === column && selection.row === row

        return (
          <Box
            key={label}
            display={selected ? 'flex' : 'none'}
            position="absolute"
            inset="0"
            minWidth="0"
            minHeight="0"
            p="0"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            bg={selected ? theme.selectedSurface : theme.surfaceSecondary}
            color={selected ? theme.accentText : theme.textPrimary}
            border={`1px solid ${theme.surfaceBorder}`}
            borderRadius="10px"
            fontSize="12px"
            fontWeight="normal"
            data-selected={selected ? 'true' : 'false'}
            data-testid={`standard-tileview-tile-${index}`}
          >
            {label}
          </Box>
        )
      })}
    </Box>
  )
}

export default StandardTileViewPreview
