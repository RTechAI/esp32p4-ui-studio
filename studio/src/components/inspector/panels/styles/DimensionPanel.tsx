import React, { memo } from 'react'
import { SimpleGrid } from '@chakra-ui/react'
import TextControl from '~components/inspector/controls/TextControl'

const DimensionPanel = () => {
  return (
    <SimpleGrid columns={2} spacingX={1}>
      <TextControl label="Width" name="width" />
      <TextControl label="Height" name="height" />
    </SimpleGrid>
  )
}

export default memo(DimensionPanel)