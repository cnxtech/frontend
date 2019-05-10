import styled from 'styled-components'
import {mobileMedia} from 'constants/media'
import * as colors from 'constants/colors'
import {HEADER_SEARCH_HEIGHT} from 'constants/dimensions'

export default styled.div`
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  ${({horizontal}) =>
    horizontal &&
    `
      @media ${mobileMedia} {
        flex-direction: row;
        overflow-y: hidden;
        height: 100%;
      }
    `};
`

export const Footer = styled.footer`
  width: 100%;
  box-sizing: border-box;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.7em;
  background-color: ${colors.offWhite};
  cursor: pointer;
  a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 25px;
    color: inherit;
    text-decoration: none;
    box-sizing: border-box;
  }

  ${({horizontal}) =>
    horizontal &&
    `
      @media ${mobileMedia} {
        width: auto;
        height: 100%;

        a{
          display: flex;
          justify-content: center;
          align-items: center;
        }

        background-color: white;
      }
    `};
`

export const Wrapper = styled.div`
  opacity: .2;
  box-sizing: border-box;
  position: relative;

  @media ${mobileMedia} {
    height: calc(100vh - ${HEADER_SEARCH_HEIGHT}px);
  }

  ${({horizontal}) =>
    horizontal &&
    `
    @media ${mobileMedia} {
      height: 100%;
      display: flex;
      align-items: center;
    }
  `};
`

export const Title = styled.h1`
  box-sizing: border-box;
  margin: 0;
  font-weight: 400;
  font-size: 24px;
  width: 100%;
  z-index: 1;
  padding: 15px 10px 15px 10px;
  @media ${mobileMedia} {
    font-size: 20px;
  }
  ${({horizontal}) =>
    horizontal &&
    `
    @media ${mobileMedia} {
      display: none;
    }
  `};
`
