import { forgeUIGetUploadedAssets } from './ForgeUIUploadedAssetRegistry'
import { FORGEUI_IMAGE_ASSETS } from './ForgeUIAssetRegistry'

import {
  getInteractiveButtonAsset,
  isLvglReadyUploadedAsset,
  resolveInteractiveButtonVisuals,
} from './interactive'

import {
  FG_PREVIEW_PALETTES,
  type ForgeThemeId,
} from './preview/forgeThemeMap'

const toLvHex = (
  value: string,
  fallback = '0x000000',
) => {
  if (!value) return fallback

  return `0x${String(value)
    .replace('#', '')
    .toUpperCase()}`
}

const FG_TEXTURE_ASSETS: Record<
  string,
  {
    symbol: string
    source: string
  }
> = {
  carbon_fiber: {
    symbol: 'fg_upload_carbon_fiber_be774fd2',
    source: 'assets/uploads/fg_upload_carbon_fiber_be774fd2.c',
  },

  brushed_steel: {
    symbol: 'fg_upload_brushed_steel_bc48e90c',
    source: 'assets/uploads/fg_upload_brushed_steel_bc48e90c.c',
  },

  hex_mesh: {
    symbol: 'fg_upload_hex_mesh_e46ed0b5',
    source: 'assets/uploads/fg_upload_hex_mesh_e46ed0b5.c',
  },

  dark_noise: {
    symbol: 'fg_upload_dark_noise_08fcab09',
    source: 'assets/uploads/fg_upload_dark_noise_08fcab09.c',
  },

  industrial_panel: {
    symbol: 'fg_upload_industrial_panel_8775311d',
    source: 'assets/uploads/fg_upload_industrial_panel_8775311d.c',
  },

  blueprint_grid: {
    symbol: 'fg_upload_blueprint_grid_71595117',
    source: 'assets/uploads/fg_upload_blueprint_grid_71595117.c',
  },
  ai_mesh: {
    symbol: 'fg_upload_1024x600_ai_mesh_9f3f1b39',
    source: 'assets/uploads/fg_upload_1024x600_ai_mesh_9f3f1b39.c',
  },

  ai_nexus: {
    symbol: 'fg_upload_1024x600_ai_nexus_88b196e9',
    source: 'assets/uploads/fg_upload_1024x600_ai_nexus_88b196e9.c',
  },

  creation: {
    symbol: 'fg_upload_1024x600_creation_786cf05c',
    source: 'assets/uploads/fg_upload_1024x600_creation_786cf05c.c',
  },

  nebula_core: {
    symbol: 'fg_upload_1024x600_nebula_core_0ddf52d1',
    source: 'assets/uploads/fg_upload_1024x600_nebula_core_0ddf52d1.c',
  },

  neon_horizon: {
    symbol: 'fg_upload_1024x600_neon_horizon_6dae04db',
    source: 'assets/uploads/fg_upload_1024x600_neon_horizon_6dae04db.c',
  },

  neural_core: {
    symbol: 'fg_upload_1024x600_neural_core_67dd4ba0',
    source: 'assets/uploads/fg_upload_1024x600_neural_core_67dd4ba0.c',
  },

  quantum_flow: {
    symbol: 'fg_upload_1024x600_quantum_flow_4ffa7dbc',
    source: 'assets/uploads/fg_upload_1024x600_quantum_flow_4ffa7dbc.c',
  },

  quantum_hex: {
    symbol: 'fg_upload_1024x600_quantum_hex_98c7da6c',
    source: 'assets/uploads/fg_upload_1024x600_quantum_hex_98c7da6c.c',
  },

}

const FG_ICON_LVGL_SYMBOLS: Record<string, string> = {
  FiWifi: 'LV_SYMBOL_WIFI',
  FiSettings: 'LV_SYMBOL_SETTINGS',
  FiPower: 'LV_SYMBOL_POWER',
  FiHome: 'LV_SYMBOL_HOME',
  FiMenu: 'LV_SYMBOL_LIST',
  FiSearch: 'LV_SYMBOL_SEARCH',
  FiBattery: 'LV_SYMBOL_BATTERY_FULL',
  FiBluetooth: 'LV_SYMBOL_BLUETOOTH',

  FiCheck: 'LV_SYMBOL_OK',
  FiX: 'LV_SYMBOL_CLOSE',
  FiAlertTriangle: 'LV_SYMBOL_WARNING',
  FiTrash2: 'LV_SYMBOL_TRASH',
  FiDownload: 'LV_SYMBOL_DOWNLOAD',
  FiUpload: 'LV_SYMBOL_UPLOAD',
}

const lv = (v: any, d: any = 0) =>
  v !== undefined && v !== null && v !== '' ? v : d

const esc = (v: string = '') =>
  String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')

const toCIdentifier = (
  value: string,
  fallback = 'InteractiveButton',
) => {
  const cleaned = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(part =>
      part.charAt(0).toUpperCase() +
      part.slice(1),
    )
    .join('')
    .replace(/^[^a-zA-Z_]/, '_')

  return cleaned || fallback
}

