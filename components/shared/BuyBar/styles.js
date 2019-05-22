import styled from 'styled-components'
import theme from '@emcasa/ui'
import Row from '@emcasa/ui-dom/components/Row'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'

export const Wrapper = styled.div`
  width: 100%;
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.smoke};
`

export const Container = styled(Row)`
  justify-content: space-between;
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
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
