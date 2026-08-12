import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useInspectorUpdate } from '~contexts/inspector-context'
import { RootState } from '~core/store'
import { getDefaultFormProps } from '~utils/defaultProps'

/** Select several inspector properties with one stable hook invocation. */
export const useSelectedComponentProps = (
  propertyNames: readonly string[],
): Record<string, any> => {
  const { addActiveProps } = useInspectorUpdate()
  const propertyKey = propertyNames.join('\u0000')

  useEffect(() => {
    propertyKey.split('\u0000').forEach(addActiveProps)
  }, [addActiveProps, propertyKey])

  return useSelector((state: RootState) => {
    const selected = state.components.present
      .components[state.components.present.selectedId]
    const defaults = getDefaultFormProps(selected.type)
    return Object.fromEntries(propertyNames.map(name => [
      name,
      selected.props[name] !== undefined
        ? selected.props[name]
        : defaults[name] !== undefined
          ? defaults[name]
          : '',
    ]))
  })
}
