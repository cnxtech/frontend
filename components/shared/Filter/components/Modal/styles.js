import styled from 'styled-components'
import View from '@emcasa/ui-dom/components/View'
import {zIndexModal} from 'constants/zIndex'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {themeGet} from 'styled-system'

export const Background = styled(View)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${zIndexModal};
`

export const Container = styled(View)`
  border-top: 1px solid ${themeGet('colors.smoke')};
  margin-top: ${HEADER_HEIGHT}px;
  display: flex;
  flex-direction: column;
  ${({justifyContent}) => justifyContent ? `justify-content: ${justifyContent};` : ``}
  position: relative;
  cursor: default;
  background-color: white;
  width: 100%;
  z-index: 1;
  ${({padding}) => padding ? `padding: 0 20px;` : ``}
`
