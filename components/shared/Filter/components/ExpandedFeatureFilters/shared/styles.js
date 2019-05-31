import styled from 'styled-components'
import Button from '@emcasa/ui-dom/components/Button'

const FilterButton = styled(Button)`
  font-size: 13px;
  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
  transition: ${['color', 'border-color', 'opacity']
    .map((prop) => `${prop} 200ms ease-in-out`)
    .join()};

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
export {FilterButton}
