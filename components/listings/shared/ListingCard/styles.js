import styled, {css} from 'styled-components'
import theme from '@emcasa/ui'

export const MIN_CARD_WIDTH = 280
export const LISTING_CARD_IMAGE_HEIGHT = 140

export const Wrapper = styled.article`
  position: relative;
  width: 100%;

  > button {
    z-index: 2;

    svg {
      transition: transform .45s cubic-bezier(.4, .2, 0, 1);
    }

    &:hover {
      svg {
        transform: scale(1.12);
      }
    }
  }
`

export const CardStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  border: 1px solid ${theme.colors.lightGrey};
  border-radius: ${theme.space[2]}px;
  background-color: ${theme.colors.white};

  img {
    box-sizing: border-box;
    object-fit: cover;
    width: 100%;
    height: ${LISTING_CARD_IMAGE_HEIGHT}px;
  }
`

export const Container = styled.a`
  ${CardStyle}
  cursor: pointer;
  transition: border .25s, box-shadow .25s ease-in;

  :hover {
    border-color: ${theme.colors.pink};
    box-shadow: 0 0 2px ${theme.colors.pink};
  }
`

export const Title = styled.h5`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  z-index: -1;
`
