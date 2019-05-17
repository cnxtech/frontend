import {Component} from 'react'
import PropTypes from 'prop-types'
import Text from '@emcasa/ui-dom/components/Text'
import ListingCard from 'components/listings/shared/ListingCard'
import ListingsGrid from 'components/listings/shared/ListingsGrid'
import {Container} from './styles'

class ListingFeedGrid extends Component {
  render() {
    const {children, currentUser, listings, title} = this.props
    return (
      <Container>
        <Text as="h3" color="grey" fontWeight="bold">
          {title}
        </Text>
        <ListingsGrid>
          {listings.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              currentUser={currentUser}
              favorited={[]}
              related
            />
          ))}
        </ListingsGrid>
        {children}
      </Container>
    )
  }
}

ListingFeedGrid.propTypes = {
  listings: PropTypes.array,
  currentUser: PropTypes.object,
  title: PropTypes.string
}

export default ListingFeedGrid
