import {css} from 'styled-components'

const buttonsBlue = css`
  border-color: ${({active, selected, disabled, theme: {colors}}) =>
    (active || selected) && !disabled ? colors.blue : colors.lightGrey};
  background-color: ${({active, disabled, theme: {colors}}) =>
    active && !disabled ? colors.blue : colors.white};
`

export {buttonsBlue}
