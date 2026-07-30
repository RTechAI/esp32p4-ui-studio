import React, { memo } from 'react'
import { Select, Text } from '@chakra-ui/react'

import ColorsControl from '~components/inspector/controls/ColorsControl'
import FormControl from '~components/inspector/controls/FormControl'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import TextControl from '~components/inspector/controls/TextControl'
import {
  getQRCodePayloadWarning,
  resolveQRCodeContentType,
} from '~forgeui/ForgeUIStandardQRCode'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const QRCodePanel = () => {
  const { setValueFromEvent } = useForm()
  const contentTypeValue = usePropsSelector('contentType')
  const contentType = resolveQRCodeContentType({
    contentType: contentTypeValue,
  })
  const qrText = usePropsSelector('qrText')
  const qrUrl = usePropsSelector('qrUrl')
  const qrWifiSSID = usePropsSelector('qrWifiSSID')
  const qrWifiPassword = usePropsSelector('qrWifiPassword')
  const qrWifiSecurity = usePropsSelector('qrWifiSecurity')
  const qrWifiHidden = usePropsSelector('qrWifiHidden')
  const qrEmailAddress = usePropsSelector('qrEmailAddress')
  const qrEmailSubject = usePropsSelector('qrEmailSubject')
  const qrEmailMessage = usePropsSelector('qrEmailMessage')
  const qrPhoneNumber = usePropsSelector('qrPhoneNumber')
  const qrSmsPhoneNumber = usePropsSelector('qrSmsPhoneNumber')
  const qrSmsMessage = usePropsSelector('qrSmsMessage')
  const warning = getQRCodePayloadWarning({
    contentType,
    qrText,
    qrUrl,
    qrWifiSSID,
    qrWifiPassword,
    qrWifiSecurity,
    qrWifiHidden,
    qrEmailAddress,
    qrEmailSubject,
    qrEmailMessage,
    qrPhoneNumber,
    qrSmsPhoneNumber,
    qrSmsMessage,
  })

  return (
    <>
      <FormControl htmlFor="contentType" label="Content Type">
        <Select
          id="contentType"
          name="contentType"
          size="sm"
          value={contentType}
          onChange={setValueFromEvent}
        >
          <option value="text">Plain Text</option>
          <option value="url">Website URL</option>
          <option value="wifi">Wi-Fi</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="sms">SMS</option>
          <option value="custom">Custom</option>
        </Select>
      </FormControl>

      {contentType === 'text' && <TextControl name="qrText" label="Text" />}
      {contentType === 'url' && <TextControl name="qrUrl" label="URL" />}
      {contentType === 'wifi' && (
        <>
          <TextControl name="qrWifiSSID" label="SSID" />
          <TextControl name="qrWifiPassword" label="Password" />
          <FormControl htmlFor="qrWifiSecurity" label="Security">
            <Select
              id="qrWifiSecurity"
              name="qrWifiSecurity"
              size="sm"
              value={qrWifiSecurity || 'WPA'}
              onChange={setValueFromEvent}
            >
              <option value="WPA">WPA</option>
              <option value="WEP">WEP</option>
              <option value="None">None</option>
            </Select>
          </FormControl>
          <SwitchControl
            name="qrWifiHidden"
            label="Hidden Network"
            defaultValue={false}
          />
        </>
      )}
      {contentType === 'email' && (
        <>
          <TextControl name="qrEmailAddress" label="Email Address" />
          <TextControl name="qrEmailSubject" label="Subject" />
          <TextControl name="qrEmailMessage" label="Message" />
        </>
      )}
      {contentType === 'phone' && (
        <TextControl name="qrPhoneNumber" label="Phone Number" />
      )}
      {contentType === 'sms' && (
        <>
          <TextControl name="qrSmsPhoneNumber" label="Phone Number" />
          <TextControl name="qrSmsMessage" label="Message" />
        </>
      )}
      {contentType === 'custom' && (
        <TextControl name="qrText" label="Raw Payload" />
      )}

      {warning && (
        <Text
          px={2}
          py={1}
          color="orange.300"
          fontSize="xs"
          data-testid="qrcode-payload-warning"
        >
          {warning}
        </Text>
      )}

      <ColorsControl name="qrForeground" label="Foreground Colour" withFullColor />
      <ColorsControl name="qrBackground" label="Background Colour" withFullColor />
    </>
  )
}

export default memo(QRCodePanel)
