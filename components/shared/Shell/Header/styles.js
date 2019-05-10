import styled, {keyframes} from 'styled-components'
import theme from 'config/theme'
import Col from '@emcasa/ui-dom/components/Col'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {zIndexHeader} from 'constants/zIndex'
import {
  HEADER_HEIGHT,
  SEARCH_HEIGHT,
  HEADER_LOGO_WIDTH,
  HEADER_LOGO_WITH_TEXT_WIDTH
} from 'constants/dimensions'

export const MAX_HEADER_HEIGHT = 76

export default styled.header`
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: ${props => props.search ? SEARCH_HEIGHT : HEADER_HEIGHT}px;
  padding: ${theme.space[2]}px ${theme.space[4]}px;
  box-sizing: border-box;
  transition: background 0.25s;
  background: ${(props) => (!props.transparent || props.sticky ? 'white' : null)};

  @media screen and ${breakpoint.up('desktop')} {
    align-items: center;
    height: auto;
  }
`

export const Wrapper = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: ${zIndexHeader};
  width: 100vw;
`

export const LogoWrapper = styled.h1`
  flex: 0 0 ${({hideText}) => hideText ? `${HEADER_LOGO_WIDTH}px` : `${HEADER_LOGO_WITH_TEXT_WIDTH}px`};
  margin: 0;
`

export const LabelLogo = styled.span`
  position: absolute;
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  padding: 0;
  border: 0;
`

export const NavButton = styled.button`
  display: none;
  cursor: pointer;
  background: transparent;
  border: none;
  box-shadow: none;
  color: gray;
  font-size: 17px;
  font-weight: ${theme.fontWeights[2]};
  transform: scale(1.5, 1);
  padding: ${theme.space[1]}px;

  @media ${breakpoint.down('tablet')} {
    display: ${(props) => (props.visible ? 'block' : 'none')};
  }
`

export const SearchWrapper = styled(Col)`
  flex: 1 1 100%;
  margin-left: ${theme.space[4]}px;
  max-width: 560px;
`

export const Nav = styled.nav`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(${({visible}) => visible ? '0' : '100vw'});
  display: flex;
  flex-direction: column;
  width: 70vw;
  height: 100vh;
  padding-top: ${theme.buttonHeight[1] + (theme.space[2] * 2)}px;
  box-sizing: border-box;
  background: white;
  transition: transform ${({visible}) => visible ? '.85s' : '.6s'} cubic-bezier(.4, .2, 0, 1) ${({visible}) => visible ? '.1s' : '0s'};

  @media screen and ${breakpoint.up('desktop')} {
    position: initial;
    right: initial;
    flex-direction: row;
    justify-content: flex-end;
    transform: translateX(0);
    background: transparent;
    height: auto;
    width: auto;
    padding-top: 0;
  }

  button {
    @media screen and ${breakpoint.up('desktop')} {
      display: none;
    }
  }

  a {
    text-decoration: none;
  }
`

export const MenuItem = styled.a`
  display: flex;
  align-items: center;
  min-height: 48px;
  border-left: 7px solid transparent;
  padding: 0 0 0 ${theme.space[4]}px;
  font-size: ${theme.fontSizes[1]}px;
  font-weight: ${theme.fontWeights[2]};
  color: ${theme.colors.dark};
  cursor: pointer;

  @media screen and ${breakpoint.up('desktop')} {
    border-left: none;
    font-weight: ${theme.fontWeights[0]};
    padding: 0 ${theme.space[4] * 2}px;
  }

  &:hover,
  &.active {
    border-left: 7px solid ${theme.colors.pink};

    @media screen and ${breakpoint.up('desktop')} {
      border-left: none;
      border-bottom: 1px solid ${theme.colors.pink};
    }
  }

  .icon {
    display: block;
    margin-right: 40px;

    @media screen and ${breakpoint.up('desktop')} {
      display: none;
    }
  }
`

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  pointer-events: ${({visible}) => visible ? null : 'none'};
  opacity: ${({visible}) => visible ? .8 : 0};
  transition: opacity ${({visible}) => visible ? '.3s' : '.2s'} linear ${({visible}) => visible ? '0s' : '.2s'};
  z-index: 1;

  @media ${breakpoint.up('desktop')} {
    display: none;
  }
`

export const Search = styled.div`
  margin-left: 20px;
  width: 100%;

  @media ${breakpoint.down('tablet')} {
    width: 80%;
  }
`
