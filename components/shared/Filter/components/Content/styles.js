import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {MODAL_FOOTER_HEIGHT} from 'constants/dimensions'

const Container = styled(Row)`
  z-index: 1;
`

const Separator = styled.hr`
  border: 0.5px solid ${themeGet('colors.lightGrey')};
  margin: 0 ${themeGet('space.4')}px;
  @media screen and ${breakpoint.only('phone')} {
    margin-bottom: ${MODAL_FOOTER_HEIGHT}px;
  }
`

const Footer = styled(Row)`
  justify-content: flex-end;
  @media screen and ${breakpoint.only('phone')} {
    width: 100%;
    height: ${MODAL_FOOTER_HEIGHT}px;
    position: fixed;
    bottom: 0;
    justify-content: center;
    box-sizing: border-box;
    background: ${themeGet('colors.white')};
  }
`

export {Separator, Container, Footer}
