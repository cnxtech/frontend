import styled, {css} from 'styled-components'
import theme from 'config/theme'
import {HEADER_HEIGHT, LISTING_BUTTONSBAR_HEIGHT} from 'constants/dimensions'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Button from '@emcasa/ui-dom/components/Button'
import MoonLoader from 'react-spinners/MoonLoader'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import {zIndexModal} from 'constants/zIndex'
import Text from '@emcasa/ui-dom/components/Text'

export const SPINNER_SIZE = 40
export const LISTINGSLIDER_HEIGHT = 454
export const LISTINGSLIDER_OFFSET = (HEADER_HEIGHT + LISTING_BUTTONSBAR_HEIGHT)
const ARROW_SIZE = 48

export const ListingSliderElementsStyles = css`
  > button {
    @media screen and ${breakpoint.down('tablet')} {
      top: ${theme.space[1]}px;
      right: 0;
    }
  }

  .slick-list {
    width: 100%;
    margin: 0 auto;

    @media screen and ${breakpoint.up('desktop')} {
      width: ${({isFullScreen}) => isFullScreen ? `calc(100% - ${ARROW_SIZE * 2}px)` : null};
    }
  }

  .slick-list,
  .slick-track,
  .slick-slide > div {
    height: 100%;
  }

  .slick-track {
    display: flex !important;
  }

  .images-slider {
    z-index: 2;
    position: relative;
    width: 100%;
    height: ${({isFullScreen}) => isFullScreen ? null : '100%'};
    background: ${theme.colors.white};

    @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
      overflow: hidden;
    }

    @media screen and ${breakpoint.up('desktop')} {
      max-width: ${({isFullScreen}) => isFullScreen ? `${LISTING_MAX_WIDTH}px` : null};
      max-height: ${({isFullScreen}) => isFullScreen ? '65vh' : null};
      box-sizing: ${({isFullScreen}) => isFullScreen ? 'border-box' : null};
    }
  }

  img {
    z-index: 2;
    position: relative;
  }

  .slider-image {
    width: 100%;
    height: 100%;
    object-fit: ${({isFullScreen}) => isFullScreen ? 'contain' : 'cover'};
    box-sizing: border-box;

    @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
      object-fit: cover;
    }

    @media screen and ${breakpoint.up('desktop')} {
      object-fit: cover;
    }
  }

  .slick-dots {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex !important;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 50%;
    margin: 0;
    padding: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.2) 55%,
      rgba(0, 0, 0, 0.50) 80%,
      rgba(0, 0, 0, 0.75) 100%
    );
    list-style: none;
    text-align: center;
    vertical-align: middle;

    li {
      position: relative;
      display: inline-block;
      margin: 0;
      padding: 0;
      cursor: pointer;
    }

    li button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      font-size: 0;
      line-height: 0;
      background: 0;
      border: none;
      outline: 0;

      &::before {
        content: '';
        border-radius: 100%;
        width: 5px;
        height: 5px;
        background-color: ${theme.colors.white};
        transition: background-color 0.5s,
          transform 0.5s cubic-bezier(0.4, 0.2, 0, 1);
      }
    }

    li.slick-active button::before {
      background-color: ${theme.colors.pink};
      transform: scale(1.5);
    }
  }
`

export default styled.div`
  z-index: ${({isFullScreen}) => isFullScreen ? zIndexModal : null};
  position: ${({isFullScreen}) => isFullScreen ? 'fixed' : 'relative'};
  top: ${({isFullScreen}) => isFullScreen ? '0' : null};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${({isFullScreen}) => isFullScreen ? '100%' : `calc(62vh - ${LISTINGSLIDER_OFFSET}px)`};
  max-width: 100%;
  min-height: ${({isFullScreen}) => isFullScreen ? null : `${LISTINGSLIDER_HEIGHT / 2}px`};
  overflow: hidden;
  box-sizing: border-box;

  ${ListingSliderElementsStyles}

  @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
    justify-content: flex-start;
  }

  @media screen and ${breakpoint.up('desktop')} {
    height: ${({isFullScreen}) => isFullScreen ? null : '45vh'};
    max-height: ${({isFullScreen}) => isFullScreen ? null : '540px'};
    min-height: ${({isFullScreen}) => isFullScreen ? null : '300px'};
  }
`

