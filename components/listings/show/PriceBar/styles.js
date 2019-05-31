import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'

export const Container = styled(Row)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${theme.space[4]}px;
  box-sizing: border-box;

  > ${Text} {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 0;

    @media screen and ${breakpoint.up('desktop')} {
      justify-content: flex-start;
      white-space: nowrap;
    }

    span {
      margin-left: ${theme.space[1]}px;
    }
  }
`
