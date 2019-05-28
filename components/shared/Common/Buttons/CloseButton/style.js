import styled from 'styled-components'
import theme from '@emcasa/ui'
import Button from 'components/shared/Common/Buttons'
import {zIndexModal} from 'constants/zIndex'

export default styled(Button)`
  z-index: ${({zIndex}) => (zIndex >= 0 ? zIndex : zIndexModal)};
  position: absolute;
  top: ${theme.space[2]}px;
  right: ${theme.space[2]}px;
`