const createUniqueHookName = (
  baseName: string,
  usedHookNames: Set<string>,
) => {
  let hookName = `FG_On_${baseName}_Clicked`
  let suffix = 2

  while (usedHookNames.has(hookName)) {
    hookName =
      `FG_On_${baseName}_${suffix}_Clicked`

    suffix++
  }

  usedHookNames.add(hookName)

  return hookName
}

const buildLvglBlock = (
  component: IComponent,
  components: IComponents,
  parentVar: string,
  lines: string[],
  counter: { value: number },
    palette: any,
  usedAssetSources: Set<string>,
  usedHookNames: Set<string>,
  userEventHooks: Set<string>,
) => {
  ;(component.children || []).forEach((key: string) => {
    const child = components[key]
    if (!child) return

    counter.value++
    const varName = `obj${counter.value}`

    const x = lv(child.props.x, 0)
    const y = lv(child.props.y, 0)
    const w = lv(child.props.w, 120)
    const h = lv(child.props.h, 40)

    switch (child.type) {
      case 'Text': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.value ||
            'Text'
        )



        const color = child.props.color
          ? `0x${String(child.props.color).replace('#', '')}`
          : palette.text

        const fontSize = lv(child.props.fontSize, 24)

        lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
        lines.push(`lv_label_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
        lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${fontSize}, 0);`)
        lines.push(``)
        break
      }

      case 'Heading': {
  const text = esc(
    child.props.children ||
    child.props.text ||
    child.props.value ||
    'Heading'
  )

    const color = child.props.color
    ? `0x${String(child.props.color).replace('#', '')}`
    : palette.text

  lines.push(`lv_obj_t * ${varName} = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`)
  lines.push(`lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_32, 0);`)
  lines.push(``)
  break
}

case 'Clock': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.value ||
      '12:34'
  )

  lines.push(`fg_clock_label = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(fg_clock_label, "${text}");`)
  lines.push(`lv_obj_set_pos(fg_clock_label, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(fg_clock_label, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(fg_clock_label, lv_color_hex(0x00D4FF), 0);`)
  lines.push(`lv_obj_set_style_text_font(fg_clock_label, &lv_font_montserrat_32, 0);`)
  lines.push(``)
  break
}

