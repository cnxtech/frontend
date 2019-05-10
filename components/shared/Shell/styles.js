import styled, { css } from 'styled-components'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {MAX_HEADER_HEIGHT} from 'components/shared/Shell/Header/styles'

export default styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${props => props.search ? `calc(100vh - ${MAX_HEADER_HEIGHT}px)` : `calc(100vh - ${HEADER_HEIGHT}px)`};
  margin-top: ${(props) => props.transparentHeader ? null : `${props.search ? MAX_HEADER_HEIGHT : HEADER_HEIGHT}px`};
  box-sizing: border-box;
`

export const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
`
