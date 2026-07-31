import React from 'react'
import StandardSpinboxPreview from '~forgeui/preview/StandardSpinboxPreview'
import useDispatch from '~hooks/useDispatch'

const SpinboxPreview: React.FC<IPreviewProps> = ({ component }) => {
  const dispatch = useDispatch()

  return (
    <StandardSpinboxPreview
      mode="canvas"
      props={component.props}
      onValueChange={value => {
        dispatch.components.updateProps({
          id: component.id,
          name: 'value',
          value,
        })
      }}
    />
  )
}

export default SpinboxPreview
