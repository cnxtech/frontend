import styled from 'styled-components'
import * as colors from 'constants/colors'
import theme from '@emcasa/ui'
import Button from '@emcasa/ui-dom/components/Button'

const LegacyButton = styled.button`
  background-color: ${colors.blue.medium};
  border: 1px solid ${colors.blue.darker};
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  padding: 10px 20px 12px;
  text-decoration: none;
  transition: background-color 0.1s ease;
  transform: 0.25;
  &:hover {
    background-color: ${colors.blue.dark};
    text-decoration: none;
  }
`

export const BaseButton = styled(LegacyButton)`
  font-size: 14px;
  font-weight: 600;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 0px rgba(38, 38, 38, 0.2);
  padding: 7px 12px 9px;
`

export default styled(Button)`
  border: ${({noBorder}) => noBorder ? 'none' : null};

  svg {
    color: ${({iconColor}) => iconColor ? iconColor : null};
    fill: ${({iconColor}) => iconColor ? iconColor : null};
    margin-right: ${({iconMarginRight}) => iconMarginRight ? `${theme.space[2]}px` : null};
    display: inline-block;
    width: 1em;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
    font-size: inherit;
  }
`
