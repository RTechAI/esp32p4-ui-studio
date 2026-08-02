/**
 * Restores the persisted component-map invariant without inventing another
 * identity. Component keys are the references stored by parents and children;
 * the embedded IComponent.id must match that persisted key.
 */
export const normalizePersistedComponentIdentities = (
  components: IComponents,
): IComponents => {
  let normalized = components

  Object.entries(components).forEach(([persistedId, component]) => {
    if (component.id === persistedId) return
    if (normalized === components) normalized = { ...components }
    normalized[persistedId] = { ...component, id: persistedId }
  })

  return normalized
}

export const migratePersistedComponentState = async (state: any) => {
  const present = state?.present
  if (!present?.components) return state

  const components = normalizePersistedComponentIdentities(present.components)
  if (components === present.components) return state

  return {
    ...state,
    present: { ...present, components },
  }
}
