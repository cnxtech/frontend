import {Fragment} from 'react'
import PropTypes from 'prop-types'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {
  TypesFilter,
  PriceFilter,
  AreaFilter,
  RoomsFilter,
  GarageSpotsFilter
} from '@emcasa/ui-dom/components/Filters/ListingFilters'
import Breakpoint from '@emcasa/ui-dom/components/Breakpoint'
import {zIndexFilter} from 'constants/zIndex'
import Text from '@emcasa/ui-dom/components/Text'
import FilterForm from './components/FilterForm'

const ListingFilter = (props) => {
  return (
    <Breakpoint up="tablet">
      <Row flexDirection="column" px={4}>
        <Col>
          <Row flexDirection="row" alignItems="center">
            <Fragment>
              <Text fontSize="small" fontWeight="bold">
                Características do imóvel
              </Text>
            </Fragment>
          </Row>
        </Col>
        <Col>
          <FilterForm
            onSubmit={props.onChange}
            zIndex={zIndexFilter}
            initialValues={props.initialValues}
            values={props.values}
            width="100%"
            startExpanded
          >
            <TypesFilter />
            <PriceFilter />
            <AreaFilter />
            <RoomsFilter />
            <GarageSpotsFilter />
          </FilterForm>
        </Col>
      </Row>
    </Breakpoint>
  )
}

ListingFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  values: PropTypes.object
}

ListingFilter.defaultProps = {
  initialValues: {
    price: PriceFilter.initialValue,
    area: AreaFilter.initialValue
  }
}

export default ListingFilter
