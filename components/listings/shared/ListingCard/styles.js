import styled from 'styled-components'
import theme from '@emcasa/ui'
import Text from '@emcasa/ui-dom/components/Text'
import {ListingSliderElementsStyles} from 'components/listings/show/ListingSlider/styles'
export const MIN_CARD_WIDTH = 280
export const LISTING_CARD_IMAGE_HEIGHT = 164

export const Wrapper = styled.article`
  position: relative;
  width: 100%;

  > button {
    z-index: 2;

    svg {
      transition: transform 0.45s cubic-bezier(0.4, 0.2, 0, 1);
    }

    &:hover {
      svg {
        transform: scale(1.12);
      }
    }
  }
`

export const Container = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  backface-visibility: hidden;
  border: 1px solid ${theme.colors.lightGrey};
  border-radius: ${theme.space[2]}px;
  background-color: ${theme.colors.white};
  transition: border .25s, box-shadow .25s ease-in;

  :hover {
    border-color: ${theme.colors.pink};
    box-shadow: 0 0 2px ${theme.colors.pink};
  }

  ${ListingSliderElementsStyles}

  img {
    box-sizing: border-box;
    object-fit: cover;
    width: 100%;
    height: ${LISTING_CARD_IMAGE_HEIGHT}px;
  }
`

export const Title = styled.h5`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  z-index: -1;
`

export const PaginationTextWrapper = styled.div`
  z-index: 3;
  position: absolute;
  top: ${theme.space[2]}px;
  left: ${theme.space[2]}px;
  padding: ${theme.space[1]}px ${theme.space[2]}px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.4);
`

export const PaginationText = styled(Text)`
  margin: 0;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes[1]}px;
  font-weight: ${theme.fontWeights[2]};
`

export const Label = styled(Text)`
  z-index: 3;
  position: absolute;
  top: ${LISTING_CARD_IMAGE_HEIGHT - theme.space[2]}px;
  left: ${theme.space[2]}px;
  transform: translateY(-100%);
  margin: 0;
  padding: ${theme.space[1]}px ${theme.space[2]}px;
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes[1]}px;
  border-radius: 4px;
  background-color: ${theme.colors.green};
`
