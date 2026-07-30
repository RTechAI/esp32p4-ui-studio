import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import useDispatch from '~hooks/useDispatch'
import {
  getComponents,
  getSelectedComponent,
} from '~core/selectors/components'
import {
  autoArrangeForgeUIRegion,
  ForgeUILayoutArrangement,
  getForgeUILayoutRegions,
} from '~forgeui/layout/ForgeUILayoutDesigner'

const ARRANGEMENTS: ForgeUILayoutArrangement[] = [
  'vertical',
  'horizontal',
  'grid',
  'kpi-cards',
  'button-stack',
  'form-rows',
  'even-distribution',
  'fit-to-region',
]

const LayoutRegionInspector = () => {
  const dispatch = useDispatch()
  const component = useSelector(getSelectedComponent)
  const components = useSelector(getComponents)
  const regions = getForgeUILayoutRegions(components)
  const isRegion =
    component.type === 'Box' &&
    typeof component.props.layoutRegionKey === 'string'
  const update = (name: string, value: unknown) =>
    dispatch.components.updateProps({
      id: component.id,
      name,
      value,
    })

  if (component.id === 'root' || (regions.length === 0 && !isRegion)) {
    return null
  }

  if (!isRegion) {
    return (
      <Box
        mt={3}
        p={3}
        border="1px solid #1e293b"
        borderRadius="md"
        bg="#0f172a"
      >
        <Text fontSize="sm" fontWeight="semibold" color="cyan.300" mb={2}>
          Layout Region
        </Text>
        <FormControl>
          <FormLabel fontSize="xs">Assigned region</FormLabel>
          <Select
            size="sm"
            value={String(component.props.layoutRegionId || '')}
            onChange={event => update('layoutRegionId', event.target.value)}
          >
            <option value="">Unassigned</option>
            {regions.map(region => (
              <option
                key={region.id}
                value={String(region.props.layoutRegionKey)}
              >
                {String(
                  region.props.layoutRegionLabel ||
                  region.props.layoutRegionKey,
                )}
              </option>
            ))}
          </Select>
        </FormControl>
      </Box>
    )
  }

  const regionKey = component.props.layoutRegionKey
  const assigned = Object.values(components).filter(candidate =>
    candidate.id !== component.id &&
    candidate.props.layoutRegionId === regionKey
  )
  const numericField = (label: string, name: string) => (
    <FormControl>
      <FormLabel fontSize="xs">{label}</FormLabel>
      <Input
        size="sm"
        type="number"
        value={String(component.props[name] ?? '')}
        onChange={event => update(name, Number(event.target.value))}
      />
    </FormControl>
  )

  return (
    <Box
      mt={3}
      p={3}
      border="1px solid #1e293b"
      borderRadius="md"
      bg="#0f172a"
    >
      <Text fontSize="sm" fontWeight="semibold" color="cyan.300">
        Smart Region
      </Text>
      <Text fontSize="xs" color="gray.400" mb={3}>
        {String(component.props.layoutRegionLabel)} · {assigned.length} assigned
      </Text>
      <FormControl mb={2}>
        <FormLabel fontSize="xs">Arrangement</FormLabel>
        <Select
          size="sm"
          value={String(component.props.layoutArrangement || 'vertical')}
          onChange={event => update('layoutArrangement', event.target.value)}
        >
          {ARRANGEMENTS.map(arrangement => (
            <option key={arrangement} value={arrangement}>
              {arrangement}
            </option>
          ))}
        </Select>
      </FormControl>
      <SimpleGrid columns={2} spacing={2} mb={3}>
        {numericField('Padding', 'layoutPadding')}
        {numericField('Columns', 'layoutColumns')}
        {numericField('Horizontal gap', 'layoutHorizontalGap')}
        {numericField('Vertical gap', 'layoutVerticalGap')}
      </SimpleGrid>
      <Checkbox
        size="sm"
        mb={3}
        isChecked={Boolean(component.props.layoutLockedStructure)}
        onChange={event => update(
          'layoutLockedStructure',
          event.target.checked,
        )}
      >
        Lock structure
      </Checkbox>
      <Button
        width="100%"
        size="sm"
        colorScheme="cyan"
        onClick={() => dispatch.components.updateManyProps(
          autoArrangeForgeUIRegion(component, assigned),
        )}
      >
        Auto Arrange Region
      </Button>
    </Box>
  )
}

export default LayoutRegionInspector
