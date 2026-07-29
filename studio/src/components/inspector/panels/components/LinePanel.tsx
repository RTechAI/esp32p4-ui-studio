import React, { memo } from 'react'
import {
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'

import FormControl from '~components/inspector/controls/FormControl'
import NumberControl from '~components/inspector/controls/NumberControl'
import { forgeuiInputStyle } from '~forgeui/ForgeUIControlStyle'
import useDispatch from '~hooks/useDispatch'
import { getSelectedComponent } from '~core/selectors/components'
import {
  fitForgeUIStandardLineEndpoints,
  getForgeUIStandardLineGeometry,
} from '~forgeui/ForgeUIStandardLine'

type EndpointProperty = 'startX' | 'startY' | 'endX' | 'endY'

const EndpointControl = ({
  name,
  label,
}: {
  name: EndpointProperty
  label: string
}) => {
  const component = useSelector(getSelectedComponent)
  const dispatch = useDispatch()
  const geometry = getForgeUIStandardLineGeometry(component.props)

  const update = (rawValue: React.ReactText) => {
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed)) return
    const start = {
      x: name === 'startX' ? parsed : geometry.startX,
      y: name === 'startY' ? parsed : geometry.startY,
    }
    const end = {
      x: name === 'endX' ? parsed : geometry.endX,
      y: name === 'endY' ? parsed : geometry.endY,
    }
    const fitted = fitForgeUIStandardLineEndpoints({ start, end })
    const next = {
      x: geometry.x + fitted.offsetX,
      y: geometry.y + fitted.offsetY,
      w: fitted.w,
      h: fitted.h,
      startX: fitted.startX,
      startY: fitted.startY,
      endX: fitted.endX,
      endY: fitted.endY,
    }

    Object.entries(next).forEach(([property, value]) => {
      dispatch.components.updateProps({
        id: component.id,
        name: property,
        value: String(Math.round(value)),
      })
    })
  }

  return (
    <FormControl htmlFor={name} label={label}>
      <NumberInput
        size="sm"
        value={geometry[name]}
        precision={0}
        onChange={update}
        {...forgeuiInputStyle}
      >
        <NumberInputField id={name} {...forgeuiInputStyle} />
      </NumberInput>
    </FormControl>
  )
}

const LinePanel = () => (
  <>
    <EndpointControl name="startX" label="Start X" />
    <EndpointControl name="startY" label="Start Y" />
    <EndpointControl name="endX" label="End X" />
    <EndpointControl name="endY" label="End Y" />
    <NumberControl name="lineWidth" label="Line Width" min={1} precision={0} />
  </>
)

export default memo(LinePanel)
