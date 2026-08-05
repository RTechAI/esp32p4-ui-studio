import React from 'react'
import { Box, ChakraProvider, Grid, Text } from '@chakra-ui/react'
import { ForgeUIDashboardCardPreview } from '~forgeui/preview/ForgeUIDashboardCardPreview'
import { FG_PREVIEW_PALETTES } from '~forgeui/preview/forgeThemeMap'
import { getPreviewDefaultProps } from '~utils/defaultProps'

const defaults = getPreviewDefaultProps('DashboardCard')

const proofCard = (index: number): IComponent => ({
  id: `dashboard-card-proof-${index}`,
  componentName: `Dashboard Card ${index}`,
  type: 'DashboardCard',
  parent: 'root',
  children: [],
  props: {
    ...defaults,
    value: String([72, 48, 91, 36, 64, 83][index - 1]),
    status: index === 3 ? 'warning' : 'normal',
    statusText: index === 3 ? 'Warning' : 'Normal',
  },
})

const DashboardCardProof = () => (
  <ChakraProvider>
    <Box width="1024px" height="600px" padding="24px" background="#020617" color="white">
      <Text fontSize="16px" fontWeight="600" marginBottom="16px">Dashboard Card compact 3 × 2 proof</Text>
      <Grid templateColumns="repeat(3, 240px)" autoRows="145px" gap="16px">
        {[1, 2, 3, 4, 5, 6].map(index => (
          <ForgeUIDashboardCardPreview
            key={index}
            component={proofCard(index)}
            palette={FG_PREVIEW_PALETTES.graphite}
          />
        ))}
      </Grid>
    </Box>
  </ChakraProvider>
)

export default DashboardCardProof
