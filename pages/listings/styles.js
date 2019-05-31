import styled from 'styled-components'
import theme from '@emcasa/ui'
import {breakpoint} from '@emcasa/ui/lib/styles'
import Row from '@emcasa/ui-dom/components/Row'
import {HEADER_HEIGHT, LISTING_MAX_WIDTH} from 'constants/dimensions'
import {zIndexHeader} from 'constants/zIndex'

export const ShowContainer = styled(Row)`
  position: relative;
  flex-direction: column-reverse;
`

export const BarsWrapper = styled(Row)`
  z-index: ${zIndexHeader - 1};
  position: sticky;
  top: ${HEADER_HEIGHT}px;
  justify-content: center;
  width: 100%;
  padding: ${theme.space[4]}px 0;
  box-sizing: border-box;
  background-color: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.lightGrey};
  border-bottom: 1px solid ${theme.colors.lightGrey};
`

export const BarsContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
  max-width: ${LISTING_MAX_WIDTH}px;
`
