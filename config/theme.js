import theme from '@emcasa/ui'
import {fas} from '@fortawesome/pro-solid-svg-icons'
import {fal} from '@fortawesome/pro-light-svg-icons'
import icons from './icons'

export default {
  ...theme,
  icons: {emcasa: icons, default: fas, light: fal}
}
