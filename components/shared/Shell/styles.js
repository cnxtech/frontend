import styled, { css } from 'styled-components'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {HEADER_SEARCH_HEIGHT} from 'constants/dimensions'

export default styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${props => props.search ? `calc(100vh - ${HEADER_SEARCH_HEIGHT}px)` : `calc(100vh - ${HEADER_HEIGHT}px)`};
  margin-top: ${(props) => props.transparentHeader ? null : `${props.search ? HEADER_SEARCH_HEIGHT : HEADER_HEIGHT}px`};
  box-sizing: border-box;
`

export const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
`
