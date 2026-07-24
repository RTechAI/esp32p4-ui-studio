import type { ForgeUIUploadedAsset } from './ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveAsset } from './interactive'
import { allocateUniqueOutputApiName } from './ForgeUIGeneratedApiNames'

export type ForgeUIExportDiagnosticCategory =
  | 'Interactive Button'
  | 'Interactive Light'
  | 'Interactive Status Indicator'
  | 'Interactive Toggle Switch'
  | 'Interactive Three-Position Toggle Switch'
  | 'Uploaded Assets'
  | 'Canvas'
  | 'Public API'
  | 'Asset Sources'

export type ForgeUIExportDiagnostic = {
  category: ForgeUIExportDiagnosticCategory
  subject: string
  message: string
}

export type ForgeUIExportValidationReport = {
  ok: boolean
  diagnostics: ForgeUIExportDiagnostic[]
  assetSources: string[]
}

type GeneratedExport = {
  code: string
  assetSources: string[]
  userEventHooks: string[]
  publicApiDeclarations: string[]
}

const toCIdentifier = (value: unknown, fallback: string) => {
  const cleaned = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
    .replace(/^[^a-zA-Z_]/, '_')

  return cleaned || fallback
}

const validDimension = (value: unknown) =>
  Number.isFinite(Number(value)) && Number(value) > 0

const validSymbol = (value: unknown) =>
  typeof value === 'string' && /^[A-Za-z_][A-Za-z0-9_]*$/.test(value)

const validSource = (value: unknown) =>
  typeof value === 'string' &&
  value.length > 0 &&
  value === value.replace(/\\/g, '/') &&
  !value.startsWith('/') &&
  !/^[A-Za-z]:/.test(value) &&
  !value.split('/').includes('..') &&
  value.endsWith('.c')

export const formatForgeUIExportValidationReport = (
  report: ForgeUIExportValidationReport,
) => {
  const grouped = new Map<string, ForgeUIExportDiagnostic[]>()

  report.diagnostics.forEach(diagnostic => {
    const entries = grouped.get(diagnostic.category) || []
    entries.push(diagnostic)
    grouped.set(diagnostic.category, entries)
  })

  return [
    'Export Validation Failed',
    ...Array.from(grouped.entries()).flatMap(([category, entries]) => [
      '',
      category,
      ...entries.map(entry =>
        `${entry.subject ? `\"${entry.subject}\": ` : ''}${entry.message}`,
      ),
    ]),
  ].join('\n')
}

export class ForgeUIExportValidationError extends Error {
  report: ForgeUIExportValidationReport

  constructor(report: ForgeUIExportValidationReport) {
    super(formatForgeUIExportValidationReport(report))
    this.name = 'ForgeUIExportValidationError'
    this.report = report
  }
}