case 'WiFi': {
  lines.push(`fg_wifi_label = lv_label_create(${parentVar});`)
  lines.push(`lv_label_set_text(fg_wifi_label, "WIFI\\nDISCONNECTED\\nIP: -");`)
  lines.push(`lv_obj_set_pos(fg_wifi_label, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(fg_wifi_label, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_text_color(fg_wifi_label, lv_color_hex(0x00D4FF), 0);`)
  lines.push(`lv_obj_set_style_text_font(fg_wifi_label, &lv_font_montserrat_20, 0);`)
  lines.push(`lv_label_set_long_mode(fg_wifi_label, LV_LABEL_LONG_WRAP);`)
  lines.push(``)
  break
}
      
            case 'Button': {
        const text = esc(
          child.props.children ||
            child.props.text ||
            child.props.label ||
            'Button'
        )

        lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

        lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
        lines.push(`lv_label_set_text(${varName}_label, "${text}");`)
        lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_center(${varName}_label);`)
        lines.push(``)
        break
      }

case 'InteractiveButton': {
  const interactiveAssetId =
    child.props.interactiveAssetId

  const interactiveAsset =
    interactiveAssetId
      ? getInteractiveButtonAsset(
          interactiveAssetId,
        )
      : undefined
        const buttonBaseName =
    toCIdentifier(
      interactiveAsset?.label ||
      child.props.label ||
      child.props.name ||
      varName,
    )

  const clickedHookName =
    createUniqueHookName(
      buttonBaseName,
      usedHookNames,
    )

  userEventHooks.add(clickedHookName)

  const uploadedAssets =
    forgeUIGetUploadedAssets()

  const {
    normalAsset,
    pressedAsset,
  } = resolveInteractiveButtonVisuals(
    interactiveAsset,
    uploadedAssets,
  )

  const normalReady =
    isLvglReadyUploadedAsset(normalAsset)

  const pressedReady =
    isLvglReadyUploadedAsset(pressedAsset)

  if (
    normalReady &&
    pressedReady
  ) {
    const normalSymbol =
      normalAsset.lvgl

    const pressedSymbol =
      pressedAsset.lvgl

    if (normalAsset.cFile) {
      usedAssetSources.add(
        normalAsset.cFile,
      )
    }

    if (pressedAsset.cFile) {
      usedAssetSources.add(
        pressedAsset.cFile,
      )
    }

    lines.push(
      `LV_IMAGE_DECLARE(${normalSymbol});`,
    )

    if (
      pressedSymbol !== normalSymbol
    ) {
      lines.push(
        `LV_IMAGE_DECLARE(${pressedSymbol});`,
      )
    }

    lines.push(
      `lv_obj_t * ${varName} = lv_button_create(${parentVar});`,
    )

    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )

    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )

    lines.push(
      `lv_obj_set_style_radius(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_border_width(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_pad_all(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_bg_opa(${varName}, LV_OPA_TRANSP, LV_PART_MAIN);`,
    )

    lines.push(
      `lv_obj_set_style_shadow_width(${varName}, 0, LV_PART_MAIN);`,
    )

    lines.push(
  `lv_obj_t * ${varName}_img = lv_image_create(${varName});`,
)

lines.push(
  `lv_image_set_src(${varName}_img, &${normalSymbol});`,
)

lines.push(
   `lv_image_set_scale(${varName}_img, 256);`,
)

lines.push(
  `lv_obj_center(${varName}_img);`,
)

lines.push(
  `lv_obj_clear_flag(${varName}_img, LV_OBJ_FLAG_CLICKABLE);`,
)

lines.push(
  `lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`,
)

lines.push(
  `static fg_interactive_button_data_t ${varName}_data = {`,
)

lines.push(
  `    .normal_src = &${normalSymbol},`,
)

lines.push(
  `    .pressed_src = &${pressedSymbol},`,
)

lines.push(
  `    .clicked_cb = ${clickedHookName},`,
)

lines.push(
  `    .event_name = "${clickedHookName}",`,
)

lines.push(
  `};`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_PRESSED, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_RELEASED, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_PRESS_LOST, &${varName}_data);`,
)

lines.push(
  `lv_obj_add_event_cb(${varName}, fg_interactive_button_event_cb, LV_EVENT_CLICKED, &${varName}_data);`,
)

} else {
  const label = esc(
    interactiveAsset?.label ||
      'Interactive Button',
  )
    lines.push(
      `lv_obj_t * ${varName} = lv_button_create(${parentVar});`,
    )

    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )

    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )

    lines.push(
      `lv_obj_set_style_radius(${varName}, 12, 0);`,
    )

    lines.push(
      `lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_border_width(${varName}, 2, 0);`,
    )

    lines.push(
      `lv_obj_t * ${varName}_label = lv_label_create(${varName});`,
    )

    lines.push(
      `lv_label_set_text(${varName}_label, "${label}\\nMissing Interactive Assets");`,
    )

    lines.push(
      `lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`,
    )

    lines.push(
      `lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`,
    )

    lines.push(
      `lv_obj_center(${varName}_label);`,
    )
  }

  lines.push(``)
  break
}

      case 'IconButton': {
  lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

  lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_label, LV_SYMBOL_OK);`)
  lines.push(`lv_obj_center(${varName}_label);`)

  lines.push(``)
  break
}

case 'Icon': {
  console.log('LVGL ICON EXPORT DEBUG', {
    id: child.id,
    icon: child.props.icon,
    iconName: child.props.iconName,
    props: child.props,
  })

  const src =
    child.props.src ||
    child.props.browserSrc ||
    ''

  const uploadedAssets = forgeUIGetUploadedAssets()

  const uploadedAsset = uploadedAssets.find(
    (asset: any) =>
      asset.id === child.props.uploadedAssetId ||
      asset.browserSrc === src ||
      asset.name === child.props.assetName,
  )
  if (
    uploadedAsset?.exportStatus === 'lvgl_ready' &&
    uploadedAsset?.lvgl
  ) {
    const symbol = uploadedAsset.lvgl
    const cFile = uploadedAsset.cFile

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(
      child.props.imageScale || 256,
    )
console.log('EXPORT ICON', {
  assetName: uploadedAsset?.name,
  lvgl: uploadedAsset?.lvgl,
  cFile: uploadedAsset?.cFile,
})

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(
      `lv_obj_t * ${varName} = lv_image_create(${parentVar});`,
    )
    lines.push(
      `lv_image_set_src(${varName}, &${symbol});`,
    )
    lines.push(
      `lv_image_set_scale(${varName}, ${imageScale});`,
    )
    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_size(${varName}, ${w}, ${h});`,
    )
  } else {
    const icon =
      child.props.icon ||
      'FiSettings'

    const symbol =
      FG_ICON_LVGL_SYMBOLS[icon] ||
      'LV_SYMBOL_SETTINGS'

    const color = child.props.color
      ? `0x${String(child.props.color).replace('#', '')}`
      : palette.text

    const iconSize = lv(
      child.props.boxSize,
      48,
    )

    lines.push(
      `lv_obj_t * ${varName} = lv_label_create(${parentVar});`,
    )
    lines.push(
      `lv_label_set_text(${varName}, ${symbol});`,
    )
    lines.push(
      `lv_obj_set_pos(${varName}, ${x}, ${y});`,
    )
    lines.push(
      `lv_obj_set_style_text_color(${varName}, lv_color_hex(${color}), 0);`,
    )
    lines.push(
      `lv_obj_set_style_text_font(${varName}, &lv_font_montserrat_${iconSize}, 0);`,
    )
  }

  lines.push(``)
  break
}

            case 'Input': {
        const text = esc(child.props.placeholder || child.props.value || 'Input')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Textarea': {
        const text = esc(child.props.placeholder || child.props.value || 'Textarea')

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_placeholder_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }
      
      case 'Switch': {
  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_switch_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

      case 'Checkbox': {
  const text = esc(
    child.props.children ||
      child.props.text ||
      child.props.label ||
      'Checkbox'
  )

  const checked = Boolean(child.props.isChecked)

  lines.push(`lv_obj_t * ${varName} = lv_checkbox_create(${parentVar});`)
  lines.push(`lv_checkbox_set_text(${varName}, "${text}");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  if (checked) {
    lines.push(`lv_obj_add_state(${varName}, LV_STATE_CHECKED);`)
  }

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.accent}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_INDICATOR | LV_STATE_CHECKED);`)
  lines.push(``)
  break
}

  
        
      case 'NumberInput': {
        const text = esc(String(child.props.value || '123'))

        lines.push(`lv_obj_t * ${varName} = lv_textarea_create(${parentVar});`)
        lines.push(`lv_textarea_set_one_line(${varName}, true);`)
        lines.push(`lv_textarea_set_text(${varName}, "${text}");`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(``)
        break
      }

      case 'Select': {
  lines.push(`lv_obj_t * ${varName} = lv_dropdown_create(${parentVar});`)
  lines.push(`lv_dropdown_set_options(${varName}, "Option 1\\nOption 2\\nOption 3");`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), 0);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

  lines.push(``)
  break
}

case 'Image': {
  const src = child.props.src || ''
  const uploadedAssets = forgeUIGetUploadedAssets()

  console.log('LVGL EXPORT IMAGE DEBUG', {
  src,
  alt: child.props.alt,
  assetName: child.props.assetName,
  uploadedAssets,
})

  const presetAsset = FORGEUI_IMAGE_ASSETS.find(
    (a: any) => a.src === src
  )

  const uploadedAsset = uploadedAssets.find((a: any) =>
  a.id === child.props.uploadedAssetId ||
  a.browserSrc === src ||
  a.browserSrc === child.props.src ||
  a.name === child.props.assetName ||
  a.name === child.props.alt
)

  const asset: any = presetAsset || uploadedAsset

  if (asset?.lvgl || asset?.symbolName) {
    const symbol = asset.lvgl || asset.symbolName
    const cFile = asset.cFile || asset.assetSource

    if (cFile) {
      usedAssetSources.add(cFile)
    }

    const imageScale = Number(child.props.imageScale || 256)

    lines.push(`LV_IMAGE_DECLARE(${symbol});`)
    lines.push(`lv_obj_t * ${varName} = lv_image_create(${parentVar});`)
    lines.push(`lv_image_set_src(${varName}, &${symbol});`)
    lines.push(`lv_image_set_scale(${varName}, ${imageScale});`)
  } else {
    const uploadName = esc(
      child.props.alt ||
      child.props.assetName ||
      'Uploaded Asset'
    )

    lines.push(`lv_obj_t * ${varName} = lv_button_create(${parentVar});`)
    lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
    lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, 0);`)
    lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
    lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)

    lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
    lines.push(`lv_label_set_text(${varName}_label, "${uploadName}\\nPending LVGL Export");`)
    lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), 0);`)
    lines.push(`lv_obj_set_style_text_align(${varName}_label, LV_TEXT_ALIGN_CENTER, 0);`)
    lines.push(`lv_obj_center(${varName}_label);`)
  }

  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_add_flag(${varName}, LV_OBJ_FLAG_CLICKABLE);`)
  lines.push(`lv_obj_set_style_transform_pivot_x(${varName}, ${Math.floor(w / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_pivot_y(${varName}, ${Math.floor(h / 2)}, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 256, 0);`)
  lines.push(`lv_obj_set_style_transform_scale(${varName}, 235, LV_STATE_PRESSED);`)

  lines.push(``)
  break
}
    
case 'Slider': {
  lines.push(`lv_obj_t * ${varName} = lv_slider_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_slider_set_value(${varName}, ${lv(child.props.value, 50)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.text}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

case 'Progress': {
  lines.push(`lv_obj_t * ${varName} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${varName}, 0, 100);`)
  lines.push(`lv_bar_set_value(${varName}, ${lv(child.props.value, 65)}, LV_ANIM_OFF);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(``)
  break
}

case 'CircularProgress': {
  lines.push(`lv_obj_t * ${varName} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${varName}, 0, 100);`)
  lines.push(`lv_arc_set_value(${varName}, ${lv(child.props.value, 65)});`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_arc_color(${varName}, lv_color_hex(${palette.border}), LV_PART_INDICATOR);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_KNOB);`)
  lines.push(``)
  break
}

case 'Led': {
  const size = Math.min(Number(w), Number(h), 48)

  lines.push(`lv_obj_t * ${varName} = lv_led_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${size}, ${size});`)
  lines.push(`lv_led_set_color(${varName}, lv_palette_main(LV_PALETTE_GREEN));`)
  lines.push(`lv_led_set_brightness(${varName}, 255);`)
  lines.push(`lv_led_on(${varName});`)
  lines.push(``)
  break
}

case 'Bar': {
  lines.push(`lv_obj_t * ${varName} = lv_bar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_bar_set_range(${varName}, 0, 100);`)
  lines.push(`lv_bar_set_value(${varName}, 70, LV_ANIM_OFF);`)
  lines.push(``)
  break
}

case 'Arc': {
  lines.push(`lv_obj_t * ${varName} = lv_arc_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_arc_set_range(${varName}, 0, 100);`)
  lines.push(`lv_arc_set_value(${varName}, 65);`)
  lines.push(``)
  break
}

case 'Roller': {
  lines.push(`lv_obj_t * ${varName} = lv_roller_create(${parentVar});`)
  lines.push(`lv_roller_set_options(${varName}, "One\\nTwo\\nThree\\nFour", LV_ROLLER_MODE_NORMAL);`)
  lines.push(`lv_roller_set_visible_row_count(${varName}, 3);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_SELECTED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_SELECTED);`)
  lines.push(``)
  break
}

case 'Canvas': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Line': {
  lines.push(`static lv_point_precise_t ${varName}_pts[] = {`)
  lines.push(`  {0, 0},`)
  lines.push(`  {${w}, ${h}}`)
  lines.push(`};`)

  lines.push(`lv_obj_t * ${varName} = lv_line_create(${parentVar});`)
  lines.push(`lv_line_set_points(${varName}, ${varName}_pts, 2);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_line_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_line_width(${varName}, 3, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Tabview': {
  lines.push(`lv_obj_t * ${varName} = lv_tabview_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_tab1 = lv_tabview_add_tab(${varName}, "Tab 1");`)
  lines.push(`lv_obj_t * ${varName}_tab2 = lv_tabview_add_tab(${varName}, "Tab 2");`)
  lines.push(`lv_obj_t * ${varName}_tab3 = lv_tabview_add_tab(${varName}, "Tab 3");`)

  lines.push(`lv_obj_set_style_bg_color(${varName}_tab1, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_tab2, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_color(${varName}_tab3, lv_color_hex(${palette.surface2}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tab1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tab 1 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl1, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl1);`)

  lines.push(`lv_obj_t * ${varName}_lbl2 = lv_label_create(${varName}_tab2);`)
  lines.push(`lv_label_set_text(${varName}_lbl2, "Tab 2 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl2, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl2);`)

  lines.push(`lv_obj_t * ${varName}_lbl3 = lv_label_create(${varName}_tab3);`)
  lines.push(`lv_label_set_text(${varName}_lbl3, "Tab 3 content");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl3, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl3);`)

  lines.push(``)
  break
}

case 'Tileview': {
  lines.push(`lv_obj_t * ${varName} = lv_tileview_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_tile1 = lv_tileview_add_tile(${varName}, 0, 0, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile2 = lv_tileview_add_tile(${varName}, 1, 0, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile3 = lv_tileview_add_tile(${varName}, 0, 1, LV_DIR_ALL);`)
  lines.push(`lv_obj_t * ${varName}_tile4 = lv_tileview_add_tile(${varName}, 1, 1, LV_DIR_ALL);`)

  ;[1, 2, 3, 4].forEach((n) => {
    lines.push(`lv_obj_set_style_bg_color(${varName}_tile${n}, lv_color_hex(${n === 1 ? palette.border : palette.surface2}), LV_PART_MAIN);`)
    lines.push(`lv_obj_set_style_bg_opa(${varName}_tile${n}, LV_OPA_COVER, LV_PART_MAIN);`)
    lines.push(`lv_obj_clear_flag(${varName}_tile${n}, LV_OBJ_FLAG_SCROLLABLE);`)
  })

  lines.push(`lv_obj_t * ${varName}_lbl1 = lv_label_create(${varName}_tile1);`)
  lines.push(`lv_label_set_text(${varName}_lbl1, "Tile 1");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl1, lv_color_hex(${palette.bg}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl1);`)

  lines.push(`lv_obj_t * ${varName}_lbl2 = lv_label_create(${varName}_tile2);`)
  lines.push(`lv_label_set_text(${varName}_lbl2, "Tile 2");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl2, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl2);`)

  lines.push(`lv_obj_t * ${varName}_lbl3 = lv_label_create(${varName}_tile3);`)
  lines.push(`lv_label_set_text(${varName}_lbl3, "Tile 3");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl3, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl3);`)

  lines.push(`lv_obj_t * ${varName}_lbl4 = lv_label_create(${varName}_tile4);`)
  lines.push(`lv_label_set_text(${varName}_lbl4, "Tile 4");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_lbl4, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_lbl4);`)

  lines.push(``)
  break
}

case 'AnimImage': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)

  lines.push(`lv_obj_t * ${varName}_label = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_label, "AnimImage");`)
  lines.push(`lv_obj_set_style_text_color(${varName}_label, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_center(${varName}_label);`)

  lines.push(``)
  break
}


case 'ButtonMatrix': {
  lines.push(`static const char * ${varName}_map[] = {"One", "Two", "Three", "\\n", "Four", "Five", "Six", ""};`)

  lines.push(`lv_obj_t * ${varName} = lv_buttonmatrix_create(${parentVar});`)
  lines.push(`lv_buttonmatrix_set_map(${varName}, ${varName}_map);`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 8, LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS | LV_STATE_CHECKED);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.bg}), LV_PART_ITEMS | LV_STATE_CHECKED);`)

  lines.push(`lv_buttonmatrix_set_selected_button(${varName}, 1);`)

  lines.push(``)
  break
}

case 'Msgbox': {
  lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_radius(${varName}, 6, LV_PART_MAIN);`)
  lines.push(`lv_obj_clear_flag(${varName}, LV_OBJ_FLAG_SCROLLABLE);`)

  lines.push(``)

  lines.push(`lv_obj_t * ${varName}_title = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_title, "Message");`)
  lines.push(`lv_obj_align(${varName}_title, LV_ALIGN_TOP_LEFT, 10, 8);`)

  lines.push(`lv_obj_t * ${varName}_text = lv_label_create(${varName});`)
  lines.push(`lv_label_set_text(${varName}_text, "Example message text");`)
  lines.push(`lv_obj_set_width(${varName}_text, ${Math.max(80, w - 20)});`)
  lines.push(`lv_label_set_long_mode(${varName}_text, LV_LABEL_LONG_WRAP);`)
  lines.push(`lv_obj_align(${varName}_text, LV_ALIGN_TOP_LEFT, 10, 30);`)

  lines.push(`lv_obj_t * ${varName}_ok = lv_button_create(${varName});`)
  lines.push(`lv_obj_set_size(${varName}_ok, 56, 26);`)
  lines.push(`lv_obj_align(${varName}_ok, LV_ALIGN_BOTTOM_RIGHT, -74, -4);`)

  lines.push(`lv_obj_t * ${varName}_ok_lbl = lv_label_create(${varName}_ok);`)
  lines.push(`lv_label_set_text(${varName}_ok_lbl, "OK");`)
  lines.push(`lv_obj_center(${varName}_ok_lbl);`)

  lines.push(`lv_obj_t * ${varName}_cancel = lv_button_create(${varName});`)
  lines.push(`lv_obj_set_size(${varName}_cancel, 64, 26);`)
  lines.push(`lv_obj_align(${varName}_cancel, LV_ALIGN_BOTTOM_RIGHT, -4, -4);`)

  lines.push(`lv_obj_t * ${varName}_cancel_lbl = lv_label_create(${varName}_cancel);`)
  lines.push(`lv_label_set_text(${varName}_cancel_lbl, "Cancel");`)
  lines.push(`lv_obj_center(${varName}_cancel_lbl);`)

  lines.push(``)
  break
}

