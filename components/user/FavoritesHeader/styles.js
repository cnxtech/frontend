import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'

export const Main = styled(Row)`
  justify-content: space-between;
  border-top: 1px solid ${themeGet('colors.lightGrey')};
  border-bottom: 1px solid ${themeGet('colors.lightGrey')};
`
