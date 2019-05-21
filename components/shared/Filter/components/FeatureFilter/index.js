import {Fragment} from 'react'
import PropTypes from 'prop-types'
import theme from '@emcasa/ui'
import Filters from '@emcasa/ui-dom/components/Filters'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import {
  TypesFilter,
  PriceFilter,
  AreaFilter,
  RoomsFilter,
  GarageSpotsFilter
} from '@emcasa/ui-dom/components/Filters/ListingFilters'
import {zIndexFilter} from 'constants/zIndex'
import Text from '@emcasa/ui-dom/components/Text'
import Button from '@emcasa/ui-dom/components/Button'

const ListingFilter = (props) => {
  return (
    <Row flexDirection="column" px={4}>
      <Col>
        <Row flexDirection="row" alignItems="center">
          <Fragment>
            <Text>Características do imóvel</Text>
            <Button link fontSize={theme.fontSizes[1]} onClick={() => {}}>Ver Todos</Button>
          </Fragment>
        </Row>
      </Col>
      <Col>
        <Filters
          onSubmit={props.onChange}
          zIndex={zIndexFilter}
          initialValues={props.initialValues}
          values={props.values}
        >
          <TypesFilter />
          <PriceFilter />
          <AreaFilter />
          <RoomsFilter />
          <GarageSpotsFilter />
        </Filters>
      </Col>
    </Row>
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
