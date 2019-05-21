import styled from 'styled-components'
import {themeGet} from 'styled-system'
import Button from '@emcasa/ui-dom/components/Button'
const ButtonFilter = styled(Button)`
  border-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.lightGrey};
  background-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.white};
  color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.white};
  color: ${({active, selected, disabled, link, theme: {colors}}) => {
    if (disabled) return colors.disabled
    else if (link) return colors.blue
    else if (active || selected) return colors.white
    else return colors.dark
  }};
  :hover {
    border: 1px solid ${themeGet('colors.blue')};
  }
`

export {ButtonFilter}
