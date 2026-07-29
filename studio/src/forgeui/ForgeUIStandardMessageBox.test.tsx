import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import { storeConfig } from '../core/store'
import ComponentPreview from '../components/editor/ComponentPreview'
import {
  getForgeUIStandardMessageBoxModel,
} from './ForgeUIStandardMessageBox'
import StandardMessageBoxPreview from './preview/StandardMessageBoxPreview'
import { renderForgePreview } from './preview/forgePreviewRenderer'
import { ForgeThemeProvider } from './theme/ForgeThemeContext'

jest.mock('../components/editor/PreviewContainer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const messageBox = (
  props: Record<string, unknown> = {},
): IComponent => ({
  id: 'message',
  parent: 'root',
  type: 'Msgbox',
  props: { x: 14, y: 22, w: 240, h: 120, ...props },
  children: [],
})

const BrowserMessageBox = ({
  component,
}: {
  component: IComponent
}) => {
  const root: IComponent = {
    id: 'root',
    parent: 'root',
    type: 'Box',
    props: {},
    children: [component.id],
  }
  return <>{renderForgePreview({
    component: root,
    components: { root, message: component },
  })}</>
}

describe('Standard MessageBox preview parity', () => {
  it('normalizes the same defaults and serialized content as the exporter', () => {
    expect(getForgeUIStandardMessageBoxModel({})).toEqual({
      title: 'Message',
      bodyText: 'Example message text',
      buttons: ['OK', 'Cancel'],
    })
    expect(getForgeUIStandardMessageBoxModel({
      title: 'Warning',
      bodyText: 'Temperature high',
      buttons: ['Retry', '', 'Ignore'],
    })).toEqual({
      title: 'Warning',
      bodyText: 'Temperature high',
      buttons: ['Retry', 'Ignore'],
    })
    expect(getForgeUIStandardMessageBoxModel({
      text: 'Legacy body',
      buttons: [],
    })).toEqual({
      title: 'Message',
      bodyText: 'Legacy body',
      buttons: ['OK', 'Cancel'],
    })
  })

  it('renders the approved Browser/P4 structure and styling', () => {
    render(
      <ChakraProvider>
        <StandardMessageBoxPreview component={messageBox()} />
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-message-box-preview')
    expect(preview).toHaveStyle({
      background: '#1E2328',
      color: '#F5F5F5',
      border: '1px solid #F2A900',
      borderRadius: '8px',
      padding: '8px',
      overflow: 'hidden',
    })
    expect(screen.getByTestId('standard-message-box-title'))
      .toHaveTextContent('Message')
    expect(screen.getByTestId('standard-message-box-body'))
      .toHaveTextContent('Example message text')
    expect(screen.getByTestId('standard-message-box-buttons'))
      .toHaveStyle({ gap: '6px', justifyContent: 'flex-end' })
    expect(screen.getAllByTestId('standard-message-box-button')
      .map(button => button.textContent)).toEqual(['OK', 'Cancel'])
  })

  it('preserves MsgBox properties through the generic store model', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Msgbox',
      rootParentType: 'Msgbox',
      testId: 'message',
      props: {
        title: 'Warning',
        bodyText: 'Temperature high',
        buttons: ['Retry', 'Cancel'],
      },
    })

    // @ts-ignore State is wrapped by redux-undo in the configured store.
    expect(store.getState().components.present.components.message.props)
      .toMatchObject({
        title: 'Warning',
        bodyText: 'Temperature high',
        buttons: ['Retry', 'Cancel'],
      })
  })

  it('uses the shared serialized renderer on Canvas', () => {
    // @ts-ignore Rematch's inferred plugin type is wider than this test needs.
    const store = init(storeConfig)
    store.dispatch.components.addComponent({
      parentName: 'root',
      type: 'Msgbox',
      rootParentType: 'Msgbox',
      testId: 'message',
      props: messageBox({
        title: 'Warning',
        bodyText: 'Temperature high',
        buttons: ['Retry', 'Ignore'],
      }).props,
    })

    render(
      <ChakraProvider>
        <Provider store={store}>
          <ComponentPreview componentName="message" />
        </Provider>
      </ChakraProvider>,
    )

    expect(screen.getByTestId('standard-message-box-preview'))
      .toBeInTheDocument()
    expect(screen.getByTestId('standard-message-box-title'))
      .toHaveTextContent('Warning')
    expect(screen.getAllByTestId('standard-message-box-button')
      .map(button => button.textContent)).toEqual(['Retry', 'Ignore'])
  })

  it('uses the same shared renderer and geometry in Browser Preview', () => {
    const component = messageBox({
      title: 'Warning',
      bodyText: 'Temperature high',
      buttons: ['Retry', 'Ignore'],
    })
    render(
      <ChakraProvider>
        <ForgeThemeProvider>
          <BrowserMessageBox component={component} />
        </ForgeThemeProvider>
      </ChakraProvider>,
    )

    const preview = screen.getByTestId('standard-message-box-preview')
    expect(preview.parentElement).toHaveStyle({
      left: '14px',
      top: '22px',
      width: '240px',
      height: '120px',
    })
    expect(screen.getByTestId('standard-message-box-title'))
      .toHaveTextContent('Warning')
    expect(screen.getByTestId('standard-message-box-body'))
      .toHaveTextContent('Temperature high')
    expect(screen.getAllByTestId('standard-message-box-button')
      .map(button => button.textContent)).toEqual(['Retry', 'Ignore'])
  })
})
