import React from 'react'
import {
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import { normalizeForgeUITrendChart } from '~forgeui/ForgeUITrendChart'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

const labelProps = { fontSize: 'xs', color: INSPECTOR_PROPERTY_TEXT_COLOR }
const checkboxProps = { color: INSPECTOR_PROPERTY_TEXT_COLOR }

export const TrendChartPanel = () => {
  const { setValue } = useForm()
  const raw = {
    title: usePropsSelector('title'),
    units: usePropsSelector('units'),
    semanticType: usePropsSelector('semanticType'),
    lineColour: usePropsSelector('lineColour'),
    fill: usePropsSelector('fill'),
    showGrid: usePropsSelector('showGrid'),
    showAxes: usePropsSelector('showAxes'),
    showLegend: usePropsSelector('showLegend'),
    showLatestMarker: usePropsSelector('showLatestMarker'),
    showCurrentValue: usePropsSelector('showCurrentValue'),
    showMinMax: usePropsSelector('showMinMax'),
    historyLength: usePropsSelector('historyLength'),
    autoScale: usePropsSelector('autoScale'),
    minimum: usePropsSelector('minimum'),
    maximum: usePropsSelector('maximum'),
    warningThreshold: usePropsSelector('warningThreshold'),
    alarmThreshold: usePropsSelector('alarmThreshold'),
    rounded: usePropsSelector('rounded'),
    border: usePropsSelector('border'),
    backgroundColour: usePropsSelector('backgroundColour'),
    padding: usePropsSelector('padding'),
    simulationMode: usePropsSelector('simulationMode'),
    generateRuntimeApi: usePropsSelector('generateRuntimeApi'),
    enableUserEvents: usePropsSelector('enableUserEvents'),
  }
  const model = normalizeForgeUITrendChart(raw)
  const number = (key: string, value: number) =>
    setValue(key, Number.isFinite(value) ? value : 0)
  const check = (key: string, label: string, value: boolean) => (
    <Checkbox
      {...checkboxProps}
      isChecked={value}
      onChange={event => setValue(key, event.target.checked)}
    >
      {label}
    </Checkbox>
  )
  return (
    <Stack spacing={3} color={INSPECTOR_PROPERTY_TEXT_COLOR}>
      <Text fontSize="sm" fontWeight="bold">
        ForgeUI Native Trend Chart
      </Text>
      <Text fontSize="xs" fontWeight="bold">
        General
      </Text>
      <HStack>
        <FormControl>
          <FormLabel {...labelProps}>Title</FormLabel>
          <Input
            size="sm"
            value={model.title}
            onChange={e => setValue('title', e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel {...labelProps}>Units</FormLabel>
          <Input
            size="sm"
            value={model.units}
            onChange={e => setValue('units', e.target.value)}
          />
        </FormControl>
      </HStack>
      <FormControl>
        <FormLabel {...labelProps}>Semantic type</FormLabel>
        <Input
          size="sm"
          value={model.semanticType}
          onChange={e => setValue('semanticType', e.target.value)}
        />
      </FormControl>
      <Text fontSize="xs" fontWeight="bold">
        Display
      </Text>
      <FormControl>
        <FormLabel {...labelProps}>Line colour (blank = theme)</FormLabel>
        <Input
          size="sm"
          value={model.lineColour}
          onChange={e => setValue('lineColour', e.target.value)}
        />
      </FormControl>
      {check('fill', 'Fill', model.fill)}
      {check('showGrid', 'Grid', model.showGrid)}
      {check('showAxes', 'Axes', model.showAxes)}
      {check('showLegend', 'Legend', model.showLegend)}
      {check('showLatestMarker', 'Latest-value marker', model.showLatestMarker)}
      {check('showCurrentValue', 'Show current value', model.showCurrentValue)}
      {check('showMinMax', 'Show min/max', model.showMinMax)}
      <Text fontSize="xs" fontWeight="bold">
        Data
      </Text>
      <HStack>
        <FormControl>
          <FormLabel {...labelProps}>History</FormLabel>
          <Select
            size="sm"
            value={model.historyLength}
            onChange={e => number('historyLength', Number(e.target.value))}
          >
            {[32, 64, 128, 256].map(value => (
              <option key={value}>{value}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel {...labelProps}>Preview</FormLabel>
          <Select
            size="sm"
            value={model.simulationMode}
            onChange={e => setValue('simulationMode', e.target.value)}
          >
            {[
              'sine',
              'sawtooth',
              'random-walk',
              'battery-discharge',
              'temperature-drift',
              'rpm',
            ].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </FormControl>
      </HStack>
      {check('autoScale', 'Auto scale', model.autoScale)}
      <HStack>
        {(['minimum', 'maximum'] as const).map(key => (
          <FormControl key={key}>
            <FormLabel {...labelProps}>{key}</FormLabel>
            <NumberInput
              size="sm"
              value={model[key]}
              onChange={(_, value) => number(key, value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        ))}
      </HStack>
      <Text fontSize="xs" fontWeight="bold">
        Thresholds
      </Text>
      <HStack>
        {(['warningThreshold', 'alarmThreshold'] as const).map(key => (
          <FormControl key={key}>
            <FormLabel {...labelProps}>
              {key === 'warningThreshold' ? 'Warning' : 'Alarm'}
            </FormLabel>
            <NumberInput
              size="sm"
              value={model[key]}
              onChange={(_, value) => number(key, value)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        ))}
      </HStack>
      <Text fontSize="xs" fontWeight="bold">
        Appearance
      </Text>
      {check('rounded', 'Rounded', model.rounded)}
      {check('border', 'Border', model.border)}
      <FormControl>
        <FormLabel {...labelProps}>Background (blank = theme)</FormLabel>
        <Input
          size="sm"
          value={model.backgroundColour}
          onChange={e => setValue('backgroundColour', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel {...labelProps}>Padding</FormLabel>
        <NumberInput
          size="sm"
          min={0}
          max={32}
          value={model.padding}
          onChange={(_, value) => number('padding', value)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
      {check(
        'generateRuntimeApi',
        'Generate Runtime SDK',
        model.generateRuntimeApi,
      )}
      {check('enableUserEvents', 'Generate UserEvents', model.enableUserEvents)}
    </Stack>
  )
}
