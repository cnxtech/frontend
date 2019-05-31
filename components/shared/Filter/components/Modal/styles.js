import styled from 'styled-components'
import View from '@emcasa/ui-dom/components/View'
import {zIndexFilterModal} from 'constants/zIndex'
import {themeGet} from 'styled-system'
import {MODAL_CONTENT_WIDTH} from 'constants/dimensions'
import {breakpoint} from '@emcasa/ui/lib/styles'

export const Background = styled(View)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndexFilterModal};
`

export const Container = styled(View)`
  float: right;
  border-top: 1px solid ${themeGet('colors.smoke')};
  display: flex;
  flex-direction: column;
  ${({justifyContent}) =>
    justifyContent
      ? `justify-content: ${justifyContent};`
      : ''} position: relative;
  cursor: default;
  background-color: white;
  width: ${MODAL_CONTENT_WIDTH}px;
  @media screen and ${breakpoint.only('phone')} {
    width: 100%;
  }
  ${({padding}) => (padding ? 'padding: 0 20px;' : '')};
`
