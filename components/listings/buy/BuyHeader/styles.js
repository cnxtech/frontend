import theme from '@emcasa/ui'
import styled from 'styled-components'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'

export const BUYHEADER_TITLE_MAX_WIDTH = 650

export const Wrapper = styled.div`
  background: ${theme.colors.white};
`

export const Container = styled(Row)`
  flex-direction: column;
  align-items: center;
  justifycontent: center;
  text-align: center;
  padding: ${theme.space[5]}px ${theme.space[4]}px ${theme.space[5] * 2}px;

`

export const Title = styled(Text)`
  padding: 0;
  margin: 0 auto ${theme.space[4]}px;
  max-width: ${BUYHEADER_TITLE_MAX_WIDTH}px;

  @media screen and ${breakpoint.up('desktop')} {
    padding: 0 ${theme.space[6]}px;
  }
`
