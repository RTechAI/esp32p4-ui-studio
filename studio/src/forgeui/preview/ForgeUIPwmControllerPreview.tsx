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
    border="1px solid" borderColor={theme.surfaceBorder} borderRadius="8px" background={theme.surface}
    color={theme.textPrimary} padding="12px" gap="2px" opacity={enabled ? 1 : 0.58} onClick={stop} onMouseDown={stop}>
    <Flex align="center" gap="8px" flexShrink={0}><Box flex="1" minWidth="0"><Text fontSize="sm" lineHeight="14px" fontWeight="700" noOfLines={1}>{model.label}</Text>
      {model.subtitle && <Text fontSize="xs" lineHeight="12px" color={theme.textSecondary} noOfLines={1}>{model.subtitle}</Text>}</Box>
      {model.showEnableControl && <Switch aria-label="PWM enabled" size="sm" colorScheme="green" isChecked={enabled} onChange={event => setEnabled(event.target.checked)} />}</Flex>
    {model.showNumericValue && <Flex align="baseline" justify="center" height="24px" flexShrink={0}><Text fontSize="2xl" lineHeight="24px" fontWeight="800" color={accent}>{Number(value.toFixed(6))}</Text><Text ml="4px" fontSize="sm" lineHeight="16px" color={theme.textSecondary}>{model.unit}</Text></Flex>}
    {model.showSlider && <Flex flex="1" align="center" justify="center" minHeight="24px">
      <Slider aria-label="PWM value" colorScheme="green" orientation={model.orientation} min={model.minimum} max={model.maximum} step={model.step}
        value={value} isDisabled={!enabled} onChange={setValue} onMouseDown={stop} onTouchStart={stop} width={model.orientation === 'vertical' ? '24px' : '100%'} height={model.orientation === 'vertical' ? '100%' : '24px'}>
        <SliderTrack height="6px" borderRadius="full"><SliderFilledTrack borderRadius="full" /></SliderTrack><SliderThumb boxSize="18px" background="white" border="0" /></Slider>
    </Flex>}
    <Flex justify="space-between" flexShrink={0}><Text fontSize="xs" lineHeight="12px" color={theme.disabledText}>{model.statusText || (enabled ? 'Enabled' : 'Disabled')}</Text><Text fontSize="xs" lineHeight="12px" color={theme.disabledText}>{model.minimum}–{model.maximum} {model.unit}</Text></Flex>
  </Flex>
}
