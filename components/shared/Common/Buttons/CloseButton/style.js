import styled from 'styled-components'
import theme from '@emcasa/ui'
import Button from 'components/shared/Common/Buttons'

export default styled(Button)`
  z-index: 5;
  position: absolute;
  top: ${theme.space[2]}px;
  right: ${theme.space[2]}px;
`