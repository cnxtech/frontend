import {themeGet} from 'styled-system'
import styled from 'styled-components'
import Row from '@emcasa/ui-dom/components/Row'
import {MIN_CARD_WIDTH} from 'components/listings/shared/ListingCard/styles'

const ListingsGrid = styled(Row)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${MIN_CARD_WIDTH}px, 1fr));
  grid-gap: ${themeGet('space.4')}px;
`
export default ListingsGrid
