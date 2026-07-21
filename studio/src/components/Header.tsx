import {
  MdDeleteSweep,
  MdCleaningServices,
  MdBuild,
  MdPreview,
  MdFlashOn,
} from 'react-icons/md'

import {
  resolveForgeUIIconLayoutItems,
} from '~forgeui/icons/ForgeUIIconResolver'
import ForgeUIThemeManager from '~forgeui/theme/ForgeUIThemeManager'
import React, { memo, useEffect, useRef, useState } from 'react'
import DevicePreview from '~forgeui/preview/DevicePreview'
import { ForgeUIAssetManager } from '~forgeui/assets/ForgeUIAssetManager'
import { generateForgeUILvglCode } from '~forgeui/ForgeUILvglExport'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { FG_PREVIEW_PALETTES } from '~forgeui/preview/forgeThemeMap'
import ForgeAIPanel from '~forgeui/ai/ForgeAIPanel'
import {
  forgeUIGetUploadedAssets,
  forgeUIClearUploadedAssets,
} from '~forgeui/ForgeUIUploadedAssetRegistry'

import {
  Box,
  Image,
  Switch,
  Button,
  Badge,
  useToast,
  Flex,
  Link,
  Stack,
  FormLabel,
  DarkMode,
  FormControl,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  LightMode,
  PopoverFooter,
  Tooltip,
  HStack,
} from '@chakra-ui/react'
import { ExternalLinkIcon, SmallCloseIcon, CheckIcon } from '@chakra-ui/icons'
import { DiGithubBadge } from 'react-icons/di'
import useDispatch from '~hooks/useDispatch'
import { useSelector } from 'react-redux'
import { getComponents } from '~core/selectors/components'
import { getShowLayout, getShowCode } from '~core/selectors/app'
import HeaderMenu from '~components/headerMenu/HeaderMenu'

const ExportProjectButton = ({
  exportEspIdfProject,
}: {
  exportEspIdfProject: () => Promise<void>
}) => {
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              rightIcon={<ExternalLinkIcon path="" />}
              variant="ghost"
              size="xs"
            >
              Export Project
            </Button>
          </PopoverTrigger>

          <LightMode>
            <PopoverContent zIndex={100} bg="white">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Export Project</PopoverHeader>

              <PopoverBody fontSize="sm">
                Creates an independent ESP-IDF project under
                {' C:\\ForgeUI-Exports'}. After export, add GPIO, I/O and
                application logic in 95_UserEvents.c.
              </PopoverBody>

              <PopoverFooter
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="purple"
                  onClick={async () => {
                    await exportEspIdfProject()
                    if (onClose) onClose()
                  }}
                >
                  ESP-IDF
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="teal"
                  onClick={async () => {
                    await fetch('http://localhost:3030/open-exports', {
                      method: 'POST',
                    })

                    if (onClose) onClose()
                  }}
                >
                  Open Exports Folder
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </LightMode>
        </>
      )}
    </Popover>
  )
}