case 'Table': {
  lines.push(`lv_obj_t * ${varName} = lv_table_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_table_set_cell_value(${varName}, 0, 0, "A1");`)
  lines.push(`lv_table_set_cell_value(${varName}, 0, 1, "B1");`)
  lines.push(`lv_table_set_cell_value(${varName}, 1, 0, "A2");`)
  lines.push(`lv_table_set_cell_value(${varName}, 1, 1, "B2");`)

  // Theme styling
  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_MAIN);`)

  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 1, LV_PART_ITEMS);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface2}), LV_PART_ITEMS);`)
  lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_COVER, LV_PART_ITEMS);`)

  lines.push(``)
  break
}

case 'Scale': {
  lines.push(`lv_obj_t * ${varName} = lv_scale_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_scale_set_mode(${varName}, LV_SCALE_MODE_HORIZONTAL_BOTTOM);`)
  lines.push(`lv_scale_set_range(${varName}, 0, 100);`)
  lines.push(`lv_scale_set_total_tick_count(${varName}, 11);`)
  lines.push(`lv_scale_set_major_tick_every(${varName}, 2);`)
  lines.push(``)
  break
}

case 'Keyboard': {
  lines.push(`lv_obj_t * ${varName}_ta = lv_textarea_create(${parentVar});`)
  lines.push(`lv_textarea_set_one_line(${varName}_ta, true);`)
  lines.push(`lv_textarea_set_placeholder_text(${varName}_ta, "Keyboard input");`)
  lines.push(`lv_obj_set_pos(${varName}_ta, ${x}, ${Math.max(0, Number(y) - 55)});`)
  lines.push(`lv_obj_set_size(${varName}_ta, ${w}, 45);`)

  lines.push(`lv_obj_t * ${varName} = lv_keyboard_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
  lines.push(`lv_keyboard_set_textarea(${varName}, ${varName}_ta);`)
  lines.push(`lv_keyboard_set_mode(${varName}, LV_KEYBOARD_MODE_TEXT_LOWER);`)

  lines.push(``)
  break
}

