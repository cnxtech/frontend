import styled from 'styled-components'
import theme from 'config/theme'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {themeGet} from 'styled-system'

const CitiesWrapper = styled(Row)`
  flex-direction: column;
  width: 100%;
  background-color: ${theme.colors.white};
  box-sizing: border-box;
  padding: 0 ${themeGet('space.4')}px 0 ${themeGet('space.4')}px;

  @media ${breakpoint.down('tablet')} {
    margin-bottom: ${theme.space[4]}px;
  }
`

const NeighborhoodButton = styled(Button)`
  width: max-content;
  :hover {
    border: 1px solid ${theme.colors.pink};
  }
`

const Separator = styled.hr`
  border: 0.5px solid ${theme.colors.lightGrey};
`

export {CitiesWrapper, NeighborhoodButton, Separator}
