import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { Global } from '@emotion/react'
import 'react-color-picker/index.css'
import '@reach/combobox/styles.css'

import { wrapper } from '~core/store'
import { ErrorBoundary as BugsnagErrorBoundary } from '~utils/bugsnag'
import AppErrorBoundary from '~components/errorBoundaries/AppErrorBoundary'
import { ForgeThemeProvider } from '~forgeui/theme/ForgeThemeContext'
import { AppProps } from 'next/app'

const Main = ({ Component, pageProps }: AppProps) => {
  const app = (
    <ChakraProvider resetCSS theme={theme}>
      <Global
        styles={{
          '.chakra-input, .chakra-select, input, select, textarea': {
            background: '#020617 !important',
            color: '#f8fafc !important',
            WebkitTextFillColor: '#f8fafc !important',
            borderColor: '#334155 !important',
            opacity: '1 !important',
          },

          '.chakra-input::placeholder, input::placeholder, textarea::placeholder': {
            color: '#94a3b8 !important',
            WebkitTextFillColor: '#94a3b8 !important',
            opacity: '1 !important',
          },

          '.chakra-input:disabled, .chakra-select:disabled, input:disabled, select:disabled': {
            color: '#cbd5e1 !important',
            WebkitTextFillColor: '#cbd5e1 !important',
            opacity: '1 !important',
          },
        }}
      />

      <AppErrorBoundary>
        <ForgeThemeProvider>
          <Component {...pageProps} />
        </ForgeThemeProvider>
      </AppErrorBoundary>
    </ChakraProvider>
  )

  return BugsnagErrorBoundary ? (
    <BugsnagErrorBoundary>{app}</BugsnagErrorBoundary>
  ) : (
    app
  )
}

export default wrapper.withRedux(Main)
