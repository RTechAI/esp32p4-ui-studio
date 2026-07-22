import React from 'react'
import bugsnag from '@bugsnag/js'
import bugsnagReact from '@bugsnag/plugin-react'

const bugsnagApiKey = process.env.NEXT_PUBLIC_BUGSNAG_API_KEY?.trim()

export const bugsnagEnabled = Boolean(bugsnagApiKey)

export const bugsnagClient = bugsnagEnabled
  ? bugsnag({
      apiKey: bugsnagApiKey as string,
      releaseStage: process.env.NODE_ENV,
      notifyReleaseStages: ['production'],
    })
  : null

if (bugsnagClient) {
  bugsnagClient.use(bugsnagReact, React)
}

export const ErrorBoundary = bugsnagClient
  ? bugsnagClient.getPlugin('react')
  : null
