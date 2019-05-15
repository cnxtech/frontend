import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {LISTING_MAX_WIDTH} from 'constants/dimensions'
import Button from '@emcasa/ui-dom/components/Button'

export const Wrapper = styled.section`
  background-color: ${({highlight}) => highlight ? theme.colors.smoke : null};
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
  margin: 0 auto;
  padding: ${theme.space[4]}px ${theme.space[4]}px ${theme.space[5] * 2}px;
  box-sizing: border-box;
`

export const ListingsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
`

export const MoreButtonWrapper = styled.div`
  margin: ${theme.space[4]}px 0 0;

  @media screen and ${breakpoint.up('desktop')} {
    max-width: 320px;
    margin: ${theme.space[4]}px auto 0;
  }
`

export const MoreButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`
