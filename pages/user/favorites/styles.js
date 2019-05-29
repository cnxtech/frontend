import styled from 'styled-components'
import theme from 'config/theme'
import View from '@emcasa/ui-dom/components/View'
import Icon from '@emcasa/ui-dom/components/Icon'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import {Container} from 'components/listings/shared/ListingCard/styles'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import breakpoint from '@emcasa/ui/lib/styles/breakpoint'
import {MIN_CARD_WIDTH} from 'components/listings/shared/ListingCard/styles'
import {CircleStyle} from 'components/shared/Common/Buttons/Like/styles'

const CARD_GRID_MEDIA_QUERY = `only screen and (max-width: ${LISTING_MAX_WIDTH + (theme.space[4] * 2)}px)`
const BUTTON_LIKE_CIRCLE_HEIGHT = 60
const PROFILE_TABWRAPPER_MAX_WIDTH = 710

export const NoListingsContainer = styled(Row)`
  display: flex;
  flex-direction: column;
  margin: 0 ${theme.space[4]}px;

  ${Text} {
    display: block;
    margin: ${theme.space[1]}px 0;
  }

  ${Text} + ${Button} {
    margin: ${theme.space[5]}px 0 ${theme.space[2]}px;
  }
`

export const CardContainer = styled(View)`
  max-width: ${LISTING_MAX_WIDTH}px;
  margin: auto;

  @media ${CARD_GRID_MEDIA_QUERY} {
    margin: 0 ${theme.space[4]}px;
  }
`

export const ProfileList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${MIN_CARD_WIDTH}px, 1fr));
  grid-gap: ${theme.space[4]}px;

  margin: 0 auto ${theme.space[5]}px auto;

  @media screen and ${breakpoint.down('tablet')} {
    grid-template-columns: repeat(auto-fill, minmax(${Math.round((PROFILE_TABWRAPPER_MAX_WIDTH / 3) - (theme.space[2] * 2))}px, 1fr));
  }

  ${Container} {
    margin: 0;
    width: 100%;
  }
`

export const HeartContainer = styled.div`
  ${CircleStyle}
  position: relative;
  height: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
  width: ${BUTTON_LIKE_CIRCLE_HEIGHT}px;
`

export const HeartIcon = styled(Icon)`
  position: absolute;
  top: 20px;
  left: 20px;
`