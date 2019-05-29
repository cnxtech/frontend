import styled from 'styled-components'
import theme from 'config/theme'
import View from '@emcasa/ui-dom/components/View'
import Row from '@emcasa/ui-dom/components/Row'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'
import {Container} from 'components/listings/shared/ListingCard/styles'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import breakpoint from '@emcasa/ui/lib/styles/breakpoint'
import {MIN_CARD_WIDTH} from 'components/listings/shared/ListingCard/styles'

const CARD_GRID_MEDIA_QUERY = `only screen and (max-width: ${LISTING_MAX_WIDTH + (theme.space[4] * 2)}px)`
export const PROFILE_TABWRAPPER_MAX_WIDTH = 710
export const PROFILE_INITIALVIEW_MAX_WIDTH = 414

export const Icon = styled.div`
  background-image: url(${props => props.icon});
  background-repeat: no-repeat;
  background-size: cover;
  width: 70px;
  height: 70px;
`

export const InitialView = styled(Row)`
  width: 100%;
  margin: ${theme.space[6]}px auto ${theme.space[4]}px;
  max-width: ${({maxWidth}) => maxWidth ? maxWidth : `${PROFILE_INITIALVIEW_MAX_WIDTH}px`};

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
