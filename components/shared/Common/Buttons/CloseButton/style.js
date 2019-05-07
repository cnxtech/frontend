import styled from 'styled-components'
import theme from '@emcasa/ui'
import Button from 'components/shared/Common/Buttons'
import {zIndexModal} from 'constants/zIndex'

export default styled(Button)`
  z-index: ${zIndexModal};
  position: absolute;
  top: ${theme.space[2]}px;
  right: ${theme.space[2]}px;
`