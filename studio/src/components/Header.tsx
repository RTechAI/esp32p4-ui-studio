import React, { memo, useEffect, useRef, useState } from 'react'
import DevicePreview from '~forgeui/preview/DevicePreview'
import { generateForgeUILvglCode } from '~forgeui/ForgeUILvglExport'
import { useForgeTheme } from '~forgeui/theme/ForgeThemeContext'
import {
  Box,
  Switch,
  Button,
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
import { AiFillThunderbolt } from 'react-icons/ai'
import { SiTypescript } from 'react-icons/si'
import { buildParameters } from '~utils/codesandbox'
import { generateCode } from '~utils/code'
import useDispatch from '~hooks/useDispatch'
import { useSelector } from 'react-redux'
import { getComponents } from '~core/selectors/components'
import { getShowLayout, getShowCode } from '~core/selectors/app'
import HeaderMenu from '~components/headerMenu/HeaderMenu'
import { FaReact } from 'react-icons/fa'

const CodeSandboxButton = ({
  exportEspIdfProject,
}: {
  exportEspIdfProject: () => Promise<void>
}) => {
  const components = useSelector(getComponents)
  const [isLoading, setIsLoading] = useState(false)

  const exportToCodeSandbox = async (isTypeScript: boolean) => {
    setIsLoading(true)
    const code = await generateCode(components)
    setIsLoading(false)
    const parameters = buildParameters(code, isTypeScript)

    window.open(
      `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
      '_blank',
    )
  }

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Button
              isLoading={isLoading}
              rightIcon={<ExternalLinkIcon path="" />}
              variant="ghost"
              size="xs"
            >
              Export code
            </Button>
          </PopoverTrigger>

          <LightMode>
            <PopoverContent zIndex={100} bg="white">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Export format</PopoverHeader>
              <PopoverBody fontSize="sm">
                Export the code in CodeSandbox in which format ?
              </PopoverBody>
              <PopoverFooter display="flex" justifyContent="flex-end">
                <Button
                  size="sm"
                  mr={2}
                  variant="ghost"
                  colorScheme="orange"
                  rightIcon={<FaReact />}
                  onClick={async () => {
                    await exportToCodeSandbox(false)
                    if (onClose) onClose()
                  }}
                >
                  JSX
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  rightIcon={<SiTypescript />}
                  onClick={async () => {
                    await exportToCodeSandbox(true)
                    if (onClose) onClose()
                  }}
                >
                  TSX
                </Button>

                <Button
  size="sm"
  ml={2}
  variant="ghost"
  colorScheme="purple"
  onClick={async () => {
    await exportEspIdfProject()
    if (onClose) onClose()
  }}
>
  ESP-IDF
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
  const { themeId } = useForgeTheme()
  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const dispatch = useDispatch()
  const toast = useToast()
  const components = useSelector(getComponents)

  const [flashLog, setFlashLog] = useState('')
  const [flashPanelOpen, setFlashPanelOpen] = useState(false)
  const [flashRunning, setFlashRunning] = useState(false)

  const [previewOpen, setPreviewOpen] = useState(false)
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

  const exportToForgeUIOne = async () => {
    const code = generateForgeUILvglCode(
  components,
  themeId,
)

    setFlashPanelOpen(true)
    setFlashLog('Starting Build & Flash...\n')

    await fetch('http://localhost:3030/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    await fetch('http://localhost:3030/flash', {
      method: 'POST',
    })
  }

  const exportEspIdfProject = async () => {
  const code = generateForgeUILvglCode(
    components,
    themeId,
  )

  setFlashPanelOpen(false)
  setFlashLog(
  'Standalone ESP-IDF project exported successfully.\n' +
  'Move the exported project to a clean workspace.\n' +
  'Close this window when finished.\n'
)

  await fetch('http://localhost:3030/export-idf-project', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code,
    projectName: 'ForgeUI_Export',
  }),
})

  
  toast({
  title: 'Standalone ESP-IDF Project Exported',
  description:
    'Move the exported folder to a clean workspace before opening in ESP-IDF. Do not build it inside the ForgeUI Studio project tree.',
  status: 'success',
  duration: 7000,
  isClosable: true,
})
  }



  const cleanBuildFlashForgeUIOne = async () => {
        const code = generateForgeUILvglCode(
  components,
  themeId,
)

    setFlashPanelOpen(true)
    setFlashLog('Starting Clean Build & Flash...\n')

    await fetch('http://localhost:3030/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    await fetch('http://localhost:3030/clean-flash', {
      method: 'POST',
    })
  }

  return (
    <DarkMode>
      <Flex
        justifyContent="space-between"
        bg="#1a202c"
        as="header"
        height="3rem"
        px="1rem"
      >
        <Flex
          width="14rem"
          height="100%"
          backgroundColor="#1a202c"
          color="white"
          as="a"
          fontSize="xl"
          flexDirection="row"
          alignItems="center"
          aria-label="ForgeUI Studio"
        >
          <Box fontSize="2xl" as={AiFillThunderbolt} mr={1} color="teal.100" />{' '}
          <Box fontWeight="bold">ForgeUI</Box>&nbsp;Studio
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
            <CodeSandboxButton exportEspIdfProject={exportEspIdfProject} />

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
                      <PopoverFooter display="flex" justifyContent="flex-end">
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
          <Link isExternal href="https://github.com/premieroctet/openchakra">
            <Box as={DiGithubBadge} size={32} color="gray.200" />
          </Link>
          <Box lineHeight="shorter" color="white" fontSize="xs">
            by{' '}
              <Link isExternal href="https://github.com/RTechAI" color="teal.100">
               RTechAI
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
          left="20px"
          top="70px"
          right="20px"
          bottom="20px"
          bg="#070b12"
          color="white"
          border="1px solid #2dd4bf"
          borderRadius="md"
          zIndex={9998}
          overflow="auto"
          boxShadow="0 0 24px rgba(0,0,0,0.65)"
        >
          <Flex justify="flex-end" p={3}>
            <Button
             size="xs"
              colorScheme="red"
               onClick={() => setPreviewOpen(false)}
  >
               Close Preview
               </Button>
                </Flex>

          <DevicePreview components={components} />
        </Box>
      )}
    </DarkMode>
  )
}

export default memo(Header)