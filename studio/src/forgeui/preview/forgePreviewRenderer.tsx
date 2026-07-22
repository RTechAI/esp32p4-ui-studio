import React from 'react'
import icons from '~iconsList'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import {
  Box,
  Text,
  Progress,
  Checkbox,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  CircularProgress,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  Image,
} from '@chakra-ui/react'

import InteractiveButtonCanvasPreview from '~components/editor/previews/InteractiveButtonCanvasPreview'
import InteractiveLightCanvasPreview from '~components/editor/previews/InteractiveLightCanvasPreview'
import InteractiveStatusIndicatorCanvasPreview from '~components/editor/previews/InteractiveStatusIndicatorCanvasPreview'
import InteractiveToggleSwitchCanvasPreview from '~components/editor/previews/InteractiveToggleSwitchCanvasPreview'

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
  const { palette } = useForgeTheme()
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

    switch (child.type) {

      case 'Heading': {
        output.push(
          <Text
            key={child.id}
            {...commonStyle}
            color={child.props.color || palette.text}
            fontSize={`${lv(child.props.fontSize, 32)}px`}
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {label || 'Heading'}
          </Text>,
        )
        break
      }

     case 'Clock': {
  output.push(
    <Text
      key={child.id}
      {...commonStyle}
      color={child.props.color || '#00d4ff'}
      fontSize={`${lv(child.props.fontSize, 32)}px`}
      fontWeight="bold"
      fontFamily="monospace"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
    >
      {label || '12:34'}
    </Text>,
  )
  break
}

case 'WiFi': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      p="10px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Text
        color={palette.accent}
        fontWeight="bold"
        fontSize="14px"
      >
        WIFI
      </Text>

      <Text
        color={palette.text}
        fontSize="13px"
      >
        DISCONNECTED
      </Text>

      <Text
        color={palette.text}
        opacity={0.7}
        fontSize="12px"
      >
        IP: -
      </Text>
    </Box>,
  )
  break
}

      case 'Text': {
        output.push(
          <Text
            key={child.id}
            position="absolute"
            left={`${x}px`}
            top={`${y}px`}
            color={child.props.color || palette.text}
            fontSize={`${lv(child.props.fontSize, 24)}px`}
          >
            {label || 'Text'}
          </Text>,
        )
        break
      }

      case 'Button': {
        output.push(
          <Box
            key={child.id}
            {...commonStyle}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            background={palette.surface}
            border={`2px solid ${palette.border}`}
            color={child.props.color || palette.text}
            fontSize={`${lv(child.props.fontSize, 18)}px`}
            fontWeight="bold"
          >
            {label || 'Button'}
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
            position="absolute"
            left={`${x}px`}
            top={`${y}px`}
          >
            <InteractiveLightCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'InteractiveStatusIndicator': {
        output.push(
          <Box key={child.id} position="absolute" left={`${x}px`} top={`${y}px`}>
            <InteractiveStatusIndicatorCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'InteractiveToggleSwitch': {
        output.push(
          <Box key={child.id} position="absolute" left={`${x}px`} top={`${y}px`}>
            <InteractiveToggleSwitchCanvasPreview component={child} />
          </Box>,
        )
        break
      }

      case 'IconButton': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="8px"
      background={palette.surface}
      border={`2px solid ${palette.border}`}
      color={palette.text}
      fontSize="24px"
      fontWeight="bold"
    >
      ⧉
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
      borderRadius={
        isFullScreenBackground ? '0' : '12px'
      }
      background={
        isFullScreenBackground
          ? 'transparent'
          : palette.surface
      }
      border={
        isFullScreenBackground
          ? 'none'
          : `2px solid ${palette.border}`
      }
    />,
  )
  break
}

      case 'Icon': {
  const Icon =
    icons[child.props.icon as keyof typeof icons]

  if (!Icon) break

  const iconSize =
    parseInt(String(child.props.boxSize || '48'), 10) || 48

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon
        color={child.props.color || palette.text}
        size={iconSize}
      />
    </Box>,
  )

  break
}

      case 'Input': {
        output.push(
          <Input
            key={child.id}
            {...commonStyle}
            value={String(label || '')}
            readOnly
            placeholder="Input"
            color={palette.text}
            borderColor={palette.border}
            background={palette.surface}
          />,
        )
        break
      }

      case 'Textarea': {
        output.push(
          <Textarea
            key={child.id}
            {...commonStyle}
            value={String(label || '')}
            readOnly
            placeholder="Textarea"
            color={palette.text}
            borderColor={palette.border}
            background={palette.surface}
          />,
        )
        break
      }

      case 'NumberInput': {
        output.push(
          <NumberInput
            key={child.id}
            {...commonStyle}
            value={String(lv(child.props.value, 0))}
          >
            <NumberInputField
              color={palette.text}
              borderColor={palette.border}
              background={palette.surface}
            />
          </NumberInput>,
        )
        break
      }

      case 'Select': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px="10px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      color={palette.text}
    >
      <Text>Select</Text>
      <Text>▼</Text>
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
      <Switch
        isChecked={Boolean(child.props.isChecked)}
        sx={{
          '.chakra-switch__track': {
            bg: Boolean(child.props.isChecked)
              ? palette.accent
              : palette.surface2,
          },
          '.chakra-switch__thumb': {
            bg: palette.text,
          },
        }}
      />
    </Box>,
  )
  break
}

      case 'Checkbox': {
  output.push(
    <Checkbox
      key={child.id}
      position="absolute"
      left={`${x}px`}
      top={`${y}px`}
      isChecked={Boolean(child.props.isChecked)}
      color={palette.text}
      sx={{
        '.chakra-checkbox__control': {
          bg: palette.surface,
          borderColor: palette.border,
        },
        '.chakra-checkbox__control[data-checked]': {
          bg: palette.accent,
          borderColor: palette.accent,
        },
      }}
    >
      {label || 'Checkbox'}
    </Checkbox>,
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
      <Box
        width="18px"
        height="18px"
        borderRadius="999px"
        border={`2px solid ${palette.border}`}
        bg={Boolean(child.props.isChecked)
          ? palette.accent
          : 'transparent'}
      />

      <Text color={palette.text}>
        {label || 'Radio'}
      </Text>
    </Box>,
  )
  break
}

      case 'Slider': {
  output.push(
    <Box key={child.id} {...commonStyle} display="flex" alignItems="center">
      <Slider value={lv(child.props.value, 50)}>
        <SliderTrack bg={palette.surface2}>
          <SliderFilledTrack bg={palette.accent} />
        </SliderTrack>

        <SliderThumb bg={palette.text} />
      </Slider>
    </Box>,
  )
  break
}

      case 'Progress': {
  output.push(
    <Progress
      key={child.id}
      value={lv(child.props.value, 65)}
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
      <CircularProgress
        value={lv(child.props.value, 65)}
        color={palette.accent}
        trackColor={palette.surface2}
      />
    </Box>,
  )
  break
}

    case 'Image': {
  output.push(
    <Image
      key={child.id}
      position="absolute"
      left={`${x}px`}
      top={`${y}px`}
      width={`${w}px`}
      height={`${h}px`}
      src={child.props.src || child.props.url || ''}
      alt={child.props.alt || 'Image'}
      objectFit="contain"
      border={`1px solid ${palette.border}`}
    />,
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
      />
    </Box>,
  )
  break
}

