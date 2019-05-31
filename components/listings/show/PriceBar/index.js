import {Component} from 'react'
import PropTypes from 'prop-types'
import Text from '@emcasa/ui-dom/components/Text'
import {getListingPrice} from 'lib/listings'
import {Container} from './styles'

class PriceBar extends Component {
  render() {
    const {listing} = this.props
    return (
      <Container>
        <Text fontSize={[1, null, null, 2]}>
          {`${listing.type || 'Imóvel'} à venda por `}
          <Text inline color="pink" fontSize={[1, null, null, 2]}>
            {getListingPrice(listing)}
          </Text>
        </Text>
      </Container>
    )
  }
}

PriceBar.propTypes = {
  listing: PropTypes.object.isRequired
}

export default PriceBar
