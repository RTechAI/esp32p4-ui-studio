import React from 'react'
import icons from '~iconsList'
import { useForgePreviewPalette } from '~forgeui/theme/ForgeThemeContext'
import {
  Box,
  Text,
  Progress,
  Input,
  Textarea,
  Select,
  Image,
} from '@chakra-ui/react'

import InteractiveButtonCanvasPreview from '~components/editor/previews/InteractiveButtonCanvasPreview'
import InteractiveLightCanvasPreview from '~components/editor/previews/InteractiveLightCanvasPreview'
import InteractiveStatusIndicatorCanvasPreview from '~components/editor/previews/InteractiveStatusIndicatorCanvasPreview'
import InteractiveToggleSwitchCanvasPreview from '~components/editor/previews/InteractiveToggleSwitchCanvasPreview'
import InteractiveThreePositionToggleCanvasPreview from '~components/editor/previews/InteractiveThreePositionToggleCanvasPreview'
import ClockPreview from '~components/editor/previews/ClockPreview'
import CircularProgressPreview from '~components/editor/previews/CircularProgressPreview'
import StandardSwitchPreview from './StandardSwitchPreview'
import StandardCheckboxPreview from './StandardCheckboxPreview'
import { getForgeUIStandardCheckboxText } from '../ForgeUIStandardCheckbox'
import StandardRadioPreview from './StandardRadioPreview'
import { getForgeUIStandardRadioText } from '../ForgeUIStandardRadio'
import StandardSliderPreview from './StandardSliderPreview'
import StandardSpinnerPreview from './StandardSpinnerPreview'
import StandardSpinboxPreview from './StandardSpinboxPreview'
import StandardListPreview from './StandardListPreview'
import StandardNumberInputPreview from './StandardNumberInputPreview'
import StandardSelectPreview from './StandardSelectPreview'
import StandardIconButtonPreview from './StandardIconButtonPreview'
import StandardArcPreview from './StandardArcPreview'
import StandardChartPreview from './StandardChartPreview'
import StandardQRCodePreview from './StandardQRCodePreview'
import StandardBarPreview from './StandardBarPreview'
import StandardScalePreview from './StandardScalePreview'
import StandardRollerPreview from './StandardRollerPreview'
import StandardMessageBoxPreview from './StandardMessageBoxPreview'
import StandardButtonMatrixPreview from './StandardButtonMatrixPreview'
import StandardCanvasPreview from './StandardCanvasPreview'
import StandardTabViewPreview from './StandardTabViewPreview'
import StandardTileViewPreview from './StandardTileViewPreview'
import StandardButtonPreview from './StandardButtonPreview'
import StandardTextPreview from './StandardTextPreview'
import StandardHeadingPreview from './StandardHeadingPreview'
import StandardIconPreview from './StandardIconPreview'
import StandardBoxPreview from './StandardBoxPreview'
import StandardDividerPreview from './StandardDividerPreview'
import StandardWifiPreview from './StandardWifiPreview'
import StandardLinePreview from './StandardLinePreview'
import { StandardSpanPreview, StandardAnimImagePreview, StandardImageButtonPreview } from './StandardClosureWidgetPreviews'
import { StandardWindowPreview } from './StandardWindowPreview'
import { StandardMenuPreview } from './StandardMenuPreview'
import { ForgeUIDashboardCardPreview } from './ForgeUIDashboardCardPreview'
import { ForgeUISensorTilePreview } from './ForgeUISensorTilePreview'
import { ForgeUIRelayPanelPreview } from './ForgeUIRelayPanelPreview'
import ImagePreview from '~components/editor/previews/ImagePreview'
import StandardCalendarPreview from './StandardCalendarPreview'
import { resolveForgeSemanticPalette } from './forgeThemeMap'

const lv = (v: any, d: any = 0) =>
  v !== undefined && v !== null && v !== '' ? v : d


interface RenderProps {
  component: IComponent
  components: IComponents
}

