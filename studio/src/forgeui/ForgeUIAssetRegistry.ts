export const FORGEUI_IMAGE_ASSETS = [
  {
    name: 'About',
    src: '/assets/icons/48x48 ForgeUI Reactor Set/about-48px.svg',
    lvgl: 'fg_icon_about_48px',
  },
]

FORGEUI_IMAGE_ASSETS.forEach((asset: any) => {
  if (!asset.cFile && asset.lvgl) {
    asset.cFile = `assets/icons/${asset.lvgl}.c`
  }
})