import React from 'react'
import { Box } from '@chakra-ui/react'

type Props = {
  initialSelected: boolean
  label: React.ReactNode
  isDisabled?: boolean
  colorScheme?: string
  textColor?: string
  accent?: string
  border?: string
}

const StandardRadioPreview = ({
  initialSelected,
  label,
  isDisabled,
  colorScheme,
  textColor,
  accent,
  border,
}: Props) => {
  const [selected, setSelected] = React.useState(initialSelected)

  React.useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected])

  return (
    <Box
      as="label"
      display="inline-flex"
      alignItems="center"
      gap="8px"
      color={textColor}
      opacity={isDisabled ? 0.4 : 1}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      data-testid="standard-radio-preview"
    >
      <input
        type="checkbox"
        role="radio"
        checked={selected}
        disabled={isDisabled}
        onChange={event => setSelected(event.target.checked)}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
        }}
      />
      <Box
        width="18px"
        height="18px"
        borderRadius="999px"
        border="2px solid"
        borderColor={selected ? accent : border}
        bg={selected ? accent : 'transparent'}
        boxShadow={selected ? `inset 0 0 0 4px transparent` : undefined}
        data-color-scheme={colorScheme}
      />
      <Box as="span">{label}</Box>
    </Box>
  )
}

export default StandardRadioPreview
