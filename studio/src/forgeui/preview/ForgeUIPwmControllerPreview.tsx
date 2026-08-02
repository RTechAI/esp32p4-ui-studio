import React, { useEffect, useState } from 'react'
import { Box, Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Switch, Text } from '@chakra-ui/react'
import { normalizeForgeUIPwmController } from '../ForgeUIPwmController'
import { ForgePreviewPalette, resolveForgeSemanticPalette } from './forgeThemeMap'

export const ForgeUIPwmControllerPreview = ({ component, palette }: { component: IComponent; palette: ForgePreviewPalette }) => {
  const model = normalizeForgeUIPwmController(component.props)
  const theme = resolveForgeSemanticPalette(palette)
  const [value, setValue] = useState(model.value)
  const [enabled, setEnabled] = useState(model.enabled)
  useEffect(() => setValue(model.value), [model.value])
  useEffect(() => setEnabled(model.enabled), [model.enabled])
  const accent = model.accentColour || theme.accent
  const stop = (event: React.SyntheticEvent) => event.stopPropagation()
  return <Flex data-testid="forgeui-pwm-controller" direction="column" width="100%" height="100%" overflow="hidden"
    border="1px solid" borderColor={theme.surfaceBorder} borderRadius="12px" background={theme.surface}
    color={theme.textPrimary} padding="16px" gap="10px" opacity={enabled ? 1 : 0.58} onClick={stop} onMouseDown={stop}>
    <Flex align="center" gap="8px"><Box flex="1" minWidth="0"><Text fontSize="sm" fontWeight="700" noOfLines={1}>{model.label}</Text>
      {model.subtitle && <Text fontSize="xs" color={theme.textSecondary} noOfLines={1}>{model.subtitle}</Text>}</Box>
      {model.showEnableControl && <Switch aria-label="PWM enabled" size="sm" isChecked={enabled} onChange={event => setEnabled(event.target.checked)} />}</Flex>
    {model.showNumericValue && <Flex align="baseline" justify="center"><Text fontSize="3xl" fontWeight="800" color={accent}>{Number(value.toFixed(6))}</Text><Text ml="4px" color={theme.textSecondary}>{model.unit}</Text></Flex>}
    {model.showSlider && <Flex flex="1" align="center" justify="center" minHeight="28px">
      <Slider aria-label="PWM value" orientation={model.orientation} min={model.minimum} max={model.maximum} step={model.step}
        value={value} isDisabled={!enabled} onChange={setValue} onMouseDown={stop} onTouchStart={stop} width={model.orientation === 'vertical' ? '28px' : '100%'} height={model.orientation === 'vertical' ? '100%' : '28px'}>
        <SliderTrack><SliderFilledTrack background={accent} /></SliderTrack><SliderThumb /></Slider>
    </Flex>}
    <Flex justify="space-between"><Text fontSize="xs" color={theme.disabledText}>{model.statusText || (enabled ? 'Enabled' : 'Disabled')}</Text><Text fontSize="xs" color={theme.disabledText}>{model.minimum}–{model.maximum} {model.unit}</Text></Flex>
  </Flex>
}
