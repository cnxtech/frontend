import styled from 'styled-components'
import theme from '@emcasa/ui'
import Row from '@emcasa/ui-dom/components/Row'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {zIndexFilter} from 'constants/zIndex'

export const Wrapper = styled.div`
  width: 100%;
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.smoke};
  border-bottom: 1px solid ${theme.colors.smoke};
  position: sticky !important;
  width: auto !important;
  top: ${HEADER_HEIGHT}px;
  background-color: white;
  z-index: ${zIndexFilter};
`

export const Container = styled(Row)`
  justify-content: space-between;
  width: 100%;
  padding: ${theme.space[2]}px ${theme.space[4]}px;
  margin: auto;
  box-sizing: border-box;
`

export const FavCount = styled(Row)`
  align-items: center;

  svg {
    width: 15px;

    path {
      fill: ${theme.colors.white};
      stroke: ${theme.colors.pink};
      stroke-width: 40;
    }
  }

  p {
    display: flex;
    align-items: center;
    margin: 0 0 0 ${theme.space[3]}px;
  }

  span {
    margin-left: ${theme.space[1]}px;
  }
`
