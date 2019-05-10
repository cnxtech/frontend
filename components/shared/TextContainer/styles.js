import styled from 'styled-components'
import {mobileMedia} from 'constants/media'
import {HEADER_HEIGHT} from 'constants/dimensions'
export default styled.div`
  margin: 0 auto 100px;
  min-height: calc(100vh - ${HEADER_HEIGHT + 220}px);
  padding-top: 40px;
  width: 700px;

@media ${mobileMedia} {
    width: calc(100vw - 40px);
`
