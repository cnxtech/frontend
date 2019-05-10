import styled from 'styled-components'
import * as colors from 'constants/colors'
import {HEADER_HEIGHT} from 'constants/dimensions'
import {headerMobileMedia} from 'constants/media'

export default styled.div`
  box-shadow: inset 3px -2px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 28px 40px;
  width: 380px;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  background: ${colors.offWhite};

  h6 {
    border-bottom: 1px solid ${colors.lightGray};
    color: ${colors.gray4a};
    font-size: 11px;
    margin-bottom: 40px;
    padding: 10px 40px;
    text-transform: uppercase;
    transform: translateX(-40px);
    width: 100%;
  }
  div {
    margin-bottom: 20px;
  }
  span {
    margin-left: 10px;
    color: ${colors.gray4a};
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    height: 15px;
    position: relative;
    top: 1px;
    width: 15px !important;
    path {
      fill: ${colors.green.medium};
    }
  }

  a {
    text-decoration: none;
    color: ${colors.blue.medium};
    float: left;
    margin: 20px 0;
    padding-left: 23px;
    &:hover {
      text-decoration: underline;
    }
  }

  @media ${headerMobileMedia} {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
`
