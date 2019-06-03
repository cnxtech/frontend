import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {MODAL_FOOTER_HEIGHT, MODAL_CONTENT_WIDTH} from 'constants/dimensions'
import {zIndexFooterFilterModal} from 'constants/zIndex'

const Container = styled(Row)`
  background: ${themeGet('colors.snow')};
  @media screen and ${breakpoint.only('phone')} {
    min-height: 100vh;
  }
`

const Separator = styled.div`
  margin: 0 ${themeGet('space.4')}px;
  margin-bottom: ${MODAL_FOOTER_HEIGHT}px;
`

const Footer = styled(Row)`
  justify-content: flex-end;
  background: ${themeGet('colors.white')};
  width: 100%;
  height: ${MODAL_FOOTER_HEIGHT}px;
  position: fixed;
  bottom: 0;
  justify-content: center;
  box-sizing: border-box;
  width: ${MODAL_CONTENT_WIDTH}px;
  z-index: ${zIndexFooterFilterModal};
  border-top: 2px solid ${themeGet('colors.lightGrey')};
  @media screen and ${breakpoint.only('phone')} {
    width: 100%;
  }
`

const ApplyButton = styled(Button)`
  border-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.lightGrey};
  background-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.white};
  flex-grow: 1;
`

export {Separator, Container, Footer, ApplyButton}
