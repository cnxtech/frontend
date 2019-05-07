import styled from 'styled-components'
import theme from 'config/theme'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import {zIndexModal} from 'constants/zIndex'
import {listingDetailsMaxWidth} from 'constants/dimensions'

export default styled.div`
  z-index: ${zIndexModal + 5};
  position: fixed;
  top: 0;
  left: 0;
  display: ${props => props.open ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  > button {

  @media screen and ${breakpoint.down('tablet')} {
      top: ${theme.space[1]}px;
      right: 0;
    }
  }
`

export const Wrapper = styled(Row)`
  z-index: 2;
  position: relative;

  @media screen and ${breakpoint.up('desktop')} {
    max-width: ${listingDetailsMaxWidth}px;
    max-height: 65vh;
  }
`

export const Header = styled.div`
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and ${breakpoint.up('desktop')} {
    width: calc(100% - ${theme.space[4]}px);
    max-width: ${listingDetailsMaxWidth}px;
    margin: 0 auto;
    padding-bottom: ${theme.space[2]}px;
    box-sizing: border-box;
  }
`

export const HeaderLeft = styled.div`
  display: flex;
`

export const HeaderRight = styled.div`
  display: none;

  @media screen and ${breakpoint.up('desktop')} {
    display: block;
  }

  ${Button} {
    margin-left: ${theme.space[2]}px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const Title = styled(Text)`
  margin: ${theme.space[2]}px 0 ${theme.space[2]}px ${theme.space[4]}px;

  @media screen and ${breakpoint.up('desktop')} {
    position: relative;
    margin: 0;
  }
`

export const Content = styled.div`
  flex: 1 1 100%;
  width: 100%;

  @media screen and ${breakpoint.up('desktop')} {
    width: calc(100% - ${theme.space[4]}px);
    margin: 0 auto;
    box-sizing: border-box;
  }
`

export const Background = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.white};
`