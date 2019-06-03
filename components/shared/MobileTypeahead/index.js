import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'

const MobileTypeaheadContainer = styled(Row)`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 5;
  background-color: ${themeGet('colors.white')};
`

export default MobileTypeaheadContainer
