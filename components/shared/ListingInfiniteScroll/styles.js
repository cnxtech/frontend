import styled from 'styled-components'
import View from '@emcasa/ui-dom/components/View'
import {themeGet} from 'styled-system'

const Container = styled(View)`
  padding: 0 ${themeGet('space.4')}px ${themeGet('space.4')}px;
`

const Footer = styled.footer`
  width: 100%;
  box-sizing: border-box;
  font-weight: 700;
  text-transform: uppercase;
  text-align: center;
  font-size: 0.7em;
  background-color: ${themeGet('colors.white')};
  cursor: pointer;

  a {
    display: block;
    width: 100%;
    height: 100%;
    color: inherit;
    text-decoration: none;
    box-sizing: border-box;
  }
`

export {Container, Footer}
