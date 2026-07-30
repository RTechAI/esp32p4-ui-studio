import {
  forgeUIWidgetDefinitions,
} from './widgets/ForgeUIWidgetRegistry'

// Compatibility projection for existing AI and validation callers.
// The WidgetDefinition registry is the authoritative source.
export const forgeuiCoreWidgets: ComponentType[] =
  forgeUIWidgetDefinitions.map(definition => definition.type)
