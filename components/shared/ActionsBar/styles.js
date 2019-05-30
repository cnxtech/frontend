import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Row from '@emcasa/ui-dom/components/Row'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {zIndexFilter} from 'constants/zIndex'

export const Wrapper = styled.div`
  width: 100%;
  background: ${themeGet('colors.white')};
  border-top: 1px solid ${themeGet('colors.smoke')};
  border-bottom: 1px solid ${themeGet('colors.smoke')};
  position: sticky !important;
  width: auto !important;
  top: ${HEADER_HEIGHT}px;
  background-color: white;
  z-index: ${zIndexFilter};
`

export const Container = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: ${themeGet('space.1')}px ${themeGet('space.4')}px;
  margin: auto;
  box-sizing: border-box;
`

export const FavCount = styled(Row)`
  cursor: ${({authenticated}) => authenticated ? `pointer` : `default`};
  align-items: center;
`