const Header = () => {
  const {
    themeId,
    heroBackground,
    setThemeId,
    setHeroBackground,
  } = useForgeTheme()

  const uploadedAssets = forgeUIGetUploadedAssets()

  const DEFAULT_HERO_FILE =
  'fg_upload_ai_hero_1784342478518_b95a7dc0'

const defaultHeroAsset = {
  id: DEFAULT_HERO_FILE,
  name: `${DEFAULT_HERO_FILE}.png`,
  type: 'image/png',
  browserSrc:
    `http://localhost:3030/forgeui-defaults/${DEFAULT_HERO_FILE}.png`,
  lvgl: DEFAULT_HERO_FILE,
  cFile:
    `assets/defaults/${DEFAULT_HERO_FILE}.c`,
  exportStatus: 'lvgl_ready',
} as any

const selectedHeroAsset =
  uploadedAssets.find(
    asset =>
      asset.browserSrc === heroBackground,
  ) ||
  (
    heroBackground ===
    defaultHeroAsset.browserSrc
      ? defaultHeroAsset
      : undefined
  )

  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const dispatch = useDispatch()
  const toast = useToast()
  const components = useSelector(getComponents)

  const [flashLog, setFlashLog] = useState('')
  const [flashPanelOpen, setFlashPanelOpen] = useState(false)
  const [flashRunning, setFlashRunning] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)

  const [assetManagerOpen, setAssetManagerOpen] = useState(false)
  const [themeManagerOpen, setThemeManagerOpen] = useState(false)
  const [aiPlaygroundOpen, setAiPlaygroundOpen] = useState(false)

  const insertAiLayout = async (
  items: any[],
) => {
  try {
    const resolvedItems =
      await resolveForgeUIIconLayoutItems(
        items,
      )

    resolvedItems.forEach(item => {
      dispatch.components.addComponent({
        parentName: 'root',
        type: item.type as any,
        rootParentType:
          item.type as any,
        props: item.props,
      })
    })
  } catch (err: any) {
    console.error(
      'AI icon resolution failed:',
      err,
    )

    toast({
      title: 'AI icon insertion failed',
      description:
        err.message ||
        'Unable to resolve the requested icon assets.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }
}



  const flashLogRef = useRef<
    HTMLDivElement & HTMLPreElement
  >(null)

useEffect(() => {
  if (!flashLogRef.current) return

  flashLogRef.current.scrollTop =
    flashLogRef.current.scrollHeight
}, [flashLog])

  useEffect(() => {
    if (!flashPanelOpen) return

    const timer = setInterval(async () => {
  try {
    const res = await fetch('http://localhost:3030/flash-log')
    const data = await res.json()

    setFlashLog(data.log || '')
    setFlashRunning(Boolean(data.running))
  } catch (err) {
    console.error(err)
  }
}, 500)

return () => clearInterval(timer)
}, [flashPanelOpen])

useEffect(() => {
  const handleClose = () => {
    try {
      navigator.sendBeacon('http://localhost:3030/shutdown')
    } catch (err) {
      console.error(err)
    }
  }

  window.addEventListener('beforeunload', handleClose)

  return () => {
    window.removeEventListener('beforeunload', handleClose)
  }
}, [])

useEffect(() => {
  const openAssetManager = () => {
    setAssetManagerOpen(true)
  }

  const openThemeManager = () => {
    setThemeManagerOpen(true)
  }

 const openAiPlayground = () => {
  setAiPlaygroundOpen(true)
 }

 
  window.addEventListener('forgeui-open-asset-manager', openAssetManager)
  window.addEventListener('forgeui-open-theme-manager', openThemeManager)
  window.addEventListener('forgeui-open-ai-playground', openAiPlayground)

  return () => {
    window.removeEventListener('forgeui-open-asset-manager', openAssetManager)
    window.removeEventListener('forgeui-open-theme-manager', openThemeManager)
    window.removeEventListener('forgeui-open-ai-playground', openAiPlayground)
  }
}, [])

const exportToForgeUIOne = async () => {
  const result = generateForgeUILvglCode(
  components,
  themeId,
  selectedHeroAsset,
)

  const code = result.code

  setFlashPanelOpen(true)
  setFlashLog('Starting Build & Flash...\n')

  await fetch('http://localhost:3030/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  code,
  assetSources: result.assetSources,
  userEventHooks: result.userEventHooks,
  publicApiDeclarations: result.publicApiDeclarations,
}),
  })

 await fetch('http://localhost:3030/flash', {
  method: 'POST',
})
}


  const exportEspIdfProject = async () => {
  const result = generateForgeUILvglCode(
    components,
    themeId,
    selectedHeroAsset,
  )

  const code = result.code
  const assetSources = result.assetSources

  setFlashPanelOpen(false)
  setFlashLog(
    'Standalone ESP-IDF project exported successfully.\n' +
      'Export location: C:\\ForgeUI-Exports\n' +
      'Open the exported project in ESP-IDF.\n' +
      'Close this window when finished.\n',
  )

  await fetch('http://localhost:3030/export-idf-project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  code,
  assetSources,
  userEventHooks: result.userEventHooks,
  publicApiDeclarations: result.publicApiDeclarations,
  projectName: 'ForgeUI_Export',
}),
  })

  toast({
    title: 'Standalone ESP-IDF Project Exported',
    description: 'Project exported to C:\\ForgeUI-Exports',
    status: 'success',
    duration: 7000,
    isClosable: true,
  })
}

