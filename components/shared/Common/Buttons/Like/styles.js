import styled from 'styled-components'
import * as colors from 'constants/colors'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Button from '@emcasa/ui-dom/components/Button'

export const BUTTON_LIKE_CIRCLE_HEIGHT = 40
export const BUTTON_LIKE_CIRCLE_ICON_HEIGHT = 25

export const TextButton = styled(Button)`
  svg {
    width: 15px;

    path {
      fill: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.white)};
      stroke: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.dark)};
      fill-opacity: ${({favorite}) => (favorite ? 1 : 0)};
      stroke-width: 40;
    }
  }
`

export const Circle = styled(Button)`
  position: absolute;
  cursor: pointer;
  right: ${theme.space[3]}px;
  top: ${({top}) => top ? `${top}px` : `0px`};
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  height: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  border-radius: 50%;
  box-shadow: 0 6px 16px 0 rgba(38, 38, 38, 0.15);

  svg {
    width: ${BUTTON_LIKE_CIRCLE_ICON_HEIGHT}px;
    text-shadow: 2px 2px 3px #f00;
    text-shadow: 2px 2px 3px #f00;

    path {
      text-shadow: 2px 2px 3px #f00;
      fill: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.white)};
      stroke: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.dark)};
      fill-opacity: ${({favorite}) => (favorite ? 1 : 0)};
      stroke-width: 60;
    }
  }
`