case 'Bar': {
  output.push(
    <Progress
      key={child.id}
      value={70}
      {...commonStyle}
    />
  )
  break
}

case 'Arc': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="64px"
        height="64px"
        borderRadius="50%"
        border="8px solid"
        borderColor="cyan.300"
      />
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
      bg="rgba(255,255,255,0.75)"
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
              bg="rgba(255,255,255,0.45)"
              color="gray.700"
              fontSize="11px"
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
  const days = Array.from({ length: 35 }, (_, i) => i + 1)

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      p="8px"
      display="grid"
      gridTemplateColumns="repeat(7, 1fr)"
      gap="4px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      color={palette.text}
      fontSize="10px"
    >
      {days.map((day) => (
        <Box
          key={day}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
          bg={day === 18 ? palette.accent : palette.surface2}
          color={day === 18 ? palette.bg : palette.text}
        >
          {day <= 30 ? day : ''}
        </Box>
      ))}
    </Box>,
  )
  break
}

case 'Chart': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      p="8px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      position="absolute"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 60">
        <polyline
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
          points="5,50 20,35 35,40 50,20 65,25 80,10 95,15"
        />
      </svg>
    </Box>,
  )
  break
}

case 'Scale': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      p="8px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
    >
      <svg width="90%" height="40">
        <line
          x1="10"
          y1="20"
          x2="190"
          y2="20"
          stroke={palette.accent}
          strokeWidth="2"
        />
        {[...Array(11)].map((_, i) => (
          <line
            key={i}
            x1={10 + i * 18}
            y1="10"
            x2={10 + i * 18}
            y2="30"
            stroke={palette.accent}
            strokeWidth="2"
          />
        ))}
      </svg>
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
      border={`1px solid ${palette.border}`}
      bg={palette.surface}
      color={palette.text}
      fontSize="12px"
    >
      {rows.flat().map((cell, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border={`1px solid ${palette.border}`}
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
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      color={palette.text}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="8px"
    >
      <Text fontWeight="bold">
        Message
      </Text>

      <Text fontSize="sm">
        Example message text
      </Text>

      <Box display="flex" justifyContent="flex-end" gap="6px">
        <Box
          px="8px"
          py="2px"
          border={`1px solid ${palette.border}`}
        >
          OK
        </Box>

        <Box
          px="8px"
          py="2px"
          border={`1px solid ${palette.border}`}
        >
          Cancel
        </Box>
      </Box>
    </Box>,
  )
  break
}


case 'Roller': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="rgba(0,212,255,0.08)"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
    >
      <Text color="gray.500">Item 1</Text>
      <Text color={palette.accent} fontWeight="bold">
        Item 2
      </Text>
      <Text color="gray.500">Item 3</Text>
    </Box>,
  )
  break
}