export const validateForgeUIExport = (
  components: IComponents,
  interactiveAssets: ForgeUIInteractiveAsset[],
  uploadedAssets: ForgeUIUploadedAsset[],
  generated: GeneratedExport,
): ForgeUIExportValidationReport => {
  const diagnostics: ForgeUIExportDiagnostic[] = []
  const add = (
    category: ForgeUIExportDiagnosticCategory,
    subject: string,
    message: string,
  ) => diagnostics.push({ category, subject, message })
  const interactiveById = new Map(interactiveAssets.map(asset => [asset.id, asset]))
  const uploadedById = new Map(uploadedAssets.map(asset => [asset.id, asset]))
  const referencedImages: Array<{
    category:
      | 'Interactive Button'
      | 'Interactive Light'
      | 'Interactive Status Indicator'
      | 'Interactive Toggle Switch'
      | 'Interactive Three-Position Toggle Switch'
    subject: string
    state: string
    assetId: string
  }> = []
  const reachableInteractiveIds = new Set(
    Object.values(components)
      .filter(component =>
        component.type === 'InteractiveButton' ||
        component.type === 'InteractiveLight' ||
        component.type === 'InteractiveStatusIndicator' ||
        component.type === 'InteractiveToggleSwitch' ||
        component.type ===
          'InteractiveThreePositionToggleSwitch',
      )
      .map(component =>
        component.props.interactiveAssetId,
      )
      .filter(
        (id): id is string =>
          typeof id === 'string' && id.length > 0,
      ),
  )

  const validateImage = (
    category: 'Interactive Button' | 'Interactive Light' | 'Interactive Status Indicator' | 'Interactive Toggle Switch' | 'Interactive Three-Position Toggle Switch',
    subject: string,
    state: string,
    assetId: string | undefined,
  ) => {
    if (!assetId) {
      add(category, subject, `${state} image missing`)
      return
    }
    referencedImages.push({
      category,
      subject,
      state,
      assetId,
    })
    const uploaded = uploadedById.get(assetId)
    if (!uploaded) {
      add('Uploaded Assets', assetId, `Referenced by ${subject} but does not exist`)
      return
    }
    if (uploaded.exportStatus !== 'lvgl_ready') {
      add('Uploaded Assets', uploaded.name, 'LVGL conversion is not complete')
    }
    if (!validSource(uploaded.cFile)) {
      add('Uploaded Assets', uploaded.name, 'Generated C source is missing or invalid')
    }
    if (!validSymbol(uploaded.lvgl)) {
      add('Uploaded Assets', uploaded.name, 'LVGL symbol is missing or invalid')
    }
  }

  interactiveAssets
    .filter(asset =>
      reachableInteractiveIds.has(asset.id),
    )
    .forEach(asset => {
    const category = asset.kind === 'button'
      ? 'Interactive Button'
      : asset.kind === 'statusIndicator'
        ? 'Interactive Status Indicator'
        : asset.kind === 'toggleSwitch'
          ? 'Interactive Toggle Switch'
        : asset.kind === 'threePositionToggle'
          ? 'Interactive Three-Position Toggle Switch'
        : 'Interactive Light'
    const subject = asset.name || asset.id

    if (!validDimension(asset.width) || !validDimension(asset.height)) {
      add(category, subject, 'Width and height must be greater than zero')
    }
    if (asset.kind === 'button') {
      validateImage(category, subject, 'Normal', asset.normalAssetId)
      validateImage(category, subject, 'Pressed', asset.pressedAssetId)
    } else if (asset.kind === 'threePositionToggle') {
      validateImage(category, subject, 'LEFT', asset.leftAssetId)
      validateImage(category, subject, 'CENTER', asset.centerAssetId)
      validateImage(category, subject, 'RIGHT', asset.rightAssetId)
      if (!['left', 'center', 'right'].includes(asset.initialState)) add(category, subject, 'Initial state must be left, center, or right')
    } else {
      validateImage(category, subject, 'OFF', asset.offAssetId)
      validateImage(category, subject, 'ON', asset.onAssetId)
    }
  })

  const componentIds = new Set<string>()
  const hookNames = new Map<string, string>()
  const setterNames = new Map<string, string>()
  const binarySetterByComponent = new Map<IComponent, string>()
  const usedOutputApiNames = new Set<string>()

  Object.values(components)
    .filter(component =>
      component.type === 'InteractiveLight' ||
      component.type === 'InteractiveStatusIndicator',
    )
    .sort((left, right) => left.id.localeCompare(right.id))
    .forEach(component => {
      const assetId = component.props.interactiveAssetId
      const asset = typeof assetId === 'string'
        ? interactiveById.get(assetId)
        : undefined
      const expectedKind = component.type === 'InteractiveStatusIndicator'
        ? 'statusIndicator'
        : 'light'
      const outputAsset = asset?.kind === expectedKind ? asset : undefined
      const base = toCIdentifier(
        component.componentName ||
        outputAsset?.label ||
        outputAsset?.name ||
        component.id,
        component.type,
      )
        .replace(/WiFi/g, 'Wizfi')
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/Wizfi/g, 'WiFi')

      binarySetterByComponent.set(
        component,
        allocateUniqueOutputApiName(base, usedOutputApiNames),
      )
    })

  Object.values(components).forEach(component => {
    const componentSubject = component.componentName || component.type

    if (componentIds.has(component.id)) {
      add('Canvas', component.id, 'Duplicate component ID')
    }
    componentIds.add(component.id)

    // The self-parented root is the Canvas container, not an exported
    // Canvas component. Every component placed on that Canvas requires
    // usable dimensions.
    if (component.parent !== component.id) {
      ;(['w', 'h'] as const).forEach(dimension => {
        const value = component.props[dimension]
        if (!validDimension(value)) {
          const dimensionName = dimension === 'w' ? 'width' : 'height'
          add(
            'Canvas',
            `${componentSubject} (${component.id})`,
            `Component \"${componentSubject}\" (${component.id}) has an invalid ${dimensionName}: ${String(value)}`,
          )
        }
      })
    }

    if (
      component.type !== 'InteractiveButton' &&
      component.type !== 'InteractiveLight' &&
      component.type !== 'InteractiveStatusIndicator'
      && component.type !== 'InteractiveToggleSwitch'
      && component.type !== 'InteractiveThreePositionToggleSwitch'
    ) {
      return
    }
    const expectedKind = component.type === 'InteractiveButton'
      ? 'button'
      : component.type === 'InteractiveStatusIndicator'
        ? 'statusIndicator'
        : component.type === 'InteractiveToggleSwitch'
          ? 'toggleSwitch'
        : component.type === 'InteractiveThreePositionToggleSwitch'
          ? 'threePositionToggle'
        : 'light'
    const assetId = component.props.interactiveAssetId
    const asset = typeof assetId === 'string' ? interactiveById.get(assetId) : undefined
    const subject = component.componentName || component.id

    if (!assetId || !asset) {
      add('Canvas', subject, 'Interactive Asset reference no longer exists')
      return
    }
    if (asset.kind !== expectedKind) {
      add('Canvas', subject, `Interactive Asset kind must be ${expectedKind}`)
    }
    if (expectedKind === 'button' || expectedKind === 'toggleSwitch' || expectedKind === 'threePositionToggle') {
      const base = toCIdentifier(
        expectedKind === 'toggleSwitch' || expectedKind === 'threePositionToggle'
          ? component.componentName || ('label' in asset ? asset.label : component.id)
          : 'label' in asset ? asset.label : component.props.label,
        expectedKind === 'toggleSwitch' ? 'InteractiveToggleSwitch' : expectedKind === 'threePositionToggle' ? 'InteractiveThreePositionToggle' : 'InteractiveButton',
      )
      const name = `FG_On_${base}_${expectedKind === 'toggleSwitch' ? 'Toggled' : expectedKind === 'threePositionToggle' ? 'Changed' : 'Clicked'}`
      const previous = hookNames.get(name)
      if (previous) add('Public API', name, expectedKind === 'button'
        ? `Duplicate Button hook for ${previous} and ${subject}`
        : `Duplicate Toggle Switch hook for ${previous} and ${subject}`)
      else hookNames.set(name, subject)
    } else {
      const name = binarySetterByComponent.get(component)
      if (name) setterNames.set(name, subject)
    }
  })

  const publicApiDeclarations = new Set<string>()
  generated.publicApiDeclarations.forEach(declaration => {
    if (publicApiDeclarations.has(declaration)) {
      add('Public API', declaration, 'Duplicate final public API declaration')
    }
    publicApiDeclarations.add(declaration)
  })

  const symbols = new Map<string, string>()
  const runtimeUploadedIds = new Set(
    referencedImages.map(
      reference => reference.assetId,
    ),
  )
  const runtimeUploadedAssets =
    uploadedAssets.filter(asset =>
      runtimeUploadedIds.has(asset.id),
    )
  runtimeUploadedAssets.forEach(asset => {
    if (!asset.lvgl) return
    const previous = symbols.get(asset.lvgl)
    if (previous && previous !== asset.id) {
      add('Public API', asset.lvgl, 'Duplicate generated image symbol')
    } else symbols.set(asset.lvgl, asset.id)
  })

  const declarations = new Set<string>()
  Array.from(generated.code.matchAll(/LV_IMAGE_DECLARE\(([A-Za-z_][A-Za-z0-9_]*)\)/g))
    .forEach(match => {
      const symbol = match[1]
      if (declarations.has(symbol)) {
        add('Public API', symbol, 'Duplicate image declaration')
      }
      declarations.add(symbol)
    })

  const sourceSet = new Set<string>()
  generated.assetSources.forEach(source => {
    if (!validSource(source)) add('Asset Sources', source, 'Invalid relative C source path')
    if (sourceSet.has(source)) add('Asset Sources', source, 'Duplicate asset source')
    sourceSet.add(source)
    const asset = runtimeUploadedAssets.find(
      item => item.cFile === source,
    )
    if (asset && !generated.code.includes(asset.lvgl)) {
      add('Asset Sources', source, 'Source is not referenced by generated code')
    }
  })

  referencedImages.forEach(reference => {
    const asset = uploadedById.get(reference.assetId)
    if (asset?.cFile && !sourceSet.has(asset.cFile)) {
      add(
        'Asset Sources',
        `${reference.subject} ${reference.state}`,
        `Referenced image source is missing from export: ${asset.name} (${asset.cFile})`,
      )
    }
  })

  hookNames.forEach((_, name) => {
    if (!generated.userEventHooks.includes(name)) add('Public API', name, 'Input hook will not be generated')
  })
  setterNames.forEach((_, name) => {
    if (!generated.publicApiDeclarations.includes(`void ${name}(bool enabled);`)) {
      add('Public API', name, 'Light setter will not be generated')
    }
  })

  return { ok: diagnostics.length === 0, diagnostics, assetSources: [...sourceSet] }
}

export const assertForgeUIExportValid = (
  components: IComponents,
  interactiveAssets: ForgeUIInteractiveAsset[],
  uploadedAssets: ForgeUIUploadedAsset[],
  generated: GeneratedExport,
) => {
  const report = validateForgeUIExport(
    components,
    interactiveAssets,
    uploadedAssets,
    generated,
  )
  if (!report.ok) throw new ForgeUIExportValidationError(report)
  return { ...generated, assetSources: report.assetSources }
}