export const renderForgePreview = ({
  component,
  components,
}: RenderProps): React.ReactNode[] => {

  // This legacy renderer recurses as a plain function. Moving theme lookup
  // to a component boundary requires architectural review.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const palette = useForgePreviewPalette()
  const theme = resolveForgeSemanticPalette(palette)
  const output: React.ReactNode[] = []

  ;(component.children || []).forEach((key: string) => {
    const child = components[key]
    if (!child) return

    const x = lv(child.props.x, 0)
    const y = lv(child.props.y, 0)
    const w = lv(child.props.w, 120)
    const h = lv(child.props.h, 40)

    const label =
      child.props.children ||
      child.props.text ||
      child.props.value ||
      child.props.placeholder

    const commonStyle = {
      position: 'absolute' as const,
      left: `${x}px`,
      top: `${y}px`,
      width: `${w}px`,
      height: `${h}px`,
    }
    let ownsRenderedChildren = false

    switch (child.type) {

      case 'Heading': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <StandardHeadingPreview component={child} palette={palette} />
          </Box>,
        )
        break
      }

     case 'Clock': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <ClockPreview
        component={child}
        justifyContent="flex-start"
        palette={palette}
      />
    </Box>,
  )
  break
}

case 'WiFi': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardWifiPreview palette={palette} component={child} />
    </Box>,
  )
  break
}

      case 'Text': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <StandardTextPreview component={child} palette={palette} />
          </Box>,
        )
        break
      }

      case 'Button': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <StandardButtonPreview component={child} palette={palette} />
          </Box>,
        )
        break
      }

      case 'InteractiveButton': {
       output.push(
         <Box
          key={child.id}
          position="absolute"
          left={`${x}px`}
        top={`${y}px`}
    >
      <InteractiveButtonCanvasPreview
        component={child}
      />
       </Box>,
  )
  break
      }

      case 'InteractiveLight': {
        output.push(
          <Box
            key={child.id}
            {...commonStyle}
          >
            <InteractiveLightCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'InteractiveStatusIndicator': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <InteractiveStatusIndicatorCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'InteractiveToggleSwitch': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <InteractiveToggleSwitchCanvasPreview component={child} />
          </Box>,
        )
        break
      }
      case 'InteractiveThreePositionToggleSwitch': {
        output.push(
          <Box key={child.id} {...commonStyle}>
            <InteractiveThreePositionToggleCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'IconButton': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardIconButtonPreview
        component={child}
        mode="browser"
        surface={palette.surface}
        border={palette.border}
        text={palette.text}
      />
    </Box>,
  )
  break
}

      case 'Box': {
  const isFullScreenBackground =
    x === 0 &&
    y === 0 &&
    w >= 1024 &&
    h >= 600
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      {isFullScreenBackground
        ? renderForgePreview({ component: child, components })
        : (
          <StandardBoxPreview component={child} palette={palette}>
            {renderForgePreview({ component: child, components })}
          </StandardBoxPreview>
        )}
    </Box>,
  )
  ownsRenderedChildren = true
  break
}

      case 'Icon': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardIconPreview component={child} palette={palette} />
    </Box>,
  )

  break
}

      case 'Input': {
        output.push(
          <Input
            key={child.id}
            {...commonStyle}
            value={String(child.props.value || '')}
            readOnly
            placeholder={String(child.props.placeholder || 'Input')}
            color={palette.text}
            borderColor={palette.border}
            background={palette.surface}
            borderWidth="1px"
            borderRadius="6px"
            px="16px"
            py="0"
            _placeholder={{ color: theme.textSecondary, opacity: 1 }}
            _focus={{ borderColor: theme.accent, boxShadow: 'none' }}
            _disabled={{ color: theme.disabledText, opacity: 1 }}
          />,
        )
        break
      }

      case 'Textarea': {
        output.push(
          <Textarea
            key={child.id}
            {...commonStyle}
            value={String(child.props.value || '')}
            readOnly
            placeholder={String(child.props.placeholder || 'Textarea')}
            color={palette.text}
            borderColor={palette.border}
            background={palette.surface}
            borderWidth="1px"
            borderRadius="6px"
            px="16px"
            py="8px"
            _placeholder={{ color: theme.textSecondary, opacity: 1 }}
            _focus={{ borderColor: theme.accent, boxShadow: 'none' }}
            _disabled={{ color: theme.disabledText, opacity: 1 }}
          />,
        )
        break
      }

      case 'NumberInput': {
        output.push(
          <Box
            key={child.id}
            {...commonStyle}
          >
            <StandardNumberInputPreview
              mode="browser"
              value={child.props.value}
              min={child.props.min}
              max={child.props.max}
              step={child.props.step}
              precision={child.props.precision}
              isDisabled={Boolean(child.props.isDisabled)}
              isReadOnly={Boolean(child.props.isReadOnly)}
            />
          </Box>,
        )
        break
      }

      case 'Select': {
        const SelectIcon = child.props.icon
          ? icons[child.props.icon as keyof typeof icons]
          : undefined
        output.push(
          <Box key={child.id} {...commonStyle}>
            <StandardSelectPreview
              mode="browser"
              options={child.props.options}
              selectedIndex={child.props.selectedIndex}
              legacyValue={child.props.value}
              isDisabled={Boolean(child.props.isDisabled)}
              icon={SelectIcon ? <SelectIcon path="" /> : undefined}
            />
          </Box>,
        )
        break
      }

      case 'Switch': {
        output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
    >
      <StandardSwitchPreview
        initialChecked={Boolean(child.props.isChecked)}
        isDisabled={Boolean(child.props.isDisabled)}
        accent={palette.accent}
        surface={theme.surfaceSecondary}
        thumb={theme.accentText}
      />
    </Box>,
  )
  break
}

      case 'Checkbox': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
    >
      <StandardCheckboxPreview
        mode="browser"
        initialChecked={Boolean(child.props.isChecked)}
        isDisabled={Boolean(child.props.isDisabled)}
        label={getForgeUIStandardCheckboxText(child.props)}
        textColor={palette.text}
        accent={palette.accent}
        surface={palette.surface}
        border={palette.border}
      />
    </Box>,
  )
  break
}

      case 'Radio': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      gap="8px"
      color={palette.text}
    >
      <StandardRadioPreview
        initialSelected={Boolean(child.props.isChecked)}
        isDisabled={Boolean(child.props.isDisabled)}
        label={getForgeUIStandardRadioText(child.props)}
        textColor={palette.text}
        accent={palette.accent}
        border={palette.border}
      />
    </Box>,
  )
  break
}

      case 'Slider': {
  output.push(
    <Box key={child.id} {...commonStyle} display="flex" alignItems="center">
      <StandardSliderPreview
        mode="browser"
        value={child.props.value}
        min={child.props.min}
        max={child.props.max}
        step={child.props.step}
        orientation={child.props.orientation}
        isDisabled={Boolean(child.props.isDisabled)}
        trackColor={theme.surfaceSecondary}
        fillColor={theme.accent}
        thumbColor={theme.accentText}
      />
    </Box>,
  )
  break
}

      case 'Progress': {
  output.push(
    <Progress
      key={child.id}
      value={lv(child.props.value, 60)}
      min={lv(child.props.min, 0)}
      max={lv(child.props.max, 100)}
      {...commonStyle}
      borderRadius="md"
      bg={palette.surface2}
      sx={{
        '& > div': {
          background: palette.accent,
        },
      }}
    />,
  )
  break
}

     case 'CircularProgress': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgressPreview component={child} />
    </Box>,
  )
  break
}

    case 'Image': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <ImagePreview component={child} />
    </Box>,
  )
  break
}

