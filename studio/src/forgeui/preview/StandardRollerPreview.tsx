import React from 'react'
import { Box, Text } from '@chakra-ui/react'
import {
  ForgePreviewPalette,
  FG_PREVIEW_PALETTES,
  resolveForgeSemanticPalette,
} from '~forgeui/preview/forgeThemeMap'
import {
  getForgeUIStandardRollerModel,
} from '~forgeui/ForgeUIStandardRoller'

type StandardRollerPreviewProps = {
  component: IComponent
  palette?: ForgePreviewPalette
}

const StandardRollerPreview: React.FC<
  StandardRollerPreviewProps
> = ({
  component,
  palette = FG_PREVIEW_PALETTES.graphite,
}) => {
  const roller = getForgeUIStandardRollerModel(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const selectedRow = Math.floor(roller.visibleRowCount / 2)

  const rows = Array.from(
    { length: roller.visibleRowCount },
    (_, row) => {
      const offset = row - selectedRow
      let optionIndex = roller.selectedIndex + offset

      if (roller.mode === 'infinite') {
        optionIndex = (
          (optionIndex % roller.options.length) +
          roller.options.length
        ) % roller.options.length
      }

      const visible = optionIndex >= 0 &&
        optionIndex < roller.options.length

      return {
        row,
        selected: offset === 0,
        text: visible ? roller.options[optionIndex] : '',
      }
    },
  )

  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg={theme.surface}
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="8px"
      pointerEvents="none"
      data-testid="standard-roller-preview"
      data-roller-mode={roller.mode}
      data-roller-selected-index={roller.selectedIndex}
      data-roller-visible-rows={roller.visibleRowCount}
    >
      {rows.map(row => (
        <Text
          key={row.row}
          height={`${100 / roller.visibleRowCount}%`}
          flex="0 0 auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          color={
            row.selected
              ? theme.accent
              : theme.textSecondary
          }
          style={{
            background: 'transparent',
            fontSize: '16px',
            fontWeight: row.selected ? 700 : 400,
            lineHeight: 1,
            textAlign: 'center',
          }}
          data-testid={
            row.selected
              ? 'standard-roller-selected-row'
              : 'standard-roller-normal-row'
          }
        >
          {row.text}
        </Text>
      ))}
    </Box>
  )
}

export default StandardRollerPreview