case 'Calendar': {
  lines.push(`lv_obj_t * ${varName} = lv_calendar_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_calendar_set_today_date(${varName}, 2026, 6, 18);`)
  lines.push(`lv_calendar_set_showed_date(${varName}, 2026, 6);`)

  lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_text_color(${varName}, lv_color_hex(${palette.text}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), LV_PART_MAIN);`)
  lines.push(`lv_obj_set_style_border_width(${varName}, 2, LV_PART_MAIN);`)

  lines.push(``)
  break
}

case 'Chart': {
  lines.push(`lv_obj_t * ${varName} = lv_chart_create(${parentVar});`)
  lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
  lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)

  lines.push(`lv_chart_set_type(${varName}, LV_CHART_TYPE_LINE);`)
  lines.push(`lv_chart_set_point_count(${varName}, 7);`)

  lines.push(
    `lv_chart_series_t * ${varName}_ser = lv_chart_add_series(${varName}, lv_palette_main(LV_PALETTE_BLUE), LV_CHART_AXIS_PRIMARY_Y);`
  )

  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 10);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 30);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 20);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 50);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 40);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 70);`)
  lines.push(`lv_chart_set_next_value(${varName}, ${varName}_ser, 60);`)

  lines.push(`lv_chart_refresh(${varName});`)
  lines.push(``)
  break
}


      case 'Box':
        lines.push(`lv_obj_t * ${varName} = lv_obj_create(${parentVar});`)
        lines.push(`lv_obj_set_pos(${varName}, ${x}, ${y});`)
        lines.push(`lv_obj_set_size(${varName}, ${w}, ${h});`)
        lines.push(`lv_obj_set_style_radius(${varName}, 12, 0);`)
        lines.push(`lv_obj_set_style_bg_color(${varName}, lv_color_hex(${palette.surface}), 0);`)
        lines.push(`lv_obj_set_style_bg_opa(${varName}, LV_OPA_80, 0);`)
        lines.push(`lv_obj_set_style_border_color(${varName}, lv_color_hex(${palette.border}), 0);`)
        lines.push(`lv_obj_set_style_border_width(${varName}, 2, 0);`)
        lines.push(``)
        break

        default:
        break
    }
    

        if (child.children?.length) {
            buildLvglBlock(
        child,
        components,
        varName,
        lines,
        counter,
        palette,
        usedAssetSources,
        usedHookNames,
        userEventHooks,
      )
    }
  })
}