export const SpinnerWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
`

export const Spinner = styled(MoonLoader).attrs(({theme}) => {
  return {
    color: theme.colors.pink,
    size: SPINNER_SIZE
  }
})``

export const CarouselItem = styled.div`
  height: 100%;
  cursor: ${({isFullScreen}) => (isFullScreen ? null : 'pointer')};
  outline: none;
  box-sizing: border-box;
  position: relative;
  background: ${theme.colors.white};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  &::before {
    z-index: 3;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-left: 1px solid ${theme.colors.white};
    border-right: 1px solid ${theme.colors.white};
    content: '';
    box-sizing: border-box;
  }
`

export const Arrow = styled(Button)`
  z-index: 3;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({left}) => (!left ? 'right: 0' : 'left: 0')};
  width: ${ARROW_SIZE}px;
  height: ${ARROW_SIZE}px;
  color: white;
  cursor: pointer;
  padding: 0;
  background: 0;
  border: 0;
  cursor: ${({disabled}) => (disabled ? 'default' : null)};
  opacity: ${({disabled}) => disabled ? '0.5' : null};

  &:hover {
    svg {
      background: 0;
    }
  }

  @media screen and ${breakpoint.up('desktop')} {
    color: ${({isFullScreen}) => isFullScreen ? theme.colors.dark : theme.colors.white};
  }

  svg {
    display: block;
    width: 100% !important;
    height: 100%;
    filter: drop-shadow(1px 1px 4px ${theme.colors.dark});

    @media screen and ${breakpoint.up('desktop')} {
      color: ${({isFullScreen}) => isFullScreen ? theme.colors.dark : theme.colors.white};
      filter: ${({isFullScreen}) => isFullScreen ? 'initial' : `drop-shadow(1px 1px 4px ${theme.colors.dark})`};
    }
  }
`

export const Header = styled.div`
  display: ${({isFullScreen}) => (isFullScreen ? 'flex' : 'none')};
  z-index: 2;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: ${theme.space[2]}px;

  @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
    margin-bottom: 0;
    justify-content: flex-start;
  }

  @media screen and ${breakpoint.up('desktop')} {
    justify-content: space-between;
    max-width: ${({isFullScreen}) => isFullScreen ? `${LISTING_MAX_WIDTH - (ARROW_SIZE * 2)}px` : null};
    width: calc(100% - ${ARROW_SIZE * 2}px);
    margin-bottom: ${theme.space[4]}px;
  }
`

export const Title = styled(Text)`
  margin: ${theme.space[2]}px 0 ${theme.space[2]}px ${theme.space[4]}px;

  @media screen and ${breakpoint.up('desktop')} {
    margin: 0;
  }
`

export const TitleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
    position: ${({isFullScreen}) => (isFullScreen ? 'relative' : null)};
  }

  @media screen and ${breakpoint.up('desktop')} {
    position: initial;
    top: initial;
    left: initial;
  }
`

export const OpenMatterportButtonWrapper = styled.div`
  z-index: 5;
  position: ${({isFullScreen}) => (isFullScreen ? 'relative' : 'absolute')};
  top: ${({isFullScreen}) => (isFullScreen ? null : `${theme.space[2]}px`)};
  left: ${({isFullScreen}) => (isFullScreen ? null : '50%')};
  transform: ${({isFullScreen}) => (isFullScreen ? null : 'translateX(-50%)')};

  @media screen and ${breakpoint.down('tablet')} {
    display: ${({isFullScreen}) => (isFullScreen ? 'none' : null)};
  }

  @media screen and ${breakpoint.up('desktop')} {
    position: relative;
    left: initial;
    transform: initial;
    margin: 0;
  }
`

export const PaginationTextWrapper = styled.div`
  display: ${({isFullScreen}) => (isFullScreen ? null : 'none')};
  z-index: 5;
  position: relative;
  margin-top: ${theme.space[2]}px;

  @media screen and ${breakpoint.down('tablet')} and (orientation: landscape) {
    display: ${({isFullScreen}) => (isFullScreen ? 'none' : null)};
  }

  @media screen and ${breakpoint.up('desktop')} {
    position: relative;
    left: initial;
    transform: initial;
    max-width: ${({isFullScreen}) => isFullScreen ? `${LISTING_MAX_WIDTH - (ARROW_SIZE * 2)}px` : null};
    width: calc(100% - ${ARROW_SIZE * 2}px);
    margin: ${theme.space[4]}px ${ARROW_SIZE + theme.space[1]}px 0;
  }
`

export const PaginationText = styled(Text)`
  color: ${theme.colors.dark};
  margin: 0;

  @media screen and ${breakpoint.up('desktop')} {
    color: ${theme.colors.dark};
    text-shadow: initial;
    text-align: right;
  }
`
