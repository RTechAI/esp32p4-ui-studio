import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { SensorTilePanel } from './SensorTilePanel'
import { INSPECTOR_PROPERTY_TEXT_COLOR } from '~components/inspector/controls/FormControl'

jest.mock('~hooks/useForm', () => ({
  __esModule: true,
  default: () => ({ setValue: jest.fn() }),
  useForm: () => ({ setValue: jest.fn() }),
}))
jest.mock('~hooks/usePropsSelector', () => ({ __esModule: true, default: () => undefined }))

describe('SensorTilePanel dark Inspector labels', () => {
  it('uses the shared readable property text colour for labels and toggles', () => {
    render(<ChakraProvider><SensorTilePanel /></ChakraProvider>)
    ;['Sensor type', 'Title', 'Icon', 'Current value', 'Units', 'Status', 'Trend', 'Timestamp', 'Padding'].forEach(label => {
      expect(screen.getByText(label)).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
    })
    ;['Auto colour from ranges', 'Show trend', 'Show progress', 'Show timestamp', 'Generate click UserEvent'].forEach(label => {
      expect(screen.getByText(label).closest('label')).toHaveStyle(`color: ${INSPECTOR_PROPERTY_TEXT_COLOR}`)
    })
  })
})