case 'Led': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="24px"
        height="24px"
        borderRadius="999px"
        bg="green.400"
        boxShadow="0 0 12px rgba(72,255,120,0.8)"
        data-testid="standard-led-preview"
      />
    </Box>,
  )
  break
}

case 'Bar': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardBarPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Arc': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardArcPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Keyboard': {
  const rows = [
    ['1#', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '⌫'],
    ['ABC', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '↵'],
    ['_', '-', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', ',', ':'],
    ['⌨', '<', ' ', ' ', ' ', ' ', ' ', ' ', '>', '✓'],
  ]

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      p="8px"
      display="flex"
      flexDirection="column"
      gap="6px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={`${theme.surface}B3`}
      data-testid="standard-keyboard-browser"
    >
      {rows.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          flex="1"
          display="grid"
          gridTemplateColumns={`repeat(${row.length}, 1fr)`}
          gap="6px"
        >
          {row.map((key, keyIndex) => (
            <Box
              key={`${rowIndex}-${keyIndex}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="6px"
              border={`1px solid ${theme.surfaceBorder}`}
              bg={theme.surfaceSecondary}
              color={theme.textPrimary}
              fontSize="11px"
              data-testid="standard-keyboard-key"
            >
              {key}
            </Box>
          ))}
        </Box>
      ))}
    </Box>,
  )
  break
}

case 'Calendar': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardCalendarPreview
        component={child}
        palette={palette}
      />
    </Box>,
  )
  break
}

case 'Chart': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardChartPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Scale': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardScalePreview
        component={child}
        palette={palette}
      />
    </Box>,
  )
  break
}


case 'Table': {
  const rows = [
    ['A1', 'B1'],
    ['A2', 'B2'],
  ]

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="grid"
      gridTemplateColumns="repeat(2, 1fr)"
      border={`1px solid ${theme.surfaceBorder}`}
      borderRadius="8px"
      overflow="hidden"
      bg={theme.surface}
      color={theme.textPrimary}
      fontSize="12px"
      data-testid="standard-table-browser"
    >
      {rows.flat().map((cell, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border={`1px solid ${theme.surfaceBorder}`}
          bg={theme.surfaceSecondary}
          p="8px"
        >
          {cell}
        </Box>
      ))}
    </Box>,
  )
  break
}
case 'Msgbox': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardMessageBoxPreview
        component={child}
        palette={palette}
      />
    </Box>,
  )
  break
}


case 'Roller': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardRollerPreview
        component={child}
        palette={palette}
      />
    </Box>,
  )
  break
}

case 'ButtonMatrix': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
    >
      <StandardButtonMatrixPreview
        component={child}
        palette={palette}
      />
    </Box>,
  )
  break
}

case 'Canvas': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardCanvasPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Line': {
  output.push(
    <Box key={child.id} {...commonStyle} overflow="hidden">
      <StandardLinePreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'QRCode': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardQRCodePreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Divider': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardDividerPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Tabview': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardTabViewPreview component={child} palette={palette} />
    </Box>,
  )
  break
}

case 'Tileview': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardTileViewPreview component={child} palette={palette} mode="browser" />
    </Box>,
  )
  break
}

case 'AnimImage': {
  output.push(
    <Box key={child.id} {...commonStyle}><StandardAnimImagePreview component={child} palette={theme} /></Box>,
  )
  break
}

case 'Lottie': {

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="1px dashed #00d4ff"
      color="#00d4ff"
      fontSize="sm"
      bg="rgba(0,212,255,0.08)"
    >
      {child.type}
    </Box>,
  )
  break
}

case 'Span': {
  output.push(<Box key={child.id} {...commonStyle}><StandardSpanPreview component={child} palette={theme} /></Box>)
  break
}

case 'ImageButton': {
  output.push(<Box key={child.id} {...commonStyle}><StandardImageButtonPreview component={child} mode="browser" /></Box>)
  break
}

case 'Window': {
  output.push(<Box key={child.id} {...commonStyle}>
    <StandardWindowPreview component={child} mode="browser">{renderForgePreview({ component: child, components })}</StandardWindowPreview>
  </Box>)
  ownsRenderedChildren = true
  break
}

case 'Menu': {
  output.push(<Box key={child.id} {...commonStyle}><StandardMenuPreview component={child} mode="browser" /></Box>)
  break
}

case 'DashboardCard': {
  output.push(<Box key={child.id} {...commonStyle}>
    <ForgeUIDashboardCardPreview component={child} palette={palette} />
  </Box>)
  break
}

case 'SensorTile': {
  output.push(<Box key={child.id} {...commonStyle}><ForgeUISensorTilePreview component={child} palette={palette} /></Box>)
  break
}

case 'RelayPanel': {
  output.push(<Box key={child.id} {...commonStyle}><ForgeUIRelayPanelPreview component={child} palette={palette} /></Box>)
  break
}

case 'Spinner': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardSpinnerPreview
        duration={child.props.duration}
        arcLength={child.props.arcLength}
        arcWidth={child.props.arcWidth}
        backgroundWidth={child.props.backgroundWidth}
        accentColor={child.props.accentColor}
        backgroundColor={child.props.backgroundColor}
        opacity={child.props.opacity}
      />
    </Box>,
  )
  break
}

case 'Spinbox': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardSpinboxPreview mode="browser" props={child.props} />
    </Box>,
  )
  break
}

case 'List': {
  output.push(
    <Box key={child.id} {...commonStyle}>
      <StandardListPreview mode="browser" props={child.props} />
    </Box>,
  )
  break
}


      default:
        break
    }

    if (child.children?.length && !ownsRenderedChildren) {

            output.push(
        ...renderForgePreview({
          component: child,
          components,
        }),
      )
    }
  })

  return output
}