const cleanBuildFlashForgeUIOne = async () => {
  const result = generateForgeUILvglCode(
    components,
    themeId,
    selectedHeroAsset,
  )

  const code = result.code

  setFlashPanelOpen(true)
  setFlashLog('Starting Clean Build & Flash...\n')

  await fetch('http://localhost:3030/export', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
  code,
  assetSources: result.assetSources,
  userEventHooks: result.userEventHooks,
  publicApiDeclarations: result.publicApiDeclarations,
}),
  })

  await fetch('http://localhost:3030/clean-flash', {
    method: 'POST',
  })
}
  return (
    <DarkMode>
      <Flex
        justifyContent="space-between"
        bg="#070b12"
        as="header"
        height="3rem"
        px="1rem"
      >
        <Flex
          width="20rem"
          height="100%"
          backgroundColor="transparent"
          color="white"
          as="a"
          fontSize="xl"
          flexDirection="row"
          alignItems="center"
          aria-label="ForgeUI Studio"
        >
          <Image
  src="/images/forgeui-logo.svg"
  alt="ForgeUI Studio"
  h="60px"
  ml="-20px"
  objectFit="contain"
/>
        </Flex>

        <Flex flexGrow={1} justifyContent="space-between" alignItems="center">
          <HStack spacing={4} justify="center" align="center">
            <Box>
              <HeaderMenu />
            </Box>

                        <FormControl flexDirection="row" display="flex" alignItems="center">
              <Tooltip
                zIndex={100}
                hasArrow
                bg="yellow.100"
                aria-label="Builder mode help"
                label="Builder mode adds extra padding/borders"
              >
                <FormLabel
                  cursor="help"
                  color="gray.200"
                  fontSize="xs"
                  htmlFor="preview"
                  pb={0}
                  mb={0}
                  mr={2}
                  whiteSpace="nowrap"
                >
                  Builder mode
                </FormLabel>
              </Tooltip>

              <LightMode>
                <Switch
                  isChecked={showLayout}
                  colorScheme="teal"
                  size="sm"
                  onChange={() => dispatch.app.toggleBuilderMode()}
                  id="preview"
                />
              </LightMode>
            </FormControl>

            <FormControl display="flex" flexDirection="row" alignItems="center">
              <FormLabel
                color="gray.200"
                fontSize="xs"
                mr={2}
                mb={0}
                htmlFor="code"
                pb={0}
                whiteSpace="nowrap"
              >
                Code panel
              </FormLabel>

              <LightMode>
                <Switch
                  isChecked={showCode}
                  id="code"
                  colorScheme="teal"
                  onChange={() => dispatch.app.toggleCodePanel()}
                  size="sm"
                />
              </LightMode>
            </FormControl>
          </HStack>

          <Stack direction="row">
            <ExportProjectButton exportEspIdfProject={exportEspIdfProject} />

            <HStack spacing={2}>
              <Box
                fontSize="10px"
                color="gray.300"
                px={2}
                py={1}
                borderWidth="1px"
                borderColor="gray.600"
                borderRadius="md"
                bg="#202938"
                whiteSpace="nowrap"
              >
                ESP32-P4-WIFI6-Touch-LCD-7B
              </Box>
              
              <Button
  size="sm"
  h="32px"
  px={4}
  borderRadius="5px"
  fontSize="12px"
  fontWeight="600"
  letterSpacing="0.2px"
  leftIcon={<MdPreview />}
  bg="#111827"
  color="cyan.200"
  border="1px solid"
  borderColor="cyan.700"
  _hover={{
    bg: "#172033",
    borderColor: "cyan.400",
  }}
  onClick={() => setPreviewOpen(prev => !prev)}
>
  {previewOpen ? "Close Preview" : "Preview"}
</Button>

<Button
  size="sm"
  h="32px"
  px={4}
  borderRadius="5px"
  fontSize="12px"
  fontWeight="600"
  letterSpacing="0.2px"
  leftIcon={<MdFlashOn />}
  bg="#0f766e"
  color="white"
  border="1px solid"
  borderColor="#14b8a6"
  _hover={{
    bg: "#115e59",
  }}
  onClick={exportToForgeUIOne}
>
  Build & Flash
</Button>

<Button
  size="sm"
  h="32px"
  px={4}
  borderRadius="5px"
  fontSize="12px"
  fontWeight="600"
  letterSpacing="0.2px"
  leftIcon={<MdBuild />}
  bg="#111827"
  color="#fbbf24"
  border="1px solid"
  borderColor="#b45309"
  _hover={{
    bg: "#1f2937",
    borderColor: "#f59e0b",
  }}
  onClick={cleanBuildFlashForgeUIOne}
>
  Clean Build & Flash
</Button>
            </HStack>

            <Popover>
              {({ onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button
                      ml={4}
                      rightIcon={<SmallCloseIcon path="" />}
                      size="xs"
                      variant="ghost"
                    >
                      Clear
                    </Button>
                  </PopoverTrigger>

                  <LightMode>
                    <PopoverContent zIndex={100} bg="white">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      
<Button
  variant="ghost"
  justifyContent="flex-start"
  leftIcon={<MdDeleteSweep size={20} />}
  size="md"
  width="100%"
  borderRadius="md"
  fontWeight="normal"
  onClick={() => {
    dispatch.components.reset()

    toast({
      title: 'Canvas cleared',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    if (onClose) {
      onClose()
    }
  }}
>
  Clear Canvas
</Button>

<Button
  variant="ghost"
  justifyContent="flex-start"
  leftIcon={<MdBuild size={20} />}
  size="md"
  width="100%"
  borderRadius="md"
  fontWeight="normal"
  onClick={async () => {
    try {
      const response = await fetch(
        'http://localhost:3030/clean-firmware-uploads',
        {
          method: 'POST',
        },
      )

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(
          data.error ||
          `Clean failed: ${response.status}`,
        )
      }

      toast({
        title: 'Firmware cleaned',
        description:
          'CMake and Studio export files were reset to a clean baseline.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })

      if (onClose) {
        onClose()
      }
    } catch (err: any) {
      toast({
        title: 'Firmware clean failed',
        description:
          err.message ||
          'Unable to reset the generated firmware files.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }}
>
  Clean Firmware
</Button>

<Popover>
  {({ onClose: closeMaintenance }) => (
    <>
      <PopoverTrigger>
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<MdCleaningServices size={20} />}
          size="md"
          width="100%"
          borderRadius="md"
          fontWeight="normal"
        >
          Firmware Maintenance
        </Button>
      </PopoverTrigger>

      <LightMode>
        <PopoverContent
          zIndex={200}
          bg="white"
          color="gray.800"
        >
          <PopoverArrow />
          <PopoverCloseButton />

          <PopoverHeader
            fontWeight="bold"
            color="orange.600"
          >
            Firmware Maintenance
          </PopoverHeader>

          <PopoverBody fontSize="sm">
            Cleans all generated firmware icons, themes,
            uploaded assets, cached input files, generated
            Studio export files, CMake references and the
            ESP-IDF build cache.
            <br />
            <br />
            Use this if Build &amp; Flash fails, firmware
            assets become out of sync, or after a large
            project cleanup.
            <br />
            <br />
            To remove individual uploaded assets, use
            <strong> Asset Manager</strong>.
            <br />
            <br />
            <strong>
              Your ForgeUI project and canvas are not deleted.
            </strong>
            <br />
            <br />
            <strong>
              Restart ForgeUI Studio after maintenance before
              continuing.
            </strong>
          </PopoverBody>

          <PopoverFooter
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={closeMaintenance}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              colorScheme="orange"
              onClick={async () => {
                try {
                  const response = await fetch(
                    'http://localhost:3030/clean-firmware-sweep',
                    {
                      method: 'POST',
                    },
                  )

                  const data = await response.json()

                  if (!response.ok || !data.ok) {
                    throw new Error(
                      data.error ||
                      `Maintenance failed: ${response.status}`,
                    )
                  }

                dispatch.components.reset()
forgeUIClearUploadedAssets()

localStorage.removeItem(
  'forgeui_active_theme_v1',
)

setHeroBackground(null)
setThemeId('graphite')

if (data.defaultHero) {
  setHeroBackground(
    data.defaultHero.browserSrc,
  )

  localStorage.setItem(
    'forgeui_active_theme_v1',
    JSON.stringify({
      themeId: 'graphite',
      customPalette: null,
      heroBackground:
        data.defaultHero.browserSrc,
      activeHeroAssetId:
        data.defaultHero.id,
    }),
  )
}

                  toast({
                    title:
                      'Firmware Maintenance Complete',
                    description:
                      `${data.filesRemoved || 0} generated files cleaned. Restart ForgeUI Studio before continuing.`,
                    status: 'success',
                    duration: 8000,
                    isClosable: true,
                  })

                  closeMaintenance()

                  if (onClose) {
                    onClose()
                  }
                } catch (err: any) {
                  toast({
                    title:
                      'Firmware Maintenance Failed',
                    description:
                      err.message ||
                      'Unable to complete firmware maintenance.',
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                  })
                }
              }}
            >
              Run Maintenance
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </LightMode>
    </>
  )}
</Popover>

                    </PopoverContent>
                  </LightMode>
                </>
              )}
            </Popover>
          </Stack>
        </Flex>

        <Stack
          justifyContent="flex-end"
          width="13rem"
          align="center"
          direction="row"
          spacing="2"
        >
          <Link
           isExternal
           href="https://github.com/RTechAI/esp32p4-ui-studio"
>
       <Box as={DiGithubBadge} size={32} color="gray.200" />
        </Link>

        <Box lineHeight="shorter" color="white" fontSize="xs">
  <Link
            isExternal
             href="https://github.com/RTechAI/esp32p4-ui-studio"
             color="teal.100"
  >
           esp32p4-ui-studio
  </Link>
</Box>
        </Stack>
      </Flex>

            {flashPanelOpen && (
        <Box
  position="fixed"
  left="17rem"
  right="18rem"
  bottom="14px"
  height="220px"
  minHeight="118px"
  maxHeight="70vh"
  resize="vertical"
  overflow="hidden"
  bg="#05070a"
  color="green.100"
  border="1px solid #2dd4bf"
  borderRadius="md"
  zIndex={9999}
  p={3}
  boxShadow="0 0 20px rgba(0,0,0,0.6)"
>
          <Flex justify="space-between" mb={2} align="center">
            <Box fontWeight="bold">ForgeUI Flash Console</Box>

            <HStack spacing={2}>
              <Box fontSize="11px" color={flashRunning ? 'orange.300' : 'green.300'}>
                {flashRunning ? 'RUNNING' : 'IDLE'}
              </Box>

              <Button size="xs" variant="outline" onClick={() => setFlashLog('')}>
                Clear
              </Button>

              <Button
                size="xs"
                colorScheme="red"
                onClick={async () => {
                  await fetch('http://localhost:3030/flash-stop', { method: 'POST' })
                  setFlashPanelOpen(false)
                }}
              >
                Close / Stop
              </Button>
            </HStack>
          </Flex>

          <Box
  ref={flashLogRef}
  as="pre"
  whiteSpace="pre-wrap"
  overflowY="auto"
  height="calc(100% - 42px)"
  fontSize="11px"
  fontFamily="Consolas, 'Courier New', monospace"
  bg="#020304"
  color="green.100"
  p={2}
  borderRadius="md"
  cursor="text"
  userSelect="text"
  sx={{
    userSelect: 'text',
    WebkitUserSelect: 'text',
  }}
>
  {flashLog || 'Waiting for flash output...'}
</Box>
</Box>
)}

            {previewOpen && (
  <Box
    position="fixed"
    left="5px"
    top="45px"
    right="5px"
    bottom="0px"
    bg="#070b12"
    color="white"
    border="1px solid #2dd4bf"
    borderRadius="md"
    zIndex={9998}
    overflow="auto"
    boxShadow="0 0 24px rgba(0,0,0,0.65)"
  >
    <Flex align="flex-start">
  <DevicePreview components={components} />

  <Box pt="20px" px={3}>
    <Button
      size="xs"
      colorScheme="red"
      onClick={() => setPreviewOpen(false)}
    >
      Close Preview
    </Button>
  </Box>
</Flex>
  </Box>
)}

{assetManagerOpen && (
  <ForgeUIAssetManager
    onClose={() => setAssetManagerOpen(false)}
  />
)}
  
{themeManagerOpen && (
  <ForgeUIThemeManager
    onClose={() =>
      setThemeManagerOpen(false)
    }
    onInsertImageAsset={asset => {
      insertAiLayout([
        {
          type: 'Image',
          props: {
            positionMode: 'absolute',
            x: 120,
            y: 120,
            w: 320,
            h: 220,
            src: asset.browserSrc,
            uploadedAssetId: asset.id,
            cFile: asset.cFile,
            lvgl: asset.lvgl,
          },
        },
      ])

      setThemeManagerOpen(false)
    }}
  />
)}

{aiPlaygroundOpen && (
  <ForgeAIPanel
    onClose={() => setAiPlaygroundOpen(false)}
    insertAiLayout={insertAiLayout}
  />
)}

</DarkMode>
)
}

export default memo(Header)
