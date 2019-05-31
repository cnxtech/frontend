import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import {LISTING_BUTTONSBAR_HEIGHT} from 'constants/dimensions'
import {zIndexHeader} from 'constants/zIndex'

export const Container = styled(Row)`
  z-index: ${zIndexHeader - 1};
  position: fixed;
  left: 0;
  bottom: 0;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${LISTING_BUTTONSBAR_HEIGHT}px;
  padding: 0 ${theme.space[4]}px;
  box-sizing: border-box;
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.smoke};

  @media screen and ${breakpoint.up('desktop')} {
    position: initial;
    height: auto;
    width: auto;
    padding: 0 ${theme.space[4]}px 0 0;
    background: none;
    border: none;
  }

  > button {
    margin-left: ${theme.space[2]}px;

    &:first-child {
      margin-left: 0;
    }

    @media screen and ${breakpoint.up('desktop')} {
      margin-left: ${theme.space[4]}px;
    }
  }
`

export const ContactButton = styled(Button)`
  flex: 1;

  @media screen and ${breakpoint.up('desktop')} {
    flex: 0 1 auto;
  }
`
