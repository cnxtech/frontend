import styled from 'styled-components'
import {themeGet} from 'styled-system'
import PulseLoader from 'react-spinners/PulseLoader'
import {BUTTON_LIKE_CIRCLE_HEIGHT} from 'components/shared/Common/Buttons/Like/styles'

const CARD_WIDTH = 200
const CARD_IMAGE_HEIGHT = 100

export default styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${CARD_WIDTH}px;
  min-height: 100px;
  img {
    object-fit: cover;
    width: 100%;
    height: ${CARD_IMAGE_HEIGHT}px;
  }
  span {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

export const Body = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: ${themeGet('space.2')}px;
`
export const Spinner = styled(PulseLoader).attrs({
  spinnerColor: ({color, theme}) => theme.colors[color] || color
})``

Spinner.defaultProps = {
  color: 'pink',
  size: 10
}

export const ButtonContainer = styled.div`
  position: absolute;
  height: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  width: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  top: ${CARD_IMAGE_HEIGHT - BUTTON_LIKE_CIRCLE_HEIGHT - 5}px;
  right: 5px;
  transform: scale(0.8);
  button {
    top: 0;
    right: 0;
  }
`
