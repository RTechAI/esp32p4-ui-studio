export const allocateUniqueOutputApiName = (
  requestedBaseName: string,
  usedNames: Set<string>,
): string => {
  const requestedName = `FG_Set_${requestedBaseName}`
  let allocatedName = requestedName
  let suffix = 2

  while (usedNames.has(allocatedName)) {
    allocatedName = `${requestedName}_${suffix}`
    suffix++
  }

  usedNames.add(allocatedName)
  return allocatedName
}