case 'ButtonMatrix': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateRows="repeat(2, 1fr)"
      gap="6px"
      p="8px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
    >
      {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((label, i) => (
        <Box
          key={label}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="6px"
          bg={i === 1 ? palette.accent : palette.surface2}
          color={i === 1 ? palette.bg : palette.text}
          fontSize="12px"
          fontWeight="bold"
        >
          {label}
        </Box>
      ))}
    </Box>,
  )
  break
}

case 'Canvas': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      bg={palette.surface}
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      overflow="hidden"
    >
      <svg width="100%" height="100%" viewBox="0 0 200 120">
        <line
          x1="10"
          y1="10"
          x2="190"
          y2="110"
          stroke={palette.accent}
          strokeWidth="2"
        />

        <line
          x1="190"
          y1="10"
          x2="10"
          y2="110"
          stroke={palette.accent}
          strokeWidth="2"
        />

        <rect
          x="60"
          y="30"
          width="80"
          height="40"
          fill="none"
          stroke={palette.accent}
          strokeWidth="2"
        />

        <circle
          cx="100"
          cy="80"
          r="15"
          fill={palette.accent}
        />
      </svg>
    </Box>,
  )
  break
}

case 'Line': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      overflow="hidden"
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <line
          x1="0"
          y1="0"
          x2="100"
          y2="100"
          stroke={palette.border}
          strokeWidth="3"
        />
      </svg>
    </Box>,
  )
  break
}

case 'Tabview': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      overflow="hidden"
      bg={palette.surface}
    >
      <Box display="flex" height="34px">
        {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, i) => (
          <Box
            key={tab}
            flex="1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={i === 0 ? palette.accent : palette.surface2}
            color={i === 0 ? palette.bg : palette.text}
            fontSize="12px"
            fontWeight="bold"
            borderRight={i < 2 ? `1px solid ${palette.border}` : 'none'}
          >
            {tab}
          </Box>
        ))}
      </Box>

      <Box
        height="calc(100% - 34px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={palette.text}
        fontSize="13px"
      >
        Tab 1 content
      </Box>
    </Box>,
  )
  break
}

case 'Tileview': {
  const tiles = ['Tile 1', 'Tile 2', 'Tile 3', 'Tile 4']

  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      display="grid"
      gridTemplateColumns="repeat(2, 1fr)"
      gridTemplateRows="repeat(2, 1fr)"
      gap="6px"
      p="8px"
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
    >
      {tiles.map((tile, i) => (
        <Box
          key={tile}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="6px"
          bg={i === 0 ? palette.accent : palette.surface2}
          color={i === 0 ? palette.bg : palette.text}
          fontSize="12px"
          fontWeight="bold"
        >
          {tile}
        </Box>
      ))}
    </Box>,
  )
  break
}

case 'AnimImage': {
  output.push(
    <Box
      key={child.id}
      {...commonStyle}
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      bg={palette.surface}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color={palette.text}
    >
      AnimImage
    </Box>,
  )
  break
}

case 'Lottie':
case 'Spinner': {

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


      default:
        break
    }

    if (child.children?.length) {

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
