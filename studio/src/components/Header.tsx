import React, { memo, useEffect, useRef, useState } from 'react'
import DevicePreview from '~forgeui/preview/DevicePreview'
import { ForgeUIAssetManager } from '~forgeui/assets/ForgeUIAssetManager'
import { generateForgeUILvglCode } from '~forgeui/ForgeUILvglExport'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import { FG_PREVIEW_PALETTES } from '~forgeui/preview/forgeThemeMap'
import ForgeAIPanel from '~forgeui/ai/ForgeAIPanel'
import {
  forgeUIGetUploadedAssets,
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
                Export a standalone ESP-IDF project or open the exports folder.
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

  const selectedHeroAsset = uploadedAssets.find(
    asset => asset.browserSrc === heroBackground,
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

  const insertAiLayout = (items: any[]) => {
  items.forEach((item) => {
    dispatch.components.addComponent({
      parentName: 'root',
      type: item.type as any,
      rootParentType: item.type as any,
      props: item.props,
    })
  })
}



  const flashLogRef = useRef<HTMLPreElement | null>(null)

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
              size="xs"
               variant="outline"
                colorScheme="cyan"
                  onClick={() => setPreviewOpen(prev => !prev)}
>
                    {previewOpen ? 'Close Preview' : 'Preview'}
              </Button>
              
              <Button
                size="xs"
                variant="solid"
                colorScheme="teal"
                onClick={exportToForgeUIOne}
              >
                Build & Flash
              </Button>

              <Button
                size="xs"
                variant="outline"
                colorScheme="orange"
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
                      <PopoverHeader>Are you sure?</PopoverHeader>
                      <PopoverBody fontSize="sm">
                        Do you really want to remove all components on the
                        editor?
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
                          colorScheme="red"
                          rightIcon={<CheckIcon path="" />}
                          onClick={() => {
                            dispatch.components.reset()
                            if (onClose) onClose()
                          }}
                        >
                          Yes, clear
                        </Button>
                      </PopoverFooter>
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
  height="118px"
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
  height="62px"
  fontSize="11px"
  fontFamily="monospace"
  bg="#020304"
  p={2}
  borderRadius="md"
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
  <Box
    position="fixed"
    left="20px"
    top="70px"
    right="20px"
    bottom="10px"
    bg="#070b12"
    color="white"
    border="1px solid #805ad5"
    borderRadius="md"
    zIndex={9999}
    overflow="auto"
    boxShadow="0 0 24px rgba(0,0,0,0.65)"
    p={4}
  >
    <Flex justify="space-between" align="center" mb={4}>
      <Box fontWeight="bold" fontSize="lg">
        ForgeUI Theme Manager
      </Box>

      <Button
        size="xs"
        colorScheme="red"
        onClick={() => setThemeManagerOpen(false)}
      >
        Close
      </Button>
    </Flex>

    <Box color="gray.400" fontSize="sm" mb={4}>
      Select a ForgeUI visual theme. This updates the builder, browser preview,
      and LVGL export colour palette.
    </Box>

    <HStack spacing={4} align="stretch" flexWrap="wrap">
      {Object.entries(FG_PREVIEW_PALETTES).map(([id, palette]) => (
        <Box
          key={id}
          width="220px"
          minHeight="120px"
          p={3}
          border="2px solid"
          borderColor={themeId === id ? 'cyan.300' : 'gray.600'}
          borderRadius="lg"
          bg="#101827"
          cursor="pointer"
          onClick={() => {
  setThemeId(id as any)
}}
          boxShadow={
            themeId === id
              ? '0 0 18px rgba(103, 232, 249, 0.45)'
              : 'none'
          }
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Box fontWeight="bold">{palette.name}</Box>

            {themeId === id && (
              <Badge
                colorScheme="cyan"
                variant="solid"
                borderRadius="full"
                px={2}
              >
                ACTIVE
              </Badge>
            )}
          </Flex>

          <Box
            display="flex"
            height="48px"
            borderRadius="md"
            overflow="hidden"
          >
            <Box flex="1" bg={palette.bg} />
            <Box flex="1" bg={palette.surface} />
            <Box flex="1" bg={palette.accent} />
          </Box>

          <Box mt={3} fontSize="xs" color="gray.400">
            {themeId === id ? 'Active Theme' : 'Click to apply'}
          </Box>
        </Box>
      ))}
    </HStack>
    <Box mt={8}>
  <Box
    fontWeight="bold"
    fontSize="lg"
    mb={4}
  >
    AI & Uploaded Backgrounds
  </Box>

  {uploadedAssets.length === 0 ? (
    <Box color="gray.500" fontSize="sm">
      No uploaded backgrounds available.
    </Box>
  ) : (
    <HStack
      spacing={4}
      align="stretch"
      flexWrap="wrap"
    >
      {[...uploadedAssets]
        .reverse()
        .filter(
          asset =>
            asset.type.startsWith('image/') &&
            asset.exportStatus === 'lvgl_ready',
        )
        .map(asset => (
  <Box
    key={asset.id}
    width="220px"
    p={3}
    border="2px solid"
    borderColor={
      heroBackground === asset.browserSrc
        ? 'cyan.300'
        : 'gray.600'
    }
    borderRadius="lg"
    bg="#101827"
    cursor="pointer"
    boxShadow={
      heroBackground === asset.browserSrc
        ? '0 0 18px rgba(103,232,249,0.45)'
        : 'none'
    }
    onClick={() =>
      setHeroBackground(asset.browserSrc)
    }
    _hover={{
      borderColor: 'cyan.300',
      boxShadow:
        '0 0 18px rgba(103, 232, 249, 0.35)',
    }}
  >
            <Box
              as="img"
              src={asset.browserSrc}
              alt={asset.name}
              width="100%"
              height="120px"
              objectFit="cover"
              borderRadius="md"
              bg="#05070a"
            />

            <Box
              mt={3}
              fontSize="sm"
              fontWeight="semibold"
              noOfLines={1}
            >
              {asset.name}
            </Box>

            <Badge
              mt={2}
              colorScheme="teal"
              variant="subtle"
            >
              LVGL READY
            </Badge>
          </Box>
        ))}
    </HStack>
  )}
</Box>
  </Box>
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