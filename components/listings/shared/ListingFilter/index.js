import Filters from '@emcasa/ui-dom/components/Filters'
import {
  TypesFilter,
  PriceFilter,
  AreaFilter,
  RoomsFilter,
  GarageSpotsFilter
} from '@emcasa/ui-dom/components/Filters/ListingFilters'
import {zIndexFilter} from 'constants/zIndex'

function ListingFilter(props) {
  return (
    <Filters {...props} zIndex={zIndexFilter}>
      <TypesFilter />
      <PriceFilter />
      <AreaFilter />
      <RoomsFilter />
      <GarageSpotsFilter />
    </Filters>
  )
}

ListingFilter.defaultProps = {
  initialValues: {
    price: PriceFilter.initialValue,
    area: AreaFilter.initialValue
  }
}

export default ListingFilter
