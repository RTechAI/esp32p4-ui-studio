import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'

import {
  FORGEUI_TILEVIEW_GAP,
  FORGEUI_TILEVIEW_PADDING,
} from '../ForgeUIStandardTabTileGeometry'
import {
  ForgePreviewPalette,
  resolveForgeSemanticPalette,
} from './forgeThemeMap'

const coordinate = (value: unknown) => Number(value) >= 1 ? 1 : 0

const StandardTileViewPreview: React.FC<{
  component: IComponent
  palette: ForgePreviewPalette
}> = ({ component, palette }) => {
  const theme = resolveForgeSemanticPalette(palette)
  const serializedColumn = coordinate(component.props.initialColumn)
  const serializedRow = coordinate(component.props.initialRow)
  const [selection, setSelection] = useState({
    column: serializedColumn,
    row: serializedRow,
  })

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

  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gridTemplateColumns="repeat(2, minmax(0, 1fr))"
      gridTemplateRows="repeat(2, minmax(0, 1fr))"
      gap={`${FORGEUI_TILEVIEW_GAP}px`}
      p={`${FORGEUI_TILEVIEW_PADDING}px`}
      overflow="hidden"
      bg={theme.surface}
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="10px"
      data-testid="standard-tileview-preview"
    >
      {tiles.map(({ label, column, row }, index) => {
        const selected =
          selection.column === column && selection.row === row

        return (
          <Box
            key={label}
            role="button"
            tabIndex={0}
            minWidth="0"
            minHeight="0"
            p="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            bg={selected ? theme.selectedSurface : theme.surfaceSecondary}
            color={selected ? theme.accentText : theme.textPrimary}
            border={`1px solid ${theme.surfaceBorder}`}
            borderRadius="10px"
            fontSize="12px"
            fontWeight="normal"
            onPointerDown={event => event.stopPropagation()}
            onClick={() => setSelection({ column, row })}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                setSelection({ column, row })
              }
            }}
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
