import styled from 'styled-components'
import {themeGet} from 'styled-system'
import classnames from 'classnames'
import PulseLoader from 'react-spinners/PulseLoader'

const CARD_WIDTH = 200
const CARD_IMAGE_HEIGHT = 100

export default styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: ${CARD_WIDTH}px;
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

export const Spinner = styled(PulseLoader).attrs({
  spinnerColor: ({color, theme}) => theme.colors[color] || color
})``
