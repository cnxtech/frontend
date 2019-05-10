import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import {
  HEADER_HEIGHT,
  LISTING_BUTTONSBAR_HEIGHT
} from 'constants/dimensions'

export const Wrapper = styled(Row)`
  align-items: center;
  justify-content: center;
  padding: ${theme.space[4]}px ${theme.space[4]}px;
  border-top: 1px solid ${theme.colors.lightGrey};
  border-bottom: 1px solid ${theme.colors.lightGrey};
  box-sizing: border-box;

  @media screen and ${breakpoint.up('desktop')} {
    z-index: 6;
    position: fixed;
    left: 0;
    top: ${HEADER_HEIGHT}px;
    width: 100%;
    height: ${LISTING_BUTTONSBAR_HEIGHT}px;
    padding: 0 ${theme.space[4]}px;
    background: ${theme.colors.white};
  }

  ${Text} {
    display: flex;
    justify-content: space-between;
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

export const Container = styled('div')`
  width: 100%;
`
