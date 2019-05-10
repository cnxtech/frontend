import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import {LISTING_BUTTONSBAR_HEIGHT} from 'constants/dimensions'

export const ShowContainer = styled(Row)`
  position: relative;
  flex-direction: column-reverse;

  @media screen and ${breakpoint.up('desktop')} {
    margin-top: ${LISTING_BUTTONSBAR_HEIGHT}px;
  }
`
