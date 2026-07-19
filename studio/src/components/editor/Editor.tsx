import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Box,
  Text,
} from '@chakra-ui/react'

import SplitPane from 'react-split-pane'
import { useSelector } from 'react-redux'

import CodePanel from '~components/CodePanel'
import ComponentPreview from '~components/editor/ComponentPreview'

import { getShowCode, getShowLayout } from '~core/selectors/app'
import { getComponents } from '~core/selectors/components'

import useDispatch from '~hooks/useDispatch'
import { useDropComponent } from '~hooks/useDropComponent'

import { FORGEUI_ACTIVE_DEVICE } from '~forgeui/ForgeUIDeviceConfig'
import {
  reloadInteractiveAssets,
} from '~forgeui/interactive'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'

const GRID_SIZE = FORGEUI_ACTIVE_DEVICE.gridSize

export const gridStyles = {
  backgroundImage:
    'linear-gradient(to right, rgba(56, 189, 248, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
  backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
  bgColor: '#07111f',
}

const textureBackgrounds: Record<string, any> = {
  carbon_fiber: {
    backgroundImage: 'url("/textures/carbon_fiber.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  },

  dark_noise: {
    backgroundImage: 'url("/textures/dark_noise.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '256px 256px',
  },

  brushed_steel: {
    backgroundImage: 'url("/textures/brushed_steel.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  },

  hex_mesh: {
    backgroundImage: 'url("/textures/hex_mesh.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  },

  blueprint_grid: {
    backgroundImage: 'url("/textures/blueprint_grid.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  },

  industrial_panel: {
    backgroundImage: 'url("/textures/industrial_panel.png")',
    backgroundRepeat: 'repeat',
    backgroundSize: '512px 512px',
  },

    ai_mesh: {
    backgroundImage: 'url("/textures/1024x600 AI Mesh.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  ai_nexus: {
    backgroundImage: 'url("/textures/1024x600 AI Nexus.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  creation: {
    backgroundImage: 'url("/textures/1024x600 Creation.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  nebula_core: {
    backgroundImage: 'url("/textures/1024x600 Nebula Core.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  neon_horizon: {
    backgroundImage: 'url("/textures/1024x600 Neon Horizon.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  neural_core: {
    backgroundImage: 'url("/textures/1024x600 Neural Core.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  quantum_flow: {
    backgroundImage: 'url("/textures/1024x600 Quantum Flow.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },

  quantum_hex: {
    backgroundImage: 'url("/textures/1024x600 Quantum_hex.png")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1024px 600px',
    backgroundPosition: '0 0',
  },
  
}

const Editor: React.FC = () => {
  const [
    interactiveAssetsReady,
    setInteractiveAssetsReady,
  ] = useState(false)

  useEffect(() => {
    reloadInteractiveAssets()
    setInteractiveAssetsReady(true)
  }, [])

  const showCode = useSelector(getShowCode)
  const showLayout = useSelector(getShowLayout)
  const components = useSelector(getComponents)
  const dispatch = useDispatch()
  const {
  palette,
  heroBackground,
} = useForgeTheme()

  const viewportRef = useRef<HTMLDivElement | null>(null)
  const { drop } = useDropComponent('root', undefined, true, viewportRef)

  const isEmpty = !components.root.children.length
  const rootProps = components.root.props

  let editorBackgroundProps = {}

  const onSelectBackground = (
  event: React.MouseEvent<HTMLDivElement>,
) => {
  // Only unselect when clicking the empty editor background.
  // Ignore clicks that originated from components inside the canvas.
  if (event.target !== event.currentTarget) {
    return
  }

  dispatch.components.unselect()
}

if (showLayout) {
  editorBackgroundProps = gridStyles
}

 const textureId = (palette as any).texture

const textureStyle = textureId
  ? textureBackgrounds[textureId] || {}
  : {}

const heroStyle = heroBackground
  ? {
      backgroundImage: `url("${heroBackground}")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  : {}

  const deviceProps = {
    ...rootProps,
  }

  const Playground = (
    <Box
      {...editorBackgroundProps}
      height="100%"
      width="100%"
      minWidth="10rem"
      overflow="auto"
      position="relative"
      p={3}
      onClick={onSelectBackground}
    >
      <Box
        bg={(palette as any).bg || '#101826'}
        border={`1px solid ${(palette as any).border || 'rgba(56, 189, 248, 0.45)'}`}
        boxShadow={`0 0 0 1px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.45), 0 0 28px ${(palette as any).accent || '#2dd4bf'}44`}
        borderRadius="14px"
        overflow="hidden"
        position="relative"
        mx="auto"
        my={4}
        {...deviceProps}
        {...textureStyle}
        {...heroStyle}
        ref={(node: HTMLDivElement | null) => {
          viewportRef.current = node
          drop(node)
        }}
        width={`${FORGEUI_ACTIVE_DEVICE.width}px`}
        height={`${FORGEUI_ACTIVE_DEVICE.height}px`}
        minWidth={`${FORGEUI_ACTIVE_DEVICE.width}px`}
        minHeight={`${FORGEUI_ACTIVE_DEVICE.height}px`}
        maxWidth={`${FORGEUI_ACTIVE_DEVICE.width}px`}
        maxHeight={`${FORGEUI_ACTIVE_DEVICE.height}px`}
        display={isEmpty ? 'flex' : 'block'}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
       {(heroBackground || (textureId && textureId !== 'none')) && (
  <Box
    position="absolute"
    inset={0}
    bg="blackAlpha.200"
    pointerEvents="none"
  />
)}

        {isEmpty && (
          <Text
            maxWidth="md"
            color={(palette as any).text || 'gray.400'}
            fontSize="xl"
            textAlign="center"
            zIndex={1}
          >
            Drag ForgeUI components onto the ESP32-P4 screen.
            <br />
            Active target: {FORGEUI_ACTIVE_DEVICE.name}
          </Text>
        )}

        {interactiveAssetsReady &&
           components.root.children.map(
           (name: string) => (
           <ComponentPreview
            key={name}
            componentName={name}
       />
      ),
      )}
      </Box>
    </Box>
  )

  if (!showCode) {
    return Playground
  }

  return (
    // @ts-ignore
    <SplitPane
      style={{ overflow: 'auto' }}
      defaultSize="50%"
      resizerStyle={{
        border: '3px solid rgba(1, 22, 39, 0.21)',
        zIndex: 20,
        cursor: 'row-resize',
      }}
      split="horizontal"
    >
      {Playground}
      <CodePanel />
    </SplitPane>
  )
}

export default memo(Editor)