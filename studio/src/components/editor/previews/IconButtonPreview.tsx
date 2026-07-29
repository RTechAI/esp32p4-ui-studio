import React from 'react'
import StandardIconButtonPreview from '~forgeui/preview/StandardIconButtonPreview'

interface Props {
  component: IComponent
}

const IconButtonPreview = ({ component }: Props) => {
  return <StandardIconButtonPreview component={component} mode="canvas" />
}

export default IconButtonPreview
