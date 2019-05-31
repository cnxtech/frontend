import styled from 'styled-components'
import theme from '@emcasa/ui'
import Row from '@emcasa/ui-dom/components/Row'
import {zIndexFilter} from 'constants/zIndex'

export const Wrapper = styled.div`
  z-index: ${zIndexFilter};
  top: 0;
  position: sticky;
  width: 100%;
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.smoke};
  border-bottom: 1px solid ${theme.colors.smoke};
`

export const Container = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: ${theme.space[2]}px ${theme.space[4]}px;
  margin: auto;
  box-sizing: border-box;
`
export const FavCount = styled(Row)`
  cursor: ${({authenticated}) => authenticated ? `pointer` : `default`};
  align-items: center;
`
