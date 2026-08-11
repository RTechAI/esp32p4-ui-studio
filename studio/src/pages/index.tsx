import React from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Global } from '@emotion/react'
import Metadata from '~components/Metadata'
import useShortcuts from '~hooks/useShortcuts'
import Header from '~components/Header'
import Sidebar from '~components/sidebar/Sidebar'
import EditorErrorBoundary from '~components/errorBoundaries/EditorErrorBoundary'
import Editor from '~components/editor/Editor'
import { InspectorProvider } from '~contexts/inspector-context'
import Inspector from '~components/inspector/Inspector'
import DeviceConsoleDock from '~components/deviceConsole/DeviceConsoleDock'
import { DeviceConsoleProvider } from '~contexts/device-console-context'

const DndProviderWithChildren = DndProvider as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof DndProvider>>
>

const App = () => {
  useShortcuts()

  return (
    <>
      <Global
        styles={() => ({
          html: { minWidth: '860px', backgroundColor: '#1a202c' },
        })}
      />
      <Metadata />
      <DeviceConsoleProvider>
      <Header />
      <Flex direction="column" h="calc(100vh - 3rem)" overflow="hidden">
      <DndProviderWithChildren backend={HTML5Backend}>
        <Flex
          data-testid="studio-workspace"
          flex="1 1 auto"
          minH={0}
          height="100%"
          overflow="hidden"
          alignItems="stretch"
        >
          <Box
            data-testid="studio-sidebar-column"
            flex="0 0 15rem"
            minH={0}
            height="100%"
            overflow="hidden"
          >
            <Sidebar />
          </Box>
          <EditorErrorBoundary>
            <Box
              data-testid="studio-canvas-column"
              bg="#020617"
              flex="1 1 auto"
              minW={0}
              minH={0}
              height="100%"
              position="relative"
              overflow="hidden"
            >
              <Editor />
            </Box>
          </EditorErrorBoundary>

          <Box
           data-testid="studio-inspector-column"
           height="100%"
           minH={0}
           maxH="100%"
           flex="0 0 15rem"
           bg="#111827"
           overflowY="auto"
           overflowX="visible"
            borderLeft="1px solid #1e293b"
>
            <InspectorProvider>
              <Inspector />
            </InspectorProvider>
          </Box>
        </Flex>
      </DndProviderWithChildren>
      <DeviceConsoleDock />
      </Flex>
      </DeviceConsoleProvider>
    </>
  )
}

export default App
