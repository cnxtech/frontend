import styled from 'styled-components'
import theme from '@emcasa/ui'
import Filters from '@emcasa/ui-dom/components/Filters'
import {
  TypesFilter,
  PriceFilter,
  AreaFilter,
  RoomsFilter,
  GarageSpotsFilter
} from '@emcasa/ui-dom/components/Filters/ListingFilters'
import {zIndexFilter} from 'constants/zIndex'
import {HEADER_SEARCH_HEIGHT} from 'constants/dimensions'

const ListingFilter = styled(function ListingFilter(props) {
  return (
    <Filters {...props} zIndex={zIndexFilter}>
      <TypesFilter />
      <PriceFilter />
      <AreaFilter />
      <RoomsFilter />
      <GarageSpotsFilter />
    </Filters>
  )
})`
  position: sticky !important;
  width: auto !important;
  top: ${HEADER_SEARCH_HEIGHT}px;
  padding: 0 ${theme.space[4]}px;
  background-color: white;
`

ListingFilter.defaultProps = {
  initialValues: {
    price: PriceFilter.initialValue,
    area: AreaFilter.initialValue
  }
}

export default ListingFilter
