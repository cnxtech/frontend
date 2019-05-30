import styled, {css} from 'styled-components'
import theme from '@emcasa/ui'
import Button from '@emcasa/ui-dom/components/Button'

export const BUTTON_LIKE_CIRCLE_HEIGHT = 40
export const BUTTON_LIKE_CIRCLE_ICON_HEART_WIDTH = 21
export const BUTTON_LIKE_CIRCLE_ICON_HEART_HEIGHT = 19

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

export const CircleStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  height: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  border-radius: 50%;
  box-shadow: 0 6px 16px 0 rgba(38, 38, 38, 0.15);

  svg {
    width: ${BUTTON_LIKE_CIRCLE_ICON_HEART_WIDTH}px;
    height: ${BUTTON_LIKE_CIRCLE_ICON_HEART_HEIGHT}px;
    text-shadow: 2px 2px 3px #f00;

    path {
      text-shadow: 2px 2px 3px #f00;
      fill: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.white)};
      stroke: ${({favorite}) => (favorite ? theme.colors.pink : theme.colors.dark)};
      fill-opacity: ${({favorite}) => (favorite ? 1 : 0)};
      stroke-width: 40;
    }
  }
`

export const Circle = styled(Button)`
  ${CircleStyle}
  position: absolute;
  cursor: pointer;
  right: ${theme.space[3]}px;
  top: ${({top}) => (top ? `${top}px` : '0px')};
`
