import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'

const Container = styled(Row)`
  z-index: 1;
`

const Separator = styled.hr`
  border: 0.5px solid ${themeGet('colors.lightGrey')};
  margin: 0 ${themeGet('space.4')}px;
`

export {Separator, Container}
