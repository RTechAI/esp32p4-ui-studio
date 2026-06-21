import React, { memo } from 'react'
import {
  Box,
  Button,
  LightMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuButtonProps,
  ButtonProps,
  Portal,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FaImages, FaPalette, FaRobot } from 'react-icons/fa'

const CustomMenuButton: React.FC<
  MenuButtonProps | ButtonProps
> = React.forwardRef((props, ref: React.Ref<HTMLLinkElement>) => {
  // @ts-ignore
  return <MenuButton as={Button} {...props} />
})

CustomMenuButton.displayName = 'CustomMenuButton'

const HeaderMenu = () => {
  const openAssetManager = () => {
    window.dispatchEvent(new CustomEvent('forgeui-open-asset-manager'))
  }

  const openThemeManager = () => {
    window.dispatchEvent(new CustomEvent('forgeui-open-theme-manager'))
  }
  
  const openAiPlayground = () => {
  window.dispatchEvent(new CustomEvent('forgeui-open-ai-playground'))
}

  return (
    <Menu placement="bottom">
      <CustomMenuButton
        rightIcon={<ChevronDownIcon path="" />}
        size="xs"
        variant="ghost"
        colorScheme="gray"
      >
        Editor
      </CustomMenuButton>

      <Portal>
        <LightMode>
          <MenuList bg="white" zIndex={999}>
            <MenuItem onClick={openAssetManager}>
              <Box mr={2} as={FaImages} />
              Asset Manager
            </MenuItem>

            <MenuItem onClick={openThemeManager}>
              <Box mr={2} as={FaPalette} />
              Theme Manager
            </MenuItem>

            <MenuItem onClick={openAiPlayground}>
            <Box mr={2} as={FaRobot} />
             AI Playground
            </MenuItem>

          </MenuList>
        </LightMode>
      </Portal>
    </Menu>
  )
}

export default memo(HeaderMenu)