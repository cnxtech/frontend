import styled from 'styled-components'
import Row from '@emcasa/ui-dom/components/Row'
import Button from '@emcasa/ui-dom/components/Button'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {themeGet} from 'styled-system'

const CitiesWrapper = styled(Row)`
  flex-direction: column;
  width: 100%;
  background-color: ${themeGet('colors.white')};
  box-sizing: border-box;
  padding: 0 ${themeGet('space.4')}px 0 ${themeGet('space.4')}px;

  @media ${breakpoint.down('tablet')} {
    margin-bottom: ${themeGet('space.4')}px;
  }
`
const SecondaryButton = styled(Button)`
  border-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.lightGrey};
  background-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.white};
  color: ${({active, selected, disabled, link, theme: {colors}}) => {
    if (disabled) return colors.disabled
    else if (link) return colors.blue
    else if (active || selected) return colors.white
    else return colors.dark
  }};
`
const NeighborhoodButton = styled(SecondaryButton)`
  width: max-content;
  :hover {
    border: 1px solid ${themeGet('colors.blue')};
  }
`

const LinkButton = styled(SecondaryButton)`
  @media ${breakpoint.only('phone')} {
    display: none;
  }
`

const RowMobile = styled(Row)`
  display: none;
  @media ${breakpoint.only('phone')} {
    display: block;
  }
`

const LinkButtonMobile = styled(SecondaryButton)`
  @media ${breakpoint.only('phone')} {
    height: auto;
    display: block;
    margin: -${themeGet('space.2')}px 0 ${themeGet('space.4')}px 30px;
  }
`

export {
  CitiesWrapper,
  NeighborhoodButton,
  LinkButton,
  RowMobile,
  LinkButtonMobile,
  SecondaryButton
}
