import styled from 'styled-components'
import theme from 'config/theme'
import {backgroundColor} from 'styled-system'
import {breakpoint} from '@emcasa/ui/lib/styles'
import {listingDetailsMaxWidth} from 'constants/dimensions'
import Button from '@emcasa/ui-dom/components/Button'

export const Wrapper = styled.div`
  background-color: ${theme.colors.smoke};
`

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: ${listingDetailsMaxWidth}px;
  margin: 0 auto;
  padding: ${theme.space[4]}px;
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
    padding: 0 0 ${theme.space[4]}px;
  }
`

export const MoreButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`
