export const FORGEUI_STANDARD_BUTTON_MATRIX_DEFAULT_MAP = [
  'One',
  'Two',
  'Three',
  '\n',
  'Four',
  'Five',
  'Six',
]

export type ForgeUIStandardButtonMatrixButton = {
  index: number
  label: string
  selected: boolean
  checked: boolean
  disabled: boolean
}

export type ForgeUIStandardButtonMatrixModel = {
  mapTokens: string[]
  rows: ForgeUIStandardButtonMatrixButton[][]
  buttonLabels: string[]
  selectedIndex: number
  oneCheck: boolean
  disabledButtons: number[]
}

const integerProp = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback
}

export const getForgeUIStandardButtonMatrixModel = (
  props: Record<string, unknown>,
): ForgeUIStandardButtonMatrixModel => {
  const configuredMap = props.map ?? props.buttonMap ?? props.buttons
  let mapTokens: string[]

  if (
    Array.isArray(configuredMap) &&
    configuredMap.some(value => Array.isArray(value))
  ) {
    mapTokens = []
    configuredMap.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return
      row.forEach(value => mapTokens.push(String(value)))
      if (rowIndex < configuredMap.length - 1) mapTokens.push('\n')
    })
  } else if (Array.isArray(configuredMap)) {
    mapTokens = configuredMap.map(value => String(value))
  } else {
    mapTokens = [...FORGEUI_STANDARD_BUTTON_MATRIX_DEFAULT_MAP]
  }

  mapTokens = mapTokens.filter(token => token !== '')
  let buttonLabels = mapTokens.filter(token => token !== '\n')
  if (buttonLabels.length === 0) {
    mapTokens = [...FORGEUI_STANDARD_BUTTON_MATRIX_DEFAULT_MAP]
    buttonLabels = mapTokens.filter(token => token !== '\n')
  }

  const selectedIndex = Math.min(
    buttonLabels.length - 1,
    Math.max(
      0,
      integerProp(props.selectedIndex ?? props.checkedButton, 1),
    ),
  )
  const oneCheck = props.oneCheck === true
  const disabledButtons = Array.isArray(props.disabledButtons)
    ? Array.from(new Set<number>(
      props.disabledButtons
        .map(value => integerProp(value, -1))
        .filter(index => index >= 0 && index < buttonLabels.length),
    )).sort((left, right) => left - right)
    : []
  const disabled = new Set(disabledButtons)

  const rows: ForgeUIStandardButtonMatrixButton[][] = [[]]
  let buttonIndex = 0
  mapTokens.forEach(token => {
    if (token === '\n') {
      rows.push([])
      return
    }
    rows[rows.length - 1].push({
      index: buttonIndex,
      label: token,
      selected: buttonIndex === selectedIndex,
      checked: oneCheck && buttonIndex === selectedIndex,
      disabled: disabled.has(buttonIndex),
    })
    buttonIndex += 1
  })

  return {
    mapTokens,
    rows,
    buttonLabels,
    selectedIndex,
    oneCheck,
    disabledButtons,
  }
}
