import styled from 'styled-components'
import {HEADER_HEIGHT, HEADER_SEARCH_HEIGHT} from 'constants/dimensions'

export const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 ;
  padding-top: ${(props) =>
    props.transparentHeader
      ? null
      : `${props.search ? HEADER_SEARCH_HEIGHT : HEADER_HEIGHT}px`};
  box-sizing: border-box;
`
