import * as FiIcons from 'react-icons/fi'
import * as MdIcons from 'react-icons/md'
import * as AiIcons from 'react-icons/ai'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import * as IoIcons from 'react-icons/io5'

const iconsList = {
  ...FiIcons,
  ...MdIcons,
  ...AiIcons,
  ...FaIcons,
  ...BsIcons,
  ...IoIcons,
}

export const ICON_COUNT = Object.keys(iconsList).length

export const ICON_NAMES = Object.keys(iconsList)

export default iconsList