export const generateForgeUILvglCode = (
  components: IComponents,
  themeId: string = 'graphite',
  heroBackground?: any,
) => {
   const lines: string[] = []
  const usedAssetSources = new Set<string>()
  const usedHookNames = new Set<string>()
  const userEventHooks = new Set<string>()

  const previewPalette =
  FG_PREVIEW_PALETTES[themeId as ForgeThemeId] ||
  FG_PREVIEW_PALETTES.graphite

const fullscreenTextures = new Set([
  'ai_mesh',
  'ai_nexus',
  'creation',
  'nebula_core',
  'neon_horizon',
  'neural_core',
  'quantum_flow',
  'quantum_hex',
])

const textureId = previewPalette.texture

const palette = {
  ...previewPalette,

  bg: toLvHex(previewPalette.bg),
  surface: toLvHex(previewPalette.surface),
  surface2: toLvHex(previewPalette.surface2),

  border: toLvHex(previewPalette.border),

  text: toLvHex(previewPalette.text),

  accent: toLvHex(previewPalette.accent),

  textureAsset:
    textureId !== 'none'
      ? FG_TEXTURE_ASSETS[textureId]
      : undefined,

  textureMode: fullscreenTextures.has(textureId)
    ? 'fullscreen'
    : 'tile',
}

const heroAsset =
  heroBackground?.exportStatus === 'lvgl_ready' &&
  heroBackground?.lvgl &&
  heroBackground?.cFile
    ? {
        symbol: heroBackground.lvgl,
        source: heroBackground.cFile,
      }
    : undefined

// Export priority:
// 1. Selected AI/uploaded Hero
// 2. Theme texture
// 3. Solid theme colour
const backgroundAsset =
  heroAsset ||
  palette.textureAsset

const backgroundMode =
  heroAsset
    ? 'fullscreen'
    : palette.textureMode

  lines.push(`#include "90_Studio_Export.h"`)
  lines.push(`#include "lvgl.h"`)
  lines.push(`#include "20_RTC.h"`)
  lines.push(`#include "30_WIFI.h"`)
  lines.push(`#include "95_UserEvents.h"`)
  lines.push(`#include <stdbool.h>`)
  lines.push(`#include <stdio.h>`)
  lines.push(``)
  lines.push(`static lv_obj_t * fg_clock_label = NULL;`)
  lines.push(`static lv_obj_t * fg_wifi_label = NULL;`)
  lines.push(``)
    lines.push(`typedef struct`)
  lines.push(`{`)
  lines.push(`    const void * normal_src;`)
  lines.push(`    const void * pressed_src;`)
  lines.push(`    void (*clicked_cb)(void);`)
  lines.push(`    const char * event_name;`)
  lines.push(`} fg_interactive_button_data_t;`)
  lines.push(``)

  lines.push(`static void fg_interactive_button_event_cb(lv_event_t *event)`)
  lines.push(`{`)
  lines.push(`    lv_event_code_t code = lv_event_get_code(event);`)
  lines.push(`    lv_obj_t * button = lv_event_get_target(event);`)
  lines.push(``)
  lines.push(`    fg_interactive_button_data_t * data =`)
  lines.push(`        (fg_interactive_button_data_t *)lv_event_get_user_data(event);`)
  lines.push(``)
  lines.push(`    if (!button || !data)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    lv_obj_t * image = lv_obj_get_child(button, 0);`)
  lines.push(``)
  lines.push(`    if (!image)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    if (code == LV_EVENT_PRESSED)`)
  lines.push(`    {`)
  lines.push(`        lv_image_set_src(image, data->pressed_src);`)
  lines.push(`    }`)
 lines.push(`    else if (`)
lines.push(`        code == LV_EVENT_RELEASED ||`)
lines.push(`        code == LV_EVENT_PRESS_LOST`)
lines.push(`    )`)
lines.push(`    {`)
lines.push(`        lv_image_set_src(image, data->normal_src);`)
lines.push(`    }`)
lines.push(`    else if (code == LV_EVENT_CLICKED)`)
lines.push(`    {`)
lines.push(`        printf("[ForgeUI] %s clicked\\n", data->event_name);`)
lines.push(``)
lines.push(`        if (data->clicked_cb)`)
lines.push(`        {`)
lines.push(`            data->clicked_cb();`)
lines.push(`        }`)
lines.push(`    }`)
lines.push(`}`)
  lines.push(``)

  lines.push(`static void fg_clock_tick_cb(lv_timer_t *timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer);`)
  lines.push(``)
  lines.push(`    static bool show_colon = true;`)
  lines.push(``)
  lines.push(`    char time_buf[16];`)
  lines.push(`    fg_rtc_format_time(time_buf, sizeof(time_buf));`)
  lines.push(``)
  lines.push(`    if (!show_colon)`)
  lines.push(`    {`)
  lines.push(`        time_buf[2] = ' ';`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    show_colon = !show_colon;`)
  lines.push(``)
  lines.push(`    if (fg_clock_label)`)
  lines.push(`    {`)
  lines.push(`        lv_label_set_text(fg_clock_label, time_buf);`)
  lines.push(`    }`)
  lines.push(`}`)
  lines.push(``)

  lines.push(`static void fg_wifi_tick_cb(lv_timer_t *timer)`)
  lines.push(`{`)
  lines.push(`    LV_UNUSED(timer);`)
  lines.push(``)
  lines.push(`    if (!fg_wifi_label)`)
  lines.push(`    {`)
  lines.push(`        return;`)
  lines.push(`    }`)
  lines.push(``)
  lines.push(`    fg_wifi_pump();`)
  lines.push(``)
  lines.push(`    char wifi_buf[128];`)
  lines.push(`    snprintf(wifi_buf, sizeof(wifi_buf), "WIFI\\n%s\\nIP: %s", fg_wifi_status_text(), fg_wifi_ip_text());`)
  lines.push(`    lv_label_set_text(fg_wifi_label, wifi_buf);`)
  lines.push(`}`)
  lines.push(``)

  lines.push(`// ForgeUI LVGL Export Proof V1`)
  lines.push(`// Generated from ForgeUI Studio`)
  lines.push(``)
  lines.push(`void fg_studio_export_create(lv_obj_t *parent)`)
  lines.push(`{`)
  lines.push(`    // Background flavour: ${palette.name}`)
  lines.push(`    lv_obj_set_style_bg_color(lv_screen_active(), lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(lv_screen_active(), LV_OPA_COVER, 0);`)
  lines.push(`    lv_obj_set_style_bg_color(parent, lv_color_hex(${palette.bg}), 0);`)
  lines.push(`    lv_obj_set_style_bg_opa(parent, LV_OPA_COVER, 0);`)
  lines.push(``)

  if (
  backgroundAsset?.source &&
  backgroundAsset?.symbol
) {
  usedAssetSources.add(backgroundAsset.source)

  lines.push(`    LV_IMAGE_DECLARE(${backgroundAsset.symbol});`)

  if (backgroundMode === 'fullscreen') {
    lines.push(`    lv_obj_t * bg_texture_0 = lv_image_create(parent);`)
    lines.push(`    lv_image_set_src(bg_texture_0, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_0, 0, 0);`)
    lines.push(`    lv_obj_set_size(bg_texture_0, 1024, 600);`)
    lines.push(`    lv_obj_move_background(bg_texture_0);`)
  } else {
    lines.push(`    lv_obj_t * bg_texture_0 = lv_image_create(parent);`)
    lines.push(`    lv_image_set_src(bg_texture_0, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_0, 0, 0);`)

    lines.push(`    lv_obj_t * bg_texture_1 = lv_image_create(parent);`)
    lines.push(`    lv_image_set_src(bg_texture_1, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_1, 512, 0);`)

    lines.push(`    lv_obj_t * bg_texture_2 = lv_image_create(parent);`)
    lines.push(`    lv_image_set_src(bg_texture_2, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_2, 0, 512);`)

    lines.push(`    lv_obj_t * bg_texture_3 = lv_image_create(parent);`)
    lines.push(`    lv_image_set_src(bg_texture_3, &${backgroundAsset.symbol});`)
    lines.push(`    lv_obj_set_pos(bg_texture_3, 512, 512);`)

    lines.push(`    lv_obj_move_background(bg_texture_0);`)
    lines.push(`    lv_obj_move_background(bg_texture_1);`)
    lines.push(`    lv_obj_move_background(bg_texture_2);`)
    lines.push(`    lv_obj_move_background(bg_texture_3);`)
  }

  lines.push(``)
}

  const body: string[] = []

  const root =
    components.root ||
    Object.values(components).find((c: any) => c.parent === c.id) ||
    Object.values(components)[0]

  if (root) {
        buildLvglBlock(
      root,
      components,
      'parent',
      body,
      { value: 0 },
      palette,
      usedAssetSources,
      usedHookNames,
      userEventHooks,
    )
  }

  body.forEach(line => {
  lines.push(line ? `    ${line}` : ``)
})

lines.push(``)
lines.push(`    fg_clock_tick_cb(NULL);`)
lines.push(`    lv_timer_create(fg_clock_tick_cb, 1000, NULL);`)
lines.push(``)
lines.push(`    fg_wifi_tick_cb(NULL);`)
lines.push(`    lv_timer_create(fg_wifi_tick_cb, 1000, NULL);`)

lines.push(`}`)

    return {
    code: lines.join('\n'),
    assetSources: Array.from(usedAssetSources),
    userEventHooks: Array.from(userEventHooks),
  }
}
