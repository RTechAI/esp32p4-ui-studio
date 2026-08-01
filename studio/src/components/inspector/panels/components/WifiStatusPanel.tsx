import React, { memo } from 'react'
import { Select } from '@chakra-ui/react'

import FormControl from '~components/inspector/controls/FormControl'
import SwitchControl from '~components/inspector/controls/SwitchControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const WifiStatusPanel = () => {
  const { setValueFromEvent } = useForm()
  const displayMode = usePropsSelector('displayMode') || 'icon-text'
  const previewState = usePropsSelector('previewState') || 'failed'

  return (
    <>
      <FormControl htmlFor="displayMode" label="Display">
        <Select id="displayMode" name="displayMode" size="sm" value={displayMode} onChange={setValueFromEvent}>
          <option value="icon-text">Icon and text</option>
          <option value="icon-only">Icon only</option>
          <option value="text-only">Text only</option>
        </Select>
      </FormControl>
      <FormControl htmlFor="previewState" label="Preview State">
        <Select id="previewState" name="previewState" size="sm" value={previewState} onChange={setValueFromEvent}>
          <option value="disabled">Disabled</option>
          <option value="starting">Starting</option>
          <option value="connecting">Connecting</option>
          <option value="connected">Connected</option>
          <option value="internet">Internet Available</option>
          <option value="failed">Failed</option>
        </Select>
      </FormControl>
      <SwitchControl name="showSignalStrength" label="Show Signal Strength" defaultValue={false} />
    </>
  )
}

export default memo(WifiStatusPanel)
