import type { ForgeUIUploadedAsset } from './ForgeUIUploadedAssetRegistry'
import type { ForgeUIInteractiveAsset } from './interactive'

export type ForgeUIExportDiagnosticCategory =
  | 'Interactive Button'
  | 'Interactive Light'
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
  const referencedUploadedIds = new Set<string>()

  const validateImage = (
    category: 'Interactive Button' | 'Interactive Light',
    subject: string,
    state: string,
    assetId: string | undefined,
  ) => {
    if (!assetId) {
      add(category, subject, `${state} image missing`)
      return
    }
    referencedUploadedIds.add(assetId)
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

  interactiveAssets.forEach(asset => {
    const category = asset.kind === 'button'
      ? 'Interactive Button'
      : 'Interactive Light'
    const subject = asset.name || asset.id

    if (!validDimension(asset.width) || !validDimension(asset.height)) {
      add(category, subject, 'Width and height must be greater than zero')
    }
    if (asset.kind === 'button') {
      validateImage(category, subject, 'Normal', asset.normalAssetId)
      validateImage(category, subject, 'Pressed', asset.pressedAssetId)
    } else {
      validateImage(category, subject, 'OFF', asset.offAssetId)
      validateImage(category, subject, 'ON', asset.onAssetId)
    }
  })

  const componentIds = new Set<string>()
  const hookNames = new Map<string, string>()
  const setterNames = new Map<string, string>()

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

    if (component.type !== 'InteractiveButton' && component.type !== 'InteractiveLight') {
      return
    }
    const expectedKind = component.type === 'InteractiveButton' ? 'button' : 'light'
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
    if (expectedKind === 'button') {
      const base = toCIdentifier(
        'label' in asset ? asset.label : component.props.label,
        'InteractiveButton',
      )
      const name = `FG_On_${base}_Clicked`
      const previous = hookNames.get(name)
      if (previous) add('Public API', name, `Duplicate Button hook for ${previous} and ${subject}`)
      else hookNames.set(name, subject)
    } else {
      const base = toCIdentifier(
        component.componentName || ('label' in asset ? asset.label : '') || asset.name || component.id,
        'InteractiveLight',
      ).replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      const name = `FG_Set_${base}`
      const previous = setterNames.get(name)
      if (previous) add('Public API', name, `Duplicate Light setter for ${previous} and ${subject}`)
      else setterNames.set(name, subject)
    }
  })

  const symbols = new Map<string, string>()
  uploadedAssets.forEach(asset => {
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
    const asset = uploadedAssets.find(item => item.cFile === source)
    if (asset && !generated.code.includes(asset.lvgl)) {
      add('Asset Sources', source, 'Source is not referenced by generated code')
    }
  })

  referencedUploadedIds.forEach(id => {
    const asset = uploadedById.get(id)
    if (asset?.cFile && !sourceSet.has(asset.cFile)) {
      add('Asset Sources', asset.cFile, 'Referenced image source is missing from export')
    }
  })

  hookNames.forEach((_, name) => {
    if (!generated.userEventHooks.includes(name)) add('Public API', name, 'Button hook will not be generated')
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
