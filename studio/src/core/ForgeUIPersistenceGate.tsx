import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const ForgeUIPersistenceGate = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const ready = useSelector(
    (state: any) => state.components?._persist?.rehydrated === true,
  )
  const components = useSelector(
    (state: any) => state.components?.present?.components,
  )

  useEffect(() => {
    if (!ready || !components) return
    const keys = Object.keys(components)
    console.info('[ForgeUI Persistence Identity] rehydrated', {
      keys,
      embeddedIds: keys.map(key => components[key]?.id),
      persisted: localStorage.getItem('persist:forgeui_studio_v1'),
    })
  }, [ready, components])

  return ready ? <>{children}</> : null
}
