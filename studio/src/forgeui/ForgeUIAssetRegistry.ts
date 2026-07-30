export const FORGEUI_IMAGE_ASSETS = [
  {
    name: 'Settings',
    src: '/assets/icons/forgeui-settings-fi.svg',
    lvgl: 'fg_icon_settings_fi_48px',
    cFile: 'assets/icons/fg_icon_settings_fi_48px.c',
    width: 48,
    height: 48,
  },
  {
    name: 'About',
    src: '/assets/icons/48x48 ForgeUI Reactor Set/about-48px.svg',

    lvgl: 'fg_icon_about_48px',

    width: 48,
    height: 48,
  },
]

FORGEUI_IMAGE_ASSETS.forEach((asset: any) => {
  if (!asset.cFile && asset.lvgl) {
    asset.cFile = `assets/icons/${asset.lvgl}.c`
  }
})
